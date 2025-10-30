# 🚀 Email System - Deployment Checklist

## ✅ PRE-DEPLOYMENT

### 1. Resend Account Setup
- [ ] Crear cuenta en https://resend.com
- [ ] Obtener API Key
- [ ] **NO configurar dominio todavía** (esperar a producción)

### 2. Environment Variables

**Local (.env.local):**
```bash
APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
RESEND_API_KEY=re_***
NOTIFY_EMAIL_FROM=no-reply@custodia360.es
APP_TIMEZONE=Europe/Madrid
```

**Netlify (Production):**
```bash
APP_BASE_URL=https://www.custodia360.es
NEXT_PUBLIC_APP_BASE_URL=https://www.custodia360.es
RESEND_API_KEY=re_***
NOTIFY_EMAIL_FROM=no-reply@custodia360.es
APP_TIMEZONE=Europe/Madrid
```

---

## 🗄️ DATABASE SETUP

### 1. Run Migration

**Opción A: SQL Editor**
```bash
# Copiar contenido de:
supabase/migrations/20250111_email_system.sql

# Pegar en Supabase Dashboard → SQL Editor → Execute
```

**Opción B: CLI**
```bash
supabase db push
```

### 2. Verify Tables

```sql
SELECT * FROM message_templates;
SELECT * FROM message_jobs LIMIT 10;
SELECT * FROM message_recipients LIMIT 10;
```

Deberías ver **9 plantillas** insertadas.

---

## ⚡ EDGE FUNCTIONS

### 1. Deploy Functions

```bash
# Dispatcher
supabase functions deploy c360-mailer-dispatch \
  --no-verify-jwt

# Reminders
supabase functions deploy c360-reminders-30d \
  --no-verify-jwt
```

### 2. Set Secrets

```bash
supabase secrets set \
  RESEND_API_KEY=re_*** \
  NOTIFY_EMAIL_FROM=no-reply@custodia360.es \
  APP_BASE_URL=https://www.custodia360.es
```

### 3. Test Functions

**Dispatcher:**
```bash
curl -X POST \
  'https://YOUR_PROJECT.supabase.co/functions/v1/c360-mailer-dispatch' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

**Reminders:**
```bash
curl -X POST \
  'https://YOUR_PROJECT.supabase.co/functions/v1/c360-reminders-30d' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

---

## ⏰ SCHEDULES (SUPABASE CONSOLE)

### 1. Dispatcher Schedule

**Navegar:** Supabase Dashboard → Edge Functions → Schedules → New

- **Name:** `c360_mailer_dispatch_10m`
- **Function:** `c360-mailer-dispatch`
- **Cron:** `*/10 * * * *` (cada 10 minutos)
- **Enabled:** ✅

**Test:** Click "Run now" → Check logs

### 2. Reminders Schedule

- **Name:** `c360_reminders_30d_daily`
- **Function:** `c360-reminders-30d`
- **Cron:** `0 8 * * *` (08:00 UTC = 09:00 Madrid)
- **Enabled:** ✅

**Test:** Click "Run now" → Check logs

---

## 🌐 DOMAIN VERIFICATION (RESEND)

### ⚠️ HACER SOLO EN PRODUCCIÓN

**Paso a Paso:**

1. **Resend Dashboard** → Settings → Domains → Add Domain
2. Ingresar: `custodia360.es`
3. Copiar registros DNS:
   - TXT: `v=spf1...`
   - CNAME: `resend._domainkey.custodia360.es`
4. **Ir a tu DNS provider** (Cloudflare, Namecheap, etc.)
5. Añadir los registros
6. **Esperar 24-48h** para propagación
7. Verificar en Resend: status "Verified" ✅
8. **NO enviar emails hasta verificación**

---

## 🔌 WEBHOOK SETUP (RESEND)

### 1. Create Webhook

**Resend Dashboard** → Webhooks → Add Endpoint

- **URL:** `https://www.custodia360.es/api/webhooks/resend`
- **Events:**
  - ✅ email.sent
  - ✅ email.delivered
  - ✅ email.bounced
  - ✅ email.complained

### 2. Test Webhook

**Enviar email de prueba:**
```bash
curl -X POST /api/messages/enqueue \
  -d '{"entityId":"...","templateSlug":"onboarding-invite",...}'
```

**Verificar:**
- Resend dashboard → Emails → Click en email → Ver eventos
- Supabase: `message_recipients.status` = 'delivered'

---

## 🧪 TESTING CHECKLIST

### Unit Tests

- [ ] `lib/url/base.ts` → `absoluteUrl()` devuelve URLs correctas
- [ ] `lib/email/send.ts` → `renderTemplate()` reemplaza variables

### Integration Tests

**Test 1: Encolar mensaje**
```bash
POST /api/messages/enqueue
{
  "entityId": "uuid",
  "templateSlug": "onboarding-invite",
  "recipients": [{"email": "test@custodia360.es"}],
  "context": {"token": "TEST123", "nombre": "Test"}
}
```
- [ ] Response 200
- [ ] Job creado en DB
- [ ] Recipient creado en DB

**Test 2: Despachar**
```bash
POST /api/messages/dispatch
```
- [ ] Response 200
- [ ] Job status = 'sent'
- [ ] Recipient status = 'sent'
- [ ] Email recibido

**Test 3: Webhook**
- [ ] Enviar email
- [ ] Esperar evento en Resend
- [ ] Verificar `message_recipients.status` actualizado

---

## 📊 MONITORING

### Daily Checks

```sql
-- Jobs pendientes
SELECT COUNT(*) FROM message_jobs
WHERE status = 'queued';

-- Errores recientes
SELECT * FROM message_jobs
WHERE status = 'error'
AND created_at > NOW() - INTERVAL '24 hours';

-- Recipients con bounces
SELECT COUNT(*) FROM message_recipients
WHERE status = 'bounced';
```

### Alerts

**Configurar en Supabase:**
- Alert si > 10 jobs con error en 1 hora
- Alert si > 50 bounces en 1 día

---

## 🔄 ROLLBACK PLAN

### Si algo falla:

**1. Deshabilitar schedules:**
- Supabase → Edge Functions → Schedules
- Toggle OFF ambos schedules

**2. Pausar envíos:**
```sql
UPDATE message_jobs SET status = 'error' WHERE status = 'queued';
```

**3. Investigar:**
- Revisar logs de Edge Functions
- Verificar env vars
- Check Resend API status

**4. Fix & Resume:**
- Corregir issue
- Reactivar schedules
- Reencolar fallidos manualmente

---

## 📝 POST-DEPLOYMENT

### Week 1

- [ ] Monitor job success rate (target: >95%)
- [ ] Monitor bounce rate (target: <5%)
- [ ] Revisar feedback de usuarios
- [ ] Ajustar templates si es necesario

### Week 2

- [ ] Analizar tiempos de envío
- [ ] Optimizar schedules si es necesario
- [ ] Implementar UI en `/panel/delegado/mensajes`

### Month 1

- [ ] Review template engagement
- [ ] A/B test subject lines
- [ ] Optimizar horarios de envío
- [ ] Documentar learnings

---

## 🚨 TROUBLESHOOTING RÁPIDO

| Problema | Solución |
|----------|----------|
| "Template not found" | Verificar seed de plantillas ejecutado |
| "Resend 401" | Verificar `RESEND_API_KEY` en secrets |
| "Domain not verified" | Esperar propagación DNS (24-48h) |
| Jobs quedan en 'queued' | Verificar schedule habilitado |
| Bounces altos | Verificar emails válidos antes de enviar |
| Duplicados | Usar `idempotencyKey` siempre |

---

## ✅ FINAL CHECKLIST

### Before Launch

- [ ] DB migration ejecutada
- [ ] Edge Functions deployed
- [ ] Secrets configurados
- [ ] Schedules habilitados
- [ ] Domain verificado en Resend
- [ ] Webhook configurado
- [ ] Test end-to-end exitoso
- [ ] Monitoring configurado
- [ ] Team training completado

### After Launch

- [ ] Monitor first 24h closely
- [ ] Revisar logs cada 6h
- [ ] Responder a bounces/complaints
- [ ] Documentar issues
- [ ] Iterar en templates

---

**Status:** Ready for Deployment ✅
**Last Updated:** 11 Enero 2025
