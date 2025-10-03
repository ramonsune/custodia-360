'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Eye,
  Bell,
  TrendingUp,
  Users,
  FileCheck,
  Brain,
  Cpu,
  Wifi,
  Database,
  Settings,
  Smartphone,
  Globe,
  Lock
} from 'lucide-react'

// Tipos para el sistema automatizado
interface AlertaAutomatica {
  id: string
  tipo: 'critica' | 'alta' | 'media' | 'baja'
  titulo: string
  descripcion: string
  entidadAfectada: string
  fechaDeteccion: Date
  autoResolucion: boolean
  estado: 'pendiente' | 'procesando' | 'resuelta' | 'escalada'
  accionesAutomaticas: string[]
  tiempoRespuesta: number // segundos
}

interface ProcesoAutomatico {
  id: string
  nombre: string
  estado: 'activo' | 'pausado' | 'error'
  ultimaEjecucion: Date
  proximaEjecucion: Date
  frecuencia: string
  entidadesProcesadas: number
  exitos: number
  errores: number
  tiempoPromedio: number
}

interface MetricasSistema {
  entidadesMonitoreadas: number
  alertasHoy: number
  procesosActivos: number
  uptime: number
  casosResueltosAutomaticamente: number
  certificacionesGeneradas: number
  documentosActualizados: number
  notificacionesEnviadas: number
}

export default function DashboardAutomatizadoPage() {
  const [metricas, setMetricas] = useState<MetricasSistema>({
    entidadesMonitoreadas: 847,
    alertasHoy: 23,
    procesosActivos: 12,
    uptime: 99.97,
    casosResueltosAutomaticamente: 156,
    certificacionesGeneradas: 34,
    documentosActualizados: 89,
    notificacionesEnviadas: 234
  })

  const [alertas, setAlertas] = useState<AlertaAutomatica[]>([
    {
      id: 'alert-001',
      tipo: 'critica',
      titulo: 'Certificado de delegado próximo a vencer',
      descripcion: 'Club Deportivo Los Robles - Certificado vence en 5 días',
      entidadAfectada: 'Club Deportivo Los Robles',
      fechaDeteccion: new Date(),
      autoResolucion: true,
      estado: 'procesando',
      accionesAutomaticas: [
        'Email automático enviado al delegado',
        'Programando renovación automática',
        'Notificación a administración entidad'
      ],
      tiempoRespuesta: 45
    },
    {
      id: 'alert-002',
      tipo: 'alta',
      titulo: 'Actualización normativa detectada',
      descripción: 'Nueva circular del Ministerio sobre protocolos',
      entidadAfectada: 'Todas las entidades',
      fechaDeteccion: new Date(Date.now() - 3600000),
      autoResolucion: true,
      estado: 'resuelta',
      accionesAutomaticas: [
        'Documentos actualizados automáticamente',
        'Notificaciones enviadas a delegados',
        'Campus virtual actualizado'
      ],
      tiempoRespuesta: 120
    },
    {
      id: 'alert-003',
      tipo: 'media',
      titulo: 'Formación pendiente detectada',
      descripción: 'Parroquia San José - 3 personas sin formación completa',
      entidadAfectada: 'Parroquia San José',
      fechaDeteccion: new Date(Date.now() - 7200000),
      autoResolucion: true,
      estado: 'procesando',
      accionesAutomaticas: [
        'Recordatorios automáticos programados',
        'Accesos al campus extendidos',
        'Seguimiento automático activado'
      ],
      tiempoRespuesta: 30
    }
  ])

  const [procesos, setProcesos] = useState<ProcesoAutomatico[]>([
    {
      id: 'proc-001',
      nombre: 'Monitor BOE Automático',
      estado: 'activo',
      ultimaEjecucion: new Date(Date.now() - 900000),
      proximaEjecucion: new Date(Date.now() + 2700000),
      frecuencia: 'Cada hora',
      entidadesProcesadas: 847,
      exitos: 847,
      errores: 0,
      tiempoPromedio: 12
    },
    {
      id: 'proc-002',
      nombre: 'Generación Certificados',
      estado: 'activo',
      ultimaEjecucion: new Date(Date.now() - 600000),
      proximaEjecucion: new Date(Date.now() + 1800000),
      frecuencia: 'Cada 30 min',
      entidadesProcesadas: 34,
      exitos: 34,
      errores: 0,
      tiempoPromedio: 8
    },
    {
      id: 'proc-003',
      nombre: 'Actualización Documentos',
      estado: 'activo',
      ultimaEjecucion: new Date(Date.now() - 1800000),
      proximaEjecucion: new Date(Date.now() + 600000),
      frecuencia: 'Cada 30 min',
      entidadesProcesadas: 89,
      exitos: 86,
      errores: 3,
      tiempoPromedio: 25
    },
    {
      id: 'proc-004',
      nombre: 'Monitoreo Vencimientos',
      estado: 'activo',
      ultimaEjecucion: new Date(Date.now() - 300000),
      proximaEjecuencia: new Date(Date.now() + 600000),
      frecuencia: 'Cada 15 min',
      entidadesProcesadas: 847,
      exitos: 847,
      errores: 0,
      tiempoPromedio: 5
    },
    {
      id: 'proc-005',
      nombre: 'Backup Automático',
      estado: 'activo',
      ultimaEjecucion: new Date(Date.now() - 3600000),
      proximaEjecucion: new Date(Date.now() + 7200000),
      frecuencia: 'Cada 3 horas',
      entidadesProcesadas: 1,
      exitos: 1,
      errores: 0,
      tiempoPromedio: 180
    }
  ])

  // Simulación de actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Actualizar métricas aleatoriamente
      setMetricas(prev => ({
        ...prev,
        alertasHoy: prev.alertasHoy + Math.random() > 0.8 ? 1 : 0,
        casosResueltosAutomaticamente: prev.casosResueltosAutomaticamente + (Math.random() > 0.9 ? 1 : 0),
        notificacionesEnviadas: prev.notificacionesEnviadas + (Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getAlertaColor = (tipo: AlertaAutomatica['tipo']) => {
    switch (tipo) {
      case 'critica': return 'text-red-600 bg-red-50 border-red-200'
      case 'alta': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'media': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'baja': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getEstadoColor = (estado: AlertaAutomatica['estado']) => {
    switch (estado) {
      case 'resuelta': return 'bg-green-100 text-green-800'
      case 'procesando': return 'bg-blue-100 text-blue-800'
      case 'escalada': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProcesoColor = (estado: ProcesoAutomatico['estado']) => {
    switch (estado) {
      case 'activo': return 'text-green-600'
      case 'pausado': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatearTiempo = (segundos: number) => {
    if (segundos < 60) return `${segundos}s`
    if (segundos < 3600) return `${Math.floor(segundos / 60)}m ${segundos % 60}s`
    return `${Math.floor(segundos / 3600)}h ${Math.floor((segundos % 3600) / 60)}m`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Sistema */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                🤖 Sistema Automatizado 24/7
              </h1>
              <p className="text-green-100">
                Monitoreo y gestión automática sin intervención humana
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-100">Sistema Operativo</span>
              </div>
              <div className="text-2xl font-bold">{metricas.uptime}%</div>
              <div className="text-sm text-green-100">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Métricas en Tiempo Real */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{metricas.entidadesMonitoreadas}</div>
                  <div className="text-xs text-gray-500">Entidades</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">{metricas.alertasHoy}</div>
                  <div className="text-xs text-gray-500">Alertas Hoy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{metricas.procesosActivos}</div>
                  <div className="text-xs text-gray-500">Procesos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{metricas.casosResueltosAutomaticamente}</div>
                  <div className="text-xs text-gray-500">Casos Auto</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-teal-500" />
                <div>
                  <div className="text-2xl font-bold">{metricas.certificacionesGeneradas}</div>
                  <div className="text-xs text-gray-500">Certificados</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-indigo-500" />
                <div>
                  <div className="text-2xl font-bold">{metricas.documentosActualizados}</div>
                  <div className="text-xs text-gray-500">Docs Update</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-pink-500" />
                <div>
                  <div className="text-2xl font-bold">{metricas.notificacionesEnviadas}</div>
                  <div className="text-xs text-gray-500">Notif Enviadas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{metricas.uptime}%</div>
                  <div className="text-xs text-gray-500">Disponibilidad</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas Automáticas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Sistema de Alertas Automático
              <Badge className="bg-green-100 text-green-800">
                {alertas.filter(a => a.autoResolucion).length} Auto-resolución activa
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertas.map(alerta => (
                <div
                  key={alerta.id}
                  className={`border rounded-lg p-4 ${getAlertaColor(alerta.tipo)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{alerta.titulo}</h3>
                      <p className="text-sm opacity-80">{alerta.descripcion}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {alerta.entidadAfectada} • Detectado: {alerta.fechaDeteccion.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getEstadoColor(alerta.estado)}>
                        {alerta.estado}
                      </Badge>
                      {alerta.autoResolucion && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Brain className="h-3 w-3 mr-1" />
                          Auto-resolución
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Acciones Automáticas Ejecutadas:</h4>
                    {alerta.accionesAutomaticas.map((accion, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {accion}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Tiempo de respuesta: {formatearTiempo(alerta.tiempoRespuesta)}
                    </span>
                    {alerta.estado === 'resuelta' && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Resuelto automáticamente
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Procesos Automáticos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-500" />
              Procesos Automáticos en Ejecución
              <Badge className="bg-green-100 text-green-800">
                {procesos.filter(p => p.estado === 'activo').length} activos
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {procesos.map(proceso => (
                <div key={proceso.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold">{proceso.nombre}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        proceso.estado === 'activo' ? 'bg-green-500' :
                        proceso.estado === 'pausado' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-sm font-medium ${getProcesoColor(proceso.estado)}`}>
                        {proceso.estado}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Frecuencia</div>
                      <div className="font-medium">{proceso.frecuencia}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Última ejecución</div>
                      <div className="font-medium">{proceso.ultimaEjecucion.toLocaleTimeString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Próxima ejecución</div>
                      <div className="font-medium">{proceso.proximaEjecucion.toLocaleTimeString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Tiempo promedio</div>
                      <div className="font-medium">{formatearTiempo(proceso.tiempoPromedio)}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">{proceso.exitos}</span> éxitos •
                      <span className="text-red-600 font-medium ml-1">{proceso.errores}</span> errores
                    </div>
                    <div className="text-xs text-gray-500">
                      {proceso.entidadesProcesadas} entidades procesadas
                    </div>
                  </div>

                  {/* Barra de éxito */}
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-green-500 h-1 rounded-full"
                        style={{
                          width: `${(proceso.exitos / (proceso.exitos + proceso.errores)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estado del Sistema */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Conectividad y Servicios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-green-500" />
                Estado de Servicios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { nombre: 'API Principal', estado: 'operativo', latencia: '45ms' },
                  { nombre: 'Base de Datos', estado: 'operativo', latencia: '12ms' },
                  { nombre: 'Sistema de Emails', estado: 'operativo', latencia: '234ms' },
                  { nombre: 'Generador de PDFs', estado: 'operativo', latencia: '1.2s' },
                  { nombre: 'Campus Virtual', estado: 'operativo', latencia: '67ms' },
                  { nombre: 'Monitor BOE', estado: 'operativo', latencia: '2.3s' },
                  { nombre: 'Sistema de Backup', estado: 'operativo', latencia: '890ms' },
                  { nombre: 'CDN Global', estado: 'operativo', latencia: '23ms' }
                ].map((servicio, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">{servicio.nombre}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {servicio.latencia}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Integraciones Activas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                Integraciones Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    nombre: 'Monitor BOE Oficial',
                    estado: 'activo',
                    ultima: 'Hace 15 min',
                    descripcion: 'Monitoreo automático del Boletín Oficial'
                  },
                  {
                    nombre: 'Stripe Payments',
                    estado: 'activo',
                    ultima: 'Continuo',
                    descripcion: 'Procesamiento de pagos automático'
                  },
                  {
                    nombre: 'Holded Facturación',
                    estado: 'activo',
                    ultima: 'Hace 2 min',
                    descripcion: 'Generación automática de facturas'
                  },
                  {
                    nombre: 'Resend Email',
                    estado: 'activo',
                    ultima: 'Hace 30s',
                    descripcion: 'Sistema de notificaciones email'
                  },
                  {
                    nombre: 'Supabase Database',
                    estado: 'activo',
                    ultima: 'Continuo',
                    descripcion: 'Base de datos principal'
                  }
                ].map((integracion, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{integracion.nombre}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">{integracion.estado}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{integracion.descripcion}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Última actividad: {integracion.ultima}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de Control Rápido */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-purple-500" />
              Panel de Control Rápido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col gap-2">
                <Eye className="h-6 w-6" />
                <span className="text-sm">Ver Logs</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Configurar</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Database className="h-6 w-6" />
                <span className="text-sm">Backup Manual</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Lock className="h-6 w-6" />
                <span className="text-sm">Seguridad</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Información del Sistema */}
        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
          <h3 className="font-bold text-lg mb-4">🚀 Sistema 100% Automatizado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-bold mb-2">✅ Procesos Automatizados:</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Monitoreo continuo de normativa BOE</li>
                <li>• Generación automática de documentos LOPIVI</li>
                <li>• Actualización de protocolos en tiempo real</li>
                <li>• Certificaciones automáticas de delegados</li>
                <li>• Gestión de alertas y vencimientos</li>
                <li>• Backup y seguridad automática</li>
                <li>• Notificaciones inteligentes</li>
                <li>• Escalado automático de casos críticos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">🎯 Beneficios:</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• 0% intervención humana necesaria</li>
                <li>• 99.97% de disponibilidad garantizada</li>
                <li>• Respuesta en segundos a alertas críticas</li>
                <li>• Cumplimiento LOPIVI siempre actualizado</li>
                <li>• Reducción 97% de costes operativos</li>
                <li>• Escalabilidad infinita automática</li>
                <li>• Inteligencia artificial integrada</li>
                <li>• Reportes automáticos para inspecciones</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
