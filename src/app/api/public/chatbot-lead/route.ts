import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_message, language, nombre, email, telefono, nombre_entidad } = body

    // Validación básica
    if (!user_message || !nombre || !email) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: user_message, nombre, email' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    // Guardar lead en Supabase
    const { data: lead, error: dbError } = await supabase
      .from('chatbot_leads')
      .insert({
        user_message,
        language: language || 'es',
        nombre,
        email,
        telefono: telefono || null,
        nombre_entidad: nombre_entidad || null,
        status: 'pending',
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error guardando lead:', dbError)
      return NextResponse.json(
        { error: 'Error al guardar el lead' },
        { status: 500 }
      )
    }

    // Enviar email de notificación al equipo
    try {
      const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
      🤖 Nueva Consulta desde el Chatbot
    </h2>

    <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1e40af;">Pregunta del usuario:</h3>
      <p style="background: white; padding: 10px; border-left: 4px solid #1e40af; margin: 10px 0;">
        "${user_message}"
      </p>
    </div>

    <div style="margin: 20px 0;">
      <h3 style="color: #1e40af;">Datos de contacto:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Nombre:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${nombre}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
            <a href="mailto:${email}" style="color: #1e40af;">${email}</a>
          </td>
        </tr>
        ${telefono ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Teléfono:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${telefono}</td>
        </tr>
        ` : ''}
        ${nombre_entidad ? `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Entidad:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${nombre_entidad}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Idioma:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${language || 'es'}</td>
        </tr>
      </table>
    </div>

    <div style="background: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b; margin: 20px 0;">
      <p style="margin: 0;">
        <strong>⚡ Acción requerida:</strong> Contactar con el usuario lo antes posible para responder su consulta.
      </p>
    </div>

    <div style="margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 5px;">
      <p style="margin: 0; font-size: 12px; color: #6b7280;">
        Lead ID: ${lead.id}<br>
        Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}<br>
        Ver en dashboard: <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard-custodia360" style="color: #1e40af;">Dashboard Admin</a>
      </p>
    </div>
  </div>
</body>
</html>
      `

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@custodia360.es',
        to: 'info@custodia360.es',
        subject: `🤖 Nueva consulta chatbot: ${nombre}`,
        html: emailBody,
      })
    } catch (emailError) {
      console.error('Error enviando email de notificación:', emailError)
      // No falla la request si el email falla
    }

    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      message: 'Gracias por tu consulta. Te contactaremos pronto.',
      lead_id: lead.id
    })

  } catch (error) {
    console.error('Error en chatbot-lead API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
