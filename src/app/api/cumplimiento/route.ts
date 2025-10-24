import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET - Obtener estado de cumplimiento de una entidad
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const entidad_id = searchParams.get('entidad_id')

    if (!entidad_id) {
      return NextResponse.json({ error: 'entidad_id es requerido' }, { status: 400 })
    }

    // Inicializar elementos de cumplimiento si no existen
    await inicializarCumplimientoSiNoExiste(entidad_id)

    // Obtener todos los elementos de cumplimiento
    const { data: elementos, error: errorElementos } = await supabase
      .from('cumplimiento_lopivi')
      .select('*')
      .eq('entidad_id', entidad_id)
      .order('elemento_tipo')

    if (errorElementos) {
      console.error('Error obteniendo elementos:', errorElementos)
      return NextResponse.json({ error: 'Error obteniendo cumplimiento', details: errorElementos.message }, { status: 500 })
    }

    // Calcular datos dinámicos reales
    const datosCalculados = await calcularDatosRealCumplimiento(entidad_id)

    // Actualizar elementos con datos reales
    const elementosActualizados = await actualizarElementosConDatosReales(entidad_id, elementos, datosCalculados)

    // Calcular porcentaje total
    const elementosCompletados = elementosActualizados.filter(e => e.estado).length
    const porcentajeTotal = Math.round((elementosCompletados / elementosActualizados.length) * 100)

    // Obtener última auditoría
    const { data: ultimaAuditoria } = await supabase
      .from('auditorias_lopivi')
      .select('*')
      .eq('entidad_id', entidad_id)
      .order('fecha_auditoria', { ascending: false })
      .limit(1)
      .single()

    const respuesta = {
      success: true,
      cumplimiento: {
        porcentaje_total: porcentajeTotal,
        elementos_completados: elementosCompletados,
        total_elementos: elementosActualizados.length,
        elementos: elementosActualizados,
        ultima_actualizacion: new Date().toISOString(),
        proxima_auditoria: calcularProximaAuditoria(ultimaAuditoria),
        estado_general: obtenerEstadoGeneral(porcentajeTotal)
      },
      auditoria: ultimaAuditoria || null
    }

    return NextResponse.json(respuesta)

  } catch (error) {
    console.error('Error en GET cumplimiento:', error)
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 })
  }
}

// PUT - Actualizar elemento específico de cumplimiento
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { entidad_id, elemento_tipo, estado, observaciones, documentos_adjuntos, usuario_id } = body

    if (!entidad_id || !elemento_tipo || estado === undefined) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Obtener estado anterior para historial
    const { data: estadoAnterior } = await supabase
      .from('cumplimiento_lopivi')
      .select('estado, porcentaje_parcial')
      .eq('entidad_id', entidad_id)
      .eq('elemento_tipo', elemento_tipo)
      .single()

    // Actualizar elemento
    const { data, error } = await supabase
      .from('cumplimiento_lopivi')
      .update({
        estado,
        fecha_completado: estado ? new Date().toISOString() : null,
        observaciones,
        documentos_adjuntos: documentos_adjuntos || [],
        updated_at: new Date().toISOString()
      })
      .eq('entidad_id', entidad_id)
      .eq('elemento_tipo', elemento_tipo)
      .select()

    if (error) {
      console.error('Error actualizando cumplimiento:', error)
      return NextResponse.json({ error: 'Error actualizando cumplimiento', details: error.message }, { status: 500 })
    }

    // Registrar en historial si cambió el estado
    if (estadoAnterior && estadoAnterior.estado !== estado) {
      await registrarCambioHistorial(entidad_id, elemento_tipo, estadoAnterior.estado, estado, usuario_id, observaciones)
    }

    // Generar alerta si cumplimiento bajó del 80%
    const porcentajeActual = await calcularPorcentajeTotal(entidad_id)
    if (porcentajeActual < 80) {
      await generarAlertaCumplimientoBajo(entidad_id, porcentajeActual)
    }

    return NextResponse.json({
      success: true,
      elemento: data[0],
      nuevo_porcentaje: porcentajeActual,
      mensaje: `Elemento ${elemento_tipo} ${estado ? 'completado' : 'marcado como pendiente'} correctamente`
    })

  } catch (error) {
    console.error('Error en PUT cumplimiento:', error)
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 })
  }
}

// POST - Crear nueva auditoría
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { entidad_id, tipo = 'anual', auditor_externo, fecha_auditoria } = body

    if (!entidad_id) {
      return NextResponse.json({ error: 'entidad_id es requerido' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('auditorias_lopivi')
      .insert({
        entidad_id,
        tipo,
        fecha_auditoria: fecha_auditoria || new Date().toISOString().split('T')[0],
        auditor_externo,
        estado: 'pendiente'
      })
      .select()

    if (error) {
      console.error('Error creando auditoría:', error)
      return NextResponse.json({ error: 'Error creando auditoría', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, auditoria: data[0] })

  } catch (error) {
    console.error('Error en POST cumplimiento:', error)
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 })
  }
}

// Funciones auxiliares
async function inicializarCumplimientoSiNoExiste(entidad_id: string) {
  const elementos = [
    'plan_proteccion',
    'delegado_principal',
    'delegado_suplente',
    'personal_formado',
    'protocolos_actualizados',
    'canal_comunicacion',
    'registro_casos',
    'auditoria_anual'
  ]

  for (const elemento of elementos) {
    await supabase
      .from('cumplimiento_lopivi')
      .upsert({
        entidad_id,
        elemento_tipo: elemento,
        estado: false
      }, {
        onConflict: 'entidad_id,elemento_tipo'
      })
  }
}

async function calcularDatosRealCumplimiento(entidad_id: string) {
  // Verificar delegado principal certificado
  const { data: delegadoPrincipal } = await supabase
    .from('usuarios')
    .select('certificacion_vigente, fecha_vencimiento_certificacion')
    .eq('entidad_id', entidad_id)
    .eq('tipo', 'principal')
    .single()

  // Verificar delegado suplente certificado
  const { data: delegadoSuplente } = await supabase
    .from('usuarios')
    .select('certificacion_vigente, fecha_vencimiento_certificacion')
    .eq('entidad_id', entidad_id)
    .eq('tipo', 'suplente')
    .single()

  // Calcular personal formado
  const { data: personalTotal } = await supabase
    .from('personal')
    .select('id, formacion_lopivi_completada')
    .eq('entidad_id', entidad_id)
    .eq('estado', 'activo')

  const personalFormado = personalTotal?.filter(p => p.formacion_lopivi_completada).length || 0
  const totalPersonal = personalTotal?.length || 1
  const porcentajePersonalFormado = Math.round((personalFormado / totalPersonal) * 100)

  // Verificar casos registrados (últimos 6 meses)
  const fechaLimite = new Date()
  fechaLimite.setMonth(fechaLimite.getMonth() - 6)

  const { data: casosRecientes } = await supabase
    .from('casos')
    .select('id')
    .eq('entidad_id', entidad_id)
    .gte('created_at', fechaLimite.toISOString())

  // Verificar auditoría anual
  const fechaUltimaAuditoria = new Date()
  fechaUltimaAuditoria.setFullYear(fechaUltimaAuditoria.getFullYear() - 1)

  const { data: auditoriaReciente } = await supabase
    .from('auditorias_lopivi')
    .select('id, estado')
    .eq('entidad_id', entidad_id)
    .gte('fecha_auditoria', fechaUltimaAuditoria.toISOString().split('T')[0])
    .eq('estado', 'completada')
    .single()

  return {
    delegado_principal_certificado: delegadoPrincipal?.certificacion_vigente || false,
    delegado_suplente_certificado: delegadoSuplente?.certificacion_vigente || false,
    personal_formado_porcentaje: porcentajePersonalFormado,
    personal_formado_suficiente: porcentajePersonalFormado >= 80,
    casos_registrados_recientes: (casosRecientes?.length || 0) > 0,
    auditoria_anual_completada: !!auditoriaReciente
  }
}

async function actualizarElementosConDatosReales(entidad_id: string, elementos: any[], datosReales: any) {
  const actualizaciones = [
    { tipo: 'delegado_principal', estado: datosReales.delegado_principal_certificado },
    { tipo: 'delegado_suplente', estado: datosReales.delegado_suplente_certificado },
    { tipo: 'personal_formado', estado: datosReales.personal_formado_suficiente, porcentaje: datosReales.personal_formado_porcentaje },
    { tipo: 'registro_casos', estado: datosReales.casos_registrados_recientes },
    { tipo: 'auditoria_anual', estado: datosReales.auditoria_anual_completada }
  ]

  for (const actualizacion of actualizaciones) {
    await supabase
      .from('cumplimiento_lopivi')
      .update({
        estado: actualizacion.estado,
        porcentaje_parcial: actualizacion.porcentaje || (actualizacion.estado ? 100 : 0),
        updated_at: new Date().toISOString()
      })
      .eq('entidad_id', entidad_id)
      .eq('elemento_tipo', actualizacion.tipo)
  }

  // Devolver elementos actualizados
  const { data: elementosActualizados } = await supabase
    .from('cumplimiento_lopivi')
    .select('*')
    .eq('entidad_id', entidad_id)
    .order('elemento_tipo')

  return elementosActualizados || []
}

async function calcularPorcentajeTotal(entidad_id: string): Promise<number> {
  const { data } = await supabase
    .from('cumplimiento_lopivi')
    .select('estado')
    .eq('entidad_id', entidad_id)

  if (!data) return 0

  const completados = data.filter(e => e.estado).length
  return Math.round((completados / data.length) * 100)
}

async function registrarCambioHistorial(entidad_id: string, elemento_tipo: string, estado_anterior: boolean, estado_nuevo: boolean, usuario_id: string, motivo: string) {
  await supabase
    .from('historial_cumplimiento')
    .insert({
      entidad_id,
      elemento_tipo,
      estado_anterior,
      estado_nuevo,
      usuario_modificador: usuario_id,
      motivo_cambio: motivo || 'Actualización manual'
    })
}

async function generarAlertaCumplimientoBajo(entidad_id: string, porcentaje: number) {
  await supabase
    .from('alertas')
    .insert({
      entidad_id,
      tipo: 'cumplimiento_bajo',
      urgencia: 'alta',
      titulo: 'Cumplimiento LOPIVI Bajo',
      descripcion: `El cumplimiento LOPIVI ha bajado al ${porcentaje}%. Se requiere acción inmediata.`,
      estado: 'pendiente',
      fecha_limite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días
    })
}

function calcularProximaAuditoria(ultimaAuditoria: any): string {
  if (!ultimaAuditoria) {
    return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 año desde hoy
  }

  const fechaUltima = new Date(ultimaAuditoria.fecha_auditoria)
  fechaUltima.setFullYear(fechaUltima.getFullYear() + 1)
  return fechaUltima.toISOString().split('T')[0]
}

function obtenerEstadoGeneral(porcentaje: number): string {
  if (porcentaje >= 90) return 'excelente'
  if (porcentaje >= 80) return 'bueno'
  if (porcentaje >= 60) return 'regular'
  return 'critico'
}
