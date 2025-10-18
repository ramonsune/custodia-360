import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { casoId, userId, updates, accion } = body

    if (!casoId || !userId) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const supabase = await createClient()

    // Obtener caso actual
    const { data: casoActual, error: fetchError } = await supabase
      .from('casos_proteccion')
      .select('*')
      .eq('id', casoId)
      .single()

    if (fetchError) throw fetchError

    // Añadir entrada al timeline
    const timeline = casoActual.timeline || []
    timeline.push({
      fecha: new Date().toISOString(),
      accion: accion || 'Caso actualizado',
      usuario: userId,
      detalles: JSON.stringify(updates)
    })

    // Actualizar caso
    const { data: caso, error } = await supabase
      .from('casos_proteccion')
      .update({
        ...updates,
        timeline,
        updated_at: new Date().toISOString()
      })
      .eq('id', casoId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      caso
    })

  } catch (error: any) {
    console.error('Error updating caso:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
