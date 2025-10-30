'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, isExpired } from '@/lib/auth/session'

export default function TestEntidad() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const session = getSession()

      if (!session.token) {
        console.warn('⚠️ Sin sesión')
        router.push('/login')
        return false
      }

      if (isExpired()) {
        console.warn('⚠️ Sesión expirada')
        router.push('/login')
        return false
      }

      if (session.role !== 'ENTIDAD') {
        console.warn('⚠️ Rol no autorizado:', session.role)
        router.push('/login')
        return false
      }

      console.log('✅ Acceso autorizado - Sesión:', session)
      return true
    }

    if (!checkAuth()) return
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-green-600">✅ TEST PANEL ENTIDAD FUNCIONA</h1>
      <p className="mt-4 text-lg">Si ves esto, la sesión funciona correctamente.</p>
      <a href="/dashboard-entidad" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded">
        Ir al dashboard completo
      </a>
    </div>
  )
}
