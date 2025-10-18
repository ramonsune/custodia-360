-- ============================================================
-- TABLA DE ALERTAS VISUALES BOE
-- Sistema de notificaciones internas para el panel de Custodia360
-- ============================================================

CREATE TABLE IF NOT EXISTS boe_alerts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  fecha TIMESTAMPTZ DEFAULT NOW(),
  total_cambios INTEGER DEFAULT 0,
  leido BOOLEAN DEFAULT FALSE,
  resumen TEXT,
  normas_afectadas TEXT[],
  cambios_ids BIGINT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas de alertas no leídas
CREATE INDEX IF NOT EXISTS idx_boe_alerts_leido ON boe_alerts(leido, created_at DESC);

-- Índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_boe_alerts_fecha ON boe_alerts(fecha DESC);

-- Comentario
COMMENT ON TABLE boe_alerts IS 'Alertas visuales de cambios BOE detectados para el panel interno';

-- Vista para contar alertas no leídas
CREATE OR REPLACE VIEW boe_alerts_unread_count AS
SELECT COUNT(*) as count
FROM boe_alerts
WHERE leido = FALSE;

COMMENT ON VIEW boe_alerts_unread_count IS 'Contador de alertas BOE no leídas';
