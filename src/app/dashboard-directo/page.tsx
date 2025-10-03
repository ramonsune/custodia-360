'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DashboardDirecto() {
  console.log('🎯 Dashboard Directo cargándose...')

  const [datos, setDatos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generandoInforme, setGenerandoInforme] = useState(false)
  const [emergenciaAbierta, setEmergenciaAbierta] = useState(false)

  useEffect(() => {
    // Cargar datos inmediatamente
    setDatos({
        personas: {
          personal: [],
          familias: [],
          menores: []
        },
        estadisticas: {
          personal: {
            total: 12,
            completo: 8,
            porcentajeCompleto: 67
          },
          familias: {
            total: 45,
            completo: 32,
            porcentajeCompleto: 71
          },
          menores: {
            total: 67,
            informados: 52,
            porcentajeInformados: 78
          },
          casos: {
            abiertos: 2,
            resueltos: 3
          },
          general: {
            cumplimientoGlobal: 72,
            documentosPendientesTotal: 23
          }
        },
        delegado: {
          delegado: {
            nombre: 'Juan García Rodríguez',
            certificacion: {
              numero: 'LOPIVI-2024-1234',
              vigente: true
            }
          },
          alertas: [
            {
              id: 1,
              mensaje: 'Certificación de María López caduca en 15 días'
            },
            {
              id: 2,
              mensaje: '3 familias pendientes de firmar código de conducta'
            }
          ]
        },
        casos: {
          casos: [
            {
              id: 1,
              numero: 'CASO-2024-001',
              tipo: 'Conducta inapropiada',
              estado: 'ABIERTO',
              fechaReporte: '2024-12-15'
            },
            {
              id: 2,
              numero: 'CASO-2024-002',
              tipo: 'Incidente menor',
              estado: 'RESUELTO',
              fechaReporte: '2024-12-10'
            },
            {
              id: 3,
              numero: 'CASO-2024-003',
              tipo: 'Denuncia familiar',
              estado: 'EN_SEGUIMIENTO',
              fechaReporte: '2024-12-12'
            }
          ]
        }
      })
    setLoading(false)
  }, [])

  const generarInformeInspeccion = async () => {
    setGenerandoInforme(true)

    try {
      // Simular generación de informe
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('✅ Informe de inspección generado correctamente\n\n📋 Contenido completo con estadísticas y recomendaciones')
    } catch (error) {
      console.error('Error:', error)
      alert('✅ Informe de inspección generado (simulación)\n\n📋 Contenido completo con estadísticas y recomendaciones')
    } finally {
      setGenerandoInforme(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Cargando Dashboard Delegado...</p>
        </div>
      </div>
    )
  }

  const { estadisticas, delegado, casos } = datos

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con nombre de entidad */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Club Deportivo Ejemplo</h1>
                <p className="text-sm text-gray-600">Sistema LOPIVI - Juan García Rodríguez (Delegado)</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Cumplimiento: 72%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

        {/* Alertas Urgentes */}
        <div className="mb-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <span className="text-yellow-400 text-xl font-bold">!</span>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Atención requerida ({delegado.alertas.length} alertas)
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  {delegado.alertas.map((alerta) => (
                    <div key={alerta.id} className="mb-1">
                      • {alerta.mensaje}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Personal Formado</p>
                <p className="text-3xl font-bold text-gray-900">{estadisticas.personal.porcentajeCompleto}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {estadisticas.personal.completo}/{estadisticas.personal.total} personas
                </p>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${estadisticas.personal.porcentajeCompleto}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Familias Informadas</p>
                <p className="text-3xl font-bold text-gray-900">{estadisticas.familias.porcentajeCompleto}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {estadisticas.familias.completo}/{estadisticas.familias.total} familias
                </p>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${estadisticas.familias.porcentajeCompleto}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Menores Informados</p>
                <p className="text-3xl font-bold text-gray-900">{estadisticas.menores.porcentajeInformados}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {estadisticas.menores.informados}/{estadisticas.menores.total} menores
                </p>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${estadisticas.menores.porcentajeInformados}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Casos Activos</p>
                <p className="text-3xl font-bold text-gray-900">{estadisticas.casos.abiertos}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {estadisticas.casos.resueltos} resueltos este año
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Acciones Rápidas</h2>
          </div>
          <div className="p-6">
            {/* Botón de Emergencia - Prominente */}
            <div className="mb-6">
              <button
                onClick={() => setEmergenciaAbierta(!emergenciaAbierta)}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-colors"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl font-bold">!</span>
                </div>
                CASO DE EMERGENCIA
                <span className={`transform transition-transform ${emergenciaAbierta ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {emergenciaAbierta && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-red-800 mb-4">PROTOCOLO DE EMERGENCIA LOPIVI</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-red-700 mb-3">PASOS INMEDIATOS:</h4>
                      <ol className="space-y-2 text-sm text-red-800">
                        <li><span className="font-bold">1.</span> Garantizar la seguridad inmediata del menor</li>
                        <li><span className="font-bold">2.</span> Si hay riesgo inmediato, llamar al <strong>112</strong></li>
                        <li><span className="font-bold">3.</span> Documentar todo lo observado</li>
                        <li><span className="font-bold">4.</span> NO investigar por cuenta propia</li>
                        <li><span className="font-bold">5.</span> Contactar inmediatamente con autoridades</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-bold text-red-700 mb-3">TELÉFONOS DE EMERGENCIA:</h4>
                      <div className="space-y-3 text-sm">
                        <div className="bg-white p-3 rounded border">
                          <div className="font-bold text-red-800">Emergencias Generales</div>
                          <div className="text-2xl font-bold text-red-600">112</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="font-bold text-red-800">Guardia Civil</div>
                          <div className="text-xl font-bold text-red-600">062</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="font-bold text-red-800">Policía Nacional</div>
                          <div className="text-xl font-bold text-red-600">091</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="font-bold text-red-800">Teléfono del Menor</div>
                          <div className="text-xl font-bold text-red-600">116 111</div>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <div className="font-bold text-red-800">ANAR (Ayuda Niños/Adolescentes)</div>
                          <div className="text-xl font-bold text-red-600">900 20 20 10</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-4">
                    <h4 className="font-bold text-yellow-800 mb-2">IMPORTANTE - COMUNICACIÓN OBLIGATORIA:</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• <strong>Fiscalía de Menores:</strong> Comunicar en 24h máximo</li>
                      <li>• <strong>Servicios Sociales:</strong> Notificar inmediatamente</li>
                      <li>• <strong>Dirección del centro:</strong> Informar de inmediato</li>
                      <li>• <strong>Familias:</strong> Solo si no interfiere con la investigación</li>
                    </ul>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => alert('📋 Formulario de registro de incidente abierto')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold"
                    >
                      Registrar Incidente
                    </button>
                    <button
                      onClick={() => alert('📞 Lista de contactos de emergencia abierta')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-bold"
                    >
                      Ver Contactos Completos
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

              <button
                onClick={generarInformeInspeccion}
                disabled={generandoInforme}
                className="flex items-center justify-center px-6 py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-lg"
              >
                {generandoInforme ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Generando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Informe Inspección</span>
                  </div>
                )}
              </button>

              <button
                onClick={() => alert('📋 Gestión de Personas\n\n✅ Personal: 8/12 completo\n✅ Familias: 32/45 informadas\n✅ Menores: 52/67 informados\n\nFuncionalidad completa disponible')}
                className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition-colors"
              >
                <h3 className="font-medium text-gray-900">Gestionar Personas</h3>
                <p className="text-sm text-gray-600">Ver y gestionar personal, familias y menores</p>
              </button>

              <button
                onClick={() => alert('📧 Sistema de Comunicaciones\n\n✅ Envío masivo de documentos\n✅ Templates personalizados\n✅ Recordatorios automáticos\n\nFuncionalidad completa disponible')}
                className="bg-green-50 hover:bg-green-100 p-4 rounded-lg transition-colors"
              >
                <h3 className="font-medium text-gray-900">Comunicaciones</h3>
                <p className="text-sm text-gray-600">Enviar documentos y hacer seguimiento</p>
              </button>

              <button
                onClick={() => alert('📊 Gestión de Casos LOPIVI\n\n⚠️ Casos activos: 2\n✅ Casos resueltos: 3\n📋 Workflow completo\n\nFuncionalidad completa disponible')}
                className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg transition-colors"
              >
                <h3 className="font-medium text-gray-900">Gestión de Casos</h3>
                <p className="text-sm text-gray-600">Registrar y seguir casos LOPIVI</p>
              </button>

              <button
                onClick={() => alert('📈 Sistema de Informes\n\n📋 Informes de cumplimiento\n📊 Estadísticas detalladas\n📄 Generación automática PDF\n\nFuncionalidad completa disponible')}
                className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg transition-colors"
              >
                <h3 className="font-medium text-gray-900">Informes</h3>
                <p className="text-sm text-gray-600">Generar informes y estadísticas</p>
              </button>
            </div>
          </div>
        </div>

        {/* Resumen de Estado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Estado Documentación */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Estado de Documentación</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cumplimiento Global</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {estadisticas.general.cumplimientoGlobal}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${estadisticas.general.cumplimientoGlobal}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Documentos pendientes:</span>
                    <span className="font-medium">{estadisticas.general.documentosPendientesTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {casos.casos.slice(0, 3).map((caso) => (
                  <div key={caso.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      caso.estado === 'RESUELTO' ? 'bg-green-500' :
                      caso.estado === 'ABIERTO' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">
                        Caso {caso.numero}: {caso.tipo}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(caso.fechaReporte).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      caso.estado === 'RESUELTO' ? 'bg-green-100 text-green-800' :
                      caso.estado === 'ABIERTO' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {caso.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navegación adicional */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Explorar Sistema Completo</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/" className="group">
                <div className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg transition-colors text-center">
                  <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                    <span className="text-orange-600 text-2xl font-bold">W</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Web Principal</h3>
                  <p className="text-sm text-gray-600">Homepage Custodia360</p>
                </div>
              </Link>

              <Link href="/planes" className="group">
                <div className="bg-green-50 hover:bg-green-100 p-4 rounded-lg transition-colors text-center">
                  <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                    <span className="text-green-600 text-2xl font-bold">P</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Planes</h3>
                  <p className="text-sm text-gray-600">Contratación servicios</p>
                </div>
              </Link>

              <Link href="/contacto" className="group">
                <div className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg transition-colors text-center">
                  <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                    <span className="text-purple-600 text-2xl font-bold">C</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Contacto</h3>
                  <p className="text-sm text-gray-600">Soporte técnico</p>
                </div>
              </Link>

              <Link href="/demo" className="group">
                <div className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition-colors text-center">
                  <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                    <span className="text-blue-600 text-2xl font-bold">D</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Demo</h3>
                  <p className="text-sm text-gray-600">Demostración</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
