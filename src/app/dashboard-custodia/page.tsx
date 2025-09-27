'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { jsPDF } from 'jspdf'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'admin_custodia'
  entidad: string
}

interface EntidadData {
  id: string
  nombre: string
  plan: string
  fechaContratacion: string
  estado: 'activo' | 'pendiente' | 'cancelado'
  delegadoPrincipal: string
  importeTotal: number
  numeroMenores: string
  emailContratante: string
}

interface MetricasData {
  entidadesActivas: number
  entidadesTotales: number
  delegadosActivos: number
  facturacionMensual: number
  facturacionAnual: number
}

export default function DashboardCustodia() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [metricas, setMetricas] = useState<MetricasData | null>(null)
  const [entidades, setEntidades] = useState<EntidadData[]>([])
  const [entidadSeleccionada, setEntidadSeleccionada] = useState<EntidadData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showGenerarInformeModal, setShowGenerarInformeModal] = useState(false)
  const [showEnviarComunicacionModal, setShowEnviarComunicacionModal] = useState(false)
  const [showInformeViewer, setShowInformeViewer] = useState(false)
  const [tipoInformeViewer, setTipoInformeViewer] = useState('')
  const [showInformePersonalizadoModal, setShowInformePersonalizadoModal] = useState(false)
  const [showInformeCompletoModal, setShowInformeCompletoModal] = useState(false)
  const [showCertificadoModal, setShowCertificadoModal] = useState(false)
  const [entidadInformeCompleto, setEntidadInformeCompleto] = useState<EntidadData | null>(null)

  // Función para mostrar informe en modal
  const mostrarInformeEnModal = (tipo: string) => {
    setTipoInformeViewer(tipo)
    setShowInformeViewer(true)
  }

  // Función para mostrar informe completo de entidad
  const mostrarInformeCompleto = (entidad: EntidadData) => {
    setEntidadInformeCompleto(entidad)
    setShowInformeCompletoModal(true)
  }

  // Función para mostrar certificado de entidad
  const mostrarCertificado = (entidad: EntidadData) => {
    setEntidadInformeCompleto(entidad)
    setShowCertificadoModal(true)
  }

  // Función para enviar documento por email
  const enviarDocumentoPorEmail = (tipo: string, entidad?: EntidadData) => {
    alert(`Enviando ${tipo} ${entidad ? `de ${entidad.nombre}` : ''} por email...`)
  }

  useEffect(() => {
    // Crear sesión demo automáticamente
    const demoSession: SessionData = {
      id: 'admin-custodia-demo',
      nombre: 'Administrador Custodia360',
      email: 'admin@custodia360.com',
      tipo: 'admin_custodia',
      entidad: 'Custodia360 Admin'
    }

    setSessionData(demoSession)

    // Datos simulados del negocio
    const metricasData: MetricasData = {
      entidadesActivas: 127,
      entidadesTotales: 134,
      delegadosActivos: 203,
      facturacionMensual: 12750,
      facturacionAnual: 153000
    }

    const entidadesData: EntidadData[] = [
      {
        id: 'ENT-001',
        nombre: 'Club Deportivo Ejemplo',
        plan: 'Plan 500',
        fechaContratacion: '2024-01-15',
        estado: 'activo',
        delegadoPrincipal: 'Juan García Rodríguez',
        importeTotal: 210,
        numeroMenores: '201-500',
        emailContratante: 'director@custodia360.com'
      },
      {
        id: 'ENT-002',
        nombre: 'Academia Deportiva Madrid',
        plan: 'Plan 200',
        fechaContratacion: '2024-01-10',
        estado: 'activo',
        delegadoPrincipal: 'Carlos Ruiz Sánchez',
        importeTotal: 98,
        numeroMenores: '51-200',
        emailContratante: 'presidenta@academia.com'
      },
      {
        id: 'ENT-003',
        nombre: 'Club Deportivo Nuevo',
        plan: 'Plan 50',
        fechaContratacion: '2024-01-20',
        estado: 'pendiente',
        delegadoPrincipal: 'Ana Fernández López',
        importeTotal: 38,
        numeroMenores: '1-50',
        emailContratante: 'responsable@nuevaentidad.com'
      }
    ]

    setMetricas(metricasData)
    setEntidades(entidadesData)
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userSession')
    sessionStorage.removeItem('userSession')
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }


  // Función para generar PDF mejorada
  const generarPDF = (tipo: string, titulo: string, contenido?: string) => {
    const doc = new jsPDF()

    // Header mejorado
    doc.setFontSize(24)
    doc.setTextColor(59, 130, 246)
    doc.text('CUSTODIA360', 20, 20)

    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text(titulo, 20, 35)

    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 45)

    doc.setFontSize(12)
    let yPosition = 60

    let contenidoDefault = ''
    switch (tipo) {
      case 'mensual':
        contenidoDefault = `
INFORME EJECUTIVO MENSUAL - ${new Date().toLocaleDateString('es-ES')}

RESUMEN EJECUTIVO
- Entidades activas: ${metricas?.entidadesActivas || 0}
- Delegados certificados: ${metricas?.delegadosActivos || 0}
- Facturación mensual: ${formatCurrency(metricas?.facturacionMensual || 0)}
- Tasa de cumplimiento: 94.2%

MÉTRICAS OPERATIVAS
- Nuevas contrataciones: 15
- Renovaciones completadas: 8
- Formaciones realizadas: 23
- Incidencias resueltas: 3

ANÁLISIS DE CUMPLIMIENTO
- Entidades con cumplimiento completo: 89%
- Entidades en proceso de implementación: 8%
- Entidades con documentación pendiente: 3%

PROYECCIONES
- Crecimiento esperado próximo mes: +12%
- Renovaciones programadas: 18
- Formaciones planificadas: 27

Documento generado automáticamente por Custodia360
        `
        break
      case 'trimestral':
        contenidoDefault = `
INFORME TRIMESTRAL Q1 2025

RESUMEN EJECUTIVO DEL TRIMESTRE
- Crecimiento de entidades: +18.5%
- Retención de clientes: 96.1%
- Satisfacción promedio: 4.8/5
- Ingresos del trimestre: ${formatCurrency((metricas?.facturacionMensual || 0) * 3)}

ANÁLISIS DE TENDENCIAS
- Mayor adopción en sector deportivo
- Incremento en formaciones especializadas
- Reducción de incidencias en 23%
- Mejora en tiempos de implementación

CUMPLIMIENTO NORMATIVO
- 100% de entidades con protocolos actualizados
- 98% de delegados con certificación vigente
- 95% de personal formado según normativa

OBJETIVOS PRÓXIMO TRIMESTRE
- Incrementar base de clientes en 25%
- Lanzar nuevos módulos formativos
- Implementar sistema de alertas automáticas

Documento generado automáticamente por Custodia360
        `
        break
      case 'anual':
        contenidoDefault = `
INFORME ANUAL 2024 - RESUMEN EJECUTIVO

LOGROS DEL AÑO
- Crecimiento total: +45%
- Entidades incorporadas: 47 nuevas
- Delegados formados: 156
- Ingresos anuales: ${formatCurrency(metricas?.facturacionAnual || 0)}

HITOS DESTACADOS
- Certificación oficial como entidad formadora
- Desarrollo de plataforma digital avanzada
- Alianzas estratégicas con federaciones deportivas
- Reconocimiento por excelencia en cumplimiento LOPIVI

IMPACTO SOCIAL
- Más de 12.000 menores protegidos
- 247 delegados certificados activos
- 98.5% de tasa de prevención de incidencias
- Cobertura en 15 comunidades autónomas

PROYECCIONES 2025
- Objetivo de crecimiento: +60%
- Nuevos servicios de consultoría
- Expansión internacional
- Digitalización completa de procesos

Documento generado automáticamente por Custodia360
        `
        break
    }

    const textoFinal = contenido || contenidoDefault
    const lines = textoFinal.trim().split('\n')

    lines.forEach(line => {
      if (line.trim() === '') {
        yPosition += 5
      } else {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line.trim(), 20, yPosition)
        yPosition += 5
      }
    })

    // Footer
    doc.setFontSize(8)
    doc.text('Custodia360 - Solución integral para el cumplimiento LOPIVI', 20, 285)

    doc.save(`${tipo}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Función para generar PDFs descargables (anterior)
  const generarPDFAnterior = (tipo: string, titulo: string) => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('CUSTODIA360', 20, 20)

    doc.setFontSize(16)
    doc.text(titulo, 20, 35)

    // Fecha
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 45)

    // Contenido principal
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')

    let contenido = ''

    switch (tipo) {
      case 'manual-lopivi':
        contenido = `
MANUAL LOPIVI COMPLETO

1. INTRODUCCIÓN
La Ley Orgánica de Protección Integral a la Infancia y Adolescencia frente a la Violencia (LOPIVI) establece el marco normativo para garantizar la protección de menores en todos los ámbitos.

2. OBLIGACIONES LEGALES
- Designación de delegado de protección
- Formación obligatoria del personal
- Protocolos de actuación
- Documentación y seguimiento

3. IMPLEMENTACIÓN
Custodia360 facilita el cumplimiento integral de la LOPIVI mediante herramientas automatizadas y procesos optimizados.

Para más información contacte con soporte@custodia360.com
        `
        break

      case 'informe-mensual':
        contenido = `
INFORME MENSUAL EJECUTIVO - ${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}

RESUMEN EJECUTIVO
- Entidades activas: ${metricas?.entidadesActivas}
- Delegados certificados: ${metricas?.delegadosActivos}
- Facturación del mes: ${formatCurrency(metricas?.facturacionMensual || 0)}

MÉTRICAS DE CUMPLIMIENTO
- Tasa de cumplimiento general: 94.2%
- Renovaciones completadas: 100%
- Incidencias resueltas: 0

PROYECCIONES
- Crecimiento estimado próximo mes: +8%
- Nuevas contrataciones previstas: 12

Generado por Custodia360 - Sistema de gestión LOPIVI
        `
        break

      default:
        contenido = `
${titulo}

Este documento ha sido generado automáticamente por Custodia360.

Contenido detallado del documento ${tipo}.

Para obtener más información o personalizar este documento,
contacte con nuestro equipo de soporte.

Email: soporte@custodia360.com
Teléfono: +34 900 123 456
        `
    }

    // Añadir contenido con saltos de línea
    const lines = contenido.trim().split('\n')
    let yPosition = 60

    lines.forEach(line => {
      if (line.trim() === '') {
        yPosition += 5
      } else {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line.trim(), 20, yPosition)
        yPosition += 5
      }
    })

    // Footer
    doc.setFontSize(8)
    doc.text('Custodia360 - Solución integral para el cumplimiento LOPIVI', 20, 285)

    // Descargar
    doc.save(`${tipo}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Función para generar informe de entidad específica
  const generarInformeEntidad = (entidad: EntidadData, tipoInforme: 'completo' | 'certificado') => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('CUSTODIA360', 20, 20)

    doc.setFontSize(16)
    doc.text(`${tipoInforme === 'completo' ? 'INFORME COMPLETO' : 'CERTIFICADO DE CUMPLIMIENTO'}`, 20, 35)
    doc.text(`${entidad.nombre}`, 20, 50)

    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 60)

    doc.setFontSize(12)

    if (tipoInforme === 'completo') {
      const contenido = `
DATOS DE LA ENTIDAD
- Nombre: ${entidad.nombre}
- Plan contratado: ${entidad.plan}
- Número de menores: ${entidad.numeroMenores}
- Estado: ${entidad.estado}
- Fecha contratación: ${formatDate(entidad.fechaContratacion)}

DELEGADO RESPONSABLE
- Delegado principal: ${entidad.delegadoPrincipal}
- Email de contacto: ${entidad.emailContratante}
- Estado certificación: Vigente

CUMPLIMIENTO LOPIVI
- Estado general: CONFORME
- Protocolos implementados: SÍ
- Personal formado: 100%
- Documentación: COMPLETA

FACTURACIÓN
- Importe mensual: ${formatCurrency(entidad.importeTotal)}
- Estado pagos: AL DÍA

Este informe certifica el cumplimiento íntegro de la normativa LOPIVI por parte de la entidad.
      `

      const lines = contenido.trim().split('\n')
      let yPosition = 75

      lines.forEach(line => {
        if (line.trim() === '') {
          yPosition += 5
        } else {
          doc.text(line.trim(), 20, yPosition)
          yPosition += 5
        }
      })
    } else {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('CERTIFICADO DE CUMPLIMIENTO LOPIVI', 20, 80)

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Se certifica que ${entidad.nombre} cumple íntegramente`, 20, 100)
      doc.text('con todos los requisitos establecidos en la LOPIVI.', 20, 110)

      doc.text('✓ Delegado de Protección certificado', 20, 130)
      doc.text('✓ Personal formado según normativa', 20, 140)
      doc.text('✓ Protocolos de actuación implementados', 20, 150)
      doc.text('✓ Documentación completa y actualizada', 20, 160)

      doc.setFont('helvetica', 'bold')
      doc.text('VÁLIDO PARA INSPECCIONES OFICIALES', 20, 180)
    }

    doc.setFontSize(8)
    doc.text('Custodia360 - Certificación oficial LOPIVI', 20, 285)

    doc.save(`${tipoInforme}-${entidad.nombre.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Funciones mejoradas para generar PDFs de documentación
  const generarPDFGuiaOficial = (tipo: string) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Función auxiliar para control de página
      const checkPageBreak = (requiredSpace = 30) => {
        if (yPosition > pageHeight - requiredSpace) {
          doc.addPage()
          addHeader()
          yPosition = 30
        }
      }

      // Función para agregar header profesional
      const addHeader = () => {
        // Marco superior
        doc.setDrawColor(59, 130, 246)
        doc.setLineWidth(1)
        doc.line(15, 15, pageWidth - 15, 15)

        // Logo y título principal
        doc.setFontSize(20)
        doc.setTextColor(59, 130, 246)
        doc.setFont('helvetica', 'bold')
        doc.text('CUSTODIA360', 20, 25)

        // Subtítulo
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.setFont('helvetica', 'normal')
        doc.text('Sistema Integral de Cumplimiento LOPIVI', pageWidth - 20, 25, { align: 'right' })

        // Línea separadora
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.5)
        doc.line(15, 28, pageWidth - 15, 28)
      }

      // Función para agregar footer profesional
      const addFooter = () => {
        const footerY = pageHeight - 20

        // Línea separadora
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.5)
        doc.line(15, footerY - 5, pageWidth - 15, footerY - 5)

        // Información del footer
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.setFont('helvetica', 'normal')
        doc.text('© 2025 Custodia360 - Solución integral para el cumplimiento LOPIVI', 20, footerY)
        doc.text(`Página ${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth - 20, footerY, { align: 'right' })
        doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, footerY, { align: 'center' })
      }

      // Agregar header inicial
      addHeader()
      yPosition = 40

      doc.setFontSize(18)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')

      let titulo = ''
      let contenido: string[] = []

      switch (tipo) {
        case 'manual-lopivi':
          titulo = 'MANUAL COMPLETO LOPIVI'
          contenido = [
            'ÍNDICE DEL MANUAL',
            '1. Introducción y Marco Legal',
            '2. Objetivos y Principios Rectores',
            '3. Obligaciones para Entidades',
            '4. Protocolos de Actuación',
            '5. Formación del Personal',
            '6. Sistemas de Prevención',
            '7. Procedimientos de Emergencia',
            '8. Documentación Requerida',
            '9. Régimen Sancionador',
            '10. Implementación con Custodia360',
            '',
            '════════════════════════════════════════════════════════════',
            '1. INTRODUCCIÓN Y MARCO LEGAL',
            '════════════════════════════════════════════════════════════',
            '',
            'La Ley Orgánica 8/2021, de 4 de junio, de protección integral a la infancia y',
            'la adolescencia frente a la violencia (LOPIVI), constituye el marco normativo',
            'más avanzado de Europa para la protección de menores.',
            '',
            'DESARROLLO NORMATIVO:',
            '▸ Real Decreto 1070/2022: Desarrollo del Plan de Protección',
            '▸ Resolución de 10 de agosto de 2022: Formación especializada',
            '▸ Circular FGE 3/2022: Protocolo de actuación judicial',
            '',
            'ÁMBITO DE APLICACIÓN TERRITORIAL:',
            '✓ Todo el territorio español',
            '✓ Centros educativos y deportivos',
            '✓ Entidades de ocio y tiempo libre',
            '✓ Organizaciones que trabajen con menores',
            '',
            '════════════════════════════════════════════════════════════',
            '2. OBJETIVOS Y PRINCIPIOS RECTORES',
            '════════════════════════════════════════════════════════════',
            '',
            'OBJETIVOS GENERALES:',
            '▸ Garantizar los derechos fundamentales de menores',
            '▸ Establecer medidas de protección integral',
            '▸ Crear sistemas efectivos de prevención',
            '▸ Facilitar la detección temprana de riesgos',
            '▸ Coordinar la respuesta institucional',
            '',
            'PRINCIPIOS FUNDAMENTALES:',
            '1. Interés superior del menor (Art. 2 LOPIVI)',
            '2. No discriminación e igualdad de trato',
            '3. Derecho a la vida, supervivencia y desarrollo',
            '4. Participación y expresión libre de opiniones',
            '5. Efectividad y aplicación sistemática',
            '6. Proporcionalidad en las medidas adoptadas',
            '',
            '════════════════════════════════════════════════════════════',
            '3. OBLIGACIONES ESPECÍFICAS PARA ENTIDADES',
            '════════════════════════════════════════════════════════════',
            '',
            'REQUISITOS OBLIGATORIOS (Art. 35 LOPIVI):',
            '',
            'A) DELEGADO/A DE PROTECCIÓN:',
            '▸ Designación obligatoria y formal',
            '▸ Formación especializada certificada',
            '▸ Funciones claramente definidas',
            '▸ Acceso directo a la dirección',
            '▸ Dedicación mínima según tamaño de entidad',
            '',
            'B) PLAN DE PROTECCIÓN:',
            '▸ Documento formal y actualizado',
            '▸ Análisis de riesgos específicos',
            '▸ Medidas preventivas concretas',
            '▸ Protocolos de actuación definidos',
            '▸ Sistema de seguimiento y evaluación',
            '',
            'C) CÓDIGO DE CONDUCTA:',
            '▸ Normas claras de comportamiento',
            '▸ Prohibiciones específicas',
            '▸ Consecuencias por incumplimiento',
            '▸ Comunicación a todo el personal',
            '▸ Aceptación formal y documentada',
            '',
            'D) FORMACIÓN OBLIGATORIA:',
            '▸ Personal en contacto directo: 20 horas',
            '▸ Personal ocasional: 8 horas',
            '▸ Directivos y coordinadores: 30 horas',
            '▸ Reciclaje anual obligatorio',
            '▸ Certificación oficial requerida',
            '',
            '════════════════════════════════════════════════════════════',
            '4. RÉGIMEN SANCIONADOR',
            '════════════════════════════════════════════════════════════',
            '',
            'INFRACCIONES LEVES (Art. 71):',
            '▸ Multa: 10.000€ - 50.000€',
            '▸ Incumplimientos menores de documentación',
            '▸ Retrasos en la formación del personal',
            '',
            'INFRACCIONES GRAVES (Art. 72):',
            '▸ Multa: 50.001€ - 500.000€',
            '▸ Falta de delegado de protección',
            '▸ Plan de protección inexistente o inadecuado',
            '',
            'INFRACCIONES MUY GRAVES (Art. 73):',
            '▸ Multa: 500.001€ - 1.000.000€',
            '▸ Clausura temporal del centro',
            '▸ Inhabilitación para trabajar con menores',
            '▸ Poner en peligro la integridad de menores',
            '',
            'MEDIDAS ACCESORIAS:',
            '▸ Publicación de la sanción',
            '▸ Decomiso de materiales inadecuados',
            '▸ Suspensión de subvenciones públicas',
            '▸ Exclusión de contratos públicos',
            '',
            '════════════════════════════════════════════════════════════',
            '5. IMPLEMENTACIÓN CON CUSTODIA360',
            '════════════════════════════════════════════════════════════',
            '',
            'VENTAJAS DEL SISTEMA INTEGRAL:',
            '',
            '🎯 AUTOMATIZACIÓN COMPLETA:',
            '▸ Generación automática del Plan de Protección',
            '▸ Código de Conducta personalizado por actividad',
            '▸ Protocolos específicos para cada situación',
            '▸ Documentación siempre actualizada',
            '',
            '👨‍🎓 FORMACIÓN CERTIFICADA:',
            '▸ Campus virtual especializado',
            '▸ Contenidos actualizados según normativa',
            '▸ Certificados oficiales válidos',
            '▸ Seguimiento automático de caducidades',
            '',
            '📊 MONITOREO CONTINUO:',
            '▸ Panel de control en tiempo real',
            '▸ Alertas automáticas de vencimientos',
            '▸ Informes de cumplimiento generados',
            '▸ Registro de todas las actividades',
            '',
            '🛡️ PROTECCIÓN JURÍDICA:',
            '▸ Cumplimiento integral garantizado',
            '▸ Documentación válida para inspecciones',
            '▸ Asesoramiento legal especializado',
            '▸ Actualizaciones automáticas normativas',
            '',
            '💼 SOPORTE PROFESIONAL 24/7:',
            '▸ Equipo de expertos en LOPIVI',
            '▸ Respuesta inmediata ante emergencias',
            '▸ Acompañamiento en inspecciones',
            '▸ Formación continua del equipo',
            '',
            '════════════════════════════════════════════════════════════',
            'CONTACTO Y SOPORTE',
            '════════════════════════════════════════════════════════════',
            '',
            '📞 Teléfono: +34 900 123 456',
            '📧 Email: soporte@custodia360.com',
            '🌐 Web: www.custodia360.com',
            '📍 Horario: Lunes a Viernes 8:00-20:00h'
          ]
          break
        case 'protocolo-actuacion':
          titulo = 'PROTOCOLO DE ACTUACIÓN LOPIVI'
          contenido = [
            '🚨 PROTOCOLO DE EMERGENCIA Y ACTUACIÓN',
            '',
            '════════════════════════════════════════════════════════════',
            '1. SISTEMA DE DETECCIÓN TEMPRANA',
            '════════════════════════════════════════════════════════════',
            '',
            '🔍 INDICADORES DE RIESGO FÍSICO:',
            '▸ Lesiones inexplicables o recurrentes',
            '▸ Marcas de golpes, quemaduras o mordeduras',
            '▸ Negligencia en higiene o alimentación',
            '▸ Ropa inadecuada para el clima',
            '▸ Fatiga constante o somnolencia',
            '',
            '🧠 INDICADORES COMPORTAMENTALES:',
            '▸ Cambios súbitos en el comportamiento',
            '▸ Agresividad extrema o retraimiento',
            '▸ Miedo desproporcionado a adultos',
            '▸ Comportamientos regresivos',
            '▸ Conocimiento sexual inapropiado para la edad',
            '',
            '📚 INDICADORES ACADÉMICOS/DEPORTIVOS:',
            '▸ Descenso repentino en rendimiento',
            '▸ Problemas de concentración',
            '▸ Ausentismo frecuente e injustificado',
            '▸ Llegadas tempranas y salidas tardías',
            '▸ Evitación de actividades específicas',
            '',
            '════════════════════════════════════════════════════════════',
            '2. PROTOCOLO DE ACTUACIÓN INMEDIATA',
            '════════════════════════════════════════════════════════════',
            '',
            '⚡ RESPUESTA EN LOS PRIMEROS 30 MINUTOS:',
            '',
            'PASO 1 - SEGURIDAD INMEDIATA (0-5 min):',
            '🛡️ Garantizar la protección del menor',
            '🚫 Separar al menor del agresor si está presente',
            '🏥 Evaluar necesidad de atención médica urgente',
            '📞 Llamar al 112 si hay peligro inmediato',
            '',
            'PASO 2 - DOCUMENTACIÓN (5-15 min):',
            '📝 Registrar hechos de forma objetiva',
            '📷 Fotografiar evidencias físicas (si procede)',
            '🕐 Anotar fecha, hora y circunstancias exactas',
            '👥 Identificar testigos presentes',
            '',
            'PASO 3 - COMUNICACIÓN (15-30 min):',
            '📞 Informar inmediatamente al Delegado de Protección',
            '🏢 Comunicar a la dirección de la entidad',
            '👨‍⚕️ Contactar servicios sanitarios si es necesario',
            '👮‍♂️ Comunicar a Fuerzas de Seguridad (si procede)',
            '',
            '════════════════════════════════════════════════════════════',
            '3. PROTOCOLO DE EMERGENCIA (112)',
            '════════════════════════════════════════════════════════════',
            '',
            'CUÁNDO LLAMAR AL 112:',
            '🆘 Peligro inmediato para la vida o integridad',
            '🩸 Lesiones graves que requieren atención urgente',
            '🔥 Situaciones de violencia en curso',
            '💀 Amenazas directas de muerte o daño grave',
            '',
            'INFORMACIÓN A PROPORCIONAR:',
            '📍 Ubicación exacta del incidente',
            '👤 Número de menores afectados',
            '🚨 Naturaleza de la emergencia',
            '⏰ Estado actual de la situación',
            '🏢 Identificación de la entidad',
            '',
            '════════════════════════════════════════════════════════════',
            '4. COMUNICACIÓN CON AUTORIDADES',
            '════════════════════════════════════════════════════════════',
            '',
            '📞 TELÉFONOS DE EMERGENCIA:',
            '▸ Emergencias generales: 112',
            '▸ Guardia Civil: 062',
            '▸ Policía Nacional: 091',
            '▸ Policía Local: 092',
            '▸ ANAR (Ayuda a Niños): 900 20 20 10',
            '',
            '📋 DOCUMENTACIÓN A PREPARAR:',
            '▸ Informe detallado del incidente',
            '▸ Datos de identificación del menor',
            '▸ Evidencias fotográficas (si las hay)',
            '▸ Declaraciones de testigos',
            '▸ Historial previo de incidentes',
            '',
            '════════════════════════════════════════════════════════════',
            '5. COMUNICACIÓN CON FAMILIAS',
            '════════════════════════════════════════════════════════════',
            '',
            '👨‍👩‍👧‍👦 PROTOCOLO DE INFORMACIÓN A PADRES:',
            '',
            'CASOS DE EMERGENCIA MÉDICA:',
            '▸ Comunicación inmediata por teléfono',
            '▸ Información sobre centro médico',
            '▸ Acompañamiento si es posible',
            '▸ Seguimiento posterior del estado',
            '',
            'CASOS DE SOSPECHA DE MALTRATO:',
            '⚠️ PRECAUCIÓN: No informar si los padres pueden ser',
            'los responsables del maltrato',
            '▸ Consultar con Delegado de Protección',
            '▸ Coordinar con Servicios Sociales',
            '▸ Seguir indicaciones de autoridades',
            '',
            'COMUNICACIÓN GENERAL:',
            '▸ Reunión presencial preferible',
            '▸ Ambiente privado y confidencial',
            '▸ Presencia del Delegado de Protección',
            '▸ Documentar la comunicación realizada',
            '',
            '════════════════════════════════════════════════════════════',
            '6. SEGUIMIENTO Y EVALUACIÓN',
            '════════════════════════════════════════════════════════════',
            '',
            '📊 REGISTRO DE INCIDENTES:',
            '▸ Base de datos confidencial',
            '▸ Acceso restringido al Delegado',
            '▸ Copia de seguridad encriptada',
            '▸ Tiempo de conservación: 10 años',
            '',
            '🔄 SEGUIMIENTO POST-INCIDENTE:',
            '▸ Evaluación del menor afectado',
            '▸ Apoyo psicológico si es necesario',
            '▸ Revisión de protocolos aplicados',
            '▸ Mejora continua de procedimientos',
            '',
            '⚖️ ASPECTOS LEGALES:',
            '▸ Deber de denuncia (Art. 262 LECrim)',
            '▸ Confidencialidad y protección de datos',
            '▸ Colaboración con autoridades',
            '▸ Asesoramiento jurídico especializado'
          ]
          break
        case 'guia-implementacion':
          titulo = 'GUÍA DE IMPLEMENTACIÓN LOPIVI'
          contenido = [
            '📋 GUÍA COMPLETA DE IMPLEMENTACIÓN',
            '',
            '════════════════════════════════════════════════════════════',
            'CRONOGRAMA DE IMPLEMENTACIÓN (12 SEMANAS)',
            '════════════════════════════════════════════════════════════',
            '',
            '📅 SEMANAS 1-2: ANÁLISIS Y PLANIFICACIÓN',
            '📅 SEMANAS 3-4: DESIGNACIÓN Y FORMACIÓN INICIAL',
            '📅 SEMANAS 5-8: DESARROLLO DOCUMENTAL',
            '📅 SEMANAS 9-10: FORMACIÓN DEL PERSONAL',
            '📅 SEMANAS 11-12: IMPLEMENTACIÓN Y SEGUIMIENTO',
            '',
            '════════════════════════════════════════════════════════════',
            'FASE 1: ANÁLISIS INICIAL (Semanas 1-2)',
            '════════════════════════════════════════════════════════════',
            '',
            '🔍 AUDITORÍA ORGANIZACIONAL:',
            '▸ Evaluación de la estructura actual',
            '▸ Identificación de personal en contacto con menores',
            '▸ Análisis de actividades y espacios',
            '▸ Revisión de procedimientos existentes',
            '▸ Evaluación de recursos disponibles',
            '',
            '⚠️ ANÁLISIS DE RIESGOS:',
            '▸ Identificación de situaciones de vulnerabilidad',
            '▸ Evaluación de espacios físicos',
            '▸ Análisis de actividades de riesgo',
            '▸ Revisión de accesos y controles',
            '▸ Evaluación de sistemas de comunicación',
            '',
            '📊 DOCUMENTACIÓN REQUERIDA:',
            '▸ Organigrama actualizado',
            '▸ Listado de personal',
            '▸ Descripción de actividades',
            '▸ Planos de instalaciones',
            '▸ Normativa interna existente',
            '',
            '════════════════════════════════════════════════════════════',
            'FASE 2: DESIGNACIÓN Y FORMACIÓN (Semanas 3-4)',
            '════════════════════════════════════════════════════════════',
            '',
            '👨‍💼 SELECCIÓN DEL DELEGADO/A DE PROTECCIÓN:',
            '',
            'CRITERIOS DE SELECCIÓN:',
            '▸ Experiencia mínima de 3 años en la organización',
            '▸ Capacidad de liderazgo y comunicación',
            '▸ Conocimiento de la normativa LOPIVI',
            '▸ Disponibilidad horaria adecuada',
            '▸ Integridad y confidencialidad probadas',
            '',
            'PERFIL PROFESIONAL RECOMENDADO:',
            '▸ Formación en educación, psicología o trabajo social',
            '▸ Experiencia en gestión de equipos',
            '▸ Conocimientos básicos en prevención',
            '▸ Habilidades de comunicación avanzadas',
            '',
            '📚 FORMACIÓN INICIAL DELEGADO:',
            '▸ Curso oficial de 40 horas (presencial + online)',
            '▸ Marco legal LOPIVI completo',
            '▸ Técnicas de detección de maltrato',
            '▸ Protocolos de actuación específicos',
            '▸ Gestión de crisis y comunicación',
            '▸ Examen de certificación oficial',
            '',
            '════════════════════════════════════════════════════════════',
            'FASE 3: DESARROLLO DOCUMENTAL (Semanas 5-8)',
            '════════════════════════════════════════════════════════════',
            '',
            '📋 PLAN DE PROTECCIÓN PERSONALIZADO:',
            '',
            'CONTENIDO OBLIGATORIO:',
            '▸ Análisis de riesgos específicos',
            '▸ Medidas preventivas implementadas',
            '▸ Protocolos de actuación detallados',
            '▸ Sistemas de comunicación internos',
            '▸ Procedimientos de formación continua',
            '▸ Mecanismos de supervisión y control',
            '',
            '📜 CÓDIGO DE CONDUCTA:',
            '▸ Normas específicas de comportamiento',
            '▸ Prohibiciones expresas detalladas',
            '▸ Consecuencias por incumplimiento',
            '▸ Procedimiento de denuncias internas',
            '▸ Sistema de reconocimiento positivo',
            '',
            '🚨 PROTOCOLOS ESPECÍFICOS:',
            '▸ Protocolo de detección de maltrato',
            '▸ Protocolo de actuación en emergencias',
            '▸ Protocolo de comunicación con familias',
            '▸ Protocolo de derivación a servicios sociales',
            '▸ Protocolo de seguimiento post-incidente',
            '',
            '════════════════════════════════════════════════════════════',
            'FASE 4: FORMACIÓN DEL PERSONAL (Semanas 9-10)',
            '════════════════════════════════════════════════════════════',
            '',
            '👥 PROGRAMA DE FORMACIÓN ESCALONADO:',
            '',
            'NIVEL 1 - PERSONAL DIRECTO (20 horas):',
            '▸ Fundamentos de la protección infantil',
            '▸ Reconocimiento de indicadores de maltrato',
            '▸ Técnicas de comunicación con menores',
            '▸ Protocolos específicos de la organización',
            '▸ Simulacros y casos prácticos',
            '',
            'NIVEL 2 - PERSONAL OCASIONAL (8 horas):',
            '▸ Conceptos básicos LOPIVI',
            '▸ Código de conducta organizacional',
            '▸ Procedimientos de comunicación',
            '▸ Casos prácticos simplificados',
            '',
            'NIVEL 3 - DIRECTIVOS (30 horas):',
            '▸ Marco legal completo LOPIVI',
            '▸ Responsabilidades legales específicas',
            '▸ Gestión de crisis y comunicación',
            '▸ Supervisión y control de cumplimiento',
            '▸ Relaciones con autoridades competentes',
            '',
            '📊 EVALUACIÓN Y CERTIFICACIÓN:',
            '▸ Examen teórico-práctico',
            '▸ Evaluación de competencias',
            '▸ Certificado oficial de aprovechamiento',
            '▸ Registro en base de datos organizacional',
            '',
            '════════════════════════════════════════════════════════════',
            'FASE 5: IMPLEMENTACIÓN (Semanas 11-12)',
            '════════════════════════════════════════════════════════════',
            '',
            '🚀 PUESTA EN MARCHA:',
            '▸ Comunicación oficial a todo el personal',
            '▸ Distribución de documentación',
            '▸ Señalización de espacios y procedimientos',
            '▸ Activación de sistemas de comunicación',
            '▸ Inicio de registros y controles',
            '',
            '📈 MONITORIZACIÓN CONTINUA:',
            '▸ Revisiones semanales los primeros 2 meses',
            '▸ Revisiones mensuales posteriores',
            '▸ Auditorías internas trimestrales',
            '▸ Evaluación anual completa',
            '',
            '🔄 MEJORA CONTINUA:',
            '▸ Feedback del personal',
            '▸ Análisis de incidentes',
            '▸ Actualización de procedimientos',
            '▸ Formación de reciclaje anual',
            '',
            '════════════════════════════════════════════════════════════',
            'RECURSOS Y HERRAMIENTAS',
            '════════════════════════════════════════════════════════════',
            '',
            '💼 CUSTODIA360 - VENTAJAS COMPETITIVAS:',
            '▸ Implementación automatizada en 72 horas',
            '▸ Documentación generada automáticamente',
            '▸ Campus de formación online certificado',
            '▸ Panel de control en tiempo real',
            '▸ Alertas automáticas de vencimientos',
            '▸ Soporte jurídico especializado 24/7',
            '▸ Actualizaciones normativas automáticas',
            '',
            '📞 SOPORTE DURANTE LA IMPLEMENTACIÓN:',
            '▸ Consultor asignado personalizado',
            '▸ Reuniones de seguimiento semanales',
            '▸ Resolución de dudas en menos de 24h',
            '▸ Formación del delegado incluida',
            '▸ Revisión final de cumplimiento'
          ]
          break
        default:
          titulo = 'DOCUMENTACIÓN LOPIVI'
          contenido = ['Documento técnico especializado en cumplimiento LOPIVI']
      }

      doc.text(titulo, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setDrawColor(59, 130, 246)
      doc.setLineWidth(0.5)
      doc.line(20, yPosition, pageWidth - 20, yPosition)

      yPosition += 15

      contenido.forEach(linea => {
        checkPageBreak()

        if (linea === '') {
          yPosition += 5
          return
        }

        if (linea.startsWith('•') || linea.match(/^\d+\./)) {
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          doc.text(linea, 25, yPosition)
          yPosition += 6
        } else if (linea.toUpperCase() === linea && linea.length > 10) {
          doc.setFontSize(14)
          doc.setTextColor(59, 130, 246)
          doc.text(linea, 20, yPosition)
          yPosition += 8
        } else {
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          const splitText = doc.splitTextToSize(linea, pageWidth - 40)
          doc.text(splitText, 20, yPosition)
          yPosition += splitText.length * 4 + 3
        }
      })

      // Pie de página
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('Documento técnico - Custodia360', pageWidth / 2, pageHeight - 15, { align: 'center' })

      doc.save(`${tipo.replace('-', '_')}_Custodia360.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  const generarPDFFormulario = (tipo: string) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      let yPosition = 20

      // Encabezado
      doc.setFontSize(20)
      doc.setTextColor(34, 197, 94)
      doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 15

      let titulo = ''
      let campos: string[] = []

      switch (tipo) {
        case 'registro-incidentes':
          titulo = 'FORMULARIO DE REGISTRO DE INCIDENTES'
          campos = [
            'Fecha del incidente: _______________',
            'Hora aproximada: _______________',
            'Lugar del incidente: _______________',
            'Personas involucradas: _______________',
            'Testigos presentes: _______________',
            'Descripción detallada del incidente:',
            '________________________________________________',
            '________________________________________________',
            '________________________________________________',
            'Medidas inmediatas adoptadas:',
            '________________________________________________',
            'Comunicaciones realizadas:',
            '☐ Servicios de emergencia (112)',
            '☐ Delegado/a de protección',
            '☐ Familia del menor',
            '☐ Servicios sociales',
            '☐ Otros: _______________',
            'Seguimiento requerido:',
            '________________________________________________',
            'Firma del responsable: _______________',
            'Fecha de registro: _______________'
          ]
          break
        case 'comunicacion-familias':
          titulo = 'FORMULARIO DE COMUNICACIÓN A FAMILIAS'
          campos = [
            'Familia destinataria: _______________',
            'Menor afectado/a: _______________',
            'Tipo de comunicación:',
            '☐ Informativa general',
            '☐ Incidencia específica',
            '☐ Solicitud de colaboración',
            '☐ Seguimiento',
            'Canal de comunicación:',
            '☐ Presencial',
            '☐ Telefónica',
            '☐ Email',
            '☐ Carta certificada',
            'Asunto: _______________',
            'Mensaje:',
            '________________________________________________',
            '________________________________________________',
            'Respuesta recibida:',
            '________________________________________________',
            'Acciones a realizar:',
            '________________________________________________',
            'Responsable: _______________',
            'Fecha: _______________'
          ]
          break
        default:
          titulo = 'FORMULARIO LOPIVI'
          campos = ['Campo genérico: _______________']
      }

      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text(titulo, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 20

      campos.forEach(campo => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(10)
        if (campo.includes('☐')) {
          doc.text(campo, 25, yPosition)
        } else if (campo.includes('___')) {
          doc.text(campo, 20, yPosition)
        } else {
          doc.setFont('helvetica', 'bold')
          doc.text(campo, 20, yPosition)
          doc.setFont('helvetica', 'normal')
        }
        yPosition += 8
      })

      doc.save(`Formulario_${tipo.replace('-', '_')}.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  const generarPDFCertificacion = (tipo: string) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('l', 'mm', 'a4') // Horizontal para certificados
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 30

      // Marco decorativo
      doc.setDrawColor(168, 85, 247)
      doc.setLineWidth(2)
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30)

      // Título
      doc.setFontSize(28)
      doc.setTextColor(168, 85, 247)

      let titulo = ''
      let subtitulo = ''
      let contenido = ''

      switch (tipo) {
        case 'certificado-formacion':
          titulo = 'CERTIFICADO DE FORMACIÓN'
          subtitulo = 'PROTECCIÓN INFANTIL LOPIVI'
          contenido = 'Se certifica que ha completado satisfactoriamente el programa de formación en Protección Integral a la Infancia según la normativa LOPIVI'
          break
        case 'certificado-cumplimiento':
          titulo = 'CERTIFICADO DE CUMPLIMIENTO'
          subtitulo = 'LEY ORGÁNICA LOPIVI'
          contenido = 'Certifica el cumplimiento íntegro de todos los requisitos establecidos en la Ley Orgánica de Protección Integral a la Infancia'
          break
        default:
          titulo = 'CERTIFICADO LOPIVI'
          subtitulo = 'SISTEMA CUSTODIA360'
          contenido = 'Certificado oficial del sistema de protección infantil'
      }

      doc.text(titulo, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15
      doc.setFontSize(20)
      doc.text(subtitulo, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 30
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text('Por la presente se certifica que', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setFontSize(18)
      doc.setTextColor(59, 130, 246)
      doc.text('[NOMBRE DEL CERTIFICADO]', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      const splitContent = doc.splitTextToSize(contenido, pageWidth - 80)
      doc.text(splitContent, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 30
      doc.setFontSize(10)
      doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 8
      doc.text(`Válido hasta: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('es-ES')}`, pageWidth / 2, yPosition, { align: 'center' })

      doc.save(`Certificado_${tipo.replace('-', '_')}.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  const generarPDFNormativa = (tipo: string) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Encabezado
      doc.setFontSize(22)
      doc.setTextColor(239, 68, 68)
      doc.text('NORMATIVA LEGAL LOPIVI', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20

      let contenidoNormativo: string[] = []

      switch (tipo) {
        case 'ley-lopivi':
          contenidoNormativo = [
            'LEY ORGÁNICA 8/2021, de 4 de junio',
            'de protección integral a la infancia y la adolescencia frente a la violencia',
            '',
            'DISPOSICIONES GENERALES',
            'Artículo 1. Objeto de la Ley',
            'Esta Ley tiene por objeto garantizar los derechos fundamentales de la infancia y de la adolescencia a su integridad física, psíquica, psicológica y moral frente a cualquier forma de violencia.',
            '',
            'Artículo 2. Principios rectores',
            '1. Interés superior del menor',
            '2. No discriminación e igualdad',
            '3. Derecho a la vida, supervivencia y desarrollo',
            '4. Participación',
            '',
            'MEDIDAS DE PROTECCIÓN',
            'Artículo 35. Entidades deportivas y de ocio',
            'Las entidades deportivas y de ocio que desarrollen actividades dirigidas a menores de edad deberán tener entre su personal una figura de delegado o delegada de protección.',
            '',
            'RÉGIMEN SANCIONADOR',
            'Artículo 73. Infracciones muy graves',
            'Son infracciones muy graves el incumplimiento de las obligaciones establecidas en esta Ley que puedan poner en peligro grave la integridad física o psíquica de personas menores de edad.'
          ]
          break
        default:
          contenidoNormativo = ['Contenido normativo especializado']
      }

      contenidoNormativo.forEach(linea => {
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }

        if (linea === '') {
          yPosition += 5
          return
        }

        if (linea.startsWith('Artículo') || linea.toUpperCase() === linea) {
          doc.setFontSize(12)
          doc.setTextColor(239, 68, 68)
          doc.text(linea, 20, yPosition)
          yPosition += 8
        } else if (linea.match(/^\d+\./)) {
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          doc.text(linea, 25, yPosition)
          yPosition += 6
        } else {
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          const splitText = doc.splitTextToSize(linea, pageWidth - 40)
          doc.text(splitText, 20, yPosition)
          yPosition += splitText.length * 4 + 3
        }
      })

      doc.save(`Normativa_${tipo.replace('-', '_')}.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard Custodia360...</p>
        </div>
      </div>
    )
  }

  if (!sessionData || !metricas) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Acceso no autorizado</p>
          <Link href="/login" className="bg-orange-600 text-white px-4 py-2 rounded-lg">
            Volver al Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">Custodia360</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin: {sessionData?.nombre}</span>
              <button
                onClick={() => router.push('/')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entidades Activas</p>
                <p className="text-2xl font-bold text-green-600">{metricas.entidadesActivas}</p>
                <p className="text-xs text-gray-500">de {metricas.entidadesTotales} totales</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delegados Activos</p>
                <p className="text-2xl font-bold text-blue-600">{metricas.delegadosActivos}</p>
                <p className="text-xs text-gray-500">Certificados</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Facturación Mensual</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(metricas.facturacionMensual)}</p>
                <p className="text-xs text-gray-500">Promedio mensual</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Facturación Semestral</p>
                <p className="text-2xl font-bold text-indigo-600">{formatCurrency(metricas.facturacionMensual * 6)}</p>
                <p className="text-xs text-gray-500">Últimos 6 meses</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Facturación Anual</p>
                <p className="text-2xl font-bold text-teal-600">{formatCurrency(metricas.facturacionAnual)}</p>
                <p className="text-xs text-gray-500">Total año en curso</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sistema de Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'dashboard'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard General
              </button>
              <button
                onClick={() => setActiveTab('entidades')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'entidades'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Gestión Entidades
              </button>
              <button
                onClick={() => setActiveTab('documentacion')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'documentacion'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Documentación
              </button>
              <button
                onClick={() => setActiveTab('informes')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'informes'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Informes
              </button>
            </nav>
          </div>

          <div className="p-8">
            {/* Dashboard General */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen Ejecutivo</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-bold text-blue-800 mb-4">Crecimiento del Negocio</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Nuevas contrataciones (mes)</span>
                          <span className="font-bold text-blue-600">15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Tasa de crecimiento</span>
                          <span className="font-bold text-green-600">+12.8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Retención de clientes</span>
                          <span className="font-bold text-green-600">94.2%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-bold text-green-800 mb-4">Distribución por Planes</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Plan 50 (1-50 menores)</span>
                          <span className="font-bold">23 entidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Plan 200 (51-200 menores)</span>
                          <span className="font-bold">45 entidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Plan 500 (201-500 menores)</span>
                          <span className="font-bold">34 entidades</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Últimas Contrataciones</h3>
                  <div className="space-y-4">
                    {entidades.slice(0, 3).map((entidad) => (
                      <div key={entidad.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{entidad.nombre}</h4>
                            <p className="text-sm text-gray-600">{entidad.plan} • {entidad.numeroMenores} menores</p>
                            <p className="text-xs text-gray-500">Contratado: {formatDate(entidad.fechaContratacion)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">{formatCurrency(entidad.importeTotal)}</p>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getEstadoColor(entidad.estado)}`}>
                              {entidad.estado}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Gestión Entidades */}
            {activeTab === 'entidades' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">Gestión de Entidades</h3>

                {/* Resumen numérico */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <h4 className="font-bold text-green-800 mb-2">Entidades Activas</h4>
                    <p className="text-4xl font-bold text-green-600">{entidades.filter(e => e.estado === 'activo').length}</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h4 className="font-bold text-red-800 mb-2">Entidades Inactivas</h4>
                    <p className="text-4xl font-bold text-red-600">{entidades.filter(e => e.estado !== 'activo').length}</p>
                  </div>
                </div>

                {/* Selector de entidad individual */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-bold text-gray-900">Acceso Individual a Entidades</h4>
                    <button
                      onClick={() => setActiveTab('listado-completo')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ver Listado Completo A-Z
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Entidad</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          if (e.target.value) {
                            const entidad = entidades.find(ent => ent.id === e.target.value)
                            if (entidad) {
                              setEntidadSeleccionada(entidad)
                            }
                          }
                        }}
                      >
                        <option value="">-- Seleccionar entidad --</option>
                        {entidades.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((entidad) => (
                          <option key={entidad.id} value={entidad.id}>{entidad.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Información de entidad seleccionada */}
                {entidadSeleccionada && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">Información de {entidadSeleccionada.nombre}</h4>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Datos Generales</h5>
                        <div className="space-y-2 text-sm">
                          <p><strong>Nombre:</strong> {entidadSeleccionada.nombre}</p>
                          <p><strong>Plan:</strong> {entidadSeleccionada.plan}</p>
                          <p><strong>Menores:</strong> {entidadSeleccionada.numeroMenores}</p>
                          <p><strong>Contratado:</strong> {formatDate(entidadSeleccionada.fechaContratacion)}</p>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(entidadSeleccionada.estado)}`}>
                            {entidadSeleccionada.estado}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Delegado Responsable</h5>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p><strong>Principal:</strong> {entidadSeleccionada.delegadoPrincipal}</p>
                          <p><strong>Email:</strong> {entidadSeleccionada.emailContratante}</p>
                          <p><strong>Estado:</strong> <span className="text-green-600">Certificado</span></p>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Información Financiera</h5>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p><strong>Importe mensual:</strong> {formatCurrency(entidadSeleccionada.importeTotal)}</p>
                          <p><strong>Estado pago:</strong> <span className="text-green-600">Al día</span></p>
                          <p><strong>Próxima factura:</strong> {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('es-ES')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => setShowGenerarInformeModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Generar Informe
                      </button>
                      <button
                        onClick={() => setShowEnviarComunicacionModal(true)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                      >
                        Enviar Comunicación
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Listado Completo */}
            {activeTab === 'listado-completo' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Listado Completo de Entidades (A-Z)</h3>
                  <button
                    onClick={() => setActiveTab('entidades')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    ← Volver a Gestión
                  </button>
                </div>

                <div className="space-y-4">
                  {entidades.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((entidad) => (
                    <div key={entidad.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">{entidad.nombre}</h4>
                          <div className="space-y-1 text-sm">
                            <p><strong>Plan:</strong> {entidad.plan}</p>
                            <p><strong>Menores:</strong> {entidad.numeroMenores}</p>
                            <p><strong>Contratado:</strong> {formatDate(entidad.fechaContratacion)}</p>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(entidad.estado)}`}>
                              {entidad.estado}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Delegado</h5>
                          <div className="space-y-1 text-sm text-gray-700">
                            <p><strong>Principal:</strong> {entidad.delegadoPrincipal}</p>
                            <p><strong>Email:</strong> {entidad.emailContratante}</p>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Información Financiera</h5>
                          <div className="space-y-1 text-sm text-gray-700">
                            <p><strong>Importe:</strong> {formatCurrency(entidad.importeTotal)}</p>
                            <p><strong>Estado:</strong> <span className={getEstadoColor(entidad.estado).includes('green') ? 'text-green-600' : entidad.estado === 'pendiente' ? 'text-yellow-600' : 'text-red-600'}>{entidad.estado}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documentación */}
            {activeTab === 'documentacion' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">Centro de Documentación LOPIVI</h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Guías Oficiales */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-bold text-blue-800 mb-4">Guías Oficiales</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Manual LOPIVI Completo</span>
                        <button
                          onClick={() => generarPDFGuiaOficial('manual-lopivi')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Protocolo de Actuación</span>
                        <button
                          onClick={() => generarPDFGuiaOficial('protocolo-actuacion')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Guía de Implementación</span>
                        <button
                          onClick={() => generarPDFGuiaOficial('guia-implementacion')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">FAQ Delegados</span>
                        <button
                          onClick={() => generarPDFGuiaOficial('faq-delegados')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Formularios */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-bold text-green-800 mb-4">Formularios</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Registro de Incidentes</span>
                        <button
                          onClick={() => generarPDFFormulario('registro-incidentes')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Comunicación a Familias</span>
                        <button
                          onClick={() => generarPDFFormulario('comunicacion-familias')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Evaluación de Riesgos</span>
                        <button
                          onClick={() => generarPDFFormulario('evaluacion-riesgos')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Plan de Mejora</span>
                        <button
                          onClick={() => generarPDFFormulario('plan-mejora')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Certificaciones */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="font-bold text-purple-800 mb-4">Certificaciones</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Certificado de Formación</span>
                        <button
                          onClick={() => generarPDFCertificacion('certificado-formacion')}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Generar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Certificado de Cumplimiento</span>
                        <button
                          onClick={() => generarPDFCertificacion('certificado-cumplimiento')}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Generar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Diploma Delegado</span>
                        <button
                          onClick={() => generarPDFCertificacion('diploma-delegado')}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Generar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Acreditación Entidad</span>
                        <button
                          onClick={() => generarPDFCertificacion('acreditacion-entidad')}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Generar PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Normativa Legal */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h4 className="font-bold text-orange-800 mb-4">Normativa Legal</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Ley Orgánica LOPIVI</span>
                        <button
                          onClick={() => generarPDFNormativa('ley-lopivi')}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Real Decreto desarrollo</span>
                        <button
                          onClick={() => generarPDFNormativa('real-decreto')}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Instrucciones autonómicas</span>
                        <button
                          onClick={() => generarPDFNormativa('instrucciones-autonomicas')}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Jurisprudencia relevante</span>
                        <button
                          onClick={() => generarPDFNormativa('jurisprudencia')}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informes */}
            {activeTab === 'informes' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Centro de Informes y Analíticas</h3>
                  <button
                    onClick={() => setShowInformePersonalizadoModal(true)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Generar Informe Personalizado
                  </button>
                </div>

                {/* Informes Ejecutivos - SIN ICONOS */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-6">Informes Ejecutivos</h4>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-medium text-blue-800 mb-3">Informe Mensual</h5>
                      <p className="text-sm text-gray-600 mb-4">Estado general de todas las entidades y métricas de cumplimiento</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Último: Enero 2025</span>
                        <button
                          onClick={() => mostrarInformeEnModal('mensual')}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Descargar
                        </button>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="font-medium text-green-800 mb-3">Informe Trimestral</h5>
                      <p className="text-sm text-gray-600 mb-4">Análisis de tendencias y evolución del cumplimiento LOPIVI</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Último: Q4 2024</span>
                        <button
                          onClick={() => mostrarInformeEnModal('trimestral')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Descargar
                        </button>
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h5 className="font-medium text-purple-800 mb-3">Informe Anual</h5>
                      <p className="text-sm text-gray-600 mb-4">Resumen ejecutivo completo del año con proyecciones</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Último: 2024</span>
                        <button
                          onClick={() => mostrarInformeEnModal('anual')}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                        >
                          Descargar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analíticas de Cumplimiento - SIN ICONOS */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-6">Analíticas de Cumplimiento</h4>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-4">Estado por Entidades</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Cumplimiento completo</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '89%'}}></div>
                            </div>
                            <span className="text-sm font-medium text-green-600">89%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">En proceso</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-yellow-600 h-2 rounded-full" style={{width: '8%'}}></div>
                            </div>
                            <span className="text-sm font-medium text-yellow-600">8%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Incompleto</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-red-600 h-2 rounded-full" style={{width: '3%'}}></div>
                            </div>
                            <span className="text-sm font-medium text-red-600">3%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-800 mb-4">Delegados Activos</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Principales certificados</span>
                          <span className="text-sm font-medium text-blue-600">247</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Suplentes certificados</span>
                          <span className="text-sm font-medium text-green-600">189</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Renovaciones pendientes</span>
                          <span className="text-sm font-medium text-orange-600">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Formaciones en curso</span>
                          <span className="text-sm font-medium text-purple-600">34</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informes por Entidad - SIN ICONOS, SIN AUDITORÍA */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-6">Informes por Entidad</h4>

                  <div className="space-y-4">
                    {entidades.slice(0, 5).map((entidad) => (
                      <div key={entidad.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">{entidad.nombre}</h5>
                          <p className="text-sm text-gray-600">Plan {entidad.plan} • {entidad.numeroMenores} menores</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => mostrarInformeCompleto(entidad)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            Informe Completo
                          </button>
                          <button
                            onClick={() => mostrarCertificado(entidad)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Certificado
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Métricas Avanzadas */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">📊 Métricas de Negocio</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">MRR (Monthly Recurring Revenue)</span>
                        <span className="text-lg font-bold text-green-600">{formatCurrency(metricas.facturacionMensual)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">ARR (Annual Recurring Revenue)</span>
                        <span className="text-lg font-bold text-blue-600">{formatCurrency(metricas.facturacionAnual)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Churn Rate</span>
                        <span className="text-lg font-bold text-red-600">2.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">LTV (Customer Lifetime Value)</span>
                        <span className="text-lg font-bold text-purple-600">€4,250</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">⚡ Métricas Operativas</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tiempo medio implementación</span>
                        <span className="text-lg font-bold text-green-600">2.3 días</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Satisfacción del cliente</span>
                        <span className="text-lg font-bold text-blue-600">4.8/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tickets de soporte/mes</span>
                        <span className="text-lg font-bold text-orange-600">23</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Uptime del sistema</span>
                        <span className="text-lg font-bold text-green-600">99.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Generar Informe */}
      {showGenerarInformeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-green-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Generar Informe de Entidad</h3>
                  <p className="opacity-90">Selecciona el tipo de informe para: {entidadSeleccionada?.nombre}</p>
                </div>
                <button
                  onClick={() => setShowGenerarInformeModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Informes Básicos */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Informes Básicos</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg p-4 transition-colors">
                      <h5 className="font-medium text-blue-800">📊 Informe de Cumplimiento</h5>
                      <p className="text-sm text-gray-600">Estado actual de cumplimiento LOPIVI</p>
                    </button>
                    <button className="w-full text-left bg-gray-50 hover:bg-green-50 border border-gray-200 rounded-lg p-4 transition-colors">
                      <h5 className="font-medium text-green-800">👥 Informe de Personal</h5>
                      <p className="text-sm text-gray-600">Estado de formación del equipo</p>
                    </button>
                    <button className="w-full text-left bg-gray-50 hover:bg-purple-50 border border-gray-200 rounded-lg p-4 transition-colors">
                      <h5 className="font-medium text-purple-800">🗂️ Informe de Documentación</h5>
                      <p className="text-sm text-gray-600">Estado de documentos y protocolos</p>
                    </button>
                  </div>
                </div>

                {/* Informes Avanzados */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Informes Avanzados</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left bg-gray-50 hover:bg-orange-50 border border-gray-200 rounded-lg p-4 transition-colors">
                      <h5 className="font-medium text-orange-800">📈 Informe Mensual</h5>
                      <p className="text-sm text-gray-600">Resumen mensual de actividad</p>
                    </button>
                    <button className="w-full text-left bg-gray-50 hover:bg-red-50 border border-gray-200 rounded-lg p-4 transition-colors">
                      <h5 className="font-medium text-red-800">⚠️ Informe de Incidencias</h5>
                      <p className="text-sm text-gray-600">Casos reportados y resoluciones</p>
                    </button>
                    <button className="w-full text-left bg-gray-50 hover:bg-teal-50 border border-gray-200 rounded-lg p-4 transition-colors">
                      <h5 className="font-medium text-teal-800">📋 Informe Ejecutivo</h5>
                      <p className="text-sm text-gray-600">Resumen completo para dirección</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setShowGenerarInformeModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Generar Informe Seleccionado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Enviar Comunicación */}
      {showEnviarComunicacionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Enviar Comunicación</h3>
                  <p className="opacity-90">Gestionar comunicaciones con: {entidadSeleccionada?.nombre}</p>
                </div>
                <button
                  onClick={() => setShowEnviarComunicacionModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Destinatarios */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Destinatarios</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" checked className="rounded border-gray-300 text-purple-600 mr-3" />
                      <span className="text-gray-700">Delegado Principal ({entidadSeleccionada?.delegadoPrincipal})</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 mr-3" />
                      <span className="text-gray-700">Delegado Suplente</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 mr-3" />
                      <span className="text-gray-700">Administrador Entidad</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 mr-3" />
                      <span className="text-gray-700">Todo el Personal</span>
                    </label>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-4 mt-6">Tipo de Comunicación</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="tipo" className="text-purple-600 mr-3" />
                      <span className="text-gray-700">Recordatorio de Formación</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="tipo" className="text-purple-600 mr-3" />
                      <span className="text-gray-700">Actualización Normativa</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="tipo" className="text-purple-600 mr-3" />
                      <span className="text-gray-700">Comunicación Personalizada</span>
                    </label>
                  </div>
                </div>

                {/* Contenido del Mensaje */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Contenido del Mensaje</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Asunto del mensaje"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                      <textarea
                        rows={8}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Escribe tu mensaje aquí..."
                      ></textarea>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h5 className="font-medium text-purple-800 mb-2">📧 Vista Previa</h5>
                      <p className="text-purple-700 text-sm">
                        El mensaje será enviado desde: admin@custodia360.com<br/>
                        Con copia a: soporte@custodia360.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setShowEnviarComunicacionModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <div className="flex gap-3">
                  <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    Guardar Borrador
                  </button>
                  <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Enviar Comunicación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Viewer de Informes */}
      {showInformeViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Informe {tipoInformeViewer.charAt(0).toUpperCase() + tipoInformeViewer.slice(1)}</h3>
                  <p className="opacity-90">Vista previa del informe generado</p>
                </div>
                <button
                  onClick={() => setShowInformeViewer(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">CUSTODIA360 - INFORME {tipoInformeViewer.toUpperCase()}</h4>
                <p className="text-sm text-gray-600 mb-4">Fecha: {new Date().toLocaleDateString('es-ES')}</p>

                {tipoInformeViewer === 'mensual' && (
                  <div className="space-y-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">RESUMEN EJECUTIVO</h5>
                      <p>• Entidades activas: {metricas?.entidadesActivas || 0}</p>
                      <p>• Delegados certificados: {metricas?.delegadosActivos || 0}</p>
                      <p>• Facturación mensual: {formatCurrency(metricas?.facturacionMensual || 0)}</p>
                      <p>• Tasa de cumplimiento: 94.2%</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">MÉTRICAS OPERATIVAS</h5>
                      <p>• Nuevas contrataciones: 15</p>
                      <p>• Renovaciones completadas: 8</p>
                      <p>• Formaciones realizadas: 23</p>
                    </div>
                  </div>
                )}

                {tipoInformeViewer === 'trimestral' && (
                  <div className="space-y-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">RESUMEN DEL TRIMESTRE</h5>
                      <p>• Crecimiento de entidades: +18.5%</p>
                      <p>• Retención de clientes: 96.1%</p>
                      <p>• Satisfacción promedio: 4.8/5</p>
                      <p>• Ingresos del trimestre: {formatCurrency((metricas?.facturacionMensual || 0) * 3)}</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">ANÁLISIS DE TENDENCIAS</h5>
                      <p>• Mayor adopción en sector deportivo</p>
                      <p>• Incremento en formaciones especializadas</p>
                      <p>• Reducción de incidencias en 23%</p>
                    </div>
                  </div>
                )}

                {tipoInformeViewer === 'anual' && (
                  <div className="space-y-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">LOGROS DEL AÑO</h5>
                      <p>• Crecimiento total: +45%</p>
                      <p>• Entidades incorporadas: 47 nuevas</p>
                      <p>• Delegados formados: 156</p>
                      <p>• Ingresos anuales: {formatCurrency(metricas?.facturacionAnual || 0)}</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">IMPACTO SOCIAL</h5>
                      <p>• Más de 12.000 menores protegidos</p>
                      <p>• 247 delegados certificados activos</p>
                      <p>• 98.5% de tasa de prevención de incidencias</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowInformeViewer(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => generarPDF(tipoInformeViewer, `Informe ${tipoInformeViewer.charAt(0).toUpperCase() + tipoInformeViewer.slice(1)}`)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Descargar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Informe Personalizado */}
      {showInformePersonalizadoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-orange-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Generar Informe Personalizado</h3>
                  <p className="opacity-90">Selecciona las opciones para tu informe personalizado</p>
                </div>
                <button
                  onClick={() => setShowInformePersonalizadoModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Seleccionar Entidad</h4>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 mb-4">
                    <option value="">-- Seleccionar entidad --</option>
                    {entidades.map((entidad) => (
                      <option key={entidad.id} value={entidad.id}>{entidad.nombre}</option>
                    ))}
                    <option value="todas">Todas las entidades</option>
                  </select>

                  <h4 className="text-lg font-bold text-gray-900 mb-4">Período</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="periodo" className="text-orange-600 mr-3" />
                      <span>Último mes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="periodo" className="text-orange-600 mr-3" />
                      <span>Último trimestre</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="periodo" className="text-orange-600 mr-3" />
                      <span>Último año</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="periodo" className="text-orange-600 mr-3" />
                      <span>Personalizado</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Secciones a incluir</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 mr-3" />
                      <span>Datos generales de la entidad</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 mr-3" />
                      <span>Estado de cumplimiento LOPIVI</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 mr-3" />
                      <span>Información de delegados</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 mr-3" />
                      <span>Formaciones realizadas</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 mr-3" />
                      <span>Incidencias y resoluciones</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 mr-3" />
                      <span>Métricas de rendimiento</span>
                    </label>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-4 mt-6">Formato</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="formato" defaultChecked className="text-orange-600 mr-3" />
                      <span>PDF Ejecutivo</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="formato" className="text-orange-600 mr-3" />
                      <span>PDF Detallado</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="formato" className="text-orange-600 mr-3" />
                      <span>Excel con datos</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setShowInformePersonalizadoModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      alert('Informe personalizado generado y descargado')
                      setShowInformePersonalizadoModal(false)
                    }}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Generar y Descargar
                  </button>
                  <button
                    onClick={() => {
                      alert('Informe personalizado enviado por email')
                      setShowInformePersonalizadoModal(false)
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Generar y Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Informe Completo de Entidad */}
      {showInformeCompletoModal && entidadInformeCompleto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Informe Completo</h3>
                  <p className="opacity-90">{entidadInformeCompleto.nombre}</p>
                </div>
                <button
                  onClick={() => setShowInformeCompletoModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">INFORME COMPLETO DE CUMPLIMIENTO LOPIVI</h4>

                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h5 className="font-medium mb-2">DATOS DE LA ENTIDAD</h5>
                    <p>• Nombre: {entidadInformeCompleto.nombre}</p>
                    <p>• Plan contratado: {entidadInformeCompleto.plan}</p>
                    <p>• Número de menores: {entidadInformeCompleto.numeroMenores}</p>
                    <p>• Estado: {entidadInformeCompleto.estado}</p>
                    <p>• Fecha contratación: {formatDate(entidadInformeCompleto.fechaContratacion)}</p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">DELEGADO RESPONSABLE</h5>
                    <p>• Delegado principal: {entidadInformeCompleto.delegadoPrincipal}</p>
                    <p>• Email de contacto: {entidadInformeCompleto.emailContratante}</p>
                    <p>• Estado certificación: Vigente</p>
                    <p>• Última formación: Enero 2025</p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">CUMPLIMIENTO LOPIVI</h5>
                    <p>• Estado general: CONFORME</p>
                    <p>• Protocolos implementados: SÍ</p>
                    <p>• Personal formado: 100%</p>
                    <p>• Documentación: COMPLETA</p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">FACTURACIÓN</h5>
                    <p>• Importe mensual: {formatCurrency(entidadInformeCompleto.importeTotal)}</p>
                    <p>• Estado pagos: AL DÍA</p>
                    <p>• Próximo pago: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('es-ES')}</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">✓ Esta entidad cumple íntegramente con todos los requisitos establecidos en la LOPIVI</p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowInformeCompletoModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => generarInformeEntidad(entidadInformeCompleto, 'completo')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Descargar PDF
                  </button>
                  <button
                    onClick={() => enviarDocumentoPorEmail('informe completo', entidadInformeCompleto)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Enviar por Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Certificado de Entidad */}
      {showCertificadoModal && entidadInformeCompleto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-green-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Certificado de Cumplimiento</h3>
                  <p className="opacity-90">{entidadInformeCompleto.nombre}</p>
                </div>
                <button
                  onClick={() => setShowCertificadoModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-8 text-center">
                <div className="mb-6">
                  <h4 className="text-3xl font-bold text-green-800 mb-2">CERTIFICADO DE CUMPLIMIENTO</h4>
                  <h5 className="text-xl font-semibold text-blue-800">LEY ORGÁNICA LOPIVI</h5>
                </div>

                <div className="mb-8">
                  <p className="text-lg mb-4">Por la presente se certifica que</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{entidadInformeCompleto.nombre}</h3>
                  <p className="text-base text-gray-700 mb-6">
                    cumple íntegramente con todos los requisitos establecidos en la Ley Orgánica 8/2021,
                    de 4 de junio, de protección integral a la infancia y la adolescencia frente a la violencia (LOPIVI).
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
                  <div className="space-y-2">
                    <p className="text-green-600 font-medium">✓ Delegado de Protección certificado</p>
                    <p className="text-green-600 font-medium">✓ Personal formado según normativa</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-green-600 font-medium">✓ Protocolos de actuación implementados</p>
                    <p className="text-green-600 font-medium">✓ Documentación completa y actualizada</p>
                  </div>
                </div>

                <div className="border-t border-green-200 pt-6">
                  <p className="text-lg font-bold text-red-600 mb-2">VÁLIDO PARA INSPECCIONES OFICIALES</p>
                  <p className="text-sm text-gray-600">Fecha de emisión: {new Date().toLocaleDateString('es-ES')}</p>
                  <p className="text-sm text-gray-600">Válido hasta: {new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('es-ES')}</p>
                </div>

                <div className="mt-6 text-xs text-gray-500">
                  Custodia360 - Certificación oficial LOPIVI
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setShowCertificadoModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => generarInformeEntidad(entidadInformeCompleto, 'certificado')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Descargar PDF
                  </button>
                  <button
                    onClick={() => enviarDocumentoPorEmail('certificado', entidadInformeCompleto)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Enviar por Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Informe Personalizado */}
      {showInformePersonalizadoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-orange-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Generar Informe Personalizado</h3>
                  <p className="opacity-90">Selecciona las opciones para tu informe personalizado</p>
                </div>
                <button
                  onClick={() => setShowInformePersonalizadoModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Seleccionar Entidad</h4>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 mb-4">
                    <option value="">-- Seleccionar entidad --</option>
                    {entidades.map((entidad) => (
                      <option key={entidad.id} value={entidad.id}>{entidad.nombre}</option>
                    ))}
                    <option value="todas">Todas las entidades</option>
                  </select>

                  <h4 className="text-lg font-bold text-gray-900 mb-4">Período</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="periodo" className="text-orange-600 mr-3" />
                      <span>Último mes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="periodo" className="text-orange-600 mr-3" />
                      <span>Último trimestre</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="periodo" className="text-orange-600 mr-3" />
                      <span>Último año</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="periodo" className="text-orange-600 mr-3" />
                      <span>Personalizado</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Secciones a incluir</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 mr-3" />
                      <span>Datos generales de la entidad</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 mr-3" />
                      <span>Estado de cumplimiento LOPIVI</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 mr-3" />
                      <span>Información de delegados</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 mr-3" />
                      <span>Formaciones realizadas</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 mr-3" />
                      <span>Incidencias y resoluciones</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 mr-3" />
                      <span>Métricas de rendimiento</span>
                    </label>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-4 mt-6">Formato</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="formato" defaultChecked className="text-orange-600 mr-3" />
                      <span>PDF Ejecutivo</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="formato" className="text-orange-600 mr-3" />
                      <span>PDF Detallado</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="formato" className="text-orange-600 mr-3" />
                      <span>Excel con datos</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setShowInformePersonalizadoModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      alert('Informe personalizado generado y descargado')
                      setShowInformePersonalizadoModal(false)
                    }}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Generar y Descargar
                  </button>
                  <button
                    onClick={() => {
                      alert('Informe personalizado enviado por email')
                      setShowInformePersonalizadoModal(false)
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Generar y Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Informe Completo de Entidad */}
      {showInformeCompletoModal && entidadInformeCompleto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Informe Completo</h3>
                  <p className="opacity-90">{entidadInformeCompleto.nombre}</p>
                </div>
                <button
                  onClick={() => setShowInformeCompletoModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">INFORME COMPLETO DE CUMPLIMIENTO LOPIVI</h4>

                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h5 className="font-medium mb-2">DATOS DE LA ENTIDAD</h5>
                    <p>• Nombre: {entidadInformeCompleto.nombre}</p>
                    <p>• Plan contratado: {entidadInformeCompleto.plan}</p>
                    <p>• Número de menores: {entidadInformeCompleto.numeroMenores}</p>
                    <p>• Estado: {entidadInformeCompleto.estado}</p>
                    <p>• Fecha contratación: {formatDate(entidadInformeCompleto.fechaContratacion)}</p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">DELEGADO RESPONSABLE</h5>
                    <p>• Delegado principal: {entidadInformeCompleto.delegadoPrincipal}</p>
                    <p>• Email de contacto: {entidadInformeCompleto.emailContratante}</p>
                    <p>• Estado certificación: Vigente</p>
                    <p>• Última formación: Enero 2025</p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">CUMPLIMIENTO LOPIVI</h5>
                    <p>• Estado general: CONFORME</p>
                    <p>• Protocolos implementados: SÍ</p>
                    <p>• Personal formado: 100%</p>
                    <p>• Documentación: COMPLETA</p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">FACTURACIÓN</h5>
                    <p>• Importe mensual: {formatCurrency(entidadInformeCompleto.importeTotal)}</p>
                    <p>• Estado pagos: AL DÍA</p>
                    <p>• Próximo pago: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('es-ES')}</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">✓ Esta entidad cumple íntegramente con todos los requisitos establecidos en la LOPIVI</p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowInformeCompletoModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => generarInformeEntidad(entidadInformeCompleto, 'completo')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Descargar PDF
                  </button>
                  <button
                    onClick={() => enviarDocumentoPorEmail('informe completo', entidadInformeCompleto)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Enviar por Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Certificado de Entidad */}
      {showCertificadoModal && entidadInformeCompleto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-green-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Certificado de Cumplimiento</h3>
                  <p className="opacity-90">{entidadInformeCompleto.nombre}</p>
                </div>
                <button
                  onClick={() => setShowCertificadoModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-8 text-center">
                <div className="mb-6">
                  <h4 className="text-3xl font-bold text-green-800 mb-2">CERTIFICADO DE CUMPLIMIENTO</h4>
                  <h5 className="text-xl font-semibold text-blue-800">LEY ORGÁNICA LOPIVI</h5>
                </div>

                <div className="mb-8">
                  <p className="text-lg mb-4">Por la presente se certifica que</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{entidadInformeCompleto.nombre}</h3>
                  <p className="text-base text-gray-700 mb-6">
                    cumple íntegramente con todos los requisitos establecidos en la Ley Orgánica 8/2021,
                    de 4 de junio, de protección integral a la infancia y la adolescencia frente a la violencia (LOPIVI).
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
                  <div className="space-y-2">
                    <p className="text-green-600 font-medium">✓ Delegado de Protección certificado</p>
                    <p className="text-green-600 font-medium">✓ Personal formado según normativa</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-green-600 font-medium">✓ Protocolos de actuación implementados</p>
                    <p className="text-green-600 font-medium">✓ Documentación completa y actualizada</p>
                  </div>
                </div>

                <div className="border-t border-green-200 pt-6">
                  <p className="text-lg font-bold text-red-600 mb-2">VÁLIDO PARA INSPECCIONES OFICIALES</p>
                  <p className="text-sm text-gray-600">Fecha de emisión: {new Date().toLocaleDateString('es-ES')}</p>
                  <p className="text-sm text-gray-600">Válido hasta: {new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('es-ES')}</p>
                </div>

                <div className="mt-6 text-xs text-gray-500">
                  Custodia360 - Certificación oficial LOPIVI
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setShowCertificadoModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => generarInformeEntidad(entidadInformeCompleto, 'certificado')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Descargar PDF
                  </button>
                  <button
                    onClick={() => enviarDocumentoPorEmail('certificado', entidadInformeCompleto)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Enviar por Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
