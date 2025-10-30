import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

/**
 * POST /api/email/preview-parse
 * Previsualiza cómo quedaría parseada una alerta sin guardarla en BD
 * Útil para testing desde el panel admin
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, from, text, html, links } = body

    if (!subject && !text) {
      return NextResponse.json(
        { error: 'Se requiere al menos subject o text' },
        { status: 400 }
      )
    }

    // Normalizar datos (misma lógica que ingest-manual)
    const extractedLinks = links || extractLinksFromText(text, html)
    const summary = generateSummary(text || html || '')
    const title = subject || extractTitle(text || '')
    const url = extractedLinks[0] || null
    const publishedAt = new Date().toISOString()
    const source = 'manual'

    // Generar hash
    const hashInput = `${title}|${url || ''}|${publishedAt}`
    const hash = createHash('sha256').update(hashInput).digest('hex')

    // Preparar raw data (como quedaría guardado)
    const raw = {
      subject,
      from: from || 'manual',
      text,
      html,
      links: extractedLinks,
      ingestedAt: new Date().toISOString()
    }

    // Retornar preview sin guardar
    return NextResponse.json({
      preview: {
        source,
        title,
        url,
        published_at: publishedAt,
        summary,
        hash,
        raw
      },
      meta: {
        titleLength: title.length,
        summaryLength: summary.length,
        linksCount: extractedLinks.length,
        hasHtml: !!html,
        estimatedSize: JSON.stringify(raw).length
      },
      validation: {
        hasTitle: !!title,
        hasUrl: !!url,
        hasSummary: summary.length > 0,
        sizeOk: JSON.stringify(raw).length < 1048576 // 1MB
      }
    })

  } catch (error: any) {
    console.error('Error en preview-parse:', error)
    return NextResponse.json(
      { error: 'Error procesando preview', details: error.message },
      { status: 500 }
    )
  }
}

// Helpers (duplicados de ingest-manual para independencia)
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
