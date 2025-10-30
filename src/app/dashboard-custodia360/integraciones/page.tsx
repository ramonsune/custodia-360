'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface IntegrationStatus {
  ok: boolean
  panel?: string
  provider?: string
  status?: string
  error?: string
  timestamp?: string
  connected?: boolean
  apiKeyPresent?: boolean
  apiKeyValid?: boolean
  fromEmailConfigured?: boolean
}

export default function EstadoIntegraciones() {
  const [statusSupabaseDelegado, setStatusSupabaseDelegado] = useState<IntegrationStatus | null>(null)
  const [statusSupabaseAdmin, setStatusSupabaseAdmin] = useState<IntegrationStatus | null>(null)
  const [statusSupabaseEntidad, setStatusSupabaseEntidad] = useState<IntegrationStatus | null>(null)
  const [statusResend, setStatusResend] = useState<IntegrationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState<string>(new Date().toISOString())

  const checkIntegrations = async () => {
    setLoading(true)

    try {
      // Check Supabase - Panel Delegado
      const resDelegado = await fetch('/api/health/delegado')
      const dataDelegado = await resDelegado.json()
      setStatusSupabaseDelegado(dataDelegado)

      // Check Supabase - Panel Admin
      const resAdmin = await fetch('/api/health/admin')
      const dataAdmin = await resAdmin.json()
      setStatusSupabaseAdmin(dataAdmin)

      // Check Supabase - Panel Entidad
      const resEntidad = await fetch('/api/health/entidad')
      const dataEntidad = await resEntidad.json()
      setStatusSupabaseEntidad(dataEntidad)

      // Check Resend
      const resResend = await fetch('/api/health/resend')
      const dataResend = await resResend.json()
      setStatusResend(dataResend)

      setLastCheck(new Date().toISOString())
    } catch (error) {
      console.error('Error checking integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkIntegrations()
  }, [])

  const getStatusBadge = (status: IntegrationStatus | null) => {
    if (!status) {
      return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Sin datos</span>
    }

    if (status.ok) {
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">✓ Conectado</span>
    }

    return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">✕ Error</span>
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Estado de Integraciones</h1>
              <p className="text-sm text-gray-600 mt-1">Monitoreo de conexiones Supabase y Resend</p>
            </div>
            <Link
              href="/dashboard-custodia360"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              ← Volver al Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Last Check Info */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Última verificación: <span className="font-medium">{formatDate(lastCheck)}</span>
          </div>
          <button
            onClick={checkIntegrations}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Reintentar Checks'}
          </button>
        </div>

        {/* Supabase Status */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Supabase - Base de Datos</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Panel Delegado */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Panel Delegado</h3>
                  {getStatusBadge(statusSupabaseDelegado)}
                </div>
                {statusSupabaseDelegado && !statusSupabaseDelegado.ok && (
                  <p className="text-sm text-red-600 mt-2">Error: {statusSupabaseDelegado.error}</p>
                )}
                {statusSupabaseDelegado?.timestamp && (
                  <p className="text-xs text-gray-500 mt-2">{formatDate(statusSupabaseDelegado.timestamp)}</p>
                )}
              </div>

              {/* Panel Admin */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Panel Admin</h3>
                  {getStatusBadge(statusSupabaseAdmin)}
                </div>
                {statusSupabaseAdmin && !statusSupabaseAdmin.ok && (
                  <p className="text-sm text-red-600 mt-2">Error: {statusSupabaseAdmin.error}</p>
                )}
                {statusSupabaseAdmin?.timestamp && (
                  <p className="text-xs text-gray-500 mt-2">{formatDate(statusSupabaseAdmin.timestamp)}</p>
                )}
              </div>

              {/* Panel Entidad */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Panel Entidad</h3>
                  {getStatusBadge(statusSupabaseEntidad)}
                </div>
                {statusSupabaseEntidad && !statusSupabaseEntidad.ok && (
                  <p className="text-sm text-red-600 mt-2">Error: {statusSupabaseEntidad.error}</p>
                )}
                {statusSupabaseEntidad?.timestamp && (
                  <p className="text-xs text-gray-500 mt-2">{formatDate(statusSupabaseEntidad.timestamp)}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resend Status */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Resend - Sistema de Emails</h2>
          </div>
          <div className="p-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Estado del Proveedor</h3>
                {getStatusBadge(statusResend)}
              </div>

              {statusResend && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">API Key Presente:</span>
                    <span className={statusResend.apiKeyPresent ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {statusResend.apiKeyPresent ? 'Sí ✓' : 'No ✕'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">API Key Válida:</span>
                    <span className={statusResend.apiKeyValid ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {statusResend.apiKeyValid ? 'Sí ✓' : 'No ✕'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Email From Configurado:</span>
                    <span className={statusResend.fromEmailConfigured ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {statusResend.fromEmailConfigured ? 'Sí ✓' : 'No ✕'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estado:</span>
                    <span className="font-medium text-gray-900">{statusResend.status}</span>
                  </div>
                </div>
              )}

              {statusResend && !statusResend.ok && statusResend.error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {statusResend.error}
                  </p>
                </div>
              )}

              {statusResend?.timestamp && (
                <p className="text-xs text-gray-500 mt-3">{formatDate(statusResend.timestamp)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Información</h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Los health checks NO exponen valores sensibles de claves API</li>
            <li>Las verificaciones son solo de lectura y no modifican datos</li>
            <li>Si un panel muestra error, verificar las variables de entorno en Netlify</li>
            <li>Resend requiere API key que empiece con "re_" y dominio verificado</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
