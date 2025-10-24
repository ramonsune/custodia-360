'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Familia {
  id: string
  apellidos: string
  menor: {
    nombre: string
    edad: number
    categoria: string
  }
  contactoPrincipal: {
    nombre: string
    email: string
    telefono: string
    parentesco: string
  }
  contactoSecundario?: {
    nombre: string
    email: string
    telefono: string
    parentesco: string
  }
  estado: 'activo' | 'inactivo' | 'pendiente'
  ultimaComunicacion?: string
  preferenciaComunicacion: 'email' | 'telefono' | 'whatsapp' | 'todas'
  autorizaciones: {
    comunicacionDigital: boolean
    datosPersonales: boolean
    imagenes: boolean
  }
}

export default function ComunicacionFamiliasPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<any>(null)
  const [familias, setFamilias] = useState<Familia[]>([])
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo' | 'pendiente'>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [showModalMensaje, setShowModalMensaje] = useState(false)
  const [familiasSeleccionadas, setFamiliasSeleccionadas] = useState<Familia[]>([])
  const [mensajeFamilias, setMensajeFamilias] = useState({
    asunto: '',
    mensaje: '',
    tipoMensaje: 'informativo' as 'informativo' | 'urgente' | 'recordatorio' | 'felicitacion',
    incluyeImagenes: false,
    solicitaRespuesta: false
  })

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (session) {
      setSessionData(JSON.parse(session))
      cargarFamilias()
    } else {
      router.push('/login-delegados')
    }
  }, [router])

  const cargarFamilias = () => {
    const familiasData: Familia[] = [
      {
        id: 'fam-001',
        apellidos: 'García López',
        menor: {
          nombre: 'María García',
          edad: 8,
          categoria: 'Alevín Femenino'
        },
        contactoPrincipal: {
          nombre: 'Ana López Martín',
          email: 'ana.lopez@email.com',
          telefono: '600111222',
          parentesco: 'Madre'
        },
        contactoSecundario: {
          nombre: 'Carlos García Ruiz',
          email: 'carlos.garcia@email.com',
          telefono: '600333444',
          parentesco: 'Padre'
        },
        estado: 'activo',
        ultimaComunicacion: '2024-01-10',
        preferenciaComunicacion: 'email',
        autorizaciones: {
          comunicacionDigital: true,
          datosPersonales: true,
          imagenes: true
        }
      },
      {
        id: 'fam-002',
        apellidos: 'Martín Sánchez',
        menor: {
          nombre: 'Pablo Martín',
          edad: 12,
          categoria: 'Infantil Masculino'
        },
        contactoPrincipal: {
          nombre: 'Laura Sánchez Torres',
          email: 'laura.sanchez@email.com',
          telefono: '600555666',
          parentesco: 'Madre'
        },
        estado: 'activo',
        ultimaComunicacion: '2024-01-08',
        preferenciaComunicacion: 'whatsapp',
        autorizaciones: {
          comunicacionDigital: true,
          datosPersonales: true,
          imagenes: false
        }
      },
      {
        id: 'fam-003',
        apellidos: 'Ruiz Fernández',
        menor: {
          nombre: 'Sofia Ruiz',
          edad: 6,
          categoria: 'Benjamín Femenino'
        },
        contactoPrincipal: {
          nombre: 'Miguel Ruiz López',
          email: 'miguel.ruiz@email.com',
          telefono: '600777888',
          parentesco: 'Padre'
        },
        contactoSecundario: {
          nombre: 'Elena Fernández Castro',
          email: 'elena.fernandez@email.com',
          telefono: '600999000',
          parentesco: 'Madre'
        },
        estado: 'pendiente',
        preferenciaComunicacion: 'telefono',
        autorizaciones: {
          comunicacionDigital: false,
          datosPersonales: true,
          imagenes: false
        }
      },
      {
        id: 'fam-004',
        apellidos: 'Torres Jiménez',
        menor: {
          nombre: 'Alejandro Torres',
          edad: 14,
          categoria: 'Cadete Masculino'
        },
        contactoPrincipal: {
          nombre: 'Carmen Jiménez Vega',
          email: 'carmen.jimenez@email.com',
          telefono: '600121314',
          parentesco: 'Madre'
        },
        estado: 'inactivo',
        ultimaComunicacion: '2023-12-15',
        preferenciaComunicacion: 'email',
        autorizaciones: {
          comunicacionDigital: true,
          datosPersonales: true,
          imagenes: true
        }
      }
    ]
    setFamilias(familiasData)
  }

  const familiasFiltradas = familias.filter(familia => {
    const matchEstado = filtroEstado === 'todos' || familia.estado === filtroEstado
    const matchBusqueda = busqueda === '' ||
      familia.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      familia.menor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      familia.contactoPrincipal.nombre.toLowerCase().includes(busqueda.toLowerCase())

    return matchEstado && matchBusqueda
  })

  const seleccionarFamilia = (familia: Familia) => {
    setFamiliasSeleccionadas(prev => {
      const existe = prev.find(f => f.id === familia.id)
      if (existe) {
        return prev.filter(f => f.id !== familia.id)
      } else {
        return [...prev, familia]
      }
    })
  }

  const seleccionarTodas = () => {
    if (familiasSeleccionadas.length === familiasFiltradas.length) {
      setFamiliasSeleccionadas([])
    } else {
      setFamiliasSeleccionadas(familiasFiltradas)
    }
  }

  const enviarMensajeFamilias = () => {
    if (!mensajeFamilias.asunto.trim() || !mensajeFamilias.mensaje.trim() || familiasSeleccionadas.length === 0) {
      alert('Por favor complete el asunto, mensaje y seleccione al menos una familia')
      return
    }

    // Verificar autorizaciones
    const familiasSinAutorizacion = familiasSeleccionadas.filter(f => !f.autorizaciones.comunicacionDigital)
    if (familiasSinAutorizacion.length > 0) {
      const continuar = confirm(`${familiasSinAutorizacion.length} familia(s) no tienen autorización para comunicación digital. Se les contactará por teléfono. ¿Continuar?`)
      if (!continuar) return
    }

    const comunicacion = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      remitente: sessionData?.nombre || 'Delegado Principal',
      destinatarios: familiasSeleccionadas.map(f => `${f.apellidos} (${f.menor.nombre})`),
      asunto: mensajeFamilias.asunto,
      mensaje: mensajeFamilias.mensaje,
      tipo: mensajeFamilias.tipoMensaje,
      incluyeImagenes: mensajeFamilias.incluyeImagenes,
      solicitaRespuesta: mensajeFamilias.solicitaRespuesta,
      estado: 'enviado'
    }

    const historial = JSON.parse(localStorage.getItem('historial_comunicaciones_familias') || '[]')
    localStorage.setItem('historial_comunicaciones_familias', JSON.stringify([comunicacion, ...historial]))

    alert(`Mensaje enviado exitosamente a ${familiasSeleccionadas.length} familia(s)`)

    setMensajeFamilias({
      asunto: '',
      mensaje: '',
      tipoMensaje: 'informativo',
      incluyeImagenes: false,
      solicitaRespuesta: false
    })
    setFamiliasSeleccionadas([])
    setShowModalMensaje(false)
  }

  const plantillasMensaje = {
    informativo: {
      asunto: 'Información importante - {entidad}',
      mensaje: 'Estimadas familias,\n\nLes informamos que...\n\nSaludos cordiales,\nEquipo de {entidad}'
    },
    recordatorio: {
      asunto: 'Recordatorio - Próxima actividad',
      mensaje: 'Queridas familias,\n\nLes recordamos que...\n\nGracias por su atención.'
    },
    urgente: {
      asunto: 'URGENTE - Comunicación importante',
      mensaje: 'Estimadas familias,\n\nEs importante que sepan que...\n\nRogamos contacten con nosotros si tienen dudas.'
    },
    felicitacion: {
      asunto: '¡Felicitaciones! - Logro de su hijo/a',
      mensaje: 'Queridas familias,\n\nTenemos el placer de comunicarles...\n\n¡Felicitaciones!'
    }
  }

  const aplicarPlantilla = (tipo: keyof typeof plantillasMensaje) => {
    const plantilla = plantillasMensaje[tipo]
    setMensajeFamilias(prev => ({
      ...prev,
      asunto: plantilla.asunto.replace('{entidad}', sessionData?.entidad || 'nuestra entidad'),
      mensaje: plantilla.mensaje.replace('{entidad}', sessionData?.entidad || 'nuestra entidad'),
      tipoMensaje: tipo
    }))
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
              <h1 className="text-xl font-bold text-gray-900">Comunicación con Familias</h1>
            </div>
            <span className="text-sm text-gray-600">
              {sessionData?.nombre} - Delegado Principal
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Controles */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Familias de la Entidad</h2>
              <p className="text-gray-600">Comunícate con las familias de los menores de forma segura y autorizada</p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Buscar familia o menor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todas las Familias</option>
                <option value="activo">Familias Activas</option>
                <option value="pendiente">Pendientes</option>
                <option value="inactivo">Inactivas</option>
              </select>

              <button
                onClick={() => setShowModalMensaje(true)}
                disabled={familiasSeleccionadas.length === 0}
                className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap ${
                  familiasSeleccionadas.length > 0
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Enviar Mensaje ({familiasSeleccionadas.length})
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={familiasSeleccionadas.length === familiasFiltradas.length && familiasFiltradas.length > 0}
              onChange={seleccionarTodas}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label className="text-sm text-gray-700">
              Seleccionar todas ({familiasFiltradas.length} familias)
            </label>
          </div>
        </div>

        {/* Lista de Familias */}
        <div className="grid gap-4">
          {familiasFiltradas.map((familia) => (
            <div key={familia.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={familiasSeleccionadas.some(f => f.id === familia.id)}
                  onChange={() => seleccionarFamilia(familia)}
                  className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">Familia {familia.apellidos}</h3>

                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        familia.estado === 'activo' ? 'bg-green-100 text-green-800' :
                        familia.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {familia.estado.charAt(0).toUpperCase() + familia.estado.slice(1)}
                      </span>

                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        familia.autorizaciones.comunicacionDigital ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {familia.autorizaciones.comunicacionDigital ? 'Digital ✓' : 'Solo Teléfono'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setFamiliasSeleccionadas([familia])
                        setShowModalMensaje(true)
                      }}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
                    >
                      Mensaje Individual
                    </button>
                  </div>

                  {/* Información del menor */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <h4 className="font-medium text-blue-900 mb-1">Menor:</h4>
                    <p className="text-blue-800">
                      <strong>{familia.menor.nombre}</strong> - {familia.menor.edad} años - {familia.menor.categoria}
                    </p>
                  </div>

                  {/* Contactos */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-gray-700 mb-2">Contacto Principal:</h4>
                      <p className="text-sm">
                        <strong>{familia.contactoPrincipal.nombre}</strong> ({familia.contactoPrincipal.parentesco})
                      </p>
                      <p className="text-sm text-gray-600">{familia.contactoPrincipal.email}</p>
                      <p className="text-sm text-gray-600">{familia.contactoPrincipal.telefono}</p>
                    </div>

                    {familia.contactoSecundario && (
                      <div className="border border-gray-200 rounded-lg p-3">
                        <h4 className="font-medium text-gray-700 mb-2">Contacto Secundario:</h4>
                        <p className="text-sm">
                          <strong>{familia.contactoSecundario.nombre}</strong> ({familia.contactoSecundario.parentesco})
                        </p>
                        <p className="text-sm text-gray-600">{familia.contactoSecundario.email}</p>
                        <p className="text-sm text-gray-600">{familia.contactoSecundario.telefono}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                    <span><strong>Preferencia:</strong> {familia.preferenciaComunicacion}</span>
                    {familia.ultimaComunicacion && (
                      <span><strong>Última comunicación:</strong> {new Date(familia.ultimaComunicacion).toLocaleDateString('es-ES')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="font-bold text-indigo-900 mb-2">Resumen de Familias:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-indigo-800">Total:</span>
              <span className="text-indigo-900 ml-1">{familias.length} familias</span>
            </div>
            <div>
              <span className="font-medium text-indigo-800">Activas:</span>
              <span className="text-indigo-900 ml-1">{familias.filter(f => f.estado === 'activo').length}</span>
            </div>
            <div>
              <span className="font-medium text-indigo-800">Con autorización digital:</span>
              <span className="text-indigo-900 ml-1">{familias.filter(f => f.autorizaciones.comunicacionDigital).length}</span>
            </div>
            <div>
              <span className="font-medium text-indigo-800">Con autorización imágenes:</span>
              <span className="text-indigo-900 ml-1">{familias.filter(f => f.autorizaciones.imagenes).length}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Envío de Mensaje */}
      {showModalMensaje && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Mensaje a Familias ({familiasSeleccionadas.length} destinatario{familiasSeleccionadas.length !== 1 ? 's' : ''})
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
              <form onSubmit={(e) => { e.preventDefault(); enviarMensajeFamilias(); }}>
                {/* Plantillas rápidas */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plantillas rápidas:</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.keys(plantillasMensaje).map(tipo => (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => aplicarPlantilla(tipo as keyof typeof plantillasMensaje)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded"
                      >
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tipo de mensaje */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de mensaje:</label>
                  <select
                    value={mensajeFamilias.tipoMensaje}
                    onChange={(e) => setMensajeFamilias(prev => ({...prev, tipoMensaje: e.target.value as any}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="informativo">Informativo</option>
                    <option value="urgente">Urgente</option>
                    <option value="recordatorio">Recordatorio</option>
                    <option value="felicitacion">Felicitación</option>
                  </select>
                </div>

                {/* Destinatarios */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destinatarios:</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                    {familiasSeleccionadas.map(f => (
                      <span key={f.id} className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs mr-2 mb-1">
                        {f.apellidos} ({f.menor.nombre})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Asunto */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asunto: *</label>
                  <input
                    type="text"
                    value={mensajeFamilias.asunto}
                    onChange={(e) => setMensajeFamilias(prev => ({...prev, asunto: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Asunto del mensaje"
                    required
                  />
                </div>

                {/* Mensaje */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje: *</label>
                  <textarea
                    value={mensajeFamilias.mensaje}
                    onChange={(e) => setMensajeFamilias(prev => ({...prev, mensaje: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={6}
                    placeholder="Escriba su mensaje aquí..."
                    required
                  />
                </div>

                {/* Opciones adicionales */}
                <div className="mb-6 space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={mensajeFamilias.incluyeImagenes}
                      onChange={(e) => setMensajeFamilias(prev => ({...prev, incluyeImagenes: e.target.checked}))}
                      className="mr-2 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Incluye imágenes (solo familias autorizadas)</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={mensajeFamilias.solicitaRespuesta}
                      onChange={(e) => setMensajeFamilias(prev => ({...prev, solicitaRespuesta: e.target.checked}))}
                      className="mr-2 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Solicitar respuesta/confirmación</span>
                  </label>
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
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
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
