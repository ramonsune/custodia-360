'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AccesoRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir inmediatamente a /login
    router.replace('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
            C
          </div>
          <span className="text-2xl font-bold text-gray-900">Custodia360</span>
        </div>
        <p className="text-gray-600">Redirigiendo al acceso...</p>
        <div className="mt-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
