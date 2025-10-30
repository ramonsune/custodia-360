import { NextResponse } from 'next/server'
import { getAllQuestions } from '@/data/quiz-questions-mock'

export async function POST(req: Request) {
  try {
    const { attemptId, answers, localData } = await req.json()

    console.log('📥 [SUBMIT] Datos recibidos:', { attemptId, answersCount: Object.keys(answers || {}).length })

    if (!attemptId || !answers) {
      return NextResponse.json({
        success: false,
        error: 'attemptId y answers son requeridos'
      }, { status: 400 })
    }

    // Validar que localData existe
    if (!localData || !localData.attempts || !localData.items) {
      return NextResponse.json({
        success: false,
        error: 'No se encontraron datos del intento'
      }, { status: 404 })
    }

    const attempt = localData.attempts[attemptId]
    if (!attempt) {
      return NextResponse.json({
        success: false,
        error: 'Intento no encontrado'
      }, { status: 404 })
    }

    // Obtener todos los items del intento
    const items = Object.values(localData.items).filter((item: any) => item.attempt_id === attemptId)

    console.log('📊 [SUBMIT] Items del intento:', items.length)

    // Cargar todas las preguntas mock
    const allMockQuestions = getAllQuestions()

    // Validar respuestas
    let correct = 0
    let total = items.length

    items.forEach((item: any) => {
      const userAnswerId = answers[item.id] // answers es { itemId: answerId }

      if (!userAnswerId) {
        console.warn('⚠️ [SUBMIT] Sin respuesta para item:', item.id)
        return
      }

      // Buscar la pregunta original
      const mockQuestion = allMockQuestions.find(q => q.id === item.question_id)

      if (!mockQuestion) {
        console.error('❌ [SUBMIT] Pregunta no encontrada:', item.question_id)
        return
      }

      // Buscar la respuesta del usuario
      const userAnswer = mockQuestion.answers.find(a => a.id === userAnswerId)

      if (userAnswer && userAnswer.is_correct) {
        correct++
        console.log('✅ [SUBMIT] Correcta:', item.question_id)
      } else {
        console.log('❌ [SUBMIT] Incorrecta:', item.question_id)
      }
    })

    const score = correct / total
    const percentage = Math.round(score * 100)
    const passed = score >= 0.75

    console.log('📊 [SUBMIT] Resultado:', { correct, total, percentage, passed })

    // Actualizar el intento en localData
    localData.attempts[attemptId] = {
      ...attempt,
      correct,
      score,
      passed,
      submitted_at: new Date().toISOString(),
      status: 'completed'
    }

    // Si pasó el test, actualizar training status
    let trainingUpdate = null
    if (passed && attempt.person_id && attempt.entity_id) {
      const trainingKey = `training_status_${attempt.person_id}_${attempt.entity_id}`

      // Intentar obtener datos actuales de training
      let currentTraining: any = {}
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(trainingKey)
        if (stored) {
          try {
            currentTraining = JSON.parse(stored)
          } catch (e) {
            console.error('Error parseando training status:', e)
          }
        }
      }

      // Actualizar con aprobación del test
      const updatedTraining = {
        ...currentTraining,
        test_passed: true,
        test_passed_at: new Date().toISOString(),
        test_score: percentage,
        test_attempt_id: attemptId,
        updated_at: new Date().toISOString()
      }

      trainingUpdate = {
        key: trainingKey,
        data: updatedTraining
      }

      console.log('✅ [SUBMIT] Training status actualizado')
    }

    return NextResponse.json({
      success: true,
      attemptId,
      score,
      passed,
      correct,
      total,
      percentage,
      message: passed
        ? '¡Test aprobado! Has superado el 75% requerido.'
        : 'Test no superado. Necesitas al menos 75% de aciertos.',
      _localData: localData, // Devolver datos actualizados
      _trainingUpdate: trainingUpdate // Indicar actualización de training status
    })

  } catch (error: any) {
    console.error('❌ [SUBMIT] Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Error del servidor: ' + error.message
    }, { status: 500 })
  }
}
