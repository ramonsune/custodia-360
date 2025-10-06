'use client'

import { useState, useEffect } from 'react'

interface MetricaMensual {
  valor: number
  objetivo: number
  variacion: number
  tendencia: 'subiendo' | 'bajando' | 'estable'
  estado: 'excelente' | 'bueno' | 'regular' | 'critico'
}

interface AlertaRiesgo {
  id: string
  tipo: string
  severidad: 'baja' | 'media' | 'alta' | 'critica'
  titulo: string
  descripcion: string
  impacto: string
  accionRequerida: string
  fechaDeteccion: string
  fechaLimite?: string
}

interface InformeMensual {
  metadatos: {
    entidadId: string
    entidadNombre: string
    periodo: { mes: number, año: number }
    fechaGeneracion: string
    delegadoPrincipal: string
    delegadoSuplente?: string
  }
  resumenEjecutivo: {
    cumplimientoGeneral: MetricaMensual
    casosGestionados: number
    incidentesCriticos: number
    formacionesCompletadas: number
    alertasPendientes: number
    estadoGeneral: 'excelente' | 'bueno' | 'regular' | 'critico'
  }
  metricas: {
    cumplimientoLOPIVI: MetricaMensual
    gestionCasos: {
      total: MetricaMensual
      resueltos: MetricaMensual
      tiempoPromedio: MetricaMensual
      satisfaccion: MetricaMensual
    }
    formacionPersonal: {
      completadas: MetricaMensual
      cobertura: MetricaMensual
      certificacionesVigentes: MetricaMensual
      proximosVencimientos: number
    }
  }
  alertasRiesgos: AlertaRiesgo[]
  recomendaciones: Array<{
    id: string
    categoria: string
    titulo: string
    descripcion: string
    prioridad: 'alta' | 'media' | 'baja'
    tiempoEstimado: string
    impactoEsperado: string
  }>
}

interface InformesMensualesProps {
  entidadId: string
  isOpen: boolean
  onClose: () => void
}

export default function InformesMensuales({ entidadId, isOpen, onClose }: InformesMensualesProps) {
  const [informe, setInforme] = useState<InformeMensual | null>(null)
  const [loading, setLoading] = useState(false)
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1)
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear())
  const [vistaActual, setVistaActual] = useState<'dashboard' | 'alertas' | 'recomendaciones' | 'configuracion'>('dashboard')

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  useEffect(() => {
    if (isOpen) {
      cargarInforme()
    }
  }, [isOpen, entidadId, mesSeleccionado, añoSeleccionado])

  const cargarInforme = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/informes/mensuales?entidadId=${entidadId}&mes=${mesSeleccionado}&año=${añoSeleccionado}`)
      const data = await response.json()

      if (data.success) {
        setInforme(data.informe)
      }
    } catch (error) {
      console.error('Error cargando informe:', error)
    } finally {
      setLoading(false)
    }
  }

  const descargarInformePDF = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/informes/mensuales?entidadId=${entidadId}&mes=${mesSeleccionado}&año=${añoSeleccionado}&formato=pdf`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `Informe_Mensual_${mesSeleccionado}_${añoSeleccionado}_${entidadId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error descargando PDF:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMetricaColor = (metrica: MetricaMensual) => {
    switch (metrica.estado) {
      case 'excelente': return 'text-green-600 bg-green-50 border-green-200'
      case 'bueno': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'regular': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'critico': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'critica': return 'text-red-600 bg-red-50 border-red-200'
      case 'alta': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'media': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'baja': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'subiendo': return ''
      case 'bajando': return ''
      case 'estable': return ''
      default: return ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Informes Mensuales Automáticos</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={descargarInformePDF}
                disabled={loading || !informe}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
Descargar PDF
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>

          {/* Selector de período */}
          <div className="flex items-center gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
              <select
                value={mesSeleccionado}
                onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {nombresMeses.map((mes, index) => (
                  <option key={index} value={index + 1}>{mes}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
              <select
                value={añoSeleccionado}
                onChange={(e) => setAñoSeleccionado(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
              </select>
            </div>
            <button
              onClick={cargarInforme}
              disabled={loading}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50 mt-6"
            >
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>

          {/* Navegación */}
          <div className="flex mt-4 border-b">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: '' },
              { key: 'alertas', label: 'Alertas', icon: '' },
              { key: 'recomendaciones', label: 'Recomendaciones', icon: '' },
              { key: 'configuracion', label: 'Configuración', icon: '' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setVistaActual(tab.key as any)}
                className={`px-4 py-2 font-medium text-sm ${
                  vistaActual === tab.key
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Generando informe...</p>
            </div>
          )}

          {!loading && informe && (
            <>
              {vistaActual === 'dashboard' && (
                <div className="space-y-6">
                  {/* Encabezado del informe */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Informe de {nombresMeses[informe.metadatos.periodo.mes - 1]} {informe.metadatos.periodo.año}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Entidad</div>
                        <div className="font-medium">{informe.metadatos.entidadNombre}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Delegado Principal</div>
                        <div className="font-medium">{informe.metadatos.delegadoPrincipal}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Estado General</div>
                        <div className={`font-medium ${
                          informe.resumenEjecutivo.estadoGeneral === 'excelente' ? 'text-green-600' :
                          informe.resumenEjecutivo.estadoGeneral === 'bueno' ? 'text-blue-600' :
                          informe.resumenEjecutivo.estadoGeneral === 'regular' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {informe.resumenEjecutivo.estadoGeneral.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resumen ejecutivo */}
                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="bg-white border rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {informe.resumenEjecutivo.cumplimientoGeneral.valor}%
                      </div>
                      <div className="text-sm text-gray-600">Cumplimiento</div>
                      <div className="text-xs text-gray-500">
                        {getTendenciaIcon(informe.resumenEjecutivo.cumplimientoGeneral.tendencia)}
                        {informe.resumenEjecutivo.cumplimientoGeneral.variacion > 0 ? '+' : ''}
                        {informe.resumenEjecutivo.cumplimientoGeneral.variacion}%
                      </div>
                    </div>
                    <div className="bg-white border rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {informe.resumenEjecutivo.casosGestionados}
                      </div>
                      <div className="text-sm text-gray-600">Casos</div>
                      <div className="text-xs text-gray-500">Gestionados</div>
                    </div>
                    <div className="bg-white border rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {informe.resumenEjecutivo.formacionesCompletadas}
                      </div>
                      <div className="text-sm text-gray-600">Formaciones</div>
                      <div className="text-xs text-gray-500">Completadas</div>
                    </div>
                    <div className="bg-white border rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {informe.resumenEjecutivo.incidentesCriticos}
                      </div>
                      <div className="text-sm text-gray-600">Incidentes</div>
                      <div className="text-xs text-gray-500">Críticos</div>
                    </div>
                    <div className="bg-white border rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {informe.resumenEjecutivo.alertasPendientes}
                      </div>
                      <div className="text-sm text-gray-600">Alertas</div>
                      <div className="text-xs text-gray-500">Pendientes</div>
                    </div>
                  </div>

                  {/* Métricas detalladas */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Gestión de casos */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-4">Gestión de Casos</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total casos</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{informe.metricas.gestionCasos.total.valor}</span>
                            <span className={`px-2 py-1 rounded text-xs border ${getMetricaColor(informe.metricas.gestionCasos.total)}`}>
                              {informe.metricas.gestionCasos.total.estado}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Casos resueltos</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{informe.metricas.gestionCasos.resueltos.valor}</span>
                            <span className="text-xs text-gray-500">
                              {getTendenciaIcon(informe.metricas.gestionCasos.resueltos.tendencia)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Tiempo promedio</span>
                          <span className="font-medium">{informe.metricas.gestionCasos.tiempoPromedio.valor} días</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Satisfacción</span>
                          <span className="font-medium">{informe.metricas.gestionCasos.satisfaccion.valor}/5</span>
                        </div>
                      </div>
                    </div>

                    {/* Formación del personal */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-4">Formación del Personal</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Formaciones completadas</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{informe.metricas.formacionPersonal.completadas.valor}</span>
                            <span className={`px-2 py-1 rounded text-xs border ${getMetricaColor(informe.metricas.formacionPersonal.completadas)}`}>
                              {informe.metricas.formacionPersonal.completadas.estado}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Cobertura</span>
                          <span className="font-medium">{informe.metricas.formacionPersonal.cobertura.valor}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Certificaciones vigentes</span>
                          <span className="font-medium">{informe.metricas.formacionPersonal.certificacionesVigentes.valor}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Próximos vencimientos</span>
                          <span className="font-medium text-orange-600">{informe.metricas.formacionPersonal.proximosVencimientos}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {vistaActual === 'alertas' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-red-900">🚨 Alertas y Riesgos Detectados</h3>

                  {informe.alertasRiesgos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4"></div>
                      <p>No hay alertas pendientes en este período</p>
                    </div>
                  ) : (
                    informe.alertasRiesgos.map(alerta => (
                      <div key={alerta.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">{alerta.titulo}</h4>
                            <p className="text-gray-600 text-sm mt-1">{alerta.descripcion}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs border ${getSeveridadColor(alerta.severidad)}`}>
                            {alerta.severidad.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <h5 className="font-semibold text-yellow-900 mb-1">Impacto</h5>
                            <p className="text-yellow-800 text-sm">{alerta.impacto}</p>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h5 className="font-semibold text-blue-900 mb-1">Acción Requerida</h5>
                            <p className="text-blue-800 text-sm">{alerta.accionRequerida}</p>
                          </div>
                        </div>

                        {alerta.fechaLimite && (
                          <div className="mt-3 text-xs text-gray-500">
                            Fecha límite: {new Date(alerta.fechaLimite).toLocaleDateString('es-ES')}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {vistaActual === 'recomendaciones' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-green-900">Recomendaciones de Mejora</h3>

                  {informe.recomendaciones.map(rec => (
                    <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{rec.titulo}</h4>
                          <p className="text-gray-600 text-sm mt-1">{rec.descripcion}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs border ${
                          rec.prioridad === 'alta' ? 'text-red-600 bg-red-50 border-red-200' :
                          rec.prioridad === 'media' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                          'text-green-600 bg-green-50 border-green-200'
                        }`}>
                          {rec.prioridad.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h5 className="font-semibold text-gray-800 mb-1">Tiempo Estimado</h5>
                          <p className="text-gray-700 text-sm">{rec.tiempoEstimado}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h5 className="font-semibold text-gray-800 mb-1">Impacto Esperado</h5>
                          <p className="text-gray-700 text-sm">{rec.impactoEsperado}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h5 className="font-semibold text-gray-800 mb-1">Categoría</h5>
                          <p className="text-gray-700 text-sm">{rec.categoria}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {vistaActual === 'configuracion' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">⚙️ Configuración de Informes Automáticos</h3>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-4">Configuración Actual</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="mensual">Mensual</option>
                          <option value="trimestral">Trimestral</option>
                          <option value="semestral">Semestral</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="pdf">PDF</option>
                          <option value="email">Email + PDF</option>
                          <option value="dashboard">Solo Dashboard</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Destinatarios</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="direccion@entidad.com, delegado@entidad.com"
                      />
                    </div>

                    <div className="flex justify-end mt-4">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Guardar Configuración
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
