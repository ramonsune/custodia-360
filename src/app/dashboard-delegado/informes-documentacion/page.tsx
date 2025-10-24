'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Documento {
  id: string
  nombre: string
  tipo: 'informe' | 'certificado' | 'protocolo' | 'manual' | 'registro'
  categoria: string
  fecha_creacion: string
  ultima_actualizacion: string
  estado: 'activo' | 'pendiente' | 'archivado'
  responsable: string
  descripcion: string
  tamaño: string
  version: string
}

interface SeccionRapida {
  id: string
  nombre: string
  descripcion: string
  icono: string
  accion: string
  documentos_relacionados: number
}

export default function InformesDocumentacionPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([
    {
      id: 'DOC-001',
      nombre: 'Informe Mensual LOPIVI - Septiembre 2025',
      tipo: 'informe',
      categoria: 'Informes Mensuales',
      fecha_creacion: '2025-09-23',
      ultima_actualizacion: '2025-09-23',
      estado: 'activo',
      responsable: 'Delegado Principal',
      descripcion: 'Informe mensual de cumplimiento y actividades LOPIVI',
      tamaño: '2.4 MB',
      version: '1.0'
    },
    {
      id: 'DOC-002',
      nombre: 'Certificado DBS - Personal Activo',
      tipo: 'certificado',
      categoria: 'Certificaciones',
      fecha_creacion: '2025-09-15',
      ultima_actualizacion: '2025-09-20',
      estado: 'pendiente',
      responsable: 'Coordinador RRHH',
      descripcion: 'Registro actualizado de certificados DBS del personal',
      tamaño: '856 KB',
      version: '3.2'
    },
    {
      id: 'DOC-003',
      nombre: 'Protocolo de Emergencias Actualizado',
      tipo: 'protocolo',
      categoria: 'Protocolos de Seguridad',
      fecha_creacion: '2025-09-01',
      ultima_actualizacion: '2025-09-10',
      estado: 'activo',
      responsable: 'Delegado Suplente',
      descripcion: 'Protocolo actualizado para situaciones de emergencia',
      tamaño: '1.2 MB',
      version: '2.1'
    },
    {
      id: 'DOC-004',
      nombre: 'Manual de Formación LOPIVI',
      tipo: 'manual',
      categoria: 'Material Formativo',
      fecha_creacion: '2025-08-15',
      ultima_actualizacion: '2025-09-05',
      estado: 'activo',
      responsable: 'Coordinador de Formación',
      descripcion: 'Manual completo para formación del personal en LOPIVI',
      tamaño: '5.7 MB',
      version: '4.0'
    }
  ])

  const [seccionesRapidas] = useState<SeccionRapida[]>([
    {
      id: 'SR-001',
      nombre: 'Generar Informe Trimestral',
      descripcion: 'Crear informe automático con datos del trimestre',
      icono: '',
      accion: 'generar_informe_trimestral',
      documentos_relacionados: 12
    },
    {
      id: 'SR-002',
      nombre: 'Exportar Certificados',
      descripcion: 'Descargar todos los certificados activos',
      icono: '',
      accion: 'exportar_certificados',
      documentos_relacionados: 8
    },
    {
      id: 'SR-003',
      nombre: 'Backup Documentación',
      descripcion: 'Crear copia de seguridad de todos los documentos',
      icono: '',
      accion: 'backup_documentos',
      documentos_relacionados: 24
    },
    {
      id: 'SR-004',
      nombre: 'Audit Trail',
      descripcion: 'Generar registro de todas las acciones del sistema',
      icono: '',
      accion: 'generar_audit_trail',
      documentos_relacionados: 156
    },
    {
      id: 'SR-005',
      nombre: 'Plantillas Documentos',
      descripcion: 'Acceder a plantillas predefinidas',
      icono: '',
      accion: 'plantillas_documentos',
      documentos_relacionados: 6
    },
    {
      id: 'SR-006',
      nombre: 'Validación Cumplimiento',
      descripcion: 'Validar estado de cumplimiento general',
      icono: '',
      accion: 'validar_cumplimiento',
      documentos_relacionados: 18
    }
  ])

  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<Documento | null>(null)
  const [modalGestion, setModalGestion] = useState(false)
  const [modalSeccionRapida, setModalSeccionRapida] = useState(false)
  const [seccionSeleccionada, setSeccionSeleccionada] = useState<SeccionRapida | null>(null)
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [nuevoDocumento, setNuevoDocumento] = useState({
    nombre: '',
    tipo: '',
    categoria: '',
    descripcion: ''
  })

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'informe': return 'bg-blue-100 text-blue-800'
      case 'certificado': return 'bg-green-100 text-green-800'
      case 'protocolo': return 'bg-purple-100 text-purple-800'
      case 'manual': return 'bg-orange-100 text-orange-800'
      case 'registro': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'archivado': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const abrirGestionDocumento = (documento: Documento) => {
    setDocumentoSeleccionado(documento)
    setModalGestion(true)
  }

  const ejecutarSeccionRapida = (seccion: SeccionRapida) => {
    setSeccionSeleccionada(seccion)
    setModalSeccionRapida(true)

    // Simular la acción específica
    setTimeout(() => {
      switch (seccion.accion) {
        case 'generar_informe_trimestral':
          alert('Generando informe trimestral...\n\nInforme generado exitosamente')
          break
        case 'exportar_certificados':
          alert('Exportando certificados...\n\nCertificados exportados a ZIP')
          break
        case 'backup_documentos':
          alert('Creando backup...\n\nBackup completado exitosamente')
          break
        case 'generar_audit_trail':
          alert('Generando audit trail...\n\nRegistro de auditoría generado')
          break
        case 'plantillas_documentos':
          alert('Cargando plantillas...\n\n6 plantillas disponibles')
          break
        case 'validar_cumplimiento':
          alert('Validando cumplimiento...\n\nEstado: 92% de cumplimiento general')
          break
      }
      setModalSeccionRapida(false)
    }, 2000)
  }

  const actualizarDocumento = () => {
    if (!documentoSeleccionado) return

    const nuevosDocumentos = documentos.map(doc => {
      if (doc.id === documentoSeleccionado.id) {
        return {
          ...doc,
          ultima_actualizacion: new Date().toISOString().split('T')[0],
          version: (parseFloat(doc.version) + 0.1).toFixed(1)
        }
      }
      return doc
    })

    setDocumentos(nuevosDocumentos)
    setModalGestion(false)
    alert('Documento actualizado exitosamente')
  }

  const archivarDocumento = () => {
    if (!documentoSeleccionado) return

    const nuevosDocumentos = documentos.map(doc => {
      if (doc.id === documentoSeleccionado.id) {
        return {
          ...doc,
          estado: 'archivado' as const,
          ultima_actualizacion: new Date().toISOString().split('T')[0]
        }
      }
      return doc
    })

    setDocumentos(nuevosDocumentos)
    setModalGestion(false)
    alert('📁 Documento archivado exitosamente')
  }

  const crearNuevoDocumento = () => {
    if (!nuevoDocumento.nombre || !nuevoDocumento.tipo) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    const nuevo: Documento = {
      id: `DOC-${String(documentos.length + 1).padStart(3, '0')}`,
      nombre: nuevoDocumento.nombre,
      tipo: nuevoDocumento.tipo as any,
      categoria: nuevoDocumento.categoria || 'General',
      fecha_creacion: new Date().toISOString().split('T')[0],
      ultima_actualizacion: new Date().toISOString().split('T')[0],
      estado: 'pendiente',
      responsable: 'Usuario Actual',
      descripcion: nuevoDocumento.descripcion,
      tamaño: '0 KB',
      version: '1.0'
    }

    setDocumentos([...documentos, nuevo])
    setNuevoDocumento({ nombre: '', tipo: '', categoria: '', descripcion: '' })
    alert('Nuevo documento creado exitosamente')
  }

  const documentosFiltrados = documentos.filter(doc => {
    const cumpleTipo = !filtroTipo || doc.tipo === filtroTipo
    const cumpleEstado = !filtroEstado || doc.estado === filtroEstado
    return cumpleTipo && cumpleEstado
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Informes y Documentación</h1>
              <p className="text-gray-600 mt-2">Sistema de gestión documental LOPIVI</p>
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
            <div className="text-2xl font-bold text-blue-600">{documentos.filter(d => d.tipo === 'informe').length}</div>
            <div className="text-sm text-gray-600">Informes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-green-600">{documentos.filter(d => d.estado === 'activo').length}</div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-yellow-600">{documentos.filter(d => d.estado === 'pendiente').length}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-purple-600">{documentos.length}</div>
            <div className="text-sm text-gray-600">Total Documentos</div>
          </div>
        </div>

        {/* Secciones Rápidas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Secciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seccionesRapidas.map((seccion) => (
              <button
                key={seccion.id}
                onClick={() => ejecutarSeccionRapida(seccion)}
                className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{seccion.nombre}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{seccion.descripcion}</p>
                <span className="text-xs text-blue-600">{seccion.documentos_relacionados} documentos relacionados</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filtros y nuevo documento */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Todos los tipos</option>
                <option value="informe">Informes</option>
                <option value="certificado">Certificados</option>
                <option value="protocolo">Protocolos</option>
                <option value="manual">Manuales</option>
                <option value="registro">Registros</option>
              </select>

              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="pendiente">Pendientes</option>
                <option value="archivado">Archivados</option>
              </select>
            </div>

            <button
              onClick={() => {
                const nombre = prompt('Nombre del documento:')
                const tipo = prompt('Tipo (informe/certificado/protocolo/manual/registro):')
                if (nombre && tipo) {
                  setNuevoDocumento({
                    nombre,
                    tipo,
                    categoria: prompt('Categoría:') || 'General',
                    descripcion: prompt('Descripción:') || ''
                  })
                  crearNuevoDocumento()
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              + Nuevo Documento
            </button>
          </div>
        </div>

        {/* Lista de documentos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Documentos</h3>

          <div className="space-y-4">
            {documentosFiltrados.map((documento) => (
              <div key={documento.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="font-bold text-lg">{documento.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoColor(documento.tipo)}`}>
                        {documento.tipo.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(documento.estado)}`}>
                        {documento.estado.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-600">v{documento.version}</span>
                    </div>

                    <h4 className="font-semibold text-lg text-gray-900 mb-2">{documento.nombre}</h4>
                    <p className="text-gray-700 mb-3">{documento.descripcion}</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Categoría:</span> {documento.categoria}
                      </div>
                      <div>
                        <span className="font-medium">Responsable:</span> {documento.responsable}
                      </div>
                      <div>
                        <span className="font-medium">Actualizado:</span> {documento.ultima_actualizacion}
                      </div>
                      <div>
                        <span className="font-medium">Tamaño:</span> {documento.tamaño}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => abrirGestionDocumento(documento)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Gestionar
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Descargar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal gestión documento */}
        {modalGestion && documentoSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Gestionar: {documentoSeleccionado.nombre}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-bold mb-3">Información del Documento</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>ID:</strong> {documentoSeleccionado.id}</p>
                    <p><strong>Tipo:</strong> {documentoSeleccionado.tipo}</p>
                    <p><strong>Categoría:</strong> {documentoSeleccionado.categoria}</p>
                    <p><strong>Estado:</strong> {documentoSeleccionado.estado}</p>
                    <p><strong>Versión:</strong> {documentoSeleccionado.version}</p>
                    <p><strong>Tamaño:</strong> {documentoSeleccionado.tamaño}</p>
                    <p><strong>Responsable:</strong> {documentoSeleccionado.responsable}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Fechas</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Creado:</strong> {documentoSeleccionado.fecha_creacion}</p>
                    <p><strong>Última actualización:</strong> {documentoSeleccionado.ultima_actualizacion}</p>
                  </div>

                  <h4 className="font-bold mb-3 mt-6">Descripción</h4>
                  <p className="text-sm text-gray-700">{documentoSeleccionado.descripcion}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-blue-800 mb-2">Acciones Disponibles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={actualizarDocumento}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Actualizar Versión
                  </button>
                  <button
                    onClick={archivarDocumento}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Archivar Documento
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Descargar
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Compartir
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalGestion(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal sección rápida */}
        {modalSeccionRapida && seccionSeleccionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="text-4xl mb-4">{seccionSeleccionada.icono}</div>
                <h3 className="text-xl font-bold mb-2">{seccionSeleccionada.nombre}</h3>
                <p className="text-gray-600 mb-4">{seccionSeleccionada.descripcion}</p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-blue-600 mt-2">Procesando...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
