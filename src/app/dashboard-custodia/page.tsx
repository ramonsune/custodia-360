'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { jsPDF } from 'jspdf'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'admin_custodia'
  entidad: string
}

interface EntidadData {
  id: string
  nombre: string
  plan: string
  fechaContratacion: string
  estado: 'activo' | 'pendiente' | 'cancelado'
  delegadoPrincipal: string
  importeTotal: number
  numeroMenores: string
  emailContratante: string
}

interface MetricasData {
  entidadesActivas: number
  entidadesTotales: number
  delegadosActivos: number
  facturacionMensual: number
  facturacionAnual: number
}

export default function DashboardCustodia() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [metricas, setMetricas] = useState<MetricasData | null>(null)
  const [entidades, setEntidades] = useState<EntidadData[]>([])
  const [entidadSeleccionada, setEntidadSeleccionada] = useState<EntidadData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showGenerarInformeModal, setShowGenerarInformeModal] = useState(false)
  const [showEnviarComunicacionModal, setShowEnviarComunicacionModal] = useState(false)
  const [showInformeViewer, setShowInformeViewer] = useState(false)
  const [tipoInformeViewer, setTipoInformeViewer] = useState('')
  const [showInformePersonalizadoModal, setShowInformePersonalizadoModal] = useState(false)
  const [showInformeCompletoModal, setShowInformeCompletoModal] = useState(false)
  const [showCertificadoModal, setShowCertificadoModal] = useState(false)
  const [entidadInformeCompleto, setEntidadInformeCompleto] = useState<EntidadData | null>(null)

  // Función para mostrar informe en modal
  const mostrarInformeEnModal = (tipo: string) => {
    setTipoInformeViewer(tipo)
    setShowInformeViewer(true)
  }

  // Función para mostrar informe completo de entidad
  const mostrarInformeCompleto = (entidad: EntidadData) => {
    setEntidadInformeCompleto(entidad)
    setShowInformeCompletoModal(true)
  }

  // Función para mostrar certificado de entidad
  const mostrarCertificado = (entidad: EntidadData) => {
    setEntidadInformeCompleto(entidad)
    setShowCertificadoModal(true)
  }

  // Función para enviar documento por email
  const enviarDocumentoPorEmail = (tipo: string, entidad?: EntidadData) => {
    alert(`Enviando ${tipo} ${entidad ? `de ${entidad.nombre}` : ''} por email...`)
  }

  useEffect(() => {
    // Crear sesión demo automáticamente
    const demoSession: SessionData = {
      id: 'admin-custodia-demo',
      nombre: 'Administrador Custodia360',
      email: 'admin@custodia360.com',
      tipo: 'admin_custodia',
      entidad: 'Custodia360 Admin'
    }

    setSessionData(demoSession)

    // Datos simulados del negocio
    const metricasData: MetricasData = {
      entidadesActivas: 127,
      entidadesTotales: 134,
      delegadosActivos: 203,
      facturacionMensual: 12750,
      facturacionAnual: 153000
    }

    const entidadesData: EntidadData[] = [
      {
        id: 'ENT-001',
        nombre: 'Club Deportivo Ejemplo',
        plan: 'Plan 500',
        fechaContratacion: '2024-01-15',
        estado: 'activo',
        delegadoPrincipal: 'Juan García Rodríguez',
        importeTotal: 210,
        numeroMenores: '201-500',
        emailContratante: 'director@custodia360.com'
      },
      {
        id: 'ENT-002',
        nombre: 'Academia Deportiva Madrid',
        plan: 'Plan 200',
        fechaContratacion: '2024-01-10',
        estado: 'activo',
        delegadoPrincipal: 'Carlos Ruiz Sánchez',
        importeTotal: 98,
        numeroMenores: '51-200',
        emailContratante: 'presidenta@academia.com'
      },
      {
        id: 'ENT-003',
        nombre: 'Club Deportivo Nuevo',
        plan: 'Plan 50',
        fechaContratacion: '2024-01-20',
        estado: 'pendiente',
        delegadoPrincipal: 'Ana Fernández López',
        importeTotal: 38,
        numeroMenores: '1-50',
        emailContratante: 'responsable@nuevaentidad.com'
      }
    ]

    setMetricas(metricasData)
    setEntidades(entidadesData)
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userSession')
    sessionStorage.removeItem('userSession')
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Función para generar PDF mejorada
  const generarPDF = (tipo: string, titulo: string, contenido?: string) => {
    const doc = new jsPDF()

    // Header mejorado
    doc.setFontSize(24)
    doc.setTextColor(59, 130, 246)
    doc.text('CUSTODIA360', 20, 20)

    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text(titulo, 20, 35)

    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 45)

    doc.setFontSize(12)
    let yPosition = 60

    let contenidoDefault = ''
    switch (tipo) {
      case 'mensual':
        contenidoDefault = `
INFORME EJECUTIVO MENSUAL - ${new Date().toLocaleDateString('es-ES')}

RESUMEN EJECUTIVO
- Entidades activas: ${metricas?.entidadesActivas || 0}
- Delegados certificados: ${metricas?.delegadosActivos || 0}
- Facturación mensual: ${formatCurrency(metricas?.facturacionMensual || 0)}
- Tasa de cumplimiento: 94.2%

MÉTRICAS OPERATIVAS
- Nuevas contrataciones: 15
- Renovaciones completadas: 8
- Formaciones realizadas: 23
- Incidencias resueltas: 3

ANÁLISIS DE CUMPLIMIENTO
- Entidades con cumplimiento completo: 89%
- Entidades en proceso de implementación: 8%
- Entidades con documentación pendiente: 3%

PROYECCIONES
- Crecimiento esperado próximo mes: +12%
- Renovaciones programadas: 18
- Formaciones planificadas: 27

Documento generado automáticamente por Custodia360
        `
        break
      case 'trimestral':
        contenidoDefault = `
INFORME TRIMESTRAL Q1 2025

RESUMEN EJECUTIVO DEL TRIMESTRE
- Crecimiento de entidades: +18.5%
- Retención de clientes: 96.1%
- Satisfacción promedio: 4.8/5
- Ingresos del trimestre: ${formatCurrency((metricas?.facturacionMensual || 0) * 3)}

ANÁLISIS DE TENDENCIAS
- Mayor adopción en sector deportivo
- Incremento en formaciones especializadas
- Reducción de incidencias en 23%
- Mejora en tiempos de implementación

CUMPLIMIENTO NORMATIVO
- 100% de entidades con protocolos actualizados
- 98% de delegados con certificación vigente
- 95% de personal formado según normativa

OBJETIVOS PRÓXIMO TRIMESTRE
- Incrementar base de clientes en 25%
- Lanzar nuevos módulos formativos
- Implementar sistema de alertas automáticas

Documento generado automáticamente por Custodia360
        `
        break
      case 'anual':
        contenidoDefault = `
INFORME ANUAL 2024 - RESUMEN EJECUTIVO

LOGROS DEL AÑO
- Crecimiento total: +45%
- Entidades incorporadas: 47 nuevas
- Delegados formados: 156
- Ingresos anuales: ${formatCurrency(metricas?.facturacionAnual || 0)}

HITOS DESTACADOS
- Certificación oficial como entidad formadora
- Desarrollo de plataforma digital avanzada
- Alianzas estratégicas con federaciones deportivas
- Reconocimiento por excelencia en cumplimiento LOPIVI

IMPACTO SOCIAL
- Más de 12.000 menores protegidos
- 247 delegados certificados activos
- 98.5% de tasa de prevención de incidencias
- Cobertura en 15 comunidades autónomas

PROYECCIONES 2025
- Objetivo de crecimiento: +60%
- Nuevos servicios de consultoría
- Expansión internacional
- Digitalización completa de procesos

Documento generado automáticamente por Custodia360
        `
        break
    }

    const textoFinal = contenido || contenidoDefault
    const lines = textoFinal.trim().split('\n')

    lines.forEach(line => {
      if (line.trim() === '') {
        yPosition += 5
      } else {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line.trim(), 20, yPosition)
        yPosition += 5
      }
    })

    // Footer
    doc.setFontSize(8)
    doc.text('Custodia360 - Solución integral para el cumplimiento LOPIVI', 20, 285)

    doc.save(`${tipo}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Función para generar PDFs descargables corregida - SIN caracteres especiales problemáticos
  const generarPDFGuiaOficial = (tipo: string) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Función auxiliar para control de página
      const checkPageBreak = (requiredSpace = 30) => {
        if (yPosition > pageHeight - requiredSpace) {
          doc.addPage()
          addHeader()
          yPosition = 30
        }
      }

      // Función para agregar header profesional
      const addHeader = () => {
        doc.setDrawColor(59, 130, 246)
        doc.setLineWidth(1)
        doc.line(15, 15, pageWidth - 15, 15)

        doc.setFontSize(20)
        doc.setTextColor(59, 130, 246)
        doc.setFont('helvetica', 'bold')
        doc.text('CUSTODIA360', 20, 25)

        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.setFont('helvetica', 'normal')
        doc.text('Sistema Integral de Cumplimiento LOPIVI', pageWidth - 20, 25, { align: 'right' })

        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.5)
        doc.line(15, 28, pageWidth - 15, 28)
      }

      addHeader()
      yPosition = 40

      doc.setFontSize(18)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')

      let titulo = ''
      let contenido: string[] = []

      switch (tipo) {
        case 'manual-lopivi':
          titulo = 'MANUAL COMPLETO LOPIVI'
          contenido = [
            'INDICE DEL MANUAL',
            '1. Introduccion y Marco Legal',
            '2. Objetivos y Principios Rectores',
            '3. Obligaciones para Entidades',
            '4. Protocolos de Actuacion',
            '5. Formacion del Personal',
            '6. Sistemas de Prevencion',
            '7. Procedimientos de Emergencia',
            '8. Documentacion Requerida',
            '9. Regimen Sancionador',
            '10. Implementacion con Custodia360',
            '',
            '================================================================',
            '1. INTRODUCCION Y MARCO LEGAL',
            '================================================================',
            '',
            'La Ley Organica 8/2021, de 4 de junio, de proteccion integral a la infancia y',
            'la adolescencia frente a la violencia (LOPIVI), constituye el marco normativo',
            'mas avanzado de Europa para la proteccion de menores.',
            '',
            'DESARROLLO NORMATIVO:',
            '- Real Decreto 1070/2022: Desarrollo del Plan de Proteccion',
            '- Resolucion de 10 de agosto de 2022: Formacion especializada',
            '- Circular FGE 3/2022: Protocolo de actuacion judicial',
            '',
            'AMBITO DE APLICACION TERRITORIAL:',
            '- Todo el territorio espanol',
            '- Centros educativos y deportivos',
            '- Entidades de ocio y tiempo libre',
            '- Organizaciones que trabajen con menores',
            '',
            '================================================================',
            '2. OBJETIVOS Y PRINCIPIOS RECTORES',
            '================================================================',
            '',
            'OBJETIVOS GENERALES:',
            '- Garantizar los derechos fundamentales de menores',
            '- Establecer medidas de proteccion integral',
            '- Crear sistemas efectivos de prevencion',
            '- Facilitar la deteccion temprana de riesgos',
            '- Coordinar la respuesta institucional',
            '',
            'PRINCIPIOS FUNDAMENTALES:',
            '1. Interes superior del menor (Art. 2 LOPIVI)',
            '2. No discriminacion e igualdad de trato',
            '3. Derecho a la vida, supervivencia y desarrollo',
            '4. Participacion y expresion libre de opiniones',
            '5. Efectividad y aplicacion sistematica',
            '6. Proporcionalidad en las medidas adoptadas',
            '',
            '================================================================',
            '3. OBLIGACIONES ESPECIFICAS PARA ENTIDADES',
            '================================================================',
            '',
            'REQUISITOS OBLIGATORIOS (Art. 35 LOPIVI):',
            '',
            'A) DELEGADO/A DE PROTECCION:',
            '- Designacion obligatoria y formal',
            '- Formacion especializada certificada',
            '- Funciones claramente definidas',
            '- Acceso directo a la direccion',
            '- Dedicacion minima segun tamano de entidad',
            '',
            'B) PLAN DE PROTECCION:',
            '- Documento formal y actualizado',
            '- Analisis de riesgos especificos',
            '- Medidas preventivas concretas',
            '- Protocolos de actuacion definidos',
            '- Sistema de seguimiento y evaluacion',
            '',
            'C) CODIGO DE CONDUCTA:',
            '- Normas claras de comportamiento',
            '- Prohibiciones especificas',
            '- Consecuencias por incumplimiento',
            '- Comunicacion a todo el personal',
            '- Aceptacion formal y documentada',
            '',
            'D) FORMACION OBLIGATORIA:',
            '- Personal en contacto directo: 20 horas',
            '- Personal ocasional: 8 horas',
            '- Directivos y coordinadores: 30 horas',
            '- Reciclaje anual obligatorio',
            '- Certificacion requerida',
            '',
            '================================================================',
            '4. REGIMEN SANCIONADOR',
            '================================================================',
            '',
            'INFRACCIONES LEVES (Art. 71):',
            '- Multa: 10.000 - 50.000 euros',
            '- Incumplimientos menores de documentacion',
            '- Retrasos en la formacion del personal',
            '',
            'INFRACCIONES GRAVES (Art. 72):',
            '- Multa: 50.001 - 500.000 euros',
            '- Falta de delegado de proteccion',
            '- Plan de proteccion inexistente o inadecuado',
            '',
            'INFRACCIONES MUY GRAVES (Art. 73):',
            '- Multa: 500.001 - 1.000.000 euros',
            '- Clausura temporal del centro',
            '- Inhabilitacion para trabajar con menores',
            '- Poner en peligro la integridad de menores',
            '',
            'MEDIDAS ACCESORIAS:',
            '- Publicacion de la sancion',
            '- Decomiso de materiales inadecuados',
            '- Suspension de subvenciones publicas',
            '- Exclusion de contratos publicos',
            '',
            '================================================================',
            '5. IMPLEMENTACION CON CUSTODIA360',
            '================================================================',
            '',
            'VENTAJAS DEL SISTEMA INTEGRAL:',
            '',
            'AUTOMATIZACION COMPLETA:',
            '- Generacion automatica del Plan de Proteccion',
            '- Codigo de Conducta personalizado por actividad',
            '- Protocolos especificos para cada situacion',
            '- Documentacion siempre actualizada',
            '',
            'FORMACION CERTIFICADA:',
            '- Campus virtual especializado',
            '- Contenidos actualizados segun normativa',
            '- Certificados validos',
            '- Seguimiento automatico de caducidades',
            '',
            'MONITOREO CONTINUO:',
            '- Panel de control en tiempo real',
            '- Alertas automaticas de vencimientos',
            '- Informes de cumplimiento generados',
            '- Registro de todas las actividades',
            '',
            'PROTECCION JURIDICA:',
            '- Cumplimiento integral garantizado',
            '- Documentacion valida para inspecciones',
            '- Asesoramiento legal especializado',
            '- Actualizaciones automaticas normativas',
            '',
            'SOPORTE PROFESIONAL 24/7:',
            '- Equipo de expertos en LOPIVI',
            '- Respuesta inmediata ante emergencias',
            '- Acompanamiento en inspecciones',
            '- Formacion continua del equipo',
            '',
            '================================================================',
            'CONTACTO Y SOPORTE',
            '================================================================',
            '',
            'Telefono: +34 900 123 456',
            'Email: soporte@custodia360.com',
            'Web: www.custodia360.com',
            'Horario: Lunes a Viernes 8:00-20:00h'
          ]
          break
        case 'protocolo-actuacion':
          titulo = 'PROTOCOLO DE ACTUACION LOPIVI'
          contenido = [
            'PROTOCOLO DE EMERGENCIA Y ACTUACION',
            '',
            '================================================================',
            '1. SISTEMA DE DETECCION TEMPRANA',
            '================================================================',
            '',
            'INDICADORES DE RIESGO FISICO:',
            '- Lesiones inexplicables o recurrentes',
            '- Marcas de golpes, quemaduras o mordeduras',
            '- Negligencia en higiene o alimentacion',
            '- Ropa inadecuada para el clima',
            '- Fatiga constante o somnolencia',
            '',
            'INDICADORES COMPORTAMENTALES:',
            '- Cambios subitos en el comportamiento',
            '- Agresividad extrema o retraimiento',
            '- Miedo desproporcionado a adultos',
            '- Comportamientos regresivos',
            '- Conocimiento sexual inapropiado para la edad',
            '',
            'INDICADORES ACADEMICOS/DEPORTIVOS:',
            '- Descenso repentino en rendimiento',
            '- Problemas de concentracion',
            '- Ausentismo frecuente e injustificado',
            '- Llegadas tempranas y salidas tardias',
            '- Evitacion de actividades especificas',
            '',
            '================================================================',
            '2. PROTOCOLO DE ACTUACION INMEDIATA',
            '================================================================',
            '',
            'RESPUESTA EN LOS PRIMEROS 30 MINUTOS:',
            '',
            'PASO 1 - SEGURIDAD INMEDIATA (0-5 min):',
            '- Garantizar la proteccion del menor',
            '- Separar al menor del agresor si esta presente',
            '- Evaluar necesidad de atencion medica urgente',
            '- Llamar al 112 si hay peligro inmediato',
            '',
            'PASO 2 - DOCUMENTACION (5-15 min):',
            '- Registrar hechos de forma objetiva',
            '- Fotografiar evidencias fisicas (si procede)',
            '- Anotar fecha, hora y circunstancias exactas',
            '- Identificar testigos presentes',
            '',
            'PASO 3 - COMUNICACION (15-30 min):',
            '- Informar inmediatamente al Delegado de Proteccion',
            '- Comunicar a la direccion de la entidad',
            '- Contactar servicios sanitarios si es necesario',
            '- Comunicar a Fuerzas de Seguridad (si procede)',
            '',
            '================================================================',
            '3. PROTOCOLO DE EMERGENCIA (112)',
            '================================================================',
            '',
            'CUANDO LLAMAR AL 112:',
            '- Peligro inmediato para la vida o integridad',
            '- Lesiones graves que requieran atencion urgente',
            '- Situaciones de violencia en curso',
            '- Amenazas directas de muerte o dano grave',
            '',
            'INFORMACION A PROPORCIONAR:',
            '- Ubicacion exacta del incidente',
            '- Numero de menores afectados',
            '- Naturaleza de la emergencia',
            '- Estado actual de la situacion',
            '- Identificacion de la entidad',
            '',
            '================================================================',
            '4. COMUNICACION CON AUTORIDADES',
            '================================================================',
            '',
            'TELEFONOS DE EMERGENCIA:',
            '- Emergencias generales: 112',
            '- Guardia Civil: 062',
            '- Policia Nacional: 091',
            '- Policia Local: 092',
            '- ANAR (Ayuda a Ninos): 900 20 20 10',
            '',
            'DOCUMENTACION A PREPARAR:',
            '- Informe detallado del incidente',
            '- Datos de identificacion del menor',
            '- Evidencias fotograficas (si las hay)',
            '- Declaraciones de testigos',
            '- Historial previo de incidentes',
            '',
            '================================================================',
            '5. COMUNICACION CON FAMILIAS',
            '================================================================',
            '',
            'PROTOCOLO DE INFORMACION A PADRES:',
            '',
            'CASOS DE EMERGENCIA MEDICA:',
            '- Comunicacion inmediata por telefono',
            '- Informacion sobre centro medico',
            '- Acompanamiento si es posible',
            '- Seguimiento posterior del estado',
            '',
            'CASOS DE SOSPECHA DE MALTRATO:',
            'PRECAUCION: No informar si los padres pueden ser',
            'los responsables del maltrato',
            '- Consultar con Delegado de Proteccion',
            '- Coordinar con Servicios Sociales',
            '- Seguir indicaciones de autoridades',
            '',
            'COMUNICACION GENERAL:',
            '- Reunion presencial preferible',
            '- Ambiente privado y confidencial',
            '- Presencia del Delegado de Proteccion',
            '- Documentar la comunicacion realizada',
            '',
            '================================================================',
            '6. SEGUIMIENTO Y EVALUACION',
            '================================================================',
            '',
            'REGISTRO DE INCIDENTES:',
            '- Base de datos confidencial',
            '- Acceso restringido al Delegado',
            '- Copia de seguridad encriptada',
            '- Tiempo de conservacion: 10 anos',
            '',
            'SEGUIMIENTO POST-INCIDENTE:',
            '- Evaluacion del menor afectado',
            '- Apoyo psicologico si es necesario',
            '- Revision de protocolos aplicados',
            '- Mejora continua de procedimientos',
            '',
            'ASPECTOS LEGALES:',
            '- Deber de denuncia (Art. 262 LECrim)',
            '- Confidencialidad y proteccion de datos',
            '- Colaboracion con autoridades',
            '- Asesoramiento juridico especializado'
          ]
          break
        case 'guia-implementacion':
          titulo = 'GUIA DE IMPLEMENTACION LOPIVI'
          contenido = [
            'GUIA COMPLETA DE IMPLEMENTACION',
            '',
            '================================================================',
            'CRONOGRAMA DE IMPLEMENTACION (12 SEMANAS)',
            '================================================================',
            '',
            'SEMANAS 1-2: ANALISIS Y PLANIFICACION',
            'SEMANAS 3-4: DESIGNACION Y FORMACION INICIAL',
            'SEMANAS 5-8: DESARROLLO DOCUMENTAL',
            'SEMANAS 9-10: FORMACION DEL PERSONAL',
            'SEMANAS 11-12: IMPLEMENTACION Y SEGUIMIENTO',
            '',
            '================================================================',
            'FASE 1: ANALISIS INICIAL (Semanas 1-2)',
            '================================================================',
            '',
            'AUDITORIA ORGANIZACIONAL:',
            '- Evaluacion de la estructura actual',
            '- Identificacion de personal en contacto con menores',
            '- Analisis de actividades y espacios',
            '- Revision de procedimientos existentes',
            '- Evaluacion de recursos disponibles',
            '',
            'ANALISIS DE RIESGOS:',
            '- Identificacion de situaciones de vulnerabilidad',
            '- Evaluacion de espacios fisicos',
            '- Analisis de actividades de riesgo',
            '- Revision de accesos y controles',
            '- Evaluacion de sistemas de comunicacion',
            '',
            'DOCUMENTACION REQUERIDA:',
            '- Organigrama actualizado',
            '- Listado de personal',
            '- Descripcion de actividades',
            '- Planos de instalaciones',
            '- Normativa interna existente',
            '',
            '================================================================',
            'FASE 2: DESIGNACION Y FORMACION (Semanas 3-4)',
            '================================================================',
            '',
            'SELECCION DEL DELEGADO/A DE PROTECCION:',
            '',
            'CRITERIOS DE SELECCION:',
            '- Experiencia minima de 3 anos en la organizacion',
            '- Capacidad de liderazgo y comunicacion',
            '- Conocimiento de la normativa LOPIVI',
            '- Disponibilidad horaria adecuada',
            '- Integridad y confidencialidad probadas',
            '',
            'PERFIL PROFESIONAL RECOMENDADO:',
            '- Formacion en educacion, psicologia o trabajo social',
            '- Experiencia en gestion de equipos',
            '- Conocimientos basicos en prevencion',
            '- Habilidades de comunicacion avanzadas',
            '',
            'FORMACION INICIAL DELEGADO:',
            '- Curso de 40 horas (presencial + online)',
            '- Marco legal LOPIVI completo',
            '- Tecnicas de deteccion de maltrato',
            '- Protocolos de actuacion especificos',
            '- Gestion de crisis y comunicacion',
            '- Examen de certificacion',
            '',
            '================================================================',
            'FASE 3: DESARROLLO DOCUMENTAL (Semanas 5-8)',
            '================================================================',
            '',
            'PLAN DE PROTECCION PERSONALIZADO:',
            '',
            'CONTENIDO OBLIGATORIO:',
            '- Analisis de riesgos especificos',
            '- Medidas preventivas implementadas',
            '- Protocolos de actuacion detallados',
            '- Sistemas de comunicacion internos',
            '- Procedimientos de formacion continua',
            '- Mecanismos de supervision y control',
            '',
            'CODIGO DE CONDUCTA:',
            '- Normas especificas de comportamiento',
            '- Prohibiciones expresas detalladas',
            '- Consecuencias por incumplimiento',
            '- Procedimiento de denuncias internas',
            '- Sistema de reconocimiento positivo',
            '',
            'PROTOCOLOS ESPECIFICOS:',
            '- Protocolo de deteccion de maltrato',
            '- Protocolo de actuacion en emergencias',
            '- Protocolo de comunicacion con familias',
            '- Protocolo de derivacion a servicios sociales',
            '- Protocolo de seguimiento post-incidente',
            '',
            '================================================================',
            'FASE 4: FORMACION DEL PERSONAL (Semanas 9-10)',
            '================================================================',
            '',
            'PROGRAMA DE FORMACION ESCALONADO:',
            '',
            'NIVEL 1 - PERSONAL DIRECTO (20 horas):',
            '- Fundamentos de la proteccion infantil',
            '- Reconocimiento de indicadores de maltrato',
            '- Tecnicas de comunicacion con menores',
            '- Protocolos especificos de la organizacion',
            '- Simulacros y casos practicos',
            '',
            'NIVEL 2 - PERSONAL OCASIONAL (8 horas):',
            '- Conceptos basicos LOPIVI',
            '- Codigo de conducta organizacional',
            '- Procedimientos de comunicacion',
            '- Casos practicos simplificados',
            '',
            'NIVEL 3 - DIRECTIVOS (30 horas):',
            '- Marco legal completo LOPIVI',
            '- Responsabilidades legales especificas',
            '- Gestion de crisis y comunicacion',
            '- Supervision y control de cumplimiento',
            '- Relaciones con autoridades competentes',
            '',
            'EVALUACION Y CERTIFICACION:',
            '- Examen teorico-practico',
            '- Evaluacion de competencias',
            '- Certificado de aprovechamiento',
            '- Registro en base de datos organizacional',
            '',
            '================================================================',
            'FASE 5: IMPLEMENTACION (Semanas 11-12)',
            '================================================================',
            '',
            'PUESTA EN MARCHA:',
            '- Comunicacion a todo el personal',
            '- Distribucion de documentacion',
            '- Senalizacion de espacios y procedimientos',
            '- Activacion de sistemas de comunicacion',
            '- Inicio de registros y controles',
            '',
            'MONITORIZACION CONTINUA:',
            '- Revisiones semanales los primeros 2 meses',
            '- Revisiones mensuales posteriores',
            '- Auditorias internas trimestrales',
            '- Evaluacion anual completa',
            '',
            'MEJORA CONTINUA:',
            '- Feedback del personal',
            '- Analisis de incidentes',
            '- Actualizacion de procedimientos',
            '- Formacion de reciclaje anual',
            '',
            '================================================================',
            'RECURSOS Y HERRAMIENTAS',
            '================================================================',
            '',
            'CUSTODIA360 - VENTAJAS COMPETITIVAS:',
            '- Implementacion automatizada en 72 horas',
            '- Documentacion generada automaticamente',
            '- Campus de formacion online certificado',
            '- Panel de control en tiempo real',
            '- Alertas automaticas de vencimientos',
            '- Soporte juridico especializado 24/7',
            '- Actualizaciones normativas automaticas',
            '',
            'SOPORTE DURANTE LA IMPLEMENTACION:',
            '- Consultor asignado personalizado',
            '- Reuniones de seguimiento semanales',
            '- Resolucion de dudas en menos de 24h',
            '- Formacion del delegado incluida',
            '- Revision final de cumplimiento'
          ]
          break
        case 'faq-delegados':
          titulo = 'FAQ DELEGADOS DE PROTECCION LOPIVI'
          contenido = [
            'PREGUNTAS FRECUENTES PARA DELEGADOS DE PROTECCION',
            '',
            '================================================================',
            '1. SOBRE LA FIGURA DEL DELEGADO DE PROTECCION',
            '================================================================',
            '',
            'P: Que es un delegado de proteccion?',
            'R: Es la persona designada por la entidad para coordinar y supervisar',
            'todas las medidas de proteccion frente a la violencia hacia menores',
            'segun establece la LOPIVI.',
            '',
            'P: Es obligatorio tener un delegado de proteccion?',
            'R: Si, es obligatorio para todas las entidades que trabajen con menores',
            'de edad, segun el articulo 35 de la LOPIVI.',
            '',
            'P: Puede una entidad tener mas de un delegado?',
            'R: Si, debe tener al menos un delegado principal y se recomienda',
            'un delegado suplente para garantizar continuidad.',
            '',
            '================================================================',
            '2. REQUISITOS Y FORMACION',
            '================================================================',
            '',
            'P: Que formacion necesita un delegado de proteccion?',
            'R: Debe completar un curso especializado de al menos 40 horas',
            'sobre proteccion infantil, normativa LOPIVI y protocolos de actuacion.',
            '',
            'P: Cuanto tiempo dura la certificacion?',
            'R: La certificacion inicial tiene validez indefinida, pero se',
            'requiere formacion de reciclaje anual de 8 horas.',
            '',
            'P: Quien puede ser delegado de proteccion?',
            'R: Cualquier persona mayor de edad con formacion adecuada,',
            'experiencia en la organizacion y sin antecedentes penales.',
            '',
            '================================================================',
            '3. FUNCIONES Y RESPONSABILIDADES',
            '================================================================',
            '',
            'P: Cuales son las principales funciones del delegado?',
            'R: - Coordinar las medidas de proteccion',
            '   - Recibir y gestionar comunicaciones sobre violencia',
            '   - Supervisar la aplicacion de protocolos',
            '   - Formar al personal en proteccion infantil',
            '   - Mantener la documentacion actualizada',
            '',
            'P: El delegado debe estar siempre disponible?',
            'R: Debe estar disponible durante el horario de actividades',
            'con menores y tener un sistema de contacto para emergencias.',
            '',
            'P: Que hacer si el delegado no esta disponible?',
            'R: Debe activarse el protocolo con el delegado suplente',
            'o la persona designada para emergencias.',
            '',
            '================================================================',
            '4. PROTOCOLOS DE ACTUACION',
            '================================================================',
            '',
            'P: Que hacer ante una sospecha de maltrato?',
            'R: 1. Garantizar la seguridad inmediata del menor',
            '   2. Documentar los hechos objetivamente',
            '   3. Comunicar a las autoridades competentes',
            '   4. Informar a la direccion de la entidad',
            '   5. Seguir el protocolo establecido',
            '',
            'P: Es obligatorio denunciar todos los casos?',
            'R: Si, existe deber legal de comunicar cualquier situacion',
            'de violencia o sospecha fundada a las autoridades.',
            '',
            'P: Como comunicar con las familias?',
            'R: Con prudencia y siguiendo el protocolo. En casos de',
            'sospecha de maltrato familiar, consultar antes con autoridades.',
            '',
            '================================================================',
            '5. DOCUMENTACION Y REGISTROS',
            '================================================================',
            '',
            'P: Que documentacion debe mantener el delegado?',
            'R: - Plan de Proteccion actualizado',
            '   - Registro de incidentes y comunicaciones',
            '   - Certificados de formacion del personal',
            '   - Protocolos de actuacion',
            '   - Listado de contactos de emergencia',
            '',
            'P: Cuanto tiempo conservar la documentacion?',
            'R: Al menos 10 anos para registros de incidentes',
            'y toda la documentacion LOPIVI mientras este vigente.',
            '',
            'P: Quien puede acceder a esta documentacion?',
            'R: Solo personal autorizado, inspectores y autoridades',
            'competentes. Debe garantizarse la confidencialidad.',
            '',
            '================================================================',
            '6. SITUACIONES ESPECIALES',
            '================================================================',
            '',
            'P: Que hacer en caso de emergencia fuera del horario?',
            'R: Llamar inmediatamente al 112 y seguir el protocolo',
            'de emergencias. Comunicar posteriormente al delegado.',
            '',
            'P: Como actuar ante acusaciones falsas?',
            'R: Mantener la calma, documentar todo, no confrontar',
            'al acusador y seguir el protocolo establecido.',
            '',
            'P: Puede el delegado ser sancionado?',
            'R: Si, puede ser sancionado por incumplimiento de sus',
            'obligaciones o por no seguir los protocolos establecidos.',
            '',
            '================================================================',
            '7. APOYO Y RECURSOS',
            '================================================================',
            '',
            'P: Donde obtener ayuda especializada?',
            'R: - Servicios Sociales municipales',
            '   - Equipos de proteccion de menores',
            '   - Colegio profesional correspondiente',
            '   - Soporte de Custodia360: 900 123 456',
            '',
            'P: Que hacer si no se como proceder?',
            'R: Contactar inmediatamente con el equipo de soporte',
            'de Custodia360 o con los servicios sociales locales.',
            '',
            'P: Hay formacion continua disponible?',
            'R: Si, Custodia360 ofrece formacion continua, webinars',
            'y actualizaciones normativas constantes.',
            '',
            '================================================================',
            'CONTACTOS DE EMERGENCIA',
            '================================================================',
            '',
            'Emergencias generales: 112',
            'ANAR (Ayuda a Ninos): 900 20 20 10',
            'Soporte Custodia360: 900 123 456',
            'Email: soporte@custodia360.com',
            '',
            'DISPONIBLE 24/7 PARA EMERGENCIAS'
          ]
          break
        default:
          titulo = 'DOCUMENTACION LOPIVI'
          contenido = ['Documento tecnico especializado en cumplimiento LOPIVI']
      }

      doc.text(titulo, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setDrawColor(59, 130, 246)
      doc.setLineWidth(0.5)
      doc.line(20, yPosition, pageWidth - 20, yPosition)

      yPosition += 15

      contenido.forEach(linea => {
        checkPageBreak()

        if (linea === '') {
          yPosition += 5
          return
        }

        if (linea.startsWith('-') || linea.match(/^\d+\./)) {
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          doc.text(linea, 25, yPosition)
          yPosition += 6
        } else if (linea.toUpperCase() === linea && linea.length > 10) {
          doc.setFontSize(14)
          doc.setTextColor(59, 130, 246)
          doc.text(linea, 20, yPosition)
          yPosition += 8
        } else {
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          const splitText = doc.splitTextToSize(linea, pageWidth - 40)
          doc.text(splitText, 20, yPosition)
          yPosition += splitText.length * 4 + 3
        }
      })

      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('Documento tecnico - Custodia360', pageWidth / 2, pageHeight - 15, { align: 'center' })

      doc.save(`${tipo.replace('-', '_')}_Custodia360.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  // Función para generar informe de entidad específica
  const generarInformeEntidad = (entidad: EntidadData, tipoInforme: 'completo' | 'certificado') => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('CUSTODIA360', 20, 20)

    doc.setFontSize(16)
    doc.text(`${tipoInforme === 'completo' ? 'INFORME COMPLETO' : 'CERTIFICADO DE CUMPLIMIENTO'}`, 20, 35)
    doc.text(`${entidad.nombre}`, 20, 50)

    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 60)

    doc.setFontSize(12)

    if (tipoInforme === 'completo') {
      const contenido = `
DATOS DE LA ENTIDAD
- Nombre: ${entidad.nombre}
- Plan contratado: ${entidad.plan}
- Número de menores: ${entidad.numeroMenores}
- Estado: ${entidad.estado}
- Fecha contratación: ${formatDate(entidad.fechaContratacion)}

DELEGADO RESPONSABLE
- Delegado principal: ${entidad.delegadoPrincipal}
- Email de contacto: ${entidad.emailContratante}
- Estado certificación: Vigente

CUMPLIMIENTO LOPIVI
- Estado general: CONFORME
- Protocolos implementados: SÍ
- Personal formado: 100%
- Documentación: COMPLETA

FACTURACIÓN
- Importe anual: ${formatCurrency(entidad.importeTotal)}
- Estado pagos: AL DÍA

Este informe certifica el cumplimiento íntegro de la normativa LOPIVI por parte de la entidad.
      `

      const lines = contenido.trim().split('\n')
      let yPosition = 75

      lines.forEach(line => {
        if (line.trim() === '') {
          yPosition += 5
        } else {
          doc.text(line.trim(), 20, yPosition)
          yPosition += 5
        }
      })
    } else {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('CERTIFICADO DE CUMPLIMIENTO LOPIVI', 20, 80)

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Se certifica que ${entidad.nombre} cumple íntegramente`, 20, 100)
      doc.text('con todos los requisitos establecidos en la LOPIVI.', 20, 110)

      doc.text('- Delegado de Protección certificado', 20, 130)
      doc.text('- Personal formado según normativa', 20, 140)
      doc.text('- Protocolos de actuación implementados', 20, 150)
      doc.text('- Documentación completa y actualizada', 20, 160)

      doc.setFont('helvetica', 'bold')
      doc.text('VÁLIDO PARA INSPECCIONES OFICIALES', 20, 180)
    }

    doc.setFontSize(8)
    doc.text('Custodia360 - Certificación oficial LOPIVI', 20, 285)

    doc.save(`${tipoInforme}-${entidad.nombre.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Función para generar informe de estado de delegados
  const generarInformeEstadoDelegados = (entidad: EntidadData) => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('CUSTODIA360', 20, 20)

    doc.setFontSize(16)
    doc.text('INFORME DE ESTADO DE DELEGADOS', 20, 35)
    doc.text(`${entidad.nombre}`, 20, 50)

    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 60)

    doc.setFontSize(12)
    const contenido = `
DELEGADO PRINCIPAL
- Nombre: ${entidad.delegadoPrincipal}
- Estado certificación: VIGENTE
- Fecha última formación: ${new Date(Date.now() - 180*24*60*60*1000).toLocaleDateString('es-ES')}
- Próxima renovación: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('es-ES')}

DELEGADO SUPLENTE
- Estado: CERTIFICADO
- Fecha certificación: ${new Date(Date.now() - 90*24*60*60*1000).toLocaleDateString('es-ES')}
- Próxima renovación: ${new Date(Date.now() + 640*24*60*60*1000).toLocaleDateString('es-ES')}

ESTADO GENERAL
- Cumplimiento normativo: CONFORME
- Documentación: COMPLETA
- Observaciones: Sin incidencias
    `

    const lines = contenido.trim().split('\n')
    let yPosition = 75

    lines.forEach(line => {
      if (line.trim() === '') {
        yPosition += 5
      } else {
        doc.text(line.trim(), 20, yPosition)
        yPosition += 5
      }
    })

    doc.setFontSize(8)
    doc.text('Custodia360 - Informe Estado Delegados', 20, 285)

    doc.save(`estado-delegados-${entidad.nombre.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Función para generar informe de cumplimiento
  const generarInformeResumenCumplimiento = (entidad: EntidadData) => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('CUSTODIA360', 20, 20)

    doc.setFontSize(16)
    doc.text('RESUMEN DE CUMPLIMIENTO LOPIVI', 20, 35)
    doc.text(`${entidad.nombre}`, 20, 50)

    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 60)

    doc.setFontSize(12)
    const contenido = `
INDICADORES DE CUMPLIMIENTO
- Estado general: CONFORME (98%)
- Plan de protección: IMPLEMENTADO
- Delegados certificados: SÍ
- Personal formado: 100%
- Protocolos actualizados: SÍ

ÁREAS EVALUADAS
✓ Designación y formación de delegados
✓ Implementación de protocolos
✓ Formación del personal
✓ Canal de denuncias activo
✓ Documentación completa

RECOMENDACIONES
- Continuar con formación periódica
- Revisar protocolos anualmente
- Mantener canal de comunicación activo

PRÓXIMAS ACCIONES
- Auditoría anual: ${new Date(Date.now() + 180*24*60*60*1000).toLocaleDateString('es-ES')}
- Renovación delegados: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('es-ES')}
    `

    const lines = contenido.trim().split('\n')
    let yPosition = 75

    lines.forEach(line => {
      if (line.trim() === '') {
        yPosition += 5
      } else {
        doc.text(line.trim(), 20, yPosition)
        yPosition += 5
      }
    })

    doc.setFontSize(8)
    doc.text('Custodia360 - Resumen de Cumplimiento', 20, 285)

    doc.save(`resumen-cumplimiento-${entidad.nombre.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Función para generar informe de formaciones
  const generarInformeFormaciones = (entidad: EntidadData) => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('CUSTODIA360', 20, 20)

    doc.setFontSize(16)
    doc.text('INFORME DE FORMACIONES LOPIVI', 20, 35)
    doc.text(`${entidad.nombre}`, 20, 50)

    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 60)

    doc.setFontSize(12)
    const contenido = `
FORMACIONES COMPLETADAS
- Delegado Principal: COMPLETADA (${new Date(Date.now() - 120*24*60*60*1000).toLocaleDateString('es-ES')})
- Delegado Suplente: COMPLETADA (${new Date(Date.now() - 90*24*60*60*1000).toLocaleDateString('es-ES')})
- Personal general: 100% COMPLETADO

MÓDULOS IMPARTIDOS
✓ Introducción a la LOPIVI
✓ Protocolos de actuación
✓ Detección de casos
✓ Gestión de denuncias
✓ Documentación legal

CERTIFICACIONES VIGENTES
- Número de personal certificado: ${Math.floor(Math.random() * 15) + 10}
- Certificaciones válidas: 100%
- Próximas renovaciones: ${new Date(Date.now() + 300*24*60*60*1000).toLocaleDateString('es-ES')}

ESTADÍSTICAS
- Horas de formación total: ${Math.floor(Math.random() * 50) + 100}h
- Porcentaje de asistencia: 98%
- Evaluaciones aprobadas: 100%
    `

    const lines = contenido.trim().split('\n')
    let yPosition = 75

    lines.forEach(line => {
      if (line.trim() === '') {
        yPosition += 5
      } else {
        doc.text(line.trim(), 20, yPosition)
        yPosition += 5
      }
    })

    doc.setFontSize(8)
    doc.text('Custodia360 - Informe de Formaciones', 20, 285)

    doc.save(`formaciones-${entidad.nombre.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Función para generar informe de documentación
  const generarInformeDocumentacion = (entidad: EntidadData) => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('CUSTODIA360', 20, 20)

    doc.setFontSize(16)
    doc.text('INFORME DE DOCUMENTACIÓN LOPIVI', 20, 35)
    doc.text(`${entidad.nombre}`, 20, 50)

    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 60)

    doc.setFontSize(12)
    const contenido = `
DOCUMENTACIÓN OBLIGATORIA
✓ Plan de Protección Infantil
✓ Designación de delegados
✓ Protocolos de actuación
✓ Código de conducta
✓ Canal de denuncias
✓ Registro de formaciones

ESTADO DE DOCUMENTOS
- Plan de protección: VIGENTE
- Protocolos: ACTUALIZADOS
- Certificados: VÁLIDOS
- Registros: AL DÍA

ÚLTIMA ACTUALIZACIÓN
- Plan de protección: ${new Date(Date.now() - 60*24*60*60*1000).toLocaleDateString('es-ES')}
- Protocolos: ${new Date(Date.now() - 30*24*60*60*1000).toLocaleDateString('es-ES')}
- Formaciones: ${new Date(Date.now() - 15*24*60*60*1000).toLocaleDateString('es-ES')}

PRÓXIMAS REVISIONES
- Revisión anual: ${new Date(Date.now() + 210*24*60*60*1000).toLocaleDateString('es-ES')}
- Actualización protocolos: ${new Date(Date.now() + 330*24*60*60*1000).toLocaleDateString('es-ES')}
    `

    const lines = contenido.trim().split('\n')
    let yPosition = 75

    lines.forEach(line => {
      if (line.trim() === '') {
        yPosition += 5
      } else {
        doc.text(line.trim(), 20, yPosition)
        yPosition += 5
      }
    })

    doc.setFontSize(8)
    doc.text('Custodia360 - Informe de Documentación', 20, 285)

    doc.save(`documentacion-${entidad.nombre.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Función para generar informe de pagos
  const generarInformeEstadoPagos = (entidad: EntidadData) => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('CUSTODIA360', 20, 20)

    doc.setFontSize(16)
    doc.text('INFORME DE ESTADO DE PAGOS', 20, 35)
    doc.text(`${entidad.nombre}`, 20, 50)

    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 60)

    doc.setFontSize(12)
    const contenido = `
INFORMACIÓN DE FACTURACIÓN
- Plan contratado: ${entidad.plan}
- Importe anual: ${formatCurrency(entidad.importeTotal)}
- Estado de pagos: AL DÍA
- Método de pago: DOMICILIACIÓN

HISTORIAL DE PAGOS
- Último pago: ${new Date(Date.now() - 30*24*60*60*1000).toLocaleDateString('es-ES')}
- Importe: ${formatCurrency(entidad.importeTotal / 12)}
- Estado: PAGADO
- Forma de pago: Transferencia bancaria

PRÓXIMOS VENCIMIENTOS
- Próximo pago: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('es-ES')}
- Renovación anual: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('es-ES')}

OBSERVACIONES
- Sin incidencias en pagos
- Facturación automática activa
- Cliente al corriente de pagos
    `

    const lines = contenido.trim().split('\n')
    let yPosition = 75

    lines.forEach(line => {
      if (line.trim() === '') {
        yPosition += 5
      } else {
        doc.text(line.trim(), 20, yPosition)
        yPosition += 5
      }
    })

    doc.setFontSize(8)
    doc.text('Custodia360 - Estado de Pagos', 20, 285)

    doc.save(`estado-pagos-${entidad.nombre.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Función para generar auditoría completa
  const generarInformeAuditoriaCompleta = (entidad: EntidadData) => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('CUSTODIA360', 20, 20)

    doc.setFontSize(16)
    doc.text('AUDITORÍA COMPLETA LOPIVI', 20, 35)
    doc.text(`${entidad.nombre}`, 20, 50)

    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 60)

    doc.setFontSize(12)
    const contenido = `
AUDITORÍA COMPLETA LOPIVI

DATOS DE LA ENTIDAD
- Nombre: ${entidad.nombre}
- Plan: ${entidad.plan}
- Menores: ${entidad.numeroMenores}
- Delegado: ${entidad.delegadoPrincipal}

ANÁLISIS DE RIESGOS
- Evaluación de riesgos: COMPLETADA
- Nivel de riesgo general: BAJO
- Medidas preventivas: IMPLEMENTADAS
- Revisión de protocolos: AL DÍA

EVALUACIÓN DE PROTOCOLOS
✓ Protocolo de prevención
✓ Protocolo de detección
✓ Protocolo de actuación
✓ Protocolo de comunicación
✓ Protocolo de seguimiento

HISTORIAL DE CASOS
- Casos registrados: 0
- Casos resueltos: 0
- Tiempo medio resolución: N/A
- Satisfacción: N/A

CERTIFICACIONES DE PERSONAL
- Personal certificado: 100%
- Certificaciones vigentes: SÍ
- Próximas renovaciones: ${new Date(Date.now() + 300*24*60*60*1000).toLocaleDateString('es-ES')}

CONCLUSIONES
La entidad cumple íntegramente con todos los requisitos
establecidos en la LOPIVI. Se recomienda mantener el
nivel actual de cumplimiento.

VÁLIDO PARA INSPECCIONES OFICIALES
    `

    const lines = contenido.trim().split('\n')
    let yPosition = 75

    lines.forEach(line => {
      if (line.trim() === '') {
        yPosition += 5
      } else {
        doc.text(line.trim(), 20, yPosition)
        yPosition += 5
      }
    })

    doc.setFontSize(8)
    doc.text('Custodia360 - Auditoría Completa', 20, 285)

    doc.save(`auditoria-completa-${entidad.nombre.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard Custodia360...</p>
        </div>
      </div>
    )
  }

  if (!sessionData || !metricas) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Acceso no autorizado</p>
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
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* Logo y nombre removidos */}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin: {sessionData?.nombre}</span>
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entidades Activas</p>
                <p className="text-2xl font-bold text-green-600">{metricas.entidadesActivas}</p>
                <p className="text-xs text-gray-500">de {metricas.entidadesTotales} totales</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delegados Activos</p>
                <p className="text-2xl font-bold text-blue-600">{metricas.delegadosActivos}</p>
                <p className="text-xs text-gray-500">Certificados</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Facturación Mensual</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(metricas.facturacionMensual)}</p>
                <p className="text-xs text-gray-500">Promedio mensual</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Facturación Semestral</p>
                <p className="text-2xl font-bold text-indigo-600">{formatCurrency(metricas.facturacionMensual * 6)}</p>
                <p className="text-xs text-gray-500">Últimos 6 meses</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Facturación Anual</p>
                <p className="text-2xl font-bold text-teal-600">{formatCurrency(metricas.facturacionAnual)}</p>
                <p className="text-xs text-gray-500">Total año en curso</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sistema de Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'dashboard'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard General
              </button>
              <button
                onClick={() => setActiveTab('entidades')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'entidades'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Gestión Entidades
              </button>
              <button
                onClick={() => setActiveTab('documentacion')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'documentacion'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Documentación
              </button>
              <button
                onClick={() => setActiveTab('informes')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'informes'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Informes
              </button>
            </nav>
          </div>

          <div className="p-8">
            {/* Dashboard General */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen Ejecutivo</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-bold text-blue-800 mb-4">Crecimiento del Negocio</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Nuevas contrataciones (mes)</span>
                          <span className="font-bold text-blue-600">15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Tasa de crecimiento</span>
                          <span className="font-bold text-green-600">+12.8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Retención de clientes</span>
                          <span className="font-bold text-green-600">94.2%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-bold text-green-800 mb-4">Distribución por Planes</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Plan 50 (1-50 menores)</span>
                          <span className="font-bold">23 entidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Plan 200 (51-200 menores)</span>
                          <span className="font-bold">45 entidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Plan 500 (201-500 menores)</span>
                          <span className="font-bold">34 entidades</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Últimas Contrataciones</h3>
                  <div className="space-y-4">
                    {entidades.slice(0, 3).map((entidad) => (
                      <div key={entidad.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{entidad.nombre}</h4>
                            <p className="text-sm text-gray-600">{entidad.plan} • {entidad.numeroMenores} menores</p>
                            <p className="text-xs text-gray-500">Contratado: {formatDate(entidad.fechaContratacion)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">{formatCurrency(entidad.importeTotal)}</p>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getEstadoColor(entidad.estado)}`}>
                              {entidad.estado}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monitor BOE Automático - SIN ICONO */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Monitor BOE Automático</h3>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <h4 className="font-bold text-orange-800">Sistema Operativo 24/7</h4>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">ACTIVO</div>
                        <div className="text-sm text-gray-600">Estado del Sistema</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">15 min</div>
                        <div className="text-sm text-gray-600">Última Revisión</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">23</div>
                        <div className="text-sm text-gray-600">Cambios Detectados</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-orange-800 mb-3">Actividad Reciente:</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>BOEs analizados hoy:</span>
                            <span className="font-bold text-blue-600">47</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Documentos actualizados:</span>
                            <span className="font-bold text-green-600">89</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Notificaciones enviadas:</span>
                            <span className="font-bold text-purple-600">234</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-bold text-orange-800 mb-3">Próximas Revisiones:</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>BOE Oficial: En 45 minutos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Circulares Ministerio: En 2 horas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Normativa Autonómica: En 4 horas</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gestión Entidades */}
            {activeTab === 'entidades' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">Gestión de Entidades</h3>

                {/* Selector de entidad individual */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-bold text-gray-900">Acceso Individual a Entidades</h4>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Entidad</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          if (e.target.value) {
                            const entidad = entidades.find(ent => ent.id === e.target.value)
                            if (entidad) {
                              setEntidadSeleccionada(entidad)
                            }
                          }
                        }}
                      >
                        <option value="">-- Seleccionar entidad --</option>
                        {entidades.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((entidad) => (
                          <option key={entidad.id} value={entidad.id}>{entidad.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Información de entidad seleccionada */}
                {entidadSeleccionada && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">Información de {entidadSeleccionada.nombre}</h4>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Datos Generales</h5>
                        <div className="space-y-2 text-sm">
                          <p><strong>Nombre:</strong> {entidadSeleccionada.nombre}</p>
                          <p><strong>Plan:</strong> {entidadSeleccionada.plan}</p>
                          <p><strong>Menores:</strong> {entidadSeleccionada.numeroMenores}</p>
                          <p><strong>Contratado:</strong> {formatDate(entidadSeleccionada.fechaContratacion)}</p>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(entidadSeleccionada.estado)}`}>
                            {entidadSeleccionada.estado}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Delegado Responsable</h5>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p><strong>Principal:</strong> {entidadSeleccionada.delegadoPrincipal}</p>
                          <p><strong>Email:</strong> {entidadSeleccionada.emailContratante}</p>
                          <p><strong>Estado:</strong> <span className="text-green-600">Certificado</span></p>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Información Financiera</h5>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p><strong>Importe anual:</strong> {formatCurrency(entidadSeleccionada.importeTotal)}</p>
                          <p><strong>Estado pago:</strong> <span className="text-green-600">Al día</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => setShowGenerarInformeModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Generar Informe
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Documentación */}
            {activeTab === 'documentacion' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">Centro de Documentación LOPIVI</h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Guías Oficiales */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-bold text-blue-800 mb-4">Guías Oficiales</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Manual LOPIVI Completo</span>
                        <button
                          onClick={() => generarPDFGuiaOficial('manual-lopivi')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Protocolo de Actuación</span>
                        <button
                          onClick={() => generarPDFGuiaOficial('protocolo-actuacion')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Guía de Implementación</span>
                        <button
                          onClick={() => generarPDFGuiaOficial('guia-implementacion')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">FAQ Delegados</span>
                        <button
                          onClick={() => generarPDFGuiaOficial('faq-delegados')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Formularios */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-bold text-green-800 mb-4">Formularios</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Registro de Incidentes</span>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Comunicación a Familias</span>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                          Descargar PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Certificaciones */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="font-bold text-purple-800 mb-4">Certificaciones</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Certificado de Formación</span>
                        <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                          Generar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Certificado de Cumplimiento</span>
                        <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                          Generar PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Normativa Legal */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h4 className="font-bold text-orange-800 mb-4">Normativa Legal</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Ley Orgánica LOPIVI</span>
                        <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Real Decreto desarrollo</span>
                        <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                          Descargar PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informes */}
            {activeTab === 'informes' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Centro de Informes y Analíticas</h3>
                </div>

                {/* Informes Ejecutivos - SIN ICONOS */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-6">Informes Ejecutivos</h4>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-medium text-blue-800 mb-3">Informe Mensual</h5>
                      <p className="text-sm text-gray-600 mb-4">Estado general de todas las entidades y métricas de cumplimiento</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Último: Enero 2025</span>
                        <button
                          onClick={() => mostrarInformeEnModal('mensual')}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Descargar
                        </button>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="font-medium text-green-800 mb-3">Informe Trimestral</h5>
                      <p className="text-sm text-gray-600 mb-4">Análisis de tendencias y evolución del cumplimiento LOPIVI</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Último: Q4 2024</span>
                        <button
                          onClick={() => mostrarInformeEnModal('trimestral')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Descargar
                        </button>
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h5 className="font-medium text-purple-800 mb-3">Informe Anual</h5>
                      <p className="text-sm text-gray-600 mb-4">Resumen ejecutivo completo del año con proyecciones</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Último: 2024</span>
                        <button
                          onClick={() => mostrarInformeEnModal('anual')}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                        >
                          Descargar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Métricas de Negocio y Operativas - SIN ICONOS */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Métricas de Negocio</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">MRR (Monthly Recurring Revenue)</span>
                        <span className="text-lg font-bold text-green-600">{formatCurrency(metricas.facturacionMensual)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">ARR (Annual Recurring Revenue)</span>
                        <span className="text-lg font-bold text-blue-600">{formatCurrency(metricas.facturacionAnual)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Churn Rate</span>
                        <span className="text-lg font-bold text-red-600">2.3%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Métricas Operativas</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tiempo medio implementación</span>
                        <span className="text-lg font-bold text-green-600">2.3 días</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Satisfacción del cliente</span>
                        <span className="text-lg font-bold text-blue-600">4.8/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Uptime del sistema</span>
                        <span className="text-lg font-bold text-green-600">99.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Generar Informe - Versión corregida SIN ICONOS */}
      {showGenerarInformeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-green-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Generar Informe</h3>
                  <p className="opacity-90">Selecciona el tipo de informe a generar para {entidadSeleccionada?.nombre}</p>
                </div>
                <button
                  onClick={() => setShowGenerarInformeModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-8">
                {/* Informes Básicos */}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Informes Básicos</h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <button
                      onClick={() => {
                        if (entidadSeleccionada) {
                          generarInformeEntidad(entidadSeleccionada, 'certificado')
                        }
                        setShowGenerarInformeModal(false)
                      }}
                      className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-left hover:bg-green-100 transition-colors"
                    >
                      <h5 className="text-lg font-bold text-green-800 mb-2">Certificado LOPIVI</h5>
                      <p className="text-sm text-gray-600">Certificado oficial de cumplimiento válido para inspecciones</p>
                    </button>

                    <button
                      onClick={() => {
                        if (entidadSeleccionada) {
                          generarInformeEstadoDelegados(entidadSeleccionada)
                        }
                        setShowGenerarInformeModal(false)
                      }}
                      className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-left hover:bg-blue-100 transition-colors"
                    >
                      <h5 className="text-lg font-bold text-blue-800 mb-2">Estado Delegados</h5>
                      <p className="text-sm text-gray-600">Informe del estado de certificación de delegados</p>
                    </button>

                    <button
                      onClick={() => {
                        if (entidadSeleccionada) {
                          generarInformeResumenCumplimiento(entidadSeleccionada)
                        }
                        setShowGenerarInformeModal(false)
                      }}
                      className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 text-left hover:bg-purple-100 transition-colors"
                    >
                      <h5 className="text-lg font-bold text-purple-800 mb-2">Resumen Cumplimiento</h5>
                      <p className="text-sm text-gray-600">Estado general de cumplimiento LOPIVI de la entidad</p>
                    </button>

                    <button
                      onClick={() => {
                        if (entidadSeleccionada) {
                          generarInformeFormaciones(entidadSeleccionada)
                        }
                        setShowGenerarInformeModal(false)
                      }}
                      className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 text-left hover:bg-orange-100 transition-colors"
                    >
                      <h5 className="text-lg font-bold text-orange-800 mb-2">Formaciones</h5>
                      <p className="text-sm text-gray-600">Registro de formaciones completadas y pendientes</p>
                    </button>

                    <button
                      onClick={() => {
                        if (entidadSeleccionada) {
                          generarInformeDocumentacion(entidadSeleccionada)
                        }
                        setShowGenerarInformeModal(false)
                      }}
                      className="bg-teal-50 border-2 border-teal-200 rounded-lg p-6 text-left hover:bg-teal-100 transition-colors"
                    >
                      <h5 className="text-lg font-bold text-teal-800 mb-2">Documentación</h5>
                      <p className="text-sm text-gray-600">Estado de la documentación LOPIVI de la entidad</p>
                    </button>

                    <button
                      onClick={() => {
                        if (entidadSeleccionada) {
                          generarInformeEstadoPagos(entidadSeleccionada)
                        }
                        setShowGenerarInformeModal(false)
                      }}
                      className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 text-left hover:bg-indigo-100 transition-colors"
                    >
                      <h5 className="text-lg font-bold text-indigo-800 mb-2">Estado de Pagos</h5>
                      <p className="text-sm text-gray-600">Historial de pagos y facturación de la entidad</p>
                    </button>
                  </div>
                </div>

                {/* Informes Avanzados */}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Informes Avanzados</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <button
                      onClick={() => {
                        if (entidadSeleccionada) {
                          generarInformeEntidad(entidadSeleccionada, 'completo')
                        }
                        setShowGenerarInformeModal(false)
                      }}
                      className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-left hover:bg-red-100 transition-colors"
                    >
                      <h5 className="text-lg font-bold text-red-800 mb-2">Informe Completo</h5>
                      <p className="text-sm text-gray-600 mb-4">Informe detallado de cumplimiento LOPIVI con toda la información de la entidad</p>
                      <div className="text-xs text-gray-500">
                        <p>• Incluye todos los datos básicos</p>
                        <p>• Análisis detallado de cumplimiento</p>
                        <p>• Recomendaciones de mejora</p>
                        <p>• Válido para auditorías</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (entidadSeleccionada) {
                          generarInformeAuditoriaCompleta(entidadSeleccionada)
                        }
                        setShowGenerarInformeModal(false)
                      }}
                      className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-left hover:bg-yellow-100 transition-colors"
                    >
                      <h5 className="text-lg font-bold text-yellow-800 mb-2">Auditoría Completa</h5>
                      <p className="text-sm text-gray-600 mb-4">Informe exhaustivo para auditorías oficiales e inspecciones</p>
                      <div className="text-xs text-gray-500">
                        <p>• Análisis de riesgos detallado</p>
                        <p>• Evaluación de protocolos</p>
                        <p>• Historial de casos</p>
                        <p>• Certificaciones de personal</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowGenerarInformeModal(false)}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Viewer de Informes */}
      {showInformeViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Informe {tipoInformeViewer.charAt(0).toUpperCase() + tipoInformeViewer.slice(1)}</h3>
                  <p className="opacity-90">Vista previa del informe generado</p>
                </div>
                <button
                  onClick={() => setShowInformeViewer(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">CUSTODIA360 - INFORME {tipoInformeViewer.toUpperCase()}</h4>
                <p className="text-sm text-gray-600 mb-4">Fecha: {new Date().toLocaleDateString('es-ES')}</p>

                {tipoInformeViewer === 'mensual' && (
                  <div className="space-y-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">RESUMEN EJECUTIVO</h5>
                      <p>• Entidades activas: {metricas?.entidadesActivas || 0}</p>
                      <p>• Delegados certificados: {metricas?.delegadosActivos || 0}</p>
                      <p>• Facturación mensual: {formatCurrency(metricas?.facturacionMensual || 0)}</p>
                      <p>• Tasa de cumplimiento: 94.2%</p>
                    </div>
                  </div>
                )}

                {tipoInformeViewer === 'trimestral' && (
                  <div className="space-y-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">RESUMEN DEL TRIMESTRE</h5>
                      <p>• Crecimiento de entidades: +18.5%</p>
                      <p>• Retención de clientes: 96.1%</p>
                      <p>• Satisfacción promedio: 4.8/5</p>
                      <p>• Ingresos del trimestre: {formatCurrency((metricas?.facturacionMensual || 0) * 3)}</p>
                    </div>
                  </div>
                )}

                {tipoInformeViewer === 'anual' && (
                  <div className="space-y-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">LOGROS DEL AÑO</h5>
                      <p>• Crecimiento total: +45%</p>
                      <p>• Entidades incorporadas: 47 nuevas</p>
                      <p>• Delegados formados: 156</p>
                      <p>• Ingresos anuales: {formatCurrency(metricas?.facturacionAnual || 0)}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowInformeViewer(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => generarPDF(tipoInformeViewer, `Informe ${tipoInformeViewer.charAt(0).toUpperCase() + tipoInformeViewer.slice(1)}`)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Descargar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
