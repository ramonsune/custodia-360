#!/usr/bin/env bun

import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const TEST_EMAIL = process.env.TEST_EMAIL || 'test@custodia360.es'

async function testResendTrace() {
  console.log('🧪 Iniciando prueba de trazabilidad Resend...\n')

  // Verificar variables
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY no configurado')
    process.exit(1)
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Variables de Supabase no configuradas')
    process.exit(1)
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  // 1) Verificar dominio en Resend
  console.log('1️⃣ Verificando dominio...')
  let custodiaDomain: any = null
  try {
    const { data: domains } = await resend.domains.list()
    custodiaDomain = domains?.data?.find((d: any) => d.name === 'custodia360.es')

    if (custodiaDomain) {
      console.log(`   ✅ Dominio custodia360.es encontrado`)
      console.log(`   Estado: ${custodiaDomain.status}`)
      console.log(`   Región: ${custodiaDomain.region || 'N/A'}`)
    } else {
      console.log(`   ⚠️ Dominio custodia360.es no encontrado en Resend`)
    }
  } catch (error: any) {
    console.error(`   ❌ Error verificando dominio: ${error.message}`)
  }

  // 2) Contar plantillas en Supabase
  console.log('\n2️⃣ Verificando plantillas en Supabase...')
  const { data: templates, count } = await supabase
    .from('message_templates')
    .select('slug', { count: 'exact' })

  console.log(`   ✅ ${count || 0} plantillas encontradas`)
  if (templates && templates.length > 0) {
    console.log(`   Primeras 5: ${templates.slice(0, 5).map(t => t.slug).join(', ')}`)
  }

  // 3) Enviar email de prueba
  console.log('\n3️⃣ Enviando email de prueba...')
  const testSubject = `[TEST] Resend Trazabilidad - ${new Date().toISOString()}`

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.NOTIFY_EMAIL_FROM || 'no-reply@custodia360.es',
      to: TEST_EMAIL,
      subject: testSubject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #ea580c;">🧪 Prueba de Trazabilidad Resend</h2>
          <p>Este es un email de prueba para verificar la integración con Resend y la trazabilidad en Supabase.</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</p>
          <p><strong>Sistema:</strong> Custodia360</p>
          <hr />
          <p style="color: #666; font-size: 12px;">
            Este mensaje fue generado automáticamente por el sistema de pruebas.
          </p>
        </div>
      `,
      tags: [
        { name: 'test', value: 'resend-trace' },
        { name: 'entity_id', value: 'demo_entity_001' }
      ]
    })

    if (error) {
      console.error(`   ❌ Error enviando email: ${error.message}`)
      throw error
    }

    console.log(`   ✅ Email enviado exitosamente`)
    console.log(`   ID: ${data?.id}`)

    // 4) Esperar y verificar eventos
    console.log('\n4️⃣ Esperando eventos de Resend (10 segundos)...')
    await new Promise(resolve => setTimeout(resolve, 10000))

    console.log('   Consultando email_events...')
    const { data: events, error: eventsError } = await supabase
      .from('email_events')
      .select('*')
      .or(`message_id.eq.${data?.id},subject.eq.${testSubject}`)
      .order('created_at', { ascending: false })
      .limit(5)

    if (eventsError) {
      console.error(`   ⚠️ Error consultando eventos: ${eventsError.message}`)
    } else if (events && events.length > 0) {
      console.log(`   ✅ ${events.length} evento(s) encontrado(s):`)
      events.forEach((e, i) => {
        console.log(`      ${i + 1}. ${e.event} - ${e.to_email} - ${new Date(e.created_at).toLocaleString('es-ES')}`)
      })
    } else {
      console.log(`   ⚠️ No se encontraron eventos aún (puede tardar unos minutos)`)
      console.log(`   Nota: Verifica que el webhook esté configurado en Resend Dashboard`)
    }

    // 5) Mostrar últimos eventos generales
    console.log('\n5️⃣ Últimos 5 eventos de email registrados:')
    const { data: recentEvents } = await supabase
      .from('email_events')
      .select('event, to_email, subject, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentEvents && recentEvents.length > 0) {
      recentEvents.forEach((e, i) => {
        console.log(`   ${i + 1}. [${e.event}] ${e.to_email} - "${e.subject}" - ${new Date(e.created_at).toLocaleString('es-ES')}`)
      })
    } else {
      console.log('   ⚠️ No hay eventos registrados')
    }

    // 6) Generar informe
    console.log('\n6️⃣ Generando informe...')
    const reportContent = generateReport({
      domain: custodiaDomain,
      templatesCount: count || 0,
      emailSent: data,
      eventsFound: events?.length || 0,
      recentEvents: recentEvents || []
    })

    const fs = await import('fs/promises')
    const path = await import('path')
    const reportPath = path.join(process.cwd(), 'INFORME-RESEND-LIVE.md')
    await fs.writeFile(reportPath, reportContent, 'utf-8')

    console.log(`   ✅ Informe guardado: ${reportPath}`)

    console.log('\n✅ Prueba completada exitosamente\n')

  } catch (error: any) {
    console.error(`\n❌ Error en la prueba: ${error.message}`)
    process.exit(1)
  }
}

function generateReport(data: any) {
  const now = new Date()
  const madridTime = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    dateStyle: 'full',
    timeStyle: 'medium'
  }).format(now)

  let report = `# 📧 Informe Resend Live - Custodia360\n\n`
  report += `**Fecha de ejecución:** ${madridTime}\n`
  report += `**Sistema:** Custodia360 - Prueba de trazabilidad email\n\n`

  report += `## 🌐 Estado del Dominio\n`
  if (data.domain) {
    report += `- Dominio: **custodia360.es**\n`
    report += `- Estado: **${data.domain.status}** ${data.domain.status === 'verified' ? '✅' : '⚠️'}\n`
    report += `- Región: ${data.domain.region || 'N/A'}\n`
  } else {
    report += `- ⚠️ Dominio no encontrado o no verificado\n`
  }
  report += `\n`

  report += `## 📋 Plantillas\n`
  report += `- Total plantillas en Supabase: **${data.templatesCount}**\n`
  report += `- Esperadas: **13**\n`
  report += `- Estado: ${data.templatesCount >= 13 ? '✅ Completo' : '⚠️ Incompleto'}\n\n`

  report += `## 📨 Prueba de Envío\n`
  if (data.emailSent) {
    report += `- ✅ Email enviado exitosamente\n`
    report += `- ID: \`${data.emailSent.id}\`\n`
    report += `- Destinatario: ${TEST_EMAIL}\n`
  } else {
    report += `- ❌ No se pudo enviar el email de prueba\n`
  }
  report += `\n`

  report += `## 🔍 Trazabilidad\n`
  report += `- Eventos encontrados para este email: **${data.eventsFound}**\n`
  if (data.eventsFound > 0) {
    report += `- ✅ Webhook funcionando correctamente\n`
  } else {
    report += `- ⚠️ No se detectaron eventos (puede tardar unos minutos)\n`
    report += `- **Acción requerida:** Verificar configuración del webhook en Resend Dashboard\n`
  }
  report += `\n`

  report += `## 📊 Últimos Eventos Registrados\n`
  if (data.recentEvents && data.recentEvents.length > 0) {
    report += `\n| Evento | Destinatario | Asunto | Fecha |\n`
    report += `|--------|-------------|--------|-------|\n`
    data.recentEvents.forEach((e: any) => {
      const date = new Date(e.created_at).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
      report += `| ${e.event} | ${e.to_email} | ${e.subject || 'N/A'} | ${date} |\n`
    })
  } else {
    report += `- ⚠️ No hay eventos registrados en la base de datos\n`
  }
  report += `\n`

  report += `## ✅ Recomendaciones\n`
  const recommendations: string[] = []

  if (!data.domain || data.domain.status !== 'verified') {
    recommendations.push('Verificar dominio custodia360.es en Resend Dashboard')
  }

  if (data.templatesCount < 13) {
    recommendations.push('Crear plantillas faltantes en Supabase (message_templates)')
  }

  if (data.eventsFound === 0) {
    recommendations.push('Configurar webhook en Resend Dashboard: https://www.custodia360.es/api/webhooks/resend')
    recommendations.push('Eventos a habilitar: email.sent, email.delivered, email.opened, email.clicked, email.bounced')
  }

  if (recommendations.length === 0) {
    report += `- ✅ Sistema completamente funcional - No hay acciones pendientes\n`
  } else {
    recommendations.forEach((rec, i) => {
      report += `${i + 1}. ${rec}\n`
    })
  }
  report += `\n`

  report += `## 🎯 Conclusión\n`
  const allOk = data.domain?.status === 'verified' &&
                data.templatesCount >= 13 &&
                data.eventsFound > 0

  if (allOk) {
    report += `**Estado:** ✅ **LISTO** - Sistema de emails completamente operativo\n`
  } else if (data.eventsFound > 0) {
    report += `**Estado:** ⚠️ **CASI LISTO** - Webhook funcionando, verificar detalles menores\n`
  } else {
    report += `**Estado:** ⚠️ **PENDIENTE** - Configurar webhook de Resend\n`
  }

  report += `\n---\n`
  report += `*Informe generado automáticamente el ${madridTime}*\n`

  return report
}

testResendTrace()
