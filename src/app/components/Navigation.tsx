'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">C</span>
            </div>
            <span className="text-xl font-bold text-gray-700">Custodia360</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">
              Inicio
            </Link>

            <Link href="/planes" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">
              Planes
            </Link>
            <Link href="/guia" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">
              Guía
            </Link>
            <Link href="/proceso" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">
              Proceso
            </Link>
            <Link href="/como-lo-hacemos" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">
              Cómo lo hacemos
            </Link>
            <Link href="/contacto" className="text-gray-700 hover:text-blue-800 font-medium transition-colors">
              Contacto
            </Link>
            <Link
              href="/login"
              className="bg-blue-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-900 transition-colors"
            >
              Acceso
            </Link>
          </div>

          {/* Mobile Menu Button and Access */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              href="/login"
              className="bg-blue-800 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors"
            >
              Acceso
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Mejorado */}
        <div className={`md:hidden fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-sm bg-white shadow-xl">
            {/* Header del Menu */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">C</span>
                </div>
                <span className="text-lg font-bold text-gray-700">Custodia360</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-6 space-y-1">
              {/* Acceso rápido destacado */}
              <div className="mb-6">
                <Link
                  href="/contratar/datos-entidad"
                  className="bg-blue-800 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-900 transition-colors text-center block text-lg shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contratar Ahora
                </Link>
              </div>

              {/* Navegación principal */}
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div>
                    <div className="font-medium text-gray-700">Inicio</div>
                    <div className="text-xs text-gray-500">Sistema LOPIVI</div>
                  </div>
                </Link>

                <Link
                  href="/planes"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div>
                    <div className="font-medium text-gray-700">Planes</div>
                    <div className="text-xs text-gray-500">Desde 19€</div>
                  </div>
                </Link>

                <Link
                  href="/como-lo-hacemos"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div>
                    <div className="font-medium text-gray-700">Cómo lo hacemos</div>
                    <div className="text-xs text-gray-500">100% automático</div>
                  </div>
                </Link>

                <Link
                  href="/guia"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div>
                    <div className="font-medium text-gray-700">Guía</div>
                    <div className="text-xs text-gray-500">Paso a paso</div>
                  </div>
                </Link>

                <Link
                  href="/proceso"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div>
                    <div className="font-medium text-gray-700">Proceso</div>
                    <div className="text-xs text-gray-500">72 horas</div>
                  </div>
                </Link>

                <Link
                  href="/contacto"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div>
                    <div className="font-medium text-gray-700">Contacto</div>
                    <div className="text-xs text-gray-500">Resolvemos dudas</div>
                  </div>
                </Link>
              </div>

              {/* Acceso */}
              <div className="pt-6 border-t border-gray-200 mt-6">
                <Link
                  href="/login-delegados"
                  className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div>
                    <div className="font-medium text-gray-700">Acceso</div>
                    <div className="text-xs text-gray-500">Panel de control</div>
                  </div>
                </Link>
              </div>

              {/* Información adicional */}
              <div className="pt-6 text-center">
                <div className="text-xs text-gray-500">
                  Implementación en 72 horas
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Desde 19€ (Plan 50)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
