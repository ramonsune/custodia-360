# ⚡ ACCIÓN INMEDIATA - Custodia360

**Última actualización**: 27 de enero de 2025

---

## 🎯 OBJETIVO

Resolver los **5 gaps críticos** identificados en la auditoría para hacer el proyecto production-ready en 2-3 semanas.

---

## 📋 PLAN DE ACCIÓN (Paso a Paso)

### ✅ **FASE 1: CONFIGURAR GIT Y GITHUB** (2 horas)

#### Paso 1: Inicializar Git localmente
```bash
cd custodia-360

# Crear .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# Typescript
*.tsbuildinfo
next-env.d.ts

# Bun
bun.lockb
EOF

# Inicializar repo
git init

# Añadir todos los archivos
git add .

# Primer commit
git commit -m "Initial commit - Custodia360 Platform

- Frontend: 5 dashboards, 106 páginas
- Backend: 152 API endpoints
- Automatizaciones: 9 cron jobs
- Integraciones: Supabase, Resend, Stripe, Holded
- Sistema de guías completo (27/01/2025)
- Modo DEMO activo para preview"
```

#### Paso 2: Crear repositorio en GitHub
```
1. Ir a https://github.com/new
2. Nombre: custodia360
3. Visibilidad: Private (recomendado)
4. NO inicializar con README (ya tienes código local)
5. Click "Create repository"
```

#### Paso 3: Conectar local con GitHub
```bash
# Reemplazar [TU-USUARIO] con tu usuario de GitHub
git remote add origin https://github.com/[TU-USUARIO]/custodia360.git

# Renombrar branch a main (si es necesario)
git branch -M main

# Push inicial
git push -u origin main
```

#### Paso 4: Conectar Netlify con GitHub (OPCIONAL pero recomendado)
```
1. Ir a Netlify Dashboard → tu site
2. Site settings → Build & deploy → Link repository
3. Seleccionar GitHub → custodia360
4. Configurar:
   - Branch: main
   - Build command: npm run build
   - Publish directory: .next
5. Activar auto-deploy en push
```

✅ **Git configurado. Código respaldado en GitHub.**

---

### ✅ **FASE 2: VERIFICAR SUPABASE** (4 horas)

#### Paso 1: Conectar a Supabase Dashboard
```
1. Ir a https://supabase.com/dashboard
2. Login con tu cuenta
3. Seleccionar proyecto: gkoyqfusawhnobvkoijc
4. SQL Editor → New Query
```

#### Paso 2: Verificar qué migrations ya están aplicadas
```sql
-- Verificar si existe tabla de migrations
SELECT * FROM _prisma_migrations LIMIT 10;

-- Si no existe, verificar manualmente cada tabla
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Tablas esperadas** (copiar y verificar una por una):
```sql
-- Verificar entidades
SELECT COUNT(*) FROM entities;

-- Verificar personas
SELECT COUNT(*) FROM entity_people;

-- Verificar guías (NUEVO - 27/01)
SELECT COUNT(*) FROM guides;
SELECT COUNT(*) FROM guide_sections;
SELECT COUNT(*) FROM guide_anchors;

-- Verificar email system
SELECT COUNT(*) FROM message_templates;
SELECT COUNT(*) FROM message_jobs;

-- Verificar cambio delegado
SELECT COUNT(*) FROM delegate_change_requests;

-- Verificar casos
SELECT COUNT(*) FROM casos_proteccion;

-- Verificar BOE
SELECT COUNT(*) FROM boe_articles;

-- Verificar auditoría
SELECT COUNT(*) FROM admin_health_logs;  -- Posiblemente falta
SELECT COUNT(*) FROM email_events;       -- Posiblemente falta
```

#### Paso 3: Aplicar migrations faltantes

**SI FALTA `guides` (sistema de guías)**:
```sql
-- Copiar TODO el contenido de:
-- custodia-360/supabase/migrations/20250127_guide_system.sql
-- Pegarlo en SQL Editor y ejecutar
```

**SI FALTA `admin_health_logs`**:
```sql
-- Copiar TODO el contenido de:
-- custodia-360/scripts/sql/admin-health.sql
-- Pegarlo en SQL Editor y ejecutar
```

**SI FALTA `email_events`**:
```sql
-- Ya está incluido en admin-health.sql
-- Ver paso anterior
```

#### Paso 4: Ejecutar seed de guías
```bash
cd custodia-360
bun run scripts/seed-guides.ts
```

**Output esperado**:
```
🌱 Starting guide seed process...
📘 Seeding guide for role: ENTIDAD
  ✨ Creating new guide...
  ✅ Guide ID: [uuid]
    ✅ Section: 1. Tus responsabilidades principales
    ...
✅ Guide seeding completed!
🎉 All done!
```

#### Paso 5: Verificar RLS (Row Level Security)
```sql
-- Verificar que RLS está habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true;

-- Debe devolver TODAS las tablas críticas con rowsecurity=true
```

✅ **Supabase verificado. Migrations aplicadas.**

---

### ✅ **FASE 3: IMPLEMENTAR TESTS E2E** (1 semana)

#### Paso 1: Instalar Playwright
```bash
cd custodia-360

# Instalar Playwright
bun add -D @playwright/test

# Inicializar Playwright
bunx playwright install
```

#### Paso 2: Crear tests básicos

**Crear archivo** `tests/e2e/login.spec.ts`:
```typescript
import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test('should login as DELEGADO and redirect to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/login')

    await page.fill('input[name="email"]', 'delegado@custodia.com')
    await page.fill('input[name="password"]', '123')

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/dashboard-delegado/)
    await expect(page.locator('text=MODO DEMO')).toBeVisible()
  })

  test('should login as ENTIDAD and redirect to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/login')

    await page.fill('input[name="email"]', 'entidad@custodia.com')
    await page.fill('input[name="password"]', '123')

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/dashboard-entidad/)
  })
})
```

**Crear más tests** para:
- `tests/e2e/onboarding.spec.ts` - Flujo onboarding
- `tests/e2e/casos.spec.ts` - Gestión de casos
- `tests/e2e/delegado-change.spec.ts` - Cambio delegado
- `tests/e2e/guias.spec.ts` - Sistema de guías

#### Paso 3: Añadir script en package.json
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

#### Paso 4: Ejecutar tests
```bash
# Asegurarse que el servidor dev está corriendo
bun run dev

# En otra terminal:
bun run test:e2e
```

✅ **Tests E2E básicos implementados.**

---

### ✅ **FASE 4: AUDITAR Y MEJORAR SEGURIDAD** (1 semana)

#### Paso 1: Análisis del sistema actual
```bash
# Revisar cómo se manejan las sesiones
grep -r "localStorage.setItem" src/app/login/

# Revisar APIs sin autenticación
grep -r "export async function" src/app/api/ | head -20
```

#### Paso 2: Migrar a Supabase Auth (OPCIÓN A - Recomendada)

**Ventajas**:
- ✅ JWT robusto
- ✅ httpOnly cookies automático
- ✅ Refresh tokens
- ✅ MFA opcional
- ✅ Session management

**Documentación**: https://supabase.com/docs/guides/auth

#### Paso 3: Implementar JWT Custom (OPCIÓN B)

**Si no usas Supabase Auth**, implementar:
```typescript
// src/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret)
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload
}
```

#### Paso 4: Implementar httpOnly cookies
```typescript
// src/app/api/auth/login/route.ts
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  // ... autenticación ...

  const token = await createToken({ userId, role })

  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8 // 8 horas
  })

  return NextResponse.json({ success: true })
}
```

#### Paso 5: Implementar middleware de autenticación
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const payload = await verifyToken(token)
    // Token válido, continuar
    return NextResponse.next()
  } catch {
    // Token inválido, redirigir a login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard-:path*', '/api/:path*']
}
```

#### Paso 6: Implementar rate limiting
```bash
# Instalar upstash/ratelimit
bun add @upstash/ratelimit @upstash/redis
```

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})
```

✅ **Seguridad mejorada significativamente.**

---

### ✅ **FASE 5: MIGRAR STRIPE A LIVE** (1 día)

#### Paso 1: Obtener keys LIVE de Stripe
```
1. Login en https://dashboard.stripe.com/
2. Activar "View test data" → OFF (cambiar a LIVE)
3. Developers → API keys
4. Copiar:
   - Secret key (sk_live_...)
   - Publishable key (pk_live_...)
```

#### Paso 2: Configurar webhook LIVE
```
1. Developers → Webhooks
2. Add endpoint
3. URL: https://www.custodia360.es/api/stripe/webhook
4. Events:
   - checkout.session.completed
   - invoice.payment_succeeded
   - invoice.payment_failed
   - customer.subscription.updated
   - customer.subscription.deleted
5. Copiar Signing secret (whsec_...)
```

#### Paso 3: Actualizar variables en Netlify
```
1. Site settings → Environment variables
2. Actualizar:
   - STRIPE_SECRET_KEY = sk_live_...
   - STRIPE_WEBHOOK_SECRET = whsec_...
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
3. Trigger deploy
```

#### Paso 4: Testing con tarjetas de prueba LIVE
```
# Stripe proporciona tarjetas de prueba incluso en LIVE mode
# Documentación: https://stripe.com/docs/testing

# Tarjeta de éxito:
4242 4242 4242 4242
Fecha: cualquier futura
CVV: cualquier 3 dígitos
ZIP: cualquier 5 dígitos
```

#### Paso 5: Testing end-to-end
```
1. Ir a /planes
2. Seleccionar plan
3. Completar checkout con tarjeta de prueba
4. Verificar:
   - Webhook recibido
   - Entidad creada en Supabase
   - Email de bienvenida enviado
   - Factura creada en Holded (verificar)
```

✅ **Stripe en LIVE mode operativo.**

---

## 📊 PROGRESO

Marca cada fase cuando la completes:

```
□ FASE 1: Git y GitHub configurado (2h)
□ FASE 2: Supabase verificado (4h)
□ FASE 3: Tests E2E implementados (1 semana)
□ FASE 4: Seguridad mejorada (1 semana)
□ FASE 5: Stripe LIVE (1 día)
```

**Cuando todas estén ✅**:
- Proyecto **PRODUCTION READY**
- Lanzamiento posible con riesgo controlado

---

## 🚨 IMPORTANTE

### NO hacer en producción sin completar las 5 fases:
- ❌ No lanzar sin Git/GitHub
- ❌ No lanzar sin tests
- ❌ No lanzar sin seguridad robusta
- ❌ No lanzar con Stripe test mode
- ❌ No lanzar sin verificar Supabase

### SÍ se puede hacer ahora (entorno local/demo):
- ✅ Seguir desarrollando features
- ✅ Testing manual en DEMO mode
- ✅ Mostrar a stakeholders (modo DEMO)
- ✅ Recopilar feedback

---

## 📞 DUDAS O PROBLEMAS

Si encuentras algún error o tienes dudas durante la ejecución:

1. **Revisa la documentación completa**: `.same/AUDITORIA_COMPLETA_ENERO_2025.md`
2. **Consulta el resumen**: `.same/RESUMEN_AUDITORIA_EJECUTIVO.md`
3. **Pregunta a Same AI** en el chat
4. **Documenta el problema** en `.same/CHANGE_LOG.md`

---

## ✅ CHECKLIST FINAL PRE-PRODUCCIÓN

```
□ Git inicializado y pusheado a GitHub
□ Migrations Supabase verificadas y aplicadas
□ Seed data ejecutado
□ Tests E2E pasando (al menos 5 flujos)
□ Seguridad auditada (JWT + httpOnly + rate limit)
□ Stripe migrado a LIVE
□ Holded verificado
□ Webhook Resend activo
□ Testing end-to-end completo
□ Documentación actualizada
□ Backups configurados
□ Monitoring activo (opcional)
```

**Cuando todo esté ✅**: 🚀 **READY TO LAUNCH**

---

**Última actualización**: 27 de enero de 2025
**Próxima revisión**: Después de completar las 5 fases
