import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { absoluteUrl } from "@/lib/url/base";

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
      templateSlug,
      userId,      // delegado que genera
    } = body;

    if (!entityId || !templateSlug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Obtener template
    const { data: template, error: templateError } = await supabase
      .from('pdf_templates')
      .select('*')
      .eq('slug', templateSlug)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Obtener datos de la entidad
    const { data: entity, error: entityError } = await supabase
      .from('entidades')
      .select('*')
      .eq('id', entityId)
      .single();

    if (entityError || !entity) {
      return NextResponse.json(
        { error: "Entity not found" },
        { status: 404 }
      );
    }

    // Obtener datos del delegado
    const { data: delegado, error: delegadoError } = await supabase
      .from('delegados')
      .select('*')
      .eq('user_id', userId)
      .eq('entity_id', entityId)
      .single();

    if (delegadoError || !delegado) {
      return NextResponse.json(
        { error: "Delegado not found" },
        { status: 404 }
      );
    }

    // Construir contexto para merge
    const context = {
      entidad: entity.nombre || '',
      sector: entity.sector || 'general',
      delegado: `${delegado.nombre} ${delegado.apellidos || ''}`.trim(),
      delegado_email: delegado.email || '',
      delegado_telefono: delegado.telefono || '',
      fecha: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      fecha_larga: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      panel_url: absoluteUrl('/panel/delegado'),
    };

    // Renderizar HTML del template con placeholders
    let htmlContent = template.plantilla_html || '';
    for (const [key, value] of Object.entries(context)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      htmlContent = htmlContent.replace(regex, String(value));
    }

    // TODO: Aquí usarías una librería como puppeteer o similar para generar PDF
    // Por ahora, guardamos el HTML renderizado y retornamos un signed URL

    // Nombre del archivo
    const fileName = `${templateSlug}-${entity.nombre.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.pdf`;
    const storagePath = `${entityId}/documents/${fileName}`;

    // Simular generación de PDF (en producción usarías puppeteer/chromium)
    // Por ahora solo guardamos referencia

    const { data: pdfRecord, error: pdfError } = await supabase
      .from('generated_pdfs')
      .insert({
        entity_id: entityId,
        template_id: template.id,
        nombre: template.nombre,
        storage_path: storagePath,
        tipo: template.categoria || 'protocolo',
        contexto: context,
        generated_by: userId,
      })
      .select()
      .single();

    if (pdfError) throw pdfError;

    // Log acción
    await supabase.from('action_logs').insert({
      entity_id: entityId,
      user_id: userId,
      action: 'generar_documento',
      descripcion: `Generado: ${template.nombre}`,
      metadata: { templateSlug, pdfId: pdfRecord.id },
    });

    // En un entorno real, aquí se generaría el PDF y se subiría a Storage
    // Por ahora retornamos la info del documento

    return NextResponse.json({
      success: true,
      document: {
        id: pdfRecord.id,
        name: template.nombre,
        slug: templateSlug,
        storagePath,
        context,
        // downloadUrl: signedUrl (se generaría aquí)
        message: "Document generated successfully. PDF generation will be implemented with puppeteer.",
      },
    });

  } catch (error: any) {
    console.error('Generate doc error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
