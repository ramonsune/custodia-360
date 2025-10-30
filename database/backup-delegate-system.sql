-- ============================================================================
-- SISTEMA DE DELEGADO SUPLENTE - CUSTODIA360
-- ============================================================================
-- Módulo completo para gestión de delegados suplentes con:
-- - Flujo de pago y autorización
-- - Sistema de permisos por roles
-- - Auditoría completa de acciones
-- - Integración con Resend para notificaciones
-- ============================================================================

-- 1. MODIFICAR TABLA ENTIDADES (añadir campos para suplente)
-- ============================================================================
ALTER TABLE entidades
  ADD COLUMN IF NOT EXISTS has_backup_delegate BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS backup_status TEXT CHECK (backup_status IN ('none', 'pending_payment', 'pending_consent', 'active', 'revoked')) DEFAULT 'none';

-- 2. TABLA USERS - Gestión unificada de usuarios del sistema
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'blocked')) DEFAULT 'active',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE users IS 'Usuarios del sistema (delegados, suplentes, admins)';

-- 3. TABLA ENTITY_USER_ROLES - Relación usuarios-entidades con roles
-- ============================================================================
CREATE TABLE IF NOT EXISTS entity_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entidades(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('ADMIN', 'DELEGADO', 'SUPLENTE')) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(entity_id, user_id, role)
);

COMMENT ON TABLE entity_user_roles IS 'Roles de usuarios en entidades específicas';

-- 4. TABLA BACKUP_DELEGATE_REQUESTS - Solicitudes de suplencia
-- ============================================================================
CREATE TABLE IF NOT EXISTS backup_delegate_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entidades(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_password_hash TEXT,
  invited BOOLEAN DEFAULT false,
  payment_id UUID,
  status TEXT CHECK (status IN ('pending_payment', 'pending_consent', 'authorized', 'activated', 'rejected')) DEFAULT 'pending_payment',
  authorization_token TEXT UNIQUE,
  token_expires_at TIMESTAMP,
  authorized_by UUID REFERENCES users(id),
  authorized_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE backup_delegate_requests IS 'Solicitudes de alta de delegado suplente';

-- 5. TABLA PAYMENTS - Sistema de pagos
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entidades(id) ON DELETE CASCADE NOT NULL,
  product TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT CHECK (status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  provider_ref TEXT,
  provider_name TEXT,
  payment_method TEXT,
  paid_at TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE payments IS 'Registro de pagos del sistema';

-- 6. TABLA AUDIT_LOG - Auditoría completa de acciones
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  mode TEXT CHECK (mode IN ('normal', 'suplencia')) DEFAULT 'normal',
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE audit_log IS 'Registro de auditoría de todas las acciones del sistema';

-- ============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_entidades_backup_status ON entidades(backup_status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_entity_user_roles_entity ON entity_user_roles(entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_user_roles_user ON entity_user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_entity_user_roles_role ON entity_user_roles(role);
CREATE INDEX IF NOT EXISTS idx_backup_requests_entity ON backup_delegate_requests(entity_id);
CREATE INDEX IF NOT EXISTS idx_backup_requests_status ON backup_delegate_requests(status);
CREATE INDEX IF NOT EXISTS idx_backup_requests_token ON backup_delegate_requests(authorization_token);
CREATE INDEX IF NOT EXISTS idx_payments_entity ON payments(entity_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);

-- ============================================================================
-- FUNCIONES AUXILIARES
-- ============================================================================

-- Función: Generar token de autorización único
CREATE OR REPLACE FUNCTION generate_authorization_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Función: Verificar si un token es válido
CREATE OR REPLACE FUNCTION is_token_valid(p_token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_expires_at TIMESTAMP;
BEGIN
  SELECT token_expires_at INTO v_expires_at
  FROM backup_delegate_requests
  WHERE authorization_token = p_token;

  IF v_expires_at IS NULL THEN
    RETURN false;
  END IF;

  RETURN v_expires_at > NOW();
END;
$$ LANGUAGE plpgsql;

-- Función: Obtener estado de suplencia de una entidad
CREATE OR REPLACE FUNCTION get_backup_delegate_status(p_entity_id UUID)
RETURNS TABLE(
  has_backup BOOLEAN,
  status TEXT,
  delegate_email TEXT,
  delegate_name TEXT,
  activated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.has_backup_delegate,
    e.backup_status,
    u.email,
    u.name,
    eur.assigned_at
  FROM entidades e
  LEFT JOIN entity_user_roles eur ON e.id = eur.entity_id AND eur.role = 'SUPLENTE' AND eur.enabled = true
  LEFT JOIN users u ON eur.user_id = u.id
  WHERE e.id = p_entity_id;
END;
$$ LANGUAGE plpgsql;

-- Función: Registrar acción en auditoría
CREATE OR REPLACE FUNCTION log_audit(
  p_entity_id UUID,
  p_actor_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_mode TEXT DEFAULT 'normal',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  INSERT INTO audit_log (entity_id, actor_user_id, action, resource_type, resource_id, mode, metadata)
  VALUES (p_entity_id, p_actor_user_id, p_action, p_resource_type, p_resource_id, p_mode, p_metadata)
  RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entity_user_roles_updated_at BEFORE UPDATE ON entity_user_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_backup_requests_updated_at BEFORE UPDATE ON backup_delegate_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_delegate_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Service role has full access to users" ON users
  USING (auth.jwt()->>'role' = 'service_role');

-- Políticas RLS para entity_user_roles
CREATE POLICY "Users can read own roles" ON entity_user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to roles" ON entity_user_roles
  USING (auth.jwt()->>'role' = 'service_role');

-- Políticas RLS para audit_log (solo lectura para usuarios, escritura para service)
CREATE POLICY "Users can read own audit logs" ON audit_log
  FOR SELECT USING (auth.uid() = actor_user_id);

CREATE POLICY "Service role has full access to audit" ON audit_log
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- DATOS INICIALES / SEED
-- ============================================================================

-- Asegurar que entidades existentes tengan valores por defecto
UPDATE entidades
SET has_backup_delegate = false, backup_status = 'none'
WHERE has_backup_delegate IS NULL OR backup_status IS NULL;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
