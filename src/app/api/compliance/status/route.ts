import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const entityId = searchParams.get('entityId')

    if (!entityId) {
      return NextResponse.json({ error: 'entityId requerido' }, { status: 400 })
    }

    // Simular datos de compliance (en producción, consultar Supabase)
    // Para demo: simular que ya se completó la configuración inicial
    const compliance = {
      channel_done: true,
      channel_verified: true,
      riskmap_done: true,
      penales_done: true,
      blocked: false,
      start_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Hace 5 días
      deadline_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 días restantes
      days_remaining: 25,
      isFirstTime: false,
      config_completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }

    // Determinar isFirstTime basándose en si se ha completado la configuración
    // isFirstTime = true si NUNCA han completado la configuración mínima obligatoria
    // Consideramos que ya NO es primera vez si:
    // - Han configurado el canal O lo han pospuesto
    // - Han leído el mapa de riesgos
    // - Han declarado el certificado de penales O lo han pospuesto
    const hasCompletedMinimum =
      (compliance.channel_done || compliance.channel_postponed) &&
      compliance.riskmap_done &&
      (compliance.penales_done || compliance.penales_postponed)

    compliance.isFirstTime = !hasCompletedMinimum

    return NextResponse.json({
      success: true,
      compliance
    })
  } catch (error: any) {
    console.error('Error en compliance/status:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
