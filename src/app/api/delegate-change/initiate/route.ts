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
    const {
      entityId,
      currentDelegateId,
      reason,
      reasonDetails,
      incomingType, // 'promoted_suplente' | 'new_person'
      incomingDelegateId, // Si es suplente promovido
      incomingName, // Si es nueva persona
      incomingEmail,
      incomingPhone,
      requestedBy // user_id del admin que hace la solicitud
    } = body

    // Validaciones
    if (!entityId || !reason || !incomingType || !requestedBy) {
      return NextResponse.json({
        error: 'Faltan campos obligatorios',
        details: 'entityId, reason, incomingType y requestedBy son requeridos'
      }, { status: 400 })
    }

    if (incomingType === 'promoted_suplente' && !incomingDelegateId) {
      return NextResponse.json({
        error: 'Si es promoción de suplente, debe indicar incomingDelegateId'
      }, { status: 400 })
    }

    if (incomingType === 'new_person' && (!incomingName || !incomingEmail)) {
      return NextResponse.json({
        error: 'Si es nueva persona, debe proporcionar nombre y email'
      }, { status: 400 })
    }

    // Obtener datos del delegado actual
    let outgoingDelegateName = ''
    let outgoingDelegateEmail = ''

    if (currentDelegateId) {
      const { data: currentDelegate } = await supabase
        .from('delegados')
        .select('nombre, email')
        .eq('id', currentDelegateId)
        .single()

      if (currentDelegate) {
        outgoingDelegateName = currentDelegate.nombre
        outgoingDelegateEmail = currentDelegate.email
      }
    }

    // Si es promoción de suplente, obtener datos
    let incomingNameFinal = incomingName || ''
    let incomingEmailFinal = incomingEmail || ''

    if (incomingType === 'promoted_suplente' && incomingDelegateId) {
      const { data: suplente } = await supabase
        .from('delegados')
        .select('nombre, email, telefono')
        .eq('id', incomingDelegateId)
        .single()

      if (suplente) {
        incomingNameFinal = suplente.nombre
        incomingEmailFinal = suplente.email
      }
    }

    // Crear la solicitud de cambio
    const { data: changeRequest, error: insertError } = await supabase
      .from('delegate_change_requests')
      .insert({
        entity_id: entityId,
        outgoing_delegate_id: currentDelegateId || null,
        outgoing_delegate_name: outgoingDelegateName,
        outgoing_delegate_email: outgoingDelegateEmail,
        reason,
        reason_details: reasonDetails || null,
        incoming_delegate_id: incomingType === 'promoted_suplente' ? incomingDelegateId : null,
        incoming_type: incomingType,
        incoming_name: incomingNameFinal,
        incoming_email: incomingEmailFinal,
        incoming_phone: incomingPhone || null,
        status: incomingType === 'promoted_suplente' ? 'in_transition' : 'pending_onboarding',
        requested_by: requestedBy,
        requested_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating change request:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Enviar notificación al delegado actual (si existe)
    if (currentDelegateId && outgoingDelegateEmail) {
      await supabase.from('message_jobs').insert({
        entity_id: entityId,
        template_slug: 'delegate-change-initiated',
        channel: 'email',
        recipient_email: outgoingDelegateEmail,
        context: JSON.stringify({
          delegate_name: outgoingDelegateName,
          entity_name: '[Entity Name]', // TODO: obtener desde entities
          reason: reason,
          incoming_delegate_name: incomingNameFinal,
          incoming_delegate_email: incomingEmailFinal,
          status: changeRequest.status
        }),
        status: 'queued',
        scheduled_at: new Date().toISOString()
      })
    }

    // Si es nueva persona, enviar invitación
    if (incomingType === 'new_person' && incomingEmailFinal) {
      // Crear token de onboarding
      const token = crypto.randomUUID()
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + 30)

      const { data: inviteToken } = await supabase
        .from('entity_invite_tokens')
        .insert({
          entity_id: entityId,
          token,
          role: 'delegado_principal_transition',
          deadline_at: deadline.toISOString(),
          status: 'pending',
          metadata: JSON.stringify({ change_request_id: changeRequest.id })
        })
        .select()
        .single()

      if (inviteToken) {
        const onboardingUrl = `${process.env.APP_BASE_URL}/onboarding/${entityId}/${token}`

        await supabase.from('message_jobs').insert({
          entity_id: entityId,
          template_slug: 'delegate-change-invitation',
          channel: 'email',
          recipient_email: incomingEmailFinal,
          context: JSON.stringify({
            delegate_name: incomingNameFinal,
            entity_name: '[Entity Name]',
            onboarding_url: onboardingUrl
          }),
          status: 'queued',
          scheduled_at: new Date().toISOString()
        })
      }
    }

    // Si es promoción de suplente, ejecutar transición inmediata
    if (incomingType === 'promoted_suplente' && incomingDelegateId) {
      // Actualizar roles
      if (currentDelegateId) {
        await supabase
          .from('delegados')
          .update({
            role: 'former_principal',
            previous_role: 'principal',
            role_changed_at: new Date().toISOString(),
            role_change_reason: reason,
            is_active: false
          })
          .eq('id', currentDelegateId)
      }

      await supabase
        .from('delegados')
        .update({
          role: 'principal',
          previous_role: 'suplente',
          role_changed_at: new Date().toISOString(),
          role_change_reason: 'promoted'
        })
        .eq('id', incomingDelegateId)

      // Marcar solicitud como completada
      await supabase
        .from('delegate_change_requests')
        .update({
          status: 'completed',
          transition_date: new Date().toISOString(),
          completed_at: new Date().toISOString()
        })
        .eq('id', changeRequest.id)

      // Crear registro de auditoría
      await supabase.from('delegate_transitions_audit').insert({
        entity_id: entityId,
        change_request_id: changeRequest.id,
        outgoing_delegate_name: outgoingDelegateName,
        outgoing_delegate_email: outgoingDelegateEmail,
        incoming_delegate_name: incomingNameFinal,
        incoming_delegate_email: incomingEmailFinal,
        reason,
        reason_details: reasonDetails,
        transition_completed_at: new Date().toISOString()
      })

      // Enviar notificaciones
      // 1. Al delegado saliente
      if (outgoingDelegateEmail) {
        await supabase.from('message_jobs').insert({
          entity_id: entityId,
          template_slug: 'delegate-role-revoked',
          channel: 'email',
          recipient_email: outgoingDelegateEmail,
          context: JSON.stringify({
            delegate_name: outgoingDelegateName,
            entity_name: '[Entity Name]',
            reason,
            effective_date: new Date().toLocaleDateString('es-ES')
          }),
          status: 'queued',
          scheduled_at: new Date().toISOString()
        })
      }

      // 2. Al nuevo delegado
      if (incomingEmailFinal) {
        await supabase.from('message_jobs').insert({
          entity_id: entityId,
          template_slug: 'delegate-promoted-welcome',
          channel: 'email',
          recipient_email: incomingEmailFinal,
          context: JSON.stringify({
            delegate_name: incomingNameFinal,
            entity_name: '[Entity Name]',
            dashboard_url: `${process.env.APP_BASE_URL}/dashboard-delegado`
          }),
          status: 'queued',
          scheduled_at: new Date().toISOString()
        })
      }

      // 3. A toda la entidad (TODO: implementar envío masivo)
      // Por ahora, crear job individual de notificación
    }

    return NextResponse.json({
      success: true,
      changeRequest,
      message: incomingType === 'promoted_suplente'
        ? 'Transición completada inmediatamente'
        : 'Proceso de cambio iniciado - esperando onboarding del nuevo delegado'
    })

  } catch (e: any) {
    console.error('Error in delegate-change/initiate:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
