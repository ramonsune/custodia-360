'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  certificacionVigente: boolean
}

interface Modulo {
  id: string
  titulo: string
  descripcion: string
  archivo: string
  orden: number
}

const modulos: Modulo[] = [
  {
    id: 'mod-1',
    titulo: 'Fundamentos de la Protección de Datos',
    descripcion: 'Introducción a los conceptos básicos del RGPD y la protección de datos personales.',
    archivo: 'modulo-1-fundamentos.pdf',
    orden: 1
  },
  {
    id: 'mod-2',
    titulo: 'Derechos de los Interesados',
    descripcion: 'Análisis detallado de los derechos de acceso, rectificación, supresión y portabilidad.',
    archivo: 'modulo-2-derechos.pdf',
    orden: 2
  },
  {
    id: 'mod-3',
    titulo: 'Medidas de Seguridad y Técnicas',
    descripcion: 'Implementación de medidas técnicas y organizativas para garantizar la seguridad.',
    archivo: 'modulo-3-seguridad.pdf',
    orden: 3
  },
  {
    id: 'mod-4',
    titulo: 'Gestión de Incidentes y Brechas',
    descripcion: 'Procedimientos para la detección, notificación y gestión de brechas de seguridad.',
    archivo: 'modulo-4-incidentes.pdf',
    orden: 4
  },
  {
    id: 'mod-5',
    titulo: 'Evaluación de Impacto y Registro',
    descripcion: 'Metodología para realizar evaluaciones de impacto y mantener el registro de actividades.',
    archivo: 'modulo-5-evaluacion.pdf',
    orden: 5
  }
]

export default function CampusFormacionPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [modulosDescargados, setModulosDescargados] = useState<string[]>([])
  const [descargandoModulo, setDescargandoModulo] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = (): SessionData | null => {
      try {
        const persistentSession = localStorage.getItem('userSession')
        if (persistentSession) {
          const session = JSON.parse(persistentSession)
          if (new Date(session.expiracion) > new Date()) {
            return session
          }
        }
        const tempSession = sessionStorage.getItem('userSession')
        if (tempSession) {
          const session = JSON.parse(tempSession)
          if (new Date(session.expiracion) > new Date()) {
            return session
          }
        }
        return null
      } catch (error) {
        console.error('Error verificando sesión:', error)
        return null
      }
    }

    const session = checkSession()
    if (!session) {
      router.push('/login')
      return
    }

    setSessionData(session)

    // Cargar progreso de módulos desde localStorage
    const progreso = localStorage.getItem(`formacion-progreso-${session.id}`)
    if (progreso) {
      try {
        const progresoData = JSON.parse(progreso)
        setModulosDescargados(progresoData.modulosDescargados || [])
      } catch (error) {
        console.error('Error cargando progreso:', error)
      }
    }

    setLoading(false)
  }, [router])

  const descargarModulo = async (moduloId: string) => {
    if (!sessionData) return

    setDescargandoModulo(moduloId)

    // Simular descarga
    await new Promise(resolve => setTimeout(resolve, 2000))

    const nuevosModulosDescargados = [...modulosDescargados]
    if (!nuevosModulosDescargados.includes(moduloId)) {
      nuevosModulosDescargados.push(moduloId)
      setModulosDescargados(nuevosModulosDescargados)

      // Guardar progreso
      const progreso = {
        modulosDescargados: nuevosModulosDescargados,
        ultimaActividad: new Date().toISOString()
      }
      localStorage.setItem(`formacion-progreso-${sessionData.id}`, JSON.stringify(progreso))
    }

    setDescargandoModulo(null)

    // Simular descarga de archivo
    const modulo = modulos.find(m => m.id === moduloId)
    if (modulo) {
      const content = `MÓDULO DE FORMACIÓN LOPIVI: ${modulo.titulo}\n\n${modulo.descripcion}\n\nEste es un archivo de demostración del módulo de formación.\nEn un sistema real, este sería el PDF completo del módulo.\n\nDelegado: ${sessionData.nombre}\nEntidad: ${sessionData.entidad}\nFecha: ${new Date().toLocaleDateString('es-ES')}`
      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = modulo.archivo
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  const continuarAlTest = () => {
    router.push('/formacion-lopivi/test-unico')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando campus...</p>
        </div>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error de autenticación</p>
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Volver al Login
          </Link>
        </div>
      </div>
    )
  }

  const todosDescargados = modulosDescargados.length === modulos.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Campus Custodia360</h1>
                <p className="text-sm text-gray-600">Módulos de Formación LOPIVI</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{sessionData.nombre}</p>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                sessionData.tipo === 'principal'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {sessionData.tipo === 'principal' ? 'Delegado Principal' : 'Delegado Suplente'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progreso */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Progreso de Formación</h3>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Módulos Descargados</span>
              <span>{modulosDescargados.length}/{modulos.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(modulosDescargados.length / modulos.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Introducción */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Módulos de Formación LOPIVI</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">📚 Instrucciones Importantes</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• <strong>Descarga todos los módulos:</strong> Debe descargar y estudiar los 5 módulos de formación</p>
              <p>• <strong>Estudie con atención:</strong> El contenido es fundamental para superar el test</p>
              <p>• <strong>Progreso guardado:</strong> Su progreso se guarda automáticamente</p>
              <p>• <strong>Acceso al test:</strong> Solo podrá realizar el test cuando complete todos los módulos</p>
            </div>
          </div>
        </div>

        {/* Módulos */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {modulos.map((modulo) => {
            const descargado = modulosDescargados.includes(modulo.id)
            const descargando = descargandoModulo === modulo.id

            return (
              <div key={modulo.id} className={`bg-white rounded-lg shadow-sm border p-6 ${descargado ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2 mb-2">
                      <span>Módulo {modulo.orden}</span>
                      {descargado && <span className="text-green-600">✓</span>}
                    </h3>
                    <h4 className="font-semibold text-gray-700 mb-2">{modulo.titulo}</h4>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{modulo.descripcion}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <span>📄</span>
                    <span>PDF</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>⏱️</span>
                    <span>30-45 min</span>
                  </div>
                </div>

                <button
                  onClick={() => descargarModulo(modulo.id)}
                  disabled={descargando}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    descargado
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : descargando
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {descargando ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Descargando...
                    </div>
                  ) : descargado ? (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">✓</span>
                      Descargado
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">⬇️</span>
                      Descargar Módulo
                    </div>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Progreso y siguiente paso */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Estado de Progreso</h3>

          {todosDescargados ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-green-600 text-xl mr-3">🎉</span>
                  <div>
                    <h4 className="font-semibold text-green-800">¡Excelente! Formación Completada</h4>
                    <p className="text-green-700 text-sm">
                      Ha descargado todos los módulos de formación. Ahora puede realizar el test de evaluación.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={continuarAlTest}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
                >
                  Realizar Test de Evaluación 📝
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-orange-600 text-xl mr-3">📚</span>
                <div>
                  <h4 className="font-semibold text-orange-800">Continúe con la Formación</h4>
                  <p className="text-orange-700 text-sm">
                    Complete la descarga de todos los módulos para acceder al test de evaluación.
                    Progreso: {modulosDescargados.length}/{modulos.length} módulos
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
