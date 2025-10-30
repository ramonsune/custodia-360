/**
 * API ENDPOINT: POST /api/training/complete
 *
 * Completa la formación LOPIVI y promociona al usuario de FORMACION a DELEGADO
 *
 * Flujo:
 * 1. Verificar que el usuario completó todos los pasos
 * 2. Marcar training_progress como completado
 * 3. Actualizar rol en entity_user_roles de FORMACION a DELEGADO
 * 4. Actualizar onboarding_process status a 'trained'
 * 5. Registrar audit events
 * 6. Responder OK → Front redirige a /dashboard-delegado
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logAuditEvent, logError } from '@/lib/audit-logger'

// Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, entity_id } = body

    // Validaciones
    if (!user_id || !entity_id) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: user_id, entity_id' },
        { status: 400 }
      )
    }

    console.log('[TRAINING-COMPLETE] Completando formación:', { user_id, entity_id })

    // 1. Verificar training_progress
    const { data: progress, error: progressError } = await supabaseAdmin
      .from('training_progress')
      .select('*')
      .eq('user_id', user_id)
      .eq('entity_id', entity_id)
      .single()

    if (progressError || !progress) {
      console.error('[TRAINING-COMPLETE] Error obteniendo progreso:', progressError)
      return NextResponse.json(
        { error: 'No se encontró progreso de formación' },
        { status: 404 }
      )
    }

    // Verificar que completó todos los pasos
    if (progress.steps_completed < progress.total_steps) {
      return NextResponse.json(
        {
          error: `Formación incompleta: ${progress.steps_completed}/${progress.total_steps} pasos completados`,
          progress
        },
        { status: 400 }
      )
    }

    // Verificar si ya está completado
    if (progress.is_completed) {
      console.log('[TRAINING-COMPLETE] Ya completado, retornando OK')
      return NextResponse.json({
        success: true,
        message: 'Formación ya completada',
        already_completed: true
      })
    }

    // 2. Marcar training_progress como completado
    const { error: updateProgressError } = await supabaseAdmin
      .from('training_progress')
      .update({
        is_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id)
      .eq('entity_id', entity_id)

    if (updateProgressError) {
      console.error('[TRAINING-COMPLETE] Error actualizando progreso:', updateProgressError)
      throw new Error('Error marcando formación como completada')
    }

    console.log('[TRAINING-COMPLETE] ✅ Training progress marcado como completado')

    // 3. Actualizar rol de FORMACION → DELEGADO
    const { error: roleError } = await supabaseAdmin
      .from('entity_user_roles')
      .update({
        role: 'DELEGADO',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id)
      .eq('entity_id', entity_id)
      .eq('role', 'FORMACION')

    if (roleError) {
      console.error('[TRAINING-COMPLETE] ⚠️ Error actualizando rol:', roleError)
      // No fallar, seguir adelante
    } else {
      console.log('[TRAINING-COMPLETE] ✅ Rol promocionado: FORMACION → DELEGADO')
    }

    // 4. Buscar onboarding_process para actualizar
    const { data: onboardingProcess } = await supabaseAdmin
      .from('onboarding_process')
      .select('id')
      .eq('delegate_user_id', user_id)
      .eq('entity_id', entity_id)
      .single()

    if (onboardingProcess) {
      // Actualizar status a 'trained'
      await supabaseAdmin
        .from('onboarding_process')
        .update({
          status: 'trained',
          updated_at: new Date().toISOString()
        })
        .eq('id', onboardingProcess.id)

      // Audit events
      await logAuditEvent({
        processId: onboardingProcess.id,
        eventType: 'training.completed',
        level: 'INFO',
        payload: {
          user_id,
          entity_id,
          completed_at: new Date().toISOString()
        }
      })

      await logAuditEvent({
        processId: onboardingProcess.id,
        eventType: 'role.promoted',
        level: 'INFO',
        payload: {
          user_id,
          from: 'FORMACION',
          to: 'DELEGADO'
        }
      })

      console.log('[TRAINING-COMPLETE] ✅ Onboarding process actualizado a "trained"')
    }

    // Responder éxito
    return NextResponse.json({
      success: true,
      message: 'Formación completada exitosamente',
      role: 'DELEGADO',
      redirect: '/dashboard-delegado'
    })

  } catch (error: any) {
    console.error('[TRAINING-COMPLETE] ❌ Error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al completar formación' },
      { status: 500 }
    )
  }
}
