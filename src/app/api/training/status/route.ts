import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const personId = searchParams.get('personId')
    const entityId = searchParams.get('entityId')

    if (!personId || !entityId) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    console.log('📥 [TRAINING-STATUS] GET:', { personId, entityId })

    // Simular obtención desde localStorage (el cliente debe manejar esto)
    // Devolver un status por defecto si no existe
    const status = {
      id: `training_${personId}_${entityId}`,
      person_id: personId,
      entity_id: entityId,
      course_code: 'delegado_principal_lopivi',
      modules_completed: 0,
      modules_data: [],
      test_passed: false,
      certified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      status,
      _isLocal: true
    })

  } catch (error: any) {
    console.error('❌ [TRAINING-STATUS] Error GET:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { personId, entityId, updates } = body

    if (!personId || !entityId || !updates) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    console.log('📥 [TRAINING-STATUS] POST:', { personId, entityId, updates })

    // Simular actualización (el cliente debe persistir en localStorage)
    const status = {
      id: `training_${personId}_${entityId}`,
      person_id: personId,
      entity_id: entityId,
      course_code: 'delegado_principal_lopivi',
      ...updates,
      updated_at: new Date().toISOString()
    }

    console.log('✅ [TRAINING-STATUS] Actualizado:', status)

    return NextResponse.json({
      success: true,
      status,
      _isLocal: true,
      _shouldPersist: { key: `training_status_${personId}_${entityId}`, data: status }
    })

  } catch (error: any) {
    console.error('❌ [TRAINING-STATUS] Error POST:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
