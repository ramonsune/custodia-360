-- ===== HARDENING RLS - SERVER-ONLY ACCESS =====
-- Script idempotente para endurecer seguridad en tablas core
-- SOLO service_role (backend) puede operar en estas tablas
-- El frontend NUNCA accede directamente; toda I/O vía endpoints server

do $$
declare r record;
begin
  -- Listado de tablas core
  for r in select unnest(array[
    'entity_compliance',
    'entity_invite_tokens',
    'entity_people',
    'family_children',
    'miniquiz_attempts',
    'message_jobs'
  ]) as t loop

    -- Activar RLS
    execute format('alter table public.%I enable row level security;', r.t);

    -- Eliminar políticas previas con el mismo nombre (si existieran)
    begin
      execute format('drop policy if exists server_only_all on public.%I;', r.t);
    exception when others then
      null;
    end;

    -- Política única: solo service_role (server) puede operar
    execute format($p$
      create policy server_only_all on public.%I
      for all using (auth.role() = 'service_role')
      with check (auth.role() = 'service_role');
    $p$, r.t);

  end loop;
end$$;

-- NOTA:
-- El front NUNCA accederá directamente a estas tablas; toda I/O se hace por endpoints server con service_role.
-- Si más adelante se requiere acceso cliente por usuario/entidad, añadir políticas específicas en otro script.

-- FIN hardening-rls.sql
