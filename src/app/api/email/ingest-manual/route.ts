import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const resend = new Resend(process.env.RESEND_API_KEY)
const REPORT_EMAIL = process.env.REPORT_EMAIL || process.env.RESEND_FROM_EMAIL || 'soporte@custodia360.es'

/**
 * POST /api/email/ingest-manual
 * Ingesta manual de alertas LOPIVI desde el panel admin
 * Requiere autenticación ADMIN
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Verificar autenticación ADMIN
    // const session = await getSession(request)
    // if (!session || session.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const { subject, from, text, html, links } = body

    if (!subject && !text) {
      return NextResponse.json(
        { error: 'Se requiere al menos subject o text' },
        { status: 400 }
      )
    }

    // Normalizar datos
    const extractedLinks = links || extractLinksFromText(text, html)
    const summary = generateSummary(text || html || '')
    const title = subject || extractTitle(text || '')
    const url = extractedLinks[0] || null
    const publishedAt = new Date().toISOString()
    const source = 'manual'

    // Generar hash para deduplicación
    const hashInput = `${title}|${url || ''}|${publishedAt}`
    const hash = createHash('sha256').update(hashInput).digest('hex')

    // Preparar raw data
    const raw = {
      subject,
      from: from || 'manual',
      text,
      html,
      links: extractedLinks,
      ingestedAt: new Date().toISOString()
    }

    // Insertar en BD (con dedup por hash)
    const { data: existing } = await supabase
      .from('lopivi_news')
      .select('id')
      .eq('hash', hash)
      .single()

    if (existing) {
      // Ya existe - deduplicado
      await auditLog('email', 'ingest.manual.dedup', 'INFO', { hash, title })

      return NextResponse.json({
        inserted: 0,
        dedup: true,
        message: 'Alerta ya existe (hash duplicado)',
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
      console.error('Error insertando alerta:', insertError)
      await auditLog('email', 'ingest.manual.error', 'ERROR', { error: insertError.message })

      return NextResponse.json(
        { error: 'Error al guardar alerta', details: insertError.message },
        { status: 500 }
      )
    }

    // Auditar inserción exitosa
    await auditLog('email', 'ingest.manual', 'INFO', {
      id: inserted.id,
      title,
      source,
      hash
    })

    // Enviar notificación por email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: REPORT_EMAIL,
        subject: '[Alertas LOPIVI] Nueva alerta ingresada manualmente',
        html: `
          <h2>Nueva Alerta LOPIVI</h2>
          <p><strong>Título:</strong> ${title}</p>
          <p><strong>From:</strong> ${from || 'Manual'}</p>
          <p><strong>Resumen:</strong></p>
          <p>${summary.substring(0, 400)}</p>
          ${url ? `<p><strong>Enlace:</strong> <a href="${url}">${url}</a></p>` : ''}
          <hr>
          <p><small>Hash: ${hash}</small></p>
          <p><small>Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</small></p>
        `
      })

      await auditLog('email', 'notify.sent', 'INFO', { to: REPORT_EMAIL, alertId: inserted.id })
    } catch (emailError: any) {
      console.error('Error enviando notificación:', emailError)
      await auditLog('email', 'notify.error', 'ERROR', { error: emailError.message })
      // No romper el flujo - la alerta ya está guardada
    }

    return NextResponse.json({
      inserted: 1,
      id: inserted.id,
      dedup: false,
      hash,
      message: 'Alerta guardada exitosamente'
    })

  } catch (error: any) {
    console.error('Error en ingest-manual:', error)
    await auditLog('email', 'ingest.manual.exception', 'ERROR', { error: error.message })

    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

// Helpers
function extractLinksFromText(text?: string, html?: string): string[] {
  const content = html || text || ''
  const urlRegex = /(https?:\/\/[^\s<>"]+)/gi
  const matches = content.match(urlRegex) || []
  return [...new Set(matches)] // Deduplicar
}

function generateSummary(text: string): string {
  const clean = text
    .replace(/<[^>]*>/g, '') // Eliminar tags HTML
    .replace(/\s+/g, ' ') // Normalizar espacios
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
