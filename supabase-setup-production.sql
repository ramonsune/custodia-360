-- =====================================================
-- CUSTODIA360 - CONFIGURACIÓN COMPLETA DE SUPABASE
-- =====================================================
--
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto Supabase → SQL Editor
-- 2. Copia y pega este script completo
-- 3. Haz clic en "Run" para crear todas las tablas
--
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: entidades
-- =====================================================
CREATE TABLE IF NOT EXISTS entidades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre TEXT NOT NULL,
    cif TEXT UNIQUE NOT NULL,
    direccion TEXT,
    ciudad TEXT,
    codigo_postal TEXT,
    provincia TEXT,
    telefono TEXT,
    email TEXT,
    website TEXT,
    numero_menores INTEGER DEFAULT 0,
    tipo_entidad TEXT DEFAULT 'deportivo',
    plan TEXT DEFAULT 'Plan Básico',
    precio_mensual DECIMAL(10,2) DEFAULT 0.00,
    dashboard_email TEXT,
    dashboard_password TEXT,
    legal_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: delegados
-- =====================================================
CREATE TABLE IF NOT EXISTS delegados (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('principal', 'suplente')),
    nombre TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    telefono TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    experiencia TEXT,
    disponibilidad TEXT,
    certificado_penales BOOLEAN DEFAULT false,
    fecha_vencimiento_cert DATE,
    estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: contratantes
-- =====================================================
CREATE TABLE IF NOT EXISTS contratantes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    apellidos TEXT,
    dni TEXT UNIQUE NOT NULL,
    cargo TEXT,
    telefono TEXT,
    email TEXT UNIQUE NOT NULL,
    es_delegado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: casos
-- =====================================================
CREATE TABLE IF NOT EXISTS casos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
    delegado_id UUID REFERENCES delegados(id) ON DELETE SET NULL,
    tipo_caso TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    personas_involucradas JSONB DEFAULT '[]'::jsonb,
    prioridad TEXT DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')),
    estado TEXT DEFAULT 'abierto' CHECK (estado IN ('abierto', 'en_proceso', 'resuelto', 'cerrado')),
    acciones_inmediatas TEXT,
    fecha_limite DATE,
    documentos JSONB DEFAULT '[]'::jsonb,
    comunicaciones JSONB DEFAULT '[]'::jsonb,
    legal_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: audit_logs (Auditoría LOPIVI)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    action_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    session_id TEXT,
    legal_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: personal_formacion
-- =====================================================
CREATE TABLE IF NOT EXISTS personal_formacion (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    email TEXT,
    cargo TEXT,
    fecha_formacion DATE,
    tipo_formacion TEXT,
    certificado_obtenido BOOLEAN DEFAULT false,
    fecha_vencimiento DATE,
    documentos JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: comunicaciones
-- =====================================================
CREATE TABLE IF NOT EXISTS comunicaciones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
    delegado_id UUID REFERENCES delegados(id) ON DELETE SET NULL,
    tipo TEXT NOT NULL,
    destinatarios JSONB DEFAULT '[]'::jsonb,
    asunto TEXT,
    mensaje TEXT,
    documentos_adjuntos JSONB DEFAULT '[]'::jsonb,
    fecha_envio TIMESTAMP WITH TIME ZONE,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviado', 'fallido')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: configuracion_sistema
-- =====================================================
CREATE TABLE IF NOT EXISTS configuracion_sistema (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
    clave TEXT NOT NULL,
    valor JSONB DEFAULT '{}'::jsonb,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(entidad_id, clave)
);

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE entidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE delegados ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE casos ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_formacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_sistema ENABLE ROW LEVEL SECURITY;

-- Política básica: permitir todo para usuarios autenticados
-- Nota: En producción, estas políticas deben ser más restrictivas

CREATE POLICY "Enable all for authenticated users" ON entidades
    FOR ALL USING (true);

CREATE POLICY "Enable all for authenticated users" ON delegados
    FOR ALL USING (true);

CREATE POLICY "Enable all for authenticated users" ON contratantes
    FOR ALL USING (true);

CREATE POLICY "Enable all for authenticated users" ON casos
    FOR ALL USING (true);

CREATE POLICY "Enable all for authenticated users" ON audit_logs
    FOR ALL USING (true);

CREATE POLICY "Enable all for authenticated users" ON personal_formacion
    FOR ALL USING (true);

CREATE POLICY "Enable all for authenticated users" ON comunicaciones
    FOR ALL USING (true);

CREATE POLICY "Enable all for authenticated users" ON configuracion_sistema
    FOR ALL USING (true);

-- =====================================================
-- INSERTAR DATOS DE PRUEBA
-- =====================================================

-- Insertar entidad de prueba
INSERT INTO entidades (
    nombre, cif, direccion, ciudad, codigo_postal, provincia,
    telefono, email, tipo_entidad, numero_menores, plan,
    precio_mensual, dashboard_email, dashboard_password, legal_hash
) VALUES (
    'Club Deportivo Demo',
    'A12345678',
    'Calle Demo 123',
    'Madrid',
    '28001',
    'Madrid',
    '912345678',
    'admin@clubdemo.com',
    'deportivo',
    50,
    'Plan Básico',
    29.99,
    'admin@clubdemo.com',
    'admin123',
    'demo_hash_' || extract(epoch from now())
) ON CONFLICT (cif) DO NOTHING;

-- Insertar delegados de prueba
-- Nota: Necesitamos el ID de la entidad para insertar los delegados
DO $$
DECLARE
    entidad_id_var UUID;
BEGIN
    -- Obtener el ID de la entidad de prueba
    SELECT id INTO entidad_id_var FROM entidades WHERE cif = 'A12345678';

    -- Insertar delegado principal
    INSERT INTO delegados (
        entidad_id, tipo, nombre, apellidos, dni, telefono,
        email, password, experiencia, disponibilidad,
        certificado_penales, estado
    ) VALUES (
        entidad_id_var,
        'principal',
        'Maria',
        'García López',
        '12345678A',
        '612345678',
        'maria.garcia@clubdeportivo.com',
        'delegado123',
        'Formadora deportiva con 5 años de experiencia',
        'Tiempo completo',
        true,
        'activo'
    ) ON CONFLICT (email) DO NOTHING;

    -- Insertar delegado suplente
    INSERT INTO delegados (
        entidad_id, tipo, nombre, apellidos, dni, telefono,
        email, password, experiencia, disponibilidad,
        certificado_penales, estado
    ) VALUES (
        entidad_id_var,
        'suplente',
        'Carlos',
        'Rodríguez Fernández',
        '87654321B',
        '698765432',
        'carlos.rodriguez@clubdeportivo.com',
        'suplente123',
        'Monitor deportivo',
        'Tiempo parcial',
        true,
        'activo'
    ) ON CONFLICT (email) DO NOTHING;
END $$;

-- =====================================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_delegados_email ON delegados(email);
CREATE INDEX IF NOT EXISTS idx_delegados_entidad_id ON delegados(entidad_id);
CREATE INDEX IF NOT EXISTS idx_casos_entidad_id ON casos(entidad_id);
CREATE INDEX IF NOT EXISTS idx_casos_estado ON casos(estado);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- =====================================================
-- FUNCIONES DE TRIGGER PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

-- Aplicar triggers a todas las tablas
CREATE TRIGGER update_entidades_updated_at BEFORE UPDATE ON entidades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delegados_updated_at BEFORE UPDATE ON delegados
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contratantes_updated_at BEFORE UPDATE ON contratantes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_casos_updated_at BEFORE UPDATE ON casos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audit_logs_updated_at BEFORE UPDATE ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personal_formacion_updated_at BEFORE UPDATE ON personal_formacion
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comunicaciones_updated_at BEFORE UPDATE ON comunicaciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracion_sistema_updated_at BEFORE UPDATE ON configuracion_sistema
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CONFIRMACIÓN
-- =====================================================
SELECT 'Configuración de Supabase completada exitosamente!' as status;
