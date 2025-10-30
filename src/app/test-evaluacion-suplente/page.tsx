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

export default function TestEvaluacionSuplentePage() {
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
        pregunta: "¿Cuál es la principal función de un delegado suplente según la LOPIVI?",
        opciones: [
          "Sustituir al delegado principal únicamente en vacaciones",
          "Apoyar y coordinar con el delegado principal, y actuar con plena autoridad cuando sea necesario",
          "Realizar únicamente tareas administrativas",
          "Supervisar solo las actividades menos importantes"
        ],
        respuestaCorrecta: 1,
        explicacion: "El delegado suplente debe apoyar activamente al principal y estar preparado para actuar con plena autoridad cuando la situación lo requiera.",
        categoria: "Rol del Suplente"
      },
      {
        id: 2,
        pregunta: "¿Cuándo debe activarse automáticamente el delegado suplente?",
        opciones: [
          "Solo cuando el delegado principal está de vacaciones",
          "Cuando hay ausencia del principal, situaciones de emergencia o sobrecarga de trabajo",
          "Únicamente los fines de semana",
          "Solo si el delegado principal lo autoriza explícitamente"
        ],
        respuestaCorrecta: 1,
        explicacion: "El suplente debe activarse en múltiples situaciones para garantizar la protección continua, sin necesidad de autorización previa.",
        categoria: "Protocolos de Activación"
      }
    ];

    // Preguntas específicas por tipo de entidad para suplentes
    if (tipoEntidad === 'deportivo') {
      preguntasBase.push(
        {
          id: 3,
          pregunta: "En una competición deportiva, si detecta una situación de riesgo y el delegado principal no está disponible, ¿qué debe hacer?",
          opciones: [
            "Esperar a que regrese el delegado principal",
            "Actuar inmediatamente con plena autoridad aplicando el protocolo de protección",
            "Consultar primero con los entrenadores",
            "Solo documentar la situación para informar después"
          ],
          respuestaCorrecta: 1,
          explicacion: "El delegado suplente debe actuar con la misma autoridad que el principal en situaciones de riesgo, sin demoras.",
          categoria: "Gestión en Eventos Deportivos"
        },
        {
          id: 4,
          pregunta: "¿Cómo debe coordinarse un suplente con el equipo técnico deportivo?",
          opciones: [
            "Solo comunicarse a través del delegado principal",
            "Establecer canales de comunicación directa y clara sobre protocolos de protección",
            "Evitar la comunicación directa para no interferir",
            "Solo intervenir en situaciones extremas"
          ],
          respuestaCorrecta: 1,
          explicacion: "La coordinación directa y efectiva con el equipo técnico es esencial para la protección integral en el ámbito deportivo.",
          categoria: "Coordinación Deportiva"
        }
      );
    } else {
      preguntasBase.push(
        {
          id: 3,
          pregunta: "Durante un campamento de ocio, si el delegado principal se enferma, ¿cuál es su responsabilidad como suplente?",
          opciones: [
            "Informar a los padres y suspender las actividades",
            "Asumir inmediatamente todas las responsabilidades del delegado principal",
            "Delegar en los monitores hasta que el principal se recupere",
            "Solo supervisar las actividades más importantes"
          ],
          respuestaCorrecta: 1,
          explicacion: "El suplente debe asumir inmediatamente todas las responsabilidades para garantizar la protección continua durante actividades de ocio.",
          categoria: "Gestión en Actividades de Ocio"
        },
        {
          id: 4,
          pregunta: "¿Cómo debe gestionar la coordinación con monitores de tiempo libre como delegado suplente?",
          opciones: [
            "Mantener la misma autoridad que el principal y coordinar efectivamente",
            "Solo dar instrucciones cuando sea absolutamente necesario",
            "Esperar indicaciones del delegado principal para actuar",
            "Delegar toda la responsabilidad en el monitor senior"
          ],
          respuestaCorrecta: 0,
          explicacion: "El suplente debe ejercer la misma autoridad y coordinación efectiva que el principal con todo el equipo de monitores.",
          categoria: "Coordinación en Ocio"
        }
      );
    }

    // Preguntas comunes sobre coordinación y trabajo en equipo
    preguntasBase.push(
      {
        id: 5,
        pregunta: "¿Con qué frecuencia debe mantener comunicación con el delegado principal?",
        opciones: [
          "Solo cuando hay problemas graves",
          "Regularmente según el protocolo establecido y siempre que sea necesario",
          "Una vez al mes como mínimo",
          "Solo cuando el principal lo solicite"
        ],
        respuestaCorrecta: 1,
        explicacion: "La comunicación regular y sistemática es fundamental para el trabajo en equipo efectivo y la protección continua.",
        categoria: "Comunicación"
      },
      {
        id: 6,
        pregunta: "Si hay discrepancia de criterio con el delegado principal sobre un caso, ¿cuál es el procedimiento correcto?",
        opciones: [
          "Siempre seguir el criterio del principal sin cuestionar",
          "Discutir profesionalmente, documentar ambas perspectivas y buscar consenso priorizando el interés del menor",
          "Imponer su criterio como suplente",
          "Derivar la decisión a la dirección de la entidad"
        ],
        respuestaCorrecta: 1,
        explicacion: "El trabajo en equipo requiere diálogo profesional y búsqueda de consenso, siempre priorizando el interés superior del menor.",
        categoria: "Resolución de Conflictos"
      },
      {
        id: 7,
        pregunta: "¿Qué información debe estar siempre disponible para el delegado suplente?",
        opciones: [
          "Solo la información básica de contacto",
          "Acceso completo a casos activos, protocolos, contactos de emergencia y documentación relevante",
          "Únicamente los casos menos graves",
          "Solo la información que el principal decida compartir"
        ],
        respuestaCorrecta: 1,
        explicacion: "El suplente debe tener acceso completo a toda la información necesaria para actuar eficazmente cuando sea requerido.",
        categoria: "Gestión de Información"
      },
      {
        id: 8,
        pregunta: "¿Cuál es la responsabilidad del suplente en la formación del personal?",
        opciones: [
          "No participar en formaciones, es responsabilidad exclusiva del principal",
          "Apoyar activamente en formaciones y poder impartirlas cuando sea necesario",
          "Solo observar las formaciones sin participar",
          "Formar únicamente al personal de menor rango"
        ],
        respuestaCorrecta: 1,
        explicacion: "El suplente debe estar preparado para colaborar en formaciones y liderarlas cuando la situación lo requiera.",
        categoria: "Formación del Personal"
      },
      {
        id: 9,
        pregunta: "En una situación de emergencia con múltiples menores afectados, ¿cómo debe actuar el suplente si está solo?",
        opciones: [
          "Esperar instrucciones del delegado principal",
          "Activar inmediatamente todos los protocolos de emergencia y coordinar la respuesta",
          "Gestionar solo los casos más graves",
          "Delegar toda la responsabilidad en otros profesionales presentes"
        ],
        respuestaCorrecta: 1,
        explicacion: "En emergencias, el suplente debe actuar con plena autoridad y activar todos los protocolos necesarios sin demora.",
        categoria: "Gestión de Crisis"
      },
      {
        id: 10,
        pregunta: "¿Cómo debe documentar sus actuaciones el delegado suplente?",
        opciones: [
          "Solo documentar cuando el principal lo solicite",
          "Mantener registro completo de todas sus intervenciones y coordinar la documentación con el principal",
          "Documentar únicamente los casos graves",
          "La documentación es responsabilidad exclusiva del principal"
        ],
        respuestaCorrecta: 1,
        explicacion: "El suplente debe mantener documentación completa y coordinada para garantizar continuidad y transparencia en la gestión.",
        categoria: "Documentación"
      }
    );

    return preguntasBase;
  };

  useEffect(() => {
    const verificarAcceso = () => {
      try {
        const sessionFormacion = localStorage.getItem('formacion_lopivi_session');
        const sessionAntigua = localStorage.getItem('userSession');
        const progresoModulos = localStorage.getItem('progreso_modulos_suplente');

        // Verificar que haya completado los módulos
        if (!progresoModulos || parseInt(progresoModulos) < 8) {
          router.push('/modulos-formacion-suplente');
          return;
        }

        if (sessionFormacion) {
          const userData = JSON.parse(sessionFormacion);
          if (userData.tipo !== 'suplente') {
            router.push('/test-evaluacion-principal');
            return;
          }
          setUsuario(userData);
        } else {
          const nuevoUsuario = {
            id: 'nuevo-suplente-' + Date.now(),
            nombre: 'Nuevo Delegado Suplente',
            email: 'suplente@entidad.com',
            tipo: 'suplente',
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
          localStorage.setItem('test_suplente_aprobado', 'true');
          localStorage.setItem('test_suplente_puntuacion', correctas.toString());
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
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
                  Has demostrado un conocimiento sólido de coordinación y trabajo en equipo para delegados suplentes
                  en entidades {entidadTipo === 'deportivo' ? 'deportivas' : 'de ocio'}.
                  Puedes proceder al siguiente paso.
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-red-800 mb-2">Necesitas estudiar más</h3>
                <p className="text-red-700">
                  Te recomendamos revisar los módulos de formación especializada para suplentes antes de intentar nuevamente.
                  Necesitas al menos 70% para aprobar.
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
                  className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
                >
                  Intentar Nuevamente
                </button>
              )}

              <Link
                href="/modulos-formacion-suplente"
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
      <div className="bg-gradient-to-r from-orange-600 to-purple-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-white">
              <h1 className="text-3xl font-bold">Test de Evaluación Custodia360</h1>
              <p className="text-orange-100 mt-2 text-lg">
                Delegado Suplente | {entidadNombre}
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
              className="bg-gradient-to-r from-orange-600 to-purple-600 h-2 rounded-full transition-all duration-300"
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
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <span className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    respuestaSeleccionada === index
                      ? 'border-orange-500 bg-orange-500'
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
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
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
            href="/modulos-formacion-suplente"
            className="text-gray-600 hover:text-gray-800"
          >
            ← Volver a Módulos de Formación
          </Link>
        </div>
      </div>
    </div>
  );
}
