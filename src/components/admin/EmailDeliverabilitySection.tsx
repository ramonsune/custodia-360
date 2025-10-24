'use client'

import { useState, useEffect } from 'react'

interface EmailStats {
  sent: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
  complained: number
}

interface MessageJobStats {
  queued: number
  processing: number
  sent: number
  failed: number
}

interface EmailEvent {
  id: string
  created_at: string
  event: string
  to_email: string
  subject: string
  template_slug: string
  entity_id: string
  meta: any
}

export default function EmailDeliverabilitySection() {
  const [period, setPeriod] = useState<7 | 30>(7)
  const [stats, setStats] = useState<EmailStats | null>(null)
  const [queueStats, setQueueStats] = useState<MessageJobStats | null>(null)
  const [events, setEvents] = useState<EmailEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  // Filtros
  const [filterEntity, setFilterEntity] = useState<string>('')
  const [filterTemplate, setFilterTemplate] = useState<string>('')
  const [filterEvent, setFilterEvent] = useState<string>('')
  const [filterDateFrom, setFilterDateFrom] = useState<string>('')
  const [filterDateTo, setFilterDateTo] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [period])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/email-stats?period=${period}`)
      const data = await response.json()

      if (!data.ok) {
        if (data.tableExists === false) {
          // Tabla no existe aún
          console.log('Tabla email_events no existe. Ejecutar SQL en Supabase.')
        }
        throw new Error(data.error || 'Error loading data')
      }

      setStats(data.stats)
      setQueueStats(data.queueStats)
      setEvents(data.events || [])
    } catch (error) {
      console.error('Error loading email stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => {
    if (filterEntity && event.entity_id !== filterEntity) return false
    if (filterTemplate && event.template_slug !== filterTemplate) return false
    if (filterEvent && event.event !== filterEvent) return false
    if (filterDateFrom && new Date(event.created_at) < new Date(filterDateFrom)) return false
    if (filterDateTo && new Date(event.created_at) > new Date(filterDateTo)) return false
    return true
  })

  const getEventEmoji = (event: string) => {
    switch (event) {
      case 'delivered': return '✅'
      case 'sent': return '📤'
      case 'opened': return '👀'
      case 'clicked': return '🔗'
      case 'bounced': return '❌'
      case 'complained': return '🚨'
      default: return '📧'
    }
  }

  const getEventColor = (event: string) => {
    switch (event) {
      case 'delivered': return 'text-green-600'
      case 'opened': return 'text-blue-600'
      case 'clicked': return 'text-purple-600'
      case 'bounced': return 'text-red-600'
      case 'complained': return 'text-orange-600'
      default: return 'text-gray-600'
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

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 text-xl">📧</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Email & Entregabilidad</h3>
            <p className="text-sm text-gray-500">Eventos y trazabilidad de emails</p>
          </div>
        </div>

        {/* Selector de período */}
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod(7)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 7
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            7 días
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 30
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            30 días
          </button>
        </div>
      </div>

      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
            <div className="text-xs text-blue-700">Enviados</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-xs text-green-700">Entregados</div>
          </div>
          <div className="bg-cyan-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-cyan-600">{stats.opened}</div>
            <div className="text-xs text-cyan-700">Abiertos</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.clicked}</div>
            <div className="text-xs text-purple-700">Clics</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">{stats.bounced}</div>
            <div className="text-xs text-red-700">Rebotados</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.complained}</div>
            <div className="text-xs text-orange-700">Quejas</div>
          </div>
        </div>
      )}

      {/* Queue Stats */}
      {queueStats && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Cola Actual (message_jobs)</h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-sm text-gray-600">Encolados:</span>
              <span className="text-sm font-semibold text-gray-900">{queueStats.queued}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-sm text-gray-600">Procesando:</span>
              <span className="text-sm font-semibold text-gray-900">{queueStats.processing}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-gray-600">Enviados:</span>
              <span className="text-sm font-semibold text-gray-900">{queueStats.sent}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-sm text-gray-600">Fallidos:</span>
              <span className="text-sm font-semibold text-gray-900">{queueStats.failed}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Filtros</h4>
        <div className="grid grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="ID Entidad"
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Template slug"
            value={filterTemplate}
            onChange={(e) => setFilterTemplate(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos los eventos</option>
            <option value="sent">Enviados</option>
            <option value="delivered">Entregados</option>
            <option value="opened">Abiertos</option>
            <option value="clicked">Clickeados</option>
            <option value="bounced">Rebotados</option>
            <option value="complained">Quejas</option>
          </select>
          <input
            type="date"
            placeholder="Desde"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <input
            type="date"
            placeholder="Hasta"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="mt-3 text-xs text-gray-500">
          Mostrando {filteredEvents.length} de {events.length} eventos
        </div>
      </div>

      {/* Tabla de eventos */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evento</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destinatario</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asunto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No hay eventos con los filtros aplicados
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <>
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(event.created_at).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`font-medium ${getEventColor(event.event)}`}>
                        {getEventEmoji(event.event)} {event.event}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      {event.to_email || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {(event.subject || '—').substring(0, 40)}
                      {event.subject && event.subject.length > 40 && '...'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {event.template_slug || '—'}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => setExpandedRow(expandedRow === event.id ? null : event.id)}
                        className="text-purple-600 hover:text-purple-700 text-xs font-medium"
                      >
                        {expandedRow === event.id ? 'Ocultar' : 'Ver payload'}
                      </button>
                    </td>
                  </tr>
                  {expandedRow === event.id && (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 bg-gray-50">
                        <div className="text-xs">
                          <div className="font-semibold text-gray-700 mb-2">Payload Meta:</div>
                          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-64">
                            {JSON.stringify(event.meta, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enlaces útiles */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Enlaces Útiles</h4>
        <div className="grid grid-cols-3 gap-3">
          <a
            href="https://resend.com/domains"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <span className="text-blue-600 text-sm">🌐</span>
            <span className="text-sm text-blue-700 font-medium">Resend Dashboard</span>
          </a>
          <a
            href="https://app.netlify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <span className="text-green-600 text-sm">⚡</span>
            <span className="text-sm text-green-700 font-medium">Netlify Functions Logs</span>
          </a>
          <button
            onClick={() => alert('Guía en desarrollo:\n\n1. Verificar causa del rebote\n2. Validar email del destinatario\n3. Revisar reputación del dominio\n4. Contactar con el destinatario por otro canal')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <span className="text-orange-600 text-sm">📖</span>
            <span className="text-sm text-orange-700 font-medium">Guía: Rebotes & Quejas</span>
          </button>
        </div>
      </div>
    </div>
  )
}
