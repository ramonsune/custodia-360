// Biblioteca de formación LOPIVI - Contenido completo del curso

export interface ModuloFormacion {
  id: string
  titulo: string
  duracion: string // en minutos
  descripcion: string
  contenido: string[]
  objetivos: string[]
  recursos: string[]
}

export interface PreguntaTest {
  id: string
  modulo: string
  pregunta: string
  opciones: string[]
  respuestaCorrecta: number // índice de la respuesta correcta (0, 1, 2)
  explicacion: string
}

export interface ProgresoUsuario {
  userId: string
  modulosCompletados: string[]
  testsAprobados: string[]
  puntuacionTests: Record<string, number>
  fechaInicio: string
  fechaFinalizacion?: string
  certificado?: string
  tiempoTotal: number // en minutos
}

export interface ResultadoTest {
  modulo: string
  puntuacion: number
  respuestas: number[]
  aprobado: boolean
  fecha: string
}

// Constantes del sistema
export const PUNTUACION_MINIMA = 75 // 75% mínimo para aprobar
export const DURACION_TOTAL_CURSO = 390 // 6h 30min en minutos

// Módulos del curso LOPIVI
export const MODULOS_LOPIVI: ModuloFormacion[] = [
  {
    id: 'modulo-1',
    titulo: 'Introducción a la LOPIVI',
    duracion: '45',
    descripcion: 'Fundamentos y marco legal de la Ley Orgánica de Protección Integral a la Infancia y la Adolescencia.',
    contenido: [
      'La LOPIVI: Antecedentes y contexto legal',
      'Objetivos principales de la ley',
      'Ámbito de aplicación en entidades deportivas y de ocio',
      'Principios fundamentales de protección infantil',
      'Derechos de los menores en el ámbito deportivo',
      'Responsabilidades de las entidades'
    ],
    objetivos: [
      'Comprender el marco legal de la LOPIVI',
      'Identificar las obligaciones de las entidades',
      'Reconocer los derechos fundamentales de los menores'
    ],
    recursos: [
      'Texto completo de la LOPIVI',
      'Guía de implementación para entidades deportivas',
      'Casos prácticos de aplicación'
    ]
  },
  {
    id: 'modulo-2',
    titulo: 'El Delegado de Protección',
    duracion: '60',
    descripcion: 'Rol, funciones y responsabilidades del Delegado de Protección en entidades deportivas.',
    contenido: [
      'Perfil y requisitos del Delegado de Protección',
      'Funciones principales y responsabilidades',
      'Protocolo de actuación ante situaciones de riesgo',
      'Coordinación con otros profesionales',
      'Delegado principal vs delegado suplente',
      'Herramientas de trabajo y documentación'
    ],
    objetivos: [
      'Definir claramente el rol del delegado',
      'Establecer protocolos de actuación',
      'Desarrollar habilidades de intervención'
    ],
    recursos: [
      'Manual del Delegado de Protección',
      'Protocolos de actuación específicos',
      'Herramientas de evaluación de riesgo'
    ]
  },
  {
    id: 'modulo-3',
    titulo: 'Detección de Situaciones de Riesgo',
    duracion: '75',
    descripcion: 'Identificación temprana de señales de alarma y factores de riesgo en menores.',
    contenido: [
      'Indicadores físicos de maltrato',
      'Señales comportamentales y emocionales',
      'Factores de riesgo en el entorno deportivo',
      'Técnicas de observación sistemática',
      'Diferenciación entre disciplina y maltrato',
      'Documentación de incidentes'
    ],
    objetivos: [
      'Desarrollar capacidades de detección',
      'Reconocer señales de alarma',
      'Aplicar técnicas de observación profesional'
    ],
    recursos: [
      'Lista de verificación de indicadores',
      'Casos estudios reales',
      'Herramientas de documentación'
    ]
  },
  {
    id: 'modulo-4',
    titulo: 'Protocolos de Comunicación',
    duracion: '50',
    descripcion: 'Procedimientos de comunicación interna y externa ante situaciones de protección.',
    contenido: [
      'Comunicación con el menor afectado',
      'Información a las familias',
      'Coordinación con el equipo técnico',
      'Comunicación con autoridades competentes',
      'Documentación y registro de comunicaciones',
      'Confidencialidad y protección de datos'
    ],
    objetivos: [
      'Establecer canales de comunicación efectivos',
      'Garantizar la confidencialidad',
      'Coordinar con todas las partes involucradas'
    ],
    recursos: [
      'Protocolos de comunicación estándar',
      'Modelos de documentos',
      'Directorio de contactos institucionales'
    ]
  },
  {
    id: 'modulo-5',
    titulo: 'Protocolo de Emergencia',
    duracion: '90',
    descripcion: 'Actuación inmediata ante situaciones de emergencia y crisis.',
    contenido: [
      'Evaluación rápida de situaciones críticas',
      'Protocolo de actuación inmediata',
      'Contacto con servicios de emergencia',
      'Protección del menor en situación de riesgo',
      'Comunicación de emergencia',
      'Seguimiento post-emergencia'
    ],
    objetivos: [
      'Desarrollar capacidad de respuesta inmediata',
      'Implementar protocolos de emergencia',
      'Coordinar con servicios de emergencia'
    ],
    recursos: [
      'Protocolo de emergencia LOPIVI',
      'Directorio de emergencias',
      'Check-list de actuación inmediata'
    ]
  },
  {
    id: 'modulo-6',
    titulo: 'Formación del Personal',
    duracion: '70',
    descripcion: 'Estrategias para formar y sensibilizar al personal de la entidad.',
    contenido: [
      'Diseño de programas de formación',
      'Sensibilización del equipo técnico',
      'Protocolos internos de la entidad',
      'Evaluación del personal',
      'Actualización continua',
      'Creación de cultura de protección'
    ],
    objetivos: [
      'Desarrollar programas formativos internos',
      'Crear conciencia de protección',
      'Establecer sistemas de evaluación'
    ],
    recursos: [
      'Materiales formativos para personal',
      'Programas de sensibilización',
      'Herramientas de evaluación de competencias'
    ]
  }
]

// Base de datos de preguntas del test (20 preguntas distribuidas entre módulos)
export const PREGUNTAS_TEST: PreguntaTest[] = [
  // Módulo 1: Introducción a la LOPIVI (4 preguntas)
  {
    id: 'p1',
    modulo: 'modulo-1',
    pregunta: '¿Cuál es el objetivo principal de la LOPIVI?',
    opciones: [
      'Establecer un sistema integral de protección de menores',
      'Regular únicamente las actividades deportivas profesionales',
      'Crear nuevas federaciones deportivas'
    ],
    respuestaCorrecta: 0,
    explicacion: 'La LOPIVI tiene como objetivo establecer un sistema integral de protección que garantice los derechos de los menores en todos los ámbitos.'
  },
  {
    id: 'p2',
    modulo: 'modulo-1',
    pregunta: '¿A qué entidades se aplica la LOPIVI?',
    opciones: [
      'Solo a centros educativos públicos',
      'A todas las entidades que trabajen con menores, incluidas deportivas y de ocio',
      'Únicamente a organizaciones benéficas'
    ],
    respuestaCorrecta: 1,
    explicacion: 'La LOPIVI se aplica a todas las entidades, organizaciones y centros que desarrollen actividades dirigidas a menores.'
  },
  {
    id: 'p3',
    modulo: 'modulo-1',
    pregunta: '¿Cuál es un principio fundamental de la LOPIVI?',
    opciones: [
      'La competitividad deportiva por encima de todo',
      'La rentabilidad económica de las actividades',
      'El interés superior del menor'
    ],
    respuestaCorrecta: 2,
    explicacion: 'El interés superior del menor es el principio rector que debe guiar todas las decisiones y actuaciones relacionadas con menores.'
  },
  {
    id: 'p4',
    modulo: 'modulo-1',
    pregunta: '¿Qué responsabilidad tienen las entidades deportivas según la LOPIVI?',
    opciones: [
      'Solo organizar actividades deportivas',
      'Garantizar un entorno seguro y protegido para los menores',
      'Únicamente conseguir resultados deportivos'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Las entidades tienen la responsabilidad de crear y mantener un entorno seguro que proteja la integridad de los menores.'
  },

  // Módulo 2: El Delegado de Protección (4 preguntas)
  {
    id: 'p5',
    modulo: 'modulo-2',
    pregunta: '¿Cuál es la función principal del Delegado de Protección?',
    opciones: [
      'Entrenar a los equipos deportivos',
      'Gestionar las finanzas de la entidad',
      'Velar por el cumplimiento de las medidas de protección'
    ],
    respuestaCorrecta: 2,
    explicacion: 'El Delegado de Protección tiene como función principal velar por el cumplimiento de las medidas de protección y bienestar de los menores.'
  },
  {
    id: 'p6',
    modulo: 'modulo-2',
    pregunta: '¿Qué requisito es fundamental para ser Delegado de Protección?',
    opciones: [
      'Tener formación específica en protección de menores',
      'Ser ex-deportista profesional',
      'Ser propietario de la entidad'
    ],
    respuestaCorrecta: 0,
    explicacion: 'Es fundamental tener formación específica en protección de menores para poder ejercer adecuadamente las funciones de delegado.'
  },
  {
    id: 'p7',
    modulo: 'modulo-2',
    pregunta: '¿Con qué frecuencia debe revisar el delegado los protocolos de protección?',
    opciones: [
      'Una vez al año',
      'Trimestralmente y cuando sea necesario',
      'Solo cuando ocurre un incidente'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Los protocolos deben revisarse trimestralmente de forma regular y siempre que sea necesario para mantener su efectividad.'
  },
  {
    id: 'p8',
    modulo: 'modulo-2',
    pregunta: '¿Qué herramienta es esencial para el trabajo del delegado?',
    opciones: [
      'Cronómetro deportivo',
      'Equipo de grabación de entrenamientos',
      'Sistema de documentación y registro de incidentes'
    ],
    respuestaCorrecta: 2,
    explicacion: 'Un sistema adecuado de documentación y registro es esencial para el trabajo del delegado de protección.'
  },

  // Módulo 3: Detección de Situaciones de Riesgo (4 preguntas)
  {
    id: 'p9',
    modulo: 'modulo-3',
    pregunta: '¿Cuál es un indicador físico de posible maltrato?',
    opciones: [
      'Lesiones inexplicables o frecuentes',
      'Cansancio después del entrenamiento',
      'Sudoración durante el ejercicio'
    ],
    respuestaCorrecta: 0,
    explicacion: 'Las lesiones inexplicables, frecuentes o que no concuerdan con la explicación dada pueden ser indicadores de maltrato.'
  },
  {
    id: 'p10',
    modulo: 'modulo-3',
    pregunta: '¿Qué cambio comportamental puede indicar una situación de riesgo?',
    opciones: [
      'Mejorar en el rendimiento deportivo',
      'Retraimiento social y cambios extremos de humor',
      'Hacer nuevos amigos en el equipo'
    ],
    respuestaCorrecta: 1,
    explicacion: 'El retraimiento social y los cambios extremos de humor pueden ser indicadores de que el menor está experimentando una situación problemática.'
  },
  {
    id: 'p11',
    modulo: 'modulo-3',
    pregunta: '¿Cuándo debe un entrenador comunicar una sospecha al delegado?',
    opciones: [
      'Solo cuando esté completamente seguro',
      'Al final de la temporada deportiva',
      'Inmediatamente al tener cualquier sospecha'
    ],
    respuestaCorrecta: 2,
    explicacion: 'Cualquier sospecha debe ser comunicada inmediatamente al delegado, quien evaluará la situación y tomará las medidas apropiadas.'
  },
  {
    id: 'p12',
    modulo: 'modulo-3',
    pregunta: '¿Cuál es el primer paso ante la detección de una situación de riesgo grave?',
    opciones: [
      'Garantizar la seguridad inmediata del menor',
      'Llamar a los padres',
      'Hacer fotos como evidencia'
    ],
    respuestaCorrecta: 0,
    explicacion: 'Lo primero es siempre garantizar la seguridad inmediata del menor, alejándolo del peligro y proporcionando un entorno seguro.'
  },

  // Módulo 4: Protocolos de Actuación (4 preguntas)
  {
    id: 'p13',
    modulo: 'modulo-4',
    pregunta: '¿Cuál es el tiempo máximo para comunicar una situación de riesgo a las autoridades?',
    opciones: [
      '72 horas',
      '24 horas',
      '1 semana'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Las situaciones de riesgo deben comunicarse a las autoridades competentes en un plazo máximo de 24 horas.'
  },
  {
    id: 'p14',
    modulo: 'modulo-4',
    pregunta: '¿Qué autoridad debe ser contactada en casos de sospecha de maltrato?',
    opciones: [
      'Solo la policía local',
      'Solo los padres del menor',
      'Servicios Sociales y/o Fiscalía de Menores según el caso'
    ],
    respuestaCorrecta: 2,
    explicacion: 'Dependiendo de la gravedad, debe contactarse con Servicios Sociales, Fiscalía de Menores o ambos según los protocolos establecidos.'
  },
  {
    id: 'p15',
    modulo: 'modulo-4',
    pregunta: '¿Cómo debe documentarse un incidente?',
    opciones: [
      'Solo verbalmente',
      'Por escrito, de forma detallada y objetiva, incluyendo fecha, hora y testimonios',
      'Con fotografías únicamente'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Toda documentación debe ser escrita, detallada, objetiva e incluir todos los datos relevantes: fecha, hora, personas implicadas y testimonios.'
  },
  {
    id: 'p16',
    modulo: 'modulo-4',
    pregunta: '¿Quién puede acceder a la información sobre casos de protección?',
    opciones: [
      'Todo el personal de la entidad',
      'Solo las personas autorizadas y con necesidad de conocer la información',
      'Cualquier padre de la entidad'
    ],
    respuestaCorrecta: 1,
    explicacion: 'El acceso a la información está restringido a las personas autorizadas y que tengan una necesidad legítima de conocer la información para proteger al menor.'
  },

  // Módulo 5: Plan de Protección (2 preguntas)
  {
    id: 'p17',
    modulo: 'modulo-5',
    pregunta: '¿Qué debe incluir un Plan de Protección?',
    opciones: [
      'Solo las normas deportivas',
      'Únicamente los datos de contacto',
      'Análisis de riesgos, protocolos, formación y seguimiento'
    ],
    respuestaCorrecta: 2,
    explicacion: 'Un Plan de Protección debe ser integral e incluir análisis de riesgos, protocolos de actuación, programas de formación y sistemas de seguimiento.'
  },
  {
    id: 'p18',
    modulo: 'modulo-5',
    pregunta: '¿Con qué frecuencia debe revisarse el Plan de Protección?',
    opciones: [
      'Anualmente y cuando sea necesario',
      'Solo cuando ocurre un problema',
      'Cada cinco años'
    ],
    respuestaCorrecta: 0,
    explicacion: 'El Plan debe revisarse al menos anualmente y siempre que sea necesario para mantener su efectividad y adaptarlo a nuevas circunstancias.'
  },

  // Módulo 6: Formación y Cultura de Protección (2 preguntas)
  {
    id: 'p19',
    modulo: 'modulo-6',
    pregunta: '¿Con qué frecuencia debe formarse al personal en protección de menores?',
    opciones: [
      'Solo al inicio del trabajo',
      'Anualmente y cuando se incorpore personal nuevo',
      'Cada cinco años'
    ],
    respuestaCorrecta: 1,
    explicacion: 'La formación debe ser anual para todo el personal y obligatoria para cualquier persona que se incorpore a trabajar con menores.'
  },
  {
    id: 'p20',
    modulo: 'modulo-6',
    pregunta: '¿Qué característica debe tener una cultura de protección en la entidad?',
    opciones: [
      'Ser solo responsabilidad del delegado',
      'Centrarse únicamente en aspectos legales',
      'Involucrar a todo el personal y estar integrada en todas las actividades'
    ],
    respuestaCorrecta: 2,
    explicacion: 'Una cultura de protección debe involucrar a todo el personal y estar integrada transversalmente en todas las actividades de la entidad.'
  }
]

// Funciones utilitarias
export function obtenerModuloPorId(id: string): ModuloFormacion | undefined {
  return MODULOS_LOPIVI.find(modulo => modulo.id === id)
}

export function obtenerPreguntasPorModulo(moduloId: string): PreguntaTest[] {
  return PREGUNTAS_TEST.filter(pregunta => pregunta.modulo === moduloId)
}

export function calcularPuntuacion(respuestas: number[], preguntas: PreguntaTest[]): number {
  const respuestasCorrectas = respuestas.filter((respuesta, index) =>
    respuesta === preguntas[index]?.respuestaCorrecta
  ).length

  return Math.round((respuestasCorrectas / preguntas.length) * 100)
}

export function esAprobado(puntuacion: number): boolean {
  return puntuacion >= PUNTUACION_MINIMA
}

export function calcularTiempoTotalModulos(): number {
  return MODULOS_LOPIVI.reduce((total, modulo) => total + parseInt(modulo.duracion), 0)
}

export function obtenerEstadisticasProgreso(progreso: ProgresoUsuario): {
  porcentajeModulos: number
  porcentajeTests: number
  tiempoRestante: number
  completado: boolean
} {
  const totalModulos = MODULOS_LOPIVI.length
  const totalTests = MODULOS_LOPIVI.length // Un test por módulo

  const porcentajeModulos = Math.round((progreso.modulosCompletados.length / totalModulos) * 100)
  const porcentajeTests = Math.round((progreso.testsAprobados.length / totalTests) * 100)
  const tiempoRestante = DURACION_TOTAL_CURSO - progreso.tiempoTotal
  const completado = progreso.testsAprobados.length === totalTests

  return {
    porcentajeModulos,
    porcentajeTests,
    tiempoRestante: Math.max(0, tiempoRestante),
    completado
  }
}
