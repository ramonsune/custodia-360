/**
 * WEBHOOK STRIPE - Flujo E2E Onboarding 1€
 *
 * Maneja eventos de Stripe para provisionar entidad, usuario, roles y notificaciones
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyWebhookSignature, getCheckoutSession } from '@/lib/stripe-products'
import { syncOnboardingToHolded } from '@/lib/holded-client'
import {
  logAuditEvent,
  logWebhookReceived,
  logEntityCreated,
  logUserCreated,
  logRoleGranted,
  logEmailsSent,
  logHoldedSyncOk,
  logError
} from '@/lib/audit-logger'
import { Resend } from 'resend'

// Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Resend Client
const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET_LIVE

    if (!webhookSecret) {
      console.error('[WEBHOOK] ❌ STRIPE_WEBHOOK_SECRET no configurado')
      return NextResponse.json({
        error: 'Webhook secret no configurado'
      }, { status: 400 })
    }

    if (!signature) {
      return NextResponse.json({ error: 'Firma de Stripe faltante' }, { status: 400 })
    }

    const rawBody = await request.text()

    // Verificar firma del webhook
    const event = verifyWebhookSignature(rawBody, signature, webhookSecret)

    if (!event) {
      console.error('[WEBHOOK] ❌ Firma inválida')
      return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
    }

    console.log('[WEBHOOK] ✅ Evento recibido:', event.type, event.id)

    // Manejar eventos
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event)
        break

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event)
        break

      case 'charge.succeeded':
        await handleChargeSucceeded(event)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event)
        break

      default:
        console.log('[WEBHOOK] ℹ️ Evento no manejado:', event.type)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('[WEBHOOK] ❌ Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * PROVISIONING COMPLETO: checkout.session.completed
 */
async function handleCheckoutCompleted(event: any) {
  const session = event.data.object
  const processId = session.metadata?.process_id

  if (!processId) {
    console.error('[WEBHOOK] ❌ No process_id en metadata')
    return
  }

  console.log('[WEBHOOK] 💳 Checkout completado:', session.id, 'Process:', processId)

  try {
    // Log audit
    await logWebhookReceived(processId, event.type, event.id)

    // 1. Obtener proceso de onboarding
    const { data: process, error: processError } = await supabaseAdmin
      .from('onboarding_process')
      .select('*')
      .eq('id', processId)
      .single()

    if (processError || !process) {
      await logError(processId, 'process.not_found', 'Proceso no encontrado en BD')
      return
    }

    // Verificar idempotencia
    if (process.status === 'provisioned' || process.status === 'trained') {
      console.log('[WEBHOOK] ℹ️ Proceso ya provisionado, ignorando')
      return
    }

    // 2. Actualizar proceso con status=paid
    await supabaseAdmin
      .from('onboarding_process')
      .update({
        status: 'paid',
        stripe_customer_id: session.customer,
        stripe_payment_intent_id: session.payment_intent,
        updated_at: new Date().toISOString()
      })
      .eq('id', processId)

    await logAuditEvent({
      processId,
      eventType: 'payment.confirmed',
      level: 'INFO',
      payload: { sessionId: session.id, amount: session.amount_total / 100 }
    })

    // 3. PROVISIONAR ENTIDAD
    const entityData = {
      name: process.entity_name,
      cif: process.cif,
      email: process.email,
      phone: process.phone,
      address: process.address,
      status: 'active',
      plan: process.plan_key || 'BASIC',
      stripe_customer_id: session.customer,
      created_at: new Date().toISOString()
    }

    const { data: entity, error: entityError } = await supabaseAdmin
      .from('entities')
      .insert(entityData)
      .select()
      .single()

    if (entityError || !entity) {
      await logError(processId, 'entity.creation_failed', entityError?.message || 'Error desconocido', entityError)
      throw new Error('Error creando entidad')
    }

    console.log('[WEBHOOK] ✅ Entidad creada:', entity.id)
    await logEntityCreated(processId, entity.id, entity.name)

    // 4. CREAR USUARIO EN SUPABASE AUTH
    // Recuperar contraseña del proceso (ya hasheada en bcrypt, necesitamos la original)
    // NOTA: Para producción, deberías enviar password sin hashear en metadata o generar una temporal
    const tempPassword = `Temp${Math.random().toString(36).slice(2, 10)}!`

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: process.email,
      password: tempPassword, // Contraseña temporal - usuario debe cambiarla
      email_confirm: true,
      user_metadata: {
        entity_id: entity.id,
        entity_name: entity.name,
        role: 'FORMACION'
      }
    })

    if (authError || !authUser.user) {
      await logError(processId, 'user.creation_failed', authError?.message || 'Error creando usuario', authError)
      throw new Error('Error creando usuario Auth')
    }

    console.log('[WEBHOOK] ✅ Usuario creado:', authUser.user.id)
    await logUserCreated(processId, authUser.user.id, process.email)

    // 5. CREAR ROL EN entity_user_roles
    const { error: roleError } = await supabaseAdmin
      .from('entity_user_roles')
      .insert({
        entity_id: entity.id,
        user_id: authUser.user.id,
        role: 'FORMACION',
        granted_at: new Date().toISOString()
      })

    if (roleError) {
      await logError(processId, 'role.grant_failed', roleError.message, roleError)
      console.error('[WEBHOOK] ⚠️ Error asignando rol (continuando):', roleError)
    } else {
      await logRoleGranted(processId, authUser.user.id, 'FORMACION')
    }

    // 6. CREAR TRAINING PROGRESS
    const { error: trainingError } = await supabaseAdmin
      .from('training_progress')
      .insert({
        user_id: authUser.user.id,
        entity_id: entity.id,
        steps_completed: 0,
        total_steps: 5,
        is_completed: false
      })

    if (trainingError) {
      console.error('[WEBHOOK] ⚠️ Error creando training_progress:', trainingError)
    }

    // 7. ACTUALIZAR PROCESO con IDs
    await supabaseAdmin
      .from('onboarding_process')
      .update({
        entity_id: entity.id,
        delegate_user_id: authUser.user.id,
        status: 'provisioned',
        updated_at: new Date().toISOString()
      })
      .eq('id', processId)

    // 8. ENVIAR EMAILS
    await sendOnboardingEmails({
      processId,
      email: process.email,
      entityName: entity.name,
      tempPassword
    })

    // 9. SINCRONIZAR CON HOLDED
    if (process.env.HOLDED_API_KEY) {
      const holdedResult = await syncOnboardingToHolded({
        entityName: entity.name,
        email: process.email,
        cif: process.cif,
        phone: process.phone,
        address: process.address,
        stripeChargeId: session.payment_intent,
        processId
      })

      if (holdedResult.contactId && holdedResult.invoiceId) {
        await supabaseAdmin
          .from('onboarding_process')
          .update({
            holded_contact_id: holdedResult.contactId,
            holded_invoice_id: holdedResult.invoiceId
          })
          .eq('id', processId)

        await logHoldedSyncOk(processId, holdedResult.contactId, holdedResult.invoiceId)
      }
    }

    console.log('[WEBHOOK] ✅ Provisioning completado para:', process.email)

  } catch (error: any) {
    console.error('[WEBHOOK] ❌ Error en provisioning:', error)
    await logError(processId, 'provisioning.failed', error.message, { stack: error.stack })

    // Marcar proceso como error
    await supabaseAdmin
      .from('onboarding_process')
      .update({ status: 'error' })
      .eq('id', processId)
  }
}

/**
 * Envío de emails (cliente + soporte)
 */
async function sendOnboardingEmails(params: {
  processId: string
  email: string
  entityName: string
  tempPassword: string
}) {
  const { processId, email, entityName, tempPassword } = params
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL || 'https://www.custodia360.es'
  const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.NOTIFY_EMAIL_FROM || 'noreply@custodia360.es'
  const supportEmail = 'rsune@teamsml.com'

  try {
    // Email 1: Cliente - Bienvenida con acceso formación
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Bienvenido/a a Custodia360 — Acceso a Formación',
      html: `
        <h2>¡Bienvenido/a a Custodia360!</h2>
        <p>Tu alta en <strong>${entityName}</strong> se ha completado exitosamente.</p>

        <h3>Acceso a la plataforma:</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contraseña temporal:</strong> ${tempPassword}</p>
        <p><strong>Enlace:</strong> <a href="${baseUrl}/login">${baseUrl}/login</a></p>

        <h3>Próximos pasos:</h3>
        <ol>
          <li>Inicia sesión con las credenciales anteriores</li>
          <li>Cambia tu contraseña en el primer acceso</li>
          <li>Completa los 5 pasos de formación LOPIVI</li>
          <li>Accede a tu panel de Delegado Principal</li>
        </ol>

        <p>La formación te llevará aproximadamente 20-30 minutos.</p>

        <p>Si tienes alguna duda, contacta con soporte: <a href="mailto:soporte@custodia360.es">soporte@custodia360.es</a></p>

        <p>¡Gracias por confiar en Custodia360!</p>
      `
    })

    // Email 2: Soporte - Nueva contratación
    await resend.emails.send({
      from: fromEmail,
      to: supportEmail,
      subject: `[Custodia360] Nueva contratación 1€ — ${entityName}`,
      html: `
        <h2>Nueva contratación registrada</h2>
        <p><strong>Entidad:</strong> ${entityName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Process ID:</strong> ${processId}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>

        <p><a href="${baseUrl}/admin/auditoria?processId=${processId}">Ver timeline de auditoría</a></p>
      `
    })

    await logEmailsSent(processId, [email, supportEmail])
    console.log('[WEBHOOK] ✅ Emails enviados')

  } catch (error: any) {
    console.error('[WEBHOOK] ⚠️ Error enviando emails:', error)
    await logError(processId, 'emails.failed', error.message)
  }
}

/**
 * Idempotencia: payment_intent.succeeded
 */
async function handlePaymentIntentSucceeded(event: any) {
  const paymentIntent = event.data.object
  console.log('[WEBHOOK] 💰 Payment Intent succeeded:', paymentIntent.id)

  // Buscar proceso por payment_intent_id
  const { data: process } = await supabaseAdmin
    .from('onboarding_process')
    .select('id, status')
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .single()

  if (process) {
    await logAuditEvent({
      processId: process.id,
      eventType: 'payment_intent.succeeded',
      level: 'INFO',
      payload: { paymentIntentId: paymentIntent.id }
    })

    if (process.status === 'provisioned') {
      console.log('[WEBHOOK] ℹ️ Proceso ya provisionado')
    }
  }
}

/**
 * Registro de charge
 */
async function handleChargeSucceeded(event: any) {
  const charge = event.data.object
  console.log('[WEBHOOK] 💳 Charge succeeded:', charge.id)

  const { data: process } = await supabaseAdmin
    .from('onboarding_process')
    .select('id')
    .eq('stripe_payment_intent_id', charge.payment_intent)
    .single()

  if (process) {
    await supabaseAdmin
      .from('onboarding_process')
      .update({ stripe_charge_id: charge.id })
      .eq('id', process.id)

    await logAuditEvent({
      processId: process.id,
      eventType: 'charge.succeeded',
      level: 'INFO',
      payload: { chargeId: charge.id }
    })
  }
}

/**
 * Error de pago
 */
async function handlePaymentFailed(event: any) {
  const paymentIntent = event.data.object
  console.error('[WEBHOOK] ❌ Payment failed:', paymentIntent.id)

  const { data: process } = await supabaseAdmin
    .from('onboarding_process')
    .select('id, email, entity_name')
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .single()

  if (process) {
    await logError(
      process.id,
      'payment.failed',
      paymentIntent.last_payment_error?.message || 'Pago rechazado',
      paymentIntent.last_payment_error
    )

    // Email a soporte
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@custodia360.es'
    await resend.emails.send({
      from: fromEmail,
      to: 'rsune@teamsml.com',
      subject: `[ERROR] Pago fallido - ${process.entity_name}`,
      html: `
        <h2>Pago fallido</h2>
        <p><strong>Entidad:</strong> ${process.entity_name}</p>
        <p><strong>Email:</strong> ${process.email}</p>
        <p><strong>Error:</strong> ${paymentIntent.last_payment_error?.message || 'Desconocido'}</p>
        <p><strong>Process ID:</strong> ${process.id}</p>
      `
    })
  }
}
