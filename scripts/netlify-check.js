#!/usr/bin/env node

console.log('🌐 Verificando configuración de Netlify...')

// Check if running on Netlify
const isNetlify = process.env.NETLIFY === 'true'
const buildId = process.env.BUILD_ID
const context = process.env.CONTEXT || 'development'

console.log(`🏗️ Contexto de build: ${context}`)
console.log(`🔧 Ejecutándose en Netlify: ${isNetlify}`)
if (buildId) {
  console.log(`🆔 Build ID: ${buildId}`)
}

// Check Node.js version compatibility
const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.slice(1))
console.log(`📦 Node.js version: ${nodeVersion}`)

if (majorVersion < 18) {
  console.error('❌ Node.js version debe ser 18 o superior para Netlify')
  process.exit(1)
} else if (majorVersion >= 18) {
  console.log('✅ Versión de Node.js compatible con Netlify')
}

// Check essential environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

const optionalEnvVars = [
  'RESEND_API_KEY',
  'PDFSHIFT_API_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

let missingRequired = []
let missingOptional = []

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missingRequired.push(envVar)
  } else {
    console.log(`✅ ${envVar}: Configurado`)
  }
}

for (const envVar of optionalEnvVars) {
  if (!process.env[envVar]) {
    missingOptional.push(envVar)
  } else {
    console.log(`✅ ${envVar}: Configurado`)
  }
}

if (missingRequired.length > 0) {
  console.error(`❌ Variables REQUERIDAS faltantes: ${missingRequired.join(', ')}`)
  if (isNetlify) {
    console.error('💥 Build fallará sin estas variables')
    process.exit(1)
  }
} else {
  console.log('✅ Todas las variables requeridas están configuradas')
}

if (missingOptional.length > 0) {
  console.warn(`⚠️ Variables opcionales faltantes: ${missingOptional.join(', ')}`)
  console.log('ℹ️ Estas variables son opcionales pero recomendadas para funcionalidad completa')
}

// Check memory settings
const memoryUsage = process.memoryUsage()
const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)
const maxOldSpace = process.env.NODE_OPTIONS?.includes('--max-old-space-size')

console.log(`💾 Uso de memoria actual: ${heapUsedMB}MB`)
if (maxOldSpace) {
  console.log('✅ NODE_OPTIONS configurado para mayor memoria')
} else {
  console.warn('⚠️ Considera configurar NODE_OPTIONS="--max-old-space-size=8192"')
}

// Check for Next.js specific configurations
const nextConfigExists = require('fs').existsSync('./next.config.js')
const packageJsonExists = require('fs').existsSync('./package.json')
const netlifyTomlExists = require('fs').existsSync('./netlify.toml')

console.log(`📄 next.config.js: ${nextConfigExists ? '✅' : '❌'}`)
console.log(`📄 package.json: ${packageJsonExists ? '✅' : '❌'}`)
console.log(`📄 netlify.toml: ${netlifyTomlExists ? '✅' : '❌'}`)

if (isNetlify) {
  console.log('\n🚀 Configuración de Netlify verificada - continuando build...')
} else {
  console.log('\n🏠 Verificación en desarrollo local completada')
}

console.log('✅ Verificación de Netlify completada\n')
