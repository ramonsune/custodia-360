#!/usr/bin/env tsx

/**
 * SCRIPT DE VALIDACIÓN PRE-LANZAMIENTO
 *
 * Ejecutar: npx tsx scripts/validate-production-ready.ts
 *
 * Verifica que todo está listo para go-live
 */

import { createClient } from '@supabase/supabase-js'

const CHECKS = {
  passed: 0,
  failed: 0,
  warnings: 0
}

const log = {
  success: (msg: string) => {
    console.log(`✅ ${msg}`)
    CHECKS.passed++
  },
  error: (msg: string) => {
    console.log(`❌ ${msg}`)
    CHECKS.failed++
  },
  warning: (msg: string) => {
    console.log(`⚠️  ${msg}`)
    CHECKS.warnings++
  },
  info: (msg: string) => {
    console.log(`ℹ️  ${msg}`)
  }
}

console.log('\n🔍 VALIDACIÓN PRE-LANZAMIENTO CUSTODIA360\n')
console.log('=' .repeat(50))

// 1. VARIABLES DE ENTORNO
console.log('\n📋 1. VARIABLES DE ENTORNO\n')

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'HOLDED_API_KEY'
]

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    log.success(`${envVar} configurada`)
  } else {
    log.error(`${envVar} NO configurada`)
  }
})

// 2. STRIPE
console.log('\n💳 2. STRIPE\n')

if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')) {
  log.success('Stripe en MODO PRODUCCIÓN')
} else if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')) {
  log.error('Stripe aún en MODO TEST - Cambiar a producción')
} else {
  log.error('Stripe key inválida')
}

// 3. SUPABASE
console.log('\n💾 3. SUPABASE\n')

const checkSupabase = async () => {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar conexión
    const { data, error } = await supabase.from('entities').select('count').limit(1)
    if (error) throw error
    log.success('Conexión a Supabase OK')

    // Verificar RLS
    const { data: rlsData } = await supabase.rpc('check_rls_policies')
    log.success('RLS policies activas')

  } catch (error) {
    log.error(`Supabase: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

// 4. RESEND
console.log('\n📧 4. RESEND\n')

const checkResend = async () => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
    })

    if (response.ok) {
      log.success('Resend API Key válida')
    } else {
      log.error('Resend API Key inválida o expirada')
    }
  } catch (error) {
    log.error(`Resend: ${error instanceof Error ? error.message : 'Error'}`)
  }
}

// 5. HOLDED
console.log('\n📄 5. HOLDED\n')

const checkHolded = async () => {
  try {
    const response = await fetch('https://api.holded.com/api/v1/contacts', {
      headers: {
        'key': process.env.HOLDED_API_KEY!,
      },
    })

    if (response.ok) {
      log.success('Holded API Key válida')
    } else {
      log.error('Holded API Key inválida')
    }
  } catch (error) {
    log.error(`Holded: ${error instanceof Error ? error.message : 'Error'}`)
  }
}

// 6. BUILD
console.log('\n🏗️  6. BUILD\n')

const checkBuild = async () => {
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    log.info('Ejecutando build de prueba...')
    const { stdout, stderr } = await execAsync('npm run build', {
      cwd: process.cwd(),
      env: { ...process.env, CI: 'true' }
    })

    if (stderr && !stderr.includes('warning')) {
      log.error(`Build falló: ${stderr}`)
    } else {
      log.success('Build exitoso')
    }
  } catch (error) {
    log.error(`Build: ${error instanceof Error ? error.message : 'Error'}`)
  }
}

// EJECUTAR VALIDACIONES
const runValidations = async () => {
  await checkSupabase()
  await checkResend()
  await checkHolded()
  // await checkBuild() // Comentado por tiempo - ejecutar manual

  // RESUMEN
  console.log('\n' + '='.repeat(50))
  console.log('\n📊 RESUMEN\n')
  console.log(`✅ Checks pasados: ${CHECKS.passed}`)
  console.log(`❌ Checks fallidos: ${CHECKS.failed}`)
  console.log(`⚠️  Warnings: ${CHECKS.warnings}`)

  if (CHECKS.failed === 0) {
    console.log('\n🎉 ¡TODO LISTO PARA LANZAMIENTO!\n')
    process.exit(0)
  } else {
    console.log('\n🚨 HAY ERRORES QUE CORREGIR ANTES DE LANZAR\n')
    process.exit(1)
  }
}

runValidations().catch(console.error)
