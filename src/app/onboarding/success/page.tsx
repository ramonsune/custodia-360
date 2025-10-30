'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ContratarSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de confirmación
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Confirmando pago...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Pago Recibido!
          </h1>
          <p className="text-gray-600">
            Tu contratación se ha procesado exitosamente
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Revisa tu correo</h3>
                <p className="text-sm text-gray-600">
                  Hemos enviado tus credenciales de acceso y el enlace a la formación LOPIVI
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Accede a la plataforma</h3>
                <p className="text-sm text-gray-600">
                  Inicia sesión con el email y contraseña temporal que te hemos enviado
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Completa la formación</h3>
                <p className="text-sm text-gray-600">
                  Completa los 5 pasos de formación LOPIVI (20-30 minutos)
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">¡Listo!</h3>
                <p className="text-sm text-gray-600">
                  Accede a tu panel de Delegado Principal y gestiona tu entidad
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de acción */}
        <Link
          href="/login"
          className="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
        >
          Ir a Iniciar Sesión
        </Link>

        {/* Info adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 text-center">
            <strong>Nota:</strong> Si no recibes el email en 5 minutos, revisa tu carpeta de spam o contacta con{' '}
            <a href="mailto:soporte@custodia360.es" className="underline">soporte@custodia360.es</a>
          </p>
        </div>

        {/* Session ID (debug) */}
        {sessionId && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              ID de sesión: {sessionId.substring(0, 20)}...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
