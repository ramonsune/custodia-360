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
    const { changeRequestId, newDelegateId } = body

    if (!changeRequestId || !newDelegateId) {
      return NextResponse.json({
        error: 'changeRequestId y newDelegateId son requeridos'
      }, { status: 400 })
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

    // Validar que el nuevo delegado existe y está certificado
    const { data: newDelegate, error: delegateError } = await supabase
      .from('delegados')
      .select('*, training:training_status(*)')
      .eq('id', newDelegateId)
      .single()

    if (delegateError || !newDelegate) {
      return NextResponse.json({ error: 'Nuevo delegado no encontrado' }, { status: 404 })
    }

    // Verificar que tiene formación y certificación
    const training = Array.isArray(newDelegate.training) ? newDelegate.training[0] : newDelegate.training

    if (!training || !training.certified || training.modules_completed < 6 || !training.test_passed) {
      return NextResponse.json({
        error: 'El nuevo delegado no ha completado la formación y certificación requerida',
        details: {
          modules_completed: training?.modules_completed || 0,
          test_passed: training?.test_passed || false,
          certified: training?.certified || false
        }
      }, { status: 400 })
    }

    // Actualizar rol del delegado saliente (si existe)
    if (changeRequest.outgoing_delegate_id) {
      await supabase
        .from('delegados')
        .update({
          role: 'former_principal',
          previous_role: 'principal',
          role_changed_at: new Date().toISOString(),
          role_change_reason: changeRequest.reason,
          is_active: false
        })
        .eq('id', changeRequest.outgoing_delegate_id)
    }

    // Actualizar rol del nuevo delegado a principal
    await supabase
      .from('delegados')
      .update({
        role: 'principal',
        previous_role: newDelegate.role, // Guardar rol anterior
        role_changed_at: new Date().toISOString(),
        role_change_reason: 'transition_completed'
      })
      .eq('id', newDelegateId)

    // Actualizar solicitud de cambio como completada
    const transitionDate = new Date().toISOString()

    await supabase
      .from('delegate_change_requests')
      .update({
        status: 'completed',
        transition_date: transitionDate,
        completed_at: transitionDate,
        incoming_delegate_id: newDelegateId
      })
      .eq('id', changeRequestId)

    // Crear registro de auditoría
    const { data: compliance } = await supabase
      .from('entity_compliance')
      .select('*')
      .eq('entity_id', changeRequest.entity_id)
      .single()

    await supabase.from('delegate_transitions_audit').insert({
      entity_id: changeRequest.entity_id,
      change_request_id: changeRequestId,
      outgoing_delegate_name: changeRequest.outgoing_delegate_name,
      outgoing_delegate_email: changeRequest.outgoing_delegate_email,
      outgoing_delegate_role: 'principal',
      incoming_delegate_name: newDelegate.nombre,
      incoming_delegate_email: newDelegate.email,
      incoming_delegate_role: 'principal',
      incoming_delegate_certified_at: training.certified_at,
      reason: changeRequest.reason,
      reason_details: changeRequest.reason_details,
      transition_completed_at: transitionDate,
      compliance_snapshot: compliance || {},
      metadata: JSON.stringify({ training_status: training })
    })

    // Enviar notificaciones
    // 1. Al delegado saliente (si existe)
    if (changeRequest.outgoing_delegate_email) {
      await supabase.from('message_jobs').insert({
        entity_id: changeRequest.entity_id,
        template_slug: 'delegate-role-revoked',
        channel: 'email',
        recipient_email: changeRequest.outgoing_delegate_email,
        context: JSON.stringify({
          delegate_name: changeRequest.outgoing_delegate_name,
          entity_name: '[Entity Name]',
          reason: changeRequest.reason,
          effective_date: new Date().toLocaleDateString('es-ES')
        }),
        status: 'queued',
        scheduled_at: new Date().toISOString()
      })
    }

    // 2. Al nuevo delegado (bienvenida)
    await supabase.from('message_jobs').insert({
      entity_id: changeRequest.entity_id,
      template_slug: 'delegate-promoted-welcome',
      channel: 'email',
      recipient_email: newDelegate.email,
      context: JSON.stringify({
        delegate_name: newDelegate.nombre,
        entity_name: '[Entity Name]',
        dashboard_url: `${process.env.APP_BASE_URL}/dashboard-delegado`
      }),
      status: 'queued',
      scheduled_at: new Date().toISOString()
    })

    // 3. A toda la entidad (notificación de cambio completado)
    // TODO: Implementar envío masivo a todos los miembros de la entidad

    return NextResponse.json({
      success: true,
      message: 'Transición completada exitosamente',
      transitionDate
    })

  } catch (e: any) {
    console.error('Error in delegate-change/complete:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
