-- ============================================================
-- EMAIL SYSTEM - CUSTODIA360
-- Tablas para gestión de mensajes automáticos
-- ============================================================

-- Plantillas de mensajes
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scope TEXT NOT NULL,         -- 'email' | 'whatsapp' | 'document' | 'report'
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  asunto TEXT,                 -- requerido si scope='email'
  cuerpo TEXT NOT NULL,        -- handlebars ({{nombre}}, {{entidad}}, {{onboarding_url}}, etc.)
  segmento TEXT NOT NULL,      -- 'delegado' | 'administracion' | 'contratante' | 'personal_contacto' | 'personal_sin_contacto' | 'familias' | 'todos'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cola de envíos (jobs)
CREATE TABLE IF NOT EXISTS message_jobs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entity_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  template_slug TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email',
  context JSONB,
  created_by UUID,
  status TEXT DEFAULT 'queued',    -- 'queued'|'processing'|'sent'|'error'
  error_msg TEXT,
  scheduled_for TIMESTAMPTZ,
  idempotency_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_jobs_idem
ON message_jobs(idempotency_key)
WHERE idempotency_key IS NOT NULL;

-- Destinatarios de mensajes
CREATE TABLE IF NOT EXISTS message_recipients (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id BIGINT REFERENCES message_jobs(id) ON DELETE CASCADE,
  person_id UUID REFERENCES delegados(id) ON DELETE SET NULL,
  to_email TEXT NOT NULL,
  rendered_subject TEXT,
  rendered_body TEXT,
  provider_message_id TEXT,
  status TEXT DEFAULT 'pending',   -- 'pending'|'sent'|'bounced'|'delivered'|'error'
  error_msg TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recip_job ON message_recipients(job_id);
CREATE INDEX IF NOT EXISTS idx_recip_provider ON message_recipients(provider_message_id);

-- ============================================================
-- SEED DE PLANTILLAS
-- ============================================================

-- 4.1 Bienvenida delegado (tras pago confirmado + alta de usuario)
INSERT INTO message_templates(scope,nombre,slug,asunto,cuerpo,segmento) VALUES
('email','Bienvenida delegado','welcome-delegado','Custodia360 | Acceso al panel del delegado',
'Hola {{nombre}},

Tu plan en {{entidad}} ha sido activado. Accede con tus credenciales:

Usuario: {{credenciales_usuario}}
Contraseña: {{credenciales_password}}

Accede aquí: {{panel_url}}
Por favor, completa la formación inicial del delegado.

Gracias,
Custodia360',
'delegado')
ON CONFLICT (slug) DO NOTHING;

-- 4.2 Invitación a onboarding (miembros)
INSERT INTO message_templates(scope,nombre,slug,asunto,cuerpo,segmento) VALUES
('email','Onboarding miembros','onboarding-invite','Custodia360 | Completa tu información',
'Hola {{nombre}},

Para cumplir la LOPIVI necesitamos confirmar tus datos y documentación. Entra aquí:
{{onboarding_url}}

Fecha límite: {{fecha_limite}}.
Gracias.',
'todos')
ON CONFLICT (slug) DO NOTHING;

-- 4.3 Recordatorio 30 días (contacto)
INSERT INTO message_templates(scope,nombre,slug,asunto,cuerpo,segmento) VALUES
('email','Recordatorio 30 días','rec-30d-contacto','Custodia360 | Pendientes por completar',
'Hola {{nombre}},

Sigues pendiente de completar: {{pendiente_list}}.
Accede antes de {{fecha_limite}}: {{onboarding_url}}

Gracias.',
'personal_contacto')
ON CONFLICT (slug) DO NOTHING;

-- 4.4 Alerta al delegado por vencidos 30d
INSERT INTO message_templates(scope,nombre,slug,asunto,cuerpo,segmento) VALUES
('email','Alerta vencidos 30d','alerta-delegado-30d','Custodia360 | Miembros vencidos (30 días)',
'Hola {{nombre}},

Hay miembros con requisitos vencidos (30 días). Revisa el panel:
{{panel_url}}

Listado:
{{vencidos_list}}
',
'delegado')
ON CONFLICT (slug) DO NOTHING;

-- 4.5 Resultado test
INSERT INTO message_templates(scope,nombre,slug,asunto,cuerpo,segmento) VALUES
('email','Resultado test','resultado-test','Custodia360 | Resultado de tu test',
'Hola {{nombre}},

Resultado: {{resultado}} ({{aciertos}}/{{total}}).
{{siguiente_paso}}

Gracias.',
'todos')
ON CONFLICT (slug) DO NOTHING;

-- 4.6 Compartir documento (biblioteca)
INSERT INTO message_templates(scope,nombre,slug,asunto,cuerpo,segmento) VALUES
('email','Documento compartido','share-doc','Custodia360 | Nuevo documento disponible',
'Hola {{nombre}},

Se te ha compartido un documento: {{doc_nombre}}.
Descarga:
{{doc_url}}

Gracias.',
'todos')
ON CONFLICT (slug) DO NOTHING;

-- 4.7 Informe de inspección listo (delegado)
INSERT INTO message_templates(scope,nombre,slug,asunto,cuerpo,segmento) VALUES
('email','Informe de inspección','inspeccion-report','Custodia360 | Informe de inspección',
'Hola {{nombre}},

Tu informe de inspección está listo.
Descárgalo aquí:
{{informe_url}}

Un saludo,
Custodia360',
'delegado')
ON CONFLICT (slug) DO NOTHING;

-- 4.8 Email a ADMINISTRACIÓN con factura (Stripe)
INSERT INTO message_templates(scope,nombre,slug,asunto,cuerpo,segmento) VALUES
('email','Factura de la entidad (Stripe)','factura-administracion','Custodia360 | Factura disponible',
'Hola,

Adjuntamos/enlazamos la factura correspondiente al plan contratado por {{entidad}}.
Puedes descargarla aquí:
{{factura_url}}

Cualquier duda, responde a este correo.
Gracias.',
'administracion')
ON CONFLICT (slug) DO NOTHING;

-- 4.9 Email a la PERSONA CONTRATANTE (confirmación)
INSERT INTO message_templates(scope,nombre,slug,asunto,cuerpo,segmento) VALUES
('email','Confirmación de contratación','confirmacion-contratante','Custodia360 | Confirmación de tu contratación',
'Hola {{nombre}},

Hemos recibido tu contratación del plan: {{plan_contratado}} para la entidad {{entidad}}.
Iniciamos el proceso y te mantendremos informado. Acceso al panel del delegado (cuando corresponda): {{panel_url}}

Gracias por confiar en Custodia360.',
'contratante')
ON CONFLICT (slug) DO NOTHING;
