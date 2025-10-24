import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// MODO DEMO: Almacenamiento en memoria para desarrollo
const demoStorage: any = {
  compliance: {},
  entities: {},
  tokens: {}
}

export async function POST(req: Request) {
  try {
    const { action, entity_id, payload } = await req.json()

    console.log('📥 [CONFIG API] POST:', { action, entity_id, payload })

    if (!action || !entity_id) {
      return NextResponse.json({
        ok: false,
        error: 'action y entity_id son requeridos'
      }, { status: 400 })
    }

    const now = new Date().toISOString()
    const deadline30Days = new Date()
    deadline30Days.setDate(deadline30Days.getDate() + 30)

    // MODO DEMO: Usar almacenamiento en memoria
    let compliance = demoStorage.compliance[entity_id] || {}

    let updates: any = {}
    let shouldEnqueueEmail = false
    let emailTemplate = ''

    switch (action) {
      // ============================================
      // PASO 1: Canal de comunicación
      // ============================================
      case 'set_channel':
        if (!payload?.canal_tipo || !payload?.canal_valor) {
          return NextResponse.json({
            ok: false,
            error: 'canal_tipo y canal_valor son requeridos'
          }, { status: 400 })
        }

        // MODO DEMO: Guardar en memoria
        demoStorage.entities[entity_id] = {
          ...demoStorage.entities[entity_id],
          canal_tipo: payload.canal_tipo,
          canal_valor: payload.canal_valor,
          updated_at: now
        }

        updates.channel_done = true
        updates.channel_postponed = false
        updates.updated_at = now

        console.log('✅ [CONFIG] Canal configurado:', payload)
        break

      case 'postpone_channel':
        updates.channel_postponed = true
        updates.channel_done = false

        if (!compliance?.deadline_at) {
          updates.deadline_at = deadline30Days.toISOString()
        }

        updates.updated_at = now
        shouldEnqueueEmail = true
        emailTemplate = 'onboarding-delay'
        break

      // ============================================
      // PASO 2: Token de miembros
      // ============================================
      case 'gen_token':
        // Generar token único
        const token = `tok_${Date.now()}_${Math.random().toString(36).substring(7)}`

        // Inicializar Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        console.log('🔍 [CONFIG] Verificando variables de Supabase:', {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseServiceKey,
          urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NO CONFIGURADA'
        })

        if (!supabaseUrl || !supabaseServiceKey) {
          console.error('❌ [CONFIG] Variables de Supabase no configuradas')
          console.error('❌ [CONFIG] NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
          console.error('❌ [CONFIG] SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
          return NextResponse.json({
            ok: false,
            error: 'Error de configuración del servidor - Variables de Supabase no configuradas'
          }, { status: 500 })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        })

        console.log('🔄 [CONFIG] Intentando insertar token en Supabase para entity:', entity_id)

        // Guardar token en Supabase
        const { data: insertedToken, error: tokenError } = await supabase
          .from('entity_invite_tokens')
          .insert([{
            entity_id,
            token,
            active: true,
            expires_at: deadline30Days.toISOString(),
            created_at: now
          }])
          .select()
          .single()

        if (tokenError) {
          console.error('❌ [CONFIG] Error insertando token en Supabase:', tokenError)
          console.error('❌ [CONFIG] Código de error:', tokenError.code)
          console.error('❌ [CONFIG] Mensaje de error:', tokenError.message)
          console.error('❌ [CONFIG] Detalles:', tokenError.details)
          return NextResponse.json({
            ok: false,
            error: `Error generando token: ${tokenError.message}`,
            details: tokenError.details,
            code: tokenError.code
          }, { status: 500 })
        }

        // MODO DEMO: También guardar en memoria para compatibilidad
        demoStorage.tokens[entity_id] = {
          entity_id,
          token,
          status: 'active',
          created_at: now,
          deadline_at: deadline30Days.toISOString()
        }

        console.log('✅ [CONFIG] Token generado y guardado en Supabase:', token)

        // No actualiza compliance directamente (se marca cuando se usa)
        return NextResponse.json({
          ok: true,
          token,
          url: `${process.env.APP_BASE_URL || 'https://www.custodia360.es'}/onboarding/${token}`
        })

      // ============================================
      // PASO 3: Mapa de riesgos
      // ============================================
      case 'ack_riskmap':
        updates.riskmap_done = true
        updates.riskmap_acknowledged_at = now
        updates.updated_at = now
        break

      // ============================================
      // PASO 4: Certificado de penales
      // ============================================
      case 'set_penales':
        updates.penales_done = true
        updates.penales_postponed = false
        updates.penales_entregado_at = now
        updates.updated_at = now
        break

      case 'postpone_penales':
        updates.penales_postponed = true
        updates.penales_done = false

        if (!compliance?.deadline_at) {
          updates.deadline_at = deadline30Days.toISOString()
        }

        updates.updated_at = now
        shouldEnqueueEmail = true
        emailTemplate = 'onboarding-delay'
        break

      default:
        return NextResponse.json({
          ok: false,
          error: 'Acción no válida'
        }, { status: 400 })
    }

    // Actualizar compliance en memoria
    if (Object.keys(updates).length > 0) {
      demoStorage.compliance[entity_id] = {
        ...demoStorage.compliance[entity_id],
        entity_id,
        ...updates
      }
      console.log('✅ [CONFIG] Compliance actualizado:', demoStorage.compliance[entity_id])
    }

    // MODO DEMO: No enviamos emails reales
    if (shouldEnqueueEmail && emailTemplate) {
      console.log('📧 [CONFIG] Email simulado:', emailTemplate)
    }

    return NextResponse.json({
      ok: true,
      updates
    })

  } catch (error: any) {
    console.error('Error en config init:', error)
    return NextResponse.json({
      ok: false,
      error: 'Error del servidor'
    }, { status: 500 })
  }
}

// GET para obtener estado actual
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const entity_id = url.searchParams.get('entity_id')

    console.log('📥 [CONFIG API] GET:', entity_id)

    if (!entity_id) {
      return NextResponse.json({
        ok: false,
        error: 'entity_id requerido'
      }, { status: 400 })
    }

    // MODO DEMO: Obtener de memoria para compliance y entity
    const compliance = demoStorage.compliance[entity_id] || {}
    const entity = demoStorage.entities[entity_id] || { sector_code: 'general' }

    // Obtener token desde Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    let tokenData = null

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })

      const { data: tokenFromDb, error: tokenError } = await supabase
        .from('entity_invite_tokens')
        .select('token, active, expires_at, created_at')
        .eq('entity_id', entity_id)
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!tokenError && tokenFromDb) {
        tokenData = tokenFromDb.token
        console.log('🔑 [CONFIG API] Token desde Supabase:', tokenData)
      } else {
        console.log('⚠️ [CONFIG API] No hay token en Supabase para entity:', entity_id)
      }
    }

    // Fallback a memoria si no hay en Supabase
    if (!tokenData && demoStorage.tokens[entity_id]) {
      tokenData = demoStorage.tokens[entity_id].token
      console.log('🔑 [CONFIG API] Token desde memoria:', tokenData)
    }

    console.log('📤 [CONFIG API] Devolviendo estado:', { compliance, entity, token: tokenData })

    return NextResponse.json({
      ok: true,
      compliance,
      entity,
      token: tokenData
    })

  } catch (error: any) {
    console.error('❌ [CONFIG API] Error obteniendo estado:', error)
    return NextResponse.json({
      ok: false,
      error: 'Error del servidor'
    }, { status: 500 })
  }
}
