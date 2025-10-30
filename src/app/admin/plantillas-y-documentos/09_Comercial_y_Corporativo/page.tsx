'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Bloque09Page() {
  const [generando, setGenerando] = useState(false)
  const [resultado, setResultado] = useState('')

  const baseURL = 'https://gkoyqfusawhnobvkoijc.supabase.co/storage/v1/object/public/docs/plantillas/09_Comercial_y_Corporativo'

  const documentos = [
    {
      nombre: 'Dossier Corporativo Custodia360',
      descripcion: 'Documento corporativo completo con misión, valores, servicios y contacto. Ideal para presentaciones institucionales.',
      archivo: '01_Dossier_Corporativo_Custodia360.pdf'
    },
    {
      nombre: 'Ficha Técnica de la Solución Automatizada',
      descripcion: 'Especificaciones técnicas del sistema, componentes, integraciones y cumplimiento normativo.',
      archivo: '02_Ficha_Tecnica_Solucion_Automatizada.pdf'
    },
    {
      nombre: 'Presentación Comercial (Resumen Ejecutivo)',
      descripcion: 'Resumen ejecutivo del problema, solución, beneficios y modalidades de contratación.',
      archivo: '03_Presentacion_Comercial.pdf'
    },
    {
      nombre: 'Catálogo de Servicios Complementarios',
      descripcion: 'Listado completo de servicios adicionales: formación, asesoría, auditoría, soporte técnico.',
      archivo: '04_Catalogo_Servicios_Complementarios.pdf'
    },
    {
      nombre: 'Política de SLA y Contrato de Servicio',
      descripcion: 'Niveles de servicio, tiempos de respuesta, responsabilidades y condiciones contractuales.',
      archivo: '05_Politica_SLA_Contrato_Servicio.pdf'
    }
  ]

  const generarBloque = async () => {
    setGenerando(true)
    setResultado('Generando documentos del Bloque 09...')

    try {
      const response = await fetch('/api/admin/generar-bloque-09', {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        setResultado('Bloque 09 generado correctamente!\n\nDocumentos creados:\n' + data.documentos.join('\n'))
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setResultado('Error: ' + data.error)
      }
    } catch (error: any) {
      setResultado('Error de conexión: ' + error.message)
    } finally {
      setGenerando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard-custodia360" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
                ← Volver al Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Bloque 09 — Comercial y Corporativo</h1>
              <p className="text-gray-600 mt-2">Documentación comercial y corporativa de Custodia360</p>
            </div>
            <button
              onClick={generarBloque}
              disabled={generando}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generando ? 'Generando...' : 'Regenerar Bloque 09'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Resultado de generación */}
        {resultado && (
          <div className={`mb-8 p-6 rounded-lg ${resultado.includes('generado correctamente') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <pre className="whitespace-pre-wrap text-sm">{resultado}</pre>
          </div>
        )}

        {/* Info del bloque */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-3">Contenido del Bloque</h2>
          <p className="text-blue-800 mb-4">
            Este bloque contiene 5 documentos profesionales listos para uso comercial y corporativo:
          </p>
          <ul className="text-blue-700 space-y-1">
            <li>Dossier corporativo completo</li>
            <li>Ficha técnica del sistema</li>
            <li>Presentación comercial ejecutiva</li>
            <li>Catálogo de servicios complementarios</li>
            <li>Política de SLA y contrato de servicio</li>
          </ul>
        </div>

        {/* Listado de documentos */}
        <div className="grid gap-6">
          {documentos.map((doc, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{doc.nombre}</h3>
                    <p className="text-sm text-gray-500">Versión 1.0 • PDF</p>
                  </div>
                  <p className="text-gray-600 mb-4">{doc.descripcion}</p>
                  <div className="flex gap-3">
                    <a
                      href={`${baseURL}/${doc.archivo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Descargar PDF
                    </a>
                    <a
                      href={`${baseURL}/${doc.archivo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      Vista previa
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nota DOCX */}
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="font-bold text-orange-900 mb-2">Versiones DOCX</h3>
          <p className="text-orange-800 text-sm">
            Los documentos están disponibles en formato PDF optimizado para descarga y visualización.
            Si necesitas versiones editables en formato DOCX, contacta con el equipo técnico.
          </p>
        </div>

        {/* Footer navegación */}
        <div className="mt-8 flex justify-between">
          <Link
            href="/admin/plantillas-y-documentos"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Volver a Centro Documental
          </Link>
        </div>
      </div>
    </div>
  )
}
