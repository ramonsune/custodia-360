import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno
config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const templates = [
  {
    slug: 'contact-auto-reply',
    name: 'Respuesta Automática Contacto',
    subject: 'Hemos recibido tu consulta - Custodia360',
    body_template: '<p>Hola {{nombre}},</p><p>Hemos recibido tu consulta y te responderemos en breve.</p><p>Saludos,<br>Equipo Custodia360</p>',
    channel: 'email'
  },
  {
    slug: 'contractor-confirm',
    name: 'Confirmación Contratación',
    subject: 'Bienvenido a Custodia360 - {{entidad}}',
    body_template: '<p>Hola {{responsable}},</p><p>Tu entidad {{entidad}} ha sido dada de alta en Custodia360.</p><p>Plan contratado: {{plan_nombre}}</p><p>Acceso: {{acceso_url}}</p>',
    channel: 'email'
  },
  {
    slug: 'admin-invoice',
    name: 'Factura Administración',
    subject: 'Nueva factura - {{entidad}}',
    body_template: '<p>Hola,</p><p>Nueva factura disponible para {{entidad}}.</p><p>Descarga: {{invoice_url}}</p>',
    channel: 'email'
  },
  {
    slug: 'delegate-welcome',
    name: 'Bienvenida Delegado Principal',
    subject: 'Bienvenido/a como Delegado/a de Protección - Custodia360',
    body_template: '<p>Hola {{delegado_nombre}},</p><p>Has sido designado/a como Delegado/a de Protección LOPIVI.</p><p>Accede al panel: {{acceso_url}}</p>',
    channel: 'email'
  },
  {
    slug: 'delegate-supl-welcome',
    name: 'Bienvenida Delegado Suplente',
    subject: 'Bienvenido/a como Delegado/a Suplente - Custodia360',
    body_template: '<p>Hola {{delegado_nombre}},</p><p>Has sido designado/a como Delegado/a Suplente de Protección LOPIVI en {{entidad}}.</p><p>Acceso: {{acceso_url}}</p>',
    channel: 'email'
  },
  {
    slug: 'billing-5m-reminder',
    name: 'Recordatorio Facturación 5 Meses',
    subject: 'Recordatorio: Renovación en 1 mes - Custodia360',
    body_template: '<p>Hola,</p><p>Tu suscripción de {{entidad}} vence en 1 mes.</p><p>Renueva aquí: {{renewal_url}}</p>',
    channel: 'email'
  },
  {
    slug: 'billing-11m-reminder',
    name: 'Recordatorio Facturación 11 Meses',
    subject: 'Recordatorio: Renovación próximamente - Custodia360',
    body_template: '<p>Hola,</p><p>Tu suscripción de {{entidad}} vence próximamente.</p><p>Renueva aquí: {{renewal_url}}</p>',
    channel: 'email'
  },
  {
    slug: 'training-start',
    name: 'Inicio Formación',
    subject: 'Comienza tu formación LOPIVI - Custodia360',
    body_template: '<p>Hola {{nombre}},</p><p>Tu formación LOPIVI está lista.</p><p>Comienza aquí: {{training_url}}</p>',
    channel: 'email'
  },
  {
    slug: 'training-certified',
    name: 'Certificado Formación',
    subject: 'Certificado de Formación LOPIVI - Custodia360',
    body_template: '<p>¡Enhorabuena {{nombre}}!</p><p>Has completado la formación LOPIVI.</p><p>Descarga tu certificado: {{certificate_url}}</p>',
    channel: 'email'
  },
  {
    slug: 'channel-verify',
    name: 'Verificación Canal Comunicación',
    subject: 'Verifica tu canal de comunicación - Custodia360',
    body_template: '<p>Hola,</p><p>Verifica tu canal de comunicación haciendo clic aquí: {{verify_url}}</p>',
    channel: 'email'
  },
  {
    slug: 'compliance-blocked',
    name: 'Compliance Bloqueado',
    subject: 'Configuración obligatoria pendiente - Custodia360',
    body_template: '<p>Hola,</p><p>Tu cuenta está bloqueada por configuración pendiente.</p><p>Completa la configuración: {{config_url}}</p>',
    channel: 'email'
  },
  {
    slug: 'onboarding-delay',
    name: 'Retraso Onboarding',
    subject: 'Recordatorio: Completa tu registro - Custodia360',
    body_template: '<p>Hola {{nombre}},</p><p>Tienes {{days_remaining}} días para completar tu registro.</p><p>Continúa aquí: {{onboarding_url}}</p>',
    channel: 'email'
  },
  {
    slug: 'kit-comm-invite',
    name: 'Invitación Kit Comunicación',
    subject: 'Activa el Kit de Comunicación LOPIVI - Custodia360',
    body_template: '<p>Hola,</p><p>El Kit de Comunicación LOPIVI está disponible para {{entidad}}.</p><p>Actívalo aquí: {{kit_url}}</p>',
    channel: 'email'
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
