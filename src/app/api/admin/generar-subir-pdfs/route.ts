import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jsPDF } from 'jspdf'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // GENERAR PDF GUÍA LOPIVI (25 páginas)
    const docLOPIVI = new jsPDF('p', 'mm', 'a4')
    const pageWidth = docLOPIVI.internal.pageSize.getWidth()
    const pageHeight = docLOPIVI.internal.pageSize.getHeight()

    // Portada
    docLOPIVI.setFillColor(37, 99, 235)
    docLOPIVI.rect(0, 0, pageWidth, pageHeight, 'F')
    docLOPIVI.setFontSize(40)
    docLOPIVI.setTextColor(255, 255, 255)
    docLOPIVI.text('GUÍA LOPIVI', pageWidth / 2, 80, { align: 'center' })
    docLOPIVI.text('COMPLETA', pageWidth / 2, 105, { align: 'center' })
    docLOPIVI.setFontSize(18)
    docLOPIVI.text('25 páginas de contenido especializado', pageWidth / 2, 150, { align: 'center' })
    docLOPIVI.setFontSize(12)
    docLOPIVI.text('© 2025 Custodia360', pageWidth / 2, pageHeight - 20, { align: 'center' })

    // Generar 24 páginas más con contenido
    const contenidoPorPagina = [
      { titulo: 'INTRODUCCIÓN A LA LOPIVI', texto: 'La Ley Orgánica 8/2021 establece un marco integral de protección infantil. Entrada en vigor: 25 junio 2021. Obligaciones para todas las entidades que trabajan con menores.' },
      { titulo: 'MARCO LEGAL', texto: 'Convención Derechos del Niño. Código Penal. Ley 1/1996. Normativa autonómica. Sanciones de 10.001€ a 100.000€ por incumplimiento.' },
      { titulo: 'OBLIGACIONES ENTIDADES', texto: '1. Designar Delegado de Protección certificado. 2. Elaborar Plan de Protección. 3. Código de Conducta. 4. Formación personal. 5. Canal de denuncias.' },
      { titulo: 'DELEGADO DE PROTECCIÓN', texto: 'Figura central del sistema. Funciones: coordinar plan, supervisar protocolos, contacto autoridades. Formación mínima 20 horas. Certificado antecedentes.' },
      { titulo: 'PLAN DE PROTECCIÓN', texto: 'Análisis de riesgos. Medidas preventivas. Protocolos actuación. Formación. Seguimiento y evaluación anual.' },
      { titulo: 'PROTOCOLOS ACTUACIÓN', texto: 'Detección de violencia. Comunicación de casos. Actuación emergencias. Coordinación autoridades. Protección víctimas.' },
      { titulo: 'FORMACIÓN PERSONAL', texto: 'Personal contacto: 8-12h. Delegado: 20-40h. Personal sin contacto: 4-6h. Contenidos: normativa, protocolos, detección, código conducta.' },
      { titulo: 'CÓDIGO DE CONDUCTA', texto: 'Respeto dignidad menor. Tolerancia cero violencia. No contacto físico innecesario. No estar a solas con menor. Comunicación apropiada.' },
      { titulo: 'CANAL DE DENUNCIAS', texto: 'Confidencial y seguro. Múltiples vías: email, buzón físico, teléfono, formulario web. Respuesta inmediata. Protección denunciante.' },
      { titulo: 'CERTIFICADOS ANTECEDENTES', texto: 'Obligatorio para todo personal. Delitos naturaleza sexual. Renovación cada 3 años. Conservar en expediente.' },
      { titulo: 'ANÁLISIS DE RIESGOS', texto: 'Espacios: vestuarios, duchas, almacenes. Actividades: desplazamientos, campamentos. Personal: ratios adultos/menores, supervisión.' },
      { titulo: 'MEDIDAS PREVENTIVAS', texto: 'Control accesos. Supervisión continua. Visibilidad garantizada. Protocolos vestuarios. Normas comunicación digital.' },
      { titulo: 'SEÑALES DE ALERTA', texto: 'Físicas: lesiones, descuido higiene. Psicológicas: cambios comportamiento, aislamiento. Conductuales: agresividad, miedo extremo.' },
      { titulo: 'PROTOCOLO DETECCIÓN', texto: '1. Observar señales. 2. Documentar objetivamente. 3. Comunicar delegado. 4. Evaluar situación. 5. Decidir actuación.' },
      { titulo: 'COORDINACIÓN AUTORIDADES', texto: 'Fiscalía de Menores. Servicios Sociales. Policía Nacional. Guardia Civil. Defensor del Menor autonómico.' },
      { titulo: 'DOCUMENTACIÓN', texto: 'Registro de casos. Actas formación. Comunicaciones familias. Informes incidentes. Revisiones plan. Archivo expedientes.' },
      { titulo: 'COMUNICACIÓN FAMILIAS', texto: 'Informar medidas protección. Canales disponibles. Código de conducta. Protocolos. Colaboración activa familias.' },
      { titulo: 'ESPACIOS SEGUROS', texto: 'Vestuarios separados. Puertas con visibilidad. Zonas bien iluminadas. Control accesos. Señalización zonas restringidas.' },
      { titulo: 'ACTIVIDADES ESPECIALES', texto: 'Desplazamientos: ratios adecuados. Campamentos: supervisión nocturna. Competiciones: protocolo emergencias.' },
      { titulo: 'REVISIÓN Y MEJORA', texto: 'Revisión anual plan. Evaluación eficacia medidas. Actualización protocolos. Formación continua. Auditorías internas.' },
      { titulo: 'CASOS PRÁCTICOS', texto: 'Caso 1: Detección lesión física. Caso 2: Comunicación inapropiada. Caso 3: Cambio comportamiento. Caso 4: Denuncia anónima.' },
      { titulo: 'RECURSOS EMERGENCIA', texto: 'Emergencias: 112. Teléfono Menor: 116 111. ANAR: 900 20 20 10. Fiscalía Menores. Servicios Sociales locales.' },
      { titulo: 'CUSTODIA360', texto: 'Sistema automatizado cumplimiento LOPIVI. Implementación 72 horas. Delegado certificado incluido. Formación personal. Plataforma 24/7.' },
      { titulo: 'CONCLUSIÓN', texto: 'La protección infantil es responsabilidad de todos. LOPIVI no es proyecto puntual sino compromiso continuo. Actualización constante obligatoria.' }
    ]

    contenidoPorPagina.forEach((pagina, index) => {
      docLOPIVI.addPage()

      // Header
      docLOPIVI.setFillColor(37, 99, 235)
      docLOPIVI.rect(0, 0, pageWidth, 15, 'F')
      docLOPIVI.setFontSize(10)
      docLOPIVI.setTextColor(255, 255, 255)
      docLOPIVI.text('GUÍA LOPIVI COMPLETA', 20, 10)
      docLOPIVI.text(`Página ${index + 2} de 25`, pageWidth - 20, 10, { align: 'right' })

      // Contenido
      docLOPIVI.setFontSize(16)
      docLOPIVI.setTextColor(37, 99, 235)
      docLOPIVI.text(pagina.titulo, 20, 30)

      docLOPIVI.setFontSize(11)
      docLOPIVI.setTextColor(0, 0, 0)
      const lineas = docLOPIVI.splitTextToSize(pagina.texto, pageWidth - 40)
      docLOPIVI.text(lineas, 20, 45)

      // Footer
      docLOPIVI.setFillColor(37, 99, 235)
      docLOPIVI.rect(0, pageHeight - 10, pageWidth, 10, 'F')
      docLOPIVI.setFontSize(8)
      docLOPIVI.setTextColor(255, 255, 255)
      docLOPIVI.text('© 2025 Custodia360 - custodia360.com', pageWidth / 2, pageHeight - 5, { align: 'center' })
    })

    const pdfBlobLOPIVI = docLOPIVI.output('arraybuffer')

    // GENERAR PDF PLAN DE PROTECCIÓN
    const docPlan = new jsPDF('p', 'mm', 'a4')

    // Portada
    docPlan.setFillColor(34, 197, 94)
    docPlan.rect(0, 0, pageWidth, pageHeight, 'F')
    docPlan.setFontSize(40)
    docPlan.setTextColor(255, 255, 255)
    docPlan.text('GUÍA', pageWidth / 2, 70, { align: 'center' })
    docPlan.text('PLAN DE', pageWidth / 2, 95, { align: 'center' })
    docPlan.text('PROTECCIÓN', pageWidth / 2, 120, { align: 'center' })
    docPlan.setFontSize(18)
    docPlan.text('Infantil y Adolescente LOPIVI', pageWidth / 2, 150, { align: 'center' })
    docPlan.setFontSize(12)
    docPlan.text('© 2025 Custodia360', pageWidth / 2, pageHeight - 20, { align: 'center' })

    const contenidoPlan = [
      { titulo: 'QUÉ ES EL PLAN', texto: 'Documento central con todas las medidas de protección. Objetivo: crear entorno seguro. Contenido: análisis riesgos, medidas preventivas, protocolos.' },
      { titulo: 'ESTRUCTURA DEL PLAN', texto: 'Portada. Datos entidad. Índice. Análisis riesgos. Medidas preventivas. Protocolos. Formación. Código conducta. Canal comunicación. Seguimiento.' },
      { titulo: 'DATOS DE LA ENTIDAD', texto: 'Nombre entidad. CIF. Dirección. Sector actividad. Número menores. Delegado de Protección. Contacto emergencias.' },
      { titulo: 'ANÁLISIS DE RIESGOS', texto: 'Identificar situaciones riesgo. Evaluar espacios físicos. Analizar actividades. Mapear puntos críticos. Valorar vulnerabilidades.' },
      { titulo: 'MEDIDAS PREVENTIVAS', texto: 'Control accesos. Supervisión continua. Ratios adecuados. Protocolos vestuarios. Normas comunicación. Señalización zonas.' },
      { titulo: 'PROTOCOLOS DETALLADOS', texto: 'Detección violencia. Comunicación casos. Actuación emergencias. Coordinación autoridades. Protección víctimas. Seguimiento casos.' },
      { titulo: 'FORMACIÓN', texto: 'Plan formación personal. Calendario. Contenidos. Duración. Certificación. Renovación. Registro asistencia.' },
      { titulo: 'CÓDIGO DE CONDUCTA', texto: 'Principios básicos. Normas específicas. Trato menores. Comunicación. Redes sociales. Situaciones especiales.' },
      { titulo: 'CANAL DE DENUNCIAS', texto: 'Características. Vías comunicación. Gestión comunicaciones. Plazos respuesta. Protección denunciante. Confidencialidad.' },
      { titulo: 'PLANTILLAS', texto: 'Ficha registro caso. Informe incidente. Comunicación familia. Acta reunión. Registro formación. Checklist revisión.' },
      { titulo: 'IMPLEMENTACIÓN', texto: 'Aprobación dirección. Formación personal. Comunicación familias. Puesta en marcha. Monitorización. Evaluación.' },
      { titulo: 'SEGUIMIENTO', texto: 'Revisión anual. Evaluación eficacia. Actualización medidas. Auditorías. Mejora continua. Documentación resultados.' }
    ]

    contenidoPlan.forEach((pagina, index) => {
      docPlan.addPage()

      docPlan.setFillColor(34, 197, 94)
      docPlan.rect(0, 0, pageWidth, 15, 'F')
      docPlan.setFontSize(10)
      docPlan.setTextColor(255, 255, 255)
      docPlan.text('GUÍA PLAN DE PROTECCIÓN', 20, 10)
      docPlan.text(`Página ${index + 2}`, pageWidth - 20, 10, { align: 'right' })

      docPlan.setFontSize(16)
      docPlan.setTextColor(34, 197, 94)
      docPlan.text(pagina.titulo, 20, 30)

      docPlan.setFontSize(11)
      docPlan.setTextColor(0, 0, 0)
      const lineas = docPlan.splitTextToSize(pagina.texto, pageWidth - 40)
      docPlan.text(lineas, 20, 45)

      docPlan.setFillColor(34, 197, 94)
      docPlan.rect(0, pageHeight - 10, pageWidth, 10, 'F')
      docPlan.setFontSize(8)
      docPlan.setTextColor(255, 255, 255)
      docPlan.text('© 2025 Custodia360 - custodia360.com', pageWidth / 2, pageHeight - 5, { align: 'center' })
    })

    const pdfBlobPlan = docPlan.output('arraybuffer')

    // ELIMINAR PDFs ANTIGUOS PRIMERO
    await supabase.storage
      .from('docs')
      .remove(['guias/guia-lopivi-completa.pdf', 'guias/guia-plan-de-proteccion.pdf'])

    // SUBIR NUEVOS PDFs A SUPABASE
    const { error: error1 } = await supabase.storage
      .from('docs')
      .upload('guias/guia-lopivi-completa.pdf', pdfBlobLOPIVI, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (error1) throw error1

    const { error: error2 } = await supabase.storage
      .from('docs')
      .upload('guias/guia-plan-de-proteccion.pdf', pdfBlobPlan, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (error2) throw error2

    return NextResponse.json({
      success: true,
      message: 'PDFs generados y subidos correctamente a Supabase',
      files: [
        'docs/guias/guia-lopivi-completa.pdf (25 páginas)',
        'docs/guias/guia-plan-de-proteccion.pdf (13 páginas)'
      ]
    })

  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
