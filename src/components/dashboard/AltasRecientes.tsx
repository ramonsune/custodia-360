'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Process {
  id: string
  email: string
  entity_name: string
  status: string
  created_at: string
}

export function AltasRecientesWidget() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecentProcesses()
  }, [])

  const loadRecentProcesses = async () => {
    try {
      const response = await fetch('/api/audit/processes?limit=10')
      const result = await response.json()

      if (result.success) {
        setProcesses(result.data.slice(0, 10))
      }
    } catch (error) {
      console.error('Error cargando altas recientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      provisioned: 'bg-green-100 text-green-800',
      trained: 'bg-purple-100 text-purple-800',
      error: 'bg-red-100 text-red-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `Hace ${minutes}m`
    if (hours < 24) return `Hace ${hours}h`
    return `Hace ${days}d`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Altas Recientes (Onboarding 1€)</h3>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Altas Recientes (Onboarding 1€)</h3>
        <Link
          href="/admin/auditoria"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Ver todas →
        </Link>
      </div>

      <div className="p-6">
        {processes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay altas recientes</p>
        ) : (
          <div className="space-y-3">
            {processes.map((process) => (
              <Link
                key={process.id}
                href={`/admin/auditoria?processId=${process.id}`}
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition"
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-semibold text-sm text-gray-900 truncate flex-1 mr-2">
                    {process.entity_name}
                  </p>
                  <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${getStatusBadge(process.status)}`}>
                    {process.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 truncate mb-1">{process.email}</p>
                <p className="text-xs text-gray-400">{formatDate(process.created_at)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
