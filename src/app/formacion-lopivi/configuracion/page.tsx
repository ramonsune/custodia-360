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
  tipoEntidad: string
  certificacionVigente: boolean
}

interface CanalConfig {
  tipo: string
  contacto: string
  horario: string
  instrucciones: string
}

// Mapas de riesgo por tipo de entidad
const MAPAS_RIESGO = {
  'club-deportivo': {
    titulo: 'Mapa de Riesgos - Club Deportivo',
    contenido: [
      'MAPA DE RIESGOS ESPECÍFICO PARA CLUBES DEPORTIVOS',
      '',
      '═══════════════════════════════════════════════════════════════════',
      '1. RIESGOS EN INSTALACIONES DEPORTIVAS',
      '═══════════════════════════════════════════════════════════════════',
      '',
      'VESTUARIOS Y ESPACIOS DE CAMBIO:',
      '• RIESGO ALTO: Espacios privados sin supervisión apropiada',
      '• EJEMPLOS CONCRETOS:',
      '  - Entrenador que entra al vestuario mientras los menores se cambian',
      '  - Menor que se queda solo en vestuario después del entrenamiento',
      '  - Voluntario que ayuda a menor a cambiarse sin testigos presentes',
      '  - Personal de limpieza que accede sin verificar ocupación',
      '• MEDIDAS PREVENTIVAS:',
      '  - Supervisión visual desde el exterior (puerta entreabierta)',
      '  - Nunca un adulto solo con menores en vestuario cerrado',
      '  - Turnos por edades: menores de 10 años con acompañante familiar',
      '  - Señalización clara de ocupación y horarios de limpieza',
      '• PROTOCOLO ESPECÍFICO:',
      '  - Antes de entrar: tocar puerta y anunciar presencia',
      '  - Si debe entrar: mínimo 2 adultos o testigo en la puerta',
      '  - Documentar cualquier entrada excepcional',
      '  - Respetar intimidad: no mirar directamente, ofrecer toallas',
      '',
      'ZONAS DE ENTRENAMIENTO:',
      '• RIESGO MEDIO: Contacto físico durante correcciones técnicas',
      '• EJEMPLOS CONCRETOS:',
      '  - Corrección postural tocando espalda, piernas o caderas',
      '  - Asistencia en ejercicios de flexibilidad o estiramientos',
      '  - Ayuda en levantamiento de pesas o ejercicios complejos',
      '  - Aplicación de vendajes o primeros auxilios deportivos',
      '• MEDIDAS PREVENTIVAS:',
      '  - Explicar verbalmente antes de cualquier contacto físico',
      '  - Usar material didáctico (muñecos, videos) cuando sea posible',
      '  - Presencia de otros menores o adultos durante el contacto',
      '  - Pedir permiso explícito: "¿Puedo ayudarte con esta postura?"',
      '• PROTOCOLO ESPECÍFICO:',
      '  - Contacto mínimo, solo el tiempo necesario',
      '  - Zonas permitidas: hombros, brazos, manos (evitar torso/piernas)',
      '  - Comunicación clara del propósito: "Te voy a ayudar con el equilibrio"',
      '  - Si el menor se incomoda, parar inmediatamente',
      '',
      'ALMACENES Y ESPACIOS CERRADOS:',
      '• RIESGO ALTO: Espacios aislados sin visibilidad',
      '• EJEMPLOS CONCRETOS:',
      '  - Menor que va solo a buscar material al almacén',
      '  - Entrenador que llama a menor para hablar en despacho cerrado',
      '  - Actividades de castigo que aíslan al menor del grupo',
      '  - Reuniones individuales sin testigos presentes',
      '• MEDIDAS PREVENTIVAS:',
      '  - Prohibir acceso de menores solos a almacenes',
      '  - Reuniones individuales solo en espacios visibles',
      '  - Puertas abiertas o con cristales transparentes',
      '  - Iluminación adecuada en todos los espacios',
      '• PROTOCOLO ESPECÍFICO:',
      '  - Si menor necesita material: acompañar o enviar en parejas',
      '  - Conversaciones importantes: en presencia de otro adulto',
      '  - Registrar motivo y duración de reuniones individuales',
      '  - Informar a familias de conversaciones relevantes',
      '',
      'DUCHAS Y ASEOS:',
      '• RIESGO ALTO: Espacios de máxima intimidad y vulnerabilidad',
      '• EJEMPLOS CONCRETOS:',
      '  - Menor que se ducha solo sin supervisión externa',
      '  - Adulto que entra en duchas mientras menor se asea',
      '  - Grabaciones o fotografías inadecuadas en estos espacios',
      '  - Comentarios inapropiados sobre el cuerpo del menor',
      '• MEDIDAS PREVENTIVAS:',
      '  - Supervisión externa constante (sin acceso visual directo)',
      '  - Prohibir dispositivos móviles en zonas de ducha',
      '  - Separación por edades: menores de 12 años con acompañante',
      '  - Protocolo de limpieza fuera de horarios de uso',
      '• PROTOCOLO ESPECÍFICO:',
      '  - Verificar que duchas estén vacías antes de permitir acceso',
      '  - Tiempo límite razonable de uso',
      '  - Personal de limpieza del mismo género que usuarios',
      '  - Registro de incidencias o comportamientos inadecuados',
      '',
      '═══════════════════════════════════════════════════════════════════',
      '2. RIESGOS EN ACTIVIDADES DEPORTIVAS',
      '═══════════════════════════════════════════════════════════════════',
      '',
      'ENTRENAMIENTOS INDIVIDUALES:',
      '• RIESGO ALTO: Relación uno a uno entrenador-menor',
      '• EJEMPLOS CONCRETOS:',
      '  - Clases particulares en horarios fuera del club',
      '  - Entrenamientos específicos para deportistas destacados',
      '  - Sesiones de recuperación tras lesión',
      '  - Preparación individual para competiciones importantes',
      '• MEDIDAS PREVENTIVAS:',
      '  - Entrenamientos individuales solo en instalaciones del club',
      '  - Horarios coincidentes con presencia de otros adultos',
      '  - Comunicación previa y autorización de las familias',
      '  - Espacios siempre visibles desde zonas comunes',
      '• PROTOCOLO ESPECÍFICO:',
      '  - Documentar objetivos y duración de cada sesión individual',
      '  - Informar semanalmente a familias del progreso',
      '  - Presencia de otro entrenador o padre/madre cuando sea posible',
      '  - Prohibir entrenamientos en domicilios particulares',
      '',
      'COMPETICIONES Y DESPLAZAMIENTOS:',
      '• RIESGO MEDIO-ALTO: Viajes, alojamientos, tiempo libre supervisado',
      '• EJEMPLOS CONCRETOS:',
      '  - Viajes de fin de semana para torneos en otras ciudades',
      '  - Concentraciones en hoteles compartiendo habitaciones',
      '  - Tiempo libre en destinos sin supervisión constante',
      '  - Transporte en autobuses durante varias horas',
      '• MEDIDAS PREVENTIVAS:',
      '  - Ratio mínimo 1 adulto por cada 6 menores en desplazamientos',
      '  - Habitaciones separadas por géneros y grupos de edad',
      '  - Autorización escrita específica de familias para cada viaje',
      '  - Plan detallado de supervisión 24 horas',
      '• PROTOCOLO ESPECÍFICO:',
      '  - Reunión informativa previa con familias',
      '  - Lista de contactos de emergencia y médicos',
      '  - Horarios estructurados con actividades supervisadas',
      '  - Prohibir salidas nocturnas sin acompañante adulto',
      '  - Comunicación diaria con familias sobre bienestar menores',
      '',
      'CELEBRACIONES Y EVENTOS SOCIALES:',
      '• RIESGO MEDIO: Ambiente relajado, posible consumo alcohol adultos',
      '• EJEMPLOS CONCRETOS:',
      '  - Fiestas de fin de temporada con familias',
      '  - Celebraciones de victorias en bares o restaurantes',
      '  - Eventos navideños o de clausura con ambiente festivo',
      '  - Barbacoas o reuniones informales del club',
      '• MEDIDAS PREVENTIVAS:',
      '  - Designar responsables específicos para supervisión menores',
      '  - Espacios diferenciados para menores y adultos',
      '  - Límites claros sobre consumo de alcohol cerca de menores',
      '  - Horarios apropiados con finalización temprana para menores',
      '• PROTOCOLO ESPECÍFICO:',
      '  - Plan específico de supervisión para cada evento',
      '  - Actividades alternativas apropiadas para menores',
      '  - Control de acceso y salida de menores',
      '  - Personal sobrio designado para emergencias',
      '',
      '═══════════════════════════════════════════════════════════════════',
      '3. RIESGOS CON PERSONAL Y VOLUNTARIOS',
      '═══════════════════════════════════════════════════════════════════',
      '',
      'ENTRENADORES Y TÉCNICOS PRINCIPALES:',
      '• RIESGO MEDIO-ALTO: Relación de autoridad y confianza',
      '• EJEMPLOS CONCRETOS:',
      '  - Entrenador que desarrolla favoritismo hacia menor específico',
      '  - Invitaciones a casa del entrenador para "entrenamientos extra"',
      '  - Regalos personales o atenciones especiales inadecuadas',
      '  - Comentarios sobre apariencia física del menor',
      '• MEDIDAS PREVENTIVAS:',
      '  - Formación específica sobre límites profesionales',
      '  - Supervisión periódica por parte de la dirección técnica',
      '  - Rotación en asignación de entrenadores por grupos',
      '  - Canales de comunicación directa para quejas de menores',
      '• PROTOCOLO ESPECÍFICO:',
      '  - Código de conducta firmado por todos los entrenadores',
      '  - Evaluaciones periódicas por parte de familias y menores',
      '  - Reuniones mensuales de supervisión técnica',
      '  - Proceso disciplinario claro ante incumplimientos',
      '',
      'PERSONAL AUXILIAR Y DE SERVICIOS:',
      '• RIESGO BAJO-MEDIO: Acceso a instalaciones, contacto ocasional',
      '• EJEMPLOS CONCRETOS:',
      '  - Conserje que tiene llaves de todas las instalaciones',
      '  - Personal de limpieza que trabaja durante entrenamientos',
      '  - Técnicos de mantenimiento que acceden cuando hay menores',
      '  - Personal de cafetería que interactúa con menores',
      '• MEDIDAS PREVENTIVAS:',
      '  - Verificación de antecedentes para todo el personal',
      '  - Formación básica sobre protocolos de protección infantil',
      '  - Supervisión indirecta y limitación de acceso a ciertas áreas',
      '  - Identificación visible y protocolos de presencia',
      '• PROTOCOLO ESPECÍFICO:',
      '  - Horarios diferenciados para trabajos de mantenimiento',
      '  - Nunca personal auxiliar solo con grupos de menores',
      '  - Comunicar presencia a entrenadores y delegado de protección',
      '  - Registro de accesos a instalaciones fuera de horarios',
      '',
      'VOLUNTARIOS Y COLABORADORES:',
      '• RIESGO MEDIO: Personal temporal, formación limitada',
      '• EJEMPLOS CONCRETOS:',
      '  - Padres voluntarios que ayudan en competiciones',
      '  - Estudiantes en prácticas sin experiencia previa',
      '  - Colaboradores externos para actividades especiales',
      '  - Voluntarios de organizaciones benéficas',
      '• MEDIDAS PREVENTIVAS:',
      '  - Proceso de selección y verificación para voluntarios regulares',
      '  - Formación obligatoria antes de comenzar actividades',
      '  - Supervisión directa por personal experimentado',
      '  - Períodos de prueba con evaluación continua',
      '• PROTOCOLO ESPECÍFICO:',
      '  - Entrevista personal y verificación de referencias',
      '  - Acompañamiento inicial por entrenador experimentado',
      '  - Limitación de responsabilidades hasta demostrar competencia',
      '  - Evaluación formal tras período de prueba',
      '',
      '═══════════════════════════════════════════════════════════════════',
      '4. RIESGOS TECNOLÓGICOS Y COMUNICACIÓN DIGITAL',
      '═══════════════════════════════════════════════════════════════════',
      '',
      'REDES SOCIALES Y COMUNICACIÓN DIGITAL:',
      '• RIESGO ALTO: Comunicación privada, imágenes inapropiadas',
      '• EJEMPLOS CONCRETOS:',
      '  - Entrenador que añade menores a redes sociales personales',
      '  - Intercambio de mensajes privados entre adulto y menor',
      '  - Envío de fotos personales o solicitud de las mismas',
      '  - Comentarios inapropiados en publicaciones de menores',
      '• MEDIDAS PREVENTIVAS:',
      '  - Política estricta: solo comunicación a través de canales oficiales',
      '  - Grupos de WhatsApp con participación obligatoria de padres',
      '  - Prohibición de comunicación privada adulto-menor',
      '  - Formación sobre uso apropiado de redes sociales',
      '• PROTOCOLO ESPECÍFICO:',
      '  - Crear grupos oficiales del club para cada equipo',
      '  - Incluir siempre a padres/tutores en grupos de comunicación',
      '  - Documentar y reportar intentos de comunicación privada',
      '  - Revisar periódicamente uso de redes sociales por el personal',
      '',
      'GRABACIONES Y FOTOGRAFÍAS:',
      '• RIESGO MEDIO-ALTO: Uso inadecuado imágenes menores',
      '• EJEMPLOS CONCRETOS:',
      '  - Fotos de menores en vestuarios o momentos íntimos',
      '  - Grabaciones de entrenamientos sin autorización familiar',
      '  - Uso comercial de imágenes sin consentimiento',
      '  - Compartir fotos de menores en redes personales',
      '• MEDIDAS PREVENTIVAS:',
      '  - Autorización expresa por escrito de las familias',
      '  - Uso exclusivamente institucional de imágenes',
      '  - Almacenamiento seguro y acceso restringido',
      '  - Política clara sobre lo que se puede fotografiar',
      '• PROTOCOLO ESPECÍFICO:',
      '  - Solo personal autorizado puede tomar fotografías oficiales',
      '  - Prohibir fotos en vestuarios, duchas o espacios privados',
      '  - Revisar y aprobar imágenes antes de publicar',
      '  - Eliminar imágenes cuando menor deje el club',
      '',
      '═══════════════════════════════════════════════════════════════════',
      '5. PLAN DE ACCIÓN ESPECÍFICO PARA CLUBES DEPORTIVOS',
      '═══════════════════════════════════════════════════════════════════',
      '',
      'MEDIDAS PREVENTIVAS OBLIGATORIAS:',
      '• SUPERVISIÓN ADULTA:',
      '  - Ratio mínimo 1 adulto cada 8 menores en entrenamientos',
      '  - Ratio 1 adulto cada 6 menores en desplazamientos',
      '  - Nunca un adulto completamente solo con un menor',
      '  - Presencia de mínimo 2 adultos en actividades de riesgo',
      '• INSTALACIONES SEGURAS:',
      '  - Vestuarios con supervisión externa constante',
      '  - Espacios de entrenamiento abiertos y visibles',
      '  - Iluminación adecuada en todas las áreas',
      '  - Señalización clara de espacios y normas',
      '• COMUNICACIÓN CONTROLADA:',
      '  - Solo canales oficiales del club para comunicación',
      '  - Participación obligatoria de familias en grupos',
      '  - Prohibición absoluta de comunicación privada',
      '  - Documentación de todas las comunicaciones importantes',
      '',
      'PROTOCOLOS DE DETECCIÓN TEMPRANA:',
      '• OBSERVACIÓN SISTEMÁTICA:',
      '  - Registro diario de comportamiento y estado de ánimo menores',
      '  - Atención a cambios súbitos en rendimiento o actitud',
      '  - Monitoreo de interacciones entre adultos y menores',
      '  - Identificación de señales físicas o emocionales preocupantes',
      '• COMUNICACIÓN FAMILIAR:',
      '  - Reuniones trimestrales con todas las familias',
      '  - Informes mensuales sobre progreso y bienestar',
      '  - Canal directo para reportar preocupaciones',
      '  - Encuestas anónimas de satisfacción y seguridad',
      '• FORMACIÓN CONTINUA:',
      '  - Reuniones mensuales del equipo técnico',
      '  - Formación trimestral sobre detección de señales',
      '  - Sistema de alertas y comunicación interna',
      '  - Actualización anual de protocolos',
      '',
      'ACTUACIÓN ANTE INCIDENTES:',
      '• RESPUESTA INMEDIATA (Primeras 24 horas):',
      '  - Garantizar seguridad inmediata del menor afectado',
      '  - Comunicación urgente al delegado de protección',
      '  - Separación preventiva del personal implicado',
      '  - Documentación detallada de hechos y testimonios',
      '• INVESTIGACIÓN Y SEGUIMIENTO:',
      '  - Aplicación del protocolo según gravedad del incidente',
      '  - Coordinación con servicios sociales si es necesario',
      '  - Comunicación apropiada con familias afectadas',
      '  - Implementación de medidas correctivas adicionales',
      '• EVALUACIÓN Y MEJORA:',
      '  - Análisis de causas y factores contributivos',
      '  - Actualización de protocolos basada en lecciones aprendidas',
      '  - Formación adicional si se identifican gaps',
      '  - Seguimiento a largo plazo del bienestar del menor',
      '',
      '═══════════════════════════════════════════════════════════════════',
      'RESPONSABILIDADES ESPECÍFICAS DEL DELEGADO DE PROTECCIÓN',
      '═══════════════════════════════════════════════════════════════════',
      '',
      'FUNCIONES OPERATIVAS DIARIAS:',
      '✓ Inspeccionar instalaciones y verificar cumplimiento de protocolos',
      '✓ Supervisar interacciones entre personal adulto y menores',
      '✓ Recibir y gestionar reportes de incidencias o preocupaciones',
      '✓ Mantener comunicación fluida con familias sobre temas de protección',
      '✓ Coordinar formación continua del personal en protección infantil',
      '',
      'GESTIÓN DE RIESGOS:',
      '✓ Evaluar y actualizar periódicamente este mapa de riesgos',
      '✓ Implementar medidas preventivas específicas según necesidades',
      '✓ Formar al personal en reconocimiento y gestión de riesgos',
      '✓ Supervisar el cumplimiento de todos los protocolos establecidos',
      '✓ Coordinar con autoridades competentes cuando sea necesario',
      '',
      'DOCUMENTACIÓN Y REGISTRO:',
      '✓ Mantener registro actualizado de personal y sus certificaciones',
      '✓ Documentar incidencias, medidas tomadas y seguimientos',
      '✓ Elaborar informes periódicos sobre estado de protección',
      '✓ Conservar evidencia de formaciones y verificaciones realizadas',
      '✓ Actualizar protocolos basándose en nuevas regulaciones o incidentes',
      '',
      'FRECUENCIA DE REVISIÓN Y ACTUALIZACIÓN:',
      'Este mapa debe revisarse y actualizarse:',
      '• MENSUALMENTE: Revisión de protocolos y efectividad de medidas',
      '• TRIMESTRALMENTE: Evaluación con familias y personal',
      '• SEMESTRALMENTE: Actualización basada en incidentes y mejoras',
      '• ANUALMENTE: Revisión completa y actualización integral',
      '• INMEDIATAMENTE: Cuando ocurran incidentes significativos',
      '',
      'SITUACIONES QUE REQUIEREN ACTUALIZACIÓN INMEDIATA:',
      '• Incorporación de nuevas actividades o modalidades deportivas',
      '• Modificaciones en instalaciones o espacios del club',
      '• Detección de nuevos tipos de riesgo no contemplados',
      '• Ocurrencia de incidentes que revelen vulnerabilidades',
      '• Cambios en legislación o normativas de protección infantil',
      '• Incorporación de nuevo personal o cambios en estructura',
      '',
      'COMPROMISO INSTITUCIONAL:',
      'La protección integral de los menores en el deporte es la máxima prioridad de este club deportivo. Este mapa de riesgos constituye una herramienta viva que debe evolucionar constantemente para garantizar un entorno seguro, positivo y enriquecedor para todos los menores que confían en nosotros.',
      '',
      'Cada miembro del personal, desde entrenadores hasta personal de limpieza, tiene la responsabilidad de conocer, aplicar y mejorar continuamente estas medidas de protección. La vigilancia constante y la adaptación continua son clave para mantener los más altos estándares de seguridad y bienestar infantil en nuestras instalaciones y actividades.'
    ]
  },
  'academia-deportiva': {
    titulo: 'Mapa de Riesgos - Academia Deportiva',
    contenido: [
      'MAPA DE RIESGOS ESPECÍFICO PARA ACADEMIAS DEPORTIVAS',
      '',
      '═══════════════════════════════════════════════════════════════════',
      '1. RIESGOS ESPECÍFICOS DE ACADEMIAS DE ALTO RENDIMIENTO',
      '═══════════════════════════════════════════════════════════════════',
      '',
      'PRESIÓN COMPETITIVA EXTREMA:',
      '• RIESGO ALTO: Presión psicológica excesiva por resultados',
      '• MEDIDAS: Seguimiento psicológico, objetivos realistas',
      '• PROTOCOLO: Evaluación bienestar emocional, comunicación familias',
      '',
      'ENTRENAMIENTOS INTENSIVOS:',
      '• RIESGO ALTO: Sobrecarga física, lesiones por sobreuso',
      '• MEDIDAS: Control médico regular, respeto descansos',
      '• PROTOCOLO: Supervisión médica, escalado gradual intensidad',
      '',
      '// ... resto del contenido específico para academias ...'
    ]
  },
  'centro-deportivo': {
    titulo: 'Mapa de Riesgos - Centro Deportivo',
    contenido: [
      'MAPA DE RIESGOS ESPECÍFICO PARA CENTROS DEPORTIVOS',
      '',
      '═══════════════════════════════════════════════════════════════════',
      '1. RIESGOS EN CENTROS POLIDEPORTIVOS',
      '═══════════════════════════════════════════════════════════════════',
      '',
      'MÚLTIPLES ACTIVIDADES SIMULTÁNEAS:',
      '• RIESGO MEDIO: Supervisión dispersa, control limitado',
      '• MEDIDAS: Coordinación entre monitores, comunicación fluida',
      '• PROTOCOLO: Plan de supervisión integrado, roles definidos',
      '',
      '// ... resto del contenido específico para centros deportivos ...'
    ]
  }
}

export default function ConfiguracionFormacionPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [configuracionCompleta, setConfiguracionCompleta] = useState(false)

  // Estados para los cuatro cuadrados
  const [canalConfigured, setCanalConfigured] = useState(false)
  const [canalPospuesto, setCanalPospuesto] = useState(false)
  const [showCanalForm, setShowCanalForm] = useState(false)
  const [canalConfig, setCanalConfig] = useState<CanalConfig>({
    tipo: '',
    contacto: '',
    horario: '',
    instrucciones: ''
  })

  const [linkGenerated, setLinkGenerated] = useState(false)
  const [shareLink, setShareLink] = useState('')

  const [showMapaRiesgos, setShowMapaRiesgos] = useState(false)
  const [mapaLeido, setMapaLeido] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Nuevo estado para certificado negativo
  const [showCertificadoInfo, setShowCertificadoInfo] = useState(false)
  const [certificadoDelegadoEntregado, setCertificadoDelegadoEntregado] = useState(false)
  const [certificadoSuplenteEntregado, setCertificadoSuplenteEntregado] = useState(false)
  const [certificadoPospuesto, setCertificadoPospuesto] = useState(false)
  const [fechaInicioTramite, setFechaInicioTramite] = useState<Date | null>(null)
  const [diasRestantes, setDiasRestantes] = useState(30)
  const [avisoEnviado15Dias, setAvisoEnviado15Dias] = useState(false)
  const [avisoEnviado30Dias, setAvisoEnviado30Dias] = useState(false)
  const [sistemaRestringido, setSistemaRestringido] = useState(false)

  // Estado para opciones de compartir
  const [showShareOptions, setShowShareOptions] = useState(false)

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

      const legacyAuth = localStorage.getItem('userAuth')
      if (legacyAuth) {
        return JSON.parse(legacyAuth)
      }

      return null
    } catch (error) {
      console.error('Error verificando sesión:', error)
      return null
    }
  }

  useEffect(() => {
    // Obtener sesión real del usuario
    const getSessionData = (): SessionData | null => {
      try {
        // Intentar obtener de localStorage primero
        const persistentSession = localStorage.getItem('userSession')
        if (persistentSession) {
          const session = JSON.parse(persistentSession)
          if (new Date(session.expiracion) > new Date()) {
            return {
              ...session,
              tipoEntidad: session.tipoEntidad || 'club-deportivo'
            }
          }
        }

        // Intentar de sessionStorage
        const tempSession = sessionStorage.getItem('userSession')
        if (tempSession) {
          const session = JSON.parse(tempSession)
          if (new Date(session.expiracion) > new Date()) {
            return {
              ...session,
              tipoEntidad: session.tipoEntidad || 'club-deportivo'
            }
          }
        }

        // Fallback para demo si no hay sesión
        return {
          id: 'demo_formacion_001',
          nombre: 'Ana Fernández López',
          email: 'nuevo@custodia360.com',
          tipo: 'principal',
          entidad: 'Club Deportivo Los Leones',
          tipoEntidad: 'club-deportivo',
          certificacionVigente: true
        }
      } catch (error) {
        console.error('Error obteniendo datos de sesión:', error)
        return null
      }
    }

    const session = getSessionData()
    if (session) {
      setSessionData(session)
    }
    setLoading(false)

    // Cargar estados de certificados entregados
    const certificadoDelegadoGuardado = localStorage.getItem('certificado_delegado_entregado')
    if (certificadoDelegadoGuardado === 'true') {
      setCertificadoDelegadoEntregado(true)
    }

    const certificadoSuplenteGuardado = localStorage.getItem('certificado_suplente_entregado')
    if (certificadoSuplenteGuardado === 'true') {
      setCertificadoSuplenteEntregado(true)
    }

    // Cargar estado de certificado pospuesto
    const certificadoPospuestoGuardado = localStorage.getItem('certificado_pospuesto')
    if (certificadoPospuestoGuardado === 'true') {
      setCertificadoPospuesto(true)
    }

    // Cargar estados de avisos enviados
    const aviso15DiasGuardado = localStorage.getItem('aviso_15_dias_enviado')
    if (aviso15DiasGuardado === 'true') {
      setAvisoEnviado15Dias(true)
    }

    const aviso30DiasGuardado = localStorage.getItem('aviso_30_dias_enviado')
    if (aviso30DiasGuardado === 'true') {
      setAvisoEnviado30Dias(true)
    }

    // Cargar estado de sistema restringido
    const sistemaRestringidoGuardado = localStorage.getItem('sistema_restringido')
    if (sistemaRestringidoGuardado === 'true') {
      setSistemaRestringido(true)
    }

    // Inicializar fecha de trámite si no existe
    const fechaGuardada = localStorage.getItem('fecha_inicio_certificado')
    if (fechaGuardada) {
      const fecha = new Date(fechaGuardada)
      setFechaInicioTramite(fecha)
      calcularDiasRestantes(fecha)
    }

    // Cargar estado del canal pospuesto
    const canalPospuestoGuardado = localStorage.getItem('canal_lopivi_pospuesto')
    if (canalPospuestoGuardado === 'true') {
      setCanalPospuesto(true)
    }
  }, [router])

  const calcularDiasRestantes = (fechaInicio: Date) => {
    const ahora = new Date()
    const diasTranscurridos = Math.floor((ahora.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24))
    const diferencia = 30 - diasTranscurridos
    setDiasRestantes(Math.max(0, diferencia))

    // Enviar avisos automáticos
    if (diasTranscurridos >= 15 && diasTranscurridos < 30 && !avisoEnviado15Dias) {
      enviarAvisoEmail(15)
      setAvisoEnviado15Dias(true)
      localStorage.setItem('aviso_15_dias_enviado', 'true')
    }

    if (diasTranscurridos >= 30 && !avisoEnviado30Dias) {
      enviarAvisoEmail(30)
      setAvisoEnviado30Dias(true)
      setSistemaRestringido(true)
      localStorage.setItem('aviso_30_dias_enviado', 'true')
      localStorage.setItem('sistema_restringido', 'true')
    }
  }

  // Función para enviar avisos por email
  const enviarAvisoEmail = async (dias: number) => {
    if (!sessionData) return

    try {
      const mensaje = dias === 15
        ? {
            asunto: 'Recordatorio: Entrega del Certificado de Delincuentes Sexuales - 15 días',
            destinatario: sessionData.email,
            cuerpo: `
Estimado/a ${sessionData.nombre},

Le recordamos que hace 15 días inició el trámite para obtener el Certificado Negativo del Registro Central de Delincuentes Sexuales y de Trata de Seres Humanos.

Quedan 15 días para completar la entrega. Tras este período, su acceso como Delegado/a de Protección será restringido según la normativa LOPIVI.

Entidad: ${sessionData.entidad}
Tipo de delegado: ${sessionData.tipo === 'principal' ? 'Principal' : 'Suplente'}

Para entregar el certificado, acceda a su dashboard: https://custodia360.com/dashboard

Atentamente,
Equipo Custodia360
            `
          }
        : {
            asunto: 'URGENTE: Acceso restringido por falta de certificado - 30 días',
            destinatarios: [sessionData.email], // Aquí se añadirá el email del contratante
            cuerpo: `
COMUNICACIÓN URGENTE - RESTRICCIÓN DE ACCESO

Estimado/a ${sessionData.nombre},

Han transcurrido 30 días desde el inicio del trámite del Certificado Negativo del Registro Central de Delincuentes Sexuales y de Trata de Seres Humanos, y aún no se ha completado la entrega.

ACCESO RESTRINGIDO:
Según la normativa LOPIVI, no puede ejercer como Delegado/a de Protección sin este certificado.
Su acceso al sistema queda limitado únicamente para completar la entrega del certificado.

Entidad: ${sessionData.entidad}
Tipo de delegado: ${sessionData.tipo === 'principal' ? 'Principal' : 'Suplente'}

Para entregar el certificado urgentemente: https://custodia360.com/dashboard

NOTA: Esta comunicación también se envía al responsable contratante de la entidad.

Atentamente,
Equipo Custodia360
            `
          }

      // Llamada real a la API de emails
      const response = await fetch('/api/emails/certificado-aviso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dias,
          ...mensaje,
          datosUsuario: sessionData
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`✅ Aviso de ${dias} días enviado exitosamente:`, result)
      } else {
        throw new Error('Error en la respuesta del servidor')
      }

    } catch (error) {
      console.error('Error enviando aviso por email:', error)
      // En caso de error, almacenar el intento para reenvío posterior
      localStorage.setItem(`aviso_${dias}_dias_pendiente`, JSON.stringify({
        fecha: new Date().toISOString(),
        usuario: sessionData.email,
        intentos: 1
      }))
    }
  }

  const iniciarTramiteCertificado = () => {
    const fecha = new Date()
    setFechaInicioTramite(fecha)
    localStorage.setItem('fecha_inicio_certificado', fecha.toISOString())
    calcularDiasRestantes(fecha)
    setShowCertificadoInfo(false)
  }

  const posponerCertificado = () => {
    setCertificadoPospuesto(true)
    localStorage.setItem('certificado_pospuesto', 'true')
    setShowCertificadoInfo(false)

    // Iniciar el período de 30 días
    const fecha = new Date()
    setFechaInicioTramite(fecha)
    localStorage.setItem('fecha_inicio_certificado', fecha.toISOString())
    calcularDiasRestantes(fecha)
  }

  const marcarCertificadoEntregado = (tipo: 'delegado' | 'suplente') => {
    if (tipo === 'delegado') {
      setCertificadoDelegadoEntregado(true)
      localStorage.setItem('certificado_delegado_entregado', 'true')
    } else {
      setCertificadoSuplenteEntregado(true)
      localStorage.setItem('certificado_suplente_entregado', 'true')
    }
  }

  const compartirPor = (plataforma: string) => {
    const mensaje = `Información del Delegado de Protección Infantil\n\n${sessionData?.entidad}\nDelegado: ${sessionData?.nombre}\n\nAccede aquí: ${shareLink}\n\nTodos los miembros de la entidad deben conocer estos datos de contacto.`

    let url = ''
    switch (plataforma) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`
        break
      case 'email':
        url = `mailto:?subject=Delegado de Protección - ${sessionData?.entidad}&body=${encodeURIComponent(mensaje)}`
        break
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(`Delegado de Protección - ${sessionData?.entidad}`)}`
        break
    }

    if (url) {
      window.open(url, '_blank')
    }
    setShowShareOptions(false)
  }

  const generarLink = () => {
    if (!sessionData) return

    const baseUrl = 'https://custodia360.com/formacion-lopivi'
    const link = `${baseUrl}?entidad=${encodeURIComponent(sessionData.entidad)}&delegado=${encodeURIComponent(sessionData.nombre)}&id=${sessionData.id}`
    setShareLink(link)
    setLinkGenerated(true)
  }

  const configurarCanal = () => {
    if (!canalConfig.tipo || !canalConfig.contacto) {
      alert('Tipo de canal y contacto son obligatorios')
      return
    }

    localStorage.setItem('canal_lopivi_config', JSON.stringify(canalConfig))
    setCanalConfigured(true)
    setShowCanalForm(false)
    alert('Canal de comunicación configurado exitosamente')
  }

  const posponerCanal = () => {
    setCanalPospuesto(true)
    setShowCanalForm(false)
    localStorage.setItem('canal_lopivi_pospuesto', 'true')
    alert('Configuración del canal pospuesta. Puede configurarlo más tarde desde el dashboard.')
  }

  const handleMapaScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const scrollTop = target.scrollTop
    const scrollHeight = target.scrollHeight - target.clientHeight
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
    setScrollProgress(progress)
  }

  const marcarMapaLeido = () => {
    if (scrollProgress >= 100) {
      setMapaLeido(true)
      setShowMapaRiesgos(false)
    }
  }

  const completarConfiguracion = () => {
    if (!sessionData) {
      console.error('No hay datos de sesión disponibles')
      alert('Error: No se encontraron datos de sesión. Por favor, inicie sesión nuevamente.')
      return
    }

    console.log('Completando configuración para:', sessionData.tipo, sessionData.nombre)

    // Marcar como configuración completada
    setConfiguracionCompleta(true)

    const sessionActualizada = {
      ...sessionData,
      configuracionCompleta: true,
      formacionCompletada: true,
      certificadoPospuesto: certificadoPospuesto,
      sistemaRestringido: sistemaRestringido,
      fechaInicioTramite: fechaInicioTramite?.toISOString(),
      diasRestantesCertificado: diasRestantes,
      expiracion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas de expiración
    }

    try {
      localStorage.setItem('userSession', JSON.stringify(sessionActualizada))
      sessionStorage.setItem('userSession', JSON.stringify(sessionActualizada))
      console.log('Sesión actualizada guardada')

      // Redirigir según el tipo de usuario
      const dashboardUrl = sessionData.tipo === 'principal' ? '/dashboard-delegado' : '/dashboard-suplente'
      console.log('Redirigiendo a:', dashboardUrl)

      // Redirección más directa
      setTimeout(() => {
        try {
          router.push(dashboardUrl)
        } catch (routerError) {
          console.log('Router.push falló, usando window.location')
          window.location.href = dashboardUrl
        }
      }, 1500)

    } catch (error) {
      console.error('Error guardando sesión:', error)
      alert('Error guardando la configuración. Por favor, inténtelo de nuevo.')
    }
  }

  const descargarMapaRiesgos = async () => {
    if (!sessionData) return

    const mapaData = MAPAS_RIESGO[sessionData.tipoEntidad as keyof typeof MAPAS_RIESGO]
    if (!mapaData) return

    try {
      // Importar jsPDF dinámicamente
      const { jsPDF } = await import("jspdf")

      // Crear nuevo documento PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 15
      const usableWidth = pageWidth - (margin * 2)
      let currentY = margin

      // Función para agregar nueva página si es necesario
      const checkNewPage = (neededSpace: number) => {
        if (currentY + neededSpace > pageHeight - margin) {
          doc.addPage()
          currentY = margin
          return true
        }
        return false
      }

      // Header del documento
      doc.setFillColor(44, 62, 80)
      doc.rect(0, 0, pageWidth, 25, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('CUSTODIA360 - SISTEMA LOPIVI', pageWidth / 2, 15, { align: 'center' })

      currentY = 35

      // Título principal
      doc.setTextColor(44, 62, 80)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(mapaData.titulo, pageWidth / 2, currentY, { align: 'center' })
      currentY += 15

      // Información de la entidad
      doc.setFillColor(240, 248, 255)
      doc.rect(margin, currentY, usableWidth, 20, 'F')

      doc.setTextColor(44, 62, 80)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('INFORMACIÓN DE LA ENTIDAD', margin + 5, currentY + 7)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text(`Entidad: ${sessionData.entidad}`, margin + 5, currentY + 12)
      doc.text(`Delegado/a de Protección: ${sessionData.nombre}`, margin + 5, currentY + 16)
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, margin + 5, currentY + 20)

      currentY += 30

      // Procesar contenido
      for (let i = 0; i < mapaData.contenido.length; i++) {
        const linea = mapaData.contenido[i]

        checkNewPage(10)

        if (linea === '') {
          currentY += 4
          continue
        }

        if (linea.startsWith('═══')) {
          // Línea separadora
          doc.setDrawColor(44, 62, 80)
          doc.setLineWidth(1)
          doc.line(margin, currentY, pageWidth - margin, currentY)
          currentY += 8
          continue
        }

        if (linea.match(/^\d+\./) || linea.includes('═══')) {
          // Títulos de sección
          checkNewPage(15)
          doc.setFillColor(52, 73, 94)
          doc.rect(margin, currentY - 3, usableWidth, 10, 'F')

          doc.setTextColor(255, 255, 255)
          doc.setFontSize(12)
          doc.setFont('helvetica', 'bold')
          doc.text(linea, margin + 3, currentY + 3)
          currentY += 15
          continue
        }

        if (linea.endsWith(':') && !linea.startsWith('•') && !linea.startsWith(' ')) {
          // Subtítulos
          checkNewPage(12)
          doc.setTextColor(34, 139, 34)
          doc.setFontSize(11)
          doc.setFont('helvetica', 'bold')
          doc.text(linea, margin, currentY)
          currentY += 8
          continue
        }

        if (linea.startsWith('•')) {
          // Viñetas principales
          checkNewPage(8)
          doc.setTextColor(44, 62, 80)
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          const texto = linea.substring(2)
          const lineasTexto = doc.splitTextToSize(texto, usableWidth - 10)
          doc.text('•', margin, currentY)
          doc.text(lineasTexto, margin + 7, currentY)
          currentY += lineasTexto.length * 5 + 3
          continue
        }

        if (linea.startsWith('  -') || linea.startsWith('  •')) {
          // Sub-viñetas
          checkNewPage(6)
          doc.setTextColor(60, 60, 60)
          doc.setFontSize(9)
          doc.setFont('helvetica', 'normal')
          const texto = linea.substring(4)
          const lineasTexto = doc.splitTextToSize(texto, usableWidth - 20)
          doc.text('  -', margin + 5, currentY)
          doc.text(lineasTexto, margin + 15, currentY)
          currentY += lineasTexto.length * 4 + 2
          continue
        }

        if (linea.startsWith('✓')) {
          // Checkmarks
          checkNewPage(7)
          doc.setTextColor(34, 139, 34)
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          const texto = linea.substring(2)
          const lineasTexto = doc.splitTextToSize(texto, usableWidth - 10)
          doc.text('✓', margin, currentY)
          doc.text(lineasTexto, margin + 7, currentY)
          currentY += lineasTexto.length * 5 + 3
          continue
        }

        // Texto normal
        checkNewPage(8)
        doc.setTextColor(44, 62, 80)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const lineasTexto = doc.splitTextToSize(linea, usableWidth)
        doc.text(lineasTexto, margin, currentY)
        currentY += lineasTexto.length * 5 + 4
      }

      // Footer en todas las páginas
      const totalPages = doc.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)

        // Footer
        doc.setFillColor(240, 240, 240)
        doc.rect(0, pageHeight - 15, pageWidth, 15, 'F')

        doc.setTextColor(100, 100, 100)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text(`Custodia360 - Sistema LOPIVI | ${sessionData.entidad}`, margin, pageHeight - 8)
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' })
        doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, pageHeight - 8, { align: 'center' })
      }

      // Descargar el PDF
      doc.save(`Mapa_Riesgos_${sessionData.entidad.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`)

    } catch (error) {
      console.error('Error generando PDF del mapa de riesgos:', error)
      // Fallback al texto plano si falla el PDF
      const contenidoPDF = `${mapaData.titulo}\n\nEntidad: ${sessionData.entidad}\nDelegado: ${sessionData.nombre}\nFecha: ${new Date().toLocaleDateString('es-ES')}\n\n${mapaData.contenido.join('\n')}`
      const blob = new Blob([contenidoPDF], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Mapa_Riesgos_${sessionData.entidad.replace(/\s+/g, '_')}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Acceso no autorizado</p>
          <Link href="/formacion-lopivi" className="bg-orange-600 text-white px-4 py-2 rounded-lg">
            Volver al Curso
          </Link>
        </div>
      </div>
    )
  }

  if (configuracionCompleta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 text-green-600 font-bold text-2xl">✓</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Configuración Completada!</h2>
          <p className="text-gray-600 mb-6">
            Su formación LOPIVI está completa. Será redirigido al dashboard en unos segundos.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full transition-all duration-2000 w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  const todosCompletados = (canalConfigured || canalPospuesto) && linkGenerated && mapaLeido && (
    sessionData?.tipo === 'principal'
      ? (certificadoDelegadoEntregado || certificadoPospuesto || fechaInicioTramite)
      : (certificadoSuplenteEntregado || certificadoPospuesto || fechaInicioTramite)
  )
  const mapaData = MAPAS_RIESGO[sessionData.tipoEntidad as keyof typeof MAPAS_RIESGO] || MAPAS_RIESGO['club-deportivo']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/formacion-lopivi/certificado" className="text-gray-600 hover:text-gray-900 mr-4">
                ← Volver a Certificado
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Configuración Final</h1>
                <p className="text-sm text-gray-600">Complete la configuración de su sistema LOPIVI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{sessionData.nombre}</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progreso */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Progreso de Configuración</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">F</div>
              <span className="ml-2 text-sm font-medium text-blue-600">Formación</span>
            </div>
            <div className="flex-1 h-1 bg-blue-600 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">T</div>
              <span className="ml-2 text-sm font-medium text-blue-600">Test</span>
            </div>
            <div className="flex-1 h-1 bg-blue-600 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">C</div>
              <span className="ml-2 text-sm font-medium text-blue-600">Certificado</span>
            </div>
            <div className="flex-1 h-1 bg-blue-600 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">Config</div>
              <span className="ml-2 text-sm font-medium text-orange-600">Configuración</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">D</div>
              <span className="ml-2 text-sm font-medium text-gray-500">Dashboard</span>
            </div>
          </div>
        </div>

        {/* Los 4 cuadrados de configuración */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

          {/* 1. Canal de Comunicación */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Canal de Comunicación</h3>
              <p className="text-gray-600 text-sm mb-3">
                <strong>OBLIGATORIO:</strong> Debe crear un canal de comunicación directo donde todos los miembros de su entidad puedan comunicarse con usted como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'} de Protección.
              </p>
              <p className="text-gray-500 text-xs">
                Una vez configurado, este canal aparecerá automáticamente en todos los documentos oficiales de su entidad.
              </p>
            </div>

            {canalConfigured ? (
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-medium">✓ Canal configurado</p>
                </div>
                <button
                  onClick={() => setShowCanalForm(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Modificar Canal
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => setShowCanalForm(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3"
                >
                  Crear Canal
                </button>
                <button
                  onClick={posponerCanal}
                  className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-400 transition-colors"
                >
                  Configurar más tarde
                </button>
              </div>
            )}
          </div>

          {/* 2. Comunicación con Link */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Comunicación</h3>
              <p className="text-gray-600 text-sm mb-3">
                <strong>DIFUSIÓN:</strong> Este link personalizado debe compartirse con TODOS los miembros de su entidad para que conozcan sus datos de contacto como Delegado de Protección y puedan acceder a la información específica de protección infantil.
              </p>
              <p className="text-gray-500 text-xs">
                Inclúyalo en cartelería, documentos informativos, reuniones y comunicaciones oficiales.
              </p>
            </div>

            {linkGenerated ? (
              <div>
                <div className="bg-gray-50 border rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 mb-2">Link generado:</p>
                  <code className="text-xs bg-white p-2 rounded border block break-all">{shareLink}</code>
                </div>
                <div className="text-xs text-gray-600 mb-4">
                  <p className="font-medium mb-1">Instrucciones:</p>
                  <p>Comparta este link con todos los miembros de su entidad para que puedan acceder a la formación LOPIVI específica de {sessionData.entidad}.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(shareLink)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Copiar Link
                  </button>
                  <button
                    onClick={() => setShowShareOptions(true)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Compartir
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-4">
                  Genere un link personalizado para que todos los miembros de su entidad puedan acceder a la formación LOPIVI.
                </p>
                <button
                  onClick={generarLink}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Generar Link
                </button>
              </div>
            )}
          </div>

          {/* 3. Mapa de Riesgos */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mapa de Riesgos</h3>
              <p className="text-gray-600 text-sm mb-3">
                <strong>LECTURA OBLIGATORIA:</strong> Debe leer completamente el mapa de riesgos específico para su tipo de entidad ({sessionData.tipoEntidad.replace('-', ' ')}). Este documento identifica los riesgos específicos, zonas vulnerables y protocolos de prevención que debe implementar como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'}.
              </p>
              <p className="text-gray-500 text-xs">
                Como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'} debe completar la lectura antes de continuar. El documento se puede descargar sin dejar rastro de la lectura.
              </p>
            </div>

            {mapaLeido ? (
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-medium">Mapa leído completamente</p>
                </div>
                <button
                  onClick={descargarMapaRiesgos}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-orange-700 transition-colors mb-2"
                >
                  Descargar Mapa
                </button>
                <button
                  onClick={() => setShowMapaRiesgos(true)}
                  className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-400 transition-colors"
                >
                  Revisar de nuevo
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-4">
                  Debe leer completamente el mapa de riesgos específico de su tipo de entidad para continuar.
                </p>
                <button
                  onClick={() => setShowMapaRiesgos(true)}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Leer Mapa de Riesgos
                </button>
              </div>
            )}
          </div>

          {/* 4. Certificado Negativo del Registro Central */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Certificado Negativo</h3>
              <p className="text-gray-600 text-sm mb-3">
                <strong>DOCUMENTO OBLIGATORIO:</strong> Como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'} debe obtener y entregar el Certificado Negativo del Registro Central de Delincuentes Sexuales y de Trata de Seres Humanos.
              </p>
              <p className="text-gray-500 text-xs">
                Es un requisito legal imprescindible para ejercer funciones de protección infantil como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'}. Disponen de 30 días desde el inicio del trámite para presentarlo.
              </p>
            </div>

            <div className="space-y-4">
              {fechaInicioTramite && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Trámite iniciado</p>
                    <p className="text-xs">Fecha: {fechaInicioTramite.toLocaleDateString('es-ES')}</p>
                    <p className="text-xs">Días restantes: <span className={diasRestantes <= 7 ? 'font-bold text-red-600' : 'font-bold text-blue-600'}>{diasRestantes} días</span></p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'}:</span>
                  <div className="flex items-center">
                    {(sessionData.tipo === 'principal' ? certificadoDelegadoEntregado : certificadoSuplenteEntregado) ? (
                      <span className="text-green-600 text-sm font-medium">Entregado</span>
                    ) : (
                      <button
                        onClick={() => marcarCertificadoEntregado(sessionData.tipo === 'principal' ? 'delegado' : 'suplente')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                      >
                        Marcar entregado
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Delegado Suplente:</span>
                  <div className="flex items-center">
                    {certificadoSuplenteEntregado ? (
                      <span className="text-green-600 text-sm font-medium">Entregado</span>
                    ) : (
                      <button
                        onClick={() => marcarCertificadoEntregado('suplente')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                      >
                        Marcar entregado
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setShowCertificadoInfo(true)}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  ¿Cómo obtenerlo?
                </button>
                {!fechaInicioTramite && (
                  <button
                    onClick={iniciarTramiteCertificado}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors mt-2"
                  >
                    Iniciar trámite (30 días)
                  </button>
                )}
              </div>

              {!(sessionData.tipo === 'principal' ? certificadoDelegadoEntregado : certificadoSuplenteEntregado) && fechaInicioTramite && (
                <div className={`border rounded-lg p-3 ${sistemaRestringido ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  {sistemaRestringido ? (
                    <div>
                      <p className="text-red-800 text-xs font-bold">
                        🚫 ACCESO RESTRINGIDO - 30 DÍAS VENCIDOS
                      </p>
                      <p className="text-red-700 text-xs mt-1">
                        No puede ejercer como Delegado/a de Protección. Solo puede acceder al dashboard para entregar el certificado.
                      </p>
                    </div>
                  ) : certificadoPospuesto ? (
                    <div>
                      <p className="text-yellow-800 text-xs font-bold">
                        ⏳ CERTIFICADO POSPUESTO
                      </p>
                      <p className="text-yellow-700 text-xs mt-1">
                        Quedan {diasRestantes} días para entregar el certificado. Después del plazo, el acceso será restringido.
                      </p>
                      {diasRestantes <= 7 && (
                        <p className="text-red-600 text-xs font-bold mt-1">
                          ⚠️ PLAZO PRÓXIMO A VENCER
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-yellow-800 text-xs">
                      ⚠️ Debe entregar el certificado negativo como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'} para continuar
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botón para acceder al Dashboard */}
        <div className="text-center mb-8">
          {todosCompletados ? (
            <div className="border-2 border-gray-300 rounded-xl p-8 mx-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-green-900 mb-3">¡Configuración Completada!</h3>
                <p className="text-green-800 text-lg">
                  Ha completado exitosamente todos los apartados requeridos para el sistema LOPIVI.
                  Como {sessionData?.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'} de Protección,
                  ya puede acceder al dashboard operativo de <strong>{sessionData?.entidad}</strong>.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={completarConfiguracion}
                  className="w-full max-w-md mx-auto block bg-gradient-to-r from-green-600 to-blue-600 text-white px-12 py-6 rounded-xl font-bold text-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  ACCEDER AL DASHBOARD
                </button>

                <p className="text-sm text-green-700 font-medium">
                  Su sistema LOPIVI está completamente configurado y operativo
                </p>


              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6 mx-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Configuración Pendiente</h3>
                <p className="text-gray-700">
                  Complete todos los apartados requeridos para poder acceder al dashboard operativo.
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center gap-4">
                  <span className={`${canalConfigured ? 'text-green-600' : canalPospuesto ? 'text-yellow-600' : 'text-red-600'}`}>
                    Canal de Comunicación {canalPospuesto ? '(Pospuesto)' : ''}
                  </span>
                  <span className={`${linkGenerated ? 'text-green-600' : 'text-red-600'}`}>
                    Link de Comunicación
                  </span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <span className={`${mapaLeido ? 'text-green-600' : 'text-red-600'}`}>
                    Mapa de Riesgos
                  </span>
                  <span className={`${
                    (sessionData?.tipo === 'principal' ? certificadoDelegadoEntregado : certificadoSuplenteEntregado)
                      ? 'text-green-600'
                      : certificadoPospuesto
                      ? (sistemaRestringido ? 'text-red-600 font-bold' : 'text-yellow-600')
                      : 'text-red-600'
                  }`}>
                    Certificado Negativo {
                      certificadoPospuesto
                        ? (sistemaRestringido ? '(VENCIDO)' : `(Pospuesto - ${diasRestantes}d)`)
                        : ''
                    }
                  </span>
                </div>
              </div>

              <button
                disabled={true}
                className="w-full max-w-md mx-auto block bg-gray-400 text-white px-12 py-4 rounded-xl font-bold text-lg cursor-not-allowed mt-4"
              >
                DASHBOARD BLOQUEADO
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para configurar canal */}
      {showCanalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Configurar Canal de Comunicación</h2>
                <button
                  onClick={() => setShowCanalForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  Cerrar
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de canal *
                  </label>
                  <select
                    value={canalConfig.tipo}
                    onChange={(e) => setCanalConfig(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="telefono">Teléfono directo</option>
                    <option value="email">Email específico</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="mixto">Teléfono + Email</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contacto *
                  </label>
                  <input
                    type="text"
                    value={canalConfig.contacto}
                    onChange={(e) => setCanalConfig(prev => ({ ...prev, contacto: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="600 123 456 o email@entidad.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horario de atención
                  </label>
                  <input
                    type="text"
                    value={canalConfig.horario}
                    onChange={(e) => setCanalConfig(prev => ({ ...prev, horario: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Lunes a Viernes 9:00-17:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instrucciones adicionales
                  </label>
                  <textarea
                    value={canalConfig.instrucciones}
                    onChange={(e) => setCanalConfig(prev => ({ ...prev, instrucciones: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Instrucciones especiales..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={configurarCanal}
                    disabled={!canalConfig.tipo || !canalConfig.contacto}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Configurar Canal
                  </button>
                  <button
                    onClick={posponerCanal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Posponer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para mapa de riesgos */}
      {showMapaRiesgos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{mapaData.titulo}</h2>
                <p className="text-sm text-gray-600">Lectura obligatoria para delegados de protección</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={descargarMapaRiesgos}
                  disabled={scrollProgress < 100}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scrollProgress >= 100
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {scrollProgress >= 100 ? 'Descargar' : `Leer ${Math.round(scrollProgress)}%`}
                </button>
                <button
                  onClick={() => setShowMapaRiesgos(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div className="px-6 py-2 border-b bg-gray-50">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progreso de lectura</span>
                <span>{Math.round(scrollProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-orange-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>

            <div
              className="flex-1 p-6 overflow-y-auto"
              onScroll={handleMapaScroll}
            >
              <div className="prose max-w-none">
                {mapaData.contenido.map((linea, index) => (
                  <div key={index} className="mb-3">
                    {linea === '' ? (
                      <div className="h-2" />
                    ) : linea.startsWith('═══') ? (
                      <hr className="my-4 border-t-2 border-gray-300" />
                    ) : linea.match(/^\d+\./) || linea.startsWith('MÓDULO') ? (
                      <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">{linea}</h3>
                    ) : linea.startsWith('•') ? (
                      <div className="ml-4 text-gray-700 mb-2">{linea}</div>
                    ) : linea.startsWith('✓') ? (
                      <div className="ml-4 text-green-700 mb-2 font-medium">{linea}</div>
                    ) : (
                      <p className="text-gray-800 leading-relaxed">{linea}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Debe leer completamente el mapa para continuar
                </div>
                <button
                  onClick={marcarMapaLeido}
                  disabled={scrollProgress < 100}
                  className={`px-8 py-3 rounded-lg font-bold transition-colors ${
                    scrollProgress >= 100
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {scrollProgress >= 100 ? 'MARCAR COMO LEÍDO' : `LEER HASTA EL FINAL (${Math.round(scrollProgress)}%)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de información del certificado negativo */}
      {showCertificadoInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Certificado Negativo del Registro Central de Delincuentes Sexuales y de Trata de Seres Humanos
                </h2>
                <button
                  onClick={() => setShowCertificadoInfo(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-800 mb-2">OBLIGATORIO PARA DELEGADOS LOPIVI</h3>
                <p className="text-red-700 text-sm">
                  Como delegado/a {sessionData.tipo === 'principal' ? 'principal' : 'suplente'} debe presentar este certificado negativo
                  antes de poder ejercer sus funciones de protección infantil.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Tramitación Presencial */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Tramitación Presencial
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-800">Dónde dirigirse:</h4>
                      <ul className="text-gray-700 ml-4 space-y-1">
                        <li>• Oficinas del Registro Central (Madrid)</li>
                        <li>• Delegaciones provinciales del Ministerio de Justicia</li>
                        <li>• Algunos Ayuntamientos autorizados</li>
                        <li>• Oficinas de Correos (solo algunos)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800">Documentación necesaria:</h4>
                      <ul className="text-gray-700 ml-4 space-y-1">
                        <li>• DNI original y fotocopia</li>
                        <li>• Formulario oficial cumplimentado</li>
                        <li>• Justificante del pago de tasas (3,02€)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800">Plazo de entrega:</h4>
                      <p className="text-gray-700 ml-4">Habitualmente entre 3-7 días laborables</p>
                    </div>
                  </div>
                </div>

                {/* Tramitación Telemática */}
                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Tramitación Telemática
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-800">Sede electrónica:</h4>
                      <p className="text-blue-600 ml-4 break-all">
                        https://sede.mjusticia.gob.es
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800">Requisitos:</h4>
                      <ul className="text-gray-700 ml-4 space-y-1">
                        <li>• Certificado digital o DNI electrónico</li>
                        <li>• Cl@ve PIN</li>
                        <li>• Pago telemático (tarjeta bancaria)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800">Pasos:</h4>
                      <ol className="text-gray-700 ml-4 space-y-1">
                        <li>1. Acceder con certificado digital</li>
                        <li>2. Completar formulario online</li>
                        <li>3. Realizar pago (3,02€)</li>
                        <li>4. Descargar certificado en 24-48h</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-800 mb-2">INFORMACIÓN IMPORTANTE</h3>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• El certificado tiene una validez de 3 meses desde su expedición</li>
                  <li>• Es gratuito para víctimas de violencia de género</li>
                  <li>• Se puede solicitar para terceros con autorización notarial</li>
                  <li>• Es obligatorio para trabajar con menores en el ámbito LOPIVI</li>
                  <li>• Debe renovarse periódicamente según la normativa de la entidad</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-800 mb-2">CONTACTO Y AYUDA</h3>
                <div className="text-blue-700 text-sm space-y-1">
                  <p><strong>Teléfono:</strong> 912 117 842</p>
                  <p><strong>Email:</strong> registrocentral@mjusticia.es</p>
                  <p><strong>Horario:</strong> Lunes a Viernes 9:00 - 14:00</p>
                </div>
              </div>

              <div className="text-center pt-4">
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={iniciarTramiteCertificado}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                  >
                    Entendido - Iniciar Trámite (30 días)
                  </button>
                  <button
                    onClick={posponerCertificado}
                    className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                  >
                    Posponer por 30 días
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Si pospone: tendrá 30 días para entregar el certificado. Podrá acceder al dashboard pero con restricciones después de 30 días.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de opciones de compartir */}
      {showShareOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Compartir Link de Delegado</h2>
                <button
                  onClick={() => setShowShareOptions(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Selecciona cómo quieres compartir la información del Delegado de Protección con los miembros de tu entidad:
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => compartirPor('whatsapp')}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">WhatsApp</div>
                  <div className="text-sm text-gray-600">Compartir por WhatsApp</div>
                </button>

                <button
                  onClick={() => compartirPor('email')}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Email</div>
                  <div className="text-sm text-gray-600">Enviar por correo electrónico</div>
                </button>

                <button
                  onClick={() => compartirPor('telegram')}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Telegram</div>
                  <div className="text-sm text-gray-600">Compartir por Telegram</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
