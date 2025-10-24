// Edge Function: c360_compliance_guard
// Se ejecuta diariamente para verificar compliance y bloquear entidades
// Cron: 0 7 * * * (09:00 Europe/Madrid)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const resendApiKey = Deno.env.get('RESEND_API_KEY')!
const notifyEmailFrom = Deno.env.get('NOTIFY_EMAIL_FROM') || 'no-reply@custodia360.es'

serve(async (req) => {
  try {
    console.log('🔒 [COMPLIANCE-GUARD] Iniciando verificación diaria...')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Seleccionar entidades con deadline vencido y requisitos pendientes
    const { data: expiredCompliances, error } = await supabase
      .from('entity_compliance')
      .select(`
        entity_id,
        deadline_at,
        channel_done,
        channel_verified,
        riskmap_done,
        penales_done,
        blocked,
        entities (
          id,
          nombre,
          contractor_email
        )
      `)
      .eq('blocked', false)
      .lt('deadline_at', new Date().toISOString())

    if (error) {
      console.error('❌ [COMPLIANCE-GUARD] Error consultando:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!expiredCompliances || expiredCompliances.length === 0) {
      console.log('✅ [COMPLIANCE-GUARD] No hay entidades con compliance vencido')
      return new Response(
        JSON.stringify({ success: true, message: 'No pending expirations' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(`📋 [COMPLIANCE-GUARD] Encontradas ${expiredCompliances.length} entidades vencidas`)

    const results = []

    for (const comp of expiredCompliances) {
      const faltantes = []

      if (!comp.channel_done) faltantes.push('Canal de comunicación')
      if (!comp.riskmap_done) faltantes.push('Lectura de Mapa de Riesgos')
      if (!comp.penales_done) faltantes.push('Certificado de Penales')

      // Si hay faltantes, bloquear
      if (faltantes.length > 0) {
        const blocked_reason = faltantes.join(', ')

        // Actualizar entity_compliance
        const { error: updateError } = await supabase
          .from('entity_compliance')
          .update({
            blocked: true,
            blocked_reason
          })
          .eq('entity_id', comp.entity_id)

        if (updateError) {
          console.error(`❌ [COMPLIANCE-GUARD] Error bloqueando entidad ${comp.entity_id}:`, updateError)
          continue
        }

        console.log(`🔒 [COMPLIANCE-GUARD] Bloqueada entidad ${comp.entity_id}: ${blocked_reason}`)

        // Enviar email al contratante si existe
        if (comp.entities?.contractor_email) {
          const faltantesHtml = faltantes.map(f => `<li>${f}</li>`).join('')

          try {
            const emailRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: notifyEmailFrom,
                to: comp.entities.contractor_email,
                subject: 'Custodia360 | Bloqueo de panel por requisitos LOPIVI pendientes',
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #dc2626;">⚠️ Bloqueo de panel por requisitos pendientes</h2>
                    <p>Hola,</p>
                    <p>Te informamos que la entidad <strong>${comp.entities.nombre}</strong> ha sido bloqueada por no completar en 30 días los siguientes requisitos obligatorios de la LOPIVI:</p>
                    <ul style="color: #dc2626; font-weight: bold;">
                      ${faltantesHtml}
                    </ul>
                    <p>El Delegado de Protección debe acceder a su panel y completar la sección "Configuración" para restablecer el acceso.</p>
                    <p style="margin-top: 30px; padding: 15px; background: #fef2f2; border-left: 4px solid #dc2626;">
                      <strong>Importante:</strong> El acceso al panel permanecerá bloqueado hasta completar todos los requisitos.
                    </p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
                    <p style="color: #999; font-size: 12px;">
                      Si necesitas ayuda, contacta con soporte:<br />
                      Email: info@custodia360.es<br />
                      Web: <a href="https://www.custodia360.es">www.custodia360.es</a><br />
                      <br />
                      Equipo Custodia360
                    </p>
                  </div>
                `
              })
            })

            if (emailRes.ok) {
              console.log(`📧 [COMPLIANCE-GUARD] Email enviado a ${comp.entities.contractor_email}`)

              // Registrar notificación
              await supabase.from('compliance_notifications').insert({
                entity_id: comp.entity_id,
                type: 'blocked',
                sent_to: comp.entities.contractor_email,
                payload: { faltantes, blocked_reason }
              })
            } else {
              console.error(`❌ [COMPLIANCE-GUARD] Error enviando email:`, await emailRes.text())
            }
          } catch (emailError) {
            console.error(`❌ [COMPLIANCE-GUARD] Error en envío de email:`, emailError)
          }
        }

        results.push({
          entity_id: comp.entity_id,
          entity_name: comp.entities?.nombre,
          blocked: true,
          reason: blocked_reason,
          email_sent: !!comp.entities?.contractor_email
        })
      }
    }

    console.log(`✅ [COMPLIANCE-GUARD] Proceso completado. Bloqueadas: ${results.length}`)

    return new Response(
      JSON.stringify({
        success: true,
        processed: expiredCompliances.length,
        blocked: results.length,
        results
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('❌ [COMPLIANCE-GUARD] Error general:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
