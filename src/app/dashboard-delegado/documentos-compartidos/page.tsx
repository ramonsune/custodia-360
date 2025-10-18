'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DocumentoCompartido {
  id: string
  fecha: string
  nombre: string
  tipo: string
  destinatarios: string[]
  metodo: 'email' | 'link' | 'descarga'
  estado: 'enviado' | 'visto' | 'descargado'
  tamaño: string
  categoria: string
}

export default function DocumentosCompartidosPage() {
  const [documentos, setDocumentos] = useState<DocumentoCompartido[]>([])
  const [filtro, setFiltro] = useState<string>('')
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todos')
  const [metodoFiltro, setMetodoFiltro] = useState<string>('todos')

  // Datos simulados de documentos compartidos
  useEffect(() => {
    const documentosSimulados: DocumentoCompartido[] = [
      {
        id: 'doc_001',
        fecha: '2025-01-10 15:30',
        nombre: 'Protocolo_Actuacion_LOPIVI_v2.pdf',
        tipo: 'PDF',
        destinatarios: ['entrenadores@club.es', 'monitores@club.es'],
        metodo: 'email',
        estado: 'visto',
        tamaño: '2.4 MB',
        categoria: 'protocolos'
      },
      {
        id: 'doc_002',
        fecha: '2025-01-09 11:15',
        nombre: 'Manual_Formacion_Personal.pdf',
        tipo: 'PDF',
        destinatarios: ['todo.personal@club.es'],
        metodo: 'link',
        estado: 'descargado',
        tamaño: '5.1 MB',
        categoria: 'formacion'
      },
      {
        id: 'doc_003',
        fecha: '2025-01-08 14:20',
        nombre: 'Informe_Mensual_Enero.pdf',
        tipo: 'PDF',
        destinatarios: ['servicios.sociales@ayuntamiento.es', 'inspector@junta.es'],
        metodo: 'email',
        estado: 'enviado',
        tamaño: '1.8 MB',
        categoria: 'informes'
      },
      {
        id: 'doc_004',
        fecha: '2025-01-07 09:45',
        nombre: 'Codigo_Conducta_Familias.pdf',
        tipo: 'PDF',
        destinatarios: ['familias.u12@club.es', 'familias.u14@club.es', 'familias.u16@club.es'],
        metodo: 'email',
        estado: 'visto',
        tamaño: '950 KB',
        categoria: 'comunicacion_familias'
      },
      {
        id: 'doc_005',
        fecha: '2025-01-06 16:30',
        nombre: 'Certificados_Personal_2025.xlsx',
        tipo: 'Excel',
        destinatarios: ['direccion@club.es', 'rrhh@club.es'],
        metodo: 'descarga',
        estado: 'descargado',
        tamaño: '750 KB',
        categoria: 'certificaciones'
      },
      {
        id: 'doc_006',
        fecha: '2025-01-05 12:00',
        nombre: 'Plan_Emergencia_Actualizado.pdf',
        tipo: 'PDF',
        destinatarios: ['coordinadores@club.es'],
        metodo: 'link',
        estado: 'visto',
        tamaño: '3.2 MB',
        categoria: 'emergencias'
      },
      {
        id: 'doc_007',
        fecha: '2025-01-04 10:15',
        nombre: 'Registro_Incidencias_Diciembre.pdf',
        tipo: 'PDF',
        destinatarios: ['delegado.principal@club.es', 'auditoria@custodia360.es'],
        metodo: 'email',
        estado: 'descargado',
        tamaño: '1.3 MB',
        categoria: 'informes'
      },
      {
        id: 'doc_008',
        fecha: '2025-01-03 13:45',
        nombre: 'Guia_Comunicacion_Digital_Segura.pdf',
        tipo: 'PDF',
        destinatarios: ['personal.jovenes@club.es'],
        metodo: 'email',
        estado: 'enviado',
        tamaño: '2.7 MB',
        categoria: 'formacion'
      }
    ]
    setDocumentos(documentosSimulados)
  }, [])

  const documentosFiltrados = documentos.filter(doc => {
    const cumpleFiltroTexto = doc.nombre.toLowerCase().includes(filtro.toLowerCase())
    const cumpleCategoria = categoriaFiltro === 'todos' || doc.categoria === categoriaFiltro
    const cumpleMetodo = metodoFiltro === 'todos' || doc.metodo === metodoFiltro
    return cumpleFiltroTexto && cumpleCategoria && cumpleMetodo
  })

  const getCategoriaColor = (categoria: string) => {
    const colores = {
      'protocolos': 'bg-red-100 text-red-800',
      'formacion': 'bg-purple-100 text-purple-800',
      'informes': 'bg-blue-100 text-blue-800',
      'comunicacion_familias': 'bg-green-100 text-green-800',
      'certificaciones': 'bg-yellow-100 text-yellow-800',
      'emergencias': 'bg-orange-100 text-orange-800'
    }
    return colores[categoria as keyof typeof colores] || 'bg-gray-100 text-gray-800'
  }

  const getEstadoColor = (estado: string) => {
    const colores = {
      'enviado': 'bg-blue-100 text-blue-800',
      'visto': 'bg-yellow-100 text-yellow-800',
      'descargado': 'bg-green-100 text-green-800'
    }
    return colores[estado as keyof typeof colores] || 'bg-gray-100 text-gray-800'
  }

  const getMetodoTexto = (metodo: string) => {
    const textos = {
      'email': 'Email',
      'link': 'Enlace',
      'descarga': 'Descarga'
    }
    return textos[metodo as keyof typeof textos] || metodo
  }

  const getCategoriaTexto = (categoria: string) => {
    const textos = {
      'protocolos': 'Protocolos',
      'formacion': 'Formación',
      'informes': 'Informes',
      'comunicacion_familias': 'Comunicación Familias',
      'certificaciones': 'Certificaciones',
      'emergencias': 'Emergencias'
    }
    return textos[categoria as keyof typeof textos] || categoria
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Documentos Compartidos</h1>
              <p className="text-gray-600 mt-2">Gestión y seguimiento de documentos LOPIVI</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por nombre
              </label>
              <input
                type="text"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar documentos..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todas las categorías</option>
                <option value="protocolos">Protocolos</option>
                <option value="formacion">Formación</option>
                <option value="informes">Informes</option>
                <option value="comunicacion_familias">Comunicación Familias</option>
                <option value="certificaciones">Certificaciones</option>
                <option value="emergencias">Emergencias</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de compartición
              </label>
              <select
                value={metodoFiltro}
                onChange={(e) => setMetodoFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos los métodos</option>
                <option value="email">Email</option>
                <option value="link">Enlace</option>
                <option value="descarga">Descarga</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm text-blue-800">
                  <strong>Documentos:</strong> {documentosFiltrados.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de documentos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Historial de Documentos Compartidos</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destinatarios
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
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
                {documentosFiltrados.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.fecha}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{doc.nombre}</div>
                        <div className="text-gray-500 text-xs">{doc.tipo} - {doc.tamaño}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs">
                        {doc.destinatarios.length === 1 ? (
                          <span>{doc.destinatarios[0]}</span>
                        ) : (
                          <span>{doc.destinatarios.length} destinatarios</span>
                        )}
                        {doc.destinatarios.length > 1 && (
                          <div className="text-gray-500 text-xs">
                            +{doc.destinatarios.length - 1} más
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoriaColor(doc.categoria)}`}>
                        {getCategoriaTexto(doc.categoria)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getMetodoTexto(doc.metodo)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(doc.estado)}`}>
                        {doc.estado.charAt(0).toUpperCase() + doc.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => {
                          alert(`Destinatarios:\n${doc.destinatarios.join('\n')}`)
                        }}
                      >
                        Ver destinatarios
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => {
                          alert('Funcionalidad de reenvío: En desarrollo')
                        }}
                      >
                        Reenviar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {documentosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No se encontraron documentos con los filtros aplicados</div>
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
                  {documentos.filter(d => d.estado === 'enviado').length}
                </div>
                <div className="text-sm text-gray-600">Enviados</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {documentos.filter(d => d.estado === 'visto').length}
                </div>
                <div className="text-sm text-gray-600">Vistos</div>
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
                  {documentos.filter(d => d.estado === 'descargado').length}
                </div>
                <div className="text-sm text-gray-600">Descargados</div>
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
                  {documentos.length}
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
