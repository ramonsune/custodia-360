# 📧 Sistema de Emails Automáticos - Custodia360

## 🎯 Descripción General

Sistema completo de emails transaccionales con Resend y Supabase para:
- Bienvenida de delegados
- Invitaciones de onboarding
- Recordatorios automáticos (30 días)
- Resultados de tests
- Compartir documentos
- Informes de inspección
- Facturas a administración
- Confirmaciones de contratación

---

## 1️⃣ CONFIGURACIÓN INICIAL

### Variables de Entorno

Agregar en **Netlify** y en `.env.local`:

```bash
APP_BASE_URL=https://www.custodia360.es
NEXT_PUBLIC_APP_BASE_URL=https://www.custodia360.es
RESEND_API_KEY=re_***  # Obtener de Resend dashboard
NOTIFY_EMAIL_FROM=no-reply@custodia360.es
APP_TIMEZONE=Europe/Madrid
```

### Verificación de Dominio en Resend

**PASO A PASO (hacer manualmente):**

1. Ir a [Resend Dashboard](https://resend.com/domains)
2. Click en "Add Domain"
3. Ingresar: `custodia360.es`
4. Resend mostrará registros DNS:
   - TXT record para verificación
   - CNAME records para SPF/DKIM
5. Agregar estos registros en tu proveedor DNS (ej: Cloudflare, Namecheap)
6. Esperar verificación (puede tardar hasta 48h)
7. Verificar estado "Verified" en Resend
8. **NO enviar emails hasta que esté verificado**

---

## 2️⃣ ESTRUCTURA DE BASE DE DATOS

### Tablas Creadas

1. **`message_templates`** - Plantillas de mensajes
   - `slug`: Identificador único (ej: "welcome-delegado")
   - `asunto`: Subject del email (Handlebars)
   - `cuerpo`: Body del email (Handlebars)
   - `segmento`: A quién va dirigido

2. **`message_jobs`** - Cola de envíos
   - `entity_id`: Entidad relacionada
   - `template_slug`: Plantilla a usar
   - `context`: Variables para renderizar (JSON)
   - `status`: queued → processing → sent/error
   - `idempotency_key`: Evita duplicados

3. **`message_recipients`** - Destinatarios
   - `job_id`: Job asociado
   - `to_email`: Email destino
   - `provider_message_id`: ID de Resend
   - `status`: pending → sent → delivered/bounced

### Migración

```bash
# Ejecutar migración en Supabase SQL Editor
supabase/migrations/20250111_email_system.sql
```

---

## 3️⃣ PLANTILLAS DISPONIBLES

| Slug | Destinatario | Cuándo se Envía |
|------|-------------|----------------|
| `welcome-delegado` | Delegado | Tras pago confirmado + crear usuario |
| `onboarding-invite` | Miembros | Al generar link de onboarding |
| `rec-30d-contacto` | Contacto | D+7, D+21, D+28 (pendientes) |
| `alerta-delegado-30d` | Delegado | D+30 (vencidos) |
| `resultado-test` | Participante | Al completar test |
| `share-doc` | Todos | Al compartir documento |
| `inspeccion-report` | Delegado | Al generar informe |
| `factura-administracion` | Administración | Invoice paid (Stripe) |
| `confirmacion-contratante` | Contratante | Tras pago confirmado |

### Variables Disponibles en Templates

```handlebars
{{nombre}}
{{entidad}}
{{panel_url}}              → https://www.custodia360.es/dashboard-delegado
{{onboarding_url}}         → https://www.custodia360.es/i/TOKEN
{{fecha_limite}}
{{plan_contratado}}
{{credenciales_usuario}}
{{credenciales_password}}
{{factura_url}}            → Stripe hosted invoice URL
{{informe_url}}            → Signed URL (10 min)
{{doc_url}}                → Signed URL
{{doc_nombre}}
{{aciertos}} / {{total}}
{{resultado}}
{{siguiente_paso}}
{{vencidos_list}}
{{pendiente_list}}
```

---

## 4️⃣ ENDPOINTS API

### POST `/api/messages/enqueue`

Encola un mensaje para envío.

**Request:**
```json
{
  "entityId": "uuid",
  "templateSlug": "welcome-delegado",
  "recipients": [
    { "email": "delegado@example.com", "personId": "uuid" }
  ],
  "context": {
    "nombre": "Juan Pérez",
    "entidad": "Club Deportivo ABC",
    "credenciales_usuario": "juan@club.com",
    "credenciales_password": "temporal123",
    "plan_contratado": "Plan 100"
  },
  "idempotencyKey": "welcome-delegado-uuid",
  "scheduleAt": null  // o fecha ISO para programar
}
```

**Response:**
```json
{
  "success": true,
  "job": { "id": 123, ... },
  "recipientsCount": 1
}
```

### POST `/api/messages/dispatch`

Ejecuta manualmente el despachador (procesa cola).

**Request:** (vacío)

**Response:**
```json
{
  "success": true,
  "result": {
    "processed": 5,
    "results": [...]
  }
}
```

### POST `/api/webhooks/resend`

Webhook para recibir estados de Resend (delivered/bounced).

**Configurar en Resend:**
- URL: `https://www.custodia360.es/api/webhooks/resend`
- Eventos: email.delivered, email.bounced, email.complained

---

## 5️⃣ EDGE FUNCTIONS

### `c360-mailer-dispatch`

**Función:** Procesa jobs encolados y envía emails vía Resend.

**Cómo funciona:**
1. Lee jobs con `status='queued'` y `scheduled_for <= now()`
2. Marca job como `processing`
3. Carga template por `slug`
4. Para cada recipient:
   - Construye contexto con URLs absolutas
   - Renderiza subject y body
   - Envía vía Resend API
   - Guarda `provider_message_id`
5. Actualiza job a `sent` o `error`

**Deploy:**
```bash
supabase functions deploy c360-mailer-dispatch
```

**Test manual:**
```bash
curl -X POST \
  'https://YOUR_PROJECT.supabase.co/functions/v1/c360-mailer-dispatch' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

### `c360-reminders-30d`

**Función:** Recordatorios automáticos según días desde contratación.

**Lógica:**
- D0: Envía `onboarding-invite` a todos
- D+7, D+21, D+28: Envía `rec-30d-contacto` a pendientes
- D+30: Envía `alerta-delegado-30d` al delegado

**Deploy:**
```bash
supabase functions deploy c360-reminders-30d
```

---

## 6️⃣ SCHEDULES (CREAR EN SUPABASE CONSOLE)

### A) Despachador de Cola (cada 10 minutos)

**Ir a:** Supabase Dashboard → Edge Functions → Schedules → New

- **Name:** `c360_mailer_dispatch_10m`
- **Function:** `c360-mailer-dispatch`
- **Cron (UTC):** `*/10 * * * *`
- **Enabled:** ON

**Verificar:** Click "Run now" y revisar logs.

### B) Recordatorios 30 Días (diario 08:00 UTC ≈ 09:00 Madrid)

- **Name:** `c360_reminders_30d_daily`
- **Function:** `c360-reminders-30d`
- **Cron (UTC):** `0 8 * * *`
- **Enabled:** ON

**Verificar:** Click "Run now" y revisar logs.

---

## 7️⃣ DISPARADORES DE EMAILS

### A) Contratación Pagada (Stripe → Supabase)

**Cuándo:** Webhook `invoice.payment_succeeded` o `checkout.session.completed`

**Qué hacer:**
1. Marcar `entities.pago_confirmado = true`
2. Crear usuario del delegado en Supabase Auth
3. **Encolar 2 emails:**

```typescript
// Email 1: Confirmación al contratante
await fetch('/api/messages/enqueue', {
  method: 'POST',
  body: JSON.stringify({
    entityId: entity.id,
    templateSlug: 'confirmacion-contratante',
    recipients: [{ email: contratanteEmail }],
    context: {
      nombre: contratanteNombre,
      entidad: entity.nombre,
      plan_contratado: 'Plan 100'
    },
    idempotencyKey: `confirmacion-contratante-${entity.id}`
  })
});

// Email 2: Bienvenida al delegado
await fetch('/api/messages/enqueue', {
  method: 'POST',
  body: JSON.stringify({
    entityId: entity.id,
    templateSlug: 'welcome-delegado',
    recipients: [{ email: delegadoEmail }],
    context: {
      nombre: delegadoNombre,
      entidad: entity.nombre,
      credenciales_usuario: delegadoEmail,
      credenciales_password: temporalPassword
    },
    idempotencyKey: `welcome-delegado-${entity.id}`
  })
});
```

### B) Factura a Administración (Stripe)

**Cuándo:** Webhook `invoice.paid`

```typescript
await fetch('/api/messages/enqueue', {
  method: 'POST',
  body: JSON.stringify({
    entityId: entity.id,
    templateSlug: 'factura-administracion',
    recipients: [{ email: adminEmail }],
    context: {
      entidad: entity.nombre,
      factura_url: invoice.hosted_invoice_url
    },
    idempotencyKey: `factura-${invoice.id}`
  })
});
```

### C) Enlace de Onboarding (Delegado genera token)

**Cuándo:** Delegado genera/renueva token en `/panel/delegado/configuracion`

```typescript
// Para cada persona con email
await fetch('/api/messages/enqueue', {
  method: 'POST',
  body: JSON.stringify({
    entityId: entity.id,
    templateSlug: 'onboarding-invite',
    recipients: personas.map(p => ({
      email: p.email,
      personId: p.id
    })),
    context: {
      token: newToken,
      entidad: entity.nombre,
      fecha_limite: formatDate(addDays(new Date(), 30))
    },
    idempotencyKey: `onb-${entity.id}-${Date.now()}`
  })
});
```

### D) Resultado del Test

**Cuándo:** En `/api/public/onboarding/submit` tras guardar `test_score`

```typescript
await fetch('/api/messages/enqueue', {
  method: 'POST',
  body: JSON.stringify({
    entityId: entity.id,
    templateSlug: 'resultado-test',
    recipients: [{ email: participante.email }],
    context: {
      nombre: participante.nombre,
      resultado: testPassed ? 'APROBADO' : 'PENDIENTE',
      aciertos: score,
      total: 10,
      siguiente_paso: testPassed
        ? 'Ya puedes acceder al panel'
        : 'Revisa el material y vuelve a intentarlo'
    },
    idempotencyKey: `test-${personId}`
  })
});
```

### E) Compartir Documento

**Cuándo:** Al crear un share en biblioteca

```typescript
const signedUrl = await supabase.storage
  .from('documentos')
  .createSignedUrl(docPath, 600); // 10 min

await fetch('/api/messages/enqueue', {
  method: 'POST',
  body: JSON.stringify({
    entityId: entity.id,
    templateSlug: 'share-doc',
    recipients: [{ email: destinatario.email }],
    context: {
      nombre: destinatario.nombre,
      doc_nombre: documento.nombre,
      doc_url: signedUrl.signedUrl
    },
    idempotencyKey: `share-${shareId}`
  })
});
```

### F) Informe de Inspección

**Cuándo:** Tras generar y guardar informe (save=true)

```typescript
const signedUrl = await supabase.storage
  .from('informes')
  .createSignedUrl(informePath, 600);

await fetch('/api/messages/enqueue', {
  method: 'POST',
  body: JSON.stringify({
    entityId: entity.id,
    templateSlug: 'inspeccion-report',
    recipients: [{ email: delegado.email }],
    context: {
      nombre: delegado.nombre,
      informe_url: signedUrl.signedUrl
    },
    idempotencyKey: `informe-${informeId}`
  })
});
```

---

## 8️⃣ UI PARA EL DELEGADO

### Página: `/panel/delegado/mensajes`

**Features:**
- Historial de envíos (jobs + recipients)
- Filtros por:
  - Template
  - Fecha
  - Estado (queued/sent/error)
- Acciones:
  - **Reintentar fallidos** - Reencolar recipients con `status='error'`
  - **Ejecutar ahora** - POST `/api/messages/dispatch` (solo admin/delegado principal)

**Implementar:**
```tsx
// Listar jobs
const { data: jobs } = await supabase
  .from('message_jobs')
  .select('*, message_recipients(*)')
  .eq('entity_id', entityId)
  .order('created_at', { ascending: false });

// Reintentar fallidos
const failedRecipients = recipients.filter(r => r.status === 'error');
// Crear nuevo job con los mismos recipients
```

---

## 9️⃣ TESTING

### Prueba Rápida

**1. Crear job de prueba:**

```bash
curl -X POST https://www.custodia360.es/api/messages/enqueue \
  -H "Content-Type: application/json" \
  -d '{
    "entityId": "YOUR_ENTITY_UUID",
    "templateSlug": "onboarding-invite",
    "recipients": [{"email": "tu-correo@custodia360.es"}],
    "context": {
      "nombre": "Test Usuario",
      "token": "TOKEN-DE-PRUEBA",
      "entidad": "Entidad Test",
      "fecha_limite": "31/01/2025"
    },
    "idempotencyKey": "test-onb-123"
  }'
```

**2. Ejecutar dispatcher:**

```bash
curl -X POST https://www.custodia360.es/api/messages/dispatch
```

**3. Verificar:**
- Email recibido en `tu-correo@custodia360.es`
- Link: `https://www.custodia360.es/i/TOKEN-DE-PRUEBA`

**4. Test Stripe:**
- Disparar `invoice.paid` de prueba
- Verificar email a administración con `factura_url`

---

## 🔟 SEGURIDAD Y PRIVACIDAD

### Buenas Prácticas

1. **Emails transaccionales SOLAMENTE**
   - No enviar marketing sin consentimiento
   - Solo comunicaciones esenciales del servicio

2. **No adjuntar archivos sensibles**
   - Usar URLs firmadas (10 min expiry)
   - Ejemplo: `supabase.storage.createSignedUrl(path, 600)`

3. **Credenciales del delegado**
   - Solo en el primer email de bienvenida
   - Considerar flujo "set password" en producción

4. **Rate limiting**
   - Resend: 1 email/segundo (free tier)
   - Considerar batch processing para envíos masivos

5. **Logs**
   - Revisar `message_jobs` y `message_recipients`
   - Monitorear `error_msg` para debug

---

## 1️⃣1️⃣ COMPATIBILIDAD

### ✅ No Afectado

- Módulo BOE (panel interno)
- Token de onboarding existente
- Procesos del delegado
- Rutas actuales

### ✅ Extensiones

- Nuevas tablas (no rompen existentes)
- Nuevos endpoints API
- Edge Functions independientes
- Dominio `.es` en todas las URLs

---

## 1️⃣2️⃣ TROUBLESHOOTING

### Email no se envía

1. Verificar dominio en Resend (status "Verified")
2. Revisar `RESEND_API_KEY` en env vars
3. Check `message_jobs.status` → si es 'error', ver `error_msg`
4. Revisar logs de Edge Function en Supabase

### Template no renderiza variables

1. Verificar que las variables existen en `context`
2. Sintaxis correcta: `{{variable}}` (no `{variable}`)
3. No usar espacios: `{{nombre}}` ✅ `{{ nombre }}` ❌

### Duplicados

1. Usar `idempotencyKey` siempre
2. Formato: `${template}-${entityId}-${uniqueId}`
3. Verificar constraints únicos en DB

### Schedule no ejecuta

1. Verificar cron syntax (UTC, no Madrid time)
2. Check "Enabled: ON" en Supabase console
3. Revisar logs de ejecución
4. Test manual: "Run now"

---

## 📚 Recursos

- [Resend Docs](https://resend.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Handlebars.js](https://handlebarsjs.com/)
- [Crontab Guru](https://crontab.guru/) - Validar cron expressions

---

**Última actualización:** 11 Enero 2025
**Autor:** Same AI Assistant
