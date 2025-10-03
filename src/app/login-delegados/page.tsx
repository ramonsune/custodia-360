'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginDelegados() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tipoEsperado, setTipoEsperado] = useState<string | null>(null)

  // Usuarios de ejemplo para testing
  const usuariosEjemplo = [
    {
      email: 'maria.garcia@clubdeportivo.com',
      password: 'delegado123',
      nombre: 'María García López',
      tipo: 'principal',
      entidad: 'Club Deportivo Ejemplo',
      formacionCompletada: true,
      tipoEntidad: 'club-deportivo'
    },
    {
      email: 'carlos.ruiz@clubdeportivo.com',
      password: 'suplente123',
      nombre: 'Carlos Ruiz Martín',
      tipo: 'suplente',
      entidad: 'Club Deportivo Ejemplo',
      formacionCompletada: true,
      tipoEntidad: 'club-deportivo'
    },
    {
      email: 'ana.lopez@catequesis.com',
      password: 'delegado456',
      nombre: 'Ana López Martín',
      tipo: 'principal',
      entidad: 'Parroquia San José',
      formacionCompletada: true,
      tipoEntidad: 'religioso'
    },
    {
      email: 'principal@test.com',
      password: '123',
      nombre: 'Delegado Principal Test',
      tipo: 'principal',
      entidad: 'Entidad de Prueba',
      formacionCompletada: true,
      tipoEntidad: 'club-deportivo'
    },
    {
      email: 'elena.martinez@catequesis.com',
      password: 'suplente456',
      nombre: 'Elena Martínez Ruiz',
      tipo: 'suplente',
      entidad: 'Parroquia San José',
      formacionCompletada: true,
      tipoEntidad: 'religioso'
    }
  ]

  // Capturar parámetro tipo de la URL
  useEffect(() => {
    const tipo = searchParams.get('tipo')
    if (tipo === 'suplente') {
      setTipoEsperado('suplente')
    } else {
      setTipoEsperado('principal')
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simular autenticación
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Buscar usuario considerando el tipo esperado según URL
      let usuario = usuariosEjemplo.find(u => u.email === email && u.password === password && u.tipo === tipoEsperado)

      // Si no se encuentra con el tipo esperado, buscar cualquier usuario con esas credenciales
      if (!usuario) {
        usuario = usuariosEjemplo.find(u => u.email === email && u.password === password)
      }

      if (!usuario) {
        setError('Email o contraseña incorrectos')
        setLoading(false)
        return
      }

      // Verificar si el tipo de usuario coincide con el esperado
      if (tipoEsperado && usuario.tipo !== tipoEsperado) {
        setError(`Este usuario es ${usuario.tipo === 'principal' ? 'Delegado Principal' : 'Delegado Suplente'}. Usa el enlace correcto para acceder.`)
        setLoading(false)
        return
      }

      // Guardar sesión
      const expiracion = new Date()
      expiracion.setHours(expiracion.getHours() + 8) // Sesión válida por 8 horas

      localStorage.setItem('userSession', JSON.stringify({
        id: `del_${usuario.tipo}_001`,
        nombre: usuario.nombre,
        email: usuario.email,
        tipo: usuario.tipo,
        entidad: usuario.entidad,
        permisos: ['ver_casos', 'gestionar_casos', 'ver_informes'],
        certificacionVigente: usuario.formacionCompletada,
        formacionCompletada: usuario.formacionCompletada,
        tipoEntidad: usuario.tipoEntidad,
        inicioSesion: new Date().toISOString(),
        expiracion: expiracion.toISOString()
      }))

      // Redireccionar según estado
      if (usuario.formacionCompletada) {
        // Redireccionar al dashboard correcto según el tipo
        if (usuario.tipo === 'suplente') {
          router.push('/dashboard-suplente')
        } else {
          router.push('/dashboard-delegado')
        }
      } else if (usuario.tipoEntidad) {
        // Para usuarios sin formación completada
        if (usuario.tipo === 'suplente') {
          // Si es suplente y no ha completado formación, usar la formación general LOPIVI
          router.push('/bienvenida-delegado-suplente')
        } else {
          router.push('/bienvenida-delegado-principal')
        }
      } else {
        // Si no tiene tipo de entidad definido, ir a selector
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
            {tipoEsperado === 'suplente' ? 'Delegado Suplente' : 'Delegado Principal'}
          </h2>
          <p className="text-gray-600">
            Acceso a Custodia360
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



          {/* Información de ayuda para usuarios de ejemplo */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              👥 Usuarios de ejemplo disponibles:
            </h3>
            <div className="space-y-2 text-xs text-blue-800">
              <div>
                <strong>Delegado Principal:</strong><br />
                📧 maria.garcia@clubdeportivo.com<br />
                🔑 delegado123
              </div>
              <div>
                <strong>Delegado Suplente:</strong><br />
                📧 carlos.ruiz@clubdeportivo.com<br />
                🔑 suplente123
              </div>
              <div>
                <strong>Suplente Parroquia:</strong><br />
                📧 elena.martinez@catequesis.com<br />
                🔑 suplente456
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/acceso-simple" className="text-sm text-blue-600 hover:text-blue-500 mr-4">
              ← Volver a acceso simple
            </Link>
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
              Página principal
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
