import { NextRequest, NextResponse } from 'next/server'

function generarContenidoPDF(tipo: string, datos: any): string {
  const fechaActual = new Date().toLocaleDateString('es-ES')

  // Generar contenido HTML básico para cada tipo de documento
  switch (tipo) {
    case 'certificado-delegado':
      return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(CERTIFICADO DE DELEGADO DE PROTECCION LOPIVI) Tj
0 -30 Td
(Delegado: ${datos.delegado || 'N/A'}) Tj
0 -20 Td
(Entidad: ${datos.entidad || 'N/A'}) Tj
0 -20 Td
(Tipo: ${datos.tipo || 'Principal'}) Tj
0 -20 Td
(Fecha: ${fechaActual}) Tj
0 -20 Td
(Vigencia: ${datos.vigenciaHasta || '2025-12-31'}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000000526 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
625
%%EOF`

    case 'certificado-personal-lopivi':
      return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
    /F2 6 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 650
>>
stream
BT
/F2 16 Tf
50 720 Td
(CERTIFICADO DE FORMACION LOPIVI) Tj
0 -40 Td
/F1 12 Tf
(Ley Organica de Proteccion Integral a la Infancia y Adolescencia) Tj
0 -40 Td
(----------------------------------------------------------) Tj
0 -30 Td
(CERTIFICA QUE:) Tj
0 -30 Td
/F2 14 Tf
(${datos.nombre || 'Nombre del empleado'}) Tj
0 -25 Td
/F1 10 Tf
(DNI: ${datos.dni || 'N/A'}) Tj
0 -20 Td
(Cargo: ${datos.cargo || 'N/A'}) Tj
0 -20 Td
(Fecha de nacimiento: ${datos.fechaNacimiento || 'N/A'}) Tj
0 -30 Td
/F1 12 Tf
(Ha completado satisfactoriamente la formacion en) Tj
0 -20 Td
(PROTECCION INTEGRAL DE MENORES segun LOPIVI) Tj
0 -30 Td
(Entidad: ${datos.entidad || 'N/A'}) Tj
0 -20 Td
(Delegado responsable: ${datos.delegado || 'N/A'}) Tj
0 -30 Td
(Estado del certificado: ${datos.certificadoLOPIVI || 'N/A'}) Tj
0 -20 Td
(Fecha de certificacion: ${datos.fechaCertificado || 'N/A'}) Tj
0 -20 Td
(Valido hasta: ${datos.validez || 'N/A'}) Tj
0 -20 Td
(Numero de serie: ${datos.numeroSerie || 'N/A'}) Tj
0 -40 Td
(Fecha de emision: ${fechaActual}) Tj
0 -30 Td
(Este certificado acredita el cumplimiento de la) Tj
0 -15 Td
(formacion obligatoria establecida en la LOPIVI) Tj
0 -15 Td
(para el trabajo con menores de edad.) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000000976 00000 n
0000001075 00000 n
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
1179
%%EOF`

    case 'informe-caso-detallado':
      return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 400
>>
stream
BT
/F1 12 Tf
50 750 Td
(INFORME DETALLADO DE CASO LOPIVI) Tj
0 -30 Td
(Caso: ${datos.numeroCaso || 'N/A'}) Tj
0 -20 Td
(Expediente: ${datos.expediente || 'N/A'}) Tj
0 -20 Td
(Tipo: ${datos.tipoCaso || 'N/A'}) Tj
0 -20 Td
(Menor: ${datos.menor || 'N/A'}) Tj
0 -20 Td
(Prioridad: ${datos.prioridad || 'N/A'}) Tj
0 -20 Td
(Estado: ${datos.estado || 'N/A'}) Tj
0 -20 Td
(Fecha incidente: ${datos.fechaIncidente || 'N/A'}) Tj
0 -20 Td
(Ubicacion: ${datos.ubicacion || 'N/A'}) Tj
0 -20 Td
(Delegado: ${datos.delegado || 'N/A'}) Tj
0 -20 Td
(Entidad: ${datos.entidad || 'N/A'}) Tj
0 -20 Td
(Fecha informe: ${fechaActual}) Tj
0 -20 Td
(Hora informe: ${datos.horaInforme || 'N/A'}) Tj
0 -30 Td
(DESCRIPCION:) Tj
0 -20 Td
(${(datos.descripcion || 'Sin descripcion').substring(0, 100)}...) Tj
0 -20 Td
(ACCIONES TOMADAS:) Tj
0 -20 Td
(${(datos.accionesTomadas || 'Sin acciones registradas').substring(0, 100)}...) Tj
0 -20 Td
(TESTIGOS: ${datos.testigos || 'Ninguno registrado'}) Tj
0 -20 Td
(PROXIMA REVISION: ${datos.fechaProximaRevision || 'No programada'}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000000726 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
825
%%EOF`

    case 'informe-cumplimiento-delegado':
      return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 250
>>
stream
BT
/F1 12 Tf
50 750 Td
(INFORME DE CUMPLIMIENTO LOPIVI) Tj
0 -30 Td
(Entidad: ${datos.entidad || 'N/A'}) Tj
0 -20 Td
(Delegado: ${datos.delegado || 'N/A'}) Tj
0 -20 Td
(Cumplimiento: ${datos.cumplimiento || 0}%) Tj
0 -20 Td
(Casos Activos: ${datos.casosActivos || 0}) Tj
0 -20 Td
(Alertas: ${datos.alertas || 0}) Tj
0 -20 Td
(Fecha Informe: ${fechaActual}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000000576 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
675
%%EOF`

    case 'plan-proteccion':
      return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
    /F2 6 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 900
>>
stream
BT
/F2 16 Tf
50 720 Td
(PLAN DE PROTECCION INFANTIL) Tj
0 -20 Td
/F1 12 Tf
(Segun Ley Organica de Proteccion Integral - LOPIVI) Tj
0 -40 Td
(Entidad: ${datos.entidad || 'Entidad Deportiva'}) Tj
0 -20 Td
(Fecha de elaboracion: ${fechaActual}) Tj
0 -30 Td
/F2 14 Tf
(1. OBJETIVO) Tj
0 -20 Td
/F1 10 Tf
(Garantizar la proteccion integral de todos los menores) Tj
0 -15 Td
(que participan en las actividades de la entidad.) Tj
0 -25 Td
/F2 14 Tf
(2. AMBITO DE APLICACION) Tj
0 -20 Td
/F1 10 Tf
(Este plan se aplica a todas las actividades, instalaciones) Tj
0 -15 Td
(y personal que tengan contacto con menores de edad.) Tj
0 -25 Td
/F2 14 Tf
(3. DELEGADO DE PROTECCION) Tj
0 -20 Td
/F1 10 Tf
(Delegado Principal: Designado y certificado) Tj
0 -15 Td
(Funciones: Supervision, formacion y protocolo emergencias) Tj
0 -25 Td
/F2 14 Tf
(4. FORMACION DEL PERSONAL) Tj
0 -20 Td
/F1 10 Tf
(Todo el personal recibira formacion especifica en:) Tj
0 -15 Td
(- Deteccion de situaciones de riesgo) Tj
0 -15 Td
(- Protocolos de actuacion ante incidentes) Tj
0 -15 Td
(- Codigo de conducta con menores) Tj
0 -25 Td
/F2 14 Tf
(5. PROTOCOLOS DE ACTUACION) Tj
0 -20 Td
/F1 10 Tf
(Procedimientos claros para situaciones de riesgo,) Tj
0 -15 Td
(comunicacion con familias y autoridades competentes.) Tj
0 -25 Td
/F2 14 Tf
(6. SEGUIMIENTO Y EVALUACION) Tj
0 -20 Td
/F1 10 Tf
(Revision periodica de la efectividad del plan) Tj
0 -15 Td
(y actualizacion segun normativa vigente.) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000001226 00000 n
0000001325 00000 n
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
1429
%%EOF`

    case 'codigo-conducta':
      return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
    /F2 6 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 800
>>
stream
BT
/F2 16 Tf
50 720 Td
(CODIGO DE CONDUCTA) Tj
0 -20 Td
/F1 12 Tf
(Para el personal que trabaja con menores - LOPIVI) Tj
0 -40 Td
(Entidad: ${datos.entidad || 'Entidad Deportiva'}) Tj
0 -20 Td
(Fecha: ${fechaActual}) Tj
0 -30 Td
/F2 14 Tf
(PRINCIPIOS FUNDAMENTALES) Tj
0 -25 Td
/F1 10 Tf
(1. Respeto absoluto hacia los menores) Tj
0 -15 Td
(2. Proteccion de su integridad fisica y emocional) Tj
0 -15 Td
(3. Confidencialidad de su informacion personal) Tj
0 -15 Td
(4. Trato igualitario sin discriminacion alguna) Tj
0 -25 Td
/F2 14 Tf
(CONDUCTAS OBLIGATORIAS) Tj
0 -20 Td
/F1 10 Tf
(- Mantener comunicacion transparente y respetuosa) Tj
0 -15 Td
(- Respetar la intimidad y privacidad de los menores) Tj
0 -15 Td
(- Informar inmediatamente cualquier situacion de riesgo) Tj
0 -15 Td
(- Cumplir estrictamente los protocolos establecidos) Tj
0 -25 Td
/F2 14 Tf
(CONDUCTAS PROHIBIDAS) Tj
0 -20 Td
/F1 10 Tf
(- Cualquier forma de maltrato fisico o psicologico) Tj
0 -15 Td
(- Contacto fisico inapropiado con menores) Tj
0 -15 Td
(- Uso de lenguaje ofensivo o degradante) Tj
0 -15 Td
(- Quedarse a solas con un menor sin supervision) Tj
0 -25 Td
/F2 14 Tf
(PROCEDIMIENTO DE DENUNCIA) Tj
0 -20 Td
/F1 10 Tf
(Cualquier incumplimiento debe ser comunicado) Tj
0 -15 Td
(inmediatamente al Delegado de Proteccion.) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000001126 00000 n
0000001225 00000 n
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
1329
%%EOF`

    case 'protocolos-actuacion':
      return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
    /F2 6 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 750
>>
stream
BT
/F2 16 Tf
50 720 Td
(PROTOCOLOS DE ACTUACION) Tj
0 -20 Td
/F1 12 Tf
(Procedimientos ante situaciones de riesgo - LOPIVI) Tj
0 -40 Td
(Entidad: ${datos.entidad || 'Entidad Deportiva'}) Tj
0 -20 Td
(Fecha: ${fechaActual}) Tj
0 -30 Td
/F2 14 Tf
(PROTOCOLO DE EMERGENCIA) Tj
0 -25 Td
/F1 10 Tf
(1. Garantizar seguridad inmediata del menor) Tj
0 -15 Td
(2. Evaluar necesidad de atencion medica urgente) Tj
0 -15 Td
(3. Contactar servicios de emergencia: 112) Tj
0 -15 Td
(4. Notificar inmediatamente a la familia) Tj
0 -15 Td
(5. Documentar todos los hechos detalladamente) Tj
0 -15 Td
(6. Comunicar a autoridades competentes en 24h) Tj
0 -25 Td
/F2 14 Tf
(SITUACIONES DE RIESGO) Tj
0 -20 Td
/F1 10 Tf
(- Evaluar nivel de riesgo (inmediato/potencial)) Tj
0 -15 Td
(- Documentar observaciones y evidencias) Tj
0 -15 Td
(- Entrevista preliminar apropiada para la edad) Tj
0 -15 Td
(- Elaborar plan de proteccion especifico) Tj
0 -15 Td
(- Establecer seguimiento continuo) Tj
0 -25 Td
/F2 14 Tf
(CONTACTO CON AUTORIDADES) Tj
0 -20 Td
/F1 10 Tf
(Fiscalia de Menores - Servicios Sociales) Tj
0 -15 Td
(Policia Nacional: 091 - Guardia Civil: 062) Tj
0 -15 Td
(Telefono contra violencia de genero: 016) Tj
0 -25 Td
/F1 8 Tf
(Documento generado conforme a la LOPIVI) Tj
0 -12 Td
(Ley Organica 8/2021 de Proteccion Integral) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000001076 00000 n
0000001175 00000 n
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
1279
%%EOF`

    default:
      return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
    /F2 6 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 400
>>
stream
BT
/F2 14 Tf
50 720 Td
(DOCUMENTO LOPIVI) Tj
0 -30 Td
/F1 12 Tf
(Tipo: ${tipo.toUpperCase().replace(/-/g, ' ')}) Tj
0 -25 Td
(Entidad: ${datos.entidad || 'Entidad Deportiva'}) Tj
0 -20 Td
(Delegado: ${datos.delegado || 'Delegado de Proteccion'}) Tj
0 -20 Td
(Fecha de generacion: ${fechaActual}) Tj
0 -40 Td
/F1 10 Tf
(Este documento forma parte del sistema de) Tj
0 -15 Td
(proteccion integral de menores establecido) Tj
0 -15 Td
(por la LOPIVI (Ley Organica 8/2021).) Tj
0 -30 Td
(Contenido especifico del documento:) Tj
0 -20 Td
(- Procedimientos y protocolos actualizados) Tj
0 -15 Td
(- Normativa aplicable vigente) Tj
0 -15 Td
(- Responsabilidades del personal) Tj
0 -15 Td
(- Medidas de proteccion implementadas) Tj
0 -30 Td
/F1 8 Tf
(Generado automaticamente por Custodia360) Tj
0 -12 Td
(Sistema de gestion LOPIVI certificado) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000000726 00000 n
0000000825 00000 n
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
929
%%EOF`
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tipo, datos } = await request.json()

    // Validar tipo de documento
    const tiposValidos = [
      'planProteccion',
      'certificadoLOPIVI',
      'protocolos',
      'codigoConducta',
      'certificado-delegado',
      'informe-cumplimiento-delegado',
      'informe-caso-detallado',
      'certificado-personal-lopivi',
      'plan-proteccion',
      'codigo-conducta',
      'protocolos-actuacion',
      'registro-incidentes',
      'lista-personal',
      'certificados-formacion',
      'informe-mensual',
      'reporte-casos',
      'estado-formacion',
      'registro-actividades',
      'analisis-incidentes',
      'informe-anual'
    ]
    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo de documento no válido' },
        { status: 400 }
      )
    }

    // Generar PDF básico usando HTML to PDF simple
    const pdfContent = generarContenidoPDF(tipo, datos)

    // Simular PDF con HTML convertido a blob
    const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' })

    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${tipo}_${Date.now()}.pdf"`
      }
    })
  } catch (error) {
    console.error('Error en API PDF:', error)
    return NextResponse.json(
      { error: 'Error temporal en la generación de PDFs' },
      { status: 503 }
    )
  }
}
