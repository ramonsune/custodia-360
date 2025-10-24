import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Packer } from 'docx'
import { generarPDFProfesional } from '@/lib/document-generator/pdf-generator'
import { generarDOCXProfesional } from '@/lib/document-generator/docx-generator'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const fechaActual = new Date().toLocaleDateString('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

// Configuraciones de los 5 protocolos del Bloque 04
const documentosConfig = [
  {
    filename: 'Protocolo_Deteccion_Notificacion',
    titulo: 'Protocolo de Detección y Notificación de Sospechas',
    subtitulo: 'Procedimiento para identificar y comunicar señales de riesgo',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Objeto',
        contenido: [
          'Establecer un procedimiento claro para detectar señales de riesgo o violencia hacia menores y notificar internamente con diligencia debida, minimizando la revictimización.',
          '',
          'Este protocolo garantiza que:',
          '- Cualquier sospecha sea identificada tempranamente.',
          '- La comunicación interna sea rápida y confidencial.',
          '- Se preserve la dignidad y derechos del menor.',
          '- Se mantenga trazabilidad completa del proceso.'
        ]
      },
      {
        titulo: '2. Alcance',
        contenido: [
          'Este protocolo es de aplicación obligatoria para:',
          '',
          '- Todo el personal de la entidad (laboral, funcionario, autónomo).',
          '- Voluntariado y colaboradores habituales.',
          '- Cualquier persona que interactúe con menores en nombre de la entidad.',
          '- Personas que tengan acceso a información relacionada con menores.',
          '',
          'Aplicable en todos los entornos:',
          '- Actividades presenciales (instalaciones propias y externas).',
          '- Actividades online (plataformas digitales, comunicaciones).',
          '- Eventos puntuales (campamentos, excursiones, celebraciones).'
        ]
      },
      {
        titulo: '3. Indicadores de Sospecha',
        contenido: [
          '**Señales físicas:**',
          '- Lesiones inexplicadas o inconsistentes con la explicación dada.',
          '- Marcas compatibles con maltrato físico.',
          '- Descuido en higiene personal o apariencia.',
          '- Signos de desnutrición o fatiga crónica.',
          '',
          '**Señales conductuales:**',
          '- Cambios significativos de comportamiento (agresividad, retraimiento).',
          '- Miedo o rechazo a personas específicas.',
          '- Conductas regresivas (enuresis, chuparse el dedo).',
          '- Conocimientos o conductas sexuales inadecuados para la edad.',
          '- Aislamiento social repentino.',
          '',
          '**Señales emocionales:**',
          '- Ansiedad o tristeza persistentes.',
          '- Baja autoestima o sentimientos de culpa.',
          '- Dificultades de concentración.',
          '- Trastornos del sueño o alimentación.',
          '',
          '**Señales de ciberacoso:**',
          '- Cambios en el uso de dispositivos (evitarlos o usarlos compulsivamente).',
          '- Secretismo con la actividad online.',
          '- Reacciones emocionales intensas al usar dispositivos.',
          '- Recepción de mensajes hostiles o inapropiados.',
          '',
          '**Relatos y comunicaciones:**',
          '- Relatos incongruentes o contradictorios.',
          '- Revelaciones directas o indirectas de situaciones de riesgo.',
          '- Expresiones de malestar sin causa aparente.'
        ]
      },
      {
        titulo: '4. Principios Fundamentales',
        contenido: [
          '**Interés superior del menor:**',
          'Toda actuación debe priorizar el bienestar y protección del menor.',
          '',
          '**Confidencialidad:**',
          'La información se comparte solo con personas autorizadas según el protocolo.',
          '',
          '**Rapidez:**',
          'La notificación debe ser inmediata. Ninguna sospecha puede esperar.',
          '',
          '**Objetividad:**',
          'Documentar hechos observados, no interpretaciones o juicios personales.',
          '',
          '**No revictimización:**',
          'Evitar interrogatorios repetidos. Una sola conversación empática y registrada.',
          '',
          '**Presunción de buena fe:**',
          'Toda notificación se considera realizada con intención protectora.'
        ]
      },
      {
        titulo: '5. Proceso de Detección y Notificación',
        contenido: [
          '**Paso 1: Observación y Registro Objetivo**',
          '',
          'Cuando se detecta un indicador de sospecha:',
          '- Anotar fecha, hora y lugar exactos.',
          '- Describir hechos observados de forma objetiva.',
          '- Identificar contexto (actividad, personas presentes).',
          '- Registrar palabras textuales del menor si las hubo.',
          '- Evitar interpretaciones o valoraciones personales.',
          '',
          '**Paso 2: Notificación Inmediata**',
          '',
          'Comunicar al Responsable de Protección:',
          '- Preferiblemente en persona o por teléfono.',
          '- Si no está disponible, usar el canal seguro designado (email cifrado, formulario Custodia360).',
          '- Plazo máximo: 24 horas desde la detección.',
          '- En riesgo grave: inmediato (llamada directa).',
          '',
          '**Paso 3: Valoración Inicial**',
          '',
          'El Responsable de Protección evalúa:',
          '- Gravedad y urgencia de la situación.',
          '- Necesidad de actuación inmediata.',
          '- Pertinencia de derivación externa.',
          '- Medidas de protección inmediatas necesarias.',
          '',
          '**Paso 4: Decisión sobre Actuación**',
          '',
          'Según la valoración, se activa:',
          '- Protocolo de Actuación Urgente (si riesgo inminente).',
          '- Derivación a Servicios Sociales/Autoridades (si procede).',
          '- Seguimiento interno reforzado (si no requiere derivación).',
          '- Comunicación a familias (según corresponda).',
          '',
          '**Paso 5: Documentación y Trazabilidad**',
          '',
          'Todo el proceso se registra en Custodia360:',
          '- Notificación original.',
          '- Valoración del Responsable.',
          '- Decisiones tomadas y fundamentos.',
          '- Acciones realizadas.',
          '- Seguimiento posterior.'
        ]
      },
      {
        titulo: '6. Roles y Responsabilidades',
        contenido: [
          '**Personal y Voluntariado:**',
          '- Detectar y observar señales de riesgo.',
          '- Notificar inmediatamente al Responsable de Protección.',
          '- Mantener confidencialidad absoluta.',
          '- No investigar por cuenta propia.',
          '- Colaborar en el seguimiento si se solicita.',
          '',
          '**Responsable de Protección:**',
          '- Recibir y registrar todas las notificaciones.',
          '- Realizar valoración inicial en máximo 48 horas.',
          '- Decidir actuación según protocolos.',
          '- Coordinar con autoridades externas si procede.',
          '- Informar a Dirección de situaciones graves.',
          '- Supervisar seguimiento de casos.',
          '',
          '**Dirección / Comité de Protección:**',
          '- Supervisar el funcionamiento del protocolo.',
          '- Aprobar medidas organizativas o presupuestarias necesarias.',
          '- Revisar casos complejos o de especial gravedad.',
          '- Garantizar recursos para la implementación.'
        ]
      },
      {
        titulo: '7. Trazabilidad y Conservación',
        contenido: [
          'Todos los pasos se registran en la plataforma Custodia360 para garantizar:',
          '',
          '**Trazabilidad completa:**',
          '- Registro cronológico de todas las acciones.',
          '- Identificación de personas que intervienen.',
          '- Evidencias documentales adjuntas.',
          '- Plazos y fechas verificables.',
          '',
          '**Conservación:**',
          '- Periodo mínimo: 5 años desde cierre del caso.',
          '- Acceso restringido a personas autorizadas.',
          '- Medidas de seguridad técnicas y organizativas.',
          '- Cumplimiento RGPD/LOPDGDD.',
          '',
          '**Auditoría:**',
          '- Revisión anual del funcionamiento del protocolo.',
          '- Análisis de casos para mejora continua.',
          '- Verificación de plazos y calidad de respuestas.'
        ]
      },
      {
        titulo: 'Anexos',
        contenido: [
          '**Anexo 1: Modelo de Comunicación de Preocupación**',
          '',
          '[Disponible en formato editable en Custodia360]',
          '',
          'Campos obligatorios:',
          '- Datos del notificante (nombre, cargo, contacto)',
          '- Fecha y hora de la observación',
          '- Descripción objetiva de hechos',
          '- Contexto y circunstancias',
          '- Testigos presentes',
          '- Palabras textuales del menor (si aplica)',
          '',
          '**Anexo 2: Checklist de Observación**',
          '',
          '☐ Señales físicas identificadas',
          '☐ Cambios conductuales documentados',
          '☐ Contexto registrado',
          '☐ Testigos identificados',
          '☐ Notificación realizada al Responsable',
          '☐ Confirmación de recepción obtenida',
          '☐ Medidas inmediatas aplicadas (si procede)'
        ]
      }
    ]
  },
  {
    filename: 'Protocolo_Actuacion_Urgente',
    titulo: 'Protocolo de Actuación Urgente ante Riesgo Inminente',
    subtitulo: 'Procedimiento de respuesta inmediata en situaciones críticas',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Objeto',
        contenido: [
          'Definir la actuación inmediata y coordinada cuando exista un riesgo grave o inminente para la integridad física, psíquica o emocional de un menor.',
          '',
          'Este protocolo permite:',
          '- Respuesta rápida y eficaz ante emergencias.',
          '- Protección inmediata del menor afectado.',
          '- Coordinación con servicios de emergencia.',
          '- Preservación de evidencias.',
          '- Minimización del impacto traumático.'
        ]
      },
      {
        titulo: '2. Criterios de Activación',
        contenido: [
          'Este protocolo se activa ante:',
          '',
          '**Situaciones de riesgo físico inmediato:**',
          '- Agresión física en curso o inminente.',
          '- Lesiones graves que requieren atención médica urgente.',
          '- Situación de peligro para la vida o salud.',
          '',
          '**Situaciones de riesgo psicológico grave:**',
          '- Amenazas graves o intimidación extrema.',
          '- Crisis emocional aguda (ideación suicida, pánico severo).',
          '- Revelación de abuso sexual reciente.',
          '',
          '**Otras situaciones críticas:**',
          '- Desaparición o fuga del menor.',
          '- Exposición a sustancias tóxicas o peligrosas.',
          '- Cualquier situación que no admita demora.'
        ]
      },
      {
        titulo: '3. Acciones Prioritarias (Secuencia)',
        contenido: [
          '**ACCIÓN 1: Garantizar Seguridad del Menor**',
          '',
          '- Separar al menor de la fuente de peligro.',
          '- Asegurar su integridad física inmediata.',
          '- Acompañar por un adulto de referencia de confianza.',
          '- Trasladar a espacio seguro si es necesario.',
          '- No dejar solo al menor en ningún momento.',
          '',
          '**ACCIÓN 2: Alertar Servicios de Emergencia**',
          '',
          'Llamar al 112 cuando:',
          '- Haya lesiones que requieran atención médica.',
          '- Exista peligro físico inminente.',
          '- Se necesite intervención policial urgente.',
          '',
          'Proporcionar:',
          '- Ubicación exacta.',
          '- Descripción clara de la situación.',
          '- Estado del menor.',
          '- Datos de contacto.',
          '',
          '**ACCIÓN 3: Informar al Responsable de Protección**',
          '',
          '- Llamada inmediata (no esperar email).',
          '- Si no contesta: contactar con suplente o Dirección.',
          '- Informar de: situación, ubicación, acciones tomadas.',
          '',
          '**ACCIÓN 4: No Interrogar al Menor**',
          '',
          '- Escucha empática sin hacer preguntas inquisitivas.',
          '- Creer y validar lo que el menor comunica.',
          '- Anotar palabras textuales, no interpretaciones.',
          '- Evitar múltiples entrevistas (una sola, profesional).',
          '',
          '**ACCIÓN 5: Preservar Evidencias**',
          '',
          '- No limpiar lesiones ni modificar escena.',
          '- Conservar objetos o documentos relevantes.',
          '- Fotografiar si es apropiado y con consentimiento.',
          '- No contaminar pruebas.',
          '',
          '**ACCIÓN 6: Registrar Todo en Tiempo Real**',
          '',
          '- Anotar: fecha, hora exacta, hechos observados.',
          '- Identificar personas presentes y actuaciones.',
          '- Conservar notas originales.',
          '- Transferir a registro oficial en Custodia360.',
          '',
          '**ACCIÓN 7: Comunicar a Familias**',
          '',
          '- Coordinar con Responsable de Protección.',
          '- Seguir indicaciones de autoridades si están involucradas.',
          '- Informar con sensibilidad y profesionalidad.',
          '- Documentar la comunicación.',
          '',
          '**ACCIÓN 8: Activar Apoyo Psicosocial**',
          '',
          '- Contactar con recursos de apoyo emocional.',
          '- Ofrecer acompañamiento al menor y familia.',
          '- Coordinar atención especializada si procede.'
        ]
      },
      {
        titulo: '4. Comunicación Externa',
        contenido: [
          '**Portavoz único:**',
          'Solo el Responsable de Protección o el portavoz designado por Dirección puede comunicarse con medios o terceros sobre el incidente.',
          '',
          '**Confidencialidad estricta:**',
          '- No revelar identidad del menor.',
          '- No compartir detalles en redes sociales.',
          '- Evitar especulaciones o comentarios.',
          '',
          '**Coordinación con autoridades:**',
          '- Seguir instrucciones de Policía/Fiscalía sobre qué comunicar.',
          '- No adelantar información que pueda perjudicar investigación.',
          '- Mantener canal directo con servicios intervinientes.'
        ]
      },
      {
        titulo: '5. Cierre y Lecciones Aprendidas',
        contenido: [
          '**Revisión post-incidente:**',
          '',
          'Una vez superada la situación crítica:',
          '- Reunión del equipo involucrado.',
          '- Análisis de la respuesta (qué funcionó, qué mejorar).',
          '- Identificación de fallos o brechas.',
          '',
          '**Acciones correctivas:**',
          '',
          '- Actualizar protocolos si se detectan deficiencias.',
          '- Reforzar formación en áreas débiles.',
          '- Mejorar recursos o infraestructura.',
          '- Implementar controles adicionales.',
          '',
          '**Seguimiento del menor:**',
          '',
          '- Plan de acompañamiento a medio plazo.',
          '- Coordinación con servicios especializados.',
          '- Revisión periódica del bienestar.',
          '',
          '**Documentación:**',
          '',
          '- Informe completo del incidente.',
          '- Registro de todas las actuaciones.',
          '- Evidencias conservadas según normativa.',
          '- Lecciones aprendidas documentadas.'
        ]
      },
      {
        titulo: 'Anexos',
        contenido: [
          '**Anexo 1: Checklist de Actuación Urgente**',
          '',
          '☐ Menor en lugar seguro',
          '☐ Servicios de emergencia alertados (si procede)',
          '☐ Responsable de Protección informado',
          '☐ Evidencias preservadas',
          '☐ Registro temporal iniciado',
          '☐ Familias contactadas (según proceda)',
          '☐ Apoyo emocional activado',
          '☐ Registro oficial completado',
          '',
          '**Anexo 2: Ficha de Incidente Crítico**',
          '',
          '[Disponible en Custodia360]',
          '',
          'Campos:',
          '- Tipo de incidente',
          '- Fecha y hora',
          '- Personas involucradas',
          '- Descripción detallada',
          '- Acciones inmediatas tomadas',
          '- Servicios externos contactados',
          '- Comunicaciones realizadas',
          '- Seguimiento planificado'
        ]
      }
    ]
  },
  {
    filename: 'Protocolo_Coordinacion_Servicios',
    titulo: 'Protocolo de Coordinación con Servicios Sociales y Autoridades',
    subtitulo: 'Procedimiento de derivación y colaboración interinstitucional',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Objeto',
        contenido: [
          'Asegurar una coordinación efectiva y conforme a la normativa con Servicios Sociales, Fuerzas y Cuerpos de Seguridad del Estado, Fiscalía de Menores y otros organismos competentes.',
          '',
          'Objetivos específicos:',
          '- Cumplir con el deber legal de comunicación.',
          '- Facilitar la intervención especializada.',
          '- Proteger al menor de forma integral.',
          '- Colaborar con las investigaciones oficiales.',
          '- Mantener trazabilidad de todas las actuaciones.'
        ]
      },
      {
        titulo: '2. Base Jurídica',
        contenido: [
          '**Normativa aplicable:**',
          '',
          '- Ley Orgánica 8/2021 (LOPIVI): Deber de comunicación.',
          '- Normativa autonómica específica de protección de menores.',
          '- Código Penal: Obligación de denunciar delitos.',
          '- Reglamento General de Protección de Datos (RGPD).',
          '- Ley Orgánica 3/2018 (LOPDGDD).',
          '',
          '**Legitimación para el tratamiento de datos:**',
          '',
          '- Interés público esencial (protección de menores).',
          '- Cumplimiento de obligación legal.',
          '- Interés vital del menor.',
          '',
          '**Principios de protección de datos:**',
          '',
          '- Minimización: Solo datos estrictamente necesarios.',
          '- Confidencialidad: Medidas de seguridad reforzadas.',
          '- Trazabilidad: Registro de accesos y comunicaciones.'
        ]
      },
      {
        titulo: '3. Supuestos de Comunicación Externa',
        contenido: [
          'La comunicación a organismos externos es obligatoria ante:',
          '',
          '**Riesgo grave o inminente:**',
          '- Situación de desprotección grave del menor.',
          '- Peligro para su integridad física o psíquica.',
          '- Necesidad de medidas de protección urgentes.',
          '',
          '**Sospecha razonable de delito:**',
          '- Maltrato físico o psicológico.',
          '- Abuso o agresión sexual.',
          '- Negligencia grave.',
          '- Explotación laboral o sexual.',
          '- Cualquier otro delito contra menores.',
          '',
          '**Necesidad de intervención especializada:**',
          '- Situación familiar compleja que requiere valoración profesional.',
          '- Necesidad de recursos que la entidad no puede proporcionar.',
          '- Indicación de servicios sanitarios o educativos especializados.'
        ]
      },
      {
        titulo: '4. Procedimiento de Coordinación',
        contenido: [
          '**Fase 1: Valoración Interna**',
          '',
          'El Responsable de Protección evalúa:',
          '- Gravedad de la situación.',
          '- Urgencia de la derivación.',
          '- Organismo competente más adecuado.',
          '- Información mínima necesaria a remitir.',
          '',
          '**Fase 2: Contacto Inicial**',
          '',
          'Con el recurso competente:',
          '',
          '- **Servicios Sociales**: Desprotección, situación familiar, necesidad de apoyo.',
          '- **Policía Nacional (091) / Guardia Civil (062)**: Delitos, riesgo inminente.',
          '- **Fiscalía de Menores**: Casos graves, necesidad de medidas judiciales.',
          '- **Servicios Sanitarios**: Lesiones, necesidad de atención médica.',
          '',
          '**Fase 3: Remisión de Información**',
          '',
          'Envío de documentación:',
          '- Oficio de comunicación formal.',
          '- Descripción objetiva de hechos.',
          '- Cronología de observaciones.',
          '- Registros y evidencias relevantes.',
          '- Datos del menor (mínimos necesarios).',
          '- Datos de contacto de la entidad.',
          '',
          'Canal: Preferiblemente escrito y con acuse de recibo.',
          '',
          '**Fase 4: Seguimiento de Instrucciones**',
          '',
          '- Atender requerimientos de información adicional.',
          '- Colaborar en investigaciones.',
          '- Implementar medidas indicadas por autoridades.',
          '- Mantener comunicación fluida.',
          '',
          '**Fase 5: Registro y Documentación**',
          '',
          'En Custodia360 se registra:',
          '- Fecha y motivo de la derivación.',
          '- Organismo contactado y persona de referencia.',
          '- Documentación remitida.',
          '- Respuestas y actuaciones externas.',
          '- Seguimiento del caso.',
          '- Cierre y resultado final.'
        ]
      },
      {
        titulo: '5. Protección de Datos en la Derivación',
        contenido: [
          '**Datos a remitir:**',
          '',
          'Solo la información estrictamente necesaria para:',
          '- Identificar al menor y su situación.',
          '- Permitir la intervención adecuada.',
          '- Fundamentar la derivación.',
          '',
          'Evitar:',
          '- Datos innecesarios de terceros.',
          '- Información sensible no relevante.',
          '- Especulaciones o juicios de valor.',
          '',
          '**Medidas de seguridad:**',
          '',
          '- Envío por canal seguro (email cifrado, plataforma segura).',
          '- Marcar documentación como "CONFIDENCIAL".',
          '- Verificar identidad del destinatario.',
          '- Confirmar recepción correcta.',
          '',
          '**Registro de accesos:**',
          '',
          'Documentar:',
          '- Quién accede a la información.',
          '- Cuándo y para qué fin.',
          '- Qué datos se comparten.',
          '- Con qué organismos.'
        ]
      },
      {
        titulo: 'Anexos',
        contenido: [
          '**Anexo 1: Directorio de Contactos Institucionales**',
          '',
          '[Personalizar según localidad de la entidad]',
          '',
          '**Servicios Sociales:**',
          '- Entidad: ___________________________',
          '- Teléfono: __________________________',
          '- Email: _____________________________',
          '- Persona de referencia: ______________',
          '',
          '**Fuerzas y Cuerpos de Seguridad:**',
          '- Policía Nacional: 091',
          '- Guardia Civil: 062',
          '- Comisaría local: ____________________',
          '- Contacto directo: ___________________',
          '',
          '**Fiscalía de Menores:**',
          '- Dirección: __________________________',
          '- Teléfono: ___________________________',
          '- Email: ______________________________',
          '',
          '**Otros recursos:**',
          '- Teléfono del Menor: 116111',
          '- Emergencias: 112',
          '',
          '**Anexo 2: Plantilla de Oficio de Remisión**',
          '',
          '[Disponible en formato editable en Custodia360]',
          '',
          'Estructura:',
          '- Encabezado institucional',
          '- Destinatario y asunto',
          '- Exposición de motivos',
          '- Descripción de hechos',
          '- Documentación adjunta',
          '- Firma del Responsable de Protección',
          '- Datos de contacto para seguimiento'
        ]
      }
    ]
  },
  {
    filename: 'Protocolo_Comunicacion_Familias',
    titulo: 'Protocolo de Comunicación con Familias y Menores',
    subtitulo: 'Procedimiento para comunicaciones seguras y efectivas',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Objetivo',
        contenido: [
          'Establecer reglas claras para las comunicaciones con familias y menores que sean:',
          '',
          '- Seguras y protectoras.',
          '- Oportunas y efectivas.',
          '- Comprensibles y adaptadas a cada audiencia.',
          '- Respetuosas con la privacidad.',
          '- Trazables y verificables.'
        ]
      },
      {
        titulo: '2. Canales de Comunicación Autorizados',
        contenido: [
          '**Canales institucionales aprobados:**',
          '',
          '- Plataforma oficial de la entidad (portal, app).',
          '- Correo electrónico corporativo.',
          '- Teléfono institucional verificado.',
          '- Reuniones presenciales en instalaciones de la entidad.',
          '- Circulares y comunicados oficiales.',
          '',
          '**Canales PROHIBIDOS:**',
          '',
          '- Mensajería personal (WhatsApp, Telegram, etc.) sin registro institucional.',
          '- Redes sociales personales del personal.',
          '- Contactos 1:1 no autorizados ni supervisados.',
          '- Encuentros privados fuera de horarios y espacios oficiales.',
          '',
          '**Excepciones:**',
          '',
          'Solo en emergencias y con autorización expresa del Responsable de Protección.',
          'Toda comunicación excepcional debe registrarse inmediatamente.'
        ]
      },
      {
        titulo: '3. Principios de Comunicación',
        contenido: [
          '**Claridad:**',
          'Mensajes directos, sin ambigüedades, con información completa y verificable.',
          '',
          '**Respeto:**',
          'Trato cortés y profesional en todo momento, independientemente de la situación.',
          '',
          '**Lenguaje adaptado:**',
          '- Con menores: vocabulario apropiado a su edad y madurez.',
          '- Con familias: términos comprensibles, evitar tecnicismos innecesarios.',
          '',
          '**Confidencialidad:**',
          'Compartir solo información necesaria, protegiendo datos de terceros.',
          '',
          '**Datos mínimos:**',
          'Revelar únicamente lo imprescindible para el propósito de la comunicación.',
          '',
          '**Registro:**',
          'Documentar comunicaciones relevantes en Custodia360 para trazabilidad.'
        ]
      },
      {
        titulo: '4. Escenarios de Comunicación',
        contenido: [
          '**Escenario 1: Información General**',
          '',
          'Contenido: Calendario, actividades, normas, recordatorios.',
          '',
          'Procedimiento:',
          '- Circular general o publicación en plataforma.',
          '- Lenguaje claro y positivo.',
          '- Contacto para dudas o aclaraciones.',
          '',
          '**Escenario 2: Incidente No Crítico**',
          '',
          'Ejemplos: Conflicto menor entre compañeros, pequeña lesión sin gravedad.',
          '',
          'Procedimiento:',
          '- Comunicación directa a la familia (llamada o email).',
          '- Descripción objetiva del incidente.',
          '- Medidas adoptadas.',
          '- Seguimiento previsto.',
          '- Registro de la comunicación.',
          '',
          '**Escenario 3: Incidente Crítico**',
          '',
          'Ejemplos: Sospecha de maltrato, lesión grave, situación de riesgo.',
          '',
          'Procedimiento:',
          '- Coordinación previa con Responsable de Protección.',
          '- Si hay derivación a autoridades: seguir sus instrucciones sobre qué comunicar.',
          '- Comunicación presencial siempre que sea posible.',
          '- Enfoque en apoyo y acompañamiento.',
          '- Evitar detalles que puedan perjudicar investigaciones.',
          '- Documentación exhaustiva.',
          '',
          '**Escenario 4: Respuesta a Consultas o Quejas**',
          '',
          'Procedimiento:',
          '- Acuse de recibo en 24-48 horas.',
          '- Evaluación y respuesta fundamentada.',
          '- Plazo razonable según complejidad.',
          '- Seguimiento hasta satisfacción o cierre formal.'
        ]
      },
      {
        titulo: '5. Comunicación Digital y Uso de Imágenes',
        contenido: [
          '**Consentimientos previos:**',
          '',
          'Antes de captar o difundir imágenes/vídeos:',
          '- Obtener consentimiento informado de tutores legales.',
          '- Especificar uso previsto (web, redes, publicidad).',
          '- Permitir revocación del consentimiento.',
          '',
          '**Limitación de difusión:**',
          '',
          '- Solo publicar en canales autorizados.',
          '- Evitar identificación individual (nombres completos, datos personales).',
          '- No etiquetar a menores en redes sociales.',
          '',
          '**Almacenamiento seguro:**',
          '',
          '- Conservar imágenes en servidores protegidos.',
          '- Acceso restringido a personal autorizado.',
          '- Eliminar imágenes cuando finalice el uso autorizado.',
          '',
          '**Uso responsable de dispositivos:**',
          '',
          '- Prohibición de fotos/vídeos personales de menores.',
          '- Solo dispositivos institucionales para registro de actividades.',
          '- Protocolo de revisión antes de publicación.'
        ]
      },
      {
        titulo: 'Anexos',
        contenido: [
          '**Anexo 1: Plantillas de Comunicación**',
          '',
          '[Disponibles en Custodia360]',
          '',
          '1. Comunicado General (informativo)',
          '2. Comunicado de Incidente Leve',
          '3. Comunicado de Incidente Grave',
          '4. Respuesta a Consulta',
          '5. Respuesta a Queja',
          '',
          '**Anexo 2: Modelo de Consentimiento Informado**',
          '',
          '[Formato editable]',
          '',
          'Contenido:',
          '- Identificación del menor y tutores',
          '- Descripción del uso de imágenes/datos',
          '- Alcance del consentimiento',
          '- Derecho de revocación',
          '- Firma y fecha',
          '',
          '**Anexo 3: Checklist de Comunicación Segura**',
          '',
          '☐ Canal autorizado utilizado',
          '☐ Lenguaje adaptado a la audiencia',
          '☐ Información necesaria y suficiente',
          '☐ Confidencialidad preservada',
          '☐ Consentimientos obtenidos (si aplica)',
          '☐ Comunicación registrada',
          '☐ Seguimiento planificado'
        ]
      }
    ]
  },
  {
    filename: 'Protocolo_Quejas_Sugerencias',
    titulo: 'Protocolo de Gestión de Quejas y Sugerencias',
    subtitulo: 'Procedimiento para atención de reclamaciones y mejora continua',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Alcance',
        contenido: [
          'Este protocolo cubre:',
          '',
          '**Quejas y reclamaciones:**',
          '- Disconformidad con servicios o actuaciones.',
          '- Incumplimientos percibidos de normas o compromisos.',
          '- Trato inadecuado o situaciones conflictivas.',
          '',
          '**Sugerencias:**',
          '- Propuestas de mejora de servicios.',
          '- Ideas para nuevas actividades o recursos.',
          '- Feedback sobre funcionamiento general.',
          '',
          '**Origen:**',
          '- Familias de menores participantes.',
          '- Menores (adaptando formato según edad).',
          '- Personal y voluntariado.',
          '- Terceros vinculados a la entidad.'
        ]
      },
      {
        titulo: '2. Principios Rectores',
        contenido: [
          '**Accesibilidad:**',
          'Canales múltiples y fáciles de usar para que cualquier persona pueda presentar quejas o sugerencias.',
          '',
          '**No represalia:**',
          'Garantía absoluta de que presentar una queja o sugerencia no tendrá consecuencias negativas.',
          '',
          '**Transparencia:**',
          'Información clara sobre el proceso, plazos y criterios de resolución.',
          '',
          '**Plazos razonables:**',
          'Respuesta en tiempos establecidos según complejidad del asunto.',
          '',
          '**Trazabilidad:**',
          'Registro completo desde recepción hasta cierre, con identificador único.',
          '',
          '**Mejora continua:**',
          'Análisis sistemático de quejas y sugerencias para identificar áreas de mejora organizacional.'
        ]
      },
      {
        titulo: '3. Flujo Operativo',
        contenido: [
          '**Paso 1: Recepción**',
          '',
          'La queja o sugerencia se puede presentar por:',
          '- Formulario físico (disponible en recepción).',
          '- Formulario digital (web, app, email).',
          '- QR code que dirige a formulario online.',
          '- Buzón físico anónimo.',
          '- Comunicación oral (que se registra por escrito con consentimiento).',
          '',
          'Información solicitada:',
          '- Datos del reclamante (opcional si desea anonimato).',
          '- Descripción del motivo.',
          '- Fecha y circunstancias.',
          '- Solicitud o propuesta concreta.',
          '',
          '**Paso 2: Registro en Custodia360**',
          '',
          'Se asigna:',
          '- ID único de seguimiento.',
          '- Fecha de recepción.',
          '- Categoría (queja/sugerencia).',
          '- Subcategoría (servicio, personal, instalaciones, etc.).',
          '- Prioridad inicial (baja/media/alta).',
          '',
          '**Paso 3: Evaluación y Asignación**',
          '',
          'El Responsable de Protección o Dirección:',
          '- Evalúa gravedad y urgencia.',
          '- Asigna a persona responsable de tramitación.',
          '- Establece plazo de respuesta.',
          '',
          'Plazos estándar (SLA):',
          '- Sugerencias: 15 días hábiles.',
          '- Quejas leves: 10 días hábiles.',
          '- Quejas graves: 5 días hábiles.',
          '- Quejas urgentes: 48 horas.',
          '',
          '**Paso 4: Investigación y Análisis**',
          '',
          '- Recopilación de información relevante.',
          '- Entrevistas si son necesarias.',
          '- Verificación de hechos.',
          '- Valoración de opciones de respuesta.',
          '',
          '**Paso 5: Respuesta Motivada**',
          '',
          'Contenido de la respuesta:',
          '- Acuse de recibo de la queja/sugerencia.',
          '- Resumen de investigación realizada.',
          '- Decisión o acción adoptada.',
          '- Fundamentación de la decisión.',
          '- Medidas correctivas implementadas.',
          '- Plazo de implementación (si aplica).',
          '- Contacto para seguimiento.',
          '',
          '**Paso 6: Cierre y Verificación**',
          '',
          '- Confirmación de satisfacción del reclamante (si se identifica).',
          '- Implementación de acciones correctivas.',
          '- Verificación de cumplimiento.',
          '- Cierre formal en el sistema.',
          '',
          '**Paso 7: Reporte Periódico**',
          '',
          'Mensual/Trimestral a Dirección/Comité:',
          '- Número y tipo de quejas/sugerencias.',
          '- Plazos de respuesta cumplidos.',
          '- Principales motivos recurrentes.',
          '- Acciones de mejora implementadas.',
          '- Tendencias y análisis.'
        ]
      },
      {
        titulo: '4. Canales de Presentación',
        contenido: [
          '**Físicos:**',
          '',
          '- Buzón de quejas y sugerencias (ubicación accesible).',
          '- Formularios en papel disponibles en recepción.',
          '- Atención presencial en horario de oficina.',
          '',
          '**Digitales:**',
          '',
          '- Formulario online en web de la entidad.',
          '- Email dedicado: quejas@[entidad].es',
          '- QR code visible en instalaciones.',
          '- App móvil (si disponible).',
          '',
          '**Información visible:**',
          '',
          'Carteles informativos que incluyan:',
          '- Instrucciones para presentar quejas/sugerencias.',
          '- Canales disponibles.',
          '- Compromiso de respuesta en plazo.',
          '- Garantía de confidencialidad.',
          '- Política de no represalias.'
        ]
      },
      {
        titulo: 'Anexos',
        contenido: [
          '**Anexo 1: Formulario de Quejas y Sugerencias**',
          '',
          '[Disponible en formato físico y digital]',
          '',
          'Secciones:',
          '',
          '1. Tipo de comunicación',
          '   ☐ Queja   ☐ Reclamación   ☐ Sugerencia',
          '',
          '2. Datos del comunicante (opcional)',
          '   Nombre: _______________________________',
          '   Email/Teléfono: _______________________',
          '   Relación con la entidad: ______________',
          '',
          '3. Descripción',
          '   Motivo: _______________________________',
          '   Fecha del hecho: ______________________',
          '   Descripción detallada: _________________',
          '   _______________________________________',
          '',
          '4. Solicitud o propuesta',
          '   ________________________________________',
          '',
          '5. Documentación adjunta (opcional)',
          '   ________________________________________',
          '',
          '**Anexo 2: Matriz de Clasificación y SLA**',
          '',
          '| Tipo | Gravedad | Plazo Respuesta | Responsable |',
          '|------|----------|-----------------|-------------|',
          '| Sugerencia | - | 15 días | Coordinador |',
          '| Queja leve | Baja | 10 días | Responsable área |',
          '| Queja moderada | Media | 5 días | Resp. Protección |',
          '| Queja grave | Alta | 48 horas | Dirección |',
          '| Queja urgente | Crítica | Inmediata | Dirección |',
          '',
          '**Anexo 3: Indicadores de Seguimiento**',
          '',
          'KPIs mensuales:',
          '',
          '- Nº total de quejas y sugerencias recibidas',
          '- % resueltas en plazo',
          '- Tiempo medio de resolución',
          '- % de satisfacción (si medible)',
          '- Motivos más recurrentes',
          '- Acciones de mejora implementadas',
          '',
          'Estos indicadores se revisan en Custodia360 y se reportan a Dirección para mejora continua.'
        ]
      }
    ]
  }
]

export async function POST() {
  try {
    console.log('🚨 Generando Bloque 04: Protocolos de Actuación (PDF + DOCX)...')

    const documentos = []

    // Generar cada uno de los 5 protocolos
    for (let i = 0; i < documentosConfig.length; i++) {
      const config = documentosConfig[i]
      console.log(`${i + 1}/5 Generando: ${config.titulo}...`)

      const docConfig = {
        titulo: config.titulo,
        subtitulo: config.subtitulo,
        version: config.version,
        fecha: fechaActual,
        secciones: config.secciones
      }

      // ========================================
      // GENERAR PDF
      // ========================================
      console.log(`  → PDF...`)
      const pdfBuffer = generarPDFProfesional(docConfig)

      const pdfPath = `plantillas/04_Protocolos_Actuacion/${config.filename}.pdf`
      const { error: pdfError } = await supabase.storage
        .from('docs')
        .upload(pdfPath, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true
        })

      if (pdfError) throw new Error(`Error subiendo PDF ${config.filename}: ${pdfError.message}`)

      const { data: { publicUrl: pdfUrl } } = supabase.storage
        .from('docs')
        .getPublicUrl(pdfPath)

      // ========================================
      // GENERAR DOCX
      // ========================================
      console.log(`  → DOCX...`)
      const docxDoc = generarDOCXProfesional(docConfig)
      const docxBuffer = await Packer.toBuffer(docxDoc)

      const docxPath = `plantillas/04_Protocolos_Actuacion/${config.filename}.docx`
      const { error: docxError } = await supabase.storage
        .from('docs')
        .upload(docxPath, docxBuffer, {
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          upsert: true
        })

      if (docxError) throw new Error(`Error subiendo DOCX ${config.filename}: ${docxError.message}`)

      const { data: { publicUrl: docxUrl } } = supabase.storage
        .from('docs')
        .getPublicUrl(docxPath)

      documentos.push({
        nombre: config.titulo,
        pdf: pdfUrl,
        docx: docxUrl
      })

      console.log(`  ✅ ${config.filename} completado`)
    }

    console.log('✅ Todos los protocolos del Bloque 04 generados')

    // Enviar email de confirmación
    console.log('📧 Enviando email de confirmación...')

    const emailHtml = `
      <h2>Bloque 04 — Protocolos de Actuación creado</h2>
      <p>Se han generado y publicado correctamente los siguientes protocolos operativos en el panel de administración Custodia360:</p>
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Protocolo</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">PDF</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">DOCX</th>
          </tr>
        </thead>
        <tbody>
          ${documentos.map(doc => `
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>${doc.nombre}</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><a href="${doc.pdf}">Descargar PDF</a></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><a href="${doc.docx}">Descargar DOCX</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p><strong>Carpeta:</strong> <code>/docs/plantillas/04_Protocolos_Actuacion/</code></p>
      <p><strong>Panel admin:</strong> <code>/dashboard-custodia360/plantillas</code></p>
      <p><small>Generado el ${fechaActual}</small></p>
    `

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Custodia360 <noreply@custodia360.es>',
        to: ['info@custodia360.es'],
        subject: 'Bloque 04 — Protocolos de Actuación creado',
        html: emailHtml
      })
    })

    if (resendResponse.ok) {
      console.log('✅ Email enviado')
    }

    return NextResponse.json({
      success: true,
      total: documentos.length,
      documentos
    })

  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
