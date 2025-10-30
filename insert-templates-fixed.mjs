import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const templates = [
  {
    slug: 'contact-auto-reply',
    nombre: 'Respuesta Automática Contacto',
    asunto: 'Hemos recibido tu consulta - Custodia360',
    cuerpo: '<p>Hola {{nombre}},</p><p>Hemos recibido tu consulta y te responderemos en breve.</p><p>Saludos,<br>Equipo Custodia360</p>',
    scope: 'public',
    activo: true
  },
  {
    slug: 'contractor-confirm',
    nombre: 'Confirmación Contratación',
    asunto: 'Bienvenido a Custodia360 - {{entidad}}',
    cuerpo: '<p>Hola {{responsable}},</p><p>Tu entidad {{entidad}} ha sido dada de alta en Custodia360.</p><p>Plan contratado: {{plan_nombre}}</p><p>Acceso: {{acceso_url}}</p>',
    scope: 'admin',
    activo: true
  },
  {
    slug: 'admin-invoice',
    nombre: 'Factura Administración',
    asunto: 'Nueva factura - {{entidad}}',
    cuerpo: '<p>Hola,</p><p>Nueva factura disponible para {{entidad}}.</p><p>Descarga: {{invoice_url}}</p>',
    scope: 'admin',
    activo: true
  },
  {
    slug: 'delegate-welcome',
    nombre: 'Bienvenida Delegado Principal',
    asunto: 'Bienvenido/a como Delegado/a de Protección - Custodia360',
    cuerpo: '<p>Hola {{delegado_nombre}},</p><p>Has sido designado/a como Delegado/a de Protección LOPIVI.</p><p>Accede al panel: {{acceso_url}}</p>',
    scope: 'entity',
    activo: true
  },
  {
    slug: 'delegate-supl-welcome',
    nombre: 'Bienvenida Delegado Suplente',
    asunto: 'Bienvenido/a como Delegado/a Suplente - Custodia360',
    cuerpo: '<p>Hola {{delegado_nombre}},</p><p>Has sido designado/a como Delegado/a Suplente de Protección LOPIVI en {{entidad}}.</p><p>Acceso: {{acceso_url}}</p>',
    scope: 'entity',
    activo: true
  },
  {
    slug: 'billing-5m-reminder',
    nombre: 'Recordatorio Facturación 5 Meses',
    asunto: 'Recordatorio: Renovación en 1 mes - Custodia360',
    cuerpo: '<p>Hola,</p><p>Tu suscripción de {{entidad}} vence en 1 mes.</p><p>Renueva aquí: {{renewal_url}}</p>',
    scope: 'entity',
    activo: true
  },
  {
    slug: 'billing-11m-reminder',
    nombre: 'Recordatorio Facturación 11 Meses',
    asunto: 'Recordatorio: Renovación próximamente - Custodia360',
    cuerpo: '<p>Hola,</p><p>Tu suscripción de {{entidad}} vence próximamente.</p><p>Renueva aquí: {{renewal_url}}</p>',
    scope: 'entity',
    activo: true
  },
  {
    slug: 'training-start',
    nombre: 'Inicio Formación',
    asunto: 'Comienza tu formación LOPIVI - Custodia360',
    cuerpo: '<p>Hola {{nombre}},</p><p>Tu formación LOPIVI está lista.</p><p>Comienza aquí: {{training_url}}</p>',
    scope: 'entity',
    activo: true
  },
  {
    slug: 'training-certified',
    nombre: 'Certificado Formación',
    asunto: 'Certificado de Formación LOPIVI - Custodia360',
    cuerpo: '<p>¡Enhorabuena {{nombre}}!</p><p>Has completado la formación LOPIVI.</p><p>Descarga tu certificado: {{certificate_url}}</p>',
    scope: 'entity',
    activo: true
  },
  {
    slug: 'channel-verify',
    nombre: 'Verificación Canal Comunicación',
    asunto: 'Verifica tu canal de comunicación - Custodia360',
    cuerpo: '<p>Hola,</p><p>Verifica tu canal de comunicación haciendo clic aquí: {{verify_url}}</p>',
    scope: 'entity',
    activo: true
  },
  {
    slug: 'compliance-blocked',
    nombre: 'Compliance Bloqueado',
    asunto: 'Configuración obligatoria pendiente - Custodia360',
    cuerpo: '<p>Hola,</p><p>Tu cuenta está bloqueada por configuración pendiente.</p><p>Completa la configuración: {{config_url}}</p>',
    scope: 'entity',
    activo: true
  },
  {
    slug: 'onboarding-delay',
    nombre: 'Retraso Onboarding',
    asunto: 'Recordatorio: Completa tu registro - Custodia360',
    cuerpo: '<p>Hola {{nombre}},</p><p>Tienes {{days_remaining}} días para completar tu registro.</p><p>Continúa aquí: {{onboarding_url}}</p>',
    scope: 'entity',
    activo: true
  },
  {
    slug: 'kit-comm-invite',
    nombre: 'Invitación Kit Comunicación',
    asunto: 'Activa el Kit de Comunicación LOPIVI - Custodia360',
    cuerpo: '<p>Hola,</p><p>El Kit de Comunicación LOPIVI está disponible para {{entidad}}.</p><p>Actívalo aquí: {{kit_url}}</p>',
    scope: 'entity',
    activo: true
  }
];

async function insertTemplates() {
  console.log('🔄 Insertando plantillas de Resend...\n');

  for (const template of templates) {
    const { data, error } = await supabase
      .from('message_templates')
      .upsert(template, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error(`❌ Error con ${template.slug}:`, error.message);
    } else {
      console.log(`✅ ${template.slug}`);
    }
  }

  console.log('\n✅ Plantillas insertadas/actualizadas');
}

insertTemplates().then(() => process.exit(0)).catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});
