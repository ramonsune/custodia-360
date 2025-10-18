import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // TODO: Implementar guard de autenticación admin
    // const { isAdmin, adminEmail } = await checkAdminAuth(request)
    // if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminEmail = 'admin@custodia360.es' // Temporal, debe venir de auth

    const body = await request.json()
    const { entityId, value } = body

    // Validaciones
    if (!entityId) {
      return NextResponse.json({ error: 'entityId is required' }, { status: 400 })
    }

    if (typeof value !== 'boolean') {
      return NextResponse.json({ error: 'value must be boolean' }, { status: 400 })
    }

    // Obtener estado actual antes del cambio
    const { data: entityBefore, error: fetchError } = await supabase
      .from('entities')
      .select('nombre, kit_comunicacion')
      .eq('id', entityId)
      .single()

    if (fetchError || !entityBefore) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 })
    }

    const valorAnterior = entityBefore.kit_comunicacion || false

    // Actualizar el campo kit_comunicacion
    const { error: updateError } = await supabase
      .from('entities')
      .update({ kit_comunicacion: value })
      .eq('id', entityId)

    if (updateError) {
      console.error('Error updating kit_comunicacion:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Registrar la acción en el log
    const { error: logError } = await supabase
      .from('admin_actions_log')
      .insert({
        actor: adminEmail,
        entity_id: entityId,
        action: 'kit_comm_toggle',
        metadata: {
          entity_name: entityBefore.nombre,
          previous_value: valorAnterior,
          new_value: value,
          changed_at: new Date().toISOString()
        }
      })

    if (logError) {
      console.warn('Error logging action (non-critical):', logError)
      // No bloqueamos la respuesta por un error en el log
    }

    console.log(`✅ Kit Comunicación ${value ? 'ACTIVADO' : 'DESACTIVADO'} para entidad: ${entityBefore.nombre} (${entityId})`)

    return NextResponse.json({
      success: true,
      entityId,
      previousValue: valorAnterior,
      newValue: value,
      message: `Kit de Comunicación ${value ? 'activado' : 'desactivado'} correctamente`
    })

  } catch (err: any) {
    console.error('Unexpected error in kit-comm/toggle:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
