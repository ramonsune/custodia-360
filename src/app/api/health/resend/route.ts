import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const resendKey = process.env.RESEND_API_KEY
    const notifyFrom = process.env.NOTIFY_EMAIL_FROM

    if (!resendKey) {
      return NextResponse.json({ ok: false, error: 'RESEND_API_KEY not configured' }, { status: 500 })
    }

    if (!notifyFrom) {
      return NextResponse.json({ ok: false, error: 'NOTIFY_EMAIL_FROM not configured' }, { status: 500 })
    }

    // Provider ready (no enviar email real)
    return NextResponse.json({
      ok: true,
      provider_ready: true,
      from: notifyFrom
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
