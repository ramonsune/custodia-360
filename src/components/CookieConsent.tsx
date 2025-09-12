'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

  const [preferences, setPreferences] = useState({
    necessary: true, // Siempre activas
    functional: false,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Verificar si el usuario ya dio consentimiento
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptAll = () => {
    const newPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    }
    setPreferences(newPreferences)
    saveConsent(newPreferences)
    setShowBanner(false)
  }

  const acceptSelected = () => {
    saveConsent(preferences)
    setShowBanner(false)
    setShowPreferences(false)
  }

  const rejectAll = () => {
    const minimalPreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    }
    setPreferences(minimalPreferences)
    saveConsent(minimalPreferences)
    setShowBanner(false)
  }

  const saveConsent = (prefs: typeof preferences) => {
    const consentData = {
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
    localStorage.setItem('cookie-consent', JSON.stringify(consentData))

    // Aquí podrías integrar con Google Analytics, etc.
    if (prefs.analytics) {
      console.log('Analytics habilitado')
      // gtag('consent', 'update', { analytics_storage: 'granted' })
    }
    if (prefs.marketing) {
      console.log('Marketing habilitado')
      // gtag('consent', 'update', { ad_storage: 'granted' })
    }
  }

  const togglePreference = (type: keyof typeof preferences) => {
    if (type === 'necessary') return // No se puede desactivar
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4">
      {/* Banner compacto para móvil */}
      <div className="bg-white rounded-lg shadow-lg max-w-6xl mx-auto border border-gray-200">
        {!showPreferences ? (
          // Banner principal compacto
          <div className="p-3 sm:p-4">
            <div className="flex flex-col space-y-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                  Configuración de Cookies
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Utilizamos cookies para mejorar tu experiencia.
                  <Link href="/cookies" className="text-orange-600 hover:underline ml-1">Ver política</Link>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={rejectAll}
                  className="px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors touch-manipulation"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="px-4 py-3 sm:py-2 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200 touch-manipulation"
                >
                  Configurar
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-3 sm:py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors touch-manipulation"
                >
                  Aceptar Todas
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Panel de preferencias móvil-optimizado
          <div className="p-3 sm:p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Preferencias de Cookies
              </h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-400 hover:text-gray-600 p-2 touch-manipulation"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Cookies Necesarias */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Cookies Necesarias</h4>
                  <div className="w-12 h-6 bg-green-600 rounded-full flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full ml-1"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Esenciales para el funcionamiento del sitio. Incluyen seguridad, navegación y formularios.
                </p>
              </div>

              {/* Cookies Funcionales */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Cookies Funcionales</h4>
                  <button
                    onClick={() => togglePreference('functional')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.functional ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.functional ? 'translate-x-6' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Mejoran la funcionalidad y personalización, como recordar preferencias.
                </p>
              </div>

              {/* Cookies de Análisis */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Cookies de Análisis</h4>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.analytics ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Nos ayudan a entender cómo los visitantes usan el sitio (Google Analytics).
                </p>
              </div>

              {/* Cookies de Marketing */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Cookies de Marketing</h4>
                  <button
                    onClick={() => togglePreference('marketing')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.marketing ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Utilizadas para mostrar anuncios relevantes y medir la efectividad de campañas.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors touch-manipulation"
              >
                Cancelar
              </button>
              <button
                onClick={acceptSelected}
                className="px-6 py-3 sm:py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors touch-manipulation"
              >
                Guardar Preferencias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
