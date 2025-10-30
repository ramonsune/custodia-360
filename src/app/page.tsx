'use client'

import Link from 'next/link'
// import Chatbot from './components/Chatbot'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section - Diseño exacto como www.custodia360.es */}
      <div className="bg-gradient-to-b from-blue-950 via-blue-950 to-gray-950 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Título principal */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                <span className="block"><span className="text-blue-400">Tu entidad</span>,</span>
                <span className="block mt-2">¿Cumple la LOPIVI?</span>
                <span className="block mt-2">¿Tiene un Plan de Protección<br />Infantil?</span>
              </h1>
            </div>

            {/* Descripción */}
            <div className="mb-16">
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                <span className="text-blue-400 font-semibold">Custodia360</span> herramienta especializada en cumplimiento normativo LOPIVI completamente automatizada que le permite implementar la LOPIVI y un Plan de Protección Infantil automatizado, en 72 horas.
              </p>
            </div>

            {/* Estadísticas */}
            <div className="mb-16">
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-5xl md:text-6xl font-bold text-white mb-2">72h</div>
                  <div className="text-gray-300 font-medium text-lg">Implementación completa</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-5xl md:text-6xl font-bold text-white mb-2">99%</div>
                  <div className="text-gray-300 font-medium text-lg">Reducción de costes respecto a lo habitual</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-5xl md:text-6xl font-bold text-white mb-2">100%</div>
                  <div className="text-gray-300 font-medium text-lg">Sistema automatizado</div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <Link
                href="/contratar/datos-entidad"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Contratar Custodia360
              </Link>
              <Link
                href="/planes"
                className="border-2 border-white/40 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:border-white hover:bg-white/10 transition-colors"
              >
                Ver Planes y Precios
              </Link>
            </div>
          </div>
        </div>
      </div>





      {/* Qué es la LOPIVI */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Qué es la LOPIVI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la
              Violencia es <span className="text-orange-500 font-bold">OBLIGATORIA</span> desde junio 2021
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Normativa que cambia todo */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Normativa que cambia todo</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  La LOPIVI establece un <span className="text-orange-500 font-semibold">marco legal integral</span> para proteger a
                  los menores de cualquier forma de violencia en España.
                </p>
                <p>
                  <span className="text-orange-500 font-semibold">Es obligatoria</span> para todas las entidades que trabajan con
                  menores: clubes deportivos, escuelas, campamentos, academias, guarderías...
                </p>
                <p>
                  Requiere la designación de un <span className="text-orange-500 font-semibold">Delegado/a de Protección</span>,
                  planes específicos, formación y protocolos de actuación.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="https://www.boe.es/buscar/doc.php?id=BOE-A-2021-9347"
                  target="_blank"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Ver Ley LOPIVI en el BOE
                </Link>
              </div>
            </div>

            {/* Sanciones muy graves */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Sanciones muy graves</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Multas desde:</span>
                  <span className="text-2xl font-bold text-red-600">10.000€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Hasta:</span>
                  <span className="text-2xl font-bold text-red-600">1.000.000€</span>
                </div>
                <hr className="my-4" />
                <div className="text-sm text-gray-600 space-y-2">
                  <div><span className="font-semibold">2021-2025:</span> 2.847 inspecciones</div>
                  <div><span className="font-semibold">Total multas:</span> 3.2M€ en sanciones</div>
                  <div><span className="font-semibold">Consecuencia:</span> Cierre de entidades</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Qué es un Plan de Protección Infantil */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Qué es un Plan de Protección Infantil?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              El documento <span className="text-blue-600 font-bold">fundamental</span> que la LOPIVI exige a todas las entidades que
              trabajen con menores
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Componentes obligatorios */}
            <div>
              <h3 className="text-2xl font-bold text-blue-600 mb-8">Componentes obligatorios</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-white text-sm">•</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Delegado/a de Protección</h4>
                    <p className="text-gray-600">Persona responsable designada y formada específicamente</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-white text-sm">•</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Protocolos de Actuación</h4>
                    <p className="text-gray-600">Procedimientos claros ante situaciones de riesgo</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-white text-sm">•</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Código de Conducta</h4>
                    <p className="text-gray-600">Normas de comportamiento para todo el personal</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-white text-sm">•</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Formación del Personal</h4>
                    <p className="text-gray-600">Capacitación en protección infantil</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sin Plan de Protección */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Sin Plan de Protección</h3>
              <div className="border border-red-200 rounded-xl p-6 mb-6">
                <p className="text-red-800 mb-4">
                  <span className="font-bold">Tu entidad NO cumple</span> con la LOPIVI y está expuesta a
                  sanciones de hasta 1.000.000€.
                </p>
                <p className="text-red-700 mb-4">
                  Además, <span className="font-bold">no puedes demostrar</span> que proteges adecuadamente
                  a los menores bajo tu responsabilidad.
                </p>
                <p className="text-red-700">
                  En caso de inspección, <span className="font-bold">la multa es automática</span> si no tienes un
                  Plan de Protección vigente y actualizado.
                </p>
              </div>

              <div className="border border-yellow-200 rounded-xl p-6">
                <h4 className="font-bold text-yellow-800 mb-2">Urgente</h4>
                <p className="text-yellow-700">
                  Las inspecciones han aumentado un <span className="font-bold">340% desde 2021</span>. El <span className="font-bold">73%</span> de las entidades inspeccionadas han recibido multas por incumplimiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Con Custodia360 */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Con <span className="text-blue-600">Custodia360</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Implementamos automáticamente todo lo que necesitas para cumplir la LOPIVI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Plan de Protección Automatizado */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Plan de Protección<br />Automatizado</h3>
              <p className="text-gray-600">
                Creamos automáticamente tu Plan de Protección personalizado según tu
                entidad y actividad específica.
              </p>
            </div>

            {/* Delegado Formado y Certificado */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delegado Formado y<br />Certificado</h3>
              <p className="text-gray-600">
                Formamos y certificamos a tu Delegado/a de Protección con nuestro
                campus virtual especializado.
              </p>
            </div>

            {/* Mantenimiento Automático */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mantenimiento Automático</h3>
              <p className="text-gray-600">
                Actualizamos automáticamente tu sistema cuando cambia la normativa. Sin
                intervención manual.
              </p>
            </div>
          </div>

          {/* Resultado */}
          <div className="border-2 border-blue-600 rounded-xl p-12 text-center">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">Resultado: Conforme con la LOPIVI</h3>
            <p className="text-xl mb-8 text-gray-700">
              En 72 horas puedes tener tu entidad protegida y cumpliendo con los requisitos
            </p>
            <Link
              href="/planes"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Implementar Custodia360 Ahora
            </Link>
          </div>
        </div>
      </div>

      {/* Qué incluyen TODOS los planes */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Qué incluyen <span className="text-blue-600">TODOS</span> los planes?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todo lo que necesitas para cumplir la LOPIVI
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Lista de inclusiones */}
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white text-sm">•</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Delegado/a de Protección</h4>
                  <p className="text-gray-600">Designas y nosotros lo formamos y certificamos</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white text-sm">•</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Plan de Protección</h4>
                  <p className="text-gray-600">Plan y protocolos de actuación específicos para tu entidad</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white text-sm">•</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Formación Personal</h4>
                  <p className="text-gray-600">Formación especializada para todo tu equipo</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white text-sm">•</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Mantenimiento</h4>
                  <p className="text-gray-600">Actualizaciones automáticas de la normativa</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white text-sm">•</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Dashboard 24/7</h4>
                  <p className="text-gray-600">Panel de control completo para gestión diaria</p>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/planes"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Contratar
                </Link>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-xl">
              <div className="bg-blue-600 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-end mb-2">
                  <span className="text-xs bg-green-500 px-2 py-1 rounded">• Activo</span>
                </div>
                <h4 className="font-bold text-white">Dashboard Delegado/a</h4>
                <p className="text-sm text-blue-100">Tu Club • Sistema LOPIVI</p>
              </div>

              <div className="mb-4">
                <h5 className="font-bold text-gray-900 mb-2">Estado LOPIVI</h5>
                <div className="text-2xl font-bold text-green-600">99%</div>
                <div className="text-sm text-gray-600">Cumplimiento</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white border border-gray-200 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-gray-900">3</div>
                  <div className="text-xs text-gray-600">Casos Activos</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3 text-center">
                  <div className="text-2xl font-bold text-gray-900">2</div>
                  <div className="text-xs text-gray-600">Alertas</div>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-gray-900 mb-2">Acciones Rápidas</h5>
                <div className="space-y-2">
                  <div className="bg-blue-600 rounded p-2 text-sm text-white">
                    <div className="font-semibold">Nuevo Caso</div>
                    <div className="text-xs text-blue-100">Reportar incidente</div>
                  </div>
                  <div className="bg-purple-600 rounded p-2 text-sm text-white">
                    <div className="font-semibold">Mapa Riesgos</div>
                    <div className="text-xs text-purple-100">Evaluar riesgos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proceso en 3 pasos */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Cuál es el proceso en <span className="text-blue-600">3 simples pasos</span>?
            </h2>
            <p className="text-xl text-gray-600">
              De la contratación al cumplimiento en 72 horas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Paso 1 */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900 mb-4">1</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contratas</h3>
              <p className="text-gray-600 mb-4">
                Completas el formulario online con los datos de tu entidad y designas a tu
                Delegado/a de Protección.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900 mb-4">2</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Automatizamos</h3>
              <p className="text-gray-600 mb-4">
                Nuestro sistema genera automáticamente tu Plan de Protección, protocolos y
                accesos al dashboard.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900 mb-4">3</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ya Cumples</h3>
              <p className="text-gray-600 mb-4">
                Tu Delegado/a completa la formación y tu entidad está conforme con la LOPIVI.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-xl p-8 border border-gray-200 inline-block">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Puedes tenerlo en 72 horas</h4>
              <p className="text-gray-600">Desde la contratación hasta el cumplimiento completo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas del Ministerio */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Estadísticas del <span className="text-red-600">Ministerio de Igualdad</span> y Agenda 2030
            </h2>
            <p className="text-xl text-gray-600">
              Datos oficiales sobre inspecciones y sanciones LOPIVI en España
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-6xl font-bold text-red-600 mb-4">2.847</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Inspecciones realizadas</h3>
              <p className="text-gray-600">Desde junio 2021 hasta diciembre 2024</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-orange-600 mb-4">73%</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Entidades sancionadas</h3>
              <p className="text-gray-600">De las entidades inspeccionadas recibieron multas</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-purple-600 mb-4">3.2M€</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Total en sanciones</h3>
              <p className="text-gray-600">Importe total de multas impuestas</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Principales incumplimientos */}
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-6">Principales incumplimientos detectados</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sin Delegado/a de Protección</span>
                  <span className="text-2xl font-bold text-red-600">89%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sin Plan de Protección</span>
                  <span className="text-2xl font-bold text-red-600">76%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Personal sin formar</span>
                  <span className="text-2xl font-bold text-red-600">68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sin protocolos de actuación</span>
                  <span className="text-2xl font-bold text-red-600">71%</span>
                </div>
              </div>
            </div>

            {/* Agenda 2030 */}
            <div>
              <h3 className="text-2xl font-bold text-orange-600 mb-6">Agenda 2030 - Objetivo 16.2</h3>
              <p className="text-gray-700 mb-6 italic">
                "Poner fin al maltrato, la explotación, la trata y todas las formas de violencia y tortura contra los niños"
              </p>
              <div className="bg-orange-50 rounded-xl p-6">
                <h4 className="font-bold text-orange-800 mb-2">Meta para 2030</h4>
                <p className="text-orange-700">
                  España se ha comprometido a reducir en un 50% los casos de violencia infantil.
                  La LOPIVI es la herramienta clave para alcanzar este objetivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Casos reales de sanciones */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Casos reales de <span className="text-red-600">sanciones LOPIVI</span>
            </h2>
            <p className="text-xl text-gray-600">
              Ejemplos de entidades que recibieron multas por incumplir la LOPIVI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Caso 1 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-red-600 mb-2">Club Deportivo Valencia</h3>
              <p className="text-sm text-gray-600 mb-4">Fútbol base • 180 menores</p>
              <div className="text-3xl font-bold text-red-600 mb-4">45.000€</div>
              <p className="text-red-700 font-semibold mb-2">Multa por falta de Delegado/a de Protección</p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Incumplimiento:</span> Durante 18 meses operaron sin designar
                Delegado/a de Protección ni implementar Plan de Protección.
              </p>
            </div>

            {/* Caso 2 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-orange-600 mb-2">Academia Danza Madrid</h3>
              <p className="text-sm text-gray-600 mb-4">Danza clásica • 95 menores</p>
              <div className="text-3xl font-bold text-orange-600 mb-4">28.500€</div>
              <p className="text-orange-700 font-semibold mb-2">Multa por personal sin formar</p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Incumplimiento:</span> Ningún miembro del personal había
                recibido formación en protección infantil según exige la LOPIVI.
              </p>
            </div>

            {/* Caso 3 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-purple-600 mb-2">Escuela Natación Barcelona</h3>
              <p className="text-sm text-gray-600 mb-4">Natación • 240 menores</p>
              <div className="text-3xl font-bold text-purple-600 mb-4">67.000€</div>
              <p className="text-purple-700 font-semibold mb-2">Multa por falta de protocolos</p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Incumplimiento:</span> Sin protocolos de actuación ante
                situaciones de riesgo ni canales de comunicación seguros.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Total: 140.500€ en multas</h3>
            <p className="text-gray-300">Solo estos 3 casos • Todas podrían haberse evitado con Custodia360</p>
          </div>
        </div>
      </div>

      {/* Controla todo desde cualquier lugar */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Controla todo desde<br />
              <span className="text-blue-600">cualquier lugar</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* iPhone mockup mejorado */}
            <div className="text-center">
              <div className="relative mx-auto w-80">
                {/* iPhone Frame con gradiente y sombras realistas */}
                <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3.5rem] p-2 shadow-2xl drop-shadow-2xl shadow-black/25 border border-gray-700" style={{filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))'}}>
                  {/* Volume buttons */}
                  <div className="absolute left-[-3px] top-24 w-1 h-8 bg-gray-700 rounded-l-lg"></div>
                  <div className="absolute left-[-3px] top-36 w-1 h-6 bg-gray-700 rounded-l-lg"></div>
                  <div className="absolute left-[-3px] top-44 w-1 h-6 bg-gray-700 rounded-l-lg"></div>

                  {/* Power button */}
                  <div className="absolute right-[-3px] top-32 w-1 h-12 bg-gray-700 rounded-r-lg"></div>

                  {/* iPhone Screen */}
                  <div className="bg-black rounded-[3rem] overflow-hidden relative h-[640px]">
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-full z-10"></div>

                    {/* Screen Content */}
                    <div className="bg-gradient-to-br from-gray-100 to-gray-50 h-full relative overflow-hidden">

                      {/* Status Bar mejorada */}
                      <div className="flex justify-between items-center px-6 pt-10 pb-3 relative z-20">
                        <span className="text-sm font-semibold text-black">9:41</span>
                        <div className="flex items-center space-x-2">
                          {/* Cellular Signal */}
                          <div className="flex items-end space-x-0.5">
                            <div className="w-1 h-2 bg-black rounded-full"></div>
                            <div className="w-1 h-3 bg-black rounded-full"></div>
                            <div className="w-1 h-4 bg-black rounded-full"></div>
                            <div className="w-1 h-5 bg-black rounded-full"></div>
                          </div>
                          {/* WiFi icon mejorado */}
                          <svg className="w-4 h-4" fill="black" viewBox="0 0 24 24">
                            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                          </svg>
                          {/* Battery mejorada */}
                          <div className="relative">
                            <div className="w-6 h-3 border-2 border-black rounded-sm"></div>
                            <div className="absolute top-[3px] right-[2px] w-3 h-1.5 bg-green-500 rounded-sm"></div>
                            <div className="absolute top-[5px] -right-[2px] w-0.5 h-0.5 bg-black rounded-r"></div>
                          </div>
                        </div>
                      </div>

                      {/* App Header */}
                      <div className="px-6 mb-4">
                        <div className="flex items-center justify-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                            <span className="text-white font-bold text-lg">C</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-gray-900">Custodia360</h4>
                            <p className="text-xs text-gray-500">Protección Infantil</p>
                          </div>
                        </div>
                      </div>

                      {/* Main Dashboard Content */}
                      <div className="px-6 space-y-3">
                        {/* Estado LOPIVI Card compacta */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-medium opacity-90 mb-1">Estado LOPIVI</div>
                              <div className="text-2xl font-bold">99%</div>
                              <div className="text-xs opacity-75">Cumplimiento actual</div>
                            </div>
                            <div className="text-right">
                              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-lg">✓</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats Grid compacta */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
                            <div className="text-center">
                              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                              </div>
                              <div className="text-xs text-gray-600 mb-1">Casos Activos</div>
                              <div className="text-xl font-bold text-gray-900">3</div>
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
                            <div className="text-center">
                              <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                              </div>
                              <div className="text-xs text-gray-600 mb-1">Alertas</div>
                              <div className="text-xl font-bold text-gray-900">2</div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons compactos */}
                        <div className="space-y-2">
                          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl py-3 text-sm font-semibold shadow-lg flex items-center justify-center">
                            <span>Nuevo Caso</span>
                          </button>
                          <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl py-3 text-sm font-semibold shadow-lg flex items-center justify-center">
                            <span>Ver Dashboard</span>
                          </button>
                        </div>

                        {/* Quick Access compacto */}
                        <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
                          <h5 className="text-xs font-semibold text-gray-900 mb-2">Acceso Rápido</h5>
                          <div className="flex justify-around">
                            <div className="text-center">
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-1">
                              </div>
                              <span className="text-xs text-gray-600">Protocolo</span>
                            </div>
                            <div className="text-center">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-1">
                              </div>
                              <span className="text-xs text-gray-600">Formación</span>
                            </div>
                            <div className="text-center">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-1">
                              </div>
                              <span className="text-xs text-gray-600">Contacto</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* iPhone Home Indicator */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full opacity-60"></div>
                    </div>
                  </div>
                </div>

                {/* Reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 rounded-[3.5rem] pointer-events-none"></div>
              </div>
            </div>

            {/* Contenido */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Acceso desde cualquier dispositivo</h3>
                <p className="text-gray-600">
                  Móvil, tablet, ordenador. Tu dashboard <span className="text-blue-600 font-semibold">Custodia360</span> funciona
                  perfectamente en todos los dispositivos.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Disponible 24/7</h3>
                <p className="text-gray-600">
                  El sistema funciona las 24 horas del día, los 7 días de la semana. Registra casos y
                  consulta información en cualquier momento.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Notificaciones automáticas</h3>
                <p className="text-gray-600">
                  Recibe alertas inmediatas en tu dashboard sobre casos urgentes, vencimientos y
                  actualizaciones importantes.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Todo en la nube</h3>
                <p className="text-gray-600">
                  Sin instalaciones, sin actualizaciones manuales. Todo funciona automáticamente desde la nube.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-xl font-bold text-blue-900 mb-2">La protección infantil no para nunca</h4>
                <p className="text-blue-700 mb-4">
                  Por eso Custodia360 está disponible siempre que lo necesites
                </p>
                <Link
                  href="/contratar/datos-entidad"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Contratar Custodia360
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Listo para implementar la LOPIVI y tener un Plan de Protección?
          </h2>
          <p className="text-xl text-gray-700 mb-12">
            Únete a las entidades que ya confían en Custodia360 para proteger a los menores
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/planes"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contratar Custodia360 Ahora
            </Link>
            <Link
              href="/planes"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Ver Planes y Precios
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Planes y Servicios</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/planes" className="hover:text-white">Todos los Planes</Link></li>
                <li><Link href="/contratar" className="hover:text-white">Contratar Ahora</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="https://www.boe.es/buscar/doc.php?id=BOE-A-2021-9347" target="_blank" className="hover:text-white">Ley LOPIVI (BOE)</Link></li>
                <li><Link href="/guia" className="hover:text-white">Guía de Implementación</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/faqs" className="hover:text-white">FAQS</Link></li>
                <li><Link href="/privacidad" className="hover:text-white">Política de Privacidad</Link></li>
                <li><Link href="/terminos" className="hover:text-white">Términos y Condiciones</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Política de Cookies</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Newsletter</h3>
              <p className="text-gray-300 mb-4">
                Mantente informado sobre las últimas actualizaciones de la LOPIVI
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 px-4 py-2 rounded-l-lg text-gray-900"
                />
                <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-xl font-bold">Custodia360</span>
            </div>

            {/* Iconos de redes sociales */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="https://linkedin.com/company/custodia360" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://instagram.com/custodia360" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            <p className="text-gray-400 mt-4 md:mt-0">
              © 2025 Custodia360, propiedad de Sportsmotherland SL. Sistema automatizado de cumplimiento LOPIVI.
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot - Temporalmente comentado por error de runtime */}
      {/* <Chatbot /> */}
    </div>
  )
}
