import { Handler, HandlerEvent } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

/**
 * SCHEDULED FUNCTION: Control de Período de Gracia y Bloqueo
 *
 * Se ejecuta diariamente (configurar en netlify.toml)
 *
 * Lógica:
 * - Busca entidades en 'grace_period'
 * - Verifica si han pasado 7 días desde grace_period_start_date
 * - Si el período expiró, bloquea la cuenta
 * - Envía email de notificación de bloqueo
 */
export const handler: Handler = async (event: HandlerEvent) => {
  const startTime = Date.now()
  console.log('⏰ [GRACE ENFORCEMENT] Iniciando verificación de períodos de gracia...')

  try {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    // Buscar entidades en período de gracia
    const { data: entities, error } = await supabase
      .from('entities')
      .select('*')
      .eq('account_status', 'grace_period')
      .not('grace_period_start_date', 'is', null)

    if (error) {
      console.error('❌ [GRACE ENFORCEMENT] Error consultando entidades:', error)
      throw error
    }

    if (!entities || entities.length === 0) {
      console.log('✅ [GRACE ENFORCEMENT] No hay entidades en período de gracia')
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'No entities in grace period',
          processed: 0,
        }),
      }
    }

    console.log(`📋 [GRACE ENFORCEMENT] ${entities.length} entidades en período de gracia`)

    let blockedCount = 0

    for (const entity of entities) {
      try {
        const graceStartDate = new Date(entity.grace_period_start_date)
        const graceEndDate = new Date(graceStartDate)
        graceEndDate.setDate(graceEndDate.getDate() + 7) // +7 días

        const daysRemaining = Math.ceil((graceEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        console.log(`📅 [GRACE ENFORCEMENT] ${entity.nombre_entidad}: ${daysRemaining} días restantes`)

        if (daysRemaining <= 0) {
          // Período de gracia expirado → Bloquear cuenta
          console.log(`🚫 [GRACE ENFORCEMENT] Bloqueando cuenta: ${entity.nombre_entidad}`)

          await supabase
            .from('entities')
            .update({
              account_status: 'suspended',
              second_payment_status: 'cancelled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', entity.id)

          // Email de notificación de bloqueo
          await enqueueEmail({
            to: entity.email_contratante,
            template_type: 'account_suspended',
            subject: `🚫 Cuenta Suspendida por Pago Pendiente - ${entity.plan_contratado}`,
            data: {
              entidad_nombre: entity.nombre_entidad,
              plan: entity.plan_contratado,
              amount_due: entity.second_payment_amount,
              grace_period_ended: graceEndDate.toLocaleDateString('es-ES'),
              contact_email: 'soporte@custodia360.es',
            },
          })

          // Email al delegado principal
          const { data: delegados } = await supabase
            .from('entity_delegates')
            .select('email, nombre')
            .eq('entity_id', entity.id)
            .eq('tipo', 'principal')
            .limit(1)

          if (delegados && delegados.length > 0) {
            await enqueueEmail({
              to: delegados[0].email,
              template_type: 'account_suspended_delegate',
              subject: `⚠️ Cuenta Suspendida - ${entity.nombre_entidad}`,
              data: {
                delegado_nombre: delegados[0].nombre,
                entidad_nombre: entity.nombre_entidad,
                reason: 'Pago pendiente no completado',
                contact_email: 'soporte@custodia360.es',
              },
            })
          }

          // Email al admin
          if (entity.email_admin) {
            await enqueueEmail({
              to: entity.email_admin,
              template_type: 'account_suspended_admin',
              subject: `[Admin] Cuenta Bloqueada: ${entity.nombre_entidad}`,
              data: {
                entidad_nombre: entity.nombre_entidad,
                plan: entity.plan_contratado,
                amount_due: entity.second_payment_amount,
                entity_id: entity.id,
                stripe_customer_id: entity.stripe_customer_id,
                blocked_date: today.toLocaleDateString('es-ES'),
              },
            })
          }

          blockedCount++
          console.log(`✅ [GRACE ENFORCEMENT] Cuenta bloqueada: ${entity.nombre_entidad}`)

        } else if (daysRemaining <= 3) {
          // Recordatorio urgente (3 días o menos)
          console.log(`⚠️ [GRACE ENFORCEMENT] Recordatorio urgente: ${entity.nombre_entidad} (${daysRemaining} días restantes)`)

          await enqueueEmail({
            to: entity.email_contratante,
            template_type: 'grace_period_urgent',
            subject: `⚠️ URGENTE: ${daysRemaining} días para evitar bloqueo de cuenta`,
            data: {
              entidad_nombre: entity.nombre_entidad,
              plan: entity.plan_contratado,
              amount_due: entity.second_payment_amount,
              days_remaining: daysRemaining,
              deadline_date: graceEndDate.toLocaleDateString('es-ES'),
              contact_email: 'soporte@custodia360.es',
            },
          })
        }

      } catch (err: any) {
        console.error(`❌ [GRACE ENFORCEMENT] Error procesando ${entity.nombre_entidad}:`, err)
        continue
      }
    }

    const duration = Date.now() - startTime
    console.log(`🎉 [GRACE ENFORCEMENT] Completado en ${duration}ms`)
    console.log(`📊 [GRACE ENFORCEMENT] ${blockedCount} cuentas bloqueadas`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        processed: entities.length,
        accounts_blocked: blockedCount,
        duration_ms: duration,
      }),
    }

  } catch (error: any) {
    console.error('❌ [GRACE ENFORCEMENT] Error fatal:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    }
  }
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
