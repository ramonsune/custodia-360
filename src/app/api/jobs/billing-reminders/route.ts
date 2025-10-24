import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function isInternal(req: Request) {
  const h = req.headers.get('x-internal-cron')
  // Netlify Scheduled Functions: establece este header en la llamada
  return h === '1'
}

export async function POST(req: Request) {
  if (!isInternal(req)) {
    return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), {
      status: 403,
      headers: { 'content-type': 'application/json' }
    })
  }

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ ok: false, error: 'Supabase credentials missing' }, { status: 500 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )

    const notes: string[] = []
    let processed = 0

    // Buscar suscripciones activas
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')

    if (error) {
      console.error('Error fetching subscriptions:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ ok: true, processed: 0, notes: ['No active subscriptions'] })
    }

    const now = new Date()

    for (const sub of subscriptions) {
      const endDate = new Date(sub.current_period_end)
      const daysRemaining = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      // Recordatorio a los 5 meses (150 días aprox, pero usamos 30 días = 1 mes restante)
      if (daysRemaining === 30) {
        // Crear job de email
        const { error: jobError } = await supabase
          .from('message_jobs')
          .insert({
            entity_id: sub.entity_id,
            template_slug: 'billing-5m-reminder',
            channel: 'email',
            context: JSON.stringify({ days_remaining: daysRemaining }),
            status: 'queued',
            scheduled_at: now.toISOString()
          })

        if (!jobError) {
          processed++
          notes.push(`5-month reminder for entity ${sub.entity_id}`)
        }
      }

      // Recordatorio a los 11 meses (330 días aprox, pero usamos 7 días = 1 semana restante)
      if (daysRemaining === 7) {
        const { error: jobError } = await supabase
          .from('message_jobs')
          .insert({
            entity_id: sub.entity_id,
            template_slug: 'billing-11m-reminder',
            channel: 'email',
            context: JSON.stringify({ days_remaining: daysRemaining }),
            status: 'queued',
            scheduled_at: now.toISOString()
          })

        if (!jobError) {
          processed++
          notes.push(`11-month reminder for entity ${sub.entity_id}`)
        }
      }
    }

    return NextResponse.json({ ok: true, processed, notes })
  } catch (e: any) {
    console.error('Billing reminders error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
