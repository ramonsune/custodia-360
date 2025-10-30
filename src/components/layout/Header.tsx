'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getSession, clearSession } from '@/lib/auth/session'
import { DemoBadge } from '@/components/demo/DemoBadge'

interface HeaderProps {
  showPublicNav?: boolean
}

export function Header({ showPublicNav = true }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [session, setSession] = useState<ReturnType<typeof getSession> | null>(null)

  useEffect(() => {
    // Solo ejecutar en cliente
    if (typeof window !== 'undefined') {
      const currentSession = getSession()
      if (currentSession.token) {
        setSession(currentSession)
      }
    }
  }, [pathname])

  const handleLogout = () => {
    clearSession()
    router.push('/login')
  }

  // Si estamos en un dashboard, mostrar header de dashboard
  if (pathname?.startsWith('/dashboard-')) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex flex-col items-start">
                <span className="text-3xl font-bold text-blue-600 leading-none">C360</span>
                <span className="text-base font-medium text-gray-900 -mt-1">
                  Custodia360
                </span>
              </Link>
              {session?.entityName && (
                <span className="text-sm text-gray-600 hidden md:block">
                  • {session.entityName}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {session?.isDemo && <DemoBadge />}

              {session?.userName && (
                <span className="text-sm text-gray-600 hidden sm:block">
                  {session.userName}
                </span>
              )}

              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  // Header público para landing y páginas públicas
  if (!showPublicNav) return null

  const isHomePage = pathname === '/'

  return (
    <header className={`${isHomePage ? 'bg-blue-950 border-b border-blue-900/50' : 'bg-white border-b border-gray-200'} shadow-sm sticky top-0 z-50`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre */}
          <Link href="/" className="flex flex-col items-start">
            <span className={`text-3xl font-bold ${isHomePage ? 'text-blue-400' : 'text-blue-600'} leading-none`}>C360</span>
            <span className={`text-base font-medium ${isHomePage ? 'text-white' : 'text-gray-900'} -mt-1`}>
              Custodia360
            </span>
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`${isHomePage ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}
            >
              Inicio
            </Link>
            <Link
              href="/planes"
              className={`${isHomePage ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}
            >
              Planes
            </Link>
            <Link
              href="/guia"
              className={`${isHomePage ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}
            >
              Guía
            </Link>
            <Link
              href="/proceso"
              className={`${isHomePage ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}
            >
              Proceso
            </Link>
            <Link
              href="/como-lo-hacemos"
              className={`${isHomePage ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}
            >
              Cómo lo hacemos
            </Link>
            <Link
              href="/contacto"
              className={`${isHomePage ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}
            >
              Contacto
            </Link>

            {/* Botón Acceso */}
            <Link
              href="/login"
              className={`${isHomePage ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} px-6 py-2 rounded-lg font-semibold transition-colors`}
            >
              Acceso
            </Link>
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden ${isHomePage ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className={`md:hidden py-4 border-t ${isHomePage ? 'border-blue-900/50' : 'border-gray-200'}`}>
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`${isHomePage ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/planes"
                className={`${isHomePage ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Planes
              </Link>
              <Link
                href="/guia"
                className={`${isHomePage ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Guía
              </Link>
              <Link
                href="/proceso"
                className={`${isHomePage ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Proceso
              </Link>
              <Link
                href="/como-lo-hacemos"
                className={`${isHomePage ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Cómo lo hacemos
              </Link>
              <Link
                href="/contacto"
                className={`${isHomePage ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
              <Link
                href="/login"
                className={`${isHomePage ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} px-6 py-2 rounded-lg font-semibold text-center`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Acceso
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
