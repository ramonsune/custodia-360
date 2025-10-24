import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { pdfGenerator } from '@/lib/pdf-generator'

/**
 * API: Generar Training Pack (Materiales de formación en PDF)
 * POST /api/pdfs/training-pack
 * Body: { entity_id: string, sector_code?: string }
 *
 * Genera un PDF consolidado con todos los módulos de formación LOPIVI
 * adaptados al sector de la entidad.
 */
export async function POST(req: Request) {
  try {
    const { entity_id, sector_code } = await req.json()

    console.log('📚 [TRAINING PACK] Generando pack de formación:', { entity_id, sector_code })

    if (!entity_id) {
      return NextResponse.json({
        success: false,
        error: 'entity_id es requerido'
      }, { status: 400 })
    }

    // Inicializar Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
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

    // Obtener datos de la entidad si no se proporcionó sector_code
    let sectorToUse = sector_code
    let entityName = 'Entidad'

    if (!sectorToUse) {
      const { data: entity } = await supabase
        .from('entities')
        .select('nombre, sector_code')
        .eq('id', entity_id)
        .single()

      if (entity) {
        sectorToUse = entity.sector_code || 'general'
        entityName = entity.nombre
      }
    }

    console.log('📖 [TRAINING PACK] Generando para sector:', sectorToUse)

    // Generar HTML consolidado de formación
    const trainingHTML = generateTrainingHTML(entityName, sectorToUse || 'general')

    // Generar PDF
    console.log('📄 [TRAINING PACK] Generando PDF...')
    const trainingPDF = await pdfGenerator.generateFromHTML(trainingHTML, {
      title: `Formación LOPIVI - ${entityName}`
    })

    console.log('✅ [TRAINING PACK] PDF generado')

    // Guardar en Storage (bucket público)
    const fileName = `training/${entity_id}.pdf`
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('public-pdfs')
      .upload(fileName, trainingPDF, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      console.error('❌ [TRAINING PACK] Error subiendo PDF:', uploadError)
      return NextResponse.json({
        success: false,
        error: 'Error guardando el pack de formación',
        details: uploadError.message
      }, { status: 500 })
    }

    // Obtener URL pública
    const { data: publicUrlData } = supabase
      .storage
      .from('public-pdfs')
      .getPublicUrl(fileName)

    const pdfUrl = publicUrlData?.publicUrl || null

    console.log('✅ [TRAINING PACK] Pack guardado:', fileName)

    return NextResponse.json({
      success: true,
      message: 'Pack de formación generado exitosamente',
      training_pack: {
        entity_id,
        sector_code: sectorToUse,
        pdf_url: pdfUrl,
        storage_path: fileName,
        generated_at: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('❌ [TRAINING PACK] Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Error generando pack de formación',
      details: error.message
    }, { status: 500 })
  }
}

/**
 * Genera HTML consolidado de formación LOPIVI
 */
function generateTrainingHTML(entityName: string, sectorCode: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 40px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
            margin-bottom: 40px;
          }
          .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
          h1 { font-size: 28px; margin: 20px 0; color: #667eea; }
          h2 { font-size: 22px; margin: 20px 0; color: #764ba2; page-break-before: always; }
          h3 { font-size: 18px; margin: 15px 0; color: #667eea; }
          .module { margin-bottom: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
          .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            font-size: 11px;
            color: #999;
          }
          ul { margin: 10px 0; padding-left: 25px; }
          li { margin: 8px 0; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #f59e0b; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CUSTODIA360</div>
          <div style="font-size: 24px; margin-top: 10px;">Pack de Formación LOPIVI</div>
          <div style="font-size: 16px; margin-top: 10px; opacity: 0.9;">${entityName}</div>
        </div>

        <h1>Formación Completa en Protección Infantil LOPIVI</h1>

        <div class="module">
          <h2>Módulo 1: Introducción a la LOPIVI</h2>
          <h3>1.1 ¿Qué es la LOPIVI?</h3>
          <p>
            La Ley Orgánica 8/2021, de 4 de junio, de protección integral a la infancia
            y la adolescencia frente a la violencia (LOPIVI) es el marco legal que establece
            medidas de prevención, detección precoz, protección y reparación de todo tipo
            de violencia contra menores.
          </p>
          <h3>1.2 Objetivos de la Ley</h3>
          <ul>
            <li>Garantizar los derechos fundamentales de niños, niñas y adolescentes</li>
            <li>Prevenir todas las formas de violencia</li>
            <li>Detectar precozmente situaciones de riesgo</li>
            <li>Intervenir de manera efectiva y coordinada</li>
            <li>Promover la sensibilización y formación</li>
          </ul>
        </div>

        <div class="module">
          <h2>Módulo 2: El Delegado de Protección</h2>
          <h3>2.1 Rol y Responsabilidades</h3>
          <p>
            El delegado de protección es la figura clave en la implementación de la LOPIVI.
            Sus responsabilidades incluyen:
          </p>
          <ul>
            <li>Coordinar el plan de protección de la entidad</li>
            <li>Gestionar casos e incidencias</li>
            <li>Comunicarse con autoridades competentes</li>
            <li>Supervisar la formación del personal</li>
            <li>Mantener actualizado el sistema de protección</li>
          </ul>
          <div class="highlight">
            <strong>Importante:</strong> El delegado debe estar certificado y actuar
            con diligencia, confidencialidad y en el interés superior del menor.
          </div>
        </div>

        <div class="module">
          <h2>Módulo 3: Detección de Situaciones de Riesgo</h2>
          <h3>3.1 Indicadores de Alerta</h3>
          <p>Es fundamental conocer los indicadores que pueden señalar situaciones de riesgo:</p>
          <ul>
            <li><strong>Físicos:</strong> Lesiones inexplicables, cambios en la higiene</li>
            <li><strong>Emocionales:</strong> Cambios de comportamiento, aislamiento</li>
            <li><strong>Conductuales:</strong> Agresividad, miedo a personas específicas</li>
            <li><strong>Académicos:</strong> Bajo rendimiento repentino, absentismo</li>
          </ul>
        </div>

        <div class="module">
          <h2>Módulo 4: Protocolos de Actuación</h2>
          <h3>4.1 Pasos ante una Sospecha</h3>
          <ul>
            <li><strong>Paso 1:</strong> Mantener la calma y escuchar al menor</li>
            <li><strong>Paso 2:</strong> NO interrogar, solo recoger información básica</li>
            <li><strong>Paso 3:</strong> Documentar fecha, hora, contexto</li>
            <li><strong>Paso 4:</strong> Informar inmediatamente al delegado de protección</li>
            <li><strong>Paso 5:</strong> Seguir el protocolo establecido</li>
          </ul>
          <div class="highlight">
            <strong>Nunca:</strong> Investigar por cuenta propia, confrontar al presunto agresor,
            o prometer confidencialidad absoluta al menor.
          </div>
        </div>

        <div class="module">
          <h2>Módulo 5: Código de Conducta</h2>
          <h3>5.1 Normas de Comportamiento Profesional</h3>
          <p>Todo el personal debe cumplir estrictamente:</p>
          <ul>
            <li>Mantener límites profesionales apropiados</li>
            <li>Nunca estar a solas con un menor sin visibilidad</li>
            <li>Usar únicamente canales oficiales de comunicación</li>
            <li>Respetar la privacidad e intimidad de los menores</li>
            <li>No compartir información personal en redes sociales</li>
            <li>Reportar inmediatamente cualquier situación irregular</li>
          </ul>
        </div>

        <div class="module">
          <h2>Módulo 6: Evaluación y Certificación</h2>
          <h3>6.1 Requisitos para la Certificación</h3>
          <p>
            Para obtener la certificación LOPIVI es necesario:
          </p>
          <ul>
            <li>Completar todos los módulos de formación</li>
            <li>Superar la evaluación final (puntuación mínima 80%)</li>
            <li>Presentar certificado negativo de delitos sexuales</li>
            <li>Firmar el compromiso con el código de conducta</li>
          </ul>
          <p>
            La certificación tiene validez de 2 años y requiere renovación mediante
            formación continua.
          </p>
        </div>

        <div class="footer">
          <p>
            <strong>Custodia360 S.L.</strong> | Sistema de Gestión LOPIVI<br>
            www.custodia360.es | info@custodia360.es<br>
            Documento generado el ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p style="margin-top: 20px; font-size: 10px;">
            © ${new Date().getFullYear()} Custodia360. Todos los derechos reservados.<br>
            Este material de formación es propiedad de Custodia360 y está protegido por derechos de autor.
          </p>
        </div>
      </body>
    </html>
  `
}
