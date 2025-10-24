'use client'

import { useState } from 'react'

export default function SetupSupabasePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [anonKey, setAnonKey] = useState('')
  const [serviceKey, setServiceKey] = useState('')

  const steps = [
    {
      id: 1,
      title: '🚀 Crear Proyecto Supabase',
      description: 'Configura tu base de datos en la nube',
      action: 'Ir a Supabase'
    },
    {
      id: 2,
      title: '🔑 Obtener Claves API',
      description: 'Copiar las credenciales de tu proyecto',
      action: 'Configurar Claves'
    },
    {
      id: 3,
      title: '🗃️ Crear Base de Datos',
      description: 'Ejecutar el script SQL para crear tablas',
      action: 'Ejecutar SQL'
    },
    {
      id: 4,
      title: '⚡ Configurar Aplicación',
      description: 'Actualizar variables de entorno',
      action: 'Configurar App'
    },
    {
      id: 5,
      title: '✅ Probar Conexión',
      description: 'Verificar que todo funciona',
      action: 'Probar'
    }
  ]

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                🚀 Paso 1: Crear Proyecto en Supabase
              </h3>
              <ol className="text-blue-700 space-y-3">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                  <div>
                    <strong>Ve a Supabase:</strong>
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      className="ml-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Abrir supabase.com →
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                  <strong>Haz clic en "Start your project"</strong>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                  <strong>Crea una cuenta</strong> o inicia sesión si ya tienes una
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                  <div>
                    <strong>Crear nuevo proyecto:</strong>
                    <ul className="ml-4 mt-2 space-y-1">
                      <li>• <strong>Nombre:</strong> custodia360-production</li>
                      <li>• <strong>Password:</strong> (elige una contraseña fuerte)</li>
                      <li>• <strong>Región:</strong> Europe West (London) o más cercana</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">5</span>
                  <strong>Espera</strong> a que se cree el proyecto (1-2 minutos)
                </li>
              </ol>

              <div className="mt-6 p-4 bg-blue-100 rounded">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Tip:</strong> Supabase es gratuito hasta 500MB de base de datos y 2GB de transferencia.
                  Perfecto para Custodia360.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Siguiente: Obtener Claves →
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                🔑 Paso 2: Obtener Claves API
              </h3>
              <ol className="text-green-700 space-y-3">
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                  <strong>En tu proyecto Supabase, ve a:</strong> Settings → API
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                  <strong>Copia estas 3 claves:</strong>
                </li>
              </ol>

              <div className="grid md:grid-cols-1 gap-4 mt-4">
                <div className="bg-white p-4 rounded border">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project URL (termina en .supabase.co):
                  </label>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://tu-proyecto.supabase.co"
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>

                <div className="bg-white p-4 rounded border">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anon Key (clave pública, empieza con eyJ...):
                  </label>
                  <textarea
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full p-2 border rounded text-sm h-20"
                  />
                </div>

                <div className="bg-white p-4 rounded border">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Role Key (clave privada, empieza con eyJ...):
                  </label>
                  <textarea
                    value={serviceKey}
                    onChange={(e) => setServiceKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full p-2 border rounded text-sm h-20"
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-100 rounded">
                <p className="text-yellow-800 text-sm">
                  ⚠️ <strong>Importante:</strong> La Service Role Key es privada. No la compartas públicamente.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                ← Anterior
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!supabaseUrl || !anonKey || !serviceKey}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente: Crear Base de Datos →
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-800 mb-4">
                🗃️ Paso 3: Crear Base de Datos
              </h3>
              <ol className="text-purple-700 space-y-3">
                <li className="flex items-start">
                  <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                  <strong>En tu proyecto Supabase, ve a:</strong> SQL Editor
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                  <div>
                    <strong>Abre el archivo SQL:</strong>
                    <a
                      href="/supabase-setup-production.sql"
                      target="_blank"
                      className="ml-2 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                    >
                      Descargar SQL →
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                  <strong>Copia todo el contenido del archivo</strong>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                  <strong>Pégalo en el SQL Editor de Supabase</strong>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">5</span>
                  <strong>Haz clic en "Run"</strong> para ejecutar el script
                </li>
              </ol>

              <div className="mt-6 p-4 bg-purple-100 rounded">
                <h4 className="font-bold text-purple-800 mb-2">📋 El script creará:</h4>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Tablas: entidades, delegados, casos, auditoría</li>
                  <li>• Usuarios de prueba con credenciales para login</li>
                  <li>• Políticas de seguridad</li>
                  <li>• Índices para mejor rendimiento</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                ← Anterior
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
              >
                Siguiente: Configurar App →
              </button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-800 mb-4">
                ⚡ Paso 4: Configurar Aplicación
              </h3>

              <div className="space-y-4">
                <p className="text-orange-700">
                  <strong>Actualiza el archivo .env.local</strong> con tus claves reales:
                </p>

                <div className="bg-gray-900 text-green-400 p-4 rounded text-sm font-mono">
                  <div className="space-y-1">
                    <div>NEXT_PUBLIC_SUPABASE_URL={supabaseUrl || 'https://tu-proyecto.supabase.co'}</div>
                    <div>NEXT_PUBLIC_SUPABASE_ANON_KEY={anonKey || 'tu-anon-key'}</div>
                    <div>SUPABASE_SERVICE_ROLE_KEY={serviceKey || 'tu-service-role-key'}</div>
                  </div>
                </div>

                <ol className="text-orange-700 space-y-2">
                  <li className="flex items-start">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                    <strong>Abre el archivo:</strong> <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                    <strong>Reemplaza las líneas 16, 19 y 22</strong> con tus claves
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                    <strong>Guarda el archivo</strong>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                    <strong>Reinicia el servidor:</strong> <code className="bg-gray-200 px-2 py-1 rounded">Ctrl+C</code> y luego <code className="bg-gray-200 px-2 py-1 rounded">bun run dev</code>
                  </li>
                </ol>
              </div>

              <div className="mt-6 p-4 bg-orange-100 rounded">
                <p className="text-orange-800 text-sm">
                  💡 <strong>Tip:</strong> Si tienes problemas, copia exactamente las claves sin espacios extra.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                ← Anterior
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
              >
                Siguiente: Probar Conexión →
              </button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                ✅ Paso 5: Probar Conexión
              </h3>

              <div className="space-y-4">
                <p className="text-green-700">
                  <strong>¡Ya casi está!</strong> Ahora vamos a probar que todo funciona:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <a
                    href="/debug-login"
                    className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 text-center block"
                  >
                    <strong>🔧 Página de Diagnóstico</strong>
                    <p className="text-sm mt-1">Probar conexión y crear usuarios</p>
                  </a>

                  <a
                    href="/login-delegados"
                    className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 text-center block"
                  >
                    <strong>🔑 Login Delegados</strong>
                    <p className="text-sm mt-1">Probar el login real</p>
                  </a>
                </div>

                <div className="bg-white p-4 rounded border">
                  <h4 className="font-bold text-gray-900 mb-2">🎯 Credenciales de Prueba:</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Principal:</strong> maria.garcia@clubdeportivo.com / delegado123</p>
                    <p><strong>Suplente:</strong> carlos.rodriguez@clubdeportivo.com / suplente123</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-100 rounded">
                <h4 className="font-bold text-green-800 mb-2">🎉 ¡Configuración Completada!</h4>
                <p className="text-green-700 text-sm">
                  Si todo funciona, Custodia360 estará conectado a tu base de datos real en Supabase.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                ← Anterior
              </button>
              <a
                href="/debug-login"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Probar Ahora →
              </a>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🛠️ Configurar Supabase para Custodia360
          </h1>
          <p className="text-gray-600">
            Guía paso a paso para conectar tu aplicación a una base de datos real
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.id <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.id < currentStep ? '✓' : step.id}
                </div>
                <div className="ml-2 hidden md:block">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-gray-600 hover:text-gray-800"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}
