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
    const rol = searchParams.get('rol');       // filtrar por rol
    const estado = searchParams.get('estado'); // filtrar por estado (ok/pendiente/vencido)
    const search = searchParams.get('search'); // búsqueda por nombre/email
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!entityId) {
      return NextResponse.json(
        { error: "Missing entityId" },
        { status: 400 }
      );
    }

    // Construir query base
    let query = supabase
      .from('delegados')
      .select('*', { count: 'exact' })
      .eq('entity_id', entityId)
      .range(offset, offset + limit - 1)
      .order('nombre', { ascending: true });

    if (rol) {
      query = query.eq('rol', rol);
    }

    if (search) {
      query = query.or(`nombre.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: personas, error: personasError, count } = await query;

    if (personasError) throw personasError;

    const personaIds = (personas || []).map(p => p.id);

    // Obtener datos relacionados
    const [
      { data: trainings },
      { data: backgroundChecks },
      { data: messageRecipients }
    ] = await Promise.all([
      supabase
        .from('trainings')
        .select('*')
        .in('person_id', personaIds),

      supabase
        .from('background_checks')
        .select('*')
        .in('person_id', personaIds),

      supabase
        .from('message_recipients')
        .select('*, job:message_jobs(*)')
        .in('person_id', personaIds)
        .order('created_at', { ascending: false })
    ]);

    // Mapear datos
    const trainingsMap = new Map(
      (trainings || []).map(t => [t.person_id, t])
    );

    const checksMap = new Map(
      (backgroundChecks || []).map(c => [c.person_id, c])
    );

    // Agrupar mensajes por persona (último enviado)
    const lastMessageMap = new Map();
    (messageRecipients || []).forEach((r: any) => {
      if (!lastMessageMap.has(r.person_id)) {
        lastMessageMap.set(r.person_id, r);
      }
    });

    // Calcular estado y enriquecer
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const personasEnriched = (personas || []).map(p => {
      const training = trainingsMap.get(p.id);
      const check = checksMap.get(p.id);
      const lastMessage = lastMessageMap.get(p.id);

      // Formación (solo si es personal_contacto)
      let formacionEstado = p.rol === 'personal_contacto' ? 'pendiente' : 'no_aplica';
      if (p.rol === 'personal_contacto') {
        if (training?.completed && (training.score || 0) >= 7) {
          formacionEstado = 'completado';
        } else if (training && !training.completed && training.created_at && new Date(training.created_at) < thirtyDaysAgo) {
          formacionEstado = 'vencido';
        }
      }

      // Penales (solo si es personal_contacto)
      let penalesEstado = p.rol === 'personal_contacto' ? 'pendiente' : 'no_aplica';
      if (p.rol === 'personal_contacto') {
        if (check?.entregado) {
          penalesEstado = 'entregado';
        } else if (!check && p.created_at && new Date(p.created_at) < thirtyDaysAgo) {
          penalesEstado = 'vencido';
        }
      }

      // Estado general
      const estadoGeneral =
        p.rol !== 'personal_contacto' ? 'no_aplica' :
        formacionEstado === 'completado' && penalesEstado === 'entregado' ? 'ok' :
        formacionEstado === 'vencido' || penalesEstado === 'vencido' ? 'vencido' :
        'pendiente';

      return {
        id: p.id,
        nombre: `${p.nombre} ${p.apellidos || ''}`.trim(),
        email: p.email,
        telefono: p.telefono,
        rol: p.rol,
        formacion: {
          estado: formacionEstado,
          completado: training?.completed || false,
          score: training?.score || 0,
          fecha: training?.completed_at,
        },
        penales: {
          estado: penalesEstado,
          entregado: check?.entregado || false,
          verificado: check?.verificado || false,
          fecha: check?.fecha_entrega,
        },
        ultima_comunicacion: lastMessage ? {
          fecha: lastMessage.created_at,
          asunto: lastMessage.rendered_subject || '',
          canal: lastMessage.job?.channel || 'email',
          estado: lastMessage.status,
        } : null,
        estado: estadoGeneral,
      };
    });

    // Filtrar por estado si se especificó
    let filtered = personasEnriched;
    if (estado) {
      filtered = personasEnriched.filter(p => p.estado === estado);
    }

    return NextResponse.json({
      success: true,
      miembros: filtered,
      total: count || 0,
      limit,
      offset,
    });

  } catch (error: any) {
    console.error('Members list error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
