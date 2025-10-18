import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/delegado/onboarding/report/list?entityId=xxx&limit=50
 * Lista los informes guardados para una entidad con URLs firmadas temporales
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const entityId = searchParams.get('entityId')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    if (!entityId) {
      return NextResponse.json({
        error: 'entityId requerido'
      }, { status: 400 })
    }

    // Usar service role key para operaciones de storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseServiceKey) {
      return NextResponse.json({
        error: 'Configuración de Supabase incompleta'
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Obtener registros de informes
    const { data: reports, error: reportsError } = await supabase
      .from('entity_reports')
      .select('*')
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (reportsError) {
      console.error('Error obteniendo informes:', reportsError)
      return NextResponse.json({
        error: 'Error obteniendo historial de informes',
        details: reportsError.message
      }, { status: 500 })
    }

    if (!reports || reports.length === 0) {
      return NextResponse.json({
        ok: true,
        reports: []
      })
    }

    // Generar URLs firmadas para cada informe
    const reportsWithUrls = await Promise.all(
      reports.map(async (report) => {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('entity-reports')
          .createSignedUrl(report.storage_path, 600) // 10 minutos

        return {
          id: report.id,
          filename: report.filename,
          created_at: report.created_at,
          size: report.bytes,
          signedUrl: signedUrlError ? null : signedUrlData.signedUrl,
          error: signedUrlError ? signedUrlError.message : null
        }
      })
    )

    return NextResponse.json({
      ok: true,
      reports: reportsWithUrls
    })

  } catch (error: any) {
    console.error('Error en list reports:', error)
    return NextResponse.json({
      error: 'Error obteniendo historial',
      details: error.message
    }, { status: 500 })
  }
}
