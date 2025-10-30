import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * POST /api/guide/support
 * Sends support email from guide sidebar to soporte@custodia360.es
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userEmail,
      userName,
      userRole,
      entidad,
      userId,
      uiContext,
      consultType,
      subject,
      message
    } = body

    // Validate required fields
    if (!userEmail || !userName || !userRole || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Build email content
    const emailSubject = `[Guía C360] ${userRole} — ${entidad || 'Sin entidad'} — ${consultType || subject || 'Consulta'}`

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e40af; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Consulta desde Guía C360</h1>
        </div>

        <div style="padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <h2 style="color: #1e40af; margin-top: 0;">Información del Usuario</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 150px;">Nombre:</td>
              <td style="padding: 8px;">${userName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Email:</td>
              <td style="padding: 8px;">${userEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Rol:</td>
              <td style="padding: 8px;">${userRole}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Entidad:</td>
              <td style="padding: 8px;">${entidad || 'No especificada'}</td>
            </tr>
            ${userId ? `
            <tr>
              <td style="padding: 8px; font-weight: bold;">User ID:</td>
              <td style="padding: 8px;">${userId}</td>
            </tr>
            ` : ''}
            ${uiContext ? `
            <tr>
              <td style="padding: 8px; font-weight: bold;">Contexto UI:</td>
              <td style="padding: 8px;"><code style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px;">${uiContext}</code></td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #1e40af; margin-top: 0;">Tipo de Consulta</h2>
          <p style="background: #dbeafe; padding: 10px; border-radius: 5px; margin: 0;">
            <strong>${consultType || 'General'}</strong>
          </p>
        </div>

        ${subject && subject !== consultType ? `
        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #1e40af; margin-top: 0;">Asunto</h2>
          <p style="margin: 0;">${subject}</p>
        </div>
        ` : ''}

        <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #1e40af; margin-top: 0;">Mensaje</h2>
          <div style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 5px; border-left: 4px solid #1e40af;">
            ${message}
          </div>
        </div>

        <div style="padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">Este mensaje fue enviado desde la Guía de uso C360</p>
          <p style="margin: 5px 0 0 0;">Fecha: ${new Date().toLocaleString('es-ES')}</p>
        </div>
      </div>
    `

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Custodia360 <noreply@custodia360.es>',
      to: ['soporte@custodia360.es'],
      replyTo: userEmail,
      subject: emailSubject,
      html: emailHtml
    })

    if (error) {
      console.error('Error sending support email:', error)
      return NextResponse.json(
        { success: false, error: 'Error al enviar el mensaje. Por favor, intenta de nuevo.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente. Nuestro equipo te responderá pronto.',
      emailId: data?.id
    })

  } catch (error) {
    console.error('Error in /api/guide/support:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
