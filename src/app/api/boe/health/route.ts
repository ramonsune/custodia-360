import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * GET /api/boe/health
 * Devuelve el estado de salud del rastreador BOE
 */
export async function GET() {
  try {
    // Verificar última ejecución del check
    const { data: lastCheck, error: checkError } = await supabase
      .from('audit_events')
      .select('created_at, payload')
      .eq('area', 'boe')
      .in('event_type', ['check.executed', 'change.detected', 'nochange'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error verificando último check:', checkError)
    }

    // Verificar si hay cambios pendientes
    const { data: changes, error: changesError } = await supabase
      .from('boe_changes')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)

    const hasChanges = changes && changes.length > 0

    // Calcular tiempo desde último check
    let lastCheckDate: Date | null = null
    let minutesSinceLastCheck: number | null = null

    if (lastCheck?.created_at) {
      lastCheckDate = new Date(lastCheck.created_at)
      minutesSinceLastCheck = Math.floor(
        (Date.now() - lastCheckDate.getTime()) / 1000 / 60
      )
    }

    // Determinar estado general
    const isHealthy = minutesSinceLastCheck !== null && minutesSinceLastCheck < 1440 // < 24h
    const state = isHealthy ? 'healthy' : (lastCheckDate ? 'stale' : 'unknown')

    return NextResponse.json({
      ok: true,
      state,
      lastCheck: lastCheckDate?.toISOString() || null,
      minutesSinceLastCheck,
      hasRecentChanges: hasChanges,
      message: getHealthMessage(state, minutesSinceLastCheck)
    })

  } catch (error: any) {
    console.error('Error en BOE health check:', error)
    return NextResponse.json(
      {
        ok: false,
        state: 'error',
        error: error.message,
        lastCheck: null
      },
      { status: 500 }
    )
  }
}

function getHealthMessage(state: string, minutes: number | null): string {
  if (state === 'healthy') {
    return `Rastreador funcionando correctamente (último check hace ${minutes} min)`
  }

  if (state === 'stale') {
    const hours = Math.floor((minutes || 0) / 60)
    return `Rastreador inactivo (último check hace ${hours} horas)`
  }

  return 'No hay información de checks previos'
}
