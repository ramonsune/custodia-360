#!/usr/bin/env node

import pkg from 'jspdf'
const { jsPDF } = pkg
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Crear directorio de salida
const outputDir = path.join(__dirname, '..', 'public', 'docs', 'guias')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
  console.log(`✅ Directorio creado: ${outputDir}`)
}

const fechaActual = new Date().toLocaleDateString('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

// ============================================================
// FUNCIÓN: Agregar portada
// ============================================================
function addPortada(doc, titulo, subtitulo) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Fondo azul Custodia360
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Logo simulado (círculo con C)
  doc.setFillColor(255, 255, 255)
  doc.circle(pageWidth / 2, 60, 18, 'F')
  doc.setTextColor(37, 99, 235)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('C', pageWidth / 2, 66, { align: 'center' })

  // Título principal
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.text('Custodia360', pageWidth / 2, 95, { align: 'center' })

  // Título del documento
  doc.setFontSize(20)
  const tituloLineas = doc.splitTextToSize(titulo, pageWidth - 40)
  let yPos = 125
  tituloLineas.forEach(linea => {
    doc.text(linea, pageWidth / 2, yPos, { align: 'center' })
    yPos += 10
  })

  // Subtítulo
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  const subtituloLineas = doc.splitTextToSize(subtitulo, pageWidth - 50)
  yPos += 10
  subtituloLineas.forEach(linea => {
    doc.text(linea, pageWidth / 2, yPos, { align: 'center' })
    yPos += 6
  })

  // Versión y fecha
  doc.setFontSize(11)
  doc.text('Versión 1.0', pageWidth / 2, pageHeight - 50, { align: 'center' })
  doc.text(fechaActual, pageWidth / 2, pageHeight - 38, { align: 'center' })

  // Disclaimer
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  const disclaimer = 'Esta guía es informativa y no sustituye el asesoramiento legal. Para la implantación completa, automatización y seguimiento profesional, contacte con Custodia360.'
  const disclaimerLineas = doc.splitTextToSize(disclaimer, pageWidth - 50)
  yPos = pageHeight - 25
  disclaimerLineas.forEach(linea => {
    doc.text(linea, pageWidth / 2, yPos, { align: 'center' })
    yPos += 4
  })
}

// ============================================================
// FUNCIÓN: Agregar página de contenido
// ============================================================
function addContenidoPagina(doc, titulo, contenido, pageNum) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin

  // Header
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 18, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Custodia360', margin, 12)
  doc.text(`Página ${pageNum}`, pageWidth - margin, 12, { align: 'right' })

  // Título de sección
  doc.setTextColor(37, 99, 235)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  let yPos = 35
  const tituloLineas = doc.splitTextToSize(titulo, maxWidth)
  tituloLineas.forEach(linea => {
    doc.text(linea, margin, yPos)
    yPos += 7
  })

  // Línea separadora
  doc.setDrawColor(37, 99, 235)
  doc.setLineWidth(0.5)
  doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2)
  yPos += 8

  // Contenido
  doc.setTextColor(50, 50, 50)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  contenido.forEach(parrafo => {
    if (parrafo.startsWith('###')) {
      // Subtítulo
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
      // Lista
      const texto = parrafo.replace('- ', '')
      const lineas = doc.splitTextToSize(`• ${texto}`, maxWidth - 5)
      lineas.forEach(linea => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 25
        }
        doc.text(linea, margin + 3, yPos)
        yPos += 5
      })
    } else {
      // Párrafo normal
      const lineas = doc.splitTextToSize(parrafo, maxWidth)
      lineas.forEach(linea => {
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

// ============================================================
// GENERAR PDF 1: GUÍA LOPIVI COMPLETA
// ============================================================
console.log('\n📘 Generando Guía LOPIVI Completa...')

const pdfLopivi = new jsPDF()

// Portada
addPortada(
  pdfLopivi,
  'Guía LOPIVI Completa',
  'Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia'
)

// Contenido del PDF
const contenidoLopivi = [
  {
    titulo: 'Introducción',
    contenido: [
      'La LOPIVI refuerza la prevención, detección y actuación frente a cualquier forma de violencia hacia la infancia y adolescencia.',
      'Esta guía ayuda a centros educativos, entidades deportivas, asociaciones, academias y organizaciones sociales a comprender sus obligaciones legales y a implantar un sistema de protección eficaz.',
      '### Objetivos de esta guía:',
      '- Explicar el marco legal y los principios fundamentales de la LOPIVI',
      '- Detallar las obligaciones específicas según el tipo de entidad',
      '- Describir los protocolos de actuación y formación del personal',
      '- Mostrar casos reales para fomentar la prevención activa'
    ]
  },
  {
    titulo: 'Marco Legal Completo',
    contenido: [
      'La protección de menores en España se sustenta en un marco normativo robusto:',
      '### Constitución Española',
      '- Artículo 39: Protección social, económica y jurídica de la familia y la infancia',
      '### Convención de Derechos del Niño (1989)',
      '- Tratado internacional ratificado por España que establece los derechos inalienables de la infancia',
      '### Ley Orgánica 8/2021 (LOPIVI)',
      '- Protección Integral a la Infancia y la Adolescencia frente a la Violencia',
      '- Entrada en vigor: 25 de junio de 2021',
      '- Obligatoria para todas las entidades que trabajan con menores',
      '### Legislación Complementaria',
      '- Normativa educativa, deportiva, de ocio y tiempo libre',
      '- Protocolos de servicios sociales y sanitarios',
      '- Ley Orgánica 3/2018 de Protección de Datos'
    ]
  },
  {
    titulo: 'Obligaciones Específicas de las Entidades',
    contenido: [
      'La LOPIVI establece obligaciones fundamentales para todas las entidades que trabajan con menores:',
      '### 1. Política Escrita de Protección',
      'Documento oficial que establece el compromiso de la entidad con la protección de la infancia.',
      '### 2. Código de Conducta',
      'Normas claras de comportamiento para todo el personal que establece límites apropiados.',
      '### 3. Nombramiento del Responsable de Protección',
      'Designación obligatoria de un delegado principal y uno suplente con formación especializada.',
      '### 4. Creación del Plan de Protección',
      'Documento operativo que incluye análisis de riesgos y medidas preventivas.',
      '### 5. Protocolos de Actuación',
      'Procedimientos claros para detectar, evaluar y responder ante situaciones de riesgo.',
      '### 6. Formación Obligatoria del Personal',
      'Todo el personal debe recibir formación inicial y continua en protección infantil.',
      '### 7. Canal de Comunicación Seguro',
      'Sistema confidencial para reportar sospechas o situaciones de riesgo.',
      '### Registro y Seguimiento',
      '- Formaciones realizadas y certificaciones obtenidas',
      '- Incidencias reportadas y actuaciones realizadas',
      '- Revisiones del sistema de protección'
    ]
  },
  {
    titulo: 'Protocolos de Actuación - Detección',
    contenido: [
      'La detección temprana es fundamental para intervenir eficazmente.',
      '### Señales Físicas',
      '- Lesiones inexplicables o frecuentes',
      '- Marcas compatibles con maltrato',
      '- Descuido en higiene personal',
      '- Cambios bruscos de peso',
      '### Señales Conductuales',
      '- Cambios significativos en el comportamiento',
      '- Miedo o rechazo a personas específicas',
      '- Conductas regresivas',
      '- Conocimiento sexual inapropiado para la edad',
      '### Señales Emocionales',
      '- Ansiedad o tristeza persistentes',
      '- Baja autoestima',
      '- Dificultades de concentración',
      '- Trastornos del sueño',
      '### Indicadores Online',
      '- Cambios en el uso de dispositivos',
      '- Secretismo con la actividad online',
      '- Contactos desconocidos',
      '- Contenido inapropiado'
    ]
  },
  {
    titulo: 'Protocolos de Actuación - Notificación',
    contenido: [
      'Cuando se detecta una situación de riesgo, es fundamental activar el protocolo.',
      '### Vías Internas',
      '- Comunicación inmediata al Delegado de Protección',
      '- Uso del canal seguro y confidencial',
      '- Registro documental con fecha y hora',
      '- Preservación de evidencias',
      '### Vías Externas',
      '- Servicios Sociales del municipio',
      '- Fuerzas y Cuerpos de Seguridad (si hay delito)',
      '- Fiscalía de Menores (casos urgentes)',
      '- Servicios sanitarios (atención médica)',
      '### Plazos de Respuesta',
      '- Notificación interna: Inmediata (máximo 24 horas)',
      '- Evaluación inicial: 24-48 horas',
      '- Derivación externa: 72 horas (según gravedad)',
      '- Seguimiento: Continuo hasta resolución'
    ]
  },
  {
    titulo: 'Formación del Personal',
    contenido: [
      'La formación es un pilar fundamental del sistema de protección.',
      '### Formación Inicial Obligatoria',
      'Según el artículo 35 de la LOPIVI, todo el personal debe recibir formación específica.',
      '### Contenidos Mínimos',
      '- Marco legal LOPIVI',
      '- Derechos de la infancia',
      '- Identificación de señales de riesgo',
      '- Protocolos de actuación',
      '- Código de conducta',
      '- Comunicación con menores',
      '- Confidencialidad y protección de datos',
      '### Reciclajes Anuales',
      '- Cambios normativos',
      '- Nuevos riesgos (ciberacoso, grooming)',
      '- Buenas prácticas',
      '- Casos prácticos y simulaciones',
      '### Capacitación en Comunicación',
      '- Escucha activa',
      '- Lenguaje apropiado según edad',
      '- Manejo de revelaciones',
      '- Apoyo emocional'
    ]
  },
  {
    titulo: 'Casos Prácticos Reales',
    contenido: [
      '### Caso 1: Centro Educativo - Detección Temprana',
      'Un profesor observa cambios significativos en una alumna de 9 años: tristeza, aislamiento, bajo rendimiento y marcas en los brazos.',
      'Actuación: Documenta observaciones, comunica al Delegado, escucha activa con la menor, notificación a Servicios Sociales.',
      'Resultado: Intervención familiar temprana, medida de protección, seguimiento coordinado.',
      '### Caso 2: Club Deportivo - Rumor No Verificado',
      'Circula rumor sobre comportamientos inapropiados de un entrenador.',
      'Actuación: Protocolo activado, entrevistas confidenciales, revisión de normativa, suspensión cautelar durante investigación.',
      'Resultado: Se constatan violaciones del código de conducta (mensajes privados), separación del entrenador, refuerzo formativo.',
      '### Caso 3: Asociación Juvenil - Ciberacoso',
      'Durante un campamento, un menor es víctima de ciberacoso por compañeros.',
      'Actuación: Detección de ansiedad, conversación privada, activación protocolo, retirada de contenido, notificación familias.',
      'Resultado: Taller de redes sociales, mediación, seguimiento psicológico, actualización de normas.'
    ]
  },
  {
    titulo: 'Conclusión',
    contenido: [
      'El cumplimiento de la LOPIVI requiere estructura, formación, evidencia documental y seguimiento continuo.',
      '### Elementos Clave del Éxito',
      '- Compromiso de la dirección',
      '- Formación continua del personal',
      '- Protocolos claros y accesibles',
      '- Cultura de protección',
      '- Documentación y trazabilidad',
      '- Evaluación y mejora continua',
      '### Beneficios',
      '- Protección efectiva de menores',
      '- Cumplimiento legal',
      '- Confianza de familias',
      '- Ambiente seguro',
      '- Reducción de riesgos',
      '### Custodia360: Solución Integral',
      'Custodia360 ofrece la primera plataforma automatizada especializada en cumplimiento LOPIVI.',
      'Permite automatizar implementación, mantener trazabilidad, auditar en tiempo real, formar y certificar personal, y gestionar casos de forma segura.',
      'Más información: www.custodia360.es | info@custodia360.es | Tel: 678 771 198'
    ]
  }
]

let pageNum = 2
contenidoLopivi.forEach(seccion => {
  pdfLopivi.addPage()
  addContenidoPagina(pdfLopivi, seccion.titulo, seccion.contenido, pageNum)
  pageNum++
})

const outputPath1 = path.join(outputDir, 'guia-lopivi-completa.pdf')
pdfLopivi.save(outputPath1)
console.log(`✅ Guía LOPIVI Completa generada: ${outputPath1}`)

// ============================================================
// GENERAR PDF 2: GUÍA PLAN DE PROTECCIÓN
// ============================================================
console.log('\n📗 Generando Guía Plan de Protección...')

const pdfPlan = new jsPDF()

addPortada(
  pdfPlan,
  'Guía Plan de Protección',
  'Documento técnico de referencia para el diseño e implantación de Planes de Protección'
)

const contenidoPlan = [
  {
    titulo: 'Estructura del Plan de Protección',
    contenido: [
      'El Plan de Protección es el documento operativo fundamental de protección.',
      '### 1. Portada y Declaración de Compromiso',
      'Documento oficial que refleja el compromiso de la entidad.',
      '### 2. Marco Legal y Alcance',
      'Referencia normativa y ámbito de aplicación.',
      '### 3. Política de Protección y Código de Conducta',
      'Principios rectores y normas de comportamiento.',
      '### 4. Análisis de Riesgos Específicos',
      'Identificación sistemática según actividades.',
      '### 5. Medidas Preventivas y Correctivas',
      'Acciones para prevenir y corregir.',
      '### 6. Protocolos Operativos y de Emergencia',
      'Procedimientos paso a paso.',
      '### 7. Formación, Comunicación y Participación',
      'Sistemas para capacitar e involucrar.',
      '### 8. Supervisión y Mejora Continua',
      'Evaluación, auditoría y actualización.'
    ]
  },
  {
    titulo: 'Análisis de Riesgos - Metodología',
    contenido: [
      'El análisis de riesgos es la base para medidas efectivas.',
      '### Paso 1: Identificar Actividades',
      '- Actividades regulares (clases, entrenamientos)',
      '- Actividades puntuales (campamentos, excursiones)',
      '- Servicios complementarios (transporte, comedor)',
      '### Paso 2: Evaluar Tipos de Riesgo',
      '- Físicos: Lesiones, maltrato físico',
      '- Psicológicos: Maltrato emocional, acoso',
      '- Digitales: Ciberacoso, grooming',
      '- Ambientales: Instalaciones, espacios',
      '- Externos: Personas ajenas, entorno',
      '### Paso 3: Matriz de Riesgos',
      'Probabilidad (Baja/Media/Alta) × Impacto (Leve/Moderado/Grave)',
      '- CRÍTICO: Alta probabilidad + Impacto grave',
      '- ALTO: Combinaciones altas o medias-graves',
      '- MEDIO: Combinaciones intermedias',
      '- BAJO: Baja probabilidad + Impacto leve',
      '### Paso 4: Definir Controles',
      '- Controles existentes',
      '- Brechas identificadas',
      '- Controles adicionales necesarios',
      '- Responsables y plazos'
    ]
  },
  {
    titulo: 'Medidas Preventivas',
    contenido: [
      'Las medidas preventivas evitan situaciones de riesgo.',
      '### Supervisión y Ratios Adecuados',
      '- Menores de 3 años: 1 adulto/4-6 menores',
      '- 3-6 años: 1 adulto/8-10 menores',
      '- 6-12 años: 1 adulto/10-15 menores',
      '- Mayores de 12 años: 1 adulto/15-20 menores',
      '### Diseño de Espacios Seguros',
      '- Visibilidad: Evitar zonas ocultas',
      '- Iluminación adecuada',
      '- Separación por edades',
      '- Señalización clara',
      '### Control de Acceso',
      '- Registro de entradas/salidas',
      '- Identificación de personal',
      '- Control de personas ajenas',
      '- Protocolos de recogida',
      '### Uso de Dispositivos',
      '- Normativa de móviles/tablets',
      '- Prohibición fotos sin autorización',
      '- Protección de datos personales',
      '- Consentimiento informado',
      '### Verificación de Antecedentes',
      '- Certificado negativo delitos sexuales',
      '- Referencias profesionales',
      '- Periodo de prueba supervisado'
    ]
  },
  {
    titulo: 'Protocolos de Emergencia',
    contenido: [
      'Respuesta rápida y efectiva ante situaciones graves.',
      '### Actuación Inmediata',
      '1. Evaluar situación y riesgo',
      '2. Garantizar seguridad del menor',
      '3. Separar al presunto agresor',
      '4. Avisar al Delegado (inmediato)',
      '5. Contactar emergencias si procede (112)',
      '6. Documentar todo',
      '### Comunicación Interna',
      '- Cadena de notificación clara',
      '- Contactos actualizados',
      '- Registro escrito',
      '- Información compartida solo con autorizados',
      '### Comunicación Externa',
      '- Notificación a familias',
      '- Coordinación Servicios Sociales',
      '- Colaboración Fuerzas de Seguridad',
      '- Comunicación institucional',
      '- Protección imagen del menor',
      '### Evacuación y Primeros Auxilios',
      '- Plan de evacuación',
      '- Simulacros periódicos',
      '- Botiquín y personal formado',
      '- Protocolo ante accidentes',
      '### Seguimiento Post-Incidente',
      '- Evaluación de impacto',
      '- Apoyo psicológico',
      '- Seguimiento indicaciones externas',
      '- Revisión del protocolo',
      '- Actualización de medidas'
    ]
  },
  {
    titulo: 'Plantillas Incluidas',
    contenido: [
      '### Plantilla 1: Análisis de Riesgos',
      'Tabla para documentar riesgos identificados con probabilidad, impacto, controles y responsables.',
      '### Plantilla 2: Registro de Incidencias',
      'Formulario para documentar fecha, personas implicadas, tipo, descripción, testigos, actuaciones y seguimiento.',
      '### Plantilla 3: Modelo de Notificación',
      'Formato para notificar sospechas con datos del notificante, menor, descripción y urgencia.',
      '### Plantilla 4: Protocolo de Emergencia',
      'Lista de verificación: seguridad garantizada, Delegado avisado, servicios contactados, documentación, notificación familiar, derivación.',
      '### Plantilla 5: Checklist de Auditoría',
      'Verificación periódica del Plan: actualización, delegado formado, código difundido, formación certificada, protocolos accesibles, registros completos, auditoría realizada.'
    ]
  },
  {
    titulo: 'Conclusión',
    contenido: [
      'El Plan de Protección debe ser un documento vivo, revisado periódicamente.',
      '### Características de un Plan Eficaz',
      '- Adaptado a la realidad de la entidad',
      '- Conocido por todo el personal',
      '- Revisado anualmente',
      '- Evaluado mediante auditorías',
      '- Integrado en la cultura organizacional',
      '### Errores a Evitar',
      '- Copiar plantillas genéricas',
      '- Crear el plan solo formalmente',
      '- No formar al personal',
      '- No revisar ni actualizar',
      '- No documentar acciones',
      '### Custodia360: Herramienta Automatizada',
      'Custodia360 ofrece la plataforma para crear y mantener el Plan actualizado, formar y certificar personal, gestionar protocolos de forma segura, generar auditorías automáticas y garantizar cumplimiento en tiempo real.',
      'Más información: www.custodia360.es | info@custodia360.es | Tel: 678 771 198'
    ]
  }
]

pageNum = 2
contenidoPlan.forEach(seccion => {
  pdfPlan.addPage()
  addContenidoPagina(pdfPlan, seccion.titulo, seccion.contenido, pageNum)
  pageNum++
})

const outputPath2 = path.join(outputDir, 'guia-plan-de-proteccion.pdf')
pdfPlan.save(outputPath2)
console.log(`✅ Guía Plan de Protección generada: ${outputPath2}`)

console.log('\n✅ Ambos PDFs generados exitosamente')
console.log(`📂 Ubicación: ${outputDir}`)
console.log('\n📌 Próximo paso: Subir a Supabase Storage')
