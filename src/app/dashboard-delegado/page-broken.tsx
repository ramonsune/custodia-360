'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BackupExportacion from '@/components/BackupExportacion'
import InformesMensuales from '@/components/InformesMensuales'
import GestionDocumentacion from '@/components/GestionDocumentacion'
import { useBloqueoSistema } from '@/hooks/useBloqueoSistema'
import AlertasPanel from '@/components/AlertasPanel'
import GestionFormaciones from '@/components/GestionFormaciones'
import RegistroPersonal from '@/components/RegistroPersonal'
import HistorialIncidencias from '@/components/HistorialIncidencias'

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
  sistemaRestringido?: boolean
  certificadoPospuesto?: boolean
  diasRestantesCertificado?: number
  fechaInicioTramite?: string
}

interface Alerta {
  id: string
  titulo: string
  descripcion: string
  tipo: 'urgente' | 'importante' | 'informativo'
  estado: 'pendiente' | 'en_revision' | 'resuelta'
  prioridad: number
  fechaCreacion: string
  accionRequerida: string
  asignadoA: string
}

interface Caso {
  id: string
  titulo: string
  descripcion: string
  estado: 'abierto' | 'en_proceso' | 'cerrado'
  prioridad: 'alta' | 'media' | 'baja'
  fechaCreacion: string
  asignadoA: string
  categoria: string
}

export default function DashboardDelegadoPrincipal() {
  const router = useRouter()
  const { verificarBloqueo } = useBloqueoSistema()

  // Estados principales
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sistemaRestringido, setSistemaRestringido] = useState(false)
  const [subiendoCertificado, setSubiendoCertificado] = useState(false)

  // Estados para modales
  const [showDetalleAlerta, setShowDetalleAlerta] = useState(false)
  const [showGestionarCasoDetalle, setShowGestionarCasoDetalle] = useState(false)
  const [showCasosActivos, setShowCasosActivos] = useState(false)
  const [showAlertas, setShowAlertas] = useState(false)
  const [showInformacionCumplimiento, setShowInformacionCumplimiento] = useState(false)

  const [showTiposCasos, setShowTiposCasos] = useState(false)
  const [showCertificadosPenales, setShowCertificadosPenales] = useState(false)
  const [casoSeleccionado, setCasoSeleccionado] = useState<string | null>(null)
  const [showRenovacionCertificado, setShowRenovacionCertificado] = useState(false)
  const [showMapaRiesgos, setShowMapaRiesgos] = useState(false)
  const [datosRenovacion, setDatosRenovacion] = useState({
    fechaEmision: '',
    fechaVencimiento: '',
    nuevaTarjeta: false
  })
  const [procesandoPago, setProcesandoPago] = useState(false)

  // Estados para documentación LOPIVI
  const [showDocumentacionLOPIVI, setShowDocumentacionLOPIVI] = useState(false)
  const [showVisualizarDocumento, setShowVisualizarDocumento] = useState<{documento: any, entidad: string} | null>(null)
  const [showDistribuirDocumento, setShowDistribuirDocumento] = useState<{documento: any, entidad: string} | null>(null)

  // Estados para nuevos modales
  const [showInformacionCumplimientoDetallado, setShowInformacionCumplimientoDetallado] = useState(false)
  const [showGestionPersonal, setShowGestionPersonal] = useState(false)
  const [showCasosUrgentes, setShowCasosUrgentes] = useState(false)
  const [showInstruccionesCasoUrgente, setShowInstruccionesCasoUrgente] = useState<any>(null)

  // Estados para Centro de Ayuda LOPIVI
  const [mostrarCentroAyuda, setMostrarCentroAyuda] = useState(false)
  const [modalAyudaActivo, setModalAyudaActivo] = useState<string | null>(null)

  // Estados para Gestión Avanzada
  const [vistaAvanzada, setVistaAvanzada] = useState<'alertas' | 'formaciones' | 'personal' | 'incidencias'>('alertas')
  const [documentosEstado, setDocumentosEstado] = useState({
    planProteccion: 100, // Plan completado
    personal: 85,        // 85% del personal formado
    protocolos: 95,      // Protocolos casi completos
    coordinacion: 75,    // Coordinación con suplente
    porcentajeGeneral: 89
  })

  // Estados para datos
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<Alerta | null>(null)
  const [casoEnGestion, setCasoEnGestion] = useState<Caso | null>(null)
  const [casosActivos, setCasosActivos] = useState<Caso[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])

  // Función para cerrar todos los modales antes de abrir uno nuevo
  const cerrarTodosLosModales = () => {
    setShowDocumentacionLOPIVI(false)
    setShowVisualizarDocumento(null)
    setShowDistribuirDocumento(null)
    setShowDetalleAlerta(false)
    setShowGestionarCasoDetalle(false)
    setShowCasosActivos(false)
    setShowAlertas(false)
    setShowInformacionCumplimiento(false)
    setShowTiposCasos(false)
    setShowCertificadosPenales(false)
    setShowRenovacionCertificado(false)
    setShowMapaRiesgos(false)
    setShowInformacionCumplimientoDetallado(false)
    setShowGestionPersonal(false)
    setModalAyudaActivo(null)
  }

  // Verificar sesión al cargar
  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (session) {
      try {
        const data = JSON.parse(session)

        // Verificar expiración de sesión
        if (data.expiracion && new Date(data.expiracion) <= new Date()) {
          localStorage.removeItem('userSession')
          router.push('/login-delegados')
          return
        }

        if (data.tipo !== 'principal') {
          router.push('/')
          return
        }

        setSessionData(data)
        inicializarDatos()

        // Verificar si el sistema está restringido
        const sistemaRestringidoGuardado = localStorage.getItem('sistema_restringido')
        if (sistemaRestringidoGuardado === 'true' || data.sistemaRestringido) {
          setSistemaRestringido(true)
        }

      } catch (error) {
        console.error('Error loading session:', error)
        router.push('/login-delegados')
        return
      }
    } else {
      router.push('/login-delegados')
      return
    }
    setLoading(false)
  }, [router])

  // Inicializar datos
  const inicializarDatos = () => {
    const casosGuardados = localStorage.getItem('casosActivos_suplente')
    if (casosGuardados) {
      setCasosActivos(JSON.parse(casosGuardados))
    } else {
      const casosIniciales = [
        {
          id: 'caso-001-suplente',
          titulo: 'Seguimiento Formación Personal',
          descripcion: 'Supervisión del cumplimiento de formación LOPIVI del personal asignado',
          estado: 'en_proceso' as const,
          prioridad: 'alta' as const,
          fechaCreacion: new Date().toISOString(),
          asignadoA: 'Delegado Suplente',
          categoria: 'Formación'
        },
        {
          id: 'caso-002-suplente',
          titulo: 'Documentación Específica',
          descripcion: 'Revisión y actualización de protocolos específicos',
          estado: 'abierto' as const,
          prioridad: 'media' as const,
          fechaCreacion: new Date().toISOString(),
          asignadoA: 'Delegado Suplente',
          categoria: 'Documentación'
        },
        {
          id: 'caso-003-suplente',
          titulo: 'Apoyo Coordinación General',
          descripcion: 'Tareas de apoyo al delegado principal en coordinación',
          estado: 'abierto' as const,
          prioridad: 'media' as const,
          fechaCreacion: new Date().toISOString(),
          asignadoA: 'Delegado Suplente',
          categoria: 'Coordinación'
        }
      ]
      setCasosActivos(casosIniciales)
      localStorage.setItem('casosActivos_suplente', JSON.stringify(casosIniciales))
    }

    const alertasGuardadas = localStorage.getItem('alertas_suplente')
    if (alertasGuardadas) {
      setAlertas(JSON.parse(alertasGuardadas))
    } else {
      const alertasIniciales = [
        {
          id: 'alerta-001-suplente',
          titulo: 'Documentación Pendiente',
          descripcion: 'Algunos documentos requieren actualización por parte del suplente',
          tipo: 'importante' as const,
          estado: 'pendiente' as const,
          prioridad: 3,
          fechaCreacion: new Date().toISOString(),
          accionRequerida: 'Revisar y completar documentos asignados',
          asignadoA: 'Delegado Suplente'
        },
        {
          id: 'alerta-002-suplente',
          titulo: 'Coordinación con Principal',
          descripcion: 'Reunión semanal de coordinación pendiente',
          tipo: 'informativo' as const,
          estado: 'pendiente' as const,
          prioridad: 2,
          fechaCreacion: new Date().toISOString(),
          accionRequerida: 'Programar reunión de coordinación',
          asignadoA: 'Delegado Suplente'
        }
      ]
      setAlertas(alertasIniciales)
      localStorage.setItem('alertas_suplente', JSON.stringify(alertasIniciales))
    }
  }

  // Función para iniciar gestión de caso
  const iniciarGestionCaso = (caso: Caso) => {
    setCasoEnGestion(caso)
    cerrarTodosLosModales()
    setShowGestionarCasoDetalle(true)
  }

  // Función para actualizar estado de caso
  const actualizarEstadoCaso = (casoId: string, nuevoEstado: string) => {
    const casosActualizados = casosActivos.map(caso =>
      caso.id === casoId ? { ...caso, estado: nuevoEstado as any } : caso
    )
    setCasosActivos(casosActualizados)
    localStorage.setItem('casosActivos_suplente', JSON.stringify(casosActualizados))
  }

  // Función para actualizar estado de alerta
  const actualizarEstadoAlerta = (alertaId: string, nuevoEstado: string) => {
    const alertasActualizadas = alertas.map(alerta =>
      alerta.id === alertaId ? { ...alerta, estado: nuevoEstado as any } : alerta
    )
    setAlertas(alertasActualizadas)
    localStorage.setItem('alertas_suplente', JSON.stringify(alertasActualizadas))
  }

  // Función para mostrar detalles de alerta
  const mostrarDetalleAlerta = (alerta: Alerta) => {
    setAlertaSeleccionada(alerta)
    cerrarTodosLosModales()
    setShowDetalleAlerta(true)
  }

  // Calcular días restantes para renovación de certificación
  const calcularDiasRenovacion = () => {
    const fechaExpiracion = new Date()
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 52) // 52 días para renovar

    const ahora = new Date()
    const tiempoRestante = fechaExpiracion.getTime() - ahora.getTime()
    const diasRestantes = Math.ceil(tiempoRestante / (1000 * 3600 * 24))

    return {
      diasRestantes,
      fechaExpiracion: fechaExpiracion.toLocaleDateString('es-ES'),
      requiereRenovacion: diasRestantes <= 60,
      esPrimeraCertificacion: false
    }
  }

  // Calcular estado de cumplimiento
  const calcularCumplimiento = () => {
    const elementos = [
      { nombre: 'Plan de Protección Vigente', completado: true },
      { nombre: 'Delegado Principal Certificado', completado: true },
      { nombre: 'Delegado Suplente Certificado', completado: true },
      { nombre: 'Personal Formado en LOPIVI', completado: false },
      { nombre: 'Protocolos Actualizados', completado: true },
      { nombre: 'Canal de Comunicación Activo', completado: true },
      { nombre: 'Registro de Casos Actualizado', completado: true },
      { nombre: 'Auditoría Anual Realizada', completado: false }
    ]

    const completados = elementos.filter(e => e.completado).length
    const porcentaje = Math.round((completados / elementos.length) * 100)

    return { porcentaje, completados, total: elementos.length, elementos }
  }

  // Función para subir certificado de delincuentes sexuales
  const subirCertificadoDelincuentes = async (archivo: File) => {
    setSubiendoCertificado(true)
    try {
      // Simular subida de archivo
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Marcar certificado como entregado
      localStorage.setItem('certificado_suplente_entregado', 'true')
      localStorage.removeItem('sistema_restringido')
      localStorage.removeItem('certificado_pospuesto')
      localStorage.removeItem('fecha_inicio_certificado')

      // Actualizar sesión
      if (sessionData) {
        const sessionActualizada = {
          ...sessionData,
          sistemaRestringido: false,
          certificadoPospuesto: false
        }
        localStorage.setItem('userSession', JSON.stringify(sessionActualizada))
        setSessionData(sessionActualizada)
        setSistemaRestringido(false)
      }

      alert('Certificado subido exitosamente. Su acceso ha sido restaurado.')

    } catch (error) {
      console.error('Error subiendo certificado:', error)
      alert('Error al subir el certificado. Inténtelo nuevamente.')
    } finally {
      setSubiendoCertificado(false)
    }
  }

  // Componente para interfaz restringida
  const InterfazRestringida = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">🚫 ACCESO RESTRINGIDO - CERTIFICADO REQUERIDO</h1>
          <p className="text-sm mt-1">
            Su acceso está limitado. Debe entregar el Certificado Negativo del Registro Central de Delincuentes Sexuales para continuar.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-3xl">📋</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Certificado de Delincuentes Sexuales Requerido
            </h2>
            <p className="text-gray-600 mb-4">
              Como Delegado/a Suplente de Protección de <strong>{sessionData?.entidad}</strong>,
              debe entregar el Certificado Negativo del Registro Central de Delincuentes Sexuales y de Trata de Seres Humanos.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Han transcurrido 30 días</strong> desde el inicio del trámite.
                Según la normativa LOPIVI, no puede ejercer funciones sin este certificado.
              </p>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
            <input
              type="file"
              id="certificado-upload"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const archivo = e.target.files?.[0]
                if (archivo) {
                  subirCertificadoDelincuentes(archivo)
                }
              }}
              disabled={subiendoCertificado}
              className="hidden"
            />
            <label
              htmlFor="certificado-upload"
              className={`cursor-pointer ${subiendoCertificado ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 text-xl">📎</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {subiendoCertificado ? 'Subiendo certificado...' : 'Subir Certificado Negativo'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {subiendoCertificado
                    ? 'Procesando archivo...'
                    : 'Haga clic para seleccionar el archivo PDF, JPG o PNG del certificado'
                  }
                </p>
              </div>
            </label>
          </div>

          {subiendoCertificado && (
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Información del certificado:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Debe ser el Certificado Negativo oficial del Ministerio de Justicia</li>
              <li>• Válido por 3 meses desde su expedición</li>
              <li>• Formato aceptado: PDF, JPG, PNG (máximo 5MB)</li>
              <li>• Una vez verificado, su acceso será restaurado inmediatamente</li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-xs">
              Si tiene problemas para obtener el certificado, contacte con soporte: support@custodia360.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // Si el sistema está restringido, mostrar solo la interfaz de subida de certificado
  if (sistemaRestringido) {
    return <InterfazRestringida />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Logo y nombre removidos */}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {sessionData?.nombre} - Delegado Principal
              </span>
              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setShowCasosUrgentes(true)
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
              >
                Caso Urgente
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('userSession')
                  router.push('/')
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-purple-600 mb-2">{sessionData?.entidad || 'Mi Entidad'}</h2>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Delegado Principal</h1>
          <p className="text-gray-600 mt-2">Panel principal de gestión LOPIVI</p>
        </div>

        {/* Título: Situación de la entidad */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Situación de la entidad</h2>
        </div>

        {/* Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Casos Asignados</p>
                <p className="text-2xl font-bold text-gray-900">{casosActivos.length}</p>
              </div>
              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setShowCasosActivos(true)
                }}
                className="text-purple-600 border border-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-50 text-sm"
              >
                Ver casos
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificación</p>
                <p className="text-lg font-bold text-green-600">
                  {calcularDiasRenovacion().diasRestantes}
                </p>
                <p className="text-xs text-gray-500">días</p>
              </div>
              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setShowRenovacionCertificado(true)
                }}
                className="text-green-600 border border-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-sm"
              >
                Renovar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Personal Formado</p>
                <p className="text-2xl font-bold text-green-600">{documentosEstado.personal}%</p>
                <p className="text-xs text-gray-500">17 de 20 personas</p>
              </div>
              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setShowGestionPersonal(true)
                }}
                className="text-green-600 border border-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 text-sm"
              >
                Ver
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificación negativa del registro central de delincuentes sexuales y de trata de seres humanos</p>
                <p className="text-xs text-gray-500">estado del personal</p>
              </div>
              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setShowCertificadosPenales(true)
                }}
                className="text-red-600 border border-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 text-sm"
              >
                Gestionar
              </button>
            </div>
          </div>
        </div>

        {/* Nueva Card de Documentación LOPIVI - Versión Suplente */}
        <div className="col-span-full mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Biblioteca LOPIVI - Apoyo</h3>
                  <p className="text-gray-600">Tareas de apoyo al delegado principal</p>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-3">
                  <div className="text-2xl font-bold text-purple-600">{documentosEstado.coordinacion}%</div>
                  <div className="text-sm text-gray-500">Coordinación</div>
                </div>
              </div>
            </div>

            {/* Indicadores específicos del suplente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Tareas Asignadas</div>
                    <div className="text-2xl font-bold text-purple-600">{casosActivos.length}</div>
                  </div>
                </div>
                <div className="text-xs text-purple-600 mt-1">En seguimiento</div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Coordinación</div>
                    <div className="text-2xl font-bold text-blue-600">{documentosEstado.coordinacion}%</div>
                  </div>
                </div>
                <div className="text-xs text-blue-600 mt-1">Con principal</div>
              </div>
            </div>

            {/* Próxima acción del suplente */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-purple-800 font-medium text-sm">
                  Próxima acción: Revisión de documentación específica asignada (2 días)
                </span>
              </div>
            </div>

            {/* Botones de acción específicos del suplente */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setShowDocumentacionLOPIVI(true)
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Documentación
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Cumplimiento */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Estado de Cumplimiento LOPIVI</h3>
              <p className="text-gray-600">Progreso de implementación normativa</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-blue-600">{calcularCumplimiento().porcentaje}%</span>
              <p className="text-sm text-gray-600">{calcularCumplimiento().completados} de {calcularCumplimiento().total} elementos</p>
            </div>
          </div>

          {/* Barra de progreso con hitos */}
          <div className="relative mb-6">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500 relative"
                style={{ width: `${calcularCumplimiento().porcentaje}%` }}
              >
                <div className="absolute right-0 top-0 h-4 w-1 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Marcadores de hitos */}
            <div className="absolute top-0 w-full h-4">
              {[25, 50, 75, 100].map((hito) => (
                <div
                  key={hito}
                  className="absolute"
                  style={{ left: `calc(${hito}% - 6px)` }}
                >
                  <div className={`w-3 h-3 rounded-full border-2 ${
                    calcularCumplimiento().porcentaje >= hito
                      ? 'bg-green-500 border-white'
                      : 'bg-white border-gray-400'
                  }`}></div>
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                    {hito}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                cerrarTodosLosModales()
                setShowInformacionCumplimientoDetallado(true)
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Información
            </button>
          </div>
        </div>

        {/* Centro de Ayuda LOPIVI */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Centro de Ayuda LOPIVI - Delegado Principal</h3>
              <p className="text-gray-600">Guías y recursos para el cumplimiento normativo</p>
            </div>
            <button
              onClick={() => setMostrarCentroAyuda(!mostrarCentroAyuda)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {mostrarCentroAyuda ? 'Ocultar' : 'Ver Centro de Ayuda'}
            </button>
          </div>

          {mostrarCentroAyuda && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setModalAyudaActivo('fundamentos')
                }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left hover:bg-blue-100 transition-colors"
              >
                <h4 className="font-bold text-blue-900 mb-2">Fundamentos LOPIVI</h4>
                <p className="text-blue-700 text-sm">Qué es la LOPIVI, Plan de Protección y rol del delegado suplente</p>
              </button>

              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setModalAyudaActivo('dashboard')
                }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 text-left hover:bg-green-100 transition-colors"
              >
                <h4 className="font-bold text-green-900 mb-2">Uso del Dashboard</h4>
                <p className="text-green-700 text-sm">Cómo navegar y utilizar todas las funciones del panel de control</p>
              </button>

              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setModalAyudaActivo('casos')
                }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 text-left hover:bg-red-100 transition-colors"
              >
                <h4 className="font-bold text-red-900 mb-2">Gestión de Casos</h4>
                <p className="text-red-700 text-sm">Protocolos de actuación, documentación y seguimiento de incidencias</p>
              </button>

              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setModalAyudaActivo('tareas')
                }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left hover:bg-yellow-100 transition-colors"
              >
                <h4 className="font-bold text-yellow-900 mb-2">Tareas del Suplente</h4>
                <p className="text-yellow-700 text-sm">Responsabilidades específicas, coordinación y apoyo al delegado principal</p>
              </button>

              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setModalAyudaActivo('faqs')
                }}
                className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left hover:bg-orange-100 transition-colors"
              >
                <h4 className="font-bold text-orange-900 mb-2">Preguntas Frecuentes</h4>
                <p className="text-orange-700 text-sm">Dudas comunes y soluciones rápidas para situaciones habituales</p>
              </button>

              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setModalAyudaActivo('contactos')
                }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-bold text-gray-900 mb-2">Contactos de Emergencia</h4>
                <p className="text-gray-700 text-sm">Números y recursos importantes para situaciones urgentes</p>
              </button>
            </div>
          )}
        </div>

        {/* Título: Acciones */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Acciones</h2>
        </div>

        {/* Alertas Panel Compacto */}
        <div className="mb-8">
          <AlertasPanel entidadId={sessionData?.entidad || 'default'} compact={true} />
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Gestión de Casos</h3>
            <div className="space-y-3">
              <Link href="/dashboard-suplente/nuevo-caso" className="block w-full text-purple-600 border border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 text-center">
                Crear Nuevo Caso
              </Link>
              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setShowCasosActivos(true)
                }}
                className="block w-full text-gray-600 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Ver Casos Asignados
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Alertas y Notificaciones</h3>
            <div className="space-y-3">
              <Link href="/dashboard-suplente/alertas" className="block w-full text-orange-600 border border-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 text-center">
                Revisar Alertas
              </Link>
              <Link href="/dashboard-suplente/resolver-alertas" className="block w-full text-yellow-600 border border-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-50 text-center">
                Resolver Alertas
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Comunicación</h3>
            <div className="space-y-3">
              <Link href="/dashboard-suplente/comunicacion-personal" className="block w-full text-teal-600 border border-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 text-center">
                Personal
              </Link>
              <Link href="/dashboard-suplente/comunicacion-familias" className="block w-full text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 text-center">
                Familias
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Informes</h3>
            <div className="space-y-3">
              <Link href="/dashboard-suplente/informe-actividades" className="block w-full text-green-600 border border-green-600 px-4 py-2 rounded-lg hover:bg-green-50 text-center">
                Informe Actividades
              </Link>
            </div>
          </div>
        </div>

        {/* Título: Gestión Avanzada */}
        <div className="mb-4 mt-12">
          <h2 className="text-2xl font-bold text-gray-800">Gestión Avanzada LOPIVI</h2>
          <p className="text-gray-600">Herramientas avanzadas para el cumplimiento normativo</p>
        </div>

        {/* Pestañas de Gestión Avanzada */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setVistaAvanzada('alertas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  vistaAvanzada === 'alertas'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sistema de Alertas
              </button>
              <button
                onClick={() => setVistaAvanzada('formaciones')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  vistaAvanzada === 'formaciones'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Formaciones Personal
              </button>
              <button
                onClick={() => setVistaAvanzada('personal')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  vistaAvanzada === 'personal'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Registro Personal
              </button>
              <button
                onClick={() => setVistaAvanzada('incidencias')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  vistaAvanzada === 'incidencias'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Histórico Incidencias
              </button>
            </nav>
          </div>

          <div className="p-6">
            {vistaAvanzada === 'alertas' && (
              <AlertasPanel entidadId={sessionData?.entidad || 'default'} />
            )}

            {vistaAvanzada === 'formaciones' && (
              <GestionFormaciones entidadId={sessionData?.entidad || 'default'} />
            )}

            {vistaAvanzada === 'personal' && (
              <RegistroPersonal entidadId={sessionData?.entidad || 'default'} />
            )}

            {vistaAvanzada === 'incidencias' && (
              <HistorialIncidencias entidadId={sessionData?.entidad || 'default'} />
            )}
          </div>
        </div>
      </main>

      {/* Modal Casos Activos */}
      {showCasosActivos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Casos Asignados - Delegado Suplente</h2>
                <button
                  onClick={() => setShowCasosActivos(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {casosActivos.map((caso) => (
                <div key={caso.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{caso.titulo}</h3>
                      <p className="text-gray-600 text-sm mt-1">{caso.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-2">Creado: {new Date(caso.fechaCreacion).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs px-2 py-1 rounded border ${
                        caso.prioridad === 'alta' ? 'bg-red-50 text-red-600 border-red-200' :
                        caso.prioridad === 'media' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                        'bg-green-50 text-green-600 border-green-200'
                      }`}>
                        {caso.prioridad.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        caso.estado === 'abierto' ? 'bg-red-50 text-red-600 border-red-200' :
                        caso.estado === 'en_proceso' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                        'bg-green-50 text-green-600 border-green-200'
                      }`}>
                        {caso.estado.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">Acciones disponibles:</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCasoEnGestion(caso)
                            setShowGestionarCasoDetalle(true)
                          }}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
                        >
                          Gestionar
                        </button>
                        {caso.estado !== 'cerrado' && (
                          <button
                            onClick={() => {
                              actualizarEstadoCaso(caso.id, 'cerrado')
                              alert(`Caso "${caso.titulo}" cerrado correctamente.`)
                            }}
                            className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                          >
                            Cerrar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Certificados de Penales */}
      {showCertificadosPenales && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Gestión de Certificación Negativa del Registro Central de Delincuentes Sexuales y de Trata de Seres Humanos</h2>
                <button
                  onClick={() => setShowCertificadosPenales(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Información sobre cómo obtener el certificado */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Cómo Obtener la Certificación Negativa</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">Solicitud Online (Recomendado)</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                      <li>Web: <strong>www.mjusticia.gob.es</strong></li>
                      <li>Necesario: DNI electrónico o Cl@ve</li>
                      <li>Coste: Gratuito</li>
                      <li>Tiempo: Inmediato (PDF oficial)</li>
                      <li>Validez: 3 meses desde emisión</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">Solicitud Presencial</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                      <li>Lugares: Oficinas del Registro Central</li>
                      <li>Horario: L-V 9:00-14:00</li>
                      <li>Documentos: DNI original</li>
                      <li>Coste: Gratuito</li>

                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-white rounded border border-blue-200">
                  <p className="text-sm text-blue-800"><strong>Importante:</strong> El certificado debe ser específico para "trabajar con menores" y tener una antigüedad máxima de 3 meses en el momento de la entrega.</p>
                </div>
              </div>

              {/* Personal que HA ENTREGADO el certificado */}
              <div className="bg-green-50 border border-green-200 rounded-lg">
                <div className="p-6 border-b border-green-200">
                  <h3 className="text-lg font-bold text-green-900">✅ Personal con Certificación Entregada</h3>
                  <p className="text-sm text-green-700">Personas que han entregado su certificación negativa</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase">Cargo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase">Fecha Entrega</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase">Fecha Renovación</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-green-200">
                      {[
                        {
                          id: 1,
                          nombre: 'María González',
                          cargo: 'Entrenadora',
                          estado: 'vigente',
                          fechaEntrega: '2024-01-15',
                          fechaRenovacion: '2024-04-15',
                          diasRestantes: 45
                        },
                        {
                          id: 2,
                          nombre: 'Carlos Martín',
                          cargo: 'Monitor',
                          estado: 'proxima_renovacion',
                          fechaEntrega: '2024-01-20',
                          fechaRenovacion: '2024-04-20',
                          diasRestantes: 25
                        },
                        {
                          id: 5,
                          nombre: 'Elena Ruiz',
                          cargo: 'Fisioterapeuta',
                          estado: 'vigente',
                          fechaEntrega: '2023-12-10',
                          fechaRenovacion: '2024-03-10',
                          diasRestantes: 68
                        }
                      ].map((persona) => (
                        <tr key={persona.id} className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {persona.nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {persona.cargo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              persona.estado === 'vigente' ? 'bg-green-100 text-green-800' :
                              persona.estado === 'proxima_renovacion' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {persona.estado === 'vigente' ? 'Vigente' :
                               persona.estado === 'proxima_renovacion' ? 'Próx. Renovación' :
                               'Vencido'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(persona.fechaEntrega).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <div>{new Date(persona.fechaRenovacion).toLocaleDateString('es-ES')}</div>
                              {persona.diasRestantes && (
                                <div className="text-xs text-gray-400">
                                  ({persona.diasRestantes} días restantes)
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              {persona.estado === 'proxima_renovacion' && (
                                <button
                                  onClick={() => alert(`Enviando aviso de renovación a ${persona.nombre}...\n\n✅ Notificación enviada\n✅ Instrucciones de renovación incluidas\n✅ Recordatorio automático en 10 días`)}
                                  className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700"
                                >
                                  Avisar Renovación
                                </button>
                              )}
                              <button
                                onClick={() => alert(`Historial de ${persona.nombre}:\n\n📧 Emails enviados: 1\n📅 Último contacto: ${new Date().toLocaleDateString('es-ES')}\n📋 Certificado vigente desde: ${new Date(persona.fechaEntrega).toLocaleDateString('es-ES')}\n✅ Estado: Cumple normativa LOPIVI`)}
                                className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
                              >
                                Ver Historial
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Personal que NO HA ENTREGADO el certificado */}
              <div className="bg-red-50 border border-red-200 rounded-lg">
                <div className="p-6 border-b border-red-200">
                  <h3 className="text-lg font-bold text-red-900">❌ Personal sin Certificación</h3>
                  <p className="text-sm text-red-700">Personas que necesitan entregar su certificación negativa</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-red-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Cargo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Días Transcurridos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Último Contacto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-200">
                      {[
                        {
                          id: 3,
                          nombre: 'Ana López',
                          cargo: 'Coordinadora',
                          estado: 'pendiente_entrega',
                          diasTranscurridos: 15,
                          ultimoContacto: '2024-01-20',
                          intentosContacto: 2
                        },
                        {
                          id: 4,
                          nombre: 'Pedro Sánchez',
                          cargo: 'Auxiliar',
                          estado: 'bloqueado',
                          diasTranscurridos: 45,
                          ultimoContacto: '2023-12-15',
                          intentosContacto: 5
                        },
                        {
                          id: 6,
                          nombre: 'Rosa Morales',
                          cargo: 'Monitor de Apoyo',
                          estado: 'pendiente_entrega',
                          diasTranscurridos: 8,
                          ultimoContacto: '2024-01-25',
                          intentosContacto: 1
                        }
                      ].map((persona) => (
                        <tr key={persona.id} className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {persona.nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {persona.cargo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              persona.estado === 'pendiente_entrega' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {persona.estado === 'pendiente_entrega' ? 'Pendiente' : 'Bloqueado'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {persona.diasTranscurridos} días
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <div>{new Date(persona.ultimoContacto).toLocaleDateString('es-ES')}</div>
                              <div className="text-xs text-gray-400">
                                ({persona.intentosContacto} contactos)
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              {persona.estado === 'pendiente_entrega' && (
                                <button
                                  onClick={() => alert(`Enviando recordatorio a ${persona.nombre}...\n\n✅ Email enviado con instrucciones para obtener el certificado\n✅ Plazo: 30 días\n✅ Se enviará recordatorio automático en 20 días`)}
                                  className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700"
                                >
                                  Enviar Recordatorio
                                </button>
                              )}
                              {persona.estado === 'bloqueado' && (
                                <button
                                  onClick={() => alert(`Desbloqueando a ${persona.nombre}...\n\nSe enviará nuevo email con:\n✅ Instrucciones detalladas\n✅ Enlaces directos\n✅ Plazo final de 15 días`)}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                                >
                                  Último Aviso
                                </button>
                              )}
                              <button
                                onClick={() => alert(`Historial de ${persona.nombre}:\n\n📧 Emails enviados: ${persona.intentosContacto}\n📅 Último contacto: ${new Date(persona.ultimoContacto).toLocaleDateString('es-ES')}\n📋 Estado desde: ${new Date(Date.now() - persona.diasTranscurridos*24*60*60*1000).toLocaleDateString('es-ES')}\n⚠️ Incumple normativa LOPIVI`)}
                                className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
                              >
                                Ver Historial
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Configuración de notificaciones */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Configuración de Notificaciones</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">Recordatorios Automáticos</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Aviso 30 días antes del vencimiento</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Recordatorio 15 días antes</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Aviso urgente 5 días antes</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Bloqueo automático tras vencimiento</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">Canal de Comunicación</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="radio" name="canal" defaultChecked className="mr-2" />
                        <span className="text-sm">Email corporativo</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="canal" className="mr-2" />
                        <span className="text-sm">WhatsApp Business</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="canal" className="mr-2" />
                        <span className="text-sm">SMS</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="canal" className="mr-2" />
                        <span className="text-sm">Notificación interna</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => alert('✅ Configuración guardada\n✅ Notificaciones activadas\n✅ Se aplicarán a partir de mañana')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Guardar Configuración
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modales del Centro de Ayuda LOPIVI */}
      {modalAyudaActivo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalAyudaActivo === 'fundamentos' && 'Fundamentos LOPIVI'}
                  {modalAyudaActivo === 'dashboard' && 'Uso del Dashboard'}
                  {modalAyudaActivo === 'casos' && 'Gestión de Casos e Incidencias'}
                  {modalAyudaActivo === 'tareas' && 'Tareas del Delegado Suplente'}
                  {modalAyudaActivo === 'faqs' && 'Preguntas Frecuentes'}
                  {modalAyudaActivo === 'contactos' && 'Contactos de Emergencia'}
                </h2>
                <button
                  onClick={() => setModalAyudaActivo(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div className="p-6">
              {modalAyudaActivo === 'fundamentos' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">¿Qué es la LOPIVI y por qué existe?</h3>
                    <div className="text-blue-800 space-y-2">
                      <p><strong>La Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia (LOPIVI)</strong> es una normativa española en vigor desde junio de 2021.</p>
                      <p><strong>Objetivo principal:</strong> Garantizar los derechos fundamentales de niños, niñas y adolescentes frente a cualquier forma de violencia.</p>
                      <p><strong>Ámbito de aplicación:</strong> Todas las entidades que trabajen con menores: clubs deportivos, escuelas, campamentos, academias, guarderías, parroquias...</p>
                      <p><strong>Sanciones por incumplimiento:</strong> Multas desde 10.000€ hasta 1.000.000€, cierre temporal o definitivo de la entidad.</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-green-900 mb-3">¿Qué es un Plan de Protección Infantil?</h3>
                    <div className="text-green-800 space-y-2">
                      <p><strong>Definición:</strong> Documento obligatorio que establece las medidas específicas que implementa su entidad para proteger a los menores.</p>
                      <p><strong>Componentes obligatorios:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Designación de Delegado/a de Protección (principal y suplente)</li>
                        <li>Protocolos de actuación ante situaciones de riesgo</li>
                        <li>Código de conducta para todo el personal</li>
                        <li>Formación específica del personal</li>
                        <li>Canal de comunicación para denuncias</li>
                      </ul>
                      <p><strong>Diferencia clave:</strong> Sin Plan de Protección vigente, su entidad NO cumple la LOPIVI y está expuesta a sanciones graves.</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-orange-900 mb-3">Mi rol como Delegado/a Suplente de Protección</h3>
                    <div className="text-orange-800 space-y-2">
                      <p><strong>Responsabilidades específicas como suplente:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Apoyar al delegado principal en la implementación del Plan</li>
                        <li>Estar preparado/a para asumir las funciones del delegado principal</li>
                        <li>Recibir y gestionar casos asignados específicamente</li>
                        <li>Mantener formación actualizada en protección infantil</li>
                        <li>Coordinar con el delegado principal en revisiones y seguimientos</li>
                        <li>Actuar como segundo contacto para reportes urgentes</li>
                      </ul>
                      <p><strong>Cuándo actuar como principal:</strong> Ausencia, enfermedad o impedimento del delegado principal.</p>
                      <p><strong>Coordinación clave:</strong> Mantener comunicación regular con el delegado principal sobre casos y protocolos.</p>
                    </div>
                  </div>
                </div>
              )}

              {modalAyudaActivo === 'dashboard' && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-purple-900 mb-3">Visión general del dashboard suplente</h3>
                    <div className="text-purple-800 space-y-2">
                      <p><strong>Su dashboard de suplente</strong> le permite gestionar casos asignados y coordinar con el delegado principal.</p>
                      <p><strong>Diferencias con el dashboard principal:</strong> Enfoque en casos asignados específicamente y tareas de apoyo.</p>
                      <p><strong>Acceso coordinado:</strong> Sus acciones se sincronizan con el sistema del delegado principal.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Casos Asignados</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Qué significa:</strong> Casos específicamente delegados a usted para gestión y seguimiento.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Su responsabilidad:</strong> Gestionar completamente estos casos bajo supervisión del delegado principal.</p>
                      <p className="text-gray-700 text-sm"><strong>Escalado:</strong> Casos críticos deben comunicarse inmediatamente al delegado principal.</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Estado de Coordinación (75%)</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Qué significa:</strong> Nivel de sincronización con el delegado principal.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Objetivo:</strong> Mantener siempre por encima del 80% para garantizar coordinación efectiva.</p>
                      <p className="text-gray-700 text-sm"><strong>Cómo mejorarlo:</strong> Participar en reuniones de coordinación y actualizar casos asignados.</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Documentación Asignada</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Qué son:</strong> Documentos específicos que debe revisar, actualizar o gestionar.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Importancia:</strong> Su completud afecta el cumplimiento general de la entidad.</p>
                      <p className="text-gray-700 text-sm"><strong>Acción requerida:</strong> Revisar y completar según indicaciones del delegado principal.</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Alertas de Coordinación</h4>
                      <p className="text-gray-700 text-sm mb-2"><strong>Qué son:</strong> Notificaciones sobre tareas, reuniones o casos que requieren su atención.</p>
                      <p className="text-gray-700 text-sm mb-2"><strong>Priorización:</strong> Urgente (roja), Importante (naranja), Informativa (azul).</p>
                      <p className="text-gray-700 text-sm"><strong>Gestión:</strong> Revisar diariamente y coordinar respuesta con delegado principal.</p>
                    </div>
                  </div>
                </div>
              )}

              {modalAyudaActivo === 'casos' && (
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-red-900 mb-3">Casos asignados al delegado suplente</h3>
                    <div className="text-red-800 space-y-2">
                      <p><strong>Tipos de casos que puede gestionar como suplente:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Seguimientos de casos menores asignados específicamente</li>
                        <li>Incidencias de nivel medio que no requieren intervención urgente</li>
                        <li>Coordinación con familias en casos en proceso</li>
                        <li>Documentación y registro de casos bajo supervisión</li>
                        <li>Apoyo en casos complejos liderados por el delegado principal</li>
                      </ul>
                      <p><strong>Límites de actuación:</strong> Casos críticos o urgentes deben escalarse inmediatamente al delegado principal.</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-yellow-900 mb-3">Protocolo de coordinación con delegado principal</h3>
                    <div className="text-yellow-800 space-y-2">
                      <p><strong>COMUNICACIÓN INMEDIATA (casos críticos):</strong></p>
                      <ol className="list-decimal list-inside ml-4 space-y-1">
                        <li>Contactar al delegado principal por teléfono</li>
                        <li>Enviar resumen por WhatsApp o email</li>
                        <li>Documentar inmediatamente en el sistema</li>
                        <li>Esperar instrucciones antes de proceder</li>
                        <li>Si no está disponible, seguir protocolo de escalado</li>
                      </ol>
                      <p><strong>REUNIONES DE COORDINACIÓN SEMANALES:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Revisión de casos asignados y su evolución</li>
                        <li>Planificación de tareas para la próxima semana</li>
                        <li>Actualización sobre cambios normativos o protocolos</li>
                        <li>Feedback sobre gestión de casos</li>
                        <li>Identificación de necesidades de formación</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-green-900 mb-3">Escalado de casos urgentes</h3>
                    <div className="text-green-800 space-y-2">
                      <p><strong>DELEGAR PRINCIPAL NO DISPONIBLE:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Tomar el rol temporalmente</li>
                        <li>Seguir todos los protocolos establecidos</li>
                        <li>Contactar autoridades si es necesario</li>
                        <li>Documentar todas las acciones tomadas</li>
                        <li>Informar al delegado principal en cuanto esté disponible</li>
                      </ul>
                      <p><strong>CADENA DE ESCALADO:</strong> Delegado Principal → Delegado Suplente → Dirección Entidad → Autoridades Competentes</p>
                    </div>
                  </div>
                </div>
              )}

              {modalAyudaActivo === 'tareas' && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-purple-900 mb-3">Responsabilidades semanales del suplente</h3>
                    <div className="text-purple-800 space-y-2">
                      <p><strong>Checklist semanal de coordinación:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Reunión de coordinación con delegado principal (1 hora)</li>
                        <li>Revisión de casos asignados y su progreso</li>
                        <li>Actualización de documentación específica asignada</li>
                        <li>Verificación de alertas y notificaciones pendientes</li>
                        <li>Preparación para posible asunción de funciones principales</li>
                        <li>Formación continuada (30 minutos semanales mínimo)</li>
                      </ul>
                      <p><strong>Tiempo estimado:</strong> 3-5 horas semanales en coordinación y gestión de casos asignados.</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">Formación y actualización continua</h3>
                    <div className="text-blue-800 space-y-2">
                      <p><strong>Requisitos de formación para suplentes:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Mismo nivel de formación que el delegado principal</li>
                        <li>Actualización trimestral sobre cambios normativos</li>
                        <li>Participación en simulacros de emergencia</li>
                        <li>Formación específica en coordinación y comunicación</li>
                        <li>Conocimiento actualizado de los protocolos de la entidad</li>
                      </ul>
                      <p><strong>Recursos disponibles:</strong> Plataforma de formación Custodia360, webinars especializados, documentación técnica.</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Preparación para asumir funciones principales</h3>
                    <div className="text-gray-800 space-y-2">
                      <p><strong>Situaciones en las que debe actuar como principal:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Ausencia planificada del delegado principal (vacaciones, formación)</li>
                        <li>Enfermedad o impedimento temporal</li>
                        <li>Situaciones urgentes cuando no está disponible</li>
                        <li>Sobrecarga de casos que requiere distribución</li>
                      </ul>
                      <p><strong>Preparación necesaria:</strong> Conocimiento completo de todos los protocolos, acceso a todos los sistemas, contactos actualizados de autoridades.</p>
                    </div>
                  </div>
                </div>
              )}

              {modalAyudaActivo === 'faqs' && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-yellow-900 mb-3">Situaciones comunes del suplente</h3>
                    <div className="space-y-4">
                      <div className="bg-white border border-yellow-300 rounded p-3">
                        <p className="font-bold text-yellow-800">El delegado principal no está disponible y hay una emergencia</p>
                        <p className="text-yellow-700 text-sm mt-1">Asumir inmediatamente las funciones, seguir protocolos de emergencia, documentar todas las acciones y contactar al delegado principal en cuanto sea posible.</p>
                      </div>
                      <div className="bg-white border border-yellow-300 rounded p-3">
                        <p className="font-bold text-yellow-800">No estoy seguro/a si un caso es de mi responsabilidad</p>
                        <p className="text-yellow-700 text-sm mt-1">Consultar inmediatamente con el delegado principal. En caso de urgencia, mejor actuar y coordinar después que no actuar.</p>
                      </div>
                      <div className="bg-white border border-yellow-300 rounded p-3">
                        <p className="font-bold text-yellow-800">Un padre quiere hablar solo conmigo sobre un caso</p>
                        <p className="text-yellow-700 text-sm mt-1">Informar que trabajamos en coordinación, tomar nota de la consulta y coordinar respuesta con el delegado principal antes de dar información definitiva.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">Dudas técnicas del dashboard</h3>
                    <div className="space-y-4">
                      <div className="bg-white border border-blue-300 rounded p-3">
                        <p className="font-bold text-blue-800">¿Por qué mi coordinación bajó a 70%?</p>
                        <p className="text-blue-700 text-sm mt-1">Puede ser por casos sin actualizar, reuniones de coordinación perdidas o documentación pendiente. Revisar alertas y coordinar con el delegado principal.</p>
                      </div>
                      <div className="bg-white border border-blue-300 rounded p-3">
                        <p className="font-bold text-blue-800">¿Puedo cerrar un caso sin consultar?</p>
                        <p className="text-blue-700 text-sm mt-1">Solo casos menores asignados específicamente. Casos importantes o complejos requieren coordinación con el delegado principal antes del cierre.</p>
                      </div>
                      <div className="bg-white border border-blue-300 rounded p-3">
                        <p className="font-bold text-blue-800">¿Cómo actualizo mi estado de coordinación?</p>
                        <p className="text-blue-700 text-sm mt-1">Completar tareas asignadas, participar en reuniones programadas y mantener casos actualizados en el sistema.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {modalAyudaActivo === 'contactos' && (
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-red-900 mb-3">Contactos de emergencia</h3>
                    <div className="text-red-800 space-y-2">
                      <p><strong>112 - Emergencias</strong></p>
                      <p className="text-sm">Situaciones que requieren intervención urgente inmediata</p>
                      <p><strong>091 - Policía Nacional</strong></p>
                      <p className="text-sm">Delitos, maltrato evidente, necesidad de protección inmediata</p>
                      <p><strong>062 - Guardia Civil</strong></p>
                      <p className="text-sm">En zonas rurales o cuando Policía Nacional no esté disponible</p>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-purple-900 mb-3">Coordinación interna</h3>
                    <div className="text-purple-800 space-y-2">
                      <p><strong>Delegado Principal</strong></p>
                      <p className="text-sm">Primer contacto para consultas, coordinación y escalado de casos</p>
                      <p><strong>Dirección de la Entidad</strong></p>
                      <p className="text-sm">Para decisiones administrativas y comunicaciones oficiales</p>
                      <p><strong>Otros Suplentes (si los hay)</strong></p>
                      <p className="text-sm">Coordinación horizontal para casos que requieren múltiple apoyo</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">Autoridades especializadas</h3>
                    <div className="text-blue-800 space-y-2">
                      <p><strong>116 111 - Teléfono del Menor</strong></p>
                      <p className="text-sm">Asesoramiento especializado 24/7 para delegados</p>
                      <p><strong>Servicios Sociales municipales</strong></p>
                      <p className="text-sm">Consulte el directorio local para reportes y seguimientos</p>
                      <p><strong>Fiscalía de Menores</strong></p>
                      <p className="text-sm">Casos graves que requieren intervención judicial</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-green-900 mb-3">Soporte técnico Custodia360</h3>
                    <div className="text-green-800 space-y-2">
                      <p><strong>Email: soporte@custodia360.es</strong></p>
                      <p className="text-sm">Dudas técnicas, problemas de acceso, coordinación entre delegados</p>
                      <p><strong>WhatsApp: +34 600 000 000</strong></p>
                      <p className="text-sm">Consultas urgentes sobre protocolos y coordinación</p>
                      <p><strong>Horario:</strong> Lunes a Viernes 9:00-18:00</p>
                      <p className="text-sm">Respuesta garantizada en 2 horas para suplentes</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
