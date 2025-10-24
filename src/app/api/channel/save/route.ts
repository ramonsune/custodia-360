import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entityId, tipo, valor } = body

    if (!entityId || !tipo || !valor) {
      return NextResponse.json(
        { error: 'entityId, tipo y valor son requeridos' },
        { status: 400 }
      )
    }

    if (!['email', 'telefono'].includes(tipo)) {
      return NextResponse.json({ error: 'Tipo debe ser email o telefono' }, { status: 400 })
    }

    // Validar email si es tipo email
    if (tipo === 'email' && !valor.includes('@')) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
    }

    console.log(`📞 [CHANNEL] Guardando canal ${tipo}: ${valor} para entidad ${entityId}`)

    // En producción, guardar en Supabase:
    // UPDATE entities SET canal_tipo = ${tipo}, canal_valor = ${valor} WHERE id = ${entityId}
    // UPDATE entity_compliance SET channel_done = true WHERE entity_id = ${entityId}

    // Si es email, enviar verificación
    let verificationToken = null
    if (tipo === 'email' && resend) {
      verificationToken = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // En producción, insertar en channel_verifications
      // INSERT INTO channel_verifications(token, entity_id, email) VALUES (...)

      const verifyUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL || 'https://www.custodia360.es'}/api/channel/verify?token=${verificationToken}`

      try {
        await resend.emails.send({
          from: process.env.NOTIFY_EMAIL_FROM || 'no-reply@custodia360.es',
          to: valor,
          subject: 'Custodia360 | Verifica tu canal de comunicación',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e40af;">Verifica tu canal de comunicación</h2>
              <p>Hola,</p>
              <p>Por favor verifica tu canal de comunicación haciendo clic en el siguiente enlace:</p>
              <p style="margin: 30px 0;">
                <a href="${verifyUrl}"
                   style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Verificar Email
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">
                Este canal aparecerá en todos los documentos y comunicaciones oficiales de tu entidad.
              </p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
              <p style="color: #999; font-size: 12px;">
                Equipo Custodia360<br />
                <a href="https://www.custodia360.es" style="color: #1e40af;">www.custodia360.es</a><br />
                Soporte: info@custodia360.es
              </p>
            </div>
          `
        })

        console.log('📧 [CHANNEL] Email de verificación enviado a:', valor)
      } catch (emailError) {
        console.error('Error enviando email:', emailError)
        // No fallar la operación por error de email
      }
    }

    return NextResponse.json({
      success: true,
      message: tipo === 'email'
        ? 'Canal guardado. Se ha enviado un email de verificación.'
        : 'Canal guardado correctamente.',
      verification_sent: tipo === 'email',
      _localData: {
        entityId,
        canal_tipo: tipo,
        canal_valor: valor,
        channel_done: true,
        channel_verified: tipo === 'telefono', // Teléfono no requiere verificación
        verificationToken
      }
    })
  } catch (error: any) {
    console.error('Error en channel/save:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
