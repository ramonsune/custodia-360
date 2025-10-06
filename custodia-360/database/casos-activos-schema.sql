-- ================================
-- TABLA PARA CASOS ACTIVOS LOPIVI
-- ================================

-- Tabla principal de casos activos (no urgentes)
CREATE TABLE IF NOT EXISTS casos_activos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caso_id TEXT UNIQUE NOT NULL, -- CA-YYYY-NNNN (Caso Activo)
  entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  delegado_id UUID REFERENCES delegados(id) ON DELETE CASCADE,

  -- Información básica del caso
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  tipo_caso TEXT NOT NULL, -- 'seguimiento', 'incidencia', 'protocolo', 'revision'
  prioridad TEXT NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta')) DEFAULT 'media',
  estado TEXT NOT NULL CHECK (estado IN ('activo', 'pendiente', 'en_revision', 'resuelto', 'cerrado')) DEFAULT 'activo',

  -- Personas involucradas
  menor_afectado JSONB, -- {nombre_iniciales, edad, genero, grupo}
  personal_involucrado JSONB[], -- Array de personal involucrado
  familia_contactada BOOLEAN DEFAULT FALSE,
  fecha_contacto_familia TIMESTAMPTZ,

  -- Ubicación y tiempo
  ubicacion TEXT,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_incidente TIMESTAMPTZ,
  fecha_ultima_actualizacion TIMESTAMPTZ DEFAULT NOW(),

  -- Seguimiento y acciones
  acciones_realizadas TEXT[],
  proxima_accion TEXT,
  fecha_proxima_accion TIMESTAMPTZ,
  notas_seguimiento TEXT,

  -- Documentación asociada
  documentos_adjuntos TEXT[], -- URLs o IDs de documentos
  evidencias TEXT[], -- Fotos, videos, etc.

  -- Estado de cumplimiento
  cumplimiento_lopivi BOOLEAN DEFAULT TRUE,
  requiere_revision BOOLEAN DEFAULT FALSE,
  fecha_cierre TIMESTAMPTZ,
  motivo_cierre TEXT,
  cerrado_por UUID REFERENCES delegados(id),

  -- Metadatos de auditoría
  created_by UUID REFERENCES delegados(id) NOT NULL,
  updated_by UUID REFERENCES delegados(id),
  ip_address TEXT,
  legal_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de acciones/seguimientos en casos activos
CREATE TABLE IF NOT EXISTS caso_activo_acciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caso_activo_id UUID REFERENCES casos_activos(id) ON DELETE CASCADE,
  delegado_id UUID REFERENCES delegados(id) ON DELETE CASCADE,

  tipo_accion TEXT NOT NULL, -- 'seguimiento', 'contacto_familia', 'revision', 'actualizacion'
  descripcion TEXT NOT NULL,
  resultado TEXT,
  fecha_programada TIMESTAMPTZ,
  fecha_completada TIMESTAMPTZ,
  estado_accion TEXT CHECK (estado_accion IN ('programada', 'en_progreso', 'completada', 'cancelada')) DEFAULT 'programada',

  -- Archivos adjuntos de la acción
  archivos_adjuntos TEXT[],
  observaciones TEXT,

  -- Auditoría
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  legal_hash TEXT NOT NULL
);

-- Tabla de comunicaciones relacionadas con casos activos
CREATE TABLE IF NOT EXISTS caso_activo_comunicaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caso_activo_id UUID REFERENCES casos_activos(id) ON DELETE CASCADE,
  delegado_id UUID REFERENCES delegados(id) ON DELETE CASCADE,

  tipo_comunicacion TEXT NOT NULL, -- 'email', 'telefono', 'reunion', 'carta'
  destinatario TEXT NOT NULL, -- familia, autoridad, personal, etc.
  asunto TEXT,
  mensaje TEXT,
  canal TEXT NOT NULL, -- 'familia', 'personal', 'servicios_sociales', 'centro_educativo'

  estado TEXT CHECK (estado IN ('enviada', 'recibida', 'respondida', 'pendiente')) DEFAULT 'enviada',
  fecha_envio TIMESTAMPTZ DEFAULT NOW(),
  fecha_respuesta TIMESTAMPTZ,
  respuesta TEXT,

  -- Auditoría
  legal_hash TEXT NOT NULL,
  ip_address TEXT
);

-- ================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ================================

CREATE INDEX IF NOT EXISTS idx_casos_activos_entidad ON casos_activos(entidad_id);
CREATE INDEX IF NOT EXISTS idx_casos_activos_delegado ON casos_activos(delegado_id);
CREATE INDEX IF NOT EXISTS idx_casos_activos_estado ON casos_activos(estado);
CREATE INDEX IF NOT EXISTS idx_casos_activos_prioridad ON casos_activos(prioridad);
CREATE INDEX IF NOT EXISTS idx_casos_activos_fecha ON casos_activos(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_casos_activos_caso_id ON casos_activos(caso_id);

CREATE INDEX IF NOT EXISTS idx_caso_activo_acciones_caso ON caso_activo_acciones(caso_activo_id);
CREATE INDEX IF NOT EXISTS idx_caso_activo_acciones_delegado ON caso_activo_acciones(delegado_id);
CREATE INDEX IF NOT EXISTS idx_caso_activo_acciones_fecha ON caso_activo_acciones(timestamp);

CREATE INDEX IF NOT EXISTS idx_caso_activo_comunicaciones_caso ON caso_activo_comunicaciones(caso_activo_id);
CREATE INDEX IF NOT EXISTS idx_caso_activo_comunicaciones_fecha ON caso_activo_comunicaciones(fecha_envio);

-- ================================
-- TRIGGERS
-- ================================

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_casos_activos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.fecha_ultima_actualizacion = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_casos_activos_updated_at ON casos_activos;
CREATE TRIGGER update_casos_activos_updated_at
    BEFORE UPDATE ON casos_activos
    FOR EACH ROW EXECUTE FUNCTION update_casos_activos_updated_at();

-- Función para generar ID único de caso activo
CREATE OR REPLACE FUNCTION generar_caso_activo_id()
RETURNS TRIGGER AS $$
DECLARE
    nuevo_numero INTEGER;
    nuevo_id TEXT;
    year_actual TEXT;
BEGIN
    year_actual := EXTRACT(YEAR FROM NOW())::TEXT;

    -- Obtener el próximo número de caso para este año
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(caso_id FROM 'CA-' || year_actual || '-(\d+)') AS INTEGER)
    ), 0) + 1
    INTO nuevo_numero
    FROM casos_activos
    WHERE caso_id LIKE 'CA-' || year_actual || '-%';

    -- Formatear como CA-YYYY-NNNN
    nuevo_id := 'CA-' || year_actual || '-' || LPAD(nuevo_numero::TEXT, 4, '0');

    NEW.caso_id := nuevo_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS generar_caso_activo_id_trigger ON casos_activos;
CREATE TRIGGER generar_caso_activo_id_trigger
    BEFORE INSERT ON casos_activos
    FOR EACH ROW EXECUTE FUNCTION generar_caso_activo_id();

-- ================================
-- POLÍTICAS DE SEGURIDAD
-- ================================

-- Deshabilitar RLS para auditoría automática
ALTER TABLE casos_activos DISABLE ROW LEVEL SECURITY;
ALTER TABLE caso_activo_acciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE caso_activo_comunicaciones DISABLE ROW LEVEL SECURITY;

-- ================================
-- DATOS DE EJEMPLO
-- ================================

-- Función para insertar casos activos de ejemplo (solo para desarrollo)
CREATE OR REPLACE FUNCTION insertar_casos_activos_ejemplo()
RETURNS void AS $$
DECLARE
    entidad_ejemplo_id UUID;
    delegado_ejemplo_id UUID;
BEGIN
    -- Buscar IDs de ejemplo
    SELECT id INTO entidad_ejemplo_id FROM entidades WHERE cif = 'B12345678' LIMIT 1;
    SELECT id INTO delegado_ejemplo_id FROM delegados WHERE email LIKE '%demo%' LIMIT 1;

    -- Si no existen, crear datos mínimos
    IF entidad_ejemplo_id IS NULL THEN
        INSERT INTO entidades (nombre, cif, direccion, ciudad, codigo_postal, provincia, telefono, email, numero_menores, tipo_entidad, plan, precio_mensual, dashboard_email, dashboard_password)
        VALUES ('Entidad Ejemplo', 'B12345678', 'Calle Ejemplo 123', 'Madrid', '28001', 'Madrid', '911234567', 'ejemplo@test.com', '51-200', 'academia', 'Plan 200', 49.00, 'admin@ejemplo.com', 'demo2024')
        RETURNING id INTO entidad_ejemplo_id;
    END IF;

    IF delegado_ejemplo_id IS NULL THEN
        INSERT INTO delegados (entidad_id, tipo, nombre, apellidos, dni, telefono, email, password, disponibilidad)
        VALUES (entidad_ejemplo_id, 'principal', 'Delegado', 'Ejemplo', '12345678A', '666123456', 'delegado@ejemplo.com', 'demo2024', 'completa')
        RETURNING id INTO delegado_ejemplo_id;
    END IF;

    -- Insertar casos activos de ejemplo
    INSERT INTO casos_activos (
        entidad_id, delegado_id, created_by, titulo, descripcion, tipo_caso, prioridad, estado,
        menor_afectado, ubicacion, fecha_incidente, acciones_realizadas, proxima_accion,
        fecha_proxima_accion, notas_seguimiento, legal_hash
    ) VALUES
    (
        entidad_ejemplo_id,
        delegado_ejemplo_id,
        delegado_ejemplo_id,
        'Incidencia en área de recreo',
        'Situación reportada en el área de recreo que requiere seguimiento continuo.',
        'seguimiento',
        'alta',
        'activo',
        '{"nombre_iniciales": "A.B.", "edad": 8, "genero": "masculino", "grupo": "infantil"}',
        'Área de recreo principal',
        NOW() - INTERVAL '2 days',
        ARRAY['Evaluación inicial realizada', 'Contacto con familia', 'Protocolo de seguimiento activado'],
        'Reunión con coordinadora educativa',
        NOW() + INTERVAL '3 days',
        'Caso requiere seguimiento semanal. Familia colaborativa.',
        'hash_ejemplo_001'
    ),
    (
        entidad_ejemplo_id,
        delegado_ejemplo_id,
        delegado_ejemplo_id,
        'Seguimiento familiar',
        'Seguimiento necesario con familia de menor tras incidente previo.',
        'revision',
        'media',
        'pendiente',
        '{"nombre_iniciales": "C.D.", "edad": 12, "genero": "femenino", "grupo": "juvenil"}',
        'Área de estudios',
        NOW() - INTERVAL '5 days',
        ARRAY['Primera reunión familiar completada', 'Plan de seguimiento establecido'],
        'Segunda reunión de seguimiento',
        NOW() + INTERVAL '1 week',
        'Progreso positivo. Familia muy implicada en el proceso.',
        'hash_ejemplo_002'
    ),
    (
        entidad_ejemplo_id,
        delegado_ejemplo_id,
        delegado_ejemplo_id,
        'Protocolo activado',
        'Protocolo de protección activado, requiere documentación y seguimiento.',
        'protocolo',
        'alta',
        'activo',
        '{"nombre_iniciales": "E.F.", "edad": 10, "genero": "masculino", "grupo": "intermedio"}',
        'Sala de actividades',
        NOW() - INTERVAL '1 day',
        ARRAY['Protocolo activado inmediatamente', 'Documentación iniciada', 'Servicios contactados'],
        'Revisión de protocolo con servicios sociales',
        NOW() + INTERVAL '2 days',
        'Protocolo activo. Coordinación con servicios externos en curso.',
        'hash_ejemplo_003'
    )
    ON CONFLICT (caso_id) DO NOTHING;

    -- Insertar algunas acciones de ejemplo
    INSERT INTO caso_activo_acciones (
        caso_activo_id, delegado_id, tipo_accion, descripcion, resultado,
        fecha_completada, estado_accion, legal_hash
    )
    SELECT
        ca.id,
        delegado_ejemplo_id,
        'seguimiento',
        'Reunión de seguimiento semanal completada',
        'Progreso positivo observado',
        NOW() - INTERVAL '1 day',
        'completada',
        'hash_accion_' || ca.caso_id
    FROM casos_activos ca
    WHERE ca.entidad_id = entidad_ejemplo_id
    LIMIT 1
    ON CONFLICT DO NOTHING;

END;
$$ language 'plpgsql';

-- ================================
-- COMENTARIOS
-- ================================

COMMENT ON TABLE casos_activos IS 'Casos activos regulares LOPIVI (no urgentes) con auditoría completa';
COMMENT ON TABLE caso_activo_acciones IS 'Acciones y seguimientos realizados en casos activos';
COMMENT ON TABLE caso_activo_comunicaciones IS 'Comunicaciones relacionadas con casos activos';

-- ================================
-- SCRIPT COMPLETADO
-- ================================
