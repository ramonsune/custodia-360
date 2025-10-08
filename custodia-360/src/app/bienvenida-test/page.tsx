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

export default function BienvenidaTestPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [progreso, setProgreso] = useState<ProgresoFormacion | null>(null);
  const [loading, setLoading] = useState(false); // Cambiado a false para testing
  const [error, setError] = useState<string | null>(null);

  // COMENTADO PARA TESTING: La verificación de sesión que podría estar causando problemas
  /*
  useEffect(() => {
    verificarSesionYCargarDatos();
  }, []);
  */

  // En su lugar, configuramos datos de prueba
  useEffect(() => {
    console.log('🧪 MODO TEST: Configurando datos de prueba...')

    // Datos de prueba para simular un delegado principal
    const usuarioTest: Usuario = {
      id: 'test_principal_001',
      nombre: 'Juan',
      apellidos: 'Pérez García',
      email: 'test.delegado@demo.com',
      tipo: 'principal',
      entidad: {
        id: 'entidad_test_001',
        nombre: 'Entidad de Prueba',
        tipo_entidad: 'deportivo',
        plan: 'Plan Test'
      },
      certificado_penales: false,
      estado: 'activo',
      formacionCompletada: false,
      login_type: 'test'
    };

    const progresoTest: ProgresoFormacion = {
      porcentaje_completado: 0,
      modulos_completados: [],
      test_completado: false,
      certificado_generado: false,
      puede_acceder_dashboard: false
    };

    setUsuario(usuarioTest);
    setProgreso(progresoTest);
    setLoading(false);

    console.log('✅ Datos de test configurados correctamente');
  }, []);

  // Función para ir a formación LOPIVI
  const irAFormacion = () => {
    console.log('🎓 Navegando a formación LOPIVI...');
    router.push('/formacion-lopivi');
  };

  // Función para ir al test
  const irAlTest = () => {
    console.log('📝 Navegando al test de evaluación...');
    router.push('/test-evaluacion');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-bold mb-4">Error: {error}</div>
          <Link href="/login-delegados?tipo=principal" className="text-blue-600 hover:underline">
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">No se encontró información del usuario</div>
          <Link href="/login-delegados?tipo=principal" className="text-blue-600 hover:underline">
            Ir al login
          </Link>
        </div>
      </div>
    );
  }

  const entidadNombre = typeof usuario.entidad === 'string' ? usuario.entidad : usuario.entidad.nombre;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🧪 TEST - Bienvenido/a, Delegado/a Principal
              </h1>
              <p className="text-gray-600 mt-1">
                {usuario.nombre} {usuario.apellidos} | {entidadNombre}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* Mensaje de Test */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-900 mb-2">
            ✅ Página de Bienvenida Funciona Correctamente
          </h2>
          <p className="text-green-700">
            Esta es la página de bienvenida original pero con la verificación de sesión comentada.
            Si ves esto, el problema está en la lógica de autenticación, no en el componente en sí.
          </p>
        </div>

        {/* Progreso de Formación */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Progreso de Formación LOPIVI
          </h3>

          <div className="w-full bg-gray-200 rounded-full h-6 mb-6">
            <div
              className="bg-blue-600 h-6 rounded-full text-white text-center text-sm leading-6"
              style={{width: `${progreso?.porcentaje_completado || 0}%`}}
            >
              {progreso?.porcentaje_completado || 0}%
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Estado de Módulos:</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2">📚</span>
                  Introducción a LOPIVI
                  <span className="ml-auto text-orange-600">Pendiente</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🔒</span>
                  Protocolos de Protección
                  <span className="ml-auto text-orange-600">Pendiente</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">⚖️</span>
                  Marco Legal
                  <span className="ml-auto text-orange-600">Pendiente</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🚨</span>
                  Gestión de Casos
                  <span className="ml-auto text-orange-600">Pendiente</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Siguiente Paso:</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 mb-4">
                  Debes completar la formación obligatoria para obtener tu certificación como
                  Delegado/a de Protección.
                </p>
                <button
                  onClick={irAFormacion}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  ▶️ Comenzar Mi Formación LOPIVI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Test de Evaluación */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Test de Evaluación
          </h3>
          <p className="text-gray-600 mb-4">
            Una vez completada la formación, podrás realizar el test de evaluación final.
          </p>
          <button
            onClick={irAlTest}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              (progreso?.porcentaje_completado || 0) >= 100
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={(progreso?.porcentaje_completado || 0) < 100}
          >
            📝 Ir al Test de Evaluación
          </button>
        </div>

        {/* Información de Debug */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Información de Debug</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Usuario ID:</strong> {usuario.id}</p>
            <p><strong>Tipo:</strong> {usuario.tipo}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Progreso:</strong> {progreso?.porcentaje_completado || 0}%</p>
            <p><strong>Verificación de sesión:</strong> COMENTADA para testing</p>
          </div>
        </div>

        {/* Enlaces de Navegación */}
        <div className="text-center space-x-4">
          <Link
            href="/bienvenida-simple"
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
          >
            🧪 Versión Simple
          </Link>
          <Link
            href="/debug-navegacion"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
          >
            🔧 Debug Navegación
          </Link>
          <Link
            href="/"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            🏠 Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
