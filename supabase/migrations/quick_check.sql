-- ============================================================
-- 🚀 VERIFICACIÓN RÁPIDA - Panel Delegado
-- Copia y pega este script en Supabase SQL Editor
-- ============================================================

-- 1️⃣ VERIFICAR TABLAS (debe mostrar 12)
SELECT '1️⃣ TABLAS DEL PANEL DELEGADO:' as check_titulo;

SELECT
  COUNT(*) as tablas_creadas,
  '12' as esperadas
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'entity_contacts', 'incident_types', 'urgent_incidents',
    'pdf_templates', 'generated_pdfs', 'library_assets',
    'library_shares', 'implementation_items', 'implementation_status',
    'inspector_reports', 'action_logs', 'message_receipts'
  );

-- 2️⃣ VERIFICAR DATOS SEED
SELECT '2️⃣ DATOS SEED:' as check_titulo;

SELECT
  (SELECT COUNT(*) FROM incident_types) as incident_types,
  '8' as esperado,
  (SELECT COUNT(*) FROM implementation_items) as implementation_items,
  '13' as esperado;

-- 3️⃣ VERIFICAR DATOS DE PRUEBA (si ya los creaste)
SELECT '3️⃣ DATOS DE PRUEBA (opcional):' as check_titulo;

SELECT
  (SELECT COUNT(*) FROM entity_contacts) as contactos,
  (SELECT COUNT(*) FROM implementation_status) as estados_implementacion,
  (SELECT COUNT(*) FROM pdf_templates) as plantillas,
  (SELECT COUNT(*) FROM action_logs) as logs;

-- 4️⃣ TU ENTITY ID (para crear datos de prueba)
SELECT '4️⃣ TUS ENTIDADES:' as check_titulo;

SELECT
  id as entity_id,
  nombre,
  sector
FROM entidades
ORDER BY created_at DESC
LIMIT 5;

-- 5️⃣ TU USER ID (para crear datos de prueba)
SELECT '5️⃣ TUS DELEGADOS:' as check_titulo;

SELECT
  user_id,
  nombre || ' ' || COALESCE(apellidos, '') as nombre_completo,
  email,
  rol
FROM delegados
WHERE rol IN ('delegado_principal', 'delegado_suplente')
ORDER BY created_at DESC
LIMIT 5;

-- ============================================================
-- ✅ RESULTADO ESPERADO:
-- ============================================================
-- 1️⃣ tablas_creadas: 12
-- 2️⃣ incident_types: 8, implementation_items: 13
-- 3️⃣ Dependiendo si creaste datos de prueba
-- 4️⃣ Lista de tus entidades (copia el ID)
-- 5️⃣ Lista de tus delegados (copia el user_id)
-- ============================================================
