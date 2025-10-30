'use client'

import { saveSession, clearSession } from '@/lib/auth/session'

export default function TestAccessPage() {
  const accesoDirecto = (tipo: string) => {
    console.log(`🚀 Acceso directo iniciado: ${tipo}`)

    clearSession()

    if (tipo === 'entidad') {
      saveSession({
        token: 'test_entidad_' + Date.now(),
        role: 'ENTIDAD',
        entity: 'Club Deportivo Test',
        isDemo: true,
        userId: 'cont_001',
        userName: 'Director Test',
        userEmail: 'director@test.com'
      })
      console.log('✅ Sesión ENTIDAD guardada')
      window.location.href = '/dashboard-entidad'

    } else if (tipo === 'principal') {
      saveSession({
        token: 'test_principal_' + Date.now(),
        role: 'DELEGADO',
        entity: 'Club Deportivo Test',
        isDemo: true,
        userId: 'del_001',
        userName: 'Juan García (Principal)',
        userEmail: 'principal@test.com'
      })
      console.log('✅ Sesión DELEGADO guardada')
      window.location.href = '/dashboard-delegado'

    } else if (tipo === 'suplente') {
      saveSession({
        token: 'test_suplente_' + Date.now(),
        role: 'SUPLENTE',
        entity: 'Club Deportivo Test',
        isDemo: true,
        userId: 'del_002',
        userName: 'María López (Suplente)',
        userEmail: 'suplente@test.com'
      })
      console.log('✅ Sesión SUPLENTE guardada')
      window.location.href = '/dashboard-delegado'

    } else if (tipo === 'admin') {
      saveSession({
        token: 'test_admin_' + Date.now(),
        role: 'ADMIN',
        entity: 'Custodia360 Admin',
        isDemo: true,
        userId: 'admin_001',
        userName: 'Administrador Custodia360',
        userEmail: 'admin@custodia360.com'
      })
      console.log('✅ Sesión ADMIN guardada')
      window.location.href = '/dashboard-custodia360'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 ACCESO DIRECTO A PANELES
          </h1>
          <p className="text-gray-600">Haz click en cualquier botón para acceder instantáneamente</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Botón 1: Panel Entidad */}
          <button
            onClick={() => accesoDirecto('entidad')}
            className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-5xl">🏢</span>
              <span className="text-sm opacity-75">→ /dashboard-entidad</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Panel Entidad</h3>
            <p className="text-sm opacity-90">Vista de responsable/director</p>
          </button>

          {/* Botón 2: Delegado Principal */}
          <button
            onClick={() => accesoDirecto('principal')}
            className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-5xl">👨‍💼</span>
              <span className="text-sm opacity-75">→ /dashboard-delegado</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Delegado Principal</h3>
            <p className="text-sm opacity-90">Gestión completa LOPIVI</p>
          </button>

          {/* Botón 3: Delegado Suplente */}
          <button
            onClick={() => accesoDirecto('suplente')}
            className="group bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-5xl">👨‍💼</span>
              <span className="text-sm opacity-75">→ /dashboard-delegado</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Delegado Suplente</h3>
            <p className="text-sm opacity-90">Vista de suplente</p>
          </button>

          {/* Botón 4: Admin Custodia360 */}
          <button
            onClick={() => accesoDirecto('admin')}
            className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-5xl">⚙️</span>
              <span className="text-sm opacity-75">→ /dashboard-custodia360</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Admin Custodia360</h3>
            <p className="text-sm opacity-90">Panel administrativo</p>
          </button>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Modo Prueba:</strong> Estas sesiones son de demostración.
              Se crean automáticamente al hacer click en cada botón.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
