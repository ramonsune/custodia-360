-- ============================================================
-- SISTEMA DE ONBOARDING - CUSTODIA360
-- Portal de incorporación de miembros por roles
-- ============================================================

-- Token de invitación único por entidad
create table if not exists entity_invite_tokens (
  entity_id uuid primary key references entities(id) on delete cascade,
  token uuid not null default gen_random_uuid(),
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índice para búsqueda rápida por token
create index if not exists idx_invite_token on entity_invite_tokens(token) where active = true;

-- Personas que completan el onboarding
create table if not exists entity_people (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid references entities(id) on delete cascade,
  tipo text not null check (tipo in ('personal_contacto','personal_no_contacto','familia','directiva')),
  nombre text,
  apellidos text,
  email text,
  telefono text,
  puesto text,
  cargo text, -- para directiva
  penales_entregado boolean default false,
  sector_code text,
  estado text default 'pendiente' check (estado in ('pendiente','en_progreso','completo','atrasado','bloqueado')),
  invited_at timestamptz default now(),
  deadline_at timestamptz default (now() + interval '30 days'),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_people_entity on entity_people(entity_id);
create index if not exists idx_people_estado on entity_people(estado);
create index if not exists idx_people_tipo on entity_people(tipo);
create index if not exists idx_people_deadline on entity_people(deadline_at) where estado != 'completo';

-- Hijos de familias/tutores
create table if not exists family_children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references entity_people(id) on delete cascade,
  nombre text not null,
  nacimiento date,
  curso_grupo text,
  alergias text,
  permiso_imagenes boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_children_family on family_children(family_id);

-- Banco de preguntas para quiz corto
create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  is_general boolean default false,
  sector_code text,
  active boolean default true,
  created_at timestamptz default now()
);

create index if not exists idx_questions_sector on quiz_questions(sector_code) where active = true;
create index if not exists idx_questions_general on quiz_questions(is_general) where active = true;

-- Respuestas del banco de preguntas
create table if not exists quiz_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references quiz_questions(id) on delete cascade,
  text text not null,
  is_correct boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_answers_question on quiz_answers(question_id);

-- Intentos de quiz corto (10 preguntas)
create table if not exists miniquiz_attempts (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references entity_people(id) on delete cascade,
  entity_id uuid references entities(id) on delete cascade,
  sector_code text,
  seed bigint not null,
  total int default 10,
  correct int,
  score numeric,
  passed boolean,
  answers jsonb, -- Guarda respuestas del usuario
  submitted_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists idx_miniquiz_person on miniquiz_attempts(person_id);
create index if not exists idx_miniquiz_entity on miniquiz_attempts(entity_id);

-- Configuración del test corto
create table if not exists quiz_settings_short (
  id boolean primary key default true,
  total int not null default 10,
  pass_threshold numeric not null default 0.75,
  updated_at timestamptz default now()
);

insert into quiz_settings_short(id) values (true) on conflict (id) do nothing;

-- Notificaciones para el panel del delegado
create table if not exists onboarding_notifications (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid references entities(id) on delete cascade,
  person_id uuid references entity_people(id) on delete cascade,
  tipo text not null check (tipo in ('delay','missing_penales','completed','blocked')),
  mensaje text not null,
  read boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_notif_entity on onboarding_notifications(entity_id);
create index if not exists idx_notif_unread on onboarding_notifications(entity_id, read) where read = false;

-- ============================================================
-- FUNCIONES
-- ============================================================

-- Crear o recuperar token de invitación para una entidad
create or replace function create_entity_invite_token(eid uuid)
returns uuid language plpgsql as $$
declare
  tok uuid;
begin
  insert into entity_invite_tokens(entity_id)
  values (eid)
  on conflict (entity_id) do update
  set updated_at = now()
  returning token into tok;

  return tok;
end$$;

-- Verificar validez de token
create or replace function verify_invite_token(eid uuid, tok uuid)
returns boolean language plpgsql as $$
begin
  return exists(
    select 1 from entity_invite_tokens
    where entity_id = eid
    and token = tok
    and active = true
  );
end$$;

-- Marcar persona como atrasada si superó deadline
create or replace function mark_overdue_people()
returns void language plpgsql as $$
begin
  update entity_people
  set estado = 'atrasado',
      updated_at = now()
  where deadline_at < now()
    and estado not in ('completo', 'atrasado', 'bloqueado');
end$$;

-- Obtener estadísticas de onboarding para una entidad
create or replace function get_onboarding_stats(eid uuid)
returns jsonb language plpgsql as $$
declare
  stats jsonb;
begin
  select jsonb_build_object(
    'total', count(*),
    'completo', count(*) filter (where estado = 'completo'),
    'pendiente', count(*) filter (where estado = 'pendiente'),
    'en_progreso', count(*) filter (where estado = 'en_progreso'),
    'atrasado', count(*) filter (where estado = 'atrasado'),
    'bloqueado', count(*) filter (where estado = 'bloqueado'),
    'por_tipo', jsonb_object_agg(
      tipo,
      jsonb_build_object(
        'total', tipo_count,
        'completo', tipo_completo
      )
    )
  ) into stats
  from (
    select
      tipo,
      count(*) as tipo_count,
      count(*) filter (where estado = 'completo') as tipo_completo
    from entity_people
    where entity_id = eid
    group by tipo
  ) t;

  return coalesce(stats, '{}'::jsonb);
end$$;

-- ============================================================
-- DATOS DE EJEMPLO - PREGUNTAS QUIZ
-- ============================================================

-- Preguntas generales (aplican a todos los sectores)
insert into quiz_questions (text, is_general, active) values
('¿Cuál es el objetivo principal de la Ley LOPIVI?', true, true),
('¿Qué debe hacer un adulto si un menor le cuenta que sufre violencia?', true, true),
('¿Es correcto compartir fotos de menores en redes sociales sin autorización?', true, true),
('¿Quién es el responsable de proteger a los menores en una entidad?', true, true),
('¿Qué significa "buen trato" en el contexto de protección infantil?', true, true)
on conflict do nothing;

-- Respuestas para pregunta 1
insert into quiz_answers (question_id, text, is_correct)
select id, 'Proteger a los menores de cualquier forma de violencia', true
from quiz_questions where text = '¿Cuál es el objetivo principal de la Ley LOPIVI?'
union all
select id, 'Regular el uso de internet por menores', false
from quiz_questions where text = '¿Cuál es el objetivo principal de la Ley LOPIVI?'
union all
select id, 'Aumentar las penas por delitos contra menores', false
from quiz_questions where text = '¿Cuál es el objetivo principal de la Ley LOPIVI?'
union all
select id, 'Controlar las actividades de ocio de menores', false
from quiz_questions where text = '¿Cuál es el objetivo principal de la Ley LOPIVI?';

-- Respuestas para pregunta 2
insert into quiz_answers (question_id, text, is_correct)
select id, 'Escuchar sin juzgar e informar al delegado de protección', true
from quiz_questions where text = '¿Qué debe hacer un adulto si un menor le cuenta que sufre violencia?'
union all
select id, 'Confrontar al presunto agresor inmediatamente', false
from quiz_questions where text = '¿Qué debe hacer un adulto si un menor le cuenta que sufre violencia?'
union all
select id, 'No hacer nada para no causar problemas', false
from quiz_questions where text = '¿Qué debe hacer un adulto si un menor le cuenta que sufre violencia?'
union all
select id, 'Pedirle detalles exhaustivos para investigar', false
from quiz_questions where text = '¿Qué debe hacer un adulto si un menor le cuenta que sufre violencia?';

-- Respuestas para pregunta 3
insert into quiz_answers (question_id, text, is_correct)
select id, 'No, nunca sin autorización expresa de los tutores', true
from quiz_questions where text = '¿Es correcto compartir fotos de menores en redes sociales sin autorización?'
union all
select id, 'Sí, si las fotos son de actividades educativas', false
from quiz_questions where text = '¿Es correcto compartir fotos de menores en redes sociales sin autorización?'
union all
select id, 'Sí, si no se ve la cara del menor', false
from quiz_questions where text = '¿Es correcto compartir fotos de menores en redes sociales sin autorización?'
union all
select id, 'Depende de la red social utilizada', false
from quiz_questions where text = '¿Es correcto compartir fotos de menores en redes sociales sin autorización?';

-- Respuestas para pregunta 4
insert into quiz_answers (question_id, text, is_correct)
select id, 'Todo el personal de la entidad', true
from quiz_questions where text = '¿Quién es el responsable de proteger a los menores en una entidad?'
union all
select id, 'Solo el delegado de protección', false
from quiz_questions where text = '¿Quién es el responsable de proteger a los menores en una entidad?'
union all
select id, 'Solo los padres y tutores', false
from quiz_questions where text = '¿Quién es el responsable de proteger a los menores en una entidad?'
union all
select id, 'Solo el director de la entidad', false
from quiz_questions where text = '¿Quién es el responsable de proteger a los menores en una entidad?';

-- Respuestas para pregunta 5
insert into quiz_answers (question_id, text, is_correct)
select id, 'Relación basada en el respeto, dignidad y derechos del menor', true
from quiz_questions where text = '¿Qué significa "buen trato" en el contexto de protección infantil?'
union all
select id, 'Ser permisivo y no establecer límites', false
from quiz_questions where text = '¿Qué significa "buen trato" en el contexto de protección infantil?'
union all
select id, 'Evitar cualquier tipo de contacto físico', false
from quiz_questions where text = '¿Qué significa "buen trato" en el contexto de protección infantil?'
union all
select id, 'Darles todo lo que pidan para que estén contentos', false
from quiz_questions where text = '¿Qué significa "buen trato" en el contexto de protección infantil?';

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Trigger para actualizar updated_at automáticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_entity_people_updated_at before update on entity_people
  for each row execute function update_updated_at_column();

create trigger update_invite_tokens_updated_at before update on entity_invite_tokens
  for each row execute function update_updated_at_column();

-- ============================================================
-- PERMISOS (ajustar según política de seguridad)
-- ============================================================

-- Las políticas RLS se configurarán según necesidades específicas
-- Por ahora, acceso a través de service role desde APIs
