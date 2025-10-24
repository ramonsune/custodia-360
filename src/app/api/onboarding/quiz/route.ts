import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// GET: Obtener 10 preguntas aleatorias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectorCode = searchParams.get('sector') || 'general'

    if (!supabaseUrl || !supabaseKey) {
      console.error('Variables de entorno de Supabase no configuradas')
      return NextResponse.json(
        { success: false, error: 'Configuración de base de datos no disponible' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Obtener configuración del quiz
    const { data: config } = await supabase
      .from('quiz_settings_short')
      .select('total')
      .single()

    const totalQuestions = config?.total || 10

    // Obtener preguntas generales + específicas del sector
    const { data: questions, error } = await supabase
      .from('quiz_questions')
      .select(`
        id,
        text,
        quiz_answers (
          id,
          text,
          is_correct
        )
      `)
      .or(`is_general.eq.true,sector_code.eq.${sectorCode}`)
      .eq('active', true)
      .limit(totalQuestions)

    if (error) {
      console.error('Error obteniendo preguntas:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No hay preguntas disponibles' },
        { status: 404 }
      )
    }

    // Mezclar preguntas y respuestas aleatoriamente
    const shuffledQuestions = questions
      .sort(() => Math.random() - 0.5)
      .slice(0, totalQuestions)
      .map(q => ({
        ...q,
        quiz_answers: q.quiz_answers.sort(() => Math.random() - 0.5)
      }))

    return NextResponse.json({
      success: true,
      questions: shuffledQuestions,
      total: shuffledQuestions.length
    })

  } catch (error) {
    console.error('Error en API quiz GET:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST: Evaluar respuestas
export async function POST(request: NextRequest) {
  try {
    const { personId, entityId, sectorCode, answers } = await request.json()

    if (!personId || !answers) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('Variables de entorno de Supabase no configuradas')
      return NextResponse.json(
        { success: false, error: 'Configuración de base de datos no disponible' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Obtener configuración
    const { data: config } = await supabase
      .from('quiz_settings_short')
      .select('pass_threshold')
      .single()

    const passThreshold = config?.pass_threshold || 0.75

    // Verificar respuestas correctas
    let correct = 0
    for (const answer of answers) {
      const { data: answerData } = await supabase
        .from('quiz_answers')
        .select('is_correct')
        .eq('id', answer.answerId)
        .single()

      if (answerData?.is_correct) {
        correct++
      }
    }

    const total = answers.length
    const score = correct / total
    const passed = score >= passThreshold

    // Guardar intento
    const { data: attempt, error: attemptError } = await supabase
      .from('miniquiz_attempts')
      .insert({
        person_id: personId,
        entity_id: entityId,
        sector_code: sectorCode,
        seed: Date.now(),
        total,
        correct,
        score,
        passed,
        answers: answers
      })
      .select()
      .single()

    if (attemptError) {
      console.error('Error guardando intento:', attemptError)
      return NextResponse.json(
        { success: false, error: attemptError.message },
        { status: 500 }
      )
    }

    // Si aprobó, actualizar estado de la persona
    if (passed) {
      await supabase
        .from('entity_people')
        .update({
          estado: 'completo',
          completed_at: new Date().toISOString()
        })
        .eq('id', personId)
    }

    return NextResponse.json({
      success: true,
      result: {
        total,
        correct,
        score: Math.round(score * 100),
        passed,
        message: passed
          ? '¡Felicitaciones! Has aprobado el test.'
          : `No has alcanzado el mínimo requerido (${Math.round(passThreshold * 100)}%). Puedes intentarlo nuevamente.`
      }
    })

  } catch (error) {
    console.error('Error en API quiz POST:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
