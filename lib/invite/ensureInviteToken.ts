import { createClient } from '@supabase/supabase-js'

export async function ensureInviteToken(entityId: string) {
  if (!entityId) throw new Error('entityId requerido')

  const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // 1) Intentar leer existente
  const { data: existing, error: readErr } = await supa
    .from('entity_invite_tokens')
    .select('token, active')
    .eq('entity_id', entityId)
    .maybeSingle()

  if (readErr) throw readErr
  if (existing && existing.active !== false) {
    return existing.token as string
  }

  // 2) Si no existe, crear de forma idempotente
  const { data: inserted, error: insErr } = await supa
    .from('entity_invite_tokens')
    .insert({ entity_id: entityId })
    .select('token')
    .single()

  if (insErr && !String(insErr.message).includes('duplicate key')) {
    throw insErr
  }

  // 3) Si hubo condición de carrera (duplicate key), leer de nuevo
  if (!inserted) {
    const { data: after, error: afterErr } = await supa
      .from('entity_invite_tokens')
      .select('token')
      .eq('entity_id', entityId)
      .maybeSingle()
    if (afterErr || !after) throw afterErr || new Error('No se pudo obtener token')
    return after.token as string
  }

  return inserted.token as string
}
