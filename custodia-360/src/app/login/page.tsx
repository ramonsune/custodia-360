'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LoginCredentials {
  email: string
  password: string
  recordarSesion: boolean
}

interface DelegadoData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente' | 'contratante' | 'admin_custodia'
  entidad: string
  permisos: string[]
  certificacionVigente: boolean
  ultimoAcceso: string
}

export default function LoginDelegadosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: '',
    password: '',
    recordarSesion: false
  })

  // Base de datos simulada de delegados
  const delegadosDB: DelegadoData[] = [
    {
      id: 'del_001',
      nombre: 'Juan García Rodríguez',
      email: 'delegado@custodia360.com',
      tipo: 'principal',
      entidad: 'Club Deportivo Ejemplo',
      permisos: ['ver_casos', 'crear_informes', 'protocolo_emergencia', 'gestionar_personal', 'acceso_completo'],
      certificacionVigente: true,
      ultimoAcceso: '2024-01-15 14:30:00'
    },
    {
      id: 'del_002',
      nombre: 'María López Martín',
      email: 'suplente@custodia360.com',
      tipo: 'suplente',
      entidad: 'Club Deportivo Ejemplo',
      permisos: ['ver_casos', 'crear_informes', 'protocolo_emergencia'],
      certificacionVigente: true,
      ultimoAcceso: '2024-01-10 09:15:00'
    },
    {
      id: 'del_003',
      nombre: 'Carlos Ruiz Sánchez',
      email: 'principal@academia.com',
      tipo: 'principal',
      entidad: 'Academia Deportiva Madrid',
      permisos: ['ver_casos', 'crear_informes', 'protocolo_emergencia', 'gestionar_personal', 'acceso_completo'],
      certificacionVigente: true,
      ultimoAcceso: '2024-01-12 16:45:00'
    },
    // Delegados sin certificación (necesitan completar el curso)
    {
      id: 'del_004',
      nombre: 'Ana Fernández López',
      email: 'nuevo@custodia360.com',
      tipo: 'principal',
      entidad: 'Club Deportivo Nuevo',
      permisos: [],
      certificacionVigente: false,
      ultimoAcceso: '2024-01-01 00:00:00'
    },
    {
      id: 'del_005',
      nombre: 'Pedro Martínez García',
      email: 'suplente-nuevo@custodia360.com',
      tipo: 'suplente',
      entidad: 'Club Deportivo Nuevo',
      permisos: [],
      certificacionVigente: false,
      ultimoAcceso: '2024-01-01 00:00:00'
    },
    {
      id: 'cont_001',
      nombre: 'Director General',
      email: 'director@custodia360.com',
      tipo: 'contratante',
      entidad: 'Club Deportivo Ejemplo',
      permisos: ['ver_cumplimiento', 'gestionar_entidad', 'ver_informes', 'contactar_delegado', 'configuracion'],
      certificacionVigente: true,
      ultimoAcceso: '2024-01-15 10:30:00'
    },
    {
      id: 'cont_002',
      nombre: 'Presidenta Academia',
      email: 'presidenta@academia.com',
      tipo: 'contratante',
      entidad: 'Academia Deportiva Madrid',
      permisos: ['ver_cumplimiento', 'gestionar_entidad', 'ver_informes', 'contactar_delegado', 'configuracion'],
      certificacionVigente: true,
      ultimoAcceso: '2024-01-16 14:20:00'
    },
    {
      id: 'cont_003',
      nombre: 'Miguel Ángel Torres',
      email: 'responsable@nuevaentidad.com',
      tipo: 'contratante',
      entidad: 'Club Deportivo Nuevo',
      permisos: ['ver_cumplimiento', 'gestionar_entidad', 'ver_informes', 'contactar_delegado', 'configuracion'],
      certificacionVigente: true,
      ultimoAcceso: '2024-01-12 09:45:00'
    },
    // Administrador Interno Custodia360
    {
      id: 'admin_custodia_001',
      nombre: 'Administrador Custodia360',
      email: 'rsune@teamsml.com',
      tipo: 'admin_custodia',
      entidad: 'Custodia360 - Dashboard Interno',
      permisos: ['admin_total', 'ver_todas_entidades', 'gestionar_facturacion', 'enviar_documentacion', 'generar_informes', 'acceso_completo'],
      certificacionVigente: true,
      ultimoAcceso: '2024-01-20 18:00:00'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const authenticateUser = (email: string, password: string): DelegadoData | null => {
    console.log(`🔐 Intentando autenticar: ${email}`)

    // Demo simplificado - cualquier email de delegado con cualquier contraseña
    const delegadosEmails = [
      'delegado@custodia360.com',
      'suplente@custodia360.com',
      'principal@academia.com',
      'nuevo@custodia360.com',
      'suplente-nuevo@custodia360.com',
      'nuevo-delegado@demo.com'
    ]

    // Contratantes
    const contratantesEmails = [
      'director@custodia360.com',
      'presidenta@academia.com',
      'responsable@nuevaentidad.com'
    ]

    // Admin custodia360 - requiere contraseña específica
    if (email === 'rsune@teamsml.com' && password === 'Dianita2018') {
      console.log(`🔧 Admin detectado: ${email}`)
      return delegadosDB.find(del => del.email === email) || null
    }

    // Si es email de delegado, permitir acceso con cualquier contraseña (demo)
    if (delegadosEmails.includes(email) && password.length > 0) {
      console.log(`👤 Delegado detectado: ${email}`)
      const usuario = delegadosDB.find(del => del.email === email)
      console.log(`👤 Usuario encontrado en DB:`, usuario)
      return usuario || null
    }

    // Si es email de contratante, permitir acceso con cualquier contraseña (demo)
    if (contratantesEmails.includes(email) && password.length > 0) {
      console.log(`🏢 Contratante detectado: ${email}`)
      const usuario = delegadosDB.find(del => del.email === email)
      console.log(`🏢 Usuario encontrado en DB:`, usuario)
      return usuario || null
    }

    console.log(`❌ Email no reconocido: ${email}`)
    return null
  }

  const createSession = (delegado: DelegadoData, recordar: boolean) => {
    const sessionData = {
      id: delegado.id,
      nombre: delegado.nombre,
      email: delegado.email,
      tipo: delegado.tipo,
      entidad: delegado.entidad,
      permisos: delegado.permisos,
      certificacionVigente: delegado.certificacionVigente,
      inicioSesion: new Date().toISOString(),
      expiracion: recordar
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
        : new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // 8 horas
    }

    // Guardar sesión - SIEMPRE en ambos lugares para garantizar compatibilidad
    localStorage.setItem('userAuth', JSON.stringify(sessionData))
    localStorage.setItem('userSession', JSON.stringify(sessionData))
    sessionStorage.setItem('userSession', JSON.stringify(sessionData))

    console.log('✅ Sesión creada y guardada:', {
      userAuth: localStorage.getItem('userAuth') ? 'OK' : 'FAIL',
      localStorage_userSession: localStorage.getItem('userSession') ? 'OK' : 'FAIL',
      sessionStorage_userSession: sessionStorage.getItem('userSession') ? 'OK' : 'FAIL'
    })

    return sessionData
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validaciones básicas
    if (!loginData.email || !loginData.password) {
      setError('Por favor, complete todos los campos')
      setLoading(false)
      return
    }

    try {
      // Simular delay de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Autenticar usuario
      const delegado = authenticateUser(loginData.email, loginData.password)

      if (delegado) {
        console.log(`🔍 Usuario autenticado:`, {
          nombre: delegado.nombre,
          email: delegado.email,
          tipo: delegado.tipo,
          entidad: delegado.entidad,
          certificacionVigente: delegado.certificacionVigente
        })

        // Verificar estado de certificación
        if (!delegado.certificacionVigente) {
          // Delegado sin certificación - debe completar el curso LOPIVI
          console.log(`🎓 Delegado sin certificación: ${delegado.nombre} - Redirigiendo a formación`)

          // Crear sesión temporal para la formación
          const session = createSession(delegado, false) // Sesión temporal durante la formación

          // Redirigir a la página de bienvenida del delegado principal
          router.push('/bienvenida-delegado-principal')
          return
        }

        // Crear sesión para usuario certificado
        const session = createSession(delegado, loginData.recordarSesion)
        console.log(`💾 Sesión creada exitosamente:`, session)

        // Actualizar último acceso (en una app real esto sería una llamada API)
        console.log(`✅ Login exitoso: ${delegado.nombre} (${delegado.tipo}) - Certificado`)

        // Verificar que la sesión se guardó correctamente antes de redirigir
        const sessionVerificacion = localStorage.getItem('userSession')
        if (sessionVerificacion) {
          console.log(`📱 Sesión verificada en localStorage, procediendo con redirección`)
        } else {
          console.error(`❌ ERROR: No se pudo verificar la sesión guardada`)
        }

        // Redirigir según el tipo de usuario con setTimeout para garantizar que la sesión se guarde
        setTimeout(() => {
          if (delegado.tipo === 'contratante') {
            console.log(`🏢 Redirigiendo contratante a: /dashboard-entidad`)
            router.push('/dashboard-entidad')
          } else if (delegado.tipo === 'admin_custodia') {
            console.log(`⚙️ Redirigiendo admin a: /dashboard-custodia`)
            router.push('/dashboard-custodia')
          } else {
            console.log(`👤 Redirigiendo delegado ${delegado.tipo} a: /dashboard-delegado`)
            // Delegados (principal/suplente)
            router.push('/dashboard-delegado')
          }
        }, 100) // Pequeño delay para asegurar que la sesión se guarda
      } else {
        console.log(`❌ Autenticación fallida para: ${loginData.email}`)
        setError('Credenciales incorrectas. Verifique su email y contraseña.')
      }
    } catch (error) {
      setError('Error de conexión. Inténtelo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!resetEmail) {
      setError('Por favor, ingrese su email')
      setLoading(false)
      return
    }

    try {
      // Simular envío de email
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Verificar si el email existe en la DB
      const delegadoExiste = delegadosDB.find(del => del.email === resetEmail)

      if (delegadoExiste) {
        setResetSent(true)
        setError('')
      } else {
        setError('Email no encontrado en nuestros registros')
      }
    } catch (error) {
      setError('Error al enviar email de recuperación')
    } finally {
      setLoading(false)
    }
  }

  if (showPasswordReset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center mb-8">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                C
              </div>
              <span className="text-2xl font-bold text-gray-900">Custodia360</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h2>
            <p className="text-gray-600">
              Ingrese su email para recibir un enlace de recuperación
            </p>
          </div>

          {resetSent ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Email Enviado</h3>
              <p className="text-gray-600 mb-6">
                Se ha enviado un enlace de recuperación a <strong>{resetEmail}</strong>
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowPasswordReset(false)
                    setResetSent(false)
                    setResetEmail('')
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Volver al Login
                </button>
                <p className="text-xs text-gray-500">
                  ¿No recibió el email? Revise su carpeta de spam o inténtelo nuevamente en 5 minutos.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-red-600 text-xl"></span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email del Delegado
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="delegado@mientidad.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  'Enviar Enlace de Recuperación'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(false)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Volver al Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">


      {/* Contenido del Login */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
        {/* ACCESO DIRECTO PANEL ENTIDAD */}
        <div className="text-center mb-8">
          <Link
            href="/dashboard-entidad"
            className="inline-flex items-center px-8 py-4 bg-orange-600 text-white text-xl font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-2xl mb-4"
          >
            🏢 ENTRAR AL PANEL DE ENTIDAD
          </Link>
          <p className="text-orange-600 font-bold">¡Acceso directo sin login!</p>
        </div>

        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
              C
            </div>
            <span className="text-2xl font-bold text-gray-900">Custodia360</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Acceso <span className="text-blue-600">Custodia360</span></h2>
          <p className="text-gray-600">
            Ingrese sus credenciales para acceder
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Demo:</strong> Use cualquier email de delegado con cualquier contraseña
            </p>
          </div>
        </div>

        {/* Acceso Rápido para Demo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-3">Acceso Rápido - Delegados Certificados</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={async () => {
                console.log('🔘 Click en Delegado Principal')
                setLoading(true)
                setError('')

                try {
                  // Autenticar directamente con credenciales específicas
                  const delegado = authenticateUser('delegado@custodia360.com', 'demo')

                  if (delegado) {
                    console.log(`🔍 Usuario autenticado:`, {
                      nombre: delegado.nombre,
                      email: delegado.email,
                      tipo: delegado.tipo,
                      entidad: delegado.entidad,
                      certificacionVigente: delegado.certificacionVigente
                    })

                    // Crear sesión para usuario certificado
                    const session = createSession(delegado, false)
                    console.log(`💾 Sesión creada exitosamente:`, session)

                    // Verificar que la sesión se guardó
                    const sessionVerificacion = localStorage.getItem('userSession')
                    if (sessionVerificacion) {
                      console.log(`📱 Sesión verificada, redirigiendo a dashboard delegado`)
                    }

                    // Redirigir al dashboard de delegado
                    router.push('/dashboard-delegado')
                  } else {
                    setError('Error de autenticación')
                  }
                } catch (error) {
                  console.error('Error en login rápido:', error)
                  setError('Error de conexión')
                } finally {
                  setLoading(false)
                }
              }}
              className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? '...' : 'Delegado Principal'}
            </button>
            <button
              type="button"
              onClick={async () => {
                console.log('🔘 Click en Delegado Suplente')
                setLoading(true)
                setError('')

                try {
                  // Autenticar directamente con credenciales específicas
                  const delegado = authenticateUser('suplente@custodia360.com', 'demo')

                  if (delegado) {
                    console.log(`🔍 Usuario autenticado:`, {
                      nombre: delegado.nombre,
                      email: delegado.email,
                      tipo: delegado.tipo,
                      entidad: delegado.entidad,
                      certificacionVigente: delegado.certificacionVigente
                    })

                    // Crear sesión para usuario certificado
                    const session = createSession(delegado, false)
                    console.log(`💾 Sesión creada exitosamente:`, session)

                    // Verificar que la sesión se guardó
                    const sessionVerificacion = localStorage.getItem('userSession')
                    if (sessionVerificacion) {
                      console.log(`📱 Sesión verificada, redirigiendo a dashboard delegado`)
                    }

                    // Redirigir al dashboard de delegado
                    router.push('/dashboard-delegado')
                  } else {
                    setError('Error de autenticación')
                  }
                } catch (error) {
                  console.error('Error en login rápido:', error)
                  setError('Error de conexión')
                } finally {
                  setLoading(false)
                }
              }}
              className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              {loading ? '...' : 'Delegado Suplente'}
            </button>
          </div>
        </div>

        {/* Acceso Rápido - Nuevos Delegados (Formación) */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-purple-900 mb-3">Acceso Formación - Delegados Nuevos</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={async () => {
                console.log('🔘 Click en Delegado Principal NUEVO (formación)')
                setLoading(true)
                setError('')

                try {
                  // Autenticar directamente con credenciales específicas
                  const delegado = authenticateUser('nuevo@custodia360.com', 'demo')

                  if (delegado) {
                    console.log(`🎓 Delegado sin certificación: ${delegado.nombre} - Redirigiendo a formación`)

                    // Crear sesión temporal para la formación
                    const session = createSession(delegado, false)
                    console.log(`💾 Sesión creada para formación:`, session)

                    // Redirigir a la página de bienvenida correspondiente
                    if (delegado.tipo === 'suplente') {
                      router.push('/bienvenida-delegado-suplente')
                    } else {
                      router.push('/bienvenida-delegado-principal')
                    }
                  } else {
                    setError('Error de autenticación')
                  }
                } catch (error) {
                  console.error('Error en login rápido formación:', error)
                  setError('Error de conexión')
                } finally {
                  setLoading(false)
                }
              }}
              className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              {loading ? '...' : 'Delegado Principal NUEVO'}
            </button>
            <button
              type="button"
              onClick={async () => {
                console.log('🔘 Click en Delegado Suplente NUEVO (formación)')
                setLoading(true)
                setError('')

                try {
                  // Autenticar directamente con credenciales específicas
                  const delegado = authenticateUser('suplente-nuevo@custodia360.com', 'demo')

                  if (delegado) {
                    console.log(`🎓 Delegado sin certificación: ${delegado.nombre} - Redirigiendo a formación`)

                    // Crear sesión temporal para la formación
                    const session = createSession(delegado, false)
                    console.log(`💾 Sesión creada para formación:`, session)

                    // Redirigir a la página de bienvenida correspondiente
                    if (delegado.tipo === 'suplente') {
                      router.push('/bienvenida-delegado-suplente')
                    } else {
                      router.push('/bienvenida-delegado-principal')
                    }
                  } else {
                    setError('Error de autenticación')
                  }
                } catch (error) {
                  console.error('Error en login rápido formación:', error)
                  setError('Error de conexión')
                } finally {
                  setLoading(false)
                }
              }}
              className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              {loading ? '...' : 'Delegado Suplente NUEVO'}
            </button>
          </div>
          <p className="text-xs text-purple-600 mt-2 text-center">
            Estos van directo al proceso de formación LOPIVI
          </p>
        </div>

        {/* Acceso Rápido Panel Entidad */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-orange-900 mb-3">Acceso Rápido - Panel Entidad</h3>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={async () => {
                console.log('🔘 Click en Director Entidad')
                setLoading(true)
                setError('')

                try {
                  // Autenticar directamente con credenciales específicas
                  const usuario = authenticateUser('director@custodia360.com', 'demo')

                  if (usuario) {
                    console.log(`🏢 Contratante autenticado: ${usuario.nombre} - Redirigiendo a panel entidad`)

                    // Crear sesión para contratante
                    const session = createSession(usuario, false)
                    console.log(`💾 Sesión creada:`, session)

                    // Redirigir al dashboard de entidad
                    router.push('/dashboard-entidad')
                  } else {
                    setError('Error de autenticación')
                  }
                } catch (error) {
                  console.error('Error en login rápido contratante:', error)
                  setError('Error de conexión')
                } finally {
                  setLoading(false)
                }
              }}
              className="bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 transition-colors"
              disabled={loading}
            >
              {loading ? '...' : '🏢 Director Entidad → Panel Entidad'}
            </button>
            <button
              type="button"
              onClick={async () => {
                console.log('🔘 Click en Responsable Entidad')
                setLoading(true)
                setError('')

                try {
                  // Autenticar directamente con credenciales específicas
                  const usuario = authenticateUser('responsable@nuevaentidad.com', 'demo')

                  if (usuario) {
                    console.log(`🏢 Contratante autenticado: ${usuario.nombre} - Redirigiendo a panel entidad`)

                    // Crear sesión para contratante
                    const session = createSession(usuario, false)
                    console.log(`💾 Sesión creada:`, session)

                    // Redirigir al dashboard de entidad
                    router.push('/dashboard-entidad')
                  } else {
                    setError('Error de autenticación')
                  }
                } catch (error) {
                  console.error('Error en login rápido contratante:', error)
                  setError('Error de conexión')
                } finally {
                  setLoading(false)
                }
              }}
              className="bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 transition-colors"
              disabled={loading}
            >
              {loading ? '...' : '🏢 Responsable Entidad → Panel Entidad'}
            </button>
            <button
              type="button"
              onClick={async () => {
                console.log('🔘 Click en Presidenta Academia')
                setLoading(true)
                setError('')

                try {
                  // Autenticar directamente con credenciales específicas
                  const usuario = authenticateUser('presidenta@academia.com', 'demo')

                  if (usuario) {
                    console.log(`🏢 Contratante autenticado: ${usuario.nombre} - Redirigiendo a panel entidad`)

                    // Crear sesión para contratante
                    const session = createSession(usuario, false)
                    console.log(`💾 Sesión creada:`, session)

                    // Redirigir al dashboard de entidad
                    router.push('/dashboard-entidad')
                  } else {
                    setError('Error de autenticación')
                  }
                } catch (error) {
                  console.error('Error en login rápido contratante:', error)
                  setError('Error de conexión')
                } finally {
                  setLoading(false)
                }
              }}
              className="bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 transition-colors"
              disabled={loading}
            >
              {loading ? '...' : '🏢 Presidenta Academia → Panel Entidad'}
            </button>
          </div>
        </div>

        {/* Acceso Administrador Custodia360 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">⚙️ Administrador Interno Custodia360</h3>
          <button
            type="button"
            onClick={async () => {
              console.log('🔘 Click en Admin Custodia360')
              setLoading(true)
              setError('')

              try {
                // Autenticar directamente con credenciales específicas
                const usuario = authenticateUser('rsune@teamsml.com', 'Dianita2018')

                if (usuario) {
                  console.log(`⚙️ Admin autenticado: ${usuario.nombre} - Redirigiendo a dashboard custodia`)

                  // Crear sesión para admin
                  const session = createSession(usuario, false)
                  console.log(`💾 Sesión creada:`, session)

                  // Redirigir al dashboard de custodia
                  router.push('/dashboard-custodia')
                } else {
                  setError('Error de autenticación de administrador')
                }
              } catch (error) {
                console.error('Error en login admin:', error)
                setError('Error de conexión')
              } finally {
                setLoading(false)
              }
            }}
            className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            {loading ? '...' : '⚙️ Administrador Custodia360 → Dashboard Interno'}
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-600 text-xl"></span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}



          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email del Delegado
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="delegado@mientidad.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Su contraseña"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="recordarSesion"
                name="recordarSesion"
                type="checkbox"
                checked={loginData.recordarSesion}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="recordarSesion" className="ml-2 block text-sm text-gray-700">
                Recordar sesión (30 días)
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                onClick={() => setShowPasswordReset(true)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                ¿Olvidó su contraseña?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verificando...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>


        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tiene credenciales de delegado?{' '}
            <Link href="/contacto" className="font-medium text-blue-600 hover:text-blue-500">
              Contacte con nosotros
            </Link>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            ¿No recuerda su email o contraseña?{' '}
            <Link href="/contacto" className="font-medium text-blue-600 hover:text-blue-500">
              Contáctenos para recuperarla
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}
