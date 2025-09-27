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
            <Link
              href="/dashboard-delegado"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
            >
              Ir al Dashboard
            </Link>
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
            Su entidad {usuario.entidad} ha confiado en usted para liderar la implementación
            de la protección integral infantil según la LOPIVI. Su rol es fundamental para
            garantizar un entorno seguro para todos los menores.
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

        {/* Formación Especializada - SIN FONDO AZUL */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Formación Especializada para Delegados Principales en {usuario.tipoEntidad === 'deportivo' ? 'Clubs Deportivos' : 'Entidades de Ocio'}
          </h3>

          <p className="text-gray-700 mb-6">
            Su formación ha sido específicamente diseñada para su tipo de entidad,
            incluyendo casos prácticos y protocolos adaptados a las particularidades
            del {usuario.tipoEntidad === 'deportivo' ? 'sector deportivo' : 'sector de ocio y tiempo libre'}.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Lo que aprenderá:</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Marco legal LOPIVI completo
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Detección de indicadores de riesgo
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Protocolos de actuación específicos
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Comunicación interinstitucional
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Gestión de equipos y formación
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Documentación y registros
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Herramientas incluidas:</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Formularios oficiales
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Plantillas de comunicación
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Casos prácticos resueltos
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Guías paso a paso
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Sistema de alertas automático
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Soporte técnico 24/7
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botón de Acción */}
        <div className="text-center">
          <Link
            href="/formacion-delegado"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-lg transition-colors shadow-lg"
          >
            Comenzar Mi Formación como Delegado/a Principal
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Información de Contacto */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Necesita ayuda durante su formación?
          </h3>
          <p className="text-gray-600 mb-4">
            Nuestro equipo de soporte está disponible 24/7 para resolver cualquier duda.
          </p>
          <div className="flex justify-center space-x-4">
            <span className="text-sm text-gray-500">📧 soporte@custodia360.com</span>
            <span className="text-sm text-gray-500">📞 900 123 456</span>
          </div>
        </div>
      </div>
    </div>
  );
}
