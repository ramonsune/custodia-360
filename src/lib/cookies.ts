// Tipos para el consentimiento de cookies
export interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export interface CookieConsent {
  preferences: CookiePreferences
  timestamp: string
  version: string
}

// Funciones para gestionar cookies
export const cookieManager = {
  // Obtener consentimiento guardado
  getConsent(): CookieConsent | null {
    if (typeof window === 'undefined') return null

    try {
      const consent = localStorage.getItem('cookie-consent')
      return consent ? JSON.parse(consent) : null
    } catch {
      return null
    }
  },

  // Verificar si hay consentimiento
  hasConsent(): boolean {
    return this.getConsent() !== null
  },

  // Verificar si un tipo específico de cookie está permitido
  isAllowed(type: keyof CookiePreferences): boolean {
    const consent = this.getConsent()
    return consent?.preferences[type] ?? false
  },

  // Guardar consentimiento
  saveConsent(preferences: CookiePreferences): void {
    if (typeof window === 'undefined') return

    const consent: CookieConsent = {
      preferences,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }

    localStorage.setItem('cookie-consent', JSON.stringify(consent))

    // Aplicar configuración según las preferencias
    this.applyPreferences(preferences)
  },

  // Aplicar configuración de cookies
  applyPreferences(preferences: CookiePreferences): void {
    // Google Analytics
    if (preferences.analytics && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }

    // Marketing/Publicidad
    if (preferences.marketing && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        ad_storage: 'granted'
      })
    }

    // Cookies funcionales (puedes agregar más lógica aquí)
    if (preferences.functional) {
      // Habilitar funcionalidades adicionales
      console.log('Cookies funcionales habilitadas')
    }
  },

  // Limpiar consentimiento (para testing o reset)
  clearConsent(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('cookie-consent')
  },

  // Obtener configuración por defecto
  getDefaultPreferences(): CookiePreferences {
    return {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    }
  }
}

// Función para inicializar cookies según el consentimiento
export const initializeCookies = (): void => {
  if (typeof window === 'undefined') return

  const consent = cookieManager.getConsent()
  if (consent) {
    cookieManager.applyPreferences(consent.preferences)
  }
}

// Hook personalizado para React (opcional)
export const useCookieConsent = () => {
  const hasConsent = cookieManager.hasConsent()
  const consent = cookieManager.getConsent()

  return {
    hasConsent,
    consent,
    isAllowed: (type: keyof CookiePreferences) => cookieManager.isAllowed(type),
    saveConsent: (preferences: CookiePreferences) => cookieManager.saveConsent(preferences),
    clearConsent: () => cookieManager.clearConsent()
  }
}
