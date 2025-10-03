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

export default function DashboardDelegadoSuplente() {
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

  // Determinar tipo de entidad (esto sería dinámico en la implementación real)
  const tipoEntidad = 'centro-deportivo' // Opciones: 'centro-deportivo', 'centro-educativo', 'campamento', 'otras-actividades'

  // Función para obtener contenido específico del documento según tipo de entidad
  const obtenerContenidoDocumento = (tipoDoc: string) => {
    const contenidos: { [key: string]: any } = {
      'protocolo-general': {
        titulo: 'Protocolo General de Protección Infantil',
        subtitulo: 'Documento marco para la implementación integral LOPIVI',
        contenido: {
          'centro-deportivo': {
            objetivo: 'Establecer un marco integral de protección para todos los menores que participan en actividades deportivas y recreativas de la entidad.',
            ambito: 'Este protocolo se aplica a todas las instalaciones deportivas, actividades, competiciones, entrenamientos, viajes deportivos y eventos organizados por la entidad.',
            responsabilidades: [
              'Directivos: Supervisión general y toma de decisiones estratégicas',
              'Delegado/a Principal: Coordinación y gestión de casos',
              'Delegado/a Suplente: Apoyo y seguimiento especializado',
              'Entrenadores/Monitores: Detección temprana y comunicación',
              'Personal de apoyo: Colaboración en la prevención y protección'
            ],
            procedimientos: [
              'Identificación y evaluación de situaciones de riesgo en espacios deportivos',
              'Protocolos específicos para vestuarios, duchas y espacios privados',
              'Gestión de competiciones y eventos con participación de menores',
              'Procedimientos para viajes y concentraciones deportivas',
              'Comunicación inmediata con familias y autoridades competentes'
            ]
          }
        }
      },
      'protocolo-infancia': {
        titulo: 'Protocolo de Protección Infantil',
        subtitulo: 'Procedimientos base para la protección de menores',
        contenido: `
**1. OBJETIVO Y ÁMBITO DE APLICACIÓN**

Este protocolo establece las directrices fundamentales para garantizar la protección integral de todos los menores en el ámbito de actuación de la entidad, conforme a la Ley Orgánica 8/2021 de protección integral a la infancia y la adolescencia frente a la violencia.

**2. PRINCIPIOS FUNDAMENTALES**

• **Interés superior del menor**: Toda actuación debe priorizar el bienestar del menor
• **Participación**: Derecho del menor a ser escuchado según su edad y madurez
• **No discriminación**: Protección igualitaria independientemente del origen o condición
• **Proporcionalidad**: Las medidas deben ser necesarias y adecuadas
• **Intervención mínima**: Menor intrusión posible en la vida del menor y su familia

**3. IDENTIFICACIÓN DE SITUACIONES DE RIESGO**

**Indicadores físicos:**
- Lesiones inexplicadas o inconsistentes con la explicación dada
- Marcas de ataduras, quemaduras o heridas características
- Fatiga constante, apatía o problemas de concentración
- Llegadas tempranas y marchas tardías de la actividad

**Indicadores emocionales:**
- Cambios drásticos en el comportamiento o rendimiento
- Comportamientos extremos (muy agresivo o muy pasivo)
- Miedo excesivo a determinadas personas o situaciones
- Comportamientos sexualizados inadecuados para la edad

**4. PROCEDIMIENTOS DE ACTUACIÓN**

**Ante sospecha de maltrato:**
1. **Garantizar la seguridad inmediata** del menor
2. **Documentar** detalladamente todos los indicadores observados
3. **Comunicar inmediatamente** al Delegado/a de Protección
4. **No investigar** por cuenta propia - dejar la investigación a profesionales
5. **Mantener la confidencialidad** estricta del caso

**5. COMUNICACIÓN Y DERIVACIÓN**

• **Servicios Sociales**: Notificación obligatoria en casos de riesgo o desprotección
• **Fuerzas de Seguridad**: En casos de posible delito contra menores
• **Servicios Sanitarios**: Para evaluación médica cuando sea necesario

**6. FORMACIÓN Y SENSIBILIZACIÓN**

Todo el personal debe recibir formación específica en:
- Detección de indicadores de maltrato infantil
- Procedimientos de actuación según este protocolo
- Marco legal de protección a la infancia
        `
      },
      'protocolo-directiva': {
        titulo: 'Protocolo para Directivos',
        subtitulo: 'Responsabilidades específicas del equipo directivo',
        contenido: `
**RESPONSABILIDADES ESPECÍFICAS DEL EQUIPO DIRECTIVO EN PROTECCIÓN INFANTIL**

**1. LIDERAZGO Y COMPROMISO INSTITUCIONAL**

**Establecimiento de la cultura de protección:**
• Promover una cultura organizacional que priorice la protección infantil
• Comunicar claramente el compromiso de la entidad con la seguridad de los menores
• Establecer el tono ético y los valores organizacionales
• Asegurar recursos suficientes para la implementación efectiva

**Responsabilidades estratégicas:**
• Aprobación y revisión anual de políticas de protección infantil
• Supervisión de la implementación del Plan de Protección
• Garantizar el cumplimiento de la normativa LOPIVI
• Toma de decisiones en casos complejos o de alto impacto

**2. GESTIÓN DE RECURSOS HUMANOS**

**Selección de personal:**
• Verificar antecedentes penales de todo el personal
• Incluir preguntas sobre protección infantil en entrevistas
• Verificar referencias específicas sobre trabajo con menores
• Asegurar que el personal comprende las políticas de protección

**Formación y desarrollo:**
• Organizar formación inicial obligatoria en protección infantil
• Programar formación continua y actualizaciones normativas
• Evaluar la competencia del personal en protección infantil
• Documentar toda la formación recibida por el personal

**3. TOMA DE DECISIONES EN CASOS GRAVES**

**Protocolo de decisión urgente:**
1. **Evaluación inmediata** de la situación y nivel de riesgo
2. **Consulta** con el Delegado/a Principal de Protección
3. **Decisión** sobre medidas cautelares inmediatas
4. **Comunicación** con autoridades competentes
5. **Documentación** completa de todas las decisiones tomadas

**Decisiones sobre personal:**
• Suspensión temporal de funciones en casos graves
• Reasignación de responsabilidades durante investigaciones
• Decisiones sobre continuidad laboral tras investigaciones
• Implementación de medidas disciplinarias cuando proceda

**4. COMUNICACIÓN EXTERNA**

**Con familias:**
• Comunicación transparente respetando la confidencialidad
• Información sobre políticas y procedimientos de protección
• Gestión de quejas y sugerencias relacionadas con protección
• Coordinación en planes de seguridad individualizados

**Con autoridades:**
• Colaboración plena con investigaciones oficiales
• Facilitación de información y documentación requerida
• Implementación de medidas solicitadas por servicios sociales
• Representación institucional en procedimientos legales

**5. GESTIÓN DE CRISIS**

**Preparación y prevención:**
• Desarrollo de planes de contingencia para diferentes escenarios
• Identificación de riesgos específicos de la entidad
• Establecimiento de protocolos de comunicación de crisis
• Preparación de personal para situaciones de emergencia

**Durante la crisis:**
• Activación inmediata de protocolos de emergencia
• Coordinación con servicios de emergencia y autoridades
• Gestión de comunicación con medios de comunicación
• Protección de la privacidad de menores involucrados

**6. SUPERVISIÓN Y EVALUACIÓN**

**Monitoreo continuo:**
• Revisión regular de la efectividad de las políticas
• Análisis de incidentes y lecciones aprendidas
• Evaluación del clima organizacional respecto a protección
• Auditorías internas de cumplimiento normativo

**Mejora continua:**
• Actualización de procedimientos basada en la experiencia
• Incorporación de mejores prácticas del sector
• Adaptación a cambios normativos
• Inversión en mejoras de sistemas y procesos

**7. MARCO LEGAL Y NORMATIVO**

• Conocimiento actualizado de la legislación aplicable
• Asegurar el cumplimiento de todas las obligaciones legales
• Coordinación con asesoramiento jurídico especializado
• Implementación de recomendaciones de organismos oficiales
        `
      },
      'protocolo-contacto': {
        titulo: 'Protocolo Personal de Contacto',
        subtitulo: 'Directrices para personal con contacto directo con menores',
        contenido: `
**PROTOCOLO PARA PERSONAL CON CONTACTO DIRECTO CON MENORES**

**1. PRINCIPIOS DE ACTUACIÓN PROFESIONAL**

**Comportamiento apropiado:**
• Mantener en todo momento un comportamiento profesional y apropiado
• Tratar a todos los menores con dignidad, respeto e igualdad
• Ser un modelo positivo de comportamiento para los menores
• Mantener límites profesionales claros en todo momento

**Comunicación efectiva:**
• Usar un lenguaje apropiado, positivo y no discriminatorio
• Escuchar activamente las preocupaciones de los menores
• Adaptar la comunicación a la edad y madurez del menor
• Fomentar la participación y expresión libre de opiniones

**2. INTERACCIONES FÍSICAS APROPIADAS**

**Contacto físico necesario:**
• Solo cuando sea absolutamente necesario para la seguridad o actividad
• Con el consentimiento del menor cuando sea posible
• En presencia de otros adultos o en espacios visibles
• Documentar situaciones que requieran contacto físico regular

**Situaciones específicas:**
• **Primeros auxilios**: Explicar al menor lo que se va a hacer
• **Actividades deportivas**: Contacto mínimo necesario para enseñanza técnica
• **Apoyo emocional**: Preferir apoyo verbal, contacto físico solo si es apropiado

**Contacto físico inapropiado (NUNCA):**
• Contacto de naturaleza sexual o que pueda interpretarse como tal
• Castigos físicos de cualquier tipo
• Contacto cuando el menor lo rechace o se sienta incómodo
• Contacto en zonas privadas del cuerpo salvo emergencia médica

**3. GESTIÓN DE ESPACIOS Y SUPERVISIÓN**

**Espacios de actividad:**
• Mantener siempre visibilidad desde exterior en actividades
• Evitar estar a solas con un menor sin posibilidad de observación
• Usar espacios apropiados para reuniones individuales
• Informar a supervisores sobre reuniones individuales programadas

**Vestuarios y espacios privados:**
• No acceder a vestuarios mientras menores se cambian
• Supervisar desde entrada manteniendo privacidad apropiada
• Permitir tiempo suficiente para cambiarse sin presión
• Respetar diferentes niveles de modestia y comodidad

**4. COMUNICACIÓN DIGITAL Y REDES SOCIALES**

**Comunicación oficial:**
• Usar únicamente canales oficiales aprobados por la entidad
• Incluir siempre a supervisores en comunicaciones importantes
• Mantener registro de comunicaciones significativas
• Usar un lenguaje profesional en todas las comunicaciones

**Redes sociales y contacto personal:**
• No establecer contacto personal en redes sociales con menores
• No intercambiar números de teléfono personales
• Reportar intentos de contacto personal por parte de menores
• Mantener perfiles personales privados y apropiados

**5. DETECCIÓN Y RESPUESTA A SITUACIONES DE RIESGO**

**Indicadores de alarma:**
• Cambios significativos en comportamiento o rendimiento
• Signs de abuso físico, emocional o sexual
• Comportamientos sexualizados inapropiados para la edad
• Miedo excesivo o ansiedad en presencia de ciertos adultos

**Procedimiento de actuación:**
1. **Observar y documentar** indicadores específicos
2. **No investigar directamente** - evitar preguntas leading
3. **Comunicar inmediatamente** al Delegado/a de Protección
4. **Mantener confidencialidad** estricta
5. **Continuar proporcionando** apoyo normalizado al menor

**6. SITUACIONES ESPECIALES**

**Disclosure espontáneo:**
• Escuchar sin juzgar ni expresar shock
• No prometer confidencialidad absoluta
• Tranquilizar al menor sobre que ha hecho bien al contarlo
• Documentar las palabras exactas usadas por el menor
• Comunicar inmediatamente según protocolo

**Emergencias médicas:**
• Priorizar siempre la seguridad y bienestar del menor
• Contactar servicios de emergencia si es necesario
• Informar a supervisores tan pronto como sea posible
• Documentar todos los procedimientos realizados

**7. AUTOCUIDADO Y APOYO PROFESIONAL**

**Gestión del estrés:**
• Reconocer el impacto emocional del trabajo con menores
• Buscar apoyo de supervisores cuando sea necesario
• Participar en actividades de team building y apoyo mutuo
• Acceder a recursos de bienestar proporcionados por la entidad

**Desarrollo profesional continuo:**
• Participar activamente en formación sobre protección infantil
• Mantenerse actualizado sobre mejores prácticas
• Reflexionar sobre la propia práctica y buscar mejoras
• Compartir aprendizajes con colegas de manera apropiada
        `
      },
      'protocolo-sin-contacto': {
        titulo: 'Protocolo Personal Sin Contacto',
        subtitulo: 'Directrices para personal administrativo y de apoyo',
        contenido: `
**PROTOCOLO PARA PERSONAL SIN CONTACTO DIRECTO CON MENORES**

**1. RESPONSABILIDADES EN PROTECCIÓN INFANTIL**

**Aunque no tenga contacto directo con menores, todo el personal tiene responsabilidades importantes:**

**Observación y vigilancia:**
• Estar atento a situaciones inusuales en las instalaciones
• Observar comportamientos preocupantes de adultos hacia menores
• Reportar inmediatamente cualquier situación sospechosa
• Mantener vigilancia discreta en espacios comunes

**Confidencialidad:**
• Proteger estrictamente la información sobre menores
• No compartir información personal o familiar de los menores
• Mantener confidencialidad sobre casos en investigación
• Seguir protocolos de protección de datos personales

**2. GESTIÓN DE INFORMACIÓN Y DOCUMENTACIÓN**

**Manejo de expedientes:**
• Acceso restringido únicamente a personal autorizado
• Almacenamiento seguro de documentación sensible
• Registro de accesos a información confidencial
• Destrucción segura de documentos obsoletos

**Comunicaciones:**
• Filtrado apropiado de llamadas relacionadas con menores
• Derivación inmediata de informaciones relevantes
• Documentación de comunicaciones importantes
• Protección de datos en comunicaciones electrónicas

**3. CONTROL DE ACCESOS Y SEGURIDAD**

**Gestión de visitantes:**
• Verificación de identidad de todos los visitantes
• Acompañamiento de visitantes en áreas con menores
• Registro detallado de entradas y salidas
• Control de acceso a zonas restringidas

**Seguridad de instalaciones:**
• Mantenimiento de sistemas de seguridad operativos
• Supervisión de cámaras de seguridad cuando las haya
• Control de llaves y códigos de acceso
• Reporte inmediato de fallos de seguridad

**4. COMUNICACIÓN CON FAMILIAS**

**Atención telefónica:**
• Trato respetuoso y profesional con todas las familias
• Derivación apropiada de consultas sobre protección
• No proporcionar información sin autorización
• Documentación de comunicaciones relevantes

**Gestión de quejas:**
• Recepción profesional de quejas relacionadas con protección
• Derivación inmediata a personal especializado
• No minimizar ni desestimar preocupaciones familiares
• Seguimiento del estado de resolución

**5. APOYO AL PERSONAL DE CONTACTO DIRECTO**

**Coordinación interna:**
• Facilitar comunicaciones urgentes sobre protección
• Apoyar en gestión de crisis cuando sea necesario
• Colaborar en implementación de medidas de seguridad
• Backup en procedimientos administrativos urgentes

**Gestión de recursos:**
• Asegurar disponibilidad de materiales de primeros auxilios
• Mantenimiento de equipos de comunicación
• Gestión de suministros para actividades seguras
• Apoyo logístico en situaciones de emergencia

**6. FORMACIÓN Y COMPETENCIAS REQUERIDAS**

**Conocimientos básicos necesarios:**
• Principios fundamentales de protección infantil
• Procedimientos básicos de emergencia
• Protocolos de comunicación interna
• Normativa básica de protección de datos

**Habilidades de comunicación:**
• Escucha activa y empática
• Comunicación clara y profesional
• Gestión de situaciones tensas
• Trabajo en equipo efectivo

**7. SITUACIONES ESPECÍFICAS DE ACTUACIÓN**

**Emergencias médicas:**
• Contacto inmediato con servicios de emergencia
• Comunicación rápida con responsables de la entidad
• Facilitación de acceso a personal sanitario
• Documentación de incidentes para seguimiento

**Situaciones de conflicto:**
• No intervenir directamente en conflictos con menores
• Comunicación inmediata con personal de contacto directo
• Evitar tomar decisiones sobre manejo de menores
• Apoyo logístico según sea requerido

**Presencia de autoridades:**
• Recepción profesional de autoridades competentes
• Facilitación de acceso según protocolos legales
• Comunicación inmediata con dirección
• Colaboración en investigaciones oficiales

**8. AUTOPROTECCIÓN Y LÍMITES PROFESIONALES**

**Claridad de rol:**
• Entender claramente los límites de su función
• No asumir responsabilidades fuera de su competencia
• Derivar apropiadamente situaciones complejas
• Mantener profesionalidad en todo momento

**Protección personal:**
• Evitar situaciones que puedan ser malinterpretadas
• Trabajar siempre dentro de protocolos establecidos
• Buscar apoyo de supervisores cuando sea necesario
• Documentar situaciones inusuales para protección mutua
        `
      },
      'mapa-riesgos': {
        titulo: 'Mapa de Riesgos',
        subtitulo: 'Herramienta de identificación y gestión de riesgos',
        contenido: `
**MAPA DE RIESGOS PARA PROTECCIÓN INFANTIL**

**1. METODOLOGÍA DE EVALUACIÓN DE RIESGOS**

**Identificación de riesgos:**
• Análisis sistemático de todas las actividades con menores
• Evaluación de espacios físicos y su potencial de riesgo
• Revisión de procedimientos y protocolos existentes
• Consulta con personal, menores y familias

**Valoración del riesgo:**
• **Probabilidad**: Muy baja (1) - Muy alta (5)
• **Impacto**: Muy bajo (1) - Muy alto (5)
• **Nivel de riesgo**: Probabilidad × Impacto
• **Clasificación**: Bajo (1-5), Medio (6-15), Alto (16-25)

**2. IDENTIFICACIÓN DE RIESGOS POR ÁREAS**

**RIESGOS RELACIONADOS CON PERSONAL**

**Riesgo Alto (Nivel 20-25):**
• Personal sin formación específica en protección infantil
• Falta de verificación de antecedentes penales
• Supervisión inadecuada de personal con acceso a menores
• Personal temporal sin inducción en protocolos

**Medidas de control:**
- Verificación obligatoria de antecedentes para todo el personal
- Formación inicial y continua en protección infantil
- Sistema de supervisión y mentoring para personal nuevo
- Evaluación regular del desempeño en protección

**Riesgo Medio (Nivel 10-15):**
• Rotación alta de personal sin estabilidad
• Comunicación deficiente entre turnos de trabajo
• Falta de protocolos claros para situaciones específicas
• Personal sin experiencia previa con menores

**Medidas de control:**
- Políticas de retención de personal cualificado
- Sistemas de comunicación efectiva entre turnos
- Desarrollo de protocolos específicos detallados
- Programas de mentoring y acompañamiento

**RIESGOS RELACIONADOS CON INSTALACIONES**

**Riesgo Alto (Nivel 16-20):**
• Zonas aisladas sin supervisión o visibilidad
• Vestuarios sin diseño apropiado para seguridad
• Accesos no controlados a las instalaciones
• Falta de sistemas de emergencia operativos

**Medidas de control:**
- Rediseño de espacios para maximizar visibilidad
- Implementación de sistemas de control de acceso
- Supervisión constante de áreas de riesgo
- Mantenimiento regular de sistemas de emergencia

**Riesgo Medio (Nivel 6-15):**
• Iluminación inadecuada en ciertas áreas
• Equipamiento en mal estado o peligroso
• Falta de señalización de seguridad clara
• Espacios de almacenamiento no seguros

**Medidas de control:**
- Auditorías regulares de seguridad de instalaciones
- Mantenimiento preventivo de equipamiento
- Mejora de iluminación en todas las áreas
- Señalización clara de normas y procedimientos

**RIESGOS RELACIONADOS CON ACTIVIDADES**

**Riesgo Alto (Nivel 16-20):**
• Actividades de contacto físico sin protocolos claros
• Ratio inadecuado adulto-menor en actividades
• Actividades en espacios aislados sin supervisión
• Eventos con participación de externos sin control

**Medidas de control:**
- Protocolos específicos para actividades de contacto
- Ratios mínimos obligatorios según tipo de actividad
- Supervisión múltiple en actividades de riesgo
- Control estricto de participantes externos

**Riesgo Medio (Nivel 6-15):**
• Uso de tecnología sin supervisión apropiada
• Actividades nocturnas sin protocolos específicos
• Transporte de menores sin medidas de seguridad
• Comunicación con familias inadecuada

**Medidas de control:**
- Políticas claras sobre uso de tecnología
- Protocolos específicos para actividades nocturnas
- Procedimientos de seguridad en transporte
- Sistemas de comunicación regular con familias

**3. PLAN DE ACCIÓN Y SEGUIMIENTO**

**Priorización de acciones:**
1. **Inmediatas** (Riesgos nivel 20-25): Implementación en 30 días
2. **Corto plazo** (Riesgos nivel 16-19): Implementación en 3 meses
3. **Medio plazo** (Riesgos nivel 10-15): Implementación en 6 meses
4. **Largo plazo** (Riesgos nivel 5-9): Implementación en 12 meses

**Responsabilidades:**
• **Dirección**: Aprobación de recursos y supervisión general
• **Delegado/a Principal**: Coordinación de implementación
• **Delegado/a Suplente**: Seguimiento y apoyo en implementación
• **Personal**: Aplicación de medidas en su área de trabajo

**4. MONITOREO Y REVISIÓN**

**Indicadores de seguimiento:**
• Número de incidentes reportados por tipo
• Tiempo de respuesta en implementación de medidas
• Nivel de cumplimiento de protocolos por personal
• Satisfacción de familias con medidas de seguridad

**Revisión periódica:**
• **Mensual**: Revisión de incidentes y near-miss
• **Trimestral**: Evaluación de eficacia de medidas implementadas
• **Semestral**: Revisión completa del mapa de riesgos
• **Anual**: Actualización integral basada en cambios y experiencia

**5. COMUNICACIÓN Y FORMACIÓN**

**Difusión del mapa de riesgos:**
• Presentación a todo el personal de los riesgos identificados
• Formación específica sobre medidas de control
• Actualización regular sobre cambios y mejoras
• Involucración del personal en identificación de nuevos riesgos

**Cultura de seguridad:**
• Fomento de la comunicación abierta sobre riesgos
• Reconocimiento de buenas prácticas en seguridad
• Aprendizaje de incidentes sin culpabilización
• Mejora continua basada en la experiencia del equipo
        `
      },
      'codigo-conducta': {
        titulo: 'Código de Conducta',
        subtitulo: 'Normas de comportamiento para todo el personal',
        contenido: `
**CÓDIGO DE CONDUCTA PARA LA PROTECCIÓN DE MENORES**

**PREÁMBULO**

Este Código de Conducta establece los estándares de comportamiento esperados de todo el personal, voluntarios y colaboradores que trabajen con menores en nuestra entidad. Su cumplimiento es obligatorio y su violación puede resultar en medidas disciplinarias, incluyendo la terminación de la relación laboral o colaboración.

**1. PRINCIPIOS FUNDAMENTALES**

**Respeto y dignidad:**
• Tratar a todos los menores con respeto, dignidad e igualdad
• Reconocer y valorar las diferencias individuales y culturales
• Promover la inclusión y prevenir cualquier forma de discriminación
• Respetar la privacidad y confidencialidad de los menores

**Integridad profesional:**
• Mantener los más altos estándares de honestidad e integridad
• Actuar siempre en el interés superior del menor
• Evitar conflictos de interés que puedan comprometer el juicio profesional
• Ser transparente en todas las interacciones profesionales

**2. COMPORTAMIENTOS OBLIGATORIOS**

**DEBES:**

**En las interacciones:**
• Escuchar activamente a los menores y tomar en serio sus preocupaciones
• Usar un lenguaje apropiado, positivo e inclusivo
• Ser paciente y comprensivo con diferentes ritmos de aprendizaje
• Fomentar la participación y autonomía apropiada para la edad
• Modelar comportamientos positivos y apropiados
• Respetar los límites personales y culturales

**En la comunicación:**
• Mantener comunicaciones profesionales en todo momento
• Usar canales oficiales aprobados para comunicaciones importantes
• Documentar interacciones significativas según protocolos
• Informar inmediatamente sobre preocupaciones de protección
• Ser honesto y preciso en todos los informes y documentación

**En el entorno profesional:**
• Crear un ambiente seguro y acogedor para todos los menores
• Mantener supervisión apropiada según las actividades
• Seguir todos los protocolos de seguridad establecidos
• Participar activamente en formación y desarrollo profesional
• Colaborar efectivamente con colegas y supervisores

**3. COMPORTAMIENTOS PROHIBIDOS**

**NUNCA DEBES:**

**Contacto físico inapropiado:**
• Tener contacto físico de naturaleza sexual o íntima
• Usar castigo físico de cualquier tipo
• Tocar zonas privadas del cuerpo excepto en emergencias médicas
• Forzar contacto físico cuando el menor lo rechace
• Tener contacto físico en privado sin supervisión

**Comportamiento emocional inadecuado:**
• Usar lenguaje ofensivo, humillante o sexualmente sugestivo
• Gritar, amenazar o intimidar a menores
• Mostrar favoritismo extremo o trato discriminatorio
• Ridiculizar o humillar a un menor frente a otros
• Ignorar o desestimar sistemáticamente a un menor

**Violaciones de límites profesionales:**
• Desarrollar relaciones personales inapropiadas con menores
• Contactar menores fuera de canales oficiales
• Compartir información personal inapropiada sobre tu vida
• Aceptar regalos significativos de menores o familias
• Invitar menores a tu hogar sin autorización oficial

**Uso inadecuado de tecnología:**
• Contactar menores a través de redes sociales personales
• Compartir o solicitar información personal a través de tecnología
• Usar dispositivos para fotografiar menores sin autorización
• Acceder a contenido inapropiado en dispositivos de trabajo
• Compartir contraseñas o accesos a sistemas institucionales

**4. GESTIÓN DE SITUACIONES ESPECÍFICAS**

**Contacto físico necesario:**
• Solo cuando sea absolutamente necesario para seguridad o actividad
• Con consentimiento cuando sea posible y apropiado
• En presencia de otros o en áreas visibles
• Explicando claramente el propósito al menor
• Documentando cuando sea necesario para protección

**Reuniones individuales:**
• Realizarlas en espacios abiertos o con visibilidad
• Informar a supervisores sobre reuniones programadas
• Mantener puertas abiertas o usar espacios con ventanas
• Documentar el propósito y resultado de reuniones importantes
• Incluir a otro adulto cuando sea apropiado

**Manejo de disclosure:**
• Escuchar sin juzgar ni mostrar shock
• No hacer preguntas investigativas
• Tranquilizar al menor sobre haber hecho bien al contarlo
• No prometer confidencialidad absoluta
• Reportar inmediatamente según protocolos establecidos

**5. RESPONSABILIDADES ESPECÍFICAS**

**Reporte obligatorio:**
• Reportar inmediatamente sospechas de abuso o negligencia
• Informar sobre violaciones de este código por otros
• Comunicar situaciones que pongan en riesgo a menores
• Reportar comportamientos preocupantes de adultos
• Informar sobre fallos en sistemas de protección

**Confidencialidad:**
• Proteger información personal de menores y familias
• No compartir información fuera de canales profesionales
• Mantener confidencialidad sobre casos en investigación
• Respetar la privacidad en comunicaciones sobre menores
• Seguir protocolos de protección de datos

**6. CONSECUENCIAS DEL INCUMPLIMIENTO**

**Proceso disciplinario:**
• Investigación imparcial de cualquier alegación
• Suspensión temporal durante investigaciones graves
• Medidas correctivas proporcionales a la infracción
• Terminación de empleo/colaboración en casos graves
• Reporte a autoridades cuando sea legalmente requerido

**Tipos de infracciones:**
• **Leves**: Formación adicional y supervisión aumentada
• **Graves**: Amonestación formal y plan de mejora
• **Muy graves**: Suspensión temporal y evaluación
• **Críticas**: Terminación inmediata y reporte legal

**7. APOYO Y RECURSOS**

**Para el personal:**
• Formación regular sobre actualización del código
• Supervisión y mentoring para situaciones complejas
• Canales seguros para reportar preocupaciones
• Apoyo durante investigaciones o situaciones difíciles
• Recursos para autocuidado y bienestar profesional

**Para menores y familias:**
• Información clara sobre estándares esperados
• Canales para reportar preocupaciones o quejas
• Proceso transparente de resolución de conflictos
• Apoyo durante situaciones de protección
• Recursos externos cuando sea apropiado

**8. COMPROMISO PERSONAL**

Al firmar este código, me comprometo a:
• Cumplir con todos los estándares establecidos
• Buscar aclaración cuando tenga dudas
• Participar en formación continua
• Reportar violaciones observadas
• Poner siempre el bienestar de los menores como prioridad

**"La protección de los menores es responsabilidad de todos. Este código nos guía para crear un ambiente donde todos los menores puedan desarrollarse de forma segura y positiva."**
        `
      },
      'protocolo-16': {
        titulo: 'Protocolo +16 años',
        subtitulo: 'Consideraciones específicas para adolescentes mayores',
        contenido: `
**PROTOCOLO ESPECÍFICO PARA ADOLESCENTES MAYORES DE 16 AÑOS**

**1. MARCO NORMATIVO Y CONSIDERACIONES ESPECIALES**

**Situación legal específica:**
• Los menores de 16-18 años tienen mayor autonomía legal en ciertas áreas
• Mantienen protección bajo LOPIVI hasta los 18 años
• Pueden trabajar con limitaciones específicas
• Tienen mayor capacidad de decisión sobre ciertas cuestiones personales
• Requieren enfoque diferenciado respetando su mayor madurez

**Principios específicos:**
• **Autonomía progresiva**: Reconocer y fomentar su creciente independencia
• **Participación activa**: Involucrarlos en decisiones que les afecten
• **Respeto a la privacidad**: Mayor consideración a su intimidad
• **Preparación para la adultez**: Fomentar habilidades de autoprotección

**2. CARACTERÍSTICAS EVOLUTIVAS RELEVANTES**

**Desarrollo cognitivo y emocional:**
• Mayor capacidad de pensamiento abstracto y crítico
• Búsqueda de identidad y autonomía personal
• Influencia significativa del grupo de pares
• Experimentación con nuevas experiencias y riesgos
• Mayor conciencia de su sexualidad y relaciones

**Vulnerabilidades específicas:**
• Presión social y búsqueda de aceptación
• Comportamientos de riesgo por sensación de invulnerabilidad
• Conflictos entre dependencia familiar y autonomía
• Mayor acceso a tecnología y redes sociales
• Vulnerabilidad a explotación por su aparente madurez

**3. RIESGOS ESPECÍFICOS EN ESTE GRUPO DE EDAD**

**Riesgos relacionados con tecnología:**
• Grooming y acoso online más sofisticado
• Sextorsión y chantaje con imágenes íntimas
• Exposición a contenido inapropiado o extremista
• Ciberbullying entre pares
• Uso problemático de redes sociales

**Riesgos relacionales:**
• Relaciones de pareja con desequilibrios de poder
• Presión sexual o coerción en relaciones
• Explotación por parejas o conocidos mayores
• Manipulación emocional y control
• Violencia en relaciones de noviazgo

**Riesgos contextuales:**
• Explotación laboral en trabajos de temporada
• Presión en actividades competitivas (deportes, académicas)
• Consumo de sustancias en contextos sociales
• Participación en actividades de riesgo grupal
• Explotación en contextos de ocio nocturno

**4. PROTOCOLOS DE DETECCIÓN ESPECÍFICOS**

**Indicadores físicos adaptados:**
• Lesiones en contexto de relaciones de pareja
• Cambios significativos en apariencia o cuidado personal
• Fatiga extrema o signos de privación de sueño
• Signos de consumo de sustancias
• Problemas de salud relacionados con estrés

**Indicadores comportamentales:**
• Aislamiento repentino de amigos y actividades
• Cambios drásticos en rendimiento académico/deportivo
• Comportamientos sexualizados o inapropiados
• Agresividad o irritabilidad extrema
• Secretismo excesivo sobre actividades y relaciones

**Indicadores relacionales:**
• Control excesivo por parte de pareja o amigos
• Relaciones con adultos significativamente mayores
• Cambios en círculo social hacia personas de riesgo
• Dependencia emocional extrema de ciertas relaciones
• Miedo o ansiedad en presencia de ciertas personas

**5. ESTRATEGIAS DE INTERVENCIÓN DIFERENCIADAS**

**Comunicación efectiva:**
• Mostrar respeto por su autonomía y opiniones
• Evitar enfoques paternalistas o condescendientes
• Usar un lenguaje directo y honesto
• Reconocer su capacidad de participar en soluciones
• Mantener confidencialidad respetando límites legales

**Evaluación de situaciones:**
• Considerar su nivel de madurez y comprensión
• Evaluar riesgos específicos de su edad y contexto
• Involucrarlos en la evaluación de su propia seguridad
• Respetar su perspectiva sobre las situaciones
• Balancear protección con respeto a su autonomía

**6. PROTOCOLOS DE ACTUACIÓN ESPECÍFICOS**

**Ante disclosure de abuso:**
1. **Crear un ambiente seguro** y de confianza
2. **Escuchar sin juzgar** y validar su experiencia
3. **Respetar su ritmo** de revelación de información
4. **Explorar su red de apoyo** natural
5. **Informar sobre opciones** disponibles
6. **Respetar su participación** en decisiones cuando sea posible
7. **Garantizar continuidad** de apoyo especializado

**En situaciones de relaciones problemáticas:**
• Educación sobre relaciones saludables sin culpabilizar
• Apoyo para desarrollar habilidades de autoprotección
• Trabajo con la red de apoyo natural (familia, amigos)
• Conexión con recursos especializados para adolescentes
• Seguimiento continuado respetando su privacidad

**7. COORDINACIÓN CON SERVICIOS ESPECIALIZADOS**

**Servicios específicos para adolescentes:**
• Unidades especializadas en adolescencia en servicios sociales
• Programas de salud mental para jóvenes
• Servicios de orientación sexual y reproductiva
• Programas de prevención de violencia de género
• Servicios de atención a víctimas adaptados a adolescentes

**Coordinación educativa/laboral:**
• Institutos de educación secundaria
• Centros de formación profesional
• Empresas donde realicen prácticas o trabajen
• Servicios de orientación laboral juvenil
• Programas de transición a la vida adulta

**8. PREPARACIÓN PARA LA TRANSICIÓN A LA ADULTEZ**

**Desarrollo de habilidades de autoprotección:**
• Reconocimiento de situaciones de riesgo
• Habilidades de comunicación asertiva
• Conocimiento de recursos de apoyo disponibles
• Estrategias de resolución de conflictos
• Planificación de seguridad personal

**Educación sobre derechos y recursos:**
• Conocimiento de sus derechos como menores y futuros adultos
• Información sobre recursos comunitarios
• Educación sobre relaciones saludables
• Conciencia sobre riesgos específicos de su edad
• Preparación para responsabilidades adultas

**9. TRABAJO CON FAMILIAS**

**Respeto a la evolución familiar:**
• Reconocer el proceso de individualización del adolescente
• Apoyar a familias en adaptación a nueva etapa evolutiva
• Mediar en conflictos relacionados con autonomía
• Fortalecer comunicación familiar sin violar privacidad
• Preparar para transición a relación adulta

**Límites de confidencialidad:**
• Clarificar desde el inicio qué información se compartirá
• Respetar mayor privacidad del adolescente
• Involucrar a la familia respetando autonomía del menor
• Buscar equilibrio entre protección y confidencialidad
• Documentar decisiones sobre compartir información

**10. SEGUIMIENTO Y EVALUACIÓN**

**Indicadores de progreso:**
• Desarrollo de habilidades de autoprotección
• Mejora en relaciones interpersonales
• Estabilidad emocional y académica/laboral
• Conexión con red de apoyo apropiada
• Preparación para transición a servicios de adultos

**Transición planificada:**
• Preparación gradual para servicios de adultos
• Mantenimiento de relaciones de apoyo clave
• Información sobre recursos disponibles tras los 18 años
• Plan de seguridad para la adultez temprana
• Seguimiento post-transición cuando sea apropiado
        `
      },
      'protocolo-familia': {
        titulo: 'Protocolo Familia y Tutores',
        subtitulo: 'Coordinación y comunicación con familias',
        contenido: `
**PROTOCOLO DE COORDINACIÓN CON FAMILIAS Y TUTORES LEGALES**

**1. PRINCIPIOS FUNDAMENTALES DE LA RELACIÓN**

**Colaboración activa:**
• Las familias son partners fundamentales en la protección de menores
• Fomentar una relación de confianza y respeto mutuo
• Reconocer el conocimiento único que las familias tienen de sus hijos
• Trabajar conjuntamente hacia objetivos comunes de protección
• Respetar la diversidad de estructuras y dinámicas familiares

**Transparencia y comunicación:**
• Mantener comunicación honesta y regular con las familias
• Proporcionar información clara sobre políticas y procedimientos
• Explicar el papel de la entidad en la protección infantil
• Ser transparentes sobre limitaciones de confidencialidad
• Facilitar canales múltiples de comunicación

**2. INFORMACIÓN Y ORIENTACIÓN A FAMILIAS**

**Información inicial obligatoria:**
• Presentación de políticas de protección infantil
• Explicación del marco legal LOPIVI aplicable
• Descripción de procedimientos en caso de preocupaciones
• Información sobre personal responsable de protección
• Clarificación de roles y responsabilidades compartidas

**Documentación proporcionada:**
• Resumen del Plan de Protección de la entidad
• Código de Conducta del personal
• Procedimientos de quejas y sugerencias
• Contactos de emergencia y recursos externos
• Información sobre participación familiar en protección

**3. COMUNICACIÓN REGULAR Y PREVENTIVA**

**Comunicación proactiva:**
• Información regular sobre actividades y desarrollo del menor
• Comunicación inmediata sobre incidentes menores
• Consulta sobre decisiones que afecten al menor
• Información sobre cambios en personal o procedimientos
• Invitación a participar en evaluaciones y mejoras

**Canales de comunicación:**
• **Presencial**: Reuniones programadas y encuentros informales
• **Telefónico**: Llamadas para comunicaciones urgentes
• **Digital**: Email oficial para documentación formal
• **Escrito**: Circulares y boletines informativos
• **Reuniones grupales**: Sesiones informativas para múltiples familias

**4. GESTIÓN DE PREOCUPACIONES Y QUEJAS**

**Recepción de preocupaciones:**
• Escucha activa y sin juicio de las preocupaciones familiares
• Documentación detallada de todas las quejas recibidas
• Investigación imparcial y thorougha de las alegaciones
• Comunicación regular sobre el progreso de la investigación
• Resolución transparente y follow-up apropiado

**Proceso de investigación:**
1. **Acuse de recibo** inmediato de la queja
2. **Evaluación inicial** del nivel de seriedad
3. **Investigación detallada** con todos los involucrados
4. **Comunicación regular** con la familia sobre progreso
5. **Resolución documentada** y comunicación de resultados
6. **Seguimiento** para asegurar resolución satisfactoria

**5. COORDINACIÓN EN CASOS DE PROTECCIÓN**

**Comunicación en situaciones de riesgo:**
• Información inmediata cuando la seguridad no esté comprometida
• Explicación de medidas de protección implementadas
• Coordinación de apoyos adicionales necesarios
• Participación en planes de seguridad cuando sea apropiado
• Seguimiento conjunto del progreso del menor

**Limitaciones de comunicación:**
• **No comunicar** cuando aumente el riesgo para el menor
• **Confidencialidad** en investigaciones en curso
• **Protección legal** de información sensible
• **Coordinación** con servicios sociales sobre qué comunicar
• **Documentación** de decisiones sobre comunicación

**6. APOYO Y RECURSOS PARA FAMILIAS**

**Información sobre recursos:**
• Servicios de apoyo familiar disponibles en la comunidad
• Programas de educación parental y habilidades familiares
• Recursos de salud mental para familias y menores
• Apoyo económico y social disponible
• Grupos de apoyo para familias en situaciones similares

**Coordinación con servicios:**
• Facilitación de conexiones con servicios apropiados
• Participación en reuniones multidisciplinarias
• Apoyo en navegación del sistema de servicios
• Seguimiento de la efectividad de apoyos proporcionados
• Advocacy por las necesidades familiares cuando sea apropiado

**7. TRABAJO CON DIFERENTES TIPOS DE FAMILIAS**

**Familias en situación de vulnerabilidad:**
• Adaptación de comunicación a necesidades específicas
• Provisión de apoyo adicional para participación
• Conexión con recursos especializados
• Enfoque sensible a traumas y dificultades
• Trabajo conjunto para fortalecer factores protectores

**Familias con diversidad cultural:**
• Respeto por diferencias culturales y religiosas
• Adaptación de comunicación a preferencias culturales
• Uso de intérpretes cuando sea necesario
• Comprensión de dinámicas familiares culturalmente específicas
• Involucración de líderes comunitarios cuando sea apropiado

**Familias separadas o divorciadas:**
• Clarificación de autoridad legal y responsabilidades
• Comunicación apropiada con todos los tutores legales
• Respeto por decisiones judiciales sobre custodia
• Evitar involucrarse en conflictos parentales
• Priorización del bienestar del menor sobre preferencias parentales

**8. EDUCACIÓN Y PREVENCIÓN**

**Programas educativos para familias:**
• Talleres sobre protección infantil y prevención de abusos
• Información sobre desarrollo evolutivo y factores de riesgo
• Educación sobre uso seguro de tecnología e internet
• Habilidades de comunicación con menores sobre seguridad
• Recursos para fortalecer factores protectores familiares

**Participación en programas:**
• Involucración de familias en revisión de políticas
• Participación en comités de seguridad y protección
• Feedback regular sobre efectividad de medidas
• Colaboración en desarrollo de nuevos programas
• Representación familiar en governance cuando sea apropiado

**9. DOCUMENTACIÓN Y CONFIDENCIALIDAD**

**Registro de comunicaciones:**
• Documentación de todas las comunicaciones significativas
• Registro de preocupaciones y quejas recibidas
• Seguimiento de acuerdos y compromisos mutuos
• Archivo seguro de información sensible
• Acceso apropiado a información por parte de familias

**Protección de datos:**
• Cumplimiento estricto con regulaciones de protección de datos
• Consentimiento informado para compartir información
• Limitación de acceso a información a personal autorizado
• Retención apropiada y destrucción segura de registros
• Transparencia sobre uso y almacenamiento de información

**10. CRISIS Y SITUACIONES DE EMERGENCIA**

**Comunicación en crisis:**
• Sistemas de comunicación rápida para emergencias
• Información clara sobre procedimientos en crisis
• Coordinación con servicios de emergencia cuando sea necesario
• Apoyo emocional para familias durante crisis
• Follow-up apropiado post-crisis

**Apoyo durante investigaciones:**
• Información sobre proceso de investigación sin comprometer la misma
• Apoyo emocional durante períodos difíciles
• Conexión con recursos de apoyo externos
• Mantenimiento de servicios para el menor cuando sea apropiado
• Preparación para diferentes resultados posibles

**11. EVALUACIÓN Y MEJORA CONTINUA**

**Feedback regular:**
• Encuestas anuales de satisfacción familiar
• Grupos focales para evaluación de servicios
• Buzón de sugerencias para mejoras
• Revisión regular de procesos de comunicación
• Incorporación de feedback en mejoras del programa

**Indicadores de éxito:**
• Nivel de satisfacción familiar con comunicación
• Tiempo de respuesta a preocupaciones familiares
• Número de quejas resueltas satisfactoriamente
• Participación familiar en programas educativos
• Fortalecimiento de factores protectores familiares
        `
      }
    }

    return contenidos[tipoDoc] || null
  }

  // Sample data
  const casosActivos: Caso[] = [
    {
      id: '1',
      titulo: 'Seguimiento caso delegado principal',
      estado: 'activo',
      prioridad: 'media',
      fechaCreacion: '2024-01-15',
      descripcion: 'Apoyo en seguimiento de caso asignado por delegado principal.'
    },
    {
      id: '2',
      titulo: 'Revisión documentación',
      estado: 'pendiente',
      prioridad: 'baja',
      fechaCreacion: '2024-01-10',
      descripcion: 'Revisar documentación actualizada de protocolos.'
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
    { id: '6', nombre: sessionData?.nombre || 'Delegado Suplente', cargo: 'Delegado Suplente', fechaEmision: '2023-10-15', estado: 'vigente', diasRestantes: 95 }
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

        if (data.tipo !== 'suplente') {
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
                {sessionData?.nombre} - Delegado Suplente
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
              {/* Protocolo General de la Entidad - NUEVO */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">Protocolo General de la Entidad</h4>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Marco</span>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Documento marco específico para su tipo de entidad que integra todos los protocolos y procedimientos LOPIVI.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setDocumentoSeleccionado('protocolo-general')
                      setModalBiblioteca(false)
                      setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                    }}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700"
                  >
                    Ver
                  </button>
                  <button className="px-3 py-2 border border-gray-600 text-gray-600 rounded text-sm hover:bg-gray-50">
                    Descargar
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50">
                    Compartir
                  </button>
                </div>
              </div>

              {/* Protocolo Infancia */}
              <div className="border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-blue-900">Protocolo de Protección Infantil</h4>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Esencial</span>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Documento base que establece los procedimientos de actuación para la protección integral de menores.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setDocumentoSeleccionado('protocolo-infancia')
                      setModalBiblioteca(false)
                      setTimeout(() => setModalDocumentoLOPIVI(true), 100)
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

              {/* Resto de documentos... */}
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">Información importante</h4>
              <p className="text-gray-700 text-sm">
                Todos los documentos están actualizados según la normativa LOPIVI vigente. Ahora incluimos el Protocolo General específico para su tipo de entidad.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Documento LOPIVI */}
      {modalDocumentoLOPIVI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {obtenerContenidoDocumento(documentoSeleccionado)?.titulo || 'Documento LOPIVI'}
              </h3>
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
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                        <h4 className="font-bold text-gray-900 mb-2">{contenido.titulo}</h4>
                        <p className="text-gray-800">{contenido.subtitulo}</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Objetivo</h5>
                          <p className="text-gray-700">{contenidoEspecifico.objetivo}</p>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Ámbito de Aplicación</h5>
                          <p className="text-gray-700">{contenidoEspecifico.ambito}</p>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Responsabilidades</h5>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {contenidoEspecifico.responsabilidades.map((resp: string, index: number) => (
                              <li key={index}>{resp}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Procedimientos Específicos</h5>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {contenidoEspecifico.procedimientos.map((proc: string, index: number) => (
                              <li key={index}>{proc}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-bold text-blue-900 mb-2">{contenido.titulo}</h4>
                        <p className="text-blue-800">{contenido.subtitulo}</p>
                      </div>

                      <div className="prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: contenido.contenido.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </div>
                    </div>
                  )
                }
              })()}
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => setModalDocumentoLOPIVI(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resto del contenido del dashboard */}
    </div>
  )
}
