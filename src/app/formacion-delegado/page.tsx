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
- Lesiones físicas graves o que requieran atención médica
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

// Datos específicos para PDFs diferenciados
const pdfEspecificos = {
  1: {
    'ley-lopivi-completa': {
      titulo: 'Ley LOPIVI Completa - Texto Legal y Análisis',
      contenido: `TEXTO COMPLETO DE LA LEY ORGÁNICA 8/2021

LEY ORGÁNICA 8/2021, de 4 de junio, de protección integral a la infancia y la adolescencia frente a la violencia.

PREÁMBULO:
La Convención sobre los Derechos del Niño, adoptada por la Asamblea General de las Naciones Unidas el 20 de noviembre de 1989 y ratificada por España el 30 de noviembre de 1990, establece que los Estados Partes adoptarán todas las medidas legislativas, administrativas, sociales y educativas apropiadas para proteger al niño contra toda forma de perjuicio o abuso físico o mental, descuido o trato negligente, malos tratos o explotación, incluido el abuso sexual, mientras el niño se encuentre bajo la custodia de los padres, de un representante legal o de cualquier otra persona que lo tenga a su cargo.

TÍTULO I - DISPOSICIONES GENERALES

Artículo 1. Objeto.
Esta ley tiene por objeto garantizar los derechos fundamentales de los niños, niñas y adolescentes a su integridad física, psíquica, psicológica y moral frente a cualquier forma de violencia, asegurando el libre desarrollo de su personalidad y estableciendo medidas de protección integral, que incluyan la sensibilización, la prevención, la detección precoz, la protección y la reparación del daño en todos los ámbitos en los que se desarrolla su vida.

Artículo 2. Ámbito de aplicación.
Esta ley será de aplicación a todas las personas menores de dieciocho años que se encuentren en territorio español, sin perjuicio de lo establecido en los tratados internacionales de los que España sea parte y en las normas de Derecho internacional privado.

ANÁLISIS DETALLADO POR ARTÍCULOS:

El artículo 3 establece los principios rectores de la actuación administrativa, judicial y de los poderes públicos en general. Entre estos principios destacan:
- El interés superior del menor
- La promoción, protección y garantía de los derechos de la infancia
- La vida, supervivencia y desarrollo del menor
- La protección del menor frente a cualquier forma de violencia

IMPLEMENTACIÓN PRÁCTICA EN ENTIDADES:

Las entidades que desarrollen actividades dirigidas a menores de edad deberán adoptar las siguientes medidas organizativas para la protección de la infancia y la adolescencia:

1. Políticas internas de protección
2. Medidas para el desarrollo de espacios de confianza
3. Canales de comunicación accesibles para menores
4. Protocolos de actuación ante situaciones de violencia
5. Formación específica para el personal

MARCO SANCIONADOR:

La ley establece un régimen sancionador específico para garantizar el cumplimiento de las obligaciones establecidas, con multas que pueden oscilar entre 10.001 y 100.000 euros en los casos más graves.`
    },
    'resumen-ejecutivo': {
      titulo: 'Resumen Ejecutivo - Puntos Clave LOPIVI',
      contenido: `RESUMEN EJECUTIVO: LEY ORGÁNICA 8/2021 LOPIVI

PUNTOS CLAVE PARA DELEGADOS DE PROTECCIÓN

1. DEFINICIÓN DE VIOLENCIA CONTRA LA INFANCIA:
La LOPIVI define violencia como "cualquier acción, omisión o trato negligente, no accidental, que prive a la persona menor de edad de sus derechos y bienestar, que amenace o interfiera su ordenado desarrollo físico, psíquico o social".

2. OBLIGACIONES PARA ENTIDADES:
- Designar un delegado de protección
- Establecer políticas internas de protección
- Crear espacios de confianza para menores
- Implementar canales de comunicación accesibles
- Desarrollar protocolos de actuación
- Formar al personal en protección infantil

3. FUNCIONES DEL DELEGADO DE PROTECCIÓN:
• Promover medidas de buen trato hacia la infancia
• Coordinar casos de riesgo o maltrato
• Comunicar situaciones de riesgo a autoridades
• Formar al personal de la entidad
• Supervisar aplicación de protocolos

4. PROCEDIMIENTOS DE COMUNICACIÓN:
- Plazo máximo de comunicación: 24 horas
- Autoridades competentes: Servicios sociales y Fiscalía
- Documentación obligatoria detallada
- Seguimiento posterior del caso

5. MEDIDAS DE PROTECCIÓN:
- Evaluación inmediata del riesgo
- Implementación de medidas cautelares
- Coordinación con servicios especializados
- Seguimiento continuado

6. FORMACIÓN OBLIGATORIA:
- Capacitación específica en protección infantil
- Actualización continua de conocimientos
- Certificación de competencias
- Evaluación periódica

7. MARCO SANCIONADOR:
- Infracciones leves: hasta 10.000€
- Infracciones graves: 10.001€ a 50.000€
- Infracciones muy graves: 50.001€ a 100.000€

IMPLEMENTACIÓN PRÁCTICA INMEDIATA:

Para cumplir con la LOPIVI, su entidad debe:
✓ Designar delegado principal y suplente
✓ Redactar política interna de protección
✓ Establecer canal de comunicación seguro
✓ Formar a todo el personal
✓ Crear protocolo de actuación específico
✓ Documentar todas las actuaciones`
    },
    'infografia': {
      titulo: 'Infografía Visual - LOPIVI en Acción',
      contenido: `INFOGRAFÍA VISUAL: LOPIVI EN ACCIÓN

[DIAGRAMA DE FLUJO PARA DELEGADOS]

┌─────────────────────────────────────┐
│        DETECCIÓN DE RIESGO          │
│                                     │
│  • Observación directa              │
│  • Comunicación del menor           │
│  • Denuncia de terceros            │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│     EVALUACIÓN INMEDIATA            │
│                                     │
│  ¿Existe riesgo inmediato?          │
│                                     │
│    SÍ ──────────── NO               │
└─────┬───────────────┬───────────────┘
      │               │
      ▼               ▼
┌───────────┐   ┌─────────────────┐
│EMERGENCIA │   │ PROCEDIMIENTO   │
│(112)      │   │ ESTÁNDAR        │
│           │   │ (24 horas)      │
└───────────┘   └─────────────────┘
      │               │
      └───────┬───────┘
              │
              ▼
┌─────────────────────────────────────┐
│    COMUNICACIÓN AUTORIDADES         │
│                                     │
│  1. Servicios Sociales              │
│  2. Fiscalía (casos graves)         │
│  3. Documentación completa          │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      SEGUIMIENTO Y APOYO            │
│                                     │
│  • Coordinación interinstitucional  │
│  • Medidas de protección           │
│  • Documentación continua          │
└─────────────────────────────────────┘

TIPOS DE VIOLENCIA RECONOCIDOS:

🔴 MALTRATO FÍSICO
- Lesiones no accidentales
- Golpes, empujones, zarandeos
- Uso excesivo de fuerza

🟠 MALTRATO PSICOLÓGICO
- Humillaciones públicas
- Amenazas e intimidación
- Rechazo emocional

🟡 NEGLIGENCIA
- Falta de cuidados básicos
- Abandono de necesidades
- Supervisión inadecuada

🔵 ABUSO SEXUAL
- Contacto sexual inapropiado
- Exposición a material sexual
- Explotación sexual

INDICADORES CLAVE DE ALERTA:

FÍSICOS:
→ Lesiones inexplicables
→ Marcas en zonas no expuestas
→ Miedo al contacto físico
→ Higiene deficiente

EMOCIONALES:
→ Cambios de comportamiento
→ Regresión evolutiva
→ Conductas autolesivas
→ Miedo a personas específicas

SOCIALES:
→ Aislamiento de compañeros
→ Absentismo frecuente
→ Conocimiento sexual inadecuado
→ Comportamiento extremo

PROTOCOLO RÁPIDO DELEGADO:

PASO 1: OBSERVAR Y DOCUMENTAR
→ Registrar fecha, hora, lugar
→ Descripción objetiva
→ Testigos presentes

PASO 2: EVALUAR RIESGO
→ ¿Peligro inmediato?
→ ¿Necesita atención médica?
→ ¿Agresor con acceso al menor?

PASO 3: ACTUAR
→ Proteger al menor
→ Comunicar a autoridades
→ Documentar actuaciones

PASO 4: SEGUIR
→ Coordinar con servicios
→ Implementar medidas
→ Evaluar evolución`
    }
  },
  2: {
    'marco-legal-deportivo': {
      titulo: 'Marco Legal Específico para Entidades Deportivas',
      contenido: `MARCO LEGAL DEPORTIVO Y PROTECCIÓN DE MENORES

LEY DEL DEPORTE Y LOPIVI: INTERSECCIÓN NORMATIVA

FUNDAMENTOS LEGALES:
La Ley 39/2022, de 30 de diciembre, del Deporte, en su artículo 78, establece que las federaciones y clubes deportivos deben adoptar medidas específicas para la protección de los deportistas menores de edad.

OBLIGACIONES ESPECÍFICAS PARA CLUBES DEPORTIVOS:

1. DESIGNACIÓN DE DELEGADO DE PROTECCIÓN:
- Obligatorio en clubes con actividades para menores
- Formación específica acreditada
- Funciones claramente definidas en estatutos

2. PROTOCOLO DE PROTECCIÓN DEPORTIVO:
- Vestuarios y zonas de cambio seguras
- Supervisión en desplazamientos
- Control de acceso a instalaciones
- Medidas en concentraciones deportivas

3. ESPACIOS FÍSICOS SEGUROS:
- Diseño transparente de instalaciones
- Eliminación de zonas aisladas sin supervisión
- Control de acceso restringido
- Videovigilancia en zonas comunes

SITUACIONES DE RIESGO ESPECÍFICAS EN EL DEPORTE:

A) VESTUARIOS Y DUCHAS:
- Supervisión adecuada por personal autorizado
- Prohibición de adultos no autorizados
- Protocolos específicos por edades
- Respeto a la intimidad y privacidad

B) DESPLAZAMIENTOS:
- Autorización parental obligatoria
- Acompañamiento de adultos responsables
- Registro de participantes y responsables
- Protocolo de emergencia durante viajes

C) CONCENTRACIONES Y CAMPAMENTOS:
- Alojamiento segregado por edades y sexo
- Supervisión 24 horas por personal formado
- Protocolos nocturnos específicos
- Canal de comunicación con familias

D) ENTRENAMIENTO INDIVIDUAL:
- Prohibición de entrenamientos a solas
- Presencia de otro adulto o deportista
- Espacios visibles y accesibles
- Documentación de sesiones individuales

RESPONSABILIDADES DEL DELEGADO EN CLUBES:

• FORMACIÓN ESPECÍFICA DEPORTIVA:
- Conocimiento de dinámicas deportivas
- Identificación de situaciones de riesgo específicas
- Protocolos de actuación en competiciones
- Coordinación con técnicos deportivos

• COORDINACIÓN CON FEDERACIONES:
- Comunicación de incidentes graves
- Seguimiento de casos detectados
- Aplicación de medidas disciplinarias
- Colaboración en investigaciones

• TRABAJO CON ENTRENADORES:
- Formación en protección infantil
- Supervisión de métodos de entrenamiento
- Detección de prácticas inadecuadas
- Establecimiento de límites apropiados

PROTOCOLOS ESPECÍFICOS POR MODALIDAD:

DEPORTES DE CONTACTO:
- Supervisión de técnicas de entrenamiento
- Límites claros en contacto físico
- Prevención de violencia deportiva
- Atención médica inmediata a lesiones

DEPORTES ACUÁTICOS:
- Supervisión constante en vestuarios
- Protocolos de salvamento y emergencia
- Control de acceso a instalaciones acuáticas
- Medidas especiales de privacidad

DEPORTES DE RESISTENCIA:
- Control de métodos de entrenamiento
- Prevención de sobreesfuerzo
- Supervisión nutricional
- Atención a signos de agotamiento

PROCEDIMIENTOS DISCIPLINARIOS:

1. INFRACCIONES DEPORTIVAS CON COMPONENTE DE PROTECCIÓN:
- Trato inadecuado a menores deportistas
- Incumplimiento de protocolos de protección
- Comportamiento inapropiado en instalaciones

2. MEDIDAS CAUTELARES ESPECÍFICAS:
- Suspensión temporal de funciones
- Prohibición de acceso a instalaciones
- Supervisión reforzada durante competiciones

3. COORDINACIÓN CON AUTORIDADES DEPORTIVAS:
- Comunicación a comité disciplinario
- Colaboración con inspectores deportivos
- Seguimiento de resoluciones federativas`
    },
    'obligaciones-clubes-lopivi': {
      titulo: 'Obligaciones Específicas de Clubes según LOPIVI',
      contenido: `OBLIGACIONES LEGALES DE CLUBES DEPORTIVOS SEGÚN LOPIVI

CUMPLIMIENTO NORMATIVO ESPECÍFICO PARA ENTIDADES DEPORTIVAS

1. OBLIGACIONES ORGANIZATIVAS:

A) ESTRUCTURA DE PROTECCIÓN:
✓ Designación de delegado principal de protección
✓ Designación de delegado suplente
✓ Definición clara de responsabilidades
✓ Integración en organigrama del club

B) POLÍTICAS INTERNAS:
✓ Redacción de política de protección infantil
✓ Código de conducta específico para staff
✓ Procedimientos disciplinarios internos
✓ Protocolos de comunicación con familias

C) ESPACIOS SEGUROS:
✓ Adecuación de instalaciones deportivas
✓ Eliminación de zonas de riesgo
✓ Control de acceso a vestuarios
✓ Supervisión de zonas comunes

2. OBLIGACIONES FORMATIVAS:

A) PERSONAL TÉCNICO:
- Formación inicial en protección infantil (mínimo 8 horas)
- Actualización anual obligatoria (4 horas)
- Certificación de competencias
- Evaluación periódica de conocimientos

B) PERSONAL AUXILIAR:
- Formación básica en protección (4 horas)
- Conocimiento de protocolos básicos
- Capacitación en detección de indicadores
- Actualización bienal

C) VOLUNTARIOS:
- Formación específica previa al inicio
- Supervisión por personal formado
- Limitación de responsabilidades con menores
- Seguimiento continuo de actuación

3. OBLIGACIONES DOCUMENTALES:

A) REGISTRO DE PERSONAL:
✓ Certificado de antecedentes penales
✓ Certificación de formación en protección
✓ Autorizaciones específicas para trabajar con menores
✓ Evaluaciones periódicas de idoneidad

B) REGISTRO DE ACTIVIDADES:
✓ Listado de menores participantes
✓ Autorizaciones parentales actualizadas
✓ Registro de incidencias y actuaciones
✓ Documentación de comunicaciones oficiales

C) PROTOCOLOS DOCUMENTADOS:
✓ Procedimiento de detección de riesgo
✓ Protocolo de comunicación a autoridades
✓ Sistema de seguimiento de casos
✓ Procedimientos de emergencia

4. OBLIGACIONES DE COMUNICACIÓN:

A) CON AUTORIDADES:
- Comunicación inmediata de sospechas (24h máximo)
- Colaboración con investigaciones oficiales
- Remisión de documentación requerida
- Seguimiento de casos comunicados

B) CON FAMILIAS:
- Información sobre política de protección
- Comunicación de incidencias relevantes
- Transparencia en procedimientos
- Canales de comunicación accesibles

C) CON MENORES:
- Información adaptada sobre derechos
- Canales seguros de comunicación
- Respuesta a consultas y denuncias
- Protección de confidencialidad

5. OBLIGACIONES DE SUPERVISIÓN:

A) ACTIVIDADES DEPORTIVAS:
- Supervisión directa durante entrenamientos
- Control de ratio adulto/menor apropiado
- Supervisión de interacciones adulto-menor
- Prevención de situaciones de riesgo

B) ACTIVIDADES COMPLEMENTARIAS:
- Supervisión en desplazamientos
- Control en concentraciones deportivas
- Supervisión en competiciones
- Seguimiento en actividades sociales

6. OBLIGACIONES SANCIONADORAS:

A) RÉGIMEN DISCIPLINARIO INTERNO:
- Investigación de denuncias internas
- Aplicación de medidas correctivas
- Comunicación a autoridades competentes
- Seguimiento de medidas adoptadas

B) MEDIDAS CAUTELARES:
- Separación inmediata en casos graves
- Suspensión temporal de funciones
- Restricción de acceso a instalaciones
- Supervisión reforzada

7. OBLIGACIONES DE MEJORA CONTINUA:

A) EVALUACIÓN PERIÓDICA:
- Revisión anual de protocolos
- Evaluación de eficacia de medidas
- Actualización de procedimientos
- Incorporación de buenas prácticas

B) FORMACIÓN CONTINUA:
- Actualización normativa periódica
- Incorporación de nuevas metodologías
- Intercambio de experiencias con otros clubes
- Participación en programas formativos federativos

PLAZOS DE CUMPLIMIENTO:

• INMEDIATO (0-30 días):
- Designación de delegados
- Comunicación de casos urgentes
- Implementación de medidas cautelares

• CORTO PLAZO (1-3 meses):
- Formación básica del personal
- Redacción de políticas internas
- Adecuación de instalaciones

• MEDIO PLAZO (3-6 meses):
- Formación avanzada de delegados
- Implementación completa de protocolos
- Certificación de todo el personal

• LARGO PLAZO (6-12 meses):
- Evaluación de eficacia del sistema
- Mejora continua de procedimientos
- Integración total en cultura organizacional`
    },
    'checklist-cumplimiento': {
      titulo: 'Checklist de Cumplimiento LOPIVI para Clubes',
      contenido: `CHECKLIST DE CUMPLIMIENTO LOPIVI - AUTOEVALUACIÓN PARA CLUBES

LISTA DE VERIFICACIÓN COMPLETA PARA DELEGADOS DE PROTECCIÓN

═══════════════════════════════════════════════════════════════════

📋 SECCIÓN A: ESTRUCTURA ORGANIZATIVA

□ ¿Está designado formalmente el delegado principal de protección?
□ ¿Está designado el delegado suplente de protección?
□ ¿Están claramente definidas las funciones de cada delegado?
□ ¿Están incluidos los delegados en el organigrama oficial del club?
□ ¿Tiene el delegado principal dedicación suficiente para sus funciones?
□ ¿Existe comunicación fluida entre delegado principal y suplente?

PUNTUACIÓN SECCIÓN A: ___/6

═══════════════════════════════════════════════════════════════════

📋 SECCIÓN B: FORMACIÓN Y CAPACITACIÓN

□ ¿Ha recibido el delegado principal formación específica en LOPIVI (mínimo 16h)?
□ ¿Ha recibido el delegado suplente formación específica (mínimo 8h)?
□ ¿Todo el personal técnico ha recibido formación inicial (8h)?
□ ¿Se realiza formación de actualización anual para todo el personal?
□ ¿Existe registro documentado de todas las formaciones realizadas?
□ ¿Se evalúa periódicamente la eficacia de la formación impartida?

PUNTUACIÓN SECCIÓN B: ___/6

═══════════════════════════════════════════════════════════════════

📋 SECCIÓN C: POLÍTICAS Y PROTOCOLOS

□ ¿Existe una política escrita de protección infantil del club?
□ ¿Hay un código de conducta específico para el personal?
□ ¿Están documentados los protocolos de actuación ante sospechas?
□ ¿Existe procedimiento específico de comunicación a autoridades?
□ ¿Hay protocolo documentado para emergencias?
□ ¿Se revisan y actualizan periódicamente los protocolos?

PUNTUACIÓN SECCIÓN C: ___/6

═══════════════════════════════════════════════════════════════════

📋 SECCIÓN D: INSTALACIONES Y ESPACIOS SEGUROS

□ ¿Están los vestuarios diseñados para garantizar seguridad y privacidad?
□ ¿Existe control de acceso a zonas restringidas?
□ ¿Se han eliminado espacios aislados sin supervisión?
□ ¿Hay visibilidad adecuada en todas las zonas de actividad?
□ ¿Existen sistemas de comunicación de emergencia accesibles?
□ ¿Se realiza mantenimiento regular de medidas de seguridad?

PUNTUACIÓN SECCIÓN D: ___/6

═══════════════════════════════════════════════════════════════════

📋 SECCIÓN E: SELECCIÓN Y CONTROL DE PERSONAL

□ ¿Se solicita certificado de antecedentes penales a todo el personal?
□ ¿Se verifican referencias laborales y personales?
□ ¿Existe período de prueba supervisado para personal nuevo?
□ ¿Se realiza evaluación continua del desempeño del personal?
□ ¿Hay procedimiento de renovación de autorizaciones?
□ ¿Se mantiene registro actualizado de idoneidad del personal?

PUNTUACIÓN SECCIÓN E: ___/6

═══════════════════════════════════════════════════════════════════

📋 SECCIÓN F: COMUNICACIÓN Y CANALES SEGUROS

□ ¿Existe canal específico para comunicación de preocupaciones?
□ ¿Es accesible y conocido por todos los menores?
□ ¿Garantiza confidencialidad y protección del comunicante?
□ ¿Hay respuesta rápida y eficaz a las comunicaciones?
□ ¿Se informa regularmente a familias sobre medidas de protección?
□ ¿Existe comunicación fluida con autoridades competentes?

PUNTUACIÓN SECCIÓN F: ___/6

═══════════════════════════════════════════════════════════════════

📋 SECCIÓN G: DOCUMENTACIÓN Y REGISTRO

□ ¿Existe registro de todas las actividades con menores?
□ ¿Se documentan todas las comunicaciones oficiales?
□ ¿Hay sistema de archivo seguro y confidencial?
□ ¿Se registran todos los incidentes y actuaciones realizadas?
□ ¿Existe trazabilidad completa de casos gestionados?
□ ¿Se cumple normativa de protección de datos?

PUNTUACIÓN SECCIÓN G: ___/6

═══════════════════════════════════════════════════════════════════

📋 SECCIÓN H: PROCEDIMIENTOS DE EMERGENCIA

□ ¿Existe protocolo claro para situaciones de riesgo inmediato?
□ ¿Todo el personal conoce los procedimientos de emergencia?
□ ¿Hay comunicación directa con servicios de emergencia?
□ ¿Se realizan simulacros periódicos de actuación?
□ ¿Existe plan de comunicación de crisis con familias?
□ ¿Se evalúa y mejora continuamente el plan de emergencia?

PUNTUACIÓN SECCIÓN H: ___/6

═══════════════════════════════════════════════════════════════════

📊 EVALUACIÓN FINAL DEL CUMPLIMIENTO

PUNTUACIÓN TOTAL: ___/48

🔴 CRÍTICO (0-24): Incumplimiento grave. Acción inmediata requerida.
🟡 MEJORABLE (25-36): Cumplimiento parcial. Plan de mejora necesario.
🟢 ADECUADO (37-44): Buen cumplimiento. Pequeñas mejoras recomendadas.
🔵 EXCELENTE (45-48): Cumplimiento óptimo. Mantener y mejorar.

═══════════════════════════════════════════════════════════════════

📋 PLAN DE ACCIÓN INMEDIATA

PRIORIDAD ALTA (Completar en 30 días):
1. ________________________________
2. ________________________________
3. ________________________________

PRIORIDAD MEDIA (Completar en 90 días):
1. ________________________________
2. ________________________________
3. ________________________________

PRIORIDAD BAJA (Completar en 180 días):
1. ________________________________
2. ________________________________
3. ________________________________

═══════════════════════════════════════════════════════════════════

📅 FECHA DE EVALUACIÓN: ________________
👤 EVALUADOR: __________________________
✍️ FIRMA: ______________________________

PRÓXIMA EVALUACIÓN: ____________________`
    }
  },
  3: {
    'protocolos-actuacion-completos': {
      titulo: 'Protocolos de Actuación Completos - Guía Paso a Paso',
      contenido: `PROTOCOLOS DE ACTUACIÓN COMPLETOS ANTE SITUACIONES DE RIESGO

GUÍA EXHAUSTIVA PARA DELEGADOS DE PROTECCIÓN

═══════════════════════════════════════════════════════════════════
🚨 PROTOCOLO 1: DETECCIÓN DE SOSPECHA DE MALTRATO
═══════════════════════════════════════════════════════════════════

FASE I - DETECCIÓN INICIAL (0-2 horas)

PASO 1: OBSERVACIÓN Y REGISTRO
□ Documentar inmediatamente los indicadores observados
□ Anotar fecha, hora exacta y lugar específico
□ Registrar personas presentes como testigos
□ Describir objetivamente sin interpretaciones personales
□ Fotografiar lesiones SOLO si es estrictamente necesario

PASO 2: EVALUACIÓN PRELIMINAR
□ Determinar si existe riesgo inmediato para el menor
□ Evaluar necesidad de atención médica urgente
□ Valorar acceso del presunto agresor al menor
□ Consultar con supervisor o coordinador si está disponible

PASO 3: MEDIDAS INMEDIATAS DE PROTECCIÓN
□ Garantizar seguridad física inmediata del menor
□ Evitar confrontación directa con presunto agresor
□ No realizar interrogatorios al menor
□ Mantener calma y transmitir seguridad al menor

═══════════════════════════════════════════════════════════════════
🚨 PROTOCOLO 2: REVELACIÓN DIRECTA DEL MENOR
═══════════════════════════════════════════════════════════════════

FASE I - RECEPCIÓN DE LA REVELACIÓN (inmediato)

PASO 1: ESCUCHA ACTIVA
□ Mantener calma absoluta y no mostrar sorpresa
□ Agradecer expresamente la confianza mostrada
□ Escuchar sin interrumpir ni hacer preguntas dirigidas
□ Validar sentimientos sin juzgar la situación
□ No prometer confidencialidad absoluta

PASO 2: REGISTRO LITERAL
□ Anotar palabras exactas utilizadas por el menor
□ Registrar contexto de la revelación
□ Documentar reacciones emocionales observadas
□ Evitar reformular o interpretar declaraciones

PASO 3: INFORMACIÓN AL MENOR
□ Explicar que no es culpa suya
□ Informar sobre pasos siguientes (adaptado a edad)
□ Asegurar que se le va a proteger
□ Mantener disponibilidad para futuras comunicaciones

═══════════════════════════════════════════════════════════════════
🚨 PROTOCOLO 3: COMUNICACIÓN A AUTORIDADES
═══════════════════════════════════════════════════════════════════

FASE I - COMUNICACIÓN TELEFÓNICA URGENTE (1-4 horas)

SERVICIOS SOCIALES (PRIORITARIO):
□ Contactar con servicios sociales municipales
□ Proporcionar identificación completa del menor
□ Describir situación de forma objetiva y cronológica
□ Solicitar orientación sobre medidas inmediatas
□ Confirmar recepción y registro de la comunicación

FISCALÍA DE MENORES (SI PROCEDE):
□ Contactar en casos de abuso sexual o maltrato grave
□ Proporcionar información completa del caso
□ Coordinarse con servicios sociales si ya han sido contactados
□ Solicitar instrucciones específicas sobre preservación de evidencias

FASE II - COMUNICACIÓN ESCRITA FORMAL (24-48 horas)

ESTRUCTURA DEL INFORME:
1. DATOS IDENTIFICATIVOS DEL MENOR
2. DESCRIPCIÓN CRONOLÓGICA DE HECHOS
3. EVALUACIÓN PROFESIONAL DEL RIESGO
4. MEDIDAS DE PROTECCIÓN YA ADOPTADAS
5. SOLICITUD ESPECÍFICA DE ACTUACIÓN
6. DATOS DE CONTACTO PARA COORDINACIÓN

═══════════════════════════════════════════════════════════════════
🚨 PROTOCOLO 4: GESTIÓN INTERNA DEL CASO
═══════════════════════════════════════════════════════════════════

FASE I - INFORMACIÓN AL EQUIPO

PRINCIPIO DE NECESIDAD DE CONOCER:
□ Identificar personal que necesita conocer el caso
□ Informar únicamente lo imprescindible para protección
□ Establecer confidencialidad estricta
□ Asignar responsabilidades específicas
□ Coordinar respuesta unificada del equipo

MEDIDAS DE PROTECCIÓN INTERNAS:
□ Supervisión directa y cercana del menor
□ Modificar rutinas si es necesario para protección
□ Evitar situaciones que reproduzcan factores de riesgo
□ Garantizar que menor no quede solo con personas de riesgo
□ Proporcionar apoyo emocional básico

FASE II - COMUNICACIÓN CON LA FAMILIA

EVALUACIÓN PREVIA:
□ Determinar si familia está implicada en el maltrato
□ Valorar riesgo de represalias hacia el menor
□ Consultar con servicios sociales sobre conveniencia
□ Evaluar capacidad protectora de la familia

SI SE DECIDE INFORMAR:
□ Citar en lugar neutral y profesional
□ Explicar obligación legal de comunicar sospechas
□ Solicitar colaboración en medidas de protección
□ Orientar sobre recursos de apoyo disponibles
□ Documentar íntegramente la comunicación

═══════════════════════════════════════════════════════════════════
🚨 PROTOCOLO 5: SEGUIMIENTO Y DOCUMENTACIÓN
═══════════════════════════════════════════════════════════════════

FASE I - SISTEMA DE REGISTRO

EXPEDIENTE INDIVIDUAL:
□ Crear expediente específico para el caso
□ Numerar correlativamente todas las actuaciones
□ Incluir cronología detallada
□ Archivar copias de comunicaciones oficiales
□ Registrar respuestas de autoridades competentes

DOCUMENTACIÓN OBLIGATORIA:
□ Hoja de registro inicial con datos básicos
□ Informes de evaluación y seguimiento
□ Comunicaciones enviadas y recibidas
□ Medidas de protección adoptadas
□ Evolución del caso documentada

FASE II - COORDINACIÓN INTERINSTITUCIONAL

REUNIONES DE COORDINACIÓN:
□ Participar activamente en equipos multidisciplinares
□ Aportar información específica desde perspectiva entidad
□ Solicitar aclaraciones sobre aspectos dudosos
□ Comprometerse con actuaciones específicas
□ Seguir indicaciones de coordinador del caso

SEGUIMIENTO CONTINUADO:
□ Mantener observación sistemática del menor
□ Comunicar cambios significativos inmediatamente
□ Evaluar eficacia de medidas adoptadas
□ Adaptar actuaciones según evolución del caso
□ Mantener registro actualizado de progreso

═══════════════════════════════════════════════════════════════════
🚨 PROTOCOLO 6: SITUACIONES ESPECIALES
═══════════════════════════════════════════════════════════════════

MALTRATO INTRAFAMILIAR:
□ Extremar precauciones en comunicación con familia
□ Coordinar estrechamente con servicios especializados
□ Evaluar necesidad de medidas de protección urgentes
□ Mantener supervisión reforzada en la entidad

ABUSO SEXUAL:
□ Evitar revictimización con interrogatorios
□ Preservar evidencias según instrucciones legales
□ Coordinar con servicios médicos especializados
□ Proporcionar apoyo psicológico inmediato

NEGLIGENCIA GRAVE:
□ Evaluar necesidades básicas inmediatas del menor
□ Coordinar con servicios de apoyo familiar
□ Implementar medidas de apoyo en la entidad
□ Seguimiento intensivo de evolución

MALTRATO ENTRE IGUALES:
□ Separar a agresor y víctima inmediatamente
□ Investigar internamente la situación
□ Comunicar a familias de ambos menores
□ Implementar medidas preventivas adicionales

═══════════════════════════════════════════════════════════════════

📞 TELÉFONOS DE EMERGENCIA

🚨 EMERGENCIAS: 112
👮 GUARDIA CIVIL: 062
🚔 POLICÍA NACIONAL: 091
🏥 EMERGENCIAS SANITARIAS: 061
📞 TELÉFONO DEL MENOR: 116 111
👨‍⚖️ FISCALÍA DE MENORES: [Número local]
🏛️ SERVICIOS SOCIALES: [Número local]

═══════════════════════════════════════════════════════════════════`
    },
    'formularios-incidencias': {
      titulo: 'Formularios de Registro de Incidencias',
      contenido: `FORMULARIOS OFICIALES DE REGISTRO DE INCIDENCIAS

DOCUMENTOS ESTANDARDIZADOS PARA DELEGADOS DE PROTECCIÓN

═══════════════════════════════════════════════════════════════════
📋 FORMULARIO A: REGISTRO INICIAL DE INCIDENCIA
═══════════════════════════════════════════════════════════════════

N.º EXPEDIENTE: _________________ FECHA: ___/___/______

1. DATOS DEL MENOR AFECTADO
┌─────────────────────────────────────────────────────────────────┐
│ Nombre completo: ________________________________              │
│ Fecha nacimiento: ___/___/______ Edad: _____ Sexo: M/F         │
│ DNI/NIE: _________________ Teléfono: ____________________      │
│ Dirección: ________________________________________________     │
│ Centro educativo: _________________________________________     │
│ Curso/Nivel: ______________________________________________     │
└─────────────────────────────────────────────────────────────────┘

2. DATOS DE PROGENITORES/TUTORES
┌─────────────────────────────────────────────────────────────────┐
│ Madre/Tutora: _____________________________________________     │
│ DNI: _________________ Teléfono: ________________________      │
│ Padre/Tutor: ______________________________________________     │
│ DNI: _________________ Teléfono: ________________________      │
│ Situación familiar: ___________________________________        │
└─────────────────────────────────────────────────────────────────┘

3. DATOS DE LA DETECCIÓN
┌─────────────────────────────────────────────────────────────────┐
│ Fecha detección: ___/___/______ Hora: ____:____              │
│ Lugar específico: __________________________________________   │
│ Persona que detecta: ______________________________________   │
│ Cargo/Función: ____________________________________________   │
│ Medio de detección:                                           │
│ □ Observación directa    □ Relato del menor                  │
│ □ Comunicación terceros  □ Lesiones físicas                  │
│ □ Otros: ____________________________________________        │
└─────────────────────────────────────────────────────────────────┘

4. DESCRIPCIÓN DE LA INCIDENCIA
┌─────────────────────────────────────────────────────────────────┐
│ Descripción objetiva de hechos (máximo detalle):               │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
│                                                               │
│ Testigos presentes:                                           │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
│                                                               │
│ Palabras textuales del menor (si las hubiera):               │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
└─────────────────────────────────────────────────────────────────┘

5. EVALUACIÓN INICIAL DE RIESGO
┌─────────────────────────────────────────────────────────────────┐
│ Nivel de riesgo percibido:                                    │
│ □ ALTO (Peligro inmediato)    □ MEDIO (Supervisión necesaria) │
│ □ BAJO (Seguimiento rutinario) □ A DETERMINAR                 │
│                                                               │
│ Factores de riesgo identificados:                            │
│ □ Acceso del agresor al menor                                │
│ □ Lesiones físicas evidentes                                 │
│ □ Estado emocional alterado                                  │
│ □ Antecedentes previos conocidos                             │
│ □ Resistencia familiar                                       │
│ □ Otros: ____________________________________________        │
│                                                               │
│ Necesidades inmediatas identificadas:                        │
│ □ Atención médica          □ Apoyo psicológico               │
│ □ Medidas de protección    □ Comunicación a autoridades      │
│ □ Otros: ____________________________________________        │
└─────────────────────────────────────────────────────────────────┘

6. ACTUACIONES INMEDIATAS REALIZADAS
┌─────────────────────────────────────────────────────────────────┐
│ Medidas adoptadas inmediatamente:                             │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
│                                                               │
│ Personal informado:                                           │
│ _______________________________________________________________ │
│                                                               │
│ Autoridades contactadas:                                      │
│ □ Servicios Sociales    □ Fiscalía de Menores               │
│ □ Emergencias 112      □ Otras: ____________________        │
│                                                               │
│ Hora primera comunicación: ____:____                         │
│ Persona contactada: ___________________________________       │
└─────────────────────────────────────────────────────────────────┘

Firma del Delegado: _________________ Fecha: ___/___/______

═══════════════════════════════════════════════════════════════════
📋 FORMULARIO B: SEGUIMIENTO DE INCIDENCIA
═══════════════════════════════════════════════════════════════════

N.º EXPEDIENTE: _________________ FECHA SEGUIMIENTO: ___/___/______

1. EVOLUCIÓN DEL CASO
┌─────────────────────────────────────────────────────────────────┐
│ Cambios observados desde última evaluación:                   │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
│                                                               │
│ Estado actual del menor:                                      │
│ □ Mejoría evidente        □ Sin cambios significativos        │
│ □ Empeoramiento          □ Nuevos indicadores                │
│                                                               │
│ Descripción específica:                                       │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
└─────────────────────────────────────────────────────────────────┘

2. ACTUACIONES REALIZADAS
┌─────────────────────────────────────────────────────────────────┐
│ Fecha: ___/___/______ Actuación:                             │
│ _______________________________________________________________ │
│ Resultado: ____________________________________________        │
│                                                               │
│ Fecha: ___/___/______ Actuación:                             │
│ _______________________________________________________________ │
│ Resultado: ____________________________________________        │
│                                                               │
│ Fecha: ___/___/______ Actuación:                             │
│ _______________________________________________________________ │
│ Resultado: ____________________________________________        │
└─────────────────────────────────────────────────────────────────┘

3. COORDINACIÓN INTERINSTITUCIONAL
┌─────────────────────────────────────────────────────────────────┐
│ Respuestas recibidas de autoridades:                         │
│ Servicios Sociales: ___________________________________       │
│ Fiscalía: _____________________________________________       │
│ Otros: ____________________________________________           │
│                                                               │
│ Próximas actuaciones acordadas:                              │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
│ Responsable: _______________________________ Plazo: _______  │
└─────────────────────────────────────────────────────────────────┘

Firma del Delegado: _________________ Fecha: ___/___/______

═══════════════════════════════════════════════════════════════════
📋 FORMULARIO C: COMUNICACIÓN OFICIAL A AUTORIDADES
═══════════════════════════════════════════════════════════════════

PARA: ____________________________________
DE: ______________________________________
FECHA: ___/___/______ REF: EXPEDIENTE N.º _______________

ASUNTO: COMUNICACIÓN DE SITUACIÓN DE RIESGO/MALTRATO INFANTIL

1. IDENTIFICACIÓN DE LA ENTIDAD COMUNICANTE
┌─────────────────────────────────────────────────────────────────┐
│ Entidad: ______________________________________________        │
│ CIF: _________________ Dirección: _______________________     │
│ Teléfono: _________________ Email: ______________________     │
│ Delegado comunicante: ____________________________________     │
│ DNI: _________________ Teléfono: ________________________     │
└─────────────────────────────────────────────────────────────────┘

2. IDENTIFICACIÓN DEL MENOR
┌─────────────────────────────────────────────────────────────────┐
│ [DATOS COMPLETOS SEGÚN FORMULARIO A]                          │
└─────────────────────────────────────────────────────────────────┘

3. EXPOSICIÓN DETALLADA DE HECHOS
┌─────────────────────────────────────────────────────────────────┐
│ [DESCRIPCIÓN CRONOLÓGICA Y OBJETIVA]                          │
└─────────────────────────────────────────────────────────────────┘

4. EVALUACIÓN PROFESIONAL
┌─────────────────────────────────────────────────────────────────┐
│ Nivel de riesgo: ______________________                       │
│ Urgencia de intervención: _________________________________    │
│ Recursos disponibles en entidad: __________________________   │
│ Limitaciones identificadas: _______________________________   │
└─────────────────────────────────────────────────────────────────┘

5. SOLICITUD ESPECÍFICA
┌─────────────────────────────────────────────────────────────────┐
│ Actuación solicitada: _____________________________________    │
│ Plazo considerado necesario: ______________________________    │
│ Colaboración ofrecida: ____________________________________    │
│ Disponibilidad para coordinación: _________________________    │
└─────────────────────────────────────────────────────────────────┘

Firma: _________________ Sello de la entidad

═══════════════════════════════════════════════════════════════════
📋 FORMULARIO D: CIERRE DE EXPEDIENTE
═══════════════════════════════════════════════════════════════════

N.º EXPEDIENTE: _________________ FECHA CIERRE: ___/___/______

1. MOTIVO DEL CIERRE
┌─────────────────────────────────────────────────────────────────┐
│ □ Resolución satisfactoria del caso                           │
│ □ Derivación a servicios especializados                      │
│ □ Finalización de relación con la entidad                    │
│ □ Decisión de servicios sociales competentes                 │
│ □ Otros: ____________________________________________        │
└─────────────────────────────────────────────────────────────────┘

2. RESUMEN EJECUTIVO DEL CASO
┌─────────────────────────────────────────────────────────────────┐
│ Duración total: _________ días                                │
│ Número de actuaciones realizadas: _______                     │
│ Autoridades involucradas: _________________________________    │
│ Resultado final: ______________________________________        │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
└─────────────────────────────────────────────────────────────────┘

3. LECCIONES APRENDIDAS
┌─────────────────────────────────────────────────────────────────┐
│ Aspectos positivos del proceso:                               │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
│                                                               │
│ Áreas de mejora identificadas:                               │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
│                                                               │
│ Recomendaciones para casos futuros:                          │
│ _______________________________________________________________ │
│ _______________________________________________________________ │
└─────────────────────────────────────────────────────────────────┘

Firma del Delegado: _________________ Fecha: ___/___/______
Revisado por: ______________________ Fecha: ___/___/______`
    },
    'guia-primeros-auxilios-emocionales': {
      titulo: 'Guía de Primeros Auxilios Emocionales',
      contenido: `GUÍA DE PRIMEROS AUXILIOS EMOCIONALES PARA MENORES

INTERVENCIÓN INMEDIATA EN CRISIS EMOCIONALES

═══════════════════════════════════════════════════════════════════
🧠 FUNDAMENTOS DE LOS PRIMEROS AUXILIOS EMOCIONALES
═══════════════════════════════════════════════════════════════════

DEFINICIÓN:
Los primeros auxilios emocionales son la ayuda inmediata que se presta a una persona que ha experimentado un trauma o está en crisis emocional, con el objetivo de estabilizar su estado emocional y prevenir daños psicológicos adicionales.

OBJETIVOS PRINCIPALES:
• Proporcionar apoyo y consuelo inmediato
• Reducir el nivel de estrés agudo
• Prevenir el desarrollo de trauma adicional
• Facilitar el acceso a recursos profesionales
• Restaurar la sensación de seguridad

PRINCIPIOS BÁSICOS:
1. SEGURIDAD PRIMERO: Garantizar seguridad física y emocional
2. CALMA: Mantener serenidad para transmitir estabilidad
3. AUTOEFICACIA: Ayudar al menor a recuperar sensación de control
4. CONECTIVIDAD: Fomentar vínculos con personas de apoyo
5. ESPERANZA: Transmitir que la situación puede mejorar

═══════════════════════════════════════════════════════════════════
🆘 PROTOCOLO DE INTERVENCIÓN EN CRISIS AGUDA
═══════════════════════════════════════════════════════════════════

PASO 1: EVALUACIÓN INMEDIATA (0-5 minutos)

SIGNOS DE CRISIS EMOCIONAL AGUDA:
□ Llanto incontrolable o ausencia total de reacción
□ Hiperventilación o dificultades respiratorias
□ Temblores, sudoración o palidez extrema
□ Confusión o desorientación
□ Agitación extrema o paralización completa
□ Expresiones de desesperanza o ideas autolíticas

EVALUACIÓN DE SEGURIDAD:
□ ¿Está el menor en peligro físico inmediato?
□ ¿Presenta riesgo de autolesión?
□ ¿Hay amenaza de daño por parte de terceros?
□ ¿Requiere atención médica urgente?

PASO 2: ESTABILIZACIÓN EMOCIONAL (5-15 minutos)

TÉCNICAS DE CONTACTO INICIAL:
□ Acercarse de forma tranquila y no amenazante
□ Mantener contacto visual adecuado sin intimidar
□ Usar tono de voz suave y pausado
□ Adoptar postura corporal abierta y relajada
□ Respetar espacio personal del menor

VALIDACIÓN EMOCIONAL:
□ "Es normal sentirse así después de lo que has vivido"
□ "Entiendo que esto es muy difícil para ti"
□ "Estás seguro/a ahora, estoy aquí para ayudarte"
□ "No tienes que pasar por esto solo/a"
□ "Vamos a buscar la ayuda que necesitas"

PASO 3: TÉCNICAS DE REGULACIÓN EMOCIONAL

A) TÉCNICA DE RESPIRACIÓN 4-7-8:
□ Explicar de forma sencilla: "Vamos a respirar juntos"
□ Inhalar por nariz contando hasta 4
□ Mantener aire contando hasta 7
□ Exhalar por boca contando hasta 8
□ Repetir 3-4 ciclos hasta ver mejoría

B) TÉCNICA DE GROUNDING 5-4-3-2-1:
□ 5 cosas que puede VER en este momento
□ 4 cosas que puede TOCAR
□ 3 cosas que puede ESCUCHAR
□ 2 cosas que puede OLER
□ 1 cosa que puede SABOREAR

C) TÉCNICA DE ANCLAJE SEGURO:
□ Preguntar por su lugar favorito/más seguro
□ Ayudar a visualizar ese lugar con detalles
□ Fomentar asociación con sensación de seguridad
□ Practicar "ir" a ese lugar cuando se sienta mal

═══════════════════════════════════════════════════════════════════
💭 INTERVENCIÓN SEGÚN TIPO DE TRAUMA
═══════════════════════════════════════════════════════════════════

MALTRATO FÍSICO RECIENTE:

PRIMEROS AUXILIOS EMOCIONALES:
□ Tranquilizar: "Estás a salvo ahora"
□ Validar: "Lo que te ha pasado no está bien"
□ Empoderar: "Has sido muy valiente al contarlo"
□ Proteger: "Vamos a asegurarnos de que estés protegido/a"

EVITAR:
✗ Preguntar detalles sobre el maltrato
✗ Expresar shock o indignación extrema
✗ Prometer que "nunca más volverá a pasar"
✗ Criticar al agresor delante del menor

ABUSO SEXUAL REVELADO:

PRIMEROS AUXILIOS EMOCIONALES:
□ Creer: "Te creo, gracias por contármelo"
□ Tranquilizar: "No es culpa tuya, nada de esto es culpa tuya"
□ Apoyar: "Has hecho bien en contarlo"
□ Proteger: "Vamos a asegurarnos de que estés seguro/a"

EVITAR:
✗ Mostrar shock, disgusto o incredulidad
✗ Hacer preguntas sobre detalles sexuales
✗ Prometer confidencialidad absoluta
✗ Contacto físico sin permiso explícito

NEGLIGENCIA O ABANDONO:

PRIMEROS AUXILIOS EMOCIONALES:
□ Atender necesidades básicas inmediatas
□ Transmitir estabilidad y rutina
□ Proporcionar cuidado físico básico
□ Conectar con recursos de apoyo

CARACTERÍSTICAS ESPECIALES:
• Pueden mostrarse hipervigilantes o excesivamente complacientes
• Necesidad de establecer límites claros y seguros
• Importancia de la consistencia en el cuidado

═══════════════════════════════════════════════════════════════════
🗣️ TÉCNICAS DE COMUNICACIÓN ESPECÍFICAS POR EDAD
═══════════════════════════════════════════════════════════════════

PRIMERA INFANCIA (3-6 años):

COMUNICACIÓN:
□ Usar lenguaje muy simple y concreto
□ Emplear metáforas y cuentos apropiados
□ Permitir expresión a través del juego
□ Responder a necesidades físicas básicas
□ Mantener rutinas predecibles

FRASES ÚTILES:
• "El adulto que te hizo daño se equivocó"
• "Tu cuerpo es tuyo y nadie debe hacerte daño"
• "Hay adultos buenos que te van a cuidar"
• "No has hecho nada malo"

INFANCIA MEDIA (7-11 años):

COMUNICACIÓN:
□ Explicaciones más detalladas pero apropiadas
□ Involucrar en decisiones simples sobre su cuidado
□ Fomentar expresión verbal de sentimientos
□ Proporcionar información tranquilizadora sobre proceso

FRASES ÚTILES:
• "Es normal sentirse confundido/a después de esto"
• "Hay personas entrenadas para ayudar en estas situaciones"
• "Tienes derecho a sentirte seguro/a"
• "Vamos a trabajar juntos para que estés mejor"

ADOLESCENCIA (12-17 años):

COMUNICACIÓN:
□ Respetar mayor necesidad de autonomía
□ Proporcionar información más completa sobre proceso
□ Involucrar en decisiones sobre su atención
□ Respetar preferencias sobre confidencialidad

FRASES ÚTILES:
• "Entiendo que esto es muy complicado para ti"
• "Tienes derecho a participar en las decisiones sobre tu cuidado"
• "Hay recursos específicos para personas de tu edad"
• "Tu opinión es importante en este proceso"

═══════════════════════════════════════════════════════════════════
⚠️ SEÑALES DE ALERTA QUE REQUIEREN INTERVENCIÓN INMEDIATA
═══════════════════════════════════════════════════════════════════

RIESGO SUICIDA:
□ Expresiones directas de querer morirse
□ "Estaríais mejor sin mí"
□ Preguntando sobre formas de morir
□ Despidiéndose de manera inusual
□ Regalando pertenencias importantes

ACCIÓN INMEDIATA:
• NO dejar solo al menor bajo ninguna circunstancia
• Contactar inmediatamente con emergencias
• Mantener comunicación constante y tranquilizadora
• Remover objetos potencialmente peligrosos del entorno

DISOCIACIÓN SEVERA:
□ Desconexión total del entorno
□ No respuesta a estímulos verbales
□ Mirada perdida o "ausente"
□ Movimientos repetitivos o estereotipados
□ Pérdida de memoria de eventos recientes

ACCIÓN INMEDIATA:
• Mantener ambiente tranquilo y seguro
• Hablar en tono suave y repetir nombre del menor
• No tocar sin permiso
• Esperar a que recupere conexión gradualmente

AGITACIÓN EXTREMA:
□ Movimientos violentos o descontrolados
□ Gritos o llanto incontrolable
□ Intento de escapar o huir
□ Agresividad hacia sí mismo o terceros

ACCIÓN INMEDIATA:
• Garantizar seguridad propia y del menor
• Retirar objetos que puedan causar daño
• Mantener distancia segura pero disponible
• Hablar en tono muy tranquilo y pausado

═══════════════════════════════════════════════════════════════════
🔄 SEGUIMIENTO POST-CRISIS
═══════════════════════════════════════════════════════════════════

PRIMERAS 24-48 HORAS:
□ Contacto frecuente con el menor
□ Monitoreo de estado emocional
□ Asegurar continuidad en cuidados básicos
□ Facilitar acceso a recursos profesionales
□ Mantener comunicación con familia de apoyo

PRIMERA SEMANA:
□ Establecer rutina de seguimiento regular
□ Evaluar necesidad de apoyo psicológico profesional
□ Coordinar con servicios sociales
□ Mantener medidas de protección implementadas
□ Documentar evolución del estado emocional

CRITERIOS PARA DERIVACIÓN URGENTE:
• Persistencia de síntomas severos más de 48h
• Empeoramiento del estado emocional
• Aparición de nuevos síntomas preocupantes
• Falta de mejoría con intervenciones básicas
• Solicitud expresa del menor para ayuda profesional

═══════════════════════════════════════════════════════════════════
📞 RECURSOS DE EMERGENCIA

🚨 CRISIS SUICIDA: 024 (Línea de Atención al Suicidio)
📞 TELÉFONO DEL MENOR: 116 111
🆘 EMERGENCIAS GENERALES: 112
🧠 URGENCIAS PSIQUIÁTRICAS: [Número local]
👨‍⚕️ CENTRO DE SALUD MENTAL INFANTIL: [Número local]

═══════════════════════════════════════════════════════════════════`
    }
  },
  4: {
    'guia-deteccion-indicadores': {
      titulo: 'Guía Completa de Detección de Indicadores',
      contenido: `GUÍA ESPECIALIZADA DE DETECCIÓN DE INDICADORES DE MALTRATO

MANUAL TÉCNICO PARA DELEGADOS DE PROTECCIÓN

═══════════════════════════════════════════════════════════════════
🔍 INTRODUCCIÓN A LA DETECCIÓN PROFESIONAL
═══════════════════════════════════════════════════════════════════

PRINCIPIOS FUNDAMENTALES:
La detección temprana de indicadores de maltrato requiere una combinación de conocimiento técnico, observación sistemática y sensibilidad profesional. Los indicadores nunca aparecen de forma aislada y deben evaluarse en su contexto integral.

TIPOS DE INDICADORES:
1. FÍSICOS: Evidencias corporales de maltrato
2. EMOCIONALES: Cambios en comportamiento y estado anímico
3. SOCIALES: Alteraciones en relaciones interpersonales
4. ACADÉMICOS: Cambios en rendimiento educativo
5. FAMILIARES: Dinámicas familiares disfuncionales

═══════════════════════════════════════════════════════════════════
🩺 INDICADORES FÍSICOS ESPECÍFICOS
═══════════════════════════════════════════════════════════════════

LESIONES SOSPECHOSAS:

MORATONES Y CONTUSIONES:
• Ubicación: En zonas no expuestas a accidentes normales
• Forma: Marcas que sugieren objetos específicos (cinturones, manos, cables)
• Evolución: Múltiples lesiones en diferentes estadios de curación
• Patrón: Distribución simétrica bilateral (poco común en accidentes)
• Explicación: Inconsistente con la lesión observada o historia cambiante

QUEMADURAS:
• Cigarrillos: Marcas circulares pequeñas y profundas
• Inmersión: Lesiones en guante o calcetín con líneas nítidas
• Objetos calientes: Formas específicas (plancha, radiador)
• Químicas: Lesiones irregulares con bordes peculiares

FRACTURAS:
• Múltiples fracturas en diferentes momentos
• Fracturas en niños pequeños que aún no caminan
• Fracturas espirales en extremidades sin historia clara
• Fracturas costales en menores de 2 años

SIGNOS DE NEGLIGENCIA FÍSICA:
• Higiene personal deficiente persistente
• Ropa inadecuada para condiciones climáticas
• Hambre constante o malnutrición evidente
• Fatiga crónica o problemas de sueño
• Problemas médicos no atendidos

═══════════════════════════════════════════════════════════════════
🧠 INDICADORES EMOCIONALES Y PSICOLÓGICOS
═══════════════════════════════════════════════════════════════════

CAMBIOS COMPORTAMENTALES SIGNIFICATIVOS:

REGRESIÓN EVOLUTIVA:
• Enuresis/encopresis después de control de esfínteres
• Vuelta a comportamientos de etapas anteriores
• Pérdida de habilidades previamente adquiridas
• Necesidad excesiva de atención y contacto físico

TRASTORNOS EMOCIONALES:
• Ansiedad extrema o ataques de pánico
• Depresión o tristeza persistente
• Cambios bruscos de humor inexplicables
• Miedo excesivo a situaciones normales
• Comportamiento autolesivo

ALTERACIONES SOCIALES:
• Aislamiento social progresivo
• Agresividad hacia compañeros
• Comportamiento excesivamente complaciente
• Miedo a figuras de autoridad
• Dificultad para establecer relaciones

═══════════════════════════════════════════════════════════════════
📚 INDICADORES ACADÉMICOS Y ESCOLARES
═══════════════════════════════════════════════════════════════════

CAMBIOS EN RENDIMIENTO:
• Deterioro súbito en calificaciones
• Problemas de concentración nuevos
• Absentismo frecuente e injustificado
• Llegadas tardías habituales
• Resistencia a ir a casa al finalizar actividades

COMPORTAMIENTO EN AULA:
• Hipervigilancia constante
• Sobresalto excesivo ante ruidos
• Dificultad para seguir instrucciones
• Fatiga crónica durante actividades
• Búsqueda constante de atención adulta

═══════════════════════════════════════════════════════════════════
👨‍👩‍👧‍👦 INDICADORES FAMILIARES
═══════════════════════════════════════════════════════════════════

DINÁMICAS DISFUNCIONALES:
• Aislamiento familiar del entorno social
• Inconsistencia en explicaciones sobre lesiones
• Hostilidad hacia profesionales que trabajan con el menor
• Resistencia a la supervisión o intervención
• Expectativas inadecuadas sobre el menor

FACTORES DE RIESGO FAMILIAR:
• Historial de violencia doméstica
• Problemas de adicciones en progenitores
• Trastornos mentales no tratados
• Estrés económico extremo
• Falta de red de apoyo social

═══════════════════════════════════════════════════════════════════
⚠️ INDICADORES ESPECÍFICOS POR TIPO DE MALTRATO
═══════════════════════════════════════════════════════════════════

MALTRATO FÍSICO:
• Lesiones en diferentes estadios de curación
• Marcas de ataduras en muñecas o tobillos
• Alopecia por tracción (pérdida de cabello por tirones)
• Miedo excesivo al contacto físico
• Hipervigilancia ante movimientos bruscos

MALTRATO PSICOLÓGICO:
• Autoestima extremadamente baja
• Comportamientos extremos (muy agresivo o muy pasivo)
• Trastornos del habla (tartamudeo, mutismo)
• Comportamientos adultos inapropiados para la edad
• Intentos de suicidio o ideación autolítica

NEGLIGENCIA:
• Retrasos en desarrollo físico o cognitivo
• Problemas médicos crónicos no atendidos
• Búsqueda constante de afecto en adultos
• Comportamientos de supervivencia (acaparar comida)
• Cansancio crónico por falta de supervisión

ABUSO SEXUAL:
• Conocimiento sexual inapropiado para la edad
• Comportamientos sexualizados con compañeros
• Miedo o rechazo a exámenes médicos
• Problemas para caminar o sentarse
• Regresión a comportamientos infantiles

═══════════════════════════════════════════════════════════════════
🎯 METODOLOGÍA DE OBSERVACIÓN SISTEMÁTICA
═══════════════════════════════════════════════════════════════════

PROTOCOLO DE OBSERVACIÓN:

FRECUENCIA:
• Observación diaria durante actividades regulares
• Documentación semanal de patrones observados
• Evaluación mensual de cambios significativos
• Revisión trimestral de evolución general

CONTEXTOS DE OBSERVACIÓN:
• Actividades estructuradas y no estructuradas
• Interacciones con iguales y adultos
• Momentos de transición y cambio
• Situaciones de estrés o conflicto
• Actividades individuales y grupales

REGISTRO PROFESIONAL:
• Fecha, hora y contexto específico
• Descripción objetiva del comportamiento
• Duración e intensidad del indicador
• Factores desencadenantes identificados
• Respuesta del menor a intervenciones

═══════════════════════════════════════════════════════════════════
📊 ESCALAS DE EVALUACIÓN Y HERRAMIENTAS
═══════════════════════════════════════════════════════════════════

EVALUACIÓN DE RIESGO:

NIVEL 1 - RIESGO BAJO:
• Indicadores aislados y poco frecuentes
• Explicaciones coherentes disponibles
• Factores protectores presentes
• Respuesta positiva a intervenciones menores

NIVEL 2 - RIESGO MEDIO:
• Múltiples indicadores presentes
• Patrones de comportamiento persistentes
• Algunos factores de riesgo familiares
• Respuesta variable a intervenciones

NIVEL 3 - RIESGO ALTO:
• Indicadores graves y múltiples
• Patrones consistentes de maltrato
• Factores de riesgo familiares significativos
• Deterioro progresivo del menor

NIVEL 4 - RIESGO CRÍTICO:
• Evidencia clara de maltrato severo
• Peligro inmediato para la seguridad
• Múltiples factores de riesgo presentes
• Necesidad de protección urgente

═══════════════════════════════════════════════════════════════════
🔬 TÉCNICAS DE DOCUMENTACIÓN FORENSE
═══════════════════════════════════════════════════════════════════

REGISTRO FOTOGRÁFICO:
• NUNCA fotografiar al menor directamente
• Documentar entorno y circunstancias
• Solicitar autorización a autoridades competentes
• Mantener cadena de custodia apropiada

DOCUMENTACIÓN ESCRITA:
• Lenguaje objetivo y técnico
• Cronología precisa de observaciones
• Testigos presentes en cada observación
• Medidas adoptadas en cada momento

PRESERVACIÓN DE EVIDENCIAS:
• No alterar escena si hay indicios físicos
• Contactar inmediatamente con autoridades
• Mantener confidencialidad absoluta
• Seguir protocolos legales establecidos

═══════════════════════════════════════════════════════════════════
🚨 PROTOCOLO DE ACTUACIÓN SEGÚN NIVEL DE RIESGO
═══════════════════════════════════════════════════════════════════

RIESGO BAJO:
• Observación continuada y documentación
• Intervención preventiva con familia
• Refuerzo de factores protectores
• Seguimiento mensual

RIESGO MEDIO:
• Intensificación de observación
• Comunicación a servicios sociales
• Implementación de medidas protectoras
• Seguimiento quincenal

RIESGO ALTO:
• Comunicación inmediata a autoridades
• Medidas de protección urgentes
• Coordinación interinstitucional
• Seguimiento diario

RIESGO CRÍTICO:
• Activación de protocolo de emergencia
• Comunicación inmediata a fiscalía
• Medidas de protección inmediatas
• Seguimiento continuo

═══════════════════════════════════════════════════════════════════
📞 RECURSOS DE CONSULTA Y APOYO

🏛️ SERVICIOS SOCIALES: [Número local]
👨‍⚖️ FISCALÍA DE MENORES: [Número local]
🏥 CENTRO DE SALUD MENTAL INFANTIL: [Número local]
📞 TELÉFONO DEL MENOR: 116 111
🆘 EMERGENCIAS: 112

═══════════════════════════════════════════════════════════════════`
    },
    'formulario-registro-incidencias': {
      titulo: 'Formulario de Registro de Incidencias - Modelo Oficial',
      contenido: `FORMULARIO OFICIAL DE REGISTRO DE INCIDENCIAS

DOCUMENTO ESTANDARIZADO PARA DELEGADOS DE PROTECCIÓN
VERSIÓN 2.0 - ACTUALIZADA SEGÚN LOPIVI

═══════════════════════════════════════════════════════════════════
📋 INSTRUCCIONES GENERALES
═══════════════════════════════════════════════════════════════════

OBLIGATORIEDAD:
Este formulario debe completarse INMEDIATAMENTE tras la detección de cualquier indicador de riesgo o situación de maltrato infantil, según establece el artículo 20 de la LOPIVI.

CONFIDENCIALIDAD:
La información contenida está protegida por normativa de protección de datos y secreto profesional. Acceso restringido exclusivamente a personal autorizado.

CONSERVACIÓN:
Original en expediente del menor. Copia para servicios sociales y/o fiscalía según proceda. Archivo mínimo 10 años desde mayoría de edad del menor.

═══════════════════════════════════════════════════════════════════
📋 FORMULARIO DE REGISTRO INICIAL
═══════════════════════════════════════════════════════════════════

🏢 DATOS DE LA ENTIDAD
┌─────────────────────────────────────────────────────────────────┐
│ Nombre entidad: ____________________________________________   │
│ CIF: _________________ Dirección: __________________________   │
│ Teléfono: _________________ Email: _________________________   │
│ Actividad principal: _______________________________________   │
│ Delegado responsable: ______________________________________   │
│ DNI Delegado: _________________ Teléfono: __________________   │
└─────────────────────────────────────────────────────────────────┘

🔢 DATOS DEL EXPEDIENTE
┌─────────────────────────────────────────────────────────────────┐
│ N.º Expediente: ___________________________________________    │
│ Fecha apertura: ___/___/______ Hora: ____:____               │
│ Prioridad: □ Baja □ Media □ Alta □ Crítica                    │
│ Tipo caso: □ Sospecha □ Revelación □ Evidencia física         │
│ Estado: □ Abierto □ En investigación □ Derivado □ Cerrado     │
└─────────────────────────────────────────────────────────────────┘

👤 DATOS DEL MENOR AFECTADO
┌─────────────────────────────────────────────────────────────────┐
│ Nombre completo: ___________________________________________   │
│ Fecha nacimiento: ___/___/______ Edad: _____ años _____ meses │
│ Sexo: □ Masculino □ Femenino □ Otro: ____________________     │
│ DNI/NIE/Pasaporte: ________________________________________    │
│ Nacionalidad: _____________________________________________    │
│ Dirección domicilio: ______________________________________    │
│ Código Postal: _____________ Ciudad: ______________________   │
│ Teléfono contacto: ________________________________________    │
│ Centro educativo: _________________________________________    │
│ Curso/Nivel: ______________________________________________    │
│ Tutor/a educativo: ________________________________________    │
└─────────────────────────────────────────────────────────────────┘

👨‍👩‍👧‍👦 DATOS FAMILIARES
┌─────────────────────────────────────────────────────────────────┐
│ PROGENITOR/TUTOR 1:                                           │
│ Nombre: ___________________________________________________   │
│ DNI: _________________ Edad: _____ Parentesco: _____________  │
│ Teléfono: _________________ Email: ________________________  │
│ Profesión: ________________ Situación laboral: ____________  │
│                                                               │
│ PROGENITOR/TUTOR 2:                                           │
│ Nombre: ___________________________________________________   │
│ DNI: _________________ Edad: _____ Parentesco: _____________  │
│ Teléfono: _________________ Email: ________________________  │
│ Profesión: ________________ Situación laboral: ____________  │
│                                                               │
│ Situación familiar: □ Intacta □ Separados □ Divorciados      │
│                    □ Monoparental □ Reconstituida □ Adopción │
│ Otros menores en domicilio: _______________________________  │
│ Personas convivientes: ____________________________________  │
└─────────────────────────────────────────────────────────────────┘

🔍 DATOS DE LA DETECCIÓN
┌─────────────────────────────────────────────────────────────────┐
│ Fecha detección: ___/___/______ Hora: ____:____              │
│ Lugar específico: _________________________________________   │
│ Actividad en curso: _______________________________________   │
│ Circunstancias: ___________________________________________   │
│ ____________________________________________________________  │
│                                                               │
│ Persona detectora:                                            │
│ Nombre: ___________________________________________________   │
│ DNI: _________________ Cargo: ______________________________  │
│ Relación con menor: ___________________________________     │
│ Experiencia previa en protección: □ Sí □ No                  │
│                                                               │
│ Medio de detección:                                           │
│ □ Observación directa personal                               │
│ □ Relato espontáneo del menor                               │
│ □ Pregunta directa del menor                                │
│ □ Comunicación de otro menor                                │
│ □ Comunicación familiar                                     │
│ □ Comunicación de terceros                                  │
│ □ Evidencia física (lesiones)                              │
│ □ Evidencia material                                        │
│ □ Otros: ________________________________________________   │
└─────────────────────────────────────────────────────────────────┘

📝 DESCRIPCIÓN DETALLADA DE LA INCIDENCIA
┌─────────────────────────────────────────────────────────────────┐
│ RELATO CRONOLÓGICO DE HECHOS (máximo detalle, lenguaje objetivo): │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│                                                               │
│ PALABRAS TEXTUALES DEL MENOR (transcripción literal):        │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│                                                               │
│ TESTIGOS PRESENTES:                                           │
│ 1. Nombre: ____________________________________________      │
│    DNI: _________________ Teléfono: ____________________    │
│ 2. Nombre: ____________________________________________      │
│    DNI: _________________ Teléfono: ____________________    │
│ 3. Nombre: ____________________________________________      │
│    DNI: _________________ Teléfono: ____________________    │
│                                                               │
│ ESTADO EMOCIONAL DEL MENOR:                                   │
│ □ Calmado □ Nervioso □ Asustado □ Agitado □ Retraído        │
│ □ Lloroso □ Agresivo □ Confuso □ Otros: ___________________  │
│                                                               │
│ REACCIONES FÍSICAS OBSERVADAS:                               │
│ □ Temblores □ Sudoración □ Palidez □ Enrojecimiento          │
│ □ Dificultad respiratoria □ Náuseas □ Otros: _______________  │
└─────────────────────────────────────────────────────────────────┘

🩺 EVALUACIÓN DE INDICADORES
┌─────────────────────────────────────────────────────────────────┐
│ INDICADORES FÍSICOS OBSERVADOS:                              │
│ □ Moratones/contusiones □ Cortes/heridas □ Quemaduras        │
│ □ Marcas de ataduras □ Fracturas aparentes □ Alopecia        │
│ □ Negligencia higiene □ Ropa inadecuada □ Malnutrición       │
│ □ Fatiga extrema □ Otros: _________________________________  │
│                                                               │
│ Descripción detallada de lesiones:                           │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│                                                               │
│ INDICADORES EMOCIONALES:                                     │
│ □ Miedo excesivo □ Ansiedad □ Depresión □ Agresividad       │
│ □ Regresión comportamental □ Hipervigilancia                │
│ □ Comportamiento sexualizado □ Autolesiones                 │
│ □ Ideas autolíticas □ Otros: _______________________________  │
│                                                               │
│ INDICADORES SOCIALES:                                        │
│ □ Aislamiento □ Dificultad relaciones □ Miedo autoridad     │
│ □ Comportamiento complaciente □ Evitación contacto físico   │
│ □ Conocimiento sexual inadecuado □ Otros: __________________  │
│                                                               │
│ INDICADORES ACADÉMICOS:                                      │
│ □ Deterioro rendimiento □ Problemas concentración           │
│ □ Absentismo □ Retrasos □ Fatiga □ Otros: ___________________  │
└─────────────────────────────────────────────────────────────────┘

⚠️ EVALUACIÓN DE RIESGO
┌─────────────────────────────────────────────────────────────────┐
│ NIVEL DE RIESGO EVALUADO:                                    │
│ □ BAJO: Indicadores leves, factores protectores presentes   │
│ □ MEDIO: Múltiples indicadores, necesita supervisión        │
│ □ ALTO: Indicadores graves, riesgo significativo            │
│ □ CRÍTICO: Peligro inmediato, protección urgente            │
│                                                               │
│ FACTORES DE RIESGO IDENTIFICADOS:                           │
│ □ Acceso agresor al menor □ Lesiones físicas graves         │
│ □ Amenazas directas □ Historial previo maltrato             │
│ □ Resistencia familiar □ Aislamiento social                 │
│ □ Problemas salud mental □ Adicciones familiares            │
│ □ Violencia doméstica □ Estrés económico extremo            │
│ □ Otros: ________________________________________________   │
│                                                               │
│ FACTORES PROTECTORES:                                        │
│ □ Figura adulta protectora □ Red apoyo familiar             │
│ □ Buen rendimiento escolar □ Habilidades sociales           │
│ □ Acceso servicios salud □ Estabilidad económica            │
│ □ Otros: ________________________________________________   │
│                                                               │
│ NECESIDADES INMEDIATAS:                                      │
│ □ Atención médica urgente □ Apoyo psicológico               │
│ □ Medidas protección física □ Comunicación autoridades      │
│ □ Separación del agresor □ Alojamiento alternativo          │
│ □ Otros: ________________________________________________   │
└─────────────────────────────────────────────────────────────────┘

🚨 ACTUACIONES INMEDIATAS
┌─────────────────────────────────────────────────────────────────┐
│ MEDIDAS ADOPTADAS EN PRIMERA RESPUESTA:                      │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│                                                               │
│ PERSONAL INFORMADO:                                           │
│ ____________________________________________________________  │
│ ____________________________________________________________  │
│                                                               │
│ AUTORIDADES CONTACTADAS:                                     │
│ □ Servicios Sociales                                        │
│   Fecha: ___/___/______ Hora: ____:____                     │
│   Persona contactada: ____________________________________   │
│   Teléfono: _________________ Respuesta: ___________________  │
│                                                               │
│ □ Fiscalía de Menores                                       │
│   Fecha: ___/___/______ Hora: ____:____                     │
│   Persona contactada: ____________________________________   │
│   Teléfono: _________________ Respuesta: ___________________  │
│                                                               │
│ □ Emergencias 112                                           │
│   Fecha: ___/___/______ Hora: ____:____                     │
│   Motivo: ______________________________________________     │
│   Respuesta: ____________________________________________     │
│                                                               │
│ □ Otros organismos:                                         │
│   Entidad: _____________________________________________     │
│   Persona: _____________________________________________     │
│   Teléfono: _________________ Fecha: ___/___/______         │
│   Respuesta: ____________________________________________     │
└─────────────────────────────────────────────────────────────────┘

📋 VALIDACIÓN Y FIRMAS
┌─────────────────────────────────────────────────────────────────┐
│ DELEGADO RESPONSABLE:                                         │
│ Nombre: ___________________________________________________   │
│ DNI: _________________ Cargo: ______________________________  │
│ Firma: _________________ Fecha: ___/___/______ Hora: ____:____ │
│                                                               │
│ SUPERVISOR/COORDINADOR (si procede):                         │
│ Nombre: ___________________________________________________   │
│ DNI: _________________ Cargo: ______________________________  │
│ Firma: _________________ Fecha: ___/___/______ Hora: ____:____ │
│                                                               │
│ SELLO DE LA ENTIDAD:                                         │
│                                                               │
│                                                               │
│                                                               │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
⚖️ DECLARACIÓN DE VERACIDAD
═══════════════════════════════════════════════════════════════════

El/la firmante declara que toda la información contenida en este formulario es veraz y ha sido registrada de forma objetiva y profesional, asumiendo las responsabilidades legales que de ello se deriven según la normativa vigente.

═══════════════════════════════════════════════════════════════════
📞 CONTACTOS DE EMERGENCIA

🆘 EMERGENCIAS GENERALES: 112
📞 TELÉFONO DEL MENOR: 116 111
🚨 LÍNEA CONTRA EL SUICIDIO: 024
👮 GUARDIA CIVIL: 062
🚔 POLICÍA NACIONAL: 091

═══════════════════════════════════════════════════════════════════

CUSTODIA360 - FORMULARIO OFICIAL v2.0
Documento protegido por normativa de protección de datos
Distribución restringida exclusivamente a personal autorizado`
    },
    'protocolo-actuacion-inmediata': {
      titulo: 'Protocolo de Actuación Inmediata - Respuesta Rápida',
      contenido: `PROTOCOLO DE ACTUACIÓN INMEDIATA ANTE EMERGENCIAS

GUÍA DE RESPUESTA RÁPIDA PARA DELEGADOS DE PROTECCIÓN

═══════════════════════════════════════════════════════════════════
🚨 ACTIVACIÓN DEL PROTOCOLO DE EMERGENCIA
═══════════════════════════════════════════════════════════════════

CRITERIOS DE ACTIVACIÓN INMEDIATA:
• Evidencia de maltrato físico grave o abuso sexual
• Amenaza directa de daño inmediato al menor
• Revelación de situación de peligro inminente
• Lesiones que requieren atención médica urgente
• Intento de autolesión o expresión de ideas suicidas
• Menor abandonado sin supervisión adulta responsable

TIEMPO MÁXIMO DE RESPUESTA: 30 MINUTOS

═══════════════════════════════════════════════════════════════════
⏱️ PRIMEROS 5 MINUTOS - EVALUACIÓN Y SEGURIDAD
═══════════════════════════════════════════════════════════════════

✅ PASO 1: EVALUACIÓN INMEDIATA (0-2 minutos)
□ Verificar que el menor está físicamente seguro AHORA
□ Identificar si hay peligro inmediato presente
□ Evaluar si necesita atención médica urgente
□ Determinar ubicación del presunto agresor
□ Asegurar que no hay testigos que puedan interferir

✅ PASO 2: ASEGURAR ENTORNO (2-5 minutos)
□ Trasladar al menor a espacio seguro y privado
□ Remover objetos potencialmente peligrosos
□ Garantizar que presunto agresor no tiene acceso
□ Solicitar ayuda de personal de confianza si es necesario
□ Mantener calma absoluta y transmitir seguridad

FRASES CLAVE PARA USAR:
• "Estás seguro/a ahora, estoy aquí para protegerte"
• "Has hecho bien en contármelo"
• "No es culpa tuya, nada de esto es culpa tuya"
• "Vamos a asegurarnos de que tengas toda la ayuda necesaria"

═══════════════════════════════════════════════════════════════════
📞 MINUTOS 5-15 - COMUNICACIONES URGENTES
═══════════════════════════════════════════════════════════════════

✅ PASO 3: CONTACTO CON EMERGENCIAS (si procede)
SI HAY RIESGO VITAL INMEDIATO:
□ Llamar 112 inmediatamente
□ Solicitar ambulancia y/o intervención policial
□ Proporcionar ubicación exacta y estado del menor
□ Seguir instrucciones del operador de emergencias
□ Mantener línea abierta hasta llegada de servicios

✅ PASO 4: COMUNICACIÓN A SERVICIOS SOCIALES
□ Contactar servicios sociales municipales INMEDIATAMENTE
□ Usar línea de emergencias si está disponible
□ Proporcionar información mínima esencial:
   - Identidad del menor
   - Naturaleza de la emergencia
   - Ubicación actual
   - Medidas ya adoptadas
□ Solicitar orientación sobre próximos pasos
□ Confirmar recepción y registro de la comunicación

SCRIPT PARA LLAMADA URGENTE:
"Soy [nombre], delegado de protección de [entidad]. Tengo una emergencia de protección infantil que requiere intervención inmediata. Menor de [edad] años en situación de [descripción breve]. Ubicación: [dirección]. ¿Qué debo hacer mientras llegan ustedes?"

✅ PASO 5: COMUNICACIÓN A FISCALÍA (casos graves)
EN CASOS DE ABUSO SEXUAL O MALTRATO FÍSICO SEVERO:
□ Contactar fiscalía de menores directamente
□ Informar sobre preservación de evidencias
□ Solicitar instrucciones sobre actuaciones posteriores
□ Documentar número de expediente asignado

═══════════════════════════════════════════════════════════════════
🩺 MINUTOS 15-30 - ATENCIÓN Y DOCUMENTACIÓN
═══════════════════════════════════════════════════════════════════

✅ PASO 6: ATENCIÓN INMEDIATA AL MENOR
□ Proporcionar primeros auxilios básicos si es necesario
□ Evaluar necesidades básicas (agua, comida, baño)
□ Aplicar técnicas de primeros auxilios emocionales
□ Mantener comunicación tranquilizadora
□ NO realizar interrogatorio detallado
□ NO prometer que "nunca más pasará"

TÉCNICAS DE CONTENCIÓN EMOCIONAL:
• Respiración controlada: "Vamos a respirar juntos despacio"
• Grounding: "Dime 3 cosas que puedes ver en esta habitación"
• Validación: "Entiendo que te sientes [emoción], es normal"
• Esperanza: "Hay gente preparada para ayudarte"

✅ PASO 7: DOCUMENTACIÓN INMEDIATA
□ Anotar hora exacta de cada actuación realizada
□ Registrar palabras textuales del menor
□ Documentar estado físico y emocional observado
□ Fotografiar lesiones SOLO si autoridades lo indican
□ Describir entorno y circunstancias objetivamente
□ NO interpretar ni sacar conclusiones personales

ELEMENTOS CRÍTICOS A DOCUMENTAR:
• Fecha y hora exactas
• Palabras literales del menor
• Estado físico visible
• Personas presentes
• Actuaciones realizadas
• Respuestas obtenidas

═══════════════════════════════════════════════════════════════════
🏥 GESTIÓN DE ATENCIÓN MÉDICA DE EMERGENCIA
═══════════════════════════════════════════════════════════════════

SI EL MENOR NECESITA ATENCIÓN MÉDICA:

✅ PREPARACIÓN PARA TRASLADO
□ Contactar con centro de salud o hospital
□ Informar sobre naturaleza de lesiones
□ Solicitar personal especializado en menores
□ Preparar documentación de identificación
□ Asegurar acompañamiento de adulto de confianza

✅ EN EL CENTRO MÉDICO
□ Informar discretamente al personal médico sobre sospechas
□ Solicitar examen forense si procede
□ Asegurar que se documenten todas las lesiones
□ Mantener contacto con servicios sociales
□ NO dejar solo al menor en ningún momento

✅ COORDINACIÓN CON PERSONAL SANITARIO
□ Proporcionar información objetiva sobre cómo se detectaron lesiones
□ Facilitar historial médico si está disponible
□ Solicitar informe médico detallado
□ Coordinar plan de seguimiento médico

═══════════════════════════════════════════════════════════════════
🚫 GESTIÓN DE SITUACIONES ESPECIALES
═══════════════════════════════════════════════════════════════════

SI EL AGRESOR ESTÁ PRESENTE EN LA ENTIDAD:

✅ PROTOCOLO DE SEPARACIÓN INMEDIATA
□ Separar inmediatamente del menor sin confrontación
□ Asignar a otra persona la supervisión del agresor
□ Evitar acusaciones directas hasta confirmación oficial
□ Implementar medidas cautelares (suspensión temporal)
□ Documentar todas las medidas adoptadas
□ Seguir instrucciones de autoridades competentes

SI LA FAMILIA SE RESISTE A LA INTERVENCIÓN:

✅ GESTIÓN DE RESISTENCIA FAMILIAR
□ Mantener calma y profesionalidad
□ Explicar obligación legal de proteger al menor
□ No ceder ante presiones o amenazas
□ Solicitar respaldo policial si es necesario
□ Documentar todas las interacciones
□ Seguir instrucciones de servicios sociales

SI HAY MÚLTIPLES MENORES AFECTADOS:

✅ PROTOCOLO PARA CASOS MÚLTIPLES
□ Evaluar riesgo individual de cada menor
□ Priorizar según gravedad de situación
□ Asignar personal específico a cada menor
□ Evitar contamination entre testimonios
□ Coordinar con autoridades el plan de actuación
□ Documentar por separado cada caso

═══════════════════════════════════════════════════════════════════
📋 CHECKLIST DE CIERRE DE PROTOCOLO INMEDIATO
═══════════════════════════════════════════════════════════════════

✅ VERIFICACIÓN FINAL (antes de 30 minutos)
□ Menor está físicamente seguro
□ Servicios de emergencia contactados (si procede)
□ Servicios sociales notificados
□ Documentación inicial completada
□ Personal necesario informado
□ Medidas de protección implementadas
□ Seguimiento programado establecido

✅ TRANSICIÓN A PROTOCOLO ESTÁNDAR
□ Comunicación escrita formal en 24h
□ Seguimiento continuado establecido
□ Coordinación interinstitucional activada
□ Plan de protección a medio plazo iniciado

═══════════════════════════════════════════════════════════════════
🆘 RECURSOS DE EMERGENCIA 24/7

🚨 EMERGENCIAS GENERALES: 112
📞 TELÉFONO DEL MENOR: 116 111
🏥 EMERGENCIAS SANITARIAS: 061
👮 GUARDIA CIVIL: 062
🚔 POLICÍA NACIONAL: 091
🧠 LÍNEA CONTRA EL SUICIDIO: 024

📞 SERVICIOS SOCIALES URGENTES: [Completar número local]
👨‍⚖️ FISCALÍA DE MENORES: [Completar número local]
🏥 HOSPITAL DE REFERENCIA: [Completar número local]

═══════════════════════════════════════════════════════════════════

⚠️ RECORDATORIO CRÍTICO ⚠️
LA SEGURIDAD DEL MENOR ES LA PRIORIDAD ABSOLUTA
ANTE LA DUDA, ACTIVAR SIEMPRE EL PROTOCOLO
DOCUMENTAR TODO, INTERPRETAR NADA
MANTENER CONFIDENCIALIDAD EN TODO MOMENTO

═══════════════════════════════════════════════════════════════════`
    }
  },
  5: {
    'plantillas-comunicacion': {
      titulo: 'Plantillas de Comunicación Interinstitucional',
      contenido: `PLANTILLAS OFICIALES DE COMUNICACIÓN INTERINSTITUCIONAL

DOCUMENTOS ESTANDARIZADOS PARA DELEGADOS DE PROTECCIÓN

═══════════════════════════════════════════════════════════════════
📄 PLANTILLA 1: COMUNICACIÓN INICIAL A SERVICIOS SOCIALES
═══════════════════════════════════════════════════════════════════

PARA: SERVICIOS SOCIALES MUNICIPALES DE [MUNICIPIO]
DE: [NOMBRE ENTIDAD] - DELEGADO/A DE PROTECCIÓN
FECHA: [DD/MM/AAAA]
REF: EXPEDIENTE N.º [NÚMERO]

ASUNTO: COMUNICACIÓN DE SITUACIÓN DE RIESGO/MALTRATO INFANTIL

Estimados/as compañeros/as,

Por la presente, en cumplimiento del artículo 20 de la Ley Orgánica 8/2021 (LOPIVI), me dirijo a ustedes para comunicar una situación que requiere su valoración e intervención especializada.

1. IDENTIFICACIÓN DE LA ENTIDAD COMUNICANTE
- Entidad: [Nombre completo de la entidad]
- CIF: [Número CIF]
- Dirección: [Dirección completa]
- Teléfono: [Número de contacto]
- Email: [Correo electrónico]
- Delegado/a comunicante: [Nombre completo]
- DNI: [Documento identidad] / Teléfono: [Contacto directo]

2. IDENTIFICACIÓN DEL MENOR
- Nombre completo: [Nombre y apellidos]
- Fecha de nacimiento: [DD/MM/AAAA] (Edad: X años)
- DNI/NIE: [Documento si disponible]
- Domicilio: [Dirección completa]
- Centro educativo: [Nombre del centro]
- Progenitores/tutores: [Nombres y datos de contacto]

3. EXPOSICIÓN CRONOLÓGICA DE LOS HECHOS
[Descripción objetiva, cronológica y detallada de los hechos observados, incluyendo fechas, horas, lugares específicos y circunstancias. Utilizar lenguaje técnico y objetivo, evitando interpretaciones personales.]

4. INDICADORES IDENTIFICADOS
[Detallar específicamente los indicadores físicos, emocionales, comportamentales o sociales observados que motivan esta comunicación]

5. EVALUACIÓN PROFESIONAL
- Nivel de riesgo estimado: [Alto/Medio/Bajo]
- Urgencia de la intervención: [Inmediata/Prioritaria/Ordinaria]
- Factores de riesgo identificados: [Enumerar]
- Factores protectores presentes: [Enumerar]

6. ACTUACIONES YA REALIZADAS
[Describir medidas de protección implementadas y contactos realizados]

7. SOLICITUD ESPECÍFICA
Solicitamos su intervención especializada para:
- Evaluación técnica de la situación familiar
- Implementación de medidas de protección apropiadas
- Coordinación para seguimiento del caso
- [Otras solicitudes específicas]

8. COLABORACIÓN OFRECIDA
Ponemos a su disposición:
- Documentación completa del caso
- Disponibilidad para reuniones de coordinación
- Continuidad en medidas de protección en nuestro ámbito
- [Otros recursos disponibles]

Quedamos a su disposición para cualquier aclaración o información adicional que consideren necesaria.

Atentamente,

[Firma]
[Nombre del delegado/a]
[Cargo]
[Sello de la entidad]

ANEXOS:
- Formulario de registro de incidencia
- [Otros documentos relevantes]

═══════════════════════════════════════════════════════════════════
📄 PLANTILLA 2: COMUNICACIÓN A FISCALÍA DE MENORES
═══════════════════════════════════════════════════════════════════

ILMO/A. SR/A. FISCAL DE MENORES
FISCALÍA PROVINCIAL DE [PROVINCIA]

DE: [NOMBRE ENTIDAD] - DELEGADO/A DE PROTECCIÓN
FECHA: [DD/MM/AAAA]
REF: EXPEDIENTE N.º [NÚMERO]

ASUNTO: COMUNICACIÓN DE HECHOS QUE PUEDEN CONSTITUIR DELITO CONTRA MENOR

Ilmo/a. Sr/a. Fiscal,

En virtud de lo establecido en el artículo 20.2 de la LOPIVI y en cumplimiento de nuestro deber de comunicación de hechos que puedan constituir delito contra menores, nos dirigimos a esa Fiscalía para poner en su conocimiento los siguientes hechos:

1. DATOS DE LA ENTIDAD
[Mismos datos que plantilla anterior]

2. DATOS DEL MENOR VÍCTIMA
[Datos completos del menor]

3. HECHOS COMUNICADOS
[Descripción detallada de los hechos que pueden constituir delito, con especial atención a elementos que puedan tener relevancia penal]

4. PRESUNTO/A RESPONSABLE (si identificado)
- Nombre: [Si es conocido]
- Relación con el menor: [Familiar, educador, etc.]
- Datos adicionales: [Si están disponibles]

5. EVIDENCIAS DISPONIBLES
[Documentación, testimonios, evidencias físicas disponibles]

6. MEDIDAS CAUTELARES ADOPTADAS
[Medidas inmediatas implementadas para protección del menor]

7. ESTADO ACTUAL DEL MENOR
[Situación física, emocional y de protección actual]

Solicitamos respetuosamente:
- Evaluación de los hechos comunicados
- Orientación sobre preservación de evidencias
- Coordinación para medidas de protección
- Instrucciones para actuaciones posteriores

Quedamos a disposición de esa Fiscalía para ampliar información o colaborar en las investigaciones que procedan.

Respetuosamente,

[Firma]
[Nombre del delegado/a]
[Cargo]
[Sello de la entidad]

═══════════════════════════════════════════════════════════════════
📄 PLANTILLA 3: COMUNICACIÓN DE SEGUIMIENTO
═══════════════════════════════════════════════════════════════════

PARA: [ORGANISMO RECEPTOR]
DE: [NOMBRE ENTIDAD]
FECHA: [DD/MM/AAAA]
REF: SEGUIMIENTO EXPEDIENTE N.º [NÚMERO]

ASUNTO: COMUNICACIÓN DE SEGUIMIENTO - EVOLUCIÓN DEL CASO

Estimados/as compañeros/as,

En relación con nuestro expediente de referencia, comunicado en fecha [fecha anterior], nos dirigimos a ustedes para informar sobre la evolución del caso y solicitar coordinación para próximas actuaciones.

1. RESUMEN DEL CASO
- Menor: [Nombre]
- Fecha comunicación inicial: [DD/MM/AAAA]
- Motivo inicial: [Breve resumen]

2. EVOLUCIÓN OBSERVADA
[Descripción objetiva de cambios observados en el menor desde la última comunicación]

3. NUEVOS DESARROLLOS
[Información adicional surgida, nuevos indicadores, cambios en circunstancias]

4. ACTUACIONES REALIZADAS POR NUESTRA ENTIDAD
[Medidas implementadas, seguimiento realizado, coordinaciones efectuadas]

5. VALORACIÓN ACTUAL
- Estado del menor: [Mejoría/Estable/Empeoramiento]
- Nivel de riesgo: [Actual evaluación]
- Eficacia de medidas: [Valoración]

6. SOLICITUD PARA PRÓXIMAS ACTUACIONES
[Peticiones específicas de coordinación, modificación de medidas, etc.]

7. PROPUESTAS DE COLABORACIÓN
[Sugerencias para mejorar coordinación o eficacia de la intervención]

Agradecemos la atención prestada y quedamos a su disposición.

Cordialmente,

[Firma]
[Nombre del delegado/a]

═══════════════════════════════════════════════════════════════════
📄 PLANTILLA 4: SOLICITUD DE INFORMACIÓN/COORDINACIÓN
═══════════════════════════════════════════════════════════════════

PARA: [ORGANISMO DESTINATARIO]
DE: [NOMBRE ENTIDAD]
FECHA: [DD/MM/AAAA]
REF: SOLICITUD INFORMACIÓN EXPEDIENTE N.º [NÚMERO]

ASUNTO: SOLICITUD DE INFORMACIÓN PARA COORDINACIÓN DE CASO

Estimados/as compañeros/as,

En relación con el caso de [nombre del menor], expediente de referencia, y en aras de optimizar la coordinación interinstitucional para una protección integral efectiva, solicitamos respetuosamente:

1. INFORMACIÓN SOBRE ACTUACIONES REALIZADAS
- Estado actual de la investigación/intervención
- Medidas adoptadas hasta la fecha
- Valoración técnica de la situación
- Previsiones de actuaciones futuras

2. ORIENTACIÓN PARA NUESTRA ACTUACIÓN
- Medidas específicas a mantener en nuestro ámbito
- Modificaciones necesarias en nuestro protocolo
- Aspectos específicos a observar y comunicar
- Frecuencia recomendada para comunicaciones

3. COORDINACIÓN DE ACTUACIONES
- Posibilidad de reunión de coordinación
- Designación de persona de contacto específica
- Establecimiento de calendario de seguimiento
- Protocolo de comunicación de novedades

4. RECURSOS DISPONIBLES
Informamos que mantenemos disponibles:
[Enumerar recursos y capacidades de la entidad]

La finalidad de esta solicitud es garantizar la máxima eficacia en la protección del menor y evitar duplicidades o vacíos en la intervención.

Agradecemos de antemano su colaboración.

Atentamente,

[Firma]
[Nombre del delegado/a]

═══════════════════════════════════════════════════════════════════
📄 PLANTILLA 5: COMUNICACIÓN DE CIERRE DE CASO
═══════════════════════════════════════════════════════════════════

PARA: [ORGANISMOS INVOLUCRADOS]
DE: [NOMBRE ENTIDAD]
FECHA: [DD/MM/AAAA]
REF: CIERRE EXPEDIENTE N.º [NÚMERO]

ASUNTO: COMUNICACIÓN DE CIERRE DE EXPEDIENTE

Estimados/as compañeros/as,

Por la presente comunicamos el cierre de nuestro expediente de referencia, correspondiente al menor [nombre], por los motivos que se detallan a continuación:

1. MOTIVO DEL CIERRE
□ Resolución satisfactoria del caso
□ Derivación completa a servicios especializados
□ Finalización de relación con nuestra entidad
□ Decisión de servicios sociales competentes
□ Otros: [especificar]

2. RESUMEN EJECUTIVO DEL CASO
- Duración total: [número] días
- Número de actuaciones realizadas: [número]
- Organismos involucrados: [enumerar]
- Evolución del menor: [descripción]

3. ESTADO FINAL
- Situación del menor: [descripción final]
- Medidas de protección vigentes: [enumerar]
- Recursos de apoyo establecidos: [detallar]
- Seguimiento posterior: [responsable y modalidad]

4. VALORACIÓN FINAL
- Objetivos alcanzados: [enumerar]
- Eficacia de la coordinación: [valorar]
- Aspectos positivos del proceso: [destacar]
- Áreas de mejora identificadas: [señalar]

5. RECOMENDACIONES
[Sugerencias para casos futuros o mejora de protocolos]

6. DISPONIBILIDAD FUTURA
Mantenemos disponibilidad para:
- Consultas sobre el caso cerrado
- Colaboración en casos similares
- Aportación de información si es requerida

Agradecemos la colaboración prestada durante todo el proceso.

Cordialmente,

[Firma]
[Nombre del delegado/a]

═══════════════════════════════════════════════════════════════════
📞 DIRECTORIO DE CONTACTOS

🏛️ SERVICIOS SOCIALES MUNICIPALES: [Completar números locales]
👨‍⚖️ FISCALÍA DE MENORES: [Completar número local]
🏥 CENTRO DE SALUD MENTAL INFANTIL: [Completar número local]
📞 TELÉFONO DEL MENOR: 116 111
🆘 EMERGENCIAS: 112

═══════════════════════════════════════════════════════════════════

NOTAS IMPORTANTES:
- Todas las comunicaciones deben enviarse por registro de entrada
- Conservar justificante de entrega
- Archivar copia en expediente del caso
- Seguir protocolos de confidencialidad en todo momento
- Adaptar plantillas según normativa autonómica específica

═══════════════════════════════════════════════════════════════════`
    }
  },
  6: {
    'casos-practicos-completos': {
      titulo: 'Casos Prácticos Completos - Análisis y Resolución',
      contenido: `CASOS PRÁCTICOS COMPLETOS PARA FORMACIÓN DE DELEGADOS

ANÁLISIS INTEGRAL DE SITUACIONES REALES

═══════════════════════════════════════════════════════════════════
📚 CASO PRÁCTICO 1: DETECCIÓN DE MALTRATO FÍSICO
═══════════════════════════════════════════════════════════════════

🔍 DESCRIPCIÓN DEL CASO:

CONTEXTO:
Centro deportivo municipal. Menor de 8 años, Carlos, que acude regularmente a clases de natación. El monitor observa que durante las últimas tres semanas presenta cambios significativos en su comportamiento.

INDICADORES OBSERVADOS:
- Moratones en brazos y espalda de diferentes colores (indicando diferentes momentos)
- Evita cambiarse de ropa delante de otros
- Llanto cuando otros niños hacen ruido fuerte
- Se sobresalta cuando alguien se acerca por detrás
- Ha bajado su rendimiento en natación
- Dice que no quiere ir a casa cuando terminan las clases

REVELACIÓN:
Durante un descanso, Carlos se acerca al delegado de protección y dice: "Mi papá me pega con el cinturón cuando no hago las cosas bien. Ayer me pegó porque llegué tarde y hoy me duele mucho la espalda."

📋 ANÁLISIS PROFESIONAL:

EVALUACIÓN DE INDICADORES:
✓ Evidencia física: Lesiones múltiples en diferentes estadios
✓ Cambios comportamentales: Hipervigilancia, evitación
✓ Revelación directa: Clara y específica
✓ Patrón temporal: Deterioro progresivo observado

NIVEL DE RIESGO: ALTO
- Maltrato físico confirmado
- Patrón repetitivo establecido
- Menor en situación de vulnerabilidad
- Escalada posible si no se interviene

🚨 ACTUACIÓN PROFESIONAL DESARROLLADA:

FASE INMEDIATA (0-30 minutos):
1. Agradecer la confianza del menor y validar sus sentimientos
2. Trasladar a espacio privado y seguro
3. Documentar palabras exactas del menor
4. Evaluar necesidad de atención médica (dolor en espalda)
5. Contactar con servicios sociales inmediatamente

COMUNICACIÓN A AUTORIDADES:
- Servicios Sociales: Contacto telefónico en 1 hora
- Documentación escrita: Enviada en 4 horas
- Coordinación médica: Examen en centro de salud
- Seguimiento: Observación diaria en centro deportivo

MEDIDAS DE PROTECCIÓN:
- Supervisión cercana durante actividades
- Apoyo emocional específico
- Coordinación con monitor para seguimiento
- Información a dirección del centro
- Protocolo de recogida supervisada

🎯 RESULTADO Y EVOLUCIÓN:

RESPUESTA INSTITUCIONAL:
- Servicios sociales: Intervención en 24h
- Trabajo social familiar: Evaluación de competencias parentales
- Apoyo psicológico: Derivación a centro de salud mental infantil
- Medidas judiciales: Supervisión familiar establecida

EVOLUCIÓN DEL MENOR:
- Semana 1-2: Mantenimiento de indicadores de estrés
- Semana 3-4: Mejora gradual en comportamiento
- Mes 2-3: Recuperación de confianza y participación
- Seguimiento a 6 meses: Evolución positiva mantenida

💡 LECCIONES APRENDIDAS:

FACTORES DE ÉXITO:
- Observación sistemática permitió detección temprana
- Ambiente de confianza facilitó revelación
- Respuesta inmediata y coordinada
- Mantenimiento de seguimiento continuado

ASPECTOS A MEJORAR:
- Formación adicional en primeros auxilios emocionales
- Protocolo más específico para documentación médica
- Mayor coordinación inicial con centro educativo

═══════════════════════════════════════════════════════════════════
📚 CASO PRÁCTICO 2: ABUSO SEXUAL INTRAFAMILIAR
═══════════════════════════════════════════════════════════════════

🔍 DESCRIPCIÓN DEL CASO:

CONTEXTO:
Club deportivo privado. Menor de 12 años, María, participante en equipo de gimnasia. La entrenadora observa cambios preocupantes en las últimas semanas.

INDICADORES OBSERVADOS:
- Conocimiento sexual inapropiado para su edad
- Comportamiento sexualizado con compañeras
- Negativa a participar en ejercicios que requieran contacto
- Pesadillas durante concentraciones deportivas
- Regresión a comportamientos infantiles
- Dibujos con contenido sexual explícito

REVELACIÓN:
Durante una conversación individual, María revela: "Mi tío me hace cosas feas cuando viene a casa y mamá no está. Me dice que es nuestro secreto y que si lo cuento va a pasar algo malo."

📋 ANÁLISIS PROFESIONAL:

EVALUACIÓN ESPECÍFICA:
✓ Indicadores comportamentales consistentes con abuso sexual
✓ Revelación gradual y detallada
✓ Agresor con acceso regular al menor
✓ Estrategias de silenciamiento identificadas

NIVEL DE RIESGO: CRÍTICO
- Abuso sexual confirmado
- Agresor familiar con acceso continuo
- Amenazas para mantener silencio
- Necesidad de protección inmediata

🚨 ACTUACIÓN PROFESIONAL DESARROLLADA:

PROTOCOLO DE EMERGENCIA ACTIVADO:

RESPUESTA INMEDIATA (0-15 minutos):
1. Validación y agradecimiento por la confianza
2. Asegurar que no es culpa del menor
3. Garantizar protección inmediata
4. NO realizar preguntas sobre detalles del abuso
5. Mantener confidencialidad pero explicar necesidad de ayuda profesional

COMUNICACIONES URGENTES:
- Fiscalía de Menores: Contacto inmediato
- Servicios Sociales: Comunicación paralela
- Dirección del club: Información necesaria
- Progenitora no agresora: Coordinación con servicios sociales

MEDIDAS CAUTELARES:
- Prohibición de contacto con presunto agresor
- Supervisión constante en actividades del club
- Coordinación para que menor no quede solo
- Protocolo especial para recogida por familiares

🎯 RESULTADO Y EVOLUCIÓN:

INTERVENCIÓN JUDICIAL:
- Orden de alejamiento del presunto agresor
- Inicio de procedimiento penal
- Medidas de protección específicas
- Apoyo psicológico especializado inmediato

EVOLUCIÓN A LARGO PLAZO:
- Terapia especializada en trauma sexual
- Apoyo familiar para progenitora protectora
- Mantenimiento en actividad deportiva como factor protector
- Seguimiento a 2 años: Recuperación progresiva

💡 LECCIONES CRÍTICAS:

ASPECTOS CRUCIALES:
- Importancia de NO revictimizar con interrogatorios
- Coordinación inmediata con autoridades judiciales
- Apoyo fundamental a familiares protectores
- Valor terapéutico de mantener rutinas normalizadas

═══════════════════════════════════════════════════════════════════
📚 CASO PRÁCTICO 3: NEGLIGENCIA GRAVE FAMILIAR
═══════════════════════════════════════════════════════════════════

🔍 DESCRIPCIÓN DEL CASO:

CONTEXTO:
Centro de actividades extraescolares. Menor de 6 años, Alejandro, que presenta signos evidentes de negligencia en cuidados básicos.

INDICADORES OBSERVADOS:
- Higiene personal deficiente persistente
- Ropa inadecuada para el clima
- Hambre constante, pide comida repetidamente
- Cansancio extremo durante actividades
- Retrasos frecuentes e injustificados
- Problemas médicos evidentes no atendidos (caries, conjuntivitis)

SITUACIÓN FAMILIAR:
Madre con problemas de salud mental no diagnosticados, padre ausente, situación de estrés económico severo, falta de red de apoyo familiar.

📋 ANÁLISIS PROFESIONAL:

EVALUACIÓN INTEGRAL:
✓ Negligencia en cuidados básicos confirmada
✓ Factores de riesgo familiares múltiples
✓ Ausencia de factores protectores evidentes
✓ Impacto en desarrollo físico y emocional del menor

NIVEL DE RIESGO: ALTO
- Negligencia grave con impacto en desarrollo
- Vulnerabilidad familiar extrema
- Necesidad de apoyo integral urgente

🚨 ACTUACIÓN PROFESIONAL DESARROLLADA:

ENFOQUE DE APOYO FAMILIAR:

MEDIDAS INMEDIATAS:
1. Atención a necesidades básicas en el centro
2. Coordinación con servicios sociales para evaluación familiar
3. Derivación a servicios de salud para atención médica
4. Información sobre recursos de apoyo disponibles

PLAN DE INTERVENCIÓN:
- Trabajo social familiar intensivo
- Apoyo psicológico para la madre
- Recursos de apoyo económico y social
- Seguimiento educativo especializado
- Red de apoyo comunitario

🎯 RESULTADO Y EVOLUCIÓN:

INTERVENCIÓN EXITOSA:
- Mejora gradual en cuidados básicos
- Estabilización de situación familiar
- Apoyo continuado de servicios sociales
- Mantenimiento de unidad familiar con supervisión

═══════════════════════════════════════════════════════════════════
📚 CASO PRÁCTICO 4: MALTRATO ENTRE IGUALES (BULLYING)
═══════════════════════════════════════════════════════════════════

🔍 DESCRIPCIÓN DEL CASO:

CONTEXTO:
Campamento de verano. Menor de 10 años, Lucía, víctima de acoso sistemático por parte de un grupo de compañeros mayores.

INDICADORES OBSERVADOS:
- Aislamiento social progresivo
- Negativa a participar en actividades grupales
- Ansiedad extrema antes de actividades
- Pertenencias dañadas o perdidas frecuentemente
- Cambios en apetito y sueño
- Expresiones de no querer volver al campamento

📋 ANÁLISIS PROFESIONAL:

SITUACIÓN ESPECÍFICA:
✓ Maltrato entre iguales confirmado
✓ Patrón sistemático y organizado
✓ Múltiples agresores identificados
✓ Impacto emocional significativo en víctima

🚨 ACTUACIÓN PROFESIONAL DESARROLLADA:

PROTOCOLO ANTI-ACOSO:
1. Separación inmediata de agresores y víctima
2. Investigación interna del patrón de maltrato
3. Comunicación a familias de todos los menores involucrados
4. Medidas disciplinarias para agresores
5. Apoyo específico para la víctima
6. Programa de prevención para todo el grupo

═══════════════════════════════════════════════════════════════════
🎓 EJERCICIOS DE EVALUACIÓN
═══════════════════════════════════════════════════════════════════

EJERCICIO 1: IDENTIFICACIÓN DE INDICADORES
Lee el siguiente escenario y identifica todos los indicadores de maltrato presentes:

"Ana, de 7 años, llega al centro con moratones en brazos que explica como caídas. Su comportamiento ha cambiado: antes era participativa y ahora se mantiene aislada. Evita el contacto físico en juegos y se sobresalta con ruidos fuertes. Sus padres muestran hostilidad cuando se les pregunta sobre las lesiones."

INDICADORES IDENTIFICADOS:
□ Físicos: _______________
□ Emocionales: ___________
□ Comportamentales: ______
□ Familiares: ____________

EJERCICIO 2: PLANIFICACIÓN DE ACTUACIÓN
Diseña un plan de actuación completo para el siguiente caso:

"Durante una actividad, Luis de 9 años te dice: 'En casa me pegan cuando hago ruido. Ayer me dolió mucho y hoy no puedo mover bien el brazo'."

TU PLAN DE ACTUACIÓN:
1. Primeros 5 minutos: _______________________
2. Comunicaciones (15 min): __________________
3. Documentación: ___________________________
4. Seguimiento: _____________________________

EJERCICIO 3: COMUNICACIÓN PROFESIONAL
Redacta la comunicación inicial a servicios sociales para este caso:

"María, 11 años, ha revelado que su profesor particular 'la toca de forma que no le gusta' cuando están solos. Presenta miedo extremo a quedarse sola con adultos varones."

═══════════════════════════════════════════════════════════════════
🏆 CASOS DE ÉXITO - BUENAS PRÁCTICAS
═══════════════════════════════════════════════════════════════════

FACTORES COMUNES EN CASOS EXITOSOS:
• Detección temprana por observación sistemática
• Respuesta inmediata y coordinada
• Comunicación efectiva con autoridades
• Seguimiento continuado y documentado
• Coordinación interinstitucional sólida
• Apoyo específico adaptado a cada caso
• Mantenimiento de factores protectores

ELEMENTOS CLAVE PARA EL ÉXITO:
1. PREPARACIÓN: Formación continua del equipo
2. DETECCIÓN: Observación sistemática y documentada
3. RESPUESTA: Protocolos claros y bien implementados
4. COORDINACIÓN: Trabajo en red efectivo
5. SEGUIMIENTO: Evaluación continua de resultados

═══════════════════════════════════════════════════════════════════`
    }
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

  // Función mejorada para generar PDFs específicos
  const generarPDFEspecifico = (numeroModulo: number, tipoPDF: string) => {
    try {
      const pdfData = pdfEspecificos[numeroModulo as keyof typeof pdfEspecificos]?.[tipoPDF];
      if (!pdfData) {
        alert('Tipo de PDF no disponible para este módulo');
        return;
      }

      const doc = new jsPDF();

    // Configuración mejorada con estilo web
    doc.setFont('helvetica');
    let yPos = 15;
    const margenIzq = 15;
    const margenDer = 15;
    const anchoLinea = 180;

    // Header con estilo Custodia360
    doc.setFillColor(37, 99, 235); // Color azul Custodia360
    doc.rect(0, 0, 210, 25, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTODIA360', margenIzq, 12);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema Integral de Protección de Menores', margenIzq, 20);

    yPos = 35;
    doc.setTextColor(0, 0, 0);

    // Título del documento
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    const tituloLineas = doc.splitTextToSize(pdfData.titulo, anchoLinea);
    tituloLineas.forEach((linea: string) => {
      doc.text(linea, margenIzq, yPos);
      yPos += 7;
    });

    yPos += 5;

    // Información del usuario en caja
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margenIzq, yPos, anchoLinea, 20, 2, 2, 'FD');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Usuario: ${usuario?.nombre || 'N/A'} | Entidad: ${usuario?.entidad || 'N/A'}`, margenIzq + 5, yPos + 7);
    doc.text(`Tipo: ${usuario?.tipoEntidad || 'N/A'} | Generado: ${new Date().toLocaleDateString('es-ES')}`, margenIzq + 5, yPos + 14);

    yPos += 30;

    // Contenido del PDF con mejor formato
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const contenidoPersonalizado = getContenidoPersonalizado(pdfData.contenido, usuario?.tipoEntidad || 'deportivo');
    const lineasContenido = doc.splitTextToSize(contenidoPersonalizado, anchoLinea);

    lineasContenido.forEach((linea: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      // Mejorar formato para títulos y secciones
      if (linea.includes('═══') || linea.includes('🚨') || linea.includes('📋')) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
      } else if (linea.startsWith('PASO ') || linea.startsWith('FASE ')) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
      }

      doc.text(linea, margenIzq, yPos);
      yPos += 4;
    });

    // Footer con estilo mejorado
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      // Línea decorativa
      doc.setDrawColor(37, 99, 235);
      doc.line(margenIzq, 285, 210 - margenDer, 285);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Custodia360 - Formación Especializada en Protección de Menores', margenIzq, 292);
      doc.text(`Página ${i} de ${totalPages}`, 180, 292);
    }

      // Descargar con nombre específico
      const nombreArchivo = `Custodia360_Modulo${numeroModulo}_${tipoPDF.replace(/-/g, '_')}.pdf`;
      doc.save(nombreArchivo);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtelo de nuevo.');
    }
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
    doc.text('SU PROCESO DE FORMACIÓN CUSTODIA360', margenIzq, yPos);
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
      doc.text('Custodia360 - Sistema de Formación Integral', margenIzq, 290);
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
                Su proceso de formación Custodia360
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
              <div className="flex flex-col space-y-2">
                <div className="text-xs text-gray-600 text-right mb-1">PDFs Especializados Disponibles:</div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {pdfEspecificos[moduloActual as keyof typeof pdfEspecificos] &&
                    Object.entries(pdfEspecificos[moduloActual as keyof typeof pdfEspecificos]).map(([tipoPDF, data]) => (
                      <button
                        key={tipoPDF}
                        onClick={() => generarPDFEspecifico(moduloActual, tipoPDF)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        title={data.titulo}
                      >
                        📄 {tipoPDF.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </button>
                    ))
                  }
                </div>
                <button
                  onClick={() => generarPDFModulo(moduloActual)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  📄 Descargar Módulo Completo
                </button>
              </div>
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
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
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

        {/* Panel de PDFs Mejorado */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow p-6 border border-blue-200">
          <div className="mb-4">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              📄 Sistema de Descarga de Documentos Especializados
            </h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• <strong>PDFs Diferenciados:</strong> Cada documento tiene contenido específico y único</p>
              <p>• <strong>Estilo Web Profesional:</strong> Diseño Custodia360 con formato mejorado</p>
              <p>• <strong>Contenido Personalizado:</strong> Adaptado a tu tipo de entidad ({usuario?.tipoEntidad})</p>
              <p>• <strong>Documentación Oficial:</strong> Válida para auditorías y cumplimiento normativo</p>
            </div>
          </div>

          {/* PDFs del Módulo Actual */}
          <div className="mb-6">
            <h5 className="font-medium text-gray-900 mb-3">📋 Módulo {moduloActual}: Documentos Disponibles</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pdfEspecificos[moduloActual as keyof typeof pdfEspecificos] &&
                Object.entries(pdfEspecificos[moduloActual as keyof typeof pdfEspecificos]).map(([tipoPDF, data]) => (
                  <button
                    key={tipoPDF}
                    onClick={() => generarPDFEspecifico(moduloActual, tipoPDF)}
                    className="bg-white border border-blue-300 hover:border-blue-500 hover:bg-blue-50 px-4 py-3 rounded-lg text-sm transition-all duration-200 text-left shadow-sm"
                    title={data.titulo}
                  >
                    <div className="font-medium text-blue-900 text-xs mb-1">
                      {tipoPDF.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2">
                      {data.titulo}
                    </div>
                  </button>
                ))
              }
            </div>
          </div>

          {/* Acciones Generales */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => generarPDFModulo(moduloActual)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              📄 Módulo Completo (Tradicional)
            </button>
            <button
              onClick={descargarTodosModulos}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              📚 Todos los Módulos Completos
            </button>
            <button
              onClick={() => {
                const confirmacion = window.confirm('¿Deseas descargar TODOS los PDFs especializados? Se generarán múltiples archivos organizados por módulo.');
                if (confirmacion) {
                  Object.keys(pdfEspecificos).forEach(modulo => {
                    Object.keys(pdfEspecificos[parseInt(modulo) as keyof typeof pdfEspecificos]).forEach((tipoPDF, index) => {
                      setTimeout(() => {
                        generarPDFEspecifico(parseInt(modulo), tipoPDF);
                      }, index * 1000);
                    });
                  });
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              🎯 Biblioteca Completa Especializada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
