#!/usr/bin/env tsx
/**
 * Script de verificación del sistema de monitoreo BOE
 * Verifica que todas las configuraciones estén correctas antes del deployment
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const log = {
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg: string) => console.log(`\n${colors.cyan}━━━ ${msg} ━━━${colors.reset}\n`),
}

async function verifyBOESetup() {
  log.section('VERIFICACIÓN DEL SISTEMA DE MONITOREO BOE')

  let allChecksPass = true

  // 1. Verificar variables de entorno
  log.section('1. Variables de Entorno')

  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'APP_TIMEZONE',
  ]

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      log.success(`${envVar} configurada`)
    } else {
      log.error(`${envVar} NO encontrada`)
      allChecksPass = false
    }
  }

  // 2. Verificar archivos necesarios
  log.section('2. Archivos Necesarios')

  const requiredFiles = [
    'supabase/migrations/00_boe_monitoring_tables.sql',
    'supabase/migrations/01_boe_cron_setup.sql',
    'supabase/functions/c360_boe_check/index.ts',
    '.github/workflows/boe-check-semanal.yml',
    'src/app/api/admin/boe/run/route.ts',
    'src/app/dashboard-custodia360/monitoreo-boe/page.tsx',
  ]

  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file)
    if (fs.existsSync(filePath)) {
      log.success(`${file}`)
    } else {
      log.error(`${file} NO encontrado`)
      allChecksPass = false
    }
  }

  // 3. Verificar conexión a Supabase
  log.section('3. Conexión a Supabase')

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )

      // Verificar tablas
      const tables = ['boe_changes', 'watched_norms', 'boe_execution_logs']

      for (const table of tables) {
        try {
          const { data, error } = await supabase.from(table).select('count').limit(1)

          if (error) {
            log.warning(`Tabla ${table} no existe o no es accesible`)
            log.info(`Ejecuta: supabase/migrations/00_boe_monitoring_tables.sql`)
          } else {
            log.success(`Tabla ${table} existe y es accesible`)
          }
        } catch (err) {
          log.warning(`Error verificando tabla ${table}`)
        }
      }
    } catch (error) {
      log.error('Error conectando a Supabase')
      console.error(error)
      allChecksPass = false
    }
  } else {
    log.error('No se pueden verificar tablas sin credenciales de Supabase')
    allChecksPass = false
  }

  // 4. Verificar Edge Function
  log.section('4. Edge Function')

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      log.info('Verificando que la Edge Function c360_boe_check esté desplegada...')
      log.warning('Esta verificación requiere que hayas desplegado la función')
      log.info('Para desplegar: supabase functions deploy c360_boe_check')
    } catch (error) {
      log.warning('No se pudo verificar la Edge Function')
    }
  }

  // 5. Verificar CRON configuration
  log.section('5. Configuración CRON')

  log.info('Verifica manualmente que el CRON esté configurado:')
  log.info('Opción A: Ejecuta supabase/migrations/01_boe_cron_setup.sql en Supabase')
  log.info('Opción B: Los GitHub Actions en .github/workflows/boe-check-semanal.yml')

  // 6. Resumen final
  log.section('Resumen de Verificación')

  if (allChecksPass) {
    log.success('TODAS LAS VERIFICACIONES PASARON ✅')
    log.info('Próximos pasos:')
    log.info('1. Ejecutar SQL: supabase/migrations/00_boe_monitoring_tables.sql')
    log.info('2. Desplegar función: supabase functions deploy c360_boe_check')
    log.info('3. Configurar CRON: supabase/migrations/01_boe_cron_setup.sql')
    log.info('4. Probar en panel: /dashboard-custodia360/monitoreo-boe')
  } else {
    log.error('ALGUNAS VERIFICACIONES FALLARON ❌')
    log.warning('Revisa los errores anteriores y corrígelos antes de continuar')
  }

  log.section('Fin de la Verificación')
}

// Ejecutar verificación
verifyBOESetup().catch((error) => {
  log.error('Error ejecutando verificación')
  console.error(error)
  process.exit(1)
})
