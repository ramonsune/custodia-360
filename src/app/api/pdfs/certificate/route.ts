import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { pdfGenerator, PDFTemplates } from '@/lib/pdf-generator'

/**
 * API: Generar Certificado de Formación LOPIVI
 * POST /api/pdfs/certificate
 * Body: { person_id: string, entity_id: string }
 *
 * Genera un PDF de certificado, lo guarda en Supabase Storage (private-pdfs)
 * y actualiza el registro de la persona con la URL del PDF.
 */
export async function POST(req: Request) {
  try {
    const { person_id, entity_id } = await req.json()

    console.log('📜 [CERTIFICATE PDF] Generando certificado:', { person_id, entity_id })

    // Validar parámetros
    if (!person_id || !entity_id) {
      return NextResponse.json({
        success: false,
        error: 'person_id y entity_id son requeridos'
      }, { status: 400 })
    }

    // Inicializar Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [CERTIFICATE PDF] Variables de Supabase no configuradas')
      return NextResponse.json({
        success: false,
        error: 'Error de configuración del servidor'
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // 1. Obtener datos de la persona
    console.log('🔍 [CERTIFICATE PDF] Obteniendo datos de la persona...')
    const { data: person, error: personError } = await supabase
      .from('entity_people')
      .select('*')
      .eq('id', person_id)
      .single()

    if (personError || !person) {
      console.error('❌ [CERTIFICATE PDF] Persona no encontrada:', personError)
      return NextResponse.json({
        success: false,
        error: 'Persona no encontrada'
      }, { status: 404 })
    }

    // 2. Obtener datos de la entidad
    console.log('🔍 [CERTIFICATE PDF] Obteniendo datos de la entidad...')
    const { data: entity, error: entityError } = await supabase
      .from('entities')
      .select('*')
      .eq('id', entity_id)
      .single()

    if (entityError || !entity) {
      console.error('❌ [CERTIFICATE PDF] Entidad no encontrada:', entityError)
      return NextResponse.json({
        success: false,
        error: 'Entidad no encontrada'
      }, { status: 404 })
    }

    // 3. Generar PDF del certificado
    console.log('📄 [CERTIFICATE PDF] Generando PDF...')
    const certificadoHTML = PDFTemplates.certificadoLOPIVI({
      nombre: person.nombre,
      entidad: entity.nombre,
      fecha: person.certificado_at || new Date().toISOString(),
      codigo: `CERT-${person_id.slice(0, 8).toUpperCase()}`
    })

    const certificadoPDF = await pdfGenerator.generateFromHTML(certificadoHTML, {
      title: `Certificado LOPIVI - ${person.nombre}`
    })

    console.log('✅ [CERTIFICATE PDF] PDF generado correctamente')

    // 4. Guardar PDF en Supabase Storage (bucket privado)
    console.log('💾 [CERTIFICATE PDF] Guardando en Supabase Storage...')

    const fileName = `certificates/${entity_id}/${person_id}.pdf`
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('private-pdfs')
      .upload(fileName, certificadoPDF, {
        contentType: 'application/pdf',
        upsert: true // Reemplazar si ya existe
      })

    if (uploadError) {
      console.error('❌ [CERTIFICATE PDF] Error subiendo PDF:', uploadError)
      return NextResponse.json({
        success: false,
        error: 'Error guardando el certificado',
        details: uploadError.message
      }, { status: 500 })
    }

    // 5. Obtener URL privada del PDF (válida 1 año)
    const { data: urlData } = await supabase
      .storage
      .from('private-pdfs')
      .createSignedUrl(fileName, 31536000) // 1 año en segundos

    const pdfUrl = urlData?.signedUrl || null

    console.log('✅ [CERTIFICATE PDF] PDF guardado en Storage:', fileName)

    // 6. Actualizar registro de la persona con URL del certificado
    console.log('💾 [CERTIFICATE PDF] Actualizando registro de persona...')
    const { error: updateError } = await supabase
      .from('entity_people')
      .update({
        certificado: true,
        certificado_at: person.certificado_at || new Date().toISOString(),
        meta: {
          ...person.meta,
          pdf_url: pdfUrl,
          pdf_generated_at: new Date().toISOString()
        }
      })
      .eq('id', person_id)

    if (updateError) {
      console.warn('⚠️ [CERTIFICATE PDF] Error actualizando registro:', updateError)
      // No fallar la operación por esto
    }

    console.log('✅ [CERTIFICATE PDF] Certificado generado completamente')

    // 7. Responder con éxito
    return NextResponse.json({
      success: true,
      message: 'Certificado generado exitosamente',
      certificate: {
        person_id,
        entity_id,
        pdf_url: pdfUrl,
        storage_path: fileName,
        generated_at: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('❌ [CERTIFICATE PDF] Error inesperado:', error)
    return NextResponse.json({
      success: false,
      error: 'Error generando certificado',
      details: error.message
    }, { status: 500 })
  }
}
