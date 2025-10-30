'use client'
import { useState } from 'react'

export default function GenerarPDFsGuias() {
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState('')

  const generarYSubirPDFs = async () => {
    setLoading(true)
    setResultado('Generando PDFs y subiendo a Supabase...')

    try {
      const response = await fetch('/api/admin/generar-subir-pdfs', {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        setResultado('✅ PDFs generados y subidos correctamente!\n\n' + data.files.join('\n'))
        alert('✅ PDFs listos en Supabase!')
      } else {
        setResultado('❌ Error: ' + data.error)
        alert('Error: ' + data.error)
      }
    } catch (error: any) {
      setResultado('❌ Error de conexión: ' + error.message)
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Generar y Subir PDFs a Supabase</h1>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-xl font-bold mb-4">PDFs Guías LOPIVI</h2>
          <p className="text-gray-600 mb-6">
            Genera los PDFs con el contenido completo (25+ páginas) y súbelos automáticamente a Supabase Storage
          </p>

          <button
            onClick={generarYSubirPDFs}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generando y subiendo...' : '🚀 Generar y Subir PDFs'}
          </button>

          {resultado && (
            <div className="mt-6 bg-gray-100 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm">{resultado}</pre>
            </div>
          )}
        </div>

        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="font-bold text-orange-900 mb-2">📋 Qué hace:</h3>
          <ul className="text-orange-800 text-sm space-y-2">
            <li>1. Genera PDF "Guía LOPIVI Completa" con 25 páginas</li>
            <li>2. Genera PDF "Guía Plan de Protección" con contenido completo</li>
            <li>3. Sube ambos PDFs a Supabase Storage en /docs/guias/</li>
            <li>4. Los PDFs quedan disponibles en la página /guia automáticamente</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
