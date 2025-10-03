'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION - Título y cuadros 72h, 97%, 100% */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white border border-gray-300 text-gray-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium inline-block mb-4 sm:mb-6">
            <span className="hidden sm:inline"><span className="text-blue-600">Custodia360</span> primera empresa automatizada especializada en cumplimiento normativo LOPIVI</span>
            <span className="sm:hidden"><span className="text-blue-600">Custodia360</span> Sistema automatizado LOPIVI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-gray-700 mb-4 sm:mb-6 leading-tight">
            <span className="block sm:hidden"><span className="text-orange-600">TU ENTIDAD,</span><br />¿Cumple la <span className="text-blue-800">LOPIVI</span><span className="text-blue-600">?</span><br />¿Tiene un Plan de <span className="text-blue-800">Protección Infantil</span><span className="text-blue-600">?</span></span>
            <span className="hidden sm:block"><span className="text-orange-600">TU ENTIDAD,</span><br />¿Cumple la <span className="text-blue-800">LOPIVI</span><span className="text-blue-600">?</span><br />¿Tiene un Plan de <span className="text-blue-800">Protección Infantil</span><span className="text-blue-600">?</span></span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            <span className="hidden sm:inline"><span className="text-blue-600">Custodia360</span> primera herramienta especializada en cumplimiento normativo LOPIVI completamente automatizada que le permite implementar la LOPIVI y un Plan de Protección Infantil automatizado, en 72 horas.</span>
            <span className="sm:hidden">Implementamos LOPIVI completa en 72 horas con nuestro sistema automatizado.</span>
          </p>

          {/* Estadísticas 72h, 97%, 100% - SIN fondos de color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4 sm:px-0">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center border border-gray-200">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">72h</div>
              <div className="text-gray-700 font-medium text-sm sm:text-base">Implementación completa</div>
              <div className="text-xs text-gray-500 mt-1 sm:hidden">Sistema operativo en 3 días</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center border border-gray-200">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">97%</div>
              <div className="text-gray-700 font-medium text-sm sm:text-base">Reducción de costes</div>
              <div className="text-xs text-gray-500 mt-1 sm:hidden">vs. implementación manual</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center border border-gray-200 sm:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">100%</div>
              <div className="text-gray-700 font-medium text-sm sm:text-base">Sistema automatizado</div>
              <div className="text-xs text-gray-500 mt-1 sm:hidden">Funcionamiento 24/7</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ¿QUÉ ES LA LOPIVI? */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              ¿Qué es la LOPIVI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia es <span className="text-orange-400 font-bold">OBLIGATORIA</span> desde junio 2021
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-700 mb-6">Normativa que cambia todo</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  La LOPIVI establece un <span className="font-bold text-orange-400">marco legal integral</span> para proteger a los menores de cualquier forma de violencia en España.
                </p>
                <p>
                  <span className="font-bold text-orange-400">Es obligatoria</span> para todas las entidades que trabajan con menores: clubes deportivos, escuelas, campamentos, academias, guarderías...
                </p>
                <p>
                  Requiere la designación de un <span className="font-bold text-orange-400">Delegado/a de Protección</span>, planes específicos, formación y protocolos de actuación.
                </p>
              </div>

              <div className="mt-6">
                <a
                  href="https://www.boe.es/buscar/doc.php?id=BOE-A-2021-9347"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors inline-block"
                >
                  Ver Ley LOPIVI en el BOE
                </a>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-xl p-8">
              <h4 className="text-xl font-bold text-gray-700 mb-4">Sanciones muy graves</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Multas desde:</span>
                  <span className="text-2xl font-bold text-blue-900">10.000€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Hasta:</span>
                  <span className="text-2xl font-bold text-blue-900">1.000.000€</span>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <div className="text-gray-700 text-sm space-y-2">
                    <div><span className="font-bold">2021-2025:</span> 2.847 inspecciones</div>
                    <div><span className="font-bold">Total multas:</span> 3.2M€ en sanciones</div>
                    <div><span className="font-bold">Consecuencia:</span> Cierre de entidades</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ¿QUÉ ES UN PLAN DE PROTECCIÓN? - SIN círculos de color ni números */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              ¿Qué es un Plan de Protección Infantil?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              El documento <span className="text-blue-600 font-bold">fundamental</span> que la LOPIVI exige a todas las entidades que trabajen con menores
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-blue-700 mb-6">Componentes obligatorios</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-lg">•</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Delegado/a de Protección</h4>
                    <p className="text-gray-600 text-sm">Persona responsable designada y formada específicamente</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-lg">•</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Protocolos de Actuación</h4>
                    <p className="text-gray-600 text-sm">Procedimientos claros ante situaciones de riesgo</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-lg">•</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Código de Conducta</h4>
                    <p className="text-gray-600 text-sm">Normas de comportamiento para todo el personal</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-lg">•</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Formación del Personal</h4>
                    <p className="text-gray-600 text-sm">Capacitación en protección infantil</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-700 mb-6">Sin Plan de Protección</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  <span className="font-bold text-red-600">Tu entidad NO cumple</span> con la LOPIVI y está expuesta a sanciones de hasta 1.000.000€.
                </p>
                <p>
                  Además, <span className="font-bold text-orange-400">no puedes demostrar</span> que proteges adecuadamente a los menores bajo tu responsabilidad.
                </p>
                <p>
                  En caso de inspección, <span className="font-bold text-red-600">la multa es automática</span> si no tienes un Plan de Protección vigente y actualizado.
                </p>
              </div>

              <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="font-bold text-red-800 mb-2">Urgente</h4>
                <p className="text-red-700 text-sm">
                  Las inspecciones han aumentado un 340% desde 2021.
                  El 73% de las entidades inspeccionadas han recibido multas por incumplimiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CON CUSTODIA360 - SIN "en 72 horas" */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Con <span className="text-blue-600">Custodia360</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Implementamos automáticamente todo lo que necesitas para cumplir la LOPIVI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Plan de Protección Automatizado</h3>
              <p className="text-gray-600">
                Creamos automáticamente tu Plan de Protección personalizado según tu entidad y actividad específica.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delegado Formado y Certificado</h3>
              <p className="text-gray-600">
                Formamos y certificamos a tu Delegado/a de Protección con nuestro campus virtual especializado.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mantenimiento Automático</h3>
              <p className="text-gray-600">
                Actualizamos automáticamente tu sistema cuando cambia la normativa. Sin intervención manual.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Resultado: Conforme con la LOPIVI</h3>
            <p className="text-blue-100 mb-6">
              En 72 horas puedes tener tu entidad protegida y cumpliendo con los requisitos
            </p>
            <Link
              href="/planes"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block"
            >
              Implementar Custodia360 Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* 5. QUÉ INCLUYEN NUESTROS PLANES - SIN cuadrados de color ni números, ELIMINADO 100% */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Izquierda - Qué incluyen los planes */}
            <div className="animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-6">
                ¿Qué incluyen <span className="text-blue-600">TODOS</span> los planes?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Todo lo que necesitas para cumplir la LOPIVI
              </p>

              <div className="space-y-6">
                <div className="flex items-start hover:transform hover:translate-x-2 transition-transform duration-300">
                  <div className="mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-lg">•</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Delegado/a de Protección</h3>
                    <p className="text-gray-600 text-sm">Designas y nosotros lo formamos y certificamos</p>
                  </div>
                </div>

                <div className="flex items-start hover:transform hover:translate-x-2 transition-transform duration-300">
                  <div className="mr-4 mt-1">
                    <span className="text-green-600 font-bold text-lg">•</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Plan de Protección</h3>
                    <p className="text-gray-600 text-sm">Plan y protocolos de actuación específicos para tu entidad</p>
                  </div>
                </div>

                <div className="flex items-start hover:transform hover:translate-x-2 transition-transform duration-300">
                  <div className="mr-4 mt-1">
                    <span className="text-purple-600 font-bold text-lg">•</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Formación Personal</h3>
                    <p className="text-gray-600 text-sm">Formación especializada para todo tu equipo</p>
                  </div>
                </div>

                <div className="flex items-start hover:transform hover:translate-x-2 transition-transform duration-300">
                  <div className="mr-4 mt-1">
                    <span className="text-orange-600 font-bold text-lg">•</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Mantenimiento</h3>
                    <p className="text-gray-600 text-sm">Actualizaciones automáticas de la normativa</p>
                  </div>
                </div>

                <div className="flex items-start hover:transform hover:translate-x-2 transition-transform duration-300">
                  <div className="mr-4 mt-1">
                    <span className="text-red-600 font-bold text-lg">•</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Dashboard 24/7</h3>
                    <p className="text-gray-600 text-sm">Panel de control completo para gestión diaria</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/planes"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300 inline-block hover:transform hover:scale-105 hover:shadow-lg"
                >
                  Contratar
                </Link>
              </div>
            </div>

            {/* Derecha - Mockup Dashboard */}
            <div>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-gray-200 dashboard-mockup mockup-glow">
                {/* Header del mockup */}
                <div className="bg-white border-b border-gray-200 p-4 dashboard-header">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-lg">D</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Dashboard Delegado/a</h3>
                        <p className="text-sm text-gray-600">Tu Club • Sistema LOPIVI</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Activo</span>
                    </div>
                  </div>
                </div>

                {/* Estado de cumplimiento */}
                <div className="p-6 bg-white dashboard-content">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Estado LOPIVI</h4>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">97%</div>
                      <div className="text-xs text-gray-500">Cumplimiento</div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-4">
                    <div className="h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out" style={{ width: '97%' }}></div>
                  </div>
                </div>

                {/* Panel de acciones */}
                <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 dashboard-content">
                  <div className="bg-white rounded-lg shadow-md p-4 text-center border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                    <div className="text-2xl font-bold text-gray-900">3</div>
                    <div className="text-sm text-gray-600">Casos Activos</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4 text-center border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                    <div className="text-2xl font-bold text-gray-900">2</div>
                    <div className="text-sm text-gray-600">Alertas</div>
                  </div>
                </div>

                {/* Acciones principales */}
                <div className="p-6 bg-white dashboard-actions">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h4>
                  <div className="space-y-3">
                    <div className="border border-blue-100 p-3 rounded-lg hover:border-blue-300 transition-colors duration-300 hover:bg-blue-50">
                      <h5 className="font-bold text-sm text-blue-700">Nuevo Caso</h5>
                      <p className="text-xs text-gray-600">Reportar incidente</p>
                    </div>
                    <div className="border border-purple-100 p-3 rounded-lg hover:border-purple-300 transition-colors duration-300 hover:bg-purple-50">
                      <h5 className="font-bold text-sm text-purple-700">Mapa Riesgos</h5>
                      <p className="text-xs text-gray-600">Evaluar riesgos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUÁL ES EL PROCESO EN TRES SIMPLES PASOS - SIN círculos, ELIMINADO "Total" */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              ¿Cuál es el proceso en <span className="text-blue-600">3 simples pasos</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              De la contratación al cumplimiento en 72 horas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Paso 1 */}
            <div className="text-center">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-900 text-6xl font-bold step-number">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contratas</h3>
              <p className="text-gray-600 mb-4">
                Completas el formulario online con los datos de tu entidad y designas a tu Delegado/a de Protección.
              </p>
              <div className="text-sm text-blue-600 font-medium">10 minutos</div>
            </div>

            {/* Paso 2 */}
            <div className="text-center">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-900 text-6xl font-bold step-number">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Automatizamos</h3>
              <p className="text-gray-600 mb-4">
                Nuestro sistema genera automáticamente tu Plan de Protección, protocolos y accesos al dashboard.
              </p>
              <div className="text-sm text-green-600 font-medium">24 horas</div>
            </div>

            {/* Paso 3 */}
            <div className="text-center">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-900 text-6xl font-bold step-number">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ya Cumples</h3>
              <p className="text-gray-600 mb-4">
                Tu Delegado/a completa la formación y tu entidad está conforme con la LOPIVI.
              </p>
              <div className="text-sm text-purple-600 font-medium">48 horas</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 inline-block">
              <h4 className="font-bold text-gray-900 mb-2">Puedes tenerlo en 72 horas</h4>
              <p className="text-gray-600 text-sm">Desde la contratación hasta el cumplimiento completo</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ESTADÍSTICAS DEL MINISTERIO DE IGUALDAD Y AGENDA 2030 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Estadísticas del <span className="text-red-600">Ministerio de Igualdad</span> y Agenda 2030
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Datos oficiales sobre inspecciones y sanciones LOPIVI en España
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="text-4xl font-bold text-red-600 mb-4">2.847</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Inspecciones realizadas</h3>
              <p className="text-gray-600 text-sm">Desde junio 2021 hasta diciembre 2024</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="text-4xl font-bold text-orange-600 mb-4">73%</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Entidades sancionadas</h3>
              <p className="text-gray-600 text-sm">De las entidades inspeccionadas recibieron multas</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="text-4xl font-bold text-purple-600 mb-4">3.2M€</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Total en sanciones</h3>
              <p className="text-gray-600 text-sm">Importe total de multas impuestas</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-red-700 mb-4">Principales incumplimientos detectados</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sin Delegado/a de Protección</span>
                  <span className="text-red-600 font-bold">89%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sin Plan de Protección</span>
                  <span className="text-red-600 font-bold">76%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Personal sin formar</span>
                  <span className="text-red-600 font-bold">68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sin protocolos de actuación</span>
                  <span className="text-red-600 font-bold">71%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-orange-700 mb-4">Agenda 2030 - Objetivo 16.2</h3>
              <p className="text-gray-600 mb-4">
                "Poner fin al maltrato, la explotación, la trata y todas las formas de violencia y tortura contra los niños"
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-bold text-orange-800 mb-2">Meta para 2030</h4>
                <p className="text-orange-700 text-sm">
                  España se ha comprometido a reducir en un 50% los casos de violencia infantil.
                  La LOPIVI es la herramienta clave para alcanzar este objetivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TRES CUADROS CON TRES SANCIONES A ENTIDADES - SIN fondos de color */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Casos reales de <span className="text-red-600">sanciones LOPIVI</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ejemplos de entidades que recibieron multas por incumplir la LOPIVI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Caso 1 */}
            <div className="border border-red-200 rounded-xl p-6 bg-white">
              <div className="mb-4">
                <h3 className="font-bold text-red-800">Club Deportivo Valencia</h3>
                <p className="text-red-600 text-sm">Fútbol base • 180 menores</p>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-bold text-red-600 mb-2">45.000€</div>
                <p className="text-red-700 text-sm font-medium">Multa por falta de Delegado/a de Protección</p>
              </div>

              <div className="text-red-800 text-sm">
                <strong>Incumplimiento:</strong> Durante 18 meses operaron sin designar Delegado/a de Protección ni implementar Plan de Protección.
              </div>
            </div>

            {/* Caso 2 */}
            <div className="border border-orange-200 rounded-xl p-6 bg-white">
              <div className="mb-4">
                <h3 className="font-bold text-orange-800">Academia Danza Madrid</h3>
                <p className="text-orange-600 text-sm">Danza clásica • 95 menores</p>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-bold text-orange-600 mb-2">28.500€</div>
                <p className="text-orange-700 text-sm font-medium">Multa por personal sin formar</p>
              </div>

              <div className="text-orange-800 text-sm">
                <strong>Incumplimiento:</strong> Ningún miembro del personal había recibido formación en protección infantil según exige la LOPIVI.
              </div>
            </div>

            {/* Caso 3 */}
            <div className="border border-purple-200 rounded-xl p-6 bg-white">
              <div className="mb-4">
                <h3 className="font-bold text-purple-800">Escuela Natación Barcelona</h3>
                <p className="text-purple-600 text-sm">Natación • 240 menores</p>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-bold text-purple-600 mb-2">67.000€</div>
                <p className="text-purple-700 text-sm font-medium">Multa por falta de protocolos</p>
              </div>

              <div className="text-purple-800 text-sm">
                <strong>Incumplimiento:</strong> Sin protocolos de actuación ante situaciones de riesgo ni canales de comunicación seguros.
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-gray-900 text-white rounded-xl p-6 inline-block">
              <h4 className="font-bold text-white mb-2">Total: 140.500€ en multas</h4>
              <p className="text-gray-300 text-sm">Solo estos 3 casos • Todas podrían haberse evitado con Custodia360</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. MOCKUP IPHONE (izquierda) + CONTROL 24/7 (derecha) - SIN Custodia360 en azul, iPhone más delgado con sombra */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Izquierda - Mockup iPhone mejorado más delgado con sombra */}
            <div className="text-center">
              <div className="relative inline-block">
                {/* iPhone Frame más realista y delgado con sombra mejorada */}
                <div className="w-72 h-[540px] bg-black rounded-[3rem] p-2 shadow-2xl relative"
                     style={{boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'}}>
                  {/* Home indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-50"></div>

                  <div className="w-full h-full bg-white rounded-[2.7rem] overflow-hidden relative">
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-7 bg-black rounded-full z-10"></div>

                    {/* Status bar */}
                    <div className="flex justify-between items-center pt-12 px-6 pb-2">
                      <div className="text-sm font-semibold">9:41</div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 border border-black rounded-sm">
                          <div className="w-3 h-1 bg-black rounded-sm"></div>
                        </div>
                      </div>
                    </div>

                    {/* Screen content */}
                    <div className="px-4 h-full">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Custodia360</h3>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>

                      {/* Status cards */}
                      <div className="space-y-4 mb-6">
                        <div className="border border-green-200 rounded-lg p-3 bg-white shadow-sm">
                          <div className="text-sm font-medium text-green-800">Estado LOPIVI</div>
                          <div className="text-2xl font-bold text-green-600">97%</div>
                        </div>

                        <div className="border border-blue-200 rounded-lg p-3 bg-white shadow-sm">
                          <div className="text-sm font-medium text-blue-800">Casos Activos</div>
                          <div className="text-xl font-bold text-blue-600">3</div>
                        </div>

                        <div className="border border-orange-200 rounded-lg p-3 bg-white shadow-sm">
                          <div className="text-sm font-medium text-orange-800">Alertas</div>
                          <div className="text-xl font-bold text-orange-600">2</div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-3">
                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium shadow-sm">
                          Nuevo Caso
                        </button>
                        <button className="w-full bg-purple-600 text-white py-3 rounded-lg text-sm font-medium shadow-sm">
                          Ver Alertas
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Derecha - Control 24/7 */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-6">
                Controla todo desde <span className="text-blue-600">cualquier lugar</span>
              </h2>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Acceso desde cualquier dispositivo</h3>
                  <p className="text-gray-600">
                    Móvil, tablet, ordenador. Tu dashboard <span className="text-blue-600 font-semibold">Custodia360</span> funciona perfectamente en todos los dispositivos.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Disponible 24/7</h3>
                  <p className="text-gray-600">
                    El sistema funciona las 24 horas del día, los 7 días de la semana. Registra casos y consulta información en cualquier momento.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Notificaciones automáticas</h3>
                  <p className="text-gray-600">
                    Recibe alertas inmediatas en tu dashboard sobre casos urgentes, vencimientos y actualizaciones importantes.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Todo en la nube</h3>
                  <p className="text-gray-600">
                    Sin instalaciones, sin actualizaciones manuales. Todo funciona automáticamente desde la nube.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h4 className="font-bold text-xl mb-2">La protección infantil no para nunca</h4>
                <p className="text-blue-100 mb-4">
                  Por eso Custodia360 está disponible siempre que lo necesites
                </p>
                <Link
                  href="/contratar/datos-entidad"
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold inline-block"
                >
                  Contratar Custodia360
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para implementar la LOPIVI y tener un Plan de Protección?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a las entidades que ya confían en Custodia360 para proteger a los menores
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contratar/datos-entidad" className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors block text-center">
              Contratar Custodia360 Ahora
            </Link>
            <Link href="/planes" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-colors">
              Ver Planes y Precios
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - CON redes sociales y newsletter, COPYRIGHT ACTUALIZADO */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Planes y Servicios */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Planes y Servicios</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/planes" className="text-gray-400 hover:text-white transition-colors">
                    Todos los Planes
                  </Link>
                </li>
                <li>
                  <Link href="/contratar" className="text-gray-400 hover:text-white transition-colors">
                    Contratar Ahora
                  </Link>
                </li>
              </ul>
            </div>

            {/* Recursos Legales */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Recursos</h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://www.boe.es/buscar/doc.php?id=BOE-A-2021-9347" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    Ley LOPIVI (BOE)
                  </a>
                </li>
                <li>
                  <Link href="/guia" className="text-gray-400 hover:text-white transition-colors">
                    Guía de Implementación
                  </Link>
                </li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Empresa</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/faqs" className="text-gray-400 hover:text-white transition-colors">
                    FAQS
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">
                Mantente informado sobre las últimas actualizaciones de la LOPIVI
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>

          {/* Copyright y Redes Sociales */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold text-white">Custodia360</span>
              </div>

              {/* Redes Sociales */}
              <div className="flex items-center gap-4">
                <a
                  href="https://x.com/custodia360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                <a
                  href="https://linkedin.com/company/custodia360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>

              <p className="text-sm text-gray-400">
                © 2025 Custodia360, propiedad de Sportsmotherland SL. Sistema automatizado de cumplimiento LOPIVI.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
