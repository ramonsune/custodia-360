'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface EntidadDetallada {
  id: string
  nombre: string
  email_contacto: string
  email_contratante: string
  tipo: string
  estado: 'ACTIVO' | 'PENDIENTE' | 'CANCELADO' | 'ONBOARDING'
  fecha_contratacion: string
  plan: string
  valor_mensual: number
  delegado_principal?: string
  delegado_suplente?: string
  progreso_onboarding: number
  ultimo_pago?: string
  proximo_vencimiento?: string
  telefono?: string
  direccion?: string
  cif?: string
  observaciones?: string
}

export default function EntidadesPage() {
  const [entidades, setEntidades] = useState<EntidadDetallada[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'TODAS' | 'ACTIVO' | 'PENDIENTE' | 'ONBOARDING'>('TODAS')
  const [busqueda, setBusqueda] = useState('')
  const [entidadSeleccionada, setEntidadSeleccionada] = useState<EntidadDetallada | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    cargarEntidades()
  }, [])

  const cargarEntidades = async () => {
    try {
      // Cargar entidades desde Supabase
      const { data: entidadesData } = await supabase
        .from('entidades')
        .select('*')
        .order('created_at', { ascending: false })

      // Cargar delegados para obtener información adicional
      const { data: delegadosData } = await supabase
        .from('delegados')
        .select('*')

      // Transformar datos
      const entidadesTransformadas: EntidadDetallada[] = (entidadesData || []).map(entidad => {
        const delegadoPrincipal = delegadosData?.find(d => d.entidad_id === entidad.id && d.tipo === 'principal')
        const delegadoSuplente = delegadosData?.find(d => d.entidad_id === entidad.id && d.tipo === 'suplente')

        return {
          id: entidad.id,
          nombre: entidad.nombre,
          email_contacto: entidad.email_contacto || entidad.email_contratante,
          email_contratante: entidad.email_contratante,
          tipo: entidad.tipo || 'club-deportivo',
          estado: entidad.activo ? 'ACTIVO' : 'PENDIENTE',
          fecha_contratacion: entidad.created_at,
          plan: entidad.plan || 'Plan 200',
          valor_mensual: entidad.plan === 'Plan 500' ? 198 : 98,
          delegado_principal: delegadoPrincipal?.nombre,
          delegado_suplente: delegadoSuplente?.nombre,
          progreso_onboarding: entidad.activo ? 100 : Math.floor(Math.random() * 80) + 20,
          ultimo_pago: entidad.fecha_ultimo_pago,
          proximo_vencimiento: entidad.fecha_vencimiento,
          telefono: entidad.telefono,
          direccion: entidad.direccion,
          cif: entidad.cif,
          observaciones: entidad.observaciones
        }
      })

      setEntidades(entidadesTransformadas)

    } catch (error) {
      console.error('Error cargando entidades:', error)

      // Datos de ejemplo si falla la conexión
      const entidadesEjemplo: EntidadDetallada[] = [
        {
          id: '1',
          nombre: 'Club Deportivo Los Leones',
          email_contacto: 'contacto@losleones.com',
          email_contratante: 'admin@losleones.com',
          tipo: 'club-deportivo',
          estado: 'ACTIVO',
          fecha_contratacion: new Date().toISOString(),
          plan: 'Plan 200',
          valor_mensual: 98,
          delegado_principal: 'María García López',
          delegado_suplente: 'Carlos Ruiz Martín',
          progreso_onboarding: 100,
          telefono: '666 123 456',
          direccion: 'Calle Deporte, 123, Madrid',
          cif: 'G12345678'
        },
        {
          id: '2',
          nombre: 'Academia Tenis Madrid',
          email_contacto: 'info@tenismadrid.com',
          email_contratante: 'director@tenismadrid.com',
          tipo: 'academia-deportiva',
          estado: 'ONBOARDING',
          fecha_contratacion: new Date(Date.now() - 86400000).toISOString(),
          plan: 'Plan 500',
          valor_mensual: 198,
          progreso_onboarding: 65,
          telefono: '666 654 321',
          direccion: 'Av. Tenis, 45, Madrid',
          cif: 'G98765432'
        }
      ]

      setEntidades(entidadesEjemplo)
    } finally {
      setLoading(false)
    }
  }

  const filtrarEntidades = () => {
    let entidadesFiltradas = entidades

    // Filtro por estado
    if (filtro !== 'TODAS') {
      entidadesFiltradas = entidadesFiltradas.filter(e => e.estado === filtro)
    }

    // Filtro por búsqueda
    if (busqueda.trim()) {
      entidadesFiltradas = entidadesFiltradas.filter(e =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.email_contacto.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.delegado_principal?.toLowerCase().includes(busqueda.toLowerCase())
      )
    }

    return entidadesFiltradas
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVO': return 'bg-green-100 text-green-800'
      case 'ONBOARDING': return 'bg-blue-100 text-blue-800'
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELADO': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const estadisticas = {
    total: entidades.length,
    activas: entidades.filter(e => e.estado === 'ACTIVO').length,
    onboarding: entidades.filter(e => e.estado === 'ONBOARDING').length,
    pendientes: entidades.filter(e => e.estado === 'PENDIENTE').length,
    mrr: entidades.filter(e => e.estado === 'ACTIVO').reduce((sum, e) => sum + e.valor_mensual, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando entidades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard-custodia360" className="text-gray-500 hover:text-gray-700 mr-4">
                ← Volver
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Gestión de Entidades</h1>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              + Nueva Entidad
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Entidades</p>
            <p className="text-2xl font-bold text-blue-600">{estadisticas.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Activas</p>
            <p className="text-2xl font-bold text-green-600">{estadisticas.activas}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Onboarding</p>
            <p className="text-2xl font-bold text-blue-600">{estadisticas.onboarding}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">MRR Total</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(estadisticas.mrr)}</p>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar entidades</label>
              <input
                type="text"
                placeholder="Buscar por nombre, email o delegado..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por estado</label>
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="TODAS">Todas</option>
                <option value="ACTIVO">Activas</option>
                <option value="ONBOARDING">Onboarding</option>
                <option value="PENDIENTE">Pendientes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Entidades */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Entidades ({filtrarEntidades().length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan/Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delegados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtrarEntidades().map(entidad => (
                  <tr key={entidad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{entidad.nombre}</div>
                          <div className="text-sm text-gray-500">{entidad.email_contacto}</div>
                          <div className="text-xs text-gray-400">{entidad.tipo.replace('-', ' ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(entidad.estado)}`}>
                        {entidad.estado}
                      </span>
                      {entidad.progreso_onboarding < 100 && (
                        <div className="mt-1">
                          <div className="w-16 bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-blue-600 h-1 rounded-full"
                              style={{ width: `${entidad.progreso_onboarding}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{entidad.progreso_onboarding}%</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entidad.plan}</div>
                      <div className="text-sm font-bold text-green-600">{formatCurrency(entidad.valor_mensual)}/mes</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {entidad.delegado_principal ? (
                          <div>
                            <div>Principal: {entidad.delegado_principal}</div>
                            {entidad.delegado_suplente && (
                              <div className="text-gray-500">Suplente: {entidad.delegado_suplente}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-red-500">Sin asignar</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(entidad.fecha_contratacion)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setEntidadSeleccionada(entidad)
                          setShowModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Ver
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal de Detalles */}
      {showModal && entidadSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{entidadSeleccionada.nombre}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(entidadSeleccionada.estado)}`}>
                    {entidadSeleccionada.estado}
                  </span>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl p-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Información General</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email contacto:</strong> {entidadSeleccionada.email_contacto}</p>
                    <p><strong>Email contratante:</strong> {entidadSeleccionada.email_contratante}</p>
                    <p><strong>Teléfono:</strong> {entidadSeleccionada.telefono || 'No registrado'}</p>
                    <p><strong>CIF:</strong> {entidadSeleccionada.cif || 'No registrado'}</p>
                    <p><strong>Dirección:</strong> {entidadSeleccionada.direccion || 'No registrada'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Información Comercial</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Plan:</strong> {entidadSeleccionada.plan}</p>
                    <p><strong>Valor mensual:</strong> {formatCurrency(entidadSeleccionada.valor_mensual)}</p>
                    <p><strong>Fecha contratación:</strong> {formatDate(entidadSeleccionada.fecha_contratacion)}</p>
                    <p><strong>Último pago:</strong> {entidadSeleccionada.ultimo_pago ? formatDate(entidadSeleccionada.ultimo_pago) : 'Pendiente'}</p>
                    <p><strong>Próximo vencimiento:</strong> {entidadSeleccionada.proximo_vencimiento ? formatDate(entidadSeleccionada.proximo_vencimiento) : 'No programado'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Delegados de Protección</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800">Delegado Principal</h4>
                    <p className="text-blue-700">{entidadSeleccionada.delegado_principal || 'No asignado'}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800">Delegado Suplente</h4>
                    <p className="text-green-700">{entidadSeleccionada.delegado_suplente || 'No asignado'}</p>
                  </div>
                </div>
              </div>

              {entidadSeleccionada.progreso_onboarding < 100 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Progreso de Onboarding</h3>
                  <div className="bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${entidadSeleccionada.progreso_onboarding}%` }}
                    >
                      {entidadSeleccionada.progreso_onboarding}%
                    </div>
                  </div>
                </div>
              )}

              {entidadSeleccionada.observaciones && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Observaciones</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {entidadSeleccionada.observaciones}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Editar Entidad
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Acceder como Entidad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
