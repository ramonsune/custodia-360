-- ============================================================
-- EXPANSIÓN DE PLANTILLAS DE EMAIL - CUSTODIA360
-- Añade plantillas para contacto, contratación y recordatorios
-- ============================================================

-- 1) Auto-respuesta Contacto
INSERT INTO message_templates(slug, nombre, asunto, cuerpo, scope, segmento) VALUES
('contact-auto-reply', 'Contacto | Autorespuesta',
'Custodia360 | Hemos recibido tu mensaje',
'Hola {{nombre}},

Gracias por contactarnos. Hemos recibido tu solicitud y en breve nos pondremos en contacto contigo.

Un saludo,
Equipo Custodia360',
'email', 'todos')
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  asunto = EXCLUDED.asunto,
  cuerpo = EXCLUDED.cuerpo;

-- 2) Confirmación contratación al CONTRATANTE
INSERT INTO message_templates(slug, nombre, asunto, cuerpo, scope, segmento) VALUES
('contractor-confirm', 'Contratación | Confirmación',
'Custodia360 | Confirmación de tu contratación',
'Hola {{responsable}},

Gracias por contratar {{plan_nombre}} para la entidad {{entidad}}. Iniciamos el proceso de formación del/de la Delegado/a{{suplente_txt}}.

Podrás acceder desde la página de Acceso: {{acceso_url}}

Cualquier duda: info@custodia360.es

Gracias,
Custodia360',
'email', 'contratante')
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  asunto = EXCLUDED.asunto,
  cuerpo = EXCLUDED.cuerpo;

-- 3) Factura a ADMINISTRACIÓN (dos tramos 1er año, anual a partir del 2º)
INSERT INTO message_templates(slug, nombre, asunto, cuerpo, scope, segmento) VALUES
('admin-invoice', 'Administración | Factura',
'Custodia360 | Factura de tu plan',
'Hola,

Adjuntamos la información de la factura del plan {{plan_nombre}} para {{entidad}}.
Descarga tu factura aquí: {{invoice_url}}

Recuerda: durante el primer año el pago se realiza en dos tramos; a partir del segundo año, un único pago anual.

Gracias,
Custodia360',
'email', 'administracion')
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  asunto = EXCLUDED.asunto,
  cuerpo = EXCLUDED.cuerpo;

-- 4) Bienvenida Delegado(a) Principal
INSERT INTO message_templates(slug, nombre, asunto, cuerpo, scope, segmento) VALUES
('delegate-welcome', 'Delegado | Bienvenida y accesos',
'Custodia360 | Bienvenida y acceso a tu formación',
'Hola {{delegado_nombre}},

Bienvenido/a a Custodia360. Para comenzar tu formación, accede desde {{acceso_url}} con estas credenciales:
- Email: {{delegado_email}}
- Contraseña: (la que indicaste en la contratación)

Pasos a seguir:
1) Completar módulos
2) Descargar contenido en PDF
3) Realizar test (20 preguntas, mínimo 75%)
4) Obtener tu certificado

Soporte: info@custodia360.es

Gracias,
Custodia360',
'email', 'delegado')
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  asunto = EXCLUDED.asunto,
  cuerpo = EXCLUDED.cuerpo;

-- 5) Bienvenida Delegado(a) Suplente (si aplica)
INSERT INTO message_templates(slug, nombre, asunto, cuerpo, scope, segmento) VALUES
('delegate-supl-welcome', 'Delegado Suplente | Bienvenida y accesos',
'Custodia360 | Bienvenida (Delegado/a Suplente)',
'Hola {{delegado_nombre}},

Has sido designado/a como Delegado/a Suplente de {{entidad}}. Accede desde {{acceso_url}} con:
- Email: {{delegado_email}}
- Contraseña: (la que indicaste en la contratación)

Completa tu formación para poder acceder al panel cuando sea necesario.

Soporte: info@custodia360.es

Gracias,
Custodia360',
'email', 'delegado')
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  asunto = EXCLUDED.asunto,
  cuerpo = EXCLUDED.cuerpo;

-- 6) Recordatorio 5 meses (faltan 30 días para segundo tramo)
INSERT INTO message_templates(slug, nombre, asunto, cuerpo, scope, segmento) VALUES
('billing-5m-reminder', 'Recordatorio 5 meses',
'Custodia360 | En 30 días se cobrará el segundo tramo de tu plan',
'Hola,

Te recordamos que en 30 días cargaremos el segundo tramo del plan {{plan_nombre}} de {{entidad}}.

Gracias,
Custodia360',
'email', 'administracion')
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  asunto = EXCLUDED.asunto,
  cuerpo = EXCLUDED.cuerpo;

-- 7) Recordatorio 11 meses (faltan 30 días para el pago anual)
INSERT INTO message_templates(slug, nombre, asunto, cuerpo, scope, segmento) VALUES
('billing-11m-reminder', 'Recordatorio 11 meses',
'Custodia360 | En 30 días se cobrará el pago anual de tu plan',
'Hola,

Te recordamos que en 30 días cargaremos el pago anual del plan {{plan_nombre}} de {{entidad}}.

Gracias,
Custodia360',
'email', 'administracion')
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  asunto = EXCLUDED.asunto,
  cuerpo = EXCLUDED.cuerpo;

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_message_templates_slug ON message_templates(slug);
CREATE INDEX IF NOT EXISTS idx_message_jobs_status ON message_jobs(status);
CREATE INDEX IF NOT EXISTS idx_message_jobs_scheduled ON message_jobs(scheduled_for);
