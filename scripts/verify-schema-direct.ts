import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Cargar variables de entorno
config({ path: resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function exists(table: string) {
  const { error } = await supabase.from(table).select('count').limit(1)
  return !error
}

async function testFK() {
  // Crear entity temporal para probar FK
  const { data: entity, error: entityError } = await supabase
    .from('entities')
    .insert({ nombre: 'Test FK Verify', email: 'test-fk@custodia360.es' })
    .select()
    .single()

  if (entityError) return false

  // Intentar insertar en message_jobs con entity_id
  const { data: job, error: jobError } = await supabase
    .from('message_jobs')
    .insert({
      entity_id: entity.id,
      template_slug: 'test',
      channel: 'email',
      status: 'queued'
    })
    .select()
    .single()

  // Limpiar
  if (job) await supabase.from('message_jobs').delete().eq('id', job.id)
  await supabase.from('entities').delete().eq('id', entity.id)

  return !jobError
}

async function verify() {
  console.log('🔍 Verificando schema core en Supabase...\n')

  const checks = [
    ['entity_compliance', await exists('entity_compliance')],
    ['entity_invite_tokens', await exists('entity_invite_tokens')],
    ['entity_people', await exists('entity_people')],
    ['family_children', await exists('family_children')],
    ['miniquiz_attempts', await exists('miniquiz_attempts')],
  ] as const

  // Verificar FK funcionalmente
  const fkOk = await testFK()
  const allTablesOk = checks.every(([, ok]) => ok)

  console.log('## TABLAS\n')
  checks.forEach(([table, ok]) => {
    console.log(`${ok ? '✅' : '❌'} ${table}`)
  })

  console.log('\n## FOREIGN KEYS\n')
  console.log(`${fkOk ? '✅' : '❌'} message_jobs.entity_id → entities(id)`)

  console.log('\n## RESUMEN\n')
  console.log(`Tablas presentes: ${checks.filter(([, ok]) => ok).length}/${checks.length}`)
  console.log(`FK funcional: ${fkOk ? 'Sí' : 'No'}`)
  console.log(`Sistema listo: ${allTablesOk && fkOk ? '✅ SÍ' : '❌ NO'}`)

  if (!allTablesOk || !fkOk) {
    console.log('\n⚠️ ACCIÓN REQUERIDA: Ejecuta scripts/sql/ensure-core-schema.sql en Supabase SQL Editor')
  } else {
    console.log('\n✅ SCHEMA CORE COMPLETAMENTE FUNCIONAL')
  }

  return allTablesOk && fkOk
}

verify().then(ready => {
  process.exit(ready ? 0 : 1)
}).catch(error => {
  console.error('❌ Error:', error)
  process.exit(1)
})
