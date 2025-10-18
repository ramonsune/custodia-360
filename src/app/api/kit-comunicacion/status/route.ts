import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const entityId = request.nextUrl.searchParams.get('entityId')

  if (!entityId) {
    return NextResponse.json({ error: 'entityId required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('entities')
      .select('kit_comunicacion')
      .eq('id', entityId)
      .single()

    if (error) {
      console.error('Error consultando kit_comunicacion:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      activo: data?.kit_comunicacion || false
    })
  } catch (err: any) {
    console.error('Error inesperado:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
