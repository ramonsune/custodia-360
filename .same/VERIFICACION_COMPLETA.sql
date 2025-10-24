-- ============================================================
-- VERIFICACIÓN COMPLETA DE MIGRACIONES
-- Fecha: 14 Octubre 2025
-- ============================================================

-- 1. VERIFICAR TABLAS CREADAS
SELECT
  '=== TABLAS DEL SISTEMA ===' as verificacion;

SELECT
  table_name,
  CASE
    WHEN table_name IN ('entities', 'people', 'entity_people_roles', 'message_templates') THEN '✅ Tabla Base'
    WHEN table_name IN ('certificates', 'training_status', 'quiz_questions', 'quiz_answers', 'quiz_attempts', 'quiz_attempt_items') THEN '✅ Sistema Formación'
    WHEN table_name IN ('sectors', 'onboarding_links', 'onboarding_responses', 'trainings', 'background_checks') THEN '✅ Sistema Onboarding'
    ELSE '📋 Otra'
  END as sistema
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name NOT LIKE 'pg_%'
AND table_name NOT LIKE 'sql_%'
ORDER BY sistema, table_name;

-- 2. VERIFICAR COLUMNAS DE ENTITIES
SELECT
  '=== COLUMNAS AÑADIDAS A ENTITIES ===' as verificacion;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'entities'
AND column_name IN ('settings', 'delegado_penales_entregado', 'delegado_penales_fecha', 'sector_code')
ORDER BY column_name;

-- 3. CONTAR PREGUNTAS DEL QUIZ
SELECT
  '=== BANCO DE PREGUNTAS ===' as verificacion;

SELECT
  CASE
    WHEN is_general = true THEN 'Preguntas Generales'
    WHEN es_universal = true THEN 'Preguntas Universales'
    ELSE 'Preguntas por Sector'
  END as tipo,
  COALESCE(sector_code, sector_id, 'N/A') as sector,
  COUNT(*) as total
FROM quiz_questions
GROUP BY is_general, es_universal, sector_code, sector_id
ORDER BY tipo, sector;

-- Total de preguntas
SELECT COUNT(*) as total_preguntas FROM quiz_questions;

-- 4. VERIFICAR RESPUESTAS (deben ser 4 por pregunta)
SELECT
  '=== RESPUESTAS POR PREGUNTA ===' as verificacion;

SELECT
  COUNT(DISTINCT q.id) as preguntas_con_respuestas,
  COUNT(a.id) as total_respuestas,
  ROUND(COUNT(a.id)::numeric / NULLIF(COUNT(DISTINCT q.id), 0), 2) as promedio_respuestas_por_pregunta
FROM quiz_questions q
LEFT JOIN quiz_answers a ON a.question_id = q.id;

-- Preguntas sin 4 respuestas (debería estar vacío)
SELECT
  q.id,
  q.text as pregunta,
  q.pregunta,
  COUNT(a.id) as num_respuestas
FROM quiz_questions q
LEFT JOIN quiz_answers a ON a.question_id = q.id
GROUP BY q.id, q.text, q.pregunta
HAVING COUNT(a.id) != 4
LIMIT 10;

-- 5. VERIFICAR SECTORES
SELECT
  '=== SECTORES INSERTADOS ===' as verificacion;

SELECT * FROM sectors ORDER BY id;

-- 6. VERIFICAR PLANTILLAS DE EMAIL
SELECT
  '=== PLANTILLAS DE EMAIL ===' as verificacion;

SELECT slug, nombre, asunto, activo
FROM message_templates
WHERE slug IN ('training-start', 'training-certified')
OR scope = 'email'
ORDER BY slug;

-- 7. VERIFICAR ÍNDICES CREADOS
SELECT
  '=== ÍNDICES CREADOS ===' as verificacion;

SELECT
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN (
  'certificates',
  'training_status',
  'quiz_questions',
  'quiz_answers',
  'quiz_attempts',
  'quiz_attempt_items',
  'sectors',
  'onboarding_links',
  'onboarding_responses',
  'entities',
  'people'
)
ORDER BY tablename, indexname;

-- 8. VERIFICAR RLS (Row Level Security)
SELECT
  '=== ROW LEVEL SECURITY ===' as verificacion;

SELECT
  tablename,
  CASE WHEN rowsecurity THEN '✅ Habilitado' ELSE '❌ Deshabilitado' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'entities',
  'people',
  'certificates',
  'training_status',
  'quiz_questions',
  'quiz_answers',
  'quiz_attempts',
  'quiz_attempt_items',
  'onboarding_links',
  'onboarding_responses'
)
ORDER BY tablename;

-- 9. VERIFICAR POLÍTICAS RLS
SELECT
  '=== POLÍTICAS RLS ===' as verificacion;

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 10. VERIFICAR TRIGGERS
SELECT
  '=== TRIGGERS CREADOS ===' as verificacion;

SELECT
  event_object_table as tabla,
  trigger_name,
  event_manipulation as evento,
  action_timing as timing
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table IN (
  'entities',
  'people',
  'entity_people_roles',
  'training_status',
  'onboarding_links',
  'onboarding_responses',
  'background_checks'
)
ORDER BY event_object_table, trigger_name;

-- 11. RESUMEN FINAL
SELECT
  '=== RESUMEN FINAL ===' as verificacion;

SELECT
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('entities', 'people', 'entity_people_roles', 'message_templates')) as tablas_base,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('certificates', 'training_status', 'quiz_questions', 'quiz_answers', 'quiz_attempts', 'quiz_attempt_items')) as tablas_formacion,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('sectors', 'onboarding_links', 'onboarding_responses', 'trainings', 'background_checks')) as tablas_onboarding,
  (SELECT COUNT(*) FROM quiz_questions) as total_preguntas,
  (SELECT COUNT(*) FROM quiz_answers) as total_respuestas,
  (SELECT COUNT(*) FROM sectors) as total_sectores,
  (SELECT COUNT(*) FROM message_templates WHERE scope = 'email') as plantillas_email;
