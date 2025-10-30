import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { html, options } = await request.json()

    // Verificar que tenemos la API key de PDFShift
    if (!process.env.PDFSHIFT_API_KEY) {
      return NextResponse.json({
        error: 'PDFShift API key not configured',
        suggestion: 'Please set PDFSHIFT_API_KEY environment variable'
      }, { status: 501 })
    }

    console.log('Generating PDF with PDFShift...')

    // Usar PDFShift para generar el PDF
    const pdfShiftOptions = {
      source: html,
      format: options.format || 'A4',
      landscape: options.landscape || false,
      margin: options.margin || '20mm',
      printBackground: options.printBackground !== false,
      // Opciones adicionales para mejorar la calidad
      scale: 1,
      displayHeaderFooter: false,
      preferCSSPageSize: true
    }

    const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('api:' + process.env.PDFSHIFT_API_KEY).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pdfShiftOptions)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('PDFShift error:', response.status, errorText)
      throw new Error(`PDFShift error: ${response.status} - ${errorText}`)
    }

    const pdfBuffer = await response.arrayBuffer()

    console.log('PDF generated successfully, size:', pdfBuffer.byteLength, 'bytes')

    // Determinar el nombre del archivo
    const filename = options.filename || 'document.pdf'

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.byteLength.toString()
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({
      error: 'Failed to generate PDF',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
