'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface EmailEnviado {
  id: string
  fecha: string
  destinatario: string
  asunto: string
  tipo: string
  estado: 'enviado' | 'entregado' | 'error'
  contenido: string
}

export default function EmailsEnviadosPage() {
  const [emailsEnviados, setEmailsEnviados] = useState<EmailEnviado[]>([])
  const [filtro, setFiltro] = useState<string>('')
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos')

  // Datos simulados de emails enviados
  useEffect(() => {
    const emailsSimulados: EmailEnviado[] = [
      {
        id: 'email_001',
        fecha: '2025-01-10 14:30',
        destinatario: 'padres.equipo.u12@ejemplo.com',
        asunto: 'Comunicación mensual - Actividades enero',
        tipo: 'comunicacion_familias',
        estado: 'entregado',
        contenido: 'Estimadas familias, les informamos sobre las actividades programadas para este mes...'
      },
      {
        id: 'email_002',
        fecha: '2025-01-09 10:15',
        destinatario: 'entrenadores@clubdepor.com',
        asunto: 'Recordatorio: Protocolo LOPIVI actualizado',
        tipo: 'formacion_personal',
        estado: 'entregado',
        contenido: 'Equipo técnico, les recordamos que se ha actualizado el protocolo de actuación...'
      },
      {
        id: 'email_003',
        fecha: '2025-01-08 16:45',
        destinatario: 'servicios.sociales@ayuntamiento.es',
        asunto: 'Informe mensual de cumplimiento LOPIVI',
        tipo: 'autoridades',
        estado: 'enviado',
        contenido: 'Estimados responsables, adjuntamos el informe mensual de cumplimiento...'
      },
      {
        id: 'email_004',
        fecha: '2025-01-07 12:20',
        destinatario: 'personal.administrativo@club.es',
        asunto: 'Actualización de procedimientos',
        tipo: 'gestion_interna',
        estado: 'entregado',
        contenido: 'Equipo administrativo, procedemos a informarles sobre las nuevas actualizaciones...'
      },
      {
        id: 'email_005',
        fecha: '2025-01-06 09:30',
        destinatario: 'delegado.principal@club.es',
        asunto: 'Coordinación semanal',
        tipo: 'coordinacion',
        estado: 'entregado',
        contenido: 'Estimado delegado principal, adjunto el resumen de actividades de la semana...'
      },
      {
        id: 'email_006',
        fecha: '2025-01-05 17:00',
        destinatario: 'familias.nuevas@club.es',
        asunto: 'Bienvenida y protocolos de protección',
        tipo: 'comunicacion_familias',
        estado: 'error',
        contenido: 'Bienvenidos al club. Les informamos sobre nuestros protocolos de protección infantil...'
      }
    ]
    setEmailsEnviados(emailsSimulados)
  }, [])

  const emailsFiltrados = emailsEnviados.filter(email => {
    const cumpleFiltroTexto = email.destinatario.toLowerCase().includes(filtro.toLowerCase()) ||
                             email.asunto.toLowerCase().includes(filtro.toLowerCase())
    const cumpleTipo = tipoFiltro === 'todos' || email.tipo === tipoFiltro
    return cumpleFiltroTexto && cumpleTipo
  })

  const getTipoColor = (tipo: string) => {
    const colores = {
      'comunicacion_familias': 'bg-blue-100 text-blue-800',
      'formacion_personal': 'bg-purple-100 text-purple-800',
      'autoridades': 'bg-red-100 text-red-800',
      'gestion_interna': 'bg-green-100 text-green-800',
      'coordinacion': 'bg-yellow-100 text-yellow-800'
    }
    return colores[tipo as keyof typeof colores] || 'bg-gray-100 text-gray-800'
  }

  const getEstadoColor = (estado: string) => {
    const colores = {
      'enviado': 'bg-blue-100 text-blue-800',
      'entregado': 'bg-green-100 text-green-800',
      'error': 'bg-red-100 text-red-800'
    }
    return colores[estado as keyof typeof colores] || 'bg-gray-100 text-gray-800'
  }

  const getTipoTexto = (tipo: string) => {
    const textos = {
      'comunicacion_familias': 'Comunicación Familias',
      'formacion_personal': 'Formación Personal',
      'autoridades': 'Autoridades',
      'gestion_interna': 'Gestión Interna',
      'coordinacion': 'Coordinación'
    }
    return textos[tipo as keyof typeof textos] || tipo
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emails Enviados</h1>
              <p className="text-gray-600 mt-2">Historial de comunicaciones del sistema LOPIVI</p>
            </div>
            <Link
              href="/dashboard-delegado"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Volver al Dashboard
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por destinatario o asunto
              </label>
              <input
                type="text"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar emails..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por tipo
              </label>
              <select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos los tipos</option>
                <option value="comunicacion_familias">Comunicación Familias</option>
                <option value="formacion_personal">Formación Personal</option>
                <option value="autoridades">Autoridades</option>
                <option value="gestion_interna">Gestión Interna</option>
                <option value="coordinacion">Coordinación</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm text-blue-800">
                  <strong>Total emails:</strong> {emailsFiltrados.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de emails */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Historial de Comunicaciones</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destinatario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asunto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emailsFiltrados.map((email) => (
                  <tr key={email.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {email.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {email.destinatario}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {email.asunto}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(email.tipo)}`}>
                        {getTipoTexto(email.tipo)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(email.estado)}`}>
                        {email.estado.charAt(0).toUpperCase() + email.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => {
                          alert(`Contenido del email:\n\n${email.contenido}`)
                        }}
                      >
                        Ver contenido
                      </button>
                      {email.estado === 'error' && (
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => {
                            alert('Funcionalidad de reenvío: En desarrollo')
                          }}
                        >
                          Reenviar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {emailsFiltrados.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No se encontraron emails con los filtros aplicados</div>
            </div>
          )}
        </div>

        {/* Estadísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {emailsEnviados.filter(e => e.estado === 'enviado').length}
                </div>
                <div className="text-sm text-gray-600">Enviados</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {emailsEnviados.filter(e => e.estado === 'entregado').length}
                </div>
                <div className="text-sm text-gray-600">Entregados</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">X</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {emailsEnviados.filter(e => e.estado === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Errores</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {emailsEnviados.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
