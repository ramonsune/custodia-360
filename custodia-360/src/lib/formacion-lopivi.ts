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
export const PUNTUACION_MINIMA = 80 // 80% mínimo para aprobar
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

// Base de datos de preguntas del test (30 preguntas distribuidas entre módulos)
export const PREGUNTAS_TEST: PreguntaTest[] = [
  // Módulo 1: Introducción a la LOPIVI (5 preguntas)
  {
    id: 'p1',
    modulo: 'modulo-1',
    pregunta: '¿Cuál es el objetivo principal de la LOPIVI?',
    opciones: [
      'Regular únicamente las actividades deportivas profesionales',
      'Establecer un sistema integral de protección de menores',
      'Crear nuevas federaciones deportivas'
    ],
    respuestaCorrecta: 1,
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
      'El interés superior del menor',
      'La rentabilidad económica de las actividades'
    ],
    respuestaCorrecta: 1,
    explicacion: 'El interés superior del menor es el principio rector que debe guiar todas las decisiones y actuaciones relacionadas con menores.'
  },
  {
    id: 'p4',
    modulo: 'modulo-1',
    pregunta: '¿Qué derecho fundamental protege especialmente la LOPIVI en el ámbito deportivo?',
    opciones: [
      'El derecho a ganar competiciones',
      'El derecho a la integridad física y moral',
      'El derecho a entrenar todos los días'
    ],
    respuestaCorrecta: 1,
    explicacion: 'La LOPIVI protege especialmente el derecho de los menores a la integridad física y moral, libre de cualquier forma de violencia.'
  },
  {
    id: 'p5',
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

  // Módulo 2: El Delegado de Protección (5 preguntas)
  {
    id: 'p6',
    modulo: 'modulo-2',
    pregunta: '¿Cuál es la función principal del Delegado de Protección?',
    opciones: [
      'Entrenar a los equipos deportivos',
      'Velar por el cumplimiento de las medidas de protección',
      'Gestionar las finanzas de la entidad'
    ],
    respuestaCorrecta: 1,
    explicacion: 'El Delegado de Protección tiene como función principal velar por el cumplimiento de las medidas de protección y bienestar de los menores.'
  },
  {
    id: 'p7',
    modulo: 'modulo-2',
    pregunta: '¿Qué requisito es fundamental para ser Delegado de Protección?',
    opciones: [
      'Ser ex-deportista profesional',
      'Tener formación específica en protección de menores',
      'Ser propietario de la entidad'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Es fundamental tener formación específica en protección de menores para poder ejercer adecuadamente las funciones de delegado.'
  },
  {
    id: 'p8',
    modulo: 'modulo-2',
    pregunta: '¿Cuál es la diferencia principal entre delegado principal y suplente?',
    opciones: [
      'El suplente tiene menos responsabilidades legales',
      'El principal tiene acceso completo, el suplente tiene permisos limitados',
      'No hay diferencias significativas'
    ],
    respuestaCorrecta: 1,
    explicacion: 'El delegado principal tiene acceso completo a todas las funciones, mientras que el suplente tiene permisos más limitados y actúa en ausencia del principal.'
  },
  {
    id: 'p9',
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
    id: 'p10',
    modulo: 'modulo-2',
    pregunta: '¿Qué herramienta es esencial para el trabajo del delegado?',
    opciones: [
      'Cronómetro deportivo',
      'Sistema de documentación y registro de incidentes',
      'Equipo de grabación de entrenamientos'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Un sistema adecuado de documentación y registro es esencial para el trabajo del delegado de protección.'
  },

  // Módulo 3: Detección de Situaciones de Riesgo (5 preguntas)
  {
    id: 'p11',
    modulo: 'modulo-3',
    pregunta: '¿Cuál es un indicador físico de posible maltrato?',
    opciones: [
      'Cansancio después del entrenamiento',
      'Lesiones inexplicables o frecuentes',
      'Sudoración durante el ejercicio'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Las lesiones inexplicables, frecuentes o que no concuerdan con la explicación dada pueden ser indicadores de maltrato.'
  },
  {
    id: 'p12',
    modulo: 'modulo-3',
    pregunta: '¿Qué cambio comportamental puede indicar una situación de riesgo?',
    opciones: [
      'Mejorar en el rendimiento deportivo',
      'Retraimiento social y cambios extremos de humor',
      'Hacer nuevos amigos en el equipo'
    ],
    respuestaCorrecta: 1,
    explicacion: 'El retraimiento social y cambios extremos en el comportamiento pueden indicar que el menor está experimentando una situación de riesgo.'
  },
  {
    id: 'p13',
    modulo: 'modulo-3',
    pregunta: '¿Cómo se diferencia la disciplina deportiva del maltrato?',
    opciones: [
      'La disciplina siempre implica castigo físico',
      'La disciplina es educativa y respeta la dignidad del menor',
      'No hay diferencia entre ambas'
    ],
    respuestaCorrecta: 1,
    explicacion: 'La disciplina deportiva debe ser siempre educativa, proporcional y respetar la dignidad y derechos del menor.'
  },
  {
    id: 'p14',
    modulo: 'modulo-3',
    pregunta: '¿Qué debe hacer el delegado ante una sospecha de maltrato?',
    opciones: [
      'Ignorarlo si no está seguro',
      'Documentar las observaciones y activar el protocolo',
      'Confrontar directamente al posible agresor'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Ante cualquier sospecha debe documentarse la observación y activar inmediatamente el protocolo de protección establecido.'
  },
  {
    id: 'p15',
    modulo: 'modulo-3',
    pregunta: '¿Cuál es un factor de riesgo en el entorno deportivo?',
    opciones: [
      'Entrenamientos en grupo',
      'Relaciones de poder desiguales entre adultos y menores',
      'Competiciones deportivas'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Las relaciones de poder desiguales pueden crear situaciones de vulnerabilidad que requieren vigilancia especial.'
  },

  // Módulo 4: Protocolos de Comunicación (5 preguntas)
  {
    id: 'p16',
    modulo: 'modulo-4',
    pregunta: '¿Cómo debe comunicarse con un menor que reporta una situación de riesgo?',
    opciones: [
      'Con incredulidad y pidiendo pruebas',
      'Con escucha activa, respeto y confidencialidad',
      'Derivándolo inmediatamente a sus padres'
    ],
    respuestaCorrecta: 1,
    explicacion: 'La comunicación debe basarse en la escucha activa, el respeto y la garantía de confidencialidad para crear un ambiente de confianza.'
  },
  {
    id: 'p17',
    modulo: 'modulo-4',
    pregunta: '¿Cuándo debe informarse a las familias sobre una situación detectada?',
    opciones: [
      'Inmediatamente en todos los casos',
      'Siguiendo el protocolo y evaluando si puede poner en riesgo al menor',
      'Nunca, para mantener la confidencialidad'
    ],
    respuestaCorrecta: 1,
    explicacion: 'La información a las familias debe seguir el protocolo establecido, evaluando siempre el interés superior del menor.'
  },
  {
    id: 'p18',
    modulo: 'modulo-4',
    pregunta: '¿Qué información debe documentarse en las comunicaciones?',
    opciones: [
      'Solo los datos personales del menor',
      'Fecha, hora, personas involucradas, hechos objetivos y acciones tomadas',
      'Únicamente las conclusiones finales'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Debe documentarse de forma completa: fecha, hora, personas involucradas, hechos objetivos y todas las acciones tomadas.'
  },
  {
    id: 'p19',
    modulo: 'modulo-4',
    pregunta: '¿Con qué autoridades debe coordinarse el delegado?',
    opciones: [
      'Solo con la policía local',
      'Servicios sociales, fuerzas de seguridad y fiscalía de menores según el caso',
      'Únicamente con los directivos de la entidad'
    ],
    respuestaCorrecta: 1,
    explicacion: 'La coordinación debe establecerse con servicios sociales, fuerzas de seguridad y fiscalía de menores según la naturaleza del caso.'
  },
  {
    id: 'p20',
    modulo: 'modulo-4',
    pregunta: '¿Cómo debe garantizarse la confidencialidad?',
    opciones: [
      'No hablando nunca del tema',
      'Limitando el acceso a la información a personas autorizadas y necesarias',
      'Compartiendo solo con otros padres'
    ],
    respuestaCorrecta: 1,
    explicacion: 'La confidencialidad se garantiza limitando el acceso a la información únicamente a las personas autorizadas y que necesiten conocerla para proteger al menor.'
  },

  // Módulo 5: Protocolo de Emergencia (5 preguntas)
  {
    id: 'p21',
    modulo: 'modulo-5',
    pregunta: '¿Cuál es el primer paso ante una situación de emergencia?',
    opciones: [
      'Llamar a los padres del menor',
      'Evaluar la seguridad inmediata y proteger al menor',
      'Documentar todo lo ocurrido'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Lo prioritario es evaluar la seguridad inmediata y proteger al menor de cualquier peligro adicional.'
  },
  {
    id: 'p22',
    modulo: 'modulo-5',
    pregunta: '¿Cuándo debe contactarse con servicios de emergencia?',
    opciones: [
      'Solo si hay lesiones físicas graves',
      'Ante cualquier situación que ponga en riesgo inmediato la integridad del menor',
      'Únicamente por la noche'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Los servicios de emergencia deben contactarse ante cualquier situación que represente un riesgo inmediato para la integridad del menor.'
  },
  {
    id: 'p23',
    modulo: 'modulo-5',
    pregunta: '¿Qué información debe proporcionarse en una llamada de emergencia?',
    opciones: [
      'Solo el nombre del menor',
      'Ubicación exacta, naturaleza de la emergencia, estado del menor y acciones tomadas',
      'Únicamente la dirección de la entidad'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Debe proporcionarse información completa: ubicación exacta, naturaleza de la emergencia, estado del menor y acciones ya tomadas.'
  },
  {
    id: 'p24',
    modulo: 'modulo-5',
    pregunta: '¿Quién debe realizar el seguimiento post-emergencia?',
    opciones: [
      'Los servicios sociales exclusivamente',
      'El delegado de protección en coordinación con las autoridades competentes',
      'Solo los padres del menor'
    ],
    respuestaCorrecta: 1,
    explicacion: 'El delegado de protección debe realizar el seguimiento en coordinación con las autoridades competentes para garantizar el bienestar del menor.'
  },
  {
    id: 'p25',
    modulo: 'modulo-5',
    pregunta: '¿Qué debe incluir el protocolo de emergencia de la entidad?',
    opciones: [
      'Solo los números de teléfono de emergencia',
      'Procedimientos claros, contactos, responsabilidades y check-list de actuación',
      'Únicamente la dirección del hospital más cercano'
    ],
    respuestaCorrecta: 1,
    explicacion: 'El protocolo debe ser completo: procedimientos claros, contactos actualizados, responsabilidades definidas y check-list de actuación.'
  },

  // Módulo 6: Formación del Personal (5 preguntas)
  {
    id: 'p26',
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
    id: 'p27',
    modulo: 'modulo-6',
    pregunta: '¿Qué debe incluir la formación del personal?',
    opciones: [
      'Solo técnicas deportivas',
      'Detección de situaciones de riesgo, protocolos de actuación y comunicación',
      'Únicamente aspectos legales'
    ],
    respuestaCorrecta: 1,
    explicacion: 'La formación debe ser integral: detección de riesgo, protocolos de actuación, comunicación efectiva y marco legal.'
  },
  {
    id: 'p28',
    modulo: 'modulo-6',
    pregunta: '¿Cómo debe evaluarse la efectividad de la formación?',
    opciones: [
      'No es necesario evaluar',
      'Mediante tests, observación práctica y seguimiento del cumplimiento de protocolos',
      'Solo preguntando si les gustó'
    ],
    respuestaCorrecta: 1,
    explicacion: 'La evaluación debe ser integral: tests de conocimiento, observación práctica y seguimiento del cumplimiento de protocolos.'
  },
  {
    id: 'p29',
    modulo: 'modulo-6',
    pregunta: '¿Qué característica debe tener una cultura de protección en la entidad?',
    opciones: [
      'Ser solo responsabilidad del delegado',
      'Involucrar a todo el personal y estar integrada en todas las actividades',
      'Centrarse únicamente en aspectos legales'
    ],
    respuestaCorrecta: 1,
    explicacion: 'Una cultura de protección debe involucrar a todo el personal y estar integrada transversalmente en todas las actividades de la entidad.'
  },
  {
    id: 'p30',
    modulo: 'modulo-6',
    pregunta: '¿Cuál es un indicador de una formación exitosa del personal?',
    opciones: [
      'Que asistan todas las sesiones',
      'Que el personal detecte y reporte situaciones de riesgo adecuadamente',
      'Que aprueben el test final'
    ],
    respuestaCorrecta: 1,
    explicacion: 'El éxito se mide por la capacidad del personal para detectar y reportar adecuadamente situaciones de riesgo en su trabajo diario.'
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
