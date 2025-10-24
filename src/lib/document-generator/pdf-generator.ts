import jsPDF from 'jspdf'

export interface DocumentSection {
  titulo: string
  contenido: string[]
}

export interface DocumentConfig {
  titulo: string
  subtitulo: string
  version: string
  fecha: string
  secciones: DocumentSection[]
}

/**
 * Crea una portada profesional para documentos Custodia360
 */
export function crearPortadaProfesional(doc: jsPDF, config: DocumentConfig) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Fondo azul Custodia360
  doc.setFillColor(37, 99, 235) // blue-600
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Logo simulado (círculo con C)
  doc.setFillColor(255, 255, 255)
  doc.circle(pageWidth / 2, 70, 22, 'F')
  doc.setTextColor(37, 99, 235)
  doc.setFontSize(36)
  doc.setFont('helvetica', 'bold')
  doc.text('C', pageWidth / 2, 78, { align: 'center' })

  // Nombre de la empresa
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(26)
  doc.text('Custodia360', pageWidth / 2, 115, { align: 'center' })

  // Título principal del documento
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  const tituloLineas = doc.splitTextToSize(config.titulo, pageWidth - 40)
  let yPos = 145
  tituloLineas.forEach((linea: string) => {
    doc.text(linea, pageWidth / 2, yPos, { align: 'center' })
    yPos += 12
  })

  // Subtítulo
  if (config.subtitulo) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    const subtituloLineas = doc.splitTextToSize(config.subtitulo, pageWidth - 50)
    yPos += 8
    subtituloLineas.forEach((linea: string) => {
      doc.text(linea, pageWidth / 2, yPos, { align: 'center' })
      yPos += 7
    })
  }

  // Versión y fecha
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Versión ${config.version}`, pageWidth / 2, pageHeight - 70, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.text(config.fecha, pageWidth / 2, pageHeight - 55, { align: 'center' })

  // Disclaimer footer
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  const disclaimer = 'Documento genérico de referencia — Custodia360'
  doc.text(disclaimer, pageWidth / 2, pageHeight - 30, { align: 'center' })

  const disclaimer2 = 'Sistema automatizado de cumplimiento LOPIVI'
  doc.text(disclaimer2, pageWidth / 2, pageHeight - 22, { align: 'center' })
}

/**
 * Agrega encabezado profesional en cada página
 */
export function agregarEncabezado(doc: jsPDF, titulo: string) {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Barra azul superior
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 18, 'F')

  // Logo pequeño izquierda
  doc.setFillColor(255, 255, 255)
  doc.circle(15, 9, 6, 'F')
  doc.setTextColor(37, 99, 235)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('C', 15, 11.5, { align: 'center' })

  // Texto header
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Custodia360', 25, 12)

  // Título documento derecha
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const tituloCorto = titulo.length > 40 ? titulo.substring(0, 40) + '...' : titulo
  doc.text(tituloCorto, pageWidth - 20, 12, { align: 'right' })
}

/**
 * Agrega pie de página profesional
 */
export function agregarPieDePagina(doc: jsPDF, pageNum: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Línea decorativa superior
  doc.setDrawColor(229, 231, 235) // gray-200
  doc.setLineWidth(0.5)
  doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20)

  // Texto pie de página
  doc.setTextColor(107, 114, 128) // gray-500
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.text(
    'Custodia360 — Documento genérico',
    20,
    pageHeight - 12
  )

  // Número de página
  doc.setFont('helvetica', 'normal')
  doc.text(
    `Página ${pageNum} de ${totalPages}`,
    pageWidth - 20,
    pageHeight - 12,
    { align: 'right' }
  )
}

/**
 * Agrega contenido con formato profesional
 */
export function agregarContenido(doc: jsPDF, secciones: DocumentSection[]) {
  const margin = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const maxWidth = pageWidth - 2 * margin
  let yPos = 35

  const checkPageBreak = (requiredSpace = 20) => {
    if (yPos > pageHeight - 35) {
      doc.addPage()
      yPos = 35
      return true
    }
    return false
  }

  secciones.forEach((seccion, index) => {
    checkPageBreak(25)

    // Título de sección
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(37, 99, 235) // blue-600
    const tituloLineas = doc.splitTextToSize(seccion.titulo, maxWidth)
    tituloLineas.forEach((linea: string) => {
      if (checkPageBreak()) yPos = 35
      doc.text(linea, margin, yPos)
      yPos += 7
    })

    // Línea decorativa bajo el título
    doc.setDrawColor(37, 99, 235)
    doc.setLineWidth(0.5)
    doc.line(margin, yPos + 1, margin + 30, yPos + 1)
    yPos += 8

    // Contenido de la sección
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(31, 41, 55) // gray-800

    seccion.contenido.forEach(parrafo => {
      if (!parrafo.trim()) {
        yPos += 4
        return
      }

      if (checkPageBreak()) yPos = 35

      if (parrafo.startsWith('- ')) {
        // Lista con bullets
        const texto = parrafo.replace('- ', '')
        const lineas = doc.splitTextToSize(`• ${texto}`, maxWidth - 5)
        lineas.forEach((linea: string) => {
          if (checkPageBreak()) yPos = 35
          doc.text(linea, margin + 3, yPos)
          yPos += 5.5
        })
      } else {
        // Párrafo normal
        const lineas = doc.splitTextToSize(parrafo, maxWidth)
        lineas.forEach((linea: string) => {
          if (checkPageBreak()) yPos = 35
          doc.text(linea, margin, yPos)
          yPos += 5.5
        })
        yPos += 2
      }
    })

    // Espacio entre secciones
    if (index < secciones.length - 1) {
      yPos += 6
    }
  })
}

/**
 * Genera un PDF completo con todas las características profesionales
 */
export function generarPDFProfesional(config: DocumentConfig): ArrayBuffer {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // 1. Crear portada
  crearPortadaProfesional(doc, config)

  // 2. Agregar página de contenido
  doc.addPage()

  // 3. Agregar secciones
  agregarContenido(doc, config.secciones)

  // 4. Agregar headers y footers a todas las páginas (excepto portada)
  const totalPages = doc.getNumberOfPages()
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i)
    agregarEncabezado(doc, config.titulo)
    agregarPieDePagina(doc, i - 1, totalPages - 1)
  }

  return doc.output('arraybuffer')
}
