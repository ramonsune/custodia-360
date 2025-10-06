import { NextResponse } from 'next/server'
import { resend, FROM_EMAIL } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, testType = 'basic' } = body

    // Validar email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email válido es requerido' },
        { status: 400 }
      )
    }

    // Verificar configuración de Resend
    const resendApiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL

    console.log('🔍 Verificando configuración Resend...')
    console.log('API Key present:', !!resendApiKey)
    console.log('API Key starts with re_:', resendApiKey?.startsWith('re_'))
    console.log('From Email:', fromEmail)

    if (!resendApiKey || !resendApiKey.startsWith('re_')) {
      return NextResponse.json({
        success: false,
        error: 'Clave de API de Resend no configurada o inválida',
        details: 'La clave debe empezar con "re_" y ser una clave real de Resend',
        instructions: [
          '1. Ve a https://resend.com y crea una cuenta',
          '2. Crea una nueva API Key',
          '3. Actualiza RESEND_API_KEY en .env.local',
          '4. Verifica el dominio en Resend o usa el dominio sandbox'
        ]
      }, { status: 400 })
    }

    // Preparar email de prueba
    const testEmails = {
      basic: {
        subject: '✅ Prueba de Email Custodia360',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ea580c;">🎉 ¡Email funcionando correctamente!</h2>
            <p>Si recibes este email, significa que Resend está configurado correctamente para Custodia360.</p>

            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>✅ Configuración verificada:</h3>
              <ul>
                <li>API Key de Resend: Válida</li>
                <li>Dominio: ${fromEmail}</li>
                <li>Envío: Exitoso</li>
                <li>Fecha: ${new Date().toLocaleString('es-ES')}</li>
              </ul>
            </div>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Próximos pasos:</strong></p>
              <ol>
                <li>Los emails de contacto ahora funcionarán correctamente</li>
                <li>Los emails de contratación se enviarán automáticamente</li>
                <li>Las notificaciones del sistema están operativas</li>
              </ol>
            </div>

            <p>Un saludo,<br>
            <strong>Sistema Custodia360</strong></p>
          </div>
        `
      },
      contact: {
        subject: '📧 Prueba de formulario de contacto',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ea580c;">Prueba de contacto Custodia360</h2>
            <p>Este es un email de prueba del formulario de contacto.</p>
            <p>Si lo recibes, el sistema de emails está funcionando perfectamente.</p>
          </div>
        `
      }
    }

    const emailConfig = testEmails[testType as keyof typeof testEmails] || testEmails.basic

    console.log('📧 Enviando email de prueba...')
    console.log('From:', FROM_EMAIL)
    console.log('To:', email)
    console.log('Subject:', emailConfig.subject)

    // Enviar email de prueba
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: emailConfig.subject,
      html: emailConfig.html
    })

    console.log('✅ Email enviado exitosamente:', result)

    return NextResponse.json({
      success: true,
      message: 'Email de prueba enviado exitosamente',
      emailId: result.data?.id,
      sentTo: email,
      sentFrom: FROM_EMAIL,
      timestamp: new Date().toISOString(),
      resendResult: result
    })

  } catch (error) {
    console.error('❌ Error enviando email de prueba:', error)

    // Analizar el tipo de error
    let errorMessage = 'Error desconocido'
    let suggestions = []

    if (error instanceof Error) {
      errorMessage = error.message

      if (error.message.includes('API key')) {
        suggestions = [
          'Verifica que la API key de Resend sea correcta',
          'Asegúrate de que empiece con "re_"',
          'Crea una nueva API key en https://resend.com'
        ]
      } else if (error.message.includes('domain')) {
        suggestions = [
          'Verifica el dominio en tu cuenta de Resend',
          'Usa el dominio sandbox de Resend para pruebas',
          'Configura RESEND_FROM_EMAIL correctamente'
        ]
      } else if (error.message.includes('unauthorized')) {
        suggestions = [
          'Tu API key puede estar incorrecta o expirada',
          'Verifica los permisos de la API key en Resend'
        ]
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      suggestions,
      timestamp: new Date().toISOString(),
      config: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        apiKeyFormat: process.env.RESEND_API_KEY?.substring(0, 8) + '...',
        fromEmail: FROM_EMAIL
      }
    }, { status: 500 })
  }
}

export async function GET() {
  // Endpoint para verificar configuración sin enviar email
  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL

  return NextResponse.json({
    configured: !!resendApiKey && resendApiKey.startsWith('re_'),
    apiKeyPresent: !!resendApiKey,
    apiKeyValid: resendApiKey?.startsWith('re_') || false,
    fromEmail: fromEmail || 'No configurado',
    status: resendApiKey?.startsWith('re_') ? 'ready' : 'needs_configuration'
  })
}
