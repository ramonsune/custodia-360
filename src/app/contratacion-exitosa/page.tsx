'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ContratacionExitosaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError('No se encontró información del pago')
      setLoading(false)
      return
    }

    // Verificar sesión de Stripe
    fetch(`/api/stripe/verify-payment?session_id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPaymentData(data.session)
        } else {
          setError(data.error || 'Error al verificar el pago')
        }
      })
      .catch(err => {
        console.error('Error verificando pago:', err)
        setError('Error de conexión')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando tu pago...</p>
        </div>
      </div>
    )
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/contratar"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors inline-block"
          >
            Volver a Intentar
          </Link>
        </div>
      </div>
    )
  }

  const amountPaid = paymentData.amount_total / 100 // Stripe usa centavos

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        {/* Icono de éxito */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Pago Realizado Exitosamente!
          </h1>
          <p className="text-gray-600">
            Tu contratación de Custodia360 se ha completado correctamente
          </p>
        </div>

        {/* Información del pago */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Primer Pago</p>
              <p className="text-2xl font-bold text-gray-900">
                {amountPaid.toFixed(2)}€
              </p>
              <p className="text-xs text-gray-500">(IVA incluido)</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Estado</p>
              <p className="text-lg font-bold text-green-600">Pagado</p>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>

        {/* Próximos pasos */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📧 Próximos Pasos</h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Revisa tu email</p>
                <p className="text-sm text-gray-600">
                  Recibirás un correo con:
                </p>
                <ul className="text-sm text-gray-600 mt-1 ml-4 list-disc">
                  <li>Tu factura del primer pago</li>
                  <li>Credenciales de acceso al panel de entidad</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Delegado recibirá formación</p>
                <p className="text-sm text-gray-600">
                  El delegado principal recibirá un email con el link para completar su formación LOPIVI obligatoria.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-green-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Accede a tu dashboard</p>
                <p className="text-sm text-gray-600">
                  Usa las credenciales del email para acceder a tu panel de gestión.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recordatorio del segundo pago */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-blue-900 text-sm">Segundo Pago en 6 Meses</p>
              <p className="text-sm text-blue-800 mt-1">
                Recibirás un recordatorio 30 días antes del segundo pago.
                El cobro se realizará automáticamente con la misma tarjeta.
              </p>
            </div>
          </div>
        </div>

        {/* Botón para ir al login */}
        <div className="text-center">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
          >
            Ir al Panel de Acceso
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            ¿Necesitas ayuda? <a href="mailto:soporte@custodia360.es" className="text-blue-600 hover:underline">Contacta con soporte</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ContratacionExitosa() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <ContratacionExitosaContent />
    </Suspense>
  )
}
