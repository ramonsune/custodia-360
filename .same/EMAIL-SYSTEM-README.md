# 📧 Sistema de Emails Automáticos - CUSTODIA360

## ✅ IMPLEMENTACIÓN COMPLETA

Sistema de emails transaccionales con Resend y Supabase listo para deployment.

---

## 📦 ARCHIVOS CREADOS

### 1. Database Migration
- `supabase/migrations/20250111_email_system.sql`
  - 3 tablas: `message_templates`, `message_jobs`, `message_recipients`
  - 9 plantillas seed (bienvenida, onboarding, recordatorios, facturas, etc.)

### 2. Utilidades
- `lib/url/base.ts` - Helper para URLs absolutas (NO hardcodear dominio)
- `lib/email/send.ts` - Renderizar templates Handlebars + envío Resend

### 3. API Endpoints
- `src/app/api/messages/enqueue/route.ts` - Encolar mensajes (POST)
- `src/app/api/messages/dispatch/route.ts` - Ejecutar dispatcher manualmente (POST)
- `src/app/api/webhooks/resend/route.ts` - Webhook para estados de Resend (POST)

### 4. Edge Functions (Supabase)
- `supabase/functions/c360-mailer-dispatch/index.ts` - Despachador de cola
- `supabase/functions/c360-reminders-30d/index.ts` - Recordatorios 30 días

### 5. Documentación
- `.same/email-system-guide.md` - Guía completa del sistema
- `.same/email-system-deployment.md` - Checklist de deployment
- `.same/email-system-examples.md` - Ejemplos de código
- `.same/EMAIL-SYSTEM-README.md` - Este archivo

---

## 🚀 PRÓXIMOS PASOS (EN ORDEN)

### 1️⃣ CONFIGURAR RESEND (10 min)

**a) Crear cuenta:**
- Ir a https://resend.com
- Sign up gratis
- Obtener API Key en Dashboard → API Keys

**b) Agregar env vars:**
```bash
# En Netlify (producción)
APP_BASE_URL=https://www.custodia360.es
NEXT_PUBLIC_APP_BASE_URL=https://www.custodia360.es
RESEND_API_KEY=re_***  # Tu API key
NOTIFY_EMAIL_FROM=no-reply@custodia360.es
APP_TIMEZONE=Europe/Madrid
```

**c) Verificar dominio (SOLO EN PRODUCCIÓN):**
- Resend → Settings → Domains → Add Domain
- Añadir `custodia360.es`
- Copiar registros DNS (TXT + CNAME)
- Agregar en tu DNS provider
- Esperar 24-48h para verificación
- **NO enviar emails hasta verificación ✅**

---

### 2️⃣ EJECUTAR MIGRACIÓN EN SUPABASE (5 min)

**Opción A - SQL Editor (recomendado):**
1. Supabase Dashboard → SQL Editor → New Query
2. Copiar todo de `supabase/migrations/20250111_email_system.sql`
3. Pegar y ejecutar "Run"
4. Verificar: `SELECT COUNT(*) FROM message_templates;` → debe devolver 9

**Opción B - CLI:**
```bash
supabase db push
```

---

### 3️⃣ DEPLOYAR EDGE FUNCTIONS (5 min)

```bash
# Desde la raíz del proyecto
cd custodia-360

# Deploy dispatcher
supabase functions deploy c360-mailer-dispatch --no-verify-jwt

# Deploy reminders
supabase functions deploy c360-reminders-30d --no-verify-jwt

# Configurar secrets
supabase secrets set \
  RESEND_API_KEY=re_*** \
  NOTIFY_EMAIL_FROM=no-reply@custodia360.es \
  APP_BASE_URL=https://www.custodia360.es
```

---

### 4️⃣ CREAR SCHEDULES EN SUPABASE (5 min)

**IR A:** Supabase Dashboard → Edge Functions → Schedules → New Schedule

**Schedule 1: Despachador (cada 10 min)**
- Name: `c360_mailer_dispatch_10m`
- Function: `c360-mailer-dispatch`
- Cron: `*/10 * * * *`
- Enabled: ✅ ON
- Click "Run now" para probar

**Schedule 2: Recordatorios (diario 08:00 UTC)**
- Name: `c360_reminders_30d_daily`
- Function: `c360-reminders-30d`
- Cron: `0 8 * * *`
- Enabled: ✅ ON
- Click "Run now" para probar

---

### 5️⃣ CONFIGURAR WEBHOOK EN RESEND (3 min)

**Resend Dashboard → Webhooks → Add Endpoint:**
- URL: `https://www.custodia360.es/api/webhooks/resend`
- Events:
  - ✅ email.sent
  - ✅ email.delivered
  - ✅ email.bounced
  - ✅ email.complained
- Save

---

### 6️⃣ TESTING (10 min)

**Test 1: Encolar mensaje:**
```bash
curl -X POST https://www.custodia360.es/api/messages/enqueue \
  -H "Content-Type: application/json" \
  -d '{
    "entityId": "UUID-DE-PRUEBA",
    "templateSlug": "onboarding-invite",
    "recipients": [{"email": "tu-email@test.com"}],
    "context": {
      "token": "TEST123",
      "nombre": "Usuario Test",
      "entidad": "Entidad Test",
      "fecha_limite": "31/01/2025"
    },
    "idempotencyKey": "test-onb-123"
  }'
```

**Test 2: Ejecutar dispatcher:**
```bash
curl -X POST https://www.custodia360.es/api/messages/dispatch
```

**Test 3: Verificar email recibido:**
- Check tu inbox
- Link debe ser: `https://www.custodia360.es/i/TEST123`

---

## 🔌 INTEGRACIÓN CON CÓDIGO EXISTENTE

### A) Contratación Pagada (Stripe)

En `/app/api/webhooks/stripe/route.ts`:

```typescript
// Tras checkout.session.completed
await fetch(`${process.env.APP_BASE_URL}/api/messages/enqueue`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    entityId,
    templateSlug: 'confirmacion-contratante',
    recipients: [{ email: contratanteEmail }],
    context: {
      nombre: contratanteNombre,
      entidad: entity.nombre,
      plan_contratado: `Plan ${entity.plan_cantidad}`
    },
    idempotencyKey: `confirmacion-contratante-${entityId}`
  })
});

// Email al delegado con credenciales
await fetch(`${process.env.APP_BASE_URL}/api/messages/enqueue`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    entityId,
    templateSlug: 'welcome-delegado',
    recipients: [{ email: delegadoEmail }],
    context: {
      nombre: delegadoNombre,
      entidad: entity.nombre,
      credenciales_usuario: delegadoEmail,
      credenciales_password: temporalPassword
    },
    idempotencyKey: `welcome-delegado-${entityId}`
  })
});
```

### B) Resultado del Test

En `/app/api/public/onboarding/submit/route.ts`:

```typescript
await fetch(`${process.env.APP_BASE_URL}/api/messages/enqueue`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    entityId: person.entity_id,
    templateSlug: 'resultado-test',
    recipients: [{ email: person.email }],
    context: {
      nombre: person.nombre,
      resultado: testPassed ? 'APROBADO ✅' : 'PENDIENTE ⏳',
      aciertos: correctAnswers,
      total: 10,
      siguiente_paso: testPassed
        ? 'Ya puedes acceder al panel'
        : 'Necesitas 7/10 para aprobar'
    },
    idempotencyKey: `test-result-${personId}`
  })
});
```

---

## 📊 MONITOREO

### Queries útiles:

```sql
-- Jobs pendientes
SELECT COUNT(*) FROM message_jobs WHERE status = 'queued';

-- Errores últimas 24h
SELECT * FROM message_jobs
WHERE status = 'error'
AND created_at > NOW() - INTERVAL '24 hours';

-- Bounces
SELECT COUNT(*) FROM message_recipients WHERE status = 'bounced';

-- Tasa de éxito
SELECT
  status,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM message_recipients
GROUP BY status;
```

---

## 🔐 SEGURIDAD

✅ **Emails transaccionales SOLAMENTE** (no marketing)
✅ **URLs firmadas** para documentos (10 min expiry)
✅ **Credenciales solo en primer email** (considerar flujo "set password")
✅ **Idempotency keys** para evitar duplicados
✅ **Rate limiting** (Resend free: 1 email/seg)

---

## 📝 PLANTILLAS DISPONIBLES

| Slug | Cuándo Usar | Destinatario |
|------|-------------|--------------|
| `welcome-delegado` | Tras pago confirmado | Delegado |
| `confirmacion-contratante` | Tras pago confirmado | Contratante |
| `onboarding-invite` | Al generar link | Miembros |
| `rec-30d-contacto` | D+7, D+21, D+28 | Contactos pendientes |
| `alerta-delegado-30d` | D+30 (vencidos) | Delegado |
| `resultado-test` | Al completar test | Participante |
| `share-doc` | Al compartir doc | Destinatario |
| `inspeccion-report` | Al generar informe | Delegado |
| `factura-administracion` | Invoice paid (Stripe) | Administración |

---

## 🎯 VARIABLES HANDLEBARS

Todas disponibles en contexto:

```
{{nombre}}
{{entidad}}
{{panel_url}}
{{onboarding_url}}
{{fecha_limite}}
{{plan_contratado}}
{{credenciales_usuario}}
{{credenciales_password}}
{{factura_url}}
{{informe_url}}
{{doc_url}}
{{doc_nombre}}
{{aciertos}} / {{total}}
{{resultado}}
{{siguiente_paso}}
{{vencidos_list}}
{{pendiente_list}}
```

---

## 📚 DOCUMENTACIÓN COMPLETA

- `email-system-guide.md` - Guía detallada técnica
- `email-system-deployment.md` - Checklist deployment
- `email-system-examples.md` - Ejemplos código
- Este archivo - Quick start

---

## ✅ CHECKLIST FINAL

**Pre-deployment:**
- [ ] Cuenta Resend creada
- [ ] API Key obtenida
- [ ] Env vars configuradas (local + Netlify)
- [ ] Migración SQL ejecutada en Supabase
- [ ] Edge Functions deployadas
- [ ] Secrets configurados en Supabase
- [ ] Schedules creados y enabled
- [ ] Webhook Resend configurado

**Post-deployment:**
- [ ] Dominio verificado en Resend (24-48h)
- [ ] Test email enviado y recibido
- [ ] Webhook funcionando (check eventos)
- [ ] Schedules ejecutándose (check logs)
- [ ] Integración con Stripe testeada
- [ ] Monitoreo configurado

---

## 🆘 TROUBLESHOOTING

| Problema | Solución |
|----------|----------|
| Email no se envía | Verificar dominio en Resend (status Verified) |
| "Template not found" | Ejecutar seed de plantillas (migración SQL) |
| "Resend 401" | Verificar RESEND_API_KEY en env vars |
| Jobs quedan en 'queued' | Verificar schedule habilitado |
| Duplicados | Usar idempotencyKey siempre |
| Bounces altos | Verificar emails válidos antes de enviar |

---

## 📞 SOPORTE

- **Resend Docs:** https://resend.com/docs
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions
- **Email system guide:** `.same/email-system-guide.md`

---

**Status:** ✅ Ready for Deployment
**Versión:** 56
**Fecha:** 11 Enero 2025
**Autor:** Same AI Assistant

---

**IMPORTANTE:**
- NO enviar emails hasta que el dominio esté verificado en Resend
- Usar `idempotencyKey` siempre para evitar duplicados
- Monitorear jobs y recipients regularmente
- Dominio canónico: **www.custodia360.es** (NO .com)
