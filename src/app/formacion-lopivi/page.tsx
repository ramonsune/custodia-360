'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FormacionLopiviPage() {
  const router = useRouter()

  useEffect(() => {
    // Redireccionar al selector de entidad del flujo correcto
    router.push('/selector-entidad')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Accediendo a la Formación Custodia360...</h2>
        <p className="text-gray-600">Club Deportivo Los Leones</p>
      </div>
    </div>
  )
}
