import { Handler, HandlerEvent } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

/**
 * SCHEDULED FUNCTION: Recordatorios de Segundo Pago
 *
 * Se ejecuta diariamente (configurar en netlify.toml)
 * Envía recordatorios 30 días antes del segundo pago a:
 * - Contratante
 * - Delegado principal
 * - Admin (copia)
 *
 * Incluye link seguro para actualizar tarjeta si es necesario
 */
export const handler: Handler = async (event: HandlerEvent) => {
  const startTime = Date.now()
  console.log('🔔 [PAYMENT REMINDERS] Iniciando proceso...')

  try {
    // Calcular fecha objetivo: +30 días desde hoy
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 30)
    const targetDateStr = targetDate.toISOString().split('T')[0]

    console.log(`📅 [PAYMENT REMINDERS] Buscando pagos programados para: ${targetDateStr}`)

    // Buscar entidades con segundo pago en 30 días
    const { data: entities, error } = await supabase
      .from('entities')
      .select(`
        id,
        nombre_entidad,
        email_contratante,
        email_admin,
        second_payment_date,
        second_payment_amount,
        second_payment_status,
        payment_reminder_sent,
        stripe_customer_id,
        plan_contratado,
        entity_delegates!inner(email, nombre, tipo)
      `)
      .eq('second_payment_status', 'pending')
      .eq('second_payment_date', targetDateStr)
      .eq('payment_reminder_sent', false)

    if (error) {
      console.error('❌ [PAYMENT REMINDERS] Error consultando entidades:', error)
      throw error
    }

    if (!entities || entities.length === 0) {
      console.log('✅ [PAYMENT REMINDERS] No hay pagos pendientes para recordar hoy')
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'No pending payments to remind today',
          processed: 0,
        }),
      }
    }

    console.log(`📧 [PAYMENT REMINDERS] ${entities.length} entidades necesitan recordatorio`)

    let remindersQueued = 0

    for (const entity of entities) {
      try {
        // Generar token seguro para actualizar tarjeta (válido 60 días)
        const token = `pmt_${Date.now()}_${Math.random().toString(36).substring(7)}`
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 60)

        // Guardar token en payment_tokens
        const { error: tokenError } = await supabase
          .from('payment_tokens')
          .insert({
            entity_id: entity.id,
            token: token,
            purpose: 'change_card',
            expires_at: expiresAt.toISOString(),
          })

        if (tokenError) {
          console.error(`❌ [PAYMENT REMINDERS] Error creando token para ${entity.id}:`, tokenError)
          continue
        }

        const updateCardUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/actualizar-tarjeta?token=${token}`

        // Email al contratante
        await enqueueEmail({
          to: entity.email_contratante,
          template_type: 'payment_reminder',
          subject: `Recordatorio: Segundo Pago ${entity.plan_contratado} en 30 días`,
          data: {
            entidad_nombre: entity.nombre_entidad,
            plan: entity.plan_contratado,
            payment_amount: entity.second_payment_amount,
            payment_date: entity.second_payment_date,
            update_card_url: updateCardUrl,
            recipient_type: 'contratante',
          },
        })

        // Email al delegado principal
        const delegadoPrincipal = entity.entity_delegates?.find(d => d.tipo === 'principal')
        if (delegadoPrincipal) {
          await enqueueEmail({
            to: delegadoPrincipal.email,
            template_type: 'payment_reminder',
            subject: `Recordatorio: Segundo Pago ${entity.plan_contratado} en 30 días`,
            data: {
              entidad_nombre: entity.nombre_entidad,
              delegado_nombre: delegadoPrincipal.nombre,
              plan: entity.plan_contratado,
              payment_amount: entity.second_payment_amount,
              payment_date: entity.second_payment_date,
              update_card_url: updateCardUrl,
              recipient_type: 'delegado',
            },
          })
        }

        // Email al admin (copia)
        if (entity.email_admin) {
          await enqueueEmail({
            to: entity.email_admin,
            template_type: 'payment_reminder',
            subject: `[Admin] Recordatorio Pago: ${entity.nombre_entidad}`,
            data: {
              entidad_nombre: entity.nombre_entidad,
              plan: entity.plan_contratado,
              payment_amount: entity.second_payment_amount,
              payment_date: entity.second_payment_date,
              stripe_customer_id: entity.stripe_customer_id,
              recipient_type: 'admin',
            },
          })
        }

        // Marcar como enviado
        await supabase
          .from('entities')
          .update({
            payment_reminder_sent: true,
            second_payment_status: 'reminded',
            updated_at: new Date().toISOString(),
          })
          .eq('id', entity.id)

        remindersQueued++
        console.log(`✅ [PAYMENT REMINDERS] Recordatorio enviado: ${entity.nombre_entidad}`)

      } catch (err: any) {
        console.error(`❌ [PAYMENT REMINDERS] Error procesando ${entity.id}:`, err)
        continue
      }
    }

    const duration = Date.now() - startTime
    console.log(`🎉 [PAYMENT REMINDERS] Completado en ${duration}ms`)
    console.log(`📊 [PAYMENT REMINDERS] ${remindersQueued}/${entities.length} recordatorios enviados`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        processed: entities.length,
        reminders_sent: remindersQueued,
        duration_ms: duration,
      }),
    }

  } catch (error: any) {
    console.error('❌ [PAYMENT REMINDERS] Error fatal:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    }
  }
}

// Helper: Encolar email en message_jobs
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
