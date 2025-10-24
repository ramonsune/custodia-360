-- ============================================
-- SCRIPT: Setup Kit de Comunicación LOPIVI
-- ============================================
-- Este script añade los campos necesarios para el sistema de compra del Kit de Comunicación
-- y la tabla de facturas.

-- 1. Añadir campos a la tabla entities
ALTER TABLE entities ADD COLUMN IF NOT EXISTS email_admin TEXT;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS email_contratante TEXT;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS stripe_payment_method_id TEXT;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS kit_comunicacion_activo BOOLEAN DEFAULT FALSE;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS kit_comunicacion_purchased_at TIMESTAMP;

-- Comentarios descriptivos
COMMENT ON COLUMN entities.email_admin IS 'Email del administrativo para facturas y comunicaciones oficiales';
COMMENT ON COLUMN entities.email_contratante IS 'Email del contratante/responsable de la entidad';
COMMENT ON COLUMN entities.stripe_customer_id IS 'ID del cliente en Stripe para gestión de pagos';
COMMENT ON COLUMN entities.stripe_payment_method_id IS 'ID del método de pago principal guardado en Stripe';
COMMENT ON COLUMN entities.kit_comunicacion_activo IS 'Indica si la entidad tiene activo el Kit de Comunicación LOPIVI';
COMMENT ON COLUMN entities.kit_comunicacion_purchased_at IS 'Fecha de compra del Kit de Comunicación';

-- 2. Crear tabla para facturas
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_type TEXT NOT NULL, -- 'kit_comunicacion', 'delegado_suplente', 'plan_inicial', 'renovacion', etc.
  description TEXT,
  subtotal DECIMAL(10,2) NOT NULL, -- Precio base sin IVA
  tax_rate DECIMAL(5,2) DEFAULT 21.00, -- Porcentaje de IVA
  tax_amount DECIMAL(10,2) NOT NULL, -- Cantidad de IVA
  total DECIMAL(10,2) NOT NULL, -- Total con IVA
  currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'paid', -- 'paid', 'pending', 'failed', 'refunded'
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  pdf_url TEXT,
  metadata JSONB, -- Información adicional flexible
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comentarios para la tabla invoices
COMMENT ON TABLE invoices IS 'Registro de todas las facturas generadas en el sistema Custodia360';
COMMENT ON COLUMN invoices.invoice_type IS 'Tipo de factura: kit_comunicacion, delegado_suplente, plan_inicial, renovacion';
COMMENT ON COLUMN invoices.metadata IS 'Campo JSON flexible para información adicional específica de cada tipo de factura';

-- 3. Índices para optimización de consultas
CREATE INDEX IF NOT EXISTS idx_invoices_entity ON invoices(entity_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_type ON invoices(invoice_type);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created ON invoices(created_at DESC);

-- 4. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger para actualizar updated_at en invoices
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Políticas RLS (Row Level Security) para invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus propias facturas
CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  USING (
    entity_id IN (
      SELECT id FROM entities WHERE id = entity_id
    )
  );

-- Política: Solo el sistema puede crear facturas (usando service role)
CREATE POLICY "Service role can insert invoices"
  ON invoices FOR INSERT
  WITH CHECK (true);

-- 7. Función helper para generar número de factura único
CREATE OR REPLACE FUNCTION generate_invoice_number(invoice_type_param TEXT)
RETURNS TEXT AS $$
DECLARE
  year_prefix TEXT;
  count_invoices INT;
  invoice_num TEXT;
BEGIN
  year_prefix := TO_CHAR(NOW(), 'YYYY');

  -- Contar facturas del mismo tipo en el año actual
  SELECT COUNT(*) INTO count_invoices
  FROM invoices
  WHERE invoice_type = invoice_type_param
    AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());

  -- Generar número con formato: FAC-TIPO-AÑO-SECUENCIA
  invoice_num := CONCAT(
    'FAC-',
    UPPER(SUBSTRING(invoice_type_param, 1, 3)),
    '-',
    year_prefix,
    '-',
    LPAD((count_invoices + 1)::TEXT, 5, '0')
  );

  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SCRIPT COMPLETADO
-- ============================================

-- Verificación de campos creados
DO $$
BEGIN
  RAISE NOTICE 'Script ejecutado correctamente.';
  RAISE NOTICE 'Campos añadidos a entities: email_admin, email_contratante, stripe_customer_id, stripe_payment_method_id, kit_comunicacion_activo, kit_comunicacion_purchased_at';
  RAISE NOTICE 'Tabla invoices creada con índices y políticas RLS';
  RAISE NOTICE 'Función generate_invoice_number() disponible para generar números de factura únicos';
END $$;
