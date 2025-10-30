import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isTokenValid } from '@/lib/onboarding/roles'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ ok: false, error: 'Token requerido' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Buscar token en entity_invite_tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('entity_invite_tokens')
      .select('*')
      .eq('token', token)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({
        ok: false,
        error: 'Token no válido o expirado'
      }, { status: 404 })
    }

    // Validar estado del token
    if (!isTokenValid(tokenData)) {
      return NextResponse.json({
        ok: false,
        error: 'Token expirado o ya utilizado'
      }, { status: 400 })
    }

    // Cargar datos de la entidad
    const { data: entityData, error: entityError } = await supabase
      .from('entities')
      .select('id, nombre, sector_code, canal_tipo, canal_valor, created_at')
      .eq('id', tokenData.entity_id)
      .single()

    if (entityError || !entityData) {
      return NextResponse.json({
        ok: false,
        error: 'Entidad no encontrada'
      }, { status: 404 })
    }

    // Verificar si ya existe persona asociada a este token
    const { data: existingPerson } = await supabase
      .from('entity_people')
      .select('id, nombre, tipo, estado')
      .eq('entity_id', tokenData.entity_id)
      .eq('invited_token', token)
      .maybeSingle()

    return NextResponse.json({
      ok: true,
      token: {
        id: tokenData.id,
        token: tokenData.token,
        status: tokenData.status,
        created_at: tokenData.created_at,
        deadline_at: tokenData.deadline_at,
        invited_at: tokenData.invited_at
      },
      entity: {
        id: entityData.id,
        nombre: entityData.nombre,
        sector_code: entityData.sector_code,
        has_channel: !!(entityData.canal_tipo && entityData.canal_valor),
        channel: entityData.canal_tipo && entityData.canal_valor ? {
          tipo: entityData.canal_tipo,
          valor: entityData.canal_valor
        } : null
      },
      existing_person: existingPerson || null
    })

  } catch (error: any) {
    console.error('Error verificando token:', error)
    return NextResponse.json({
      ok: false,
      error: 'Error del servidor'
    }, { status: 500 })
  }
}
