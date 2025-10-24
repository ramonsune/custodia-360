import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface AlertaLOPIVI {
  id: string
  entidad_id: string
  titulo: string
  descripcion: string
  tipo: 'urgente' | 'importante' | 'informativo'
  categoria: 'certificados' | 'formacion' | 'documentos' | 'auditoria' | 'casos' | 'comunicacion'
  estado: 'pendiente' | 'en_revision' | 'resuelta'
  prioridad: number
  fecha_creacion: string
  fecha_vencimiento?: string
  accion_requerida: string
  asignado_a: string
  datos_adicionales?: any
  created_at: string
  updated_at: string
}

// GET - Obtener alertas por entidad
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entidad_id = searchParams.get('entidad_id')
    const estado = searchParams.get('estado') // pendiente, en_revision, resuelta, todas
    const tipo = searchParams.get('tipo') // urgente, importante, informativo, todos

    if (!entidad_id) {
      return NextResponse.json({
        success: false,
        error: 'ID de entidad requerido'
      }, { status: 400 })
    }

    // Obtener alertas desde cumplimiento.alertas_pendientes
    let query = supabase
      .from('cumplimiento')
      .select('alertas_pendientes, entidad_id, fecha_actualizacion')
      .eq('entidad_id', entidad_id)
      .single()

    const { data: cumplimientoData, error: cumplimientoError } = await query

    if (cumplimientoError && cumplimientoError.code !== 'PGRST116') {
      throw cumplimientoError
    }

    let alertasExistentes: AlertaLOPIVI[] = []

    if (cumplimientoData?.alertas_pendientes) {
      alertasExistentes = Array.isArray(cumplimientoData.alertas_pendientes)
        ? cumplimientoData.alertas_pendientes
        : []
    }

    // Generar alertas automáticas
    const alertasAutomaticas = await generarAlertasAutomaticas(entidad_id)

    // Combinar alertas existentes con automáticas (evitando duplicados)
    const alertasCombinadas = [...alertasExistentes]

    for (const alertaAuto of alertasAutomaticas) {
      const existe = alertasCombinadas.find(a =>
        a.categoria === alertaAuto.categoria &&
        a.titulo === alertaAuto.titulo
      )
      if (!existe) {
        alertasCombinadas.push(alertaAuto)
      }
    }

    // Aplicar filtros
    let alertasFiltradas = alertasCombinadas

    if (estado && estado !== 'todas') {
      alertasFiltradas = alertasFiltradas.filter(a => a.estado === estado)
    }

    if (tipo && tipo !== 'todos') {
      alertasFiltradas = alertasFiltradas.filter(a => a.tipo === tipo)
    }

    // Ordenar por prioridad y fecha
    alertasFiltradas.sort((a, b) => {
      if (a.prioridad !== b.prioridad) {
        return b.prioridad - a.prioridad // Mayor prioridad primero
      }
      return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
    })

    // Guardar alertas actualizadas en BD
    if (alertasCombinadas.length !== alertasExistentes.length) {
      await actualizarAlertasEnBD(entidad_id, alertasCombinadas)
    }

    // Estadísticas
    const estadisticas = {
      total: alertasCombinadas.length,
      pendientes: alertasCombinadas.filter(a => a.estado === 'pendiente').length,
      en_revision: alertasCombinadas.filter(a => a.estado === 'en_revision').length,
      resueltas: alertasCombinadas.filter(a => a.estado === 'resuelta').length,
      urgentes: alertasCombinadas.filter(a => a.tipo === 'urgente').length,
      importantes: alertasCombinadas.filter(a => a.tipo === 'importante').length,
      informativos: alertasCombinadas.filter(a => a.tipo === 'informativo').length
    }

    return NextResponse.json({
      success: true,
      alertas: alertasFiltradas,
      estadisticas,
      ultima_actualizacion: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error obteniendo alertas:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// PUT - Actualizar estado de alerta
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { entidad_id, alerta_id, nuevo_estado, comentario } = body

    if (!entidad_id || !alerta_id || !nuevo_estado) {
      return NextResponse.json({
        success: false,
        error: 'Datos requeridos: entidad_id, alerta_id, nuevo_estado'
      }, { status: 400 })
    }

    // Obtener alertas actuales
    const { data: cumplimientoData, error: getError } = await supabase
      .from('cumplimiento')
      .select('alertas_pendientes')
      .eq('entidad_id', entidad_id)
      .single()

    if (getError) {
      throw getError
    }

    let alertas: AlertaLOPIVI[] = Array.isArray(cumplimientoData?.alertas_pendientes)
      ? cumplimientoData.alertas_pendientes
      : []

    // Buscar y actualizar la alerta
    const alertaIndex = alertas.findIndex(a => a.id === alerta_id)

    if (alertaIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Alerta no encontrada'
      }, { status: 404 })
    }

    // Actualizar alerta
    alertas[alertaIndex] = {
      ...alertas[alertaIndex],
      estado: nuevo_estado,
      updated_at: new Date().toISOString(),
      ...(comentario && { comentario_resolucion: comentario })
    }

    // Guardar en BD
    const { error: updateError } = await supabase
      .from('cumplimiento')
      .update({
        alertas_pendientes: alertas,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('entidad_id', entidad_id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      success: true,
      mensaje: 'Alerta actualizada correctamente',
      alerta_actualizada: alertas[alertaIndex]
    })

  } catch (error) {
    console.error('❌ Error actualizando alerta:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// POST - Crear nueva alerta manual
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      entidad_id,
      titulo,
      descripcion,
      tipo,
      categoria,
      prioridad,
      accion_requerida,
      fecha_vencimiento,
      asignado_a,
      datos_adicionales
    } = body

    if (!entidad_id || !titulo || !descripcion || !tipo) {
      return NextResponse.json({
        success: false,
        error: 'Datos requeridos: entidad_id, titulo, descripcion, tipo'
      }, { status: 400 })
    }

    // Crear nueva alerta
    const nuevaAlerta: AlertaLOPIVI = {
      id: `alerta-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      entidad_id,
      titulo,
      descripcion,
      tipo,
      categoria: categoria || 'comunicacion',
      estado: 'pendiente',
      prioridad: prioridad || (tipo === 'urgente' ? 5 : tipo === 'importante' ? 3 : 1),
      fecha_creacion: new Date().toISOString(),
      fecha_vencimiento,
      accion_requerida,
      asignado_a: asignado_a || 'Delegado Principal',
      datos_adicionales,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Obtener alertas actuales
    const { data: cumplimientoData, error: getError } = await supabase
      .from('cumplimiento')
      .select('alertas_pendientes')
      .eq('entidad_id', entidad_id)
      .single()

    let alertas: AlertaLOPIVI[] = []

    if (!getError && cumplimientoData?.alertas_pendientes) {
      alertas = Array.isArray(cumplimientoData.alertas_pendientes)
        ? cumplimientoData.alertas_pendientes
        : []
    }

    // Agregar nueva alerta
    alertas.push(nuevaAlerta)

    // Actualizar o insertar en BD
    const { error: upsertError } = await supabase
      .from('cumplimiento')
      .upsert({
        entidad_id,
        alertas_pendientes: alertas,
        fecha_actualizacion: new Date().toISOString()
      })

    if (upsertError) {
      throw upsertError
    }

    return NextResponse.json({
      success: true,
      mensaje: 'Alerta creada correctamente',
      alerta: nuevaAlerta
    })

  } catch (error) {
    console.error('❌ Error creando alerta:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// Función auxiliar: Generar alertas automáticas
async function generarAlertasAutomaticas(entidad_id: string): Promise<AlertaLOPIVI[]> {
  const alertas: AlertaLOPIVI[] = []
  const hoy = new Date()

  try {
    // 1. Alertas por certificados de antecedentes penales
    const { data: personalData } = await supabase
      .from('personal')
      .select('id, nombre, apellidos, cargo, fecha_vencimiento_antecedentes, certificado_antecedentes')
      .eq('entidad_id', entidad_id)
      .eq('estado', 'activo')

    if (personalData) {
      // Personal sin certificados
      const sinCertificados = personalData.filter(p => !p.certificado_antecedentes)
      if (sinCertificados.length > 0) {
        alertas.push({
          id: `auto-cert-${Date.now()}`,
          entidad_id,
          titulo: `${sinCertificados.length} miembro(s) sin certificado antecedentes penales`,
          descripcion: `Personal sin certificado: ${sinCertificados.map(p => `${p.nombre} ${p.apellidos}`).join(', ')}`,
          tipo: 'urgente',
          categoria: 'certificados',
          estado: 'pendiente',
          prioridad: 5,
          fecha_creacion: new Date().toISOString(),
          accion_requerida: 'Solicitar certificados de antecedentes penales urgentemente',
          asignado_a: 'Delegado Principal',
          datos_adicionales: { personal_afectado: sinCertificados.map(p => p.id) },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }

      // Certificados próximos a vencer (30 días)
      const proximosVencer = personalData.filter(p => {
        if (!p.fecha_vencimiento_antecedentes) return false
        const vencimiento = new Date(p.fecha_vencimiento_antecedentes)
        const diasRestantes = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
        return diasRestantes <= 30 && diasRestantes > 0
      })

      if (proximosVencer.length > 0) {
        alertas.push({
          id: `auto-venc-${Date.now()}`,
          entidad_id,
          titulo: `${proximosVencer.length} certificado(s) próximos a vencer`,
          descripcion: `Certificados que vencen en los próximos 30 días: ${proximosVencer.map(p => `${p.nombre} ${p.apellidos}`).join(', ')}`,
          tipo: 'importante',
          categoria: 'certificados',
          estado: 'pendiente',
          prioridad: 4,
          fecha_creacion: new Date().toISOString(),
          accion_requerida: 'Programar renovación de certificados',
          asignado_a: 'Delegado Principal',
          datos_adicionales: { personal_afectado: proximosVencer.map(p => p.id) },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    }

    // 2. Alertas por formación LOPIVI pendiente
    const personalSinFormacion = personalData?.filter(p => !p.formacion_lopivi_completada)
    if (personalSinFormacion && personalSinFormacion.length > 0) {
      alertas.push({
        id: `auto-form-${Date.now()}`,
        entidad_id,
        titulo: `${personalSinFormacion.length} miembro(s) sin formación LOPIVI`,
        descripcion: `Personal pendiente de formación: ${personalSinFormacion.map(p => `${p.nombre} ${p.apellidos}`).join(', ')}`,
        tipo: 'importante',
        categoria: 'formacion',
        estado: 'pendiente',
        prioridad: 4,
        fecha_creacion: new Date().toISOString(),
        accion_requerida: 'Programar sesiones de formación LOPIVI',
        asignado_a: 'Delegado Principal',
        datos_adicionales: { personal_afectado: personalSinFormacion.map(p => p.id) },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    // 3. Alertas por casos urgentes sin resolver
    const { data: casosData } = await supabase
      .from('casos_urgentes')
      .select('id, titulo, estado, fecha_creacion')
      .eq('entidad_id', entidad_id)
      .in('estado', ['activo', 'en_investigacion'])

    if (casosData) {
      const casosSinResolver = casosData.filter(caso => {
        const fechaCreacion = new Date(caso.fecha_creacion)
        const horasTranscurridas = (hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60)
        return horasTranscurridas > 48 // Más de 48 horas sin resolver
      })

      if (casosSinResolver.length > 0) {
        alertas.push({
          id: `auto-casos-${Date.now()}`,
          entidad_id,
          titulo: `${casosSinResolver.length} caso(s) urgente(s) sin resolver`,
          descripcion: `Casos con más de 48h sin resolución: ${casosSinResolver.map(c => c.titulo).join(', ')}`,
          tipo: 'urgente',
          categoria: 'casos',
          estado: 'pendiente',
          prioridad: 5,
          fecha_creacion: new Date().toISOString(),
          accion_requerida: 'Revisar y actualizar estado de casos urgentes',
          asignado_a: 'Delegado Principal',
          datos_adicionales: { casos_afectados: casosSinResolver.map(c => c.id) },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    }

    return alertas

  } catch (error) {
    console.error('❌ Error generando alertas automáticas:', error)
    return []
  }
}

// Función auxiliar: Actualizar alertas en BD
async function actualizarAlertasEnBD(entidad_id: string, alertas: AlertaLOPIVI[]) {
  try {
    const { error } = await supabase
      .from('cumplimiento')
      .upsert({
        entidad_id,
        alertas_pendientes: alertas,
        fecha_actualizacion: new Date().toISOString()
      })

    if (error) {
      console.error('❌ Error actualizando alertas en BD:', error)
    }
  } catch (error) {
    console.error('❌ Error en actualizarAlertasEnBD:', error)
  }
}
