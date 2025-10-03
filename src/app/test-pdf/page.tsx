'use client'

import { useState } from 'react'

export default function TestPDFPage() {
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [error, setError] = useState('')

  // Datos de prueba
  const [datos, setDatos] = useState({
    entidad: 'Club Deportivo Ejemplo',
    cif: 'B12345678',
    delegado: 'Juan García Rodríguez',
    nombre: 'Juan García Rodríguez',
    email: 'juan.garcia@ejemplo.com'
  })

  // Generar y descargar PDF
  const generarPDF = async (tipo: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/pdf/generar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tipo, datos })
      })

      if (!response.ok) {
        throw new Error('Error al generar PDF')
      }

      // Descargar el PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${tipo}_${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setResultado({ mensaje: 'PDF descargado correctamente' })
    } catch (err: any) {
      setError(err.message || 'Error al generar PDF')
    } finally {
      setLoading(false)
    }
  }

  // Enviar PDF por email
  const enviarPDF = async (tipo: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/pdf/enviar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipo,
          datos,
          destinatario: datos.email,
          asunto: `Documento LOPIVI - ${datos.entidad}`
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar PDF')
      }

      setResultado(result)
    } catch (err: any) {
      setError(err.message || 'Error al enviar PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Test del Sistema de PDFs
        </h1>

        {/* Panel de configuración */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Datos de Prueba
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entidad
              </label>
              <input
                type="text"
                value={datos.entidad}
                onChange={(e) => setDatos({ ...datos, entidad: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CIF
              </label>
              <input
                type="text"
                value={datos.cif}
                onChange={(e) => setDatos({ ...datos, cif: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delegado
              </label>
              <input
                type="text"
                value={datos.delegado}
                onChange={(e) => setDatos({ ...datos, delegado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (para envío)
              </label>
              <input
                type="email"
                value={datos.email}
                onChange={(e) => setDatos({ ...datos, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Acciones de prueba */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Generar y Descargar PDFs
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => generarPDF('planProteccion')}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📄 Generar Plan de Protección
            </button>

            <button
              onClick={() => generarPDF('certificadoLOPIVI')}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🏆 Generar Certificado LOPIVI
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Enviar PDFs por Email
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => enviarPDF('planProteccion')}
              disabled={loading || !datos.email}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📧 Enviar Plan por Email
            </button>

            <button
              onClick={() => enviarPDF('certificadoLOPIVI')}
              disabled={loading || !datos.email}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📧 Enviar Certificado por Email
            </button>
          </div>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800">Procesando...</p>
            </div>
          </div>
        )}

        {/* Resultado */}
        {resultado && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-green-800 mb-2">✅ Éxito</h3>
            <pre className="text-sm text-green-700 whitespace-pre-wrap">
              {JSON.stringify(resultado, null, 2)}
            </pre>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-red-800 mb-2">❌ Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Información */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-800 mb-2">ℹ️ Información del Sistema</h3>
          <ul className="space-y-2 text-yellow-700">
            <li>• <strong>Puppeteer:</strong> Genera PDFs profesionales desde HTML</li>
            <li>• <strong>Resend:</strong> Envía emails con PDFs adjuntos</li>
            <li>• <strong>Plantillas:</strong> HTML personalizable para cada tipo de documento</li>
            <li>• <strong>API REST:</strong> Endpoints para generar y enviar PDFs</li>
          </ul>

          <div className="mt-4 p-3 bg-yellow-100 rounded">
            <p className="text-sm font-medium text-yellow-800">
              📌 Los PDFs enviados por email llegarán a la dirección configurada arriba.
              Asegúrate de usar un email válido para las pruebas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
