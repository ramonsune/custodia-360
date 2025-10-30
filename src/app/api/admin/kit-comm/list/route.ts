import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // TODO: Implementar guard de autenticación admin
    // const isAdmin = await checkAdminAuth(request)
    // if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Parámetros de query
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q') || '' // Búsqueda por nombre, NIF o email
    const estado = searchParams.get('estado') || 'all' // 'all' | 'on' | 'off'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '25')

    // Calcular offset para paginación
    const offset = (page - 1) * pageSize

    // Construir query base
    let query = supabase
      .from('entities')
      .select('id, nombre, email_contacto, nif_cif, sector_code, kit_comunicacion, created_at', { count: 'exact' })

    // Aplicar filtro de búsqueda si existe
    if (q && q.trim()) {
      query = query.or(`nombre.ilike.%${q}%,email_contacto.ilike.%${q}%,nif_cif.ilike.%${q}%`)
    }

    // Aplicar filtro de estado
    if (estado === 'on') {
      query = query.eq('kit_comunicacion', true)
    } else if (estado === 'off') {
      query = query.eq('kit_comunicacion', false)
    }
    // Si es 'all', no filtramos por kit_comunicacion

    // Aplicar ordenamiento (más recientes primero)
    query = query.order('created_at', { ascending: false })

    // Aplicar paginación
    query = query.range(offset, offset + pageSize - 1)

    // Ejecutar query
    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching entities:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Formatear datos para el frontend
    const items = (data || []).map(entity => ({
      id: entity.id,
      nombre: entity.nombre || 'Sin nombre',
      email_contacto: entity.email_contacto || 'Sin email',
      nif_cif: entity.nif_cif || 'N/A',
      sector_code: entity.sector_code || 'general',
      kit_comunicacion: entity.kit_comunicacion || false,
      created_at: entity.created_at
    }))

    return NextResponse.json({
      items,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    })

  } catch (err: any) {
    console.error('Unexpected error in kit-comm/list:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
