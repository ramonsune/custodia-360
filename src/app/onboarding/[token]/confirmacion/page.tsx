import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface ConfirmacionPageProps {
  params: {
    token: string
  }
}

export default function ConfirmacionPage({ params }: ConfirmacionPageProps) {
  const { token } = params

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          {/* Icono de éxito */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Registro Completado!
          </h1>

          {/* Mensaje principal */}
          <div className="mb-8">
            <p className="text-lg text-gray-700 mb-4">
              Tu registro ha sido recibido correctamente.
            </p>
            <p className="text-gray-600">
              Recibirás un email de confirmación cuando tu registro sea validado por el Delegado/a de Protección de la entidad.
            </p>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Próximos Pasos
            </h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Recibirás un email de confirmación en las próximas 24-48 horas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>El Delegado/a de Protección validará tu información</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Si tu rol requiere formación LOPIVI, recibirás las instrucciones de acceso</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>Te enviaremos los accesos al sistema de gestión correspondiente</span>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-sm text-gray-600">
            <p>
              <strong className="text-gray-900">¿Tienes preguntas?</strong>
            </p>
            <p className="mt-2">
              Revisa el email de confirmación que te enviaremos con la información de contacto del Delegado/a de Protección.
            </p>
          </div>

          {/* Botón */}
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Volver al Inicio
          </Link>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Sistema de protección de la infancia · Cumplimiento LOPIVI
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Custodia360 - Protección Integral Infantil
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
