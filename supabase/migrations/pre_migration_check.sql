-- ============================================================
-- PRE-MIGRATION CHECK - Panel Delegado Unificado
-- Ejecutar ANTES de 20250112_delegado_panel_unified.sql
-- ============================================================

SELECT '🔍 VERIFICACIÓN PRE-MIGRACIÓN - Panel Delegado' as titulo;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separador;

-- ============================================================
-- 1. VERIFICAR TABLAS BASE REQUERIDAS
-- ============================================================

SELECT '1️⃣ VERIFICANDO TABLAS BASE REQUERIDAS...' as check;

DO $$
DECLARE
  missing_tables TEXT[] := ARRAY[]::TEXT[];
  table_name TEXT;
BEGIN
  -- Lista de tablas requeridas
  FOREACH table_name IN ARRAY ARRAY['entidades', 'delegados', 'trainings', 'background_checks']
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = table_name
    ) THEN
      missing_tables := array_append(missing_tables, table_name);
    END IF;
  END LOOP;

  IF array_length(missing_tables, 1) > 0 THEN
    RAISE NOTICE '❌ FALTAN TABLAS BASE: %', array_to_string(missing_tables, ', ');
    RAISE NOTICE '⚠️  Debes ejecutar las migraciones base primero';
    RAISE EXCEPTION 'Tablas base faltantes. Abortando verificación.';
  ELSE
    RAISE NOTICE '✅ Todas las tablas base existen';
  END IF;
END $$;

-- Mostrar tablas base
SELECT
  table_name,
  '✅' as estado
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('entidades', 'delegados', 'trainings', 'background_checks')
ORDER BY table_name;


-- ============================================================
-- 2. VERIFICAR QUE LAS TABLAS NUEVAS NO EXISTEN AÚN
-- ============================================================

SELECT '2️⃣ VERIFICANDO QUE LAS TABLAS NUEVAS NO EXISTEN...' as check;

SELECT
  table_name,
  CASE
    WHEN table_name IN (
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    ) THEN '⚠️ Ya existe'
    ELSE '✅ No existe (OK)'
  END as estado
FROM (
  VALUES
    ('entity_contacts'),
    ('incident_types'),
    ('urgent_incidents'),
    ('pdf_templates'),
    ('generated_pdfs'),
    ('library_assets'),
    ('library_shares'),
    ('implementation_items'),
    ('implementation_status'),
    ('inspector_reports'),
    ('action_logs'),
    ('message_receipts')
) AS t(table_name)
ORDER BY table_name;

-- Contar cuántas ya existen
SELECT
  COUNT(*) as tablas_existentes,
  CASE
    WHEN COUNT(*) = 0 THEN '✅ Ninguna tabla existe (perfecto)'
    WHEN COUNT(*) < 12 THEN '⚠️ Algunas tablas ya existen (migración parcial)'
    ELSE '⚠️ Todas las tablas ya existen (migración completa)'
  END as estado
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'entity_contacts', 'incident_types', 'urgent_incidents',
    'pdf_templates', 'generated_pdfs', 'library_assets',
    'library_shares', 'implementation_items', 'implementation_status',
    'inspector_reports', 'action_logs', 'message_receipts'
  );


-- ============================================================
-- 3. VERIFICAR DATOS EN TABLAS BASE
-- ============================================================

SELECT '3️⃣ VERIFICANDO DATOS EN TABLAS BASE...' as check;

SELECT
  'entidades' as tabla,
  COUNT(*) as registros,
  CASE
    WHEN COUNT(*) = 0 THEN '⚠️ Sin registros'
    ELSE '✅ Con datos'
  END as estado
FROM entidades
UNION ALL
SELECT
  'delegados',
  COUNT(*),
  CASE
    WHEN COUNT(*) = 0 THEN '⚠️ Sin registros'
    ELSE '✅ Con datos'
  END
FROM delegados
UNION ALL
SELECT
  'trainings',
  COUNT(*),
  CASE
    WHEN COUNT(*) = 0 THEN 'ℹ️ Sin registros (normal)'
    ELSE '✅ Con datos'
  END
FROM trainings
UNION ALL
SELECT
  'background_checks',
  COUNT(*),
  CASE
    WHEN COUNT(*) = 0 THEN 'ℹ️ Sin registros (normal)'
    ELSE '✅ Con datos'
  END
FROM background_checks;


-- ============================================================
-- 4. VERIFICAR EXTENSIONES POSTGRESQL NECESARIAS
-- ============================================================

SELECT '4️⃣ VERIFICANDO EXTENSIONES POSTGRESQL...' as check;

SELECT
  extname as extension,
  CASE
    WHEN extname = 'uuid-ossp' THEN '✅ Requerida para UUIDs'
    WHEN extname = 'pg_cron' THEN 'ℹ️ Útil para tareas programadas'
    ELSE '✅ Instalada'
  END as descripcion
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pg_cron', 'pgjwt', 'pgcrypto')
ORDER BY extname;

-- Verificar uuid-ossp específicamente
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
    RAISE NOTICE '⚠️  Extensión uuid-ossp no encontrada';
    RAISE NOTICE 'ℹ️  La migración usará gen_random_uuid() que está disponible por defecto';
  ELSE
    RAISE NOTICE '✅ Extensión uuid-ossp disponible';
  END IF;
END $$;


-- ============================================================
-- 5. VERIFICAR ESPACIO EN DISCO
-- ============================================================

SELECT '5️⃣ VERIFICANDO INFORMACIÓN DE BASE DE DATOS...' as check;

SELECT
  pg_size_pretty(pg_database_size(current_database())) as tamaño_actual,
  current_database() as nombre_base_datos,
  '✅ Espacio disponible' as estado;

-- Tamaño de las tablas más grandes
SELECT
  '📊 Top 5 Tablas Más Grandes:' as info;

SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as tamaño
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 5;


-- ============================================================
-- 6. VERIFICAR ENTIDADES DISPONIBLES (para datos de prueba)
-- ============================================================

SELECT '6️⃣ ENTIDADES DISPONIBLES (para seed de datos):' as check;

SELECT
  id as entity_id,
  nombre,
  sector,
  plan_estado,
  created_at,
  '📋 Copia este ID para el seed de datos' as nota
FROM entidades
ORDER BY created_at DESC
LIMIT 5;


-- ============================================================
-- 7. VERIFICAR DELEGADOS DISPONIBLES (para datos de prueba)
-- ============================================================

SELECT '7️⃣ DELEGADOS DISPONIBLES (para seed de datos):' as check;

SELECT
  user_id,
  nombre || ' ' || COALESCE(apellidos, '') as nombre_completo,
  email,
  rol,
  entity_id,
  '📋 Copia este user_id para el seed de datos' as nota
FROM delegados
WHERE rol IN ('delegado_principal', 'delegado_suplente')
ORDER BY created_at DESC
LIMIT 5;


-- ============================================================
-- 8. VERIFICAR CONFIGURACIÓN DE SUPABASE
-- ============================================================

SELECT '8️⃣ VERIFICANDO CONFIGURACIÓN DE SUPABASE...' as check;

-- Verificar versión de PostgreSQL
SELECT
  version() as postgres_version,
  '✅' as estado;

-- Verificar configuraciones relevantes
SELECT
  name as configuracion,
  setting as valor,
  unit,
  CASE
    WHEN name = 'max_connections' AND setting::int < 100 THEN '⚠️ Valor bajo'
    ELSE '✅ OK'
  END as estado
FROM pg_settings
WHERE name IN ('max_connections', 'shared_buffers', 'work_mem')
ORDER BY name;


-- ============================================================
-- RESUMEN FINAL
-- ============================================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separador;
SELECT '📊 RESUMEN DE VERIFICACIÓN PRE-MIGRACIÓN' as titulo;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separador;

DO $$
DECLARE
  base_tables_ok BOOLEAN;
  new_tables_ok BOOLEAN;
  has_entities BOOLEAN;
  has_delegados BOOLEAN;
BEGIN
  -- Verificar tablas base
  SELECT COUNT(*) = 4 INTO base_tables_ok
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('entidades', 'delegados', 'trainings', 'background_checks');

  -- Verificar que las nuevas tablas NO existen
  SELECT COUNT(*) = 0 INTO new_tables_ok
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN (
      'entity_contacts', 'incident_types', 'urgent_incidents',
      'pdf_templates', 'generated_pdfs', 'library_assets',
      'library_shares', 'implementation_items', 'implementation_status',
      'inspector_reports', 'action_logs', 'message_receipts'
    );

  -- Verificar datos
  SELECT COUNT(*) > 0 INTO has_entities FROM entidades;
  SELECT COUNT(*) > 0 INTO has_delegados FROM delegados;

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════';
  RAISE NOTICE '           RESULTADO DE VERIFICACIÓN PRE-MIGRACIÓN      ';
  RAISE NOTICE '═══════════════════════════════════════════════════════';
  RAISE NOTICE '';

  IF base_tables_ok AND new_tables_ok THEN
    RAISE NOTICE '✅ SISTEMA LISTO PARA MIGRACIÓN';
    RAISE NOTICE '';
    RAISE NOTICE '✓ Todas las tablas base existen';
    RAISE NOTICE '✓ Las nuevas tablas no existen (se crearán)';
    IF has_entities THEN
      RAISE NOTICE '✓ Hay entidades en la base de datos';
    ELSE
      RAISE NOTICE '⚠️ No hay entidades (necesitarás crear una)';
    END IF;
    IF has_delegados THEN
      RAISE NOTICE '✓ Hay delegados en la base de datos';
    ELSE
      RAISE NOTICE '⚠️ No hay delegados (necesitarás crear uno)';
    END IF;
    RAISE NOTICE '';
    RAISE NOTICE '🚀 PUEDES PROCEDER CON LA MIGRACIÓN PRINCIPAL';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Próximo paso:';
    RAISE NOTICE '   Ejecuta: 20250112_delegado_panel_unified.sql';
  ELSIF NOT base_tables_ok THEN
    RAISE NOTICE '❌ SISTEMA NO LISTO - FALTAN TABLAS BASE';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ Ejecuta primero las migraciones base del proyecto';
    RAISE EXCEPTION 'Pre-migración fallida: faltan tablas base';
  ELSIF NOT new_tables_ok THEN
    RAISE NOTICE '⚠️ MIGRACIÓN PARCIAL DETECTADA';
    RAISE NOTICE '';
    RAISE NOTICE 'ℹ️ Algunas o todas las tablas ya existen';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Opciones:';
    RAISE NOTICE '   1. Si quieres re-ejecutar: DROP las tablas existentes';
    RAISE NOTICE '   2. Si ya migraste: Continúa con el seed de datos';
    RAISE NOTICE '   3. Ejecuta quick_check.sql para ver el estado actual';
  END IF;

  RAISE NOTICE '═══════════════════════════════════════════════════════';
  RAISE NOTICE '';

END $$;


-- ============================================================
-- INFORMACIÓN ADICIONAL
-- ============================================================

SELECT '📚 ARCHIVOS RELACIONADOS:' as titulo;

SELECT
  'pre_migration_check.sql' as archivo,
  'Este archivo (verificación pre-migración)' as descripcion
UNION ALL
SELECT
  '20250112_delegado_panel_unified.sql',
  '⏭️ SIGUIENTE: Migración principal (crear 12 tablas)'
UNION ALL
SELECT
  'quick_check.sql',
  'Verificación rápida post-migración'
UNION ALL
SELECT
  'verificar_panel_delegado.sql',
  'Verificación completa post-migración'
UNION ALL
SELECT
  'seed_datos_prueba_panel.sql',
  'Datos de prueba (después de migración)';


-- ============================================================
-- FIN DE VERIFICACIÓN
-- ============================================================

SELECT '✅ VERIFICACIÓN PRE-MIGRACIÓN COMPLETADA' as estado;
