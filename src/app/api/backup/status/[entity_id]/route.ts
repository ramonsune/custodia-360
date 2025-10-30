import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(
  request: Request,
  { params }: { params: { entity_id: string } }
) {
  try {
    const { entity_id } = params

    if (!entity_id) {
      return NextResponse.json(
        { error: 'entity_id requerido' },
        { status: 400 }
      )
    }

    // Obtener información de la entidad
    const { data: entity, error: entityError } = await supabase
      .from('entidades')
      .select('id, nombre, has_backup_delegate, backup_status')
      .eq('id', entity_id)
      .single()

    if (entityError || !entity) {
      return NextResponse.json(
        { error: 'Entidad no encontrada' },
        { status: 404 }
      )
    }

    // Si no tiene suplente, retornar estado básico
    if (!entity.has_backup_delegate || entity.backup_status === 'none') {
      return NextResponse.json({
        entity_id: entity.id,
        entity_name: entity.nombre,
        has_backup_delegate: false,
        backup_status: 'none',
        delegate: null,
        request: null
      })
    }

    // Obtener información del suplente activo
    const { data: suplenteRole } = await supabase
      .from('entity_user_roles')
      .select('user_id, enabled, assigned_at, revoked_at, users(id, email, name, status)')
      .eq('entity_id', entity_id)
      .eq('role', 'SUPLENTE')
      .single()

    // Obtener última solicitud
    const { data: request } = await supabase
      .from('backup_delegate_requests')
      .select('*')
      .eq('entity_id', entity_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({
      entity_id: entity.id,
      entity_name: entity.nombre,
      has_backup_delegate: entity.has_backup_delegate,
      backup_status: entity.backup_status,
      delegate: suplenteRole ? {
        user_id: suplenteRole.users.id,
        email: suplenteRole.users.email,
        name: suplenteRole.users.name,
        status: suplenteRole.users.status,
        enabled: suplenteRole.enabled,
        assigned_at: suplenteRole.assigned_at,
        revoked_at: suplenteRole.revoked_at
      } : null,
      request: request ? {
        id: request.id,
        status: request.status,
        created_at: request.created_at,
        authorized_at: request.authorized_at,
        rejection_reason: request.rejection_reason
      } : null
    })

  } catch (error) {
    console.error('Error en /api/backup/status:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
