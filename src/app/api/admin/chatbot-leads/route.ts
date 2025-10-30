import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // pending, contacted, resolved, spam
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('chatbot_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: leads, error } = await query

    if (error) {
      console.error('Error fetching chatbot leads:', error)
      return NextResponse.json(
        { error: 'Error al obtener leads' },
        { status: 500 }
      )
    }

    // Estadísticas
    const { data: stats } = await supabase
      .from('chatbot_leads')
      .select('status')

    const statistics = {
      total: stats?.length || 0,
      pending: stats?.filter(l => l.status === 'pending').length || 0,
      contacted: stats?.filter(l => l.status === 'contacted').length || 0,
      resolved: stats?.filter(l => l.status === 'resolved').length || 0,
      spam: stats?.filter(l => l.status === 'spam').length || 0
    }

    return NextResponse.json({
      leads,
      statistics
    })

  } catch (error) {
    console.error('Error in chatbot-leads API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, admin_notes } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: id, status' },
        { status: 400 }
      )
    }

    const updateData: any = { status }

    if (status === 'contacted' && !admin_notes) {
      updateData.contacted_at = new Date().toISOString()
    }

    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString()
    }

    if (admin_notes) {
      updateData.admin_notes = admin_notes
    }

    const { data, error } = await supabase
      .from('chatbot_leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating lead:', error)
      return NextResponse.json(
        { error: 'Error al actualizar lead' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      lead: data
    })

  } catch (error) {
    console.error('Error in chatbot-leads PATCH:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
