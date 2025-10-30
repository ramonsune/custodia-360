# 🚀 Integración Holded + Stripe + Custodia360

**Fecha de análisis**: 22 de octubre de 2025
**Estado**: Propuesta de integración completa

---

## 📋 Resumen Ejecutivo

**Recomendación**: ✅ **SÍ, integrar Holded es altamente recomendable** para Custodia360

**Razones principales**:
1. ✅ **Cumplimiento fiscal español** automatizado
2. ✅ **Facturación profesional** con numeración legal
3. ✅ **Contabilidad integrada** (ahorro de tiempo y errores)
4. ✅ **CRM incluido** para gestión de clientes
5. ✅ **Integración nativa** con Stripe
6. ✅ **Coste razonable** para el valor que aporta

---

## 🎯 ¿Qué es Holded?

**Holded** es un ERP/Software de gestión empresarial español todo-en-uno que incluye:

- 📄 **Facturación** automática y profesional
- 💰 **Contabilidad** integrada con plan contable español
- 📊 **CRM** para gestión de clientes
- 📦 **Inventario** (no aplicable para SaaS)
- 👥 **Gestión de equipo** y nóminas
- 📈 **Reportes** y analytics financieros
- 🔗 **Integraciones** con +200 apps (Stripe, PayPal, WooCommerce, etc.)

**Ventaja clave para SaaS**: Diseñado específicamente para cumplimiento fiscal español (IVA, IRPF, modelos tributarios).

---

## 🆚 Comparación: Sistema Actual vs Holded

| Aspecto | Sistema Actual (Nosotros) | Con Holded |
|---------|---------------------------|------------|
| **Facturación** | Manual en código | ✅ Automática y legal |
| **Numeración facturas** | Timestamp (`FAC-XXX-12345`) | ✅ Secuencial legal (`2025/001`) |
| **Cálculo IVA** | Manual (21%) | ✅ Automático con tipos correctos |
| **Facturas rectificativas** | ❌ No implementado | ✅ Soportadas |
| **Contabilidad** | ❌ Manual externo | ✅ Automática integrada |
| **Libros oficiales** | ❌ No generados | ✅ Libro de facturas automático |
| **Modelos tributarios** | ❌ Manual | ✅ Generación automática (303, 390) |
| **PDF factura** | ❌ No generado | ✅ PDF profesional auto-generado |
| **Envío email facturas** | ⚠️ Nuestro sistema | ✅ Holded + Nuestro sistema |
| **CRM clientes** | ⚠️ Básico en Supabase | ✅ CRM profesional incluido |
| **Reporting financiero** | ❌ No existe | ✅ Dashboards y reportes |
| **Tiempo de implementación** | ✅ Ya hecho | ⏰ 3-5 días de integración |
| **Coste mensual** | €0 | €15-50/mes (según plan) |
| **Tiempo de mantenimiento** | ⏰ Alto (nuestro código) | ✅ Bajo (Holded lo gestiona) |

---

## 💡 Ventajas de Integrar Holded

### 1. ✅ Cumplimiento Fiscal Automático

**Sin Holded** (actual):
- Debemos implementar nosotros: numeración secuencial, cálculo IVA, retenciones IRPF
- Generar libros de facturas manualmente
- Calcular modelos tributarios con Excel
- Riesgo de errores en cumplimiento fiscal

**Con Holded**:
- ✅ Numeración secuencial legal automática
- ✅ Cálculo automático de IVA (21%, 10%, 4%, exento)
- ✅ Generación de libros oficiales
- ✅ Modelos 303, 347, 390 generados automáticamente
- ✅ Cumplimiento garantizado con normativa española

### 2. ✅ Facturación Profesional

**Sin Holded**:
```typescript
// Nosotros generamos:
const invoiceNumber = `FAC-PLAN-2025-123456` // No es numeración legal
const subtotal = total / 1.21  // Cálculo manual
// PDF: No generado
```

**Con Holded**:
```typescript
// Holded genera:
{
  invoice_number: "2025/001",  // Numeración secuencial legal
  series: "A",                  // Serie configurable
  pdf_url: "https://...",       // PDF profesional auto-generado
  legal_text: "...",            // Textos legales incluidos
  status: "paid",
  issued_at: "2025-10-22"
}
```

### 3. ✅ Integración Nativa con Stripe

Holded tiene **integración oficial** con Stripe:
- Sincronización automática de pagos
- Facturas generadas automáticamente cuando Stripe cobra
- Conciliación bancaria automática
- Webhooks bidireccionales

### 4. ✅ CRM Profesional Incluido

**Sin Holded**:
- Clientes almacenados en tabla `entities`
- Sin historial de interacciones
- Sin segmentación avanzada

**Con Holded**:
- ✅ CRM completo con historial de interacciones
- ✅ Segmentación de clientes (activos, churned, etc.)
- ✅ Funnels de ventas
- ✅ Tareas y recordatorios
- ✅ Analytics de clientes

### 5. ✅ Contabilidad Automatizada

**Sin Holded**:
- Descargar facturas manualmente
- Pasar datos a Excel o asesor
- Conciliación bancaria manual

**Con Holded**:
- ✅ Asientos contables automáticos
- ✅ Conciliación bancaria automática
- ✅ Balance de situación y cuenta de resultados en tiempo real
- ✅ Exportación para asesor (SILICIE, A3, Sage)

---

## 🔄 Flujo Completo: Stripe → Holded → Custodia360

### Flujo Propuesto de Integración

```
USUARIO CONTRATA PLAN 250 + KIT
        ↓
[1] Stripe Checkout procesa pago (23,90€)
        ↓
[2] Stripe envía webhook → Custodia360
        ↓
[3] Custodia360 webhook crea entidad en Supabase
        ↓
[4] Custodia360 llama API de Holded
    └─> POST /api/documents (crear factura)
        ↓
[5] Holded genera:
    ├─> Factura 2025/001
    ├─> PDF profesional
    ├─> Asiento contable
    └─> Actualiza CRM
        ↓
[6] Holded webhook → Custodia360
    └─> Guardamos holded_invoice_id en Supabase
        ↓
[7] Custodia360 envía email con PDF de Holded
        ↓
[8] Usuario recibe factura legal española
```

### Diagrama de Arquitectura

```
┌──────────────────┐
│   USUARIO WEB    │
└────────┬─────────┘
         │ Selecciona Plan + Extras
         ↓
┌──────────────────┐
│  CUSTODIA360 UI  │
└────────┬─────────┘
         │ POST /api/planes/checkout
         ↓
┌──────────────────┐
│  STRIPE CHECKOUT │ ← Procesa pago
└────────┬─────────┘
         │ checkout.session.completed
         ↓
┌──────────────────────────────────────────┐
│  CUSTODIA360 WEBHOOK                     │
│  /api/stripe/webhook                     │
│                                          │
│  1. Crea entidad en Supabase            │
│  2. Crea delegado                       │
│  3. Llama API Holded → Crear factura    │ ──────┐
│  4. Guarda holded_invoice_id            │       │
│  5. Envía emails con PDF de Holded      │       │
└──────────────────────────────────────────┘       │
                                                   ↓
                                           ┌───────────────┐
                                           │    HOLDED     │
                                           │               │
                                           │ • Factura     │
                                           │ • PDF         │
                                           │ • Contabilidad│
                                           │ • CRM         │
                                           └───────────────┘
```

---

## 💻 Implementación Técnica

### 1. Configuración Inicial de Holded

**Pasos**:
1. Crear cuenta en Holded (https://www.holded.com)
2. Configurar datos fiscales de Custodia360
3. Generar API Key desde Settings → Developers
4. Configurar serie de facturación (ej: Serie A)
5. Configurar productos en Holded:
   - Plan 100
   - Plan 250
   - Plan 500
   - Plan 500+
   - Kit de Comunicación
   - Delegado Suplente

### 2. Variables de Entorno

Añadir a `.env.local` y `netlify.toml`:

```bash
# Holded API
HOLDED_API_KEY=your_holded_api_key_here
HOLDED_API_URL=https://api.holded.com/api

# Holded Product IDs (obtener tras crear productos)
HOLDED_PRODUCT_PLAN_100=product_holded_id_100
HOLDED_PRODUCT_PLAN_250=product_holded_id_250
HOLDED_PRODUCT_PLAN_500=product_holded_id_500
HOLDED_PRODUCT_PLAN_500_PLUS=product_holded_id_500plus
HOLDED_PRODUCT_KIT=product_holded_id_kit
HOLDED_PRODUCT_SUPLENTE=product_holded_id_suplente
```

### 3. Cliente Holded API

```typescript:src/lib/holded-client.ts
// Cliente para la API de Holded
import { createClient } from '@supabase/supabase-js'

const HOLDED_API_URL = 'https://api.holded.com/api'
const HOLDED_API_KEY = process.env.HOLDED_API_KEY!

export interface HoldedContact {
  name: string
  email: string
  code?: string // CIF
  tradename?: string
  address?: string
  phone?: string
}

export interface HoldedInvoiceItem {
  name: string
  units: number
  subtotal: number
  discount: number
  tax: number // % IVA (21 = 21%)
}

export interface HoldedInvoice {
  contactId: string
  contactName: string
  contactCode?: string
  date: string // YYYY-MM-DD
  items: HoldedInvoiceItem[]
  customFields?: Record<string, string>
  desc?: string
  notes?: string
}

export class HoldedClient {
  private headers = {
    'Content-Type': 'application/json',
    'key': HOLDED_API_KEY,
  }

  // 1. Crear o actualizar contacto (cliente)
  async upsertContact(contact: HoldedContact): Promise<string> {
    // Primero buscar si existe
    const searchResponse = await fetch(
      `${HOLDED_API_URL}/invoicing/v1/contacts?email=${contact.email}`,
      { headers: this.headers }
    )

    const existingContacts = await searchResponse.json()

    if (existingContacts.length > 0) {
      // Actualizar existente
      const contactId = existingContacts[0].id
      await fetch(`${HOLDED_API_URL}/invoicing/v1/contacts/${contactId}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(contact),
      })
      return contactId
    } else {
      // Crear nuevo
      const response = await fetch(`${HOLDED_API_URL}/invoicing/v1/contacts`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(contact),
      })
      const newContact = await response.json()
      return newContact.id
    }
  }

  // 2. Crear factura
  async createInvoice(invoice: HoldedInvoice): Promise<{
    id: string
    docNumber: string
    pdfUrl: string
  }> {
    const response = await fetch(`${HOLDED_API_URL}/invoicing/v1/documents/invoice`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        contactId: invoice.contactId,
        contactName: invoice.contactName,
        contactCode: invoice.contactCode,
        date: Math.floor(new Date(invoice.date).getTime() / 1000), // Unix timestamp
        items: invoice.items,
        customFields: invoice.customFields,
        desc: invoice.desc,
        notes: invoice.notes || 'Generada automáticamente por Custodia360',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Holded API error: ${error}`)
    }

    const result = await response.json()

    // Obtener PDF
    const pdfResponse = await fetch(
      `${HOLDED_API_URL}/invoicing/v1/documents/invoice/${result.id}/pdf`,
      { headers: this.headers }
    )
    const pdfBlob = await pdfResponse.blob()
    const pdfUrl = URL.createObjectURL(pdfBlob)

    return {
      id: result.id,
      docNumber: result.docNumber, // Ej: "2025/001"
      pdfUrl: pdfUrl,
    }
  }

  // 3. Obtener factura
  async getInvoice(invoiceId: string) {
    const response = await fetch(
      `${HOLDED_API_URL}/invoicing/v1/documents/invoice/${invoiceId}`,
      { headers: this.headers }
    )
    return response.json()
  }

  // 4. Obtener PDF de factura
  async getInvoicePDF(invoiceId: string): Promise<ArrayBuffer> {
    const response = await fetch(
      `${HOLDED_API_URL}/invoicing/v1/documents/invoice/${invoiceId}/pdf`,
      { headers: this.headers }
    )
    return response.arrayBuffer()
  }

  // 5. Listar facturas
  async listInvoices(params?: {
    page?: number
    contactId?: string
    dateFrom?: string
    dateTo?: string
  }) {
    const queryParams = new URLSearchParams(params as any)
    const response = await fetch(
      `${HOLDED_API_URL}/invoicing/v1/documents/invoice?${queryParams}`,
      { headers: this.headers }
    )
    return response.json()
  }
}

export const holdedClient = new HoldedClient()
```

### 4. Integración en Webhook de Stripe

Actualizar `/api/stripe/webhook/route.ts`:

```typescript
import { holdedClient } from '@/lib/holded-client'

async function handlePlanInicial(session: Stripe.Checkout.Session, supabase: any) {
  // ... código existente de creación de entidad ...

  const entityId = newEntity.id

  try {
    // 1. Crear contacto en Holded
    console.log('📇 [HOLDED] Creando contacto...')
    const holdedContactId = await holdedClient.upsertContact({
      name: metadata.entidad_nombre,
      email: metadata.contratante_email,
      code: metadata.entidad_cif,
      tradename: metadata.entidad_nombre,
      address: metadata.entidad_direccion,
      phone: metadata.entidad_telefono,
    })

    // 2. Preparar items de factura
    const invoiceItems = [
      {
        name: `${metadata.plan} - Primer Pago (50%)`,
        units: 1,
        subtotal: parseFloat(metadata.firstPaymentAmount) / 1.21, // Sin IVA
        discount: 0,
        tax: 21, // IVA 21%
      }
    ]

    if (metadata.includeKit === 'true') {
      invoiceItems.push({
        name: 'Kit de Comunicación LOPIVI',
        units: 1,
        subtotal: 40, // Sin IVA
        discount: 0,
        tax: 21,
      })
    }

    if (metadata.includeSuplente === 'true') {
      invoiceItems.push({
        name: 'Delegado Suplente - Servicio Anual',
        units: 1,
        subtotal: 20, // Sin IVA
        discount: 0,
        tax: 21,
      })
    }

    // 3. Crear factura en Holded
    console.log('📄 [HOLDED] Creando factura...')
    const holdedInvoice = await holdedClient.createInvoice({
      contactId: holdedContactId,
      contactName: metadata.entidad_nombre,
      contactCode: metadata.entidad_cif,
      date: new Date().toISOString().split('T')[0],
      items: invoiceItems,
      customFields: {
        plan: metadata.plan,
        stripe_session_id: session.id,
        custodia360_entity_id: entityId,
      },
      desc: `Contratación ${metadata.plan} - Sistema Custodia360 LOPIVI`,
      notes: `Pago procesado vía Stripe\nSegundo pago programado para ${metadata.secondPaymentDate}`,
    })

    console.log('✅ [HOLDED] Factura creada:', holdedInvoice.docNumber)

    // 4. Guardar referencia de Holded en Supabase
    await supabase
      .from('entities')
      .update({
        holded_contact_id: holdedContactId,
        holded_invoice_id: holdedInvoice.id,
        holded_invoice_number: holdedInvoice.docNumber,
        updated_at: new Date().toISOString(),
      })
      .eq('id', entityId)

    // 5. También guardar en invoices (mantenemos nuestra tabla)
    await saveInvoice(supabase, {
      entity_id: entityId,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent as string,
      amount: session.amount_total || 0,
      currency: session.currency || 'eur',
      status: 'paid',
      product_type: 'plan_inicial',
      invoice_type: 'first_payment',
      description: `${metadata.plan} - Primer Pago`,
      holded_invoice_id: holdedInvoice.id,
      holded_invoice_number: holdedInvoice.docNumber,
    })

    // 6. Enviar email con PDF de Holded
    const pdfBuffer = await holdedClient.getInvoicePDF(holdedInvoice.id)

    await emailTemplates.enviarFacturaConPDF(
      metadata.contratante_email,
      metadata.entidad_nombre,
      holdedInvoice.docNumber,
      pdfBuffer
    )

    console.log('✅ [HOLDED] Integración completada')

  } catch (error) {
    console.error('❌ [HOLDED] Error en integración:', error)
    // Continuar sin bloquear el proceso (Holded es secundario)
  }
}
```

### 5. Actualizar Schema de Supabase

Añadir columnas para Holded:

```sql
-- Añadir columnas de Holded a entities
ALTER TABLE entities
ADD COLUMN IF NOT EXISTS holded_contact_id TEXT,
ADD COLUMN IF NOT EXISTS holded_invoice_id TEXT,
ADD COLUMN IF NOT EXISTS holded_invoice_number TEXT;

-- Añadir columnas de Holded a invoices
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS holded_invoice_id TEXT,
ADD COLUMN IF NOT EXISTS holded_invoice_number TEXT,
ADD COLUMN IF NOT EXISTS holded_pdf_url TEXT;

-- Índices
CREATE INDEX IF NOT EXISTS idx_entities_holded_contact ON entities(holded_contact_id);
CREATE INDEX IF NOT EXISTS idx_invoices_holded_invoice ON invoices(holded_invoice_id);
```

---

## 💰 Análisis de Costes

### Precios de Holded (2025)

| Plan | Precio/mes | Características | Recomendación |
|------|-----------|-----------------|---------------|
| **Starter** | €15/mes | 1 usuario, facturación básica | ⚠️ Limitado |
| **Professional** | €35/mes | 3 usuarios, API, integraciones | ✅ **ÓPTIMO** |
| **Advanced** | €75/mes | Usuarios ilimitados, multi-empresa | ⚠️ Excesivo (por ahora) |

**Recomendación inicial**: **Professional (€35/mes)**

### ROI: ¿Vale la pena?

**Costes sin Holded**:
- Tiempo desarrollo facturación legal: ~20 horas × €50/h = **€1,000**
- Tiempo mantenimiento mensual: ~3 horas × €50/h = **€150/mes**
- Asesor contable (solo facturas): ~€100/mes
- **Total primer año**: €1,000 + (€150 × 12) + (€100 × 12) = **€4,000**

**Costes con Holded**:
- Plan Professional: €35 × 12 = **€420/año**
- Tiempo integración inicial: ~5 horas × €50/h = **€250**
- Mantenimiento mensual: ~0.5 horas × €50/h = **€25/mes** = €300/año
- **Total primer año**: €250 + €420 + €300 = **€970**

**Ahorro anual**: €4,000 - €970 = **€3,030** ✅

---

## ⚖️ Ventajas vs Desventajas

### ✅ Ventajas

1. **Cumplimiento fiscal garantizado** - Numeración legal, IVA correcto, libros oficiales
2. **Ahorro de tiempo** - 90% menos tiempo en facturación y contabilidad
3. **Facturación profesional** - PDFs profesionales, textos legales automáticos
4. **CRM incluido** - Mejor gestión de clientes
5. **Escalabilidad** - Soporta crecimiento sin cambios de sistema
6. **Integraciones** - +200 apps conectadas
7. **Soporte español** - Atención al cliente en castellano
8. **ROI positivo** - Ahorro de €3,000/año vs desarrollar interno

### ⚠️ Desventajas

1. **Coste mensual** - €35/mes (vs €0 actual)
2. **Dependencia externa** - Depende de disponibilidad de Holded
3. **Tiempo de integración** - 3-5 días de desarrollo inicial
4. **Curva de aprendizaje** - Equipo debe familiarizarse con Holded
5. **Datos en 3er servicio** - Facturas almacenadas en Holded (aunque backup en Supabase)

---

## 🎯 Recomendación Final

### ✅ SÍ, integrar Holded es MUY recomendable

**Razones principales**:

1. **Cumplimiento fiscal es crítico** - No podemos arriesgarnos con facturación ilegal
2. **Ahorro de tiempo significativo** - 90% menos tiempo en facturación
3. **ROI muy positivo** - Ahorro de €3,030/año
4. **Profesionaliza el negocio** - Facturas legales y CRM profesional
5. **Escalable** - Soporta crecimiento de Custodia360

### 📅 Plan de Implementación Propuesto

**FASE 1: Setup y Configuración (Día 1-2)**
- Crear cuenta Holded Professional
- Configurar datos fiscales Custodia360
- Crear productos (planes + extras)
- Generar API key

**FASE 2: Integración Backend (Día 3-4)**
- Implementar `holded-client.ts`
- Actualizar webhook de Stripe
- Actualizar schema de Supabase
- Testing con Stripe test mode

**FASE 3: Testing y Validación (Día 5)**
- Pruebas de extremo a extremo
- Verificar facturas generadas
- Validar PDFs y emails
- Confirmar contabilidad correcta

**FASE 4: Producción (Día 6)**
- Configurar webhooks de producción
- Primera factura real
- Monitoreo de primeros días

**Tiempo total estimado**: 5-6 días de desarrollo

---

## 🔄 Alternativa: Implementación Gradual

Si prefieres empezar sin coste:

**Opción 1: Solo Stripe (actual)**
- Pros: €0/mes, control total
- Contras: Facturación no legal, sin contabilidad

**Opción 2: Stripe + Holded (RECOMENDADO)**
- Pros: Legal, profesional, ahorro tiempo
- Contras: €35/mes, integración necesaria

**Opción 3: Híbrido**
- Fase 1: Usar Holded solo para facturas (usar API)
- Fase 2: Migrar contabilidad a Holded
- Fase 3: Usar CRM de Holded

---

## 📞 Próximos Pasos

Si decides integrar Holded:

1. ✅ Crear cuenta en https://www.holded.com (prueba gratuita 14 días)
2. ✅ Confirmar que quieres proceder con la integración
3. ✅ Yo implemento toda la integración (5-6 días)
4. ✅ Testing conjunto
5. ✅ Activar en producción

**¿Quieres que implemente la integración con Holded?**

---

**Documento creado**: 22 de octubre de 2025
**Autor**: Sistema Custodia360
**Versión**: 1.0
