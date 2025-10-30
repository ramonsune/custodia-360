-- ============================================================
-- SCRIPT DE VERIFICACIÓN - Panel Delegado Unificado
-- Ejecutar después de la migración 20250112_delegado_panel_unified.sql
-- ============================================================

-- 1. VERIFICAR TABLAS CREADAS
-- ============================================================
SELECT '✅ VERIFICANDO TABLAS CREADAS...' as status;

SELECT
  table_name,
  CASE
    WHEN table_name IN (
      'entity_contacts', 'incident_types', 'urgent_incidents',
      'pdf_templates', 'generated_pdfs', 'library_assets',
      'library_shares', 'implementation_items', 'implementation_status',
      'inspector_reports', 'action_logs', 'message_receipts'
    ) THEN '✅ Existe'
    ELSE '❌ No existe'
  END as estado
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'entity_contacts',
    'incident_types',
    'urgent_incidents',
    'pdf_templates',
    'generated_pdfs',
    'library_assets',
    'library_shares',
    'implementation_items',
    'implementation_status',
    'inspector_reports',
    'action_logs',
    'message_receipts'
  )
ORDER BY table_name;

-- Debe mostrar 12 tablas


-- 2. VERIFICAR DATOS SEED - INCIDENT TYPES
-- ============================================================
SELECT '✅ VERIFICANDO INCIDENT TYPES (Debe ser 8)...' as status;

SELECT
  slug,
  titulo,
  prioridad,
  sector,
  array_length(contactos_recomendados, 1) as num_contactos_recomendados
FROM incident_types
ORDER BY
  CASE prioridad
    WHEN 'alta' THEN 1
    WHEN 'media' THEN 2
    WHEN 'baja' THEN 3
  END,
  titulo;

SELECT
  'Total incident_types: ' || COUNT(*) || ' (esperado: 8)' as resultado
FROM incident_types;


-- 3. VERIFICAR DATOS SEED - IMPLEMENTATION ITEMS
-- ============================================================
SELECT '✅ VERIFICANDO IMPLEMENTATION ITEMS (Debe ser 13)...' as status;

SELECT
  orden,
  slug,
  titulo,
  categoria,
  sector
FROM implementation_items
ORDER BY orden;

SELECT
  'Total implementation_items: ' || COUNT(*) || ' (esperado: 13)' as resultado
FROM implementation_items;

-- Breakdown por categoría
SELECT
  categoria,
  COUNT(*) as cantidad
FROM implementation_items
GROUP BY categoria
ORDER BY categoria;


-- 4. VERIFICAR ÍNDICES
-- ============================================================
SELECT '✅ VERIFICANDO ÍNDICES...' as status;

SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'entity_contacts',
    'incident_types',
    'urgent_incidents',
    'pdf_templates',
    'generated_pdfs',
    'library_assets',
    'implementation_items',
    'implementation_status',
    'inspector_reports',
    'action_logs'
  )
ORDER BY tablename, indexname;


-- 5. RESUMEN GENERAL
-- ============================================================
SELECT '📊 RESUMEN GENERAL' as status;

SELECT
  'entity_contacts' as tabla, COUNT(*) as registros FROM entity_contacts
UNION ALL
SELECT 'incident_types', COUNT(*) FROM incident_types
UNION ALL
SELECT 'urgent_incidents', COUNT(*) FROM urgent_incidents
UNION ALL
SELECT 'pdf_templates', COUNT(*) FROM pdf_templates
UNION ALL
SELECT 'generated_pdfs', COUNT(*) FROM generated_pdfs
UNION ALL
SELECT 'library_assets', COUNT(*) FROM library_assets
UNION ALL
SELECT 'library_shares', COUNT(*) FROM library_shares
UNION ALL
SELECT 'implementation_items', COUNT(*) FROM implementation_items
UNION ALL
SELECT 'implementation_status', COUNT(*) FROM implementation_status
UNION ALL
SELECT 'inspector_reports', COUNT(*) FROM inspector_reports
UNION ALL
SELECT 'action_logs', COUNT(*) FROM action_logs
UNION ALL
SELECT 'message_receipts', COUNT(*) FROM message_receipts
ORDER BY tabla;


-- 6. VERIFICAR ENTIDADES EXISTENTES (para crear datos de prueba)
-- ============================================================
SELECT '📋 ENTIDADES DISPONIBLES (para crear datos de prueba)' as status;

SELECT
  id,
  nombre,
  sector,
  plan_estado,
  created_at
FROM entidades
ORDER BY created_at DESC
LIMIT 10;


-- 7. ESTADO ACTUAL DEL SISTEMA
-- ============================================================
SELECT '🎯 ESTADO DEL SISTEMA' as status;

SELECT
  'Tablas del panel delegado' as item,
  COUNT(*) as valor,
  '12' as esperado
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'entity_contacts', 'incident_types', 'urgent_incidents',
    'pdf_templates', 'generated_pdfs', 'library_assets',
    'library_shares', 'implementation_items', 'implementation_status',
    'inspector_reports', 'action_logs', 'message_receipts'
  )
UNION ALL
SELECT
  'Tipos de incidentes',
  COUNT(*),
  '8'
FROM incident_types
UNION ALL
SELECT
  'Items de implementación',
  COUNT(*),
  '13'
FROM implementation_items;


-- ============================================================
-- FIN DE VERIFICACIÓN
-- ============================================================
SELECT '✅ VERIFICACIÓN COMPLETADA' as status;
SELECT '📌 Si todos los números coinciden, la migración fue exitosa' as nota;
SELECT '📌 Ahora puedes crear datos de prueba para tu entidad' as siguiente_paso;
