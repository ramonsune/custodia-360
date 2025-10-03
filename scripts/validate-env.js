#!/usr/bin/env node

console.log('🔍 Validando variables de entorno...')

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

let hasErrors = false

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar]
  if (!value) {
    console.error(`❌ Variable de entorno faltante: ${envVar}`)
    hasErrors = true
  } else {
    console.log(`✅ ${envVar}: ${value.substring(0, 20)}...`)
  }
}

if (hasErrors) {
  console.error('\n⚠️ Variables de entorno faltantes (puede ser normal en desarrollo local)')
  console.log('\n📝 Soluciones para producción:')
  console.log('1. Configurar las variables en el dashboard de Netlify')
  console.log('2. Verificar el archivo netlify.toml')
  console.log('3. Verificar el archivo .env.local')

  // Solo fallar en producción (Netlify), no en desarrollo local
  if (process.env.NETLIFY === 'true') {
    console.error('\n💥 Build fallido en producción: Variables de entorno requeridas')
    process.exit(1)
  } else {
    console.log('\n⏭️ Continuando build (desarrollo local)')
  }
} else {
  console.log('\n✅ Todas las variables de entorno están configuradas correctamente')
}
