import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertId, markAll } = body

    if (markAll) {
      // Mark all alerts as read
      const { error } = await supabase
        .from('boe_alerts')
        .update({ leido: true })
        .eq('leido', false)

      if (error) {
        console.error('Error marking all alerts as read:', error)
        return NextResponse.json({
          success: false,
          error: 'Error marcando alertas como leídas'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Todas las alertas marcadas como leídas'
      })
    } else if (alertId) {
      // Mark specific alert as read
      const { error } = await supabase
        .from('boe_alerts')
        .update({ leido: true })
        .eq('id', alertId)

      if (error) {
        console.error('Error marking alert as read:', error)
        return NextResponse.json({
          success: false,
          error: 'Error marcando alerta como leída'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Alerta marcada como leída'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Se requiere alertId o markAll'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in mark-read endpoint:', error)
    return NextResponse.json({
      success: false,
      error: 'Error en el servidor'
    }, { status: 500 })
  }
}
