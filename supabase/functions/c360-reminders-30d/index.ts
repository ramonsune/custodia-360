// Edge Function: c360-reminders-30d
// Recordatorios de 30 días (D0, D+7, D+21, D+28) y alerta D+30

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Obtener entidades activas
    const { data: entities, error: entitiesError } = await supabase
      .from("entidades")
      .select("*")
      .eq("plan_estado", "activo")
      .not("fecha_contratacion", "is", null);

    if (entitiesError) throw entitiesError;
    if (!entities || entities.length === 0) {
      return new Response(
        JSON.stringify({ message: "No entities to process" }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const results = [];

    for (const entity of entities) {
      const fechaContratacion = new Date(entity.fecha_contratacion);
      fechaContratacion.setHours(0, 0, 0, 0);

      const daysSince = Math.floor(
        (today.getTime() - fechaContratacion.getTime()) / (1000 * 60 * 60 * 24)
      );

      const fechaLimite = addDays(fechaContratacion, 30);

      // D0: Envío inicial (día de contratación)
      if (daysSince === 0) {
        // Encolar onboarding-invite a personas con email pendientes
        const { data: delegados } = await supabase
          .from("delegados")
          .select("id, nombre, email")
          .eq("entity_id", entity.id)
          .not("email", "is", null);

        if (delegados && delegados.length > 0) {
          for (const delegado of delegados) {
            // Verificar si ya completó onboarding
            // (simulación - en producción verificar campos reales)
            await supabase.from("message_jobs").insert({
              entity_id: entity.id,
              template_slug: "onboarding-invite",
              context: {
                token: entity.onboarding_token,
                nombre: delegado.nombre,
                entidad: entity.nombre,
                fecha_limite: formatDate(fechaLimite),
              },
              idempotency_key: `onb-d0-${entity.id}-${delegado.id}`,
            });
          }

          results.push({
            entityId: entity.id,
            action: "D0: onboarding-invite sent",
            count: delegados.length,
          });
        }
      }

      // D+7, D+21, D+28: Recordatorios a pendientes
      if (daysSince === 7 || daysSince === 21 || daysSince === 28) {
        // Obtener pendientes (simulación)
        const { data: pendientes } = await supabase
          .from("delegados")
          .select("id, nombre, email")
          .eq("entity_id", entity.id)
          .not("email", "is", null);

        if (pendientes && pendientes.length > 0) {
          for (const pendiente of pendientes) {
            await supabase.from("message_jobs").insert({
              entity_id: entity.id,
              template_slug: "rec-30d-contacto",
              context: {
                token: entity.onboarding_token,
                nombre: pendiente.nombre,
                entidad: entity.nombre,
                fecha_limite: formatDate(fechaLimite),
                pendiente_list: "Datos personales, Documentación",
              },
              idempotency_key: `rec-d${daysSince}-${entity.id}-${pendiente.id}`,
            });
          }

          results.push({
            entityId: entity.id,
            action: `D+${daysSince}: reminder sent`,
            count: pendientes.length,
          });
        }
      }

      // D+30: Alerta al delegado principal
      if (daysSince === 30) {
        // Obtener delegado principal
        const { data: delegado } = await supabase
          .from("delegados")
          .select("id, nombre, email")
          .eq("entity_id", entity.id)
          .eq("tipo", "principal")
          .single();

        if (delegado) {
          // Obtener vencidos (simulación)
          const vencidosList = "- Juan Pérez (Datos pendientes)\n- María García (Certificados vencidos)";

          await supabase.from("message_jobs").insert({
            entity_id: entity.id,
            template_slug: "alerta-delegado-30d",
            context: {
              nombre: delegado.nombre,
              entidad: entity.nombre,
              vencidos_list: vencidosList,
            },
            idempotency_key: `alerta-d30-${entity.id}`,
          });

          results.push({
            entityId: entity.id,
            action: "D+30: alert to delegado",
          });
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: entities.length,
        results,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
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
