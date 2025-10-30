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
      itemSlug,
      estado,       // 'pendiente' | 'en_progreso' | 'completado' | 'no_aplica'
      nota,
      evidenciaUrl,
      userId,
    } = body;

    if (!entityId || !itemSlug || !estado) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verificar que el item existe
    const { data: item, error: itemError } = await supabase
      .from('implementation_items')
      .select('*')
      .eq('slug', itemSlug)
      .single();

    if (itemError || !item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    // Upsert del estado
    const updateData: any = {
      entity_id: entityId,
      item_slug: itemSlug,
      estado,
      nota: nota || null,
      evidencia_url: evidenciaUrl || null,
      updated_at: new Date().toISOString(),
    };

    if (estado === 'completado') {
      updateData.completado_por = userId;
      updateData.completado_at = new Date().toISOString();
    }

    const { data: statusRecord, error: statusError } = await supabase
      .from('implementation_status')
      .upsert(updateData, {
        onConflict: 'entity_id,item_slug',
      })
      .select()
      .single();

    if (statusError) throw statusError;

    // Log acción
    await supabase.from('action_logs').insert({
      entity_id: entityId,
      user_id: userId,
      action: 'actualizar_implementacion',
      descripcion: `${item.titulo}: ${estado}`,
      metadata: { itemSlug, estado, nota },
    });

    return NextResponse.json({
      success: true,
      status: statusRecord,
      item: {
        slug: item.slug,
        titulo: item.titulo,
      },
    });

  } catch (error: any) {
    console.error('Implementation update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
