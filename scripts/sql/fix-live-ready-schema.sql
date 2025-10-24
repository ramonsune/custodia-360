-- Habilitar extensiones necesarias
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-----------------------------
-- A) entity_compliance
-----------------------------
-- A.1 añadir columna id si falta
alter table if exists public.entity_compliance
  add column if not exists id uuid default gen_random_uuid();

-- A.2 garantizar columnas funcionales
alter table if exists public.entity_compliance
  add column if not exists entity_id uuid,
  add column if not exists channel_done boolean default false,
  add column if not exists channel_type text,
  add column if not exists channel_value text,
  add column if not exists riskmap_done boolean default false,
  add column if not exists penales_done boolean default false,
  add column if not exists deadline_at timestamptz,
  add column if not exists blocked boolean default false,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

-- A.3 PK si no existe
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.entity_compliance'::regclass
      and contype = 'p'
  ) then
    alter table public.entity_compliance
      add constraint entity_compliance_pkey primary key (id);
  end if;
end$$;

-- A.4 FK + unique por entidad
do $$
begin
  -- unique por entidad (1 fila por entity_id)
  if not exists (
    select 1 from pg_constraint
    where conname = 'entity_compliance_entity_id_key'
  ) then
    alter table public.entity_compliance
      add constraint entity_compliance_entity_id_key unique (entity_id);
  end if;
exception when others then null;
end$$;

alter table if exists public.entity_compliance
  add constraint entity_compliance_entity_id_fkey
  foreign key (entity_id) references public.entities(id) on delete cascade;

-- trigger de updated_at
create or replace function public.touch_entity_compliance_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_touch_entity_compliance_updated_at'
  ) then
    create trigger trg_touch_entity_compliance_updated_at
    before update on public.entity_compliance
    for each row execute function public.touch_entity_compliance_updated_at();
  end if;
end$$;

-----------------------------
-- B) entity_invite_tokens
-----------------------------
alter table if exists public.entity_invite_tokens
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists entity_id uuid,
  add column if not exists token text,
  add column if not exists active boolean default true,
  add column if not exists expires_at timestamptz,
  add column if not exists created_at timestamptz default now();

-- PK si falta
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.entity_invite_tokens'::regclass
      and contype = 'p'
  ) then
    alter table public.entity_invite_tokens
      add constraint entity_invite_tokens_pkey primary key (id);
  end if;
end$$;

-- FK y unique sobre token
alter table if exists public.entity_invite_tokens
  add constraint entity_invite_tokens_entity_id_fkey
  foreign key (entity_id) references public.entities(id) on delete cascade;

create unique index if not exists entity_invite_tokens_token_uidx
  on public.entity_invite_tokens (token);

-----------------------------
-- C) email_events (crear si no existe)
-----------------------------
create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,             -- email.sent / delivered / opened / clicked / failed
  email_id text,
  to_email text,
  from_email text,
  subject text,
  timestamp timestamptz,
  error text,
  raw_data jsonb
);
create index if not exists email_events_created_at_idx
  on public.email_events (created_at desc);

alter table public.email_events enable row level security;
drop policy if exists server_only_all on public.email_events;
create policy server_only_all on public.email_events
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-----------------------------
-- D) subscriptions (crear si no existe)
-----------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  price_id text,
  status text, -- trialing / active / past_due / canceled / incomplete...
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_end timestamptz,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_entity_idx
  on public.subscriptions(entity_id);

-- trigger updated_at
create or replace function public.touch_subscriptions_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_touch_subscriptions_updated_at'
  ) then
    create trigger trg_touch_subscriptions_updated_at
    before update on public.subscriptions
    for each row execute function public.touch_subscriptions_updated_at();
  end if;
end$$;

-----------------------------
-- E) RLS server-only para tablas nuevas
-----------------------------
alter table if exists public.subscriptions enable row level security;
drop policy if exists server_only_all on public.subscriptions;
create policy server_only_all on public.subscriptions
  for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-----------------------------
-- F) sanity checks rápidos
-----------------------------
-- asegurar que hay una fila por entity en entity_compliance (si falta, crear vacía)
insert into public.entity_compliance (entity_id)
select e.id from public.entities e
left join public.entity_compliance c on c.entity_id = e.id
where c.entity_id is null;

-- fin SQL
------------------------------------------------------------
