import { NextRequest, NextResponse } from 'next/server'
import { buildOnboardingReportData, renderOnboardingReportPDF } from '@/lib/reports/onboarding'

/**
 * GET /api/delegado/onboarding/report
 * Descarga directa del informe de onboarding (sin guardar en Storage)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const entityId = searchParams.get('entityId')

    if (!entityId) {
      return NextResponse.json({
        error: 'entityId requerido'
      }, { status: 400 })
    }

    // Obtener datos del informe
    const data = await buildOnboardingReportData(entityId)

    // Generar PDF
    const pdfBuffer = await renderOnboardingReportPDF(data)

    // Devolver PDF para descarga directa
    const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const filename = `onboarding-${entityId}-${fecha}.pdf`

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.byteLength.toString()
      }
    })

  } catch (error: any) {
    console.error('Error generando informe:', error)
    return NextResponse.json({
      error: 'Error generando informe PDF',
      details: error.message
    }, { status: 500 })
  }
}
