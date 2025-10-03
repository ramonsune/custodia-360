'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ElementoCumplimiento {
  id: string
  categoria: string
  elemento: string
  descripcion: string
  estado: 'completo' | 'pendiente' | 'en_progreso' | 'critico'
  porcentaje: number
  fechaLimite: string
  responsable: string
  acciones_pendientes: string[]
  documentos_requeridos: string[]
}

export default function CumplimientoPage() {
  const [elementos, setElementos] = useState<ElementoCumplimiento[]>([
    {
      id: 'CMP-001',
      categoria: 'Certificaciones',
      elemento: 'DBS del personal',
      descripcion: 'Verificación de antecedentes penales de todo el personal en contacto con menores',
      estado: 'critico',
      porcentaje: 60,
      fechaLimite: '2025-09-30',
      responsable: 'Delegado Principal',
      acciones_pendientes: [
        'Solicitar DBS para 3 miembros nuevos del personal',
        'Renovar DBS vencidos (2 personas)',
        'Actualizar registro central'
      ],
      documentos_requeridos: ['Formulario DBS', 'Identificación personal', 'Justificante de pago']
    },
    {
      id: 'CMP-002',
      categoria: 'Formación',
      elemento: 'Formación LOPIVI obligatoria',
      descripcion: 'Todo el personal debe completar la formación en protección infantil',
      estado: 'en_progreso',
      porcentaje: 75,
      fechaLimite: '2025-10-15',
      responsable: 'Coordinador de Formación',
      acciones_pendientes: [
        'Programar sesión para 5 personas pendientes',
        'Completar evaluaciones finales',
        'Emitir certificados'
      ],
      documentos_requeridos: ['Material formativo', 'Registro de asistencia', 'Evaluaciones']
    },
    {
      id: 'CMP-003',
      categoria: 'Protocolos',
      elemento: 'Protocolos de emergencia',
      descripcion: 'Establecimiento y comunicación de protocolos de actuación en emergencias',
      estado: 'completo',
      porcentaje: 100,
      fechaLimite: '2025-12-31',
      responsable: 'Delegado Principal',
      acciones_pendientes: [],
      documentos_requeridos: []
    },
    {
      id: 'CMP-004',
      categoria: 'Supervisión',
      elemento: 'Registro de supervisiones',
      descripcion: 'Documentación de todas las supervisiones realizadas',
      estado: 'pendiente',
      porcentaje: 25,
      fechaLimite: '2025-10-01',
      responsable: 'Delegado Suplente',
      acciones_pendientes: [
        'Crear plantilla de registro',
        'Formar al personal en uso del registro',
        'Implementar sistema digital'
      ],
      documentos_requeridos: ['Plantilla de registro', 'Manual de procedimientos']
    }
  ])

  const [elementoSeleccionado, setElementoSeleccionado] = useState<ElementoCumplimiento | null>(null)
  const [modalResolver, setModalResolver] = useState(false)
  const [planAccion, setPlanAccion] = useState('')
  const [fechaImplementacion, setFechaImplementacion] = useState('')
  const [responsableAsignado, setResponsableAsignado] = useState('')

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completo': return 'text-green-800 bg-green-100'
      case 'en_progreso': return 'text-yellow-800 bg-yellow-100'
      case 'pendiente': return 'text-blue-800 bg-blue-100'
      case 'critico': return 'text-red-800 bg-red-100'
      default: return 'text-gray-800 bg-gray-100'
    }
  }

  const getPorcentajeColor = (porcentaje: number) => {
    if (porcentaje >= 95) return 'bg-green-600'
    if (porcentaje >= 70) return 'bg-yellow-600'
    if (porcentaje >= 50) return 'bg-orange-600'
    return 'bg-red-600'
  }

  const abrirModalResolver = (elemento: ElementoCumplimiento) => {
    setElementoSeleccionado(elemento)
    setResponsableAsignado(elemento.responsable)
    setPlanAccion('')
    setFechaImplementacion('')
    setModalResolver(true)
  }

  const resolverElemento = () => {
    if (!elementoSeleccionado || !planAccion.trim() || !fechaImplementacion) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    const nuevosElementos = elementos.map(elemento => {
      if (elemento.id === elementoSeleccionado.id) {
        return {
          ...elemento,
          estado: 'en_progreso' as const,
          porcentaje: Math.min(100, elemento.porcentaje + 25),
          responsable: responsableAsignado
        }
      }
      return elemento
    })

    setElementos(nuevosElementos)
    setModalResolver(false)
    alert('Plan de acción registrado. El elemento se ha actualizado a "En Progreso"')
  }

  const calcularCumplimientoGeneral = () => {
    const total = elementos.reduce((sum, elemento) => sum + elemento.porcentaje, 0)
    return Math.round(total / elementos.length)
  }

  const contarPorEstado = (estado: string) => {
    return elementos.filter(elemento => elemento.estado === estado).length
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cumplimiento LOPIVI</h1>
              <p className="text-gray-600 mt-2">Estado general de cumplimiento normativo</p>
            </div>
            <Link
              href="/dashboard-delegado"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Volver al Dashboard
            </Link>
          </div>
        </div>

        {/* Resumen general */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">{calcularCumplimientoGeneral()}%</div>
            <div className="text-lg text-gray-600">Cumplimiento General LOPIVI</div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className={`h-4 rounded-full transition-all duration-300 ${getPorcentajeColor(calcularCumplimientoGeneral())}`}
              style={{ width: `${calcularCumplimientoGeneral()}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{contarPorEstado('completo')}</div>
              <div className="text-sm text-gray-600">Completos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{contarPorEstado('en_progreso')}</div>
              <div className="text-sm text-gray-600">En Progreso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{contarPorEstado('pendiente')}</div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{contarPorEstado('critico')}</div>
              <div className="text-sm text-gray-600">Críticos</div>
            </div>
          </div>
        </div>

        {/* Lista de elementos de cumplimiento */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Elementos de Cumplimiento</h3>

          <div className="space-y-4">
            {elementos.map((elemento) => (
              <div key={elemento.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="font-bold text-lg">{elemento.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(elemento.estado)}`}>
                        {elemento.estado.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {elemento.categoria}
                      </span>
                    </div>

                    <h4 className="font-semibold text-lg text-gray-900 mb-2">{elemento.elemento}</h4>
                    <p className="text-gray-700 mb-3">{elemento.descripcion}</p>

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Progreso</span>
                        <span className="text-sm font-bold">{elemento.porcentaje}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getPorcentajeColor(elemento.porcentaje)}`}
                          style={{ width: `${elemento.porcentaje}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Responsable:</span> {elemento.responsable}
                      </div>
                      <div>
                        <span className="font-medium">Fecha límite:</span> {elemento.fechaLimite}
                      </div>
                    </div>

                    {elemento.acciones_pendientes.length > 0 && (
                      <div className="mt-3">
                        <span className="font-medium text-sm">Acciones pendientes:</span>
                        <ul className="text-sm text-gray-600 mt-1 ml-4">
                          {elemento.acciones_pendientes.slice(0, 2).map((accion, index) => (
                            <li key={index} className="list-disc">{accion}</li>
                          ))}
                          {elemento.acciones_pendientes.length > 2 && (
                            <li className="list-disc text-blue-600">
                              +{elemento.acciones_pendientes.length - 2} más...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {elemento.estado !== 'completo' && (
                    <button
                      onClick={() => abrirModalResolver(elemento)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors ml-4"
                    >
                      Resolver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal resolver elemento */}
        {modalResolver && elementoSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Resolver: {elementoSeleccionado.elemento}</h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-lg">{elementoSeleccionado.elemento}</h4>
                <p className="text-gray-700 mt-2">{elementoSeleccionado.descripcion}</p>
                <div className="mt-3 text-sm">
                  <span className="font-medium">Estado actual:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${getEstadoColor(elementoSeleccionado.estado)}`}>
                    {elementoSeleccionado.estado.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  <span className="font-medium">Progreso actual:</span> {elementoSeleccionado.porcentaje}%
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-3">Acciones Pendientes</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {elementoSeleccionado.acciones_pendientes.length > 0 ? (
                    <ul className="space-y-2">
                      {elementoSeleccionado.acciones_pendientes.map((accion, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-600 mr-2">•</span>
                          <span className="text-sm">{accion}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-green-600 text-sm">No hay acciones pendientes</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-3">Documentos Requeridos</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {elementoSeleccionado.documentos_requeridos.length > 0 ? (
                    <ul className="space-y-2">
                      {elementoSeleccionado.documentos_requeridos.map((doc, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2"></span>
                          <span className="text-sm">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-green-600 text-sm">No se requieren documentos adicionales</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-3">Plan de Acción</h4>
                <textarea
                  value={planAccion}
                  onChange={(e) => setPlanAccion(e.target.value)}
                  placeholder="Describe detalladamente las acciones que se tomarán para resolver este elemento..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block font-bold mb-2">Responsable Asignado</label>
                  <select
                    value={responsableAsignado}
                    onChange={(e) => setResponsableAsignado(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Delegado Principal">Delegado Principal</option>
                    <option value="Delegado Suplente">Delegado Suplente</option>
                    <option value="Coordinador de Formación">Coordinador de Formación</option>
                    <option value="Director de Entidad">Director de Entidad</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-2">Fecha de Implementación</label>
                  <input
                    type="date"
                    value={fechaImplementacion}
                    onChange={(e) => setFechaImplementacion(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-green-800 mb-2">Beneficios de la Resolución</h4>
                <p className="text-sm text-green-700">
                  Resolver este elemento mejorará el cumplimiento general LOPIVI y reducirá los riesgos de incumplimiento normativo.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalResolver(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={resolverElemento}
                  disabled={!planAccion.trim() || !fechaImplementacion}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  Crear Plan de Acción
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
