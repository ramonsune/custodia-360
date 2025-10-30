
-- =====================================================
-- MIGRATIONS CONSOLIDADAS - CUSTODIA360
-- =====================================================
-- FECHA: 2025-10-26T17:54:26.290Z
-- INSTRUCCIONES:
-- 1. Ejecutar en Supabase SQL Editor
-- 2. Revisar errores (algunas tablas pueden ya existir)
-- 3. Verificar que todas las tablas críticas existen
-- =====================================================

-- IMPORTANTE: Este SQL incluye las migrations más críticas
-- Si alguna tabla ya existe, el error es normal (skip ese bloque)

-- =====================================================
-- 1. SISTEMA DE GUÍAS (guide-system.sql)
-- =====================================================
-- Ver archivo: database/guide-system.sql
-- Tablas: guides, guide_sections, guide_anchors
-- Estado: CRÍTICO - ejecutar si no existe

-- =====================================================
-- 2. SISTEMA DEMO (setup-demo-system.sql)
-- =====================================================
-- Ver archivo: database/setup-demo-system.sql
-- Tablas: Entidad DEMO + usuarios
-- Estado: OPCIONAL - solo para testing

-- =====================================================
-- 3. BACKUP DELEGATE SYSTEM
-- =====================================================
-- Ver archivo: database/backup-delegate-system.sql
-- Tablas: delegate_change_requests, delegate_change_logs
-- Estado: IMPORTANTE

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Listar todas las tablas existentes
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar RLS activo
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE table_schema = 'public'
  AND rowsecurity = true;

-- =====================================================
-- PRÓXIMOS PASOS
-- =====================================================
-- 1. Copiar contenido de database/guide-system.sql → Ejecutar
-- 2. Copiar contenido de database/backup-delegate-system.sql → Ejecutar
-- 3. (Opcional) setup-demo-system.sql si necesitas entorno demo
-- 4. Ejecutar seed: bun run scripts/seed-guides.ts
-- =====================================================
