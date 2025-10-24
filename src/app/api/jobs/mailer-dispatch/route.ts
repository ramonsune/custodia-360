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

    const now = new Date().toISOString()

    // Buscar jobs pendientes de envío
    const { data: jobs, error } = await supabase
      .from('message_jobs')
      .select('*')
      .eq('status', 'queued')
      .lte('scheduled_at', now)
      .limit(50)

    if (error) {
      console.error('Error fetching queued jobs:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ ok: true, processed: 0, notes: ['No queued jobs to process'] })
    }

    const notes: string[] = []
    let processed = 0

    // Procesar cada job (simplificado - en producción usar Resend)
    for (const job of jobs) {
      // Marcar como procesando
      await supabase
        .from('message_jobs')
        .update({ status: 'processing', updated_at: new Date().toISOString() })
        .eq('id', job.id)

      // Aquí iría la lógica de envío con Resend
      // Por ahora, solo marcamos como enviado
      const sent = true // Placeholder

      if (sent) {
        await supabase
          .from('message_jobs')
          .update({ status: 'sent', sent_at: new Date().toISOString() })
          .eq('id', job.id)

        processed++
        notes.push(`Sent job ${job.id} (template: ${job.template_slug})`)
      } else {
        await supabase
          .from('message_jobs')
          .update({ status: 'failed' })
          .eq('id', job.id)

        notes.push(`Failed job ${job.id}`)
      }
    }

    return NextResponse.json({ ok: true, processed, notes })
  } catch (e: any) {
    console.error('Mailer dispatch error:', e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
