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
    const { token, authorized_by_user_id } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 400 }
      )
    }

    // Buscar solicitud por token
    const { data: backupRequest, error: requestError } = await supabase
      .from('backup_delegate_requests')
      .select('*, entidades(id, nombre, email_contacto)')
      .eq('authorization_token', token)
      .single()

    if (requestError || !backupRequest) {
      return NextResponse.json(
        { error: 'Token inválido o solicitud no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que el token no haya expirado
    if (new Date(backupRequest.token_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Token expirado' },
        { status: 400 }
      )
    }

    // Verificar que la solicitud esté en estado correcto
    if (backupRequest.status !== 'pending_consent') {
      return NextResponse.json(
        { error: `Solicitud en estado incorrecto: ${backupRequest.status}` },
        { status: 400 }
      )
    }

    // Crear usuario en la tabla users
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email: backupRequest.user_email,
        name: backupRequest.user_name,
        password_hash: backupRequest.user_password_hash,
        status: 'active'
      })
      .select()
      .single()

    if (userError || !newUser) {
      // Si el usuario ya existe, intentar obtenerlo
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', backupRequest.user_email)
        .single()

      if (!existingUser) {
        return NextResponse.json(
          { error: 'Error creando usuario' },
          { status: 500 }
        )
      }
    }

    const userId = newUser?.id || (await supabase.from('users').select('id').eq('email', backupRequest.user_email).single()).data?.id

    // Crear rol de suplente en entity_user_roles
    const { error: roleError } = await supabase
      .from('entity_user_roles')
      .insert({
        entity_id: backupRequest.entity_id,
        user_id: userId,
        role: 'SUPLENTE',
        enabled: true,
        assigned_by: authorized_by_user_id
      })

    if (roleError) {
      return NextResponse.json(
        { error: 'Error asignando rol de suplente' },
        { status: 500 }
      )
    }

    // Actualizar solicitud a estado 'activated'
    const { error: updateRequestError } = await supabase
      .from('backup_delegate_requests')
      .update({
        status: 'activated',
        authorized_by: authorized_by_user_id,
        authorized_at: new Date().toISOString()
      })
      .eq('id', backupRequest.id)

    if (updateRequestError) {
      console.error('Error actualizando solicitud:', updateRequestError)
    }

    // Actualizar entidad
    const { error: updateEntityError } = await supabase
      .from('entidades')
      .update({
        has_backup_delegate: true,
        backup_status: 'active'
      })
      .eq('id', backupRequest.entity_id)

    if (updateEntityError) {
      console.error('Error actualizando entidad:', updateEntityError)
    }

    // Registrar en auditoría
    await supabase.from('audit_log').insert({
      entity_id: backupRequest.entity_id,
      actor_user_id: authorized_by_user_id,
      action: 'backup_delegate_authorized',
      resource_type: 'backup_delegate_request',
      resource_id: backupRequest.id,
      metadata: {
        user_email: backupRequest.user_email,
        user_id: userId
      }
    })

    // Enviar email de bienvenida al suplente
    try {
      await resend.emails.send({
        from: 'Custodia360 <noreply@custodia360.com>',
        to: backupRequest.user_email,
        subject: 'Tu panel de Delegado Suplente está activo',
        html: `
          <h2>¡Bienvenido/a, ${backupRequest.user_name}!</h2>
          <p>Tu solicitud como Delegado Suplente para <strong>${backupRequest.entidades?.nombre}</strong> ha sido autorizada por Dirección.</p>
          <p><strong>Tu panel ya está activo.</strong></p>
          <p>Puedes acceder en: <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard-suplente">Dashboard Suplente</a></p>
          <p>Email: ${backupRequest.user_email}</p>
          <p><strong>Importante:</strong> Todas tus acciones quedan registradas en el sistema de auditoría.</p>
          <br>
          <p>Saludos,<br>Equipo Custodia360</p>
        `
      })
    } catch (emailError) {
      console.error('Error enviando email de bienvenida:', emailError)
      // No fallar la autorización si el email falla
    }

    return NextResponse.json({
      success: true,
      user_id: userId,
      message: 'Delegado suplente autorizado y activado correctamente'
    })

  } catch (error) {
    console.error('Error en /api/backup/authorize:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
