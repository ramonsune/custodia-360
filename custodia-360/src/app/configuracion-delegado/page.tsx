'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  tipo: string;
  entidad: string;
  tipoEntidad?: string;
}

interface ConfiguracionState {
  canalComunicacion: {
    tipo: '' | 'email' | 'whatsapp';
    valor: string;
    configurado: boolean;
    pospuesto: boolean;
  };
  comunicacionEntidad: {
    linkGenerado: string;
    enviado: boolean;
  };
  antecedentesPenales: {
    subido: boolean;
    archivo: File | null;
    pospuesto: boolean;
  };
  mapaRiesgos: {
    leido: boolean;
    fechaLectura: string;
  };
}

export default function ConfiguracionDelegadoPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [configuracion, setConfiguracion] = useState<ConfiguracionState>({
    canalComunicacion: {
      tipo: '',
      valor: '',
      configurado: false,
      pospuesto: false
    },
    comunicacionEntidad: {
      linkGenerado: '',
      enviado: false
    },
    antecedentesPenales: {
      subido: false,
      archivo: null,
      pospuesto: false
    },
    mapaRiesgos: {
      leido: false,
      fechaLectura: ''
    }
  });

  const [pasoActual, setPasoActual] = useState(1);
  const [mostrarMapaRiesgos, setMostrarMapaRiesgos] = useState(false);

  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);
        setUsuario(userData);

        // Cargar configuración guardada si existe
        const configGuardada = localStorage.getItem(`configuracion_${userData.id}`);
        if (configGuardada) {
          setConfiguracion(JSON.parse(configGuardada));
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

  const guardarConfiguracion = (nuevaConfig: ConfiguracionState) => {
    setConfiguracion(nuevaConfig);
    if (usuario) {
      localStorage.setItem(`configuracion_${usuario.id}`, JSON.stringify(nuevaConfig));
    }
  };

  const configurarCanal = (tipo: 'email' | 'whatsapp', valor: string) => {
    const nuevaConfig = {
      ...configuracion,
      canalComunicacion: {
        tipo,
        valor,
        configurado: true,
        pospuesto: false
      }
    };
    guardarConfiguracion(nuevaConfig);
  };

  const posponerCanal = () => {
    const nuevaConfig = {
      ...configuracion,
      canalComunicacion: {
        ...configuracion.canalComunicacion,
        pospuesto: true
      }
    };
    guardarConfiguracion(nuevaConfig);
  };

  const generarLinkEntidad = () => {
    const link = `https://custodia360.com/comunicacion/${usuario?.id}/${Date.now()}`;
    const nuevaConfig = {
      ...configuracion,
      comunicacionEntidad: {
        linkGenerado: link,
        enviado: false
      }
    };
    guardarConfiguracion(nuevaConfig);
  };

  const marcarEnviado = () => {
    const nuevaConfig = {
      ...configuracion,
      comunicacionEntidad: {
        ...configuracion.comunicacionEntidad,
        enviado: true
      }
    };
    guardarConfiguracion(nuevaConfig);
  };

  const subirAntecedentes = (archivo: File) => {
    const nuevaConfig = {
      ...configuracion,
      antecedentesPenales: {
        subido: true,
        archivo,
        pospuesto: false
      }
    };
    guardarConfiguracion(nuevaConfig);
  };

  const posponerAntecedentes = () => {
    const nuevaConfig = {
      ...configuracion,
      antecedentesPenales: {
        ...configuracion.antecedentesPenales,
        pospuesto: true
      }
    };
    guardarConfiguracion(nuevaConfig);
  };

  const marcarMapaLeido = () => {
    const nuevaConfig = {
      ...configuracion,
      mapaRiesgos: {
        leido: true,
        fechaLectura: new Date().toISOString()
      }
    };
    guardarConfiguracion(nuevaConfig);
    setMostrarMapaRiesgos(false);
  };

  const generarPDFMapaRiesgos = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MAPA DE RIESGOS ESPECÍFICO', 105, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`${usuario?.entidad} - ${usuario?.tipoEntidad}`, 105, 23, { align: 'center' });

    // Contenido
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ANÁLISIS DE RIESGOS PARA SU ENTIDAD', 20, 45);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let yPos = 60;

    const contenido = [
      '1. RIESGOS ESPECÍFICOS IDENTIFICADOS:',
      '',
      '• Espacios con supervisión limitada (vestuarios, almacenes)',
      '  EJEMPLO: Menor cambiándose solo en vestuario',
      '  CÓMO ACTUAR: Implementar sistema de puertas abiertas, supervisión rotatoria',
      '',
      '• Interacciones uno-a-uno entre adultos y menores',
      '  EJEMPLO: Entrenamiento individual, tutoría privada',
      '  CÓMO ACTUAR: Siempre con puerta abierta, informar a otro adulto presente',
      '',
      '• Actividades que requieren contacto físico',
      '  EJEMPLO: Correcciones técnicas, primeros auxilios, apoyo físico',
      '  CÓMO ACTUAR: Explicar antes el contacto, presencia de otro adulto, documentar',
      '',
      '• Desplazamientos y actividades fuera de las instalaciones',
      '  EJEMPLO: Viajes a competiciones, excursiones, campamentos',
      '  CÓMO ACTUAR: Autorización familiar por escrito, supervisión 24/7, protocolos claros',
      '',
      '• Uso de tecnologías y redes sociales',
      '  EJEMPLO: Comunicación por WhatsApp, fotos de actividades, redes sociales',
      '  CÓMO ACTUAR: Canal oficial únicamente, prohibir comunicación privada',
      '',
      '2. MEDIDAS PREVENTIVAS OBLIGATORIAS:',
      '',
      '• Nunca estar a solas con un menor en espacios cerrados',
      '  EJEMPLO SITUACIÓN: Menor necesita hablar en privado',
      '  CÓMO ACTUAR: Usar espacio visible (ventana), puerta abierta, otro adulto cerca',
      '',
      '• Mantener puertas abiertas durante interacciones privadas',
      '  EJEMPLO SITUACIÓN: Consulta médica, conversación personal',
      '  CÓMO ACTUAR: Puerta entreabierta siempre, otro adulto informado y disponible',
      '',
      '• Informar a otro adulto sobre interacciones especiales',
      '  EJEMPLO SITUACIÓN: Menor requiere atención especial, apoyo emocional',
      '  CÓMO ACTUAR: Comunicar a compañero/supervisor antes y después del contacto',
      '',
      '• Documentar cualquier incidente o situación inusual',
      '  EJEMPLO SITUACIÓN: Menor se lastima, comportamiento extraño, conflicto',
      '  CÓMO ACTUAR: Registro inmediato por escrito, comunicar a delegado, informar familia',
      '',
      '• Respetar los límites físicos y emocionales de los menores',
      '  EJEMPLO SITUACIÓN: Menor rechaza contacto físico, se muestra incómodo',
      '  CÓMO ACTUAR: Respetar inmediatamente, buscar alternativas, documentar situación',
      '',
      '3. PROTOCOLOS DE COMUNICACIÓN:',
      '',
      '• Canal de comunicación oficial configurado',
      '  EJEMPLO PRÁCTICA: WhatsApp grupal para comunicaciones generales',
      '  CÓMO IMPLEMENTAR: Un solo canal oficial, prohibir comunicaciones privadas',
      '',
      '• Procedimientos claros de reporte de incidencias',
      '  EJEMPLO SITUACIÓN: Sospecha de maltrato, comportamiento inadecuado',
      '  CÓMO ACTUAR: Comunicación inmediata al delegado, documentación, no investigar',
      '',
      '• Coordinación con autoridades competentes',
      '  EJEMPLO CASO: Situación grave que requiere intervención externa',
      '  CÓMO PROCEDER: Delegado contacta servicios sociales/policía según protocolo',
      '',
      '• Comunicación transparente con familias',
      '  EJEMPLO PRÁCTICA: Informes regulares, comunicación de incidencias',
      '  CÓMO ACTUAR: Canal directo con familias, información oportuna y clara',
      '',
      '4. EVALUACIÓN CONTINUA:',
      '',
      '• Revisión mensual de medidas implementadas',
      '  EJEMPLO REUNIÓN: Análisis de efectividad de protocolos',
      '  CÓMO HACERLO: Reunión mensual equipo, revisar incidencias, ajustar medidas',
      '',
      '• Actualización según nuevos riesgos identificados',
      '  EJEMPLO SITUACIÓN: Nuevas actividades, cambios en instalaciones',
      '  CÓMO PROCEDER: Evaluar nuevos riesgos, actualizar protocolos, formar personal',
      '',
      '• Formación continua del personal',
      '  EJEMPLO PROGRAMA: Cursos trimestrales, casos prácticos',
      '  CÓMO IMPLEMENTAR: Cronograma formativo, evaluación competencias, certificación',
      '',
      '• Supervisión y mejora constante',
      '  EJEMPLO PRÁCTICA: Observación directa, feedback del personal',
      '  CÓMO EJECUTAR: Supervisión regular, mejora continua, reconocimiento buenas prácticas'
    ];

    contenido.forEach(linea => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      if (linea.startsWith('•')) {
        doc.setFont('helvetica', 'bold');
      } else if (linea.includes('EJEMPLO') || linea.includes('CÓMO')) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
      } else if (linea.includes(':')) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
      }

      doc.text(linea, 20, yPos);
      yPos += 4;
    });

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado para: ${usuario?.nombre} - ${new Date().toLocaleDateString()}`, 20, 285);
    doc.text('Custodia360 - Sistema de Protección Infantil', 150, 285);

    doc.save('Mapa_Riesgos_Custodia360.pdf');
  };

  const puedeAvanzarAlDashboard = () => {
    return (
      (configuracion.canalComunicacion.configurado || configuracion.canalComunicacion.pospuesto) &&
      configuracion.comunicacionEntidad.enviado &&
      (configuracion.antecedentesPenales.subido || configuracion.antecedentesPenales.pospuesto) &&
      configuracion.mapaRiesgos.leido
    );
  };

  const irAlDashboard = () => {
    if (puedeAvanzarAlDashboard()) {
      if (usuario?.tipo === 'suplente') {
        router.push('/dashboard-suplente');
      } else {
        router.push('/dashboard-delegado');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Configuración del Delegado
              </h1>
              <p className="text-gray-600 mt-1">
                Complete la configuración antes de acceder al dashboard
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Usuario: {usuario.nombre}</p>
              <p className="text-sm text-gray-500">{usuario.entidad}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((paso) => (
              <div key={paso} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  pasoActual >= paso ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {paso}
                </div>
                {paso < 4 && <div className="w-16 h-1 bg-gray-300 mx-2" />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Canal</span>
            <span>Comunicación</span>
            <span>Antecedentes</span>
            <span>Mapa Riesgos</span>
          </div>
        </div>

        {/* Paso 1: Canal de Comunicación */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            1. Canal de Comunicación
          </h2>
          <p className="text-gray-600 mb-6">
            Configure el canal oficial que aparecerá en toda la documentación de su entidad.
          </p>

          {!configuracion.canalComunicacion.configurado && !configuracion.canalComunicacion.pospuesto ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    const email = prompt('Ingrese el email de contacto:');
                    if (email) configurarCanal('email', email);
                  }}
                  className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-sm text-gray-600">Configurar email oficial</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const whatsapp = prompt('Ingrese el número de WhatsApp (con código de país):');
                    if (whatsapp) configurarCanal('whatsapp', whatsapp);
                  }}
                  className="p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <div className="text-center">
                    <h3 className="font-semibold">WhatsApp</h3>
                    <p className="text-sm text-gray-600">Configurar WhatsApp oficial</p>
                  </div>
                </button>
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={posponerCanal}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Posponer por 30 días
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              {configuracion.canalComunicacion.configurado ? (
                <div>
                  <p className="text-green-800 font-semibold">Canal configurado exitosamente</p>
                  <p className="text-green-700">
                    Tipo: {configuracion.canalComunicacion.tipo} -
                    Valor: {configuracion.canalComunicacion.valor}
                  </p>
                </div>
              ) : (
                <p className="text-yellow-800 font-semibold">Configuración pospuesta por 30 días</p>
              )}
            </div>
          )}
        </div>

        {/* Paso 2: Comunicación con la Entidad */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            2. Comunicación con la Entidad
          </h2>
          <p className="text-gray-600 mb-6">
            Genere y envíe el link de comunicación a todos los miembros de su entidad.
          </p>

          {!configuracion.comunicacionEntidad.linkGenerado ? (
            <button
              onClick={generarLinkEntidad}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Generar Link de Comunicación
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-semibold mb-2">Link generado:</p>
                <p className="text-blue-700 font-mono text-sm break-all">
                  {configuracion.comunicacionEntidad.linkGenerado}
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(configuracion.comunicacionEntidad.linkGenerado)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  Copiar Link
                </button>
              </div>

              {!configuracion.comunicacionEntidad.enviado && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-semibold mb-2">⚠️ Importante:</p>
                  <p className="text-yellow-700 mb-4">
                    Debe enviar este link a TODOS los miembros de su entidad por email o WhatsApp.
                    Una vez enviado, marque como completado.
                  </p>
                  <button
                    onClick={marcarEnviado}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                  >
                    Marcar como Enviado
                  </button>
                </div>
              )}

              {configuracion.comunicacionEntidad.enviado && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-semibold">✅ Link enviado a la entidad exitosamente</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Paso 3: Antecedentes Penales */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            3. Certificación de Antecedentes Penales
          </h2>
          <p className="text-gray-600 mb-6">
            Suba su certificación de antecedentes penales vigente.
          </p>

          {!configuracion.antecedentesPenales.subido && !configuracion.antecedentesPenales.pospuesto ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) subirAntecedentes(file);
                  }}
                  className="hidden"
                  id="antecedentes-upload"
                />
                <label
                  htmlFor="antecedentes-upload"
                  className="cursor-pointer"
                >
                  <p className="text-lg font-semibold mb-2">Subir Antecedentes Penales</p>
                  <p className="text-gray-600">PDF, JPG o PNG - Máximo 10MB</p>
                </label>
              </div>

              <div className="text-center">
                <button
                  onClick={posponerAntecedentes}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Posponer por 30 días
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              {configuracion.antecedentesPenales.subido ? (
                <div>
                  <p className="text-green-800 font-semibold">Antecedentes penales subidos exitosamente</p>
                  <p className="text-green-700">
                    Archivo: {configuracion.antecedentesPenales.archivo?.name}
                  </p>
                </div>
              ) : (
                <p className="text-yellow-800 font-semibold">Subida de antecedentes pospuesta por 30 días</p>
              )}
            </div>
          )}
        </div>

        {/* Paso 4: Mapa de Riesgos */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            4. Mapa de Riesgos
          </h2>
          <p className="text-gray-600 mb-6">
            Lea el mapa de riesgos específico confeccionado para su entidad.
          </p>

          {!configuracion.mapaRiesgos.leido ? (
            <div className="space-y-4">
              <button
                onClick={() => setMostrarMapaRiesgos(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Leer Mapa de Riesgos
              </button>

              <button
                onClick={generarPDFMapaRiesgos}
                className="ml-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Descargar PDF
              </button>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">✅ Mapa de riesgos leído y confirmado</p>
              <p className="text-green-700">
                Fecha de lectura: {new Date(configuracion.mapaRiesgos.fechaLectura).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Botón final */}
        <div className="text-center">
          <button
            onClick={irAlDashboard}
            disabled={!puedeAvanzarAlDashboard()}
            className={`px-8 py-4 rounded-lg font-medium text-lg transition-colors ${
              puedeAvanzarAlDashboard()
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {puedeAvanzarAlDashboard() ? 'Acceder al Dashboard' : 'Complete los pasos requeridos'}
          </button>
        </div>
      </div>

      {/* Modal Mapa de Riesgos */}
      {mostrarMapaRiesgos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Mapa de Riesgos Específico</h3>
                <button
                  onClick={() => setMostrarMapaRiesgos(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="prose max-w-none mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">
                    Análisis de Riesgos para {usuario.entidad}
                  </h4>
                  <p className="text-blue-800">
                    Tipo de entidad: {usuario.tipoEntidad} | Delegado: {usuario.tipo}
                  </p>
                </div>

                <h4 className="text-lg font-semibold mb-3">1. RIESGOS ESPECÍFICOS IDENTIFICADOS:</h4>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Espacios con supervisión limitada (vestuarios, almacenes)</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Menor cambiándose solo en vestuario</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Implementar sistema de puertas abiertas, supervisión rotatoria</p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Interacciones uno-a-uno entre adultos y menores</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Entrenamiento individual, tutoría privada</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Siempre con puerta abierta, informar a otro adulto presente</p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Actividades que requieren contacto físico</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Correcciones técnicas, primeros auxilios, apoyo físico</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Explicar antes el contacto, presencia de otro adulto, documentar</p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Desplazamientos y actividades fuera de las instalaciones</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Viajes a competiciones, excursiones, campamentos</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Autorización familiar por escrito, supervisión 24/7, protocolos claros</p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Uso de tecnologías y redes sociales</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Comunicación por WhatsApp, fotos de actividades, redes sociales</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Canal oficial únicamente, prohibir comunicación privada</p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold mb-3">2. MEDIDAS PREVENTIVAS OBLIGATORIAS:</h4>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Nunca estar a solas con un menor en espacios cerrados</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Menor necesita hablar en privado</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Usar espacio visible (ventana), puerta abierta, otro adulto cerca</p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Mantener puertas abiertas durante interacciones privadas</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Consulta médica, conversación personal</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Puerta entreabierta siempre, otro adulto informado y disponible</p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Informar a otro adulto sobre interacciones especiales</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Menor requiere atención especial, apoyo emocional</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Comunicar a compañero/supervisor antes y después del contacto</p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Documentar cualquier incidente o situación inusual</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Menor se lastima, comportamiento extraño, conflicto</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Registro inmediato por escrito, comunicar a delegado, informar familia</p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Respetar los límites físicos y emocionales de los menores</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Menor rechaza contacto físico, se muestra incómodo</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Respetar inmediatamente, buscar alternativas, documentar situación</p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold mb-3">3. PROTOCOLOS DE COMUNICACIÓN:</h4>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-purple-400 pl-4">
                    <p className="font-medium">• Canal de comunicación oficial configurado</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO PRÁCTICA:</strong> WhatsApp grupal para comunicaciones generales</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO IMPLEMENTAR:</strong> Un solo canal oficial, prohibir comunicaciones privadas</p>
                  </div>

                  <div className="border-l-4 border-purple-400 pl-4">
                    <p className="font-medium">• Procedimientos claros de reporte de incidencias</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Sospecha de maltrato, comportamiento inadecuado</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Comunicación inmediata al delegado, documentación, no investigar</p>
                  </div>

                  <div className="border-l-4 border-purple-400 pl-4">
                    <p className="font-medium">• Coordinación con autoridades competentes</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO CASO:</strong> Situación grave que requiere intervención externa</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO PROCEDER:</strong> Delegado contacta servicios sociales/policía según protocolo</p>
                  </div>

                  <div className="border-l-4 border-purple-400 pl-4">
                    <p className="font-medium">• Comunicación transparente con familias</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO PRÁCTICA:</strong> Informes regulares, comunicación de incidencias</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Canal directo con familias, información oportuna y clara</p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold mb-3">4. EVALUACIÓN CONTINUA:</h4>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-green-400 pl-4">
                    <p className="font-medium">• Revisión mensual de medidas implementadas</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO REUNIÓN:</strong> Análisis de efectividad de protocolos</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO HACERLO:</strong> Reunión mensual equipo, revisar incidencias, ajustar medidas</p>
                  </div>

                  <div className="border-l-4 border-green-400 pl-4">
                    <p className="font-medium">• Actualización según nuevos riesgos identificados</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO SITUACIÓN:</strong> Nuevas actividades, cambios en instalaciones</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO PROCEDER:</strong> Evaluar nuevos riesgos, actualizar protocolos, formar personal</p>
                  </div>

                  <div className="border-l-4 border-green-400 pl-4">
                    <p className="font-medium">• Formación continua del personal</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO PROGRAMA:</strong> Cursos trimestrales, casos prácticos</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO IMPLEMENTAR:</strong> Cronograma formativo, evaluación competencias, certificación</p>
                  </div>

                  <div className="border-l-4 border-green-400 pl-4">
                    <p className="font-medium">• Supervisión y mejora constante</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO PRÁCTICA:</strong> Observación directa, feedback del personal</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO EJECUTAR:</strong> Supervisión regular, mejora continua, reconocimiento buenas prácticas</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={generarPDFMapaRiesgos}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                >
                  Descargar PDF
                </button>
                <button
                  onClick={marcarMapaLeido}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                  Confirmar Lectura
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
