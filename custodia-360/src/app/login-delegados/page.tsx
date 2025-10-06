'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

// CREDENCIALES QUE FUNCIONAN SIEMPRE (hardcodeadas)
const credencialesValidas = [
  {
    email: 'maria.garcia@clubdeportivo.com',
    password: 'delegado123',
    tipo: 'principal',
    usuario: {
      id: 'del_001',
      nombre: 'Maria',
      apellidos: 'García López',
      email: 'maria.garcia@clubdeportivo.com',
      tipo: 'principal',
      entidad: {
        id: 'ent_001',
        nombre: 'Club Deportivo Los Leones',
        tipo_entidad: 'deportivo',
        plan: 'Plan Básico'
      }
    }
  },
  {
    email: 'carlos.rodriguez@clubdeportivo.com',
    password: 'suplente123',
    tipo: 'suplente',
    usuario: {
      id: 'del_002',
      nombre: 'Carlos',
      apellidos: 'Rodríguez Fernández',
      email: 'carlos.rodriguez@clubdeportivo.com',
      tipo: 'suplente',
      entidad: {
        id: 'ent_001',
        nombre: 'Club Deportivo Los Leones',
        tipo_entidad: 'deportivo',
        plan: 'Plan Básico'
      }
    }
  }
]

function LoginDelegadosPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipoEsperado = searchParams.get('tipo') as 'principal' | 'suplente' | null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)

  // Precargar credenciales según el tipo
  useEffect(() => {
    if (tipoEsperado === 'principal') {
      setEmail('maria.garcia@clubdeportivo.com')
      setPassword('delegado123')
    } else if (tipoEsperado === 'suplente') {
      setEmail('carlos.rodriguez@clubdeportivo.com')
      setPassword('suplente123')
    }
  }, [tipoEsperado])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🔐 Login directo con:', email)

      // Simular tiempo de carga
      await new Promise(resolve => setTimeout(resolve, 500))

      // Buscar credenciales válidas
      const credencial = credencialesValidas.find(c =>
        c.email === email.toLowerCase().trim() &&
        c.password === password
      )

      if (!credencial) {
        setError('Email o contraseña incorrectos')
        setLoading(false)
        return
      }

      // Verificar tipo si se especificó
      if (tipoEsperado && credencial.tipo !== tipoEsperado) {
        setError(`Este usuario es ${credencial.tipo === 'principal' ? 'Delegado Principal' : 'Delegado Suplente'}. Usa el enlace correcto.`)
        setLoading(false)
        return
      }

      console.log('✅ Login exitoso para:', credencial.usuario.nombre)

      // Guardar sesión
      localStorage.setItem('formacion_lopivi_session', JSON.stringify(credencial.usuario))
      localStorage.setItem('custodia360_session', JSON.stringify(credencial.usuario))

      // Redirigir al dashboard correspondiente
      const dashboardUrl = credencial.tipo === 'principal'
        ? '/dashboard-delegado'
        : '/dashboard-suplente'

      console.log('🔄 Redirigiendo a:', dashboardUrl)
      window.location.href = dashboardUrl

    } catch (error) {
      console.error('❌ Error en login:', error)
      setError('Error al iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">C</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {tipoEsperado === 'suplente' ? 'Delegado Suplente' : 'Delegado Principal'}
          </h2>
          <p className="text-gray-600">
            Accede con tus credenciales para gestionar la protección infantil
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

          {/* ACCESO DIRECTO - CREDENCIALES QUE FUNCIONAN */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-3">✅ ACCESO DIRECTO - USA ESTAS CREDENCIALES:</h3>
            <div className="text-xs text-green-700 space-y-2">
              <div className="bg-white p-3 rounded border">
                <p className="font-bold text-green-800">Delegado Principal:</p>
                <p><strong>Email:</strong> maria.garcia@clubdeportivo.com</p>
                <p><strong>Contraseña:</strong> delegado123</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="font-bold text-purple-800">Delegado Suplente:</p>
                <p><strong>Email:</strong> carlos.rodriguez@clubdeportivo.com</p>
                <p><strong>Contraseña:</strong> suplente123</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-green-600 bg-green-100 p-2 rounded">
              💡 Estas credenciales funcionan SIEMPRE - acceso directo al panel
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error de autenticación
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email del delegado
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="tucorreo@entidad.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={mostrarPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                >
                  <span className="text-gray-400 text-sm">
                    {mostrarPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  '🚀 ACCEDER AL PANEL AHORA'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O navega a</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                href="/login-delegados?tipo=principal"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span>Delegado Principal</span>
              </Link>

              <Link
                href="/login-delegados?tipo=suplente"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span>Delegado Suplente</span>
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/panel-acceso"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ← Volver al panel de acceso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginDelegadosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">C</span>
          </div>
          <p className="text-gray-600">Cargando panel de acceso...</p>
        </div>
      </div>
    }>
      <LoginDelegadosPageContent />
    </Suspense>
  )
}
