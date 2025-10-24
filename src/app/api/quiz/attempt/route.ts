import { NextRequest, NextResponse } from 'next/server'
import { getAllQuestions } from '@/data/quiz-questions-mock'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const attemptId = searchParams.get('attemptId')
    const localData = searchParams.get('localData')

    if (!attemptId) {
      return NextResponse.json({ error: 'attemptId requerido' }, { status: 400 })
    }

    console.log('📥 [ATTEMPT] Cargando intento:', attemptId)

    // Parsear datos locales si vienen
    let quizData: any = null
    if (localData) {
      try {
        quizData = JSON.parse(decodeURIComponent(localData))
        console.log('📦 [ATTEMPT] Datos locales recibidos')
      } catch (e) {
        console.error('❌ [ATTEMPT] Error parseando localData:', e)
      }
    }

    // Si no hay datos locales, intentar obtener de localStorage (lado servidor no aplica)
    if (!quizData && typeof window !== 'undefined') {
      const stored = localStorage.getItem('quiz_data')
      if (stored) {
        quizData = JSON.parse(stored)
      }
    }

    if (!quizData) {
      return NextResponse.json({
        error: 'No se encontraron datos del intento',
        hint: 'Asegúrate de pasar localData en la URL o que esté en localStorage'
      }, { status: 404 })
    }

    const attempt = quizData.attempts[attemptId]
    if (!attempt) {
      return NextResponse.json({ error: 'Intento no encontrado' }, { status: 404 })
    }

    // Obtener items del intento
    const items = Object.values(quizData.items).filter((item: any) => item.attempt_id === attemptId)

    console.log('📊 [ATTEMPT] Items encontrados:', items.length)

    // Cargar todas las preguntas desde mock
    const allMockQuestions = getAllQuestions()

    // Para cada item, construir la pregunta con respuestas ordenadas
    const questions = items.map((item: any) => {
      const mockQuestion = allMockQuestions.find(q => q.id === item.question_id)

      if (!mockQuestion) {
        console.error('❌ Pregunta no encontrada:', item.question_id)
        return null
      }

      // Ordenar respuestas según shuffled_answer_ids
      const shuffledIds = item.shuffled_answer_ids as string[]
      const orderedAnswers = shuffledIds.map(id =>
        mockQuestion.answers.find(a => a.id === id)
      ).filter(Boolean)

      return {
        itemId: item.id,
        questionId: item.question_id,
        questionText: mockQuestion.text,
        answers: orderedAnswers.map(a => ({
          id: a.id,
          text: a.text
        })),
        selectedAnswerId: item.selected_answer_id
      }
    }).filter(Boolean)

    console.log('✅ [ATTEMPT] Preguntas cargadas:', questions.length)

    return NextResponse.json({
      success: true,
      attempt,
      questions
    })

  } catch (error: any) {
    console.error('❌ [ATTEMPT] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
