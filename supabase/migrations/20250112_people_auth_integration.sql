-- ============================================================
-- MIGRATION: Integración Supabase Auth con tablas entities/people
-- Fecha: 2025-01-12
-- Unifica el sistema para usar entities y people con Auth
-- ============================================================

-- 1. Actualizar tabla entities con campos de autenticación
-- ============================================================
ALTER TABLE entities
ADD COLUMN IF NOT EXISTS cif TEXT,
ADD COLUMN IF NOT EXISTS direccion TEXT,
ADD COLUMN IF NOT EXISTS ciudad TEXT,
ADD COLUMN IF NOT EXISTS codigo_postal TEXT,
ADD COLUMN IF NOT EXISTS provincia TEXT,
ADD COLUMN IF NOT EXISTS telefono TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS numero_menores INTEGER,
ADD COLUMN IF NOT EXISTS tipo_entidad TEXT,
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'Plan Básico',
ADD COLUMN IF NOT EXISTS precio_mensual DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS plan_estado TEXT DEFAULT 'pendiente' CHECK (plan_estado IN ('activo', 'pendiente', 'suspendido', 'cancelado')),
ADD COLUMN IF NOT EXISTS pago_confirmado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS dashboard_email TEXT,
ADD COLUMN IF NOT EXISTS dashboard_password TEXT,
ADD COLUMN IF NOT EXISTS legal_hash TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Crear índices para entities
CREATE INDEX IF NOT EXISTS idx_entities_plan_estado ON entities(plan_estado);
CREATE INDEX IF NOT EXISTS idx_entities_email ON entities(email);
CREATE INDEX IF NOT EXISTS idx_entities_cif ON entities(cif);

COMMENT ON COLUMN entities.plan_estado IS 'Estado del plan: activo, pendiente, suspendido, cancelado';
COMMENT ON COLUMN entities.pago_confirmado IS 'Si el pago inicial ha sido confirmado';
COMMENT ON COLUMN entities.legal_hash IS 'Hash único legal para trazabilidad';

-- 2. Actualizar tabla people para soporte de Auth
-- ============================================================
ALTER TABLE people
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS apellidos TEXT,
ADD COLUMN IF NOT EXISTS dni TEXT,
ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE,
ADD COLUMN IF NOT EXISTS cargo TEXT,
ADD COLUMN IF NOT EXISTS experiencia TEXT,
ADD COLUMN IF NOT EXISTS disponibilidad TEXT,
ADD COLUMN IF NOT EXISTS formacion_completada BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS certificado_penales BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'pendiente_formacion')),
ADD COLUMN IF NOT EXISTS tipo TEXT CHECK (tipo IN ('principal', 'suplente', 'personal')),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Crear índices para people
CREATE INDEX IF NOT EXISTS idx_people_user_id ON people(user_id);
CREATE INDEX IF NOT EXISTS idx_people_entity_id ON people(entity_id);
CREATE INDEX IF NOT EXISTS idx_people_rol ON people(rol);
CREATE INDEX IF NOT EXISTS idx_people_email ON people(email);

COMMENT ON COLUMN people.user_id IS 'ID del usuario en Supabase Auth (solo para delegados con acceso al sistema)';
COMMENT ON COLUMN people.rol IS 'Rol: delegado_principal, delegado_suplente, monitor, educador, etc.';
COMMENT ON COLUMN people.es_contacto IS 'Si la persona tiene contacto habitual con menores';
COMMENT ON COLUMN people.formacion_completada IS 'Si completó la formación LOPIVI obligatoria';
COMMENT ON COLUMN people.tipo IS 'Tipo de persona: principal (delegado principal), suplente (delegado suplente), personal';

-- 3. Habilitar Row Level Security (RLS)
-- ============================================================
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Políticas para entities
DROP POLICY IF EXISTS "Users can view their own entity" ON entities;
CREATE POLICY "Users can view their own entity"
ON entities
FOR SELECT
USING (
    id IN (
        SELECT entity_id
        FROM people
        WHERE user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can update their own entity" ON entities;
CREATE POLICY "Users can update their own entity"
ON entities
FOR UPDATE
USING (
    id IN (
        SELECT entity_id
        FROM people
        WHERE user_id = auth.uid()
        AND rol IN ('delegado_principal', 'delegado_suplente')
    )
);

-- Políticas para people
DROP POLICY IF EXISTS "Users can view themselves" ON people;
CREATE POLICY "Users can view themselves"
ON people
FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view people in their entity" ON people;
CREATE POLICY "Users can view people in their entity"
ON people
FOR SELECT
USING (
    entity_id IN (
        SELECT entity_id
        FROM people
        WHERE user_id = auth.uid()
        AND rol IN ('delegado_principal', 'delegado_suplente')
    )
);

DROP POLICY IF EXISTS "Users can update themselves" ON people;
CREATE POLICY "Users can update themselves"
ON people
FOR UPDATE
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Delegates can update people in their entity" ON people;
CREATE POLICY "Delegates can update people in their entity"
ON people
FOR UPDATE
USING (
    entity_id IN (
        SELECT entity_id
        FROM people
        WHERE user_id = auth.uid()
        AND rol IN ('delegado_principal', 'delegado_suplente')
    )
);

-- 4. Vista completa de delegados
-- ============================================================
CREATE OR REPLACE VIEW delegados_view AS
SELECT
    p.id,
    p.user_id,
    p.entity_id,
    p.nombre,
    p.apellidos,
    p.dni,
    p.email,
    p.telefono,
    p.rol,
    p.tipo,
    p.formacion_completada,
    p.certificado_penales,
    p.estado,
    p.es_contacto,
    e.nombre AS entidad_nombre,
    e.tipo_entidad,
    e.sector,
    e.plan,
    e.plan_estado,
    e.pago_confirmado,
    e.fecha_contratacion
FROM people p
LEFT JOIN entities e ON p.entity_id = e.id
WHERE p.rol IN ('delegado_principal', 'delegado_suplente');

COMMENT ON VIEW delegados_view IS 'Vista de todos los delegados con datos de su entidad';

-- 5. Función para sincronizar user_metadata con people
-- ============================================================
CREATE OR REPLACE FUNCTION sync_user_metadata_to_people()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE people
    SET
        nombre = COALESCE(NEW.raw_user_meta_data->>'nombre', nombre),
        rol = COALESCE(NEW.raw_user_meta_data->>'rol', rol)
    WHERE user_id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para sincronización automática
DROP TRIGGER IF EXISTS on_auth_user_updated_people ON auth.users;
CREATE TRIGGER on_auth_user_updated_people
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_metadata_to_people();

-- 6. Función para verificar acceso de delegado (actualizada para people)
-- ============================================================
CREATE OR REPLACE FUNCTION verificar_acceso_delegado(p_user_id UUID)
RETURNS TABLE (
    autorizado BOOLEAN,
    razon TEXT,
    person_id UUID,
    entity_id UUID,
    rol TEXT,
    tipo TEXT,
    formacion_ok BOOLEAN,
    plan_ok BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        CASE
            WHEN p.id IS NULL THEN false
            WHEN p.estado NOT IN ('activo', 'pendiente_formacion') THEN false
            WHEN e.plan_estado != 'activo' THEN false
            WHEN e.pago_confirmado = false THEN false
            WHEN p.rol = 'delegado_principal' AND p.formacion_completada = false THEN false
            ELSE true
        END AS autorizado,
        CASE
            WHEN p.id IS NULL THEN 'no_profile'
            WHEN p.estado NOT IN ('activo', 'pendiente_formacion') THEN 'person_inactive'
            WHEN e.plan_estado != 'activo' THEN 'plan_not_active'
            WHEN e.pago_confirmado = false THEN 'payment_pending'
            WHEN p.rol = 'delegado_principal' AND p.formacion_completada = false THEN 'training_pending'
            ELSE 'ok'
        END AS razon,
        p.id AS person_id,
        p.entity_id,
        p.rol,
        p.tipo,
        p.formacion_completada AS formacion_ok,
        (e.plan_estado = 'activo' AND e.pago_confirmado = true) AS plan_ok
    FROM people p
    LEFT JOIN entities e ON p.entity_id = e.id
    WHERE p.user_id = p_user_id
    AND p.rol IN ('delegado_principal', 'delegado_suplente');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Tabla de contratantes (opcional, si se necesita separar)
-- ============================================================
CREATE TABLE IF NOT EXISTS contratantes (
    id BIGSERIAL PRIMARY KEY,
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    apellidos TEXT,
    dni TEXT,
    cargo TEXT,
    telefono TEXT,
    email TEXT,
    es_delegado BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contratantes_entity ON contratantes(entity_id);
CREATE INDEX IF NOT EXISTS idx_contratantes_email ON contratantes(email);

-- ============================================================
-- FIN DE LA MIGRACIÓN
-- ============================================================

-- Verificar estado
DO $$
DECLARE
    v_entities_count INTEGER;
    v_people_count INTEGER;
    v_people_with_auth INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_entities_count FROM entities;
    SELECT COUNT(*) INTO v_people_count FROM people;
    SELECT COUNT(*) INTO v_people_with_auth FROM people WHERE user_id IS NOT NULL;

    RAISE NOTICE '✅ Migración people/entities Auth completada';
    RAISE NOTICE '📊 Total entities: %', v_entities_count;
    RAISE NOTICE '👥 Total people: %', v_people_count;
    RAISE NOTICE '🔐 People con Auth: %', v_people_with_auth;
END $$;
