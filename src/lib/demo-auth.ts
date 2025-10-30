/**
 * DEMO AUTHENTICATION LIBRARY
 * ===========================
 * Sistema de autenticación en memoria para entorno DEMO Preview
 * No conecta a Supabase, solo usa localStorage temporal
 */

export interface DemoUser {
  email: string
  password: string
  role: 'ENTIDAD' | 'DELEGADO' | 'SUPLENTE' | 'ADMIN'
  nombre: string
  entidad: string
  redirectPath: string
}

export const DEMO_USERS: DemoUser[] = [
  {
    email: 'entidad@custodia.com',
    password: '123',
    role: 'ENTIDAD',
    nombre: 'Representante Legal Demo',
    entidad: 'Entidad Demo - Preview',
    redirectPath: '/dashboard-entidad'
  },
  {
    email: 'delegado@custodia.com',
    password: '123',
    role: 'DELEGADO',
    nombre: 'Delegado Principal Demo',
    entidad: 'Entidad Demo - Preview',
    redirectPath: '/dashboard-delegado'
  },
  {
    email: 'delegados@custodia.com',
    password: '123',
    role: 'SUPLENTE',
    nombre: 'Delegado Suplente Demo',
    entidad: 'Entidad Demo - Preview',
    redirectPath: '/dashboard-suplente'
  },
  {
    email: 'ramon@custodia.com',
    password: '123',
    role: 'ADMIN',
    nombre: 'Admin Custodia360',
    entidad: 'Custodia360 - Admin',
    redirectPath: '/dashboard-custodia360'
  }
]

/**
 * Check if DEMO mode is enabled
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_ENABLED === 'true'
}

/**
 * Authenticate demo user
 */
export function demoLogin(email: string, password: string): DemoUser | null {
  if (!isDemoMode()) return null

  const user = DEMO_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )

  return user || null
}

/**
 * Get redirect path for demo user
 */
export function getDemoRedirectPath(role: string): string {
  const user = DEMO_USERS.find(u => u.role === role)
  return user?.redirectPath || '/dashboard-delegado'
}

/**
 * Save demo session to localStorage (temporary, non-persistent)
 */
export function saveDemoSessionToLocalStorage(user: DemoUser) {
  const sessionData = {
    id: `demo_${user.role.toLowerCase()}`,
    nombre: user.nombre,
    email: user.email,
    tipo: user.role.toLowerCase(),
    entidad: user.entidad,
    permisos: ['demo_access'],
    certificacionVigente: true,
    inicioSesion: new Date().toISOString(),
    expiracion: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
    isDemo: true
  }

  // Save in both locations for compatibility
  localStorage.setItem('userAuth', JSON.stringify(sessionData))
  localStorage.setItem('userSession', JSON.stringify(sessionData))
  sessionStorage.setItem('userSession', JSON.stringify(sessionData))

  console.log('✅ Demo session created:', {
    role: user.role,
    email: user.email,
    redirectPath: user.redirectPath
  })
}

/**
 * Clear demo session
 */
export function clearDemoSession() {
  localStorage.removeItem('userAuth')
  localStorage.removeItem('userSession')
  sessionStorage.removeItem('userSession')
  console.log('✅ Demo session cleared')
}
