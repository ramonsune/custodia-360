# ✅ STRIPE LIVE ACTIVADO (PRECIOS EXISTENTES) - Custodia360

**Fecha**: 27 de enero de 2025
**Estado**: ✅ CONFIGURADO CON PRECIOS REALES
**Modo**: LIVE (Producción)

---

## 🎯 RESUMEN EJECUTIVO

Se ha configurado Stripe en modo **LIVE** usando los **precios que ya existían** en tu cuenta de Stripe, manteniendo la compatibilidad con los planes ya configurados en la web.

### ✅ Lo que se hizo:
1. ✅ Validado claves LIVE (sk_live_... y pk_live_...)
2. ✅ Archivado producto duplicado que se creó por error
3. ✅ Identificado **12 productos activos** existentes en LIVE
4. ✅ Configurado variables de entorno con **precios REALES**
5. ✅ Preparado sistema para activación

---

## 📦 PRODUCTOS Y PRECIOS EN LIVE (EXISTENTES)

### **Planes Principales** (Recurrentes)

| Producto | Precio | Tipo | ID de Stripe |
|----------|--------|------|--------------|
| **Plan 100** | €19/mes | Mensual | `price_1SLMk1LJQ7Uat0e7K5L0Veva` |
| **Plan 250** | €39/mes | Mensual | `price_1SLMkCLJQ7Uat0e7ttdnzI8J` |
| **Plan 500** | €105/mes | Mensual | `price_1SLMjmLJQ7Uat0e70Hy7auuG` |
| **Plan 500+** | €250/mes | Mensual | `price_1SLMjeLJQ7Uat0e7dp38xOi4` |

### **Productos Adicionales** (Pago único)

| Producto | Precio | ID de Stripe |
|----------|--------|--------------|
| **Delegado Suplente** | €10 | `price_1SLMjQLJQ7Uat0e7H2ATOk6Y` |
| **Kit Comunicación LOPIVI** | €40 | `price_1SLMjeLJQ7Uat0e7Sdmajn4P` |
| **Custodia Temporal** (60 días) | €100 | `price_1SLMkJLJQ7Uat0e7HzGmNM2H` |

### **Renovaciones Anuales** (Pago único)

| Producto | Precio | ID de Stripe |
|----------|--------|--------------|
| **Renovación Plan 100** | €38 | `price_1SLMkGLJQ7Uat0e7nmpV6783` |
| **Renovación Plan 250** | €78 | `price_1SLMmVLJQ7Uat0e7RBYR1kGe` |
| **Renovación Plan 500** | €210 | `price_1SLMjZLJQ7Uat0e7IjUWJcg7` |
| **Renovación Plan 500+** | €500 | `price_1SLMjWLJQ7Uat0e7o26FKsFJ` |

---

## 🔐 CUENTA STRIPE LIVE

- **ID**: `acct_1SEtM8LJQ7Uat0e7`
- **Email**: nandodelolmo@yahoo.es
- **País**: ES (España)
- **Moneda**: EUR
- **Charges**: ✅ HABILITADOS
- **Payouts**: ✅ HABILITADOS
- **Estado**: ✅ ACTIVA Y OPERATIVA

---

## ⚙️ VARIABLES DE ENTORNO CONFIGURADAS

Archivo generado: `.env.local.STRIPE_LIVE_REAL`

```bash
# Modo y claves
STRIPE_MODE=live
STRIPE_SECRET_KEY=sk_live_51SEtM8LJQ7Uat0e7x73...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SEtM8LJQ7Uat0e73K4...
STRIPE_WEBHOOK_SECRET=whsec_GMpgNr83kz1999Sl2LyN...

# Precios principales
STRIPE_PRICE_PLAN_100=price_1SLMk1LJQ7Uat0e7K5L0Veva
STRIPE_PRICE_PLAN_250=price_1SLMkCLJQ7Uat0e7ttdnzI8J
STRIPE_PRICE_PLAN_500=price_1SLMjmLJQ7Uat0e70Hy7auuG
STRIPE_PRICE_PLAN_500_PLUS=price_1SLMjeLJQ7Uat0e7dp38xOi4
STRIPE_PRICE_KIT_COMUNICACION=price_1SLMjeLJQ7Uat0e7Sdmajn4P
STRIPE_PRICE_DELEGADO_SUPLENTE=price_1SLMjQLJQ7Uat0e7H2ATOk6Y
```

---

## ⚡ CÓMO ACTIVAR (3 PASOS - 10 minutos)

### **PASO 1: Activar variables LIVE** (2 min)

```bash
cd custodia-360

# Hacer backup del .env.local actual (TEST)
cp .env.local .env.local.TEST_BACKUP

# Activar LIVE con precios existentes
cp .env.local.STRIPE_LIVE_REAL .env.local

# Reiniciar servidor
bun run dev
```

### **PASO 2: Configurar webhook en Stripe** (5 min)

1. Ir a https://dashboard.stripe.com/webhooks
2. **IMPORTANTE**: Asegurarte que NO estás en "View test data" (modo LIVE)
3. Click "Add endpoint"
4. **URL**: `https://custodia360.es/api/stripe/webhook`
5. **Eventos a seleccionar**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Click "Add endpoint"
7. ⚠️ **Si Stripe genera un webhook secret diferente**, actualizar en `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_[nuevo_secret]
   ```

### **PASO 3: Testing** (3 min)

```bash
# Verificar que el servidor está en modo LIVE
# Debe mostrar las variables LIVE cargadas

# Test básico (opcional)
curl http://localhost:3000/api/payments/health
```

En Stripe Dashboard → Webhooks → tu endpoint:
- Tab "Testing"
- "Send test webhook"
- Verificar respuesta 200 OK

---

## 🔄 ROLLBACK (Si algo falla)

```bash
# Volver a TEST mode
cp .env.local.TEST_BACKUP .env.local
bun run dev
```

---

## 📊 PRODUCTOS ACTIVOS EN STRIPE LIVE

**Total**: 12 productos activos

1. ✅ Plan 100 (€19/mes)
2. ✅ Plan 250 (€39/mes)
3. ✅ Plan 500 (€105/mes)
4. ✅ Plan 500+ (€250/mes)
5. ✅ Delegado Suplente (€10)
6. ✅ Kit Comunicación LOPIVI (€40)
7. ✅ Custodia Temporal (€100)
8. ✅ Renovación Plan 100 (€38)
9. ✅ Renovación Plan 250 (€78)
10. ✅ Renovación Plan 500 (€210)
11. ✅ Renovación Plan 500+ (€500)
12. ✅ Prueba pasarela (€1)

**Producto archivado** (no visible en checkout):
- ❌ DELEGADO_SUPLENTE duplicado (creado por error - archivado)

---

## 🚨 PARA NETLIFY (PRODUCCIÓN)

Cuando quieras activar en producción:

1. Netlify Dashboard → Site settings → Environment variables
2. Actualizar todas las variables de `.env.local.STRIPE_LIVE_REAL`
3. Trigger deploy
4. Configurar webhook apuntando a tu dominio de producción

---

## ✅ CHECKLIST

```
Completado automáticamente:
✅ Validar claves LIVE
✅ Archivar producto duplicado
✅ Identificar productos existentes (12)
✅ Generar variables de entorno con precios reales
✅ Crear documentación

Acción manual requerida (10 min):
□ PASO 1: Renombrar .env.local.STRIPE_LIVE_REAL → .env.local
□ PASO 1: Reiniciar servidor
□ PASO 2: Configurar webhook en Stripe Dashboard
□ PASO 3: Testing básico

Producción (cuando quieras):
□ Actualizar variables en Netlify
□ Deploy a producción
```

---

## 📁 ARCHIVOS DE REFERENCIA

- `.env.local.STRIPE_LIVE_REAL` - **Variables correctas (USAR ESTE)**
- `.same/STRIPE_LIVE_PRECIOS_EXISTENTES.json` - Todos los precios en JSON
- `.same/STRIPE_LIVE_FINAL.md` - Este informe

**Archivos obsoletos** (NO usar):
- ~~`.env.local.STRIPE_LIVE`~~ (tenía precios incorrectos)
- ~~`.same/STRIPE_LIVE_PRICE_IDS.json`~~ (precios duplicados)

---

## 🎯 ESTADO ACTUAL

```
Cuenta Stripe: ✅ LIVE y operativa
Claves: ✅ Validadas
Productos: ✅ 12 existentes identificados
Precios: ✅ Todos los planes de la web
Variables: ✅ Generadas (.env.local.STRIPE_LIVE_REAL)
Producto duplicado: ✅ Archivado
Webhook: ⏳ Pendiente configurar (5 min)
Activación local: ⏳ Pendiente (2 min)

LISTO PARA: Procesar pagos REALES con precios existentes
FALTA: 10 minutos de configuración manual
```

---

## 💡 IMPORTANTE

- ✅ Se están usando los **precios que YA EXISTÍAN** en Stripe LIVE
- ✅ **NO se cambiaron** los precios de la web
- ✅ **Compatibilidad total** con planes actuales
- ✅ Producto duplicado **archivado** (no eliminado, solo oculto)

---

**Generado**: 27 de enero de 2025
**Script**: `scripts/limpiar-y-configurar-precios-live.ts`
**Estado**: ✅ LISTO PARA ACTIVAR
