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
  const [modalDocumentoLOPIVI, setModalDocumentoLOPIVI] = useState(false)

  // State management
  const [casoSeleccionado, setCasoSeleccionado] = useState<Caso | null>(null)
  const [tipoInstruccion, setTipoInstruccion] = useState<string>('')
  const [guiaExpanded, setGuiaExpanded] = useState(false)
  const [guiaSeleccionada, setGuiaSeleccionada] = useState('')
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState('')
  const [metodoPago, setMetodoPago] = useState('existente')

  const tipoEntidad = 'centro-deportivo'

  // CONTENIDO MEJORADO DE DOCUMENTOS
  const obtenerContenidoDocumento = (tipoDoc: string) => {
    const contenidos: { [key: string]: any } = {
      'protocolo-general': {
        titulo: 'Protocolo General de Protección Infantil',
        subtitulo: 'Marco integral de protección LOPIVI para todas las tipologías de entidades',
        contenido: {
          'centro-deportivo': {
            objetivo: 'Establecer un sistema integral de protección que garantice la seguridad física, emocional y psicológica de todos los menores que participan en actividades deportivas, competiciones, entrenamientos y eventos, creando un entorno donde cada menor pueda desarrollar su potencial deportivo en condiciones de máxima seguridad.',
            ambito: `Este protocolo de aplicación integral se extiende a:
• **Instalaciones deportivas**: Pistas, campos, piscinas, gimnasios, vestuarios, duchas, almacenes deportivos
• **Actividades deportivas**: Entrenamientos, competiciones, partidos, torneos, exhibiciones, actividades recreativas
• **Eventos especiales**: Campeonatos, concentraciones, viajes deportivos, intercambios, ceremonias
• **Espacios de apoyo**: Graderías, zonas de descanso, cafeterías, espacios médicos, oficinas administrativas
• **Actividades complementarias**: Fisioterapia, medicina deportiva, psicología deportiva, nutrición
• **Transporte deportivo**: Desplazamientos a competiciones, autobuses, vehículos oficiales
• **Alojamiento deportivo**: Concentraciones, campamentos deportivos, residencias`,
            responsabilidades: [
              '**Directivos deportivos**: Liderazgo estratégico, supervisión general del centro deportivo, toma de decisiones de alto nivel, asignación de recursos, comunicación institucional, representación ante federaciones y autoridades competentes',
              '**Delegado/a Principal**: Coordinación operativa del sistema de protección, gestión directa de casos e incidentes, supervisión del cumplimiento normativo, formación del personal, comunicación con familias y autoridades',
              '**Delegado/a Suplente**: Apoyo especializado en seguimiento de casos, supervisión de actividades de riesgo, coordinación con servicios externos, gestión de documentación, backup en ausencias del principal',
              '**Entrenadores y técnicos deportivos**: Detección temprana de indicadores de riesgo, supervisión directa de menores, aplicación de protocolos de seguridad, comunicación inmediata de preocupaciones, mantenimiento de relaciones apropiadas',
              '**Personal médico y fisioterapeutas**: Evaluación de lesiones sospechosas, detección de señales de maltrato físico, aplicación de protocolos médicos, coordinación con servicios sanitarios, mantenimiento de confidencialidad médica',
              '**Personal administrativo y de apoyo**: Control de accesos, gestión de visitantes, mantenimiento de la confidencialidad, colaboración en la prevención, apoyo logístico en emergencias',
              '**Personal de limpieza y mantenimiento**: Observación de espacios y situaciones irregulares, mantenimiento de la seguridad de las instalaciones, reporte de incidencias, colaboración con protocolos de emergencia'
            ],
            procedimientos: [
              '**Evaluación continua de riesgos en instalaciones deportivas**: Análisis mensual de espacios de alto riesgo como vestuarios, duchas, almacenes, identificación de puntos ciegos de supervisión, evaluación de condiciones de iluminación y privacidad, revisión de sistemas de acceso y control',
              '**Protocolos específicos para vestuarios y espacios íntimos**: Supervisión escalonada por edades, horarios diferenciados por género, presencia obligatoria de personal del mismo género, sistemas de acompañamiento para menores que requieren asistencia, protocolos de emergencia médica',
              '**Gestión especializada de competiciones y eventos**: Planificación previa de medidas de protección, identificación de responsables de supervisión, protocolos de comunicación con familias, gestión de espectadores y visitantes, procedimientos de emergencia específicos',
              '**Procedimientos para viajes y concentraciones deportivas**: Autorización parental específica para viajes, ratio adulto-menor apropiado, alojamiento con supervisión adecuada, protocolos de comunicación durante desplazamientos, gestión de emergencias fuera de las instalaciones base',
              '**Comunicación inmediata multi-nivel**: Protocolos de comunicación urgente con familias, notificación a autoridades competentes según gravedad, coordinación con servicios de emergencia, gestión de comunicación institucional, seguimiento post-incidente',
              '**Gestión de contacto físico en deportes**: Definición clara de contacto físico necesario por modalidad deportiva, técnicas de corrección apropiadas, limitaciones en ayudas físicas, protocolos para deportes de contacto, gestión de lesiones y primeros auxilios',
              '**Supervisión de actividades acuáticas**: Protocolos específicos para piscinas, supervisión de vestuarios acuáticos, gestión de actividades de natación, procedimientos de rescate, protocolos de higiene y seguridad acuática'
            ]
          },
          // ... otras entidades con contenido similar mejorado
        }
      },
      'protocolo-infancia': {
        titulo: 'Protocolo Integral de Protección Infantil',
        subtitulo: 'Marco operativo completo para la protección integral de menores según LOPIVI',
        contenido: `
**PROTOCOLO INTEGRAL DE PROTECCIÓN INFANTIL - LOPIVI 2021**

*Marco operativo especializado para la implementación efectiva de la protección integral de la infancia y adolescencia frente a la violencia*

---

**1. FUNDAMENTOS Y MARCO LEGAL**

**1.1 Objetivo Superior del Protocolo**

Este protocolo establece el marco operativo integral para garantizar la protección efectiva de todos los menores de edad bajo la responsabilidad de la entidad, implementando de manera sistemática las disposiciones de la Ley Orgánica 8/2021 de protección integral a la infancia y la adolescencia frente a la violencia, junto con toda la normativa conexa nacional e internacional.

**Finalidades específicas:**
• **Prevención primaria**: Crear entornos genuinamente protectores que eliminen factores de riesgo
• **Detección temprana**: Identificar precozmente cualquier situación de riesgo o vulneración de derechos
• **Intervención inmediata**: Responder de forma oportuna y efectiva ante cualquier situación detectada
• **Protección integral**: Garantizar la seguridad física, emocional, psicológica y social de todos los menores
• **Reparación y acompañamiento**: Facilitar procesos de recuperación cuando sea necesario
• **Mejora continua**: Evaluar y optimizar constantemente el sistema de protección

**1.2 Marco Normativo Integral**

**Normativa Internacional:**
• **Convención sobre los Derechos del Niño (1989)**: Reconocimiento de derechos fundamentales
• **Protocolo Facultativo sobre la venta de niños (2000)**: Protección contra explotación
• **Convenio del Consejo de Europa de Lanzarote (2007)**: Prevención de abuso sexual
• **Directrices del Comité de los Derechos del Niño**: Interpretación autorizada de derechos

**Normativa Europea:**
• **Directiva 2011/93/UE**: Lucha contra abuso sexual y explotación infantil
• **Estrategia de la UE sobre los Derechos de la Infancia (2021-2024)**
• **Reglamento General de Protección de Datos (RGPD)**

**Normativa Nacional:**
• **Ley Orgánica 8/2021 LOPIVI**: Marco legal principal de protección integral
• **Ley Orgánica 1/1996 de Protección Jurídica del Menor**: Normativa de protección
• **Código Penal**: Delitos contra menores y responsabilidades
• **Ley 4/2015 del Estatuto de la Víctima del Delito**

**Normativa Autonómica y Local:**
• Leyes autonómicas de protección de la infancia
• Protocolos de coordinación interinstitucional
• Planes locales de protección infantil
• Ordenanzas municipales específicas

**1.3 Principios Rectores LOPIVI**

**Principio del Interés Superior del Menor:**
• **Primacía absoluta**: Prevalece sobre cualquier otro interés legítimo
• **Evaluación individualizada**: Análisis específico de cada menor y situación
• **Participación del menor**: Derecho a ser escuchado según edad y madurez
• **Interpretación sistemática**: Coherencia con todos los derechos del menor
• **Decisión motivada**: Justificación explícita de medidas adoptadas

**Cada menor merece crecer en un entorno seguro, donde sus derechos sean respetados, su dignidad preservada y su potencial desarrollado plenamente. Este es nuestro compromiso, nuestra responsabilidad y nuestra misión.**

*"La protección de la infancia es la protección del futuro de nuestra sociedad"*

---
**Protocolo aprobado por:** [Dirección de la Entidad]
**Fecha de aprobación:** [Fecha]
**Próxima revisión obligatoria:** [Fecha + 1 año]
**Versión:** 1.0 - LOPIVI 2021
        `
      },
      'protocolo-directiva': {
        titulo: 'Protocolo para Directivos',
        subtitulo: 'Responsabilidades específicas del equipo directivo',
        contenido: `
**PROTOCOLO INTEGRAL PARA EQUIPO DIRECTIVO EN PROTECCIÓN INFANTIL**

Este protocolo específico establece las responsabilidades, procedimientos y competencias exclusivas del equipo directivo en la implementación efectiva de la protección infantil según la Ley Orgánica 8/2021.

**1. LIDERAZGO ESTRATÉGICO EN PROTECCIÓN**

**1.1 Responsabilidades de Alta Dirección**
• **Visión institucional**: Establecimiento de la protección infantil como valor fundamental
• **Política organizacional**: Desarrollo de marcos políticos integrales
• **Asignación de recursos**: Garantía de recursos humanos y materiales suficientes
• **Supervisión ejecutiva**: Monitoreo de cumplimiento y eficacia del sistema
• **Rendición de cuentas**: Responsabilidad final ante autoridades y sociedad

**1.2 Gestión de Crisis y Emergencias**
• **Protocolos de crisis**: Procedimientos ejecutivos para situaciones críticas
• **Comunicación de crisis**: Gestión de comunicación institucional y mediática
• **Coordinación interinstitucional**: Enlace con autoridades y organismos externos
• **Toma de decisiones críticas**: Capacidad de decisión inmediata en emergencias

**2. COORDINACIÓN INSTITUCIONAL**

**2.1 Relaciones Externas**
• **Autoridades competentes**: Coordinación con servicios sociales, fiscalía, policía
• **Entidades colaboradoras**: Gestión de partnerships y colaboraciones
• **Comunidad**: Transparencia y comunicación con familias y entorno social
• **Medios de comunicación**: Estrategia de comunicación pública responsable

**3. EVALUACIÓN Y MEJORA CONTINUA**

**3.1 Sistema de Evaluación Ejecutiva**
• **Auditorías internas**: Supervisión regular del sistema de protección
• **Evaluación de eficacia**: Medición de resultados y impacto
• **Benchmarking**: Comparación con mejores prácticas del sector
• **Planificación estratégica**: Desarrollo de planes de mejora a largo plazo

*Protocolo Directivo Especializado | Revisión Anual Obligatoria | Evaluación Externa Requerida*
        `
      }
    }
    return contenidos[tipoDoc] || null
  }

  // Sample data
  const casosActivos: Caso[] = [
    {
      id: '1',
      titulo: 'Incidente en área deportiva',
      estado: 'activo',
      prioridad: 'alta',
      fechaCreacion: '2024-01-15',
      descripcion: 'Situación reportada que requiere seguimiento directo del delegado principal.'
    },
    {
      id: '2',
      titulo: 'Revisión protocolos',
      estado: 'pendiente',
      prioridad: 'media',
      fechaCreacion: '2024-01-10',
      descripcion: 'Actualización de protocolos según nuevas directrices.'
    },
    {
      id: '3',
      titulo: 'Formación personal',
      estado: 'activo',
      prioridad: 'media',
      fechaCreacion: '2024-01-08',
      descripcion: 'Coordinar formación LOPIVI para nuevo personal.'
    }
  ]

  const personalData: PersonalItem[] = [
    { id: '1', nombre: 'María García', cargo: 'Coordinadora', formado: true, fechaFormacion: '2024-01-15', certificado: true },
    { id: '2', nombre: 'Carlos López', cargo: 'Entrenador Principal', formado: true, fechaFormacion: '2024-01-10', certificado: true },
    { id: '3', nombre: 'Ana Martínez', cargo: 'Fisioterapeuta', formado: false },
    { id: '4', nombre: 'Jorge Ruiz', cargo: 'Monitor', formado: false },
    { id: '5', nombre: 'Laura Sánchez', cargo: 'Psicóloga', formado: true, fechaFormacion: '2024-01-05', certificado: true },
    { id: '6', nombre: 'Pedro Fernández', cargo: 'Administrativo', formado: false },
  ]

  useEffect(() => {
    const sessionCustodia = localStorage.getItem('custodia360_session')
    const sessionFormacion = localStorage.getItem('formacion_lopivi_session')
    const sessionUser = localStorage.getItem('userSession')

    const session = sessionCustodia || sessionFormacion || sessionUser

    if (session) {
      try {
        const data = JSON.parse(session)

        if (data.expiracion && new Date(data.expiracion) <= new Date()) {
          localStorage.removeItem('userSession')
          localStorage.removeItem('custodia360_session')
          localStorage.removeItem('formacion_lopivi_session')
          router.push('/login-delegados')
          return
        }

        if (data.tipo !== 'principal') {
          console.log('❌ Usuario no es delegado principal:', data.tipo)
          router.push('/login-delegados?tipo=principal')
          return
        }

        setSessionData({
          id: data.id,
          nombre: data.nombre,
          email: data.email,
          tipo: data.tipo,
          entidad: data.entidad?.nombre || 'Entidad',
          permisos: ['gestionar_casos', 'ver_informes', 'administrar'],
          certificacionVigente: true,
          inicioSesion: new Date().toISOString(),
          expiracion: data.expiracion || new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
        })
      } catch (error) {
        console.error('❌ Error loading session:', error)
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Casos Activos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Casos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{casosActivos.filter(c => c.estado === 'activo').length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Personal Formado */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Personal Formado</p>
                <p className="text-2xl font-bold text-gray-900">{personalData.filter(p => p.formado).length}/{personalData.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Cumplimiento */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Cumplimiento</p>
                <p className="text-2xl font-bold text-gray-900">{cumplimiento.porcentaje}%</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Certificados Penales */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Cert. Penales</p>
                <p className="text-2xl font-bold text-gray-900">{personalData.filter(p => p.certificado).length}/{personalData.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Casos Activos Card */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Casos Activos</h3>
                  <button
                    onClick={() => setModalCasosActivos(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Ver todos
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {casosActivos.slice(0, 3).map((caso) => (
                    <div key={caso.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{caso.titulo}</p>
                        <p className="text-sm text-gray-600">{caso.descripcion}</p>
                        <p className="text-xs text-gray-500">Creado: {caso.fechaCreacion}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          caso.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                          caso.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {caso.prioridad}
                        </span>
                        <button
                          onClick={() => {
                            setCasoSeleccionado(caso)
                            setModalGestionarCaso(true)
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Personal Formado Card */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Personal y Formación</h3>
                  <button
                    onClick={() => setModalPersonalFormado(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Gestionar
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {personalData.slice(0, 4).map((persona) => (
                    <div key={persona.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {persona.nombre.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{persona.nombre}</p>
                          <p className="text-xs text-gray-600">{persona.cargo}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          persona.formado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {persona.formado ? 'Formado' : 'Pendiente'}
                        </span>
                        {persona.certificado && (
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Gestión Avanzada */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Gestión Principal</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button
                    onClick={() => setModalBiblioteca(true)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Biblioteca LOPIVI</p>
                        <p className="text-sm text-gray-600">Documentos y protocolos</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setModalInstruccionesCaso(true)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Gestión de Casos</p>
                        <p className="text-sm text-gray-600">Procedimientos avanzados</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setModalCertificadosPenales(true)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Certificados Penales</p>
                        <p className="text-sm text-gray-600">Administración completa</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setModalInspeccion(true)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v4a2 2 0 002 2h2a2 2 0 002-2v-4m0 0V9a2 2 0 00-2-2H9v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Inspección y Auditoría</p>
                        <p className="text-sm text-gray-600">Reportes y evaluación</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Cumplimiento Card */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Cumplimiento LOPIVI</h3>
                  <button
                    onClick={() => setModalCumplimiento(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <span className="text-2xl font-bold text-green-600">{cumplimiento.porcentaje}%</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {cumplimiento.completados} de {cumplimiento.total} elementos completados
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${cumplimiento.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Biblioteca LOPIVI */}
      {modalBiblioteca && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">📚 Biblioteca LOPIVI</h3>
              <button
                onClick={() => setModalBiblioteca(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-bold text-gray-900 mb-2">📋 Protocolo General</h4>
                <p className="text-gray-700 text-sm mb-4">
                  Marco integral específico para su tipo de entidad con contenido mejorado y profesionalizado.
                </p>
                <button
                  onClick={() => {
                    setDocumentoSeleccionado('protocolo-general')
                    setModalBiblioteca(false)
                    setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                  }}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Ver Contenido Mejorado
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-bold text-gray-900 mb-2">🛡️ Protocolo Integral LOPIVI</h4>
                <p className="text-gray-700 text-sm mb-4">
                  Marco operativo completo con contenido profesional avanzado.
                </p>
                <button
                  onClick={() => {
                    setDocumentoSeleccionado('protocolo-infancia')
                    setModalBiblioteca(false)
                    setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                  }}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Ver Marco Renovado
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-bold text-gray-900 mb-2">👔 Protocolo Directivos</h4>
                <p className="text-gray-700 text-sm mb-4">
                  Guía especializada para equipo directivo.
                </p>
                <button
                  onClick={() => {
                    setDocumentoSeleccionado('protocolo-directiva')
                    setModalBiblioteca(false)
                    setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                  }}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Ver Guía Especializada
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Documento LOPIVI con CONTENIDO MEJORADO */}
      {modalDocumentoLOPIVI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {obtenerContenidoDocumento(documentoSeleccionado)?.titulo || 'Documento LOPIVI'}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {obtenerContenidoDocumento(documentoSeleccionado)?.subtitulo}
                </p>
              </div>
              <button
                onClick={() => setModalDocumentoLOPIVI(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {(() => {
                const contenido = obtenerContenidoDocumento(documentoSeleccionado)
                if (!contenido) return <p>Contenido no disponible</p>

                if (documentoSeleccionado === 'protocolo-general') {
                  const contenidoEspecifico = contenido.contenido[tipoEntidad]
                  if (!contenidoEspecifico) return <p>Contenido no disponible para este tipo de entidad</p>

                  return (
                    <div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <h4 className="font-bold text-gray-900">{contenido.titulo}</h4>
                        <p className="text-gray-800">{contenido.subtitulo}</p>
                      </div>
                      <div className="prose prose-lg max-w-none">
                        <p><strong>Objetivo:</strong> {contenidoEspecifico.objetivo}</p>
                        <div className="mt-4">
                          <p><strong>Ámbito:</strong></p>
                          <div className="whitespace-pre-line">{contenidoEspecifico.ambito}</div>
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div className="prose prose-lg max-w-none">
                      <div dangerouslySetInnerHTML={{
                        __html: contenido.contenido
                          .replace(/\n/g, '<br/>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} />
                    </div>
                  )
                }
              })()}
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  📥 Descargar PDF
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  📤 Compartir
                </button>
              </div>
              <button
                onClick={() => setModalDocumentoLOPIVI(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AQUÍ IRÍAN TODOS LOS DEMÁS MODALES ORIGINALES DEL DELEGADO PRINCIPAL */}

    </div>
  )
}
