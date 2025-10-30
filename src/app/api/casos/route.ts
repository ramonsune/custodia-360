import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entidad_id = searchParams.get('entidad_id')
    const delegado_suplente_id = searchParams.get('delegado_suplente_id')
    const estado = searchParams.get('estado') // 'activo', 'pendiente', 'resuelto', 'todos'

    if (!entidad_id) {
      return NextResponse.json({
        success: false,
        error: 'ID de entidad requerido'
      }, { status: 400 })
    }

    let query = supabase
      .from('casos_lopivi')
      .select(`
        id,
        titulo,
        descripcion,
        estado,
        prioridad,
        fecha_creacion,
        fecha_actualizacion,
        delegado_principal_id,
        delegado_suplente_id,
        menor_afectado_nombre,
        observaciones,
        acciones_tomadas
      `)
      .eq('entidad_id', entidad_id)

    // Filtrar por delegado suplente si se especifica
    if (delegado_suplente_id) {
      query = query.eq('delegado_suplente_id', delegado_suplente_id)
    }

    // Filtrar por estado si se especifica
    if (estado && estado !== 'todos') {
      query = query.eq('estado', estado)
    }

    // Ordenar por fecha de creación descendente
    query = query.order('fecha_creacion', { ascending: false })

    const { data: casos, error } = await query

    if (error) {
      console.error('❌ Error obteniendo casos:', error)
      return NextResponse.json({
        success: false,
        error: 'Error consultando casos en la base de datos'
      }, { status: 500 })
    }

    // Formatear datos para el frontend
    const casosFormateados = casos?.map(caso => ({
      id: caso.id,
      titulo: caso.titulo,
      descripcion: caso.descripcion,
      estado: caso.estado,
      prioridad: caso.prioridad,
      fechaCreacion: caso.fecha_creacion?.split('T')[0] || '',
      fechaActualizacion: caso.fecha_actualizacion?.split('T')[0] || '',
      delegadoPrincipalId: caso.delegado_principal_id,
      delegadoSuplenteId: caso.delegado_suplente_id,
      menorAfectado: caso.menor_afectado_nombre,
      observaciones: caso.observaciones,
      accionesTomadas: caso.acciones_tomadas
    })) || []

    // Calcular estadísticas
    const estadisticas = {
      total: casosFormateados.length,
      activos: casosFormateados.filter(c => c.estado === 'activo').length,
      pendientes: casosFormateados.filter(c => c.estado === 'pendiente').length,
      resueltos: casosFormateados.filter(c => c.estado === 'resuelto').length,
      prioridad_alta: casosFormateados.filter(c => c.prioridad === 'alta').length,
      prioridad_media: casosFormateados.filter(c => c.prioridad === 'media').length,
      prioridad_baja: casosFormateados.filter(c => c.prioridad === 'baja').length
    }

    return NextResponse.json({
      success: true,
      casos: casosFormateados,
      estadisticas: estadisticas,
      total_casos: casosFormateados.length
    })

  } catch (error) {
    console.error('❌ Error en GET /api/casos:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      titulo,
      descripcion,
      prioridad = 'media',
      entidad_id,
      delegado_principal_id,
      delegado_suplente_id,
      menor_afectado_nombre,
      observaciones
    } = body

    // Validaciones
    if (!titulo || !descripcion || !entidad_id) {
      return NextResponse.json({
        success: false,
        error: 'Campos obligatorios: titulo, descripcion, entidad_id'
      }, { status: 400 })
    }

    // Crear nuevo caso
    const nuevoCaso = {
      titulo,
      descripcion,
      estado: 'activo',
      prioridad,
      entidad_id,
      delegado_principal_id,
      delegado_suplente_id,
      menor_afectado_nombre,
      observaciones,
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    }

    const { data: caso, error } = await supabase
      .from('casos_lopivi')
      .insert(nuevoCaso)
      .select()
      .single()

    if (error) {
      console.error('❌ Error creando caso:', error)
      return NextResponse.json({
        success: false,
        error: 'Error creando caso en la base de datos'
      }, { status: 500 })
    }

    // Registrar en historial de auditoría
    await supabase.from('historial_auditoria').insert({
      entidad_id,
      tipo_evento: 'caso_creado',
      descripcion: `Nuevo caso creado: ${titulo}`,
      usuario_id: delegado_principal_id || delegado_suplente_id,
      fecha_evento: new Date().toISOString(),
      detalles_json: { caso_id: caso.id, prioridad }
    })

    return NextResponse.json({
      success: true,
      caso: {
        id: caso.id,
        titulo: caso.titulo,
        descripcion: caso.descripcion,
        estado: caso.estado,
        prioridad: caso.prioridad,
        fechaCreacion: caso.fecha_creacion?.split('T')[0] || '',
        fechaActualizacion: caso.fecha_actualizacion?.split('T')[0] || ''
      },
      message: 'Caso creado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en POST /api/casos:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      caso_id,
      titulo,
      descripcion,
      estado,
      prioridad,
      observaciones,
      acciones_tomadas,
      delegado_suplente_id
    } = body

    if (!caso_id) {
      return NextResponse.json({
        success: false,
        error: 'ID del caso requerido'
      }, { status: 400 })
    }

    // Preparar datos de actualización
    const datosActualizacion: any = {
      fecha_actualizacion: new Date().toISOString()
    }

    if (titulo) datosActualizacion.titulo = titulo
    if (descripcion) datosActualizacion.descripcion = descripcion
    if (estado) datosActualizacion.estado = estado
    if (prioridad) datosActualizacion.prioridad = prioridad
    if (observaciones) datosActualizacion.observaciones = observaciones
    if (acciones_tomadas) datosActualizacion.acciones_tomadas = acciones_tomadas

    const { data: caso, error } = await supabase
      .from('casos_lopivi')
      .update(datosActualizacion)
      .eq('id', caso_id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error actualizando caso:', error)
      return NextResponse.json({
        success: false,
        error: 'Error actualizando caso en la base de datos'
      }, { status: 500 })
    }

    // Registrar en historial
    if (delegado_suplente_id) {
      await supabase.from('historial_auditoria').insert({
        entidad_id: caso.entidad_id,
        tipo_evento: 'caso_actualizado',
        descripcion: `Caso actualizado por delegado suplente: ${caso.titulo}`,
        usuario_id: delegado_suplente_id,
        fecha_evento: new Date().toISOString(),
        detalles_json: { caso_id, cambios: Object.keys(datosActualizacion) }
      })
    }

    return NextResponse.json({
      success: true,
      caso: {
        id: caso.id,
        titulo: caso.titulo,
        descripcion: caso.descripcion,
        estado: caso.estado,
        prioridad: caso.prioridad,
        fechaCreacion: caso.fecha_creacion?.split('T')[0] || '',
        fechaActualizacion: caso.fecha_actualizacion?.split('T')[0] || '',
        observaciones: caso.observaciones,
        accionesTomadas: caso.acciones_tomadas
      },
      message: 'Caso actualizado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en PUT /api/casos:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}
