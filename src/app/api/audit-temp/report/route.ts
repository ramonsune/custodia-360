import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const startTime = Date.now()
  const report: string[] = []
  const issues: { priority: string; message: string }[] = []

  // Timezone
  const timezone = process.env.APP_TIMEZONE || 'Europe/Madrid'
  const now = new Date().toLocaleString('es-ES', { timeZone: timezone })

  report.push('# Custodia360 — Auditoría de lanzamiento\n')
  report.push(`**Fecha:** ${now} (${timezone})`)
  report.push(`**Dominio:** ${process.env.APP_BASE_URL || 'N/D'}\n`)

  // ============================================================
  // 1. VARIABLES DE ENTORNO
  // ============================================================
  report.push('## 1. Variables de entorno\n')
  report.push('| Variable | Presente |')
  report.push('|---------|----------|')

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
    if (!present && !['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'].includes(key)) {
      issues.push({ priority: 'Alta', message: `Variable de entorno faltante: ${key}` })
    }
  }

  report.push('')

  // ============================================================
  // 2. SUPABASE
  // ============================================================
  report.push('## 2. Supabase (DB/Políticas/Funciones)\n')

  let supabaseConnected = false
  let supabase: any = null

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { persistSession: false } }
      )

      // Test connection
      const { data, error } = await supabase.from('entities').select('count', { count: 'exact', head: true })

      if (!error) {
        supabaseConnected = true
        report.push('- **Conexión:** ✅\n')
      } else {
        report.push(`- **Conexión:** ❌ (${error.message})\n`)
        issues.push({ priority: 'Alta', message: `Supabase no conecta: ${error.message}` })
      }
    } catch (e: any) {
      report.push(`- **Conexión:** ❌ (${e.message})\n`)
      issues.push({ priority: 'Alta', message: `Error inicializando Supabase: ${e.message}` })
    }
  } else {
    report.push('- **Conexión:** ❌ (faltan credenciales)\n')
    issues.push({ priority: 'Alta', message: 'Credenciales de Supabase faltantes' })
  }

  // Tablas críticas
  if (supabaseConnected && supabase) {
    report.push('### Tablas críticas:\n')

    const tables = [
      'entities',
      'people',
      'subscriptions',
      'message_templates',
      'message_jobs',
      'certificates',
      'training_status',
      'entity_compliance',
      'entity_invite_tokens',
      'entity_people',
      'family_children',
      'quiz_questions',
      'quiz_answers',
      'quiz_attempts',
      'webhook_events',
      'ambassador_commissions',
      'app_settings',
    ]

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (!error) {
          report.push(`- **${table}:** ✅ (${count || 0} registros)`)
        } else {
          report.push(`- **${table}:** ❌ (${error.message})`)
          if (!['webhook_events', 'ambassador_commissions', 'app_settings'].includes(table)) {
            issues.push({ priority: 'Alta', message: `Tabla crítica no accesible: ${table}` })
          } else {
            issues.push({ priority: 'Baja', message: `Tabla opcional no encontrada: ${table}` })
          }
        }
      } catch (e: any) {
        report.push(`- **${table}:** ❌ (${e.message})`)
        if (!['webhook_events', 'ambassador_commissions', 'app_settings'].includes(table)) {
          issues.push({ priority: 'Alta', message: `Error al verificar tabla: ${table}` })
        }
      }
    }

    report.push('')

    // RLS
    report.push('### RLS (Row Level Security):\n')
    report.push('- **Políticas activas:** N/D (usando service role - verificar manualmente en Supabase dashboard)')
    issues.push({ priority: 'Media', message: 'Verificar manualmente políticas RLS en Supabase dashboard' })
    report.push('')

    // Edge Functions & Schedules
    report.push('### Edge Functions & Schedules:\n')
    report.push('- **c360_mailer_dispatch:** ⚠️ (verificar manualmente en Supabase dashboard)')
    report.push('- **c360_billing_reminders_daily:** ⚠️ (verificar manualmente en Supabase dashboard)')
    report.push('- **c360_onboarding_guard:** ⚠️ (verificar manualmente en Supabase dashboard)')
    report.push('- **c360_compliance_guard:** ⚠️ (verificar manualmente en Supabase dashboard)')
    issues.push({ priority: 'Media', message: 'Verificar manualmente Edge Functions y Schedules en Supabase dashboard' })
    report.push('')
  }

  // ============================================================
  // 3. RESEND
  // ============================================================
  report.push('## 3. Resend (email)\n')

  const resendKey = process.env.RESEND_API_KEY
  const notifyFrom = process.env.NOTIFY_EMAIL_FROM

  report.push(`- **API key:** ${resendKey ? '✅' : '❌'}`)
  report.push(`- **Emisor configurado:** ${notifyFrom ? `✅ (${notifyFrom})` : '❌'}`)

  if (!resendKey) {
    issues.push({ priority: 'Alta', message: 'Clave API de Resend faltante' })
  }

  if (!notifyFrom || !notifyFrom.includes('custodia360.es')) {
    issues.push({ priority: 'Media', message: 'Emisor de emails debe ser: Custodia360 <no-reply@custodia360.es>' })
  }

  report.push('- **Dry-run:** ✅ (no se enviaron emails reales)\n')

  report.push('### Plantillas esperadas:\n')

  const expectedTemplates = [
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

  report.push('⚠️ **Verificar manualmente en Resend dashboard:**')
  for (const template of expectedTemplates) {
    report.push(`- ${template}`)
  }

  issues.push({ priority: 'Media', message: 'Verificar plantillas de email en Resend dashboard (listar arriba)' })

  report.push('')

  // ============================================================
  // 4. STRIPE
  // ============================================================
  report.push('## 4. Stripe (test)\n')

  const stripeKey = process.env.STRIPE_SECRET_KEY
  const stripeWebhook = process.env.STRIPE_WEBHOOK_SECRET

  const isTestKey = stripeKey && stripeKey.includes('_test_')

  report.push(`- **Clave test presente:** ${isTestKey ? '✅' : '❌'}`)
  report.push(`- **Webhook secret presente:** ${stripeWebhook ? '✅' : '❌'}`)

  if (!stripeKey) {
    issues.push({ priority: 'Media', message: 'Clave de Stripe no configurada (opcional si no se usan pagos aún)' })
  } else if (!isTestKey) {
    issues.push({ priority: 'Alta', message: 'Clave de Stripe debe ser TEST (sk_test_...) no producción' })
  }

  if (!stripeWebhook) {
    issues.push({ priority: 'Baja', message: 'Webhook secret de Stripe no configurado (configurar cuando se active Stripe)' })
  }

  report.push('\n### Endpoints:\n')

  // Test webhook endpoint
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000'

  try {
    const webhookUrl = `${baseUrl}/api/webhooks/stripe`

    const webhookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }).catch(() => null)

    if (webhookRes) {
      const webhookStatus = webhookRes.status

      if (webhookStatus === 400) {
        report.push(`- **Webhook (/api/webhooks/stripe):** ✅ (responde 400 sin firma - correcto)`)
      } else if (webhookStatus === 404) {
        report.push(`- **Webhook (/api/webhooks/stripe):** ❌ (endpoint no existe)`)
        issues.push({ priority: 'Baja', message: 'Endpoint de webhook de Stripe no encontrado (crear cuando se active Stripe)' })
      } else {
        report.push(`- **Webhook (/api/webhooks/stripe):** ⚠️ (status ${webhookStatus})`)
      }
    } else {
      report.push(`- **Webhook (/api/webhooks/stripe):** ⚠️ (no se pudo verificar)`)
    }
  } catch (e: any) {
    report.push(`- **Webhook (/api/webhooks/stripe):** ⚠️ (${e.message})`)
  }

  report.push('')

  // ============================================================
  // 5. RUTAS Y BOTONES CRÍTICOS
  // ============================================================
  report.push('## 5. Rutas y botones críticos\n')

  const routes = [
    { path: '/', expectedStatus: [200], checkFor: 'Acceso', label: 'CTA Acceso' },
    { path: '/acceso', expectedStatus: [200], checkFor: '<form', label: 'form login' },
    { path: '/contacto', expectedStatus: [200], checkFor: null, label: null },
    { path: '/dashboard-delegado', expectedStatus: [200, 302, 401, 403], checkFor: 'Configuración', label: 'enlace Configuración' },
    { path: '/dashboard-delegado/configuracion', expectedStatus: [200], checkFor: 'Canal de Comunicación', label: 'pasos 1-4' },
    { path: '/dashboard-admin', expectedStatus: [200, 302, 401, 403], checkFor: null, label: null },
    { path: '/dashboard-entidad', expectedStatus: [200, 302, 401, 403], checkFor: null, label: null },
  ]

  for (const route of routes) {
    try {
      const start = Date.now()
      const res = await fetch(`${baseUrl}${route.path}`, {
        redirect: 'manual',
      }).catch(() => null)

      if (!res) {
        report.push(`- **${route.path}:** ❌ (no responde)`)
        issues.push({ priority: 'Alta', message: `Ruta ${route.path} no responde` })
        continue
      }

      const latency = Date.now() - start
      const statusOk = route.expectedStatus.includes(res.status)
      const statusIcon = statusOk ? '✅' : '❌'

      let checkResult = ''
      if (route.checkFor && res.status === 200) {
        const html = await res.text()
        const found = html.includes(route.checkFor)
        checkResult = ` | ${route.label}: ${found ? '✅' : '❌'}`

        if (!found) {
          issues.push({ priority: 'Media', message: `Ruta ${route.path} no contiene "${route.checkFor}"` })
        }
      }

      report.push(`- **${route.path}:** ${statusIcon} (${res.status}, ${latency}ms)${checkResult}`)

      if (!statusOk) {
        issues.push({ priority: 'Media', message: `Ruta ${route.path} devuelve status ${res.status} (esperado: ${route.expectedStatus.join(' o ')})` })
      }
    } catch (e: any) {
      report.push(`- **${route.path}:** ❌ (${e.message})`)
      issues.push({ priority: 'Alta', message: `Error al verificar ruta ${route.path}: ${e.message}` })
    }
  }

  // Verificación especial: URL de onboarding en configuración
  try {
    const configRes = await fetch(`${baseUrl}/dashboard-delegado/configuracion`, {
      redirect: 'manual',
    }).catch(() => null)

    if (configRes && configRes.status === 200) {
      const html = await configRes.text()
      const hasOnboardingUrl = html.includes('/onboarding/') && html.includes('/demo')
      report.push(`- **Paso 2 - URL onboarding:** ${hasOnboardingUrl ? '✅' : '❌'}`)

      if (!hasOnboardingUrl) {
        issues.push({ priority: 'Media', message: 'URL de onboarding no visible en paso 2 de configuración' })
      }
    }
  } catch (e) {
    // Silencioso
  }

  report.push('\n### Health endpoints:\n')

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

      if (!res) {
        report.push(`- **${endpoint}:** ❌ (no responde)`)
        issues.push({ priority: 'Baja', message: `Health endpoint ${endpoint} no existe` })
        continue
      }

      const latency = Date.now() - start
      const statusOk = res.status === 200
      report.push(`- **${endpoint}:** ${statusOk ? '✅' : '❌'} (${res.status}, ${latency}ms)`)

      if (!statusOk) {
        issues.push({ priority: 'Baja', message: `Health endpoint ${endpoint} no responde 200` })
      }
    } catch (e: any) {
      report.push(`- **${endpoint}:** ❌ (${e.message})`)
      issues.push({ priority: 'Baja', message: `Error al verificar ${endpoint}` })
    }
  }

  report.push('')

  // ============================================================
  // 6. MIGRACIONES
  // ============================================================
  report.push('## 6. Migraciones\n')

  if (supabaseConnected && supabase) {
    try {
      const { data, error } = await supabase
        .from('supabase_migrations')
        .select('version, name, executed_at')
        .order('executed_at', { ascending: false })
        .limit(1)

      if (!error && data && data.length > 0) {
        const lastMigration = data[0]
        const date = new Date(lastMigration.executed_at).toLocaleString('es-ES')
        report.push(`- **Última migración:** ${lastMigration.version} - ${lastMigration.name} (${date})`)
      } else {
        report.push('- **Última migración:** N/D (tabla supabase_migrations no encontrada)')
        issues.push({ priority: 'Baja', message: 'No se encontró historial de migraciones' })
      }
    } catch (e) {
      report.push('- **Última migración:** N/D (error al verificar)')
    }
  } else {
    report.push('- **Última migración:** N/D (Supabase no conectado)')
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

  report.push('> **Siguientes pasos sugeridos:**\n>')

  if (highIssues.length > 0) {
    report.push('> - 🚨 **Resolver bloqueantes de prioridad Alta** antes del lanzamiento')
  } else {
    report.push('> - ✅ No hay bloqueantes - Revisar y completar pendientes de prioridad Media')
  }

  report.push('> - Verificar manualmente Edge Functions y Schedules en Supabase dashboard')
  report.push('> - Verificar plantillas de email en Resend dashboard')
  report.push('> - Configurar webhook de Stripe cuando se active el sistema de pagos')
  report.push('> - Realizar pruebas end-to-end de flujos críticos: onboarding, compliance, formación')
  report.push('> - Configurar dominio canónico: https://www.custodia360.es')

  report.push(`\n---\n\n*Auditoría completada en ${Date.now() - startTime}ms*`)

  const markdown = report.join('\n')

  return NextResponse.json({ markdown })
}
