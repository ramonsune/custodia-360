-- ============================================================
-- SISTEMA DE COMPLIANCE Y CONFIGURACIÓN OBLIGATORIA
-- Para el panel del delegado principal
-- ============================================================

-- Añadir campos a entities para canal de comunicación y contratante
alter table entities add column if not exists canal_tipo text check (canal_tipo in ('email','telefono'));
alter table entities add column if not exists canal_valor text;
alter table entities add column if not exists canal_verificado boolean default false;
alter table entities add column if not exists canal_verificado_at timestamptz;
alter table entities add column if not exists contractor_email text; -- email del contratante

-- Estado de cumplimiento (ventana 30 días y bloqueo)
create table if not exists entity_compliance (
  entity_id uuid primary key references entities(id) on delete cascade,
  start_at timestamptz not null default now(),
  deadline_at timestamptz not null default (now() + interval '30 days'),
  channel_done boolean default false,
  channel_verified boolean default false,
  riskmap_done boolean default false,
  penales_done boolean default false,
  blocked boolean default false,
  blocked_reason text,
  metadata jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Trigger para actualizar updated_at
create or replace function c360_touch_entity_compliance()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

drop trigger if exists trg_touch_entity_compliance on entity_compliance;
create trigger trg_touch_entity_compliance before update on entity_compliance
for each row execute function c360_touch_entity_compliance();

-- Tabla efímera para verificaciones de canal
create table if not exists channel_verifications (
  token uuid primary key default gen_random_uuid(),
  entity_id uuid references entities(id) on delete cascade,
  email text not null,
  created_at timestamptz default now()
);

-- Log de notificaciones de bloqueo
create table if not exists compliance_notifications (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid references entities(id) on delete cascade,
  type text check (type in ('pre_block','blocked')) not null,
  sent_to text not null,
  sent_at timestamptz default now(),
  payload jsonb default '{}'::jsonb
);

-- Índices
create index if not exists idx_entity_compliance_deadline on entity_compliance(deadline_at) where blocked = false;
create index if not exists idx_channel_verifications_created on channel_verifications(created_at);

-- Limpiar verificaciones antiguas (>24h)
create or replace function cleanup_old_channel_verifications()
returns void language plpgsql as $$
begin
  delete from channel_verifications where created_at < now() - interval '24 hours';
end$$;

-- Función para iniciar compliance al certificar delegado
create or replace function c360_init_entity_compliance(p_entity_id uuid)
returns void language plpgsql as $$
begin
  insert into entity_compliance(entity_id, start_at, deadline_at)
  values (p_entity_id, now(), now() + interval '30 days')
  on conflict (entity_id) do nothing;
end$$;

-- Plantillas de email
insert into message_templates(slug, nombre, asunto, cuerpo) values
('channel-verify', 'Canal | Verificación email',
'Custodia360 | Verifica tu canal de comunicación',
'Hola {{entidad}},

Por favor verifica tu canal de comunicación haciendo clic aquí:
{{verify_url}}

Este canal aparecerá en todos los documentos y comunicaciones oficiales de tu entidad.

Gracias,
Equipo Custodia360
https://www.custodia360.es
Soporte: info@custodia360.es')
on conflict (slug) do update set
  nombre=excluded.nombre,
  asunto=excluded.asunto,
  cuerpo=excluded.cuerpo;

insert into message_templates(slug, nombre, asunto, cuerpo) values
('compliance-blocked', 'Cumplimiento | Bloqueo por requisitos no cumplidos',
'Custodia360 | Bloqueo de panel por requisitos LOPIVI pendientes',
'Hola {{responsable}},

Te informamos que la entidad {{entidad}} ha sido bloqueada por no completar en 30 días los siguientes requisitos obligatorios de la LOPIVI:

{{faltantes}}

El Delegado de Protección debe acceder a su panel y completar la sección "Configuración" para restablecer el acceso.

Para cualquier duda, contacta con soporte:
Email: info@custodia360.es
Web: https://www.custodia360.es

Equipo Custodia360')
on conflict (slug) do update set
  nombre=excluded.nombre,
  asunto=excluded.asunto,
  cuerpo=excluded.cuerpo;

-- Comentarios
comment on table entity_compliance is 'Control de cumplimiento de configuración obligatoria (30 días)';
comment on table channel_verifications is 'Tokens temporales para verificación de email del canal';
comment on table compliance_notifications is 'Log de notificaciones de bloqueo enviadas';
