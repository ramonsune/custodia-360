'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface Process {
  id: string
  email: string
  entity_name: string
  status: string
  created_at: string
  updated_at: string
  stripe_customer_id?: string
  entity_id?: string
  delegate_user_id?: string
  holded_contact_id?: string
  holded_invoice_id?: string
}

interface AuditEvent {
  id: string
  process_id: string
  event_type: string
  level: string
  payload: any
  created_at: string
}

export default function AdminAuditoriaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const processIdParam = searchParams.get('processId')

  const [processes, setProcesses] = useState<Process[]>([])
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingEvents, setLoadingEvents] = useState(false)

  // Filtros
  const [statusFilter, setStatusFilter] = useState('')
  const [emailFilter, setEmailFilter] = useState('')

  useEffect(() => {
    loadProcesses()
  }, [statusFilter, emailFilter])

  useEffect(() => {
    if (processIdParam) {
      loadProcessById(processIdParam)
    }
  }, [processIdParam])

  const loadProcesses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (emailFilter) params.append('email', emailFilter)

      const response = await fetch(`/api/audit/processes?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setProcesses(result.data)
      }
    } catch (error) {
      console.error('Error cargando procesos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProcessById = async (id: string) => {
    try {
      const response = await fetch(`/api/audit/processes`)
      const result = await response.json()

      if (result.success) {
        const process = result.data.find((p: Process) => p.id === id)
        if (process) {
          setSelectedProcess(process)
          loadEvents(id)
        }
      }
    } catch (error) {
      console.error('Error cargando proceso:', error)
    }
  }

  const loadEvents = async (processId: string) => {
    setLoadingEvents(true)
    try {
      const response = await fetch(`/api/audit/events?processId=${processId}&limit=200`)
      const result = await response.json()

      if (result.success) {
        setEvents(result.data)
      }
    } catch (error) {
      console.error('Error cargando eventos:', error)
    } finally {
      setLoadingEvents(false)
    }
  }

  const selectProcess = (process: Process) => {
    setSelectedProcess(process)
    loadEvents(process.id)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      provisioned: 'bg-green-100 text-green-800',
      trained: 'bg-purple-100 text-purple-800',
      error: 'bg-red-100 text-red-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const getLevelBadge = (level: string) => {
    const styles = {
      INFO: 'bg-blue-100 text-blue-800',
      WARN: 'bg-yellow-100 text-yellow-800',
      ERROR: 'bg-red-100 text-red-800'
    }
    return styles[level as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Auditoría</h1>
            <button
              onClick={() => router.push('/dashboard-custodia360')}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Procesos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900 mb-4">Procesos de Onboarding</h2>

                {/* Filtros */}
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Buscar por email..."
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="provisioned">Provisionado</option>
                    <option value="trained">Formado</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[600px]">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : processes.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No se encontraron procesos
                  </div>
                ) : (
                  <div className="divide-y">
                    {processes.map((process) => (
                      <div
                        key={process.id}
                        onClick={() => selectProcess(process)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                          selectedProcess?.id === process.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-sm text-gray-900 truncate">
                            {process.entity_name}
                          </p>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(process.status)}`}>
                            {process.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate mb-1">{process.email}</p>
                        <p className="text-xs text-gray-400">{formatDate(process.created_at)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline de Eventos */}
          <div className="lg:col-span-2">
            {selectedProcess ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedProcess.entity_name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">{selectedProcess.email}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Process ID</p>
                      <p className="font-mono text-xs text-gray-900">{selectedProcess.id.substring(0, 8)}...</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Estado</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(selectedProcess.status)}`}>
                        {selectedProcess.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600">Creado</p>
                      <p className="text-gray-900">{formatDate(selectedProcess.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Actualizado</p>
                      <p className="text-gray-900">{formatDate(selectedProcess.updated_at)}</p>
                    </div>
                  </div>

                  {selectedProcess.entity_id && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">Entity ID: <span className="font-mono text-xs">{selectedProcess.entity_id.substring(0, 8)}...</span></p>
                      {selectedProcess.delegate_user_id && (
                        <p className="text-sm text-gray-600">User ID: <span className="font-mono text-xs">{selectedProcess.delegate_user_id.substring(0, 8)}...</span></p>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Timeline de Eventos</h3>

                  {loadingEvents ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : events.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay eventos registrados</p>
                  ) : (
                    <div className="space-y-4">
                      {events.map((event, index) => (
                        <div key={event.id} className="flex">
                          <div className="flex-shrink-0 w-2 bg-blue-200 rounded-full mr-4 relative">
                            {index !== events.length - 1 && (
                              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-blue-200"></div>
                            )}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
                          </div>

                          <div className="flex-1 pb-8">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-semibold text-gray-900">{event.event_type}</p>
                                  <p className="text-xs text-gray-500">{formatDate(event.created_at)}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${getLevelBadge(event.level)}`}>
                                  {event.level}
                                </span>
                              </div>

                              {event.payload && Object.keys(event.payload).length > 0 && (
                                <details className="mt-2">
                                  <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                                    Ver detalles
                                  </summary>
                                  <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">
                                    {JSON.stringify(event.payload, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">Selecciona un proceso para ver su timeline</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
