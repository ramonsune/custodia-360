-- ============================================================
-- PANEL DELEGADO UNIFICADO - CUSTODIA360
-- Tablas para gestión integral del delegado
-- ============================================================

-- Contactos de entidad (teléfonos de emergencia, direcciones, externos)
CREATE TABLE IF NOT EXISTS entity_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  tipo TEXT DEFAULT 'general', -- 'emergencias','delegado','direccion','externo','guardia_civil','policia','fiscalia','servicios_sociales'
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entity_contacts_entity ON entity_contacts(entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_contacts_tipo ON entity_contacts(tipo);

-- Tipos de incidentes/urgencias con pasos guiados
CREATE TABLE IF NOT EXISTS incident_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,                 -- 'revelacion_directa','accidente','ciberacoso','agresion_fisica','sospecha_maltrato'
  titulo TEXT NOT NULL,
  descripcion TEXT,
  sector TEXT DEFAULT 'general',             -- 'deportivo','educativo','ocio','general'
  pasos JSONB NOT NULL DEFAULT '[]',         -- ['Escucha activa y no invasiva','Registra hechos sin juzgar','Activa protocolo interno','Contacta con X',...]
  contactos_recomendados TEXT[],             -- ['fiscalia','servicios_sociales','guardia_civil']
  prioridad TEXT DEFAULT 'media',            -- 'alta','media','baja'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incident_types_sector ON incident_types(sector);

-- Incidentes urgentes registrados
CREATE TABLE IF NOT EXISTS urgent_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  type_slug TEXT REFERENCES incident_types(slug),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  menor_involucrado BOOLEAN DEFAULT false,
  menor_id UUID, -- referencias a delegados si aplicable
  acciones JSONB DEFAULT '[]',               -- [{"paso":"Escucha activa","completado":true,"timestamp":"...","nota":"..."}]
  estado TEXT DEFAULT 'abierto',             -- 'abierto','en_seguimiento','cerrado','derivado'
  prioridad TEXT DEFAULT 'media',
  created_by UUID, -- user_id delegado
  closed_by UUID,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_urgent_incidents_entity ON urgent_incidents(entity_id);
CREATE INDEX IF NOT EXISTS idx_urgent_incidents_estado ON urgent_incidents(estado);
CREATE INDEX IF NOT EXISTS idx_urgent_incidents_created ON urgent_incidents(created_at DESC);

-- Plantillas de documentos PDF (planes, protocolos, códigos, informes)
CREATE TABLE IF NOT EXISTS pdf_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,                 -- 'plan-proteccion','protocolo-actuacion','codigo-conducta','info-familias'
  nombre TEXT NOT NULL,
  descripcion TEXT,
  sector TEXT DEFAULT 'general',             -- 'deportivo','educativo','ocio','general'
  categoria TEXT DEFAULT 'protocolo',        -- 'protocolo','plan','codigo','informe','comunicacion'
  contenido JSONB NOT NULL,                  -- Estructura del documento con placeholders {{entidad}}, {{delegado}}, {{sector}}, {{fecha}}
  plantilla_html TEXT,                       -- HTML template para generación
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pdf_templates_sector ON pdf_templates(sector);
CREATE INDEX IF NOT EXISTS idx_pdf_templates_categoria ON pdf_templates(categoria);

-- PDFs generados para entidades
CREATE TABLE IF NOT EXISTS generated_pdfs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  template_id UUID REFERENCES pdf_templates(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  storage_path TEXT NOT NULL,               -- path en Supabase Storage
  tipo TEXT DEFAULT 'protocolo',
  contexto JSONB,                           -- Variables usadas para generar
  generated_by UUID,                        -- user_id delegado
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generated_pdfs_entity ON generated_pdfs(entity_id);
CREATE INDEX IF NOT EXISTS idx_generated_pdfs_tipo ON generated_pdfs(tipo);

-- Biblioteca de documentos de entidad (subidos o generados)
CREATE TABLE IF NOT EXISTS library_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  storage_path TEXT NOT NULL,
  tipo TEXT DEFAULT 'documento',            -- 'documento','imagen','video','protocolo','certificado'
  mime_type TEXT,
  size_bytes BIGINT,
  uploaded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_library_assets_entity ON library_assets(entity_id);
CREATE INDEX IF NOT EXISTS idx_library_assets_tipo ON library_assets(tipo);

-- Comparticiones de documentos
CREATE TABLE IF NOT EXISTS library_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES library_assets(id) ON DELETE CASCADE,
  entity_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  shared_with_email TEXT,
  shared_with_person_id UUID, -- referencia a delegados
  message_job_id BIGINT,                    -- referencia a message_jobs si se envió por email
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_library_shares_asset ON library_shares(asset_id);
CREATE INDEX IF NOT EXISTS idx_library_shares_entity ON library_shares(entity_id);

-- Items de implementación LOPIVI (checklist dinámico)
CREATE TABLE IF NOT EXISTS implementation_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,                -- 'formacion_delegado','plan_proteccion','canal_denuncias','registro_menores'
  titulo TEXT NOT NULL,
  descripcion TEXT,
  sector TEXT DEFAULT 'general',
  categoria TEXT DEFAULT 'obligatorio',     -- 'obligatorio','recomendado','opcional'
  orden INT DEFAULT 0,
  documentos_sugeridos TEXT[],              -- slugs de pdf_templates
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_implementation_items_sector ON implementation_items(sector);

-- Estado de implementación por entidad
CREATE TABLE IF NOT EXISTS implementation_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  item_slug TEXT REFERENCES implementation_items(slug),
  estado TEXT DEFAULT 'pendiente',          -- 'pendiente','en_progreso','completado','no_aplica'
  nota TEXT,
  evidencia_url TEXT,                       -- URL a documento/certificado
  completado_por UUID,
  completado_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_id, item_slug)
);

CREATE INDEX IF NOT EXISTS idx_implementation_status_entity ON implementation_status(entity_id);
CREATE INDEX IF NOT EXISTS idx_implementation_status_estado ON implementation_status(estado);

-- Informes de inspección generados
CREATE TABLE IF NOT EXISTS inspector_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  tipo TEXT DEFAULT 'cumplimiento',         -- 'cumplimiento','inspeccion','auditoria'
  contenido JSONB,                          -- Datos estructurados del informe
  storage_path TEXT,                        -- PDF generado
  generado_por UUID,
  fecha_inicio DATE,
  fecha_fin DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inspector_reports_entity ON inspector_reports(entity_id);
CREATE INDEX IF NOT EXISTS idx_inspector_reports_created ON inspector_reports(created_at DESC);

-- Log de acciones del delegado (auditoría)
CREATE TABLE IF NOT EXISTS action_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entity_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL,                     -- 'envio_email','generar_documento','marcar_penal','abrir_urgencia'
  descripcion TEXT,
  metadata JSONB,                           -- Datos adicionales contextuales
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_action_logs_entity ON action_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_action_logs_user ON action_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_action_logs_created ON action_logs(created_at DESC);

-- Confirmaciones de lectura de mensajes (opcional - para tracking avanzado)
CREATE TABLE IF NOT EXISTS message_receipts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recipient_id BIGINT REFERENCES message_recipients(id) ON DELETE CASCADE,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  reply_short TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_receipts_recipient ON message_receipts(recipient_id);

-- ============================================================
-- SEED DE TIPOS DE INCIDENTES
-- ============================================================

INSERT INTO incident_types (slug, titulo, descripcion, sector, pasos, contactos_recomendados, prioridad) VALUES
(
  'revelacion_directa',
  'Revelación Directa de Abuso',
  'El menor revela directamente una situación de abuso o violencia',
  'general',
  '[
    "Escucha activa, sin interrumpir ni juzgar",
    "Registra exactamente lo que dice el menor (sus palabras)",
    "NO interrogues ni hagas preguntas inductivas",
    "Agradece al menor por confiar",
    "Activa protocolo interno inmediatamente",
    "Contacta con Fiscalía/Servicios Sociales",
    "Informa a la familia (si no está implicada)",
    "Registra todo en el sistema"
  ]',
  ARRAY['fiscalia','servicios_sociales'],
  'alta'
),
(
  'sospecha_maltrato',
  'Sospecha de Maltrato/Abuso',
  'Indicadores o señales que hacen sospechar una situación de riesgo',
  'general',
  '[
    "Documenta los indicadores observados",
    "NO confrontes a la familia sin evidencia",
    "Consulta con equipo técnico/delegado",
    "Activa protocolo de valoración",
    "Contacta con Servicios Sociales para orientación",
    "Realiza seguimiento cercano",
    "Registra observaciones"
  ]',
  ARRAY['servicios_sociales'],
  'alta'
),
(
  'agresion_fisica',
  'Agresión Física Entre Menores',
  'Situación de violencia física entre participantes',
  'deportivo',
  '[
    "Detén la situación de inmediato",
    "Separa a los menores involucrados",
    "Evalúa si hay lesiones (primeros auxilios si es necesario)",
    "Documenta los hechos",
    "Informa a las familias",
    "Activa protocolo de convivencia",
    "Considera medidas educativas/disciplinarias",
    "Registra el incidente"
  ]',
  ARRAY['emergencias'],
  'alta'
),
(
  'ciberacoso',
  'Ciberacoso o Acoso Digital',
  'Situaciones de acoso a través de redes sociales o medios digitales',
  'general',
  '[
    "Recoge evidencias digitales (capturas de pantalla)",
    "Escucha al menor afectado",
    "Informa a las familias de ambas partes",
    "Activa protocolo de convivencia",
    "Contacta con tutor/educador del centro",
    "Considera denuncia si es delito",
    "Ofrece apoyo psicológico al afectado",
    "Registra todo en el sistema"
  ]',
  ARRAY['guardia_civil','policia'],
  'media'
),
(
  'accidente_leve',
  'Accidente o Lesión Leve',
  'Lesión menor que no requiere atención médica urgente',
  'deportivo',
  '[
    "Aplica primeros auxilios básicos",
    "Evalúa la gravedad de la lesión",
    "Documenta cómo ocurrió el accidente",
    "Informa a la familia inmediatamente",
    "Completa parte de accidentes",
    "Revisa si hay medidas preventivas a tomar",
    "Registra en el sistema"
  ]',
  ARRAY['emergencias'],
  'baja'
),
(
  'accidente_grave',
  'Accidente o Lesión Grave',
  'Lesión que requiere atención médica inmediata',
  'deportivo',
  '[
    "Llama al 112 INMEDIATAMENTE",
    "NO muevas al menor si hay riesgo de lesión grave",
    "Aplica primeros auxilios si está capacitado",
    "Contacta con la familia URGENTE",
    "Acompaña al menor al centro médico",
    "Documenta todos los detalles del accidente",
    "Informa a la aseguradora si procede",
    "Completa parte de accidentes",
    "Registra en el sistema"
  ]',
  ARRAY['emergencias'],
  'alta'
),
(
  'comportamiento_inadecuado_adulto',
  'Comportamiento Inadecuado de Adulto',
  'Conducta inapropiada de personal/adulto con menores',
  'general',
  '[
    "Documenta la situación observada",
    "Separa inmediatamente al adulto del contacto con menores",
    "Informa a la dirección/junta directiva",
    "Activa protocolo de prevención",
    "Valora si es necesario denunciar",
    "Contacta con Fiscalía si hay indicios de delito",
    "NO confrontes solo al adulto",
    "Registra todo en el sistema"
  ]',
  ARRAY['fiscalia','direccion'],
  'alta'
),
(
  'fuga_menor',
  'Menor Ausente o Fugado',
  'Menor que se ha ausentado sin permiso o no aparece',
  'general',
  '[
    "Busca inmediatamente en las instalaciones",
    "Contacta con la familia URGENTE",
    "Si no aparece en 15 min, llama a Policía/Guardia Civil",
    "Revisa cámaras de seguridad si las hay",
    "Pregunta a otros menores si lo han visto",
    "Documenta hora de desaparición y circunstancias",
    "Mantén comunicación constante con familia y autoridades",
    "Registra en el sistema"
  ]',
  ARRAY['policia','guardia_civil','emergencias'],
  'alta'
);

-- ============================================================
-- SEED DE ITEMS DE IMPLEMENTACIÓN
-- ============================================================

INSERT INTO implementation_items (slug, titulo, descripcion, sector, categoria, orden) VALUES
('formacion_delegado', 'Formación del Delegado', 'Delegado principal certificado en LOPIVI', 'general', 'obligatorio', 1),
('plan_proteccion', 'Plan de Protección Infantil', 'Documento detallando medidas de protección', 'general', 'obligatorio', 2),
('codigo_conducta', 'Código de Conducta', 'Normas de comportamiento para personal y menores', 'general', 'obligatorio', 3),
('protocolo_actuacion', 'Protocolo de Actuación ante Violencia', 'Protocolo claro de pasos a seguir', 'general', 'obligatorio', 4),
('canal_denuncias', 'Canal de Denuncias LOPIVI', 'Canal seguro para reportar situaciones', 'general', 'obligatorio', 5),
('registro_menores', 'Registro de Menores', 'Base de datos actualizada de participantes', 'general', 'obligatorio', 6),
('formacion_personal', 'Formación del Personal', 'Todo el personal formado en prevención', 'general', 'obligatorio', 7),
('certificados_penales', 'Certificados de Delitos Sexuales', 'Todo el personal con certificado vigente', 'general', 'obligatorio', 8),
('comunicacion_familias', 'Comunicación a Familias', 'Información clara a familias sobre medidas', 'general', 'obligatorio', 9),
('autorizaciones', 'Autorizaciones y Consentimientos', 'Formularios firmados por familias', 'general', 'recomendado', 10),
('supervision_instalaciones', 'Supervisión de Instalaciones', 'Medidas de seguridad física (vestuarios, etc.)', 'deportivo', 'recomendado', 11),
('evaluacion_riesgos', 'Evaluación de Riesgos', 'Análisis de situaciones de riesgo específicas', 'general', 'recomendado', 12),
('plan_mejora', 'Plan de Mejora Continua', 'Revisión periódica y actualizaciones', 'general', 'recomendado', 13);

-- ============================================================
-- SEED DE CONTACTOS GENÉRICOS (se pueden personalizar por entidad)
-- ============================================================

-- Estos contactos son de referencia nacional, cada entidad puede añadir los suyos

COMMENT ON TABLE entity_contacts IS 'Contactos de emergencia y autoridades por entidad';
COMMENT ON TABLE incident_types IS 'Catálogo de tipos de urgencias con guías paso a paso';
COMMENT ON TABLE urgent_incidents IS 'Registro de incidentes urgentes gestionados por delegados';
COMMENT ON TABLE pdf_templates IS 'Plantillas de documentos LOPIVI (planes, protocolos, códigos)';
COMMENT ON TABLE generated_pdfs IS 'Documentos PDF generados para cada entidad';
COMMENT ON TABLE library_assets IS 'Biblioteca de documentos de la entidad';
COMMENT ON TABLE library_shares IS 'Registro de comparticiones de documentos';
COMMENT ON TABLE implementation_items IS 'Checklist de implementación LOPIVI';
COMMENT ON TABLE implementation_status IS 'Estado de implementación por entidad';
COMMENT ON TABLE inspector_reports IS 'Informes de cumplimiento/inspección generados';
COMMENT ON TABLE action_logs IS 'Auditoría de acciones del delegado';
COMMENT ON TABLE message_receipts IS 'Confirmaciones de lectura de mensajes enviados';
