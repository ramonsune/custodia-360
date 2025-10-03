'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  tipo: string;
  entidad: string;
  tipoEntidad?: string;
}

export default function BienvenidaDelegadoSuplentePage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);
        setUsuario(userData);
      } catch (error) {
        console.error('Error loading session:', error);
        router.push('/login-delegados');
      }
    } else {
      router.push('/login-delegados');
    }
    setLoading(false);
  }, [router]);

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
                Bienvenido/a, Delegado/a Suplente
              </h1>
              <p className="text-gray-600 mt-1">
                {usuario.nombre} | {usuario.entidad}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* Mensaje de Bienvenida */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            ¡Felicidades por ser designado/a Delegado/a Suplente!
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Su entidad {usuario.entidad} ha confiado en usted para colaborar en la implementación
            de la protección integral infantil según la LOPIVI. Su rol de apoyo es crucial para
            garantizar una cobertura completa y un entorno seguro para todos los menores.
          </p>
        </div>

        {/* Roles y Responsabilidades */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Roles y Responsabilidades en su Entidad
          </h3>

          <div className="space-y-6">
            {/* Delegado Suplente */}
            <div className="border-l-4 border-green-600 pl-6 bg-green-50 p-4 rounded-r-lg">
              <h4 className="text-lg font-semibold text-green-600 mb-2">
                Delegado/a Suplente (Su Rol)
              </h4>
              <p className="text-gray-700 mb-3">
                Es el apoyo directo del delegado principal y su sustituto cuando sea necesario:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Colaborar activamente en la supervisión de protocolos LOPIVI</li>
                <li>Actuar con plena autoridad cuando el delegado principal no esté disponible</li>
                <li>Apoyar en la formación y coordinación del personal</li>
                <li>Mantener su formación actualizada y certificación vigente</li>
                <li>Participar en evaluaciones y mejoras del sistema de protección</li>
                <li>Gestionar situaciones de emergencia en ausencia del delegado principal</li>
              </ul>
            </div>

            {/* Delegado Principal */}
            <div className="border-l-4 border-blue-600 pl-6">
              <h4 className="text-lg font-semibold text-blue-600 mb-2">
                Delegado/a Principal
              </h4>
              <p className="text-gray-700 mb-3">
                Es la máxima autoridad en protección infantil de la entidad, responsable de:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Supervisar la implementación completa de protocolos LOPIVI</li>
                <li>Formar y coordinar a todo el personal</li>
                <li>Gestionar situaciones de riesgo y emergencias</li>
                <li>Comunicar con autoridades competentes</li>
                <li>Mantener la documentación actualizada</li>
                <li>Evaluar y mejorar continuamente el sistema de protección</li>
              </ul>
            </div>

            {/* Personal con Contacto */}
            <div className="border-l-4 border-purple-600 pl-6">
              <h4 className="text-lg font-semibold text-purple-600 mb-2">
                Personal con Contacto Directo
              </h4>
              <p className="text-gray-700 mb-3">
                Personal que interactúa directamente con menores durante las actividades:
              </p>
              <div className="text-gray-600">
                <p className="font-medium mb-2">En entidades deportivas:</p>
                <ul className="list-disc list-inside mb-3 ml-4">
                  <li>Entrenadores y técnicos deportivos</li>
                  <li>Monitores de actividades físicas</li>
                  <li>Fisioterapeutas y personal médico</li>
                  <li>Árbitros y jueces deportivos</li>
                </ul>
                <p className="font-medium mb-2">En entidades de ocio:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Monitores de tiempo libre</li>
                  <li>Animadores y coordinadores de actividades</li>
                  <li>Instructores de talleres</li>
                  <li>Personal de campamentos</li>
                </ul>
              </div>
              <p className="text-gray-700 mt-3">
                <strong>Obligaciones:</strong> Formación específica en protección infantil,
                aplicar protocolos de seguridad, reportar situaciones de riesgo inmediatamente.
              </p>
            </div>

            {/* Personal sin Contacto */}
            <div className="border-l-4 border-orange-600 pl-6">
              <h4 className="text-lg font-semibold text-orange-600 mb-2">
                Personal sin Contacto Directo
              </h4>
              <p className="text-gray-700 mb-3">
                Personal que trabaja en la entidad pero sin interacción directa con menores:
              </p>
              <div className="text-gray-600">
                <p className="font-medium mb-2">En entidades deportivas:</p>
                <ul className="list-disc list-inside mb-3 ml-4">
                  <li>Personal administrativo y de gestión</li>
                  <li>Personal de mantenimiento e instalaciones</li>
                  <li>Personal de limpieza</li>
                  <li>Personal de cocina y cafetería</li>
                </ul>
                <p className="font-medium mb-2">En entidades de ocio:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Coordinadores administrativos</li>
                  <li>Personal de recepción</li>
                  <li>Conductores de transporte</li>
                  <li>Personal de servicios generales</li>
                </ul>
              </div>
              <p className="text-gray-700 mt-3">
                <strong>Obligaciones:</strong> Formación básica en protección infantil,
                conocimiento de protocolos de comunicación, reporte de situaciones sospechosas.
              </p>
            </div>

            {/* Familias */}
            <div className="border-l-4 border-pink-600 pl-6">
              <h4 className="text-lg font-semibold text-pink-600 mb-2">
                Familias
              </h4>
              <p className="text-gray-700 mb-3">
                Familias de los menores que participan en las actividades de la entidad:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Conocer las medidas de protección implementadas</li>
                <li>Colaborar en la aplicación de protocolos</li>
                <li>Comunicar cualquier situación de riesgo</li>
                <li>Participar en actividades de sensibilización</li>
                <li>Mantener canales de comunicación activos con la entidad</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reglas de Formación - SIN FONDO AMARILLO */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Reglas de su Formación como Delegado/a Suplente
          </h3>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Formación Obligatoria Específica</h4>
                <p className="text-gray-600">
                  Debe completar los 8 módulos de formación especializada, con énfasis especial
                  en coordinación y trabajo en equipo con el delegado principal.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Descarga y Lectura de Documentación</h4>
                <p className="text-gray-600">
                  En cada módulo encontrará documentos PDF especializados que debe
                  <strong> descargar Y leer completamente</strong> antes de pasar al siguiente módulo.
                  La lectura de esta documentación es fundamental para comprender los protocolos
                  y poder actuar eficazmente como sustituto del delegado principal cuando sea necesario.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Evaluación y Certificación</h4>
                <p className="text-gray-600">
                  Al completar la formación, realizará un test específico para delegados suplentes
                  que incluye coordinación y trabajo en equipo.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Coordinación Continua</h4>
                <p className="text-gray-600">
                  Mantendrá comunicación regular con el delegado principal y participará
                  en sesiones de coordinación para garantizar una respuesta unificada.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formación Especializada - SIN FONDO AZUL */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Formación Especializada para Delegados Suplentes en {usuario.tipoEntidad === 'deportivo' ? 'Clubs Deportivos' : 'Entidades de Ocio'}
          </h3>

          <p className="text-gray-700 mb-6">
            Su formación como delegado suplente incluye contenidos específicos sobre coordinación,
            trabajo en equipo y gestión autónoma cuando actúe en sustitución del delegado principal
            en el {usuario.tipoEntidad === 'deportivo' ? 'sector deportivo' : 'sector de ocio y tiempo libre'}.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Contenidos específicos para suplentes:</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Coordinación con delegado principal
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Gestión autónoma en situaciones de emergencia
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Protocolos de sustitución temporal
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Comunicación efectiva con equipos
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Toma de decisiones bajo presión
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Documentación y seguimiento de casos
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Herramientas de coordinación:</h4>
              <ul className="space-y-2 text-gray-600">

                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Protocolos de escalado automático
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Dashboard compartido en tiempo real
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Plantillas de informes para coordinación
                </li>

                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Acceso completo a documentación
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Coordinación con Delegado Principal */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Trabajo en Equipo con el Delegado Principal
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">Sus responsabilidades:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mantener comunicación regular y fluida</li>
                <li>• Estar disponible para sustituciones</li>
                <li>• Participar en formaciones conjuntas</li>
                <li>• Conocer todos los casos activos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">Beneficios del trabajo conjunto:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cobertura completa 24/7</li>
                <li>• Perspectivas complementarias</li>
                <li>• Mayor eficacia en la gestión</li>
                <li>• Respaldo mutuo profesional</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botón de Acción */}
        <div className="text-center">
          <button
            onClick={() => {
              // Crear una sesión válida para el delegado suplente nuevo antes de ir a formación
              const nuevoDelegado = {
                id: 'nuevo_suplente_' + Date.now(),
                nombre: 'Delegado Suplente Nuevo',
                email: 'nuevo.suplente@demo.com',
                tipo: 'suplente',
                entidad: 'Entidad Demo',
                permisos: [],
                certificacionVigente: false,
                inicioSesion: new Date().toISOString(),
                expiracion: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // 8 horas
              }

              // Guardar sesión en los mismos lugares que el login
              localStorage.setItem('userAuth', JSON.stringify(nuevoDelegado))
              localStorage.setItem('userSession', JSON.stringify(nuevoDelegado))
              sessionStorage.setItem('userSession', JSON.stringify(nuevoDelegado))

              console.log('✅ Sesión de delegado suplente nuevo creada:', nuevoDelegado)

              // Ahora navegar a la formación
              router.push('/formacion-delegado')
            }}
            className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-medium text-lg rounded-lg transition-colors shadow-lg"
          >
            Comenzar Mi Formación como Delegado/a Suplente
          </button>
        </div>

        {/* Información de Contacto */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Necesita ayuda durante su formación?
          </h3>
          <p className="text-gray-600 mb-4">
            Soporte disponible 24/7 para resolver cualquier duda.
          </p>
          <div className="flex justify-center space-x-4">
            <span className="text-sm text-gray-500">info@custodia360.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
