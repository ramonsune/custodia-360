import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )

    const body = await request.json()
    const { changeRequestId, cancellationReason } = body

    if (!changeRequestId) {
      return NextResponse.json({ error: 'changeRequestId es requerido' }, { status: 400 })
    }

    // Obtener la solicitud de cambio
    const { data: changeRequest, error: fetchError } = await supabase
      .from('delegate_change_requests')
      .select('*')
      .eq('id', changeRequestId)
      .single()

    if (fetchError || !changeRequest) {
      return NextResponse.json({ error: 'Solicitud de cambio no encontrada' }, { status: 404 })
    }

    // Verificar que no esté ya completada
    if (changeRequest.status === 'completed') {
      return NextResponse.json({
        error: 'No se puede cancelar una transición ya completada'
      }, { status: 400 })
    }

    // Actualizar solicitud como cancelada
    await supabase
      .from('delegate_change_requests')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: cancellationReason || 'Cancelado por administrador'
      })
      .eq('id', changeRequestId)

    // Si había un token de onboarding pendiente, marcarlo como expirado
    if (changeRequest.incoming_type === 'new_person') {
      await supabase
        .from('entity_invite_tokens')
        .update({ status: 'expired' })
        .eq('entity_id', changeRequest.entity_id)
        .eq('role', 'delegado_principal_transition')
        .eq('status', 'pending')
    }

    // Si era promoción de suplente y ya se había cambiado el rol, revertirlo
    if (changeRequest.incoming_type === 'promoted_suplente' && changeRequest.incoming_delegate_id) {
      const { data: newDelegate } = await supabase
        .from('delegados')
        .select('role, previous_role')
        .eq('id', changeRequest.incoming_delegate_id)
        .single()

      // Solo revertir si el cambio se había aplicado
      if (newDelegate && newDelegate.role === 'principal' && newDelegate.previous_role === 'suplente') {
        await supabase
          .from('delegados')
          .update({
            role: 'suplente',
            previous_role: null,
            role_changed_at: null,
            role_change_reason: null
          })
          .eq('id', changeRequest.incoming_delegate_id)
      }

      // Restaurar delegado saliente si se había desactivado
      if (changeRequest.outgoing_delegate_id) {
        const { data: outgoingDelegate } = await supabase
          .from('delegados')
          .select('role, previous_role')
          .eq('id', changeRequest.outgoing_delegate_id)
          .single()

        if (outgoingDelegate && outgoingDelegate.role === 'former_principal') {
          await supabase
            .from('delegados')
            .update({
              role: 'principal',
              previous_role: null,
              role_changed_at: null,
              role_change_reason: null,
              is_active: true
            })
            .eq('id', changeRequest.outgoing_delegate_id)
        }
      }
    }

    // Enviar notificaciones
    // 1. Al delegado saliente (informar que se canceló)
    if (changeRequest.outgoing_delegate_email) {
      await supabase.from('message_jobs').insert({
        entity_id: changeRequest.entity_id,
        template_slug: 'delegate-change-initiated', // Reutilizar plantilla
        channel: 'email',
        recipient_email: changeRequest.outgoing_delegate_email,
        context: JSON.stringify({
          delegate_name: changeRequest.outgoing_delegate_name,
          entity_name: '[Entity Name]',
          reason: 'Proceso de cambio cancelado',
          incoming_delegate_name: changeRequest.incoming_name,
          incoming_delegate_email: changeRequest.incoming_email,
          status: 'cancelado'
        }),
        status: 'queued',
        scheduled_at: new Date().toISOString()
      })
    }

    // 2. Al nuevo delegado (si tenía email)
    if (changeRequest.incoming_email) {
      await supabase.from('message_jobs').insert({
        entity_id: changeRequest.entity_id,
        template_slug: 'delegate-change-initiated',
        channel: 'email',
        recipient_email: changeRequest.incoming_email,
        context: JSON.stringify({
          delegate_name: changeRequest.incoming_name,
          entity_name: '[Entity Name]',
          reason: 'Proceso de cambio cancelado',
          incoming_delegate_name: '',
          incoming_delegate_email: '',
          status: 'El proceso de designación como delegado ha sido cancelado'
        }),
        status: 'queued',
        scheduled_at: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Proceso de cambio cancelado exitosamente'
    })

  } catch (e: any) {
    console.error('Error in delegate-change/cancel:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
