'use client'

import Link from 'next/link'

export default function TestBienvenidaPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🧪 Test Directo de Páginas de Bienvenida</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Navegación Directa (Sin verificación de sesión)</h2>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Páginas de Bienvenida</h3>
              <div className="space-y-2">
                <Link
                  href="/bienvenida-formacion"
                  className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
                >
                  → Bienvenida Delegado Principal
                </Link>
                <Link
                  href="/bienvenida-delegado-suplente"
                  className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
                >
                  → Bienvenida Delegado Suplente
                </Link>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Páginas de Formación</h3>
              <div className="space-y-2">
                <Link
                  href="/formacion-lopivi"
                  className="block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-center"
                >
                  → Formación LOPIVI
                </Link>
                <Link
                  href="/test-evaluacion"
                  className="block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-center"
                >
                  → Test de Evaluación
                </Link>
              </div>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">Páginas de Login</h3>
              <div className="space-y-2">
                <Link
                  href="/login-delegados?tipo=principal"
                  className="block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-center"
                >
                  → Login Delegados Principal
                </Link>
                <Link
                  href="/login-delegados?tipo=suplente"
                  className="block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-center"
                >
                  → Login Delegados Suplente
                </Link>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Debug y Test</h3>
              <div className="space-y-2">
                <Link
                  href="/debug-navegacion"
                  className="block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-center"
                >
                  → Debug Navegación
                </Link>
                <Link
                  href="/test-navegacion"
                  className="block bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700 text-center"
                >
                  → Test Navegación
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-2">⚠️ Notas sobre el Test</h3>
          <ul className="text-yellow-800 space-y-1 text-sm">
            <li>• Esta página bypasa toda la lógica de verificación de sesión</li>
            <li>• Si estas páginas no cargan, hay un problema estructural en el código</li>
            <li>• Si cargan pero redirigen, el problema está en la lógica de sesión</li>
            <li>• Usa esto para diagnosticar exactamente dónde está fallando el sistema</li>
          </ul>
        </div>

        <div className="text-center mt-6">
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
