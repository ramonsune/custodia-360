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
      personId,
      entregado,
      fecha_entrega,
      verificado,
      userId,
      entityId,
    } = body;

    if (!personId || entregado === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upsert background check record
    const { data: check, error: checkError } = await supabase
      .from('background_checks')
      .upsert({
        person_id: personId,
        entregado,
        fecha_entrega: entregado ? (fecha_entrega || new Date().toISOString()) : null,
        verificado: verificado || false,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'person_id',
      })
      .select()
      .single();

    if (checkError) throw checkError;

    // Log action
    if (entityId && userId) {
      await supabase.from('action_logs').insert({
        entity_id: entityId,
        user_id: userId,
        action: 'marcar_penal',
        descripcion: `Certificado penal ${entregado ? 'entregado' : 'pendiente'}`,
        metadata: { personId, entregado, verificado },
      });
    }

    return NextResponse.json({
      success: true,
      check,
    });

  } catch (error: any) {
    console.error('Mark penal error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
