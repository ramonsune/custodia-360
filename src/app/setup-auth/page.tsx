'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SetupAuthPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSetup = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/setup-test-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error en la configuración')
      }

      setResult(data)
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">🔧 Configurar Autenticación</CardTitle>
            <CardDescription>
              Crea usuarios en Supabase Auth para todos los delegados existentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">¿Qué hace este proceso?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Busca todos los delegados en la base de datos</li>
                <li>✓ Crea usuarios en Supabase Auth con contraseña temporal</li>
                <li>✓ Vincula cada usuario con su registro de delegado</li>
                <li>✓ Activa todas las entidades para permitir el acceso</li>
              </ul>
            </div>

            <Button
              onClick={handleSetup}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? 'Configurando...' : '🚀 Ejecutar Configuración'}
            </Button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">❌ Error</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {result && result.success && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">✅ Configuración Completada</h3>
                  <div className="space-y-2">
                    {result.results?.map((msg: string, i: number) => (
                      <p key={i} className="text-sm text-green-800">{msg}</p>
                    ))}
                  </div>
                </div>

                {result.credentials && result.credentials.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">🔑 Credenciales Creadas</h3>
                    <div className="space-y-3">
                      {result.credentials.map((cred: any, i: number) => (
                        <div key={i} className="bg-gray-50 rounded p-3 border border-gray-200">
                          <p className="font-semibold text-gray-900">{cred.nombre}</p>
                          <p className="text-sm text-gray-600">Tipo: {cred.tipo}</p>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Email:</span>
                              <code className="ml-2 bg-white px-2 py-1 rounded border">{cred.email}</code>
                            </div>
                            <div>
                              <span className="text-gray-500">Contraseña:</span>
                              <code className="ml-2 bg-white px-2 py-1 rounded border">{cred.password}</code>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/login'}
                    className="flex-1"
                  >
                    Ir a Login →
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setResult(null)}
                    className="flex-1"
                  >
                    Limpiar Resultados
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>💡 Información Adicional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p><strong>Contraseña temporal:</strong> Custodia360!</p>
            <p><strong>Página de login:</strong> <a href="/login" className="text-blue-600 hover:underline">/login</a></p>
            <p><strong>Admin hardcoded:</strong> rsune@teamsl.com / Dianita2018</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
              <p className="text-yellow-800 text-xs">
                ⚠️ <strong>Nota:</strong> Después del primer login, los usuarios deberían cambiar su contraseña.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
