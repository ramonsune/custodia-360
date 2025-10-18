-- ================================
-- TABLAS PARA CASOS URGENTES LOPIVI
-- ================================

-- Tabla principal de casos urgentes
CREATE TABLE IF NOT EXISTS casos_urgentes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caso_id TEXT UNIQUE NOT NULL, -- ID único del caso (CU-YYYY-NNNN)
  entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  delegado_id UUID REFERENCES delegados(id) ON DELETE CASCADE,

  -- Información básica del caso
  tipo_protocolo TEXT NOT NULL CHECK (tipo_protocolo IN ('maltrato', 'abandono', 'abuso', 'emergencia')),
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  prioridad TEXT NOT NULL CHECK (prioridad IN ('alta', 'critica')) DEFAULT 'alta',
  estado TEXT NOT NULL CHECK (estado IN ('activo', 'en_seguimiento', 'resuelto', 'cerrado')) DEFAULT 'activo',

  -- Personas involucradas
  menor_afectado JSONB, -- {nombre_iniciales, edad, genero}
  personal_involucrado JSONB[], -- Array de personas del personal
  testigos JSONB[], -- Array de testigos
  familia_contactada BOOLEAN DEFAULT FALSE,

  -- Ubicación y tiempo
  ubicacion TEXT,
  fecha_incidente TIMESTAMPTZ NOT NULL,
  fecha_reporte TIMESTAMPTZ DEFAULT NOW(),

  -- Acciones tomadas
  acciones_inmediatas TEXT[],
  servicios_contactados TEXT[], -- ['112', 'servicios_sociales', 'policia', 'fiscalia']
  documentos_generados TEXT[], -- Array de IDs de documentos PDF

  -- Seguimiento
  proxima_revision TIMESTAMPTZ,
  observaciones TEXT,
  cerrado_por UUID REFERENCES delegados(id),
  fecha_cierre TIMESTAMPTZ,
  motivo_cierre TEXT,

  -- Metadatos de auditoría
  ip_address TEXT,
  user_agent TEXT,
  legal_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de acciones realizadas en casos urgentes
CREATE TABLE IF NOT EXISTS caso_urgente_acciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caso_urgente_id UUID REFERENCES casos_urgentes(id) ON DELETE CASCADE,
  delegado_id UUID REFERENCES delegados(id) ON DELETE CASCADE,

  tipo_accion TEXT NOT NULL, -- 'contacto_familia', 'llamada_emergencias', 'documento_generado', etc.
  descripcion TEXT NOT NULL,
  resultado TEXT,
  archivo_adjunto TEXT, -- URL o ID de archivo si aplica

  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  legal_hash TEXT NOT NULL
);

-- Tabla de notificaciones enviadas por casos urgentes
CREATE TABLE IF NOT EXISTS caso_urgente_notificaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caso_urgente_id UUID REFERENCES casos_urgentes(id) ON DELETE CASCADE,

  tipo_notificacion TEXT NOT NULL, -- 'email', 'sms', 'llamada'
  destinatario TEXT NOT NULL, -- email, teléfono, etc.
  asunto TEXT,
  mensaje TEXT,
  canal TEXT NOT NULL, -- 'servicios_sociales', 'emergencias', 'familia', 'autoridades'

  estado TEXT NOT NULL CHECK (estado IN ('enviado', 'entregado', 'fallido')) DEFAULT 'enviado',
  fecha_envio TIMESTAMPTZ DEFAULT NOW(),
  fecha_entrega TIMESTAMPTZ,
  error_mensaje TEXT,

  -- Para auditoría legal
  legal_hash TEXT NOT NULL,
  ip_address TEXT
);

-- Tabla de documentos generados para casos urgentes
CREATE TABLE IF NOT EXISTS caso_urgente_documentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caso_urgente_id UUID REFERENCES casos_urgentes(id) ON DELETE CASCADE,

  tipo_documento TEXT NOT NULL, -- 'protocolo_maltrato', 'informe_caso', 'comunicacion_autoridades'
  nombre_archivo TEXT NOT NULL,
  url_archivo TEXT, -- URL de almacenamiento del PDF
  contenido_hash TEXT, -- Hash del contenido para verificación

  generado_por UUID REFERENCES delegados(id),
  fecha_generacion TIMESTAMPTZ DEFAULT NOW(),
  descargado_veces INTEGER DEFAULT 0,
  ultima_descarga TIMESTAMPTZ,

  legal_hash TEXT NOT NULL
);

-- ================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ================================

CREATE INDEX IF NOT EXISTS idx_casos_urgentes_entidad ON casos_urgentes(entidad_id);
CREATE INDEX IF NOT EXISTS idx_casos_urgentes_delegado ON casos_urgentes(delegado_id);
CREATE INDEX IF NOT EXISTS idx_casos_urgentes_estado ON casos_urgentes(estado);
CREATE INDEX IF NOT EXISTS idx_casos_urgentes_tipo ON casos_urgentes(tipo_protocolo);
CREATE INDEX IF NOT EXISTS idx_casos_urgentes_fecha ON casos_urgentes(fecha_incidente);
CREATE INDEX IF NOT EXISTS idx_casos_urgentes_caso_id ON casos_urgentes(caso_id);

CREATE INDEX IF NOT EXISTS idx_caso_acciones_caso ON caso_urgente_acciones(caso_urgente_id);
CREATE INDEX IF NOT EXISTS idx_caso_acciones_fecha ON caso_urgente_acciones(timestamp);

CREATE INDEX IF NOT EXISTS idx_caso_notificaciones_caso ON caso_urgente_notificaciones(caso_urgente_id);
CREATE INDEX IF NOT EXISTS idx_caso_notificaciones_estado ON caso_urgente_notificaciones(estado);

CREATE INDEX IF NOT EXISTS idx_caso_documentos_caso ON caso_urgente_documentos(caso_urgente_id);
CREATE INDEX IF NOT EXISTS idx_caso_documentos_tipo ON caso_urgente_documentos(tipo_documento);

-- ================================
-- TRIGGERS
-- ================================

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_casos_urgentes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_casos_urgentes_updated_at ON casos_urgentes;
CREATE TRIGGER update_casos_urgentes_updated_at
    BEFORE UPDATE ON casos_urgentes
    FOR EACH ROW EXECUTE FUNCTION update_casos_urgentes_updated_at();

-- Función para generar ID único de caso
CREATE OR REPLACE FUNCTION generar_caso_urgente_id()
RETURNS TRIGGER AS $$
DECLARE
    nuevo_numero INTEGER;
    nuevo_id TEXT;
    year_actual TEXT;
BEGIN
    year_actual := EXTRACT(YEAR FROM NOW())::TEXT;

    -- Obtener el próximo número de caso para este año
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(caso_id FROM 'CU-' || year_actual || '-(\d+)') AS INTEGER)
    ), 0) + 1
    INTO nuevo_numero
    FROM casos_urgentes
    WHERE caso_id LIKE 'CU-' || year_actual || '-%';

    -- Formatear como CU-YYYY-NNNN
    nuevo_id := 'CU-' || year_actual || '-' || LPAD(nuevo_numero::TEXT, 4, '0');

    NEW.caso_id := nuevo_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS generar_caso_urgente_id_trigger ON casos_urgentes;
CREATE TRIGGER generar_caso_urgente_id_trigger
    BEFORE INSERT ON casos_urgentes
    FOR EACH ROW EXECUTE FUNCTION generar_caso_urgente_id();

-- ================================
-- POLÍTICAS DE SEGURIDAD
-- ================================

-- Deshabilitar RLS para auditoría automática
ALTER TABLE casos_urgentes DISABLE ROW LEVEL SECURITY;
ALTER TABLE caso_urgente_acciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE caso_urgente_notificaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE caso_urgente_documentos DISABLE ROW LEVEL SECURITY;

-- ================================
-- COMENTARIOS
-- ================================

COMMENT ON TABLE casos_urgentes IS 'Registro de casos urgentes LOPIVI con auditoría completa';
COMMENT ON TABLE caso_urgente_acciones IS 'Auditoría de acciones tomadas en casos urgentes';
COMMENT ON TABLE caso_urgente_notificaciones IS 'Registro de notificaciones enviadas';
COMMENT ON TABLE caso_urgente_documentos IS 'Documentos PDF generados para casos urgentes';

-- ================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ================================

-- Función para limpiar datos de ejemplo (usar solo en desarrollo)
CREATE OR REPLACE FUNCTION limpiar_casos_urgentes_ejemplo()
RETURNS void AS $$
BEGIN
    DELETE FROM caso_urgente_documentos WHERE caso_urgente_id IN (
        SELECT id FROM casos_urgentes WHERE caso_id LIKE 'CU-2024-9999'
    );
    DELETE FROM caso_urgente_notificaciones WHERE caso_urgente_id IN (
        SELECT id FROM casos_urgentes WHERE caso_id LIKE 'CU-2024-9999'
    );
    DELETE FROM caso_urgente_acciones WHERE caso_urgente_id IN (
        SELECT id FROM casos_urgentes WHERE caso_id LIKE 'CU-2024-9999'
    );
    DELETE FROM casos_urgentes WHERE caso_id LIKE 'CU-2024-9999';
END;
$$ language 'plpgsql';
