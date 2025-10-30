import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const startTime = Date.now()
  const report: string[] = []
  const issues: { priority: string; message: string }[] = []

  const timezone = process.env.APP_TIMEZONE || 'Europe/Madrid'
  const now = new Date().toLocaleString('es-ES', { timeZone: timezone })

  report.push('# Custodia360 — Re-Auditoría Post-Mejoras\n')
  report.push(`**Fecha:** ${now} (${timezone})`)
  report.push(`**Dominio:** ${process.env.APP_BASE_URL || 'N/D'}\n`)

  // ============================================================
  // 1. VARIABLES DE ENTORNO
  // ============================================================
  report.push('## 1. Variables de entorno\n')
  report.push('| Variable | Estado |')
  report.push('|---------|--------|')

  const envVars = {
    APP_BASE_URL: process.env.APP_BASE_URL,
    NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NOTIFY_EMAIL_FROM: process.env.NOTIFY_EMAIL_FROM,
    APP_TIMEZONE: process.env.APP_TIMEZONE,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  }

  for (const [key, value] of Object.entries(envVars)) {
    const present = !!value
    report.push(`| ${key} | ${present ? '✅' : '❌'} |`)
    if (!present && key !== 'STRIPE_WEBHOOK_SECRET') {
      issues.push({ priority: 'Alta', message: `Variable faltante: ${key}` })
    } else if (key === 'STRIPE_WEBHOOK_SECRET' && !present) {
      issues.push({ priority: 'Baja', message: 'STRIPE_WEBHOOK_SECRET pendiente (configurar cuando se active Stripe)' })
    }
  }

  report.push('')

  // ============================================================
  // 2. HEALTH ENDPOINTS
  // ============================================================
  report.push('## 2. Health Endpoints\n')

  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000'
  const healthEndpoints = [
    '/api/health/delegado',
    '/api/health/admin',
    '/api/health/entidad',
    '/api/health/resend',
  ]

  for (const endpoint of healthEndpoints) {
    try {
      const start = Date.now()
      const res = await fetch(`${baseUrl}${endpoint}`).catch(() => null)
      const latency = Date.now() - start

      if (!res) {
        report.push(`- **${endpoint}:** ❌ (no responde)`)
        issues.push({ priority: 'Media', message: `Health endpoint ${endpoint} no responde` })
        continue
      }

      const statusOk = res.status === 200
      report.push(`- **${endpoint}:** ${statusOk ? '✅' : '❌'} (${res.status}, ${latency}ms)`)

      if (!statusOk) {
        issues.push({ priority: 'Baja', message: `Health endpoint ${endpoint} devuelve ${res.status}` })
      }
    } catch (e: any) {
      report.push(`- **${endpoint}:** ❌ (${e.message})`)
      issues.push({ priority: 'Media', message: `Error en ${endpoint}: ${e.message}` })
    }
  }

  report.push('')

  // ============================================================
  // 3. STRIPE WEBHOOK
  // ============================================================
  report.push('## 3. Stripe Webhook\n')

  try {
    const webhookUrl = `${baseUrl}/api/webhooks/stripe`
    const webhookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }).catch(() => null)

    if (webhookRes) {
      const status = webhookRes.status
      const body = await webhookRes.json()

      if (status === 400) {
        if (body.error && body.error.includes('Webhook secret no configurado')) {
          report.push(`- **Endpoint:** ✅ (creado, esperando STRIPE_WEBHOOK_SECRET)`)
          report.push(`- **Guía:** ${body.guide || 'Configurar en Netlify'}`)
        } else {
          report.push(`- **Endpoint:** ✅ (responde 400 sin firma - correcto)`)
        }
      } else if (status === 404) {
        report.push(`- **Endpoint:** ❌ (no existe)`)
        issues.push({ priority: 'Media', message: 'Endpoint webhook de Stripe no encontrado' })
      } else {
        report.push(`- **Endpoint:** ⚠️ (status ${status})`)
      }
    } else {
      report.push(`- **Endpoint:** ❌ (no responde)`)
      issues.push({ priority: 'Media', message: 'Webhook de Stripe no responde' })
    }
  } catch (e: any) {
    report.push(`- **Endpoint:** ❌ (${e.message})`)
  }

  report.push('')

  // ============================================================
  // 4. PLANTILLAS RESEND
  // ============================================================
  report.push('## 4. Plantillas Resend (message_templates)\n')

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )

    const expectedSlugs = [
      'contact-auto-reply',
      'contractor-confirm',
      'admin-invoice',
      'delegate-welcome',
      'delegate-supl-welcome',
      'billing-5m-reminder',
      'billing-11m-reminder',
      'training-start',
      'training-certified',
      'channel-verify',
      'compliance-blocked',
      'onboarding-delay',
      'kit-comm-invite',
    ]

    try {
      const { data, error } = await supabase
        .from('message_templates')
        .select('slug')

      if (!error && data) {
        const foundSlugs = data.map((t) => t.slug)
        const allFound = expectedSlugs.every((slug) => foundSlugs.includes(slug))

        report.push(`- **Total plantillas:** ${data.length}`)
        report.push(`- **Plantillas esperadas:** ${expectedSlugs.length}`)
        report.push(`- **Estado:** ${allFound ? '✅ Todas presentes' : '⚠️ Algunas faltantes'}\n`)

        report.push('**Detalle:**')
        for (const slug of expectedSlugs) {
          const found = foundSlugs.includes(slug)
          report.push(`- ${found ? '✅' : '❌'} ${slug}`)
          if (!found) {
            issues.push({ priority: 'Baja', message: `Plantilla faltante: ${slug}` })
          }
        }
      } else {
        report.push(`- **Error:** ${error?.message || 'No se pudieron cargar plantillas'}`)
        issues.push({ priority: 'Media', message: 'No se pudieron verificar plantillas' })
      }
    } catch (e: any) {
      report.push(`- **Error:** ${e.message}`)
    }
  } else {
    report.push('- **Error:** Credenciales de Supabase faltantes')
  }

  report.push('')

  // ============================================================
  // 5. EDGE FUNCTIONS (verificación manual)
  // ============================================================
  report.push('## 5. Edge Functions & Schedules (Supabase)\n')
  report.push('⚠️ **Verificación manual requerida en Supabase Dashboard:**\n')
  report.push('- [ ] c360_mailer_dispatch (cron: */10 * * * *)')
  report.push('- [ ] c360_billing_reminders_daily (cron: 0 8 * * *)')
  report.push('- [ ] c360_onboarding_guard (cron: 0 8 * * *)')
  report.push('- [ ] c360_compliance_guard (cron: 0 7 * * *)\n')

  issues.push({ priority: 'Media', message: 'Verificar Edge Functions en Supabase Dashboard' })

  report.push('')

  // ============================================================
  // 6. RUTAS CRÍTICAS (verificación del dominio canónico)
  // ============================================================
  report.push('## 6. Rutas Críticas\n')

  const criticalRoutes = [
    '/',
    '/acceso',
    '/contacto',
    '/dashboard-delegado',
    '/dashboard-delegado/configuracion',
  ]

  for (const route of criticalRoutes) {
    try {
      const res = await fetch(`${baseUrl}${route}`, { redirect: 'manual' }).catch(() => null)

      if (!res) {
        report.push(`- **${route}:** ❌ (no responde)`)
        issues.push({ priority: 'Alta', message: `Ruta ${route} no responde` })
        continue
      }

      // 200, 302, 401, 403 son aceptables; 301 es redirect a https (esperado)
      const acceptableStatuses = [200, 301, 302, 401, 403]
      const ok = acceptableStatuses.includes(res.status)
      report.push(`- **${route}:** ${ok ? '✅' : '❌'} (${res.status})`)

      if (!ok) {
        issues.push({ priority: 'Media', message: `Ruta ${route} devuelve ${res.status}` })
      }
    } catch (e: any) {
      report.push(`- **${route}:** ❌ (${e.message})`)
    }
  }

  report.push('')

  // ============================================================
  // 7. CONCLUSIÓN
  // ============================================================
  report.push('## 7. Conclusión\n')

  const highIssues = issues.filter((i) => i.priority === 'Alta')
  const mediumIssues = issues.filter((i) => i.priority === 'Media')
  const lowIssues = issues.filter((i) => i.priority === 'Baja')

  const readyToLaunch = highIssues.length === 0

  report.push(`- **Listo para lanzar:** ${readyToLaunch ? '✅ Sí' : '❌ No'}\n`)

  if (highIssues.length > 0) {
    report.push('### Bloqueantes (Alta):\n')
    for (const issue of highIssues) {
      report.push(`- [ ] ${issue.message}`)
    }
    report.push('')
  }

  if (mediumIssues.length > 0) {
    report.push('### Pendientes (Media):\n')
    for (const issue of mediumIssues) {
      report.push(`- [ ] ${issue.message}`)
    }
    report.push('')
  }

  if (lowIssues.length > 0) {
    report.push('### Mejoras (Baja):\n')
    for (const issue of lowIssues) {
      report.push(`- [ ] ${issue.message}`)
    }
    report.push('')
  }

  if (highIssues.length === 0 && mediumIssues.length === 0 && lowIssues.length === 0) {
    report.push('🎉 **¡Todo configurado correctamente!** No se encontraron issues pendientes.\n')
  }

  report.push('> **Próximos pasos:**')
  report.push('> - Verificar Edge Functions en Supabase Dashboard')
  report.push('> - Configurar STRIPE_WEBHOOK_SECRET en Netlify cuando se active Stripe')
  report.push('> - Apuntar webhook de Stripe a: `' + baseUrl + '/api/webhooks/stripe`')
  report.push('> - Realizar pruebas end-to-end de flujos críticos')

  report.push(`\n---\n*Re-auditoría completada en ${Date.now() - startTime}ms*`)

  const markdown = report.join('\n')

  return NextResponse.json({ markdown })
}
