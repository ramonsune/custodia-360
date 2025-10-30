import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const resend = new Resend(process.env.RESEND_API_KEY)
const REPORT_EMAIL = process.env.REPORT_EMAIL || process.env.RESEND_FROM_EMAIL || 'soporte@custodia360.es'

// URL del BOE a monitorear
const BOE_URL = 'https://www.boe.es/buscar/doc.php?id=BOE-A-2021-9347'

/**
 * POST /api/boe/check
 * Ejecuta una verificación del BOE para detectar cambios
 * Requiere autenticación ADMIN
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Verificar autenticación ADMIN
    // const session = await getSession(request)
    // if (!session || session.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    console.log(`[BOE CHECK] Iniciando verificación: ${new Date().toISOString()}`)

    // Obtener última verificación
    const { data: lastCheck } = await supabase
      .from('boe_changes')
      .select('etag, last_modified, content_hash')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Hacer request al BOE
    const response = await fetch(BOE_URL, {
      method: 'HEAD', // Primero intentar solo headers
      headers: {
        'User-Agent': 'Custodia360-Bot/1.0'
      }
    })

    const currentETag = response.headers.get('etag')
    const currentLastModified = response.headers.get('last-modified')

    // Comparar ETag y Last-Modified
    if (lastCheck) {
      if (currentETag && currentETag === lastCheck.etag) {
        console.log('[BOE CHECK] Sin cambios (ETag coincide)')

        await auditLog('boe', 'nochange', 'INFO', {
          method: 'etag',
          etag: currentETag
        })

        return NextResponse.json({
          changed: false,
          method: 'etag',
          message: 'No hay cambios detectados'
        })
      }

      if (currentLastModified && currentLastModified === lastCheck.last_modified) {
        console.log('[BOE CHECK] Sin cambios (Last-Modified coincide)')

        await auditLog('boe', 'nochange', 'INFO', {
          method: 'last-modified',
          lastModified: currentLastModified
        })

        return NextResponse.json({
          changed: false,
          method: 'last-modified',
          message: 'No hay cambios detectados'
        })
      }
    }

    // Si no hay headers o son diferentes, hacer GET completo y comparar hash
    console.log('[BOE CHECK] Headers cambiaron o no disponibles, obteniendo contenido completo')

    const fullResponse = await fetch(BOE_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Custodia360-Bot/1.0'
      }
    })

    const html = await fullResponse.text()
    const contentHash = createHash('sha256').update(html).digest('hex')

    // Comparar hash de contenido
    if (lastCheck?.content_hash === contentHash) {
      console.log('[BOE CHECK] Sin cambios (hash coincide)')

      await auditLog('boe', 'nochange', 'INFO', {
        method: 'content-hash',
        hash: contentHash.substring(0, 16) + '...'
      })

      // Actualizar headers aunque el contenido sea igual
      await supabase.from('boe_changes').insert({
        url: BOE_URL,
        etag: currentETag,
        last_modified: currentLastModified,
        content_hash: contentHash,
        changed: false,
        method: 'content-hash'
      })

      return NextResponse.json({
        changed: false,
        method: 'content-hash',
        message: 'No hay cambios detectados'
      })
    }

    // CAMBIO DETECTADO
    console.log('[BOE CHECK] ⚠️ CAMBIO DETECTADO EN BOE')

    // Guardar cambio detectado
    const { data: changeRecord } = await supabase
      .from('boe_changes')
      .insert({
        url: BOE_URL,
        etag: currentETag,
        last_modified: currentLastModified,
        content_hash: contentHash,
        changed: true,
        method: 'content-hash',
        previous_hash: lastCheck?.content_hash || null
      })
      .select()
      .single()

    // Auditar cambio
    await auditLog('boe', 'change.detected', 'WARN', {
      url: BOE_URL,
      changeId: changeRecord?.id,
      method: 'content-hash',
      previousHash: lastCheck?.content_hash?.substring(0, 16),
      currentHash: contentHash.substring(0, 16)
    })

    // Enviar notificación por email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: REPORT_EMAIL,
        subject: '[ALERTA BOE] Se detectó un cambio en la LOPIVI',
        html: `
          <h2 style="color: #dc2626;">⚠️ Cambio Detectado en el BOE</h2>

          <p>Se ha detectado un cambio en el documento de la LOPIVI.</p>

          <p><strong>URL:</strong> <a href="${BOE_URL}">${BOE_URL}</a></p>

          <p><strong>Detalles:</strong></p>
          <ul>
            <li>Método de detección: Hash de contenido</li>
            <li>Fecha de detección: ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</li>
            ${currentETag ? `<li>ETag: ${currentETag}</li>` : ''}
            ${currentLastModified ? `<li>Last-Modified: ${currentLastModified}</li>` : ''}
          </ul>

          <p><strong>Hash anterior:</strong> ${lastCheck?.content_hash?.substring(0, 32) || 'N/A'}...</p>
          <p><strong>Hash actual:</strong> ${contentHash.substring(0, 32)}...</p>

          <hr>

          <p><strong>Acción recomendada:</strong></p>
          <p>Revisa el documento para identificar los cambios y actualiza los protocolos si es necesario.</p>

          <p><small>Custodia360 - Sistema de Monitoreo BOE</small></p>
        `
      })

      await auditLog('boe', 'notify.sent', 'INFO', {
        to: REPORT_EMAIL,
        changeId: changeRecord?.id
      })

      console.log('[BOE CHECK] Notificación enviada a:', REPORT_EMAIL)

    } catch (emailError: any) {
      console.error('[BOE CHECK] Error enviando notificación:', emailError)
      await auditLog('boe', 'notify.error', 'ERROR', { error: emailError.message })
    }

    return NextResponse.json({
      changed: true,
      method: 'content-hash',
      message: 'CAMBIO DETECTADO - Notificación enviada',
      changeId: changeRecord?.id,
      previousHash: lastCheck?.content_hash?.substring(0, 16),
      currentHash: contentHash.substring(0, 16)
    })

  } catch (error: any) {
    console.error('[BOE CHECK] Error:', error)
    await auditLog('boe', 'check.error', 'ERROR', { error: error.message })

    return NextResponse.json(
      { error: 'Error ejecutando verificación BOE', details: error.message },
      { status: 500 }
    )
  }
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
      payload,
      created_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}
