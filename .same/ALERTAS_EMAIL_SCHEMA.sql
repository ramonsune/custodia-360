-- ====================================
-- SCHEMA SQL - ALERTAS LOPIVI POR EMAIL
-- ====================================
-- Fecha: ${new Date().toISOString()}
-- Proyecto: Custodia360
-- Módulo: Sistema de Alertas LOPIVI

-- ====================================
-- 1. TABLA: lopivi_news
-- ====================================
-- Almacena noticias y alertas LOPIVI recibidas por email o manualmente

CREATE TABLE IF NOT EXISTS lopivi_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,                 -- 'email:golee' | 'manual' | 'rss:google' | 'email:unknown'
  title text NOT NULL,
  url text,
  published_at timestamptz,
  summary text,
  hash text NOT NULL,                   -- sha256(title|url|published_at) para deduplicación
  raw jsonb,                            -- almacenamiento crudo (asunto, from, body, enlaces detectados)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índice único para deduplicación por hash
CREATE UNIQUE INDEX IF NOT EXISTS ux_lopivi_news_hash ON lopivi_news(hash);

-- Índices para búsqueda y filtrado
CREATE INDEX IF NOT EXISTS ix_lopivi_news_source ON lopivi_news(source);
CREATE INDEX IF NOT EXISTS ix_lopivi_news_published_at ON lopivi_news(published_at DESC);
CREATE INDEX IF NOT EXISTS ix_lopivi_news_created_at ON lopivi_news(created_at DESC);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_lopivi_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_lopivi_news_updated_at
  BEFORE UPDATE ON lopivi_news
  FOR EACH ROW
  EXECUTE FUNCTION update_lopivi_news_updated_at();

-- Comentarios
COMMENT ON TABLE lopivi_news IS 'Almacena alertas y noticias LOPIVI recibidas por email o ingresadas manualmente';
COMMENT ON COLUMN lopivi_news.source IS 'Origen: email:golee, manual, rss:google, email:unknown';
COMMENT ON COLUMN lopivi_news.hash IS 'SHA256(title|url|published_at) para deduplicación';
COMMENT ON COLUMN lopivi_news.raw IS 'Datos crudos: {subject, from, text, html, messageId, links, etc}';

-- ====================================
-- 2. TABLA: audit_events
-- ====================================
-- Auditoría de eventos del sistema (si no existe)

CREATE TABLE IF NOT EXISTS audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area text NOT NULL,                   -- 'boe' | 'email' | 'news' | 'system'
  event_type text NOT NULL,             -- 'ingest.manual' | 'ingest.webhook' | 'notify.sent' | 'change.detected' | etc.
  level text DEFAULT 'INFO',            -- 'INFO' | 'WARN' | 'ERROR'
  payload jsonb,                        -- Datos del evento (flexible)
  created_at timestamptz DEFAULT now()
);

-- Índices para consultas de auditoría
CREATE INDEX IF NOT EXISTS ix_audit_events_area ON audit_events(area);
CREATE INDEX IF NOT EXISTS ix_audit_events_event_type ON audit_events(event_type);
CREATE INDEX IF NOT EXISTS ix_audit_events_level ON audit_events(level);
CREATE INDEX IF NOT EXISTS ix_audit_events_created_at ON audit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS ix_audit_events_area_type ON audit_events(area, event_type);

-- Comentarios
COMMENT ON TABLE audit_events IS 'Registro de auditoría de eventos del sistema';
COMMENT ON COLUMN audit_events.area IS 'Área del sistema: boe, email, news, system';
COMMENT ON COLUMN audit_events.event_type IS 'Tipo de evento específico';
COMMENT ON COLUMN audit_events.level IS 'Nivel de severidad: INFO, WARN, ERROR';

-- ====================================
-- 3. TABLA: boe_changes
-- ====================================
-- Historial de verificaciones del BOE

CREATE TABLE IF NOT EXISTS boe_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,                    -- URL del documento BOE monitoreado
  etag text,                            -- ETag del response HTTP
  last_modified text,                   -- Last-Modified del response HTTP
  content_hash text NOT NULL,           -- SHA256 del contenido HTML
  changed boolean DEFAULT false,        -- true si se detectó un cambio
  method text,                          -- 'etag' | 'last-modified' | 'content-hash'
  previous_hash text,                   -- Hash anterior (si changed=true)
  created_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS ix_boe_changes_url ON boe_changes(url);
CREATE INDEX IF NOT EXISTS ix_boe_changes_created_at ON boe_changes(created_at DESC);
CREATE INDEX IF NOT EXISTS ix_boe_changes_changed ON boe_changes(changed) WHERE changed = true;

-- Comentarios
COMMENT ON TABLE boe_changes IS 'Historial de verificaciones del BOE para detectar cambios en la LOPIVI';
COMMENT ON COLUMN boe_changes.changed IS 'true si se detectó un cambio real en el contenido';
COMMENT ON COLUMN boe_changes.method IS 'Método de detección: etag, last-modified, content-hash';

-- ====================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ====================================

-- Habilitar RLS en las tablas
ALTER TABLE lopivi_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE boe_changes ENABLE ROW LEVEL SECURITY;

-- Políticas: Por defecto denegar todo
-- Las inserts/updates se harán desde endpoints server-side con service_role_key

-- Política para service_role (puede hacer todo)
CREATE POLICY "Service role can do everything on lopivi_news"
  ON lopivi_news
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on audit_events"
  ON audit_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on boe_changes"
  ON boe_changes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Política para admin autenticados (lectura)
-- TODO: Ajustar según tu sistema de autenticación
CREATE POLICY "Authenticated admins can read lopivi_news"
  ON lopivi_news
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can read audit_events"
  ON audit_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can read boe_changes"
  ON boe_changes
  FOR SELECT
  TO authenticated
  USING (true);

-- ====================================
-- 5. FUNCIONES ÚTILES
-- ====================================

-- Función para limpiar alertas antiguas (>6 meses)
CREATE OR REPLACE FUNCTION cleanup_old_lopivi_news(months_old integer DEFAULT 6)
RETURNS TABLE(deleted_count bigint) AS $$
BEGIN
  WITH deleted AS (
    DELETE FROM lopivi_news
    WHERE created_at < now() - (months_old || ' months')::interval
    RETURNING id
  )
  SELECT count(*) FROM deleted INTO deleted_count;

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_lopivi_news IS 'Elimina alertas LOPIVI más antiguas que X meses (por defecto 6)';

-- Función para limpiar eventos de auditoría antiguos (>3 meses)
CREATE OR REPLACE FUNCTION cleanup_old_audit_events(months_old integer DEFAULT 3)
RETURNS TABLE(deleted_count bigint) AS $$
BEGIN
  WITH deleted AS (
    DELETE FROM audit_events
    WHERE created_at < now() - (months_old || ' months')::interval
    AND level = 'INFO'  -- Solo eliminar eventos INFO, mantener WARN y ERROR
    RETURNING id
  )
  SELECT count(*) FROM deleted INTO deleted_count;

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_audit_events IS 'Elimina eventos de auditoría INFO más antiguos que X meses (por defecto 3)';

-- ====================================
-- 6. GRANTS
-- ====================================

-- Asegurar que service_role puede usar las tablas
GRANT ALL ON lopivi_news TO service_role;
GRANT ALL ON audit_events TO service_role;
GRANT ALL ON boe_changes TO service_role;

-- Permitir lectura a usuarios autenticados
GRANT SELECT ON lopivi_news TO authenticated;
GRANT SELECT ON audit_events TO authenticated;
GRANT SELECT ON boe_changes TO authenticated;

-- ====================================
-- 7. VERIFICACIÓN
-- ====================================

-- Verificar que las tablas se crearon correctamente
DO $$
BEGIN
  RAISE NOTICE 'Verificando tablas creadas...';

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lopivi_news') THEN
    RAISE NOTICE '✅ Tabla lopivi_news creada';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_events') THEN
    RAISE NOTICE '✅ Tabla audit_events creada';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'boe_changes') THEN
    RAISE NOTICE '✅ Tabla boe_changes creada';
  END IF;
END $$;

-- ====================================
-- FIN DEL SCHEMA
-- ====================================
