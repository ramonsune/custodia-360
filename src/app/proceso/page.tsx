'use client'

import Link from 'next/link'

export default function ProcesoPage() {

  const steps = [
    {
      numero: "01",
      titulo: "Contratación",
      subtitulo: "Proceso instantáneo",
      duracion: "5 minutos",
      descripcion: "Complete el formulario con los datos de su entidad y delegados. Pago seguro y activación inmediata.",
      detalles: [
        "Formulario simplificado de datos de entidad",
        "Seleccionas el delegado principal y suplente",
        "Verificación automática de requisitos",
        "Pago seguro con pasarela encriptada",
        "Activación inmediata del sistema"
      ],
      color: "bg-blue-600",
      colorLight: "bg-white border-gray-200"
    },
    {
      numero: "02",
      titulo: "Generación Automática",
      subtitulo: "Sistema automático",
      duracion: "30 minutos",
      descripcion: "Nuestro sistema genera automáticamente toda la documentación LOPIVI personalizada para su entidad.",
      detalles: [
        "Plan de Protección Infantil completo",
        "Protocolos específicos por sector",
        "Código de Conducta personalizado",
        "Mapa de Riesgos automatizado",
        "Canal de comunicación LOPIVI"
      ],
      color: "bg-purple-600",
      colorLight: "bg-white border-gray-200"
    },
    {
      numero: "03",
      titulo: "Formación Delegados",
      subtitulo: "Formación automática",
      duracion: "20 horas",
      descripcion: "Formación especializada para delegados con certificación automática al completar el curso.",
      detalles: [
        "Módulos interactivos específicos LOPIVI",
        "Simulaciones de casos reales",
        "Evaluaciones automáticas",
        "Certificado al completar",
        "Acceso 24/7 a la formación"
      ],
      color: "bg-green-600",
      colorLight: "bg-white border-gray-200"
    },
    {
      numero: "04",
      titulo: "Activación del Sistema",
      subtitulo: "Panel operativo",
      duracion: "2 horas",
      descripcion: "Los delegados acceden al panel de control con todas las herramientas operativas activas.",
      detalles: [
        "Dashboard de gestión completo",
        "Sistema de casos y alertas",
        "Comunicación entre delegados",
        "Informes automáticos mensuales",
        "Herramientas de cumplimiento"
      ],
      color: "bg-orange-600",
      colorLight: "bg-white border-gray-200"
    },
    {
      numero: "05",
      titulo: "Cumplimiento",
      subtitulo: "72 horas después",
      duracion: "Permanente",
      descripcion: "Su entidad cumple con la normativa LOPIVI y dispone de todas las herramientas operativas.",
      detalles: [
        "Cumplimiento normativa LOPIVI",
        "Documentación completa y actualizada",
        "Delegados formados",
        "Sistema operativo funcionando",
        "Soporte y actualizaciones automáticas"
      ],
      color: "bg-emerald-600",
      colorLight: "bg-white border-gray-200"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white text-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Proceso de
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                Implementación
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              <span className="text-orange-600 font-bold">Primera empresa automatizada</span> de España.
              <br/>De la contratación al cumplimiento LOPIVI en <span className="text-orange-600 font-bold">72 horas</span>.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="bg-gray-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">72h</div>
                <div className="text-sm text-gray-600">Implementación completa</div>
              </div>
              <div className="bg-gray-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">Cumplimiento</div>
                <div className="text-sm text-gray-600">LOPIVI</div>
              </div>
              <div className="bg-gray-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">97%</div>
                <div className="text-sm text-gray-600">Ahorro en costes</div>
              </div>
            </div>

            <Link
              href="/contratar/datos-entidad"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Comenzar Implementación
            </Link>
          </div>
        </div>
      </div>

      {/* Proceso paso a paso */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Proceso Completamente Automatizado
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestro sistema inteligente gestiona todo el proceso sin intervención manual.
              Solo tiene que completar la contratación y nosotros nos encargamos del resto.
            </p>
          </div>

          {/* Timeline de pasos */}
          <div className="relative">
            {/* Línea central */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 via-purple-200 via-green-200 via-orange-200 to-emerald-200"></div>

            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex items-center mb-16"
              >
                {/* Contenido izquierda/derecha alternado */}
                <div className={`w-full flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-full max-w-lg ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className={`${step.colorLight} border-2 rounded-2xl p-8 shadow-lg`}>
                      {/* Header del paso */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg font-bold text-lg">
                          Paso {step.numero}
                        </div>
                        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                          {step.duracion}
                        </div>
                      </div>

                      {/* Contenido */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.titulo}</h3>
                      <p className="text-lg text-gray-700 font-medium mb-4">{step.subtitulo}</p>
                      <p className="text-gray-600 mb-6">{step.descripcion}</p>

                      {/* Lista de detalles */}
                      <ul className="space-y-3">
                        {step.detalles.map((detalle, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{detalle}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Círculo central */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center text-gray-800 font-bold text-xl shadow-lg border-4 border-gray-200">
                    {step.numero}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparación con métodos tradicionales */}
      <div className="text-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-blue-600">Custodia360</span> vs Métodos Tradicionales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare nuestra implementación automatizada con los métodos tradicionales
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Métodos tradicionales */}
            <div className="bg-white border border-red-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-red-600 mb-6 text-center">
                Métodos Tradicionales
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  <span className="text-gray-700">3-6 meses de implementación</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  <span className="text-gray-700">Costes entre 3.000€ - 15.000€</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  <span className="text-gray-700">Consultorías externas obligatorias</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  <span className="text-gray-700">Documentación genérica</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  <span className="text-gray-700">Formación presencial limitada</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  <span className="text-gray-700">Sin herramientas operativas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  <span className="text-gray-700">Actualizaciones manuales</span>
                </li>
              </ul>
            </div>

            {/* Custodia360 */}
            <div className="bg-white border border-green-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                Custodia360
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <span className="text-gray-700">72 horas de implementación</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <span className="text-gray-700">38€ al año (Plan 100)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <span className="text-gray-700">Automatizado sin consultorías</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <span className="text-gray-700">Documentación personalizada</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <span className="text-gray-700">Formación automática 24/7</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <span className="text-gray-700">Panel operativo completo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <span className="text-gray-700">Actualizaciones automáticas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para implementar la LOPIVI en 72 horas?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Únase a las entidades que ya confían en nuestra tecnología automatizada.
            Sin riesgos, sin complicaciones, sin esperas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contratar/datos-entidad"
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Contratar Ahora
            </Link>
            <Link
              href="/planes"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors"
            >
              Ver Planes y Precios
            </Link>
          </div>

          <div className="mt-8 text-orange-100 text-sm">
            Activación inmediata • Sin permanencia • 38€ al año
          </div>
        </div>
      </div>


    </div>
  )
}
