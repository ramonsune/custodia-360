import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * API: Activación Completa de Contratación (SIN STRIPE)
 * POST /api/contracting/activate
 *
 * Orquesta el proceso completo de alta de una nueva entidad:
 * 1. Crear entity + compliance
 * 2. Crear usuarios Auth para delegados
 * 3. Generar token de onboarding
 * 4. Crear suscripción placeholder
 * 5. Encolar emails
 * 6. Generar PDFs (certificados, training, role-packs)
 * 7. Retornar URLs y datos de acceso
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { entity, contratante, admin_email, delegado, suplente, plan } = body

    console.log('🚀 [CONTRACTING ACTIVATE] Iniciando activación para:', entity?.nombre)

    // Validar campos obligatorios
    if (!entity?.nombre || !contratante?.email || !admin_email || !delegado?.email || !plan?.code) {
      return NextResponse.json({
        success: false,
        error: 'Faltan campos obligatorios: entity.nombre, contratante.email, admin_email, delegado.email, plan.code'
      }, { status: 400 })
    }

    // Inicializar Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        error: 'Error de configuración del servidor'
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // ====================================================================
    // PASO 1: Crear Entity
    // ====================================================================
    console.log('📝 [ACTIVATE] Paso 1: Creando entidad...')
    const { data: entityData, error: entityError } = await supabase
      .from('entities')
      .insert([{
        nombre: entity.nombre,
        sector_code: entity.sector_code || 'general',
        email_admin: admin_email,
        email_contratante: contratante.email,
        canal_tipo: entity.canal_preferido?.tipo || null,
        canal_valor: entity.canal_preferido?.valor || null,
        kit_comunicacion_activo: plan.kit_comunicacion || false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (entityError || !entityData) {
      console.error('❌ [ACTIVATE] Error creando entidad:', entityError)
      return NextResponse.json({
        success: false,
        error: 'Error creando la entidad',
        details: entityError?.message
      }, { status: 500 })
    }

    const entity_id = entityData.id
    console.log('✅ [ACTIVATE] Entidad creada:', entity_id)

    // ====================================================================
    // PASO 2: Crear Entity Compliance
    // ====================================================================
    console.log('📝 [ACTIVATE] Paso 2: Creando compliance...')
    const deadline30Days = new Date()
    deadline30Days.setDate(deadline30Days.getDate() + 30)

    await supabase
      .from('entity_compliance')
      .insert([{
        entity_id: entity_id,
        deadline_at: deadline30Days.toISOString(),
        days_remaining: 30,
        created_at: new Date().toISOString()
      }])

    console.log('✅ [ACTIVATE] Compliance creado')

    // ====================================================================
    // PASO 3: Crear Usuarios Auth (Delegado Principal y Suplente)
    // ====================================================================
    console.log('🔐 [ACTIVATE] Paso 3: Creando usuarios Auth...')

    let delegadoAuthId = null
    let suplenteAuthId = null

    // Crear delegado principal
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: delegado.email,
        password: delegado.password,
        email_confirm: true,
        user_metadata: {
          nombre: delegado.nombre,
          entity_id: entity_id,
          tipo: 'principal'
        }
      })

      if (authError) {
        // Si ya existe, intentar obtenerlo
        console.warn('⚠️ [ACTIVATE] Usuario delegado ya existe, vinculando...')
        const { data: existingUsers } = await supabase.auth.admin.listUsers()
        const existing = existingUsers?.users?.find((u: any) => u.email === delegado.email)
        if (existing) {
          delegadoAuthId = existing.id
        }
      } else if (authData?.user) {
        delegadoAuthId = authData.user.id
      }

      console.log('✅ [ACTIVATE] Delegado principal Auth:', delegadoAuthId)
    } catch (error) {
      console.error('⚠️ [ACTIVATE] Error Auth delegado:', error)
    }

    // Crear delegado suplente si aplica
    if (suplente?.email && suplente?.password) {
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: suplente.email,
          password: suplente.password,
          email_confirm: true,
          user_metadata: {
            nombre: suplente.nombre,
            entity_id: entity_id,
            tipo: 'suplente'
          }
        })

        if (authError) {
          console.warn('⚠️ [ACTIVATE] Usuario suplente ya existe, vinculando...')
          const { data: existingUsers } = await supabase.auth.admin.listUsers()
          const existing = existingUsers?.users?.find((u: any) => u.email === suplente.email)
          if (existing) {
            suplenteAuthId = existing.id
          }
        } else if (authData?.user) {
          suplenteAuthId = authData.user.id
        }

        console.log('✅ [ACTIVATE] Delegado suplente Auth:', suplenteAuthId)
      } catch (error) {
        console.error('⚠️ [ACTIVATE] Error Auth suplente:', error)
      }
    }

    // ====================================================================
    // PASO 4: Crear registros en entity_people
    // ====================================================================
    console.log('📝 [ACTIVATE] Paso 4: Registrando personas...')

    await supabase.from('entity_people').insert([{
      entity_id: entity_id,
      email: delegado.email,
      nombre: delegado.nombre,
      tipo: 'principal',
      auth_user_id: delegadoAuthId,
      formado: false,
      certificado: false,
      created_at: new Date().toISOString()
    }])

    if (suplente?.email) {
      await supabase.from('entity_people').insert([{
        entity_id: entity_id,
        email: suplente.email,
        nombre: suplente.nombre,
        tipo: 'suplente',
        auth_user_id: suplenteAuthId,
        formado: false,
        certificado: false,
        created_at: new Date().toISOString()
      }])
    }

    console.log('✅ [ACTIVATE] Personas registradas')

    // ====================================================================
    // PASO 5: Generar Token de Onboarding
    // ====================================================================
    console.log('🎟️ [ACTIVATE] Paso 5: Generando token de onboarding...')

    const onboardingToken = `tok_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const expiresIn60Days = new Date()
    expiresIn60Days.setDate(expiresIn60Days.getDate() + 60)

    await supabase.from('entity_invite_tokens').insert([{
      entity_id: entity_id,
      token: onboardingToken,
      active: true,
      expires_at: expiresIn60Days.toISOString(),
      created_at: new Date().toISOString()
    }])

    console.log('✅ [ACTIVATE] Token generado:', onboardingToken)

    // ====================================================================
    // PASO 6: Crear Suscripción Placeholder (sin Stripe)
    // ====================================================================
    console.log('💳 [ACTIVATE] Paso 6: Creando suscripción placeholder...')

    await supabase.from('subscriptions').insert([{
      entity_id: entity_id,
      plan_code: plan.code,
      status: 'pending_activation',
      meta: {
        kit_comunicacion: plan.kit_comunicacion || false,
        note: 'Activación sin Stripe - placeholder para producción'
      },
      created_at: new Date().toISOString()
    }])

    console.log('✅ [ACTIVATE] Suscripción creada')

    // ====================================================================
    // PASO 7: Encolar Emails
    // ====================================================================
    console.log('📧 [ACTIVATE] Paso 7: Encolando emails...')

    const now = new Date().toISOString()
    const emailJobs = [
      {
        template_code: 'contractor-confirm',
        recipient_email: contratante.email,
        recipient_name: contratante.nombre,
        status: 'pending',
        priority: 10,
        scheduled_for: now,
        context: { entity_id, entity_name: entity.nombre, plan_code: plan.code }
      },
      {
        template_code: 'admin-invoice',
        recipient_email: admin_email,
        recipient_name: 'Administración',
        status: 'pending',
        priority: 9,
        scheduled_for: now,
        context: { entity_id, entity_name: entity.nombre, plan_code: plan.code }
      },
      {
        template_code: 'delegate-welcome',
        recipient_email: delegado.email,
        recipient_name: delegado.nombre,
        status: 'pending',
        priority: 8,
        scheduled_for: now,
        context: { entity_id, entity_name: entity.nombre, tipo: 'principal' }
      },
      {
        template_code: 'training-start',
        recipient_email: delegado.email,
        recipient_name: delegado.nombre,
        status: 'pending',
        priority: 7,
        scheduled_for: now,
        context: { entity_id, person_tipo: 'principal' }
      }
    ]

    if (suplente?.email) {
      emailJobs.push({
        template_code: 'delegate-supl-welcome',
        recipient_email: suplente.email,
        recipient_name: suplente.nombre,
        status: 'pending',
        priority: 8,
        scheduled_for: now,
        context: { entity_id, entity_name: entity.nombre, tipo: 'suplente' }
      })
    }

    if (plan.kit_comunicacion) {
      emailJobs.push({
        template_code: 'kit-comm-invite',
        recipient_email: delegado.email,
        recipient_name: delegado.nombre,
        status: 'pending',
        priority: 6,
        scheduled_for: now,
        context: { entity_id }
      })
    }

    await supabase.from('message_jobs').insert(emailJobs)
    console.log(`✅ [ACTIVATE] ${emailJobs.length} emails encolados`)

    // ====================================================================
    // PASO 8: Generar PDFs
    // ====================================================================
    console.log('📄 [ACTIVATE] Paso 8: Generando PDFs...')

    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL || 'https://www.custodia360.es'
    const pdfs: any = {}

    // Training pack
    try {
      const trainingRes = await fetch(`${baseUrl}/api/pdfs/training-pack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id, sector_code: entity.sector_code })
      })
      const trainingData = await trainingRes.json()
      if (trainingData.success) {
        pdfs.training = trainingData.training_pack.pdf_url
      }
    } catch (error) {
      console.error('⚠️ [ACTIVATE] Error generando training pack:', error)
    }

    // Role packs
    const roles = ['familia', 'personal_contacto', 'personal_no_contacto', 'directiva']
    pdfs.packs = {}

    for (const role of roles) {
      try {
        const roleRes = await fetch(`${baseUrl}/api/pdfs/role-pack`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entity_id, role })
        })
        const roleData = await roleRes.json()
        if (roleData.success) {
          pdfs.packs[role] = roleData.role_pack.pdf_url
        }
      } catch (error) {
        console.error(`⚠️ [ACTIVATE] Error generando pack ${role}:`, error)
      }
    }

    console.log('✅ [ACTIVATE] PDFs generados')

    // ====================================================================
    // RESPUESTA FINAL
    // ====================================================================
    console.log('🎉 [ACTIVATE] Activación completada exitosamente')

    return NextResponse.json({
      success: true,
      message: 'Contratación activada exitosamente',
      entity_id,
      onboarding_token: onboardingToken,
      dashboard_urls: {
        delegado: `${baseUrl}/dashboard-delegado`,
        admin: `${baseUrl}/dashboard-admin`,
        entidad: `${baseUrl}/dashboard-entidad`,
        onboarding: `${baseUrl}/onboarding/${onboardingToken}`
      },
      pdfs,
      auth: {
        delegado_created: !!delegadoAuthId,
        suplente_created: !!suplenteAuthId
      },
      emails_queued: emailJobs.length
    })

  } catch (error: any) {
    console.error('❌ [CONTRACTING ACTIVATE] Error crítico:', error)
    return NextResponse.json({
      success: false,
      error: 'Error en la activación de la contratación',
      details: error.message
    }, { status: 500 })
  }
}
