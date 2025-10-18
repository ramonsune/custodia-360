'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AccesoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const acceder = (tipo: string) => {
    setLoading(tipo)

    // Crear sesión según el tipo
    let sessionData: any = {}
    let destino = '/'

    switch (tipo) {
      case 'entidad':
        sessionData = {
          id: 'entidad_001',
          nombre: 'Director Entidad',
          email: 'director@custodia360.com',
          tipo: 'contratante',
          entidad: 'Club Deportivo Demo',
          permisos: ['ver_dashboard', 'ver_facturacion'],
          certificacionVigente: true,
          inicioSesion: new Date().toISOString()
        }
        destino = '/dashboard-entidad'
        break

      case 'admin':
        sessionData = {
          id: 'admin_001',
          nombre: 'Roberto Suñé',
          email: 'rsune@teamsl.com',
          tipo: 'admin',
          entidad: 'Custodia360',
          permisos: ['admin_total'],
          certificacionVigente: true,
          inicioSesion: new Date().toISOString()
        }
        destino = '/dashboard-custodia360'
        break

      case 'delegado':
        sessionData = {
          id: 'delegado_001',
          user_id: 'delegado_user_001',
          nombre: 'Delegado Certificado',
          email: 'delegado@custodia360.com',
          tipo: 'principal',
          rol: 'delegado_principal',
          entidad: 'Club Deportivo Demo',
          entityId: 'demo_entity_001',
          tipoEntidad: 'club-deportivo',
          permisos: ['ver_casos', 'crear_informes', 'gestionar_personal'],
          formado: true,
          certificacionVigente: true,
          inicioSesion: new Date().toISOString()
        }
        destino = '/dashboard-delegado'
        break

      case 'formacion':
        sessionData = {
          id: 'formacion_001',
          user_id: 'formacion_user_001',
          nombre: 'Nuevo Delegado',
          email: 'formacion@custodia360.com',
          tipo: 'principal',
          rol: 'delegado_principal',
          entidad: 'Entidad Demo',
          entityId: 'demo_entity_formacion',
          sector_code: 'club-deportivo',
          tipoEntidad: 'club-deportivo',
          permisos: ['formacion'],
          certificacionVigente: false,
          inicioSesion: new Date().toISOString()
        }
        console.log('✅ [ACCESO] Sesión de formación creada:', sessionData)
        destino = '/bienvenida-formacion'
        break
    }

    // Guardar sesión
    localStorage.setItem('userSession', JSON.stringify(sessionData))

    // Log para depuración
    console.log('✅ Sesión guardada:', tipo, sessionData)
    console.log('🎯 Redirigiendo a:', destino)

    // Redirigir (aumentado tiempo para asegurar guardado)
    setTimeout(() => {
      router.push(destino)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">🚀 Acceso Custodia360</h1>
          <p className="text-lg text-gray-600">Selecciona tu panel para entrar</p>
        </div>

        {/* Grid de 4 Botones */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* 1. Panel de Entidad */}
          <button
            onClick={() => acceder('entidad')}
            disabled={loading === 'entidad'}
            className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold mb-2">Panel de Entidad</h2>
              <p className="text-blue-100 text-sm mb-4">Acceso para entidades contratantes</p>
              {loading === 'entidad' ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <span className="text-lg font-semibold">→ Entrar</span>
              )}
            </div>
          </button>

          {/* 2. Panel Delegado Principal */}
          <button
            onClick={() => acceder('delegado')}
            disabled={loading === 'delegado'}
            className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-2">Delegado Principal</h2>
              <p className="text-green-100 text-sm mb-4">Panel delegado certificado</p>
              {loading === 'delegado' ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <span className="text-lg font-semibold">→ Entrar</span>
              )}
            </div>
          </button>

          {/* 3. Delegado Principal Nuevo */}
          <button
            onClick={() => acceder('formacion')}
            disabled={loading === 'formacion'}
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-2">Delegado Principal Nuevo</h2>
              <p className="text-yellow-100 text-sm mb-4">Acceso a formación LOPIVI</p>
              {loading === 'formacion' ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <span className="text-lg font-semibold">→ Entrar</span>
              )}
            </div>
          </button>

          {/* 4. Administrador Custodia360 */}
          <button
            onClick={() => acceder('admin')}
            disabled={loading === 'admin'}
            className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold mb-2">Administrador Custodia360</h2>
              <p className="text-purple-100 text-sm mb-4">Panel de administración interno</p>
              {loading === 'admin' ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <span className="text-lg font-semibold">→ Entrar</span>
              )}
            </div>
          </button>

        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            <a href="/" className="text-blue-600 hover:underline">← Volver al inicio</a>
          </p>
        </div>
      </div>
    </div>
  )
}
