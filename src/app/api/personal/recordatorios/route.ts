import { NextRequest, NextResponse } from 'next/server'
import { supabase, logAuditAction } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@custodia360.es'

interface RecordatorioData {
  personal_id: string
  delegado_id: string
  tipo_recordatorio: 'formacion_pendiente' | 'vencimiento_certificado' | 'renovacion_obligatoria' | 'inscripcion_disponible'
  mensaje?: string
  canal?: 'email' | 'sms' | 'sistema'
  fecha_programada?: string
}

// Función para generar hash legal
function generateLegalHash(data: any): string {
  const timestamp = new Date().toISOString()
  const dataString = JSON.stringify(data) + timestamp
  return btoa(dataString).slice(0, 32)
}

// Plantillas de mensajes para recordatorios
const PLANTILLAS_RECORDATORIOS = {
  formacion_pendiente: {
    asunto: '📚 Recordatorio: Formación LOPIVI Pendiente',
    mensaje: (nombre: string, cargo: string, entidad: string) => `
      Estimado/a ${nombre},

      Le recordamos que tiene pendiente completar la formación obligatoria en protección infantil según la LOPIVI.

      Su cargo: ${cargo}
      Entidad: ${entidad}

      Es imprescindible completar esta formación para poder continuar trabajando con menores de edad.

      Por favor, contacte con el Delegado de Protección para programar su formación.

      Saludos cordiales,
      Sistema Custodia360
    `
  },
  vencimiento_certificado: {
    asunto: '⚠️ Su certificado LOPIVI vence pronto',
    mensaje: (nombre: string, diasRestantes: number, entidad: string) => `
      Estimado/a ${nombre},

      Su certificado de formación LOPIVI vence en ${diasRestantes} días.

      Para mantener su certificación vigente y continuar trabajando con menores, debe renovar su formación antes del vencimiento.

      Entidad: ${entidad}

      Contacte con el Delegado de Protección para programar la renovación.

      Saludos cordiales,
      Sistema Custodia360
    `
  },
  renovacion_obligatoria: {
    asunto: '🚨 Renovación LOPIVI Obligatoria',
    mensaje: (nombre: string, entidad: string) => `
      Estimado/a ${nombre},

      Su certificado LOPIVI ha vencido o está próximo a vencer. La renovación es obligatoria para continuar trabajando con menores de edad.

      Entidad: ${entidad}

      Esta es una comunicación urgente. Contacte inmediatamente con el Delegado de Protección.

      Saludos cordiales,
      Sistema Custodia360
    `
  },
  inscripcion_disponible: {
    asunto: '📅 Nueva formación LOPIVI disponible',
    mensaje: (nombre: string, nombreFormacion: string, entidad: string) => `
      Estimado/a ${nombre},

      Hay una nueva formación LOPIVI disponible que puede ser de su interés:

      Formación: ${nombreFormacion}
      Entidad: ${entidad}

      Para más información e inscripción, contacte con el Delegado de Protección.

      Saludos cordiales,
      Sistema Custodia360
    `
  }
}

// POST - Enviar recordatorio a personal
export async function POST(request: NextRequest) {
  try {
    const data: RecordatorioData = await request.json()

    // Validaciones básicas
    if (!data.personal_id || !data.delegado_id || !data.tipo_recordatorio) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: personal_id, delegado_id, tipo_recordatorio' },
        { status: 400 }
      )
    }

    // Obtener datos del personal
    const { data: personal, error: personalError } = await supabase
      .from('personal')
      .select(`
        *,
        entidades!inner(nombre)
      `)
      .eq('id', data.personal_id)
      .single()

    if (personalError || !personal) {
      return NextResponse.json(
        { error: 'Personal no encontrado' },
        { status: 404 }
      )
    }

    // Obtener datos del delegado
    const { data: delegado, error: delegadoError } = await supabase
      .from('delegados')
      .select('nombre, apellidos, email')
      .eq('id', data.delegado_id)
      .single()

    if (delegadoError || !delegado) {
      return NextResponse.json(
        { error: 'Delegado no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el personal tenga email para recordatorios por email
    if (data.canal === 'email' && !personal.email) {
      return NextResponse.json(
        { error: 'El personal no tiene email registrado' },
        { status: 400 }
      )
    }

    // Preparar mensaje según el tipo de recordatorio
    let mensaje = data.mensaje
    let asunto = 'Recordatorio LOPIVI'

    if (!mensaje) {
      const plantilla = PLANTILLAS_RECORDATORIOS[data.tipo_recordatorio]
      if (plantilla) {
        asunto = plantilla.asunto

        if (data.tipo_recordatorio === 'vencimiento_certificado') {
          // Calcular días restantes
          const diasRestantes = personal.fecha_vencimiento_certificado
            ? Math.ceil((new Date(personal.fecha_vencimiento_certificado).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : 0
          mensaje = plantilla.mensaje(personal.nombre, diasRestantes, personal.entidades.nombre)
        } else if (data.tipo_recordatorio === 'inscripcion_disponible') {
          mensaje = plantilla.mensaje(personal.nombre, 'Formación LOPIVI Básica', personal.entidades.nombre)
        } else {
          mensaje = plantilla.mensaje(personal.nombre, personal.cargo, personal.entidades.nombre)
        }
      } else {
        mensaje = `Recordatorio de ${data.tipo_recordatorio} para ${personal.nombre} ${personal.apellidos}`
      }
    }

    // Crear registro del recordatorio
    const recordatorioData = {
      personal_id: data.personal_id,
      delegado_id: data.delegado_id,
      tipo_recordatorio: data.tipo_recordatorio,
      mensaje: mensaje,
      canal: data.canal || 'email',
      estado: 'pendiente',
      fecha_programada: data.fecha_programada || new Date().toISOString(),
      legal_hash: generateLegalHash(data)
    }

    const { data: recordatorio, error: recordatorioError } = await supabase
      .from('recordatorios_formacion')
      .insert([recordatorioData])
      .select()
      .single()

    if (recordatorioError) {
      console.error('❌ Error creando recordatorio:', recordatorioError)
      return NextResponse.json(
        { error: 'Error creando recordatorio' },
        { status: 500 }
      )
    }

    let resultadoEnvio = { success: false, emailId: null, error: null }

    // Enviar recordatorio según el canal
    if (data.canal === 'email' && personal.email) {
      try {
        // Generar HTML del email
        const htmlEmail = `
          <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
            <div style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

              <!-- Header -->
              <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Custodia360 - LOPIVI</h1>
                <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px;">
                  Sistema de Protección Integral a la Infancia
                </p>
              </div>

              <!-- Contenido -->
              <div style="padding: 30px;">
                <div style="background-color: #f1f5f9; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 20px;">
                  <h2 style="margin-top: 0; color: #1e40af; font-size: 18px;">${asunto}</h2>
                </div>

                <div style="color: #374151; line-height: 1.6;">
                  ${mensaje.split('\n').map(line => `<p style="margin: 10px 0;">${line.trim()}</p>`).join('')}
                </div>

                <!-- Información del personal -->
                <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-top: 25px;">
                  <h3 style="margin-top: 0; color: #374151; font-size: 16px;">Información</h3>
                  <div style="color: #6b7280; font-size: 14px;">
                    <p><strong>Personal:</strong> ${personal.nombre} ${personal.apellidos}</p>
                    <p><strong>Cargo:</strong> ${personal.cargo}</p>
                    <p><strong>Entidad:</strong> ${personal.entidades.nombre}</p>
                    <p><strong>Estado formación:</strong> ${personal.formacion_lopivi_completada ? '✅ Completada' : '❌ Pendiente'}</p>
                    ${personal.fecha_vencimiento_certificado ? `<p><strong>Vencimiento certificado:</strong> ${new Date(personal.fecha_vencimiento_certificado).toLocaleDateString('es-ES')}</p>` : ''}
                  </div>
                </div>

                <!-- Botón de acción -->
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard-delegado"
                     style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    Acceder al Dashboard
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <div style="color: #6b7280; font-size: 12px;">
                  <p style="margin: 0;"><strong>Delegado de Protección:</strong> ${delegado.nombre} ${delegado.apellidos}</p>
                  <p style="margin: 5px 0 0 0;">Email: ${delegado.email}</p>
                  <p style="margin: 10px 0 0 0; color: #ef4444;">
                    📋 Este recordatorio es parte del cumplimiento normativo LOPIVI
                  </p>
                </div>
              </div>
            </div>
          </div>
        `

        // Enviar email
        const result = await resend.emails.send({
          from: FROM_EMAIL,
          to: personal.email,
          subject: asunto,
          html: htmlEmail
        })

        resultadoEnvio = {
          success: true,
          emailId: result.data?.id || null,
          error: null
        }

        // Actualizar estado del recordatorio
        await supabase
          .from('recordatorios_formacion')
          .update({
            estado: 'enviado',
            fecha_enviado: new Date().toISOString(),
            intentos_envio: 1
          })
          .eq('id', recordatorio.id)

      } catch (emailError) {
        console.error('❌ Error enviando email:', emailError)
        resultadoEnvio = {
          success: false,
          emailId: null,
          error: emailError instanceof Error ? emailError.message : 'Error desconocido'
        }

        // Actualizar estado de error
        await supabase
          .from('recordatorios_formacion')
          .update({
            estado: 'error',
            ultimo_error: resultadoEnvio.error,
            intentos_envio: 1
          })
          .eq('id', recordatorio.id)
      }
    }

    // Registrar en auditoría LOPIVI
    await logAuditAction({
      user_name: `${delegado.nombre} ${delegado.apellidos}`,
      action_type: 'recordatorio_formacion_enviado',
      entity_type: 'recordatorio_formacion',
      entity_id: recordatorio.id,
      details: {
        personal_nombre: `${personal.nombre} ${personal.apellidos}`,
        tipo_recordatorio: data.tipo_recordatorio,
        canal: data.canal || 'email',
        estado_envio: resultadoEnvio.success ? 'enviado' : 'error',
        email_id: resultadoEnvio.emailId,
        entidad: personal.entidades.nombre
      }
    })

    console.log(`✅ Recordatorio ${data.tipo_recordatorio} ${resultadoEnvio.success ? 'enviado' : 'creado con error'} para ${personal.nombre}`)

    return NextResponse.json({
      success: true,
      recordatorio: {
        id: recordatorio.id,
        tipo: data.tipo_recordatorio,
        estado: resultadoEnvio.success ? 'enviado' : 'error',
        canal: data.canal || 'email',
        fecha_envio: new Date().toISOString()
      },
      envio: resultadoEnvio,
      message: resultadoEnvio.success
        ? `Recordatorio enviado exitosamente a ${personal.email}`
        : `Recordatorio creado pero falló el envío: ${resultadoEnvio.error}`
    })

  } catch (error) {
    console.error('❌ Error en API recordatorios:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// GET - Obtener recordatorios de personal
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const personalId = searchParams.get('personal_id')
    const entidadId = searchParams.get('entidad_id')
    const tipo = searchParams.get('tipo')
    const estado = searchParams.get('estado')
    const limite = parseInt(searchParams.get('limite') || '20')

    let query = supabase
      .from('recordatorios_formacion')
      .select(`
        *,
        personal!inner(nombre, apellidos, cargo, entidades(nombre)),
        delegados!inner(nombre, apellidos)
      `)
      .order('created_at', { ascending: false })
      .limit(limite)

    if (personalId) {
      query = query.eq('personal_id', personalId)
    }

    if (entidadId) {
      query = query.eq('personal.entidad_id', entidadId)
    }

    if (tipo) {
      query = query.eq('tipo_recordatorio', tipo)
    }

    if (estado) {
      query = query.eq('estado', estado)
    }

    const { data: recordatorios, error } = await query

    if (error) {
      console.error('❌ Error obteniendo recordatorios:', error)
      return NextResponse.json(
        { error: 'Error obteniendo recordatorios' },
        { status: 500 }
      )
    }

    const recordatoriosFormateados = recordatorios?.map(rec => ({
      id: rec.id,
      tipo_recordatorio: rec.tipo_recordatorio,
      estado: rec.estado,
      canal: rec.canal,
      fecha_programada: rec.fecha_programada,
      fecha_enviado: rec.fecha_enviado,
      fecha_leido: rec.fecha_leido,
      intentos_envio: rec.intentos_envio,
      ultimo_error: rec.ultimo_error,
      personal: {
        nombre: `${rec.personal.nombre} ${rec.personal.apellidos}`,
        cargo: rec.personal.cargo,
        entidad: rec.personal.entidades.nombre
      },
      delegado: `${rec.delegados.nombre} ${rec.delegados.apellidos}`,
      mensaje: rec.mensaje
    })) || []

    return NextResponse.json({
      success: true,
      recordatorios: recordatoriosFormateados,
      total: recordatoriosFormateados.length
    })

  } catch (error) {
    console.error('❌ Error en GET recordatorios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
