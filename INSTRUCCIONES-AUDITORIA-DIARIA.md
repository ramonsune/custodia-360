# 📊 Sistema de Auditoría Diaria Automatizada - Custodia360

**Fecha de implementación:** 21 de octubre de 2025
**Estado:** ✅ Código implementado | ⚠️ Requiere configuración manual

---

## 🎯 Resumen del Sistema

El sistema de auditoría diaria verifica automáticamente cada día a las **09:00 Europe/Madrid**:

- ✅ 7 variables de entorno críticas
- ✅ 10 tablas Supabase core
- ✅ 13 templates de mensaje
- ✅ Dominio Resend (custodia360.es)
- ✅ 3 workers/automatizaciones
- ✅ Cola de emails (jobs últimos 7 días)

**Resultados:**
- Se guardan en tabla `admin_health_logs`
- Se muestran en Dashboard Admin → "Estado del Sistema"
- Si hay fallos, envía email de alerta
- (Opcional) Actualiza `.same/todos.md` vía GitHub

---

## 🚀 Activación en 3 Pasos

### Paso 1: Crear Tablas en Supabase (2 min)

**⚠️ CRÍTICO - Sin esto no funciona nada**

1. Ir a **Supabase Dashboard**
2. Click en **SQL Editor** (menú izquierdo)
3. Click en **"New query"**
4. Abrir el archivo: `custodia-360/scripts/sql/admin-health.sql`
5. Copiar **TODO** el contenido
6. Pegar en el editor SQL de Supabase
7. Click en **"Run"** o **Ctrl+Enter**
8. Verificar que no hay errores
9. Ir a **Table Editor** y confirmar que existen:
   - ✅ `admin_health_logs`
   - ✅ `email_events`

**Qué crea este SQL:**
```
- admin_health_logs (auditorías diarias)
  └─ id, created_at, scope, status, summary, details, markdown

- email_events (eventos de Resend webhook)
  └─ id, created_at, event_type, email_id, to_email, from_email,
     subject, timestamp, error, raw_data
```

---

### Paso 2: Ejecutar Primera Auditoría (1 min)

**Verificar que todo funciona**

1. Abrir en navegador: `https://www.custodia360.es/api/ops/audit-live`

2. Debe devolver un JSON como:
   ```json
   {
     "ok": true,
     "status": "ok" | "warn" | "fail",
     "log_id": "uuid...",
     "summary": "✅ Sistema operativo",
     "details": { ... }
   }
   ```

3. Ir a **Supabase → Table Editor → admin_health_logs**
4. Debe haber 1 registro nuevo con:
   - `status`: ok/warn/fail
   - `summary`: texto del estado
   - `markdown`: informe completo

**Si falla:**
- Verifica que el paso 1 se ejecutó correctamente
- Revisa la consola del navegador (F12)
- Confirma que las variables de entorno están configuradas

---

### Paso 3: Verificar Dashboard Admin (1 min)

**Ver la tarjeta de estado**

1. Ir a: `https://www.custodia360.es/admin`

2. Debe aparecer una tarjeta **"Estado del Sistema"** con:
   - 🟢/🟡/🔴 Indicador de estado
   - Fecha y hora de última auditoría
   - Resumen de componentes (vars, tablas, templates, Resend, workers)
   - Botones "Actualizar" y "Ver detalles"

3. Click en **"Ver detalles"** para expandir:
   - Advertencias (si las hay)
   - Fallos críticos (si los hay)
   - Variables faltantes
   - Tablas/templates faltantes
   - Cola de mensajes
   - Informe markdown completo

4. Click en **"Actualizar"** para ejecutar auditoría on-demand

**Si no aparece la tarjeta:**
- Verifica que hay al menos 1 registro en `admin_health_logs`
- Recarga la página con Ctrl+F5
- Revisa la consola (F12) por errores

---

## ⚙️ Componentes Implementados

### 1. Webhook Permanente Resend
**Archivo:** `src/app/api/webhooks/resend/route.ts`

- Recibe eventos de Resend (sent, delivered, opened, clicked, failed, bounced, complained)
- Valida firma HMAC SHA256 (si está configurado RESEND_WEBHOOK_SECRET)
- Inserta en tabla `email_events`
- Upsert por `email_id` para evitar duplicados

**URL pública:** `https://www.custodia360.es/api/webhooks/resend`

### 2. Endpoint de Auditoría
**Archivo:** `src/app/api/ops/audit-live/route.ts`

Verifica:
- Variables de entorno (7 críticas)
- Tablas Supabase (10 core)
- Templates (13 esperados)
- Dominio Resend
- Workers (3 automatizaciones)
- Message jobs (últimos 7 días)

Genera:
- Status global: ok/warn/fail
- Summary textual
- Details JSON estructurado
- Markdown con informe completo

Guarda en `admin_health_logs` y opcionalmente actualiza GitHub.

### 3. Función Programada Netlify
**Archivo:** `netlify/functions/c360_daily_audit.ts`

- Cron: `0 * * * *` (cada hora)
- Control: solo ejecuta a las 09:00 Europe/Madrid
- Maneja horario verano/invierno
- Llama a `/api/ops/audit-live`
- Si status='fail', encola email de alerta

**Configurado en:** `netlify.toml`

### 4. Tarjeta Dashboard Admin
**Componente:** `src/components/admin/SystemStatusWidget.tsx`

- Lee último registro de `admin_health_logs`
- Muestra estado visual (verde/amarillo/rojo)
- Resumen de componentes
- Detalles expandibles
- Botón de actualización on-demand

**Ubicación:** `/admin` (Dashboard Administrativo)

---

## 📋 Variables de Entorno Verificadas

**Críticas (deben estar configuradas):**
- `APP_BASE_URL`
- `NEXT_PUBLIC_APP_BASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NOTIFY_EMAIL_FROM`
- `APP_TIMEZONE`

**Opcionales para funciones extra:**
- `GITHUB_TOKEN` - Para actualizar `.same/todos.md` automáticamente
- `GITHUB_REPO` - Formato: `owner/repo` (ej: `ramonsune/custodia-360`)
- `GITHUB_BRANCH` - Por defecto: `main`
- `RESEND_WEBHOOK_SECRET` - Para validar firma del webhook

---

## 📊 Tablas Verificadas

**Supabase (10 core):**
1. `entities`
2. `entity_people`
3. `family_children`
4. `entity_compliance`
5. `entity_invite_tokens`
6. `miniquiz_attempts`
7. `message_jobs`
8. `message_templates`
9. `email_events`
10. `subscriptions`

**Nuevas (auditoría):**
- `admin_health_logs`

---

## 📧 Templates Verificados (13)

1. `contact-auto-reply`
2. `contractor-confirm`
3. `admin-invoice`
4. `delegate-welcome`
5. `delegate-supl-welcome`
6. `billing-5m-reminder`
7. `billing-11m-reminder`
8. `training-start`
9. `training-certified`
10. `channel-verify`
11. `compliance-blocked`
12. `onboarding-delay`
13. `kit-comm-invite`

---

## 🤖 Workers Verificados (3)

1. `mailer-dispatch` - Envío de emails encolados
2. `compliance-guard` - Monitoreo de deadlines
3. `onboarding-guard` - Gestión de onboarding

---

## 🔔 Sistema de Alertas

Si la auditoría detecta status='fail':

1. Se encola un mensaje en `message_jobs`
2. Template: `ops-alert`
3. Destinatario: `NOTIFY_EMAIL_FROM` o `ADMIN_EMAIL`
4. Contiene: summary, details, log_id

**Para activar alertas por email:**
1. Crear template `ops-alert` en Supabase (`message_templates`)
2. Configurar variable `ADMIN_EMAIL` en Netlify (opcional)

---

## 🐙 Integración GitHub (Opcional)

Si quieres que la auditoría actualice `.same/todos.md` automáticamente:

1. **Crear Personal Access Token en GitHub:**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Scopes: `repo` (Full control of private repositories)
   - Copiar el token generado

2. **Configurar en Netlify:**
   - Site Settings → Environment Variables
   - Añadir:
     - `GITHUB_TOKEN` = `ghp_...` (tu token)
     - `GITHUB_REPO` = `ramonsune/custodia-360`
     - `GITHUB_BRANCH` = `main` (opcional, por defecto main)

3. **Verificar:**
   - Ejecutar auditoría manual: `/api/ops/audit-live`
   - Ir a GitHub → `.same/todos.md`
   - Debe haber un commit nuevo: "chore: daily audit"
   - Al final del archivo debe aparecer: "### 🏥 Auditoría Daily [fecha]"

---

## 🔧 Configuración Webhook Resend (Opcional)

**Para trazabilidad completa de emails:**

1. Ir a **Resend Dashboard** → **Webhooks**
2. Click **"Add webhook"**
3. Configurar:
   - **URL:** `https://www.custodia360.es/api/webhooks/resend`
   - **Events:**
     - ✅ `email.sent`
     - ✅ `email.delivered`
     - ✅ `email.bounced`
     - ✅ `email.complained`
     - ✅ `email.opened`
     - ✅ `email.clicked`
4. Click **"Create webhook"**
5. (Opcional) Copiar **Signing Secret** → `RESEND_WEBHOOK_SECRET` en Netlify

**Verificar:**
- Enviar un email de prueba
- Ir a Supabase → Table Editor → `email_events`
- Debe haber 1+ registros con los eventos del email

---

## 🧪 Pruebas y Verificación

### Test 1: Auditoría Manual
```bash
curl https://www.custodia360.es/api/ops/audit-live
```
Debe devolver JSON con status ok/warn/fail

### Test 2: Webhook Resend
1. Enviar email real (p.ej. template delegate-welcome)
2. Verificar evento en `email_events` tabla

### Test 3: Dashboard Admin
1. Abrir `/admin`
2. Ver tarjeta "Estado del Sistema"
3. Click "Actualizar"
4. Click "Ver detalles"

### Test 4: Cron Job (producción)
1. Esperar al día siguiente a las 09:00 Madrid
2. Verificar nuevo registro en `admin_health_logs`
3. Revisar logs en Netlify Functions

---

## 🐛 Troubleshooting

### "No hay datos de auditoría disponibles"
- Ejecuta paso 1 (crear tablas SQL)
- Ejecuta paso 2 (auditoría manual)
- Recarga la página

### "Tabla admin_health_logs no existe"
- Vuelve a ejecutar `scripts/sql/admin-health.sql` en Supabase
- Verifica que no hubo errores en la ejecución

### "Error 500 en /api/ops/audit-live"
- Revisa variables de entorno en Netlify
- Verifica que SUPABASE_SERVICE_ROLE_KEY está configurado
- Revisa logs en Netlify Functions

### "No llegan eventos de Resend"
- Verifica que configuraste el webhook en Resend Dashboard
- Confirma URL: `https://www.custodia360.es/api/webhooks/resend`
- Envía email de prueba y espera 1-2 minutos
- Revisa logs en Resend Dashboard → Webhooks → Logs

### "Auditoría no se ejecuta a las 09:00"
- Verifica que c360_daily_audit está en netlify.toml
- Revisa logs en Netlify Functions
- Confirma variable APP_TIMEZONE = 'Europe/Madrid'

---

## 📚 Documentación Relacionada

- **Todos:** `.same/todos.md` - Estado del proyecto
- **SQL:** `scripts/sql/admin-health.sql` - Tablas de auditoría
- **Webhook Resend:** `INSTRUCCIONES-WEBHOOK-RESEND.md`
- **Auditoría Live Ready:** `INFORME-LIVE-READY.md`

---

## ✅ Checklist de Activación

- [ ] Paso 1: SQL ejecutado en Supabase
- [ ] Paso 2: Auditoría manual ejecutada
- [ ] Paso 3: Dashboard Admin verificado
- [ ] (Opcional) GitHub Token configurado
- [ ] (Opcional) Webhook Resend configurado
- [ ] (Opcional) Template ops-alert creado

---

**Sistema implementado:** 21 de octubre de 2025
**Modo Consolidación:** Activo - No se modificó código existente
**Estado:** Listo para activación manual

---

*Para soporte técnico, consulta `.same/todos.md` o contacta con el equipo de desarrollo.*
