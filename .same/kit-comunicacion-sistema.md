# 📦 Sistema de Control de Acceso - Kit de Comunicación LOPIVI

**Fecha:** 15 Octubre 2025
**Estado:** ✅ Implementado
**Modo:** 🔒 Consolidación Activa

---

## 🎯 Objetivo

Controlar el acceso al cuadro "Plantillas" del Panel Delegado Principal, permitiendo el acceso solo a entidades que tengan contratado el **Kit de Comunicación LOPIVI**.

---

## 🏗️ Arquitectura

### 1. Base de Datos

**Tabla:** `entities`
**Campo añadido:** `kit_comunicacion BOOLEAN DEFAULT false`

```sql
-- Migración: 20251015_kit_comunicacion.sql
ALTER TABLE entities
ADD COLUMN IF NOT EXISTS kit_comunicacion BOOLEAN DEFAULT false;

COMMENT ON COLUMN entities.kit_comunicacion IS
'Indica si la entidad tiene activo el Kit de Comunicación LOPIVI (precio Stripe: price_1SFtBIPtu7JxWqv9sw7DH5ML)';

CREATE INDEX IF NOT EXISTS idx_entities_kit_comunicacion ON entities(kit_comunicacion);
```

---

### 2. Backend APIs

#### A) Webhook de Stripe
**Archivo:** `src/app/api/webhooks/stripe/route.ts`

**Funcionalidad:**
- Recibe eventos de Stripe
- Detecta pagos del Kit de Comunicación (price_1SFtBIPtu7JxWqv9sw7DH5ML)
- Actualiza `entities.kit_comunicacion = true` automáticamente

**Eventos manejados:**
- `invoice.paid` - Cuando se paga una factura
- `checkout.session.completed` - Cuando se completa un checkout inicial

**Metadatos requeridos:**
- `entity_id` - ID de la entidad en Supabase
- `includes_kit_comunicacion` - Para checkout inicial (opcional)

---

#### B) API de Verificación de Status
**Archivo:** `src/app/api/kit-comunicacion/status/route.ts`

**Endpoint:** `GET /api/kit-comunicacion/status?entityId={id}`

**Respuesta:**
```json
{
  "activo": true | false
}
```

**Uso:**
```typescript
const response = await fetch(`/api/kit-comunicacion/status?entityId=${entityId}`)
const { activo } = await response.json()
```

---

### 3. Frontend - Panel Delegado

**Archivo:** `src/app/dashboard-delegado/page.tsx`

#### Estados añadidos:
```typescript
const [kitComunicacionActivo, setKitComunicacionActivo] = useState<boolean>(false)
const [verificandoKit, setVerificandoKit] = useState<boolean>(true)
```

#### useEffect de verificación:
```typescript
useEffect(() => {
  const verificarKitComunicacion = async () => {
    // Obtiene entityId de la sesión
    // Llama a /api/kit-comunicacion/status
    // Actualiza estado kitComunicacionActivo
  }

  if (sessionData) {
    verificarKitComunicacion()
  }
}, [sessionData])
```

#### Modal de Plantillas:
- **Si verificando:** Muestra spinner de carga
- **Si NO tiene kit:** Muestra mensaje de restricción y botón "Contratar Kit Comunicación"
- **Si SÍ tiene kit:** Muestra todas las plantillas normalmente

---

## 🔄 Flujos de Activación

### Flujo 1: Contratación Inicial (Onboarding)

1. Usuario selecciona "Kit de Comunicación LOPIVI" en proceso inicial
2. Checkout de Stripe incluye metadata: `includes_kit_comunicacion=true`
3. Evento `checkout.session.completed` dispara webhook
4. Webhook actualiza `entities.kit_comunicacion = true`
5. Delegado tiene acceso inmediato a Plantillas

---

### Flujo 2: Contratación Posterior (desde Panel Entidad)

1. Entidad accede a "Contratar Kit Comunicación" en su panel
2. Realiza pago (price_1SFtBIPtu7JxWqv9sw7DH5ML)
3. Evento `invoice.paid` dispara webhook
4. Webhook detecta el producto y actualiza `entities.kit_comunicacion = true`
5. Delegado tiene acceso a Plantillas (puede requerir refresh)

---

### Flujo 3: Usuario sin Kit

1. Delegado hace clic en "Plantillas"
2. Modal se abre y verifica kit_comunicacion
3. Si es false: Muestra pantalla de restricción
4. Usuario hace clic en "Contratar Kit Comunicación"
5. Redirige a `/dashboard-entidad` (donde está la sección de contratación)

---

## 🎨 UI/UX

### Pantalla de Restricción

```
┌─────────────────────────────────────┐
│  Plantillas para Delegados      ✕  │
├─────────────────────────────────────┤
│                                     │
│              🔒                     │
│                                     │
│      Acceso Restringido             │
│                                     │
│  Esta sección está disponible       │
│  únicamente para entidades con el   │
│  Kit de Comunicación LOPIVI activo. │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Contratar Kit Comunicación → │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## 📋 Checklist de Implementación

### ✅ Completado

- [x] Migración SQL creada (`20251015_kit_comunicacion.sql`)
- [x] Webhook de Stripe implementado
- [x] API de verificación de status creada
- [x] Frontend condicional en modal Plantillas
- [x] Estados y useEffect añadidos
- [x] Pantalla de restricción diseñada
- [x] Documentación completa

### ⏳ Pendiente (Requiere Acción del Usuario)

- [ ] **Ejecutar migración SQL en Supabase**
- [ ] **Configurar STRIPE_WEBHOOK_SECRET** en variables de entorno
- [ ] **Registrar webhook URL en Stripe Dashboard**
- [ ] **Verificar endpoint de contratación** en Panel Entidad

---

## 🔧 Configuración Requerida

### 1. Variables de Entorno

Añadir al archivo `.env.local`:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

### 2. Webhook en Stripe Dashboard

1. Ir a: https://dashboard.stripe.com/webhooks
2. Crear nuevo endpoint: `https://tusitio.com/api/webhooks/stripe`
3. Eventos a escuchar:
   - `invoice.paid`
   - `checkout.session.completed`
4. Copiar el **Signing Secret** a `STRIPE_WEBHOOK_SECRET`

---

### 3. Ejecutar Migración SQL

**Opción 1: Desde Supabase Dashboard**
1. Ir a SQL Editor
2. Copiar contenido de `supabase/migrations/20251015_kit_comunicacion.sql`
3. Ejecutar

**Opción 2: CLI**
```bash
cd custodia-360
supabase db push
```

---

## 🧪 Testing

### Escenario 1: Entidad SIN Kit
```
1. Login como delegado de entidad sin kit
2. Hacer clic en "Plantillas"
3. Verificar mensaje de restricción
4. Verificar botón "Contratar Kit Comunicación"
```

### Escenario 2: Entidad CON Kit
```
1. Activar manualmente en DB: UPDATE entities SET kit_comunicacion=true WHERE id='...'
2. Login como delegado
3. Hacer clic en "Plantillas"
4. Verificar acceso completo a plantillas
```

### Escenario 3: Webhook de Pago
```
1. Usar Stripe CLI para simular evento:
   stripe trigger invoice.paid
2. Verificar logs del webhook
3. Verificar actualización en DB
```

---

## 🐛 Troubleshooting

### Problema: Plantillas bloqueadas aunque se pagó

**Solución:**
1. Verificar en Supabase que `kit_comunicacion = true`
2. Verificar que el entityId en la sesión es correcto
3. Hard refresh del navegador (Ctrl+Shift+R)
4. Verificar logs del webhook en Stripe

---

### Problema: Webhook no se dispara

**Solución:**
1. Verificar que la URL del webhook está registrada en Stripe
2. Verificar que `STRIPE_WEBHOOK_SECRET` está configurado
3. Ver logs de Stripe Dashboard → Webhooks → Logs
4. Probar con Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

---

### Problema: Error al verificar status

**Solución:**
1. Verificar que `entityId` existe en localStorage
2. Verificar logs de la API `/api/kit-comunicacion/status`
3. Verificar permisos RLS en Supabase

---

## 📊 Métricas

- **1 campo** nuevo en BD (kit_comunicacion)
- **2 APIs** nuevas (webhook + status)
- **2 estados** nuevos en frontend
- **1 useEffect** nuevo
- **1 modal** modificado (condicional)

---

## 🔒 Seguridad

- ✅ Webhook verificado con Stripe Signature
- ✅ API requiere entityId válido
- ✅ Verificación en cada apertura del modal
- ✅ Sin exposición de datos sensibles
- ✅ Logs detallados para auditoría

---

## 📝 Notas Importantes

1. **No afecta otras secciones** del Panel Delegado
2. **No modifica** el Panel de Entidad existente
3. **Compatible** con contratación inicial y posterior
4. **Reversible**: Cambiar `kit_comunicacion=false` bloquea acceso inmediatamente
5. **Escalable**: Puede usarse para otros servicios premium

---

**Implementado bajo Modo Consolidación**
**Versión:** 1.0
**Última actualización:** 15 Octubre 2025
