'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PREGUNTAS_TEST, calcularPuntuacion, esAprobado } from '@/lib/formacion-lopivi'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  certificacionVigente: boolean
}

interface ProgresoTest {
  preguntaActual: number
  respuestas: number[]
  tiempoInicio: number
  pausado: boolean
  completado: boolean
  puntuacion?: number
  aprobado?: boolean
}

export default function TestUnicoPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [progresoTest, setProgresoTest] = useState<ProgresoTest | null>(null)
  const [loading, setLoading] = useState(true)
  const [mostrarResultado, setMostrarResultado] = useState(false)

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

  const cargarProgresoTest = (userId: string): ProgresoTest => {
    try {
      const progresoGuardado = localStorage.getItem(`test_${userId}`)
      if (progresoGuardado) {
        return JSON.parse(progresoGuardado)
      }
    } catch (error) {
      console.error('Error cargando progreso test:', error)
    }

    // Crear nuevo progreso de test
    return {
      preguntaActual: 0,
      respuestas: new Array(PREGUNTAS_TEST.length).fill(-1),
      tiempoInicio: Date.now(),
      pausado: false,
      completado: false
    }
  }

  const guardarProgresoTest = (progreso: ProgresoTest) => {
    if (!sessionData) return
    localStorage.setItem(`test_${sessionData.id}`, JSON.stringify(progreso))
    setProgresoTest(progreso)
  }

  useEffect(() => {
    const session = checkSession()

    if (!session) {
      router.push('/login')
      return
    }

    if (session.certificacionVigente) {
      router.push('/dashboard-delegado')
      return
    }

    setSessionData(session)
    const progreso = cargarProgresoTest(session.id)
    setProgresoTest(progreso)

    // Si ya completó el test, mostrar resultado
    if (progreso.completado) {
      setMostrarResultado(true)
    }

    setLoading(false)
  }, [router])

  // No redirección automática - la página se mantiene visible

  const responderPregunta = (respuesta: number) => {
    if (!progresoTest) return

    const nuevasRespuestas = [...progresoTest.respuestas]
    nuevasRespuestas[progresoTest.preguntaActual] = respuesta

    const nuevoProgreso = {
      ...progresoTest,
      respuestas: nuevasRespuestas
    }

    guardarProgresoTest(nuevoProgreso)
  }

  const siguientePregunta = () => {
    if (!progresoTest) return

    if (progresoTest.preguntaActual < PREGUNTAS_TEST.length - 1) {
      const nuevoProgreso = {
        ...progresoTest,
        preguntaActual: progresoTest.preguntaActual + 1
      }
      guardarProgresoTest(nuevoProgreso)
    }
  }

  const preguntaAnterior = () => {
    if (!progresoTest) return

    if (progresoTest.preguntaActual > 0) {
      const nuevoProgreso = {
        ...progresoTest,
        preguntaActual: progresoTest.preguntaActual - 1
      }
      guardarProgresoTest(nuevoProgreso)
    }
  }

  const irAPregunta = (numeroPregunta: number) => {
    if (!progresoTest) return

    const nuevoProgreso = {
      ...progresoTest,
      preguntaActual: numeroPregunta
    }
    guardarProgresoTest(nuevoProgreso)
  }

  const finalizarTest = () => {
    if (!progresoTest || !sessionData) return

    const puntuacion = calcularPuntuacion(progresoTest.respuestas, PREGUNTAS_TEST)
    const aprobado = esAprobado(puntuacion)

    const nuevoProgreso = {
      ...progresoTest,
      completado: true,
      puntuacion,
      aprobado
    }

    guardarProgresoTest(nuevoProgreso)

    // Si aprobó, actualizar sesión para activar certificación
    if (aprobado) {
      const sessionActualizada = {
        ...sessionData,
        certificacionVigente: true,
        permisos: sessionData.tipo === 'principal'
          ? ['ver_casos', 'crear_informes', 'protocolo_emergencia', 'gestionar_personal', 'acceso_completo']
          : ['ver_casos', 'crear_informes', 'protocolo_emergencia']
      }

      localStorage.setItem('userAuth', JSON.stringify(sessionActualizada))
      localStorage.setItem('userSession', JSON.stringify(sessionActualizada))
      sessionStorage.setItem('userSession', JSON.stringify(sessionActualizada))

      // Actualizar progreso de formación
      const progresoFormacion = localStorage.getItem(`formacion_${sessionData.id}`)
      if (progresoFormacion) {
        const progreso = JSON.parse(progresoFormacion)
        progreso.testCompletado = true
        progreso.certificadoObtenido = true
        localStorage.setItem(`formacion_${sessionData.id}`, JSON.stringify(progreso))
      }

      console.log('🎉 Test aprobado - Certificación activada')
    }

    setMostrarResultado(true)
  }

  const reiniciarTest = () => {
    if (!sessionData) return

    const nuevoProgreso: ProgresoTest = {
      preguntaActual: 0,
      respuestas: new Array(PREGUNTAS_TEST.length).fill(-1),
      tiempoInicio: Date.now(),
      pausado: false,
      completado: false
    }

    guardarProgresoTest(nuevoProgreso)
    setMostrarResultado(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando test de certificación...</p>
        </div>
      </div>
    )
  }

  if (!sessionData || !progresoTest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error de acceso</p>
          <Link href="/formacion-lopivi/bienvenida" className="bg-orange-600 text-white px-4 py-2 rounded-lg">
            Volver a Formación
          </Link>
        </div>
      </div>
    )
  }

  const preguntaActual = PREGUNTAS_TEST[progresoTest.preguntaActual]
  const respuestasCompletas = progresoTest.respuestas.filter(r => r !== -1).length
  const porcentajeCompletado = Math.round((respuestasCompletas / PREGUNTAS_TEST.length) * 100)

  // Mostrar resultado del test
  if (mostrarResultado && progresoTest.completado) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/formacion-lopivi/bienvenida" className="text-gray-600 hover:text-gray-900 mr-4">
                  ← Volver a Formación
                </Link>
                <h1 className="text-xl font-bold text-gray-900">Resultado del Test de Formación Custodia360</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">

            <h2 className={`text-2xl font-bold mb-4 ${
              progresoTest.aprobado ? 'text-green-900' : 'text-red-900'
            }`}>
              {progresoTest.aprobado ? '¡Test Aprobado!' : 'Test No Aprobado'}
            </h2>

            <div className="mb-6">
              <div className={`text-4xl font-bold mb-2 ${
                progresoTest.aprobado ? 'text-green-600' : 'text-red-600'
              }`}>
                {progresoTest.puntuacion}%
              </div>
              <p className="text-gray-600">
                {progresoTest.aprobado
                  ? `¡Excelente! Ha superado el mínimo requerido del 75%`
                  : `Necesita al menos 75% para aprobar. Puede intentarlo nuevamente.`
                }
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Resumen del Test</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{PREGUNTAS_TEST.length}</div>
                  <div className="text-sm text-gray-600">Preguntas totales</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {progresoTest.respuestas.filter((respuesta, index) =>
                      respuesta === PREGUNTAS_TEST[index]?.respuestaCorrecta
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600">Respuestas correctas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {progresoTest.respuestas.filter((respuesta, index) =>
                      respuesta !== -1 && respuesta !== PREGUNTAS_TEST[index]?.respuestaCorrecta
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600">Respuestas incorrectas</div>
                </div>
              </div>
            </div>

            {/* Mostrar preguntas incorrectas si está aprobado */}
            {progresoTest.aprobado && progresoTest.respuestas.some((respuesta, index) =>
              respuesta !== -1 && respuesta !== PREGUNTAS_TEST[index]?.respuestaCorrecta
            ) && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-orange-900 mb-4">Preguntas que falló (para mejorar su conocimiento):</h3>
                <div className="space-y-4 text-left">
                  {progresoTest.respuestas.map((respuesta, index) => {
                    if (respuesta !== -1 && respuesta !== PREGUNTAS_TEST[index]?.respuestaCorrecta) {
                      const pregunta = PREGUNTAS_TEST[index]
                      return (
                        <div key={index} className="border-l-4 border-orange-400 pl-4">
                          <p className="font-medium text-orange-900 mb-2">
                            Pregunta {index + 1}: {pregunta.pregunta}
                          </p>
                          <p className="text-sm text-red-600 mb-1">
                            Su respuesta: {pregunta.opciones[respuesta]}
                          </p>
                          <p className="text-sm text-green-600">
                            Respuesta correcta: {pregunta.opciones[pregunta.respuestaCorrecta]}
                          </p>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            )}

            <div className="mb-6">
              {progresoTest.aprobado && (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <p className="text-green-700 mb-4 text-lg">
                      <strong>¡Enhorabuena!</strong><br/>
                      Has completado exitosamente el Test de Formación LOPIVI especializado para clubes deportivos.
                    </p>
                    <p className="text-green-600 mb-4">
                      <strong>¡Ya estás formado como Delegado/a de Protección!</strong><br/>
                      Su acreditación de formación está lista para ser visualizada y descargada.
                    </p>
                    <p className="text-green-700 text-sm">
                      <strong>Tómese el tiempo que necesite para leer este resultado.</strong> Cuando esté listo, haga clic en el botón de abajo para acceder a su acreditación de formación.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-center gap-4">
              {progresoTest.aprobado ? (
                <>
                  <Link
                    href="/formacion-lopivi/certificado"
                    className="bg-blue-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-blue-700 transition-colors transform hover:scale-105 shadow-lg"
                  >
                    Ver Acreditación de Formado
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={reiniciarTest}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    Repetir Test
                  </button>
                  <Link
                    href="/formacion-lopivi/bienvenida"
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Repasar Documentación
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/formacion-lopivi/bienvenida" className="text-gray-600 hover:text-gray-900 mr-4">
                ← Pausar Test
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Test de Formación Custodia360</h1>
                <p className="text-sm text-gray-600">
                  Pregunta {progresoTest.preguntaActual + 1} de {PREGUNTAS_TEST.length} • {porcentajeCompletado}% completado
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm text-gray-500">
                <div>{sessionData.nombre}</div>
                <div>{sessionData.tipo === 'principal' ? 'Principal' : 'Suplente'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso del test</span>
            <span>{respuestasCompletas}/{PREGUNTAS_TEST.length} respondidas</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-orange-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${porcentajeCompletado}%` }}
            ></div>
          </div>
        </div>

        {/* Navegación rápida */}
        <div className="bg-white rounded-lg p-4 mb-6 border">
          <h3 className="font-medium text-gray-900 mb-3">Navegación rápida:</h3>
          <div className="grid grid-cols-10 gap-2">
            {PREGUNTAS_TEST.map((_, index) => (
              <button
                key={index}
                onClick={() => irAPregunta(index)}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  index === progresoTest.preguntaActual
                    ? 'bg-orange-600 text-white'
                    : progresoTest.respuestas[index] !== -1
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Pregunta actual */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                Pregunta {progresoTest.preguntaActual + 1} de {PREGUNTAS_TEST.length}
              </span>
              <span className="text-sm text-gray-500">
                Módulo: {preguntaActual?.modulo.replace('modulo-', 'Módulo ')}
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {preguntaActual?.pregunta}
            </h2>
          </div>

          <div className="space-y-3">
            {preguntaActual?.opciones.map((opcion, index) => (
              <label
                key={index}
                className={`flex items-start cursor-pointer p-4 rounded-lg border transition-colors ${
                  progresoTest.respuestas[progresoTest.preguntaActual] === index
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`pregunta-${progresoTest.preguntaActual}`}
                  value={index}
                  checked={progresoTest.respuestas[progresoTest.preguntaActual] === index}
                  onChange={() => responderPregunta(index)}
                  className="mt-1 mr-3"
                />
                <span className="text-gray-700 flex-1">{opcion}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="flex justify-between items-center">
          <button
            onClick={preguntaAnterior}
            disabled={progresoTest.preguntaActual === 0}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Pregunta Anterior
          </button>

          <div className="flex gap-3">
            {progresoTest.preguntaActual < PREGUNTAS_TEST.length - 1 ? (
              <button
                onClick={siguientePregunta}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Siguiente Pregunta →
              </button>
            ) : (
              <button
                onClick={finalizarTest}
                disabled={respuestasCompletas < PREGUNTAS_TEST.length}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Finalizar Test
              </button>
            )}
          </div>
        </div>

        {/* Información del test */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-1">Información del Test</h3>
            <p className="text-sm text-blue-700">
              Necesita responder correctamente al menos 15 de las 20 preguntas (75%) para aprobar.
              Puede navegar libremente entre preguntas y cambiar sus respuestas antes de finalizar.
              Su progreso se guarda automáticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
