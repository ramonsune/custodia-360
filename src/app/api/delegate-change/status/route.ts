import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityId = searchParams.get('entityId')

    if (!entityId) {
      return NextResponse.json({ error: 'entityId is required' }, { status: 400 })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )

    // Buscar solicitud de cambio activa (no completada ni cancelada)
    const { data: activeRequest, error } = await supabase
      .from('delegate_change_requests')
      .select('*')
      .eq('entity_id', entityId)
      .in('status', ['pending_selection', 'pending_onboarding', 'in_transition'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error fetching change request:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!activeRequest) {
      return NextResponse.json({
        hasActiveRequest: false,
        message: 'No hay proceso de cambio activo'
      })
    }

    // Si hay una solicitud activa y es nueva persona, obtener progreso del onboarding
    let onboardingProgress = null

    if (activeRequest.incoming_type === 'new_person' && activeRequest.status === 'pending_onboarding') {
      // Buscar el token de onboarding asociado
      const { data: inviteToken } = await supabase
        .from('entity_invite_tokens')
        .select('*')
        .eq('entity_id', entityId)
        .eq('role', 'delegado_principal_transition')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (inviteToken) {
        // Calcular días restantes
        const deadline = new Date(inviteToken.deadline_at)
        const now = new Date()
        const daysRemaining = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        // Buscar si ya existe un user_id asociado (usuario creado)
        let trainingProgress = null

        if (inviteToken.user_id) {
          // Buscar progreso de formación
          const { data: training } = await supabase
            .from('training_status')
            .select('*')
            .eq('person_id', inviteToken.user_id)
            .eq('entity_id', entityId)
            .maybeSingle()

          if (training) {
            trainingProgress = {
              modules_completed: training.modules_completed || 0,
              test_passed: training.test_passed || false,
              certified: training.certified || false,
              certified_at: training.certified_at
            }
          }
        }

        onboardingProgress = {
          token_status: inviteToken.status,
          deadline_at: inviteToken.deadline_at,
          days_remaining: daysRemaining,
          user_created: !!inviteToken.user_id,
          training: trainingProgress
        }
      }
    }

    return NextResponse.json({
      success: true,
      hasActiveRequest: true,
      changeRequest: activeRequest,
      onboardingProgress
    })

  } catch (e: any) {
    console.error('Error in delegate-change/status:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
