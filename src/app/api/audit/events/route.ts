/**
 * API ENDPOINT: GET /api/audit/events
 *
 * Consulta eventos de auditoría con filtros opcionales
 *
 * Query params:
 * - processId: uuid del proceso
 * - level: INFO | WARN | ERROR
 * - eventType: tipo de evento
 * - limit: número máximo de resultados (default: 100)
 * - offset: offset para paginación (default: 0)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const processId = searchParams.get('processId')
    const level = searchParams.get('level')
    const eventType = searchParams.get('eventType')
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    console.log('[AUDIT-EVENTS] Query:', { processId, level, eventType, limit, offset })

    // Construir query
    let query = supabaseAdmin
      .from('audit_events')
      .select('*', { count: 'exact' })

    // Filtros opcionales
    if (processId) {
      query = query.eq('process_id', processId)
    }

    if (level) {
      query = query.eq('level', level)
    }

    if (eventType) {
      query = query.eq('event_type', eventType)
    }

    // Ordenar por fecha descendente
    query = query.order('created_at', { ascending: false })

    // Paginación
    query = query.range(offset, offset + limit - 1)

    // Ejecutar query
    const { data, error, count } = await query

    if (error) {
      console.error('[AUDIT-EVENTS] Error:', error)
      return NextResponse.json(
        { error: 'Error consultando eventos' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      total: count || 0,
      limit,
      offset,
      has_more: (count || 0) > offset + limit
    })

  } catch (error: any) {
    console.error('[AUDIT-EVENTS] Exception:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
