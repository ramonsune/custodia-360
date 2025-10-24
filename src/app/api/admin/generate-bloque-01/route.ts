import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Packer } from 'docx'
import { generarPDFProfesional } from '@/lib/document-generator/pdf-generator'
import { generarDOCXProfesional } from '@/lib/document-generator/docx-generator'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const fechaActual = new Date().toLocaleDateString('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

// Configuraciones de los 5 documentos
const documentosConfig = [
  {
    filename: 'Politica_Proteccion_Infancia',
    titulo: 'Política de Protección de la Infancia y Adolescencia',
    subtitulo: 'Documento marco para el cumplimiento LOPIVI',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Introducción',
        contenido: [
          'La presente Política tiene como objetivo garantizar el derecho de todos los niños, niñas y adolescentes a desarrollarse en entornos seguros, libres de cualquier forma de violencia.',
          'Custodia360 ofrece a las entidades el marco técnico, legal y operativo necesario para cumplir con la Ley Orgánica 8/2021 (LOPIVI).'
        ]
      },
      {
        titulo: '2. Principios rectores',
        contenido: [
          '- Interés superior del menor.',
          '- Igualdad y no discriminación.',
          '- Prevención y diligencia debida.',
          '- Confidencialidad y respeto.',
          '- Participación infantil segura.'
        ]
      },
      {
        titulo: '3. Compromisos institucionales',
        contenido: [
          '- Establecer una cultura organizativa preventiva.',
          '- Designar una persona responsable de protección.',
          '- Asegurar canales de comunicación confidenciales.',
          '- Formar a todo el personal en materia de protección.',
          '- Revisar anualmente las políticas y protocolos.'
        ]
      },
      {
        titulo: '4. Implementación',
        contenido: [
          'Custodia360 facilita herramientas de seguimiento automatizado, formación y auditoría para el cumplimiento efectivo de esta política.',
          'La plataforma permite generar documentación adaptada, realizar seguimiento en tiempo real y mantener trazabilidad completa de todas las acciones de protección.'
        ]
      },
      {
        titulo: '5. Revisión y mejora',
        contenido: [
          'Esta política será revisada anualmente o tras incidentes relevantes.',
          'Custodia360 notificará automáticamente a las entidades cuando se produzcan cambios normativos que requieran actualización de políticas.'
        ]
      }
    ]
  },
  {
    filename: 'Codigo_Conducta_Menores',
    titulo: 'Código de Conducta y Relación con Menores',
    subtitulo: 'Normas de comportamiento ético y profesional',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Finalidad',
        contenido: [
          'Este código establece normas de comportamiento ético y profesional en la interacción con menores.',
          'Define los límites apropiados y las conductas esperadas de todo el personal que trabaja o tiene contacto con niños, niñas y adolescentes.'
        ]
      },
      {
        titulo: '2. Principios de actuación',
        contenido: [
          '- Trato respetuoso, empático y protector.',
          '- Evitar toda conducta abusiva, humillante o intimidatoria.',
          '- Mantener siempre la proporcionalidad y distancia profesional.',
          '- No mantener comunicaciones privadas con menores sin registro institucional.',
          '- No publicar ni compartir imágenes sin autorización expresa.'
        ]
      },
      {
        titulo: '3. Obligaciones del personal',
        contenido: [
          '- Conocer la LOPIVI y los protocolos internos.',
          '- Comunicar cualquier sospecha de riesgo o maltrato.',
          '- Participar en las formaciones anuales de Custodia360.',
          '- Mantener la confidencialidad de la información sensible.',
          '- Actuar siempre en el interés superior del menor.'
        ]
      },
      {
        titulo: '4. Infracciones y medidas',
        contenido: [
          'Cualquier incumplimiento podrá conllevar sanciones disciplinarias y comunicación a las autoridades competentes.',
          'La gravedad de las medidas se determinará según la naturaleza y consecuencias del incumplimiento.',
          'Custodia360 mantiene registro de todas las comunicaciones y acciones relacionadas con incumplimientos del código.'
        ]
      }
    ]
  },
  {
    filename: 'Declaracion_Compromiso_Etico',
    titulo: 'Declaración de Compromiso Ético del Personal',
    subtitulo: 'Documento de adhesión individual',
    version: '1.0',
    secciones: [
      {
        titulo: 'Declaración de Compromiso Ético',
        contenido: [
          'Yo, [Nombre y Apellidos], con DNI [_________], declaro:',
          '',
          '1. Haber leído y comprendido la Política de Protección y el Código de Conducta de Custodia360.',
          '',
          '2. Comprometerme a actuar conforme a los principios de respeto, integridad y diligencia debida.',
          '',
          '3. Abstenerme de cualquier acción u omisión que pueda poner en riesgo la integridad física o emocional de un menor.',
          '',
          '4. Comunicar inmediatamente cualquier situación de riesgo o vulneración detectada.',
          '',
          '',
          'Firma: ________________________',
          '',
          'Fecha: ________________________',
          '',
          '',
          'Custodia360 mantiene registro digital de estas declaraciones firmadas mediante su plataforma de cumplimiento.'
        ]
      }
    ]
  },
  {
    filename: 'Politica_Privacidad_Datos',
    titulo: 'Política de Privacidad y Protección de Datos',
    subtitulo: 'Cumplimiento RGPD y LOPDGDD',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Responsable del tratamiento',
        contenido: [
          'Custodia360, con domicilio en [insertar dirección corporativa], es responsable del tratamiento de datos personales.',
          'Datos de contacto: privacidad@custodia360.es'
        ]
      },
      {
        titulo: '2. Finalidad',
        contenido: [
          '- Gestión de relaciones con clientes y usuarios.',
          '- Cumplimiento de obligaciones legales.',
          '- Prestación de servicios de cumplimiento automatizado (LOPIVI, Planes de Protección).',
          '- Comunicaciones relacionadas con el servicio.'
        ]
      },
      {
        titulo: '3. Legitimación',
        contenido: [
          'Tratamiento basado en el cumplimiento de obligaciones legales y en el interés legítimo de Custodia360.',
          'Para menores de edad, se requerirá consentimiento del tutor legal cuando sea aplicable.'
        ]
      },
      {
        titulo: '4. Derechos de los interesados',
        contenido: [
          'Los interesados pueden ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad.',
          'Contacto: privacidad@custodia360.es',
          'Plazo de respuesta: 30 días desde la recepción de la solicitud.'
        ]
      },
      {
        titulo: '5. Medidas de seguridad',
        contenido: [
          'Custodia360 aplica medidas técnicas y organizativas proporcionales al riesgo, conforme al RGPD y la LOPDGDD.',
          'Se realizan auditorías periódicas de seguridad y formación continua del personal en protección de datos.'
        ]
      }
    ]
  },
  {
    filename: 'Contrato_Servicio_Custodia360',
    titulo: 'Contrato de Servicio Custodia360',
    subtitulo: 'Modelo genérico de contrato',
    version: '1.0',
    secciones: [
      {
        titulo: 'ENTRE:',
        contenido: [
          'Custodia360 S.L., con CIF [______], en adelante "El Prestador",',
          'y',
          '[Nombre de la Entidad Cliente], con CIF [______], en adelante "El Cliente".'
        ]
      },
      {
        titulo: '1. Objeto',
        contenido: [
          'El presente contrato regula la prestación del servicio de implantación, seguimiento y auditoría automatizada de las obligaciones establecidas en la LOPIVI y el Plan de Protección.'
        ]
      },
      {
        titulo: '2. Alcance del servicio',
        contenido: [
          '- Generación de documentación adaptada.',
          '- Asistencia técnica y formativa.',
          '- Acceso al panel de control Custodia360.',
          '- Actualización de contenidos legales.',
          '- Soporte técnico durante horario laboral.'
        ]
      },
      {
        titulo: '3. Obligaciones del Cliente',
        contenido: [
          '- Facilitar información veraz y actualizada.',
          '- Cumplir los protocolos de protección definidos.',
          '- Designar persona responsable de contacto.',
          '- Mantener activa la suscripción según el plan contratado.'
        ]
      },
      {
        titulo: '4. Duración y renovación',
        contenido: [
          'Contrato anual, renovable automáticamente salvo notificación en contrario con 30 días de antelación.',
          'El precio se revisará anualmente según IPC.'
        ]
      },
      {
        titulo: '5. Protección de datos',
        contenido: [
          'Custodia360 actuará como encargado de tratamiento conforme al RGPD y la LOPDGDD.',
          'Se firmará anexo de encargado del tratamiento según modelo estándar.'
        ]
      },
      {
        titulo: '6. Confidencialidad',
        contenido: [
          'Ambas partes se comprometen a mantener reserva sobre la información intercambiada.',
          'Este deber subsistirá tras la finalización del contrato.'
        ]
      },
      {
        titulo: '7. Jurisdicción',
        contenido: [
          'Las partes se someten expresamente a los tribunales de [Ciudad], salvo acuerdo distinto.'
        ]
      }
    ]
  }
]

export async function POST() {
  try {
    console.log('📘 Generando Bloque 01: Políticas y Códigos (PDF + DOCX)...')

    const documentos = []

    // Generar cada uno de los 5 documentos
    for (let i = 0; i < documentosConfig.length; i++) {
      const config = documentosConfig[i]
      console.log(`${i + 1}/5 Generando: ${config.titulo}...`)

      const docConfig = {
        titulo: config.titulo,
        subtitulo: config.subtitulo,
        version: config.version,
        fecha: fechaActual,
        secciones: config.secciones
      }

      // ========================================
      // GENERAR PDF
      // ========================================
      console.log(`  → PDF...`)
      const pdfBuffer = generarPDFProfesional(docConfig)

      const pdfPath = `plantillas/01_Politicas_y_Codigos/${config.filename}.pdf`
      const { error: pdfError } = await supabase.storage
        .from('docs')
        .upload(pdfPath, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true
        })

      if (pdfError) throw new Error(`Error subiendo PDF ${config.filename}: ${pdfError.message}`)

      const { data: { publicUrl: pdfUrl } } = supabase.storage
        .from('docs')
        .getPublicUrl(pdfPath)

      // ========================================
      // GENERAR DOCX
      // ========================================
      console.log(`  → DOCX...`)
      const docxDoc = generarDOCXProfesional(docConfig)
      const docxBuffer = await Packer.toBuffer(docxDoc)

      const docxPath = `plantillas/01_Politicas_y_Codigos/${config.filename}.docx`
      const { error: docxError } = await supabase.storage
        .from('docs')
        .upload(docxPath, docxBuffer, {
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          upsert: true
        })

      if (docxError) throw new Error(`Error subiendo DOCX ${config.filename}: ${docxError.message}`)

      const { data: { publicUrl: docxUrl } } = supabase.storage
        .from('docs')
        .getPublicUrl(docxPath)

      documentos.push({
        nombre: config.titulo,
        pdf: pdfUrl,
        docx: docxUrl
      })

      console.log(`  ✅ ${config.filename} completado`)
    }

    console.log('✅ Todos los documentos del Bloque 01 generados')

    // Enviar email de confirmación
    console.log('📧 Enviando email de confirmación...')

    const emailHtml = `
      <h2>Bloque 01_Políticas_y_Códigos creado correctamente</h2>
      <p>Se han generado y publicado correctamente los siguientes documentos en el panel de administración Custodia360:</p>
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Documento</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">PDF</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">DOCX</th>
          </tr>
        </thead>
        <tbody>
          ${documentos.map(doc => `
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>${doc.nombre}</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><a href="${doc.pdf}">Descargar PDF</a></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><a href="${doc.docx}">Descargar DOCX</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p><strong>Carpeta:</strong> <code>/docs/plantillas/01_Politicas_y_Codigos/</code></p>
      <p><strong>Panel admin:</strong> <code>/dashboard-custodia360/plantillas</code></p>
      <p><small>Generado el ${fechaActual}</small></p>
    `

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Custodia360 <noreply@custodia360.es>',
        to: ['info@custodia360.es'],
        subject: 'Bloque 01_Políticas_y_Códigos Custodia360 creado correctamente',
        html: emailHtml
      })
    })

    if (resendResponse.ok) {
      console.log('✅ Email enviado')
    }

    return NextResponse.json({
      success: true,
      total: documentos.length,
      documentos
    })

  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
