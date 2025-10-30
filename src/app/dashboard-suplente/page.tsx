'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DemoBadge } from '@/components/demo/DemoBadge'
import { GuideButton } from '@/components/guide/GuideButton'
import { getSession, isExpired } from '@/lib/auth/session'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'suplente'
  entidad: string
  entidadId: string
  permisos: string[]
  delegadoPrincipal: string
}

interface Caso {
  id: string
  titulo: string
  estado: 'activo' | 'resuelto'
  prioridad: 'alta' | 'media' | 'baja'
  fechaCreacion: string
}

export default function DashboardDelegadoSuplente() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [casos, setCasos] = useState<Caso[]>([])

  useEffect(() => {
    const session = getSession()

    // Verificar sesión existe y no ha expirado
    if (!session.token || isExpired()) {
      console.warn('⚠️ Dashboard Suplente: Sin sesión válida')
      router.push('/login')
      return
    }

    // Verificar rol autorizado (SUPLENTE o DELEGADO)
    if (!['SUPLENTE', 'DELEGADO'].includes(session.role)) {
      console.warn('⚠️ Dashboard Suplente: Rol no autorizado:', session.role)
      router.push('/login')
      return
    }

    console.log('✅ Dashboard Suplente: Sesión válida para', session.role)

    // Mapear sesión unificada a estado local
    const mappedSession: SessionData = {
      id: session.userId || session.token,
      nombre: session.userName || 'Delegado Suplente',
      email: session.userEmail || '',
      tipo: 'suplente',
      entidad: session.entityName || 'Entidad',
      entidadId: session.entityId || '',
      permisos: ['canal_seguro', 'incidentes', 'protocolos_lectura', 'formacion_lectura'],
      delegadoPrincipal: 'Delegado Principal' // TODO: Cargar de Supabase
    }

    setSessionData(mappedSession)

    // Simular casos activos (en producción vendría de Supabase)
    setCasos([
      {
        id: '1',
        titulo: 'Incidente en vestuario',
        estado: 'activo',
        prioridad: 'alta',
        fechaCreacion: new Date().toISOString()
      },
      {
        id: '2',
        titulo: 'Seguimiento formación personal',
        estado: 'activo',
        prioridad: 'media',
        fechaCreacion: new Date(Date.now() - 86400000).toISOString()
      }
    ])

    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de suplente...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* BANNER SUPERIOR FIJO - SUPLENCIA ACTIVA */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-3 px-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-sm">
              Suplencia activada por Dirección. Permisos limitados. Todas tus acciones quedan registradas.
            </span>
          </div>
          <div className="text-xs bg-black bg-opacity-20 px-3 py-1 rounded-full">
            Delegado Principal: <strong>{sessionData?.delegadoPrincipal}</strong>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Panel Delegado Suplente</h1>
              <span className="ml-4 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                Modo Suplencia
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <DemoBadge />
              <span className="text-sm text-gray-600">{sessionData?.nombre}</span>
              <span className="text-sm text-gray-500">{sessionData?.entidad}</span>
              <GuideButton
                role="SUPLENTE"
                userEmail={sessionData?.email || ''}
                userName={sessionData?.nombre || ''}
                entidad={sessionData?.entidad}
                userId={sessionData?.id}
              />
              <button
                onClick={() => router.push('/login')}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Casos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{casos.filter(c => c.estado === 'activo').length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Casos Resueltos</p>
                <p className="text-2xl font-bold text-gray-900">{casos.filter(c => c.estado === 'resuelto').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mensajes Canal</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estado Sistema</p>
                <p className="text-sm font-bold text-green-600">Operativo</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Grid de Módulos - Permisos Aplicados */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Canal Seguro - ACCESO COMPLETO */}
          <Link
            href="/dashboard-suplente/canal-seguro"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                </svg>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Acceso Completo</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Canal Seguro</h3>
            <p className="text-sm text-gray-600">Leer, clasificar, responder y escalar comunicaciones</p>
          </Link>

          {/* Incidentes - ACCESO COMPLETO */}
          <Link
            href="/dashboard-suplente/incidentes"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Acceso Completo</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Gestión de Incidentes</h3>
            <p className="text-sm text-gray-600">Crear, actualizar y cerrar incidentes</p>
          </Link>

          {/* Protocolos - SOLO LECTURA */}
          <button
            className="bg-white rounded-lg shadow p-6 border-2 border-gray-300 opacity-75 cursor-not-allowed text-left"
            title="Solo lectura - Suplente no puede modificar"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Solo Lectura</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Protocolos y Documentos</h3>
            <p className="text-sm text-gray-600">Consulta de protocolos operativos</p>
          </button>

          {/* Formación - SOLO LECTURA */}
          <button
            className="bg-white rounded-lg shadow p-6 border-2 border-gray-300 opacity-75 cursor-not-allowed text-left"
            title="Solo lectura - Suplente no puede modificar"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                </svg>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Solo Lectura</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Formación del Personal</h3>
            <p className="text-sm text-gray-600">Consulta de formaciones y asistencias</p>
          </button>

          {/* Auditorías - BLOQUEADO */}
          <button
            className="bg-white rounded-lg shadow p-6 border-2 border-red-300 opacity-50 cursor-not-allowed text-left"
            title="Bloqueado - Reservado al Delegado Principal"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Bloqueado</span>
            </div>
            <h3 className="text-lg font-bold text-gray-400 mb-2">Auditorías y Certificados</h3>
            <p className="text-sm text-gray-500">Acción reservada al Delegado Principal</p>
          </button>

          {/* Configuración - BLOQUEADO */}
          <button
            className="bg-white rounded-lg shadow p-6 border-2 border-red-300 opacity-50 cursor-not-allowed text-left"
            title="Bloqueado - Reservado al Delegado Principal"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Bloqueado</span>
            </div>
            <h3 className="text-lg font-bold text-gray-400 mb-2">Configuración del Sistema</h3>
            <p className="text-sm text-gray-500">Acción reservada al Delegado Principal</p>
          </button>
        </div>

        {/* Casos Activos */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Casos Activos Asignados</h2>
          </div>
          <div className="p-6">
            {casos.filter(c => c.estado === 'activo').length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay casos activos asignados</p>
            ) : (
              <div className="space-y-4">
                {casos.filter(c => c.estado === 'activo').map(caso => (
                  <div key={caso.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{caso.titulo}</h3>
                        <p className="text-sm text-gray-500">Creado: {new Date(caso.fechaCreacion).toLocaleDateString('es-ES')}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          caso.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                          caso.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {caso.prioridad}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info de Auditoría */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Sistema de Auditoría Activo</h3>
              <p className="text-blue-800 text-sm">
                Todas las acciones que realices como Delegado Suplente quedan registradas en el sistema de auditoría con marca "modo: suplencia".
                El Delegado Principal y la Dirección pueden revisar en cualquier momento el historial completo de actividad.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
