'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  const [tipoEmergenciaSeleccionado, setTipoEmergenciaSeleccionado] = useState<string | null>(null)
  const [modalNotificaciones, setModalNotificaciones] = useState(false)

  // Nuevos modales para estadísticas
  const [modalCasoNuevo, setModalCasoNuevo] = useState(false)
  const [modalCasosResueltos, setModalCasosResueltos] = useState(false)
  const [modalCumplimiento, setModalCumplimiento] = useState(false)
  const [modalAlertas, setModalAlertas] = useState(false)
  const [modalCertificados, setModalCertificados] = useState(false)
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
    personaInvolucrada: '',
    fechaIncidente: '',
    prioridad: '',
    testigos: '',
    accionesInmediatas: ''
  })

  // Estados para funcionalidades adicionales
  const [mostrarGuiaPrioridades, setMostrarGuiaPrioridades] = useState(false)
  const [elementoSeleccionado, setElementoSeleccionado] = useState<string | null>(null)
  const [alertaResolviendose, setAlertaResolviendose] = useState<string | null>(null)

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

  // Función para resolver alertas
  const resolverAlerta = (alertaId: string) => {
    setAlertaResolviendose(alertaId)
    // Simular proceso de resolución
    setTimeout(() => {
      console.log(`Alerta ${alertaId} marcada como resuelta`)
      setAlertaResolviendose(null)
      // Aquí se actualizaría el estado de la alerta en una app real
    }, 2000)
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

  // Contar notificaciones por prioridad
  const conteoNotificaciones = {
    criticas: notificacionesLOPIVI.filter(n => n.prioridad === 'critica').length,
    altas: notificacionesLOPIVI.filter(n => n.prioridad === 'alta').length,
    medias: notificacionesLOPIVI.filter(n => n.prioridad === 'media').length,
    total: notificacionesLOPIVI.length
  }

  // Función para marcar notificación como completada
  const completarNotificacion = (notificacionId: string) => {
    console.log(`Marcando notificación ${notificacionId} como completada`)
    // En una app real, esto actualizaría el estado
  }

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
    console.log('Enviando documentación:', envioDoc)
    if (envioDoc.emailAdicional) {
      console.log('Email adicional incluido:', envioDoc.emailAdicional)
    }
    setModalEnviarDoc(false)
    setEnvioDoc({ destinatarios: [], documentos: [], asunto: '', mensaje: '', emailAdicional: '' })
  }

  const agregarMiembro = () => {
    console.log('Agregando nuevo miembro:', nuevoMiembro)
    setModalNuevoMiembro(false)
    setNuevoMiembro({ nombre: '', email: '', rol: '', fechaIncorporacion: '', documentacion: [], mensaje: '' })
  }

  const crearCaso = () => {
    console.log('Creando nuevo caso:', nuevoCaso)
    setModalCasoNuevo(false)
    setNuevoCaso({ tipo: '', titulo: '', descripcion: '', personaInvolucrada: '', fechaIncidente: '', prioridad: '', testigos: '', accionesInmediatas: '' })
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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard del Delegado Principal</h1>
                <p className="text-sm text-gray-600">{sessionData.entidad} • Sistema LOPIVI</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <div className="font-medium text-gray-900">{sessionData.nombre}</div>
                <div className="text-green-600 font-medium">Certificado Vigente</div>
              </div>
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
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

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Acciones Principales */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Acciones Principales</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Botón Enviar Documentación */}
            <button
              onClick={() => setModalEnviarDoc(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2">Enviar Documentación</h4>
                <p className="text-sm text-blue-100">Enviar protocolos y documentos a miembros de la entidad</p>
              </div>
            </button>

            {/* Botón Caso de Emergencia */}
            <button
              onClick={() => setModalEmergencia(true)}
              className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2">Caso de Emergencia</h4>
                <p className="text-sm text-red-100">Protocolos de actuación ante situaciones críticas</p>
              </div>
            </button>

            {/* Botón Personal */}
            <button
              onClick={() => setModalPersonalCompleto(true)}
              className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2">Personal</h4>
                <p className="text-sm text-green-100">Gestionar miembros y ver historial de interacciones</p>
              </div>
            </button>

            {/* Botón Centro de Notificaciones */}
            <button
              onClick={() => setModalNotificaciones(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl transition-all hover:scale-105 shadow-lg relative"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2">Centro de Notificaciones</h4>
                <p className="text-sm text-purple-100">Recordatorios y tareas pendientes LOPIVI</p>
                {conteoNotificaciones.total > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {conteoNotificaciones.total}
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Sistema de Comunicación */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Sistema de Comunicación</h3>
            <button
              onClick={() => setModalNuevoMiembro(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Nuevo Miembro
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <button className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200">
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

                        <div className="flex gap-2 flex-wrap">
                          <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition-colors">
                            Contactar
                          </button>
                          <button className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-xs hover:bg-green-200 transition-colors">
                            Enviar Doc
                          </button>
                          {persona.estado === 'Formación Pendiente' && (
                            <button className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg text-xs hover:bg-orange-200 transition-colors">
                              Recordar
                            </button>
                          )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Persona involucrada" value={nuevoCaso.personaInvolucrada} onChange={(e) => setNuevoCaso({...nuevoCaso, personaInvolucrada: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2" />
              <input type="date" value={nuevoCaso.fechaIncidente} onChange={(e) => setNuevoCaso({...nuevoCaso, fechaIncidente: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2" />
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
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Casos Resueltos ({casosResueltos.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Título</th>
                    <th className="text-left p-3">Tipo</th>
                    <th className="text-left p-3">Fecha Reporte</th>
                    <th className="text-left p-3">Fecha Resolución</th>
                    <th className="text-left p-3">Responsable</th>
                    <th className="text-left p-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {casosResueltos.map((caso) => (
                    <tr key={caso.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{caso.id}</td>
                      <td className="p-3">{caso.titulo}</td>
                      <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{caso.tipo}</span></td>
                      <td className="p-3">{caso.fechaReporte}</td>
                      <td className="p-3">{caso.fechaResolucion}</td>
                      <td className="p-3">{caso.responsable}</td>
                      <td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">{caso.estado}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setModalCasosResueltos(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">Cerrar</button>
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
                      <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">+{elemento.impacto}</span>
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
                        <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs hover:bg-blue-200 transition-colors">
                          Contactar
                        </button>
                        <button className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs hover:bg-green-200 transition-colors">
                          Marcar Completo
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
                  console.log(`Enviando recordatorio para ${elementoSeleccionado}`)
                  setElementoSeleccionado(null)
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Enviar Recordatorio
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
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-sm text-blue-800 font-medium">Proceso de resolución iniciado:</p>
                      <div className="text-xs text-blue-700 mt-1 space-y-1">
                        <p>1. ✓ Alerta marcada como "En proceso"</p>
                        <p>2. ✓ Notificación enviada al responsable</p>
                        <p>3. ⏳ Documentando resolución...</p>
                        <p className="text-blue-600 font-medium">La alerta se archivará automáticamente al completar el proceso.</p>
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
                      <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm hover:bg-blue-200 transition-colors">Renovar</button>
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
              {notificacionesLOPIVI
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
                          onClick={() => console.log(`Navegando a ${notificacion.enlaceAccion}`)}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition-colors font-medium"
                        >
                          {notificacion.accionRequerida}
                        </button>
                        <button
                          onClick={() => completarNotificacion(notificacion.id)}
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
                    {notificacionesLOPIVI.filter(n => n.diasRestantes <= 7).length} tareas críticas
                  </p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Próximos 30 días:</p>
                  <p className="text-blue-700">
                    {notificacionesLOPIVI.filter(n => n.diasRestantes <= 30).length} tareas importantes
                  </p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Categoría más urgente:</p>
                  <p className="text-blue-700">
                    {notificacionesLOPIVI.find(n => n.prioridad === 'critica')?.categoria || 'Certificaciones'}
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
    </div>
  )
}
