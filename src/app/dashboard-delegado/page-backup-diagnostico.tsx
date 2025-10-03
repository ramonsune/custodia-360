'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AlertasPanel from '@/components/AlertasPanel'
import GestionFormaciones from '@/components/GestionFormaciones'
import RegistroPersonal from '@/components/RegistroPersonal'
import HistorialIncidencias from '@/components/HistorialIncidencias'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  permisos: string[]
  certificacionVigente: boolean
  inicioSesion: string
  expiracion: string
}

export default function DashboardDelegadoPrincipal() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [vistaAvanzada, setVistaAvanzada] = useState<'alertas' | 'formaciones' | 'personal' | 'incidencias'>('alertas')
  const [mostrarCentroAyuda, setMostrarCentroAyuda] = useState(false)
  const [modalAyudaActivo, setModalAyudaActivo] = useState<string | null>(null)

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (session) {
      try {
        const data = JSON.parse(session)

        if (data.expiracion && new Date(data.expiracion) <= new Date()) {
          localStorage.removeItem('userSession')
          router.push('/login-delegados')
          return
        }

        if (data.tipo !== 'principal') {
          router.push('/')
          return
        }

        setSessionData(data)
      } catch (error) {
        console.error('Error loading session:', error)
        router.push('/login-delegados')
      }
    } else {
      router.push('/login-delegados')
    }
    setLoading(false)
  }, [router])

  const cerrarTodosLosModales = () => {
    setModalAyudaActivo(null)
  }

  const calcularCumplimiento = () => {
    const elementos = [
      { nombre: 'Plan de Protección Vigente', completado: true },
      { nombre: 'Delegado Principal Certificado', completado: true },
      { nombre: 'Delegado Suplente Certificado', completado: true },
      { nombre: 'Personal Formado en LOPIVI', completado: true },
      { nombre: 'Protocolos Actualizados', completado: true },
      { nombre: 'Canal de Comunicación Activo', completado: true },
      { nombre: 'Registro de Casos Actualizado', completado: true },
      { nombre: 'Auditoría Anual Realizada', completado: false }
    ]

    const completados = elementos.filter(e => e.completado).length
    const porcentaje = Math.round((completados / elementos.length) * 100)

    return { porcentaje, completados, total: elementos.length }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const cumplimiento = calcularCumplimiento()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Custodia360</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {sessionData?.nombre} - Delegado Principal
              </span>
              <button
                onClick={() => router.push('/dashboard-delegado/nuevo-caso')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
              >
                Caso Urgente
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('userSession')
                  router.push('/')
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">{sessionData?.entidad || 'Mi Entidad'}</h2>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Delegado Principal</h1>
          <p className="text-gray-600 mt-2">Panel principal de gestión LOPIVI</p>
        </div>

        {/* Título: Situación de la entidad */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Situación de la entidad</h2>
        </div>

        {/* Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Casos Activos</div>
                <div className="text-2xl font-bold text-red-600">3</div>
              </div>
            </div>
            <div className="text-xs text-red-600 mt-1">Requieren atención</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Cumplimiento LOPIVI</div>
                <div className="text-2xl font-bold text-green-600">{cumplimiento.porcentaje}%</div>
              </div>
            </div>
            <div className="text-xs text-green-600 mt-1">En buen estado</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Personal Formado</div>
                <div className="text-2xl font-bold text-blue-600">85%</div>
              </div>
            </div>
            <div className="text-xs text-blue-600 mt-1">Formación LOPIVI</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Alertas</div>
                <div className="text-2xl font-bold text-orange-600">2</div>
              </div>
            </div>
            <div className="text-xs text-orange-600 mt-1">Pendientes</div>
          </div>
        </div>

        {/* Centro de Ayuda LOPIVI */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Centro de Ayuda LOPIVI - Delegado Principal</h3>
              <p className="text-gray-600">Guías y recursos para el cumplimiento normativo</p>
            </div>
            <button
              onClick={() => setMostrarCentroAyuda(!mostrarCentroAyuda)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mostrarCentroAyuda ? 'Ocultar' : 'Ver Centro de Ayuda'}
            </button>
          </div>

          {mostrarCentroAyuda && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setModalAyudaActivo('fundamentos')
                }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left hover:bg-blue-100 transition-colors"
              >
                <h4 className="font-bold text-blue-900 mb-2">Fundamentos LOPIVI</h4>
                <p className="text-blue-700 text-sm">Qué es la LOPIVI, Plan de Protección y rol del delegado principal</p>
              </button>

              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setModalAyudaActivo('dashboard')
                }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 text-left hover:bg-green-100 transition-colors"
              >
                <h4 className="font-bold text-green-900 mb-2">Uso del Dashboard</h4>
                <p className="text-green-700 text-sm">Cómo navegar y utilizar todas las funciones del panel de control</p>
              </button>

              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setModalAyudaActivo('casos')
                }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 text-left hover:bg-red-100 transition-colors"
              >
                <h4 className="font-bold text-red-900 mb-2">Gestión de Casos</h4>
                <p className="text-red-700 text-sm">Protocolos de actuación, documentación y seguimiento de incidencias</p>
              </button>

              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setModalAyudaActivo('tareas')
                }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left hover:bg-yellow-100 transition-colors"
              >
                <h4 className="font-bold text-yellow-900 mb-2">Tareas Periódicas</h4>
                <p className="text-yellow-700 text-sm">Responsabilidades mensuales, formación y coordinación</p>
              </button>

              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setModalAyudaActivo('faqs')
                }}
                className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left hover:bg-orange-100 transition-colors"
              >
                <h4 className="font-bold text-orange-900 mb-2">Preguntas Frecuentes</h4>
                <p className="text-orange-700 text-sm">Dudas comunes y soluciones rápidas para situaciones habituales</p>
              </button>

              <button
                onClick={() => {
                  cerrarTodosLosModales()
                  setModalAyudaActivo('contactos')
                }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-bold text-gray-900 mb-2">Contactos de Emergencia</h4>
                <p className="text-gray-700 text-sm">Números y recursos importantes para situaciones urgentes</p>
              </button>
            </div>
          )}
        </div>

        {/* Alertas Panel Compacto */}
        <div className="mb-8">
          <AlertasPanel entidadId={sessionData?.entidad || 'default'} compact={true} />
        </div>

        {/* Título: Acciones Rápidas */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Acciones Rápidas</h2>
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Gestión de Casos</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard-delegado/nuevo-caso')}
                className="w-full text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 text-center"
              >
                Nuevo Caso
              </button>
              <button
                onClick={() => router.push('/dashboard-delegado/gestionar-caso')}
                className="w-full text-gray-600 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 text-center"
              >
                Ver Casos Activos
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Alertas y Notificaciones</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard-delegado/alertas')}
                className="w-full text-orange-600 border border-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 text-center"
              >
                Revisar Alertas
              </button>
              <button
                onClick={() => router.push('/dashboard-delegado/resolver-alertas')}
                className="w-full text-yellow-600 border border-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-50 text-center"
              >
                Resolver Alertas
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Comunicación</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard-delegado/comunicacion-personal')}
                className="w-full text-teal-600 border border-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 text-center"
              >
                Personal
              </button>
              <button
                onClick={() => router.push('/dashboard-delegado/comunicacion-familias')}
                className="w-full text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 text-center"
              >
                Familias
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Documentación</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard-delegado/cumplimiento')}
                className="w-full text-green-600 border border-green-600 px-4 py-2 rounded-lg hover:bg-green-50 text-center"
              >
                Estado Cumplimiento
              </button>
              <button
                onClick={() => router.push('/dashboard-delegado/documentos-compartidos')}
                className="w-full text-purple-600 border border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 text-center"
              >
                Documentos
              </button>
            </div>
          </div>
        </div>

        {/* Gestión Avanzada LOPIVI */}
        <div className="mb-4 mt-12">
          <h2 className="text-2xl font-bold text-gray-800">Gestión Avanzada LOPIVI</h2>
          <p className="text-gray-600">Herramientas avanzadas para el cumplimiento normativo</p>
        </div>

        {/* Pestañas de Gestión Avanzada */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setVistaAvanzada('alertas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  vistaAvanzada === 'alertas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sistema de Alertas
              </button>
              <button
                onClick={() => setVistaAvanzada('formaciones')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  vistaAvanzada === 'formaciones'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Formaciones Personal
              </button>
              <button
                onClick={() => setVistaAvanzada('personal')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  vistaAvanzada === 'personal'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Registro Personal
              </button>
              <button
                onClick={() => setVistaAvanzada('incidencias')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  vistaAvanzada === 'incidencias'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Histórico Incidencias
              </button>
            </nav>
          </div>

          <div className="p-6">
            {vistaAvanzada === 'alertas' && (
              <AlertasPanel entidadId={sessionData?.entidad || 'default'} />
            )}

            {vistaAvanzada === 'formaciones' && (
              <GestionFormaciones entidadId={sessionData?.entidad || 'default'} />
            )}

            {vistaAvanzada === 'personal' && (
              <RegistroPersonal entidadId={sessionData?.entidad || 'default'} />
            )}

            {vistaAvanzada === 'incidencias' && (
              <HistorialIncidencias entidadId={sessionData?.entidad || 'default'} />
            )}
          </div>
        </div>
      </main>

      {/* Modales del Centro de Ayuda LOPIVI */}
      {modalAyudaActivo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalAyudaActivo === 'fundamentos' && 'Fundamentos LOPIVI'}
                  {modalAyudaActivo === 'dashboard' && 'Uso del Dashboard'}
                  {modalAyudaActivo === 'casos' && 'Gestión de Casos e Incidencias'}
                  {modalAyudaActivo === 'tareas' && 'Tareas Periódicas del Delegado'}
                  {modalAyudaActivo === 'faqs' && 'Preguntas Frecuentes'}
                  {modalAyudaActivo === 'contactos' && 'Contactos de Emergencia'}
                </h2>
                <button
                  onClick={() => setModalAyudaActivo(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div className="p-6">
              {modalAyudaActivo === 'fundamentos' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">¿Qué es la LOPIVI y por qué existe?</h3>
                    <div className="text-blue-800 space-y-2">
                      <p><strong>La Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia (LOPIVI)</strong> es una normativa española en vigor desde junio de 2021.</p>
                      <p><strong>Objetivo principal:</strong> Garantizar los derechos fundamentales de niños, niñas y adolescentes frente a cualquier forma de violencia.</p>
                      <p><strong>Ámbito de aplicación:</strong> Todas las entidades que trabajen con menores: clubs deportivos, escuelas, campamentos, academias, guarderías, parroquias...</p>
                      <p><strong>Sanciones por incumplimiento:</strong> Multas desde 10.000€ hasta 1.000.000€, cierre temporal o definitivo de la entidad.</p>
                    </div>
                  </div>
                </div>
              )}

              {modalAyudaActivo === 'dashboard' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">Visión general del dashboard</h3>
                    <div className="text-blue-800 space-y-2">
                      <p><strong>Su dashboard es el centro de control</strong> para gestionar el cumplimiento LOPIVI de su entidad.</p>
                      <p><strong>Actualización:</strong> Los datos se actualizan en tiempo real cada vez que realiza acciones.</p>
                      <p><strong>Acceso:</strong> Disponible 24/7 desde cualquier dispositivo con conexión a internet.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Agregar más contenido de modales aquí según sea necesario */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
