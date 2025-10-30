'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Alerta {
  id: string
  tipo: 'Crítica' | 'Alta' | 'Media' | 'Baja'
  titulo: string
  descripcion: string
  fechaCreacion: string
  responsable: string
  fechaVencimiento: string
  diasRestantes: number
  acciones: string[]
  estado: 'pendiente' | 'en_proceso' | 'resuelta'
}

export default function ResolverAlertasPage() {
  const router = useRouter()
  const [alertas, setAlertas] = useState<Alerta[]>([
    {
      id: 'AL001',
      tipo: 'Crítica',
      titulo: 'Certificado LOPIVI vencido',
      descripcion: 'El certificado de Juan Pérez ha vencido y sigue en contacto con menores',
      fechaCreacion: '2025-09-10',
      responsable: 'Recursos Humanos',
      fechaVencimiento: '2025-09-20',
      diasRestantes: -3,
      acciones: [],
      estado: 'pendiente'
    },
    {
      id: 'AL002',
      tipo: 'Crítica',
      titulo: 'Plan de Protección desactualizado',
      descripcion: 'El plan de protección no se ha actualizado en los últimos 12 meses',
      fechaCreacion: '2025-09-12',
      responsable: 'Delegado Principal',
      fechaVencimiento: '2025-09-25',
      diasRestantes: 2,
      acciones: [],
      estado: 'pendiente'
    },
    {
      id: 'AL003',
      tipo: 'Alta',
      titulo: 'Formación pendiente múltiples personas',
      descripcion: '3 personas con formación LOPIVI pendiente próxima a vencer',
      fechaCreacion: '2025-09-08',
      responsable: 'Formación',
      fechaVencimiento: '2025-10-15',
      diasRestantes: 27,
      acciones: [],
      estado: 'pendiente'
    },
    {
      id: 'AL004',
      tipo: 'Media',
      titulo: 'Documentación de protocolos incompleta',
      descripcion: 'Faltan 2 protocolos específicos por actualizar',
      fechaCreacion: '2025-09-05',
      responsable: 'Coordinación',
      fechaVencimiento: '2025-10-01',
      diasRestantes: 8,
      acciones: [],
      estado: 'pendiente'
    }
  ])

  const [alertaSeleccionada, setAlertaSeleccionada] = useState<Alerta | null>(null)
  const [modalResolver, setModalResolver] = useState(false)
  const [accionResolucion, setAccionResolucion] = useState('')
  const [fechaCompromiso, setFechaCompromiso] = useState('')
  const [responsableAsignado, setResponsableAsignado] = useState('')
  const [observaciones, setObservaciones] = useState('')

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Crítica': return 'bg-red-100 text-red-800 border-red-200'
      case 'Alta': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Media': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Baja': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-red-100 text-red-800'
      case 'en_proceso': return 'bg-yellow-100 text-yellow-800'
      case 'resuelta': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const abrirModalResolver = (alerta: Alerta) => {
    setAlertaSeleccionada(alerta)
    setResponsableAsignado(alerta.responsable)
    setModalResolver(true)
  }

  const resolverAlerta = () => {
    if (!alertaSeleccionada || !accionResolucion.trim()) {
      alert('Por favor, especifica la acción de resolución')
      return
    }

    const alertasActualizadas = alertas.map(alerta => {
      if (alerta.id === alertaSeleccionada.id) {
        return {
          ...alerta,
          estado: 'en_proceso' as const,
          acciones: [
            ...alerta.acciones,
            `${new Date().toLocaleDateString()}: ${accionResolucion} (Responsable: ${responsableAsignado})`
          ]
        }
      }
      return alerta
    })

    setAlertas(alertasActualizadas)

    alert(`ALERTA EN PROCESO DE RESOLUCIÓN\n\nID: ${alertaSeleccionada.id}\nAcción: ${accionResolucion}\nResponsable: ${responsableAsignado}\n${fechaCompromiso ? `Fecha compromiso: ${fechaCompromiso}` : ''}\n\nLa alerta ha sido marcada como "en proceso" y se ha notificado al responsable.`)

    setModalResolver(false)
    limpiarFormulario()
  }

  const marcarResuelta = (alertaId: string) => {
    const alertasActualizadas = alertas.map(alerta => {
      if (alerta.id === alertaId) {
        return {
          ...alerta,
          estado: 'resuelta' as const,
          acciones: [
            ...alerta.acciones,
            `${new Date().toLocaleDateString()}: Alerta marcada como RESUELTA`
          ]
        }
      }
      return alerta
    })

    setAlertas(alertasActualizadas)
    alert(`ALERTA RESUELTA\n\nID: ${alertaId}\n\nLa alerta ha sido marcada como resuelta y archivada del panel principal.`)
  }

  const limpiarFormulario = () => {
    setAccionResolucion('')
    setFechaCompromiso('')
    setObservaciones('')
    setAlertaSeleccionada(null)
  }

  const alertasPendientes = alertas.filter(a => a.estado === 'pendiente')
  const alertasEnProceso = alertas.filter(a => a.estado === 'en_proceso')
  const alertasResueltas = alertas.filter(a => a.estado === 'resuelta')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resolver Alertas Pendientes</h1>
              <p className="text-gray-600 mt-2">Gestión de alertas LOPIVI del sistema</p>
            </div>
            <Link
              href="/dashboard-delegado"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Volver al Dashboard
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-red-600">{alertas.filter(a => a.tipo === 'Crítica').length}</div>
            <div className="text-sm text-gray-600">Alertas Críticas</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-yellow-600">{alertasPendientes.length}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-blue-600">{alertasEnProceso.length}</div>
            <div className="text-sm text-gray-600">En Proceso</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-green-600">{alertasResueltas.length}</div>
            <div className="text-sm text-gray-600">Resueltas</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button className="border-b-2 border-red-500 py-4 px-1 text-sm font-medium text-red-600">
                Pendientes ({alertasPendientes.length})
              </button>
              <button className="border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                En Proceso ({alertasEnProceso.length})
              </button>
              <button className="border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Resueltas ({alertasResueltas.length})
              </button>
            </nav>
          </div>

          {/* Lista de alertas pendientes */}
          <div className="p-6">
            <div className="space-y-4">
              {alertasPendientes.map((alerta) => (
                <div key={alerta.id} className={`border rounded-lg p-4 ${getTipoColor(alerta.tipo)}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-bold text-lg">{alerta.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoColor(alerta.tipo)}`}>
                          {alerta.tipo}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(alerta.estado)}`}>
                          {alerta.estado.toUpperCase()}
                        </span>
                        {alerta.diasRestantes < 0 && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-200 text-red-800">
                            VENCIDA
                          </span>
                        )}
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-2">{alerta.titulo}</h4>
                      <p className="text-gray-700 mb-3">{alerta.descripcion}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Responsable:</span> {alerta.responsable}
                        </div>
                        <div>
                          <span className="font-medium">Creada:</span> {alerta.fechaCreacion}
                        </div>
                        <div>
                          <span className="font-medium">Vence:</span> {alerta.fechaVencimiento}
                          {alerta.diasRestantes > 0 && (
                            <span className="text-orange-600 ml-2">({alerta.diasRestantes} días)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => abrirModalResolver(alerta)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Resolver
                      </button>
                      {alerta.estado === 'en_proceso' && (
                        <button
                          onClick={() => marcarResuelta(alerta.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Marcar Resuelta
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {alertasPendientes.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">¡No hay alertas pendientes!</h3>
                  <p className="text-gray-600">Todas las alertas han sido procesadas correctamente.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal resolver alerta */}
        {modalResolver && alertaSeleccionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Resolver Alerta: {alertaSeleccionada.id}</h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-bold mb-2">Información de la Alerta</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Título:</strong> {alertaSeleccionada.titulo}</p>
                  <p><strong>Descripción:</strong> {alertaSeleccionada.descripcion}</p>
                  <p><strong>Tipo:</strong> {alertaSeleccionada.tipo}</p>
                  <p><strong>Responsable actual:</strong> {alertaSeleccionada.responsable}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Acción de resolución *
                  </label>
                  <textarea
                    value={accionResolucion}
                    onChange={(e) => setAccionResolucion(e.target.value)}
                    placeholder="Describe qué acción se va a tomar para resolver esta alerta..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable asignado
                    </label>
                    <select
                      value={responsableAsignado}
                      onChange={(e) => setResponsableAsignado(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="Recursos Humanos">Recursos Humanos</option>
                      <option value="Delegado Principal">Delegado Principal</option>
                      <option value="Delegado Suplente">Delegado Suplente</option>
                      <option value="Formación">Departamento de Formación</option>
                      <option value="Coordinación">Coordinación</option>
                      <option value="Dirección">Dirección</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha compromiso (opcional)
                    </label>
                    <input
                      type="date"
                      value={fechaCompromiso}
                      onChange={(e) => setFechaCompromiso(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones adicionales
                  </label>
                  <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Cualquier observación adicional sobre la resolución..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setModalResolver(false)
                    limpiarFormulario()
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={resolverAlerta}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Iniciar Resolución
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
