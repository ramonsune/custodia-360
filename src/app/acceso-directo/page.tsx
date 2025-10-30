'use client'

export default function AccesoDirectoPage() {
  const acceder = (tipo: string) => {
    console.log(`🚀 Accediendo como: ${tipo}`)

    // Limpiar todo
    localStorage.clear()
    sessionStorage.clear()

    // Crear sesión básica
    const session = {
      token: `test_${tipo}_${Date.now()}`,
      role: tipo,
      entityName: 'Test Entity',
      userName: `Usuario ${tipo}`,
      userEmail: `${tipo}@test.com`,
      expiresAt: new Date(Date.now() + 24*60*60*1000).toISOString()
    }

    // Guardar en ambos
    localStorage.setItem('c360:session_token', session.token)
    localStorage.setItem('c360:role', session.role)
    localStorage.setItem('c360:entity_name', session.entityName)
    localStorage.setItem('c360:user_name', session.userName)
    localStorage.setItem('c360:user_email', session.userEmail)
    localStorage.setItem('c360:expires_at', session.expiresAt)

    sessionStorage.setItem('c360:session_token', session.token)
    sessionStorage.setItem('c360:role', session.role)

    console.log('✅ Sesión creada:', session)

    // Redirigir según tipo
    if (tipo === 'ENTIDAD') {
      console.log('→ Redirigiendo a /dashboard-entidad')
      window.location.href = '/dashboard-entidad'
    } else if (tipo === 'DELEGADO') {
      console.log('→ Redirigiendo a /dashboard-delegado')
      window.location.href = '/dashboard-delegado'
    } else if (tipo === 'SUPLENTE') {
      console.log('→ Redirigiendo a /dashboard-delegado')
      window.location.href = '/dashboard-delegado'
    } else if (tipo === 'ADMIN') {
      console.log('→ Redirigiendo a /dashboard-custodia360')
      window.location.href = '/dashboard-custodia360'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            🚀 ACCESO DIRECTO
          </h1>
          <p className="text-xl text-gray-600">
            Click en cualquier botón para acceder instantáneamente
          </p>
          <div className="mt-4 inline-block bg-green-100 border-2 border-green-500 rounded-lg px-4 py-2">
            <p className="text-sm text-green-800 font-bold">
              ✅ Sistema Simplificado - Acceso Garantizado
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => acceder('ENTIDAD')}
            className="group bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-2xl font-bold mb-2">Panel Entidad</h3>
            <p className="text-green-100 text-sm mb-3">Representante Legal / Director</p>
            <div className="text-xs bg-black bg-opacity-20 rounded px-3 py-1">
              → /dashboard-entidad
            </div>
          </button>

          <button
            onClick={() => acceder('DELEGADO')}
            className="group bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="text-6xl mb-4">👨‍💼</div>
            <h3 className="text-2xl font-bold mb-2">Delegado Principal</h3>
            <p className="text-blue-100 text-sm mb-3">Gestión Completa LOPIVI</p>
            <div className="text-xs bg-black bg-opacity-20 rounded px-3 py-1">
              → /dashboard-delegado
            </div>
          </button>

          <button
            onClick={() => acceder('SUPLENTE')}
            className="group bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="text-6xl mb-4">👨‍💼</div>
            <h3 className="text-2xl font-bold mb-2">Delegado Suplente</h3>
            <p className="text-purple-100 text-sm mb-3">Vista de Suplente</p>
            <div className="text-xs bg-black bg-opacity-20 rounded px-3 py-1">
              → /dashboard-delegado
            </div>
          </button>

          <button
            onClick={() => acceder('ADMIN')}
            className="group bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="text-6xl mb-4">⚙️</div>
            <h3 className="text-2xl font-bold mb-2">Admin Custodia360</h3>
            <p className="text-red-100 text-sm mb-3">Panel Administrativo</p>
            <div className="text-xs bg-black bg-opacity-20 rounded px-3 py-1">
              → /dashboard-custodia360
            </div>
          </button>
        </div>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 text-center">
          <p className="text-sm text-blue-900 font-semibold mb-2">
            📍 URL de esta página
          </p>
          <code className="text-lg font-mono bg-white px-4 py-2 rounded border-2 border-blue-200 inline-block">
            /acceso-directo
          </code>
          <p className="text-xs text-blue-700 mt-3">
            Guarda esta URL como favorito para acceso rápido
          </p>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Abre la consola del navegador (F12) para ver logs detallados</p>
        </div>
      </div>
    </div>
  )
}
