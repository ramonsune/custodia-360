'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DebugNavegacionPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (mensaje: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const newLog = `[${timestamp}] ${mensaje}`
    setLogs(prev => [...prev, newLog])
    console.log(newLog)
  }

  const crearSesionPrincipal = () => {
    addLog('🔧 Creando sesión para delegado principal...')

    const sessionData = {
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

    localStorage.setItem('formacion_lopivi_session', JSON.stringify(sessionData))

    const verificacion = localStorage.getItem('formacion_lopivi_session')
    addLog(`✅ Sesión creada: ${verificacion ? 'SÍ' : 'NO'}`)

    if (verificacion) {
      addLog(`📋 Datos guardados: ${JSON.stringify(JSON.parse(verificacion), null, 2)}`)
    }
  }

  const crearSesionSuplente = () => {
    addLog('🔧 Creando sesión para delegado suplente...')

    const sessionData = {
      id: 'del_suplente_001',
      nombre: 'Carlos',
      apellidos: 'Rodríguez',
      email: 'carlos.rodriguez@clubdeportivo.com',
      tipo: 'suplente',
      entidad: {
        id: 'entidad_del_suplente_001',
        nombre: 'Club Deportivo Los Leones',
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

    localStorage.setItem('formacion_lopivi_session', JSON.stringify(sessionData))

    const verificacion = localStorage.getItem('formacion_lopivi_session')
    addLog(`✅ Sesión creada: ${verificacion ? 'SÍ' : 'NO'}`)
  }

  const navegarConRouter = (ruta: string) => {
    addLog(`🔄 Navegando con router.push a: ${ruta}`)
    router.push(ruta)
  }

  const navegarConWindow = (ruta: string) => {
    addLog(`🔄 Navegando con window.location.href a: ${ruta}`)
    window.location.href = ruta
  }

  const verificarSesion = () => {
    addLog('🔍 Verificando sesiones...')

    const formacionSession = localStorage.getItem('formacion_lopivi_session')
    const userSession = localStorage.getItem('userSession')

    addLog(`📋 formacion_lopivi_session: ${formacionSession ? 'EXISTE' : 'NO EXISTE'}`)
    addLog(`📋 userSession: ${userSession ? 'EXISTE' : 'NO EXISTE'}`)

    if (formacionSession) {
      try {
        const data = JSON.parse(formacionSession)
        addLog(`📄 Datos formación: ${JSON.stringify(data, null, 2)}`)
      } catch (e) {
        addLog(`❌ Error parseando formacion_lopivi_session: ${e}`)
      }
    }

    if (userSession) {
      try {
        const data = JSON.parse(userSession)
        addLog(`📄 Datos usuario: ${JSON.stringify(data, null, 2)}`)
      } catch (e) {
        addLog(`❌ Error parseando userSession: ${e}`)
      }
    }
  }

  const limpiarSesiones = () => {
    addLog('🧹 Limpiando todas las sesiones...')
    localStorage.removeItem('formacion_lopivi_session')
    localStorage.removeItem('userSession')
    addLog('✅ Sesiones limpiadas')
  }

  const limpiarLogs = () => {
    setLogs([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🔧 Debug de Navegación - Páginas de Bienvenida</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel de Controles */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🎛️ Controles de Test</h2>

            <div className="space-y-4">
              {/* Gestión de Sesiones */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Gestión de Sesiones</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={crearSesionPrincipal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    👨‍💼 Sesión Principal
                  </button>
                  <button
                    onClick={crearSesionSuplente}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                  >
                    👥 Sesión Suplente
                  </button>
                  <button
                    onClick={verificarSesion}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm"
                  >
                    🔍 Verificar Sesión
                  </button>
                  <button
                    onClick={limpiarSesiones}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                  >
                    🧹 Limpiar Sesiones
                  </button>
                </div>
              </div>

              {/* Test de Navegación con Router */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Navegación con Router</h3>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => navegarConRouter('/bienvenida-delegado-principal')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
                  >
                    🔄 Router → Bienvenida Principal
                  </button>
                  <button
                    onClick={() => navegarConRouter('/bienvenida-delegado-suplente')}
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm"
                  >
                    🔄 Router → Bienvenida Suplente
                  </button>
                </div>
              </div>

              {/* Test de Navegación con Window */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Navegación con Window</h3>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => navegarConWindow('/bienvenida-delegado-principal')}
                    className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm"
                  >
                    🌐 Window → Bienvenida Principal
                  </button>
                  <button
                    onClick={() => navegarConWindow('/bienvenida-delegado-suplente')}
                    className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 text-sm"
                  >
                    🌐 Window → Bienvenida Suplente
                  </button>
                </div>
              </div>

              {/* Enlaces Directos */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Enlaces Directos</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Link
                    href="/bienvenida-delegado-principal"
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm text-center"
                  >
                    🔗 Link → Bienvenida Principal
                  </Link>
                  <Link
                    href="/bienvenida-delegado-suplente"
                    className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700 text-sm text-center"
                  >
                    🔗 Link → Bienvenida Suplente
                  </Link>
                  <Link
                    href="/login-delegados?tipo=principal"
                    className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 text-sm text-center"
                  >
                    🔐 Login Principal
                  </Link>
                  <Link
                    href="/login-delegados?tipo=suplente"
                    className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900 text-sm text-center"
                  >
                    🔐 Login Suplente
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Logs */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">📋 Logs de Debug</h2>
              <button
                onClick={limpiarLogs}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
              >
                🗑️ Limpiar
              </button>
            </div>

            <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500 italic">No hay logs aún. Ejecuta algún test para ver resultados.</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">📋 Instrucciones de Test</h3>
          <div className="text-blue-800 space-y-2 text-sm">
            <p><strong>1. Test de Sesiones:</strong> Crea una sesión y verifica que se guarde correctamente</p>
            <p><strong>2. Test de Navegación Router:</strong> Usa router.push para navegar a las páginas</p>
            <p><strong>3. Test de Navegación Window:</strong> Usa window.location.href como alternativa</p>
            <p><strong>4. Test de Enlaces Directos:</strong> Usa los enlaces de Next.js para navegación directa</p>
            <p><strong>5. Test de Login:</strong> Usa los enlaces de login para probar el flujo completo</p>
          </div>
        </div>
      </div>
    </div>
  )
}
