'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BackupExportacion from '@/components/BackupExportacion'
import InformesMensuales from '@/components/InformesMensuales'
import GestionDocumentacion from '@/components/GestionDocumentacion'

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

interface Caso {
  id: string
  titulo: string
  prioridad: 'alta' | 'media' | 'baja'
  estado: 'abierto' | 'en_proceso' | 'cerrado'
  fechaCreacion: string
  descripcion: string
}

interface Alerta {
  id: string
  titulo: string
  tipo: 'urgente' | 'importante' | 'informativa'
  descripcion: string
  fechaCreacion: string
  accionRequerida: string
}

interface AccionPendiente {
  id: string
  titulo: string
  descripcion: string
  prioridad: 'alta' | 'media' | 'baja'
  pasos: string[]
  porcentajeImpacto: number
}

interface EventoCalendario {
  id: string
  titulo: string
  fecha: string
  tipo: 'certificacion' | 'renovacion' | 'auditoria' | 'contrato' | 'formacion'
  descripcion: string
  estado: 'pendiente' | 'completado' | 'vencido'
  requiereEmail: boolean
  diasAnticipacion: number
}

export default function DashboardDelegadoPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

  // Estados para modales
  const [showAccionesPendientes, setShowAccionesPendientes] = useState(false)
  const [showCasosActivos, setShowCasosActivos] = useState(false)
  const [showAlertasPendientes, setShowAlertasPendientes] = useState(false)
  const [showEstadoCertificacion, setShowEstadoCertificacion] = useState(false)
  const [showCumplimiento, setShowCumplimiento] = useState(false)
  const [showNuevoCaso, setShowNuevoCaso] = useState(false)
  const [showMapaRiesgos, setShowMapaRiesgos] = useState(false)
  const [showRecordatorios, setShowRecordatorios] = useState(false)
  const [showCasosUrgentes, setShowCasosUrgentes] = useState(false)
  const [showComunicaciones, setShowComunicaciones] = useState(false)
  const [showCalendario, setShowCalendario] = useState(false)

  // Estados para nuevas funcionalidades
  const [showBackupExportacion, setShowBackupExportacion] = useState(false)
  const [showInformesMensuales, setShowInformesMensuales] = useState(false)
  const [showGestionDocumentacion, setShowGestionDocumentacion] = useState(false)

  // Estados para calendario
  const [eventosMarcadosOk, setEventosMarcadosOk] = useState<string[]>([])
  const [alertasDesactivadas, setAlertasDesactivadas] = useState<string[]>([])

  // Datos simulados para delegado principal
  const delegadoSuplente = {
    nombre: 'María López García',
    email: 'suplente@custodia360.com',
    tipo: 'suplente' as const
  }

  // Datos simulados para casos activos
  const casosActivos: Caso[] = [
    {
      id: 'caso_001',
      titulo: 'Comunicación inapropiada detectada',
      prioridad: 'alta',
      estado: 'abierto',
      fechaCreacion: '2024-09-24',
      descripcion: 'Entrenador enviando mensajes privados a menor de 15 años fuera del horario deportivo'
    },
    {
      id: 'caso_002',
      titulo: 'Incidente en vestuarios',
      prioridad: 'media',
      estado: 'en_proceso',
      fechaCreacion: '2024-09-21',
      descripcion: 'Menor reporta incomodidad en vestuarios durante cambio de ropa'
    },
    {
      id: 'caso_003',
      titulo: 'Revisión de protocolos',
      prioridad: 'baja',
      estado: 'abierto',
      fechaCreacion: '2024-09-19',
      descripcion: 'Actualización de medidas de seguridad en entrenamientos individuales'
    }
  ]

  // Datos simulados para alertas pendientes
  const alertasPendientes: Alerta[] = [
    {
      id: 'alerta_001',
      titulo: 'Certificación DPD próxima a vencer',
      tipo: 'urgente',
      descripcion: 'Su certificación como Delegado de Protección de Datos vence en 15 días (24 de octubre)',
      fechaCreacion: '2024-09-26',
      accionRequerida: 'Renovar certificación antes del vencimiento'
    },
    {
      id: 'alerta_002',
      titulo: 'Revisión mensual de protocolos pendiente',
      tipo: 'importante',
      descripcion: 'La revisión mensual de protocolos de protección está atrasada 3 días',
      fechaCreacion: '2024-09-23',
      accionRequerida: 'Completar revisión mensual de protocolos'
    }
  ]

  // Datos para el calendario anual
  const eventosCalendario: EventoCalendario[] = [
    {
      id: 'cert_delegado',
      titulo: 'Certificación Delegado Principal obtenida',
      fecha: '2024-01-15',
      tipo: 'certificacion',
      descripcion: 'Certificación inicial como Delegado Principal de Protección',
      estado: 'completado',
      requiereEmail: false,
      diasAnticipacion: 0
    },
    {
      id: 'cert_suplente',
      titulo: 'Certificación Delegado Suplente obtenida',
      fecha: '2024-01-20',
      tipo: 'certificacion',
      descripcion: 'Certificación del Delegado Suplente de Protección',
      estado: 'completado',
      requiereEmail: false,
      diasAnticipacion: 0
    },
    {
      id: 'contrato_custodia360',
      titulo: 'Contratación Custodia360',
      fecha: '2024-01-01',
      tipo: 'contrato',
      descripcion: 'Inicio del servicio Custodia360 para cumplimiento LOPIVI',
      estado: 'completado',
      requiereEmail: false,
      diasAnticipacion: 0
    },
    {
      id: 'renovacion_cert_principal',
      titulo: 'Renovación Certificación Delegado Principal',
      fecha: '2025-01-15',
      tipo: 'renovacion',
      descripcion: 'Renovación anual de la certificación del Delegado Principal',
      estado: 'pendiente',
      requiereEmail: true,
      diasAnticipacion: 30
    },
    {
      id: 'renovacion_cert_suplente',
      titulo: 'Renovación Certificación Delegado Suplente',
      fecha: '2025-01-20',
      tipo: 'renovacion',
      descripcion: 'Renovación anual de la certificación del Delegado Suplente',
      estado: 'pendiente',
      requiereEmail: true,
      diasAnticipacion: 30
    },
    {
      id: 'auditoria_q1',
      titulo: 'Auditoría Mapa de Riesgos Q1',
      fecha: '2024-03-31',
      tipo: 'auditoria',
      descripcion: 'Auditoría trimestral del mapa de riesgos',
      estado: 'completado',
      requiereEmail: false,
      diasAnticipacion: 15
    },
    {
      id: 'auditoria_q2',
      titulo: 'Auditoría Mapa de Riesgos Q2',
      fecha: '2024-06-30',
      tipo: 'auditoria',
      descripcion: 'Auditoría trimestral del mapa de riesgos',
      estado: 'completado',
      requiereEmail: false,
      diasAnticipacion: 15
    },
    {
      id: 'auditoria_q3',
      titulo: 'Auditoría Mapa de Riesgos Q3',
      fecha: '2024-09-30',
      tipo: 'auditoria',
      descripcion: 'Auditoría trimestral del mapa de riesgos',
      estado: 'completado',
      requiereEmail: false,
      diasAnticipacion: 15
    },
    {
      id: 'auditoria_q4',
      titulo: 'Auditoría Mapa de Riesgos Q4',
      fecha: '2024-12-31',
      tipo: 'auditoria',
      descripcion: 'Auditoría trimestral del mapa de riesgos',
      estado: 'pendiente',
      requiereEmail: true,
      diasAnticipacion: 15
    },
    {
      id: 'renovacion_contrato',
      titulo: 'Renovación Contrato Custodia360',
      fecha: '2025-01-01',
      tipo: 'renovacion',
      descripcion: 'Renovación anual del contrato con Custodia360',
      estado: 'pendiente',
      requiereEmail: true,
      diasAnticipacion: 60
    },
    {
      id: 'formacion_continua_q2',
      titulo: 'Formación Continua Q2',
      fecha: '2024-06-15',
      tipo: 'formacion',
      descripcion: 'Formación continua obligatoria para delegados',
      estado: 'completado',
      requiereEmail: false,
      diasAnticipacion: 30
    },
    {
      id: 'formacion_continua_q4',
      titulo: 'Formación Continua Q4',
      fecha: '2024-12-15',
      tipo: 'formacion',
      descripcion: 'Formación continua obligatoria para delegados',
      estado: 'pendiente',
      requiereEmail: true,
      diasAnticipacion: 30
    }
  ]

  // Datos simulados para acciones pendientes (delegado principal)
  const accionesPendientes: AccionPendiente[] = [
    {
      id: 'accion_001',
      titulo: 'Actualizar protocolos de vestuarios',
      descripcion: 'Revisar y actualizar los protocolos específicos para el uso de vestuarios según nuevas directrices',
      prioridad: 'alta',
      porcentajeImpacto: 2,
      pasos: [
        'Revisar directrices LOPIVI actualizadas sobre vestuarios',
        'Redactar nuevos protocolos específicos para la entidad',
        'Coordinar implementación con personal técnico',
        'Formar al personal en nuevos procedimientos',
        'Documentar y validar cumplimiento'
      ]
    },
    {
      id: 'accion_002',
      titulo: 'Completar formación de 2 miembros del personal',
      descripcion: 'Organizar y supervisar la formación pendiente para completar el 100% de cumplimiento',
      prioridad: 'media',
      porcentajeImpacto: 1,
      pasos: [
        'Contactar con los 2 miembros pendientes de formación',
        'Programar sesiones de formación LOPIVI',
        'Supervisar completamiento de módulos online',
        'Validar certificación de formación recibida',
        'Actualizar registro de personal formado'
      ]
    }
  ]

  const estadoCertificacion = {
    fechaEmision: '2024-01-15',
    fechaVencimiento: '2025-01-15',
    diasRestantes: 340,
    estadoVigencia: 'vigente' as const,
    requiereRenovacion: false,
    proximaFormacionRequerida: '2024-12-15'
  }

  // Estados para funcionalidad de recordatorios
  const [recordatorioEditandoId, setRecordatorioEditandoId] = useState<string | null>(null)
  const [recordatorioEditado, setRecordatorioEditado] = useState({
    titulo: '',
    descripcion: '',
    fechaVencimiento: '',
    prioridad: 'media' as 'alta' | 'media' | 'baja'
  })

  // Estado para tipo de caso urgente seleccionado
  const [casoUrgenteSeleccionado, setCasoUrgenteSeleccionado] = useState<string | null>(null)

  // Datos para recordatorios (delegado principal)
  const recordatorios = [
    {
      id: 'rec_001',
      titulo: 'Revisión mensual de protocolos',
      descripcion: 'Revisión programada de todos los protocolos de protección',
      fechaVencimiento: '2024-09-30',
      prioridad: 'alta' as const,
      tipo: 'revision' as const,
      asignadoA: 'Delegado Principal',
      estado: 'pendiente' as const
    },
    {
      id: 'rec_002',
      titulo: 'Coordinar con delegado suplente',
      descripcion: 'Reunión semanal de coordinación y seguimiento',
      fechaVencimiento: '2024-09-28',
      prioridad: 'media' as const,
      tipo: 'coordinacion' as const,
      asignadoA: 'Delegado Principal',
      estado: 'pendiente' as const
    }
  ]

  // Datos para casos urgentes (delegado principal)
  const casosUrgentes = [
    {
      id: 'urgente_principal_001',
      titulo: 'Comunicación inapropiada detectada',
      descripcion: 'Situación que requiere intervención inmediata del delegado principal',
      nivelUrgencia: 'alta' as const,
      tiempoTranscurrido: '30 minutos',
      estadoActual: 'investigacion_inicial',
      accionesRequeridas: [
        'Separar inmediatamente a las partes involucradas',
        'Documentar todos los detalles del incidente',
        'Notificar a autoridades competentes si es necesario',
        'Coordinar con delegado suplente sobre medidas',
        'Preparar informe detallado para autoridades'
      ]
    }
  ]

  // Datos para comunicaciones (delegado principal)
  const miembrosEntidad = [
    { id: 1, nombre: 'Juan Pérez', rol: 'Entrenador', email: 'juan@club.com', telefono: '666111222' },
    { id: 2, nombre: 'María García', rol: 'Monitora', email: 'maria@club.com', telefono: '666333444' },
    { id: 3, nombre: 'Carlos López', rol: 'Director Técnico', email: 'carlos@club.com', telefono: '666555666' },
    { id: 4, nombre: 'Ana Martín', rol: 'Coordinadora', email: 'ana@club.com', telefono: '666777888' }
  ]

  // Datos para nuevo caso (delegado principal)
  const [nuevoCaso, setNuevoCaso] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'media' as 'alta' | 'media' | 'baja',
    categoria: 'investigacion' as 'investigacion' | 'prevencion' | 'comunicacion' | 'seguimiento',
    personasInvolucradas: '',
    fechaIncidente: new Date().toISOString().split('T')[0],
    ubicacion: '',
    medidasInmediatas: '',
    requiereNotificacion: false,
    coordinacionSuplente: true
  })

  // Handlers para recordatorios
  const handleEditarRecordatorio = (id: string) => {
    const recordatorio = recordatorios.find(r => r.id === id)
    if (recordatorio) {
      setRecordatorioEditandoId(id)
      setRecordatorioEditado({
        titulo: recordatorio.titulo,
        descripcion: recordatorio.descripcion,
        fechaVencimiento: recordatorio.fechaVencimiento,
        prioridad: recordatorio.prioridad
      })
    }
  }

  const handleGuardarRecordatorio = () => {
    // Aquí iría la lógica para guardar el recordatorio editado
    alert(`Recordatorio ${recordatorioEditandoId} actualizado correctamente`)
    setRecordatorioEditandoId(null)
  }

  const handleCompletarRecordatorio = (id: string) => {
    // Aquí iría la lógica para marcar como completado
    alert(`Recordatorio ${id} marcado como completado`)
  }

  const handleEliminarRecordatorio = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este recordatorio?')) {
      // Aquí iría la lógica para eliminar
      alert(`Recordatorio ${id} eliminado correctamente`)
    }
  }

  // Tipos de casos urgentes para delegado principal
  const tiposCasosUrgentes = [
    {
      id: 'comunicacion_inapropiada',
      titulo: 'Comunicación inapropiada detectada',
      categoria: 'Intervención Principal',
      nivelUrgencia: 'critica' as const,
      tiempoMaximoRespuesta: '15 minutos',
      icono: '',
      descripcion: 'Situaciones de comunicación inapropiada que requieren actuación inmediata',
      protocoloActuacion: [
        {
          paso: 1,
          accion: 'SEPARACIÓN INMEDIATA (0-5 minutos)',
          detalle: 'Separar a las partes involucradas y asegurar el entorno'
        },
        {
          paso: 2,
          accion: 'DOCUMENTACIÓN URGENTE (5-15 minutos)',
          detalle: 'Registrar todos los detalles mientras están frescos'
        },
        {
          paso: 3,
          accion: 'EVALUACIÓN DE GRAVEDAD (15-30 minutos)',
          detalle: 'Determinar si requiere notificación a autoridades'
        },
        {
          paso: 4,
          accion: 'NOTIFICACIÓN AUTORIDADES (30-60 minutos)',
          detalle: 'Contactar con servicios sociales o policía si es necesario'
        },
        {
          paso: 5,
          accion: 'COORDINACIÓN Y SEGUIMIENTO (1-4 horas)',
          detalle: 'Coordinar con delegado suplente y preparar informes'
        }
      ]
    },
    {
      id: 'incidente_vestuarios',
      titulo: 'Incidente en vestuarios',
      categoria: 'Gestión Principal',
      nivelUrgencia: 'alta' as const,
      tiempoMaximoRespuesta: '30 minutos',
      icono: '',
      descripcion: 'Situaciones problemáticas en vestuarios que requieren gestión principal',
      protocoloActuacion: [
        {
          paso: 1,
          accion: 'VERIFICACIÓN INMEDIATA (0-10 minutos)',
          detalle: 'Verificar la situación y asegurar la privacidad'
        },
        {
          paso: 2,
          accion: 'SEPARACIÓN Y CONTENCIÓN (10-20 minutos)',
          detalle: 'Separar a los involucrados y establecer un perímetro seguro'
        },
        {
          paso: 3,
          accion: 'RECOPILACIÓN DE INFORMACIÓN (20-30 minutos)',
          detalle: 'Obtener testimonios y documentar la situación'
        },
        {
          paso: 4,
          accion: 'EVALUACIÓN Y DECISIÓN (30-60 minutos)',
          detalle: 'Determinar el nivel de gravedad y pasos a seguir'
        },
        {
          paso: 5,
          accion: 'IMPLEMENTACIÓN DE MEDIDAS (1-2 horas)',
          detalle: 'Implementar medidas correctivas y preventivas'
        }
      ]
    }
  ]

  const checkSession = (): SessionData | null => {
    try {
      console.log('Verificando sesión en dashboard delegado...')

      // Verificar en localStorage primero
      const persistentSession = localStorage.getItem('userSession')
      if (persistentSession) {
        const session = JSON.parse(persistentSession)
        console.log('Sesión encontrada en localStorage:', session)
        if (new Date(session.expiracion) > new Date()) {
          return session
        }
      }

      // Verificar en sessionStorage
      const tempSession = sessionStorage.getItem('userSession')
      if (tempSession) {
        const session = JSON.parse(tempSession)
        console.log('🔄 Sesión encontrada en sessionStorage:', session)
        if (new Date(session.expiracion) > new Date()) {
          return session
        }
      }

      // Verificar en userAuth como fallback
      const legacyAuth = localStorage.getItem('userAuth')
      if (legacyAuth) {
        const session = JSON.parse(legacyAuth)
        console.log('Sesión encontrada en userAuth (legacy):', session)
        if (new Date(session.expiracion) > new Date()) {
          return session
        }
      }

      console.log('❌ No se encontró sesión válida')
      return null
    } catch (error) {
      console.error('Error verificando sesión:', error)
      return null
    }
  }

  useEffect(() => {
    console.log('🔄 Iniciando verificación de sesión en dashboard delegado...')

    const session = checkSession()
    if (!session) {
      console.log('❌ No hay sesión válida, redirigiendo a login')
      router.push('/login')
      return
    }

    if (session.tipo !== 'principal') {
      console.log('❌ Usuario no es delegado principal, redirigiendo al dashboard apropiado')
      if (session.tipo === 'suplente') {
        router.push('/dashboard-suplente')
      } else {
        router.push('/login')
      }
      return
    }

    console.log('Sesión válida encontrada:', {
      nombre: session.nombre,
      tipo: session.tipo,
      entidad: session.entidad,
      certificacionVigente: session.certificacionVigente
    })

    setSessionData(session)
    setLoading(false)
  }, [router])

  const marcarEventoComoOk = (eventoId: string) => {
    setEventosMarcadosOk(prev => [...prev, eventoId])
    setAlertasDesactivadas(prev => [...prev, eventoId])
    // Aquí iría la lógica para enviar email de confirmación
    alert(`Evento marcado como OK. Se ha enviado confirmación por email.`)
  }

  const enviarNotificacionEmail = (eventoId: string) => {
    // Aquí iría la lógica para enviar email
    alert(`Notificación por email enviada para el evento ${eventoId}`)
  }

  const getEventoColor = (tipo: string) => {
    switch (tipo) {
      case 'certificacion': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'renovacion': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'auditoria': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'contrato': return 'bg-green-100 text-green-800 border-green-200'
      case 'formacion': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEventosProximos = () => {
    const hoy = new Date()
    const treintaDias = new Date(hoy.getTime() + (30 * 24 * 60 * 60 * 1000))

    return eventosCalendario.filter(evento => {
      const fechaEvento = new Date(evento.fecha)
      return fechaEvento >= hoy && fechaEvento <= treintaDias && evento.estado === 'pendiente'
    }).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
  }

  const getEventosPorTrimestre = (trimestre: number) => {
    const mesesTrimestre = {
      1: [0, 1, 2], // Q1: Enero, Febrero, Marzo
      2: [3, 4, 5], // Q2: Abril, Mayo, Junio
      3: [6, 7, 8], // Q3: Julio, Agosto, Septiembre
      4: [9, 10, 11] // Q4: Octubre, Noviembre, Diciembre
    }

    return eventosCalendario.filter(evento => {
      const fechaEvento = new Date(evento.fecha)
      return mesesTrimestre[trimestre].includes(fechaEvento.getMonth())
    })
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'media': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'baja': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTipoAlertaColor = (tipo: string) => {
    switch (tipo) {
      case 'urgente': return 'text-red-600 bg-red-50 border-red-200'
      case 'importante': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'informativa': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Acceso no autorizado</p>
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-600 text-xl font-bold mr-4">
                DP
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard del Delegado/a de Protección Principal</h1>
                <div className="text-blue-100 space-y-1">
                  <div><strong>Entidad:</strong> {sessionData.entidad}</div>
                  <div><strong>Delegado/a Principal:</strong> {sessionData.nombre}</div>
                  <div><strong>Delegado/a Suplente:</strong> {delegadoSuplente.nombre}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-green-500 w-3 h-3 rounded-full"></span>
                <span className="text-green-100">Certificado Vigente</span>
              </div>
              <div className="text-blue-100 text-sm">
                Sistema LOPIVI Activo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estado de la entidad con botón de acciones */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Estado de la entidad - Vista Principal</h2>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-blue-600 mr-2">97%</span>
              <span className="text-gray-600">Cumplimiento LOPIVI</span>
            </div>
          </div>
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: '97%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Como Delegado Principal, usted lidera la implementación del cumplimiento LOPIVI en la entidad
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAccionesPendientes(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              📋 Ver acciones de apoyo pendientes
            </button>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Casos Activos</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
                <button
                  onClick={() => setShowCasosActivos(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Gestionar →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertas Pendientes</p>
                <p className="text-3xl font-bold text-gray-900">2</p>
                <button
                  onClick={() => setShowAlertasPendientes(true)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Revisar →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cumplimiento</p>
                <p className="text-3xl font-bold text-gray-900">97%</p>
                <button
                  onClick={() => setShowCumplimiento(true)}
                  className="text-sm text-orange-600 hover:text-orange-800 font-medium transition-colors"
                >
                  Completar →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certificación Principal</p>
                <p className="text-3xl font-bold text-gray-900">{estadoCertificacion.diasRestantes}</p>
                <button
                  onClick={() => setShowEstadoCertificacion(true)}
                  className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
                >
                  Ver Estado →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calendario</p>
                <p className="text-3xl font-bold text-gray-900">{getEventosProximos().length}</p>
                <button
                  onClick={() => setShowCalendario(true)}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  Ver Fechas →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Principales */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Acciones Principales - Delegado Principal</h3>
            <button
              onClick={() => setShowCasosUrgentes(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              Casos Urgentes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <h4 className="text-lg font-bold text-blue-600 mb-2">Reportar Nuevo Caso</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Gestionar casos como delegado principal
                </p>
                <button
                  onClick={() => setShowNuevoCaso(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Registrar →
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <h4 className="text-lg font-bold text-orange-600 mb-2">Mapa de Riesgos</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Gestión completa del mapa de riesgos
                </p>
                <button
                  onClick={() => setShowMapaRiesgos(true)}
                  className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                >
                  Gestionar →
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <h4 className="text-lg font-bold text-green-600 mb-2">Gestionar Recordatorios</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Seguimientos y tareas asignadas
                </p>
                <button
                  onClick={() => setShowRecordatorios(true)}
                  className="text-green-600 hover:text-green-800 font-medium transition-colors"
                >
                  Gestionar →
                </button>
              </div>
            </div>
          </div>

          {/* Segunda fila de acciones - Principal */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <h4 className="text-lg font-bold text-blue-600 mb-2">Gestión Comunicaciones</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comunicar con miembros de la entidad
                </p>
                <button
                  onClick={() => setShowComunicaciones(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Gestionar →
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <h4 className="text-lg font-bold text-red-600 mb-2">Documentación</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Certificados antecedentes penales
                </p>
                <button
                  onClick={() => setShowGestionDocumentacion(true)}
                  className="text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Gestionar →
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <h4 className="text-lg font-bold text-cyan-600 mb-2">Backup y Exportación</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Acceso a backup y exportación legal
                </p>
                <button
                  onClick={() => setShowBackupExportacion(true)}
                  className="text-cyan-600 hover:text-cyan-800 font-medium transition-colors"
                >
                  Acceder →
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <h4 className="text-lg font-bold text-indigo-600 mb-2">Informes Mensuales</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Consultar informes y estadísticas
                </p>
                <button
                  onClick={() => setShowInformesMensuales(true)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Ver Informes →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Información específica del delegado principal */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h4 className="text-lg font-bold text-blue-900 mb-4">Funciones como Delegado Principal</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-semibold text-blue-800">Responsabilidades principales:</h5>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Liderar la implementación del cumplimiento LOPIVI</li>
                <li>• Gestionar casos y situaciones de riesgo</li>
                <li>• Coordinar con el delegado suplente</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-semibold text-blue-800">Liderazgo:</h5>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Toma de decisiones principales</li>
                <li>• Comunicación con autoridades</li>
                <li>• Supervisión del sistema completo</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="flex justify-center">
              <Link
                href="/formacion-lopivi/campus"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
Acceder a Formación LOPIVI
              </Link>
            </div>
          </div>
        </div>

        {/* Tareas Pendientes */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Tareas Pendientes - Delegado Principal</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-800">Actualizar protocolos de vestuarios</span>
              <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">2 días</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-800">Completar formación de 2 miembros del personal</span>
              <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">5 días</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-800">Revisar mapa de riesgos trimestral</span>
              <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">10 días</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Casos Activos */}
      {showCasosActivos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Casos Activos</h2>
                  <p className="text-sm text-gray-600">Gestión de casos abiertos en la entidad</p>
                </div>
                <button
                  onClick={() => setShowCasosActivos(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">3 Casos Activos</h3>
                  <button
                    onClick={() => setShowNuevoCaso(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                  >
                    Nuevo Caso
                  </button>
                </div>

                <div className="space-y-4">
                  {casosActivos.map((caso) => (
                    <div key={caso.id} className={`border rounded-lg p-4 ${
                      caso.prioridad === 'alta' ? 'border-red-200 bg-red-50' :
                      caso.prioridad === 'media' ? 'border-orange-200 bg-orange-50' :
                      'border-yellow-200 bg-yellow-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                              caso.prioridad === 'alta' ? 'bg-red-600' :
                              caso.prioridad === 'media' ? 'bg-orange-600' :
                              'bg-yellow-600'
                            }`}>
                              {caso.prioridad.toUpperCase()}
                            </span>
                            <h4 className="font-semibold text-gray-900">{caso.titulo}</h4>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{caso.descripcion}</p>
                          <div className="text-xs text-gray-500">
                            Creado: {new Date(caso.fechaCreacion).toLocaleDateString()} | Estado: {caso.estado}
                          </div>
                        </div>
                        <Link
                          href={`/dashboard-delegado/gestionar-caso?id=${caso.id}`}
                          className={`px-3 py-1 rounded text-sm text-white hover:opacity-80 ${
                            caso.prioridad === 'alta' ? 'bg-red-600' :
                            caso.prioridad === 'media' ? 'bg-orange-600' :
                            'bg-yellow-600'
                          }`}
                        >
                          Gestionar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>Total de casos: 3 activos, 12 resueltos este año</div>
                  <Link
                    href="/dashboard-delegado/gestionar-caso"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver todos los casos →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Alertas Pendientes */}
      {showAlertasPendientes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Alertas Pendientes</h2>
                  <p className="text-sm text-gray-600">Alertas que requieren atención inmediata</p>
                </div>
                <button
                  onClick={() => setShowAlertasPendientes(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">2 Alertas Pendientes</h3>
                  <Link
                    href="/dashboard-delegado/resolver-alertas"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700"
                  >
                    Resolver Todas
                  </Link>
                </div>

                <div className="space-y-4">
                  {alertasPendientes.map((alerta) => (
                    <div key={alerta.id} className={`border rounded-lg p-4 ${
                      alerta.tipo === 'urgente' ? 'border-red-200 bg-red-50' :
                      alerta.tipo === 'importante' ? 'border-orange-200 bg-orange-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`rounded-full p-2 ${
                          alerta.tipo === 'urgente' ? 'bg-red-600' :
                          alerta.tipo === 'importante' ? 'bg-orange-600' :
                          'bg-blue-600'
                        }`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{alerta.titulo}</h4>
                          <p className="text-gray-600 text-sm mb-2">{alerta.descripcion}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                            <span>Urgencia: {alerta.tipo}</span>
                            <span>•</span>
                            <span>Creado: {new Date(alerta.fechaCreacion).toLocaleDateString()}</span>
                          </div>
                          <button className={`px-3 py-1 rounded text-sm text-white hover:opacity-80 ${
                            alerta.tipo === 'urgente' ? 'bg-red-600' :
                            alerta.tipo === 'importante' ? 'bg-orange-600' :
                            'bg-blue-600'
                          }`}>
                            {alerta.accionRequerida}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>2 alertas pendientes de resolución</div>
                  <Link
                    href="/dashboard-delegado/resolver-alertas"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver historial de alertas →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Calendario */}
      {showCalendario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Calendario Anual Custodia360</h2>
                  <p className="text-sm text-gray-600">Fechas importantes para el cumplimiento LOPIVI</p>
                </div>
                <button
                  onClick={() => setShowCalendario(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Leyenda */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Leyenda de Eventos</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                    <span className="text-sm text-gray-600">Certificaciones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
                    <span className="text-sm text-gray-600">Renovaciones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div>
                    <span className="text-sm text-gray-600">Auditorías</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                    <span className="text-sm text-gray-600">Contratos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-indigo-100 border border-indigo-200 rounded"></div>
                    <span className="text-sm text-gray-600">Formación</span>
                  </div>
                </div>
              </div>

              {/* Eventos próximos */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Eventos Próximos (30 días)</h3>
                {getEventosProximos().length > 0 ? (
                  <div className="space-y-3">
                    {getEventosProximos().map((evento) => (
                      <div key={evento.id} className={`border rounded-lg p-4 ${getEventoColor(evento.tipo)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{evento.titulo}</h4>
                            <p className="text-sm mb-2">{evento.descripcion}</p>
                            <div className="text-xs">
                              Fecha: {new Date(evento.fecha).toLocaleDateString()} | Tipo: {evento.tipo}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!eventosMarcadosOk.includes(evento.id) && (
                              <button
                                onClick={() => marcarEventoComoOk(evento.id)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                Marcar OK
                              </button>
                            )}
                            {evento.requiereEmail && !alertasDesactivadas.includes(evento.id) && (
                              <button
                                onClick={() => enviarNotificacionEmail(evento.id)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                              >
                                Enviar Email
                              </button>
                            )}
                          </div>
                        </div>
                        {eventosMarcadosOk.includes(evento.id) && (
                          <div className="mt-2 text-green-600 text-sm font-medium">
                            ✓ Marcado como completado
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay eventos próximos en los próximos 30 días</p>
                )}
              </div>

              {/* Vista trimestral */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Vista por Trimestres 2024</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((trimestre) => (
                    <div key={trimestre} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Q{trimestre} - {
                        trimestre === 1 ? 'Enero - Marzo' :
                        trimestre === 2 ? 'Abril - Junio' :
                        trimestre === 3 ? 'Julio - Septiembre' :
                        'Octubre - Diciembre'
                      }</h4>
                      <div className="space-y-2">
                        {getEventosPorTrimestre(trimestre).map((evento) => (
                          <div key={evento.id} className={`text-sm p-2 rounded border ${getEventoColor(evento.tipo)}`}>
                            <div className="font-medium">{evento.titulo}</div>
                            <div className="text-xs">{new Date(evento.fecha).toLocaleDateString()}</div>
                            <div className="flex items-center gap-1 mt-1">
                              <span className={`w-2 h-2 rounded-full ${
                                evento.estado === 'completado' ? 'bg-green-500' :
                                evento.estado === 'pendiente' ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}></span>
                              <span className="text-xs capitalize">{evento.estado}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen estadístico */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resumen Anual</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {eventosCalendario.filter(e => e.estado === 'completado').length}
                    </div>
                    <div className="text-sm text-green-600">Completados</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {eventosCalendario.filter(e => e.estado === 'pendiente').length}
                    </div>
                    <div className="text-sm text-orange-600">Pendientes</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {eventosCalendario.filter(e => e.requiereEmail).length}
                    </div>
                    <div className="text-sm text-blue-600">Con Alertas</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {eventosCalendario.length}
                    </div>
                    <div className="text-sm text-purple-600">Total Eventos</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Calendario actualizado automáticamente cada 24 horas
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700">
                      Exportar Calendario
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                      Configurar Alertas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cumplimiento */}
      {showCumplimiento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Estado de Cumplimiento LOPIVI</h2>
                  <p className="text-sm text-gray-600">Progreso actual: 97% completado</p>
                </div>
                <button
                  onClick={() => setShowCumplimiento(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div className="bg-green-500 h-4 rounded-full" style={{ width: '97%' }}></div>
                </div>
                <p className="text-center text-gray-600">97% de cumplimiento LOPIVI completado</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Pendientes para Completar el 3% Restante</h3>
                <div className="space-y-4">
                  <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Actualización de Protocolos de Vestuarios</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      Revisar y actualizar los protocolos específicos para el uso de vestuarios según nuevas directrices
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Impacto: 2%</span>
                      <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700">
                        Completar Ahora
                      </button>
                    </div>
                  </div>

                  <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Formación Adicional del Personal</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      Completar la formación pendiente para 2 miembros del personal técnico
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Impacto: 1%</span>
                      <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">
                        Programar Formación
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-center">
                  <Link
                    href="/dashboard-delegado/cumplimiento"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                  >
                    Ver Detalles Completos del Cumplimiento
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Certificación */}
      {showEstadoCertificacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Estado de Certificación</h2>
                  <p className="text-sm text-gray-600">Certificación vigente hasta enero 2025</p>
                </div>
                <button
                  onClick={() => setShowEstadoCertificacion(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-600 rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">Certificación Vigente</h3>
                      <p className="text-green-700 text-sm">340 días restantes hasta la renovación</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Detalles de Certificación</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Fecha de emisión:</strong> 15 de enero, 2024</div>
                    <div><strong>Fecha de vencimiento:</strong> 15 de enero, 2025</div>
                    <div><strong>Tipo:</strong> Delegado Principal LOPIVI</div>
                    <div><strong>Código:</strong> DP-2024-001-{sessionData?.id}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Historial de Formación</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Formación inicial LOPIVI</span>
                      <span className="text-green-600">✓ Completada</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Módulo avanzado de protección</span>
                      <span className="text-green-600">✓ Completada</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Formación continua Q2</span>
                      <span className="text-green-600">✓ Completada</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Formación continua Q4</span>
                      <span className="text-orange-600">⏳ Pendiente</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Próximos Requisitos</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Formación continua Q4 (diciembre 2024)</li>
                  <li>• Renovación de certificación (enero 2025)</li>
                  <li>• Evaluación anual de competencias (diciembre 2024)</li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-center gap-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                    Descargar Certificado
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700">
                    Programar Renovación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Acciones Pendientes */}
      {showAccionesPendientes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Acciones Pendientes - Delegado Principal</h2>
                <button
                  onClick={() => setShowAccionesPendientes(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">Estado Actual: 97% de Cumplimiento</h3>
                <p className="text-blue-800 text-sm">Como delegado principal, sus acciones contribuyen al {accionesPendientes.reduce((acc, acc_item) => acc + acc_item.porcentajeImpacto, 0)}% restante para completar el 100%</p>
              </div>

              {accionesPendientes.map((accion) => (
                <div key={accion.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{accion.titulo}</h3>
                      <p className="text-gray-600 text-sm">{accion.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded border ${getPrioridadColor(accion.prioridad)}`}>
                        {accion.prioridad.toUpperCase()}
                      </span>
                      <span className="text-blue-600 font-bold text-sm">+{accion.porcentajeImpacto}%</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Pasos para completar:</h4>
                    <ol className="space-y-2">
                      {accion.pasos.map((paso, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 text-sm">{paso}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Estado Certificación */}
      {showEstadoCertificacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Estado de Certificación Principal</h2>
                <button
                  onClick={() => setShowEstadoCertificacion(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-green-900">Certificación Principal Vigente</h3>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">ACTIVA</span>
                </div>
                <p className="text-green-800 text-sm mt-1">Su certificación como Delegado/a Principal está en regla</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Información de Certificación</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha de Emisión:</span>
                      <span className="font-medium">{new Date(estadoCertificacion.fechaEmision).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha de Vencimiento:</span>
                      <span className="font-medium">{new Date(estadoCertificacion.fechaVencimiento).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Días Restantes:</span>
                      <span className={`font-medium ${estadoCertificacion.diasRestantes > 90 ? 'text-green-600' : estadoCertificacion.diasRestantes > 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {estadoCertificacion.diasRestantes} días
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className="text-green-600 font-medium">Vigente</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Próximas Acciones</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Formación Continua:</span>
                      <span className="font-medium">{new Date(estadoCertificacion.proximaFormacionRequerida).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Renovación Requerida:</span>
                      <span className="text-gray-600">No requerida</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Funciones como Delegado Principal</h4>
                <p className="text-blue-800 text-sm mb-3">Su certificación le habilita para:</p>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Liderar la implementación del cumplimiento LOPIVI</li>
                  <li>• Gestionar casos y situaciones de riesgo</li>
                  <li>• Coordinar con el delegado suplente</li>
                  <li>• Tomar decisiones principales en protección infantil</li>
                  <li>• Comunicación directa con autoridades competentes</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Contacto para Renovación</h4>
                <div className="text-blue-800 text-sm space-y-1">
                  <p><strong>Email:</strong> info@custodia360.com</p>
                  <p><strong>Teléfono:</strong> 678 771 198</p>
                  <p><strong>Horario:</strong> Lunes a Viernes 9:00 - 17:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Caso - Principal */}
      {showNuevoCaso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Registrar Nuevo Caso - Delegado Principal</h2>
                <button
                  onClick={() => setShowNuevoCaso(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Sección de ayuda para catalogar incidentes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-3">Cómo catalogar la prioridad como Delegado Principal</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-semibold text-red-800 mb-2">🔴 PRIORIDAD ALTA</h4>
                    <ul className="text-red-700 text-xs space-y-1">
                      <li>• Situación de riesgo inmediato</li>
                      <li>• Requiere notificación a autoridades</li>
                      <li>• Contacto inapropiado confirmado</li>
                      <li>• Emergencia que requiere actuación</li>
                      <li>• Violación grave de protocolos</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-semibold text-yellow-800 mb-2">🟡 PRIORIDAD MEDIA</h4>
                    <ul className="text-yellow-700 text-xs space-y-1">
                      <li>• Comportamiento preocupante</li>
                      <li>• Incumplimiento de protocolos</li>
                      <li>• Necesita investigación</li>
                      <li>• Coordinación con suplente</li>
                      <li>• Formación adicional requerida</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-2">🟢 PRIORIDAD BAJA</h4>
                    <ul className="text-green-700 text-xs space-y-1">
                      <li>• Observación preventiva</li>
                      <li>• Mejora de protocolos</li>
                      <li>• Seguimiento rutinario</li>
                      <li>• Consulta administrativa</li>
                      <li>• Documentación general</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-2">Autoridad de Delegado Principal</h3>
                <p className="text-blue-800 text-sm">Como delegado principal, tiene autoridad completa para gestionar casos y tomar decisiones de protección infantil.</p>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título del caso *</label>
                    <input
                      type="text"
                      value={nuevoCaso.titulo}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, titulo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Comunicación inapropiada detectada"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad * (ver guía arriba)</label>
                    <select
                      value={nuevoCaso.prioridad}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, prioridad: e.target.value as 'alta' | 'media' | 'baja' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="baja">Baja - Seguimiento rutinario</option>
                      <option value="media">Media - Requiere investigación</option>
                      <option value="alta">Alta - Requiere acción inmediata</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de caso *</label>
                    <select
                      value={nuevoCaso.categoria}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, categoria: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="investigacion">Investigación</option>
                      <option value="prevencion">Prevención</option>
                      <option value="comunicacion">Comunicación</option>
                      <option value="seguimiento">Seguimiento</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha del incidente</label>
                    <input
                      type="date"
                      value={nuevoCaso.fechaIncidente}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, fechaIncidente: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción detallada *</label>
                  <textarea
                    value={nuevoCaso.descripcion}
                    onChange={(e) => setNuevoCaso(prev => ({ ...prev, descripcion: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe el caso de manera objetiva y detallada..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Personas involucradas</label>
                    <input
                      type="text"
                      value={nuevoCaso.personasInvolucradas}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, personasInvolucradas: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombres o identificación de personas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                    <input
                      type="text"
                      value={nuevoCaso.ubicacion}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, ubicacion: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Vestuario, pista 1, oficina..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medidas inmediatas tomadas</label>
                  <textarea
                    value={nuevoCaso.medidasInmediatas}
                    onChange={(e) => setNuevoCaso(prev => ({ ...prev, medidasInmediatas: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe las medidas que ha tomado como delegado principal..."
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={nuevoCaso.coordinacionSuplente}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, coordinacionSuplente: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Coordinar con delegado suplente
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={nuevoCaso.requiereNotificacion}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, requiereNotificacion: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Requiere notificación a autoridades
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNuevoCaso(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert('Caso registrado exitosamente')
                      setShowNuevoCaso(false)
                      setNuevoCaso({
                        titulo: '',
                        descripcion: '',
                        prioridad: 'media',
                        categoria: 'investigacion',
                        personasInvolucradas: '',
                        fechaIncidente: new Date().toISOString().split('T')[0],
                        ubicacion: '',
                        medidasInmediatas: '',
                        requiereNotificacion: false,
                        coordinacionSuplente: true
                      })
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Registrar Caso
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Mapa de Riesgos - Principal */}
      {showMapaRiesgos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Mapa de Riesgos - Gestión Principal</h2>
                <p className="text-sm text-gray-600">Gestión completa del mapa de riesgos de la entidad</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    alert('Descargando mapa de riesgos en PDF...')
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700"
                >
                  Descargar PDF
                </button>
                <button
                  onClick={() => setShowMapaRiesgos(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-2">Gestión Principal del Mapa de Riesgos</h3>
                <p className="text-blue-800 text-sm">Como delegado principal, usted tiene autoridad completa para gestionar, modificar y actualizar el mapa de riesgos de la entidad.</p>
              </div>

              {/* Mismo contenido del mapa pero con enfoque de principal */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-bold text-orange-900 mb-4">Mapa de Riesgos - Gestión Principal</h3>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <h4 className="font-bold text-red-900 mb-3">RIESGOS CRÍTICOS A GESTIONAR</h4>
                    <ul className="text-red-800 text-sm space-y-2">
                      <li>• <strong>Vestuarios:</strong> Implementar supervisión externa constante</li>
                      <li>• <strong>Comunicaciones:</strong> Establecer canales oficiales únicos</li>
                      <li>• <strong>Entrenamientos:</strong> Supervisar todas las relaciones adulto-menor</li>
                      <li>• <strong>Espacios cerrados:</strong> Eliminar situaciones de aislamiento</li>
                    </ul>
                  </div>

                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-3">AUTORIDAD PRINCIPAL</h4>
                    <ul className="text-blue-800 text-sm space-y-2">
                      <li>• <strong>Decisión:</strong> Autoridad para tomar decisiones finales</li>
                      <li>• <strong>Implementación:</strong> Liderar cambios en protocolos</li>
                      <li>• <strong>Comunicación:</strong> Contacto directo con autoridades</li>
                      <li>• <strong>Supervisión:</strong> Coordinar con delegado suplente</li>
                    </ul>
                  </div>
                </div>

                <div className="border border-orange-200 rounded-lg p-4">
                  <h4 className="font-bold text-orange-900 mb-3">GESTIÓN Y COORDINACIÓN</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-orange-800 mb-2">Liderazgo Principal</h5>
                      <ul className="text-orange-700 text-sm space-y-1">
                        <li>• Toma de decisiones estratégicas</li>
                        <li>• Implementación de medidas correctivas</li>
                        <li>• Comunicación con autoridades competentes</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-orange-800 mb-2">Coordinación con Suplente</h5>
                      <ul className="text-orange-700 text-sm space-y-1">
                        <li>• Delegación de responsabilidades específicas</li>
                        <li>• Mantenimiento de continuidad en ausencias</li>
                        <li>• Formación y actualización del suplente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Recordatorios - Principal */}
      {showRecordatorios && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recordatorios - Delegado Principal</h2>
                <button
                  onClick={() => setShowRecordatorios(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-green-900 mb-2">Gestión de Recordatorios Principal</h3>
                <p className="text-green-800 text-sm">Sus recordatorios incluyen gestión principal y coordinación con el delegado suplente</p>
              </div>

              <div className="space-y-4">
                {recordatorios.map((recordatorio) => (
                  <div key={recordatorio.id} className="border border-gray-200 rounded-lg p-4">
                    {recordatorioEditandoId === recordatorio.id ? (
                      // Modo edición
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={recordatorioEditado.titulo}
                            onChange={(e) => setRecordatorioEditado(prev => ({ ...prev, titulo: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Título del recordatorio"
                          />
                          <input
                            type="date"
                            value={recordatorioEditado.fechaVencimiento}
                            onChange={(e) => setRecordatorioEditado(prev => ({ ...prev, fechaVencimiento: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <select
                            value={recordatorioEditado.prioridad}
                            onChange={(e) => setRecordatorioEditado(prev => ({ ...prev, prioridad: e.target.value as 'alta' | 'media' | 'baja' }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="baja">Prioridad Baja</option>
                            <option value="media">Prioridad Media</option>
                            <option value="alta">Prioridad Alta</option>
                          </select>
                        </div>
                        <textarea
                          value={recordatorioEditado.descripcion}
                          onChange={(e) => setRecordatorioEditado(prev => ({ ...prev, descripcion: e.target.value }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Descripción del recordatorio"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleGuardarRecordatorio}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setRecordatorioEditandoId(null)}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Modo visualización
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">{recordatorio.titulo}</h3>
                            <span className={`text-xs px-2 py-1 rounded border ${getPrioridadColor(recordatorio.prioridad)}`}>
                              {recordatorio.prioridad.toUpperCase()}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600">
                              {recordatorio.tipo.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{recordatorio.descripcion}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Vence: {new Date(recordatorio.fechaVencimiento).toLocaleDateString('es-ES')}</span>
                            <span>Asignado a: {recordatorio.asignadoA}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditarRecordatorio(recordatorio.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleCompletarRecordatorio(recordatorio.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                          >
                            Completar
                          </button>
                          <button
                            onClick={() => handleEliminarRecordatorio(recordatorio.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Casos Urgentes - Principal con teléfonos */}
      {showCasosUrgentes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-orange-900">
                    Tipos de Casos Urgentes - Principal
                  </h2>
                </div>
                <button
                  onClick={() => setShowCasosUrgentes(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-orange-900 mb-2">TELÉFONOS DE EMERGENCIA - DELEGADO/A PRINCIPAL DE PROTECCIÓN</h3>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white p-3 rounded border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">EMERGENCIAS CRÍTICAS (24/7)</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Policía Nacional:</strong> <span className="font-mono text-orange-700">091</span></div>
                      <div><strong>Guardia Civil:</strong> <span className="font-mono text-orange-700">062</span></div>
                      <div><strong>Emergencias Generales:</strong> <span className="font-mono text-orange-700">112</span></div>
                      <div><strong>Teléfono ANAR (Niños):</strong> <span className="font-mono text-orange-700">900 20 20 10</span></div>
                      <div><strong>Teléfono ANAR (Adultos):</strong> <span className="font-mono text-orange-700">600 50 51 52</span></div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">🏛️ SERVICIOS SOCIALES Y PROTECCIÓN</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Servicios Sociales:</strong> <span className="font-mono text-orange-700">900 85 23 52</span></div>
                      <div><strong>Fiscalía de Menores:</strong> <span className="font-mono text-orange-700">915 93 15 00</span></div>
                      <div><strong>Defensor del Menor:</strong> <span className="font-mono text-orange-700">915 63 44 11</span></div>
                      <div><strong>Centro Mujer 24h:</strong> <span className="font-mono text-orange-700">016</span></div>
                      <div><strong>Custodia360 Urgencias:</strong> <span className="font-mono text-orange-700">678 771 198</span></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 text-sm">
                    <strong>PROTOCOLO PRINCIPAL:</strong> Como delegado/a principal, tiene autoridad completa para contactar directamente con
                    cualquier autoridad competente y tomar decisiones inmediatas de protección.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-2">Casos Urgentes para Delegados Principales</h3>
                <p className="text-blue-800 text-sm">Como Delegado Principal, seleccione el tipo de situación para ver el protocolo específico de actuación</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Comunicación inapropiada detectada</h3>
                      <p className="text-gray-600 text-sm mb-3">Protocolo de actuación principal para situaciones de comunicación inapropiada</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded font-bold bg-red-600 text-white">CRÍTICA</span>
                        <span className="text-xs text-gray-500">Actuación Principal</span>
                        <span className="text-xs text-blue-600">Máx: 15 min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Incidente en vestuarios</h3>
                      <p className="text-gray-600 text-sm mb-3">Gestión principal de situaciones problemáticas en vestuarios</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded font-bold bg-orange-600 text-white">ALTA</span>
                        <span className="text-xs text-gray-500">Gestión Principal</span>
                        <span className="text-xs text-blue-600">Máx: 30 min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Coordinación de emergencia</h3>
                      <p className="text-gray-600 text-sm mb-3">Liderazgo en situaciones que requieren coordinación con múltiples partes</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded font-bold bg-yellow-600 text-white">ALTA</span>
                        <span className="text-xs text-gray-500">Liderazgo</span>
                        <span className="text-xs text-blue-600">Máx: 1 hora</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Comunicación con autoridades</h3>
                      <p className="text-gray-600 text-sm mb-3">Protocolo de comunicación directa con servicios sociales y fuerzas de seguridad</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded font-bold bg-red-600 text-white">CRÍTICA</span>
                        <span className="text-xs text-gray-500">Comunicación Oficial</span>
                        <span className="text-xs text-blue-600">Inmediato</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Comunicaciones - Principal */}
      {showComunicaciones && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Comunicaciones - Delegado Principal</h2>
                <button
                  onClick={() => setShowComunicaciones(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-2">📢 Comunicaciones como Delegado Principal</h3>
                <p className="text-blue-800 text-sm">Como delegado principal, tiene autoridad completa para todas las comunicaciones oficiales relacionadas con protección infantil</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <h3 className="font-bold text-gray-900 mb-4">Miembros de la Entidad</h3>
                  <div className="space-y-2">
                    {miembrosEntidad.map((miembro) => (
                      <div key={miembro.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-gray-900">{miembro.nombre}</div>
                        <div className="text-xs text-gray-500">{miembro.rol}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Comunicación Principal</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left p-2 border border-blue-200 rounded text-sm bg-blue-50">
                        👤 Comunicación Oficial
                      </button>
                      <button className="w-full text-left p-2 border border-gray-200 rounded text-sm hover:bg-gray-50">
                        📧 Envío de Documentación
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <h3 className="font-bold text-gray-900 mb-4">Componer Comunicación Principal</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-800 text-sm">
                        <strong>Autoridad:</strong> Como delegado principal, sus comunicaciones tienen carácter oficial y pueden ser compartidas con autoridades.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Destinatarios</label>
                      <input
                        type="text"
                        placeholder="Seleccionar destinatarios..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                      <input
                        type="text"
                        placeholder="Asunto de la comunicación..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de comunicación</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>Comunicación oficial</option>
                        <option>Directiva de cumplimiento</option>
                        <option>Notificación de caso</option>
                        <option>Actualización de protocolos</option>
                        <option>Envío de documentación LOPIVI</option>
                      </select>
                    </div>

                    {/* Sección de documentación */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-3">📄 Documentación Disponible para Envío</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                          <span className="text-sm text-blue-800">Plan de Protección Completo</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                          <span className="text-sm text-blue-800">Protocolos de Actuación</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                          <span className="text-sm text-blue-800">Código de Conducta</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                          <span className="text-sm text-blue-800">Certificados de Delegados</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                          <span className="text-sm text-blue-800">Manual de Formación</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                          <span className="text-sm text-blue-800">Registro de Actividades</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                          <span className="text-sm text-blue-800">Mapa de Riesgos</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                          <span className="text-sm text-blue-800">Informes Oficiales</span>
                        </label>
                      </div>
                      <button
                        onClick={() => alert('Documentación incluida en comunicación oficial')}
                        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                      >
                        Incluir Documentación
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                      <textarea
                        rows={6}
                        placeholder="Escriba su comunicación como delegado principal..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Enviar Comunicación Oficial
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50">
                        Guardar Borrador
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Componentes de las nuevas funcionalidades */}
      <BackupExportacion
        entidadId={sessionData?.id || ''}
        isOpen={showBackupExportacion}
        onClose={() => setShowBackupExportacion(false)}
      />

      <InformesMensuales
        entidadId={sessionData?.id || ''}
        isOpen={showInformesMensuales}
        onClose={() => setShowInformesMensuales(false)}
      />

      <GestionDocumentacion
        entidadId={sessionData?.id || ''}
        isOpen={showGestionDocumentacion}
        onClose={() => setShowGestionDocumentacion(false)}
      />
    </div>
  )
}
