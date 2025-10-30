import { supabase, logAuditAction, generateLegalHash, getClientInfo } from './supabase'

// Interfaz para datos de sesión del usuario
interface UserSession {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
}

// Obtener datos de sesión del usuario actual
function getCurrentUser(): UserSession | null {
  if (typeof window === 'undefined') return null

  try {
    const session = localStorage.getItem('userSession')
    return session ? JSON.parse(session) : null
  } catch {
    return null
  }
}

// Función para registrar envío de documentación
export async function logDocumentSent(
  documentNames: string[],
  recipients: string[],
  method: 'email' | 'link' | 'download',
  message?: string,
  additionalData?: any
): Promise<boolean> {
  const user = getCurrentUser()
  if (!user) return false

  try {
    const clientInfo = getClientInfo()
    const timestamp = new Date().toISOString()

    // Registrar en audit_logs
    const auditSuccess = await logAuditAction(
      user.id,
      user.nombre,
      'document_sent',
      'documentation',
      JSON.stringify({ documents: documentNames, recipients }),
      {
        document_names: documentNames,
        recipients,
        method,
        message,
        entity: user.entidad,
        total_documents: documentNames.length,
        total_recipients: recipients.length,
        ...additionalData
      }
    )

    // Registrar en document_communications
    const commData = {
      user_id: user.id,
      user_name: user.nombre,
      document_names: documentNames,
      recipients,
      message: message || '',
      method,
      timestamp,
      legal_hash: generateLegalHash({
        user_id: user.id,
        documents: documentNames,
        recipients,
        method,
        timestamp
      }),
      metadata: {
        entity: user.entidad,
        ...clientInfo,
        ...additionalData
      }
    }

    const { error: commError } = await supabase
      .from('document_communications')
      .insert(commData)

    if (commError) {
      console.error('Error registrando comunicación de documentos:', commError)
      return false
    }

    return auditSuccess
  } catch (error) {
    console.error('Error en logDocumentSent:', error)
    return false
  }
}

// Función para registrar nuevo miembro
export async function logMemberAdded(
  memberName: string,
  memberEmail: string,
  memberRole: string,
  incorporationDate: string,
  documentationSent: string[],
  additionalData?: any
): Promise<boolean> {
  const user = getCurrentUser()
  if (!user) return false

  try {
    const timestamp = new Date().toISOString()

    // Registrar en audit_logs
    const auditSuccess = await logAuditAction(
      user.id,
      user.nombre,
      'member_added',
      'member',
      memberEmail, // usar email como ID único
      {
        member_name: memberName,
        member_email: memberEmail,
        member_role: memberRole,
        incorporation_date: incorporationDate,
        documentation_sent: documentationSent,
        entity: user.entidad,
        ...additionalData
      }
    )

    // Registrar en member_registrations
    const memberData = {
      user_id: user.id,
      user_name: user.nombre,
      member_name: memberName,
      member_email: memberEmail,
      member_role: memberRole,
      incorporation_date: incorporationDate,
      documentation_sent: documentationSent,
      status: 'registrado',
      timestamp,
      legal_hash: generateLegalHash({
        user_id: user.id,
        member_name: memberName,
        member_email: memberEmail,
        timestamp
      }),
      ...additionalData
    }

    const { error: memberError } = await supabase
      .from('member_registrations')
      .insert(memberData)

    if (memberError) {
      console.error('Error registrando nuevo miembro:', memberError)
      return false
    }

    return auditSuccess
  } catch (error) {
    console.error('Error en logMemberAdded:', error)
    return false
  }
}

// Función para registrar caso reportado
export async function logCaseReported(
  caseId: string,
  caseType: string,
  caseTitle: string,
  personsInvolved: any,
  priority: 'baja' | 'media' | 'alta' | 'critica',
  description: string,
  immediateActions?: string,
  additionalData?: any
): Promise<boolean> {
  const user = getCurrentUser()
  if (!user) return false

  try {
    const timestamp = new Date().toISOString()

    // Registrar en audit_logs
    const auditSuccess = await logAuditAction(
      user.id,
      user.nombre,
      'case_reported',
      'case',
      caseId,
      {
        case_type: caseType,
        case_title: caseTitle,
        persons_involved: personsInvolved,
        priority,
        description,
        immediate_actions: immediateActions,
        entity: user.entidad,
        urgency_level: priority === 'critica' ? 'URGENTE' : 'NORMAL',
        ...additionalData
      }
    )

    // Registrar en case_reports
    const caseData = {
      case_id: caseId,
      user_id: user.id,
      user_name: user.nombre,
      case_type: caseType,
      case_title: caseTitle,
      persons_involved: personsInvolved,
      priority,
      description,
      immediate_actions: immediateActions || '',
      status: 'pendiente_revision',
      incident_date: additionalData?.fechaIncidente || null,
      witnesses: additionalData?.testigos || '',
      timestamp,
      legal_hash: generateLegalHash({
        case_id: caseId,
        user_id: user.id,
        case_type: caseType,
        priority,
        timestamp
      })
    }

    const { error: caseError } = await supabase
      .from('case_reports')
      .insert(caseData)

    if (caseError) {
      console.error('Error registrando caso:', caseError)
      return false
    }

    return auditSuccess
  } catch (error) {
    console.error('Error en logCaseReported:', error)
    return false
  }
}

// Función para registrar acciones de certificados
export async function logCertificateAction(
  action: string,
  personName: string,
  certificateType: string,
  additionalData?: any
): Promise<boolean> {
  const user = getCurrentUser()
  if (!user) return false

  try {
    return await logAuditAction(
      user.id,
      user.nombre,
      `certificate_${action}`,
      'certificate',
      `${personName}_${certificateType}`,
      {
        person_name: personName,
        certificate_type: certificateType,
        action,
        entity: user.entidad,
        compliance_critical: certificateType.toLowerCase().includes('lopivi') ||
                            certificateType.toLowerCase().includes('antecedentes'),
        ...additionalData
      }
    )
  } catch (error) {
    console.error('Error en logCertificateAction:', error)
    return false
  }
}

// Función para registrar acciones generales del usuario
export async function logUserAction(
  action: string,
  target: string,
  result: 'success' | 'failure' | 'partial' | 'cancelled',
  metadata?: any
): Promise<boolean> {
  const user = getCurrentUser()
  if (!user) return false

  try {
    const clientInfo = getClientInfo()
    const timestamp = new Date().toISOString()

    // Registrar en user_actions
    const actionData = {
      user_id: user.id,
      user_name: user.nombre,
      action,
      target,
      result,
      metadata: {
        entity: user.entidad,
        ...clientInfo,
        ...metadata
      },
      timestamp,
      ip_address: clientInfo.ip_address,
      user_agent: clientInfo.user_agent,
      legal_hash: generateLegalHash({
        user_id: user.id,
        action,
        target,
        result,
        timestamp
      })
    }

    const { error } = await supabase
      .from('user_actions')
      .insert(actionData)

    if (error) {
      console.error('Error registrando acción de usuario:', error)
      return false
    }

    // También registrar en audit_logs
    return await logAuditAction(
      user.id,
      user.nombre,
      'user_action',
      'system',
      action,
      {
        action,
        target,
        result,
        ...metadata
      }
    )
  } catch (error) {
    console.error('Error en logUserAction:', error)
    return false
  }
}

// Función para exportar logs para inspecciones LOPIVI
export async function exportLogsForInspection(
  startDate: string,
  endDate: string,
  entityId?: string
): Promise<any> {
  try {
    const user = getCurrentUser()
    if (!user || user.tipo !== 'principal') {
      throw new Error('Solo los delegados principales pueden exportar logs de auditoría')
    }

    // Registrar la solicitud de exportación
    await logUserAction(
      'export_logs_requested',
      'audit_system',
      'success',
      {
        start_date: startDate,
        end_date: endDate,
        entity_id: entityId,
        requester: user.nombre,
        compliance_reason: 'Inspección LOPIVI'
      }
    )

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
      await logUserAction(
        'export_logs_failed',
        'audit_system',
        'failure',
        { error: error.message }
      )
      throw error
    }

    // Generar reporte de exportación
    const exportReport = {
      export_metadata: {
        requested_by: user.nombre,
        requested_at: new Date().toISOString(),
        entity: user.entidad,
        date_range: { start: startDate, end: endDate },
        entity_filter: entityId || 'all',
        lopivi_compliant: true,
        retention_period: '5 years'
      },
      logs,
      summary: {
        total_logs: logs.length,
        date_range_days: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)),
        unique_users: [...new Set(logs.map(log => log.user_id))].length,
        action_types: [...new Set(logs.map(log => log.action_type))],
        export_hash: generateLegalHash({
          logs: logs.length,
          start_date: startDate,
          end_date: endDate,
          requester: user.id
        })
      }
    }

    // Registrar exportación exitosa
    await logUserAction(
      'export_logs_completed',
      'audit_system',
      'success',
      {
        total_logs: logs.length,
        export_hash: exportReport.summary.export_hash
      }
    )

    return exportReport
  } catch (error) {
    console.error('Error exportando logs:', error)
    throw error
  }
}

// Función para verificar integridad de logs
export async function verifyAuditIntegrity(logIds?: string[]): Promise<any> {
  try {
    const user = getCurrentUser()
    if (!user) throw new Error('Usuario no autenticado')

    // Registrar verificación de integridad
    await logUserAction(
      'integrity_verification_started',
      'audit_system',
      'success',
      { log_count: logIds?.length || 'all' }
    )

    // Si no se especifican IDs, verificar logs recientes
    if (!logIds) {
      const { data: recentLogs } = await supabase
        .from('audit_logs')
        .select('id')
        .order('timestamp', { ascending: false })
        .limit(100)

      logIds = recentLogs?.map(log => log.id) || []
    }

    const results = []
    let verifiedCount = 0

    for (const logId of logIds) {
      try {
        const { data: verified } = await supabase
          .rpc('verify_audit_log_integrity', { p_log_id: logId })

        results.push({ id: logId, verified: verified || false })
        if (verified) verifiedCount++
      } catch (error) {
        results.push({ id: logId, verified: false, error: error.message })
      }
    }

    const report = {
      verification_timestamp: new Date().toISOString(),
      total_checked: logIds.length,
      verified_count: verifiedCount,
      failed_count: logIds.length - verifiedCount,
      integrity_percentage: logIds.length > 0 ? (verifiedCount / logIds.length) * 100 : 0,
      details: results,
      lopivi_compliant: verifiedCount === logIds.length
    }

    // Registrar resultado de verificación
    await logUserAction(
      'integrity_verification_completed',
      'audit_system',
      report.lopivi_compliant ? 'success' : 'partial',
      {
        integrity_percentage: report.integrity_percentage,
        total_checked: report.total_checked,
        failed_count: report.failed_count
      }
    )

    return report
  } catch (error) {
    console.error('Error verificando integridad:', error)
    await logUserAction(
      'integrity_verification_failed',
      'audit_system',
      'failure',
      { error: error.message }
    )
    throw error
  }
}

export default {
  logDocumentSent,
  logMemberAdded,
  logCaseReported,
  logCertificateAction,
  logUserAction,
  exportLogsForInspection,
  verifyAuditIntegrity
}
