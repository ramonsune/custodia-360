'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Formacion {
  id: string
  titulo: string
  descripcion: string
  duracion_horas: number
  tipo: 'obligatoria' | 'recomendada' | 'especializada'
  categoria: 'lopivi' | 'proteccion' | 'procedimientos' | 'primeros_auxilios' | 'otros'
  vigencia_meses: number
  activa: boolean
  puntuacion_minima: number
}

interface PersonalFormacion {
  id: string
  entidad_id: string
  persona_id: string
  formacion_id: string
  fecha_inicio: string
  fecha_completada?: string
  puntuacion?: number
  estado: 'pendiente' | 'en_curso' | 'completada' | 'suspendida'
  certificado_url?: string
  instructor?: string
  observaciones?: string
  personal?: {
    nombre: string
    apellidos: string
    cargo: string
  }
  formaciones?: Formacion
}

interface GestionFormacionesProps {
  entidadId: string
}

export default function GestionFormaciones({ entidadId }: GestionFormacionesProps) {
  const [formaciones, setFormaciones] = useState<Formacion[]>([])
  const [personalFormaciones, setPersonalFormaciones] = useState<PersonalFormacion[]>([])
  const [loading, setLoading] = useState(true)
  const [vistaActiva, setVistaActiva] = useState<'catalogo' | 'asignadas' | 'estadisticas'>('catalogo')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [showModalAsignar, setShowModalAsignar] = useState(false)
  const [formacionSeleccionada, setFormacionSeleccionada] = useState<Formacion | null>(null)

  useEffect(() => {
    cargarDatos()
  }, [entidadId])

  const cargarDatos = async () => {
    try {
      setLoading(true)

      // Cargar formaciones disponibles
      const { data: formacionesData, error: formacionesError } = await supabase
        .from('formaciones')
        .select('*')
        .eq('activa', true)
        .order('categoria', { ascending: true })

      if (formacionesError) throw formacionesError
      setFormaciones(formacionesData || [])

      // Cargar formaciones asignadas al personal de la entidad
      const { data: personalFormacionesData, error: personalError } = await supabase
        .from('personal_formaciones')
        .select(`
          *,
          personal!inner(nombre, apellidos, cargo),
          formaciones!inner(titulo, categoria, tipo, duracion_horas)
        `)
        .eq('entidad_id', entidadId)
        .order('fecha_inicio', { ascending: false })

      if (personalError) throw personalError
      setPersonalFormaciones(personalFormacionesData || [])

    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const asignarFormacion = async (formacionId: string, personalData: any) => {
    try {
      const { data, error } = await supabase
        .from('personal_formaciones')
        .insert([{
          entidad_id: entidadId,
          persona_id: personalData.persona_id,
          formacion_id: formacionId,
          fecha_inicio: new Date().toISOString(),
          estado: 'pendiente',
          instructor: personalData.instructor,
          observaciones: personalData.observaciones
        }])
        .select()

      if (error) throw error

      cargarDatos() // Recargar datos
      setShowModalAsignar(false)
      setFormacionSeleccionada(null)
    } catch (error) {
      console.error('Error asignando formación:', error)
    }
  }

  const actualizarEstadoFormacion = async (id: string, nuevoEstado: string, puntuacion?: number) => {
    try {
      const updateData: any = {
        estado: nuevoEstado,
        updated_at: new Date().toISOString()
      }

      if (nuevoEstado === 'completada') {
        updateData.fecha_completada = new Date().toISOString()
        if (puntuacion) updateData.puntuacion = puntuacion
      }

      const { error } = await supabase
        .from('personal_formaciones')
        .update(updateData)
        .eq('id', id)

      if (error) throw error

      cargarDatos() // Recargar datos
    } catch (error) {
      console.error('Error actualizando estado:', error)
    }
  }

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800'
      case 'en_curso': return 'bg-blue-100 text-blue-800'
      case 'suspendida': return 'bg-red-100 text-red-800'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'obligatoria': return 'bg-red-100 text-red-800'
      case 'recomendada': return 'bg-blue-100 text-blue-800'
      case 'especializada': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calcularEstadisticas = () => {
    const total = personalFormaciones.length
    const completadas = personalFormaciones.filter(pf => pf.estado === 'completada').length
    const enCurso = personalFormaciones.filter(pf => pf.estado === 'en_curso').length
    const pendientes = personalFormaciones.filter(pf => pf.estado === 'pendiente').length

    const porCategoria = formaciones.reduce((acc, formacion) => {
      const count = personalFormaciones.filter(pf =>
        pf.formaciones?.categoria === formacion.categoria && pf.estado === 'completada'
      ).length
      acc[formacion.categoria] = count
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      completadas,
      enCurso,
      pendientes,
      porcentajeCompletado: total > 0 ? Math.round((completadas / total) * 100) : 0,
      porCategoria
    }
  }

  const formacionesFiltradas = personalFormaciones.filter(pf => {
    const filtroEstadoOk = filtroEstado === 'todos' || pf.estado === filtroEstado
    const filtroCategoriaOk = filtroCategoria === 'todas' || pf.formaciones?.categoria === filtroCategoria
    return filtroEstadoOk && filtroCategoriaOk
  })

  const estadisticas = calcularEstadisticas()

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando formaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gestión de Formaciones</h2>
            <p className="text-gray-600">Seguimiento de formaciones del personal</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setVistaActiva('catalogo')}
              className={`px-4 py-2 rounded-lg font-medium ${
                vistaActiva === 'catalogo'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={() => setVistaActiva('asignadas')}
              className={`px-4 py-2 rounded-lg font-medium ${
                vistaActiva === 'asignadas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Asignadas
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
          </div>
        </div>
      </div>

      <div className="p-6">
        {vistaActiva === 'catalogo' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Catálogo de Formaciones Disponibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formaciones.map((formacion) => (
                  <div key={formacion.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{formacion.titulo}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getColorTipo(formacion.tipo)}`}>
                        {formacion.tipo}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{formacion.descripcion}</p>

                    <div className="text-xs text-gray-500 space-y-1 mb-4">
                      <div>Duración: {formacion.duracion_horas} horas</div>
                      <div>Categoría: {formacion.categoria}</div>
                      <div>Vigencia: {formacion.vigencia_meses} meses</div>
                      <div>Puntuación mínima: {formacion.puntuacion_minima}%</div>
                    </div>

                    <button
                      onClick={() => {
                        setFormacionSeleccionada(formacion)
                        setShowModalAsignar(true)
                      }}
                      className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Asignar al Personal
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {vistaActiva === 'asignadas' && (
          <div>
            <div className="flex gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por categoría:</label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="todas">Todas</option>
                  <option value="lopivi">LOPIVI</option>
                  <option value="proteccion">Protección</option>
                  <option value="procedimientos">Procedimientos</option>
                  <option value="primeros_auxilios">Primeros Auxilios</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por estado:</label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="todos">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_curso">En Curso</option>
                  <option value="completada">Completada</option>
                  <option value="suspendida">Suspendida</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {formacionesFiltradas.map((pf) => (
                <div key={pf.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900">{pf.formaciones?.titulo}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getColorEstado(pf.estado)}`}>
                          {pf.estado}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Personal:</span><br />
                          {pf.personal?.nombre} {pf.personal?.apellidos}
                        </div>
                        <div>
                          <span className="font-medium">Cargo:</span><br />
                          {pf.personal?.cargo}
                        </div>
                        <div>
                          <span className="font-medium">Fecha inicio:</span><br />
                          {new Date(pf.fecha_inicio).toLocaleDateString()}
                        </div>
                        {pf.fecha_completada && (
                          <div>
                            <span className="font-medium">Fecha completada:</span><br />
                            {new Date(pf.fecha_completada).toLocaleDateString()}
                          </div>
                        )}
                        {pf.puntuacion && (
                          <div>
                            <span className="font-medium">Puntuación:</span><br />
                            {pf.puntuacion}%
                          </div>
                        )}
                        {pf.instructor && (
                          <div>
                            <span className="font-medium">Instructor:</span><br />
                            {pf.instructor}
                          </div>
                        )}
                      </div>

                      {pf.observaciones && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                          <span className="font-medium">Observaciones:</span> {pf.observaciones}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {pf.estado === 'pendiente' && (
                        <button
                          onClick={() => actualizarEstadoFormacion(pf.id, 'en_curso')}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Iniciar
                        </button>
                      )}
                      {pf.estado === 'en_curso' && (
                        <button
                          onClick={() => {
                            const puntuacion = prompt('Puntuación obtenida (0-100):')
                            if (puntuacion && !isNaN(Number(puntuacion))) {
                              actualizarEstadoFormacion(pf.id, 'completada', Number(puntuacion))
                            }
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Completar
                        </button>
                      )}
                      {(pf.estado === 'en_curso' || pf.estado === 'pendiente') && (
                        <button
                          onClick={() => actualizarEstadoFormacion(pf.id, 'suspendida')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Suspender
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {formacionesFiltradas.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No hay formaciones asignadas que coincidan con los filtros</p>
                </div>
              )}
            </div>
          </div>
        )}

        {vistaActiva === 'estadisticas' && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Estadísticas de Formación</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{estadisticas.total}</div>
                <div className="text-sm text-blue-700">Total Formaciones</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{estadisticas.completadas}</div>
                <div className="text-sm text-green-700">Completadas</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{estadisticas.enCurso}</div>
                <div className="text-sm text-yellow-700">En Curso</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{estadisticas.pendientes}</div>
                <div className="text-sm text-red-700">Pendientes</div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Progreso General</h4>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${estadisticas.porcentajeCompletado}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {estadisticas.porcentajeCompletado}% de las formaciones completadas
              </p>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Formaciones Completadas por Categoría</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(estadisticas.porCategoria).map(([categoria, count]) => (
                  <div key={categoria} className="border border-gray-200 rounded-lg p-3">
                    <div className="text-lg font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{categoria.replace('_', ' ')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal para asignar formación */}
      {showModalAsignar && formacionSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Asignar Formación</h3>
              <p className="text-sm text-gray-600">{formacionSeleccionada.titulo}</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                asignarFormacion(formacionSeleccionada.id, {
                  persona_id: formData.get('persona_id'),
                  instructor: formData.get('instructor'),
                  observaciones: formData.get('observaciones')
                })
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID de la persona (temporal - mejorar con selector):
                </label>
                <input
                  type="text"
                  name="persona_id"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="UUID de la persona"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor:
                </label>
                <input
                  type="text"
                  name="instructor"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Nombre del instructor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones:
                </label>
                <textarea
                  name="observaciones"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Observaciones adicionales"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Asignar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModalAsignar(false)
                    setFormacionSeleccionada(null)
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
