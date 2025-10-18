-- ============================================================
-- MIGRATION: Integración Supabase Auth con sistema existente
-- Fecha: 2025-01-12
-- ============================================================

-- 1. Agregar campos de autenticación a tabla entidades
-- ============================================================
ALTER TABLE entidades
ADD COLUMN IF NOT EXISTS plan_estado TEXT DEFAULT 'pendiente' CHECK (plan_estado IN ('activo', 'pendiente', 'suspendido', 'cancelado')),
ADD COLUMN IF NOT EXISTS pago_confirmado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fecha_contratacion TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS sector TEXT; -- Alias para tipo_entidad

-- Actualizar entidades existentes
UPDATE entidades
SET plan_estado = 'activo',
    pago_confirmado = true,
    sector = tipo_entidad
WHERE plan_estado IS NULL;

COMMENT ON COLUMN entidades.plan_estado IS 'Estado del plan: activo, pendiente, suspendido, cancelado';
COMMENT ON COLUMN entidades.pago_confirmado IS 'Si el pago inicial ha sido confirmado';
COMMENT ON COLUMN entidades.fecha_contratacion IS 'Fecha de contratación del servicio';

-- 2. Agregar campos de Supabase Auth a tabla delegados
-- ============================================================
ALTER TABLE delegados
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS formacion_completada BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS rol TEXT;

-- Crear índice para búsquedas por user_id
CREATE INDEX IF NOT EXISTS idx_delegados_user_id ON delegados(user_id);

-- Actualizar campo rol basado en tipo existente
UPDATE delegados
SET rol = CASE
    WHEN tipo = 'principal' THEN 'delegado_principal'
    WHEN tipo = 'suplente' THEN 'delegado_suplente'
    ELSE 'delegado_principal'
END
WHERE rol IS NULL;

COMMENT ON COLUMN delegados.user_id IS 'ID del usuario en Supabase Auth';
COMMENT ON COLUMN delegados.formacion_completada IS 'Si el delegado completó la formación obligatoria';
COMMENT ON COLUMN delegados.rol IS 'Rol del delegado: delegado_principal, delegado_suplente';

-- 3. Eliminar campo password de delegados (inseguro)
-- ============================================================
-- ADVERTENCIA: Solo descomentar cuando todos los delegados estén migrados a Auth
-- ALTER TABLE delegados DROP COLUMN IF EXISTS password;

-- 4. Crear vista para acceso simplificado
-- ============================================================
CREATE OR REPLACE VIEW delegados_completo AS
SELECT
    d.id,
    d.user_id,
    d.entidad_id,
    d.tipo,
    d.rol,
    d.nombre,
    d.apellidos,
    d.dni,
    d.telefono,
    d.email,
    d.formacion_completada,
    d.certificado_penales,
    d.estado,
    e.nombre AS entidad_nombre,
    e.tipo_entidad AS entidad_tipo,
    e.plan,
    e.plan_estado,
    e.pago_confirmado,
    e.fecha_contratacion
FROM delegados d
LEFT JOIN entidades e ON d.entidad_id = e.id;

COMMENT ON VIEW delegados_completo IS 'Vista completa de delegados con datos de entidad';

-- 5. Políticas RLS (Row Level Security) - IMPORTANTE
-- ============================================================

-- Habilitar RLS en tablas críticas
ALTER TABLE delegados ENABLE ROW LEVEL SECURITY;
ALTER TABLE entidades ENABLE ROW LEVEL SECURITY;

-- Política: Los delegados solo pueden ver sus propios datos
CREATE POLICY "Delegados ven solo sus datos"
ON delegados
FOR SELECT
USING (auth.uid() = user_id);

-- Política: Los delegados pueden actualizar sus propios datos
CREATE POLICY "Delegados actualizan sus datos"
ON delegados
FOR UPDATE
USING (auth.uid() = user_id);

-- Política: Los delegados ven solo su entidad
CREATE POLICY "Delegados ven su entidad"
ON entidades
FOR SELECT
USING (
    id IN (
        SELECT entidad_id
        FROM delegados
        WHERE user_id = auth.uid()
    )
);

-- 6. Función para sincronizar user_metadata con tabla delegados
-- ============================================================
CREATE OR REPLACE FUNCTION sync_user_metadata_to_delegado()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar delegado cuando cambia user_metadata
    UPDATE delegados
    SET
        nombre = COALESCE(NEW.raw_user_meta_data->>'nombre', nombre),
        rol = COALESCE(NEW.raw_user_meta_data->>'rol', rol)
    WHERE user_id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para sincronización automática
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_metadata_to_delegado();

-- 7. Función helper para verificar acceso de delegado
-- ============================================================
CREATE OR REPLACE FUNCTION verificar_acceso_delegado(p_user_id UUID)
RETURNS TABLE (
    autorizado BOOLEAN,
    razon TEXT,
    delegado_id BIGINT,
    entidad_id BIGINT,
    tipo_delegado TEXT,
    formacion_ok BOOLEAN,
    plan_ok BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        CASE
            WHEN d.id IS NULL THEN false
            WHEN d.estado != 'activo' AND d.estado != 'pendiente_formacion' THEN false
            WHEN e.plan_estado != 'activo' THEN false
            WHEN e.pago_confirmado = false THEN false
            WHEN d.tipo = 'principal' AND d.formacion_completada = false THEN false
            ELSE true
        END AS autorizado,
        CASE
            WHEN d.id IS NULL THEN 'no_profile'
            WHEN d.estado NOT IN ('activo', 'pendiente_formacion') THEN 'delegado_inactivo'
            WHEN e.plan_estado != 'activo' THEN 'plan_no_activo'
            WHEN e.pago_confirmado = false THEN 'pago_pendiente'
            WHEN d.tipo = 'principal' AND d.formacion_completada = false THEN 'formacion_pendiente'
            ELSE 'ok'
        END AS razon,
        d.id AS delegado_id,
        d.entidad_id,
        d.tipo AS tipo_delegado,
        d.formacion_completada AS formacion_ok,
        (e.plan_estado = 'activo' AND e.pago_confirmado = true) AS plan_ok
    FROM delegados d
    LEFT JOIN entidades e ON d.entidad_id = e.id
    WHERE d.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FIN DE LA MIGRACIÓN
-- ============================================================

-- Verificar estado
DO $$
BEGIN
    RAISE NOTICE '✅ Migración de autenticación completada';
    RAISE NOTICE '📊 Total entidades: %', (SELECT COUNT(*) FROM entidades);
    RAISE NOTICE '👥 Total delegados: %', (SELECT COUNT(*) FROM delegados);
    RAISE NOTICE '🔐 Delegados con Auth: %', (SELECT COUNT(*) FROM delegados WHERE user_id IS NOT NULL);
END $$;
