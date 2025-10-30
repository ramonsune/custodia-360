/**
 * AUDIT LOGGER - Sistema de Auditoría E2E Onboarding
 *
 * Registra eventos en la tabla `audit_events` de Supabase
 * para crear timeline de cada proceso de onboarding
 */

import { createClient } from '@supabase/supabase-js'

// Cliente Supabase con service role (server-side only)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

let supabaseAdmin: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseServiceKey && typeof window === 'undefined') {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export type AuditLevel = 'INFO' | 'WARN' | 'ERROR'

export interface AuditEventData {
  processId: string
  eventType: string
  level?: AuditLevel
  payload?: Record<string, any>
}

export interface AuditEvent {
  id: string
  process_id: string
  event_type: string
  level: AuditLevel
  payload: Record<string, any>
  created_at: string
}

/**
 * Registra un evento de auditoría
 */
export async function logAuditEvent({
  processId,
  eventType,
  level = 'INFO',
  payload = {}
}: AuditEventData): Promise<AuditEvent | null> {
  if (!supabaseAdmin) {
    console.error('[AUDIT] Supabase Admin client not initialized')
    return null
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('audit_events')
      .insert({
        process_id: processId,
        event_type: eventType,
        level,
        payload
      })
      .select()
      .single()

    if (error) {
      console.error('[AUDIT] Error inserting event:', error)
      return null
    }

    console.log(`[AUDIT] ✅ Event logged: ${eventType} (${level})`, { processId, payload })
    return data as AuditEvent
  } catch (error) {
    console.error('[AUDIT] Exception:', error)
    return null
  }
}

/**
 * Obtiene todos los eventos de un proceso (timeline)
 */
export async function getProcessTimeline(processId: string): Promise<AuditEvent[]> {
  if (!supabaseAdmin) {
    console.error('[AUDIT] Supabase Admin client not initialized')
    return []
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('audit_events')
      .select('*')
      .eq('process_id', processId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[AUDIT] Error fetching timeline:', error)
      return []
    }

    return (data as AuditEvent[]) || []
  } catch (error) {
    console.error('[AUDIT] Exception:', error)
    return []
  }
}

/**
 * Obtiene el último evento de un proceso
 */
export async function getLastEvent(processId: string): Promise<AuditEvent | null> {
  if (!supabaseAdmin) {
    return null
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('audit_events')
      .select('*')
      .eq('process_id', processId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) return null
    return data as AuditEvent
  } catch {
    return null
  }
}

/**
 * Obtiene eventos recientes (últimas 24h)
 */
export async function getRecentEvents(limit: number = 100): Promise<AuditEvent[]> {
  if (!supabaseAdmin) return []

  try {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { data, error } = await supabaseAdmin
      .from('audit_events')
      .select('*')
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) return []
    return (data as AuditEvent[]) || []
  } catch {
    return []
  }
}

/**
 * Helper: Log evento de checkout creado
 */
export async function logCheckoutCreated(processId: string, sessionId: string, email: string) {
  return logAuditEvent({
    processId,
    eventType: 'checkout.created',
    level: 'INFO',
    payload: { sessionId, email }
  })
}

/**
 * Helper: Log evento de webhook recibido
 */
export async function logWebhookReceived(processId: string, eventType: string, stripeEventId: string) {
  return logAuditEvent({
    processId,
    eventType: 'webhook.received',
    level: 'INFO',
    payload: { stripeEventType: eventType, stripeEventId }
  })
}

/**
 * Helper: Log entidad creada
 */
export async function logEntityCreated(processId: string, entityId: string, entityName: string) {
  return logAuditEvent({
    processId,
    eventType: 'entity.created',
    level: 'INFO',
    payload: { entityId, entityName }
  })
}

/**
 * Helper: Log usuario creado
 */
export async function logUserCreated(processId: string, userId: string, email: string) {
  return logAuditEvent({
    processId,
    eventType: 'user.created',
    level: 'INFO',
    payload: { userId, email }
  })
}

/**
 * Helper: Log rol asignado
 */
export async function logRoleGranted(processId: string, userId: string, role: string) {
  return logAuditEvent({
    processId,
    eventType: 'role.granted',
    level: 'INFO',
    payload: { userId, role }
  })
}

/**
 * Helper: Log emails enviados
 */
export async function logEmailsSent(processId: string, recipients: string[]) {
  return logAuditEvent({
    processId,
    eventType: 'emails.sent',
    level: 'INFO',
    payload: { recipients, count: recipients.length }
  })
}

/**
 * Helper: Log sincronización Holded OK
 */
export async function logHoldedSyncOk(processId: string, contactId: string, invoiceId: string) {
  return logAuditEvent({
    processId,
    eventType: 'holded.sync.ok',
    level: 'INFO',
    payload: { contactId, invoiceId }
  })
}

/**
 * Helper: Log error
 */
export async function logError(processId: string, errorType: string, errorMessage: string, details?: any) {
  return logAuditEvent({
    processId,
    eventType: errorType,
    level: 'ERROR',
    payload: { error: errorMessage, details }
  })
}
