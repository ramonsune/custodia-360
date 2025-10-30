import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { pdfGenerator } from '@/lib/pdf-generator'

/**
 * API: Generar Role Pack (Documentación específica por rol)
 * POST /api/pdfs/role-pack
 * Body: { entity_id: string, role: 'familia' | 'personal_contacto' | 'personal_no_contacto' | 'directiva' }
 *
 * Genera un PDF con documentación específica según el rol del destinatario.
 */
export async function POST(req: Request) {
  try {
    const { entity_id, role } = await req.json()

    console.log('📦 [ROLE PACK] Generando pack para rol:', { entity_id, role })

    if (!entity_id || !role) {
      return NextResponse.json({
        success: false,
        error: 'entity_id y role son requeridos'
      }, { status: 400 })
    }

    const validRoles = ['familia', 'personal_contacto', 'personal_no_contacto', 'directiva']
    if (!validRoles.includes(role)) {
      return NextResponse.json({
        success: false,
        error: `Rol inválido. Debe ser uno de: ${validRoles.join(', ')}`
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

    // Obtener datos de la entidad
    const { data: entity } = await supabase
      .from('entities')
      .select('nombre, sector_code')
      .eq('id', entity_id)
      .single()

    const entityName = entity?.nombre || 'Entidad'
    const sectorCode = entity?.sector_code || 'general'

    console.log('📖 [ROLE PACK] Generando para:', entityName, '| Sector:', sectorCode)

    // Generar HTML según rol
    const roleHTML = generateRoleHTML(entityName, role, sectorCode)

    // Generar PDF
    console.log('📄 [ROLE PACK] Generando PDF...')
    const rolePDF = await pdfGenerator.generateFromHTML(roleHTML, {
      title: `Documentación ${getRoleTitle(role)} - ${entityName}`
    })

    console.log('✅ [ROLE PACK] PDF generado')

    // Guardar en Storage (bucket público)
    const fileName = `packs/${entity_id}/${role}.pdf`
    const { error: uploadError } = await supabase
      .storage
      .from('public-pdfs')
      .upload(fileName, rolePDF, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      console.error('❌ [ROLE PACK] Error subiendo PDF:', uploadError)
      return NextResponse.json({
        success: false,
        error: 'Error guardando el pack',
        details: uploadError.message
      }, { status: 500 })
    }

    // Obtener URL pública
    const { data: publicUrlData } = supabase
      .storage
      .from('public-pdfs')
      .getPublicUrl(fileName)

    const pdfUrl = publicUrlData?.publicUrl || null

    console.log('✅ [ROLE PACK] Pack guardado:', fileName)

    return NextResponse.json({
      success: true,
      message: `Pack para ${getRoleTitle(role)} generado exitosamente`,
      role_pack: {
        entity_id,
        role,
        pdf_url: pdfUrl,
        storage_path: fileName,
        generated_at: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('❌ [ROLE PACK] Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Error generando pack por rol',
      details: error.message
    }, { status: 500 })
  }
}

function getRoleTitle(role: string): string {
  const titles: Record<string, string> = {
    familia: 'Familias y Tutores',
    personal_contacto: 'Personal con Contacto',
    personal_no_contacto: 'Personal sin Contacto',
    directiva: 'Equipo Directivo'
  }
  return titles[role] || role
}

function generateRoleHTML(entityName: string, role: string, sectorCode: string): string {
  const roleTitle = getRoleTitle(role)
  const content = getRoleContent(role)

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
          h2 { font-size: 22px; margin: 20px 0; color: #764ba2; }
          h3 { font-size: 18px; margin: 15px 0; color: #667eea; }
          .section { margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #f59e0b; }
          ul { margin: 10px 0; padding-left: 25px; }
          li { margin: 8px 0; }
          .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            font-size: 11px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CUSTODIA360</div>
          <div style="font-size: 24px; margin-top: 10px;">Documentación LOPIVI</div>
          <div style="font-size: 18px; margin-top: 10px; opacity: 0.9;">${roleTitle}</div>
          <div style="font-size: 16px; margin-top: 5px; opacity: 0.9;">${entityName}</div>
        </div>

        <h1>Bienvenido/a a ${entityName}</h1>
        <p>
          Este documento contiene información importante sobre nuestro compromiso con la protección
          de menores según la Ley LOPIVI y su rol específico como <strong>${roleTitle}</strong>.
        </p>

        ${content}

        <div class="footer">
          <p>
            <strong>Custodia360 S.L.</strong> | Sistema de Gestión LOPIVI<br>
            ${entityName}<br>
            Documento generado el ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </body>
    </html>
  `
}

function getRoleContent(role: string): string {
  const contents: Record<string, string> = {
    familia: `
      <div class="section">
        <h2>Información para Familias y Tutores</h2>
        <h3>Nuestro Compromiso con la Protección</h3>
        <p>
          En nuestra entidad, la protección de menores es nuestra máxima prioridad. Cumplimos
          rigurosamente con la Ley LOPIVI y todos nuestros protocolos de protección infantil.
        </p>
        <div class="highlight">
          <strong>Canal Directo LOPIVI:</strong> Disponemos de un canal de comunicación directo
          con nuestro Delegado de Protección para cualquier consulta o preocupación relacionada
          con la seguridad de los menores.
        </div>
        <h3>¿Qué Hacemos para Proteger a los Menores?</h3>
        <ul>
          <li>Todo el personal está formado y certificado en protección infantil</li>
          <li>Verificamos certificados negativos de delitos sexuales</li>
          <li>Aplicamos protocolos estrictos de supervisión</li>
          <li>Mantenemos un código de conducta profesional</li>
          <li>Contamos con un delegado de protección disponible</li>
        </ul>
        <h3>Su Rol como Familia</h3>
        <ul>
          <li>Manténgase informado sobre nuestros protocolos de protección</li>
          <li>Comunique cualquier preocupación inmediatamente</li>
          <li>Hable con sus hijos/as sobre seguridad y límites apropiados</li>
          <li>Colabore con las medidas de protección establecidas</li>
        </ul>
      </div>
    `,
    personal_contacto: `
      <div class="section">
        <h2>Información para Personal con Contacto Directo</h2>
        <h3>Sus Responsabilidades</h3>
        <p>
          Como personal que trabaja directamente con menores, usted tiene responsabilidades
          especiales en la protección infantil.
        </p>
        <div class="highlight">
          <strong>Importante:</strong> Debe cumplir estrictamente el código de conducta
          y los protocolos de protección en todo momento.
        </div>
        <h3>Código de Conducta (Resumen)</h3>
        <ul>
          <li><strong>NUNCA</strong> estar a solas con un menor sin visibilidad</li>
          <li>Mantener límites profesionales apropiados</li>
          <li>Usar únicamente canales oficiales de comunicación</li>
          <li>Informar inmediatamente cualquier situación de riesgo</li>
          <li>Respetar la privacidad e intimidad de los menores</li>
          <li>No compartir información personal en redes sociales</li>
        </ul>
        <h3>¿Qué Hacer ante una Sospecha?</h3>
        <ul>
          <li><strong>1.</strong> Mantener la calma y escuchar al menor</li>
          <li><strong>2.</strong> NO interrogar, solo recoger información básica</li>
          <li><strong>3.</strong> Documentar fecha, hora, contexto</li>
          <li><strong>4.</strong> Informar INMEDIATAMENTE al delegado de protección</li>
          <li><strong>5.</strong> Seguir el protocolo establecido</li>
        </ul>
        <h3>Formación Obligatoria</h3>
        <p>
          Todo el personal con contacto directo debe completar la formación LOPIVI
          y renovarla cada 2 años. La formación incluye detección de riesgos,
          protocolos de actuación y código de conducta.
        </p>
      </div>
    `,
    personal_no_contacto: `
      <div class="section">
        <h2>Información para Personal sin Contacto Directo</h2>
        <h3>Su Rol en la Protección</h3>
        <p>
          Aunque no trabaje directamente con menores, su colaboración es esencial
          para mantener un entorno seguro.
        </p>
        <h3>Normas Básicas</h3>
        <ul>
          <li>Identificarse siempre con credencial visible</li>
          <li>Trabajar preferentemente en horarios sin presencia de menores</li>
          <li>Informar de cualquier situación sospechosa al delegado de protección</li>
          <li>Respetar las zonas restringidas y horarios establecidos</li>
          <li>Mantener la confidencialidad sobre cualquier información de menores</li>
        </ul>
        <div class="highlight">
          <strong>Importante:</strong> Si observa algo irregular, repórtelo inmediatamente
          al delegado de protección. Su observación puede ser crucial.
        </div>
        <h3>Certificado de Delitos Sexuales</h3>
        <p>
          Todo el personal, incluso sin contacto directo, debe presentar el certificado
          negativo de delitos de naturaleza sexual y renovarlo cuando corresponda.
        </p>
      </div>
    `,
    directiva: `
      <div class="section">
        <h2>Información para Equipo Directivo</h2>
        <h3>Responsabilidades de la Dirección</h3>
        <p>
          El equipo directivo tiene la responsabilidad final de garantizar el cumplimiento
          de la LOPIVI y la protección efectiva de todos los menores.
        </p>
        <h3>Obligaciones Principales</h3>
        <ul>
          <li>Garantizar la existencia y vigencia del Plan de Protección</li>
          <li>Asegurar que el delegado de protección esté certificado</li>
          <li>Supervisar la formación de todo el personal</li>
          <li>Verificar certificados negativos de delitos sexuales</li>
          <li>Proporcionar recursos para la implementación de protocolos</li>
          <li>Mantener canales de comunicación efectivos</li>
        </ul>
        <div class="highlight">
          <strong>Responsabilidad Legal:</strong> El incumplimiento de la LOPIVI puede
          conllevar sanciones administrativas y responsabilidades civiles y penales.
        </div>
        <h3>Sistema de Gestión</h3>
        <p>
          Custodia360 proporciona un sistema completo de gestión que facilita:
        </p>
        <ul>
          <li>Monitoreo continuo del cumplimiento</li>
          <li>Gestión de formaciones y certificaciones</li>
          <li>Documentación y trazabilidad</li>
          <li>Alertas automáticas de vencimientos</li>
          <li>Informes de cumplimiento</li>
        </ul>
        <h3>Auditorías e Inspecciones</h3>
        <p>
          La entidad debe estar preparada para inspecciones en cualquier momento.
          El sistema Custodia360 mantiene toda la documentación actualizada y accesible.
        </p>
      </div>
    `
  }

  return contents[role] || '<p>Contenido no disponible</p>'
}
