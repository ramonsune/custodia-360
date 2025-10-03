'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { jsPDF } from 'jspdf'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente' | 'contratante'
  entidad: string
  permisos: string[]
  certificacionVigente: boolean
  inicioSesion: string
  expiracion: string
}

interface EntidadData {
  nombre: string
  plan: string
  cumplimiento: number
  alertas: number
  delegadoPrincipal: {
    nombre: string
    email: string
    telefono: string
    certificado: boolean
    ultimaActividad: string
  }
  delegadoSuplente?: {
    nombre: string
    email: string
    telefono: string
    certificado: boolean
  }
  estadoImplementacion: {
    configuracion: boolean
    delegadoAsignado: boolean
    formacionProgreso: number
    validacionFinal: boolean
  }
  proximasAcciones: string[]
}

export default function DashboardEntidad() {
  const router = useRouter()
  const [entidadData, setEntidadData] = useState<EntidadData | null>(null)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showDelegadoModal, setShowDelegadoModal] = useState(false)
  const [selectedDelegado, setSelectedDelegado] = useState<{
    nombre: string
    email: string
    telefono: string
    certificado: boolean
    tipo: string
  } | null>(null)

  const checkSession = (): SessionData | null => {
    try {
      const persistentSession = localStorage.getItem('userSession')
      if (persistentSession) {
        const session = JSON.parse(persistentSession)
        if (new Date(session.expiracion) > new Date()) {
          return session
        }
      }
      const tempSession = sessionStorage.getItem('userSession')
      if (tempSession) {
        const session = JSON.parse(tempSession)
        if (new Date(session.expiracion) > new Date()) {
          return session
        }
      }
      return null
    } catch (error) {
      console.error('Error verificando sesión:', error)
      return null
    }
  }

  useEffect(() => {
    // SIMPLIFICADO: Para demo, permitir acceso directo
    console.log('🏢 Cargando panel entidad...')

    // Crear sesión demo si no existe
    const demoSession: SessionData = {
      id: 'cont_001',
      nombre: 'Director General',
      email: 'director@custodia360.com',
      tipo: 'contratante',
      entidad: 'Club Deportivo Ejemplo',
      permisos: ['ver_cumplimiento', 'gestionar_entidad', 'ver_informes'],
      certificacionVigente: true,
      inicioSesion: new Date().toISOString(),
      expiracion: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    }

    setSessionData(demoSession)

    // Datos simulados más detallados basados en la sesión
    const entidadInfo: EntidadData = {
      nombre: demoSession.entidad,
      plan: 'Plan 500',
      cumplimiento: 87.5,
      alertas: 2,
      delegadoPrincipal: {
        nombre: 'Juan García Rodríguez',
        email: 'juan@custodia360.com',
        telefono: '+34 612 345 678',
        certificado: true,
        ultimaActividad: '2024-01-20 16:45:00'
      },
      delegadoSuplente: {
        nombre: 'María López Martín',
        email: 'maria@custodia360.com',
        telefono: '+34 687 654 321',
        certificado: true
      },
      estadoImplementacion: {
        configuracion: true,
        delegadoAsignado: true,
        formacionProgreso: 87,
        validacionFinal: true
      },
      proximasAcciones: [
        'Renovar certificación de María López (caduca en 15 días)',
        'Actualizar documentos de 4 familias',
        'Revisar protocolo de actuación trimestral'
      ]
    }

    setEntidadData(entidadInfo)
    console.log('✅ Panel entidad cargado correctamente')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userSession')
    sessionStorage.removeItem('userSession')
    localStorage.removeItem('userAuth')
    router.push('/')
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-600'
    if (progress >= 60) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleContactarDelegado = (delegado: { nombre: string; email: string; telefono: string; certificado: boolean }, tipo: string) => {
    setSelectedDelegado({...delegado, tipo})
    setShowDelegadoModal(true)
  }

  const generarInformeEjecutivo = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Función para añadir encabezado
    const addHeader = () => {
      doc.setFontSize(20)
      doc.setTextColor(37, 99, 235) // Azul Custodia360
      doc.text('INFORME EJECUTIVO DETALLADO LOPIVI', pageWidth / 2, 25, { align: 'center' })

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(entidadData?.nombre || 'Entidad', pageWidth / 2, 35, { align: 'center' })

      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')} - ${new Date().toLocaleTimeString('es-ES')}`, pageWidth / 2, 42, { align: 'center' })

      // Línea separadora
      doc.setDrawColor(200, 200, 200)
      doc.line(20, 50, pageWidth - 20, 50)
    }

    const checkPageBreak = (currentY: number, neededSpace = 30) => {
      if (currentY + neededSpace > pageHeight - 30) {
        doc.addPage()
        addHeader()
        return 60
      }
      return currentY
    }

    addHeader()
    let yPosition = 60

    // RESUMEN EJECUTIVO AMPLIADO
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('1. RESUMEN EJECUTIVO', 20, yPosition)
    yPosition += 12

    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    const resumenDetallado = [
      `ESTADO GENERAL:`,
      `• Estado de Cumplimiento LOPIVI: ${entidadData?.cumplimiento || 98}% - EXCELENTE`,
      `• Plan de Protección: IMPLEMENTADO Y VIGENTE`,
      `• Sistema de Gestión: OPERATIVO 24/7 con monitorización continua`,
      `• Alertas Activas: ${entidadData?.alertas || 0} casos bajo seguimiento`,
      `• Última auditoría: ${new Date(Date.now() - 30*24*60*60*1000).toLocaleDateString('es-ES')}`,
      ``,
      `RESPONSABLES:`,
      `• Delegado Principal: ${entidadData?.delegadoPrincipal.nombre} (CERTIFICADO)`,
      `• Delegado Suplente: ${entidadData?.delegadoSuplente?.nombre || 'Ana Martínez García'} (CERTIFICADO)`,
      `• Email contacto: ${entidadData?.delegadoPrincipal.email || 'delegado@entidad.com'}`,
      `• Teléfono emergencias: ${entidadData?.delegadoPrincipal.telefono || '+34 123 456 789'}`
    ]

    resumenDetallado.forEach(item => {
      yPosition = checkPageBreak(yPosition)
      doc.text(item, item.startsWith('•') ? 25 : 20, yPosition)
      yPosition += 6
    })

    yPosition += 8

    // PERSONAL Y FORMACIÓN DETALLADA
    yPosition = checkPageBreak(yPosition, 40)
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('2. PERSONAL Y FORMACIÓN', 20, yPosition)
    yPosition += 12

    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    const personalFormacion = [
      `PERSONAL FORMADO EN LOPIVI:`,
      `• Total empleados: 23 personas`,
      `• Personal formado: 21 personas (91.3%)`,
      `• Pendientes de formación: 2 personas`,
      `• Próxima sesión formativa: ${new Date(Date.now() + 15*24*60*60*1000).toLocaleDateString('es-ES')}`,
      ``,
      `DETALLE POR CATEGORÍAS:`,
      `• Entrenadores principales: 8/8 formados (100%)`,
      `• Monitores de apoyo: 7/8 formados (87.5%)`,
      `• Personal administrativo: 4/4 formados (100%)`,
      `• Personal de limpieza: 2/3 formados (66.7%)`,
      ``,
      `CERTIFICACIONES VIGENTES:`,
      `• Delegado Principal: Vigente hasta ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('es-ES')}`,
      `• Delegado Suplente: Vigente hasta ${new Date(Date.now() + 330*24*60*60*1000).toLocaleDateString('es-ES')}`,
      `• Personal técnico: 95% con certificación vigente`
    ]

    personalFormacion.forEach(item => {
      yPosition = checkPageBreak(yPosition)
      doc.text(item, item.startsWith('•') ? 25 : 20, yPosition)
      yPosition += 6
    })

    yPosition += 8

    // CERTIFICADOS DE DELINCUENTES SEXUALES
    yPosition = checkPageBreak(yPosition, 40)
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('3. CERTIFICADOS NEGATIVOS REGISTRO DELINCUENTES', 20, yPosition)
    yPosition += 12

    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    const certificadosPenales = [
      `ESTADO DE CERTIFICACIONES:`,
      `• Personal con certificado vigente: 21/23 (91.3%)`,
      `• Certificados pendientes de renovación: 2 personas`,
      `• Última verificación: ${new Date(Date.now() - 7*24*60*60*1000).toLocaleDateString('es-ES')}`,
      ``,
      `DETALLE POR PERSONA:`,
      `• ${entidadData?.delegadoPrincipal.nombre}: Vigente hasta ${new Date(Date.now() + 60*24*60*60*1000).toLocaleDateString('es-ES')}`,
      `• Ana Martínez García: Vigente hasta ${new Date(Date.now() + 45*24*60*60*1000).toLocaleDateString('es-ES')}`,
      `• Carlos López Ruiz: Vigente hasta ${new Date(Date.now() + 90*24*60*60*1000).toLocaleDateString('es-ES')}`,
      `• María González Pérez: Vigente hasta ${new Date(Date.now() + 120*24*60*60*1000).toLocaleDateString('es-ES')}`,
      ``,
      `PRÓXIMAS RENOVACIONES:`,
      `• ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('es-ES')}: 1 persona`,
      `• ${new Date(Date.now() + 60*24*60*60*1000).toLocaleDateString('es-ES')}: 2 personas`,
      `• Sistema de avisos automáticos: ACTIVO`
    ]

    certificadosPenales.forEach(item => {
      yPosition = checkPageBreak(yPosition)
      doc.text(item, item.startsWith('•') ? 25 : 20, yPosition)
      yPosition += 6
    })

    yPosition += 8

    // PROTOCOLOS ACTIVOS DETALLADOS
    yPosition = checkPageBreak(yPosition, 40)
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('4. PROTOCOLOS ACTIVOS Y PROCEDIMIENTOS', 20, yPosition)
    yPosition += 12

    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    const protocolosActivos = [
      `PROTOCOLOS IMPLEMENTADOS:`,
      `✓ Protocolo de Detección de Violencia: ACTIVO`,
      `✓ Protocolo de Comunicación de Casos: OPERATIVO`,
      `✓ Protocolo de Actuación ante Emergencias: IMPLEMENTADO`,
      `✓ Protocolo de Comunicación con Familias: VIGENTE`,
      `✓ Protocolo de Confidencialidad: ESTABLECIDO`,
      ``,
      `CANAL DE DENUNCIAS:`,
      `• Email: denuncias@${entidadData?.nombre?.toLowerCase().replace(/\s+/g, '') || 'entidad'}.com`,
      `• Teléfono 24h: +34 900 123 456`,
      `• Buzón físico: Instalado en recepción`,
      `• App móvil: Canal seguro disponible`,
      ``,
      `REGISTRO DE CASOS:`,
      `• Casos registrados último mes: 0`,
      `• Casos resueltos satisfactoriamente: 100%`,
      `• Tiempo medio de respuesta: < 2 horas`,
      `• Sistema de backup: Automático diario`
    ]

    protocolosActivos.forEach(item => {
      yPosition = checkPageBreak(yPosition)
      doc.text(item, item.startsWith('•') || item.startsWith('✓') ? 25 : 20, yPosition)
      yPosition += 6
    })

    yPosition += 8

    // MEDIDAS DE SEGURIDAD Y ESPACIOS
    yPosition = checkPageBreak(yPosition, 35)
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('5. MEDIDAS DE SEGURIDAD Y ESPACIOS', 20, yPosition)
    yPosition += 12

    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    const seguridadEspacios = [
      `CONTROL DE ACCESOS:`,
      `• Sistema de identificación: Tarjetas personalizadas`,
      `• Control de visitantes: Registro obligatorio`,
      `• Zonas restringidas: Señalizadas y controladas`,
      `• Cámaras de seguridad: 12 puntos de monitorización`,
      ``,
      `ESPACIOS VERIFICADOS:`,
      `• Vestuarios: Separados por edades y género`,
      `• Salas de actividades: Visibilidad garantizada`,
      `• Oficinas: Puertas con cristal trasparente`,
      `• Almacenes: Acceso restringido a personal autorizado`,
      ``,
      `MEDIDAS ESPECIALES COVID-19:`,
      `• Protocolos de higiene: Actualizados`,
      `• Ventilación: Sistemas renovados`,
      `• Aforo controlado: Según normativa vigente`
    ]

    seguridadEspacios.forEach(item => {
      yPosition = checkPageBreak(yPosition)
      doc.text(item, item.startsWith('•') ? 25 : 20, yPosition)
      yPosition += 6
    })

    yPosition += 8

    // CUMPLIMIENTO NORMATIVO DETALLADO
    yPosition = checkPageBreak(yPosition, 35)
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('6. CUMPLIMIENTO NORMATIVO DETALLADO', 20, yPosition)
    yPosition += 12

    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    const cumplimientoDetallado = [
      `NORMATIVA LOPIVI (Ley Orgánica 8/2021):`,
      `✓ Art. 35: Delegado de Protección designado y formado`,
      `✓ Art. 46: Plan de Protección vigente y actualizado`,
      `✓ Art. 47: Código de Conducta implementado`,
      `✓ Art. 48: Formación del personal completada`,
      `✓ Art. 49: Canal de comunicación operativo`,
      ``,
      `NORMATIVA COMPLEMENTARIA:`,
      `✓ RGPD: Protección de datos de menores garantizada`,
      `✓ Ley 39/2006: Autonomía personal respetada`,
      `✓ Normativa autonómica: Cumplimiento verificado`,
      `✓ Normativa municipal: Licencias al día`,
      ``,
      `AUDITORÍAS Y VERIFICACIONES:`,
      `• Última inspección oficial: SUPERADA`,
      `• Auditoría interna Custodia360: Mensual`,
      `• Próxima verificación: ${new Date(Date.now() + 90*24*60*60*1000).toLocaleDateString('es-ES')}`
    ]

    cumplimientoDetallado.forEach(item => {
      yPosition = checkPageBreak(yPosition)
      doc.text(item, item.startsWith('•') || item.startsWith('✓') ? 25 : 20, yPosition)
      yPosition += 6
    })

    yPosition += 8

    // CONCLUSIONES Y RECOMENDACIONES AMPLIADAS
    yPosition = checkPageBreak(yPosition, 40)
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('7. CONCLUSIONES Y RECOMENDACIONES', 20, yPosition)
    yPosition += 12

    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    const conclusionesDetalladas = [
      `VALORACIÓN GENERAL:`,
      `La entidad ${entidadData?.nombre} presenta un EXCELENTE nivel`,
      `de cumplimiento de la LOPIVI (${entidadData?.cumplimiento || 98}%), superando`,
      `los estándares mínimos requeridos por la normativa.`,
      ``,
      `FORTALEZAS IDENTIFICADAS:`,
      `• Sistema de protección robusto y operativo`,
      `• Personal altamente formado y comprometido`,
      `• Protocolos claros y bien implementados`,
      `• Canal de comunicación eficaz y accesible`,
      `• Seguimiento continuo y mejora constante`,
      ``,
      `ÁREAS DE MEJORA:`,
      `• Completar formación de 2 empleados pendientes`,
      `• Renovar 2 certificados próximos a vencer`,
      `• Actualizar protocolo de emergencias médicas`,
      ``,
      `RECOMENDACIONES INMEDIATAS:`,
      `• Programar formación pendiente antes del ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('es-ES')}`,
      `• Solicitar renovación de certificados vencidos`,
      `• Realizar simulacro de emergencia trimestral`,
      `• Mantener canal de comunicación 24/7 operativo`,
      ``,
      `CERTIFICACIÓN CUSTODIA360:`,
      `Sistema verificado y conforme con LOPIVI.`,
      `Protección efectiva de menores GARANTIZADA.`
    ]

    conclusionesDetalladas.forEach(item => {
      yPosition = checkPageBreak(yPosition)
      doc.text(item, item.startsWith('•') ? 25 : 20, yPosition)
      yPosition += 6
    })

    // Pie de página profesional
    const currentPage = doc.internal.pages.length
    for (let i = 1; i <= currentPage; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('Documento generado por Sistema Custodia360 - Cumplimiento LOPIVI Automatizado', pageWidth / 2, pageHeight - 15, { align: 'center' })
      doc.text(`Página ${i} de ${currentPage} | Confidencial - Solo para uso autorizado`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    }

    // Descargar PDF
    doc.save(`Informe-Ejecutivo-Detallado-LOPIVI-${entidadData?.nombre?.replace(/\s+/g, '-') || 'Entidad'}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Configuración mejorada y estandarizada para PDFs
  const PDF_CONFIG = {
    margins: {
      top: 30,
      bottom: 30,
      left: 25,
      right: 25
    },
    fonts: {
      title: 24,
      subtitle: 20,
      heading: 16,
      body: 11,
      small: 10,
      footer: 8
    },
    colors: {
      primary: [0, 0, 0],
      secondary: [75, 85, 99], // text-gray-600
      accent: [59, 130, 246], // blue-500
      light: [156, 163, 175], // gray-400
      custodia: [37, 99, 235] // Custodia360 brand blue
    },
    lineHeight: 6,
    sectionSpacing: 12,
    pageBreakMargin: 50,
    watermark: {
      fontSize: 45,
      opacity: 0.05,
      rotation: -45
    }
  }

  // Plantilla profesional mejorada para encabezados de PDF
  const addPDFHeader = (doc: any, title: string, subtitle?: string) => {
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPosition = PDF_CONFIG.margins.top

    // Banda superior Custodia360 con logo
    doc.setFillColor(...PDF_CONFIG.colors.custodia)
    doc.rect(0, 0, pageWidth, 25, 'F')

    // Logo circular blanco con "C"
    doc.setFillColor(255, 255, 255)
    doc.circle(pageWidth - 30, 12.5, 8, 'F')
    doc.setFontSize(16)
    doc.setTextColor(...PDF_CONFIG.colors.custodia)
    doc.text('C', pageWidth - 30, 16.5, { align: 'center' })

    // Texto Custodia360 en blanco
    doc.setFontSize(18)
    doc.setTextColor(255, 255, 255)
    doc.text('CUSTODIA360', PDF_CONFIG.margins.left, 16)

    yPosition = 35

    // Título principal del documento
    doc.setFontSize(PDF_CONFIG.fonts.title)
    doc.setTextColor(...PDF_CONFIG.colors.primary)
    doc.text(title, pageWidth / 2, yPosition, { align: 'center' })

    // Subtítulo si existe
    if (subtitle) {
      yPosition += 12
      doc.setFontSize(PDF_CONFIG.fonts.body)
      doc.setTextColor(...PDF_CONFIG.colors.secondary)
      doc.text(subtitle, pageWidth / 2, yPosition, { align: 'center' })
    }

    // Línea separadora elegante
    yPosition += 15
    doc.setDrawColor(...PDF_CONFIG.colors.light)
    doc.setLineWidth(0.5)
    doc.line(PDF_CONFIG.margins.left, yPosition, pageWidth - PDF_CONFIG.margins.right, yPosition)

    // Información de generación
    yPosition += 8
    doc.setFontSize(PDF_CONFIG.fonts.small)
    doc.setTextColor(...PDF_CONFIG.colors.secondary)
    const fechaGeneracion = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    doc.text(`Documento generado el ${fechaGeneracion}`, pageWidth / 2, yPosition, { align: 'center' })

    return yPosition + 15
  }

  // Plantilla profesional mejorada para pie de página
  const addPDFFooter = (doc: any, customText?: string) => {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Banda inferior Custodia360
    doc.setFillColor(...PDF_CONFIG.colors.custodia)
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F')

    // Texto del pie en blanco
    doc.setFontSize(PDF_CONFIG.fonts.footer)
    doc.setTextColor(255, 255, 255)
    const footerText = customText || 'Custodia360 - Sistema Automatizado LOPIVI'
    doc.text(footerText, PDF_CONFIG.margins.left, pageHeight - 8)

    // Información de página y fecha
    const pageNum = doc.internal.getCurrentPageInfo().pageNumber
    const totalPages = doc.internal.getNumberOfPages ? doc.internal.getNumberOfPages() : pageNum
    doc.text(`${pageNum}/${totalPages}`, pageWidth - PDF_CONFIG.margins.right, pageHeight - 8, { align: 'right' })

    // URL corporativa
    doc.setFontSize(PDF_CONFIG.fonts.footer - 1)
    doc.text('custodia360.com', pageWidth / 2, pageHeight - 8, { align: 'center' })
  }

  // Función mejorada para crear secciones profesionales
  const addPDFSection = (doc: any, yPos: number, title: string, content: string[] | { label: string, value: string }[], isChecklist = false) => {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = yPos

    // Control inteligente de salto de página
    const checkPageBreak = (requiredSpace = PDF_CONFIG.pageBreakMargin) => {
      if (yPosition > pageHeight - PDF_CONFIG.margins.bottom - requiredSpace) {
        doc.addPage()
        addPDFFooter(doc)
        yPosition = PDF_CONFIG.margins.top + 20 // Espacio después del header en nueva página
      }
    }

    checkPageBreak(60)

    // Título de sección con fondo sutil
    doc.setFillColor(248, 250, 252) // bg-slate-50
    doc.rect(PDF_CONFIG.margins.left - 5, yPosition - 8, pageWidth - PDF_CONFIG.margins.left - PDF_CONFIG.margins.right + 10, 16, 'F')

    doc.setFontSize(PDF_CONFIG.fonts.heading)
    doc.setTextColor(...PDF_CONFIG.colors.primary)
    doc.text(title, PDF_CONFIG.margins.left, yPosition)
    yPosition += 15

    // Contenido con espaciado mejorado
    doc.setFontSize(PDF_CONFIG.fonts.body)
    doc.setTextColor(...PDF_CONFIG.colors.primary)

    if (Array.isArray(content)) {
      content.forEach((item, index) => {
        checkPageBreak(20)

        if (typeof item === 'string') {
          const prefix = isChecklist ? '✓ ' : '• '
          const prefixColor = isChecklist ? PDF_CONFIG.colors.accent : PDF_CONFIG.colors.secondary
          const maxWidth = pageWidth - PDF_CONFIG.margins.left - PDF_CONFIG.margins.right - 15

          // Dividir texto en líneas
          const lines = doc.splitTextToSize(`${item}`, maxWidth)

          lines.forEach((line: string, lineIndex: number) => {
            if (lineIndex === 0) {
              // Dibujar prefix con color
              doc.setTextColor(...prefixColor)
              doc.text(prefix, PDF_CONFIG.margins.left + 5, yPosition)

              // Contenido con color normal
              doc.setTextColor(...PDF_CONFIG.colors.primary)
              doc.text(line, PDF_CONFIG.margins.left + 15, yPosition)
            } else {
              // Líneas continuación con indentación
              doc.text(line, PDF_CONFIG.margins.left + 15, yPosition)
            }
            yPosition += PDF_CONFIG.lineHeight
          })
        } else {
          // Formato label: value con estilos diferenciados
          doc.setTextColor(...PDF_CONFIG.colors.secondary)
          doc.text(`${item.label}:`, PDF_CONFIG.margins.left + 5, yPosition)

          doc.setTextColor(...PDF_CONFIG.colors.primary)
          const labelWidth = doc.getTextWidth(`${item.label}: `)
          doc.text(item.value, PDF_CONFIG.margins.left + 5 + labelWidth, yPosition)

          yPosition += PDF_CONFIG.lineHeight + 1
        }
      })
    }

    return yPosition + PDF_CONFIG.sectionSpacing
  }

  // Función completa de optimización y configuración PDF
  const optimizePDF = (doc: any, documentType: string) => {
    // Configurar propiedades del documento con compresión
    doc.setProperties({
      title: `${documentType} - ${entidadData?.nombre}`,
      subject: 'Sistema LOPIVI Automatizado',
      author: 'Custodia360',
      creator: 'Custodia360 - Sistema Automatizado LOPIVI',
      keywords: 'LOPIVI, Protección Infantil, Custodia360, Cumplimiento',
      producer: 'Custodia360 PDF Engine v2.0',
      compress: true
    })

    // Configurar opciones de compresión avanzada
    doc.internal.events.subscribe('addPage', () => {
      addProfessionalWatermark(doc)
    })

    // Reducir calidad de imágenes para menor tamaño
    doc.setDocumentProperties({
      pdfVersion: '1.4',
      compress: true
    })
  }

  // Marca de agua profesional mejorada
  const addProfessionalWatermark = (doc: any) => {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Guardar estado actual
    const currentTextColor = doc.internal.getCurrentPageInfo().textColor
    const currentFontSize = doc.internal.getFontSize()

    // Marca de agua central sutil
    doc.setTextColor(248, 250, 252) // Muy sutil
    doc.setFontSize(PDF_CONFIG.watermark.fontSize)

    // Rotar y posicionar la marca de agua
    const angle = PDF_CONFIG.watermark.rotation * Math.PI / 180
    doc.text('CUSTODIA360', pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: angle
    })

    // Marca de agua secundaria en esquinas
    doc.setTextColor(252, 252, 252) // Aún más sutil
    doc.setFontSize(8)

    // Esquina superior derecha
    doc.text('Sistema LOPIVI', pageWidth - 50, 15, { align: 'right' })

    // Esquina inferior izquierda
    doc.text('Custodia360', 15, pageHeight - 10)

    // Restaurar estado
    doc.setTextColor(currentTextColor)
    doc.setFontSize(currentFontSize)
  }

  // Funciones de generación de PDFs con sistema mejorado
  const generarPlanProteccion = () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4')
      optimizePDF(doc, 'Plan de Protección Integral LOPIVI')

      // Marca de agua en primera página
      addProfessionalWatermark(doc)

      // Encabezado profesional
      let yPosition = addPDFHeader(doc, 'PLAN DE PROTECCIÓN INTEGRAL', entidadData?.nombre)

      // Sección 1: Datos de la entidad
      const datosEntidad = [
        { label: 'Nombre', value: entidadData?.nombre || '' },
        { label: 'Plan contratado', value: entidadData?.plan || '' },
        { label: 'Fecha de implementación', value: new Date().toLocaleDateString('es-ES') },
        { label: 'Estado de cumplimiento', value: `${entidadData?.cumplimiento || 0}%` }
      ]
      yPosition = addPDFSection(doc, yPosition, '1. DATOS DE LA ENTIDAD', datosEntidad)

      // Sección 2: Delegados de protección
      const delegadosInfo = [
        `Delegado Principal: ${entidadData?.delegadoPrincipal.nombre}`,
        `Email: ${entidadData?.delegadoPrincipal.email}`,
        `Estado: ${entidadData?.delegadoPrincipal.certificado ? 'Certificado' : 'En formación'}`
      ]

      if (entidadData?.delegadoSuplente) {
        delegadosInfo.push(
          '',
          `Delegado Suplente: ${entidadData.delegadoSuplente.nombre}`,
          `Email: ${entidadData.delegadoSuplente.email}`,
          `Estado: ${entidadData.delegadoSuplente.certificado ? 'Certificado' : 'En formación'}`
        )
      }
      yPosition = addPDFSection(doc, yPosition, '2. DELEGADOS DE PROTECCIÓN', delegadosInfo)

      // Sección 3: Protocolos de actuación
      const protocolos = [
        'Protocolo de detección de situaciones de riesgo',
        'Protocolo de actuación ante sospechas de maltrato',
        'Protocolo de comunicación con autoridades',
        'Protocolo de atención inmediata a víctimas',
        'Protocolo de comunicación con familias',
        'Protocolo de seguimiento de casos'
      ]
      yPosition = addPDFSection(doc, yPosition, '3. PROTOCOLOS DE ACTUACIÓN', protocolos)

      // Sección 4: Medidas de protección implementadas
      const medidas = [
        'Sistema de supervisión continua de actividades',
        'Formación obligatoria para todo el personal',
        'Código de conducta profesional establecido',
        'Canal de denuncias confidencial activo',
        'Evaluaciones periódicas de riesgo',
        'Coordinación con servicios sociales'
      ]
      yPosition = addPDFSection(doc, yPosition, '4. MEDIDAS DE PROTECCIÓN IMPLEMENTADAS', medidas, true)

      // Pie de página
      addPDFFooter(doc, 'Plan de Protección LOPIVI - Documento confidencial')

      doc.save(`Plan_Proteccion_${entidadData?.nombre?.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`)
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, inténtelo de nuevo.')
    }
  }



  const generarInformeCumplimiento = () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4')
      optimizePDF(doc, 'Informe de Cumplimiento Mensual LOPIVI')

      // Marca de agua profesional
      addProfessionalWatermark(doc)

      // Encabezado con mes actual
      const fechaMes = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
      let yPosition = addPDFHeader(doc, 'INFORME DE CUMPLIMIENTO LOPIVI', `${entidadData?.nombre} - ${fechaMes}`)

      // Sección: Resumen ejecutivo
      const resumenEjecutivo = [
        { label: 'Estado de cumplimiento general', value: `${entidadData?.cumplimiento || 0}%` },
        { label: 'Alertas activas', value: `${entidadData?.alertas || 0}` },
        { label: 'Personal formado', value: `${Math.round((entidadData?.estadoImplementacion.formacionProgreso || 0) * 0.32)}/32 personas` },
        { label: 'Delegados activos', value: entidadData?.delegadoSuplente ? '2 (Principal + Suplente)' : '1 (Solo Principal)' }
      ]
      yPosition = addPDFSection(doc, yPosition, 'RESUMEN EJECUTIVO', resumenEjecutivo)

      // Sección: Estado de implementación
      const estadoImplementacion = [
        'Configuración inicial: Completada',
        'Delegado asignado: Completado',
        `Formación del personal: ${entidadData?.estadoImplementacion.formacionProgreso || 0}%`,
        `Validación final: ${entidadData?.estadoImplementacion.validacionFinal ? 'Completada' : 'Pendiente'}`
      ]
      yPosition = addPDFSection(doc, yPosition, 'ESTADO DE IMPLEMENTACIÓN', estadoImplementacion, true)

      // Sección: Próximas acciones requeridas
      const proximasAcciones = entidadData?.proximasAcciones || []
      yPosition = addPDFSection(doc, yPosition, 'PRÓXIMAS ACCIONES REQUERIDAS', proximasAcciones)

      // Pie de página
      addPDFFooter(doc, 'Informe de Cumplimiento LOPIVI - Documento confidencial')

      doc.save(`Informe_Cumplimiento_${entidadData?.nombre?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, inténtelo de nuevo.')
    }
  }

  const generarCertificadoImplementacion = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4') // Horizontal para certificado
      optimizePDF(doc, 'Certificado de Implementación LOPIVI')

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 50

      // Marca de agua especial para certificado
      doc.setTextColor(250, 250, 250)
      doc.setFontSize(60)
      const angle = -30 * Math.PI / 180
      doc.text('CUSTODIA360', pageWidth / 2, pageHeight / 2, {
        align: 'center',
        angle: angle
      })

      // Marco decorativo elegante
      doc.setDrawColor(...PDF_CONFIG.colors.accent)
      doc.setLineWidth(3)
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30)
      doc.setDrawColor(...PDF_CONFIG.colors.secondary)
      doc.setLineWidth(1)
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40)

      // Título principal
      doc.setFontSize(32)
      doc.setTextColor(...PDF_CONFIG.colors.accent)
      doc.text('CERTIFICADO DE IMPLEMENTACIÓN', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 15
      doc.setFontSize(20)
      doc.setTextColor(...PDF_CONFIG.colors.primary)
      doc.text('LEY ORGÁNICA DE PROTECCIÓN INTEGRAL', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 10
      doc.text('A LA INFANCIA Y LA ADOLESCENCIA', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 25
      doc.setFontSize(16)
      doc.text('Por la presente se certifica que', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setFontSize(28)
      doc.setTextColor(...PDF_CONFIG.colors.accent)
      doc.text(entidadData?.nombre || '', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setFontSize(14)
      doc.setTextColor(...PDF_CONFIG.colors.primary)
      doc.text('ha implementado correctamente el sistema de protección LOPIVI', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 8
      doc.text(`con un nivel de cumplimiento del ${entidadData?.cumplimiento || 0}%`, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setFontSize(12)
      doc.text(`Delegado Principal: ${entidadData?.delegadoPrincipal.nombre}`, pageWidth / 2, yPosition, { align: 'center' })
      if (entidadData?.delegadoSuplente) {
        yPosition += 8
        doc.text(`Delegado Suplente: ${entidadData.delegadoSuplente.nombre}`, pageWidth / 2, yPosition, { align: 'center' })
      }

      // Información de verificación
      yPosition += 25
      doc.setFontSize(10)
      doc.setTextColor(...PDF_CONFIG.colors.secondary)
      const codigoVerificacion = `LOPIVI-${Date.now().toString(36).toUpperCase()}`
      doc.text(`Código de verificación: ${codigoVerificacion}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 8
      doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, yPosition, { align: 'center' })

      // Pie de página
      yPosition += 15
      doc.text('Custodia360 - Sistema Automatizado de Cumplimiento LOPIVI', pageWidth / 2, yPosition, { align: 'center' })

      doc.save(`Certificado_Implementacion_${entidadData?.nombre?.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`)
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, inténtelo de nuevo.')
    }
  }

  const generarProtocolosActuacion = () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4')
      optimizePDF(doc, 'Protocolos de Actuación LOPIVI')

      // Marca de agua profesional
      addProfessionalWatermark(doc)

      // Encabezado profesional
      let yPosition = addPDFHeader(doc, 'PROTOCOLOS DE ACTUACIÓN', entidadData?.nombre)

      // Protocolo 1: Detección de situaciones de riesgo
      const protocolo1 = [
        'Observar cambios de comportamiento en el menor',
        'Documentar las observaciones de forma objetiva',
        'Contrastar información con otros profesionales',
        'Informar al Delegado de Protección inmediatamente',
        'Mantener la confidencialidad del caso'
      ]
      yPosition = addPDFSection(doc, yPosition, 'PROTOCOLO 1: DETECCIÓN DE SITUACIONES DE RIESGO', protocolo1)

      // Protocolo 2: Actuación ante emergencias
      const protocolo2 = [
        'Garantizar la seguridad inmediata del menor',
        'Llamar al 112 si hay riesgo vital',
        'Contactar con el Delegado de Protección',
        'Documentar todo lo ocurrido',
        'Comunicar a las autoridades competentes'
      ]
      yPosition = addPDFSection(doc, yPosition, 'PROTOCOLO 2: ACTUACIÓN ANTE EMERGENCIAS', protocolo2)

      // Contactos de emergencia
      const contactosEmergencia = [
        'Emergencias: 112',
        'Teléfono del Menor: 116111',
        `Delegado Principal: ${entidadData?.delegadoPrincipal.email}`
      ]

      if (entidadData?.delegadoSuplente) {
        contactosEmergencia.push(`Delegado Suplente: ${entidadData.delegadoSuplente.email}`)
      }

      yPosition = addPDFSection(doc, yPosition, 'CONTACTOS DE EMERGENCIA', contactosEmergencia)

      // Pie de página
      addPDFFooter(doc, 'Protocolos de Actuación LOPIVI - Documento confidencial')

      doc.save(`Protocolos_Actuacion_${entidadData?.nombre?.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, inténtelo de nuevo.')
    }
  }

  const generarCodigoConducta = () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4')
      optimizePDF(doc, 'Código de Conducta LOPIVI')

      // Marca de agua profesional
      addProfessionalWatermark(doc)

      // Encabezado profesional
      let yPosition = addPDFHeader(doc, 'CÓDIGO DE CONDUCTA', entidadData?.nombre)

      // Sección: Principios fundamentales
      const principios = [
        'Respeto absoluto a la dignidad de los menores',
        'Tolerancia cero ante cualquier forma de violencia',
        'Transparencia en todas las actuaciones',
        'Confidencialidad de la información sensible',
        'Colaboración con autoridades competentes'
      ]
      yPosition = addPDFSection(doc, yPosition, 'PRINCIPIOS FUNDAMENTALES', principios)

      // Sección: Normas de conducta obligatorias
      const normas = [
        'Trato respetuoso y profesional en todo momento',
        'No establecer relaciones inadecuadas con menores',
        'Evitar estar a solas con un menor sin supervisión',
        'No intercambiar información personal privada',
        'Reportar inmediatamente cualquier situación sospechosa',
        'Participar en las formaciones obligatorias',
        'Cumplir con los protocolos establecidos'
      ]
      yPosition = addPDFSection(doc, yPosition, 'NORMAS DE CONDUCTA OBLIGATORIAS', normas, true)

      // Sección: Compromiso
      const compromiso = [
        'El incumplimiento de este código puede resultar en medidas disciplinarias,',
        'incluyendo la terminación del contrato y denuncia a las autoridades.'
      ]
      yPosition = addPDFSection(doc, yPosition, 'COMPROMISO', compromiso)

      // Pie de página
      addPDFFooter(doc, 'Código de Conducta LOPIVI - Documento confidencial')

      doc.save(`Codigo_Conducta_${entidadData?.nombre?.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, inténtelo de nuevo.')
    }
  }

  if (!entidadData || !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{entidadData.nombre}</h1>
                <p className="text-sm text-gray-600">Panel de Gestión LOPIVI • {entidadData.plan}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{sessionData.nombre}</p>
                <p className="text-xs text-gray-600">Responsable • Contratante</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 text-sm px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div>
              <p className="text-sm text-gray-600">Estado LOPIVI</p>
              <p className={`text-2xl font-bold ${entidadData.cumplimiento >= 80 ? 'text-green-600' : entidadData.cumplimiento >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {entidadData.cumplimiento}%
              </p>
              <p className="text-xs text-gray-500">
                {entidadData.cumplimiento >= 80 ? 'Excelente' : entidadData.cumplimiento >= 60 ? 'En progreso' : 'Requiere atención'}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div>
              <p className="text-sm text-gray-600">Plan Activo</p>
              <p className="text-2xl font-bold text-gray-900">{entidadData.plan}</p>
              <p className="text-xs text-gray-500">Servicio contratado</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div>
              <p className="text-sm text-gray-600">Alertas Activas</p>
              <p className={`text-2xl font-bold ${entidadData.alertas > 3 ? 'text-red-600' : entidadData.alertas > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {entidadData.alertas}
              </p>
              <p className="text-xs text-gray-500">
                {entidadData.alertas === 0 ? 'Todo en orden' : 'Requieren revisión'}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div>
              <p className="text-sm text-gray-600">Delegados Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {entidadData.delegadoSuplente ? '2' : '1'}
              </p>
              <p className="text-xs text-gray-500">
                {entidadData.delegadoSuplente ? 'Principal + Suplente' : 'Solo Principal'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs de Navegación */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Vista General
              </button>
              <button
                onClick={() => setActiveTab('delegados')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'delegados'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Gestión Delegados
              </button>
              <button
                onClick={() => setActiveTab('progreso')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'progreso'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Progreso Implementación
              </button>
              <button
                onClick={() => setActiveTab('reportes')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'reportes'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Informe Ejecutivo
              </button>
            </nav>
          </div>

          <div className="p-8">
            {/* Vista General */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Progreso de Implementación */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Progreso de Implementación LOPIVI</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          entidadData.estadoImplementacion.configuracion ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <span className={`text-sm ${
                            entidadData.estadoImplementacion.configuracion ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {entidadData.estadoImplementacion.configuracion ? '✓' : '○'}
                          </span>
                        </div>
                        <span className="text-gray-900">Configuración inicial completada</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {entidadData.estadoImplementacion.configuracion ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          entidadData.estadoImplementacion.delegadoAsignado ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <span className={`text-sm ${
                            entidadData.estadoImplementacion.delegadoAsignado ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {entidadData.estadoImplementacion.delegadoAsignado ? '✓' : '○'}
                          </span>
                        </div>
                        <span className="text-gray-900">Delegado asignado y certificado</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {entidadData.estadoImplementacion.delegadoAsignado ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          entidadData.estadoImplementacion.formacionProgreso >= 80 ? 'bg-green-100' : 'bg-orange-100'
                        }`}>
                          <span className={`text-sm ${
                            entidadData.estadoImplementacion.formacionProgreso >= 80 ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {entidadData.estadoImplementacion.formacionProgreso >= 80 ? '✓' : '⏳'}
                          </span>
                        </div>
                        <span className="text-gray-900">Formación del personal</span>
                      </div>
                      <span className={`text-sm ${
                        entidadData.estadoImplementacion.formacionProgreso >= 80 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {entidadData.estadoImplementacion.formacionProgreso >= 80
                          ? 'Completado'
                          : `En progreso (${entidadData.estadoImplementacion.formacionProgreso}%)`
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          entidadData.estadoImplementacion.validacionFinal ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <span className={`text-sm ${
                            entidadData.estadoImplementacion.validacionFinal ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {entidadData.estadoImplementacion.validacionFinal ? '✓' : '○'}
                          </span>
                        </div>
                        <span className="text-gray-900">Validación final y activación</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {entidadData.estadoImplementacion.validacionFinal ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(entidadData.cumplimiento)}`}
                      style={{width: `${entidadData.cumplimiento}%`}}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Implementación LOPIVI al {entidadData.cumplimiento}% -
                    {entidadData.cumplimiento >= 80
                      ? ' Implementación completa'
                      : entidadData.cumplimiento >= 60
                        ? ' Estimado: 3-5 días para completar'
                        : ' Estimado: 1-2 semanas para completar'
                    }
                  </p>
                </div>

                {/* Próximas Acciones */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Próximas Acciones Requeridas</h3>
                  <div className="space-y-3">
                    {entidadData.proximasAcciones.map((accion, index) => (
                      <div key={index} className="flex items-center bg-white border border-gray-200 rounded-lg p-4">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-700 text-sm font-bold">{index + 1}</span>
                        </div>
                        <span className="text-gray-900">{accion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Gestión Delegados */}
            {activeTab === 'delegados' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Tu Equipo de Delegados de Protección</h3>

                  {/* Delegado Principal */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold mr-4">
                          {entidadData.delegadoPrincipal.nombre.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{entidadData.delegadoPrincipal.nombre}</h4>
                          <p className="text-blue-600 font-medium">Delegado Principal</p>
                          <p className="text-sm text-gray-600">{entidadData.delegadoPrincipal.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          entidadData.delegadoPrincipal.certificado
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entidadData.delegadoPrincipal.certificado ? 'Certificado' : 'En formación'}
                        </span>
                        <div className="mt-2">
                          <button
                            onClick={() => handleContactarDelegado(entidadData.delegadoPrincipal, 'Principal')}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            Contactar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delegado Suplente */}
                  {entidadData.delegadoSuplente ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-lg font-bold mr-4">
                            {entidadData.delegadoSuplente.nombre.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{entidadData.delegadoSuplente.nombre}</h4>
                            <p className="text-green-600 font-medium">Delegado Suplente</p>
                            <p className="text-sm text-gray-600">{entidadData.delegadoSuplente.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            entidadData.delegadoSuplente.certificado
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {entidadData.delegadoSuplente.certificado ? 'Certificado' : 'En formación'}
                          </span>
                          <div className="mt-2">
                            <button
                              onClick={() => handleContactarDelegado(entidadData.delegadoSuplente, 'Suplente')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Contactar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Delegado Suplente No Asignado</h4>
                        <p className="text-gray-600 mb-4">
                          Recomendamos contratar un delegado suplente para garantizar cobertura continua durante vacaciones, ausencias o emergencias.
                        </p>
                        <button className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700">
                          Contratar Delegado Suplente (+10€)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Progreso Implementación */}
            {activeTab === 'progreso' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Detalle del Progreso de Implementación</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-bold text-gray-700 mb-4">Formación del Personal</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Personal formado</span>
                          <span className="font-bold text-gray-900">{Math.round(entidadData.estadoImplementacion.formacionProgreso * 0.32)}/32</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{width: `${entidadData.estadoImplementacion.formacionProgreso}%`}}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600">
                          {32 - Math.round(entidadData.estadoImplementacion.formacionProgreso * 0.32)} personas pendientes de formación
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-bold text-gray-700 mb-4">Familias Informadas</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Familias contactadas</span>
                          <span className="font-bold text-gray-900">156/166</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                        </div>
                        <p className="text-xs text-gray-600">10 familias pendientes de confirmación</p>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-bold text-gray-700 mb-4">Documentación</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Plan de protección</span>
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Protocolos actuación</span>
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Código de conducta</span>
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Certificados delegados</span>
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-bold text-gray-700 mb-4">Próximos Hitos</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                          <span className="text-gray-700">Completar formación personal (5 días)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                          <span className="text-gray-700">Auditoría interna (2 semanas)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                          <span className="text-gray-700">Certificación final (3 semanas)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informe Ejecutivo */}
            {activeTab === 'reportes' && (
              <div className="space-y-8">
                {/* Botón para generar informe ejecutivo */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <h4 className="font-bold text-gray-900 mb-4">Generar Informe Ejecutivo</h4>
                  <p className="text-gray-600 mb-4">
                    Crea un informe ejecutivo completo y resolutivo con los datos actuales de tu entidad para presentar en reuniones, inspecciones o a la dirección.
                  </p>
                  <button onClick={generarInformeEjecutivo} className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700">
                    Generar Informe Ejecutivo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alertas y Notificaciones */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Alertas y Notificaciones</h2>

          <div className="space-y-4">
            {entidadData.alertas > 0 && entidadData.proximasAcciones.slice(0, entidadData.alertas).map((alert, index) => (
              <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-600 text-xl"></span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Acción requerida</h3>
                    <p className="text-sm text-yellow-700 mt-1">{alert}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-600 text-xl"></span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Sistema actualizado</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Todos los protocolos han sido actualizados según la última normativa LOPIVI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Contacto Delegado */}
      {showDelegadoModal && selectedDelegado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${selectedDelegado.tipo === 'Principal' ? 'bg-blue-600' : 'bg-green-600'} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
                {selectedDelegado.nombre.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{selectedDelegado.nombre}</h3>
              <p className={`font-medium ${selectedDelegado.tipo === 'Principal' ? 'text-blue-600' : 'text-green-600'}`}>
                Delegado {selectedDelegado.tipo}
              </p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium mt-2 inline-block ${
                selectedDelegado.certificado
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedDelegado.certificado ? 'Certificado' : 'En formación'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-700 mb-3">Información de Contacto</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-gray-600 text-sm">📧</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{selectedDelegado.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-gray-600 text-sm">📱</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-medium text-gray-900">{selectedDelegado.telefono}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Contacto directo:</strong> Puedes comunicarte directamente con el delegado usando estos datos para cualquier consulta relacionada con LOPIVI.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDelegadoModal(false)}
              className="w-full mt-6 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
