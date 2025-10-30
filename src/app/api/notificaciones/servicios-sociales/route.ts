import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// Emails de servicios sociales por comunidad autónoma (simulados para demo)
const emailsServiciosSociales = {
  'madrid': 'servicios.sociales@madrid.es',
  'barcelona': 'servicios.sociales@barcelona.cat',
  'valencia': 'servicios.sociales@valencia.es',
  'sevilla': 'servicios.sociales@sevilla.es',
  'default': 'servicios.sociales@example.gov.es' // Email genérico para demo
}

export async function POST(request: Request) {
  try {
    const {
      casoId,
      tipoCaso,
      entidad,
      fechaHora,
      delegado,
      descripcion,
      ubicacion,
      menorAfectado,
      provincia = 'default',
      telefono,
      emailContacto
    } = await request.json()

    // Determinar email de destino según provincia
    const emailDestino = emailsServiciosSociales[provincia.toLowerCase()] || emailsServiciosSociales.default

    // Mapear tipos de caso
    const tiposCaso = {
      'maltrato': 'Sospecha de Maltrato Infantil',
      'abandono': 'Abandono o Negligencia',
      'abuso': 'Presunto Abuso Sexual',
      'emergencia': 'Situación de Emergencia'
    }

    const tipoTexto = tiposCaso[tipoCaso] || tipoCaso

    const html = `
      <div style="font-family: 'Times New Roman', serif; max-width: 700px; margin: 0 auto; background-color: white; padding: 40px;">
        <!-- Encabezado Oficial -->
        <div style="text-align: center; border-bottom: 2px solid #374151; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 24px; color: #374151; font-weight: bold;">
            COMUNICACIÓN OFICIAL LOPIVI
          </h1>
          <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">
            Ley Orgánica 8/2021 de Protección Integral a la Infancia y Adolescencia
          </p>
        </div>

        <!-- Datos de Identificación -->
        <div style="margin: 30px 0; line-height: 1.6;">
          <p><strong>Para:</strong> Servicios Sociales - ${provincia.charAt(0).toUpperCase() + provincia.slice(1)}</p>
          <p><strong>De:</strong> ${entidad} (Entidad Protegida LOPIVI)</p>
          <p><strong>Asunto:</strong> Comunicación Urgente - ${tipoTexto}</p>
          <p><strong>Fecha:</strong> ${fechaHora}</p>
          <p><strong>Referencia:</strong> <span style="color: #dc2626; font-weight: bold;">${casoId}</span></p>
        </div>

        <!-- Contenido Principal -->
        <div style="margin: 30px 0;">
          <p style="text-align: justify; line-height: 1.8;">
            En cumplimiento de lo establecido en la <strong>Ley Orgánica 8/2021, de 4 de junio,
            de protección integral a la infancia y la adolescencia frente a la violencia</strong>,
            y en particular del artículo 16 relativo a los protocolos de actuación, procedemos
            a comunicar formalmente la siguiente situación:
          </p>

          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #dc2626;">SITUACIÓN REPORTADA</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #fee2e2; font-weight: bold; width: 30%;">Tipo de Caso:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #fee2e2;">${tipoTexto}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #fee2e2; font-weight: bold;">Entidad:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #fee2e2;">${entidad}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #fee2e2; font-weight: bold;">Delegado/a de Protección:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #fee2e2;">${delegado}</td>
              </tr>
              ${ubicacion ? `
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #fee2e2; font-weight: bold;">Ubicación:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #fee2e2;">${ubicacion}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Fecha del Incidente:</td>
                <td style="padding: 8px 0;">${fechaHora}</td>
              </tr>
            </table>
          </div>

          ${descripcion ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">DESCRIPCIÓN DE LOS HECHOS</h3>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="margin: 0; white-space: pre-wrap; text-align: justify; line-height: 1.6;">${descripcion}</p>
            </div>
          </div>
          ` : ''}

          ${menorAfectado ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">INFORMACIÓN DEL MENOR (DATOS PROTEGIDOS)</h3>
            <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fbbf24;">
              <p style="margin: 0; color: #92400e; font-size: 12px; font-style: italic;">
                Los datos del menor están protegidos conforme a la LOPD. Solo se proporcionan iniciales.
              </p>
              <table style="width: 100%; margin-top: 10px;">
                <tr>
                  <td style="font-weight: bold; padding: 5px 0;">Iniciales:</td>
                  <td style="padding: 5px 0;">${menorAfectado.nombre_iniciales || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; padding: 5px 0;">Edad aproximada:</td>
                  <td style="padding: 5px 0;">${menorAfectado.edad || 'N/A'} años</td>
                </tr>
              </table>
            </div>
          </div>
          ` : ''}

          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">MEDIDAS ADOPTADAS</h3>
            <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.6;">
              <li>Activación inmediata del protocolo LOPIVI específico</li>
              <li>Garantía de seguridad del menor en el entorno</li>
              <li>Documentación completa del caso con timestamp legal</li>
              <li>Notificación a los servicios competentes (presente comunicación)</li>
              <li>Seguimiento programado según protocolo establecido</li>
            </ul>
          </div>

          <div style="margin: 30px 0;">
            <h3 style="color: #374151;">DATOS DE CONTACTO PARA COORDINACIÓN</h3>
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; border: 1px solid #0ea5e9;">
              <p><strong>Delegado/a de Protección:</strong> ${delegado}</p>
              ${telefono ? `<p><strong>Teléfono:</strong> ${telefono}</p>` : ''}
              ${emailContacto ? `<p><strong>Email:</strong> ${emailContacto}</p>` : ''}
              <p><strong>Entidad:</strong> ${entidad}</p>
              <p><strong>Horario de contacto:</strong> 24 horas (casos urgentes)</p>
            </div>
          </div>

          <p style="text-align: justify; line-height: 1.8; margin: 30px 0;">
            Solicitamos la <strong>coordinación inmediata</strong> para evaluar la situación y adoptar
            las medidas de protección que se consideren oportunas. Quedamos a disposición de ese
            servicio para facilitar cualquier información adicional que pueda requerirse.
          </p>

          <p style="text-align: justify; line-height: 1.8;">
            Esta comunicación se realiza en el marco del <strong>artículo 16 de la LOPIVI</strong>
            y forma parte del sistema de protección integral establecido por la normativa vigente.
          </p>
        </div>

        <!-- Firma y Datos Legales -->
        <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p style="margin: 0;"><strong>${delegado}</strong></p>
          <p style="margin: 5px 0;">Delegado/a de Protección</p>
          <p style="margin: 5px 0;">${entidad}</p>
          <p style="margin: 15px 0 0 0; font-size: 12px; color: #6b7280;">
            Documento generado automáticamente por sistema certificado LOPIVI el ${fechaHora}
          </p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">
            Referencia única: ${casoId} | Hash de verificación disponible para auditoría
          </p>
        </div>

        <!-- Aviso Legal -->
        <div style="background-color: #f3f4f6; padding: 15px; margin-top: 20px; border-radius: 8px;">
          <p style="margin: 0; font-size: 11px; color: #4b5563; text-align: center;">
            <strong>AVISO LEGAL:</strong> Esta comunicación contiene información confidencial protegida por la LOPD.
            Su uso está restringido a personal autorizado de servicios sociales.
            La divulgación no autorizada está prohibida por ley.
          </p>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: emailDestino,
      cc: 'rsune@teamsml.com', // Copia al admin para seguimiento
      subject: `LOPIVI - Comunicación Urgente ${casoId}: ${tipoTexto}`,
      html
    })

    // Registrar la notificación en base de datos
    await supabase
      .from('caso_urgente_notificaciones')
      .insert([{
        caso_urgente_id: casoId, // Nota: Esto debería ser el UUID, no el string
        tipo_notificacion: 'email',
        destinatario: emailDestino,
        asunto: `LOPIVI - Comunicación Urgente ${casoId}: ${tipoTexto}`,
        mensaje: 'Comunicación oficial LOPIVI enviada a servicios sociales',
        canal: 'servicios_sociales',
        estado: 'enviado',
        legal_hash: btoa(JSON.stringify({ caso: casoId, timestamp: new Date().toISOString() })).slice(0, 32),
        ip_address: '127.0.0.1' // En producción obtener IP real
      }])

    console.log('✅ Notificación servicios sociales enviada:', result.data?.id)

    return NextResponse.json({
      success: true,
      emailId: result.data?.id,
      destinatario: emailDestino,
      message: 'Notificación a servicios sociales enviada correctamente'
    })

  } catch (error) {
    console.error('❌ Error enviando notificación a servicios sociales:', error)
    return NextResponse.json({
      success: false,
      error: 'Error enviando notificación a servicios sociales',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
