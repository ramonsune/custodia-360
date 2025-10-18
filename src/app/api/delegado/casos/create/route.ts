import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entityId, userId, titulo, descripcion, tipo_caso, gravedad, afectados } = body

    if (!entityId || !userId || !titulo || !tipo_caso) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: caso, error } = await supabase
      .from('casos_proteccion')
      .insert({
        entity_id: entityId,
        created_by: userId,
        titulo,
        descripcion: descripcion || '',
        tipo_caso,
        gravedad: gravedad || 'media',
        estado: 'nuevo',
        afectados: afectados || [],
        timeline: [{
          fecha: new Date().toISOString(),
          accion: 'Caso creado',
          usuario: userId,
          detalles: 'Caso registrado en el sistema'
        }]
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      caso
    })

  } catch (error: any) {
    console.error('Error creating caso:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
