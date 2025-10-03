'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  permisos: string[]
  certificacionVigente: boolean
  inicioSesion: string
  expiracion: string
}

interface FormData {
  passwordActual: string
  passwordNuevo: string
  passwordConfirmar: string
  emailNotificaciones: string
  telefono: string
}

export default function GestionarCredencialesPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    passwordActual: '',
    passwordNuevo: '',
    passwordConfirmar: '',
    emailNotificaciones: '',
    telefono: ''
  })

  const checkSession = (): SessionData | null => {
    try {
      const persistentSession = localStorage.getItem('userSession')
      if (persistentSession) {
        const session = JSON.parse(persistentSession)
        if (new Date(session.expiracion) > new Date()) {
          return session
        }
      }

      const tempSession = sessionStorage.getItem('userSession')
      if (tempSession) {
        const session = JSON.parse(tempSession)
        if (new Date(session.expiracion) > new Date()) {
          return session
        }
      }

      const legacyAuth = localStorage.getItem('userAuth')
      if (legacyAuth) {
        return JSON.parse(legacyAuth)
      }

      return null
    } catch (error) {
      console.error('Error verificando sesión:', error)
      return null
    }
  }

  useEffect(() => {
    const session = checkSession()

    if (!session) {
      router.push('/login')
      return
    }

    setSessionData(session)

    // Cargar datos del perfil
    setFormData(prev => ({
      ...prev,
      emailNotificaciones: session.email,
      telefono: '600123456' // En una app real esto vendría de la base de datos
    }))

    setLoading(false)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    // Validaciones
    if (!formData.passwordActual || !formData.passwordNuevo || !formData.passwordConfirmar) {
      setError('Por favor, complete todos los campos de contraseña')
      setSaving(false)
      return
    }

    if (formData.passwordNuevo !== formData.passwordConfirmar) {
      setError('Las contraseñas nuevas no coinciden')
      setSaving(false)
      return
    }

    if (formData.passwordNuevo.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres')
      setSaving(false)
      return
    }

    try {
      // Simular cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 2000))

      // En una app real, aquí harías la llamada a la API
      console.log('✅ Contraseña cambiada exitosamente')

      setSuccess('Contraseña actualizada correctamente')
      setFormData(prev => ({
        ...prev,
        passwordActual: '',
        passwordNuevo: '',
        passwordConfirmar: ''
      }))
      setShowPasswordForm(false)

    } catch (error) {
      setError('Error al cambiar la contraseña. Inténtelo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Simular actualización de perfil
      await new Promise(resolve => setTimeout(resolve, 1500))

      // En una app real, aquí harías la llamada a la API
      console.log('✅ Perfil actualizado exitosamente')

      setSuccess('Información de perfil actualizada correctamente')

    } catch (error) {
      setError('Error al actualizar el perfil. Inténtelo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let result = ''
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    setFormData(prev => ({
      ...prev,
      passwordNuevo: result,
      passwordConfirmar: result
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error de autenticación</p>
          <Link href="/login" className="bg-orange-600 text-white px-4 py-2 rounded-lg">
            Volver al Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard-delegado" className="text-gray-600 hover:text-gray-900 mr-4">
                ← Volver al Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Gestionar Credenciales</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{sessionData.nombre}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                sessionData.tipo === 'principal'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {sessionData.tipo === 'principal' ? 'Principal' : 'Suplente'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Alertas */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-600 text-xl">❌</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información de la Cuenta */}
          <div className="lg:col-span-2 space-y-8">
            {/* Información General */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Información de la Cuenta</h2>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={sessionData.nombre}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Para cambiar el nombre, contacte con administración
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Principal
                    </label>
                    <input
                      type="email"
                      value={sessionData.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email de acceso al sistema
                    </p>
                  </div>

                  <div>
                    <label htmlFor="emailNotificaciones" className="block text-sm font-medium text-gray-700 mb-2">
                      Email para Notificaciones
                    </label>
                    <input
                      type="email"
                      id="emailNotificaciones"
                      name="emailNotificaciones"
                      value={formData.emailNotificaciones}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="notificaciones@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="600123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Delegado
                    </label>
                    <input
                      type="text"
                      value={sessionData.tipo === 'principal' ? 'Delegado Principal' : 'Delegado Suplente'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entidad Asignada
                    </label>
                    <input
                      type="text"
                      value={sessionData.entidad}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Guardando...' : 'Actualizar Información'}
                </button>
              </form>
            </div>

            {/* Seguridad */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Seguridad de la Cuenta</h2>

              {!showPasswordForm ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Contraseña</h3>
                      <p className="text-sm text-gray-600">Última actualización: hace 15 días</p>
                    </div>
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cambiar
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Autenticación de dos factores</h3>
                      <p className="text-sm text-gray-600">Próximamente disponible</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      Próximamente
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label htmlFor="passwordActual" className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña Actual *
                    </label>
                    <input
                      type="password"
                      id="passwordActual"
                      name="passwordActual"
                      value={formData.passwordActual}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Su contraseña actual"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="passwordNuevo" className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="passwordNuevo"
                        name="passwordNuevo"
                        value={formData.passwordNuevo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Mínimo 8 caracteres"
                        required
                      />
                      <button
                        type="button"
                        onClick={generateStrongPassword}
                        className="absolute right-2 top-2 bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-200"
                      >
                        Generar
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Use al menos 8 caracteres con mayúsculas, minúsculas, números y símbolos
                    </p>
                  </div>

                  <div>
                    <label htmlFor="passwordConfirmar" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nueva Contraseña *
                    </label>
                    <input
                      type="password"
                      id="passwordConfirmar"
                      name="passwordConfirmar"
                      value={formData.passwordConfirmar}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Repita la nueva contraseña"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false)
                        setFormData(prev => ({
                          ...prev,
                          passwordActual: '',
                          passwordNuevo: '',
                          passwordConfirmar: ''
                        }))
                      }}
                      className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Estado de la Sesión */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Estado de la Sesión</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Inicio de sesión:</span>
                  <span className="text-gray-900">
                    {new Date(sessionData.inicioSesion).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expira:</span>
                  <span className="text-gray-900">
                    {new Date(sessionData.expiracion).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificación:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    sessionData.certificacionVigente
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {sessionData.certificacionVigente ? 'Vigente' : 'Expirada'}
                  </span>
                </div>
              </div>
            </div>

            {/* Permisos */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Permisos del Delegado</h3>

              <div className="space-y-2">
                {sessionData.permisos.map((permiso, index) => (
                  <div key={index} className={`px-3 py-2 rounded-lg text-sm ${
                    permiso === 'acceso_completo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {permiso.replace('_', ' ').toUpperCase()}
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h3>

              <div className="space-y-3">
                <Link
                  href="/dashboard-delegado"
                  className="w-full bg-orange-100 text-orange-800 px-4 py-3 rounded-lg font-medium hover:bg-orange-200 transition-colors block text-center"
                >
                  Volver al Dashboard
                </Link>

                <button
                  onClick={() => {
                    localStorage.removeItem('userAuth')
                    localStorage.removeItem('userSession')
                    sessionStorage.removeItem('userSession')
                    router.push('/login')
                  }}
                  className="w-full bg-red-100 text-red-800 px-4 py-3 rounded-lg font-medium hover:bg-red-200 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
