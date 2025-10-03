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

export default function BienvenidaDelegadoPrincipalPage() {
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
                Bienvenido/a, Delegado/a Principal
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
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            ¡Felicidades por ser designado/a Delegado/a Principal!
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            {usuario?.tipoEntidad === 'deportivo' && (
              <>Su entidad deportiva {usuario.entidad} ha confiado en usted para liderar la implementación
              de la protección integral infantil según la LOPIVI en el ámbito deportivo. Su rol es fundamental para
              garantizar un entorno seguro durante entrenamientos, competiciones y todas las actividades deportivas.</>
            )}
            {usuario?.tipoEntidad === 'educativo' && (
              <>Su centro educativo {usuario.entidad} ha confiado en usted para liderar la implementación
              de la protección integral infantil según la LOPIVI en el ámbito educativo. Su rol es fundamental para
              garantizar un entorno seguro durante clases, actividades extraescolares y todo el proceso educativo.</>
            )}
            {usuario?.tipoEntidad === 'religioso' && (
              <>Su entidad religiosa {usuario.entidad} ha confiado en usted para liderar la implementación
              de la protección integral infantil según la LOPIVI en el ámbito pastoral. Su rol es fundamental para
              garantizar un entorno seguro durante catequesis, actividades pastorales y toda la vida parroquial.</>
            )}
            {usuario?.tipoEntidad === 'ocio' && (
              <>Su entidad de ocio {usuario.entidad} ha confiado en usted para liderar la implementación
              de la protección integral infantil según la LOPIVI en actividades de tiempo libre. Su rol es fundamental para
              garantizar un entorno seguro durante campamentos, talleres y todas las actividades recreativas.</>
            )}
            {!usuario?.tipoEntidad && (
              <>Su entidad {usuario.entidad} ha confiado en usted para liderar la implementación
              de la protección integral infantil según la LOPIVI. Su rol es fundamental para
              garantizar un entorno seguro para todos los menores.</>
            )}
          </p>
        </div>

        {/* Roles y Responsabilidades */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Roles y Responsabilidades en su Entidad
          </h3>

          <div className="space-y-6">
            {/* Delegado Principal */}
            <div className="border-l-4 border-blue-600 pl-6">
              <h4 className="text-lg font-semibold text-blue-600 mb-2">
                Delegado/a Principal (Su Rol)
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

            {/* Delegado Suplente */}
            <div className="border-l-4 border-green-600 pl-6">
              <h4 className="text-lg font-semibold text-green-600 mb-2">
                Delegado/a Suplente
              </h4>
              <p className="text-gray-700 mb-3">
                Apoyo directo al delegado principal y sustituto en su ausencia:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Colaborar en la supervisión de protocolos</li>
                <li>Actuar cuando el delegado principal no esté disponible</li>
                <li>Apoyo en formación del personal</li>
                <li>Mantener formación actualizada</li>
                <li>Participar en evaluaciones y mejoras del sistema</li>
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
                {usuario?.tipoEntidad === 'deportivo' && (
                  <>
                    <p className="font-medium mb-2">En su entidad deportiva:</p>
                    <ul className="list-disc list-inside mb-3 ml-4">
                      <li>Entrenadores principales y asistentes</li>
                      <li>Preparadores físicos y técnicos deportivos</li>
                      <li>Fisioterapeutas y personal médico</li>
                      <li>Árbitros y jueces deportivos</li>
                      <li>Monitores de actividades deportivas</li>
                      <li>Responsables de equipamientos y material</li>
                    </ul>
                  </>
                )}
                {usuario?.tipoEntidad === 'educativo' && (
                  <>
                    <p className="font-medium mb-2">En su centro educativo:</p>
                    <ul className="list-disc list-inside mb-3 ml-4">
                      <li>Profesores y tutores</li>
                      <li>Monitores de actividades extraescolares</li>
                      <li>Personal de apoyo educativo</li>
                      <li>Orientadores y psicopedagogos</li>
                      <li>Instructores de talleres y laboratorios</li>
                      <li>Personal de transporte escolar</li>
                    </ul>
                  </>
                )}
                {usuario?.tipoEntidad === 'religioso' && (
                  <>
                    <p className="font-medium mb-2">En su entidad religiosa:</p>
                    <ul className="list-disc list-inside mb-3 ml-4">
                      <li>Catequistas y animadores pastorales</li>
                      <li>Monitores de grupos juveniles</li>
                      <li>Responsables de coros infantiles</li>
                      <li>Coordinadores de actividades parroquiales</li>
                      <li>Animadores de campamentos religiosos</li>
                      <li>Voluntarios en contacto directo</li>
                    </ul>
                  </>
                )}
                {usuario?.tipoEntidad === 'ocio' && (
                  <>
                    <p className="font-medium mb-2">En su entidad de ocio:</p>
                    <ul className="list-disc list-inside mb-3 ml-4">
                      <li>Monitores de tiempo libre</li>
                      <li>Animadores y coordinadores de actividades</li>
                      <li>Instructores de talleres creativos</li>
                      <li>Personal de campamentos y colonias</li>
                      <li>Responsables de excursiones</li>
                      <li>Coordinadores de juegos y dinámicas</li>
                    </ul>
                  </>
                )}
                {!usuario?.tipoEntidad && (
                  <>
                    <p className="font-medium mb-2">Personal en contacto directo:</p>
                    <ul className="list-disc list-inside mb-3 ml-4">
                      <li>Monitores y educadores</li>
                      <li>Instructores y técnicos</li>
                      <li>Personal de apoyo directo</li>
                      <li>Coordinadores de actividades</li>
                    </ul>
                  </>
                )}
              </div>
              <p className="text-gray-700 mt-3">
                <strong>Obligaciones específicas:</strong> Formación especializada en protección infantil,
                aplicar protocolos de seguridad específicos del sector, reportar situaciones de riesgo inmediatamente,
                mantener supervisión adecuada en todo momento.
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
                {usuario?.tipoEntidad === 'deportivo' && (
                  <>
                    <p className="font-medium mb-2">En su entidad deportiva:</p>
                    <ul className="list-disc list-inside mb-3 ml-4">
                      <li>Personal administrativo y de gestión</li>
                      <li>Personal de mantenimiento de instalaciones deportivas</li>
                      <li>Personal de limpieza de vestuarios y espacios</li>
                      <li>Personal de cocina y cafetería del club</li>
                      <li>Encargados de taquillas y equipamientos</li>
                      <li>Personal de seguridad de las instalaciones</li>
                    </ul>
                  </>
                )}
                {usuario?.tipoEntidad === 'educativo' && (
                  <>
                    <p className="font-medium mb-2">En su centro educativo:</p>
                    <ul className="list-disc list-inside mb-3 ml-4">
                      <li>Personal administrativo y secretaría</li>
                      <li>Personal de mantenimiento del centro</li>
                      <li>Personal de limpieza de aulas y espacios</li>
                      <li>Personal de cocina y comedor escolar</li>
                      <li>Conserjes y porteros</li>
                      <li>Personal de biblioteca (sin contacto directo)</li>
                    </ul>
                  </>
                )}
                {usuario?.tipoEntidad === 'religioso' && (
                  <>
                    <p className="font-medium mb-2">En su entidad religiosa:</p>
                    <ul className="list-disc list-inside mb-3 ml-4">
                      <li>Personal administrativo parroquial</li>
                      <li>Sacristanes y encargados de espacios</li>
                      <li>Personal de mantenimiento de edificios</li>
                      <li>Personal de limpieza de instalaciones</li>
                      <li>Organistas y técnicos de sonido</li>
                      <li>Voluntarios de tareas administrativas</li>
                    </ul>
                  </>
                )}
                {usuario?.tipoEntidad === 'ocio' && (
                  <>
                    <p className="font-medium mb-2">En su entidad de ocio:</p>
                    <ul className="list-disc list-inside mb-3 ml-4">
                      <li>Coordinadores administrativos</li>
                      <li>Personal de recepción e información</li>
                      <li>Conductores de transporte (sin supervisión)</li>
                      <li>Personal de servicios generales</li>
                      <li>Personal de cocina de campamentos</li>
                      <li>Encargados de material y equipamientos</li>
                    </ul>
                  </>
                )}
                {!usuario?.tipoEntidad && (
                  <>
                    <p className="font-medium mb-2">Personal sin contacto directo:</p>
                    <ul className="list-disc list-inside mb-3 ml-4">
                      <li>Personal administrativo</li>
                      <li>Personal de mantenimiento</li>
                      <li>Personal de limpieza</li>
                      <li>Personal de servicios generales</li>
                    </ul>
                  </>
                )}
              </div>
              <p className="text-gray-700 mt-3">
                <strong>Obligaciones específicas:</strong> Formación básica en protección infantil adaptada al sector,
                conocimiento de protocolos de comunicación específicos, reporte inmediato de situaciones sospechosas,
                colaboración activa en la creación de entornos seguros.
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
            Reglas de su Formación como Delegado/a Principal
          </h3>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Formación Obligatoria Completa</h4>
                <p className="text-gray-600">
                  Debe completar los 8 módulos de formación especializada para obtener
                  su certificación como Delegado/a Principal.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Descarga y Lectura de Documentación</h4>
                <p className="text-gray-600">
                  En cada módulo encontrará documentos PDF especializados que debe
                  <strong> descargar Y leer completamente</strong> antes de pasar al siguiente módulo.
                  La lectura de esta documentación es fundamental para comprender los protocolos
                  y aplicarlos correctamente en situaciones reales.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Evaluación Final</h4>
                <p className="text-gray-600">
                  Al completar la formación, realizará un test de evaluación para
                  demostrar sus conocimientos y obtener la certificación oficial.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Actualización Continua</h4>
                <p className="text-gray-600">
                  La formación incluye actualizaciones automáticas cuando hay cambios
                  normativos o mejores prácticas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formación Especializada */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {usuario?.tipoEntidad === 'deportivo' && 'Formación Especializada para Delegados Principales en Entidades Deportivas'}
            {usuario?.tipoEntidad === 'educativo' && 'Formación Especializada para Delegados Principales en Centros Educativos'}
            {usuario?.tipoEntidad === 'religioso' && 'Formación Especializada para Delegados Principales en Entidades Religiosas'}
            {usuario?.tipoEntidad === 'ocio' && 'Formación Especializada para Delegados Principales en Entidades de Ocio'}
            {!usuario?.tipoEntidad && 'Formación Especializada para Delegados Principales'}
          </h3>

          <p className="text-gray-700 mb-6">
            {usuario?.tipoEntidad === 'deportivo' && (
              <>Su formación ha sido específicamente diseñada para entidades deportivas,
              incluyendo casos prácticos en entrenamientos, competiciones, vestuarios y todas las particularidades
              del ámbito deportivo con menores.</>
            )}
            {usuario?.tipoEntidad === 'educativo' && (
              <>Su formación ha sido específicamente diseñada para centros educativos,
              incluyendo casos prácticos en aulas, recreos, actividades extraescolares y todas las particularidades
              del ámbito educativo con menores.</>
            )}
            {usuario?.tipoEntidad === 'religioso' && (
              <>Su formación ha sido específicamente diseñada para entidades religiosas,
              incluyendo casos prácticos en catequesis, actividades pastorales, grupos juveniles y todas las particularidades
              del ámbito religioso con menores.</>
            )}
            {usuario?.tipoEntidad === 'ocio' && (
              <>Su formación ha sido específicamente diseñada para entidades de ocio y tiempo libre,
              incluyendo casos prácticos en campamentos, talleres, excursiones y todas las particularidades
              del ámbito del ocio con menores.</>
            )}
            {!usuario?.tipoEntidad && (
              <>Su formación ha sido específicamente diseñada para su tipo de entidad,
              incluyendo casos prácticos y protocolos adaptados a las particularidades de su sector.</>
            )}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Lo que aprenderá:</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Marco legal LOPIVI completo y aplicado
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Detección de indicadores específicos del sector
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Protocolos de actuación especializados
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Comunicación interinstitucional efectiva
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Gestión de equipos y formación sectorial
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Documentación y registros especializados
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Herramientas incluidas:</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Formularios especializados
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Plantillas de comunicación sectorial
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Casos prácticos del sector resueltos
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Guías paso a paso especializadas
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Sistema de alertas automático
                </li>

              </ul>
            </div>
          </div>
        </div>

        {/* Botón de Acción */}
        <div className="text-center">
          <button
            onClick={() => {
              // Crear una sesión válida para el delegado nuevo antes de ir a formación
              const nuevoDelegado = {
                id: 'nuevo_delegado_' + Date.now(),
                nombre: 'Delegado Principal Nuevo',
                email: 'nuevo.delegado@demo.com',
                tipo: 'principal',
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

              console.log('✅ Sesión de delegado nuevo creada:', nuevoDelegado)

              // Ahora navegar a la formación
              router.push('/formacion-delegado')
            }}
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-lg transition-colors shadow-lg"
          >
            Comenzar Mi Formación como Delegado/a Principal
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
          <div className="flex justify-center">
            <span className="text-sm text-gray-500">info@custodia360.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
