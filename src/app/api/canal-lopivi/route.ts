import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'info@custodia360.es'

interface CanalConfig {
  tipo: string
  contacto: string
  horario: string
  instrucciones: string
  delegado: string
  entidad: string
}

interface MiembroRegistrado {
  email: string
  nombre: string
  rol?: string
}

export async function POST(request: Request) {
  try {
    const { canal, miembros }: { canal: CanalConfig, miembros: MiembroRegistrado[] } = await request.json()

    // Validar datos obligatorios
    if (!canal.tipo || !canal.contacto || !canal.delegado || !canal.entidad) {
      return NextResponse.json(
        { success: false, error: 'Datos del canal incompletos' },
        { status: 400 }
      )
    }

    // Template del email para miembros
    const generateEmailHTML = (miembro: MiembroRegistrado) => `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px 20px; text-align: center;">
          <div style="width: 60px; height: 60px; background: white; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: #1e40af; font-size: 24px; font-weight: bold;">📞</span>
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Canal Directo LOPIVI</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Comunicación obligatoria por ley</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px; background: white;">
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Estimado/a <strong>${miembro.nombre}</strong>,
          </p>

          <p style="color: #374151; line-height: 1.6; margin-bottom: 25px;">
            En cumplimiento del <strong>artículo 49.2 de la Ley LOPIVI</strong>, le informamos
            del canal directo de comunicación con nuestro Delegado de Protección en <strong>${canal.entidad}</strong>:
          </p>

          <!-- Canal Info Box -->
          <div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 25px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
              📞 CANAL DIRECTO LOPIVI
            </h2>
            <div style="color: #1f2937; line-height: 1.8;">
              <p style="margin: 5px 0;"><strong>Delegado:</strong> ${canal.delegado}</p>
              <p style="margin: 5px 0;"><strong>Tipo:</strong> ${canal.tipo.charAt(0).toUpperCase() + canal.tipo.slice(1)}</p>
              <p style="margin: 5px 0;"><strong>Contacto:</strong> ${canal.contacto}</p>
              ${canal.horario ? `<p style="margin: 5px 0;"><strong>Horario:</strong> ${canal.horario}</p>` : ''}
              ${canal.instrucciones ? `<p style="margin: 5px 0;"><strong>Instrucciones:</strong> ${canal.instrucciones}</p>` : ''}
            </div>
          </div>

          <!-- Important Notice -->
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">
              ⚠️ IMPORTANTE: Este canal es específico para
            </h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Comunicar situaciones de riesgo para menores</li>
              <li>Dudas sobre protocolos LOPIVI</li>
              <li>Reportar incidencias relacionadas con menores</li>
              <li>Consultas urgentes de protección infantil</li>
            </ul>
          </div>

          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
            <strong>Nota:</strong> Para otros temas administrativos o generales de la entidad,
            utilice los canales habituales de comunicación.
          </p>

          <!-- Legal Footer -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0;">
              Este canal ha sido establecido en cumplimiento de la Ley Orgánica 8/2021
              de Protección Integral a la Infancia y la Adolescencia (LOPIVI).
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f3f4f6; padding: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            ${canal.entidad} - Sistema de Protección LOPIVI<br>
            Delegado de Protección: ${canal.delegado}
          </p>
          <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">
            Custodia360 - Sistema de Gestión LOPIVI
          </p>
        </div>
      </div>
    `

    // Enviar emails a todos los miembros
    const emailsEnviados = []
    const emailsFallidos = []

    for (const miembro of miembros) {
      try {
        const resultado = await resend.emails.send({
          from: FROM_EMAIL,
          to: miembro.email,
          subject: `IMPORTANTE: Canal directo delegado LOPIVI - ${canal.entidad}`,
          html: generateEmailHTML(miembro)
        })

        emailsEnviados.push({
          email: miembro.email,
          nombre: miembro.nombre,
          id: resultado.data?.id,
          enviado: true
        })

        console.log(`✅ Canal LOPIVI enviado a: ${miembro.email}`)

      } catch (error) {
        console.error(`❌ Error enviando a ${miembro.email}:`, error)
        emailsFallidos.push({
          email: miembro.email,
          nombre: miembro.nombre,
          error: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }

    // Enviar confirmación al delegado
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: 'rsuneo1971@gmail.com', // En producción sería el email del delegado
        subject: `Canal LOPIVI comunicado a toda la organización - ${canal.entidad}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 20px; text-align: center;">
              <h2>✅ Canal LOPIVI comunicado exitosamente</h2>
            </div>
            <div style="padding: 20px; background: white;">
              <p>Estimado/a <strong>${canal.delegado}</strong>,</p>
              <p>El canal de comunicación LOPIVI ha sido enviado automáticamente a todos los miembros registrados de <strong>${canal.entidad}</strong>.</p>

              <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #15803d; margin: 0 0 10px 0;">📊 Resumen del envío:</h3>
                <ul style="color: #166534; margin: 0; padding-left: 20px;">
                  <li><strong>${emailsEnviados.length}</strong> emails enviados correctamente</li>
                  ${emailsFallidos.length > 0 ? `<li style="color: #dc2626;"><strong>${emailsFallidos.length}</strong> emails con errores</li>` : ''}
                  <li>Canal configurado: <strong>${canal.tipo}</strong></li>
                  <li>Contacto: <strong>${canal.contacto}</strong></li>
                </ul>
              </div>

              <h3>Canal comunicado:</h3>
              <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 15px;">
                <p><strong>Tipo:</strong> ${canal.tipo}</p>
                <p><strong>Contacto:</strong> ${canal.contacto}</p>
                ${canal.horario ? `<p><strong>Horario:</strong> ${canal.horario}</p>` : ''}
                ${canal.instrucciones ? `<p><strong>Instrucciones:</strong> ${canal.instrucciones}</p>` : ''}
              </div>

              <p style="color: #059669; font-weight: bold; margin-top: 20px;">
                ✅ Su entidad cumple ahora con el artículo 49.2 de la LOPIVI
              </p>
            </div>
          </div>
        `
      })
    } catch (error) {
      console.error('Error enviando confirmación al delegado:', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Canal LOPIVI comunicado a toda la organización',
      estadisticas: {
        totalEnviados: emailsEnviados.length,
        totalFallidos: emailsFallidos.length,
        totalMiembros: miembros.length
      },
      detalles: {
        enviados: emailsEnviados,
        fallidos: emailsFallidos
      }
    })

  } catch (error) {
    console.error('Error en API canal LOPIVI:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET para verificar configuración existente
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const entidadId = searchParams.get('entidadId')

  if (!entidadId) {
    return NextResponse.json(
      { success: false, error: 'ID de entidad requerido' },
      { status: 400 }
    )
  }

  // En producción, consultar base de datos
  // Por ahora devolver estado simulado
  return NextResponse.json({
    success: true,
    canal: null, // null si no está configurado
    fechaLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    diasRestantes: 25,
    obligatorio: true
  })
}
