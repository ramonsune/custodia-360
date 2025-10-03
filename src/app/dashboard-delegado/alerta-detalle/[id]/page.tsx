'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

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

export default function DetalleAlerta() {
  const router = useRouter()
  const params = useParams()
  const alertaId = params?.id as string

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [alerta, setAlerta] = useState<Alerta | null>(null)
  const [observaciones, setObservaciones] = useState('')

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (session) {
      try {
        const data = JSON.parse(session)
        if (data.expiracion && new Date(data.expiracion) <= new Date()) {
          localStorage.removeItem('userSession')
          router.push('/login-delegados')
          return
        }
        setSessionData(data)
        cargarAlerta()
      } catch (error) {
        localStorage.removeItem('userSession')
        router.push('/login-delegados')
        return
      }
    } else {
      router.push('/login-delegados')
    }
    setLoading(false)
  }, [router, alertaId])

  const cargarAlerta = () => {
    const tipoUsuario = sessionData?.tipo === 'principal' ? 'principal' : 'suplente'
    const alertasGuardadas = localStorage.getItem(`alertas_${tipoUsuario}`)
    if (alertasGuardadas) {
      const alertas = JSON.parse(alertasGuardadas)
      const alertaEncontrada = alertas.find((a: Alerta) => a.id === alertaId)
      if (alertaEncontrada) {
        setAlerta(alertaEncontrada)
      }
    }
  }

  const actualizarEstadoAlerta = (nuevoEstado: string) => {
    if (!alerta) return

    const tipoUsuario = sessionData?.tipo === 'principal' ? 'principal' : 'suplente'
    const alertasGuardadas = localStorage.getItem(`alertas_${tipoUsuario}`)
    if (alertasGuardadas) {
      const alertas = JSON.parse(alertasGuardadas)
      const alertasActualizadas = alertas.map((a: Alerta) =>
        a.id === alertaId ? { ...a, estado: nuevoEstado } : a
      )
      localStorage.setItem(`alertas_${tipoUsuario}`, JSON.stringify(alertasActualizadas))
      setAlerta({ ...alerta, estado: nuevoEstado as any })
      alert(`Estado de la alerta actualizado a: ${nuevoEstado.replace('_', ' ').toUpperCase()}`)
    }
  }

  const guardarObservaciones = () => {
    if (!observaciones.trim()) return

    const observacionData = {
      fecha: new Date().toISOString(),
      contenido: observaciones,
      autor: sessionData?.nombre || 'Usuario'
    }

    const observacionesGuardadas = localStorage.getItem(`observaciones_alerta_${alertaId}`) || '[]'
    const observacionesArray = JSON.parse(observacionesGuardadas)
    observacionesArray.push(observacionData)
    localStorage.setItem(`observaciones_alerta_${alertaId}`, JSON.stringify(observacionesArray))

    setObservaciones('')
    alert('Observaciones guardadas correctamente')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando alerta...</p>
        </div>
      </div>
    )
  }

  if (!alerta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Alerta no encontrada</h2>
          <Link href="/dashboard-delegado" className="text-blue-600 hover:text-blue-800">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                  C
                </div>
                <span className="text-xl font-bold text-gray-900">Custodia360</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard-delegado" className="text-blue-600 hover:text-blue-800">
                Volver al Dashboard
              </Link>
              <span className="text-sm text-gray-600">
                {sessionData?.nombre} - Delegado {sessionData?.tipo === 'principal' ? 'Principal' : 'Suplente'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">{sessionData?.entidad || 'Mi Entidad'}</h2>
          <h1 className="text-3xl font-bold text-gray-900">Detalle de Alerta</h1>
          <p className="text-gray-600 mt-2">Información completa de la alerta LOPIVI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información de la Alerta */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Información de la Alerta</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <p className="text-lg font-medium text-gray-900">{alerta.titulo}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <p className="text-gray-900 leading-relaxed">{alerta.descripcion}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Acción Requerida</label>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-900 font-medium">{alerta.accionRequerida}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      alerta.tipo === 'urgente' ? 'bg-red-100 text-red-800' :
                      alerta.tipo === 'importante' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alerta.tipo.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      alerta.estado === 'pendiente' ? 'bg-red-100 text-red-800' :
                      alerta.estado === 'en_revision' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alerta.estado.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((nivel) => (
                          <div
                            key={nivel}
                            className={`w-4 h-4 rounded-full mr-1 ${
                              nivel <= alerta.prioridad ? 'bg-red-500' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {alerta.prioridad}/5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Creación</label>
                    <p className="text-gray-900">{new Date(alerta.fechaCreacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asignada a</label>
                  <p className="text-gray-900 font-medium">{alerta.asignadoA}</p>
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Agregar Observaciones</h3>
              <div className="space-y-4">
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Escriba sus observaciones sobre esta alerta..."
                />
                <button
                  onClick={guardarObservaciones}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Guardar Observaciones
                </button>
              </div>
            </div>
          </div>

          {/* Panel de Acciones */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Acciones de Gestión</h3>
              <div className="space-y-3">
                {alerta.estado === 'pendiente' && (
                  <button
                    onClick={() => actualizarEstadoAlerta('en_revision')}
                    className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                  >
                    Marcar en Revisión
                  </button>
                )}
                {alerta.estado !== 'resuelta' && (
                  <button
                    onClick={() => actualizarEstadoAlerta('resuelta')}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Marcar como Resuelta
                  </button>
                )}
                {alerta.estado === 'resuelta' && (
                  <div className="text-center text-green-600 font-medium py-2">
                    Alerta Resuelta
                  </div>
                )}
                <button
                  onClick={() => alert('Funcionalidad de generar informe en desarrollo')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Generar Informe
                </button>
                <button
                  onClick={() => alert('Funcionalidad de escalar alerta en desarrollo')}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Escalar Alerta
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Información de Seguimiento</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de la Alerta:</span>
                  <span className="font-medium">{alerta.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiempo transcurrido:</span>
                  <span className="font-medium">
                    {Math.floor((new Date().getTime() - new Date(alerta.fechaCreacion).getTime()) / (1000 * 60 * 60 * 24))} días
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Última modificación:</span>
                  <span className="font-medium">{new Date().toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            </div>

            {alerta.tipo === 'urgente' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-900 mb-2">Alerta Urgente</h4>
                <p className="text-red-800 text-sm">
                  Esta alerta requiere atención inmediata. Asegúrese de tomar las acciones necesarias lo antes posible.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
