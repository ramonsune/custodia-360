/**
 * Guide PDF Generator
 * Generates downloadable PDF from guide content
 */

import { extractPlainText } from './markdown-renderer'

interface GuidePDFData {
  title: string
  role: string
  version: string
  updated_at: string
  sections: Array<{
    section_title: string
    content_md: string
  }>
}

/**
 * Generates and downloads a PDF of the guide content
 * Uses browser's native PDF generation (print API)
 */
export function generateGuidePDF(guideData: GuidePDFData) {
  // Create a temporary container for PDF content
  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: -9999px;
    width: 210mm;
    padding: 20mm;
    background: white;
    font-family: Arial, sans-serif;
    line-height: 1.6;
  `

  // Build PDF content
  let html = `
    <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px;">
      <h1 style="font-size: 24pt; margin: 0 0 10px 0; color: #1e40af;">${guideData.title}</h1>
      <p style="margin: 5px 0; color: #666;">Rol: ${guideData.role}</p>
      <p style="margin: 5px 0; color: #666;">Versión: ${guideData.version}</p>
      <p style="margin: 5px 0; color: #666;">Actualizado: ${new Date(guideData.updated_at).toLocaleDateString('es-ES')}</p>
    </div>
  `

  // Add sections
  guideData.sections.forEach((section, index) => {
    const plainText = extractPlainText(section.content_md)
    html += `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h2 style="font-size: 16pt; color: #1e40af; margin: 20px 0 10px 0; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
          ${section.section_title}
        </h2>
        <div style="font-size: 11pt; color: #333; white-space: pre-wrap;">
          ${plainText}
        </div>
      </div>
    `
  })

  // Add footer
  html += `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #333; text-align: center; color: #666; font-size: 9pt;">
      <p>© Custodia360 - Protección Integral Infantil LOPIVI</p>
      <p>Este documento es confidencial y de uso exclusivo para la entidad destinataria</p>
    </div>
  `

  container.innerHTML = html
  document.body.appendChild(container)

  // Trigger print dialog (user can save as PDF)
  window.print()

  // Alternative: Create blob and download
  // For better control, we'll create a downloadable HTML file
  setTimeout(() => {
    document.body.removeChild(container)

    // Create downloadable HTML version
    const blob = new Blob([`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${guideData.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px; }
          h1 { color: #1e40af; border-bottom: 2px solid #333; padding-bottom: 10px; }
          h2 { color: #1e40af; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 30px; }
          .header { text-align: center; margin-bottom: 40px; }
          .meta { color: #666; }
          .footer { margin-top: 60px; padding-top: 20px; border-top: 2px solid #333; text-align: center; color: #666; font-size: 10pt; }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `], { type: 'text/html' })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${guideData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 100)
}
