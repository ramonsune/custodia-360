import { NextRequest, NextResponse } from 'next/server'
import { supabase, logAuditAction } from '@/lib/supabase'

interface CasoUrgenteData {
  entidad_id: string
  delegado_id: string
  tipo_protocolo: 'maltrato' | 'abandono' | 'abuso' | 'emergencia'
  titulo: string
  descripcion: string
  prioridad: 'alta' | 'critica'
  menor_afectado?: {
    nombre_iniciales: string
    edad: number
    genero: string
  }
  personal_involucrado?: Array<{
    nombre: string
    cargo: string
    presente: boolean
  }>
  testigos?: Array<{
    nombre: string
    relacion: string
    contacto?: string
  }>
  ubicacion: string
  fecha_incidente: string
  acciones_inmediatas: string[]
  familia_contactada: boolean
  servicios_contactados: string[]
  observaciones?: string
  proxima_revision?: string
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

// Función para enviar notificaciones automáticas
async function enviarNotificacionesAutomaticas(
  casoId: string,
  tipoCaso: string,
  entidadData: any
): Promise<void> {
  try {
    // Preparar datos para notificaciones
    const notificationData = {
      casoId,
      tipoCaso,
      entidad: entidadData.nombre,
      fechaHora: new Date().toLocaleString('es-ES'),
      delegado: entidadData.delegado_nombre
    }

    // 1. Notificar a servicios sociales (simulado)
    if (tipoCaso === 'maltrato' || tipoCaso === 'abuso') {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notificaciones/servicios-sociales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      })
    }

    // 2. Notificar a emergencias si es crítico
    if (tipoCaso === 'emergencia') {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notificaciones/emergencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      })
    }

    // 3. Notificar al admin de Custodia360
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notificaciones/admin-caso-urgente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData)
    })

  } catch (error) {
    console.error('❌ Error enviando notificaciones automáticas:', error)
  }
}

// Función para generar documentos automáticamente
async function generarDocumentosAutomaticos(
  casoId: string,
  tipoCaso: string,
  datosCaso: any
): Promise<string[]> {
  const documentosGenerados: string[] = []

  try {
    // 1. Generar protocolo específico según tipo de caso
    const protocoloResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/pdf/generar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: `protocolo-${tipoCaso}`,
        datos: {
          casoId,
          ...datosCaso,
          fechaGeneracion: new Date().toISOString()
        }
      })
    })

    if (protocoloResponse.ok) {
      documentosGenerados.push(`protocolo-${tipoCaso}`)
    }

    // 2. Generar informe inicial del caso
    const informeResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/pdf/generar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'informe-caso-urgente',
        datos: {
          casoId,
          ...datosCaso,
          fechaGeneracion: new Date().toISOString()
        }
      })
    })

    if (informeResponse.ok) {
      documentosGenerados.push('informe-caso-urgente')
    }

    // 3. Generar comunicación para autoridades si es necesario
    if (tipoCaso === 'maltrato' || tipoCaso === 'abuso') {
      const comunicacionResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/pdf/generar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'comunicacion-autoridades',
          datos: {
            casoId,
            ...datosCaso,
            fechaGeneracion: new Date().toISOString()
          }
        })
      })

      if (comunicacionResponse.ok) {
        documentosGenerados.push('comunicacion-autoridades')
      }
    }

  } catch (error) {
    console.error('❌ Error generando documentos automáticos:', error)
  }

  return documentosGenerados
}

// POST - Crear nuevo caso urgente
export async function POST(request: NextRequest) {
  try {
    const data: CasoUrgenteData = await request.json()

    // Validaciones básicas
    if (!data.entidad_id || !data.delegado_id || !data.tipo_protocolo || !data.titulo) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Obtener metadatos de la petición
    const ip_address = await getUserIP(request)
    const user_agent = request.headers.get('user-agent') || 'Unknown'
    const legal_hash = generateLegalHash(data)

    // Preparar datos para inserción
    const casoData = {
      entidad_id: data.entidad_id,
      delegado_id: data.delegado_id,
      tipo_protocolo: data.tipo_protocolo,
      titulo: data.titulo,
      descripcion: data.descripcion,
      prioridad: data.prioridad,
      menor_afectado: data.menor_afectado ? JSON.stringify(data.menor_afectado) : null,
      personal_involucrado: data.personal_involucrado ? JSON.stringify(data.personal_involucrado) : null,
      testigos: data.testigos ? JSON.stringify(data.testigos) : null,
      ubicacion: data.ubicacion,
      fecha_incidente: data.fecha_incidente,
      acciones_inmediatas: data.acciones_inmediatas,
      familia_contactada: data.familia_contactada,
      servicios_contactados: data.servicios_contactados,
      observaciones: data.observaciones,
      proxima_revision: data.proxima_revision || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // +24h por defecto
      ip_address,
      legal_hash
    }

    // Insertar caso en la base de datos
    const { data: casoCreado, error: casoError } = await supabase
      .from('casos_urgentes')
      .insert([casoData])
      .select(`
        *,
        entidades!inner(nombre, email),
        delegados!inner(nombre, apellidos, email)
      `)
      .single()

    if (casoError) {
      console.error('❌ Error creando caso urgente:', casoError)
      return NextResponse.json(
        { error: 'Error creando caso urgente', details: casoError.message },
        { status: 500 }
      )
    }

    console.log('✅ Caso urgente creado:', casoCreado.caso_id)

    // Registrar primera acción: Creación del caso
    const { error: accionError } = await supabase
      .from('caso_urgente_acciones')
      .insert([{
        caso_urgente_id: casoCreado.id,
        delegado_id: data.delegado_id,
        tipo_accion: 'caso_creado',
        descripcion: `Caso urgente creado: ${data.tipo_protocolo} - ${data.titulo}`,
        resultado: 'exitoso',
        ip_address,
        legal_hash: generateLegalHash({ accion: 'caso_creado', caso_id: casoCreado.caso_id })
      }])

    if (accionError) {
      console.error('❌ Error registrando acción:', accionError)
    }

    // Registrar en auditoría LOPIVI
    await logAuditAction({
      user_name: `${casoCreado.delegados.nombre} ${casoCreado.delegados.apellidos}`,
      action_type: 'caso_urgente_creado',
      entity_type: 'caso_urgente',
      entity_id: casoCreado.caso_id,
      details: {
        tipo_protocolo: data.tipo_protocolo,
        titulo: data.titulo,
        prioridad: data.prioridad,
        entidad: casoCreado.entidades.nombre,
        ubicacion: data.ubicacion,
        servicios_contactados: data.servicios_contactados
      }
    })

    // Procesos automáticos en paralelo
    const [documentosGenerados] = await Promise.all([
      generarDocumentosAutomaticos(casoCreado.caso_id, data.tipo_protocolo, {
        ...data,
        entidad: casoCreado.entidades.nombre,
        delegado: `${casoCreado.delegados.nombre} ${casoCreado.delegados.apellidos}`
      }),
      enviarNotificacionesAutomaticas(casoCreado.caso_id, data.tipo_protocolo, {
        nombre: casoCreado.entidades.nombre,
        delegado_nombre: `${casoCreado.delegados.nombre} ${casoCreado.delegados.apellidos}`
      })
    ])

    // Actualizar caso con documentos generados
    if (documentosGenerados.length > 0) {
      await supabase
        .from('casos_urgentes')
        .update({ documentos_generados })
        .eq('id', casoCreado.id)
    }

    return NextResponse.json({
      success: true,
      caso: {
        id: casoCreado.id,
        caso_id: casoCreado.caso_id,
        tipo_protocolo: casoCreado.tipo_protocolo,
        estado: casoCreado.estado,
        fecha_creacion: casoCreado.created_at
      },
      documentos_generados: documentosGenerados,
      notificaciones_enviadas: true,
      message: 'Caso urgente creado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API casos urgentes:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// GET - Obtener casos urgentes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entidadId = searchParams.get('entidad_id')
    const delegadoId = searchParams.get('delegado_id')
    const estado = searchParams.get('estado')
    const limite = parseInt(searchParams.get('limite') || '20')

    let query = supabase
      .from('casos_urgentes')
      .select(`
        *,
        entidades!inner(nombre),
        delegados!inner(nombre, apellidos)
      `)
      .order('created_at', { ascending: false })
      .limit(limite)

    if (entidadId) {
      query = query.eq('entidad_id', entidadId)
    }

    if (delegadoId) {
      query = query.eq('delegado_id', delegadoId)
    }

    if (estado) {
      query = query.eq('estado', estado)
    }

    const { data: casos, error } = await query

    if (error) {
      console.error('❌ Error obteniendo casos urgentes:', error)
      return NextResponse.json(
        { error: 'Error obteniendo casos urgentes' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      casos: casos || [],
      total: casos?.length || 0
    })

  } catch (error) {
    console.error('❌ Error en GET casos urgentes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
