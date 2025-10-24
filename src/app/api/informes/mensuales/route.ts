import { NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface MetricaMensual {
  valor: number
  objetivo: number
  variacion: number // % respecto mes anterior
  tendencia: 'subiendo' | 'bajando' | 'estable'
  estado: 'excelente' | 'bueno' | 'regular' | 'critico'
}

interface AlertaRiesgo {
  id: string
  tipo: 'cumplimiento_bajo' | 'vencimientos_proximos' | 'casos_pendientes' | 'formacion_retrasada'
  severidad: 'baja' | 'media' | 'alta' | 'critica'
  titulo: string
  descripcion: string
  impacto: string
  accionRequerida: string
  fechaDeteccion: string
  fechaLimite?: string
}

interface Recomendacion {
  id: string
  categoria: 'cumplimiento' | 'formacion' | 'protocolos' | 'comunicacion'
  titulo: string
  descripcion: string
  prioridad: 'alta' | 'media' | 'baja'
  tiempoEstimado: string
  impactoEsperado: string
  recursosNecesarios: string[]
}

interface InformeMensual {
  metadatos: {
    entidadId: string
    entidadNombre: string
    periodo: { mes: number, año: number }
    fechaGeneracion: string
    delegadoPrincipal: string
    delegadoSuplente?: string
  }
  resumenEjecutivo: {
    cumplimientoGeneral: MetricaMensual
    casosGestionados: number
    incidentesCriticos: number
    formacionesCompletadas: number
    alertasPendientes: number
    estadoGeneral: 'excelente' | 'bueno' | 'regular' | 'critico'
  }
  metricas: {
    cumplimientoLOPIVI: MetricaMensual
    gestionCasos: {
      total: MetricaMensual
      resueltos: MetricaMensual
      tiempoPromedio: MetricaMensual
      satisfaccion: MetricaMensual
    }
    formacionPersonal: {
      completadas: MetricaMensual
      cobertura: MetricaMensual
      certificacionesVigentes: MetricaMensual
      proximosVencimientos: number
    }
    protocolos: {
      actualizados: MetricaMensual
      cumplimiento: MetricaMensual
      incidenciasDetectadas: MetricaMensual
    }
    comunicaciones: {
      enviadas: MetricaMensual
      efectividad: MetricaMensual
      respuestas: MetricaMensual
    }
  }
  analisisComparativo: {
    mesAnterior: {
      cumplimiento: { anterior: number, actual: number, cambio: number }
      casos: { anterior: number, actual: number, cambio: number }
      formaciones: { anterior: number, actual: number, cambio: number }
    }
    mismoMesAñoAnterior: {
      disponible: boolean
      cumplimiento?: { anterior: number, actual: number, cambio: number }
      casos?: { anterior: number, actual: number, cambio: number }
    }
    tendencias: {
      cumplimiento: 'mejorando' | 'estable' | 'empeorando'
      casos: 'aumentando' | 'estable' | 'disminuyendo'
      formacion: 'avanzando' | 'estable' | 'retrasando'
    }
  }
  alertasRiesgos: AlertaRiesgo[]
  recomendaciones: Recomendacion[]
  planAccion: {
    inmediatas: Recomendacion[]
    cortoplazo: Recomendacion[]
    medioplazo: Recomendacion[]
  }
  anexos: {
    detalleCasos: Array<{
      id: string
      titulo: string
      estado: string
      dias: number
    }>
    formacionesPendientes: Array<{
      personal: string
      curso: string
      fechaLimite: string
    }>
    proximosVencimientos: Array<{
      tipo: string
      responsable: string
      fechaVencimiento: string
      diasRestantes: number
    }>
  }
}

const generarDatosMetricaDemo = (valor: number, objetivo: number, variacionAnterior: number): MetricaMensual => {
  const variacion = variacionAnterior
  let tendencia: 'subiendo' | 'bajando' | 'estable' = 'estable'
  let estado: 'excelente' | 'bueno' | 'regular' | 'critico' = 'bueno'

  if (variacion > 2) tendencia = 'subiendo'
  else if (variacion < -2) tendencia = 'bajando'

  const porcentaje = (valor / objetivo) * 100
  if (porcentaje >= 95) estado = 'excelente'
  else if (porcentaje >= 85) estado = 'bueno'
  else if (porcentaje >= 70) estado = 'regular'
  else estado = 'critico'

  return { valor, objetivo, variacion, tendencia, estado }
}

const generarInformeMensual = async (entidadId: string, mes: number, año: number): Promise<InformeMensual> => {
  // Datos simulados pero realistas
  const informe: InformeMensual = {
    metadatos: {
      entidadId,
      entidadNombre: 'Club Deportivo Los Campeones',
      periodo: { mes, año },
      fechaGeneracion: new Date().toISOString(),
      delegadoPrincipal: 'Juan Carlos Pérez Ruiz',
      delegadoSuplente: 'María López Martín'
    },
    resumenEjecutivo: {
      cumplimientoGeneral: generarDatosMetricaDemo(94, 95, 2),
      casosGestionados: 8,
      incidentesCriticos: 1,
      formacionesCompletadas: 12,
      alertasPendientes: 3,
      estadoGeneral: 'bueno'
    },
    metricas: {
      cumplimientoLOPIVI: generarDatosMetricaDemo(94, 95, 2),
      gestionCasos: {
        total: generarDatosMetricaDemo(8, 10, -1),
        resueltos: generarDatosMetricaDemo(7, 8, 0),
        tiempoPromedio: generarDatosMetricaDemo(2.3, 2.0, 0.3),
        satisfaccion: generarDatosMetricaDemo(4.2, 4.5, 0.1)
      },
      formacionPersonal: {
        completadas: generarDatosMetricaDemo(12, 15, 3),
        cobertura: generarDatosMetricaDemo(89, 95, 5),
        certificacionesVigentes: generarDatosMetricaDemo(18, 20, 1),
        proximosVencimientos: 2
      },
      protocolos: {
        actualizados: generarDatosMetricaDemo(5, 5, 0),
        cumplimiento: generarDatosMetricaDemo(92, 95, 3),
        incidenciasDetectadas: generarDatosMetricaDemo(2, 0, 1)
      },
      comunicaciones: {
        enviadas: generarDatosMetricaDemo(15, 12, 2),
        efectividad: generarDatosMetricaDemo(85, 95, -2),
        respuestas: generarDatosMetricaDemo(78, 85, 5)
      }
    },
    analisisComparativo: {
      mesAnterior: {
        cumplimiento: { anterior: 92, actual: 94, cambio: 2 },
        casos: { anterior: 9, actual: 8, cambio: -1 },
        formaciones: { anterior: 9, actual: 12, cambio: 3 }
      },
      mismoMesAñoAnterior: {
        disponible: false
      },
      tendencias: {
        cumplimiento: 'mejorando',
        casos: 'estable',
        formacion: 'avanzando'
      }
    },
    alertasRiesgos: [
      {
        id: 'ALT-001',
        tipo: 'vencimientos_proximos',
        severidad: 'media',
        titulo: 'Certificaciones próximas a vencer',
        descripcion: '2 certificaciones de personal vencen en los próximos 30 días',
        impacto: 'Personal no autorizado para trabajar con menores',
        accionRequerida: 'Programar renovación de certificaciones inmediatamente',
        fechaDeteccion: new Date().toISOString(),
        fechaLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'ALT-002',
        tipo: 'casos_pendientes',
        severidad: 'baja',
        titulo: 'Caso pendiente de cierre',
        descripcion: '1 caso lleva más de 7 días sin actualización',
        impacto: 'Posible retraso en resolución de incidentes',
        accionRequerida: 'Revisar estado del caso CASO-002 y actualizar',
        fechaDeteccion: new Date().toISOString()
      },
      {
        id: 'ALT-003',
        tipo: 'formacion_retrasada',
        severidad: 'media',
        titulo: 'Formación del personal incompleta',
        descripcion: '3 miembros del personal tienen formación pendiente',
        impacto: 'Personal sin formación LOPIVI completa',
        accionRequerida: 'Programar sesiones de formación pendientes',
        fechaDeteccion: new Date().toISOString(),
        fechaLimite: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    recomendaciones: [
      {
        id: 'REC-001',
        categoria: 'cumplimiento',
        titulo: 'Mejorar protocolo de vestuarios',
        descripcion: 'Implementar señalización adicional y supervisión reforzada',
        prioridad: 'alta',
        tiempoEstimado: '1 semana',
        impactoEsperado: '+3% cumplimiento general',
        recursosNecesarios: ['Señalización', 'Formación personal', 'Coordinación supervisores']
      },
      {
        id: 'REC-002',
        categoria: 'formacion',
        titulo: 'Acelerar programa de certificaciones',
        descripcion: 'Adelantar las renovaciones de certificaciones próximas a vencer',
        prioridad: 'media',
        tiempoEstimado: '2 semanas',
        impactoEsperado: 'Prevención de interrupciones operativas',
        recursosNecesarios: ['Coordinación con centro certificador', 'Tiempo del personal']
      },
      {
        id: 'REC-003',
        categoria: 'comunicacion',
        titulo: 'Mejorar tasa de respuesta',
        descripcion: 'Implementar recordatorios automáticos y seguimiento personalizado',
        prioridad: 'baja',
        tiempoEstimado: '3 días',
        impactoEsperado: '+7% tasa de respuesta',
        recursosNecesarios: ['Configuración sistema', 'Plantillas personalizadas']
      }
    ],
    planAccion: {
      inmediatas: [],
      cortoplazo: [],
      medioplazo: []
    },
    anexos: {
      detalleCasos: [
        {
          id: 'CASO-001',
          titulo: 'Incidente en vestuario',
          estado: 'resuelto',
          dias: 2
        },
        {
          id: 'CASO-002',
          titulo: 'Comunicación inapropiada',
          estado: 'en_proceso',
          dias: 8
        }
      ],
      formacionesPendientes: [
        {
          personal: 'Carlos Ruiz - Monitor',
          curso: 'Actualización LOPIVI',
          fechaLimite: '2024-02-15'
        },
        {
          personal: 'Elena Santos - Entrenadora',
          curso: 'Primeros Auxilios',
          fechaLimite: '2024-02-20'
        }
      ],
      proximosVencimientos: [
        {
          tipo: 'Certificación Delegado',
          responsable: 'Juan Carlos Pérez',
          fechaVencimiento: '2025-01-01',
          diasRestantes: 340
        },
        {
          tipo: 'Certificado Personal',
          responsable: 'Pedro García',
          fechaVencimiento: '2024-02-15',
          diasRestantes: 25
        }
      ]
    }
  }

  // Organizar recomendaciones por urgencia
  informe.planAccion = {
    inmediatas: informe.recomendaciones.filter(r => r.prioridad === 'alta'),
    cortoplazo: informe.recomendaciones.filter(r => r.prioridad === 'media'),
    medioplazo: informe.recomendaciones.filter(r => r.prioridad === 'baja')
  }

  return informe
}

const generarInformePDF = (informe: InformeMensual): Buffer => {
  const doc = new jsPDF()
  const nombreMes = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ][informe.metadatos.periodo.mes - 1]

  // Portada
  doc.setFontSize(24)
  doc.setTextColor(41, 128, 185)
  doc.text('INFORME MENSUAL LOPIVI', 20, 40)

  doc.setFontSize(18)
  doc.setTextColor(52, 73, 94)
  doc.text(`${nombreMes} ${informe.metadatos.periodo.año}`, 20, 55)

  doc.setFontSize(14)
  doc.setTextColor(100, 100, 100)
  doc.text(informe.metadatos.entidadNombre, 20, 70)
  doc.text(`Delegado Principal: ${informe.metadatos.delegadoPrincipal}`, 20, 80)
  if (informe.metadatos.delegadoSuplente) {
    doc.text(`Delegado Suplente: ${informe.metadatos.delegadoSuplente}`, 20, 90)
  }

  // Resumen Ejecutivo
  doc.setFontSize(16)
  doc.setTextColor(41, 128, 185)
  doc.text('RESUMEN EJECUTIVO', 20, 120)

  doc.setFontSize(12)
  doc.setTextColor(40, 40, 40)
  doc.text(`Cumplimiento General: ${informe.resumenEjecutivo.cumplimientoGeneral.valor}%`, 20, 135)
  doc.text(`Casos Gestionados: ${informe.resumenEjecutivo.casosGestionados}`, 20, 145)
  doc.text(`Formaciones Completadas: ${informe.resumenEjecutivo.formacionesCompletadas}`, 20, 155)
  doc.text(`Alertas Pendientes: ${informe.resumenEjecutivo.alertasPendientes}`, 20, 165)

  // Estado general con color
  const estadoColor = informe.resumenEjecutivo.estadoGeneral === 'excelente' ? [39, 174, 96] :
                     informe.resumenEjecutivo.estadoGeneral === 'bueno' ? [241, 196, 15] :
                     informe.resumenEjecutivo.estadoGeneral === 'regular' ? [230, 126, 34] : [231, 76, 60]

  doc.setTextColor(...estadoColor)
  doc.text(`Estado General: ${informe.resumenEjecutivo.estadoGeneral.toUpperCase()}`, 20, 175)

  // Nueva página - Métricas Detalladas
  doc.addPage()
  doc.setFontSize(16)
  doc.setTextColor(41, 128, 185)
  doc.text('MÉTRICAS DETALLADAS', 20, 30)

  // Tabla de métricas principales
  const metricasData = [
    ['Cumplimiento LOPIVI', `${informe.metricas.cumplimientoLOPIVI.valor}%`, `${informe.metricas.cumplimientoLOPIVI.objetivo}%`, `${informe.metricas.cumplimientoLOPIVI.variacion > 0 ? '+' : ''}${informe.metricas.cumplimientoLOPIVI.variacion}%`],
    ['Casos Resueltos', `${informe.metricas.gestionCasos.resueltos.valor}`, `${informe.metricas.gestionCasos.resueltos.objetivo}`, `${informe.metricas.gestionCasos.resueltos.variacion > 0 ? '+' : ''}${informe.metricas.gestionCasos.resueltos.variacion}`],
    ['Cobertura Formación', `${informe.metricas.formacionPersonal.cobertura.valor}%`, `${informe.metricas.formacionPersonal.cobertura.objetivo}%`, `${informe.metricas.formacionPersonal.cobertura.variacion > 0 ? '+' : ''}${informe.metricas.formacionPersonal.cobertura.variacion}%`],
    ['Cumplimiento Protocolos', `${informe.metricas.protocolos.cumplimiento.valor}%`, `${informe.metricas.protocolos.cumplimiento.objetivo}%`, `${informe.metricas.protocolos.cumplimiento.variacion > 0 ? '+' : ''}${informe.metricas.protocolos.cumplimiento.variacion}%`]
  ]

  ;(doc as any).autoTable({
    head: [['Métrica', 'Actual', 'Objetivo', 'Variación']],
    body: metricasData,
    startY: 45,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] }
  })

  // Alertas y Riesgos
  doc.setFontSize(16)
  doc.setTextColor(231, 76, 60)
  doc.text('ALERTAS Y RIESGOS', 20, 120)

  if (informe.alertasRiesgos.length > 0) {
    const alertasData = informe.alertasRiesgos.map(alerta => [
      alerta.titulo,
      alerta.severidad.toUpperCase(),
      alerta.descripcion.substring(0, 40) + '...',
      alerta.accionRequerida.substring(0, 30) + '...'
    ])

    ;(doc as any).autoTable({
      head: [['Alerta', 'Severidad', 'Descripción', 'Acción Requerida']],
      body: alertasData,
      startY: 130,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [231, 76, 60] }
    })
  }

  // Nueva página - Recomendaciones
  doc.addPage()
  doc.setFontSize(16)
  doc.setTextColor(39, 174, 96)
  doc.text('RECOMENDACIONES Y PLAN DE ACCIÓN', 20, 30)

  let currentY = 45

  if (informe.planAccion.inmediatas.length > 0) {
    doc.setFontSize(14)
    doc.setTextColor(231, 76, 60)
    doc.text('ACCIONES INMEDIATAS', 20, currentY)
    currentY += 15

    informe.planAccion.inmediatas.forEach(rec => {
      doc.setFontSize(10)
      doc.setTextColor(40, 40, 40)
      doc.text(`• ${rec.titulo}`, 25, currentY)
      currentY += 7
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(`  ${rec.descripcion}`, 25, currentY)
      currentY += 7
      doc.text(`  Tiempo estimado: ${rec.tiempoEstimado} | Impacto: ${rec.impactoEsperado}`, 25, currentY)
      currentY += 10
    })
  }

  if (informe.planAccion.cortoplazo.length > 0) {
    doc.setFontSize(14)
    doc.setTextColor(241, 196, 15)
    doc.text('ACCIONES A CORTO PLAZO', 20, currentY)
    currentY += 15

    informe.planAccion.cortoplazo.forEach(rec => {
      doc.setFontSize(10)
      doc.setTextColor(40, 40, 40)
      doc.text(`• ${rec.titulo}`, 25, currentY)
      currentY += 7
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(`  ${rec.descripcion}`, 25, currentY)
      currentY += 10
    })
  }

  // Pie de página
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(`Página ${i} de ${totalPages}`, 20, 285)
    doc.text(`Generado automáticamente por Custodia360 - ${new Date().toLocaleDateString('es-ES')}`, 120, 285)
  }

  return Buffer.from(doc.output('arraybuffer'))
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const entidadId = searchParams.get('entidadId')
    const mes = parseInt(searchParams.get('mes') || String(new Date().getMonth() + 1))
    const año = parseInt(searchParams.get('año') || String(new Date().getFullYear()))
    const formato = searchParams.get('formato') || 'json'

    if (!entidadId) {
      return NextResponse.json({
        error: 'ID de entidad requerido'
      }, { status: 400 })
    }

    console.log(`📊 Generando informe mensual: ${entidadId} - ${mes}/${año} - Formato: ${formato}`)

    const informe = await generarInformeMensual(entidadId, mes, año)

    if (formato === 'pdf') {
      const pdfBuffer = generarInformePDF(informe)
      const nombreArchivo = `Informe_Mensual_${mes}_${año}_${entidadId}.pdf`

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${nombreArchivo}"`
        }
      })
    }

    return NextResponse.json({
      success: true,
      informe
    })

  } catch (error) {
    console.error('❌ Error generando informe mensual:', error)
    return NextResponse.json({
      success: false,
      error: 'Error generando informe mensual',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { entidadId, configuracion } = await request.json()

    console.log(`⚙️ Configurando informes automáticos para entidad: ${entidadId}`)

    // Aquí se configuraría el sistema de informes automáticos
    // Por ahora simulamos la respuesta

    return NextResponse.json({
      success: true,
      message: 'Configuración de informes automáticos actualizada',
      configuracion: {
        frecuencia: configuracion.frecuencia || 'mensual',
        destinatarios: configuracion.destinatarios || [],
        metricas: configuracion.metricas || ['cumplimiento', 'casos', 'formacion'],
        formato: configuracion.formato || 'pdf',
        envioAutomatico: configuracion.envioAutomatico || true,
        proximoEnvio: '2024-02-01'
      }
    })

  } catch (error) {
    console.error('❌ Error configurando informes automáticos:', error)
    return NextResponse.json({
      success: false,
      error: 'Error configurando informes automáticos'
    }, { status: 500 })
  }
}
