-- ================================
-- ESQUEMA PERSONAL Y FORMACIONES LOPIVI
-- ================================

-- Tabla principal de personal de las entidades
CREATE TABLE IF NOT EXISTS personal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,

  -- Datos personales
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  dni TEXT UNIQUE NOT NULL,
  email TEXT,
  telefono TEXT,
  fecha_nacimiento DATE,

  -- Datos laborales
  cargo TEXT NOT NULL,
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_fin DATE, -- NULL si sigue activo
  estado TEXT NOT NULL CHECK (estado IN ('activo', 'baja', 'suspendido')) DEFAULT 'activo',
  tipo_contrato TEXT NOT NULL CHECK (tipo_contrato IN ('indefinido', 'temporal', 'practicas', 'voluntario')) DEFAULT 'indefinido',
  contacto_directo_menores BOOLEAN NOT NULL DEFAULT TRUE,

  -- Formación LOPIVI
  formacion_lopivi_completada BOOLEAN DEFAULT FALSE,
  fecha_formacion_lopivi DATE,
  certificado_lopivi_vigente BOOLEAN DEFAULT FALSE,
  fecha_vencimiento_certificado DATE,
  horas_formacion_completadas INTEGER DEFAULT 0,
  formacion_suplente BOOLEAN DEFAULT FALSE, -- Si es formación para delegado suplente

  -- Certificados de antecedentes penales
  certificado_antecedentes_penales BOOLEAN DEFAULT FALSE,
  fecha_emision_antecedentes DATE,
  fecha_vencimiento_antecedentes DATE,
  certificado_delitos_sexuales BOOLEAN DEFAULT FALSE,
  fecha_emision_delitos_sexuales DATE,
  fecha_vencimiento_delitos_sexuales DATE,

  -- Metadatos de auditoría
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES delegados(id),
  updated_by UUID REFERENCES delegados(id),
  legal_hash TEXT NOT NULL
);

-- Tabla de formaciones LOPIVI disponibles
CREATE TABLE IF NOT EXISTS formaciones_lopivi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  duracion_horas INTEGER NOT NULL DEFAULT 6,
  modalidad TEXT CHECK (modalidad IN ('presencial', 'online', 'mixta')) DEFAULT 'online',
  tipo TEXT CHECK (tipo IN ('inicial', 'renovacion', 'especializada', 'delegado_principal', 'delegado_suplente')) DEFAULT 'inicial',
  precio DECIMAL(10,2) DEFAULT 0.00,

  -- Contenido de la formación
  modulos JSONB, -- Array de módulos de la formación
  duracion_modulos JSONB, -- Duración de cada módulo
  materiales_adjuntos TEXT[], -- URLs de materiales

  -- Estado y disponibilidad
  activa BOOLEAN DEFAULT TRUE,
  fecha_inicio_disponible DATE,
  fecha_fin_disponible DATE,
  plazas_disponibles INTEGER DEFAULT 100,

  -- Certificación
  genera_certificado BOOLEAN DEFAULT TRUE,
  validez_meses INTEGER DEFAULT 24, -- Validez del certificado en meses

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de inscripciones y progreso de formaciones
CREATE TABLE IF NOT EXISTS personal_formaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  personal_id UUID REFERENCES personal(id) ON DELETE CASCADE,
  formacion_id UUID REFERENCES formaciones_lopivi(id) ON DELETE CASCADE,
  delegado_id UUID REFERENCES delegados(id), -- Quien inscribió

  -- Estado de la inscripción
  estado TEXT CHECK (estado IN ('pendiente', 'en_progreso', 'completada', 'abandonada', 'suspendida')) DEFAULT 'pendiente',
  fecha_inscripcion TIMESTAMPTZ DEFAULT NOW(),
  fecha_inicio TIMESTAMPTZ,
  fecha_finalizacion TIMESTAMPTZ,

  -- Progreso
  progreso_porcentaje INTEGER DEFAULT 0 CHECK (progreso_porcentaje >= 0 AND progreso_porcentaje <= 100),
  modulos_completados JSONB DEFAULT '[]', -- Array de IDs de módulos completados
  tiempo_total_estudiado INTEGER DEFAULT 0, -- En minutos

  -- Evaluación
  puntuacion_final DECIMAL(5,2),
  aprobado BOOLEAN DEFAULT FALSE,
  certificado_generado BOOLEAN DEFAULT FALSE,
  url_certificado TEXT,

  -- Recordatorios y comunicaciones
  recordatorios_enviados INTEGER DEFAULT 0,
  ultima_fecha_recordatorio TIMESTAMPTZ,
  notificaciones_activas BOOLEAN DEFAULT TRUE,

  -- Auditoría
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  legal_hash TEXT NOT NULL,

  UNIQUE(personal_id, formacion_id)
);

-- Tabla de recordatorios de formación
CREATE TABLE IF NOT EXISTS recordatorios_formacion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  personal_id UUID REFERENCES personal(id) ON DELETE CASCADE,
  delegado_id UUID REFERENCES delegados(id) ON DELETE CASCADE,

  tipo_recordatorio TEXT CHECK (tipo_recordatorio IN ('formacion_pendiente', 'vencimiento_certificado', 'renovacion_obligatoria', 'inscripcion_disponible')) NOT NULL,
  mensaje TEXT NOT NULL,
  canal TEXT CHECK (canal IN ('email', 'sms', 'sistema')) DEFAULT 'email',

  -- Estado del recordatorio
  estado TEXT CHECK (estado IN ('pendiente', 'enviado', 'entregado', 'leido', 'error')) DEFAULT 'pendiente',
  fecha_programada TIMESTAMPTZ NOT NULL,
  fecha_enviado TIMESTAMPTZ,
  fecha_leido TIMESTAMPTZ,

  -- Seguimiento
  intentos_envio INTEGER DEFAULT 0,
  ultimo_error TEXT,
  respuesta_recibida BOOLEAN DEFAULT FALSE,

  -- Metadatos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  legal_hash TEXT NOT NULL
);

-- ================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ================================

CREATE INDEX IF NOT EXISTS idx_personal_entidad ON personal(entidad_id);
CREATE INDEX IF NOT EXISTS idx_personal_estado ON personal(estado);
CREATE INDEX IF NOT EXISTS idx_personal_dni ON personal(dni);
CREATE INDEX IF NOT EXISTS idx_personal_formacion_lopivi ON personal(formacion_lopivi_completada);
CREATE INDEX IF NOT EXISTS idx_personal_certificado_vigente ON personal(certificado_lopivi_vigente);
CREATE INDEX IF NOT EXISTS idx_personal_contacto_menores ON personal(contacto_directo_menores);

CREATE INDEX IF NOT EXISTS idx_formaciones_tipo ON formaciones_lopivi(tipo);
CREATE INDEX IF NOT EXISTS idx_formaciones_activa ON formaciones_lopivi(activa);

CREATE INDEX IF NOT EXISTS idx_personal_formaciones_estado ON personal_formaciones(estado);
CREATE INDEX IF NOT EXISTS idx_personal_formaciones_personal ON personal_formaciones(personal_id);
CREATE INDEX IF NOT EXISTS idx_personal_formaciones_fecha ON personal_formaciones(fecha_inscripcion);

CREATE INDEX IF NOT EXISTS idx_recordatorios_estado ON recordatorios_formacion(estado);
CREATE INDEX IF NOT EXISTS idx_recordatorios_fecha ON recordatorios_formacion(fecha_programada);
CREATE INDEX IF NOT EXISTS idx_recordatorios_personal ON recordatorios_formacion(personal_id);

-- ================================
-- TRIGGERS
-- ================================

-- Trigger para actualizar updated_at en personal
CREATE OR REPLACE FUNCTION update_personal_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_personal_updated_at ON personal;
CREATE TRIGGER update_personal_updated_at
    BEFORE UPDATE ON personal
    FOR EACH ROW EXECUTE FUNCTION update_personal_updated_at();

-- Trigger para actualizar updated_at en personal_formaciones
DROP TRIGGER IF EXISTS update_personal_formaciones_updated_at ON personal_formaciones;
CREATE TRIGGER update_personal_formaciones_updated_at
    BEFORE UPDATE ON personal_formaciones
    FOR EACH ROW EXECUTE FUNCTION update_personal_updated_at();

-- Trigger para actualizar estado de formación LOPIVI del personal
CREATE OR REPLACE FUNCTION actualizar_estado_formacion_personal()
RETURNS TRIGGER AS $$
BEGIN
    -- Cuando una formación se completa, actualizar estado en tabla personal
    IF NEW.estado = 'completada' AND NEW.aprobado = TRUE THEN
        UPDATE personal
        SET
            formacion_lopivi_completada = TRUE,
            fecha_formacion_lopivi = NEW.fecha_finalizacion::DATE,
            certificado_lopivi_vigente = TRUE,
            fecha_vencimiento_certificado = (NEW.fecha_finalizacion + INTERVAL '24 months')::DATE
        WHERE id = NEW.personal_id;
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_actualizar_estado_formacion ON personal_formaciones;
CREATE TRIGGER trigger_actualizar_estado_formacion
    AFTER UPDATE ON personal_formaciones
    FOR EACH ROW
    WHEN (NEW.estado IS DISTINCT FROM OLD.estado)
    EXECUTE FUNCTION actualizar_estado_formacion_personal();

-- ================================
-- FUNCIONES AUXILIARES
-- ================================

-- Función para calcular porcentaje de personal formado por entidad
CREATE OR REPLACE FUNCTION calcular_porcentaje_formacion(entidad_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_personal INTEGER;
    personal_formado INTEGER;
    porcentaje INTEGER;
BEGIN
    -- Contar total de personal activo que tiene contacto con menores
    SELECT COUNT(*) INTO total_personal
    FROM personal
    WHERE entidad_id = entidad_uuid
    AND estado = 'activo'
    AND contacto_directo_menores = TRUE;

    -- Contar personal formado
    SELECT COUNT(*) INTO personal_formado
    FROM personal
    WHERE entidad_id = entidad_uuid
    AND estado = 'activo'
    AND contacto_directo_menores = TRUE
    AND formacion_lopivi_completada = TRUE
    AND certificado_lopivi_vigente = TRUE;

    -- Calcular porcentaje
    IF total_personal > 0 THEN
        porcentaje := ROUND((personal_formado::DECIMAL / total_personal::DECIMAL) * 100);
    ELSE
        porcentaje := 0;
    END IF;

    RETURN porcentaje;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener personal pendiente de formación
CREATE OR REPLACE FUNCTION obtener_personal_pendiente_formacion(entidad_uuid UUID)
RETURNS TABLE (
    id UUID,
    nombre_completo TEXT,
    cargo TEXT,
    email TEXT,
    dias_sin_formacion INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        CONCAT(p.nombre, ' ', p.apellidos) as nombre_completo,
        p.cargo,
        p.email,
        EXTRACT(DAY FROM (NOW() - p.fecha_inicio))::INTEGER as dias_sin_formacion
    FROM personal p
    WHERE p.entidad_id = entidad_uuid
    AND p.estado = 'activo'
    AND p.contacto_directo_menores = TRUE
    AND (p.formacion_lopivi_completada = FALSE OR p.certificado_lopivi_vigente = FALSE)
    ORDER BY p.fecha_inicio ASC;
END;
$$ LANGUAGE plpgsql;

-- ================================
-- DATOS DE EJEMPLO
-- ================================

-- Insertar formaciones LOPIVI disponibles
INSERT INTO formaciones_lopivi (titulo, descripcion, duracion_horas, modalidad, tipo, precio, modulos, genera_certificado, validez_meses) VALUES
(
    'Formación LOPIVI Básica - Personal de Contacto',
    'Formación obligatoria para personal que tiene contacto directo con menores según la LOPIVI',
    6,
    'online',
    'inicial',
    29.99,
    '[
        {"id": 1, "titulo": "Introducción a la LOPIVI", "duracion": 90},
        {"id": 2, "titulo": "Detección de Situaciones de Riesgo", "duracion": 120},
        {"id": 3, "titulo": "Protocolos de Actuación", "duracion": 90},
        {"id": 4, "titulo": "Canal de Comunicación y Denuncia", "duracion": 60},
        {"id": 5, "titulo": "Evaluación Final", "duracion": 30}
    ]'::jsonb,
    TRUE,
    24
),
(
    'Formación LOPIVI - Delegado Principal',
    'Formación especializada para Delegados de Protección principales',
    8,
    'online',
    'delegado_principal',
    49.99,
    '[
        {"id": 1, "titulo": "Responsabilidades del Delegado Principal", "duracion": 120},
        {"id": 2, "titulo": "Gestión de Casos y Protocolos", "duracion": 120},
        {"id": 3, "titulo": "Coordinación con Autoridades", "duracion": 90},
        {"id": 4, "titulo": "Documentación y Registros", "duracion": 90},
        {"id": 5, "titulo": "Formación del Personal", "duracion": 60},
        {"id": 6, "titulo": "Evaluación Final", "duracion": 30}
    ]'::jsonb,
    TRUE,
    12
),
(
    'Renovación LOPIVI - Personal',
    'Curso de renovación para personal con certificado próximo a vencer',
    4,
    'online',
    'renovacion',
    19.99,
    '[
        {"id": 1, "titulo": "Actualizaciones Normativas", "duracion": 90},
        {"id": 2, "titulo": "Casos Prácticos Actualizados", "duracion": 90},
        {"id": 3, "titulo": "Nuevos Protocolos", "duracion": 60},
        {"id": 4, "titulo": "Evaluación de Renovación", "duracion": 30}
    ]'::jsonb,
    TRUE,
    24
)
ON CONFLICT DO NOTHING;

-- Función para insertar personal de ejemplo
CREATE OR REPLACE FUNCTION insertar_personal_ejemplo()
RETURNS void AS $$
DECLARE
    entidad_ejemplo_id UUID;
    delegado_ejemplo_id UUID;
    formacion_basica_id UUID;
BEGIN
    -- Buscar IDs de ejemplo
    SELECT id INTO entidad_ejemplo_id FROM entidades WHERE cif = 'B12345678' LIMIT 1;
    SELECT id INTO delegado_ejemplo_id FROM delegados WHERE email LIKE '%demo%' OR email LIKE '%ejemplo%' LIMIT 1;
    SELECT id INTO formacion_basica_id FROM formaciones_lopivi WHERE tipo = 'inicial' LIMIT 1;

    -- Si no existen, salir
    IF entidad_ejemplo_id IS NULL OR delegado_ejemplo_id IS NULL THEN
        RETURN;
    END IF;

    -- Insertar personal de ejemplo
    INSERT INTO personal (
        entidad_id, nombre, apellidos, dni, email, telefono, cargo,
        contacto_directo_menores, formacion_lopivi_completada,
        fecha_formacion_lopivi, certificado_lopivi_vigente,
        fecha_vencimiento_certificado, created_by, legal_hash
    ) VALUES
    (
        entidad_ejemplo_id, 'María', 'García López', '12345678A',
        'maria.garcia@ejemplo.com', '666111222', 'Educadora',
        TRUE, TRUE, '2024-01-15', TRUE, '2026-01-15',
        delegado_ejemplo_id, 'hash_maria_001'
    ),
    (
        entidad_ejemplo_id, 'Carlos', 'López Martín', '87654321B',
        'carlos.lopez@ejemplo.com', '666333444', 'Monitor',
        TRUE, TRUE, '2024-01-10', TRUE, '2026-01-10',
        delegado_ejemplo_id, 'hash_carlos_002'
    ),
    (
        entidad_ejemplo_id, 'Ana', 'Martínez Ruiz', '11223344C',
        'ana.martinez@ejemplo.com', '666555666', 'Coordinadora',
        TRUE, FALSE, NULL, FALSE, NULL,
        delegado_ejemplo_id, 'hash_ana_003'
    ),
    (
        entidad_ejemplo_id, 'Jorge', 'Ruiz Sánchez', '44332211D',
        'jorge.ruiz@ejemplo.com', '666777888', 'Auxiliar',
        TRUE, FALSE, NULL, FALSE, NULL,
        delegado_ejemplo_id, 'hash_jorge_004'
    ),
    (
        entidad_ejemplo_id, 'Laura', 'Sánchez Díaz', '55667788E',
        'laura.sanchez@ejemplo.com', '666999000', 'Psicóloga',
        TRUE, TRUE, '2024-01-05', TRUE, '2026-01-05',
        delegado_ejemplo_id, 'hash_laura_005'
    ),
    (
        entidad_ejemplo_id, 'Pedro', 'González Vila', '99887766F',
        'pedro.gonzalez@ejemplo.com', '666111000', 'Personal de Limpieza',
        FALSE, FALSE, NULL, FALSE, NULL,
        delegado_ejemplo_id, 'hash_pedro_006'
    )
    ON CONFLICT (dni) DO NOTHING;

    -- Insertar algunas inscripciones de formación
    IF formacion_basica_id IS NOT NULL THEN
        INSERT INTO personal_formaciones (
            personal_id, formacion_id, delegado_id, estado,
            fecha_inscripcion, fecha_finalizacion, progreso_porcentaje,
            aprobado, certificado_generado, legal_hash
        )
        SELECT
            p.id, formacion_basica_id, delegado_ejemplo_id, 'completada',
            '2024-01-01'::timestamptz, '2024-01-15'::timestamptz, 100,
            TRUE, TRUE, 'hash_formacion_' || p.id
        FROM personal p
        WHERE p.entidad_id = entidad_ejemplo_id
        AND p.formacion_lopivi_completada = TRUE
        ON CONFLICT (personal_id, formacion_id) DO NOTHING;
    END IF;

END;
$$ language 'plpgsql';

-- ================================
-- POLÍTICAS DE SEGURIDAD
-- ================================

-- Deshabilitar RLS para auditoría automática
ALTER TABLE personal DISABLE ROW LEVEL SECURITY;
ALTER TABLE formaciones_lopivi DISABLE ROW LEVEL SECURITY;
ALTER TABLE personal_formaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE recordatorios_formacion DISABLE ROW LEVEL SECURITY;

-- ================================
-- COMENTARIOS
-- ================================

COMMENT ON TABLE personal IS 'Personal de las entidades que trabajan con menores';
COMMENT ON TABLE formaciones_lopivi IS 'Catálogo de formaciones LOPIVI disponibles';
COMMENT ON TABLE personal_formaciones IS 'Inscripciones y progreso de formaciones del personal';
COMMENT ON TABLE recordatorios_formacion IS 'Sistema de recordatorios automáticos para formaciones';

-- ================================
-- SCRIPT COMPLETADO
-- ================================
