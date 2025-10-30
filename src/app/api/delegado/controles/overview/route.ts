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
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!entityId) {
      return NextResponse.json(
        { error: "Missing entityId" },
        { status: 400 }
      );
    }

    // Obtener solo personal de contacto (que requiere formación y penales)
    const { data: personal, error: personalError } = await supabase
      .from('delegados')
      .select('*')
      .eq('entity_id', entityId)
      .eq('rol', 'personal_contacto')
      .range(offset, offset + limit - 1)
      .order('nombre', { ascending: true });

    if (personalError) throw personalError;

    const personalIds = (personal || []).map(p => p.id);

    // Obtener datos de formación
    const { data: trainings } = await supabase
      .from('trainings')
      .select('*')
      .in('person_id', personalIds);

    // Obtener datos de certificados penales
    const { data: backgroundChecks } = await supabase
      .from('background_checks')
      .select('*')
      .in('person_id', personalIds);

    // Mapear datos
    const trainingsMap = new Map(
      (trainings || []).map(t => [t.person_id, t])
    );

    const checksMap = new Map(
      (backgroundChecks || []).map(c => [c.person_id, c])
    );

    // Calcular KPIs
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let formacion_completada = 0;
    let formacion_pendiente = 0;
    let formacion_vencida = 0;

    let penales_entregado = 0;
    let penales_pendiente = 0;
    let penales_vencido = 0;

    const personalEnriched = (personal || []).map(p => {
      const training = trainingsMap.get(p.id);
      const check = checksMap.get(p.id);

      // Formación
      const formacionCompletada = training?.completed || false;
      const formacionScore = training?.score || 0;
      const formacionFecha = training?.completed_at ? new Date(training.completed_at) : null;

      let formacionEstado = 'pendiente';
      if (formacionCompletada && formacionScore >= 7) {
        formacionEstado = 'completado';
        formacion_completada++;
      } else if (!formacionCompletada && formacionFecha && formacionFecha < thirtyDaysAgo) {
        formacionEstado = 'vencido';
        formacion_vencida++;
      } else {
        formacion_pendiente++;
      }

      // Penales
      const penalEntregado = check?.entregado || false;
      const penalFecha = check?.fecha_entrega ? new Date(check.fecha_entrega) : null;
      const penalVerificado = check?.verificado || false;

      let penalesEstado = 'pendiente';
      if (penalEntregado) {
        penalesEstado = 'entregado';
        penales_entregado++;
      } else if (!penalEntregado && p.created_at && new Date(p.created_at) < thirtyDaysAgo) {
        penalesEstado = 'vencido';
        penales_vencido++;
      } else {
        penales_pendiente++;
      }

      return {
        id: p.id,
        nombre: `${p.nombre} ${p.apellidos || ''}`.trim(),
        email: p.email,
        telefono: p.telefono,
        rol: p.rol,
        formacion: {
          completado: formacionCompletada,
          score: formacionScore,
          fecha: formacionFecha?.toISOString(),
          estado: formacionEstado,
        },
        penales: {
          entregado: penalEntregado,
          fecha: penalFecha?.toISOString(),
          verificado: penalVerificado,
          estado: penalesEstado,
        },
        estado_general:
          formacionEstado === 'completado' && penalesEstado === 'entregado' ? 'ok' :
          formacionEstado === 'vencido' || penalesEstado === 'vencido' ? 'vencido' :
          'pendiente',
      };
    });

    const totalPersonal = personal?.length || 0;

    return NextResponse.json({
      success: true,
      kpis: {
        formacion: {
          completada: formacion_completada,
          pendiente: formacion_pendiente,
          vencida: formacion_vencida,
          total: totalPersonal,
          porcentaje_completado: totalPersonal > 0 ? Math.round((formacion_completada / totalPersonal) * 100) : 0,
        },
        penales: {
          entregado: penales_entregado,
          pendiente: penales_pendiente,
          vencido: penales_vencido,
          total: totalPersonal,
          porcentaje_entregado: totalPersonal > 0 ? Math.round((penales_entregado / totalPersonal) * 100) : 0,
        },
      },
      personal: personalEnriched,
      total: totalPersonal,
      limit,
      offset,
    });

  } catch (error: any) {
    console.error('Controles overview error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
