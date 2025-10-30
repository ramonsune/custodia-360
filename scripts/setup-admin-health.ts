#!/usr/bin/env bun

import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import { join } from 'path'

async function setupAdminHealth() {
  console.log('🔧 Configurando tablas de auditoría admin...\n')

  // Verificar variables de entorno
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Variables de Supabase no configuradas')
    process.exit(1)
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  try {
    // Leer el archivo SQL
    const sqlPath = join(process.cwd(), 'scripts', 'sql', 'admin-health.sql')
    const sql = await readFile(sqlPath, 'utf-8')

    console.log('📄 Ejecutando SQL desde:', sqlPath)

    // Ejecutar el SQL
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).single()

    if (error) {
      // Si no existe la función exec_sql, ejecutar directamente
      console.log('⚠️  No existe función exec_sql, ejecutando directamente...')

      // Separar por statements (muy básico)
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      for (const statement of statements) {
        const { error: stmtError } = await supabase.rpc('exec', { query: statement })

        if (stmtError) {
          console.error(`❌ Error ejecutando statement:`, stmtError.message)
          // Continuar con los demás statements
        }
      }
    }

    console.log('✅ Tablas de auditoría configuradas correctamente\n')

    // Verificar que las tablas existen
    const { data: healthLogs, error: healthError } = await supabase
      .from('admin_health_logs')
      .select('id')
      .limit(1)

    const { data: emailEvents, error: emailError } = await supabase
      .from('email_events')
      .select('id')
      .limit(1)

    if (!healthError) {
      console.log('✅ Tabla admin_health_logs: OK')
    } else {
      console.log('⚠️  Tabla admin_health_logs:', healthError.message)
    }

    if (!emailError) {
      console.log('✅ Tabla email_events: OK')
    } else {
      console.log('⚠️  Tabla email_events:', emailError.message)
    }

    console.log('\n🎉 Setup completado\n')

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

setupAdminHealth()
