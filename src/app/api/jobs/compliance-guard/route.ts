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

    // Buscar compliance incompleto
    const { data: compliances, error } = await supabase
      .from('entity_compliance')
      .select('*')
      .eq('blocked', false)

    if (error) {
      console.error('Error fetching compliances:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    if (!compliances || compliances.length === 0) {
      return NextResponse.json({ ok: true, processed: 0, notes: ['No compliances to check'] })
    }

    for (const comp of compliances) {
      const deadline = new Date(comp.deadline_at)
      const isExpired = deadline < now

      // Verificar si hay pasos pospuestos que ya vencieron
      const hasPendingSteps = (comp.channel_postponed && !comp.channel_done) ||
                              (comp.penales_postponed && !comp.penales_done)

      if (isExpired && hasPendingSteps) {
        // Bloquear entidad
        await supabase
          .from('entity_compliance')
          .update({ blocked: true, updated_at: now.toISOString() })
          .eq('id', comp.id)

        // Enviar notificación
        const { error: jobError } = await supabase
          .from('message_jobs')
          .insert({
            entity_id: comp.entity_id,
            template_slug: 'compliance-blocked',
            channel: 'email',
            context: JSON.stringify({ deadline: comp.deadline_at }),
            status: 'queued',
            scheduled_at: now.toISOString()
          })

        if (!jobError) {
          processed++
          notes.push(`Blocked entity ${comp.entity_id} - deadline expired with pending steps`)
        }
      }
      // Recordatorio a 7 días del vencimiento
      else if (!isExpired && hasPendingSteps) {
        const daysRemaining = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysRemaining === 7) {
          const { error: jobError } = await supabase
            .from('message_jobs')
            .insert({
              entity_id: comp.entity_id,
              template_slug: 'compliance-blocked',
              channel: 'email',
              context: JSON.stringify({ days_remaining: daysRemaining }),
              status: 'queued',
              scheduled_at: now.toISOString()
            })

          if (!jobError) {
            processed++
            notes.push(`7-day compliance warning for entity ${comp.entity_id}`)
          }
        }
      }
    }

    return NextResponse.json({ ok: true, processed, notes })
  } catch (e: any) {
    console.error('Compliance guard error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
