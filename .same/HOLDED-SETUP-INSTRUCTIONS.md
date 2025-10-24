# 🚀 Instrucciones de Activación: Integración Holded

**Fecha**: 22 de octubre de 2025
**Estado**: ✅ Código implementado - Pendiente activación en producción

---

## 📋 Resumen

Se ha implementado la integración completa de **Holded** (ERP español) con Custodia360 para:
- ✅ Facturación legal automática con numeración secuencial
- ✅ Contactos (clientes) sincronizados
- ✅ Facturas profesionales con PDF generado
- ✅ Contabilidad integrada
- ✅ Cumplimiento fiscal español (IVA, IRPF, modelos tributarios)

---

## 🎯 Archivos Implementados

### Código
1. **`src/lib/holded-client.ts`** - Cliente API de Holded
2. **`src/app/api/stripe/webhook/route.ts`** - Webhook actualizado con integración Holded

### Configuración
3. **`.env.local`** - Variables de entorno locales
4. **`netlify.toml`** - Variables de producción

### Base de Datos
5. **`scripts/sql/holded-integration.sql`** - Schema SQL

### Documentación
6. **`.same/holded-stripe-integration.md`** - Análisis completo
7. **`.same/HOLDED-SETUP-INSTRUCTIONS.md`** - Este documento

---

## ⚙️ Variables de Entorno Configuradas

Ya están configuradas en `.env.local` y `netlify.toml`:

```bash
# API de Holded
HOLDED_API_KEY=e9d72a6218d5920fdf1d70196c7e5b01
HOLDED_API_URL=https://api.holded.com/api

# Product IDs de Holded
HOLDED_PRODUCT_PLAN_100=68f9164ccdde27b3e5014c72
HOLDED_PRODUCT_PLAN_250=68f916d4ebdb43e4cc0b747a
HOLDED_PRODUCT_PLAN_500=68f91716736b41626c08ee2b
HOLDED_PRODUCT_PLAN_500_PLUS=68f9175775da4dcc780c6117
HOLDED_PRODUCT_KIT=68f91782196598d24f0a6ec6
HOLDED_PRODUCT_SUPLENTE=68f917abd2ec4e80a2085c10
```

---

## 🔴 PASO 1: Ejecutar SQL en Supabase (5 min)

### 1.1. Acceder a Supabase Dashboard

1. Ir a https://supabase.com/dashboard
2. Seleccionar proyecto: **gkoyqfusawhnobvkoijc**
3. Click en **SQL Editor** (menú lateral izquierdo)

### 1.2. Ejecutar Script SQL

1. Click en **New Query**
2. Abrir archivo: `custodia-360/scripts/sql/holded-integration.sql`
3. **Copiar TODO el contenido** del archivo
4. **Pegar** en el editor SQL de Supabase
5. Click en **Run** (botón verde esquina inferior derecha)

### 1.3. Verificar Columnas Creadas

1. Click en **Table Editor** (menú lateral)
2. Seleccionar tabla `entities`
3. Verificar que existen las columnas:
   - `holded_contact_id` (text)
   - `holded_invoice_id` (text)
   - `holded_invoice_number` (text)

4. Seleccionar tabla `invoices`
5. Verificar que existen las columnas:
   - `holded_invoice_id` (text)
   - `holded_invoice_number` (text)
   - `holded_pdf_url` (text)
   - `holded_status` (text)

✅ **Resultado esperado**: Todas las columnas presentes en ambas tablas

---

## 🟡 PASO 2: Verificar Product IDs en Holded (10 min)

### 2.1. Acceder a Holded Dashboard

1. Ir a https://app.holded.com
2. Login con tus credenciales
3. Click en **Productos** (menú lateral)

### 2.2. Verificar Mapeo de Productos

Necesitas verificar que los IDs en `.env.local` corresponden a los productos correctos:

| Variable | Nombre Esperado en Holded | ID Actual |
|----------|---------------------------|-----------|
| `HOLDED_PRODUCT_PLAN_100` | Plan 100 | `68f9164ccdde27b3e5014c72` |
| `HOLDED_PRODUCT_PLAN_250` | Plan 250 | `68f916d4ebdb43e4cc0b747a` |
| `HOLDED_PRODUCT_PLAN_500` | Plan 500 | `68f91716736b41626c08ee2b` |
| `HOLDED_PRODUCT_PLAN_500_PLUS` | Plan 500+ | `68f9175775da4dcc780c6117` |
| `HOLDED_PRODUCT_KIT` | Kit de Comunicación | `68f91782196598d24f0a6ec6` |
| `HOLDED_PRODUCT_SUPLENTE` | Delegado Suplente | `68f917abd2ec4e80a2085c10` |

### 2.3. Cómo Verificar un Product ID

1. En Holded, click en un producto
2. Observar la URL del navegador:
   ```
   https://app.holded.com/products/68f9164ccdde27b3e5014c72
                                   ^^^^^^^^^^^^^^^^^^^^^^^^
                                   Este es el Product ID
   ```
3. Comparar con la tabla anterior
4. Si algún ID no coincide, actualizar `.env.local` y `netlify.toml`

✅ **Resultado esperado**: Todos los IDs correctamente mapeados

---

## 🟢 PASO 3: Testing Local (15 min)

### 3.1. Instalar Dependencias (si es necesario)

```bash
cd custodia-360
bun install
```

### 3.2. Verificar Variables de Entorno

```bash
# Verificar que HOLDED_API_KEY está en .env.local
cat .env.local | grep HOLDED_API_KEY
```

Debe mostrar:
```
HOLDED_API_KEY=e9d72a6218d5920fdf1d70196c7e5b01
```

### 3.3. Crear Script de Testing

Crear archivo `custodia-360/scripts/test-holded-integration.ts`:

```typescript
import { holdedClient } from '../src/lib/holded-client'

async function testHolded() {
  console.log('🧪 Testing Holded Integration...\n')

  // 1. Verificar conexión
  console.log('1️⃣ Verificando conexión API...')
  const connected = await holdedClient.verifyConnection()
  console.log(connected ? '✅ Conexión OK\n' : '❌ Error de conexión\n')

  if (!connected) {
    console.error('❌ No se pudo conectar a Holded. Verifica la API Key.')
    return
  }

  // 2. Test: Crear contacto de prueba
  console.log('2️⃣ Creando contacto de prueba...')
  const contactId = await holdedClient.upsertContact({
    name: 'Test Custodia360',
    email: 'test@custodia360.es',
    code: 'B12345678',
    tradename: 'Test Entity',
    address: 'Calle Test 123',
    phone: '612345678',
  })

  if (contactId) {
    console.log(`✅ Contacto creado: ${contactId}\n`)
  } else {
    console.error('❌ Error creando contacto\n')
    return
  }

  // 3. Test: Crear factura de prueba
  console.log('3️⃣ Creando factura de prueba...')
  const invoice = await holdedClient.createInvoice({
    contactId: contactId,
    contactName: 'Test Custodia360',
    contactCode: 'B12345678',
    date: Math.floor(Date.now() / 1000),
    items: [
      {
        name: 'Plan 250 - Primer Pago (TEST)',
        desc: 'Prueba de integración Custodia360',
        units: 1,
        subtotal: 100.00,
        discount: 0,
        tax: 21,
      },
    ],
    desc: 'Factura de prueba - Integración Custodia360',
    notes: 'Esta es una factura de prueba. Puede eliminarse.',
  })

  if (invoice) {
    console.log(`✅ Factura creada: ${invoice.docNumber} (ID: ${invoice.id})`)
    console.log(`   Total: ${invoice.total}€\n`)
  } else {
    console.error('❌ Error creando factura\n')
    return
  }

  console.log('🎉 Testing completado exitosamente!')
  console.log('\n📝 Próximos pasos:')
  console.log('   1. Verificar en Holded Dashboard que aparecen:')
  console.log('      - Contacto: Test Custodia360')
  console.log(`      - Factura: ${invoice?.docNumber || 'N/A'}`)
  console.log('   2. Eliminar el contacto y factura de prueba desde Holded')
  console.log('   3. Continuar con testing de Stripe + Holded')
}

testHolded().catch(console.error)
```

### 3.4. Ejecutar Test

```bash
cd custodia-360
bun run scripts/test-holded-integration.ts
```

### 3.5. Verificar en Holded Dashboard

1. Ir a https://app.holded.com/invoicing/contacts
2. Buscar "Test Custodia360" → Debe aparecer
3. Ir a https://app.holded.com/invoicing/invoices
4. Verificar que aparece una factura con número (ej: 2025/001)

### 3.6. Limpiar Datos de Prueba

1. En Holded Dashboard, eliminar:
   - Contacto de prueba
   - Factura de prueba

✅ **Resultado esperado**: Contacto y factura creados correctamente en Holded

---

## 🔵 PASO 4: Testing de Integración Stripe + Holded (20 min)

### 4.1. Iniciar Servidor de Desarrollo

```bash
cd custodia-360
bun run dev
```

### 4.2. Configurar Stripe CLI (para webhooks locales)

```bash
# Instalar Stripe CLI si no lo tienes
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks a tu local
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copiar el **webhook secret** que muestra (empieza con `whsec_`) y actualizar `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxx...
```

### 4.3. Realizar Compra de Prueba

1. Abrir navegador: http://localhost:3000/contratar (o la URL de tu página de contratación)
2. Seleccionar **Plan 250** + **Kit de Comunicación**
3. Llenar formulario con datos de prueba:
   - Entidad: Test Holded SL
   - CIF: B12345678
   - Email: tu-email-real@gmail.com
   - Delegado: Test Delegado
   - etc.
4. Continuar al checkout de Stripe
5. Usar tarjeta de prueba: `4242 4242 4242 4242`
   - Fecha: Cualquier futura
   - CVC: 123
6. Completar pago

### 4.4. Verificar Logs

En la terminal donde corre `bun run dev`, deberías ver:

```
✅ Stripe webhook recibido: checkout.session.completed
🎯 [WEBHOOK] Procesando contratación de plan inicial...
📝 [PLAN INICIAL] Extrayendo datos del metadata...
🏢 [PLAN INICIAL] Creando entidad...
✅ [PLAN INICIAL] Entidad creada: xxx...
📇 [HOLDED] Iniciando integración...
✅ [HOLDED] Contacto creado/actualizado: yyy...
✅ [HOLDED] Factura creada: 2025/002 (ID: zzz...)
✅ [HOLDED] Integración completada exitosamente
👤 [PLAN INICIAL] Creando delegado principal...
✅ [PLAN INICIAL] Delegado creado
✅ [WEBHOOK] Factura guardada: FAC-PLAN_INICIAL-2025-...
🎉 [PLAN INICIAL] Contratación completada exitosamente
```

### 4.5. Verificar en Supabase

1. Ir a Supabase Dashboard → Table Editor → `entities`
2. Buscar la entidad recién creada
3. Verificar que tiene:
   - `holded_contact_id`: ✅ Filled
   - `holded_invoice_id`: ✅ Filled
   - `holded_invoice_number`: ✅ Filled (ej: "2025/002")

4. Ir a tabla `invoices`
5. Verificar que la factura tiene:
   - `holded_invoice_id`: ✅ Filled
   - `holded_invoice_number`: ✅ Filled
   - `holded_status`: "paid"

### 4.6. Verificar en Holded Dashboard

1. Ir a https://app.holded.com/invoicing/contacts
2. Buscar "Test Holded SL" → Debe aparecer
3. Click en el contacto → Ver detalles
4. Verificar datos: CIF, email, teléfono

5. Ir a https://app.holded.com/invoicing/invoices
6. Buscar factura reciente → Debe aparecer
7. Click en la factura → Ver detalles
8. Verificar:
   - Cliente: Test Holded SL
   - Items: Plan 250 + Kit de Comunicación
   - Subtotal: Correcto
   - IVA (21%): Correcto
   - Total: Coincide con pago de Stripe
   - Estado: Pagada

9. Click en **Descargar PDF** → Debe generar PDF profesional

✅ **Resultado esperado**: Factura legal completa en Holded con todos los datos correctos

---

## 🟣 PASO 5: Desplegar a Producción (10 min)

### 5.1. Verificar Variables en Netlify

1. Ir a https://app.netlify.com
2. Seleccionar tu sitio: **custodia360**
3. Click en **Site settings**
4. Click en **Environment variables**
5. Verificar que existen todas las variables HOLDED_*

Si faltan, añadirlas manualmente:

```
HOLDED_API_KEY=e9d72a6218d5920fdf1d70196c7e5b01
HOLDED_API_URL=https://api.holded.com/api
HOLDED_PRODUCT_PLAN_100=68f9164ccdde27b3e5014c72
HOLDED_PRODUCT_PLAN_250=68f916d4ebdb43e4cc0b747a
HOLDED_PRODUCT_PLAN_500=68f91716736b41626c08ee2b
HOLDED_PRODUCT_PLAN_500_PLUS=68f9175775da4dcc780c6117
HOLDED_PRODUCT_KIT=68f91782196598d24f0a6ec6
HOLDED_PRODUCT_SUPLENTE=68f917abd2ec4e80a2085c10
```

### 5.2. Deploy

```bash
cd custodia-360
git add .
git commit -m "feat: Integración completa con Holded para facturación legal"
git push origin main
```

Netlify desplegará automáticamente.

### 5.3. Verificar Deploy

1. Esperar a que termine el deploy (2-3 min)
2. Ver logs en Netlify Dashboard
3. Confirmar que el build fue exitoso

### 5.4. Testing en Producción

1. Ir a https://www.custodia360.es/contratar
2. Realizar compra de prueba con tarjeta real o de test
3. Verificar todo el flujo igual que en local
4. Confirmar factura en Holded

✅ **Resultado esperado**: Sistema completamente operativo en producción

---

## 📊 Flujo Completo de Integración

```
USUARIO CONTRATA PLAN 250 + KIT
         ↓
[1] Stripe Checkout procesa pago (176,55€)
         ↓
[2] Stripe envía webhook → /api/stripe/webhook
         ↓
[3] Webhook crea entidad en Supabase
         ↓
[4] Webhook llama Holded API
    ├─> Crear/Actualizar Contacto
    └─> Crear Factura con items:
        - Plan 250 (50%) = 68,60€ + IVA
        - Kit Comunicación = 40€ + IVA
         ↓
[5] Holded genera:
    ├─> Factura 2025/XXX
    ├─> PDF profesional
    ├─> Asiento contable
    └─> Actualiza CRM
         ↓
[6] Webhook guarda holded_invoice_id en Supabase
         ↓
[7] Usuario recibe factura legal española
```

---

## 🐛 Troubleshooting

### Error: "API Key no configurada"

**Causa**: Variable `HOLDED_API_KEY` no está en `.env.local` o Netlify

**Solución**:
```bash
# Verificar
echo $HOLDED_API_KEY

# Si no existe, añadir a .env.local:
echo "HOLDED_API_KEY=e9d72a6218d5920fdf1d70196c7e5b01" >> .env.local

# Reiniciar servidor
bun run dev
```

---

### Error: "Error creando contacto (401)"

**Causa**: API Key inválida o expirada

**Solución**:
1. Ir a Holded Dashboard → Settings → Developers
2. Verificar que la API Key es correcta
3. Si expiró, generar nueva y actualizar variables

---

### Error: "Error creando factura (400)"

**Causa**: Datos inválidos (subtotal, tax, contactId)

**Solución**:
1. Verificar logs en consola
2. Verificar que el contacto existe en Holded
3. Verificar cálculos de subtotal e IVA

---

### Factura no aparece en Holded

**Causa**: Request exitoso pero factura en estado draft o error de sincronización

**Solución**:
1. Verificar en Holded Dashboard → Facturas
2. Filtrar por "Borrador"
3. Si aparece, cambiar estado manualmente
4. Verificar `holded_invoice_id` en Supabase

---

### Product IDs incorrectos

**Causa**: Mapeo incorrecto de productos

**Solución**:
1. Ir a cada producto en Holded
2. Copiar ID de la URL
3. Actualizar `.env.local` y `netlify.toml`
4. Redeploy

---

## ✅ Checklist Final

Antes de dar por completada la integración:

- [ ] SQL ejecutado en Supabase (columnas creadas)
- [ ] Product IDs verificados en Holded
- [ ] Testing local exitoso (contacto + factura)
- [ ] Testing Stripe + Holded local exitoso
- [ ] Factura visible en Holded con datos correctos
- [ ] PDF de factura descargable
- [ ] Variables configuradas en Netlify
- [ ] Deploy a producción exitoso
- [ ] Testing en producción exitoso
- [ ] Primera factura real generada correctamente

---

## 📞 Soporte

**Documentación Holded**: https://developers.holded.com/reference
**Dashboard Holded**: https://app.holded.com
**Soporte Holded**: support@holded.com

**Archivos de referencia**:
- `.same/holded-stripe-integration.md` - Análisis completo
- `src/lib/holded-client.ts` - Cliente API
- `scripts/sql/holded-integration.sql` - Schema SQL

---

**Documento creado**: 22 de octubre de 2025, 23:30 Europe/Madrid
**Versión**: 1.0
**Estado**: ✅ Listo para activación
