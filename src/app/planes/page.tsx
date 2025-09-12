import Link from 'next/link'

export default function PlanesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-6">
            Planes <span className="text-blue-800">Custodia360</span>
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Todos los planes están preparados para que cumplas
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Solo cambia el precio según el número de menores en tu entidad
          </p>
          <div className="inline-block bg-black text-white px-6 py-2 rounded-full font-bold">
            Implementación garantizada en 72 horas
          </div>
        </div>
      </section>

      {/* Qué incluye todos los planes */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">¿Qué incluye TODOS los planes?</h2>
            <p className="text-xl text-gray-600">Todo lo que necesitas para cumplir</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 mb-2">Delegado de Protección</h3>
              <p className="text-gray-600 text-sm">Designas y nosotros lo formamos</p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 mb-2">Plan de Protección</h3>
              <p className="text-gray-600 text-sm">Plan y protocolos de actuación específicos</p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 mb-2">Formación Personal</h3>
              <p className="text-gray-600 text-sm">Formación</p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 mb-2">Mantenimiento</h3>
              <p className="text-gray-600 text-sm">Actualizaciones automáticas y soporte continuo</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="font-bold text-yellow-800 mb-2">¿Por qué todos los planes incluyen lo mismo?</h3>
            <p className="text-yellow-700">
              La LOPIVI exige el mismo nivel de protección para todos los menores, independientemente del tamaño de la entidad.
              Por eso todos nuestros planes incluyen exactamente los mismos servicios y garantías.
            </p>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* ¿Por qué nuestros precios son tan competitivos? */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              ¿Por qué podemos ofrecer LOPIVI completa a estos precios?
            </h2>
            <p className="text-xl text-gray-600">
              La diferencia está en nuestro enfoque tecnológico vs métodos tradicionales
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Revolución Tecnológica */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Revolución Tecnológica vs Métodos Tradicionales
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-bold text-red-700">Otras empresas:</p>
                  <p className="text-gray-600 text-sm">Consultores presenciales, trabajo manual, horas de reuniones</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-bold text-green-700">Nosotros:</p>
                  <p className="text-gray-600 text-sm">Sistema 100% automatizado, sin desplazamientos, sin reuniones interminables</p>
                </div>
              </div>
            </div>

            {/* Digitalización Completa */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Hemos Digitalizado Completamente la LOPIVI
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Invertimos meses desarrollando un sistema automático</li>
                <li>• Lo que antes tardaba 150+ horas, ahora se hace en 2 horas</li>
                <li>• Esquematizamos toda la ley para que sea automática</li>
              </ul>
            </div>
          </div>

          {/* Comparativa Real */}
          <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
            <h3 className="text-xl font-bold text-blue-900 mb-6 text-center">
              Comparativa Real de Mercado
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
                <h4 className="text-lg font-bold text-gray-700 mb-3">Consultoría Tradicional</h4>
                <div className="text-3xl font-bold text-gray-700 mb-2">3.000€ - 15.000€</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>❌ 2-6 meses de implementación</li>
                  <li>❌ Sin mantenimiento incluido</li>
                  <li>❌ Actualizaciones manuales</li>
                </ul>
              </div>
              <div className="text-center p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
                <h4 className="text-lg font-bold text-gray-700 mb-3">Custodia360</h4>
                <div className="text-3xl font-bold text-gray-700 mb-2">Desde 38€ total</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ 72 horas de implementación</li>
                  <li>✅ Mantenimiento automático incluido</li>
                  <li>✅ Actualizaciones automáticas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transparencia Total */}
          <div className="bg-blue-900 text-white rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Transparencia Total</h3>
            <p className="text-lg">
              "No hay letra pequeña. El precio que ves incluye TODO: delegado, formación,
              documentación, sistema digital, mantenimiento y actualizaciones automáticas."
            </p>
          </div>
        </div>
      </section>

=======
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
      {/* Planes Principales */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Elige tu plan según número de menores</h2>
            <p className="text-xl text-gray-600">Precios justos y transparentes</p>
<<<<<<< HEAD
            <p className="text-lg text-white mt-3 font-medium bg-blue-600 px-4 py-2 rounded-lg"><strong>Además puedes añadir un delegado suplente para cubrir bajas, vacaciones, cambios de personal, etc.</strong></p>
=======
            <p className="text-lg text-gray-600 mt-3 font-medium">Además puedes añadir un delegado suplente para cubrir bajas, vacaciones, cambios de personal, etc.</p>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
          </div>

          {/* Explicación de pagos divididos */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <h3 className="text-xl font-bold text-blue-800">Facilitamos tu contratación</h3>
            </div>
            <p className="text-blue-700 text-center text-lg font-medium mb-2">
              Todos nuestros precios se dividen en 2 pagos iguales para mayor comodidad
            </p>
            <p className="text-blue-600 text-center">
<<<<<<< HEAD
              <span className="font-bold">Ejemplo:</span> Plan 50 = 19€ hoy + 19€ a los 6 meses + IVA cada pago (Total: 38€ + IVA)
=======
              <span className="font-bold">Ejemplo:</span> Plan 50 = 11.50€ hoy + 11.50€ a los 6 meses + IVA cada pago (Total: 38€ + IVA)
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
<<<<<<< HEAD
            {/* Plan 1-100 */}
            <div className="bg-white rounded-xl border border-blue-200 p-8 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-700 mb-2">Plan 100</h3>
                <p className="text-gray-500 text-sm">Para entidades de 1 hasta 100 menores</p>
                <div className="text-5xl font-bold text-black mb-2">19€</div>
=======
            {/* Plan 1-50 */}
            <div className="bg-white rounded-xl border border-blue-200 p-8 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-700 mb-2">Plan 50</h3>
                <p className="text-gray-500 text-sm">Para entidades de 1 hasta 50 menores</p>
                <div className="text-5xl font-bold text-blue-600 mb-2">19€</div>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                <p className="text-gray-600">(+IVA) Pago inicial</p>
                <p className="text-sm text-blue-600 mt-2 font-medium">+ 19€ a los 6 meses (+IVA)</p>
                <p className="text-xs text-gray-500 mt-1">Implementación completa en 72h</p>
              </div>

              {/* Visual Dashboard Preview */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-700">Tu Dashboard Incluye:</span>
<<<<<<< HEAD
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Plan 100</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-bold text-blue-600">1-100</div>
=======
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Plan 50</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-bold text-blue-600">1-50</div>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                      <div className="text-xs text-gray-500">Menores</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-bold text-green-600">100%</div>
                      <div className="text-xs text-gray-500">LOPIVI</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-1 bg-blue-50 rounded">
                      <span className="text-xs">Delegado</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-blue-50 rounded">
                      <span className="text-xs">Protocolos</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-blue-50 rounded">
                      <span className="text-xs">Formación</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-gray-700 mb-4">✅ Todo incluido:</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">•</span>
                    <span>Delegado de protección</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">•</span>
                    <span>Delegado suplente opcional (+10€)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">•</span>
                    <span>Plan de protección</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">•</span>
                    <span>Protocolos de actuación específicos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">•</span>
                    <span>Formación</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">•</span>
                    <span>Documentación completa LOPIVI</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">•</span>
                    <span>Sistema de gestión digital</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">•</span>
                    <span>Mantenimiento y actualizaciones</span>
                  </li>

                </ul>
              </div>

              <Link
                href="/contratar/datos-entidad"
<<<<<<< HEAD
                className="w-full bg-blue-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors block text-center"
=======
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors block text-center"
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
              >
                Contratar Ahora
              </Link>
            </div>

            {/* Plan 51-200 */}
            <div className="bg-white rounded-xl border border-green-200 p-8 shadow-lg">
              <div className="text-center mb-6">
<<<<<<< HEAD
                <h3 className="text-xl font-bold text-gray-700 mb-2">Plan 250</h3>
                <p className="text-gray-500 text-sm">Para entidades de 101 hasta 250 menores</p>
                <div className="text-5xl font-bold text-black mb-2">49€</div>
=======
                <h3 className="text-xl font-bold text-gray-700 mb-2">Plan 200</h3>
                <p className="text-gray-500 text-sm">Para entidades de 51 hasta 200 menores</p>
                <div className="text-5xl font-bold text-green-600 mb-2">49€</div>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                <p className="text-gray-600">(+IVA) Pago inicial</p>
                <p className="text-sm text-green-600 mt-2 font-medium">+ 49€ a los 6 meses (+IVA)</p>
                <p className="text-xs text-gray-500 mt-1">Implementación completa en 72h</p>
              </div>

              {/* Visual Dashboard Preview */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-700">Tu Dashboard Incluye:</span>
<<<<<<< HEAD
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Plan 250</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-bold text-green-600">101-250</div>
=======
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Plan 200</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-bold text-green-600">51-200</div>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                      <div className="text-xs text-gray-500">Menores</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-bold text-green-600">100%</div>
                      <div className="text-xs text-gray-500">LOPIVI</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-1 bg-green-50 rounded">
                      <span className="text-xs">Delegado</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-green-50 rounded">
                      <span className="text-xs">Protocolos</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-green-50 rounded">
                      <span className="text-xs">Formación</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-gray-700 mb-4">✅ Todo incluido:</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">•</span>
                    <span>Delegado de protección</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">•</span>
                    <span>Delegado suplente opcional (+10€)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">•</span>
                    <span>Plan de protección</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">•</span>
                    <span>Protocolos de actuación específicos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">•</span>
                    <span>Formación</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">•</span>
                    <span>Documentación completa LOPIVI</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">•</span>
                    <span>Sistema de gestión digital</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">•</span>
                    <span>Mantenimiento y actualizaciones</span>
                  </li>

                </ul>
              </div>

              <Link
                href="/contratar/datos-entidad"
                className="w-full bg-blue-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors block text-center"
              >
                Contratar Ahora
              </Link>
            </div>

            {/* Plan 201-500 */}
            <div className="bg-white rounded-xl border border-purple-200 p-8 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-700 mb-2">Plan 500</h3>
<<<<<<< HEAD
                <p className="text-gray-500 text-sm">Para entidades de 251 hasta 500 menores</p>
                <div className="text-5xl font-bold text-black mb-2">105€</div>
=======
                <p className="text-gray-500 text-sm">Para entidades de 201 hasta 500 menores</p>
                <div className="text-5xl font-bold text-purple-600 mb-2">105€</div>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                <p className="text-gray-600">(+IVA) Pago inicial</p>
                <p className="text-sm text-purple-600 mt-2 font-medium">+ 105€ a los 6 meses (+IVA)</p>
                <p className="text-xs text-gray-500 mt-1">Implementación completa en 72h</p>
              </div>

              {/* Visual Dashboard Preview */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-700">Tu Dashboard Incluye:</span>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">Plan 500</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 p-2 rounded text-center">
<<<<<<< HEAD
                      <div className="text-sm font-bold text-purple-600">251-500</div>
=======
                      <div className="text-sm font-bold text-purple-600">201-500</div>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                      <div className="text-xs text-gray-500">Menores</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-bold text-purple-600">100%</div>
                      <div className="text-xs text-gray-500">LOPIVI</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-1 bg-purple-50 rounded">
                      <span className="text-xs">Delegado</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-purple-50 rounded">
                      <span className="text-xs">Protocolos</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-purple-50 rounded">
                      <span className="text-xs">Formación</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-gray-700 mb-4">✅ Todo incluido:</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 font-bold">•</span>
                    <span>Delegado de protección</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 font-bold">•</span>
                    <span>Delegado suplente opcional (+10€)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 font-bold">•</span>
                    <span>Plan de protección</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 font-bold">•</span>
                    <span>Protocolos de actuación específicos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 font-bold">•</span>
                    <span>Formación</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 font-bold">•</span>
                    <span>Documentación completa LOPIVI</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 font-bold">•</span>
                    <span>Sistema de gestión digital</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 font-bold">•</span>
                    <span>Mantenimiento y actualizaciones</span>
                  </li>

                </ul>
              </div>

              <Link
                href="/contratar/datos-entidad"
<<<<<<< HEAD
                className="w-full bg-blue-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors block text-center"
=======
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors block text-center"
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
              >
                Contratar Ahora
              </Link>
            </div>
          </div>

          {/* Planes adicionales */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan +501 */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-700 mb-2">Plan 500+</h3>
                <p className="text-gray-500 text-sm">Para entidades de 501 menores en adelante</p>
                <div className="text-5xl font-bold text-gray-700 mb-2">250€</div>
                <p className="text-gray-600">(+IVA) Pago inicial</p>
<<<<<<< HEAD
                <p className="text-sm text-gray-600 mt-2 font-bold">+ 250€ a los 6 meses (+IVA)</p>
=======
                <p className="text-sm text-gray-600 mt-2 font-medium">+ 250€ a los 6 meses (+IVA)</p>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                <p className="text-xs text-gray-500 mt-1">Para entidades multideporte</p>
              </div>

              {/* Visual Dashboard Preview */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-700">Tu Dashboard Incluye:</span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Plan 500+</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-bold text-gray-700">500+</div>
                      <div className="text-xs text-gray-500">Menores</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-bold text-gray-700">100%</div>
                      <div className="text-xs text-gray-500">LOPIVI</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-1 bg-gray-50 rounded">
                      <span className="text-xs">Delegado</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-gray-50 rounded">
                      <span className="text-xs">Protocolos</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-gray-50 rounded">
                      <span className="text-xs">Formación</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-gray-700 mb-4">✅ Todo incluido:</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2 font-bold">•</span>
                    <span>Delegado de protección</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2 font-bold">•</span>
                    <span>Delegado suplente opcional (+10€)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2 font-bold">•</span>
                    <span>Plan de protección</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2 font-bold">•</span>
                    <span>Protocolos de actuación específicos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2 font-bold">•</span>
                    <span>Formación</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2 font-bold">•</span>
                    <span>Documentación completa LOPIVI</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2 font-bold">•</span>
                    <span>Sistema de gestión digital</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2 font-bold">•</span>
                    <span>Mantenimiento y actualizaciones</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/contratar/datos-entidad"
                className="w-full bg-blue-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors block text-center"
              >
                Contratar Ahora
              </Link>
            </div>

            {/* Custodia Temporal */}
            <div className="bg-white rounded-xl border border-yellow-200 p-8 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-700 mb-2">Custodia Temporal</h3>
                <p className="text-gray-500 text-sm">Para eventos, torneos y campus de hasta 60 días</p>
<<<<<<< HEAD
                <div className="text-5xl font-bold text-black mb-2">100€</div>
=======
                <div className="text-5xl font-bold text-yellow-600 mb-2">39€</div>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                <p className="text-gray-600">(+IVA) Pago único</p>
                <p className="text-sm text-yellow-600 mt-2 font-medium">Protección temporal completa</p>
                <p className="text-xs text-gray-500 mt-1">Cobertura integral del evento</p>
              </div>

              {/* Visual Dashboard Preview */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-700">Tu Dashboard Incluye:</span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Temporal</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-bold text-yellow-600">60 días</div>
                      <div className="text-xs text-gray-500">Duración</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-sm font-bold text-yellow-600">100%</div>
                      <div className="text-xs text-gray-500">LOPIVI</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-1 bg-yellow-50 rounded">
                      <span className="text-xs">Delegado</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-yellow-50 rounded">
                      <span className="text-xs">Protocolos</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-yellow-50 rounded">
                      <span className="text-xs">Formación</span>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-gray-700 mb-4">✅ Todo incluido:</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2 font-bold">•</span>
                    <span>Delegado de protección temporal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2 font-bold">•</span>
                    <span>Delegado suplente opcional (+10€)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2 font-bold">•</span>
                    <span>Protocolos de actuación</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2 font-bold">•</span>
                    <span>Documentación específica</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2 font-bold">•</span>
                    <span>Cobertura completa del evento</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2 font-bold">•</span>
                    <span>Formación del personal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2 font-bold">•</span>
                    <span>Comunicación con familias</span>
                  </li>

                </ul>
              </div>

              <Link
                href="/contratar/datos-entidad"
                className="w-full bg-blue-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors block text-center"
              >
                Contratar Ahora
              </Link>
            </div>

            {/* Kit Comunicación */}
            <div className="bg-white rounded-xl border border-teal-200 p-8 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-700 mb-2">Kit Comunicación</h3>
                <p className="text-gray-500 text-sm">Material informativo LOPIVI</p>
<<<<<<< HEAD
                <div className="text-5xl font-bold text-black mb-2">30€</div>
=======
                <div className="text-5xl font-bold text-teal-600 mb-2">30€</div>
>>>>>>> f6677eec3aa575fb9fe8aa00ffe1ab2e06844d4b
                <p className="text-gray-600">(+IVA) Pago único</p>
                <p className="text-sm text-teal-600 mt-2 font-medium">Material completo incluido</p>
                <p className="text-xs text-gray-500 mt-1">Entrega en 72 horas</p>
              </div>

              {/* Visual Kit Preview */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-700">Material Incluido:</span>
                    <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">Kit Digital</span>
                  </div>

                  {/* Email Preview */}
                  <div className="bg-gray-50 rounded p-2 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-4 bg-teal-600 rounded-sm"></div>
                      <span className="text-xs font-bold">Email Templates</span>
                    </div>
                    <div className="space-y-1">
                      <div className="bg-white rounded px-2 py-1">
                        <p className="text-xs text-gray-600">📧 Comunicado familias</p>
                      </div>
                      <div className="bg-white rounded px-2 py-1">
                        <p className="text-xs text-gray-600">📧 Información personal</p>
                      </div>
                    </div>
                  </div>

                  {/* Carteles Preview */}
                  <div className="bg-gray-50 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-4 bg-orange-600 rounded-sm"></div>
                      <span className="text-xs font-bold">Carteles A3/A4</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="bg-white rounded p-1 text-center">
                        <div className="bg-blue-100 rounded h-12 mb-1 flex items-center justify-center">
                          <span className="text-blue-600 text-lg font-bold">📋</span>
                        </div>
                        <p className="text-xs">Protocolo</p>
                      </div>
                      <div className="bg-white rounded p-1 text-center">
                        <div className="bg-teal-100 rounded h-12 mb-1 flex items-center justify-center">
                          <span className="text-teal-600 text-lg font-bold">📞</span>
                        </div>
                        <p className="text-xs">Teléfonos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-gray-700 mb-4">✅ Todo incluido:</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2 font-bold">•</span>
                    <span>Carteles informativos LOPIVI</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2 font-bold">•</span>
                    <span>Comunicados para familias</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2 font-bold">•</span>
                    <span>Templates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2 font-bold">•</span>
                    <span>Material didáctico básico</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2 font-bold">•</span>
                    <span>Guía de implementación</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2 font-bold">•</span>
                    <span>Documentos legales básicos</span>
                  </li>

                </ul>
              </div>

              <Link
                href="/contratar/datos-entidad"
                className="w-full bg-blue-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors block text-center"
              >
                Añádelo después
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparación con competencia */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">¿Por qué somos diferentes?</h2>
            <p className="text-xl text-gray-600">Comparación con métodos tradicionales</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-6 font-bold text-gray-700">Característica</th>
                  <th className="text-center p-6 font-bold text-blue-600">Custodia360</th>
                  <th className="text-center p-6 font-bold text-gray-600">Consultorías Tradicionales</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-6 font-medium text-gray-700">Tiempo de implementación</td>
                  <td className="p-6 text-center text-green-600 font-bold">72 horas</td>
                  <td className="p-6 text-center text-blue-800">3-6 meses</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-6 font-medium text-gray-700">Coste para entidad pequeña</td>
                  <td className="p-6 text-center text-green-600 font-bold">38€ total</td>
                  <td className="p-6 text-center text-blue-800">1.500€ - 3.000€</td>
                </tr>
                <tr className="border-t">
                  <td className="p-6 font-medium text-gray-700">Mantenimiento incluido</td>
                  <td className="p-6 text-center text-green-600 font-bold">✅ Sí</td>
                  <td className="p-6 text-center text-blue-800">❌ No</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-6 font-medium text-gray-700">Actualizaciones normativas</td>
                  <td className="p-6 text-center text-green-600 font-bold">✅ Automáticas</td>
                  <td className="p-6 text-center text-blue-800">❌ Manual</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-xl mb-8">Implementa LOPIVI en tu entidad en menos de 72 horas</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contacto"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Contactar Ahora
            </Link>
            <Link
              href="/guia"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-colors"
            >
              Guía Paso a Paso
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
