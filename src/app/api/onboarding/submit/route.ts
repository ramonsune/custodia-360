import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      entityId,
      tipo,
      nombre,
      apellidos,
      email,
      telefono,
      puesto,
      cargo,
      penales_entregado,
      sector_code,
      children // Para familias
    } = body

    if (!entityId || !tipo) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('Variables de entorno de Supabase no configuradas')
      return NextResponse.json(
        { success: false, error: 'Configuración de base de datos no disponible' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Insertar persona
    const { data: person, error: personError } = await supabase
      .from('entity_people')
      .insert({
        entity_id: entityId,
        tipo,
        nombre,
        apellidos,
        email,
        telefono,
        puesto,
        cargo,
        penales_entregado: penales_entregado || false,
        sector_code,
        estado: 'completo',
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (personError) {
      console.error('Error guardando persona:', personError)
      return NextResponse.json(
        { success: false, error: personError.message },
        { status: 500 }
      )
    }

    // Si es familia, guardar hijos
    if (tipo === 'familia' && children && children.length > 0) {
      const childrenData = children.map((child: any) => ({
        family_id: person.id,
        nombre: child.nombre,
        nacimiento: child.nacimiento,
        curso_grupo: child.curso_grupo,
        alergias: child.alergias,
        permiso_imagenes: child.permiso_imagenes || false
      }))

      const { error: childrenError } = await supabase
        .from('family_children')
        .insert(childrenData)

      if (childrenError) {
        console.error('Error guardando hijos:', childrenError)
      }
    }

    return NextResponse.json({
      success: true,
      personId: person.id,
      message: 'Registro completado correctamente'
    })

  } catch (error) {
    console.error('Error en API submit:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
