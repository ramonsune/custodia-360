'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Persona {
  id: string
  entidad_id: string
  nombre: string
  apellidos: string
  email?: string
  telefono?: string
  dni?: string
  cargo: string
  departamento?: string
  fecha_alta: string
  fecha_baja?: string
  estado: 'activo' | 'inactivo' | 'suspendido' | 'baja'
  contacto_emergencia_nombre?: string
  contacto_emergencia_telefono?: string
  observaciones?: string
}

interface Certificacion {
  id: string
  persona_id: string
  tipo: 'certificado_negativo' | 'formacion_lopivi' | 'primeros_auxilios' | 'otros'
  nombre_certificacion: string
  numero_certificado?: string
  fecha_emision?: string
  fecha_vencimiento?: string
  estado: 'vigente' | 'proximo_vencer' | 'vencido' | 'renovado'
  archivo_url?: string
  entidad_emisora?: string
  observaciones?: string
}

interface PersonaConCertificaciones extends Persona {
  certificaciones: Certificacion[]
}

interface RegistroPersonalProps {
  entidadId: string
}

export default function RegistroPersonal({ entidadId }: RegistroPersonalProps) {
  const [personal, setPersonal] = useState<PersonaConCertificaciones[]>([])
  const [loading, setLoading] = useState(true)
  const [vistaActiva, setVistaActiva] = useState<'lista' | 'estadisticas' | 'vencimientos'>('lista')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroCargo, setFiltroCargo] = useState<string>('todos')
  const [showModalPersona, setShowModalPersona] = useState(false)
  const [showModalCertificacion, setShowModalCertificacion] = useState(false)
  const [personaSeleccionada, setPersonaSeleccionada] = useState<Persona | null>(null)
  const [modoEdicion, setModoEdicion] = useState<'crear' | 'editar'>('crear')

  useEffect(() => {
    cargarPersonal()
  }, [entidadId])

  const cargarPersonal = async () => {
    try {
      setLoading(true)

      // Cargar personal con sus certificaciones
      const { data: personalData, error: personalError } = await supabase
        .from('personal')
        .select(`
          *,
          certificaciones (*)
        `)
        .eq('entidad_id', entidadId)
        .order('nombre', { ascending: true })

      if (personalError) throw personalError
      setPersonal(personalData || [])

    } catch (error) {
      console.error('Error cargando personal:', error)
    } finally {
      setLoading(false)
    }
  }

  const crearPersona = async (datos: Partial<Persona>) => {
    try {
      const { data, error } = await supabase
        .from('personal')
        .insert([{
          entidad_id: entidadId,
          ...datos
        }])
        .select()

      if (error) throw error

      cargarPersonal() // Recargar datos
      setShowModalPersona(false)
    } catch (error) {
      console.error('Error creando persona:', error)
    }
  }

  const actualizarPersona = async (id: string, datos: Partial<Persona>) => {
    try {
      const { error } = await supabase
        .from('personal')
        .update({
          ...datos,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      cargarPersonal() // Recargar datos
      setShowModalPersona(false)
      setPersonaSeleccionada(null)
    } catch (error) {
      console.error('Error actualizando persona:', error)
    }
  }

  const crearCertificacion = async (datos: Partial<Certificacion>) => {
    try {
      const { data, error } = await supabase
        .from('certificaciones')
        .insert([datos])
        .select()

      if (error) throw error

      cargarPersonal() // Recargar datos
      setShowModalCertificacion(false)
      setPersonaSeleccionada(null)
    } catch (error) {
      console.error('Error creando certificación:', error)
    }
  }

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'inactivo': return 'bg-yellow-100 text-yellow-800'
      case 'suspendido': return 'bg-red-100 text-red-800'
      case 'baja': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getColorCertificacion = (estado: string) => {
    switch (estado) {
      case 'vigente': return 'bg-green-100 text-green-800'
      case 'proximo_vencer': return 'bg-yellow-100 text-yellow-800'
      case 'vencido': return 'bg-red-100 text-red-800'
      case 'renovado': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calcularEstadisticas = () => {
    const totalPersonal = personal.length
    const personalActivo = personal.filter(p => p.estado === 'activo').length
    const totalCertificaciones = personal.reduce((acc, p) => acc + p.certificaciones.length, 0)
    const certificacionesVigentes = personal.reduce((acc, p) =>
      acc + p.certificaciones.filter(c => c.estado === 'vigente').length, 0
    )
    const certificacionesVencidas = personal.reduce((acc, p) =>
      acc + p.certificaciones.filter(c => c.estado === 'vencido').length, 0
    )
    const proximasVencer = personal.reduce((acc, p) =>
      acc + p.certificaciones.filter(c => c.estado === 'proximo_vencer').length, 0
    )

    const porCargo = personal.reduce((acc, persona) => {
      acc[persona.cargo] = (acc[persona.cargo] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalPersonal,
      personalActivo,
      totalCertificaciones,
      certificacionesVigentes,
      certificacionesVencidas,
      proximasVencer,
      porcentajeCumplimiento: totalCertificaciones > 0 ? Math.round((certificacionesVigentes / totalCertificaciones) * 100) : 0,
      porCargo
    }
  }

  const obtenerVencimientos = () => {
    const certificacionesConVencimiento = personal.flatMap(persona =>
      persona.certificaciones
        .filter(cert => cert.fecha_vencimiento)
        .map(cert => ({
          ...cert,
          persona_nombre: `${persona.nombre} ${persona.apellidos}`,
          persona_cargo: persona.cargo,
          dias_hasta_vencimiento: cert.fecha_vencimiento ?
            Math.ceil((new Date(cert.fecha_vencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
        }))
    )

    return certificacionesConVencimiento
      .sort((a, b) => a.dias_hasta_vencimiento - b.dias_hasta_vencimiento)
  }

  const personalFiltrado = personal.filter(persona => {
    const filtroEstadoOk = filtroEstado === 'todos' || persona.estado === filtroEstado
    const filtroCargoOk = filtroCargo === 'todos' || persona.cargo === filtroCargo
    return filtroEstadoOk && filtroCargoOk
  })

  const estadisticas = calcularEstadisticas()
  const vencimientos = obtenerVencimientos()

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Cargando personal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Registro del Personal</h2>
            <p className="text-gray-600">Gestión de personal y certificaciones</p>
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
              Lista Personal
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
              onClick={() => setVistaActiva('vencimientos')}
              className={`px-4 py-2 rounded-lg font-medium ${
                vistaActiva === 'vencimientos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vencimientos
            </button>
            <button
              onClick={() => {
                setPersonaSeleccionada(null)
                setModoEdicion('crear')
                setShowModalPersona(true)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Agregar Personal
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {vistaActiva === 'lista' && (
          <div>
            <div className="flex gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por estado:</label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="todos">Todos</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="suspendido">Suspendido</option>
                  <option value="baja">Baja</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por cargo:</label>
                <select
                  value={filtroCargo}
                  onChange={(e) => setFiltroCargo(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="todos">Todos</option>
                  {Array.from(new Set(personal.map(p => p.cargo))).map(cargo => (
                    <option key={cargo} value={cargo}>{cargo}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {personalFiltrado.map((persona) => (
                <div key={persona.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          {persona.nombre} {persona.apellidos}
                        </h3>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${getColorEstado(persona.estado)}`}>
                          {persona.estado}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="font-medium text-gray-700">Cargo:</span><br />
                          {persona.cargo}
                        </div>
                        {persona.departamento && (
                          <div>
                            <span className="font-medium text-gray-700">Departamento:</span><br />
                            {persona.departamento}
                          </div>
                        )}
                        {persona.email && (
                          <div>
                            <span className="font-medium text-gray-700">Email:</span><br />
                            {persona.email}
                          </div>
                        )}
                        {persona.telefono && (
                          <div>
                            <span className="font-medium text-gray-700">Teléfono:</span><br />
                            {persona.telefono}
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-700">Fecha alta:</span><br />
                          {new Date(persona.fecha_alta).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Certificaciones */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Certificaciones ({persona.certificaciones.length})
                        </h4>
                        {persona.certificaciones.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {persona.certificaciones.map((cert) => (
                              <div key={cert.id} className="bg-gray-50 border border-gray-200 rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">{cert.nombre_certificacion}</span>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${getColorCertificacion(cert.estado)}`}>
                                    {cert.estado}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600">
                                  {cert.fecha_vencimiento && (
                                    <div>Vence: {new Date(cert.fecha_vencimiento).toLocaleDateString()}</div>
                                  )}
                                  {cert.entidad_emisora && (
                                    <div>Emisor: {cert.entidad_emisora}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">Sin certificaciones registradas</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => {
                          setPersonaSeleccionada(persona)
                          setModoEdicion('editar')
                          setShowModalPersona(true)
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setPersonaSeleccionada(persona)
                          setShowModalCertificacion(true)
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        + Certificación
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {personalFiltrado.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No hay personal que coincida con los filtros</p>
                </div>
              )}
            </div>
          </div>
        )}

        {vistaActiva === 'estadisticas' && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Estadísticas del Personal</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{estadisticas.totalPersonal}</div>
                <div className="text-sm text-blue-700">Total Personal</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{estadisticas.personalActivo}</div>
                <div className="text-sm text-green-700">Personal Activo</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{estadisticas.certificacionesVigentes}</div>
                <div className="text-sm text-yellow-700">Certificaciones Vigentes</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{estadisticas.certificacionesVencidas}</div>
                <div className="text-sm text-red-700">Certificaciones Vencidas</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Cumplimiento de Certificaciones</h4>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${estadisticas.porcentajeCumplimiento}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {estadisticas.porcentajeCumplimiento}% de certificaciones vigentes
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Personal por Cargo</h4>
                <div className="space-y-2">
                  {Object.entries(estadisticas.porCargo).map(([cargo, count]) => (
                    <div key={cargo} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{cargo}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {vistaActiva === 'vencimientos' && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Próximos Vencimientos</h3>

            <div className="space-y-3">
              {vencimientos.map((cert) => (
                <div key={cert.id} className={`border rounded-lg p-4 ${
                  cert.dias_hasta_vencimiento < 0 ? 'border-red-300 bg-red-50' :
                  cert.dias_hasta_vencimiento <= 30 ? 'border-yellow-300 bg-yellow-50' :
                  'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{cert.nombre_certificacion}</h4>
                      <p className="text-sm text-gray-600">
                        {cert.persona_nombre} - {cert.persona_cargo}
                      </p>
                      <div className="text-sm text-gray-500 mt-1">
                        Vence: {cert.fecha_vencimiento ? new Date(cert.fecha_vencimiento).toLocaleDateString() : 'No especificado'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        cert.dias_hasta_vencimiento < 0 ? 'text-red-600' :
                        cert.dias_hasta_vencimiento <= 30 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {cert.dias_hasta_vencimiento < 0 ?
                          `${Math.abs(cert.dias_hasta_vencimiento)} días vencido` :
                          `${cert.dias_hasta_vencimiento} días`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {cert.dias_hasta_vencimiento < 0 ? 'VENCIDO' : 'para vencer'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {vencimientos.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No hay certificaciones con fechas de vencimiento registradas</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal para crear/editar persona */}
      {showModalPersona && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {modoEdicion === 'crear' ? 'Agregar Personal' : 'Editar Personal'}
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const datos = {
                  nombre: formData.get('nombre') as string,
                  apellidos: formData.get('apellidos') as string,
                  email: formData.get('email') as string || undefined,
                  telefono: formData.get('telefono') as string || undefined,
                  dni: formData.get('dni') as string || undefined,
                  cargo: formData.get('cargo') as string,
                  departamento: formData.get('departamento') as string || undefined,
                  estado: formData.get('estado') as string,
                  contacto_emergencia_nombre: formData.get('contacto_emergencia_nombre') as string || undefined,
                  contacto_emergencia_telefono: formData.get('contacto_emergencia_telefono') as string || undefined,
                  observaciones: formData.get('observaciones') as string || undefined,
                }

                if (modoEdicion === 'crear') {
                  crearPersona(datos)
                } else if (personaSeleccionada) {
                  actualizarPersona(personaSeleccionada.id, datos)
                }
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    defaultValue={personaSeleccionada?.nombre || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    required
                    defaultValue={personaSeleccionada?.apellidos || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={personaSeleccionada?.email || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    defaultValue={personaSeleccionada?.telefono || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                  <input
                    type="text"
                    name="dni"
                    defaultValue={personaSeleccionada?.dni || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cargo *</label>
                  <input
                    type="text"
                    name="cargo"
                    required
                    defaultValue={personaSeleccionada?.cargo || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                  <input
                    type="text"
                    name="departamento"
                    defaultValue={personaSeleccionada?.departamento || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                  <select
                    name="estado"
                    required
                    defaultValue={personaSeleccionada?.estado || 'activo'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="suspendido">Suspendido</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contacto Emergencia - Nombre</label>
                  <input
                    type="text"
                    name="contacto_emergencia_nombre"
                    defaultValue={personaSeleccionada?.contacto_emergencia_nombre || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contacto Emergencia - Teléfono</label>
                  <input
                    type="tel"
                    name="contacto_emergencia_telefono"
                    defaultValue={personaSeleccionada?.contacto_emergencia_telefono || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                <textarea
                  name="observaciones"
                  rows={3}
                  defaultValue={personaSeleccionada?.observaciones || ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
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
                    setShowModalPersona(false)
                    setPersonaSeleccionada(null)
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

      {/* Modal para agregar certificación */}
      {showModalCertificacion && personaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Agregar Certificación</h3>
              <p className="text-sm text-gray-600">
                {personaSeleccionada.nombre} {personaSeleccionada.apellidos}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                crearCertificacion({
                  persona_id: personaSeleccionada.id,
                  tipo: formData.get('tipo') as any,
                  nombre_certificacion: formData.get('nombre_certificacion') as string,
                  numero_certificado: formData.get('numero_certificado') as string || undefined,
                  fecha_emision: formData.get('fecha_emision') as string || undefined,
                  fecha_vencimiento: formData.get('fecha_vencimiento') as string || undefined,
                  entidad_emisora: formData.get('entidad_emisora') as string || undefined,
                  observaciones: formData.get('observaciones') as string || undefined,
                })
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                <select
                  name="tipo"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="certificado_negativo">Certificado Negativo</option>
                  <option value="formacion_lopivi">Formación LOPIVI</option>
                  <option value="primeros_auxilios">Primeros Auxilios</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Certificación *</label>
                <input
                  type="text"
                  name="nombre_certificacion"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Ej: Certificado Negativo de Delitos Sexuales"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de Certificado</label>
                <input
                  type="text"
                  name="numero_certificado"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Emisión</label>
                  <input
                    type="date"
                    name="fecha_emision"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Vencimiento</label>
                  <input
                    type="date"
                    name="fecha_vencimiento"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Entidad Emisora</label>
                <input
                  type="text"
                  name="entidad_emisora"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Ej: Ministerio de Justicia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                <textarea
                  name="observaciones"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModalCertificacion(false)
                    setPersonaSeleccionada(null)
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
