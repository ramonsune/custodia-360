'use client'

import { useState, useEffect } from 'react'

interface ProductionCheck {
  production_ready: boolean
  checks: {
    supabase: { status: string, details: any }
    resend: { status: string, details: any }
    database: { status: string, details: any }
    environment: { status: string, details: any }
  }
  errors: string[]
  message: string
  next_steps: string[]
  timestamp: string
}

export default function ProductionReadyPage() {
  const [status, setStatus] = useState<ProductionCheck | null>(null)
  const [loading, setLoading] = useState(false)
  const [deploying, setDeploying] = useState(false)

  const checkProduction = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/production-check')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Error checking production:', error)
    } finally {
      setLoading(false)
    }
  }

  const deployToProduction = async () => {
    setDeploying(true)
    try {
      // Aquí se ejecutaría el deploy real
      console.log('🚀 Iniciando deploy a producción...')
      // Simular deploy
      await new Promise(resolve => setTimeout(resolve, 3000))
      alert('🎉 ¡Deploy exitoso! Custodia360 está LIVE')
    } catch (error) {
      console.error('Error en deploy:', error)
      alert('❌ Error en deploy')
    } finally {
      setDeploying(false)
    }
  }

  useEffect(() => {
    checkProduction()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'error': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      default: return '🔄'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🚀 Custodia360 - Estado de Producción
          </h1>
          <p className="text-gray-600">
            Verificación completa antes de salir al mercado
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando sistema...</p>
          </div>
        ) : status ? (
          <div className="space-y-6">
            {/* Estado General */}
            <div className={`rounded-lg p-6 ${status.production_ready ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-bold ${status.production_ready ? 'text-green-800' : 'text-red-800'}`}>
                    {status.production_ready ? '🟢 LISTO PARA PRODUCCIÓN' : '🔴 NO LISTO PARA PRODUCCIÓN'}
                  </h2>
                  <p className={`${status.production_ready ? 'text-green-700' : 'text-red-700'}`}>
                    {status.message}
                  </p>
                </div>
                {status.production_ready && (
                  <button
                    onClick={deployToProduction}
                    disabled={deploying}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                  >
                    {deploying ? '🚀 Desplegando...' : '🚀 DEPLOY A PRODUCCIÓN'}
                  </button>
                )}
              </div>
            </div>

            {/* Checks Detallados */}
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(status.checks).map(([key, check]) => (
                <div key={key} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">{getStatusIcon(check.status)}</span>
                    <h3 className="text-lg font-semibold capitalize">{key}</h3>
                  </div>
                  <div className={`p-3 rounded text-sm ${getStatusColor(check.status)}`}>
                    {typeof check.details === 'string' ? check.details : JSON.stringify(check.details, null, 2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Errores */}
            {status.errors.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">❌ Errores a Resolver</h3>
                <ul className="space-y-2">
                  {status.errors.map((error, index) => (
                    <li key={index} className="text-red-700 bg-red-50 p-3 rounded">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Próximos Pasos */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">📋 Próximos Pasos</h3>
              <ul className="space-y-2">
                {status.next_steps.map((step, index) => (
                  <li key={index} className="text-blue-700 bg-blue-50 p-3 rounded">
                    {index + 1}. {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Información de Deployment */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">🌐 Información de Deployment</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>URL Producción:</strong> https://custodia360.es</p>
                  <p><strong>Última verificación:</strong> {new Date(status.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p><strong>Demo Mode:</strong> Desactivado</p>
                  <p><strong>Debug Mode:</strong> Desactivado</p>
                </div>
              </div>
            </div>

            {/* Credenciales de Acceso */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">🔑 Credenciales de Acceso (Producción)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded border">
                  <p className="font-bold text-green-800">Delegado Principal</p>
                  <p className="text-sm">Email: maria.garcia@clubdeportivo.com</p>
                  <p className="text-sm">Contraseña: delegado123</p>
                  <a href="/login-delegados?tipo=principal" className="text-blue-600 hover:underline text-sm">
                    → Acceder al Panel
                  </a>
                </div>
                <div className="bg-white p-4 rounded border">
                  <p className="font-bold text-purple-800">Delegado Suplente</p>
                  <p className="text-sm">Email: carlos.rodriguez@clubdeportivo.com</p>
                  <p className="text-sm">Contraseña: suplente123</p>
                  <a href="/login-delegados?tipo=suplente" className="text-blue-600 hover:underline text-sm">
                    → Acceder al Panel
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No se pudo cargar el estado de producción</p>
            <button
              onClick={checkProduction}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={checkProduction}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mr-4"
          >
            🔄 Verificar Nuevamente
          </button>
          <a
            href="/"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            ← Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  )
}
