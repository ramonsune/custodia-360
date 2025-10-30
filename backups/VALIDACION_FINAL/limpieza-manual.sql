
-- =====================================================
-- SQL DE LIMPIEZA - VALIDACIÓN FINAL CUSTODIA360
-- =====================================================
-- FECHA: 2025-10-26T17:54:26.128Z
-- EJECUTAR EN: Supabase SQL Editor
-- =====================================================

-- PASO 1: Verificar usuarios existentes en auth.users
-- (Ejecutar primero para ver qué usuarios hay)
SELECT id, email, created_at, last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- PASO 2: Usuarios que DEBEN permanecer activos
-- entidad@custodia.com
-- delegado@custodia.com
-- delegados@custodia.com
-- ramon@custodia.com

-- PASO 3: DESHABILITAR usuarios demo antiguos (si existen)
-- IMPORTANTE: Solo ejecutar después de verificar paso 1
-- UPDATE auth.users
-- SET is_disabled = true
-- WHERE email NOT IN (
--   'entidad@custodia.com',
--   'delegado@custodia.com',
--   'delegados@custodia.com',
--   'ramon@custodia.com'
-- );

-- PASO 4: Verificar RLS está habilitado en tablas críticas
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'entities',
    'entity_user_roles',
    'guides',
    'guide_sections',
    'message_templates'
  );

-- PASO 5: Limpiar sesiones antiguas (opcional)
-- DELETE FROM auth.sessions WHERE expires_at < now();

-- =====================================================
-- FIN SQL DE LIMPIEZA
-- =====================================================
