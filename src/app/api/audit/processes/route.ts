/**
 * API ENDPOINT: GET /api/audit/processes
 *
 * Consulta procesos de onboarding con filtros opcionales
 *
 * Query params:
 * - email: email de la entidad
 * - status: pending | paid | provisioned | trained | error
 * - dateFrom: fecha desde (ISO string)
 * - dateTo: fecha hasta (ISO string)
 * - limit: número máximo de resultados (default: 50)
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

    const email = searchParams.get('email')
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    console.log('[AUDIT-PROCESSES] Query:', { email, status, dateFrom, dateTo, limit, offset })

    // Construir query
    let query = supabaseAdmin
      .from('onboarding_process')
      .select('*', { count: 'exact' })

    // Filtros opcionales
    if (email) {
      query = query.ilike('email', `%${email}%`)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (dateFrom) {
      query = query.gte('created_at', dateFrom)
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo)
    }

    // Ordenar por fecha descendente
    query = query.order('created_at', { ascending: false })

    // Paginación
    query = query.range(offset, offset + limit - 1)

    // Ejecutar query
    const { data, error, count } = await query

    if (error) {
      console.error('[AUDIT-PROCESSES] Error:', error)
      return NextResponse.json(
        { error: 'Error consultando procesos' },
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
    console.error('[AUDIT-PROCESSES] Exception:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
