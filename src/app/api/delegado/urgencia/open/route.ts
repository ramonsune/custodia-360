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
      typeSlug,
      titulo,
      descripcion,
      menorInvolucrado,
      menorId,
      userId,
    } = body;

    if (!entityId || !typeSlug || !titulo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Obtener tipo de incidente para cargar pasos
    const { data: incidentType, error: typeError } = await supabase
      .from('incident_types')
      .select('*')
      .eq('slug', typeSlug)
      .single();

    if (typeError || !incidentType) {
      return NextResponse.json(
        { error: "Incident type not found" },
        { status: 404 }
      );
    }

    // Crear incidente
    const { data: incident, error: incidentError } = await supabase
      .from('urgent_incidents')
      .insert({
        entity_id: entityId,
        type_slug: typeSlug,
        titulo,
        descripcion: descripcion || '',
        menor_involucrado: menorInvolucrado || false,
        menor_id: menorId || null,
        acciones: [],
        estado: 'abierto',
        prioridad: incidentType.prioridad || 'media',
        created_by: userId,
      })
      .select()
      .single();

    if (incidentError) throw incidentError;

    // Log acción
    await supabase.from('action_logs').insert({
      entity_id: entityId,
      user_id: userId,
      action: 'abrir_urgencia',
      descripcion: `Urgencia abierta: ${titulo}`,
      metadata: {
        incidentId: incident.id,
        typeSlug,
        prioridad: incident.prioridad
      },
    });

    return NextResponse.json({
      success: true,
      incident: {
        ...incident,
        type: incidentType,
      },
    });

  } catch (error: any) {
    console.error('Open urgency error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
