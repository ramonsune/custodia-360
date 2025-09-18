'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormacionProgressBar } from '@/components/FormacionProgressBar';
import jsPDF from 'jspdf';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  tipo: string;
  entidad: string;
  certificacionVigente?: boolean;
  formacionCompletada?: boolean;
  tipoEntidad?: string | null;
}

// Datos de formación completos
const formacionData = {
  1: {
    titulo: 'Normativa LOPIVI y marco legal',
    secciones: [
      {
        titulo: '1. INTRODUCCIÓN A LA LEY ORGÁNICA DE PROTECCIÓN INTEGRAL',
        contenido: `CONTEXTO HISTÓRICO Y SOCIAL:

LA LOPIVI (LEY ORGÁNICA 8/2021):
La Ley Orgánica 8/2021, de 4 de junio, de protección integral a la infancia y la adolescencia frente a la violencia, representa un hito fundamental en la protección de menores en España. Esta ley surge como respuesta a:

- La necesidad de unificar criterios de protección en todo el territorio nacional
- Los compromisos internacionales asumidos por España (Convención sobre los Derechos del Niño)
- La demanda social de mayor protección ante casos de violencia infantil
- La detección de carencias en el sistema de protección existente

PRINCIPIOS FUNDAMENTALES:
1. INTERÉS SUPERIOR DEL MENOR: Toda actuación debe priorizar el bienestar del menor
2. PROTECCIÓN INTEGRAL: Enfoque multidisciplinar y coordinado
3. PREVENCIÓN: Actuación antes de que se produzca el daño
4. SENSIBILIZACIÓN: Educación y concienciación social
5. ESPECIALIZACIÓN: Formación específica de todos los profesionales implicados`
      },
      {
        titulo: '2. DEFINICIONES CLAVE SEGÚN LOPIVI',
        contenido: `CONCEPTOS ESENCIALES:

VIOLENCIA CONTRA LA INFANCIA Y ADOLESCENCIA:
"Cualquier acción, omisión o trato negligente, no accidental, que prive a la persona menor de edad de sus derechos y bienestar, que amenace o interfiera su ordenado desarrollo físico, psíquico o social"

TIPOS DE VIOLENCIA RECONOCIDOS:
- MALTRATO FÍSICO: Lesiones físicas infligidas de manera no accidental
- MALTRATO PSICOLÓGICO: Daño emocional causado por comportamientos de adultos
- NEGLIGENCIA: Falta de atención a las necesidades básicas del menor
- ABUSO SEXUAL: Cualquier forma de contacto o actividad sexual con un menor
- VIOLENCIA DE GÉNERO: Violencia ejercida sobre menores por razón de género
- CORRUPCIÓN: Inducción a comportamientos delictivos o antisociales

ENTORNOS DE PROTECCIÓN:
La LOPIVI establece que todos los entornos donde se desarrolla la vida del menor deben ser entornos seguros:
- Familiar
- Educativo
- Sanitario
- Servicios sociales
- Deportivo y de ocio
- Digital y medios de comunicación

APLICACIÓN EN TU ENTORNO_EJEMPLO:
Como delegado de protección en un ENTORNO_EJEMPLO, tu responsabilidad es garantizar que durante ACTIVIDAD_EJEMPLO se cumplan todos los protocolos de protección. Un PROFESIONAL_EJEMPLO debe estar especialmente atento en SITUACION_EJEMPLO donde pueden darse situaciones de vulnerabilidad.`
      },
      {
        titulo: '3. OBLIGACIONES PARA ENTIDADES',
        contenido: `RESPONSABILIDADES ESPECÍFICAS:

OBLIGACIÓN DE ESTABLECER POLÍTICAS DE PROTECCIÓN:
Todas las entidades que trabajen con menores deben:
1. Designar un delegado de protección
2. Establecer protocolos de actuación
3. Implementar medidas preventivas
4. Formar a todo el personal
5. Crear canales de comunicación seguros

DELEGADO DE PROTECCIÓN (Art. 20):
FUNCIONES PRINCIPALES:
- Promover medidas de protección en la entidad
- Coordinar casos de riesgo o maltrato
- Comunicar situaciones de riesgo a autoridades
- Formar al personal de la entidad
- Supervisar aplicación de protocolos

REQUISITOS:
- Formación específica en protección de menores
- Conocimiento de protocolos de actuación
- Capacidad de coordinación y comunicación
- Dedicación suficiente para sus funciones
- Actualización formativa continua

PROTOCOLOS DE ACTUACIÓN:
Deben incluir:
- Procedimientos de prevención
- Protocolos de detección temprana
- Actuación ante sospechas de maltrato
- Comunicación a autoridades competentes
- Apoyo y protección de víctimas
- Medidas disciplinarias internas`
      }
    ]
  },
  2: {
    titulo: 'Indicadores de maltrato y negligencia',
    secciones: [
      {
        titulo: '1. INDICADORES FÍSICOS DE MALTRATO',
        contenido: `SIGNOS FÍSICOS EVIDENTES:

LESIONES INEXPLICABLES O INCONSISTENTES:
- Moratones en diferentes estadios de curación
- Marcas con formas específicas (cinturones, objetos)
- Quemaduras simétricas o en zonas no expuestas
- Fracturas múltiples o en diferentes momentos
- Lesiones en cabeza, cara, cuello o genitales

SIGNOS DE NEGLIGENCIA FÍSICA:
- Higiene personal deficiente de forma persistente
- Ropa inadecuada para el clima o sucia habitualmente
- Hambre constante o problemas de alimentación
- Cansancio extremo o problemas de sueño frecuentes
- Falta de atención médica o dental evidente

INDICADORES EN EL COMPORTAMIENTO FÍSICO:
- Hipervigilancia o sobresalto excesivo
- Regresión en habilidades ya adquiridas
- Comportamientos autodestructivos
- Movimientos corporales limitados por dolor
- Evitación del contacto físico normal

DOCUMENTACIÓN CORRECTA:
Al observar signos físicos, es fundamental:
- Registrar fecha, hora y circunstancias
- Describir objetivamente sin interpretar
- No fotografiar al menor (corresponde a autoridades)
- Buscar explicaciones naturales antes de concluir maltrato
- Consultar con profesionales sanitarios si es posible

EJEMPLO ESPECÍFICO PARA TU ENTORNO_EJEMPLO:
Un PROFESIONAL_EJEMPLO observa durante ACTIVIDAD_EJEMPLO que un menor presenta moratones en brazos. Debe documentar: "Día X, hora Y, durante ACTIVIDAD_EJEMPLO en SITUACION_EJEMPLO, se observaron marcas circulares en antebrazo derecho del menor. El menor indicó que se cayó de la bicicleta". Esta documentación objetiva es fundamental para el protocolo.`
      },
      {
        titulo: '2. INDICADORES EMOCIONALES Y COMPORTAMENTALES',
        contenido: `CAMBIOS SIGNIFICATIVOS DE COMPORTAMIENTO:

ALTERACIONES EMOCIONALES:
- Tristeza persistente o llanto frecuente sin causa aparente
- Ansiedad extrema o miedos irracionales nuevos
- Agresividad súbita o comportamiento disruptivo
- Apatía o desconexión emocional pronunciada
- Cambios bruscos de humor inexplicables

COMPORTAMIENTOS REGRESIVOS:
- Vuelta a comportamientos de etapas anteriores (enuresis, chuparse el dedo)
- Pérdida de habilidades sociales ya adquiridas
- Dependencia excesiva de adultos
- Necesidad constante de aprobación y atención
- Miedo a la separación de figuras protectoras

COMPORTAMIENTOS SEXUALIZADOS INAPROPIADOS:
- Conocimiento sexual inadecuado para la edad
- Comportamientos sexuales con otros menores
- Masturbación compulsiva o en público
- Lenguaje sexual inapropiado para su desarrollo
- Dibujos con contenido sexual explícito

INDICADORES ACADÉMICOS Y SOCIALES:
- Deterioro súbito del rendimiento escolar
- Problemas de concentración y atención nuevos
- Aislamiento social o evitación de actividades
- Dificultades para establecer relaciones con iguales
- Comportamientos extremos (muy complaciente o muy agresivo)`
      }
    ]
  },
  3: {
    titulo: 'Técnicas de detección y evaluación',
    secciones: [
      {
        titulo: '1. METODOLOGÍA DE OBSERVACIÓN SISTEMÁTICA',
        contenido: `PRINCIPIOS DE OBSERVACIÓN PROFESIONAL:

TÉCNICAS DE OBSERVACIÓN NO INTRUSIVA:
- Mantener rutinas normales sin alertar al menor
- Observar en diferentes contextos y momentos del día
- Registrar observaciones de forma objetiva y sistemática
- Evitar confrontaciones directas en fases iniciales
- Contrastar observaciones con otros profesionales

DOCUMENTACIÓN CIENTÍFICA:
- Registro cronológico detallado de todas las observaciones
- Descripción objetiva sin interpretaciones subjetivas
- Anotación precisa de contexto y circunstancias específicas
- Registro de frecuencia y patrones de comportamientos
- Recopilación de testimonios de múltiples observadores

CRITERIOS DE EVALUACIÓN:
- Gravedad de los indicadores observados
- Frecuencia y persistencia en el tiempo
- Impacto en el desarrollo del menor
- Coherencia entre diferentes indicadores
- Factores de protección presentes en el entorno`
      },
      {
        titulo: '2. ENTREVISTA PROFESIONAL CON MENORES',
        contenido: `PREPARACIÓN DEL ESPACIO Y ENTORNO:

CONDICIONES AMBIENTALES:
- Espacio privado, seguro y libre de interrupciones
- Ambiente cálido y acogedor que genere confianza
- Temperatura y iluminación adecuadas
- Mobiliario adaptado a la edad del menor
- Ausencia de elementos que puedan intimidar

PRINCIPIOS DE COMUNICACIÓN:
- Usar lenguaje sencillo y apropiado para la edad
- Emplear un tono de voz calmado y reassegurador
- Mantener contacto visual adecuado sin resultar intimidante
- Adoptar una postura corporal abierta y relajada
- Respetar los tiempos de silencio del menor

TÉCNICAS DE ESCUCHA ACTIVA:
- Permitir que el menor hable libremente sin interrupciones
- Hacer preguntas abiertas que no condicionen respuestas
- Reformular y validar los sentimientos expresados
- Evitar preguntas directas o sugestivas sobre hechos específicos
- No prometer confidencialidad absoluta desde el inicio`
      },
      {
        titulo: '3. EVALUACIÓN DE RIESGO INTEGRAL',
        contenido: `FACTORES DE RIESGO A EVALUAR:

FACTORES INDIVIDUALES DEL MENOR:
- Edad y nivel de desarrollo evolutivo
- Capacidades de comunicación y comprensión
- Estado de salud física y mental
- Historia previa de victimización
- Recursos personales de afrontamiento

FACTORES FAMILIARES:
- Dinámicas relacionales en el núcleo familiar
- Presencia de violencia doméstica
- Problemas de salud mental o adicciones
- Situación socioeconómica y laboral
- Red de apoyo familiar y social

FACTORES AMBIENTALES:
- Características del entorno escolar o social
- Recursos comunitarios disponibles
- Nivel de supervisión adulta presente
- Exposición a factores de riesgo adicionales
- Acceso a servicios de protección y apoyo

CRITERIOS DE URGENCIA:
RIESGO INMEDIATO - Actuación en 24h:
- Lesiones físicas graves o que requieren atención médica
- Amenazas directas de daño físico o sexual
- Abandono o negligencia que pone en peligro la vida
- Ideación suicida o comportamientos autolesivos graves
- Presencia de armas o sustancias peligrosas en el entorno`
      }
    ]
  },
  4: {
    titulo: 'Protocolos de actuación paso a paso',
    secciones: [
      {
        titulo: '1. PROTOCOLO DE PRIMERA RESPUESTA ANTE SOSPECHA',
        contenido: `FASE INICIAL - PRIMERAS 24 HORAS:

PASO 1 - DETECCIÓN Y REGISTRO INMEDIATO:
1. Documentar inmediatamente la situación observada o comunicada
2. Incluir fecha, hora exacta, lugar y personas presentes
3. Registrar palabras textuales si hay revelación verbal
4. Anotar únicamente hechos observables, evitar interpretaciones
5. Mantener confidencialidad absoluta y no alertar al presunto agresor

PASO 2 - EVALUACIÓN INICIAL DE RIESGO:
1. Valorar si existe peligro inmediato para el menor
2. Determinar si se requiere atención médica urgente
3. Evaluar la necesidad de separación inmediata del agresor
4. Consultar con supervisor, coordinador o delegado principal
5. Revisar protocolos específicos de la entidad y legislación vigente

PASO 3 - MEDIDAS DE PROTECCIÓN INMEDIATA:
Si existe riesgo inmediato:
- Garantizar la seguridad física del menor en todo momento
- Proporcionar primeros auxilios básicos si es necesario
- Contactar servicios de emergencia (112) si hay riesgo vital
- Comunicar de forma urgente a las autoridades competentes
- Documentar exhaustivamente todas las acciones realizadas`
      },
      {
        titulo: '2. COMUNICACIÓN A AUTORIDADES COMPETENTES',
        contenido: `SERVICIOS SOCIALES - COMUNICACIÓN PRIORITARIA:

PLAZO MÁXIMO: 24 horas desde la detección
MEDIO DE COMUNICACIÓN: Llamada telefónica + comunicación escrita
INFORMACIÓN MÍNIMA REQUERIDA:
- Datos completos de identificación del menor
- Descripción detallada y objetiva de los hechos observados
- Indicadores específicos de maltrato o negligencia detectados
- Evaluación profesional del nivel de riesgo
- Medidas de protección ya implementadas
- Datos de contacto del comunicante y disponibilidad

FORMULARIO ESTÁNDAR DE COMUNICACIÓN:
1. IDENTIFICACIÓN DEL MENOR:
   - Nombre completo y apellidos
   - Fecha de nacimiento y edad
   - Documento de identidad si se conoce
   - Dirección habitual de residencia
   - Centro educativo al que asiste
   - Datos de progenitores, tutores o guardadores

2. DESCRIPCIÓN FACTUAL DE LOS HECHOS:
   - Cronología detallada de los acontecimientos
   - Personas adultas implicadas o sospechosas
   - Testigos presenciales de los hechos
   - Contexto específico donde ocurrieron
   - Frecuencia si son hechos repetidos

FISCALÍA DE MENORES - COMUNICACIÓN DIRECTA:
Obligatoria en casos de:
- Cualquier modalidad de abuso sexual infantil
- Maltrato físico grave con lesiones evidentes
- Negligencia grave que ponga en riesgo la vida
- Explotación laboral, sexual o mendicidad
- Cuando otros organismos no respondan adecuadamente`
      },
      {
        titulo: '3. GESTIÓN INTERNA Y COORDINACIÓN',
        contenido: `INFORMACIÓN AL EQUIPO DE TRABAJO:

PRINCIPIO DE NECESIDAD DE CONOCER:
1. Identificar qué miembros del personal necesitan conocer el caso
2. Informar únicamente lo imprescindible para garantizar protección
3. Establecer medidas estrictas de confidencialidad
4. Asignar responsabilidades específicas a cada profesional
5. Coordinar una respuesta coherente y unificada del equipo

MEDIDAS DE PROTECCIÓN EN LA ENTIDAD:
- Supervisión directa y cercana del menor durante actividades
- Evitar situaciones que reproduzcan factores de riesgo identificados
- Modificar horarios o rutinas si es necesario para la protección
- Garantizar que el menor no quede a solas con personas de riesgo
- Proporcionar apoyo emocional básico y contención

COMUNICACIÓN CON LA FAMILIA:
Criterios para decidir si informar:
1. Evaluar si los progenitores están directamente implicados
2. Valorar el riesgo de represalias hacia el menor
3. Considerar la capacidad de protección de la familia
4. Seguir indicaciones de servicios sociales competentes

Si se decide informar:
- Citar en lugar neutral y profesional
- Explicar la obligación legal de comunicar sospechas
- Solicitar colaboración activa en medidas de protección
- Orientar sobre recursos de apoyo familiar disponibles
- Documentar íntegramente la comunicación realizada`
      },
      {
        titulo: '4. SEGUIMIENTO Y DOCUMENTACIÓN',
        contenido: `SISTEMA DE REGISTRO PROFESIONAL:

EXPEDIENTE INDIVIDUAL DEL CASO:
Documentación obligatoria:
1. Hoja de registro inicial con datos básicos del menor
2. Cronología detallada de todas las actuaciones realizadas
3. Copias de comunicaciones enviadas y respuestas recibidas
4. Informes de otros profesionales involucrados
5. Medidas de protección adoptadas y evaluación de efectividad
6. Registro de seguimiento de la evolución del caso

PRINCIPIOS DE DOCUMENTACIÓN LEGAL:
- OBJETIVIDAD: Registrar únicamente hechos observables y contrastables
- PRECISIÓN: Especificar fechas, horas, lugares y personas exactas
- COMPLETITUD: Incluir toda información relevante sin omisiones
- LEGIBILIDAD: Redactar de forma clara y comprensible
- CONFIDENCIALIDAD: Garantizar acceso restringido y almacenamiento seguro

COMUNICACIONES OFICIALES POSTERIORES:
Estructura profesional recomendada:
1. ENCABEZADO: Datos identificativos de la entidad y destinatario
2. REFERENCIA: Identificación clara del caso y comunicaciones previas
3. ANTECEDENTES: Resumen de actuaciones anteriores relevantes
4. HECHOS NUEVOS: Información adicional o cambios en la situación
5. EVALUACIÓN: Valoración profesional actualizada del riesgo
6. SOLICITUD: Petición específica de actuación o recursos necesarios
7. CIERRE: Datos de contacto para coordinación y seguimiento

EVALUACIÓN DE EFICACIA:
Indicadores de seguimiento:
- Tiempo de respuesta de autoridades competentes
- Adecuación de medidas adoptadas al riesgo comunicado
- Evolución positiva o negativa de indicadores en el menor
- Nivel de coordinación interinstitucional logrado
- Grado de satisfacción de la familia con el proceso`
      }
    ]
  },
  5: {
    titulo: 'Comunicación interinstitucional',
    secciones: [
      {
        titulo: '1. MAPEO DE AUTORIDADES Y SERVICIOS COMPETENTES',
        contenido: `SERVICIOS SOCIALES MUNICIPALES Y AUTONÓMICOS:

COMPETENCIAS PRINCIPALES:
- Recepción y evaluación inicial de comunicaciones de riesgo
- Investigación social especializada de la situación familiar
- Diseño e implementación de planes individualizados de intervención
- Coordinación y gestión de recursos de apoyo especializado
- Seguimiento a medio y largo plazo de la evolución del caso
- Propuesta de medidas de protección administrativas

CUÁNDO CONTACTAR PRIORITARIAMENTE:
- Cualquier sospecha fundada de maltrato o negligencia
- Situaciones de riesgo social o vulnerabilidad familiar
- Necesidad de evaluación especializada de competencias parentales
- Requerimiento de recursos de apoyo específicos para la familia
- Coordinación de intervenciones preventivas o de apoyo
- Seguimiento de casos previamente conocidos por el sistema

FISCALÍA ESPECIALIZADA DE MENORES:

ÁMBITO DE ACTUACIÓN ESPECÍFICO:
- Investigación penal de delitos cometidos contra menores
- Adopción de medidas cautelares urgentes de protección
- Coordinación de procedimientos judiciales especializados
- Supervisión del cumplimiento de medidas judiciales
- Defensa procesal de los derechos e intereses del menor
- Coordinación con otros juzgados y servicios especializados

COMUNICACIÓN DIRECTA OBLIGATORIA:
- Abuso sexual infantil en cualquiera de sus modalidades
- Maltrato físico grave que pueda constituir delito
- Negligencia grave con riesgo vital inminente
- Explotación laboral, sexual o inducción a la mendicidad
- Trata de menores o adopciones ilegales
- Cuando otros organismos no actúen con la diligencia debida`
      },
      {
        titulo: '2. PROCEDIMIENTOS DE COMUNICACIÓN FORMAL',
        contenido: `COMUNICACIÓN TELEFÓNICA INICIAL:

PREPARACIÓN PREVIA DE LA LLAMADA:
1. Compilar todos los datos identificativos del menor afectado
2. Preparar resumen claro, conciso y cronológico de los hechos
3. Tener disponible evaluación preliminar del nivel de riesgo
4. Enumerar medidas de protección ya implementadas
5. Formular solicitud específica y urgencia de la intervención requerida

ESTRUCTURA PROFESIONAL DE LA COMUNICACIÓN:
1. IDENTIFICACIÓN: Presentación del comunicante y entidad representada
2. MOTIVO: Explicación clara del propósito de la comunicación
3. IDENTIFICACIÓN DEL MENOR: Datos completos y precisos
4. DESCRIPCIÓN OBJETIVA: Relato cronológico y factual de los hechos
5. EVALUACIÓN DE RIESGO: Valoración profesional de la gravedad
6. SOLICITUD DE ACTUACIÓN: Petición específica de intervención
7. CONFIRMACIÓN: Verificación de datos de contacto y disponibilidad

COMUNICACIÓN ESCRITA FORMAL:

PLAZOS ESTABLECIDOS POR LEY:
- URGENTE: Inmediatamente tras la comunicación telefónica inicial
- NORMAL: Máximo 24-48 horas desde la detección del caso
- SEGUIMIENTO: Según periodicidad acordada con el servicio receptor

ESTRUCTURA DOCUMENTAL PROFESIONAL:
1. ENCABEZADO OFICIAL:
   - Datos identificativos completos de la entidad comunicante
   - Fecha de emisión y número de registro interno
   - Identificación precisa del destinatario y cargo

2. ANTECEDENTES RELEVANTES:
   - Relación de la entidad con el menor y su familia
   - Comunicaciones previas relacionadas con el caso
   - Intervenciones anteriores de otros servicios conocidas

3. EXPOSICIÓN DETALLADA DE LOS HECHOS:
   - Cronología precisa y objetiva de los acontecimientos
   - Descripción específica de indicadores observados
   - Contexto y circunstancias de la detección
   - Personas adultas implicadas o sospechosas

4. EVALUACIÓN PROFESIONAL:
   - Valoración técnica del riesgo y nivel de urgencia
   - Factores agravantes y atenuantes identificados
   - Recursos y factores de protección presentes
   - Pronóstico de evolución si no se interviene

5. SOLICITUD Y PROPUESTAS:
   - Actuación específica solicitada a las autoridades
   - Plazos considerados necesarios para la intervención
   - Recursos que la entidad puede aportar al caso
   - Disponibilidad para coordinación y colaboración

6. ANEXOS DOCUMENTALES:
   - Informes técnicos de profesionales de la entidad
   - Documentación gráfica si es relevante y apropiada
   - Cronología detallada de observaciones registradas`
      },
      {
        titulo: '3. COORDINACIÓN Y TRABAJO EN RED',
        contenido: `PARTICIPACIÓN EN EQUIPOS INTERDISCIPLINARES:

PREPARACIÓN PARA REUNIONES DE COORDINACIÓN:
- Revisión exhaustiva de toda la documentación del caso
- Preparación de informe actualizado de la situación actual
- Identificación de puntos específicos que requieren tratamiento
- Formulación de propuestas concretas de intervención
- Preparación de agenda de temas prioritarios a abordar

PARTICIPACIÓN ACTIVA Y PROFESIONAL:
- Aportar información específica desde la perspectiva de la entidad
- Solicitar aclaraciones sobre aspectos legales o técnicos dudosos
- Proponer medidas realistas desde las competencias propias
- Comprometerse con actuaciones específicas y plazos concretos
- Solicitar apoyo o recursos necesarios para cumplir objetivos

DESARROLLO DE PLANES DE INTERVENCIÓN CONJUNTA:

DISEÑO COLABORATIVO:
- Aportar la perspectiva específica del ámbito de actuación
- Identificar claramente recursos propios y limitaciones
- Proponer objetivos realistas, específicos y medibles
- Coordinar calendarios, horarios y espacios de intervención
- Definir roles y responsabilidades claras de cada institución

IMPLEMENTACIÓN COORDINADA:
- Cumplir escrupulosamente compromisos adquiridos en plazos
- Comunicar inmediatamente dificultades o necesidad de cambios
- Adaptar actividades específicas a las necesidades del plan global
- Facilitar acceso y colaboración con otros profesionales
- Mantener coherencia en mensajes transmitidos al menor y familia

EVALUACIÓN CONTINUA:
- Participar en sesiones periódicas de evaluación del plan
- Aportar datos específicos sobre evolución en el propio ámbito
- Identificar factores que facilitan u obstaculizan los objetivos
- Proponer modificaciones basadas en la evolución observada
- Contribuir a la toma de decisiones sobre continuidad o cierre`
      },
      {
        titulo: '4. GESTIÓN DE RESPUESTAS Y SEGUIMIENTO',
        contenido: `ANÁLISIS CRÍTICO DE RESPUESTAS INSTITUCIONALES:

EVALUACIÓN DE ADECUACIÓN:
- Tiempo transcurrido entre comunicación y primera respuesta
- Correspondencia entre gravedad comunicada y medidas adoptadas
- Especificidad y concreción de las medidas propuestas
- Recursos humanos y materiales asignados al caso
- Plazos establecidos para implementación de la intervención
- Mecanismos de coordinación y seguimiento establecidos

ACTUACIÓN ANTE RESPUESTAS INSUFICIENTES:
1. PRIMERA INSTANCIA - Comunicación complementaria:
   - Solicitar por escrito aclaraciones específicas sobre las medidas
   - Aportar información adicional relevante no considerada
   - Expresar preocupaciones concretas sobre la adecuación
   - Proponer reunión presencial para clarificar aspectos técnicos

2. SEGUNDA INSTANCIA - Escalada en la organización:
   - Dirigir comunicación a superior jerárquico del responsable
   - Solicitar revisión del caso por equipo técnico especializado
   - Plantear necesidad de recursos adicionales o especializados
   - Requerir plazos específicos para reevaluación del caso

3. TERCERA INSTANCIA - Comunicación a otras autoridades:
   - Informar a Fiscalía de Menores si hay inactividad grave
   - Comunicar a servicios de inspección competentes
   - Contactar con defensor del menor o instituciones similares
   - Documentar todo el proceso para posibles responsabilidades

SEGUIMIENTO ACTIVO Y SISTEMÁTICO:

MONITORIZACIÓN CONTINUA EN LA ENTIDAD:
- Observación sistemática y documentada del menor
- Registro de cambios en indicadores físicos, emocionales o sociales
- Evaluación periódica de la efectividad de medidas adoptadas
- Detección precoz de nuevos factores de riesgo emergentes
- Comunicación inmediata de cambios significativos a servicios

COMUNICACIONES PERIÓDICAS DE SEGUIMIENTO:
Frecuencia según nivel de riesgo:
- RIESGO ALTO: Comunicación semanal de evolución
- RIESGO MEDIO: Informes quincenales de seguimiento
- RIESGO BAJO: Comunicaciones mensuales de evolución
- CAMBIOS SIGNIFICATIVOS: Comunicación inmediata

CRITERIOS PARA CIERRE DE CASO:
- Eliminación o reducción significativa de factores de riesgo
- Intervención exitosa y consolidada de servicios especializados
- Decisión motivada de servicios sociales competentes
- Informe final detallado con resumen completo y lecciones aprendidas`
      }
    ]
  },
  6: {
    titulo: 'Gestión y formación del equipo',
    secciones: [
      {
        titulo: '1. DISEÑO DE PROGRAMAS FORMATIVOS ESPECIALIZADOS',
        contenido: `ANÁLISIS INTEGRAL DE NECESIDADES FORMATIVAS:

EVALUACIÓN INICIAL DEL PERSONAL:
1. Diagnóstico del nivel de conocimientos previos en protección infantil
2. Identificación de roles y responsabilidades específicas de cada puesto
3. Análisis de situaciones de riesgo específicas del entorno de trabajo
4. Detección de carencias formativas prioritarias por área
5. Evaluación de recursos formativos internos y externos disponibles
6. Identificación de perfiles profesionales con necesidades especializadas

CONTENIDOS MÍNIMOS OBLIGATORIOS LOPIVI:
- Marco jurídico: Derechos de la infancia y normativa LOPIVI vigente
- Identificación: Indicadores de maltrato, negligencia y abuso sexual
- Protocolos: Procedimientos específicos de actuación de la entidad
- Comunicación: Técnicas especializadas de interacción con menores
- Ética profesional: Límites, confidencialidad y principios deontológicos
- Procedimientos: Canales internos de comunicación y coordinación
- Protección de datos: Confidencialidad y cumplimiento del RGPD

METODOLOGÍA FORMATIVA ESPECIALIZADA:
- Sesiones teóricas combinadas con análisis de casos prácticos reales
- Talleres interactivos con simulación de situaciones (role-playing)
- Análisis crítico de casos reales anonimizados del sector
- Simulacros y ensayos de protocolos de actuación en crisis
- Formación online autoadministrada con seguimiento presencial
- Evaluación continua con feedback inmediato y planes de mejora
- Certificación oficial del aprovechamiento formativo

CRONOGRAMA Y PERIODICIDAD:
- Formación inicial obligatoria: 8 horas mínimas antes del inicio
- Formación de refuerzo anual: 4 horas de actualización mínimas
- Sesiones específicas: Según detección de necesidades emergentes
- Actualizaciones normativas: Inmediatas cuando hay cambios legales
- Formación especializada: Para personal con responsabilidades específicas
- Autoevaluación continua: Trimestral para detectar necesidades`
      },
      {
        titulo: '2. SISTEMAS DE COMUNICACIÓN Y CANALES SEGUROS',
        contenido: `ARQUITECTURA DE COMUNICACIÓN INTERNA:

CANALES FORMALES ESTABLECIDOS:
1. Comunicación directa y preferente con delegado de protección
2. Buzón físico y digital de comunicaciones confidenciales
3. Sistema de email institucional seguro y encriptado
4. Reuniones de equipo periódicas con agenda de protección
5. Entrevistas individuales programadas con personal
6. Sistema de alertas y comunicación de emergencia 24/7

CANALES DE EMERGENCIA ESPECIALIZADOS:
- Teléfono directo del delegado disponible en horario ampliado
- Protocolo específico de actuación en horario no laboral
- Red de contactos de emergencia alternativos y suplentes
- Comunicación inmediata con dirección y responsables
- Acceso directo a servicios externos especializados en crisis
- Sistema de escalada automática si no hay respuesta inicial

PROTOCOLOS DE COMUNICACIÓN INTERNA ESPECIALIZADA:

COMUNICACIÓN DE SOSPECHAS - PROCEDIMIENTO:
1. Identificación clara y completa del comunicante
2. Descripción objetiva y detallada de hechos observados
3. Especificación de fecha, hora y circunstancias exactas
4. Identificación de testigos o fuentes adicionales de información
5. Evaluación inicial del nivel de riesgo percibido
6. Solicitud específica de actuación o orientación requerida

TRATAMIENTO PROFESIONAL DE LA INFORMACIÓN:
- Aplicación estricta del principio de "necesidad de conocer"
- Mantenimiento de confidencialidad absoluta en todos los niveles
- Documentación segura con acceso restringido y trazabilidad
- Archivo y custodia segura de expedientes confidenciales
- Protección específica de la identidad del comunicante inicial
- Protocolos de destrucción segura de documentación obsoleta

FORMACIÓN EN COMUNICACIÓN:
- Técnicas de escucha activa para recepción de comunicaciones
- Habilidades de comunicación no verbal y detección de emociones
- Manejo de situaciones de crisis y contención emocional
- Técnicas de entrevista especializada con menores
- Comunicación con familias en situaciones de alta tensión
- Redacción de informes técnicos y comunicaciones oficiales`
      },
      {
        titulo: '3. SUPERVISIÓN TÉCNICA Y APOYO PROFESIONAL',
        contenido: `SISTEMA INTEGRAL DE SUPERVISIÓN:

EVALUACIÓN DEL DESEMPEÑO ESPECIALIZADA:
- Observación directa del trabajo en situaciones reales con menores
- Revisión técnica de registros, documentación y procedimientos
- Evaluación de la correcta aplicación de protocolos establecidos
- Recopilación de feedback de familias y otros profesionales
- Autoevaluación del personal con herramientas estructuradas
- Análisis de casos gestionados y resultados obtenidos

IDENTIFICACIÓN PROACTIVA DE NECESIDADES:
- Detección de dificultades técnicas específicas del personal
- Identificación de carencias formativas emergentes
- Reconocimiento temprano de signos de sobrecarga emocional
- Análisis de conflictos éticos o dilemas profesionales
- Evaluación de recursos adicionales necesarios para el desempeño
- Identificación de fortalezas y áreas de mejora individual

PROGRAMA DE APOYO EMOCIONAL ESPECIALIZADO:

PREVENCIÓN DEL DESGASTE PROFESIONAL:
- Identificación temprana de signos de estrés y burnout
- Rotación planificada en casos emocionalmente muy demandantes
- Acceso a apoyo psicológico profesional especializado
- Formación en técnicas de autocuidado y manejo del estrés
- Fomento de apoyo mutuo y cohesión en el equipo de trabajo
- Espacios de descompresión y actividades de bienestar

ESPACIOS ESTRUCTURADOS DE REFLEXIÓN:
- Reuniones de equipo específicas para análisis de casos complejos
- Sesiones de supervisión externa con profesionales especializados
- Grupos de apoyo entre profesionales del sector
- Espacios de ventilación emocional controlada y segura
- Actividades de cohesión y fortalecimiento del equipo
- Programa de mentoring entre profesionales experimentados y noveles

GESTIÓN DE SITUACIONES CRÍTICAS:
- Protocolo de apoyo inmediato tras situaciones traumáticas
- Debriefing profesional después de casos especialmente difíciles
- Apoyo psicológico individual cuando sea necesario
- Modificación temporal de responsabilidades si es requerido
- Plan de reintegración gradual tras situaciones de impacto emocional`
      },
      {
        titulo: '4. GESTIÓN DE SITUACIONES CRÍTICAS CON PERSONAL',
        contenido: `PROTOCOLO DE ACTUACIÓN ANTE SITUACIONES DE RIESGO:

PROTOCOLO DE EMERGENCIA - PRIMERAS 24 HORAS:
1. Separación inmediata del personal implicado del contacto directo con menores
2. Comunicación urgente a dirección y servicios competentes externos
3. Documentación exhaustiva y objetiva de la situación detectada
4. Preservación y custodia segura de evidencias disponibles
5. Implementación de medidas de protección urgente para menores afectados
6. Activación de protocolo de apoyo y contención para víctimas

INVESTIGACIÓN INTERNA ESPECIALIZADA:
- Designación de responsable específico para liderar la investigación
- Recopilación sistemática de testimonios de testigos y afectados
- Análisis detallado de documentación y registros relevantes
- Entrevistas profesionales con testigos y personas involucradas
- Coordinación activa con investigación oficial de autoridades
- Mantenimiento estricto de confidencialidad durante el proceso

MEDIDAS CAUTELARES INMEDIATAS:
- Suspensión temporal de funciones con menores del personal implicado
- Restricción absoluta de acceso a espacios con presencia de menores
- Supervisión reforzada de otros casos en los que haya participado
- Comunicación transparente y apropiada a familias afectadas
- Revisión integral de protocolos de supervisión y control
- Implementación de medidas adicionales de protección

PREVENCIÓN SISTEMÁTICA DE SITUACIONES DE RIESGO:

SELECCIÓN RIGUROSA DE PERSONAL:
- Verificación obligatoria de antecedentes penales y administrativos
- Solicitud y verificación de referencias profesionales detalladas
- Entrevistas técnicas especializadas en protección infantil
- Período de prueba supervisado con evaluación continua
- Evaluación psicológica profesional cuando sea apropiado o requerido
- Formación específica en protección antes del inicio de funciones

SUPERVISIÓN PREVENTIVA CONTINUA:
- Observación sistemática del trabajo directo con menores
- Rotación planificada en responsabilidades de mayor sensibilidad
- Aplicación de política estricta de "dos adultos" en situaciones de riesgo
- Diseño de espacios físicos que garanticen visibilidad y transparencia
- Protocolos específicos y detallados de interacción apropiada con menores
- Evaluación continua de cumplimiento de protocolos establecidos

CULTURA ORGANIZACIONAL DE PROTECCIÓN:
- Promoción de valores de transparencia y responsabilidad compartida
- Formación continua en límites profesionales y éticos
- Sistema de alertas tempranas para comportamientos inapropiados
- Canales seguros para comunicación de preocupaciones
- Respuesta inmediata y eficaz ante cualquier comunicación de riesgo
- Evaluación y mejora continua de sistemas de protección`
      }
    ]
  },
  7: {
    titulo: 'Documentación y sistemas de registro',
    secciones: [
      {
        titulo: '1. MARCO LEGAL Y OBLIGACIONES DOCUMENTALES',
        contenido: `FUNDAMENTOS LEGALES DE LA DOCUMENTACIÓN:

OBLIGACIONES ESPECÍFICAS SEGÚN LOPIVI:
Artículo 20.4: "Las entidades que desarrollen actividades con personas menores de edad deberán llevar un registro de todas las actuaciones realizadas en el ámbito de sus competencias en materia de protección, que incluirá como mínimo":
- Registro de comunicaciones recibidas sobre situaciones de riesgo o desprotección
- Documentación de evaluaciones e investigaciones realizadas
- Registro de medidas de protección adoptadas y su seguimiento
- Comunicaciones enviadas a autoridades competentes y respuestas recibidas
- Documentación de seguimiento y evolución de casos gestionados
- Registro de formación impartida al personal en materia de protección

PRINCIPIOS FUNDAMENTALES DEL SISTEMA:
- VERACIDAD: Registro exclusivo de información contrastada y objetiva
- COMPLETITUD: Documentación de todas las actuaciones relevantes sin omisiones
- CRONOLOGÍA: Mantenimiento del orden temporal claro de acontecimientos
- TRAZABILIDAD: Capacidad de seguir el histórico completo de actuaciones
- ACCESIBILIDAD: Disponibilidad inmediata para autoridades competentes
- PROFESIONALIDAD: Redacción técnica comprensible para otros profesionales

TIPOS DE DOCUMENTACIÓN OBLIGATORIA:

1. LIBRO REGISTRO GENERAL DE ACTUACIONES:
- Numeración correlativa única de todos los casos
- Fecha de inicio de cada caso y fecha de cierre si procede
- Identificación del personal responsable de la gestión
- Tipología específica de la situación detectada
- Resumen de principales actuaciones realizadas
- Estado actual del caso y próximas actuaciones previstas

2. EXPEDIENTES INDIVIDUALES COMPLETOS:
- Ficha técnica del menor con datos básicos actualizados
- Cronología detallada de todas las actuaciones realizadas
- Archivo de comunicaciones enviadas y respuestas recibidas
- Informes técnicos de profesionales internos y externos
- Documentación de medidas adoptadas y evaluación de efectividad
- Registro continuo de seguimiento y evolución del caso`
      },
      {
        titulo: '2. PROTECCIÓN DE DATOS Y CONFIDENCIALIDAD',
        contenido: `APLICACIÓN DEL RGPD EN PROTECCIÓN INFANTIL:

BASES JURÍDICAS PARA TRATAMIENTO DE DATOS:
- Artículo 6.1.d RGPD: Intereses vitales del menor (protección de la vida)
- Artículo 6.1.c RGPD: Cumplimiento de obligación legal (LOPIVI)
- Artículo 6.1.e RGPD: Interés público esencial (protección infantil)
- Artículo 6.1.f RGPD: Intereses legítimos de protección no prevalentes

CATEGORÍAS ESPECIALES DE DATOS:
Los datos de protección infantil incluyen categorías especiales:
- Datos relativos a la salud física y mental del menor
- Datos sobre vida sexual del menor (en casos de abuso)
- Datos sobre origen étnico o racial si es relevante
- Datos sobre situación familiar y dinámicas relacionales
- Datos sobre condiciones socioeconómicas y vulnerabilidad
- Datos sobre antecedentes penales de adultos relacionados

MEDIDAS DE SEGURIDAD TÉCNICAS OBLIGATORIAS:
- Cifrado avanzado de datos en dispositivos y comunicaciones
- Sistemas de control de acceso mediante usuarios y contraseñas robustas
- Backup automático y seguro de información en servidores protegidos
- Software antivirus y firewall actualizados y monitorizados
- Registro automático de accesos y modificaciones con trazabilidad
- Sistemas de destrucción segura de documentación obsoleta

MEDIDAS ORGANIZATIVAS ESPECÍFICAS:
- Asignación clara de responsabilidades en protección de datos
- Formación específica y continua del personal en RGPD
- Procedimientos detallados de acceso a información confidencial
- Protocolos específicos de comunicación segura interna y externa
- Auditorías internas periódicas de cumplimiento normativo
- Designación de delegado de protección de datos si es requerido

DERECHOS DE LOS INTERESADOS:
- Información transparente sobre tratamiento de datos personales
- Acceso a datos personales con limitaciones por protección del menor
- Rectificación de datos inexactos con procedimiento específico
- Supresión de datos cuando sea legalmente posible
- Limitación del tratamiento en circunstancias específicas
- Portabilidad de datos con las limitaciones legales correspondientes`
      },
      {
        titulo: '3. SISTEMAS DE ARCHIVO Y CONSERVACIÓN',
        contenido: `PLAZOS LEGALES DE CONSERVACIÓN:

CRITERIOS PARA ESTABLECER PLAZOS:
- Normativa específica de protección de menores autonómica
- Plazos de prescripción de responsabilidades civiles y penales
- Normativa general de archivos administrativos aplicable
- Regulaciones autonómicas específicas sobre documentación social
- Criterios de interés histórico, científico o estadístico
- Necesidades de seguimiento a largo plazo de casos complejos

PLAZOS ESPECÍFICOS RECOMENDADOS POR TIPO:
- Casos sin intervención especializada: 5 años desde cierre definitivo
- Casos con intervención de servicios sociales: 10 años desde mayoría de edad
- Casos judicializados: 25 años desde resolución judicial firme
- Documentación de formación del personal: 10 años desde finalización
- Protocolos y procedimientos internos: 5 años desde modificación o actualización
- Comunicaciones con autoridades: Mismo plazo que el caso al que se refieren

FASES DEL SISTEMA DE ARCHIVO:

ARCHIVO DE GESTIÓN ACTIVA (0-2 años):
- Acceso inmediato y frecuente para seguimiento activo
- Ubicación en despacho del delegado o zona de trabajo
- Organización por casos activos y prioridad de actuación
- Consulta disponible en cualquier momento del horario laboral
- Actualizaciones continuas con nueva documentación
- Sistema de alertas para actuaciones pendientes

ARCHIVO INTERMEDIO DE CONSULTA (2-10 años):
- Acceso ocasional para consultas específicas o seguimiento
- Almacenamiento seguro en instalaciones de la entidad
- Organización cronológica, temática o por tipo de caso
- Inventario detallado de contenidos con sistema de localización
- Condiciones ambientales controladas para conservación
- Procedimiento específico para consulta por personal autorizado

ARCHIVO HISTÓRICO PERMANENTE (más de 10 años):
- Conservación de casos de especial relevancia o interés
- Transferencia a archivo histórico municipal o autonómico
- Digitalización para facilitar conservación y acceso
- Anonimización de datos personales cuando sea posible
- Mantenimiento para investigación, estadística o formación
- Protocolo de destrucción segura cuando expire el plazo legal`
      },
      {
        titulo: '4. AUDITORÍAS Y CONTROL DE CALIDAD',
        contenido: `PREPARACIÓN PARA INSPECCIONES OFICIALES:

DOCUMENTACIÓN DE PRESENTACIÓN OBLIGATORIA:
- Libro registro general actualizado con todos los casos gestionados
- Expedientes individuales completos y organizados por fecha
- Protocolos internos vigentes aprobados por la dirección
- Certificados y registros de formación de todo el personal
- Archivo completo de comunicaciones oficiales enviadas y recibidas
- Evidencias documentales del cumplimiento de medidas adoptadas
- Informes de evaluación interna y planes de mejora implementados

ORGANIZACIÓN PREVIA RECOMENDADA:
- Inventario actualizado y completo de toda la documentación disponible
- Sistema de localización rápida de cualquier expediente o documento
- Identificación y disponibilidad del personal técnico responsable
- Habilitación de espacios adecuados para revisión por inspectores
- Preparación de copias de documentos principales si son requeridas
- Cronograma de disponibilidad para entrevistas con responsables

SISTEMA DE AUDITORÍAS INTERNAS:

PERIODICIDAD Y ALCANCE:
- Revisión anual completa del sistema de gestión documental
- Evaluaciones trimestrales específicas de expedientes en curso
- Revisión mensual de protocolos y su correcta aplicación
- Evaluación continua de casos nuevos y su documentación
- Análisis específico tras incidentes relevantes o complejos
- Revisión de cumplimiento normativo tras cambios legislativos

INDICADORES DE CALIDAD ESPECÍFICOS:
- Tiempo medio de respuesta a comunicaciones recibidas
- Porcentaje de casos con resolución satisfactoria documentada
- Nivel de cumplimiento de protocolos internos establecidos
- Grado de coordinación efectiva interinstitucional logrado
- Efectividad de la formación impartida medida por evaluaciones
- Índice de satisfacción de familias con el proceso de gestión

SISTEMA DE MEJORA CONTINUA:
- Identificación sistemática de fortalezas y áreas de mejora
- Análisis de tendencias en tipología y evolución de casos
- Evaluación crítica de la efectividad de protocolos actuales
- Detección proactiva de necesidades formativas emergentes
- Identificación de oportunidades de mejora en coordinación
- Implementación de ciclos de mejora continua con seguimiento

EVALUACIÓN DE RESULTADOS E IMPACTO:
- Medición de indicadores de protección efectiva de menores
- Análisis de tiempos de respuesta y efectividad de intervenciones
- Evaluación de la calidad de coordinación interinstitucional
- Medición del impacto de formación en la calidad del trabajo
- Análisis de satisfacción de familias y menores atendidos
- Evaluación del cumplimiento de objetivos anuales de protección`
      }
    ]
  },
  8: {
    titulo: 'Casos prácticos y evaluación final',
    secciones: [
      {
        titulo: '1. ANÁLISIS DE CASOS COMPLEJOS MULTIFACTORIALES',
        contenido: `CASO PRÁCTICO 1: MALTRATO INTRAFAMILIAR CON RESISTENCIAS:

DESCRIPCIÓN DETALLADA:
Menor de 10 años, María, que presenta múltiples indicadores de maltrato físico y emocional. La familia tiene antecedentes de tres intervenciones previas de servicios sociales, pero han mostrado resistencia activa y hostilidad hacia el sistema de protección. El menor ha relatado episodios de violencia física por parte del padre, pero retracta sus declaraciones cuando aumenta la presión familiar. La madre muestra signos de victimización pero niega los hechos.

FACTORES DE COMPLEJIDAD IDENTIFICADOS:
- Resistencia activa y organizada de la familia al sistema de protección
- Inconsistencia sistemática en los relatos del menor bajo presión
- Historial de tres intervenciones previas consideradas fallidas
- Presión social del entorno comunitario favorable a la familia
- Recursos institucionales limitados para intervención intensiva prolongada
- Indicadores de maltrato hacia la madre que complican la situación

ACTUACIÓN PROFESIONAL DESARROLLADA:
1. Documentación exhaustiva y sistemática de todos los indicadores físicos y emocionales
2. Coordinación intensiva y continuada con servicios sociales especializados y fiscalía
3. Implementación de medidas específicas de protección en el centro educativo
4. Gestión de apoyo psicológico especializado externo para el menor
5. Trabajo específico con la red social de apoyo familiar disponible
6. Mantenimiento de seguimiento intensivo durante 18 meses continuados

RESULTADO Y EVOLUCIÓN:
Implementación exitosa de medidas de protección con permanencia del menor en familia bajo supervisión judicial. Mejora significativa y documentada en indicadores de bienestar físico y emocional. Cambio gradual en dinámicas familiares con apoyo terapéutico continuado y supervisión.

LECCIONES PROFESIONALES APRENDIDAS:
- La persistencia profesional coordinada es fundamental en casos complejos
- La coordinación interinstitucional sólida puede superar resistencias familiares
- El apoyo al menor debe mantenerse independientemente de la evolución familiar
- La documentación rigurosa y continua es clave para la protección legal efectiva
- Los cambios familiares profundos requieren tiempo prolongado y apoyo sostenido profesional`
      },
      {
        titulo: '2. SIMULACIONES DE CRISIS Y RESPUESTA INMEDIATA',
        contenido: `SIMULACRO 1: REVELACIÓN DURANTE ACTIVIDAD NORMAL

SITUACIÓN ESPECÍFICA:
Durante una actividad deportiva, un menor de 12 años, Carlos, se acerca durante el descanso y te dice en voz baja: "Mi padre me pega con el cinturón cuando llego tarde a casa y ayer me dijo que si se lo cuento a alguien me va a pasar algo mucho peor. No sé qué hacer".

ACTUACIÓN INMEDIATA PROFESIONAL REQUERIDA:
1. Mantener absoluta calma exterior y agradecer expresamente la confianza mostrada
2. Trasladar de forma natural al menor a un espacio privado y seguro
3. Escuchar activamente sin realizar preguntas dirigidas o sugestivas
4. Tranquilizar al menor sobre su seguridad inmediata en la entidad
5. Explicar que no puedes prometer confidencialidad absoluta pero sí protección
6. Documentar inmediatamente y de forma literal las palabras exactas utilizadas

PROTOCOLO DE EMERGENCIA ESPECÍFICO:
- Evaluación inmediata del riesgo de represalias al retornar al domicilio
- Comunicación telefónica urgente a servicios sociales en la primera hora
- Información inmediata a dirección del centro y activación de protocolo
- Implementación de medidas de protección y supervisión en la entidad
- Evaluación de necesidad de coordinación con familia si no implica riesgo
- Mantenimiento de seguimiento visual cercano en las próximas horas críticas

SIMULACRO 2: DETECCIÓN DE NEGLIGENCIA GRAVE CONTINUADA

SITUACIÓN ESPECÍFICA:
Menor de 6 años, Ana, que llega habitualmente al centro sin desayunar, con ropa sucia y signos evidentes de cansancio extremo. Al preguntarle con cuidado, dice que "mamá duerme mucho y no se levanta por las mañanas" y que ella se prepara sola para venir. Observas que tiene hambre constante.

EVALUACIÓN PROFESIONAL REQUERIDA:
- Indicadores claros de negligencia en cuidados básicos esenciales
- Posible problemática de salud mental materna no tratada
- Menor asumiendo responsabilidades claramente inadecuadas para su edad
- Riesgo evidente para el desarrollo físico, emocional y cognitivo
- Necesidad urgente de intervención de apoyo y evaluación familiar especializada

ACTUACIÓN PROFESIONAL STEP-BY-STEP:
1. Documentación inmediata de todos los indicadores observados
2. Evaluación de necesidades básicas inmediatas del menor
3. Comunicación a servicios sociales en 24 horas máximo
4. Coordinación con servicios de salud para evaluación
5. Implementación de medidas de apoyo básico en la entidad
6. Seguimiento intensivo de evolución y respuesta institucional`
      },
      {
        titulo: '3. ANÁLISIS CRÍTICO DE CASOS REALES DOCUMENTADOS',
        contenido: `CASO REAL 1: DETECCIÓN PRECOZ DE ABUSO SEXUAL

CONTEXTO INSTITUCIONAL:
Centro deportivo juvenil municipal. Menor de 11 años, David, participante habitual en actividades de natación. Cambio súbito y radical de comportamiento: retraimiento social, negativa absoluta a participar en vestuarios compartidos, evitación de contacto físico en actividades.

PROCESO DE DETECCIÓN PROFESIONAL:
- Observación sistemática y documentada durante 2 semanas consecutivas
- Consulta discreta con otros monitores sobre cambios observados
- Entrevista individual cuidadosa en ambiente seguro y privado
- Revelación gradual y espontánea de abuso sexual por familiar cercano
- Activación inmediata y coordinada de todos los protocolos establecidos

COORDINACIÓN INTERINSTITUCIONAL DESARROLLADA:
- Comunicación inmediata a fiscalía especializada en menores
- Coordinación estrecha con servicios sociales especializados en abuso
- Gestión de apoyo psicológico especializado en trauma sexual
- Trabajo intensivo con familia no agresora para apoyo y protección
- Mantenimiento de seguimiento a largo plazo coordinado

RESULTADO Y EVOLUCIÓN DOCUMENTADA:
- Protección inmediata y efectiva del menor con medidas cautelares
- Proceso judicial exitoso con condena del agresor
- Recuperación terapéutica progresiva y continuada del menor
- Mantenimiento en actividad deportiva como factor protector clave
- Fortalecimiento de protocolos del centro basado en lecciones aprendidas

CASO REAL 2: INTERVENCIÓN EN NEGLIGENCIA FAMILIAR SEVERA

CONTEXTO ESPECÍFICO:
Centro educativo público. Menor de 7 años, Sofía, con absentismo escolar frecuente y continuado, higiene personal deficiente persistente, problemas evidentes de alimentación y retrasos significativos en desarrollo cognitivo y social.

PROCESO DE INTERVENCIÓN DESARROLLADO:
- Evaluación multidisciplinar completa de la situación familiar
- Implementación de trabajo de apoyo familiar intensivo y especializado
- Coordinación efectiva con servicios sanitarios para evaluación médica
- Desarrollo de programa específico de apoyo educativo individualizado
- Mantenimiento de seguimiento continuado de evolución familiar

EVOLUCIÓN POSITIVA DOCUMENTADA:
- Mejora gradual pero sostenida en cuidados básicos del menor
- Estabilización progresiva de asistencia escolar regular
- Apoyo psicosocial continuado a la familia con resultados positivos
- Vinculación efectiva con recursos comunitarios de apoyo
- Mantenimiento exitoso de unidad familiar con supervisión especializada`
      },
      {
        titulo: '4. EVALUACIÓN FINAL INTEGRAL DE COMPETENCIAS',
        contenido: `CASO PRÁCTICO FINAL PARA RESOLUCIÓN COMPLETA:

SITUACIÓN PROFESIONAL COMPLEJA:
Eres delegado de protección en una entidad deportiva municipal. Durante las últimas dos semanas has observado cambios significativos en un menor de 9 años, Pablo: aislamiento social progresivo, bajada notable del rendimiento en actividades, marcas de lesiones en brazos que justifica con explicaciones inconsistentes y contradictorias. Esta mañana se ha acercado a ti visiblemente nervioso diciendo que "necesita hablar de algo muy importante pero tiene mucho miedo de lo que pueda pasar".

EVALUACIÓN PROFESIONAL REQUERIDA:

1. ANÁLISIS INICIAL COMPLETO:
- Describe detalladamente los pasos inmediatos que implementarías
- Explica específicamente cómo abordarías la conversación inicial con el menor
- Identifica y categoriza todos los indicadores de riesgo presentes
- Evalúa profesionalmente el nivel de urgencia de la situación
- Establece prioridades de actuación basadas en el riesgo detectado

2. DESARROLLO DE PROTOCOLO DE ACTUACIÓN:
- Desarrolla un plan completo de actuación paso a paso
- Identifica específicamente a qué organismos comunicarías y en qué plazos
- Especifica detalladamente qué información incluirías en cada comunicación
- Describe las medidas concretas de protección inmediata que adoptarías
- Establece cronograma de actuaciones con responsables asignados

3. COORDINACIÓN INTERINSTITUCIONAL:
- Explica detalladamente cómo coordinarías con otros profesionales especializados
- Describe el sistema de seguimiento que implementarías
- Identifica específicamente los recursos internos y externos que necesitarías
- Planifica la evolución del caso a medio y largo plazo
- Establece indicadores de éxito y criterios de evaluación

4. SISTEMA DE DOCUMENTACIÓN:
- Especifica qué documentos generarías y su estructura
- Describe cómo organizarías el expediente para máxima eficacia
- Explica las medidas específicas de confidencialidad que aplicarías
- Detalla el sistema de registro que utilizarías para trazabilidad
- Establece procedimientos de archivo y conservación

CRITERIOS DE EVALUACIÓN FINAL:
- Conocimientos técnicos aplicados (25%): Dominio de normativa y procedimientos
- Habilidades prácticas demostradas (25%): Capacidad de aplicación real
- Actitudes profesionales evidenciadas (25%): Ética, responsabilidad y compromiso
- Capacidad de síntesis y coordinación (25%): Visión integral y sistemática

CERTIFICACIÓN PROFESIONAL:
Una vez superada esta evaluación integral con calificación mínima del 75%, habrás demostrado competencia técnica y profesional para ejercer como delegado de protección según los estándares establecidos por la LOPIVI y las mejores prácticas profesionales del sector.`
      }
    ]
  }
};

export default function FormacionDelegadoPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [moduloActual, setModuloActual] = useState(1);
  const [seccionActual, setSeccionActual] = useState(0);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    // Verificar sesión del login de delegados
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);
        setUsuario(userData);

        // Si no tiene tipo de entidad, redirigir al selector
        if (!userData.tipoEntidad) {
          router.push('/selector-entidad');
          return;
        }
      } catch (error) {
        console.error('Error loading session:', error);
        router.push('/login-delegados');
      }
    } else {
      router.push('/login-delegados');
    }
    setLoading(false);
  }, [router]);

  // Función para obtener contenido personalizado según tipo de entidad
  const getContenidoPersonalizado = (contenidoBase: string, tipoEntidad: string) => {
    const personalizaciones: { [key: string]: { [key: string]: string } } = {
      deportivo: {
        'ENTORNO_EJEMPLO': 'club deportivo',
        'ACTIVIDAD_EJEMPLO': 'entrenamientos y competiciones',
        'PROFESIONAL_EJEMPLO': 'entrenador',
        'SITUACION_EJEMPLO': 'vestuarios y desplazamientos'
      },
      educativo: {
        'ENTORNO_EJEMPLO': 'centro educativo',
        'ACTIVIDAD_EJEMPLO': 'clases y actividades extraescolares',
        'PROFESIONAL_EJEMPLO': 'profesor',
        'SITUACION_EJEMPLO': 'aulas y pasillos'
      },
      religioso: {
        'ENTORNO_EJEMPLO': 'parroquia o grupo religioso',
        'ACTIVIDAD_EJEMPLO': 'catequesis y actividades pastorales',
        'PROFESIONAL_EJEMPLO': 'catequista',
        'SITUACION_EJEMPLO': 'sacristía y salones parroquiales'
      },
      ocio: {
        'ENTORNO_EJEMPLO': 'campamento o centro de ocio',
        'ACTIVIDAD_EJEMPLO': 'juegos y talleres recreativos',
        'PROFESIONAL_EJEMPLO': 'monitor',
        'SITUACION_EJEMPLO': 'cabañas y zonas de actividades'
      }
    };

    let contenidoPersonalizado = contenidoBase;
    const personalizacion = personalizaciones[tipoEntidad] || personalizaciones['deportivo'];

    Object.entries(personalizacion).forEach(([clave, valor]) => {
      contenidoPersonalizado = contenidoPersonalizado.replace(new RegExp(clave, 'g'), valor);
    });

    return contenidoPersonalizado;
  };

  // Función para generar PDF de un módulo
  const generarPDFModulo = (numeroModulo: number) => {
    const modulo = formacionData[numeroModulo as keyof typeof formacionData];
    const doc = new jsPDF();

    // Configuración inicial
    doc.setFont('helvetica');
    let yPos = 20;
    const margenIzq = 20;
    const anchoLinea = 170;

    // Título del documento
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FORMACIÓN DELEGADO DE PROTECCIÓN LOPIVI', margenIzq, yPos);
    yPos += 10;

    // Información del usuario
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Usuario: ${usuario?.nombre || ''} | Entidad: ${usuario?.entidad || ''}`, margenIzq, yPos);
    doc.text(`Tipo: ${usuario?.tipoEntidad || ''} | Fecha: ${new Date().toLocaleDateString()}`, margenIzq, yPos + 5);
    yPos += 20;

    // Título del módulo
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`MÓDULO ${numeroModulo}: ${modulo.titulo.toUpperCase()}`, margenIzq, yPos);
    yPos += 15;

    // Contenido de las secciones
    modulo.secciones.forEach((seccion, index) => {
      // Verificar si necesitamos nueva página
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Título de la sección
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const tituloSeccion = doc.splitTextToSize(seccion.titulo, anchoLinea);
      doc.text(tituloSeccion, margenIzq, yPos);
      yPos += tituloSeccion.length * 5 + 5;

      // Contenido de la sección (personalizado)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const contenidoPersonalizado = getContenidoPersonalizado(seccion.contenido, usuario?.tipoEntidad || 'deportivo');
      const lineasContenido = doc.splitTextToSize(contenidoPersonalizado, anchoLinea);

      lineasContenido.forEach((linea: string) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(linea, margenIzq, yPos);
        yPos += 4;
      });

      yPos += 10;
    });

    // Pie de página
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Custodia360 - Sistema de Formación LOPIVI', margenIzq, 290);
      doc.text(`Página ${i} de ${totalPages}`, 150, 290);
    }

    // Descargar
    doc.save(`Modulo_${numeroModulo}_${modulo.titulo.replace(/\s+/g, '_')}.pdf`);
  };

  // Función para descargar todos los módulos
  const descargarTodosModulos = () => {
    const confirmacion = window.confirm('¿Deseas descargar todos los módulos en PDF? Se generarán 8 archivos separados.');
    if (confirmacion) {
      Object.keys(formacionData).forEach((numero, index) => {
        setTimeout(() => {
          generarPDFModulo(parseInt(numero));
        }, index * 1000); // Retraso de 1 segundo entre descargas
      });
    }
  };

  useEffect(() => {
    // Calcular progreso total
    const totalSecciones = Object.values(formacionData).reduce((total, modulo) => {
      return total + modulo.secciones.length;
    }, 0);

    let seccionesCompletadas = 0;
    for (let i = 1; i < moduloActual; i++) {
      seccionesCompletadas += formacionData[i as keyof typeof formacionData].secciones.length;
    }
    seccionesCompletadas += seccionActual;

    const porcentajeProgreso = Math.round((seccionesCompletadas / totalSecciones) * 100);
    setProgreso(porcentajeProgreso);
  }, [moduloActual, seccionActual]);

  const avanzarSeccion = () => {
    const moduloActualData = formacionData[moduloActual as keyof typeof formacionData];
    if (seccionActual < moduloActualData.secciones.length - 1) {
      setSeccionActual(seccionActual + 1);
    } else if (moduloActual < 8) {
      setModuloActual(moduloActual + 1);
      setSeccionActual(0);
    }
  };

  const retrocederSeccion = () => {
    if (seccionActual > 0) {
      setSeccionActual(seccionActual - 1);
    } else if (moduloActual > 1) {
      setModuloActual(moduloActual - 1);
      const moduloAnterior = formacionData[(moduloActual - 1) as keyof typeof formacionData];
      setSeccionActual(moduloAnterior.secciones.length - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2563EB]"></div>
          <p className="mt-4 text-gray-600">Cargando formación...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  const moduloActualData = formacionData[moduloActual as keyof typeof formacionData];
  const seccionActualData = moduloActualData.secciones[seccionActual];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Formación Delegado de Protección LOPIVI
              </h1>
              <p className="text-gray-600 mt-1">
                Usuario: {usuario.email} | Entidad: {usuario.tipoEntidad || 'No especificada'}
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard-entidad')}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <FormacionProgressBar progreso={progreso} />

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Module Header */}
          <div className="bg-[#2563EB] text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Módulo {moduloActual}: {moduloActualData.titulo}
                </h2>
                <p className="text-blue-100 mt-1">
                  Sección {seccionActual + 1} de {moduloActualData.secciones.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Progreso general</p>
                <p className="text-2xl font-bold">{progreso}%</p>
              </div>
            </div>
          </div>

          {/* Section Content */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {seccionActualData.titulo}
              </h3>
              <button
                onClick={() => generarPDFModulo(moduloActual)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                📄 Descargar Módulo PDF
              </button>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {getContenidoPersonalizado(seccionActualData.contenido, usuario?.tipoEntidad || 'deportivo')}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <button
              onClick={retrocederSeccion}
              disabled={moduloActual === 1 && seccionActual === 0}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
            >
              ← Anterior
            </button>

            <div className="text-sm text-gray-600">
              {Object.keys(formacionData).map((mod) => (
                <span
                  key={mod}
                  className={`inline-block w-3 h-3 rounded-full mx-1 ${
                    parseInt(mod) < moduloActual
                      ? 'bg-green-500'
                      : parseInt(mod) === moduloActual
                      ? 'bg-[#2563EB]'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {moduloActual === 8 && seccionActual === moduloActualData.secciones.length - 1 ? (
              <button
                onClick={() => router.push('/test-delegado')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Ir al Test de Evaluación →
              </button>
            ) : (
              <button
                onClick={avanzarSeccion}
                className="bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Siguiente →
              </button>
            )}
          </div>
        </div>

        {/* Module Summary */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Contenido del módulo:</h4>
          <div className="grid gap-2">
            {moduloActualData.secciones.map((seccion, index) => (
              <div
                key={index}
                onClick={() => setSeccionActual(index)}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  index === seccionActual
                    ? 'bg-[#2563EB] text-white'
                    : index < seccionActual
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    {index + 1}. {seccion.titulo}
                  </span>
                  {index < seccionActual && (
                    <span className="ml-auto">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de PDFs */}
        <div className="mt-6 bg-green-50 rounded-lg shadow p-6 border border-green-200">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                📄 Descarga de Módulos en PDF
              </h4>
              <div className="text-sm text-green-800 space-y-1">
                <p>• <strong>Estudia offline:</strong> Descarga los módulos para leer en papel</p>
                <p>• <strong>Contenido personalizado:</strong> PDFs adaptados a tu tipo de entidad ({usuario?.tipoEntidad})</p>
                <p>• <strong>Formato profesional:</strong> Documentos listos para imprimir</p>
                <p>• <strong>Acceso permanente:</strong> Conserva los materiales para futuras consultas</p>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => generarPDFModulo(moduloActual)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors block w-full"
              >
                📄 Descargar Módulo Actual
              </button>
              <button
                onClick={descargarTodosModulos}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors block w-full"
              >
                📚 Descargar Todos los Módulos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
