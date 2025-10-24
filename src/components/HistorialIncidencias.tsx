'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Incidencia {
  id: string
  entidad_id: string
  codigo_caso: string
  titulo: string
  descripcion: string
  categoria: string
  subcategoria?: string
  gravedad: 'baja' | 'media' | 'alta' | 'critica'
  estado: 'abierto' | 'en_investigacion' | 'en_proceso' | 'resuelto' | 'cerrado' | 'archivado'
  prioridad: 'baja' | 'media' | 'alta' | 'urgente'
  fecha_incidencia: string
  fecha_reporte: string
  reportado_por?: string
  afectados?: string[]
  testigos?: string[]
  ubicacion?: string
  delegado_asignado?: string
  autoridades_contactadas?: string[]
  requiere_seguimiento: boolean
  confidencial: boolean
  created_at: string
  updated_at: string
}

interface AccionTomada {
  id: string
  incidencia_id: string
  fecha_accion: string
  tipo_accion: string
  titulo: string
  descripcion: string
  responsable?: string
  participantes?: string[]
  resultado?: string
  documentos_adjuntos?: string[]
  proximos_pasos?: string
  fecha_seguimiento?: string
  completada: boolean
  observaciones?: string
  created_at: string
}

interface IncidenciaCompleta extends Incidencia {
  acciones_tomadas: AccionTomada[]
}

interface HistorialIncidenciasProps {
  entidadId: string
}

export default function HistorialIncidencias({ entidadId }: HistorialIncidenciasProps) {
  const [incidencias, setIncidencias] = useState<IncidenciaCompleta[]>([])
  const [loading, setLoading] = useState(true)
  const [vistaActiva, setVistaActiva] = useState<'lista' | 'estadisticas' | 'timeline'>('lista')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [filtroGravedad, setFiltroGravedad] = useState<string>('todas')
  const [showModalIncidencia, setShowModalIncidencia] = useState(false)
  const [showModalAccion, setShowModalAccion] = useState(false)
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState<IncidenciaCompleta | null>(null)
  const [modoEdicion, setModoEdicion] = useState<'crear' | 'editar'>('crear')

  useEffect(() => {
    cargarIncidencias()
  }, [entidadId])

  const cargarIncidencias = async () => {
    try {
      setLoading(true)

      const { data: incidenciasData, error: incidenciasError } = await supabase
        .from('incidencias')
        .select(`
          *,
          acciones_tomadas (*)
        `)
        .eq('entidad_id', entidadId)
        .order('fecha_reporte', { ascending: false })

      if (incidenciasError) throw incidenciasError
      setIncidencias(incidenciasData || [])

    } catch (error) {
      console.error('Error cargando incidencias:', error)
    } finally {
      setLoading(false)
    }
  }

  const generarCodigoCaso = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generar_codigo_caso', {
      entidad_id: entidadId
    })

    if (error) {
      console.error('Error generando código:', error)
      // Fallback: generar código manual
      const timestamp = Date.now().toString().slice(-4)
      return `CASO-${timestamp}`
    }

    return data
  }

  const crearIncidencia = async (datos: Partial<Incidencia>) => {
    try {
      const codigoCaso = await generarCodigoCaso()

      const { data, error } = await supabase
        .from('incidencias')
        .insert([{
          entidad_id: entidadId,
          codigo_caso: codigoCaso,
          ...datos
        }])
        .select()

      if (error) throw error

      cargarIncidencias()
      setShowModalIncidencia(false)
    } catch (error) {
      console.error('Error creando incidencia:', error)
    }
  }

  const actualizarIncidencia = async (id: string, datos: Partial<Incidencia>) => {
    try {
      const { error } = await supabase
        .from('incidencias')
        .update({
          ...datos,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      cargarIncidencias()
      setShowModalIncidencia(false)
      setIncidenciaSeleccionada(null)
    } catch (error) {
      console.error('Error actualizando incidencia:', error)
    }
  }

  const crearAccion = async (datos: Partial<AccionTomada>) => {
    try {
      const { data, error } = await supabase
        .from('acciones_tomadas')
        .insert([datos])
        .select()

      if (error) throw error

      cargarIncidencias()
      setShowModalAccion(false)
      setIncidenciaSeleccionada(null)
    } catch (error) {
      console.error('Error creando acción:', error)
    }
  }

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'abierto': return 'bg-red-100 text-red-800'
      case 'en_investigacion': return 'bg-yellow-100 text-yellow-800'
      case 'en_proceso': return 'bg-blue-100 text-blue-800'
      case 'resuelto': return 'bg-green-100 text-green-800'
      case 'cerrado': return 'bg-gray-100 text-gray-800'
      case 'archivado': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getColorGravedad = (gravedad: string) => {
    switch (gravedad) {
      case 'critica': return 'bg-red-100 border-red-300 text-red-800'
      case 'alta': return 'bg-orange-100 border-orange-300 text-orange-800'
      case 'media': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'baja': return 'bg-blue-100 border-blue-300 text-blue-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const calcularEstadisticas = () => {
    const total = incidencias.length
    const porEstado = incidencias.reduce((acc, inc) => {
      acc[inc.estado] = (acc[inc.estado] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const porCategoria = incidencias.reduce((acc, inc) => {
      acc[inc.categoria] = (acc[inc.categoria] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const porGravedad = incidencias.reduce((acc, inc) => {
      acc[inc.gravedad] = (acc[inc.gravedad] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const tiempoPromedio = incidencias
      .filter(inc => inc.estado === 'resuelto' || inc.estado === 'cerrado')
      .reduce((acc, inc) => {
        const inicio = new Date(inc.fecha_incidencia).getTime()
        const fin = new Date(inc.updated_at).getTime()
        return acc + (fin - inicio)
      }, 0) / Math.max(1, incidencias.filter(inc => inc.estado === 'resuelto' || inc.estado === 'cerrado').length)

    const diasPromedioResolucion = Math.round(tiempoPromedio / (1000 * 60 * 60 * 24))

    return {
      total,
      porEstado,
      porCategoria,
      porGravedad,
      diasPromedioResolucion
    }
  }

  const incidenciasFiltradas = incidencias.filter(inc => {
    const filtroEstadoOk = filtroEstado === 'todos' || inc.estado === filtroEstado
    const filtroCategoriaOk = filtroCategoria === 'todas' || inc.categoria === filtroCategoria
    const filtroGravedadOk = filtroGravedad === 'todas' || inc.gravedad === filtroGravedad
    return filtroEstadoOk && filtroCategoriaOk && filtroGravedadOk
  })

  const estadisticas = calcularEstadisticas()

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando histórico...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Histórico de Incidencias</h2>
            <p className="text-gray-600">Seguimiento completo de casos y acciones</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setVistaActiva('lista')}
              className={`px-4 py-2 rounded-lg font-medium ${
                vistaActiva === 'lista'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setVistaActiva('estadisticas')}
              className={`px-4 py-2 rounded-lg font-medium ${
                vistaActiva === 'estadisticas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Estadísticas
            </button>
            <button
              onClick={() => setVistaActiva('timeline')}
              className={`px-4 py-2 rounded-lg font-medium ${
                vistaActiva === 'timeline'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => {
                setIncidenciaSeleccionada(null)
                setModoEdicion('crear')
                setShowModalIncidencia(true)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Nueva Incidencia
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {vistaActiva === 'lista' && (
          <div>
            <div className="flex gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado:</label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="todos">Todos</option>
                  <option value="abierto">Abierto</option>
                  <option value="en_investigacion">En Investigación</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="cerrado">Cerrado</option>
                  <option value="archivado">Archivado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría:</label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="todas">Todas</option>
                  <option value="maltrato_fisico">Maltrato Físico</option>
                  <option value="maltrato_psicologico">Maltrato Psicológico</option>
                  <option value="abuso_sexual">Abuso Sexual</option>
                  <option value="negligencia">Negligencia</option>
                  <option value="acoso">Acoso</option>
                  <option value="accidente">Accidente</option>
                  <option value="conducta_inapropiada">Conducta Inapropiada</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gravedad:</label>
                <select
                  value={filtroGravedad}
                  onChange={(e) => setFiltroGravedad(e.target.value)}
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

            <div className="space-y-4">
              {incidenciasFiltradas.map((incidencia) => (
                <div key={incidencia.id} className={`border rounded-lg p-4 ${getColorGravedad(incidencia.gravedad)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {incidencia.codigo_caso} - {incidencia.titulo}
                        </h3>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${getColorEstado(incidencia.estado)}`}>
                          {incidencia.estado}
                        </span>
                        {incidencia.confidencial && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                            CONFIDENCIAL
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-3">{incidencia.descripcion}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="font-medium text-gray-700">Categoría:</span><br />
                          {incidencia.categoria.replace('_', ' ')}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Gravedad:</span><br />
                          {incidencia.gravedad}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Fecha incidencia:</span><br />
                          {new Date(incidencia.fecha_incidencia).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Reportado por:</span><br />
                          {incidencia.reportado_por || 'No especificado'}
                        </div>
                        {incidencia.ubicacion && (
                          <div>
                            <span className="font-medium text-gray-700">Ubicación:</span><br />
                            {incidencia.ubicacion}
                          </div>
                        )}
                        {incidencia.delegado_asignado && (
                          <div>
                            <span className="font-medium text-gray-700">Delegado asignado:</span><br />
                            {incidencia.delegado_asignado}
                          </div>
                        )}
                      </div>

                      {/* Acciones realizadas */}
                      <div className="bg-white bg-opacity-50 rounded p-3">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Acciones realizadas ({incidencia.acciones_tomadas.length})
                        </h4>
                        {incidencia.acciones_tomadas.length > 0 ? (
                          <div className="space-y-2">
                            {incidencia.acciones_tomadas.slice(0, 3).map((accion) => (
                              <div key={accion.id} className="text-sm">
                                <span className="font-medium">{new Date(accion.fecha_accion).toLocaleDateString()}:</span>
                                <span className="ml-2">{accion.titulo}</span>
                                {accion.completada && (
                                  <span className="ml-2 text-green-600 font-medium">✓</span>
                                )}
                              </div>
                            ))}
                            {incidencia.acciones_tomadas.length > 3 && (
                              <div className="text-sm text-gray-600">
                                +{incidencia.acciones_tomadas.length - 3} acciones más
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">Sin acciones registradas</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => {
                          setIncidenciaSeleccionada(incidencia)
                          setModoEdicion('editar')
                          setShowModalIncidencia(true)
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setIncidenciaSeleccionada(incidencia)
                          setShowModalAccion(true)
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        + Acción
                      </button>
                      {incidencia.estado !== 'cerrado' && incidencia.estado !== 'archivado' && (
                        <button
                          onClick={() => actualizarIncidencia(incidencia.id, { estado: 'cerrado' })}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                        >
                          Cerrar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {incidenciasFiltradas.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No hay incidencias que coincidan con los filtros</p>
                </div>
              )}
            </div>
          </div>
        )}

        {vistaActiva === 'estadisticas' && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Estadísticas de Incidencias</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{estadisticas.total}</div>
                <div className="text-sm text-blue-700">Total Incidencias</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{estadisticas.porEstado.abierto || 0}</div>
                <div className="text-sm text-red-700">Casos Abiertos</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{(estadisticas.porEstado.resuelto || 0) + (estadisticas.porEstado.cerrado || 0)}</div>
                <div className="text-sm text-green-700">Casos Resueltos</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{estadisticas.diasPromedioResolucion}</div>
                <div className="text-sm text-yellow-700">Días Promedio Resolución</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Por Estado</h4>
                <div className="space-y-2">
                  {Object.entries(estadisticas.porEstado).map(([estado, count]) => (
                    <div key={estado} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 capitalize">{estado.replace('_', ' ')}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Por Categoría</h4>
                <div className="space-y-2">
                  {Object.entries(estadisticas.porCategoria).map(([categoria, count]) => (
                    <div key={categoria} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 capitalize">{categoria.replace('_', ' ')}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Por Gravedad</h4>
                <div className="space-y-2">
                  {Object.entries(estadisticas.porGravedad).map(([gravedad, count]) => (
                    <div key={gravedad} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 capitalize">{gravedad}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {vistaActiva === 'timeline' && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Timeline de Actividad</h3>

            <div className="space-y-6">
              {incidencias.slice(0, 10).map((incidencia) => (
                <div key={incidencia.id} className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                  <div className="relative flex items-start">
                    <div className="absolute left-2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>

                    <div className="ml-12 bg-white border border-gray-200 rounded-lg p-4 w-full">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{incidencia.codigo_caso} - {incidencia.titulo}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(incidencia.fecha_reporte).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm mb-3">{incidencia.descripcion}</p>

                      <div className="space-y-2">
                        {incidencia.acciones_tomadas.map((accion) => (
                          <div key={accion.id} className="relative">
                            <div className="absolute left-4 top-2 w-2 h-2 bg-green-400 rounded-full"></div>
                            <div className="ml-8 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{accion.titulo}</span>
                                <span className="text-gray-500 text-xs">
                                  {new Date(accion.fecha_accion).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-600 text-xs">{accion.descripcion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal para crear/editar incidencia */}
      {showModalIncidencia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {modoEdicion === 'crear' ? 'Nueva Incidencia' : 'Editar Incidencia'}
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const datos = {
                  titulo: formData.get('titulo') as string,
                  descripcion: formData.get('descripcion') as string,
                  categoria: formData.get('categoria') as string,
                  gravedad: formData.get('gravedad') as string,
                  estado: formData.get('estado') as string,
                  prioridad: formData.get('prioridad') as string,
                  fecha_incidencia: formData.get('fecha_incidencia') as string,
                  reportado_por: formData.get('reportado_por') as string || undefined,
                  ubicacion: formData.get('ubicacion') as string || undefined,
                  delegado_asignado: formData.get('delegado_asignado') as string || undefined,
                  confidencial: formData.get('confidencial') === 'on',
                  requiere_seguimiento: formData.get('requiere_seguimiento') === 'on',
                }

                if (modoEdicion === 'crear') {
                  crearIncidencia(datos)
                } else if (incidenciaSeleccionada) {
                  actualizarIncidencia(incidenciaSeleccionada.id, datos)
                }
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                <input
                  type="text"
                  name="titulo"
                  required
                  defaultValue={incidenciaSeleccionada?.titulo || ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                <textarea
                  name="descripcion"
                  required
                  rows={4}
                  defaultValue={incidenciaSeleccionada?.descripcion || ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                  <select
                    name="categoria"
                    required
                    defaultValue={incidenciaSeleccionada?.categoria || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="maltrato_fisico">Maltrato Físico</option>
                    <option value="maltrato_psicologico">Maltrato Psicológico</option>
                    <option value="abuso_sexual">Abuso Sexual</option>
                    <option value="negligencia">Negligencia</option>
                    <option value="acoso">Acoso</option>
                    <option value="accidente">Accidente</option>
                    <option value="conducta_inapropiada">Conducta Inapropiada</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gravedad *</label>
                  <select
                    name="gravedad"
                    required
                    defaultValue={incidenciaSeleccionada?.gravedad || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Seleccionar gravedad</option>
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    name="estado"
                    defaultValue={incidenciaSeleccionada?.estado || 'abierto'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="abierto">Abierto</option>
                    <option value="en_investigacion">En Investigación</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="resuelto">Resuelto</option>
                    <option value="cerrado">Cerrado</option>
                    <option value="archivado">Archivado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                  <select
                    name="prioridad"
                    defaultValue={incidenciaSeleccionada?.prioridad || 'media'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Incidencia *</label>
                  <input
                    type="datetime-local"
                    name="fecha_incidencia"
                    required
                    defaultValue={incidenciaSeleccionada?.fecha_incidencia ?
                      new Date(incidenciaSeleccionada.fecha_incidencia).toISOString().slice(0, 16) : ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reportado por</label>
                  <input
                    type="text"
                    name="reportado_por"
                    defaultValue={incidenciaSeleccionada?.reportado_por || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                  <input
                    type="text"
                    name="ubicacion"
                    defaultValue={incidenciaSeleccionada?.ubicacion || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delegado Asignado</label>
                  <input
                    type="text"
                    name="delegado_asignado"
                    defaultValue={incidenciaSeleccionada?.delegado_asignado || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="confidencial"
                    defaultChecked={incidenciaSeleccionada?.confidencial || false}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Caso confidencial</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="requiere_seguimiento"
                    defaultChecked={incidenciaSeleccionada?.requiere_seguimiento || false}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Requiere seguimiento</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {modoEdicion === 'crear' ? 'Crear' : 'Actualizar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModalIncidencia(false)
                    setIncidenciaSeleccionada(null)
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para agregar acción */}
      {showModalAccion && incidenciaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Agregar Acción</h3>
              <p className="text-sm text-gray-600">
                {incidenciaSeleccionada.codigo_caso} - {incidenciaSeleccionada.titulo}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                crearAccion({
                  incidencia_id: incidenciaSeleccionada.id,
                  tipo_accion: formData.get('tipo_accion') as string,
                  titulo: formData.get('titulo') as string,
                  descripcion: formData.get('descripcion') as string,
                  responsable: formData.get('responsable') as string || undefined,
                  resultado: formData.get('resultado') as string || undefined,
                  proximos_pasos: formData.get('proximos_pasos') as string || undefined,
                  fecha_seguimiento: formData.get('fecha_seguimiento') as string || undefined,
                  completada: formData.get('completada') === 'on',
                  observaciones: formData.get('observaciones') as string || undefined,
                })
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Acción *</label>
                <select
                  name="tipo_accion"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="investigacion">Investigación</option>
                  <option value="entrevista">Entrevista</option>
                  <option value="medida_cautelar">Medida Cautelar</option>
                  <option value="comunicacion_autoridades">Comunicación a Autoridades</option>
                  <option value="comunicacion_familias">Comunicación a Familias</option>
                  <option value="seguimiento">Seguimiento</option>
                  <option value="documentacion">Documentación</option>
                  <option value="formacion">Formación</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                <input
                  type="text"
                  name="titulo"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Título descriptivo de la acción"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                <textarea
                  name="descripcion"
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Descripción detallada de la acción realizada"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
                  <input
                    type="text"
                    name="responsable"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Persona responsable de la acción"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Seguimiento</label>
                  <input
                    type="date"
                    name="fecha_seguimiento"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resultado</label>
                <textarea
                  name="resultado"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Resultado obtenido de la acción"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Próximos Pasos</label>
                <textarea
                  name="proximos_pasos"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Acciones a realizar posteriormente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                <textarea
                  name="observaciones"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Observaciones adicionales"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="completada"
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Acción completada</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Agregar Acción
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModalAccion(false)
                    setIncidenciaSeleccionada(null)
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
