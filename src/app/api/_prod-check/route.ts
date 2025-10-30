import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const startTime = Date.now()
  const report: string[] = []
  const checks: { name: string; status: string; latency?: number; details?: string }[] = []

  const prodUrl = 'https://www.custodia360.es'
  const timezone = 'Europe/Madrid'
  const now = new Date().toLocaleString('es-ES', { timeZone: timezone })

  report.push('# Custodia360 — Verificación en Producción\n')
  report.push(`**Fecha:** ${now} (${timezone})`)
  report.push(`**Dominio:** ${prodUrl}\n`)

  // ============================================================
  // 1. VARIABLES DE ENTORNO (solo presencia)
  // ============================================================
  report.push('## 1. Variables de Entorno\n')
  report.push('| Variable | Estado |')
  report.push('|---------|--------|')

  const envVars = {
    APP_BASE_URL: process.env.APP_BASE_URL,
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NOTIFY_EMAIL_FROM: process.env.NOTIFY_EMAIL_FROM,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  }

  for (const [key, value] of Object.entries(envVars)) {
    const present = !!value
    report.push(`| ${key} | ${present ? '✅' : '❌'} |`)
    checks.push({ name: `ENV: ${key}`, status: present ? '✅' : '❌' })
  }

  report.push('')

  // ============================================================
  // 2. HEALTH ENDPOINTS
  // ============================================================
  report.push('## 2. Health Endpoints\n')
  report.push('| Endpoint | Status | Latencia |')
  report.push('|----------|--------|----------|')

  const healthEndpoints = [
    '/api/health/delegado',
    '/api/health/admin',
    '/api/health/entidad',
    '/api/health/resend',
  ]

  for (const endpoint of healthEndpoints) {
    try {
      const start = Date.now()
      const res = await fetch(`${prodUrl}${endpoint}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      })
      const latency = Date.now() - start

      if (res.status === 200) {
        const data = await res.json()
        const ok = data.ok === true
        report.push(`| ${endpoint} | ${ok ? '✅ 200' : '⚠️ 200 (ok:false)'} | ${latency}ms |`)
        checks.push({ name: `Health: ${endpoint}`, status: ok ? '✅' : '⚠️', latency })
      } else {
        report.push(`| ${endpoint} | ❌ ${res.status} | ${latency}ms |`)
        checks.push({ name: `Health: ${endpoint}`, status: '❌', latency })
      }
    } catch (e: any) {
      report.push(`| ${endpoint} | ❌ Error | - |`)
      checks.push({ name: `Health: ${endpoint}`, status: '❌', details: e.message })
    }
  }

  report.push('')

  // ============================================================
  // 3. JOBS API (Worker Endpoints)
  // ============================================================
  report.push('## 3. Jobs API (Worker Endpoints)\n')
  report.push('| Endpoint | Status | Respuesta |')
  report.push('|----------|--------|-----------|')

  const jobEndpoints = [
    '/api/jobs/mailer-dispatch',
    '/api/jobs/billing-reminders',
    '/api/jobs/onboarding-guard',
    '/api/jobs/compliance-guard',
  ]

  for (const endpoint of jobEndpoints) {
    try {
      const start = Date.now()
      const res = await fetch(`${prodUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun: true })
      })
      const latency = Date.now() - start

      if (res.status === 200) {
        const data = await res.json()
        const ok = data.ok === true
        report.push(`| ${endpoint} | ${ok ? '✅ 200' : '⚠️ 200'} | ${latency}ms - ${ok ? 'OK' : 'Error'} |`)
        checks.push({ name: `Job: ${endpoint}`, status: ok ? '✅' : '⚠️', latency })
      } else {
        report.push(`| ${endpoint} | ❌ ${res.status} | ${latency}ms |`)
        checks.push({ name: `Job: ${endpoint}`, status: '❌', latency })
      }
    } catch (e: any) {
      report.push(`| ${endpoint} | ❌ Error | ${e.message} |`)
      checks.push({ name: `Job: ${endpoint}`, status: '❌', details: e.message })
    }
  }

  report.push('')

  // ============================================================
  // 4. NETLIFY SCHEDULED FUNCTIONS
  // ============================================================
  report.push('## 4. Netlify Scheduled Functions\n')
  report.push('⚠️ **Verificar manualmente en Netlify Dashboard > Functions > Scheduled:**\n')
  report.push('- c360_mailer_dispatch (*/10 * * * *)')
  report.push('- c360_billing_reminders (0 8 * * *)')
  report.push('- c360_onboarding_guard (0 8 * * *)')
  report.push('- c360_compliance_guard (0 7 * * *)\n')
  checks.push({ name: 'Scheduled Functions', status: 'N/D', details: 'Verificar en Netlify Dashboard' })
  report.push('')

  // ============================================================
  // 5. STRIPE WEBHOOK
  // ============================================================
  report.push('## 5. Stripe Webhook\n')

  try {
    const start = Date.now()
    const res = await fetch(`${prodUrl}/api/webhooks/stripe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const latency = Date.now() - start

    if (res.status === 400) {
      const data = await res.json()
      if (data.error && (data.error.includes('signature') || data.error.includes('Webhook secret'))) {
        report.push(`- **Endpoint:** ✅ Responde correctamente (400 por falta de firma - esperado)`)
        report.push(`- **Latencia:** ${latency}ms`)
        checks.push({ name: 'Stripe Webhook', status: '✅', latency })
      } else {
        report.push(`- **Endpoint:** ⚠️ Responde 400 con error inesperado: ${data.error}`)
        checks.push({ name: 'Stripe Webhook', status: '⚠️', latency })
      }
    } else {
      report.push(`- **Endpoint:** ⚠️ Status inesperado: ${res.status}`)
      checks.push({ name: 'Stripe Webhook', status: '⚠️', latency })
    }
  } catch (e: any) {
    report.push(`- **Endpoint:** ❌ Error: ${e.message}`)
    checks.push({ name: 'Stripe Webhook', status: '❌', details: e.message })
  }

  report.push('')

  // ============================================================
  // 6. RESEND PLANTILLAS (desde Supabase)
  // ============================================================
  report.push('## 6. Resend Plantillas (message_templates)\n')

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { persistSession: false } }
      )

      const { data, error } = await supabase
        .from('message_templates')
        .select('slug')

      if (!error && data) {
        report.push(`- **Total plantillas:** ${data.length}`)
        report.push(`- **Estado:** ${data.length >= 13 ? '✅' : '⚠️'} (esperadas: 13)`)
        checks.push({ name: 'Resend Templates', status: data.length >= 13 ? '✅' : '⚠️', details: `${data.length} plantillas` })
      } else {
        report.push(`- **Error:** ${error?.message || 'No se pudieron cargar'}`)
        checks.push({ name: 'Resend Templates', status: '❌', details: error?.message })
      }
    } catch (e: any) {
      report.push(`- **Error:** ${e.message}`)
      checks.push({ name: 'Resend Templates', status: '❌', details: e.message })
    }
  } else {
    report.push('- **Error:** Credenciales de Supabase no disponibles')
    checks.push({ name: 'Resend Templates', status: '❌', details: 'No credentials' })
  }

  report.push('')

  // ============================================================
  // 7. RUTAS PRINCIPALES
  // ============================================================
  report.push('## 7. Rutas Principales\n')
  report.push('| Ruta | Status | Latencia |')
  report.push('|------|--------|----------|')

  const mainRoutes = ['/', '/acceso', '/contacto']

  for (const route of mainRoutes) {
    try {
      const start = Date.now()
      const res = await fetch(`${prodUrl}${route}`, {
        method: 'GET',
        redirect: 'manual'
      })
      const latency = Date.now() - start

      const acceptableStatuses = [200, 301, 302]
      const ok = acceptableStatuses.includes(res.status)

      report.push(`| ${route} | ${ok ? '✅' : '❌'} ${res.status} | ${latency}ms |`)
      checks.push({ name: `Route: ${route}`, status: ok ? '✅' : '❌', latency })
    } catch (e: any) {
      report.push(`| ${route} | ❌ Error | - |`)
      checks.push({ name: `Route: ${route}`, status: '❌', details: e.message })
    }
  }

  report.push('')

  // ============================================================
  // 8. PANELES PROTEGIDOS
  // ============================================================
  report.push('## 8. Paneles Protegidos (requieren autenticación)\n')
  report.push('| Ruta | Status | Latencia |')
  report.push('|------|--------|----------|')

  const protectedRoutes = [
    '/dashboard-delegado',
    '/dashboard-delegado/configuracion',
    '/dashboard-entidad',
    '/dashboard-admin',
  ]

  for (const route of protectedRoutes) {
    try {
      const start = Date.now()
      const res = await fetch(`${prodUrl}${route}`, {
        method: 'GET',
        redirect: 'manual'
      })
      const latency = Date.now() - start

      const acceptableStatuses = [200, 302, 401, 403]
      const ok = acceptableStatuses.includes(res.status)

      report.push(`| ${route} | ${ok ? '✅' : '⚠️'} ${res.status} | ${latency}ms |`)
      checks.push({ name: `Protected: ${route}`, status: ok ? '✅' : '⚠️', latency })
    } catch (e: any) {
      report.push(`| ${route} | ❌ Error | - |`)
      checks.push({ name: `Protected: ${route}`, status: '❌', details: e.message })
    }
  }

  report.push('')

  // ============================================================
  // 9. RESUMEN FINAL
  // ============================================================
  report.push('## 9. Resumen Final\n')

  const totalChecks = checks.length
  const passedChecks = checks.filter(c => c.status === '✅').length
  const warningChecks = checks.filter(c => c.status === '⚠️').length
  const failedChecks = checks.filter(c => c.status === '❌').length
  const ndChecks = checks.filter(c => c.status === 'N/D').length

  report.push(`- **Total de verificaciones:** ${totalChecks}`)
  report.push(`- **Exitosas (✅):** ${passedChecks}`)
  report.push(`- **Advertencias (⚠️):** ${warningChecks}`)
  report.push(`- **Fallidas (❌):** ${failedChecks}`)
  report.push(`- **Por verificar (N/D):** ${ndChecks}\n`)

  const readyForLaunch = failedChecks === 0

  report.push(`### **Listo para lanzamiento:** ${readyForLaunch ? '✅ SÍ' : '❌ NO'}\n`)

  if (failedChecks > 0) {
    report.push('**Checks fallidos:**')
    checks.filter(c => c.status === '❌').forEach(c => {
      report.push(`- ❌ ${c.name}${c.details ? ` (${c.details})` : ''}`)
    })
    report.push('')
  }

  if (warningChecks > 0) {
    report.push('**Advertencias:**')
    checks.filter(c => c.status === '⚠️').forEach(c => {
      report.push(`- ⚠️ ${c.name}${c.details ? ` (${c.details})` : ''}`)
    })
    report.push('')
  }

  report.push('> **Próximos pasos:**')
  if (readyForLaunch) {
    report.push('> - ✅ Todos los sistemas operativos')
    report.push('> - Verificar Netlify Scheduled Functions en Dashboard')
    report.push('> - Configurar STRIPE_WEBHOOK_SECRET cuando se active Stripe')
  } else {
    report.push('> - ❌ Resolver los checks fallidos antes de lanzar')
    report.push('> - Revisar configuración en Netlify')
  }

  report.push(`\n---\n*Verificación en producción completada en ${Date.now() - startTime}ms*`)

  const markdown = report.join('\n')

  return NextResponse.json({ markdown })
}
