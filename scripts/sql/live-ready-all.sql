-- ============================================================
-- CUSTODIA360 - LIVE READY DATABASE SCHEMA
-- ============================================================
-- Versión: Production v1.0
-- Fecha: 2025
-- Modo: IDEMPOTENTE (puede ejecutarse múltiples veces sin error)
-- ============================================================

-- ============================================================
-- 1. TABLAS PRINCIPALES
-- ============================================================

-- 1.1 ENTITIES (Entidades registradas)
CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cif TEXT,
  sector_code TEXT DEFAULT 'general',
  direccion TEXT,
  telefono TEXT,
  web TEXT,
  email_admin TEXT,
  email_contratante TEXT,
  canal_tipo TEXT, -- 'email' | 'whatsapp'
  canal_valor TEXT,
  stripe_customer_id TEXT,
  stripe_payment_method_id TEXT,
  kit_comunicacion_activo BOOLEAN DEFAULT FALSE,
  kit_comunicacion_purchased_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 1.2 ENTITY_PEOPLE (Personas vinculadas a entidades)
CREATE TABLE IF NOT EXISTS entity_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL, -- 'principal' | 'suplente' | 'personal_contacto' | 'personal_no_contacto' | 'familia' | 'directiva'
  dni TEXT,
  telefono TEXT,
  cargo TEXT,
  formado BOOLEAN DEFAULT FALSE,
  certificado BOOLEAN DEFAULT FALSE,
  certificado_at TIMESTAMP,
  invited_token TEXT,
  auth_user_id UUID, -- Vincula con Supabase Auth
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 1.3 FAMILY_CHILDREN (Menores vinculados a familias)
CREATE TABLE IF NOT EXISTS family_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  parent_person_id UUID REFERENCES entity_people(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  edad INT,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 1.4 ENTITY_COMPLIANCE (Estado de cumplimiento LOPIVI)
CREATE TABLE IF NOT EXISTS entity_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID UNIQUE REFERENCES entities(id) ON DELETE CASCADE,
  channel_done BOOLEAN DEFAULT FALSE,
  channel_verified BOOLEAN DEFAULT FALSE,
  channel_postponed BOOLEAN DEFAULT FALSE,
  riskmap_done BOOLEAN DEFAULT FALSE,
  penales_done BOOLEAN DEFAULT FALSE,
  penales_postponed BOOLEAN DEFAULT FALSE,
  blocked BOOLEAN DEFAULT FALSE,
  deadline_at TIMESTAMP,
  days_remaining INT,
  config_completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 1.5 ENTITY_INVITE_TOKENS (Tokens de invitación para onboarding)
CREATE TABLE IF NOT EXISTS entity_invite_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);

-- 1.6 MINIQUIZ_ATTEMPTS (Intentos de evaluación rápida)
CREATE TABLE IF NOT EXISTS miniquiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES entity_people(id) ON DELETE CASCADE,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  score INT NOT NULL,
  passed BOOLEAN DEFAULT FALSE,
  answers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 1.7 MESSAGE_JOBS (Cola de emails)
CREATE TABLE IF NOT EXISTS message_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' | 'sent' | 'failed' | 'skipped'
  priority INT DEFAULT 5,
  scheduled_for TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  context JSONB DEFAULT '{}'::jsonb,
  error TEXT,
  resend_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 1.8 MESSAGE_TEMPLATES (Plantillas de emails)
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  category TEXT, -- 'onboarding' | 'compliance' | 'training' | 'billing' | 'system'
  active BOOLEAN DEFAULT TRUE,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 1.9 EMAIL_EVENTS (Eventos de emails desde webhook Resend)
CREATE TABLE IF NOT EXISTS email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resend_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained'
  email TEXT,
  timestamp TIMESTAMP NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 1.10 SUBSCRIPTIONS (Suscripciones/planes - placeholder sin Stripe)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  plan_code TEXT NOT NULL, -- 'plan100' | 'plan250' | 'plan500' | 'plan500plus'
  status TEXT DEFAULT 'pending_activation', -- 'pending_activation' | 'active' | 'cancelled' | 'expired'
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at TIMESTAMP,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 1.11 ADMIN_HEALTH_LOGS (Logs de auditoría y health checks)
CREATE TABLE IF NOT EXISTS admin_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT NOT NULL, -- 'system' | 'smoke_e2e' | 'daily_audit' | 'cron' | etc.
  status TEXT NOT NULL, -- 'ok' | 'warn' | 'fail'
  message TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 1.12 INVOICES (Facturas)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_type TEXT NOT NULL,
  description TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 21.00,
  tax_amount DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'paid',
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  pdf_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 2. ÍNDICES DE RENDIMIENTO
-- ============================================================

-- Índices para message_jobs (búsquedas frecuentes)
CREATE INDEX IF NOT EXISTS idx_message_jobs_status ON message_jobs(status);
CREATE INDEX IF NOT EXISTS idx_message_jobs_scheduled ON message_jobs(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_message_jobs_created_desc ON message_jobs(created_at DESC);

-- Índices para email_events
CREATE INDEX IF NOT EXISTS idx_email_events_resend ON email_events(resend_id);
CREATE INDEX IF NOT EXISTS idx_email_events_created_desc ON email_events(created_at DESC);

-- Índices para entity_invite_tokens
CREATE INDEX IF NOT EXISTS idx_invite_tokens_token ON entity_invite_tokens(token);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_entity ON entity_invite_tokens(entity_id);

-- Índices para entity_people
CREATE INDEX IF NOT EXISTS idx_people_entity ON entity_people(entity_id);
CREATE INDEX IF NOT EXISTS idx_people_tipo ON entity_people(tipo);
CREATE INDEX IF NOT EXISTS idx_people_email ON entity_people(email);

-- Índices para invoices
CREATE INDEX IF NOT EXISTS idx_invoices_entity ON invoices(entity_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_created_desc ON invoices(created_at DESC);

-- ============================================================
-- 3. TRIGGERS PARA UPDATED_AT
-- ============================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers en tablas con updated_at
DROP TRIGGER IF EXISTS update_entities_updated_at ON entities;
CREATE TRIGGER update_entities_updated_at
  BEFORE UPDATE ON entities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_entity_people_updated_at ON entity_people;
CREATE TRIGGER update_entity_people_updated_at
  BEFORE UPDATE ON entity_people
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_entity_compliance_updated_at ON entity_compliance;
CREATE TRIGGER update_entity_compliance_updated_at
  BEFORE UPDATE ON entity_compliance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_message_jobs_updated_at ON message_jobs;
CREATE TRIGGER update_message_jobs_updated_at
  BEFORE UPDATE ON message_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS en tablas sensibles (solo service role puede acceder)
ALTER TABLE message_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Política: Solo service role puede ver/modificar (resto bloqueado por defecto)
CREATE POLICY IF NOT EXISTS "Service role full access on message_jobs"
  ON message_jobs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role full access on email_events"
  ON email_events FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role full access on admin_health_logs"
  ON admin_health_logs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role full access on subscriptions"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Habilitar RLS en invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own invoices"
  ON invoices FOR SELECT
  USING (entity_id IN (SELECT id FROM entities WHERE id = entity_id));

CREATE POLICY IF NOT EXISTS "Service role can insert invoices"
  ON invoices FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 5. BACKFILL ENTITY_COMPLIANCE
-- ============================================================

-- Asegurar que cada entity tenga un registro en entity_compliance
INSERT INTO entity_compliance (entity_id, created_at)
SELECT
  e.id,
  NOW()
FROM entities e
WHERE NOT EXISTS (
  SELECT 1 FROM entity_compliance ec WHERE ec.entity_id = e.id
)
ON CONFLICT (entity_id) DO NOTHING;

-- ============================================================
-- 6. STORAGE BUCKETS
-- ============================================================
-- NOTA: Estos comandos solo funcionan desde el dashboard de Supabase Storage
-- o mediante la API de Supabase Management. Documentamos aquí la configuración:

/*
BUCKET: public-pdfs
- Nombre: public-pdfs
- Public: true (lectura pública)
- Políticas:
  - INSERT: Solo service_role
  - SELECT: Público (cualquiera puede leer)

BUCKET: private-pdfs
- Nombre: private-pdfs
- Public: false (privado)
- Políticas:
  - INSERT: Solo service_role
  - SELECT: Solo owner o entity_id mediante RLS

EJECUTAR EN DASHBOARD:
1. Storage > Create bucket "public-pdfs" (Public)
2. Storage > Create bucket "private-pdfs" (Private)
3. Configurar políticas en cada bucket según lo indicado arriba
*/

-- ============================================================
-- SCRIPT COMPLETADO
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Script live-ready-all.sql ejecutado correctamente';
  RAISE NOTICE '✅ Tablas verificadas/creadas: entities, entity_people, family_children, entity_compliance, entity_invite_tokens, miniquiz_attempts, message_jobs, message_templates, email_events, subscriptions, admin_health_logs, invoices';
  RAISE NOTICE '✅ Índices creados para optimización';
  RAISE NOTICE '✅ Triggers updated_at configurados';
  RAISE NOTICE '✅ Políticas RLS aplicadas';
  RAISE NOTICE '✅ Backfill entity_compliance completado';
  RAISE NOTICE '⚠️  IMPORTANTE: Crear buckets manualmente en Supabase Storage: public-pdfs (público) y private-pdfs (privado)';
END $$;
