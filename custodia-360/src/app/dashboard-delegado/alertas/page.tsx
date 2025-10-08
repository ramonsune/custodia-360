'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Alerta {
  id: string
  titulo: string
  descripcion: string
  tipo: 'urgente' | 'importante' | 'informativo'
  estado: 'pendiente' | 'en_revision' | 'resuelta'
  prioridad: number
  fechaCreacion: string
  accionRequerida: string
  asignadoA: string
}

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  permisos: string[]
  certificacionVigente: boolean
  inicioSesion: string
  expiracion: string
}

export default function AlertasPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [filtroEstado, setFiltroEstado] = useState<string>('todas')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (session) {
      try {
        const data = JSON.parse(session)
        if (data.tipo !== 'principal') {
          router.push('/')
          return
        }
        setSessionData(data)
        cargarAlertas()
      } catch (error) {
        console.error('Error loading session:', error)
        router.push('/login-delegados')
        return
      }
    } else {
      router.push('/login-delegados')
      return
    }
  }, [router])

  const cargarAlertas = () => {
    const alertasGuardadas = localStorage.getItem('alertas_principal')
    if (alertasGuardadas) {
      setAlertas(JSON.parse(alertasGuardadas))
    } else {
      const alertasIniciales = [
        {
          id: 'alerta-001',
          titulo: 'Renovación Certificación Personal',
          descripcion: 'Varios miembros del personal necesitan renovar su certificación LOPIVI antes del 15 de marzo. Se requiere programar sesiones de formación de actualización.',
          tipo: 'importante' as const,
          estado: 'pendiente' as const,
          prioridad: 4,
          fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          accionRequerida: 'Programar formación de renovación',
          asignadoA: 'Delegado Principal'
        },
        {
          id: 'alerta-002',
          titulo: 'Revisión Protocolos Actualizados',
          descripcion: 'Nuevas directrices del Ministerio requieren actualización de protocolos de actuación ante situaciones de riesgo. Debe implementarse en máximo 30 días.',
          tipo: 'urgente' as const,
          estado: 'pendiente' as const,
          prioridad: 5,
          fechaCreacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          accionRequerida: 'Revisar y actualizar protocolos de actuación',
          asignadoA: 'Delegado Principal'
        },
        {
          id: 'alerta-003',
          titulo: 'Auditoría Anual Programada',
          descripcion: 'Se ha programado la auditoría anual de cumplimiento LOPIVI para el próximo mes. Preparar documentación completa.',
          tipo: 'informativo' as const,
          estado: 'en_revision' as const,
          prioridad: 3,
          fechaCreacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          accionRequerida: 'Preparar documentación para auditoría',
          asignadoA: 'Delegado Principal'
        },
        {
          id: 'alerta-004',
          titulo: 'Personal Sin Certificado Penales',
          descripcion: 'Detectados 2 miembros del personal sin certificado negativo de delincuentes sexuales actualizado. Situación debe resolverse inmediatamente.',
          tipo: 'urgente' as const,
          estado: 'pendiente' as const,
          prioridad: 5,
          fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          accionRequerida: 'Solicitar certificados actualizados urgentemente',
          asignadoA: 'Delegado Principal'
        },
        {
          id: 'alerta-005',
          titulo: 'Comunicación Familias Pendiente',
          descripcion: 'Envío mensual de comunicación a familias sobre actividades y medidas de protección implementadas.',
          tipo: 'informativo' as const,
          estado: 'pendiente' as const,
          prioridad: 2,
          fechaCreacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          accionRequerida: 'Enviar comunicación mensual',
          asignadoA: 'Delegado Principal'
        },
        {
          id: 'alerta-006',
          titulo: 'Revisión Mapa de Riesgos',
          descripcion: 'Revisión trimestral del mapa de riesgos de la entidad. Evaluar nuevos riesgos identificados y actualizar medidas preventivas.',
          tipo: 'importante' as const,
          estado: 'resuelta' as const,
          prioridad: 3,
          fechaCreacion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          accionRequerida: 'Actualizar mapa de riesgos',
          asignadoA: 'Delegado Principal'
        }
      ]
      setAlertas(alertasIniciales)
      localStorage.setItem('alertas_principal', JSON.stringify(alertasIniciales))
    }
  }

  const actualizarEstadoAlerta = (alertaId: string, nuevoEstado: string) => {
    const alertasActualizadas = alertas.map(alerta =>
      alerta.id === alertaId ? { ...alerta, estado: nuevoEstado as any } : alerta
    )
    setAlertas(alertasActualizadas)
    localStorage.setItem('alertas_principal', JSON.stringify(alertasActualizadas))
  }

  const alertasFiltradas = alertas.filter(alerta => {
    const coincideEstado = filtroEstado === 'todas' || alerta.estado === filtroEstado
    const coincideTipo = filtroTipo === 'todos' || alerta.tipo === filtroTipo
    return coincideEstado && coincideTipo
  })

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'urgente': return 'bg-red-50 text-red-800 border-red-200'
      case 'importante': return 'bg-orange-50 text-orange-800 border-orange-200'
      case 'informativo': return 'bg-blue-50 text-blue-800 border-blue-200'
      default: return 'bg-gray-50 text-gray-800 border-gray-200'
    }
  }

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-red-50 text-red-800 border-red-200'
      case 'en_revision': return 'bg-yellow-50 text-yellow-800 border-yellow-200'
      case 'resuelta': return 'bg-green-50 text-green-800 border-green-200'
      default: return 'bg-gray-50 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard-delegado" className="text-blue-600 hover:text-blue-800 mr-4">
                ← Volver al Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Gestión de Alertas</h1>
            </div>
            <span className="text-sm text-gray-600">
              {sessionData?.nombre} - Delegado Principal
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">{sessionData?.entidad || 'Mi Entidad'}</h2>
          <h1 className="text-3xl font-bold text-gray-900">Alertas y Notificaciones LOPIVI</h1>
          <p className="text-gray-600 mt-2">Gestión centralizada de alertas de cumplimiento normativo</p>
        </div>

        {/* Resumen de alertas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Total Alertas</h3>
            <p className="text-3xl font-bold text-gray-900">{alertas.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
            <h3 className="font-bold text-red-900 mb-2">Pendientes</h3>
            <p className="text-3xl font-bold text-red-600">
              {alertas.filter(a => a.estado === 'pendiente').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-yellow-200">
            <h3 className="font-bold text-yellow-900 mb-2">En Revisión</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {alertas.filter(a => a.estado === 'en_revision').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-200">
            <h3 className="font-bold text-green-900 mb-2">Resueltas</h3>
            <p className="text-3xl font-bold text-green-600">
              {alertas.filter(a => a.estado === 'resuelta').length}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="todas">Todas las alertas</option>
                <option value="pendiente">Pendientes</option>
                <option value="en_revision">En Revisión</option>
                <option value="resuelta">Resueltas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="todos">Todos los tipos</option>
                <option value="urgente">Urgentes</option>
                <option value="importante">Importantes</option>
                <option value="informativo">Informativos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de alertas */}
        <div className="space-y-6">
          {alertasFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center">
              <p className="text-gray-600">No se encontraron alertas con los filtros seleccionados.</p>
            </div>
          ) : (
            alertasFiltradas.map((alerta) => (
              <div key={alerta.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{alerta.titulo}</h3>
                      <span className={`text-xs px-2 py-1 rounded border ${getColorTipo(alerta.tipo)}`}>
                        {alerta.tipo.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded border ${getColorEstado(alerta.estado)}`}>
                        {alerta.estado.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{alerta.descripcion}</p>
                    <div className="text-sm text-gray-500">
                      <p><strong>Acción requerida:</strong> {alerta.accionRequerida}</p>
                      <p><strong>Fecha:</strong> {formatearFecha(alerta.fechaCreacion)}</p>
                      <p><strong>Prioridad:</strong> {alerta.prioridad}/5</p>
                    </div>
                  </div>
                </div>

                {alerta.estado !== 'resuelta' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    {alerta.estado === 'pendiente' && (
                      <button
                        onClick={() => actualizarEstadoAlerta(alerta.id, 'en_revision')}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm"
                      >
                        Marcar En Revisión
                      </button>
                    )}
                    {alerta.estado === 'en_revision' && (
                      <button
                        onClick={() => actualizarEstadoAlerta(alerta.id, 'resuelta')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Marcar Resuelta
                      </button>
                    )}
                    {alerta.estado === 'pendiente' && (
                      <button
                        onClick={() => actualizarEstadoAlerta(alerta.id, 'resuelta')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Resolver Directamente
                      </button>
                    )}
                    <button
                      onClick={() => alert(`Enviando recordatorio sobre: ${alerta.titulo}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Enviar Recordatorio
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
