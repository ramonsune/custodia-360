import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jsPDF from 'jspdf'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const fechaActual = new Date().toLocaleDateString('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

function addPortada(doc: jsPDF, titulo: string, subtitulo: string) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  doc.setFillColor(255, 255, 255)
  doc.circle(pageWidth / 2, 60, 18, 'F')
  doc.setTextColor(37, 99, 235)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('C', pageWidth / 2, 66, { align: 'center' })

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.text('Custodia360', pageWidth / 2, 95, { align: 'center' })

  doc.setFontSize(18)
  const tituloLineas = doc.splitTextToSize(titulo, pageWidth - 40)
  let yPos = 120
  tituloLineas.forEach((linea: string) => {
    doc.text(linea, pageWidth / 2, yPos, { align: 'center' })
    yPos += 10
  })

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  const subtituloLineas = doc.splitTextToSize(subtitulo, pageWidth - 50)
  yPos += 8
  subtituloLineas.forEach((linea: string) => {
    doc.text(linea, pageWidth / 2, yPos, { align: 'center' })
    yPos += 6
  })

  doc.setFontSize(11)
  doc.text('Versión 1.0', pageWidth / 2, pageHeight - 50, { align: 'center' })
  doc.text(fechaActual, pageWidth / 2, pageHeight - 38, { align: 'center' })

  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  const disclaimer = 'Esta guía es informativa y no sustituye el asesoramiento legal. Para la implantación completa, automatización y seguimiento profesional, contacte con Custodia360.'
  const disclaimerLineas = doc.splitTextToSize(disclaimer, pageWidth - 50)
  yPos = pageHeight - 25
  disclaimerLineas.forEach((linea: string) => {
    doc.text(linea, pageWidth / 2, yPos, { align: 'center' })
    yPos += 4
  })
}

function addContenido(doc: jsPDF, titulo: string, contenido: string[], pageNum: number) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin

  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 18, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Custodia360', margin, 12)
  doc.text(`Página ${pageNum}`, pageWidth - margin, 12, { align: 'right' })

  doc.setTextColor(37, 99, 235)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  let yPos = 35
  const tituloLineas = doc.splitTextToSize(titulo, maxWidth)
  tituloLineas.forEach((linea: string) => {
    doc.text(linea, margin, yPos)
    yPos += 7
  })

  doc.setDrawColor(37, 99, 235)
  doc.setLineWidth(0.5)
  doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2)
  yPos += 8

  doc.setTextColor(50, 50, 50)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  contenido.forEach(parrafo => {
    if (parrafo.startsWith('###')) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(37, 99, 235)
      const subtitulo = parrafo.replace('### ', '')
      doc.text(subtitulo, margin, yPos)
      yPos += 7
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(50, 50, 50)
    } else if (parrafo.startsWith('- ')) {
      const texto = parrafo.replace('- ', '')
      const lineas = doc.splitTextToSize(`• ${texto}`, maxWidth - 5)
      lineas.forEach((linea: string) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 25
        }
        doc.text(linea, margin + 3, yPos)
        yPos += 5
      })
    } else {
      const lineas = doc.splitTextToSize(parrafo, maxWidth)
      lineas.forEach((linea: string) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 25
        }
        doc.text(linea, margin, yPos)
        yPos += 5
      })
      yPos += 2
    }
  })
}

export async function POST() {
  try {
    console.log('📘 Generando Guía LOPIVI Completa...')

    // GENERAR PDF 1: LOPIVI
    const pdfLopivi = new jsPDF()

    addPortada(
      pdfLopivi,
      'Guía LOPIVI Completa',
      'Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia'
    )

    const contenidoLopivi = [
      {
        titulo: 'Introducción',
        contenido: [
          'La LOPIVI refuerza la prevención, detección y actuación frente a cualquier forma de violencia hacia la infancia y adolescencia.',
          'Esta guía ayuda a centros educativos, entidades deportivas, asociaciones, academias y organizaciones sociales a comprender sus obligaciones legales y a implantar un sistema de protección eficaz.',
          '### Objetivos:',
          '- Explicar el marco legal y los principios fundamentales',
          '- Detallar las obligaciones específicas según el tipo de entidad',
          '- Describir los protocolos de actuación y formación del personal',
          '- Mostrar casos reales para fomentar la prevención activa'
        ]
      },
      {
        titulo: 'Marco Legal Completo',
        contenido: [
          '### Constitución Española',
          '- Artículo 39: Protección social, económica y jurídica de la familia y la infancia',
          '### Convención de Derechos del Niño (1989)',
          '- Tratado internacional ratificado por España',
          '### Ley Orgánica 8/2021 (LOPIVI)',
          '- Entrada en vigor: 25 de junio de 2021',
          '- Obligatoria para todas las entidades que trabajan con menores',
          '### Legislación Complementaria',
          '- Normativa educativa, deportiva, de ocio y tiempo libre',
          '- Ley Orgánica 3/2018 de Protección de Datos'
        ]
      },
      {
        titulo: 'Obligaciones Específicas de las Entidades',
        contenido: [
          '### 1. Política escrita de protección y código de conducta',
          'Documento oficial que establece el compromiso de la entidad.',
          '### 2. Nombramiento del responsable de protección',
          'Delegado principal y suplente con formación especializada.',
          '### 3. Creación del Plan de Protección',
          'Documento operativo con análisis de riesgos y medidas preventivas.',
          '### 4. Protocolos de actuación',
          'Procedimientos claros para detectar y responder ante situaciones de riesgo.',
          '### 5. Formación obligatoria del personal',
          'Formación inicial y continua en protección infantil.',
          '### 6. Canal de comunicación seguro y confidencial',
          'Sistema para reportar sospechas o situaciones de riesgo.',
          '### 7. Registro y seguimiento de incidencias',
          '- Formaciones y certificaciones',
          '- Incidencias y actuaciones',
          '- Revisiones del sistema'
        ]
      },
      {
        titulo: 'Protocolos de Actuación',
        contenido: [
          '### Detección',
          '- Señales físicas o conductuales',
          '- Cambios de comportamiento',
          '- Indicadores online',
          '### Notificación',
          '- Vías internas y externas',
          '- Plazos de respuesta',
          '- Registro documental',
          '### Intervención',
          '- Medidas urgentes',
          '- Derivación a servicios competentes',
          '- Acompañamiento del menor'
        ]
      },
      {
        titulo: 'Formación del Personal',
        contenido: [
          '### Formación inicial obligatoria (LOPIVI art. 35)',
          'Todo el personal debe recibir formación específica.',
          '### Reciclajes anuales',
          '- Cambios normativos',
          '- Nuevos riesgos (ciberacoso, grooming)',
          '- Casos prácticos',
          '### Capacitación',
          '- Identificación de riesgos',
          '- Comunicación adecuada con menores',
          '- Manejo de revelaciones',
          '- Protocolos de actuación'
        ]
      },
      {
        titulo: 'Casos Prácticos Reales',
        contenido: [
          '### 1. Centro educativo: detección temprana y derivación',
          'Profesor detecta cambios en alumna. Actuación: comunicación a Delegado, escucha activa, notificación a Servicios Sociales.',
          '### 2. Club deportivo: gestión de rumor no verificado',
          'Rumor sobre entrenador. Actuación: protocolo activado, investigación, suspensión cautelar, separación y refuerzo formativo.',
          '### 3. Asociación juvenil: actuación ante ciberacoso',
          'Menor víctima de ciberacoso en campamento. Actuación: detección, protocolo activado, retirada de contenido, mediación y seguimiento.'
        ]
      },
      {
        titulo: 'Conclusión',
        contenido: [
          'El cumplimiento de la LOPIVI requiere estructura, formación, evidencia documental y seguimiento.',
          '### Custodia360: Solución Integral',
          'Custodia360 ofrece una solución integral para automatizar y auditar cada fase, garantizando trazabilidad y cumplimiento total.',
          'Más información: www.custodia360.es | info@custodia360.es'
        ]
      }
    ]

    let pageNum = 2
    contenidoLopivi.forEach(seccion => {
      pdfLopivi.addPage()
      addContenido(pdfLopivi, seccion.titulo, seccion.contenido, pageNum)
      pageNum++
    })

    const pdfLopiviBlob = pdfLopivi.output('arraybuffer')

    console.log('📗 Generando Guía Plan de Protección...')

    // GENERAR PDF 2: PLAN
    const pdfPlan = new jsPDF()

    addPortada(
      pdfPlan,
      'Guía Plan de Protección',
      'Documento técnico de referencia para el diseño e implantación de Planes de Protección'
    )

    const contenidoPlan = [
      {
        titulo: 'Estructura del Plan',
        contenido: [
          '### 1. Portada y declaración de compromiso',
          '### 2. Marco legal y alcance',
          '### 3. Política de protección y código de conducta',
          '### 4. Análisis de riesgos específicos',
          '### 5. Medidas preventivas y correctivas',
          '### 6. Protocolos operativos y de emergencia',
          '### 7. Formación, comunicación y participación',
          '### 8. Supervisión y mejora continua'
        ]
      },
      {
        titulo: 'Análisis de Riesgos',
        contenido: [
          '- Identificar actividades con contacto directo con menores',
          '- Evaluar riesgos físicos, psicológicos, digitales, ambientales y externos',
          '- Establecer matriz de riesgos (probabilidad × impacto)',
          '- Definir controles existentes y controles adicionales'
        ]
      },
      {
        titulo: 'Medidas Preventivas',
        contenido: [
          '- Supervisión y ratios adecuados',
          '- Diseño de espacios seguros',
          '- Control de acceso y uso de dispositivos',
          '- Protocolos de acompañamiento y desplazamientos',
          '- Verificación de antecedentes y referencias'
        ]
      },
      {
        titulo: 'Protocolos de Emergencia',
        contenido: [
          '- Actuación inmediata ante riesgo grave o inminente',
          '- Comunicación interna y externa',
          '- Evacuación y primeros auxilios',
          '- Seguimiento post-incidente'
        ]
      },
      {
        titulo: 'Plantillas Incluidas',
        contenido: [
          '- Análisis de riesgos',
          '- Registro de incidencias',
          '- Modelo de notificación',
          '- Protocolo de emergencia',
          '- Checklist de auditoría'
        ]
      },
      {
        titulo: 'Conclusión',
        contenido: [
          'El Plan de Protección debe ser un documento vivo, revisado periódicamente y adaptado a cada entidad.',
          '### Custodia360',
          'Custodia360 ofrece la herramienta automatizada para mantenerlo actualizado y auditable en tiempo real.',
          'Más información: www.custodia360.es | info@custodia360.es'
        ]
      }
    ]

    pageNum = 2
    contenidoPlan.forEach(seccion => {
      pdfPlan.addPage()
      addContenido(pdfPlan, seccion.titulo, seccion.contenido, pageNum)
      pageNum++
    })

    const pdfPlanBlob = pdfPlan.output('arraybuffer')

    console.log('📤 Subiendo PDFs a Supabase Storage...')

    // Subir a Supabase Storage
    const { data: upload1, error: error1 } = await supabase.storage
      .from('docs')
      .upload('guias/guia-lopivi-completa.pdf', pdfLopiviBlob, {
        contentType: 'application/pdf',
        cacheControl: 'public, max-age=31536000',
        upsert: true
      })

    if (error1) throw error1

    const { data: upload2, error: error2 } = await supabase.storage
      .from('docs')
      .upload('guias/guia-plan-de-proteccion.pdf', pdfPlanBlob, {
        contentType: 'application/pdf',
        cacheControl: 'public, max-age=31536000',
        upsert: true
      })

    if (error2) throw error2

    // Obtener URLs públicas
    const { data: { publicUrl: urlLopivi } } = supabase.storage
      .from('docs')
      .getPublicUrl('guias/guia-lopivi-completa.pdf')

    const { data: { publicUrl: urlPlan } } = supabase.storage
      .from('docs')
      .getPublicUrl('guias/guia-plan-de-proteccion.pdf')

    console.log('✅ PDFs subidos exitosamente')
    console.log('URL LOPIVI:', urlLopivi)
    console.log('URL Plan:', urlPlan)

    // Enviar email de confirmación vía Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Custodia360 <noreply@custodia360.es>',
        to: ['info@custodia360.es'],
        subject: 'Guías actualizadas en Documentación Técnica',
        html: `
          <h2>Guías actualizadas exitosamente</h2>
          <p>Las guías LOPIVI y Plan de Protección se han generado, subido a Supabase y publicado correctamente en la sección 'Documentación Técnica' de la web.</p>
          <h3>URLs de descarga:</h3>
          <ul>
            <li><strong>Guía LOPIVI Completa:</strong><br/><a href="${urlLopivi}">${urlLopivi}</a></li>
            <li><strong>Guía Plan de Protección:</strong><br/><a href="${urlPlan}">${urlPlan}</a></li>
          </ul>
          <p><small>Generado automáticamente el ${fechaActual}</small></p>
        `
      })
    })

    if (!resendResponse.ok) {
      console.warn('⚠️ Email no enviado:', await resendResponse.text())
    } else {
      console.log('✅ Email de confirmación enviado')
    }

    return NextResponse.json({
      success: true,
      urls: {
        lopivi: urlLopivi,
        plan: urlPlan
      }
    })

  } catch (error: any) {
    console.error('❌ Error generando guías:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
