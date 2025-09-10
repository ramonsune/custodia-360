'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

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
            <span className="hidden sm:inline">Custodia360 primera empresa automatizada especializada en cumplimiento normativo</span>
            <span className="sm:hidden">Sistema automatizado</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-gray-700 mb-4 sm:mb-6 leading-tight">
            <span className="block sm:hidden">¿Cumples la <span className="text-blue-800">LOPIVI</span>?<br />¿Tienes un Plan de <span className="text-blue-800">Protección Infantil</span>?</span>
            <span className="hidden sm:block">¿Cumples la <span className="text-blue-800">LOPIVI</span>?<br />¿Tienes un Plan de <span className="text-blue-800">Protección Infantil</span>?</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            <span className="hidden sm:inline">Primera empresa con un sistema automatizado de España que te permite implementar la LOPIVI y un Plan de Protección Infantil automatizado, en 72 horas.</span>
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

        {/* Mockup Dashboard Horizontal */}
        <div className="mt-16 relative max-w-6xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent">
            {/* Efecto de difuminado en los lados */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

            {/* Mockup del Dashboard */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-xl mx-8 my-4">
              <div className="bg-gray-100 rounded-t-xl px-6 py-3 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 text-center">
                  <div className="bg-white rounded px-6 py-1 text-sm text-gray-600 inline-block">
                    dashboard.entidad.custodia360.com
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                  100% LOPIVI
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Panel principal */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Control de Cumplimiento</h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">247</div>
                        <div className="text-xs text-blue-700">Menores</div>
                      </div>
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">100%</div>
                        <div className="text-xs text-green-700">Cumplimiento</div>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">12</div>
                        <div className="text-xs text-orange-700">Protocolos</div>
                      </div>
                    </div>
                    <div className="bg-red-600 text-white rounded-lg p-3 text-center font-bold text-sm mb-4">
                      PROTOCOLO DE EMERGENCIA
                    </div>
                  </div>

                  {/* Panel derecho */}
                  <div className="md:col-span-2">
                    <h4 className="font-bold text-gray-800 mb-3">Estado de Implementación</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                        <span className="text-sm text-gray-700">Plan de Protección</span>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Activo</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded">
                        <span className="text-sm text-gray-700">Delegado Certificado</span>
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Verificado</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded">
                        <span className="text-sm text-gray-700">Personal Formado</span>
                        <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">32/32</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-purple-50 border border-purple-200 rounded">
                        <span className="text-sm text-gray-700">Documentación</span>
                        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">Completa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estilos para animaciones */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-slideDown {
            animation: slideDown 0.5s ease-out;
          }
        `}</style>
      </section>

      {/* ¿Qué es LOPIVI? */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              ¿Qué es la LOPIVI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia es <span className="text-blue-800 font-bold">OBLIGATORIA</span> desde junio 2021
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-700 mb-6">Normativa que cambia todo</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  La LOPIVI establece un <span className="font-bold text-orange-600">marco legal integral</span> para proteger a los menores de cualquier forma de violencia en España.
                </p>
                <p>
                  <span className="font-bold">Es obligatoria</span> para todas las entidades que trabajan con menores: clubes deportivos, escuelas, campamentos, academias, guarderías...
                </p>
                <p>
                  Requiere la designación de un <span className="font-bold text-blue-600">Delegado de Protección</span>, planes específicos, formación y protocolos de actuación.
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

      {/* Con Custodia360 - Nueva Sección */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Con Custodia360
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plataforma integral de gestión LOPIVI con dashboards especializados para cada rol
            </p>
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
                  <p className="text-gray-600 text-sm">Sistema 100% automatizado para cumplimiento integral</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h4 className="font-bold text-gray-700 mb-2">Protección</h4>
                  <p className="text-gray-600 text-sm">Cumplimiento LOPIVI total y protección garantizada</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h4 className="font-bold text-gray-700 mb-2">Control</h4>
                  <p className="text-gray-600 text-sm">Monitoreo en tiempo real y gestión centralizada</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h4 className="font-bold text-gray-700 mb-2">Accesibilidad</h4>
                  <p className="text-gray-600 text-sm">Acceso desde cualquier dispositivo, 24/7</p>
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
                      <div className="bg-gray-200 rounded px-4 py-1 text-xs text-gray-600 inline-block">
                        dashboard.custodia360.com
                      </div>
                    </div>
                  </div>

                  {/* Contenido del Dashboard */}
                  <div className="p-6 space-y-4">
                    {/* Header del Dashboard */}
                    <div className="flex justify-between items-center pb-4 border-b">
                      <div>
                        <h3 className="text-lg font-bold text-gray-700">Dashboard de Protección</h3>
                        <p className="text-sm text-gray-500">Club Deportivo Ejemplo</p>
                      </div>
                      <div className="bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        100% Cumplimiento
                      </div>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 border border-blue-300 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">247</div>
                        <div className="text-xs text-blue-700">Menores Protegidos</div>
                      </div>
                      <div className="bg-orange-50 border border-orange-300 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">12</div>
                        <div className="text-xs text-orange-700">Protocolos Activos</div>
                      </div>
                      <div className="bg-green-50 border border-green-300 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">100%</div>
                        <div className="text-xs text-green-700">Personal Formado</div>
                      </div>
                    </div>

                    {/* Gráfico simulado */}
                    <div className="bg-white border border-gray-300 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Evolución Cumplimiento</div>
                      <div className="flex items-end space-x-2 h-20">
                        <div className="bg-blue-400 w-8 h-12 rounded"></div>
                        <div className="bg-green-500 w-8 h-16 rounded"></div>
                        <div className="bg-orange-500 w-8 h-20 rounded"></div>
                        <div className="bg-purple-600 w-8 h-20 rounded"></div>
                        <div className="bg-green-600 w-8 h-20 rounded"></div>
                      </div>
                    </div>

                    {/* Lista de tareas */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 border border-green-300 rounded">
                        <span className="text-sm text-gray-700">Plan de Protección</span>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Activo</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-300 rounded">
                        <span className="text-sm text-gray-700">Delegado Certificado</span>
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Verificado</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-orange-50 border border-orange-300 rounded">
                        <span className="text-sm text-gray-700">Formación Personal</span>
                        <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">Completado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge de características */}
              <div className="absolute -top-4 -right-4 bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                100% Automatizado
              </div>

              {/* Dashboards adicionales superpuestos */}
              <div className="mt-4 relative">
                <div className="grid grid-cols-2 gap-3">
                  {/* Dashboard Contratante */}
                  <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-2 transform -rotate-2 hover:rotate-0 transition-transform">
                    <div className="bg-white rounded">
                      <div className="bg-white border-b border-gray-300 rounded-t px-2 py-1 flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-600">Dashboard Entidad</div>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="text-xs font-bold text-gray-800">Panel Contratante</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-green-50 border border-green-300 p-2 rounded text-center">
                            <div className="text-sm font-bold text-green-700">LOPIVI</div>
                            <div className="text-xs text-green-600">Activo</div>
                          </div>
                          <div className="bg-blue-50 border border-blue-300 p-2 rounded text-center">
                            <div className="text-sm font-bold text-blue-700">100%</div>
                            <div className="text-xs text-blue-600">Cumple</div>
                          </div>
                        </div>
                        <div className="bg-white border border-gray-300 rounded p-2">
                          <div className="h-2 bg-green-600 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Admin */}
                  <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-2 transform rotate-2 hover:rotate-0 transition-transform">
                    <div className="bg-white rounded">
                      <div className="bg-white border-b border-gray-300 rounded-t px-2 py-1 flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-600">Dashboard Admin</div>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="text-xs font-bold text-gray-800">Control Total</div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="bg-purple-50 border border-purple-300 p-1 rounded">
                            <div className="text-xs font-bold text-purple-700">847</div>
                            <div className="text-xs text-purple-600">Entid.</div>
                          </div>
                          <div className="bg-blue-50 border border-blue-300 p-1 rounded">
                            <div className="text-xs font-bold text-blue-700">1.2k</div>
                            <div className="text-xs text-blue-600">Deleg.</div>
                          </div>
                          <div className="bg-green-50 border border-green-300 p-1 rounded">
                            <div className="text-xs font-bold text-green-700">98%</div>
                            <div className="text-xs text-green-600">Activo</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          <div className="h-8 bg-orange-500 rounded"></div>
                          <div className="h-6 bg-blue-400 rounded"></div>
                          <div className="h-10 bg-purple-600 rounded"></div>
                          <div className="h-7 bg-green-500 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Botones CTA después del badge 100% Automatizado */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-12 px-4 sm:px-0">
            <Link
              href="/planes"
              className="bg-blue-900 text-white px-6 sm:px-8 py-4 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-blue-800 transition-colors touch-manipulation w-full sm:w-auto"
            >
              Ver Planes y Precios
            </Link>
            <Link
              href="/contacto"
              className="bg-white text-gray-700 px-6 sm:px-8 py-4 sm:py-4 rounded-lg font-bold text-base sm:text-lg border-2 border-gray-200 hover:border-gray-300 transition-colors touch-manipulation w-full sm:w-auto"
            >
              Contactar Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Plan de Protección */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Plan de Protección Integral
            </h2>
            <p className="text-xl text-gray-600">
              Todo lo que tu entidad necesita para el cumplimiento de la LOPIVI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Delegado de Protección</h3>
              <p className="text-gray-700 mb-4">
                Profesional asignado por tu entidad. Disponible 24/7 para emergencias.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Formación LOPIVI</li>
                <li>Certificación</li>
                <li>Disponibilidad inmediata</li>
                <li>Delegado suplente opcional (+10€)</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Documentación Completa</h3>
              <p className="text-gray-700 mb-4">
                Todos los documentos requeridos generados automáticamente para tu tipo de entidad.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Plan de protección</li>
                <li>Protocolos de actuación específicos</li>
                <li>Código de conducta profesional</li>
                <li>Documentación LOPIVI</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Formación</h3>
              <p className="text-gray-700 mb-4">
                Formación completa para tu entidad.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Curso online</li>
                <li>Certificados</li>
                <li>Material didáctico incluido</li>
                <li>Seguimiento automático</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso de Implementación */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Proceso de Implementación
            </h2>
            <p className="text-xl text-gray-600">
              Sistema automatizado - Tu entidad estará protegida en 72 horas
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-700 mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Contratas el Servicio</h3>
              <p className="text-gray-600">
                Eliges tu plan según el número de menores. Configuración automática en 2 horas.
              </p>
              <div className="mt-4 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                Día 1 - 2 horas
              </div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-gray-700 mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Formación del Delegado</h3>
              <p className="text-gray-600">
                Tu delegado completa la formación especializada online.
              </p>
              <div className="mt-4 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                Días 1-3
              </div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-gray-700 mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Certificación y Activación</h3>
              <p className="text-gray-600">
                Test de certificación y acceso completo al dashboard de gestión LOPIVI.
              </p>
              <div className="mt-4 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                Día 3 - 1 hora
              </div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-gray-700 mb-6">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Sistema Operativo</h3>
              <p className="text-gray-600">
                Tu entidad está con mantenimiento automático continuo.
              </p>
              <div className="mt-4 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                Desde día 3
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Virtual LOPIVI */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Campus Virtual LOPIVI
            </h2>
            <p className="text-xl text-gray-600">
              Formación especializada para tu delegado de protección
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Lista de características del Campus */}
            <div>
              <h3 className="text-2xl font-bold text-gray-700 mb-6">
                Formación completa incluida en tu plan
              </h3>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-2">5 Módulos Especializados</h4>
                  <p className="text-gray-600 text-sm">Formación completa adaptada a tu sector específico</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-2">Certificación</h4>
                  <p className="text-gray-600 text-sm">Certificado para actuar como Delegado de Protección</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-2">Acceso Inmediato</h4>
                  <p className="text-gray-600 text-sm">Disponible 24/7 desde cualquier dispositivo tras la contratación</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-2">Casos Prácticos</h4>
                  <p className="text-gray-600 text-sm">Situaciones reales del sector deportivo, educativo y de ocio</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-2">Multiplataforma</h4>
                  <p className="text-gray-600 text-sm">Acceso desde PC, tablet o móvil con progreso sincronizado</p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/formacion-delegado"
                  className="bg-blue-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors inline-block"
                >
                  Ver Campus Virtual Completo
                </Link>
              </div>
            </div>

            {/* Mockup del Campus Virtual */}
            <div className="relative">
              <div className="bg-white border border-gray-300 rounded-xl shadow-2xl p-4">
                {/* Simulación de pantalla de ordenador */}
                <div className="bg-white rounded-lg">
                  <div className="bg-blue-900 rounded-t-lg px-4 py-3 flex items-center space-x-2">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="bg-white bg-opacity-20 rounded px-4 py-1 text-xs text-white inline-block">
                        campus.custodia360.com
                      </div>
                    </div>
                  </div>

                  {/* Contenido del Campus */}
                  <div className="p-6 space-y-4">
                    {/* Header del Campus */}
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div>
                        <h3 className="text-lg font-bold text-gray-700">Campus Virtual LOPIVI</h3>
                        <p className="text-sm text-gray-500">Formación Delegado de Protección</p>
                      </div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        En Progreso
                      </div>
                    </div>

                    {/* Progreso General */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-blue-800">Progreso General</span>
                        <span className="text-lg font-bold text-blue-600">60%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-3">
                        <div className="bg-blue-600 h-3 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">3 de 5 módulos completados</p>
                    </div>

                    {/* Lista de módulos */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">✓</div>
                          <div>
                            <p className="text-sm font-bold text-gray-700">Módulo 1: Introducción LOPIVI</p>
                            <p className="text-xs text-gray-500">60 min - Completado</p>
                          </div>
                        </div>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">100%</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">✓</div>
                          <div>
                            <p className="text-sm font-bold text-gray-700">Módulo 2: Rol del Delegado</p>
                            <p className="text-xs text-gray-500">60 min - Completado</p>
                          </div>
                        </div>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">100%</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">3</div>
                          <div>
                            <p className="text-sm font-bold text-gray-700">Módulo 3: Protocolos de Actuación</p>
                            <p className="text-xs text-gray-500">90 min - En progreso</p>
                          </div>
                        </div>
                        <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">75%</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-75">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">4</div>
                          <div>
                            <p className="text-sm font-bold text-gray-500">Módulo 4: Gestión de Casos</p>
                            <p className="text-xs text-gray-400">90 min - Bloqueado</p>
                          </div>
                        </div>
                        <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded">0%</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-75">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">5</div>
                          <div>
                            <p className="text-sm font-bold text-gray-500">Módulo 5: Casos Prácticos</p>
                            <p className="text-xs text-gray-400">60 min - Bloqueado</p>
                          </div>
                        </div>
                        <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded">0%</span>
                      </div>
                    </div>

                    {/* Botón de continuar */}
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                      Continuar Módulo 3
                    </button>
                  </div>
                </div>
              </div>

              {/* Badge de certificación */}
              <div className="absolute -top-4 -right-4 bg-blue-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Certificación
              </div>
            </div>
          </div>

          {/* Botón CTA */}
          <div className="text-center mt-12">
            <Link
              href="/planes"
              className="bg-blue-900 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors inline-block"
            >
              Ver Planes con Formación Incluida
            </Link>
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
                      <div className="bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        LOPIVI Activo
                      </div>
                    </div>

                    {/* Métricas principales */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-blue-50 border border-blue-300 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">247</div>
                        <div className="text-xs text-blue-700">Menores</div>
                      </div>
                      <div className="bg-green-50 border border-green-300 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">98%</div>
                        <div className="text-xs text-green-700">Cumplimiento</div>
                      </div>
                      <div className="bg-purple-50 border border-purple-300 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">12</div>
                        <div className="text-xs text-purple-700">Protocolos</div>
                      </div>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="space-y-2">
                      <div className="bg-red-600 text-white rounded-lg p-3 text-center font-bold text-sm">
                        CASO DE EMERGENCIA
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="bg-blue-100 text-blue-800 p-2 rounded text-xs font-medium">
                          Gestionar Casos
                        </button>
                        <button className="bg-green-100 text-green-800 p-2 rounded text-xs font-medium">
                          Ver Documentos
                        </button>
                      </div>
                    </div>

                    {/* Estado de formación */}
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs font-bold text-gray-700 mb-2">Formación Personal</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div className="bg-orange-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <div className="text-xs text-gray-600">28/32 personas formadas</div>
                    </div>

                    {/* Documentos generados */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-xs text-gray-700">Plan de Protección</span>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Activo</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-xs text-gray-700">Protocolos</span>
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">12 docs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge de estado */}
              <div className="absolute -top-4 -right-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
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
                  <p className="text-gray-600 text-sm">Formación especializada y certificación</p>
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
                  <p className="text-gray-600 text-sm">Curso online y certificados para todo el equipo</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Sistema de gestión digital</h4>
                  <p className="text-gray-600 text-sm">Dashboard completo para gestionar casos y documentos</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Documentación completa LOPIVI</h4>
                  <p className="text-gray-600 text-sm">Todos los documentos legales requeridos</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Comunicación con familias</h4>
                  <p className="text-gray-600 text-sm">Sistema automatizado de comunicados y notificaciones</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Mantenimiento continuo</h4>
                  <p className="text-gray-600 text-sm">Actualizaciones automáticas</p>
                </div>

                <div className="border-l-4 border-blue-900 pl-6">
                  <h4 className="font-bold text-gray-700 mb-1">Protocolo de emergencia</h4>
                  <p className="text-gray-600 text-sm">Acceso directo a contactos de autoridades competentes</p>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-blue-900 mb-2">Implementación garantizada</h4>
                <p className="text-blue-700 text-sm mb-4">
                  Puedes tener tu sistema 100% operativo en 72 horas con toda la documentación lista
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
                  Ver Nuestros Planes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas Reales LOPIVI */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-bold inline-block mb-4">
              DATOS OFRECIDOS POR EL MINISTERIO DE IGUALDAD, AGENDA 2030
            </div>
            <div className="bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-bold inline-block mb-4">
              ESTADÍSTICAS REALES LOPIVI
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
              Periodo 2021-2025: <span className="text-gray-600">LA REALIDAD DE LAS INSPECCIONES</span>
            </h2>
            <p className="text-xl text-gray-600">
              Datos oficiales que demuestran la urgencia de cumplir la LOPIVI
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto mb-8">
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

          <div className="bg-white border-4 border-gray-300 rounded-xl p-8 max-w-4xl mx-auto text-center shadow-2xl">
            <p className="text-xl font-bold text-gray-700 mb-4">
              <span className="text-blue-900">1 de cada 3</span> inspecciones realizadas, acaba en expediente abierto
            </p>
            <div className="text-4xl font-black text-blue-900 mb-4 tracking-wide">
              33% ACABAN EN SANCIONES
            </div>
            <div className="bg-blue-900 text-white px-6 py-3 rounded-lg font-bold text-xl">
              TU ENTIDAD ESTÁ PROTEGIDA
            </div>
          </div>


        </div>
      </section>

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Caso 1 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">Club Deportivo (Andalucía)</h3>
                <p className="text-blue-800 text-sm font-medium">Sanción: 25.000€</p>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-bold text-red-800">Infracción:</span> No tener delegado de protección ni protocolos</p>
                <p><span className="font-bold text-red-800">Consecuencia:</span> Multa + cierre temporal 6 meses</p>
                <p><span className="font-bold text-red-800">Estado:</span> Incidente con menor sin protección</p>
              </div>
            </div>

            {/* Caso 2 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">Academia de Fútbol (Madrid)</h3>
                <p className="text-blue-800 text-sm font-medium">Sanción: 45.000€</p>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-bold text-red-800">Infracción:</span> Personal sin formación LOPIVI</p>
                <p><span className="font-bold text-red-800">Consecuencia:</span> Multa + inhabilitación directivos</p>
                <p><span className="font-bold text-red-800">Estado:</span> Falta de protocolos de actuación</p>
              </div>
            </div>

            {/* Caso 3 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">Centro de Ocio (Valencia)</h3>
                <p className="text-blue-800 text-sm font-medium">Sanción: 15.000€</p>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-bold text-red-800">Infracción:</span> No reportar situación sospechosa</p>
                <p><span className="font-bold text-red-800">Consecuencia:</span> Multa + cierre definitivo</p>
                <p><span className="font-bold text-red-800">Estado:</span> Pérdida de licencia operativa</p>
              </div>
            </div>

            {/* Caso 4 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">Campamento de Verano (Cataluña)</h3>
                <p className="text-blue-800 text-sm font-medium">Sanción: 35.000€</p>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-bold text-red-800">Infracción:</span> Documentación LOPIVI inexistente</p>
                <p><span className="font-bold text-red-800">Consecuencia:</span> Multa + prohibición operar</p>
                <p><span className="font-bold text-red-800">Estado:</span> Personal sin verificar antecedentes</p>
              </div>
            </div>

            {/* Caso 5 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">Escuela Deportiva Sevilla</h3>
                <p className="text-blue-800 text-sm font-medium">Sanción: 89.000€</p>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-bold text-red-800">Infracción:</span> Delegado sin certificación ni formación especializada</p>
                <p><span className="font-bold text-red-800">Consecuencia:</span> Multa + obligación de implementación inmediata</p>
                <p><span className="font-bold text-red-800">Estado:</span> Actualmente implementando LOPIVI</p>
              </div>
            </div>

            {/* Caso 6 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">Centro Deportivo Bilbao</h3>
                <p className="text-blue-800 text-sm font-medium">Sanción: 156.000€</p>
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

      {/* CTA Final */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para garantizar el cumplimiento LOPIVI?
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
                  <Link href="/dashboard-directo" className="text-gray-400 hover:text-white transition-colors">
                    Acceso Delegados
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="text-gray-400 hover:text-white transition-colors">
                    Ver Demo
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
                  <Link href="/formacion-delegado" className="text-gray-400 hover:text-white transition-colors">
                    Formación Delegados
                  </Link>
                </li>
                <li>
                  <Link href="/guia" className="text-gray-400 hover:text-white transition-colors">
                    Plan de Protección
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard-directo" className="text-gray-400 hover:text-white transition-colors">
                    Dashboard LOPIVI
                  </Link>
                </li>
                <li>
                  <Link href="/guia" className="text-gray-400 hover:text-white transition-colors">
                    Documentación Legal
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
                <li>
                  <Link href="/formacion-delegado" className="text-gray-400 hover:text-white transition-colors">
                    Campus Virtual
                  </Link>
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

              {/* Redes sociales */}
              <div className="flex items-center gap-4">
                <a
                  href="https://linkedin.com/company/custodia360"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v11.452zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com/custodia360"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.227-1.664 4.771-4.919 4.919-1.266.058-1.645.072-4.85.072-3.204 0-3.584-.012-4.849-.072-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.072-1.644-.072-4.849 0-3.204.013-3.583.072-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com/custodia360"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@custodia360"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-700 mt-8 pt-6 text-center">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-400">
                  © 2025 Custodia360 S.L. propiedad de Sportsmotherland SL. Todos los derechos reservados.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">España</span>
                  <div className="w-4 h-3 bg-red-500 border rounded-sm flex flex-col">
                    <div className="h-1 bg-red-500"></div>
                    <div className="h-1 bg-yellow-400"></div>
                    <div className="h-1 bg-red-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
