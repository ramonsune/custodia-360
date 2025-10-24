import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { casoId, archive } = body

    if (!casoId) {
      return NextResponse.json({ error: 'casoId requerido' }, { status: 400 })
    }

    const supabase = await createClient()

    if (archive) {
      // Archivar (cambiar estado a cerrado)
      const { data: caso, error } = await supabase
        .from('casos_proteccion')
        .update({
          estado: 'cerrado',
          fecha_cierre: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', casoId)
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({
        success: true,
        message: 'Caso archivado',
        caso
      })
    } else {
      // Eliminar permanentemente
      const { error } = await supabase
        .from('casos_proteccion')
        .delete()
        .eq('id', casoId)

      if (error) throw error

      return NextResponse.json({
        success: true,
        message: 'Caso eliminado'
      })
    }

  } catch (error: any) {
    console.error('Error deleting caso:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
