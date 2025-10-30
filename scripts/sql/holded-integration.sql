-- ============================================================
-- HOLDED INTEGRATION - SQL SCHEMA UPDATES
-- ============================================================
--
-- Este script añade las columnas necesarias para la integración
-- con Holded (ERP español) para facturación y contabilidad
-- automática.
--
-- EJECUTAR EN: Supabase SQL Editor
-- FECHA: 22 de octubre de 2025
-- IDEMPOTENTE: Sí (puede ejecutarse múltiples veces sin error)
--
-- ============================================================

-- TABLA: entities
-- Añadir columnas de integración con Holded
ALTER TABLE entities
ADD COLUMN IF NOT EXISTS holded_contact_id TEXT,
ADD COLUMN IF NOT EXISTS holded_invoice_id TEXT,
ADD COLUMN IF NOT EXISTS holded_invoice_number TEXT;

-- Comentarios explicativos
COMMENT ON COLUMN entities.holded_contact_id IS 'ID del contacto (cliente) en Holded';
COMMENT ON COLUMN entities.holded_invoice_id IS 'ID de la última factura generada en Holded';
COMMENT ON COLUMN entities.holded_invoice_number IS 'Número de la última factura (ej: 2025/001)';

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_entities_holded_contact
ON entities(holded_contact_id);

CREATE INDEX IF NOT EXISTS idx_entities_holded_invoice
ON entities(holded_invoice_id);

-- ============================================================

-- TABLA: invoices
-- Añadir columnas de integración con Holded
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS holded_invoice_id TEXT,
ADD COLUMN IF NOT EXISTS holded_invoice_number TEXT,
ADD COLUMN IF NOT EXISTS holded_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS holded_status TEXT DEFAULT 'pending';

-- Comentarios explicativos
COMMENT ON COLUMN invoices.holded_invoice_id IS 'ID de la factura en Holded';
COMMENT ON COLUMN invoices.holded_invoice_number IS 'Número legal secuencial de Holded (ej: 2025/001)';
COMMENT ON COLUMN invoices.holded_pdf_url IS 'URL del PDF de la factura en Holded';
COMMENT ON COLUMN invoices.holded_status IS 'Estado de la factura en Holded: pending, draft, sent, paid';

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_invoices_holded_invoice
ON invoices(holded_invoice_id);

CREATE INDEX IF NOT EXISTS idx_invoices_holded_number
ON invoices(holded_invoice_number);

CREATE INDEX IF NOT EXISTS idx_invoices_holded_status
ON invoices(holded_status);

-- ============================================================

-- VERIFICACIÓN
-- Mostrar estructura actualizada de las tablas

\d entities;
\d invoices;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================

-- NOTA: Tras ejecutar este script, verificar en Table Editor que las columnas existan:
--
-- entities:
--   - holded_contact_id (text)
--   - holded_invoice_id (text)
--   - holded_invoice_number (text)
--
-- invoices:
--   - holded_invoice_id (text)
--   - holded_invoice_number (text)
--   - holded_pdf_url (text)
--   - holded_status (text, default: 'pending')
