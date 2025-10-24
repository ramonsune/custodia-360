// Edge Function: c360_mailer_dispatch
// Procesa jobs encolados y envía emails via Resend

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
const notifyEmailFrom = Deno.env.get("NOTIFY_EMAIL_FROM")!;
const appBaseUrl = Deno.env.get("APP_BASE_URL") || "https://www.custodia360.es";

function absoluteUrl(path: string): string {
  const base = appBaseUrl.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function renderTemplate(template: string, context: Record<string, any>): string {
  let result = template;
  for (const [key, value] of Object.entries(context)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    result = result.replace(regex, String(value));
  }
  return result;
}

async function sendResend({ to, subject, text }: { to: string; subject: string; text: string }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: notifyEmailFrom,
      to: [to],
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend ${response.status}: ${errorText}`);
  }

  return response.json();
}

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Obtener jobs pendientes
    const { data: jobs, error: jobsError } = await supabase
      .from("message_jobs")
      .select("*")
      .eq("status", "queued")
      .or("scheduled_for.is.null,scheduled_for.lte." + new Date().toISOString())
      .limit(50);

    if (jobsError) throw jobsError;
    if (!jobs || jobs.length === 0) {
      return new Response(JSON.stringify({ message: "No jobs to process" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = [];

    for (const job of jobs) {
      try {
        // Marcar como processing
        await supabase.from("message_jobs").update({ status: "processing" }).eq("id", job.id);

        // Obtener template
        const { data: template, error: tplError } = await supabase
          .from("message_templates")
          .select("*")
          .eq("slug", job.template_slug)
          .single();

        if (tplError || !template) {
          throw new Error(`Template not found: ${job.template_slug}`);
        }

        // Obtener recipients pendientes
        const { data: recipients, error: recipError } = await supabase
          .from("message_recipients")
          .select("*")
          .eq("job_id", job.id)
          .eq("status", "pending");

        if (recipError) throw recipError;
        if (!recipients || recipients.length === 0) continue;

        let sentCount = 0;
        let errorCount = 0;

        for (const recipient of recipients) {
          try {
            // Construir contexto completo
            const ctx = {
              ...job.context,
              panel_url: absoluteUrl("/panel/delegado"),
              onboarding_url: job.context?.token
                ? absoluteUrl(`/i/${job.context.token}`)
                : "",
              factura_url: job.context?.factura_url || "",
              informe_url: job.context?.informe_url || "",
              doc_url: job.context?.doc_url || "",
              nombre: job.context?.nombre || "",
              entidad: job.context?.entidad || "",
              plan_contratado: job.context?.plan_contratado || "",
              credenciales_usuario: job.context?.credenciales_usuario || "",
              credenciales_password: job.context?.credenciales_password || "",
              fecha_limite: job.context?.fecha_limite || "",
              aciertos: job.context?.aciertos || 0,
              total: job.context?.total || 0,
              resultado: job.context?.resultado || "",
              siguiente_paso: job.context?.siguiente_paso || "",
              doc_nombre: job.context?.doc_nombre || "",
              vencidos_list: job.context?.vencidos_list || "",
              pendiente_list: job.context?.pendiente_list || "",
            };

            // Render subject y body
            const subject = renderTemplate(template.asunto || "", ctx);
            const body = renderTemplate(template.cuerpo || "", ctx);

            // Enviar
            const resendResponse = await sendResend({
              to: recipient.to_email,
              subject,
              text: body,
            });

            // Actualizar recipient
            await supabase
              .from("message_recipients")
              .update({
                rendered_subject: subject,
                rendered_body: body,
                provider_message_id: resendResponse.id,
                status: "sent",
              })
              .eq("id", recipient.id);

            sentCount++;
          } catch (recipientError: any) {
            errorCount++;
            await supabase
              .from("message_recipients")
              .update({
                status: "error",
                error_msg: recipientError.message,
              })
              .eq("id", recipient.id);
          }
        }

        // Actualizar job final
        const finalStatus = errorCount === 0 ? "sent" : "error";
        const errorMsg = errorCount > 0 ? `${errorCount} failed` : null;

        await supabase
          .from("message_jobs")
          .update({
            status: finalStatus,
            error_msg: errorMsg,
          })
          .eq("id", job.id);

        results.push({
          jobId: job.id,
          sent: sentCount,
          errors: errorCount,
        });
      } catch (jobError: any) {
        await supabase
          .from("message_jobs")
          .update({
            status: "error",
            error_msg: jobError.message,
          })
          .eq("id", job.id);

        results.push({
          jobId: job.id,
          error: jobError.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: jobs.length,
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
