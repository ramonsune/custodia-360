'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { jsPDF } from 'jspdf'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  permisos: string[]
  certificacionVigente: boolean
  inicioSesion: string
  expiracion: string
}

interface DelegadoData {
  nombre: string
  entidad: string
  tipo: 'principal' | 'suplente'
  casosActivos: number
  alertas: number
  formacionCompletada: number
  personalFormado: number
  totalPersonal: number
  certificacionVigente: boolean
  ultimaActividad: string
  proximaRenovacion: string
  estadoCumplimiento: number
}

interface CasoData {
  id: string
  fecha: string
  tipo: string
  estado: 'pendiente' | 'en_proceso' | 'resuelto' | 'derivado'
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  descripcion: string
  acciones: string[]
}

export default function DashboardDelegado() {
  const router = useRouter()
  const [delegadoData, setDelegadoData] = useState<DelegadoData | null>(null)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [casos, setCasos] = useState<CasoData[]>([])
  const [loading, setLoading] = useState(true)

  // Funciones de generación de PDFs específicas para el delegado
  const generarManualDelegado = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Encabezado
    doc.setFontSize(24)
    doc.setTextColor(37, 99, 235)
    doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text('MANUAL DEL DELEGADO DE PROTECCIÓN', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(`${delegadoData.nombre} - ${delegadoData.entidad}`, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setDrawColor(37, 99, 235)
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, pageWidth - 20, yPosition)

    // Contenido
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(37, 99, 235)
    doc.text('1. RESPONSABILIDADES DEL DELEGADO', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    const responsabilidades = [
      'Recibir comunicaciones sobre situaciones de violencia',
      'Evaluar la gravedad de las situaciones reportadas',
      'Adoptar las medidas de protección necesarias',
      'Comunicar a las autoridades cuando corresponda',
      'Formar al personal en protocolos LOPIVI',
      'Mantener registros confidenciales y seguros',
      'Coordinarse con servicios especializados'
    ]

    responsabilidades.forEach(responsabilidad => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(`• ${responsabilidad}`, 25, yPosition)
      yPosition += 7
    })

    // Protocolos específicos
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(37, 99, 235)
    doc.text('2. PROTOCOLOS DE ACTUACIÓN', 20, yPosition)

    yPosition += 10
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('A) Protocolo de Detección', 25, yPosition)
    doc.setFont(undefined, 'normal')

    yPosition += 7
    doc.setFontSize(11)
    const deteccion = [
      '1. Observar indicadores físicos y comportamentales',
      '2. Documentar observaciones de forma objetiva',
      '3. Contrastar información con otros profesionales',
      '4. No interrogar directamente al menor',
      '5. Mantener la calma y confidencialidad'
    ]

    deteccion.forEach(paso => {
      doc.text(paso, 30, yPosition)
      yPosition += 6
    })

    // Contactos específicos del delegado
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(37, 99, 235)
    doc.text('3. CONTACTOS ESENCIALES', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text('• Emergencias: 112', 25, yPosition)
    yPosition += 7
    doc.text('• Teléfono del Menor: 116111', 25, yPosition)
    yPosition += 7
    doc.text('• Policía Nacional: 091', 25, yPosition)
    yPosition += 7
    doc.text('• Guardia Civil: 062', 25, yPosition)
    yPosition += 7
    doc.text(`• Entidad asignada: ${delegadoData.entidad}`, 25, yPosition)

    doc.save(`Manual_Delegado_${delegadoData.nombre.replace(/\s+/g, '_')}.pdf`)
  }

  const generarProtocolosCasos = () => {
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
    doc.text('PROTOCOLOS DE GESTIÓN DE CASOS', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(`Delegado: ${delegadoData.nombre} - ${delegadoData.entidad}`, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setDrawColor(234, 88, 12)
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, pageWidth - 20, yPosition)

    // Tipos de casos
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text('TIPOS DE CASOS Y ACTUACIONES', 20, yPosition)

    yPosition += 10
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('CASO CRÍTICO - Riesgo Inmediato', 25, yPosition)
    doc.setFont(undefined, 'normal')

    yPosition += 7
    doc.setFontSize(11)
    const critico = [
      '1. Garantizar seguridad inmediata del menor',
      '2. Contactar servicios de emergencia (112)',
      '3. Documentar todo lo observado',
      '4. Comunicar a autoridades competentes',
      '5. Informar a dirección de la entidad',
      '6. Seguimiento y coordinación posterior'
    ]

    critico.forEach(paso => {
      doc.text(paso, 30, yPosition)
      yPosition += 6
    })

    yPosition += 10
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('CASO DE SEGUIMIENTO - Observación Continua', 25, yPosition)
    doc.setFont(undefined, 'normal')

    yPosition += 7
    doc.setFontSize(11)
    const seguimiento = [
      '1. Registro detallado de observaciones',
      '2. Coordinación con equipo técnico',
      '3. Comunicación con familia si procede',
      '4. Evaluación periódica de evolución',
      '5. Activación de recursos de apoyo',
      '6. Documentación de intervenciones'
    ]

    seguimiento.forEach(paso => {
      doc.text(paso, 30, yPosition)
      yPosition += 6
    })

    doc.save(`Protocolos_Casos_${delegadoData.nombre.replace(/\s+/g, '_')}.pdf`)
  }

  const generarFormularioRegistro = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPosition = 20

    // Encabezado
    doc.setFontSize(24)
    doc.setTextColor(16, 185, 129)
    doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text('FORMULARIO DE REGISTRO DE INCIDENTES', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(`Delegado: ${delegadoData.nombre}`, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, pageWidth - 20, yPosition)

    // Campos del formulario
    yPosition += 20
    doc.setFontSize(14)
    doc.setTextColor(16, 185, 129)
    doc.text('DATOS DEL INCIDENTE', 20, yPosition)

    yPosition += 15
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)

    // Crear campos editables
    const campos = [
      'Fecha del incidente: ____________________',
      'Hora aproximada: ____________________',
      'Lugar donde ocurrió: ____________________',
      'Personas involucradas: ____________________',
      '',
      'DESCRIPCIÓN DETALLADA:',
      '________________________________________________',
      '________________________________________________',
      '________________________________________________',
      '________________________________________________',
      '',
      'MEDIDAS ADOPTADAS:',
      '________________________________________________',
      '________________________________________________',
      '________________________________________________',
      '',
      'COMUNICACIONES REALIZADAS:',
      '□ Dirección de la entidad',
      '□ Familia del menor',
      '□ Servicios sociales',
      '□ Autoridades competentes',
      '□ Otras: ____________________',
      '',
      'SEGUIMIENTO REQUERIDO:',
      '________________________________________________',
      '________________________________________________',
      '',
      'Firma del Delegado: ____________________',
      `Nombre: ${delegadoData.nombre}`,
      'Fecha: ____________________'
    ]

    campos.forEach(campo => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
      if (campo.startsWith('□')) {
        doc.text(campo, 25, yPosition)
      } else if (campo === '') {
        yPosition += 3
        return
      } else {
        doc.text(campo, 25, yPosition)
      }
      yPosition += 7
    })

    doc.save(`Formulario_Registro_${delegadoData.entidad.replace(/\s+/g, '_')}.pdf`)
  }

  const generarGuiaComunicacion = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPosition = 20

    // Encabezado
    doc.setFontSize(24)
    doc.setTextColor(147, 51, 234)
    doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text('GUÍA DE COMUNICACIÓN CON FAMILIAS', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(`Para: ${delegadoData.entidad}`, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setDrawColor(147, 51, 234)
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, pageWidth - 20, yPosition)

    // Principios de comunicación
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(147, 51, 234)
    doc.text('PRINCIPIOS BÁSICOS DE COMUNICACIÓN', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    const principios = [
      'Mantener la calma y transmitir seguridad',
      'Ser claro, directo y empático',
      'Respetar la confidencialidad',
      'Informar de forma gradual y adaptada',
      'Escuchar activamente las preocupaciones',
      'Ofrecer apoyo y orientación',
      'Documentar todas las comunicaciones'
    ]

    principios.forEach(principio => {
      doc.text(`• ${principio}`, 25, yPosition)
      yPosition += 7
    })

    // Templates de comunicación
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(147, 51, 234)
    doc.text('TEMPLATES DE COMUNICACIÓN', 20, yPosition)

    yPosition += 10
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Template 1: Comunicación General LOPIVI', 25, yPosition)
    doc.setFont(undefined, 'normal')

    yPosition += 7
    doc.setFontSize(10)
    const template1 = `Estimada familia,

Les informamos que ${delegadoData.entidad} ha implementado el Plan de Protección LOPIVI para garantizar el bienestar y seguridad de todos los menores.

Como parte de este plan, hemos designado un Delegado de Protección que será su punto de contacto para cualquier consulta relacionada con la protección de su hijo/a.

Delegado de Protección: ${delegadoData.nombre}
Contacto: [email/teléfono]

Quedamos a su disposición para cualquier aclaración.

Atentamente,
Dirección de ${delegadoData.entidad}`

    const lines = doc.splitTextToSize(template1, pageWidth - 50)
    lines.forEach((line: string) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(line, 25, yPosition)
      yPosition += 5
    })

    doc.save(`Guia_Comunicacion_${delegadoData.entidad.replace(/\s+/g, '_')}.pdf`)
  }

  const generarChecklistActuacion = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPosition = 20

    // Encabezado
    doc.setFontSize(24)
    doc.setTextColor(6, 182, 212)
    doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text('CHECKLIST DE ACTUACIÓN INMEDIATA', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(`Delegado: ${delegadoData.nombre}`, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setDrawColor(6, 182, 212)
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, pageWidth - 20, yPosition)

    // Checklist
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(6, 182, 212)
    doc.text('PRIMEROS 30 MINUTOS', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    const primeros30 = [
      '□ Garantizar seguridad inmediata del menor',
      '□ Separar al menor de la situación de riesgo',
      '□ Contactar servicios médicos si es necesario',
      '□ Documentar lo observado (fecha, hora, lugar)',
      '□ Informar a la dirección del centro',
      '□ NO interrogar al menor directamente'
    ]

    primeros30.forEach(item => {
      doc.text(item, 25, yPosition)
      yPosition += 8
    })

    yPosition += 10
    doc.setFontSize(16)
    doc.setTextColor(6, 182, 212)
    doc.text('PRIMERA HORA', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    const primeraHora = [
      '□ Completar informe inicial de incidente',
      '□ Contactar con autoridades competentes',
      '□ Comunicar a la familia si procede',
      '□ Activar protocolo de comunicación interna',
      '□ Coordinar con servicios especializados',
      '□ Registrar todas las actuaciones realizadas'
    ]

    primeraHora.forEach(item => {
      doc.text(item, 25, yPosition)
      yPosition += 8
    })

    yPosition += 10
    doc.setFontSize(16)
    doc.setTextColor(6, 182, 212)
    doc.text('PRIMERAS 24 HORAS', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    const primeras24 = [
      '□ Completar informe detallado del caso',
      '□ Enviar comunicaciones oficiales necesarias',
      '□ Coordinar seguimiento con servicios externos',
      '□ Evaluar necesidad de medidas adicionales',
      '□ Planificar acciones de seguimiento',
      '□ Archivar documentación del caso'
    ]

    primeras24.forEach(item => {
      doc.text(item, 25, yPosition)
      yPosition += 8
    })

    doc.save(`Checklist_Actuacion_${delegadoData.nombre.replace(/\s+/g, '_')}.pdf`)
  }

  const generarContactosEmergencia = () => {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPosition = 20

    // Encabezado
    doc.setFontSize(24)
    doc.setTextColor(239, 68, 68)
    doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text('CONTACTOS DE EMERGENCIA', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(`${delegadoData.entidad} - ${delegadoData.nombre}`, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setDrawColor(239, 68, 68)
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, pageWidth - 20, yPosition)

    // Contactos prioritarios
    yPosition += 20
    doc.setFontSize(18)
    doc.setTextColor(239, 68, 68)
    doc.text('CONTACTOS PRIORITARIOS', 20, yPosition)

    yPosition += 15
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)

    const contactosPrioritarios = [
      { nombre: '112', descripcion: 'EMERGENCIAS GENERALES', color: [239, 68, 68] },
      { nombre: '091', descripcion: 'POLICÍA NACIONAL', color: [59, 130, 246] },
      { nombre: '062', descripcion: 'GUARDIA CIVIL', color: [16, 185, 129] },
      { nombre: '116111', descripcion: 'TELÉFONO DEL MENOR', color: [147, 51, 234] }
    ]

    contactosPrioritarios.forEach(contacto => {
      // Crear un box colorido para cada contacto
      doc.setFillColor(contacto.color[0], contacto.color[1], contacto.color[2])
      doc.rect(20, yPosition - 5, pageWidth - 40, 20, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.text(contacto.nombre, 30, yPosition + 5)
      doc.setFontSize(12)
      doc.text(contacto.descripcion, 30, yPosition + 12)

      yPosition += 25
    })

    // Contactos específicos de la entidad
    yPosition += 15
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('CONTACTOS DE LA ENTIDAD', 20, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.text(`Entidad: ${delegadoData.entidad}`, 25, yPosition)
    yPosition += 7
    doc.text(`Delegado Principal: ${delegadoData.nombre}`, 25, yPosition)
    yPosition += 7
    doc.text('Email: delegado@entidad.com', 25, yPosition)
    yPosition += 7
    doc.text('Teléfono: 678 XX XX XX', 25, yPosition)

    // Instrucciones
    yPosition += 20
    doc.setFontSize(14)
    doc.setTextColor(239, 68, 68)
    doc.text('INSTRUCCIONES IMPORTANTES', 20, yPosition)

    yPosition += 10
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    const instrucciones = [
      '1. En caso de emergencia vital: 112 SIEMPRE',
      '2. Para situaciones de maltrato: 091 o 062',
      '3. Para apoyo especializado: 116111',
      '4. Documenta SIEMPRE la llamada realizada',
      '5. Informa INMEDIATAMENTE a la dirección',
      '6. NUNCA actúes solo en casos graves'
    ]

    instrucciones.forEach(instruccion => {
      doc.text(instruccion, 25, yPosition)
      yPosition += 6
    })

    doc.save(`Contactos_Emergencia_${delegadoData.entidad.replace(/\s+/g, '_')}.pdf`)
  }

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
    if (!session || (session.tipo !== 'principal' && session.tipo !== 'suplente')) {
      router.push('/login')
      return
    }

    setSessionData(session)

    // Datos simulados basados en la sesión
    const delegadoInfo: DelegadoData = {
      nombre: session.nombre,
      entidad: session.entidad,
      tipo: session.tipo,
      casosActivos: session.tipo === 'principal' ? 3 : 2, // Ambos tipos tienen acceso completo
      alertas: session.entidad.includes('Nuevo') ? 5 : 2,
      formacionCompletada: session.certificacionVigente ? 100 : 45,
      personalFormado: session.entidad.includes('Nuevo') ? 12 : 28,
      totalPersonal: session.entidad.includes('Nuevo') ? 15 : 32,
      certificacionVigente: session.certificacionVigente,
      ultimaActividad: session.inicioSesion,
      proximaRenovacion: '2024-12-15',
      estadoCumplimiento: session.entidad.includes('Nuevo') ? 45 : 92
    }

    // Casos simulados
    const casosData: CasoData[] = [
      {
        id: 'CASO-2024-001',
        fecha: '2024-01-20',
        tipo: 'Comunicación familia',
        estado: 'en_proceso',
        prioridad: 'media',
        descripcion: 'Familia solicita información sobre protocolo aplicado',
        acciones: ['Contacto telefónico realizado', 'Pendiente envío documentación']
      },
      {
        id: 'CASO-2024-002',
        fecha: '2024-01-19',
        tipo: 'Formación personal',
        estado: 'resuelto',
        prioridad: 'baja',
        descripcion: 'Nuevo personal requiere formación LOPIVI',
        acciones: ['Formación completada', 'Certificado emitido']
      },
      {
        id: 'CASO-2024-003',
        fecha: '2024-01-18',
        tipo: 'Revisión protocolo',
        estado: 'pendiente',
        prioridad: 'alta',
        descripcion: 'Actualización protocolo según nueva normativa',
        acciones: ['Revisión normativa pendiente']
      }
    ]

    setDelegadoData(delegadoInfo)
    setCasos(casosData)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('userSession')
    sessionStorage.removeItem('userSession')
    localStorage.removeItem('userAuth')
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-red-100 text-red-800'
      case 'en_proceso': return 'bg-yellow-100 text-yellow-800'
      case 'resuelto': return 'bg-green-100 text-green-800'
      case 'derivado': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'bg-red-600 text-white'
      case 'alta': return 'bg-orange-600 text-white'
      case 'media': return 'bg-yellow-600 text-white'
      case 'baja': return 'bg-green-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard del delegado...</p>
        </div>
      </div>
    )
  }

  if (!delegadoData || !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error de autenticación</p>
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                sessionData.tipo === 'principal' ? 'bg-blue-600' : 'bg-green-600'
              }`}>
                <span className="text-white font-bold text-xl">
                  {sessionData.tipo === 'principal' ? 'DP' : 'DS'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portal del Delegado de Protección</h1>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-600">{delegadoData.nombre}</p>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    sessionData.tipo === 'principal'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {sessionData.tipo === 'principal' ? 'Delegado Principal' : 'Delegado Suplente'}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    delegadoData.certificacionVigente
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {delegadoData.certificacionVigente ? 'Certificado' : 'En Formación'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
              >
                <span className="text-lg"></span>
                EMERGENCIA
              </button>
              <div className="text-right text-sm text-gray-500">
                <div>Entidad: <strong>{delegadoData.entidad}</strong></div>
                <div>Última actividad: {formatDate(delegadoData.ultimaActividad)}</div>
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Casos Activos</p>
                <p className="text-2xl font-bold text-orange-600">{delegadoData.casosActivos}</p>
                <p className="text-xs text-gray-500">En seguimiento</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cumplimiento LOPIVI</p>
                <p className={`text-2xl font-bold ${
                  delegadoData.estadoCumplimiento >= 80 ? 'text-green-600' :
                  delegadoData.estadoCumplimiento >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {delegadoData.estadoCumplimiento}%
                </p>
                <p className="text-xs text-gray-500">
                  {delegadoData.estadoCumplimiento >= 80 ? 'Excelente' :
                   delegadoData.estadoCumplimiento >= 60 ? 'En progreso' : 'Requiere atención'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Personal Formado</p>
                <p className="text-2xl font-bold text-blue-600">
                  {delegadoData.personalFormado}/{delegadoData.totalPersonal}
                </p>
                <p className="text-xs text-gray-500">
                  {Math.round((delegadoData.personalFormado / delegadoData.totalPersonal) * 100)}% completado
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertas Pendientes</p>
                <p className={`text-2xl font-bold ${
                  delegadoData.alertas > 3 ? 'text-red-600' :
                  delegadoData.alertas > 0 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {delegadoData.alertas}
                </p>
                <p className="text-xs text-gray-500">
                  {delegadoData.alertas === 0 ? 'Todo al día' : 'Requieren atención'}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Sistema de Tabs */}
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
                onClick={() => setActiveTab('casos')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'casos'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Gestión de Casos
              </button>
              <button
                onClick={() => setActiveTab('documentos')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'documentos'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Documentos y Protocolos
              </button>
              <button
                onClick={() => setActiveTab('formacion')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'formacion'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Formación
              </button>
              <button
                onClick={() => setActiveTab('comunicaciones')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'comunicaciones'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Comunicaciones
              </button>
              <button
                onClick={() => setActiveTab('herramientas')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'herramientas'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Herramientas
              </button>
            </nav>
          </div>

          <div className="p-8">
            {/* Vista General */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Resumen de la Entidad */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Tu Entidad Asignada</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                          {delegadoData.entidad.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{delegadoData.entidad}</h4>
                          <p className="text-blue-600 font-medium">
                            Bajo tu protección como {sessionData.tipo === 'principal' ? 'Delegado Principal' : 'Delegado Suplente'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Personal total: {delegadoData.totalPersonal} • Menores: 201-500
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Activa
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progreso de Cumplimiento */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Estado de Cumplimiento LOPIVI</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-bold text-green-800 mb-4">Documentación</h4>
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
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-bold text-blue-800 mb-4">Formación Personal</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Completado</span>
                          <span className="font-bold text-blue-600">{delegadoData.personalFormado}/{delegadoData.totalPersonal}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{width: `${(delegadoData.personalFormado / delegadoData.totalPersonal) * 100}%`}}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600">
                          {delegadoData.totalPersonal - delegadoData.personalFormado} personas pendientes
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h4 className="font-bold text-yellow-800 mb-4">Próximas Tareas</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                          <span className="text-gray-700">Renovar certificación (6 meses)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
                          <span className="text-gray-700">Formar nuevo personal (3 personas)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                          <span className="text-gray-700">Revisión protocolo emergencia</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Casos Recientes */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Casos Recientes</h3>
                  <div className="space-y-4">
                    {casos.slice(0, 3).map((caso) => (
                      <div key={caso.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-900">{caso.id}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(caso.estado)}`}>
                              {caso.estado.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPrioridadColor(caso.prioridad)}`}>
                              {caso.prioridad}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(caso.fecha)}</span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{caso.descripcion}</p>
                        <p className="text-xs text-gray-500">
                          Última acción: {caso.acciones[caso.acciones.length - 1]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Gestión de Casos */}
            {activeTab === 'casos' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Gestión de Casos</h3>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700">
                    + Nuevo Caso
                  </button>
                </div>

                {/* Filtros de Casos */}
                <div className="flex gap-4 mb-6">
                  <select className="border border-gray-300 rounded-lg px-3 py-2">
                    <option>Todos los estados</option>
                    <option>Pendiente</option>
                    <option>En proceso</option>
                    <option>Resuelto</option>
                  </select>
                  <select className="border border-gray-300 rounded-lg px-3 py-2">
                    <option>Todas las prioridades</option>
                    <option>Crítica</option>
                    <option>Alta</option>
                    <option>Media</option>
                    <option>Baja</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Buscar casos..."
                    className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
                  />
                </div>

                {/* Lista de Casos */}
                <div className="space-y-4">
                  {casos.map((caso) => (
                    <div key={caso.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-gray-900">{caso.id}</h4>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getEstadoColor(caso.estado)}`}>
                            {caso.estado.replace('_', ' ')}
                          </span>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPrioridadColor(caso.prioridad)}`}>
                            {caso.prioridad}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{formatDate(caso.fecha)}</span>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                            Ver Detalles
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="font-medium text-gray-900 mb-2">Tipo: {caso.tipo}</p>
                        <p className="text-gray-700">{caso.descripcion}</p>
                      </div>

                      <div>
                        <p className="font-medium text-gray-900 mb-2">Acciones realizadas:</p>
                        <div className="space-y-1">
                          {caso.acciones.map((accion, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                              {accion}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documentos y Protocolos */}
            {activeTab === 'documentos' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">Documentos y Protocolos</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Documentos LOPIVI */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Documentación LOPIVI</h4>
                    <div className="space-y-3">
                      <button
                        onClick={generarManualDelegado}
                        className="w-full text-left bg-red-50 hover:bg-red-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Manual del Delegado</span>
                          <span className="text-red-600 text-sm">📄 PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Guía completa de responsabilidades</p>
                      </button>

                      <button
                        onClick={generarProtocolosCasos}
                        className="w-full text-left bg-orange-50 hover:bg-orange-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Protocolos de Casos</span>
                          <span className="text-orange-600 text-sm">📋 PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Gestión y seguimiento de casos</p>
                      </button>

                      <button className="w-full text-left bg-blue-50 hover:bg-blue-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Código de Conducta</span>
                          <span className="text-blue-600 text-sm">📝 PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Para personal y familias</p>
                      </button>

                      <button
                        onClick={generarFormularioRegistro}
                        className="w-full text-left bg-green-50 hover:bg-green-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Formularios de Registro</span>
                          <span className="text-green-600 text-sm">📝 PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Templates editables para casos</p>
                      </button>
                    </div>
                  </div>

                  {/* Protocolos de Emergencia */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Protocolos de Emergencia</h4>
                    <div className="space-y-3">
                      <button className="w-full text-left bg-red-50 hover:bg-red-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Protocolo Crisis</span>
                          <span className="text-red-600 text-sm">🚨 PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Actuación inmediata en crisis</p>
                      </button>

                      <button
                        onClick={generarContactosEmergencia}
                        className="w-full text-left bg-yellow-50 hover:bg-yellow-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Contactos de Emergencia</span>
                          <span className="text-yellow-600 text-sm">📞 PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Directorio completo actualizado</p>
                      </button>

                      <button
                        onClick={generarGuiaComunicacion}
                        className="w-full text-left bg-purple-50 hover:bg-purple-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Guía de Comunicación</span>
                          <span className="text-purple-600 text-sm">💬 PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Con familias y medios</p>
                      </button>

                      <button
                        onClick={generarChecklistActuacion}
                        className="w-full text-left bg-teal-50 hover:bg-teal-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Checklist de Actuación</span>
                          <span className="text-teal-600 text-sm">✅ PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Pasos críticos a seguir</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Acceso rápido a documentos */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Acceso Rápido</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={generarFormularioRegistro}
                      className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl mb-2">📝</div>
                      <div className="text-sm font-medium">Crear Informe</div>
                    </button>

                    <button
                      onClick={generarContactosEmergencia}
                      className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl mb-2">📞</div>
                      <div className="text-sm font-medium">Contactos</div>
                    </button>

                    <button
                      onClick={generarFormularioRegistro}
                      className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl mb-2">📋</div>
                      <div className="text-sm font-medium">Registro</div>
                    </button>

                    <button className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl mb-2">🔍</div>
                      <div className="text-sm font-medium">Buscar</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Formación */}
            {activeTab === 'formacion' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">Centro de Formación LOPIVI</h3>

                {/* Estado de Formación Personal */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-bold text-blue-800 mb-4">Tu Formación como Delegado</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-700">Curso LOPIVI Delegado</span>
                        <span className="font-bold text-blue-600">{delegadoData.formacionCompletada}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{width: `${delegadoData.formacionCompletada}%`}}
                        ></div>
                      </div>
                      {delegadoData.certificacionVigente ? (
                        <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                          <div className="flex items-center">
                            <span className="text-green-600 text-lg mr-2"></span>
                            <div>
                              <p className="text-sm font-medium text-green-800">Certificación Vigente</p>
                              <p className="text-xs text-green-600">Válida hasta: {formatDate(delegadoData.proximaRenovacion)}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 w-full">
                          Completar Formación
                        </button>
                      )}
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Módulos de Formación</h5>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <span className="text-green-600 mr-2">✓</span>
                          <span className="text-gray-700">Introducción a LOPIVI</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-green-600 mr-2">✓</span>
                          <span className="text-gray-700">Protocolo de Actuación</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-green-600 mr-2">✓</span>
                          <span className="text-gray-700">Comunicación con Familias</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-orange-500 mr-2">⏳</span>
                          <span className="text-gray-700">Gestión de Crisis</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-gray-400 mr-2">○</span>
                          <span className="text-gray-500">Evaluación Final</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formación del Personal */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Gestión de Formación del Personal</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {delegadoData.personalFormado}/{delegadoData.totalPersonal} personas formadas
                        </p>
                        <p className="text-sm text-gray-600">
                          {Math.round((delegadoData.personalFormado / delegadoData.totalPersonal) * 100)}% del personal certificado
                        </p>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                        Asignar Formación
                      </button>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{width: `${(delegadoData.personalFormado / delegadoData.totalPersonal) * 100}%`}}
                      ></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{delegadoData.personalFormado}</div>
                        <div className="text-sm text-gray-600">Certificados</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {Math.max(0, delegadoData.totalPersonal - delegadoData.personalFormado - 2)}
                        </div>
                        <div className="text-sm text-gray-600">En Formación</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {Math.min(2, delegadoData.totalPersonal - delegadoData.personalFormado)}
                        </div>
                        <div className="text-sm text-gray-600">Pendientes</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recursos de Formación */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Recursos de Formación</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h5 className="font-medium text-gray-900 mb-3">Material de Estudio</h5>
                      <div className="space-y-2">
                        <button className="w-full text-left hover:bg-gray-50 p-2 rounded text-sm">
                          Manual LOPIVI Completo
                        </button>
                        <button className="w-full text-left hover:bg-gray-50 p-2 rounded text-sm">
                          Videos de Formación
                        </button>
                        <button className="w-full text-left hover:bg-gray-50 p-2 rounded text-sm">
                          Casos Prácticos
                        </button>
                        <button className="w-full text-left hover:bg-gray-50 p-2 rounded text-sm">
                          Tests de Autoevaluación
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h5 className="font-medium text-gray-900 mb-3">Certificaciones</h5>
                      <div className="space-y-2">
                        <button className="w-full text-left hover:bg-gray-50 p-2 rounded text-sm">
                          Generar Certificados
                        </button>
                        <button className="w-full text-left hover:bg-gray-50 p-2 rounded text-sm">
                          Registro de Formación
                        </button>
                        <button className="w-full text-left hover:bg-gray-50 p-2 rounded text-sm">
                          Informes de Progreso
                        </button>
                        <button className="w-full text-left hover:bg-gray-50 p-2 rounded text-sm">
                          Renovaciones
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comunicaciones */}
            {activeTab === 'comunicaciones' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">Centro de Comunicaciones</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Comunicación con Familias */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Comunicación con Familias</h4>
                    <div className="space-y-3">
                      <button className="w-full text-left bg-green-50 hover:bg-green-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Enviar Comunicado General</span>
                          <span className="text-green-600 text-sm">PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Información LOPIVI a todas las familias</p>
                      </button>

                      <button className="w-full text-left bg-blue-50 hover:bg-blue-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Notificación Individual</span>
                          <span className="text-blue-600 text-sm">PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Comunicación específica</p>
                      </button>

                      <button className="w-full text-left bg-yellow-50 hover:bg-yellow-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Solicitar Documentación</span>
                          <span className="text-yellow-600 text-sm">PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Firmas y autorizaciones</p>
                      </button>

                      <button className="w-full text-left bg-purple-50 hover:bg-purple-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Plantillas de Comunicación</span>
                          <span className="text-purple-600 text-sm">PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Modelos predefinidos</p>
                      </button>
                    </div>
                  </div>

                  {/* Comunicación Interna */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Comunicación Interna</h4>
                    <div className="space-y-3">
                      <button className="w-full text-left bg-orange-50 hover:bg-orange-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Contactar Dirección</span>
                          <span className="text-orange-600 text-sm">PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Comunicación con responsables</p>
                      </button>

                      <button className="w-full text-left bg-teal-50 hover:bg-teal-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Formar al Personal</span>
                          <span className="text-teal-600 text-sm">PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Enviar formación LOPIVI</p>
                      </button>

                      <button className="w-full text-left bg-red-50 hover:bg-red-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Alerta al Equipo</span>
                          <span className="text-red-600 text-sm">PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Comunicación urgente</p>
                      </button>

                      <button className="w-full text-left bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Registro de Comunicaciones</span>
                          <span className="text-gray-600 text-sm">PDF</span>
                        </div>
                        <p className="text-sm text-gray-600">Historial completo</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contactos de Emergencia */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Contactos de Emergencia</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white text-xl font-bold">112</span>
                        </div>
                        <p className="font-bold text-gray-900">Emergencias</p>
                        <p className="text-sm text-gray-600">Servicios de emergencia</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white text-xl font-bold">091</span>
                        </div>
                        <p className="font-bold text-gray-900">Policía Nacional</p>
                        <p className="text-sm text-gray-600">Denuncias y protección</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white text-sm font-bold">116111</span>
                        </div>
                        <p className="font-bold text-gray-900">Teléfono del Menor</p>
                        <p className="text-sm text-gray-600">Atención especializada</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Herramientas */}
            {activeTab === 'herramientas' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">Herramientas del Delegado</h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Generación de Informes */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Informes y Reportes</h4>
                    <div className="space-y-3">
                      <button className="w-full bg-blue-50 hover:bg-blue-100 p-3 rounded-lg transition-colors text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="font-medium text-gray-900">Informe de Cumplimiento</div>
                        <div className="text-xs text-gray-500">Estado actual LOPIVI</div>
                      </button>

                      <button className="w-full bg-green-50 hover:bg-green-100 p-3 rounded-lg transition-colors text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="font-medium text-gray-900">Reporte de Actividad</div>
                        <div className="text-xs text-gray-500">Casos y actuaciones</div>
                      </button>

                      <button className="w-full bg-purple-50 hover:bg-purple-100 p-3 rounded-lg transition-colors text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="font-medium text-gray-900">Estadísticas</div>
                        <div className="text-xs text-gray-500">Métricas y tendencias</div>
                      </button>
                    </div>
                  </div>

                  {/* Gestión de Personal */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Gestión de Personal</h4>
                    <div className="space-y-3">
                      <button className="w-full bg-teal-50 hover:bg-teal-100 p-3 rounded-lg transition-colors text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="font-medium text-gray-900">Registro de Personal</div>
                        <div className="text-xs text-gray-500">Base de datos completa</div>
                      </button>

                      <button className="w-full bg-yellow-50 hover:bg-yellow-100 p-3 rounded-lg transition-colors text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="font-medium text-gray-900">Control Formación</div>
                        <div className="text-xs text-gray-500">Seguimiento certificaciones</div>
                      </button>

                      <button className="w-full bg-red-50 hover:bg-red-100 p-3 rounded-lg transition-colors text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="font-medium text-gray-900">Alertas Vencimientos</div>
                        <div className="text-xs text-gray-500">Renovaciones pendientes</div>
                      </button>
                    </div>
                  </div>

                  {/* Utilidades */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Utilidades</h4>
                    <div className="space-y-3">
                      <button className="w-full bg-orange-50 hover:bg-orange-100 p-3 rounded-lg transition-colors text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="font-medium text-gray-900">Calendario LOPIVI</div>
                        <div className="text-xs text-gray-500">Fechas importantes</div>
                      </button>

                      <button className="w-full bg-indigo-50 hover:bg-indigo-100 p-3 rounded-lg transition-colors text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="font-medium text-gray-900">Buscador Legal</div>
                        <div className="text-xs text-gray-500">Normativa actualizada</div>
                      </button>

                      <button className="w-full bg-pink-50 hover:bg-pink-100 p-3 rounded-lg transition-colors text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="font-medium text-gray-900">Backup Documentos</div>
                        <div className="text-xs text-gray-500">Copia de seguridad</div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Herramientas Avanzadas */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Herramientas Avanzadas</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="text-sm font-medium">Asistente IA</div>
                        <div className="text-xs text-gray-500">Consultas LOPIVI</div>
                      </button>

                      <button className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="text-sm font-medium">App Móvil</div>
                        <div className="text-xs text-gray-500">Acceso desde móvil</div>
                      </button>

                      <button className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="text-sm font-medium">Gestión Permisos</div>
                        <div className="text-xs text-gray-500">Control de acceso</div>
                      </button>

                      <button className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="text-sm font-medium">Configuración</div>
                        <div className="text-xs text-gray-500">Personalizar panel</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Emergencia */}
        {showEmergencyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-3xl font-bold"></span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Protocolo de Emergencia Activado</h3>
                <p className="text-gray-600">Selecciona el tipo de situación:</p>
                <p className="text-sm text-gray-500 mt-2">
                  Delegado: {sessionData.nombre} ({sessionData.tipo})
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <button className="w-full bg-red-600 text-white p-4 rounded-lg font-medium hover:bg-red-700 transition-colors text-left">
                  Incidente Crítico - Activar protocolo inmediato
                </button>
                <button className="w-full bg-orange-500 text-white p-4 rounded-lg font-medium hover:bg-orange-600 transition-colors text-left">
                  Situación de Riesgo - Requiere valoración
                </button>
                <button className="w-full bg-blue-600 text-white p-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-left">
                  Contactar Autoridades Competentes
                </button>
                <button className="w-full bg-purple-600 text-white p-4 rounded-lg font-medium hover:bg-purple-700 transition-colors text-left">
                  Registrar Incidente para Seguimiento
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nota informativa */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <span className="text-blue-600 text-xl mr-3">ℹ️</span>
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">Dashboard Completo del Delegado de Protección</h3>
              <p className="text-sm text-blue-700">
                Sistema avanzado implementado con acceso completo a documentos, formación, casos, comunicaciones y herramientas especializadas.
                Tanto delegado principal como suplente tienen el mismo acceso y funcionalidades para garantizar continuidad en la protección.
              </p>
              <div className="mt-2 text-xs text-blue-600">
                <strong>Entidad asignada:</strong> {delegadoData.entidad} •
                <strong>Rol:</strong> {sessionData.tipo === 'principal' ? 'Delegado Principal' : 'Delegado Suplente'} •
                <strong>Estado:</strong> {delegadoData.certificacionVigente ? 'Certificado' : 'En Formación'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
