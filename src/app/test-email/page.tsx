'use client'

import { useState } from 'react'

export default function TestEmailPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [email, setEmail] = useState('rsune@teamsml.com')

  const testearEmail = async (tipo: string) => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          email,
          nombre: 'Carlos Test',
          entidad: 'Test Custodia360'
        })
      })

      const data = await response.json()

      if (data.success) {
        setResult(`✅ Email ${tipo} enviado correctamente!\nRevisa tu bandeja de entrada`)
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Test Emails Custodia360
          </h1>

          <div className="mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Tu email aquí"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => testearEmail('confirmacion_contratacion')}
              disabled={loading}
              className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Confirmación Contratación
            </button>

            <button
              onClick={() => testearEmail('credenciales_delegado')}
              disabled={loading}
              className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Credenciales Delegado
            </button>

            <button
              onClick={() => testearEmail('certificacion_completada')}
              disabled={loading}
              className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Certificación Completada
            </button>

            <button
              onClick={() => testearEmail('canal_lopivi')}
              disabled={loading}
              className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Canal LOPIVI
            </button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2">Enviando...</span>
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <pre className="text-sm">{result}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
