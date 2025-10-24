// Mock data para el sistema de test LOPIVI - Demo local
export interface MockQuestion {
  id: string
  text: string
  is_general: boolean
  sector_code: string | null
  active: boolean
  answers: MockAnswer[]
}

export interface MockAnswer {
  id: string
  question_id: string
  text: string
  is_correct: boolean
}

export const MOCK_QUESTIONS: MockQuestion[] = [
  // ===== PREGUNTAS GENERALES (15) =====
  {
    id: 'q1',
    text: '¿Cuál es el objetivo principal de la LOPIVI?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q1a1', question_id: 'q1', text: 'Garantizar la protección integral de niños, niñas y adolescentes frente a la violencia', is_correct: true },
      { id: 'q1a2', question_id: 'q1', text: 'Regular exclusivamente la violencia en centros educativos', is_correct: false },
      { id: 'q1a3', question_id: 'q1', text: 'Establecer sanciones económicas a las entidades', is_correct: false },
      { id: 'q1a4', question_id: 'q1', text: 'Crear un registro de menores en situación de riesgo', is_correct: false }
    ]
  },
  {
    id: 'q2',
    text: '¿Qué es el Delegado/a de Protección según la LOPIVI?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q2a1', question_id: 'q2', text: 'Figura clave que coordina las medidas de protección en la entidad', is_correct: true },
      { id: 'q2a2', question_id: 'q2', text: 'Un puesto voluntario sin responsabilidades legales', is_correct: false },
      { id: 'q2a3', question_id: 'q2', text: 'Solo necesario en centros educativos públicos', is_correct: false },
      { id: 'q2a4', question_id: 'q2', text: 'Un cargo rotativo entre todo el personal', is_correct: false }
    ]
  },
  {
    id: 'q3',
    text: '¿Quién debe tener un certificado negativo del Registro Central de Delincuentes Sexuales?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q3a1', question_id: 'q3', text: 'Todo el personal que tenga contacto habitual con menores', is_correct: true },
      { id: 'q3a2', question_id: 'q3', text: 'Solo el Delegado/a de Protección', is_correct: false },
      { id: 'q3a3', question_id: 'q3', text: 'Solo el personal docente', is_correct: false },
      { id: 'q3a4', question_id: 'q3', text: 'Solo los voluntarios, no el personal contratado', is_correct: false }
    ]
  },
  {
    id: 'q4',
    text: '¿Cuál de estos NO es un tipo de violencia contemplado en la LOPIVI?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q4a1', question_id: 'q4', text: 'Violencia económica entre adultos', is_correct: true },
      { id: 'q4a2', question_id: 'q4', text: 'Violencia física', is_correct: false },
      { id: 'q4a3', question_id: 'q4', text: 'Violencia psicológica', is_correct: false },
      { id: 'q4a4', question_id: 'q4', text: 'Violencia sexual', is_correct: false }
    ]
  },
  {
    id: 'q5',
    text: 'Ante una sospecha fundada de maltrato, ¿qué debe hacer el personal de contacto?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q5a1', question_id: 'q5', text: 'Informar inmediatamente al Delegado/a de Protección', is_correct: true },
      { id: 'q5a2', question_id: 'q5', text: 'Interrogar directamente al menor', is_correct: false },
      { id: 'q5a3', question_id: 'q5', text: 'Llamar a la familia y preguntarles', is_correct: false },
      { id: 'q5a4', question_id: 'q5', text: 'Ignorarlo si no está seguro', is_correct: false }
    ]
  },
  {
    id: 'q6',
    text: '¿Cuál es el porcentaje mínimo de aciertos para aprobar el test LOPIVI?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q6a1', question_id: 'q6', text: '75%', is_correct: true },
      { id: 'q6a2', question_id: 'q6', text: '50%', is_correct: false },
      { id: 'q6a3', question_id: 'q6', text: '60%', is_correct: false },
      { id: 'q6a4', question_id: 'q6', text: '90%', is_correct: false }
    ]
  },
  {
    id: 'q7',
    text: '¿Qué debe incluir obligatoriamente el Plan de Protección?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q7a1', question_id: 'q7', text: 'Protocolos de actuación ante situaciones de riesgo', is_correct: true },
      { id: 'q7a2', question_id: 'q7', text: 'Listado de menores matriculados', is_correct: false },
      { id: 'q7a3', question_id: 'q7', text: 'Presupuesto anual de la entidad', is_correct: false },
      { id: 'q7a4', question_id: 'q7', text: 'Horarios de actividades', is_correct: false }
    ]
  },
  {
    id: 'q8',
    text: '¿A quién se debe comunicar una situación de peligro inmediato para un menor?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q8a1', question_id: 'q8', text: 'Servicios de emergencia (112) y Delegado/a de Protección', is_correct: true },
      { id: 'q8a2', question_id: 'q8', text: 'Solo a los padres', is_correct: false },
      { id: 'q8a3', question_id: 'q8', text: 'Esperar a la siguiente reunión de equipo', is_correct: false },
      { id: 'q8a4', question_id: 'q8', text: 'Directamente al director de la entidad', is_correct: false }
    ]
  },
  {
    id: 'q9',
    text: '¿Cuál es un indicador emocional de posible maltrato?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q9a1', question_id: 'q9', text: 'Miedo extremo o ansiedad persistente', is_correct: true },
      { id: 'q9a2', question_id: 'q9', text: 'Alegría al llegar a la actividad', is_correct: false },
      { id: 'q9a3', question_id: 'q9', text: 'Participación activa en grupo', is_correct: false },
      { id: 'q9a4', question_id: 'q9', text: 'Buena relación con sus compañeros', is_correct: false }
    ]
  },
  {
    id: 'q10',
    text: '¿Qué debe hacer el Delegado/a si sospecha de abuso sexual?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q10a1', question_id: 'q10', text: 'Comunicarlo inmediatamente a Fiscalía de Menores o Fuerzas de Seguridad', is_correct: true },
      { id: 'q10a2', question_id: 'q10', text: 'Investigar por su cuenta antes de denunciar', is_correct: false },
      { id: 'q10a3', question_id: 'q10', text: 'Esperar a tener pruebas concluyentes', is_correct: false },
      { id: 'q10a4', question_id: 'q10', text: 'Solo informar a la familia', is_correct: false }
    ]
  },
  {
    id: 'q11',
    text: '¿Cada cuánto tiempo debe revisarse el Plan de Protección?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q11a1', question_id: 'q11', text: 'Al menos una vez al año', is_correct: true },
      { id: 'q11a2', question_id: 'q11', text: 'Cada 5 años', is_correct: false },
      { id: 'q11a3', question_id: 'q11', text: 'Solo cuando hay cambios legislativos', is_correct: false },
      { id: 'q11a4', question_id: 'q11', text: 'No es necesario revisarlo', is_correct: false }
    ]
  },
  {
    id: 'q12',
    text: '¿Qué es el interés superior del menor?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q12a1', question_id: 'q12', text: 'Principio que prioriza el bienestar del menor sobre cualquier otro interés', is_correct: true },
      { id: 'q12a2', question_id: 'q12', text: 'El deseo expresado por los padres', is_correct: false },
      { id: 'q12a3', question_id: 'q12', text: 'Lo que decida el director de la entidad', is_correct: false },
      { id: 'q12a4', question_id: 'q12', text: 'Los intereses económicos de la familia', is_correct: false }
    ]
  },
  {
    id: 'q13',
    text: '¿Qué debe garantizar el canal de comunicación para menores?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q13a1', question_id: 'q13', text: 'Confidencialidad, accesibilidad y respuesta rápida', is_correct: true },
      { id: 'q13a2', question_id: 'q13', text: 'Que solo funcione en horario de oficina', is_correct: false },
      { id: 'q13a3', question_id: 'q13', text: 'Que requiera identificación completa del menor', is_correct: false },
      { id: 'q13a4', question_id: 'q13', text: 'Que los padres sean informados automáticamente', is_correct: false }
    ]
  },
  {
    id: 'q14',
    text: '¿Cuál es una medida preventiva obligatoria en espacios físicos?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q14a1', question_id: 'q14', text: 'Evitar zonas aisladas o sin supervisión', is_correct: true },
      { id: 'q14a2', question_id: 'q14', text: 'Permitir que los menores usen cualquier espacio libremente', is_correct: false },
      { id: 'q14a3', question_id: 'q14', text: 'Cerrar las instalaciones con llave durante las actividades', is_correct: false },
      { id: 'q14a4', question_id: 'q14', text: 'No supervisar los vestuarios', is_correct: false }
    ]
  },
  {
    id: 'q15',
    text: '¿Qué es la violencia digital según la LOPIVI?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q15a1', question_id: 'q15', text: 'Acoso, sextorsión, grooming y otras formas de violencia a través de medios digitales', is_correct: true },
      { id: 'q15a2', question_id: 'q15', text: 'Solo el uso excesivo de pantallas', is_correct: false },
      { id: 'q15a3', question_id: 'q15', text: 'El acceso a contenidos inadecuados', is_correct: false },
      { id: 'q15a4', question_id: 'q15', text: 'Los videojuegos violentos', is_correct: false }
    ]
  },
  {
    id: 'q15b',
    text: '¿Cuál es una señal física de posible maltrato?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q15ba1', question_id: 'q15b', text: 'Moratones frecuentes en zonas no habituales de caídas', is_correct: true },
      { id: 'q15ba2', question_id: 'q15b', text: 'Rodillas raspadas por jugar', is_correct: false },
      { id: 'q15ba3', question_id: 'q15b', text: 'Cansancio tras hacer deporte', is_correct: false },
      { id: 'q15ba4', question_id: 'q15b', text: 'Estar bronceado en verano', is_correct: false }
    ]
  },
  {
    id: 'q15c',
    text: '¿Qué es la negligencia emocional?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q15ca1', question_id: 'q15c', text: 'Falta persistente de atención a las necesidades afectivas del menor', is_correct: true },
      { id: 'q15ca2', question_id: 'q15c', text: 'No comprarle juguetes caros', is_correct: false },
      { id: 'q15ca3', question_id: 'q15c', text: 'Ponerle límites educativos', is_correct: false },
      { id: 'q15ca4', question_id: 'q15c', text: 'No permitirle usar videojuegos', is_correct: false }
    ]
  },
  {
    id: 'q15d',
    text: '¿Qué debe contener el código de conducta de la entidad?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q15da1', question_id: 'q15d', text: 'Normas de comportamiento, límites relacionales y consecuencias por incumplimiento', is_correct: true },
      { id: 'q15da2', question_id: 'q15d', text: 'Solo horarios de entrada y salida', is_correct: false },
      { id: 'q15da3', question_id: 'q15d', text: 'Únicamente sanciones disciplinarias', is_correct: false },
      { id: 'q15da4', question_id: 'q15d', text: 'No hace falta tener código de conducta', is_correct: false }
    ]
  },
  {
    id: 'q15e',
    text: '¿Qué NO debe hacer un adulto ante un relato de maltrato de un menor?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q15ea1', question_id: 'q15e', text: 'Prometer guardar el secreto al menor', is_correct: true },
      { id: 'q15ea2', question_id: 'q15e', text: 'Escuchar con atención y calma', is_correct: false },
      { id: 'q15ea3', question_id: 'q15e', text: 'Agradecer su confianza', is_correct: false },
      { id: 'q15ea4', question_id: 'q15e', text: 'Documentar lo relatado', is_correct: false }
    ]
  },
  {
    id: 'q15f',
    text: '¿Qué es el grooming?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q15fa1', question_id: 'q15f', text: 'Estrategia de un adulto para ganarse la confianza de un menor con fines de abuso sexual', is_correct: true },
      { id: 'q15fa2', question_id: 'q15f', text: 'Un tipo de juego online', is_correct: false },
      { id: 'q15fa3', question_id: 'q15f', text: 'Una actividad deportiva', is_correct: false },
      { id: 'q15fa4', question_id: 'q15f', text: 'Un método de enseñanza', is_correct: false }
    ]
  },
  {
    id: 'q15g',
    text: '¿Cuándo debe formarse el personal en LOPIVI?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q15ga1', question_id: 'q15g', text: 'Antes de iniciar su trabajo con menores y con actualizaciones periódicas', is_correct: true },
      { id: 'q15ga2', question_id: 'q15g', text: 'Solo si ocurre un incidente', is_correct: false },
      { id: 'q15ga3', question_id: 'q15g', text: 'Una vez cada 10 años', is_correct: false },
      { id: 'q15ga4', question_id: 'q15g', text: 'No es obligatorio', is_correct: false }
    ]
  },
  {
    id: 'q15h',
    text: '¿Qué debe hacerse con la documentación de casos de posible maltrato?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q15ha1', question_id: 'q15h', text: 'Custodiarla de forma segura y confidencial cumpliendo con protección de datos', is_correct: true },
      { id: 'q15ha2', question_id: 'q15h', text: 'Compartirla con todo el personal', is_correct: false },
      { id: 'q15ha3', question_id: 'q15h', text: 'Publicarla en tablones informativos', is_correct: false },
      { id: 'q15ha4', question_id: 'q15h', text: 'Destruirla inmediatamente', is_correct: false }
    ]
  },
  {
    id: 'q15i',
    text: '¿Qué característica debe tener la formación en protección infantil?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q15ia1', question_id: 'q15i', text: 'Ser práctica, adaptada al sector y actualizada periódicamente', is_correct: true },
      { id: 'q15ia2', question_id: 'q15i', text: 'Ser solo teórica sin casos prácticos', is_correct: false },
      { id: 'q15ia3', question_id: 'q15i', text: 'Realizarse una sola vez en la vida', is_correct: false },
      { id: 'q15ia4', question_id: 'q15i', text: 'No incluir protocolos específicos', is_correct: false }
    ]
  },
  {
    id: 'q15j',
    text: '¿Qué es la parentalidad positiva?',
    is_general: true,
    sector_code: null,
    active: true,
    answers: [
      { id: 'q15ja1', question_id: 'q15j', text: 'Modelo de crianza basado en el respeto, afecto y establecimiento de límites sin violencia', is_correct: true },
      { id: 'q15ja2', question_id: 'q15j', text: 'Dejar hacer al menor lo que quiera sin límites', is_correct: false },
      { id: 'q15ja3', question_id: 'q15j', text: 'Castigar físicamente cuando sea necesario', is_correct: false },
      { id: 'q15ja4', question_id: 'q15j', text: 'Solo aplicable a familias monoparentales', is_correct: false }
    ]
  },

  // ===== PREGUNTAS SECTOR: Ludoteca (10) =====
  {
    id: 'q16',
    text: 'En una ludoteca, ¿cómo debe gestionarse la recogida de menores?',
    is_general: false,
    sector_code: 'ludoteca',
    active: true,
    answers: [
      { id: 'q16a1', question_id: 'q16', text: 'Solo entregarlos a personas autorizadas previamente por escrito', is_correct: true },
      { id: 'q16a2', question_id: 'q16', text: 'Permitir que cualquier adulto conocido los recoja', is_correct: false },
      { id: 'q16a3', question_id: 'q16', text: 'Dejar que los niños salgan solos si lo piden', is_correct: false },
      { id: 'q16a4', question_id: 'q16', text: 'No es necesario un protocolo específico', is_correct: false }
    ]
  },
  {
    id: 'q17',
    text: '¿Cuál es la ratio mínima recomendada de adultos por menor en ludoteca?',
    is_general: false,
    sector_code: 'ludoteca',
    active: true,
    answers: [
      { id: 'q17a1', question_id: 'q17', text: '1 adulto por cada 8-10 menores', is_correct: true },
      { id: 'q17a2', question_id: 'q17', text: '1 adulto por cada 20 menores', is_correct: false },
      { id: 'q17a3', question_id: 'q17', text: '1 adulto por cada 30 menores', is_correct: false },
      { id: 'q17a4', question_id: 'q17', text: 'No hay ratio específica', is_correct: false }
    ]
  },
  {
    id: 'q18',
    text: '¿Qué debe hacerse si un menor presenta lesiones al llegar a la ludoteca?',
    is_general: false,
    sector_code: 'ludoteca',
    active: true,
    answers: [
      { id: 'q18a1', question_id: 'q18', text: 'Documentar las lesiones, preguntar de forma no invasiva y comunicar al Delegado/a', is_correct: true },
      { id: 'q18a2', question_id: 'q18', text: 'Ignorarlo si el menor dice que no duele', is_correct: false },
      { id: 'q18a3', question_id: 'q18', text: 'Llamar a la policía inmediatamente', is_correct: false },
      { id: 'q18a4', question_id: 'q18', text: 'Preguntarle solo a la familia', is_correct: false }
    ]
  },
  {
    id: 'q19',
    text: 'En ludotecas, ¿cómo deben supervisarse los baños?',
    is_general: false,
    sector_code: 'ludoteca',
    active: true,
    answers: [
      { id: 'q19a1', question_id: 'q19', text: 'Supervisión externa sin vulnerar la intimidad, con puertas que no se cierren con llave', is_correct: true },
      { id: 'q19a2', question_id: 'q19', text: 'No hace falta supervisarlos', is_correct: false },
      { id: 'q19a3', question_id: 'q19', text: 'Acompañar siempre dentro del baño', is_correct: false },
      { id: 'q19a4', question_id: 'q19', text: 'Permitir que varios menores entren sin control', is_correct: false }
    ]
  },
  {
    id: 'q20',
    text: '¿Qué información debe recabarse de cada menor inscrito en la ludoteca?',
    is_general: false,
    sector_code: 'ludoteca',
    active: true,
    answers: [
      { id: 'q20a1', question_id: 'q20', text: 'Datos de contacto, personas autorizadas, alergias y condiciones médicas', is_correct: true },
      { id: 'q20a2', question_id: 'q20', text: 'Solo nombre y edad', is_correct: false },
      { id: 'q20a3', question_id: 'q20', text: 'No es necesario recoger información', is_correct: false },
      { id: 'q20a4', question_id: 'q20', text: 'Solo los datos de facturación', is_correct: false }
    ]
  },

  // ===== PREGUNTAS SECTOR: Club de Fútbol (5) =====
  {
    id: 'q21',
    text: 'En entrenamientos deportivos, ¿cómo deben gestionarse los vestuarios?',
    is_general: false,
    sector_code: 'club_futbol',
    active: true,
    answers: [
      { id: 'q21a1', question_id: 'q21', text: 'Supervisión externa, nunca entrenadores a solas con menores dentro', is_correct: true },
      { id: 'q21a2', question_id: 'q21', text: 'El entrenador puede entrar libremente', is_correct: false },
      { id: 'q21a3', question_id: 'q21', text: 'No hace falta supervisión', is_correct: false },
      { id: 'q21a4', question_id: 'q21', text: 'Cerrar con llave durante el entrenamiento', is_correct: false }
    ]
  },
  {
    id: 'q22',
    text: '¿Qué debe evitarse en desplazamientos deportivos con menores?',
    is_general: false,
    sector_code: 'club_futbol',
    active: true,
    answers: [
      { id: 'q22a1', question_id: 'q22', text: 'Que un adulto viaje solo con un menor sin autorización y supervisión', is_correct: true },
      { id: 'q22a2', question_id: 'q22', text: 'Viajar en autobús', is_correct: false },
      { id: 'q22a3', question_id: 'q22', text: 'Hacer paradas durante el viaje', is_correct: false },
      { id: 'q22a4', question_id: 'q22', text: 'Llevar agua y comida', is_correct: false }
    ]
  },
  {
    id: 'q23',
    text: '¿Cómo debe actuar un entrenador ante una lesión de un menor?',
    is_general: false,
    sector_code: 'club_futbol',
    active: true,
    answers: [
      { id: 'q23a1', question_id: 'q23', text: 'Valorar la lesión, aplicar primeros auxilios si procede, avisar a familia y documentar', is_correct: true },
      { id: 'q23a2', question_id: 'q23', text: 'Ignorarlo si el menor dice que puede continuar', is_correct: false },
      { id: 'q23a3', question_id: 'q23', text: 'Obligar al menor a continuar entrenando', is_correct: false },
      { id: 'q23a4', question_id: 'q23', text: 'Solo avisar a la familia al final de la sesión', is_correct: false }
    ]
  },
  {
    id: 'q24',
    text: '¿Qué tipo de comunicación debe evitarse entre entrenador y menor fuera del club?',
    is_general: false,
    sector_code: 'club_futbol',
    active: true,
    answers: [
      { id: 'q24a1', question_id: 'q24', text: 'Comunicación privada individual fuera de canales oficiales', is_correct: true },
      { id: 'q24a2', question_id: 'q24', text: 'Comunicación grupal sobre entrenamientos', is_correct: false },
      { id: 'q24a3', question_id: 'q24', text: 'Avisos sobre cambios de horario', is_correct: false },
      { id: 'q24a4', question_id: 'q24', text: 'Felicitaciones por el rendimiento deportivo', is_correct: false }
    ]
  },
  {
    id: 'q25',
    text: '¿Qué debe hacer un club deportivo si detecta acoso entre menores del equipo?',
    is_general: false,
    sector_code: 'club_futbol',
    active: true,
    answers: [
      { id: 'q25a1', question_id: 'q25', text: 'Activar protocolo antibullying, proteger a la víctima, comunicar a Delegado/a y familias', is_correct: true },
      { id: 'q25a2', question_id: 'q25', text: 'Esperar a ver si se resuelve solo', is_correct: false },
      { id: 'q25a3', question_id: 'q25', text: 'Castigar solo al acosador sin más acciones', is_correct: false },
      { id: 'q25a4', question_id: 'q25', text: 'No intervenir si ocurre fuera del club', is_correct: false }
    ]
  }
]

// Función para obtener preguntas por tipo
export function getGeneralQuestions(): MockQuestion[] {
  return MOCK_QUESTIONS.filter(q => q.is_general && q.active)
}

export function getSectorQuestions(sectorCode: string): MockQuestion[] {
  return MOCK_QUESTIONS.filter(q => !q.is_general && q.sector_code === sectorCode && q.active)
}

export function getAllQuestions(): MockQuestion[] {
  return MOCK_QUESTIONS.filter(q => q.active)
}
