-- ============================================================
-- CUSTODIA360 - LIMPIEZA SEGURA DE DATOS DE PRUEBA
-- ============================================================
-- Este script elimina datos de prueba de forma segura
-- SIN afectar datos reales de producción
-- ============================================================

-- 1. Borrar message_jobs con dry_run=true (emails de prueba)
DELETE FROM message_jobs
WHERE context->>'dry_run' = 'true';

-- 2. Borrar tokens de invitación expirados e inactivos
DELETE FROM entity_invite_tokens
WHERE active = false
  AND (expires_at IS NULL OR expires_at < NOW());

-- 3. Borrar entidades marcadas como "test" o "audit" (patron seguro)
-- IMPORTANTE: Solo borra si el nombre empieza con estos patrones exactos
DELETE FROM entities
WHERE nombre ILIKE 'test%'
   OR nombre ILIKE 'audit%'
   OR nombre ILIKE 'demo%'
   OR nombre ILIKE 'e2e%';

-- 4. Limpiar logs de health antiguos (mantener últimos 30 días)
DELETE FROM admin_health_logs
WHERE created_at < NOW() - INTERVAL '30 days';

-- 5. Limpiar email_events antiguos (mantener últimos 90 días)
DELETE FROM email_events
WHERE created_at < NOW() - INTERVAL '90 days';

-- 6. Limpiar intentos de quiz antiguos (mantener últimos 180 días)
DELETE FROM miniquiz_attempts
WHERE created_at < NOW() - INTERVAL '180 days';

-- ============================================================
-- VERIFICACIÓN POST-LIMPIEZA
-- ============================================================

DO $$
DECLARE
  count_entities INT;
  count_jobs INT;
  count_tokens INT;
BEGIN
  SELECT COUNT(*) INTO count_entities FROM entities;
  SELECT COUNT(*) INTO count_jobs FROM message_jobs;
  SELECT COUNT(*) INTO count_tokens FROM entity_invite_tokens WHERE active = true;

  RAISE NOTICE '✅ Limpieza completada';
  RAISE NOTICE '📊 Entidades restantes: %', count_entities;
  RAISE NOTICE '📧 Jobs de email pendientes: %', count_jobs;
  RAISE NOTICE '🎟️ Tokens activos: %', count_tokens;
END $$;
