'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Interaccion {
  id: string
  fecha: string
  tipo: 'email' | 'whatsapp'
  remitente: string
  asunto: string
  mensaje: string
  leido: boolean
}

export default function CanalInteracciones() {
  const router = useRouter()
  const [interacciones] = useState<Interaccion[]>([
    {
      id: '1',
      fecha: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      tipo: 'email',
      remitente: 'María García (Coordinadora)',
      asunto: 'Consulta sobre protocolo de vestuarios',
      mensaje: 'Buenos días, necesito aclaración sobre el nuevo protocolo de supervisión en vestuarios...',
      leido: false
    },
    {
      id: '2',
      fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      tipo: 'email',
      remitente: 'Carlos López (Entrenador)',
      asunto: 'Reporte de incidencia menor',
      mensaje: 'Informo que durante el entrenamiento de hoy se produjo una discusión entre dos menores...',
      leido: true
    },
    {
      id: '3',
      fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      tipo: 'email',
      remitente: 'Ana Martínez (Fisioterapeuta)',
      asunto: 'Solicitud de formación adicional',
      mensaje: 'Me gustaría solicitar formación adicional en detección de señales de riesgo...',
      leido: true
    }
  ])

  const formatFecha = (isoString: string) => {
    const fecha = new Date(isoString)
    const ahora = new Date()
    const diff = ahora.getTime() - fecha.getTime()
    const minutos = Math.floor(diff / 60000)
    const horas = Math.floor(diff / 3600000)
    const dias = Math.floor(diff / 86400000)

    if (minutos < 60) return `Hace ${minutos} minutos`
    if (horas < 24) return `Hace ${horas} horas`
    return `Hace ${dias} días`
  }

  const interaccionesNoLeidas = interacciones.filter(i => !i.leido).length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Canal de Comunicación LOPIVI</h1>
            <button
              onClick={() => router.push('/dashboard-delegado')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estado del Canal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Canal Configurado</h3>
            <p className="text-2xl font-bold text-blue-600">Email</p>
            <p className="text-xs text-gray-500 mt-1">contacto@entidad.com</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Mensajes No Leídos</h3>
            <p className="text-2xl font-bold text-red-600">{interaccionesNoLeidas}</p>
            <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Interacciones</h3>
            <p className="text-2xl font-bold text-gray-900">{interacciones.length}</p>
            <p className="text-xs text-gray-500 mt-1">En las últimas 24 horas</p>
          </div>
        </div>

        {/* Lista de Interacciones */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Interacciones Recientes</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {interacciones.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No hay interacciones registradas</p>
                <p className="text-sm mt-2">Las comunicaciones aparecerán aquí</p>
              </div>
            ) : (
              interacciones.map((interaccion) => (
                <div
                  key={interaccion.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer ${
                    !interaccion.leido ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => alert(`Ver detalles de: ${interaccion.asunto}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {!interaccion.leido && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                        <h3 className={`font-semibold ${!interaccion.leido ? 'text-blue-900' : 'text-gray-900'}`}>
                          {interaccion.asunto}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          interaccion.tipo === 'email'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {interaccion.tipo === 'email' ? 'Email' : 'WhatsApp'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">De:</span> {interaccion.remitente}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {interaccion.mensaje}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatFecha(interaccion.fecha)}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Responder
                      </button>
                      {!interaccion.leido && (
                        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                          Marcar leído
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push('/formacion-lopivi/configuracion')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Configurar Canal
          </button>
          <button
            onClick={() => alert('Función de enviar mensaje')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Enviar Mensaje
          </button>
        </div>
      </main>
    </div>
  )
}
