import { NextRequest, NextResponse } from "next/server";

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, phone, subject, message, consent, honeypot } = body || {};
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
    const ua = req.headers.get("user-agent") || "";

    // Validaciones
    // Honeypot: si está lleno, es un bot → responder OK sin hacer nada
    if (honeypot) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { ok: false, error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Email inválido" },
        { status: 400 }
      );
    }

    if (consent !== true) {
      return NextResponse.json(
        { ok: false, error: "Debes aceptar la política de privacidad" },
        { status: 400 }
      );
    }

    // Conexión Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const headers = {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    // 1. Guardar en contact_messages
    await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name,
        email,
        phone: phone || null,
        subject,
        message,
        consent: true,
        ip,
        user_agent: ua,
      }),
    });

    // 2. Encolar notificación interna → nandolmo@teamsml.com
    const notifyTo = process.env.CONTACT_NOTIFY_TO || "nandolmo@teamsml.com";
    const notifyEmails = notifyTo.split(",").map((e) => e.trim()).filter(Boolean);

    const jobNotifyRes = await fetch(`${supabaseUrl}/rest/v1/message_jobs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        entity_id: null,
        template_slug: "contacto-web",
        channel: "email",
        context: {
          name,
          email,
          phone: phone || "No proporcionado",
          subject,
          message,
          ip,
          user_agent: ua,
          fecha: new Date().toLocaleString("es-ES", {
            timeZone: "Europe/Madrid",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        status: "queued",
        idempotency_key: `contact-int-${email}-${Date.now()}`,
      }),
    });

    const jobNotifyData = await jobNotifyRes.json();
    const jobNotify = Array.isArray(jobNotifyData) ? jobNotifyData[0] : jobNotifyData;

    if (jobNotify && jobNotify.id) {
      const recipNotify = notifyEmails.map((to) => ({
        job_id: jobNotify.id,
        to_email: to,
        status: "pending",
      }));

      await fetch(`${supabaseUrl}/rest/v1/message_recipients`, {
        method: "POST",
        headers,
        body: JSON.stringify(recipNotify),
      });
    }

    // 3. Encolar auto-respuesta al remitente
    const replyTo = process.env.CONTACT_REPLY_TO || "info@custodia360.es";

    const jobAutoRes = await fetch(`${supabaseUrl}/rest/v1/message_jobs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        entity_id: null,
        template_slug: "contacto-auto-reply",
        channel: "email",
        context: {
          name,
          reply_to: replyTo,
        },
        status: "queued",
        idempotency_key: `contact-auto-${email}-${Date.now()}`,
      }),
    });

    const jobAutoData = await jobAutoRes.json();
    const jobAuto = Array.isArray(jobAutoData) ? jobAutoData[0] : jobAutoData;

    if (jobAuto && jobAuto.id) {
      await fetch(`${supabaseUrl}/rest/v1/message_recipients`, {
        method: "POST",
        headers,
        body: JSON.stringify([
          {
            job_id: jobAuto.id,
            to_email: email,
            status: "pending",
          },
        ]),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Contact form error:", e);
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
