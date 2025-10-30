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
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');
    const save = searchParams.get('save') === 'true';

    if (!entityId) {
      return NextResponse.json(
        { error: "Missing entityId" },
        { status: 400 }
      );
    }

    // Get entity data
    const { data: entity } = await supabase
      .from('entidades')
      .select('*')
      .eq('id', entityId)
      .single();

    // Get formacion/penales KPIs
    const controlesRes = await fetch(`${process.env.APP_BASE_URL || 'http://localhost:3000'}/api/delegado/controles/overview?entityId=${entityId}`);
    const controlesData = await controlesRes.json();

    // Get implementacion status
    const implRes = await fetch(`${process.env.APP_BASE_URL || 'http://localhost:3000'}/api/delegado/implementacion/list?entityId=${entityId}`);
    const implData = await implRes.json();

    // Get message jobs in period
    let messagesQuery = supabase
      .from('message_jobs')
      .select('*')
      .eq('entity_id', entityId);

    if (fechaInicio) messagesQuery = messagesQuery.gte('created_at', fechaInicio);
    if (fechaFin) messagesQuery = messagesQuery.lte('created_at', fechaFin);

    const { data: messages } = await messagesQuery;

    // Build report content
    const reportContent = {
      entidad: {
        nombre: entity?.nombre,
        sector: entity?.sector,
        plan_cantidad: entity?.plan_cantidad,
        fecha_contratacion: entity?.fecha_contratacion,
      },
      kpis: {
        formacion: controlesData.kpis?.formacion,
        penales: controlesData.kpis?.penales,
      },
      implementacion: {
        total: implData.kpis?.total,
        completados: implData.kpis?.completados,
        porcentaje: implData.kpis?.porcentaje_general,
        obligatorios: implData.kpis?.obligatorios,
      },
      comunicaciones: {
        total: messages?.length || 0,
        enviados: messages?.filter((m: any) => m.status === 'sent').length || 0,
      },
      fecha_generacion: new Date().toISOString(),
      periodo: {
        inicio: fechaInicio,
        fin: fechaFin,
      },
    };

    // Save if requested
    let reportId = null;
    if (save) {
      const { data: savedReport } = await supabase
        .from('inspector_reports')
        .insert({
          entity_id: entityId,
          titulo: `Informe de Cumplimiento ${entity?.nombre}`,
          tipo: 'cumplimiento',
          contenido: reportContent,
          fecha_inicio: fechaInicio || null,
          fecha_fin: fechaFin || null,
        })
        .select()
        .single();

      reportId = savedReport?.id;
    }

    return NextResponse.json({
      success: true,
      report: reportContent,
      reportId,
      message: 'Informe generado. La generación de PDF se implementará con puppeteer.',
    });

  } catch (error: any) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
