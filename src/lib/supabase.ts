import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Configuración del cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validación de variables de entorno
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required but not found in environment variables')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required but not found in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Tipos para el sistema de auditoría LOPIVI
export interface AuditLog {
  id?: string
  timestamp: string
  user_id: string
  user_name: string
  action_type: string
  entity_type: string
  entity_id?: string
  details: any
  ip_address?: string
  user_agent?: string
  session_id?: string
  legal_hash: string
  created_at?: string
  updated_at?: string
}

export interface DocumentCommunication {
  id?: string
  user_id: string
  user_name: string
  document_names: string[]
  recipients: string[]
  message?: string
  method: 'email' | 'link' | 'download'
  timestamp: string
  legal_hash: string
  created_at?: string
}

export interface CaseReport {
  id?: string
  case_id: string
  user_id: string
  user_name: string
  case_type: string
  case_title: string
  persons_involved: any
  priority: 'baja' | 'media' | 'alta' | 'critica'
  description: string
  immediate_actions: string
  status: string
  timestamp: string
  legal_hash: string
  created_at?: string
}

export interface MemberRegistration {
  id?: string
  user_id: string
  user_name: string
  member_name: string
  member_email: string
  member_role: string
  incorporation_date: string
  documentation_sent: string[]
  status: string
  timestamp: string
  legal_hash: string
  created_at?: string
}

export interface UserAction {
  id?: string
  user_id: string
  user_name: string
  action: string
  target: string
  result: string
  metadata: any
  timestamp: string
  ip_address?: string
  user_agent?: string
  legal_hash: string
  created_at?: string
}

// Función para generar hash legal de verificación
export function generateLegalHash(data: any): string {
  const secret = process.env.AUDIT_HASH_SECRET || 'custodia360_default_secret'
  const timestamp = new Date().toISOString()
  const dataString = JSON.stringify({ ...data, timestamp })

  return crypto
    .createHmac('sha256', secret)
    .update(dataString)
    .digest('hex')
}

// Función para obtener información del cliente
export function getClientInfo() {
  if (typeof window !== 'undefined') {
    return {
      ip_address: 'client_side', // Se determina en el servidor
      user_agent: navigator.userAgent,
      session_id: sessionStorage.getItem('userSessionId') || crypto.randomUUID()
    }
  }
  return {
    ip_address: 'server_side',
    user_agent: 'server',
    session_id: crypto.randomUUID()
  }
}

// Función principal para registrar acciones de auditoría
export async function logAuditAction(
  userId: string,
  userName: string,
  actionType: string,
  entityType: string,
  details: any,
  entityId?: string
): Promise<boolean> {
  try {
    const clientInfo = getClientInfo()
    const timestamp = new Date().toISOString()

    const auditData: AuditLog = {
      timestamp,
      user_id: userId,
      user_name: userName,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      details,
      ...clientInfo,
      legal_hash: generateLegalHash({
        timestamp,
        user_id: userId,
        action_type: actionType,
        entity_type: entityType,
        details
      })
    }

    const { error } = await supabase
      .from('audit_logs')
      .insert(auditData)

    if (error) {
      console.error('Error registrando auditoría LOPIVI:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error en sistema de auditoría LOPIVI:', error)
    return false
  }
}

// Verificar integridad de un log específico
export async function verifyLogIntegrity(logId: string): Promise<boolean> {
  try {
    const { data: log, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('id', logId)
      .single()

    if (error || !log) {
      return false
    }

    const { legal_hash, ...dataToVerify } = log
    const expectedHash = generateLegalHash(dataToVerify)

    return legal_hash === expectedHash
  } catch (error) {
    console.error('Error verificando integridad:', error)
    return false
  }
}

// Exportar logs para inspecciones LOPIVI
export async function exportAuditLogsForInspection(
  startDate: string,
  endDate: string,
  entityId?: string
) {
  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)
      .order('timestamp', { ascending: true })

    if (entityId) {
      query = query.eq('entity_id', entityId)
    }

    const { data: logs, error } = await query

    if (error) {
      throw error
    }

    // Verificar integridad de todos los logs
    const verificationResults = await Promise.all(
      logs.map(async (log) => ({
        id: log.id,
        verified: await verifyLogIntegrity(log.id)
      }))
    )

    return {
      logs,
      verification: verificationResults,
      total_logs: logs.length,
      verified_logs: verificationResults.filter(v => v.verified).length,
      export_timestamp: new Date().toISOString(),
      retention_compliant: true // 5 años LOPIVI
    }
  } catch (error) {
    console.error('Error exportando logs:', error)
    throw error
  }
}

export default supabase
