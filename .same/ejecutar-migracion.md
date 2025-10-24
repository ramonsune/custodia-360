# 🚀 Ejecutar Migración del Panel Delegado en Supabase

## ✅ Paso 1: Acceder al SQL Editor de Supabase

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto de Custodia360
3. En el menú lateral, click en **SQL Editor**

## 📝 Paso 2: Ejecutar la Migración

### Opción A: Ejecutar archivo completo

1. En el SQL Editor, click en **New query**
2. Copia y pega el contenido completo del archivo:
   ```
   custodia-360/supabase/migrations/20250112_delegado_panel_unified.sql
   ```
3. Click en **Run** (o presiona Ctrl/Cmd + Enter)

### Opción B: Usar Supabase CLI (Recomendado)

Si tienes Supabase CLI instalado:

```bash
cd custodia-360
npx supabase db push
```

O ejecutar la migración específica:

```bash
npx supabase migration up
```

## 🔍 Paso 3: Verificar las Tablas Creadas

Ejecuta este script en el SQL Editor para verificar:

```sql
-- Verificar que todas las tablas existen
SELECT table_name
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
```

Deberías ver **12 tablas**.

## 📊 Paso 4: Verificar los Datos Seed

### Verificar incident_types (8 tipos):

```sql
SELECT slug, titulo, prioridad, sector
FROM incident_types
ORDER BY prioridad DESC, titulo;
```

Deberías ver:
- revelacion_directa
- sospecha_maltrato
- agresion_fisica
- ciberacoso
- accidente_grave
- accidente_leve
- comportamiento_inadecuado_adulto
- fuga_menor

### Verificar implementation_items (13 items):

```sql
SELECT slug, titulo, categoria, orden
FROM implementation_items
ORDER BY orden;
```

Deberías ver 13 items, desde "formacion_delegado" hasta "plan_mejora".

## ✅ Paso 5: Crear Datos de Prueba (Opcional)

### Crear contactos de emergencia para tu entidad:

```sql
-- Reemplaza 'TU_ENTITY_ID' con el ID real de tu entidad
INSERT INTO entity_contacts (entity_id, nombre, telefono, tipo) VALUES
  ('TU_ENTITY_ID', 'Emergencias 112', '112', 'emergencias'),
  ('TU_ENTITY_ID', 'Policía Nacional', '091', 'policia'),
  ('TU_ENTITY_ID', 'Guardia Civil', '062', 'guardia_civil'),
  ('TU_ENTITY_ID', 'Director: Juan Pérez', '600123456', 'direccion');
```

### Inicializar estado de implementación:

```sql
-- Reemplaza 'TU_ENTITY_ID' con el ID real de tu entidad
INSERT INTO implementation_status (entity_id, item_slug, estado)
SELECT 'TU_ENTITY_ID', slug, 'pendiente'
FROM implementation_items;
```

## 🎯 Paso 6: Obtener tu Entity ID

Para saber qué ID usar en los datos de prueba:

```sql
SELECT id, nombre, sector
FROM entidades
ORDER BY created_at DESC
LIMIT 5;
```

## ⚠️ Posibles Errores y Soluciones

### Error: "relation entidades does not exist"

**Causa:** La tabla `entidades` no existe en tu base de datos.

**Solución:** Primero crea la tabla entidades o verifica que la migración base esté ejecutada.

### Error: "duplicate key value violates unique constraint"

**Causa:** La migración ya fue ejecutada anteriormente.

**Solución:** No hay problema, las tablas ya existen. Puedes verificar con el script del Paso 3.

### Error: Foreign key constraint

**Causa:** Faltan tablas referenciadas (delegados, message_jobs, etc.)

**Solución:** Verifica que todas las migraciones previas estén ejecutadas.

## ✨ Paso 7: Verificación Final

Ejecuta este script completo para verificar todo:

```sql
-- 1. Contar tablas nuevas
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
SELECT 'message_receipts', COUNT(*) FROM message_receipts;
```

**Resultado esperado:**
- incident_types: 8
- implementation_items: 13
- Resto: 0 (hasta que uses el panel)

## 🎉 ¡Listo!

Si todo está correcto, ahora puedes:
1. Acceder al panel delegado en: `https://www.custodia360.es/panel/delegado`
2. Los KPIs se cargarán automáticamente
3. Todas las funcionalidades estarán activas

---

**Siguiente paso:** Crear una versión y desplegar a producción
