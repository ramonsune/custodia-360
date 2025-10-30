import { NextRequest, NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tipo = searchParams.get('tipo')
    const entidad = searchParams.get('entidad')

    if (!tipo) {
      return NextResponse.json({ error: 'Tipo de documento requerido' }, { status: 400 })
    }

    // Generar PDF según el tipo de documento
    const doc = new jsPDF()

    // Configurar documento
    doc.setFontSize(20)
    doc.text('CUSTODIA360 - Documento LOPIVI', 20, 30)

    doc.setFontSize(16)
    doc.text(getTituloDocumento(tipo), 20, 50)

    if (entidad) {
      doc.setFontSize(12)
      doc.text(`Entidad: ${entidad}`, 20, 70)
    }

    doc.setFontSize(10)
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 85)

    // Contenido específico según tipo
    const contenido = getContenidoDocumento(tipo)
    doc.setFontSize(10)

    let yPosition = 100
    contenido.forEach((linea: string) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(linea, 20, yPosition)
      yPosition += 7
    })

    // Footer
    doc.setFontSize(8)
    doc.text('Este documento ha sido generado automáticamente por Custodia360', 20, 285)
    doc.text('Sistema automatizado de cumplimiento LOPIVI', 20, 290)

    // Generar PDF como buffer
    const pdfBuffer = doc.output('arraybuffer')

    // Retornar PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${tipo}-${entidad || 'documento'}.pdf"`
      }
    })

  } catch (error) {
    console.error('Error generando documento:', error)
    return NextResponse.json({ error: 'Error generando documento' }, { status: 500 })
  }
}

function getTituloDocumento(tipo: string): string {
  const titulos: { [key: string]: string } = {
    'protocolo-infancia': 'Protocolo de Protección Infantil',
    'protocolo-directiva': 'Protocolo para Directivos',
    'protocolo-contacto': 'Protocolo Personal de Contacto',
    'protocolo-sin-contacto': 'Protocolo Personal Sin Contacto',
    'mapa-riesgos': 'Mapa de Riesgos',
    'codigo-conducta': 'Código de Conducta',
    'protocolo-16': 'Protocolo +16 años',
    'protocolo-familia': 'Protocolo Familia y Tutores'
  }
  return titulos[tipo] || 'Documento LOPIVI'
}

function getContenidoDocumento(tipo: string): string[] {
  const contenidos: { [key: string]: string[] } = {
    'protocolo-infancia': [
      '1. OBJETIVO',
      'Establecer un marco integral de protección para todos los menores que participan',
      'en actividades de la entidad.',
      '',
      '2. ÁMBITO DE APLICACIÓN',
      'Este protocolo se aplica a todas las instalaciones, actividades y eventos',
      'organizados por la entidad.',
      '',
      '3. RESPONSABILIDADES',
      '- Directivos: Supervisión general y toma de decisiones estratégicas',
      '- Delegado/a Principal: Coordinación y gestión de casos',
      '- Delegado/a Suplente: Apoyo y seguimiento especializado',
      '- Personal: Detección temprana y comunicación',
      '',
      '4. PROCEDIMIENTOS',
      '- Identificación y evaluación de situaciones de riesgo',
      '- Protocolos específicos para espacios privados',
      '- Gestión de eventos con participación de menores',
      '- Comunicación inmediata con familias y autoridades'
    ],
    'mapa-riesgos': [
      '1. IDENTIFICACIÓN DE RIESGOS',
      'Análisis sistemático de todos los espacios y actividades donde pueden',
      'presentarse situaciones de riesgo para los menores.',
      '',
      '2. CLASIFICACIÓN DE RIESGOS',
      '- Riesgo ALTO: Espacios privados, vestuarios, actividades individuales',
      '- Riesgo MEDIO: Actividades grupales, transporte, eventos',
      '- Riesgo BAJO: Espacios públicos supervisados',
      '',
      '3. MEDIDAS PREVENTIVAS',
      '- Supervisión constante en espacios de riesgo alto',
      '- Protocolos específicos para cada tipo de actividad',
      '- Formación del personal en identificación de riesgos',
      '',
      '4. PLAN DE ACCIÓN',
      '- Procedimientos de emergencia',
      '- Canales de comunicación rápida',
      '- Registro y seguimiento de incidentes'
    ],
    'codigo-conducta': [
      '1. PRINCIPIOS FUNDAMENTALES',
      'Todo el personal debe actuar con profesionalidad, respeto y',
      'protección hacia los menores.',
      '',
      '2. NORMAS DE COMPORTAMIENTO',
      '- Mantener relaciones profesionales apropiadas',
      '- Respetar la dignidad y privacidad de los menores',
      '- No utilizar lenguaje inapropiado o comportamiento intimidatorio',
      '- Informar inmediatamente cualquier situación preocupante',
      '',
      '3. PROHIBICIONES',
      '- Contacto físico inapropiado',
      '- Relaciones personales fuera del ámbito profesional',
      '- Uso de redes sociales personales con menores',
      '- Estar a solas con un menor sin supervisión',
      '',
      '4. CONSECUENCIAS',
      'El incumplimiento de este código puede resultar en medidas',
      'disciplinarias incluida la terminación del empleo.'
    ]
  }

  return contenidos[tipo] || [
    'Documento genérico LOPIVI',
    'Este documento contiene información específica sobre protección infantil',
    'según los requisitos de la LOPIVI.',
    '',
    'Para más información, consulte con su Delegado/a de Protección.'
  ]
}
