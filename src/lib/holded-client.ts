/**
 * HOLDED CLIENT - Integración con Holded API
 *
 * Funciones para crear contactos/empresas y facturas en Holded
 */

const HOLDED_API_KEY = process.env.HOLDED_API_KEY
const HOLDED_BASE_URL = process.env.HOLDED_API_URL || 'https://api.holded.com/api'

export interface HoldedContact {
  id: string
  name: string
  email: string
  vatNumber?: string
  phone?: string
}

export interface HoldedInvoice {
  id: string
  invoiceNumber: string
  contactId: string
  total: number
  reference?: string
}

/**
 * Verifica si Holded está configurado
 */
export function isHoldedConfigured(): boolean {
  return !!HOLDED_API_KEY && !!HOLDED_BASE_URL
}

/**
 * Crea o actualiza un contacto/empresa en Holded
 */
export async function createOrUpdateContact(params: {
  name: string
  email: string
  vatNumber?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    postalCode?: string
    province?: string
    country?: string
  }
}): Promise<HoldedContact | null> {
  if (!isHoldedConfigured()) {
    console.warn('[HOLDED] API key not configured, skipping')
    return null
  }

  try {
    const response = await fetch(`${HOLDED_BASE_URL}/invoicing/v1/contacts`, {
      method: 'POST',
      headers: {
        'Key': HOLDED_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        code: params.vatNumber || '',
        phone: params.phone || '',
        billAddress: params.address ? {
          address: params.address.street || '',
          city: params.address.city || '',
          postalCode: params.address.postalCode || '',
          province: params.address.province || '',
          country: params.address.country || 'ES'
        } : undefined,
        type: 'client' // Cliente
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[HOLDED] Error creating contact:', response.status, errorText)
      return null
    }

    const data = await response.json()
    console.log('[HOLDED] ✅ Contact created:', data.id)

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      vatNumber: data.code,
      phone: data.phone
    }

  } catch (error: any) {
    console.error('[HOLDED] Exception creating contact:', error.message)
    return null
  }
}

/**
 * Crea una factura en Holded
 */
export async function createInvoice(params: {
  contactId: string
  amount: number // en euros (1.00)
  description: string
  reference?: string
  date?: string // ISO date
}): Promise<HoldedInvoice | null> {
  if (!isHoldedConfigured()) {
    console.warn('[HOLDED] API key not configured, skipping')
    return null
  }

  try {
    // Preparar línea de factura
    const items = [
      {
        name: params.description,
        units: 1,
        price: params.amount,
        tax: 21, // IVA 21% (España)
        desc: params.reference ? `Ref: ${params.reference}` : ''
      }
    ]

    const response = await fetch(`${HOLDED_BASE_URL}/invoicing/v1/documents/invoice`, {
      method: 'POST',
      headers: {
        'Key': HOLDED_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contactId: params.contactId,
        date: params.date ? Math.floor(new Date(params.date).getTime() / 1000) : Math.floor(Date.now() / 1000),
        items,
        notes: params.reference || '',
        // Enviar automáticamente la factura por email
        sendMail: true
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[HOLDED] Error creating invoice:', response.status, errorText)
      return null
    }

    const data = await response.json()
    console.log('[HOLDED] ✅ Invoice created:', data.id)

    return {
      id: data.id,
      invoiceNumber: data.docNumber || data.id,
      contactId: params.contactId,
      total: params.amount * 1.21, // + IVA
      reference: params.reference
    }

  } catch (error: any) {
    console.error('[HOLDED] Exception creating invoice:', error.message)
    return null
  }
}

/**
 * Sincroniza un onboarding completo con Holded
 * (Crea contacto + factura)
 */
export async function syncOnboardingToHolded(params: {
  entityName: string
  email: string
  cif?: string
  phone?: string
  address?: Record<string, any>
  stripeChargeId?: string
  processId: string
}): Promise<{ contactId: string | null; invoiceId: string | null }> {
  if (!isHoldedConfigured()) {
    return { contactId: null, invoiceId: null }
  }

  try {
    // 1. Crear contacto
    const contact = await createOrUpdateContact({
      name: params.entityName,
      email: params.email,
      vatNumber: params.cif,
      phone: params.phone,
      address: params.address
    })

    if (!contact) {
      console.error('[HOLDED] Failed to create contact')
      return { contactId: null, invoiceId: null }
    }

    // 2. Crear factura
    const invoice = await createInvoice({
      contactId: contact.id,
      amount: 1.00, // 1 EUR
      description: 'Alta en Custodia360 - Plataforma LOPIVI',
      reference: params.stripeChargeId || params.processId,
      date: new Date().toISOString()
    })

    if (!invoice) {
      console.error('[HOLDED] Failed to create invoice')
      return { contactId: contact.id, invoiceId: null }
    }

    console.log('[HOLDED] ✅ Sync completed:', { contactId: contact.id, invoiceId: invoice.id })
    return {
      contactId: contact.id,
      invoiceId: invoice.id
    }

  } catch (error: any) {
    console.error('[HOLDED] Sync failed:', error.message)
    return { contactId: null, invoiceId: null }
  }
}
