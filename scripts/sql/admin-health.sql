-- ===== ADMIN HEALTH LOGS TABLE (idempotente) =====
-- Registros de auditorías diarias del sistema

create table if not exists public.admin_health_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  scope text not null default 'daily_audit',
  status text not null,                    -- 'ok' | 'warn' | 'fail'
  summary text not null,                   -- resumen corto
  details jsonb not null,                  -- resultado estructurado
  markdown text                            -- render del informe
);

-- Índice por fecha
create index if not exists admin_health_logs_created_at_idx on public.admin_health_logs(created_at desc);

-- RLS server-only
alter table public.admin_health_logs enable row level security;

drop policy if exists server_only_all on public.admin_health_logs;

create policy server_only_all on public.admin_health_logs
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ===== EMAIL EVENTS TABLE (actualizar si existe, crear si no) =====
-- Asegurar que tiene las columnas necesarias para el webhook

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  event_type text not null,
  email_id text,
  to_email text,
  from_email text,
  subject text,
  timestamp timestamptz,
  error text,
  raw_data jsonb
);

-- Índices
create unique index if not exists email_events_email_id_idx on public.email_events(email_id) where email_id is not null;
create index if not exists email_events_event_type_idx on public.email_events(event_type);
create index if not exists email_events_to_email_idx on public.email_events(to_email);
create index if not exists email_events_created_at_idx on public.email_events(created_at desc);

-- RLS server-only
alter table public.email_events enable row level security;

drop policy if exists server_only_all on public.email_events;

create policy server_only_all on public.email_events
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- FIN admin-health.sql
