'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PanelSuplente() {
  const [loading, setLoading] = useState(true)
  const [usuario, setUsuario] = useState<any>(null)
  const [modalIncidencia, setModalIncidencia] = useState(false)
  const [modalProtocolo, setModalProtocolo] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay usuario logueado
    const usuarioData = localStorage.getItem('usuario_custodia360')
    if (!usuarioData) {
      router.push('/acceso')
      return
    }

    const user = JSON.parse(usuarioData)
    if (user.tipo !== 'suplente' || !user.formado) {
      router.push('/acceso')
      return
    }

    setUsuario(user)
    setLoading(false)
  }, [router])

  const cerrarSesion = () => {
    localStorage.removeItem('usuario_custodia360')
    router.push('/acceso')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const incidencias = [
    { id: 1, tipo: 'Alerta', descripcion: 'Comportamiento inapropiado detectado', estado: 'Pendiente', fecha: '2024-12-05', prioridad: 'Alta' },
    { id: 2, tipo: 'Seguimiento', descripcion: 'Revisión rutinaria mensual', estado: 'En progreso', fecha: '2024-12-03', prioridad: 'Media' },
    { id: 3, tipo: 'Formación', descripcion: 'Actualización de protocolos', estado: 'Completado', fecha: '2024-12-01', prioridad: 'Baja' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel del Suplente</h1>
                <p className="text-gray-600">{usuario?.entidad} - {usuario?.nombre}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                Suplente Certificado
              </span>
              <button
                onClick={cerrarSesion}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Alerta de Emergencia */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-red-600 text-xl">🚨</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900">Protocolo de Emergencia</h3>
                <p className="text-red-700">En caso de emergencia, contacta inmediatamente: 112 | Custodia360: 900 123 456</p>
              </div>
            </div>
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold">
              EMERGENCIA
            </button>
          </div>
        </div>

        {/* Métricas del Suplente */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 text-xl">📋</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{incidencias.length}</div>
            <div className="text-sm text-gray-600">Incidencias Totales</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 text-xl">⏰</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {incidencias.filter(i => i.estado === 'Pendiente').length}
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {incidencias.filter(i => i.estado === 'Completado').length}
            </div>
            <div className="text-sm text-gray-600">Resueltas</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 text-xl">🏆</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">98%</div>
            <div className="text-sm text-gray-600">Cumplimiento</div>
          </div>
        </div>

        {/* Gestión de Incidencias */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Gestión de Incidencias</h3>
            <button
              onClick={() => setModalIncidencia(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              + Reportar Incidencia
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Descripción</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Prioridad</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {incidencias.map((incidencia) => (
                  <tr key={incidencia.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        incidencia.tipo === 'Alerta' ? 'bg-red-100 text-red-800' :
                        incidencia.tipo === 'Seguimiento' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {incidencia.tipo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{incidencia.descripcion}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        incidencia.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                        incidencia.estado === 'En progreso' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {incidencia.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        incidencia.prioridad === 'Alta' ? 'bg-red-100 text-red-800' :
                        incidencia.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {incidencia.prioridad}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{incidencia.fecha}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Ver</button>
                        <button className="text-green-600 hover:text-green-800 text-sm">Editar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Herramientas y Protocolos */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Protocolos de Actuación</h3>
            <div className="space-y-3">
              <button
                onClick={() => setModalProtocolo(true)}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Protocolo de Maltrato</div>
                    <div className="text-sm text-gray-500">Pasos a seguir ante sospecha de maltrato</div>
                  </div>
                  <span className="text-red-600">🚨</span>
                </div>
              </button>

              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Protocolo de Bullying</div>
                    <div className="text-sm text-gray-500">Actuación ante casos de acoso</div>
                  </div>
                  <span className="text-orange-600">⚠️</span>
                </div>
              </button>

              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Protocolo de Comunicación</div>
                    <div className="text-sm text-gray-500">Canales oficiales de comunicación</div>
                  </div>
                  <span className="text-blue-600">💬</span>
                </div>
              </button>

              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Protocolo de Seguimiento</div>
                    <div className="text-sm text-gray-500">Revisiones periódicas y evaluaciones</div>
                  </div>
                  <span className="text-green-600">📊</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Documentos y Formularios</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Formulario de Incidencia</div>
                    <div className="text-sm text-gray-500">Reporte detallado de situaciones</div>
                  </div>
                  <span className="text-blue-600">📄</span>
                </div>
              </button>

              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Registro de Seguimiento</div>
                    <div className="text-sm text-gray-500">Control de casos en proceso</div>
                  </div>
                  <span className="text-green-600">📋</span>
                </div>
              </button>

              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Informe Mensual</div>
                    <div className="text-sm text-gray-500">Reporte de actividades del mes</div>
                  </div>
                  <span className="text-purple-600">📊</span>
                </div>
              </button>

              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Manual de Procedimientos</div>
                    <div className="text-sm text-gray-500">Guía completa de actuación</div>
                  </div>
                  <span className="text-orange-600">📖</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h4 className="font-semibold text-purple-900 mb-2">Contactos de Emergencia</h4>
          <div className="grid md:grid-cols-3 gap-4 text-purple-800">
            <div>
              <p className="font-medium">Emergencias</p>
              <p className="text-2xl font-bold">112</p>
            </div>
            <div>
              <p className="font-medium">Custodia360 24h</p>
              <p className="text-2xl font-bold">900 123 456</p>
            </div>
            <div>
              <p className="font-medium">Servicios Sociales</p>
              <p className="text-2xl font-bold">016</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Incidencia */}
      {modalIncidencia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reportar Nueva Incidencia</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidencia</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option>Alerta</option>
                  <option>Seguimiento</option>
                  <option>Formación</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" rows={3}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option>Alta</option>
                  <option>Media</option>
                  <option>Baja</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
                Reportar
              </button>
              <button
                onClick={() => setModalIncidencia(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Protocolo */}
      {modalProtocolo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Protocolo de Actuación ante Maltrato</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold text-red-600 mb-2">1. Detección Inmediata</h4>
                <p>Ante cualquier sospecha de maltrato, actuar inmediatamente sin esperar confirmación total.</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">2. Comunicación Urgente</h4>
                <p>Contactar inmediatamente con Custodia360 (900 123 456) y servicios de emergencia si es necesario (112).</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">3. Documentación</h4>
                <p>Registrar todos los detalles observados en el formulario de incidencia dentro de las 2 horas siguientes.</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">4. Seguimiento</h4>
                <p>Mantener comunicación continua con los servicios competentes y Custodia360 hasta resolución del caso.</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setModalProtocolo(false)}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
