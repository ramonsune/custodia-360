# 📋 Instrucciones de Integración - Kit de Comunicación LOPIVI

## ✅ Archivos Creados

### 1. Base de Datos
- ✅ `scripts/sql/setup-kit-comunicacion.sql` - Script SQL completo para Supabase

### 2. APIs
- ✅ `/api/kit-comunicacion/purchase/route.ts` - API de compra del Kit
- ✅ `/api/entity/update-contact/route.ts` - API para actualizar emails de la entidad

### 3. Templates
- ✅ Email de factura kit (`enviarFacturaKitComunicacion`)
- ✅ Email de confirmación delegado (`enviarConfirmacionKitDelegado`)
- ✅ PDF de factura (`facturaKitComunicacion`)

### 4. Frontend
- ✅ Función `handleContratarServicio` en `dashboard-entidad/page.tsx`
- ✅ Precio actualizado (40€ + IVA = 48,40€) en todos los lugares
- ✅ Emoji 🔒 eliminado en `dashboard-delegado/page.tsx`

---

## 🔧 PASOS PARA COMPLETAR LA INTEGRACIÓN

### PASO 1: Ejecutar Script SQL en Supabase

**⚠️ IMPORTANTE:** Debes ejecutar este script en tu proyecto de Supabase.

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **SQL Editor**
3. Copia el contenido de `scripts/sql/setup-kit-comunicacion.sql`
4. Pégalo en el editor y ejecuta

**El script añade:**
- Campos `email_admin`, `email_contratante`, `stripe_customer_id`, `stripe_payment_method_id`, `kit_comunicacion_activo`, `kit_comunicacion_purchased_at` a la tabla `entities`
- Tabla `invoices` para registro de facturas
- Índices y políticas RLS
- Función helper `generate_invoice_number()`

---

### PASO 2: Modificar Proceso de Contratación

**Archivo a modificar:** `src/app/contratar/pago/page.tsx`

**En la función `handlePagoCompleto` (aproximadamente línea 165), AÑADIR después del pago exitoso:**

```typescript
// DESPUÉS de la línea donde se procesa el pago y ANTES de enviar emails:

// Guardar emails de contacto en la entidad
try {
  await fetch('/api/entity/update-contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      entityId: entityId, // ID de la entidad recién creada
      emailAdmin: datosCompletos.emailAdministrativo,
      emailContratante: datosCompletos.emailContratante,
      stripeCustomerId: stripeCustomerId, // Si ya lo creaste con Stripe
      stripePaymentMethodId: stripePaymentMethodId // Si guardaste el payment method
    })
  })
  console.log('✅ Emails de contacto guardados')
} catch (error) {
  console.error('⚠️ Error guardando emails de contacto:', error)
  // No fallar la contratación por esto
}
```

**Ubicación exacta:**
Después de crear la entidad en Supabase y antes de enviar los emails de bienvenida.

---

### PASO 3: Configurar Variables de Entorno (Stripe)

**⚠️ NOTA:** Actualmente la API funciona en MODO DEMO (simula pagos).

Para **producción**, necesitas configurar Stripe:

1. Añade a tu `.env.local`:
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

2. Descomenta el código Stripe en `/api/kit-comunicacion/purchase/route.ts` (líneas 86-138)

3. Instala Stripe SDK si no está instalado:
```bash
bun add stripe
```

---

### PASO 4: Verificar Configuración de Resend

**Email templates añadidos a:** `src/lib/email-templates.ts`

✅ `enviarFacturaKitComunicacion()` - Envía factura con PDF adjunto
✅ `enviarConfirmacionKitDelegado()` - Notifica al delegado

**Verifica que tienes configurado en `.env.local`:**
```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=info@custodia360.es
```

---

## 📊 FLUJO COMPLETO

### Cuando un usuario contrata el Kit:

1. **Dashboard Entidad** → Click "Contratar Kit de Comunicación" (40€ + IVA)
2. **Modal de Pago** → Selecciona tarjeta existente o nueva
3. **POST /api/kit-comunicacion/purchase**
   - Procesa pago (DEMO o Stripe real)
   - Genera factura PDF
   - Guarda en tabla `invoices`
   - Actualiza `kit_comunicacion_activo = true`
   - Envía email factura a `email_admin`
   - Envía email confirmación a delegado
4. **Dashboard recarga** → Kit ahora activo
5. **Dashboard Delegado** → Acceso a Plantillas desbloqueado

---

## 🧪 TESTING

### Test en MODO DEMO (sin Stripe real):

1. Asegúrate de que el script SQL esté ejecutado en Supabase
2. Ve a `/dashboard-entidad`
3. Click en "Contratar Kit de Comunicación"
4. Selecciona cualquier opción de pago (simulará éxito)
5. Verifica que:
   - ✅ Sale alerta de éxito
   - ✅ Se recarga la página
   - ✅ En Supabase `entities.kit_comunicacion_activo = true`
   - ✅ Hay un registro en tabla `invoices`
   - ✅ Se enviaron los emails (revisa logs de Resend)

### Test en PRODUCCIÓN (con Stripe real):

1. Configura Stripe (variables de entorno)
2. Descomenta código Stripe en la API
3. Usa tarjeta de prueba Stripe: `4242 4242 4242 4242`
4. Verifica que el pago se procese en Stripe Dashboard

---

## 📁 ESTRUCTURA DE ARCHIVOS CREADOS

```
custodia-360/
├── scripts/
│   └── sql/
│       └── setup-kit-comunicacion.sql          ✅ NUEVO
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── entity/
│   │   │   │   └── update-contact/
│   │   │   │       └── route.ts                ✅ NUEVO
│   │   │   └── kit-comunicacion/
│   │   │       └── purchase/
│   │   │           └── route.ts                ✅ NUEVO
│   │   ├── dashboard-delegado/
│   │   │   └── page.tsx                        ✅ MODIFICADO (sin emoji)
│   │   └── dashboard-entidad/
│   │       └── page.tsx                        ✅ MODIFICADO (precio + función)
│   └── lib/
│       ├── email-templates.ts                  ✅ MODIFICADO (2 templates nuevos)
│       └── pdf-generator.ts                    ✅ MODIFICADO (template factura)
└── INSTRUCCIONES-INTEGRACION-KIT.md            ✅ ESTE ARCHIVO
```

---

## ✅ CHECKLIST FINAL

Antes de considerar la integración completa:

- [ ] Script SQL ejecutado en Supabase
- [ ] Verificado que campos nuevos existen en tabla `entities`
- [ ] Verificado que tabla `invoices` existe
- [ ] Modificado `contratar/pago/page.tsx` para guardar emails
- [ ] Variables de entorno configuradas (Resend)
- [ ] (Opcional) Stripe configurado para producción
- [ ] Test de compra exitoso
- [ ] Email de factura recibido
- [ ] Email de confirmación recibido
- [ ] Kit activado en dashboard delegado
- [ ] Plantillas accesibles sin emoji 🔒

---

## 🆘 SOPORTE

Si encuentras algún error durante la integración:

1. Revisa los logs del servidor (`console.log` en las APIs)
2. Verifica que Supabase tenga los campos correctos
3. Confirma que las variables de entorno están configuradas
4. Revisa los emails en Resend Dashboard

**Problemas comunes:**

- **"Entity ID requerido"** → Verifica que `entityId` se está pasando correctamente
- **"Error de configuración"** → Revisa variables de entorno de Supabase
- **"Error en el pago"** → Stripe no configurado o tarjeta inválida
- **"Email no enviado"** → Revisa Resend API key y from email

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

1. **Webhooks de Stripe** - Para confirmar pagos de forma asíncrona
2. **Dashboard de facturas** - Panel para ver todas las facturas
3. **Descarga de facturas** - Permitir descargar PDFs desde el dashboard
4. **Notificaciones push** - Avisar cuando se activa el kit
5. **Analytics** - Trackear conversiones de compra del kit

---

¡Implementación completa! 🎉
