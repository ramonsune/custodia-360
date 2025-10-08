'use client'

import { useState, useEffect } from 'react'

export default function DiagnosticoEmailsPage() {
  const [emailStatus, setEmailStatus] = useState<any>(null)
  const [testEmail, setTestEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    try {
      const response = await fetch('/api/test-email')
      const status = await response.json()
      setEmailStatus(status)
    } catch (error) {
      console.error('Error checking email configuration:', error)
    }
  }

  const testContactForm = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      setError('Por favor ingresa un email válido')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Probar directamente el formulario de contacto
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: 'Prueba Sistema',
          email: testEmail,
          telefono: '123456789',
          empresa: 'Test Custodia360',
          mensaje: 'Este es un mensaje de prueba del sistema de emails de Custodia360. Si recibes este email, ¡todo funciona perfectamente!'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: 'Email de contacto enviado exitosamente',
          details: data
        })
      } else {
        setError(data.error || 'Error enviando email de contacto')
        setResult(data)
      }
    } catch (error) {
      setError('Error de conexión')
      console.error('Error testing contact form:', error)
    } finally {
      setLoading(false)
    }
  }

  const testDirectEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      setError('Por favor ingresa un email válido')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testEmail,
          testType: 'basic'
        })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'Error enviando email')
        setResult(data)
      }
    } catch (error) {
      setError('Error de conexión')
      console.error('Error testing email:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔧 Diagnóstico de Emails - Custodia360
          </h1>
          <p className="text-gray-600">
            Diagnóstico completo del sistema de emails y formulario de contacto
          </p>
        </div>

        {/* Estado de Configuración */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Estado Actual de Resend</h2>

          {emailStatus ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${emailStatus.configured ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{emailStatus.configured ? '✅' : '❌'}</span>
                  <h3 className={`font-semibold ${emailStatus.configured ? 'text-green-800' : 'text-red-800'}`}>
                    {emailStatus.configured ? 'Resend Configurado Correctamente' : 'Resend NO Configurado'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm"><strong>API Key Presente:</strong> {emailStatus.apiKeyPresent ? '✅ Sí' : '❌ No'}</p>
                    <p className="text-sm"><strong>API Key Válida:</strong> {emailStatus.apiKeyValid ? '✅ Sí' : '❌ No'}</p>
                  </div>
                  <div>
                    <p className="text-sm"><strong>Email Origen:</strong> {emailStatus.fromEmail}</p>
                    <p className="text-sm"><strong>Estado:</strong> {emailStatus.status}</p>
                  </div>
                </div>
              </div>

              {!emailStatus.configured && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-900 mb-2">🚨 PROBLEMA DETECTADO</h4>
                  <p className="text-yellow-800 mb-3">Tu API key de Resend no está configurada correctamente.</p>

                  <div className="bg-yellow-100 p-3 rounded">
                    <h5 className="font-bold text-yellow-900 mb-2">✅ Solución Inmediata:</h5>
                    <ol className="list-decimal list-inside text-yellow-800 space-y-1">
                      <li>Ve a tu dashboard de Resend: <a href="https://resend.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://resend.com/dashboard</a></li>
                      <li>Copia tu API key (empieza con "re_")</li>
                      <li>Edita el archivo <code className="bg-yellow-200 px-1 rounded">.env.local</code></li>
                      <li>Reemplaza: <code className="bg-yellow-200 px-1 rounded">RESEND_API_KEY=tu_clave_real_aqui</code></li>
                      <li>Reinicia el servidor: <code className="bg-yellow-200 px-1 rounded">bun run dev</code></li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600">Verificando configuración...</p>
            </div>
          )}
        </div>

        {/* Pruebas de Email */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Probar Sistema de Emails</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu email para recibir las pruebas
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={testContactForm}
                disabled={loading || !emailStatus?.configured}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? '📧 Enviando...' : '🎯 Probar Formulario Contacto'}
              </button>

              <button
                onClick={testDirectEmail}
                disabled={loading || !emailStatus?.configured}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '📧 Enviando...' : '📧 Prueba Directa'}
              </button>

              <button
                onClick={checkConfiguration}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                🔄 Verificar Configuración
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <h3 className="font-bold text-red-900 mb-2">❌ Error</h3>
            <p className="text-red-800">{error}</p>

            {error.includes('API key') && (
              <div className="mt-3 p-3 bg-red-100 rounded">
                <p className="text-red-800 font-medium">Solución:</p>
                <p className="text-red-700 text-sm">1. Verifica que tu API key de Resend sea correcta en .env.local</p>
                <p className="text-red-700 text-sm">2. Asegúrate de que empiece con "re_"</p>
                <p className="text-red-700 text-sm">3. Reinicia el servidor después de cambiar la configuración</p>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className={`border rounded-lg p-4 mb-8 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className={`font-bold mb-2 ${result.success ? 'text-green-900' : 'text-red-900'}`}>
              {result.success ? '✅ Email Enviado Exitosamente' : '❌ Error en el Envío'}
            </h3>

            {result.success ? (
              <div className="space-y-2">
                <p className="text-green-800">
                  <strong>✅ ¡Perfecto!</strong> El email se envió correctamente a {testEmail}
                </p>
                <p className="text-green-800">
                  <strong>📧 Desde:</strong> {result.sentFrom || emailStatus?.fromEmail}
                </p>
                {result.emailId && (
                  <p className="text-green-800">
                    <strong>ID:</strong> {result.emailId}
                  </p>
                )}
                <div className="bg-green-100 p-3 rounded mt-3">
                  <p className="text-green-800 font-medium">🎉 ¡El sistema de emails funciona correctamente!</p>
                  <p className="text-green-700 text-sm">Revisa tu bandeja de entrada (y la carpeta de spam) para ver el email.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-800">
                  <strong>Error:</strong> {result.error}
                </p>
                {result.suggestions && result.suggestions.length > 0 && (
                  <div>
                    <p className="text-red-800 font-medium">Sugerencias:</p>
                    <ul className="list-disc list-inside text-red-700 text-sm">
                      {result.suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Información */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">💡 Información sobre el Sistema</h3>
          <div className="space-y-2 text-blue-800">
            <p>• <strong>Formulario de contacto:</strong> /contacto</p>
            <p>• <strong>API de contacto:</strong> /api/contacto</p>
            <p>• <strong>API de pruebas:</strong> /api/test-email</p>
            <p>• <strong>Configuración:</strong> .env.local</p>
          </div>
        </div>

        <div className="text-center mt-8">
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
