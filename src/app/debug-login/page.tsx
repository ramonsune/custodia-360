'use client'

import { useState } from 'react'

export default function DebugLoginPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testLogin = async (email: string, password: string) => {
    setLoading(true)
    setError('')
    setTestResult(null)

    try {
      console.log('🔍 Testing login with:', email)

      const response = await fetch('/api/formacion-lopivi/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      const data = await response.json()

      console.log('📄 Response status:', response.status)
      console.log('📄 Response data:', data)

      setTestResult({
        test: 'login',
        status: response.status,
        success: response.ok,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        setError(`${response.status}: ${data.error || 'Error desconocido'}`)
      }

    } catch (error) {
      console.error('❌ Error testing login:', error)
      setError('Error de red: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const testSupabaseConnection = async () => {
    setLoading(true)
    setError('')

    try {
      console.log('🔍 Testing Supabase connection...')

      const response = await fetch('/api/test-supabase', {
        method: 'GET'
      })

      const data = await response.json()

      setTestResult({
        test: 'supabase_connection',
        status: response.status,
        success: response.ok,
        data: data
      })

    } catch (error) {
      console.error('❌ Error testing Supabase:', error)
      setError('Error de conexión Supabase: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const createTestUsers = async () => {
    setLoading(true)
    setError('')

    try {
      console.log('🔧 Creating test users...')

      const response = await fetch('/api/create-test-users', {
        method: 'POST'
      })

      const data = await response.json()

      setTestResult({
        test: 'create_users',
        status: response.status,
        success: response.ok,
        data: data
      })

      if (!response.ok) {
        setError(`Error creando usuarios: ${data.error || 'Error desconocido'}`)
      }

    } catch (error) {
      console.error('❌ Error creating test users:', error)
      setError('Error creando usuarios: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const credencialesTest = [
    {
      email: 'maria.garcia@clubdeportivo.com',
      password: 'delegado123',
      tipo: 'Delegado Principal'
    },
    {
      email: 'carlos.rodriguez@clubdeportivo.com',
      password: 'suplente123',
      tipo: 'Delegado Suplente'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔧 Debug - Sistema de Login
          </h1>
          <p className="text-gray-600">
            Diagnosticar problemas de autenticación
          </p>
        </div>

        {/* Paso 0: Crear usuarios de prueba */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-orange-800 mb-4">0. 🛠️ Crear Usuarios de Prueba</h2>
          <p className="text-orange-700 mb-4">
            Si es la primera vez o tienes problemas, crea los usuarios de prueba en Supabase:
          </p>
          <button
            onClick={createTestUsers}
            disabled={loading}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Usuarios de Prueba en Supabase'}
          </button>
        </div>

        {/* Test de conexión Supabase */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. 🔌 Test Conexión Supabase</h2>
          <button
            onClick={testSupabaseConnection}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Probando...' : 'Probar Conexión Supabase'}
          </button>
        </div>

        {/* Test de credenciales */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. 🔑 Test Credenciales de Login</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {credencialesTest.map((cred, index) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <h3 className="font-bold text-gray-900 mb-2">{cred.tipo}</h3>
                <p className="text-sm text-gray-600 mb-2">Email: {cred.email}</p>
                <p className="text-sm text-gray-600 mb-4">Password: {cred.password}</p>
                <button
                  onClick={() => testLogin(cred.email, cred.password)}
                  disabled={loading}
                  className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Probando...' : 'Probar Login'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Variables de entorno */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. ⚙️ Variables de Entorno</h2>
          <div className="text-sm space-y-2">
            <p><strong>SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ No configurada'}</p>
            <p><strong>SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'}</p>
            <p><strong>SUPABASE_SERVICE_ROLE:</strong> {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurada' : '❌ No configurada'}</p>
            <p><strong>APP_URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'No configurada'}</p>
          </div>
        </div>

        {/* Resultados del test */}
        {testResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Resultados del Test</h2>
            <div className={`p-4 rounded ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`font-bold mb-2 ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {testResult.test}: {testResult.status} - {testResult.success ? 'ÉXITO' : 'ERROR'}
              </p>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-96">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Errores */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <h3 className="font-bold text-red-800 mb-2">❌ Error Detectado</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Instrucciones paso a paso */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">📋 Instrucciones Paso a Paso</h2>
          <ol className="text-blue-700 space-y-2">
            <li><strong>Paso 0:</strong> Haz clic en "Crear Usuarios de Prueba" para asegurar que existen en Supabase</li>
            <li><strong>Paso 1:</strong> Prueba la conexión a Supabase</li>
            <li><strong>Paso 2:</strong> Prueba las credenciales de login</li>
            <li><strong>Paso 3:</strong> Revisa los errores específicos en los resultados</li>
            <li><strong>Paso 4:</strong> Si todo funciona, ve al login normal</li>
          </ol>

          <div className="mt-4 p-4 bg-blue-100 rounded">
            <h4 className="font-bold text-blue-800 mb-2">🎯 URLs para probar después:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <a href="/login-delegados?tipo=principal" className="underline">Login Delegado Principal</a></li>
              <li>• <a href="/login-delegados?tipo=suplente" className="underline">Login Delegado Suplente</a></li>
              <li>• <a href="/login" className="underline">Login Unificado</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 mr-4"
          >
            ← Volver al Inicio
          </a>
          <a
            href="/login-delegados"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Ir al Login Normal →
          </a>
        </div>
      </div>
    </div>
  )
}
