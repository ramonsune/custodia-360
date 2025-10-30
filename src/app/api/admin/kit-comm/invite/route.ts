import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

// Rate limiting simple (en producción usar Redis o similar)
const emailsSent = new Map<string, number>()

export async function POST(request: NextRequest) {
  try {
    // TODO: Implementar guard de autenticación admin
    // const { isAdmin, adminEmail } = await checkAdminAuth(request)
    // if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminEmail = 'admin@custodia360.es' // Temporal

    const body = await request.json()
    const { entityId } = body

    // Validaciones
    if (!entityId) {
      return NextResponse.json({ error: 'entityId is required' }, { status: 400 })
    }

    // Rate limiting: máximo 1 email cada 60 segundos por entidad
    const now = Date.now()
    const lastSent = emailsSent.get(entityId)
    if (lastSent && (now - lastSent) < 60000) {
      return NextResponse.json({
        error: 'Espera al menos 60 segundos antes de enviar otro email a esta entidad'
      }, { status: 429 })
    }

    // Obtener datos de la entidad
    const { data: entity, error: fetchError } = await supabase
      .from('entities')
      .select('id, nombre, email_contacto, kit_comunicacion')
      .eq('id', entityId)
      .single()

    if (fetchError || !entity) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 })
    }

    // Validar que tenga email de contacto
    if (!entity.email_contacto || !entity.email_contacto.includes('@')) {
      return NextResponse.json({
        error: 'Esta entidad no tiene un email de contacto válido'
      }, { status: 400 })
    }

    // Obtener plantilla de email
    const { data: template, error: templateError } = await supabase
      .from('message_templates')
      .select('asunto, cuerpo')
      .eq('slug', 'kit-comm-invite')
      .single()

    if (templateError || !template) {
      console.error('Error fetching email template:', templateError)
      return NextResponse.json({ error: 'Email template not found' }, { status: 500 })
    }

    // Preparar variables para la plantilla
    const responsable = entity.nombre || 'Responsable'
    const linkContratacion = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.custodia360.es'}/dashboard-entidad`

    // Reemplazar variables en el cuerpo del email
    let emailBody = template.cuerpo
      .replace(/\{\{responsable\}\}/g, responsable)
      .replace(/\{\{link_contratacion\}\}/g, linkContratacion)

    // Enviar email con Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Custodia360 <noreply@custodia360.es>',
      to: [entity.email_contacto],
      subject: template.asunto,
      text: emailBody,
      html: emailBody.replace(/\n/g, '<br>')
    })

    if (emailError) {
      console.error('Error sending email with Resend:', emailError)
      return NextResponse.json({ error: 'Error al enviar el email' }, { status: 500 })
    }

    // Actualizar rate limiting
    emailsSent.set(entityId, now)

    // Registrar la acción en el log
    const { error: logError } = await supabase
      .from('admin_actions_log')
      .insert({
        actor: adminEmail,
        entity_id: entityId,
        action: 'kit_comm_invite',
        metadata: {
          entity_name: entity.nombre,
          email_sent_to: entity.email_contacto,
          email_id: emailData?.id,
          sent_at: new Date().toISOString()
        }
      })

    if (logError) {
      console.warn('Error logging action (non-critical):', logError)
    }

    console.log(`✉️ Invitación Kit Comunicación enviada a: ${entity.email_contacto} (${entity.nombre})`)

    return NextResponse.json({
      success: true,
      entityId,
      emailSentTo: entity.email_contacto,
      message: 'Invitación enviada correctamente'
    })

  } catch (err: any) {
    console.error('Unexpected error in kit-comm/invite:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
