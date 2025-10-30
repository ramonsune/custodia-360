// ============================================================
// Edge Function: c360_boe_check
// Monitoreo automático del BOE - LOPIVI
// Custodia360 Panel Interno
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Relacion {
  norma_modificadora?: string
  relacion?: string
  texto?: string
  fecha?: string
  [key: string]: any
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Crear cliente Supabase con service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const startTime = Date.now()
    console.log('🔍 Iniciando verificación BOE LOPIVI...')

    // 1. Obtener normas vigiladas activas
    const { data: normas, error: normasError } = await supabaseClient
      .from('watched_norms')
      .select('*')
      .eq('enabled', true)

    if (normasError) {
      console.error('❌ Error obteniendo normas vigiladas:', normasError)
      throw normasError
    }

    if (!normas || normas.length === 0) {
      console.warn('⚠️ No hay normas vigiladas activas')

      await supabaseClient.from('boe_execution_logs').insert({
        status: 'warning',
        changes_found: 0,
        execution_duration_ms: Date.now() - startTime,
        error_message: 'No hay normas vigiladas activas',
        normas_checked: 0
      })

      return new Response(
        JSON.stringify({
          success: false,
          message: 'No hay normas vigiladas activas',
          normas_checked: 0,
          cambios_nuevos: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`📋 Normas vigiladas encontradas: ${normas.length}`)

    let totalCambiosNuevos = 0
    let normasVerificadas = 0
    const cambiosInsertados: any[] = [] // Para notificaciones

    // 2. Para cada norma vigilada, consultar cambios en el BOE
    for (const norma of normas) {
      try {
        console.log(`\n📖 Verificando ${norma.alias} (${norma.id})...`)

        const url = `https://www.boe.es/datosabiertos/api/legislacion/analisis/${norma.id}`

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Custodia360-BOE-Monitor/1.0'
          }
        })

        if (!response.ok) {
          console.error(`❌ Error HTTP ${response.status} para ${norma.id}`)
          continue
        }

        const data = await response.json()
        normasVerificadas++

        // 3. Procesar relaciones encontradas
        if (data.relaciones && Array.isArray(data.relaciones)) {
          console.log(`   Relaciones encontradas: ${data.relaciones.length}`)

          for (const rel: Relacion of data.relaciones) {
            const relacionUpper = (rel.relacion || '').toUpperCase()

            // Filtrar cambios significativos
            const esModificacion = relacionUpper.includes('SE MODIFICA')
            const esAnexo = relacionUpper.includes('SE AÑADE')
            const esDerogacion = relacionUpper.includes('SE DEROGA')
            const esCorreccion = relacionUpper.includes('CORRECCIÓN')

            if ((esModificacion || esAnexo || esDerogacion) && !esCorreccion) {
              // Generar hash único para evitar duplicados
              const hashData = `${norma.id}-${rel.norma_modificadora || ''}-${rel.relacion || ''}-${rel.fecha || ''}`

              const hashBuffer = await crypto.subtle.digest(
                'SHA-256',
                new TextEncoder().encode(hashData)
              )

              const hash = Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')

              // Intentar insertar el cambio
              const cambioData = {
                norma_base_id: norma.id,
                norma_mod_id: rel.norma_modificadora || '',
                relacion: rel.relacion || '',
                texto_relacion: rel.texto || null,
                fecha_relacion: rel.fecha || null,
                hash: hash,
                raw_json: rel
              }

              const { error: insertError } = await supabaseClient
                .from('boe_changes')
                .insert(cambioData)

              if (!insertError) {
                totalCambiosNuevos++
                cambiosInsertados.push(cambioData) // Guardar para notificación
                console.log(`   ✅ Nuevo cambio: ${rel.relacion}`)
              } else if (insertError.code === '23505') {
                // Código 23505 = violación de unique constraint (duplicado)
                console.log(`   ℹ️ Cambio ya registrado (hash duplicado)`)
              } else {
                console.error(`   ❌ Error insertando cambio:`, insertError)
              }
            }
          }
        } else {
          console.log(`   ℹ️ No se encontraron relaciones`)
        }

      } catch (error) {
        console.error(`❌ Error procesando ${norma.alias}:`, error)
      }
    }

    const duration = Date.now() - startTime

    // 4. Enviar notificación por email si hay cambios nuevos
    if (cambiosInsertados.length > 0) {
      try {
        console.log(`📧 Enviando notificación por email: ${cambiosInsertados.length} cambios detectados`)

        // Muestra de los primeros 3 cambios
        const muestra = cambiosInsertados
          .slice(0, 3)
          .map((x: any) => `- ${x.fecha_relacion || 'Sin fecha'} • ${x.relacion} • ${x.norma_mod_id}`)
          .join('\n')

        // Normas afectadas (únicas)
        const normasAfectadas = Array.from(
          new Set(cambiosInsertados.map((x: any) => x.norma_base_id))
        )

        // IDs de los cambios insertados (para referencia en la alerta)
        const cambiosIds = cambiosInsertados.map((x: any) => x.id).filter(Boolean)

        // Timezone y fecha
        const tz = Deno.env.get('APP_TIMEZONE') || 'Europe/Madrid'
        const fechaHora = new Date().toLocaleString('es-ES', { timeZone: tz })

        // Construir mensaje
        const mensajeTexto = `🔔 ALERTA: Cambios significativos detectados en el BOE

📊 Resumen:
• Cambios detectados: ${cambiosInsertados.length}
• Normas afectadas: ${normasAfectadas.join(', ')}

📋 Muestra de cambios (primeros 3):
${muestra}

🔗 Panel de monitoreo:
https://custodia360.netlify.app/dashboard-custodia360/monitoreo-boe

⏰ Fecha y hora: ${fechaHora}

---
Este es un mensaje automático del sistema de monitoreo BOE de Custodia360.
`

        // Mensaje HTML (opcional, más bonito)
        const mensajeHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
    .alert-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
    .change-item { background: white; padding: 10px; margin: 5px 0; border-radius: 4px; font-size: 14px; }
    .button { display: inline-block; background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🔔 Alerta BOE - LOPIVI</h1>
      <p style="margin: 10px 0 0 0;">Sistema de Monitoreo Automático</p>
    </div>
    <div class="content">
      <div class="alert-box">
        <strong>⚠️ Cambios significativos detectados</strong><br>
        Se han detectado <strong>${cambiosInsertados.length} cambios</strong> en el BOE que afectan a la normativa LOPIVI.
      </div>

      <h3>📊 Resumen de Cambios</h3>
      <p><strong>Normas afectadas:</strong> ${normasAfectadas.join(', ')}</p>

      <h3>📋 Cambios Detectados (muestra)</h3>
      ${cambiosInsertados.slice(0, 3).map((x: any) => `
        <div class="change-item">
          <strong>${x.relacion}</strong><br>
          <small>📅 ${x.fecha_relacion || 'Sin fecha'} • 📄 ${x.norma_mod_id}</small>
        </div>
      `).join('')}

      ${cambiosInsertados.length > 3 ? `<p><em>...y ${cambiosInsertados.length - 3} cambio(s) más</em></p>` : ''}

      <div style="text-align: center;">
        <a href="https://custodia360.netlify.app/dashboard-custodia360/monitoreo-boe" class="button">
          Ver Panel de Monitoreo →
        </a>
      </div>

      <div class="footer">
        <p>⏰ ${fechaHora}</p>
        <p>Este es un mensaje automático del sistema de monitoreo BOE de Custodia360</p>
      </div>
    </div>
  </div>
</body>
</html>
`

        // Obtener credenciales
        const resendApiKey = Deno.env.get('RESEND_API_KEY')
        const emailTo = Deno.env.get('NOTIFY_EMAIL_TO')
        const emailFrom = Deno.env.get('NOTIFY_EMAIL_FROM')

        if (resendApiKey && emailTo && emailFrom) {
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: emailFrom,
              to: [emailTo],
              subject: `[Custodia360] 🔔 ${cambiosInsertados.length} Cambios BOE LOPIVI detectados`,
              text: mensajeTexto,
              html: mensajeHTML
            })
          })

          if (emailResponse.ok) {
            const emailResult = await emailResponse.json()
            console.log(`✅ Email enviado correctamente:`, emailResult)
          } else {
            const errorText = await emailResponse.text()
            console.error(`❌ Error enviando email:`, emailResponse.status, errorText)
          }
        } else {
          console.warn('⚠️ No se pudo enviar email: faltan credenciales de Resend')
          console.warn(`  RESEND_API_KEY: ${resendApiKey ? 'Configurado' : 'Falta'}`)
          console.warn(`  NOTIFY_EMAIL_TO: ${emailTo || 'Falta'}`)
          console.warn(`  NOTIFY_EMAIL_FROM: ${emailFrom || 'Falta'}`)
        }

        // 4.1. Crear alerta visual en la base de datos
        try {
          console.log('📋 Creando alerta visual en boe_alerts...')

          const resumenAlerta = `${cambiosInsertados.length} cambios detectados en ${normasAfectadas.length} norma(s). ${muestra.split('\n').slice(0, 2).join('. ')}`

          const { data: alertaData, error: alertaError } = await supabaseClient
            .from('boe_alerts')
            .insert({
              fecha: new Date().toISOString(),
              total_cambios: cambiosInsertados.length,
              leido: false,
              resumen: resumenAlerta,
              normas_afectadas: normasAfectadas,
              cambios_ids: cambiosIds
            })
            .select()
            .single()

          if (alertaError) {
            console.error('❌ Error creando alerta visual:', alertaError)
          } else {
            console.log(`✅ Alerta visual creada con ID: ${alertaData?.id}`)
          }
        } catch (alertError) {
          console.error('❌ Error en creación de alerta visual:', alertError)
        }
      } catch (emailError) {
        console.error('❌ Error en el envío de notificación por email:', emailError)
        // No lanzar error, solo registrar
      }
    } else {
      console.log('ℹ️ No hay cambios nuevos, no se envía notificación')
    }

    // 5. Registrar log de ejecución exitosa
    await supabaseClient.from('boe_execution_logs').insert({
      status: 'success',
      changes_found: totalCambiosNuevos,
      execution_duration_ms: duration,
      normas_checked: normasVerificadas
    })

    const resultado = {
      success: true,
      message: `Verificación completada. ${totalCambiosNuevos} cambios nuevos detectados.`,
      cambios_nuevos: totalCambiosNuevos,
      normas_verificadas: normasVerificadas,
      duracion_ms: duration,
      timestamp: new Date().toISOString()
    }

    console.log('\n✅ Verificación BOE completada:', resultado)

    return new Response(
      JSON.stringify(resultado),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('❌ Error crítico en c360_boe_check:', error)

    // Registrar error en logs
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabaseClient.from('boe_execution_logs').insert({
        status: 'error',
        error_message: error.message || 'Error desconocido',
        execution_duration_ms: 0,
        changes_found: 0,
        normas_checked: 0
      })
    } catch (logError) {
      console.error('❌ Error registrando log de error:', logError)
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Error desconocido',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
