import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Validar formato de token: tok_<timestamp>_<random> o UUID v4
function isValidTokenFormat(token: string): boolean {
  // Formato personalizado: tok_1234567890_abc123xyz
  const customFormat = /^tok_\d+_[A-Za-z0-9]+$/
  // Formato UUID v4
  const uuidFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  return customFormat.test(token) || uuidFormat.test(token)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    console.log('🔍 [RESOLVE TOKEN] Request recibido:', { token })

    // Validar que existe el token
    if (!token) {
      console.error('❌ [RESOLVE TOKEN] Token no proporcionado')
      return NextResponse.json(
        { ok: false, reason: 'token_required' },
        { status: 400 }
      )
    }

    // Validar formato del token
    if (!isValidTokenFormat(token)) {
      console.error('❌ [RESOLVE TOKEN] Formato de token inválido:', token)
      return NextResponse.json(
        { ok: false, reason: 'invalid_format' },
        { status: 400 }
      )
    }

    // Inicializar Supabase con service_role (server-side)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [RESOLVE TOKEN] Variables de entorno de Supabase no configuradas')
      return NextResponse.json(
        { ok: false, reason: 'server_error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('📡 [RESOLVE TOKEN] Consultando Supabase...')

    // Consultar token en la tabla entity_invite_tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('entity_invite_tokens')
      .select('token, entity_id, active, expires_at, created_at')
      .eq('token', token)
      .eq('active', true)
      .single()

    if (tokenError || !tokenData) {
      console.error('❌ [RESOLVE TOKEN] Token no encontrado o inactivo:', tokenError)
      return NextResponse.json(
        { ok: false, reason: 'invalid_or_expired' },
        { status: 404 }
      )
    }

    // Verificar si el token ha expirado
    if (tokenData.expires_at) {
      const expiresAt = new Date(tokenData.expires_at)
      const now = new Date()

      if (expiresAt <= now) {
        console.error('❌ [RESOLVE TOKEN] Token expirado:', { expires_at: tokenData.expires_at })
        return NextResponse.json(
          { ok: false, reason: 'invalid_or_expired' },
          { status: 404 }
        )
      }
    }

    console.log('✅ [RESOLVE TOKEN] Token válido, consultando entidad:', tokenData.entity_id)

    // Consultar datos de la entidad
    const { data: entityData, error: entityError } = await supabase
      .from('entities')
      .select('id, nombre, sector_code, canal_tipo, canal_valor')
      .eq('id', tokenData.entity_id)
      .single()

    if (entityError || !entityData) {
      console.error('❌ [RESOLVE TOKEN] Entidad no encontrada:', entityError)
      return NextResponse.json(
        { ok: false, reason: 'entity_not_found' },
        { status: 404 }
      )
    }

    console.log('✅ [RESOLVE TOKEN] Entidad encontrada:', entityData.nombre)

    // Respuesta exitosa
    return NextResponse.json({
      ok: true,
      token: tokenData.token,
      entity_id: tokenData.entity_id,
      entity: {
        id: entityData.id,
        nombre: entityData.nombre,
        sector_code: entityData.sector_code,
        canal_tipo: entityData.canal_tipo || null,
        canal_valor: entityData.canal_valor || null
      },
      expires_at: tokenData.expires_at,
      created_at: tokenData.created_at
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    })

  } catch (error: any) {
    console.error('❌ [RESOLVE TOKEN] Error inesperado:', error)
    return NextResponse.json(
      { ok: false, reason: 'server_error', error: error.message },
      { status: 500 }
    )
  }
}
