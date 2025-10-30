import { Handler, HandlerEvent } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

/**
 * SCHEDULED FUNCTION: Reintentos Automáticos de Pago
 *
 * Se ejecuta diariamente (configurar en netlify.toml)
 *
 * Lógica:
 * - Busca entidades con second_payment_status = 'reminded' o 'failed'
 * - Verifica que payment_retry_count < 3
 * - Intenta cobrar con Stripe usando el payment_method guardado
 * - Si falla, incrementa retry_count
 * - Después de 3 fallos, inicia período de gracia
 */
export const handler: Handler = async (event: HandlerEvent) => {
  const startTime = Date.now()
  console.log('🔄 [PAYMENT RETRY] Iniciando proceso de reintentos...')

  try {
    const today = new Date().toISOString().split('T')[0]

    // Buscar entidades con pago pendiente o fallido que necesitan reintento
    const { data: entities, error } = await supabase
      .from('entities')
      .select('*')
      .in('second_payment_status', ['reminded', 'failed'])
      .lte('second_payment_date', today)
      .lt('payment_retry_count', 3)
      .not('stripe_customer_id', 'is', null)
      .not('stripe_payment_method_id', 'is', null)

    if (error) {
      console.error('❌ [PAYMENT RETRY] Error consultando entidades:', error)
      throw error
    }

    if (!entities || entities.length === 0) {
      console.log('✅ [PAYMENT RETRY] No hay pagos pendientes de reintento hoy')
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'No pending retries today',
          processed: 0,
        }),
      }
    }

    console.log(`💳 [PAYMENT RETRY] ${entities.length} pagos para reintentar`)

    let successCount = 0
    let failCount = 0

    for (const entity of entities) {
      try {
        // Verificar si debe intentar hoy (cada 3 días)
        const daysSinceLastRetry = entity.payment_last_retry_date
          ? Math.floor((new Date().getTime() - new Date(entity.payment_last_retry_date).getTime()) / (1000 * 60 * 60 * 24))
          : 999

        if (daysSinceLastRetry < 3 && entity.payment_retry_count > 0) {
          console.log(`⏭️ [PAYMENT RETRY] ${entity.nombre_entidad} - Esperando 3 días desde último intento`)
          continue
        }

        console.log(`💰 [PAYMENT RETRY] Intentando cobro: ${entity.nombre_entidad} (intento ${entity.payment_retry_count + 1}/3)`)

        // Crear Payment Intent con Stripe
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(entity.second_payment_amount * 100), // Convertir a centavos
          currency: 'eur',
          customer: entity.stripe_customer_id,
          payment_method: entity.stripe_payment_method_id,
          off_session: true, // Cobro sin que el usuario esté presente
          confirm: true, // Confirmar automáticamente
          description: `Segundo Pago ${entity.plan_contratado} - ${entity.nombre_entidad}`,
          metadata: {
            entity_id: entity.id,
            payment_type: 'second_payment',
            plan: entity.plan_contratado,
            retry_attempt: entity.payment_retry_count + 1,
          },
        })

        if (paymentIntent.status === 'succeeded') {
          // ✅ Cobro exitoso
          console.log(`✅ [PAYMENT RETRY] Cobro exitoso: ${entity.nombre_entidad}`)

          // Actualizar estado
          await supabase
            .from('entities')
            .update({
              second_payment_status: 'paid',
              payment_retry_count: entity.payment_retry_count + 1,
              payment_last_retry_date: new Date().toISOString().split('T')[0],
              updated_at: new Date().toISOString(),
            })
            .eq('id', entity.id)

          // Guardar factura
          await saveInvoice({
            entity_id: entity.id,
            stripe_payment_intent: paymentIntent.id,
            amount: entity.second_payment_amount,
            invoice_type: 'second_payment',
            description: `Segundo Pago ${entity.plan_contratado} (50%)`,
          })

          // Email de confirmación
          await enqueueEmail({
            to: entity.email_contratante,
            template_type: 'payment_success',
            subject: `✅ Segundo Pago Procesado - ${entity.plan_contratado}`,
            data: {
              entidad_nombre: entity.nombre_entidad,
              plan: entity.plan_contratado,
              amount: entity.second_payment_amount,
              payment_date: new Date().toLocaleDateString('es-ES'),
            },
          })

          successCount++

        } else {
          throw new Error(`Payment Intent status: ${paymentIntent.status}`)
        }

      } catch (err: any) {
        // ❌ Cobro fallido
        console.error(`❌ [PAYMENT RETRY] Error cobrando ${entity.nombre_entidad}:`, err.message)

        const newRetryCount = entity.payment_retry_count + 1

        if (newRetryCount >= 3) {
          // Último intento fallido → Período de gracia
          console.log(`⚠️ [PAYMENT RETRY] ${entity.nombre_entidad} - Iniciando período de gracia`)

          await supabase
            .from('entities')
            .update({
              second_payment_status: 'failed',
              payment_retry_count: newRetryCount,
              payment_last_retry_date: new Date().toISOString().split('T')[0],
              account_status: 'grace_period',
              grace_period_start_date: new Date().toISOString().split('T')[0],
              updated_at: new Date().toISOString(),
            })
            .eq('id', entity.id)

          // Email de período de gracia
          await enqueueEmail({
            to: entity.email_contratante,
            template_type: 'payment_grace_period',
            subject: `⚠️ Pago Pendiente - Período de Gracia (7 días)`,
            data: {
              entidad_nombre: entity.nombre_entidad,
              plan: entity.plan_contratado,
              amount: entity.second_payment_amount,
              grace_days: 7,
              error_reason: err.message,
            },
          })

        } else {
          // Reintento intermedio
          await supabase
            .from('entities')
            .update({
              second_payment_status: 'failed',
              payment_retry_count: newRetryCount,
              payment_last_retry_date: new Date().toISOString().split('T')[0],
              updated_at: new Date().toISOString(),
            })
            .eq('id', entity.id)

          // Email de intento fallido
          await enqueueEmail({
            to: entity.email_contratante,
            template_type: 'payment_retry_failed',
            subject: `⚠️ Intento de Pago Fallido (${newRetryCount}/3)`,
            data: {
              entidad_nombre: entity.nombre_entidad,
              plan: entity.plan_contratado,
              amount: entity.second_payment_amount,
              retry_attempt: newRetryCount,
              next_retry_days: 3,
              error_reason: err.message,
            },
          })
        }

        failCount++
      }
    }

    const duration = Date.now() - startTime
    console.log(`🎉 [PAYMENT RETRY] Completado en ${duration}ms`)
    console.log(`📊 [PAYMENT RETRY] Exitosos: ${successCount}, Fallidos: ${failCount}`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        processed: entities.length,
        successful_payments: successCount,
        failed_payments: failCount,
        duration_ms: duration,
      }),
    }

  } catch (error: any) {
    console.error('❌ [PAYMENT RETRY] Error fatal:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    }
  }
}

// Helper: Guardar factura
async function saveInvoice(params: {
  entity_id: string
  stripe_payment_intent: string
  amount: number
  invoice_type: string
  description: string
}) {
  const invoiceNumber = `FAC-${params.invoice_type.toUpperCase()}-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

  const IVA_RATE = 0.21
  const total = params.amount
  const subtotal = total / (1 + IVA_RATE)
  const taxAmount = total - subtotal

  const { error } = await supabase
    .from('invoices')
    .insert({
      entity_id: params.entity_id,
      invoice_number: invoiceNumber,
      invoice_type: params.invoice_type,
      description: params.description,
      subtotal: Math.round(subtotal * 100) / 100,
      tax_rate: IVA_RATE * 100,
      tax_amount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
      currency: 'EUR',
      status: 'paid',
      stripe_payment_intent_id: params.stripe_payment_intent,
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })

  if (error) {
    console.error('❌ Error guardando factura:', error)
    throw error
  }

  console.log(`✅ Factura guardada: ${invoiceNumber}`)
}

// Helper: Encolar email
async function enqueueEmail(params: {
  to: string
  template_type: string
  subject: string
  data: Record<string, any>
}) {
  const { error } = await supabase
    .from('message_jobs')
    .insert({
      recipient_email: params.to,
      template_type: params.template_type,
      subject: params.subject,
      template_data: params.data,
      status: 'enqueued',
      priority: 'high',
      scheduled_for: new Date().toISOString(),
    })

  if (error) {
    console.error('❌ Error encolando email:', error)
    throw error
  }
}
