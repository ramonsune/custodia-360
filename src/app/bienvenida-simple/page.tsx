'use client'

import Link from 'next/link'

export default function BienvenidaSimplePage() {
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
                Test Usuario | Test Entidad
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* Mensaje de Bienvenida */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            ✅ Página de Bienvenida Carga Correctamente
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Esta es una versión simplificada sin verificación de sesión. Si ves esto,
            significa que el problema está en la lógica de autenticación, no en el routing de Next.js.
          </p>
        </div>

        {/* Progreso Simulado */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Progreso de Formación LOPIVI (Simulado)
          </h3>

          <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
            <div className="bg-blue-600 h-6 rounded-full text-white text-center text-sm leading-6" style={{width: '0%'}}>
              0%
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Estado de Módulos:</h4>
              <ul className="space-y-2 text-gray-600">
                <li>📚 Introducción a LOPIVI - Pendiente</li>
                <li>🔒 Protocolos de Protección - Pendiente</li>
                <li>⚖️ Marco Legal - Pendiente</li>
                <li>🚨 Gestión de Casos - Pendiente</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Siguiente Paso:</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 mb-3">
                  Debes completar la formación obligatoria para obtener tu certificación.
                </p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  ▶️ Comenzar Formación
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Test de Navegación */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-4">🧪 Test de Navegación</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/formacion-lopivi"
              className="block bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 text-center"
            >
              → Ir a Formación LOPIVI
            </Link>

            <Link
              href="/test-evaluacion"
              className="block bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 text-center"
            >
              → Ir al Test de Evaluación
            </Link>
          </div>
        </div>

        {/* Información de Debugging */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🔧 Información de Debug
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Esta página carga sin verificación de sesión</p>
            <p>• URL actual: /bienvenida-simple</p>
            <p>• Si los enlaces funcionan, el problema está en la autenticación</p>
            <p>• Si no funcionan, hay un problema de routing más profundo</p>
          </div>
        </div>

        {/* Enlaces de Navegación */}
        <div className="text-center space-x-4">
          <Link
            href="/test-bienvenida"
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
          >
            🧪 Página de Test
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
  )
}
