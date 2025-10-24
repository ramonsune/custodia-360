import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    ok: true,
    node: process.version,
    strict: String(process.env.NEXT_BUILD_STRICT || "false"),
    has: {
      APP_BASE_URL: !!process.env.APP_BASE_URL,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      NOTIFY_EMAIL_FROM: !!process.env.NOTIFY_EMAIL_FROM,
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
    }
  })
}
