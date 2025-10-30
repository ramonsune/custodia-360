import { NextRequest, NextResponse } from 'next/server'
import { supabase, logAuditAction } from '@/lib/supabase'

interface AccionCasoData {
  caso_activo_id: string
  delegado_id: string
  tipo_accion: 'seguimiento' | 'contacto_familia' | 'revision' | 'actualizacion' | 'documentacion' | 'cierre'
  descripcion: string
  resultado?: string
  fecha_programada?: string
  fecha_completada?: string
  estado_accion?: 'programada' | 'en_progreso' | 'completada' | 'cancelada'
  archivos_adjuntos?: string[]
  observaciones?: string
}

// Función para generar hash legal
function generateLegalHash(data: any): string {
  const timestamp = new Date().toISOString()
  const dataString = JSON.stringify(data) + timestamp
  return btoa(dataString).slice(0, 32)
}

// Función para obtener IP (simulada)
async function getUserIP(request: NextRequest): Promise<string> {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0] || '127.0.0.1'
}

// POST - Crear nueva acción para caso activo
export async function POST(request: NextRequest) {
  try {
    const data: AccionCasoData = await request.json()

    // Validaciones básicas
    if (!data.caso_activo_id || !data.delegado_id || !data.tipo_accion || !data.descripcion) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: caso_activo_id, delegado_id, tipo_accion, descripcion' },
        { status: 400 }
      )
    }

    // Verificar que el caso activo existe
    const { data: casoActivo, error: casoError } = await supabase
      .from('casos_activos')
      .select('*, entidades(nombre), delegados(nombre, apellidos)')
      .eq('id', data.caso_activo_id)
      .single()

    if (casoError || !casoActivo) {
      return NextResponse.json(
        { error: 'Caso activo no encontrado' },
        { status: 404 }
      )
    }

    // Obtener metadatos de la petición
    const ip_address = await getUserIP(request)
    const legal_hash = generateLegalHash(data)

    // Preparar datos para inserción
    const accionData = {
      caso_activo_id: data.caso_activo_id,
      delegado_id: data.delegado_id,
      tipo_accion: data.tipo_accion,
      descripcion: data.descripcion,
      resultado: data.resultado,
      fecha_programada: data.fecha_programada,
      fecha_completada: data.fecha_completada,
      estado_accion: data.estado_accion || 'programada',
      archivos_adjuntos: data.archivos_adjuntos || [],
      observaciones: data.observaciones,
      ip_address,
      legal_hash
    }

    // Insertar acción en la base de datos
    const { data: accionCreada, error: accionError } = await supabase
      .from('caso_activo_acciones')
      .insert([accionData])
      .select(`
        *,
        delegados!inner(nombre, apellidos, email)
      `)
      .single()

    if (accionError) {
      console.error('❌ Error creando acción de caso activo:', accionError)
      return NextResponse.json(
        { error: 'Error creando acción', details: accionError.message },
        { status: 500 }
      )
    }

    console.log('✅ Acción de caso activo creada:', accionCreada.id)

    // Actualizar fecha de última actualización del caso
    await supabase
      .from('casos_activos')
      .update({
        fecha_ultima_actualizacion: new Date().toISOString(),
        updated_by: data.delegado_id
      })
      .eq('id', data.caso_activo_id)

    // Registrar en auditoría LOPIVI
    await logAuditAction({
      user_name: `${accionCreada.delegados.nombre} ${accionCreada.delegados.apellidos}`,
      action_type: 'caso_activo_accion_creada',
      entity_type: 'caso_activo_accion',
      entity_id: accionCreada.id,
      details: {
        caso_id: casoActivo.caso_id,
        tipo_accion: data.tipo_accion,
        descripcion: data.descripcion,
        estado_accion: data.estado_accion,
        entidad: casoActivo.entidades.nombre
      }
    })

    return NextResponse.json({
      success: true,
      accion: {
        id: accionCreada.id,
        tipo_accion: accionCreada.tipo_accion,
        descripcion: accionCreada.descripcion,
        estado_accion: accionCreada.estado_accion,
        fecha_creacion: accionCreada.timestamp,
        delegado: `${accionCreada.delegados.nombre} ${accionCreada.delegados.apellidos}`
      },
      message: 'Acción creada exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API acciones casos activos:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// GET - Obtener acciones de un caso activo
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const casoActivoId = searchParams.get('caso_activo_id')
    const delegadoId = searchParams.get('delegado_id')
    const tipoAccion = searchParams.get('tipo_accion')
    const estadoAccion = searchParams.get('estado_accion')
    const limite = parseInt(searchParams.get('limite') || '20')

    let query = supabase
      .from('caso_activo_acciones')
      .select(`
        *,
        delegados!inner(nombre, apellidos, email),
        casos_activos!inner(caso_id, titulo, entidades(nombre))
      `)
      .order('timestamp', { ascending: false })
      .limit(limite)

    // Aplicar filtros
    if (casoActivoId) {
      query = query.eq('caso_activo_id', casoActivoId)
    }

    if (delegadoId) {
      query = query.eq('delegado_id', delegadoId)
    }

    if (tipoAccion) {
      query = query.eq('tipo_accion', tipoAccion)
    }

    if (estadoAccion) {
      query = query.eq('estado_accion', estadoAccion)
    }

    const { data: acciones, error } = await query

    if (error) {
      console.error('❌ Error obteniendo acciones:', error)
      return NextResponse.json(
        { error: 'Error obteniendo acciones', details: error.message },
        { status: 500 }
      )
    }

    // Formatear datos para el frontend
    const accionesFormateadas = acciones?.map(accion => ({
      id: accion.id,
      caso_activo_id: accion.caso_activo_id,
      caso_id: accion.casos_activos?.caso_id,
      caso_titulo: accion.casos_activos?.titulo,
      entidad: accion.casos_activos?.entidades?.nombre,
      tipo_accion: accion.tipo_accion,
      descripcion: accion.descripcion,
      resultado: accion.resultado,
      fecha_programada: accion.fecha_programada,
      fecha_completada: accion.fecha_completada,
      estado_accion: accion.estado_accion,
      archivos_adjuntos: accion.archivos_adjuntos || [],
      observaciones: accion.observaciones,
      delegado: `${accion.delegados.nombre} ${accion.delegados.apellidos}`,
      fecha_creacion: accion.timestamp
    })) || []

    return NextResponse.json({
      success: true,
      acciones: accionesFormateadas,
      total: accionesFormateadas.length,
      filtros_aplicados: {
        caso_activo_id: casoActivoId,
        delegado_id: delegadoId,
        tipo_accion: tipoAccion,
        estado_accion: estadoAccion
      }
    })

  } catch (error) {
    console.error('❌ Error en GET acciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar acción de caso activo
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accionId = searchParams.get('accion_id')

    if (!accionId) {
      return NextResponse.json(
        { error: 'ID de la acción requerido' },
        { status: 400 }
      )
    }

    const updateData = await request.json()
    const ip_address = await getUserIP(request)
    const legal_hash = generateLegalHash({ ...updateData, accion_id: accionId, timestamp: new Date().toISOString() })

    // Obtener acción actual para auditoría
    const { data: accionActual, error: accionError } = await supabase
      .from('caso_activo_acciones')
      .select(`
        *,
        delegados(nombre, apellidos),
        casos_activos(caso_id, titulo, entidades(nombre))
      `)
      .eq('id', accionId)
      .single()

    if (accionError || !accionActual) {
      return NextResponse.json(
        { error: 'Acción no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar acción
    const { data: accionActualizada, error: updateError } = await supabase
      .from('caso_activo_acciones')
      .update({
        ...updateData,
        legal_hash,
        ip_address
      })
      .eq('id', accionId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error actualizando acción:', updateError)
      return NextResponse.json(
        { error: 'Error actualizando acción', details: updateError.message },
        { status: 500 }
      )
    }

    // Actualizar fecha de última actualización del caso padre
    await supabase
      .from('casos_activos')
      .update({
        fecha_ultima_actualizacion: new Date().toISOString()
      })
      .eq('id', accionActual.caso_activo_id)

    // Registrar en auditoría LOPIVI
    await logAuditAction({
      user_name: `${accionActual.delegados.nombre} ${accionActual.delegados.apellidos}`,
      action_type: 'caso_activo_accion_actualizada',
      entity_type: 'caso_activo_accion',
      entity_id: accionId,
      details: {
        caso_id: accionActual.casos_activos.caso_id,
        campos_actualizados: Object.keys(updateData),
        estado_anterior: accionActual.estado_accion,
        estado_nuevo: updateData.estado_accion || accionActual.estado_accion,
        entidad: accionActual.casos_activos.entidades.nombre
      }
    })

    return NextResponse.json({
      success: true,
      accion: accionActualizada,
      message: 'Acción actualizada exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en PUT acción:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar acción (soft delete con auditoría)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accionId = searchParams.get('accion_id')
    const motivoEliminacion = searchParams.get('motivo')

    if (!accionId) {
      return NextResponse.json(
        { error: 'ID de la acción requerido' },
        { status: 400 }
      )
    }

    // Obtener acción para auditoría antes de eliminar
    const { data: accionAEliminar, error: accionError } = await supabase
      .from('caso_activo_acciones')
      .select(`
        *,
        delegados(nombre, apellidos),
        casos_activos(caso_id, titulo, entidades(nombre))
      `)
      .eq('id', accionId)
      .single()

    if (accionError || !accionAEliminar) {
      return NextResponse.json(
        { error: 'Acción no encontrada' },
        { status: 404 }
      )
    }

    // Registrar eliminación en auditoría ANTES de borrar
    await logAuditAction({
      user_name: `${accionAEliminar.delegados.nombre} ${accionAEliminar.delegados.apellidos}`,
      action_type: 'caso_activo_accion_eliminada',
      entity_type: 'caso_activo_accion',
      entity_id: accionId,
      details: {
        caso_id: accionAEliminar.casos_activos.caso_id,
        tipo_accion: accionAEliminar.tipo_accion,
        descripcion: accionAEliminar.descripcion,
        motivo_eliminacion: motivoEliminacion || 'No especificado',
        entidad: accionAEliminar.casos_activos.entidades.nombre
      }
    })

    // Eliminar acción
    const { error: deleteError } = await supabase
      .from('caso_activo_acciones')
      .delete()
      .eq('id', accionId)

    if (deleteError) {
      console.error('❌ Error eliminando acción:', deleteError)
      return NextResponse.json(
        { error: 'Error eliminando acción', details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Acción eliminada exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en DELETE acción:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
