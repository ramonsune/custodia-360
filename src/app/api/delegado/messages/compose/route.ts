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
      scope,        // 'individual' | 'rol' | 'entidad'
      rol,          // 'personal_contacto' | 'personal_sin_contacto' | 'familias' (si scope='rol')
      personIds,    // array de IDs si scope='individual'
      templateSlug,
      channel,      // 'email' | 'whatsapp'
      context,
      userId,       // delegado que envía
    } = body;

    if (!entityId || !scope || !templateSlug || !channel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Construir lista de destinatarios según scope
    let recipients: Array<{ email?: string; phone?: string; personId?: string; name?: string }> = [];

    if (scope === 'individual' && personIds && personIds.length > 0) {
      // Obtener personas específicas
      const { data: personas, error } = await supabase
        .from('delegados')
        .select('id, nombre, apellidos, email, telefono, rol')
        .in('id', personIds)
        .eq('entity_id', entityId);

      if (error) throw error;

      recipients = (personas || []).map(p => ({
        email: p.email,
        phone: p.telefono,
        personId: p.id,
        name: `${p.nombre} ${p.apellidos || ''}`.trim()
      }));

    } else if (scope === 'rol' && rol) {
      // Obtener todas las personas del rol especificado
      const { data: personas, error } = await supabase
        .from('delegados')
        .select('id, nombre, apellidos, email, telefono, rol')
        .eq('entity_id', entityId)
        .eq('rol', rol);

      if (error) throw error;

      recipients = (personas || []).map(p => ({
        email: p.email,
        phone: p.telefono,
        personId: p.id,
        name: `${p.nombre} ${p.apellidos || ''}`.trim()
      }));

    } else if (scope === 'entidad') {
      // Obtener todos los miembros de la entidad
      const { data: personas, error } = await supabase
        .from('delegados')
        .select('id, nombre, apellidos, email, telefono, rol')
        .eq('entity_id', entityId);

      if (error) throw error;

      recipients = (personas || []).map(p => ({
        email: p.email,
        phone: p.telefono,
        personId: p.id,
        name: `${p.nombre} ${p.apellidos || ''}`.trim()
      }));
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No recipients found" },
        { status: 400 }
      );
    }

    // Obtener datos de la entidad para context
    const { data: entity } = await supabase
      .from('entidades')
      .select('*')
      .eq('id', entityId)
      .single();

    // Obtener datos del delegado que envía
    const { data: delegado } = await supabase
      .from('delegados')
      .select('*')
      .eq('user_id', userId)
      .single();

    const enrichedContext = {
      ...context,
      entidad: entity?.nombre || '',
      delegado: delegado ? `${delegado.nombre} ${delegado.apellidos || ''}`.trim() : '',
      panel_url: absoluteUrl('/panel/delegado'),
      fecha: new Date().toLocaleDateString('es-ES'),
    };

    if (channel === 'email') {
      // Encolar emails usando el sistema existente
      const emailRecipients = recipients
        .filter(r => r.email)
        .map(r => ({
          email: r.email!,
          personId: r.personId,
        }));

      if (emailRecipients.length === 0) {
        return NextResponse.json(
          { error: "No email recipients found" },
          { status: 400 }
        );
      }

      const { data: job, error: jobError } = await supabase
        .from('message_jobs')
        .insert({
          entity_id: entityId,
          template_slug: templateSlug,
          channel: 'email',
          context: enrichedContext,
          status: 'queued',
          created_by: userId,
          idempotency_key: `compose-${entityId}-${Date.now()}`,
        })
        .select()
        .single();

      if (jobError) throw jobError;

      const recipientRows = emailRecipients.map(r => ({
        job_id: job.id,
        person_id: r.personId,
        to_email: r.email,
        status: 'pending',
      }));

      const { error: recipError } = await supabase
        .from('message_recipients')
        .insert(recipientRows);

      if (recipError) throw recipError;

      // Log acción
      await supabase.from('action_logs').insert({
        entity_id: entityId,
        user_id: userId,
        action: 'envio_email',
        descripcion: `Enviado a ${emailRecipients.length} destinatarios (${scope})`,
        metadata: { scope, rol, templateSlug, jobId: job.id },
      });

      return NextResponse.json({
        success: true,
        channel: 'email',
        jobId: job.id,
        recipientsCount: emailRecipients.length,
      });

    } else if (channel === 'whatsapp') {
      // Generar links de WhatsApp
      const { data: template } = await supabase
        .from('message_templates')
        .select('*')
        .eq('slug', templateSlug)
        .single();

      if (!template) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }

      // Renderizar mensaje para WhatsApp
      let message = template.cuerpo || '';
      for (const [key, value] of Object.entries(enrichedContext)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        message = message.replace(regex, String(value || ''));
      }

      const whatsappLinks = recipients
        .filter(r => r.phone)
        .map(r => {
          // Personalizar mensaje con nombre
          let personalMessage = message.replace(/{{nombre}}/g, r.name || '');

          // Limpiar teléfono (quitar espacios, guiones, etc.)
          const phone = r.phone!.replace(/\D/g, '');

          return {
            name: r.name,
            phone: r.phone,
            link: `https://wa.me/${phone}?text=${encodeURIComponent(personalMessage)}`,
          };
        });

      if (whatsappLinks.length === 0) {
        return NextResponse.json(
          { error: "No phone recipients found" },
          { status: 400 }
        );
      }

      // Log acción
      await supabase.from('action_logs').insert({
        entity_id: entityId,
        user_id: userId,
        action: 'generar_whatsapp',
        descripcion: `Generados ${whatsappLinks.length} enlaces WhatsApp (${scope})`,
        metadata: { scope, rol, templateSlug, count: whatsappLinks.length },
      });

      return NextResponse.json({
        success: true,
        channel: 'whatsapp',
        links: whatsappLinks,
        recipientsCount: whatsappLinks.length,
      });
    }

    return NextResponse.json(
      { error: "Invalid channel" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Compose error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
