import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * ENDPOINT TEMPORAL: Smoke Test E2E
 * POST /api/_e2e/live-smoke
 *
 * Ejecuta una prueba completa end-to-end del sistema:
 * 1. Crea entidad E2E de prueba
 * 2. Activa contratación completa
 * 3. Verifica usuarios Auth, token, emails, PDFs
 * 4. Registra resultados en admin_health_logs
 * 5. ELIMINA la entidad E2E (limpieza)
 * 6. Retorna informe detallado
 *
 * NOTA: Este endpoint debe eliminarse después de ejecutar el smoke test
 */
export async function POST(req: Request) {
  const startTime = Date.now()
  const checks: any = {
    entity_created: false,
    auth_users_created: false,
    token_generated: false,
    emails_queued: false,
    pdfs_generated: false,
    onboarding_accessible: false,
    cleanup_done: false
  }

  let testEntityId: string | null = null

  try {
    console.log('🧪 [SMOKE TEST] Iniciando prueba E2E...')

    // Inicializar Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Variables de Supabase no configuradas')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // ====================================================================
    // CHECK 1: Crear entidad E2E mediante /api/contracting/activate
    // ====================================================================
    console.log('🧪 [SMOKE] Check 1: Activando contratación E2E...')

    const uuid = crypto.randomUUID().slice(0, 8)
    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL || 'https://www.custodia360.es'

    const activateRes = await fetch(`${baseUrl}/api/contracting/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entity: {
          nombre: `E2E GoLive ${uuid}`,
          sector_code: 'test'
        },
        contratante: {
          email: `e2e-contractor-${uuid}@custodia360.es`,
          nombre: 'E2E Contractor'
        },
        admin_email: `e2e-admin-${uuid}@custodia360.es`,
        delegado: {
          email: `e2e-delegate-${uuid}@custodia360.es`,
          nombre: 'E2E Delegado',
          password: `E2E_Pass_${uuid}!`
        },
        suplente: {
          email: `e2e-supl-${uuid}@custodia360.es`,
          nombre: 'E2E Suplente',
          password: `E2E_Pass_Supl_${uuid}!`
        },
        plan: {
          code: 'plan100',
          kit_comunicacion: false
        }
      })
    })

    const activateData = await activateRes.json()

    if (!activateData.success) {
      throw new Error(`Error en activación: ${activateData.error}`)
    }

    testEntityId = activateData.entity_id
    checks.entity_created = true
    console.log('✅ [SMOKE] Entidad creada:', testEntityId)

    // ====================================================================
    // CHECK 2: Verificar usuarios Auth
    // ====================================================================
    console.log('🧪 [SMOKE] Check 2: Verificando usuarios Auth...')

    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const delegateExists = authUsers?.users?.some((u: any) =>
      u.email === `e2e-delegate-${uuid}@custodia360.es`
    )
    const suplenteExists = authUsers?.users?.some((u: any) =>
      u.email === `e2e-supl-${uuid}@custodia360.es`
    )

    checks.auth_users_created = delegateExists && suplenteExists
    console.log('✅ [SMOKE] Usuarios Auth verificados')

    // ====================================================================
    // CHECK 3: Verificar token de onboarding
    // ====================================================================
    console.log('🧪 [SMOKE] Check 3: Verificando token de onboarding...')

    const onboardingToken = activateData.onboarding_token

    if (onboardingToken) {
      const { data: tokenData } = await supabase
        .from('entity_invite_tokens')
        .select('*')
        .eq('token', onboardingToken)
        .single()

      checks.token_generated = !!tokenData && tokenData.active
      console.log('✅ [SMOKE] Token verificado:', onboardingToken)
    }

    // ====================================================================
    // CHECK 4: Verificar emails encolados
    // ====================================================================
    console.log('🧪 [SMOKE] Check 4: Verificando emails encolados...')

    const { data: emailJobs, count } = await supabase
      .from('message_jobs')
      .select('*', { count: 'exact' })
      .eq('context->>entity_id', testEntityId)

    checks.emails_queued = (count || 0) >= 3
    console.log(`✅ [SMOKE] Emails encolados: ${count}`)

    // ====================================================================
    // CHECK 5: Verificar PDFs generados
    // ====================================================================
    console.log('🧪 [SMOKE] Check 5: Verificando PDFs...')

    const pdfs = activateData.pdfs || {}
    const pdfCount = Object.keys(pdfs.packs || {}).length + (pdfs.training ? 1 : 0)

    checks.pdfs_generated = pdfCount >= 4 // training + 4 role packs
    console.log(`✅ [SMOKE] PDFs generados: ${pdfCount}`)

    // ====================================================================
    // CHECK 6: Verificar accesibilidad de onboarding
    // ====================================================================
    console.log('🧪 [SMOKE] Check 6: Verificando ruta onboarding...')

    try {
      const onboardingUrl = `${baseUrl}/onboarding/${onboardingToken}`
      const onboardingRes = await fetch(onboardingUrl)
      checks.onboarding_accessible = onboardingRes.status === 200
      console.log(`✅ [SMOKE] Onboarding accesible: ${onboardingRes.status}`)
    } catch (error) {
      console.warn('⚠️ [SMOKE] No se pudo verificar onboarding:', error)
      checks.onboarding_accessible = false
    }

    // ====================================================================
    // LIMPIEZA: Eliminar entidad E2E
    // ====================================================================
    console.log('🧹 [SMOKE] Limpiando entidad E2E...')

    if (testEntityId) {
      // Eliminar usuarios Auth
      const usersToDelete = authUsers?.users?.filter((u: any) =>
        u.email?.includes(`e2e-${uuid}@custodia360.es`)
      )

      for (const user of usersToDelete || []) {
        await supabase.auth.admin.deleteUser(user.id)
      }

      // Eliminar entidad (cascade eliminará relacionados)
      await supabase
        .from('entities')
        .delete()
        .eq('id', testEntityId)

      checks.cleanup_done = true
      console.log('✅ [SMOKE] Limpieza completada')
    }

    // ====================================================================
    // REGISTRAR EN LOGS
    // ====================================================================
    const allPassed = Object.values(checks).every((v) => v === true)
    const status = allPassed ? 'ok' : 'warn'

    await supabase
      .from('admin_health_logs')
      .insert([{
        scope: 'smoke_e2e',
        status,
        message: allPassed
          ? 'Smoke test E2E completado exitosamente'
          : 'Smoke test completado con advertencias',
        details: {
          checks,
          duration_ms: Date.now() - startTime,
          test_entity_id: testEntityId,
          timestamp: new Date().toISOString()
        }
      }])

    // ====================================================================
    // GENERAR MARKDOWN
    // ====================================================================
    const markdown = `
# 🧪 SMOKE TEST E2E - Custodia360

**Fecha:** ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}
**Duración:** ${Date.now() - startTime}ms
**Estado:** ${allPassed ? '✅ PASS' : '⚠️ WARN'}

## Resultados

| Check | Estado |
|-------|--------|
| Entidad creada | ${checks.entity_created ? '✅' : '❌'} |
| Usuarios Auth creados | ${checks.auth_users_created ? '✅' : '❌'} |
| Token generado | ${checks.token_generated ? '✅' : '❌'} |
| Emails encolados | ${checks.emails_queued ? '✅' : '❌'} |
| PDFs generados | ${checks.pdfs_generated ? '✅' : '❌'} |
| Onboarding accesible | ${checks.onboarding_accessible ? '✅' : '❌'} |
| Limpieza completada | ${checks.cleanup_done ? '✅' : '❌'} |

## Detalles

- **Entity ID:** \`${testEntityId}\`
- **Onboarding Token:** \`${onboardingToken}\`
- **Emails encolados:** ${count}
- **PDFs generados:** ${pdfCount}

${allPassed ? '✅ **Todos los checks pasaron. Sistema listo para producción.**' : '⚠️ **Algunos checks fallaron. Revisar logs.**'}
`

    console.log('🎉 [SMOKE] Test completado')

    return NextResponse.json({
      success: true,
      status,
      checks,
      duration_ms: Date.now() - startTime,
      markdown
    })

  } catch (error: any) {
    console.error('❌ [SMOKE] Error crítico:', error)

    // Intentar limpieza aunque falle
    if (testEntityId) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { autoRefreshToken: false, persistSession: false } }
        )
        await supabase.from('entities').delete().eq('id', testEntityId)
        checks.cleanup_done = true
      } catch (cleanupError) {
        console.error('❌ [SMOKE] Error en limpieza:', cleanupError)
      }
    }

    return NextResponse.json({
      success: false,
      status: 'fail',
      error: error.message,
      checks,
      duration_ms: Date.now() - startTime
    }, { status: 500 })
  }
}
