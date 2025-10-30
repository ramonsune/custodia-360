# 📋 COPIAR Y PEGAR EN SUPABASE SQL EDITOR

## 🎯 INSTRUCCIONES PASO A PASO

### PASO 1: Abrir SQL Editor en Supabase

1. Ve a: **https://supabase.com/dashboard**
2. Selecciona tu proyecto **Custodia360**
3. En el menú lateral izquierdo, haz clic en **"SQL Editor"**
4. Haz clic en el botón **"New query"** (esquina superior derecha)

---

### PASO 2: Copiar TODO lo que está debajo de esta línea

**⚠️ IMPORTANTE: Copia DESDE la línea que dice `-- ============` HASTA el final (línea 290)**

Abre el archivo:
```
custodia-360/supabase/migrations/20241015_formacion_completa.sql
```

Y copia **TODO SU CONTENIDO** (desde la línea 1 hasta la línea 290).

---

### PASO 3: Pegar en SQL Editor

1. Pega TODO el contenido en el editor SQL de Supabase
2. Haz clic en el botón **"Run"** (esquina inferior derecha)
3. Espera a que termine de ejecutarse

---

## ✅ VERIFICAR QUE SE EJECUTÓ CORRECTAMENTE

Si todo salió bien, deberías ver mensajes como:

```
CREATE TABLE
CREATE INDEX
ALTER TABLE
INSERT 0 30
etc...
```

**SIN ERRORES** en color rojo.

---

## ❌ SI VES ERRORES

### Error: "relation already exists"

**Solución:** Algunas tablas ya existen. Esto está OK porque el SQL usa `IF NOT EXISTS`. Continúa normal.

### Error: "column already exists"

**Solución:** Algunos campos ya existen. Esto está OK porque el SQL usa `IF NOT EXISTS`. Continúa normal.

### Error: "table people does not exist"

**Solución:** Primero debes ejecutar las migraciones base del proyecto. Dime si ves este error.

### Error: "table entities does not exist"

**Solución:** Primero debes ejecutar las migraciones base del proyecto. Dime si ves este error.

---

## 🔍 VERIFICAR TABLAS CREADAS

Después de ejecutar, verifica que se crearon las tablas ejecutando esta consulta:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'certificates',
  'training_status',
  'quiz_questions',
  'quiz_answers',
  'quiz_attempts',
  'quiz_attempt_items'
);
```

**Resultado esperado:** 6 filas (una por cada tabla)

---

## 📊 VERIFICAR DATOS INSERTADOS

Ejecuta esta consulta para verificar que se insertaron las preguntas:

```sql
SELECT COUNT(*) FROM quiz_questions;
```

**Resultado esperado:** Aproximadamente 40 preguntas

---

## ✅ COMPLETADO

Si ves las 6 tablas creadas y ~40 preguntas insertadas, ¡la migración fue exitosa!

**Siguiente paso:** Probar el flujo completo de formación del Delegado Principal.

---

## 🆘 SI NECESITAS AYUDA

Copia el mensaje de error EXACTO que aparece en rojo y envíamelo para ayudarte a solucionarlo.
