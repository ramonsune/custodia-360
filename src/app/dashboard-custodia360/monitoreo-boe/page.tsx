'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { CambioBOE, CambioRequerido } from '@/lib/monitoreo-boe'

// Configuración de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface EstadoMonitoreo {
  sistema_activo: boolean
  ultima_ejecucion: string
  proxima_ejecucion: string
  cambios_ultimo_mes: number
  errores_recientes: number
}

export default function MonitoreoBOEPage() {
  const [cambios, setCambios] = useState<CambioBOE[]>([])
  const [estadoSistema, setEstadoSistema] = useState<EstadoMonitoreo | null>(null)
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS')
  const [cambioSeleccionado, setCambioSeleccionado] = useState<CambioBOE | null>(null)
  const [ejecutandoTest, setEjecutandoTest] = useState(false)
  const [generandoInforme, setGenerandoInforme] = useState(false)
  const [descargandoHistorial, setDescargandoHistorial] = useState(false)

  useEffect(() => {
    cargarDatosMonitoreo()
  }, [])

  const cargarDatosMonitoreo = async () => {
    try {
      // Cargar cambios BOE desde Supabase
      const { data: cambiosData } = await supabase
        .from('cambios_boe')
        .select('*')
        .order('fecha_deteccion', { ascending: false })

      // Datos de ejemplo si no hay BD configurada
      const cambiosEjemplo: CambioBOE[] = [
        {
          id: 'boe-2025-001',
          fecha_publicacion: '2025-01-25',
          numero_boe: 'BOE-A-2025-001234',
          titulo: 'Orden por la que se modifica el protocolo de actuación en centros deportivos',
          url_completa: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-001234',
          contenido_relevante: 'Modificación de los requisitos para delegados de protección...',
          impacto_detectado: 'ALTO',
          areas_afectadas: ['certificacion_delegados', 'planes_proteccion'],
          cambios_requeridos: [
            {
              tipo: 'PDF_TEMPLATE',
              descripcion: 'Actualizar template certificado delegado principal',
              archivos_afectados: ['cert-delegado-principal.tsx'],
              prioridad: 'ALTA',
              implementado: true
            },
            {
              tipo: 'EMAIL_TEMPLATE',
              descripcion: 'Actualizar email notificación certificación',
              archivos_afectados: ['email-templates.ts'],
              prioridad: 'MEDIA',
              implementado: true
            }
          ],
          estado: 'COMUNICADO',
          fecha_deteccion: '2025-01-25T08:30:00Z',
          fecha_implementacion: '2025-01-25T10:15:00Z',
          entidades_afectadas: 147
        },
        {
          id: 'boe-2025-002',
          fecha_publicacion: '2025-01-20',
          numero_boe: 'BOE-A-2025-005678',
          titulo: 'Corrección de errores en la Ley de protección integral de la infancia',
          url_completa: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-005678',
          contenido_relevante: 'Corrección menor en terminología...',
          impacto_detectado: 'BAJO',
          areas_afectadas: ['documentacion_legal'],
          cambios_requeridos: [
            {
              tipo: 'PDF_TEMPLATE',
              descripcion: 'Actualizar terminología en todos los documentos',
              archivos_afectados: ['templates-globales.ts'],
              prioridad: 'BAJA',
              implementado: true
            }
          ],
          estado: 'COMUNICADO',
          fecha_deteccion: '2025-01-20T14:45:00Z',
          fecha_implementacion: '2025-01-20T15:30:00Z',
          entidades_afectadas: 147
        }
      ]

      setCambios(cambiosData || cambiosEjemplo)

      // Cargar estado del sistema - CAMBIO: proxima_ejecucion cada 15 días
      const estadoEjemplo: EstadoMonitoreo = {
        sistema_activo: true,
        ultima_ejecucion: '2025-01-25T08:00:00Z',
        proxima_ejecucion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 días en lugar de 12
        cambios_ultimo_mes: 2,
        errores_recientes: 0
      }

      setEstadoSistema(estadoEjemplo)

    } catch (error) {
      console.error('Error cargando datos monitoreo:', error)
    } finally {
      setLoading(false)
    }
  }

  const ejecutarTestMonitoreo = async () => {
    setEjecutandoTest(true)
    try {
      const response = await fetch('/api/monitoreo-boe?accion=test')
      const result = await response.json()

      if (result.success) {
        alert('✅ Test de monitoreo ejecutado correctamente')
        cargarDatosMonitoreo() // Recargar datos
      } else {
        alert('❌ Error en test de monitoreo')
      }
    } catch (error) {
      console.error('Error ejecutando test:', error)
      alert('❌ Error ejecutando test')
    } finally {
      setEjecutandoTest(false)
    }
  }

  // NUEVO: Función para forzar verificación
  const forzarVerificacion = async () => {
    setEjecutandoTest(true)
    try {
      const response = await fetch('/api/monitoreo-boe?accion=forzar')
      const result = await response.json()

      if (result.success) {
        alert('✅ Verificación forzada ejecutada correctamente\n\nSe ha iniciado una verificación completa del BOE.')
        // Actualizar próxima ejecución para reflejar la verificación manual
        setEstadoSistema(prev => prev ? {
          ...prev,
          ultima_ejecucion: new Date().toISOString(),
          proxima_ejecucion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
        } : null)
        cargarDatosMonitoreo()
      } else {
        alert('❌ Error al forzar verificación')
      }
    } catch (error) {
      console.error('Error forzando verificación:', error)
      alert('❌ Error al forzar verificación')
    } finally {
      setEjecutandoTest(false)
    }
  }

  // NUEVO: Función para generar informe manual
  const generarInformeManual = async () => {
    setGenerandoInforme(true)
    try {
      const response = await fetch('/api/monitoreo-boe?accion=informe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fecha_inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 30 días
          fecha_fin: new Date().toISOString(),
          incluir_cambios: true,
          incluir_estadisticas: true
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `informe-monitoreo-boe-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        alert('✅ Informe generado y descargado correctamente')
      } else {
        alert('❌ Error al generar informe')
      }
    } catch (error) {
      console.error('Error generando informe:', error)
      alert('❌ Error al generar informe')
    } finally {
      setGenerandoInforme(false)
    }
  }

  // NUEVO: Función para descargar historial
  const descargarHistorial = async () => {
    setDescargandoHistorial(true)
    try {
      const response = await fetch('/api/monitoreo-boe?accion=historial', {
        method: 'GET'
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `historial-completo-boe-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        alert('✅ Historial completo descargado correctamente')
      } else {
        alert('❌ Error al descargar historial')
      }
    } catch (error) {
      console.error('Error descargando historial:', error)
      alert('❌ Error al descargar historial')
    } finally {
      setDescargandoHistorial(false)
    }
  }

  const filtrarCambios = () => {
    if (filtroEstado === 'TODOS') return cambios
    return cambios.filter(cambio => cambio.estado === filtroEstado)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'DETECTADO': return 'bg-yellow-100 text-yellow-800'
      case 'ANALIZANDO': return 'bg-blue-100 text-blue-800'
      case 'IMPLEMENTADO': return 'bg-orange-100 text-orange-800'
      case 'COMUNICADO': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactoColor = (impacto: string) => {
    switch (impacto) {
      case 'CRITICO': return 'bg-red-100 text-red-800 border-red-200'
      case 'ALTO': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIO': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'BAJO': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando monitoreo BOE...</p>
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
              <h1 className="text-xl font-bold text-gray-900">Monitoreo BOE Automático</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center ${estadoSistema?.sistema_activo ? 'text-green-600' : 'text-red-600'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${estadoSistema?.sistema_activo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  {estadoSistema?.sistema_activo ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </div>

              {/* NUEVOS BOTONES FUNCIONALES */}
              <button
                onClick={forzarVerificacion}
                disabled={ejecutandoTest}
                className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 text-sm"
              >
                {ejecutandoTest ? 'Verificando...' : 'Forzar Verificación Ahora'}
              </button>

              <button
                onClick={generarInformeManual}
                disabled={generandoInforme}
                className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
              >
                {generandoInforme ? 'Generando...' : 'Generar Informe Manual'}
              </button>

              <button
                onClick={descargarHistorial}
                disabled={descargandoHistorial}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
              >
                {descargandoHistorial ? 'Descargando...' : 'Descargar Historial'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Estado del Sistema - SIN ICONOS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sistema</p>
                <p className="text-lg font-bold text-green-600">
                  {estadoSistema?.sistema_activo ? 'ACTIVO' : 'INACTIVO'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cambios detectados</p>
                <p className="text-lg font-bold text-blue-600">
                  {estadoSistema?.cambios_ultimo_mes || 0}
                </p>
                <p className="text-xs text-gray-500">último mes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <div className="w-6 h-6 bg-orange-600 rounded"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Próxima ejecución</p>
                <p className="text-sm font-bold text-orange-600">
                  {estadoSistema ? formatDate(estadoSistema.proxima_ejecucion) : 'N/A'}
                </p>
                <p className="text-xs text-gray-500">cada 15 días</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <div className="w-6 h-6 bg-red-600 rounded"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Errores recientes</p>
                <p className="text-lg font-bold text-red-600">
                  {estadoSistema?.errores_recientes || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros - SIN ICONOS */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Cambios BOE Detectados</h2>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="DETECTADO">Detectado</option>
              <option value="ANALIZANDO">Analizando</option>
              <option value="IMPLEMENTADO">Implementado</option>
              <option value="COMUNICADO">Comunicado</option>
            </select>
          </div>
        </div>

        {/* Lista de Cambios - SIN ICONOS */}
        <div className="space-y-4">
          {filtrarCambios().length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cambios BOE</h3>
              <p className="text-gray-600">
                {filtroEstado === 'TODOS'
                  ? 'No se han detectado cambios LOPIVI en el BOE últimamente.'
                  : `No hay cambios con estado "${filtroEstado}".`
                }
              </p>
            </div>
          ) : (
            filtrarCambios().map(cambio => (
              <div key={cambio.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactoColor(cambio.impacto_detectado)}`}>
                        {cambio.impacto_detectado}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(cambio.estado)}`}>
                        {cambio.estado}
                      </span>
                      <span className="text-sm text-gray-500">
                        {cambio.numero_boe}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{cambio.titulo}</h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {cambio.contenido_relevante}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Detectado:</span>
                        <br />
                        {formatDate(cambio.fecha_deteccion)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Publicado:</span>
                        <br />
                        {new Date(cambio.fecha_publicacion).toLocaleDateString('es-ES')}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Entidades afectadas:</span>
                        <br />
                        <span className="font-bold text-blue-600">{cambio.entidades_afectadas}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Cambios requeridos:</span>
                        <br />
                        <span className="font-bold text-orange-600">{cambio.cambios_requeridos.length}</span>
                      </div>
                    </div>

                    {/* Areas afectadas */}
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-700">Áreas afectadas: </span>
                      <div className="inline-flex flex-wrap gap-1 mt-1">
                        {cambio.areas_afectadas.map((area, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {area.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col gap-2">
                    <button
                      onClick={() => setCambioSeleccionado(cambio)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Ver Detalles
                    </button>
                    <a
                      href={cambio.url_completa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm text-center"
                    >
                      Ver BOE
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de Detalles - SIN ICONOS */}
        {cambioSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Detalles del Cambio BOE</h2>
                  <button
                    onClick={() => setCambioSeleccionado(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl p-2"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Información básica */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Información General</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Título:</strong><br />
                      {cambioSeleccionado.titulo}
                    </div>
                    <div>
                      <strong>Número BOE:</strong><br />
                      {cambioSeleccionado.numero_boe}
                    </div>
                    <div>
                      <strong>Fecha publicación:</strong><br />
                      {new Date(cambioSeleccionado.fecha_publicacion).toLocaleDateString('es-ES')}
                    </div>
                    <div>
                      <strong>Impacto:</strong><br />
                      <span className={`px-2 py-1 rounded-full text-xs ${getImpactoColor(cambioSeleccionado.impacto_detectado)}`}>
                        {cambioSeleccionado.impacto_detectado}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cambios requeridos */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Cambios Implementados</h3>
                  <div className="space-y-3">
                    {cambioSeleccionado.cambios_requeridos.map((cambio, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{cambio.descripcion}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            cambio.implementado
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cambio.implementado ? 'Implementado' : 'Pendiente'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Tipo:</strong> {cambio.tipo.replace('_', ' ')} •
                          <strong> Prioridad:</strong> {cambio.prioridad}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <strong>Archivos:</strong> {cambio.archivos_afectados.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline - SIN ICONOS */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Timeline de Procesamiento</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Detectado:</span>
                      <span>{formatDate(cambioSeleccionado.fecha_deteccion)}</span>
                    </div>
                    {cambioSeleccionado.fecha_implementacion && (
                      <div className="flex justify-between">
                        <span>Implementado:</span>
                        <span>{formatDate(cambioSeleccionado.fecha_implementacion)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Entidades notificadas:</span>
                      <span className="font-bold text-blue-600">{cambioSeleccionado.entidades_afectadas}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
