# Reglas de Negocio - Reintentos y Alertas de Email

## 📋 Resumen

Este documento define las reglas de negocio para el manejo de eventos de email (Resend), reintentos automáticos y alertas administrativas.

---

## 🔄 Reintentos Automáticos

### Estados de `message_jobs`

| Estado | Descripción |
|--------|-------------|
| `queued` | Email encolado, pendiente de envío |
| `processing` | Email en proceso de envío |
| `sent` | Email enviado a Resend (no garantiza entrega) |
| `delivered` | Email entregado al destinatario (evento de Resend) |
| `failed` | Error al enviar a Resend |
| `bounced` | Email rebotado (no reintentar) |
| `complained` | Queja/spam reportado (no reintentar) |

### Política de Reintentos

**Jobs con `status='failed'`:**
- Reintentar hasta **3 veces** con backoff exponencial:
  - Intento 1: después de **15 minutos**
  - Intento 2: después de **1 hora**
  - Intento 3: después de **6 horas**
- Tras 3 intentos fallidos → marcar como `failed` definitivo
- Guardar log de intentos en `context.retry_attempts: [{ at, error }]`

**Jobs con `status='bounced'` o `status='complained'`:**
- **NO reintentar**
- Marcar en `context.bounced = true`
- Crear evento en `email_events` (ya se hace vía webhook)
- Encolar aviso a admin (ver sección de Alertas)

---

## 🔔 Alertas Administrativas

### Evento: Email Bounced

**Condición:** Se recibe `email.bounced` del webhook de Resend

**Acciones:**
1. Crear registro en `email_events` con `event='bounced'`
2. Actualizar `message_jobs.status = 'bounced'` si existe el job
3. Marcar `message_jobs.context.bounced = true`
4. **Encolar email a admin:**
   - Template: `admin-email-bounce`
   - Asunto: `⚠️ Email rebotado - ${entity.nombre}`
   - Contenido: Detalles del bounce (destinatario, template, fecha)
   - Destinatario: email configurado en `ADMIN_EMAIL` o `nandolmo@teamsml.com`

### Evento: Email Complaint

**Condición:** Se recibe `email.complained` del webhook de Resend

**Acciones:**
1. Crear registro en `email_events` con `event='complained'`
2. Actualizar `message_jobs.status = 'complained'` si existe el job
3. Marcar `message_jobs.context.complained = true`
4. **Encolar email a admin:**
   - Template: `admin-email-complaint`
   - Asunto: `🚨 Queja de spam - ${entity.nombre}`
   - Contenido: Detalles de la queja (destinatario, template, fecha)
   - Destinatario: email configurado en `ADMIN_EMAIL` o `nandolmo@teamsml.com`

### Evento: Fallos Repetidos

**Condición:** Un mismo `to_email` acumula 3+ fallos en 7 días

**Acciones:**
1. **Encolar email a admin:**
   - Template: `admin-email-repeated-failures`
   - Asunto: `⚠️ Fallos recurrentes - ${to_email}`
   - Contenido: Listado de intentos fallidos, posibles causas
   - Destinatario: email configurado en `ADMIN_EMAIL` o `nandolmo@teamsml.com`
2. (Opcional) Marcar destinatario como "problemático" en BD auxiliar

---

## 🛠️ Implementación

### Mailer Dispatcher (`/api/jobs/mailer-dispatch`)

**Cambios necesarios (sin romper código existente):**

```typescript
// Al enviar con Resend:
const response = await resend.emails.send(payload)

if (response.error) {
  // Actualizar job como failed
  await supabase.from('message_jobs')
    .update({
      status: 'failed',
      context: {
        ...job.context,
        error: response.error.message,
        retry_attempts: [
          ...(job.context.retry_attempts || []),
          { at: new Date().toISOString(), error: response.error.message }
        ]
      }
    })
    .eq('id', job.id)
} else {
  // Actualizar como sent
  await supabase.from('message_jobs')
    .update({
      status: 'sent',
      context: {
        ...job.context,
        resend_id: response.data.id
      }
    })
    .eq('id', job.id)
}
```

### Retry Scheduler (nueva función o ampliar existente)

**Scheduled Function:** `c360_email_retry` (ejecutar cada 15 minutos)

```typescript
// Buscar jobs failed con retry_attempts < 3
const { data: failedJobs } = await supabase
  .from('message_jobs')
  .select('*')
  .eq('status', 'failed')
  .filter('context->retry_attempts', 'lt', 3)

for (const job of failedJobs) {
  const attempts = job.context.retry_attempts?.length || 0
  const lastAttempt = job.context.retry_attempts?.[attempts - 1]?.at
  const minutesSince = (Date.now() - new Date(lastAttempt).getTime()) / 1000 / 60

  // Backoff: 15m, 60m, 360m
  const delays = [15, 60, 360]
  if (minutesSince >= delays[attempts]) {
    // Reintentar: actualizar a queued
    await supabase.from('message_jobs')
      .update({ status: 'queued' })
      .eq('id', job.id)
  }
}
```

### Webhook Handler (`/api/webhooks/resend`)

**Ya implementado:**
- Captura eventos `bounced` y `complained`
- Guarda en `email_events`

**TODO (próxima iteración):**
- Actualizar `message_jobs.status` cuando se recibe evento
- Encolar avisos a admin según reglas arriba

---

## 📊 Trazabilidad por Entidad

**Query ejemplo:**

```sql
SELECT
  event,
  COUNT(*) as total,
  COUNT(DISTINCT to_email) as unique_recipients
FROM email_events
WHERE entity_id = :entity_id
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY event
ORDER BY total DESC;
```

**Visualización en panel admin:**
- Tabla de eventos por entidad
- Gráfico de tendencias (delivered vs bounced)
- Lista de destinatarios problemáticos

---

## 🔐 Seguridad

- Tabla `email_events` con RLS server-only ✅
- Webhook verificar firma de Resend (opcional, recomendado)
- No exponer `meta` (payload completo) en APIs públicas

---

_Documento creado: 19/10/2025_
