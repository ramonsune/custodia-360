# 🚀 PRÓXIMOS PASOS INMEDIATOS

**Sistema:** Onboarding E2E 1€
**Estado:** ✅ 92% Completado
**Acción requerida:** Configuraciones manuales + Deploy

---

## 📍 ESTÁS AQUÍ

```
┌─────────────────────────────────────┐
│  IMPLEMENTACIÓN COMPLETADA (92%)    │
│  ✅ 18 archivos creados             │
│  ✅ 7 APIs implementadas             │
│  ✅ 3 tablas BD diseñadas            │
│  ✅ Documentación completa           │
└─────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  📍 ESTÁS AQUÍ                      │
│  ⏳ Configuraciones manuales (1h)   │
│  ⏳ Deploy a producción              │
│  ⏳ Smoke tests                      │
└─────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  🎯 SISTEMA EN PRODUCCIÓN           │
│  ✅ Onboarding automatizado          │
│  ✅ Pagos funcionando                │
│  ✅ Emails enviándose                │
│  ✅ Auditoría completa               │
└─────────────────────────────────────┘
```

---

## ⏰ TIEMPO ESTIMADO TOTAL: 1 HORA

---

## 🔴 PASO 1: Instalar Dependencia bcryptjs (5 min)

### ¿Por qué?
Para hashear contraseñas de usuarios de forma segura.

### Cómo:
```bash
cd custodia-360
bun add bcryptjs @types/bcryptjs
```

### Verificar:
```bash
cat package.json | grep bcryptjs
```

Debes ver algo como:
```json
"bcryptjs": "^2.4.3",
"@types/bcryptjs": "^2.4.6"
```

✅ **Completado** | ❌ Pendiente

---

## 🔴 PASO 2: Ejecutar SQL en Supabase (10 min)

### ¿Por qué?
Para crear las 3 tablas necesarias para el onboarding:
- `onboarding_process` (almacena cada proceso de alta)
- `audit_events` (timeline de eventos)
- `training_progress` (progreso de formación)

### Cómo:

#### A) Abrir archivo SQL:
```bash
cat custodia-360/scripts/sql/e2e-onboarding-schema.sql
```

#### B) Copiar TODO el contenido (500+ líneas)

#### C) Ejecutar en Supabase:
1. Ir a https://supabase.com/dashboard
2. Seleccionar proyecto "custodia360"
3. Click en "SQL Editor" en sidebar izquierdo
4. Click en "New Query"
5. Pegar contenido copiado
6. Click en "Run" (botón verde)

#### D) Verificar que se crearon las tablas:
1. Click en "Table Editor" en sidebar
2. Debes ver las nuevas tablas:
   - `onboarding_process`
   - `audit_events`
   - `training_progress`

✅ **Completado** | ❌ Pendiente

---

## 🔴 PASO 3: Configurar Webhook en Stripe (10 min)

### ¿Por qué?
Para que Stripe notifique a Custodia360 cuando se complete un pago.

### Cómo:

#### A) Login en Stripe Dashboard:
https://dashboard.stripe.com

#### B) Ir a Webhooks:
1. Click en "Developers" (arriba derecha)
2. Click en "Webhooks" (sidebar)
3. Click en "Add endpoint" (botón azul)

#### C) Configurar endpoint:
**Endpoint URL:**
```
https://www.custodia360.es/api/webhooks/stripe
```

**Events to send:**
- Buscar y seleccionar:
  - ☑️ `checkout.session.completed`
  - ☑️ `payment_intent.succeeded`
  - ☑️ `charge.succeeded`
  - ☑️ `payment_intent.payment_failed`

**Description:** (opcional)
```
Webhook para provisioning automático de onboarding 1€
```

#### D) Copiar Signing Secret:
1. Click en "Add endpoint"
2. En la nueva pantalla, click en "Reveal" en sección "Signing secret"
3. Copiar el valor (empieza con `whsec_...`)

**Guardar este valor** para el siguiente paso.

✅ **Completado** | ❌ Pendiente
**Signing Secret copiado:** `whsec_________________`

---

## 🔴 PASO 4: Añadir Variables en Netlify (10 min)

### ¿Por qué?
Para que la aplicación sepa que está en modo LIVE y pueda verificar webhooks de Stripe.

### Cómo:

#### A) Login en Netlify:
https://app.netlify.com

#### B) Ir a Site Settings:
1. Seleccionar sitio "custodia-360"
2. Click en "Site settings"
3. Click en "Environment variables" (sidebar izquierdo)

#### C) Añadir 2 variables nuevas:

**Variable 1:**
- **Key:** `LIVE_MODE`
- **Value:** `true`
- **Scopes:** ☑️ Production ☑️ Deploy previews ☑️ Branch deploys
- Click "Create variable"

**Variable 2:**
- **Key:** `STRIPE_WEBHOOK_SECRET_LIVE`
- **Value:** `whsec_...` (el que copiaste en Paso 3)
- **Scopes:** ☑️ Production ☑️ Deploy previews
- Click "Create variable"

#### D) Verificar variables existentes:
Asegúrate de que estas variables YA existan (no las borres):
- ✅ `STRIPE_SECRET_KEY` (sk_live_...)
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_...)
- ✅ `RESEND_API_KEY`
- ✅ `HOLDED_API_KEY` (opcional)
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

✅ **Completado** | ❌ Pendiente

---

## 🟢 PASO 5: Commit y Push a GitHub (5 min)

### ¿Por qué?
Para guardar todo el trabajo y activar deploy automático en Netlify.

### Cómo:

#### Opción A - Usando el mensaje de commit sugerido:
```bash
cd custodia-360

# Ver cambios
git status

# Añadir todos
git add .

# Commit (copiar del archivo .same/COMMIT_MESSAGE_E2E.md)
# O usar este comando que lee el archivo:
git commit -m "$(cat <<'EOF'
feat: Sistema E2E de onboarding con pago 1€ Stripe LIVE + provisioning automático

IMPLEMENTACIÓN COMPLETA (11/12 fases - 92%)

Ver: .same/E2E_1EUR_RESUMEN_EJECUTIVO.md para detalles

🤖 Generated with Same (https://same.new)

Co-Authored-By: Same <noreply@same.new>
EOF
)"

# Push
git push origin main
```

#### Verificar en Netlify:
1. Ir a https://app.netlify.com/sites/custodia-360/deploys
2. Ver que el deploy se inicia automáticamente
3. Esperar a que termine (verde ✅)

✅ **Completado** | ❌ Pendiente

---

## 🟢 PASO 6: Smoke Test con Pago Real 1€ (20 min)

### ¿Por qué?
Para validar que TODO el flujo funciona end-to-end en producción.

### Cómo:
**Seguir checklist detallado:**
```bash
cat custodia-360/.same/E2E_1EUR_SMOKE_TESTS_CHECKLIST.md
```

### Resumen rápido:
1. Ir a https://www.custodia360.es/contratar
2. Rellenar formulario con datos reales
3. Pagar 1€ con tarjeta real
4. Verificar email recibido
5. Login con credenciales del email
6. Completar formación (6 módulos + test)
7. Descargar certificado
8. Verificar en /admin/auditoria que aparece el proceso
9. Verificar en Holded que se creó factura (si configurado)

✅ **Completado** | ❌ Pendiente

---

## 🟢 PASO 7: Documentar Resultados (5 min)

### ¿Por qué?
Para tener registro de la validación y detectar posibles problemas.

### Cómo:
1. Completar checklist de smoke tests
2. Copiar como `.same/E2E_1EUR_SMOKE_RESULTS.md`
3. Anotar cualquier error encontrado
4. Si todo OK: ✅ **SISTEMA EN PRODUCCIÓN**

✅ **Completado** | ❌ Pendiente

---

## 📊 CHECKLIST COMPLETO

| Paso | Descripción | Tiempo | Estado |
|------|-------------|--------|--------|
| 1 | Instalar bcryptjs | 5 min | ⏳ |
| 2 | Ejecutar SQL en Supabase | 10 min | ⏳ |
| 3 | Configurar webhook Stripe | 10 min | ⏳ |
| 4 | Añadir variables Netlify | 10 min | ⏳ |
| 5 | Commit y push a GitHub | 5 min | ⏳ |
| 6 | Smoke test con 1€ real | 20 min | ⏳ |
| 7 | Documentar resultados | 5 min | ⏳ |
| **TOTAL** | | **~1 hora** | |

---

## 🎯 CUANDO HAYAS COMPLETADO TODO

### ✅ Tendrás:
- Sistema de onboarding funcionando en producción
- Pagos de 1€ procesándose automáticamente
- Usuarios accediendo a formación tras pagar
- Emails enviándose correctamente
- Facturas creándose en Holded
- Auditoría completa de cada proceso

### 📧 Notificar a:
- **Equipo:** rsune@teamsml.com
- **Asunto:** "Sistema E2E Onboarding 1€ - EN PRODUCCIÓN ✅"
- **Adjuntar:** `.same/E2E_1EUR_SMOKE_RESULTS.md`

---

## 📚 DOCUMENTACIÓN COMPLETA

| Documento | Descripción | Para qué |
|-----------|-------------|----------|
| `.same/E2E_1EUR_RESUMEN_EJECUTIVO.md` | **LEER PRIMERO** - Resumen de 1 página | Visión general |
| `.same/E2E_1EUR_REPORT.md` | Informe técnico completo (1000+ líneas) | Referencia técnica |
| `.same/E2E_1EUR_SMOKE_TESTS_CHECKLIST.md` | Checklist detallado de pruebas | Validación manual |
| `.same/COMMIT_MESSAGE_E2E.md` | Mensaje de commit sugerido | Push a GitHub |
| `.same/PROXIMOS_PASOS_INMEDIATOS.md` | Este documento | Guía paso a paso |

---

## 🆘 SI TIENES PROBLEMAS

### Webhook no funciona:
1. Verificar Signing Secret correcto en Netlify
2. Revisar logs en Stripe Dashboard → Webhooks → Ver eventos
3. Revisar logs en Netlify → Functions

### Emails no se envían:
1. Verificar RESEND_API_KEY válida
2. Verificar dominio verificado en Resend
3. Revisar logs en Netlify → Functions

### Usuario no se crea:
1. Verificar SUPABASE_SERVICE_ROLE_KEY configurada
2. Revisar logs en Netlify → Functions

### SQL no se ejecuta:
1. Verificar que copiaste TODO el contenido del archivo
2. Ejecutar parte por parte si hay errores
3. Verificar permisos en Supabase

---

## 🎉 ¡ÉXITO!

Cuando completes estos 7 pasos, tendrás un **sistema de onboarding completamente automatizado** procesando pagos reales y provisionando usuarios automáticamente.

**🚀 ¡Vamos allá!**

---

**Documento generado:** 28 de octubre de 2025, 20:35 UTC
**Última actualización:** Ahora
**Estado:** Listo para ejecutar

---

**Tiempo estimado total:** ~1 hora
**Dificultad:** Fácil (configuración manual)
**Beneficio:** Sistema en producción generando ingresos
