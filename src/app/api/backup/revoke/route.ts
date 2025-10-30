import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { entity_id, revoked_by_user_id, reason } = body

    if (!entity_id) {
      return NextResponse.json(
        { error: 'entity_id requerido' },
        { status: 400 }
      )
    }

    // Obtener información de la entidad y del suplente
    const { data: entity, error: entityError } = await supabase
      .from('entidades')
      .select('id, nombre, email_contacto, backup_status')
      .eq('id', entity_id)
      .single()

    if (entityError || !entity) {
      return NextResponse.json(
        { error: 'Entidad no encontrada' },
        { status: 404 }
      )
    }

    if (entity.backup_status !== 'active') {
      return NextResponse.json(
        { error: 'No hay delegado suplente activo para revocar' },
        { status: 400 }
      )
    }

    // Obtener el usuario suplente
    const { data: suplenteRole, error: roleError } = await supabase
      .from('entity_user_roles')
      .select('user_id, users(email, name)')
      .eq('entity_id', entity_id)
      .eq('role', 'SUPLENTE')
      .eq('enabled', true)
      .single()

    if (roleError || !suplenteRole) {
      return NextResponse.json(
        { error: 'No se encontró el delegado suplente activo' },
        { status: 404 }
      )
    }

    // Deshabilitar rol del suplente
    const { error: disableError } = await supabase
      .from('entity_user_roles')
      .update({
        enabled: false,
        revoked_at: new Date().toISOString()
      })
      .eq('entity_id', entity_id)
      .eq('user_id', suplenteRole.user_id)
      .eq('role', 'SUPLENTE')

    if (disableError) {
      return NextResponse.json(
        { error: 'Error deshabilitando rol de suplente' },
        { status: 500 }
      )
    }

    // Actualizar estado de la entidad
    const { error: updateEntityError } = await supabase
      .from('entidades')
      .update({
        has_backup_delegate: false,
        backup_status: 'revoked'
      })
      .eq('id', entity_id)

    if (updateEntityError) {
      console.error('Error actualizando entidad:', updateEntityError)
    }

    // Actualizar solicitudes relacionadas
    const { error: updateRequestError } = await supabase
      .from('backup_delegate_requests')
      .update({
        status: 'rejected',
        rejection_reason: reason || 'Revocado por Dirección'
      })
      .eq('entity_id', entity_id)
      .eq('user_email', suplenteRole.users.email)

    if (updateRequestError) {
      console.error('Error actualizando solicitud:', updateRequestError)
    }

    // Registrar en auditoría
    await supabase.from('audit_log').insert({
      entity_id,
      actor_user_id: revoked_by_user_id,
      action: 'backup_delegate_revoked',
      resource_type: 'entity_user_role',
      resource_id: suplenteRole.user_id,
      metadata: {
        user_email: suplenteRole.users.email,
        reason: reason || 'No especificado'
      }
    })

    // Enviar email de notificación al suplente
    try {
      await resend.emails.send({
        from: 'Custodia360 <noreply@custodia360.com>',
        to: suplenteRole.users.email,
        subject: `Suplencia revocada — ${entity.nombre}`,
        html: `
          <h2>Notificación de revocación de suplencia</h2>
          <p>Estimado/a ${suplenteRole.users.name},</p>
          <p>Te informamos que tu acceso como Delegado Suplente para <strong>${entity.nombre}</strong> ha sido revocado.</p>
          ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
          <p>A partir de este momento, no podrás acceder al panel de gestión.</p>
          <p>Si tienes dudas, contacta con la Dirección de la entidad.</p>
          <br>
          <p>Saludos,<br>Equipo Custodia360</p>
        `
      })
    } catch (emailError) {
      console.error('Error enviando email de revocación:', emailError)
    }

    // Enviar email a administración/dirección
    try {
      await resend.emails.send({
        from: 'Custodia360 <noreply@custodia360.com>',
        to: entity.email_contacto,
        subject: `Suplencia revocada — ${entity.nombre}`,
        html: `
          <h2>Suplencia revocada</h2>
          <p>Se ha revocado el acceso del Delegado Suplente <strong>${suplenteRole.users.name}</strong> (${suplenteRole.users.email}).</p>
          <p>Entidad: ${entity.nombre}</p>
          ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
          <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
          <br>
          <p>Equipo Custodia360</p>
        `
      })
    } catch (emailError) {
      console.error('Error enviando email a administración:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Delegado suplente revocado correctamente'
    })

  } catch (error) {
    console.error('Error en /api/backup/revoke:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
