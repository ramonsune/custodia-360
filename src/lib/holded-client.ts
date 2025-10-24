/**
 * HOLDED API CLIENT
 *
 * Cliente para interactuar con la API de Holded
 * Gestiona contactos (clientes) y facturas automáticas
 *
 * Documentación: https://developers.holded.com/reference
 */

const HOLDED_API_URL = 'https://api.holded.com/api'

export interface HoldedContact {
  name: string
  email: string
  code?: string // CIF/NIF
  tradename?: string
  address?: string
  city?: string
  postalCode?: string
  province?: string
  phone?: string
}

export interface HoldedInvoiceItem {
  name: string
  desc?: string
  units: number
  subtotal: number
  discount: number
  tax: number // % IVA (21 = 21%)
}

export interface HoldedInvoice {
  contactId: string
  contactName: string
  contactCode?: string
  date: number // Unix timestamp
  items: HoldedInvoiceItem[]
  customFields?: Record<string, string>
  desc?: string
  notes?: string
}

export interface HoldedInvoiceResponse {
  id: string
  docNumber: string // Ej: "2025/001"
  status: string
  total: number
  subtotal: number
  tax: number
}

export class HoldedClient {
  private apiKey: string
  private headers: Record<string, string>

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.HOLDED_API_KEY || ''

    if (!this.apiKey) {
      console.warn('⚠️ [HOLDED] API Key no configurada')
    }

    this.headers = {
      'Content-Type': 'application/json',
      'key': this.apiKey,
    }
  }

  /**
   * Buscar contacto por email
   */
  async findContactByEmail(email: string): Promise<any | null> {
    try {
      const response = await fetch(
        `${HOLDED_API_URL}/invoicing/v1/contacts?email=${encodeURIComponent(email)}`,
        {
          headers: this.headers,
          method: 'GET',
        }
      )

      if (!response.ok) {
        console.error(`❌ [HOLDED] Error buscando contacto: ${response.status}`)
        return null
      }

      const contacts = await response.json()
      return contacts && contacts.length > 0 ? contacts[0] : null
    } catch (error: any) {
      console.error('❌ [HOLDED] Error en findContactByEmail:', error.message)
      return null
    }
  }

  /**
   * Crear contacto (cliente)
   */
  async createContact(contact: HoldedContact): Promise<string | null> {
    try {
      console.log('📇 [HOLDED] Creando contacto:', contact.name)

      const response = await fetch(`${HOLDED_API_URL}/invoicing/v1/contacts`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(contact),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ [HOLDED] Error creando contacto (${response.status}):`, errorText)
        return null
      }

      const newContact = await response.json()
      console.log(`✅ [HOLDED] Contacto creado: ${newContact.id}`)
      return newContact.id
    } catch (error: any) {
      console.error('❌ [HOLDED] Error en createContact:', error.message)
      return null
    }
  }

  /**
   * Actualizar contacto existente
   */
  async updateContact(contactId: string, contact: Partial<HoldedContact>): Promise<boolean> {
    try {
      console.log('📝 [HOLDED] Actualizando contacto:', contactId)

      const response = await fetch(`${HOLDED_API_URL}/invoicing/v1/contacts/${contactId}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(contact),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ [HOLDED] Error actualizando contacto (${response.status}):`, errorText)
        return false
      }

      console.log(`✅ [HOLDED] Contacto actualizado: ${contactId}`)
      return true
    } catch (error: any) {
      console.error('❌ [HOLDED] Error en updateContact:', error.message)
      return false
    }
  }

  /**
   * Crear o actualizar contacto (upsert)
   */
  async upsertContact(contact: HoldedContact): Promise<string | null> {
    try {
      // Buscar si existe
      const existingContact = await this.findContactByEmail(contact.email)

      if (existingContact) {
        // Actualizar
        const updated = await this.updateContact(existingContact.id, contact)
        return updated ? existingContact.id : null
      } else {
        // Crear nuevo
        return await this.createContact(contact)
      }
    } catch (error: any) {
      console.error('❌ [HOLDED] Error en upsertContact:', error.message)
      return null
    }
  }

  /**
   * Crear factura
   */
  async createInvoice(invoice: HoldedInvoice): Promise<HoldedInvoiceResponse | null> {
    try {
      console.log('📄 [HOLDED] Creando factura para:', invoice.contactName)

      const response = await fetch(`${HOLDED_API_URL}/invoicing/v1/documents/invoice`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          ...invoice,
          notes: invoice.notes || 'Generada automáticamente por Custodia360',
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ [HOLDED] Error creando factura (${response.status}):`, errorText)
        return null
      }

      const result = await response.json()

      // La API de Holded al crear no devuelve los totales calculados,
      // hacemos un GET para obtener los datos completos
      const fullInvoice = await this.getInvoice(result.id)

      if (!fullInvoice) {
        console.warn('⚠️ [HOLDED] No se pudo obtener factura completa, usando datos parciales')
        return {
          id: result.id,
          docNumber: result.docNumber || `DRAFT-${result.id.slice(-6)}`,
          status: 'draft',
          total: 0,
          subtotal: 0,
          tax: 0,
        }
      }

      // Mapear status numérico a string
      const statusMap: Record<number, string> = {
        0: 'draft',
        1: 'sent',
        2: 'paid',
        3: 'cancelled',
      }

      const statusText = typeof fullInvoice.status === 'number'
        ? statusMap[fullInvoice.status] || 'draft'
        : fullInvoice.status || 'draft'

      const docNumber = fullInvoice.docNumber || `DRAFT-${fullInvoice.id.slice(-6)}`

      console.log(`✅ [HOLDED] Factura creada: ${docNumber} (ID: ${result.id}) - Estado: ${statusText}`)
      console.log(`   Subtotal: ${fullInvoice.subtotal}€, IVA: ${fullInvoice.tax}€, Total: ${fullInvoice.total}€`)

      return {
        id: fullInvoice.id,
        docNumber: docNumber,
        status: statusText,
        total: fullInvoice.total || 0,
        subtotal: fullInvoice.subtotal || 0,
        tax: fullInvoice.tax || 0,
      }
    } catch (error: any) {
      console.error('❌ [HOLDED] Error en createInvoice:', error.message)
      return null
    }
  }

  /**
   * Obtener factura por ID
   */
  async getInvoice(invoiceId: string): Promise<any | null> {
    try {
      const response = await fetch(
        `${HOLDED_API_URL}/invoicing/v1/documents/invoice/${invoiceId}`,
        { headers: this.headers }
      )

      if (!response.ok) {
        console.error(`❌ [HOLDED] Error obteniendo factura: ${response.status}`)
        return null
      }

      return await response.json()
    } catch (error: any) {
      console.error('❌ [HOLDED] Error en getInvoice:', error.message)
      return null
    }
  }

  /**
   * Obtener PDF de factura
   */
  async getInvoicePDF(invoiceId: string): Promise<ArrayBuffer | null> {
    try {
      const response = await fetch(
        `${HOLDED_API_URL}/invoicing/v1/documents/invoice/${invoiceId}/pdf`,
        { headers: this.headers }
      )

      if (!response.ok) {
        console.error(`❌ [HOLDED] Error obteniendo PDF: ${response.status}`)
        return null
      }

      return await response.arrayBuffer()
    } catch (error: any) {
      console.error('❌ [HOLDED] Error en getInvoicePDF:', error.message)
      return null
    }
  }

  /**
   * Listar facturas
   */
  async listInvoices(params?: {
    page?: number
    contactId?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams(params as any)
      const response = await fetch(
        `${HOLDED_API_URL}/invoicing/v1/documents/invoice?${queryParams}`,
        { headers: this.headers }
      )

      if (!response.ok) {
        console.error(`❌ [HOLDED] Error listando facturas: ${response.status}`)
        return []
      }

      return await response.json()
    } catch (error: any) {
      console.error('❌ [HOLDED] Error en listInvoices:', error.message)
      return []
    }
  }

  /**
   * Verificar que la API key es válida
   */
  async verifyConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${HOLDED_API_URL}/invoicing/v1/contacts?page=1`, {
        headers: this.headers,
      })

      return response.ok
    } catch (error: any) {
      console.error('❌ [HOLDED] Error verificando conexión:', error.message)
      return false
    }
  }
}

// Singleton instance
let holdedClientInstance: HoldedClient | null = null

export function getHoldedClient(): HoldedClient {
  if (!holdedClientInstance) {
    holdedClientInstance = new HoldedClient()
  }
  return holdedClientInstance
}

export const holdedClient = getHoldedClient()
