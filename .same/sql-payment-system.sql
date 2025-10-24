-- =====================================================
-- CUSTODIA360 - SISTEMA DE PAGOS DIVIDIDOS
-- Schema actualizado para pagos en 2 tramos (50%/50%)
-- =====================================================

-- 1. AÑADIR COLUMNAS A TABLA entities
ALTER TABLE entities
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_method_id TEXT,
ADD COLUMN IF NOT EXISTS second_payment_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS second_payment_date DATE,
ADD COLUMN IF NOT EXISTS second_payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_last_retry_date DATE,
ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS grace_period_start_date DATE,
ADD COLUMN IF NOT EXISTS delegado_suplente_contratado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS plan_precio_total DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS first_payment_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS payment_reminder_sent BOOLEAN DEFAULT false;

-- 2. CREAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_entities_stripe_customer ON entities(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_entities_second_payment_date ON entities(second_payment_date);
CREATE INDEX IF NOT EXISTS idx_entities_account_status ON entities(account_status);
CREATE INDEX IF NOT EXISTS idx_entities_payment_status ON entities(second_payment_status);

-- 3. CREAR TABLA DE PAYMENT TOKENS (para cambiar tarjeta)
CREATE TABLE IF NOT EXISTS payment_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  purpose TEXT NOT NULL, -- 'change_card', 'second_payment'
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_tokens_token ON payment_tokens(token);
CREATE INDEX IF NOT EXISTS idx_payment_tokens_entity ON payment_tokens(entity_id);

-- 4. COMENTARIOS EN COLUMNAS
COMMENT ON COLUMN entities.stripe_customer_id IS 'Stripe Customer ID para cobros recurrentes';
COMMENT ON COLUMN entities.stripe_payment_method_id IS 'ID del método de pago guardado';
COMMENT ON COLUMN entities.second_payment_amount IS 'Monto del segundo pago (50% plan + IVA)';
COMMENT ON COLUMN entities.second_payment_date IS 'Fecha programada para segundo pago (+6 meses)';
COMMENT ON COLUMN entities.second_payment_status IS 'pending, reminded, paid, failed, cancelled';
COMMENT ON COLUMN entities.payment_retry_count IS 'Número de reintentos de cobro (máx 3)';
COMMENT ON COLUMN entities.account_status IS 'active, grace_period, suspended';
COMMENT ON COLUMN entities.delegado_suplente_contratado IS 'Si contrató delegado suplente en onboarding';
COMMENT ON COLUMN entities.plan_precio_total IS 'Precio total anual del plan (sin extras)';
COMMENT ON COLUMN entities.first_payment_amount IS 'Monto del primer pago completo';

-- 5. FUNCIÓN HELPER: Calcular próxima fecha de reintento
CREATE OR REPLACE FUNCTION calculate_next_retry_date(last_retry DATE, retry_count INT)
RETURNS DATE AS $$
BEGIN
  RETURN last_retry + INTERVAL '3 days';
END;
$$ LANGUAGE plpgsql;

-- 6. VALORES POSIBLES (constraints)
ALTER TABLE entities DROP CONSTRAINT IF EXISTS check_second_payment_status;
ALTER TABLE entities ADD CONSTRAINT check_second_payment_status
  CHECK (second_payment_status IN ('pending', 'reminded', 'paid', 'failed', 'cancelled'));

ALTER TABLE entities DROP CONSTRAINT IF EXISTS check_account_status;
ALTER TABLE entities ADD CONSTRAINT check_account_status
  CHECK (account_status IN ('active', 'grace_period', 'suspended'));

ALTER TABLE entities DROP CONSTRAINT IF EXISTS check_payment_retry_count;
ALTER TABLE entities ADD CONSTRAINT check_payment_retry_count
  CHECK (payment_retry_count >= 0 AND payment_retry_count <= 3);

-- 7. RLS POLICIES para payment_tokens
ALTER TABLE payment_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage payment tokens"
  ON payment_tokens
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 8. VISTA HELPER: Entidades con pagos pendientes
CREATE OR REPLACE VIEW entities_pending_second_payment AS
SELECT
  e.id,
  e.nombre_entidad,
  e.email_contratante,
  e.second_payment_amount,
  e.second_payment_date,
  e.second_payment_status,
  e.payment_retry_count,
  e.account_status,
  e.stripe_customer_id,
  e.stripe_payment_method_id
FROM entities e
WHERE
  e.second_payment_status IN ('pending', 'reminded')
  AND e.account_status != 'suspended'
  AND e.second_payment_date IS NOT NULL;

-- 9. VISTA HELPER: Entidades en período de gracia
CREATE OR REPLACE VIEW entities_in_grace_period AS
SELECT
  e.id,
  e.nombre_entidad,
  e.email_contratante,
  e.grace_period_start_date,
  e.grace_period_start_date + INTERVAL '7 days' as grace_period_end_date,
  EXTRACT(DAY FROM (e.grace_period_start_date + INTERVAL '7 days') - NOW()) as days_remaining
FROM entities e
WHERE
  e.account_status = 'grace_period'
  AND e.grace_period_start_date IS NOT NULL;

-- 10. FUNCIÓN: Marcar cuenta como suspendida
CREATE OR REPLACE FUNCTION suspend_entity_account(entity_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE entities
  SET
    account_status = 'suspended',
    second_payment_status = 'cancelled'
  WHERE id = entity_uuid;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
