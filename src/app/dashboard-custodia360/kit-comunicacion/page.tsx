'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Entity {
  id: string
  nombre: string
  email_contacto: string
  nif_cif: string
  sector_code: string
  kit_comunicacion: boolean
  created_at: string
}

interface ListResponse {
  items: Entity[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface KPIs {
  total: number
  conKit: number
  sinKit: number
  porcentaje: number
}

export default function KitComunicacionAdmin() {
  const router = useRouter()

  // Estados
  const [entities, setEntities] = useState<Entity[]>([])
  const [kpis, setKpis] = useState<KPIs>({ total: 0, conKit: 0, sinKit: 0, porcentaje: 0 })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Filtros
  const [searchQuery, setSearchQuery] = useState('')
  const [estadoFilter, setEstadoFilter] = useState<'all' | 'on' | 'off'>('all')
  const [pageSize, setPageSize] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Modales
  const [modalDetalle, setModalDetalle] = useState<Entity | null>(null)
  const [modalConfirm, setModalConfirm] = useState<{ entity: Entity, action: 'activate' | 'deactivate' } | null>(null)

  // Toast notifications
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  // Cargar datos
  useEffect(() => {
    fetchEntities()
  }, [searchQuery, estadoFilter, pageSize, currentPage])

  const fetchEntities = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        estado: estadoFilter,
        page: currentPage.toString(),
        pageSize: pageSize.toString()
      })

      const response = await fetch(`/api/admin/kit-comm/list?${params}`)
      const data: ListResponse = await response.json()

      if (response.ok) {
        setEntities(data.items)
        setTotal(data.total)
        setTotalPages(data.totalPages)

        // Calcular KPIs
        const conKit = data.items.filter(e => e.kit_comunicacion).length
        const sinKit = data.items.filter(e => !e.kit_comunicacion).length
        const porcentaje = data.total > 0 ? Math.round((conKit / data.total) * 100) : 0

        setKpis({
          total: data.total,
          conKit,
          sinKit,
          porcentaje
        })
      } else {
        showToast('Error al cargar entidades', 'error')
      }
    } catch (error) {
      console.error('Error fetching entities:', error)
      showToast('Error de conexión', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (entity: Entity, newValue: boolean) => {
    setActionLoading(entity.id)
    try {
      const response = await fetch('/api/admin/kit-comm/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId: entity.id, value: newValue })
      })

      const data = await response.json()

      if (response.ok) {
        showToast(data.message, 'success')
        fetchEntities() // Recargar datos
      } else {
        showToast(data.error || 'Error al cambiar estado', 'error')
      }
    } catch (error) {
      console.error('Error toggling kit:', error)
      showToast('Error de conexión', 'error')
    } finally {
      setActionLoading(null)
      setModalConfirm(null)
    }
  }

  const handleSendInvite = async (entity: Entity) => {
    setActionLoading(entity.id)
    try {
      const response = await fetch('/api/admin/kit-comm/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId: entity.id })
      })

      const data = await response.json()

      if (response.ok) {
        showToast('Invitación enviada correctamente', 'success')
      } else {
        showToast(data.error || 'Error al enviar invitación', 'error')
      }
    } catch (error) {
      console.error('Error sending invite:', error)
      showToast('Error de conexión', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/dashboard-entidad`
    navigator.clipboard.writeText(link)
    showToast('Enlace copiado al portapapeles', 'success')
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const getSectorLabel = (code: string) => {
    const sectores: { [key: string]: string } = {
      'club-deportivo': 'Club Deportivo',
      'ludoteca': 'Ludoteca',
      'academia': 'Academia',
      'centro-deportivo': 'Centro Deportivo',
      'general': 'General'
    }
    return sectores[code] || code
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard-custodia360')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Volver
              </button>
              <h1 className="text-xl font-bold text-gray-900">Kit de Comunicación LOPIVI</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border">
            <p className="text-sm text-gray-600 mb-1">Total Entidades</p>
            <p className="text-3xl font-bold text-gray-900">{kpis.total}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <p className="text-sm text-gray-600 mb-1">Con Kit Activo</p>
            <p className="text-3xl font-bold text-green-600">{kpis.conKit}</p>
            <p className="text-xs text-gray-500 mt-1">{kpis.porcentaje}% del total</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <p className="text-sm text-gray-600 mb-1">Sin Kit</p>
            <p className="text-3xl font-bold text-red-600">{kpis.sinKit}</p>
            <p className="text-xs text-gray-500 mt-1">{100 - kpis.porcentaje}% del total</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <p className="text-sm text-gray-600 mb-1">% Adopción</p>
            <p className="text-3xl font-bold text-blue-600">{kpis.porcentaje}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${kpis.porcentaje}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar entidad
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Nombre, NIF/CIF o email..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={estadoFilter}
                onChange={(e) => {
                  setEstadoFilter(e.target.value as 'all' | 'on' | 'off')
                  setCurrentPage(1)
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                <option value="on">Con Kit Activo</option>
                <option value="off">Sin Kit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mostrar
              </label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value))
                  setCurrentPage(1)
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="10">10 por página</option>
                <option value="25">25 por página</option>
                <option value="50">50 por página</option>
                <option value="100">100 por página</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="mt-2">Cargando entidades...</p>
                    </td>
                  </tr>
                ) : entities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No se encontraron entidades
                    </td>
                  </tr>
                ) : (
                  entities.map((entity) => (
                    <tr key={entity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{entity.nombre}</div>
                        <div className="text-xs text-gray-500">{entity.nif_cif}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          {getSectorLabel(entity.sector_code)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.email_contacto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entity.kit_comunicacion ? (
                          <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium">
                            ✓ Activo
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 font-medium">
                            ✗ Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setModalDetalle(entity)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalle"
                          >
                            👁️
                          </button>
                          <button
                            onClick={handleCopyLink}
                            className="text-gray-600 hover:text-gray-900"
                            title="Copiar enlace de contratación"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => handleSendInvite(entity)}
                            disabled={actionLoading === entity.id}
                            className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                            title="Enviar invitación por email"
                          >
                            {actionLoading === entity.id ? '⏳' : '✉️'}
                          </button>
                          <button
                            onClick={() => setModalConfirm({
                              entity,
                              action: entity.kit_comunicacion ? 'deactivate' : 'activate'
                            })}
                            disabled={actionLoading === entity.id}
                            className={`${
                              entity.kit_comunicacion
                                ? 'text-red-600 hover:text-red-900'
                                : 'text-green-600 hover:text-green-900'
                            } disabled:opacity-50`}
                            title={entity.kit_comunicacion ? 'Desactivar' : 'Activar'}
                          >
                            {entity.kit_comunicacion ? '⚠️' : '✓'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {!loading && totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(currentPage * pageSize, total)}</span> de{' '}
                    <span className="font-medium">{total}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      ←
                    </button>
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
                      }
                      return null
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      →
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Detalle */}
      {modalDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Detalle de Entidad</h3>
              <button
                onClick={() => setModalDetalle(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-medium text-gray-900">{modalDetalle.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NIF/CIF</p>
                <p className="font-medium text-gray-900">{modalDetalle.nif_cif}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{modalDetalle.email_contacto}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sector</p>
                <p className="font-medium text-gray-900">{getSectorLabel(modalDetalle.sector_code)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kit de Comunicación</p>
                <p className={`font-medium ${modalDetalle.kit_comunicacion ? 'text-green-600' : 'text-red-600'}`}>
                  {modalDetalle.kit_comunicacion ? '✓ Activo' : '✗ Inactivo'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de alta</p>
                <p className="font-medium text-gray-900">
                  {new Date(modalDetalle.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalDetalle(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación */}
      {modalConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar Acción</h3>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas{' '}
              <strong>{modalConfirm.action === 'activate' ? 'activar' : 'desactivar'}</strong>{' '}
              el Kit de Comunicación LOPIVI para la entidad{' '}
              <strong>{modalConfirm.entity.nombre}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalConfirm(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleToggle(modalConfirm.entity, modalConfirm.action === 'activate')}
                disabled={actionLoading === modalConfirm.entity.id}
                className={`px-4 py-2 rounded-lg text-white ${
                  modalConfirm.action === 'activate'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {actionLoading === modalConfirm.entity.id ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className={`rounded-lg shadow-lg p-4 ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            <p className="font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  )
}
