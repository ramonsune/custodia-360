'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Contacto {
  id: string
  nombre: string
  email: string
  telefono?: string
  empresa?: string
  mensaje: string
  estado: 'pendiente' | 'respondido' | 'archivado'
  fecha_creacion: string
  fecha_respuesta?: string
  notas_internas?: string
}

export default function ContactosPage() {
  const router = useRouter()
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pendiente' | 'respondido' | 'archivado'>('todos')
  const [contactoSeleccionado, setContactoSeleccionado] = useState<Contacto | null>(null)
  const [notasInternas, setNotasInternas] = useState('')

  // Verificar autenticación
  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('adminAuth')
      if (!adminAuth) {
        router.push('/admin-custodia360')
        return false
      }
      const auth = JSON.parse(adminAuth)
      if (auth.email !== 'rsune@teamsml.com') {
        router.push('/admin-custodia360')
        return false
      }
      return true
    }

    if (checkAuth()) {
      cargarContactos()
    }
  }, [router])

  const cargarContactos = async () => {
    setLoading(true)
    try {
      const url = filtroEstado === 'todos'
        ? '/api/contacto'
        : `/api/contacto?estado=${filtroEstado}`

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setContactos(data.contactos || [])
      }
    } catch (error) {
      console.error('Error cargando contactos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarContactos()
  }, [filtroEstado])

  const actualizarEstado = async (contactoId: string, nuevoEstado: string, notas?: string) => {
    try {
      const response = await fetch(`/api/contacto/${contactoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: nuevoEstado,
          notas_internas: notas,
          fecha_respuesta: nuevoEstado === 'respondido' ? new Date().toISOString() : undefined
        })
      })

      if (response.ok) {
        cargarContactos()
        setContactoSeleccionado(null)
        setNotasInternas('')
      }
    } catch (error) {
      console.error('Error actualizando contacto:', error)
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard-custodia360" className="text-gray-600 hover:text-gray-900">
                ← Volver
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Contactos</h1>
                <p className="text-sm text-gray-600">Mensajes del formulario de contacto</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Admin Custodia360</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => setFiltroEstado('todos')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtroEstado === 'todos'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos ({contactos.length})
              </button>
              <button
                onClick={() => setFiltroEstado('pendiente')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtroEstado === 'pendiente'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setFiltroEstado('respondido')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtroEstado === 'respondido'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Respondidos
              </button>
              <button
                onClick={() => setFiltroEstado('archivado')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtroEstado === 'archivado'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Archivados
              </button>
            </div>
            <button
              onClick={cargarContactos}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Lista de contactos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando contactos...</p>
          </div>
        ) : contactos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600">No hay contactos {filtroEstado !== 'todos' ? filtroEstado + 's' : ''}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contactos.map((contacto) => (
                    <tr key={contacto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatearFecha(contacto.fecha_creacion)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{contacto.nombre}</div>
                        {contacto.telefono && (
                          <div className="text-sm text-gray-500">{contacto.telefono}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contacto.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {contacto.empresa || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          contacto.estado === 'pendiente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : contacto.estado === 'respondido'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {contacto.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setContactoSeleccionado(contacto)
                            setNotasInternas(contacto.notas_internas || '')
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {contactoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Detalles del Contacto</h2>
                <button
                  onClick={() => setContactoSeleccionado(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre</label>
                  <p className="text-gray-900">{contactoSeleccionado.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{contactoSeleccionado.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Teléfono</label>
                  <p className="text-gray-900">{contactoSeleccionado.telefono || 'No proporcionado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Empresa</label>
                  <p className="text-gray-900">{contactoSeleccionado.empresa || 'No proporcionada'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Mensaje</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{contactoSeleccionado.mensaje}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Notas internas</label>
                <textarea
                  value={notasInternas}
                  onChange={(e) => setNotasInternas(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  rows={3}
                  placeholder="Añade notas internas sobre este contacto..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Estado actual</label>
                <p className="text-gray-900 capitalize">{contactoSeleccionado.estado}</p>
              </div>

              <div className="flex gap-3 pt-4">
                {contactoSeleccionado.estado !== 'respondido' && (
                  <button
                    onClick={() => actualizarEstado(contactoSeleccionado.id, 'respondido', notasInternas)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Marcar como Respondido
                  </button>
                )}
                {contactoSeleccionado.estado !== 'archivado' && (
                  <button
                    onClick={() => actualizarEstado(contactoSeleccionado.id, 'archivado', notasInternas)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Archivar
                  </button>
                )}
                {contactoSeleccionado.estado !== 'pendiente' && (
                  <button
                    onClick={() => actualizarEstado(contactoSeleccionado.id, 'pendiente', notasInternas)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Marcar como Pendiente
                  </button>
                )}
                <a
                  href={`mailto:${contactoSeleccionado.email}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Responder por Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
