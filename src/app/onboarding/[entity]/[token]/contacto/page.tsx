'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface EntityInfo {
  id: string
  nombre: string
  sector_code: string
}

interface Question {
  id: string
  text: string
  quiz_answers: Answer[]
}

interface Answer {
  id: string
  text: string
  is_correct: boolean
}

export default function OnboardingContacto() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [entity, setEntity] = useState<EntityInfo | null>(null)
  const [step, setStep] = useState(1) // 1: datos, 2: formación, 3: test, 4: completado

  // Datos del formulario
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [puesto, setPuesto] = useState('')
  const [penales, setPenales] = useState(false)

  // Quiz
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [personId, setPersonId] = useState<string | null>(null)

  const entityId = params.entity as string
  const token = params.token as string

  useEffect(() => {
    verifyAndLoad()
  }, [])

  const verifyAndLoad = async () => {
    try {
      const res = await fetch('/api/onboarding/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, token })
      })

      const data = await res.json()

      if (data.success && data.valid) {
        setEntity(data.entity)
      } else {
        router.push(`/onboarding/${entityId}/${token}`)
      }
    } catch (err) {
      router.push(`/onboarding/${entityId}/${token}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitDatos = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre || !apellidos || !email || !puesto) {
      alert('Por favor, completa todos los campos obligatorios')
      return
    }

    setStep(2)
  }

  const handleContinueFormacion = () => {
    setStep(3)
    loadQuiz()
  }

  const loadQuiz = async () => {
    try {
      const res = await fetch(`/api/onboarding/quiz?sector=${entity?.sector_code}`)
      const data = await res.json()

      if (data.success) {
        setQuestions(data.questions)
      }
    } catch (err) {
      console.error('Error cargando quiz:', err)
    }
  }

  const handleSubmitTest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Object.keys(answers).length !== questions.length) {
      alert('Por favor, responde todas las preguntas')
      return
    }

    setSubmitting(true)

    try {
      // Primero guardar persona
      const submitRes = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId,
          tipo: 'personal_contacto',
          nombre,
          apellidos,
          email,
          telefono,
          puesto,
          penales_entregado: penales,
          sector_code: entity?.sector_code
        })
      })

      const submitData = await submitRes.json()

      if (!submitData.success) {
        alert('Error guardando datos')
        setSubmitting(false)
        return
      }

      setPersonId(submitData.personId)

      // Evaluar test
      const answerArray = Object.entries(answers).map(([questionId, answerId]) => ({
        questionId,
        answerId
      }))

      const quizRes = await fetch('/api/onboarding/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personId: submitData.personId,
          entityId,
          sectorCode: entity?.sector_code,
          answers: answerArray
        })
      })

      const quizData = await quizRes.json()

      if (quizData.success) {
        setTestResult(quizData.result)
        setStep(4)
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Error procesando test')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Personal con Contacto Directo
          </h1>
          <p className="text-gray-600">{entity?.nombre}</p>
        </div>

        {/* Progreso */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className={step >= 1 ? 'font-semibold text-blue-600' : ''}>1. Datos personales</span>
            <span className={step >= 2 ? 'font-semibold text-blue-600' : ''}>2. Formación</span>
            <span className={step >= 3 ? 'font-semibold text-blue-600' : ''}>3. Test</span>
            <span className={step >= 4 ? 'font-semibold text-blue-600' : ''}>4. Completado</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* PASO 1: Datos Personales */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
              <CardDescription>
                Completa tu información para iniciar el proceso de formación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitDatos} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellidos">Apellidos *</Label>
                    <Input
                      id="apellidos"
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+34 600 000 000"
                  />
                </div>

                <div>
                  <Label htmlFor="puesto">Puesto / Cargo *</Label>
                  <Input
                    id="puesto"
                    value={puesto}
                    onChange={(e) => setPuesto(e.target.value)}
                    placeholder="Ej: Entrenador, Monitor, Educador..."
                    required
                  />
                </div>

                <div className="p-4 bg-purple-50 border border-purple-300 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="penales"
                      checked={penales}
                      onCheckedChange={(checked) => setPenales(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="penales" className="cursor-pointer text-sm">
                      Declaro que he entregado el <strong>Certificado Negativo del Registro Central de Delincuentes Sexuales</strong> vigente a mi entidad (obligatorio para trabajar con menores)
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Continuar →
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* PASO 2: Formación LOPIVI */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Formación Básica LOPIVI</CardTitle>
              <CardDescription>
                Lee atentamente la información sobre protección infantil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-bold text-gray-900">¿Qué es la Ley LOPIVI?</h3>
                <p className="text-gray-700">
                  La Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia (LOPIVI)
                  tiene como objetivo proteger a los menores de edad de cualquier forma de violencia.
                </p>

                <h3 className="text-lg font-bold text-gray-900 mt-6">Principios fundamentales:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Buen trato:</strong> Relación basada en el respeto, dignidad y derechos del menor</li>
                  <li><strong>Prevención:</strong> Detectar situaciones de riesgo antes de que ocurra la violencia</li>
                  <li><strong>Protección:</strong> Actuar inmediatamente ante cualquier sospecha</li>
                  <li><strong>Confidencialidad:</strong> Proteger la privacidad del menor en todo momento</li>
                </ul>

                <h3 className="text-lg font-bold text-gray-900 mt-6">Tu responsabilidad como personal con contacto:</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-blue-900">
                    <li>✓ Nunca estar a solas con un menor sin visibilidad</li>
                    <li>✓ Mantener límites profesionales apropiados</li>
                    <li>✓ Comunicar inmediatamente cualquier situación de riesgo</li>
                    <li>✓ Respetar la privacidad y confidencialidad</li>
                    <li>✓ Utilizar únicamente canales oficiales de comunicación</li>
                    <li>✓ No compartir información personal con menores</li>
                  </ul>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mt-6">¿Qué hacer si un menor te cuenta algo?</h3>
                <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-red-900">
                    <li><strong>Escuchar sin juzgar</strong> - Da confianza al menor</li>
                    <li><strong>No hacer preguntas invasivas</strong> - No contaminar el testimonio</li>
                    <li><strong>Informar al delegado de protección</strong> - En menos de 24 horas</li>
                    <li><strong>Documentar por escrito</strong> - Fecha, hora, palabras exactas</li>
                    <li><strong>Mantener confidencialidad</strong> - Solo informar a autoridades competentes</li>
                    <li><strong>Si hay riesgo inminente</strong> - Llamar 112 inmediatamente</li>
                  </ol>
                </div>
              </div>

              <Button onClick={handleContinueFormacion} className="w-full">
                He leído la formación → Continuar al Test
              </Button>
            </CardContent>
          </Card>
        )}

        {/* PASO 3: Test de 10 Preguntas */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Test de Evaluación</CardTitle>
              <CardDescription>
                Responde las 10 preguntas. Necesitas al menos 75% para aprobar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando preguntas...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitTest} className="space-y-6">
                  {questions.map((q, index) => (
                    <div key={q.id} className="p-4 border border-gray-300 rounded-lg">
                      <p className="font-semibold text-gray-900 mb-3">
                        {index + 1}. {q.text}
                      </p>
                      <RadioGroup
                        value={answers[q.id] || ''}
                        onValueChange={(value) => setAnswers({ ...answers, [q.id]: value })}
                      >
                        {q.quiz_answers.map((answer) => (
                          <div key={answer.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={answer.id} id={answer.id} />
                            <Label htmlFor={answer.id} className="cursor-pointer">
                              {answer.text}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? 'Evaluando...' : 'Enviar Test'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* PASO 4: Resultado */}
        {step === 4 && testResult && (
          <Card className={testResult.passed ? 'border-green-500' : 'border-red-500'}>
            <CardHeader>
              <CardTitle className={testResult.passed ? 'text-green-600' : 'text-red-600'}>
                {testResult.passed ? '¡Felicitaciones!' : 'No has aprobado'}
              </CardTitle>
              <CardDescription>
                {testResult.message}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{testResult.total}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Correctas</p>
                  <p className="text-2xl font-bold text-green-600">{testResult.correct}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Puntuación</p>
                  <p className="text-2xl font-bold text-blue-600">{testResult.score}%</p>
                </div>
              </div>

              {testResult.passed ? (
                <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                  <p className="text-green-900 font-semibold mb-2">
                    Tu registro ha sido completado correctamente
                  </p>
                  <p className="text-sm text-green-800">
                    Recibirás un email de confirmación. Tu entidad ha sido notificada.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                    <p className="text-red-900 text-sm">
                      Necesitas al menos 75% para aprobar. Puedes intentarlo nuevamente.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setStep(3)
                      setAnswers({})
                      setTestResult(null)
                      loadQuiz()
                    }}
                    className="w-full"
                  >
                    Reintentar Test
                  </Button>
                </div>
              )}

              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="w-full"
              >
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}
