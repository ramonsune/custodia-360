'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
  estado: 'activo' | 'pendiente' | 'resuelto'
  prioridad: 'alta' | 'media' | 'baja'
  fechaCreacion: string
  descripcion: string
}

interface PersonalItem {
  id: string
  nombre: string
  cargo: string
  formado: boolean
  fechaFormacion?: string
  certificado?: boolean
}

export default function DashboardDelegadoPrincipal() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

  // Modal states
  const [modalCasosActivos, setModalCasosActivos] = useState(false)
  const [modalGestionarCaso, setModalGestionarCaso] = useState(false)
  const [modalPersonalFormado, setModalPersonalFormado] = useState(false)
  const [modalCasoUrgente, setModalCasoUrgente] = useState(false)
  const [modalInstruccionesCaso, setModalInstruccionesCaso] = useState(false)
  const [modalCumplimiento, setModalCumplimiento] = useState(false)
  const [modalRenovacion, setModalRenovacion] = useState(false)
  const [modalCertificadosPenales, setModalCertificadosPenales] = useState(false)
  const [modalGuiaDetalle, setModalGuiaDetalle] = useState(false)
  const [modalBiblioteca, setModalBiblioteca] = useState(false)
  const [modalDocumentosEntidad, setModalDocumentosEntidad] = useState(false)
  const [modalInspeccion, setModalInspeccion] = useState(false)
  const [guiaSeleccionada, setGuiaSeleccionada] = useState('')
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState('')

  // State management
  const [casoSeleccionado, setCasoSeleccionado] = useState<Caso | null>(null)
  const [tipoInstruccion, setTipoInstruccion] = useState<string>('')
  const [guiaExpanded, setGuiaExpanded] = useState(false)
  const [metodoPago, setMetodoPago] = useState('existente')

  // Sample data
  const casosActivos: Caso[] = [
    {
      id: '1',
      titulo: 'Incidencia en área de recreo',
      estado: 'activo',
      prioridad: 'alta',
      fechaCreacion: '2024-01-15',
      descripcion: 'Situación reportada en el área de recreo que requiere seguimiento.'
    },
    {
      id: '2',
      titulo: 'Seguimiento familiar',
      estado: 'pendiente',
      prioridad: 'media',
      fechaCreacion: '2024-01-10',
      descripcion: 'Seguimiento necesario con familia de menor.'
    },
    {
      id: '3',
      titulo: 'Protocolo activado',
      estado: 'activo',
      prioridad: 'alta',
      fechaCreacion: '2024-01-08',
      descripcion: 'Protocolo de protección activado, requiere documentación.'
    }
  ]

  const personalData: PersonalItem[] = [
    { id: '1', nombre: 'María García', cargo: 'Educadora', formado: true, fechaFormacion: '2024-01-15', certificado: true },
    { id: '2', nombre: 'Carlos López', cargo: 'Monitor', formado: true, fechaFormacion: '2024-01-10', certificado: true },
    { id: '3', nombre: 'Ana Martínez', cargo: 'Coordinadora', formado: false },
    { id: '4', nombre: 'Jorge Ruiz', cargo: 'Auxiliar', formado: false },
    { id: '5', nombre: 'Laura Sánchez', cargo: 'Psicóloga', formado: true, fechaFormacion: '2024-01-05', certificado: true },
  ]

  // Datos de certificados de antecedentes penales
  const certificadosPenales = [
    { id: '1', nombre: 'María García', cargo: 'Educadora', fechaEmision: '2023-12-15', estado: 'vigente', diasRestantes: 45 },
    { id: '2', nombre: 'Carlos López', cargo: 'Monitor', fechaEmision: '2023-11-20', estado: 'vigente', diasRestantes: 20 },
    { id: '3', nombre: 'Ana Martínez', cargo: 'Coordinadora', fechaEmision: '2023-06-10', estado: 'caducado', diasRestantes: -15 },
    { id: '4', nombre: 'Jorge Ruiz', cargo: 'Auxiliar', fechaEmision: '', estado: 'pendiente', diasRestantes: 0 },
    { id: '5', nombre: 'Laura Sánchez', cargo: 'Psicóloga', fechaEmision: '2024-01-05', estado: 'vigente', diasRestantes: 180 },
    { id: '6', nombre: sessionData?.nombre || 'Delegado Principal', cargo: 'Delegado Principal', fechaEmision: '2023-10-15', estado: 'vigente', diasRestantes: 95 }
  ]

  const certificadosVigentes = certificadosPenales.filter(c => c.estado === 'vigente').length
  const certificadosPendientes = certificadosPenales.filter(c => c.estado === 'pendiente' || c.estado === 'caducado').length

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (session) {
      try {
        const data = JSON.parse(session)

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
      } catch (error) {
        console.error('Error loading session:', error)
        router.push('/login-delegados')
      }
    } else {
      router.push('/login-delegados')
    }
    setLoading(false)
  }, [router])

  const calcularCumplimiento = () => {
    const elementos = [
      { nombre: 'Plan de Protección Vigente', completado: true },
      { nombre: 'Delegado Principal Certificado', completado: true },
      { nombre: 'Delegado Suplente Certificado', completado: true },
      { nombre: 'Personal Formado en LOPIVI', completado: true },
      { nombre: 'Protocolos Actualizados', completado: true },
      { nombre: 'Canal de Comunicación Activo', completado: true },
      { nombre: 'Registro de Casos Actualizado', completado: true },
      { nombre: 'Auditoría Anual Realizada', completado: false }
    ]

    const completados = elementos.filter(e => e.completado).length
    const porcentaje = Math.round((completados / elementos.length) * 100)

    return { porcentaje, completados, total: elementos.length, elementos }
  }

  const abrirGestionCaso = (caso: Caso) => {
    setCasoSeleccionado(caso)
    setModalGestionarCaso(true)
  }

  const abrirInstrucciones = (tipo: string) => {
    setTipoInstruccion(tipo)
    setModalInstruccionesCaso(true)
  }

  const enviarRecordatorio = (personalId: string, tipo: 'recordatorio' | 'inscripcion') => {
    alert(`${tipo === 'recordatorio' ? 'Recordatorio enviado' : 'Inscripción en formación enviada'} al personal seleccionado.`)
  }

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

  const cumplimiento = calcularCumplimiento()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Custodia360</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {sessionData?.nombre} - Delegado Principal
              </span>
              <button
                onClick={() => setModalCasoUrgente(true)}
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
          <h2 className="text-xl font-semibold text-blue-600 mb-2">{sessionData?.entidad || 'Mi Entidad'}</h2>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Delegado Principal</h1>
          <p className="text-gray-600 mt-2">Panel principal de gestión LOPIVI</p>
        </div>

        {/* Título Estado de la entidad */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Estado de la entidad</h2>
        </div>

        {/* Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Casos Activos */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Casos Activos</div>
                <div className="text-2xl font-bold text-red-600">{casosActivos.length}</div>
              </div>
            </div>
            <div className="text-xs text-red-600 mt-1">Requieren atención</div>
            <button
              onClick={() => setModalCasosActivos(true)}
              className="mt-3 w-full text-red-600 px-4 py-3 rounded-lg hover:bg-red-50 text-base font-medium"
            >
              Ver casos
            </button>
          </div>



          {/* Personal Formado */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Personal Formado</div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((personalData.filter(p => p.formado).length / personalData.length) * 100)}%
                </div>
              </div>
            </div>
            <div className="text-xs text-blue-600 mt-1">Formación LOPIVI</div>
            <button
              onClick={() => setModalPersonalFormado(true)}
              className="mt-3 w-full text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 text-base font-medium"
            >
              Ver
            </button>
          </div>

          {/* Alertas */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Alertas</div>
                <div className="text-2xl font-bold text-orange-600">2</div>
              </div>
            </div>
            <div className="text-xs text-orange-600 mt-1">Pendientes</div>
            <button
              onClick={() => router.push('/dashboard-delegado/alertas')}
              className="mt-3 w-full text-orange-600 px-4 py-3 rounded-lg hover:bg-orange-50 text-base font-medium"
            >
              Revisar
            </button>
          </div>

          {/* Certificados Antecedentes Penales */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Certificados Penales</div>
                <div className="text-2xl font-bold text-purple-600">{certificadosVigentes}/{certificadosPenales.length}</div>
              </div>
            </div>
            <div className="text-xs text-purple-600 mt-1">
              {certificadosPendientes > 0 ? `${certificadosPendientes} pendientes` : 'Todos vigentes'}
            </div>
            <button
              onClick={() => setModalCertificadosPenales(true)}
              className="mt-3 w-full text-purple-600 px-4 py-3 rounded-lg hover:bg-purple-50 text-base font-medium"
            >
              Gestionar
            </button>
          </div>

          {/* Certificación */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Certificación</div>
                <div className="text-2xl font-bold text-teal-600">Vigente</div>
              </div>
            </div>
            <div className="text-xs text-teal-600 mt-1">Renovación en 3 meses</div>
            <button
              onClick={() => setModalRenovacion(true)}
              className="mt-3 w-full text-teal-600 px-4 py-3 rounded-lg hover:bg-teal-50 text-base font-medium"
            >
              Renovar
            </button>
          </div>
        </div>

        {/* Cumplimiento LOPIVI */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Cumplimiento LOPIVI</h3>
              <p className="text-gray-600">Estado actual de cumplimiento normativo</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{cumplimiento.porcentaje}%</div>
              <div className="text-xs text-green-600">Completado</div>
            </div>
          </div>
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${cumplimiento.porcentaje}%` }}
              ></div>
            </div>
          </div>
          <button
            onClick={() => setModalCumplimiento(true)}
            className="w-full text-green-600 px-6 py-4 rounded-lg hover:bg-green-50 text-lg font-medium"
          >
            Ver
          </button>
        </div>

        {/* Guía de Uso del Panel - Collapsible */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Guía de Uso del Panel Delegado Principal</h3>
              <p className="text-gray-600">Recursos y ayuda para gestionar el panel</p>
            </div>
            <button
              onClick={() => setGuiaExpanded(!guiaExpanded)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {guiaExpanded ? 'Ocultar Guía' : 'Mostrar Guía'}
            </button>
          </div>

          {guiaExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <button
                onClick={() => {
                  setGuiaSeleccionada('gestion-casos')
                  setModalGuiaDetalle(true)
                }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left hover:bg-blue-100 transition-colors"
              >
                <h4 className="font-bold text-blue-900 mb-2">Gestión de Casos</h4>
                <p className="text-blue-700 text-sm">Aprende a gestionar casos urgentes, crear nuevos casos y hacer seguimiento.</p>
              </button>
              <button
                onClick={() => {
                  setGuiaSeleccionada('cumplimiento-lopivi')
                  setModalGuiaDetalle(true)
                }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 text-left hover:bg-green-100 transition-colors"
              >
                <h4 className="font-bold text-green-900 mb-2">Cumplimiento LOPIVI</h4>
                <p className="text-green-700 text-sm">Monitorea el estado de cumplimiento y gestiona la documentación necesaria.</p>
              </button>
              <button
                onClick={() => {
                  setGuiaSeleccionada('formacion-personal')
                  setModalGuiaDetalle(true)
                }}
                className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left hover:bg-orange-100 transition-colors"
              >
                <h4 className="font-bold text-orange-900 mb-2">Formación del Personal</h4>
                <p className="text-orange-700 text-sm">Supervisa la formación LOPIVI del personal y envía recordatorios.</p>
              </button>
              <button
                onClick={() => {
                  setGuiaSeleccionada('alertas-notificaciones')
                  setModalGuiaDetalle(true)
                }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 text-left hover:bg-red-100 transition-colors"
              >
                <h4 className="font-bold text-red-900 mb-2">Alertas y Notificaciones</h4>
                <p className="text-red-700 text-sm">Gestiona alertas del sistema y mantente al día con las notificaciones.</p>
              </button>
              <button
                onClick={() => {
                  setGuiaSeleccionada('comunicacion')
                  setModalGuiaDetalle(true)
                }}
                className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left hover:bg-purple-100 transition-colors"
              >
                <h4 className="font-bold text-purple-900 mb-2">Comunicación</h4>
                <p className="text-purple-700 text-sm">Comunícate con personal, familias y gestiona la documentación.</p>
              </button>
              <button
                onClick={() => {
                  setGuiaSeleccionada('renovacion')
                  setModalGuiaDetalle(true)
                }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-bold text-gray-900 mb-2">Renovación</h4>
                <p className="text-gray-700 text-sm">Gestiona la renovación de certificaciones y mantén al día tu acreditación.</p>
              </button>
            </div>
          )}
        </div>

        {/* Biblioteca LOPIVI */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Biblioteca LOPIVI</h3>
              <p className="text-gray-600">Documentos y protocolos esenciales para tu entidad</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-xs text-blue-600">Documentos disponibles</div>
            </div>
          </div>
          <div className="mb-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                Accede a todos los protocolos y documentos genéricos necesarios para el cumplimiento LOPIVI.
                Todos los documentos están adaptados a la normativa vigente.
              </p>
            </div>
          </div>
          <button
            onClick={() => setModalBiblioteca(true)}
            className="w-full text-blue-600 px-6 py-4 rounded-lg hover:bg-blue-50 text-lg font-medium"
          >
            Ver
          </button>
        </div>

        {/* Acciones Rápidas */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Acciones Rápidas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Gestión de Casos</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard-delegado/nuevo-caso')}
                className="w-full text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 text-center"
              >
                Nuevo Caso
              </button>
              <button
                onClick={() => setModalCasosActivos(true)}
                className="w-full text-gray-600 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 text-center"
              >
                Ver Casos Activos
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Comunicación</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard-delegado/comunicacion-personal')}
                className="w-full text-teal-600 border border-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 text-center"
              >
                Personal
              </button>
              <button
                onClick={() => router.push('/dashboard-delegado/comunicacion-familias')}
                className="w-full text-teal-600 border border-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 text-center"
              >
                Familias
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Documentación</h3>
            <div className="space-y-3">
              <button
                onClick={() => setModalDocumentosEntidad(true)}
                className="w-full text-gray-600 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 text-center"
              >
                Documentos
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Inspección</h3>
            <div className="space-y-3">
              <button
                onClick={() => setModalInspeccion(true)}
                className="w-full text-purple-600 border border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 text-center"
              >
                Generar Informe
              </button>
            </div>
          </div>
        </div>

        {/* Sección de Alertas */}
        <div className="mb-4 mt-8">
          <h2 className="text-2xl font-bold text-gray-800">Alertas Pendientes</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="space-y-4">
            {/* Alerta Vencimiento de Formaciones */}
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-red-900">Vencimiento de Formaciones</h4>
                  <p className="text-red-700 text-sm">2 miembros del personal tienen formaciones que vencen en 30 días</p>
                  <p className="text-red-600 text-xs">Ana Martínez, Jorge Ruiz</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                  Gestionar
                </button>
                <button className="border border-red-600 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-50">
                  Posponer
                </button>
              </div>
            </div>

            {/* Alerta No Contestación */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-yellow-900">No Contestación de Miembros</h4>
                  <p className="text-yellow-700 text-sm">1 miembro no ha respondido a comunicaciones importantes</p>
                  <p className="text-yellow-600 text-xs">Carlos López - Sin respuesta desde hace 7 días</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">
                  Contactar
                </button>
                <button className="border border-yellow-600 text-yellow-600 px-3 py-1 rounded text-sm hover:bg-yellow-50">
                  Marcar
                </button>
              </div>
            </div>

            {/* Alerta Antecedentes Penales */}
            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-orange-900">Antecedentes Penales Pendientes</h4>
                  <p className="text-orange-700 text-sm">Plazo de presentación de certificados vence en 15 días</p>
                  <p className="text-orange-600 text-xs">Jorge Ruiz - Pendiente de entrega</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700">
                  Recordar
                </button>
                <button className="border border-orange-600 text-orange-600 px-3 py-1 rounded text-sm hover:bg-orange-50">
                  Extender
                </button>
              </div>
            </div>

            {/* Alerta Mapa de Riesgos */}
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-blue-900">Evaluación de Mapa de Riesgos</h4>
                  <p className="text-blue-700 text-sm">Evaluación anual del mapa de riesgos pendiente</p>
                  <p className="text-blue-600 text-xs">Última evaluación: Marzo 2023</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Evaluar
                </button>
                <button className="border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50">
                  Programar
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">Total de alertas pendientes: 4</p>
            <button className="mt-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              Ver Todas las Alertas
            </button>
          </div>
        </div>
      </main>

      {/* Modal Casos Activos */}
      {modalCasosActivos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Casos Activos</h3>
              <button
                onClick={() => setModalCasosActivos(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {casosActivos.map((caso) => (
                <div key={caso.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900">{caso.titulo}</h4>
                      <p className="text-gray-600 text-sm">{caso.descripcion}</p>
                      <div className="flex space-x-4 mt-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          caso.estado === 'activo' ? 'bg-red-100 text-red-800' :
                          caso.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {caso.estado}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          caso.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                          caso.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {caso.prioridad}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => abrirGestionCaso(caso)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Gestionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestionar Caso Individual - z-index superior */}
      {modalGestionarCaso && casoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Gestionar Caso: {casoSeleccionado.titulo}</h3>
              <button
                onClick={() => setModalGestionarCaso(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado del Caso</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="resuelto">Resuelto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas de Seguimiento</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                  placeholder="Añadir notas sobre el seguimiento del caso..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Acciones Realizadas</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Documentación revisada
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Familia contactada
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Protocolo activado
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Seguimiento programado
                  </label>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    alert('Caso actualizado correctamente')
                    setModalGestionarCaso(false)
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => {
                    alert('Generando informe del caso...')
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Generar Informe
                </button>
                <button
                  onClick={() => setModalGestionarCaso(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Personal Formado */}
      {modalPersonalFormado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Estado de Formación del Personal</h3>
              <button
                onClick={() => setModalPersonalFormado(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Personal Formado */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-green-600 mb-3">Personal Formado ({personalData.filter(p => p.formado).length})</h4>
              <div className="space-y-2">
                {personalData.filter(p => p.formado).map((persona) => (
                  <div key={persona.id} className="flex justify-between items-center bg-green-50 border border-green-200 rounded-lg p-3">
                    <div>
                      <span className="font-medium">{persona.nombre}</span>
                      <span className="text-gray-600 ml-2">- {persona.cargo}</span>
                      {persona.fechaFormacion && (
                        <span className="text-green-600 ml-2 text-sm">(Formado: {persona.fechaFormacion})</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {persona.certificado && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Certificado</span>
                      )}
                      <button
                        onClick={() => enviarRecordatorio(persona.id, 'recordatorio')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Recordatorio Renovación
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Sin Formar */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-red-600 mb-3">Personal Sin Formar ({personalData.filter(p => !p.formado).length})</h4>
              <div className="space-y-2">
                {personalData.filter(p => !p.formado).map((persona) => (
                  <div key={persona.id} className="flex justify-between items-center bg-red-50 border border-red-200 rounded-lg p-3">
                    <div>
                      <span className="font-medium">{persona.nombre}</span>
                      <span className="text-gray-600 ml-2">- {persona.cargo}</span>
                      <span className="text-red-600 ml-2 text-sm">(Pendiente de formación)</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => enviarRecordatorio(persona.id, 'recordatorio')}
                        className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                      >
                        Enviar Recordatorio
                      </button>
                      <button
                        onClick={() => enviarRecordatorio(persona.id, 'inscripcion')}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Inscribir en Formación
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-600">
                Total: {personalData.length} | Formados: {personalData.filter(p => p.formado).length} |
                Pendientes: {personalData.filter(p => !p.formado).length}
              </div>
              <button
                onClick={() => {
                  alert('Enviando recordatorio masivo a todo el personal pendiente de formación...')
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                Recordatorio Masivo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Caso Urgente */}
      {modalCasoUrgente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-600">Activar Protocolo de Caso Urgente</h3>
              <button
                onClick={() => setModalCasoUrgente(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Selecciona el tipo de protocolo a activar:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => abrirInstrucciones('maltrato')}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 text-left hover:bg-red-100 transition-colors"
                >
                  <h4 className="font-bold text-red-900 mb-2">Sospecha de Maltrato</h4>
                  <p className="text-red-700 text-sm">Protocolo para casos de sospecha de maltrato físico o psicológico</p>
                </button>
                <button
                  onClick={() => abrirInstrucciones('abandono')}
                  className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left hover:bg-orange-100 transition-colors"
                >
                  <h4 className="font-bold text-orange-900 mb-2">Abandono</h4>
                  <p className="text-orange-700 text-sm">Protocolo para casos de abandono o negligencia</p>
                </button>
                <button
                  onClick={() => abrirInstrucciones('abuso')}
                  className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left hover:bg-purple-100 transition-colors"
                >
                  <h4 className="font-bold text-purple-900 mb-2">Abuso Sexual</h4>
                  <p className="text-purple-700 text-sm">Protocolo específico para casos de abuso sexual</p>
                </button>
                <button
                  onClick={() => abrirInstrucciones('emergencia')}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left hover:bg-yellow-100 transition-colors"
                >
                  <h4 className="font-bold text-yellow-900 mb-2">Emergencia General</h4>
                  <p className="text-yellow-700 text-sm">Protocolo para situaciones de emergencia no especificadas</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Instrucciones Caso - z-index superior */}
      {modalInstruccionesCaso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-600">Protocolo: {tipoInstruccion.charAt(0).toUpperCase() + tipoInstruccion.slice(1)}</h3>
              <button
                onClick={() => setModalInstruccionesCaso(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-900 mb-2">Pasos Inmediatos:</h4>
                <ol className="list-decimal list-inside space-y-2 text-red-800">
                  <li>Garantizar la seguridad inmediata del menor</li>
                  <li>Documentar la situación detalladamente</li>
                  <li>Notificar a las autoridades competentes</li>
                  <li>Contactar con los servicios sociales</li>
                  <li>Informar a la familia (si procede)</li>
                </ol>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-bold text-yellow-900 mb-2">Documentación Requerida:</h4>
                <ul className="list-disc list-inside space-y-1 text-yellow-800">
                  <li>Registro detallado del incidente</li>
                  <li>Testimonios de testigos</li>
                  <li>Evidencias físicas si las hay</li>
                  <li>Comunicaciones oficiales</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-2">Contactos de Emergencia:</h4>
                <ul className="list-none space-y-1 text-blue-800">
                  <li><strong>Servicios Sociales:</strong> 900 123 456</li>
                  <li><strong>Guardia Civil:</strong> 062</li>
                  <li><strong>Policía:</strong> 091</li>
                  <li><strong>Emergencias:</strong> 112</li>
                </ul>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    alert('Creando caso urgente en el sistema...')
                    setModalInstruccionesCaso(false)
                    setModalCasoUrgente(false)
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Crear Caso Urgente
                </button>
                <button
                  onClick={() => {
                    alert('Descargando protocolo completo...')
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Descargar Protocolo
                </button>
                <button
                  onClick={() => setModalInstruccionesCaso(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cumplimiento Detallado */}
      {modalCumplimiento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Detalle de Cumplimiento LOPIVI</h3>
              <button
                onClick={() => setModalCumplimiento(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Estado General: {cumplimiento.porcentaje}%</h4>
                <div className="text-sm text-gray-600">
                  {cumplimiento.completados} de {cumplimiento.total} elementos completados
                </div>
              </div>
              <div className="bg-gray-200 rounded-full h-4 mb-6">
                <div
                  className="bg-green-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${cumplimiento.porcentaje}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Elementos Completados */}
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-3">Elementos Completados</h4>
                <div className="space-y-2">
                  {cumplimiento.elementos.filter(e => e.completado).map((elemento, index) => (
                    <div key={index} className="flex items-center bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="w-4 h-4 bg-green-600 rounded-full mr-3"></div>
                      <span className="text-green-800">{elemento.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Elementos Pendientes */}
              <div>
                <h4 className="text-lg font-semibold text-red-600 mb-3">Elementos Pendientes</h4>
                <div className="space-y-2">
                  {cumplimiento.elementos.filter(e => !e.completado).map((elemento, index) => (
                    <div key={index} className="flex items-center bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="w-4 h-4 bg-red-600 rounded-full mr-3"></div>
                      <span className="text-red-800">{elemento.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Plan para alcanzar 100% */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Plan para alcanzar 100%</h4>
              <div className="space-y-2 text-blue-800">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  <span>Programar auditoría anual para el próximo trimestre</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  <span>Contactar con auditores certificados LOPIVI</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  <span>Preparar documentación para la auditoría</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  <span>Tiempo estimado para completar: 2-3 meses</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => {
                  alert('Generando informe detallado de cumplimiento...')
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Generar Informe
              </button>
              <button
                onClick={() => {
                  alert('Programando recordatorio para auditoría...')
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Programar Auditoría
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Renovación */}
      {modalRenovacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Renovar Certificación</h3>
              <button
                onClick={() => setModalRenovacion(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-bold text-orange-900 mb-2">Estado de Certificación</h4>
                <p className="text-orange-800">Tu certificación expira en 3 meses. Es recomendable renovar con antelación.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="existente"
                      checked={metodoPago === 'existente'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="mr-2"
                    />
                    Usar tarjeta existente (**** 4567)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="nueva"
                      checked={metodoPago === 'nueva'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="mr-2"
                    />
                    Añadir nueva tarjeta
                  </label>
                </div>
              </div>

              {metodoPago === 'nueva' && (
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                    <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Caducidad</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="MM/AA" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Renovación Anual</span>
                  <span className="font-bold text-blue-600">25€ + IVA</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">Incluye certificación, soporte técnico y actualizaciones</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    alert('Procesando renovación...')
                    setModalRenovacion(false)
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  Procesar Renovación
                </button>
                <button
                  onClick={() => setModalRenovacion(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Certificados de Antecedentes Penales */}
      {modalCertificadosPenales && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Gestión de Certificados de Antecedentes Penales</h3>
              <button
                onClick={() => setModalCertificadosPenales(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-blue-900 mb-2">Información Important LOPIVI</h4>
                <p className="text-blue-800 text-sm">
                  Todos los delegados y personal que trabaje con menores deben tener certificados de antecedentes penales
                  vigentes (máximo 3 meses de antigüedad). Es obligatorio renovarlos regularmente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{certificadosVigentes}</div>
                  <div className="text-green-800 font-medium">Certificados Vigentes</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{certificadosPendientes}</div>
                  <div className="text-red-800 font-medium">Pendientes/Caducados</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {certificadosPenales.filter(c => c.estado === 'vigente' && c.diasRestantes < 30).length}
                  </div>
                  <div className="text-yellow-800 font-medium">Próximos a Caducar</div>
                </div>
              </div>
            </div>

            {/* Lista de Certificados */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Estado por Persona</h4>
              {certificadosPenales.map((cert) => (
                <div key={cert.id} className={`border rounded-lg p-4 ${
                  cert.estado === 'vigente' ? 'border-green-200 bg-green-50' :
                  cert.estado === 'caducado' ? 'border-red-200 bg-red-50' :
                  'border-yellow-200 bg-yellow-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h5 className="font-medium text-gray-900">{cert.nombre}</h5>
                          <p className="text-gray-600 text-sm">{cert.cargo}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          cert.estado === 'vigente' ? 'bg-green-100 text-green-800' :
                          cert.estado === 'caducado' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cert.estado === 'vigente' ? 'Vigente' :
                           cert.estado === 'caducado' ? 'Caducado' : 'Pendiente'}
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-600">
                        {cert.fechaEmision ? (
                          <div className="flex space-x-4">
                            <span>Emisión: {cert.fechaEmision}</span>
                            {cert.estado === 'vigente' && (
                              <span className={cert.diasRestantes < 30 ? 'text-orange-600 font-medium' : ''}>
                                {cert.diasRestantes > 0 ?
                                  `Caduca en ${cert.diasRestantes} días` :
                                  `Caducado hace ${Math.abs(cert.diasRestantes)} días`}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-red-600">Sin certificado registrado</span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {cert.estado === 'vigente' && cert.diasRestantes < 30 && (
                        <button
                          onClick={() => alert(`Enviando recordatorio de renovación a ${cert.nombre}`)}
                          className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                        >
                          Recordar Renovación
                        </button>
                      )}
                      {cert.estado !== 'vigente' && (
                        <button
                          onClick={() => alert(`Solicitando certificado a ${cert.nombre}`)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Solicitar Certificado
                        </button>
                      )}
                      <button
                        onClick={() => alert(`Subiendo certificado para ${cert.nombre}`)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Subir Certificado
                      </button>
                      {cert.fechaEmision && (
                        <button
                          onClick={() => alert(`Descargando certificado de ${cert.nombre}`)}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                        >
                          Descargar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Acciones Masivas */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Acciones Masivas</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => alert('Enviando recordatorio masivo a todo el personal con certificados próximos a caducar...')}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  Recordatorio Masivo
                </button>
                <button
                  onClick={() => alert('Generando informe completo de certificados...')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Generar Informe
                </button>
                <button
                  onClick={() => alert('Exportando datos de certificados...')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Exportar Datos
                </button>
                <button
                  onClick={() => alert('Configurando recordatorios automáticos...')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Configurar Automatización
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Recordatorio:</strong> Los certificados de antecedentes penales deben renovarse cada 3 meses
              según la normativa LOPIVI. El sistema enviará recordatorios automáticos 30 días antes del vencimiento.
            </div>
          </div>
        </div>
      )}

      {/* Modal Guía Detallada */}
      {modalGuiaDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {guiaSeleccionada === 'gestion-casos' && 'Guía: Gestión de Casos'}
                {guiaSeleccionada === 'cumplimiento-lopivi' && 'Guía: Cumplimiento LOPIVI'}
                {guiaSeleccionada === 'formacion-personal' && 'Guía: Formación del Personal'}
                {guiaSeleccionada === 'alertas-notificaciones' && 'Guía: Alertas y Notificaciones'}
                {guiaSeleccionada === 'comunicacion' && 'Guía: Comunicación'}
                {guiaSeleccionada === 'renovacion' && 'Guía: Renovación'}
              </h3>
              <button
                onClick={() => setModalGuiaDetalle(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {guiaSeleccionada === 'gestion-casos' && (
                <div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-bold text-blue-900 mb-2">Gestión de Casos LOPIVI</h4>
                    <p className="text-blue-800">Protocolo completo para la gestión adecuada de casos e incidencias</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">1. Detección y Registro</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Identificar señales de alerta o indicadores de riesgo</li>
                        <li>Documentar la situación de forma detallada y objetiva</li>
                        <li>Registrar fecha, hora, personas involucradas y testigos</li>
                        <li>Usar el botón "Nuevo Caso" para crear el registro oficial</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">2. Evaluación Inicial</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Determinar el nivel de urgencia del caso</li>
                        <li>Activar protocolos de seguridad inmediata si es necesario</li>
                        <li>Contactar con servicios de emergencia en casos graves</li>
                        <li>Notificar al delegado suplente si procede</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">3. Seguimiento y Comunicación</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Mantener comunicación regular con las familias</li>
                        <li>Coordinar con servicios sociales y autoridades</li>
                        <li>Documentar todas las acciones realizadas</li>
                        <li>Actualizar el estado del caso en el sistema</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {guiaSeleccionada === 'cumplimiento-lopivi' && (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-bold text-green-900 mb-2">Cumplimiento Normativo LOPIVI</h4>
                    <p className="text-green-800">Requisitos y procedimientos para mantener el cumplimiento</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Elementos Obligatorios</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Plan de Protección vigente y actualizado</li>
                        <li>Delegado Principal y Suplente certificados</li>
                        <li>Personal formado en protección infantil</li>
                        <li>Protocolos de actuación documentados</li>
                        <li>Canal de comunicación operativo</li>
                        <li>Registro actualizado de casos</li>
                        <li>Certificados de antecedentes penales vigentes</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Revisiones Periódicas</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Auditoría anual del cumplimiento</li>
                        <li>Actualización de protocolos cada 2 años</li>
                        <li>Renovación de certificaciones</li>
                        <li>Formación continua del personal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {guiaSeleccionada === 'formacion-personal' && (
                <div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <h4 className="font-bold text-orange-900 mb-2">Formación del Personal</h4>
                    <p className="text-orange-800">Gestión y seguimiento de la formación LOPIVI</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Requisitos de Formación</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Todo el personal debe recibir formación básica LOPIVI</li>
                        <li>Formación específica según el rol y responsabilidades</li>
                        <li>Renovación cada 2 años de la formación</li>
                        <li>Registro documental de toda la formación</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Gestión de Recordatorios</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Usar el botón "Ver" para revisar el estado del personal</li>
                        <li>Enviar recordatorios individuales cuando sea necesario</li>
                        <li>Inscribir personal en formaciones programadas</li>
                        <li>Usar recordatorios masivos para comunicaciones generales</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {guiaSeleccionada === 'alertas-notificaciones' && (
                <div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h4 className="font-bold text-red-900 mb-2">Sistema de Alertas</h4>
                    <p className="text-red-800">Gestión eficaz de alertas y notificaciones</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Tipos de Alertas</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Casos urgentes que requieren atención inmediata</li>
                        <li>Vencimientos de certificados o documentación</li>
                        <li>Actualizaciones normativas importantes</li>
                        <li>Recordatorios de formación y renovaciones</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Gestión de Alertas</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Revisar diariamente las alertas pendientes</li>
                        <li>Priorizar según nivel de urgencia</li>
                        <li>Documentar las acciones tomadas</li>
                        <li>Marcar como resueltas una vez completadas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {guiaSeleccionada === 'comunicacion' && (
                <div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <h4 className="font-bold text-purple-900 mb-2">Comunicación Efectiva</h4>
                    <p className="text-purple-800">Canales y protocolos de comunicación</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Comunicación con Personal</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Informar sobre cambios normativos y procedimientos</li>
                        <li>Compartir actualizaciones del Plan de Protección</li>
                        <li>Comunicar casos que requieren vigilancia especial</li>
                        <li>Coordinar formaciones y actividades</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Comunicación con Familias</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Mantener transparencia en los procesos</li>
                        <li>Explicar medidas de protección implementadas</li>
                        <li>Solicitar colaboración cuando sea necesario</li>
                        <li>Documentar todas las comunicaciones importantes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {guiaSeleccionada === 'renovacion' && (
                <div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <h4 className="font-bold text-gray-900 mb-2">Renovación de Certificaciones</h4>
                    <p className="text-gray-800">Procedimientos para mantener certificaciones vigentes</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Certificaciones a Renovar</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Certificación de Delegado Principal (anual)</li>
                        <li>Certificación de Delegado Suplente (anual)</li>
                        <li>Certificados de antecedentes penales (cada 3 meses)</li>
                        <li>Formación del personal (cada 2 años)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Proceso de Renovación</h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Revisar fechas de vencimiento regularmente</li>
                        <li>Iniciar proceso de renovación con 30 días de antelación</li>
                        <li>Completar formación actualizada si es requerida</li>
                        <li>Gestionar pago y documentación necesaria</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => setModalGuiaDetalle(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Biblioteca LOPIVI */}
      {modalBiblioteca && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Biblioteca LOPIVI - Documentos Genéricos</h3>
              <button
                onClick={() => setModalBiblioteca(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Protocolo Infancia */}
              <div className="border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-blue-900">Protocolo de Protección Infantil</h4>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Esencial</span>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Documento base que establece los procedimientos de actuación para la protección integral de menores en la entidad.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setDocumentoSeleccionado('protocolo-infancia')
                      setModalBiblioteca(false)
                      setTimeout(() => setModalGuiaDetalle(true), 100)
                    }}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    Ver
                  </button>
                  <button className="px-3 py-2 border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50">
                    Descargar
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50">
                    Compartir
                  </button>
                </div>
              </div>

              {/* Protocolo Directiva */}
              <div className="border border-green-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-green-900">Protocolo para Directivos</h4>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Gestión</span>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Guía específica para directivos sobre responsabilidades, toma de decisiones y coordinación en casos LOPIVI.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setDocumentoSeleccionado('protocolo-directiva')
                      setModalBiblioteca(false)
                      setTimeout(() => setModalGuiaDetalle(true), 100)
                    }}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                  >
                    Ver
                  </button>
                  <button className="px-3 py-2 border border-green-600 text-green-600 rounded text-sm hover:bg-green-50">
                    Descargar
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50">
                    Compartir
                  </button>
                </div>
              </div>

              {/* Protocolo Personal de Contacto */}
              <div className="border border-purple-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-purple-900">Protocolo Personal de Contacto</h4>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Personal</span>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Procedimientos para personal que tiene contacto directo con menores: educadores, monitores, entrenadores.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setDocumentoSeleccionado('protocolo-contacto')
                      setModalBiblioteca(false)
                      setTimeout(() => setModalGuiaDetalle(true), 100)
                    }}
                    className="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700"
                  >
                    Ver
                  </button>
                  <button className="px-3 py-2 border border-purple-600 text-purple-600 rounded text-sm hover:bg-purple-50">
                    Descargar
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50">
                    Compartir
                  </button>
                </div>
              </div>

              {/* Protocolo Personal Sin Contacto */}
              <div className="border border-yellow-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-yellow-900">Protocolo Personal Sin Contacto</h4>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Administrativo</span>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Guía para personal administrativo, mantenimiento y otros roles sin contacto directo con menores.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setDocumentoSeleccionado('protocolo-sin-contacto')
                      setModalBiblioteca(false)
                      setTimeout(() => setModalGuiaDetalle(true), 100)
                    }}
                    className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700"
                  >
                    Ver
                  </button>
                  <button className="px-3 py-2 border border-yellow-600 text-yellow-600 rounded text-sm hover:bg-yellow-50">
                    Descargar
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50">
                    Compartir
                  </button>
                </div>
              </div>

              {/* Mapa de Riesgos */}
              <div className="border border-red-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-red-900">Mapa de Riesgos</h4>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Prevención</span>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Herramienta para identificar, evaluar y gestionar riesgos potenciales en las instalaciones y actividades.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setDocumentoSeleccionado('mapa-riesgos')
                      setModalBiblioteca(false)
                      setTimeout(() => setModalGuiaDetalle(true), 100)
                    }}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                  >
                    Ver
                  </button>
                  <button className="px-3 py-2 border border-red-600 text-red-600 rounded text-sm hover:bg-red-50">
                    Descargar
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50">
                    Compartir
                  </button>
                </div>
              </div>

              {/* Código de Conducta */}
              <div className="border border-indigo-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-indigo-900">Código de Conducta</h4>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">Normativo</span>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Normas de comportamiento y conducta profesional para todo el personal de la entidad.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setDocumentoSeleccionado('codigo-conducta')
                      setModalBiblioteca(false)
                      setTimeout(() => setModalGuiaDetalle(true), 100)
                    }}
                    className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700"
                  >
                    Ver
                  </button>
                  <button className="px-3 py-2 border border-indigo-600 text-indigo-600 rounded text-sm hover:bg-indigo-50">
                    Descargar
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50">
                    Compartir
                  </button>
                </div>
              </div>

              {/* Protocolo +16 años */}
              <div className="border border-teal-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-teal-900">Protocolo +16 años</h4>
                  <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs">Específico</span>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Protocolo específico para la protección de adolescentes mayores de 16 años con consideraciones especiales.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setDocumentoSeleccionado('protocolo-16')
                      setModalBiblioteca(false)
                      setTimeout(() => setModalGuiaDetalle(true), 100)
                    }}
                    className="flex-1 bg-teal-600 text-white px-3 py-2 rounded text-sm hover:bg-teal-700"
                  >
                    Ver
                  </button>
                  <button className="px-3 py-2 border border-teal-600 text-teal-600 rounded text-sm hover:bg-teal-50">
                    Descargar
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50">
                    Compartir
                  </button>
                </div>
              </div>

              {/* Protocolo Familia y Tutores */}
              <div className="border border-orange-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-orange-900">Protocolo Familia y Tutores</h4>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Familiar</span>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Guía para la comunicación y coordinación con familias y tutores legales en situaciones LOPIVI.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setDocumentoSeleccionado('protocolo-familia')
                      setModalBiblioteca(false)
                      setTimeout(() => setModalGuiaDetalle(true), 100)
                    }}
                    className="flex-1 bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700"
                  >
                    Ver
                  </button>
                  <button className="px-3 py-2 border border-orange-600 text-orange-600 rounded text-sm hover:bg-orange-50">
                    Descargar
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50">
                    Compartir
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">Información importante</h4>
              <p className="text-gray-700 text-sm">
                Todos los documentos están actualizados según la normativa LOPIVI vigente. Recomendamos descargar y adaptar
                estos protocolos genéricos a las necesidades específicas de su entidad. Mantenga siempre la documentación
                actualizada y accesible para todo el personal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Documentos de la Entidad */}
      {modalDocumentosEntidad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Registro de Documentos de la Entidad</h3>
              <button
                onClick={() => setModalDocumentosEntidad(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Todos los tipos</option>
                  <option>Protocolo</option>
                  <option>Informe</option>
                  <option>Certificado</option>
                  <option>Comunicación</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Todos los estados</option>
                  <option>Enviado</option>
                  <option>Pendiente</option>
                  <option>Confirmado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>

            {/* Lista de Documentos */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-bold text-gray-900">Plan de Protección Infantil 2024</h4>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Enviado</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Protocolo</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Plan específico adaptado para la entidad con protocolos de actuación actualizados.
                    </p>
                    <div className="text-sm text-gray-500">
                      <strong>Fecha de envío:</strong> 15/01/2024 - 14:30<br/>
                      <strong>Enviado a:</strong> Todo el personal (12 personas)<br/>
                      <strong>Confirmaciones recibidas:</strong> 10/12<br/>
                      <strong>Pendientes:</strong> Ana Martínez, Jorge Ruiz
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                      Ver
                    </button>
                    <button className="border border-gray-300 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      Reenviar
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-bold text-gray-900">Código de Conducta Actualizado</h4>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Enviado</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Normativo</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Código de conducta revisado con las últimas actualizaciones normativas.
                    </p>
                    <div className="text-sm text-gray-500">
                      <strong>Fecha de envío:</strong> 20/01/2024 - 09:15<br/>
                      <strong>Enviado a:</strong> Directivos y coordinadores (5 personas)<br/>
                      <strong>Confirmaciones recibidas:</strong> 5/5<br/>
                      <strong>Estado:</strong> Completado
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                      Ver
                    </button>
                    <button className="border border-gray-300 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      Duplicar
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-bold text-gray-900">Informe Mensual Enero 2024</h4>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pendiente</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Informe</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Informe mensual de cumplimiento LOPIVI con estadísticas y seguimiento de casos.
                    </p>
                    <div className="text-sm text-gray-500">
                      <strong>Fecha programada:</strong> 25/01/2024 - 16:00<br/>
                      <strong>Destinatarios:</strong> Administración Regional<br/>
                      <strong>Estado:</strong> En preparación<br/>
                      <strong>Progreso:</strong> 75% completado
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700">
                      Completar
                    </button>
                    <button className="border border-gray-300 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      Editar
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-bold text-gray-900">Comunicación Familias - Protocolo COVID</h4>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Enviado</span>
                      <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs">Comunicación</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Comunicación a familias sobre protocolos de seguridad y protección infantil actualizados.
                    </p>
                    <div className="text-sm text-gray-500">
                      <strong>Fecha de envío:</strong> 18/01/2024 - 11:45<br/>
                      <strong>Enviado a:</strong> Familias registradas (45 familias)<br/>
                      <strong>Visto por:</strong> 42/45 familias<br/>
                      <strong>Respuestas recibidas:</strong> 38/45
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                      Ver
                    </button>
                    <button className="border border-gray-300 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-50">
                      Estadísticas
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones masivas */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Mostrando 4 de 15 documentos | Total enviados: 127 | Pendientes: 3
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Exportar Registro
                  </button>
                  <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50">
                    Generar Informe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Inspección */}
      {modalInspeccion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Informe Detallado para Inspección LOPIVI</h3>
              <button
                onClick={() => setModalInspeccion(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-8">
              {/* Header del Informe */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <h1 className="text-3xl font-bold text-blue-900">INFORME DE CUMPLIMIENTO LOPIVI</h1>
                  <p className="text-blue-700 text-lg">Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia</p>
                  <p className="text-blue-600 mt-2">Entidad: {sessionData?.entidad || 'Entidad Ejemplo'}</p>
                  <p className="text-blue-600">Fecha del informe: {new Date().toLocaleDateString('es-ES')}</p>
                </div>
              </div>

              {/* Información General */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-900">Datos de la Entidad</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><strong>Nombre:</strong> {sessionData?.entidad || 'Entidad Ejemplo'}</p>
                    <p><strong>CIF:</strong> B-12345678</p>
                    <p><strong>Tipo de actividad:</strong> Centro deportivo/educativo</p>
                    <p><strong>Número de menores atendidos:</strong> 250 menores</p>
                    <p><strong>Personal total:</strong> 15 personas</p>
                    <p><strong>Delegado Principal:</strong> {sessionData?.nombre || 'Nombre del Delegado'}</p>
                    <p><strong>Fecha de última inspección:</strong> 15/03/2023</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-900">Estado de Cumplimiento</h4>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Cumplimiento General LOPIVI</span>
                      <span className="text-2xl font-bold text-green-600">{cumplimiento.porcentaje}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{ width: `${cumplimiento.porcentaje}%` }}
                      ></div>
                    </div>
                    <p className="text-green-700 text-sm mt-2">
                      {cumplimiento.completados} de {cumplimiento.total} elementos completados
                    </p>
                  </div>
                </div>
              </div>

              {/* Delegados de Protección */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Delegados de Protección</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h5 className="font-bold text-green-900">Delegado Principal</h5>
                    <p><strong>Nombre:</strong> {sessionData?.nombre || 'Nombre del Delegado'}</p>
                    <p><strong>Email:</strong> {sessionData?.email || 'email@ejemplo.com'}</p>
                    <p><strong>Certificación:</strong> ✅ Vigente</p>
                    <p><strong>Fecha de certificación:</strong> 15/01/2024</p>
                    <p><strong>Próxima renovación:</strong> 15/01/2025</p>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h5 className="font-bold text-green-900">Delegado Suplente</h5>
                    <p><strong>Nombre:</strong> María González Rodríguez</p>
                    <p><strong>Email:</strong> maria.gonzalez@ejemplo.com</p>
                    <p><strong>Certificación:</strong> ✅ Vigente</p>
                    <p><strong>Fecha de certificación:</strong> 20/01/2024</p>
                    <p><strong>Próxima renovación:</strong> 20/01/2025</p>
                  </div>
                </div>
              </div>

              {/* Personal y Formación */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Estado de Formación del Personal</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{personalData.filter(p => p.formado).length}</div>
                    <div className="text-green-800">Personal Formado</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{personalData.filter(p => !p.formado).length}</div>
                    <div className="text-red-800">Personal Sin Formar</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((personalData.filter(p => p.formado).length / personalData.length) * 100)}%
                    </div>
                    <div className="text-blue-800">Porcentaje Formado</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {personalData.map((persona) => (
                    <div key={persona.id} className={`flex justify-between items-center p-3 rounded-lg border ${
                      persona.formado ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div>
                        <span className="font-medium">{persona.nombre}</span>
                        <span className="text-gray-600 ml-2">- {persona.cargo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {persona.formado ? (
                          <>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">✅ Formado</span>
                            {persona.fechaFormacion && (
                              <span className="text-green-600 text-xs">{persona.fechaFormacion}</span>
                            )}
                          </>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">❌ Pendiente</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificados de Antecedentes Penales */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Certificados de Antecedentes Penales</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{certificadosVigentes}</div>
                    <div className="text-green-800">Vigentes</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{certificadosPendientes}</div>
                    <div className="text-red-800">Pendientes/Caducados</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((certificadosVigentes / certificadosPenales.length) * 100)}%
                    </div>
                    <div className="text-blue-800">Porcentaje Vigente</div>
                  </div>
                </div>
              </div>

              {/* Casos Activos */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Gestión de Casos</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{casosActivos.length}</div>
                      <div className="text-gray-700">Casos Activos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">12</div>
                      <div className="text-gray-700">Casos Resueltos (2024)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">2</div>
                      <div className="text-gray-700">Casos Pendientes</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentación LOPIVI */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Documentación LOPIVI</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span>✅ Plan de Protección</span>
                      <span className="text-green-600 text-sm">Vigente</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span>✅ Código de Conducta</span>
                      <span className="text-green-600 text-sm">Actualizado</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span>✅ Protocolos de Actuación</span>
                      <span className="text-green-600 text-sm">Vigentes</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span>✅ Canal de Comunicación</span>
                      <span className="text-green-600 text-sm">Activo</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span>✅ Registro de Personal</span>
                      <span className="text-green-600 text-sm">Actualizado</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span>✅ Registro de Casos</span>
                      <span className="text-green-600 text-sm">Al día</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span>✅ Mapa de Riesgos</span>
                      <span className="text-green-600 text-sm">Evaluado</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span>❌ Auditoría Anual</span>
                      <span className="text-red-600 text-sm">Pendiente</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conclusiones */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-blue-900 mb-4">Conclusiones de la Inspección</h4>
                <div className="space-y-2 text-blue-800">
                  <p>✅ La entidad cumple con {cumplimiento.porcentaje}% de los requisitos LOPIVI</p>
                  <p>✅ Los delegados de protección están certificados y operativos</p>
                  <p>✅ El personal cuenta con formación mayoritaria en protección infantil</p>
                  <p>✅ La documentación esencial está actualizada y accesible</p>
                  <p>⚠️ Se requiere completar la auditoría anual para alcanzar el 100% de cumplimiento</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Informe generado el {new Date().toLocaleString('es-ES')} | Válido para inspecciones oficiales
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Imprimir/PDF
                  </button>
                  <button
                    onClick={() => alert('Compartiendo informe...')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Compartir
                  </button>
                  <button
                    onClick={() => alert('Descargando informe en PDF...')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Descargar PDF
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
