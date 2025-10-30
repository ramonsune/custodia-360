import { NextRequest, NextResponse } from 'next/server'

function generarProtocoloUrgentePDF(tipoProtocolo: string, datos: any): string {
  const fechaActual = new Date().toLocaleDateString('es-ES')
  const horaActual = new Date().toLocaleTimeString('es-ES')

  switch (tipoProtocolo) {
    case 'protocolo-maltrato':
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
    /F3 7 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 1200
>>
stream
BT
/F3 18 Tf
50 740 Td
(🚨 PROTOCOLO DE EMERGENCIA - SOSPECHA DE MALTRATO) Tj
0 -25 Td
/F2 14 Tf
(Activacion automatica segun LOPIVI - Caso ${datos.casoId || 'N/A'}) Tj
0 -40 Td
/F1 10 Tf
(Fecha de activacion: ${fechaActual} - ${horaActual}) Tj
0 -15 Td
(Entidad: ${datos.entidad || 'N/A'}) Tj
0 -15 Td
(Delegado responsable: ${datos.delegado || 'N/A'}) Tj
0 -30 Td
/F2 12 Tf
(ACCIONES INMEDIATAS OBLIGATORIAS:) Tj
0 -25 Td
/F1 10 Tf
(1. GARANTIZAR SEGURIDAD INMEDIATA DEL MENOR) Tj
0 -15 Td
(   - Separar al menor de la situacion de riesgo) Tj
0 -15 Td
(   - NO dejar solo al menor en ningun momento) Tj
0 -15 Td
(   - Contactar con personal de apoyo disponible) Tj
0 -20 Td
(2. DOCUMENTACION INMEDIATA) Tj
0 -15 Td
(   - Anotar fecha, hora exacta y ubicacion) Tj
0 -15 Td
(   - Registrar testimonios sin influir en relato) Tj
0 -15 Td
(   - Fotografiar evidencias fisicas si existen) Tj
0 -20 Td
(3. CONTACTOS DE EMERGENCIA) Tj
0 -15 Td
(   - Servicios de Emergencia: 112) Tj
0 -15 Td
(   - Servicios Sociales: 900 123 456) Tj
0 -15 Td
(   - Fiscalia de Menores: 91 000 00 00) Tj
0 -15 Td
(   - Policia Nacional: 091) Tj
0 -20 Td
(4. COMUNICACION CON FAMILIA) Tj
0 -15 Td
(   - Evaluar si es seguro contactar familia) Tj
0 -15 Td
(   - Si hay sospecha familiar: NO contactar hasta) Tj
0 -15 Td
(     coordinacion con servicios sociales) Tj
0 -20 Td
(5. REGISTRO Y SEGUIMIENTO) Tj
0 -15 Td
(   - Completar informe detallado en 24h) Tj
0 -15 Td
(   - Programar seguimiento con menor) Tj
0 -15 Td
(   - Coordinar con servicios externos) Tj
0 -30 Td
/F2 11 Tf
(IMPORTANTE: Este protocolo es de cumplimiento) Tj
0 -15 Td
(OBLIGATORIO segun art. 16 LOPIVI) Tj
0 -25 Td
/F1 8 Tf
(Documento generado automaticamente - Hash: ${datos.legal_hash || 'N/A'}) Tj
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

7 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-BoldOblique
>>
endobj

xref
0 8
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000300 00000 n
0000001552 00000 n
0000001651 00000 n
trailer
<<
/Size 8
/Root 1 0 R
>>
startxref
1755
%%EOF`

    case 'protocolo-abuso':
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
    /F3 7 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 1400
>>
stream
BT
/F3 18 Tf
50 740 Td
(🚨 PROTOCOLO CRITICO - PRESUNTO ABUSO SEXUAL) Tj
0 -25 Td
/F2 14 Tf
(ATENCION ESPECIALIZADA REQUERIDA - Caso ${datos.casoId || 'N/A'}) Tj
0 -40 Td
/F1 10 Tf
(Fecha de activacion: ${fechaActual} - ${horaActual}) Tj
0 -15 Td
(Entidad: ${datos.entidad || 'N/A'}) Tj
0 -15 Td
(Delegado responsable: ${datos.delegado || 'N/A'}) Tj
0 -30 Td
/F2 12 Tf
(PROTOCOLO ESPECIAL - MAXIMA PRIORIDAD) Tj
0 -25 Td
/F1 10 Tf
(1. SEGURIDAD INMEDIATA) Tj
0 -15 Td
(   - Garantizar proteccion total del menor) Tj
0 -15 Td
(   - Evitar contacto con presunto agresor) Tj
0 -15 Td
(   - Activar protocolo de proteccion testigos) Tj
0 -20 Td
(2. PRESERVACION DE EVIDENCIAS) Tj
0 -15 Td
(   - NO realizar exploracion fisica) Tj
0 -15 Td
(   - NO lavar ni cambiar ropa del menor) Tj
0 -15 Td
(   - Conservar objetos relacionados) Tj
0 -15 Td
(   - Documentar estado emocional) Tj
0 -20 Td
(3. CONTACTOS CRITICOS - ACTIVACION INMEDIATA) Tj
0 -15 Td
(   - Emergencias Sanitarias: 112) Tj
0 -15 Td
(   - Fiscalia de Menores: INMEDIATO) Tj
0 -15 Td
(   - Policia especializada: 091) Tj
0 -15 Td
(   - Servicios Sociales especializados) Tj
0 -20 Td
(4. PROCEDIMIENTO CON EL MENOR) Tj
0 -15 Td
(   - Crear ambiente seguro y tranquilo) Tj
0 -15 Td
(   - NO realizar interrogatorio) Tj
0 -15 Td
(   - Escucha activa sin preguntas directas) Tj
0 -15 Td
(   - Contacto con psicologo especializado) Tj
0 -20 Td
(5. COMUNICACION FAMILIAR) Tj
0 -15 Td
(   - EVALUAR RIESGO antes de contacto) Tj
0 -15 Td
(   - Coordinar con servicios sociales) Tj
0 -15 Td
(   - Considerar medidas de proteccion) Tj
0 -20 Td
(6. DOCUMENTACION ESPECIALIZADA) Tj
0 -15 Td
(   - Registro detallado de declaraciones) Tj
0 -15 Td
(   - Hora, fecha, testigos presentes) Tj
0 -15 Td
(   - Estado emocional del menor) Tj
0 -15 Td
(   - Comunicacion con autoridades en 2h MAX) Tj
0 -30 Td
/F2 11 Tf
(ATENCION: Protocolo sujeto a supervision) Tj
0 -15 Td
(judicial inmediata - Art. 26 LOPIVI) Tj
0 -25 Td
/F1 8 Tf
(CONFIDENCIAL - Solo personal autorizado) Tj
0 -12 Td
(Hash legal: ${datos.legal_hash || 'N/A'}) Tj
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

7 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-BoldOblique
>>
endobj

xref
0 8
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000300 00000 n
0000001752 00000 n
0000001851 00000 n
trailer
<<
/Size 8
/Root 1 0 R
>>
startxref
1955
%%EOF`

    case 'protocolo-abandono':
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
    /F3 7 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 1100
>>
stream
BT
/F3 18 Tf
50 740 Td
(⚠️ PROTOCOLO - ABANDONO/NEGLIGENCIA) Tj
0 -25 Td
/F2 14 Tf
(Situacion de desproteccion detectada - Caso ${datos.casoId || 'N/A'}) Tj
0 -40 Td
/F1 10 Tf
(Fecha de activacion: ${fechaActual} - ${horaActual}) Tj
0 -15 Td
(Entidad: ${datos.entidad || 'N/A'}) Tj
0 -15 Td
(Delegado responsable: ${datos.delegado || 'N/A'}) Tj
0 -30 Td
/F2 12 Tf
(EVALUACION Y ACTUACION INMEDIATA) Tj
0 -25 Td
/F1 10 Tf
(1. EVALUACION DE NECESIDADES BASICAS) Tj
0 -15 Td
(   - Verificar estado nutricional) Tj
0 -15 Td
(   - Evaluar higiene y vestimenta) Tj
0 -15 Td
(   - Comprobar necesidades medicas) Tj
0 -15 Td
(   - Assessar seguridad del entorno) Tj
0 -20 Td
(2. ATENCION INMEDIATA) Tj
0 -15 Td
(   - Satisfacer necesidades basicas urgentes) Tj
0 -15 Td
(   - Proporcionar alimento si es necesario) Tj
0 -15 Td
(   - Contactar servicios sanitarios) Tj
0 -20 Td
(3. LOCALIZACION FAMILIAR) Tj
0 -15 Td
(   - Intentar contacto con responsables) Tj
0 -15 Td
(   - Verificar paradero de tutores) Tj
0 -15 Td
(   - Evaluar situacion familiar) Tj
0 -20 Td
(4. CONTACTOS NECESARIOS) Tj
0 -15 Td
(   - Servicios Sociales: 900 123 456) Tj
0 -15 Td
(   - Centro de Salud: Segun necesidad) Tj
0 -15 Td
(   - Policia Local: 092) Tj
0 -15 Td
(   - Emergencias si estado grave: 112) Tj
0 -20 Td
(5. DOCUMENTACION) Tj
0 -15 Td
(   - Estado del menor al momento deteccion) Tj
0 -15 Td
(   - Circunstancias del abandono/negligencia) Tj
0 -15 Td
(   - Acciones tomadas paso a paso) Tj
0 -15 Td
(   - Personas contactadas y respuestas) Tj
0 -20 Td
(6. SEGUIMIENTO) Tj
0 -15 Td
(   - Plan de atencion continua) Tj
0 -15 Td
(   - Coordinacion con familia) Tj
0 -15 Td
(   - Revision en 48h obligatoria) Tj
0 -30 Td
/F2 11 Tf
(Protocolo supervisado por Servicios Sociales) Tj
0 -25 Td
/F1 8 Tf
(Generado: ${fechaActual} ${horaActual}) Tj
0 -12 Td
(Hash: ${datos.legal_hash || 'N/A'}) Tj
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

7 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-BoldOblique
>>
endobj

xref
0 8
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000300 00000 n
0000001452 00000 n
0000001551 00000 n
trailer
<<
/Size 8
/Root 1 0 R
>>
startxref
1655
%%EOF`

    case 'protocolo-emergencia':
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
    /F3 7 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 1000
>>
stream
BT
/F3 18 Tf
50 740 Td
(🆘 PROTOCOLO DE EMERGENCIA GENERAL) Tj
0 -25 Td
/F2 14 Tf
(Situacion critica no especificada - Caso ${datos.casoId || 'N/A'}) Tj
0 -40 Td
/F1 10 Tf
(Fecha de activacion: ${fechaActual} - ${horaActual}) Tj
0 -15 Td
(Entidad: ${datos.entidad || 'N/A'}) Tj
0 -15 Td
(Delegado responsable: ${datos.delegado || 'N/A'}) Tj
0 -30 Td
/F2 12 Tf
(ACTUACION DE EMERGENCIA) Tj
0 -25 Td
/F1 10 Tf
(1. EVALUACION RAPIDA) Tj
0 -15 Td
(   - Determinar tipo de riesgo presente) Tj
0 -15 Td
(   - Evaluar nivel de urgencia) Tj
0 -15 Td
(   - Identificar menores afectados) Tj
0 -20 Td
(2. SEGURIDAD INMEDIATA) Tj
0 -15 Td
(   - Alejar menores del peligro) Tj
0 -15 Td
(   - Establecer zona segura) Tj
0 -15 Td
(   - Contar y ubicar a todos los menores) Tj
0 -20 Td
(3. CONTACTOS DE EMERGENCIA) Tj
0 -15 Td
(   - Emergencias Generales: 112) Tj
0 -15 Td
(   - Bomberos: 080) Tj
0 -15 Td
(   - Policia: 091) Tj
0 -15 Td
(   - Servicios Medicos: Segun necesidad) Tj
0 -20 Td
(4. COMUNICACION) Tj
0 -15 Td
(   - Informar situacion a responsables) Tj
0 -15 Td
(   - Contactar familias una vez seguro) Tj
0 -15 Td
(   - Coordinar con servicios externos) Tj
0 -20 Td
(5. DOCUMENTACION) Tj
0 -15 Td
(   - Registro cronologico de eventos) Tj
0 -15 Td
(   - Lista de menores y estado) Tj
0 -15 Td
(   - Acciones tomadas) Tj
0 -15 Td
(   - Servicios contactados) Tj
0 -20 Td
(6. POST-EMERGENCIA) Tj
0 -15 Td
(   - Evaluacion psicologica si necesario) Tj
0 -15 Td
(   - Seguimiento con familias) Tj
0 -15 Td
(   - Informe completo en 24h) Tj
0 -15 Td
(   - Review de protocolos de seguridad) Tj
0 -30 Td
/F2 11 Tf
(Protocolo de aplicacion general) Tj
0 -15 Td
(Adaptable segun emergencia especifica) Tj
0 -25 Td
/F1 8 Tf
(Activacion: ${fechaActual} ${horaActual}) Tj
0 -12 Td
(ID: ${datos.legal_hash || 'N/A'}) Tj
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

7 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-BoldOblique
>>
endobj

xref
0 8
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000300 00000 n
0000001352 00000 n
0000001451 00000 n
trailer
<<
/Size 8
/Root 1 0 R
>>
startxref
1555
%%EOF`

    case 'informe-caso-urgente':
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
/Length 1300
>>
stream
BT
/F2 16 Tf
50 720 Td
(INFORME OFICIAL DE CASO URGENTE LOPIVI) Tj
0 -30 Td
/F1 12 Tf
(Documento oficial para autoridades competentes) Tj
0 -40 Td
(Caso ID: ${datos.casoId || 'N/A'}) Tj
0 -15 Td
(Fecha del informe: ${fechaActual}) Tj
0 -15 Td
(Hora del informe: ${horaActual}) Tj
0 -30 Td
/F2 14 Tf
(DATOS DE LA ENTIDAD) Tj
0 -20 Td
/F1 10 Tf
(Entidad: ${datos.entidad || 'N/A'}) Tj
0 -15 Td
(Delegado de Proteccion: ${datos.delegado || 'N/A'}) Tj
0 -15 Td
(Ubicacion del incidente: ${datos.ubicacion || 'N/A'}) Tj
0 -25 Td
/F2 14 Tf
(NATURALEZA DEL CASO) Tj
0 -20 Td
/F1 10 Tf
(Tipo de protocolo activado: ${datos.tipo_protocolo || 'N/A'}) Tj
0 -15 Td
(Prioridad asignada: ${datos.prioridad || 'N/A'}) Tj
0 -15 Td
(Fecha del incidente: ${datos.fecha_incidente || 'N/A'}) Tj
0 -25 Td
/F2 14 Tf
(DESCRIPCION DE LOS HECHOS) Tj
0 -20 Td
/F1 10 Tf
(${(datos.descripcion || 'Descripcion no disponible').substring(0, 200)}...) Tj
0 -25 Td
/F2 14 Tf
(MENORES AFECTADOS) Tj
0 -20 Td
/F1 10 Tf
(Iniciales: ${datos.menor_afectado?.nombre_iniciales || 'N/A'}) Tj
0 -15 Td
(Edad aproximada: ${datos.menor_afectado?.edad || 'N/A'} años) Tj
0 -25 Td
/F2 14 Tf
(ACCIONES TOMADAS) Tj
0 -20 Td
/F1 10 Tf
(${datos.acciones_inmediatas ? datos.acciones_inmediatas.join(', ') : 'No especificadas'}) Tj
0 -25 Td
/F2 14 Tf
(SERVICIOS CONTACTADOS) Tj
0 -20 Td
/F1 10 Tf
(${datos.servicios_contactados ? datos.servicios_contactados.join(', ') : 'Ninguno registrado'}) Tj
0 -25 Td
/F2 14 Tf
(ESTADO ACTUAL) Tj
0 -20 Td
/F1 10 Tf
(Familia contactada: ${datos.familia_contactada ? 'Si' : 'No'}) Tj
0 -15 Td
(Estado del caso: Activo - En investigacion) Tj
0 -15 Td
(Proxima revision: ${datos.proxima_revision || 'Por determinar'}) Tj
0 -30 Td
/F2 12 Tf
(OBSERVACIONES ADICIONALES) Tj
0 -20 Td
/F1 10 Tf
(${datos.observaciones || 'Sin observaciones adicionales registradas'}) Tj
0 -30 Td
/F1 8 Tf
(Este informe ha sido generado automaticamente) Tj
0 -12 Td
(segun los protocolos establecidos en la LOPIVI) Tj
0 -12 Td
(Hash de verificacion: ${datos.legal_hash || 'N/A'}) Tj
0 -12 Td
(Documento valido para tramites oficiales) Tj
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
0000001626 00000 n
0000001725 00000 n
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
1829
%%EOF`

    default:
      return generarProtocoloGenerico(tipoProtocolo, datos)
  }
}

function generarProtocoloGenerico(tipo: string, datos: any): string {
  const fechaActual = new Date().toLocaleDateString('es-ES')

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
(PROTOCOLO LOPIVI - ${tipo.toUpperCase()}) Tj
0 -30 Td
/F1 12 Tf
(Caso: ${datos.casoId || 'N/A'}) Tj
0 -20 Td
(Entidad: ${datos.entidad || 'N/A'}) Tj
0 -20 Td
(Delegado: ${datos.delegado || 'N/A'}) Tj
0 -20 Td
(Fecha: ${fechaActual}) Tj
0 -40 Td
(Este protocolo ha sido generado automaticamente) Tj
0 -15 Td
(segun los procedimientos establecidos en la LOPIVI) Tj
0 -15 Td
(para garantizar la proteccion integral de menores.) Tj
0 -30 Td
(Para informacion especifica del protocolo,) Tj
0 -15 Td
(consulte la documentacion completa en el) Tj
0 -15 Td
(dashboard de la entidad.) Tj
0 -30 Td
/F1 8 Tf
(Hash: ${datos.legal_hash || 'N/A'}) Tj
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

export async function POST(request: NextRequest) {
  try {
    const { tipo, datos } = await request.json()

    // Validar tipos de protocolo urgente
    const tiposValidos = [
      'protocolo-maltrato',
      'protocolo-abuso',
      'protocolo-abandono',
      'protocolo-emergencia',
      'informe-caso-urgente',
      'comunicacion-autoridades'
    ]

    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo de protocolo urgente no válido' },
        { status: 400 }
      )
    }

    // Generar PDF del protocolo
    const pdfContent = generarProtocoloUrgentePDF(tipo, datos)

    // Crear blob del PDF
    const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' })

    // Generar nombre de archivo único
    const timestamp = Date.now()
    const casoId = datos.casoId || 'UNKNOWN'
    const fileName = `${tipo}_${casoId}_${timestamp}.pdf`

    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })

  } catch (error) {
    console.error('❌ Error generando protocolo urgente PDF:', error)
    return NextResponse.json(
      { error: 'Error generando protocolo urgente' },
      { status: 500 }
    )
  }
}
