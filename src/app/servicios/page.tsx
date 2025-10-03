import Link from 'next/link'

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-6">
              Servicios <span className="text-blue-800">Custodia360</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Implementación completa de la normativa LOPIVI y plan de protección infantil
            </p>
            <div className="inline-block bg-black text-white px-6 py-2 rounded-full font-bold">
              Implementación en 72 horas
            </div>
          </div>

          {/* Ecosistema Visual de Dashboards */}
          <div className="relative mt-12">
            <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Dashboard Delegado */}
              <div className="transform hover:scale-105 transition-transform">
                <div className="bg-white border border-gray-300 rounded-xl shadow-2xl p-3">
                  <div className="bg-white rounded-lg">
                    <div className="bg-gray-100 rounded-t-lg px-3 py-2 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">Dashboard Delegado/a</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-800">Control de Protección</h3>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Activo</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-xs text-gray-600">Casos Activos</span>
                          <span className="text-xs font-bold text-blue-600">3</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-xs text-gray-600">Protocolos</span>
                          <span className="text-xs font-bold text-green-600">12</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-xs text-gray-600">Formación</span>
                          <span className="text-xs font-bold text-purple-600">100%</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <div className="h-12 bg-gray-800 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Gestión de Casos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Central - Contratante */}
              <div className="transform hover:scale-105 transition-transform lg:-mt-6">
                <div className="bg-white border border-gray-300 rounded-xl shadow-2xl p-3">
                  <div className="bg-white rounded-lg">
                    <div className="bg-gray-100 rounded-t-lg px-3 py-2 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">Dashboard Entidad</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-800">Centro de Control</h3>
                        <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">Principal</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-orange-50 p-2 rounded text-center">
                          <div className="text-lg font-bold text-orange-600">247</div>
                          <div className="text-xs text-gray-600">Menores</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded text-center">
                          <div className="text-lg font-bold text-green-600">100%</div>
                          <div className="text-xs text-gray-600">LOPIVI</div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-600 mb-2">Cumplimiento Global</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="h-8 bg-orange-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Plan de Protección</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Admin */}
              <div className="transform hover:scale-105 transition-transform">
                <div className="bg-white border border-gray-300 rounded-xl shadow-2xl p-3">
                  <div className="bg-white rounded-lg">
                    <div className="bg-gray-100 rounded-t-lg px-3 py-2 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">Dashboard Admin</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-800">Gestión Global</h3>
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">Admin</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 mb-3">
                        <div className="bg-purple-50 p-1 rounded text-center">
                          <div className="text-sm font-bold text-purple-600">847</div>
                          <div className="text-xs text-gray-500">Ent.</div>
                        </div>
                        <div className="bg-pink-50 p-1 rounded text-center">
                          <div className="text-sm font-bold text-pink-600">1.2k</div>
                          <div className="text-xs text-gray-500">Del.</div>
                        </div>
                        <div className="bg-indigo-50 p-1 rounded text-center">
                          <div className="text-sm font-bold text-indigo-600">98%</div>
                          <div className="text-xs text-gray-500">Act.</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 bg-purple-100 rounded"></div>
                        <div className="h-6 bg-purple-200 rounded"></div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <div className="h-12 bg-gray-800 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Control Total</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Servicios Principales */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">¿Qué incluye nuestro servicio?</h2>
            <p className="text-xl text-gray-600">Todo lo necesario para implementar la LOPIVI y un Plan de Protección</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Delegado de Protección */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Delegado/a de Protección</h3>
              <p className="text-gray-600 mb-6">
                Designación del delegado según normativa LOPIVI.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Formación</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Certificación</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Actualizaciones normativas continuas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Soporte técnico</span>
                </li>
              </ul>
            </div>

            {/* Plan de Protección */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Plan de Protección</h3>
              <p className="text-gray-600 mb-6">
                Desarrollo del plan de protección para tu entidad.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Plan por entidad</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Protocolos de actuación específicos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Código de conducta profesional</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Documentación completa LOPIVI</span>
                </li>
              </ul>
            </div>

            {/* Formación Personal */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Formación Personal</h3>
              <p className="text-gray-600 mb-6">
                Formación del personal que trabaja con menores.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span>Formación online</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span>Certificados</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span>Material didáctico incluido</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span>Seguimiento y recordatorios</span>
                </li>
              </ul>
            </div>

            {/* Sistema de Gestión */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Sistema de Gestión</h3>
              <p className="text-gray-600 mb-6">
                Plataforma digital completa para gestionar todo el cumplimiento LOPIVI.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Dashboard completo del delegado</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Protocolo para la gestión de casos y incidentes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Informes automáticos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Acceso 24/7 desde cualquier lugar</span>
                </li>
              </ul>
            </div>

            {/* Comunicación Familias */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">

              <h3 className="text-xl font-bold text-gray-700 mb-4">Comunicación Familias</h3>
              <p className="text-gray-600 mb-6">
                Sistema completo de comunicación e información para las familias.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Comunicados automáticos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Información transparente del proceso</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Canal directo de comunicación de la entidad</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Documentación digital accesible</span>
                </li>
              </ul>
            </div>

            {/* Mantenimiento */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Mantenimiento Continuo</h3>
              <p className="text-gray-600 mb-6">
                Mantenimiento y actualizaciones automáticas para garantizar el cumplimiento.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span>Actualizaciones normativas automáticas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span>Renovación de documentación</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span>Soporte técnico</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✓</span>
                  <span>Monitoreo continuo del cumplimiento</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso de Implementación */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Proceso de Implementación</h2>
            <p className="text-xl text-gray-600">Así implementamos la LOPIVI en tu entidad</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-700 mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Configuración</h3>
              <p className="text-gray-600">
                Configuramos todos los sistemas, documentos y protocolos para tu entidad.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-gray-700 mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Formación</h3>
              <p className="text-gray-600">
                Formamos al personal y certificamos al delegado de protección de tu entidad.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-gray-700 mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Activación</h3>
              <p className="text-gray-600">
                Activamos el sistema completo y cumpliendo la LOPIVI.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para proteger tu entidad?</h2>
          <p className="text-xl mb-8">Implementa LOPIVI en 72 horas y protege a todos los menores</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/planes"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Ver Planes y Precios
            </Link>
            <Link
              href="/guia"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-colors"
            >
              Guía de Implementación
            </Link>
            <Link
              href="/demo"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-colors"
            >
              Ver Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
