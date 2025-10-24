import { NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface BackupConfig {
  frecuencia: 'diario' | 'semanal' | 'mensual'
  tiposDatos: ('casos' | 'formacion' | 'certificaciones' | 'protocolos')[]
  formatoExportacion: 'json' | 'csv' | 'pdf' | 'xml'
  encriptacion: boolean
  destinoAlmacenamiento: 'local' | 'cloud' | 'ambos'
}

interface DatosLegales {
  entidad: {
    id: string
    nombre: string
    delegadoPrincipal: string
    delegadoSuplente?: string
    fechaImplementacion: string
  }
  cumplimiento: {
    porcentajeGeneral: number
    ultimaEvaluacion: string
    proximaRevision: string
  }
  casos: Array<{
    id: string
    titulo: string
    fecha: string
    prioridad: string
    estado: string
    resolucion?: string
  }>
  formaciones: Array<{
    id: string
    personal: string
    curso: string
    fechaCompletada: string
    certificado: string
  }>
  certificaciones: Array<{
    delegado: string
    tipo: string
    fechaEmision: string
    fechaVencimiento: string
    estado: string
  }>
  protocolos: Array<{
    id: string
    titulo: string
    version: string
    fechaActualizacion: string
    responsable: string
  }>
  comunicaciones: Array<{
    id: string
    fecha: string
    tipo: string
    destinatarios: string
    asunto: string
  }>
  logs: Array<{
    fecha: string
    usuario: string
    accion: string
    detalles: string
  }>
}

// Simulación de datos para demo
const obtenerDatosLegales = async (entidadId: string, fechaInicio: Date, fechaFin: Date): Promise<DatosLegales> => {
  return {
    entidad: {
      id: entidadId,
      nombre: 'Club Deportivo Los Campeones',
      delegadoPrincipal: 'Juan Carlos Pérez Ruiz',
      delegadoSuplente: 'María López Martín',
      fechaImplementacion: '2024-01-15'
    },
    cumplimiento: {
      porcentajeGeneral: 97,
      ultimaEvaluacion: '2024-01-20',
      proximaRevision: '2024-04-20'
    },
    casos: [
      {
        id: 'CASO-001',
        titulo: 'Incidente en vestuario - Menor reporta incomodidad',
        fecha: '2024-01-20',
        prioridad: 'alta',
        estado: 'resuelto',
        resolucion: 'Protocolo aplicado correctamente, medidas preventivas implementadas'
      },
      {
        id: 'CASO-002',
        titulo: 'Comunicación inapropiada entrenador-menor',
        fecha: '2024-01-18',
        prioridad: 'alta',
        estado: 'en_proceso',
        resolucion: 'En investigación, personal suspendido preventivamente'
      }
    ],
    formaciones: [
      {
        id: 'FORM-001',
        personal: 'Pedro García - Entrenador',
        curso: 'Formación LOPIVI Básica',
        fechaCompletada: '2024-01-10',
        certificado: 'CERT-LOPIVI-001'
      },
      {
        id: 'FORM-002',
        personal: 'Ana Martínez - Monitora',
        curso: 'Protección Infantil Avanzada',
        fechaCompletada: '2024-01-12',
        certificado: 'CERT-LOPIVI-002'
      }
    ],
    certificaciones: [
      {
        delegado: 'Juan Carlos Pérez Ruiz',
        tipo: 'Delegado Principal',
        fechaEmision: '2024-01-01',
        fechaVencimiento: '2025-01-01',
        estado: 'vigente'
      },
      {
        delegado: 'María López Martín',
        tipo: 'Delegado Suplente',
        fechaEmision: '2024-01-01',
        fechaVencimiento: '2025-01-01',
        estado: 'vigente'
      }
    ],
    protocolos: [
      {
        id: 'PROT-001',
        titulo: 'Protocolo de Vestuarios',
        version: '2.1',
        fechaActualizacion: '2024-01-15',
        responsable: 'Juan Carlos Pérez Ruiz'
      },
      {
        id: 'PROT-002',
        titulo: 'Protocolo de Comunicaciones',
        version: '1.3',
        fechaActualizacion: '2024-01-10',
        responsable: 'Juan Carlos Pérez Ruiz'
      }
    ],
    comunicaciones: [
      {
        id: 'COM-001',
        fecha: '2024-01-20',
        tipo: 'Recordatorio LOPIVI',
        destinatarios: 'Todo el personal',
        asunto: 'Actualización protocolos vestuarios'
      },
      {
        id: 'COM-002',
        fecha: '2024-01-18',
        tipo: 'Urgente - Protocolo activado',
        destinatarios: 'Dirección',
        asunto: 'Incidente detectado - Actuación inmediata'
      }
    ],
    logs: [
      {
        fecha: '2024-01-20 14:30:00',
        usuario: 'Juan Carlos Pérez',
        accion: 'Registro de caso',
        detalles: 'Caso CASO-001 registrado con prioridad alta'
      },
      {
        fecha: '2024-01-20 14:45:00',
        usuario: 'Juan Carlos Pérez',
        accion: 'Activación protocolo',
        detalles: 'Protocolo de vestuarios activado para caso CASO-001'
      }
    ]
  }
}

const generarInformePDF = (datos: DatosLegales, tipoExportacion: string): Buffer => {
  const doc = new jsPDF()

  // Encabezado
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text('INFORME OFICIAL LOPIVI', 20, 30)

  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Tipo: ${tipoExportacion.toUpperCase()}`, 20, 40)
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 20, 47)

  // Información de la entidad
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text('INFORMACIÓN DE LA ENTIDAD', 20, 65)

  doc.setFontSize(10)
  doc.text(`Entidad: ${datos.entidad.nombre}`, 20, 75)
  doc.text(`Delegado Principal: ${datos.entidad.delegadoPrincipal}`, 20, 82)
  if (datos.entidad.delegadoSuplente) {
    doc.text(`Delegado Suplente: ${datos.entidad.delegadoSuplente}`, 20, 89)
  }
  doc.text(`Implementación LOPIVI: ${datos.entidad.fechaImplementacion}`, 20, 96)

  // Estado de cumplimiento
  doc.setFontSize(14)
  doc.text('ESTADO DE CUMPLIMIENTO', 20, 115)

  doc.setFontSize(10)
  doc.text(`Cumplimiento General: ${datos.cumplimiento.porcentajeGeneral}%`, 20, 125)
  doc.text(`Última Evaluación: ${datos.cumplimiento.ultimaEvaluacion}`, 20, 132)
  doc.text(`Próxima Revisión: ${datos.cumplimiento.proximaRevision}`, 20, 139)

  // Tabla de casos
  if (datos.casos.length > 0) {
    doc.setFontSize(14)
    doc.text('CASOS GESTIONADOS', 20, 160)

    const casosDatos = datos.casos.map(caso => [
      caso.id,
      caso.titulo.substring(0, 30) + '...',
      caso.fecha,
      caso.prioridad,
      caso.estado
    ])

    ;(doc as any).autoTable({
      head: [['ID', 'Título', 'Fecha', 'Prioridad', 'Estado']],
      body: casosDatos,
      startY: 170,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    })
  }

  // Nueva página para formaciones
  doc.addPage()

  // Tabla de formaciones
  doc.setFontSize(14)
  doc.text('FORMACIONES COMPLETADAS', 20, 30)

  const formacionesDatos = datos.formaciones.map(form => [
    form.personal,
    form.curso,
    form.fechaCompletada,
    form.certificado
  ])

  ;(doc as any).autoTable({
    head: [['Personal', 'Curso', 'Fecha', 'Certificado']],
    body: formacionesDatos,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [39, 174, 96] }
  })

  // Tabla de certificaciones
  doc.setFontSize(14)
  doc.text('CERTIFICACIONES VIGENTES', 20, 120)

  const certificacionesDatos = datos.certificaciones.map(cert => [
    cert.delegado,
    cert.tipo,
    cert.fechaEmision,
    cert.fechaVencimiento,
    cert.estado
  ])

  ;(doc as any).autoTable({
    head: [['Delegado', 'Tipo', 'Emisión', 'Vencimiento', 'Estado']],
    body: certificacionesDatos,
    startY: 130,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [142, 68, 173] }
  })

  // Pie de página legal
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('Este documento ha sido generado automáticamente por Custodia360', 20, 280)
  doc.text('en cumplimiento de la Ley Orgánica 8/2021 de Protección Integral a la Infancia y la Adolescencia (LOPIVI)', 20, 287)

  return Buffer.from(doc.output('arraybuffer'))
}

const generarCSV = (datos: DatosLegales): string => {
  let csv = 'TIPO,ID,FECHA,DESCRIPCION,RESPONSABLE,ESTADO\n'

  // Casos
  datos.casos.forEach(caso => {
    csv += `CASO,${caso.id},${caso.fecha},"${caso.titulo}",${datos.entidad.delegadoPrincipal},${caso.estado}\n`
  })

  // Formaciones
  datos.formaciones.forEach(form => {
    csv += `FORMACION,${form.id},${form.fechaCompletada},"${form.curso}",${form.personal},completada\n`
  })

  // Certificaciones
  datos.certificaciones.forEach(cert => {
    csv += `CERTIFICACION,${cert.tipo},${cert.fechaEmision},"Certificación ${cert.tipo}",${cert.delegado},${cert.estado}\n`
  })

  return csv
}

const generarJSON = (datos: DatosLegales): string => {
  return JSON.stringify({
    metadatos: {
      generadoPor: 'Custodia360',
      fechaGeneracion: new Date().toISOString(),
      version: '1.0'
    },
    datos
  }, null, 2)
}

export async function POST(request: Request) {
  try {
    const {
      entidadId,
      fechaInicio,
      fechaFin,
      tipoExportacion,
      formato = 'pdf'
    } = await request.json()

    console.log(`📋 Generando exportación legal: ${tipoExportacion} - Formato: ${formato}`)

    // Obtener datos
    const datos = await obtenerDatosLegales(
      entidadId,
      new Date(fechaInicio),
      new Date(fechaFin)
    )

    let contenido: Buffer | string
    let contentType: string
    let extension: string

    switch (formato) {
      case 'pdf':
        contenido = generarInformePDF(datos, tipoExportacion)
        contentType = 'application/pdf'
        extension = 'pdf'
        break
      case 'csv':
        contenido = generarCSV(datos)
        contentType = 'text/csv'
        extension = 'csv'
        break
      case 'json':
        contenido = generarJSON(datos)
        contentType = 'application/json'
        extension = 'json'
        break
      default:
        throw new Error(`Formato no soportado: ${formato}`)
    }

    const nombreArchivo = `LOPIVI_${tipoExportacion}_${entidadId}_${new Date().toISOString().split('T')[0]}.${extension}`

    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Content-Disposition', `attachment; filename="${nombreArchivo}"`)

    return new NextResponse(contenido, {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('❌ Error en exportación legal:', error)
    return NextResponse.json({
      success: false,
      error: 'Error generando exportación legal',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

// GET para obtener configuración de backup
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const entidadId = searchParams.get('entidadId')

    if (!entidadId) {
      return NextResponse.json({
        error: 'ID de entidad requerido'
      }, { status: 400 })
    }

    // Configuración de backup simulada
    const configuracion: BackupConfig = {
      frecuencia: 'semanal',
      tiposDatos: ['casos', 'formacion', 'certificaciones', 'protocolos'],
      formatoExportacion: 'json',
      encriptacion: true,
      destinoAlmacenamiento: 'cloud'
    }

    const ultimosBackups = [
      {
        id: 'backup_001',
        fecha: '2024-01-20',
        tipo: 'automatico',
        estado: 'completado',
        tamaño: '2.3 MB',
        registros: 1247
      },
      {
        id: 'backup_002',
        fecha: '2024-01-13',
        tipo: 'automatico',
        estado: 'completado',
        tamaño: '2.1 MB',
        registros: 1198
      },
      {
        id: 'backup_003',
        fecha: '2024-01-10',
        tipo: 'manual',
        estado: 'completado',
        tamaño: '2.2 MB',
        registros: 1205
      }
    ]

    return NextResponse.json({
      success: true,
      configuracion,
      ultimosBackups,
      proximoBackup: '2024-01-27'
    })

  } catch (error) {
    console.error('❌ Error obteniendo configuración de backup:', error)
    return NextResponse.json({
      success: false,
      error: 'Error obteniendo configuración'
    }, { status: 500 })
  }
}
