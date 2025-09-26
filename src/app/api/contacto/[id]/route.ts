import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Configurar cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// PATCH para actualizar un contacto
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { estado, notas_internas, fecha_respuesta } = body

    // Validar estado
    if (estado && !['pendiente', 'respondido', 'archivado'].includes(estado)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      )
    }

    // Preparar datos para actualizar
    const updateData: any = {}
    if (estado) updateData.estado = estado
    if (notas_internas !== undefined) updateData.notas_internas = notas_internas
    if (fecha_respuesta) updateData.fecha_respuesta = fecha_respuesta

    // Actualizar en Supabase
    const { data, error } = await supabase
      .from('contactos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error actualizando contacto:', error)
      return NextResponse.json(
        { error: 'Error actualizando contacto' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Contacto actualizado correctamente',
      contacto: data
    })

  } catch (error) {
    console.error('Error en PATCH contacto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET para obtener un contacto específico
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('contactos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error obteniendo contacto:', error)
      return NextResponse.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Error en GET contacto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
