'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function SistemaAutomatizadoPage() {

  const sistemas = [
    {
      id: 'documentos',
      titulo: 'Generador Automático de Documentos LOPIVI',
      descripcion: 'Sistema que genera automáticamente todos los documentos legales requeridos por la LOPIVI',
      estado: 'operativo',
      url: '/gestion-tarjetas', // Temporal, en producción sería /documentos-auto
      caracteristicas: [
        'Plan de Protección personalizado (15-30 páginas)',
        'Nombramiento del delegado',
        'Certificados de formación automáticos',
        'Protocolos específicos por tipo de entidad',
        'Código de conducta personalizado',
        'Evaluación de riesgos automática',
        'Plantillas de comunicación'
      ],
      metricas: {
        tiempoPromedio: '2 minutos'
      },
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'dashboard',
      titulo: 'Dashboard Automatizado 24/7',
      descripcion: 'Centro de control que gestiona todo automáticamente sin intervención humana',
      estado: 'operativo',
      url: '/dashboard-automatizado',
      caracteristicas: [
        'Monitoreo continuo de entidades',
        'Alertas automáticas con auto-resolución',
        'Procesos automáticos paralelos',
        '100% de disponibilidad',
        'Respuesta en segundos a incidencias',
        'Escalado automático de casos críticos',
        'Reportes automáticos para inspecciones'
      ],
      metricas: {
        uptime: '100%',
        disponibilidad: '24/7'
      },
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'boe-monitor',
      titulo: 'Monitor BOE Automático',
      descripcion: 'Sistema que detecta cambios en la normativa y actualiza todo automáticamente',
      estado: 'operativo',
      url: '/como-lo-hacemos#boe-monitor', // Sección en esta página
      caracteristicas: [
        'Monitoreo del BOE cada hora',
        'Detección automática de cambios LOPIVI',
        'Actualización automática de documentos',
        'Notificaciones inmediatas a entidades',
        'Generación automática de protocolos',
        'Programación de formación actualizada',
        'Análisis de impacto automático'
      ],
      metricas: {
        monitoreo: 'Diario'
      },
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'monitor-noticias',
      titulo: 'Monitor de Noticias LOPIVI Automático',
      descripcion: 'Sistema que monitorea automáticamente todas las noticias y novedades relacionadas con LOPIVI',
      estado: 'operativo',
      url: '/como-lo-hacemos#monitor-noticias',
      caracteristicas: [
        'Monitoreo de portales de noticias 24/7',
        'Detección automática de noticias LOPIVI',
        'Análisis de relevancia y impacto',
        'Resúmenes automáticos personalizados',
        'Notificaciones inmediatas a clientes',
        'Archivo histórico de noticias',
        'Alertas de cambios normativos'
      ],
      metricas: {
        fuentesMonitoreadas: '150+'
      },
      color: 'from-green-500 to-emerald-600'
    }
  ]

  const procesosAutomaticos = [
    {
      nombre: 'Onboarding Completo',
      descripcion: 'Desde contratación hasta operativo en 72h',
      pasos: ['Pago confirmado', 'Documentos generados', 'Delegado formado', 'Sistema activo'],
      automatizacion: '100%'
    },
    {
      nombre: 'Mantenimiento Normativo',
      descripcion: 'Actualización continua según cambios BOE',
      pasos: ['Monitor BOE', 'Análisis cambios', 'Actualizar docs', 'Notificar entidades'],
      automatizacion: '100%'
    },
    {
      nombre: 'Gestión de Casos',
      descripcion: 'Detección y resolución automática de alertas',
      pasos: ['Detectar alerta', 'Clasificar riesgo', 'Ejecutar protocolo', 'Seguimiento'],
      automatizacion: '95%'
    },
    {
      nombre: 'Certificaciones',
      descripcion: 'Formación y certificación continua',
      pasos: ['Asignar formación', 'Seguir progreso', 'Evaluar conocimientos', 'Emitir certificado'],
      automatizacion: '100%'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white text-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Cómo lo hacemos
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            <span className="text-blue-600 font-bold">Custodia360</span> es el <strong>primer sistema completamente automatizado</strong> de España
            para cumplimiento LOPIVI. Desde la contratación hasta el mantenimiento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">72h</div>
              <div className="text-gray-600">Implementación Auto</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-gray-600">Disponibilidad</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">0%</div>
              <div className="text-gray-600">Intervención Manual</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Sistemas Principales */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Sistemas Automatizados Principales
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sistemas.map((sistema) => {
              return (
                <Card key={sistema.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader className={`bg-gradient-to-r ${sistema.color} text-white`}>
                    <CardTitle className="flex items-center gap-3">
                      {sistema.titulo}
                      <Badge className="bg-white/20 text-white">
                        {sistema.estado}
                      </Badge>
                    </CardTitle>
                    <p className="text-white/90">{sistema.descripcion}</p>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Métricas */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {Object.entries(sistema.metricas).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{value}</div>
                          <div className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Características */}
                    <div className="mb-6">
                      <h4 className="font-bold mb-3">Características:</h4>
                      <ul className="space-y-1 text-sm">
                        {sistema.caracteristicas.slice(0, 4).map((caracteristica, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            {caracteristica}
                          </li>
                        ))}
                      </ul>
                      {sistema.caracteristicas.length > 4 && (
                        <p className="text-sm text-gray-500 mt-2">
                          +{sistema.caracteristicas.length - 4} características más...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Procesos Automatizados */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Procesos 100% Automatizados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {procesosAutomaticos.map((proceso, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {proceso.nombre}
                    <Badge className="bg-green-100 text-green-800">
                      {proceso.automatizacion} Auto
                    </Badge>
                  </CardTitle>
                  <p className="text-gray-600">{proceso.descripcion}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {proceso.pasos.map((paso, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </div>
                        <span className="text-sm">{paso}</span>
                        <div className="w-4 h-4 bg-green-500 rounded-full ml-auto"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Monitor BOE Detallado */}
        <div id="boe-monitor" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Monitor BOE Automático en Detalle
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Funcionamiento del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-bold">Monitoreo Continuo</h4>
                      <p className="text-sm text-gray-600">
                        Cada día analiza automáticamente el BOE buscando cambios relacionados con LOPIVI
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-bold">Análisis Inteligente</h4>
                      <p className="text-sm text-gray-600">
                        Sistema automático analiza el contenido y determina si afecta a protocolos, documentos o formación
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-bold">Actualización Automática</h4>
                      <p className="text-sm text-gray-600">
                        Actualiza documentos, genera nuevos protocolos y programa formación actualizada
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-bold">Notificación Inmediata</h4>
                      <p className="text-sm text-gray-600">
                        Notifica a todas las entidades afectadas con los cambios ya aplicados automáticamente
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">ACTIVO</div>
                    <div className="text-sm text-gray-500">Sistema operativo</div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Última revisión:</span>
                      <span className="font-medium">Hace 15 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Próxima revisión:</span>
                      <span className="font-medium">En 45 min</span>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monitor de Noticias Detallado */}
        <div id="monitor-noticias" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Monitor de Noticias LOPIVI Automático en Detalle
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Funcionamiento del Sistema de Monitoreo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-bold">Monitoreo Continuo de Portales</h4>
                      <p className="text-sm text-gray-600">
                        Sistema automático analiza 150+ portales de noticias, medios oficiales y fuentes especializadas las 24 horas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-bold">Análisis de Relevancia Automático</h4>
                      <p className="text-sm text-gray-600">
                        Filtra automáticamente noticias relacionadas con LOPIVI, planes de protección y normativa infantil
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-bold">Resúmenes Personalizados</h4>
                      <p className="text-sm text-gray-600">
                        Genera resúmenes automáticos adaptados al sector y tipo de entidad de cada cliente
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-bold">Notificación Inteligente</h4>
                      <p className="text-sm text-gray-600">
                        Envía alertas inmediatas cuando detecta noticias de alto impacto para el cumplimiento LOPIVI
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado del Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">ACTIVO</div>
                    <div className="text-sm text-gray-500">Monitoreando 24/7</div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Última revisión:</span>
                      <span className="font-medium">Hace 2 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Próximo análisis:</span>
                      <span className="font-medium">En 3 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuentes monitoreadas:</span>
                      <span className="font-medium text-blue-600">150+</span>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Final */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para el Sistema 100% Automatizado?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Implementa cumplimiento LOPIVI completamente automatizado las 24 horas del día.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contratar/datos-entidad">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Automatizar Mi Entidad Ahora
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
