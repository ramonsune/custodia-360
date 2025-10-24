'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function UpdateCardForm({ token }: { token: string }) {
  const stripe = useStripe()
  const elements = useElements()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [entityName, setEntityName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Crear Setup Intent
      const response = await fetch('/api/payment/update-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Error al crear sesión')
      }

      setEntityName(data.entity_name)

      // Confirmar Setup Intent con Stripe
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Error cargando formulario de tarjeta')
      }

      const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(
        data.client_secret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      )

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      if (setupIntent && setupIntent.status === 'succeeded') {
        // Confirmar actualización en backend
        const confirmResponse = await fetch('/api/payment/update-card', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            setup_intent_id: setupIntent.id,
          }),
        })

        const confirmData = await confirmResponse.json()

        if (!confirmData.success) {
          throw new Error(confirmData.error || 'Error confirmando actualización')
        }

        setSuccess(true)
      }

    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Error al actualizar tarjeta')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ✅ Tarjeta Actualizada
        </h2>
        <p className="text-gray-600 mb-4">
          Tu método de pago ha sido actualizado correctamente para <strong>{entityName}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Recibirás un email de confirmación en breve.
          El próximo pago se procesará automáticamente con la nueva tarjeta.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nueva Tarjeta de Crédito/Débito
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-blue-800 text-sm">
          <strong>Seguridad:</strong> Tu información de pago es procesada de forma segura por Stripe.
          Custodia360 no almacena los datos de tu tarjeta.
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Actualizando...' : 'Actualizar Tarjeta'}
      </button>
    </form>
  )
}

function ActualizarTarjetaPageContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [validating, setValidating] = useState(true)
  const [validToken, setValidToken] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setErrorMessage('Token no proporcionado')
      setValidating(false)
      return
    }

    // Validar token (opcional - se valida en el backend también)
    setValidToken(true)
    setValidating(false)
  }, [token])

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!validToken || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso No Válido</h1>
          <p className="text-gray-600 mb-6">
            {errorMessage || 'El enlace de actualización no es válido o ha expirado.'}
          </p>
          <p className="text-sm text-gray-500">
            Si necesitas actualizar tu método de pago, contacta con soporte en{' '}
            <a href="mailto:soporte@custodia360.es" className="text-blue-600 hover:underline">
              soporte@custodia360.es
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Actualizar Método de Pago
          </h1>
          <p className="text-gray-600">
            Actualiza tu tarjeta de forma segura para futuros pagos
          </p>
        </div>

        {/* Form with Stripe Elements */}
        <Elements stripe={stripePromise}>
          <UpdateCardForm token={token} />
        </Elements>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda?{' '}
            <a href="mailto:soporte@custodia360.es" className="text-blue-600 hover:underline">
              Contacta con soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ActualizarTarjetaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <ActualizarTarjetaPageContent />
    </Suspense>
  )
}
