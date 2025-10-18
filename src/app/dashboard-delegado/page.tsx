'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ConfigBanner } from '@/components/dashboard/ConfigBanner'
import { ConfigButton } from '@/components/dashboard/ConfigButton'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  permisos: string[]
  certificacionVigente: boolean
  fechaCertificacion?: string
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
  email: string
  cargo: string
  formado: boolean
  fechaFormacion?: string
  certificado?: boolean
  fechaCertificado?: string
}

interface ComplianceStatus {
  channel_done: boolean
  channel_verified: boolean
  channel_postponed?: boolean
  riskmap_done: boolean
  penales_done: boolean
  penales_postponed?: boolean
  blocked: boolean
  deadline_at: string
  days_remaining: number
  isFirstTime?: boolean
  config_completed_at?: string | null
}

export default function DashboardDelegadoPrincipal() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [compliance, setCompliance] = useState<ComplianceStatus | null>(null)

  // Desplegables
  const [casosActivosExpanded, setCasosActivosExpanded] = useState(false)
  const [personalFormacionExpanded, setPersonalFormacionExpanded] = useState(false)

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
  const [modalRenovacionCertificado, setModalRenovacionCertificado] = useState(false)
  const [modalPlantillas, setModalPlantillas] = useState(false)
  const [modalMapaRiesgos, setModalMapaRiesgos] = useState(false)
  const [modalComunicacion, setModalComunicacion] = useState(false)
  const [modalGestionCasosUrgentes, setModalGestionCasosUrgentes] = useState(false)

  // Kit Comunicación LOPIVI
  const [kitComunicacionActivo, setKitComunicacionActivo] = useState<boolean>(false)
  const [verificandoKit, setVerificandoKit] = useState<boolean>(true)

  // State management
  const [casoSeleccionado, setCasoSeleccionado] = useState<Caso | null>(null)
  const [tipoInstruccion, setTipoInstruccion] = useState<string>('')
  const [guiaExpanded, setGuiaExpanded] = useState(false)
  const [guiaSeleccionada, setGuiaSeleccionada] = useState('')
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState('')
  const [metodoPago, setMetodoPago] = useState('existente')

  // Comunicación states
  const [destinatarioTipo, setDestinatarioTipo] = useState<'individual' | 'roles'>('individual')
  const [destinatarioIndividual, setDestinatarioIndividual] = useState('')
  const [destinatarioRol, setDestinatarioRol] = useState('')
  const [canalComunicacion, setCanalComunicacion] = useState<'email' | 'whatsapp'>('email')
  const [contenidoEnviar, setContenidoEnviar] = useState('')
  const [mensajeComunicacion, setMensajeComunicacion] = useState('')

  // Plantillas states
  const [modalPlantillaDetalle, setModalPlantillaDetalle] = useState(false)
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<any>(null)
  const [camposPlantilla, setCamposPlantilla] = useState<{[key: string]: string}>({})
  const [canalEnvioPlantilla, setCanalEnvioPlantilla] = useState<'email' | 'whatsapp'>('email')

  // Canal de comunicación - Alertas
  const [alertasCanalActivas, setAlertasCanalActivas] = useState(true)
  const [canalConfigurado, setCanalConfigurado] = useState<'email' | 'whatsapp' | null>('email')
  const [ultimaActividad, setUltimaActividad] = useState('Hace 5 minutos')

  const tipoEntidad = 'centro-deportivo'

  // PLANTILLAS PARA DELEGADOS - Contenido rellenable según tipo de entidad
  const obtenerPlantillas = (tipoEntidad: string) => {
    const plantillasBase = [
      {
        id: 'comunicado-familias',
        titulo: 'Comunicado para Familias',
        descripcion: 'Información general sobre actividades y protocolos',
        destinatario: 'familias',
        campos: ['nombre_entidad', 'fecha', 'asunto', 'mensaje_principal', 'firma_delegado', 'contacto'],
        contenido: `Estimadas familias de {{nombre_entidad}},

{{fecha}}

{{asunto}}

{{mensaje_principal}}

En {{nombre_entidad}} la seguridad y bienestar de todos los menores es nuestra máxima prioridad. Cumplimos rigurosamente con la Ley LOPIVI y todos nuestros protocolos de protección infantil.

Para cualquier consulta, no duden en contactarnos.

Atentamente,
{{firma_delegado}}
Delegado/a de Protección
{{contacto}}`
      },
      {
        id: 'personal-contacto',
        titulo: 'Comunicado Personal con Contacto',
        descripcion: 'Para entrenadores, monitores, personal que trabaja directamente con menores',
        destinatario: 'personal-contacto',
        campos: ['nombre_destinatario', 'cargo_destinatario', 'fecha', 'asunto', 'recordatorio', 'firma_delegado'],
        contenido: `{{nombre_destinatario}}
{{cargo_destinatario}}

Fecha: {{fecha}}

Asunto: {{asunto}}

{{recordatorio}}

Como personal con contacto directo con menores, recordamos la importancia de:

• Mantener límites profesionales apropiados en todo momento
• Comunicar inmediatamente cualquier situación de riesgo detectada
• Cumplir estrictamente con los protocolos de vestuarios y zonas privadas
• No estar nunca a solas con un menor sin visibilidad
• Utilizar únicamente canales oficiales de comunicación

Tu colaboración es fundamental para garantizar la protección de todos los menores bajo nuestro cuidado.

Atentamente,
{{firma_delegado}}
Delegado/a de Protección LOPIVI`
      },
      {
        id: 'personal-sin-contacto',
        titulo: 'Comunicado Personal sin Contacto',
        descripcion: 'Para personal administrativo, limpieza, mantenimiento',
        destinatario: 'personal-sin-contacto',
        campos: ['nombre_destinatario', 'cargo_destinatario', 'fecha', 'instrucciones', 'firma_delegado'],
        contenido: `{{nombre_destinatario}}
{{cargo_destinatario}}

Fecha: {{fecha}}

Asunto: Protocolos de Protección Infantil - Personal de Apoyo

{{instrucciones}}

Aunque tu puesto no implica contacto directo con menores, es importante que conozcas los siguientes protocolos:

• Identificarse siempre con credencial visible
• Trabajar preferentemente en horarios sin presencia de menores
• Informar de cualquier situación sospechosa al delegado de protección
• Respetar las zonas restringidas y horarios establecidos
• Mantener la confidencialidad sobre cualquier información de menores

Tu colaboración es esencial para mantener un entorno seguro.

{{firma_delegado}}
Delegado/a de Protección`
      },
      {
        id: 'recordatorio-certificados',
        titulo: 'Recordatorio Certificados Penales',
        descripcion: 'Solicitud de presentación o renovación de certificados',
        destinatario: 'personal-todos',
        campos: ['nombre_destinatario', 'fecha_limite', 'instrucciones_obtencion', 'firma_delegado'],
        contenido: `Estimado/a {{nombre_destinatario}},

Le recordamos que, según establece la Ley LOPIVI, todo el personal que trabaja con menores debe presentar el Certificado Negativo de Delitos Sexuales.

Plazo de presentación: {{fecha_limite}}

{{instrucciones_obtencion}}

Para obtener el certificado:
1. Acceder a: https://sede.mjusticia.gob.es
2. Solicitar certificado de delitos de naturaleza sexual
3. Presentar el certificado en administración

La no presentación del certificado impide continuar trabajando con menores según normativa vigente.

Atentamente,
{{firma_delegado}}
Delegado/a de Protección`
      },
      {
        id: 'convocatoria-formacion',
        titulo: 'Convocatoria Formación LOPIVI',
        descripcion: 'Invitación a formación obligatoria en protección infantil',
        destinatario: 'personal-todos',
        campos: ['nombre_destinatario', 'fecha_formacion', 'horario', 'lugar', 'duracion', 'firma_delegado'],
        contenido: `Estimado/a {{nombre_destinatario}},

Por la presente le convocamos a la formación obligatoria en Protección Infantil (LOPIVI):

Fecha: {{fecha_formacion}}
Horario: {{horario}}
Lugar: {{lugar}}
Duración: {{duracion}}

Contenido de la formación:
• Ley LOPIVI y obligaciones legales
• Detección de señales de riesgo
• Protocolos de actuación
• Código de conducta
• Casos prácticos

La asistencia es OBLIGATORIA para todo el personal que trabaja con menores.

Por favor, confirme su asistencia.

{{firma_delegado}}
Delegado/a de Protección`
      },
      {
        id: 'autorizacion-actividad',
        titulo: 'Solicitud Autorización Actividad',
        descripcion: 'Para solicitar autorización parental para actividades especiales',
        destinatario: 'familias',
        campos: ['nombre_menor', 'nombre_actividad', 'fecha_actividad', 'lugar', 'horario_salida', 'horario_regreso', 'descripcion_actividad', 'responsables', 'contacto_emergencia', 'firma_delegado'],
        contenido: `AUTORIZACIÓN PARA ACTIVIDAD

Menor: {{nombre_menor}}
Actividad: {{nombre_actividad}}

Estimada familia,

Solicitamos su autorización para que {{nombre_menor}} participe en la siguiente actividad:

Fecha: {{fecha_actividad}}
Lugar: {{lugar}}
Salida: {{horario_salida}}
Regreso estimado: {{horario_regreso}}

Descripción de la actividad:
{{descripcion_actividad}}

Responsables: {{responsables}}
Contacto de emergencia: {{contacto_emergencia}}

Medidas de seguridad:
• Supervisión constante por personal cualificado
• Ratio adecuado adulto/menor
• Seguro de responsabilidad civil
• Botiquín y protocolo de emergencias

[ ] AUTORIZO la participación
[ ] NO AUTORIZO la participación

Firma del padre/madre/tutor: _________________
Fecha: _________________

{{firma_delegado}}
Delegado/a de Protección`
      }
    ]

    // Plantillas específicas para centro deportivo
    if (tipoEntidad === 'centro-deportivo') {
      plantillasBase.push({
        id: 'protocolo-vestuarios',
        titulo: 'Protocolo Vestuarios - Familias',
        descripcion: 'Información sobre protocolo de vestuarios y duchas',
        destinatario: 'familias',
        campos: ['nombre_entidad', 'fecha', 'horarios', 'normas_especificas', 'firma_delegado'],
        contenido: `{{nombre_entidad}}
Fecha: {{fecha}}

Asunto: Protocolo de Uso de Vestuarios y Duchas

Estimadas familias,

Les informamos sobre el protocolo de seguridad en vestuarios:

HORARIOS DE USO:
{{horarios}}

NORMAS DE SEGURIDAD:
• Supervisión por personal del mismo género que los menores
• Separación por grupos de edad
• Prohibido el uso de móviles y cámaras
• Presencia mínima de dos adultos en todo momento
• Casilleros con llave para pertenencias

{{normas_especificas}}

Agradecemos su colaboración para mantener un entorno seguro.

{{firma_delegado}}
Delegado/a de Protección Deportiva`
      })

      plantillasBase.push({
        id: 'comunicado-competicion',
        titulo: 'Comunicado Viaje Competición',
        descripcion: 'Información para familias sobre viajes a competiciones',
        destinatario: 'familias',
        campos: ['nombre_competicion', 'fecha_salida', 'fecha_regreso', 'destino', 'medio_transporte', 'alojamiento', 'entrenadores', 'contacto_emergencia', 'coste', 'firma_delegado'],
        contenido: `VIAJE A COMPETICIÓN DEPORTIVA

Competición: {{nombre_competicion}}
Destino: {{destino}}

Estimadas familias,

Les informamos sobre el próximo viaje deportivo:

FECHAS:
Salida: {{fecha_salida}}
Regreso: {{fecha_regreso}}

LOGÍSTICA:
Transporte: {{medio_transporte}}
Alojamiento: {{alojamiento}}
Entrenadores responsables: {{entrenadores}}

SEGURIDAD:
• Ratio 1 adulto cada 8 menores
• Personal titulado en primeros auxilios
• Seguro de viaje incluido
• Supervisión 24/7
• Contacto de emergencia: {{contacto_emergencia}}

Coste del viaje: {{coste}}

Por favor, devolver la autorización firmada antes del [FECHA].

{{firma_delegado}}
Delegado/a de Protección`
      })
    }

    return plantillasBase
  }

  const plantillasDisponibles = obtenerPlantillas(tipoEntidad)

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
      },
      'protocolo-menores-16': {
        titulo: 'Protocolo para Menores de 16 Años',
        subtitulo: 'Medidas específicas de protección para menores de 16 años',
        contenido: `
**PROTOCOLO ESPECÍFICO PARA MENORES DE 16 AÑOS**

**1. CONSIDERACIONES ESPECIALES**
Los menores de 16 años requieren medidas adicionales de protección dado su mayor nivel de vulnerabilidad y desarrollo evolutivo.

**2. SUPERVISIÓN REFORZADA**
• Ratio adulto-menor más estricto
• Supervisión constante en todas las actividades
• Autorización parental para cualquier actividad fuera de las instalaciones
• Protocolo específico para vestuarios y espacios privados

**3. COMUNICACIÓN CON FAMILIAS**
• Información detallada y regular a padres/tutores
• Canales abiertos de comunicación
• Reuniones periódicas informativas

**4. PARTICIPACIÓN EN ACTIVIDADES**
• Evaluación de adecuación de actividades por edad
• Adaptación de contenidos al nivel de desarrollo
• Separación por grupos de edad cuando sea necesario
        `
      },
      'protocolo-mayores-16': {
        titulo: 'Protocolo para Mayores de 16 Años',
        subtitulo: 'Marco de protección para adolescentes mayores de 16 años',
        contenido: `
**PROTOCOLO ESPECÍFICO PARA MAYORES DE 16 AÑOS**

**1. CARACTERÍSTICAS DEL GRUPO**
Los menores entre 16 y 18 años requieren un enfoque que equilibre autonomía progresiva y protección necesaria.

**2. AUTONOMÍA GRADUAL**
• Mayor participación en decisiones que les afectan
• Responsabilidades adaptadas a su edad
• Formación en autocuidado y autoprotección

**3. ESPACIOS Y ACTIVIDADES**
• Diferenciación respecto a grupos de menor edad
• Actividades acordes a su desarrollo
• Posibilidad de mentorías con menores más pequeños bajo supervisión

**4. PREVENCIÓN ESPECÍFICA**
• Educación en relaciones saludables
• Prevención de violencia entre iguales
• Formación en uso seguro de tecnologías
        `
      },
      'protocolo-familias': {
        titulo: 'Protocolo de Comunicación con Familias',
        subtitulo: 'Directrices para la relación con padres y tutores',
        contenido: `
**PROTOCOLO DE COMUNICACIÓN CON FAMILIAS**

**1. PRINCIPIOS FUNDAMENTALES**
• Transparencia en todas las comunicaciones
• Respeto mutuo y colaboración
• Confidencialidad cuando sea necesario
• Información clara y accesible

**2. CANALES DE COMUNICACIÓN**
• Reuniones periódicas informativas
• Comunicaciones individuales según necesidad
• Plataformas digitales seguras
• Protocolo de emergencia 24/7

**3. INFORMACIÓN A PROPORCIONAR**
• Políticas de protección infantil
• Código de conducta del personal
• Procedimientos ante incidencias
• Derechos de los menores y familias

**4. GESTIÓN DE PREOCUPACIONES**
• Procedimiento claro para reportar inquietudes
• Respuesta oportuna a consultas
• Seguimiento de casos reportados
• Transparencia en resolución de incidencias
        `
      },
      'codigo-conducta': {
        titulo: 'Código de Conducta',
        subtitulo: 'Normas de comportamiento para todo el personal',
        contenido: `
**CÓDIGO DE CONDUCTA - PERSONAL**

**1. PRINCIPIOS BÁSICOS**
• Respeto a la dignidad de todos los menores
• Trato equitativo sin discriminación
• Profesionalidad en todo momento
• Transparencia en las actuaciones

**2. CONDUCTAS OBLIGATORIAS**
• Mantener límites profesionales apropiados
• Comunicar inmediatamente cualquier preocupación
• Respetar la privacidad y confidencialidad
• Actuar como modelo de conducta positiva

**3. CONDUCTAS PROHIBIDAS**
• Contacto físico inapropiado
• Comunicación privada no autorizada con menores
• Uso de lenguaje ofensivo o degradante
• Favoritismo o trato diferencial injustificado
• Estar a solas con un menor sin supervisión
• Compartir información personal con menores

**4. USO DE TECNOLOGÍA**
• Prohibido intercambiar datos personales con menores
• No añadir menores a redes sociales personales
• Uso exclusivo de canales oficiales de comunicación
• Protección de datos personales de menores

**5. SANCIONES**
El incumplimiento de este código puede resultar en medidas disciplinarias, incluyendo la separación del servicio.
        `
      },
      'protocolo-vestuarios': {
        titulo: 'Protocolo de Vestuarios',
        subtitulo: 'Medidas de seguridad en vestuarios y espacios privados',
        contenido: `
**PROTOCOLO ESPECÍFICO DE VESTUARIOS**

**1. ACCESO Y SUPERVISIÓN**
• Personal del mismo género que los menores
• Supervisión visual sin invadir privacidad
• Prohibido el acceso de personal ajeno
• Horarios diferenciados por grupos de edad

**2. INFRAESTRUCTURA**
• Separación clara por género
• Casilleros con llave para pertenencias
• Iluminación adecuada
• Limpieza antes y después de cada uso

**3. NORMAS DE USO**
• Uso exclusivo para cambio de ropa
• Tiempo limitado de permanencia
• Prohibido el uso de dispositivos móviles
• Respeto a la privacidad de los demás

**4. SITUACIONES ESPECIALES**
• Protocolo para menores que necesitan asistencia
• Gestión de emergencias médicas
• Procedimiento para objetos olvidados
• Reporte de comportamientos inapropiados

**5. PERSONAL**
• Formación específica en este protocolo
• Nunca estar a solas con un menor
• Intervención inmediata ante conductas inapropiadas
• Documentación de cualquier incidente
        `
      },
      'protocolo-zonas-comunes': {
        titulo: 'Protocolo de Zonas Comunes',
        subtitulo: 'Seguridad en espacios de uso compartido',
        contenido: `
**PROTOCOLO DE ZONAS COMUNES**

**1. IDENTIFICACIÓN DE ZONAS**
• Áreas deportivas
• Cafeterías y comedores
• Zonas de descanso
• Pasillos y accesos
• Áreas de espera

**2. SUPERVISIÓN**
• Presencia visible de personal en todo momento
• Ratios adecuados de supervisión
• Identificación clara del personal
• Protocolos de vigilancia

**3. NORMAS GENERALES**
• Comportamiento respetuoso obligatorio
• Prohibido el acceso a menores sin supervisión
• Control de visitantes externos
• Señalización clara de normas

**4. PREVENCIÓN DE RIESGOS**
• Evaluación periódica de seguridad
• Mantenimiento preventivo
• Eliminación de puntos ciegos
• Sistemas de emergencia operativos

**5. GESTIÓN DE INCIDENCIAS**
• Protocolo de reporte inmediato
• Registro de todos los incidentes
• Análisis y medidas correctivas
• Comunicación a familias cuando proceda
        `
      },
      'protocolo-personal-contacto': {
        titulo: 'Protocolo Personal con Contacto',
        subtitulo: 'Directrices para personal con contacto directo con menores',
        contenido: `
**PROTOCOLO PARA PERSONAL CON CONTACTO DIRECTO**

**1. DEFINICIÓN**
Personal que tiene interacción directa y regular con menores: entrenadores, monitores, educadores, personal médico.

**2. REQUISITOS OBLIGATORIOS**
• Certificado negativo de delitos sexuales vigente
• Formación LOPIVI completa y actualizada
• Conocimiento profundo de protocolos
• Compromiso con el código de conducta

**3. SUPERVISIÓN Y LÍMITES**
• Nunca estar a solas con un menor sin visibilidad
• Contacto físico limitado a lo estrictamente necesario
• Comunicación siempre profesional y respetuosa
• Uso de canales oficiales de comunicación

**4. FORMACIÓN CONTINUA**
• Actualización anual obligatoria
• Formación en detección de señales de riesgo
• Protocolos de actuación ante sospecha
• Técnicas de comunicación apropiadas

**5. RESPONSABILIDADES ESPECÍFICAS**
• Detección temprana de situaciones de riesgo
• Reporte inmediato de preocupaciones
• Mantenimiento de límites profesionales
• Documentación adecuada de actividades

**6. AUTOEVALUACIÓN**
El personal debe evaluar constantemente si sus acciones podrían ser malinterpretadas y actuar con la máxima transparencia.
        `
      },
      'protocolo-personal-sin-contacto': {
        titulo: 'Protocolo Personal sin Contacto',
        subtitulo: 'Directrices para personal sin contacto directo con menores',
        contenido: `
**PROTOCOLO PARA PERSONAL SIN CONTACTO DIRECTO**

**1. DEFINICIÓN**
Personal que no tiene interacción regular con menores: administrativos, mantenimiento, limpieza, personal externo.

**2. REQUISITOS**
• Certificado negativo de delitos sexuales
• Formación básica en protección infantil
• Conocimiento del código de conducta
• Identificación visible en todo momento

**3. LIMITACIONES DE ACCESO**
• Acceso restringido a áreas con menores
• Trabajos en horarios sin presencia de menores cuando sea posible
• Supervisión cuando coincidan con menores
• Prohibición de interacción no profesional

**4. RESPONSABILIDADES**
• Reporte de situaciones sospechosas
• Respeto a la privacidad de los menores
• Mantenimiento de distancia profesional
• Colaboración con protocolos de seguridad

**5. SITUACIONES ESPECIALES**
• Protocolo para trabajos urgentes
• Procedimiento para emergencias
• Coordinación con personal de contacto
• Registro de accesos a áreas sensibles

**6. FORMACIÓN**
Aunque no tengan contacto directo, todo el personal debe conocer los principios básicos de protección infantil y cómo reportar preocupaciones.
        `
      },
      'protocolo-viajes': {
        titulo: 'Protocolo de Viajes y Desplazamientos',
        subtitulo: 'Medidas de seguridad en actividades fuera de las instalaciones',
        contenido: `
**PROTOCOLO DE VIAJES Y DESPLAZAMIENTOS**

**1. PLANIFICACIÓN PREVIA**
• Evaluación de riesgos del destino y actividad
• Autorización parental expresa y detallada
• Información completa a las familias
• Seguro de viaje adecuado
• Protocolo de emergencia específico

**2. RATIOS Y SUPERVISIÓN**
• Mínimo dos adultos por grupo
• Ratio adecuado según edades (1:8 para menores de 12, 1:10 para mayores)
• Al menos un adulto del mismo género que los menores
• Personal con formación en primeros auxilios

**3. TRANSPORTE**
• Vehículos con las medidas de seguridad requeridas
• Conductor profesional autorizado
• Lista de verificación de pasajeros
• Prohibido que menores viajen en el asiento delantero

**4. ALOJAMIENTO**
• Habitaciones supervisadas y apropiadas
• Separación por género y edad
• Personal alojado en proximidad pero separado
• Normas claras de convivencia

**5. COMUNICACIÓN**
• Contacto regular con familias
• Teléfono de emergencia 24/7
• Registro de actividades diarias
• Protocolo de comunicación de incidencias

**6. SITUACIONES DE EMERGENCIA**
• Plan de evacuación
• Contactos de servicios de emergencia locales
• Procedimiento de repatriación si necesario
• Comunicación inmediata con familias

**7. REGRESO**
• Verificación de que todos los menores son recogidos
• Entrega solo a personas autorizadas
• Informe final a las familias
• Evaluación post-viaje
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
    { id: '1', nombre: 'María García', email: 'maria@ejemplo.com', cargo: 'Coordinadora', formado: true, fechaFormacion: '2024-01-15', certificado: true, fechaCertificado: '2024-01-10' },
    { id: '2', nombre: 'Carlos López', email: 'carlos@ejemplo.com', cargo: 'Entrenador Principal', formado: true, fechaFormacion: '2024-01-10', certificado: true, fechaCertificado: '2024-01-05' },
    { id: '3', nombre: 'Ana Martínez', email: 'ana@ejemplo.com', cargo: 'Fisioterapeuta', formado: false },
    { id: '4', nombre: 'Jorge Ruiz', email: 'jorge@ejemplo.com', cargo: 'Monitor', formado: false },
    { id: '5', nombre: 'Laura Sánchez', email: 'laura@ejemplo.com', cargo: 'Psicóloga', formado: true, fechaFormacion: '2024-01-05', certificado: true, fechaCertificado: '2023-12-20' },
    { id: '6', nombre: 'Pedro Fernández', email: 'pedro@ejemplo.com', cargo: 'Administrativo', formado: false },
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
          fechaCertificacion: '2023-01-15', // Fecha de certificación inicial
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

  // Cargar estado de compliance y redirigir si es primera vez
  useEffect(() => {
    const loadCompliance = async () => {
      if (!sessionData) return

      try {
        const sessionUser = localStorage.getItem('userSession')
        if (!sessionUser) return

        const data = JSON.parse(sessionUser)
        const entityId = data.entityId

        if (!entityId) {
          console.warn('⚠️ No se encontró entityId en la sesión')
          return
        }

        console.log('🔍 Cargando compliance para entityId:', entityId)
        const res = await fetch(`/api/compliance/status?entityId=${entityId}`)
        const complianceData = await res.json()

        if (complianceData.success) {
          setCompliance(complianceData.compliance)

          // Redirigir automáticamente si es primera vez (nunca ha completado configuración)
          if (complianceData.compliance.isFirstTime) {
            console.log('🔀 Primera vez detectada, redirigiendo a configuración...')
            router.push('/dashboard-delegado/configuracion?firstTime=true')
          }
        }
      } catch (error) {
        console.error('❌ Error cargando compliance:', error)
      }
    }

    if (sessionData) {
      loadCompliance()
    }
  }, [sessionData, router])

  // Verificar si la entidad tiene el Kit de Comunicación LOPIVI activo
  useEffect(() => {
    const verificarKitComunicacion = async () => {
      if (!sessionData?.entidad) {
        setVerificandoKit(false)
        return
      }

      try {
        // Obtener el entityId desde localStorage
        const sessionUser = localStorage.getItem('userSession')
        if (!sessionUser) {
          setVerificandoKit(false)
          return
        }

        const data = JSON.parse(sessionUser)
        const entityId = data.entityId

        if (!entityId) {
          console.warn('No se encontró entityId en la sesión')
          setKitComunicacionActivo(false)
          setVerificandoKit(false)
          return
        }

        // Llamar a la API para verificar el estado del kit
        const response = await fetch(`/api/kit-comunicacion/status?entityId=${entityId}`)
        const result = await response.json()

        if (response.ok) {
          setKitComunicacionActivo(result.activo || false)
          console.log(`📦 Kit Comunicación LOPIVI: ${result.activo ? 'Activo' : 'Inactivo'}`)
        } else {
          console.error('Error verificando Kit Comunicación:', result.error)
          setKitComunicacionActivo(false)
        }
      } catch (error) {
        console.error('Error verificando Kit Comunicación:', error)
        setKitComunicacionActivo(false)
      } finally {
        setVerificandoKit(false)
      }
    }

    if (sessionData) {
      verificarKitComunicacion()
    }
  }, [sessionData])

  const calcularCumplimiento = () => {
    const elementos = [
      { nombre: 'Plan de Protección Vigente', completado: true, accion: 'Renovar antes del 15/12/2025' },
      { nombre: 'Delegado Principal Certificado', completado: true, accion: 'Certificado vigente' },
      { nombre: 'Delegado Suplente Certificado', completado: true, accion: 'Certificado vigente' },
      { nombre: 'Personal Formado en LOPIVI', completado: false, accion: 'Formar a 3 personas pendientes' },
      { nombre: 'Protocolos Actualizados', completado: true, accion: 'Protocolos vigentes' },
      { nombre: 'Canal de Comunicación Activo', completado: true, accion: 'Canal operativo' },
      { nombre: 'Registro de Casos Actualizado', completado: true, accion: 'Registro al día' },
      { nombre: 'Auditoría Anual Realizada', completado: false, accion: 'Programar auditoría 2025' },
      { nombre: 'Certificados Penales Completos', completado: false, accion: 'Solicitar 3 certificados pendientes' }
    ]

    const completados = elementos.filter(e => e.completado).length
    const porcentaje = Math.round((completados / elementos.length) * 100)

    return { porcentaje, completados, total: elementos.length, elementos }
  }

  const calcularDiasRenovacion = () => {
    if (!sessionData?.fechaCertificacion) return 0
    const fechaCert = new Date(sessionData.fechaCertificacion)
    const fechaRenovacion = new Date(fechaCert)
    fechaRenovacion.setFullYear(fechaRenovacion.getFullYear() + 2)
    const hoy = new Date()
    const diasRestantes = Math.ceil((fechaRenovacion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    return diasRestantes
  }

  const enviarRecordatorioFormacion = (persona: PersonalItem) => {
    alert(`📧 Recordatorio enviado a ${persona.nombre} (${persona.email})\n\n"Estimado/a ${persona.nombre},\n\nRecordamos que es necesario completar la formación LOPIVI obligatoria para continuar trabajando con menores.\n\nPor favor, accede al siguiente enlace para completar tu formación:\n[ENLACE A FORMACIÓN]\n\nCustodia360"`)
  }

  const enviarRecordatorioCertificado = (persona: PersonalItem) => {
    alert(`📧 Recordatorio enviado a ${persona.nombre} (${persona.email})\n\n"Estimado/a ${persona.nombre},\n\nRecordamos que es obligatorio presentar el Certificado Negativo de Delitos Sexuales para trabajar con menores.\n\nPuedes solicitarlo online en:\nhttps://sede.mjusticia.gob.es\n\nPor favor, entrégalo en administración en cuanto lo recibas.\n\nCustodia360"`)
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
  const diasRenovacion = calcularDiasRenovacion()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900">{sessionData?.entidad || 'Entidad'}</h2>
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
        {/* Banner de pasos pospuestos - Solo si hay pendientes */}
        {compliance && (compliance.channel_postponed || compliance.penales_postponed) && compliance.days_remaining > 0 && (
          <ConfigBanner
            daysRemaining={compliance.days_remaining}
            pendingSteps={[
              ...(compliance.channel_postponed && !compliance.channel_done ? ['Canal de Comunicación'] : []),
              ...(compliance.penales_postponed && !compliance.penales_done ? ['Certificado de Penales'] : [])
            ]}
          />
        )}

        {/* Banner urgente si venció el plazo */}
        {compliance && (compliance.channel_postponed || compliance.penales_postponed) && compliance.days_remaining <= 0 && (
          <div className="bg-red-50 border-2 border-red-600 p-4 mb-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-semibold text-red-900">⚠️ El plazo de 30 días ha vencido</p>
                  <p className="text-sm text-red-700">
                    Completa la configuración pendiente para desbloquear todas las funcionalidades del panel.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard-delegado/configuracion')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium flex-shrink-0"
              >
                Completar Ahora
              </button>
            </div>
          </div>
        )}

        {/* Botón de Configuración - Permanentemente visible (encima de Estado de la Entidad) */}
        <ConfigButton
          onClick={() => router.push('/dashboard-delegado/configuracion')}
          hasPendingItems={compliance ? (
            (compliance.channel_postponed && !compliance.channel_done) ||
            (compliance.penales_postponed && !compliance.penales_done)
          ) : false}
          daysRemaining={compliance?.days_remaining}
        />

        {/* Título de Sección */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Estado de la Entidad</h2>

        {/* Stats Cards - Estado de la Entidad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Casos Urgentes */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Casos Urgentes</p>
                <p className="text-2xl font-bold text-red-600">{casosActivos.filter(c => c.prioridad === 'alta').length}</p>
                <p className="text-xs text-gray-500">Casos de prioridad alta abiertos</p>
              </div>
              <button
                onClick={() => setModalGestionCasosUrgentes(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Consultar
              </button>
            </div>
          </div>

          {/* Estado Certificado */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Estado Certificado</p>
                <p className="text-xs text-gray-500 mt-1">{diasRenovacion} días restantes</p>
              </div>
              <button
                onClick={() => setModalRenovacionCertificado(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Renovar
              </button>
            </div>
          </div>

          {/* Configuración del Sistema - Solo visible si es primera vez o no está completo el mínimo */}
          {compliance?.isFirstTime && (
            <div className="bg-white rounded-lg shadow p-6 border-2 border-purple-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-600">⚠️ Configuración Obligatoria Pendiente</p>
                  <p className="text-xs text-gray-500 mt-1">Debes completar la configuración inicial</p>
                </div>
                <button
                  onClick={() => router.push('/dashboard-delegado/configuracion?firstTime=true')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  Configurar Ahora
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wrapper con limitaciones si el plazo ha vencido */}
        <div className={
          compliance && (compliance.channel_postponed || compliance.penales_postponed) && compliance.days_remaining <= 0
            ? 'opacity-50 pointer-events-none'
            : ''
        }>
          {/* Título de Sección Acciones */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acciones</h2>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2 columnas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Casos Activos Card - DESPLEGABLE */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setCasosActivosExpanded(!casosActivosExpanded)}>
                  <h3 className="text-lg font-medium text-gray-900">Casos Activos</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setModalCasosActivos(true)
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Ver todos
                    </button>
                    <span className="text-gray-500">{casosActivosExpanded ? '▼' : '▶'}</span>
                  </div>
                </div>
              </div>
              {casosActivosExpanded && (
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
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            Gestionar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Personal Formado Card - DESPLEGABLE */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setPersonalFormacionExpanded(!personalFormacionExpanded)}>
                  <h3 className="text-lg font-medium text-gray-900">Personal y Formación</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setModalPersonalFormado(true)
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Gestionar
                    </button>
                    <span className="text-gray-500">{personalFormacionExpanded ? '▼' : '▶'}</span>
                  </div>
                </div>
              </div>
              {personalFormacionExpanded && (
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
                            <span className="text-xs text-green-600 font-medium">✓ Certificado</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cumplimiento Card - MOVIDO AQUÍ */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 bg-purple-50">
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

            {/* Canal de Comunicación - Widget */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Canal de Comunicación</h3>
                  {alertasCanalActivas && (
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Canal configurado:</p>
                    <span className="text-sm font-medium text-blue-600">
                      {canalConfigurado === 'email' ? 'Email' : canalConfigurado === 'whatsapp' ? 'WhatsApp' : 'No configurado'}
                    </span>
                  </div>

                  {alertasCanalActivas && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start">
                        <span className="text-red-600 text-lg mr-2">●</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-900">Nueva actividad</p>
                          <p className="text-xs text-red-700 mt-1">
                            {ultimaActividad} - {canalConfigurado === 'email' ? 'Nuevo email recibido' : 'Nuevo mensaje de WhatsApp'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => router.push('/dashboard-delegado/canal-interacciones')}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Ver Canal
                  </button>

                  <button
                    onClick={() => {
                      setAlertasCanalActivas(false)
                      alert('Alertas marcadas como leídas')
                    }}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    Marcar como leído
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Gestión Avanzada */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 bg-orange-50">
                <h3 className="text-lg font-medium text-gray-900">Gestión Principal</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button
                    onClick={() => setModalBiblioteca(true)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <p className="font-medium text-gray-900">Biblioteca LOPIVI</p>
                    <p className="text-sm text-gray-600">Documentos y protocolos</p>
                  </button>

                  <button
                    onClick={() => setModalPlantillas(true)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <p className="font-medium text-gray-900">Plantillas</p>
                    <p className="text-sm text-gray-600">Documentos para el día a día</p>
                  </button>

                  <button
                    onClick={() => setModalMapaRiesgos(true)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <p className="font-medium text-gray-900">Mapa de Riesgos</p>
                    <p className="text-sm text-gray-600">Ver, descargar y enviar</p>
                  </button>

                  <button
                    onClick={() => setModalComunicacion(true)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <p className="font-medium text-gray-900">Comunicación</p>
                    <p className="text-sm text-gray-600">Enviar contenido a miembros</p>
                  </button>

                  <button
                    onClick={() => setModalInstruccionesCaso(true)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <p className="font-medium text-gray-900">Gestión de Casos</p>
                    <p className="text-sm text-gray-600">Procedimientos avanzados</p>
                  </button>

                  <button
                    onClick={() => setModalCertificadosPenales(true)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <p className="font-medium text-gray-900">Certificados Penales</p>
                    <p className="text-sm text-gray-600">Administración completa</p>
                  </button>

                  <button
                    onClick={() => setModalInspeccion(true)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <p className="font-medium text-gray-900">Inspección y Auditoría</p>
                    <p className="text-sm text-gray-600">Reportes y evaluación</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div> {/* Fin wrapper con limitaciones */}
      </main>

      {/* Modal Biblioteca LOPIVI */}
      {modalBiblioteca && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Biblioteca LOPIVI</h3>
              <button
                onClick={() => setModalBiblioteca(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {/* Lista de documentos sin iconos */}
              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-general')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Protocolo General</h4>
                <p className="text-sm text-gray-600">Marco integral para su entidad</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-infancia')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Protocolo Integral LOPIVI</h4>
                <p className="text-sm text-gray-600">Marco operativo completo</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-directiva')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Protocolo Directivos</h4>
                <p className="text-sm text-gray-600">Guía para directivos</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-menores-16')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Menores de 16</h4>
                <p className="text-sm text-gray-600">Protección menores 16</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-mayores-16')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Mayores de 16</h4>
                <p className="text-sm text-gray-600">Protección mayores 16</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-familias')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Familias</h4>
                <p className="text-sm text-gray-600">Comunicación familias</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('codigo-conducta')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Código de Conducta</h4>
                <p className="text-sm text-gray-600">Normas del personal</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-vestuarios')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Vestuarios</h4>
                <p className="text-sm text-gray-600">Seguridad vestuarios</p>
              </button>

              {/* Protocolo 9 */}
              <div className="border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow">
                <h4 className="text-base font-bold text-gray-900 mb-1">Zonas Comunes</h4>
                <p className="text-gray-700 text-xs mb-3">Seguridad espacios</p>
                <button
                  onClick={() => {
                    setDocumentoSeleccionado('protocolo-zonas-comunes')
                    setModalBiblioteca(false)
                    setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                  }}
                  className="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Ver
                </button>
              </div>

              {/* Protocolo 10 */}
              <div className="border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow">
                <h4 className="text-base font-bold text-gray-900 mb-1">Personal Contacto</h4>
                <p className="text-gray-700 text-xs mb-3">Personal con contacto</p>
                <button
                  onClick={() => {
                    setDocumentoSeleccionado('protocolo-personal-contacto')
                    setModalBiblioteca(false)
                    setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                  }}
                  className="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Ver
                </button>
              </div>

              {/* Protocolo 11 */}
              <div className="border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow">
                <h4 className="text-base font-bold text-gray-900 mb-1">Personal sin Contacto</h4>
                <p className="text-gray-700 text-xs mb-3">Personal sin contacto</p>
                <button
                  onClick={() => {
                    setDocumentoSeleccionado('protocolo-personal-sin-contacto')
                    setModalBiblioteca(false)
                    setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                  }}
                  className="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Ver
                </button>
              </div>

              {/* Protocolo 12 */}
              <div className="border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow">
                <h4 className="text-base font-bold text-gray-900 mb-1">Viajes</h4>
                <p className="text-gray-700 text-xs mb-3">Seguridad desplazamientos</p>
                <button
                  onClick={() => {
                    setDocumentoSeleccionado('protocolo-viajes')
                    setModalBiblioteca(false)
                    setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                  }}
                  className="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Ver
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
                  Descargar PDF
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Compartir
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

      {/* Modal Casos Activos */}
      {modalCasosActivos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Todos los Casos Activos</h3>
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
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{caso.titulo}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      caso.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                      caso.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {caso.prioridad}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{caso.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Creado: {caso.fechaCreacion}</span>
                    <button
                      onClick={() => {
                        setCasoSeleccionado(caso)
                        setModalCasosActivos(false)
                        setModalGestionarCaso(true)
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Gestionar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalCasosActivos(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestionar Caso */}
      {modalGestionarCaso && casoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Gestionar Caso</h3>
              <button
                onClick={() => setModalGestionarCaso(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={casoSeleccionado.titulo}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={casoSeleccionado.descripcion}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={4}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="resuelto">Resuelto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas de Seguimiento</label>
                <textarea
                  placeholder="Añade notas sobre el seguimiento del caso..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setModalGestionarCaso(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Caso actualizado correctamente')
                  setModalGestionarCaso(false)
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Personal Formado */}
      {modalPersonalFormado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Gestión de Personal y Formación</h3>
              <button
                onClick={() => setModalPersonalFormado(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium">Personal Formado</p>
                <p className="text-2xl font-bold text-green-900">{personalData.filter(p => p.formado).length}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium">Pendientes de Formación</p>
                <p className="text-2xl font-bold text-red-900">{personalData.filter(p => !p.formado).length}</p>
              </div>
            </div>

            <div className="space-y-4">
              {personalData.map((persona) => (
                <div key={persona.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{persona.nombre}</h4>
                      <p className="text-sm text-gray-600">{persona.cargo}</p>
                      <p className="text-xs text-gray-500">{persona.email}</p>
                      {persona.formado && persona.fechaFormacion && (
                        <p className="text-xs text-green-600 mt-1">✓ Formado el: {persona.fechaFormacion}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        persona.formado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {persona.formado ? 'Formado' : 'Pendiente'}
                      </span>
                      {!persona.formado && (
                        <button
                          onClick={() => enviarRecordatorioFormacion(persona)}
                          className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                        >
                          Enviar Recordatorio
                        </button>
                      )}
                      <button
                        onClick={() => alert('Asignar formación a ' + persona.nombre)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Asignar Formación
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalPersonalFormado(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Caso Urgente */}
      {modalCasoUrgente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-red-600">Reportar Caso Urgente</h3>
              <button
                onClick={() => setModalCasoUrgente(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>ATENCIÓN:</strong> Este formulario es para situaciones que requieren atención inmediata.
                Si existe riesgo inminente para un menor, contacte directamente con servicios de emergencia (112).
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidente</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Seleccione tipo de incidente</option>
                  <option value="violencia-fisica">Violencia Física</option>
                  <option value="violencia-psicologica">Violencia Psicológica</option>
                  <option value="violencia-sexual">Violencia Sexual</option>
                  <option value="negligencia">Negligencia</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Incidente</label>
                <textarea
                  placeholder="Describa el incidente con el mayor detalle posible..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menor(es) Afectado(s)</label>
                <input
                  type="text"
                  placeholder="Nombre(s) o iniciales"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agresor / Persona Implicada</label>
                <input
                  type="text"
                  placeholder="Nombre o identificación del agresor"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testigos</label>
                <input
                  type="text"
                  placeholder="Personas presentes"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setModalCasoUrgente(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Caso urgente reportado. Se ha notificado a las autoridades competentes.')
                  setModalCasoUrgente(false)
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Reportar Caso Urgente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Instrucciones de Caso */}
      {modalInstruccionesCaso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Procedimientos de Gestión de Casos</h3>
              <button
                onClick={() => setModalInstruccionesCaso(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-2">1. Detección y Reporte Inicial</h4>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                  <li>Registrar inmediatamente cualquier observación o reporte</li>
                  <li>Documentar fecha, hora, lugar y personas involucradas</li>
                  <li>Mantener la confidencialidad en todo momento</li>
                  <li>No interrogar al menor, solo escuchar</li>
                </ul>
              </div>

              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">2. Evaluación Inicial</h4>
                <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                  <li>Determinar la gravedad y urgencia del caso</li>
                  <li>Identificar necesidades inmediatas de protección</li>
                  <li>Consultar con equipo directivo si es necesario</li>
                  <li>Revisar protocolos específicos aplicables</li>
                </ul>
              </div>

              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                <h4 className="font-bold text-yellow-900 mb-2">3. Notificación a Autoridades</h4>
                <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                  <li>Servicios Sociales: Para casos que requieren intervención social</li>
                  <li>Fiscalía de Menores: Para situaciones de posible delito</li>
                  <li>Policía/Guardia Civil: Para situaciones de riesgo inminente</li>
                  <li>Documentar todas las comunicaciones realizadas</li>
                </ul>
              </div>

              <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                <h4 className="font-bold text-purple-900 mb-2">4. Seguimiento y Coordinación</h4>
                <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                  <li>Mantener comunicación con autoridades competentes</li>
                  <li>Coordinar con familia si es apropiado</li>
                  <li>Documentar todas las acciones tomadas</li>
                  <li>Evaluar periódicamente la situación</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalInstruccionesCaso(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cumplimiento MEJORADO */}
      {modalCumplimiento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
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
                <h4 className="text-lg font-semibold text-gray-900">Progreso General</h4>
                <span className="text-2xl font-bold text-green-600">{cumplimiento.porcentaje}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${cumplimiento.porcentaje}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {cumplimiento.total - cumplimiento.completados} elementos pendientes para alcanzar el 100%
              </p>
            </div>

            <div className="space-y-3">
              {cumplimiento.elementos.map((elemento, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    elemento.completado
                      ? 'border-green-200 bg-green-50'
                      : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{elemento.nombre}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      elemento.completado
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {elemento.completado ? '✓ Completado' : 'Pendiente'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>Acción:</strong> {elemento.accion}
                  </p>
                  {!elemento.completado && (
                    <button
                      onClick={() => alert(`Iniciando acción: ${elemento.accion}`)}
                      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Completar Ahora
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalCumplimiento(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Certificados Penales MEJORADO */}
      {modalCertificadosPenales && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Administración de Certificados Penales</h3>
              <button
                onClick={() => setModalCertificadosPenales(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-purple-800">
                <strong>Importante:</strong> Todo el personal que trabaja con menores debe presentar certificado negativo
                de delitos sexuales. La validez del certificado es de 3 meses desde su expedición.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium">Con Certificado Válido</p>
                <p className="text-2xl font-bold text-green-900">{personalData.filter(p => p.certificado).length}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium">Sin Certificado</p>
                <p className="text-2xl font-bold text-red-900">{personalData.filter(p => !p.certificado).length}</p>
              </div>
            </div>

            <div className="space-y-4">
              {personalData.map((persona) => (
                <div key={persona.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{persona.nombre}</h4>
                      <p className="text-sm text-gray-600">{persona.cargo}</p>
                      <p className="text-xs text-gray-500">{persona.email}</p>
                      {persona.certificado && persona.fechaCertificado && (
                        <p className="text-xs text-green-600 mt-1">✓ Certificado presentado el: {persona.fechaCertificado}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        persona.certificado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {persona.certificado ? '✓ Certificado Válido' : '⚠ Sin Certificado'}
                      </span>
                      {!persona.certificado && (
                        <button
                          onClick={() => enviarRecordatorioCertificado(persona)}
                          className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                        >
                          Enviar Recordatorio
                        </button>
                      )}
                      <button
                        onClick={() => alert('Solicitar certificado para ' + persona.nombre)}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                      >
                        Solicitar/Renovar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => alert('📧 Recordatorio masivo enviado a todo el personal sin certificado')}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
              >
                Recordatorio Masivo
              </button>
              <button
                onClick={() => setModalCertificadosPenales(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Inspección y Auditoría */}
      {modalInspeccion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Inspección y Auditoría LOPIVI</h3>
              <button
                onClick={() => setModalInspeccion(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Última Auditoría</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-medium">15 de Diciembre 2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Resultado</p>
                    <p className="font-medium text-green-600">✓ Favorable</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Próxima Auditoría</p>
                    <p className="font-medium">15 de Diciembre 2025</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Áreas Evaluadas</h4>
                <div className="space-y-2">
                  {[
                    'Plan de Protección Infantil',
                    'Formación del Personal',
                    'Protocolos de Actuación',
                    'Registro de Casos',
                    'Certificados Penales',
                    'Canal de Comunicación',
                    'Documentación LOPIVI'
                  ].map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{area}</span>
                      <span className="text-green-600 font-medium">✓</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Recomendaciones</h4>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                  <li>Continuar con la formación periódica del personal</li>
                  <li>Renovar certificados penales próximos a caducar</li>
                  <li>Actualizar protocolos según nuevas normativas</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => alert('Generando informe de auditoría...')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Descargar Informe
              </button>
              <button
                onClick={() => setModalInspeccion(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NUEVO MODAL: Renovación Certificado */}
      {modalRenovacionCertificado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Renovación de Certificado de Delegado</h3>
              <button
                onClick={() => setModalRenovacionCertificado(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-blue-900 mb-2">Estado de tu Certificación</h4>
              <div className="space-y-2">
                <p className="text-sm text-blue-800">
                  <strong>Fecha de certificación:</strong> {sessionData?.fechaCertificacion ? new Date(sessionData.fechaCertificacion).toLocaleDateString('es-ES') : 'No disponible'}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Fecha de renovación:</strong> {sessionData?.fechaCertificacion ? new Date(new Date(sessionData.fechaCertificacion).setFullYear(new Date(sessionData.fechaCertificacion).getFullYear() + 2)).toLocaleDateString('es-ES') : 'No disponible'}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Días restantes:</strong> {diasRenovacion} días
                </p>
                {diasRenovacion < 90 && (
                  <p className="text-sm text-red-600 font-bold mt-2">
                    ⚠️ Tu certificado requiere renovación pronto
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-2">Precio de Renovación</h4>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Renovación de certificado (2 años)</span>
                <span className="text-lg font-bold text-gray-900">25,00 €</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-600 text-sm">IVA (21%)</span>
                <span className="text-sm text-gray-900">5,25 €</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-300">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-blue-600">30,25 €</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="existente"
                      checked={metodoPago === 'existente'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Usar tarjeta registrada</p>
                      <p className="text-sm text-gray-600">Tarjeta terminada en ****4242</p>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="nueva"
                      checked={metodoPago === 'nueva'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Usar nueva tarjeta</p>
                      <p className="text-sm text-gray-600">Introduce una nueva tarjeta de crédito/débito</p>
                    </div>
                  </label>
                </div>
              </div>

              {metodoPago === 'nueva' && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Expiración</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titular de la Tarjeta</label>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setModalRenovacionCertificado(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('✅ Renovación procesada correctamente\n\n💳 Cargo: 30,25 €\n📧 Recibirás confirmación por email\n\nTu certificado ha sido renovado por 2 años más.')
                  setModalRenovacionCertificado(false)
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Pagar 30,25 €
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
              <h3 className="text-xl font-bold text-gray-900">Biblioteca LOPIVI</h3>
              <button
                onClick={() => setModalBiblioteca(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {/* Lista de documentos sin iconos */}
              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-general')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Protocolo General</h4>
                <p className="text-sm text-gray-600">Marco integral para su entidad</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-infancia')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Protocolo Integral LOPIVI</h4>
                <p className="text-sm text-gray-600">Marco operativo completo</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-directiva')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Protocolo Directivos</h4>
                <p className="text-sm text-gray-600">Guía para directivos</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-menores-16')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Menores de 16</h4>
                <p className="text-sm text-gray-600">Protección menores 16</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-mayores-16')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Mayores de 16</h4>
                <p className="text-sm text-gray-600">Protección mayores 16</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-familias')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Familias</h4>
                <p className="text-sm text-gray-600">Comunicación familias</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('codigo-conducta')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Código de Conducta</h4>
                <p className="text-sm text-gray-600">Normas del personal</p>
              </button>

              <button
                onClick={() => {
                  setDocumentoSeleccionado('protocolo-vestuarios')
                  setModalBiblioteca(false)
                  setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <h4 className="font-bold text-gray-900">Vestuarios</h4>
                <p className="text-sm text-gray-600">Seguridad vestuarios</p>
              </button>

              {/* Protocolo 9 */}
              <div className="border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow">
                <h4 className="text-base font-bold text-gray-900 mb-1">Zonas Comunes</h4>
                <p className="text-gray-700 text-xs mb-3">Seguridad espacios</p>
                <button
                  onClick={() => {
                    setDocumentoSeleccionado('protocolo-zonas-comunes')
                    setModalBiblioteca(false)
                    setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                  }}
                  className="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Ver
                </button>
              </div>

              {/* Protocolo 10 */}
              <div className="border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow">
                <h4 className="text-base font-bold text-gray-900 mb-1">Personal Contacto</h4>
                <p className="text-gray-700 text-xs mb-3">Personal con contacto</p>
                <button
                  onClick={() => {
                    setDocumentoSeleccionado('protocolo-personal-contacto')
                    setModalBiblioteca(false)
                    setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                  }}
                  className="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Ver
                </button>
              </div>

              {/* Protocolo 11 */}
              <div className="border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow">
                <h4 className="text-base font-bold text-gray-900 mb-1">Personal sin Contacto</h4>
                <p className="text-gray-700 text-xs mb-3">Personal sin contacto</p>
                <button
                  onClick={() => {
                    setDocumentoSeleccionado('protocolo-personal-sin-contacto')
                    setModalBiblioteca(false)
                    setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                  }}
                  className="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Ver
                </button>
              </div>

              {/* Protocolo 12 */}
              <div className="border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow">
                <h4 className="text-base font-bold text-gray-900 mb-1">Viajes</h4>
                <p className="text-gray-700 text-xs mb-3">Seguridad desplazamientos</p>
                <button
                  onClick={() => {
                    setDocumentoSeleccionado('protocolo-viajes')
                    setModalBiblioteca(false)
                    setTimeout(() => setModalDocumentoLOPIVI(true), 100)
                  }}
                  className="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Ver
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
                  Descargar PDF
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Compartir
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

      {/* Modal Casos Activos */}
      {modalCasosActivos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Todos los Casos Activos</h3>
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
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{caso.titulo}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      caso.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                      caso.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {caso.prioridad}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{caso.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Creado: {caso.fechaCreacion}</span>
                    <button
                      onClick={() => {
                        setCasoSeleccionado(caso)
                        setModalCasosActivos(false)
                        setModalGestionarCaso(true)
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Gestionar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalCasosActivos(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestionar Caso */}
      {modalGestionarCaso && casoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Gestionar Caso</h3>
              <button
                onClick={() => setModalGestionarCaso(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={casoSeleccionado.titulo}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={casoSeleccionado.descripcion}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={4}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="resuelto">Resuelto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas de Seguimiento</label>
                <textarea
                  placeholder="Añade notas sobre el seguimiento del caso..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setModalGestionarCaso(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Caso actualizado correctamente')
                  setModalGestionarCaso(false)
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Caso Urgente */}
      {modalCasoUrgente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-red-600">Reportar Caso Urgente</h3>
              <button
                onClick={() => setModalCasoUrgente(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>ATENCIÓN:</strong> Este formulario es para situaciones que requieren atención inmediata.
                Si existe riesgo inminente para un menor, contacte directamente con servicios de emergencia (112).
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidente</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Seleccione tipo de incidente</option>
                  <option value="violencia-fisica">Violencia Física</option>
                  <option value="violencia-psicologica">Violencia Psicológica</option>
                  <option value="violencia-sexual">Violencia Sexual</option>
                  <option value="negligencia">Negligencia</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Incidente</label>
                <textarea
                  placeholder="Describa el incidente con el mayor detalle posible..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menor(es) Afectado(s)</label>
                <input
                  type="text"
                  placeholder="Nombre(s) o iniciales"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agresor / Persona Implicada</label>
                <input
                  type="text"
                  placeholder="Nombre o identificación del agresor"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testigos</label>
                <input
                  type="text"
                  placeholder="Personas presentes"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setModalCasoUrgente(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Caso urgente reportado. Se ha notificado a las autoridades competentes.')
                  setModalCasoUrgente(false)
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Reportar Caso Urgente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Instrucciones de Caso */}
      {modalInstruccionesCaso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Procedimientos de Gestión de Casos</h3>
              <button
                onClick={() => setModalInstruccionesCaso(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-2">1. Detección y Reporte Inicial</h4>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                  <li>Registrar inmediatamente cualquier observación o reporte</li>
                  <li>Documentar fecha, hora, lugar y personas involucradas</li>
                  <li>Mantener la confidencialidad en todo momento</li>
                  <li>No interrogar al menor, solo escuchar</li>
                </ul>
              </div>

              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">2. Evaluación Inicial</h4>
                <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                  <li>Determinar la gravedad y urgencia del caso</li>
                  <li>Identificar necesidades inmediatas de protección</li>
                  <li>Consultar con equipo directivo si es necesario</li>
                  <li>Revisar protocolos específicos aplicables</li>
                </ul>
              </div>

              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                <h4 className="font-bold text-yellow-900 mb-2">3. Notificación a Autoridades</h4>
                <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                  <li>Servicios Sociales: Para casos que requieren intervención social</li>
                  <li>Fiscalía de Menores: Para situaciones de posible delito</li>
                  <li>Policía/Guardia Civil: Para situaciones de riesgo inminente</li>
                  <li>Documentar todas las comunicaciones realizadas</li>
                </ul>
              </div>

              <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                <h4 className="font-bold text-purple-900 mb-2">4. Seguimiento y Coordinación</h4>
                <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                  <li>Mantener comunicación con autoridades competentes</li>
                  <li>Coordinar con familia si es apropiado</li>
                  <li>Documentar todas las acciones tomadas</li>
                  <li>Evaluar periódicamente la situación</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalInstruccionesCaso(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Inspección y Auditoría */}
      {modalInspeccion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Inspección y Auditoría LOPIVI</h3>
              <button
                onClick={() => setModalInspeccion(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Última Auditoría</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-medium">15 de Diciembre 2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Resultado</p>
                    <p className="font-medium text-green-600">✓ Favorable</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Próxima Auditoría</p>
                    <p className="font-medium">15 de Diciembre 2025</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Áreas Evaluadas</h4>
                <div className="space-y-2">
                  {[
                    'Plan de Protección Infantil',
                    'Formación del Personal',
                    'Protocolos de Actuación',
                    'Registro de Casos',
                    'Certificados Penales',
                    'Canal de Comunicación',
                    'Documentación LOPIVI'
                  ].map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{area}</span>
                      <span className="text-green-600 font-medium">✓</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Recomendaciones</h4>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                  <li>Continuar con la formación periódica del personal</li>
                  <li>Renovar certificados penales próximos a caducar</li>
                  <li>Actualizar protocolos según nuevas normativas</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => alert('Generando informe de auditoría...')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Descargar Informe
              </button>
              <button
                onClick={() => setModalInspeccion(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Plantillas - Con Control de Acceso Kit Comunicación */}
      {modalPlantillas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Plantillas para Delegados</h3>
                {kitComunicacionActivo && (
                  <p className="text-sm text-gray-600 mt-1">
                    {plantillasDisponibles.length} plantillas disponibles para {tipoEntidad.replace('-', ' ')}
                  </p>
                )}
              </div>
              <button
                onClick={() => setModalPlantillas(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {verificandoKit ? (
              <div className="text-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Verificando acceso...</p>
              </div>
            ) : !kitComunicacionActivo ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Acceso Restringido</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Esta sección está disponible únicamente para entidades con el
                  <strong> Kit de Comunicación LOPIVI </strong> activo.
                </p>
                <button
                  onClick={() => {
                    setModalPlantillas(false)
                    router.push('/dashboard-entidad')
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium inline-flex items-center gap-2"
                >
                  <span>Contratar Kit Comunicación</span>
                  <span>→</span>
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plantillasDisponibles.map((plantilla) => (
                    <div key={plantilla.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{plantilla.titulo}</h4>
                      <p className="text-sm text-gray-600 mb-3">{plantilla.descripcion}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {plantilla.destinatario}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {plantilla.campos.length} campos
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setPlantillaSeleccionada(plantilla)
                            const camposIniciales: {[key: string]: string} = {}
                            plantilla.campos.forEach(campo => {
                              camposIniciales[campo] = ''
                            })
                            setCamposPlantilla(camposIniciales)
                            setModalPlantillaDetalle(true)
                          }}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                        >
                          Ver y Editar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setModalPlantillas(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Mapa de Riesgos - Versión Completa */}
      {modalMapaRiesgos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Mapa de Riesgos Específico</h3>
                <button
                  onClick={() => setModalMapaRiesgos(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="prose max-w-none mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">
                    Análisis de Riesgos para {sessionData?.entidad}
                  </h4>
                  <p className="text-blue-800">
                    Tipo de entidad: {tipoEntidad} | Delegado Principal
                  </p>
                </div>

                <h4 className="text-lg font-semibold mb-3">1. RIESGOS ESPECÍFICOS IDENTIFICADOS:</h4>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Espacios con supervisión limitada (vestuarios, almacenes)</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Menor cambiándose solo en vestuario</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Implementar sistema de puertas abiertas, supervisión rotatoria</p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Interacciones uno-a-uno entre adultos y menores</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Entrenamiento individual, tutoría privada</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Siempre con puerta abierta, informar a otro adulto presente</p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Actividades que requieren contacto físico</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Correcciones técnicas, primeros auxilios, apoyo físico</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Explicar antes el contacto, presencia de otro adulto, documentar</p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Desplazamientos y actividades fuera de las instalaciones</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Viajes a competiciones, excursiones, campamentos</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Autorización familiar por escrito, supervisión 24/7, protocolos claros</p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Uso de tecnologías y redes sociales</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Comunicación por WhatsApp, fotos de actividades, redes sociales</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Canal oficial únicamente, prohibir comunicación privada</p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold mb-3">2. MEDIDAS PREVENTIVAS OBLIGATORIAS:</h4>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Nunca estar a solas con un menor en espacios cerrados</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Menor necesita hablar en privado</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Usar espacio visible (ventana), puerta abierta, otro adulto cerca</p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Mantener puertas abiertas durante interacciones privadas</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Consulta médica, conversación personal</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Puerta entreabierta siempre, otro adulto informado y disponible</p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Informar a otro adulto sobre interacciones especiales</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Menor requiere atención especial, apoyo emocional</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Comunicar a compañero/supervisor antes y después del contacto</p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Documentar cualquier incidente o situación inusual</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Menor se lastima, comportamiento extraño, conflicto</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Registro inmediato por escrito, comunicar a delegado, informar familia</p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Respetar los límites físicos y emocionales de los menores</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Menor rechaza contacto físico, se muestra incómodo</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Respetar inmediatamente, buscar alternativas, documentar situación</p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold mb-3">3. PROTOCOLOS DE COMUNICACIÓN:</h4>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-purple-400 pl-4">
                    <p className="font-medium">• Canal de comunicación oficial configurado</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO PRÁCTICA:</strong> WhatsApp grupal para comunicaciones generales</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO IMPLEMENTAR:</strong> Un solo canal oficial, prohibir comunicaciones privadas</p>
                  </div>

                  <div className="border-l-4 border-purple-400 pl-4">
                    <p className="font-medium">• Procedimientos claros de reporte de incidencias</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Sospecha de maltrato, comportamiento inadecuado</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Comunicación inmediata al delegado, documentación, no investigar</p>
                  </div>

                  <div className="border-l-4 border-purple-400 pl-4">
                    <p className="font-medium">• Coordinación con autoridades competentes</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO CASO:</strong> Situación grave que requiere intervención externa</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO PROCEDER:</strong> Delegado contacta servicios sociales/policía según protocolo</p>
                  </div>

                  <div className="border-l-4 border-purple-400 pl-4">
                    <p className="font-medium">• Comunicación transparente con familias</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO PRÁCTICA:</strong> Informes regulares, comunicación de incidencias</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Canal directo con familias, información oportuna y clara</p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold mb-3">4. EVALUACIÓN CONTINUA:</h4>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-green-400 pl-4">
                    <p className="font-medium">• Revisión mensual de medidas implementadas</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO REUNIÓN:</strong> Análisis de efectividad de protocolos</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO HACERLO:</strong> Reunión mensual equipo, revisar incidencias, ajustar medidas</p>
                  </div>

                  <div className="border-l-4 border-green-400 pl-4">
                    <p className="font-medium">• Actualización según nuevos riesgos identificados</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Nuevas actividades, cambios en instalaciones</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO HACERLO:</strong> Evaluar riesgos nuevos, actualizar mapa, informar equipo</p>
                  </div>

                  <div className="border-l-4 border-green-400 pl-4">
                    <p className="font-medium">• Formación continua del personal</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO ACCIÓN:</strong> Talleres, sesiones de actualización, casos prácticos</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO HACERLO:</strong> Programar formación trimestral, evaluar conocimientos, reforzar</p>
                  </div>

                  <div className="border-l-4 border-green-400 pl-4">
                    <p className="font-medium">• Participación de familias en evaluación de riesgos</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO PARTICIPACIÓN:</strong> Encuestas, reuniones informativas, sugerencias</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO HACERLO:</strong> Canal abierto con familias, considerar feedback, transparencia total</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-yellow-800 font-semibold">
                    ⚠️ IMPORTANTE: Este mapa de riesgos es un documento vivo que debe revisarse y actualizarse regularmente.
                    Cualquier cambio significativo en las actividades, instalaciones o personal debe motivar una revisión inmediata.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => alert('Descargando mapa de riesgos en PDF...')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                >
                  Descargar PDF
                </button>
                <button
                  onClick={() => setModalMapaRiesgos(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Comunicación */}
      {modalComunicacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Comunicación con Miembros</h3>
              <button
                onClick={() => setModalComunicacion(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Tipo de Destinatario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Destinatario</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDestinatarioTipo('individual')}
                    className={`p-3 rounded-lg border-2 ${
                      destinatarioTipo === 'individual'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium text-gray-900">Individual</p>
                    <p className="text-sm text-gray-600">Seleccionar persona específica</p>
                  </button>
                  <button
                    onClick={() => setDestinatarioTipo('roles')}
                    className={`p-3 rounded-lg border-2 ${
                      destinatarioTipo === 'roles'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium text-gray-900">Por Rol</p>
                    <p className="text-sm text-gray-600">Enviar a un grupo completo</p>
                  </button>
                </div>
              </div>

              {/* Selector de Destinatario */}
              {destinatarioTipo === 'individual' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Miembro</label>
                  <select
                    value={destinatarioIndividual}
                    onChange={(e) => setDestinatarioIndividual(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Seleccione un miembro</option>
                    {[...personalData]
                      .sort((a, b) => a.nombre.localeCompare(b.nombre))
                      .map((persona) => (
                        <option key={persona.id} value={persona.id}>
                          {persona.nombre} - {persona.cargo} ({persona.email})
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Rol</label>
                  <select
                    value={destinatarioRol}
                    onChange={(e) => setDestinatarioRol(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Seleccione un rol</option>
                    <option value="directiva">Directiva</option>
                    <option value="personal-contacto">Personal con Contacto</option>
                    <option value="personal-sin-contacto">Personal sin Contacto</option>
                    <option value="familias">Familias</option>
                  </select>
                </div>
              )}

              {/* Canal de Comunicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Canal de Comunicación</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCanalComunicacion('email')}
                    className={`p-3 rounded-lg border-2 ${
                      canalComunicacion === 'email'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">Enviar por correo electrónico</p>
                  </button>
                  <button
                    onClick={() => setCanalComunicacion('whatsapp')}
                    className={`p-3 rounded-lg border-2 ${
                      canalComunicacion === 'whatsapp'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium text-gray-900">WhatsApp</p>
                    <p className="text-sm text-gray-600">Enviar por WhatsApp</p>
                  </button>
                </div>
              </div>

              {/* Contenido a Enviar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenido a Enviar</label>
                <select
                  value={contenidoEnviar}
                  onChange={(e) => setContenidoEnviar(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Seleccione el contenido</option>
                  <optgroup label="Documentos de la Entidad">
                    <option value="protocolo-general">Protocolo General</option>
                    <option value="protocolo-integral-lopivi">Protocolo Integral LOPIVI</option>
                    <option value="protocolo-directivos">Protocolo Directivos</option>
                    <option value="protocolo-menores-16">Menores de 16</option>
                    <option value="protocolo-mayores-16">Mayores de 16</option>
                    <option value="protocolo-familias">Familias</option>
                    <option value="codigo-conducta">Código de Conducta</option>
                    <option value="protocolo-vestuarios">Vestuarios</option>
                    <option value="mapa-riesgos">Mapa de Riesgos</option>
                    <option value="plan-proteccion">Plan de Protección Infantil</option>
                  </optgroup>
                  <optgroup label="Plantillas">
                    <option value="plantilla-autorizacion">Autorización Parental</option>
                    <option value="plantilla-incidente">Reporte de Incidente</option>
                    <option value="plantilla-evaluacion">Evaluación de Riesgo</option>
                  </optgroup>
                  <optgroup label="Certificados">
                    <option value="certificado-formacion">Certificado de Formación LOPIVI</option>
                    <option value="certificado-delegado">Certificado de Delegado</option>
                  </optgroup>
                  <optgroup label="Formación">
                    <option value="enlace-formacion">Enlace a Formación LOPIVI</option>
                    <option value="material-formacion">Material de Formación</option>
                  </optgroup>
                  <optgroup label="Otros">
                    <option value="informe-cumplimiento">Informe de Cumplimiento</option>
                    <option value="recordatorio-certificado">Recordatorio Certificado Penal</option>
                  </optgroup>
                </select>
              </div>

              {/* Mensaje Adicional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje Adicional (opcional)</label>
                <textarea
                  value={mensajeComunicacion}
                  onChange={(e) => setMensajeComunicacion(e.target.value)}
                  placeholder="Escribe un mensaje personalizado..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={4}
                />
              </div>

              {/* Vista Previa */}
              {(destinatarioIndividual || destinatarioRol) && contenidoEnviar && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Vista Previa del Envío</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>
                      <strong>Destinatario(s):</strong>{' '}
                      {destinatarioTipo === 'individual'
                        ? personalData.find((p) => p.id === destinatarioIndividual)?.nombre || 'No seleccionado'
                        : destinatarioRol || 'No seleccionado'}
                    </p>
                    <p>
                      <strong>Canal:</strong> {canalComunicacion === 'email' ? 'Email' : 'WhatsApp'}
                    </p>
                    <p>
                      <strong>Contenido:</strong> {contenidoEnviar}
                    </p>
                    {mensajeComunicacion && (
                      <p>
                        <strong>Mensaje:</strong> {mensajeComunicacion.substring(0, 100)}
                        {mensajeComunicacion.length > 100 ? '...' : ''}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setModalComunicacion(false)}
                className="flex-1 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!destinatarioIndividual && !destinatarioRol) {
                    alert('Por favor, selecciona un destinatario')
                    return
                  }
                  if (!contenidoEnviar) {
                    alert('Por favor, selecciona el contenido a enviar')
                    return
                  }

                  const destinatario =
                    destinatarioTipo === 'individual'
                      ? personalData.find((p) => p.id === destinatarioIndividual)?.nombre
                      : destinatarioRol

                  alert(
                    `Comunicación enviada exitosamente:\n\n` +
                    `Destinatario: ${destinatario}\n` +
                    `Canal: ${canalComunicacion === 'email' ? 'Email' : 'WhatsApp'}\n` +
                    `Contenido: ${contenidoEnviar}\n` +
                    `${mensajeComunicacion ? `Mensaje: ${mensajeComunicacion}` : ''}`
                  )

                  setModalComunicacion(false)
                  setDestinatarioIndividual('')
                  setDestinatarioRol('')
                  setContenidoEnviar('')
                  setMensajeComunicacion('')
                }}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Enviar Comunicación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestión de Casos Urgentes */}
      {modalGestionCasosUrgentes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-red-600">Gestión de Casos Urgentes</h3>
              <button
                onClick={() => setModalGestionCasosUrgentes(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Resumen de Casos Urgentes */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-red-800 font-medium">Total Casos Urgentes</p>
                  <p className="text-3xl font-bold text-red-900">{casosActivos.filter(c => c.prioridad === 'alta').length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-red-800 font-medium">En Gestión</p>
                  <p className="text-3xl font-bold text-red-900">{casosActivos.filter(c => c.prioridad === 'alta' && c.estado === 'activo').length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-red-800 font-medium">Pendientes</p>
                  <p className="text-3xl font-bold text-red-900">{casosActivos.filter(c => c.prioridad === 'alta' && c.estado === 'pendiente').length}</p>
                </div>
              </div>
            </div>

            {/* Tabla de Casos Urgentes */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Caso</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Descripción</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {casosActivos.filter(c => c.prioridad === 'alta').length > 0 ? (
                    casosActivos.filter(c => c.prioridad === 'alta').map((caso) => (
                      <tr key={caso.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">{caso.titulo}</p>
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium mt-1">
                            URGENTE
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {caso.descripcion}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            caso.estado === 'activo' ? 'bg-green-100 text-green-800' :
                            caso.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {caso.estado === 'activo' ? 'En gestión' :
                             caso.estado === 'pendiente' ? 'Pendiente' :
                             'Resuelto'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(caso.fechaCreacion).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setCasoSeleccionado(caso)
                                setModalGestionCasosUrgentes(false)
                                setModalGestionarCaso(true)
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              Gestionar
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Confirmas que el caso "${caso.titulo}" ha sido resuelto?`)) {
                                  alert('Caso marcado como resuelto. La funcionalidad completa se implementará con la base de datos.')
                                }
                              }}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Resolver
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        <p className="text-lg font-medium">No hay casos urgentes en este momento</p>
                        <p className="text-sm mt-2">Todos los casos de alta prioridad han sido gestionados</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Información Adicional */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Información sobre Casos Urgentes</h4>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                <li>Los casos urgentes requieren atención inmediata del delegado principal</li>
                <li>Todos los casos urgentes deben ser gestionados en un plazo máximo de 24 horas</li>
                <li>Si existe riesgo inminente para un menor, contactar servicios de emergencia (112)</li>
                <li>Documentar todas las acciones realizadas para cada caso</li>
                <li>Notificar a las autoridades competentes según el protocolo establecido</li>
              </ul>
            </div>

            {/* Acciones del Modal */}
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setModalCasoUrgente(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Reportar Nuevo Caso Urgente
              </button>
              <button
                onClick={() => setModalGestionCasosUrgentes(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle de Plantilla - Ver, Editar y Enviar */}
      {modalPlantillaDetalle && plantillaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{plantillaSeleccionada.titulo}</h3>
                <p className="text-sm text-gray-600">{plantillaSeleccionada.descripcion}</p>
              </div>
              <button
                onClick={() => {
                  setModalPlantillaDetalle(false)
                  setPlantillaSeleccionada(null)
                  setCamposPlantilla({})
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Formulario de Campos */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Completar Campos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plantillaSeleccionada.campos.map((campo) => (
                  <div key={campo}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {campo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    {campo.includes('mensaje') || campo.includes('descripcion') || campo.includes('instrucciones') || campo.includes('recordatorio') ? (
                      <textarea
                        value={camposPlantilla[campo] || ''}
                        onChange={(e) => setCamposPlantilla({...camposPlantilla, [campo]: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        rows={3}
                        placeholder={`Ingrese ${campo.replace(/_/g, ' ')}`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={camposPlantilla[campo] || ''}
                        onChange={(e) => setCamposPlantilla({...camposPlantilla, [campo]: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        placeholder={`Ingrese ${campo.replace(/_/g, ' ')}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Vista Previa del Contenido */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Vista Previa</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {plantillaSeleccionada.contenido.replace(/\{\{(\w+)\}\}/g, (match, campo) => {
                    return camposPlantilla[campo] || `[${campo.replace(/_/g, ' ').toUpperCase()}]`
                  })}
                </pre>
              </div>
            </div>

            {/* Opciones de Envío */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Canal de Envío</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCanalEnvioPlantilla('email')}
                  className={`p-3 rounded-lg border-2 ${
                    canalEnvioPlantilla === 'email'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">Enviar por correo electrónico</p>
                </button>
                <button
                  onClick={() => setCanalEnvioPlantilla('whatsapp')}
                  className={`p-3 rounded-lg border-2 ${
                    canalEnvioPlantilla === 'whatsapp'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-600">Enviar por WhatsApp</p>
                </button>
              </div>
            </div>

            {/* Destinatario */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destinatario {canalEnvioPlantilla === 'email' ? '(Email)' : '(Teléfono)'}
              </label>
              <input
                type={canalEnvioPlantilla === 'email' ? 'email' : 'tel'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder={canalEnvioPlantilla === 'email' ? 'ejemplo@correo.com' : '+34 600 000 000'}
              />
            </div>

            {/* Acciones */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const contenidoFinal = plantillaSeleccionada.contenido.replace(/\{\{(\w+)\}\}/g, (match, campo) => {
                    return camposPlantilla[campo] || `[${campo.replace(/_/g, ' ').toUpperCase()}]`
                  })
                  alert(`Plantilla enviada por ${canalEnvioPlantilla}\n\nContenido:\n${contenidoFinal.substring(0, 200)}...`)
                  setModalPlantillaDetalle(false)
                  setPlantillaSeleccionada(null)
                  setCamposPlantilla({})
                }}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Enviar por {canalEnvioPlantilla === 'email' ? 'Email' : 'WhatsApp'}
              </button>
              <button
                onClick={() => {
                  const contenidoFinal = plantillaSeleccionada.contenido.replace(/\{\{(\w+)\}\}/g, (match, campo) => {
                    return camposPlantilla[campo] || `[${campo.replace(/_/g, ' ').toUpperCase()}]`
                  })
                  const blob = new Blob([contenidoFinal], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${plantillaSeleccionada.titulo.replace(/\s+/g, '_')}.txt`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Descargar
              </button>
              <button
                onClick={() => {
                  setModalPlantillaDetalle(false)
                  setPlantillaSeleccionada(null)
                  setCamposPlantilla({})
                }}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
