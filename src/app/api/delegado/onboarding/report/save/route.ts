import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildOnboardingReportData, renderOnboardingReportPDF } from '@/lib/reports/onboarding'

/**
 * POST /api/delegado/onboarding/report/save
 * Genera el informe, lo guarda en Storage privado, registra en BD y devuelve URL firmada
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { entityId } = body

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

    // Verificar que la entidad existe
    const { data: entity, error: entityError } = await supabase
      .from('entities')
      .select('id, nombre')
      .eq('id', entityId)
      .single()

    if (entityError || !entity) {
      return NextResponse.json({
        error: 'Entidad no encontrada'
      }, { status: 404 })
    }

    // Obtener datos del informe
    const reportData = await buildOnboardingReportData(entityId)

    // Generar PDF
    const pdfBuffer = await renderOnboardingReportPDF(reportData)

    // Generar nombre de archivo con timestamp
    const now = new Date()
    const timestamp = now.toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '-')
      .slice(0, 13) // YYYYMMDD-HHmm

    const baseFilename = `onboarding-${timestamp}`
    let filename = `${baseFilename}.pdf`
    let storagePath = `${entityId}/${filename}`

    // Verificar si ya existe y añadir sufijo si es necesario
    let version = 1
    let fileExists = true

    while (fileExists && version < 100) {
      const { data: existingFile } = await supabase.storage
        .from('entity-reports')
        .list(entityId, {
          search: filename
        })

      if (!existingFile || existingFile.length === 0) {
        fileExists = false
      } else {
        version++
        filename = `${baseFilename}-v${version}.pdf`
        storagePath = `${entityId}/${filename}`
      }
    }

    // Subir archivo a Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('entity-reports')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error subiendo archivo:', uploadError)
      return NextResponse.json({
        error: 'Error guardando el informe en Storage',
        details: uploadError.message
      }, { status: 500 })
    }

    // Insertar registro en entity_reports
    const { data: reportRecord, error: insertError } = await supabase
      .from('entity_reports')
      .insert({
        entity_id: entityId,
        filename: filename,
        storage_path: storagePath,
        bytes: pdfBuffer.byteLength,
        created_at: now.toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error insertando registro:', insertError)
      // Intentar eliminar el archivo subido
      await supabase.storage
        .from('entity-reports')
        .remove([storagePath])

      return NextResponse.json({
        error: 'Error registrando el informe',
        details: insertError.message
      }, { status: 500 })
    }

    // Generar URL firmada temporal (10 minutos)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('entity-reports')
      .createSignedUrl(storagePath, 600) // 600 segundos = 10 minutos

    if (signedUrlError) {
      console.error('Error generando URL firmada:', signedUrlError)
      return NextResponse.json({
        error: 'Informe guardado pero error generando enlace de descarga',
        details: signedUrlError.message
      }, { status: 500 })
    }

    // Devolver respuesta exitosa
    return NextResponse.json({
      ok: true,
      signedUrl: signedUrlData.signedUrl,
      filename: filename,
      size: pdfBuffer.byteLength,
      reportId: reportRecord?.id
    })

  } catch (error: any) {
    console.error('Error en save report:', error)
    return NextResponse.json({
      error: 'Error guardando el informe',
      details: error.message
    }, { status: 500 })
  }
}
