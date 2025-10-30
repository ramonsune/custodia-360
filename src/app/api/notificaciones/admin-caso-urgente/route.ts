import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const ADMIN_EMAIL = 'rsune@teamsml.com' // Email del admin de Custodia360

export async function POST(request: Request) {
  try {
    const {
      casoId,
      tipoCaso,
      entidad,
      fechaHora,
      delegado,
      descripcion,
      prioridad,
      ubicacion,
      menorAfectado,
      serviciosContactados
    } = await request.json()

    // Mapear tipos de caso a español
    const tiposCaso = {
      'maltrato': 'Sospecha de Maltrato',
      'abandono': 'Abandono/Negligencia',
      'abuso': 'Abuso Sexual',
      'emergencia': 'Emergencia General'
    }

    const tipoTexto = tiposCaso[tipoCaso] || tipoCaso

    // Determinar color según prioridad
    const colorPrioridad = prioridad === 'critica' ? '#dc2626' : '#ea580c'
    const textoPrioridad = prioridad === 'critica' ? 'CRÍTICA' : 'ALTA'

    const html = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header Urgente -->
          <div style="background-color: ${colorPrioridad}; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🚨 CASO URGENTE LOPIVI</h1>
            <p style="color: white; margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">
              Protocolo de emergencia activado
            </p>
          </div>

          <!-- Alerta de Prioridad -->
          <div style="background-color: #fef2f2; border-left: 4px solid ${colorPrioridad}; padding: 15px; margin: 0;">
            <div style="display: flex; align-items: center;">
              <span style="color: ${colorPrioridad}; font-size: 20px; margin-right: 10px;">⚠️</span>
              <div>
                <p style="margin: 0; font-weight: 600; color: ${colorPrioridad};">PRIORIDAD: ${textoPrioridad}</p>
                <p style="margin: 5px 0 0 0; color: #7f1d1d; font-size: 14px;">
                  Requiere atención inmediata según protocolo LOPIVI
                </p>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Información del Caso</h3>
              <div style="display: grid; gap: 12px;">
                <div><strong>ID Caso:</strong> <span style="color: ${colorPrioridad}; font-weight: bold;">${casoId}</span></div>
                <div><strong>Tipo de Protocolo:</strong> ${tipoTexto}</div>
                <div><strong>Entidad:</strong> ${entidad}</div>
                <div><strong>Delegado Responsable:</strong> ${delegado}</div>
                <div><strong>Fecha y Hora:</strong> ${fechaHora}</div>
                ${ubicacion ? `<div><strong>Ubicación:</strong> ${ubicacion}</div>` : ''}
              </div>
            </div>

            ${descripcion ? `
            <div style="background-color: #fffbeb; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #92400e;">Descripción del Caso</h3>
              <p style="margin: 0; color: #92400e; white-space: pre-wrap;">${descripcion}</p>
            </div>
            ` : ''}

            ${menorAfectado ? `
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #92400e;">Menor Afectado</h4>
              <div style="color: #92400e; font-size: 14px;">
                <div><strong>Iniciales:</strong> ${menorAfectado.nombre_iniciales || 'N/A'}</div>
                <div><strong>Edad:</strong> ${menorAfectado.edad || 'N/A'} años</div>
                <div><strong>Género:</strong> ${menorAfectado.genero || 'N/A'}</div>
              </div>
            </div>
            ` : ''}

            ${serviciosContactados && serviciosContactados.length > 0 ? `
            <div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #065f46;">Servicios Contactados</h4>
              <ul style="color: #065f46; margin: 5px 0; padding-left: 20px;">
                ${serviciosContactados.map(servicio => `<li>${servicio}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0c4a6e;">Acciones Automáticas Ejecutadas</h3>
              <ul style="color: #0c4a6e; margin: 5px 0; padding-left: 20px;">
                <li>Caso registrado en sistema con ID único</li>
                <li>Protocolo específico generado automáticamente</li>
                <li>Documentación PDF creada para autoridades</li>
                <li>Auditoría LOPIVI registrada con hash legal</li>
                <li>Notificaciones programadas según tipo de caso</li>
                <li>Timer de seguimiento activado (24h)</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://custodia360.es/dashboard-custodia360"
                 style="display: inline-block; background-color: ${colorPrioridad}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 10px;">
                Ver Dashboard
              </a>
              <a href="https://custodia360.es/dashboard-custodia360/casos-urgentes"
                 style="display: inline-block; background-color: #374151; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Gestionar Caso
              </a>
            </div>

            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #374151; font-size: 14px;">Próximas Acciones Requeridas</h4>
              <div style="font-size: 12px; color: #6b7280;">
                <div>• Verificar recepción de notificaciones por autoridades</div>
                <div>• Confirmar generación correcta de documentación</div>
                <div>• Hacer seguimiento del caso en 24 horas</div>
                <div>• Verificar cumplimiento de protocolos LOPIVI</div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 12px;">
              <p style="margin: 0;"><strong>Sistema Automatizado Custodia360</strong></p>
              <p style="margin: 5px 0 0 0;">
                Notificación de caso urgente generada el ${fechaHora}
              </p>
              <p style="margin: 5px 0 0 0; color: #ef4444; font-weight: 600;">
                ⚖️ Este caso está sujeto a auditoría legal LOPIVI
              </p>
            </div>
          </div>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🚨 CASO URGENTE ${casoId}: ${tipoTexto} - ${entidad}`,
      html
    })

    console.log('✅ Notificación admin caso urgente enviada:', result.data?.id)

    return NextResponse.json({
      success: true,
      emailId: result.data?.id,
      message: 'Notificación admin caso urgente enviada correctamente'
    })

  } catch (error) {
    console.error('❌ Error enviando notificación admin caso urgente:', error)
    return NextResponse.json({
      success: false,
      error: 'Error enviando notificación admin caso urgente',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
