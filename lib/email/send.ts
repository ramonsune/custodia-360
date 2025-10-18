/**
 * Email Service - Custodia360
 * Render templates with Handlebars and send via Resend
 */

import Handlebars from "handlebars";

interface Template {
  asunto?: string;
  cuerpo: string;
}

export async function renderTemplate(
  tpl: Template,
  ctx: Record<string, any>
): Promise<{ subject: string; body: string }> {
  const subject = tpl.asunto ? Handlebars.compile(tpl.asunto)(ctx) : "";
  const body = Handlebars.compile(tpl.cuerpo)(ctx);
  return { subject, body };
}

export async function sendResend({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<any> {
  const rk = process.env.RESEND_API_KEY!;
  const from = process.env.NOTIFY_EMAIL_FROM!;

  if (!rk || !from) {
    throw new Error("Missing RESEND_API_KEY or NOTIFY_EMAIL_FROM env vars");
  }

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${rk}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
    }),
  });

  if (!r.ok) {
    const errorText = await r.text();
    throw new Error(`Resend ${r.status}: ${errorText}`);
  }

  return r.json();
}
