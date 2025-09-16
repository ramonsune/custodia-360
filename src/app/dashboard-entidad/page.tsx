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
    const session = checkSession()
    if (!session || session.tipo !== 'contratante') {
      router.push('/login')
      return
    }

    setSessionData(session)

    // Datos simulados más detallados basados en la sesión
    const entidadInfo: EntidadData = {
      nombre: session.entidad,
      plan: session.entidad.includes('Academia') ? 'Plan 200' : 'Plan 500',
      cumplimiento: session.entidad.includes('Nuevo') ? 45.5 : 87.5,
      alertas: session.entidad.includes('Nuevo') ? 5 : 2,
      delegadoPrincipal: {
        nombre: session.entidad.includes('Academia') ? 'Carlos Ruiz Sánchez' : 'Juan García Rodríguez',
        email: session.entidad.includes('Academia') ? 'carlos@academia.com' : 'juan@custodia360.com',
        telefono: session.entidad.includes('Academia') ? '+34 654 321 987' : '+34 612 345 678',
        certificado: !session.entidad.includes('Nuevo'),
        ultimaActividad: session.entidad.includes('Nuevo') ? '2024-01-18 14:30:00' : '2024-01-20 16:45:00'
      },
      delegadoSuplente: session.entidad.includes('Nuevo') ? undefined : {
        nombre: 'María López Martín',
        email: 'maria@custodia360.com',
        telefono: '+34 687 654 321',
        certificado: true
      },
      estadoImplementacion: {
        configuracion: true,
        delegadoAsignado: true,
        formacionProgreso: session.entidad.includes('Nuevo') ? 45 : 87,
        validacionFinal: !session.entidad.includes('Nuevo')
      },
      proximasAcciones: session.entidad.includes('Nuevo') ? [
        'Completar formación del delegado principal',
        'Asignar delegado suplente (recomendado)',
        'Formar al personal restante (8 personas)',
        'Programar validación final'
      ] : [
        'Renovar certificación de María López (caduca en 15 días)',
        'Actualizar documentos de 4 familias',
        'Revisar protocolo de actuación trimestral'
      ]
    }

    setEntidadData(entidadInfo)
  }, [router])

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

  // Funciones de generación de PDFs
  const generarPlanProteccion = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Encabezado
    doc.setFontSize(24)
    doc.setTextColor(234, 88, 12)
    doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text('PLAN DE PROTECCIÓN INTEGRAL', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(entidadData.nombre, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setDrawColor(234, 88, 12)
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, pageWidth - 20, yPosition)

    // Información de la entidad
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('1. DATOS DE LA ENTIDAD', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text(`Nombre: ${entidadData.nombre}`, 25, yPosition)
    yPosition += 7
    doc.text(`Plan contratado: ${entidadData.plan}`, 25, yPosition)
    yPosition += 7
    doc.text(`Fecha de implementación: ${new Date().toLocaleDateString('es-ES')}`, 25, yPosition)
    yPosition += 7
    doc.text(`Estado de cumplimiento: ${entidadData.cumplimiento}%`, 25, yPosition)

    // Delegados
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('2. DELEGADOS DE PROTECCIÓN', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text('Delegado Principal:', 25, yPosition)
    yPosition += 7
    doc.text(`- Nombre: ${entidadData.delegadoPrincipal.nombre}`, 30, yPosition)
    yPosition += 7
    doc.text(`- Email: ${entidadData.delegadoPrincipal.email}`, 30, yPosition)
    yPosition += 7
    doc.text(`- Estado: ${entidadData.delegadoPrincipal.certificado ? 'Certificado' : 'En formación'}`, 30, yPosition)

    if (entidadData.delegadoSuplente) {
      yPosition += 10
      doc.text('Delegado Suplente:', 25, yPosition)
      yPosition += 7
      doc.text(`- Nombre: ${entidadData.delegadoSuplente.nombre}`, 30, yPosition)
      yPosition += 7
      doc.text(`- Email: ${entidadData.delegadoSuplente.email}`, 30, yPosition)
      yPosition += 7
      doc.text(`- Estado: ${entidadData.delegadoSuplente.certificado ? 'Certificado' : 'En formación'}`, 30, yPosition)
    }

    // Protocolos
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('3. PROTOCOLOS DE ACTUACIÓN', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    const protocolos = [
      'Protocolo de detección de situaciones de riesgo',
      'Protocolo de actuación ante sospechas de maltrato',
      'Protocolo de comunicación con autoridades',
      'Protocolo de atención inmediata a víctimas',
      'Protocolo de comunicación con familias',
      'Protocolo de seguimiento de casos'
    ]

    protocolos.forEach(protocolo => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(`• ${protocolo}`, 25, yPosition)
      yPosition += 7
    })

    // Medidas de protección
    yPosition += 10
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('4. MEDIDAS DE PROTECCIÓN IMPLEMENTADAS', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    const medidas = [
      'Sistema de supervisión continua de actividades',
      'Formación obligatoria para todo el personal',
      'Código de conducta profesional establecido',
      'Canal de denuncias confidencial activo',
      'Evaluaciones periódicas de riesgo',
      'Coordinación con servicios sociales'
    ]

    medidas.forEach(medida => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(`✓ ${medida}`, 25, yPosition)
      yPosition += 7
    })

    // Pie de página
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text('Documento generado por Custodia360', pageWidth / 2, pageHeight - 10, { align: 'center' })

    doc.save(`Plan_Proteccion_${entidadData.nombre.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`)
  }

  const generarInformeEjecutivo = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Encabezado
    doc.setFontSize(24)
    doc.setTextColor(234, 88, 12)
    doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.text('INFORME EJECUTIVO LOPIVI', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(`${entidadData.nombre}`, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 5
    doc.setFontSize(10)
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, yPosition, { align: 'center' })

    // Resumen ejecutivo
    yPosition += 20
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('RESUMEN EJECUTIVO', 25, yPosition)

    yPosition += 10
    doc.setFontSize(12)
    doc.text(`Estado LOPIVI: ${entidadData.cumplimiento >= 80 ? 'CUMPLIENDO' : 'EN IMPLEMENTACIÓN'}`, 25, yPosition)
    yPosition += 7
    doc.text(`Nivel de cumplimiento: ${entidadData.cumplimiento}%`, 25, yPosition)
    yPosition += 7
    doc.text(`Plan contratado: ${entidadData.plan}`, 25, yPosition)
    yPosition += 7
    doc.text(`Delegado Principal: ${entidadData.delegadoPrincipal.nombre}`, 25, yPosition)
    yPosition += 7
    doc.text(`Estado del delegado: ${entidadData.delegadoPrincipal.certificado ? 'Certificado' : 'En formación'}`, 25, yPosition)

    // Estadísticas de cumplimiento
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('INDICADORES DE CUMPLIMIENTO', 25, yPosition)

    yPosition += 10
    doc.setFontSize(12)
    doc.text(`• Cumplimiento general: ${entidadData.cumplimiento}%`, 25, yPosition)
    yPosition += 7
    doc.text(`• Formación del personal: ${entidadData.estadoImplementacion.formacionProgreso}%`, 25, yPosition)
    yPosition += 7
    doc.text(`• Alertas activas: ${entidadData.alertas}`, 25, yPosition)
    yPosition += 7
    doc.text(`• Delegados certificados: ${entidadData.delegadoPrincipal.certificado ? 1 : 0}${entidadData.delegadoSuplente ? (entidadData.delegadoSuplente.certificado ? ' + 1 suplente' : ' + 1 suplente en formación') : ''}`, 25, yPosition)

    // Estado de implementación
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('ESTADO DE IMPLEMENTACIÓN', 25, yPosition)

    yPosition += 10
    doc.setFontSize(12)
    doc.text('✓ Configuración inicial: Completada', 25, yPosition)
    yPosition += 7
    doc.text('✓ Delegado asignado: Completado', 25, yPosition)
    yPosition += 7
    doc.text(`${entidadData.estadoImplementacion.formacionProgreso >= 100 ? '✓' : '○'} Formación del personal: ${entidadData.estadoImplementacion.formacionProgreso}%`, 25, yPosition)
    yPosition += 7
    doc.text(`${entidadData.estadoImplementacion.validacionFinal ? '✓' : '○'} Validación final: ${entidadData.estadoImplementacion.validacionFinal ? 'Completada' : 'Pendiente'}`, 25, yPosition)

    // Próximas acciones
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('PRÓXIMAS ACCIONES RECOMENDADAS', 25, yPosition)

    yPosition += 10
    doc.setFontSize(12)
    entidadData.proximasAcciones.forEach((accion, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(`${index + 1}. ${accion}`, 25, yPosition)
      yPosition += 7
    })

    // Contactos importantes
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('CONTACTOS DE EMERGENCIA', 25, yPosition)

    yPosition += 10
    doc.setFontSize(12)
    doc.text(`Delegado Principal: ${entidadData.delegadoPrincipal.nombre}`, 25, yPosition)
    yPosition += 7
    doc.text(`Email: ${entidadData.delegadoPrincipal.email}`, 25, yPosition)
    yPosition += 7
    doc.text(`Teléfono: ${entidadData.delegadoPrincipal.telefono}`, 25, yPosition)

    if (entidadData.delegadoSuplente) {
      yPosition += 10
      doc.text(`Delegado Suplente: ${entidadData.delegadoSuplente.nombre}`, 25, yPosition)
      yPosition += 7
      doc.text(`Email: ${entidadData.delegadoSuplente.email}`, 25, yPosition)
      yPosition += 7
      doc.text(`Teléfono: ${entidadData.delegadoSuplente.telefono}`, 25, yPosition)
    }

    // Pie de página
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text('Informe Ejecutivo generado por Custodia360', pageWidth / 2, pageHeight - 10, { align: 'center' })

    doc.save(`Informe_Ejecutivo_${entidadData.nombre.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`)
  }

  const generarInformeCumplimiento = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Encabezado
    doc.setFontSize(24)
    doc.setTextColor(234, 88, 12)
    doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text('INFORME DE CUMPLIMIENTO LOPIVI', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(entidadData.nombre, pageWidth / 2, yPosition, { align: 'center' })
    doc.text(new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }), pageWidth / 2, yPosition + 7, { align: 'center' })

    yPosition += 20
    doc.setDrawColor(234, 88, 12)
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, pageWidth - 20, yPosition)

    // Resumen ejecutivo
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('RESUMEN EJECUTIVO', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text(`Estado de cumplimiento general: ${entidadData.cumplimiento}%`, 25, yPosition)
    yPosition += 7
    doc.text(`Alertas activas: ${entidadData.alertas}`, 25, yPosition)
    yPosition += 7
    doc.text(`Personal formado: ${Math.round(entidadData.estadoImplementacion.formacionProgreso * 0.32)}/32 personas`, 25, yPosition)
    yPosition += 7
    doc.text(`Delegados activos: ${entidadData.delegadoSuplente ? '2 (Principal + Suplente)' : '1 (Solo Principal)'}`, 25, yPosition)

    // Estado de implementación
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('ESTADO DE IMPLEMENTACIÓN', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text(`✓ Configuración inicial: Completada`, 25, yPosition)
    yPosition += 7
    doc.text(`✓ Delegado asignado: Completado`, 25, yPosition)
    yPosition += 7
    doc.text(`${entidadData.estadoImplementacion.formacionProgreso >= 100 ? '✓' : '○'} Formación del personal: ${entidadData.estadoImplementacion.formacionProgreso}%`, 25, yPosition)
    yPosition += 7
    doc.text(`${entidadData.estadoImplementacion.validacionFinal ? '✓' : '○'} Validación final: ${entidadData.estadoImplementacion.validacionFinal ? 'Completada' : 'Pendiente'}`, 25, yPosition)

    // Próximas acciones
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('PRÓXIMAS ACCIONES REQUERIDAS', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    entidadData.proximasAcciones.forEach((accion, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(`${index + 1}. ${accion}`, 25, yPosition)
      yPosition += 7
    })

    // Pie de página
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text('Documento confidencial - Custodia360', pageWidth / 2, pageHeight - 10, { align: 'center' })

    doc.save(`Informe_Cumplimiento_${entidadData.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const generarCertificadoImplementacion = () => {
    const doc = new jsPDF('l', 'mm', 'a4') // Horizontal para certificado
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 30

    // Marco decorativo
    doc.setDrawColor(234, 88, 12)
    doc.setLineWidth(2)
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20)
    doc.setLineWidth(0.5)
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30)

    // Título
    doc.setFontSize(32)
    doc.setTextColor(234, 88, 12)
    doc.text('CERTIFICADO DE IMPLEMENTACIÓN', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(24)
    doc.setTextColor(0, 0, 0)
    doc.text('LEY ORGÁNICA DE PROTECCIÓN INTEGRAL', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10
    doc.text('A LA INFANCIA Y LA ADOLESCENCIA', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 20
    doc.setFontSize(16)
    doc.text('Por la presente se certifica que', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(24)
    doc.setTextColor(37, 99, 235)
    doc.text(entidadData.nombre, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('ha implementado correctamente el sistema de protección LOPIVI', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 8
    doc.text(`con un nivel de cumplimiento del ${entidadData.cumplimiento}%`, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(12)
    doc.text(`Delegado Principal: ${entidadData.delegadoPrincipal.nombre}`, pageWidth / 2, yPosition, { align: 'center' })
    if (entidadData.delegadoSuplente) {
      yPosition += 7
      doc.text(`Delegado Suplente: ${entidadData.delegadoSuplente.nombre}`, pageWidth / 2, yPosition, { align: 'center' })
    }

    yPosition += 20
    doc.setFontSize(11)
    doc.text(`Código de verificación: LOPIVI-${Date.now().toString(36).toUpperCase()}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 7
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 7
    doc.text('Válido hasta: ' + new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('es-ES'), pageWidth / 2, yPosition, { align: 'center' })

    // Firma
    yPosition = pageHeight - 40
    doc.setFontSize(12)
    doc.text('_____________________', pageWidth / 2 - 60, yPosition, { align: 'center' })
    doc.text('_____________________', pageWidth / 2 + 60, yPosition, { align: 'center' })
    yPosition += 7
    doc.setFontSize(10)
    doc.text('Director Custodia360', pageWidth / 2 - 60, yPosition, { align: 'center' })
    doc.text('Responsable de la Entidad', pageWidth / 2 + 60, yPosition, { align: 'center' })

    doc.save(`Certificado_LOPIVI_${entidadData.nombre.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`)
  }

  const generarProtocolosActuacion = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPosition = 20

    // Encabezado
    doc.setFontSize(24)
    doc.setTextColor(234, 88, 12)
    doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text('PROTOCOLOS DE ACTUACIÓN', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(entidadData.nombre, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setDrawColor(234, 88, 12)
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, pageWidth - 20, yPosition)

    // Protocolo 1
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('PROTOCOLO 1: DETECCIÓN DE SITUACIONES DE RIESGO', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text('1. Observar cambios de comportamiento en el menor', 25, yPosition)
    yPosition += 7
    doc.text('2. Documentar las observaciones de forma objetiva', 25, yPosition)
    yPosition += 7
    doc.text('3. Contrastar información con otros profesionales', 25, yPosition)
    yPosition += 7
    doc.text('4. Informar al Delegado de Protección inmediatamente', 25, yPosition)
    yPosition += 7
    doc.text('5. Mantener la confidencialidad del caso', 25, yPosition)

    // Protocolo 2
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('PROTOCOLO 2: ACTUACIÓN ANTE EMERGENCIAS', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text('1. Garantizar la seguridad inmediata del menor', 25, yPosition)
    yPosition += 7
    doc.text('2. Llamar al 112 si hay riesgo vital', 25, yPosition)
    yPosition += 7
    doc.text('3. Contactar con el Delegado de Protección', 25, yPosition)
    yPosition += 7
    doc.text('4. Documentar todo lo ocurrido', 25, yPosition)
    yPosition += 7
    doc.text('5. Comunicar a las autoridades competentes', 25, yPosition)

    // Contactos de emergencia
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('CONTACTOS DE EMERGENCIA', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text('• Emergencias: 112', 25, yPosition)
    yPosition += 7
    doc.text('• Teléfono del Menor: 116111', 25, yPosition)
    yPosition += 7
    doc.text(`• Delegado Principal: ${entidadData.delegadoPrincipal.email}`, 25, yPosition)
    if (entidadData.delegadoSuplente) {
      yPosition += 7
      doc.text(`• Delegado Suplente: ${entidadData.delegadoSuplente.email}`, 25, yPosition)
    }

    doc.save(`Protocolos_Actuacion_${entidadData.nombre.replace(/\s+/g, '_')}.pdf`)
  }

  const generarCodigoConducta = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPosition = 20

    // Encabezado
    doc.setFontSize(24)
    doc.setTextColor(234, 88, 12)
    doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text('CÓDIGO DE CONDUCTA', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(entidadData.nombre, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setDrawColor(234, 88, 12)
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, pageWidth - 20, yPosition)

    // Principios
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('PRINCIPIOS FUNDAMENTALES', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    const principios = [
      'Respeto absoluto a la dignidad de los menores',
      'Tolerancia cero ante cualquier forma de violencia',
      'Transparencia en todas las actuaciones',
      'Confidencialidad de la información sensible',
      'Colaboración con autoridades competentes'
    ]

    principios.forEach(principio => {
      doc.text(`• ${principio}`, 25, yPosition)
      yPosition += 7
    })

    // Normas de conducta
    yPosition += 10
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('NORMAS DE CONDUCTA OBLIGATORIAS', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    const normas = [
      'Trato respetuoso y profesional en todo momento',
      'No establecer relaciones inadecuadas con menores',
      'Evitar estar a solas con un menor sin supervisión',
      'No intercambiar información personal privada',
      'Reportar inmediatamente cualquier situación sospechosa',
      'Participar en las formaciones obligatorias',
      'Cumplir con los protocolos establecidos'
    ]

    normas.forEach(norma => {
      doc.text(`✓ ${norma}`, 25, yPosition)
      yPosition += 7
    })

    // Compromiso
    yPosition += 15
    doc.setFontSize(12)
    doc.text('COMPROMISO', 20, yPosition)
    yPosition += 10
    doc.setFontSize(11)
    doc.text('El incumplimiento de este código puede resultar en medidas disciplinarias', 25, yPosition)
    yPosition += 7
    doc.text('incluyendo la terminación del contrato y denuncia a las autoridades.', 25, yPosition)

    doc.save(`Codigo_Conducta_${entidadData.nombre.replace(/\s+/g, '_')}.pdf`)
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
                Informes y Documentos
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

            {/* Informes y Documentos */}
            {activeTab === 'reportes' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Informes y Documentos</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Informes Ejecutivos</h4>
                      <div className="space-y-3">
                        <button
                          onClick={generarInformeCumplimiento}
                          className="w-full text-left border border-gray-300 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Informe de Cumplimiento Mensual</span>
                            <span className="text-blue-600 text-sm">PDF</span>
                          </div>
                          <p className="text-sm text-gray-600">Generar informe actualizado</p>
                        </button>

                        <button
                          onClick={generarCertificadoImplementacion}
                          className="w-full text-left border border-gray-300 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Certificado de Implementación</span>
                            <span className="text-green-600 text-sm">PDF</span>
                          </div>
                          <p className="text-sm text-gray-600">Documento LOPIVI</p>
                        </button>

                        <button className="w-full text-left border border-gray-300 hover:bg-gray-50 p-3 rounded-lg transition-colors opacity-50 cursor-not-allowed">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Certificados del Personal</span>
                            <span className="text-purple-600 text-sm">Pendiente</span>
                          </div>
                          <p className="text-sm text-gray-600">Disponible cuando complete formación</p>
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Documentación Legal</h4>
                      <div className="space-y-3">
                        <button
                          onClick={generarPlanProteccion}
                          className="w-full text-left border border-gray-300 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Plan de Protección LOPIVI</span>
                            <span className="text-red-600 text-sm">PDF</span>
                          </div>
                          <p className="text-sm text-gray-600">Específico para tu entidad</p>
                        </button>

                        <button
                          onClick={generarProtocolosActuacion}
                          className="w-full text-left border border-gray-300 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Protocolos de Actuación</span>
                            <span className="text-orange-600 text-sm">PDF</span>
                          </div>
                          <p className="text-sm text-gray-600">Procedimientos de emergencia</p>
                        </button>

                        <button
                          onClick={generarCodigoConducta}
                          className="w-full text-left border border-gray-300 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Código de Conducta</span>
                            <span className="text-teal-600 text-sm">PDF</span>
                          </div>
                          <p className="text-sm text-gray-600">Para personal y familias</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón para generar informe personalizado */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <h4 className="font-bold text-gray-900 mb-4">Generar Informe Personalizado</h4>
                  <p className="text-gray-600 mb-4">
                    Crea un informe ejecutivo personalizado con los datos actuales de tu entidad para presentar a la dirección o autoridades.
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
