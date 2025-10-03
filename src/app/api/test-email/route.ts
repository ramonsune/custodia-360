import { NextResponse } from 'next/server'
import emailTemplates from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const { tipo, email, nombre, entidad } = await request.json()

    console.log(`🧪 Testeando email tipo: ${tipo} para: ${email}`)

    let resultado

    switch (tipo) {
      case 'confirmacion_contratacion':
        resultado = await emailTemplates.enviarConfirmacionContratacion(
          email,
          nombre,
          entidad,
          'Plan 200',
          { email: 'delegado@test.com', password: 'test123' }
        )
        break

      case 'credenciales_delegado':
        resultado = await emailTemplates.enviarCredencialesDelegado(
          email,
          nombre,
          'Principal',
          entidad,
          { email: 'delegado@test.com', password: 'test123' }
        )
        break

      case 'certificacion_completada':
        resultado = await emailTemplates.enviarCertificadoCompletado(
          email,
          nombre,
          entidad,
          'CERT-TEST-001',
          new Date().toLocaleDateString('es-ES')
        )
        break

      case 'sistema_operativo':
        resultado = await emailTemplates.enviarSistemaOperativo(
          email,
          nombre,
          entidad,
          'Delegado Test',
          new Date().toLocaleDateString('es-ES')
        )
        break

      case 'recordatorio_formacion':
        resultado = await emailTemplates.enviarRecordatorioFormacion(
          email,
          nombre,
          entidad,
          60
        )
        break

      case 'canal_lopivi':
        // Usar el template del canal LOPIVI
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        const datosCanal = {
          entidad: entidad,
          delegado: nombre,
          canal: {
            tipo: 'telefono',
            contacto: '666 123 456',
            horario: 'L-V 9:00-18:00',
            instrucciones: 'Solo para temas LOPIVI urgentes'
          }
        }

        resultado = await resend.emails.send({
          from: 'info@custodia360.es',
          to: email,
          subject: emailTemplates.canalLopiviOrganizacion.subject(datosCanal),
          html: emailTemplates.canalLopiviOrganizacion.html(datosCanal)
        })
        break

      default:
        throw new Error(`Tipo de email no reconocido: ${tipo}`)
    }

    console.log(`✅ Email ${tipo} enviado correctamente`, resultado)

    return NextResponse.json({
      success: true,
      tipo,
      emailId: resultado?.data?.id || 'test-id',
      message: `Email ${tipo} enviado correctamente a ${email}`
    })

  } catch (error) {
    console.error('❌ Error enviando email de prueba:', error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      details: error
    }, { status: 500 })
  }
}
