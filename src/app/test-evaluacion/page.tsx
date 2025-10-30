'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Usuario {
  id: string
  nombre: string
  email: string
  tipo: string
  entidad: string
  certificacionVigente?: boolean
  formacionCompletada?: boolean
  tipoEntidad?: string | null
}

interface Pregunta {
  id: number
  pregunta: string
  opciones: string[]
  respuestaCorrecta: number
  explicacion: string
  modulo: number
  sector: string
}

// Preguntas específicas por sector con respuestas correctas distribuidas equilibradamente
const preguntasPorSector = {
  'club-deportivo': [
    {
      id: 1,
      pregunta: "En un club deportivo, ¿cuál es la situación de mayor riesgo durante los entrenamientos?",
      opciones: [
        "Entrenador que ayuda con correcciones técnicas en presencia de otros",
        "Menor que se queda solo en vestuario después del entrenamiento",
        "Grupo de menores que entrena en horario matutino",
        "Padres que observan el entrenamiento desde las gradas"
      ],
      respuestaCorrecta: 1, // B
      explicacion: "Un menor solo en vestuario crea una situación de vulnerabilidad sin supervisión adecuada.",
      modulo: 2,
      sector: 'deportivo'
    },
    {
      id: 2,
      pregunta: "Durante los desplazamientos a competiciones deportivas, ¿qué ratio mínimo de supervisión debe mantenerse?",
      opciones: [
        "1 adulto cada 6 menores en desplazamientos",
        "1 adulto cada 12 menores",
        "1 adulto cada 20 menores",
        "No hay ratio específico requerido"
      ],
      respuestaCorrecta: 0, // A
      explicacion: "El ratio de seguridad en desplazamientos deportivos debe ser de 1 adulto cada 6 menores.",
      modulo: 3,
      sector: 'deportivo'
    },
    {
      id: 3,
      pregunta: "¿Qué debe hacer un entrenador si necesita aplicar vendajes o primeros auxilios a un menor?",
      opciones: [
        "Hacerlo inmediatamente sin más consideraciones",
        "Pedir autorización a la dirección del club",
        "Explicar el procedimiento y hacerlo en presencia de otro adulto o menor",
        "Derivar siempre a servicios médicos externos"
      ],
      respuestaCorrecta: 2, // C
      explicacion: "Se debe explicar el procedimiento y realizarlo con testigos presentes para garantizar transparencia.",
      modulo: 4,
      sector: 'deportivo'
    },
    {
      id: 4,
      pregunta: "En celebraciones o eventos sociales del club, ¿cuál es la medida preventiva más importante?",
      opciones: [
        "Prohibir totalmente la asistencia de menores",
        "No servir bebidas alcohólicas",
        "Permitir solo a padres como supervisores",
        "Designar responsables específicos sobrios para supervisión de menores"
      ],
      respuestaCorrecta: 3, // D
      explicacion: "Es fundamental designar personal sobrio específicamente responsable de supervisar a los menores durante eventos.",
      modulo: 3,
      sector: 'deportivo'
    },
    {
      id: 5,
      pregunta: "¿Cuál es el protocolo correcto para entrenamientos individuales en el club?",
      opciones: [
        "Solo en instalaciones del club y con otros adultos presentes",
        "Pueden realizarse en domicilios del entrenador",
        "Sin restricciones específicas",
        "Solo los fines de semana"
      ],
      respuestaCorrecta: 0, // A
      explicacion: "Los entrenamientos individuales solo deben realizarse en instalaciones del club con presencia de otros adultos.",
      modulo: 4,
      sector: 'deportivo'
    }
  ],
  'centro-religioso': [
    {
      id: 6,
      pregunta: "En actividades de catequesis, ¿cuál es la configuración de aula más segura?",
      opciones: [
        "Catequista solo con un grupo de menores en aula cerrada",
        "Aulas con puertas de cristal o abiertas que permitan visibilidad",
        "Actividades solo en el sótano de la parroquia",
        "Reuniones individuales en despacho del sacerdote"
      ],
      respuestaCorrecta: 1, // B
      explicacion: "Las aulas deben tener visibilidad desde el exterior para garantizar transparencia y supervisión.",
      modulo: 3,
      sector: 'religioso'
    },
    {
      id: 7,
      pregunta: "Durante campamentos o convivencias religiosas, ¿cómo deben organizarse las habitaciones?",
      opciones: [
        "Menores y adultos pueden compartir habitación libremente",
        "Solo menores en habitaciones, adultos en zonas separadas",
        "Un adulto por habitación con varios menores",
        "Habitaciones mixtas sin restricciones"
      ],
      respuestaCorrecta: 1, // B
      explicacion: "Los menores deben alojarse separados de los adultos, manteniendo supervisión externa apropiada.",
      modulo: 4,
      sector: 'religioso'
    },
    {
      id: 8,
      pregunta: "¿Qué debe evitarse en la comunicación digital con menores en grupos religiosos?",
      opciones: [
        "Usar grupos de WhatsApp oficiales con padres incluidos",
        "Comunicación transparente sobre actividades",
        "Mensajes privados individuales entre adulto y menor",
        "Información sobre horarios de actividades"
      ],
      respuestaCorrecta: 2, // C
      explicacion: "Los mensajes privados individuales entre adultos y menores deben evitarse por completo.",
      modulo: 5,
      sector: 'religioso'
    },
    {
      id: 9,
      pregunta: "En procesiones o actividades públicas religiosas con menores, ¿cuál es la prioridad?",
      opciones: [
        "La belleza estética de la procesión",
        "La participación masiva de fieles",
        "El orden cronológico tradicional",
        "La supervisión constante y seguridad de los menores participantes"
      ],
      respuestaCorrecta: 3, // D
      explicacion: "La seguridad y supervisión de menores debe ser siempre la máxima prioridad en cualquier actividad.",
      modulo: 2,
      sector: 'religioso'
    },
    {
      id: 10,
      pregunta: "¿Qué formación específica necesita el personal de pastoral juvenil?",
      opciones: [
        "Conocimientos LOPIVI y protocolos de protección infantil específicos",
        "Solo formación teológica",
        "Únicamente experiencia previa con jóvenes",
        "Solo buenas intenciones y vocación"
      ],
      respuestaCorrecta: 0, // A
      explicacion: "Todo personal que trabaja con menores necesita formación específica en LOPIVI y protocolos de protección.",
      modulo: 1,
      sector: 'religioso'
    }
  ],
  'centro-educativo': [
    {
      id: 11,
      pregunta: "En un centro educativo, ¿cuándo debe activarse el protocolo de protección?",
      opciones: [
        "Solo cuando hay evidencia física de maltrato",
        "Únicamente si el menor lo solicita expresamente",
        "Ante cualquier sospecha fundada o indicador de riesgo",
        "Solo cuando los padres den autorización"
      ],
      respuestaCorrecta: 2, // C
      explicacion: "El protocolo debe activarse ante cualquier sospecha fundada, sin esperar evidencias concluyentes.",
      modulo: 2,
      sector: 'educativo'
    },
    {
      id: 12,
      pregunta: "¿Qué debe hacer un profesor si un alumno le revela una situación de maltrato?",
      opciones: [
        "Interrogar inmediatamente para obtener más detalles",
        "Mantener la calma, escuchar y comunicar al delegado de protección",
        "Llamar directamente a los padres",
        "Esperar a ver si el menor vuelve a mencionarlo"
      ],
      respuestaCorrecta: 1, // B
      explicacion: "Debe mantener calma, escuchar activamente y comunicar inmediatamente al delegado de protección del centro.",
      modulo: 4,
      sector: 'educativo'
    },
    {
      id: 13,
      pregunta: "En actividades extraescolares, ¿cuál es la supervisión mínima requerida?",
      opciones: [
        "Un adulto cada 15 menores",
        "Un adulto cada 10 menores",
        "Un adulto cada 8 menores",
        "Un adulto cada 20 menores"
      ],
      respuestaCorrecta: 2, // C
      explicacion: "En actividades extraescolares se requiere un ratio de supervisión de 1 adulto cada 8 menores.",
      modulo: 3,
      sector: 'educativo'
    },
    {
      id: 14,
      pregunta: "¿Cómo debe documentarse un incidente en el centro educativo?",
      opciones: [
        "Solo en la memoria del profesor",
        "En un informe personal sin estructura",
        "En un cuaderno común de incidencias",
        "Con registro formal, fecha, hechos objetivos y medidas adoptadas"
      ],
      respuestaCorrecta: 3, // D
      explicacion: "Debe documentarse formalmente con todos los datos objetivos, fechas exactas y medidas adoptadas.",
      modulo: 5,
      sector: 'educativo'
    },
    {
      id: 15,
      pregunta: "¿Qué debe incluir el plan de protección de un centro educativo?",
      opciones: [
        "Protocolos claros, formación del personal, canal de comunicación y evaluación continua",
        "Solo los teléfonos de emergencia",
        "Únicamente las obligaciones legales mínimas",
        "Solo la designación del delegado de protección"
      ],
      respuestaCorrecta: 0, // A
      explicacion: "Un plan integral debe incluir protocolos, formación, comunicación y sistemas de evaluación.",
      modulo: 1,
      sector: 'educativo'
    }
  ],
  'centro-ocio': [
    {
      id: 16,
      pregunta: "En campamentos de verano, ¿cuál es la política correcta para las duchas?",
      opciones: [
        "Supervisión directa de monitores en las duchas",
        "Supervisión externa sin acceso visual directo a las duchas",
        "Menores completamente solos sin supervisión",
        "Duchas mixtas para optimizar tiempo"
      ],
      respuestaCorrecta: 1, // B
      explicacion: "Debe haber supervisión externa constante pero respetando la intimidad de los menores.",
      modulo: 4,
      sector: 'ocio'
    },
    {
      id: 17,
      pregunta: "Durante actividades nocturnas en campamentos, ¿qué medida es esencial?",
      opciones: [
        "Permitir que los menores gestionen libremente su tiempo",
        "Tener monitores despiertos rotando supervisión durante toda la noche",
        "Confiar en que los menores mayores supervisen a los pequeños",
        "Cerrar todas las instalaciones y dejar a los menores solos"
      ],
      respuestaCorrecta: 1, // B
      explicacion: "Debe mantenerse supervisión adulta constante, incluso durante las horas nocturnas en campamentos.",
      modulo: 3,
      sector: 'ocio'
    },
    {
      id: 18,
      pregunta: "¿Cómo deben gestionarse las actividades acuáticas en centros de ocio?",
      opciones: [
        "Sin supervisión específica si los menores saben nadar",
        "Solo con monitores que tengan certificación en salvamento acuático",
        "Permitir actividades acuáticas solo en horarios de menor riesgo",
        "Con cualquier monitor disponible"
      ],
      respuestaCorrecta: 1, // B
      explicacion: "Las actividades acuáticas requieren monitores con certificación específica en salvamento acuático.",
      modulo: 4,
      sector: 'ocio'
    },
    {
      id: 19,
      pregunta: "En excursiones o salidas, ¿cuál es el protocolo de comunicación con familias?",
      opciones: [
        "Comunicar solo si hay problemas graves",
        "Enviar comunicación diaria sobre el bienestar y actividades",
        "Solo comunicación al final de la actividad",
        "Comunicación únicamente si los menores lo solicitan"
      ],
      respuestaCorrecta: 1, // B
      explicacion: "Debe mantenerse comunicación regular con las familias sobre el bienestar y actividades de los menores.",
      modulo: 5,
      sector: 'ocio'
    },
    {
      id: 20,
      pregunta: "¿Qué debe hacer un monitor ante un comportamiento inadecuado entre menores?",
      opciones: [
        "Intervenir inmediatamente y documentar el incidente",
        "Ignorarlo si no causa daño físico visible",
        "Esperar a que se resuelva solo",
        "Solo actuar si otro monitor también lo observa"
      ],
      respuestaCorrecta: 0, // A
      explicacion: "Debe intervenir inmediatamente para proteger a todos los menores y documentar apropiadamente.",
      modulo: 2,
      sector: 'ocio'
    }
  ]
}

// Función para obtener 20 preguntas aleatorias del sector específico o genéricas
const obtenerPreguntasParaTest = (tipoEntidad: string): Pregunta[] => {
  let preguntasDisponibles: Pregunta[] = []

  // Mapeo de tipos de entidad a sectores
  const mapeoSectores: { [key: string]: string } = {
    'club-deportivo': 'club-deportivo',
    'academia-deportiva': 'club-deportivo',
    'centro-deportivo': 'club-deportivo',
    'centro-religioso': 'centro-religioso',
    'parroquia': 'centro-religioso',
    'colegio': 'centro-educativo',
    'escuela': 'centro-educativo',
    'instituto': 'centro-educativo',
    'campamento': 'centro-ocio',
    'centro-ocio': 'centro-ocio',
    'ludoteca': 'centro-ocio'
  }

  const sector = mapeoSectores[tipoEntidad] || 'club-deportivo'
  preguntasDisponibles = preguntasPorSector[sector] || preguntasPorSector['club-deportivo']

  // Agregar preguntas comunes/genéricas para completar hasta 20
  const preguntasComunes: Pregunta[] = [
    {
      id: 101,
      pregunta: "¿Cuál es el objetivo principal de la LOPIVI?",
      opciones: [
        "Regular únicamente las actividades deportivas",
        "Proteger integralmente a la infancia y adolescencia frente a la violencia",
        "Establecer normas generales de educación",
        "Controlar las actividades de ocio y tiempo libre"
      ],
      respuestaCorrecta: 1, // B
      explicacion: "La LOPIVI tiene como objetivo principal la protección integral de la infancia y adolescencia frente a cualquier forma de violencia.",
      modulo: 1,
      sector: 'general'
    },
    {
      id: 102,
      pregunta: "¿Quién debe ser designado como Delegado de Protección en una entidad?",
      opciones: [
        "Una persona con formación específica en protección infantil",
        "Cualquier empleado de la entidad",
        "Solo directivos de la organización",
        "Personal voluntario sin requisitos específicos"
      ],
      respuestaCorrecta: 0, // A
      explicacion: "El Delegado de Protección debe ser una persona con formación específica en protección infantil y competencias adecuadas.",
      modulo: 1,
      sector: 'general'
    },
    {
      id: 103,
      pregunta: "¿Cuáles son los principales indicadores físicos de maltrato infantil?",
      opciones: [
        "Solo las lesiones visibles en la cara",
        "Únicamente fracturas óseas",
        "Lesiones inexplicables, marcas de golpes, quemaduras o mordeduras",
        "Solo cambios en el comportamiento"
      ],
      respuestaCorrecta: 2, // C
      explicacion: "Los indicadores físicos incluyen lesiones inexplicables, marcas, quemaduras, mordeduras y cualquier signo físico de maltrato.",
      modulo: 2,
      sector: 'general'
    },
    {
      id: 104,
      pregunta: "¿Qué debe hacer inmediatamente al detectar una situación de riesgo grave?",
      opciones: [
        "Esperar a tener más información",
        "Hablar primero con la familia",
        "Documentar durante varios días",
        "Comunicar inmediatamente a las autoridades competentes"
      ],
      respuestaCorrecta: 3, // D
      explicacion: "En situaciones de riesgo grave se debe comunicar inmediatamente a las autoridades competentes para garantizar la protección del menor.",
      modulo: 3,
      sector: 'general'
    },
    {
      id: 105,
      pregunta: "¿Cuál es la formación mínima requerida para el personal que trabaja con menores?",
      opciones: [
        "No se requiere formación específica",
        "Solo formación en primeros auxilios",
        "Únicamente experiencia previa",
        "Formación específica en protección infantil y LOPIVI"
      ],
      respuestaCorrecta: 3, // D
      explicacion: "Todo el personal que trabaja con menores debe recibir formación específica en protección infantil y conocimiento de la LOPIVI.",
      modulo: 4,
      sector: 'general'
    },
    {
      id: 106,
      pregunta: "¿Qué elementos debe contener el sistema de documentación?",
      opciones: [
        "Solo los informes finales",
        "Registros de incidencias, comunicaciones y seguimientos",
        "Únicamente datos personales",
        "Solo documentos legales"
      ],
      respuestaCorrecta: 1, // B
      explicacion: "El sistema debe incluir registros de incidencias, comunicaciones, seguimientos y toda la documentación relevante para la protección.",
      modulo: 5,
      sector: 'general'
    },
    {
      id: 107,
      pregunta: "¿Con qué frecuencia se debe evaluar el sistema de protección?",
      opciones: [
        "Solo cuando ocurre un incidente",
        "Una vez al año",
        "De manera continua y periódica",
        "Únicamente cuando lo requiera la inspección"
      ],
      respuestaCorrecta: 2, // C
      explicacion: "La evaluación debe ser continua y periódica para asegurar la efectividad y mejora constante del sistema de protección.",
      modulo: 6,
      sector: 'general'
    },
    {
      id: 108,
      pregunta: "¿Cuál es el papel de la coordinación interinstitucional?",
      opciones: [
        "No es necesaria",
        "Solo en casos extremos",
        "Opcional según el tipo de entidad",
        "Fundamental para una protección integral y efectiva"
      ],
      respuestaCorrecta: 3, // D
      explicacion: "La coordinación interinstitucional es fundamental para garantizar una protección integral y efectiva de los menores.",
      modulo: 7,
      sector: 'general'
    },
    {
      id: 109,
      pregunta: "¿Qué aspectos debe incluir la implementación práctica del sistema?",
      opciones: [
        "Solo los protocolos escritos",
        "Planificación, formación, evaluación y mejora continua",
        "Únicamente la designación de responsables",
        "Solo la comunicación con familias"
      ],
      respuestaCorrecta: 1, // B
      explicacion: "La implementación debe incluir planificación estratégica, formación del personal, evaluación constante y mejora continua.",
      modulo: 8,
      sector: 'general'
    },
    {
      id: 110,
      pregunta: "¿Cuál es el principio rector en todas las actuaciones de protección infantil?",
      opciones: [
        "El interés superior del menor",
        "La eficiencia administrativa",
        "La comodidad de los adultos",
        "La reducción de costos"
      ],
      respuestaCorrecta: 0, // A
      explicacion: "El interés superior del menor es el principio rector que debe guiar todas las decisiones y actuaciones en protección infantil.",
      modulo: 1,
      sector: 'general'
    },
    {
      id: 111,
      pregunta: "¿Qué características debe tener un protocolo de actuación eficaz?",
      opciones: [
        "Ser genérico para todas las situaciones",
        "Incluir solo aspectos administrativos",
        "Ser claro, específico y de fácil aplicación",
        "Enfocarse únicamente en la documentación"
      ],
      respuestaCorrecta: 2, // C
      explicacion: "Un protocolo eficaz debe ser claro, específico para cada situación y de fácil aplicación práctica.",
      modulo: 3,
      sector: 'general'
    },
    {
      id: 112,
      pregunta: "¿Cuándo debe activarse el protocolo de comunicación inmediata?",
      opciones: [
        "Solo en situaciones de maltrato confirmado",
        "Únicamente cuando hay lesiones físicas",
        "Solo cuando lo solicite la familia",
        "Ante cualquier sospecha fundada de riesgo"
      ],
      respuestaCorrecta: 3, // D
      explicacion: "El protocolo debe activarse ante cualquier sospecha fundada de riesgo para el menor, sin esperar confirmación.",
      modulo: 3,
      sector: 'general'
    },
    {
      id: 113,
      pregunta: "¿Qué elementos debe incluir la documentación de un caso?",
      opciones: [
        "Solo los hechos observados directamente",
        "Hechos objetivos, fechas, testigos y medidas adoptadas",
        "Únicamente las opiniones del delegado",
        "Solo la información proporcionada por la familia"
      ],
      respuestaCorrecta: 1, // B
      explicacion: "La documentación debe incluir hechos objetivos, fechas precisas, testigos presentes y todas las medidas adoptadas.",
      modulo: 5,
      sector: 'general'
    },
    {
      id: 114,
      pregunta: "¿Quiénes deben participar en la red de protección interinstitucional?",
      opciones: [
        "Solo los servicios sociales",
        "Únicamente el sector educativo",
        "Servicios sociales, sanitarios, educativos, judiciales y fuerzas de seguridad",
        "Solo las organizaciones del tercer sector"
      ],
      respuestaCorrecta: 2, // C
      explicacion: "La red debe incluir servicios sociales, sanitarios, educativos, sistema judicial y fuerzas de seguridad.",
      modulo: 7,
      sector: 'general'
    },
    {
      id: 115,
      pregunta: "¿Qué es fundamental para la sostenibilidad del sistema de protección?",
      opciones: [
        "Tener recursos económicos ilimitados",
        "Cultura organizacional protectora y compromiso del liderazgo",
        "Solo cumplir los requisitos mínimos legales",
        "Depender únicamente de personal externo"
      ],
      respuestaCorrecta: 1, // B
      explicacion: "La sostenibilidad requiere una cultura organizacional protectora sólida y compromiso genuino del liderazgo.",
      modulo: 8,
      sector: 'general'
    }
  ]

  // Combinar preguntas específicas del sector con preguntas generales
  const todasLasPreguntas = [...preguntasDisponibles, ...preguntasComunes]

  // Seleccionar 20 preguntas aleatorias
  const preguntasSeleccionadas: Pregunta[] = []
  const indicesUsados = new Set<number>()

  while (preguntasSeleccionadas.length < 20 && preguntasSeleccionadas.length < todasLasPreguntas.length) {
    const indiceAleatorio = Math.floor(Math.random() * todasLasPreguntas.length)
    if (!indicesUsados.has(indiceAleatorio)) {
      indicesUsados.add(indiceAleatorio)
      preguntasSeleccionadas.push({
        ...todasLasPreguntas[indiceAleatorio],
        id: preguntasSeleccionadas.length + 1 // Renumerar para el test
      })
    }
  }

  return preguntasSeleccionadas
}

export default function TestEvaluacionPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [respuestas, setRespuestas] = useState<number[]>([])
  const [testCompletado, setTestCompletado] = useState(false)
  const [puntuacion, setPuntuacion] = useState(0)
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [tiempoInicio] = useState(new Date())
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<number | null>(null)
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])

  useEffect(() => {
    // Verificar sesión del login de delegados
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);

        // Verificar expiración de sesión
        if (userData.expiracion && new Date(userData.expiracion) <= new Date()) {
          localStorage.removeItem('userSession');
          router.push('/login-delegados');
          return;
        }

        setUsuario(userData);

        // Generar preguntas dinámicamente según el tipo de entidad
        const tipoEntidad = userData.tipoEntidad || userData.tipo || 'club-deportivo'
        const preguntasTest = obtenerPreguntasParaTest(tipoEntidad)
        setPreguntas(preguntasTest)
      } catch (error) {
        console.error('Error loading session:', error);
        router.push('/login-delegados');
        return;
      }
    } else {
      router.push('/login-delegados');
      return;
    }
    setLoading(false);
  }, [router]);

  const seleccionarRespuesta = (opcionIndex: number) => {
    setRespuestaSeleccionada(opcionIndex)
  }

  const siguientePregunta = () => {
    if (respuestaSeleccionada === null) return

    const nuevasRespuestas = [...respuestas]
    nuevasRespuestas[preguntaActual] = respuestaSeleccionada
    setRespuestas(nuevasRespuestas)

    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1)
      setRespuestaSeleccionada(
        typeof nuevasRespuestas[preguntaActual + 1] === 'number'
          ? nuevasRespuestas[preguntaActual + 1]
          : null
      )
    } else {
      // Test completado
      completarTest(nuevasRespuestas)
    }
  }

  const completarTest = (todasLasRespuestas: number[]) => {
    let puntos = 0
    todasLasRespuestas.forEach((respuesta, index) => {
      if (respuesta === preguntas[index].respuestaCorrecta) {
        puntos++
      }
    })

    const porcentaje = Math.round((puntos / preguntas.length) * 100)
    setPuntuacion(porcentaje)
    setTestCompletado(true)

    // Guardar resultado en localStorage
    const resultado = {
      fecha: new Date().toISOString(),
      puntuacion: porcentaje,
      respuestas: todasLasRespuestas,
      tiempoTotal: new Date().getTime() - tiempoInicio.getTime(),
      aprobado: porcentaje >= 75
    }

    localStorage.setItem('test_evaluacion_resultado', JSON.stringify(resultado))

    // Actualizar datos del usuario si aprobó
    if (porcentaje >= 75 && usuario) {
      const usuarioActualizado = {
        ...usuario,
        certificacionVigente: true,
        formacionCompletada: true,
        testAprobado: true,
        fechaCertificacion: new Date().toISOString()
      }
      localStorage.setItem('userSession', JSON.stringify(usuarioActualizado))
      setUsuario(usuarioActualizado)
    }

    setTimeout(() => {
      setMostrarResultados(true)
    }, 1000)
  }

  const reiniciarTest = () => {
    setPreguntaActual(0)
    setRespuestas([])
    setTestCompletado(false)
    setPuntuacion(0)
    setMostrarResultados(false)
    setRespuestaSeleccionada(null)
    // Regenerar preguntas para nuevo intento
    if (usuario) {
      const tipoEntidad = usuario.tipoEntidad || usuario.tipo || 'club-deportivo'
      setPreguntas(obtenerPreguntasParaTest(tipoEntidad))
    }
  }

  const continuarFormacion = () => {
    if (puntuacion >= 75) {
      router.push('/formacion-lopivi/certificado')
    } else {
      router.push('/formacion-delegado')
    }
  }

  if (loading || preguntas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2563EB]"></div>
          <p className="mt-4 text-gray-600">Cargando test de evaluación...</p>
        </div>
      </div>
    )
  }

  if (!usuario) {
    return null
  }

  if (testCompletado && !mostrarResultados) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Procesando resultados...</h2>
          <p className="text-gray-600">Evaluando sus respuestas</p>
        </div>
      </div>
    )
  }

  if (mostrarResultados) {
    const aprobado = puntuacion >= 75

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Resultados del Test de Evaluación</h1>
                <p className="text-gray-600 mt-1">Formación LOPIVI - {usuario.entidad}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`p-6 text-center ${aprobado ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`w-20 h-20 ${aprobado ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-white text-3xl font-bold">
                  {aprobado ? '✓' : '✗'}
                </span>
              </div>

              <h2 className={`text-3xl font-bold ${aprobado ? 'text-green-900' : 'text-red-900'} mb-2`}>
                {aprobado ? '¡Felicitaciones!' : 'No aprobado'}
              </h2>

              <p className={`text-xl ${aprobado ? 'text-green-800' : 'text-red-800'} mb-4`}>
                Puntuación: {puntuacion}% ({respuestas.filter((r, i) => r === preguntas[i].respuestaCorrecta).length}/{preguntas.length})
              </p>

              <p className={`${aprobado ? 'text-green-700' : 'text-red-700'}`}>
                {aprobado
                  ? 'Ha superado exitosamente el test de evaluación LOPIVI. Puede continuar con la certificación.'
                  : 'Necesita una puntuación mínima del 75% para aprobar. Revise la formación y vuelva a intentarlo.'
                }
              </p>
            </div>

            {/* Acciones */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              {aprobado ? (
                <div className="flex gap-4 w-full">
                  <button
                    onClick={continuarFormacion}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                  >
                    Continuar a Certificación
                  </button>
                  <button
                    onClick={reiniciarTest}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
                  >
                    Repetir Test
                  </button>
                </div>
              ) : (
                <div className="flex gap-4 w-full">
                  <Link
                    href="/formacion-delegado"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center font-medium"
                  >
                    Revisar Formación
                  </Link>
                  <button
                    onClick={reiniciarTest}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium"
                  >
                    Repetir Test
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const pregunta = preguntas[preguntaActual]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Test de Evaluación LOPIVI</h1>
              <p className="text-gray-600 mt-1">Usuario: {usuario.nombre} | Entidad: {usuario.entidad}</p>
            </div>
            <Link
              href="/formacion-delegado"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Volver a Formación
            </Link>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Pregunta {preguntaActual + 1} de {preguntas.length}
            </span>
            <span className="text-sm text-gray-600">
              Módulo {pregunta.modulo}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((preguntaActual + 1) / preguntas.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contenido de la pregunta */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {pregunta.pregunta}
          </h2>

          <div className="space-y-3">
            {pregunta.opciones.map((opcion, index) => (
              <button
                key={index}
                onClick={() => seleccionarRespuesta(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  respuestaSeleccionada === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                    respuestaSeleccionada === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {respuestaSeleccionada === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                  <span className="ml-2">{opcion}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => {
                if (preguntaActual > 0) {
                  setPreguntaActual(preguntaActual - 1)
                  setRespuestaSeleccionada(
                    typeof respuestas[preguntaActual - 1] === 'number'
                      ? respuestas[preguntaActual - 1]
                      : null
                  )
                }
              }}
              disabled={preguntaActual === 0}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <button
              onClick={siguientePregunta}
              disabled={respuestaSeleccionada === null}
              className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {preguntaActual === preguntas.length - 1 ? 'Finalizar Test' : 'Siguiente'}
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">Información del Test</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Necesita un 75% de aciertos para aprobar</li>
            <li>• Puede repetir el test si no aprueba</li>
            <li>• Cada pregunta tiene una sola respuesta correcta</li>
            <li>• Puede volver a preguntas anteriores antes de finalizar</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
