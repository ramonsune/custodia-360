'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface BOEAlert {
  id: number
  fecha: string
  total_cambios: number
  leido: boolean
  resumen: string
  normas_afectadas: string[]
  cambios_ids: number[]
  created_at: string
}

export default function BOEAlertasPage() {
  const [alerts, setAlerts] = useState<BOEAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/admin/boe/alerts')
      const data = await response.json()

      if (data.success) {
        setAlerts(data.alerts)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (alertId: number) => {
    try {
      const response = await fetch('/api/admin/boe/alerts/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId })
      })

      const data = await response.json()

      if (data.success) {
        // Update local state
        setAlerts(prev => prev.map(alert =>
          alert.id === alertId ? { ...alert, leido: true } : alert
        ))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking alert as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/boe/alerts/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      })

      const data = await response.json()

      if (data.success) {
        setAlerts(prev => prev.map(alert => ({ ...alert, leido: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-slate-600">Cargando alertas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                🔔 Alertas BOE - LOPIVI
              </h1>
              <p className="text-slate-600">
                Notificaciones de cambios detectados en el Boletín Oficial del Estado
              </p>
            </div>
            <Link href="/dashboard-custodia360/monitoreo-boe">
              <Button variant="outline">
                ← Volver al Monitor
              </Button>
            </Link>
          </div>

          {unreadCount > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-orange-900 font-medium">
                  Tienes {unreadCount} alerta{unreadCount !== 1 ? 's' : ''} sin leer
                </span>
              </div>
              <Button
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                Marcar todas como leídas
              </Button>
            </div>
          )}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No hay alertas
              </h3>
              <p className="text-slate-500">
                Cuando se detecten cambios en el BOE, aparecerán aquí
              </p>
            </Card>
          ) : (
            alerts.map(alert => (
              <Card
                key={alert.id}
                className={`p-6 transition-all ${
                  !alert.leido
                    ? 'border-l-4 border-l-orange-500 bg-white shadow-md'
                    : 'bg-slate-50 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {!alert.leido && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                      <span className="text-sm text-slate-500">
                        {new Date(alert.fecha).toLocaleString('es-ES', {
                          timeZone: 'Europe/Madrid',
                          dateStyle: 'full',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {alert.total_cambios} cambio{alert.total_cambios !== 1 ? 's' : ''} detectado{alert.total_cambios !== 1 ? 's' : ''}
                    </h3>

                    <p className="text-slate-700 mb-3">
                      {alert.resumen}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Normas afectadas:</span>
                        <span className="font-medium text-slate-700">
                          {alert.normas_afectadas?.join(', ') || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!alert.leido && (
                      <Button
                        onClick={() => markAsRead(alert.id)}
                        size="sm"
                        variant="outline"
                        className="border-orange-300 text-orange-700 hover:bg-orange-50"
                      >
                        ✓ Marcar como leída
                      </Button>
                    )}
                    <Link href="/dashboard-custodia360/monitoreo-boe">
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        Ver detalles →
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
