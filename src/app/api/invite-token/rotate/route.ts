import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  const { entityId } = await req.json().catch(() => ({}))
  if (!entityId) return NextResponse.json({ ok: false, error: 'entityId requerido' }, { status: 400 })

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ ok: false, error: 'Configuración de base de datos no disponible' }, { status: 500 })
  }

  const supa = createClient(supabaseUrl, supabaseKey)

  // Rotar token (cambia el valor, mantiene activo)
  const newToken = randomUUID()
  const { error } = await supa
    .from('entity_invite_tokens')
    .upsert({ entity_id: entityId, token: newToken, active: true })

  if (error) {
    console.error('Error rotando token:', error)
    return NextResponse.json({ ok: false, error: String(error.message) }, { status: 500 })
  }

  const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/onboarding/${entityId}/${newToken}`

  return NextResponse.json({ ok: true, token: newToken, url })
}
