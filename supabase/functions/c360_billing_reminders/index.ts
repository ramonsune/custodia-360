// Edge Function: c360_billing_reminders
// Envía recordatorios de facturación a 5 meses (30 días antes del 2º tramo) y 11 meses (30 días antes del pago anual)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const today = new Date();
    const results = {
      fiveMonthReminders: 0,
      elevenMonthReminders: 0,
      errors: [] as string[],
    };

    // Obtener entidades activas con subscripción
    const { data: entities, error: entitiesError } = await supabase
      .from("entidades")
      .select("id, nombre, admin_email, plan_nombre, contract_start_at, created_at")
      .not("admin_email", "is", null);

    if (entitiesError) {
      throw entitiesError;
    }

    if (!entities || entities.length === 0) {
      return new Response(
        JSON.stringify({ message: "No entities found", results }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    for (const entity of entities) {
      try {
        // Usar contract_start_at o created_at como fecha de contratación
        const contractDate = entity.contract_start_at
          ? new Date(entity.contract_start_at)
          : new Date(entity.created_at);

        // Calcular diferencia en días desde la contratación
        const daysSinceContract = Math.floor(
          (today.getTime() - contractDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Recordatorio a 5 meses (150 días) - 30 días antes del 2º tramo (que sería a 6 meses = 180 días)
        // Enviar cuando daysSinceContract esté entre 150 y 151 días (ventana de 1 día para evitar duplicados)
        if (daysSinceContract >= 150 && daysSinceContract < 151) {
          // Verificar si ya se envió este recordatorio
          const { data: existing } = await supabase
            .from("message_jobs")
            .select("id")
            .eq("entity_id", entity.id)
            .eq("template_slug", "billing-5m-reminder")
            .single();

          if (!existing) {
            // Encolar recordatorio de 5 meses
            const { data: job, error: jobError } = await supabase
              .from("message_jobs")
              .insert({
                entity_id: entity.id,
                template_slug: "billing-5m-reminder",
                channel: "email",
                context: {
                  entidad: entity.nombre,
                  plan_nombre: entity.plan_nombre || "Plan Custodia360",
                },
                status: "queued",
                idempotency_key: `billing-5m-${entity.id}`,
              })
              .select()
              .single();

            if (jobError) {
              results.errors.push(
                `Error creating job for ${entity.id}: ${jobError.message}`
              );
              continue;
            }

            await supabase.from("message_recipients").insert({
              job_id: job.id,
              to_email: entity.admin_email,
              status: "pending",
            });

            results.fiveMonthReminders++;
            console.log(`✅ Recordatorio 5 meses encolado para: ${entity.nombre}`);
          }
        }

        // Recordatorio a 11 meses (330 días) - 30 días antes del pago anual (que sería a 12 meses = 360 días)
        // Enviar cuando daysSinceContract esté entre 330 y 331 días
        if (daysSinceContract >= 330 && daysSinceContract < 331) {
          const { data: existing } = await supabase
            .from("message_jobs")
            .select("id")
            .eq("entity_id", entity.id)
            .eq("template_slug", "billing-11m-reminder")
            .single();

          if (!existing) {
            const { data: job, error: jobError } = await supabase
              .from("message_jobs")
              .insert({
                entity_id: entity.id,
                template_slug: "billing-11m-reminder",
                channel: "email",
                context: {
                  entidad: entity.nombre,
                  plan_nombre: entity.plan_nombre || "Plan Custodia360",
                },
                status: "queued",
                idempotency_key: `billing-11m-${entity.id}`,
              })
              .select()
              .single();

            if (jobError) {
              results.errors.push(
                `Error creating job for ${entity.id}: ${jobError.message}`
              );
              continue;
            }

            await supabase.from("message_recipients").insert({
              job_id: job.id,
              to_email: entity.admin_email,
              status: "pending",
            });

            results.elevenMonthReminders++;
            console.log(`✅ Recordatorio 11 meses encolado para: ${entity.nombre}`);
          }
        }
      } catch (entityError: any) {
        results.errors.push(
          `Error processing entity ${entity.id}: ${entityError.message}`
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Billing reminders processed",
        results,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("❌ Error in billing reminders:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
