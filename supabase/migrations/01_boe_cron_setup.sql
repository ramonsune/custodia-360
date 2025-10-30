-- ============================================================
-- CONFIGURACIÓN CRON SEMANAL - MONITOREO BOE
-- Ejecuta verificación cada lunes a las 09:00 (Europe/Madrid)
-- ============================================================

-- Habilitar extensión pg_cron si no está habilitada
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Eliminar job anterior si existe (para evitar duplicados)
SELECT cron.unschedule('boe-check-semanal') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'boe-check-semanal'
);

-- Programar ejecución semanal: Cada lunes a las 09:00 (hora Madrid)
-- CRON: '0 8 * * 1' = Lunes 08:00 UTC (09:00 Madrid UTC+1)
-- Nota: Ajustar a '0 7 * * 1' en horario de verano (UTC+2)
SELECT cron.schedule(
  'boe-check-semanal',
  '0 8 * * 1',
  $$
  SELECT
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/c360_boe_check',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key')
      ),
      body := jsonb_build_object(
        'scheduled', true,
        'source', 'pg_cron'
      )
    ) as request_id;
  $$
);

-- Verificar que el job se ha creado correctamente
SELECT
  jobid,
  schedule,
  command,
  nodename,
  nodeport,
  database,
  username,
  active,
  jobname
FROM cron.job
WHERE jobname = 'boe-check-semanal';

-- Comentario para referencia
COMMENT ON EXTENSION pg_cron IS 'Programador de tareas cron para PostgreSQL - Usado para monitoreo BOE semanal';

-- Notas:
-- - El horario '0 8 * * 1' es 08:00 UTC = 09:00 Madrid (UTC+1 invierno)
-- - En horario de verano (UTC+2), cambiar a '0 7 * * 1'
-- - Para ejecutar manualmente: SELECT cron.schedule('job_name', ...);
-- - Para pausar: SELECT cron.unschedule('boe-check-semanal');
