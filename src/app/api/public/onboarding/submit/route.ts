import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      token,
      perfil,
      nombre,
      email,
      telefono,
      // Personal de contacto
      penales_entregado,
      test, // { answers: [{ questionId, choice }], shuffles: [{ questionId, shuffle }] }
      docs_checklist,
      // Personal sin contacto y familias
      lectura_confirmada,
      // Familias
      hijos
    } = body

    if (!token || !perfil || !nombre) {
      return NextResponse.json({
        error: 'Faltan datos obligatorios'
      }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Validar token
    const { data: link, error: linkError } = await supabase
      .from('onboarding_links')
      .select('entity_id, deadline_at')
      .eq('token', token)
      .eq('enabled', true)
      .single()

    if (linkError || !link) {
      return NextResponse.json({
        error: 'Token inválido'
      }, { status: 404 })
    }

    // Obtener sector de la entidad
    const { data: entity } = await supabase
      .from('entities')
      .select('sector')
      .eq('id', link.entity_id)
      .single()

    const sector = entity?.sector || 'general'

    // Calcular estado según perfil
    let status = 'pendiente'
    let test_passed = false
    let test_score = 0
    let test_total = 10

    if (perfil === 'personal_contacto') {
      // Validar test con sistema de shuffle
      const answers = test?.answers || []
      const shuffles = test?.shuffles || []

      function getShuffleFor(qid: number) {
        return shuffles.find((s: any) => String(s.questionId) === String(qid))?.shuffle || null
      }

      test_total = answers.length

      for (const ans of answers) {
        const qid = ans.questionId
        const choice = ans.choice // letra elegida en el UI (A/B/C/D tras barajar)

        // Cargar pregunta real
        const { data: qData } = await supabase
          .from('quiz_questions')
          .select('correcta')
          .eq('id', qid)
          .single()

        const correcta = qData?.correcta
        if (!correcta) continue

        // Reconstruir: qué letra original corresponde a la letra elegida tras barajar
        const sh = getShuffleFor(qid)
        if (!sh) continue

        // Mapear letra mostrada -> índice mostrado
        const shownIndexMap: any = { A: 0, B: 1, C: 2, D: 3 }
        const shownIndex = shownIndexMap[choice]
        if (shownIndex === undefined || shownIndex >= sh.length) continue

        const originalLetterChosen = sh[shownIndex]
        if (originalLetterChosen === correcta) test_score++
      }

      test_passed = test_total > 0 && (test_score / test_total) >= 0.75

      // Estado OK si tiene penales entregado Y test aprobado
      if (penales_entregado && test_passed) {
        status = 'ok'
      } else {
        // Verificar si está vencido
        const now = new Date()
        const deadline = new Date(link.deadline_at)
        if (now > deadline) {
          status = 'vencido'
        }
      }
    } else if (perfil === 'personal_sin_contacto') {
      // Estado OK si confirmó lectura
      status = lectura_confirmada ? 'ok' : 'pendiente'
    } else if (perfil === 'familia') {
      // Estado OK si confirmó lectura y tiene al menos 1 hijo
      const tieneHijos = hijos && Array.isArray(hijos) && hijos.length > 0
      status = (lectura_confirmada && tieneHijos) ? 'ok' : 'pendiente'
    }

    // Calcular si hay menores de 16 en hijos
    let hijosProcessed = hijos
    if (hijos && Array.isArray(hijos)) {
      hijosProcessed = hijos.map((hijo: any) => {
        const fechaNac = new Date(hijo.fecha_nacimiento)
        const hoy = new Date()
        const edad = hoy.getFullYear() - fechaNac.getFullYear()
        const menor16 = edad < 16
        return {
          ...hijo,
          menor16
        }
      })
    }

    // Insertar respuesta
    const { data: response, error: insertError } = await supabase
      .from('onboarding_responses')
      .insert({
        entity_id: link.entity_id,
        perfil,
        nombre,
        email,
        telefono,
        hijos: hijosProcessed,
        penales_entregado: penales_entregado || false,
        penales_fecha: penales_entregado ? new Date().toISOString().split('T')[0] : null,
        test_answers: test?.answers || null,
        test_score,
        test_total,
        test_passed,
        sector_id: sector,
        docs_checklist,
        lectura_confirmada: lectura_confirmada || false,
        deadline_at: link.deadline_at,
        status,
        completed_at: status === 'ok' ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error insertando respuesta:', insertError)
      throw insertError
    }

    // Si es personal de contacto, crear registro en people y background_checks
    if (perfil === 'personal_contacto' && response) {
      // Crear persona
      const { data: person, error: personError } = await supabase
        .from('people')
        .insert({
          entity_id: link.entity_id,
          nombre,
          email,
          telefono,
          rol: 'personal_contacto',
          es_contacto: true
        })
        .select()
        .single()

      if (!personError && person) {
        // Crear registro de penales
        await supabase
          .from('background_checks')
          .insert({
            person_id: person.id,
            tipo: 'penales',
            entregado: penales_entregado || false,
            fecha_entrega: penales_entregado ? new Date().toISOString().split('T')[0] : null,
            verificado_por_delegado: false
          })

        // Crear registro de formación si aprobó el test
        if (test_passed) {
          await supabase
            .from('trainings')
            .insert({
              person_id: person.id,
              curso: 'LOPIVI Básico',
              estado: 'completado',
              fecha_asignacion: new Date().toISOString().split('T')[0],
              fecha_completado: new Date().toISOString().split('T')[0]
            })
        }
      }
    }

    return NextResponse.json({
      success: true,
      response,
      message: getStatusMessage(status, perfil, test_passed, penales_entregado)
    })

  } catch (error: any) {
    console.error('Error guardando respuesta:', error)
    return NextResponse.json({
      error: 'Error guardando respuesta',
      details: error.message
    }, { status: 500 })
  }
}

function getStatusMessage(status: string, perfil: string, testPassed?: boolean, penalesEntregado?: boolean) {
  if (status === 'ok') {
    return '¡Proceso completado exitosamente! Puede comenzar sus actividades en la entidad.'
  }

  if (perfil === 'personal_contacto') {
    if (!testPassed) {
      return 'Debe aprobar el test con al menos 75% de respuestas correctas (≥8/10) para continuar.'
    }
    if (!penalesEntregado) {
      return 'Recuerde entregar su certificado de penales a la entidad para poder ejercer su función conforme al artículo 57 de la LOPIVI.'
    }
  }

  if (perfil === 'personal_sin_contacto' || perfil === 'familia') {
    return 'Debe confirmar la lectura de la documentación para completar el proceso.'
  }

  return 'Proceso pendiente de completar.'
}
