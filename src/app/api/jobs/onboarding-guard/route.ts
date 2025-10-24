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

    const now = new Date()

    // Buscar invitaciones pendientes con deadline próximo o vencido
    const { data: invites, error } = await supabase
      .from('entity_invite_tokens')
      .select('*')
      .eq('status', 'pending')
      .not('deadline_at', 'is', null)

    if (error) {
      console.error('Error fetching invites:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    if (!invites || invites.length === 0) {
      return NextResponse.json({ ok: true, processed: 0, notes: ['No pending invites'] })
    }

    for (const invite of invites) {
      const deadline = new Date(invite.deadline_at)
      const daysRemaining = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      // Vencido
      if (daysRemaining < 0) {
        await supabase
          .from('entity_invite_tokens')
          .update({ status: 'expired', updated_at: now.toISOString() })
          .eq('id', invite.id)

        processed++
        notes.push(`Expired invite ${invite.id} for entity ${invite.entity_id}`)
      }
      // Recordatorio a 7 días
      else if (daysRemaining === 7) {
        const { error: jobError } = await supabase
          .from('message_jobs')
          .insert({
            entity_id: invite.entity_id,
            template_slug: 'onboarding-delay',
            channel: 'email',
            context: JSON.stringify({ days_remaining: daysRemaining }),
            status: 'queued',
            scheduled_at: now.toISOString()
          })

        if (!jobError) {
          processed++
          notes.push(`7-day reminder for invite ${invite.id}`)
        }
      }
      // Recordatorio a 3 días
      else if (daysRemaining === 3) {
        const { error: jobError } = await supabase
          .from('message_jobs')
          .insert({
            entity_id: invite.entity_id,
            template_slug: 'onboarding-delay',
            channel: 'email',
            context: JSON.stringify({ days_remaining: daysRemaining }),
            status: 'queued',
            scheduled_at: now.toISOString()
          })

        if (!jobError) {
          processed++
          notes.push(`3-day reminder for invite ${invite.id}`)
        }
      }
    }

    return NextResponse.json({ ok: true, processed, notes })
  } catch (e: any) {
    console.error('Onboarding guard error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
