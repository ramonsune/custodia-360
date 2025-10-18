import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const entityId = searchParams.get('entityId')
    const estado = searchParams.get('estado')
    const tipo = searchParams.get('tipo')
    const search = searchParams.get('search')

    if (!entityId) {
      return NextResponse.json({ error: 'entityId requerido' }, { status: 400 })
    }

    const supabase = await createClient()

    let query = supabase
      .from('casos_proteccion')
      .select('*')
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })

    if (estado && estado !== 'todos') {
      query = query.eq('estado', estado)
    }

    if (tipo && tipo !== 'todos') {
      query = query.eq('tipo_caso', tipo)
    }

    if (search) {
      query = query.or(`titulo.ilike.%${search}%,descripcion.ilike.%${search}%`)
    }

    const { data: casos, error } = await query

    if (error) throw error

    // Calcular KPIs
    const total = casos?.length || 0
    const activos = casos?.filter(c => ['nuevo', 'en_seguimiento', 'derivado'].includes(c.estado)).length || 0
    const urgentes = casos?.filter(c => c.tipo_caso === 'urgencia' && c.estado !== 'cerrado').length || 0
    const cerrados = casos?.filter(c => c.estado === 'cerrado').length || 0

    return NextResponse.json({
      success: true,
      casos: casos || [],
      kpis: {
        total,
        activos,
        urgentes,
        cerrados,
        porcentaje_resueltos: total > 0 ? Math.round((cerrados / total) * 100) : 0
      }
    })

  } catch (error: any) {
    console.error('Error loading casos:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
