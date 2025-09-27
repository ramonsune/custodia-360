'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ModuloProgreso {
  id: number
  titulo: string
  descripcion: string
  contenido: string[]
  ejemplosPracticos?: string[]
  archivosDescarga?: { nombre: string; url: string; tipo: string }[]
  completado: boolean
  bloqueado: boolean
  progreso: number // 0-100
  tiempoEstimado: string
}

export default function CampusVirtualPage() {
  const [modulosProgreso, setModulosProgreso] = useState<ModuloProgreso[]>([
    {
      id: 1,
      titulo: 'Fundamentos de la LOPIVI',
      descripcion: 'Conceptos básicos de la Ley Orgánica de Protección Integral a la Infancia y la Adolescencia',
      contenido: [
        'Marco Legal de la LOPIVI',
        'La Ley Orgánica 8/2021 de protección integral a la infancia y la adolescencia frente a la violencia establece un marco jurídico completo para garantizar los derechos de menores. Esta ley representa un hito histórico en la protección de la infancia en España, unificando criterios y estableciendo un sistema integral de protección.',
        '',
        'Contexto Histórico de la LOPIVI:',
        'La LOPIVI surge como respuesta a la necesidad de unificar y fortalecer el sistema de protección de menores en España. Anteriormente, la protección infantil se regulaba de manera fragmentada a través de diferentes normativas. La nueva ley integra todas las medidas de protección en un único marco legal coherente y efectivo.',
        '',
        'La ley se fundamenta en los principios establecidos por la Convención sobre los Derechos del Niño de 1989, adaptándolos al contexto español actual. Incorpora las mejores prácticas internacionales en protección infantil y establece estándares mínimos que todas las entidades deben cumplir.',
        '',
        'Objetivos Principales:',
        '• Garantizar los derechos fundamentales de la infancia y adolescencia en todos los ámbitos de la vida',
        '• Prevenir la violencia sobre los menores en todos los ámbitos: familiar, escolar, deportivo, digital',
        '• Sensibilizar y formar a la sociedad en la protección de menores, creando una cultura de protección',
        '• Detectar precozmente la violencia sobre la infancia mediante sistemas eficaces de detección',
        '• Favorecer la recuperación integral de los menores víctimas de violencia',
        '• Establecer mecanismos de coordinación entre todas las administraciones públicas',
        '• Promover la participación activa de los menores en las decisiones que les afecten',
        '',
        'Principios Fundamentales:',
        '• Interés superior del menor como principio rector de todas las actuaciones',
        '• Respeto a los derechos y libertades fundamentales de los menores',
        '• Promoción, prevención y sensibilización como medidas prioritarias',
        '• Detección precoz mediante la formación de profesionales y la sociedad',
        '• Intervención inmediata y eficaz cuando se detecten situaciones de riesgo',
        '• Asistencia y protección integral que abarque todos los aspectos de la vida del menor',
        '• Participación del menor en las actuaciones, respetando su capacidad y madurez',
        '• Coordinación de las administraciones públicas para evitar duplicidades y vacíos',
        '• Transversalidad de las políticas de protección en todos los sectores',
        '',
        'Aplicación en Entidades Deportivas:',
        'Las entidades deportivas tienen un papel crucial en la protección de menores, ya que muchos niños y adolescentes pasan gran parte de su tiempo libre en instalaciones deportivas.',
        '',
        '• Todas las entidades que trabajen con menores deben cumplir la LOPIVI sin excepción',
        '• Obligación de tener Delegado/a de Protección designado y formado específicamente',
        '• Implementación de protocolos específicos de actuación adaptados al entorno deportivo',
        '• Formación especializada del personal en contacto directo con menores',
        '• Canales de comunicación seguros para reportar incidencias',
        '• Verificación de antecedentes de todo el personal que trabaje con menores',
        '• Establecimiento de códigos de conducta claros y específicos',
        '• Creación de espacios seguros y supervisados en todas las instalaciones',
        '',
        'Responsabilidades Específicas del Sector Deportivo:',
        'El deporte presenta características únicas que requieren medidas específicas de protección:',
        '',
        '• Relaciones de autoridad entre entrenadores y deportistas menores',
        '• Contacto físico necesario para la enseñanza de técnicas deportivas',
        '• Viajes y concentraciones fuera del domicilio habitual',
        '• Uso de vestuarios y espacios de intimidad compartidos',
        '• Competitividad y presión por resultados que pueden generar situaciones de vulnerabilidad',
        '',
        'Datos Relevantes y Estadísticas:',
        '• En España, 1 de cada 4 menores ha sufrido algún tipo de violencia según estudios oficiales',
        '• El 85% de los casos de abuso sexual infantil ocurre en el entorno cercano al menor',
        '• Solo el 15% de los casos se denuncian, lo que indica la importancia de la detección precoz',
        '• La detección precoz reduce en un 70% las secuelas a largo plazo en las víctimas',
        '• El 60% de los casos de maltrato en entidades deportivas no se reportan por miedo a represalias',
        '• Los menores que practican deporte de manera regular tienen un 40% más de probabilidad de reportar situaciones de violencia cuando están en entornos seguros',
        '',
        'Impacto de la LOPIVI en el Deporte:',
        'La implementación de la LOPIVI en el ámbito deportivo ha generado cambios significativos:',
        '',
        '• Mayor concienciación entre entrenadores y directivos sobre la protección infantil',
        '• Implementación de protocolos específicos en federaciones y clubes',
        '• Aumento de las denuncias debido a la mejora en los canales de comunicación',
        '• Reducción de casos de maltrato gracias a las medidas preventivas',
        '• Mayor participación de las familias en la supervisión de las actividades deportivas'
      ],
      archivosDescarga: [
        { nombre: 'Ley_LOPIVI_Completa.pdf', url: '/docs/lopivi-completa.pdf', tipo: 'PDF' },
        { nombre: 'Resumen_Ejecutivo_LOPIVI.pdf', url: '/docs/resumen-lopivi.pdf', tipo: 'PDF' },
        { nombre: 'Infografia_Principios_LOPIVI.pdf', url: '/docs/infografia-lopivi.pdf', tipo: 'PDF' }
      ],
      completado: false,
      bloqueado: false,
      progreso: 0,
      tiempoEstimado: '45 min'
    },
    {
      id: 2,
      titulo: 'Marco Legal y Normativo Deportivo',
      descripcion: 'Aplicación específica de la LOPIVI en entidades deportivas y federaciones',
      contenido: [
        'LOPIVI en el Ámbito Deportivo',
        'Las entidades deportivas tienen responsabilidades específicas bajo la LOPIVI para proteger a los menores deportistas. El deporte representa un entorno de especial vulnerabilidad debido a las relaciones de poder, la competitividad y las características únicas de la práctica deportiva.',
        '',
        'Marco Normativo Específico para el Deporte:',
        'El sector deportivo se rige por una normativa específica que complementa la LOPIVI:',
        '',
        '• Real Decreto 1835/1991 sobre federaciones deportivas españolas y su papel en la protección',
        '• Ley 39/2022 del Deporte que incorpora explícitamente los principios LOPIVI',
        '• Código de Conducta del Comité Olímpico Español actualizado con medidas de protección',
        '• Directrices UEFA sobre protección de menores en el fútbol europeo',
        '• Protocolo FIFA de protección infantil aplicable a todas las federaciones nacionales',
        '• Reglamentos específicos de cada federación deportiva autonómica',
        '• Normativas municipales sobre el uso de instalaciones deportivas',
        '',
        'Análisis del Entorno Deportivo:',
        'El contexto deportivo presenta características únicas que requieren atención especial:',
        '',
        'Factores de Riesgo Específicos:',
        '• Relaciones jerárquicas marcadas entre entrenadores y deportistas',
        '• Dependencia emocional del menor hacia el entrenador',
        '• Presión competitiva que puede generar situaciones de abuso',
        '• Normalización del contacto físico en entrenamientos',
        '• Aislamiento del entorno familiar durante concentraciones',
        '• Cultura del sacrificio que puede enmascarar situaciones de maltrato',
        '',
        'Obligaciones Legales de los Clubes Deportivos:',
        'Los clubes deportivos deben cumplir con obligaciones específicas establecidas por la ley:',
        '',
        'Estructura Organizativa:',
        '• Designar Delegado/a de Protección principal con formación específica',
        '• Nombrar Delegado/a de Protección suplente para garantizar la continuidad',
        '• Crear un comité de protección cuando el club tenga más de 100 menores',
        '• Establecer líneas de responsabilidad claras en la estructura organizativa',
        '',
        'Políticas y Procedimientos:',
        '• Establecer protocolos de actuación ante situaciones de riesgo detallados y específicos',
        '• Desarrollar políticas de prevención adaptadas a cada deporte',
        '• Crear códigos de conducta para entrenadores, voluntarios y directivos',
        '• Implementar procedimientos de selección y verificación de personal',
        '',
        'Formación y Capacitación:',
        '• Formar a todo el personal en contacto directo e indirecto con menores',
        '• Proporcionar formación específica según el rol (entrenador, voluntario, directivo)',
        '• Actualizar la formación anualmente con nuevas metodologías',
        '• Evaluar la efectividad de la formación mediante pruebas específicas',
        '',
        'Comunicación y Transparencia:',
        '• Crear canales seguros y confidenciales de comunicación',
        '• Establecer sistemas de reporte anónimo para situaciones de riesgo',
        '• Mantener comunicación fluida y transparente con las familias',
        '• Informar regularmente sobre las medidas de protección implementadas',
        '',
        'Medidas Preventivas Obligatorias:',
        'Los clubes deben implementar medidas preventivas específicas:',
        '',
        'Política de Supervisión:',
        '• Política de "nunca a solas" - siempre mínimo 2 adultos con menores',
        '• Supervisión visual constante en todas las actividades',
        '• Registro de todas las actividades y personas presentes',
        '• Protocolos específicos para actividades fuera del horario habitual',
        '',
        'Gestión de Espacios:',
        '• Vestuarios con supervisión adecuada respetando la intimidad',
        '• Señalización clara de espacios seguros y restringidos',
        '• Control de acceso a instalaciones con menores',
        '• Mantenimiento de espacios bien iluminados y seguros',
        '',
        'Actividades Especiales:',
        '• Protocolos específicos para viajes y concentraciones',
        '• Autorización expresa de padres para actividades fuera del centro',
        '• Supervisión médica en competiciones y entrenamientos intensivos',
        '• Gestión segura del transporte de menores',
        '',
        'Situaciones de Especial Vigilancia:',
        'Existen situaciones que requieren atención y protocolos específicos:',
        '',
        'Entrenamientos y Competiciones:',
        '• Entrenamientos individuales con protocolos específicos de supervisión',
        '• Competiciones fuera del domicilio con acompañamiento adecuado',
        '• Entrenamientos en horarios especiales con medidas reforzadas',
        '• Actividades de alto rendimiento con supervisión psicológica',
        '',
        'Espacios de Intimidad:',
        '• Vestuarios y duchas con protocolos de supervisión específicos',
        '• Servicios médicos y fisioterapia con acompañamiento cuando sea necesario',
        '• Espacios de descanso en concentraciones con supervisión adecuada',
        '',
        'Interacciones Sociales:',
        '• Relaciones entre deportistas de diferentes edades supervisadas',
        '• Actividades sociales del club con protocolos específicos',
        '• Celebraciones y eventos con medidas de protección reforzadas',
        '',
        'Comunicación Digital Segura:',
        'La era digital requiere protocolos específicos para la comunicación:',
        '',
        'Políticas de Comunicación:',
        '• Prohibición absoluta de comunicación privada entrenador-menor fuera de canales oficiales',
        '• Uso exclusivo de canales oficiales del club para toda comunicación',
        '• Participación obligatoria de padres/tutores en grupos de comunicación',
        '• Política clara sobre el uso y compartición de fotos y vídeos',
        '',
        'Uso de Redes Sociales:',
        '• Prohibición de contacto directo entre personal y menores en redes sociales personales',
        '• Gestión de redes sociales oficiales por personal autorizado',
        '• Protocolos para el uso de imágenes de menores en redes sociales',
        '• Formación específica sobre los riesgos del uso inadecuado de redes sociales',
        '',
        'Verificación y Control:',
        'Los clubes deben implementar sistemas de verificación:',
        '',
        '• Verificación de antecedentes penales de todo el personal',
        '• Comprobación de referencias laborales anteriores',
        '• Evaluación psicológica para puestos de alta responsabilidad',
        '• Renovación periódica de todas las verificaciones'
      ],
      archivosDescarga: [
        { nombre: 'Marco_Legal_Deportivo.pdf', url: '/docs/marco-legal-deportivo.pdf', tipo: 'PDF' },
        { nombre: 'Obligaciones_Clubes_LOPIVI.pdf', url: '/docs/obligaciones-clubes.pdf', tipo: 'PDF' },
        { nombre: 'Checklist_Cumplimiento.xlsx', url: '/docs/checklist-cumplimiento.xlsx', tipo: 'Excel' }
      ],
      completado: false,
      bloqueado: true,
      progreso: 0,
      tiempoEstimado: '50 min'
    },
    {
      id: 3,
      titulo: 'Protocolos de Protección en Entidades Deportivas',
      descripcion: 'Procedimientos específicos de actuación y prevención en el ámbito deportivo',
      contenido: [
        'Protocolos de Actuación LOPIVI',
        'Procedimientos específicos para garantizar la protección de menores en entidades deportivas.',
        '',
        'Protocolo de Actuación ante Sospechas:',
        '1. Detección de indicadores de posible maltrato',
        '2. Documentación inmediata de la observación',
        '3. Comunicación al Delegado/a de Protección en 24h',
        '4. Evaluación inicial de la situación',
        '5. Activación del protocolo correspondiente',
        '6. Comunicación a autoridades si procede',
        '7. Seguimiento y apoyo al menor',
        '',
        'Protocolo de Primeros Auxilios Emocionales:',
        '• Mantener la calma y escuchar activamente',
        '• No juzgar ni cuestionar el relato del menor',
        '• Asegurar confidencialidad apropiada',
        '• No prometer guardar secretos sobre situaciones de riesgo',
        '• Proporcionar apoyo inmediato',
        '• Derivar a profesionales especializados',
        '',
        'Protocolos Específicos por Espacios:',
        '',
        'Vestuarios y Duchas:',
        '• Supervisión de adulto siempre presente',
        '• Respetar intimidad - no mirar directamente',
        '• Prohibido uso de móviles/cámaras',
        '• Separación por edades cuando sea necesario',
        '• Protocolo de limpieza y mantenimiento',
        '',
        'Viajes y Desplazamientos:',
        '• Autorización escrita de padres/tutores',
        '• Ratio mínimo de 1 adulto por cada 8 menores',
        '• Lista de contactos de emergencia',
        '• Protocolo de actuación en caso de accidente',
        '• Política de habitaciones en concentraciones',
        '',
        'Entrenamientos:',
        '• Registro de asistencia diario',
        '• Política de "nunca a solas"',
        '• Protocolo de lesiones',
        '• Comunicación con familias sobre evolución',
        '• Adaptación de entrenamientos por edades',
        '',
        'Protocolo de Comunicación de Crisis:',
        '• Comunicación inmediata a la dirección del club',
        '• Contacto con servicios sociales/policía si procede',
        '• Información a la familia (salvo casos específicos)',
        '• Comunicación interna controlada',
        '• Gestión de medios de comunicación si es necesario'
      ],
      archivosDescarga: [
        { nombre: 'Protocolos_Actuacion_Completos.pdf', url: '/docs/protocolos-actuacion.pdf', tipo: 'PDF' },
        { nombre: 'Formularios_Incidencias.pdf', url: '/docs/formularios-incidencias.pdf', tipo: 'PDF' },
        { nombre: 'Guia_Primeros_Auxilios_Emocionales.pdf', url: '/docs/primeros-auxilios-emocionales.pdf', tipo: 'PDF' }
      ],
      completado: false,
      bloqueado: true,
      progreso: 0,
      tiempoEstimado: '60 min'
    },
    {
      id: 4,
      titulo: 'Detección y Actuación ante Situaciones de Riesgo',
      descripción: 'Identificación de indicadores y respuesta inmediata ante situaciones de maltrato',
      contenido: [
        'Detección de Indicadores de Maltrato',
        'Señales físicas, emocionales y conductuales que pueden indicar situaciones de riesgo o maltrato.',
        '',
        'Indicadores Físicos:',
        '• Lesiones inexplicadas o inconsistentes con la explicación',
        '• Marcas de golpes, mordeduras, quemaduras',
        '• Lesiones en diferentes fases de curación',
        '• Negligencia en la higiene o cuidado personal',
        '• Fatiga constante o problemas de sueño',
        '• Problemas de alimentación (muy delgado o sobrepeso)',
        '',
        'Indicadores Emocionales:',
        '• Cambios bruscos de comportamiento',
        '• Miedo excesivo a ciertas personas o situaciones',
        '• Retraimiento social o aislamiento',
        '• Regresión a comportamientos infantiles',
        '• Conocimiento sexual inapropiado para la edad',
        '• Autoestima muy baja o autodesprecio',
        '• Síntomas de depresión o ansiedad',
        '',
        'Indicadores Conductuales:',
        '• Llegadas muy tempranas o salidas muy tardías',
        '• No querer ir a casa',
        '• Comportamiento agresivo o disruptivo',
        '• Dificultades de concentración',
        '• Bajo rendimiento deportivo repentino',
        '• Evitar actividades que antes disfrutaba',
        '• Problemas con figuras de autoridad',
        '',
        'Factores de Riesgo Específicos en Deporte:',
        '• Relación de poder desigual entrenador-deportista',
        '• Dependencia emocional del entrenador',
        '• Presión por resultados deportivos',
        '• Aislamiento del entorno familiar y social',
        '• Normalización de contacto físico',
        '• Cultura del sacrificio y dolor',
        '',
        'Actuación Inmediata:',
        '1. ESCUCHAR sin juzgar ni presionar',
        '2. CREER en lo que cuenta el menor',
        '3. AGRADECER la confianza depositada',
        '4. NO PROMETER guardar secretos sobre maltrato',
        '5. DOCUMENTAR inmediatamente la conversación',
        '6. COMUNICAR al Delegado/a de Protección',
        '7. ACTIVAR el protocolo correspondiente',
        '',
        'Documentación de Incidencias:',
        '• Fecha, hora y lugar exactos',
        '• Personas presentes',
        '• Descripción objetiva de hechos',
        '• Palabras textuales del menor',
        '• No incluir interpretaciones personales',
        '• Firmar y fechar el documento',
        '• Mantener confidencialidad absoluta'
      ],
      archivosDescarga: [
        { nombre: 'Guia_Deteccion_Indicadores.pdf', url: '/docs/deteccion-indicadores.pdf', tipo: 'PDF' },
        { nombre: 'Formulario_Registro_Incidencias.pdf', url: '/docs/formulario-incidencias.pdf', tipo: 'PDF' },
        { nombre: 'Protocolo_Actuacion_Inmediata.pdf', url: '/docs/protocolo-inmediato.pdf', tipo: 'PDF' }
      ],
      completado: false,
      bloqueado: true,
      progreso: 0,
      tiempoEstimado: '55 min'
    },
    {
      id: 5,
      titulo: 'Comunicación y Coordinación con Familias',
      descripcion: 'Estrategias de comunicación efectiva y colaboración con padres y tutores legales',
      contenido: [
        'Comunicación Efectiva con Familias',
        'La colaboración con las familias es fundamental para garantizar la protección integral de los menores deportistas.',
        '',
        'Canales de Comunicación:',
        '• Reuniones presenciales programadas',
        '• Plataforma digital oficial del club',
        '• Comunicación telefónica para urgencias',
        '• Correo electrónico institucional',
        '• Aplicaciones de mensajería oficial (grupos padres)',
        '• Tablón de anuncios físico',
        '',
        'Comunicación Rutinaria:',
        '• Información sobre evolución deportiva',
        '• Calendario de entrenamientos y competiciones',
        '• Cambios en horarios o instalaciones',
        '• Eventos y actividades del club',
        '• Aspectos médicos y de salud',
        '• Comportamiento y actitud del menor',
        '',
        'Comunicación en Situaciones de Riesgo:',
        '• Información inmediata sobre incidencias menores',
        '• Protocolo especial para situaciones graves',
        '• Coordinación con servicios sociales cuando proceda',
        '• Respeto a la confidencialidad legal',
        '• Documentación de todas las comunicaciones',
        '',
        'Coordinación Interinstitucional:',
        '• Servicios Sociales municipales',
        '• Centro de salud/pediatra',
        '• Centro educativo del menor',
        '• Federación deportiva correspondiente',
        '• Policía Nacional/Guardia Civil (si procede)',
        '• Fiscalía de Menores (casos graves)',
        '',
        'Reuniones con Familias:',
        '• Reunión inicial de información',
        '• Reuniones trimestrales de seguimiento',
        '• Reuniones extraordinarias si es necesario',
        '• Participación en comisiones del club',
        '• Evaluaciones de fin de temporada',
        '',
        'Información Clave a Transmitir:',
        '• Política de protección del club',
        '• Canales de comunicación de incidencias',
        '• Derechos y obligaciones de todas las partes',
        '• Procedimientos de actuación ante problemas',
        '• Importancia de la comunicación bidireccional',
        '',
        'Aspectos Legales:',
        '• Consentimiento informado para actividades',
        '• Autorización para tratamiento de datos',
        '• Permiso para uso de imagen',
        '• Información sobre seguro de accidentes',
        '• Conocimiento de protocolos de emergencia',
        '',
        'Evaluación de la Comunicación:',
        '• Encuestas de satisfacción anuales',
        '• Buzón de sugerencias',
        '• Reuniones de evaluación',
        '• Indicadores de participación familiar',
        '• Mejora continua de procesos'
      ],
      archivosDescarga: [
        { nombre: 'Manual_Comunicacion_Familias.pdf', url: '/docs/manual-comunicacion.pdf', tipo: 'PDF' },
        { nombre: 'Plantillas_Comunicacion.docx', url: '/docs/plantillas-comunicacion.docx', tipo: 'Word' },
        { nombre: 'Protocolo_Reuniones_Padres.pdf', url: '/docs/protocolo-reuniones.pdf', tipo: 'PDF' }
      ],
      completado: false,
      bloqueado: true,
      progreso: 0,
      tiempoEstimado: '40 min'
    },
    {
      id: 6,
      titulo: 'Casos Prácticos y Ejemplos del Sector Deportivo',
      descripcion: 'Situaciones reales y ejercicios prácticos específicos para entidades deportivas',
      contenido: [
        '🏆 Casos Prácticos en Entidades Deportivas',
        'Análisis de situaciones reales y ejercicios prácticos para aplicar los conocimientos adquiridos.',
        '',
        '📚 CASO PRÁCTICO 1: Vestuarios',
        'Situación: Un entrenador de 35 años permanece en los vestuarios mientras los menores (12-14 años) se cambian, justificándolo por "supervisión de seguridad".',
        '',
        '🔍 Análisis:',
        '• Violación del protocolo de intimidad',
        '• Situación de riesgo innecesario',
        '• Falta de alternativas de supervisión',
        '• Posible normalización de comportamiento inapropiado',
        '',
        '✅ Actuación Correcta:',
        '• Supervisión desde fuera con puerta entreabierta',
        '• Presencia de dos adultos si es necesario entrar',
        '• Establecer turnos por edades si es necesario',
        '• Comunicar protocolo claro a toda la familia',
        '',
        '📚 CASO PRÁCTICO 2: Redes Sociales',
        'Situación: Un entrenador añade a menores deportistas a su Instagram personal y mantiene conversaciones privadas sobre temas no deportivos.',
        '',
        '🔍 Análisis:',
        '• Violación de protocolos de comunicación digital',
        '• Creación de relación personal inapropiada',
        '• Falta de transparencia con familias',
        '• Posible grooming o preparación para abuso',
        '',
        '✅ Actuación Correcta:',
        '• Solo comunicación a través de canales oficiales',
        '• Grupos de comunicación con participación de padres',
        '• Prohibición de comunicación privada',
        '• Formación específica sobre límites profesionales',
        '',
        '📚 CASO PRÁCTICO 3: Concentración Deportiva',
        'Situación: Durante una concentración de fin de semana, un menor de 13 años se muestra retraído, no quiere ducharse con los demás y evita quedarse a solas con un entrenador específico.',
        '',
        '🔍 Análisis:',
        '• Posibles indicadores de abuso sexual',
        '• Cambio de comportamiento significativo',
        '• Evitación de situaciones específicas',
        '• Necesidad de intervención inmediata',
        '',
        '✅ Actuación Correcta:',
        '1. Observación discreta pero constante',
        '2. Creación de ambiente seguro para comunicación',
        '3. Entrevista confidencial con menor',
        '4. Documentación inmediata',
        '5. Comunicación al Delegado de Protección',
        '6. Activación de protocolo según gravedad',
        '',
        '📚 CASO PRÁCTICO 4: Presión Familiar',
        'Situación: Los padres de un menor ejercen presión extrema sobre el rendimiento deportivo, con castigos físicos en casa cuando no gana competiciones.',
        '',
        '🔍 Análisis:',
        '• Maltrato físico en entorno familiar',
        '• Presión psicológica sobre el menor',
        '• Conflicto entre objetivos deportivos y bienestar',
        '• Necesidad de intervención multidisciplinar',
        '',
        '✅ Actuación Correcta:',
        '• Documentación de evidencias',
        '• Entrevista con el menor en ambiente seguro',
        '• Comunicación con servicios sociales',
        '• Seguimiento especializado',
        '• Posible comunicación a fiscalía de menores',
        '',
        'EJERCICIOS PRÁCTICOS:',
        '',
        'Ejercicio 1: Detección de Indicadores',
        'Identifica los indicadores de riesgo en cada caso presentado y clasifícalos por tipo (físicos, emocionales, conductuales).',
        '',
        'Ejercicio 2: Protocolo de Actuación',
        'Desarrolla el protocolo paso a paso para cada situación, incluyendo tiempos y responsables.',
        '',
        'Ejercicio 3: Comunicación con Familias',
        'Redacta el mensaje que enviarías a las familias en cada caso, manteniendo confidencialidad y profesionalidad.',
        '',
        'Ejercicio 4: Documentación',
        'Completa los formularios de registro de incidencias para cada caso práctico.',
        '',
        'Evaluación de Casos:',
        'Al final de cada caso práctico, se evaluará:',
        '• Identificación correcta de riesgos',
        '• Aplicación adecuada de protocolos',
        '• Calidad de la documentación',
        '• Comunicación efectiva',
        '• Seguimiento apropiado'
      ],
      ejemplosPracticos: [
        'Análisis de 15 casos reales de entidades deportivas',
        'Simulacros de situaciones de crisis',
        'Role-playing de comunicación con familias',
        'Ejercicios de documentación de incidencias',
        'Evaluación de protocolos existentes'
      ],
      archivosDescarga: [
        { nombre: 'Casos_Practicos_Completos.pdf', url: '/docs/casos-practicos.pdf', tipo: 'PDF' },
        { nombre: 'Ejercicios_Evaluacion.pdf', url: '/docs/ejercicios-evaluacion.pdf', tipo: 'PDF' },
        { nombre: 'Soluciones_Casos_Practicos.pdf', url: '/docs/soluciones-casos.pdf', tipo: 'PDF' },
        { nombre: 'Formularios_Practicos.docx', url: '/docs/formularios-practicos.docx', tipo: 'Word' }
      ],
      completado: false,
      bloqueado: true,
      progreso: 0,
      tiempoEstimado: '90 min'
    }
  ])

  const [moduloActivo, setModuloActivo] = useState<number | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Cargar progreso desde localStorage
  useEffect(() => {
    const progresoGuardado = localStorage.getItem('campus-lopivi-progreso')
    if (progresoGuardado) {
      try {
        const progreso = JSON.parse(progresoGuardado)
        setModulosProgreso(progreso)
      } catch (error) {
        console.error('Error cargando progreso:', error)
      }
    }
  }, [])

  // Simular lectura y progreso
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!moduloActivo) return

    const element = e.currentTarget
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight
    const clientHeight = element.clientHeight

    const progress = Math.min((scrollTop / (scrollHeight - clientHeight)) * 100, 100)
    setScrollProgress(progress)

    // Actualizar progreso del módulo
    setModulosProgreso(prev =>
      prev.map(modulo =>
        modulo.id === moduloActivo
          ? { ...modulo, progreso: progress }
          : modulo
      )
    )
  }

  const completarModulo = (moduloId: number) => {
    const nuevosModulos = modulosProgreso.map((modulo, index) => {
      if (modulo.id === moduloId) {
        return { ...modulo, completado: true, progreso: 100 }
      }
      // Desbloquear siguiente módulo
      if (modulo.id === moduloId + 1) {
        return { ...modulo, bloqueado: false }
      }
      return modulo
    })

    setModulosProgreso(nuevosModulos)

    // Guardar progreso en localStorage
    localStorage.setItem('campus-lopivi-progreso', JSON.stringify(nuevosModulos))

    setModuloActivo(null)

    // Navegación automática sin mensaje
    if (moduloId < 6) {
      // Abrir siguiente módulo automáticamente
      setTimeout(() => {
        setModuloActivo(moduloId + 1)
      }, 500)
    }
  }

  const puedeDescargar = (modulo: ModuloProgreso) => {
    return modulo.progreso >= 90
  }

  const descargarArchivo = (archivo: { nombre: string; url: string; tipo: string }) => {
    // Crear contenido del PDF/documento
    const contenido = `Documento: ${archivo.nombre}\nTipo: ${archivo.tipo}\nMódulo: Campus Virtual LOPIVI\nClub Deportivo Los Leones\n\nEste es el contenido del material de formación LOPIVI.`

    // Crear blob y descarga real
    const blob = new Blob([contenido], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = archivo.nombre
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const abrirModulo = (moduloId: number) => {
    const modulo = modulosProgreso.find(m => m.id === moduloId)
    if (modulo && !modulo.bloqueado) {
      setModuloActivo(moduloId)
      setScrollProgress(modulo.progreso)
    }
  }

  const moduloActivoData = modulosProgreso.find(m => m.id === moduloActivo)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campus Virtual LOPIVI</h1>
              <p className="text-gray-600 mt-2">Formación especializada para Club Deportivo Los Leones</p>
            </div>
            <Link
              href="/formacion-lopivi/bienvenida"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Volver a Formación
            </Link>
          </div>
        </div>

        {/* Barra de progreso de 5 pasos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Proceso de Certificación LOPIVI</h3>
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-4xl">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-green-600 text-white">
                  ✓
                </div>
                <div className="mt-2 text-center">
                  <div className="font-medium text-gray-900 text-sm">Bienvenida</div>
                  <div className="text-xs text-gray-500">Completado</div>
                </div>
              </div>
              <div className="flex-1 h-1 mx-3 bg-green-600"></div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  modulosProgreso.filter(m => m.completado).length > 0 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <div className="mt-2 text-center">
                  <div className={`font-medium text-sm ${
                    modulosProgreso.filter(m => m.completado).length > 0 ? 'text-gray-900' : 'text-gray-500'
                  }`}>Formación</div>
                  <div className="text-xs text-gray-500">
                    {modulosProgreso.filter(m => m.completado).length === 6 ? 'Completado' : 'En progreso'}
                  </div>
                </div>
              </div>
              <div className={`flex-1 h-1 mx-3 ${
                modulosProgreso.filter(m => m.completado).length === 6 ? 'bg-orange-600' : 'bg-gray-300'
              }`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  modulosProgreso.filter(m => m.completado).length === 6 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  3
                </div>
                <div className="mt-2 text-center">
                  <div className={`font-medium text-sm ${
                    modulosProgreso.filter(m => m.completado).length === 6 ? 'text-gray-900' : 'text-gray-500'
                  }`}>Test</div>
                  <div className="text-xs text-gray-500">Pendiente</div>
                </div>
              </div>
              <div className="flex-1 h-1 mx-3 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gray-300 text-gray-600">
                  4
                </div>
                <div className="mt-2 text-center">
                  <div className="font-medium text-gray-500 text-sm">Certificación</div>
                  <div className="text-xs text-gray-500">Pendiente</div>
                </div>
              </div>
              <div className="flex-1 h-1 mx-3 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gray-300 text-gray-600">
                  5
                </div>
                <div className="mt-2 text-center">
                  <div className="font-medium text-gray-500 text-sm">Dashboard</div>
                  <div className="text-xs text-gray-500">Pendiente</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vista de módulos */}
        {!moduloActivo ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Módulos de Formación LOPIVI</h3>

            {/* Progreso general */}
            <div className="mb-8 bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-900">Progreso General</span>
                <span className="text-sm text-blue-700">
                  {modulosProgreso.filter(m => m.completado).length} / {modulosProgreso.length} completados
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(modulosProgreso.filter(m => m.completado).length / modulosProgreso.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modulosProgreso.map((modulo) => (
                <div
                  key={modulo.id}
                  className={`border rounded-lg p-6 transition-all duration-200 ${
                    modulo.bloqueado
                      ? 'border-gray-200 bg-gray-50 opacity-60'
                      : modulo.completado
                      ? 'border-green-300 bg-green-50 shadow-lg'
                      : 'border-blue-200 bg-white hover:shadow-lg cursor-pointer'
                  }`}
                  onClick={() => !modulo.bloqueado && abrirModulo(modulo.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-lg">
                      Módulo {modulo.id}: {modulo.titulo}
                    </h4>
                    <div className="ml-2">
                      {modulo.completado ? (
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">✓</span>
                        </div>
                      ) : modulo.bloqueado ? (
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">•</span>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{modulo.id}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm">{modulo.descripcion}</p>

                  {/* Barra de progreso del módulo */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progreso</span>
                      <span>{Math.round(modulo.progreso)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          modulo.completado ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${modulo.progreso}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{modulo.tiempoEstimado}</span>
                    {modulo.completado ? (
                      <span className="text-green-600 font-medium">Completado</span>
                    ) : modulo.bloqueado ? (
                      <span className="text-gray-400">Bloqueado</span>
                    ) : (
                      <span className="text-blue-600 font-medium">Disponible</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Botón al test cuando todos los módulos están completados */}
            {modulosProgreso.filter(m => m.completado).length === 6 && (
              <div className="mt-8 text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-green-900 mb-2">¡Formación Completada!</h3>
                  <p className="text-green-700 mb-4">
                    Has completado exitosamente todos los módulos de formación LOPIVI especializada para clubes deportivos.
                    Es hora de realizar el test de evaluación final para obtener tu certificación como Delegado/a de Protección.
                  </p>
                  <div className="bg-white border border-green-300 rounded-lg p-4 mb-4">
                    <h4 className="font-bold text-green-800 mb-2">Test de Evaluación Final:</h4>
                    <ul className="text-green-700 text-sm text-left space-y-1">
                      <li>• 20 preguntas sobre todos los módulos completados</li>
                      <li>• Duración aproximada: 30-45 minutos</li>
                      <li>• Nota mínima para aprobar: 70%</li>
                      <li>• Puedes repetir el test si es necesario</li>
                    </ul>
                  </div>
                  <Link
                    href="/formacion-lopivi/test-unico"
                    className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors inline-block"
                  >
                    Continuar al Test de Evaluación
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Vista del módulo activo */
          <div className="bg-white rounded-lg shadow-md">
            {/* Header del módulo */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Módulo {moduloActivoData?.id}: {moduloActivoData?.titulo}
                  </h2>
                  <p className="text-gray-600 mt-1">{moduloActivoData?.descripcion}</p>
                </div>
                <button
                  onClick={() => setModuloActivo(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ← Volver a Módulos
                </button>
              </div>

              {/* Progreso de lectura */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progreso de Lectura</span>
                  <span className="text-sm text-gray-600">{Math.round(scrollProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                  ></div>
                </div>
                {scrollProgress >= 90 && (
                  <p className="text-green-600 text-sm mt-1">
                    Contenido leído! Ya puedes descargar los materiales y completar el módulo.
                  </p>
                )}
              </div>
            </div>

            {/* Contenido del módulo */}
            <div
              className="p-6 max-h-96 overflow-y-auto"
              onScroll={handleScroll}
            >
              <div className="prose max-w-none">
                {moduloActivoData?.contenido.map((parrafo, index) => (
                  <div key={index} className="mb-4">
                    {parrafo.endsWith(':') && !parrafo.startsWith('•') && !parrafo.match(/^\d+\./) ? (
                      <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">{parrafo}</h3>
                    ) : parrafo.startsWith('•') ? (
                      <ul className="ml-4">
                        <li className="text-gray-700">{parrafo.substring(2)}</li>
                      </ul>
                    ) : parrafo.trim() === '' ? (
                      <br />
                    ) : parrafo.match(/^\d+\./) ? (
                      <ol className="ml-4">
                        <li className="text-gray-700">{parrafo}</li>
                      </ol>
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{parrafo}</p>
                    )}
                  </div>
                ))}

                {moduloActivoData?.ejemplosPracticos && (
                  <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h4 className="font-bold text-yellow-900 mb-3">Ejemplos Prácticos Incluidos:</h4>
                    <ul className="space-y-2">
                      {moduloActivoData.ejemplosPracticos.map((ejemplo, index) => (
                        <li key={index} className="text-yellow-800">• {ejemplo}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Footer del módulo */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              {/* Archivos de descarga */}
              {moduloActivoData?.archivosDescarga && puedeDescargar(moduloActivoData) && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3">Materiales de Descarga:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {moduloActivoData.archivosDescarga.map((archivo, index) => (
                      <button
                        key={index}
                        onClick={() => descargarArchivo(archivo)}
                        className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3 hover:bg-blue-100 transition-colors"
                      >
                        <div className="text-left">
                          <div className="font-medium text-blue-900 text-sm">{archivo.nombre}</div>
                          <div className="text-blue-700 text-xs">{archivo.tipo}</div>
                        </div>
                        <span className="text-blue-600">↓</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón de completar */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {scrollProgress < 90 ? (
                    `Lee el ${Math.round(90 - scrollProgress)}% restante para completar el módulo`
                  ) : (
                    'Contenido completamente leído!'
                  )}
                </div>

                <button
                  onClick={() => moduloActivoData && completarModulo(moduloActivoData.id)}
                  disabled={scrollProgress < 90}
                  className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                    scrollProgress >= 90
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {scrollProgress >= 90 ? 'Completar Módulo' : 'Completar Lectura'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
