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
      incidentId,
      estado,       // 'cerrado' | 'derivado'
      nota,
      userId,
    } = body;

    if (!incidentId) {
      return NextResponse.json(
        { error: "Missing incidentId" },
        { status: 400 }
      );
    }

    const finalEstado = estado || 'cerrado';

    // Actualizar incidente
    const { data: incident, error: updateError } = await supabase
      .from('urgent_incidents')
      .update({
        estado: finalEstado,
        closed_by: userId,
        closed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', incidentId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log acción
    await supabase.from('action_logs').insert({
      entity_id: incident.entity_id,
      user_id: userId,
      action: 'cerrar_urgencia',
      descripcion: `Urgencia ${finalEstado}: ${incident.titulo}`,
      metadata: { incidentId, estado: finalEstado, nota },
    });

    return NextResponse.json({
      success: true,
      incident,
    });

  } catch (error: any) {
    console.error('Close urgency error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
