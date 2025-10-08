'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Usuario {
  id: string;
  nombre: string;
  apellidos?: string;
  email: string;
  tipo: string;
  entidad: {
    id: string;
    nombre: string;
    tipo_entidad: string;
    plan: string;
  } | string; // Permitir formato antiguo
  certificado_penales?: boolean;
  estado?: string;
  login_type?: string;
  formacionCompletada?: boolean;
}

interface ProgresoFormacion {
  porcentaje_completado: number;
  modulos_completados: string[];
  test_completado: boolean;
  certificado_generado: boolean;
  puede_acceder_dashboard: boolean;
}

export default function BienvenidaDelegadoPrincipalPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [progreso, setProgreso] = useState<ProgresoFormacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const verificarSesion = () => {
      try {
        console.log('🔍 Verificando sesión en bienvenida delegado principal...')

        // Solo usar la sesión unificada del login principal
        const userSession = localStorage.getItem('userSession')

        if (userSession) {
          const userData = JSON.parse(userSession)

          // Verificar que sea delegado principal y que no tenga certificación vigente
          if (userData.tipo !== 'principal') {
            console.log(`❌ Usuario no es delegado principal: ${userData.tipo}`)
            router.push('/login')
            return
          }

          // Si ya tiene certificación vigente, redirigir al dashboard
          if (userData.certificacionVigente) {
            console.log(`✅ Delegado ya certificado, redirigiendo al dashboard`)
            router.push('/dashboard-delegado')
            return
          }

          console.log(`✅ Delegado principal sin certificación cargado: ${userData.nombre}`)
          setUsuario(userData)
          setProgreso({
            porcentaje_completado: 0,
            modulos_completados: [],
            test_completado: false,
            certificado_generado: false,
            puede_acceder_dashboard: false
          })
        } else {
          console.log(`❌ No hay sesión válida, redirigiendo al login`)
          router.push('/login')
          return
        }

        setLoading(false)
      } catch (error) {
        console.error('❌ Error verificando sesión:', error)
        router.push('/login')
      }
    }

    verificarSesion()
  }, [router]);



  const iniciarFormacion = () => {
    router.push('/modulos-formacion');
  };

  const continuarFormacion = () => {
    router.push('/modulos-formacion');
  };

  const accederDashboard = () => {
    if (progreso?.puede_acceder_dashboard) {
      // Crear/actualizar sesión para el dashboard principal
      const dashboardSession = {
        id: usuario?.id,
        nombre: usuario?.nombre,
        apellidos: usuario?.apellidos || '',
        email: usuario?.email,
        tipo: 'Delegado Principal',
        entidad: typeof usuario?.entidad === 'string' ? usuario.entidad : usuario?.entidad?.nombre,
        tipoEntidad: typeof usuario?.entidad === 'string' ? 'deportivo' : usuario?.entidad?.tipo_entidad,
        formado: true,
        certificado: progreso.certificado_generado
      };

      localStorage.setItem('userSession', JSON.stringify(dashboardSession));
      router.push('/dashboard-delegado');
    }
  };

  const irAlTestEvaluacion = () => {
    console.log('🎯 CLICK en botón: Navegando al test de evaluación');
    console.log('🎯 Router.push hacia: /test-evaluacion');
    router.push('/test-evaluacion');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#059669] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos de formación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error de Sesión</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  if (!usuario || !progreso) {
    return null;
  }

  const entidadNombre = typeof usuario.entidad === 'string' ? usuario.entidad : usuario.entidad.nombre;
  const entidadPlan = typeof usuario.entidad === 'string' ? 'Plan Demo' : usuario.entidad.plan;
  const entidadTipo = typeof usuario.entidad === 'string' ? 'deportivo' : usuario.entidad.tipo_entidad;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#059669] to-[#047857] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-white">
              <h1 className="text-3xl font-bold">
                ¡Bienvenido/a, Delegado/a Principal!
              </h1>
              <p className="text-green-100 mt-2 text-lg">
                {usuario.nombre} {usuario.apellidos} | {entidadNombre}
              </p>
            </div>
            <div className="text-right text-white">
              <p className="text-sm">Plan: <span className="font-semibold">{entidadPlan}</span></p>
              <p className="text-sm">Tipo: <span className="font-semibold">{entidadTipo}</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">

        {/* Mensaje de Bienvenida */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Bienvenido a su Formación!</h2>
          <p className="text-lg text-gray-700">
            Estamos aquí para acompañarle en todo su proceso de formación como Delegado de Protección.
            Nuestro equipo le guiará paso a paso para que pueda ejercer su rol con confianza y eficacia.
          </p>
        </div>

        {/* Estado de Formación */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Estado de su Formación Custodia360</h2>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#059669]">{progreso.porcentaje_completado}%</div>
              <div className="text-sm text-gray-500">Completado</div>
            </div>
          </div>

          {/* Barra de Progreso */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className="bg-gradient-to-r from-[#059669] to-[#047857] h-3 rounded-full transition-all duration-300"
              style={{ width: `${progreso.porcentaje_completado}%` }}
            ></div>
          </div>

          {/* Estados de Progreso */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className={`p-4 rounded-lg border-2 ${progreso.modulos_completados.length > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center mb-2">
                <h3 className="font-semibold">Módulos</h3>
              </div>
              <p className="text-sm text-gray-600">
                {progreso.modulos_completados.length} de 6 módulos completados
              </p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${progreso.test_completado ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center mb-2">
                <h3 className="font-semibold">Test</h3>
              </div>
              <p className="text-sm text-gray-600">
                {progreso.test_completado ? 'Aprobado' : 'Pendiente'}
              </p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${progreso.certificado_generado ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center mb-2">
                <h3 className="font-semibold">Certificado Custodia360</h3>
              </div>
              <p className="text-sm text-gray-600">
                {progreso.certificado_generado ? 'Emitido' : 'Pendiente formación'}
              </p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${progreso.puede_acceder_dashboard ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center mb-2">
                <h3 className="font-semibold">Configuración</h3>
              </div>
              <p className="text-sm text-gray-600">
                {progreso.puede_acceder_dashboard ? 'Completada' : 'Pendiente'}
              </p>
            </div>
          </div>

          {/* Acciones según el estado */}
          <div className="flex flex-wrap gap-4">
            {progreso.porcentaje_completado === 0 && (
              <div className="text-center text-gray-600">
                <p>La formación Custodia360 está disponible para comenzar cuando esté listo.</p>
              </div>
            )}

            {progreso.porcentaje_completado > 0 && progreso.porcentaje_completado < 100 && (
              <>
                <button
                  onClick={continuarFormacion}
                  className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#1D4ED8] to-[#1E40AF] transition-all duration-200 shadow-lg"
                >
                  Continuar Formación ({progreso.porcentaje_completado}%)
                </button>

              </>
            )}

            {progreso.puede_acceder_dashboard && (
              <button
                onClick={accederDashboard}
                className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#6D28D9] to-[#5B21B6] transition-all duration-200 shadow-lg"
              >
                Acceder al Dashboard Principal
              </button>
            )}
          </div>
        </div>

        {/* Información del Rol */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Su Rol como Delegado Principal</h2>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Como <strong>Delegado Principal de Protección</strong> para {entidadNombre},
              usted tiene la responsabilidad de liderar la implementación y gestión del cumplimiento
              de la LOPIVI en su entidad.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Responsabilidades Principales:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Coordinar la implementación del Plan de Protección Infantil</li>
                  <li>Gestionar casos de riesgo o desprotección</li>
                  <li>Formar al personal en protocolos LOPIVI</li>
                  <li>Mantener actualizada la documentación obligatoria</li>
                  <li>Comunicar con autoridades competentes</li>
                  <li>Supervisar el cumplimiento normativo continuo</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Herramientas Disponibles:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Dashboard de gestión integral LOPIVI</li>
                  <li>Sistema de registro y seguimiento de casos</li>
                  <li>Generador automático de documentos</li>
                  <li>Panel de comunicación con familias</li>
                  <li>Centro de alertas y notificaciones</li>
                  <li>Biblioteca de recursos y protocolos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Siguiente Paso */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Siguiente Paso Recomendado
            </h3>
            {!progreso.puede_acceder_dashboard ? (
              <p className="text-gray-700 mb-6">
                Complete su formación Custodia360 para acceder a todas las herramientas de gestión
                y comenzar a proteger efectivamente a los menores en su entidad.
              </p>
            ) : (
              <p className="text-gray-700 mb-6">
                ¡Felicidades! Ya puede acceder al Dashboard Principal y comenzar a gestionar
                la protección infantil en su entidad.
              </p>
            )}

            <div className="flex justify-center gap-4 flex-wrap">
              {!progreso.puede_acceder_dashboard ? (
                <>
                  <button
                    onClick={progreso.porcentaje_completado === 0 ? iniciarFormacion : continuarFormacion}
                    className="bg-gradient-to-r from-[#059669] to-[#047857] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#047857] to-[#065f46] transition-all duration-200 shadow-lg"
                  >
                    {progreso.porcentaje_completado === 0 ? 'Comenzar Ahora' : 'Continuar Formación'}
                  </button>

                </>
              ) : (
                <button
                  onClick={accederDashboard}
                  className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#6D28D9] to-[#5B21B6] transition-all duration-200 shadow-lg"
                >
                  Ir al Dashboard Principal
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
