'use client'

import Link from 'next/link'

export default function ContratarCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Cancel Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pago Cancelado
          </h1>
          <p className="text-gray-600">
            No se ha realizado ningún cargo
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <p className="text-gray-700 mb-4">
            Has cancelado el proceso de pago. No te preocupes, puedes intentarlo de nuevo cuando quieras.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">¿Por qué elegir Custodia360?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Implementación LOPIVI completa en 72 horas</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Formación y certificación oficial incluida</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Panel de gestión automatizado</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Soporte técnico continuo</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <Link
            href="/onboarding"
            className="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Intentar de Nuevo
          </Link>

          <Link
            href="/"
            className="block w-full bg-gray-200 text-gray-700 text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>

        {/* Contacto */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda? Contacta con nosotros en{' '}
            <a href="mailto:soporte@custodia360.es" className="text-blue-600 hover:underline">
              soporte@custodia360.es
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
