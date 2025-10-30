# 🔍 INSTRUCCIONES DE VERIFICACIÓN

**Archivo:** `.same/VERIFICACION_COMPLETA.sql`
**Fecha:** 14 Octubre 2025

---

## 📋 PASOS PARA VERIFICAR LAS MIGRACIONES

### 1️⃣ Abrir Supabase SQL Editor

1. Ve a: **https://supabase.com/dashboard**
2. Selecciona tu proyecto **Custodia360**
3. En el menú lateral, click en **"SQL Editor"**
4. Click en **"New query"**

---

### 2️⃣ Copiar el Script de Verificación

1. Abre el archivo: **`custodia-360/.same/VERIFICACION_COMPLETA.sql`**
2. **Selecciona TODO** el contenido (Ctrl+A / Cmd+A)
3. **Copia** (Ctrl+C / Cmd+C)

---

### 3️⃣ Ejecutar en Supabase

1. **Pega** el script completo en el SQL Editor
2. Click en **"Run"** (botón verde, esquina inferior derecha)
3. Espera a que termine (puede tardar unos segundos)

---

### 4️⃣ Revisar los Resultados

El script ejecutará **11 verificaciones** y te mostrará múltiples tablas con resultados.

#### ✅ QUÉ DEBES VER SI TODO ESTÁ BIEN:

**Sección 1: TABLAS DEL SISTEMA**
- Deberías ver tablas con etiquetas:
  - `✅ Tabla Base` (entities, people, entity_people_roles, message_templates)
  - `✅ Sistema Formación` (certificates, training_status, quiz_questions, quiz_answers, quiz_attempts, quiz_attempt_items)
  - `✅ Sistema Onboarding` (sectors, onboarding_links, onboarding_responses, trainings, background_checks)

**Sección 2: COLUMNAS AÑADIDAS A ENTITIES**
- Deberías ver 4 columnas:
  - `settings` (jsonb)
  - `delegado_penales_entregado` (boolean)
  - `delegado_penales_fecha` (timestamp with time zone)
  - `sector_code` (text)

**Sección 3: BANCO DE PREGUNTAS**
- **Preguntas Generales:** ~30
- **Preguntas por Sector:**
  - ludoteca: ~12
  - club_futbol: ~10
  - academia: ~18
  - campamento: ~8
- **Preguntas Universales:** ~14
- **TOTAL:** ~90-100 preguntas

**Sección 4: RESPUESTAS POR PREGUNTA**
- `promedio_respuestas_por_pregunta`: **4.00** (exacto)
- La consulta de "preguntas sin 4 respuestas" debe estar **VACÍA** (0 filas)

**Sección 5: SECTORES INSERTADOS**
- Deberías ver 6 sectores:
  - ludoteca
  - club_futbol
  - academia
  - colegio
  - ong
  - campamento

**Sección 6: PLANTILLAS DE EMAIL**
- Deberías ver al menos 2 plantillas:
  - `training-start`
  - `training-certified`

**Sección 8: ROW LEVEL SECURITY**
- TODAS las tablas deben mostrar: `✅ Habilitado`

**Sección 11: RESUMEN FINAL**
- `tablas_base`: **4**
- `tablas_formacion`: **6**
- `tablas_onboarding`: **5**
- `total_preguntas`: **~90-100**
- `total_respuestas`: **~360-400**
- `total_sectores`: **6**
- `plantillas_email`: **≥ 2**

---

## ❌ SI VES ERRORES

### Error: "relation does not exist"
**Significa:** Esa tabla NO se creó.
**Solución:** Vuelve a ejecutar la migración correspondiente.

### Error: "column does not exist"
**Significa:** Esa columna NO se añadió.
**Solución:** Revisa la migración que añade campos a `entities`.

### Preguntas sin 4 respuestas
**Significa:** Hay preguntas incompletas en el banco de datos.
**Solución:** Ejecuta el fix que te proporcionaré.

### RLS no habilitado
**Significa:** Falta seguridad a nivel de fila.
**Solución:** Ejecuta manualmente los comandos `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`.

---

## 📊 INTERPRETAR RESULTADOS

### ✅ TODO CORRECTO SI:
1. Aparecen **todas** las tablas esperadas (base + formación + onboarding)
2. Todas las columnas de `entities` están presentes
3. Hay **~90-100 preguntas** en total
4. **TODAS** las preguntas tienen exactamente **4 respuestas**
5. Hay **6 sectores** insertados
6. Hay **al menos 2 plantillas** de email
7. **RLS habilitado** en todas las tablas

### ⚠️ REVISAR SI:
- Faltan tablas
- Faltan columnas en `entities`
- Hay menos de 80 preguntas
- Hay preguntas sin 4 respuestas
- Faltan sectores
- RLS deshabilitado en alguna tabla

---

## 🎯 DESPUÉS DE VERIFICAR

**Si todo está correcto:**
✅ Las migraciones se ejecutaron exitosamente.
✅ Puedes proceder a probar el sistema de formación.

**Si hay errores:**
❌ Copia el error exacto y envíamelo.
❌ También envíame el resultado de la **Sección 11: RESUMEN FINAL**.

---

## 📝 REPORTE DE VERIFICACIÓN

Después de ejecutar, copia y pégame el resultado de la **Sección 11: RESUMEN FINAL**:

```
tablas_base | tablas_formacion | tablas_onboarding | total_preguntas | total_respuestas | total_sectores | plantillas_email
------------|------------------|-------------------|-----------------|------------------|----------------|------------------
     ?      |        ?         |         ?         |        ?        |        ?         |       ?        |        ?
```

---

🔒 **Modo Consolidación Activo** - No se ha modificado ningún código, solo se ha creado el script de verificación.
