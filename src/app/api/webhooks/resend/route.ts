import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('resend-signature')

    // Validar firma si existe RESEND_WEBHOOK_SECRET
    if (process.env.RESEND_WEBHOOK_SECRET && signature) {
      const hmac = crypto.createHmac('sha256', process.env.RESEND_WEBHOOK_SECRET)
      const digest = hmac.update(body).digest('hex')

      if (signature !== digest) {
        console.error('[Resend Webhook] Invalid signature')
        // Devolver 200 para evitar reintentos
        return NextResponse.json({ ok: true, warning: 'Invalid signature' })
      }
    }

    const payload = JSON.parse(body)

    // Extraer datos del evento
    const eventType = payload.type || 'unknown'
    const data = payload.data || {}

    const emailId = data.email_id || data.id || null
    const toEmail = Array.isArray(data.to) ? data.to[0] : data.to || null
    const fromEmail = data.from || process.env.NOTIFY_EMAIL_FROM || null
    const subject = data.subject || null
    const timestamp = payload.created_at || new Date().toISOString()
    const error = data.error || null

    // Crear cliente Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    // Insertar o actualizar evento
    const eventData = {
      event_type: eventType,
      email_id: emailId,
      to_email: toEmail,
      from_email: fromEmail,
      subject: subject,
      timestamp: timestamp,
      error: error,
      raw_data: payload
    }

    let dbError
    if (emailId) {
      // Upsert si hay email_id
      const { error: upsertError } = await supabase
        .from('email_events')
        .upsert(eventData, {
          onConflict: 'email_id',
          ignoreDuplicates: false
        })
      dbError = upsertError
    } else {
      // Insert simple si no hay email_id
      const { error: insertError } = await supabase
        .from('email_events')
        .insert(eventData)
      dbError = insertError
    }

    if (dbError) {
      console.error('[Resend Webhook] Error saving to Supabase:', dbError)
      // Devolver 200 para evitar reintentos (ya logueamos el error)
      return NextResponse.json({ ok: true, warning: dbError.message })
    }

    console.log(`[Resend Webhook] Event ${eventType} saved for ${toEmail}`)

    return NextResponse.json({ ok: true })

  } catch (error: any) {
    console.error('[Resend Webhook] Error:', error)
    // Devolver 200 para evitar reintentos
    return NextResponse.json({ ok: true, warning: error.message || 'Internal error' })
  }
}
