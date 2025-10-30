-- =====================================================
-- Migración: Kit de Comunicación LOPIVI
-- Fecha: 15 Octubre 2025
-- Descripción: Añade campo para controlar acceso a plantillas
-- =====================================================

-- Añadir campo kit_comunicacion a entities
ALTER TABLE entities
ADD COLUMN IF NOT EXISTS kit_comunicacion BOOLEAN DEFAULT false;

-- Comentario descriptivo
COMMENT ON COLUMN entities.kit_comunicacion IS
'Indica si la entidad tiene activo el Kit de Comunicación LOPIVI (precio Stripe: price_1SFtBIPtu7JxWqv9sw7DH5ML)';

-- Índice para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_entities_kit_comunicacion ON entities(kit_comunicacion);
