'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Documento {
  id: string
  nombre: string
  tipo: 'lopivi' | 'autorizacion' | 'protocolo' | 'informativo' | 'certificado' | 'otro'
  descripcion: string
  tamaño: string
  fechaCreacion: string
  obligatorio: boolean
  dirigidoA: 'personal' | 'familias' | 'todos'
}

interface Destinatario {
  id: string
  nombre: string
  email: string
  tipo: 'personal' | 'familia'
  cargo?: string
  estado: 'activo' | 'inactivo'
  documentosRecibidos: string[]
  ultimoEnvio?: string
}

export default function ComunicacionDocsPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<any>(null)
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([])
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<Documento | null>(null)
  const [destinatariosSeleccionados, setDestinatariosSeleccionados] = useState<Destinatario[]>([])
  const [filtroTipoDoc, setFiltroTipoDoc] = useState<'todos' | 'lopivi' | 'autorizacion' | 'protocolo' | 'informativo' | 'certificado'>('todos')
  const [filtroDestinatario, setFiltroDestinatario] = useState<'todos' | 'personal' | 'familia'>('todos')
  const [showModalEnvio, setShowModalEnvio] = useState(false)
  const [mensajeEnvio, setMensajeEnvio] = useState({
    asunto: '',
    mensaje: '',
    urgente: false,
    solicitarConfirmacion: false,
    fechaLimite: ''
  })

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (session) {
      setSessionData(JSON.parse(session))
      cargarDocumentos()
      cargarDestinatarios()
    } else {
      router.push('/login-delegados')
    }
  }, [router])

  const cargarDocumentos = () => {
    const docsData: Documento[] = [
      {
        id: 'doc-001',
        nombre: 'Plan_Proteccion_LOPIVI_2024.pdf',
        tipo: 'lopivi',
        descripcion: 'Plan de Protección Infantil actualizado según LOPIVI',
        tamaño: '2.3 MB',
        fechaCreacion: '2024-01-15',
        obligatorio: true,
        dirigidoA: 'todos'
      },
      {
        id: 'doc-002',
        nombre: 'Protocolo_Actuacion_Emergencias.pdf',
        tipo: 'protocolo',
        descripcion: 'Protocolo de actuación ante situaciones de emergencia',
        tamaño: '1.8 MB',
        fechaCreacion: '2024-01-10',
        obligatorio: true,
        dirigidoA: 'personal'
      },
      {
        id: 'doc-003',
        nombre: 'Autorizacion_Imagenes_2024.pdf',
        tipo: 'autorizacion',
        descripcion: 'Formulario de autorización para uso de imágenes',
        tamaño: '0.8 MB',
        fechaCreacion: '2024-01-08',
        obligatorio: false,
        dirigidoA: 'familias'
      },
      {
        id: 'doc-004',
        nombre: 'Codigo_Conducta_Personal.pdf',
        tipo: 'lopivi',
        descripcion: 'Código de conducta para personal que trabaja con menores',
        tamaño: '1.2 MB',
        fechaCreacion: '2024-01-05',
        obligatorio: true,
        dirigidoA: 'personal'
      },
      {
        id: 'doc-005',
        nombre: 'Certificado_Cumplimiento_LOPIVI.pdf',
        tipo: 'certificado',
        descripcion: 'Certificado de cumplimiento normativo LOPIVI de la entidad',
        tamaño: '0.5 MB',
        fechaCreacion: '2024-01-12',
        obligatorio: false,
        dirigidoA: 'familias'
      },
      {
        id: 'doc-006',
        nombre: 'Guia_Comunicacion_Familias.pdf',
        tipo: 'informativo',
        descripcion: 'Guía para la comunicación efectiva con familias',
        tamaño: '1.5 MB',
        fechaCreacion: '2024-01-03',
        obligatorio: false,
        dirigidoA: 'personal'
      }
    ]
    setDocumentos(docsData)
  }

  const cargarDestinatarios = () => {
    const destinatariosData: Destinatario[] = [
      {
        id: 'dest-001',
        nombre: 'María González López',
        email: 'maria.gonzalez@entidad.com',
        tipo: 'personal',
        cargo: 'Entrenadora Principal',
        estado: 'activo',
        documentosRecibidos: ['doc-001', 'doc-002'],
        ultimoEnvio: '2024-01-10'
      },
      {
        id: 'dest-002',
        nombre: 'Carlos Ruiz Martín',
        email: 'carlos.ruiz@entidad.com',
        tipo: 'personal',
        cargo: 'Monitor Deportivo',
        estado: 'activo',
        documentosRecibidos: ['doc-001'],
        ultimoEnvio: '2024-01-08'
      },
      {
        id: 'dest-003',
        nombre: 'Familia García López',
        email: 'ana.lopez@email.com',
        tipo: 'familia',
        estado: 'activo',
        documentosRecibidos: ['doc-003', 'doc-005'],
        ultimoEnvio: '2024-01-12'
      },
      {
        id: 'dest-004',
        nombre: 'Roberto Jiménez Cruz',
        email: 'roberto.jimenez@entidad.com',
        tipo: 'personal',
        cargo: 'Monitor Auxiliar',
        estado: 'inactivo',
        documentosRecibidos: [],
        ultimoEnvio: undefined
      },
      {
        id: 'dest-005',
        nombre: 'Familia Martín Sánchez',
        email: 'laura.sanchez@email.com',
        tipo: 'familia',
        estado: 'activo',
        documentosRecibidos: ['doc-003'],
        ultimoEnvio: '2024-01-09'
      },
      {
        id: 'dest-006',
        nombre: 'Ana Martín Sánchez',
        email: 'ana.martin@entidad.com',
        tipo: 'personal',
        cargo: 'Coordinadora Técnica',
        estado: 'activo',
        documentosRecibidos: ['doc-001', 'doc-002', 'doc-004', 'doc-006'],
        ultimoEnvio: '2024-01-11'
      }
    ]
    setDestinatarios(destinatariosData)
  }

  const documentosFiltrados = documentos.filter(doc => {
    if (filtroTipoDoc === 'todos') return true
    return doc.tipo === filtroTipoDoc
  })

  const destinatariosFiltrados = destinatarios.filter(dest => {
    const matchTipo = filtroDestinatario === 'todos' || dest.tipo === filtroDestinatario
    const matchDocumento = !documentoSeleccionado ||
      documentoSeleccionado.dirigidoA === 'todos' ||
      documentoSeleccionado.dirigidoA === dest.tipo

    return matchTipo && matchDocumento && dest.estado === 'activo'
  })

  const seleccionarDestinatario = (destinatario: Destinatario) => {
    setDestinatariosSeleccionados(prev => {
      const existe = prev.find(d => d.id === destinatario.id)
      if (existe) {
        return prev.filter(d => d.id !== destinatario.id)
      } else {
        return [...prev, destinatario]
      }
    })
  }

  const seleccionarTodosDestinatarios = () => {
    if (destinatariosSeleccionados.length === destinatariosFiltrados.length) {
      setDestinatariosSeleccionados([])
    } else {
      setDestinatariosSeleccionados(destinatariosFiltrados)
    }
  }

  const prepararEnvio = (documento: Documento) => {
    setDocumentoSeleccionado(documento)

    // Pre-seleccionar destinatarios apropiados que no han recibido el documento
    const destinatariosApropiados = destinatarios.filter(dest => {
      const esApropiado = documento.dirigidoA === 'todos' || documento.dirigidoA === dest.tipo
      const noLoTiene = !dest.documentosRecibidos.includes(documento.id)
      const estaActivo = dest.estado === 'activo'
      return esApropiado && noLoTiene && estaActivo
    })

    setDestinatariosSeleccionados(destinatariosApropiados)

    // Configurar mensaje predeterminado
    setMensajeEnvio({
      asunto: `Documento: ${documento.nombre}`,
      mensaje: `Adjuntamos el documento "${documento.nombre}".\n\n${documento.descripcion}\n\n${documento.obligatorio ? 'IMPORTANTE: Este documento es obligatorio.' : ''}\n\nSaludos cordiales,\nDelegado de Protección`,
      urgente: documento.obligatorio,
      solicitarConfirmacion: documento.obligatorio,
      fechaLimite: documento.obligatorio ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : ''
    })

    setShowModalEnvio(true)
  }

  const enviarDocumento = () => {
    if (!documentoSeleccionado || destinatariosSeleccionados.length === 0) {
      alert('Seleccione un documento y al menos un destinatario')
      return
    }

    // Simular envío
    const envio = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      documento: documentoSeleccionado,
      destinatarios: destinatariosSeleccionados.map(d => ({
        id: d.id,
        nombre: d.nombre,
        email: d.email,
        tipo: d.tipo
      })),
      mensaje: mensajeEnvio,
      estado: 'enviado'
    }

    // Actualizar documentos recibidos
    const destinatariosActualizados = destinatarios.map(dest => {
      const seleccionado = destinatariosSeleccionados.find(s => s.id === dest.id)
      if (seleccionado) {
        return {
          ...dest,
          documentosRecibidos: [...dest.documentosRecibidos, documentoSeleccionado.id],
          ultimoEnvio: new Date().toISOString().split('T')[0]
        }
      }
      return dest
    })
    setDestinatarios(destinatariosActualizados)

    // Guardar en historial
    const historial = JSON.parse(localStorage.getItem('historial_envio_documentos') || '[]')
    localStorage.setItem('historial_envio_documentos', JSON.stringify([envio, ...historial]))

    alert(`Documento "${documentoSeleccionado.nombre}" enviado exitosamente a ${destinatariosSeleccionados.length} destinatario(s)`)

    setShowModalEnvio(false)
    setDocumentoSeleccionado(null)
    setDestinatariosSeleccionados([])
  }

  const getTipoColor = (tipo: string) => {
    const colores = {
      lopivi: 'bg-red-100 text-red-800',
      autorizacion: 'bg-blue-100 text-blue-800',
      protocolo: 'bg-yellow-100 text-yellow-800',
      informativo: 'bg-green-100 text-green-800',
      certificado: 'bg-purple-100 text-purple-800',
      otro: 'bg-gray-100 text-gray-800'
    }
    return colores[tipo as keyof typeof colores] || colores.otro
  }

  const getDestinatariosQueNecesitanDoc = (documento: Documento) => {
    return destinatarios.filter(dest => {
      const esApropiado = documento.dirigidoA === 'todos' || documento.dirigidoA === dest.tipo
      const noLoTiene = !dest.documentosRecibidos.includes(documento.id)
      const estaActivo = dest.estado === 'activo'
      return esApropiado && noLoTiene && estaActivo
    }).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard-delegado" className="text-blue-600 hover:text-blue-800 mr-4">
                ← Volver al Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Envío de Documentación</h1>
            </div>
            <span className="text-sm text-gray-600">
              {sessionData?.nombre} - Delegado Principal
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Controles */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Documentos Disponibles</h2>
              <p className="text-gray-600">Envía documentación oficial a personal y familias de forma segura</p>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <select
                value={filtroTipoDoc}
                onChange={(e) => setFiltroTipoDoc(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="todos">Todos los Tipos</option>
                <option value="lopivi">LOPIVI</option>
                <option value="protocolo">Protocolos</option>
                <option value="autorizacion">Autorizaciones</option>
                <option value="certificado">Certificados</option>
                <option value="informativo">Informativos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Documentos */}
        <div className="grid gap-4 mb-8">
          {documentosFiltrados.map((documento) => {
            const necesitanDoc = getDestinatariosQueNecesitanDoc(documento)

            return (
              <div key={documento.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{documento.nombre}</h3>

                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(documento.tipo)}`}>
                        {documento.tipo.toUpperCase()}
                      </span>

                      {documento.obligatorio && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          OBLIGATORIO
                        </span>
                      )}

                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {documento.dirigidoA === 'todos' ? 'Personal + Familias' :
                         documento.dirigidoA === 'personal' ? 'Solo Personal' : 'Solo Familias'}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{documento.descripcion}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Tamaño:</span>
                        <p className="text-gray-900">{documento.tamaño}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Creado:</span>
                        <p className="text-gray-900">{new Date(documento.fechaCreacion).toLocaleDateString('es-ES')}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Pendientes:</span>
                        <p className={`font-bold ${necesitanDoc > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {necesitanDoc} persona{necesitanDoc !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Total enviados:</span>
                        <p className="text-gray-900">
                          {destinatarios.filter(d => d.documentosRecibidos.includes(documento.id)).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => prepararEnvio(documento)}
                      disabled={necesitanDoc === 0}
                      className={`px-6 py-2 rounded-lg font-medium ${
                        necesitanDoc > 0
                          ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Enviar {necesitanDoc > 0 && `(${necesitanDoc})`}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Resumen */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <h3 className="font-bold text-cyan-900 mb-2">Resumen de Documentación:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-cyan-800">Total documentos:</span>
              <span className="text-cyan-900 ml-1">{documentos.length}</span>
            </div>
            <div>
              <span className="font-medium text-cyan-800">Obligatorios:</span>
              <span className="text-cyan-900 ml-1">{documentos.filter(d => d.obligatorio).length}</span>
            </div>
            <div>
              <span className="font-medium text-cyan-800">Destinatarios activos:</span>
              <span className="text-cyan-900 ml-1">{destinatarios.filter(d => d.estado === 'activo').length}</span>
            </div>
            <div>
              <span className="font-medium text-cyan-800">Envíos pendientes:</span>
              <span className="text-cyan-900 ml-1">
                {documentos.reduce((total, doc) => total + getDestinatariosQueNecesitanDoc(doc), 0)}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Envío de Documento */}
      {showModalEnvio && documentoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Enviar: {documentoSeleccionado.nombre}
                </h2>
                <button
                  onClick={() => setShowModalEnvio(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); enviarDocumento(); }}>
                {/* Información del documento */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Documento a enviar:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Nombre:</span>
                      <p className="text-gray-900">{documentoSeleccionado.nombre}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Tipo:</span>
                      <span className={`px-2 py-1 rounded text-xs ${getTipoColor(documentoSeleccionado.tipo)}`}>
                        {documentoSeleccionado.tipo}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Tamaño:</span>
                      <p className="text-gray-900">{documentoSeleccionado.tamaño}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Obligatorio:</span>
                      <p className={documentoSeleccionado.obligatorio ? 'text-red-600' : 'text-green-600'}>
                        {documentoSeleccionado.obligatorio ? 'SÍ' : 'NO'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filtros de destinatarios */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar destinatarios:</label>
                  <select
                    value={filtroDestinatario}
                    onChange={(e) => setFiltroDestinatario(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="todos">Todos los destinatarios</option>
                    <option value="personal">Solo Personal</option>
                    <option value="familia">Solo Familias</option>
                  </select>
                </div>

                {/* Selección de destinatarios */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Destinatarios ({destinatariosSeleccionados.length} seleccionados):
                    </label>
                    <button
                      type="button"
                      onClick={seleccionarTodosDestinatarios}
                      className="text-sm text-cyan-600 hover:text-cyan-800"
                    >
                      {destinatariosSeleccionados.length === destinatariosFiltrados.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    {destinatariosFiltrados.map(destinatario => {
                      const yaLoTiene = destinatario.documentosRecibidos.includes(documentoSeleccionado.id)

                      return (
                        <div key={destinatario.id} className={`p-3 border-b border-gray-100 last:border-b-0 ${yaLoTiene ? 'bg-gray-50' : ''}`}>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={destinatariosSeleccionados.some(d => d.id === destinatario.id)}
                              onChange={() => seleccionarDestinatario(destinatario)}
                              disabled={yaLoTiene}
                              className="mr-3 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                            />
                            <div className="flex-1">
                              <span className={`font-medium ${yaLoTiene ? 'text-gray-500' : 'text-gray-900'}`}>
                                {destinatario.nombre}
                              </span>
                              {destinatario.cargo && (
                                <span className="text-sm text-gray-600 ml-2">({destinatario.cargo})</span>
                              )}
                              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                destinatario.tipo === 'personal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {destinatario.tipo}
                              </span>
                              {yaLoTiene && (
                                <span className="ml-2 px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                  Ya lo tiene ✓
                                </span>
                              )}
                            </div>
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Mensaje personalizado */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asunto: *</label>
                  <input
                    type="text"
                    value={mensajeEnvio.asunto}
                    onChange={(e) => setMensajeEnvio(prev => ({...prev, asunto: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje: *</label>
                  <textarea
                    value={mensajeEnvio.mensaje}
                    onChange={(e) => setMensajeEnvio(prev => ({...prev, mensaje: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows={5}
                    required
                  />
                </div>

                {/* Opciones adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={mensajeEnvio.urgente}
                      onChange={(e) => setMensajeEnvio(prev => ({...prev, urgente: e.target.checked}))}
                      className="mr-2 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">Marcar como urgente</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={mensajeEnvio.solicitarConfirmacion}
                      onChange={(e) => setMensajeEnvio(prev => ({...prev, solicitarConfirmacion: e.target.checked}))}
                      className="mr-2 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">Solicitar confirmación de recepción</span>
                  </label>
                </div>

                {mensajeEnvio.solicitarConfirmacion && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha límite para confirmación:</label>
                    <input
                      type="date"
                      value={mensajeEnvio.fechaLimite}
                      onChange={(e) => setMensajeEnvio(prev => ({...prev, fechaLimite: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}

                {/* Botones */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModalEnvio(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={destinatariosSeleccionados.length === 0}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      destinatariosSeleccionados.length > 0
                        ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Enviar a {destinatariosSeleccionados.length} destinatario{destinatariosSeleccionados.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
