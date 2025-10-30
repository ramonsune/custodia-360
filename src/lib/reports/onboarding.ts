import { createClient } from '@supabase/supabase-js'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface OnboardingReportData {
  entity: {
    id: string
    nombre: string
    sector: string
    fecha_contratacion: string
  }
  fechaLimite: Date
  responses: {
    contacto: any[]
    sinContacto: any[]
    familias: any[]
  }
  resumen: {
    contacto: {
      total: number
      ok: number
      vencido: number
    }
    sin_contacto: {
      total: number
      ok: number
      vencido: number
    }
    familias: {
      total: number
      ok: number
      vencido: number
    }
    promedio_test: number
  }
  alerta_penales: boolean
}

/**
 * Obtiene los datos necesarios para generar el informe de onboarding
 */
export async function buildOnboardingReportData(entityId: string): Promise<OnboardingReportData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Obtener datos de la entidad
  const { data: entity, error: entityError } = await supabase
    .from('entities')
    .select('*')
    .eq('id', entityId)
    .single()

  if (entityError || !entity) {
    throw new Error('Entidad no encontrada')
  }

  // Calcular fecha límite (30 días desde contratación)
  const fechaContratacion = entity.fecha_contratacion ? new Date(entity.fecha_contratacion) : new Date()
  const fechaLimite = new Date(fechaContratacion)
  fechaLimite.setDate(fechaLimite.getDate() + 30)

  // Obtener respuestas de onboarding
  const { data: responses, error: responsesError } = await supabase
    .from('onboarding_responses')
    .select('*')
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false })

  if (responsesError) {
    throw new Error('Error obteniendo datos de onboarding')
  }

  const allResponses = responses || []

  // Clasificar respuestas
  const contacto = allResponses.filter(r => r.perfil === 'personal_contacto')
  const sinContacto = allResponses.filter(r => r.perfil === 'personal_sin_contacto')
  const familias = allResponses.filter(r => r.perfil === 'familia')

  // Calcular resumen
  const resumen = {
    contacto: {
      total: contacto.length,
      ok: contacto.filter(r => r.status === 'ok').length,
      vencido: contacto.filter(r => r.status === 'vencido').length
    },
    sin_contacto: {
      total: sinContacto.length,
      ok: sinContacto.filter(r => r.status === 'ok').length,
      vencido: sinContacto.filter(r => r.status === 'vencido').length
    },
    familias: {
      total: familias.length,
      ok: familias.filter(r => r.status === 'ok').length,
      vencido: familias.filter(r => r.status === 'vencido').length
    },
    promedio_test: contacto.length > 0
      ? contacto.filter(r => r.test_score != null).reduce((sum, r) => sum + (r.test_score || 0), 0) / contacto.filter(r => r.test_score != null).length
      : 0
  }

  // Detectar alerta de penales
  const vencidosSinPenales = contacto.filter(r => r.status === 'vencido' && !r.penales_entregado)
  const alerta_penales = vencidosSinPenales.length > 0

  return {
    entity: {
      id: entity.id,
      nombre: entity.nombre || 'Entidad',
      sector: entity.sector || 'No especificado',
      fecha_contratacion: fechaContratacion.toISOString()
    },
    fechaLimite,
    responses: {
      contacto,
      sinContacto,
      familias
    },
    resumen,
    alerta_penales
  }
}

/**
 * Genera el PDF del informe de onboarding a partir de los datos
 */
export async function renderOnboardingReportPDF(data: OnboardingReportData): Promise<Uint8Array> {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  const fechaContratacion = new Date(data.entity.fecha_contratacion)

  // Cabecera
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 35, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('INFORME DE ONBOARDING', pageWidth / 2, 15, { align: 'center' })

  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text(data.entity.nombre, pageWidth / 2, 25, { align: 'center' })

  let yPos = 45

  // Resumen General
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('RESUMEN GENERAL', 20, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Sector: ${data.entity.sector}`, 20, yPos)
  yPos += 6
  doc.text(`Fecha de contratación: ${fechaContratacion.toLocaleDateString('es-ES')}`, 20, yPos)
  yPos += 6
  doc.text(`Fecha límite (30 días): ${data.fechaLimite.toLocaleDateString('es-ES')}`, 20, yPos)
  yPos += 6
  doc.text(`Fecha de generación del informe: ${new Date().toLocaleDateString('es-ES')}`, 20, yPos)
  yPos += 6
  doc.text(`Periodo de cumplimiento inicial: 30 días desde la contratación`, 20, yPos)
  yPos += 12

  // Banner de alerta si hay penales no entregados
  if (data.alerta_penales) {
    doc.setFillColor(220, 38, 38)
    doc.rect(20, yPos, pageWidth - 40, 25, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('⚠️ ALERTA CRÍTICA', 25, yPos + 7)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const alertaTexto = doc.splitTextToSize(
      'Hay personal de contacto que NO ha marcado la entrega del certificado de penales dentro del plazo de 30 días. Hasta que lo haga, NO puede ejercer su función en la entidad conforme al artículo 57 de la LOPIVI.',
      pageWidth - 50
    )
    doc.text(alertaTexto, 25, yPos + 13)

    yPos += 32
    doc.setTextColor(0, 0, 0)
  }

  // Tabla de cumplimiento global
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('CUMPLIMIENTO GLOBAL', 20, yPos)
  yPos += 5

  doc.autoTable({
    startY: yPos,
    head: [['Perfil', 'Total', 'OK', 'Vencido', '% Cumplimiento']],
    body: [
      [
        'Personal de Contacto',
        data.resumen.contacto.total,
        data.resumen.contacto.ok,
        data.resumen.contacto.vencido,
        data.resumen.contacto.total > 0 ? `${Math.round((data.resumen.contacto.ok / data.resumen.contacto.total) * 100)}%` : 'N/A'
      ],
      [
        'Personal sin Contacto',
        data.resumen.sin_contacto.total,
        data.resumen.sin_contacto.ok,
        data.resumen.sin_contacto.vencido,
        data.resumen.sin_contacto.total > 0 ? `${Math.round((data.resumen.sin_contacto.ok / data.resumen.sin_contacto.total) * 100)}%` : 'N/A'
      ],
      [
        'Familias / Tutores',
        data.resumen.familias.total,
        data.resumen.familias.ok,
        data.resumen.familias.vencido,
        data.resumen.familias.total > 0 ? `${Math.round((data.resumen.familias.ok / data.resumen.familias.total) * 100)}%` : 'N/A'
      ]
    ],
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    margin: { left: 20, right: 20 }
  })

  yPos = (doc as any).lastAutoTable.finalY + 10

  // Promedio de test
  if (data.resumen.promedio_test > 0) {
    doc.setFontSize(10)
    doc.text(`Promedio de aciertos en test de personal de contacto: ${data.resumen.promedio_test.toFixed(1)} / 10`, 20, yPos)
    yPos += 10
  }

  // Nueva página para detalles
  doc.addPage()
  yPos = 20

  // PERSONAL DE CONTACTO
  if (data.responses.contacto.length > 0) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('PERSONAL DE CONTACTO', 20, yPos)
    yPos += 5

    doc.autoTable({
      startY: yPos,
      head: [['Nombre', 'Email', 'Test', 'Penales', 'Estado']],
      body: data.responses.contacto.map(r => [
        r.nombre,
        r.email || 'N/A',
        r.test_score != null ? `${r.test_score}/10 ${r.test_passed ? '✓' : '✗'}` : 'N/A',
        r.penales_entregado ? 'Sí' : 'No',
        r.status === 'ok' ? 'OK' : r.status === 'vencido' ? 'Vencido' : 'Pendiente'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 }
    })

    yPos = (doc as any).lastAutoTable.finalY + 10
  }

  // PERSONAL SIN CONTACTO
  if (data.responses.sinContacto.length > 0) {
    if (yPos > pageHeight - 80) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('PERSONAL SIN CONTACTO', 20, yPos)
    yPos += 5

    doc.autoTable({
      startY: yPos,
      head: [['Nombre', 'Email', 'Lectura confirmada', 'Estado']],
      body: data.responses.sinContacto.map(r => [
        r.nombre,
        r.email || 'N/A',
        r.lectura_confirmada ? 'Sí' : 'No',
        r.status === 'ok' ? 'OK' : r.status === 'vencido' ? 'Vencido' : 'Pendiente'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 }
    })

    yPos = (doc as any).lastAutoTable.finalY + 10
  }

  // FAMILIAS
  if (data.responses.familias.length > 0) {
    if (yPos > pageHeight - 80) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('FAMILIAS / TUTORES', 20, yPos)
    yPos += 5

    doc.autoTable({
      startY: yPos,
      head: [['Nombre Tutor', 'Nº Hijos', 'Lectura confirmada', 'Estado']],
      body: data.responses.familias.map(r => [
        r.nombre,
        r.hijos ? (Array.isArray(r.hijos) ? r.hijos.length : 0) : 0,
        r.lectura_confirmada ? 'Sí' : 'No',
        r.status === 'ok' ? 'OK' : r.status === 'vencido' ? 'Vencido' : 'Pendiente'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 }
    })
  }

  // Pie de página en todas las páginas
  const totalPages = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      '*Datos generados automáticamente por Custodia360 según la LOPIVI.',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // Generar PDF como Uint8Array
  const pdfBuffer = doc.output('arraybuffer')
  return new Uint8Array(pdfBuffer)
}
