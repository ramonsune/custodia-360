# 🎯 Plan de Implementación E2E Onboarding 1€

**Fecha:** 28 de octubre de 2025
**Proyecto:** Custodia360
**Estado:** PARCIALMENTE IMPLEMENTADO (4/11 fases)

---

## ✅ FASES COMPLETADAS (0-3)

### FASE 0: Verificación ENV ✅
- **Archivo:** `.same/E2E_1EUR_ENV_CHECK.md`
- **Estado:** Variables verificadas, 2 pendientes de configurar
  - ⚠️ `STRIPE_WEBHOOK_SECRET_LIVE` - Crear webhook en Stripe Dashboard
  - ⚠️ `LIVE_MODE=true` - Añadir en Netlify

### FASE 1: Schema SQL ✅
- **Archivo:** `scripts/sql/e2e-onboarding-schema.sql`
- **Contenido:**
  - ✅ Tabla `onboarding_process` (13 columnas + constraints)
  - ✅ Tabla `audit_events` (timeline de eventos)
  - ✅ Tabla `training_progress` (progreso formación)
  - ✅ RLS policies (service role only)
  - ✅ Triggers (auto-update timestamps)
  - ✅ Funciones auxiliares (`mark_training_completed`, `get_latest_event`)
- **Acción manual:** Ejecutar SQL en Supabase Dashboard

### FASE 2: Utilidades Core ✅
- **Archivos creados:**
  1. `src/lib/audit-logger.ts` - Sistema de auditoría
     - `logAuditEvent()` - Registra eventos
     - `getProcessTimeline()` - Timeline de proceso
     - Helpers: `logCheckoutCreated`, `logEntityCreated`, `logUserCreated`, etc.

  2. `src/lib/stripe-products.ts` - Gestión producto Stripe 1€
     - `ensureOnboardingProduct()` - Crea/obtiene producto 1€
     - `createOnboardingCheckoutSession()` - Crea sesión checkout
     - `getCheckoutSession()`, `getPaymentIntent()`, `getCustomer()`
     - `verifyWebhookSignature()` - Verifica firma webhook

  3. `src/lib/holded-client.ts` - Integración Holded
     - `createOrUpdateContact()` - Crea contacto/empresa
     - `createInvoice()` - Crea factura 1€
     - `syncOnboardingToHolded()` - Sync completo

### FASE 3: API Checkout ✅
- **Archivo:** `src/app/api/checkout/create-1eur/route.ts`
- **Funcionalidad:**
  - Valida datos formulario (email, password, entity_name)
  - Hash de contraseña con bcrypt
  - Crea registro en `onboarding_process`
  - Crea sesión Stripe Checkout
  - Registra evento auditoría
  - Devuelve URL checkout

---

## 🔴 FASES PENDIENTES (4-11)

### FASE 4: Webhook Stripe (CRÍTICO) ⏳
**Archivo a modificar:** `src/app/api/webhooks/stripe/route.ts`

**Eventos a manejar:**
- `checkout.session.completed` → Provisionar entidad + usuario + emails + Holded
- `payment_intent.succeeded` → Idempotencia
- `charge.succeeded` → Registrar charge_id
- `payment_intent.payment_failed` → Email error

**Flujo provisioning:**
1. Obtener session de Stripe
2. Actualizar `onboarding_process` con status='paid'
3. Crear entidad en tabla `entities`
4. Crear usuario en Supabase Auth
5. Asignar rol `DELEGADO_FORMACION`
6. Crear registro en `training_progress`
7. Enviar emails (cliente + soporte)
8. Sync Holded (contacto + factura)
9. Actualizar status='provisioned'
10. Logs de auditoría

**Templates email:**
- Cliente: "Bienvenido a Custodia360 - Acceso Formación"
- Soporte: "Nueva contratación 1€ - {entity_name}" → rsune@teamsml.com

---

### FASE 5: Páginas Contratación ⏳

#### 1. `/contratar/page.tsx`
**Formulario con campos:**
```tsx
- Razón social (entity_name) [required]
- CIF [opcional]
- Email [required]
- Teléfono [opcional]
- Dirección (calle, ciudad, CP, provincia) [opcional]
- Contraseña (min 8) [required]
- Confirmación contraseña [required]
- Checkbox: Acepto condiciones [required]
- Botón: "Contratar ahora (1€)"
```

**Acción:**
- POST `/api/checkout/create-1eur`
- Redirigir a Stripe Checkout

#### 2. `/contratar/success/page.tsx`
```tsx
- Mensaje: "¡Pago recibido!"
- "Revisa tu correo para acceder a la formación"
- Botón: "Ir a Login"
```

#### 3. `/contratar/cancel/page.tsx`
```tsx
- Mensaje: "Pago cancelado"
- "Puedes intentarlo de nuevo cuando quieras"
- Botón: "Volver a intentar"
```

---

### FASE 6: API Training ⏳

#### 1. `/api/training/complete/route.ts`
**Funcionalidad:**
- Verificar que `steps_completed == total_steps`
- Actualizar `training_progress.is_completed = true`
- Cambiar rol de `FORMACION` → `DELEGADO`
- Actualizar `onboarding_process.status = 'trained'`
- Audit event: `training.completed`, `role.promoted`
- Responder OK → Front redirige a `/dashboard-delegado`

#### 2. Modificar `/bienvenida-formacion/page.tsx`
- Al completar 5 pasos → POST `/api/training/complete`
- Mostrar mensaje: "¡Formación completada!"
- Redirigir a `/dashboard-delegado`

---

### FASE 7: API Auditoría ⏳

#### 1. `/api/audit/events/route.ts`
**GET con query params:**
```typescript
?processId=xxx         // eventos de un proceso
?level=ERROR           // filtrar por nivel
?eventType=xxx         // filtrar por tipo
?limit=100             // límite
?offset=0              // paginación
```

#### 2. `/api/audit/processes/route.ts`
**GET con query params:**
```typescript
?email=xxx             // filtrar por email
?status=xxx            // filtrar por status
?dateFrom=xxx          // rango fechas
?dateTo=xxx
?limit=50
?offset=0
```

---

### FASE 8: Panel Admin Auditoría ⏳

#### `/admin/auditoria/page.tsx`
**Componentes:**
- Tabla de procesos con filtros
- Timeline de eventos por proceso
- Detalles del proceso (JSON payload)
- Botón "Reintentar Holded" si falló
- Export CSV

**Filtros:**
- Rango de fechas
- Estado (pending, paid, provisioned, trained, error)
- Email
- Process ID

---

### FASE 9: Widgets Dashboards ⏳

#### 1. `/dashboard-custodia360/page.tsx`
**Widget "Altas Recientes":**
- Últimos 10 procesos
- Columnas: Entity, Email, Fecha, Estado
- Link a `/admin/auditoria?processId=xxx`

#### 2. `/dashboard-entidad/page.tsx`
**Checklist Inicial:**
- Estado: "Activa"
- Delegado Principal: Nombre
- Checklist: Documentación, Formación, etc.

#### 3. `/bienvenida-formacion/page.tsx`
**Ya existe, modificar:**
- Añadir lógica de completar formación
- Botón "Finalizar" → `/api/training/complete`

---

### FASE 10: Smoke Tests ⏳

#### Crear `/scripts/smoke-test-e2e.ts`
**Tests:**
```typescript
1. GET /contratar → 200
2. POST /api/checkout/create-1eur → 200 con url
3. Simulación: success/cancel URLs
4. (Si TEST_LIVE_1EUR=true) Test real de 1€
```

**Generar:** `.same/E2E_1EUR_SMOKE.md`

---

### FASE 11: Informe Final ⏳

#### Crear `.same/E2E_1EUR_REPORT.md`
**Contenido:**
- Resumen implementación
- Variables ENV configuradas
- IDs Stripe (product/price)
- Schema BD aplicado
- Rutas creadas
- Resultado tests
- Checklist operaciones
- Guía paso a paso prueba real 1€

#### Email a soporte
- Enviar resumen a: rsune@teamsml.com
- Asunto: "[Custodia360] Implementación E2E 1€ Completada"

---

## 📦 DEPENDENCIAS NECESARIAS

### Añadir a package.json:
```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6"
  }
}
```

### Comando:
```bash
cd custodia-360
bun add bcryptjs
bun add -d @types/bcryptjs
```

---

## 🔧 CONFIGURACIONES MANUALES

### 1. Webhook Stripe Dashboard
```
URL: https://www.custodia360.es/api/webhooks/stripe
Eventos:
  - checkout.session.completed
  - payment_intent.succeeded
  - charge.succeeded
  - payment_intent.payment_failed

Copiar Signing Secret → STRIPE_WEBHOOK_SECRET_LIVE
```

### 2. Variables Netlify
```bash
LIVE_MODE=true
STRIPE_WEBHOOK_SECRET_LIVE=whsec_...
```

### 3. SQL Supabase
```bash
Ejecutar: scripts/sql/e2e-onboarding-schema.sql
```

---

## 📊 RESUMEN DE ARCHIVOS

### Creados (7):
1. `.same/E2E_1EUR_ENV_CHECK.md`
2. `.same/E2E_1EUR_IMPLEMENTATION_PLAN.md` (este archivo)
3. `scripts/sql/e2e-onboarding-schema.sql`
4. `src/lib/audit-logger.ts`
5. `src/lib/stripe-products.ts`
6. `src/lib/holded-client.ts`
7. `src/app/api/checkout/create-1eur/route.ts`

### Pendientes (12):
1. `src/app/api/webhooks/stripe/route.ts` (modificar)
2. `src/app/contratar/page.tsx`
3. `src/app/contratar/success/page.tsx`
4. `src/app/contratar/cancel/page.tsx`
5. `src/app/api/training/complete/route.ts`
6. `src/app/api/audit/events/route.ts`
7. `src/app/api/audit/processes/route.ts`
8. `src/app/admin/auditoria/page.tsx`
9. Widget en `/dashboard-custodia360/page.tsx`
10. Widget en `/dashboard-entidad/page.tsx`
11. `scripts/smoke-test-e2e.ts`
12. `.same/E2E_1EUR_REPORT.md`

---

## 🎯 PRÓXIMOS PASOS

1. **Instalar dependencias:**
   ```bash
   cd custodia-360
   bun add bcryptjs
   bun add -d @types/bcryptjs
   ```

2. **Ejecutar SQL en Supabase:**
   - Copiar contenido de `scripts/sql/e2e-onboarding-schema.sql`
   - Ir a Supabase Dashboard → SQL Editor
   - Ejecutar
   - Verificar tablas creadas

3. **Configurar webhook Stripe:**
   - Ir a https://dashboard.stripe.com/webhooks
   - Crear endpoint
   - Copiar signing secret
   - Añadir a Netlify

4. **Continuar implementación:**
   - Confirmar si quieres que continúe con las fases 4-11
   - O prefieres hacerlo por fases con confirmación

---

**Estado actual:** 4/11 fases (36% completado)
**Última actualización:** 28 de octubre de 2025, 18:00 UTC
