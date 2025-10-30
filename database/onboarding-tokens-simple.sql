-- ============================================================
-- TABLA DE TOKENS DE INVITACIÓN (SIN FUNCIONES SQL)
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

-- Trigger para actualizar updated_at automáticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_invite_tokens_updated_at before update on entity_invite_tokens
  for each row execute function update_updated_at_column();

-- Comentarios
comment on table entity_invite_tokens is 'Tokens únicos de invitación para el portal de onboarding de cada entidad';
comment on column entity_invite_tokens.entity_id is 'Entidad propietaria del token';
comment on column entity_invite_tokens.token is 'Token UUID único para compartir';
comment on column entity_invite_tokens.active is 'Si el token está activo (se puede desactivar para rotarlo)';
