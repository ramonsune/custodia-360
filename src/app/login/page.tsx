'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  isDemoMode,
  demoLogin,
  getDemoRedirectPath,
  saveDemoSessionToLocalStorage,
  DEMO_USERS
} from '@/lib/demo-auth'
import { saveSession, clearSession, getSession } from '@/lib/auth/session'

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
  const [isDemo, setIsDemo] = useState(false)
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: '',
    password: '',
    recordarSesion: false
  })

  // Verificar si estamos en modo DEMO
  useEffect(() => {
    setIsDemo(isDemoMode())
  }, [])

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

    // MODO DEMO: Verificar si es un usuario demo
    if (isDemoMode()) {
      const demoUser = demoLogin(email, password)
      if (demoUser) {
        console.log(`✅ Usuario DEMO encontrado: ${demoUser.nombre} (${demoUser.role})`)
        // Convertir DemoUser a DelegadoData
        return {
          id: `demo_${demoUser.role.toLowerCase()}`,
          nombre: demoUser.nombre,
          email: demoUser.email,
          tipo: demoUser.role === 'ENTIDAD' ? 'contratante' :
                demoUser.role === 'ADMIN' ? 'admin_custodia' :
                demoUser.role.toLowerCase() as 'principal' | 'suplente',
          entidad: demoUser.entidad,
          permisos: ['demo_access'],
          certificacionVigente: true,
          ultimoAcceso: new Date().toISOString()
        }
      }
    }

    // Buscar usuario en la base de datos
    const usuario = delegadosDB.find(del => del.email === email)

    if (usuario && password.length > 0) {
      console.log(`✅ Usuario encontrado: ${usuario.nombre} (${usuario.tipo})`)
      return usuario
    }

    console.log(`❌ Email no reconocido: ${email}`)
    return null
  }

  const createSession = (delegado: DelegadoData, recordar: boolean) => {
    // Mapear tipo antiguo a rol nuevo
    let role: 'ADMIN' | 'ENTIDAD' | 'DELEGADO' | 'SUPLENTE' = 'DELEGADO'

    if (delegado.tipo === 'contratante') {
      role = 'ENTIDAD'
    } else if (delegado.tipo === 'admin_custodia') {
      role = 'ADMIN'
    } else if (delegado.tipo === 'principal') {
      role = 'DELEGADO'
    } else if (delegado.tipo === 'suplente') {
      role = 'SUPLENTE'
    }

    // Asegurar que entity tenga un valor válido
    const entityValue = delegado.entidad || 'Entidad Demo'

    // Usar la nueva capa de sesión unificada
    saveSession({
      token: delegado.id,
      role: role,
      entity: entityValue, // Siempre enviar un valor no vacío
      isDemo: isDemoMode(),
      ttlHours: recordar ? 720 : 8, // 30 días o 8 horas
      userId: delegado.id,
      userName: delegado.nombre,
      userEmail: delegado.email
    })

    console.log('✅ Sesión guardada con nueva capa:', {
      role,
      entity: entityValue,
      userId: delegado.id,
      userName: delegado.nombre,
      userEmail: delegado.email
    })

    // Mantener compatibilidad temporal con código legacy
    const legacySessionData = {
      id: delegado.id,
      nombre: delegado.nombre,
      email: delegado.email,
      tipo: delegado.tipo,
      entidad: delegado.entidad,
      permisos: delegado.permisos,
      certificacionVigente: delegado.certificacionVigente,
      inicioSesion: new Date().toISOString(),
      expiracion: recordar
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      isDemo: isDemoMode()
    }

    return legacySessionData
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
      await new Promise(resolve => setTimeout(resolve, 500))

      // Autenticar usuario DIRECTO
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
          // Delegado sin certificación - debe completar el proceso de formación LOPIVI
          console.log(`🎓 Delegado sin certificación: ${delegado.nombre} (${delegado.tipo}) - Redirigiendo a formación`)

          // Crear sesión temporal para la formación
          const session = createSession(delegado, false) // Sesión temporal durante la formación

          // Redirigir según el tipo de delegado sin certificación
          if (delegado.tipo === 'principal') {
            console.log(`👨‍💼 Delegado principal sin formación → /bienvenida-formacion`)
            router.push('/bienvenida-formacion')
          } else if (delegado.tipo === 'suplente') {
            console.log(`👨‍💼 Delegado suplente sin formación → /bienvenida-delegado-suplente`)
            router.push('/bienvenida-delegado-suplente')
          } else {
            console.log(`❓ Tipo de delegado no reconocido: ${delegado.tipo}, usando bienvenida formación`)
            router.push('/bienvenida-formacion')
          }
          return
        }

        // Crear sesión para usuario certificado
        const session = createSession(delegado, loginData.recordarSesion)
        console.log(`💾 Sesión creada exitosamente:`, session)

        // Actualizar último acceso (en una app real esto sería una llamada API)
        console.log(`✅ Login exitoso: ${delegado.nombre} (${delegado.tipo}) - Certificado`)

        // Verificar que la sesión se guardó correctamente con el nuevo sistema
        const { token, role, entityName } = getSession()
        if (token && role) {
          console.log(`📱 Sesión verificada en nuevo sistema:`, { token: '✓', role, entity: entityName })
        } else {
          console.error(`❌ ERROR: No se pudo verificar la sesión guardada`)
        }

        // Redirigir según el tipo de usuario con setTimeout para garantizar que la sesión se guarde
        setTimeout(() => {
          if (delegado.tipo === 'contratante') {
            console.log(`🏢 Redirigiendo contratante a: /dashboard-entidad`)
            router.push('/dashboard-entidad')
          } else if (delegado.tipo === 'admin_custodia') {
            console.log(`⚙️ Redirigiendo admin a: /dashboard-custodia360`)
            router.push('/dashboard-custodia360')
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

  // Funciones de acceso directo para testing
  const accesoDirecto = (tipo: string) => {
    if (tipo === 'entidad') {
      saveSession({
        token: 'test_entidad',
        role: 'ENTIDAD',
        entity: 'Club Deportivo Test',
        isDemo: true,
        userId: 'cont_001',
        userName: 'Director Test',
        userEmail: 'director@test.com'
      })

      window.location.href = '/dashboard-entidad'
    } else if (tipo === 'principal') {
      saveSession({
        token: 'test_principal',
        role: 'DELEGADO',
        entity: 'Club Deportivo Test',
        isDemo: true,
        userId: 'del_001',
        userName: 'Juan García (Principal)',
        userEmail: 'principal@test.com'
      })

      window.location.href = '/dashboard-delegado'
    } else if (tipo === 'suplente') {
      saveSession({
        token: 'test_suplente',
        role: 'SUPLENTE',
        entity: 'Club Deportivo Test',
        isDemo: true,
        userId: 'del_002',
        userName: 'María López (Suplente)',
        userEmail: 'suplente@test.com'
      })

      window.location.href = '/dashboard-delegado'
    } else if (tipo === 'nuevo') {
      saveSession({
        token: 'test_nuevo',
        role: 'DELEGADO',
        entity: 'Club Nuevo Test',
        isDemo: true,
        userId: 'del_004',
        userName: 'Ana Fernández (Nuevo)',
        userEmail: 'nuevo@test.com'
      })

      window.location.href = '/bienvenida-formacion'
    } else if (tipo === 'admin') {
      saveSession({
        token: 'test_admin',
        role: 'ADMIN',
        entity: 'Custodia360 Admin',
        isDemo: true,
        userId: 'admin_001',
        userName: 'Administrador Custodia360',
        userEmail: 'admin@custodia360.com'
      })

      window.location.href = '/dashboard-custodia360'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">


      {/* Contenido del Login */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
        {/* Header - Minimal */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
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
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu@email.com"
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

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Si no recuerda su email o contraseña, contacte con{' '}
              <Link href="/contacto" className="font-medium text-blue-600 hover:text-blue-500">
                soporte técnico
              </Link>
            </p>
          </div>
        </form>

        {/* ACCESOS DIRECTOS PARA DESARROLLO */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8 border-4 border-orange-500">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-orange-600">🚀 ACCESO DIRECTO A PANELES</h3>
            <p className="text-sm text-gray-600 mt-2">Para desarrollo y testing</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Botón 1: Entidad */}
            <button
              onClick={() => accesoDirecto('entidad')}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-between"
            >
              <span>1️⃣ Panel Entidad</span>
              <span className="text-xs opacity-75">→ /dashboard-entidad</span>
            </button>

            {/* Botón 2: Delegado Principal */}
            <button
              onClick={() => accesoDirecto('principal')}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-between"
            >
              <span>2️⃣ Delegado Principal</span>
              <span className="text-xs opacity-75">→ /dashboard-delegado</span>
            </button>

            {/* Botón 3: Delegado Suplente */}
            <button
              onClick={() => accesoDirecto('suplente')}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-between"
            >
              <span>3️⃣ Delegado Suplente</span>
              <span className="text-xs opacity-75">→ /dashboard-delegado</span>
            </button>

            {/* Botón 4: Delegado Nuevo (sin certificación) */}
            <button
              onClick={() => accesoDirecto('nuevo')}
              className="w-full py-3 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-between"
            >
              <span>4️⃣ Delegado Nuevo</span>
              <span className="text-xs opacity-75">→ /bienvenida-formacion</span>
            </button>

            {/* Botón 5: Admin Custodia360 */}
            <button
              onClick={() => accesoDirecto('admin')}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-between"
            >
              <span>5️⃣ Admin Custodia360</span>
              <span className="text-xs opacity-75">→ /dashboard-custodia360</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Estos botones crean sesiones de prueba automáticamente
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
