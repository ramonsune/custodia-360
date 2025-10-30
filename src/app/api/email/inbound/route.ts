import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash, createHmac } from 'crypto'
import { Resend } from 'resend'

const EMAIL_INBOUND_ENABLED = process.env.EMAIL_INBOUND_ENABLED === 'true'
const RESEND_INBOUND_SIGNING_SECRET = process.env.RESEND_INBOUND_SIGNING_SECRET

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const resend = new Resend(process.env.RESEND_API_KEY)
const REPORT_EMAIL = process.env.REPORT_EMAIL || process.env.RESEND_FROM_EMAIL || 'soporte@custodia360.es'

/**
 * POST /api/email/inbound
 * Webhook para recibir emails automáticamente desde Resend Inbound
 * FASE B - Desactivado por defecto hasta que exista lopivi@custodia360.es
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar si el inbound está habilitado
    if (!EMAIL_INBOUND_ENABLED) {
      await auditLog('email', 'inbound.disabled', 'WARN', {
        message: 'Intento de usar webhook inbound cuando EMAIL_INBOUND_ENABLED=false',
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      })

      return NextResponse.json(
        {
          error: 'Email inbound webhook no está habilitado',
          message: 'Configura EMAIL_INBOUND_ENABLED=true en variables de entorno'
        },
        { status: 503 }
      )
    }

    // Verificar firma de Resend (si está configurada)
    if (RESEND_INBOUND_SIGNING_SECRET) {
      const signature = request.headers.get('resend-signature')
      const body = await request.text()

      if (!verifyResendSignature(signature, body)) {
        await auditLog('email', 'inbound.invalid_signature', 'ERROR', {
          signature: signature?.substring(0, 20) + '...'
        })

        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }

      // Re-parsear body después de verificar
      var payload = JSON.parse(body)
    } else {
      var payload = await request.json()
    }

    // Extraer datos del payload de Resend Inbound
    // Formato esperado: https://resend.com/docs/api-reference/emails/webhooks#inbound-email-payload
    const {
      from,
      to,
      subject,
      text,
      html,
      message_id: messageId,
      date,
      headers
    } = payload

    // Validar que sea para lopivi@custodia360.es
    const expectedEmail = process.env.EMAIL_ROUTING || 'lopivi@custodia360.es'
    if (!to || !to.includes(expectedEmail)) {
      await auditLog('email', 'inbound.wrong_recipient', 'WARN', {
        to,
        expected: expectedEmail
      })

      return NextResponse.json({
        message: 'Email recibido pero no para el buzón correcto',
        received: to,
        expected: expectedEmail
      })
    }

    // Normalizar datos (misma lógica que ingest-manual)
    const extractedLinks = extractLinksFromText(text, html)
    const summary = generateSummary(text || html || '')
    const title = subject || extractTitle(text || '')
    const url = extractedLinks[0] || null
    const publishedAt = date ? new Date(date).toISOString() : new Date().toISOString()

    // Detectar source del remitente (ej: golee)
    const source = detectSource(from)

    // Generar hash para deduplicación
    const hashInput = `${title}|${url || ''}|${publishedAt}`
    const hash = createHash('sha256').update(hashInput).digest('hex')

    // Preparar raw data
    const raw = {
      from,
      to,
      subject,
      text,
      html,
      messageId,
      date,
      headers,
      links: extractedLinks,
      ingestedAt: new Date().toISOString()
    }

    // Verificar deduplicación
    const { data: existing } = await supabase
      .from('lopivi_news')
      .select('id')
      .eq('hash', hash)
      .single()

    if (existing) {
      await auditLog('email', 'inbound.dedup', 'INFO', { hash, from, subject })

      return NextResponse.json({
        inserted: 0,
        dedup: true,
        message: 'Email ya procesado (hash duplicado)',
        hash
      })
    }

    // Insertar nueva alerta
    const { data: inserted, error: insertError } = await supabase
      .from('lopivi_news')
      .insert({
        source,
        title,
        url,
        published_at: publishedAt,
        summary,
        hash,
        raw
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error insertando alerta desde inbound:', insertError)
      await auditLog('email', 'inbound.insert_error', 'ERROR', {
        error: insertError.message,
        from,
        subject
      })

      return NextResponse.json(
        { error: 'Error al guardar alerta', details: insertError.message },
        { status: 500 }
      )
    }

    // Auditar inserción exitosa
    await auditLog('email', 'ingest.webhook', 'INFO', {
      id: inserted.id,
      title,
      source,
      from,
      hash
    })

    // Enviar notificación por email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: REPORT_EMAIL,
        subject: `[Alertas LOPIVI] Nueva alerta desde ${source}`,
        html: `
          <h2>Nueva Alerta LOPIVI (Automática)</h2>
          <p><strong>Fuente:</strong> ${source}</p>
          <p><strong>De:</strong> ${from}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Resumen:</strong></p>
          <p>${summary.substring(0, 400)}</p>
          ${url ? `<p><strong>Enlace:</strong> <a href="${url}">${url}</a></p>` : ''}
          <hr>
          <p><small>Hash: ${hash}</small></p>
          <p><small>Message ID: ${messageId}</small></p>
          <p><small>Recibido: ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</small></p>
        `
      })

      await auditLog('email', 'notify.sent', 'INFO', { to: REPORT_EMAIL, alertId: inserted.id })
    } catch (emailError: any) {
      console.error('Error enviando notificación:', emailError)
      await auditLog('email', 'notify.error', 'ERROR', { error: emailError.message })
    }

    return NextResponse.json({
      inserted: 1,
      id: inserted.id,
      dedup: false,
      hash,
      message: 'Email procesado exitosamente'
    })

  } catch (error: any) {
    console.error('Error en email inbound:', error)
    await auditLog('email', 'inbound.exception', 'ERROR', { error: error.message })

    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// Helpers
function verifyResendSignature(signature: string | null, body: string): boolean {
  if (!signature || !RESEND_INBOUND_SIGNING_SECRET) {
    return false
  }

  try {
    const hmac = createHmac('sha256', RESEND_INBOUND_SIGNING_SECRET)
    hmac.update(body)
    const expectedSignature = hmac.digest('hex')

    return signature === expectedSignature
  } catch (error) {
    console.error('Error verificando firma:', error)
    return false
  }
}

function detectSource(from: string): string {
  const fromLower = from.toLowerCase()

  if (fromLower.includes('golee')) return 'email:golee'
  if (fromLower.includes('google')) return 'email:google'
  if (fromLower.includes('boe')) return 'email:boe'

  return 'email:unknown'
}

function extractLinksFromText(text?: string, html?: string): string[] {
  const content = html || text || ''
  const urlRegex = /(https?:\/\/[^\s<>"]+)/gi
  const matches = content.match(urlRegex) || []
  return [...new Set(matches)]
}

function generateSummary(text: string): string {
  const clean = text
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return clean.substring(0, 400) + (clean.length > 400 ? '...' : '')
}

function extractTitle(text: string): string {
  const clean = text
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const words = clean.split(' ').slice(0, 10).join(' ')
  return words + (clean.split(' ').length > 10 ? '...' : '')
}

async function auditLog(
  area: string,
  eventType: string,
  level: 'INFO' | 'ERROR' | 'WARN',
  payload: any
) {
  try {
    await supabase.from('audit_events').insert({
      area,
      event_type: eventType,
      level,
      payload
    })
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}
