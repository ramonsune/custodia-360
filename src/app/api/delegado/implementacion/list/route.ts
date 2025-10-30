import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { searchParams } = new URL(req.url);
    const entityId = searchParams.get('entityId');

    if (!entityId) {
      return NextResponse.json(
        { error: "Missing entityId" },
        { status: 400 }
      );
    }

    // Obtener entidad para saber el sector
    const { data: entity } = await supabase
      .from('entidades')
      .select('sector')
      .eq('id', entityId)
      .single();

    const sector = entity?.sector || 'general';

    // Obtener todos los items de implementación (general + sector)
    const { data: items, error: itemsError } = await supabase
      .from('implementation_items')
      .select('*')
      .or(`sector.eq.general,sector.eq.${sector}`)
      .eq('activo', true)
      .order('orden', { ascending: true });

    if (itemsError) throw itemsError;

    // Obtener estados actuales de la entidad
    const { data: statuses, error: statusesError } = await supabase
      .from('implementation_status')
      .select('*')
      .eq('entity_id', entityId);

    if (statusesError) throw statusesError;

    const statusMap = new Map(
      (statuses || []).map(s => [s.item_slug, s])
    );

    // Enriquecer items con estado
    const itemsEnriched = (items || []).map(item => {
      const status = statusMap.get(item.slug);

      return {
        id: item.id,
        slug: item.slug,
        titulo: item.titulo,
        descripcion: item.descripcion,
        sector: item.sector,
        categoria: item.categoria,
        orden: item.orden,
        documentos_sugeridos: item.documentos_sugeridos || [],
        estado: status?.estado || 'pendiente',
        nota: status?.nota,
        evidencia_url: status?.evidencia_url,
        completado_at: status?.completado_at,
        completado_por: status?.completado_por,
        updated_at: status?.updated_at,
      };
    });

    // Calcular KPIs
    const totalItems = itemsEnriched.length;
    const obligatorios = itemsEnriched.filter(i => i.categoria === 'obligatorio');
    const obligatoriosCompletados = obligatorios.filter(i => i.estado === 'completado');
    const enProgreso = itemsEnriched.filter(i => i.estado === 'en_progreso');
    const pendientes = itemsEnriched.filter(i => i.estado === 'pendiente');
    const completados = itemsEnriched.filter(i => i.estado === 'completado');

    return NextResponse.json({
      success: true,
      items: itemsEnriched,
      kpis: {
        total: totalItems,
        completados: completados.length,
        en_progreso: enProgreso.length,
        pendientes: pendientes.length,
        obligatorios: {
          total: obligatorios.length,
          completados: obligatoriosCompletados.length,
          porcentaje: obligatorios.length > 0
            ? Math.round((obligatoriosCompletados.length / obligatorios.length) * 100)
            : 0,
        },
        porcentaje_general: totalItems > 0
          ? Math.round((completados.length / totalItems) * 100)
          : 0,
      },
      sector,
    });

  } catch (error: any) {
    console.error('Implementation list error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
