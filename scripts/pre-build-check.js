#!/usr/bin/env node

console.log('🔧 Ejecutando verificaciones pre-build...')

// Check Node.js version
const nodeVersion = process.version
console.log(`📦 Node.js version: ${nodeVersion}`)

if (parseInt(nodeVersion.slice(1)) < 18) {
  console.warn('⚠️ Warning: Node.js version is below 18. Consider upgrading.')
}

// Check environment
const isNetlify = process.env.NETLIFY === 'true'
const environment = process.env.NODE_ENV || 'development'

console.log(`🌍 Environment: ${environment}`)
console.log(`🏗️ Building on Netlify: ${isNetlify}`)

// Check memory
const memoryUsage = process.memoryUsage()
console.log(`💾 Memory usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`)

// Check environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

let missingVars = []
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missingVars.push(envVar)
  } else {
    console.log(`✅ ${envVar}: Configurado`)
  }
}

if (missingVars.length > 0) {
  console.error(`❌ Variables de entorno faltantes: ${missingVars.join(', ')}`)
  if (isNetlify) {
    console.error('💥 Build fallará en Netlify sin estas variables')
    process.exit(1)
  } else {
    console.log('⏭️ Continuando en desarrollo local')
  }
}

// Check build flags
if (process.env.SKIP_TYPE_CHECK === 'true') {
  console.log('⏭️ TypeScript type checking deshabilitado')
}

if (process.env.DISABLE_ESLINT === 'true') {
  console.log('⏭️ ESLint deshabilitado')
}

console.log('✅ Verificaciones pre-build completadas\n')
