'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'

export default function QuizPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = params.token as string
  const person_id = searchParams.get('person_id')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [quiz, setQuiz] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    startQuiz()
  }, [token])

  async function startQuiz() {
    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      const data = await res.json()

      if (!data.ok) {
        setError(data.error || 'Error al cargar test')
        setLoading(false)
        return
      }

      setQuiz(data)
      setLoading(false)

    } catch (err) {
      setError('Error al cargar test')
      setLoading(false)
    }
  }

  async function handleSubmit() {
    if (Object.keys(answers).length < 10) {
      alert('Debes responder todas las preguntas')
      return
    }

    setSubmitting(true)

    try {
      const answersArray = quiz.items.map((item: any) => ({
        question_id: item.id,
        option_index: answers[item.id]
      }))

      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attempt_id: quiz.attempt_id,
          answers: answersArray,
          person_id
        })
      })

      const data = await res.json()

      if (!data.ok) {
        setError(data.error || 'Error al enviar test')
        setSubmitting(false)
        return
      }

      setResult(data)

    } catch (err) {
      setError('Error al enviar test')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando test...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            result.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <span className="text-4xl">{result.passed ? '✅' : '❌'}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {result.passed ? '¡Test aprobado!' : 'Test no superado'}
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">{result.percentage}%</div>
            <p className="text-gray-600">
              {result.correct} de {result.total} respuestas correctas
            </p>
            {!result.passed && (
              <p className="text-sm text-gray-500 mt-2">
                Necesitas al menos 75% para aprobar
              </p>
            )}
          </div>
          <p className="text-gray-600 mb-6">{result.message}</p>
          {result.passed ? (
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Finalizar
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Reintentar test
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-3xl">📝</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Test de Conocimientos LOPIVI
            </h1>
            <p className="text-gray-600 mb-4">
              10 preguntas · Mínimo 75% para aprobar
            </p>
            <div className="inline-block bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-blue-900">
                {Object.keys(answers).length} de 10 respondidas
              </span>
            </div>
          </div>

          {/* Preguntas */}
          <div className="space-y-8">
            {quiz.items.map((item: any, index: number) => (
              <div key={item.id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <p className="text-gray-900 font-medium flex-1">{item.text}</p>
                </div>

                <div className="ml-12 space-y-3">
                  {item.options.map((option: string, optionIndex: number) => (
                    <label
                      key={optionIndex}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        answers[item.id] === optionIndex
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={item.id}
                          checked={answers[item.id] === optionIndex}
                          onChange={() => setAnswers({...answers, [item.id]: optionIndex})}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length < 10}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Enviando...' : 'Enviar test'}
            </button>
            {Object.keys(answers).length < 10 && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Debes responder todas las preguntas antes de enviar
              </p>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Test de conocimientos · Protección de la infancia · LOPIVI</p>
        </div>
      </div>
    </div>
  )
}
