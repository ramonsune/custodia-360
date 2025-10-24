import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    // Obtener zona horaria configurada
    const timezone = process.env.APP_TIMEZONE || 'Europe/Madrid'

    // Calcular hora local
    const now = new Date()
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false
    })

    const hourLocal = parseInt(formatter.format(now), 10)

    console.log(`[Daily Audit] Hora local ${timezone}: ${hourLocal}:00`)

    // Solo ejecutar a las 09:00
    if (hourLocal !== 9) {
      console.log('[Daily Audit] Skipped - no es las 09:00')
      return {
        statusCode: 204,
        body: JSON.stringify({ skipped: true, hour: hourLocal })
      }
    }

    console.log('[Daily Audit] Ejecutando auditoría...')

    // Construir URL del endpoint
    const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000'
    const auditUrl = `${baseUrl}/api/ops/audit-live`

    // Llamar al endpoint de auditoría
    const response = await fetch(auditUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Audit endpoint error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    console.log(`[Daily Audit] Resultado: ${result.status}`)

    // Si el estado es 'fail', encolar email de alerta
    if (result.status === 'fail') {
      await sendAlertEmail(result)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        status: result.status,
        log_id: result.log_id,
        timestamp: new Date().toISOString()
      })
    }

  } catch (error: any) {
    console.error('[Daily Audit] Error:', error.message)

    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: error.message
      })
    }
  }
}

async function sendAlertEmail(auditResult: any) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('[Daily Audit] No se puede enviar alerta - falta config Supabase')
      return
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    const toEmail = process.env.NOTIFY_EMAIL_FROM || process.env.ADMIN_EMAIL || 'admin@custodia360.es'

    // Encolar mensaje de alerta
    const { error } = await supabase
      .from('message_jobs')
      .insert({
        template_slug: 'compliance-blocked',
        channel: 'email',
        context: JSON.stringify({
          to_email: toEmail,
          subject: '🚨 Alerta: Auditoría diaria con fallos',
          summary: auditResult.summary,
          details: auditResult.details,
          log_id: auditResult.log_id,
          motivo: 'audit-fail',
          fecha: new Date().toISOString()
        }),
        status: 'queued',
        scheduled_at: new Date().toISOString()
      })

    if (error) {
      console.error('[Daily Audit] Error encolando alerta:', error)
    } else {
      console.log('[Daily Audit] Alerta encolada para:', toEmail)
    }

  } catch (e: any) {
    console.error('[Daily Audit] Error enviando alerta:', e.message)
  }
}

export { handler }
