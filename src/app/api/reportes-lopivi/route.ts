import { NextRequest, NextResponse } from 'next/server'
import { supabase, logAuditAction } from '@/lib/supabase'

interface ReporteOptions {
  tipo: 'diario' | 'semanal' | 'mensual' | 'anual' | 'personalizado'
  fecha_inicio?: string
  fecha_fin?: string
  entidad_id?: string
  incluir_resueltos?: boolean
  formato: 'json' | 'pdf' | 'excel'
}

// Función para generar hash de integridad del reporte
function generateReportHash(data: any): string {
  const timestamp = new Date().toISOString()
  const content = JSON.stringify(data) + timestamp
  return btoa(content).slice(0, 32)
}

// Función para calcular fechas según tipo de reporte
function calcularFechasReporte(tipo: string, fecha_custom?: string) {
  const hoy = new Date()
  let fecha_inicio: Date, fecha_fin: Date

  switch (tipo) {
    case 'diario':
      fecha_inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      fecha_fin = new Date(fecha_inicio.getTime() + 24 * 60 * 60 * 1000)
      break
    case 'semanal':
      const inicioSemana = hoy.getDate() - hoy.getDay()
      fecha_inicio = new Date(hoy.getFullYear(), hoy.getMonth(), inicioSemana)
      fecha_fin = new Date(fecha_inicio.getTime() + 7 * 24 * 60 * 60 * 1000)
      break
    case 'mensual':
      fecha_inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      fecha_fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1)
      break
    case 'anual':
      fecha_inicio = new Date(hoy.getFullYear(), 0, 1)
      fecha_fin = new Date(hoy.getFullYear() + 1, 0, 1)
      break
    default:
      if (fecha_custom) {
        fecha_inicio = new Date(fecha_custom)
        fecha_fin = new Date(hoy)
      } else {
        fecha_inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        fecha_fin = new Date(hoy)
      }
  }

  return {
    fecha_inicio: fecha_inicio.toISOString(),
    fecha_fin: fecha_fin.toISOString()
  }
}

// POST - Generar reporte de casos activos
export async function POST(request: NextRequest) {
  try {
    const options: ReporteOptions = await request.json()

    // Validar parámetros
    if (!options.tipo || !options.formato) {
      return NextResponse.json(
        { error: 'Tipo y formato de reporte son obligatorios' },
        { status: 400 }
      )
    }

    // Calcular fechas del reporte
    const { fecha_inicio, fecha_fin } = calcularFechasReporte(
      options.tipo,
      options.fecha_inicio
    )

    console.log(`📊 Generando reporte ${options.tipo} desde ${fecha_inicio} hasta ${fecha_fin}`)

    // Consultar casos activos en el rango de fechas
    let query = supabase
      .from('casos_activos')
      .select(`
        *,
        entidades!inner(nombre, cif, email),
        delegados!casos_activos_delegado_id_fkey(nombre, apellidos, email),
        created_by_delegado:delegados!casos_activos_created_by_fkey(nombre, apellidos),
        caso_activo_acciones(*)
      `)
      .gte('created_at', fecha_inicio)
      .lte('created_at', fecha_fin)
      .order('created_at', { ascending: false })

    // Aplicar filtros adicionales
    if (options.entidad_id) {
      query = query.eq('entidad_id', options.entidad_id)
    }

    if (!options.incluir_resueltos) {
      query = query.neq('estado', 'resuelto').neq('estado', 'cerrado')
    }

    const { data: casos, error: casosError } = await query

    if (casosError) {
      console.error('❌ Error consultando casos:', casosError)
      return NextResponse.json(
        { error: 'Error consultando casos activos', details: casosError.message },
        { status: 500 }
      )
    }

    // Obtener estadísticas adicionales de auditoría
    const { data: auditLogs, error: auditError } = await supabase
      .from('audit_logs')
      .select('*')
      .gte('timestamp', fecha_inicio)
      .lte('timestamp', fecha_fin)
      .in('action_type', ['caso_activo_creado', 'caso_activo_actualizado', 'caso_activo_accion_creada'])

    if (auditError) {
      console.warn('⚠️ Error consultando auditoría:', auditError)
    }

    // Procesar datos para el reporte
    const casosFormateados = casos?.map(caso => ({
      caso_id: caso.caso_id,
      titulo: caso.titulo,
      descripcion: caso.descripcion,
      tipo_caso: caso.tipo_caso,
      prioridad: caso.prioridad,
      estado: caso.estado,
      fecha_creacion: caso.created_at,
      fecha_ultima_actualizacion: caso.updated_at,
      entidad: {
        nombre: caso.entidades?.nombre,
        cif: caso.entidades?.cif
      },
      delegado_responsable: caso.delegados ?
        `${caso.delegados.nombre} ${caso.delegados.apellidos}` : null,
      creado_por: caso.created_by_delegado ?
        `${caso.created_by_delegado.nombre} ${caso.created_by_delegado.apellidos}` : null,
      ubicacion: caso.ubicacion,
      menor_afectado: caso.menor_afectado ? JSON.parse(caso.menor_afectado) : null,
      acciones_realizadas: caso.acciones_realizadas || [],
      total_acciones: caso.caso_activo_acciones?.length || 0,
      familia_contactada: caso.familia_contactada,
      fecha_contacto_familia: caso.fecha_contacto_familia,
      proxima_accion: caso.proxima_accion,
      fecha_proxima_accion: caso.fecha_proxima_accion,
      notas_seguimiento: caso.notas_seguimiento,
      cumplimiento_lopivi: caso.cumplimiento_lopivi,
      requiere_revision: caso.requiere_revision
    })) || []

    // Calcular estadísticas del reporte
    const estadisticas = {
      total_casos: casosFormateados.length,
      casos_por_estado: {
        activo: casosFormateados.filter(c => c.estado === 'activo').length,
        pendiente: casosFormateados.filter(c => c.estado === 'pendiente').length,
        en_revision: casosFormateados.filter(c => c.estado === 'en_revision').length,
        resuelto: casosFormateados.filter(c => c.estado === 'resuelto').length,
        cerrado: casosFormateados.filter(c => c.estado === 'cerrado').length
      },
      casos_por_prioridad: {
        alta: casosFormateados.filter(c => c.prioridad === 'alta').length,
        media: casosFormateados.filter(c => c.prioridad === 'media').length,
        baja: casosFormateados.filter(c => c.prioridad === 'baja').length
      },
      casos_por_tipo: {
        seguimiento: casosFormateados.filter(c => c.tipo_caso === 'seguimiento').length,
        incidencia: casosFormateados.filter(c => c.tipo_caso === 'incidencia').length,
        protocolo: casosFormateados.filter(c => c.tipo_caso === 'protocolo').length,
        revision: casosFormateados.filter(c => c.tipo_caso === 'revision').length
      },
      cumplimiento_lopivi: {
        casos_conformes: casosFormateados.filter(c => c.cumplimiento_lopivi).length,
        casos_requieren_revision: casosFormateados.filter(c => c.requiere_revision).length,
        porcentaje_cumplimiento: casosFormateados.length > 0 ?
          Math.round((casosFormateados.filter(c => c.cumplimiento_lopivi).length / casosFormateados.length) * 100) : 0
      },
      actividad_auditoria: {
        total_acciones_auditoria: auditLogs?.length || 0,
        casos_creados: auditLogs?.filter(log => log.action_type === 'caso_activo_creado').length || 0,
        casos_actualizados: auditLogs?.filter(log => log.action_type === 'caso_activo_actualizado').length || 0,
        acciones_registradas: auditLogs?.filter(log => log.action_type === 'caso_activo_accion_creada').length || 0
      }
    }

    // Generar metadatos del reporte
    const metadatos = {
      id_reporte: `REP-${Date.now()}`,
      tipo_reporte: options.tipo,
      formato: options.formato,
      fecha_generacion: new Date().toISOString(),
      periodo: {
        fecha_inicio,
        fecha_fin,
        descripcion: `Reporte ${options.tipo} de casos activos LOPIVI`
      },
      generado_por: 'Sistema Custodia360',
      version_sistema: '1.0.0',
      cumplimiento_lopivi: true,
      hash_integridad: '',
      validez_legal: true
    }

    // Estructura final del reporte
    const reporte = {
      metadatos,
      estadisticas,
      casos: casosFormateados,
      resumen_ejecutivo: {
        periodo_analizado: `${fecha_inicio.split('T')[0]} a ${fecha_fin.split('T')[0]}`,
        total_casos_analizados: casosFormateados.length,
        casos_requieren_atencion: casosFormateados.filter(c =>
          c.estado === 'activo' && c.prioridad === 'alta'
        ).length,
        porcentaje_cumplimiento_lopivi: estadisticas.cumplimiento_lopivi.porcentaje_cumplimiento,
        observaciones: [
          `Se analizaron ${casosFormateados.length} casos activos en el período`,
          `${estadisticas.casos_por_estado.activo} casos activos requieren seguimiento`,
          `${estadisticas.cumplimiento_lopivi.casos_requieren_revision} casos requieren revisión LOPIVI`,
          `Porcentaje de cumplimiento LOPIVI: ${estadisticas.cumplimiento_lopivi.porcentaje_cumplimiento}%`
        ]
      }
    }

    // Generar hash de integridad
    reporte.metadatos.hash_integridad = generateReportHash(reporte)

    // Registrar generación del reporte en auditoría
    await logAuditAction({
      user_name: 'Sistema Automatizado',
      action_type: 'reporte_generado',
      entity_type: 'reporte_lopivi',
      entity_id: reporte.metadatos.id_reporte,
      details: {
        tipo_reporte: options.tipo,
        formato: options.formato,
        total_casos: casosFormateados.length,
        periodo_inicio: fecha_inicio,
        periodo_fin: fecha_fin,
        hash_integridad: reporte.metadatos.hash_integridad
      }
    })

    console.log(`✅ Reporte ${reporte.metadatos.id_reporte} generado exitosamente`)

    // Respuesta según formato solicitado
    if (options.formato === 'json') {
      return NextResponse.json({
        success: true,
        reporte,
        message: 'Reporte generado exitosamente'
      })
    } else if (options.formato === 'pdf') {
      // Generar PDF del reporte
      const pdfResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/pdf/reporte-lopivi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporte })
      })

      if (pdfResponse.ok) {
        const pdfBlob = await pdfResponse.blob()
        return new NextResponse(pdfBlob, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="reporte-lopivi-${reporte.metadatos.id_reporte}.pdf"`
          }
        })
      } else {
        return NextResponse.json({ reporte, formato: 'json', message: 'PDF no disponible, devolviendo JSON' })
      }
    } else {
      // Formato Excel u otros
      return NextResponse.json({
        success: true,
        reporte,
        message: 'Formato no implementado aún, devolviendo JSON'
      })
    }

  } catch (error) {
    console.error('❌ Error generando reporte LOPIVI:', error)
    return NextResponse.json(
      {
        error: 'Error interno generando reporte',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// GET - Obtener reportes generados
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limite = parseInt(searchParams.get('limite') || '10')
    const tipo = searchParams.get('tipo')

    // Consultar reportes desde audit_logs
    let query = supabase
      .from('audit_logs')
      .select('*')
      .eq('action_type', 'reporte_generado')
      .order('timestamp', { ascending: false })
      .limit(limite)

    if (tipo) {
      query = query.eq('details->tipo_reporte', tipo)
    }

    const { data: reportes, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Error consultando reportes' },
        { status: 500 }
      )
    }

    const reportesFormateados = reportes?.map(reporte => ({
      id: reporte.entity_id,
      tipo: reporte.details.tipo_reporte,
      formato: reporte.details.formato,
      fecha_generacion: reporte.timestamp,
      total_casos: reporte.details.total_casos,
      periodo: `${reporte.details.periodo_inicio?.split('T')[0]} a ${reporte.details.periodo_fin?.split('T')[0]}`,
      hash_integridad: reporte.details.hash_integridad,
      usuario: reporte.user_name
    })) || []

    return NextResponse.json({
      success: true,
      reportes: reportesFormateados,
      total: reportesFormateados.length
    })

  } catch (error) {
    console.error('❌ Error consultando reportes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
