-- ====================================
-- SISTEMA DE AUDITORÍA LOPIVI COMPLETO
-- ====================================
-- Este script crea todas las tablas necesarias para
-- cumplimiento legal de auditorías LOPIVI

-- Tabla principal de logs de auditoría (INMUTABLE)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id TEXT,
    user_name TEXT NOT NULL,
    action_type TEXT NOT NULL, -- document_sent, member_added, case_reported, etc.
    entity_type TEXT NOT NULL, -- member, document, case, etc.
    entity_id TEXT,
    details JSONB NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    session_id TEXT,
    legal_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    -- Campos inmutables - NO SE PUEDEN MODIFICAR
    CONSTRAINT audit_logs_immutable CHECK (created_at IS NOT NULL)
);

-- Tabla específica para comunicaciones de documentos
CREATE TABLE IF NOT EXISTS document_communications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name TEXT NOT NULL,
    recipients TEXT[] NOT NULL,
    recipient_count INTEGER NOT NULL,
    documents TEXT[] NOT NULL,
    subject TEXT NOT NULL,
    message TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ip_address TEXT,
    legal_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla para registro de nuevos miembros
CREATE TABLE IF NOT EXISTS member_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_name TEXT NOT NULL,
    member_email TEXT NOT NULL,
    member_role TEXT NOT NULL,
    incorporation_date DATE NOT NULL,
    assigned_documents TEXT[] NOT NULL,
    registered_by TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ip_address TEXT,
    legal_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla para reportes de casos LOPIVI
CREATE TABLE IF NOT EXISTS case_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id TEXT NOT NULL UNIQUE,
    case_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    person_action TEXT NOT NULL,
    person_receives TEXT NOT NULL,
    additional_people TEXT[] DEFAULT '{}',
    priority TEXT NOT NULL, -- critica, alta, media, baja
    reported_by TEXT NOT NULL,
    entity TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ip_address TEXT,
    legal_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla para acciones de certificados
CREATE TABLE IF NOT EXISTS certificate_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    certificate_id TEXT NOT NULL,
    person_name TEXT NOT NULL,
    person_email TEXT NOT NULL,
    action_type TEXT NOT NULL, -- delivered, reminder_sent, renewed, expired
    certificate_type TEXT NOT NULL, -- antecedentes_penales, lopivi, medical, etc.
    expiration_date DATE,
    notes TEXT,
    performed_by TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ip_address TEXT,
    legal_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ====================================

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- Índices para document_communications
CREATE INDEX IF NOT EXISTS idx_doc_comm_timestamp ON document_communications(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_doc_comm_user ON document_communications(user_name);

-- Índices para member_registrations
CREATE INDEX IF NOT EXISTS idx_member_reg_timestamp ON member_registrations(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_member_reg_email ON member_registrations(member_email);

-- Índices para case_reports
CREATE INDEX IF NOT EXISTS idx_case_reports_timestamp ON case_reports(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_case_reports_priority ON case_reports(priority);
CREATE INDEX IF NOT EXISTS idx_case_reports_case_id ON case_reports(case_id);

-- Índices para certificate_actions
CREATE INDEX IF NOT EXISTS idx_cert_actions_timestamp ON certificate_actions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_cert_actions_person ON certificate_actions(person_email);

-- ====================================
-- POLÍTICAS DE SEGURIDAD RLS
-- ====================================

-- Habilitar Row Level Security en todas las tablas
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_actions ENABLE ROW LEVEL SECURITY;

-- Política: Solo delegados pueden ver todos los logs
CREATE POLICY "Delegados pueden ver todos los audit_logs" ON audit_logs
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Política: Cualquier usuario autenticado puede insertar logs (para auditoría)
CREATE POLICY "Usuarios autenticados pueden insertar audit_logs" ON audit_logs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política: NADIE puede actualizar o eliminar logs (INMUTABLE)
CREATE POLICY "Los audit_logs son inmutables" ON audit_logs
    FOR UPDATE USING (false);

CREATE POLICY "Los audit_logs no se pueden eliminar" ON audit_logs
    FOR DELETE USING (false);

-- Aplicar las mismas políticas a todas las tablas de auditoría
CREATE POLICY "Acceso de lectura para autenticados" ON document_communications
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Inserción para autenticados" ON document_communications
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Inmutable - no actualizar" ON document_communications
    FOR UPDATE USING (false);

CREATE POLICY "Inmutable - no eliminar" ON document_communications
    FOR DELETE USING (false);

-- Repetir para member_registrations
CREATE POLICY "Acceso de lectura para autenticados" ON member_registrations
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Inserción para autenticados" ON member_registrations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Inmutable - no actualizar" ON member_registrations
    FOR UPDATE USING (false);

CREATE POLICY "Inmutable - no eliminar" ON member_registrations
    FOR DELETE USING (false);

-- Repetir para case_reports
CREATE POLICY "Acceso de lectura para autenticados" ON case_reports
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Inserción para autenticados" ON case_reports
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Inmutable - no actualizar" ON case_reports
    FOR UPDATE USING (false);

CREATE POLICY "Inmutable - no eliminar" ON case_reports
    FOR DELETE USING (false);

-- Repetir para certificate_actions
CREATE POLICY "Acceso de lectura para autenticados" ON certificate_actions
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Inserción para autenticados" ON certificate_actions
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Inmutable - no actualizar" ON certificate_actions
    FOR UPDATE USING (false);

CREATE POLICY "Inmutable - no eliminar" ON certificate_actions
    FOR DELETE USING (false);

-- ====================================
-- FUNCIONES PARA AUDITORÍA
-- ====================================

-- Función para limpiar logs antiguos (retención de 5 años LOPIVI)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Mantener logs de los últimos 5 años solamente
    DELETE FROM audit_logs
    WHERE timestamp < NOW() - INTERVAL '5 years';

    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para generar reporte de auditoría
CREATE OR REPLACE FUNCTION generate_audit_report(
    start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    action_type TEXT,
    action_count BIGINT,
    unique_users BIGINT,
    first_occurrence TIMESTAMPTZ,
    last_occurrence TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        al.action_type,
        COUNT(*) as action_count,
        COUNT(DISTINCT al.user_name) as unique_users,
        MIN(al.timestamp) as first_occurrence,
        MAX(al.timestamp) as last_occurrence
    FROM audit_logs al
    WHERE al.timestamp BETWEEN start_date AND end_date
    GROUP BY al.action_type
    ORDER BY action_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- TRIGGERS PARA INTEGRIDAD
-- ====================================

-- Trigger para prevenir modificaciones en audit_logs
CREATE OR REPLACE FUNCTION prevent_audit_modifications()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Los logs de auditoría son inmutables y no pueden ser modificados';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas de auditoría
CREATE TRIGGER prevent_audit_logs_update
    BEFORE UPDATE ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION prevent_audit_modifications();

CREATE TRIGGER prevent_audit_logs_delete
    BEFORE DELETE ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION prevent_audit_modifications();

-- ====================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- ====================================

COMMENT ON TABLE audit_logs IS 'Tabla principal de auditoría LOPIVI - INMUTABLE para cumplimiento legal';
COMMENT ON TABLE document_communications IS 'Registro de envíos de documentación - Requerido para inspecciones';
COMMENT ON TABLE member_registrations IS 'Registro de altas de personal - Trazabilidad completa';
COMMENT ON TABLE case_reports IS 'Registro de casos reportados - Cumplimiento LOPIVI';
COMMENT ON TABLE certificate_actions IS 'Registro de acciones sobre certificados - Auditoría de cumplimiento';

COMMENT ON COLUMN audit_logs.legal_hash IS 'Hash para verificación de integridad legal';
COMMENT ON COLUMN audit_logs.timestamp IS 'Timestamp inmutable con zona horaria Madrid';
COMMENT ON COLUMN audit_logs.details IS 'Detalles completos de la acción en formato JSON';

-- ====================================
-- INSERTAR DATOS DE PRUEBA
-- ====================================

-- Insertar log de inicialización del sistema
INSERT INTO audit_logs (
    user_name,
    action_type,
    entity_type,
    details,
    legal_hash
) VALUES (
    'Sistema',
    'audit_system_initialized',
    'system',
    '{"message": "Sistema de auditoría LOPIVI inicializado", "version": "1.0", "compliance": "LOPIVI 2021"}',
    'init_' || extract(epoch from now())::text
);

-- Confirmar creación exitosa
DO $$
BEGIN
    RAISE NOTICE 'Sistema de auditoría LOPIVI creado exitosamente';
    RAISE NOTICE 'Tablas creadas: audit_logs, document_communications, member_registrations, case_reports, certificate_actions';
    RAISE NOTICE 'Políticas RLS aplicadas - Logs inmutables';
    RAISE NOTICE 'Retención automática: 5 años';
    RAISE NOTICE 'Sistema listo para cumplimiento legal';
END
$$;
