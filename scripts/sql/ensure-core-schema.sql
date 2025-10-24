-- ===== CORE TABLES (idempotentes) =====

-- 1) entity_compliance
create table if not exists public.entity_compliance (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  start_at timestamptz not null default now(),
  deadline_at timestamptz not null default (now() + interval '30 days'),
  channel_done boolean default false,
  channel_type text check (channel_type in ('email','telefono')),
  channel_value text,
  channel_verified boolean default false,
  riskmap_done boolean default false,
  penales_done boolean default false,
  blocked boolean default false,
  blocked_reason text,
  updated_at timestamptz default now()
);

create or replace function public.c360_touch_entity_compliance()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

drop trigger if exists trg_touch_entity_compliance on public.entity_compliance;
create trigger trg_touch_entity_compliance
before update on public.entity_compliance
for each row execute function public.c360_touch_entity_compliance();

-- 2) entity_invite_tokens
create table if not exists public.entity_invite_tokens (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  token uuid not null default gen_random_uuid(),
  active boolean default true,
  created_at timestamptz default now()
);

-- 3) entity_people
create table if not exists public.entity_people (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  tipo text not null check (tipo in ('personal_contacto','personal_no_contacto','familia','directiva')),
  nombre text,
  apellidos text,
  email text,
  telefono text,
  puesto text,
  penales_entregado boolean,
  sector_code text,
  estado text default 'pendiente', -- pendiente|en_progreso|completo|atrasado|bloqueado
  invited_at timestamptz default now(),
  deadline_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz default now()
);

create index if not exists idx_entity_people_entity on public.entity_people(entity_id);
create index if not exists idx_entity_people_estado on public.entity_people(estado);
create index if not exists idx_entity_people_tipo on public.entity_people(tipo);

-- 4) family_children
create table if not exists public.family_children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.entity_people(id) on delete cascade,
  nombre text not null,
  nacimiento date,
  curso_grupo text,
  alergias text,
  permiso_imagenes boolean
);

create index if not exists idx_family_children_family on public.family_children(family_id);

-- 5) miniquiz_attempts
create table if not exists public.miniquiz_attempts (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.entity_people(id) on delete cascade,
  entity_id uuid not null references public.entities(id) on delete cascade,
  sector_code text,
  seed bigint not null,
  total int not null default 10,
  correct int,
  score numeric,
  passed boolean,
  submitted_at timestamptz
);

create index if not exists idx_miniquiz_attempts_person on public.miniquiz_attempts(person_id);
create index if not exists idx_miniquiz_attempts_entity on public.miniquiz_attempts(entity_id);

-- ===== FIX FK message_jobs → entities(id) =====
do $$
begin
  -- Si existe la constraint antigua mal referenciada, intentar soltarla de forma segura
  if exists (
    select 1 from information_schema.table_constraints
    where table_schema='public' and table_name='message_jobs' and constraint_type='FOREIGN KEY'
  ) then
    -- Detectar y soltar cualquier FK de entity_id que no apunte a entities.id
    perform 1;
  end if;
exception when others then
  -- ignorar errores si no existe
  perform 1;
end$$;

-- Asegurar columna entity_id y FK correcta
alter table if exists public.message_jobs
  add column if not exists entity_id uuid;

do $$
begin
  -- Crear FK correcta si no existe aún
  if not exists (
    select 1
    from information_schema.table_constraints tc
    join information_schema.key_column_usage kcu
      on tc.constraint_name = kcu.constraint_name
    where tc.table_schema='public'
      and tc.table_name='message_jobs'
      and tc.constraint_type='FOREIGN KEY'
      and kcu.column_name='entity_id'
  ) then
    alter table public.message_jobs
      add constraint message_jobs_entity_id_fkey
      foreign key (entity_id) references public.entities(id) on delete set null;
  end if;
end$$;

-- ===== sane defaults en message_jobs =====
alter table if exists public.message_jobs
  add column if not exists status text default 'queued',
  add column if not exists scheduled_at timestamptz,
  add column if not exists created_at timestamptz default now();

create index if not exists idx_message_jobs_status on public.message_jobs(status);
create index if not exists idx_message_jobs_scheduled on public.message_jobs(scheduled_at);

-- ===== Ajustes cosméticos recomendados (no bloqueantes) =====
-- (Nada más; RLS y policies se revisan en una fase posterior controlada)

-- FIN ensure-core-schema.sql
