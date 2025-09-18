'use client'

import Link from 'next/link'
export default function SitioPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Custodia360</span>
              </Link>
            </div>

            <div className="flex items-center space-x-8">
              <Link href="/sitio" className="text-orange-600 hover:text-orange-700 font-medium">Inicio</Link>
              <Link href="/planes" className="text-gray-700 hover:text-gray-900">Planes</Link>
              <Link href="/servicios" className="text-gray-700 hover:text-gray-900">Servicios</Link>
              <Link href="/guia" className="text-gray-700 hover:text-gray-900">Guía LOPIVI</Link>
              <Link href="/demo" className="text-gray-700 hover:text-gray-900">Demo</Link>
              <Link href="/contacto" className="text-gray-700 hover:text-gray-900">Contacto</Link>
              <Link href="/acceso" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium inline-block mb-6">
            Primera empresa automatizada de España especializada en cumplimiento LOPIVI
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Cumplimiento <span className="text-orange-600">LOPIVI</span><br />
            100% Automatizado
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La única plataforma que garantiza el cumplimiento completo de la Ley Orgánica de Protección Integral de la Infancia y la Adolescencia sin complicaciones.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/planes"
              className="bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition-colors"
            >
              Ver Planes y Precios
            </Link>
            <Link
              href="/demo"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
            >
              Probar Demo Gratuita
            </Link>
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-left mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🎯 Garantía Legal Total</h3>
                <p className="text-gray-600">
                  Si tu entidad recibe una inspección y no cumple algún requisito LOPIVI usando nuestro sistema,
                  <span className="font-bold text-orange-600"> nos hacemos cargo de todas las consecuencias legales</span>.
                </p>
              </div>
              <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-bold text-lg">
                100% Garantizado
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para cumplir la LOPIVI
            </h2>
            <p className="text-xl text-gray-600">
              Plataforma completa de gestión LOPIVI con delegado de protección incluido
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl mb-6">
                👥
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delegado de Protección</h3>
              <p className="text-gray-700 mb-4">
                Profesional certificado especializado en LOPIVI asignado a tu entidad.
                Disponible 24/7 para emergencias y gestión completa del cumplimiento.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Formación especializada LOPIVI</li>
                <li>✓ Certificado de antecedentes penales</li>
                <li>✓ Disponibilidad inmediata</li>
                <li>✓ Delegado suplente opcional</li>
              </ul>
            </div>

            <div className="bg-green-50 p-8 rounded-xl">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center text-white text-2xl mb-6">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dashboard Inteligente</h3>
              <p className="text-gray-700 mb-4">
                Panel de control automatizado que monitoriza el cumplimiento LOPIVI
                en tiempo real y te alerta de cualquier acción necesaria.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Monitorización 24/7</li>
                <li>✓ Alertas automáticas</li>
                <li>✓ Informes de cumplimiento</li>
                <li>✓ Gestión de documentación</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-8 rounded-xl">
              <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center text-white text-2xl mb-6">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Protocolo de Emergencia</h3>
              <p className="text-gray-700 mb-4">
                Sistema de respuesta inmediata ante cualquier incidente, con
                protocolos automáticos y contacto directo con autoridades.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Activación inmediata</li>
                <li>✓ Contacto con autoridades</li>
                <li>✓ Documentación automática</li>
                <li>✓ Seguimiento del caso</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/planes" className="bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition-colors">
              Ver Todos los Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Planes adaptados a tu entidad</h2>
            <p className="text-xl text-gray-600">Precios transparentes según el número de menores bajo tu custodia</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Plan 50</h3>
              <div className="text-3xl font-bold text-orange-600 mb-4">19€<span className="text-lg text-gray-500">/mes</span></div>
              <p className="text-gray-600 mb-4">1-50 menores</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>✓ Delegado de protección</div>
                <div>✓ Dashboard automatizado</div>
                <div>✓ Protocolo emergencias</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Plan 200</h3>
              <div className="text-3xl font-bold text-orange-600 mb-4">49€<span className="text-lg text-gray-500">/mes</span></div>
              <p className="text-gray-600 mb-4">51-200 menores</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>✓ Todo del Plan 50</div>
                <div>✓ Formación avanzada</div>
                <div>✓ Soporte prioritario</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-orange-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">Más Popular</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Plan 500</h3>
              <div className="text-3xl font-bold text-orange-600 mb-4">105€<span className="text-lg text-gray-500">/mes</span></div>
              <p className="text-gray-600 mb-4">201-500 menores</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>✓ Todo del Plan 200</div>
                <div>✓ Auditorías trimestrales</div>
                <div>✓ Consultoría personalizada</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Plan 500+</h3>
              <div className="text-3xl font-bold text-orange-600 mb-4">250€<span className="text-lg text-gray-500">/mes</span></div>
              <p className="text-gray-600 mb-4">+501 menores</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>✓ Todo del Plan 500</div>
                <div>✓ Delegado dedicado</div>
                <div>✓ Gestión enterprise</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/planes" className="bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition-colors">
              Ver Planes Completos
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para garantizar el cumplimiento LOPIVI?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Únete a las entidades que ya confían en Custodia360 para proteger a los menores
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contratar/datos-entidad" className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              Contratar Ahora
            </Link>
            <Link href="/demo" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors">
              Ver Demo Gratuita
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-xl font-bold">Custodia360</span>
              </div>
              <p className="text-gray-400 text-sm">
                Primera empresa automatizada de España especializada en cumplimiento LOPIVI
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Servicios</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/planes" className="hover:text-white">Planes y Precios</Link></li>
                <li><Link href="/servicios" className="hover:text-white">Servicios</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
                <li><Link href="/guia" className="hover:text-white">Guía LOPIVI</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Soporte</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
                <li><Link href="/acceso" className="hover:text-white">Portal de Acceso</Link></li>
                <li><Link href="/formacion-delegado" className="hover:text-white">Formación</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacidad" className="hover:text-white">Política de Privacidad</Link></li>
                <li><Link href="/terminos" className="hover:text-white">Términos de Servicio</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Política de Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Sportsmotherland, S.L. - Custodia360. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
