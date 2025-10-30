-- ============================================================================
-- CUSTODIA360 - SCHEMA E2E ONBOARDING 1€
-- ============================================================================
-- Fecha: 28 de octubre de 2025
-- Propósito: Tablas para flujo de contratación con pago 1€, auditoría y formación
-- ============================================================================

-- ============================================================================
-- TABLA 1: onboarding_process
-- Almacena cada proceso de alta/contratación
-- ============================================================================

CREATE TABLE IF NOT EXISTS onboarding_process (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Datos del formulario
  email text NOT NULL,
  entity_name text NOT NULL,
  cif text,
  phone text,
  address jsonb,                          -- {street, city, postal_code, province, country}
  password_hash text,                     -- Hash bcrypt de la contraseña inicial

  -- Plan (futuro uso para suscripciones)
  plan_key text DEFAULT 'BASIC',

  -- IDs de Stripe
  stripe_customer_id text,
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  stripe_charge_id text,

  -- IDs de Holded
  holded_contact_id text,
  holded_invoice_id text,

  -- IDs de entidad y usuario creados
  entity_id uuid,
  delegate_user_id uuid,

  -- Estado del proceso
  status text NOT NULL DEFAULT 'pending',  -- 'pending' | 'paid' | 'provisioned' | 'trained' | 'error'

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Metadata adicional
  metadata jsonb DEFAULT '{}'::jsonb,

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('pending', 'paid', 'provisioned', 'trained', 'error')),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Índices para onboarding_process
CREATE INDEX IF NOT EXISTS idx_onboarding_email ON onboarding_process(email);
CREATE INDEX IF NOT EXISTS idx_onboarding_status ON onboarding_process(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_created_at ON onboarding_process(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_onboarding_stripe_session ON onboarding_process(stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_onboarding_entity_id ON onboarding_process(entity_id) WHERE entity_id IS NOT NULL;

-- Comentarios
COMMENT ON TABLE onboarding_process IS 'Procesos de alta de nuevas entidades con pago 1€';
COMMENT ON COLUMN onboarding_process.status IS 'Estado: pending (inicial) → paid (pago confirmado) → provisioned (entidad+usuario creados) → trained (formación completada) | error (falló)';

-- ============================================================================
-- TABLA 2: audit_events
-- Timeline de eventos para cada proceso (auditoría)
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relación con proceso de onboarding
  process_id uuid REFERENCES onboarding_process(id) ON DELETE CASCADE,

  -- Tipo de evento
  event_type text NOT NULL,                -- ej: 'checkout.created', 'webhook.received', 'entity.created', 'user.created', etc.

  -- Nivel de severidad
  level text DEFAULT 'INFO',               -- 'INFO' | 'WARN' | 'ERROR'

  -- Payload del evento (JSON)
  payload jsonb DEFAULT '{}'::jsonb,

  -- Timestamp
  created_at timestamptz DEFAULT now(),

  -- Constraints
  CONSTRAINT valid_level CHECK (level IN ('INFO', 'WARN', 'ERROR'))
);

-- Índices para audit_events
CREATE INDEX IF NOT EXISTS idx_audit_process_id ON audit_events(process_id);
CREATE INDEX IF NOT EXISTS idx_audit_event_type ON audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_level ON audit_events(level);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_process_created ON audit_events(process_id, created_at DESC);

-- Comentarios
COMMENT ON TABLE audit_events IS 'Timeline de eventos de auditoría para cada proceso de onboarding';
COMMENT ON COLUMN audit_events.event_type IS 'Tipos: checkout.created, webhook.received, payment.confirmed, entity.created, user.created, role.granted, emails.sent, holded.sync, training.completed, etc.';
COMMENT ON COLUMN audit_events.level IS 'Nivel: INFO (normal), WARN (advertencia), ERROR (error crítico)';

-- ============================================================================
-- TABLA 3: training_progress
-- Progreso de formación para cada usuario
-- ============================================================================

CREATE TABLE IF NOT EXISTS training_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Usuario y entidad
  user_id uuid NOT NULL,
  entity_id uuid NOT NULL,

  -- Progreso
  steps_completed int DEFAULT 0,
  total_steps int DEFAULT 5,
  is_completed boolean DEFAULT false,

  -- Timestamp
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Datos de pasos completados (opcional)
  steps_data jsonb DEFAULT '[]'::jsonb,    -- Array con info de cada paso

  -- Constraints
  CONSTRAINT valid_progress CHECK (steps_completed >= 0 AND steps_completed <= total_steps),
  CONSTRAINT unique_user_entity UNIQUE (user_id, entity_id)
);

-- Índices para training_progress
CREATE INDEX IF NOT EXISTS idx_training_user_id ON training_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_training_entity_id ON training_progress(entity_id);
CREATE INDEX IF NOT EXISTS idx_training_completed ON training_progress(is_completed);

-- Comentarios
COMMENT ON TABLE training_progress IS 'Progreso de formación LOPIVI para nuevos delegados';
COMMENT ON COLUMN training_progress.steps_completed IS 'Número de pasos completados (0-5)';
COMMENT ON COLUMN training_progress.is_completed IS 'true cuando steps_completed == total_steps';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Activar RLS en todas las tablas
ALTER TABLE onboarding_process ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;

-- Política: Denegar acceso público por defecto
-- Solo permitir operaciones desde API server con service role

-- onboarding_process: Solo service role puede leer/escribir
DROP POLICY IF EXISTS "Service role full access" ON onboarding_process;
CREATE POLICY "Service role full access" ON onboarding_process
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- audit_events: Solo service role puede leer/escribir
DROP POLICY IF EXISTS "Service role full access" ON audit_events;
CREATE POLICY "Service role full access" ON audit_events
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- training_progress: Solo service role puede leer/escribir
DROP POLICY IF EXISTS "Service role full access" ON training_progress;
CREATE POLICY "Service role full access" ON training_progress
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger para actualizar updated_at automáticamente en onboarding_process
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_onboarding_updated_at ON onboarding_process;
CREATE TRIGGER update_onboarding_updated_at
  BEFORE UPDATE ON onboarding_process
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_training_updated_at ON training_progress;
CREATE TRIGGER update_training_updated_at
  BEFORE UPDATE ON training_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCIONES AUXILIARES
-- ============================================================================

-- Función para marcar formación como completada
CREATE OR REPLACE FUNCTION mark_training_completed(p_user_id uuid, p_entity_id uuid)
RETURNS training_progress AS $$
DECLARE
  v_progress training_progress;
BEGIN
  UPDATE training_progress
  SET
    steps_completed = total_steps,
    is_completed = true,
    updated_at = now()
  WHERE user_id = p_user_id AND entity_id = p_entity_id
  RETURNING * INTO v_progress;

  RETURN v_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener último evento de un proceso
CREATE OR REPLACE FUNCTION get_latest_event(p_process_id uuid)
RETURNS audit_events AS $$
  SELECT * FROM audit_events
  WHERE process_id = p_process_id
  ORDER BY created_at DESC
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- ============================================================================
-- GRANTS (Permisos)
-- ============================================================================

-- Revocar todos los permisos públicos
REVOKE ALL ON onboarding_process FROM PUBLIC, anon, authenticated;
REVOKE ALL ON audit_events FROM PUBLIC, anon, authenticated;
REVOKE ALL ON training_progress FROM PUBLIC, anon, authenticated;

-- Otorgar permisos solo a service_role
GRANT ALL ON onboarding_process TO service_role;
GRANT ALL ON audit_events TO service_role;
GRANT ALL ON training_progress TO service_role;

-- ============================================================================
-- DATOS INICIALES (OPCIONAL)
-- ============================================================================

-- Insertar proceso de prueba (comentado por defecto)
-- INSERT INTO onboarding_process (email, entity_name, status, metadata)
-- VALUES (
--   'test@custodia360.es',
--   'Entidad de Prueba',
--   'pending',
--   '{"test": true}'::jsonb
-- );

-- ============================================================================
-- FIN DEL SCHEMA
-- ============================================================================

-- Verificación: Listar tablas creadas
DO $$
BEGIN
  RAISE NOTICE 'Schema E2E Onboarding creado exitosamente';
  RAISE NOTICE 'Tablas: onboarding_process, audit_events, training_progress';
  RAISE NOTICE 'RLS activado en todas las tablas';
  RAISE NOTICE 'Triggers y funciones auxiliares creados';
END $$;
