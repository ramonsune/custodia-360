'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BackupExportacion from '@/components/BackupExportacion'
import InformesMensuales from '@/components/InformesMensuales'
import GestionDocumentacion from '@/components/GestionDocumentacion'
import { useBloqueoSistema } from '@/hooks/useBloqueoSistema'

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

  // Sistema de bloqueo
  const { estadoBloqueo, verificandoBloqueo, mostrarAlertaConfiguracion } = useBloqueoSistema(sessionData)

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

  // Estados para nuevas páginas modales
  const [showGestionarCaso, setShowGestionarCaso] = useState(false)
  const [casoSeleccionado, setCasoSeleccionado] = useState<Caso | null>(null)
  const [showRenovacionCertificado, setShowRenovacionCertificado] = useState(false)
  const [showConfigAlertas, setShowConfigAlertas] = useState(false)
  const [showProtocoloCaso, setShowProtocoloCaso] = useState(false)
  const [tipoProtocolo, setTipoProtocolo] = useState('')

  // Estados para nuevas funcionalidades
  const [showBackupExportacion, setShowBackupExportacion] = useState(false)
  const [showInformesMensuales, setShowInformesMensuales] = useState(false)
  const [showGestionDocumentacion, setShowGestionDocumentacion] = useState(false)

  // Estados para gestión de métodos de pago
  const [showGestionPagos, setShowGestionPagos] = useState(false)
  const [showAgregarTarjeta, setShowAgregarTarjeta] = useState(false)
  const [metodosGuardados, setMetodosGuardados] = useState([
    {
      id: '1',
      tipo: 'visa',
      ultimos4: '1234',
      titular: 'Club Deportivo Barcelona',
      expiracion: '12/25',
      predeterminada: true,
      fechaCreacion: '2024-01-15',
      proximaVencer: false
    },
    {
      id: '2',
      tipo: 'mastercard',
      ultimos4: '5678',
      titular: 'Club Deportivo Barcelona',
      expiracion: '03/25',
      predeterminada: false,
      fechaCreacion: '2024-06-10',
      proximaVencer: true
    }
  ])
  const [nuevaTarjeta, setNuevaTarjeta] = useState({
    numero: '',
    titular: '',
    expiracion: '',
    cvv: '',
    predeterminada: false
  })

  // Estados para calendario
  const [eventosMarcadosOk, setEventosMarcadosOk] = useState<string[]>([])
  const [alertasDesactivadas, setAlertasDesactivadas] = useState<string[]>([])

  // Función para verificar si necesita renovación del certificado
  const verificarRenovacionCertificado = () => {
    const fechaEmision = new Date('2023-01-15') // Fecha de emisión del certificado
    const fechaActual = new Date()
    const fechaVencimiento = new Date(fechaEmision)
    fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 2) // Certificado válido por 2 años

    const tiempoRestante = fechaVencimiento.getTime() - fechaActual.getTime()
    const diasRestantes = Math.ceil(tiempoRestante / (1000 * 3600 * 24))

    return {
      necesitaRenovacion: diasRestantes <= 30,
      diasRestantes,
      fechaVencimiento
    }
  }

  const estadoRenovacion = verificarRenovacionCertificado()

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

  // Estado para gestionar la lista de recordatorios
  const [recordatorios, setRecordatorios] = useState([
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
  ])

  // Estado para tipo de caso urgente seleccionado
  const [casoUrgenteSeleccionado, setCasoUrgenteSeleccionado] = useState<string | null>(null)

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
    if (recordatorioEditandoId) {
      setRecordatorios(prev => prev.map(recordatorio =>
        recordatorio.id === recordatorioEditandoId
          ? { ...recordatorio, ...recordatorioEditado }
          : recordatorio
      ))
      alert(`Recordatorio ${recordatorioEditandoId} actualizado correctamente`)
      setRecordatorioEditandoId(null)
      setRecordatorioEditado({
        titulo: '',
        descripcion: '',
        fechaVencimiento: '',
        prioridad: 'media'
      })
    }
  }

  const handleCompletarRecordatorio = (id: string) => {
    setRecordatorios(prev => prev.map(recordatorio =>
      recordatorio.id === id
        ? { ...recordatorio, estado: 'completado' as const }
        : recordatorio
    ))
    alert(`Recordatorio ${id} marcado como completado`)
  }

  const handleEliminarRecordatorio = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este recordatorio?')) {
      setRecordatorios(prev => prev.filter(recordatorio => recordatorio.id !== id))
      alert(`Recordatorio eliminado correctamente`)
      // Si estaba siendo editado, cancelar la edición
      if (recordatorioEditandoId === id) {
        setRecordatorioEditandoId(null)
        setRecordatorioEditado({
          titulo: '',
          descripcion: '',
          fechaVencimiento: '',
          prioridad: 'media'
        })
      }
    }
  }

  // Handlers para gestión de métodos de pago
  const handleAgregarTarjeta = () => {
    if (!nuevaTarjeta.numero || !nuevaTarjeta.titular || !nuevaTarjeta.expiracion || !nuevaTarjeta.cvv) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    // Validar formato de tarjeta
    if (nuevaTarjeta.numero.replace(/\s/g, '').length !== 16) {
      alert('El número de tarjeta debe tener 16 dígitos')
      return
    }

    const nuevaId = (metodosGuardados.length + 1).toString()
    const tipoTarjeta = nuevaTarjeta.numero.startsWith('4') ? 'visa' :
                      nuevaTarjeta.numero.startsWith('5') ? 'mastercard' : 'amex'

    const nuevaTargetaTarjeta = {
      id: nuevaId,
      tipo: tipoTarjeta,
      ultimos4: nuevaTarjeta.numero.slice(-4),
      titular: nuevaTarjeta.titular,
      expiracion: nuevaTarjeta.expiracion,
      predeterminada: nuevaTarjeta.predeterminada,
      fechaCreacion: new Date().toISOString().split('T')[0],
      proximaVencer: false
    }

    // Si es predeterminada, quitar predeterminada de las demás
    if (nuevaTarjeta.predeterminada) {
      setMetodosGuardados(prev => prev.map(metodo => ({ ...metodo, predeterminada: false })))
    }

    setMetodosGuardados(prev => [...prev, nuevaTargetaTarjeta])
    setNuevaTarjeta({
      numero: '',
      titular: '',
      expiracion: '',
      cvv: '',
      predeterminada: false
    })
    setShowAgregarTarjeta(false)
    alert('Tarjeta añadida correctamente')
  }

  const handleEliminarMetodo = (id: string) => {
    const metodo = metodosGuardados.find(m => m.id === id)
    if (metodo?.predeterminada) {
      alert('No puedes eliminar el método de pago predeterminado. Establece otro como predeterminado primero.')
      return
    }

    if (confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
      setMetodosGuardados(prev => prev.filter(metodo => metodo.id !== id))
      alert('Método de pago eliminado correctamente')
    }
  }

  const handleEstablecerPredeterminado = (id: string) => {
    setMetodosGuardados(prev => prev.map(metodo => ({
      ...metodo,
      predeterminada: metodo.id === id
    })))
    alert('Método de pago establecido como predeterminado')
  }

  const verificarTarjetasProximasVencer = () => {
    const hoy = new Date()
    const dosMesesAdelante = new Date(hoy.getFullYear(), hoy.getMonth() + 2, hoy.getDate())

    return metodosGuardados.filter(metodo => {
      const [mes, año] = metodo.expiracion.split('/')
      const fechaExpiracion = new Date(parseInt(`20${año}`), parseInt(mes) - 1, 1)
      return fechaExpiracion <= dosMesesAdelante
    })
  }

  const tarjetasProximasVencer = verificarTarjetasProximasVencer()

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

  // Mostrar loading mientras se verifica el bloqueo
  if (verificandoBloqueo || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verificando configuración...</p>
        </div>
      </div>
    )
  }

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

      {/* Alerta de configuración pendiente */}
      {mostrarAlertaConfiguracion() && estadoBloqueo && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-orange-800">
                  <strong>⚠️ Configuración pendiente:</strong> Quedan {estadoBloqueo.diasRestantes} días para completar: {estadoBloqueo.accionesPendientes.join(', ')}
                  <button
                    onClick={() => router.push('/sistema-bloqueado')}
                    className="ml-2 underline hover:no-underline"
                  >
                    Completar ahora
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
              Ver acciones de apoyo pendientes
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
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowEstadoCertificacion(true)}
                    className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
                  >
                    Ver Estado →
                  </button>
                  {estadoRenovacion.necesitaRenovacion && (
                    <button
                      onClick={() => setShowRenovacionCertificado(true)}
                      className="text-sm bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 font-medium transition-colors"
                    >
                      Iniciar Renovación
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calendario</p>
                <p className="text-3xl font-bold text-gray-900">{getEventosProximos().length}</p>
                <button
                  onClick={() => setShowConfigAlertas(true)}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  Configurar Alertas →
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
                        <button
                          onClick={() => {
                            setCasoSeleccionado(caso)
                            setShowGestionarCaso(true)
                          }}
                          className={`px-3 py-1 rounded text-sm text-white hover:opacity-80 ${
                            caso.prioridad === 'alta' ? 'bg-red-600' :
                            caso.prioridad === 'media' ? 'bg-orange-600' :
                            'bg-yellow-600'
                          }`}
                        >
                          Gestionar
                        </button>
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
                  <p className="text-sm text-gray-600">Acciones críticas que requieren atención inmediata</p>
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
              <div className="space-y-4">
                {alertasPendientes.map((alerta) => (
                  <div key={alerta.id} className={`border rounded-lg p-4 ${
                    alerta.tipo === 'urgente' ? 'border-red-200 bg-red-50' :
                    alerta.tipo === 'importante' ? 'border-orange-200 bg-orange-50' :
                    'border-blue-200 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                            alerta.tipo === 'urgente' ? 'bg-red-600' :
                            alerta.tipo === 'importante' ? 'bg-orange-600' :
                            'bg-blue-600'
                          }`}>
                            {alerta.tipo.toUpperCase()}
                          </span>
                          <h4 className="font-semibold text-gray-900">{alerta.titulo}</h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{alerta.descripcion}</p>
                        <div className="text-xs text-gray-500">
                          Fecha: {new Date(alerta.fechaCreacion).toLocaleDateString()} | Acción requerida: {alerta.accionRequerida}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowConfigAlertas(true)
                          setTipoProtocolo(alerta.id)
                        }}
                        className={`px-3 py-1 rounded text-sm text-white hover:opacity-80 ${
                          alerta.tipo === 'urgente' ? 'bg-red-600' :
                          alerta.tipo === 'importante' ? 'bg-orange-600' :
                          'bg-blue-600'
                        }`}
                      >
                        Accionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Calendario */}
      {showCalendario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Calendario de Eventos - Delegado Principal</h2>
                <p className="text-sm text-gray-600">Gestión de eventos y fechas clave para la entidad</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCalendario(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-4">Eventos Pendientes</h3>
                  <div className="space-y-3">
                    {eventosCalendario
                      .filter(evento => evento.estado === 'pendiente')
                      .map(evento => (
                        <div key={evento.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{evento.titulo}</h4>
                            <span className={`px-2 py-1 rounded text-xs ${
                              evento.tipo === 'certificacion' ? 'bg-blue-100 text-blue-800' :
                              evento.tipo === 'renovacion' ? 'bg-orange-100 text-orange-800' :
                              evento.tipo === 'auditoria' ? 'bg-purple-100 text-purple-800' :
                              evento.tipo === 'contrato' ? 'bg-green-100 text-green-800' :
                              'bg-indigo-100 text-indigo-800'
                            }`}>
                              {evento.tipo}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{evento.descripcion}</p>
                          <div className="text-xs text-gray-500">
                            Fecha: {new Date(evento.fecha).toLocaleDateString()} | {evento.diasAnticipacion} días de anticipación
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => marcarEventoComoOk(evento.id)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              Marcar como OK
                            </button>
                            <button
                              onClick={() => enviarNotificacionEmail(evento.id)}
                              className="text-green-600 hover:text-green-800 text-xs font-medium"
                            >
                              Notificar por email
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-4">Eventos Completados</h3>
                  <div className="space-y-3">
                    {eventosCalendario
                      .filter(evento => evento.estado === 'completado')
                      .map(evento => (
                        <div key={evento.id} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{evento.titulo}</h4>
                            <span className={`px-2 py-1 rounded text-xs ${
                              evento.tipo === 'certificacion' ? 'bg-blue-100 text-blue-800' :
                              evento.tipo === 'renovacion' ? 'bg-orange-100 text-orange-800' :
                              evento.tipo === 'auditoria' ? 'bg-purple-100 text-purple-800' :
                              evento.tipo === 'contrato' ? 'bg-green-100 text-green-800' :
                              'bg-indigo-100 text-indigo-800'
                            }`}>
                              {evento.tipo}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{evento.descripcion}</p>
                          <div className="text-xs text-gray-500">
                            Fecha: {new Date(evento.fecha).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>Eventos pendientes: {getEventosProximos().length}</div>
                  <div>Eventos completados: {eventosCalendario.filter(e => e.estado === 'completado').length}</div>
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
                  <h2 className="text-xl font-bold text-gray-900">Cumplimiento LOPIVI - Delegado Principal</h2>
                  <p className="text-sm text-gray-600">Gestión de cumplimiento y seguimiento de protocolos</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-4">Protocolos de Protección</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Protocolo de Vestuarios</h4>
                        <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">Revisión pendiente</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Revisión mensual programada para 30 de septiembre</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowConfigAlertas(true)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Configurar alerta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-4">Formación de Personal</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Formación de 2 miembros</h4>
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">Completada</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Completada el 20 de septiembre</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowConfigAlertas(true)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>Protocolos pendientes: 1</div>
                  <div>Formación completada: 1</div>
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
                  <h2 className="text-xl font-bold text-gray-900">Estado de Certificación - Delegado Principal</h2>
                  <p className="text-sm text-gray-600">Información detallada sobre la certificación vigente</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-4">Información de Certificación</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Fecha de Emisión</h4>
                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">{estadoCertificacion.fechaEmision}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Fecha de Vencimiento</h4>
                        <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">{estadoCertificacion.fechaVencimiento}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Días Restantes</h4>
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">{estadoCertificacion.diasRestantes}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Estado Vigencia</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          estadoCertificacion.estadoVigencia === 'vigente' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {estadoCertificacion.estadoVigencia}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-4">Acciones Pendientes</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Formación Obligatoria</h4>
                        <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">Pendiente</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Formación continua programada para 15 de diciembre</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowConfigAlertas(true)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Configurar alerta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>Acciones pendientes: 1</div>
                  <div>Formación obligatoria: 1</div>
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
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Acciones de Apoyo Pendientes</h2>
                  <p className="text-sm text-gray-600">Tareas que requieren atención inmediata</p>
                </div>
                <button
                  onClick={() => setShowAccionesPendientes(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {accionesPendientes.map((accion) => (
                  <div key={accion.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                            accion.prioridad === 'alta' ? 'bg-red-600' :
                            accion.prioridad === 'media' ? 'bg-orange-600' :
                            'bg-yellow-600'
                          }`}>
                            {accion.prioridad.toUpperCase()}
                          </span>
                          <h4 className="font-semibold text-gray-900">{accion.titulo}</h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{accion.descripcion}</p>
                        <div className="text-xs text-gray-500">
                          Impacto: {accion.porcentajeImpacto}%
                        </div>
                      </div>
                      <button
                        onClick={() => setShowConfigAlertas(true)}
                        className={`px-3 py-1 rounded text-sm text-white hover:opacity-80 ${
                          accion.prioridad === 'alta' ? 'bg-red-600' :
                          accion.prioridad === 'media' ? 'bg-orange-600' :
                          'bg-yellow-600'
                        }`}
                      >
                        Accionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Estado Certificación */}
      {showEstadoCertificacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Estado de Certificación - Delegado Principal</h2>
                  <p className="text-sm text-gray-600">Información detallada sobre la certificación vigente</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-4">Información de Certificación</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Fecha de Emisión</h4>
                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">{estadoCertificacion.fechaEmision}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Fecha de Vencimiento</h4>
                        <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">{estadoCertificacion.fechaVencimiento}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Días Restantes</h4>
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">{estadoCertificacion.diasRestantes}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Estado Vigencia</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          estadoCertificacion.estadoVigencia === 'vigente' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {estadoCertificacion.estadoVigencia}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-4">Acciones Pendientes</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Formación Obligatoria</h4>
                        <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">Pendiente</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Formación continua programada para 15 de diciembre</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowConfigAlertas(true)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Configurar alerta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>Acciones pendientes: 1</div>
                  <div>Formación obligatoria: 1</div>
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
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Reportar Nuevo Caso</h2>
                  <p className="text-sm text-gray-600">Gestión de casos como delegado principal</p>
                </div>
                <button
                  onClick={() => setShowNuevoCaso(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Caso
                  </label>
                  <input
                    type="text"
                    value={nuevoCaso.titulo}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, titulo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Título del caso"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={nuevoCaso.descripcion}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, descripcion: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descripción detallada del caso"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridad
                    </label>
                    <select
                      value={nuevoCaso.prioridad}
                      onChange={(e) => setNuevoCaso({...nuevoCaso, prioridad: e.target.value as 'alta' | 'media' | 'baja'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                      <option value="baja">Baja</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={nuevoCaso.categoria}
                      onChange={(e) => setNuevoCaso({...nuevoCaso, categoria: e.target.value as 'investigacion' | 'prevencion' | 'comunicacion' | 'seguimiento'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="investigacion">Investigación</option>
                      <option value="prevencion">Prevención</option>
                      <option value="comunicacion">Comunicación</option>
                      <option value="seguimiento">Seguimiento</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personas Involucradas
                  </label>
                  <input
                    type="text"
                    value={nuevoCaso.personasInvolucradas}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, personasInvolucradas: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre(s) de las personas involucradas"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha del Incidente
                    </label>
                    <input
                      type="date"
                      value={nuevoCaso.fechaIncidente}
                      onChange={(e) => setNuevoCaso({...nuevoCaso, fechaIncidente: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={nuevoCaso.ubicacion}
                      onChange={(e) => setNuevoCaso({...nuevoCaso, ubicacion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ubicación específica"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medidas Inmediatas
                  </label>
                  <textarea
                    value={nuevoCaso.medidasInmediatas}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, medidasInmediatas: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Medidas inmediatas a tomar"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requiere Notificación
                    </label>
                    <select
                      value={nuevoCaso.requiereNotificacion ? 'si' : 'no'}
                      onChange={(e) => setNuevoCaso({...nuevoCaso, requiereNotificacion: e.target.value === 'si'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="no">No</option>
                      <option value="si">Sí</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coordinación con Suplente
                    </label>
                    <select
                      value={nuevoCaso.coordinacionSuplente ? 'si' : 'no'}
                      onChange={(e) => setNuevoCaso({...nuevoCaso, coordinacionSuplente: e.target.value === 'si'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="no">No</option>
                      <option value="si">Sí</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNuevoCaso(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      alert('Caso registrado correctamente')
                      setShowNuevoCaso(false)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Registrar Caso
                  </button>
                </div>
              </div>
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
                  onClick={async () => {
                    try {
                      const { jsPDF } = await import('jspdf')
                      const doc = new jsPDF()

                      // Título
                      doc.setFontSize(16)
                      doc.setFont('helvetica', 'bold')
                      doc.text('MAPA DE RIESGOS LOPIVI - GESTIÓN PRINCIPAL', 20, 20)

                      // Fecha
                      doc.setFontSize(12)
                      doc.setFont('helvetica', 'normal')
                      doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 30)
                      doc.text(`Entidad: ${sessionData?.entidad || 'Entidad'}`, 20, 40)

                      // Contenido
                      let yPos = 60
                      doc.setFontSize(14)
                      doc.setFont('helvetica', 'bold')
                      doc.text('ANÁLISIS DE RIESGOS CRÍTICOS', 20, yPos)

                      yPos += 20
                      doc.setFontSize(12)
                      doc.setFont('helvetica', 'normal')

                      const contenido = [
                        'VESTUARIOS:',
                        '• Implementar supervisión externa constante',
                        '• Establecer protocolos de acompañamiento',
                        '• Prohibir el acceso individual no supervisado',
                        '',
                        'COMUNICACIONES:',
                        '• Establecer canales oficiales únicos',
                        '• Prohibir comunicación privada',
                        '• Monitorizar intercambios',
                        '',
                        'ENTRENAMIENTOS:',
                        '• Supervisar relaciones adulto-menor',
                        '• Establecer límites físicos claros',
                        '• Documentar todas las actividades',
                        '',
                        'ESPACIOS CERRADOS:',
                        '• Eliminar situaciones de aislamiento',
                        '• Aplicar regla de visibilidad constante',
                        '• Mantener puertas abiertas'
                      ]

                      contenido.forEach(line => {
                        if (yPos > 270) {
                          doc.addPage()
                          yPos = 20
                        }
                        doc.text(line, 20, yPos)
                        yPos += 8
                      })

                      doc.save(`Mapa_Riesgos_${sessionData?.entidad || 'Entidad'}_${new Date().toISOString().split('T')[0]}.pdf`)
                    } catch (error) {
                      console.error('Error generando PDF:', error)
                      alert('Error al generar el PDF. Inténtalo de nuevo.')
                    }
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

              {/* Mapa de riesgos extenso con ejemplos detallados */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-bold text-orange-900 mb-4">Mapa de Riesgos LOPIVI - Análisis Completo</h3>

                {/* Sección 1: Riesgos Críticos */}
                <div className="mb-8">
                  <h4 className="font-bold text-red-900 mb-4 text-lg">1. RIESGOS CRÍTICOS DE PROTECCIÓN INFANTIL</h4>
                  <div className="grid md:grid-cols-1 gap-6">

                    {/* Vestuarios */}
                    <div className="border border-red-200 bg-red-50 rounded-lg p-6">
                      <h5 className="font-bold text-red-900 mb-3">A) VESTUARIOS Y ESPACIOS DE CAMBIO</h5>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-semibold text-red-800 mb-2">Riesgos Identificados:</h6>
                          <ul className="text-red-700 text-sm space-y-1">
                            <li>• Acceso no supervisado de adultos</li>
                            <li>• Permanencia individual sin supervisión</li>
                            <li>• Intercambio inapropiado de ropa</li>
                            <li>• Contacto físico no justificado</li>
                            <li>• Uso de dispositivos de grabación</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-semibold text-red-800 mb-2">Medidas Preventivas:</h6>
                          <ul className="text-red-700 text-sm space-y-1">
                            <li>• Supervisión externa obligatoria</li>
                            <li>• Protocolo de "puerta abierta"</li>
                            <li>• Registro de acceso temporal</li>
                            <li>• Separación por grupos de edad</li>
                            <li>• Prohibición de dispositivos electrónicos</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-red-100 rounded">
                        <h6 className="font-semibold text-red-800 mb-2">Ejemplo Práctico:</h6>
                        <p className="text-red-700 text-sm">
                          En un club deportivo, implementar que siempre haya al menos dos adultos presentes durante
                          el cambio de ropa, con registro horario de entrada y salida, y vestuarios separados por
                          categorías de edad. Establecer protocolo de 10 minutos máximo de permanencia.
                        </p>
                      </div>
                    </div>

                    {/* Comunicaciones */}
                    <div className="border border-orange-200 bg-orange-50 rounded-lg p-6">
                      <h5 className="font-bold text-orange-900 mb-3">B) COMUNICACIONES DIGITALES</h5>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-semibold text-orange-800 mb-2">Riesgos Identificados:</h6>
                          <ul className="text-orange-700 text-sm space-y-1">
                            <li>• Mensajes privados entre adulto-menor</li>
                            <li>• Intercambio de contactos personales</li>
                            <li>• Comunicación fuera del horario</li>
                            <li>• Uso de redes sociales no oficiales</li>
                            <li>• Compartición de imágenes/videos</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-semibold text-orange-800 mb-2">Medidas Preventivas:</h6>
                          <ul className="text-orange-700 text-sm space-y-1">
                            <li>• Canal oficial único de comunicación</li>
                            <li>• Prohibición de intercambio personal</li>
                            <li>• Horarios específicos de comunicación</li>
                            <li>• Supervisión de intercambios</li>
                            <li>• Política de "copia siempre a padres"</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-orange-100 rounded">
                        <h6 className="font-semibold text-orange-800 mb-2">Ejemplo Práctico:</h6>
                        <p className="text-orange-700 text-sm">
                          Crear grupo de WhatsApp oficial donde participen entrenadores, menores y padres.
                          Prohibir comunicación 1:1, establecer horario de 8:00-20:00, y registro mensual
                          de comunicaciones. Todo mensaje debe incluir información deportiva exclusivamente.
                        </p>
                      </div>
                    </div>

                    {/* Entrenamientos */}
                    <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-6">
                      <h5 className="font-bold text-yellow-900 mb-3">C) ENTRENAMIENTOS Y ACTIVIDADES</h5>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-semibold text-yellow-800 mb-2">Riesgos Identificados:</h6>
                          <ul className="text-yellow-700 text-sm space-y-1">
                            <li>• Entrenamientos individuales sin supervisión</li>
                            <li>• Contacto físico excesivo o inapropiado</li>
                            <li>• Correcciones técnicas con contacto</li>
                            <li>• Masajes o tratamientos sin protocolo</li>
                            <li>• Viajes y desplazamientos</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-semibold text-yellow-800 mb-2">Medidas Preventivas:</h6>
                          <ul className="text-yellow-700 text-sm space-y-1">
                            <li>• Mínimo 3 personas en entrenamientos</li>
                            <li>• Protocolo de contacto físico justificado</li>
                            <li>• Técnicas de corrección sin contacto</li>
                            <li>• Personal sanitario especializado</li>
                            <li>• Autorización parental para viajes</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-yellow-100 rounded">
                        <h6 className="font-semibold text-yellow-800 mb-2">Ejemplo Práctico:</h6>
                        <p className="text-yellow-700 text-sm">
                          En natación, implementar que las correcciones técnicas se realicen verbalmente o
                          con demostración. Si requiere contacto físico, debe estar presente otro entrenador
                          y registrarse en acta. Los masajes solo por fisioterapeuta titulado con padres presentes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección 2: Protocolos de Gestión */}
                <div className="mb-8">
                  <h4 className="font-bold text-blue-900 mb-4 text-lg">2. PROTOCOLOS DE GESTIÓN PRINCIPAL</h4>
                  <div className="grid md:grid-cols-2 gap-6">

                    <div className="border border-blue-200 bg-blue-50 rounded-lg p-6">
                      <h5 className="font-bold text-blue-900 mb-3">DETECCIÓN TEMPRANA</h5>
                      <div className="space-y-3">
                        <div>
                          <h6 className="font-semibold text-blue-800 mb-2">Indicadores Físicos:</h6>
                          <ul className="text-blue-700 text-sm space-y-1">
                            <li>• Lesiones inexplicables o frecuentes</li>
                            <li>• Marcas en zonas cubiertas por ropa</li>
                            <li>• Cambios en hábitos de higiene</li>
                            <li>• Ropa interior rasgada o manchada</li>
                            <li>• Enfermedades de transmisión sexual</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-semibold text-blue-800 mb-2">Indicadores Conductuales:</h6>
                          <ul className="text-blue-700 text-sm space-y-1">
                            <li>• Cambios bruscos de comportamiento</li>
                            <li>• Regresión a etapas anteriores</li>
                            <li>• Conocimiento sexual inapropiado para la edad</li>
                            <li>• Miedo hacia personas específicas</li>
                            <li>• Autolesiones o intentos de suicidio</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border border-green-200 bg-green-50 rounded-lg p-6">
                      <h5 className="font-bold text-green-900 mb-3">PROTOCOLO DE ACTUACIÓN</h5>
                      <div className="space-y-3">
                        <div>
                          <h6 className="font-semibold text-green-800 mb-2">Fase 1 - Inmediata (0-2 horas):</h6>
                          <ul className="text-green-700 text-sm space-y-1">
                            <li>• Garantizar seguridad del menor</li>
                            <li>• Separar del presunto agresor</li>
                            <li>• Documentar observaciones</li>
                            <li>• No interrogar al menor</li>
                            <li>• Contactar con delegado suplente</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-semibold text-green-800 mb-2">Fase 2 - Urgente (2-24 horas):</h6>
                          <ul className="text-green-700 text-sm space-y-1">
                            <li>• Notificar a servicios sociales</li>
                            <li>• Comunicar a padres/tutores</li>
                            <li>• Preservar evidencias</li>
                            <li>• Coordinar con autoridades</li>
                            <li>• Implementar medidas cautelares</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección 3: Casos Específicos por Deporte */}
                <div className="mb-8">
                  <h4 className="font-bold text-purple-900 mb-4 text-lg">3. ANÁLISIS POR ACTIVIDADES ESPECÍFICAS</h4>
                  <div className="grid md:grid-cols-3 gap-4">

                    <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                      <h5 className="font-bold text-purple-900 mb-3">DEPORTES DE CONTACTO</h5>
                      <div className="space-y-2">
                        <p className="text-purple-700 text-sm font-semibold">Riesgos específicos:</p>
                        <ul className="text-purple-700 text-xs space-y-1">
                          <li>• Contacto físico normalizado</li>
                          <li>• Técnicas de agarre/sujeción</li>
                          <li>• Vestuarios con duchas comunes</li>
                        </ul>
                        <p className="text-purple-700 text-sm font-semibold">Medidas:</p>
                        <ul className="text-purple-700 text-xs space-y-1">
                          <li>• Demostración técnica previa</li>
                          <li>• Explicación verbal de contactos</li>
                          <li>• Supervisión constante en duchas</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border border-pink-200 bg-pink-50 rounded-lg p-4">
                      <h5 className="font-bold text-pink-900 mb-3">DEPORTES INDIVIDUALES</h5>
                      <div className="space-y-2">
                        <p className="text-pink-700 text-sm font-semibold">Riesgos específicos:</p>
                        <ul className="text-pink-700 text-xs space-y-1">
                          <li>• Entrenamientos 1:1 frecuentes</li>
                          <li>• Viajes individuales a competiciones</li>
                          <li>• Relación mentor-alumno intensa</li>
                        </ul>
                        <p className="text-pink-700 text-sm font-semibold">Medidas:</p>
                        <ul className="text-pink-700 text-xs space-y-1">
                          <li>• Mínimo 2 entrenadores presentes</li>
                          <li>• Acompañamiento parental en viajes</li>
                          <li>• Rotación de entrenadores</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-4">
                      <h5 className="font-bold text-indigo-900 mb-3">ACTIVIDADES ACUÁTICAS</h5>
                      <div className="space-y-2">
                        <p className="text-indigo-700 text-sm font-semibold">Riesgos específicos:</p>
                        <ul className="text-indigo-700 text-xs space-y-1">
                          <li>• Menor ropa corporal</li>
                          <li>• Necesidad de ayuda física</li>
                          <li>• Vestuarios húmedos</li>
                        </ul>
                        <p className="text-indigo-700 text-sm font-semibold">Medidas:</p>
                        <ul className="text-indigo-700 text-xs space-y-1">
                          <li>• Técnicas de rescate protocolizadas</li>
                          <li>• Supervisión visual constante</li>
                          <li>• Cambio de ropa supervisado</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección 4: Herramientas de Monitorización */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">4. HERRAMIENTAS DE MONITORIZACIÓN Y EVALUACIÓN</h4>
                  <div className="grid md:grid-cols-2 gap-6">

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Registros Obligatorios:</h5>
                      <ul className="text-gray-700 text-sm space-y-2">
                        <li>• <strong>Registro de incidentes:</strong> Documentación detallada de cualquier situación anómala</li>
                        <li>• <strong>Registro de comunicaciones:</strong> Log mensual de intercambios con menores</li>
                        <li>• <strong>Registro de entrenamientos:</strong> Actividades, participantes y supervisores</li>
                        <li>• <strong>Registro de acceso:</strong> Control de entrada/salida en zonas sensibles</li>
                        <li>• <strong>Registro de formación:</strong> Capacitación del personal en protocolos</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Evaluaciones Periódicas:</h5>
                      <ul className="text-gray-700 text-sm space-y-2">
                        <li>• <strong>Auditoría mensual:</strong> Revisión de protocolos y cumplimiento</li>
                        <li>• <strong>Encuestas de bienestar:</strong> Feedback anónimo de menores y familias</li>
                        <li>• <strong>Evaluación de personal:</strong> Comportamiento y adherencia a protocolos</li>
                        <li>• <strong>Revisión de instalaciones:</strong> Seguridad física de espacios</li>
                        <li>• <strong>Actualización de riesgos:</strong> Identificación de nuevas amenazas</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">Indicadores de Éxito del Mapa de Riesgos:</h5>
                    <div className="grid md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <div className="text-xs text-gray-600">Incidentes reportados</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">100%</div>
                        <div className="text-xs text-gray-600">Personal formado</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">95%</div>
                        <div className="text-xs text-gray-600">Satisfacción familias</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">12</div>
                        <div className="text-xs text-gray-600">Auditorías anuales</div>
                      </div>
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
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recordatorios - Delegado Principal</h2>
                  <p className="text-sm text-gray-600">Seguimientos y tareas asignadas</p>
                </div>
                <button
                  onClick={() => setShowRecordatorios(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {recordatorios.map((recordatorio) => (
                  <div key={recordatorio.id} className={`border rounded-lg p-4 ${
                    recordatorio.prioridad === 'alta' ? 'border-red-200 bg-red-50' :
                    recordatorio.prioridad === 'media' ? 'border-orange-200 bg-orange-50' :
                    'border-yellow-200 bg-yellow-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                            recordatorio.prioridad === 'alta' ? 'bg-red-600' :
                            recordatorio.prioridad === 'media' ? 'bg-orange-600' :
                            'bg-yellow-600'
                          }`}>
                            {recordatorio.prioridad.toUpperCase()}
                          </span>
                          <h4 className="font-semibold text-gray-900">{recordatorio.titulo}</h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{recordatorio.descripcion}</p>
                        <div className="text-xs text-gray-500">
                          Fecha: {recordatorio.fechaVencimiento}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditarRecordatorio(recordatorio.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleCompletarRecordatorio(recordatorio.id)}
                          className="text-green-600 hover:text-green-800 text-xs font-medium"
                        >
                          Completar
                        </button>
                        <button
                          onClick={() => handleEliminarRecordatorio(recordatorio.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>Total de recordatorios: {recordatorios.length}</div>
                  <div>Recordatorios pendientes: {recordatorios.filter(r => r.estado === 'pendiente').length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Casos Urgentes - Principal con teléfonos */}
      {showCasosUrgentes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Casos Urgentes - Delegado Principal</h2>
                  <p className="text-sm text-gray-600">Intervención inmediata para situaciones críticas</p>
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
              <div className="space-y-4">
                {casosUrgentes.map((caso) => (
                  <div key={caso.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 rounded text-xs font-bold text-red-600 bg-red-100">
                            URGENTE
                          </span>
                          <h4 className="font-semibold text-gray-900">{caso.titulo}</h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{caso.descripcion}</p>
                        <div className="text-xs text-gray-500">
                          Nivel de urgencia: {caso.nivelUrgencia}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tiempo transcurrido: {caso.tiempoTranscurrido}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowProtocoloCaso(true)
                            setTipoProtocolo(caso.id)
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                        >
                          Protocolo
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Comunicaciones - Principal */}
      {showComunicaciones && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Gestión Comunicaciones - Delegado Principal</h2>
                  <p className="text-sm text-gray-600">Comunicar con miembros de la entidad</p>
                </div>
                <button
                  onClick={() => setShowComunicaciones(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {miembrosEntidad.map((miembro) => (
                  <div key={miembro.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 rounded text-xs font-bold text-blue-600 bg-blue-100">
                            {miembro.rol}
                          </span>
                          <h4 className="font-semibold text-gray-900">{miembro.nombre}</h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{miembro.email}</p>
                        <p className="text-gray-600 text-sm mb-2">{miembro.telefono}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            alert(`Comunicando con ${miembro.nombre}...`)
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                          Comunicar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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

      {/* Modal Gestionar Caso Específico */}
      {showGestionarCaso && casoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Gestionar Caso Específico</h2>
                  <p className="text-sm text-gray-600">Gestión detallada de casos activos</p>
                </div>
                <button
                  onClick={() => setShowGestionarCaso(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Información del Caso</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 mb-2"><strong>Título:</strong> {casoSeleccionado.titulo}</p>
                    <p className="text-gray-600 mb-2"><strong>Descripción:</strong> {casoSeleccionado.descripcion}</p>
                    <p className="text-gray-600 mb-2"><strong>Prioridad:</strong> {casoSeleccionado.prioridad}</p>
                    <p className="text-gray-600 mb-2"><strong>Estado:</strong> {casoSeleccionado.estado}</p>
                    <p className="text-gray-600 mb-2"><strong>Fecha de Creación:</strong> {new Date(casoSeleccionado.fechaCreacion).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Acciones Disponibles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setShowNuevoCaso(true)
                        setNuevoCaso({...nuevoCaso, titulo: casoSeleccionado.titulo, descripcion: casoSeleccionado.descripcion, prioridad: casoSeleccionado.prioridad})
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Reportar como nuevo caso
                    </button>
                    <button
                      onClick={() => {
                        setShowConfigAlertas(true)
                        setTipoProtocolo(casoSeleccionado.id)
                      }}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      Configurar alerta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Renovación de Certificado */}
      {showRenovacionCertificado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Renovación de Certificado</h2>
                  <p className="text-sm text-gray-600">Renovar certificación LOPIVI - Coste: 25€</p>
                </div>
                <button
                  onClick={() => setShowRenovacionCertificado(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-orange-900 mb-2">Tu certificado vence pronto</h3>
                <p className="text-orange-800 text-sm">
                  Quedan {estadoRenovacion.diasRestantes} días para el vencimiento.
                  Renueva ahora para mantener tu certificación activa.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Detalles de la Renovación</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Validez: 2 años adicionales</li>
                    <li>• Proceso rápido: 24-48 horas</li>
                    <li>• Certificado oficial actualizado</li>
                    <li>• Sin necesidad de repetir formación</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Proceso de Pago</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">Renovación certificado LOPIVI</span>
                      <span className="font-bold text-blue-900">25,00€</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">IVA incluido</span>
                      <span className="text-sm text-blue-800">21%</span>
                    </div>
                    <hr className="border-blue-200" />
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-900">Total</span>
                      <span className="font-bold text-blue-900 text-lg">25,00€</span>
                    </div>
                  </div>
                </div>

                {/* Selección de método de pago */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Método de Pago</h4>

                  {/* Opción de tarjeta guardada */}
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="tarjeta-guardada"
                          name="metodo-pago"
                          className="h-4 w-4 text-green-600 focus:ring-green-500"
                          defaultChecked
                        />
                        <label htmlFor="tarjeta-guardada" className="ml-3">
                          <div className="font-medium text-green-900">Usar tarjeta de contratación</div>
                          <div className="text-xs text-green-700">Visa terminada en ****1234 (usada en contratación inicial)</div>
                        </label>
                      </div>
                      <div className="text-green-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Opción de nueva tarjeta */}
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="nueva-tarjeta"
                          name="metodo-pago"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="nueva-tarjeta" className="ml-3">
                          <div className="font-medium text-gray-900">Nueva tarjeta</div>
                          <div className="text-xs text-gray-600">Visa, Mastercard, American Express</div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Opción de PayPal */}
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="paypal"
                          name="metodo-pago"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="paypal" className="ml-3">
                          <div className="font-medium text-gray-900">PayPal</div>
                          <div className="text-xs text-gray-600">Pago seguro con PayPal</div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Información de seguridad */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6V9a6 6 0 1112 0v8a6 6 0 01-12 0z" />
                      </svg>
                      <div>
                        <p className="text-blue-900 text-sm font-medium">Pago seguro</p>
                        <p className="text-blue-800 text-xs">
                          Recomendamos usar la misma tarjeta con la que contrataste inicialmente para mayor seguridad.
                          Todos los pagos están encriptados y protegidos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRenovacionCertificado(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const metodoSeleccionado = document.querySelector('input[name="metodo-pago"]:checked')?.id || 'tarjeta-guardada'
                    alert(`Procesando renovación con ${metodoSeleccionado}...\nRedirigiendo al proceso de pago seguro...`)
                    setShowRenovacionCertificado(false)
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Proceder al Pago (25€)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Configuración de Alertas */}
      {showConfigAlertas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Configuración de Alertas - Delegado Principal</h2>
                  <p className="text-sm text-gray-600">Configuración de alertas y acciones pendientes</p>
                </div>
                <button
                  onClick={() => setShowConfigAlertas(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Acciones Pendientes</h3>
                  <div className="space-y-3">
                    {accionesPendientes.map((accion) => (
                      <div key={accion.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                                accion.prioridad === 'alta' ? 'bg-red-600' :
                                accion.prioridad === 'media' ? 'bg-orange-600' :
                                'bg-yellow-600'
                              }`}>
                                {accion.prioridad.toUpperCase()}
                              </span>
                              <h4 className="font-semibold text-gray-900">{accion.titulo}</h4>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{accion.descripcion}</p>
                            <div className="text-xs text-gray-500">
                              Impacto: {accion.porcentajeImpacto}%
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowConfigAlertas(false)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                              Accionar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Eventos Pendientes</h3>
                  <div className="space-y-3">
                    {eventosCalendario
                      .filter(evento => evento.estado === 'pendiente')
                      .map(evento => (
                        <div key={evento.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                                  evento.tipo === 'certificacion' ? 'bg-blue-600' :
                                  evento.tipo === 'renovacion' ? 'bg-orange-600' :
                                  evento.tipo === 'auditoria' ? 'bg-purple-600' :
                                  evento.tipo === 'contrato' ? 'bg-green-600' :
                                  'bg-indigo-600'
                                }`}>
                                  {evento.tipo}
                                </span>
                                <h4 className="font-semibold text-gray-900">{evento.titulo}</h4>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{evento.descripcion}</p>
                              <div className="text-xs text-gray-500">
                                Fecha: {new Date(evento.fecha).toLocaleDateString()} | {evento.diasAnticipacion} días de anticipación
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setShowConfigAlertas(false)}
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                              >
                                Configurar alerta
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Protocolo de Caso Urgente */}
      {showProtocoloCaso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Protocolo de Caso Urgente - Delegado Principal</h2>
                  <p className="text-sm text-gray-600">Intervención inmediata para situaciones críticas</p>
                </div>
                <button
                  onClick={() => setShowProtocoloCaso(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Información del Caso</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 mb-2"><strong>Título:</strong> {casosUrgentes[0]?.titulo}</p>
                    <p className="text-gray-600 mb-2"><strong>Descripción:</strong> {casosUrgentes[0]?.descripcion}</p>
                    <p className="text-gray-600 mb-2"><strong>Nivel de Urgencia:</strong> {casosUrgentes[0]?.nivelUrgencia}</p>
                    <p className="text-gray-600 mb-2"><strong>Tiempo Transcurrido:</strong> {casosUrgentes[0]?.tiempoTranscurrido}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Protocolo de Intervención</h3>
                  <div className="space-y-3">
                    {tiposCasosUrgentes.map((tipo) => (
                      <div key={tipo.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                            tipo.nivelUrgencia === 'critica' ? 'bg-red-600' :
                            tipo.nivelUrgencia === 'alta' ? 'bg-orange-600' :
                            'bg-yellow-600'
                          }`}>
                            {tipo.nivelUrgencia.toUpperCase()}
                          </span>
                          <h4 className="font-semibold text-gray-900">{tipo.titulo}</h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{tipo.descripcion}</p>
                        <div className="text-xs text-gray-500">
                          Tiempo máximo de respuesta: {tipo.tiempoMaximoRespuesta}
                        </div>
                        <div className="mt-2">
                          <h5 className="font-semibold text-gray-900 mb-2">Protocolo de Acción</h5>
                          <ol className="list-decimal list-inside space-y-1 text-gray-600">
                            {tipo.protocoloActuacion.map((paso, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                                  paso.paso === 1 ? 'bg-red-600' :
                                  paso.paso === 2 ? 'bg-orange-600' :
                                  paso.paso === 3 ? 'bg-yellow-600' :
                                  paso.paso === 4 ? 'bg-green-600' :
                                  'bg-blue-600'
                                }`}>
                                  {paso.paso}
                                </span>
                                <div>
                                  <p className="font-semibold text-gray-900">{paso.accion}</p>
                                  <p className="text-gray-600 text-sm">{paso.detalle}</p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <GestionDocumentacion
        entidadId={sessionData?.id || ''}
        isOpen={showGestionDocumentacion}
        onClose={() => setShowGestionDocumentacion(false)}
      />
    </div>
  )
}
