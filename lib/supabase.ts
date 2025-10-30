import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para auditoría LOPIVI
export interface AuditLog {
  id?: string
  timestamp?: string
  user_id?: string
  user_name: string
  action_type: string
  entity_type: string
  entity_id?: string
  details: any
  ip_address?: string
  user_agent?: string
  session_id?: string
  legal_hash?: string
}

export interface DocumentCommunication {
  id?: string
  user_name: string
  recipients: string[]
  recipient_count: number
  documents: string[]
  subject: string
  message?: string
  timestamp?: string
  ip_address?: string
  legal_hash?: string
}

export interface MemberRegistration {
  id?: string
  member_name: string
  member_email: string
  member_role: string
  incorporation_date: string
  assigned_documents: string[]
  registered_by: string
  timestamp?: string
  ip_address?: string
  legal_hash?: string
}

export interface CaseReport {
  id?: string
  case_id: string
  case_type: string
  title: string
  description: string
  person_action: string
  person_receives: string
  additional_people: string[]
  priority: string
  reported_by: string
  entity: string
  timestamp?: string
  ip_address?: string
  legal_hash?: string
}

// Función para generar hash legal de verificación
function generateLegalHash(data: any): string {
  const timestamp = new Date().toISOString()
  const dataString = JSON.stringify(data) + timestamp
  return btoa(dataString).slice(0, 32) // Hash simplificado para demo
}

// Función para obtener IP del usuario (simulada para demo)
async function getUserIP(): Promise<string> {
  // En producción, usar un servicio real de IP
  return '192.168.1.100' // IP simulada
}

// Función para obtener User Agent
function getUserAgent(): string {
  return typeof window !== 'undefined' ? window.navigator.userAgent : 'Server'
}

// Función principal de logging para auditoría LOPIVI
export async function logAuditAction(action: Omit<AuditLog, 'timestamp' | 'ip_address' | 'user_agent' | 'legal_hash'>): Promise<{ success: boolean; error?: string }> {
  try {
    const ip_address = await getUserIP()
    const user_agent = getUserAgent()
    const timestamp = new Date().toISOString()

    const auditData: AuditLog = {
      ...action,
      timestamp,
      ip_address,
      user_agent,
      session_id: `session_${Date.now()}`,
      legal_hash: generateLegalHash(action)
    }

    const { data, error } = await supabase
      .from('audit_logs')
      .insert([auditData])
      .select()

    if (error) {
      console.error('❌ Error al registrar auditoría:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ Acción registrada en auditoría LOPIVI:', data)
    return { success: true }
  } catch (error) {
    console.error('❌ Error crítico en auditoría:', error)
    return { success: false, error: 'Error crítico en sistema de auditoría' }
  }
}

// Función específica para registrar envío de documentación
export async function logDocumentSent(communication: Omit<DocumentCommunication, 'timestamp' | 'ip_address' | 'legal_hash'>): Promise<{ success: boolean; error?: string }> {
  try {
    const ip_address = await getUserIP()
    const timestamp = new Date().toISOString()

    const commData: DocumentCommunication = {
      ...communication,
      timestamp,
      ip_address,
      legal_hash: generateLegalHash(communication)
    }

    // Registrar en tabla específica de comunicaciones
    const { data: commResult, error: commError } = await supabase
      .from('document_communications')
      .insert([commData])
      .select()

    if (commError) {
      console.error('❌ Error al registrar comunicación:', commError)
      return { success: false, error: commError.message }
    }

    // También registrar en audit_logs principal
    await logAuditAction({
      user_name: communication.user_name,
      action_type: 'document_sent',
      entity_type: 'communication',
      entity_id: commResult[0]?.id,
      details: {
        recipients: communication.recipients,
        recipient_count: communication.recipient_count,
        documents: communication.documents,
        subject: communication.subject
      }
    })

    console.log('✅ Envío de documentación registrado:', commResult)
    return { success: true }
  } catch (error) {
    console.error('❌ Error al registrar envío:', error)
    return { success: false, error: 'Error al registrar envío de documentación' }
  }
}

// Función para registrar nuevo miembro
export async function logMemberAdded(member: Omit<MemberRegistration, 'timestamp' | 'ip_address' | 'legal_hash'>): Promise<{ success: boolean; error?: string }> {
  try {
    const ip_address = await getUserIP()
    const timestamp = new Date().toISOString()

    const memberData: MemberRegistration = {
      ...member,
      timestamp,
      ip_address,
      legal_hash: generateLegalHash(member)
    }

    // Registrar en tabla específica de miembros
    const { data: memberResult, error: memberError } = await supabase
      .from('member_registrations')
      .insert([memberData])
      .select()

    if (memberError) {
      console.error('❌ Error al registrar miembro:', memberError)
      return { success: false, error: memberError.message }
    }

    // También registrar en audit_logs principal
    await logAuditAction({
      user_name: member.registered_by,
      action_type: 'member_added',
      entity_type: 'member',
      entity_id: memberResult[0]?.id,
      details: {
        member_name: member.member_name,
        member_email: member.member_email,
        member_role: member.member_role,
        assigned_documents: member.assigned_documents
      }
    })

    console.log('✅ Nuevo miembro registrado en auditoría:', memberResult)
    return { success: true }
  } catch (error) {
    console.error('❌ Error al registrar miembro:', error)
    return { success: false, error: 'Error al registrar nuevo miembro' }
  }
}

// Función para registrar casos reportados
export async function logCaseReported(caseData: Omit<CaseReport, 'timestamp' | 'ip_address' | 'legal_hash'>): Promise<{ success: boolean; error?: string }> {
  try {
    const ip_address = await getUserIP()
    const timestamp = new Date().toISOString()

    const caseReport: CaseReport = {
      ...caseData,
      timestamp,
      ip_address,
      legal_hash: generateLegalHash(caseData)
    }

    // Registrar en tabla específica de casos
    const { data: caseResult, error: caseError } = await supabase
      .from('case_reports')
      .insert([caseReport])
      .select()

    if (caseError) {
      console.error('❌ Error al registrar caso:', caseError)
      return { success: false, error: caseError.message }
    }

    // También registrar en audit_logs principal
    await logAuditAction({
      user_name: caseData.reported_by,
      action_type: 'case_reported',
      entity_type: 'case',
      entity_id: caseResult[0]?.id,
      details: {
        case_id: caseData.case_id,
        case_type: caseData.case_type,
        title: caseData.title,
        priority: caseData.priority,
        person_action: caseData.person_action,
        person_receives: caseData.person_receives
      }
    })

    console.log('✅ Caso reportado registrado en auditoría:', caseResult)
    return { success: true }
  } catch (error) {
    console.error('❌ Error al registrar caso:', error)
    return { success: false, error: 'Error al registrar caso reportado' }
  }
}

// Función para exportar logs de auditoría para inspecciones
export async function exportAuditLogsForInspection(dateFrom?: string, dateTo?: string): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })

    if (dateFrom) {
      query = query.gte('timestamp', dateFrom)
    }

    if (dateTo) {
      query = query.lte('timestamp', dateTo)
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Error al exportar logs:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ Logs exportados para inspección:', data?.length, 'registros')
    return { success: true, data }
  } catch (error) {
    console.error('❌ Error crítico al exportar:', error)
    return { success: false, error: 'Error crítico al exportar logs' }
  }
}

// Función para verificar integridad de logs
export async function verifyLogIntegrity(logId: string): Promise<{ success: boolean; isValid?: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('id', logId)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Verificar hash (implementación simplificada)
    const originalData = { ...data }
    delete originalData.legal_hash
    delete originalData.timestamp
    const regeneratedHash = generateLegalHash(originalData)

    const isValid = regeneratedHash === data.legal_hash

    console.log(`✅ Verificación de integridad ${logId}:`, isValid ? 'VÁLIDO' : 'COMPROMETIDO')
    return { success: true, isValid }
  } catch (error) {
    console.error('❌ Error al verificar integridad:', error)
    return { success: false, error: 'Error al verificar integridad' }
  }
}

// Función para obtener actividad de un usuario específico
export async function getUserActivity(userName: string, limit: number = 50): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_name', userName)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      return { success: false, error: error.message }
    }

    console.log(`✅ Actividad de ${userName}:`, data?.length, 'acciones')
    return { success: true, data }
  } catch (error) {
    console.error('❌ Error al obtener actividad:', error)
    return { success: false, error: 'Error al obtener actividad de usuario' }
  }
}
