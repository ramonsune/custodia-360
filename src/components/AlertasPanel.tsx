'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Alerta {
  id: string
  entidad_id: string
  tipo: 'certificacion' | 'formacion' | 'caso' | 'auditoria' | 'general'
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  titulo: string
  descripcion: string
  fecha_creacion: string
  fecha_vencimiento?: string
  estado: 'pendiente' | 'leida' | 'en_proceso' | 'resuelta'
  asignado_a?: string
  origen_id?: string
}

interface AlertasPanelProps {
  entidadId: string
  compact?: boolean
}

export default function AlertasPanel({ entidadId, compact = false }: AlertasPanelProps) {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState<string>('todas')
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todas')
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<Alerta | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    cargarAlertas()
  }, [entidadId])

  const cargarAlertas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('alertas')
        .select('*')
        .eq('entidad_id', entidadId)
        .order('fecha_creacion', { ascending: false })

      if (error) throw error
      setAlertas(data || [])
    } catch (error) {
      console.error('Error cargando alertas:', error)
    } finally {
      setLoading(false)
    }
  }

  const actualizarEstadoAlerta = async (alertaId: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from('alertas')
        .update({
          estado: nuevoEstado,
          updated_at: new Date().toISOString()
        })
        .eq('id', alertaId)

      if (error) throw error

      setAlertas(prev => prev.map(alerta =>
        alerta.id === alertaId
          ? { ...alerta, estado: nuevoEstado as any }
          : alerta
      ))

      if (showModal) setShowModal(false)
    } catch (error) {
      console.error('Error actualizando alerta:', error)
    }
  }

  const crearAlertaManual = async (datos: Partial<Alerta>) => {
    try {
      const { data, error } = await supabase
        .from('alertas')
        .insert([{
          entidad_id: entidadId,
          tipo: datos.tipo || 'general',
          prioridad: datos.prioridad || 'media',
          titulo: datos.titulo,
          descripcion: datos.descripcion,
          asignado_a: datos.asignado_a
        }])
        .select()

      if (error) throw error

      if (data && data[0]) {
        setAlertas(prev => [data[0], ...prev])
      }
    } catch (error) {
      console.error('Error creando alerta:', error)
    }
  }

  const getColorPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'bg-red-100 border-red-300 text-red-800'
      case 'alta': return 'bg-orange-100 border-orange-300 text-orange-800'
      case 'media': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'baja': return 'bg-blue-100 border-blue-300 text-blue-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'resuelta': return 'bg-green-100 text-green-800'
      case 'en_proceso': return 'bg-blue-100 text-blue-800'
      case 'leida': return 'bg-yellow-100 text-yellow-800'
      case 'pendiente': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const alertasFiltradas = alertas.filter(alerta => {
    const filtroTipoOk = filtroTipo === 'todas' || alerta.tipo === filtroTipo
    const filtroPrioridadOk = filtroPrioridad === 'todas' || alerta.prioridad === filtroPrioridad
    return filtroTipoOk && filtroPrioridadOk
  })

  const contadorAlertas = {
    pendientes: alertas.filter(a => a.estado === 'pendiente').length,
    criticas: alertas.filter(a => a.prioridad === 'critica' && a.estado !== 'resuelta').length,
    total: alertas.length
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Alertas Activas</h3>
          <div className="flex gap-2">
            {contadorAlertas.criticas > 0 && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                {contadorAlertas.criticas} críticas
              </span>
            )}
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
              {contadorAlertas.pendientes} pendientes
            </span>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {alertasFiltradas.slice(0, 5).map((alerta) => (
            <div
              key={alerta.id}
              className={`p-3 rounded border cursor-pointer hover:bg-gray-50 ${getColorPrioridad(alerta.prioridad)}`}
              onClick={() => {
                setAlertaSeleccionada(alerta)
                setShowModal(true)
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{alerta.titulo}</h4>
                  <p className="text-xs opacity-75 mt-1">{alerta.descripcion}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getColorEstado(alerta.estado)}`}>
                  {alerta.estado}
                </span>
              </div>
            </div>
          ))}
        </div>

        {alertasFiltradas.length > 5 && (
          <div className="mt-3 text-center">
            <button
              onClick={() => setShowModal(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver todas las alertas ({alertasFiltradas.length})
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sistema de Alertas</h2>
            <p className="text-gray-600">Gestión centralizada de notificaciones y alertas</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{contadorAlertas.criticas}</div>
              <div className="text-sm text-gray-600">Críticas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{contadorAlertas.pendientes}</div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{contadorAlertas.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por tipo:</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="todas">Todas</option>
              <option value="certificacion">Certificaciones</option>
              <option value="formacion">Formaciones</option>
              <option value="caso">Casos</option>
              <option value="auditoria">Auditorías</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por prioridad:</label>
            <select
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="todas">Todas</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Cargando alertas...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertasFiltradas.map((alerta) => (
              <div
                key={alerta.id}
                className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getColorPrioridad(alerta.prioridad)}`}
                onClick={() => {
                  setAlertaSeleccionada(alerta)
                  setShowModal(true)
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold">{alerta.titulo}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-white bg-opacity-50">
                        {alerta.tipo}
                      </span>
                    </div>
                    <p className="text-sm opacity-90 mb-2">{alerta.descripcion}</p>
                    <div className="flex gap-4 text-xs opacity-75">
                      <span>Creada: {new Date(alerta.fecha_creacion).toLocaleDateString()}</span>
                      {alerta.fecha_vencimiento && (
                        <span>Vence: {new Date(alerta.fecha_vencimiento).toLocaleDateString()}</span>
                      )}
                      {alerta.asignado_a && (
                        <span>Asignada a: {alerta.asignado_a}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getColorEstado(alerta.estado)}`}>
                      {alerta.estado}
                    </span>
                    <span className="text-xs font-medium">
                      {alerta.prioridad.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {alertasFiltradas.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay alertas que coincidan con los filtros</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de detalle de alerta */}
      {showModal && alertaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Detalle de Alerta</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className={`p-4 rounded-lg border mb-6 ${getColorPrioridad(alertaSeleccionada.prioridad)}`}>
                <h3 className="font-bold text-lg mb-2">{alertaSeleccionada.titulo}</h3>
                <p className="mb-4">{alertaSeleccionada.descripcion}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Tipo:</span> {alertaSeleccionada.tipo}
                  </div>
                  <div>
                    <span className="font-medium">Prioridad:</span> {alertaSeleccionada.prioridad}
                  </div>
                  <div>
                    <span className="font-medium">Estado:</span> {alertaSeleccionada.estado}
                  </div>
                  <div>
                    <span className="font-medium">Fecha creación:</span> {new Date(alertaSeleccionada.fecha_creacion).toLocaleDateString()}
                  </div>
                  {alertaSeleccionada.fecha_vencimiento && (
                    <div>
                      <span className="font-medium">Fecha vencimiento:</span> {new Date(alertaSeleccionada.fecha_vencimiento).toLocaleDateString()}
                    </div>
                  )}
                  {alertaSeleccionada.asignado_a && (
                    <div>
                      <span className="font-medium">Asignada a:</span> {alertaSeleccionada.asignado_a}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                {alertaSeleccionada.estado === 'pendiente' && (
                  <>
                    <button
                      onClick={() => actualizarEstadoAlerta(alertaSeleccionada.id, 'leida')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Marcar como Leída
                    </button>
                    <button
                      onClick={() => actualizarEstadoAlerta(alertaSeleccionada.id, 'en_proceso')}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                    >
                      En Proceso
                    </button>
                  </>
                )}

                {alertaSeleccionada.estado !== 'resuelta' && (
                  <button
                    onClick={() => actualizarEstadoAlerta(alertaSeleccionada.id, 'resuelta')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Marcar como Resuelta
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
