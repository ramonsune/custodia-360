import Link from 'next/link'

export default function EntradaPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-6 sm:p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl font-bold">C</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Custodia360</h1>
          <p className="text-gray-600 text-lg">
            Cumplimiento LOPIVI en 72 horas
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Primera empresa con un sistema automatizado de España
          </p>
        </div>

        {/* Botón Principal para Explorar */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">¿Quieres conocer Custodia360?</h2>
          <p className="text-gray-600 mb-6 text-center">
            Descubre cómo proteger tu entidad y cumplir la normativa LOPIVI automáticamente
          </p>

          <Link
            href="/"
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors block text-center mb-4"
          >
            Explorar Custodia360
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/planes"
              className="bg-blue-50 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-100 transition-colors text-center text-sm"
            >
              Ver Planes
            </Link>
            <Link
              href="/demo"
              className="bg-purple-50 text-purple-700 py-3 rounded-lg font-medium hover:bg-purple-100 transition-colors text-center text-sm"
            >
              Ver Demo
            </Link>
          </div>
        </div>

        {/* Separator */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">o</span>
          </div>
        </div>

        {/* Acceso para Delegados */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-4">¿Eres delegado de protección?</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Accede a tu dashboard para gestionar el cumplimiento LOPIVI
          </p>

          <Link
            href="/acceso"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors block text-center"
          >
            Acceso
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">
            Protección infantil garantizada · Implementación automática
          </p>
          <p className="text-xs text-gray-400">
            © 2025 Custodia360. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
