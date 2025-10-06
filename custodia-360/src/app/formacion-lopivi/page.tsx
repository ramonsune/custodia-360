'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Usuario {
  id: string
  nombre: string
  apellidos: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: {
    id: string
    nombre: string
    tipo_entidad: string
    plan: string
  }
}

export default function FormacionLopiviPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Verificar si ya hay una sesión activa
  useEffect(() => {
    const sessionData = localStorage.getItem('formacion_lopivi_session')
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData)
        console.log('📋 Sesión existente encontrada:', session.email)

        // Redirigir según el tipo de delegado
        if (session.tipo === 'principal') {
          router.push('/bienvenida-delegado-principal')
        } else if (session.tipo === 'suplente') {
          router.push('/bienvenida-delegado-suplente')
        }
      } catch (error) {
        console.log('❌ Sesión inválida, eliminando...')
        localStorage.removeItem('formacion_lopivi_session')
      }
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🔐 Intentando login formación LOPIVI...')

      const response = await fetch('/api/formacion-lopivi/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error en el login')
      }

      console.log('✅ Login exitoso:', data.delegado.nombre, data.delegado.apellidos)

      // Guardar sesión en localStorage
      localStorage.setItem('formacion_lopivi_session', JSON.stringify(data.delegado))

      // Redirigir según el tipo de delegado
      if (data.delegado.tipo === 'principal') {
        router.push('/bienvenida-delegado-principal')
      } else if (data.delegado.tipo === 'suplente') {
        router.push('/bienvenida-delegado-suplente')
      } else {
        throw new Error('Tipo de delegado no reconocido')
      }

    } catch (error) {
      console.error('❌ Error en login:', error)
      setError(error instanceof Error ? error.message : 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-[#2563EB] to-[#059669] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Custodia360</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Inicio</Link>
              <Link href="/contacto" className="text-gray-600 hover:text-gray-900">Contacto</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Panel izquierdo - Información */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2563EB] to-[#059669] p-12 items-center justify-center">
          <div className="max-w-md text-white">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🎓</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Formación LOPIVI</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Acceso exclusivo para delegados de protección infantil.
                Complete su formación especializada y obtenga su certificación oficial.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-blue-100">Formación especializada por sectores</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-blue-100">Certificación oficial LOPIVI</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-blue-100">Acceso al dashboard de gestión</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho - Login */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Acceso a Formación
              </h1>
              <p className="text-gray-600">
                Ingrese sus credenciales de delegado de protección
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email del Delegado
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="delegado@entidad.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Ingrese su contraseña"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-gradient-to-r from-[#2563EB] to-[#059669] text-white py-3 px-4 rounded-lg font-semibold hover:from-[#1D4ED8] to-[#047857] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verificando credenciales...
                  </div>
                ) : (
                  '🎓 Acceder a Formación LOPIVI'
                )}
              </button>
            </form>

            {/* Información adicional */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">ℹ️ Información:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Las credenciales han sido enviadas por email tras la contratación</li>
                <li>• Delegados principales y suplentes tienen acceso diferenciado</li>
                <li>• La formación debe completarse para acceder al dashboard</li>
                <li>• El certificado se genera automáticamente al aprobar</li>
              </ul>
            </div>

            {/* Enlaces útiles */}
            <div className="mt-6 text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contacto"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ¿Problemas de acceso?
                </Link>
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
