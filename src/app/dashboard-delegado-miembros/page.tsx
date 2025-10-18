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
  certificacionVigente: boolean
}

interface MiembroData {
  id: string
  nombre: string
  email: string
  dni: string
  telefono: string
  rol: string
  rolEspecifico: string
  estado: 'no_registrado' | 'registrado' | 'formacion_pendiente' | 'completo'
  fechaRegistro?: string
  fechaFormacion?: string
  antecedentesVigentes: boolean
  fechaVencimientoAntecedentes?: string
}

export default function DashboardDelegadoMiembrosPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [registroConfigurado, setRegistroConfigurado] = useState(false)

  const [estadisticas, setEstadisticas] = useState({
    totalMiembros: 45,
    registrados: 12,
    formacionCompleta: 8,
    pendientesFormacion: 4,
    noRegistrados: 33,
    alertasPendientes: 5,
    antecedentesVencidos: 3
  })

  const [miembrosEjemplo] = useState<MiembroData[]>([
    {
      id: '1',
      nombre: 'Juan Pérez García',
      email: 'juan.perez@email.com',
      dni: '12345678A',
      telefono: '600 123 456',
      rol: 'directo',
      rolEspecifico: 'Entrenador',
      estado: 'completo',
      fechaRegistro: '2024-01-15',
      fechaFormacion: '2024-01-20',
      antecedentesVigentes: true,
      fechaVencimientoAntecedentes: '2025-01-15'
    },
    {
      id: '2',
      nombre: 'María López Martín',
      email: 'maria.lopez@email.com',
      dni: '23456789B',
      telefono: '600 234 567',
      rol: 'indirecto',
      rolEspecifico: 'Secretaria',
      estado: 'formacion_pendiente',
      fechaRegistro: '2024-01-18',
      antecedentesVigentes: false
    },
    {
      id: '3',
      nombre: 'Carlos Ruiz Sánchez',
      email: 'carlos.ruiz@email.com',
      dni: '34567890C',
      telefono: '600 345 678',
      rol: 'directo',
      rolEspecifico: 'Monitor deportivo',
      estado: 'registrado',
      fechaRegistro: '2024-01-22',
      antecedentesVigentes: true,
      fechaVencimientoAntecedentes: '2024-12-01'
    }
  ])

  const checkSession = (): SessionData | null => {
    try {
      const persistentSession = localStorage.getItem('userSession')
      if (persistentSession) {
        return JSON.parse(persistentSession)
      }
      return null
    } catch (error) {
      console.error('Error verificando sesión:', error)
      return null
    }
  }

  useEffect(() => {
    const session = checkSession()
    if (!session) {
      router.push('/login')
      return
    }

    if (!session.certificacionVigente) {
      router.push('/selector-entidad')
      return
    }

    setSessionData(session)

    const configurado = localStorage.getItem('registro_configurado')
    setRegistroConfigurado(!!configurado)

    setLoading(false)
  }, [router])

  const enviarRecordatorio = (tipo: 'registro' | 'formacion') => {
    alert(`Recordatorio enviado para ${tipo === 'registro' ? 'completar registro' : 'completar formación'}`)
  }

  const generarInforme = () => {
    alert('Generando informe de cumplimiento...')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!registroConfigurado) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Configuración pendiente
            </h1>
            <p className="text-gray-600 mb-6">
              Debe configurar el registro de miembros antes de acceder al dashboard de seguimiento.
            </p>
            <Link
              href="/registro-entidad"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Configurar registro de miembros
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Dashboard Delegado - Gestión de Miembros
                </h1>
                <p className="text-sm text-gray-600">
                  {sessionData?.nombre} | {sessionData?.entidad}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard-delegado"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Volver al dashboard principal
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Miembros</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalMiembros}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Registrados</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.registrados}</p>
                <p className="text-xs text-gray-500">
                  {Math.round((estadisticas.registrados / estadisticas.totalMiembros) * 100)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Formación Completa</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.formacionCompleta}</p>
                <p className="text-xs text-gray-500">
                  {Math.round((estadisticas.formacionCompleta / estadisticas.registrados) * 100)}% de registrados
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">🎓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Pendientes</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.alertasPendientes}</p>
                <p className="text-xs text-gray-500">Requieren atención</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold">⚠</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progreso general */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Progreso de Cumplimiento LOPIVI
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Miembros registrados</span>
                <span>{estadisticas.registrados}/{estadisticas.totalMiembros}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{width: `${(estadisticas.registrados / estadisticas.totalMiembros) * 100}%`}}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Formación completada</span>
                <span>{estadisticas.formacionCompleta}/{estadisticas.registrados}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{width: `${(estadisticas.formacionCompleta / estadisticas.registrados) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => enviarRecordatorio('registro')}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 className="font-semibold text-gray-900 mb-1">
                Enviar recordatorio de registro
              </h3>
              <p className="text-sm text-gray-600">
                A los {estadisticas.noRegistrados} miembros pendientes
              </p>
            </button>

            <button
              onClick={() => enviarRecordatorio('formacion')}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 className="font-semibold text-gray-900 mb-1">
                Recordatorio de formación
              </h3>
              <p className="text-sm text-gray-600">
                A los {estadisticas.pendientesFormacion} con formación pendiente
              </p>
            </button>

            <button
              onClick={generarInforme}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 className="font-semibold text-gray-900 mb-1">
                Generar informe
              </h3>
              <p className="text-sm text-gray-600">
                Estado actual de cumplimiento
              </p>
            </button>
          </div>
        </div>

        {/* Lista de miembros */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Lista de Miembros
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Miembro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Antecedentes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {miembrosEjemplo.map((miembro) => (
                  <tr key={miembro.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {miembro.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {miembro.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{miembro.rolEspecifico}</div>
                      <div className="text-sm text-gray-500">
                        {miembro.rol === 'directo' && 'Contacto directo'}
                        {miembro.rol === 'indirecto' && 'Contacto indirecto'}
                        {miembro.rol === 'sincontacto' && 'Sin contacto'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        miembro.estado === 'completo'
                          ? 'bg-green-100 text-green-800'
                          : miembro.estado === 'formacion_pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : miembro.estado === 'registrado'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {miembro.estado === 'completo' && 'Completo'}
                        {miembro.estado === 'formacion_pendiente' && 'Formación pendiente'}
                        {miembro.estado === 'registrado' && 'Registrado'}
                        {miembro.estado === 'no_registrado' && 'No registrado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        miembro.antecedentesVigentes
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {miembro.antecedentesVigentes ? 'Vigentes' : 'Pendientes'}
                      </span>
                      {miembro.fechaVencimientoAntecedentes && (
                        <div className="text-xs text-gray-500 mt-1">
                          Vence: {new Date(miembro.fechaVencimientoAntecedentes).toLocaleDateString('es-ES')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Ver detalles
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Contactar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alertas críticas */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-red-900 mb-3">
            Alertas Críticas
          </h3>
          <div className="space-y-2 text-sm text-red-800">
            <p>• {estadisticas.antecedentesVencidos} miembros con antecedentes penales vencidos</p>
            <p>• {estadisticas.noRegistrados} miembros sin registrar (plazo: 30 días)</p>
            <p>• {estadisticas.pendientesFormacion} miembros con formación pendiente</p>
          </div>
        </div>
      </div>
    </div>
  )
}
