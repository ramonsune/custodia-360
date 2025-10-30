import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { dias, destinatario, destinatarios, asunto, cuerpo, datosUsuario } = await request.json()

    // Simular envío de email
    console.log('Enviando aviso de certificado:', {
      dias,
      destinatario: destinatario || destinatarios,
      asunto,
      timestamp: new Date().toISOString()
    })

    // Aquí iría la integración real con servicio de email (SendGrid, Resend, etc.)
    /*
    if (dias === 15) {
      // Envío solo al delegado
      await enviarEmail({
        to: destinatario,
        subject: asunto,
        html: formatearEmailHTML(cuerpo, datosUsuario)
      })
    } else if (dias === 30) {
      // Envío al delegado y al contratante
      await enviarEmail({
        to: destinatarios,
        subject: asunto,
        html: formatearEmailHTML(cuerpo, datosUsuario),
        cc: ['contratante@entidad.com'] // Email del contratante obtenido de BD
      })
    }
    */

    return NextResponse.json({
      success: true,
      message: `Aviso de ${dias} días enviado exitosamente`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error enviando aviso de certificado:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function formatearEmailHTML(texto: string, datosUsuario: any) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #2563EB; color: white; padding: 20px; text-align: center;">
            <h1>Custodia360 - LOPIVI</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${texto}</pre>
          </div>
          <div style="padding: 20px; text-align: center; background: #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>Este es un mensaje automatizado del sistema Custodia360</p>
            <p>Para más información: <a href="https://custodia360.com">custodia360.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `
}
