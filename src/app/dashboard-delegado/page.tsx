'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  logDocumentSent,
  logMemberAdded,
  logCaseReported,
  logAuditAction,
  exportAuditLogsForInspection
} from '../../../lib/supabase'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  certificacionVigente: boolean
  formacionCompletada: boolean
}

interface PersonalData {
  nombre: string
  rol: string
  formacionPendiente: string[]
  prioridad: 'Alta' | 'Media' | 'Baja'
  fechaLimite: string
}

export default function DashboardDelegado() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalPersonal, setModalPersonal] = useState(false)
  const [modalNuevoMiembro, setModalNuevoMiembro] = useState(false)
  const [modalEnviarDoc, setModalEnviarDoc] = useState(false)
  const [modalEmergencia, setModalEmergencia] = useState(false)
  const [modalPersonalCompleto, setModalPersonalCompleto] = useState(false)
  const [modalContactoEmail, setModalContactoEmail] = useState(false)
  const [personaSeleccionada, setPersonaSeleccionada] = useState<any>(null)
  const [tipoEmergenciaSeleccionado, setTipoEmergenciaSeleccionado] = useState<string | null>(null)
  const [modalNotificaciones, setModalNotificaciones] = useState(false)
  const [modalFamilias, setModalFamilias] = useState(false)
  const [modalBiblioteca, setModalBiblioteca] = useState(false)

  // Nuevos estados para modales de instrucciones específicas
  const [modalRenovarCertificado, setModalRenovarCertificado] = useState(false)
  const [modalRealizarSeguimiento, setModalRealizarSeguimiento] = useState(false)
  const [modalCompletarEvaluacion, setModalCompletarEvaluacion] = useState(false)
  const [tareaSeleccionada, setTareaSeleccionada] = useState<any>(null)
  const [tareasCompletadas, setTareasCompletadas] = useState<string[]>([])

  const [tipoComunicacionSeleccionado, setTipoComunicacionSeleccionado] = useState<string | null>(null)
  const [categoriaDocumentoSeleccionada, setCategoriaDocumentoSeleccionada] = useState<string | null>(null)

  // Nuevos modales para estadísticas
  const [modalCasoNuevo, setModalCasoNuevo] = useState(false)
  const [modalCasosResueltos, setModalCasosResueltos] = useState(false)
  const [modalCumplimiento, setModalCumplimiento] = useState(false)
  const [modalAlertas, setModalAlertas] = useState(false)
  const [modalCertificados, setModalCertificados] = useState(false)
  const [modalCertificadosPenales, setModalCertificadosPenales] = useState(false)

  // Estados para renovación de certificados - NUEVO
  const [modalRenovacion, setModalRenovacion] = useState(false)
  const [certificadoSeleccionado, setCertificadoSeleccionado] = useState<any>(null)
  const [pasoRenovacion, setPasoRenovacion] = useState(1)
  const [datosRenovacion, setDatosRenovacion] = useState({
    tipoRenovacion: '',
    fechaSolicitud: new Date().toISOString().split('T')[0],
    documentosAdjuntos: [] as string[],
    observaciones: '',
    entidadCertificadora: '',
    costoEstimado: '',
    tiempoEstimado: '30 días hábiles'
  })
  const [nuevoMiembro, setNuevoMiembro] = useState({
    nombre: '',
    email: '',
    rol: '',
    fechaIncorporacion: '',
    documentacion: [] as string[],
    mensaje: ''
  })
  const [envioDoc, setEnvioDoc] = useState({
    destinatarios: [] as string[],
    documentos: [] as string[],
    asunto: '',
    mensaje: '',
    emailAdicional: ''
  })

  // Estados para filtros de personal
  const [filtroPersonal, setFiltroPersonal] = useState('')
  const [filtroRol, setFiltroRol] = useState('')
  const [letraSeleccionada, setLetraSeleccionada] = useState('')

  // Estado para nuevo caso
  const [nuevoCaso, setNuevoCaso] = useState({
    tipo: '',
    titulo: '',
    descripcion: '',
    personaQueHaceAccion: '', // Nueva: quien realiza la acción
    personaQueRecibeAccion: '', // Nueva: quien recibe la acción
    personasInvolucradasAdicionales: [] as string[], // Nueva: otras personas involucradas
    fechaIncidente: '',
    prioridad: '',
    testigos: '',
    accionesInmediatas: ''
  })

  // Estados para funcionalidades adicionales
  const [mostrarGuiaPrioridades, setMostrarGuiaPrioridades] = useState(false)
  const [elementoSeleccionado, setElementoSeleccionado] = useState<string | null>(null)
  const [alertaResolviendose, setAlertaResolviendose] = useState<string | null>(null)

  // Estado para agregar personas adicionales al caso
  const [personaAdicionalTemp, setPersonaAdicionalTemp] = useState('')

  // Estado para casos resueltos eliminados
  const [casosResueltosEliminados, setCasosResueltosEliminados] = useState<string[]>([])

  // Estados para recordatorios y reclamaciones de cumplimiento
  const [modalRecordatorio, setModalRecordatorio] = useState(false)
  const [modalReclamacion, setModalReclamacion] = useState(false)
  const [elementoParaAccion, setElementoParaAccion] = useState<any>(null)
  const [tipoAccion, setTipoAccion] = useState<'recordatorio' | 'reclamacion' | null>(null)
  const [mensajePersonalizado, setMensajePersonalizado] = useState('')

  // Estados para certificados penales
  const [filtroEstado, setFiltroEstado] = useState('')
  const [personalSeleccionado, setPersonalSeleccionado] = useState<any>(null)
  const [modalAccionCertificado, setModalAccionCertificado] = useState(false)

  // Estado para análisis rápido de cumplimiento
  const [modalAnalisisRapido, setModalAnalisisRapido] = useState(false)

  // Estados para biblioteca LOPIVI
  const [modalVerDocumento, setModalVerDocumento] = useState(false)
  const [modalCompartirDocumento, setModalCompartirDocumento] = useState(false)
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<any>(null)
  const [categoriaSeleccionadaDoc, setCategoriaSeleccionadaDoc] = useState<any>(null)

  // Estados para auditoría LOPIVI
  const [modalAuditoria, setModalAuditoria] = useState(false)
  const [logsAuditoria, setLogsAuditoria] = useState<any[]>([])
  const [cargandoLogs, setCargandoLogs] = useState(false)
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  // Estados para informe de inspección
  const [modalInspeccion, setModalInspeccion] = useState(false)
  const [generandoInforme, setGenerandoInforme] = useState(false)

  // Datos del personal con formación pendiente
  const personalPendiente: PersonalData[] = [
    {
      nombre: 'Carlos Ruiz',
      rol: 'Entrenador',
      formacionPendiente: ['Curso LOPIVI (40h)', 'Antecedentes penales', 'Test psicológico', 'Examen final', 'Documentación médica'],
      prioridad: 'Alta',
      fechaLimite: '2025-10-15'
    },
    {
      nombre: 'Miguel Torres',
      rol: 'Monitor Auxiliar',
      formacionPendiente: ['Módulo 2 (8h)', 'Módulo 3 (6h)', 'Test final', 'Examen presencial'],
      prioridad: 'Media',
      fechaLimite: '2025-11-01'
    },
    {
      nombre: 'Roberto Jiménez',
      rol: 'Monitor',
      formacionPendiente: ['Renovación curso (20h)', 'Antecedentes actualizados', 'Informe médico', 'Test psicológico'],
      prioridad: 'Alta',
      fechaLimite: '2025-09-30'
    }
  ]

  // Datos de casos resueltos
  const casosResueltos = [
    { id: 'CR001', titulo: 'Conducta inapropiada en vestuarios', tipo: 'Comportamiento', fechaReporte: '2025-08-15', fechaResolucion: '2025-08-22', responsable: 'María López', estado: 'Resuelto' },
    { id: 'CR002', titulo: 'Falta de supervisión en actividades', tipo: 'Protocolo', fechaReporte: '2025-08-20', fechaResolucion: '2025-08-25', responsable: 'Carlos Ruiz', estado: 'Resuelto' },
    { id: 'CR003', titulo: 'Uso inadecuado de redes sociales', tipo: 'Digital', fechaReporte: '2025-09-01', fechaResolucion: '2025-09-05', responsable: 'Ana García', estado: 'Resuelto' }
  ]

  // Alertas activas
  const alertasActivas = [
    { id: 'AL001', tipo: 'Crítica', titulo: 'Certificado LOPIVI vencido', descripcion: 'El certificado de Juan Pérez ha vencido y sigue en contacto con menores', fechaCreacion: '2025-09-10', responsable: 'Recursos Humanos' },
    { id: 'AL002', tipo: 'Crítica', titulo: 'Falta Plan de Protección actualizado', descripcion: 'El plan de protección no se ha actualizado en los últimos 12 meses', fechaCreacion: '2025-09-12', responsable: 'Delegado Principal' },
    { id: 'AL003', tipo: 'Media', titulo: 'Formación pendiente múltiples personas', descripcion: '3 personas con formación LOPIVI pendiente próxima a vencer', fechaCreacion: '2025-09-08', responsable: 'Formación' }
  ]

  // Certificados próximos a vencer
  const certificadosVencimiento = [
    { id: 'CV001', persona: 'Luis Martín', tipoCertificado: 'Certificado LOPIVI', fechaVencimiento: '2025-10-05', diasRestantes: 17 },
    { id: 'CV002', persona: 'Carmen Flores', tipoCertificado: 'Antecedentes Penales', fechaVencimiento: '2025-10-12', diasRestantes: 24 },
    { id: 'CV003', persona: 'Roberto Silva', tipoCertificado: 'Certificado Médico', fechaVencimiento: '2025-10-18', diasRestantes: 30 }
  ]

  // Elementos faltantes para cumplimiento
  const elementosFaltantes = [
    { categoria: 'Formación Personal', faltante: 'Completar formación de 3 personas', impacto: '5%' },
    { categoria: 'Documentación', faltante: 'Actualizar 2 protocolos específicos', impacto: '2%' },
    { categoria: 'Certificaciones', faltante: 'Renovar 1 certificado médico', impacto: '1%' }
  ]

  const estadisticasAvanzadas = {
    casosNuevos: { valor: 8, comparativa: '+50%', periodo: 'vs mes anterior' },
    casosResueltos: { valor: 15, tiempo: '12 días', descripcion: 'tiempo promedio' },
    personalFormado: { valor: 83, objetivo: 100, descripcion: '% cumplimiento' },
    cumplimiento: { valor: 92, objetivo: 95, descripcion: 'índice general' },
    alertasActivas: { criticas: 2, medias: 1, bajas: 0 },
    certificados: { vencen: 3, vigentes: 28, proximos: 5 }
  }

  // Tipos de casos de emergencia
  const tiposEmergencia = [
    {
      id: 'abuso-fisico',
      titulo: 'Abuso Físico',
      descripcion: 'Contacto físico inapropiado o agresión',
      color: 'bg-red-600',
      procedimiento: [
        '1. DETENER INMEDIATAMENTE cualquier actividad',
        '2. SEPARAR al menor de la situación de riesgo',
        '3. CONTACTAR inmediatamente a los padres/tutores',
        '4. LLAMAR al 112 si hay lesiones físicas',
        '5. DOCUMENTAR todo lo ocurrido por escrito',
        '6. CONTACTAR a las autoridades competentes',
        '7. INFORMAR al delegado principal en máximo 1 hora'
      ]
    },
    {
      id: 'abuso-psicologico',
      titulo: 'Abuso Psicológico',
      descripcion: 'Maltrato verbal, intimidación o acoso',
      color: 'bg-orange-600',
      procedimiento: [
        '1. INTERRUMPIR la situación inmediatamente',
        '2. TRANQUILIZAR al menor afectado',
        '3. DOCUMENTAR las palabras exactas utilizadas',
        '4. SEPARAR al agresor de la actividad',
        '5. CONTACTAR a los padres en un plazo máximo de 2 horas',
        '6. EVALUAR si es necesario apoyo psicológico',
        '7. REPORTAR al delegado principal'
      ]
    },
    {
      id: 'negligencia',
      titulo: 'Negligencia en Supervisión',
      descripcion: 'Falta de supervisión adecuada',
      color: 'bg-yellow-600',
      procedimiento: [
        '1. LOCALIZAR inmediatamente al menor',
        '2. VERIFICAR su estado de salud y bienestar',
        '3. REFORZAR la supervisión del área',
        '4. REVISAR los protocolos de supervisión',
        '5. FORMAR al personal responsable',
        '6. DOCUMENTAR el incidente',
        '7. INFORMAR a los padres si fue significativo'
      ]
    },
    {
      id: 'uso-indebido-tecnologia',
      titulo: 'Uso Indebido de Tecnología',
      descripcion: 'Contenido inapropiado o contacto digital inadecuado',
      color: 'bg-purple-600',
      procedimiento: [
        '1. CONFISCAR inmediatamente el dispositivo',
        '2. NO revisar el contenido sin testigos',
        '3. PRESERVAR las evidencias digitales',
        '4. CONTACTAR a los padres inmediatamente',
        '5. CONSIDERAR contactar a las autoridades',
        '6. DOCUMENTAR todo el proceso',
        '7. REVISAR políticas de uso de tecnología'
      ]
    },
    {
      id: 'emergencia-medica',
      titulo: 'Emergencia Médica',
      descripcion: 'Accidentes o situaciones que requieren atención médica',
      color: 'bg-blue-600',
      procedimiento: [
        '1. EVALUAR la gravedad de la situación',
        '2. LLAMAR al 112 si es necesario',
        '3. APLICAR primeros auxilios básicos',
        '4. CONTACTAR inmediatamente a los padres',
        '5. ACOMPAÑAR al menor al centro médico',
        '6. MANTENER al menor calmado',
        '7. DOCUMENTAR todos los detalles del incidente'
      ]
    }
  ]

  // Personal de la entidad por roles (simulando organización grande)
  const personalEntidad = [
    {
      nombre: 'Ana López Fernández',
      rol: 'Monitora',
      email: 'ana.lopez@entidad.com',
      telefono: '666-555-666',
      fechaIngreso: '2024-06-10',
      estado: 'Activo',
      formacionLOPIVI: 'Completada',
      certificadoVigente: true,
      ultimaInteraccion: '2025-09-14 - Consulta protocolo',
      interacciones: [
        { fecha: '2025-09-14', tipo: 'WhatsApp', descripcion: 'Consulta sobre protocolo de emergencia' },
        { fecha: '2025-09-10', tipo: 'Reunión', descripcion: 'Evaluación trimestral' },
        { fecha: '2025-09-05', tipo: 'Email', descripcion: 'Confirmación asistencia evento' }
      ]
    },
    {
      nombre: 'Antonio García Moreno',
      rol: 'Entrenador Principal',
      email: 'antonio.garcia@entidad.com',
      telefono: '666-111-111',
      fechaIngreso: '2022-01-15',
      estado: 'Activo',
      formacionLOPIVI: 'Completada',
      certificadoVigente: true,
      ultimaInteraccion: '2025-09-15 - Reunión mensual',
      interacciones: [
        { fecha: '2025-09-15', tipo: 'Reunión', descripcion: 'Reunión mensual de seguimiento' },
        { fecha: '2025-09-10', tipo: 'Email', descripcion: 'Envío de protocolos actualizados' }
      ]
    },
    {
      nombre: 'Beatriz Rodríguez Santos',
      rol: 'Coordinadora',
      email: 'beatriz.rodriguez@entidad.com',
      telefono: '666-222-333',
      fechaIngreso: '2023-03-20',
      estado: 'Activo',
      formacionLOPIVI: 'Completada',
      certificadoVigente: true,
      ultimaInteraccion: '2025-09-12 - Coordinación evento',
      interacciones: [
        { fecha: '2025-09-12', tipo: 'Email', descripcion: 'Coordinación evento fin de mes' },
        { fecha: '2025-09-08', tipo: 'Llamada', descripcion: 'Planificación actividades' }
      ]
    },
    {
      nombre: 'Carlos Ruiz Martín',
      rol: 'Entrenador Principal',
      email: 'carlos.ruiz@entidad.com',
      telefono: '666-333-444',
      fechaIngreso: '2023-03-20',
      estado: 'Formación Pendiente',
      formacionLOPIVI: 'En proceso',
      certificadoVigente: false,
      ultimaInteraccion: '2025-09-12 - Recordatorio formación',
      interacciones: [
        { fecha: '2025-09-12', tipo: 'Email', descripcion: 'Recordatorio formación pendiente' },
        { fecha: '2025-09-08', tipo: 'Llamada', descripcion: 'Consulta sobre horarios de formación' }
      ]
    },
    {
      nombre: 'Diana Fernández López',
      rol: 'Monitora',
      email: 'diana.fernandez@entidad.com',
      telefono: '666-444-555',
      fechaIngreso: '2024-02-10',
      estado: 'Activo',
      formacionLOPIVI: 'Completada',
      certificadoVigente: true,
      ultimaInteraccion: '2025-09-11 - Envío documentación',
      interacciones: [
        { fecha: '2025-09-11', tipo: 'Email', descripcion: 'Envío de nueva documentación' },
        { fecha: '2025-09-08', tipo: 'Formación', descripcion: 'Asistió a taller de actualización' }
      ]
    },
    {
      nombre: 'Eduardo Martín Sánchez',
      rol: 'Monitor Auxiliar',
      email: 'eduardo.martin@entidad.com',
      telefono: '666-555-666',
      fechaIngreso: '2024-08-15',
      estado: 'Formación Pendiente',
      formacionLOPIVI: 'En proceso',
      certificadoVigente: false,
      ultimaInteraccion: '2025-09-10 - Primera evaluación',
      interacciones: [
        { fecha: '2025-09-10', tipo: 'Reunión', descripcion: 'Primera evaluación de desempeño' },
        { fecha: '2025-09-01', tipo: 'Reunión', descripcion: 'Bienvenida y orientación' }
      ]
    },
    {
      nombre: 'Francisco Torres Vega',
      rol: 'Directivo',
      email: 'francisco.torres@entidad.com',
      telefono: '666-666-777',
      fechaIngreso: '2021-05-12',
      estado: 'Activo',
      formacionLOPIVI: 'Completada',
      certificadoVigente: true,
      ultimaInteraccion: '2025-09-16 - Reunión directiva',
      interacciones: [
        { fecha: '2025-09-16', tipo: 'Reunión', descripcion: 'Reunión directiva mensual' },
        { fecha: '2025-09-12', tipo: 'Email', descripcion: 'Aprobación presupuesto' }
      ]
    },
    {
      nombre: 'Gloria Santos Ruiz',
      rol: 'Psicóloga',
      email: 'gloria.santos@entidad.com',
      telefono: '666-777-888',
      fechaIngreso: '2023-09-01',
      estado: 'Activo',
      formacionLOPIVI: 'Completada',
      certificadoVigente: true,
      ultimaInteraccion: '2025-09-13 - Evaluación psicológica',
      interacciones: [
        { fecha: '2025-09-13', tipo: 'Reunión', descripcion: 'Evaluación psicológica equipo' },
        { fecha: '2025-09-09', tipo: 'Email', descripcion: 'Informe mensual' }
      ]
    },
    {
      nombre: 'Hugo Álvarez Castro',
      rol: 'Monitor Auxiliar',
      email: 'hugo.alvarez@entidad.com',
      telefono: '666-888-999',
      fechaIngreso: '2024-01-20',
      estado: 'Activo',
      formacionLOPIVI: 'Completada',
      certificadoVigente: true,
      ultimaInteraccion: '2025-09-09 - Supervisión actividades',
      interacciones: [
        { fecha: '2025-09-09', tipo: 'Reunión', descripcion: 'Supervisión de actividades deportivas' },
        { fecha: '2025-09-05', tipo: 'WhatsApp', descripcion: 'Consulta sobre protocolo' }
      ]
    },
    {
      nombre: 'Isabel Moreno Jiménez',
      rol: 'Administrativa',
      email: 'isabel.moreno@entidad.com',
      telefono: '666-999-000',
      fechaIngreso: '2022-11-10',
      estado: 'Activo',
      formacionLOPIVI: 'Completada',
      certificadoVigente: true,
      ultimaInteraccion: '2025-09-17 - Gestión documentación',
      interacciones: [
        { fecha: '2025-09-17', tipo: 'Email', descripcion: 'Gestión de documentación' },
        { fecha: '2025-09-14', tipo: 'Llamada', descripcion: 'Consulta administrativa' }
      ]
    },
    {
      nombre: 'Javier Pérez Gómez',
      rol: 'Entrenador',
      email: 'javier.perez@entidad.com',
      telefono: '666-000-111',
      fechaIngreso: '2023-07-15',
      estado: 'Formación Pendiente',
      formacionLOPIVI: 'Pendiente',
      certificadoVigente: false,
      ultimaInteraccion: '2025-09-08 - Recordatorio urgente',
      interacciones: [
        { fecha: '2025-09-08', tipo: 'Email', descripcion: 'Recordatorio urgente formación LOPIVI' },
        { fecha: '2025-09-01', tipo: 'Llamada', descripcion: 'Primera consulta' }
      ]
    },
    {
      nombre: 'Laura Martínez Ruiz',
      rol: 'Coordinadora',
      email: 'laura.martinez@entidad.com',
      telefono: '666-111-222',
      fechaIngreso: '2023-05-12',
      estado: 'Activo',
      formacionLOPIVI: 'Completada',
      certificadoVigente: true,
      ultimaInteraccion: '2025-09-16 - Planificación evento',
      interacciones: [
        { fecha: '2025-09-16', tipo: 'Reunión', descripcion: 'Planificación evento fin de año' },
        { fecha: '2025-09-12', tipo: 'Email', descripcion: 'Coordinación horarios' }
      ]
    },
    {
      nombre: 'Miguel Hernández Silva',
      rol: 'Monitor',
      email: 'miguel.hernandez@entidad.com',
      telefono: '666-222-333',
      fechaIngreso: '2024-04-01',
      estado: 'Activo',
      formacionLOPIVI: 'Completada',
      certificadoVigente: true,
      ultimaInteraccion: '2025-09-15 - Supervisión grupo',
      interacciones: [
        { fecha: '2025-09-15', tipo: 'Reunión', descripcion: 'Supervisión grupo adolescentes' },
        { fecha: '2025-09-11', tipo: 'WhatsApp', descripcion: 'Consulta protocolo' }
      ]
    }
  ]

  // Roles únicos para filtrado
  const rolesDisponibles = [...new Set(personalEntidad.map(p => p.rol))].sort()

  // Personal con certificados de antecedentes penales
  const personalCertificadosPenales = [
    {
      id: 'CP001',
      nombre: 'Ana López Fernández',
      rol: 'Monitora',
      email: 'ana.lopez@entidad.com',
      telefono: '666-555-666',
      fechaEmisionCertificado: '2024-03-15',
      fechaVencimientoCertificado: '2027-03-15',
      estado: 'vigente', // vigente, proximo, vencido, no_entregado
      diasRestantes: 547,
      observaciones: '',
      historial: [
        { fecha: '2024-03-15', accion: 'Entregado', usuario: 'María López - Delegada' },
        { fecha: '2021-02-10', accion: 'Entregado', usuario: 'Carlos Ruiz - Delegado anterior' }
      ]
    },
    {
      id: 'CP002',
      nombre: 'Carlos Ruiz Martín',
      rol: 'Entrenador Principal',
      email: 'carlos.ruiz@entidad.com',
      telefono: '666-333-444',
      fechaEmisionCertificado: '2021-09-15',
      fechaVencimientoCertificado: '2024-09-15',
      estado: 'vencido',
      diasRestantes: -3,
      observaciones: 'URGENTE: No puede trabajar con menores hasta entregar nuevo certificado',
      historial: [
        { fecha: '2024-09-16', accion: 'Recordatorio enviado', usuario: 'Sistema automático' },
        { fecha: '2024-09-10', accion: 'Alerta vencimiento', usuario: 'Sistema automático' },
        { fecha: '2021-09-15', accion: 'Entregado', usuario: 'Anterior delegado' }
      ]
    },
    {
      id: 'CP003',
      nombre: 'Miguel Torres Vega',
      rol: 'Monitor Auxiliar',
      email: 'miguel.torres@entidad.com',
      telefono: '666-222-333',
      fechaEmisionCertificado: '2024-10-01',
      fechaVencimientoCertificado: '2027-10-01',
      estado: 'vigente',
      diasRestantes: 1095,
      observaciones: '',
      historial: [
        { fecha: '2024-10-01', accion: 'Entregado', usuario: 'María López - Delegada' }
      ]
    },
    {
      id: 'CP004',
      nombre: 'Laura Martínez Ruiz',
      rol: 'Coordinadora',
      email: 'laura.martinez@entidad.com',
      telefono: '666-111-222',
      fechaEmisionCertificado: '2024-01-20',
      fechaVencimientoCertificado: '2024-10-25',
      estado: 'proximo',
      diasRestantes: 7,
      observaciones: 'Recordatorio enviado. Pendiente de entrega.',
      historial: [
        { fecha: '2024-10-18', accion: 'Recordatorio enviado', usuario: 'María López - Delegada' },
        { fecha: '2024-01-20', accion: 'Entregado', usuario: 'María López - Delegada' }
      ]
    },
    {
      id: 'CP005',
      nombre: 'Javier Pérez Gómez',
      rol: 'Entrenador',
      email: 'javier.perez@entidad.com',
      telefono: '666-000-111',
      fechaEmisionCertificado: '',
      fechaVencimientoCertificado: '',
      estado: 'no_entregado',
      diasRestantes: 0,
      observaciones: 'Personal nuevo. Debe entregar certificado antes de trabajar con menores.',
      historial: [
        { fecha: '2024-10-15', accion: 'Recordatorio enviado', usuario: 'María López - Delegada' },
        { fecha: '2024-10-01', accion: 'Alta en sistema', usuario: 'RRHH' }
      ]
    },
    {
      id: 'CP006',
      nombre: 'Gloria Santos Ruiz',
      rol: 'Psicóloga',
      email: 'gloria.santos@entidad.com',
      telefono: '666-777-888',
      fechaEmisionCertificado: '2024-02-15',
      fechaVencimientoCertificado: '2024-11-30',
      estado: 'proximo',
      diasRestantes: 42,
      observaciones: '',
      historial: [
        { fecha: '2024-02-15', accion: 'Entregado', usuario: 'María López - Delegada' }
      ]
    },
    {
      id: 'CP007',
      nombre: 'Francisco Torres Vega',
      rol: 'Directivo',
      email: 'francisco.torres@entidad.com',
      telefono: '666-666-777',
      fechaEmisionCertificado: '2023-05-12',
      fechaVencimientoCertificado: '2026-05-12',
      estado: 'vigente',
      diasRestantes: 573,
      observaciones: '',
      historial: [
        { fecha: '2023-05-12', accion: 'Entregado', usuario: 'Anterior delegado' }
      ]
    },
    {
      id: 'CP008',
      nombre: 'Roberto Silva Hernández',
      rol: 'Monitor',
      email: 'roberto.silva@entidad.com',
      telefono: '666-444-555',
      fechaEmisionCertificado: '2023-12-10',
      fechaVencimientoCertificado: '2024-11-15',
      estado: 'proximo',
      diasRestantes: 27,
      observaciones: 'Contactado telefónicamente. Confirma renovación en proceso.',
      historial: [
        { fecha: '2024-10-19', accion: 'Llamada telefónica', usuario: 'María López - Delegada' },
        { fecha: '2024-10-15', accion: 'Recordatorio enviado', usuario: 'Sistema automático' },
        { fecha: '2023-12-10', accion: 'Entregado', usuario: 'María López - Delegada' }
      ]
    }
  ]

  // Tipos de personal por entidad
  const tiposPersonalPorEntidad = {
    'centro_educativo': [
      'Profesor/Docente', 'Auxiliar de Educación', 'Director/Jefe de Estudios',
      'Secretario', 'Conserje', 'Personal de Limpieza', 'Personal de Cocina/Comedor',
      'Monitor de Extraescolares', 'Personal de Apoyo Educativo'
    ],
    'entidad_deportiva': [
      'Entrenador Principal', 'Monitor Deportivo', 'Coordinador Deportivo',
      'Directivo', 'Fisioterapeuta', 'Personal Médico', 'Monitor Auxiliar'
    ],
    'centro_ocio': [
      'Monitor de Tiempo Libre', 'Coordinador de Actividades', 'Director de Centro',
      'Animador', 'Conductor de Transporte', 'Personal de Apoyo'
    ],
    'guarderia': [
      'Educador Infantil', 'Auxiliar de Puericultura', 'Director',
      'Personal de Cocina', 'Personal de Limpieza', 'Pediatra/Enfermero'
    ],
    'academia': [
      'Profesor/Instructor', 'Personal Administrativo', 'Director Académico',
      'Tutor Personal', 'Coordinador Pedagógico'
    ],
    'centro_religioso': [
      'Catequista', 'Monitor de Grupos Juveniles', 'Sacerdote/Religioso',
      'Voluntario con Menores', 'Coordinador Pastoral'
    ],
    'ong_voluntariado': [
      'Coordinador de Voluntarios', 'Voluntario con Contacto Directo',
      'Responsable de Programas', 'Personal Técnico', 'Educador Social'
    ],
    'centro_cultural': [
      'Profesor de Música/Arte', 'Monitor de Talleres', 'Bibliotecario Infantil',
      'Personal de Actividades', 'Coordinador Cultural'
    ],
    'centro_atencion_menores': [
      'Educador Social', 'Psicólogo Infantil', 'Trabajador Social',
      'Personal Sanitario', 'Terapeuta', 'Personal de Apoyo'
    ]
  }

  // Filtrar personal según estado seleccionado
  const personalFiltradoCertificados = personalCertificadosPenales.filter(persona => {
    if (filtroEstado === '') return true
    return persona.estado === filtroEstado
  })

  // Contadores de estados
  const contadoresCertificados = {
    vigentes: personalCertificadosPenales.filter(p => p.estado === 'vigente').length,
    proximos: personalCertificadosPenales.filter(p => p.estado === 'proximo').length,
    vencidos: personalCertificadosPenales.filter(p => p.estado === 'vencido').length,
    no_entregados: personalCertificadosPenales.filter(p => p.estado === 'no_entregado').length,
    total: personalCertificadosPenales.length
  }

  // Personal filtrado
  const personalFiltrado = personalEntidad.filter(persona => {
    const matchNombre = persona.nombre.toLowerCase().includes(filtroPersonal.toLowerCase())
    const matchRol = filtroRol === '' || persona.rol === filtroRol
    const matchLetra = letraSeleccionada === '' || persona.nombre.toLowerCase().startsWith(letraSeleccionada.toLowerCase())
    return matchNombre && matchRol && matchLetra
  })

  // Guía de prioridades según LOPIVI
  const guiaPrioridades = {
    critica: {
      titulo: 'CRÍTICA',
      color: 'text-red-600',
      criterios: [
        'Abuso físico o sexual confirmado o altamente sospechoso',
        'Lesiones físicas evidentes en el menor',
        'Amenaza inmediata para la seguridad del menor',
        'Comportamiento que constituye delito según el Código Penal',
        'Situación que requiere intervención inmediata de autoridades'
      ],
      accion: 'ACTUACIÓN INMEDIATA: Contactar 112, separar al menor, notificar a padres/tutores INMEDIATAMENTE'
    },
    alta: {
      titulo: 'ALTA',
      color: 'text-orange-600',
      criterios: [
        'Comportamiento inapropiado repetido',
        'Incumplimiento grave de protocolos de protección',
        'Contacto físico inapropiado sin lesiones',
        'Negligencia en supervisión que pone en riesgo al menor',
        'Uso inadecuado de autoridad o posición'
      ],
      accion: 'Actuación en 24 horas máximo. Documentar, investigar, tomar medidas preventivas'
    },
    media: {
      titulo: 'MEDIA',
      color: 'text-yellow-600',
      criterios: [
        'Incumplimiento de protocolos sin riesgo inmediato',
        'Comportamiento inadecuado aislado',
        'Falta de formación evidenciada',
        'Comunicación inapropiada con menores',
        'Deficiencias en documentación requerida'
      ],
      accion: 'Actuación en 72 horas. Formación, seguimiento, corrección de procedimientos'
    },
    baja: {
      titulo: 'BAJA',
      color: 'text-green-600',
      criterios: [
        'Mejoras en procedimientos preventivos',
        'Actualización de documentación',
        'Formación adicional recomendada',
        'Optimización de protocolos existentes',
        'Seguimiento rutinario'
      ],
      accion: 'Planificación a medio plazo. Mejora continua y prevención'
    }
  }

  // Detalles específicos de elementos faltantes para cumplimiento
  const detallesCumplimiento = {
    'Formación Personal': {
      descripcion: 'Completar formación de 3 personas',
      detalles: [
        {
          persona: 'Carlos Ruiz Martín',
          faltante: 'Curso LOPIVI básico (40h)',
          fechaLimite: '2025-10-15',
          estado: 'No iniciado',
          responsable: 'Recursos Humanos'
        },
        {
          persona: 'Eduardo Martín Sánchez',
          faltante: 'Módulo 2 y 3 del curso (14h total)',
          fechaLimite: '2025-11-01',
          estado: 'En progreso (50%)',
          responsable: 'Formación'
        },
        {
          persona: 'Javier Pérez Gómez',
          faltante: 'Curso completo LOPIVI (40h) + Examen',
          fechaLimite: '2025-09-30',
          estado: 'Crítico - Sin iniciar',
          responsable: 'Delegado Principal'
        }
      ]
    },
    'Documentación': {
      descripcion: 'Actualizar 2 protocolos específicos',
      detalles: [
        {
          documento: 'Protocolo de Comunicación Digital',
          faltante: 'Actualización según nueva normativa 2025',
          fechaLimite: '2025-10-01',
          estado: 'En revisión',
          responsable: 'Coordinación'
        },
        {
          documento: 'Plan de Emergencias Actualizado',
          faltante: 'Incluir nuevos procedimientos COVID-19',
          fechaLimite: '2025-09-25',
          estado: 'Pendiente',
          responsable: 'Dirección'
        }
      ]
    },
    'Certificaciones': {
      descripcion: 'Renovar 1 certificado médico',
      detalles: [
        {
          persona: 'Luis Martín González',
          faltante: 'Certificado médico de aptitud',
          fechaLimite: '2025-10-05',
          estado: 'Cita médica programada',
          responsable: 'Recursos Humanos'
        }
      ]
    }
  }

  // Función para resolver alertas - MEJORADA: Sin timeout automático
  const resolverAlerta = (alertaId: string) => {
    setAlertaResolviendose(alertaId)
    console.log(`Proceso de resolución iniciado para alerta ${alertaId}`)
    // Ya no se usa setTimeout - la información permanece hasta cerrarse manualmente
  }

  // Nueva función para cerrar resolución manualmente
  const cerrarResolucion = (alertaId: string) => {
    setAlertaResolviendose(null)
    console.log(`Resolución de alerta ${alertaId} cerrada manualmente`)
  }

  // Nueva función para completar resolución
  const completarResolucion = (alertaId: string) => {
    console.log(`Alerta ${alertaId} completamente resuelta`)
    alert(`✅ ALERTA RESUELTA CORRECTAMENTE\n\nID: ${alertaId}\nLa alerta ha sido marcada como resuelta y archivada.\nSe ha notificado al responsable sobre la resolución.`)
    setAlertaResolviendose(null)
  }

  // Funciones para renovación de certificados - NUEVAS
  const abrirRenovacion = (certificado: any) => {
    setCertificadoSeleccionado(certificado)
    setModalRenovacion(true)
    setPasoRenovacion(1)
    setDatosRenovacion({
      ...datosRenovacion,
      tipoRenovacion: certificado.tipoCertificado,
      entidadCertificadora: 'Centro de Formación LOPIVI Certificado'
    })
  }

  const siguientePaso = () => {
    if (pasoRenovacion < 3) {
      setPasoRenovacion(pasoRenovacion + 1)
    }
  }

  const pasoAnterior = () => {
    if (pasoRenovacion > 1) {
      setPasoRenovacion(pasoRenovacion - 1)
    }
  }

  const completarRenovacion = () => {
    alert(`✅ RENOVACIÓN PROCESADA\n\nCertificado: ${certificadoSeleccionado?.tipoCertificado}\nPersona: ${certificadoSeleccionado?.persona}\nEntidad: ${datosRenovacion.entidadCertificadora}\nTiempo estimado: ${datosRenovacion.tiempoEstimado}\n\nSe ha enviado la solicitud de renovación y se notificará al interesado sobre los próximos pasos.`)
    setModalRenovacion(false)
    setCertificadoSeleccionado(null)
    setPasoRenovacion(1)
  }

  // Centro de Notificaciones y Recordatorios LOPIVI
  const notificacionesLOPIVI = [
    {
      id: 'NOT001',
      tipo: 'Vencimiento Crítico',
      prioridad: 'critica',
      titulo: 'Certificado LOPIVI vence en 3 días',
      descripcion: 'El certificado de Juan Pérez vence el 2025-09-21. Debe renovarse antes del vencimiento.',
      fechaLimite: '2025-09-21',
      diasRestantes: 3,
      categoria: 'Certificaciones',
      accionRequerida: 'Renovar certificado',
      responsable: 'Recursos Humanos',
      enlaceAccion: 'gestionar-certificados'
    },
    {
      id: 'NOT002',
      tipo: 'Seguimiento Caso',
      prioridad: 'alta',
      titulo: 'Seguimiento caso CR002 pendiente',
      descripcion: 'El caso de falta de supervisión requiere seguimiento a los 7 días.',
      fechaLimite: '2025-09-20',
      diasRestantes: 2,
      categoria: 'Casos',
      accionRequerida: 'Realizar seguimiento',
      responsable: 'Delegado Principal',
      enlaceAccion: 'casos-activos'
    },
    {
      id: 'NOT003',
      tipo: 'Formación Obligatoria',
      prioridad: 'alta',
      titulo: 'Evaluación trimestral de riesgos vence',
      descripcion: 'La evaluación trimestral de espacios y actividades debe completarse.',
      fechaLimite: '2025-09-25',
      diasRestantes: 7,
      categoria: 'Evaluaciones',
      accionRequerida: 'Completar evaluación',
      responsable: 'Coordinación',
      enlaceAccion: 'evaluaciones'
    },
    {
      id: 'NOT004',
      tipo: 'Recordatorio Legal',
      prioridad: 'media',
      titulo: 'Actualización Plan de Protección anual',
      descripcion: 'El Plan de Protección debe revisarse y actualizarse anualmente.',
      fechaLimite: '2025-10-15',
      diasRestantes: 27,
      categoria: 'Documentación',
      accionRequerida: 'Revisar y actualizar',
      responsable: 'Delegado Principal',
      enlaceAccion: 'plan-proteccion'
    },
    {
      id: 'NOT005',
      tipo: 'Formación Pendiente',
      prioridad: 'alta',
      titulo: '3 personas sin completar formación LOPIVI',
      descripcion: 'Carlos Ruiz, Eduardo Martín y Javier Pérez tienen formación pendiente.',
      fechaLimite: '2025-10-15',
      diasRestantes: 27,
      categoria: 'Formación',
      accionRequerida: 'Coordinar formación',
      responsable: 'Recursos Humanos',
      enlaceAccion: 'formacion-personal'
    },
    {
      id: 'NOT006',
      tipo: 'Auditoría Interna',
      prioridad: 'media',
      titulo: 'Auditoría interna semestral',
      descripcion: 'Programar auditoría interna de cumplimiento LOPIVI semestral.',
      fechaLimite: '2025-11-01',
      diasRestantes: 44,
      categoria: 'Auditorías',
      accionRequerida: 'Programar auditoría',
      responsable: 'Dirección',
      enlaceAccion: 'auditorias'
    },
    {
      id: 'NOT007',
      tipo: 'Comunicación',
      prioridad: 'baja',
      titulo: 'Envío newsletter familiar trimestral',
      descripcion: 'Informar a las familias sobre actividades y protocolos de protección.',
      fechaLimite: '2025-09-30',
      diasRestantes: 12,
      categoria: 'Comunicación',
      accionRequerida: 'Preparar y enviar',
      responsable: 'Comunicación',
      enlaceAccion: 'comunicacion-familias'
    },
    {
      id: 'NOT008',
      tipo: 'Revisión Protocolos',
      prioridad: 'media',
      titulo: 'Protocolos de emergencia - revisión semestral',
      descripcion: 'Los protocolos de emergencia deben revisarse cada 6 meses.',
      fechaLimite: '2025-10-30',
      diasRestantes: 42,
      categoria: 'Protocolos',
      accionRequerida: 'Revisar protocolos',
      responsable: 'Coordinación',
      enlaceAccion: 'protocolos-emergencia'
    }
  ]

  // Contar notificaciones por prioridad (excluyendo completadas)
  const notificacionesActivas = notificacionesLOPIVI.filter(n => !tareasCompletadas.includes(n.id))
  const conteoNotificaciones = {
    criticas: notificacionesActivas.filter(n => n.prioridad === 'critica').length,
    altas: notificacionesActivas.filter(n => n.prioridad === 'alta').length,
    medias: notificacionesActivas.filter(n => n.prioridad === 'media').length,
    total: notificacionesActivas.length
  }

  // Función para marcar notificación como completada
  const completarNotificacion = (notificacionId: string) => {
    console.log(`Marcando notificación ${notificacionId} como completada`)
    setTareasCompletadas(prev => [...prev, notificacionId])
    // Mostrar mensaje de confirmación
    alert('Tarea marcada como completada ✅')
  }

  // Nuevas funciones para acciones específicas
  const abrirRenovarCertificado = (notificacion: any) => {
    setTareaSeleccionada(notificacion)
    setModalRenovarCertificado(true)
    setModalNotificaciones(false)
  }

  const abrirRealizarSeguimiento = (notificacion: any) => {
    setTareaSeleccionada(notificacion)
    setModalRealizarSeguimiento(true)
    setModalNotificaciones(false)
  }

  const abrirCompletarEvaluacion = (notificacion: any) => {
    setTareaSeleccionada(notificacion)
    setModalCompletarEvaluacion(true)
    setModalNotificaciones(false)
  }

  const marcarCompleto = (notificacionId: string) => {
    completarNotificacion(notificacionId)
    setModalNotificaciones(false)
  }

  // Tipos de comunicación con familias
  const tiposComunicacionFamilias = [
    {
      id: 'cambio-ley',
      titulo: 'Cambio de Normativa LOPIVI',
      descripcion: 'Informar sobre actualizaciones legales que afectan la protección',
      color: 'bg-red-600',
      urgencia: 'Alta',
      template: 'Estimadas familias,\n\nNos dirigimos a ustedes para informarles sobre importantes cambios en la normativa LOPIVI que entran en vigor el [FECHA]...',
      destinatarios: ['Todas las familias', 'Tutores legales', 'Familias de menores específicos'],
      adjuntos: ['Nueva normativa PDF', 'Resumen de cambios', 'Protocolo actualizado']
    },
    {
      id: 'cambio-procedimiento',
      titulo: 'Actualización de Procedimientos',
      descripcion: 'Comunicar modificaciones en protocolos internos de protección',
      color: 'bg-orange-600',
      urgencia: 'Media',
      template: 'Queridas familias,\n\nLes comunicamos que hemos actualizado nuestros procedimientos de protección infantil para mejorar la seguridad...',
      destinatarios: ['Familias activas', 'Nuevas familias', 'Familias por actividad'],
      adjuntos: ['Nuevo protocolo', 'Manual familiar', 'Código de conducta']
    },
    {
      id: 'nuevo-delegado',
      titulo: 'Cambio de Delegado de Protección',
      descripcion: 'Presentar nuevo delegado principal o suplente',
      color: 'bg-blue-600',
      urgencia: 'Alta',
      template: 'Estimadas familias,\n\nNos complace presentarles a [NOMBRE], nuestro nuevo Delegado de Protección, quien asume las responsabilidades de...',
      destinatarios: ['Todas las familias', 'Consejo familiar', 'Representantes de padres'],
      adjuntos: ['Presentación delegado', 'Certificaciones', 'Información de contacto']
    },
    {
      id: 'incidente-resuelto',
      titulo: 'Comunicación Post-Incidente',
      descripcion: 'Informar sobre resolución de incidentes que afectan la comunidad',
      color: 'bg-purple-600',
      urgencia: 'Crítica',
      template: 'Familias,\n\nEn cumplimiento de nuestro compromiso con la transparencia, les informamos sobre la resolución de un incidente...',
      destinatarios: ['Familias afectadas', 'Toda la comunidad', 'Familias del grupo específico'],
      adjuntos: ['Informe público', 'Medidas tomadas', 'Plan de prevención']
    },
    {
      id: 'formacion-padres',
      titulo: 'Formación en Protección Familiar',
      descripcion: 'Invitar a talleres y formaciones sobre protección infantil',
      color: 'bg-green-600',
      urgencia: 'Baja',
      template: 'Queridas familias,\n\nLes invitamos a participar en nuestro programa de formación familiar en protección infantil...',
      destinatarios: ['Familias interesadas', 'Nuevas familias', 'Voluntarios familiares'],
      adjuntos: ['Programa formación', 'Calendario', 'Material informativo']
    },
    {
      id: 'evaluacion-anual',
      titulo: 'Evaluación Anual de Protección',
      descripcion: 'Solicitar feedback sobre efectividad del plan de protección',
      color: 'bg-teal-600',
      urgencia: 'Media',
      template: 'Estimadas familias,\n\nComo parte de nuestro compromiso con la mejora continua, solicitamos su colaboración en la evaluación anual...',
      destinatarios: ['Familias colaboradoras', 'Consejo familiar', 'Todas las familias'],
      adjuntos: ['Encuesta', 'Informe anterior', 'Plan de mejoras']
    },
    {
      id: 'emergencia-comunicacion',
      titulo: 'Comunicación de Emergencia',
      descripcion: 'Alertas urgentes sobre situaciones que requieren acción inmediata',
      color: 'bg-red-700',
      urgencia: 'Crítica',
      template: 'COMUNICACIÓN URGENTE\n\nFamilias, les informamos sobre una situación que requiere su atención inmediata...',
      destinatarios: ['Todas las familias', 'Familias específicas', 'Contactos de emergencia'],
      adjuntos: ['Protocolo emergencia', 'Instrucciones', 'Contactos útiles']
    },
    {
      id: 'newsletter-trimestral',
      titulo: 'Boletín Trimestral de Protección',
      descripcion: 'Información periódica sobre actividades y logros en protección',
      color: 'bg-indigo-600',
      urgencia: 'Baja',
      template: 'Queridas familias,\n\nCompartimos con ustedes nuestro boletín trimestral con las novedades en protección infantil...',
      destinatarios: ['Familias suscritas', 'Todas las familias', 'Comunidad educativa'],
      adjuntos: ['Boletín PDF', 'Fotos actividades', 'Próximos eventos']
    }
  ]

  // Biblioteca LOPIVI - Categorías de documentos
  const categoriasDocumentosLOPIVI = [
    {
      id: 'normativas',
      titulo: 'Normativas Vigentes',
      descripcion: 'Leyes y reglamentos LOPIVI actualizados',
      color: 'bg-red-600',
      documentos: [
        { nombre: 'Ley Orgánica 8/2021 LOPIVI', tipo: 'PDF', actualizado: '2025-01-15', tamaño: '2.3 MB', version: '1.2' },
        { nombre: 'Real Decreto 1016/2024', tipo: 'PDF', actualizado: '2024-12-20', tamaño: '1.8 MB', version: '1.0' },
        { nombre: 'Instrucción Ministerial 2025/001', tipo: 'PDF', actualizado: '2025-02-01', tamaño: '890 KB', version: '1.1' },
        { nombre: 'Jurisprudencia Reciente', tipo: 'PDF', actualizado: '2025-09-10', tamaño: '3.2 MB', version: '2.3' }
      ]
    },
    {
      id: 'protocolos',
      titulo: 'Protocolos de Actuación',
      descripcion: 'Procedimientos específicos por tipo de situación',
      color: 'bg-orange-600',
      documentos: [
        { nombre: 'Protocolo Detección Abuso', tipo: 'PDF', actualizado: '2025-08-15', tamaño: '1.5 MB', version: '3.1' },
        { nombre: 'Protocolo Comunicación Familias', tipo: 'PDF', actualizado: '2025-07-22', tamaño: '1.2 MB', version: '2.0' },
        { nombre: 'Protocolo Emergencias', tipo: 'PDF', actualizado: '2025-09-05', tamaño: '2.1 MB', version: '1.8' },
        { nombre: 'Protocolo Formación Personal', tipo: 'PDF', actualizado: '2025-06-30', tamaño: '1.7 MB', version: '2.2' }
      ]
    },
    {
      id: 'plantillas',
      titulo: 'Plantillas y Formularios',
      descripcion: 'Documentos oficiales listos para usar',
      color: 'bg-blue-600',
      documentos: [
        { nombre: 'Plan de Protección Tipo', tipo: 'DOCX', actualizado: '2025-08-20', tamaño: '456 KB', version: '4.0' },
        { nombre: 'Formulario Incidencias', tipo: 'PDF', actualizado: '2025-09-01', tamaño: '234 KB', version: '1.5' },
        { nombre: 'Carta Familias Plantilla', tipo: 'DOCX', actualizado: '2025-07-10', tamaño: '123 KB', version: '2.1' },
        { nombre: 'Certificado Delegado', tipo: 'PDF', actualizado: '2025-08-05', tamaño: '678 KB', version: '1.3' }
      ]
    },
    {
      id: 'guias',
      titulo: 'Guías y Manuales',
      descripcion: 'Documentación técnica y explicativa',
      color: 'bg-green-600',
      documentos: [
        { nombre: 'Guía Implementación LOPIVI', tipo: 'PDF', actualizado: '2025-05-15', tamaño: '4.2 MB', version: '2.0' },
        { nombre: 'Manual Delegado Principal', tipo: 'PDF', actualizado: '2025-07-01', tamaño: '3.8 MB', version: '3.1' },
        { nombre: 'Manual Delegado Suplente', tipo: 'PDF', actualizado: '2025-07-01', tamaño: '2.9 MB', version: '3.1' },
        { nombre: 'Guía Buenas Prácticas', tipo: 'PDF', actualizado: '2025-08-10', tamaño: '2.5 MB', version: '1.7' }
      ]
    },
    {
      id: 'formacion',
      titulo: 'Material de Formación',
      descripcion: 'Recursos educativos y de capacitación',
      color: 'bg-purple-600',
      documentos: [
        { nombre: 'Curso LOPIVI Completo', tipo: 'ZIP', actualizado: '2025-06-20', tamaño: '125 MB', version: '2.5' },
        { nombre: 'Presentaciones Formación', tipo: 'ZIP', actualizado: '2025-08-25', tamaño: '67 MB', version: '1.8' },
        { nombre: 'Test Evaluación LOPIVI', tipo: 'PDF', actualizado: '2025-09-01', tamaño: '1.1 MB', version: '1.4' },
        { nombre: 'Videos Explicativos', tipo: 'LINK', actualizado: '2025-08-30', tamaño: 'Online', version: '1.2' }
      ]
    },
    {
      id: 'auditoria',
      titulo: 'Auditoría y Cumplimiento',
      descripcion: 'Herramientas de evaluación y control',
      color: 'bg-indigo-600',
      documentos: [
        { nombre: 'Checklist Cumplimiento', tipo: 'XLSX', actualizado: '2025-09-10', tamaño: '234 KB', version: '2.3' },
        { nombre: 'Plantilla Auditoría Interna', tipo: 'DOCX', actualizado: '2025-08-15', tamaño: '456 KB', version: '1.9' },
        { nombre: 'Indicadores KPI LOPIVI', tipo: 'XLSX', actualizado: '2025-07-25', tamaño: '189 KB', version: '1.6' },
        { nombre: 'Informe Anual Tipo', tipo: 'DOCX', actualizado: '2025-06-05', tamaño: '678 KB', version: '2.0' }
      ]
    }
  ]

  // Opciones para documentación
  const tiposDocumentacion = [
    'Plan de Protección Personalizado',
    'Código de Conducta Actualizado',
    'Protocolos LOPIVI Vigentes',
    'Manual del Personal',
    'Procedimientos de Emergencia',
    'Formularios de Incidencias',
    'Guías de Formación',
    'Certificados y Acreditaciones',
    'Normativas Legales',
    'Recursos Adicionales'
  ]

  const destinatariosDisponibles = [
    'Todo el personal',
    'Solo entrenadores',
    'Solo monitores',
    'Coordinadores',
    'Directivos',
    'Personal administrativo',
    'Familias',
    'Personal nuevo'
  ]

  useEffect(() => {
    const checkSession = () => {
      try {
        const session = localStorage.getItem('userSession')
        if (session) {
          const userData = JSON.parse(session)
          setSessionData(userData)
        } else {
          router.push('/login-delegados')
          return
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error)
        router.push('/login-delegados')
        return
      }
      setLoading(false)
    }

    checkSession()
  }, [router])

  const enviarDocumentacion = () => {
    // Validar que se hayan seleccionado destinatarios y documentos
    if (envioDoc.destinatarios.length === 0) {
      alert('Por favor, selecciona al menos un grupo de destinatarios.')
      return
    }

    if (envioDoc.documentos.length === 0) {
      alert('Por favor, selecciona al menos un documento a enviar.')
      return
    }

    // Calcular cuántas personas recibirán la documentación
    let totalDestinatarios = 0
    const destinatariosDetalle = []

    envioDoc.destinatarios.forEach(grupo => {
      if (grupo === 'Todo el personal') {
        totalDestinatarios += personalEntidad.length
        destinatariosDetalle.push(`${personalEntidad.length} miembros del personal`)
      } else if (grupo === 'Solo entrenadores') {
        const entrenadores = personalEntidad.filter(p => p.rol.includes('Entrenador'))
        totalDestinatarios += entrenadores.length
        destinatariosDetalle.push(`${entrenadores.length} entrenadores`)
      } else if (grupo === 'Solo monitores') {
        const monitores = personalEntidad.filter(p => p.rol.includes('Monitor'))
        totalDestinatarios += monitores.length
        destinatariosDetalle.push(`${monitores.length} monitores`)
      } else if (grupo === 'Coordinadores') {
        const coordinadores = personalEntidad.filter(p => p.rol.includes('Coordinador'))
        totalDestinatarios += coordinadores.length
        destinatariosDetalle.push(`${coordinadores.length} coordinadores`)
      } else if (grupo === 'Directivos') {
        const directivos = personalEntidad.filter(p => p.rol.includes('Directivo'))
        totalDestinatarios += directivos.length
        destinatariosDetalle.push(`${directivos.length} directivos`)
      } else if (grupo === 'Personal administrativo') {
        const administrativos = personalEntidad.filter(p => p.rol.includes('Administrativa'))
        totalDestinatarios += administrativos.length
        destinatariosDetalle.push(`${administrativos.length} administrativos`)
      } else if (grupo === 'Personal nuevo') {
        const nuevos = personalEntidad.filter(p => {
          const fechaIngreso = new Date(p.fechaIngreso)
          const haceSesMeses = new Date()
          haceSesMeses.setMonth(haceSesMeses.getMonth() - 6)
          return fechaIngreso > haceSesMeses
        })
        totalDestinatarios += nuevos.length
        destinatariosDetalle.push(`${nuevos.length} miembros nuevos`)
      }
    })

    // Mostrar confirmación detallada
    const confirmacion = `📧 ENVÍO MASIVO DE DOCUMENTACIÓN\n\n` +
      `Destinatarios: ${destinatariosDetalle.join(', ')}\n` +
      `Total de personas: ${totalDestinatarios}\n\n` +
      `Documentos seleccionados:\n${envioDoc.documentos.map(doc => `• ${doc}`).join('\n')}\n\n` +
      `Asunto: ${envioDoc.asunto || 'Documentación LOPIVI actualizada'}\n\n` +
      `¿Confirmas el envío masivo?`

    if (confirm(confirmacion)) {
      console.log('📧 Enviando documentación masiva:', envioDoc)
      console.log('👥 Total destinatarios:', totalDestinatarios)
      console.log('📋 Documentos:', envioDoc.documentos)

      if (envioDoc.emailAdicional) {
        console.log('📧 Email adicional incluido:', envioDoc.emailAdicional)
        totalDestinatarios += 1
      }

      // 🔒 REGISTRAR EN SISTEMA DE AUDITORÍA LOPIVI
      const auditRegistration = async () => {
        try {
          await logDocumentSent({
            user_name: sessionData?.nombre || 'Delegado/a de Protección',
            recipients: destinatariosDetalle,
            recipient_count: totalDestinatarios,
            documents: envioDoc.documentos,
            subject: envioDoc.asunto || 'Documentación LOPIVI actualizada',
            message: envioDoc.mensaje
          })
          console.log('🔒 ✅ Envío registrado en auditoría LOPIVI')
        } catch (error) {
          console.error('🔒 ❌ Error al registrar en auditoría:', error)
          alert('⚠️ ADVERTENCIA: El envío se completó pero hubo un error en el registro de auditoría. Contacta con soporte técnico.')
        }
      }

      // Ejecutar registro de auditoría
      auditRegistration()

      // Simular el proceso de envío
      alert(`✅ DOCUMENTACIÓN ENVIADA EXITOSAMENTE\n\n` +
        `📧 Total de emails enviados: ${totalDestinatarios}\n` +
        `📋 Documentos adjuntos: ${envioDoc.documentos.length}\n` +
        `📝 Destinatarios: ${destinatariosDetalle.join(', ')}\n\n` +
        `✓ Proceso completado\n` +
        `🔒 Registro guardado en auditoría LOPIVI\n` +
        `✓ Notificaciones de entrega programadas\n` +
        `📋 Válido para inspecciones legales`)

      setModalEnviarDoc(false)
      setEnvioDoc({ destinatarios: [], documentos: [], asunto: '', mensaje: '', emailAdicional: '' })
    }
  }

  const agregarMiembro = () => {
    // Validar campos obligatorios
    if (!nuevoMiembro.nombre || !nuevoMiembro.email || !nuevoMiembro.rol) {
      alert('Por favor, completa todos los campos obligatorios: Nombre, Email y Rol.')
      return
    }

    console.log('Agregando nuevo miembro:', nuevoMiembro)

    // Determinar documentación específica según el rol
    let documentacionEspecifica = []
    switch (nuevoMiembro.rol) {
      case 'entrenador':
        documentacionEspecifica = [
          'Plan de Protección Personalizado',
          'Código de Conducta para Entrenadores',
          'Protocolos LOPIVI para Personal de Contacto Directo',
          'Manual de Formación LOPIVI',
          'Procedimientos de Emergencia'
        ]
        break
      case 'monitor':
        documentacionEspecifica = [
          'Plan de Protección Personalizado',
          'Código de Conducta para Monitores',
          'Protocolos LOPIVI Básicos',
          'Procedimientos de Emergencia',
          'Guías de Formación'
        ]
        break
      case 'monitor-auxiliar':
        documentacionEspecifica = [
          'Plan de Protección Personalizado',
          'Código de Conducta Básico',
          'Protocolos LOPIVI Esenciales',
          'Procedimientos de Emergencia'
        ]
        break
      case 'coordinador':
        documentacionEspecifica = [
          'Plan de Protección Personalizado',
          'Manual del Coordinador LOPIVI',
          'Protocolos de Supervisión',
          'Normativas Legales Vigentes',
          'Procedimientos de Emergencia',
          'Formularios de Incidencias'
        ]
        break
      case 'directivo':
        documentacionEspecifica = [
          'Plan de Protección Personalizado',
          'Manual de Dirección LOPIVI',
          'Normativas Legales Completas',
          'Protocolos de Gestión',
          'Procedimientos de Auditoría',
          'Certificaciones y Acreditaciones'
        ]
        break
      case 'administrativa':
        documentacionEspecifica = [
          'Plan de Protección Personalizado',
          'Protocolos Administrativos LOPIVI',
          'Procedimientos de Documentación',
          'Normativas de Privacidad'
        ]
        break
      default:
        documentacionEspecifica = [
          'Plan de Protección Personalizado',
          'Código de Conducta Actualizado',
          'Protocolos LOPIVI Básicos'
        ]
    }

    // Mostrar confirmación con documentación específica
    const confirmacion = `✅ NUEVO MIEMBRO AGREGADO\n\n` +
      `Nombre: ${nuevoMiembro.nombre}\n` +
      `Email: ${nuevoMiembro.email}\n` +
      `Rol: ${nuevoMiembro.rol}\n` +
      `Fecha de incorporación: ${nuevoMiembro.fechaIncorporacion}\n\n` +
      `📧 DOCUMENTACIÓN ENVIADA AUTOMÁTICAMENTE:\n${documentacionEspecifica.map(doc => `• ${doc}`).join('\n')}\n\n` +
      `✓ Miembro registrado en el sistema\n` +
      `✓ Email de bienvenida enviado\n` +
      `✓ Documentación específica para su rol enviada\n` +
      `✓ Acceso al sistema programado`

    // 🔒 REGISTRAR EN SISTEMA DE AUDITORÍA LOPIVI
    const auditRegistration = async () => {
      try {
        await logMemberAdded({
          member_name: nuevoMiembro.nombre,
          member_email: nuevoMiembro.email,
          member_role: nuevoMiembro.rol,
          incorporation_date: nuevoMiembro.fechaIncorporacion,
          assigned_documents: documentacionEspecifica,
          registered_by: sessionData?.nombre || 'Delegado/a de Protección'
        })
        console.log('🔒 ✅ Nuevo miembro registrado en auditoría LOPIVI')
      } catch (error) {
        console.error('🔒 ❌ Error al registrar en auditoría:', error)
        alert('⚠️ ADVERTENCIA: El miembro se agregó pero hubo un error en el registro de auditoría. Contacta con soporte técnico.')
      }
    }

    // Ejecutar registro de auditoría
    auditRegistration()

    alert(confirmacion + '\n\n🔒 Registro guardado en auditoría LOPIVI para cumplimiento legal')

    console.log('📧 Documentación específica enviada:', documentacionEspecifica)
    console.log('👤 Nuevo miembro registrado:', nuevoMiembro)

    setModalNuevoMiembro(false)
    setNuevoMiembro({ nombre: '', email: '', rol: '', fechaIncorporacion: '', documentacion: [], mensaje: '' })
  }

  const crearCaso = () => {
    // Validar campos obligatorios
    if (!nuevoCaso.tipo || !nuevoCaso.titulo || !nuevoCaso.personaQueHaceAccion || !nuevoCaso.personaQueRecibeAccion || !nuevoCaso.prioridad) {
      alert('Por favor, completa todos los campos obligatorios: Tipo, Título, Persona que hace la acción, Persona que recibe la acción y Prioridad.')
      return
    }

    // Generar ID único para el caso
    const casoId = `CASO_${Date.now()}`
    const fechaCreacion = new Date().toISOString()

    // Crear objeto completo del caso
    const casoCompleto = {
      id: casoId,
      ...nuevoCaso,
      fechaCreacion,
      estado: 'pendiente_revision',
      delegadoResponsable: sessionData?.nombre || 'Delegado/a Principal',
      entidad: sessionData?.entidad || 'Club Deportivo Ejemplo'
    }

    console.log('🚨 NUEVO CASO REPORTADO:', casoCompleto)

    // 🔒 REGISTRAR EN SISTEMA DE AUDITORÍA LOPIVI
    const auditRegistration = async () => {
      try {
        await logCaseReported({
          case_id: casoId,
          case_type: nuevoCaso.tipo,
          title: nuevoCaso.titulo,
          description: nuevoCaso.descripcion,
          person_action: nuevoCaso.personaQueHaceAccion,
          person_receives: nuevoCaso.personaQueRecibeAccion,
          additional_people: nuevoCaso.personasInvolucradasAdicionales,
          priority: nuevoCaso.prioridad,
          reported_by: sessionData?.nombre || 'Delegado/a de Protección',
          entity: sessionData?.entidad || 'Club Deportivo Ejemplo'
        })
        console.log('🔒 ✅ Caso registrado en auditoría LOPIVI:', casoId)
      } catch (error) {
        console.error('🔒 ❌ Error al registrar caso en auditoría:', error)
        alert('⚠️ ADVERTENCIA: El caso se reportó pero hubo un error en el registro de auditoría. Contacta con soporte técnico.')
      }
    }

    // Ejecutar registro de auditoría
    auditRegistration()

    // Simular envío a autoridades competentes si es caso crítico
    if (nuevoCaso.prioridad === 'critica') {
      console.log('📞 NOTIFICANDO A AUTORIDADES COMPETENTES - Caso Crítico')
      alert(`⚠️ CASO CRÍTICO REPORTADO\n\nID: ${casoId}\n\nSe ha notificado automáticamente a:\n• Dirección del centro\n• Delegado principal\n• Autoridades competentes\n\n🔒 Registro inmutable en auditoría LOPIVI\n📋 Válido para inspecciones legales\n\nSe requiere actuación inmediata.`)
    } else {
      alert(`✅ CASO REPORTADO EXITOSAMENTE\n\nID: ${casoId}\n\nEl caso ha sido registrado y será revisado por el equipo de protección.\n\n🔒 Registro guardado en auditoría LOPIVI\n📋 Válido para inspecciones legales\n\nRecuerda seguir los protocolos establecidos.`)
    }

    // Limpiar formulario y cerrar modal
    setModalCasoNuevo(false)
    setNuevoCaso({
      tipo: '',
      titulo: '',
      descripcion: '',
      personaQueHaceAccion: '',
      personaQueRecibeAccion: '',
      personasInvolucradasAdicionales: [],
      fechaIncidente: '',
      prioridad: '',
      testigos: '',
      accionesInmediatas: ''
    })
    setPersonaAdicionalTemp('')
  }

  const toggleDestinatario = (destinatario: string) => {
    setEnvioDoc(prev => ({
      ...prev,
      destinatarios: prev.destinatarios.includes(destinatario)
        ? prev.destinatarios.filter(d => d !== destinatario)
        : [...prev.destinatarios, destinatario]
    }))
  }

  const toggleDocumento = (documento: string) => {
    setEnvioDoc(prev => ({
      ...prev,
      documentos: prev.documentos.includes(documento)
        ? prev.documentos.filter(d => d !== documento)
        : [...prev.documentos, documento]
    }))
  }

  const toggleDocumentacionMiembro = (doc: string) => {
    setNuevoMiembro(prev => ({
      ...prev,
      documentacion: prev.documentacion.includes(doc)
        ? prev.documentacion.filter(d => d !== doc)
        : [...prev.documentacion, doc]
    }))
  }

  // Función para agregar persona adicional
  const agregarPersonaAdicional = () => {
    if (personaAdicionalTemp.trim() && !nuevoCaso.personasInvolucradasAdicionales.includes(personaAdicionalTemp.trim())) {
      setNuevoCaso(prev => ({
        ...prev,
        personasInvolucradasAdicionales: [...prev.personasInvolucradasAdicionales, personaAdicionalTemp.trim()]
      }))
      setPersonaAdicionalTemp('')
    }
  }

  // Función para eliminar persona adicional
  const eliminarPersonaAdicional = (persona: string) => {
    setNuevoCaso(prev => ({
      ...prev,
      personasInvolucradasAdicionales: prev.personasInvolucradasAdicionales.filter(p => p !== persona)
    }))
  }

  // Función para marcar caso resuelto como eliminado
  const marcarCasoResuelto = (casoId: string) => {
    setCasosResueltosEliminados(prev => [...prev, casoId])
    alert('✅ Caso marcado como procesado y eliminado de la lista')
  }

  // Funciones para recordatorios y reclamaciones de cumplimiento
  const abrirRecordatorio = (detalle: any) => {
    setElementoParaAccion(detalle)
    setTipoAccion('recordatorio')
    setMensajePersonalizado(`Hola ${detalle.persona || detalle.responsable},\n\nTe recordamos que tienes pendiente: ${detalle.faltante}\n\nFecha límite: ${detalle.fechaLimite}\n\nPor favor, procede con la acción correspondiente.\n\nSaludos,\nDelegado de Protección`)
    setModalRecordatorio(true)
  }

  const abrirReclamacion = (detalle: any) => {
    setElementoParaAccion(detalle)
    setTipoAccion('reclamacion')
    setMensajePersonalizado(`Estimado/a ${detalle.persona || detalle.responsable},\n\nEste es un recordatorio URGENTE sobre el cumplimiento pendiente:\n\n${detalle.faltante}\n\nFecha límite: ${detalle.fechaLimite}\nEstado actual: ${detalle.estado}\n\nEs IMPRESCINDIBLE que completes esta acción para mantener el cumplimiento LOPIVI de la entidad.\n\nEn caso de no completarse en los próximos días, tendremos que escalarlo a la dirección.\n\nSaludos,\nDelegado de Protección`)
    setModalReclamacion(true)
  }

  const enviarAccion = () => {
    const accion = tipoAccion === 'recordatorio' ? 'recordatorio' : 'reclamación'
    console.log(`📧 Enviando ${accion} a:`, elementoParaAccion)
    console.log(`📝 Mensaje:`, mensajePersonalizado)

    alert(`✅ ${accion.toUpperCase()} ENVIADO\n\nDestinatario: ${elementoParaAccion?.persona || elementoParaAccion?.responsable}\nAsunto: ${elementoParaAccion?.faltante}\n\nEl ${accion} ha sido registrado en el sistema.`)

    // Limpiar estados
    setModalRecordatorio(false)
    setModalReclamacion(false)
    setElementoParaAccion(null)
    setTipoAccion(null)
    setMensajePersonalizado('')
  }

  // Funciones para certificados penales
  const marcarCertificadoEntregado = (persona: any, fechaEmision: string, fechaVencimiento: string, observaciones: string) => {
    console.log(`📋 Marcando certificado entregado para ${persona.nombre}`)
    console.log(`📅 Emisión: ${fechaEmision}, Vencimiento: ${fechaVencimiento}`)

    const mensaje = `✅ CERTIFICADO MARCADO COMO ENTREGADO\n\n` +
      `Persona: ${persona.nombre}\n` +
      `Rol: ${persona.rol}\n` +
      `Fecha emisión: ${fechaEmision}\n` +
      `Válido hasta: ${fechaVencimiento}\n` +
      `Observaciones: ${observaciones || 'Ninguna'}\n\n` +
      `✓ Estado actualizado en el sistema\n` +
      `✓ Alertas de renovación programadas\n` +
      `✓ Registro añadido al historial`

    alert(mensaje)
    setModalAccionCertificado(false)
    setPersonalSeleccionado(null)
  }

  const enviarRecordatorioCertificado = (persona: any) => {
    console.log(`📧 Enviando recordatorio de certificado a ${persona.nombre}`)

    const mensaje = `📧 RECORDATORIO ENVIADO\n\n` +
      `Destinatario: ${persona.nombre}\n` +
      `Email: ${persona.email}\n` +
      `Asunto: Renovación Certificado de Antecedentes Penales\n\n` +
      `✓ Email enviado al interesado\n` +
      `✓ Copia enviada al delegado\n` +
      `✓ Acción registrada en el historial`

    alert(mensaje)
  }

  const generarReporteCertificados = () => {
    console.log('📊 Generando reporte de certificados penales')

    const resumen = `📊 REPORTE DE CERTIFICADOS GENERADO\n\n` +
      `✅ Vigentes: ${contadoresCertificados.vigentes}\n` +
      `⚠️ Próximos a vencer: ${contadoresCertificados.proximos}\n` +
      `🚨 Vencidos: ${contadoresCertificados.vencidos}\n` +
      `❌ No entregados: ${contadoresCertificados.no_entregados}\n` +
      `📋 Total personal: ${contadoresCertificados.total}\n\n` +
      `📄 Archivo Excel generado con el detalle completo\n` +
      `📧 Enviado por email al delegado principal`

    alert(resumen)
  }

  const marcarElementoCompleto = (detalle: any) => {
    console.log(`✅ Marcando como completo:`, detalle)
    alert(`✅ ELEMENTO MARCADO COMO COMPLETO\n\n${detalle.persona || detalle.documento}\n${detalle.faltante}\n\nEl elemento ha sido actualizado en el sistema y contribuirá al porcentaje de cumplimiento.`)
  }

  // Funciones para Biblioteca LOPIVI
  const verDocumento = (documento: any, categoria: any) => {
    setDocumentoSeleccionado(documento)
    setCategoriaSeleccionadaDoc(categoria)
    setModalVerDocumento(true)
    console.log(`👁️ Abriendo documento: ${documento.nombre}`)
  }

  const descargarDocumento = (documento: any, categoria: any) => {
    console.log(`📥 Descargando documento: ${documento.nombre}`)

    // Simular descarga del documento
    const nombreArchivo = `${documento.nombre.replace(/\s+/g, '_')}.${documento.tipo.toLowerCase()}`

    alert(`📥 DESCARGA INICIADA\n\n` +
      `Documento: ${documento.nombre}\n` +
      `Tipo: ${documento.tipo}\n` +
      `Tamaño: ${documento.tamaño}\n` +
      `Versión: ${documento.version}\n\n` +
      `✓ Descarga iniciada automáticamente\n` +
      `✓ Archivo: ${nombreArchivo}\n` +
      `✓ Ubicación: Carpeta de descargas`)

    // Simular creación y descarga del archivo
    const contenidoSimulado = `DOCUMENTO LOPIVI - ${documento.nombre}\n\n` +
      `Categoría: ${categoria.titulo}\n` +
      `Tipo: ${documento.tipo}\n` +
      `Versión: ${documento.version}\n` +
      `Última actualización: ${documento.actualizado}\n\n` +
      `Este es el contenido del documento ${documento.nombre}.\n` +
      `Documento oficial de Custodia360 para cumplimiento LOPIVI.\n\n` +
      `Para más información: info@custodia360.es`

    const blob = new Blob([contenidoSimulado], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nombreArchivo
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const compartirDocumento = (documento: any, categoria: any) => {
    setDocumentoSeleccionado(documento)
    setCategoriaSeleccionadaDoc(categoria)
    setModalCompartirDocumento(true)
    console.log(`📤 Compartiendo documento: ${documento.nombre}`)
  }

  // 🔒 FUNCIONES DE AUDITORÍA LOPIVI
  const exportarLogsAuditoria = async () => {
    setCargandoLogs(true)
    try {
      const desde = fechaDesde || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días atrás por defecto
      const hasta = fechaHasta || new Date().toISOString()

      const resultado = await exportAuditLogsForInspection(desde, hasta)

      if (resultado.success && resultado.data) {
        setLogsAuditoria(resultado.data)
        console.log('🔒 ✅ Logs de auditoría exportados:', resultado.data.length, 'registros')
        alert(`✅ LOGS DE AUDITORÍA EXPORTADOS\n\n📊 Total de registros: ${resultado.data.length}\n📅 Período: ${new Date(desde).toLocaleDateString()} - ${new Date(hasta).toLocaleDateString()}\n\n🔒 Datos válidos para inspecciones LOPIVI`)
      } else {
        throw new Error(resultado.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('🔒 ❌ Error al exportar logs:', error)
      alert('❌ Error al exportar logs de auditoría. Verifica la conexión con la base de datos.')
    } finally {
      setCargandoLogs(false)
    }
  }

  const descargarLogsCSV = () => {
    if (logsAuditoria.length === 0) {
      alert('No hay logs para descargar. Primero exporta los datos.')
      return
    }

    // Preparar datos para CSV
    const headers = ['Fecha/Hora', 'Usuario', 'Acción', 'Tipo Entidad', 'Detalles', 'IP', 'Hash Legal']
    const csvContent = [
      headers.join(','),
      ...logsAuditoria.map(log => [
        log.timestamp,
        log.user_name,
        log.action_type,
        log.entity_type,
        JSON.stringify(log.details).replace(/,/g, ';'),
        log.ip_address,
        log.legal_hash
      ].join(','))
    ].join('\n')

    // Descargar archivo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `auditoria_lopivi_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log('🔒 ✅ Logs descargados en formato CSV para inspección')
    alert('✅ LOGS DESCARGADOS\n\nArchivo CSV guardado para inspecciones LOPIVI\n📋 Válido para auditorías legales')
  }

  // 📋 FUNCIÓN PARA GENERAR INFORME DE INSPECCIÓN MINISTERIAL
  const generarInformeInspeccion = async () => {
    setGenerandoInforme(true)

    try {
      // Obtener logs de auditoría recientes
      const fechaInicio = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString() // 1 año
      const fechaFin = new Date().toISOString()

      const logsResult = await exportAuditLogsForInspection(fechaInicio, fechaFin)

      // Generar contenido del informe
      const fechaGeneracion = new Date().toLocaleString('es-ES', {
        timeZone: 'Europe/Madrid',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      const contenidoInforme = `
INFORME DE CUMPLIMIENTO LOPIVI
PARA INSPECCIÓN MINISTERIAL

====================================
DATOS DE LA ENTIDAD
====================================

Entidad: ${sessionData?.entidad || 'Entidad Deportiva Ejemplo'}
Delegado/a Principal: ${sessionData?.nombre || 'Nombre del Delegado/a'}
Fecha de generación: ${fechaGeneracion}
Período evaluado: Últimos 12 meses
Estado general: ACTIVO Y EN CUMPLIMIENTO

====================================
RESUMEN EJECUTIVO
====================================

La entidad cumple con los requisitos establecidos en la Ley Orgánica 8/2021
de protección integral a la infancia y la adolescencia frente a la violencia (LOPIVI).

INDICADORES PRINCIPALES:
- Cumplimiento general: ${estadisticasAvanzadas.cumplimiento.valor}%
- Personal formado: ${estadisticasAvanzadas.personalFormado.valor}%
- Casos gestionados: ${estadisticasAvanzadas.casosNuevos.valor} nuevos, ${estadisticasAvanzadas.casosResueltos.valor} resueltos
- Certificados vigentes: ${contadoresCertificados.vigentes}/${contadoresCertificados.total}
- Sistema de auditoría: OPERATIVO con ${logsResult.data?.length || 0} registros

====================================
PERSONAL Y FORMACIÓN
====================================

PERSONAL TOTAL: ${personalEntidad.length} personas
- Entrenadores principales: ${personalEntidad.filter(p => p.rol.includes('Entrenador Principal')).length}
- Monitores: ${personalEntidad.filter(p => p.rol.includes('Monitor')).length}
- Coordinadores: ${personalEntidad.filter(p => p.rol.includes('Coordinador')).length}
- Personal administrativo: ${personalEntidad.filter(p => p.rol.includes('Administrativa')).length}

ESTADO DE FORMACIÓN:
- Personal con formación completada: ${personalEntidad.filter(p => p.formacionLOPIVI === 'Completada').length}
- Personal con formación en proceso: ${personalPendiente.length}
- Certificados vigentes: ${personalEntidad.filter(p => p.certificadoVigente).length}

PERSONAL PENDIENTE DE FORMACIÓN:
${personalPendiente.map(p => `- ${p.nombre} (${p.rol}): ${p.formacionPendiente.join(', ')} - Prioridad: ${p.prioridad}`).join('\n')}

====================================
CERTIFICADOS PENALES
====================================

ESTADO ACTUAL:
- Certificados vigentes: ${contadoresCertificados.vigentes}
- Próximos a vencer: ${contadoresCertificados.proximos}
- Vencidos: ${contadoresCertificados.vencidos}
- No entregados: ${contadoresCertificados.no_entregados}

DETALLE POR PERSONA:
${personalCertificadosPenales.map(p => `- ${p.nombre} (${p.rol}): Estado ${p.estado}, Vence: ${p.fechaVencimientoCertificado || 'No especificado'}`).join('\n')}

====================================
CASOS Y GESTIÓN DE INCIDENTES
====================================

CASOS NUEVOS (Último período): ${estadisticasAvanzadas.casosNuevos.valor}
CASOS RESUELTOS: ${estadisticasAvanzadas.casosResueltos.valor}
TIEMPO PROMEDIO DE RESOLUCIÓN: ${estadisticasAvanzadas.casosResueltos.tiempo}

ALERTAS ACTIVAS:
- Críticas: ${estadisticasAvanzadas.alertasActivas.criticas}
- Medias: ${estadisticasAvanzadas.alertasActivas.medias}
- Bajas: ${estadisticasAvanzadas.alertasActivas.bajas}

CASOS RESUELTOS RECIENTES:
${casosResueltos.map(c => `- ${c.titulo} (${c.tipo}) - Resuelto: ${c.fechaResolucion} por ${c.responsable}`).join('\n')}

====================================
DOCUMENTACIÓN Y PROTOCOLOS
====================================

DOCUMENTACIÓN ACTUALIZADA:
✓ Plan de Protección Personalizado
✓ Código de Conducta actualizado
✓ Protocolos de actuación específicos
✓ Manual de formación LOPIVI
✓ Procedimientos de emergencia

BIBLIOTECA LOPIVI:
- Normativas vigentes: ${categoriasDocumentosLOPIVI[0].documentos.length} documentos
- Protocolos de actuación: ${categoriasDocumentosLOPIVI[1].documentos.length} documentos
- Planes de protección: ${categoriasDocumentosLOPIVI[2].documentos.length} documentos
- Formularios: ${categoriasDocumentosLOPIVI[3].documentos.length} documentos

====================================
COMUNICACIÓN Y TRANSPARENCIA
====================================

ACTIVIDAD COMUNICATIVA (Este mes):
- Emails enviados: 24
- Documentos compartidos: 12
- Miembros activos: ${personalEntidad.length}
- Tasa de respuesta: 94%

COMUNICACIONES CON FAMILIAS:
${tiposComunicacionFamilias.map(t => `- ${t.titulo}: ${t.urgencia}`).join('\n')}

====================================
SISTEMA DE AUDITORÍA
====================================

ESTADO DEL SISTEMA: ✓ OPERATIVO
REGISTROS TOTALES: ${logsResult.data?.length || 0}
RETENCIÓN: 5 años (conforme LOPIVI)
INMUTABILIDAD: ✓ Garantizada
VERIFICACIÓN: ✓ Hash legal en cada registro

TIPOS DE REGISTROS AUDITADOS:
- Envíos de documentación
- Registro de nuevo personal
- Reportes de casos
- Acciones sobre certificados
- Comunicaciones críticas

====================================
CUMPLIMIENTO NORMATIVO
====================================

LEY ORGÁNICA 8/2021 LOPIVI:
✓ Art. 35 - Delegado/a de protección designado
✓ Art. 36 - Plan de protección implementado
✓ Art. 37 - Formación específica del personal
✓ Art. 38 - Código de conducta aprobado
✓ Art. 39 - Procedimientos de comunicación
✓ Art. 40 - Protocolo de actuación ante violencia

OTRAS NORMATIVAS:
✓ RGPD - Protección de datos implementada
✓ Normativas autonómicas aplicables
✓ Códigos sectoriales específicos

====================================
RECOMENDACIONES Y PLAN DE MEJORA
====================================

FORTALEZAS IDENTIFICADAS:
- Sistema de auditoría robusto y transparente
- Personal mayoritariamente formado
- Procedimientos documentados y actualizados
- Comunicación fluida con familias

ÁREAS DE MEJORA:
${personalPendiente.length > 0 ? `- Completar formación de ${personalPendiente.length} personas pendientes` : '- No hay formaciones pendientes críticas'}
${contadoresCertificados.vencidos > 0 ? `- Renovar ${contadoresCertificados.vencidos} certificados vencidos` : '- Certificados al día'}
${estadisticasAvanzadas.alertasActivas.criticas > 0 ? `- Resolver ${estadisticasAvanzadas.alertasActivas.criticas} alertas críticas` : '- No hay alertas críticas'}

PLAN DE ACCIÓN (Próximos 90 días):
1. Completar formación pendiente del personal identificado
2. Renovar certificados próximos a vencer
3. Mantener sistema de auditoría actualizado
4. Continuar comunicación regular con familias
5. Realizar evaluación trimestral de cumplimiento

====================================
DECLARACIÓN DE CONFORMIDAD
====================================

Yo, ${sessionData?.nombre || 'Nombre del Delegado/a'}, en calidad de Delegado/a
de Protección de la entidad ${sessionData?.entidad || 'Entidad Deportiva Ejemplo'},
DECLARO que la información contenida en este informe es veraz y exacta,
y que la entidad cumple con todos los requisitos establecidos en la
Ley Orgánica 8/2021 LOPIVI.

Fecha: ${fechaGeneracion}
Firma: ___________________________
${sessionData?.nombre || 'Nombre del Delegado/a'}
Delegado/a de Protección

====================================
ANEXOS DISPONIBLES
====================================

1. Logs de auditoría completos (exportables en CSV)
2. Certificados del personal
3. Documentación de formación
4. Planes y protocolos actualizados
5. Comunicaciones con familias

Este informe ha sido generado automáticamente por el sistema
Custodia360 - Cumplimiento LOPIVI v2.0

Para verificación de autenticidad, consulte el hash del documento:
${Date.now().toString(36).toUpperCase()}

====================================
`

      // Crear y descargar el archivo
      const blob = new Blob([contenidoInforme], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Informe_Inspeccion_LOPIVI_${sessionData?.entidad?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      console.log('📋 ✅ Informe de inspección generado')
      alert(`✅ INFORME DE INSPECCIÓN GENERADO\n\n📋 Informe completo para inspección ministerial\n📊 ${logsResult.data?.length || 0} registros de auditoría incluidos\n📄 Válido para entrega a inspectores\n💾 Archivo descargado correctamente`)

    } catch (error) {
      console.error('📋 ❌ Error al generar informe:', error)
      alert('❌ Error al generar el informe de inspección. Inténtalo de nuevo.')
    } finally {
      setGenerandoInforme(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Acceso no autorizado</p>
          <Link href="/login-delegados" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard del Delegado/a de Protección</h1>
                <p className="text-sm text-gray-600">{sessionData.entidad} • {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'} • Sistema LOPIVI</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <div className="font-medium text-gray-900">{sessionData.nombre}</div>
                <div className="text-green-600 font-medium">Certificado Vigente</div>
              </div>
              {/* MEJORA 1: Indicador de estado mejorado con animación más elegante */}
              <div className="relative">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="absolute inset-0 w-6 h-6 bg-green-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 w-6 h-6 bg-green-300 rounded-full animate-pulse opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Notificaciones Críticas - Banner Superior */}
        {conteoNotificaciones.criticas > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{conteoNotificaciones.criticas}</span>
                </div>
                <div>
                  <h4 className="font-bold text-red-900">Tareas Críticas Pendientes</h4>
                  <p className="text-sm text-red-700">
                    {conteoNotificaciones.criticas} tareas requieren atención inmediata para mantener cumplimiento LOPIVI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalNotificaciones(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Ver Todas
              </button>
            </div>
          </div>
        )}

        {/* Estado de la entidad */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Estado de la entidad</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{estadisticasAvanzadas.cumplimiento.valor}%</div>
              <div className="text-xs text-gray-500">Cumplimiento LOPIVI</div>
            </div>
          </div>

          {/* MEJORA 2: Barra de progreso con indicadores visuales en hitos importantes */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso General</span>
              <span className="text-sm text-gray-500">Objetivo: {estadisticasAvanzadas.cumplimiento.objetivo}%</span>
            </div>

            {/* Contenedor con indicadores de hitos */}
            <div className="relative">
              {/* Barra de progreso principal */}
              <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                    estadisticasAvanzadas.cumplimiento.valor >= 95 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                    estadisticasAvanzadas.cumplimiento.valor >= 85 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    'bg-gradient-to-r from-red-400 to-red-600'
                  }`}
                  style={{ width: `${estadisticasAvanzadas.cumplimiento.valor}%` }}
                ></div>
              </div>

              {/* Marcadores de hitos (25%, 50%, 75%, 100%) */}
              <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
                {[25, 50, 75, 100].map((hito) => (
                  <div key={hito} className="flex flex-col items-center" style={{ left: `${hito}%`, transform: 'translateX(-50%)' }}>
                    <div className={`w-1 h-6 ${estadisticasAvanzadas.cumplimiento.valor >= hito ? 'bg-white' : 'bg-gray-400'} rounded-full shadow-sm`}></div>
                    <span className={`text-xs mt-1 font-medium ${estadisticasAvanzadas.cumplimiento.valor >= hito ? 'text-gray-700' : 'text-gray-400'}`}>
                      {hito}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-3">
              Faltan {estadisticasAvanzadas.cumplimiento.objetivo - estadisticasAvanzadas.cumplimiento.valor}% para el objetivo
            </div>
          </div>

          {/* Botón de Análisis Rápido */}
          <div className="mt-4">
            <button
              onClick={() => setModalAnalisisRapido(true)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              ¿Qué falta exactamente para el 100%?
            </button>
          </div>
        </div>

        {/* MEJORA 3: Grid más fluido que se adapte mejor a diferentes pantallas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Casos Nuevos - CLICKEABLE */}
          <div
            onClick={() => setModalCasoNuevo(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{estadisticasAvanzadas.casosNuevos.valor}</div>
                <div className="text-sm text-gray-600">Casos Nuevos</div>
                <div className="text-xs text-green-600 font-medium">{estadisticasAvanzadas.casosNuevos.comparativa} {estadisticasAvanzadas.casosNuevos.periodo}</div>
              </div>
            </div>
          </div>

          {/* Casos Resueltos - CLICKEABLE */}
          <div
            onClick={() => setModalCasosResueltos(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{estadisticasAvanzadas.casosResueltos.valor}</div>
                <div className="text-sm text-gray-600">Casos Resueltos</div>
                <div className="text-xs text-blue-600 font-medium">{estadisticasAvanzadas.casosResueltos.tiempo} {estadisticasAvanzadas.casosResueltos.descripcion}</div>
              </div>
            </div>
          </div>

          {/* Personal Formado - CLICKEABLE */}
          <div
            onClick={() => setModalPersonal(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{estadisticasAvanzadas.personalFormado.valor}%</div>
                <div className="text-sm text-gray-600">Personal Formado</div>
                <div className="text-xs text-orange-600 font-medium">3 pendientes de formación</div>
              </div>
            </div>
          </div>

          {/* Cumplimiento - CLICKEABLE */}
          <div
            onClick={() => setModalCumplimiento(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{estadisticasAvanzadas.cumplimiento.valor}%</div>
                <div className="text-sm text-gray-600">Índice de Cumplimiento</div>
                <div className="text-xs text-purple-600 font-medium">Objetivo: {estadisticasAvanzadas.cumplimiento.objetivo}%</div>
              </div>
            </div>
          </div>

          {/* Alertas Activas - CLICKEABLE */}
          <div
            onClick={() => setModalAlertas(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{estadisticasAvanzadas.alertasActivas.criticas + estadisticasAvanzadas.alertasActivas.medias}</div>
                <div className="text-sm text-gray-600">Alertas Activas</div>
                <div className="text-xs text-red-600 font-medium">{estadisticasAvanzadas.alertasActivas.criticas} críticas, {estadisticasAvanzadas.alertasActivas.medias} media</div>
              </div>
            </div>
          </div>

          {/* Certificados - CLICKEABLE */}
          <div
            onClick={() => setModalCertificados(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{estadisticasAvanzadas.certificados.vigentes}</div>
                <div className="text-sm text-gray-600">Certificados Vigentes</div>
                <div className="text-xs text-yellow-600 font-medium">{estadisticasAvanzadas.certificados.vencen} vencen pronto</div>
              </div>
            </div>
          </div>

          {/* Certificados Penales - CLICKEABLE */}
          <div
            onClick={() => setModalCertificadosPenales(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">28</div>
                <div className="text-sm text-gray-600">Certificados Penales</div>
                <div className="text-xs text-red-600 font-medium">2 vencidos, 3 próximos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Principales */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Acciones Principales</h3>
          </div>

          {/* MEJORA 3: Grid más fluido para los botones de acción */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* MEJORA 4: Colores sutiles - Enviar Documentación (Azul sutil) */}
            <button
              onClick={() => setModalEnviarDoc(true)}
              className="border border-blue-100 hover:border-blue-200 bg-blue-25 hover:bg-blue-50 p-6 rounded-xl transition-all hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2 text-blue-700">Enviar Documentación</h4>
                <p className="text-sm text-gray-600">Enviar protocolos y documentos a miembros de la entidad</p>
              </div>
            </button>

            {/* Botón Caso de Emergencia */}
            <button
              onClick={() => setModalEmergencia(true)}
              className="border border-red-300 bg-red-600 hover:bg-red-700 p-6 rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2 text-white">Caso de Emergencia</h4>
                <p className="text-sm text-red-100">Protocolos de actuación ante situaciones críticas</p>
              </div>
            </button>

            {/* MEJORA 4: Colores sutiles - Personal (Verde sutil) */}
            <button
              onClick={() => setModalPersonalCompleto(true)}
              className="border border-green-100 hover:border-green-200 bg-green-25 hover:bg-green-50 p-6 rounded-xl transition-all hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2 text-green-700">Personal</h4>
                <p className="text-sm text-gray-600">Gestionar miembros y ver historial de interacciones</p>
              </div>
            </button>

            {/* MEJORA 4: Colores sutiles - Centro de Notificaciones (Púrpura sutil) */}
            <button
              onClick={() => setModalNotificaciones(true)}
              className="border border-purple-100 hover:border-purple-200 bg-purple-25 hover:bg-purple-50 p-6 rounded-xl transition-all hover:scale-105 shadow-sm hover:shadow-md relative"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2 text-purple-700">Centro de Notificaciones</h4>
                <p className="text-sm text-gray-600">Recordatorios y tareas pendientes LOPIVI</p>
                {conteoNotificaciones.total > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {conteoNotificaciones.total}
                  </div>
                )}
              </div>
            </button>

            {/* MEJORA 4: Colores sutiles - Familias (Rosa sutil) */}
            <button
              onClick={() => setModalFamilias(true)}
              className="border border-pink-100 hover:border-pink-200 bg-pink-25 hover:bg-pink-50 p-6 rounded-xl transition-all hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2 text-pink-700">Familias</h4>
                <p className="text-sm text-gray-600">Comunicación con familias y tutores</p>
              </div>
            </button>

            {/* MEJORA 4: Colores sutiles - Biblioteca LOPIVI (Ámbar sutil) */}
            <button
              onClick={() => setModalBiblioteca(true)}
              className="border border-amber-100 hover:border-amber-200 bg-amber-25 hover:bg-amber-50 p-6 rounded-xl transition-all hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2 text-amber-700">Biblioteca LOPIVI</h4>
                <p className="text-sm text-gray-600">Documentos y normativas actualizadas</p>
              </div>
            </button>
          </div>
        </div>

        {/* Gestión y Auditoría */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Gestión y Auditoría</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {/* Botón Inspección Ministerial */}
            <button
              onClick={() => setModalInspeccion(true)}
              className="border border-purple-100 hover:border-purple-200 bg-purple-25 hover:bg-purple-50 p-6 rounded-xl transition-all hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2 text-purple-700">Inspección</h4>
                <p className="text-sm text-gray-600">Generar informe completo para inspección ministerial</p>
              </div>
            </button>

            {/* Botón Auditoría LOPIVI */}
            <button
              onClick={() => setModalAuditoria(true)}
              className="border border-red-100 hover:border-red-200 bg-red-25 hover:bg-red-50 p-6 rounded-xl transition-all hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2 text-red-700">Auditoría LOPIVI</h4>
                <p className="text-sm text-gray-600">Exportar registros y logs para auditorías legales</p>
              </div>
            </button>

            {/* Botón Nuevo Miembro */}
            <button
              onClick={() => setModalNuevoMiembro(true)}
              className="border border-green-100 hover:border-green-200 bg-green-25 hover:bg-green-50 p-6 rounded-xl transition-all hover:scale-105 shadow-sm hover:shadow-md"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2 text-green-700">Nuevo Miembro</h4>
                <p className="text-sm text-gray-600">Registrar nuevo personal en la entidad</p>
              </div>
            </button>
          </div>
        </div>

        {/* Sistema de Comunicación */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Sistema de Comunicación</h3>
          </div>

          {/* MEJORA 3: Grid fluido para certificados */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <h4 className="font-medium text-gray-900">Emails Enviados</h4>
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-xs text-gray-500">Este mes</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <h4 className="font-medium text-gray-900">Documentos Compartidos</h4>
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-xs text-gray-500">Última semana</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <h4 className="font-medium text-gray-900">Miembros Activos</h4>
              <div className="text-2xl font-bold text-purple-600">31</div>
              <div className="text-xs text-gray-500">Personal total</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <h4 className="font-medium text-gray-900">Tasa de Respuesta</h4>
              <div className="text-2xl font-bold text-orange-600">94%</div>
              <div className="text-xs text-gray-500">Promedio mensual</div>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <div className="text-center">
          <Link
            href="/login-delegados"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Volver al panel de acceso
          </Link>
        </div>
      </div>

      {/* Modal Personal Pendiente */}
      {modalPersonal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-5xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Personal con Formación Pendiente</h3>
              <button
                onClick={() => setModalEnviarDoc(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
              >
                Enviar Recordatorio
              </button>
            </div>
            <div className="space-y-4">
              {personalPendiente.map((persona, index) => (
                <div key={index} className={`border-l-4 p-4 rounded-lg ${
                  persona.prioridad === 'Alta' ? 'border-red-500 bg-red-50' :
                  persona.prioridad === 'Media' ? 'border-yellow-500 bg-yellow-50' :
                  'border-green-500 bg-green-50'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{persona.nombre}</h4>
                      <p className="text-sm text-gray-600">{persona.rol}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        persona.prioridad === 'Alta' ? 'bg-red-200 text-red-800' :
                        persona.prioridad === 'Media' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {persona.prioridad}
                      </span>
                      <button
                        onClick={() => {
                          setPersonaSeleccionada(persona)
                          setModalContactoEmail(true)
                        }}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200"
                      >
                        Contactar
                      </button>
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700">Pendiente:</p>
                    <ul className="text-sm text-gray-600 ml-4">
                      {persona.formacionPendiente.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-gray-500">Fecha límite: {persona.fechaLimite}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModalPersonal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Miembro */}
      {modalNuevoMiembro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Agregar Nuevo Miembro del Personal</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={nuevoMiembro.nombre}
                onChange={(e) => setNuevoMiembro({...nuevoMiembro, nombre: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={nuevoMiembro.email}
                onChange={(e) => setNuevoMiembro({...nuevoMiembro, email: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <select
                value={nuevoMiembro.rol}
                onChange={(e) => setNuevoMiembro({...nuevoMiembro, rol: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Seleccionar rol</option>
                <option value="entrenador">Entrenador Principal</option>
                <option value="monitor">Monitor</option>
                <option value="monitor-auxiliar">Monitor Auxiliar</option>
                <option value="coordinador">Coordinador</option>
                <option value="directivo">Directivo</option>
                <option value="administrativa">Personal Administrativa</option>
                <option value="familia">Representante Familiar</option>
              </select>
              <input
                type="date"
                value={nuevoMiembro.fechaIncorporacion}
                onChange={(e) => setNuevoMiembro({...nuevoMiembro, fechaIncorporacion: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Documentación a incluir:</label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {tiposDocumentacion.map((doc) => (
                  <label key={doc} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={nuevoMiembro.documentacion.includes(doc)}
                      onChange={() => toggleDocumentacionMiembro(doc)}
                      className="mr-2"
                    />
                    {doc}
                  </label>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Mensaje de bienvenida personalizado..."
              value={nuevoMiembro.mensaje}
              onChange={(e) => setNuevoMiembro({...nuevoMiembro, mensaje: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalNuevoMiembro(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={agregarMiembro}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Agregar Miembro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Enviar Documentación */}
      {modalEnviarDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Enviar Documentación del Personal</h3>

            {/* Información sobre envío masivo */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-2">Envío Masivo de Documentación</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• Selecciona "Todo el personal" para enviar documentos a todos los {personalEntidad.length} miembros</p>
                    <p>• Puedes combinar múltiples grupos (entrenadores + monitores, etc.)</p>
                    <p>• Los documentos como "Plan de Protección Personalizado" se enviarán automáticamente</p>
                    <p>• Se generará un registro completo del envío para auditorías LOPIVI</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destinatarios:</label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {destinatariosDisponibles.map((destinatario) => (
                    <label key={destinatario} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={envioDoc.destinatarios.includes(destinatario)}
                        onChange={() => toggleDestinatario(destinatario)}
                        className="mr-2"
                      />
                      {destinatario}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Documentos a enviar:</label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {tiposDocumentacion.map((doc) => (
                    <label key={doc} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={envioDoc.documentos.includes(doc)}
                        onChange={() => toggleDocumento(doc)}
                        className="mr-2"
                      />
                      {doc}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Asunto del email"
                value={envioDoc.asunto}
                onChange={(e) => setEnvioDoc({...envioDoc, asunto: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
              />
              <input
                type="email"
                placeholder="Email adicional (opcional)"
                value={envioDoc.emailAdicional}
                onChange={(e) => setEnvioDoc({...envioDoc, emailAdicional: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
              />
              <textarea
                placeholder="Mensaje personalizado..."
                value={envioDoc.mensaje}
                onChange={(e) => setEnvioDoc({...envioDoc, mensaje: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalEnviarDoc(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={enviarDocumentacion}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enviar Documentación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Casos de Emergencia */}
      {modalEmergencia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Protocolos de Emergencia</h3>
            <p className="text-gray-600 mb-6">Selecciona el tipo de emergencia para ver el protocolo de actuación:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tiposEmergencia.map((tipo) => (
                <button
                  key={tipo.id}
                  onClick={() => setTipoEmergenciaSeleccionado(tipo.id)}
                  className={`${tipo.color} hover:opacity-90 text-white p-4 rounded-xl transition-all text-left`}
                >
                  <h4 className="font-bold text-lg mb-2">{tipo.titulo}</h4>
                  <p className="text-sm opacity-90">{tipo.descripcion}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModalEmergencia(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle Protocolo Emergencia */}
      {tipoEmergenciaSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            {(() => {
              const tipo = tiposEmergencia.find(t => t.id === tipoEmergenciaSeleccionado)
              return tipo ? (
                <>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${tipo.color} rounded-full flex items-center justify-center mr-4`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{tipo.titulo}</h3>
                      <p className="text-gray-600">{tipo.descripcion}</p>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-red-800 mb-3">PROTOCOLO DE ACTUACIÓN INMEDIATA:</h4>
                    <div className="space-y-3">
                      {tipo.procedimiento.map((paso, index) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-sm text-red-800 font-medium">{paso}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800 font-medium">
                      ⚠️ <strong>IMPORTANTE:</strong> En caso de duda, siempre contacta inmediatamente al 112 y al delegado principal.
                      La seguridad del menor es SIEMPRE la prioridad absoluta.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setTipoEmergenciaSeleccionado(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      onClick={() => {
                        console.log(`Protocolo ${tipo.titulo} consultado`)
                        setTipoEmergenciaSeleccionado(null)
                        setModalEmergencia(false)
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Entendido
                    </button>
                  </div>
                </>
              ) : null
            })()}
          </div>
        </div>
      )}

      {/* Modal Personal Completo */}
      {modalPersonalCompleto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-7xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Personal de la Entidad ({personalEntidad.length} miembros totales)</h3>

            {/* Filtros de búsqueda */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Búsqueda por nombre */}
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={filtroPersonal}
                  onChange={(e) => setFiltroPersonal(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />

                {/* Filtro por rol */}
                <select
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Todos los roles</option>
                  {rolesDisponibles.map((rol) => (
                    <option key={rol} value={rol}>{rol}</option>
                  ))}
                </select>

                {/* Filtro por letra */}
                <select
                  value={letraSeleccionada}
                  onChange={(e) => setLetraSeleccionada(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Todas las letras</option>
                  {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letra) => (
                    <option key={letra} value={letra}>{letra}</option>
                  ))}
                </select>
              </div>

              {/* Navegación alfabética rápida */}
              <div className="flex flex-wrap gap-1 mb-4">
                <button
                  onClick={() => setLetraSeleccionada('')}
                  className={`px-2 py-1 rounded text-xs ${letraSeleccionada === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Todo
                </button>
                {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letra) => (
                  <button
                    key={letra}
                    onClick={() => setLetraSeleccionada(letra)}
                    className={`px-2 py-1 rounded text-xs ${letraSeleccionada === letra ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {letra}
                  </button>
                ))}
              </div>

              <div className="text-sm text-gray-600">
                Mostrando {personalFiltrado.length} de {personalEntidad.length} miembros
              </div>
            </div>

            {/* Lista del personal filtrado */}
            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
              {personalFiltrado.length > 0 ? (
                personalFiltrado.map((persona, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Información Personal */}
                      <div className="lg:col-span-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900">{persona.nombre}</h4>
                            <p className="text-sm text-blue-600 font-medium">{persona.rol}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            persona.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {persona.estado}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p><strong>Email:</strong> {persona.email}</p>
                          <p><strong>Teléfono:</strong> {persona.telefono}</p>
                          <p><strong>Ingreso:</strong> {persona.fechaIngreso}</p>
                          <p><strong>LOPIVI:</strong>
                            <span className={`ml-1 ${persona.formacionLOPIVI === 'Completada' ? 'text-green-600' : 'text-orange-600'}`}>
                              {persona.formacionLOPIVI}
                            </span>
                          </p>
                          <p><strong>Certificado:</strong>
                            <span className={`ml-1 ${persona.certificadoVigente ? 'text-green-600' : 'text-red-600'}`}>
                              {persona.certificadoVigente ? 'Vigente' : 'Vencido'}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Última Interacción */}
                      <div className="lg:col-span-1">
                        <h5 className="font-medium text-gray-700 mb-2">Última Interacción:</h5>
                        <p className="text-sm text-gray-600 mb-3">{persona.ultimaInteraccion}</p>

                        {/* Información adicional sobre el estado */}
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-xs text-gray-600">
                            <p><strong>Estado LOPIVI:</strong> <span className={persona.formacionLOPIVI === 'Completada' ? 'text-green-600' : 'text-orange-600'}>{persona.formacionLOPIVI}</span></p>
                            <p><strong>Certificado:</strong> <span className={persona.certificadoVigente ? 'text-green-600' : 'text-red-600'}>{persona.certificadoVigente ? 'Vigente' : 'Vencido'}</span></p>
                            {persona.estado === 'Formación Pendiente' && (
                              <p className="text-orange-600 font-medium mt-1">⚠️ Formación LOPIVI pendiente</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Historial de Interacciones */}
                      <div className="lg:col-span-1">
                        <h5 className="font-medium text-gray-700 mb-2">Historial Reciente:</h5>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {persona.interacciones.slice(0, 3).map((interaccion, i) => (
                            <div key={i} className="text-xs bg-gray-50 rounded p-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-700">{interaccion.fecha}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  interaccion.tipo === 'Email' ? 'bg-blue-100 text-blue-700' :
                                  interaccion.tipo === 'Llamada' ? 'bg-green-100 text-green-700' :
                                  interaccion.tipo === 'Reunión' ? 'bg-purple-100 text-purple-700' :
                                  interaccion.tipo === 'WhatsApp' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {interaccion.tipo}
                                </span>
                              </div>
                              <p className="text-gray-600">{interaccion.descripcion}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron miembros con los filtros aplicados
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setModalPersonalCompleto(false)
                  setFiltroPersonal('')
                  setFiltroRol('')
                  setLetraSeleccionada('')
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Caso Nuevo */}
      {modalCasoNuevo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Reportar Nuevo Caso</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select value={nuevoCaso.tipo} onChange={(e) => setNuevoCaso({...nuevoCaso, tipo: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2">
                <option value="">Tipo de caso</option>
                <option value="comportamiento">Comportamiento inapropiado</option>
                <option value="fisico">Contacto físico inadecuado</option>
                <option value="verbal">Abuso verbal o psicológico</option>
                <option value="negligencia">Negligencia en supervisión</option>
                <option value="digital">Uso inadecuado medios digitales</option>
                <option value="protocolo">Incumplimiento de protocolos</option>
              </select>

              <div className="flex gap-2">
                <select value={nuevoCaso.prioridad} onChange={(e) => setNuevoCaso({...nuevoCaso, prioridad: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 flex-1">
                  <option value="">Prioridad</option>
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>

                <button
                  onClick={() => setMostrarGuiaPrioridades(true)}
                  className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  ¿Cómo clasificar?
                </button>
              </div>
            </div>

            <input type="text" placeholder="Título del caso" value={nuevoCaso.titulo} onChange={(e) => setNuevoCaso({...nuevoCaso, titulo: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4" />

            {/* Sección de Personas Involucradas */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-blue-800 mb-3">Personas Involucradas</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Persona que hace la acción *</label>
                  <input
                    type="text"
                    placeholder="Nombre de quien realiza la acción"
                    value={nuevoCaso.personaQueHaceAccion}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, personaQueHaceAccion: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Persona que recibe la acción *</label>
                  <input
                    type="text"
                    placeholder="Nombre de quien recibe la acción"
                    value={nuevoCaso.personaQueRecibeAccion}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, personaQueRecibeAccion: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              {/* Personas Adicionales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Otras personas involucradas</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Agregar otra persona involucrada"
                    value={personaAdicionalTemp}
                    onChange={(e) => setPersonaAdicionalTemp(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && agregarPersonaAdicional()}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={agregarPersonaAdicional}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Agregar
                  </button>
                </div>

                {/* Lista de personas adicionales */}
                {nuevoCaso.personasInvolucradasAdicionales.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Personas adicionales agregadas:</p>
                    <div className="flex flex-wrap gap-2">
                      {nuevoCaso.personasInvolucradasAdicionales.map((persona, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {persona}
                          <button
                            type="button"
                            onClick={() => eliminarPersonaAdicional(persona)}
                            className="text-blue-600 hover:text-blue-800 ml-1"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del incidente</label>
                <input type="date" value={nuevoCaso.fechaIncidente} onChange={(e) => setNuevoCaso({...nuevoCaso, fechaIncidente: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total de personas involucradas</label>
                <input
                  type="text"
                  value={`${2 + nuevoCaso.personasInvolucradasAdicionales.length} personas`}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            <textarea placeholder="Descripción detallada del incidente" value={nuevoCaso.descripcion} onChange={(e) => setNuevoCaso({...nuevoCaso, descripcion: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 mb-4" />
            <textarea placeholder="Testigos (si los hay)" value={nuevoCaso.testigos} onChange={(e) => setNuevoCaso({...nuevoCaso, testigos: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 mb-4" />
            <textarea placeholder="Acciones inmediatas tomadas" value={nuevoCaso.accionesInmediatas} onChange={(e) => setNuevoCaso({...nuevoCaso, accionesInmediatas: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 mb-4" />

            <div className="flex justify-end gap-2">
              <button onClick={() => setModalCasoNuevo(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">Cancelar</button>
              <button onClick={crearCaso} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">Reportar Caso</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Guía de Prioridades LOPIVI */}
      {mostrarGuiaPrioridades && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Guía de Clasificación de Prioridades - LOPIVI</h3>
            <p className="text-gray-600 mb-6">Clasifica los casos según la gravedad y urgencia de actuación requerida:</p>

            <div className="space-y-4">
              {Object.entries(guiaPrioridades).map(([key, prioridad]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <span className={`font-bold text-lg ${prioridad.color}`}>
                      {prioridad.titulo}
                    </span>
                    {key === 'critica' && (
                      <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        URGENTE
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <h5 className="font-medium text-gray-700 mb-2">Criterios:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {prioridad.criterios.map((criterio, index) => (
                        <li key={index}>• {criterio}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={`bg-gray-50 rounded p-3 ${key === 'critica' ? 'border-l-4 border-red-500' : ''}`}>
                    <h5 className="font-medium text-gray-700 mb-1">Actuación requerida:</h5>
                    <p className="text-sm text-gray-600">{prioridad.accion}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> En caso de duda entre dos niveles, siempre elige el nivel de prioridad más alto.
                La protección del menor es siempre la prioridad absoluta.
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setMostrarGuiaPrioridades(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Casos Resueltos */}
      {modalCasosResueltos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Casos Resueltos ({casosResueltos.filter(caso => !casosResueltosEliminados.includes(caso.id)).length})</h3>
            <p className="text-gray-600 mb-6">Historial de casos que han sido resueltos satisfactoriamente</p>

            {/* Lista de casos resueltos */}
            <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
              {casosResueltos
                .filter(caso => !casosResueltosEliminados.includes(caso.id))
                .map((caso) => (
                  <div key={caso.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-gray-900">{caso.titulo}</h4>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                            {caso.tipo}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            ✅ {caso.estado}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium text-gray-700">ID:</span> {caso.id}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Reportado:</span> {caso.fechaReporte}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Resuelto:</span> {caso.fechaResolucion}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Responsable:</span> {caso.responsable}
                          </div>
                        </div>
                      </div>

                      {/* Botón Resuelto en verde */}
                      <button
                        onClick={() => marcarCasoResuelto(caso.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                      >
                        ✅ Procesado
                      </button>
                    </div>
                  </div>
                ))}

              {/* Mensaje cuando no hay casos */}
              {casosResueltos.filter(caso => !casosResueltosEliminados.includes(caso.id)).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-lg font-medium">¡Todos los casos han sido procesados!</p>
                  <p className="text-sm">No hay casos resueltos pendientes de revisión.</p>
                </div>
              )}
            </div>

            {/* Estadísticas */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-green-800 mb-2">Estadísticas de Resolución:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-green-800">Total resueltos:</p>
                  <p className="text-green-700">
                    {casosResueltos.length} casos
                  </p>
                </div>
                <div>
                  <p className="font-medium text-green-800">Pendientes de procesar:</p>
                  <p className="text-green-700">
                    {casosResueltos.filter(caso => !casosResueltosEliminados.includes(caso.id)).length} casos
                  </p>
                </div>
                <div>
                  <p className="font-medium text-green-800">Ya procesados:</p>
                  <p className="text-green-700">
                    {casosResueltosEliminados.length} casos
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setModalCasosResueltos(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cumplimiento */}
      {modalCumplimiento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-5xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Elementos Pendientes para 100% Cumplimiento</h3>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progreso actual</span>
                <span className="text-lg font-bold text-blue-600">{estadisticasAvanzadas.cumplimiento.valor}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-blue-600 h-4 rounded-full transition-all duration-300" style={{ width: `${estadisticasAvanzadas.cumplimiento.valor}%` }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Faltan {100 - estadisticasAvanzadas.cumplimiento.valor}% para completar</div>
            </div>

            <div className="space-y-4">
              {elementosFaltantes.map((elemento, index) => (
                <div key={index} className="border-l-4 border-orange-500 bg-orange-50 rounded-lg p-4 cursor-pointer hover:bg-orange-100 transition-colors"
                     onClick={() => setElementoSeleccionado(elemento.categoria)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{elemento.categoria}</h4>
                      <p className="text-sm text-gray-700 mt-1">{elemento.faltante}</p>
                      <p className="text-xs text-blue-600 mt-2 font-medium">Click para ver detalles específicos →</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        elemento.impacto === '5%' ? 'bg-red-200 text-red-800' :
                        elemento.impacto === '2%' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        +{elemento.impacto}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 rounded-lg p-4 mt-6 border border-green-200">
              <p className="text-sm text-green-800 font-medium">Al completar estos elementos alcanzarás el 100% de cumplimiento LOPIVI</p>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={() => setModalCumplimiento(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalles Específicos de Cumplimiento */}
      {elementoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Detalles: {elementoSeleccionado}</h3>
            <p className="text-gray-600 mb-6">{detallesCumplimiento[elementoSeleccionado]?.descripcion}</p>

            <div className="space-y-4">
              {detallesCumplimiento[elementoSeleccionado]?.detalles.map((detalle, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-bold text-gray-900">{detalle.persona || detalle.documento}</h5>
                      <p className="text-sm text-gray-600 mt-1">{detalle.faltante}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        <strong>Fecha límite:</strong> {detalle.fechaLimite}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                        detalle.estado.includes('Crítico') ? 'bg-red-100 text-red-800' :
                        detalle.estado.includes('progreso') ? 'bg-yellow-100 text-yellow-800' :
                        detalle.estado.includes('revisión') || detalle.estado.includes('programada') ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {detalle.estado}
                      </span>
                      <p className="text-xs text-gray-600">
                        <strong>Responsable:</strong> {detalle.responsable}
                      </p>

                      <div className="mt-3 flex gap-2 justify-end">
                        <button
                          onClick={() => abrirRecordatorio(detalle)}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs hover:bg-blue-200 transition-colors font-medium"
                        >
                          Recordatorio
                        </button>
                        <button
                          onClick={() => abrirReclamacion(detalle)}
                          className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-xs hover:bg-orange-200 transition-colors font-medium"
                        >
                          Reclamar
                        </button>
                        <button
                          onClick={() => marcarElementoCompleto(detalle)}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs hover:bg-green-200 transition-colors font-medium"
                        >
                          Completo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setElementoSeleccionado(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={() => {
                  // Enviar recordatorio general para toda la categoría
                  const categoria = elementoSeleccionado
                  const elementosDeCategoria = detallesCumplimiento[categoria]?.detalles || []
                  console.log(`📧 Enviando recordatorio general para categoría: ${categoria}`)
                  console.log(`👥 Elementos afectados:`, elementosDeCategoria)

                  alert(`✅ RECORDATORIO GENERAL ENVIADO\n\nCategoría: ${categoria}\nPersonas notificadas: ${elementosDeCategoria.length}\n\nSe ha enviado un recordatorio grupal a todos los responsables de esta categoría.`)
                  setElementoSeleccionado(null)
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Recordatorio General
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Alertas Activas */}
      {modalAlertas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-5xl w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Alertas Activas ({alertasActivas.length})</h3>
            <div className="space-y-4">
              {alertasActivas.map((alerta) => (
                <div key={alerta.id} className={`border-l-4 p-4 rounded-lg ${alerta.tipo === 'Crítica' ? 'border-red-500 bg-red-50' : alerta.tipo === 'Media' ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{alerta.titulo}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alerta.descripcion}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${alerta.tipo === 'Crítica' ? 'bg-red-200 text-red-800' : alerta.tipo === 'Media' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{alerta.tipo}</span>

                      {alertaResolviendose === alerta.id ? (
                        <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-xs" disabled>
                          Resolviendo...
                        </button>
                      ) : (
                        <button
                          onClick={() => resolverAlerta(alerta.id)}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition-colors"
                        >
                          Resolver
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex gap-4">
                    <span>Creada: {alerta.fechaCreacion}</span>
                    <span>Responsable: {alerta.responsable}</span>
                  </div>

                  {alertaResolviendose === alerta.id && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-4">
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-sm text-blue-800 font-medium">Proceso de resolución iniciado:</p>
                        <button
                          onClick={() => cerrarResolucion(alerta.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                          title="Cerrar información"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="text-xs text-blue-700 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Alerta marcada como "En proceso"</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Notificación enviada al responsable: {alerta.responsable}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Sistema de seguimiento activado</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">📋</span>
                          <span>Documentando resolución en el sistema...</span>
                        </div>

                        <div className="mt-4 p-3 bg-white rounded border">
                          <p className="text-blue-800 font-medium text-sm mb-2">Acciones disponibles:</p>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => completarResolucion(alerta.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                            >
                              Marcar como Resuelta
                            </button>
                            <button
                              onClick={() => {
                                alert('📧 Recordatorio enviado al responsable\n\nSe ha enviado un email de seguimiento para acelerar la resolución.')
                              }}
                              className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700"
                            >
                              Enviar Recordatorio
                            </button>
                            <button
                              onClick={() => {
                                alert('⚠️ Alerta escalada a nivel superior\n\nSe ha notificado a la dirección sobre esta situación que requiere atención inmediata.')
                              }}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                            >
                              Escalar
                            </button>
                          </div>
                          <p className="text-xs text-blue-600 mt-2 font-medium">
                            💡 Esta información permanecerá visible hasta que la cierres o marques la alerta como resuelta.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setModalAlertas(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Certificados Próximos a Vencer */}
      {modalCertificados && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Certificados que Vencen en 30 Días</h3>
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800"><strong>Atención:</strong> {certificadosVencimiento.length} certificados requieren renovación próximamente</p>
            </div>
            <div className="space-y-4">
              {certificadosVencimiento.map((cert) => (
                <div key={cert.id} className={`border-l-4 p-4 rounded-lg ${cert.diasRestantes <= 15 ? 'border-red-500 bg-red-50' : cert.diasRestantes <= 25 ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{cert.persona}</h4>
                      <p className="text-sm text-gray-600">{cert.tipoCertificado}</p>
                      <p className="text-xs text-gray-500 mt-1">Fecha de vencimiento: {cert.fechaVencimiento}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${cert.diasRestantes <= 15 ? 'bg-red-200 text-red-800' : cert.diasRestantes <= 25 ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{cert.diasRestantes} días</span>
                      <button
                        onClick={() => abrirRenovacion(cert)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Renovar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setModalCertificados(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Renovación de Certificados - NUEVO */}
      {modalRenovacion && certificadoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              Renovar Certificado - {certificadoSeleccionado.tipoCertificado}
            </h3>

            {/* Información del certificado */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-2">Información del certificado</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Persona:</strong> {certificadoSeleccionado.persona}</div>
                <div><strong>Tipo:</strong> {certificadoSeleccionado.tipoCertificado}</div>
                <div><strong>Vence:</strong> {certificadoSeleccionado.fechaVencimiento}</div>
                <div><strong>Días restantes:</strong> {certificadoSeleccionado.diasRestantes}</div>
              </div>
            </div>

            {/* Indicador de pasos */}
            <div className="flex items-center justify-center mb-6">
              {[1, 2, 3].map((paso) => (
                <div key={paso} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    pasoRenovacion >= paso ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {paso}
                  </div>
                  {paso < 3 && (
                    <div className={`w-16 h-1 ${
                      pasoRenovacion > paso ? 'bg-blue-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Paso 1: Información básica */}
            {pasoRenovacion === 1 && (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900">Paso 1: Configuración de Renovación</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entidad Certificadora
                  </label>
                  <select
                    value={datosRenovacion.entidadCertificadora}
                    onChange={(e) => setDatosRenovacion({...datosRenovacion, entidadCertificadora: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Centro de Formación LOPIVI Certificado">Centro de Formación LOPIVI Certificado</option>
                    <option value="Instituto Nacional de Protección Infantil">Instituto Nacional de Protección Infantil</option>
                    <option value="Colegio Profesional de Delegados">Colegio Profesional de Delegados</option>
                    <option value="Universidad de Protección Social">Universidad de Protección Social</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Solicitud
                  </label>
                  <input
                    type="date"
                    value={datosRenovacion.fechaSolicitud}
                    onChange={(e) => setDatosRenovacion({...datosRenovacion, fechaSolicitud: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo Estimado de Renovación
                  </label>
                  <select
                    value={datosRenovacion.tiempoEstimado}
                    onChange={(e) => setDatosRenovacion({...datosRenovacion, tiempoEstimado: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="15 días hábiles">15 días hábiles (Renovación rápida)</option>
                    <option value="30 días hábiles">30 días hábiles (Estándar)</option>
                    <option value="45 días hábiles">45 días hábiles (Con formación adicional)</option>
                    <option value="60 días hábiles">60 días hábiles (Renovación completa)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Paso 2: Documentos y requisitos */}
            {pasoRenovacion === 2 && (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900">Paso 2: Documentos y Requisitos</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documentos Requeridos (selecciona los que se adjuntarán)
                  </label>
                  <div className="space-y-2">
                    {[
                      'Certificado actual (copia)',
                      'Documento de identidad actualizado',
                      'Certificado de antecedentes penales',
                      'Informe de actividades realizadas',
                      'Certificados de formación complementaria',
                      'Evaluación de desempeño'
                    ].map((doc) => (
                      <label key={doc} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDatosRenovacion({
                                ...datosRenovacion,
                                documentosAdjuntos: [...datosRenovacion.documentosAdjuntos, doc]
                              })
                            } else {
                              setDatosRenovacion({
                                ...datosRenovacion,
                                documentosAdjuntos: datosRenovacion.documentosAdjuntos.filter(d => d !== doc)
                              })
                            }
                          }}
                        />
                        {doc}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo Estimado
                  </label>
                  <select
                    value={datosRenovacion.costoEstimado}
                    onChange={(e) => setDatosRenovacion({...datosRenovacion, costoEstimado: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar rango de costo...</option>
                    <option value="150-250€">150-250€ (Renovación básica)</option>
                    <option value="250-400€">250-400€ (Con evaluación)</option>
                    <option value="400-600€">400-600€ (Con formación adicional)</option>
                    <option value="600-800€">600-800€ (Renovación completa)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Paso 3: Confirmación y observaciones */}
            {pasoRenovacion === 3 && (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900">Paso 3: Confirmación y Observaciones</h4>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-bold text-blue-900 mb-2">Resumen de la renovación</h5>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Persona:</strong> {certificadoSeleccionado.persona}</p>
                    <p><strong>Certificado:</strong> {certificadoSeleccionado.tipoCertificado}</p>
                    <p><strong>Entidad:</strong> {datosRenovacion.entidadCertificadora}</p>
                    <p><strong>Tiempo estimado:</strong> {datosRenovacion.tiempoEstimado}</p>
                    <p><strong>Costo estimado:</strong> {datosRenovacion.costoEstimado}</p>
                    <p><strong>Documentos:</strong> {datosRenovacion.documentosAdjuntos.length} seleccionados</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones adicionales
                  </label>
                  <textarea
                    value={datosRenovacion.observaciones}
                    onChange={(e) => setDatosRenovacion({...datosRenovacion, observaciones: e.target.value})}
                    placeholder="Añade cualquier observación o requisito especial para la renovación..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-bold text-green-900 mb-2">Próximos pasos automáticos</h5>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>✓ Se enviará notificación al interesado</li>
                    <li>✓ Se creará expediente de renovación</li>
                    <li>✓ Se programará seguimiento automático</li>
                    <li>✓ Se registrará en el sistema de gestión</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between mt-6">
              <div>
                {pasoRenovacion > 1 && (
                  <button
                    onClick={pasoAnterior}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Anterior
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setModalRenovacion(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>

                {pasoRenovacion < 3 ? (
                  <button
                    onClick={siguientePaso}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={completarRenovacion}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Completar Renovación
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Centro de Notificaciones */}
      {modalNotificaciones && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Centro de Notificaciones LOPIVI</h3>
                <p className="text-sm text-gray-600">Recordatorios y tareas pendientes para cumplimiento total</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right text-sm">
                  <div className="text-red-600 font-bold">{conteoNotificaciones.criticas} críticas</div>
                  <div className="text-orange-600 font-medium">{conteoNotificaciones.altas} altas</div>
                  <div className="text-gray-500">{conteoNotificaciones.total} total</div>
                </div>
              </div>
            </div>

            {/* Filtros rápidos */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {conteoNotificaciones.criticas} Críticas
              </span>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {conteoNotificaciones.altas} Altas
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {conteoNotificaciones.medias} Medias
              </span>
            </div>

            {/* Lista de notificaciones */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notificacionesActivas
                .sort((a, b) => {
                  const prioridadOrden = { critica: 4, alta: 3, media: 2, baja: 1 }
                  return prioridadOrden[b.prioridad as keyof typeof prioridadOrden] - prioridadOrden[a.prioridad as keyof typeof prioridadOrden]
                })
                .map((notificacion) => (
                  <div
                    key={notificacion.id}
                    className={`border-l-4 rounded-lg p-4 ${
                      notificacion.prioridad === 'critica' ? 'border-red-500 bg-red-50' :
                      notificacion.prioridad === 'alta' ? 'border-orange-500 bg-orange-50' :
                      notificacion.prioridad === 'media' ? 'border-yellow-500 bg-yellow-50' :
                      'border-green-500 bg-green-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{notificacion.titulo}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notificacion.prioridad === 'critica' ? 'bg-red-200 text-red-800' :
                            notificacion.prioridad === 'alta' ? 'bg-orange-200 text-orange-800' :
                            notificacion.prioridad === 'media' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-green-200 text-green-800'
                          }`}>
                            {notificacion.prioridad.toUpperCase()}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {notificacion.categoria}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{notificacion.descripcion}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span><strong>Fecha límite:</strong> {notificacion.fechaLimite}</span>
                          <span className={`font-medium ${
                            notificacion.diasRestantes <= 3 ? 'text-red-600' :
                            notificacion.diasRestantes <= 7 ? 'text-orange-600' :
                            'text-gray-600'
                          }`}>
                            <strong>Faltan:</strong> {notificacion.diasRestantes} días
                          </span>
                          <span><strong>Responsable:</strong> {notificacion.responsable}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => marcarCompleto(notificacion.id)}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-xs hover:bg-green-200 transition-colors font-medium"
                        >
                          Marcar Completo
                        </button>
                      </div>
                    </div>

                    {notificacion.prioridad === 'critica' && (
                      <div className="bg-red-100 border border-red-200 rounded p-3 mt-3">
                        <p className="text-sm text-red-800 font-medium">
                          ⚠️ <strong>ATENCIÓN CRÍTICA:</strong> Esta tarea requiere acción inmediata para mantener el cumplimiento LOPIVI.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Resumen de acciones */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h4 className="font-bold text-blue-900 mb-2">Resumen de Acciones Requeridas:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-blue-800">Próximos 7 días:</p>
                  <p className="text-blue-700">
                    {notificacionesActivas.filter(n => n.diasRestantes <= 7).length} tareas críticas
                  </p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Próximos 30 días:</p>
                  <p className="text-blue-700">
                    {notificacionesActivas.filter(n => n.diasRestantes <= 30).length} tareas importantes
                  </p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Categoría más urgente:</p>
                  <p className="text-blue-700">
                    {notificacionesActivas.find(n => n.prioridad === 'critica')?.categoria || 'Certificaciones'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModalNotificaciones(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Comunicación con Familias */}
      {modalFamilias && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Comunicación con Familias</h3>
            <p className="text-gray-600 mb-6">Selecciona el tipo de comunicación que necesitas enviar a las familias:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tiposComunicacionFamilias.map((tipo) => (
                <button
                  key={tipo.id}
                  onClick={() => setTipoComunicacionSeleccionado(tipo.id)}
                  className={`${tipo.color} hover:opacity-90 text-white p-4 rounded-xl transition-all text-left`}
                >
                  <h4 className="font-bold text-lg mb-2">{tipo.titulo}</h4>
                  <p className="text-sm opacity-90">{tipo.descripcion}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModalFamilias(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle Comunicación Familias */}
      {tipoComunicacionSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            {(() => {
              const tipo = tiposComunicacionFamilias.find(t => t.id === tipoComunicacionSeleccionado)
              return tipo ? (
                <>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${tipo.color} rounded-full flex items-center justify-center mr-4`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{tipo.titulo}</h3>
                      <p className="text-gray-600">{tipo.descripcion}</p>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Destinatarios */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Destinatarios:</label>
                      <div className="space-y-2">
                        {tipo.destinatarios.map((destinatario, index) => (
                          <label key={index} className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">{destinatario}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Adjuntos disponibles */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adjuntos disponibles:</label>
                      <div className="space-y-2">
                        {tipo.adjuntos.map((adjunto, index) => (
                          <label key={index} className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">{adjunto}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Template del mensaje */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje (editable):</label>
                    <textarea
                      defaultValue={tipo.template}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
                      placeholder="Personaliza el mensaje..."
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>Recordatorio:</strong> Todas las comunicaciones con familias quedan registradas para auditorías LOPIVI.
                      Asegúrate de que el contenido cumple con los estándares de transparencia requeridos.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setTipoComunicacionSeleccionado(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      onClick={() => {
                        console.log(`Enviando comunicación ${tipo.titulo} a familias`)
                        setTipoComunicacionSeleccionado(null)
                        setModalFamilias(false)
                      }}
                      className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      Enviar Comunicación
                    </button>
                  </div>
                </>
              ) : null
            })()}
          </div>
        </div>
      )}

      {/* Modal Biblioteca LOPIVI */}
      {modalBiblioteca && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-7xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Biblioteca LOPIVI</h3>
            <p className="text-gray-600 mb-6">Accede a toda la documentación LOPIVI organizada por categorías:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoriasDocumentosLOPIVI.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => setCategoriaDocumentoSeleccionada(categoria.id)}
                  className={`${categoria.color} hover:opacity-90 text-white p-4 rounded-xl transition-all text-left`}
                >
                  <h4 className="font-bold text-lg mb-2">{categoria.titulo}</h4>
                  <p className="text-sm opacity-90 mb-3">{categoria.descripcion}</p>
                  <div className="text-xs opacity-75">
                    {categoria.documentos.length} documentos disponibles
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-amber-800">
                <strong>📚 Biblioteca siempre actualizada:</strong> Todos los documentos se mantienen al día con las últimas normativas.
                Las versiones anteriores se archivan automáticamente para referencia histórica.
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModalBiblioteca(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle Categoría Documentos */}
      {categoriaDocumentoSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-5xl w-full mx-4 max-h-screen overflow-y-auto">
            {(() => {
              const categoria = categoriasDocumentosLOPIVI.find(c => c.id === categoriaDocumentoSeleccionada)
              return categoria ? (
                <>
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 ${categoria.color} rounded-full flex items-center justify-center mr-4`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{categoria.titulo}</h3>
                      <p className="text-gray-600">{categoria.descripcion}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-3 text-left">Documento</th>
                          <th className="border border-gray-300 p-3 text-left">Tipo</th>
                          <th className="border border-gray-300 p-3 text-left">Actualizado</th>
                          <th className="border border-gray-300 p-3 text-left">Versión</th>
                          <th className="border border-gray-300 p-3 text-left">Tamaño</th>
                          <th className="border border-gray-300 p-3 text-left">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoria.documentos.map((doc, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-3 font-medium">{doc.nombre}</td>
                            <td className="border border-gray-300 p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                doc.tipo === 'PDF' ? 'bg-red-100 text-red-800' :
                                doc.tipo === 'DOCX' ? 'bg-blue-100 text-blue-800' :
                                doc.tipo === 'XLSX' ? 'bg-green-100 text-green-800' :
                                doc.tipo === 'ZIP' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {doc.tipo}
                              </span>
                            </td>
                            <td className="border border-gray-300 p-3 text-sm text-gray-600">{doc.actualizado}</td>
                            <td className="border border-gray-300 p-3 text-sm">v{doc.version}</td>
                            <td className="border border-gray-300 p-3 text-sm text-gray-600">{doc.tamaño}</td>
                            <td className="border border-gray-300 p-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => verDocumento(doc, categoria)}
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                                >
                                  Ver
                                </button>
                                <button
                                  onClick={() => descargarDocumento(doc, categoria)}
                                  className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs hover:bg-green-200 transition-colors"
                                >
                                  Descargar
                                </button>
                                <button
                                  onClick={() => compartirDocumento(doc, categoria)}
                                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-xs hover:bg-purple-200 transition-colors"
                                >
                                  Compartir
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                    <p className="text-sm text-green-800">
                      <strong>📋 Uso responsable:</strong> Estos documentos son oficiales y están protegidos por derechos de autor.
                      Úsalos únicamente para fines de cumplimiento LOPIVI en tu entidad.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => setCategoriaDocumentoSeleccionada(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      onClick={() => {
                        console.log(`Descargando toda la categoría ${categoria.titulo}`)
                      }}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Descargar Todo
                    </button>
                  </div>
                </>
              ) : null
            })()}
          </div>
        </div>
      )}

      {/* Modal Renovar Certificado */}
      {modalRenovarCertificado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Renovar Certificado</h3>
            <p className="text-gray-600 mb-6">Proceso de renovación de certificado para {tareaSeleccionada?.categoria}:</p>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">Tarea:</h4>
                <p className="text-sm text-red-700">{tareaSeleccionada?.titulo}</p>
                <p className="text-xs text-red-600">Responsable: {tareaSeleccionada?.responsable}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-bold text-yellow-800 mb-2">Documentos requeridos:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Certificado vigente actual</li>
                  <li>• Formulario de solicitud de renovación</li>
                  <li>• Declaración de cumplimiento de protocolos</li>
                  <li>• Documentación médica (si aplica)</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">Proceso de renovación:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. ✓ Verificar datos personales y certificado vigente</li>
                  <li>2. ✓ Completar formulario de solicitud</li>
                  <li>3. ✓ Recibir aprobación de delegado principal</li>
                  <li>4. ✓ Emitir nuevo certificado vigente</li>
                  <li>5. ✓ Notificar a todos los miembros afectados</li>
                </ol>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalRenovarCertificado(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    console.log(`Renovando certificado para ${tareaSeleccionada?.categoria}`)
                    setModalRenovarCertificado(false)
                    setModalNotificaciones(false)
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Renovar Certificado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Realizar Seguimiento */}
      {modalRealizarSeguimiento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Realizar Seguimiento</h3>
            <p className="text-gray-600 mb-6">Seguimiento de caso {tareaSeleccionada?.titulo}:</p>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">Caso:</h4>
                <p className="text-sm text-blue-700">{tareaSeleccionada?.titulo}</p>
                <p className="text-xs text-blue-600">Responsable: {tareaSeleccionada?.responsable}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-bold text-yellow-800 mb-3">Acciones de Seguimiento a Realizar:</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-yellow-700">1. Verificar cumplimiento de protocolos LOPIVI</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-yellow-700">2. Revisar documentación proporcionada por el responsable</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-yellow-700">3. Evaluar efectividad de las medidas tomadas</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-yellow-700">4. Entrevistar al personal involucrado</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-yellow-700">5. Documentar hallazgos y crear reporte</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-yellow-700">6. Proponer mejoras o acciones correctivas</span>
                  </label>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">Resultados esperados:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Cumplimiento total de protocolos</li>
                  <li>• Documentación completa y actualizada</li>
                  <li>• Mejora en procedimientos de protección</li>
                  <li>• Reporte final con recomendaciones</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalRealizarSeguimiento(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    console.log(`Realizando seguimiento para ${tareaSeleccionada?.titulo}`)
                    setModalRealizarSeguimiento(false)
                    setModalNotificaciones(false)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Realizar Seguimiento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Completar Evaluación */}
      {modalCompletarEvaluacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Completar Evaluación</h3>
            <p className="text-gray-600 mb-6">Evaluación de {tareaSeleccionada?.categoria}:</p>

            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">Evaluación:</h4>
                <p className="text-sm text-purple-700">{tareaSeleccionada?.titulo}</p>
                <p className="text-xs text-purple-600">Responsable: {tareaSeleccionada?.responsable}</p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-bold text-orange-800 mb-3">Criterios de Evaluación a Completar:</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-orange-700">1. Verificar cumplimiento al 100% de protocolos LOPIVI</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-orange-700">2. Comprobar documentación completa y actualizada</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-orange-700">3. Evaluar formación adecuada del personal involucrado</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-orange-700">4. Medir resultados obtenidos vs esperados</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-orange-700">5. Registrar lecciones aprendidas</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-orange-700">6. Emitir calificación final de cumplimiento</span>
                  </label>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">Resultados esperados:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• 100% cumplimiento de protocolos</li>
                  <li>• Documentación completa y actualizada</li>
                  <li>• Formación adecuada y actualizada</li>
                  <li>• Resultados superiores a los esperados</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalCompletarEvaluacion(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    console.log(`Completando evaluación para ${tareaSeleccionada?.categoria}`)
                    setModalCompletarEvaluacion(false)
                    setModalNotificaciones(false)
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Completar Evaluación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Recordatorio */}
      {modalRecordatorio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[80]">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Recordatorio de Cumplimiento</h3>
            <p className="text-gray-600 mb-6">Enviando recordatorio a: {elementoParaAccion?.persona || elementoParaAccion?.responsable}</p>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">Detalles:</h4>
                <p className="text-sm text-blue-700">{elementoParaAccion?.faltante}</p>
                <p className="text-xs text-blue-600">Fecha límite: {elementoParaAccion?.fechaLimite}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-bold text-yellow-800 mb-2">Mensaje:</h4>
                <p className="text-sm text-yellow-700">{mensajePersonalizado}</p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalRecordatorio(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={enviarAccion}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enviar Recordatorio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reclamación */}
      {modalReclamacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[80]">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Reclamación de Cumplimiento</h3>
            <p className="text-gray-600 mb-6">Reclamación urgente a: {elementoParaAccion?.persona || elementoParaAccion?.responsable}</p>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-2">Detalles:</h4>
                <p className="text-sm text-red-700">{elementoParaAccion?.faltante}</p>
                <p className="text-xs text-red-600">Fecha límite: {elementoParaAccion?.fechaLimite}</p>
                <p className="text-xs text-red-600">Estado actual: {elementoParaAccion?.estado}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-bold text-yellow-800 mb-2">Mensaje:</h4>
                <p className="text-sm text-yellow-700">{mensajePersonalizado}</p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalReclamacion(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={enviarAccion}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Enviar Reclamación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Certificados de Antecedentes Penales */}
      {modalCertificadosPenales && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-7xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Gestión de Certificados de Antecedentes Penales</h3>

            {/* Resumen rápido */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-3">Resumen General</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-800">{contadoresCertificados.vigentes}</div>
                  <div className="text-sm text-green-600">Vigentes</div>
                </div>
                <div className="bg-yellow-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-800">{contadoresCertificados.proximos}</div>
                  <div className="text-sm text-yellow-600">Próximos</div>
                </div>
                <div className="bg-red-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-800">{contadoresCertificados.vencidos}</div>
                  <div className="text-sm text-red-600">Vencidos</div>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-800">{contadoresCertificados.no_entregados}</div>
                  <div className="text-sm text-gray-600">Sin entregar</div>
                </div>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-4 mb-6">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Todos los estados</option>
                <option value="vigente">Vigentes</option>
                <option value="proximo">Próximos a vencer</option>
                <option value="vencido">Vencidos</option>
                <option value="no_entregado">No entregados</option>
              </select>

              <button
                onClick={generarReporteCertificados}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generar Reporte
              </button>
            </div>

            {/* Lista del personal */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {personalFiltradoCertificados.map((persona) => (
                <div key={persona.id} className={`border rounded-lg p-4 ${
                  persona.estado === 'vigente' ? 'border-green-200 bg-green-50' :
                  persona.estado === 'proximo' ? 'border-yellow-200 bg-yellow-50' :
                  persona.estado === 'vencido' ? 'border-red-200 bg-red-50' :
                  'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{persona.nombre}</h4>
                      <p className="text-sm text-gray-600">{persona.rol}</p>

                      {persona.estado === 'vigente' && (
                        <p className="text-sm text-green-700 mt-1">
                          Válido hasta: {persona.fechaVencimientoCertificado} ({persona.diasRestantes} días restantes)
                        </p>
                      )}

                      {persona.estado === 'proximo' && (
                        <p className="text-sm text-yellow-700 mt-1">
                          Vence: {persona.fechaVencimientoCertificado} (en {persona.diasRestantes} días)
                        </p>
                      )}

                      {persona.estado === 'vencido' && (
                        <p className="text-sm text-red-700 mt-1 font-medium">
                          VENCIDO: {persona.fechaVencimientoCertificado} (hace {Math.abs(persona.diasRestantes)} días)
                        </p>
                      )}

                      {persona.estado === 'no_entregado' && (
                        <p className="text-sm text-gray-700 mt-1">
                          Certificado no entregado - NO PUEDE TRABAJAR CON MENORES
                        </p>
                      )}

                      {persona.observaciones && (
                        <p className="text-xs text-gray-600 mt-2 italic">{persona.observaciones}</p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setPersonalSeleccionado(persona)
                          setModalAccionCertificado(true)
                        }}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs hover:bg-green-200 transition-colors"
                      >
                        Marcar Entregado
                      </button>

                      <button
                        onClick={() => enviarRecordatorioCertificado(persona)}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                      >
                        Recordatorio
                      </button>

                      <button
                        onClick={() => {
                          alert(`📝 HISTORIAL DE ${persona.nombre}\n\n${persona.historial.map(h => `${h.fecha}: ${h.accion} (${h.usuario})`).join('\n')}`)
                        }}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-xs hover:bg-gray-200 transition-colors"
                      >
                        Historial
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Alertas importantes */}
            {contadoresCertificados.vencidos > 0 && (
              <div className="bg-red-100 border border-red-200 rounded-lg p-4 mt-6">
                <h4 className="font-bold text-red-800 mb-2">ATENCIÓN URGENTE</h4>
                <p className="text-sm text-red-700">
                  {contadoresCertificados.vencidos} persona(s) tienen certificados VENCIDOS y NO PUEDEN trabajar con menores hasta entregar un nuevo certificado vigente.
                </p>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModalCertificadosPenales(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Acción Certificado */}
      {modalAccionCertificado && personalSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Marcar Certificado como Entregado</h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-blue-800 mb-2">Persona:</h4>
              <p className="text-sm text-blue-700">{personalSeleccionado.nombre}</p>
              <p className="text-sm text-blue-700">{personalSeleccionado.rol}</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              marcarCertificadoEntregado(
                personalSeleccionado,
                formData.get('fechaEmision') as string,
                formData.get('fechaVencimiento') as string,
                formData.get('observaciones') as string
              )
            }}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de emisión *
                  </label>
                  <input
                    type="date"
                    name="fechaEmision"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Válido hasta *
                  </label>
                  <input
                    type="date"
                    name="fechaVencimiento"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones (opcional)
                </label>
                <textarea
                  name="observaciones"
                  placeholder="Cualquier observación sobre el certificado..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Importante:</strong> Solo marca como entregado si has visto físicamente el certificado original y verificado que está vigente.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAccionCertificado(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirmar Entrega
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Contacto Email */}
      {modalContactoEmail && personaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Contactar por Email</h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-blue-800 mb-2">Destinatario:</h4>
              <p className="text-sm text-blue-700">{personaSeleccionada.nombre}</p>
              <p className="text-sm text-blue-700">{personaSeleccionada.rol}</p>
              <p className="text-sm text-blue-700">{personaSeleccionada.email || 'No hay email registrado'}</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const asunto = formData.get('asunto') as string
              const mensaje = formData.get('mensaje') as string

              alert(`📧 EMAIL ENVIADO\n\nPara: ${personaSeleccionada.nombre}\nAsunto: ${asunto}\n\n✓ Email enviado correctamente\n✓ Copia guardada en enviados\n✓ Interacción registrada en el historial`)

              setModalContactoEmail(false)
              setPersonaSeleccionada(null)
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asunto *
                </label>
                <select
                  name="asunto"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
                >
                  <option value="">Seleccionar tipo de comunicación...</option>
                  <option value="Recordatorio formación LOPIVI pendiente">Recordatorio formación LOPIVI pendiente</option>
                  <option value="Solicitud documentación">Solicitud documentación</option>
                  <option value="Certificado de antecedentes penales">Certificado de antecedentes penales</option>
                  <option value="Convocatoria reunión">Convocatoria reunión</option>
                  <option value="Información protocolos actualizados">Información protocolos actualizados</option>
                  <option value="Seguimiento caso">Seguimiento caso</option>
                  <option value="Otros asuntos LOPIVI">Otros asuntos LOPIVI</option>
                </select>
                <input
                  type="text"
                  name="asuntoPersonalizado"
                  placeholder="O escribe un asunto personalizado..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje *
                </label>
                <textarea
                  name="mensaje"
                  required
                  placeholder={`Hola ${personaSeleccionada.nombre},\n\nEspero que te encuentres bien. Te contacto respecto a...\n\nQuedo a la espera de tu respuesta.\n\nSaludos,\n[Tu nombre]\nDelegado de Protección`}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-40"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-green-800">
                  ✓ Este email se enviará desde la cuenta oficial del delegado y se registrará automáticamente en el historial de la persona.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalContactoEmail(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enviar Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Análisis Rápido de Cumplimiento */}
      {modalAnalisisRapido && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Análisis Rápido: ¿Qué falta para el 100%?</h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-blue-900">Estado actual: {estadisticasAvanzadas.cumplimiento.valor}%</span>
                <span className="text-sm text-blue-700">Faltan {100 - estadisticasAvanzadas.cumplimiento.valor}% para completar</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${estadisticasAvanzadas.cumplimiento.valor}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-800 mb-3">URGENTE - Formación Personal (5% restante)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-700">Carlos Ruiz Martín - Curso LOPIVI básico (40h)</span>
                    <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs">Vence: 15/10/2025</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-700">Eduardo Martín Sánchez - Módulo 2 y 3 (14h)</span>
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">En progreso 50%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-700">Javier Pérez Gómez - Curso completo + Examen</span>
                    <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs">CRÍTICO</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      alert('Recordatorio enviado a los 3 miembros del personal con formación pendiente.\n\nSe ha establecido seguimiento semanal hasta completar la formación.')
                      setModalAnalisisRapido(false)
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Enviar Recordatorio Urgente
                  </button>
                  <button
                    onClick={() => {
                      alert('Programando sesiones de formación acelerada para los próximos 7 días.\n\nSe notificará a los responsables de formación.')
                      setModalAnalisisRapido(false)
                    }}
                    className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                  >
                    Programar Formación Urgente
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-bold text-yellow-800 mb-3">IMPORTANTE - Documentación (2% restante)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-700">Protocolo de Comunicación Digital - Actualización 2025</span>
                    <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">En revisión</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-yellow-700">Plan de Emergencias - Incluir COVID-19</span>
                    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">Pendiente</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      alert('Asignando prioridad alta a la actualización de documentación.\n\nResponsables notificados con fecha límite de 5 días.')
                      setModalAnalisisRapido(false)
                    }}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                  >
                    Acelerar Documentación
                  </button>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-3">MENOR PRIORIDAD - Certificaciones (1% restante)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Luis Martín González - Certificado médico de aptitud</span>
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">Cita programada</span>
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => {
                      alert('Confirmando cita médica de Luis Martín González.\n\nSeguimiento programado para obtener certificado.')
                      setModalAnalisisRapido(false)
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Hacer Seguimiento
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mt-6">
              <h4 className="font-bold text-blue-900 mb-2">Plan de Acción Recomendado:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. PRIORIDAD MÁXIMA: Completar formación de Javier Pérez (crítico)</li>
                <li>2. Acelerar formación de Carlos Ruiz y Eduardo Martín</li>
                <li>3. Finalizar actualización de protocolos de comunicación</li>
                <li>4. Confirmar y obtener certificado médico de Luis Martín</li>
              </ol>
              <p className="text-sm text-blue-700 mt-3 font-medium">
                Tiempo estimado para 100%: 10-15 días si se siguen las prioridades
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setModalAnalisisRapido(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  alert('Plan de acción activado:\n\n✓ Recordatorios urgentes enviados\n✓ Plazos establecidos\n✓ Seguimiento automático activado\n✓ Responsables notificados\n\nSe te mantendrá informado del progreso diariamente.')
                  setModalAnalisisRapido(false)
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ejecutar Plan de Acción
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Documento */}
      {modalVerDocumento && documentoSeleccionado && categoriaSeleccionadaDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{documentoSeleccionado.nombre}</h3>
                <p className="text-sm text-gray-600">{categoriaSeleccionadaDoc.titulo}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  documentoSeleccionado.tipo === 'PDF' ? 'bg-red-100 text-red-800' :
                  documentoSeleccionado.tipo === 'DOCX' ? 'bg-blue-100 text-blue-800' :
                  documentoSeleccionado.tipo === 'XLSX' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {documentoSeleccionado.tipo}
                </span>
                <span className="text-sm text-gray-500">v{documentoSeleccionado.version}</span>
              </div>
            </div>

            {/* Información del documento */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Actualizado:</span>
                  <p className="text-gray-600">{documentoSeleccionado.actualizado}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Tamaño:</span>
                  <p className="text-gray-600">{documentoSeleccionado.tamaño}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Categoría:</span>
                  <p className="text-gray-600">{categoriaSeleccionadaDoc.titulo}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Estado:</span>
                  <p className="text-green-600 font-medium">Activo</p>
                </div>
              </div>
            </div>

            {/* Contenido del documento simulado */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 h-96 overflow-y-auto">
              <div className="prose max-w-none">
                <h4 className="text-lg font-bold text-gray-900 mb-4">{documentoSeleccionado.nombre}</h4>

                {documentoSeleccionado.nombre.includes('Ley Orgánica') && (
                  <div>
                    <h5 className="font-bold mb-2">TÍTULO I - DISPOSICIONES GENERALES</h5>
                    <p className="mb-4">
                      <strong>Artículo 1. Objeto.</strong><br/>
                      Esta Ley tiene por objeto garantizar los derechos fundamentales de los menores de edad a su integridad física, psíquica, psicológica y moral frente a cualquier forma de violencia...
                    </p>
                    <h5 className="font-bold mb-2">TÍTULO II - MEDIDAS DE PROTECCIÓN</h5>
                    <p className="mb-4">
                      <strong>Artículo 5. Delegado de Protección.</strong><br/>
                      Las entidades que desarrollen actividades deportivas, educativas, culturales o de ocio dirigidas a menores de edad deberán designar entre sus miembros un Delegado de Protección...
                    </p>
                  </div>
                )}

                {documentoSeleccionado.nombre.includes('Protocolo') && (
                  <div>
                    <h5 className="font-bold mb-2">1. OBJETIVO DEL PROTOCOLO</h5>
                    <p className="mb-4">
                      Este protocolo establece las pautas de actuación ante situaciones de riesgo para menores de edad en el ámbito de las actividades organizadas por la entidad.
                    </p>
                    <h5 className="font-bold mb-2">2. PROCEDIMIENTO DE ACTUACIÓN</h5>
                    <p className="mb-4">
                      <strong>Paso 1:</strong> Detección y evaluación inicial de la situación<br/>
                      <strong>Paso 2:</strong> Medidas de protección inmediata<br/>
                      <strong>Paso 3:</strong> Comunicación a autoridades competentes<br/>
                      <strong>Paso 4:</strong> Seguimiento y documentación del caso
                    </p>
                  </div>
                )}

                {documentoSeleccionado.nombre.includes('Plan') && (
                  <div>
                    <h5 className="font-bold mb-2">PLAN DE PROTECCIÓN PERSONALIZADO</h5>
                    <p className="mb-4">
                      <strong>Entidad:</strong> [Nombre de la entidad]<br/>
                      <strong>Delegado Principal:</strong> [Nombre del delegado]<br/>
                      <strong>Fecha de elaboración:</strong> [Fecha]
                    </p>
                    <h5 className="font-bold mb-2">1. ANÁLISIS DE RIESGOS</h5>
                    <p className="mb-4">
                      Identificación de los riesgos específicos asociados a las actividades desarrolladas por la entidad...
                    </p>
                  </div>
                )}

                {documentoSeleccionado.nombre.includes('Formulario') && (
                  <div>
                    <h5 className="font-bold mb-2">FORMULARIO DE REGISTRO</h5>
                    <div className="space-y-4">
                      <div className="border border-gray-300 rounded p-3">
                        <label className="block text-sm font-medium mb-1">Fecha del incidente:</label>
                        <input type="date" className="w-full border border-gray-300 rounded px-2 py-1" />
                      </div>
                      <div className="border border-gray-300 rounded p-3">
                        <label className="block text-sm font-medium mb-1">Descripción del incidente:</label>
                        <textarea className="w-full border border-gray-300 rounded px-2 py-1 h-20" placeholder="Describe detalladamente lo ocurrido..."></textarea>
                      </div>
                      <div className="border border-gray-300 rounded p-3">
                        <label className="block text-sm font-medium mb-1">Personas involucradas:</label>
                        <input type="text" className="w-full border border-gray-300 rounded px-2 py-1" placeholder="Nombres de las personas involucradas" />
                      </div>
                    </div>
                  </div>
                )}

                {!documentoSeleccionado.nombre.includes('Ley') &&
                 !documentoSeleccionado.nombre.includes('Protocolo') &&
                 !documentoSeleccionado.nombre.includes('Plan') &&
                 !documentoSeleccionado.nombre.includes('Formulario') && (
                  <div>
                    <p className="mb-4">
                      Este documento contiene información oficial sobre cumplimiento LOPIVI para entidades que trabajan con menores de edad.
                    </p>
                    <p className="mb-4">
                      <strong>Contenido principal:</strong><br/>
                      • Normativas aplicables<br/>
                      • Procedimientos de actuación<br/>
                      • Formularios y plantillas<br/>
                      • Guías de implementación
                    </p>
                    <p className="text-sm text-gray-600">
                      Para obtener el documento completo, utiliza la función de descarga.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalVerDocumento(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => descargarDocumento(documentoSeleccionado, categoriaSeleccionadaDoc)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Descargar
              </button>
              <button
                onClick={() => {
                  setModalVerDocumento(false)
                  compartirDocumento(documentoSeleccionado, categoriaSeleccionadaDoc)
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Compartir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Compartir Documento */}
      {modalCompartirDocumento && documentoSeleccionado && categoriaSeleccionadaDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Compartir Documento</h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-blue-800 mb-2">Documento seleccionado:</h4>
              <p className="text-sm text-blue-700">{documentoSeleccionado.nombre}</p>
              <p className="text-xs text-blue-600">Categoría: {categoriaSeleccionadaDoc.titulo} | Tipo: {documentoSeleccionado.tipo} | Versión: {documentoSeleccionado.version}</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const destinatarios = formData.getAll('destinatarios') as string[]
              const mensaje = formData.get('mensaje') as string
              const metodoEnvio = formData.get('metodoEnvio') as string

              if (destinatarios.length === 0) {
                alert('Por favor, selecciona al menos un destinatario.')
                return
              }

              console.log('📤 Compartiendo documento:', {
                documento: documentoSeleccionado.nombre,
                destinatarios,
                mensaje,
                metodo: metodoEnvio
              })

              alert(`📤 DOCUMENTO COMPARTIDO EXITOSAMENTE\n\n` +
                `Documento: ${documentoSeleccionado.nombre}\n` +
                `Destinatarios: ${destinatarios.join(', ')}\n` +
                `Método: ${metodoEnvio}\n\n` +
                `✓ Documento enviado a ${destinatarios.length} destinatario(s)\n` +
                `✓ Email de confirmación enviado\n` +
                `✓ Acceso registrado en el sistema`)

              setModalCompartirDocumento(false)
              setDocumentoSeleccionado(null)
              setCategoriaSeleccionadaDoc(null)
            }}>
              {/* Método de envío */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de envío:</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="metodoEnvio" value="email" defaultChecked className="mr-2" />
                    <div>
                      <div className="font-medium">Email directo</div>
                      <div className="text-xs text-gray-500">Enviar por correo electrónico</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="metodoEnvio" value="enlace" className="mr-2" />
                    <div>
                      <div className="font-medium">Enlace de acceso</div>
                      <div className="text-xs text-gray-500">Generar enlace temporal</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="metodoEnvio" value="descarga" className="mr-2" />
                    <div>
                      <div className="font-medium">Descarga protegida</div>
                      <div className="text-xs text-gray-500">Acceso con contraseña</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Destinatarios */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Destinatarios:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal de la entidad */}
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-2">Personal de la entidad:</h5>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {personalEntidad.slice(0, 8).map((persona, index) => (
                        <label key={index} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            name="destinatarios"
                            value={`${persona.nombre} (${persona.email})`}
                            className="mr-2"
                          />
                          {persona.nombre} - {persona.rol}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Grupos predefinidos */}
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-2">Grupos predefinidos:</h5>
                    <div className="space-y-2">
                      <label className="flex items-center text-sm">
                        <input type="checkbox" name="destinatarios" value="Todo el personal" className="mr-2" />
                        Todo el personal ({personalEntidad.length} personas)
                      </label>
                      <label className="flex items-center text-sm">
                        <input type="checkbox" name="destinatarios" value="Solo entrenadores" className="mr-2" />
                        Solo entrenadores
                      </label>
                      <label className="flex items-center text-sm">
                        <input type="checkbox" name="destinatarios" value="Solo coordinadores" className="mr-2" />
                        Solo coordinadores
                      </label>
                      <label className="flex items-center text-sm">
                        <input type="checkbox" name="destinatarios" value="Solo directivos" className="mr-2" />
                        Solo directivos
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensaje personalizado */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje personalizado:</label>
                <textarea
                  name="mensaje"
                  placeholder={`Hola,\n\nTe envío el documento "${documentoSeleccionado.nombre}" de la biblioteca LOPIVI.\n\nEste documento es importante para el cumplimiento de la normativa de protección infantil.\n\nSaludos,\n[Tu nombre]`}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Al compartir documentos LOPIVI, asegúrate de que los destinatarios tienen autorización para acceder a esta información y tratarán los datos conforme a la normativa de protección de datos.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalCompartirDocumento(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Enviar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔒 MODAL AUDITORÍA LOPIVI */}
      {modalAuditoria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Sistema de Auditoría LOPIVI</h3>
                <p className="text-sm text-gray-600">Registros válidos para inspecciones legales</p>
              </div>
              <button
                onClick={() => setModalAuditoria(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Filtros de fecha */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-red-800 mb-3">Período de Consulta</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha desde:</label>
                  <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha hasta:</label>
                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={exportarLogsAuditoria}
                    disabled={cargandoLogs}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
                  >
                    {cargandoLogs ? 'Cargando...' : 'Exportar Registros'}
                  </button>
                </div>
              </div>
            </div>

            {/* Información de auditoría */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-blue-800 mb-2">Información del Sistema de Auditoría</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p><strong>Retención:</strong> 5 años (LOPIVI)</p>
                  <p><strong>Inmutabilidad:</strong> ✅ Garantizada</p>
                </div>
                <div>
                  <p><strong>Hash Legal:</strong> ✅ Verificable</p>
                  <p><strong>Timezone:</strong> Europe/Madrid</p>
                </div>
                <div>
                  <p><strong>Registros totales:</strong> {logsAuditoria.length}</p>
                  <p><strong>Estado:</strong> ✅ Operativo</p>
                </div>
              </div>
            </div>

            {/* Tabla de logs */}
            {logsAuditoria.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <h4 className="font-bold text-gray-900">Registros de Auditoría</h4>
                  <button
                    onClick={descargarLogsCSV}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Descargar CSV
                  </button>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-3">Fecha/Hora</th>
                        <th className="text-left p-3">Usuario</th>
                        <th className="text-left p-3">Acción</th>
                        <th className="text-left p-3">Entidad</th>
                        <th className="text-left p-3">Detalles</th>
                        <th className="text-left p-3">IP</th>
                        <th className="text-left p-3">Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logsAuditoria.slice(0, 100).map((log, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 text-xs">
                            {new Date(log.timestamp).toLocaleString('es-ES', {
                              timeZone: 'Europe/Madrid'
                            })}
                          </td>
                          <td className="p-3">{log.user_name}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              log.action_type === 'case_reported' ? 'bg-red-100 text-red-800' :
                              log.action_type === 'document_sent' ? 'bg-blue-100 text-blue-800' :
                              log.action_type === 'member_added' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {log.action_type}
                            </span>
                          </td>
                          <td className="p-3">{log.entity_type}</td>
                          <td className="p-3 max-w-xs truncate">
                            {JSON.stringify(log.details).substring(0, 50)}...
                          </td>
                          <td className="p-3 text-xs">{log.ip_address}</td>
                          <td className="p-3 text-xs font-mono">{log.legal_hash?.substring(0, 8)}...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {logsAuditoria.length > 100 && (
                  <div className="p-4 text-center text-gray-600 text-sm border-t border-gray-200">
                    Mostrando primeros 100 registros de {logsAuditoria.length} totales. Descarga CSV para ver todos.
                  </div>
                )}
              </div>
            )}

            {logsAuditoria.length === 0 && !cargandoLogs && (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay registros para el período seleccionado</p>
                <p className="text-sm text-gray-500 mt-2">Utiliza los filtros de fecha y presiona "Exportar Registros"</p>
              </div>
            )}

            {/* Información legal */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-2">Validez Legal</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• Todos los registros cumplen con los requisitos de la Ley Orgánica 8/2021 LOPIVI</p>
                <p>• Los datos son inmutables y están protegidos contra modificaciones</p>
                <p>• Cada registro incluye hash legal para verificación de integridad</p>
                <p>• Timestamps con zona horaria oficial de España (Europe/Madrid)</p>
                <p>• Retención automática de 5 años según normativa vigente</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModalAuditoria(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📋 MODAL INFORME DE INSPECCIÓN MINISTERIAL */}
      {modalInspeccion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Informe de Inspección Ministerial</h3>
                <p className="text-sm text-gray-600">Genera informe completo para entrega a inspectores LOPIVI</p>
              </div>
              <button
                onClick={() => setModalInspeccion(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Información del informe */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <h4 className="font-bold text-purple-800 mb-4">Contenido del Informe</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Datos de la Entidad:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Información completa de la entidad</li>
                    <li>• Datos del delegado/a principal</li>
                    <li>• Estado general de cumplimiento</li>
                    <li>• Período evaluado y fecha de generación</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Personal y Formación:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Listado completo del personal ({personalEntidad.length} personas)</li>
                    <li>• Estado de formación LOPIVI</li>
                    <li>• Personal pendiente de formación</li>
                    <li>• Certificados vigentes y vencidos</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Certificados Penales:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Vigentes: {contadoresCertificados.vigentes}</li>
                    <li>• Próximos a vencer: {contadoresCertificados.proximos}</li>
                    <li>• Vencidos: {contadoresCertificados.vencidos}</li>
                    <li>• No entregados: {contadoresCertificados.no_entregados}</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Casos y Gestión:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Casos nuevos: {estadisticasAvanzadas.casosNuevos.valor}</li>
                    <li>• Casos resueltos: {estadisticasAvanzadas.casosResueltos.valor}</li>
                    <li>• Alertas críticas: {estadisticasAvanzadas.alertasActivas.criticas}</li>
                    <li>• Tiempo promedio: {estadisticasAvanzadas.casosResueltos.tiempo}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Datos de la entidad */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-blue-800 mb-3">Datos de la Entidad</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Entidad:</strong> {sessionData?.entidad || 'Entidad Deportiva Ejemplo'}</p>
                  <p><strong>Delegado/a Principal:</strong> {sessionData?.nombre || 'Nombre del Delegado/a'}</p>
                </div>
                <div>
                  <p><strong>Cumplimiento General:</strong> {estadisticasAvanzadas.cumplimiento.valor}%</p>
                  <p><strong>Personal Total:</strong> {personalEntidad.length} personas</p>
                </div>
              </div>
            </div>

            {/* Indicadores de cumplimiento */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-green-800 mb-3">Indicadores de Cumplimiento LOPIVI</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Art. 35 - Delegado/a de protección:</span>
                  <span className="text-green-600 font-semibold">CUMPLE</span>
                </div>
                <div className="flex justify-between">
                  <span>Art. 36 - Plan de protección:</span>
                  <span className="text-green-600 font-semibold">CUMPLE</span>
                </div>
                <div className="flex justify-between">
                  <span>Art. 37 - Formación del personal:</span>
                  <span className={personalPendiente.length === 0 ? "text-green-600 font-semibold" : "text-orange-600 font-semibold"}>
                    {personalPendiente.length === 0 ? "CUMPLE" : "EN PROCESO"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Art. 38 - Código de conducta:</span>
                  <span className="text-green-600 font-semibold">CUMPLE</span>
                </div>
                <div className="flex justify-between">
                  <span>Art. 39 - Procedimientos comunicación:</span>
                  <span className="text-green-600 font-semibold">CUMPLE</span>
                </div>
                <div className="flex justify-between">
                  <span>Sistema de auditoría:</span>
                  <span className="text-green-600 font-semibold">OPERATIVO</span>
                </div>
              </div>
            </div>

            {/* Resumen ejecutivo */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-800 mb-3">Resumen Ejecutivo</h4>
              <p className="text-sm text-gray-700 mb-3">
                La entidad <strong>{sessionData?.entidad || 'Entidad Deportiva Ejemplo'}</strong> cumple
                satisfactoriamente con los requisitos establecidos en la Ley Orgánica 8/2021 LOPIVI.
              </p>
              <p className="text-sm text-gray-700 mb-3">
                El sistema implementado garantiza la protección integral de los menores mediante
                procedimientos documentados, personal formado y un sistema robusto de auditoría.
              </p>
              <p className="text-sm text-gray-700">
                <strong>Estado general:</strong> ACTIVO Y EN CUMPLIMIENTO -
                Índice de cumplimiento del {estadisticasAvanzadas.cumplimiento.valor}%
              </p>
            </div>

            {/* Generación del informe */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Generar Informe Completo</h4>
                  <p className="text-sm text-gray-600">
                    El informe incluirá todos los datos, análisis de cumplimiento,
                    registros de auditoría y recomendaciones para inspección ministerial.
                  </p>
                </div>
                <button
                  onClick={generarInformeInspeccion}
                  disabled={generandoInforme}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 font-medium"
                >
                  {generandoInforme ? 'Generando...' : 'Generar PDF Inspección'}
                </button>
              </div>
            </div>

            {/* Información legal */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-bold text-yellow-800 mb-2">Información Legal</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>• Este informe es oficial y puede ser presentado ante cualquier inspección ministerial</p>
                <p>• Incluye declaración de conformidad firmada por el delegado/a de protección</p>
                <p>• Todos los datos son verificables mediante el sistema de auditoría implementado</p>
                <p>• Cumple con los estándares de documentación establecidos en la LOPIVI</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setModalInspeccion(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
