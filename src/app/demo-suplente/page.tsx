'use client'

export default function DemoSuplente() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-400 text-black p-4 rounded-lg mb-6 font-bold text-center">
          🎭 MODO DEMO - PANEL DELEGADO SUPLENTE
        </div>

        <h1 className="text-3xl font-bold mb-4">Dashboard Suplente DEMO</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-4">
          <h2 className="text-xl font-semibold mb-2">✅ FUNCIONA!</h2>
          <p>Esta es una página de prueba sin verificación de sesión.</p>
          <p className="mt-2">Usuario: <strong>delegados@custodia.com</strong></p>
        </div>

        <div className="space-y-2">
          <a href="/demo-entidad" className="block bg-orange-600 text-white p-4 rounded-lg text-center hover:bg-orange-700">
            Ir a Demo Entidad
          </a>
          <a href="/demo-delegado" className="block bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700">
            Ir a Demo Delegado
          </a>
          <a href="/demo-admin" className="block bg-red-600 text-white p-4 rounded-lg text-center hover:bg-red-700">
            Ir a Demo Admin
          </a>
        </div>
      </div>
    </div>
  )
}
