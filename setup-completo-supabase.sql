-- CUSTODIA360 - SCRIPT COMPLETO DE CONFIGURACIÓN SUPABASE
-- Ejecutar en Supabase SQL Editor para configurar todo el sistema

-- ================================
-- 1. TABLAS PRINCIPALES DEL SISTEMA
-- ================================

-- Entidades (empresas que contratan)
CREATE TABLE IF NOT EXISTS entidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  cif TEXT UNIQUE NOT NULL,
  direccion TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  codigo_postal TEXT NOT NULL,
  provincia TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  numero_menores TEXT NOT NULL,
  tipo_entidad TEXT NOT NULL,
  plan TEXT NOT NULL,
  precio_mensual DECIMAL(10,2) NOT NULL,
  dashboard_email TEXT UNIQUE NOT NULL,
  dashboard_password TEXT NOT NULL,
  fecha_alta DATE DEFAULT CURRENT_DATE,
  estado TEXT DEFAULT 'activa' CHECK (estado IN ('activa', 'suspendida', 'cancelada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contratantes (personas que realizan la contratación)
CREATE TABLE IF NOT EXISTS contratantes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  dni TEXT NOT NULL,
  cargo TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  es_delegado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delegados (principal y suplentes)
CREATE TABLE IF NOT EXISTS delegados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('principal', 'suplente')),
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  dni TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  experiencia TEXT,
  disponibilidad TEXT NOT NULL,
  certificado_penales BOOLEAN DEFAULT FALSE,
  fecha_vencimiento_cert DATE,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contactos (formulario de contacto)
CREATE TABLE IF NOT EXISTS contactos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  empresa TEXT,
  mensaje TEXT NOT NULL,
  estado TEXT DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'convertido', 'descartado')),
  respondido BOOLEAN DEFAULT FALSE,
  notas_internas TEXT,
  fecha_respuesta TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- 2. TABLAS DE AUDITORÍA LOPIVI
-- ================================

-- Logs de auditoría principal (obligatorio LOPIVI)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  legal_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comunicación de documentos (auditoría LOPIVI)
CREATE TABLE IF NOT EXISTS document_communications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  document_names TEXT[] NOT NULL,
  recipients TEXT[] NOT NULL,
  message TEXT,
  method TEXT CHECK (method IN ('email', 'link', 'download')),
  timestamp TIMESTAMPTZ NOT NULL,
  legal_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reportes de casos (auditoría LOPIVI)
CREATE TABLE IF NOT EXISTS case_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  case_type TEXT NOT NULL,
  case_title TEXT NOT NULL,
  persons_involved JSONB NOT NULL,
  priority TEXT CHECK (priority IN ('baja', 'media', 'alta', 'critica')),
  description TEXT NOT NULL,
  immediate_actions TEXT NOT NULL,
  status TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  legal_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registro de miembros (auditoría LOPIVI)
CREATE TABLE IF NOT EXISTS member_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  member_name TEXT NOT NULL,
  member_email TEXT NOT NULL,
  member_role TEXT NOT NULL,
  incorporation_date TEXT NOT NULL,
  documentation_sent TEXT[] NOT NULL,
  status TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  legal_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Acciones de usuario (auditoría LOPIVI)
CREATE TABLE IF NOT EXISTS user_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  result TEXT NOT NULL,
  metadata JSONB NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  legal_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- 3. CONFIGURACIÓN DE SEGURIDAD
-- ================================

-- DESACTIVAR RLS para tablas de auditoría (necesario para logging automático)
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE document_communications DISABLE ROW LEVEL SECURITY;
ALTER TABLE case_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE member_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE contactos DISABLE ROW LEVEL SECURITY;

-- Mantener RLS activado para tablas principales
ALTER TABLE entidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE delegados ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratantes ENABLE ROW LEVEL SECURITY;

-- ================================
-- 4. ÍNDICES PARA OPTIMIZACIÓN
-- ================================

-- Índices principales
CREATE INDEX IF NOT EXISTS idx_entidades_estado ON entidades(estado);
CREATE INDEX IF NOT EXISTS idx_entidades_plan ON entidades(plan);
CREATE INDEX IF NOT EXISTS idx_delegados_entidad ON delegados(entidad_id);
CREATE INDEX IF NOT EXISTS idx_delegados_email ON delegados(email);
CREATE INDEX IF NOT EXISTS idx_contactos_estado ON contactos(estado);
CREATE INDEX IF NOT EXISTS idx_contactos_fecha ON contactos(created_at);

-- Índices para auditoría
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);

-- ================================
-- 5. DATOS DE EJEMPLO
-- ================================

-- Insertar entidades de ejemplo
INSERT INTO entidades (nombre, cif, direccion, ciudad, codigo_postal, provincia, telefono, email, numero_menores, tipo_entidad, plan, precio_mensual, dashboard_email, dashboard_password)
VALUES
('Club Deportivo Barcelona', 'B12345678', 'Calle Deporte 123', 'Barcelona', '08001', 'Barcelona', '93 123 45 67', 'info@clubbcn.com', '201-500', 'club-deportivo', 'Plan 500', 105.00, 'admin@clubbcn.com', 'demo2024'),
('Academia de Baile Madrid', 'B87654321', 'Avenida Danza 456', 'Madrid', '28001', 'Madrid', '91 234 56 78', 'contacto@bailemadrid.com', '51-200', 'academia', 'Plan 200', 49.00, 'dashboard@bailemadrid.com', 'baile2024')
ON CONFLICT (cif) DO NOTHING;

-- Insertar contactos de ejemplo
INSERT INTO contactos (nombre, email, telefono, empresa, mensaje, estado)
VALUES
('María González', 'maria@clubdeportivo.com', '666123456', 'Club Deportivo Local', 'Necesitamos implementar LOPIVI urgentemente para nuestra escuela de fútbol.', 'nuevo'),
('Carlos Ruiz', 'carlos@academia.com', '677234567', 'Academia de Baile', 'Queremos información sobre los planes para academias con 80 menores.', 'contactado')
ON CONFLICT DO NOTHING;

-- ================================
-- 6. TRIGGERS DE ACTUALIZACIÓN
-- ================================

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para tablas principales
DROP TRIGGER IF EXISTS update_entidades_updated_at ON entidades;
CREATE TRIGGER update_entidades_updated_at BEFORE UPDATE ON entidades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_delegados_updated_at ON delegados;
CREATE TRIGGER update_delegados_updated_at BEFORE UPDATE ON delegados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contactos_updated_at ON contactos;
CREATE TRIGGER update_contactos_updated_at BEFORE UPDATE ON contactos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 7. COMENTARIOS INFORMATIVOS
-- ================================

COMMENT ON TABLE entidades IS 'Empresas/organizaciones que contratan Custodia360';
COMMENT ON TABLE delegados IS 'Delegados de protección (principal y suplentes)';
COMMENT ON TABLE contactos IS 'Formularios de contacto y leads comerciales';
COMMENT ON TABLE audit_logs IS 'Sistema de auditoría principal LOPIVI (retención 5 años)';
COMMENT ON TABLE document_communications IS 'Auditoría de comunicación de documentos LOPIVI';
COMMENT ON TABLE case_reports IS 'Auditoría de reportes de casos LOPIVI';
COMMENT ON TABLE member_registrations IS 'Auditoría de registro de miembros LOPIVI';
COMMENT ON TABLE user_actions IS 'Auditoría de acciones de usuario LOPIVI';

-- ================================
-- SCRIPT COMPLETADO EXITOSAMENTE
-- ================================

-- Para verificar que todo funciona:
-- SELECT 'Configuración completada' as status, count(*) as entidades FROM entidades;
