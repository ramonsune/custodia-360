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

interface TipoEntidad {
  id: string;
  nombre: string;
  descripcion: string;
  ejemplos: string[];
  icono: string;
  color: string;
}

const tiposEntidad: TipoEntidad[] = [
  {
    id: 'deportivo',
    nombre: 'Club/Entidad Deportiva',
    descripcion: 'Organizaciones dedicadas al deporte y actividad física',
    ejemplos: ['Clubes de fútbol', 'Gimnasios', 'Escuelas deportivas', 'Federaciones deportivas'],
    icono: '⚽',
    color: 'bg-blue-500'
  },
  {
    id: 'educativo',
    nombre: 'Centro Educativo',
    descripcion: 'Instituciones de enseñanza y formación académica',
    ejemplos: ['Colegios', 'Institutos', 'Academias', 'Centros de formación'],
    icono: '🎓',
    color: 'bg-green-500'
  },
  {
    id: 'religioso',
    nombre: 'Entidad Religiosa',
    descripcion: 'Organizaciones de carácter religioso y espiritual',
    ejemplos: ['Parroquias', 'Catequesis', 'Grupos juveniles', 'Movimientos religiosos'],
    icono: '⛪',
    color: 'bg-purple-500'
  },
  {
    id: 'ocio',
    nombre: 'Ocio y Tiempo Libre',
    descripcion: 'Actividades recreativas y de entretenimiento',
    ejemplos: ['Campamentos', 'Ludotecas', 'Centros de ocio', 'Actividades extraescolares'],
    icono: '🎪',
    color: 'bg-orange-500'
  },
  {
    id: 'cultural',
    nombre: 'Entidad Cultural',
    descripcion: 'Organizaciones dedicadas al arte y la cultura',
    ejemplos: ['Escuelas de música', 'Academias de baile', 'Teatros', 'Centros culturales'],
    icono: '🎭',
    color: 'bg-pink-500'
  },
  {
    id: 'social',
    nombre: 'Entidad Social/ONG',
    descripcion: 'Organizaciones de ayuda social y voluntariado',
    ejemplos: ['ONGs', 'Fundaciones', 'Centros de menores', 'Servicios sociales'],
    icono: '🤝',
    color: 'bg-red-500'
  },
  {
    id: 'sanitario',
    nombre: 'Centro Sanitario',
    descripcion: 'Instituciones de salud y atención médica',
    ejemplos: ['Hospitales', 'Clínicas', 'Centros de salud', 'Consultas pediátricas'],
    icono: '🏥',
    color: 'bg-teal-500'
  },
  {
    id: 'otros',
    nombre: 'Otros',
    descripcion: 'Otras entidades que trabajen con menores',
    ejemplos: ['Empresas de servicios', 'Entidades mixtas', 'Organizaciones especializadas'],
    icono: '🏢',
    color: 'bg-gray-500'
  }
];

export default function SelectorEntidadPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [entidadSeleccionada, setEntidadSeleccionada] = useState<string>('');

  useEffect(() => {
    // Verificar sesión del login de delegados
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);
        setUsuario(userData);

        // Si ya tiene tipo de entidad seleccionado, ir directamente a formación
        if (userData.tipoEntidad) {
          console.log('tipoEntidad found:', userData.tipoEntidad, 'redirecting to formacion')
          router.push('/formacion-delegado');
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

  const confirmarSeleccion = () => {
    if (!entidadSeleccionada || !usuario) return;

    // Actualizar usuario con tipo de entidad seleccionado
    const usuarioActualizado = {
      ...usuario,
      tipoEntidad: entidadSeleccionada
    };

    localStorage.setItem('userSession', JSON.stringify(usuarioActualizado));

    // Ir a la formación
    router.push('/formacion-delegado');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2563EB]"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Selecciona tu Tipo de Entidad
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenido/a {usuario.nombre}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Paso 1 de 3</p>
              <p className="text-lg font-semibold text-blue-600">Personalización</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Mensaje de Bienvenida */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bienvenido/a a tu Formación como Delegado de Protección LOPIVI
          </h2>
          <div className="text-gray-700 space-y-4 leading-relaxed">
            <p>
              <strong>Estimado/a {usuario.nombre},</strong>
            </p>
            <p>
              Es un honor acompañarte en este proceso de formación como <strong>{usuario.tipo === 'principal' ? 'Delegado Principal' : 'Delegado Suplente'} de Protección</strong>
              según establece la Ley Orgánica de Protección Integral a la Infancia y la Adolescencia (LOPIVI).
            </p>
            <p>
              Tu compromiso con la protección de menores es fundamental para crear entornos seguros donde niños, niñas y adolescentes
              puedan desarrollarse plenamente. Esta formación te proporcionará las herramientas técnicas, legales y prácticas
              necesarias para ejercer tu responsabilidad con la máxima competencia profesional.
            </p>
            <p>
              El programa que inicias está diseñado específicamente para adaptarse a las necesidades y particularidades de tu sector,
              garantizando que obtengas conocimientos directamente aplicables en tu entorno de trabajo.
            </p>
            <p className="font-medium text-blue-800">
              Juntos construiremos un futuro más seguro para la infancia y adolescencia.
            </p>
          </div>
        </div>

        {/* Información técnica */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-blue-900 mb-3">
            Personalización de tu Formación
          </h3>
          <div className="text-blue-800 space-y-2">
            <p><strong>Contenido personalizado:</strong> Los módulos se adaptarán específicamente a tu sector de trabajo</p>
            <p><strong>Casos prácticos relevantes:</strong> Ejemplos y situaciones reales de tu ámbito profesional</p>
            <p><strong>Protocolos específicos:</strong> Procedimientos adaptados a tu tipo de organización</p>
            <p><strong>Normativa aplicable:</strong> Requisitos legales específicos para tu sector</p>
            <p><strong>Materiales descargables:</strong> PDFs personalizados para estudio offline</p>
          </div>
        </div>

        {/* Selector de entidades */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Selecciona el tipo de entidad que mejor describe tu organización:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiposEntidad.map((tipo) => (
              <div
                key={tipo.id}
                onClick={() => setEntidadSeleccionada(tipo.id)}
                className={`cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 ${
                  entidadSeleccionada === tipo.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="text-center mb-4">
                  <div className={`w-4 h-4 ${tipo.color} rounded-full mx-auto mb-3`}></div>
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {tipo.nombre}
                  </h4>
                </div>

                <p className="text-gray-600 text-sm mb-4 text-center">
                  {tipo.descripcion}
                </p>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Ejemplos:
                  </p>
                  {tipo.ejemplos.map((ejemplo, index) => (
                    <p key={index} className="text-xs text-gray-600">
                      • {ejemplo}
                    </p>
                  ))}
                </div>

                {entidadSeleccionada === tipo.id && (
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                      ✓ Seleccionado
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botón de confirmación */}
          <div className="mt-8 text-center">
            <button
              onClick={confirmarSeleccion}
              disabled={!entidadSeleccionada}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                entidadSeleccionada
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {entidadSeleccionada
                ? 'Continuar con la Formación →'
                : 'Selecciona un tipo de entidad para continuar'
              }
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Información importante:</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• La selección de entidad personaliza todo el contenido de tu formación</p>
            <p>• Podrás cambiar esta selección más adelante si es necesario</p>
            <p>• El certificado final especificará tu tipo de entidad</p>
            <p>• Los módulos incluirán casos prácticos específicos de tu sector</p>
          </div>
        </div>
      </div>
    </div>
  );
}
