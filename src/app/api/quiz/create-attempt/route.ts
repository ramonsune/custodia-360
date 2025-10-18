import { NextRequest, NextResponse } from 'next/server'
import { getGeneralQuestions, getSectorQuestions } from '@/data/quiz-questions-mock'

// Helper para generar ID único
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper para barajar array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { personId, entityId, sectorCode } = body

    console.log('📥 [CREATE-ATTEMPT] Datos recibidos:', { personId, entityId, sectorCode })

    if (!personId && !entityId) {
      console.error('❌ [CREATE-ATTEMPT] Faltan datos')
      return NextResponse.json({
        error: 'Faltan datos',
        debug: { personId, entityId, sectorCode }
      }, { status: 400 })
    }

    const finalPersonId = personId || 'demo_user_001'
    const finalEntityId = entityId || 'demo_entity_001'
    const finalSectorCode = sectorCode || 'general'

    console.log('📋 [CREATE-ATTEMPT] Usando IDs:', { finalPersonId, finalEntityId, finalSectorCode })

    // Obtener preguntas desde mock data
    const generalQuestions = getGeneralQuestions()
    const sectorQuestions = getSectorQuestions(finalSectorCode)

    console.log('📊 [CREATE-ATTEMPT] Preguntas encontradas:', {
      generales: generalQuestions.length,
      sector: sectorQuestions.length
    })

    // Seleccionar aleatoriamente: 15 generales + 5 del sector
    // Si no hay suficientes preguntas del sector, rellenar con más generales
    let selectedGeneral = shuffleArray(generalQuestions).slice(0, 15)
    let selectedSector = shuffleArray(sectorQuestions).slice(0, 5)

    // Si hay menos de 5 preguntas del sector, rellenar con generales adicionales
    if (selectedSector.length < 5) {
      console.log('⚠️ [CREATE-ATTEMPT] Sector tiene menos de 5 preguntas, rellenando con generales')
      const needed = 5 - selectedSector.length
      const additionalGeneral = shuffleArray(generalQuestions.filter(q => !selectedGeneral.includes(q))).slice(0, needed)
      selectedGeneral = [...selectedGeneral, ...additionalGeneral]
    }

    const allQuestions = shuffleArray([...selectedGeneral, ...selectedSector])

    console.log('📝 [CREATE-ATTEMPT] Preguntas seleccionadas:', {
      generales: selectedGeneral.length,
      sector: selectedSector.length,
      total: allQuestions.length
    })

    // VALIDACIÓN: Asegurar que SIEMPRE sean 20 preguntas
    if (allQuestions.length !== 20) {
      console.error('❌ [CREATE-ATTEMPT] ERROR: No hay 20 preguntas!', {
        total: allQuestions.length,
        generales: selectedGeneral.length,
        sector: selectedSector.length
      })

      // Si faltan preguntas, añadir más generales
      while (allQuestions.length < 20 && generalQuestions.length > allQuestions.length) {
        const remaining = shuffleArray(generalQuestions.filter(q => !allQuestions.includes(q)))
        if (remaining.length > 0) {
          allQuestions.push(remaining[0])
        } else {
          break
        }
      }

      console.log('✅ [CREATE-ATTEMPT] Preguntas ajustadas a:', allQuestions.length)
    }

    // Crear intento en localStorage
    const attemptId = generateId()
    const seed = generateId()

    const attempt = {
      id: attemptId,
      person_id: finalPersonId,
      entity_id: finalEntityId,
      seed,
      total_questions: 20,
      score: null,
      passed: null,
      submitted_at: null,
      created_at: new Date().toISOString()
    }

    // Crear items del intento (preguntas con respuestas barajadas)
    const items = allQuestions.map(question => {
      const shuffledAnswers = shuffleArray(question.answers)
      const shuffledIds = shuffledAnswers.map(a => a.id)

      return {
        id: generateId(),
        attempt_id: attemptId,
        question_id: question.id,
        shuffled_answer_ids: shuffledIds,
        selected_answer_id: null,
        is_correct: null,
        created_at: new Date().toISOString()
      }
    })

    // Guardar en localStorage
    const quizData = {
      attempts: { [attemptId]: attempt },
      items: items.reduce((acc, item) => {
        acc[item.id] = item
        return acc
      }, {} as Record<string, any>)
    }

    // Guardar en localStorage del servidor (simulado)
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('quiz_data')
      const existingData = existing ? JSON.parse(existing) : { attempts: {}, items: {} }

      existingData.attempts[attemptId] = attempt
      Object.assign(existingData.items, quizData.items)

      localStorage.setItem('quiz_data', JSON.stringify(existingData))
    }

    console.log('✅ [CREATE-ATTEMPT] Test creado exitosamente en memoria')

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      seed,
      _localData: quizData // Enviar datos al cliente para que los guarde
    })

  } catch (error: any) {
    console.error('❌ [CREATE-ATTEMPT] Error general:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
