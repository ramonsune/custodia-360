-- ===== EMAIL EVENTS TABLE (idempotente) =====
-- Captura de eventos de Resend: delivered, bounced, complaint, opened, clicked, etc.

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  provider text not null default 'resend',
  message_id text,
  event text not null,                 -- delivered|bounced|complaint|opened|clicked|queued|failed
  to_email text,
  from_email text,
  subject text,
  entity_id uuid references public.entities(id) on delete set null,
  template_slug text,
  meta jsonb                           -- payload completo/minimizado
);

create index if not exists idx_email_events_event on public.email_events(event);
create index if not exists idx_email_events_entity on public.email_events(entity_id);
create index if not exists idx_email_events_created on public.email_events(created_at);
create index if not exists idx_email_events_to_email on public.email_events(to_email);

-- RLS server-only (mismo patrón que usamos)
alter table public.email_events enable row level security;

drop policy if exists server_only_all on public.email_events;

create policy server_only_all on public.email_events
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- FIN email-events.sql

-- ===== INSTRUCCIONES =====
-- 1. Ejecutar este SQL en Supabase SQL Editor
-- 2. Configurar webhook en Resend Dashboard:
--    URL: https://www.custodia360.es/api/webhooks/resend
--    Eventos: email.delivered, email.bounced, email.complained, email.opened, email.clicked
-- 3. (Opcional) Activar signing secret y verificar firma en webhook endpoint
