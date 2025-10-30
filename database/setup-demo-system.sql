-- ============================================================================
-- CUSTODIA360 - CONFIGURACIÓN SISTEMA DEMO
-- ============================================================================
-- Fecha: 25 de Octubre 2025
-- Autor: SAME AI
-- Autorizado por: Usuario
-- ============================================================================
-- IMPORTANTE: Ejecutar con privilegios de service_role
-- ============================================================================

-- ============================================================================
-- PASO 1: BACKUP AUTOMÁTICO (registro en audit_log)
-- ============================================================================

-- Crear tabla audit_log si no existe
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  user_id uuid,
  metadata jsonb DEFAULT '{}'
);

-- Registrar inicio de operación
INSERT INTO public.audit_log (action, details)
VALUES ('demo.setup.started', '{"timestamp": "2025-10-25T17:00:00Z", "mode": "AUTOMATIC"}');

-- Nota: Los backups CSV se harán desde la UI de Supabase Dashboard
-- Exportar manualmente:
-- 1. auth.users → /backups/20251025-1700/auth_users.csv
-- 2. public.entities → /backups/20251025-1700/entities.csv
-- 3. public.entity_user_roles → /backups/20251025-1700/entity_user_roles.csv

-- ============================================================================
-- PASO 2: AÑADIR COLUMNAS is_demo SI NO EXISTEN
-- ============================================================================

-- Columna is_demo en entities
ALTER TABLE public.entities
ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

-- Columna is_demo en entity_user_roles (si existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='entity_user_roles') THEN
    ALTER TABLE public.entity_user_roles
    ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_entities_is_demo ON public.entities(is_demo);
CREATE INDEX IF NOT EXISTS idx_entity_user_roles_is_demo ON public.entity_user_roles(is_demo) WHERE is_demo = true;

-- Registrar modificación de schema
INSERT INTO public.audit_log (action, details)
VALUES ('demo.schema.altered', '{"columns_added": ["entities.is_demo", "entity_user_roles.is_demo"]}');

-- ============================================================================
-- PASO 3: DESHABILITAR USUARIOS @custodia.com ANTIGUOS
-- ============================================================================

-- Nota: Esta operación debe hacerse desde Supabase Auth Dashboard o Admin API
-- No se puede hacer directamente en SQL por seguridad de auth.users

-- Registrar usuarios a deshabilitar (query informativa)
DO $$
DECLARE
  v_users_to_disable jsonb;
BEGIN
  -- Lista de usuarios oficiales DEMO que NO deben deshabilitarse
  v_users_to_disable := (
    SELECT jsonb_agg(email)
    FROM auth.users
    WHERE email ILIKE '%@custodia.com'
      AND email NOT IN (
        'entidad@custodia.com',
        'delegado@custodia.com',
        'delegados@custodia.com',
        'ramon@custodia.com'
      )
  );

  -- Registrar en audit_log
  INSERT INTO public.audit_log (action, details)
  VALUES ('demo.cleanup.users_identified', jsonb_build_object('users_to_disable', v_users_to_disable));
END $$;

-- ============================================================================
-- PASO 4: CREAR ENTIDAD DEMO
-- ============================================================================

-- Insertar entidad DEMO (idempotente)
INSERT INTO public.entities (
  id,
  name,
  plan,
  is_demo,
  created_at,
  updated_at
)
VALUES (
  'DEMO-ENTITY-001',
  'CUSTODIA360_DEMO_ENTITY',
  'full',
  true,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  name = 'CUSTODIA360_DEMO_ENTITY',
  plan = 'full',
  is_demo = true,
  updated_at = now();

-- Registrar creación de entidad DEMO
INSERT INTO public.audit_log (action, details)
VALUES ('demo.entity.created', '{"entity_id": "DEMO-ENTITY-001", "name": "CUSTODIA360_DEMO_ENTITY"}');

-- ============================================================================
-- PASO 5: PREPARAR ROLES DEMO (tabla entity_user_roles)
-- ============================================================================

-- Crear tabla entity_user_roles si no existe
CREATE TABLE IF NOT EXISTS public.entity_user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id text NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('ENTIDAD', 'DELEGADO', 'SUPLENTE', 'ADMIN', 'MIEMBRO')),
  enabled boolean NOT NULL DEFAULT true,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(entity_id, user_id, role)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_entity_user_roles_entity ON public.entity_user_roles(entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_user_roles_user ON public.entity_user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_entity_user_roles_role ON public.entity_user_roles(role);

-- Nota: La asignación de roles se hará después de crear usuarios en Auth
-- Ver PASO 6 en script Node.js

-- ============================================================================
-- PASO 6: POLÍTICAS RLS PARA AISLAMIENTO DEMO
-- ============================================================================

-- Habilitar RLS en entities si no está habilitado
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;

-- Política: usuarios DEMO solo ven entidades DEMO
DROP POLICY IF EXISTS "demo_isolation_entities_select" ON public.entities;
CREATE POLICY "demo_isolation_entities_select"
ON public.entities
FOR SELECT
USING (
  -- Si es entidad DEMO, solo usuarios DEMO pueden verla
  (is_demo = true AND auth.jwt() ->> 'is_demo' = 'true')
  OR
  -- Si NO es DEMO, solo usuarios NO DEMO pueden verla
  (is_demo = false AND (auth.jwt() ->> 'is_demo' IS NULL OR auth.jwt() ->> 'is_demo' = 'false'))
  OR
  -- Admins ven todo (opcional, ajustar según necesidad)
  auth.jwt() ->> 'role' = 'service_role'
);

-- Habilitar RLS en entity_user_roles si no está habilitado
ALTER TABLE public.entity_user_roles ENABLE ROW LEVEL SECURITY;

-- Política: roles DEMO solo acceden a entidad DEMO
DROP POLICY IF EXISTS "demo_isolation_roles_select" ON public.entity_user_roles;
CREATE POLICY "demo_isolation_roles_select"
ON public.entity_user_roles
FOR SELECT
USING (
  -- Si es rol DEMO, solo en entidades DEMO
  (is_demo = true AND entity_id IN (SELECT id FROM public.entities WHERE is_demo = true))
  OR
  -- Si NO es DEMO, solo en entidades NO DEMO
  (is_demo = false AND entity_id IN (SELECT id FROM public.entities WHERE is_demo = false))
  OR
  -- Service role ve todo
  auth.jwt() ->> 'role' = 'service_role'
);

-- Registrar políticas RLS
INSERT INTO public.audit_log (action, details)
VALUES ('demo.rls.policies_created', '{"tables": ["entities", "entity_user_roles"]}');

-- ============================================================================
-- PASO 7: FUNCIÓN HELPER PARA VERIFICAR MODO DEMO
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_demo_user()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN COALESCE((auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_demo', 'false')::boolean;
END;
$$;

-- ============================================================================
-- PASO 8: VERIFICACIÓN FINAL
-- ============================================================================

-- Verificar entidad DEMO creada
DO $$
DECLARE
  v_demo_entity_exists boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.entities WHERE id = 'DEMO-ENTITY-001' AND is_demo = true)
  INTO v_demo_entity_exists;

  IF v_demo_entity_exists THEN
    RAISE NOTICE 'DEMO ENTITY CREATED: CUSTODIA360_DEMO_ENTITY (id: DEMO-ENTITY-001)';
  ELSE
    RAISE EXCEPTION 'FAILED TO CREATE DEMO ENTITY';
  END IF;
END $$;

-- Registrar finalización
INSERT INTO public.audit_log (action, details)
VALUES ('demo.setup.sql_completed', '{"timestamp": "2025-10-25T17:00:00Z", "status": "success"}');

-- ============================================================================
-- RESUMEN DE ACCIONES SQL COMPLETADAS
-- ============================================================================

-- ✅ Columnas is_demo añadidas a entities y entity_user_roles
-- ✅ Entidad DEMO creada (DEMO-ENTITY-001)
-- ✅ Políticas RLS configuradas para aislamiento
-- ✅ Función helper is_demo_user() creada
-- ✅ Índices optimizados
-- ✅ Audit log completo

-- ⚠️ ACCIONES PENDIENTES (requieren Admin API o Supabase Dashboard):
-- 1. Exportar backups CSV a Storage
-- 2. Deshabilitar usuarios @custodia.com antiguos (Auth Dashboard)
-- 3. Crear/actualizar 4 usuarios DEMO con password=123 (Auth Admin API)
-- 4. Asignar roles en entity_user_roles (después de crear usuarios)

-- ============================================================================
-- FIN DEL SCRIPT SQL
-- ============================================================================
