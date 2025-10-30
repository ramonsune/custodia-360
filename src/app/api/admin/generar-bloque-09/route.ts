import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jsPDF } from 'jspdf'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const fechaActual = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })

    const documentosGenerados: string[] = []

    // Configuración común para todos los PDFs
    const crearPDFBase = () => {
      const doc = new jsPDF('p', 'mm', 'a4')
      return doc
    }

    const addPortada = (doc: jsPDF, titulo: string, subtitulo: string = '') => {
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // Fondo azul Custodia360
      doc.setFillColor(37, 99, 235)
      doc.rect(0, 0, pageWidth, pageHeight, 'F')

      // Logo simulado (círculo con C)
      doc.setFillColor(255, 255, 255)
      doc.circle(pageWidth / 2, 60, 20, 'F')
      doc.setFontSize(32)
      doc.setTextColor(37, 99, 235)
      doc.text('C', pageWidth / 2, 68, { align: 'center' })

      // Título
      doc.setFontSize(28)
      doc.setTextColor(255, 255, 255)
      doc.text(titulo, pageWidth / 2, 120, { align: 'center', maxWidth: pageWidth - 40 })

      if (subtitulo) {
        doc.setFontSize(14)
        doc.text(subtitulo, pageWidth / 2, 140, { align: 'center' })
      }

      // Versión y fecha
      doc.setFontSize(11)
      doc.text('Versión 1.0', pageWidth / 2, 170, { align: 'center' })
      doc.text(fechaActual, pageWidth / 2, 180, { align: 'center' })

      // Footer
      doc.setFontSize(10)
      doc.text('Custodia360 — Documentación Corporativa', pageWidth / 2, pageHeight - 15, { align: 'center' })
    }

    const addHeaderFooter = (doc: jsPDF, pageNum: number, totalPages: number) => {
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // Header
      doc.setFillColor(37, 99, 235)
      doc.rect(0, 0, pageWidth, 12, 'F')
      doc.setFontSize(9)
      doc.setTextColor(255, 255, 255)
      doc.text('CUSTODIA360', 15, 8)

      // Footer
      doc.setFillColor(37, 99, 235)
      doc.rect(0, pageHeight - 12, pageWidth, 12, 'F')
      doc.setFontSize(8)
      doc.setTextColor(255, 255, 255)
      doc.text(`Custodia360 — Documentación Corporativa | Página ${pageNum} de ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' })
    }

    const addContenido = (doc: jsPDF, contenido: { titulo: string, texto: string }[], startPage: number = 2) => {
      let pageNum = startPage
      let yPosition = 25

      contenido.forEach((seccion, index) => {
        // Verificar espacio para nueva sección
        if (yPosition > 250) {
          doc.addPage()
          pageNum++
          addHeaderFooter(doc, pageNum, startPage + contenido.length)
          yPosition = 25
        }

        // Título de sección
        doc.setFontSize(14)
        doc.setTextColor(37, 99, 235)
        doc.text(seccion.titulo, 20, yPosition)
        yPosition += 8

        // Contenido
        doc.setFontSize(11)
        doc.setTextColor(0, 0, 0)
        const lineas = doc.splitTextToSize(seccion.texto, 170)
        lineas.forEach((linea: string) => {
          if (yPosition > 270) {
            doc.addPage()
            pageNum++
            addHeaderFooter(doc, pageNum, startPage + contenido.length)
            yPosition = 25
          }
          doc.text(linea, 20, yPosition)
          yPosition += 5.5
        })

        yPosition += 5
      })
    }

    // ========================================
    // 1) DOSSIER CORPORATIVO CUSTODIA360
    // ========================================
    const doc1 = crearPDFBase()
    addPortada(doc1, 'DOSSIER CORPORATIVO', 'Custodia360')

    doc1.addPage()
    addHeaderFooter(doc1, 2, 4)

    const contenidoDossier = [
      {
        titulo: '1. Quiénes somos',
        texto: 'Custodia360 es una solución integral de cumplimiento automatizado para la protección de la infancia y adolescencia conforme a la Ley Orgánica 8/2021 (LOPIVI). Ayudamos a entidades educativas, deportivas y sociales a implantar, mantener y auditar sus obligaciones legales con eficiencia y seguridad digital.'
      },
      {
        titulo: '2. Misión',
        texto: 'Proteger los derechos de los menores facilitando a las entidades herramientas tecnológicas que garanticen entornos seguros y cumplimiento normativo continuo.'
      },
      {
        titulo: '3. Servicios principales',
        texto: '• Generación automatizada de documentación LOPIVI.\n• Planes de protección personalizados.\n• Canal seguro digital de comunicación.\n• Auditorías y seguimiento anual.\n• Formación y sensibilización del personal.'
      },
      {
        titulo: '4. Valor diferencial',
        texto: '• Plataforma 100% online.\n• Plantillas y protocolos homologados.\n• Automatización completa de alertas y auditorías.\n• Soporte jurídico y técnico.'
      },
      {
        titulo: '5. Contacto',
        texto: '📧 info@custodia360.es\n🌐 https://custodia360.es'
      }
    ]

    addContenido(doc1, contenidoDossier)
    const pdf1 = doc1.output('arraybuffer')

    // ========================================
    // 2) FICHA TÉCNICA SOLUCIÓN AUTOMATIZADA
    // ========================================
    const doc2 = crearPDFBase()
    addPortada(doc2, 'FICHA TÉCNICA', 'Solución Automatizada')

    doc2.addPage()
    addHeaderFooter(doc2, 2, 5)

    const contenidoFicha = [
      {
        titulo: '1. Descripción general',
        texto: 'Sistema en la nube que automatiza la creación, almacenamiento y actualización de documentos de cumplimiento LOPIVI, con control de versiones y evidencias digitales.'
      },
      {
        titulo: '2. Componentes del sistema',
        texto: 'Generador documental: Crea automáticamente plantillas adaptadas (SAME + Supabase)\n\nPanel Admin: Control y supervisión de cumplimiento (Netlify / React)\n\nCanal seguro: Comunicación confidencial 24/7 (Resend + Supabase)\n\nAuditorías automáticas: Seguimiento de indicadores (Scripts internos Custodia360)\n\nAlertas y reportes: Notificaciones por correo (Resend)'
      },
      {
        titulo: '3. Integraciones',
        texto: '• Supabase (almacenamiento y control de versiones)\n• Resend (alertas y comunicación)\n• SAME (gestión documental y lógica de IA)'
      },
      {
        titulo: '4. Cumplimiento normativo',
        texto: '• LOPIVI\n• RGPD / LOPDGDD\n• ISO 27001 (seguridad de la información)'
      }
    ]

    addContenido(doc2, contenidoFicha)
    const pdf2 = doc2.output('arraybuffer')

    // ========================================
    // 3) PRESENTACIÓN COMERCIAL
    // ========================================
    const doc3 = crearPDFBase()
    addPortada(doc3, 'PRESENTACIÓN COMERCIAL', 'Resumen Ejecutivo')

    doc3.addPage()
    addHeaderFooter(doc3, 2, 5)

    const contenidoPresentacion = [
      {
        titulo: '1. Problema',
        texto: 'Las entidades que trabajan con menores deben cumplir requisitos complejos y costosos (LOPIVI, Planes de Protección, formación, auditorías).'
      },
      {
        titulo: '2. Solución Custodia360',
        texto: 'Un sistema digital que automatiza toda la gestión documental, seguimiento y evidencia legal. Desde una única plataforma, las entidades pueden generar, auditar y actualizar su cumplimiento.'
      },
      {
        titulo: '3. Beneficios',
        texto: '✅ Reducción de costes administrativos\n✅ Cumplimiento legal permanente\n✅ Control y evidencias en tiempo real\n✅ Imagen institucional reforzada'
      },
      {
        titulo: '4. Público objetivo',
        texto: '• Centros educativos y deportivos\n• Asociaciones juveniles\n• ONG y entidades sociales\n• Ayuntamientos y administraciones locales'
      },
      {
        titulo: '5. Modalidades de contratación',
        texto: '• Plan Básico: acceso a plantillas y canal seguro\n• Plan Avanzado: personalización + seguimiento\n• Plan Premium: automatización total + soporte jurídico'
      },
      {
        titulo: '6. Próximos pasos',
        texto: 'Solicite demostración en: demo@custodia360.es'
      }
    ]

    addContenido(doc3, contenidoPresentacion)
    const pdf3 = doc3.output('arraybuffer')

    // ========================================
    // 4) CATÁLOGO SERVICIOS COMPLEMENTARIOS
    // ========================================
    const doc4 = crearPDFBase()
    addPortada(doc4, 'CATÁLOGO DE SERVICIOS', 'Servicios Complementarios')

    doc4.addPage()
    addHeaderFooter(doc4, 2, 3)

    const contenidoCatalogo = [
      {
        titulo: 'Servicios Complementarios Disponibles',
        texto: 'FORMACIÓN\n• Curso "Aplicación práctica LOPIVI"\n• 4 horas online o presencial\n• Entrega: Certificado\n\nASESORÍA JURÍDICA\n• Revisión documental personalizada\n• Asistencia remota\n• Entrega: Informe técnico\n\nAUDITORÍA\n• Evaluación anual externa\n• Auditoría Custodia360\n• Entrega: Informe + Certificado\n\nPLAN DIGITAL\n• Implantación del canal seguro\n• Configuración completa\n• Entrega: Web + QR\n\nSOPORTE TÉCNICO\n• Asistencia sobre panel y documentos\n• Email + Videollamada\n• SLA 24h'
      },
      {
        titulo: 'Descuentos aplicables',
        texto: '• 10% para clientes con Plan Avanzado\n• 20% para contratos plurianuales'
      }
    ]

    addContenido(doc4, contenidoCatalogo)
    const pdf4 = doc4.output('arraybuffer')

    // ========================================
    // 5) POLÍTICA SLA Y CONTRATO SERVICIO
    // ========================================
    const doc5 = crearPDFBase()
    addPortada(doc5, 'POLÍTICA DE SLA', 'Contrato de Servicio')

    doc5.addPage()
    addHeaderFooter(doc5, 2, 5)

    const contenidoSLA = [
      {
        titulo: '1. Objeto',
        texto: 'Regular los niveles de servicio, tiempos de respuesta y responsabilidades de Custodia360 en la prestación de servicios automatizados.'
      },
      {
        titulo: '2. Alcance',
        texto: 'Aplicable a todos los clientes con contrato activo.'
      },
      {
        titulo: '3. SLA — Compromisos de servicio',
        texto: 'CRÍTICA (servicio caído)\n• Tiempo de respuesta: ≤ 1 hora\n• Tiempo de resolución: ≤ 4 horas\n• Medio: Soporte 24/7\n\nALTA (error funcional)\n• Tiempo de respuesta: ≤ 4 horas\n• Tiempo de resolución: ≤ 24 horas\n• Medio: Email / chat\n\nMEDIA (mejoras menores)\n• Tiempo de respuesta: ≤ 24 horas\n• Tiempo de resolución: ≤ 72 horas\n• Medio: Ticket\n\nBAJA (consultas)\n• Tiempo de respuesta: ≤ 48 horas\n• Tiempo de resolución: ≤ 5 días\n• Medio: Email'
      },
      {
        titulo: '4. Responsabilidades del Cliente',
        texto: '• Facilitar información correcta y acceso técnico\n• No compartir credenciales\n• Usar la plataforma conforme a la legalidad'
      },
      {
        titulo: '5. Vigencia',
        texto: 'Contrato anual, renovable automáticamente salvo comunicación 30 días antes.'
      },
      {
        titulo: '6. Confidencialidad y datos',
        texto: 'Ambas partes se comprometen a mantener la confidencialidad y cumplir el RGPD.'
      },
      {
        titulo: '7. Jurisdicción',
        texto: 'Tribunales competentes según legislación española vigente.'
      }
    ]

    addContenido(doc5, contenidoSLA)
    const pdf5 = doc5.output('arraybuffer')

    // ========================================
    // SUBIR A SUPABASE
    // ========================================
    const documentos = [
      { nombre: '01_Dossier_Corporativo_Custodia360.pdf', blob: pdf1 },
      { nombre: '02_Ficha_Tecnica_Solucion_Automatizada.pdf', blob: pdf2 },
      { nombre: '03_Presentacion_Comercial.pdf', blob: pdf3 },
      { nombre: '04_Catalogo_Servicios_Complementarios.pdf', blob: pdf4 },
      { nombre: '05_Politica_SLA_Contrato_Servicio.pdf', blob: pdf5 }
    ]

    for (const doc of documentos) {
      const { error } = await supabase.storage
        .from('docs')
        .upload(`plantillas/09_Comercial_y_Corporativo/${doc.nombre}`, doc.blob, {
          contentType: 'application/pdf',
          upsert: true
        })

      if (error) throw error

      const url = `${supabaseUrl}/storage/v1/object/public/docs/plantillas/09_Comercial_y_Corporativo/${doc.nombre}`
      documentosGenerados.push(`${doc.nombre}: ${url}`)
    }

    // ========================================
    // ENVIAR EMAIL CON RESEND
    // ========================================
    await resend.emails.send({
      from: 'Custodia360 <noreply@custodia360.es>',
      to: 'info@custodia360.es',
      subject: 'Bloque 09 — Comercial y Corporativo Custodia360 creado correctamente',
      html: `
        <h2>✅ Bloque 09 generado exitosamente</h2>
        <p>Se han creado y subido correctamente los documentos del <strong>Bloque 09_Comercial_y_Corporativo</strong>:</p>
        <ul>
          ${documentosGenerados.map(doc => `<li>${doc}</li>`).join('')}
        </ul>
        <p><strong>Fecha de generación:</strong> ${fechaActual}</p>
        <p><strong>Ubicación:</strong> Supabase Storage → /docs/plantillas/09_Comercial_y_Corporativo/</p>
        <br>
        <p>Todos los documentos están disponibles para descarga pública.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Custodia360 - Sistema Automatizado LOPIVI</p>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'Bloque 09 generado y subido correctamente',
      documentos: documentosGenerados,
      emailEnviado: true
    })

  } catch (error: any) {
    console.error('Error generando Bloque 09:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
