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
      step,          // texto del paso
      completado,    // true/false
      nota,
      userId,
    } = body;

    if (!incidentId || !step) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Obtener incidente actual
    const { data: incident, error: incidentError } = await supabase
      .from('urgent_incidents')
      .select('*')
      .eq('id', incidentId)
      .single();

    if (incidentError || !incident) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    // Actualizar acciones
    const acciones = Array.isArray(incident.acciones) ? incident.acciones : [];

    const stepAction = {
      paso: step,
      completado: completado !== false,
      timestamp: new Date().toISOString(),
      nota: nota || null,
      user_id: userId,
    };

    // Buscar si ya existe el paso y actualizarlo, si no agregarlo
    const existingIndex = acciones.findIndex((a: any) => a.paso === step);
    if (existingIndex >= 0) {
      acciones[existingIndex] = stepAction;
    } else {
      acciones.push(stepAction);
    }

    // Actualizar incidente
    const { data: updated, error: updateError } = await supabase
      .from('urgent_incidents')
      .update({
        acciones,
        updated_at: new Date().toISOString(),
      })
      .eq('id', incidentId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      incident: updated,
    });

  } catch (error: any) {
    console.error('Step update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
