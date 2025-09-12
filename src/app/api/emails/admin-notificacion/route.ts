import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const ADMIN_EMAIL = 'rsune@teamsml.com' // Email del admin de Custodia360

export async function POST(request: Request) {
  try {
    const {
      nombreEntidad,
      nombreContratante,
      plan,
      importeTotal,
      emailContratante,
      emailAdministrativo
    } = await request.json()

    const fechaContratacion = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const html = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background-color: #ea580c; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Nueva Contratación LOPIVI</h1>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <div style="background-color: #10b981; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 18px;">¡Nueva Entidad Contratada!</h2>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Sistema automático funcionando correctamente</p>
            </div>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Datos de la Contratación</h3>
              <div style="display: grid; gap: 10px;">
                <div><strong>Entidad:</strong> ${nombreEntidad}</div>
                <div><strong>Plan contratado:</strong> ${plan}</div>
                <div><strong>Importe total:</strong> <span style="color: #ea580c; font-weight: bold;">${importeTotal}€</span></div>
                <div><strong>Fecha y hora:</strong> ${fechaContratacion}</div>
              </div>
            </div>

            <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1e40af;">Datos del Contratante</h3>
              <div style="display: grid; gap: 10px;">
                <div><strong>Responsable:</strong> ${nombreContratante}</div>
                <div><strong>Email acceso:</strong> ${emailContratante}</div>
                <div><strong>Email administrativo:</strong> ${emailAdministrativo}</div>
              </div>
            </div>

            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #166534;">Próximas Acciones Automáticas</h3>
              <ul style="color: #166534; margin: 5px 0; padding-left: 20px;">
                <li>Secuencia de emails iniciada automáticamente</li>
                <li>Credenciales enviadas a delegados (+1h)</li>
                <li>Formación LOPIVI programada</li>
                <li>Certificación automática (+48h)</li>
                <li>Facturación procesada correctamente</li>
              </ul>
            </div>

            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <div style="display: flex; align-items: center;">
                <span style="color: #f59e0b; font-size: 20px; margin-right: 10px;">💼</span>
                <div>
                  <p style="margin: 0; font-weight: 600; color: #92400e;">Dashboard Interno Actualizado</p>
                  <p style="margin: 5px 0 0 0; color: #92400e; font-size: 14px;">
                    Nueva entidad añadida al dashboard de control con métricas actualizadas
                  </p>
                </div>
              </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://custodia360.es/dashboard-custodia"
                 style="display: inline-block; background-color: #ea580c; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Ver Dashboard Interno
              </a>
            </div>

            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #374151; font-size: 14px;">Resumen Financiero</h4>
              <div style="font-size: 12px; color: #6b7280;">
                <div>• Primer pago (50%): ${importeTotal / 2}€ + IVA</div>
                <div>• Segundo pago (6 meses): ${importeTotal / 2}€ + IVA</div>
                <div>• Factura enviada automáticamente al administrativo</div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 12px;">
              <p style="margin: 0;"><strong>Sistema Automatizado Custodia360</strong></p>
              <p style="margin: 5px 0 0 0;">
                Notificación automática generada el ${fechaContratacion}
              </p>
            </div>
          </div>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🎉 Nueva Contratación: ${nombreEntidad} - ${plan}`,
      html
    })

    console.log('✅ Email de notificación admin enviado:', result.data?.id)

    return NextResponse.json({
      success: true,
      emailId: result.data?.id,
      message: 'Notificación admin enviada correctamente'
    })

  } catch (error) {
    console.error('❌ Error enviando notificación admin:', error)
    return NextResponse.json({
      success: false,
      error: 'Error enviando notificación admin',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
