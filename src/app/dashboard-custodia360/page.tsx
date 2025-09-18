import Link from 'next/link'

export default function DashboardCustodia360() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Custodia360</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Panel Administrativo</h2>
          <p className="text-gray-600 mb-6">
            Bienvenido al panel administrativo de Custodia360. Aquí puedes gestionar todas las entidades y configuraciones del sistema.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/dashboard-custodia360/contactos" className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600">
              Gestionar Contactos
            </Link>

            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-bold">Estadísticas</h3>
              <p className="text-sm text-gray-600">Entidades activas: 156</p>
            </div>

            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-bold">Sistema</h3>
              <p className="text-sm text-gray-600">Estado: Operativo</p>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/login-delegados" className="text-blue-600 hover:text-blue-700">
              ← Volver al menú principal
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
