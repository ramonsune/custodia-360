-- ============================================================
-- SISTEMA DE MONITOREO AUTOMÁTICO DEL BOE - LOPIVI
-- Custodia360 - Panel Interno
-- ============================================================

-- Tabla para almacenar cambios detectados del BOE
CREATE TABLE IF NOT EXISTS boe_changes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  norma_base_id TEXT NOT NULL,
  norma_mod_id TEXT NOT NULL,
  relacion TEXT NOT NULL,
  texto_relacion TEXT,
  fecha_relacion DATE,
  hash TEXT UNIQUE NOT NULL,
  raw_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas por hash (evitar duplicados)
CREATE INDEX IF NOT EXISTS idx_boe_changes_hash ON boe_changes(hash);

-- Índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_boe_changes_created_at ON boe_changes(created_at DESC);

-- Índice para búsquedas por norma base
CREATE INDEX IF NOT EXISTS idx_boe_changes_norma_base ON boe_changes(norma_base_id);

-- Tabla para normas vigiladas
CREATE TABLE IF NOT EXISTS watched_norms (
  id TEXT PRIMARY KEY,
  alias TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar LOPIVI como norma vigilada
INSERT INTO watched_norms(id, alias, enabled)
VALUES ('BOE-A-2021-9347', 'LOPIVI', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Tabla para logs de ejecución
CREATE TABLE IF NOT EXISTS boe_execution_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  execution_time TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL,
  changes_found INTEGER DEFAULT 0,
  error_message TEXT,
  execution_duration_ms INTEGER,
  normas_checked INTEGER DEFAULT 0
);

-- Índice para búsquedas por tiempo de ejecución
CREATE INDEX IF NOT EXISTS idx_boe_execution_logs_time ON boe_execution_logs(execution_time DESC);

-- Índice para búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_boe_execution_logs_status ON boe_execution_logs(status);

-- Comentarios en las tablas
COMMENT ON TABLE boe_changes IS 'Almacena todos los cambios detectados en las normas vigiladas del BOE';
COMMENT ON TABLE watched_norms IS 'Lista de normas del BOE que se monitorizan automáticamente';
COMMENT ON TABLE boe_execution_logs IS 'Registra todas las ejecuciones del sistema de monitoreo';

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para watched_norms
CREATE TRIGGER update_watched_norms_updated_at
    BEFORE UPDATE ON watched_norms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Activar si es necesario
-- ALTER TABLE boe_changes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE watched_norms ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE boe_execution_logs ENABLE ROW LEVEL SECURITY;

-- Vista para estadísticas rápidas
CREATE OR REPLACE VIEW boe_monitoring_stats AS
SELECT
  (SELECT COUNT(*) FROM boe_changes) as total_cambios,
  (SELECT COUNT(*) FROM boe_changes WHERE created_at >= NOW() - INTERVAL '30 days') as cambios_ultimo_mes,
  (SELECT COUNT(*) FROM watched_norms WHERE enabled = TRUE) as normas_activas,
  (SELECT MAX(execution_time) FROM boe_execution_logs) as ultima_ejecucion,
  (SELECT AVG(execution_duration_ms) FROM boe_execution_logs WHERE status = 'success') as duracion_promedio_ms;

COMMENT ON VIEW boe_monitoring_stats IS 'Estadísticas rápidas del sistema de monitoreo BOE';
