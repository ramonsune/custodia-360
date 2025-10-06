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
            <span className="block sm:hidden">¿Cumples la <span className="text-blue-800">LOPIVI</span>?<br />¿Tienes un Plan de <span className="text-blue-800">Protección Infantil</span>?</span>
            <span className="hidden sm:block">¿Cumples la <span className="text-blue-800">LOPIVI</span>?<br />¿Tienes un Plan de <span className="text-blue-800">Protección Infantil</span>?</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            <span className="hidden sm:inline">Custodia360 primera herramienta especializada en cumplimiento normativo LOPIVI completamente automatizada que le permite implementar la LOPIVI y un Plan de Protección Infantil automatizado, en 72 horas.</span>
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

      {/* Rest of content will be added back section by section */}
    </div>
  )
}
