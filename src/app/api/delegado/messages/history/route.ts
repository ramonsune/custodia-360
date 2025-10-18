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
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const template = searchParams.get('template');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!entityId) {
      return NextResponse.json(
        { error: "Missing entityId" },
        { status: 400 }
      );
    }

    // Construir query
    let query = supabase
      .from('message_jobs')
      .select(`
        *,
        recipients:message_recipients(*)
      `, { count: 'exact' })
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (from) {
      query = query.gte('created_at', from);
    }

    if (to) {
      query = query.lte('created_at', to);
    }

    if (template) {
      query = query.eq('template_slug', template);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: jobs, error, count } = await query;

    if (error) throw error;

    // Enriquecer con información de plantillas
    const templateSlugs = [...new Set(jobs?.map(j => j.template_slug) || [])];
    const { data: templates } = await supabase
      .from('message_templates')
      .select('slug, nombre, asunto')
      .in('slug', templateSlugs);

    const templatesMap = new Map(
      (templates || []).map(t => [t.slug, t])
    );

    const enrichedJobs = (jobs || []).map(job => ({
      ...job,
      template_name: templatesMap.get(job.template_slug)?.nombre || job.template_slug,
      template_subject: templatesMap.get(job.template_slug)?.asunto || '',
      recipients_count: job.recipients?.length || 0,
      sent_count: job.recipients?.filter((r: any) => r.status === 'sent').length || 0,
      delivered_count: job.recipients?.filter((r: any) => r.status === 'delivered').length || 0,
      error_count: job.recipients?.filter((r: any) => r.status === 'error' || r.status === 'bounced').length || 0,
    }));

    return NextResponse.json({
      success: true,
      jobs: enrichedJobs,
      total: count || 0,
      limit,
      offset,
    });

  } catch (error: any) {
    console.error('History error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
