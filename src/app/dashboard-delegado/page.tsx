'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  permisos: string[]
  certificacionVigente: boolean
}

interface DelegadoData {
  nombre: string
  entidad: string
  tipo: 'principal' | 'suplente'
  casosActivos: number
  alertas: number
  estadoCumplimiento: number
  certificacionVigente: boolean
  proximaRenovacion: string
}

export default function DashboardDelegado() {
  const router = useRouter()
  const [delegadoData, setDelegadoData] = useState<DelegadoData | null>(null)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)

  useEffect(() => {
    const cargarDatos = () => {
      try {
        // Recuperar datos de sesión del localStorage o usar ejemplo
        const sessionGuardada = localStorage.getItem('userSession') || localStorage.getItem('userAuth')
        let sessionEjemplo: SessionData

        if (sessionGuardada) {
          const datosSession = JSON.parse(sessionGuardada)
          sessionEjemplo = {
            id: datosSession.id || 'del_001',
            nombre: datosSession.nombre || 'María García López',
            email: datosSession.email || 'maria.garcia@entidad.com',
            tipo: datosSession.tipo || 'principal',
            entidad: datosSession.entidad || 'Club Deportivo Ejemplo',
            permisos: datosSession.permisos || ['gestionar_casos', 'formar_personal', 'generar_reportes'],
            certificacionVigente: datosSession.certificacionVigente !== false
          }
        } else {
          sessionEjemplo = {
            id: 'del_001',
            nombre: 'María García López',
            email: 'maria.garcia@entidad.com',
            tipo: 'principal',
            entidad: 'Club Deportivo Ejemplo',
            permisos: ['gestionar_casos', 'formar_personal', 'generar_reportes'],
            certificacionVigente: true
          }
        }
        setSessionData(sessionEjemplo)

        const datosEjemplo: DelegadoData = {
          nombre: sessionEjemplo.nombre,
          entidad: sessionEjemplo.entidad,
          tipo: sessionEjemplo.tipo,
          casosActivos: 3,
          alertas: 2,
          estadoCumplimiento: 92,
          certificacionVigente: true,
          proximaRenovacion: '2025-12-15'
        }
        setDelegadoData(datosEjemplo)

      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES')
    } catch {
      return dateString
    }
  }

  const descargarCertificado = () => {
    alert('Generando certificado del delegado...')
  }

  const generarPDF = (tipo: string) => {
    alert(`Generando PDF: ${tipo}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard del delegado...</p>
        </div>
      </div>
    )
  }

  if (!delegadoData || !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error de autenticación</p>
          <Link href="/login" className="bg-orange-600 text-white px-4 py-2 rounded-lg">
            Volver al Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Dashboard */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Dashboard Delegado LOPIVI
              </h1>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {sessionData.tipo === 'principal' ? 'Principal' : 'Suplente'}
              </span>
              <span className="ml-2 text-sm text-gray-600">
                {sessionData.entidad}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {sessionData.nombre}
              </span>
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Protocolo Emergencia
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Semáforo de Estado General */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Estado General de Cumplimiento LOPIVI</h2>
              <p className="text-gray-600">Resumen del estado actual de tu entidad</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                delegadoData.estadoCumplimiento >= 90 ? 'bg-green-500' :
                delegadoData.estadoCumplimiento >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {delegadoData.estadoCumplimiento >= 90 ? '✓' :
                 delegadoData.estadoCumplimiento >= 70 ? '!' : '✗'}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{delegadoData.estadoCumplimiento}%</p>
                <p className="text-sm text-gray-600">Cumplimiento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas de resumen rápido */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Casos Activos</h3>
            <p className="text-3xl font-bold text-blue-600">{delegadoData.casosActivos}</p>
            <p className="text-sm text-gray-500">Requieren atención</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Alertas</h3>
            <p className="text-3xl font-bold text-orange-600">{delegadoData.alertas}</p>
            <p className="text-sm text-gray-500">Pendientes</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Cumplimiento</h3>
            <p className="text-3xl font-bold text-green-600">{delegadoData.estadoCumplimiento}%</p>
            <p className="text-sm text-gray-500">LOPIVI</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Certificación</h3>
            <p className="text-lg font-bold text-purple-600">
              {delegadoData.certificacionVigente ? 'Vigente' : 'Vencida'}
            </p>
            <p className="text-sm text-gray-500">
              Renueva: {formatDate(delegadoData.proximaRenovacion)}
            </p>
          </div>
        </div>

        {/* Panel de Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={descargarCertificado}
              className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 text-left"
            >
              <h4 className="font-medium mb-2">Descargar Certificado</h4>
              <p className="text-sm opacity-90">Certificado de formación LOPIVI</p>
            </button>

            <button
              onClick={() => generarPDF('Informe de Cumplimiento')}
              className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 text-left"
            >
              <h4 className="font-medium mb-2">Generar Informe</h4>
              <p className="text-sm opacity-90">Estado de cumplimiento actual</p>
            </button>

            <button
              onClick={() => alert('Próximamente: Gestión de Personal')}
              className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 text-left"
            >
              <h4 className="font-medium mb-2">Gestión de Personal</h4>
              <p className="text-sm opacity-90">Control de formaciones y certificados</p>
            </button>
          </div>
        </div>

        {/* Información de la Entidad */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Información de la Entidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Delegado {sessionData.tipo === 'principal' ? 'Principal' : 'Suplente'}</h4>
              <p className="text-gray-900 font-medium">{sessionData.nombre}</p>
              <p className="text-gray-600 text-sm">{sessionData.email}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Entidad</h4>
              <p className="text-gray-900 font-medium">{sessionData.entidad}</p>
              <p className="text-gray-600 text-sm">Estado: Activa</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Protocolo de Emergencia */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Protocolo de Emergencia</h3>
              <p className="text-gray-600">Selecciona el tipo de situación:</p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => alert('Activando protocolo de incidente crítico...')}
                className="w-full bg-red-600 text-white p-4 rounded-lg font-medium hover:bg-red-700 transition-colors text-left"
              >
                <h4 className="font-bold mb-1">Incidente Crítico</h4>
                <p className="text-sm opacity-90">Activar protocolo inmediato</p>
              </button>
              <button
                onClick={() => alert('Iniciando evaluación de riesgo...')}
                className="w-full bg-orange-500 text-white p-4 rounded-lg font-medium hover:bg-orange-600 transition-colors text-left"
              >
                <h4 className="font-bold mb-1">Situación de Riesgo</h4>
                <p className="text-sm opacity-90">Requiere valoración</p>
              </button>
              <button
                onClick={() => alert('Abriendo directorio de contactos de emergencia...')}
                className="w-full bg-blue-600 text-white p-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-left"
              >
                <h4 className="font-bold mb-1">Contactar Autoridades</h4>
                <p className="text-sm opacity-90">Comunicación oficial</p>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
