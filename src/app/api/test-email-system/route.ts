import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Endpoint de prueba para el sistema de emails
 *
 * Uso:
 * POST /api/test-email-system
 * Body: {
 *   "template": "contact-auto-reply" | "contractor-confirm" | "admin-invoice" | "delegate-welcome" | "delegate-supl-welcome" | "billing-5m-reminder" | "billing-11m-reminder",
 *   "toEmail": "destinatario@example.com",
 *   "context": { variables necesarias según plantilla }
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { template, toEmail, context } = body;

    if (!template || !toEmail) {
      return NextResponse.json(
        { error: "template y toEmail son requeridos" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verificar que la plantilla existe
    const { data: templateData, error: templateError } = await supabase
      .from("message_templates")
      .select("*")
      .eq("slug", template)
      .single();

    if (templateError || !templateData) {
      return NextResponse.json(
        { error: `Plantilla '${template}' no encontrada` },
        { status: 404 }
      );
    }

    // Contextos de ejemplo según plantilla
    const defaultContexts: Record<string, any> = {
      "contact-auto-reply": {
        nombre: "Usuario de Prueba",
      },
      "contractor-confirm": {
        responsable: "Responsable de Prueba",
        entidad: "Entidad de Prueba",
        plan_nombre: "Plan Básico",
        acceso_url: `${process.env.APP_BASE_URL}/acceso`,
        suplente_txt: "",
      },
      "admin-invoice": {
        entidad: "Entidad de Prueba",
        plan_nombre: "Plan Básico",
        invoice_url: "https://invoice.stripe.com/i/test_example",
      },
      "delegate-welcome": {
        delegado_nombre: "Delegado de Prueba",
        delegado_email: toEmail,
        acceso_url: `${process.env.APP_BASE_URL}/acceso`,
      },
      "delegate-supl-welcome": {
        delegado_nombre: "Delegado Suplente de Prueba",
        entidad: "Entidad de Prueba",
        delegado_email: toEmail,
        acceso_url: `${process.env.APP_BASE_URL}/acceso`,
      },
      "billing-5m-reminder": {
        entidad: "Entidad de Prueba",
        plan_nombre: "Plan Básico",
      },
      "billing-11m-reminder": {
        entidad: "Entidad de Prueba",
        plan_nombre: "Plan Básico",
      },
    };

    const finalContext = {
      ...defaultContexts[template],
      ...context,
    };

    // Crear job
    const { data: job, error: jobError } = await supabase
      .from("message_jobs")
      .insert({
        entity_id: null,
        template_slug: template,
        channel: "email",
        context: finalContext,
        status: "queued",
        idempotency_key: `test-${template}-${Date.now()}`,
      })
      .select()
      .single();

    if (jobError) {
      throw jobError;
    }

    // Crear recipient
    const { error: recipientError } = await supabase
      .from("message_recipients")
      .insert({
        job_id: job.id,
        to_email: toEmail,
        status: "pending",
      });

    if (recipientError) {
      throw recipientError;
    }

    return NextResponse.json({
      success: true,
      message: "Email de prueba encolado exitosamente",
      job: {
        id: job.id,
        template: template,
        to: toEmail,
        context: finalContext,
      },
      nextSteps: [
        "El email se enviará en los próximos 10 minutos (cuando el dispatcher ejecute)",
        "Puedes invocar manualmente el dispatcher en Supabase Dashboard",
        `Verificar en tabla message_jobs: id=${job.id}`,
        `Verificar en tabla message_recipients el estado de envío`,
      ],
    });
  } catch (error: any) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}

// GET: Ver todas las plantillas disponibles
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: templates, error } = await supabase
      .from("message_templates")
      .select("slug, nombre, asunto, segmento")
      .order("slug");

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      templates: templates || [],
      usage: {
        method: "POST",
        endpoint: "/api/test-email-system",
        body: {
          template: "slug de plantilla",
          toEmail: "destinatario@example.com",
          context: { variables: "opcionales según plantilla" },
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}
