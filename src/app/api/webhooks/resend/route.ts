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
    const { type, data } = body;

    // Eventos de Resend: email.delivered, email.bounced, email.complained
    if (!type || !data) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const messageId = data.email_id; // Resend message ID
    if (!messageId) {
      return NextResponse.json(
        { error: "Missing email_id" },
        { status: 400 }
      );
    }

    let newStatus = "pending";
    let errorMsg = null;

    switch (type) {
      case "email.delivered":
        newStatus = "delivered";
        break;
      case "email.bounced":
        newStatus = "bounced";
        errorMsg = data.bounce?.message || "Bounced";
        break;
      case "email.complained":
        newStatus = "bounced";
        errorMsg = "Complaint received";
        break;
      case "email.sent":
        newStatus = "sent";
        break;
      default:
        // Evento no manejado
        return NextResponse.json({ received: true });
    }

    // Actualizar recipient por provider_message_id
    const { error: updateError } = await supabase
      .from("message_recipients")
      .update({
        status: newStatus,
        error_msg: errorMsg,
      })
      .eq("provider_message_id", messageId);

    if (updateError) {
      console.error("Error updating recipient:", updateError);
      throw updateError;
    }

    // Si bounced, podríamos encolar aviso al delegado (opcional)
    // ...

    return NextResponse.json({ received: true, status: newStatus });
  } catch (error: any) {
    console.error("Resend webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}
