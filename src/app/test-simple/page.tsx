export default function TestSimple() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Servidor Funcionando
        </h1>
        <p className="text-gray-700 mb-6">
          El sistema de Custodia360 está operativo
        </p>
        <div className="space-y-2">
          <a
            href="/dashboard-custodia360"
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Dashboard Principal
          </a>
          <a
            href="/dashboard-custodia360/monitoreo-boe"
            className="block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            🔍 Monitoreo BOE
          </a>
          <a
            href="/test-email"
            className="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Test Emails
          </a>
        </div>
      </div>
    </div>
  )
}
