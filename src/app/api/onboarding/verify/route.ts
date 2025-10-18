import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { mockDB } from '@/lib/mock/mockData'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
  try {
    const { entityId, token } = await request.json()

    console.log('🔍 [VERIFY] Verificando token:', { entityId, token })

    if (!entityId || !token) {
      console.log('❌ [VERIFY] Faltan parámetros')
      return NextResponse.json(
        { success: false, error: 'EntityId y token requeridos' },
        { status: 400 }
      )
    }

    // 🎭 MODO DESARROLLO LOCAL (sin Supabase)
    if (mockDB.isDevMode()) {
      console.log('🎭 [VERIFY] Modo desarrollo - usando datos mock')

      const tokenData = mockDB.getTokenByEntityAndToken(entityId, token)

      if (!tokenData) {
        console.log('❌ [VERIFY] Token mock no encontrado')
        return NextResponse.json(
          { success: false, error: 'Token no encontrado en sistema mock' },
          { status: 403 }
        )
      }

      const entity = mockDB.getEntity(entityId)

      if (!entity) {
        console.log('❌ [VERIFY] Entidad mock no encontrada')
        return NextResponse.json(
          { success: false, error: 'Entidad no encontrada en sistema mock' },
          { status: 404 }
        )
      }

      console.log('✅ [VERIFY] Token mock válido para:', entity.nombre)

      return NextResponse.json({
        success: true,
        valid: true,
        entity: {
          id: entity.id,
          nombre: entity.nombre,
          sector_code: entity.sector_code
        }
      })
    }

    // 🔌 MODO PRODUCCIÓN (con Supabase)
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ [VERIFY] Variables de entorno de Supabase no configuradas')
      return NextResponse.json(
        { success: false, error: 'Configuración de base de datos no disponible' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Verificar token directamente en la tabla
    console.log('🔎 [VERIFY] Buscando en entity_invite_tokens...')
    const { data: tokenData, error: tokenError } = await supabase
      .from('entity_invite_tokens')
      .select('active')
      .eq('entity_id', entityId)
      .eq('token', token)
      .single()

    console.log('📊 [VERIFY] Resultado de búsqueda:', {
      tokenData,
      tokenError: tokenError?.message,
      errorCode: tokenError?.code
    })

    if (tokenError) {
      console.log('❌ [VERIFY] Error en búsqueda de token:', tokenError)
      return NextResponse.json(
        { success: false, error: 'Token no encontrado en la base de datos' },
        { status: 403 }
      )
    }

    if (!tokenData) {
      console.log('❌ [VERIFY] Token no existe')
      return NextResponse.json(
        { success: false, error: 'Token no existe' },
        { status: 403 }
      )
    }

    if (!tokenData.active) {
      console.log('❌ [VERIFY] Token existe pero está inactivo:', tokenData.active)
      return NextResponse.json(
        { success: false, error: 'Token inactivo o deshabilitado' },
        { status: 403 }
      )
    }

    console.log('✅ [VERIFY] Token válido y activo')

    // Obtener información de la entidad
    console.log('🔎 [VERIFY] Buscando información de la entidad...')
    const { data: entity, error: entityError } = await supabase
      .from('entities')
      .select('id, nombre, sector_code')
      .eq('id', entityId)
      .single()

    console.log('📊 [VERIFY] Resultado de entidad:', {
      entity,
      entityError: entityError?.message
    })

    if (entityError || !entity) {
      console.log('❌ [VERIFY] Entidad no encontrada')
      return NextResponse.json(
        { success: false, error: 'Entidad no encontrada' },
        { status: 404 }
      )
    }

    console.log('✅ [VERIFY] Verificación completa exitosa para:', entity.nombre)

    return NextResponse.json({
      success: true,
      valid: true,
      entity: {
        id: entity.id,
        nombre: entity.nombre,
        sector_code: entity.sector_code
      }
    })

  } catch (error) {
    console.error('Error en API verify:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
