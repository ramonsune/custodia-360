'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Recordatorio {
  id: string
  titulo: string
  descripcion: string
  tipo: 'certificacion' | 'formacion' | 'supervision' | 'protocolo' | 'general'
  prioridad: 'alta' | 'media' | 'baja'
  fechaCreacion: string
  fechaVencimiento: string
  responsable: string
  estado: 'pendiente' | 'completado' | 'vencido'
  acciones_requeridas: string[]
  notificaciones_enviadas: number
}

export default function RecordatoriosPage() {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([
    {
      id: 'REC-001',
      titulo: 'Renovación DBS - Juan Pérez',
      descripcion: 'El certificado DBS del monitor Juan Pérez vence en 3 días',
      tipo: 'certificacion',
      prioridad: 'alta',
      fechaCreacion: '2025-09-15',
      fechaVencimiento: '2025-09-26',
      responsable: 'Juan Pérez',
      estado: 'pendiente',
      acciones_requeridas: [
        'Solicitar renovación DBS',
        'Completar formulario online',
        'Pagar tasas correspondientes',
        'Suspender actividades hasta renovación'
      ],
      notificaciones_enviadas: 3
    },
    {
      id: 'REC-002',
      titulo: 'Formación LOPIVI - Personal nuevo',
      descripcion: 'Programar sesión de formación para 5 miembros nuevos del personal',
      tipo: 'formacion',
      prioridad: 'media',
      fechaCreacion: '2025-09-18',
      fechaVencimiento: '2025-10-05',
      responsable: 'Coordinador de Formación',
      estado: 'pendiente',
      acciones_requeridas: [
        'Reservar aula de formación',
        'Preparar material formativo',
        'Enviar convocatorias',
        'Programar evaluación final'
      ],
      notificaciones_enviadas: 1
    },
    {
      id: 'REC-003',
      titulo: 'Supervisión mensual - Actividades deportivas',
      descripcion: 'Realizar supervisión mensual de las actividades deportivas',
      tipo: 'supervision',
      prioridad: 'media',
      fechaCreacion: '2025-09-01',
      fechaVencimiento: '2025-09-30',
      responsable: 'Delegado Principal',
      estado: 'pendiente',
      acciones_requeridas: [
        'Planificar visitas sorpresa',
        'Completar formulario de supervisión',
        'Revisar protocolos de seguridad',
        'Documentar observaciones'
      ],
      notificaciones_enviadas: 2
    },
    {
      id: 'REC-004',
      titulo: 'Actualización protocolo emergencias',
      descripcion: 'Revisar y actualizar el protocolo de emergencias trimestral',
      tipo: 'protocolo',
      prioridad: 'baja',
      fechaCreacion: '2025-09-10',
      fechaVencimiento: '2025-10-31',
      responsable: 'Delegado Suplente',
      estado: 'completado',
      acciones_requeridas: [],
      notificaciones_enviadas: 0
    }
  ])

  const [recordatorioSeleccionado, setRecordatorioSeleccionado] = useState<Recordatorio | null>(null)
  const [modalCompletar, setModalCompletar] = useState(false)
  const [notasCompletado, setNotasCompletado] = useState('')
  const [evidenciaAdjunta, setEvidenciaAdjunta] = useState('')

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'certificacion': return 'bg-red-100 text-red-800'
      case 'formacion': return 'bg-blue-100 text-blue-800'
      case 'supervision': return 'bg-yellow-100 text-yellow-800'
      case 'protocolo': return 'bg-purple-100 text-purple-800'
      case 'general': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200'
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'baja': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'completado': return 'bg-green-100 text-green-800'
      case 'vencido': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDiasRestantes = (fechaVencimiento: string) => {
    const hoy = new Date()
    const vencimiento = new Date(fechaVencimiento)
    const diferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24))
    return diferencia
  }

  const abrirModalCompletar = (recordatorio: Recordatorio) => {
    setRecordatorioSeleccionado(recordatorio)
    setNotasCompletado('')
    setEvidenciaAdjunta('')
    setModalCompletar(true)
  }

  const marcarCompletado = () => {
    if (!recordatorioSeleccionado || !notasCompletado.trim()) {
      alert('Por favor completa las notas de completado')
      return
    }

    const nuevosRecordatorios = recordatorios.map(recordatorio => {
      if (recordatorio.id === recordatorioSeleccionado.id) {
        return {
          ...recordatorio,
          estado: 'completado' as const,
          acciones_requeridas: []
        }
      }
      return recordatorio
    })

    setRecordatorios(nuevosRecordatorios)
    setModalCompletar(false)
    alert('Recordatorio marcado como completado')
  }

  const enviarRecordatorio = (recordatorio: Recordatorio) => {
    const nuevosRecordatorios = recordatorios.map(r => {
      if (r.id === recordatorio.id) {
        return {
          ...r,
          notificaciones_enviadas: r.notificaciones_enviadas + 1
        }
      }
      return r
    })

    setRecordatorios(nuevosRecordatorios)
    alert(`Recordatorio enviado a ${recordatorio.responsable}`)
  }

  const filtrarPorEstado = (estado: string) => {
    return recordatorios.filter(r => r.estado === estado)
  }

  const contarPorPrioridad = (prioridad: string) => {
    return recordatorios.filter(r => r.prioridad === prioridad && r.estado === 'pendiente').length
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestionar Recordatorios</h1>
              <p className="text-gray-600 mt-2">Sistema de gestión de recordatorios y seguimiento LOPIVI</p>
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
            <div className="text-2xl font-bold text-red-600">{contarPorPrioridad('alta')}</div>
            <div className="text-sm text-gray-600">Prioridad Alta</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-yellow-600">{filtrarPorEstado('pendiente').length}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-green-600">{filtrarPorEstado('completado').length}</div>
            <div className="text-sm text-gray-600">Completados</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-red-600">{recordatorios.filter(r => getDiasRestantes(r.fechaVencimiento) <= 3 && r.estado === 'pendiente').length}</div>
            <div className="text-sm text-gray-600">Vencen Pronto</div>
          </div>
        </div>

        {/* Lista de recordatorios */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recordatorios Activos</h3>

          <div className="space-y-4">
            {recordatorios.filter(r => r.estado !== 'completado').map((recordatorio) => {
              const diasRestantes = getDiasRestantes(recordatorio.fechaVencimiento)
              return (
                <div key={recordatorio.id} className={`border rounded-lg p-4 ${getPrioridadColor(recordatorio.prioridad)}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="font-bold text-lg">{recordatorio.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoColor(recordatorio.tipo)}`}>
                          {recordatorio.tipo.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPrioridadColor(recordatorio.prioridad)}`}>
                          {recordatorio.prioridad.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          diasRestantes <= 0 ? 'bg-red-100 text-red-800' :
                          diasRestantes <= 3 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {diasRestantes <= 0 ? 'VENCIDO' : `${diasRestantes} días`}
                        </span>
                      </div>

                      <h4 className="font-semibold text-lg text-gray-900 mb-2">{recordatorio.titulo}</h4>
                      <p className="text-gray-700 mb-3">{recordatorio.descripcion}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="font-medium">Responsable:</span> {recordatorio.responsable}
                        </div>
                        <div>
                          <span className="font-medium">Vencimiento:</span> {recordatorio.fechaVencimiento}
                        </div>
                        <div>
                          <span className="font-medium">Notificaciones:</span> {recordatorio.notificaciones_enviadas}
                        </div>
                      </div>

                      {recordatorio.acciones_requeridas.length > 0 && (
                        <div className="mt-3">
                          <span className="font-medium text-sm">Acciones requeridas:</span>
                          <ul className="text-sm text-gray-600 mt-1 ml-4">
                            {recordatorio.acciones_requeridas.slice(0, 2).map((accion, index) => (
                              <li key={index} className="list-disc">{accion}</li>
                            ))}
                            {recordatorio.acciones_requeridas.length > 2 && (
                              <li className="list-disc text-blue-600">
                                +{recordatorio.acciones_requeridas.length - 2} más...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => abrirModalCompletar(recordatorio)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Marcar Completado
                      </button>
                      <button
                        onClick={() => enviarRecordatorio(recordatorio)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Enviar Recordatorio
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recordatorios completados */}
          {filtrarPorEstado('completado').length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recordatorios Completados Recientemente</h3>
              <div className="space-y-2">
                {filtrarPorEstado('completado').map((recordatorio) => (
                  <div key={recordatorio.id} className="border border-green-200 bg-green-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{recordatorio.id}</span> - {recordatorio.titulo}
                      </div>
                      <span className="text-xs text-green-600">COMPLETADO</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal marcar completado */}
        {modalCompletar && recordatorioSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Marcar como Completado: {recordatorioSeleccionado.id}</h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-lg">{recordatorioSeleccionado.titulo}</h4>
                <p className="text-gray-700 mt-2">{recordatorioSeleccionado.descripcion}</p>
                <div className="mt-3 text-sm">
                  <span className="font-medium">Responsable:</span> {recordatorioSeleccionado.responsable}
                </div>
                <div className="mt-1 text-sm">
                  <span className="font-medium">Fecha límite:</span> {recordatorioSeleccionado.fechaVencimiento}
                </div>
              </div>

              {recordatorioSeleccionado.acciones_requeridas.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold mb-3">Acciones que se Completaron</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {recordatorioSeleccionado.acciones_requeridas.map((accion, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span className="text-sm">{accion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-bold mb-3">Notas de Completado *</h4>
                <textarea
                  value={notasCompletado}
                  onChange={(e) => setNotasCompletado(e.target.value)}
                  placeholder="Describe cómo se completó el recordatorio, qué acciones se tomaron, resultados obtenidos..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
                  required
                />
              </div>

              <div className="mb-6">
                <h4 className="font-bold mb-3">Evidencia/Documentación (Opcional)</h4>
                <input
                  type="text"
                  value={evidenciaAdjunta}
                  onChange={(e) => setEvidenciaAdjunta(e.target.value)}
                  placeholder="Referencias a documentos, archivos, o evidencias..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-green-800 mb-2">Efecto del Completado</h4>
                <p className="text-sm text-green-700">
                  Al marcar este recordatorio como completado mejorarás el índice de cumplimiento LOPIVI y se actualizará automáticamente el registro de auditoría.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalCompletar(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={marcarCompletado}
                  disabled={!notasCompletado.trim()}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  Marcar Completado
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
