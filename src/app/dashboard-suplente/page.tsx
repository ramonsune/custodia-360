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

export default function DashboardSuplentePage() {
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
  const delegadoPrincipal = {
    nombre: 'Juan Carlos Pérez Ruiz',
    email: 'principal@custodia360.com',
    tipo: 'principal' as const
  }

  // Datos simulados
  const casosActivos: Caso[] = [
    {
      id: 'caso_001',
      titulo: 'Revisión protocolo de supervisión en entrenamientos',
      prioridad: 'media',
      estado: 'abierto',
      fechaCreacion: '2024-01-20',
      descripcion: 'Revisión de protocolos según las directrices del delegado principal.'
    },
    {
      id: 'caso_002',
      titulo: 'Seguimiento de caso de comunicación inapropiada',
      prioridad: 'alta',
      estado: 'en_proceso',
      fechaCreacion: '2024-01-18',
      descripcion: 'Apoyo en el seguimiento del caso detectado por el delegado principal.'
    },
    {
      id: 'caso_003',
      titulo: 'Coordinación con familias sobre nuevos protocolos',
      prioridad: 'baja',
      estado: 'abierto',
      fechaCreacion: '2024-01-15',
      descripcion: 'Apoyo en comunicación con familias sobre cambios en protocolos.'
    }
  ]

  const alertasPendientes: Alerta[] = [
    {
      id: 'alerta_001',
      titulo: 'Coordinación pendiente con delegado principal',
      tipo: 'importante',
      descripcion: 'Reunión semanal de coordinación programada para mañana',
      fechaCreacion: '2024-01-20',
      accionRequerida: 'Confirmar asistencia y preparar reporte de actividades de la semana'
    },
    {
      id: 'alerta_002',
      titulo: 'Formación continua programada',
      tipo: 'informativa',
      descripcion: 'Próxima sesión de formación continua para delegados suplentes',
      fechaCreacion: '2024-01-19',
      accionRequerida: 'Inscribirse en la formación continua del próximo mes'
    }
  ]

  const accionesPendientes: AccionPendiente[] = [
    {
      id: 'accion_001',
      titulo: 'Revisar protocolos actualizados por delegado principal',
      descripcion: 'Estudiar las actualizaciones realizadas en los protocolos de vestuarios',
      prioridad: 'alta',
      porcentajeImpacto: 1,
      pasos: [
        'Revisar documento actualizado de protocolos de vestuarios',
        'Coordinar con delegado principal sobre cambios específicos',
        'Practicar nuevos procedimientos durante la próxima supervisión',
        'Documentar dudas o sugerencias para próxima reunión',
        'Confirmar comprensión de todos los cambios implementados'
      ]
    },
    {
      id: 'accion_002',
      titulo: 'Completar observación práctica mensual',
      descripcion: 'Realizar observación práctica de supervisión en entrenamientos según agenda',
      prioridad: 'media',
      porcentajeImpacto: 2,
      pasos: [
        'Coordinar horario con delegado principal para observación conjunta',
        'Preparar lista de verificación para observación de protocolos',
        'Realizar observación de al menos 2 entrenamientos diferentes',
        'Documentar observaciones y posibles mejoras',
        'Presentar informe de observación al delegado principal'
      ]
    }
  ]

  const estadoCertificacion = {
    fechaEmision: '2024-01-01',
    fechaVencimiento: '2025-01-01',
    diasRestantes: 340,
    estadoVigencia: 'vigente' as const,
    requiereRenovacion: false,
    proximaFormacionRequerida: '2024-10-01'
  }

  // Datos para el calendario anual (suplente)
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
      descripcion: 'Mi certificación como Delegado Suplente de Protección',
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
      titulo: 'Mi Renovación de Certificación',
      fecha: '2025-01-20',
      tipo: 'renovacion',
      descripcion: 'Renovación anual de mi certificación como Delegado Suplente',
      estado: 'pendiente',
      requiereEmail: true,
      diasAnticipacion: 30
    },
    {
      id: 'coordinacion_mensual_oct',
      titulo: 'Coordinación Mensual con Delegado Principal',
      fecha: '2024-10-15',
      tipo: 'formacion',
      descripcion: 'Reunión mensual de coordinación y seguimiento',
      estado: 'pendiente',
      requiereEmail: true,
      diasAnticipacion: 3
    },
    {
      id: 'coordinacion_mensual_nov',
      titulo: 'Coordinación Mensual con Delegado Principal',
      fecha: '2024-11-15',
      tipo: 'formacion',
      descripcion: 'Reunión mensual de coordinación y seguimiento',
      estado: 'pendiente',
      requiereEmail: true,
      diasAnticipacion: 3
    },
    {
      id: 'coordinacion_mensual_dic',
      titulo: 'Coordinación Mensual con Delegado Principal',
      fecha: '2024-12-15',
      tipo: 'formacion',
      descripcion: 'Reunión mensual de coordinación y seguimiento',
      estado: 'pendiente',
      requiereEmail: true,
      diasAnticipacion: 3
    },
    {
      id: 'auditoria_q4',
      titulo: 'Auditoría Mapa de Riesgos Q4 (Apoyo)',
      fecha: '2024-12-31',
      tipo: 'auditoria',
      descripcion: 'Apoyo en auditoría trimestral del mapa de riesgos',
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
      id: 'formacion_continua_q4',
      titulo: 'Formación Continua Q4 para Suplentes',
      fecha: '2024-12-15',
      tipo: 'formacion',
      descripcion: 'Formación continua específica para delegados suplentes',
      estado: 'pendiente',
      requiereEmail: true,
      diasAnticipacion: 30
    }
  ]

  // Datos para nuevo caso (suplente)
  const [nuevoCaso, setNuevoCaso] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'media' as 'alta' | 'media' | 'baja',
    categoria: 'observacion' as 'observacion' | 'prevencion' | 'comunicacion' | 'seguimiento',
    personasInvolucradas: '',
    fechaIncidente: new Date().toISOString().split('T')[0],
    ubicacion: '',
    medidasInmediatas: '',
    requiereNotificacion: false,
    coordinacionPrincipal: true
  })

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

  // Datos para recordatorios (suplente)
  const recordatorios = [
    {
      id: 'rec_001',
      titulo: 'Coordinación semanal con delegado principal',
      descripcion: 'Reunión de coordinación programada para esta semana',
      fechaVencimiento: '2024-01-25',
      prioridad: 'alta' as const,
      tipo: 'coordinacion' as const,
      asignadoA: 'Delegado Suplente',
      estado: 'pendiente' as const
    },
    {
      id: 'rec_002',
      titulo: 'Revisión protocolos de suplencia',
      descripcion: 'Revisar protocolos actualizados por el delegado principal',
      fechaVencimiento: '2024-02-01',
      prioridad: 'media' as const,
      tipo: 'formacion' as const,
      asignadoA: 'Delegado Suplente',
      estado: 'pendiente' as const
    }
  ]

  // Datos para casos urgentes (suplente)
  const casosUrgentes = [
    {
      id: 'urgente_suplente_001',
      titulo: 'Observación de comportamiento inusual',
      descripcion: 'Se ha observado comportamiento inusual que requiere evaluación y posible escalado',
      nivelUrgencia: 'media' as const,
      tiempoTranscurrido: '1 hora',
      estadoActual: 'observacion_inicial',
      accionesRequeridas: [
        'Documentar observación detalladamente',
        'Coordinar inmediatamente con delegado principal',
        'Mantener supervisión discreta',
        'Preparar informe preliminar',
        'Estar preparado para actuar si se agrava'
      ]
    }
  ]

  // Datos para comunicaciones (suplente)
  const miembrosEntidad = [
    { id: 1, nombre: 'Juan Pérez', rol: 'Entrenador', email: 'juan@club.com', telefono: '666111222' },
    { id: 2, nombre: 'María García', rol: 'Monitora', email: 'maria@club.com', telefono: '666333444' },
    { id: 3, nombre: 'Carlos López', rol: 'Director Técnico', email: 'carlos@club.com', telefono: '666555666' },
    { id: 4, nombre: 'Ana Martín', rol: 'Coordinadora', email: 'ana@club.com', telefono: '666777888' }
  ]

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

  // Tipos de casos urgentes para suplentes
  const tiposCasosUrgentes = [
    {
      id: 'observacion_comportamiento',
      titulo: 'Observación de comportamiento preocupante',
      categoria: 'Observación Suplente',
      nivelUrgencia: 'media' as const,
      tiempoMaximoRespuesta: '2 horas',
      icono: '',
      descripcion: 'Detección de comportamientos que requieren coordinación inmediata con el delegado principal',
      protocoloActuacion: [
        {
          paso: 1,
          accion: 'OBSERVACIÓN DISCRETA (0-15 minutos)',
          detalle: 'Mantener supervisión visual sin alertar a los involucrados'
        },
        {
          paso: 2,
          accion: 'DOCUMENTACIÓN INMEDIATA (15-30 minutos)',
          detalle: 'Registrar por escrito todos los detalles observados'
        },
        {
          paso: 3,
          accion: 'CONTACTO CON DELEGADO PRINCIPAL (30-60 minutos)',
          detalle: 'Informar inmediatamente al delegado principal de la situación'
        },
        {
          paso: 4,
          accion: 'SEGUIMIENTO COORDINADO (1-2 horas)',
          detalle: 'Actuar según las instrucciones del delegado principal'
        },
        {
          paso: 5,
          accion: 'REGISTRO EN SISTEMA (2-4 horas)',
          detalle: 'Documentar la observación y acciones tomadas en el sistema'
        }
      ]
    },
    {
      id: 'emergencia_principal_ausente',
      titulo: 'Emergencia con delegado principal ausente',
      categoria: 'Actuación Suplente',
      nivelUrgencia: 'critica' as const,
      tiempoMaximoRespuesta: '30 minutos',
      icono: '',
      descripcion: 'Situación urgente que requiere actuación del suplente cuando el principal no está disponible',
      protocoloActuacion: [
        {
          paso: 1,
          accion: 'ASUMIR RESPONSABILIDAD (0-5 minutos)',
          detalle: 'Tomar control inmediato de la situación como delegado suplente'
        },
        {
          paso: 2,
          accion: 'EVALUAR GRAVEDAD (5-15 minutos)',
          detalle: 'Determinar nivel de urgencia y tipo de respuesta requerida'
        },
        {
          paso: 3,
          accion: 'IMPLEMENTAR PROTOCOLO (15-30 minutos)',
          detalle: 'Aplicar protocolo específico según el tipo de emergencia'
        },
        {
          paso: 4,
          accion: 'NOTIFICAR AUTORIDADES (30-60 minutos)',
          detalle: 'Contactar con servicios de emergencia si es necesario'
        },
        {
          paso: 5,
          accion: 'COORDINAR POST-EMERGENCIA (1-4 horas)',
          detalle: 'Informar al delegado principal y documentar todas las acciones'
        }
      ]
    }
  ]

  // Funciones para el calendario
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

  const checkSession = (): SessionData | null => {
    try {
      console.log('Verificando sesión en dashboard suplente...')

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
    console.log('🔄 Iniciando verificación de sesión en dashboard suplente...')

    const session = checkSession()
    if (!session) {
      console.log('❌ No hay sesión válida, redirigiendo a login')
      router.push('/login')
      return
    }

    if (session.tipo !== 'suplente') {
      console.log('❌ Usuario no es suplente, redirigiendo al dashboard apropiado')
      if (session.tipo === 'principal') {
        router.push('/dashboard-delegado')
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
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
          <Link href="/login" className="bg-purple-600 text-white px-4 py-2 rounded-lg">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mejorado */}
      <div className="bg-purple-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-purple-600 text-xl font-bold mr-4">
                DS
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard del Delegado/a de Protección Suplente</h1>
                <div className="text-purple-100 space-y-1">
                  <div><strong>Entidad:</strong> {sessionData.entidad}</div>
                  <div><strong>Delegado/a Suplente:</strong> {sessionData.nombre}</div>
                  <div><strong>Delegado/a Principal:</strong> {delegadoPrincipal.nombre}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-green-500 w-3 h-3 rounded-full"></span>
                <span className="text-green-100">Certificado Vigente</span>
              </div>
              <div className="text-purple-100 text-sm">
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
            <h2 className="text-xl font-bold text-gray-900">Estado de la entidad - Vista Suplente</h2>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-purple-600 mr-2">97%</span>
              <span className="text-gray-600">Cumplimiento LOPIVI</span>
            </div>
          </div>
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: '97%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Como Delegado Suplente, usted apoya el cumplimiento cuando es requerido y mantiene coordinación constante con el delegado principal
            </p>
          </div>


        </div>
      </div>

      {/* Métricas principales mejoradas */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Casos de Apoyo</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
                <button
                  onClick={() => setShowCasosActivos(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Supervisar →
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
                <p className="text-sm text-gray-600">Certificación Suplente</p>
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
            <h3 className="text-xl font-bold text-gray-900">Acciones Principales - Delegado Suplente</h3>
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
                <h4 className="text-lg font-bold text-purple-600 mb-2">Reportar Observación</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Reportar observación o situación detectada como suplente
                </p>
                <button
                  onClick={() => setShowNuevoCaso(true)}
                  className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  Registrar →
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <h4 className="text-lg font-bold text-orange-600 mb-2">Mapa de Riesgos</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Revisión de riesgos como suplente
                </p>
                <button
                  onClick={() => setShowMapaRiesgos(true)}
                  className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                >
                  Ver →
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <h4 className="text-lg font-bold text-green-600 mb-2">Gestionar Recordatorios</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Seguimientos asignados como suplente
                </p>
                <button
                  onClick={() => setShowRecordatorios(true)}
                  className="text-green-600 hover:text-green-800 font-medium transition-colors"
                >
                  Ver →
                </button>
              </div>
            </div>
          </div>

          {/* Segunda fila de acciones - Suplente */}
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
                  Ver →
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

        {/* Información específica del delegado suplente */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h4 className="text-lg font-bold text-purple-900 mb-4">Funciones como Delegado Suplente</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-semibold text-purple-800">Responsabilidades principales:</h5>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Actuar cuando el delegado principal no esté disponible</li>
                <li>• Apoyar en la supervisión de protocolos LOPIVI</li>
                <li>• Mantener formación actualizada en protección infantil</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-semibold text-purple-800">Coordinación:</h5>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Comunicación fluida con delegado principal</li>
                <li>• Conocimiento de casos activos y procedimientos</li>
                <li>• Participación en reuniones y formaciones</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-purple-200">
            <div className="flex justify-center">
              <Link
                href="/formacion-lopivi/campus"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
Acceder a Formación LOPIVI
              </Link>
            </div>
          </div>
        </div>

        {/* Tareas Pendientes */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Tareas Pendientes - Delegado Suplente</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-800">Revisar protocolo de suplencia actualizado</span>
              <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">3 días</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-800">Coordinar con delegado principal sobre nuevos casos</span>
              <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">7 días</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-800">Actualizar conocimiento de protocolos específicos</span>
              <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">14 días</span>
            </div>
          </div>
        </div>


      </div>

      {/* Modal Acciones Pendientes */}
      {showAccionesPendientes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Acciones de Apoyo Pendientes - Delegado Suplente</h2>
                <button
                  onClick={() => setShowAccionesPendientes(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-bold text-purple-900 mb-2">Estado Actual: 97% de Cumplimiento</h3>
                <p className="text-purple-800 text-sm">Como delegado suplente, sus acciones de apoyo contribuyen al {accionesPendientes.reduce((acc, acc_item) => acc + acc_item.porcentajeImpacto, 0)}% restante</p>
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
                      <span className="text-purple-600 font-bold text-sm">+{accion.porcentajeImpacto}%</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Pasos para completar:</h4>
                    <ol className="space-y-2">
                      {accion.pasos.map((paso, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
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

      {/* Modal Casos Activos */}
      {showCasosActivos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Casos de Apoyo - Supervisión Suplente</h2>
                <button
                  onClick={() => setShowCasosActivos(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-bold text-purple-900 mb-2">Casos de Apoyo: {casosActivos.length}</h3>
                <p className="text-purple-800 text-sm">Como Delegado Suplente, debe supervisar estos casos según coordinación con el delegado principal</p>
              </div>

              {casosActivos.map((caso) => (
                <div key={caso.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{caso.titulo}</h3>
                      <p className="text-gray-600 text-sm mt-1">{caso.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-2">Creado: {new Date(caso.fechaCreacion).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs px-2 py-1 rounded border ${getPrioridadColor(caso.prioridad)}`}>
                        {caso.prioridad.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        caso.estado === 'abierto' ? 'bg-red-50 text-red-600 border-red-200' :
                        caso.estado === 'en_proceso' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                        'bg-green-50 text-green-600 border-green-200'
                      }`}>
                        {caso.estado.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Acciones como Delegado Suplente:</h4>
                    {caso.prioridad === 'alta' ? (
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• <strong>Coordinación inmediata:</strong> Informar al delegado principal en 24h</li>
                        <li>• <strong>Apoyo documental:</strong> Ayudar en documentación si es requerido</li>
                        <li>• <strong>Disponibilidad:</strong> Estar disponible para actuar si el principal no puede</li>
                        <li>• <strong>Seguimiento:</strong> Participar en reuniones de seguimiento</li>
                      </ul>
                    ) : caso.prioridad === 'media' ? (
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• <strong>Supervisión:</strong> Revisar avances con delegado principal</li>
                        <li>• <strong>Apoyo logístico:</strong> Asistir en coordinación si es necesario</li>
                        <li>• <strong>Conocimiento:</strong> Mantenerse informado de evolución</li>
                        <li>• <strong>Preparación:</strong> Estar preparado para actuar si es requerido</li>
                      </ul>
                    ) : (
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• <strong>Seguimiento:</strong> Revisar en reuniones de coordinación semanales</li>
                        <li>• <strong>Conocimiento:</strong> Mantenerse al día del caso</li>
                        <li>• <strong>Apoyo menor:</strong> Asistir si el delegado principal lo requiere</li>
                      </ul>
                    )}
                  </div>
                </div>
              ))}
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
                <h2 className="text-xl font-bold text-gray-900">Alertas Pendientes de Revisión - Delegado Suplente</h2>
                <button
                  onClick={() => setShowAlertasPendientes(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-bold text-orange-900 mb-2">Alertas para Revisión: {alertasPendientes.length}</h3>
                <p className="text-orange-800 text-sm">Alertas que requieren su atención como delegado suplente</p>
              </div>

              {alertasPendientes.map((alerta) => (
                <div key={alerta.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{alerta.titulo}</h3>
                      <p className="text-gray-600 text-sm mt-1">{alerta.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-2">Generada: {new Date(alerta.fechaCreacion).toLocaleDateString('es-ES')}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${getTipoAlertaColor(alerta.tipo)}`}>
                      {alerta.tipo.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Acción Requerida como Suplente:</h4>
                    <p className="text-gray-700 text-sm">{alerta.accionRequerida}</p>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h5 className="font-semibold text-gray-800 mb-2">Pasos a seguir:</h5>
                      {alerta.tipo === 'importante' ? (
                        <ol className="text-gray-700 text-sm space-y-1">
                          <li>1. Confirmar asistencia a reunión con delegado principal</li>
                          <li>2. Preparar reporte semanal de actividades</li>
                          <li>3. Revisar casos pendientes y observaciones</li>
                          <li>4. Documentar dudas para aclarar en reunión</li>
                          <li>5. Coordinar agenda para próxima semana</li>
                        </ol>
                      ) : (
                        <ol className="text-gray-700 text-sm space-y-1">
                          <li>1. Revisar programa de formación continua</li>
                          <li>2. Verificar fechas disponibles en calendario</li>
                          <li>3. Inscribirse en la formación programada</li>
                          <li>4. Coordinar con delegado principal sobre asistencia</li>
                          <li>5. Preparar objetivos de aprendizaje específicos</li>
                        </ol>
                      )}
                    </div>
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
                <h2 className="text-xl font-bold text-gray-900">Estado de Certificación Suplente</h2>
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
                  <h3 className="font-bold text-green-900">Certificación Suplente Vigente</h3>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">ACTIVA</span>
                </div>
                <p className="text-green-800 text-sm mt-1">Su certificación como Delegado/a Suplente está en regla</p>
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

              <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3">Funciones como Delegado Suplente</h4>
                <p className="text-purple-800 text-sm mb-3">Su certificación le habilita para:</p>
                <ul className="text-purple-800 text-sm space-y-1">
                  <li>• Actuar como delegado principal cuando esté ausente</li>
                  <li>• Apoyar en la supervisión de protocolos LOPIVI</li>
                  <li>• Participar en la formación continua requerida</li>
                  <li>• Coordinar con el delegado principal en casos específicos</li>
                  <li>• Mantener conocimiento actualizado de protocolos</li>
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

      {/* Modal Nuevo Caso - Suplente */}
      {showNuevoCaso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Reportar Observación - Delegado Suplente</h2>
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
                <h3 className="font-bold text-blue-900 mb-3">Cómo catalogar la prioridad como Delegado Suplente</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-semibold text-red-800 mb-2">🔴 PRIORIDAD ALTA</h4>
                    <ul className="text-red-700 text-xs space-y-1">
                      <li>• Situación de riesgo inmediato</li>
                      <li>• Delegado principal no disponible</li>
                      <li>• Requiere actuación urgente</li>
                      <li>• Contacto inapropiado detectado</li>
                      <li>• Emergencia sin supervisión</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-semibold text-yellow-800 mb-2">🟡 PRIORIDAD MEDIA</h4>
                    <ul className="text-yellow-700 text-xs space-y-1">
                      <li>• Comportamiento preocupante</li>
                      <li>• Necesita coordinación</li>
                      <li>• Incumplimiento menor</li>
                      <li>• Observación para escalar</li>
                      <li>• Apoyo al delegado principal</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-2">🟢 PRIORIDAD BAJA</h4>
                    <ul className="text-green-700 text-xs space-y-1">
                      <li>• Observación preventiva</li>
                      <li>• Seguimiento rutinario</li>
                      <li>• Consulta administrativa</li>
                      <li>• Coordinación programada</li>
                      <li>• Apoyo no urgente</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-purple-900 mb-2">Función de Delegado Suplente</h3>
                <p className="text-purple-800 text-sm">Como delegado suplente, sus observaciones se coordinan automáticamente with el delegado principal para garantizar una respuesta adecuada.</p>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título de la observación *</label>
                    <input
                      type="text"
                      value={nuevoCaso.titulo}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, titulo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Ej: Observación de comportamiento inusual"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad * (ver guía arriba)</label>
                    <select
                      value={nuevoCaso.prioridad}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, prioridad: e.target.value as 'alta' | 'media' | 'baja' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="baja">Baja - Observación rutinaria</option>
                      <option value="media">Media - Requiere atención</option>
                      <option value="alta">Alta - Requiere acción inmediata</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de observación *</label>
                    <select
                      value={nuevoCaso.categoria}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, categoria: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="observacion">Observación directa</option>
                      <option value="prevencion">Prevención</option>
                      <option value="comunicacion">Comunicación</option>
                      <option value="seguimiento">Seguimiento de caso</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de la observación</label>
                    <input
                      type="date"
                      value={nuevoCaso.fechaIncidente}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, fechaIncidente: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción detallada *</label>
                  <textarea
                    value={nuevoCaso.descripcion}
                    onChange={(e) => setNuevoCaso(prev => ({ ...prev, descripcion: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Describe la observación de manera objetiva y detallada..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Personas involucradas</label>
                    <input
                      type="text"
                      value={nuevoCaso.personasInvolucradas}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, personasInvolucradas: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Nombres o identificación de personas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                    <input
                      type="text"
                      value={nuevoCaso.ubicacion}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, ubicacion: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Ej: Vestuario, pista 1, oficina..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Acciones inmediatas tomadas</label>
                  <textarea
                    value={nuevoCaso.medidasInmediatas}
                    onChange={(e) => setNuevoCaso(prev => ({ ...prev, medidasInmediatas: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Describe las acciones que ha tomado como suplente..."
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={nuevoCaso.coordinacionPrincipal}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, coordinacionPrincipal: e.target.checked }))}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Coordinar inmediatamente con delegado principal
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={nuevoCaso.requiereNotificacion}
                      onChange={(e) => setNuevoCaso(prev => ({ ...prev, requiereNotificacion: e.target.checked }))}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Puede requerir notificación a autoridades
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
                      alert('Observación registrada y coordinada con delegado principal')
                      setShowNuevoCaso(false)
                      setNuevoCaso({
                        titulo: '',
                        descripcion: '',
                        prioridad: 'media',
                        categoria: 'observacion',
                        personasInvolucradas: '',
                        fechaIncidente: new Date().toISOString().split('T')[0],
                        ubicacion: '',
                        medidasInmediatas: '',
                        requiereNotificacion: false,
                        coordinacionPrincipal: true
                      })
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Registrar Observación
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Mapa de Riesgos - Suplente */}
      {showMapaRiesgos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Mapa de Riesgos - Vista Suplente</h2>
                <p className="text-sm text-gray-600">Consulta y conocimiento de riesgos para apoyo al delegado principal</p>
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
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-orange-900 mb-2">Función de Supervisión Suplente</h3>
                <p className="text-orange-800 text-sm">Como delegado suplente, debe conocer todos los riesgos para poder actuar eficazmente cuando el delegado principal no esté disponible.</p>
              </div>

              {/* Mismo contenido del mapa pero con enfoque de suplente */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-bold text-orange-900 mb-4">Mapa de Riesgos - Conocimiento Suplente</h3>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <h4 className="font-bold text-red-900 mb-3">RIESGOS CRÍTICOS A SUPERVISAR</h4>
                    <ul className="text-red-800 text-sm space-y-2">
                      <li>• <strong>Vestuarios:</strong> Mantener supervisión externa constante</li>
                      <li>• <strong>Comunicaciones:</strong> Verificar que sean solo por canales oficiales</li>
                      <li>• <strong>Entrenamientos:</strong> Supervisar relaciones adulto-menor</li>
                      <li>• <strong>Espacios cerrados:</strong> Evitar situaciones de aislamiento</li>
                    </ul>
                  </div>

                  <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-3">RESPONSABILIDADES SUPLENTE</h4>
                    <ul className="text-purple-800 text-sm space-y-2">
                      <li>• <strong>Observación:</strong> Mantener vigilancia continua</li>
                      <li>• <strong>Coordinación:</strong> Comunicar observaciones al principal</li>
                      <li>• <strong>Disponibilidad:</strong> Estar preparado para actuar</li>
                      <li>• <strong>Conocimiento:</strong> Dominar todos los protocolos</li>
                    </ul>
                  </div>
                </div>

                <div className="border border-orange-200 rounded-lg p-4">
                  <h4 className="font-bold text-orange-900 mb-3">COORDINACIÓN CON DELEGADO PRINCIPAL</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-orange-800 mb-2">Comunicación Regular</h5>
                      <ul className="text-orange-700 text-sm space-y-1">
                        <li>• Reuniones semanales de coordinación</li>
                        <li>• Informes de observaciones</li>
                        <li>• Disponibilidad inmediata en emergencias</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-orange-800 mb-2">Respaldo en Ausencias</h5>
                      <ul className="text-orange-700 text-sm space-y-1">
                        <li>• Asumir funciones cuando sea necesario</li>
                        <li>• Mantener continuidad en protocolos</li>
                        <li>• Coordinar con autoridades si requerido</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Recordatorios - Suplente */}
      {showRecordatorios && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recordatorios - Delegado Suplente</h2>
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
                <h3 className="font-bold text-green-900 mb-2">Gestión de Recordatorios Suplente</h3>
                <p className="text-green-800 text-sm">Sus recordatorios incluyen coordinación con el delegado principal y tareas específicas de suplencia</p>
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
                            <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-600">
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

      {/* Modal Casos Urgentes - Suplente con teléfonos */}
      {showCasosUrgentes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-orange-900">
                    Tipos de Casos Urgentes - Suplente
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
                <h3 className="font-bold text-orange-900 mb-2">TELÉFONOS DE EMERGENCIA - DELEGADO/A SUPLENTE DE PROTECCIÓN</h3>
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
                    <strong>PROTOCOLO SUPLENTE:</strong> Como delegado/a suplente, debe SIEMPRE contactar primero con emergencias (112/091) y después coordinar con el delegado principal.
                    En ausencia del principal, actúe con plena autoridad siguiendo los protocolos.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-2">Casos Urgentes para Delegados Suplentes</h3>
                <p className="text-blue-800 text-sm">Como Delegado Suplente, seleccione el tipo de situación para ver el protocolo específico de coordinación y actuación</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Coordinación con delegado principal</h3>
                      <p className="text-gray-600 text-sm mb-3">Protocolo de coordinación cuando el delegado principal no está disponible</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded font-bold bg-orange-600 text-white">ALTA</span>
                        <span className="text-xs text-gray-500">Coordinación</span>
                        <span className="text-xs text-purple-600">Máx: 30 min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Incidente detectado como suplente</h3>
                      <p className="text-gray-600 text-sm mb-3">Situación detectada que requiere intervención inmediata del suplente</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded font-bold bg-red-600 text-white">CRÍTICA</span>
                        <span className="text-xs text-gray-500">Actuación Directa</span>
                        <span className="text-xs text-purple-600">Máx: 15 min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Apoyo en caso complejo</h3>
                      <p className="text-gray-600 text-sm mb-3">Asistencia al delegado principal en situaciones que requieren apoyo adicional</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded font-bold bg-yellow-600 text-white">MEDIA</span>
                        <span className="text-xs text-gray-500">Colaboración</span>
                        <span className="text-xs text-purple-600">Máx: 1 hora</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Comunicación con familias</h3>
                      <p className="text-gray-600 text-sm mb-3">Protocolo de comunicación cuando debe actuar en representación del principal</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded font-bold bg-orange-600 text-white">ALTA</span>
                        <span className="text-xs text-gray-500">Comunicación</span>
                        <span className="text-xs text-purple-600">Máx: 2 horas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Comunicaciones - Suplente */}
      {showComunicaciones && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Comunicaciones - Delegado Suplente</h2>
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
                <h3 className="font-bold text-blue-900 mb-2">📢 Comunicaciones como Delegado Suplente</h3>
                <p className="text-blue-800 text-sm">Sus comunicaciones deben coordinarse con el delegado principal y pueden enviarse en su nombre cuando sea necesario</p>
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
                    <h4 className="font-semibold text-gray-800 mb-2">Comunicación Coordinada</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left p-2 border border-blue-200 rounded text-sm bg-blue-50">
                        👤 Delegar al Principal
                      </button>
                      <button className="w-full text-left p-2 border border-gray-200 rounded text-sm hover:bg-gray-50">
                        📧 Comunicación de apoyo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <h3 className="font-bold text-gray-900 mb-4">Componer Comunicación Suplente</h3>
                  <div className="space-y-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <p className="text-purple-800 text-sm">
                        <strong>Nota:</strong> Como delegado suplente, sus comunicaciones se envían en coordinación con el delegado principal.
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
                        <option>Coordinación con principal</option>
                        <option>Comunicación de apoyo</option>
                        <option>Observación para escalado</option>
                        <option>Seguimiento de caso</option>
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
                          <span className="text-sm text-blue-800">Informes de Suplencia</span>
                        </label>
                      </div>
                      <button
                        onClick={() => alert('Documentación seleccionada coordinada con delegado principal')}
                        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                      >
                        Coordinar Envío con Principal
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                      <textarea
                        rows={6}
                        placeholder="Escriba su comunicación como delegado suplente..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Coordinar con Principal
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

      {/* Modal Calendario */}
      {showCalendario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Calendario Anual Custodia360 - Vista Suplente</h2>
                  <p className="text-sm text-gray-600">Fechas importantes para coordinación y cumplimiento LOPIVI</p>
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
                    <span className="text-sm text-gray-600">Formación/Coordinación</span>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resumen Anual - Delegado Suplente</h3>
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
                    Calendario de coordinación actualizado automáticamente cada 24 horas
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700">
                      Exportar Calendario
                    </button>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700">
                      Coordinar con Principal
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
                  <h2 className="text-xl font-bold text-gray-900">Estado de Cumplimiento LOPIVI - Suplente</h2>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones de Apoyo Pendientes para Completar el 3% Restante</h3>
                <div className="space-y-4">
                  <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Apoyar en Protocolos de Vestuarios</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      Coordinar con el delegado principal en la revisión de protocolos de vestuarios
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Impacto: 2%</span>
                      <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700">
                        Coordinar Ahora
                      </button>
                    </div>
                  </div>

                  <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Apoyo en Formación del Personal</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      Asistir al delegado principal en la formación pendiente de 2 miembros del personal
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Impacto: 1%</span>
                      <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">
                        Ofrecer Apoyo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-center">
                  <Link
                    href="/dashboard-suplente/cumplimiento"
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
