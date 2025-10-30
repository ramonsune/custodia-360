'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

interface AuditLog {
  id: string
  created_at: string
  scope: string
  status: 'ok' | 'warn' | 'fail'
  summary: string
  details: any
  markdown: string
}

export default function SystemStatusWidget() {
  const [auditLog, setAuditLog] = useState<AuditLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [runningAudit, setRunningAudit] = useState(false)

  useEffect(() => {
    loadLatestAudit()
  }, [])

  const loadLatestAudit = async () => {
    setLoading(true)
    try {
      // Obtener el último log de auditoría desde Supabase
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from('admin_health_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!error && data) {
        setAuditLog(data)
      } else {
        console.log('No hay registros de auditoría aún')
      }
    } catch (error) {
      console.error('Error loading audit log:', error)
    } finally {
      setLoading(false)
    }
  }

  const runAuditNow = async () => {
    setRunningAudit(true)
    try {
      const response = await fetch('/api/ops/audit-live')
      if (response.ok) {
        // Esperar un momento y recargar
        await new Promise(resolve => setTimeout(resolve, 1000))
        await loadLatestAudit()
      }
    } catch (error) {
      console.error('Error running audit:', error)
    } finally {
      setRunningAudit(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  // Si no hay auditoría, mostrar CTA
  if (!auditLog) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Estado del Sistema</h3>
              <p className="text-sm text-gray-500">No hay datos de auditoría disponibles</p>
            </div>
          </div>
          <button
            onClick={runAuditNow}
            disabled={runningAudit}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {runningAudit ? 'Ejecutando...' : 'Ejecutar auditoría ahora'}
          </button>
        </div>
      </div>
    )
  }

  // Parsear datos de la auditoría
  const details = auditLog.details
  const status = auditLog.status

  const envVarsOk = details.environment_variables?.configured || 0
  const envVarsTotal = details.environment_variables?.total || 7
  const tablesOk = details.supabase?.tables?.found || 0
  const tablesTotal = details.supabase?.tables?.total || 10
  const templatesOk = details.supabase?.templates?.found || 0
  const templatesTotal = details.supabase?.templates?.total || 13
  const workersOk = details.workers?.found || 0
  const workersTotal = details.workers?.total || 3

  const jobsQueued = details.supabase?.message_jobs?.queued || 0
  const jobsFailed = details.supabase?.message_jobs?.failed || 0

  const resendStatus = details.resend?.status || 'unknown'

  const auditDate = new Date(auditLog.created_at)
  const madridTime = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(auditDate)

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            status === 'ok' ? 'bg-green-100' : status === 'warn' ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              status === 'ok' ? 'bg-green-600' : status === 'warn' ? 'bg-yellow-600' : 'bg-red-600'
            }`}></div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Estado del Sistema</h3>
            <p className="text-sm text-gray-500">
              Última auditoría: {madridTime}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runAuditNow}
            disabled={runningAudit}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Actualizar
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            {expanded ? 'Ocultar' : 'Ver detalles'}
          </button>
        </div>
      </div>

      {/* Banner de estado */}
      <div className={`rounded-lg p-3 mb-4 ${
        status === 'ok' ? 'bg-green-50 border border-green-200' :
        status === 'warn' ? 'bg-yellow-50 border border-yellow-200' :
        'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${
            status === 'ok' ? 'text-green-800' :
            status === 'warn' ? 'text-yellow-800' :
            'text-red-800'
          }`}>
            {auditLog.summary}
          </span>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Variables Entorno</div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${envVarsOk === envVarsTotal ? 'bg-green-600' : 'bg-yellow-600'}`}></div>
            <span className="text-sm font-medium text-gray-900">
              {envVarsOk}/{envVarsTotal}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Tablas Supabase</div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${tablesOk === tablesTotal ? 'bg-green-600' : 'bg-red-600'}`}></div>
            <span className="text-sm font-medium text-gray-900">
              {tablesOk}/{tablesTotal}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Templates</div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${templatesOk >= templatesTotal ? 'bg-green-600' : 'bg-yellow-600'}`}></div>
            <span className="text-sm font-medium text-gray-900">
              {templatesOk}/{templatesTotal}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Resend</div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${resendStatus === 'verified' ? 'bg-green-600' : 'bg-yellow-600'}`}></div>
            <span className="text-sm font-medium text-gray-900">
              {resendStatus}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Workers</div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${workersOk === workersTotal ? 'bg-green-600' : 'bg-yellow-600'}`}></div>
            <span className="text-sm font-medium text-gray-900">
              {workersOk}/{workersTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Cola de emails */}
      {(jobsQueued > 0 || jobsFailed > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="text-xs text-blue-800 mb-1">Cola de Emails</div>
          <div className="flex gap-4 text-sm">
            <span className="text-blue-900">Pendientes: <strong>{jobsQueued}</strong></span>
            {jobsFailed > 0 && (
              <span className="text-red-600">Fallidos: <strong>{jobsFailed}</strong></span>
            )}
          </div>
        </div>
      )}

      {/* Detalles expandidos */}
      {expanded && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          {/* Advertencias */}
          {details.warnings && details.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">Advertencias</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                {details.warnings.map((warning: string, i: number) => (
                  <li key={i}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Fallos críticos */}
          {details.failures && details.failures.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-red-900 mb-2">Fallos Críticos</h4>
              <ul className="text-sm text-red-800 space-y-1">
                {details.failures.map((failure: string, i: number) => (
                  <li key={i}>• {failure}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Variables faltantes */}
          {details.environment_variables?.missing && details.environment_variables.missing.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Variables de Entorno Faltantes</h4>
              <div className="text-sm text-gray-600">
                {details.environment_variables.missing.join(', ')}
              </div>
            </div>
          )}

          {/* Tablas faltantes */}
          {details.supabase?.tables?.missing && details.supabase.tables.missing.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Tablas Supabase Faltantes</h4>
              <div className="text-sm text-gray-600">
                {details.supabase.tables.missing.join(', ')}
              </div>
            </div>
          )}

          {/* Templates faltantes */}
          {details.supabase?.templates?.missing && details.supabase.templates.missing.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Templates Faltantes</h4>
              <div className="text-sm text-gray-600">
                {details.supabase.templates.missing.join(', ')}
              </div>
            </div>
          )}

          {/* Message Jobs */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Cola de Mensajes (últimos 7 días)</h4>
            <div className="bg-gray-50 px-3 py-2 rounded text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Encolados (queued)</span>
                <span className="font-medium">{details.supabase?.message_jobs?.queued || 0}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Procesando (processing)</span>
                <span className="font-medium">{details.supabase?.message_jobs?.processing || 0}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Enviados (sent)</span>
                <span className="font-medium">{details.supabase?.message_jobs?.sent || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fallidos (failed)</span>
                <span className={`font-medium ${jobsFailed > 10 ? 'text-red-600' : ''}`}>
                  {details.supabase?.message_jobs?.failed || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Resend Domain */}
          {details.resend?.domain && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Dominio Resend</h4>
              <div className="bg-gray-50 px-3 py-2 rounded text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Dominio</span>
                  <span className="font-medium">{details.resend.domain.name}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Estado</span>
                  <span className={`font-medium ${details.resend.domain.status === 'verified' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {details.resend.domain.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Región</span>
                  <span className="font-medium">{details.resend.domain.region}</span>
                </div>
              </div>
            </div>
          )}

          {/* Workers */}
          {details.workers?.checks && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Workers / Automatizaciones</h4>
              <div className="bg-gray-50 px-3 py-2 rounded text-sm space-y-1">
                {Object.entries(details.workers.checks).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-600">{key}</span>
                    <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Markdown completo */}
          {auditLog.markdown && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Informe Completo</h4>
              <div className="bg-gray-50 rounded-lg p-4 text-xs overflow-x-auto">
                <pre className="whitespace-pre-wrap font-mono text-gray-700">
                  {auditLog.markdown}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
