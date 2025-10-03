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
            Implementación en 72 horas
          </div>
        </div>
      </section>

      {/* Qué incluye todos los planes */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">¿Qué es lo que incluyen TODOS los planes?</h2>
            <p className="text-xl text-gray-600">Todo lo que necesitas para cumplir</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 mb-2">Delegado/a de Protección</h3>
              <p className="text-gray-600 text-sm">Designas y nosotros lo formamos</p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 mb-2">Plan de Protección</h3>
              <p className="text-gray-600 text-sm">Plan y protocolos de actuación específicos</p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 mb-2">Formación</h3>
              <p className="text-gray-600 text-sm">Formación Personal</p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-700 mb-2">Mantenimiento</h3>
              <p className="text-gray-600 text-sm">Actualizaciones</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="font-bold text-yellow-800 mb-2">¿Por qué todos los planes incluyen lo mismo?</h3>
            <p className="text-yellow-700">
              La LOPIVI exige el mismo nivel de protección para todos los menores, independientemente del tamaño de la entidad.
              Por eso todos nuestros planes incluyen exactamente los mismos servicios.
            </p>
          </div>
        </div>
      </section>

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
                  <li>2-6 meses de implementación</li>
                  <li>Sin mantenimiento incluido</li>
                  <li>Actualizaciones manuales</li>
                </ul>
              </div>
              <div className="text-center p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
                <h4 className="text-lg font-bold text-gray-700 mb-3">Custodia360</h4>
                <div className="text-3xl font-bold text-gray-700 mb-2">Desde 38€ total</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>72 horas de implementación</li>
                  <li>Mantenimiento automático incluido</li>
                  <li>Actualizaciones automáticas</li>
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

          {/* Botón Cómo lo hacemos */}
          <div className="text-center mt-8">
            <Link
              href="/como-lo-hacemos"
              className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg border-2 border-blue-200"
            >
              ¿Cómo lo hacemos?
            </Link>
          </div>
        </div>
      </section>

      {/* Planes Principales */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Elige tu plan según número de menores</h2>
            <p className="text-xl text-gray-600">Precios justos y transparentes</p>
            <p className="text-lg text-white mt-3 font-medium bg-blue-600 px-4 py-2 rounded-lg"><strong>Además puedes añadir un delegado suplente para cubrir bajas, vacaciones, cambios de personal, etc. en todos los planes.</strong></p>
          </div>

          {/* Explicación de pagos divididos */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <h3 className="text-xl font-bold text-blue-800">Facilitamos tu contratación</h3>
            </div>
            <div className="text-blue-700 text-center">
              <ul className="space-y-2 text-lg font-medium">
                <li>✓ Precio por semestre (6 meses)</li>
                <li>✓ Facturación cada 6 meses</li>
                <li>✓ Contrato anual (compromiso 12 meses)</li>
                <li>✓ Ejemplo Plan 100: 19€ cada semestre + IVA</li>
              </ul>
            </div>
          </div>

          <div className="space-y-8 mb-8">
            {/* Primera fila - 3 planes principales */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Plan 100 */}
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <h3 className="text-xl font-bold text-gray-700 mb-2">Plan 100</h3>
                <p className="text-gray-600 text-sm mb-4">Para entidades de 1 hasta 100 menores</p>
                <div className="text-4xl font-bold text-gray-800 mb-2">19€</div>
                <p className="text-gray-600 text-sm">(+IVA) Pago inicial</p>
                <p className="text-xs text-blue-600 mt-2 font-medium">+ 19€ a los 6 meses (+IVA)</p>
                <p className="text-xs text-gray-500 mt-1">Implementación completa en 72h</p>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-700 mb-4">✅ Todo incluido:</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Delegado/a de protección</li>
                    <li>• Posibilidad de delegado/a suplente (+10€)</li>
                    <li>• Plan de protección</li>
                    <li>• Protocolos de actuación específicos</li>
                    <li>• Formación</li>
                    <li>• Documentación completa LOPIVI</li>
                    <li>• Sistema de gestión integral</li>
                    <li>• Mantenimiento y actualizaciones</li>
                  </ul>
                </div>

                <Link
                  href="/contratar/datos-entidad?plan=plan-100&descripcion=Plan%20100%20-%2019€"
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors block text-center"
                >
                  Contratar Ahora
                </Link>
              </div>

              {/* Plan 250 */}
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <h3 className="text-xl font-bold text-gray-700 mb-2">Plan 250</h3>
                <p className="text-gray-600 text-sm mb-4">Para entidades de 101 hasta 250 menores</p>
                <div className="text-4xl font-bold text-gray-800 mb-2">39€</div>
                <p className="text-gray-600 text-sm">(+IVA) Pago inicial</p>
                <p className="text-xs text-green-600 mt-2 font-medium">+ 39€ a los 6 meses (+IVA)</p>
                <p className="text-xs text-gray-500 mt-1">Implementación completa en 72h</p>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-700 mb-4">✅ Todo incluido:</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Delegado/a de protección</li>
                    <li>• Posibilidad de delegado/a suplente (+10€)</li>
                    <li>• Plan de protección</li>
                    <li>• Protocolos de actuación específicos</li>
                    <li>• Formación</li>
                    <li>• Documentación completa LOPIVI</li>
                    <li>• Sistema de gestión integral</li>
                    <li>• Mantenimiento y actualizaciones</li>
                  </ul>
                </div>

                <Link
                  href="/contratar/datos-entidad?plan=plan-250&descripcion=Plan%20250%20-%2039€"
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors block text-center"
                >
                  Contratar Ahora
                </Link>
              </div>

              {/* Plan 500 */}
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <h3 className="text-xl font-bold text-gray-700 mb-2">Plan 500</h3>
                <p className="text-gray-600 text-sm mb-4">Para entidades de 251 hasta 500 menores</p>
                <div className="text-4xl font-bold text-gray-800 mb-2">105€</div>
                <p className="text-gray-600 text-sm">(+IVA) Pago inicial</p>
                <p className="text-xs text-purple-600 mt-2 font-medium">+ 105€ a los 6 meses (+IVA)</p>
                <p className="text-xs text-gray-500 mt-1">Implementación completa en 72h</p>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-700 mb-4">✅ Todo incluido:</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Delegado/a de protección</li>
                    <li>• Posibilidad de delegado/a suplente (+10€)</li>
                    <li>• Plan de protección</li>
                    <li>• Protocolos de actuación específicos</li>
                    <li>• Formación</li>
                    <li>• Documentación completa LOPIVI</li>
                    <li>• Sistema de gestión integral</li>
                    <li>• Mantenimiento y actualizaciones</li>
                  </ul>
                </div>

                <Link
                  href="/contratar/datos-entidad?plan=plan-500&descripcion=Plan%20500%20-%20105€"
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors block text-center"
                >
                  Contratar Ahora
                </Link>
              </div>
            </div>

            {/* Segunda fila - 2 planes adicionales */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Plan 500+ */}
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <h3 className="text-xl font-bold text-gray-700 mb-2">Plan 500+</h3>
                <p className="text-gray-600 text-sm mb-4">Para entidades de 501 menores en adelante</p>
                <div className="text-4xl font-bold text-gray-800 mb-2">250€</div>
                <p className="text-gray-600 text-sm">(+IVA) Pago inicial</p>
                <p className="text-xs text-gray-600 mt-2 font-bold">+ 250€ a los 6 meses (+IVA)</p>
                <p className="text-xs text-gray-500 mt-1">Para entidades multideporte</p>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-700 mb-4">✅ Todo incluido:</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Delegado/a de protección</li>
                    <li>• Posibilidad de delegado/a suplente (+10€)</li>
                    <li>• Plan de protección</li>
                    <li>• Protocolos de actuación específicos</li>
                    <li>• Formación</li>
                    <li>• Documentación completa LOPIVI</li>
                    <li>• Sistema de gestión integral</li>
                    <li>• Mantenimiento y actualizaciones</li>
                  </ul>
                </div>

                <Link
                  href="/contratar/datos-entidad?plan=plan-500plus&descripcion=Plan%20500%2B%20-%20250€"
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors block text-center"
                >
                  Contratar Ahora
                </Link>
              </div>

              {/* Custodia Temporal */}
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <h3 className="text-xl font-bold text-gray-700 mb-2">Custodia Temporal</h3>
                <p className="text-gray-600 text-sm mb-4">Para torneos, campamentos de verano, <strong>eventos de hasta 60 días</strong></p>
                <div className="text-4xl font-bold text-gray-800 mb-2">100€</div>
                <p className="text-gray-600 text-sm">(+IVA) pago único</p>
                <p className="text-xs text-gray-500 mt-1">Vigencia: 60 días</p>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-700 mb-4">✅ Todo incluido:</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Delegado/a de protección</li>
                    <li>• Posibilidad de delegado/a suplente (+10€)</li>
                    <li>• Plan de protección</li>
                    <li>• Protocolos de actuación específicos</li>
                    <li>• Formación</li>
                    <li>• Documentación completa LOPIVI</li>
                    <li>• Sistema de gestión integral</li>
                    <li>• Mantenimiento y actualizaciones</li>
                    <li>• Cobertura del evento</li>
                  </ul>
                </div>

                <Link
                  href="/contratar/datos-entidad?plan=custodia-temporal&descripcion=Custodia%20Temporal%20-%20100€"
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors block text-center"
                >
                  Contratar Ahora
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Kit Comunicación - Sección Horizontal */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">Incorpora a tu plan</h1>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Kit Comunicación LOPIVI</h2>
              <p className="text-lg text-gray-600 mb-4">
                Material de comunicación para informar que eres una entidad cumplidora de la LOPIVI
              </p>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 max-w-4xl mx-auto">
                <p className="text-teal-800 font-medium">
                  Se puede añadir en el momento de la contratación - 30€ (+IVA) pago único
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Descripción */}
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">¿Para qué sirve?</h3>
                <p className="text-gray-600 mb-6">
                  Está pensado para dotar a la entidad de material de comunicación dirigido a familias,
                  trabajadores, web y redes sociales para informar que sois una entidad cumplidora de la LOPIVI.
                </p>

                <h4 className="font-bold text-gray-700 mb-4">✅ Lo que incluye:</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2 font-bold">•</span>
                    <span>Templates para comunicados a familias</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2 font-bold">•</span>
                    <span>Material para web y redes sociales</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2 font-bold">•</span>
                    <span>Carteles informativos para instalaciones</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2 font-bold">•</span>
                    <span>Comunicaciones internas para trabajadores</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2 font-bold">•</span>
                    <span>Certificado visual de cumplimiento LOPIVI</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2 font-bold">•</span>
                    <span>Guías de uso y personalización</span>
                  </li>
                </ul>
              </div>

              {/* Visual Preview */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-bold text-gray-700 mb-4 text-center">Ejemplo de materiales</h4>

                <div className="space-y-4">
                  {/* Comunicado familias */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <span className="text-teal-600 font-bold text-sm">F</span>
                      </div>
                      <span className="font-medium text-gray-700">Comunicado Familias</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      "Nos complace informarles que nuestra entidad cumple completamente con la LOPIVI..."
                    </p>
                  </div>

                  {/* Cartel instalaciones */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">C</span>
                      </div>
                      <span className="font-medium text-gray-700">Cartel Instalaciones</span>
                    </div>
                    <div className="bg-blue-50 rounded p-2 text-center">
                      <p className="text-xs font-bold text-blue-800">ENTIDAD PROTEGIDA LOPIVI</p>
                      <p className="text-xs text-blue-600">Certificado de cumplimiento</p>
                    </div>
                  </div>

                  {/* Web/Redes */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">W</span>
                      </div>
                      <span className="font-medium text-gray-700">Web y Redes</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Banners, sellos y contenido para mostrar vuestro compromiso con la protección infantil
                    </p>
                  </div>
                </div>
              </div>
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
                  <th className="text-left p-6 font-bold text-gray-700"></th>
                  <th className="text-center p-6 font-bold text-blue-600">Custodia360</th>
                  <th className="text-center p-6 font-bold text-gray-600">Consultorías Tradicionales</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-6 font-medium text-gray-700">Formación</td>
                  <td className="p-6 text-center text-green-600 font-bold">On-line</td>
                  <td className="p-6 text-center text-blue-800">Horarios fijos con desplazamiento</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-6 font-medium text-gray-700">Gestión y seguimiento</td>
                  <td className="p-6 text-center text-green-600 font-bold">100% automatizado</td>
                  <td className="p-6 text-center text-blue-800">No incluida</td>
                </tr>
                <tr className="border-t">
                  <td className="p-6 font-medium text-gray-700">Comunicación familias</td>
                  <td className="p-6 text-center text-green-600 font-bold">100% automatizada</td>
                  <td className="p-6 text-center text-blue-800">No incluida</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-6 font-medium text-gray-700">Informes y seguimiento</td>
                  <td className="p-6 text-center text-green-600 font-bold">100% automatizada</td>
                  <td className="p-6 text-center text-blue-800">No incluida</td>
                </tr>
                <tr className="border-t">
                  <td className="p-6 font-medium text-gray-700">Dashboard on-line</td>
                  <td className="p-6 text-center text-green-600 font-bold">100% incluido</td>
                  <td className="p-6 text-center text-blue-800">No incluida</td>
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
          <p className="text-xl mb-8">Puedes tener implementada la LOPIVI en tu entidad en menos de 72 horas</p>

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
          </div>
        </div>
      </section>
    </div>
  )
}
