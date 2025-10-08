import { NextRequest, NextResponse } from 'next/server'
import { supabase, logAuditAction } from '@/lib/supabase'

interface ConfiguracionReporteAutomatico {
  activo: boolean
  frecuencia: 'diario' | 'semanal' | 'mensual'
  hora_envio: string // HH:MM format
  email_destino: string
  incluir_resueltos: boolean
  entidades_incluidas: string[] // IDs de entidades o ['*'] para todas
  formato_preferido: 'pdf' | 'json'
}

// Configuración por defecto
const CONFIG_DEFAULT: ConfiguracionReporteAutomatico = {
  activo: true,
  frecuencia: 'semanal',
  hora_envio: '08:00',
  email_destino: 'admin@custodia360.es',
  incluir_resueltos: false,
  entidades_incluidas: ['*'], // Todas las entidades
  formato_preferido: 'pdf'
}

// POST - Configurar reportes automáticos
export async function POST(request: NextRequest) {
  try {
    const configuracion: Partial<ConfiguracionReporteAutomatico> = await request.json()

    // Validar configuración
    if (configuracion.email_destino && !isValidEmail(configuracion.email_destino)) {
      return NextResponse.json(
        { error: 'Email destino no válido' },
        { status: 400 }
      )
    }

    if (configuracion.hora_envio && !isValidTime(configuracion.hora_envio)) {
      return NextResponse.json(
        { error: 'Hora de envío no válida (formato HH:MM)' },
        { status: 400 }
      )
    }

    // Combinar con configuración actual o por defecto
    const configActual = await obtenerConfiguracionActual()
    const nuevaConfig = { ...configActual, ...configuracion }

    // Guardar configuración en base de datos
    const { data: configGuardada, error } = await supabase
      .from('configuracion_sistema')
      .upsert([{
        clave: 'reportes_automaticos',
        valor: JSON.stringify(nuevaConfig),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('❌ Error guardando configuración:', error)
      return NextResponse.json(
        { error: 'Error guardando configuración de reportes' },
        { status: 500 }
      )
    }

    // Registrar cambio de configuración en auditoría
    await logAuditAction({
      user_name: 'Sistema Automatizado',
      action_type: 'configuracion_reportes_actualizada',
      entity_type: 'configuracion',
      entity_id: 'reportes_automaticos',
      details: {
        configuracion_anterior: configActual,
        configuracion_nueva: nuevaConfig,
        campos_modificados: Object.keys(configuracion)
      }
    })

    console.log('✅ Configuración de reportes automáticos actualizada')

    return NextResponse.json({
      success: true,
      configuracion: nuevaConfig,
      message: 'Configuración de reportes automáticos actualizada'
    })

  } catch (error) {
    console.error('❌ Error configurando reportes automáticos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET - Obtener configuración actual
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accion = searchParams.get('accion')

    if (accion === 'ejecutar') {
      // Ejecutar generación manual de reportes
      return await ejecutarReportesAutomaticos()
    } else if (accion === 'configuracion') {
      // Obtener configuración actual
      const configuracion = await obtenerConfiguracionActual()
      return NextResponse.json({
        success: true,
        configuracion
      })
    } else if (accion === 'historial') {
      // Obtener historial de reportes generados
      const historial = await obtenerHistorialReportes()
      return NextResponse.json({
        success: true,
        historial
      })
    } else {
      return NextResponse.json(
        { error: 'Acción no válida. Use: configuracion, ejecutar, historial' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('❌ Error en GET reportes automáticos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para ejecutar la generación automática de reportes
async function ejecutarReportesAutomaticos(): Promise<NextResponse> {
  try {
    console.log('🤖 Iniciando generación automática de reportes LOPIVI...')

    const configuracion = await obtenerConfiguracionActual()

    if (!configuracion.activo) {
      return NextResponse.json({
        success: false,
        message: 'Reportes automáticos desactivados'
      })
    }

    // Determinar entidades para incluir en el reporte
    let entidadesIds: string[] = []

    if (configuracion.entidades_incluidas.includes('*')) {
      // Obtener todas las entidades activas
      const { data: entidades, error } = await supabase
        .from('entidades')
        .select('id')
        .eq('estado', 'activa')

      if (error) {
        throw new Error(`Error obteniendo entidades: ${error.message}`)
      }

      entidadesIds = entidades?.map(e => e.id) || []
    } else {
      entidadesIds = configuracion.entidades_incluidas
    }

    const reportesGenerados = []

    // Generar reporte para cada entidad
    for (const entidadId of entidadesIds) {
      try {
        const reporteResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/reportes-lopivi`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tipo: configuracion.frecuencia,
            formato: configuracion.formato_preferido,
            entidad_id: entidadId,
            incluir_resueltos: configuracion.incluir_resueltos
          })
        })

        if (reporteResponse.ok) {
          const resultado = await reporteResponse.json()
          reportesGenerados.push({
            entidad_id: entidadId,
            reporte_id: resultado.reporte?.metadatos?.id_reporte,
            casos_incluidos: resultado.reporte?.estadisticas?.total_casos || 0,
            success: true
          })

          // Enviar por email si está configurado
          if (configuracion.email_destino && configuracion.formato_preferido === 'pdf') {
            await enviarReportePorEmail(
              configuracion.email_destino,
              resultado.reporte,
              entidadId
            )
          }

        } else {
          console.error(`❌ Error generando reporte para entidad ${entidadId}`)
          reportesGenerados.push({
            entidad_id: entidadId,
            success: false,
            error: 'Error generando reporte'
          })
        }

      } catch (error) {
        console.error(`❌ Error procesando entidad ${entidadId}:`, error)
        reportesGenerados.push({
          entidad_id: entidadId,
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }

    // Registrar ejecución en auditoría
    await logAuditAction({
      user_name: 'Sistema Automatizado',
      action_type: 'reportes_automaticos_ejecutados',
      entity_type: 'reporte_automatico',
      entity_id: `AUTO-${Date.now()}`,
      details: {
        frecuencia: configuracion.frecuencia,
        entidades_procesadas: entidadesIds.length,
        reportes_exitosos: reportesGenerados.filter(r => r.success).length,
        reportes_fallidos: reportesGenerados.filter(r => !r.success).length,
        configuracion_utilizada: configuracion
      }
    })

    const exitosos = reportesGenerados.filter(r => r.success).length
    const fallidos = reportesGenerados.filter(r => !r.success).length

    console.log(`✅ Generación automática completada: ${exitosos} exitosos, ${fallidos} fallidos`)

    return NextResponse.json({
      success: true,
      resumen: {
        entidades_procesadas: entidadesIds.length,
        reportes_exitosos: exitosos,
        reportes_fallidos: fallidos,
        configuracion: configuracion
      },
      detalles: reportesGenerados,
      message: `Reportes automáticos ejecutados: ${exitosos}/${entidadesIds.length} exitosos`
    })

  } catch (error) {
    console.error('❌ Error en ejecución automática de reportes:', error)
    return NextResponse.json(
      { error: 'Error ejecutando reportes automáticos' },
      { status: 500 }
    )
  }
}

// Funciones auxiliares
async function obtenerConfiguracionActual(): Promise<ConfiguracionReporteAutomatico> {
  try {
    const { data, error } = await supabase
      .from('configuracion_sistema')
      .select('valor')
      .eq('clave', 'reportes_automaticos')
      .single()

    if (error || !data) {
      console.log('📋 Usando configuración por defecto para reportes automáticos')
      return CONFIG_DEFAULT
    }

    return { ...CONFIG_DEFAULT, ...JSON.parse(data.valor) }

  } catch (error) {
    console.warn('⚠️ Error obteniendo configuración, usando por defecto:', error)
    return CONFIG_DEFAULT
  }
}

async function obtenerHistorialReportes() {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .in('action_type', ['reporte_generado', 'reportes_automaticos_ejecutados'])
    .order('timestamp', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error obteniendo historial:', error)
    return []
  }

  return data?.map(log => ({
    id: log.entity_id,
    tipo: log.action_type,
    fecha: log.timestamp,
    detalles: log.details,
    usuario: log.user_name
  })) || []
}

async function enviarReportePorEmail(email: string, reporte: any, entidadId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/reporte-automatico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_destino: email,
        reporte: reporte,
        entidad_id: entidadId
      })
    })

    if (!response.ok) {
      console.error('❌ Error enviando reporte por email')
    } else {
      console.log('✅ Reporte enviado por email correctamente')
    }

  } catch (error) {
    console.error('❌ Error enviando email:', error)
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidTime(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}
