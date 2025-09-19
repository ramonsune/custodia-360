'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function CookiesPage() {
  const [showPreferences, setShowPreferences] = useState(false)

  const openPreferences = () => {
    // Limpiar el consentimiento para que aparezca el banner
    localStorage.removeItem('cookie-consent')
    // Recargar la página para mostrar el banner
    window.location.reload()
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
            ← Volver a Inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Política de Cookies
          </h1>
          <p className="text-gray-600">
            Última actualización: 25 de agosto de 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Qué son las Cookies?</h2>
              <p className="text-gray-700 mb-4">
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo
                cuando visita un sitio web. Nos ayudan a hacer que el sitio web funcione de
                manera más eficiente, proporcionar información de análisis y mejorar su experiencia.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Cómo Utilizamos las Cookies?</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos cookies para varios propósitos, que se detallan a continuación:
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tipos de Cookies que Utilizamos</h2>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Cookies Estrictamente Necesarias</h3>
                  <p className="text-gray-700 mb-2">
                    Estas cookies son esenciales para que pueda navegar por el sitio web y utilizar sus funciones.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Cookies de sesión para el funcionamiento del sitio</li>
                    <li>Cookies de seguridad para proteger contra ataques</li>
                    <li>Cookies de preferencias de idioma</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2 font-medium">
                    Base legal: Interés legítimo - No requiere consentimiento
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Cookies de Funcionalidad</h3>
                  <p className="text-gray-700 mb-2">
                    Estas cookies permiten que el sitio web recuerde las opciones que hace y
                    proporcionan funciones mejoradas y más personales.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Recordar datos de formularios</li>
                    <li>Preferencias de visualización</li>
                    <li>Configuración de accesibilidad</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2 font-medium">
                    Base legal: Consentimiento
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Cookies de Análisis</h3>
                  <p className="text-gray-700 mb-2">
                    Estas cookies nos ayudan a entender cómo los visitantes interactúan con
                    nuestro sitio web recopilando y reportando información de forma anónima.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Google Analytics (datos anonimizados)</li>
                    <li>Estadísticas de uso del sitio</li>
                    <li>Información sobre errores técnicos</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2 font-medium">
                    Base legal: Consentimiento
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Cookies de Marketing</h3>
                  <p className="text-gray-700 mb-2">
                    Estas cookies se utilizan para mostrar anuncios que son relevantes para
                    usted y sus intereses.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Seguimiento de conversiones</li>
                    <li>Personalización de contenido</li>
                    <li>Medición de efectividad publicitaria</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2 font-medium">
                    Base legal: Consentimiento
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies de Terceros</h2>
              <p className="text-gray-700 mb-4">
                También utilizamos servicios de terceros que pueden establecer cookies en su dispositivo:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Servicio</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Propósito</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Google Analytics</td>
                      <td className="border border-gray-300 px-4 py-2">Análisis de tráfico web</td>
                      <td className="border border-gray-300 px-4 py-2">2 años</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Netlify</td>
                      <td className="border border-gray-300 px-4 py-2">Hosting y CDN</td>
                      <td className="border border-gray-300 px-4 py-2">Sesión</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Stripe</td>
                      <td className="border border-gray-300 px-4 py-2">Procesamiento de pagos</td>
                      <td className="border border-gray-300 px-4 py-2">Según necesidad</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cómo Controlar las Cookies</h2>
              <p className="text-gray-700 mb-4">
                Puede controlar y/o eliminar las cookies como desee. Para obtener detalles,
                consulte aboutcookies.org. Puede eliminar todas las cookies que ya están en
                su computadora y puede configurar la mayoría de los navegadores para evitar
                que se coloquen.
              </p>

              <div className="mb-6">
                <button
                  onClick={openPreferences}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                >
                  Gestionar Preferencias de Cookies
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Haga clic para configurar qué tipos de cookies desea permitir en nuestro sitio web.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Configuración por Navegador:</h3>
                <ul className="list-disc list-inside text-blue-800 space-y-1 ml-4">
                  <li><span className="font-medium">Chrome:</span> Configuración &gt; Privacidad y seguridad &gt; Cookies</li>
                  <li><span className="font-medium">Firefox:</span> Opciones &gt; Privacidad y seguridad &gt; Cookies</li>
                  <li><span className="font-medium">Safari:</span> Preferencias &gt; Privacidad &gt; Cookies</li>
                  <li><span className="font-medium">Edge:</span> Configuración &gt; Privacidad y servicios &gt; Cookies</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <span className="font-semibold">Nota:</span> Si deshabilita las cookies,
                  algunas funciones de nuestro sitio web pueden no funcionar correctamente.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sus Derechos</h2>
              <p className="text-gray-700 mb-4">
                En relación con las cookies y el tratamiento de datos personales, usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Retirar su consentimiento en cualquier momento</li>
                <li>Solicitar información sobre las cookies utilizadas</li>
                <li>Configurar sus preferencias de cookies</li>
                <li>Ejercer los derechos establecidos en nuestra Política de Privacidad</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contacto</h2>
              <p className="text-gray-700 mb-4">
                Si tiene alguna pregunta sobre nuestra política de cookies, puede contactarnos:
              </p>
              <div className="text-gray-700">
                <p>Email: info@custodia360.es</p>
                <p>Teléfono: 678 771 198</p>
                <p>Dirección: Barcelona, España</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cambios en esta Política</h2>
              <p className="text-gray-700">
                Podemos actualizar nuestra política de cookies de vez en cuando. Le notificaremos
                cualquier cambio publicando la nueva política de cookies en esta página y
                actualizando la fecha de "última actualización".
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
