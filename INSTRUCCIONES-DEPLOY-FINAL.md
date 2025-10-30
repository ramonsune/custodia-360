# 🚀 Instrucciones de Activación - Sistema de Monitoreo

**Fecha:** 21 de octubre de 2025
**Sistema:** Custodia360 v187 - Auditoría y Monitoreo Automatizado

---

## ⚡ Resumen Ejecutivo

El sistema de monitoreo y auditoría está **100% implementado** y listo para activar.

**Requiere solo 1 acción manual:**
- Ejecutar SQL en Supabase (2 minutos)

---

## 📋 Paso 1: Ejecutar SQL en Supabase (2 min)

### 1.1 Abrir Supabase SQL Editor

1. Ve a: **https://supabase.com/dashboard/project/[tu-proyecto]**
2. Click en **"SQL Editor"** (menú izquierdo)
3. Click en **"New query"**

### 1.2 Ejecutar SQL

1. Abre el archivo: `custodia-360/scripts/sql/admin-health.sql`
2. Copia **TODO** el contenido
3. Pega en el editor SQL de Supabase
4. Click en **"Run"** o presiona **Ctrl+Enter**

### 1.3 Verificar Ejecución

Deberías ver: `Success. No rows returned`

Ve a **Table Editor** y confirma que existen:
- ✅ `admin_health_logs`
- ✅ `email_events`

---

## ✅ Paso 2: Verificar Funcionamiento (3 min)

### 2.1 Probar Endpoint de Auditoría

Abre en navegador:
```
https://www.custodia360.es/api/ops/audit-live
```

Debes ver un JSON como:
```json
{
  "ok": true,
  "status": "ok",
  "log_id": "uuid-...",
  "summary": "✅ Sistema operativo",
  "details": { ... }
}
```

### 2.2 Verificar Dashboard Admin

1. Abre: `https://www.custodia360.es/admin`
2. Busca la tarjeta **"Estado del Sistema"**
3. Debe mostrar:
   - 🟢 Estado (OK / Advertencia / Incidencia)
   - Fecha y hora de última auditoría
   - Chips de componentes (Supabase, Resend, Workers, etc.)
   - Botones "Actualizar" y "Ver detalles"

### 2.3 Probar Auditoría On-Demand

1. En el dashboard admin, click en **"Actualizar"**
2. Espera 2-3 segundos
3. La tarjeta debe refrescarse con nueva fecha/hora

---

## 📧 Paso 3: Configurar Webhook Resend (Opcional - 5 min)

**Para trazabilidad de emails enviados:**

1. Ve a **Resend Dashboard** → **Webhooks**
2. Click **"Add webhook"**
3. Configurar:
   - **URL:** `https://www.custodia360.es/api/webhooks/resend`
   - **Events a escuchar:**
     - ✅ `email.sent`
     - ✅ `email.delivered`
     - ✅ `email.bounced`
     - ✅ `email.complained`
     - ✅ `email.opened`
     - ✅ `email.clicked`
4. Click **"Create webhook"**
5. (Opcional) Copiar **Signing Secret** y añadir a Netlify:
   - Variable: `RESEND_WEBHOOK_SECRET`
   - Valor: el secret de Resend

### Verificar Webhook

1. Envía un email de prueba (ej: delegate-welcome)
2. Ve a Supabase → Table Editor → `email_events`
3. Debe haber al menos 1 registro con `event_type = 'email.sent'`

---

## ⏰ Auditoría Diaria Automática

**Ya está configurada y activa en Netlify:**

- **Frecuencia:** Cada hora (cron: `0 * * * *`)
- **Ejecución real:** Solo a las 09:00 Europe/Madrid
- **Función:** `netlify/functions/c360_daily_audit.ts`
- **Qué hace:**
  1. Llama a `/api/ops/audit-live`
  2. Guarda resultado en `admin_health_logs`
  3. Si status = 'fail', envía email de alerta
  4. Logs visibles en Netlify Functions

**Ver en Netlify:**
- Dashboard → Functions → `c360_daily_audit`
- Logs → última ejecución

---

## 🔍 Componentes Implementados

### 1. Webhook Resend (PERMANENTE)
- **Archivo:** `src/app/api/webhooks/resend/route.ts`
- **Método:** POST
- **Funcionalidad:**
  - Recibe eventos de Resend
  - Valida firma HMAC (si existe RESEND_WEBHOOK_SECRET)
  - Guarda en `email_events` (upsert por email_id)
  - **Siempre devuelve 200** (evita reintentos)

### 2. Endpoint Auditoría (PERMANENTE)
- **Archivo:** `src/app/api/ops/audit-live/route.ts`
- **Método:** GET
- **Verifica:**
  - 7 variables de entorno críticas
  - 10 tablas Supabase core
  - 13 templates de mensaje
  - Dominio Resend (custodia360.es)
  - 3 workers/automatizaciones
  - Jobs de últimos 7 días
- **Resultado:** JSON con status (ok/warn/fail) + detalles

### 3. Función Programada (PERMANENTE)
- **Archivo:** `netlify/functions/c360_daily_audit.ts`
- **Cron:** Cada hora, ejecuta solo a las 09:00 Madrid
- **Acciones:**
  - Llama a endpoint de auditoría
  - Si fail → encola email de alerta
  - Logs en Netlify

### 4. Tarjeta Dashboard Admin (PERMANENTE)
- **Componente:** `src/components/admin/SystemStatusWidget.tsx`
- **Ubicación:** `/admin`
- **Funcionalidad:**
  - Lee último `admin_health_logs`
  - Muestra estado visual (🟢/🟡/🔴)
  - Chips de componentes
  - Botón "Actualizar" → ejecuta auditoría on-demand
  - Botón "Ver detalles" → expande info completa

### 5. SQL de Apoyo (PERMANENTE)
- **Archivo:** `scripts/sql/admin-health.sql`
- **Crea:**
  - Tabla `admin_health_logs` (auditorías)
  - Tabla `email_events` (eventos Resend)
  - Índices y políticas RLS

### 6. Configuración Netlify
- **Archivo:** `netlify.toml`
- **Incluye:**
  - Redirect `/onboarding/*`
  - Scheduled function `c360_daily_audit`
  - Variables de entorno

---

## 📊 Verificación de Variables de Entorno

**Asegurar que están configuradas en Netlify:**

```bash
APP_BASE_URL = https://www.custodia360.es
NEXT_PUBLIC_APP_BASE_URL = https://www.custodia360.es
NEXT_PUBLIC_SUPABASE_URL = https://gkoyqfusawhnobvkoijc.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbG...
RESEND_API_KEY = re_JfPp...
NOTIFY_EMAIL_FROM = no-reply@custodia360.es
APP_TIMEZONE = Europe/Madrid
```

**Opcional:**
```bash
RESEND_WEBHOOK_SECRET = (secret de Resend)
```

---

## 🧪 Testing Completo

### Test 1: Auditoría Manual
```bash
curl https://www.custodia360.es/api/ops/audit-live
```
Debe devolver JSON con `status: 'ok'|'warn'|'fail'`

### Test 2: Dashboard Admin
1. Abrir `/admin`
2. Ver tarjeta "Estado del Sistema"
3. Click "Actualizar"
4. Click "Ver detalles"

### Test 3: Webhook Resend (si configurado)
1. Enviar email real
2. Verificar en Supabase: `select * from email_events order by created_at desc limit 5;`

### Test 4: Auditoría Diaria
1. Esperar al día siguiente a las 09:00 Madrid
2. Verificar en Supabase: `select * from admin_health_logs order by created_at desc limit 3;`
3. Revisar logs en Netlify Functions

---

## 🐛 Troubleshooting

### "Table admin_health_logs not found"
- **Solución:** Ejecutar `scripts/sql/admin-health.sql` en Supabase

### "Webhook Resend no registra eventos"
- **Verificar:** URL webhook en Resend Dashboard
- **Verificar:** Eventos seleccionados
- **Verificar:** Tabla `email_events` existe

### "Auditoría no se ejecuta a las 09:00"
- **Verificar:** Función programada en Netlify (c360_daily_audit)
- **Verificar:** Variable `APP_TIMEZONE = Europe/Madrid`
- **Revisar:** Logs en Netlify Functions

### "No aparece tarjeta en Dashboard Admin"
- **Verificar:** Al menos 1 registro en `admin_health_logs`
- **Solución:** Ejecutar auditoría manual primero
- **Recargar:** Ctrl+F5 en navegador

---

## ✅ Checklist de Activación

- [ ] SQL ejecutado en Supabase (`admin-health.sql`)
- [ ] Tabla `admin_health_logs` creada
- [ ] Tabla `email_events` creada
- [ ] Endpoint `/api/ops/audit-live` responde OK
- [ ] Dashboard Admin muestra tarjeta "Estado del Sistema"
- [ ] Botón "Actualizar" funciona
- [ ] (Opcional) Webhook Resend configurado
- [ ] (Opcional) Variables de entorno verificadas en Netlify

---

## 🎯 Resultado Final

**Estado:** Sistema de monitoreo 100% funcional

**Capacidades:**
- ✅ Auditoría diaria automática (09:00 Madrid)
- ✅ Auditoría on-demand desde dashboard admin
- ✅ Trazabilidad de emails (si webhook activo)
- ✅ Alertas automáticas si fallos críticos
- ✅ Visualización en tiempo real del estado del sistema
- ✅ Histórico completo de auditorías

**Pendientes opcionales:**
- ⚠️ Configurar webhook Resend (recomendado)
- ⚠️ Configurar Stripe para modo Live (fuera de alcance)

---

**Sistema listo para producción (sin Stripe)**
**Fecha:** 21 de octubre de 2025
**Modo Consolidación:** ✅ Activo - No se modificó lógica de negocio
