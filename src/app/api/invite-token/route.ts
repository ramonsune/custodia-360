import { NextRequest, NextResponse } from 'next/server'
import { ensureInviteToken } from '@/lib/invite/ensureInviteToken'
import { mockDB } from '@/lib/mock/mockData'

function absoluteUrl(path: string) {
  const base = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000'
  return `${base}${path.startsWith('/') ? path : '/' + path}`
}

// GET /api/invite-token?entityId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const entityId = searchParams.get('entityId')
  if (!entityId) return NextResponse.json({ ok: false, error: 'entityId requerido' }, { status: 400 })

  try {
    // 🎭 MODO DESARROLLO LOCAL (sin Supabase)
    if (mockDB.isDevMode()) {
      console.log('🎭 [INVITE-TOKEN] Modo desarrollo - usando token mock para:', entityId)
      const token = mockDB.ensureInviteToken(entityId)
      const url = absoluteUrl(`/onboarding/${entityId}/${token}`)
      console.log('✅ [INVITE-TOKEN] Token mock generado:', url)
      return NextResponse.json({ ok: true, token, url })
    }

    // 🔌 MODO PRODUCCIÓN (con Supabase)
    const token = await ensureInviteToken(entityId)
    const url = absoluteUrl(`/onboarding/${entityId}/${token}`)
    return NextResponse.json({ ok: true, token, url })
  } catch (e: any) {
    console.error('Error en invite-token GET:', e)
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}

// POST /api/invite-token  body:{entityId}
export async function POST(req: NextRequest) {
  const { entityId } = await req.json().catch(() => ({}))
  if (!entityId) return NextResponse.json({ ok: false, error: 'entityId requerido' }, { status: 400 })

  try {
    // 🎭 MODO DESARROLLO LOCAL (sin Supabase)
    if (mockDB.isDevMode()) {
      console.log('🎭 [INVITE-TOKEN POST] Modo desarrollo - usando token mock para:', entityId)
      const token = mockDB.ensureInviteToken(entityId)
      const url = absoluteUrl(`/onboarding/${entityId}/${token}`)
      console.log('✅ [INVITE-TOKEN POST] Token mock generado:', url)
      return NextResponse.json({ ok: true, token, url })
    }

    // 🔌 MODO PRODUCCIÓN (con Supabase)
    const token = await ensureInviteToken(entityId)
    const url = absoluteUrl(`/onboarding/${entityId}/${token}`)
    return NextResponse.json({ ok: true, token, url })
  } catch (e: any) {
    console.error('Error en invite-token POST:', e)
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}
