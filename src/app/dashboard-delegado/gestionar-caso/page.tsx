'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Caso {
  id: string
  tipo: string
  descripcion: string
  prioridad: 'alta' | 'media' | 'baja' | 'critica'
  estado: 'abierto' | 'en_investigacion' | 'resuelto' | 'archivado'
  fechaCreacion: string
  fechaActualizacion: string
  involucrados: string
  acciones: string[]
  documentos: string[]
  responsable: string
}

export default function GestionarCasoPage() {
  const router = useRouter()
  const [casos, setCasos] = useState<Caso[]>([
    {
      id: 'CASO-001',
      tipo: 'Protocolo de seguridad',
      descripcion: 'Menor reporta situación inadecuada en actividad deportiva',
      prioridad: 'alta',
      estado: 'en_investigacion',
      fechaCreacion: '2025-09-20',
      fechaActualizacion: '2025-09-23',
      involucrados: 'Menor (8 años), Monitor deportivo, Padres',
      acciones: [
        'Entrevista inicial con el menor',
        'Comunicación inmediata con padres',
        'Suspensión temporal del monitor',
        'Investigación interna iniciada'
      ],
      documentos: ['Declaración inicial', 'Protocolo activado', 'Comunicación familias'],
      responsable: 'Delegado Principal'
    },
    {
      id: 'CASO-002',
      tipo: 'Incidente menor',
      descripcion: 'Comportamiento inapropiado entre menores durante actividad',
      prioridad: 'media',
      estado: 'abierto',
      fechaCreacion: '2025-09-22',
      fechaActualizacion: '2025-09-22',
      involucrados: 'Dos menores (10 y 11 años), Coordinador actividad',
      acciones: [
        'Registro del incidente',
        'Separación temporal de los menores',
        'Pendiente: reunión con familias'
      ],
      documentos: ['Registro de incidente'],
      responsable: 'Delegado Suplente'
    }
  ])

  const [casoSeleccionado, setCasoSeleccionado] = useState<Caso | null>(null)
  const [modalDetalle, setModalDetalle] = useState(false)
  const [nuevaAccion, setNuevaAccion] = useState('')
  const [nuevoEstado, setNuevoEstado] = useState('')

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-200'
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'baja': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'abierto': return 'bg-blue-100 text-blue-800'
      case 'en_investigacion': return 'bg-yellow-100 text-yellow-800'
      case 'resuelto': return 'bg-green-100 text-green-800'
      case 'archivado': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const abrirDetalleCaso = (caso: Caso) => {
    setCasoSeleccionado(caso)
    setNuevoEstado(caso.estado)
    setModalDetalle(true)
  }

  const agregarAccion = () => {
    if (!nuevaAccion.trim() || !casoSeleccionado) return

    const casosActualizados = casos.map(caso => {
      if (caso.id === casoSeleccionado.id) {
        return {
          ...caso,
          acciones: [...caso.acciones, nuevaAccion],
          fechaActualizacion: new Date().toISOString().split('T')[0]
        }
      }
      return caso
    })

    setCasos(casosActualizados)
    setCasoSeleccionado({
      ...casoSeleccionado,
      acciones: [...casoSeleccionado.acciones, nuevaAccion]
    })
    setNuevaAccion('')
    alert('Acción agregada al caso')
  }

  const actualizarEstado = () => {
    if (!casoSeleccionado) return

    const casosActualizados = casos.map(caso => {
      if (caso.id === casoSeleccionado.id) {
        return {
          ...caso,
          estado: nuevoEstado as any,
          fechaActualizacion: new Date().toISOString().split('T')[0]
        }
      }
      return caso
    })

    setCasos(casosActualizados)
    alert(`Estado del caso actualizado a: ${nuevoEstado.replace('_', ' ').toUpperCase()}`)
    setModalDetalle(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestionar Casos Activos</h1>
              <p className="text-gray-600 mt-2">Panel de gestión integral de casos LOPIVI</p>
            </div>
            <Link
              href="/dashboard-delegado"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Volver al Dashboard
            </Link>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-red-600">{casos.filter(c => c.prioridad === 'critica' || c.prioridad === 'alta').length}</div>
            <div className="text-sm text-gray-600">Casos Prioritarios</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-yellow-600">{casos.filter(c => c.estado === 'en_investigacion').length}</div>
            <div className="text-sm text-gray-600">En Investigación</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-blue-600">{casos.filter(c => c.estado === 'abierto').length}</div>
            <div className="text-sm text-gray-600">Casos Abiertos</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-green-600">{casos.filter(c => c.estado === 'resuelto').length}</div>
            <div className="text-sm text-gray-600">Casos Resueltos</div>
          </div>
        </div>

        {/* Lista de casos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Casos Activos</h3>

          <div className="space-y-4">
            {casos.map((caso) => (
              <div key={caso.id} className={`border rounded-lg p-4 ${getPrioridadColor(caso.prioridad)}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-bold text-lg">{caso.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPrioridadColor(caso.prioridad)}`}>
                        {caso.prioridad.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(caso.estado)}`}>
                        {caso.estado.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-2">{caso.tipo}</h4>
                    <p className="text-gray-700 mb-3">{caso.descripcion}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Involucrados:</span> {caso.involucrados}
                      </div>
                      <div>
                        <span className="font-medium">Responsable:</span> {caso.responsable}
                      </div>
                      <div>
                        <span className="font-medium">Creado:</span> {caso.fechaCreacion}
                      </div>
                      <div>
                        <span className="font-medium">Actualizado:</span> {caso.fechaActualizacion}
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="font-medium text-sm">Últimas acciones:</span>
                      <ul className="text-sm text-gray-600 mt-1 ml-4">
                        {caso.acciones.slice(-2).map((accion, index) => (
                          <li key={index} className="list-disc">{accion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => abrirDetalleCaso(caso)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-4"
                  >
                    Gestionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal detalle del caso */}
        {modalDetalle && casoSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Gestionar Caso: {casoSeleccionado.id}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-bold mb-3">Información del Caso</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Tipo:</strong> {casoSeleccionado.tipo}</p>
                    <p><strong>Descripción:</strong> {casoSeleccionado.descripcion}</p>
                    <p><strong>Involucrados:</strong> {casoSeleccionado.involucrados}</p>
                    <p><strong>Responsable:</strong> {casoSeleccionado.responsable}</p>
                    <p><strong>Creado:</strong> {casoSeleccionado.fechaCreacion}</p>
                    <p><strong>Última actualización:</strong> {casoSeleccionado.fechaActualizacion}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Actualizar Estado</h4>
                  <select
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                  >
                    <option value="abierto">Abierto</option>
                    <option value="en_investigacion">En Investigación</option>
                    <option value="resuelto">Resuelto</option>
                    <option value="archivado">Archivado</option>
                  </select>
                  <button
                    onClick={actualizarEstado}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Actualizar Estado
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-3">Historial de Acciones</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                  {casoSeleccionado.acciones.map((accion, index) => (
                    <div key={index} className="text-sm py-1 border-b border-gray-200 last:border-b-0">
                      • {accion}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-3">Agregar Nueva Acción</h4>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={nuevaAccion}
                    onChange={(e) => setNuevaAccion(e.target.value)}
                    placeholder="Describe la acción realizada..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <button
                    onClick={agregarAccion}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-3">Documentos del Caso</h4>
                <div className="space-y-2">
                  {casoSeleccionado.documentos.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm">{doc}</span>
                      <button className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs hover:bg-green-200">
                        Descargar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalDetalle(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cerrar
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Generar Informe
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
