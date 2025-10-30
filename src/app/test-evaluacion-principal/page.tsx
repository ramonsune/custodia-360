'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  tipo: string;
  entidad: {
    id: string;
    nombre: string;
    tipo_entidad: string;
    plan: string;
  } | string;
}

interface Pregunta {
  id: number;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion: string;
  categoria: string;
}

export default function TestEvaluacionPrincipalPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [preguntaActual, setPreguntaActual] = useState<number>(0);
  const [respuestas, setRespuestas] = useState<number[]>([]);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<number | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState<boolean>(false);
  const [testCompletado, setTestCompletado] = useState<boolean>(false);
  const [puntuacion, setPuntuacion] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [preguntasMezcladas, setPreguntasMezcladas] = useState<Pregunta[]>([]);

  // Función para mezclar las opciones de cada pregunta
  const mezclarOpciones = (preguntas: Pregunta[]): Pregunta[] => {
    return preguntas.map((pregunta) => {
      const opcionesConIndice = pregunta.opciones.map((opcion, index) => ({
        texto: opcion,
        esCorrecta: index === pregunta.respuestaCorrecta
      }));

      // Crear un generador de números pseudoaleatorios basado en el ID de la pregunta
      let seed = pregunta.id * 12345; // Seed determinístico por pregunta
      const seededRandom = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      // Implementar Fisher-Yates shuffle con seed
      const opcionesMezcladas = [...opcionesConIndice];
      for (let i = opcionesMezcladas.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [opcionesMezcladas[i], opcionesMezcladas[j]] = [opcionesMezcladas[j], opcionesMezcladas[i]];
      }

      // Encontrar la nueva posición de la respuesta correcta
      const nuevaRespuestaCorrecta = opcionesMezcladas.findIndex(opcion => opcion.esCorrecta);

      return {
        ...pregunta,
        opciones: opcionesMezcladas.map(opcion => opcion.texto),
        respuestaCorrecta: nuevaRespuestaCorrecta
      };
    });
  };

  const getPreguntasPorEntidad = (tipoEntidad: string): Pregunta[] => {
    const preguntasBase: Pregunta[] = [
      {
        id: 1,
        pregunta: "¿Cuál es la principal responsabilidad del delegado de protección según la LOPIVI?",
        opciones: [
          "Supervisar únicamente las actividades deportivas",
          "Garantizar el cumplimiento de las medidas de protección integral de menores",
          "Organizar eventos y competiciones",
          "Gestionar únicamente la documentación administrativa"
        ],
        respuestaCorrecta: 1, // B
        explicacion: "El delegado de protección es responsable de garantizar el cumplimiento de todas las medidas de protección integral establecidas por la LOPIVI.",
        categoria: "Fundamentos LOPIVI"
      },
      {
        id: 2,
        pregunta: `En una entidad ${tipoEntidad === 'deportivo' ? 'deportiva' : 'de ocio'}, ¿qué debe hacer un delegado principal si detecta indicios de maltrato?`,
        opciones: [
          "Activar inmediatamente el protocolo de protección y notificar a las autoridades competentes",
          "Esperar a tener pruebas definitivas antes de actuar",
          "Hablar únicamente con los padres del menor",
          "Documentar la situación pero no actuar hasta la próxima reunión"
        ],
        respuestaCorrecta: 0, // A
        explicacion: "Ante cualquier indicio de maltrato, el delegado debe activar inmediatamente el protocolo de protección y notificar a las autoridades competentes sin demora.",
        categoria: "Protocolos de Actuación"
      },
      {
        id: 3,
        pregunta: "¿Cuál es el principio fundamental que debe regir todas las decisiones del delegado de protección?",
        opciones: [
          "La voluntad de los padres",
          "Las decisiones de la dirección",
          "El interés superior del menor",
          "El prestigio de la entidad"
        ],
        respuestaCorrecta: 2, // C
        explicacion: "El interés superior del menor es el principio rector que debe prevalecer sobre cualquier otra consideración.",
        categoria: "Principios Fundamentales"
      },
      {
        id: 4,
        pregunta: "¿Con qué frecuencia mínima deben revisarse los protocolos de protección?",
        opciones: [
          "Cada 5 años",
          "Solo cuando hay incidencias",
          "Cada 6 meses obligatoriamente",
          "Anualmente o cuando cambien las circunstancias"
        ],
        respuestaCorrecta: 3, // D
        explicacion: "Los protocolos deben revisarse anualmente como mínimo y siempre que cambien las circunstancias que los motivaron.",
        categoria: "Mejora Continua"
      },
      {
        id: 5,
        pregunta: "¿Cuál es la diferencia principal entre el rol del delegado principal y el suplente?",
        opciones: [
          "El principal toma decisiones ejecutivas y coordina, el suplente apoya y sustituye cuando es necesario",
          "No hay diferencias, ambos tienen las mismas funciones",
          "El suplente solo se ocupa de la documentación",
          "El principal solo supervisa, el suplente ejecuta"
        ],
        respuestaCorrecta: 0, // A
        explicacion: "El delegado principal tiene responsabilidad ejecutiva y de coordinación, mientras el suplente apoya y puede sustituir con plena autoridad cuando sea necesario.",
        categoria: "Coordinación"
      },
      {
        id: 6,
        pregunta: "¿Qué información debe incluir obligatoriamente un informe de incidencia?",
        opciones: [
          "Solo la descripción del incidente",
          "Únicamente los nombres de los implicados",
          "Fecha, hora, lugar, personas involucradas, descripción detallada, medidas adoptadas y seguimiento",
          "Solo las medidas que se van a tomar"
        ],
        respuestaCorrecta: 2, // C
        explicacion: "Un informe de incidencia debe ser completo e incluir todos los elementos necesarios para el seguimiento y las decisiones posteriores.",
        categoria: "Documentación"
      },
      {
        id: 7,
        pregunta: "¿Cuándo debe activarse el protocolo de comunicación con autoridades externas?",
        opciones: [
          "Solo cuando hay certeza absoluta de maltrato",
          "Únicamente si los padres dan su consentimiento",
          "Solo al final del proceso interno de investigación",
          "Ante cualquier situación de riesgo grave o sospecha fundada de maltrato"
        ],
        respuestaCorrecta: 3, // D
        explicacion: "La comunicación con autoridades debe activarse ante riesgo grave o sospecha fundada, sin esperar certeza absoluta ni consentimiento de terceros.",
        categoria: "Comunicación Externa"
      },
      {
        id: 8,
        pregunta: "¿Qué formación mínima debe tener el personal que trabaja directamente con menores?",
        opciones: [
          "Solo experiencia previa trabajando con menores",
          "Formación específica en protección infantil y actualización periódica",
          "Únicamente formación técnica en su especialidad",
          "No requiere formación específica"
        ],
        respuestaCorrecta: 1, // B
        explicacion: "Todo el personal que trabaja directamente con menores debe recibir formación específica en protección infantil y mantenerla actualizada.",
        categoria: "Formación del Personal"
      },
      {
        id: 9,
        pregunta: "¿Cuál es la acción correcta si hay conflicto entre la protección del menor y la voluntad de los padres?",
        opciones: [
          "Siempre seguir la voluntad de los padres",
          "Buscar un término medio que satisfaga a ambas partes",
          "Priorizar siempre el interés superior del menor",
          "Derivar la decisión a la dirección de la entidad"
        ],
        respuestaCorrecta: 2, // C
        explicacion: "El principio del interés superior del menor prevalece sobre cualquier otra consideración, incluyendo la voluntad de los padres.",
        categoria: "Principios Fundamentales"
      },
      {
        id: 10,
        pregunta: "¿Cuándo puede el delegado suplente tomar decisiones con plena autoridad?",
        opciones: [
          "Solo con autorización escrita del principal",
          "Únicamente en emergencias documentadas",
          "Nunca, solo puede asesorar",
          "Durante ausencias del principal o cuando la situación lo requiera"
        ],
        respuestaCorrecta: 3, // D
        explicacion: "El delegado suplente puede actuar con plena autoridad durante ausencias del principal o cuando la situación lo requiera para garantizar la protección.",
        categoria: "Coordinación"
      },
      {
        id: 11,
        pregunta: "¿Qué medida es prioritaria en la gestión de datos personales de menores?",
        opciones: [
          "Aplicar principios de confidencialidad y acceso restringido",
          "Compartir información libremente dentro de la entidad",
          "Permitir acceso a padres sin restricciones",
          "Almacenar toda la información en archivos físicos"
        ],
        respuestaCorrecta: 0, // A
        explicacion: "Los datos personales de menores requieren máxima confidencialidad y acceso restringido solo a personal autorizado y con necesidad de conocer.",
        categoria: "Protección de Datos"
      },
      {
        id: 12,
        pregunta: "¿Cuál es el procedimiento correcto ante una denuncia anónima de maltrato?",
        opciones: [
          "Ignorarla por falta de identificación del denunciante",
          "Investigar de manera discreta y profesional",
          "Confrontar inmediatamente al acusado",
          "Informar a los padres antes de cualquier acción"
        ],
        respuestaCorrecta: 1, // B
        explicacion: "Las denuncias anónimas deben investigarse de manera discreta y profesional, siguiendo los protocolos establecidos independientemente del origen.",
        categoria: "Investigación"
      },
      {
        id: 13,
        pregunta: "¿Cuándo debe documentarse por escrito una intervención del delegado?",
        opciones: [
          "Solo en casos graves",
          "Únicamente si hay consecuencias legales",
          "En todas las intervenciones, independientemente de su gravedad",
          "Solo cuando lo solicite la dirección"
        ],
        respuestaCorrecta: 2, // C
        explicacion: "Toda intervención del delegado debe documentarse por escrito para garantizar trazabilidad, seguimiento y evidencia de actuación.",
        categoria: "Documentación"
      },
      {
        id: 14,
        pregunta: "¿Qué debe hacer el delegado si observa comportamientos inadecuados de un compañero hacia menores?",
        opciones: [
          "Hablar directamente con el compañero informalmente",
          "Esperar a que alguien más lo reporte",
          "Informar solo a la dirección sin documentar",
          "Seguir el protocolo interno y documentar la situación"
        ],
        respuestaCorrecta: 3, // D
        explicacion: "Los comportamientos inadecuados hacia menores deben seguir el protocolo establecido y documentarse adecuadamente para proteger a los menores.",
        categoria: "Protocolos Internos"
      },
      {
        id: 15,
        pregunta: "¿Cuál es la responsabilidad del delegado en la comunicación con las familias sobre incidencias?",
        opciones: [
          "Comunicar de forma transparente y apropiada según la gravedad",
          "Informar solo los aspectos positivos",
          "No comunicar nada hasta resolver completamente el caso",
          "Delegar toda comunicación en la dirección"
        ],
        respuestaCorrecta: 0, // A
        explicacion: "La comunicación con familias debe ser transparente y apropiada según la gravedad, manteniendo siempre el interés superior del menor.",
        categoria: "Comunicación con Familias"
      }
    ];

    // Preguntas específicas por tipo de entidad
    if (tipoEntidad === 'deportivo') {
      preguntasBase[2] = {
        id: 3,
        pregunta: "En vestuarios deportivos, ¿cuál es la medida de protección más importante?",
        opciones: [
          "Permitir el acceso libre a todos los miembros",
          "Cerrar los vestuarios durante las competiciones",
          "Establecer horarios específicos y supervisión apropiada",
          "Solo permitir el acceso a entrenadores"
        ],
        respuestaCorrecta: 2, // C
        explicacion: "Los vestuarios requieren horarios específicos, supervisión apropiada y medidas que garanticen la privacidad y seguridad de los menores.",
        categoria: "Entornos Deportivos"
      };

      preguntasBase[3] = {
        id: 4,
        pregunta: "Durante un desplazamiento deportivo, ¿qué responsabilidad tiene el delegado principal?",
        opciones: [
          "Solo supervisar durante la competición",
          "Delegar toda la responsabilidad en los entrenadores",
          "Únicamente gestionar el transporte",
          "Garantizar la protección integral durante todo el desplazamiento"
        ],
        respuestaCorrecta: 3, // D
        explicacion: "El delegado principal debe garantizar la protección integral de los menores durante todo el desplazamiento, incluyendo alojamiento, comidas y tiempo libre.",
        categoria: "Desplazamientos Deportivos"
      };
    } else {
      preguntasBase[2] = {
        id: 3,
        pregunta: "En actividades de ocio al aire libre, ¿cuál es el protocolo de seguridad prioritario?",
        opciones: [
          "Permitir que los menores exploren libremente",
          "Solo supervisar durante las actividades organizadas",
          "Establecer límites claros, supervisión constante y procedimientos de emergencia",
          "Delegar la supervisión en monitores junior"
        ],
        respuestaCorrecta: 2, // C
        explicacion: "Las actividades al aire libre requieren límites claros, supervisión constante y procedimientos de emergencia bien definidos para garantizar la seguridad.",
        categoria: "Actividades de Ocio"
      };

      preguntasBase[3] = {
        id: 4,
        pregunta: "En un campamento de verano, ¿cómo debe gestionar el delegado principal la protección nocturna?",
        opciones: [
          "Los menores pueden autogestionar su seguridad",
          "Solo supervisar hasta las 22:00 horas",
          "Delegar completamente en los monitores",
          "Establecer turnos de supervisión, protocolos nocturnos y medidas de emergencia"
        ],
        respuestaCorrecta: 3, // D
        explicacion: "La protección nocturna requiere turnos de supervisión, protocolos específicos y medidas de emergencia 24/7 durante campamentos.",
        categoria: "Campamentos y Actividades Estivales"
      };
    }

    return preguntasBase;
  };

  useEffect(() => {
    const verificarAcceso = () => {
      try {
        const sessionFormacion = localStorage.getItem('formacion_lopivi_session');
        const sessionAntigua = localStorage.getItem('userSession');
        const progresoModulos = localStorage.getItem('progreso_modulos_principal_count');

        // Verificar que haya completado los módulos
        if (!progresoModulos || parseInt(progresoModulos) < 8) {
          router.push('/modulos-formacion');
          return;
        }

        if (sessionFormacion) {
          const userData = JSON.parse(sessionFormacion);
          if (userData.tipo !== 'principal') {
            router.push('/test-evaluacion-suplente');
            return;
          }
          setUsuario(userData);
        } else {
          const nuevoUsuario = {
            id: 'nuevo-delegado-' + Date.now(),
            nombre: 'Nuevo Delegado',
            email: 'delegado@entidad.com',
            tipo: 'principal',
            entidad: {
              id: 'entidad-demo',
              nombre: 'Mi Entidad',
              tipo_entidad: 'deportivo',
              plan: 'Plan formación'
            }
          };
          setUsuario(nuevoUsuario);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    verificarAcceso();
  }, [router]);

  // Efecto para mezclar las preguntas cuando se carga el usuario
  useEffect(() => {
    if (usuario && !loading) {
      const entidadTipo = typeof usuario.entidad === 'string' ? 'deportivo' : usuario.entidad.tipo_entidad;
      const preguntasOriginales = getPreguntasPorEntidad(entidadTipo);
      const preguntasConOpcionesMezcladas = mezclarOpciones(preguntasOriginales);
      setPreguntasMezcladas(preguntasConOpcionesMezcladas);
    }
  }, [usuario, loading]);

  const siguientePregunta = () => {
    if (respuestaSeleccionada !== null) {
      const nuevasRespuestas = [...respuestas, respuestaSeleccionada];
      setRespuestas(nuevasRespuestas);

      if (preguntaActual < preguntasMezcladas.length - 1) {
        setPreguntaActual(preguntaActual + 1);
        setRespuestaSeleccionada(null);
      } else {
        // Calcular puntuación
        const correctas = nuevasRespuestas.reduce((acc, respuesta, index) => {
          return acc + (respuesta === preguntasMezcladas[index].respuestaCorrecta ? 1 : 0);
        }, 0);

        setPuntuacion(correctas);
        setTestCompletado(true);

        // Guardar resultado - 75% para aprobar (12 de 15)
        if (correctas >= 12) {
          localStorage.setItem('test_principal_aprobado', 'true');
          localStorage.setItem('test_principal_puntuacion', correctas.toString());
        }
      }
    }
  };

  const reiniciarTest = () => {
    setPreguntaActual(0);
    setRespuestas([]);
    setRespuestaSeleccionada(null);
    setTestCompletado(false);
    setPuntuacion(0);
    setMostrarResultado(false);

    // Volver a mezclar las opciones
    if (usuario) {
      const entidadTipo = typeof usuario.entidad === 'string' ? 'deportivo' : usuario.entidad.tipo_entidad;
      const preguntasOriginales = getPreguntasPorEntidad(entidadTipo);
      const preguntasConOpcionesMezcladas = mezclarOpciones(preguntasOriginales);
      setPreguntasMezcladas(preguntasConOpcionesMezcladas);
    }
  };

  const irACertificado = () => {
    // Guardar resultado del test para el certificado
    if (usuario && puntuacion >= 12) {
      const resultadoTest = {
        puntuacion: puntuacion,
        fecha: new Date().toISOString(),
        tiempoEmpleado: 30, // minutos estimados
        aprobado: true
      };
      localStorage.setItem('resultadoTestDelegado', JSON.stringify(resultadoTest));
    }
    router.push('/certificado-delegado');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando test de evaluación...</p>
        </div>
      </div>
    );
  }

  if (!usuario || preguntasMezcladas.length === 0) return null;

  const entidadNombre = typeof usuario.entidad === 'string' ? usuario.entidad : usuario.entidad.nombre;
  const entidadTipo = typeof usuario.entidad === 'string' ? 'deportivo' : usuario.entidad.tipo_entidad;

  if (testCompletado) {
    const porcentaje = Math.round((puntuacion / preguntasMezcladas.length) * 100);
    const aprobado = puntuacion >= 12; // 75% para aprobar

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              aprobado ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <span className={`text-4xl ${aprobado ? 'text-green-600' : 'text-red-600'}`}>
                {aprobado ? '✓' : '✗'}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Test {aprobado ? 'Aprobado' : 'No Aprobado'}
            </h1>

            <div className="text-6xl font-bold mb-4 text-gray-900">
              {porcentaje}%
            </div>

            <p className="text-lg text-gray-600 mb-6">
              Has respondido correctamente {puntuacion} de {preguntasMezcladas.length} preguntas
            </p>

            {aprobado ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-800 mb-2">¡Excelente trabajo!</h3>
                <p className="text-green-700">
                  Has demostrado un conocimiento sólido de la LOPIVI y los protocolos de protección infantil
                  para entidades {entidadTipo === 'deportivo' ? 'deportivas' : 'de ocio'}.
                  Puedes proceder al siguiente paso.
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-red-800 mb-2">Necesitas estudiar más</h3>
                <p className="text-red-700">
                  Te recomendamos revisar los módulos de formación antes de intentar nuevamente.
                  Necesitas al menos 75% para aprobar.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {aprobado ? (
                <button
                  onClick={irACertificado}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  Continuar al Certificado
                </button>
              ) : (
                <button
                  onClick={reiniciarTest}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Intentar Nuevamente
                </button>
              )}

              <Link
                href="/modulos-formacion"
                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold text-center"
              >
                Revisar Módulos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pregunta = preguntasMezcladas[preguntaActual];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-white">
              <h1 className="text-3xl font-bold">Test de Evaluación Custodia360</h1>
              <p className="text-blue-100 mt-2 text-lg">
                Delegado Principal | {entidadNombre}
              </p>
            </div>
            <div className="text-right text-white">
              <p className="text-sm">Pregunta: <span className="font-semibold">{preguntaActual + 1}/{preguntasMezcladas.length}</span></p>
              <p className="text-sm">Progreso: <span className="font-semibold">{Math.round(((preguntaActual + 1) / preguntasMezcladas.length) * 100)}%</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Barra de progreso */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Pregunta {preguntaActual + 1} de {preguntasMezcladas.length}</h2>
            <span className="text-sm text-gray-600">{pregunta.categoria}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((preguntaActual + 1) / preguntasMezcladas.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Pregunta */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">{pregunta.pregunta}</h3>

          <div className="space-y-4">
            {pregunta.opciones.map((opcion, index) => (
              <button
                key={index}
                onClick={() => setRespuestaSeleccionada(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  respuestaSeleccionada === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <span className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    respuestaSeleccionada === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {respuestaSeleccionada === index && (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </span>
                  <span className="text-gray-700">{opcion}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <div>
              {preguntaActual > 0 && (
                <button
                  onClick={() => {
                    setPreguntaActual(preguntaActual - 1);
                    setRespuestaSeleccionada(respuestas[preguntaActual - 1] || null);
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  ← Anterior
                </button>
              )}
            </div>

            <button
              onClick={siguientePregunta}
              disabled={respuestaSeleccionada === null}
              className={`px-8 py-3 rounded-lg font-semibold ${
                respuestaSeleccionada !== null
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {preguntaActual === preguntasMezcladas.length - 1 ? 'Finalizar Test' : 'Siguiente →'}
            </button>
          </div>
        </div>

        {/* Navegación */}
        <div className="mt-8 text-center">
          <Link
            href="/modulos-formacion"
            className="text-gray-600 hover:text-gray-800"
          >
            ← Volver a Módulos de Formación
          </Link>
        </div>
      </div>
    </div>
  );
}
