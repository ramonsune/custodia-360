import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const entidad_id = searchParams.get('entidad_id')
    const elemento_tipo = searchParams.get('elemento_tipo')
    const limite = parseInt(searchParams.get('limite') || '50')

    if (!entidad_id) {
      return NextResponse.json({ error: 'entidad_id es requerido' }, { status: 400 })
    }

    let query = supabase
      .from('historial_cumplimiento')
      .select(`
        *,
        usuario_modificador:usuarios(nombre, email)
      `)
      .eq('entidad_id', entidad_id)
      .order('created_at', { ascending: false })
      .limit(limite)

    if (elemento_tipo) {
      query = query.eq('elemento_tipo', elemento_tipo)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error obteniendo historial:', error)
      return NextResponse.json({ error: 'Error obteniendo historial', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, historial: data })

  } catch (error) {
    console.error('Error en GET historial cumplimiento:', error)
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 })
  }
}
