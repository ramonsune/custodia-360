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

// Configuraciones de los 5 documentos del Bloque 06
const documentosConfig = [
  {
    filename: 'Plan_Anual_Formacion',
    titulo: 'Plan Anual de Formación',
    subtitulo: 'Programación formativa LOPIVI para la entidad',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Objetivo',
        contenido: [
          'Garantizar que el 100% del personal y voluntariado de la entidad reciba formación adecuada y actualizada sobre prevención, detección y actuación frente a la violencia infantil, conforme a la Ley Orgánica 8/2021 (LOPIVI).',
          '',
          'Objetivos específicos:',
          '- Capacitar al personal en la identificación de señales de riesgo.',
          '- Formar en protocolos de actuación y notificación interna.',
          '- Actualizar conocimientos sobre normativa vigente.',
          '- Crear una cultura organizativa de protección infantil.',
          '- Cumplir con las obligaciones legales de formación continua.'
        ]
      },
      {
        titulo: '2. Alcance',
        contenido: [
          'Este plan de formación es aplicable a:',
          '',
          '- Todo el personal laboral y funcionario de la entidad.',
          '- Voluntariado habitual con contacto con menores.',
          '- Nuevas incorporaciones (formación inicial obligatoria).',
          '- Personal con funciones de coordinación o responsabilidad.',
          '- Responsable de Protección y equipo directivo.',
          '',
          'Abarca todos los centros, instalaciones y actividades donde participen menores.'
        ]
      },
      {
        titulo: '3. Estructura del Plan Formativo',
        contenido: [
          '**MÓDULO 1: Introducción a la LOPIVI**',
          '',
          'Contenido:',
          '- Marco legal: LOPIVI, normativa autonómica, derechos de la infancia.',
          '- Principios rectores: interés superior del menor, no discriminación.',
          '- Responsabilidad de las entidades y obligaciones del personal.',
          '- Concepto de violencia infantil: tipos y formas.',
          '',
          'Periodicidad: Inicial (nuevas incorporaciones)',
          'Duración: 2 horas',
          'Modalidad: Online (plataforma Custodia360)',
          'Responsable: Equipo formativo Custodia360',
          '',
          '---',
          '',
          '**MÓDULO 2: Protocolos de Actuación**',
          '',
          'Contenido:',
          '- Código de Conducta de la entidad.',
          '- Protocolo de Detección y Notificación.',
          '- Protocolo de Actuación Urgente.',
          '- Coordinación con Servicios Sociales y autoridades.',
          '- Casos prácticos y simulaciones.',
          '',
          'Periodicidad: Anual',
          'Duración: 3 horas',
          'Modalidad: Presencial / Semipresencial',
          'Responsable: Responsable de Protección de la entidad',
          '',
          '---',
          '',
          '**MÓDULO 3: Detección de Señales de Riesgo**',
          '',
          'Contenido:',
          '- Indicadores físicos, conductuales y emocionales.',
          '- Detección en entornos digitales: ciberacoso, grooming.',
          '- Escucha activa y comunicación con menores.',
          '- Registro objetivo de observaciones.',
          '- Errores comunes y cómo evitarlos.',
          '',
          'Periodicidad: Anual',
          'Duración: 3 horas',
          'Modalidad: Online + Taller práctico',
          'Responsable: Custodia360 + Responsable de Protección',
          '',
          '---',
          '',
          '**MÓDULO 4: Prevención Digital y Ciberacoso**',
          '',
          'Contenido:',
          '- Riesgos en redes sociales y plataformas digitales.',
          '- Grooming, sexting y ciberacoso entre menores.',
          '- Uso seguro de dispositivos y comunicaciones.',
          '- Protocolos de comunicación digital institucional.',
          '- Consentimiento informado para uso de imágenes.',
          '',
          'Periodicidad: Bienal',
          'Duración: 2 horas',
          'Modalidad: Online',
          'Responsable: Custodia360',
          '',
          '---',
          '',
          '**MÓDULO 5: Revisión de Casos y Lecciones Aprendidas**',
          '',
          'Contenido:',
          '- Análisis de incidentes gestionados (sin identificación de menores).',
          '- Evaluación de la aplicación de protocolos.',
          '- Mejoras identificadas y acciones implementadas.',
          '- Actualización de procedimientos.',
          '',
          'Periodicidad: Anual',
          'Duración: 1 hora',
          'Modalidad: Reunión interna',
          'Responsable: Responsable de Protección'
        ]
      },
      {
        titulo: '4. Calendario Anual',
        contenido: [
          '**Trimestre 1 (Enero - Marzo):**',
          '- Formación inicial para nuevas incorporaciones (continua).',
          '- Módulo 1: Introducción LOPIVI (nuevos).',
          '',
          '**Trimestre 2 (Abril - Junio):**',
          '- Módulo 2: Protocolos de Actuación (todo el personal).',
          '- Simulacros de actuación urgente.',
          '',
          '**Trimestre 3 (Julio - Septiembre):**',
          '- Módulo 3: Detección de Señales de Riesgo (todo el personal).',
          '- Talleres prácticos de comunicación con menores.',
          '',
          '**Trimestre 4 (Octubre - Diciembre):**',
          '- Módulo 5: Revisión de Casos y Lecciones Aprendidas.',
          '- Evaluación final y certificaciones.',
          '- Planificación del siguiente año formativo.',
          '',
          '**Formación bienal (años impares):**',
          '- Módulo 4: Prevención Digital y Ciberacoso.'
        ]
      },
      {
        titulo: '5. Metodología',
        contenido: [
          '**Formación online:**',
          '- Acceso a plataforma Custodia360 24/7.',
          '- Vídeos explicativos, documentación descargable.',
          '- Autoevaluaciones automáticas.',
          '- Certificado digital automático.',
          '',
          '**Formación presencial:**',
          '- Talleres prácticos con casos reales.',
          '- Simulaciones y role-playing.',
          '- Debate y resolución de dudas.',
          '- Evaluación presencial.',
          '',
          '**Formación semipresencial:**',
          '- Combinación de módulos online + sesiones presenciales.',
          '- Flexibilidad horaria.',
          '- Evaluación mixta.'
        ]
      },
      {
        titulo: '6. Evaluación y Certificación',
        contenido: [
          '**Criterios de evaluación:**',
          '- Asistencia obligatoria al 90% de las sesiones.',
          '- Superación de cuestionarios con mínimo 80% de aciertos.',
          '- Participación activa en talleres prácticos.',
          '',
          '**Certificación:**',
          '- Certificado individual emitido por Custodia360.',
          '- Registro digital de formaciones completadas.',
          '- Validez: Según periodicidad del módulo.',
          '- Conservación: Durante relación laboral + 5 años.',
          '',
          '**Control de cumplimiento:**',
          'Custodia360 genera alertas automáticas para:',
          '- Formaciones próximas a vencer.',
          '- Personal sin formación inicial.',
          '- Certificados caducados.',
          '- Nuevas incorporaciones pendientes de formar.'
        ]
      },
      {
        titulo: '7. Seguimiento y Mejora',
        contenido: [
          '**Indicadores de cumplimiento:**',
          '',
          '- % Personal formado en LOPIVI: Objetivo 100%',
          '- Horas formativas totales/año: Mínimo 8h por persona',
          '- Satisfacción con la formación: Objetivo >90%',
          '- Tasa de aprobación en evaluaciones: Objetivo >95%',
          '',
          '**Evaluación del plan:**',
          '- Encuestas de satisfacción tras cada módulo.',
          '- Revisión anual de resultados.',
          '- Ajuste de contenidos según necesidades detectadas.',
          '- Actualización ante cambios normativos.',
          '',
          '**Mejora continua:**',
          '- Incorporación de nuevas temáticas emergentes.',
          '- Actualización de casos prácticos.',
          '- Adaptación a feedback del personal.',
          '- Integración de buenas prácticas externas.'
        ]
      },
      {
        titulo: 'Conclusión',
        contenido: [
          'Este Plan Anual de Formación garantiza que todo el personal de la entidad esté capacitado para prevenir, detectar y actuar ante situaciones de riesgo para menores.',
          '',
          'La combinación de formación online y presencial, evaluaciones continuas y certificaciones digitales asegura el cumplimiento normativo y la creación de una cultura organizativa de protección infantil.',
          '',
          'Custodia360 facilita la gestión completa del plan mediante su plataforma automatizada, reduciendo la carga administrativa y garantizando trazabilidad total.',
          '',
          '---',
          '',
          'Para más información:',
          'www.custodia360.es',
          'info@custodia360.es'
        ]
      }
    ]
  },
  {
    filename: 'Ficha_Asistencia_Formacion',
    titulo: 'Ficha de Asistencia a Formación',
    subtitulo: 'Registro de participantes en sesiones formativas',
    version: '1.0',
    secciones: [
      {
        titulo: 'DATOS DE LA SESIÓN FORMATIVA',
        contenido: [
          'Curso / Taller: _________________________________________________________________',
          '',
          'Módulo formativo: ______________________________________________________________',
          '',
          'Fecha: ___________________________ Horario: De _______ a _______',
          '',
          'Lugar: _________________________________________________________________________',
          '',
          'Modalidad:  ☐ Presencial  ☐ Online  ☐ Semipresencial',
          '',
          'Formador/a: ____________________________________________________________________',
          '',
          'Entidad organizadora: ___________________________________________________________',
          '',
          'Duración total: _________ horas'
        ]
      },
      {
        titulo: 'REGISTRO DE ASISTENTES',
        contenido: [
          '| Nº | Nombre y Apellidos | DNI/NIE | Cargo / Función | Firma | Hora entrada | Hora salida |',
          '|----|--------------------|---------|-----------------|-------|--------------|-------------|',
          '| 01 | | | | | | |',
          '| 02 | | | | | | |',
          '| 03 | | | | | | |',
          '| 04 | | | | | | |',
          '| 05 | | | | | | |',
          '| 06 | | | | | | |',
          '| 07 | | | | | | |',
          '| 08 | | | | | | |',
          '| 09 | | | | | | |',
          '| 10 | | | | | | |',
          '| 11 | | | | | | |',
          '| 12 | | | | | | |',
          '| 13 | | | | | | |',
          '| 14 | | | | | | |',
          '| 15 | | | | | | |',
          '',
          '[Añadir filas adicionales si es necesario]'
        ]
      },
      {
        titulo: 'OBSERVACIONES',
        contenido: [
          'Incidencias o comentarios relevantes:',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          'Temas tratados (resumen):',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          'Material entregado:',
          '',
          '☐ Temario impreso',
          '☐ Acceso a plataforma online',
          '☐ Certificado de asistencia',
          '☐ Otros: __________________________________________________________________'
        ]
      },
      {
        titulo: 'VALIDACIÓN',
        contenido: [
          'Responsable de la sesión:',
          '',
          'Nombre: ____________________________________________________________________',
          '',
          'Firma: ______________________________________  Fecha: _____________________',
          '',
          '',
          'Responsable de Protección / Coordinador de Formación:',
          '',
          'Nombre: ____________________________________________________________________',
          '',
          'Firma: ______________________________________  Fecha: _____________________',
          '',
          '',
          '⚠️ **IMPORTANTE:**',
          '',
          '- Conservar esta ficha escaneada o en formato físico durante 5 años mínimo.',
          '- Registrar digitalmente en la plataforma Custodia360 para trazabilidad.',
          '- Enviar copia a RRHH y al Responsable de Protección.',
          '- Esta ficha es evidencia de cumplimiento de la obligación formativa LOPIVI.'
        ]
      }
    ]
  },
  {
    filename: 'Temario_Base_Formacion_LOPIVI',
    titulo: 'Temario Base de Formación LOPIVI',
    subtitulo: 'Contenidos formativos esenciales para el personal',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Introducción al Marco Legal',
        contenido: [
          '**1.1. Contexto normativo**',
          '',
          '- Ley Orgánica 8/2021 de Protección Integral a la Infancia y Adolescencia frente a la Violencia (LOPIVI).',
          '- Normativa autonómica específica de protección de menores.',
          '- Convención sobre los Derechos del Niño (ONU, 1989).',
          '- Reglamento General de Protección de Datos (RGPD).',
          '- Código Penal: delitos contra menores.',
          '',
          '**1.2. Principios rectores**',
          '',
          '- Interés superior del menor.',
          '- Igualdad y no discriminación.',
          '- Derecho a ser oído y participar.',
          '- Protección contra toda forma de violencia.',
          '- Prevención y diligencia debida.',
          '',
          '**1.3. Responsabilidad de las entidades**',
          '',
          '- Obligaciones legales: Plan de Protección, protocolos, formación.',
          '- Designación de Responsable de Protección.',
          '- Deber de comunicación de sospechas.',
          '- Consecuencias del incumplimiento.',
          '',
          '**1.4. Responsabilidad individual del personal**',
          '',
          '- Deber de conocer y aplicar el Código de Conducta.',
          '- Obligación de notificar preocupaciones.',
          '- Confidencialidad y respeto.',
          '- Prohibiciones expresas (comunicación privada, favoritismos, etc.).'
        ]
      },
      {
        titulo: '2. Prevención: Creación de Entornos Seguros',
        contenido: [
          '**2.1. Diseño de espacios físicos seguros**',
          '',
          '- Visibilidad adecuada en todas las áreas.',
          '- Iluminación suficiente.',
          '- Separación por grupos de edad cuando proceda.',
          '- Zonas de privacidad controladas (vestuarios, baños).',
          '',
          '**2.2. Ratios y supervisión**',
          '',
          '- Ratios recomendadas por edad:',
          '  · Menores de 3 años: 1 adulto / 4-6 menores',
          '  · 3-6 años: 1 adulto / 8-10 menores',
          '  · 6-12 años: 1 adulto / 10-15 menores',
          '  · Mayores de 12 años: 1 adulto / 15-20 menores',
          '- Supervisión visible y constante.',
          '- Prohibición de situaciones 1:1 sin visibilidad.',
          '',
          '**2.3. Código de Conducta**',
          '',
          '- Trato respetuoso y profesional.',
          '- Límites apropiados en el contacto físico.',
          '- Prohibición de lenguaje o conductas inapropiadas.',
          '- Evitar favoritismos o exclusiones.',
          '- Mantener distancia emocional profesional.',
          '',
          '**2.4. Comunicación digital segura**',
          '',
          '- Uso exclusivo de canales institucionales.',
          '- Prohibición de comunicaciones privadas no registradas.',
          '- Consentimiento informado para uso de imágenes.',
          '- Protocolo de publicación en redes sociales.',
          '',
          '**2.5. Selección segura de personal**',
          '',
          '- Certificado negativo de delitos sexuales obligatorio.',
          '- Verificación de referencias profesionales.',
          '- Entrevistas específicas sobre protección infantil.',
          '- Periodo de prueba supervisado.'
        ]
      },
      {
        titulo: '3. Detección de Señales de Riesgo',
        contenido: [
          '**3.1. Indicadores físicos**',
          '',
          '- Lesiones inexplicadas o inconsistentes.',
          '- Marcas compatibles con maltrato.',
          '- Descuido en higiene personal.',
          '- Signos de desnutrición o fatiga crónica.',
          '- Lesiones en zonas no habituales (interior muslos, espalda).',
          '',
          '**3.2. Indicadores conductuales**',
          '',
          '- Cambios significativos de comportamiento.',
          '- Miedo o rechazo a personas específicas.',
          '- Conductas regresivas (enuresis, chuparse el dedo).',
          '- Conocimientos o conductas sexuales inadecuados para la edad.',
          '- Aislamiento social repentino.',
          '- Agresividad o apatía extrema.',
          '',
          '**3.3. Indicadores emocionales**',
          '',
          '- Ansiedad o tristeza persistentes.',
          '- Baja autoestima o sentimientos de culpa.',
          '- Dificultades de concentración.',
          '- Trastornos del sueño o alimentación.',
          '- Ideación autolítica o autolesiones.',
          '',
          '**3.4. Indicadores de ciberacoso**',
          '',
          '- Cambios en el uso de dispositivos (evitarlos o usarlos compulsivamente).',
          '- Secretismo con la actividad online.',
          '- Reacciones emocionales intensas al usar dispositivos.',
          '- Recepción de mensajes hostiles o inapropiados.',
          '- Aislamiento de actividades sociales.',
          '',
          '**3.5. Relatos y comunicaciones**',
          '',
          '- Revelaciones directas o indirectas.',
          '- Relatos incongruentes o contradictorios.',
          '- Expresiones de malestar sin causa aparente.',
          '- Dibujos o escritos preocupantes.',
          '',
          '**3.6. Errores comunes en la detección**',
          '',
          '- Minimizar señales por ser el menor "conflictivo".',
          '- Esperar evidencias absolutas antes de actuar.',
          '- Confundir detección con investigación (no corresponde al personal).',
          '- No documentar observaciones objetivamente.',
          '- Interrogar al menor repetidamente.'
        ]
      },
      {
        titulo: '4. Notificación Interna',
        contenido: [
          '**4.1. Principios de la notificación**',
          '',
          '- Inmediatez: Notificar en cuanto se detecta.',
          '- Confidencialidad: Solo personas autorizadas.',
          '- Objetividad: Hechos, no interpretaciones.',
          '- No revictimización: Una sola conversación con el menor.',
          '- Presunción de buena fe: Protección del notificante.',
          '',
          '**4.2. Canal de comunicación**',
          '',
          '- Formulario de Comunicación de Preocupación.',
          '- Plataforma digital Custodia360.',
          '- Contacto directo con Responsable de Protección.',
          '- En riesgo grave: Comunicación verbal inmediata + registro posterior.',
          '',
          '**4.3. Información a incluir**',
          '',
          '- Datos del notificante.',
          '- Datos básicos del menor (sin exceso de detalle).',
          '- Descripción objetiva de hechos observados.',
          '- Fecha, hora y lugar.',
          '- Testigos presentes.',
          '- Palabras textuales del menor (si las hubo).',
          '- Acciones inmediatas tomadas.',
          '',
          '**4.4. Qué NO hacer**',
          '',
          '- Investigar por cuenta propia.',
          '- Confrontar al presunto agresor.',
          '- Comunicar a terceros no autorizados.',
          '- Prometer al menor confidencialidad absoluta.',
          '- Esperar confirmación antes de notificar.',
          '',
          '**4.5. Protección del notificante**',
          '',
          '- Garantía de no represalias.',
          '- Confidencialidad de su identidad (cuando sea posible).',
          '- Apoyo institucional.',
          '- Reconocimiento de su actuación responsable.'
        ]
      },
      {
        titulo: '5. Actuación ante Situaciones de Riesgo',
        contenido: [
          '**5.1. Protocolo de Actuación Urgente**',
          '',
          '- Garantizar seguridad inmediata del menor.',
          '- Alertar a servicios de emergencia (112) si procede.',
          '- Informar al Responsable de Protección.',
          '- Preservar evidencias.',
          '- No interrogar al menor.',
          '- Registrar todo en tiempo real.',
          '',
          '**5.2. Coordinación con servicios externos**',
          '',
          '- Servicios Sociales del municipio.',
          '- Fuerzas y Cuerpos de Seguridad del Estado.',
          '- Fiscalía de Menores.',
          '- Servicios sanitarios.',
          '',
          '**5.3. Comunicación a familias**',
          '',
          '- Coordinar con Responsable de Protección.',
          '- Seguir indicaciones de autoridades si están involucradas.',
          '- Informar con sensibilidad y profesionalidad.',
          '- No comunicar si la familia está implicada en el riesgo.',
          '',
          '**5.4. Seguimiento del caso**',
          '',
          '- Plan de acompañamiento personalizado.',
          '- Coordinación con servicios especializados.',
          '- Revisión periódica del bienestar del menor.',
          '- Registro completo en Custodia360.'
        ]
      },
      {
        titulo: '6. Participación Infantil y Clima Seguro',
        contenido: [
          '**6.1. Derecho a ser oído**',
          '',
          '- Escucha activa adaptada a la edad.',
          '- Espacios seguros de expresión.',
          '- Participación en decisiones que les afectan.',
          '- Respeto a sus opiniones.',
          '',
          '**6.2. Comunicación efectiva con menores**',
          '',
          '- Lenguaje adaptado a la edad y madurez.',
          '- Preguntas abiertas, no sugestivas.',
          '- Paciencia y empatía.',
          '- Validación de sus emociones.',
          '',
          '**6.3. Creación de un clima de confianza**',
          '',
          '- Mostrar disponibilidad y cercanía profesional.',
          '- Normalizar hablar sobre preocupaciones.',
          '- Educar en derechos y límites apropiados.',
          '- Fomentar la denuncia sin miedo.',
          '',
          '**6.4. Actividades de sensibilización**',
          '',
          '- Talleres adaptados por edad sobre buen trato.',
          '- Campañas de concienciación en la entidad.',
          '- Difusión de canales seguros de comunicación.',
          '- Celebración del Día de los Derechos del Niño.'
        ]
      },
      {
        titulo: '7. Evaluación de Conocimientos',
        contenido: [
          'Al finalizar la formación, se realizará una evaluación que incluye:',
          '',
          '**Cuestionario teórico:**',
          '- Preguntas sobre marco legal LOPIVI.',
          '- Protocolos de actuación.',
          '- Detección de señales de riesgo.',
          '- Notificación interna.',
          '',
          '**Simulaciones prácticas:**',
          '- Casos hipotéticos de situaciones de riesgo.',
          '- Role-playing de comunicación con menores.',
          '- Aplicación de protocolos en escenarios reales.',
          '',
          '**Criterio de aprobación:**',
          '- Mínimo 80% de respuestas correctas en cuestionario.',
          '- Participación activa en simulaciones.',
          '- Asistencia al 90% de la formación.',
          '',
          '**Certificación:**',
          '- Certificado digital emitido por Custodia360.',
          '- Validez según periodicidad del módulo.',
          '- Registro permanente en expediente del personal.'
        ]
      },
      {
        titulo: 'Conclusión',
        contenido: [
          'Este temario proporciona los conocimientos esenciales para que todo el personal pueda prevenir, detectar y actuar de forma eficaz ante situaciones de riesgo para menores.',
          '',
          'La formación debe ser práctica, adaptada al contexto de la entidad y actualizada periódicamente.',
          '',
          'Custodia360 ofrece contenidos formativos completos, evaluaciones automáticas y certificación digital para facilitar el cumplimiento de la obligación formativa LOPIVI.',
          '',
          '---',
          '',
          'Para más información:',
          'www.custodia360.es',
          'info@custodia360.es'
        ]
      }
    ]
  },
  {
    filename: 'Cuestionario_Evaluacion_Personal',
    titulo: 'Cuestionario de Evaluación del Personal Formado',
    subtitulo: 'Prueba de conocimientos LOPIVI',
    version: '1.0',
    secciones: [
      {
        titulo: 'Instrucciones',
        contenido: [
          'Este cuestionario evalúa los conocimientos adquiridos en la formación LOPIVI.',
          '',
          '**Formato:**',
          '- 20 preguntas de opción múltiple.',
          '- Solo una respuesta correcta por pregunta.',
          '- Criterio de aprobación: 80% de aciertos (mínimo 16 respuestas correctas).',
          '',
          '**Tiempo:**',
          '- Máximo 30 minutos.',
          '',
          '**Indicaciones:**',
          '- Marque con claridad la respuesta elegida.',
          '- No se permite consultar material durante la prueba.',
          '- En caso de duda, marque la opción más apropiada según su criterio.',
          '',
          '**Identificación del evaluado:**',
          '',
          'Nombre y apellidos: _____________________________________________________________',
          '',
          'Cargo / Función: ________________________________________________________________',
          '',
          'Fecha: _________________________',
          '',
          'Curso realizado: ________________________________________________________________'
        ]
      },
      {
        titulo: 'Preguntas',
        contenido: [
          '**1. ¿Cuál es el principio fundamental de la LOPIVI?**',
          '',
          'A) El interés superior del menor',
          'B) La confidencialidad administrativa',
          'C) La participación de los padres',
          'D) La eficiencia en la gestión',
          '',
          '✅ Respuesta correcta: A',
          '',
          '---',
          '',
          '**2. ¿Qué debe hacer un trabajador ante una sospecha fundada de maltrato?**',
          '',
          'A) Esperar confirmación del responsable directo',
          'B) Notificar inmediatamente al Responsable de Protección',
          'C) Informar solo a la familia',
          'D) Investigar por cuenta propia',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**3. ¿Qué canal debe utilizarse para comunicar una preocupación?**',
          '',
          'A) Redes sociales',
          'B) Canal seguro Custodia360 o Formulario oficial',
          'C) Grupo de WhatsApp interno',
          'D) Email personal',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**4. ¿Cada cuánto debe revisarse el Plan de Protección?**',
          '',
          'A) Cada 5 años',
          'B) Anualmente o tras incidentes relevantes',
          'C) Solo cuando la ley cambie',
          'D) No es necesario revisarlo',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**5. ¿Qué documento acredita que el personal ha recibido formación LOPIVI?**',
          '',
          'A) Certificado de formación Custodia360 o equivalente',
          'B) Contrato laboral',
          'C) Nómina mensual',
          'D) No es necesario acreditar',
          '',
          '✅ Respuesta correcta: A',
          '',
          '---',
          '',
          '**6. ¿Cuál de los siguientes es un indicador de maltrato físico?**',
          '',
          'A) Llegar tarde ocasionalmente',
          'B) Lesiones inexplicadas o inconsistentes',
          'C) Ser tímido',
          'D) Preferir actividades individuales',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**7. ¿Qué significa "interés superior del menor"?**',
          '',
          'A) Que las decisiones deben priorizar el bienestar del menor',
          'B) Que los padres siempre deciden',
          'C) Que la entidad elige lo más económico',
          'D) Que el menor siempre elige',
          '',
          '✅ Respuesta correcta: A',
          '',
          '---',
          '',
          '**8. ¿Está permitido mantener comunicaciones privadas con menores por WhatsApp?**',
          '',
          'A) Sí, siempre que sea educativo',
          'B) No, salvo canal institucional y registrado',
          'C) Solo con autorización de los padres',
          'D) Sí, si es fuera del horario laboral',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**9. ¿Qué es el grooming?**',
          '',
          'A) Cuidado de la higiene personal',
          'B) Acoso sexual a menores por medios digitales',
          'C) Actividad deportiva',
          'D) Formación online',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**10. ¿Quién es el Responsable de Protección en la entidad?**',
          '',
          'A) El director general',
          'B) La persona designada formalmente para coordinar la protección',
          'C) Cualquier trabajador',
          'D) Un servicio externo',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**11. ¿Qué debe incluirse en una notificación de preocupación?**',
          '',
          'A) Opiniones personales sobre el caso',
          'B) Descripción objetiva de hechos observados',
          'C) Conclusiones de culpabilidad',
          'D) Hipótesis sin fundamento',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**12. ¿Cuándo se debe contactar con el 112?**',
          '',
          'A) Solo si el menor está inconsciente',
          'B) Ante riesgo inminente para la vida o salud',
          'C) Nunca, solo con Servicios Sociales',
          'D) Solo en horario laboral',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**13. ¿Qué es el Código de Conducta?**',
          '',
          'A) Normativa laboral general',
          'B) Normas de comportamiento ético con menores',
          'C) Manual de estilo corporativo',
          'D) Reglamento de instalaciones',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**14. ¿Qué se debe hacer si un menor revela un abuso?**',
          '',
          'A) Prometer confidencialidad absoluta',
          'B) Escuchar con empatía y notificar al Responsable',
          'C) Confrontar al presunto agresor',
          'D) Pedir al menor que lo repita ante testigos',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**15. ¿Es obligatorio tener el certificado negativo de delitos sexuales?**',
          '',
          'A) Solo para personal con contrato indefinido',
          'B) Sí, para todo el personal con contacto con menores',
          'C) No es obligatorio',
          'D) Solo si trabaja en verano',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**16. ¿Qué ratios son recomendables para menores de 3 años?**',
          '',
          'A) 1 adulto / 20 menores',
          'B) 1 adulto / 4-6 menores',
          'C) 1 adulto / 15 menores',
          'D) No hay ratio establecida',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**17. ¿Qué debe hacerse con las evidencias de un posible maltrato?**',
          '',
          'A) Limpiarlas para evitar infecciones',
          'B) Preservarlas sin manipular',
          'C) Fotografiarlas y desecharlas',
          'D) Entregarlas a la familia',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**18. ¿Qué es el ciberacoso?**',
          '',
          'A) Uso excesivo de internet',
          'B) Acoso a través de medios digitales',
          'C) Instalación de antivirus',
          'D) Formación online',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**19. ¿Con qué frecuencia debe formarse el personal en LOPIVI?**',
          '',
          'A) Una sola vez al inicio',
          'B) Anualmente o según periodicidad de módulos',
          'C) Cada 10 años',
          'D) No es obligatorio formarse',
          '',
          '✅ Respuesta correcta: B',
          '',
          '---',
          '',
          '**20. ¿Qué debe hacer si observa a un compañero con conducta inapropiada hacia un menor?**',
          '',
          'A) Ignorarlo si no está seguro',
          'B) Notificarlo inmediatamente al Responsable de Protección',
          'C) Comentarlo con otros compañeros',
          'D) Esperar a que se repita',
          '',
          '✅ Respuesta correcta: B'
        ]
      },
      {
        titulo: 'Resultados',
        contenido: [
          '**Puntuación obtenida:** ________ / 20',
          '',
          '**Porcentaje de aciertos:** ________ %',
          '',
          '**Resultado:**',
          '',
          '☐ APTO (≥ 80% de aciertos)',
          '☐ NO APTO (< 80% de aciertos)',
          '',
          '**Observaciones:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Firma del evaluador:**',
          '',
          'Nombre: ____________________________________________________________________',
          '',
          'Firma: ______________________________________  Fecha: _____________________',
          '',
          '',
          '**Firma del evaluado:**',
          '',
          'Firma: ______________________________________  Fecha: _____________________',
          '',
          '',
          '⚠️ **En caso de NO APTO:**',
          '- Refuerzo formativo obligatorio.',
          '- Nueva evaluación en un plazo máximo de 30 días.',
          '- Supervisión reforzada durante el periodo de refuerzo.'
        ]
      }
    ]
  },
  {
    filename: 'Poster_Infografia_LOPIVI',
    titulo: 'Póster Informativo: Entornos Seguros para la Infancia',
    subtitulo: 'Infografía LOPIVI para sensibilización',
    version: '1.0',
    secciones: [
      {
        titulo: 'Título Principal',
        contenido: [
          '🛡️ ENTORNOS SEGUROS PARA LA INFANCIA',
          '',
          'Todos somos responsables de proteger a los menores',
          '',
          '---',
          '',
          'Custodia360 — Sistema de Cumplimiento LOPIVI'
        ]
      },
      {
        titulo: '1. Principios de la LOPIVI',
        contenido: [
          '✅ Interés superior del menor',
          '✅ Igualdad y no discriminación',
          '✅ Derecho a ser oído',
          '✅ Protección contra toda violencia',
          '✅ Prevención y diligencia debida'
        ]
      },
      {
        titulo: '2. Señales de Alerta — Cómo Detectar',
        contenido: [
          '🔴 Cambios bruscos de comportamiento',
          '🔴 Lesiones inexplicadas',
          '🔴 Miedo a personas específicas',
          '🔴 Aislamiento social repentino',
          '🔴 Conocimientos sexuales inadecuados para su edad',
          '🔴 Conductas regresivas (enuresis, chuparse el dedo)',
          '🔴 Ansiedad, tristeza o baja autoestima',
          '🔴 Cambios en el uso de dispositivos digitales'
        ]
      },
      {
        titulo: '3. Qué Hacer ante una Sospecha',
        contenido: [
          '1️⃣ ESCUCHA con empatía y sin juzgar',
          '',
          '2️⃣ CREE al menor — Valida su relato',
          '',
          '3️⃣ TRANQUILIZA — No es culpa del menor',
          '',
          '4️⃣ NOTIFICA inmediatamente al Responsable de Protección',
          '',
          '5️⃣ REGISTRA los hechos de forma objetiva',
          '',
          '⚠️ NO INTERROGUES al menor repetidamente',
          '⚠️ NO PROMETAS confidencialidad absoluta',
          '⚠️ NO INVESTIGUES por cuenta propia'
        ]
      },
      {
        titulo: '4. Canales Seguros de Comunicación',
        contenido: [
          '📞 Responsable de Protección: [Teléfono de la entidad]',
          '',
          '📧 Email seguro: proteccion@[entidad].es',
          '',
          '💻 Plataforma Custodia360: [URL o QR]',
          '',
          '📝 Formulario de Comunicación de Preocupación',
          '',
          '🚨 Emergencias: 112',
          '🚨 Teléfono del Menor: 116 111',
          '🚨 Servicios Sociales: [Teléfono local]'
        ]
      },
      {
        titulo: '5. Mensaje Final',
        contenido: [
          '💬 "HABLAR ES PROTEGER"',
          '',
          'Si tienes dudas o preocupaciones,',
          'COMUNÍCALO.',
          '',
          'Ninguna sospecha es demasiado pequeña.',
          '',
          'Tu actuación puede salvar a un menor.',
          '',
          '---',
          '',
          'www.custodia360.es',
          'info@custodia360.es',
          'Tel: 678 771 198'
        ]
      },
      {
        titulo: 'Diseño Visual (Recomendaciones)',
        contenido: [
          '**Formato:** A3 vertical (297 × 420 mm)',
          '',
          '**Colores corporativos Custodia360:**',
          '- Azul principal: #2563EB',
          '- Gris oscuro: #1F2937',
          '- Blanco: #FFFFFF',
          '- Acentos: Verde #10B981, Rojo #EF4444',
          '',
          '**Iconografía:**',
          '- Escudo de protección',
          '- Manos protegiendo',
          '- Niños felices en entorno seguro',
          '- Señales de alerta (iconos simples)',
          '- Teléfono / email (canales)',
          '',
          '**Tipografía:**',
          '- Títulos: Inter Bold, tamaño grande',
          '- Textos: Inter Regular, legible a distancia',
          '',
          '**QR Code:**',
          '- Incluir QR que dirija a canal seguro online de la entidad',
          '- Ubicación: Esquina inferior derecha',
          '',
          '**Distribución:**',
          '- Imprimir en alta calidad',
          '- Colocar en zonas visibles: recepción, pasillos, vestuarios',
          '- Actualizar anualmente',
          '',
          '**Versión digital:**',
          '- PDF descargable desde web de la entidad',
          '- Compartible en redes sociales (adaptado)',
          '- Proyectable en pantallas digitales'
        ]
      }
    ]
  }
]

export async function POST() {
  try {
    console.log('🎓 Generando Bloque 06: Formación y Concienciación (PDF + DOCX)...')

    const documentos = []

    // Generar cada uno de los 5 documentos
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

      const pdfPath = `plantillas/06_Formacion_y_Concienciacion/${config.filename}.pdf`
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

      const docxPath = `plantillas/06_Formacion_y_Concienciacion/${config.filename}.docx`
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

    console.log('✅ Todos los documentos del Bloque 06 generados')

    // Enviar email de confirmación
    console.log('📧 Enviando email de confirmación...')

    const emailHtml = `
      <h2>Bloque 06 — Formación y Concienciación Custodia360 creado correctamente</h2>
      <p>Se han generado y publicado correctamente los siguientes documentos formativos en el panel de administración Custodia360:</p>
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Documento</th>
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
      <p><strong>Carpeta:</strong> <code>/docs/plantillas/06_Formacion_y_Concienciacion/</code></p>
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
        subject: 'Bloque 06 — Formación y Concienciación Custodia360 creado correctamente',
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
