# 🔍 Verificación de Variables de Entorno - E2E Onboarding 1€

**Fecha:** 28 de octubre de 2025
**Proyecto:** Custodia360
**Flujo:** Onboarding con pago 1€ (Stripe LIVE)

---

## ✅ VARIABLES REQUERIDAS

### 🔴 CRÍTICAS (Stripe LIVE)

| Variable | Estado | Notas |
|----------|--------|-------|
| `STRIPE_SECRET_KEY` | ✅ Configurada | sk_live_... (LIVE MODE) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ Configurada | pk_live_... (LIVE MODE) |
| `STRIPE_WEBHOOK_SECRET_LIVE` | ⚠️ Pendiente configurar | Crear webhook en Stripe Dashboard |

**Acción requerida:**
1. Ir a https://dashboard.stripe.com/webhooks
2. Crear endpoint: `https://www.custodia360.es/api/webhooks/stripe`
3. Eventos: `checkout.session.completed`, `payment_intent.succeeded`, `charge.succeeded`, `payment_intent.payment_failed`
4. Copiar Signing Secret → `STRIPE_WEBHOOK_SECRET_LIVE` en Netlify

---

### ✅ SUPABASE (Base de Datos)

| Variable | Estado | Notas |
|----------|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Configurada | https://gkoyqfusawhnobvkoijc.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Configurada | Clave pública |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Configurada | Para operaciones server-side |

---

### ✅ RESEND (Emails)

| Variable | Estado | Notas |
|----------|--------|-------|
| `RESEND_API_KEY` | ✅ Configurada | re_... |
| `NOTIFY_EMAIL_FROM` | ✅ Configurada | no-reply@custodia360.es |

---

### ✅ HOLDED (Facturación)

| Variable | Estado | Notas |
|----------|--------|-------|
| `HOLDED_API_KEY` | ✅ Configurada | Integración activa |
| `HOLDED_API_URL` | ✅ Configurada | https://api.holded.com/api |

---

### ✅ APLICACIÓN

| Variable | Estado | Notas |
|----------|--------|-------|
| `APP_BASE_URL` | ✅ Configurada | https://www.custodia360.es |
| `NEXT_PUBLIC_APP_BASE_URL` | ✅ Configurada | https://www.custodia360.es |
| `LIVE_MODE` | ⚠️ Añadir | Configurar como `true` |

---

## 📋 ACCIONES PENDIENTES

### Antes de Deploy:

1. **Configurar Webhook en Stripe Dashboard:**
   - URL: `https://www.custodia360.es/api/webhooks/stripe`
   - Eventos: 4 eventos críticos
   - Copiar signing secret

2. **Añadir variable en Netlify:**
   ```bash
   LIVE_MODE=true
   STRIPE_WEBHOOK_SECRET_LIVE=whsec_...
   ```

3. **Ejecutar SQL en Supabase:**
   - Archivo: `scripts/sql/e2e-onboarding-schema.sql`
   - 3 tablas nuevas + RLS policies

4. **Crear Producto en Stripe:**
   - Se creará automáticamente en primera ejecución
   - Nombre: "Onboarding Custodia360"
   - Precio: 1.00 EUR (pago único)

---

## ✅ RESUMEN

| Categoría | Estado |
|-----------|--------|
| Stripe LIVE | ⚠️ Webhook pendiente |
| Supabase | ✅ Completo |
| Resend | ✅ Completo |
| Holded | ✅ Completo |
| App Config | ⚠️ LIVE_MODE pendiente |

**Estado general:** 🟡 CASI LISTO (2 configuraciones pendientes)

---

## 📧 CONFIGURACIÓN DE EMAILS

**Email de notificaciones (pruebas):** rsune@teamsml.com

**Plantillas a enviar:**
1. Cliente (bienvenida) → Email del formulario
2. Soporte (nueva contratación) → rsune@teamsml.com

---

**Última actualización:** 28 de octubre de 2025, 17:30 UTC
