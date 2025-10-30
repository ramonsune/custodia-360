-- ============================================================
-- CONFIGURACIÓN DE CRON JOBS - CUSTODIA360
-- Programa tareas automatizadas para envío de emails
-- ============================================================

-- IMPORTANTE: Los schedules de Supabase se configuran desde el Dashboard
-- Este archivo documenta la configuración necesaria

-- 1. DISPATCHER DE EMAILS (cada 10 minutos)
-- Nombre: c360_mailer_dispatch_cron
-- Edge Function: c360_mailer_dispatch
-- Cron: */10 * * * * (cada 10 minutos, UTC)
-- Descripción: Procesa la cola de emails pendientes y los envía vía Resend

-- 2. RECORDATORIOS DE FACTURACIÓN (diario a las 09:00 Madrid)
-- Nombre: c360_billing_reminders_cron
-- Edge Function: c360_billing_reminders
-- Cron: 0 8 * * * (08:00 UTC = 09:00 Madrid en horario estándar)
-- Descripción: Envía recordatorios a 5 y 11 meses

-- NOTA: Para crear los schedules, ejecutar en Supabase SQL Editor:
/*
select cron.schedule(
  'c360_mailer_dispatch_cron',
  '*/10 * * * *',
  $$
  select net.http_post(
      url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/c360_mailer_dispatch',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) as request_id;
  $$
);

select cron.schedule(
  'c360_billing_reminders_cron',
  '0 8 * * *',
  $$
  select net.http_post(
      url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/c360_billing_reminders',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) as request_id;
  $$
);
*/

-- Para verificar los cron jobs activos:
-- SELECT * FROM cron.job;

-- Para desactivar un cron job:
-- SELECT cron.unschedule('c360_mailer_dispatch_cron');

-- ============================================================
-- CAMPOS NECESARIOS EN ENTIDADES
-- ============================================================

-- Añadir campos si no existen
ALTER TABLE entidades
ADD COLUMN IF NOT EXISTS contract_start_at TIMESTAMPTZ;

-- Inicializar contract_start_at con created_at para entidades existentes
UPDATE entidades
SET contract_start_at = created_at
WHERE contract_start_at IS NULL;

-- Añadir índices para optimización
CREATE INDEX IF NOT EXISTS idx_entidades_contract_start ON entidades(contract_start_at);
CREATE INDEX IF NOT EXISTS idx_entidades_admin_email ON entidades(admin_email);

-- Comentarios para documentación
COMMENT ON COLUMN entidades.contract_start_at IS 'Fecha de inicio del contrato, usada para calcular recordatorios de facturación';
