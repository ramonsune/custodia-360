import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente para server-side (solo puede usarse en Server Components y Route Handlers)
export async function createServerClient() {
  // Importación dinámica para evitar errores en build
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: (key: string) => {
          const cookie = cookieStore.get(key)
          return cookie?.value ?? null
        },
        setItem: (key: string, value: string) => {
          try {
            cookieStore.set(key, value, {
              maxAge: 60 * 60 * 24 * 7, // 7 days
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/'
            })
          } catch (error) {
            // En Read-only cookies, ignorar errores
            console.warn('Could not set cookie:', error)
          }
        },
        removeItem: (key: string) => {
          try {
            cookieStore.delete(key)
          } catch (error) {
            // En Read-only cookies, ignorar errores
            console.warn('Could not delete cookie:', error)
          }
        }
      }
    }
  })
}

// Cliente para client-side
export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: (key: string) => {
          if (typeof window === 'undefined') return null
          return localStorage.getItem(key)
        },
        setItem: (key: string, value: string) => {
          if (typeof window === 'undefined') return
          localStorage.setItem(key, value)
        },
        removeItem: (key: string) => {
          if (typeof window === 'undefined') return
          localStorage.removeItem(key)
        }
      }
    }
  })
}

// Obtener sesión del usuario
export async function getSession() {
  const supabase = await createServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting session:', error)
    return null
  }

  return session
}

// Obtener perfil del delegado desde tabla delegados
export async function getDelegadoProfile(userId: string) {
  const supabase = await createServerClient()

  const { data: person, error } = await supabase
    .from('delegados')
    .select(`
      *,
      entidad:entidades(*)
    `)
    .eq('user_id', userId)
    .in('rol', ['delegado_principal', 'delegado_suplente'])
    .single()

  if (error) {
    console.error('Error getting delegado profile:', error)
    return null
  }

  return person
}

// Verificar si el delegado tiene acceso al panel
export async function verifyDelegadoAccess(userId: string) {
  const profile = await getDelegadoProfile(userId)

  if (!profile) {
    return { authorized: false, reason: 'profile_not_found' }
  }

  if (profile.rol !== 'delegado_principal' && profile.rol !== 'delegado_suplente') {
    return { authorized: false, reason: 'not_delegado' }
  }

  if (!profile.entity) {
    return { authorized: false, reason: 'no_entity' }
  }

  // Verificar que la entidad tenga plan activo
  if (profile.entity.plan_estado !== 'activo') {
    return { authorized: false, reason: 'plan_not_active', plan_estado: profile.entity.plan_estado }
  }

  // Verificar que el pago esté confirmado
  if (!profile.entity.pago_confirmado) {
    return { authorized: false, reason: 'payment_not_confirmed' }
  }

  // Verificar formación si es delegado principal
  if (profile.rol === 'delegado_principal' && !profile.formacion_completada) {
    return { authorized: false, reason: 'training_not_completed' }
  }

  return {
    authorized: true,
    profile,
    entity: profile.entity
  }
}

// Tipos de retorno
export interface DelegadoAccess {
  authorized: boolean
  reason?: string
  profile?: any
  entity?: any
  plan_estado?: string
}
