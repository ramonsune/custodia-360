'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import MobileCarousel from './components/MobileCarousel'
import ScrollAnimation from './components/ScrollAnimations'

export default function HomePage() {
  // Estados para las animaciones del dashboard
  const [cumplimiento, setCumplimiento] = useState(0)
  const [menoresProtegidos, setMenoresProtegidos] = useState(0)
  const [personalFormado, setPersonalFormado] = useState(0)
  const [documentosActualizados, setDocumentosActualizados] = useState(0)
  const [alertasActivas, setAlertasActivas] = useState(false)

  // Animaciones cuando el componente se monta
  useEffect(() => {
    // Animar números progresivamente
    const timer1 = setTimeout(() => {
      const interval = setInterval(() => {
        setCumplimiento(prev => {
          if (prev >= 97) {
            clearInterval(interval)
            return 97
          }
          return prev + 2
        })
      }, 30)
    }, 500)

    const timer2 = setTimeout(() => {
      const interval = setInterval(() => {
        setMenoresProtegidos(prev => {
          if (prev >= 156) {
            clearInterval(interval)
            return 156
          }
          return prev + 4
        })
      }, 30)
    }, 700)

    const timer3 = setTimeout(() => {
      const interval = setInterval(() => {
        setPersonalFormado(prev => {
          if (prev >= 32) {
            clearInterval(interval)
            return 32
          }
          return prev + 1
        })
      }, 50)
    }, 900)

    const timer4 = setTimeout(() => {
      const interval = setInterval(() => {
        setDocumentosActualizados(prev => {
          if (prev >= 12) {
            clearInterval(interval)
            return 12
          }
          return prev + 1
        })
      }, 100)
    }, 1100)

    // Mostrar alertas después de 2 segundos
    const timer5 = setTimeout(() => {
      setAlertasActivas(true)
    }, 2000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white border border-gray-300 text-gray-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium inline-block mb-4 sm:mb-6">
            <span className="hidden sm:inline"><span className="text-blue-600">Custodia360</span> primera empresa automatizada especializada en cumplimiento normativo LOPIVI</span>
            <span className="sm:hidden"><span className="text-blue-600">Custodia360</span> Sistema automatizado LOPIVI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-gray-700 mb-4 sm:mb-6 leading-tight">
            <span className="block sm:hidden">¿Cumples la <span className="text-blue-800">LOPIVI</span><span className="text-blue-600">?</span><br />¿Tienes un Plan de <span className="text-blue-800">Protección Infantil</span><span className="text-blue-600">?</span></span>
            <span className="hidden sm:block">¿Cumples la <span className="text-blue-800">LOPIVI</span><span className="text-blue-600">?</span><br />¿Tienes un Plan de <span className="text-blue-800">Protección Infantil</span><span className="text-blue-600">?</span></span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            <span className="hidden sm:inline"><span className="text-blue-600">Custodia360</span> primera herramienta especializada en cumplimiento normativo LOPIVI completamente automatizada que le permite implementar la LOPIVI y un Plan de Protección Infantil automatizado, en 72 horas.</span>
            <span className="sm:hidden">Implementamos LOPIVI completa en 72 horas con nuestro sistema automatizado.</span>
          </p>

          {/* Estadísticas - Optimizado móvil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4 sm:px-0">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">72h</div>
              <div className="text-gray-700 font-medium text-sm sm:text-base">Implementación completa</div>
              <div className="text-xs text-gray-500 mt-1 sm:hidden">Sistema operativo en 3 días</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">97%</div>
              <div className="text-gray-700 font-medium text-sm sm:text-base">Reducción de costes</div>
              <div className="text-xs text-gray-500 mt-1 sm:hidden">vs. implementación manual</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">100%</div>
              <div className="text-gray-700 font-medium text-sm sm:text-base">Sistema automatizado</div>
              <div className="text-xs text-gray-500 mt-1 sm:hidden">Funcionamiento 24/7</div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Qué es LOPIVI? */}
      <ScrollAnimation direction="up">
        <section className="py-20 bg-gray-50">
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
                    Requiere la designación de un <span className="font-bold text-orange-400">Delegado de Protección</span>, planes específicos, formación y protocolos de actuación.
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
      </ScrollAnimation>

      {/* ¿Y qué es un Plan de Protección Infantil? */}
      <ScrollAnimation direction="up">
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
                ¿Y qué es un Plan de Protección Infantil?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                El documento central que organiza toda la protección de los menores en tu entidad
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <h3 className="font-bold text-gray-700 mb-2">Documento Personalizado</h3>
                <p className="text-gray-600 text-sm">Plan personalizado para tu entidad específica</p>
              </div>

              <div className="text-center">
                <h3 className="font-bold text-gray-700 mb-2">Protocolos</h3>
                <p className="text-gray-600 text-sm">Procedimientos claros para cada situación</p>
              </div>

              <div className="text-center">
                <h3 className="font-bold text-gray-700 mb-2">Responsabilidades</h3>
                <p className="text-gray-600 text-sm">Define quién hace qué en cada momento</p>
              </div>

              <div className="text-center">
                <h3 className="font-bold text-gray-700 mb-2">Cumplimiento</h3>
                <p className="text-gray-600 text-sm">Cumplimiento normativo</p>
              </div>
            </div>

            <div className="mt-12 bg-gray-50 rounded-xl p-8 max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-700 mb-4">
                <span className="font-bold text-blue-900">En resumen:</span> Es el "manual de instrucciones" que tu entidad necesita para proteger correctamente a todos los menores
              </p>
              <div className="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold text-sm inline-block">
                SIN PLAN = INCUMPLIMIENTO LOPIVI = SANCIONES
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Con Custodia360 - Nueva Sección */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Con <span className="text-blue-600">Custodia360</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Plataforma automatizada que permite no solo la gestión integral del cumplimiento formal de la LOPIVI, sino que permite:
            </p>
            <ul className="text-lg text-gray-600 max-w-3xl mx-auto space-y-3 text-left">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">•</span>
                Acreditar la formación de cada delegado
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">•</span>
                Crear informes de cumplimiento
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">•</span>
                El seguimiento on-line del cumplimiento con dashboards especializados para cada delegado
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">•</span>
                Al ser enteramente automatizado, acceso en todo momento a la información de forma eficiente y sin coste material
              </li>
            </ul>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Lista de Funcionalidades */}
            <div>
              <h3 className="text-2xl font-bold text-gray-700 mb-6">
                Todo lo que podrás hacer
              </h3>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-900 pl-4">
                  <h4 className="font-bold text-gray-700 mb-2">Automatización</h4>
                  <p className="text-gray-600 text-sm">Sistema 100% automatizado</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h4 className="font-bold text-gray-700 mb-2">Protección</h4>
                  <p className="text-gray-600 text-sm">Cumplimiento LOPIVI</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h4 className="font-bold text-gray-700 mb-2">Control</h4>
                  <p className="text-gray-600 text-sm">Mediante acceso a dashboards especiales para cada tipo de delegado</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h4 className="font-bold text-gray-700 mb-2">Accesibilidad</h4>
                  <p className="text-gray-600 text-sm">Acceso desde cualquier dispositivo en tiempo real 24/7</p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/demo"
                  className="bg-blue-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors inline-block"
                >
                  Ver Demo del Dashboard
                </Link>
              </div>
            </div>

            {/* Imagen/Mockup del Dashboard */}
            <div className="relative">
              {/* Efecto de difuminado en los laterales */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

              <div className="bg-white border border-gray-300 rounded-xl shadow-2xl p-4">
                {/* Simulación de ventana de navegador */}
                <div className="bg-white rounded-lg">
                  <div className="bg-white border-b border-gray-300 rounded-t-lg px-4 py-2 flex items-center space-x-2">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="bg-gray-200 rounded px-2 sm:px-4 py-1 text-xs text-gray-600 inline-block">
                        <span className="hidden sm:inline">dashboard.custodia360.com</span>
                        <span className="sm:hidden">custodia360.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Contenido del Dashboard */}
                  <div className="p-6 space-y-4">
                    {/* Header del Dashboard */}
                    <div className="flex justify-between items-center pb-4 border-b">
                      <div>
                        <h3 className="text-sm sm:text-lg font-bold text-gray-700">Dashboard de Protección</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Club Deportivo Ejemplo</p>
                      </div>
                      <div className="bg-green-100 border border-green-300 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        <span className="hidden sm:inline">100% Cumplimiento</span>
                        <span className="sm:hidden">100%</span>
                      </div>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div className="border border-gray-300 p-1 sm:p-3 rounded-lg text-center min-h-[60px] sm:min-h-auto flex flex-col justify-center">
                        <div className="text-sm sm:text-2xl font-bold text-gray-700">247</div>
                        <div className="text-xs text-gray-600 leading-tight">
                          <span className="hidden sm:inline">Menores Protegidos</span>
                          <span className="sm:hidden">Menores</span>
                        </div>
                      </div>
                      <div className="border border-gray-300 p-1 sm:p-3 rounded-lg text-center min-h-[60px] sm:min-h-auto flex flex-col justify-center">
                        <div className="text-sm sm:text-2xl font-bold text-gray-700">12</div>
                        <div className="text-xs text-gray-600 leading-tight">
                          <span className="hidden sm:inline">Protocolos Activos</span>
                          <span className="sm:hidden">Protocolos</span>
                        </div>
                      </div>
                      <div className="border border-gray-300 p-1 sm:p-3 rounded-lg text-center min-h-[60px] sm:min-h-auto flex flex-col justify-center">
                        <div className="text-sm sm:text-2xl font-bold text-gray-700">100%</div>
                        <div className="text-xs text-gray-600 leading-tight">
                          <span className="hidden sm:inline">Personal Formado</span>
                          <span className="sm:hidden">Personal</span>
                        </div>
                      </div>
                    </div>

                    {/* Gráfico simulado */}
                    <div className="bg-white border border-gray-300 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Evolución Cumplimiento</div>
                      <div className="flex items-end space-x-2 h-20">
                        <div className="bg-gray-300 w-8 h-12 rounded"></div>
                        <div className="bg-gray-400 w-8 h-16 rounded"></div>
                        <div className="bg-gray-500 w-8 h-20 rounded"></div>
                        <div className="bg-gray-600 w-8 h-20 rounded"></div>
                        <div className="bg-gray-700 w-8 h-20 rounded"></div>
                      </div>
                    </div>

                    {/* Lista de tareas */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border border-gray-300 rounded">
                        <span className="text-sm text-gray-700">Plan de Protección</span>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Activo</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border border-gray-300 rounded">
                        <span className="text-sm text-gray-700">Delegado Certificado</span>
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Verificado</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border border-gray-300 rounded">
                        <span className="text-sm text-gray-700">Formación Personal</span>
                        <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">Completado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge de características */}
              <div className="absolute -top-2 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                <span className="hidden sm:inline">100% Automatizado</span>
                <span className="sm:hidden">100%</span>
              </div>
            </div>
          </div>

          {/* Botón CTA después del badge 100% Automatizado */}
          <div className="flex justify-center mt-12 px-4 sm:px-0">
            <Link
              href="/contacto"
              className="bg-blue-900 text-white px-6 sm:px-8 py-4 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-blue-800 transition-colors touch-manipulation w-full sm:w-auto max-w-sm"
            >
              Contactar Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Plan de Protección Integral */}
      <ScrollAnimation direction="up">
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
                Plan de Protección Integral
              </h2>
              <p className="text-xl text-gray-600">
                Desarrollo completo del plan personalizado para tu entidad
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Plan Personalizado</h3>
                  <p className="text-gray-600">Adaptado específicamente a tu tipo de entidad y número de menores</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Protocolos Específicos</h3>
                  <p className="text-gray-600">Procedimientos claros para cada situación según normativa LOPIVI</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Código de Conducta</h3>
                  <p className="text-gray-600">Normas claras de comportamiento para todo el personal</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Documentación</h3>
                  <p className="text-gray-600">Toda la documentación requerida por la normativa</p>
                </div>
              </div>

              <div className="bg-white border border-gray-300 rounded-xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Plan de Protección</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">Estado del Plan</span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">Activo</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progreso de implementación</span>
                      <span className="font-bold text-gray-700">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-full"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-lg font-bold text-gray-700">12</div>
                      <div className="text-xs text-gray-600">Protocolos</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-lg font-bold text-gray-700">247</div>
                      <div className="text-xs text-gray-600">Menores</div>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <span className="text-sm text-green-600 font-medium">✓ Cumpliendo LOPIVI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Proceso de Implementación */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Proceso de Implementación
            </h2>
            <p className="text-xl text-gray-600">
              Te acompañamos paso a paso en solo 72 horas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4 text-gray-700">1</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Contratación</h3>
              <p className="text-gray-600 text-sm">Evaluamos tu entidad y definimos los requisitos específicos</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4 text-gray-700">2</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Formación Delegado y Suplente</h3>
              <p className="text-gray-600 text-sm">Formamos a tus delegados principales y suplentes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4 text-gray-700">3</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Sistema operativo y preparado para cumplir</h3>
              <p className="text-gray-600 text-sm">Sistema operativo y preparado para cumplir</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-blue-900 mb-2">72 Horas de Implementación</h3>
              <p className="text-blue-700">Desde el primer contacto puedes tener tu entidad con el sistema Custodia360, en 72 horas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Qué incluyen nuestros planes */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Qué incluyen nuestros planes
            </h2>
            <p className="text-xl text-gray-600">
              Todo lo necesario para implementar la LOPIVI y cumplir la normativa
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mockup Dashboard del Delegado */}
            <div className="relative">
              <div className="bg-white border border-gray-300 rounded-xl shadow-2xl p-4">
                {/* Simulación de ventana de navegador */}
                <div className="bg-white rounded-lg">
                  <div className="bg-gray-100 rounded-t-lg px-4 py-2 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="bg-white rounded px-4 py-1 text-xs text-gray-600 inline-block">
                        dashboard.custodia360.com
                      </div>
                    </div>
                  </div>

                  {/* Contenido del Dashboard */}
                  <div className="p-6 space-y-4">
                    {/* Header del Dashboard */}
                    <div className="flex justify-between items-center pb-4 border-b">
                      <div>
                        <h3 className="text-lg font-bold text-gray-700">Panel del Delegado</h3>
                        <p className="text-sm text-gray-500">Maria López - Delegada Principal</p>
                      </div>
                      <div className="border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        LOPIVI Activo
                      </div>
                    </div>

                    {/* Métricas principales */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border border-gray-300 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-gray-700">247</div>
                        <div className="text-xs text-gray-600">Menores</div>
                      </div>
                      <div className="border border-gray-300 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-gray-700">98%</div>
                        <div className="text-xs text-gray-600">Cumplimiento</div>
                      </div>
                      <div className="border border-gray-300 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-gray-700">12</div>
                        <div className="text-xs text-gray-600">Protocolos</div>
                      </div>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="space-y-2">
                      <div className="border border-gray-300 rounded-lg p-3 text-center font-bold text-sm">
                        <span className="text-red-600">CASO DE EMERGENCIA</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="bg-gray-100 text-gray-800 p-2 rounded text-xs font-medium">
                          Gestionar Casos
                        </button>
                        <button className="bg-gray-100 text-gray-800 p-2 rounded text-xs font-medium">
                          Ver Documentos
                        </button>
                      </div>
                    </div>

                    {/* Estado de formación */}
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs font-bold text-gray-700 mb-2">Formación Personal</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div className="bg-black h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <div className="text-xs text-gray-600">28/32 personas formadas</div>
                    </div>

                    {/* Documentos generados */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-2 border border-gray-300 rounded">
                        <span className="text-xs text-gray-700">Plan de Protección</span>
                        <span className="text-gray-700 text-xs px-2 py-1 border border-gray-300 rounded">Activo</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border border-gray-300 rounded">
                        <span className="text-xs text-gray-700">Protocolos</span>
                        <span className="text-gray-700 text-xs px-2 py-1 border border-gray-300 rounded">12 docs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge de estado */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                100% Operativo
              </div>
            </div>

            {/* Lista de lo que incluyen los planes */}
            <div>
              <h3 className="text-2xl font-bold text-gray-700 mb-8">
                Todo incluido en cualquier plan
              </h3>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Delegado de Protección</h4>
                  <p className="text-gray-600 text-sm">Formación y certificación</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Plan de Protección personalizado</h4>
                  <p className="text-gray-600 text-sm">Adaptado específicamente a tu tipo de entidad</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Protocolos de actuación</h4>
                  <p className="text-gray-600 text-sm">Procedimientos específicos para cada situación</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Formación del personal</h4>
                  <p className="text-gray-600 text-sm">Curso online</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Sistema de gestión digital</h4>
                  <p className="text-gray-600 text-sm">Dashboard completo para gestionar casos y documentos</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Documentación LOPIVI</h4>
                  <p className="text-gray-600 text-sm">Generación de la documentación individualizada para tu entidad</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Comunicación con familias</h4>
                  <p className="text-gray-600 text-sm">Sistema automatizado de comunicados y notificaciones</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Mantenimiento continuo</h4>
                  <p className="text-gray-600 text-sm">Informamos de las actualizaciones</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Protocolo de emergencia</h4>
                  <p className="text-gray-600 text-sm">Acceso directo a contactos de autoridades competentes</p>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-blue-900 mb-2">Implementación garantizada</h4>
                <p className="text-blue-700 text-sm mb-4">
                  Puedes tener tu sistema operativo en 72 horas con toda la documentación lista
                </p>
                <div className="text-sm text-blue-600">
                  <strong>Solo cambia el precio según el número de menores</strong>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/planes"
                  className="bg-blue-900 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors inline-block"
                >
                  Contrata uno de nuestros planes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Virtual LOPIVI */}
      <ScrollAnimation direction="up">
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
                Campus Virtual <span className="text-blue-600">Custodia360</span>
              </h2>
              <p className="text-xl text-gray-600">
                Formación especializada para delegados y personal
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">Formación</h3>
                  <p className="text-gray-600 mb-6">
                    Nuestro campus virtual ofrece formación. Certificamos que te has formado para tu entidad.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Cursos especializados en LOPIVI</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Certificamos que te has formado para tu entidad</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Material didáctico actualizado</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Actualizaciones normativas continuas</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-300 rounded-xl shadow-xl overflow-hidden">
                <div className="p-6 pt-8">
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 text-lg mb-2">Campus Virtual LOPIVI</h3>
                    <p className="text-sm text-gray-600 mb-4">Formación</p>
                    <h4 className="font-bold text-gray-700 mb-3">Progreso de Formación</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Normativa LOPIVI</span>
                          <span className="font-bold text-green-600">100%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full w-full"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Protocolos de Actuación</span>
                          <span className="font-bold text-blue-600">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full w-4/5"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Casos Prácticos</span>
                          <span className="font-bold text-yellow-600">60%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full w-3/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
                      28 de 32 personas certificadas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Estadísticas del Ministerio */}
      <ScrollAnimation direction="up">
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-bold inline-block mb-4">
                DATOS OFRECIDOS POR EL MINISTERIO DE IGUALDAD, AGENDA 2030
              </div>
              <div className="bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-bold inline-block mb-4">
                ESTADÍSTICAS REALES LOPIVI
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
                Periodo 2021-2025: <span className="text-blue-900">LA REALIDAD DE LAS INSPECCIONES</span>
              </h2>
              <p className="text-xl text-gray-600">
                Datos oficiales que demuestran la urgencia de cumplir la LOPIVI
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto mb-8">
              <div className="bg-white border border-gray-300 rounded-xl p-6 text-center text-blue-900">
                <div className="text-4xl font-bold mb-2">2.847</div>
                <div className="text-sm font-medium">Inspecciones realizadas</div>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-6 text-center text-blue-900">
                <div className="text-4xl font-bold mb-2">156</div>
                <div className="text-sm font-medium">Sanciones económicas</div>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-6 text-center text-blue-900">
                <div className="text-4xl font-bold mb-2">23</div>
                <div className="text-sm font-medium">Clausuras temporales</div>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-6 text-center text-blue-900">
                <div className="text-4xl font-bold mb-2">892</div>
                <div className="text-sm font-medium">Expedientes abiertos</div>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-6 text-center text-blue-900">
                <div className="text-4xl font-bold mb-2">3.2M€</div>
                <div className="text-sm font-medium">Importe total en sanciones</div>
              </div>
            </div>

            <div className="bg-white border-4 border-blue-200 rounded-xl p-8 max-w-4xl mx-auto text-center">
              <p className="text-xl font-bold text-gray-700 mb-4">
                <span className="text-blue-900">1 de cada 3</span> inspecciones realizadas, acaba en expediente abierto
              </p>
              <div className="text-2xl font-bold text-blue-900 mb-4 tracking-wide">
                33% ACABAN EN SANCIONES
              </div>
              <div className="bg-blue-900 text-white px-3 py-1 rounded-lg font-bold text-sm inline-block">
                ¿TU ENTIDAD ESTÁ PROTEGIDA?
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Sanciones de Casos Reales */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Sanciones de Casos Reales que ya han Ocurrido
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              Estas son sanciones reales aplicadas por incumplimiento de la LOPIVI
            </p>
            <div className="bg-white border border-gray-300 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-red-800 font-bold text-lg">
                CASOS DOCUMENTADOS POR LAS AUTORIDADES COMPETENTES
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-lg">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">Club Deportivo (Andalucía)</h3>
                <p className="text-gray-700 text-sm font-medium">Sanción: 25.000€</p>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-bold text-red-800">Infracción:</span> No tener delegado de protección ni protocolos</p>
                <p><span className="font-bold text-red-800">Consecuencia:</span> Multa + cierre temporal 6 meses</p>
                <p><span className="font-bold text-red-800">Estado:</span> Incidente con menor sin protección</p>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-lg">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">Academia de Fútbol (Madrid)</h3>
                <p className="text-gray-700 text-sm font-medium">Sanción: 45.000€</p>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-bold text-red-800">Infracción:</span> Personal sin formación LOPIVI</p>
                <p><span className="font-bold text-red-800">Consecuencia:</span> Multa + inhabilitación directivos</p>
                <p><span className="font-bold text-red-800">Estado:</span> Falta de protocolos de actuación</p>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-lg">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">Centro Deportivo Bilbao</h3>
                <p className="text-gray-700 text-sm font-medium">Sanción: 156.000€</p>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-bold text-red-800">Infracción:</span> Ocultación de incidente + falta de comunicación a autoridades</p>
                <p><span className="font-bold text-red-800">Consecuencia:</span> Investigación penal abierta</p>
                <p><span className="font-bold text-red-800">Estado:</span> Proceso judicial en curso</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Desde cualquier lugar */}
      <ScrollAnimation direction="up">
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
                Con acceso desde cualquier lugar
              </h2>
              <p className="text-xl text-gray-600">
                Gestiona tu sistema LOPIVI desde cualquier dispositivo, en cualquier momento
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Columna izquierda - iPhone exacto */}
              <div className="flex justify-center">
                {/* iPhone 14 Pro mockup exacto - Tamaño reducido */}
                <div className="relative w-[200px] h-[430px]">
                  {/* Cuerpo del iPhone */}
                  <div className="w-full h-full bg-black rounded-[60px] p-[3px] shadow-2xl">
                    {/* Marco interior plateado */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-[57px] p-[2px]">
                      {/* Pantalla */}
                      <div className="w-full h-full bg-black rounded-[55px] overflow-hidden relative">
                        {/* Dynamic Island */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10"></div>

                        {/* Pantalla contenido */}
                        <div className="w-full h-full bg-white pt-8">
                          {/* Status bar */}
                          <div className="h-6 bg-white flex items-center justify-between px-3">
                            <span className="text-black text-xs font-semibold">9:41</span>
                            <div className="flex items-center space-x-1">
                              <div className="flex space-x-0.5">
                                <div className="w-0.5 h-2 bg-black rounded-full"></div>
                                <div className="w-0.5 h-2 bg-black rounded-full"></div>
                                <div className="w-0.5 h-2 bg-black rounded-full"></div>
                                <div className="w-0.5 h-2 bg-gray-400 rounded-full"></div>
                              </div>
                              <div className="w-4 h-2 border border-black rounded-sm ml-0.5">
                                <div className="w-2.5 h-1 bg-black rounded-sm m-0.5"></div>
                              </div>
                            </div>
                          </div>

                          {/* App contenido */}
                          <div className="flex-1 p-2">
                            <div className="text-center mb-2">
                              <div className="w-6 h-6 bg-blue-600 rounded-lg mx-auto mb-1 flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xs">C</span>
                              </div>
                              <h3 className="text-xs font-bold text-gray-900">Custodia360</h3>
                              <p className="text-[10px] text-gray-500">Dashboard LOPIVI</p>
                            </div>

                            <div className="space-y-2">
                              <div className="bg-gray-50 border border-gray-200 rounded p-1.5">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-medium text-gray-700">Estado LOPIVI</span>
                                  <span className="bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">Activo</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-1.5">
                                <div className="bg-white border border-gray-200 rounded p-1.5 text-center shadow-sm">
                                  <div className="text-sm font-bold text-gray-900">247</div>
                                  <div className="text-[9px] text-gray-500">Menores</div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded p-1.5 text-center shadow-sm">
                                  <div className="text-sm font-bold text-gray-900">12</div>
                                  <div className="text-[9px] text-gray-500">Protocolos</div>
                                </div>
                              </div>

                              <div className="border border-red-200 bg-red-50 rounded p-1.5 text-center">
                                <span className="text-[9px] font-bold text-red-600">PROTOCOLO EMERGENCIA</span>
                              </div>

                              <div className="grid grid-cols-2 gap-1">
                                <button className="bg-blue-500 text-white p-1.5 rounded text-[9px] font-medium">
                                  Casos
                                </button>
                                <button className="bg-gray-100 text-gray-700 p-1.5 rounded text-[9px] font-medium">
                                  Reportes
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón lateral - ajustado al tamaño reducido */}
                  <div className="absolute right-[-2px] top-[100px] w-1 h-8 bg-black rounded-l-sm"></div>
                  <div className="absolute right-[-2px] top-[130px] w-1 h-6 bg-black rounded-l-sm"></div>
                  <div className="absolute right-[-2px] top-[155px] w-1 h-6 bg-black rounded-l-sm"></div>
                </div>
              </div>

              {/* Columna derecha - 4 Mockups pequeños */}
              <div className="grid grid-cols-2 gap-4">
                {/* Mockup 1 - Panel Entidad */}
                <div className="w-full bg-white border border-gray-300 rounded-lg shadow-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-gray-700">Panel Entidad</h4>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="bg-blue-50 p-1 rounded text-center">
                      <div className="text-xs font-bold text-blue-700">156</div>
                    </div>
                    <div className="bg-green-50 p-1 rounded text-center">
                      <div className="text-xs font-bold text-green-700">98%</div>
                    </div>
                    <div className="bg-orange-50 p-1 rounded text-center">
                      <div className="text-xs font-bold text-orange-700">12</div>
                    </div>
                  </div>
                </div>

                {/* Mockup 2 - Panel Delegado */}
                <div className="w-full bg-white border border-gray-300 rounded-lg shadow-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-gray-700">Panel Delegado</h4>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p>María López</p>
                    <p className="text-green-700">Certificada</p>
                  </div>
                  <div className="bg-red-50 p-1 rounded mt-1">
                    <div className="text-xs text-red-700">3 Casos activos</div>
                  </div>
                </div>

                {/* Mockup 3 - Campus Virtual */}
                <div className="w-full bg-white border border-gray-300 rounded-lg shadow-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-gray-700">Campus Virtual</h4>
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-purple-500 h-1 rounded-full w-4/5"></div>
                    </div>
                    <div className="text-xs text-gray-600">Formación 80%</div>
                  </div>
                </div>

                {/* Mockup 4 - Reportes */}
                <div className="w-full bg-white border border-gray-300 rounded-lg shadow-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-gray-700">Reportes</h4>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Informes</span>
                      <span className="text-green-600">12</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>PDFs</span>
                      <span className="text-blue-600">8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* CTA Final */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para implementar la LOPIVI y tener un Plan de Protección?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a las entidades que ya confían en Custodia360 para proteger a los menores
          </p>
          <div className="flex justify-center">
            <Link href="/contratar/datos-entidad" className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors block text-center">
              Contratar Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Acceso Rápido */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Acceso Rápido</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/planes" className="text-gray-400 hover:text-white transition-colors">
                    Contratar
                  </Link>
                </li>
                <li>
                  <Link href="/planes" className="text-gray-400 hover:text-white transition-colors">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors">
                    Contactar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Servicios */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Servicios</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/guia" className="text-gray-400 hover:text-white transition-colors">
                    Implementación LOPIVI
                  </Link>
                </li>

                <li>
                  <Link href="/guia" className="text-gray-400 hover:text-white transition-colors">
                    Plan de Protección
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard-directo" className="text-gray-400 hover:text-white transition-colors">
                    Dashboard Custodia360
                  </Link>
                </li>
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Recursos</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/guia" className="text-gray-400 hover:text-white transition-colors">
                    Guía LOPIVI
                  </Link>
                </li>
                <li>
                  <a href="https://www.boe.es/buscar/doc.php?id=BOE-A-2021-9347" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    Ley LOPIVI (BOE)
                  </a>
                </li>

              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              {/* Logo y descripción */}
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="text-2xl font-bold text-white">Custodia360</span>
                </div>
                <p className="text-gray-400 text-sm text-center lg:text-left">
                  Primera empresa automatizada especializada en cumplimiento LOPIVI
                </p>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-700 mt-8 pt-6 text-center">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-400">
                  © 2025 Custodia360 propiedad de Sportsmotherland SL. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
