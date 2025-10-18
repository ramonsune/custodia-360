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

interface MiembroFormacion {
  id: string
  nombre: string
  apellidos: string
  dni: string
  email: string
  telefono?: string
  categoria: 'personal_con_contacto' | 'personal_sin_contacto' | 'familiar'
  rol?: string
  relacion_menor?: string
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'vencido'
  progreso: number
  fecha_acceso: string
  fecha_completado?: string
  nota_test?: number
  certificado_generado: boolean
  antecedentes_validados?: boolean
  fecha_vencimiento?: string
}

export default function MiembrosActivosPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [miembros, setMiembros] = useState<MiembroFormacion[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState<'todas' | 'personal_con_contacto' | 'personal_sin_contacto' | 'familiar'>('todas')
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pendiente' | 'en_proceso' | 'completado' | 'vencido'>('todos')
  const [linkGenerado, setLinkGenerado] = useState('')
  const [mostrandoLink, setMostrandoLink] = useState(false)

  const checkSession = (): SessionData | null => {
    try {
      const persistentSession = localStorage.getItem('userSession')
      if (persistentSession) {
        const session = JSON.parse(persistentSession)
        if (new Date(session.expiracion) > new Date()) {
          return session
        }
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
      router.push('/formacion-delegado')
      return
    }

    setSessionData(session)
    cargarMiembros()
    setLoading(false)
  }, [router])

  const cargarMiembros = () => {
    // Simular carga de miembros registrados
    const miembrosSimulados: MiembroFormacion[] = [
      // Personal con contacto
      {
        id: 'pc_001',
        nombre: 'Carlos',
        apellidos: 'Rodríguez García',
        dni: '12345678A',
        email: 'carlos.rodriguez@email.com',
        telefono: '600123456',
        categoria: 'personal_con_contacto',
        rol: 'Entrenador Principal',
        estado: 'completado',
        progreso: 100,
        fecha_acceso: '2024-01-15T10:30:00Z',
        fecha_completado: '2024-01-15T12:45:00Z',
        nota_test: 85,
        certificado_generado: true,
        antecedentes_validados: true,
        fecha_vencimiento: '2026-01-15'
      },
      {
        id: 'pc_002',
        nombre: 'María',
        apellidos: 'López Martín',
        dni: '87654321B',
        email: 'maria.lopez@email.com',
        telefono: '600234567',
        categoria: 'personal_con_contacto',
        rol: 'Monitor Deportivo',
        estado: 'en_proceso',
        progreso: 65,
        fecha_acceso: '2024-01-20T09:15:00Z',
        certificado_generado: false,
        antecedentes_validados: true
      },
      {
        id: 'pc_003',
        nombre: 'Ana',
        apellidos: 'Sánchez Ruiz',
        dni: '11223344C',
        email: 'ana.sanchez@email.com',
        categoria: 'personal_con_contacto',
        rol: 'Fisioterapeuta',
        estado: 'pendiente',
        progreso: 0,
        fecha_acceso: '2024-01-22T14:20:00Z',
        certificado_generado: false,
        antecedentes_validados: false
      },
      // Personal sin contacto
      {
        id: 'ps_001',
        nombre: 'Juan',
        apellidos: 'Pérez González',
        dni: '55667788D',
        email: 'juan.perez@email.com',
        telefono: '600345678',
        categoria: 'personal_sin_contacto',
        rol: 'Administrativo',
        estado: 'completado',
        progreso: 100,
        fecha_acceso: '2024-01-16T11:00:00Z',
        fecha_completado: '2024-01-16T11:45:00Z',
        nota_test: 78,
        certificado_generado: true,
        fecha_vencimiento: '2026-01-16'
      },
      {
        id: 'ps_002',
        nombre: 'Laura',
        apellidos: 'García Vega',
        dni: '99887766E',
        email: 'laura.garcia@email.com',
        categoria: 'personal_sin_contacto',
        rol: 'Personal de Limpieza',
        estado: 'en_proceso',
        progreso: 40,
        fecha_acceso: '2024-01-21T16:30:00Z',
        certificado_generado: false
      },
      // Familiares
      {
        id: 'f_001',
        nombre: 'Pedro',
        apellidos: 'Martín López',
        dni: '44556677F',
        email: 'pedro.martin@email.com',
        telefono: '600456789',
        categoria: 'familiar',
        relacion_menor: 'Padre de Diego Martín',
        estado: 'completado',
        progreso: 100,
        fecha_acceso: '2024-01-18T17:00:00Z',
        fecha_completado: '2024-01-18T17:20:00Z',
        nota_test: 70,
        certificado_generado: true,
        fecha_vencimiento: '2025-01-18'
      },
      {
        id: 'f_002',
        nombre: 'Carmen',
        apellidos: 'Ruiz Hernández',
        dni: '33445566G',
        email: 'carmen.ruiz@email.com',
        categoria: 'familiar',
        relacion_menor: 'Madre de Pablo Ruiz',
        estado: 'pendiente',
        progreso: 0,
        fecha_acceso: '2024-01-23T19:45:00Z',
        certificado_generado: false
      }
    ]

    setMiembros(miembrosSimulados)
  }

  const generarLinkFormacion = () => {
    if (!sessionData) return

    const baseUrl = 'https://custodia360.com/formacion-lopivi/personal'
    const link = `${baseUrl}?entidad=${encodeURIComponent(sessionData.entidad)}&delegado=${encodeURIComponent(sessionData.nombre)}&id=${sessionData.id}`
    setLinkGenerado(link)
    setMostrandoLink(true)
  }

  const copiarLink = () => {
    navigator.clipboard.writeText(linkGenerado)
    alert('Link copiado al portapapeles')
  }

  const compartirPor = (plataforma: string) => {
    const mensaje = `🔒 FORMACIÓN LOPIVI OBLIGATORIA
${sessionData?.entidad}

TODOS los miembros deben completar su formación:
${linkGenerado}

Delegado de Protección: ${sessionData?.nombre}

Selecciona tu categoría y completa la formación correspondiente.`

    let url = ''
    switch (plataforma) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`
        break
      case 'email':
        url = `mailto:?subject=Formación LOPIVI Obligatoria - ${sessionData?.entidad}&body=${encodeURIComponent(mensaje)}`
        break
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(linkGenerado)}&text=${encodeURIComponent(`Formación LOPIVI - ${sessionData?.entidad}`)}`
        break
    }

    if (url) {
      window.open(url, '_blank')
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completado':
        return 'bg-green-100 text-green-800'
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800'
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'vencido':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'personal_con_contacto':
        return 'bg-red-100 text-red-800'
      case 'personal_sin_contacto':
        return 'bg-green-100 text-green-800'
      case 'familiar':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoriaLabel = (categoria: string) => {
    switch (categoria) {
      case 'personal_con_contacto':
        return 'Personal con Contacto'
      case 'personal_sin_contacto':
        return 'Personal sin Contacto'
      case 'familiar':
        return 'Familiar'
      default:
        return categoria
    }
  }

  const miembrosFiltrados = miembros.filter(miembro => {
    const matchCategoria = filtroCategoria === 'todas' || miembro.categoria === filtroCategoria
    const matchEstado = filtroEstado === 'todos' || miembro.estado === filtroEstado
    return matchCategoria && matchEstado
  })

  const estadisticas = {
    total: miembros.length,
    personal_con_contacto: {
      total: miembros.filter(m => m.categoria === 'personal_con_contacto').length,
      completados: miembros.filter(m => m.categoria === 'personal_con_contacto' && m.estado === 'completado').length,
      pendientes: miembros.filter(m => m.categoria === 'personal_con_contacto' && m.estado === 'pendiente').length,
      en_proceso: miembros.filter(m => m.categoria === 'personal_con_contacto' && m.estado === 'en_proceso').length
    },
    personal_sin_contacto: {
      total: miembros.filter(m => m.categoria === 'personal_sin_contacto').length,
      completados: miembros.filter(m => m.categoria === 'personal_sin_contacto' && m.estado === 'completado').length,
      pendientes: miembros.filter(m => m.categoria === 'personal_sin_contacto' && m.estado === 'pendiente').length,
      en_proceso: miembros.filter(m => m.categoria === 'personal_sin_contacto' && m.estado === 'en_proceso').length
    },
    familiar: {
      total: miembros.filter(m => m.categoria === 'familiar').length,
      completados: miembros.filter(m => m.categoria === 'familiar' && m.estado === 'completado').length,
      pendientes: miembros.filter(m => m.categoria === 'familiar' && m.estado === 'pendiente').length,
      en_proceso: miembros.filter(m => m.categoria === 'familiar' && m.estado === 'en_proceso').length
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando miembros...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard-delegado" className="text-gray-600 hover:text-gray-900 mr-4">
                ← Volver al Dashboard
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gestión de Miembros</h1>
                <p className="text-sm text-gray-600">Formación LOPIVI por categorías</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={generarLinkFormacion}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Generar Link de Formación
              </button>
              <div className="text-right text-sm text-gray-600">
                <div>Delegado: {sessionData?.nombre}</div>
                <div>Entidad: {sessionData?.entidad}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Estadísticas por categoría */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Personal con Contacto</h3>
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total:</span>
                <span className="font-bold">{estadisticas.personal_con_contacto.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completados:</span>
                <span className="text-green-600 font-bold">{estadisticas.personal_con_contacto.completados}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>En proceso:</span>
                <span className="text-blue-600 font-bold">{estadisticas.personal_con_contacto.en_proceso}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pendientes:</span>
                <span className="text-yellow-600 font-bold">{estadisticas.personal_con_contacto.pendientes}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Personal sin Contacto</h3>
              <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total:</span>
                <span className="font-bold">{estadisticas.personal_sin_contacto.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completados:</span>
                <span className="text-green-600 font-bold">{estadisticas.personal_sin_contacto.completados}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>En proceso:</span>
                <span className="text-blue-600 font-bold">{estadisticas.personal_sin_contacto.en_proceso}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pendientes:</span>
                <span className="text-yellow-600 font-bold">{estadisticas.personal_sin_contacto.pendientes}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Familiares</h3>
              <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total:</span>
                <span className="font-bold">{estadisticas.familiar.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completados:</span>
                <span className="text-green-600 font-bold">{estadisticas.familiar.completados}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>En proceso:</span>
                <span className="text-blue-600 font-bold">{estadisticas.familiar.en_proceso}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pendientes:</span>
                <span className="text-yellow-600 font-bold">{estadisticas.familiar.pendientes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4">Filtros</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select
                value={filtroCategoria}
                onChange={e => setFiltroCategoria(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="todas">Todas las categorías</option>
                <option value="personal_con_contacto">Personal con Contacto</option>
                <option value="personal_sin_contacto">Personal sin Contacto</option>
                <option value="familiar">Familiares</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filtroEstado}
                onChange={e => setFiltroEstado(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="todos">Todos los estados</option>
                <option value="completado">Completado</option>
                <option value="en_proceso">En proceso</option>
                <option value="pendiente">Pendiente</option>
                <option value="vencido">Vencido</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de miembros */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">
              Miembros Registrados ({miembrosFiltrados.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Miembro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {miembrosFiltrados.map(miembro => (
                  <tr key={miembro.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {miembro.nombre} {miembro.apellidos}
                        </div>
                        <div className="text-sm text-gray-500">{miembro.email}</div>
                        {miembro.rol && (
                          <div className="text-xs text-gray-400">{miembro.rol}</div>
                        )}
                        {miembro.relacion_menor && (
                          <div className="text-xs text-gray-400">{miembro.relacion_menor}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoriaColor(miembro.categoria)}`}>
                        {getCategoriaLabel(miembro.categoria)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(miembro.estado)}`}>
                        {miembro.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${miembro.progreso}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{miembro.progreso}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {miembro.certificado_generado && (
                          <button className="text-green-600 hover:text-green-900">
                            Ver Certificado
                          </button>
                        )}
                        {miembro.estado === 'completado' && (
                          <button className="text-blue-600 hover:text-blue-900">
                            Detalles
                          </button>
                        )}
                        {miembro.estado === 'pendiente' && (
                          <button className="text-orange-600 hover:text-orange-900">
                            Recordar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Link */}
      {mostrandoLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Link de Formación Generado</h2>
                <button
                  onClick={() => setMostrandoLink(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link para compartir:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={linkGenerado}
                    readOnly
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 bg-gray-50"
                  />
                  <button
                    onClick={copiarLink}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Compartir por:</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => compartirPor('whatsapp')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => compartirPor('email')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Email
                  </button>
                  <button
                    onClick={() => compartirPor('telegram')}
                    className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
                  >
                    Telegram
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Instrucciones:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Comparte este link con TODOS los miembros de tu entidad</li>
                  <li>• Cada persona seleccionará su categoría automáticamente</li>
                  <li>• El progreso se actualizará aquí en tiempo real</li>
                  <li>• Personal con contacto necesitará certificado de antecedentes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
