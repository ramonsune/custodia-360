'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

interface Pregunta {
  id: number;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
}

// Pool de preguntas disponibles
const poolPreguntas: Pregunta[] = [
  {
    id: 1,
    pregunta: "¿Cuál es el objetivo principal de la LOPIVI?",
    opciones: [
      "Regular el uso de internet por menores",
      "Proteger a la infancia y adolescencia frente a la violencia",
      "Establecer normas de conducta en centros educativos",
      "Regular la adopción de menores"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 2,
    pregunta: "¿Qué debe hacer un delegado de protección ante una sospecha de maltrato?",
    opciones: [
      "Investigar por su cuenta antes de comunicarlo",
      "Comunicar inmediatamente a las autoridades competentes",
      "Esperar a tener pruebas concluyentes",
      "Hablar primero con la familia"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 3,
    pregunta: "¿Cuál es el plazo máximo para comunicar una situación de riesgo a servicios sociales?",
    opciones: [
      "Una semana",
      "72 horas",
      "24 horas",
      "Inmediatamente"
    ],
    respuestaCorrecta: 2
  },
  {
    id: 4,
    pregunta: "¿Qué tipos de violencia reconoce la LOPIVI?",
    opciones: [
      "Solo maltrato físico y psicológico",
      "Maltrato físico, psicológico, negligencia, abuso sexual, violencia de género y corrupción",
      "Únicamente abuso sexual",
      "Solo negligencia y maltrato físico"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 5,
    pregunta: "¿Es obligatorio designar un delegado de protección en todas las entidades que trabajen con menores?",
    opciones: [
      "No, es opcional",
      "Solo en centros educativos",
      "Sí, es obligatorio según la LOPIVI",
      "Solo si hay más de 50 menores"
    ],
    respuestaCorrecta: 2
  },
  {
    id: 6,
    pregunta: "¿Qué debe incluir un protocolo de actuación según la LOPIVI?",
    opciones: [
      "Solo procedimientos de emergencia",
      "Procedimientos de prevención, detección, actuación, comunicación y apoyo",
      "Únicamente medidas disciplinarias",
      "Solo formación del personal"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 7,
    pregunta: "¿Cuándo debe comunicarse directamente a la Fiscalía de Menores?",
    opciones: [
      "En todos los casos de sospecha",
      "Solo cuando hay lesiones físicas",
      "En casos de abuso sexual, maltrato grave, negligencia con riesgo vital",
      "Nunca, siempre a servicios sociales primero"
    ],
    respuestaCorrecta: 2
  },
  {
    id: 8,
    pregunta: "¿Qué principio debe guiar todas las actuaciones de protección?",
    opciones: [
      "La rapidez de la intervención",
      "El interés superior del menor",
      "La comodidad de la familia",
      "El coste económico de las medidas"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 9,
    pregunta: "¿Qué debe hacer un delegado si observa indicadores físicos de maltrato?",
    opciones: [
      "Fotografiar las lesiones inmediatamente",
      "Registrar objetivamente sin interpretar, no fotografiar",
      "Confrontar directamente al presunto agresor",
      "Esperar a que se repita para estar seguro"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 10,
    pregunta: "¿Cómo debe documentarse una situación de riesgo?",
    opciones: [
      "Con interpretaciones y conclusiones propias",
      "Solo con fotos y videos",
      "De forma objetiva, con hechos observables, fecha, hora y circunstancias",
      "Con opiniones de otros familiares"
    ],
    respuestaCorrecta: 2
  },
  {
    id: 11,
    pregunta: "¿Qué se debe hacer cuando un menor revela una situación de maltrato?",
    opciones: [
      "Hacer muchas preguntas para obtener detalles",
      "Prometer confidencialidad absoluta",
      "Escuchar sin preguntas dirigidas, no prometer confidencialidad absoluta",
      "Confrontar inmediatamente a la familia"
    ],
    respuestaCorrecta: 2
  },
  {
    id: 12,
    pregunta: "¿Cuánto tiempo deben conservarse los registros de casos de protección?",
    opciones: [
      "1 año",
      "Según la gravedad: de 5 a 25 años",
      "Para siempre",
      "Solo mientras el menor sea menor de edad"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 13,
    pregunta: "¿Qué debe incluir la formación mínima del personal según LOPIVI?",
    opciones: [
      "Solo normativa legal",
      "Derechos de la infancia, indicadores de maltrato, protocolos, comunicación y ética",
      "Únicamente primeros auxilios",
      "Solo técnicas de comunicación"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 14,
    pregunta: "¿Qué medidas de protección inmediata puede adoptar un delegado?",
    opciones: [
      "Supervisión cercana, evitar situaciones de riesgo, modificar rutinas si es necesario",
      "Prohibir el acceso de los padres",
      "Llamar directamente a la policía siempre",
      "Trasladar al menor a otro centro"
    ],
    respuestaCorrecta: 0
  },
  {
    id: 15,
    pregunta: "¿Qué debe hacer si los servicios sociales no responden adecuadamente?",
    opciones: [
      "Aceptar la situación y no hacer nada más",
      "Solicitar aclaraciones, elevar a superior jerárquico, comunicar a Fiscalía si es grave",
      "Manejar el caso internamente",
      "Esperar indefinidamente"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 16,
    pregunta: "¿Cómo debe ser la coordinación con otros profesionales?",
    opciones: [
      "No es necesaria la coordinación",
      "Solo cuando lo soliciten otros",
      "Activa, aportando información específica y cumpliendo compromisos",
      "Únicamente por escrito"
    ],
    respuestaCorrecta: 2
  },
  {
    id: 17,
    pregunta: "¿Qué debe contener un expediente individual de caso?",
    opciones: [
      "Solo los datos del menor",
      "Ficha del menor, cronología, comunicaciones, informes, medidas adoptadas y seguimiento",
      "Únicamente las comunicaciones enviadas",
      "Solo las medidas adoptadas"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 18,
    pregunta: "¿Cuándo está justificado separar temporalmente a un menor de su familia?",
    opciones: [
      "Ante cualquier sospecha",
      "Solo cuando hay riesgo inmediato y grave para su seguridad",
      "Cuando los padres no colaboren",
      "Siempre que haya una denuncia"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 19,
    pregunta: "¿Qué debe hacer un delegado ante un caso complejo que supera sus competencias?",
    opciones: [
      "Manejarlo solo para ganar experiencia",
      "Ignorarlo hasta que se resuelva",
      "Solicitar apoyo especializado y coordinarse con otros profesionales",
      "Derivarlo sin más seguimiento"
    ],
    respuestaCorrecta: 2
  },
  {
    id: 20,
    pregunta: "¿Cuál es la puntuación mínima para considerar aprobado este test según estándares LOPIVI?",
    opciones: [
      "50%",
      "60%",
      "75%",
      "80%"
    ],
    respuestaCorrecta: 2
  },
  {
    id: 21,
    pregunta: "¿Qué principio debe regir toda intervención en protección infantil?",
    opciones: [
      "La eficiencia económica",
      "El interés superior del menor",
      "La satisfacción de los padres",
      "La rapidez de resolución"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 22,
    pregunta: "¿Cuándo es obligatorio designar un delegado de protección?",
    opciones: [
      "Solo si hay más de 100 menores",
      "En todas las entidades que trabajen habitualmente con menores",
      "Solo en centros de acogida",
      "Solo si lo requiere la inspección"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 23,
    pregunta: "¿Qué debe contener como mínimo un Plan de Protección?",
    opciones: [
      "Solo los datos de contacto del delegado",
      "Análisis de riesgos, medidas preventivas, protocolos y formación",
      "Únicamente las normas disciplinarias",
      "Solo información sobre seguros"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 24,
    pregunta: "¿Qué se considera indicador físico de posible maltrato?",
    opciones: [
      "Lesiones coherentes con actividad deportiva",
      "Hematomas en diferentes estadios de curación en zonas no expuestas",
      "Rasguños en manos por juego",
      "Pequeños moretones en espinillas"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 25,
    pregunta: "¿Cómo debe documentarse una observación de riesgo?",
    opciones: [
      "Con interpretaciones y conclusiones personales",
      "Solo si hay evidencias físicas",
      "De forma objetiva, con hechos observables, fecha y hora",
      "Únicamente con fotografías"
    ],
    respuestaCorrecta: 2
  },
  {
    id: 26,
    pregunta: "¿Qué hacer si un menor revela una situación de abuso?",
    opciones: [
      "Hacer muchas preguntas para obtener detalles",
      "Prometer que no se lo dirás a nadie",
      "Escuchar sin preguntas dirigidas y no prometer confidencialidad absoluta",
      "Confrontar inmediatamente al presunto agresor"
    ],
    respuestaCorrecta: 2
  },
  {
    id: 27,
    pregunta: "¿Cuál es la frecuencia mínima de formación del personal?",
    opciones: [
      "Una vez al año",
      "Solo al incorporarse",
      "Cada cinco años",
      "Formación inicial y actualización continua según necesidades"
    ],
    respuestaCorrecta: 3
  },
  {
    id: 28,
    pregunta: "¿Qué entidades deben coordinar en protección infantil?",
    opciones: [
      "Solo servicios sociales",
      "Servicios sociales, sanitarios, educativos, policiales y judiciales",
      "Únicamente policía y servicios sociales",
      "Solo la entidad donde trabaja el menor"
    ],
    respuestaCorrecta: 1
  },
  {
    id: 29,
    pregunta: "¿Cuánto tiempo deben conservarse los registros de casos graves?",
    opciones: [
      "Un año",
      "Cinco años",
      "Hasta 25 años o más según gravedad",
      "Solo mientras el menor sea menor de edad"
    ],
    respuestaCorrecta: 2
  },
  {
    id: 30,
    pregunta: "¿Qué debe hacer el delegado si detecta una situación de riesgo grave?",
    opciones: [
      "Esperar a tener más información",
      "Comunicarlo inmediatamente siguiendo el protocolo establecido",
      "Intentar resolverlo internamente primero",
      "Consultar únicamente con la dirección"
    ],
    respuestaCorrecta: 1
  }
];

// Función para seleccionar preguntas aleatorias
function seleccionarPreguntasAleatorias(pool: Pregunta[], cantidad: number): Pregunta[] {
  const preguntasSeleccionadas = [...pool];

  // Algoritmo de Fisher-Yates para mezclar
  for (let i = preguntasSeleccionadas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [preguntasSeleccionadas[i], preguntasSeleccionadas[j]] = [preguntasSeleccionadas[j], preguntasSeleccionadas[i]];
  }

  return preguntasSeleccionadas.slice(0, cantidad);
}

export default function TestDelegadoPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [preguntasTest, setPreguntasTest] = useState<Pregunta[]>([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<number[]>([]);
  const [testCompletado, setTestCompletado] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [tiempoInicio] = useState(Date.now());

  useEffect(() => {
    // Verificar sesión del login de delegados
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);
        setUsuario(userData);

        // Generar preguntas aleatorias para este test (20 preguntas)
        const preguntasAleatorias = seleccionarPreguntasAleatorias(poolPreguntas, 20);
        setPreguntasTest(preguntasAleatorias);
        setRespuestas(new Array(20).fill(-1));

      } catch (error) {
        console.error('Error loading session:', error);
        router.push('/login-delegados');
      }
    } else {
      router.push('/login-delegados');
    }
    setLoading(false);
  }, [router]);

  const seleccionarRespuesta = (respuesta: number) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[preguntaActual] = respuesta;
    setRespuestas(nuevasRespuestas);
  };

  const siguientePregunta = () => {
    if (preguntaActual < preguntasTest.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      finalizarTest();
    }
  };

  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
    }
  };

  const finalizarTest = () => {
    let correctas = 0;
    respuestas.forEach((respuesta, index) => {
      if (respuesta === preguntasTest[index].respuestaCorrecta) {
        correctas++;
      }
    });

    const puntuacionFinal = Math.round((correctas / preguntasTest.length) * 100);
    setPuntuacion(puntuacionFinal);
    setTestCompletado(true);
    setMostrarResultados(true);

    // Guardar resultado en localStorage
    const tiempoTotal = Math.round((Date.now() - tiempoInicio) / 1000 / 60); // minutos
    const resultadoTest = {
      puntuacion: puntuacionFinal,
      fecha: new Date().toISOString(),
      tiempoEmpleado: tiempoTotal,
      aprobado: puntuacionFinal >= 75
    };

    localStorage.setItem('resultadoTestDelegado', JSON.stringify(resultadoTest));
  };

  const repetirTest = () => {
    setPreguntaActual(0);
    setRespuestas(new Array(20).fill(-1));
    setTestCompletado(false);
    setMostrarResultados(false);
    setPuntuacion(0);
  };

  const irAlCertificado = () => {
    // Marcar formación como completada
    if (usuario) {
      const usuarioActualizado = {
        ...usuario,
        formacionCompletada: true,
        certificacionVigente: true
      };
      localStorage.setItem('userSession', JSON.stringify(usuarioActualizado));
    }
    router.push('/certificado-delegado');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2563EB]"></div>
          <p className="mt-4 text-gray-600">Cargando test...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  if (mostrarResultados) {
    const aprobado = puntuacion >= 75;

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`p-6 text-white ${aprobado ? 'bg-green-600' : 'bg-red-600'}`}>
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">
                  {aprobado ? '¡Felicitaciones!' : 'Resultado Insuficiente'}
                </h1>
                <p className="text-xl">
                  {aprobado ? 'Has aprobado el test de evaluación' : 'Necesitas aprobar para obtener la certificación'}
                </p>
              </div>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className={`text-6xl font-bold mb-4 ${aprobado ? 'text-green-600' : 'text-red-600'}`}>
                  {puntuacion}%
                </div>
                <p className="text-gray-600 text-lg">
                  {aprobado ? 'Puntuación aprobatoria (mínimo 75%)' : 'Puntuación insuficiente (mínimo requerido: 75%)'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Detalles del Test:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Preguntas correctas:</span>
                    <span className="font-medium ml-2">{Math.round((puntuacion / 100) * 20)} de 20</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tiempo empleado:</span>
                    <span className="font-medium ml-2">{Math.round((Date.now() - tiempoInicio) / 1000 / 60)} minutos</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium ml-2">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Usuario:</span>
                    <span className="font-medium ml-2">{usuario.nombre}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                {aprobado ? (
                  <button
                    onClick={irAlCertificado}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Obtener Certificado →
                  </button>
                ) : (
                  <button
                    onClick={repetirTest}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Repetir Test
                  </button>
                )}

                <button
                  onClick={() => router.push('/formacion-delegado')}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Revisar Formación
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pregunta = preguntasTest[preguntaActual];
  const respuestaSeleccionada = respuestas[preguntaActual];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Test de Evaluación LOPIVI
              </h1>
              <p className="text-gray-600 mt-1">
                {usuario.nombre} - {usuario.entidad}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Pregunta</p>
              <p className="text-xl font-bold text-blue-600">
                {preguntaActual + 1} / {preguntasTest.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((preguntaActual + 1) / preguntasTest.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {pregunta.pregunta}
              </h2>

              <div className="space-y-3">
                {pregunta.opciones.map((opcion, index) => (
                  <button
                    key={index}
                    onClick={() => seleccionarRespuesta(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      respuestaSeleccionada === index
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        respuestaSeleccionada === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {respuestaSeleccionada === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                      <span className="ml-2">{opcion}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center border-t pt-6">
              <button
                onClick={preguntaAnterior}
                disabled={preguntaActual === 0}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
              >
                ← Anterior
              </button>

              <div className="text-sm text-gray-600">
                Respuestas completadas: {respuestas.filter(r => r !== -1).length} / {preguntasTest.length}
              </div>

              <button
                onClick={siguientePregunta}
                disabled={respuestaSeleccionada === -1}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
              >
                {preguntaActual === preguntasTest.length - 1 ? 'Finalizar Test' : 'Siguiente →'}
              </button>
            </div>
          </div>
        </div>

        {/* Test Info */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Información del Test:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• <strong>Duración:</strong> Sin límite de tiempo</p>
            <p>• <strong>Puntuación mínima:</strong> 75% (15 respuestas correctas)</p>
            <p>• <strong>Intentos:</strong> Puedes repetir el test si no lo apruebas</p>
            <p>• <strong>Certificación:</strong> Al aprobar obtendrás tu certificado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
