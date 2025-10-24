import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ ok: false, error: 'Token requerido' }, { status: 400 })
    }

    // 1) Resolver sector de la entidad desde el token
    const { data: linkData, error: linkError } = await supabase
      .from('onboarding_links')
      .select('entity_id, deadline_at')
      .eq('token', token)
      .single()

    if (linkError || !linkData) {
      return NextResponse.json({ ok: false, error: 'Token inválido' }, { status: 404 })
    }

    const { data: entityData, error: entityError } = await supabase
      .from('entities')
      .select('sector')
      .eq('id', linkData.entity_id)
      .single()

    const sector = entityData?.sector || null

    // 2) Cargar preguntas universales
    const { data: universales, error: univError } = await supabase
      .from('quiz_questions')
      .select('*')
      .is('sector_id', null)

    if (univError) throw univError

    // 3) Cargar preguntas del sector (si existe)
    let sectoriales: any[] = []
    if (sector) {
      const { data: sectData, error: sectError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('sector_id', sector)

      if (!sectError && sectData) {
        sectoriales = sectData
      }
    }

    // 4) Seleccionar 6 universales + 4 del sector
    const uniSel = shuffle(universales || []).slice(0, 6)
    const secSel = shuffle(sectoriales).slice(0, 4)

    let pool = [...uniSel, ...secSel]

    // Si no hay suficientes del sector, rellenar con más universales
    if (pool.length < 10) {
      const extra = shuffle((universales || []).filter(q => !uniSel.includes(q))).slice(0, 10 - pool.length)
      pool = [...pool, ...extra]
    }

    // 5) Barajar preguntas y opciones
    const questions = shuffle(pool).map((q: any) => {
      const original = ['A', 'B', 'C', 'D']
      const opts = original.map(k => q[`opcion_${k.toLowerCase()}`]).filter((x: any) => !!x)
      const keys = original.slice(0, opts.length)
      const pairs = keys.map((k, idx) => ({ key: k, text: opts[idx] }))
      const shuffledPairs = shuffle(pairs)

      // shuffleMap: orden de claves tras barajar, ej: ['C','A','B','D']
      const shuffleMap = shuffledPairs.map(p => p.key)

      return {
        id: q.id,
        text: q.pregunta,
        options: shuffledPairs.map(p => ({ key: p.key, text: p.text })),
        shuffle: shuffleMap // para corregir en el backend
      }
    })

    return NextResponse.json({
      ok: true,
      questions,
      total: questions.length,
      entity_id: linkData.entity_id,
      sector,
      deadline_at: linkData.deadline_at
    })

  } catch (e: any) {
    console.error('Error en test:', e)
    return NextResponse.json({
      ok: false,
      error: String(e?.message || e)
    }, { status: 500 })
  }
}
