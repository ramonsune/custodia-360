// Banco de preguntas para el test 10Q
// 5 generales LOPIVI + 5 específicas del sector

export interface QuizQuestion {
  id: string
  category: 'general' | string // 'general' o código sector
  text: string
  options: string[]
  correctIndex: number
}

// Preguntas generales LOPIVI (pool de 20, se seleccionan 5 aleatorias)
export const generalQuestions: QuizQuestion[] = [
  {
    id: 'gen001',
    category: 'general',
    text: '¿Qué significa LOPIVI?',
    options: [
      'Ley Orgánica de Protección Integral de la Infancia y Violencia Infantil',
      'Ley Orgánica de Protección Integral de la Infancia y la Adolescencia frente a la Violencia',
      'Ley de Prevención de la Infancia ante Violencias Intrafamiliares',
      'Ley Orgánica de Protección de Menores contra la Violencia'
    ],
    correctIndex: 1
  },
  {
    id: 'gen002',
    category: 'general',
    text: '¿Cuál es el objetivo principal de la LOPIVI?',
    options: [
      'Regular el sistema educativo español',
      'Garantizar los derechos fundamentales de niños, niñas y adolescentes y su protección contra cualquier forma de violencia',
      'Establecer sanciones a menores infractores',
      'Organizar los servicios sociales municipales'
    ],
    correctIndex: 1
  },
  {
    id: 'gen003',
    category: 'general',
    text: 'Según la LOPIVI, ¿qué se considera violencia?',
    options: [
      'Solo la agresión física',
      'Solo el maltrato emocional',
      'Cualquier acción, omisión o trato negligente que prive a niños, niñas o adolescentes de sus derechos y bienestar',
      'Únicamente el acoso escolar'
    ],
    correctIndex: 2
  },
  {
    id: 'gen004',
    category: 'general',
    text: '¿Qué figura crea la LOPIVI como obligatoria en entidades que trabajan con menores?',
    options: [
      'El tutor de menores',
      'El delegado o delegada de protección',
      'El inspector de infancia',
      'El coordinador de bienestar'
    ],
    correctIndex: 1
  },
  {
    id: 'gen005',
    category: 'general',
    text: 'Ante la sospecha de un caso de violencia hacia un menor, ¿qué debe hacer el personal?',
    options: [
      'Investigar por su cuenta antes de informar',
      'Comunicarlo de inmediato al delegado/a de protección o autoridades competentes',
      'Esperar a tener pruebas concluyentes',
      'Consultar primero con la familia del menor'
    ],
    correctIndex: 1
  },
  {
    id: 'gen006',
    category: 'general',
    text: '¿Es obligatorio que el personal que trabaja con menores tenga certificado negativo de delitos sexuales?',
    options: [
      'No, es opcional',
      'Solo para directivos',
      'Sí, para todo el personal con contacto habitual con menores',
      'Solo si la entidad lo considera necesario'
    ],
    correctIndex: 2
  },
  {
    id: 'gen007',
    category: 'general',
    text: '¿Qué es el "interés superior del menor"?',
    options: [
      'El deseo expresado por el menor',
      'La opinión de los padres o tutores',
      'El principio que obliga a anteponer el bienestar del menor en todas las decisiones que le afecten',
      'Las normas de la entidad'
    ],
    correctIndex: 2
  },
  {
    id: 'gen008',
    category: 'general',
    text: '¿Qué debe incluir un Plan de Protección según la LOPIVI?',
    options: [
      'Solo medidas de seguridad física',
      'Protocolos de prevención, detección, actuación y comunicación de situaciones de violencia',
      'Únicamente un canal de denuncia',
      'Lista de contactos de emergencia'
    ],
    correctIndex: 1
  },
  {
    id: 'gen009',
    category: 'general',
    text: 'Si un menor te comunica que está siendo víctima de violencia, ¿cuál es la primera acción correcta?',
    options: [
      'Confrontar al presunto agresor',
      'Escuchar activamente, creer al menor y comunicarlo al delegado/a de protección',
      'Pedir detalles exhaustivos al menor',
      'Avisar primero a los padres'
    ],
    correctIndex: 1
  },
  {
    id: 'gen010',
    category: 'general',
    text: '¿Qué tipo de formación exige la LOPIVI al personal que trabaja con menores?',
    options: [
      'No exige ninguna formación específica',
      'Solo para el delegado/a de protección',
      'Formación continua en prevención, detección precoz y protección de la infancia y adolescencia',
      'Únicamente primeros auxilios'
    ],
    correctIndex: 2
  },
  {
    id: 'gen011',
    category: 'general',
    text: '¿Puede un menor denunciar directamente situaciones de violencia?',
    options: [
      'No, debe hacerlo a través de sus padres',
      'Sí, la LOPIVI garantiza el derecho del menor a ser escuchado y a denunciar',
      'Solo si es mayor de 16 años',
      'Solo con autorización de su tutor legal'
    ],
    correctIndex: 1
  },
  {
    id: 'gen012',
    category: 'general',
    text: '¿Qué es el canal de comunicación que exige la LOPIVI?',
    options: [
      'Un grupo de WhatsApp',
      'Un medio seguro y confidencial para que cualquier persona pueda comunicar situaciones de riesgo o violencia',
      'Una línea telefónica solo para emergencias',
      'Un email general de la entidad'
    ],
    correctIndex: 1
  },
  {
    id: 'gen013',
    category: 'general',
    text: '¿Quién puede acceder al contenido de las comunicaciones realizadas a través del canal de protección?',
    options: [
      'Cualquier miembro del equipo',
      'Solo el delegado/a de protección y autoridades competentes',
      'Toda la junta directiva',
      'Los padres del menor afectado'
    ],
    correctIndex: 1
  },
  {
    id: 'gen014',
    category: 'general',
    text: 'La LOPIVI obliga a las entidades a revisar su Plan de Protección:',
    options: [
      'Cada 5 años',
      'Solo cuando haya un incidente',
      'Periódicamente y siempre que se produzcan cambios relevantes',
      'Una sola vez al crearlo'
    ],
    correctIndex: 2
  },
  {
    id: 'gen015',
    category: 'general',
    text: '¿Qué se considera "buen trato" hacia los menores?',
    options: [
      'No pegarles',
      'Respetar sus derechos, escucharles, protegerles y promover su desarrollo integral',
      'Darles lo que piden',
      'Evitar cualquier tipo de disciplina'
    ],
    correctIndex: 1
  },
  {
    id: 'gen016',
    category: 'general',
    text: 'Ante una situación de urgencia que ponga en riesgo inminente a un menor:',
    options: [
      'Esperar al delegado/a de protección',
      'Actuar de inmediato para proteger al menor y avisar a las autoridades',
      'Consultar con la dirección de la entidad',
      'Esperar al final de la jornada'
    ],
    correctIndex: 1
  },
  {
    id: 'gen017',
    category: 'general',
    text: '¿Qué es el "grooming"?',
    options: [
      'Una técnica educativa',
      'El acoso sexual a menores a través de medios digitales',
      'Un juego online',
      'Una actividad deportiva'
    ],
    correctIndex: 1
  },
  {
    id: 'gen018',
    category: 'general',
    text: '¿Es la LOPIVI aplicable solo a centros educativos?',
    options: [
      'Sí, solo a colegios e institutos',
      'No, a todas las entidades y personas que trabajen con menores',
      'Solo a entidades públicas',
      'Solo a actividades de ocio'
    ],
    correctIndex: 1
  },
  {
    id: 'gen019',
    category: 'general',
    text: '¿Qué responsabilidad tiene el personal que detecte signos de violencia y no lo comunique?',
    options: [
      'Ninguna',
      'Responsabilidad ética y legal, pudiendo incurrir en delito por omisión',
      'Solo una amonestación interna',
      'Responsabilidad solo si hay denuncia'
    ],
    correctIndex: 1
  },
  {
    id: 'gen020',
    category: 'general',
    text: '¿Qué debe hacerse con la información de un caso comunicado?',
    options: [
      'Compartirla con todos los compañeros',
      'Tratarla con confidencialidad absoluta y seguir el protocolo establecido',
      'Publicarla en redes internas',
      'Archivarla sin más'
    ],
    correctIndex: 1
  }
]

// Preguntas específicas por sector
export const sectorQuestions: Record<string, QuizQuestion[]> = {
  // Ocio educativo (9329)
  '9329': [
    {
      id: 'ocio001',
      category: '9329',
      text: 'En un campamento, ¿cómo deben organizarse los espacios de descanso?',
      options: [
        'Permitiendo que duerman donde prefieran',
        'Separados por edades y sexo, con supervisión adecuada',
        'Solo por edades',
        'En un solo espacio grande'
      ],
      correctIndex: 1
    },
    {
      id: 'ocio002',
      category: '9329',
      text: 'Si un menor en campamento se niega a participar en una actividad sin motivo aparente:',
      options: [
        'Obligarle a participar',
        'Castigarle por no colaborar',
        'Respetar su decisión, hablar con él en privado y observar si hay algún problema',
        'Ignorar la situación'
      ],
      correctIndex: 2
    },
    {
      id: 'ocio003',
      category: '9329',
      text: '¿Está permitido que un monitor se quede a solas con un menor en una habitación cerrada?',
      options: [
        'Sí, si es para hablar en privado',
        'No, salvo situación de emergencia y siempre visible',
        'Sí, si hay confianza',
        'Solo si los padres lo autorizan'
      ],
      correctIndex: 1
    },
    {
      id: 'ocio004',
      category: '9329',
      text: 'Antes de fotografiar o grabar a menores en actividades de ocio:',
      options: [
        'No hace falta permiso',
        'Es necesario consentimiento expreso de padres/tutores y del menor si tiene edad para ello',
        'Solo si se va a publicar en redes',
        'Con avisar verbalmente es suficiente'
      ],
      correctIndex: 1
    },
    {
      id: 'ocio005',
      category: '9329',
      text: 'En actividades de ocio, ¿qué ratio monitor/menores se recomienda?',
      options: [
        'No hay ratio obligatorio',
        'Un monitor por cada 8-10 menores, variando según edad',
        'Un monitor por cada 20 menores',
        'Solo uno para todo el grupo'
      ],
      correctIndex: 1
    },
    {
      id: 'ocio006',
      category: '9329',
      text: 'Si un menor presenta cambios de comportamiento repentinos durante el campamento:',
      options: [
        'Esperar a que se le pase',
        'Observar, documentar y comunicarlo al delegado/a de protección',
        'Llamar directamente a los padres',
        'Aplicar medidas disciplinarias'
      ],
      correctIndex: 1
    },
    {
      id: 'ocio007',
      category: '9329',
      text: '¿Puede un monitor intercambiar datos personales (teléfono, redes sociales) con menores?',
      options: [
        'Sí, para mantener el contacto',
        'No, está prohibido salvo canales oficiales de la entidad',
        'Solo con mayores de 14 años',
        'Solo si los padres lo autorizan'
      ],
      correctIndex: 1
    },
    {
      id: 'ocio008',
      category: '9329',
      text: 'En caso de accidente de un menor durante una actividad:',
      options: [
        'Avisar a los padres y esperar',
        'Actuar según protocolo de primeros auxilios, comunicar inmediatamente y documentar',
        'Solo documentar si es grave',
        'Esperar al final de la actividad'
      ],
      correctIndex: 1
    },
    {
      id: 'ocio009',
      category: '9329',
      text: '¿Es adecuado utilizar castigos físicos o humillantes en actividades de ocio?',
      options: [
        'Sí, si es leve',
        'Nunca, está prohibido y es una forma de violencia',
        'Solo si los padres lo autorizan',
        'Depende de la gravedad del comportamiento'
      ],
      correctIndex: 1
    },
    {
      id: 'ocio010',
      category: '9329',
      text: 'Al finalizar una actividad de ocio, los monitores deben:',
      options: [
        'Irse inmediatamente',
        'Asegurarse de que cada menor es recogido por persona autorizada',
        'Dejar a los menores en la puerta',
        'Solo supervisar a los más pequeños'
      ],
      correctIndex: 1
    }
  ],

  // Deportes (9311)
  '9311': [
    {
      id: 'dep001',
      category: '9311',
      text: 'En entrenamientos deportivos, ¿es adecuado el contacto físico con menores?',
      options: [
        'Sí, siempre que sea necesario',
        'Solo si es estrictamente necesario para la técnica, explicándolo previamente',
        'Está prohibido en cualquier caso',
        'Solo con mayores de 12 años'
      ],
      correctIndex: 1
    },
    {
      id: 'dep002',
      category: '9311',
      text: 'Si un entrenador observa lesiones sospechosas en un menor deportista:',
      options: [
        'Preguntar directamente qué pasó',
        'Documentar y comunicar al delegado/a de protección',
        'Ignorar si el menor dice que no es nada',
        'Avisar solo a los padres'
      ],
      correctIndex: 1
    },
    {
      id: 'dep003',
      category: '9311',
      text: '¿Pueden los vestuarios ser utilizados simultáneamente por adultos y menores?',
      options: [
        'Sí, si hay prisa',
        'No, deben estar separados y con supervisión adecuada',
        'Solo en competiciones',
        'Si los padres lo autorizan'
      ],
      correctIndex: 1
    },
    {
      id: 'dep004',
      category: '9311',
      text: 'Ante un bajo rendimiento deportivo de un menor:',
      options: [
        'Presionar para que mejore',
        'Gritar o ridiculizar',
        'Hablar con respeto, escuchar y adaptar el entrenamiento a sus necesidades',
        'Excluirlo del equipo'
      ],
      correctIndex: 2
    },
    {
      id: 'dep005',
      category: '9311',
      text: '¿Es adecuado que un entrenador viaje solo con un menor a competiciones?',
      options: [
        'Sí, si hay confianza',
        'No, deben ir acompañados por otro adulto o varios menores',
        'Solo si los padres lo autorizan',
        'Depende de la distancia'
      ],
      correctIndex: 1
    },
    {
      id: 'dep006',
      category: '9311',
      text: 'Si un padre/madre presiona excesivamente a su hijo/a en el deporte:',
      options: [
        'No es asunto del entrenador',
        'Hablar con la familia y, si persiste, comunicarlo al delegado/a de protección',
        'Expulsar al menor del equipo',
        'Ignorarlo'
      ],
      correctIndex: 1
    },
    {
      id: 'dep007',
      category: '9311',
      text: '¿Pueden utilizarse métodos de entrenamiento que causen dolor físico o emocional?',
      options: [
        'Sí, si es para mejorar el rendimiento',
        'Nunca, se considera maltrato',
        'Solo en deportes de contacto',
        'Si el deportista lo acepta'
      ],
      correctIndex: 1
    },
    {
      id: 'dep008',
      category: '9311',
      text: 'Ante una lesión de un menor durante el entrenamiento:',
      options: [
        'Que descanse un poco y continúe',
        'Aplicar primeros auxilios, avisar a padres y documentar',
        'Solo avisar si es muy grave',
        'Esperar al final del entrenamiento'
      ],
      correctIndex: 1
    },
    {
      id: 'dep009',
      category: '9311',
      text: '¿Es apropiado hacer comentarios sobre el físico de los menores deportistas?',
      options: [
        'Sí, si es constructivo',
        'No, puede ser humillante y afectar su autoestima',
        'Solo si es para mejorar',
        'Solo en privado'
      ],
      correctIndex: 1
    },
    {
      id: 'dep010',
      category: '9311',
      text: 'La hidratación y descanso de los menores en deporte:',
      options: [
        'Es responsabilidad de cada deportista',
        'Debe ser supervisada y garantizada por el entrenador',
        'Solo es importante en verano',
        'No es relevante'
      ],
      correctIndex: 1
    }
  ],

  // Educación infantil y primaria (8510, 8520)
  '8510': [
    {
      id: 'edu001',
      category: '8510',
      text: 'Si un menor de infantil presenta cambios de comportamiento repentinos:',
      options: [
        'Es normal a esa edad',
        'Observar, documentar y comunicarlo al equipo de orientación y delegado/a',
        'Ignorarlo si no interfiere con la clase',
        'Solo avisar a los padres'
      ],
      correctIndex: 1
    },
    {
      id: 'edu002',
      category: '8510',
      text: '¿Puede un docente quedarse a solas con un menor en el aula con la puerta cerrada?',
      options: [
        'Sí, si es necesario',
        'No, salvo emergencia y siempre visible desde el exterior',
        'Solo si los padres lo autorizan',
        'Sí, si hay confianza'
      ],
      correctIndex: 1
    },
    {
      id: 'edu003',
      category: '8510',
      text: 'Ante la sospecha de negligencia familiar (falta de higiene, hambre, absentismo):',
      options: [
        'Hablar solo con la familia',
        'Documentar y comunicar al delegado/a de protección',
        'Esperar a tener más evidencias',
        'No es competencia del centro'
      ],
      correctIndex: 1
    },
    {
      id: 'edu004',
      category: '8510',
      text: '¿Es adecuado utilizar castigos que humillen al menor ante sus compañeros?',
      options: [
        'Sí, si es leve',
        'Nunca, es una forma de violencia',
        'Solo si reincide',
        'Depende de la gravedad'
      ],
      correctIndex: 1
    },
    {
      id: 'edu005',
      category: '8510',
      text: 'Si un menor te dice "no se lo cuentes a nadie" antes de revelar algo importante:',
      options: [
        'Prometer no contarlo',
        'Explicar que si está en peligro, debes comunicarlo para protegerle',
        'Ignorar lo que diga',
        'Contarlo solo a los padres'
      ],
      correctIndex: 1
    },
    {
      id: 'edu006',
      category: '8510',
      text: 'Las salidas y excursiones escolares requieren:',
      options: [
        'Solo avisar el día antes',
        'Autorización escrita de padres/tutores y ratios adecuadas de supervisión',
        'No hace falta permiso',
        'Solo para las que impliquen gasto'
      ],
      correctIndex: 1
    },
    {
      id: 'edu007',
      category: '8510',
      text: '¿Puede un docente intercambiar redes sociales personales con alumnos?',
      options: [
        'Sí, para mejorar la comunicación',
        'No, está prohibido. Solo canales oficiales del centro',
        'Solo con mayores de 12 años',
        'Si los padres lo autorizan'
      ],
      correctIndex: 1
    },
    {
      id: 'edu008',
      category: '8510',
      text: 'Si detectas acoso escolar entre alumnos:',
      options: [
        'Decirles que lo resuelvan entre ellos',
        'Intervenir de inmediato, proteger a la víctima y activar protocolo',
        'Esperar a ver si se soluciona solo',
        'Solo intervenir si hay agresión física'
      ],
      correctIndex: 1
    },
    {
      id: 'edu009',
      category: '8510',
      text: 'La información sobre situaciones familiares delicadas de un alumno:',
      options: [
        'Puede comentarse en sala de profesores',
        'Debe tratarse con absoluta confidencialidad y solo compartirse con quienes deban saberlo',
        'Puede compartirse con otros padres',
        'No es relevante'
      ],
      correctIndex: 1
    },
    {
      id: 'edu010',
      category: '8510',
      text: 'Ante un menor que verbaliza ideas de autolesión:',
      options: [
        'Es solo para llamar la atención',
        'Tomar en serio siempre, no dejar solo y comunicar urgentemente',
        'Esperar a ver si lo repite',
        'Solo avisar a los padres'
      ],
      correctIndex: 1
    }
  ],

  // Las preguntas de 8520 (primaria) son iguales que 8510
  '8520': [
    // Reutilizar las de 8510 cambiando IDs
    ...(() => {
      const primaryQuestions = JSON.parse(JSON.stringify(sectorQuestions['8510'] || []))
      return primaryQuestions.map((q: QuizQuestion, i: number) => ({
        ...q,
        id: `prim${String(i + 1).padStart(3, '0')}`,
        category: '8520'
      }))
    })()
  ],

  // Default para sectores no especificados
  'default': [
    {
      id: 'def001',
      category: 'default',
      text: '¿Cuál es tu responsabilidad principal respecto a la protección de menores?',
      options: [
        'Solo intervenir si me lo piden',
        'Prevenir, detectar y comunicar cualquier situación de riesgo o violencia',
        'Únicamente obedecer órdenes',
        'No es mi responsabilidad'
      ],
      correctIndex: 1
    },
    {
      id: 'def002',
      category: 'default',
      text: 'Ante un conflicto entre menores en tu entidad:',
      options: [
        'Dejar que lo resuelvan ellos',
        'Intervenir, mediar y si hay signos de violencia, comunicarlo',
        'Castigar a ambos por igual',
        'Ignorar si no es grave'
      ],
      correctIndex: 1
    },
    {
      id: 'def003',
      category: 'default',
      text: '¿Es apropiado hacer regalos personales a un menor específico?',
      options: [
        'Sí, si es para motivarle',
        'No, puede generar favoritismos y situaciones inadecuadas',
        'Solo en su cumpleaños',
        'Si los padres lo autorizan'
      ],
      correctIndex: 1
    },
    {
      id: 'def004',
      category: 'default',
      text: 'Si un menor te pide ayuda pero te dice que no se lo cuentes a nadie:',
      options: [
        'Prometer confidencialidad absoluta',
        'Explicar que si está en peligro, debes comunicarlo',
        'No hacer caso',
        'Contárselo solo a sus padres'
      ],
      correctIndex: 1
    },
    {
      id: 'def005',
      category: 'default',
      text: '¿Puede un adulto quedarse a solas con un menor en un espacio cerrado?',
      options: [
        'Sí, si hay confianza',
        'No, salvo emergencia y siempre visible',
        'Solo con autorización de los padres',
        'Sí, si es breve'
      ],
      correctIndex: 1
    },
    {
      id: 'def006',
      category: 'default',
      text: 'La información personal de los menores debe:',
      options: [
        'Compartirse libremente en la entidad',
        'Tratarse con confidencialidad absoluta',
        'Publicarse para transparencia',
        'Solo protegerse si es sensible'
      ],
      correctIndex: 1
    },
    {
      id: 'def007',
      category: 'default',
      text: 'Ante la sospecha de maltrato familiar:',
      options: [
        'No intervenir en asuntos familiares',
        'Comunicarlo inmediatamente al delegado/a de protección',
        'Hablar primero con la familia',
        'Esperar a tener pruebas'
      ],
      correctIndex: 1
    },
    {
      id: 'def008',
      category: 'default',
      text: '¿Es adecuado fotografiar a menores sin consentimiento?',
      options: [
        'Sí, si es para uso interno',
        'No, se requiere autorización expresa',
        'Solo si no se publica',
        'Sí, en actividades grupales'
      ],
      correctIndex: 1
    },
    {
      id: 'def009',
      category: 'default',
      text: 'El trato hacia los menores debe ser:',
      options: [
        'Estricto y distante',
        'Respetuoso, cercano pero profesional',
        'Como si fueran adultos',
        'Permisivo en todo'
      ],
      correctIndex: 1
    },
    {
      id: 'def010',
      category: 'default',
      text: 'Si observas a un compañero actuando de forma inapropiada con un menor:',
      options: [
        'No es asunto tuyo',
        'Intervenir si es posible y comunicarlo inmediatamente',
        'Hablar solo con el compañero',
        'Esperar a ver si se repite'
      ],
      correctIndex: 1
    }
  ]
}

// Función para obtener preguntas del sector
export function getSectorQuestions(sectorCode: string | null): QuizQuestion[] {
  return sectorQuestions[sectorCode || 'default'] || sectorQuestions['default']
}

// Función de generación de números aleatorios con semilla
function seededRandom(s: number): number {
  const value = Math.sin(s + 1) * 10000
  return value - Math.floor(value)
}

// Función para seleccionar preguntas aleatorias
export function selectRandomQuestions(
  pool: QuizQuestion[],
  count: number,
  seed: number
): QuizQuestion[] {
  // Algoritmo de Fisher-Yates con semilla para aleatorización reproducible
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
}

// Función para mezclar opciones de una pregunta
export function shuffleOptions(question: QuizQuestion, seed: number): {
  options: string[]
  correctIndex: number
} {
  const indices = question.options.map((_, i) => i)

  // Fisher-Yates shuffle con semilla
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }

  const shuffledOptions = indices.map(i => question.options[i])
  const newCorrectIndex = indices.indexOf(question.correctIndex)

  return {
    options: shuffledOptions,
    correctIndex: newCorrectIndex
  }
}

// Función para generar un test completo
export function generateQuiz(sectorCode: string | null, seed: number) {
  const generalPool = generalQuestions
  const sectorPool = getSectorQuestions(sectorCode)

  const selectedGeneral = selectRandomQuestions(generalPool, 5, seed)
  const selectedSector = selectRandomQuestions(sectorPool, 5, seed + 1000)

  const allQuestions = [...selectedGeneral, ...selectedSector]

  // Mezclar todas las preguntas
  const shuffledQuestions = selectRandomQuestions(allQuestions, 10, seed + 2000)

  // Mezclar opciones de cada pregunta
  return shuffledQuestions.map((q, index) => {
    const { options, correctIndex } = shuffleOptions(q, seed + 3000 + index)
    return {
      ...q,
      options,
      correctIndex
    }
  })
}
