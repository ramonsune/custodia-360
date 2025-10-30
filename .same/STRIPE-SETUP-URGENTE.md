# 🚨 STRIPE - ACTIVAR PRODUCCIÓN (30 MINUTOS)

**Estado actual:** ❌ Test mode
**Necesario:** ✅ Live mode

---

## 🎯 OBJETIVO

Obtener estas 3 claves en modo LIVE:

```bash
1. pk_live_________________
2. sk_live_________________
3. whsec___________________ (webhook)
```

---

## 📋 PASO A PASO

### PASO 1: Ir a Stripe Dashboard (2 min)

1. **Ve a:** https://dashboard.stripe.com
2. **Login** con tu cuenta

---

### PASO 2: Activar Modo Live (15 min)

**Arriba a la derecha verás un toggle que dice:**
```
"Ver datos de prueba" 🔴 TEST
```

**Haz clic para cambiar a:**
```
"Ver datos en vivo" 🟢 LIVE
```

---

### SI TE PIDE ACTIVAR CUENTA:

**Tendrás que completar:**

```yaml
Información Empresa:
  - Nombre legal: Sportsmotherland SL
  - NIF/CIF: __________
  - Dirección fiscal: __________
  - Sector: Software / SaaS

Cuenta Bancaria:
  - IBAN donde recibirás los pagos
  - Titular: Sportsmotherland SL

Representante Legal:
  - Nombre: __________
  - DNI: __________
  - Email: __________
  - Teléfono: __________

Verificación:
  - Puede pedir foto DNI
  - Puede pedir CIF empresa
```

**Tiempo:** 10-15 minutos
**Aprobación:** Normalmente instantánea

---

### PASO 3: Copiar Claves Live (2 min)

Una vez en modo LIVE:

1. **Ve a:** Desarrolladores → Claves API
2. **Verás:**
   ```
   Clave publicable: pk_live_________________
   Clave secreta: sk_live___________________ (Revelar)
   ```
3. **Copia ambas**

---

### PASO 4: Crear Webhook Live (5 min)

1. **Ve a:** Desarrolladores → Webhooks
2. **Clic:** "Agregar endpoint"
3. **Configurar:**
   ```
   URL del endpoint: https://www.custodia360.es/api/stripe/webhook

   Descripción: Custodia360 Production Webhook

   Versión: Última versión (2024-11-20 o similar)
   ```

4. **Eventos a escuchar** (seleccionar estos):
   ```
   ✅ checkout.session.completed
   ✅ checkout.session.expired
   ✅ customer.subscription.created
   ✅ customer.subscription.updated
   ✅ customer.subscription.deleted
   ✅ invoice.created
   ✅ invoice.finalized
   ✅ invoice.paid
   ✅ invoice.payment_failed
   ✅ invoice.payment_succeeded
   ✅ payment_intent.succeeded
   ✅ payment_intent.payment_failed
   ```

5. **Clic:** "Agregar endpoint"

6. **Copia el Signing Secret:**
   ```
   whsec___________________
   ```

---

### PASO 5: Verificar Productos Existen (3 min)

1. **Ve a:** Productos → Catálogo
2. **Verifica que existen:**
   ```
   ✅ Plan 100 (price_1SFxNFPtu7JxWqv903F0znAe)
   ✅ Plan 250 (price_1SFfQmPtu7JxWqv9IgtAnkc2)
   ✅ Plan 500 (price_1SFydNPtu7JxWqv9mUQ9HMjh)
   ✅ Plan 500+ (price_1SFyhxPtu7JxWqv9GG2GD6nS)
   ✅ Renovación Plan 100
   ✅ Renovación Plan 250
   ✅ Renovación Plan 500
   ✅ Renovación Plan 500+
   ✅ Kit Comunicación
   ✅ Delegado Suplente
   ```

**Si NO existen en LIVE:**
- Los Price IDs que me diste son de TEST mode
- Necesitas recrear los productos en LIVE
- O migrarlos de TEST → LIVE (Stripe lo permite)

---

## 🔄 MIGRAR PRODUCTOS DE TEST A LIVE

Si tus productos solo existen en TEST:

1. **Ve a:** Productos (en modo TEST)
2. **Para cada producto:**
   - Clic en el producto
   - Arriba derecha: "⋯" (tres puntos)
   - Clic: "Duplicar en modo en vivo"
3. **Stripe los creará automáticamente en LIVE**
4. **Copia los nuevos Price IDs** (serán diferentes)

---

## ✅ RESULTADO FINAL

**Al terminar tendrás:**

```bash
Claves Live:
  STRIPE_PUBLISHABLE_KEY: pk_live_________________
  STRIPE_SECRET_KEY: sk_live_________________
  STRIPE_WEBHOOK_SECRET: whsec_________________

Productos en Live:
  ✅ 10 productos activos
  ✅ Price IDs válidos
```

---

## 📤 DAME ESTA INFO

```
✅ COMPLETADO - Dame:

1. pk_live_________________
2. sk_live_________________
3. whsec_________________

4. ¿Productos migrados a LIVE?
   [ ] SÍ - Mismos Price IDs funcionan
   [ ] NO - Tengo nuevos Price IDs: price_..., price_..., etc
```

---

## ⏱️ TIEMPO ESTIMADO

- Con cuenta ya activada: **10 minutos**
- Sin cuenta activada: **30 minutos**

---

**¿Tienes ya cuenta Stripe activada en modo Live?**

- [ ] SÍ - Solo copio claves (10 min)
- [ ] NO - Necesito activarla (30 min)
- [ ] NO SÉ - Déjame verificar
