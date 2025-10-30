# 🔧 Instrucciones: Corrección de Schema Supabase

**Fecha:** 21 de octubre de 2025
**Motivo:** Auditoría "Live Ready" detectó 4 tablas con errores de estructura

---

## ⚠️ ACCIÓN REQUERIDA (5 minutos)

Debes ejecutar el SQL de corrección **manualmente** en Supabase Dashboard.

### Paso 1: Abrir Supabase SQL Editor

1. Ve a: **https://supabase.com/dashboard/project/[tu-proyecto]**
2. Click en **"SQL Editor"** (menú izquierdo)
3. Click en **"New query"**

### Paso 2: Copiar y Ejecutar SQL

1. Abre el archivo: `custodia-360/scripts/sql/fix-live-ready-schema.sql`
2. Copia **TODO** el contenido (6,279 caracteres)
3. Pega en el editor SQL de Supabase
4. Click en **"Run"** o presiona **Ctrl+Enter**

### Paso 3: Verificar Ejecución

Deberías ver mensajes de confirmación sin errores:
```
Success. No rows returned
```

Si hay algún error, anótalo y continúa (el SQL es idempotente).

### Paso 4: Verificar Tablas Creadas/Actualizadas

Ve a **Table Editor** y confirma que existen:
- ✅ `entity_compliance` (con columna `id`)
- ✅ `entity_invite_tokens` (con columna `id`)
- ✅ `email_events` (nueva tabla)
- ✅ `subscriptions` (nueva tabla)

---

## 📋 Qué Hace el SQL

### A) entity_compliance
- Añade columna `id` (UUID, primary key)
- Añade columnas funcionales: `entity_id`, `channel_done`, `riskmap_done`, `penales_done`, `deadline_at`, `blocked`
- Añade constraint FK a `entities`
- Añade trigger `updated_at`
- Crea 1 fila por entidad existente

### B) entity_invite_tokens
- Añade columna `id` (UUID, primary key)
- Añade columnas: `entity_id`, `token`, `active`, `expires_at`
- Añade constraint FK a `entities`
- Crea índice único sobre `token`

### C) email_events (nueva tabla)
- Estructura completa para eventos de Resend webhook
- Columnas: `id`, `event_type`, `email_id`, `to_email`, `from_email`, `subject`, `timestamp`, `error`, `raw_data`
- RLS server-only
- Índice sobre `created_at`

### D) subscriptions (nueva tabla)
- Estructura para gestión de suscripciones Stripe
- Columnas: `id`, `entity_id`, `stripe_customer_id`, `stripe_subscription_id`, `price_id`, `status`, `current_period_start`, `current_period_end`, `trial_end`, `metadata`
- RLS server-only
- Trigger `updated_at`

---

## ✅ Después de Ejecutar

Vuelve a Same y confirma:
> "SQL ejecutado en Supabase"

Entonces re-ejecutaré la auditoría "Live Ready" para verificar que todo está correcto.

---

## 🐛 Si Encuentras Errores

**Error común 1:** "relation already exists"
- ✅ Normal, el SQL es idempotente (ignora si ya existe)

**Error común 2:** "column already exists"
- ✅ Normal, el SQL usa `add column if not exists`

**Error común 3:** "constraint already exists"
- ✅ Normal, el SQL verifica antes de crear

**Error real:** Cualquier otro error
- ❌ Anota el mensaje completo
- Copia la línea SQL que falló
- Informa a Same para investigar

---

## 📝 Notas

- **SQL idempotente:** Puedes ejecutarlo múltiples veces sin problemas
- **No borra datos:** Solo añade/corrige estructura
- **Modo consolidación:** No toca lógica de negocio existente
- **Backup:** Supabase hace backups automáticos, pero puedes hacer uno manual antes si quieres

---

**Archivo SQL:** `scripts/sql/fix-live-ready-schema.sql`
**Tamaño:** 6,279 caracteres
**Statements:** ~30 operaciones DDL

---

*Instrucciones generadas automáticamente - 21 de octubre de 2025*
