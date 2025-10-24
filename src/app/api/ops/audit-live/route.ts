import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Tablas core esperadas
const EXPECTED_TABLES = [
  'entities',
  'entity_people',
  'family_children',
  'entity_compliance',
  'entity_invite_tokens',
  'miniquiz_attempts',
  'message_jobs',
  'message_templates',
  'email_events',
  'subscriptions'
]

// Templates esperados (13)
const EXPECTED_TEMPLATES = [
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
  'kit-comm-invite'
]

// Workers/automatizaciones esperadas
const EXPECTED_WORKERS = [
  '/api/jobs/mailer-dispatch',
  '/api/jobs/onboarding-guard',
  '/api/jobs/compliance-guard'
]

export async function GET(req: Request) {
  const startTime = Date.now()

  try {
    console.log('[Audit] Iniciando auditoría live...')

    // Verificar variables de entorno críticas
    const envVars = {
      APP_BASE_URL: process.env.APP_BASE_URL,
      NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      NOTIFY_EMAIL_FROM: process.env.NOTIFY_EMAIL_FROM,
      APP_TIMEZONE: process.env.APP_TIMEZONE
    }

    const missingVars = Object.entries(envVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    // Crear cliente Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    // Verificar tablas Supabase
    const tableChecks: Record<string, boolean> = {}
    const tableErrors: string[] = []

    for (const table of EXPECTED_TABLES) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1)
        tableChecks[table] = !error
        if (error) {
          tableErrors.push(`${table}: ${error.message}`)
        }
      } catch (e: any) {
        tableChecks[table] = false
        tableErrors.push(`${table}: ${e.message}`)
      }
    }

    const tablesOk = Object.values(tableChecks).filter(Boolean).length
    const tablesTotal = EXPECTED_TABLES.length

    // Verificar templates
    const { data: templates, count: templatesCount } = await supabase
      .from('message_templates')
      .select('slug', { count: 'exact' })

    const foundTemplates = templates?.map(t => t.slug) || []
    const missingTemplates = EXPECTED_TEMPLATES.filter(t => !foundTemplates.includes(t))

    // Verificar message_jobs últimos 7 días
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: jobs } = await supabase
      .from('message_jobs')
      .select('status')
      .gte('created_at', sevenDaysAgo.toISOString())

    const jobsByStatus = {
      queued: jobs?.filter(j => j.status === 'queued').length || 0,
      processing: jobs?.filter(j => j.status === 'processing').length || 0,
      sent: jobs?.filter(j => j.status === 'sent').length || 0,
      failed: jobs?.filter(j => j.status === 'failed').length || 0
    }

    // Verificar tokens activos
    const { data: tokens, count: tokensCount } = await supabase
      .from('entity_invite_tokens')
      .select('id', { count: 'exact' })
      .gte('expires_at', new Date().toISOString())

    // Verificar Resend
    let resendStatus = 'unknown'
    let resendDomain = null

    try {
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const { data: domains } = await resend.domains.list()

        const custodDomain = domains?.data?.find((d: any) => d.name === 'custodia360.es')

        if (custodDomain) {
          resendStatus = custodDomain.status === 'verified' ? 'verified' : 'pending'
          resendDomain = {
            name: custodDomain.name,
            status: custodDomain.status,
            region: custodDomain.region
          }
        } else {
          resendStatus = 'not_found'
        }
      } else {
        resendStatus = 'no_api_key'
      }
    } catch (e: any) {
      resendStatus = 'manual_check'
      console.log('[Audit] Resend check failed:', e.message)
    }

    // Verificar workers (endpoints)
    const workerChecks: Record<string, boolean> = {}

    for (const worker of EXPECTED_WORKERS) {
      try {
        const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}${worker}`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(3000)
        })
        workerChecks[worker] = response.ok
      } catch {
        workerChecks[worker] = false
      }
    }

    const workersOk = Object.values(workerChecks).filter(Boolean).length

    // Determinar status global
    let globalStatus: 'ok' | 'warn' | 'fail' = 'ok'
    const warnings: string[] = []
    const failures: string[] = []

    if (missingVars.length > 0) {
      failures.push(`Variables faltantes: ${missingVars.join(', ')}`)
      globalStatus = 'fail'
    }

    if (tablesOk < tablesTotal) {
      failures.push(`Tablas faltantes: ${tablesTotal - tablesOk}/${tablesTotal}`)
      globalStatus = 'fail'
    }

    if (missingTemplates.length > 0) {
      warnings.push(`Templates faltantes: ${missingTemplates.length}`)
      if (globalStatus === 'ok') globalStatus = 'warn'
    }

    if (tokensCount === 0) {
      warnings.push('No hay tokens activos')
      if (globalStatus === 'ok') globalStatus = 'warn'
    }

    if (resendStatus !== 'verified') {
      warnings.push(`Resend domain: ${resendStatus}`)
      if (globalStatus === 'ok') globalStatus = 'warn'
    }

    if (workersOk < EXPECTED_WORKERS.length) {
      warnings.push(`Workers faltantes: ${EXPECTED_WORKERS.length - workersOk}`)
      if (globalStatus === 'ok') globalStatus = 'warn'
    }

    if (jobsByStatus.failed > 10) {
      warnings.push(`${jobsByStatus.failed} jobs fallidos en últimos 7 días`)
      if (globalStatus === 'ok') globalStatus = 'warn'
    }

    // Generar resumen
    const summary = globalStatus === 'ok'
      ? '✅ Sistema operativo'
      : globalStatus === 'warn'
      ? `⚠️ ${warnings.length} advertencias`
      : `❌ ${failures.length} fallos críticos`

    // Generar detalles estructurados
    const details = {
      timestamp: new Date().toISOString(),
      duration_ms: Date.now() - startTime,
      environment_variables: {
        total: Object.keys(envVars).length,
        configured: Object.keys(envVars).length - missingVars.length,
        missing: missingVars
      },
      supabase: {
        tables: {
          total: tablesTotal,
          found: tablesOk,
          missing: EXPECTED_TABLES.filter(t => !tableChecks[t])
        },
        templates: {
          total: EXPECTED_TEMPLATES.length,
          found: templatesCount || 0,
          missing: missingTemplates
        },
        message_jobs: jobsByStatus,
        active_tokens: tokensCount || 0
      },
      resend: {
        status: resendStatus,
        domain: resendDomain
      },
      workers: {
        total: EXPECTED_WORKERS.length,
        found: workersOk,
        checks: workerChecks
      },
      warnings,
      failures
    }

    // Generar markdown
    const markdown = generateMarkdown(globalStatus, summary, details)

    // Guardar en admin_health_logs
    const { data: logEntry, error: logError } = await supabase
      .from('admin_health_logs')
      .insert({
        scope: 'daily_audit',
        status: globalStatus,
        summary,
        details,
        markdown
      })
      .select()
      .single()

    if (logError) {
      console.error('[Audit] Error guardando log:', logError)
    }

    console.log(`[Audit] Completada en ${Date.now() - startTime}ms - Status: ${globalStatus}`)

    return NextResponse.json({
      ok: true,
      status: globalStatus,
      log_id: logEntry?.id,
      summary,
      details
    })

  } catch (error: any) {
    console.error('[Audit] Error:', error)
    return NextResponse.json({
      ok: false,
      error: error.message
    }, { status: 500 })
  }
}

function generateMarkdown(status: string, summary: string, details: any): string {
  const now = new Date()
  const madridTime = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    dateStyle: 'full',
    timeStyle: 'medium'
  }).format(now)

  let md = `# 📊 Auditoría Diaria - Custodia360\n\n`
  md += `**Fecha:** ${madridTime}\n`
  md += `**Estado:** ${summary}\n`
  md += `**Duración:** ${details.duration_ms}ms\n\n`

  md += `## Variables de Entorno\n`
  md += `- Configuradas: ${details.environment_variables.configured}/${details.environment_variables.total}\n`
  if (details.environment_variables.missing.length > 0) {
    md += `- ❌ Faltantes: ${details.environment_variables.missing.join(', ')}\n`
  }
  md += `\n`

  md += `## Supabase\n`
  md += `- Tablas: ${details.supabase.tables.found}/${details.supabase.tables.total}\n`
  if (details.supabase.tables.missing.length > 0) {
    md += `  - ❌ Faltantes: ${details.supabase.tables.missing.join(', ')}\n`
  }
  md += `- Templates: ${details.supabase.templates.found}/${details.supabase.templates.total}\n`
  if (details.supabase.templates.missing.length > 0) {
    md += `  - ⚠️ Faltantes: ${details.supabase.templates.missing.join(', ')}\n`
  }
  md += `- Jobs (7d): queued=${details.supabase.message_jobs.queued}, processing=${details.supabase.message_jobs.processing}, sent=${details.supabase.message_jobs.sent}, failed=${details.supabase.message_jobs.failed}\n`
  md += `- Tokens activos: ${details.supabase.active_tokens}\n\n`

  md += `## Resend\n`
  md += `- Estado: ${details.resend.status}\n`
  if (details.resend.domain) {
    md += `- Dominio: ${details.resend.domain.name} (${details.resend.domain.status})\n`
    md += `- Región: ${details.resend.domain.region}\n`
  }
  md += `\n`

  md += `## Workers\n`
  md += `- Detectados: ${details.workers.found}/${details.workers.total}\n`
  md += `\n`

  if (details.warnings.length > 0) {
    md += `## ⚠️ Advertencias\n`
    details.warnings.forEach((w: string) => {
      md += `- ${w}\n`
    })
    md += `\n`
  }

  if (details.failures.length > 0) {
    md += `## ❌ Fallos Críticos\n`
    details.failures.forEach((f: string) => {
      md += `- ${f}\n`
    })
    md += `\n`
  }

  md += `---\n`
  md += `*Auditoría generada automáticamente*\n`

  return md
}
