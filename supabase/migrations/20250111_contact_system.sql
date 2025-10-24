-- ============================================================
-- CONTACT SYSTEM - CUSTODIA360
-- Tabla de mensajes de contacto + plantillas de email
-- ============================================================

-- Tabla de log de mensajes de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  consent BOOLEAN DEFAULT FALSE,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at DESC);

-- ============================================================
-- PLANTILLAS DE EMAIL PARA CONTACTO
-- ============================================================

-- Notificación interna (para nandolmo@teamsml.com)
INSERT INTO message_templates (scope, nombre, slug, asunto, cuerpo, segmento) VALUES
('email', 'Contacto Web (interno)', 'contacto-web',
'[Custodia360] Nuevo mensaje de contacto: {{subject}}',
'Has recibido un mensaje desde la página de contacto:

Nombre: {{name}}
Email: {{email}}
Teléfono: {{phone}}
Asunto: {{subject}}

Mensaje:
{{message}}

Fecha: {{fecha}}
Origen: {{ip}} — {{user_agent}}
',
'todos')
ON CONFLICT (slug) DO NOTHING;

-- Auto-respuesta al remitente
INSERT INTO message_templates (scope, nombre, slug, asunto, cuerpo, segmento) VALUES
('email', 'Contacto Web (auto-respuesta)', 'contacto-auto-reply',
'Custodia360 | Hemos recibido tu mensaje',
'Hola {{name}},

Gracias por contactar con Custodia360. Hemos recibido tu mensaje y en breve nuestro sistema y/o un responsable se pondrá en contacto contigo.

Si tu consulta es urgente, puedes escribirnos a {{reply_to}}.

Un saludo,
Equipo Custodia360
www.custodia360.es',
'todos')
ON CONFLICT (slug) DO NOTHING;
