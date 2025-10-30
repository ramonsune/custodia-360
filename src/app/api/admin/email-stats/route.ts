import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const period = parseInt(url.searchParams.get('period') || '7')

    const supa = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Calcular fecha límite
    const dateLimit = new Date()
    dateLimit.setDate(dateLimit.getDate() - period)

    // Cargar eventos recientes
    const { data: events, error: eventsError } = await supa
      .from('email_events')
      .select('*')
      .gte('created_at', dateLimit.toISOString())
      .order('created_at', { ascending: false })
      .limit(200)

    if (eventsError) {
      console.error('Error loading email_events:', eventsError)
      return NextResponse.json({
        ok: false,
        error: eventsError.message,
        tableExists: eventsError.message.includes('does not exist') ? false : true
      }, { status: eventsError.message.includes('does not exist') ? 404 : 500 })
    }

    // Calcular stats
    const stats = {
      sent: events?.filter(e => e.event === 'sent').length || 0,
      delivered: events?.filter(e => e.event === 'delivered').length || 0,
      opened: events?.filter(e => e.event === 'opened').length || 0,
      clicked: events?.filter(e => e.event === 'clicked').length || 0,
      bounced: events?.filter(e => e.event === 'bounced').length || 0,
      complained: events?.filter(e => e.event === 'complained').length || 0,
    }

    // Cargar stats de message_jobs
    const { data: jobs } = await supa
      .from('message_jobs')
      .select('status')

    const queueStats = {
      queued: jobs?.filter(j => j.status === 'queued').length || 0,
      processing: jobs?.filter(j => j.status === 'processing').length || 0,
      sent: jobs?.filter(j => j.status === 'sent').length || 0,
      failed: jobs?.filter(j => j.status === 'failed').length || 0,
    }

    return NextResponse.json({
      ok: true,
      tableExists: true,
      stats,
      queueStats,
      events: events || [],
      period
    })
  } catch (error: any) {
    console.error('Error in email-stats API:', error)
    return NextResponse.json({
      ok: false,
      error: error.message
    }, { status: 500 })
  }
}
