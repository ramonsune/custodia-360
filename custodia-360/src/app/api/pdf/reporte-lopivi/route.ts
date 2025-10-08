import { NextRequest, NextResponse } from 'next/server'

interface ReportePDF {
  metadatos: {
    id_reporte: string
    tipo_reporte: string
    fecha_generacion: string
    periodo: {
      fecha_inicio: string
      fecha_fin: string
      descripcion: string
    }
    hash_integridad: string
  }
  estadisticas: {
    total_casos: number
    casos_por_estado: any
    casos_por_prioridad: any
    casos_por_tipo: any
    cumplimiento_lopivi: {
      porcentaje_cumplimiento: number
      casos_conformes: number
      casos_requieren_revision: number
    }
  }
  resumen_ejecutivo: {
    periodo_analizado: string
    total_casos_analizados: number
    casos_requieren_atencion: number
    porcentaje_cumplimiento_lopivi: number
    observaciones: string[]
  }
  casos: any[]
}

function generarReporteLOPIVIPDF(reporte: ReportePDF): string {
  const fechaGeneracion = new Date(reporte.metadatos.fecha_generacion).toLocaleDateString('es-ES')
  const horaGeneracion = new Date(reporte.metadatos.fecha_generacion).toLocaleTimeString('es-ES')

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
/Length 2500
>>
stream
BT
/F3 20 Tf
50 740 Td
(REPORTE LOPIVI - CASOS ACTIVOS) Tj
0 -25 Td
/F2 14 Tf
(Ley Organica de Proteccion Integral a la Infancia y Adolescencia) Tj
0 -20 Td
(frente a la Violencia - Cumplimiento Normativo) Tj

0 -40 Td
/F2 12 Tf
(INFORMACION DEL REPORTE) Tj
0 -20 Td
/F1 10 Tf
(ID Reporte: ${reporte.metadatos.id_reporte}) Tj
0 -15 Td
(Tipo: ${reporte.metadatos.tipo_reporte.toUpperCase()}) Tj
0 -15 Td
(Fecha de generacion: ${fechaGeneracion} ${horaGeneracion}) Tj
0 -15 Td
(Periodo analizado: ${reporte.resumen_ejecutivo.periodo_analizado}) Tj
0 -15 Td
(Hash de integridad: ${reporte.metadatos.hash_integridad}) Tj

0 -30 Td
/F2 12 Tf
(RESUMEN EJECUTIVO) Tj
0 -20 Td
/F1 10 Tf
(Total de casos analizados: ${reporte.resumen_ejecutivo.total_casos_analizados}) Tj
0 -15 Td
(Casos que requieren atencion: ${reporte.resumen_ejecutivo.casos_requieren_atencion}) Tj
0 -15 Td
(Porcentaje cumplimiento LOPIVI: ${reporte.resumen_ejecutivo.porcentaje_cumplimiento_lopivi}%) Tj

0 -25 Td
/F2 12 Tf
(ESTADISTICAS DETALLADAS) Tj
0 -20 Td
/F1 10 Tf
(Casos por Estado:) Tj
0 -15 Td
(  - Activos: ${reporte.estadisticas.casos_por_estado.activo || 0}) Tj
0 -15 Td
(  - Pendientes: ${reporte.estadisticas.casos_por_estado.pendiente || 0}) Tj
0 -15 Td
(  - En revision: ${reporte.estadisticas.casos_por_estado.en_revision || 0}) Tj
0 -15 Td
(  - Resueltos: ${reporte.estadisticas.casos_por_estado.resuelto || 0}) Tj

0 -20 Td
(Casos por Prioridad:) Tj
0 -15 Td
(  - Alta: ${reporte.estadisticas.casos_por_prioridad.alta || 0}) Tj
0 -15 Td
(  - Media: ${reporte.estadisticas.casos_por_prioridad.media || 0}) Tj
0 -15 Td
(  - Baja: ${reporte.estadisticas.casos_por_prioridad.baja || 0}) Tj

0 -20 Td
(Casos por Tipo:) Tj
0 -15 Td
(  - Seguimiento: ${reporte.estadisticas.casos_por_tipo.seguimiento || 0}) Tj
0 -15 Td
(  - Incidencia: ${reporte.estadisticas.casos_por_tipo.incidencia || 0}) Tj
0 -15 Td
(  - Protocolo: ${reporte.estadisticas.casos_por_tipo.protocolo || 0}) Tj
0 -15 Td
(  - Revision: ${reporte.estadisticas.casos_por_tipo.revision || 0}) Tj

0 -25 Td
/F2 12 Tf
(CUMPLIMIENTO LOPIVI) Tj
0 -20 Td
/F1 10 Tf
(Casos conformes: ${reporte.estadisticas.cumplimiento_lopivi.casos_conformes}) Tj
0 -15 Td
(Casos requieren revision: ${reporte.estadisticas.cumplimiento_lopivi.casos_requieren_revision}) Tj
0 -15 Td
(Porcentaje cumplimiento: ${reporte.estadisticas.cumplimiento_lopivi.porcentaje_cumplimiento}%) Tj

0 -25 Td
/F2 12 Tf
(OBSERVACIONES) Tj
0 -20 Td
/F1 10 Tf
${reporte.resumen_ejecutivo.observaciones.map((obs, index) =>
  `(${index + 1}. ${obs.substring(0, 80)}) Tj\n0 -15 Td`
).join('\n')}

0 -30 Td
/F2 12 Tf
(CASOS INCLUIDOS EN EL REPORTE) Tj
0 -20 Td
/F1 9 Tf
${reporte.casos.slice(0, 10).map((caso, index) =>
  `(${index + 1}. ${caso.caso_id} - ${caso.titulo.substring(0, 40)}) Tj\n0 -12 Td`
).join('\n')}

${reporte.casos.length > 10 ? `0 -12 Td\n(... y ${reporte.casos.length - 10} casos mas) Tj` : ''}

0 -30 Td
/F1 8 Tf
(VALIDACION LEGAL) Tj
0 -12 Td
(Este reporte ha sido generado automaticamente por) Tj
0 -12 Td
(el sistema Custodia360 conforme a la LOPIVI.) Tj
0 -12 Td
(Hash de integridad: ${reporte.metadatos.hash_integridad}) Tj
0 -12 Td
(Documento valido para auditorias oficiales.) Tj

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
0000002852 00000 n
0000002951 00000 n
trailer
<<
/Size 8
/Root 1 0 R
>>
startxref
3055
%%EOF`
}

export async function POST(request: NextRequest) {
  try {
    const { reporte } = await request.json()

    if (!reporte) {
      return NextResponse.json(
        { error: 'Datos del reporte requeridos' },
        { status: 400 }
      )
    }

    // Generar PDF del reporte
    const pdfContent = generarReporteLOPIVIPDF(reporte)

    // Crear blob del PDF
    const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' })

    // Generar nombre de archivo
    const timestamp = Date.now()
    const tipoReporte = reporte.metadatos.tipo_reporte || 'general'
    const fileName = `reporte-lopivi-${tipoReporte}-${timestamp}.pdf`

    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })

  } catch (error) {
    console.error('❌ Error generando PDF de reporte LOPIVI:', error)
    return NextResponse.json(
      { error: 'Error generando PDF del reporte' },
      { status: 500 }
    )
  }
}
