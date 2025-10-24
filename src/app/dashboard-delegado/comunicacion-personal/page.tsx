'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface PersonalMiembro {
  id: string
  nombre: string
  email: string
  telefono: string
  cargo: string
  tipo: 'contacto' | 'sin_contacto'
  estado: 'activo' | 'suspendido' | 'inactivo'
  ultimaActividad: string
  certificacionLopivi: boolean
  fechaUltimaComunicacion?: string
}

export default function ComunicacionPersonalPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<any>(null)
  const [personal, setPersonal] = useState<PersonalMiembro[]>([])
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'contacto' | 'sin_contacto'>('todos')
  const [showModalMensaje, setShowModalMensaje] = useState(false)
  const [personalSeleccionado, setPersonalSeleccionado] = useState<PersonalMiembro[]>([])
  const [mensajeGrupal, setMensajeGrupal] = useState({
    asunto: '',
    mensaje: '',
    adjuntos: [] as File[],
    prioridad: 'normal' as 'alta' | 'normal' | 'baja'
  })

  useEffect(() => {
    // Verificar sesión
    const session = localStorage.getItem('userSession')
    if (session) {
      setSessionData(JSON.parse(session))
      cargarPersonal()
    } else {
      router.push('/login-delegados')
    }
  }, [router])

  const cargarPersonal = () => {
    // Datos de ejemplo del personal
    const personalData: PersonalMiembro[] = [
      {
        id: 'per-001',
        nombre: 'María González López',
        email: 'maria.gonzalez@entidad.com',
        telefono: '600123456',
        cargo: 'Entrenadora Principal',
        tipo: 'contacto',
        estado: 'activo',
        ultimaActividad: '2024-01-15',
        certificacionLopivi: true,
        fechaUltimaComunicacion: '2024-01-10'
      },
      {
        id: 'per-002',
        nombre: 'Carlos Ruiz Martín',
        email: 'carlos.ruiz@entidad.com',
        telefono: '600234567',
        cargo: 'Monitor Deportivo',
        tipo: 'contacto',
        estado: 'activo',
        ultimaActividad: '2024-01-14',
        certificacionLopivi: false
      },
      {
        id: 'per-003',
        nombre: 'Ana Martín Sánchez',
        email: 'ana.martin@entidad.com',
        telefono: '600345678',
        cargo: 'Coordinadora Técnica',
        tipo: 'contacto',
        estado: 'activo',
        ultimaActividad: '2024-01-13',
        certificacionLopivi: true,
        fechaUltimaComunicacion: '2024-01-08'
      },
      {
        id: 'per-004',
        nombre: 'Roberto Jiménez Cruz',
        email: 'roberto.jimenez@entidad.com',
        telefono: '600456789',
        cargo: 'Monitor Auxiliar',
        tipo: 'sin_contacto',
        estado: 'suspendido',
        ultimaActividad: '2024-01-05',
        certificacionLopivi: false
      },
      {
        id: 'per-005',
        nombre: 'Laura Fernández Torres',
        email: 'laura.fernandez@entidad.com',
        telefono: '600567890',
        cargo: 'Administrativa',
        tipo: 'sin_contacto',
        estado: 'activo',
        ultimaActividad: '2024-01-12',
        certificacionLopivi: true
      },
      {
        id: 'per-006',
        nombre: 'Miguel Torres Vega',
        email: 'miguel.torres@entidad.com',
        telefono: '600678901',
        cargo: 'Monitor Auxiliar',
        tipo: 'contacto',
        estado: 'inactivo',
        ultimaActividad: '2024-01-01',
        certificacionLopivi: false
      }
    ]
    setPersonal(personalData)
  }

  const personalFiltrado = personal.filter(p => {
    if (filtroTipo === 'todos') return true
    return p.tipo === filtroTipo
  })

  const seleccionarPersonal = (miembro: PersonalMiembro) => {
    setPersonalSeleccionado(prev => {
      const existe = prev.find(p => p.id === miembro.id)
      if (existe) {
        return prev.filter(p => p.id !== miembro.id)
      } else {
        return [...prev, miembro]
      }
    })
  }

  const seleccionarTodos = () => {
    if (personalSeleccionado.length === personalFiltrado.length) {
      setPersonalSeleccionado([])
    } else {
      setPersonalSeleccionado(personalFiltrado)
    }
  }

  const enviarMensajeGrupal = () => {
    if (!mensajeGrupal.asunto.trim() || !mensajeGrupal.mensaje.trim() || personalSeleccionado.length === 0) {
      alert('Por favor complete el asunto, mensaje y seleccione al menos un destinatario')
      return
    }

    // Simular envío
    const comunicacion = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      remitente: sessionData?.nombre || 'Delegado Principal',
      destinatarios: personalSeleccionado.map(p => p.nombre),
      asunto: mensajeGrupal.asunto,
      mensaje: mensajeGrupal.mensaje,
      prioridad: mensajeGrupal.prioridad,
      adjuntos: mensajeGrupal.adjuntos.length,
      estado: 'enviado'
    }

    // Guardar en historial
    const historial = JSON.parse(localStorage.getItem('historial_comunicaciones_personal') || '[]')
    localStorage.setItem('historial_comunicaciones_personal', JSON.stringify([comunicacion, ...historial]))

    alert(`Mensaje enviado exitosamente a ${personalSeleccionado.length} persona(s)`)

    // Resetear formulario
    setMensajeGrupal({
      asunto: '',
      mensaje: '',
      adjuntos: [],
      prioridad: 'normal'
    })
    setPersonalSeleccionado([])
    setShowModalMensaje(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard-delegado" className="text-blue-600 hover:text-blue-800 mr-4">
                ← Volver al Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Comunicación con Personal</h1>
            </div>
            <span className="text-sm text-gray-600">
              {sessionData?.nombre} - Delegado Principal
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Controles y Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Personal de la Entidad</h2>
              <p className="text-gray-600">Comunícate con todo el personal: con contacto directo y sin contacto directo con menores</p>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              {/* Filtros */}
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todo el Personal</option>
                <option value="contacto">Personal con Contacto</option>
                <option value="sin_contacto">Personal sin Contacto</option>
              </select>

              <button
                onClick={() => setShowModalMensaje(true)}
                disabled={personalSeleccionado.length === 0}
                className={`px-6 py-2 rounded-lg font-medium ${
                  personalSeleccionado.length > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Enviar Mensaje ({personalSeleccionado.length})
              </button>
            </div>
          </div>

          {/* Selección masiva */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={personalSeleccionado.length === personalFiltrado.length && personalFiltrado.length > 0}
              onChange={seleccionarTodos}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">
              Seleccionar todos ({personalFiltrado.length} personas)
            </label>
          </div>
        </div>

        {/* Lista del Personal */}
        <div className="grid gap-4">
          {personalFiltrado.map((miembro) => (
            <div key={miembro.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={personalSeleccionado.some(p => p.id === miembro.id)}
                    onChange={() => seleccionarPersonal(miembro)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{miembro.nombre}</h3>

                      {/* Badges de estado */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        miembro.tipo === 'contacto'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {miembro.tipo === 'contacto' ? 'Con Contacto' : 'Sin Contacto'}
                      </span>

                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        miembro.estado === 'activo' ? 'bg-green-100 text-green-800' :
                        miembro.estado === 'suspendido' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {miembro.estado.charAt(0).toUpperCase() + miembro.estado.slice(1)}
                      </span>

                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        miembro.certificacionLopivi ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {miembro.certificacionLopivi ? 'LOPIVI ✓' : 'Sin LOPIVI'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Cargo:</span>
                        <p className="text-gray-900">{miembro.cargo}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <p className="text-gray-900">{miembro.email}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Teléfono:</span>
                        <p className="text-gray-900">{miembro.telefono}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Última Actividad:</span>
                        <p className="text-gray-900">{new Date(miembro.ultimaActividad).toLocaleDateString('es-ES')}</p>
                      </div>
                    </div>

                    {miembro.fechaUltimaComunicacion && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-gray-700">Última comunicación:</span>
                        <span className="text-gray-900 ml-1">
                          {new Date(miembro.fechaUltimaComunicacion).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setPersonalSeleccionado([miembro])
                      setShowModalMensaje(true)
                    }}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm"
                  >
                    Mensaje Individual
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">Resumen del Personal:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800">Total:</span>
              <span className="text-blue-900 ml-1">{personal.length} personas</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Con Contacto:</span>
              <span className="text-blue-900 ml-1">{personal.filter(p => p.tipo === 'contacto').length}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Sin Contacto:</span>
              <span className="text-blue-900 ml-1">{personal.filter(p => p.tipo === 'sin_contacto').length}</span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Con LOPIVI:</span>
              <span className="text-blue-900 ml-1">{personal.filter(p => p.certificacionLopivi).length}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Envío de Mensaje */}
      {showModalMensaje && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Enviar Mensaje al Personal ({personalSeleccionado.length} destinatario{personalSeleccionado.length !== 1 ? 's' : ''})
                </h2>
                <button
                  onClick={() => setShowModalMensaje(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); enviarMensajeGrupal(); }}>
                {/* Destinatarios */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destinatarios:</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-24 overflow-y-auto">
                    {personalSeleccionado.map(p => (
                      <span key={p.id} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2 mb-1">
                        {p.nombre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prioridad */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad:</label>
                  <select
                    value={mensajeGrupal.prioridad}
                    onChange={(e) => setMensajeGrupal(prev => ({...prev, prioridad: e.target.value as any}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="alta">Alta Prioridad</option>
                    <option value="baja">Baja Prioridad</option>
                  </select>
                </div>

                {/* Asunto */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asunto: *</label>
                  <input
                    type="text"
                    value={mensajeGrupal.asunto}
                    onChange={(e) => setMensajeGrupal(prev => ({...prev, asunto: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Asunto del mensaje"
                    required
                  />
                </div>

                {/* Mensaje */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje: *</label>
                  <textarea
                    value={mensajeGrupal.mensaje}
                    onChange={(e) => setMensajeGrupal(prev => ({...prev, mensaje: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="Escriba su mensaje aquí..."
                    required
                  />
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModalMensaje(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Enviar Mensaje
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
