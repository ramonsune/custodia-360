-- CUSTODIA360 DATABASE SETUP SCRIPT
-- Ejecutar en Supabase SQL Editor

-- 1. TABLA ENTIDADES (Empresas que contratan)
CREATE TABLE entidades (
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

-- 2. TABLA CONTRATANTES (Personas que realizan la contratación)
CREATE TABLE contratantes (
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

-- 3. TABLA DELEGADOS (Principal y suplentes)
CREATE TABLE delegados (
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

-- 4. TABLA CUMPLIMIENTO (Estado LOPIVI de cada entidad)
CREATE TABLE cumplimiento (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  personal_formado INTEGER DEFAULT 0,
  familias_informadas INTEGER DEFAULT 0,
  menores_informados INTEGER DEFAULT 0,
  casos_activos INTEGER DEFAULT 0,
  porcentaje_cumplimiento DECIMAL(5,2) DEFAULT 0,
  alertas_pendientes JSONB DEFAULT '[]',
  fecha_actualizacion TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA DOCUMENTOS (PDFs, certificados, etc.)
CREATE TABLE documentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  delegado_id UUID REFERENCES delegados(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL,
  nombre_archivo TEXT NOT NULL,
  url_archivo TEXT NOT NULL,
  fecha_subida TIMESTAMPTZ DEFAULT NOW(),
  fecha_vencimiento DATE,
  estado TEXT DEFAULT 'vigente' CHECK (estado IN ('vigente', 'vencido', 'pendiente')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA USUARIOS AUTH (Para login/logout)
CREATE TABLE usuarios_auth (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('entidad', 'delegado', 'admin')),
  referencia_id UUID, -- ID de entidad o delegado
  ultimo_acceso TIMESTAMPTZ,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'bloqueado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLA PAGOS (Historial de facturación)
CREATE TABLE pagos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  stripe_payment_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT NOT NULL,
  fecha_pago TIMESTAMPTZ DEFAULT NOW(),
  periodo_facturacion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLA LOGS (Auditoría y seguimiento)
CREATE TABLE logs_actividad (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID,
  entidad_id UUID REFERENCES entidades(id) ON DELETE SET NULL,
  accion TEXT NOT NULL,
  descripcion TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES PARA OPTIMIZACIÓN
CREATE INDEX idx_entidades_estado ON entidades(estado);
CREATE INDEX idx_entidades_plan ON entidades(plan);
CREATE INDEX idx_delegados_entidad ON delegados(entidad_id);
CREATE INDEX idx_delegados_email ON delegados(email);
CREATE INDEX idx_cumplimiento_entidad ON cumplimiento(entidad_id);
CREATE INDEX idx_documentos_entidad ON documentos(entidad_id);
CREATE INDEX idx_usuarios_email ON usuarios_auth(email);
CREATE INDEX idx_pagos_entidad ON pagos(entidad_id);

-- TRIGGERS PARA ACTUALIZAR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_entidades_updated_at BEFORE UPDATE ON entidades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delegados_updated_at BEFORE UPDATE ON delegados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY (Seguridad)
ALTER TABLE entidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE delegados ENABLE ROW LEVEL SECURITY;
ALTER TABLE cumplimiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE SEGURIDAD BÁSICAS
CREATE POLICY "Entidades pueden ver sus propios datos" ON entidades FOR ALL USING (auth.uid()::text = dashboard_email);
CREATE POLICY "Delegados pueden ver datos de su entidad" ON delegados FOR ALL USING (auth.uid()::text = email);

-- DATOS DE EJEMPLO PARA TESTING
INSERT INTO entidades (nombre, cif, direccion, ciudad, codigo_postal, provincia, telefono, email, numero_menores, tipo_entidad, plan, precio_mensual, dashboard_email, dashboard_password) VALUES
('Club Deportivo Ejemplo', 'B12345678', 'Calle Deporte 123', 'Barcelona', '08001', 'Barcelona', '93 123 45 67', 'info@clubejemplo.com', '201-500', 'club-deportivo', 'Plan 500', 105.00, 'admin@clubejemplo.com', 'password123'),
('Escuela Infantil Aurora', 'B87654321', 'Avenida Niños 456', 'Madrid', '28001', 'Madrid', '91 234 56 78', 'contacto@escuelaaurora.com', '51-200', 'escuela-infantil', 'Plan 200', 49.00, 'dashboard@escuelaaurora.com', 'aurora2024');

-- CREAR REGISTRO DE CUMPLIMIENTO PARA DATOS DE EJEMPLO
INSERT INTO cumplimiento (entidad_id, personal_formado, familias_informadas, menores_informados, casos_activos, porcentaje_cumplimiento, alertas_pendientes)
SELECT id, 28, 156, 218, 1, 87.5, '[{"tipo": "certificacion", "mensaje": "Certificación de María López caduca en 15 días"}, {"tipo": "documentos", "mensaje": "4 familias pendientes de firmar código de conducta"}]'::jsonb
FROM entidades WHERE cif = 'B12345678';

INSERT INTO cumplimiento (entidad_id, personal_formado, familias_informadas, menores_informados, casos_activos, porcentaje_cumplimiento, alertas_pendientes)
SELECT id, 15, 89, 134, 0, 94.2, '[]'::jsonb
FROM entidades WHERE cif = 'B87654321';

-- COMENTARIOS DE CONFIGURACIÓN
COMMENT ON TABLE entidades IS 'Empresas/organizaciones que contratan Custodia360';
COMMENT ON TABLE delegados IS 'Delegados de protección (principal y suplentes)';
COMMENT ON TABLE cumplimiento IS 'Estado de cumplimiento LOPIVI de cada entidad';
COMMENT ON TABLE documentos IS 'Archivos, certificados y documentos legales';
COMMENT ON TABLE usuarios_auth IS 'Sistema de autenticación y usuarios';
COMMENT ON TABLE pagos IS 'Historial de pagos y facturación';
COMMENT ON TABLE logs_actividad IS 'Registro de actividad y auditoría';

-- CONFIGURACIÓN COMPLETADA
-- Ejecutar este script en: Supabase Dashboard > SQL Editor > New Query > Pegar y Run
