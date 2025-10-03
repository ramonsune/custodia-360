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

interface Caso {
  id: string
  titulo: string
  descripcion: string
  estado: 'abierto' | 'en_proceso' | 'cerrado'
  prioridad: 'alta' | 'media' | 'baja'
  fechaCreacion: string
  asignadoA: string
  categoria: string
}

export default function GestionarCasoSuplente() {
  const router = useRouter()
  const params = useParams()
  const casoId = params?.id as string

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [caso, setCaso] = useState<Caso | null>(null)
  const [notas, setNotas] = useState('')
  const [nuevaAccion, setNuevaAccion] = useState('')

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
        cargarCaso()
      } catch (error) {
        localStorage.removeItem('userSession')
        router.push('/login-delegados')
        return
      }
    } else {
      router.push('/login-delegados')
    }
    setLoading(false)
  }, [router, casoId])

  const cargarCaso = () => {
    const tipoUsuario = 'suplente'
    const casosGuardados = localStorage.getItem(`casosActivos_${tipoUsuario}`)
    if (casosGuardados) {
      const casos = JSON.parse(casosGuardados)
      const casoEncontrado = casos.find((c: Caso) => c.id === casoId)
      if (casoEncontrado) {
        setCaso(casoEncontrado)
      }
    }
  }

  const actualizarEstadoCaso = (nuevoEstado: string) => {
    if (!caso) return

    const tipoUsuario = 'suplente'
    const casosGuardados = localStorage.getItem(`casosActivos_${tipoUsuario}`)
    if (casosGuardados) {
      const casos = JSON.parse(casosGuardados)
      const casosActualizados = casos.map((c: Caso) =>
        c.id === casoId ? { ...c, estado: nuevoEstado } : c
      )
      localStorage.setItem(`casosActivos_${tipoUsuario}`, JSON.stringify(casosActualizados))
      setCaso({ ...caso, estado: nuevoEstado as any })
      alert(`Estado del caso actualizado a: ${nuevoEstado.replace('_', ' ').toUpperCase()}`)
    }
  }

  const guardarNota = () => {
    if (!notas.trim()) return

    const notaData = {
      fecha: new Date().toISOString(),
      contenido: notas,
      autor: sessionData?.nombre || 'Usuario'
    }

    const notasGuardadas = localStorage.getItem(`notas_caso_${casoId}`) || '[]'
    const notasArray = JSON.parse(notasGuardadas)
    notasArray.push(notaData)
    localStorage.setItem(`notas_caso_${casoId}`, JSON.stringify(notasArray))

    setNotas('')
    alert('Nota guardada correctamente')
  }

  const agregarAccion = () => {
    if (!nuevaAccion.trim()) return

    const accionData = {
      fecha: new Date().toISOString(),
      accion: nuevaAccion,
      autor: sessionData?.nombre || 'Usuario'
    }

    const accionesGuardadas = localStorage.getItem(`acciones_caso_${casoId}`) || '[]'
    const accionesArray = JSON.parse(accionesGuardadas)
    accionesArray.push(accionData)
    localStorage.setItem(`acciones_caso_${casoId}`, JSON.stringify(accionesArray))

    setNuevaAccion('')
    alert('Acción registrada correctamente')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando caso...</p>
        </div>
      </div>
    )
  }

  if (!caso) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Caso no encontrado</h2>
          <Link href="/dashboard-suplente" className="text-blue-600 hover:text-blue-800">
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
              <Link href="/dashboard-suplente" className="text-blue-600 hover:text-blue-800">
                Volver al Dashboard
              </Link>
              <span className="text-sm text-gray-600">
                {sessionData?.nombre} - Delegado Suplente
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">{sessionData?.entidad || 'Mi Entidad'}</h2>
          <h1 className="text-3xl font-bold text-gray-900">Gestionar Caso</h1>
          <p className="text-gray-600 mt-2">Gestión detallada del caso LOPIVI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del Caso */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Información del Caso</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <p className="text-gray-900 font-medium">{caso.titulo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <p className="text-gray-900">{caso.descripcion}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      caso.estado === 'abierto' ? 'bg-red-100 text-red-800' :
                      caso.estado === 'en_proceso' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {caso.estado.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      caso.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                      caso.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {caso.prioridad.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Creación</label>
                    <p className="text-gray-900">{new Date(caso.fechaCreacion).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asignado a</label>
                    <p className="text-gray-900">{caso.asignadoA}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notas */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Agregar Nota</h3>
              <div className="space-y-4">
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Escriba sus notas sobre el caso..."
                />
                <button
                  onClick={guardarNota}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Guardar Nota
                </button>
              </div>
            </div>

            {/* Registrar Acción */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Registrar Acción</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={nuevaAccion}
                  onChange={(e) => setNuevaAccion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descripción de la acción realizada..."
                />
                <button
                  onClick={agregarAccion}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Registrar Acción
                </button>
              </div>
            </div>
          </div>

          {/* Panel de Acciones */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Acciones de Gestión</h3>
              <div className="space-y-3">
                {caso.estado === 'abierto' && (
                  <button
                    onClick={() => actualizarEstadoCaso('en_proceso')}
                    className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                  >
                    Marcar en Proceso
                  </button>
                )}
                {caso.estado === 'en_proceso' && (
                  <button
                    onClick={() => actualizarEstadoCaso('cerrado')}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Cerrar Caso
                  </button>
                )}
                {caso.estado === 'cerrado' && (
                  <div className="text-center text-green-600 font-medium py-2">
                    Caso Cerrado
                  </div>
                )}
                <button
                  onClick={() => alert('Funcionalidad de notificación al principal en desarrollo')}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Notificar al Principal
                </button>
                <button
                  onClick={() => alert('Funcionalidad de envío de informe en desarrollo')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Enviar Informe
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Información Adicional</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID del Caso:</span>
                  <span className="font-medium">{caso.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-medium">{caso.categoria}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Última modificación:</span>
                  <span className="font-medium">{new Date().toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
