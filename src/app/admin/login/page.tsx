'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Credenciales de admin simplificadas
    if (formData.email === 'admin@custodia360.com' && formData.password === 'admin123') {
      localStorage.setItem('adminAuth', 'true')
      router.push('/admin')
    } else {
      setError('Credenciales incorrectas')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">C</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">
            Dashboard Administrativo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Acceso restringido - Solo administradores
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email de administrador"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <span className="text-red-400 text-sm mr-2">❌</span>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verificando...
                </div>
              ) : (
                'Acceder al Dashboard'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link href="/" className="text-orange-600 hover:text-orange-500 text-sm">
              ← Volver al sitio web
            </Link>
          </div>
        </form>

        {/* Credenciales de prueba */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">🔐 Credenciales de prueba:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div><strong>Email:</strong> admin@custodia360.es</div>
            <div><strong>Contraseña:</strong> custodia2024</div>
          </div>
        </div>
      </div>
    </div>
  )
}
