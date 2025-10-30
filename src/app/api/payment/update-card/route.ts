import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

/**
 * POST: Crear Setup Intent para actualizar tarjeta
 * Recibe token de payment_tokens y crea una sesión de Stripe Setup
 */
export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Token requerido',
      }, { status: 400 })
    }

    console.log('🔐 [UPDATE CARD] Verificando token:', token)

    // Verificar token
    const { data: paymentToken, error: tokenError } = await supabase
      .from('payment_tokens')
      .select('*, entities(*)')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (tokenError || !paymentToken) {
      console.error('❌ [UPDATE CARD] Token inválido:', tokenError)
      return NextResponse.json({
        success: false,
        error: 'Token inválido o expirado',
      }, { status: 400 })
    }

    // Verificar expiración
    const expiresAt = new Date(paymentToken.expires_at)
    if (expiresAt < new Date()) {
      console.error('⏰ [UPDATE CARD] Token expirado')
      return NextResponse.json({
        success: false,
        error: 'Token expirado',
      }, { status: 400 })
    }

    const entity = paymentToken.entities

    if (!entity.stripe_customer_id) {
      console.error('❌ [UPDATE CARD] No hay customer ID en Stripe')
      return NextResponse.json({
        success: false,
        error: 'Error de configuración del cliente',
      }, { status: 500 })
    }

    // Crear Setup Intent de Stripe
    const setupIntent = await stripe.setupIntents.create({
      customer: entity.stripe_customer_id,
      payment_method_types: ['card'],
      usage: 'off_session', // Para cobros futuros sin usuario presente
      metadata: {
        entity_id: entity.id,
        token: token,
        purpose: 'update_payment_method',
      },
    })

    console.log('✅ [UPDATE CARD] Setup Intent creado:', setupIntent.id)

    return NextResponse.json({
      success: true,
      client_secret: setupIntent.client_secret,
      entity_name: entity.nombre_entidad,
    })

  } catch (error: any) {
    console.error('❌ [UPDATE CARD] Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Error al crear sesión de actualización',
    }, { status: 500 })
  }
}

/**
 * PUT: Confirmar actualización de tarjeta
 * Se llama después de que Stripe confirma el Setup Intent
 */
export async function PUT(request: Request) {
  try {
    const { token, setup_intent_id } = await request.json()

    if (!token || !setup_intent_id) {
      return NextResponse.json({
        success: false,
        error: 'Token y setup_intent_id requeridos',
      }, { status: 400 })
    }

    console.log('💳 [UPDATE CARD] Confirmando actualización:', setup_intent_id)

    // Verificar token nuevamente
    const { data: paymentToken, error: tokenError } = await supabase
      .from('payment_tokens')
      .select('*, entities(*)')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (tokenError || !paymentToken) {
      return NextResponse.json({
        success: false,
        error: 'Token inválido',
      }, { status: 400 })
    }

    const entity = paymentToken.entities

    // Recuperar Setup Intent de Stripe
    const setupIntent = await stripe.setupIntents.retrieve(setup_intent_id)

    if (setupIntent.status !== 'succeeded') {
      console.error('❌ [UPDATE CARD] Setup Intent no exitoso:', setupIntent.status)
      return NextResponse.json({
        success: false,
        error: 'Actualización no completada',
      }, { status: 400 })
    }

    const newPaymentMethodId = setupIntent.payment_method as string

    // Actualizar método de pago por defecto en Stripe
    await stripe.customers.update(entity.stripe_customer_id, {
      invoice_settings: {
        default_payment_method: newPaymentMethodId,
      },
    })

    // Actualizar en base de datos
    await supabase
      .from('entities')
      .update({
        stripe_payment_method_id: newPaymentMethodId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', entity.id)

    // Marcar token como usado
    await supabase
      .from('payment_tokens')
      .update({
        used: true,
      })
      .eq('id', paymentToken.id)

    // Enviar email de confirmación
    await supabase
      .from('message_jobs')
      .insert({
        recipient_email: entity.email_contratante,
        template_type: 'payment_method_updated',
        subject: 'Método de Pago Actualizado - Custodia360',
        template_data: {
          entidad_nombre: entity.nombre_entidad,
          updated_date: new Date().toLocaleDateString('es-ES'),
        },
        status: 'enqueued',
        priority: 'normal',
        scheduled_for: new Date().toISOString(),
      })

    console.log('✅ [UPDATE CARD] Tarjeta actualizada exitosamente')

    return NextResponse.json({
      success: true,
      message: 'Método de pago actualizado correctamente',
    })

  } catch (error: any) {
    console.error('❌ [UPDATE CARD] Error confirmando:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Error al confirmar actualización',
    }, { status: 500 })
  }
}
