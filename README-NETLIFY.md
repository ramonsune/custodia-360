# 🚀 Guía de Despliegue en Netlify - Custodia360

## 📋 Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración Inicial](#configuración-inicial)
3. [Variables de Entorno](#variables-de-entorno)
4. [Deploy Previews](#deploy-previews)
5. [Configuración de Stripe](#configuración-de-stripe)
6. [Cron Jobs](#cron-jobs)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta en [Netlify](https://app.netlify.com)
- ✅ Repositorio del proyecto en GitHub
- ✅ Proyecto de Supabase creado
- ✅ Cuenta de Resend configurada (dominio verificado)
- ✅ Cuenta de Stripe (modo test o live)
- ✅ Acceso a las credenciales de servicios externos

---

## 🔧 Configuración Inicial

### 1. Conectar Repositorio

1. **Accede a Netlify Dashboard:**
   - Ir a https://app.netlify.com
   - Click en "Add new site" → "Import an existing project"

2. **Conectar con GitHub:**
   - Seleccionar "GitHub"
   - Autorizar acceso a Netlify
   - Buscar y seleccionar el repositorio `custodia360`

3. **Configurar Build Settings:**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Click en "Deploy site"**
   - Netlify asignará un nombre aleatorio (ej: `quirky-einstein-123456.netlify.app`)
   - Puedes cambiarlo en "Site settings" → "Site details" → "Change site name"

---

## 🔐 Variables de Entorno

### Configuración en Netlify UI

1. **Ir a Site settings → Environment variables**

2. **Añadir las siguientes variables:**

#### 🔹 **Supabase** (Obligatorio)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 📧 **Resend** (Obligatorio)
```bash
RESEND_API_KEY=re_tu_api_key_aqui
NOTIFY_EMAIL_FROM=no-reply@custodia360.es
RESEND_FROM_EMAIL=noreply@custodia360.es
```

#### 🌐 **Aplicación** (Obligatorio)
```bash
APP_BASE_URL=https://www.custodia360.es
NEXT_PUBLIC_APP_BASE_URL=https://www.custodia360.es
APP_TIMEZONE=Europe/Madrid
NODE_ENV=production
```

#### 💳 **Stripe** (Obligatorio)
```bash
# Keys de Stripe
STRIPE_SECRET_KEY=sk_live_... # o sk_test_... para testing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... # o pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # Ver sección Stripe más abajo

# Price IDs (ya configurados en netlify.toml)
STRIPE_PRICE_PLAN_100=price_1SFxNFPtu7JxWqv903F0znAe
STRIPE_PRICE_PLAN_250=price_1SFfQmPtu7JxWqv9IgtAnkc2
STRIPE_PRICE_PLAN_500=price_1SFydNPtu7JxWqv9mUQ9HMjh
STRIPE_PRICE_PLAN_500_PLUS=price_1SFyhxPtu7JxWqv9GG2GD6nS
STRIPE_PRICE_KIT_COMUNICACION=price_1SFtBIPtu7JxWqv9sw7DH5ML
STRIPE_PRICE_DELEGADO_SUPLENTE=price_1SFzPXPtu7JxWqv9HnltemCh
```

#### 📄 **Holded** (Opcional - Facturación)
```bash
HOLDED_API_KEY=tu_api_key_holded
HOLDED_API_URL=https://api.holded.com/api

# Product IDs (ya configurados en netlify.toml)
HOLDED_PRODUCT_PLAN_100=68f9164ccdde27b3e5014c72
HOLDED_PRODUCT_PLAN_250=68f916d4ebdb43e4cc0b747a
HOLDED_PRODUCT_PLAN_500=68f91716736b41626c08ee2b
HOLDED_PRODUCT_PLAN_500_PLUS=68f9175775da4dcc780c6117
HOLDED_PRODUCT_KIT=68f91782196598d24f0a6ec6
HOLDED_PRODUCT_SUPLENTE=68f917abd2ec4e80a2085c10
```

#### 🔧 **Otros** (Opcionales)
```bash
# PDF Generation
PDFSHIFT_API_KEY=sk_tu_key_pdfshift

# Cron Jobs
CRON_SECRET_TOKEN=custodia360-cron-secret-2025

# BOE Monitoring
BOE_MONITOREO_ACTIVO=true
BOE_FRECUENCIA_DIAS=15

# Build Configuration
NEXT_BUILD_STRICT=false
NEXT_TELEMETRY_DISABLED=1
```

### ⚡ Tip: Usar Netlify CLI para variables

Puedes usar Netlify CLI para configurar variables más rápido:

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link al sitio
netlify link

# Configurar variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://tu-proyecto.supabase.co"
netlify env:set RESEND_API_KEY "re_tu_api_key"
# ... etc
```

---

## 🔄 Deploy Previews

### Configuración Automática

Netlify crea **Deploy Previews** automáticamente para:

- ✅ **Pull Requests**: Cada PR tiene su preview único
- ✅ **Branch Deploys**: Cada rama puede tener su deploy

### Activar Deploy Previews

1. **Ir a Site settings → Build & deploy → Deploy contexts**

2. **Activar:**
   - ✅ **Deploy Preview**: Build pull requests
   - ✅ **Branch deploys**: All branches (o seleccionar ramas específicas)

3. **Contextos de Deploy:**
   - **Production**: Main branch → `https://www.custodia360.es`
   - **Deploy Previews**: PRs → `https://deploy-preview-123--custodia360.netlify.app`
   - **Branch Deploys**: Ramas → `https://dev--custodia360.netlify.app`

### Variables por Contexto

Puedes configurar variables diferentes para cada contexto:

```bash
# Production context
netlify env:set STRIPE_SECRET_KEY "sk_live_..." --context production

# Deploy Preview context (usa Stripe test)
netlify env:set STRIPE_SECRET_KEY "sk_test_..." --context deploy-preview

# Branch deploy context
netlify env:set STRIPE_SECRET_KEY "sk_test_..." --context branch-deploy
```

---

## 💳 Configuración de Stripe

### 1. Obtener Webhook Secret

1. **Ir a Stripe Dashboard:**
   - https://dashboard.stripe.com/webhooks

2. **Crear webhook endpoint:**
   - Click "Add endpoint"
   - URL: `https://www.custodia360.es/api/webhooks/stripe`
   - Events to listen:
     - ✅ `checkout.session.completed`
     - ✅ `payment_intent.succeeded`
     - ✅ `payment_intent.payment_failed`
     - ✅ `customer.subscription.created`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.payment_succeeded`
     - ✅ `invoice.payment_failed`

3. **Copiar Webhook Secret:**
   - Después de crear el webhook, aparecerá el **Signing secret**
   - Formato: `whsec_...`
   - Copiarlo y añadirlo a variables de entorno en Netlify

### 2. Configurar en Netlify

```bash
# Ir a Site settings → Environment variables
STRIPE_WEBHOOK_SECRET=whsec_tu_signing_secret_aqui
```

### 3. Configurar para Deploy Previews (Opcional)

Si quieres probar webhooks en Deploy Previews:

1. **Crear webhook separado en Stripe:**
   - URL: `https://deploy-preview-*--custodia360.netlify.app/api/webhooks/stripe`
   - Mismo eventos que producción

2. **Usar Stripe CLI para local/preview:**
   ```bash
   stripe listen --forward-to https://deploy-preview-123--custodia360.netlify.app/api/webhooks/stripe
   ```

### ✅ Checklist Stripe

- [ ] Cuenta de Stripe creada (test o live)
- [ ] API Keys copiadas (Secret Key + Publishable Key)
- [ ] Webhook endpoint creado en Stripe Dashboard
- [ ] Webhook Secret copiado
- [ ] Variables STRIPE_* configuradas en Netlify
- [ ] Price IDs configurados (planes + kit + suplente)
- [ ] Test de pago realizado en modo test
- [ ] Webhook verificado (revisar logs en Stripe Dashboard)

---

## ⏰ Cron Jobs

### Cron Jobs Activos

El proyecto tiene **8 cron jobs** configurados en `netlify.toml`:

| Cron Job | Frecuencia | Descripción |
|----------|-----------|-------------|
| `c360_mailer_dispatch` | Cada 10 min | Envío de emails encolados |
| `c360_billing_reminders` | Diario 08:00 UTC | Recordatorios de facturación |
| `c360_onboarding_guard` | Diario 08:00 UTC | Control de onboarding expirado |
| `c360_compliance_guard` | Diario 07:00 UTC | Monitor de compliance LOPIVI |
| `c360_healthcheck` | Diario 07:00 UTC | Healthcheck del sistema |
| `c360_daily_audit` | Cada hora | Auditoría diaria (filtra 09:00 Madrid) |
| `c360_payment_reminders` | Diario 09:00 UTC | Recordatorios de segundo pago |
| `c360_payment_retry` | Diario 10:00 UTC | Reintentos de pago fallido |
| `c360_payment_grace_enforcement` | Diario 11:00 UTC | Control de período de gracia |

### Verificar Cron Jobs

1. **Ir a Site settings → Functions**
2. Ver lista de **Scheduled functions**
3. Revisar logs en **Functions logs**

### Logs de Cron Jobs

```bash
# Ver logs en Netlify CLI
netlify functions:list
netlify functions:log c360_mailer_dispatch
```

---

## 🐛 Troubleshooting

### 1. Error de Build

**Síntoma:** Build fails con error de dependencias

**Solución:**
```bash
# Limpiar cache
netlify build --clear-cache

# O en Netlify UI:
# Site settings → Build & deploy → Build settings → Clear cache and deploy site
```

### 2. Variables de Entorno no Funcionan

**Síntoma:** App se comporta como si faltaran variables

**Solución:**
1. Verificar que las variables están en **Site settings → Environment variables**
2. Verificar que **NO** hay typos en los nombres
3. Hacer un **nuevo deploy** (las variables solo se aplican en nuevos deploys)
4. Variables `NEXT_PUBLIC_*` deben estar configuradas en **build time**

### 3. Webhook de Stripe no Funciona

**Síntoma:** Pagos no se procesan correctamente

**Solución:**
1. Verificar URL del webhook: `https://www.custodia360.es/api/webhooks/stripe`
2. Verificar `STRIPE_WEBHOOK_SECRET` en variables de entorno
3. Revisar logs en Stripe Dashboard → Webhooks → Ver endpoint → Recent deliveries
4. Verificar que los eventos están seleccionados correctamente

### 4. Funciones Programadas no se Ejecutan

**Síntoma:** Cron jobs no corren

**Solución:**
1. Verificar en **Site settings → Functions** que aparecen
2. Revisar **Functions logs** para ver errores
3. Verificar que las funciones están en `netlify/functions/`
4. Formato de cron correcto (UTC timezone)

### 5. Deploy Preview no Carga

**Síntoma:** Deploy Preview muestra error 404

**Solución:**
1. Verificar que **Deploy Previews** está activado en settings
2. Esperar a que el build termine (puede tardar 2-5 min)
3. Click en "Preview deploy" en el PR de GitHub
4. Si sigue fallando, revisar logs del build

### 6. Supabase Connection Error

**Síntoma:** Error conectando a Supabase

**Solución:**
1. Verificar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Verificar que el proyecto de Supabase está activo
3. Verificar RLS policies (deben permitir acceso anónimo donde corresponda)
4. Revisar logs de Supabase en Dashboard

### 7. Emails no se Envían

**Síntoma:** Sistema no envía emails

**Solución:**
1. Verificar `RESEND_API_KEY` en variables de entorno
2. Verificar dominio verificado en Resend Dashboard
3. Revisar logs en Resend Dashboard → Logs
4. Verificar función `c360_mailer_dispatch` está corriendo
5. Revisar tabla `message_jobs` en Supabase

---

## 📚 Recursos Adicionales

- [Netlify Docs - Next.js](https://docs.netlify.com/frameworks/next-js/overview/)
- [Netlify Plugin - Next.js](https://github.com/netlify/netlify-plugin-nextjs)
- [Deploy Previews](https://docs.netlify.com/site-deploys/deploy-previews/)
- [Scheduled Functions](https://docs.netlify.com/functions/scheduled-functions/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)

---

## ✅ Checklist Final

Antes de considerar el deploy completo, verifica:

### Configuración Básica
- [ ] Repositorio conectado a Netlify
- [ ] Build exitoso en producción
- [ ] Deploy Preview configurado
- [ ] Dominio custom configurado (si aplica)

### Variables de Entorno
- [ ] Supabase configurado (URL + Keys)
- [ ] Resend configurado (API Key + From Email)
- [ ] Stripe configurado (Keys + Webhook Secret)
- [ ] App URLs configuradas
- [ ] Timezone configurado

### Integraciones
- [ ] Webhook de Stripe creado y funcionando
- [ ] Dominio de Resend verificado
- [ ] Holded configurado (si se usa facturación)

### Cron Jobs
- [ ] 8 scheduled functions aparecen en Netlify
- [ ] Logs de funciones sin errores
- [ ] `c360_mailer_dispatch` enviando emails

### Testing
- [ ] Página principal carga correctamente
- [ ] Login funciona
- [ ] Dashboard carga datos de Supabase
- [ ] Test de pago completo (Stripe)
- [ ] Email de bienvenida se envía

---

## 🆘 Soporte

Si encuentras problemas:

1. **Revisar logs:**
   - Netlify: Site → Deploys → Deploy log
   - Functions: Site → Functions → Function logs
   - Stripe: Dashboard → Webhooks → Recent deliveries
   - Resend: Dashboard → Logs

2. **Contactar soporte:**
   - Email: support@custodia360.es
   - GitHub Issues: [Reportar problema]

---

**Última actualización:** 28 de octubre de 2025
**Versión:** 1.0
**Estado:** Documentación completa para Netlify Deploy
