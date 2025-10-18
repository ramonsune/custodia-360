'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface SessionData {
  id: string
  nombre: string
  email: string
  entityId: string
  entidad: string
  user_id: string
  rol?: string
  sector_code?: string
}

interface Question {
  itemId: string
  questionId: string
  questionText: string
  answers: { id: string; text: string }[]
  selectedAnswerId?: string
}

export default function TestPage() {
  const router = useRouter()
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [creatingAttempt, setCreatingAttempt] = useState(false)

  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    console.log('🔍 [TEST] Verificando acceso al test...')

    const sessionData = localStorage.getItem('userSession')

    if (!sessionData) {
      console.error('❌ [TEST] No hay sesión en localStorage')
      alert('No se encontró sesión activa. Por favor, inicia sesión nuevamente.')
      router.push('/acceso')
      return
    }

    try {
      const parsed = JSON.parse(sessionData)
      console.log('📋 [TEST] Sesión encontrada:', parsed)

      // Verificar que sea delegado principal (más flexible)
      const esDelegadoPrincipal =
        parsed.rol === 'delegado_principal' ||
        parsed.tipo === 'principal' ||
        (parsed.permisos && parsed.permisos.includes('formacion'))

      if (!esDelegadoPrincipal) {
        console.error('❌ [TEST] Usuario no autorizado:', parsed.rol, parsed.tipo)
        alert('Solo los delegados principales pueden acceder al test.\n\nRol actual: ' + (parsed.rol || parsed.tipo || 'desconocido'))
        router.push('/acceso')
        return
      }

      console.log('✅ [TEST] Acceso autorizado para:', parsed.nombre)
      setSession(parsed)
      setLoading(false)
    } catch (error) {
      console.error('❌ [TEST] Error parseando sesión:', error)
      alert('Error al cargar la sesión. Por favor, inicia sesión nuevamente.')
      router.push('/acceso')
    }
  }, [router])

  const iniciarTest = async () => {
    console.log('🚀 [TEST] Iniciando test de evaluación...')

    if (!session) {
      console.error('❌ [TEST] No hay sesión disponible')
      alert('No hay sesión activa. Por favor, vuelve a iniciar sesión.')
      return
    }

    const personId = session.user_id || session.id || 'demo_user_001'
    const entityId = session.entityId || 'demo_entity_001'
    const sectorCode = session.sector_code || 'general'

    console.log('📋 [TEST] Datos de sesión:', {
      personId,
      entityId,
      sectorCode,
      sessionCompleta: session
    })

    setCreatingAttempt(true)

    try {
      console.log('📡 [TEST] Llamando a API /api/quiz/create-attempt...')
      const res = await fetch('/api/quiz/create-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personId,
          entityId,
          sectorCode
        })
      })

      const data = await res.json()
      console.log('📦 [TEST] Respuesta de API create-attempt:', data)

      if (data.success) {
        console.log('✅ [TEST] Test creado exitosamente, attemptId:', data.attemptId)

        // Guardar datos locales en localStorage
        if (data._localData) {
          localStorage.setItem('quiz_data', JSON.stringify(data._localData))
          console.log('💾 [TEST] Datos guardados en localStorage')
        }

        setAttemptId(data.attemptId)
        await cargarPreguntas(data.attemptId)
      } else {
        console.error('❌ [TEST] Error en respuesta:', data.error)
        alert('Error al crear el test: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('❌ [TEST] Error de conexión:', error)
      alert('Error de conexión')
    } finally {
      setCreatingAttempt(false)
    }
  }

  const cargarPreguntas = async (id: string) => {
    console.log('📥 [TEST] Cargando preguntas para attemptId:', id)

    try {
      // Obtener datos locales de localStorage
      const quizDataStr = localStorage.getItem('quiz_data')
      const localDataParam = quizDataStr ? encodeURIComponent(quizDataStr) : ''

      const res = await fetch(`/api/quiz/attempt?attemptId=${id}&localData=${localDataParam}`)
      const data = await res.json()

      console.log('📦 [TEST] Preguntas recibidas:', data)

      if (data.success) {
        console.log('✅ [TEST] Preguntas cargadas:', data.questions.length)
        setQuestions(data.questions)
      } else {
        console.error('❌ [TEST] Error cargando preguntas:', data.error)
        alert('Error cargando preguntas: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleAnswerSelect = (itemId: string, answerId: string) => {
    setAnswers(prev => ({
      ...prev,
      [itemId]: answerId
    }))
  }

  const enviarTest = async () => {
    if (!attemptId) return

    // Verificar que todas las preguntas estén respondidas
    const unanswered = questions.filter(q => !answers[q.itemId])
    if (unanswered.length > 0) {
      alert(`Por favor responde todas las preguntas. Faltan ${unanswered.length} preguntas.`)
      return
    }

    setSubmitting(true)

    try {
      // Obtener datos locales de localStorage
      const quizDataStr = localStorage.getItem('quiz_data')
      const localData = quizDataStr ? JSON.parse(quizDataStr) : null

      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          answers,
          localData
        })
      })

      const data = await res.json()

      if (data.success) {
        // Actualizar datos locales si vienen en la respuesta
        if (data._localData) {
          localStorage.setItem('quiz_data', JSON.stringify(data._localData))
          console.log('💾 [TEST] Datos actualizados en localStorage')
        }

        // Actualizar training status si pasó el test
        if (data._trainingUpdate) {
          localStorage.setItem(data._trainingUpdate.key, JSON.stringify(data._trainingUpdate.data))
          console.log('💾 [TEST] Training status actualizado')
        }

        setResult(data)
      } else {
        alert('Error al enviar el test')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Pantalla de resultado
  if (result) {
    const aprobado = result.passed

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className={`shadow-xl ${aprobado ? 'border-green-500' : 'border-red-500'}`}>
            <CardHeader className={`text-center ${aprobado ? 'bg-green-50' : 'bg-red-50'}`}>
              <CardTitle className={`text-3xl mb-2 ${aprobado ? 'text-green-900' : 'text-red-900'}`}>
                {aprobado ? '¡Enhorabuena!' : 'No Aprobado'}
              </CardTitle>
              <CardDescription className="text-lg">
                {aprobado ? 'Has superado el test de evaluación' : 'Necesitas al menos 75% para aprobar'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${aprobado ? 'text-green-600' : 'text-red-600'}`}>
                  {result.percentage}%
                </div>
                <div className="text-gray-600">
                  {result.score} correctas de {result.total} preguntas
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Correctas:</span>
                  <span className="text-green-600 font-bold text-lg">{result.score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Incorrectas:</span>
                  <span className="text-red-600 font-bold text-lg">{result.total - result.score}</span>
                </div>
              </div>

              {aprobado ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-900 text-sm">
                      Has demostrado los conocimientos necesarios para ser Delegado/a de Protección.
                      Ya puedes obtener tu certificado digital.
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push('/panel/delegado/formacion/certificado')}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                  >
                    Obtener Certificado
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-900 text-sm mb-2">
                      <strong>Recomendaciones:</strong>
                    </p>
                    <ul className="text-yellow-800 text-sm space-y-1 ml-4">
                      <li>• Revisa los módulos de formación</li>
                      <li>• Presta especial atención a los protocolos</li>
                      <li>• Consulta los casos prácticos de tu sector</li>
                      <li>• Cuando estés preparado/a, vuelve a intentarlo</li>
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => router.push('/panel/delegado/formacion')}
                      variant="outline"
                      className="flex-1"
                    >
                      Revisar Módulos
                    </Button>
                    <Button
                      onClick={() => {
                        setResult(null)
                        setAttemptId(null)
                        setQuestions([])
                        setAnswers({})
                        setCurrentQuestionIndex(0)
                      }}
                      className="flex-1"
                    >
                      Intentar de Nuevo
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Pantalla de inicio del test
  if (!attemptId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">
                Test Evaluación C360
              </CardTitle>
              <CardDescription className="text-lg">
                Demuestra tus conocimientos como Delegado/a de Protección
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Instrucciones del Test
                </h3>
                <ul className="text-blue-800 text-sm space-y-1 ml-4">
                  <li>• 20 preguntas sobre LOPIVI y protección infantil</li>
                  <li>• 4 opciones por pregunta (solo una correcta)</li>
                  <li>• Necesitas 75% (15/20) para aprobar</li>
                  <li>• El test es de una sola vez, no se puede pausar</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-900 text-sm">
                  <strong>⚠️ Importante:</strong> Asegúrate de haber completado todos los módulos antes de realizar el test.
                  Una vez iniciado, no podrás volver atrás.
                </p>
              </div>

              <Button
                onClick={iniciarTest}
                disabled={creatingAttempt}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
              >
                {creatingAttempt ? 'Preparando test...' : 'Comenzar Test'}
              </Button>

              <Button
                onClick={() => router.push('/panel/delegado/formacion')}
                variant="outline"
                className="w-full"
              >
                Volver a Módulos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Pantalla del test
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Pregunta {currentQuestionIndex + 1} de {totalQuestions}
              </span>
              <span className="text-sm text-gray-600">
                Respondidas: {answeredCount}/{totalQuestions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
            <CardTitle className="text-xl">
              {currentQuestion?.questionText}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={answers[currentQuestion?.itemId] || ''}
              onValueChange={(value) => handleAnswerSelect(currentQuestion?.itemId, value)}
            >
              {currentQuestion?.answers.map((answer, idx) => (
                <div key={answer.id} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value={answer.id} id={answer.id} />
                  <Label htmlFor={answer.id} className="flex-1 cursor-pointer">
                    <span className="font-semibold text-gray-700 mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {answer.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex-1"
              >
                ← Anterior
              </Button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <Button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                  className="flex-1"
                >
                  Siguiente →
                </Button>
              ) : (
                <Button
                  onClick={enviarTest}
                  disabled={submitting || answeredCount < totalQuestions}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {submitting ? 'Enviando...' : 'Finalizar Test'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mini mapa de navegación */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Navegación Rápida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.itemId}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`
                    w-10 h-10 rounded flex items-center justify-center text-sm font-semibold
                    ${currentQuestionIndex === idx ? 'bg-blue-600 text-white' :
                      answers[q.itemId] ? 'bg-green-100 text-green-800 border border-green-300' :
                      'bg-gray-100 text-gray-600 border border-gray-300'}
                  `}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
