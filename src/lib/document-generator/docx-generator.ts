import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Header, Footer, PageNumber, NumberFormat } from 'docx'

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
 * Genera un documento DOCX profesional con formato Custodia360
 */
export function generarDOCXProfesional(config: DocumentConfig): Document {
  const sections: any[] = []

  // SECCIÓN 1: Portada
  sections.push({
    properties: {
      page: {
        margin: {
          top: 1440, // 2cm = 1440 twentieths of a point
          right: 1440,
          bottom: 1440,
          left: 1440,
        },
      },
    },
    headers: {
      default: new Header({
        children: [],
      }),
    },
    footers: {
      default: new Footer({
        children: [],
      }),
    },
    children: [
      // Logo texto (simulado)
      new Paragraph({
        text: 'C',
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440, after: 400 },
        style: 'portadaLogo',
      }),

      // Nombre empresa
      new Paragraph({
        text: 'Custodia360',
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
        style: 'portadaEmpresa',
      }),

      // Título principal
      new Paragraph({
        text: config.titulo,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        style: 'portadaTitulo',
      }),

      // Subtítulo
      ...(config.subtitulo ? [new Paragraph({
        text: config.subtitulo,
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
        style: 'portadaSubtitulo',
      })] : []),

      // Versión
      new Paragraph({
        text: `Versión ${config.version}`,
        alignment: AlignmentType.CENTER,
        spacing: { before: 2000, after: 200 },
        style: 'portadaVersion',
      }),

      // Fecha
      new Paragraph({
        text: config.fecha,
        alignment: AlignmentType.CENTER,
        spacing: { after: 1440 },
        style: 'portadaFecha',
      }),

      // Disclaimer
      new Paragraph({
        text: 'Documento genérico de referencia — Custodia360',
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        style: 'portadaDisclaimer',
      }),

      new Paragraph({
        text: 'Sistema automatizado de cumplimiento LOPIVI',
        alignment: AlignmentType.CENTER,
        style: 'portadaDisclaimer',
      }),
    ],
  })

  // SECCIÓN 2: Contenido
  const contentChildren: Paragraph[] = []

  config.secciones.forEach((seccion, index) => {
    // Título de sección
    contentChildren.push(
      new Paragraph({
        text: seccion.titulo,
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: index === 0 ? 400 : 600,
          after: 300,
        },
        style: 'tituloSeccion',
      })
    )

    // Contenido de la sección
    seccion.contenido.forEach(parrafo => {
      if (!parrafo.trim()) {
        contentChildren.push(
          new Paragraph({
            text: '',
            spacing: { before: 120, after: 120 },
          })
        )
        return
      }

      if (parrafo.startsWith('- ')) {
        // Lista con bullets
        const texto = parrafo.replace('- ', '')
        contentChildren.push(
          new Paragraph({
            text: texto,
            bullet: {
              level: 0,
            },
            spacing: { before: 80, after: 80 },
            style: 'textoLista',
          })
        )
      } else {
        // Párrafo normal
        contentChildren.push(
          new Paragraph({
            text: parrafo,
            spacing: { before: 140, after: 140 },
            style: 'textoNormal',
          })
        )
      }
    })
  })

  sections.push({
    properties: {
      page: {
        margin: {
          top: 1440,
          right: 1440,
          bottom: 1440,
          left: 1440,
        },
      },
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Custodia360',
                bold: true,
                size: 20,
                color: '2563EB',
              }),
              new TextRun({
                text: ` — ${config.titulo.length > 40 ? config.titulo.substring(0, 40) + '...' : config.titulo}`,
                size: 18,
                color: '6B7280',
              }),
            ],
            border: {
              bottom: {
                color: '2563EB',
                space: 1,
                style: 'single',
                size: 6,
              },
            },
            spacing: { after: 200 },
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Custodia360 — Documento genérico',
                size: 16,
                color: '6B7280',
                italics: true,
              }),
              new TextRun({
                text: '      Página ',
                size: 16,
                color: '6B7280',
              }),
            ],
            alignment: AlignmentType.CENTER,
            border: {
              top: {
                color: 'E5E7EB',
                space: 1,
                style: 'single',
                size: 6,
              },
            },
            spacing: { before: 200 },
          }),
        ],
      }),
    },
    children: contentChildren,
  })

  // Crear documento con estilos
  return new Document({
    sections,
    styles: {
      default: {
        document: {
          run: {
            font: 'Inter',
            size: 22, // 11pt = 22 half-points
          },
          paragraph: {
            spacing: {
              line: 360, // 1.25 interlineado = 360 twentieths of a line
              lineRule: 'auto',
            },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'portadaLogo',
          name: 'Portada Logo',
          run: {
            font: 'Helvetica',
            size: 72,
            bold: true,
            color: '2563EB',
          },
        },
        {
          id: 'portadaEmpresa',
          name: 'Portada Empresa',
          run: {
            font: 'Inter',
            size: 52,
            bold: true,
            color: '2563EB',
          },
        },
        {
          id: 'portadaTitulo',
          name: 'Portada Titulo',
          run: {
            font: 'Inter',
            size: 44,
            bold: true,
            color: '1F2937',
          },
        },
        {
          id: 'portadaSubtitulo',
          name: 'Portada Subtitulo',
          run: {
            font: 'Inter',
            size: 28,
            color: '4B5563',
          },
        },
        {
          id: 'portadaVersion',
          name: 'Portada Version',
          run: {
            font: 'Inter',
            size: 24,
            bold: true,
            color: '1F2937',
          },
        },
        {
          id: 'portadaFecha',
          name: 'Portada Fecha',
          run: {
            font: 'Inter',
            size: 22,
            color: '6B7280',
          },
        },
        {
          id: 'portadaDisclaimer',
          name: 'Portada Disclaimer',
          run: {
            font: 'Inter',
            size: 18,
            italics: true,
            color: '9CA3AF',
          },
        },
        {
          id: 'tituloSeccion',
          name: 'Titulo Seccion',
          run: {
            font: 'Inter',
            size: 28,
            bold: true,
            color: '2563EB',
          },
          paragraph: {
            spacing: {
              before: 400,
              after: 200,
            },
          },
        },
        {
          id: 'textoNormal',
          name: 'Texto Normal',
          run: {
            font: 'Inter',
            size: 22,
            color: '1F2937',
          },
          paragraph: {
            spacing: {
              before: 140,
              after: 140,
              line: 360,
            },
          },
        },
        {
          id: 'textoLista',
          name: 'Texto Lista',
          run: {
            font: 'Inter',
            size: 22,
            color: '1F2937',
          },
          paragraph: {
            spacing: {
              before: 80,
              after: 80,
              line: 360,
            },
          },
        },
      ],
    },
  })
}
