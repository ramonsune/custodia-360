import Link from 'next/link'

export default function TestNavegacion() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Test de Navegación - FUNCIONA 100%</h1>

      <div className="grid grid-cols-2 gap-4 max-w-4xl">
        <Link href="/dashboard-entidad" className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600">
          Ir a Dashboard Entidad
        </Link>

        <Link href="/dashboard-delegado" className="bg-green-500 text-white p-4 rounded hover:bg-green-600">
          Ir a Dashboard Delegado
        </Link>

        <Link href="/dashboard-suplente" className="bg-orange-500 text-white p-4 rounded hover:bg-orange-600">
          Ir a Dashboard Suplente
        </Link>

        <Link href="/formacion-delegado" className="bg-purple-500 text-white p-4 rounded hover:bg-purple-600">
          Ir a Formación Delegado
        </Link>

        <Link href="/formacion-suplente" className="bg-indigo-500 text-white p-4 rounded hover:bg-indigo-600">
          Ir a Formación Suplente
        </Link>

        <Link href="/dashboard-custodia360" className="bg-gray-500 text-white p-4 rounded hover:bg-gray-600">
          Ir a Dashboard Custodia360
        </Link>
      </div>

      <div className="mt-8">
        <Link href="/login-delegados" className="bg-black text-white p-4 rounded hover:bg-gray-800">
          Volver a Login Delegados
        </Link>
      </div>
    </div>
  )
}
