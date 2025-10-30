import { Resend } from 'resend'

// Configuración de Resend
const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

if (!resendApiKey) {
  console.warn('⚠️ RESEND_API_KEY no configurada. Los emails no funcionarán.')
}

if (!resendApiKey?.startsWith('re_')) {
  console.warn('⚠️ RESEND_API_KEY parece inválida. Debe empezar con "re_".')
}

// Instancia de Resend
export const resend = new Resend(resendApiKey)
export const FROM_EMAIL = fromEmail

// Función helper para verificar configuración
export const isResendConfigured = (): boolean => {
  return !!(resendApiKey && resendApiKey.startsWith('re_') && fromEmail)
}

// Función helper para envío seguro de emails
export const sendEmailSafely = async (emailData: {
  to: string | string[]
  subject: string
  html: string
  from?: string
}) => {
  try {
    if (!isResendConfigured()) {
      console.error('❌ Resend no está configurado correctamente')
      return {
        success: false,
        error: 'Resend no configurado'
      }
    }

    const result = await resend.emails.send({
      from: emailData.from || FROM_EMAIL,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html
    })

    if (result.error) {
      console.error('❌ Error de Resend:', result.error)
      return {
        success: false,
        error: result.error.message
      }
    }

    console.log('✅ Email enviado exitosamente:', result.data?.id)
    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error('❌ Error enviando email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

// Configuración de desarrollo/testing
export const getEmailConfig = () => {
  return {
    configured: isResendConfigured(),
    apiKeyPresent: !!resendApiKey,
    apiKeyValid: resendApiKey?.startsWith('re_') || false,
    fromEmail: fromEmail,
    status: isResendConfigured() ? 'ready' : 'needs_configuration'
  }
}
