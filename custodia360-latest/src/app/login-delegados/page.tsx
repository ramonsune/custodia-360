'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginDelegados() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Usuarios de ejemplo para testing
  const usuariosEjemplo = [
    {
      email: 'maria.garcia@clubdeportivo.com',
      password: 'delegado123',
      nombre: 'María García López',
      tipo: 'principal',
      entidad: 'Club Deportivo Ejemplo',
      formacionCompletada: false,
      tipoEntidad: null
    },
    {
      email: 'carlos.ruiz@clubdeportivo.com',
      password: 'suplente123',
      nombre: 'Carlos Ruiz Martín',
      tipo: 'suplente',
      entidad: 'Club Deportivo Ejemplo',
      formacionCompletada: false,
      tipoEntidad: null
    },
    {
      email: 'ana.lopez@catequesis.com',
      password: 'delegado456',
      nombre: 'Ana López Martín',
      tipo: 'principal',
      entidad: 'Parroquia San José',
      formacionCompletada: true,
      tipoEntidad: 'religioso'
    }
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simular autenticación
      await new Promise(resolve => setTimeout(resolve, 1000))

      const usuario = usuariosEjemplo.find(u => u.email === email && u.password === password)

      if (!usuario) {
        setError('Email o contraseña incorrectos')
        setLoading(false)
        return
      }

      // Guardar sesión
      localStorage.setItem('userSession', JSON.stringify({
        id: `del_${usuario.tipo}_001`,
        nombre: usuario.nombre,
        email: usuario.email,
        tipo: usuario.tipo,
        entidad: usuario.entidad,
        certificacionVigente: usuario.formacionCompletada,
        formacionCompletada: usuario.formacionCompletada,
        tipoEntidad: usuario.tipoEntidad
      }))

      // Redireccionar según estado
      if (usuario.formacionCompletada) {
        router.push('/dashboard-delegado')
      } else if (usuario.tipoEntidad) {
        router.push('/formacion-delegado')
      } else {
        router.push('/selector-entidad')
      }

    } catch (error) {
      setError('Error al iniciar sesión. Inténtalo de nuevo.')
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
            Acceso Custodia360
          </h2>
          <p className="text-gray-600">
            Accede
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email corporativo
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="tu.email@entidad.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tu contraseña"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
              } transition-colors`}
            >
              {loading ? 'Verificando acceso...' : 'Acceder a mi panel'}
            </button>
          </form>



          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
              Volver a la página principal
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
