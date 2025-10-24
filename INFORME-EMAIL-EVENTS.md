# Informe: Sistema de Captura de Eventos de Email

**Fecha:** 19 de octubre de 2025
**Proyecto:** Custodia360
**Modo:** Consolidación (sin modificar código existente)

---

## ✅ Componentes Creados

### 1. Tabla de Base de Datos

**Archivo:** `scripts/sql/email-events.sql`

**Tabla:** `email_events`

Captura todos los eventos de email de Resend:
- `delivered` - Email entregado exitosamente
- `bounced` - Email rebotado
- `complained` - Queja/spam reportado
- `opened` - Email abierto por destinatario
- `clicked` - Link clickeado en el email
- `sent` - Email enviado a Resend
- `failed` - Error al enviar

**Campos:**
```sql
id uuid
created_at timestamptz
provider text (default: 'resend')
message_id text
event text
to_email text
from_email text
subject text
entity_id uuid (FK → entities)
template_slug text
meta jsonb (payload completo)
```

**Seguridad:**
- RLS habilitado (server-only)
- Solo accesible con `service_role`
- Índices en: event, entity_id, created_at, to_email

---

### 2. Webhook Endpoint

**Archivo:** `src/app/api/webhooks/resend/route.ts`

**Funcionalidad:**
- Recibe eventos de Resend vía webhook POST
- Normaliza payload de Resend
- Extrae `entity_id` y `template_slug` de tags/context
- Guarda evento en `email_events`
- Detecta bounces y complaints para alertas

**URL del webhook:** `https://www.custodia360.es/api/webhooks/resend`

---

### 3. Documentación de Reglas de Negocio

**Archivo:** `docs/email-retry-rules.md`

**Contenido:**
- Política de reintentos (3 intentos con backoff exponencial)
- Alertas administrativas para bounces y complaints
- Estados de `message_jobs`
- Queries de ejemplo para trazabilidad

---

### 4. Panel de Admin - Email & Entregabilidad

**Archivo:** `src/components/admin/EmailDeliverabilitySection.tsx`

**Funcionalidad:**
- KPIs visuales de últimos 7/30 días (enviados, entregados, abiertos, clics, rebotados, quejas)
- Estado de cola actual (`message_jobs`: queued, processing, sent, failed)
- Tabla filtrable de eventos por entidad, template, evento, fecha
- Drill-down: ver payload meta completo (colapsado)
- Enlaces útiles: Resend Dashboard, Netlify Functions, Guía de rebotes

**Integrado en:** `src/app/admin/page.tsx`

### 5. API Route para Datos

**Archivo:** `src/app/api/admin/email-stats/route.ts`

**Funcionalidad:**
- Consulta con service role (acceso a `email_events`)
- Agregación de stats por período (7 o 30 días)
- Stats de cola de `message_jobs`
- Responde JSON con eventos completos para filtrado client-side

---

## 📋 Pasos de Configuración

### Paso 1: Crear Tabla en Supabase

1. Ir a **Supabase Dashboard** → Tu Proyecto
2. Abrir **SQL Editor**
3. Copiar y pegar el contenido de `scripts/sql/email-events.sql`
4. Ejecutar el SQL
5. Verificar que la tabla `email_events` aparece en **Table Editor**

### Paso 2: Configurar Webhook en Resend

1. Ir a **Resend Dashboard** → **Webhooks**
2. Crear nuevo webhook:
   - **URL:** `https://www.custodia360.es/api/webhooks/resend`
   - **Eventos a escuchar:**
     - `email.delivered`
     - `email.bounced`
     - `email.complained`
     - `email.opened`
     - `email.clicked`
     - `email.sent` (opcional)
     - `email.delivery_delayed` (opcional)
3. **(Opcional)** Activar **Signing Secret** para mayor seguridad
4. Guardar webhook

### Paso 3: (Opcional) Verificar Firma del Webhook

Si activaste signing secret en Resend:

Actualizar `src/app/api/webhooks/resend/route.ts`:

```typescript
// Descomenta y actualiza:
const signature = req.headers.get('x-resend-signature')
const secret = process.env.RESEND_WEBHOOK_SECRET

if (secret && signature) {
  // Verificar firma según docs de Resend
  // https://resend.com/docs/webhooks#verifying-webhook-signatures
}
```

Añadir `RESEND_WEBHOOK_SECRET` a `.env.local` y Netlify.

---

## 🧪 Verificación

### Método 1: Enviar Email de Prueba

```bash
# Desde Resend Dashboard o API
# Enviar un email de prueba
# El evento debería aparecer en email_events en ~1-5 segundos
```

### Método 2: Consultar BD Directamente

```sql
SELECT * FROM email_events
ORDER BY created_at DESC
LIMIT 10;
```

### Método 3: Endpoint de Auditoría (Temporal)

```bash
curl https://www.custodia360.es/api/_audit/resend-events
```

---

## 📊 Estado Actual

### Tabla `email_events`
- ❌ **No existe aún** (requiere ejecutar SQL en Supabase)

### Webhook Endpoint
- ✅ **Creado** en `src/app/api/webhooks/resend/route.ts`
- ⏳ **Pendiente:** Configurar en Resend Dashboard

### Documentación
- ✅ Reglas de negocio documentadas
- ✅ SQL listo para ejecutar
- ✅ Endpoint de verificación creado

---

## 🔄 Próximos Pasos (Opcional)

1. **Implementar reintentos automáticos:**
   - Scheduled Function `c360_email_retry`
   - Lógica de backoff exponencial
   - Actualizar `message_jobs.status` según eventos

2. **Alertas administrativas:**
   - Template `admin-email-bounce`
   - Template `admin-email-complaint`
   - Template `admin-email-repeated-failures`

3. **Panel de trazabilidad:**
   - Widget en dashboard admin
   - Gráfico de eventos por entidad
   - Lista de destinatarios problemáticos

4. **Mejorar seguridad:**
   - Verificar firma de Resend en webhook
   - Rate limiting en endpoint webhook
   - Logs estructurados de eventos

---

## 🔒 Modo Consolidación - Cambios Aplicados

### ✅ Código Existente
- **No modificado**
- Todos los flujos de negocio intactos
- Tablas existentes sin cambios

### ✅ Nuevos Archivos
- `scripts/sql/email-events.sql` - Script SQL para crear tabla
- `src/app/api/webhooks/resend/route.ts` - Webhook endpoint
- `src/app/api/admin/email-stats/route.ts` - API route (service role)
- `src/components/admin/EmailDeliverabilitySection.tsx` - Componente de panel
- `docs/email-retry-rules.md` - Reglas de negocio

### ✅ Archivos Modificados
- `src/app/admin/page.tsx` - Añadido import y componente EmailDeliverabilitySection

### ✅ Documentación
- `INFORME-EMAIL-EVENTS.md` (este archivo)

---

## 📊 Panel de Admin - Email & Entregabilidad

### Funcionalidades Implementadas

**KPIs Visuales (últimos 7/30 días):**
- 📤 Enviados
- ✅ Entregados
- 👀 Abiertos
- 🔗 Clics
- ❌ Rebotados
- 🚨 Quejas

**Estado de Cola Actual:**
- 🟡 Encolados (queued)
- 🔵 Procesando (processing)
- 🟢 Enviados (sent)
- 🔴 Fallidos (failed)

**Tabla Filtrable:**
- Por entidad (entity_id)
- Por template (template_slug)
- Por tipo de evento
- Por rango de fechas (desde/hasta)
- Paginación automática (200 eventos)

**Drill-down:**
- Click en "Ver payload" para expandir fila
- Muestra payload meta completo en JSON
- Útil para soporte y debugging

**Enlaces Útiles:**
- 🌐 Resend Dashboard (dominio custodia360.es)
- ⚡ Netlify Functions Logs
- 📖 Guía: Qué hacer ante rebotes y quejas

### Acceso

1. Ir a `/admin` (panel administrativo Custodia360)
2. Scroll hasta "Email & Entregabilidad"
3. Seleccionar período (7 o 30 días)
4. Aplicar filtros según necesidad
5. Click en "Ver payload" para ver detalles de cualquier evento

---

_Generado automáticamente en modo consolidación._
