import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const body = await req.json();
    const {
      entityId,
      templateSlug,
      recipients,
      context,
      idempotencyKey,
      scheduleAt,
    } = body;

    if (!entityId || !templateSlug || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verificar si ya existe job con este idempotencyKey
    if (idempotencyKey) {
      const { data: existing } = await supabase
        .from("message_jobs")
        .select("id")
        .eq("idempotency_key", idempotencyKey)
        .single();

      if (existing) {
        return NextResponse.json({
          success: true,
          job: existing,
          message: "Job already exists (idempotent)",
        });
      }
    }

    // Crear job
    const { data: job, error: jobError } = await supabase
      .from("message_jobs")
      .insert({
        entity_id: entityId,
        template_slug: templateSlug,
        channel: "email",
        context: context || {},
        status: "queued",
        scheduled_for: scheduleAt || null,
        idempotency_key: idempotencyKey || null,
      })
      .select()
      .single();

    if (jobError) {
      throw jobError;
    }

    // Crear recipients
    const recipientRows = recipients.map((r: any) => ({
      job_id: job.id,
      person_id: r.personId || null,
      to_email: r.email,
      status: "pending",
    }));

    const { error: recipError } = await supabase
      .from("message_recipients")
      .insert(recipientRows);

    if (recipError) {
      throw recipError;
    }

    return NextResponse.json({
      success: true,
      job,
      recipientsCount: recipientRows.length,
    });
  } catch (error: any) {
    console.error("Enqueue error:", error);
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}
