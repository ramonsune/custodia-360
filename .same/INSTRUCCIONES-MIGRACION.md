# 🚀 GUÍA PASO A PASO: Migración Panel Delegado

## ⏱️ Tiempo estimado: 5-10 minutos

---

## 📋 PASO 1: Preparación (1 min)

### ¿Qué vamos a hacer?
Vamos a crear **12 nuevas tablas** en Supabase para el Panel Delegado Unificado.

### Archivos que usaremos:
1. ✅ `supabase/migrations/20250112_delegado_panel_unified.sql` - Migración principal
2. ✅ `supabase/migrations/verificar_panel_delegado.sql` - Script de verificación
3. ✅ `supabase/migrations/seed_datos_prueba_panel.sql` - Datos de prueba

---

## 🔐 PASO 2: Acceder a Supabase (30 seg)

1. Ve a **https://supabase.com/dashboard**
2. Selecciona tu proyecto **Custodia360**
3. En el menú lateral izquierdo, busca **"SQL Editor"**
4. Click en **SQL Editor**

```
🖥️ Dashboard → [Tu Proyecto] → SQL Editor
```

---

## 📝 PASO 3: Ejecutar la Migración Principal (2 min)

### Opción A: Copiar y Pegar en SQL Editor

1. En SQL Editor, click en **"+ New query"**
2. Abre el archivo: `custodia-360/supabase/migrations/20250112_delegado_panel_unified.sql`
3. **Copia TODO el contenido** del archivo (Ctrl/Cmd + A, luego Ctrl/Cmd + C)
4. **Pega** en el SQL Editor de Supabase
5. Click en **"Run"** (o presiona Ctrl/Cmd + Enter)

⏳ **Espera 5-10 segundos...**

✅ **Si ves "Success. No rows returned"** → ¡Perfecto! La migración funcionó.

❌ **Si ves un error:**
- Lee el mensaje de error
- Si dice "already exists" → La tabla ya existe, está bien
- Si dice "does not exist" → Falta una tabla base (entidades, delegados)

### Opción B: Usar Supabase CLI (Avanzado)

```bash
# Si tienes Supabase CLI instalado
cd custodia-360
npx supabase db push
```

---

## ✅ PASO 4: Verificar que Funcionó (2 min)

1. En SQL Editor, click en **"+ New query"**
2. Abre el archivo: `custodia-360/supabase/migrations/verificar_panel_delegado.sql`
3. **Copia TODO el contenido**
4. **Pega** en SQL Editor
5. Click en **"Run"**

### ¿Qué deberías ver?

```
✅ VERIFICANDO TABLAS CREADAS...
12 tablas mostradas (todas con estado "✅ Existe")

✅ VERIFICANDO INCIDENT TYPES (Debe ser 8)
8 tipos de incidentes listados

✅ VERIFICANDO IMPLEMENTATION ITEMS (Debe ser 13)
13 items de implementación listados

📊 RESUMEN GENERAL
- incident_types: 8
- implementation_items: 13
- Resto: 0 (normal, hasta que uses el panel)
```

---

## 🎯 PASO 5: Crear Datos de Prueba (3 min)

### 5.1 Obtener tu Entity ID

Ejecuta en SQL Editor:

```sql
SELECT id, nombre, sector FROM entidades ORDER BY created_at DESC LIMIT 5;
```

📋 **Copia el `id` de tu entidad** (es un UUID como `550e8400-e29b-41d4-a716-446655440000`)

### 5.2 Editar el Script de Datos de Prueba

1. Abre: `custodia-360/supabase/migrations/seed_datos_prueba_panel.sql`
2. Busca la línea 13:
   ```sql
   v_entity_id UUID := 'demo_entity_001'; -- ⚠️ CAMBIA ESTE ID
   ```
3. **Reemplaza `'demo_entity_001'`** con el ID que copiaste, ejemplo:
   ```sql
   v_entity_id UUID := '550e8400-e29b-41d4-a716-446655440000';
   ```

### 5.3 Obtener tu User ID (Delegado)

Ejecuta en SQL Editor:

```sql
SELECT user_id, nombre, apellidos, email
FROM delegados
WHERE rol = 'delegado_principal'
ORDER BY created_at DESC
LIMIT 5;
```

📋 **Copia el `user_id`** de tu delegado

### 5.4 Editar el User ID en el Script

En el mismo archivo, línea 14:
```sql
v_user_id UUID := 'delegado_user_001'; -- ⚠️ CAMBIA ESTE ID
```

Reemplaza con tu `user_id`:
```sql
v_user_id UUID := 'tu-user-id-aqui';
```

### 5.5 Ejecutar el Script

1. **Copia TODO el contenido** del archivo editado
2. **Pega** en SQL Editor
3. Click en **"Run"**

### ¿Qué deberías ver?

```
📞 Creando contactos de emergencia...
✅ Contactos de emergencia creados
📋 Inicializando checklist de implementación...
✅ Estado de implementación inicializado
📄 Creando plantillas PDF de ejemplo...
✅ Plantillas PDF creadas
📊 Creando logs de actividad de ejemplo...
✅ Logs de actividad creados

====================================
✅ DATOS DE PRUEBA CREADOS
====================================
```

---

## 🎉 PASO 6: Verificar el Panel (1 min)

### Acceder al Panel Delegado

1. Ve a: **https://www.custodia360.es/acceso**
2. Click en **"3️⃣ Panel Delegado Unificado"**
3. O usa las credenciales:
   - **Email:** `delegado@custodia360.com`
   - **Password:** `delegado123`

### ¿Qué deberías ver?

```
✅ Panel del Delegado
   - KPI Formación Personal: X%
   - KPI Certificados Penales: X%
   - KPI Implementación LOPIVI: 23% (3/13 completados)

✅ 8 Botones de Acciones Rápidas:
   📧 Comunicar
   📄 Documentos
   ✓ Controles
   📋 Implementación
   👥 Miembros
   📚 Biblioteca
   🔍 Inspección
   ⚠️ URGENCIA
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "relation entidades does not exist"

**Problema:** No existe la tabla `entidades`

**Solución:**
```sql
-- Verifica que exista
SELECT * FROM entidades LIMIT 1;

-- Si no existe, primero crea las tablas base
```

### Error: "duplicate key value"

**Problema:** La migración ya se ejecutó antes

**Solución:** ¡No pasa nada! Las tablas ya existen. Continúa con el Paso 4 para verificar.

### Los KPIs muestran 0%

**Problema:** No hay datos de formación o penales

**Solución:** Normal en entidades nuevas. Los KPIs se actualizarán cuando agregues personal y datos.

### No veo el botón "URGENCIA"

**Problema:** JavaScript no cargó o error en el navegador

**Solución:**
1. Refresca la página (F5)
2. Abre la consola del navegador (F12)
3. Busca errores en rojo

---

## 📊 RESUMEN DE CAMBIOS

### Tablas Creadas (12):
1. ✅ `entity_contacts` - Contactos de emergencia
2. ✅ `incident_types` - Tipos de urgencias
3. ✅ `urgent_incidents` - Incidentes registrados
4. ✅ `pdf_templates` - Plantillas de documentos
5. ✅ `generated_pdfs` - PDFs generados
6. ✅ `library_assets` - Biblioteca de documentos
7. ✅ `library_shares` - Comparticiones
8. ✅ `implementation_items` - Checklist LOPIVI
9. ✅ `implementation_status` - Estado por entidad
10. ✅ `inspector_reports` - Informes de inspección
11. ✅ `action_logs` - Auditoría de acciones
12. ✅ `message_receipts` - Confirmaciones de lectura

### Datos Seed (Auto-creados):
- ✅ 8 tipos de incidentes urgentes
- ✅ 13 items de implementación LOPIVI

### Datos de Prueba (Opcionales):
- ✅ 7 contactos de emergencia
- ✅ Estado inicial de implementación
- ✅ 4 plantillas PDF
- ✅ 4 logs de actividad

---

## ✨ SIGUIENTE PASO

Una vez completada la migración:

1. ✅ **Explora el Panel Delegado**
2. ✅ **Prueba cada funcionalidad**
3. ✅ **Crea tu primer incidente urgente**
4. ✅ **Genera un documento PDF**
5. 🚀 **Despliega a producción**

---

## 📞 SOPORTE

Si tienes problemas:

1. **Revisa los logs de Supabase**
   - SQL Editor → Historial de consultas
   - Busca mensajes de error específicos

2. **Verifica las tablas existentes**
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

3. **Consulta la documentación**
   - Lee: `.same/panel-delegado-deployment.md`
   - Lee: `.same/NEXT-STEPS.md`

---

**¡ÉXITO!** 🎉

Tu Panel Delegado Unificado ya está configurado y listo para usar.
