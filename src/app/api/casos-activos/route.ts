import { NextRequest, NextResponse } from 'next/server'
import { supabase, logAuditAction } from '@/lib/supabase'

interface CasoActivoData {
  entidad_id: string
  delegado_id: string
  titulo: string
  descripcion: string
  tipo_caso: 'seguimiento' | 'incidencia' | 'protocolo' | 'revision'
  prioridad: 'baja' | 'media' | 'alta'
  estado?: 'activo' | 'pendiente' | 'en_revision' | 'resuelto' | 'cerrado'
  menor_afectado?: {
    nombre_iniciales: string
    edad: number
    genero: string
    grupo?: string
  }
  personal_involucrado?: Array<{
    nombre: string
    cargo: string
    presente: boolean
  }>
  ubicacion?: string
  fecha_incidente?: string
  acciones_realizadas?: string[]
  proxima_accion?: string
  fecha_proxima_accion?: string
  notas_seguimiento?: string
  familia_contactada?: boolean
  fecha_contacto_familia?: string
  documentos_adjuntos?: string[]
  evidencias?: string[]
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

// POST - Crear nuevo caso activo
export async function POST(request: NextRequest) {
  try {
    const data: CasoActivoData = await request.json()

    // Validaciones básicas
    if (!data.entidad_id || !data.delegado_id || !data.titulo || !data.descripcion || !data.tipo_caso) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: entidad_id, delegado_id, titulo, descripcion, tipo_caso' },
        { status: 400 }
      )
    }

    // Obtener metadatos de la petición
    const ip_address = await getUserIP(request)
    const legal_hash = generateLegalHash(data)

    // Preparar datos para inserción
    const casoData = {
      entidad_id: data.entidad_id,
      delegado_id: data.delegado_id,
      created_by: data.delegado_id,
      titulo: data.titulo,
      descripcion: data.descripcion,
      tipo_caso: data.tipo_caso,
      prioridad: data.prioridad,
      estado: data.estado || 'activo',
      menor_afectado: data.menor_afectado ? JSON.stringify(data.menor_afectado) : null,
      personal_involucrado: data.personal_involucrado ? JSON.stringify(data.personal_involucrado) : null,
      ubicacion: data.ubicacion,
      fecha_incidente: data.fecha_incidente || new Date().toISOString(),
      acciones_realizadas: data.acciones_realizadas || [],
      proxima_accion: data.proxima_accion,
      fecha_proxima_accion: data.fecha_proxima_accion,
      notas_seguimiento: data.notas_seguimiento,
      familia_contactada: data.familia_contactada || false,
      fecha_contacto_familia: data.fecha_contacto_familia,
      documentos_adjuntos: data.documentos_adjuntos || [],
      evidencias: data.evidencias || [],
      ip_address,
      legal_hash
    }

    // Insertar caso en la base de datos
    const { data: casoCreado, error: casoError } = await supabase
      .from('casos_activos')
      .insert([casoData])
      .select(`
        *,
        entidades!inner(nombre, email),
        delegados!inner(nombre, apellidos, email)
      `)
      .single()

    if (casoError) {
      console.error('❌ Error creando caso activo:', casoError)
      return NextResponse.json(
        { error: 'Error creando caso activo', details: casoError.message },
        { status: 500 }
      )
    }

    console.log('✅ Caso activo creado:', casoCreado.caso_id)

    // Registrar primera acción: Creación del caso
    const { error: accionError } = await supabase
      .from('caso_activo_acciones')
      .insert([{
        caso_activo_id: casoCreado.id,
        delegado_id: data.delegado_id,
        tipo_accion: 'creacion',
        descripcion: `Caso activo creado: ${data.tipo_caso} - ${data.titulo}`,
        resultado: 'caso_creado_exitosamente',
        fecha_completada: new Date().toISOString(),
        estado_accion: 'completada',
        ip_address,
        legal_hash: generateLegalHash({ accion: 'caso_creado', caso_id: casoCreado.caso_id })
      }])

    if (accionError) {
      console.error('❌ Error registrando acción:', accionError)
    }

    // Registrar en auditoría LOPIVI
    await logAuditAction(
      delegado.id,
      `${casoCreado.delegados.nombre} ${casoCreado.delegados.apellidos}`,
      'caso_activo_creado',
      'caso_activo',
      {
        tipo_caso: data.tipo_caso,
        titulo: data.titulo,
        prioridad: data.prioridad,
        entidad: casoCreado.entidades.nombre,
        ubicacion: data.ubicacion,
        familia_contactada: data.familia_contactada
      },
      casoCreado.caso_id
    )

    return NextResponse.json({
      success: true,
      caso: {
        id: casoCreado.id,
        caso_id: casoCreado.caso_id,
        titulo: casoCreado.titulo,
        tipo_caso: casoCreado.tipo_caso,
        estado: casoCreado.estado,
        prioridad: casoCreado.prioridad,
        fecha_creacion: casoCreado.created_at
      },
      message: 'Caso activo creado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API casos activos:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// GET - Obtener casos activos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entidadId = searchParams.get('entidad_id')
    const delegadoId = searchParams.get('delegado_id')
    const estado = searchParams.get('estado')
    const prioridad = searchParams.get('prioridad')
    const tipoCaso = searchParams.get('tipo_caso')
    const limite = parseInt(searchParams.get('limite') || '50')
    const incluirAcciones = searchParams.get('incluir_acciones') === 'true'

    let query = supabase
      .from('casos_activos')
      .select(`
        *,
        entidades!inner(nombre),
        delegados!casos_activos_delegado_id_fkey(nombre, apellidos),
        created_by_delegado:delegados!casos_activos_created_by_fkey(nombre, apellidos)
        ${incluirAcciones ? ',caso_activo_acciones(*)' : ''}
      `)
      .order('fecha_ultima_actualizacion', { ascending: false })
      .limit(limite)

    // Aplicar filtros
    if (entidadId) {
      query = query.eq('entidad_id', entidadId)
    }

    if (delegadoId) {
      query = query.eq('delegado_id', delegadoId)
    }

    if (estado) {
      query = query.eq('estado', estado)
    }

    if (prioridad) {
      query = query.eq('prioridad', prioridad)
    }

    if (tipoCaso) {
      query = query.eq('tipo_caso', tipoCaso)
    }

    const { data: casos, error } = await query

    if (error) {
      console.error('❌ Error obteniendo casos activos:', error)
      return NextResponse.json(
        { error: 'Error obteniendo casos activos', details: error.message },
        { status: 500 }
      )
    }

    // Procesar datos para el frontend
    const casosFormateados = casos?.map(caso => ({
      id: caso.id,
      caso_id: caso.caso_id,
      titulo: caso.titulo,
      descripcion: caso.descripcion,
      tipo_caso: caso.tipo_caso,
      prioridad: caso.prioridad,
      estado: caso.estado,
      ubicacion: caso.ubicacion,
      fecha_creacion: caso.fecha_creacion,
      fecha_incidente: caso.fecha_incidente,
      fecha_ultima_actualizacion: caso.fecha_ultima_actualizacion,
      menor_afectado: caso.menor_afectado ? JSON.parse(caso.menor_afectado) : null,
      personal_involucrado: caso.personal_involucrado ? JSON.parse(caso.personal_involucrado) : null,
      acciones_realizadas: caso.acciones_realizadas || [],
      proxima_accion: caso.proxima_accion,
      fecha_proxima_accion: caso.fecha_proxima_accion,
      notas_seguimiento: caso.notas_seguimiento,
      familia_contactada: caso.familia_contactada,
      fecha_contacto_familia: caso.fecha_contacto_familia,
      documentos_adjuntos: caso.documentos_adjuntos || [],
      evidencias: caso.evidencias || [],
      entidad: caso.entidades?.nombre,
      delegado: caso.delegados ? `${caso.delegados.nombre} ${caso.delegados.apellidos}` : null,
      creado_por: caso.created_by_delegado ? `${caso.created_by_delegado.nombre} ${caso.created_by_delegado.apellidos}` : null,
      acciones: incluirAcciones ? caso.caso_activo_acciones : undefined
    })) || []

    return NextResponse.json({
      success: true,
      casos: casosFormateados,
      total: casosFormateados.length,
      filtros_aplicados: {
        entidad_id: entidadId,
        delegado_id: delegadoId,
        estado,
        prioridad,
        tipo_caso: tipoCaso
      }
    })

  } catch (error) {
    console.error('❌ Error en GET casos activos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar caso activo
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const casoId = searchParams.get('caso_id')

    if (!casoId) {
      return NextResponse.json(
        { error: 'ID del caso requerido' },
        { status: 400 }
      )
    }

    const updateData = await request.json()
    const ip_address = await getUserIP(request)
    const legal_hash = generateLegalHash({ ...updateData, caso_id: casoId, timestamp: new Date().toISOString() })

    // Obtener caso actual para auditoría
    const { data: casoActual, error: casoError } = await supabase
      .from('casos_activos')
      .select('*, entidades(nombre), delegados(nombre, apellidos)')
      .eq('caso_id', casoId)
      .single()

    if (casoError || !casoActual) {
      return NextResponse.json(
        { error: 'Caso no encontrado' },
        { status: 404 }
      )
    }

    // Preparar datos de actualización
    const datosActualizacion = {
      ...updateData,
      updated_by: updateData.delegado_id || casoActual.delegado_id,
      legal_hash,
      ip_address
    }

    // Actualizar caso
    const { data: casoActualizado, error: updateError } = await supabase
      .from('casos_activos')
      .update(datosActualizacion)
      .eq('caso_id', casoId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error actualizando caso activo:', updateError)
      return NextResponse.json(
        { error: 'Error actualizando caso activo', details: updateError.message },
        { status: 500 }
      )
    }

    // Registrar acción de actualización
    await supabase
      .from('caso_activo_acciones')
      .insert([{
        caso_activo_id: casoActual.id,
        delegado_id: updateData.delegado_id || casoActual.delegado_id,
        tipo_accion: 'actualizacion',
        descripcion: `Caso actualizado: ${Object.keys(updateData).join(', ')}`,
        resultado: 'actualizacion_exitosa',
        fecha_completada: new Date().toISOString(),
        estado_accion: 'completada',
        observaciones: updateData.notas_seguimiento || null,
        ip_address,
        legal_hash: generateLegalHash({ accion: 'actualizacion', caso_id: casoId })
      }])

    // Registrar en auditoría LOPIVI
    await logAuditAction({
      user_name: `${casoActual.delegados.nombre} ${casoActual.delegados.apellidos}`,
      action_type: 'caso_activo_actualizado',
      entity_type: 'caso_activo',
      entity_id: casoId,
      details: {
        campos_actualizados: Object.keys(updateData),
        estado_anterior: casoActual.estado,
        estado_nuevo: updateData.estado || casoActual.estado,
        entidad: casoActual.entidades.nombre
      }
    })

    return NextResponse.json({
      success: true,
      caso: casoActualizado,
      message: 'Caso activo actualizado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en PUT casos activos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
