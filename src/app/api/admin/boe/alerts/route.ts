import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const onlyUnread = searchParams.get('unread') === 'true'

    let query = supabase
      .from('boe_alerts')
      .select('*')
      .order('created_at', { ascending: false })

    if (onlyUnread) {
      query = query.eq('leido', false)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching alerts:', error)
      return NextResponse.json({
        success: false,
        error: 'Error obteniendo alertas'
      }, { status: 500 })
    }

    // Get unread count
    const { data: unreadData } = await supabase
      .from('boe_alerts')
      .select('id', { count: 'exact', head: true })
      .eq('leido', false)

    return NextResponse.json({
      success: true,
      alerts: data || [],
      unreadCount: unreadData?.length || 0
    })
  } catch (error) {
    console.error('Error in alerts endpoint:', error)
    return NextResponse.json({
      success: false,
      error: 'Error en el servidor'
    }, { status: 500 })
  }
}
