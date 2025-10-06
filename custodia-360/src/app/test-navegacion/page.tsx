'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TestNavegacionPage() {
  const router = useRouter()
  const [resultados, setResultados] = useState<string[]>([])
  const [testing, setTesting] = useState(false)

  const log = (mensaje: string) => {
    setResultados(prev => [...prev, `${new Date().toLocaleTimeString()} - ${mensaje}`])
    console.log('🧪 TEST:', mensaje)
  }

  const testNavegacion = async () => {
    setTesting(true)
    setResultados([])

    log('🚀 Iniciando test de navegación...')

    // Test 1: Simular login delegado principal nuevo
    log('📝 Test 1: Simulando login delegado principal nuevo')

    try {
      const usuarioTest = {
        id: 'del_principal_002',
        nombre: 'Juan',
        apellidos: 'Pedro Delegado',
        email: 'nuevo.delegado@demo.com',
        tipo: 'principal',
        entidad: {
          id: 'entidad_del_principal_002',
          nombre: 'Entidad Demo Nueva',
          tipo_entidad: 'deportivo',
          plan: 'Plan Demo'
        },
        certificado_penales: false,
        estado: 'activo',
        permisos: ['ver_casos', 'gestionar_casos', 'ver_informes'],
        certificacionVigente: false,
        formacionCompletada: false,
        tipoEntidad: 'deportivo',
        inicioSesion: new Date().toISOString(),
        login_type: 'login_delegados'
      }

      // Limpiar sesiones previas
      localStorage.removeItem('userSession')
      localStorage.removeItem('formacion_lopivi_session')
      log('🧹 Sesiones anteriores limpiadas')

      // Crear sesión como si fuera el login
      localStorage.setItem('formacion_lopivi_session', JSON.stringify(usuarioTest))
      log('💾 Sesión de formación LOPIVI creada')

      // Verificar que se guardó
      const sessionGuardada = localStorage.getItem('formacion_lopivi_session')
      log(`✅ Sesión verificada: ${sessionGuardada ? 'ENCONTRADA' : 'NO ENCONTRADA'}`)

      // Test navegación a bienvenida
      log('🔄 Navegando a /bienvenida-delegado-principal...')

      // Esperar un poco antes de navegar
      setTimeout(() => {
        router.push('/bienvenida-delegado-principal')
        log('📍 Navegación ejecutada')
      }, 1000)

    } catch (error) {
      log(`❌ Error en test: ${error}`)
    }

    setTesting(false)
  }

  const testDirecto = () => {
    log('🎯 Test directo: navegando a test-evaluacion')
    router.push('/test-evaluacion')
  }

  const limpiarSesiones = () => {
    localStorage.removeItem('userSession')
    localStorage.removeItem('formacion_lopivi_session')
    log('🧹 Todas las sesiones limpiadas')
  }

  const verificarSesiones = () => {
    const userSession = localStorage.getItem('userSession')
    const formacionSession = localStorage.getItem('formacion_lopivi_session')

    log(`📋 userSession: ${userSession ? 'EXISTE' : 'NO EXISTE'}`)
    log(`📋 formacion_lopivi_session: ${formacionSession ? 'EXISTE' : 'NO EXISTE'}`)

    if (userSession) {
      try {
        const data = JSON.parse(userSession)
        log(`📋 userSession data: ${JSON.stringify(data, null, 2)}`)
      } catch (e) {
        log('❌ Error parseando userSession')
      }
    }

    if (formacionSession) {
      try {
        const data = JSON.parse(formacionSession)
        log(`📋 formacion_lopivi_session data: ${JSON.stringify(data, null, 2)}`)
      } catch (e) {
        log('❌ Error parseando formacion_lopivi_session')
      }
    }
  }

  // Verificar sesiones al cargar
  useEffect(() => {
    verificarSesiones()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🧪 Test de Navegación</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Controles de Test</h2>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={testNavegacion}
              disabled={testing}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {testing ? 'Ejecutando...' : '🧪 Test Login Delegado Principal'}
            </button>

            <button
              onClick={testDirecto}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              🎯 Test Directo a Evaluación
            </button>

            <button
              onClick={verificarSesiones}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              📋 Verificar Sesiones
            </button>

            <button
              onClick={limpiarSesiones}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              🧹 Limpiar Sesiones
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/login-delegados?tipo=principal"
              className="bg-gray-600 text-white px-4 py-2 rounded text-center hover:bg-gray-700"
            >
              🔐 Login Delegados Principal
            </Link>

            <Link
              href="/bienvenida-delegado-principal"
              className="bg-orange-600 text-white px-4 py-2 rounded text-center hover:bg-orange-700"
            >
              👋 Bienvenida Principal
            </Link>

            <Link
              href="/test-evaluacion"
              className="bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700"
            >
              📝 Test Evaluación
            </Link>

            <Link
              href="/formacion-lopivi"
              className="bg-teal-600 text-white px-4 py-2 rounded text-center hover:bg-teal-700"
            >
              🎓 Formación LOPIVI
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Resultados del Test</h2>

          <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto">
            {resultados.length === 0 ? (
              <p className="text-gray-500 italic">No hay resultados aún. Ejecuta un test para ver los logs.</p>
            ) : (
              resultados.map((resultado, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {resultado}
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setResultados([])}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              🗑️ Limpiar Log
            </button>

            <Link
              href="/debug-navegacion"
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mr-2"
            >
              🔧 Debug Avanzado
            </Link>
            <Link
              href="/"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              🏠 Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
