'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface DocumentTemplate {
  id: string
  nombre: string
  sector: string
  tipo: 'certificado' | 'plan' | 'informe'
  secciones: DocumentSection[]
  ultima_modificacion: string
  activo: boolean
}

interface DocumentSection {
  id: string
  nombre: string
  tipo: 'header' | 'contenido' | 'footer' | 'logos' | 'firma'
  contenido: string
  variables: string[]
  configuracion: any
}

const SECTORES = {
  'club-deportivo': {
    nombre: 'Club Deportivo',
    color: 'bg-blue-600',
    icon: '⚽'
  },
  'academia-deportiva': {
    nombre: 'Academia Deportiva',
    color: 'bg-green-600',
    icon: '🎾'
  },
  'centro-deportivo': {
    nombre: 'Centro Deportivo',
    color: 'bg-orange-600',
    icon: '🏊‍♂️'
  }
}

const TIPOS_DOCUMENTOS = {
  certificado: {
    nombre: 'Certificados',
    icon: '📜',
    color: 'text-blue-600'
  },
  plan: {
    nombre: 'Planes de Protección',
    icon: '📋',
    color: 'text-orange-600'
  },
  informe: {
    nombre: 'Informes y Reportes',
    icon: '📊',
    color: 'text-green-600'
  }
}

export default function GestionPDFsPage() {
  const [sectorSeleccionado, setSectorSeleccionado] = useState<string>('club-deportivo')
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string | null>(null)
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<DocumentTemplate | null>(null)
  const [seccionEditando, setSeccionEditando] = useState<DocumentSection | null>(null)
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [cambiosGuardados, setCambiosGuardados] = useState(false)

  useEffect(() => {
    cargarTemplates()
  }, [])

  const cargarTemplates = async () => {
    try {
      // Cargar templates desde Supabase o usar datos de ejemplo
      const templatesEjemplo: DocumentTemplate[] = [
        // CLUB DEPORTIVO
        {
          id: 'cert-club-principal',
          nombre: 'Certificado Delegado Principal',
          sector: 'club-deportivo',
          tipo: 'certificado',
          ultima_modificacion: new Date().toISOString(),
          activo: true,
          secciones: [
            {
              id: 'header',
              nombre: 'Header y Logos',
              tipo: 'header',
              contenido: 'CERTIFICADO OFICIAL LOPIVI',
              variables: ['{{entidad}}', '{{fecha}}'],
              configuracion: { logo_custodia: true, logo_entidad: true }
            },
            {
              id: 'contenido',
              nombre: 'Contenido Principal',
              tipo: 'contenido',
              contenido: 'Certificamos que {{nombre}} ha completado exitosamente la formación como Delegado de Protección Principal para {{entidad}}.',
              variables: ['{{nombre}}', '{{entidad}}', '{{fecha_formacion}}'],
              configuracion: {}
            },
            {
              id: 'footer',
              nombre: 'Footer y Firma',
              tipo: 'footer',
              contenido: 'Custodia360 - Soluciones automatizadas de cumplimiento LOPIVI',
              variables: ['{{codigo_certificado}}'],
              configuracion: { firma_digital: true, qr_verificacion: true }
            }
          ]
        },
        {
          id: 'cert-club-suplente',
          nombre: 'Certificado Delegado Suplente',
          sector: 'club-deportivo',
          tipo: 'certificado',
          ultima_modificacion: new Date().toISOString(),
          activo: true,
          secciones: [
            {
              id: 'header',
              nombre: 'Header y Logos',
              tipo: 'header',
              contenido: 'CERTIFICADO DELEGADO SUPLENTE',
              variables: ['{{entidad}}', '{{fecha}}'],
              configuracion: { logo_custodia: true, logo_entidad: true }
            },
            {
              id: 'contenido',
              nombre: 'Contenido Principal',
              tipo: 'contenido',
              contenido: 'Certificamos que {{nombre}} ha sido designado y formado como Delegado de Protección Suplente para {{entidad}}.',
              variables: ['{{nombre}}', '{{entidad}}', '{{delegado_principal}}'],
              configuracion: {}
            }
          ]
        },
        {
          id: 'plan-club',
          nombre: 'Plan de Protección Club',
          sector: 'club-deportivo',
          tipo: 'plan',
          ultima_modificacion: new Date().toISOString(),
          activo: true,
          secciones: [
            {
              id: 'portada',
              nombre: 'Portada',
              tipo: 'header',
              contenido: 'PLAN DE PROTECCIÓN INFANTIL\n{{entidad}}',
              variables: ['{{entidad}}', '{{año}}'],
              configuracion: { logo_entidad: true }
            },
            {
              id: 'introduccion',
              nombre: 'Introducción',
              tipo: 'contenido',
              contenido: 'El presente Plan de Protección Infantil establece las medidas y protocolos específicos para {{entidad}}...',
              variables: ['{{entidad}}', '{{tipo_actividades}}'],
              configuracion: {}
            }
          ]
        },
        // ACADEMIA DEPORTIVA
        {
          id: 'cert-academia-principal',
          nombre: 'Certificado Delegado Principal',
          sector: 'academia-deportiva',
          tipo: 'certificado',
          ultima_modificacion: new Date().toISOString(),
          activo: true,
          secciones: [
            {
              id: 'header',
              nombre: 'Header y Logos',
              tipo: 'header',
              contenido: 'CERTIFICADO OFICIAL LOPIVI - ACADEMIA DEPORTIVA',
              variables: ['{{entidad}}', '{{fecha}}'],
              configuracion: { logo_custodia: true, logo_entidad: true }
            },
            {
              id: 'contenido',
              nombre: 'Contenido Principal',
              tipo: 'contenido',
              contenido: 'Acreditamos que {{nombre}} ha completado la formación especializada como Delegado de Protección Principal para la academia deportiva {{entidad}}.',
              variables: ['{{nombre}}', '{{entidad}}', '{{especialidad}}'],
              configuracion: {}
            }
          ]
        },
        // CENTRO DEPORTIVO
        {
          id: 'cert-centro-principal',
          nombre: 'Certificado Delegado Principal',
          sector: 'centro-deportivo',
          tipo: 'certificado',
          ultima_modificacion: new Date().toISOString(),
          activo: true,
          secciones: [
            {
              id: 'header',
              nombre: 'Header y Logos',
              tipo: 'header',
              contenido: 'CERTIFICADO OFICIAL LOPIVI - CENTRO DEPORTIVO',
              variables: ['{{entidad}}', '{{fecha}}'],
              configuracion: { logo_custodia: true, logo_entidad: true }
            }
          ]
        }
      ]

      setTemplates(templatesEjemplo)
    } catch (error) {
      console.error('Error cargando templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtrarTemplatesPorSectorYTipo = () => {
    return templates.filter(t =>
      t.sector === sectorSeleccionado &&
      (!tipoSeleccionado || t.tipo === tipoSeleccionado)
    )
  }

  const guardarCambios = async () => {
    try {
      setCambiosGuardados(true)
      // Aquí guardaría en Supabase
      setTimeout(() => setCambiosGuardados(false), 2000)
    } catch (error) {
      console.error('Error guardando cambios:', error)
    }
  }

  const breadcrumb = () => {
    const items = ['Panel Admin', 'Gestión PDFs']

    if (sectorSeleccionado) {
      items.push(SECTORES[sectorSeleccionado as keyof typeof SECTORES].nombre)
    }

    if (tipoSeleccionado) {
      items.push(TIPOS_DOCUMENTOS[tipoSeleccionado as keyof typeof TIPOS_DOCUMENTOS].nombre)
    }

    if (documentoSeleccionado) {
      items.push(documentoSeleccionado.nombre)
    }

    if (seccionEditando) {
      items.push(seccionEditando.nombre)
    }

    return items.join(' > ')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando gestión de PDFs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard-custodia360" className="text-gray-500 hover:text-gray-700 mr-4">
                ← Volver
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Gestión de PDFs</h1>
            </div>

            {cambiosGuardados && (
              <div className="flex items-center text-green-600">
                <span className="mr-2">✅</span>
                <span className="text-sm">Cambios guardados</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-sm text-gray-600">
          {breadcrumb()}
        </nav>
      </div>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

        {/* NIVEL 1: Selección de Sector */}
        {!tipoSeleccionado && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Seleccionar Sector</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(SECTORES).map(([key, sector]) => (
                  <button
                    key={key}
                    onClick={() => setSectorSeleccionado(key)}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      sectorSeleccionado === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{sector.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900">{sector.nombre}</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {templates.filter(t => t.sector === key).length} documentos
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tipos de Documentos para el Sector Seleccionado */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Documentos para {SECTORES[sectorSeleccionado as keyof typeof SECTORES].nombre}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(TIPOS_DOCUMENTOS).map(([key, tipo]) => {
                  const count = templates.filter(t => t.sector === sectorSeleccionado && t.tipo === key).length

                  return (
                    <button
                      key={key}
                      onClick={() => setTipoSeleccionado(key)}
                      className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-3">{tipo.icon}</div>
                        <h3 className={`text-lg font-semibold ${tipo.color}`}>{tipo.nombre}</h3>
                        <p className="text-sm text-gray-600 mt-2">
                          {count} template{count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* NIVEL 2: Lista de Documentos */}
        {tipoSeleccionado && !documentoSeleccionado && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {TIPOS_DOCUMENTOS[tipoSeleccionado as keyof typeof TIPOS_DOCUMENTOS].nombre} - {SECTORES[sectorSeleccionado as keyof typeof SECTORES].nombre}
              </h2>
              <button
                onClick={() => setTipoSeleccionado(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Volver a tipos
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtrarTemplatesPorSectorYTipo().map(template => (
                <div key={template.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{template.nombre}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {template.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Secciones:</span> {template.secciones.length}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Última modificación:</span> {' '}
                      {new Date(template.ultima_modificacion).toLocaleDateString('es-ES')}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setDocumentoSeleccionado(template)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NIVEL 3: Edición de Documento */}
        {documentoSeleccionado && !seccionEditando && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Editando: {documentoSeleccionado.nombre}
              </h2>
              <button
                onClick={() => setDocumentoSeleccionado(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Volver a documentos
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Secciones del Documento</h3>

              <div className="space-y-4">
                {documentoSeleccionado.secciones.map(seccion => (
                  <div key={seccion.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{seccion.nombre}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Tipo: {seccion.tipo} • Variables: {seccion.variables.length}
                        </p>
                        <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700">
                          {seccion.contenido.substring(0, 100)}
                          {seccion.contenido.length > 100 && '...'}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        <button
                          onClick={() => setSeccionEditando(seccion)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Editar
                        </button>
                        <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          Preview
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NIVEL 4: Editor de Sección */}
        {seccionEditando && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Editando: {seccionEditando.nombre}
              </h2>
              <button
                onClick={() => setSeccionEditando(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Volver a secciones
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Editor */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Editor de Contenido</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenido
                    </label>
                    <textarea
                      value={seccionEditando.contenido}
                      onChange={(e) => setSeccionEditando({
                        ...seccionEditando,
                        contenido: e.target.value
                      })}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contenido del documento..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variables Disponibles
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {seccionEditando.variables.map(variable => (
                        <span
                          key={variable}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm cursor-pointer hover:bg-blue-200"
                          onClick={() => {
                            const textarea = document.querySelector('textarea')
                            if (textarea) {
                              const start = textarea.selectionStart
                              const end = textarea.selectionEnd
                              const newValue = seccionEditando.contenido.substring(0, start) +
                                             variable +
                                             seccionEditando.contenido.substring(end)
                              setSeccionEditando({
                                ...seccionEditando,
                                contenido: newValue
                              })
                            }
                          }}
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={guardarCambios}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      onClick={() => setSeccionEditando(null)}
                      className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[400px]">
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{
                      __html: seccionEditando.contenido
                        .replace(/\{\{nombre\}\}/g, '<span class="bg-yellow-200">Juan Pérez</span>')
                        .replace(/\{\{entidad\}\}/g, '<span class="bg-yellow-200">Club Ejemplo</span>')
                        .replace(/\{\{fecha\}\}/g, '<span class="bg-yellow-200">' + new Date().toLocaleDateString('es-ES') + '</span>')
                        .replace(/\n/g, '<br>')
                    }} />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Las variables resaltadas en amarillo se sustituirán automáticamente con datos reales al generar el PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
