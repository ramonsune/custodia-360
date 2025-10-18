import { NextRequest, NextResponse } from 'next/server'
import { getAllQuestions } from '@/data/quiz-questions-mock'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { attemptId, answers, localData } = body // answers: { itemId: answerId }

    if (!attemptId || !answers) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    console.log('📥 [SUBMIT] Procesando envío de test:', attemptId)
    console.log('📥 [SUBMIT] Total de respuestas recibidas:', Object.keys(answers).length)

    // Parsear datos locales
    let quizData: any = localData
    if (typeof localData === 'string') {
      quizData = JSON.parse(localData)
    }

    if (!quizData) {
      console.error('❌ [SUBMIT] No hay datos locales')
      return NextResponse.json({ error: 'No se encontraron datos del intento' }, { status: 404 })
    }

    const attempt = quizData.attempts[attemptId]
    if (!attempt) {
      console.error('❌ [SUBMIT] Intento no encontrado:', attemptId)
      return NextResponse.json({ error: 'Intento no encontrado' }, { status: 404 })
    }

    console.log('✅ [SUBMIT] Intento encontrado:', attemptId)

    // Cargar todas las preguntas mock para validar respuestas
    const allMockQuestions = getAllQuestions()
    console.log('📚 [SUBMIT] Preguntas mock cargadas:', allMockQuestions.length)

    // Actualizar cada item con la respuesta seleccionada
    let correctCount = 0
    let processedCount = 0

    for (const [itemId, answerId] of Object.entries(answers)) {
      const item = quizData.items[itemId]
      if (!item) {
        console.warn('⚠️ [SUBMIT] Item no encontrado:', itemId)
        continue
      }

      // Encontrar la pregunta mock
      const mockQuestion = allMockQuestions.find(q => q.id === item.question_id)
      if (!mockQuestion) {
        console.warn('⚠️ [SUBMIT] Pregunta no encontrada:', item.question_id)
        continue
      }

      // Encontrar la respuesta seleccionada
      const selectedAnswer = mockQuestion.answers.find(a => a.id === answerId)
      if (!selectedAnswer) {
        console.warn('⚠️ [SUBMIT] Respuesta no encontrada:', answerId)
        continue
      }

      const isCorrect = selectedAnswer.is_correct

      console.log(`${isCorrect ? '✅' : '❌'} [SUBMIT] P${processedCount + 1}: ${mockQuestion.text.substring(0, 50)}... - ${isCorrect ? 'CORRECTA' : 'INCORRECTA'}`)

      if (isCorrect) correctCount++
      processedCount++

      // Actualizar item en memoria
      quizData.items[itemId].selected_answer_id = answerId
      quizData.items[itemId].is_correct = isCorrect
    }

    console.log('📊 [SUBMIT] Procesadas:', processedCount, 'Correctas:', correctCount)

    // Usar el número real de preguntas procesadas
    const totalQuestions = processedCount || 20
    const requiredScore = Math.ceil(totalQuestions * 0.75) // 75%
    const passed = correctCount >= requiredScore

    // Actualizar intento en memoria
    quizData.attempts[attemptId].score = correctCount
    quizData.attempts[attemptId].total_questions = totalQuestions
    quizData.attempts[attemptId].passed = passed
    quizData.attempts[attemptId].submitted_at = new Date().toISOString()

    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

    console.log('📊 [SUBMIT] Resultado:', {
      score: correctCount,
      total: totalQuestions,
      required: requiredScore,
      passed,
      percentage
    })

    // Si pasó, actualizar training_status en localStorage
    if (passed && attempt) {
      const trainingKey = `training_status_${attempt.person_id}_${attempt.entity_id}`
      const trainingData = {
        person_id: attempt.person_id,
        entity_id: attempt.entity_id,
        course_code: 'delegado_principal_lopivi',
        test_passed: true,
        modules_completed: 6,
        updated_at: new Date().toISOString()
      }

      // Guardar en respuesta para que el cliente lo persista
      return NextResponse.json({
        success: true,
        score: correctCount,
        total: totalQuestions,
        passed,
        percentage,
        _localData: quizData,
        _trainingUpdate: { key: trainingKey, data: trainingData }
      })
    }

    return NextResponse.json({
      success: true,
      score: correctCount,
      total: totalQuestions,
      passed,
      percentage,
      _localData: quizData
    })

  } catch (error: any) {
    console.error('❌ [SUBMIT] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
