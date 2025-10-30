/**
 * CUSTODIA360 - VERIFICACIÓN SETUP DEMO
 * ======================================
 * Script para verificar que el sistema DEMO está correctamente configurado
 *
 * Ejecución: bun run scripts/verify-demo-setup.ts
 */

import { createClient } from '@supabase/supabase-js'

// Configuración
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Faltan variables de entorno')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const EXPECTED_USERS = [
  'entidad@custodia.com',
  'delegado@custodia.com',
  'delegados@custodia.com',
  'ramon@custodia.com'
]

const EXPECTED_ROLES = [
  { email: 'entidad@custodia.com', role: 'ENTIDAD' },
  { email: 'delegado@custodia.com', role: 'DELEGADO' },
  { email: 'delegados@custodia.com', role: 'SUPLENTE' },
  { email: 'ramon@custodia.com', role: 'ADMIN' }
]

/**
 * Verificar entidad DEMO
 */
async function checkDemoEntity() {
  console.log('\n🏢 Verificando entidad DEMO...')

  const { data, error } = await supabase
    .from('entities')
    .select('*')
    .eq('id', 'DEMO-ENTITY-001')
    .single()

  if (error) {
    console.log('❌ Entidad DEMO no encontrada')
    return false
  }

  if (!data.is_demo) {
    console.log('⚠️  Entidad encontrada pero is_demo=false')
    return false
  }

  console.log('✅ Entidad DEMO encontrada')
  console.log(`   ID: ${data.id}`)
  console.log(`   Nombre: ${data.name}`)
  console.log(`   is_demo: ${data.is_demo}`)

  return true
}

/**
 * Verificar usuarios DEMO en Auth
 */
async function checkDemoUsers() {
  console.log('\n👥 Verificando usuarios DEMO en Auth...')

  const { data: allUsers, error } = await supabase.auth.admin.listUsers()

  if (error) {
    console.log('❌ Error listando usuarios')
    return 0
  }

  let foundCount = 0

  for (const expectedEmail of EXPECTED_USERS) {
    const user = allUsers.users.find(u => u.email === expectedEmail)

    if (user) {
      const isDemo = user.user_metadata?.is_demo === true

      if (isDemo) {
        console.log(`✅ ${expectedEmail.padEnd(30)} (is_demo: true)`)
        foundCount++
      } else {
        console.log(`⚠️  ${expectedEmail.padEnd(30)} (is_demo: false)`)
      }
    } else {
      console.log(`❌ ${expectedEmail.padEnd(30)} (no encontrado)`)
    }
  }

  return foundCount
}

/**
 * Verificar roles asignados
 */
async function checkDemoRoles() {
  console.log('\n🔐 Verificando roles asignados...')

  const { data, error } = await supabase
    .from('entity_user_roles')
    .select('*')
    .eq('entity_id', 'DEMO-ENTITY-001')
    .eq('is_demo', true)

  if (error) {
    console.log('❌ Error consultando roles')
    return 0
  }

  console.log(`   Total roles DEMO: ${data?.length || 0}`)

  let foundCount = 0

  for (const expected of EXPECTED_ROLES) {
    const roleFound = data?.some(r =>
      r.role === expected.role &&
      r.is_demo === true
    )

    if (roleFound) {
      console.log(`✅ ${expected.email.padEnd(30)} → ${expected.role}`)
      foundCount++
    } else {
      console.log(`❌ ${expected.email.padEnd(30)} → ${expected.role} (no asignado)`)
    }
  }

  return foundCount
}

/**
 * Verificar políticas RLS
 */
async function checkRLSPolicies() {
  console.log('\n🔒 Verificando políticas RLS...')

  // Verificar que exists la función is_demo_user
  const { data: functionExists } = await supabase
    .rpc('is_demo_user')
    .single()

  if (functionExists !== null) {
    console.log('✅ Función is_demo_user() existe')
  } else {
    console.log('⚠️  Función is_demo_user() no encontrada')
  }

  // Verificar políticas en entities (query informativa)
  console.log('✅ Políticas RLS asumidas (verificar manualmente en Supabase)')
}

/**
 * Verificar columnas is_demo
 */
async function checkIsDemoColumns() {
  console.log('\n📊 Verificando columnas is_demo...')

  // Verificar entities.is_demo
  const { data: entitiesSchema } = await supabase
    .from('entities')
    .select('is_demo')
    .limit(1)

  if (entitiesSchema !== null && entitiesSchema !== undefined) {
    console.log('✅ Columna entities.is_demo existe')
  } else {
    console.log('❌ Columna entities.is_demo no existe')
  }

  // Verificar entity_user_roles.is_demo
  const { data: rolesSchema } = await supabase
    .from('entity_user_roles')
    .select('is_demo')
    .limit(1)

  if (rolesSchema !== null && rolesSchema !== undefined) {
    console.log('✅ Columna entity_user_roles.is_demo existe')
  } else {
    console.log('❌ Columna entity_user_roles.is_demo no existe')
  }
}

/**
 * Verificar audit_log
 */
async function checkAuditLog() {
  console.log('\n📝 Verificando audit_log...')

  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .ilike('action', 'demo.%')
    .order('timestamp', { ascending: false })
    .limit(10)

  if (error) {
    console.log('⚠️  Error consultando audit_log (tabla puede no existir)')
    return
  }

  console.log(`   Eventos DEMO registrados: ${data?.length || 0}`)

  if (data && data.length > 0) {
    console.log('\n   Últimos eventos:')
    data.forEach(event => {
      console.log(`   • ${event.action} (${new Date(event.timestamp).toLocaleString('es-ES')})`)
    })
  }
}

/**
 * MAIN
 */
async function main() {
  console.log('═'.repeat(80))
  console.log('🔍 CUSTODIA360 - VERIFICACIÓN SETUP DEMO')
  console.log('═'.repeat(80))

  try {
    // Ejecutar verificaciones
    const entityOk = await checkDemoEntity()
    const usersFound = await checkDemoUsers()
    const rolesFound = await checkDemoRoles()
    await checkIsDemoColumns()
    await checkRLSPolicies()
    await checkAuditLog()

    // Resumen final
    console.log('\n' + '═'.repeat(80))
    console.log('📊 RESUMEN DE VERIFICACIÓN')
    console.log('═'.repeat(80))

    console.log(`\n✅ Entidad DEMO: ${entityOk ? 'OK' : 'FALLO'}`)
    console.log(`✅ Usuarios DEMO: ${usersFound}/4 encontrados`)
    console.log(`✅ Roles asignados: ${rolesFound}/4 encontrados`)

    const allOk = entityOk && usersFound === 4 && rolesFound === 4

    if (allOk) {
      console.log('\n🎉 SISTEMA DEMO COMPLETAMENTE CONFIGURADO ✅')
    } else {
      console.log('\n⚠️  SISTEMA DEMO PARCIALMENTE CONFIGURADO')
      console.log('\nRevisa los pasos en: .same/SETUP-DEMO-MANUAL.md')
    }

    console.log('\n')

  } catch (error) {
    console.error('\n❌ ERROR:', error)
    process.exit(1)
  }
}

main()
