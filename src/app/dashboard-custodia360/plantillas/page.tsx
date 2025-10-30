'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Documento {
  id: string
  titulo: string
  descripcion: string
  tipo: 'pdf' | 'docx'
  categoria: string
  carpeta: string
  url: string
  tamano: string
}

interface Carpeta {
  id: string
  nombre: string
  descripcion: string
  icono: string
  color: string
  documentos: number
  nota?: string
}

export default function PlantillasYDocumentosPage() {
  const [carpetaActiva, setCarpetaActiva] = useState<string | null>(null)
  const [generando, setGenerando] = useState(false)
  const [documentos, setDocumentos] = useState<Documento[]>([])

  const carpetas: Carpeta[] = [
    {
      id: '01_Politicas_y_Codigos',
      nombre: 'Políticas y Códigos',
      descripcion: 'Documentos de compromiso, conducta y políticas organizacionales',
      icono: '',
      color: 'bg-blue-50 border-blue-200',
      documentos: 5
    },
    {
      id: '02_Planes_y_Guias',
      nombre: 'Planes y Guías',
      descripcion: 'Guías LOPIVI, planes de protección y manuales de procedimientos',
      icono: '',
      color: 'bg-green-50 border-green-200',
      documentos: 4,
      nota: '2 documentos nuevos + 2 guías vinculadas del Bloque 01'
    },
    {
      id: '03_Analisis_de_Riesgos',
      nombre: 'Análisis de Riesgos',
      descripcion: 'Metodologías, plantillas y matrices de evaluación de riesgos',
      icono: '',
      color: 'bg-yellow-50 border-yellow-200',
      documentos: 4
    },
    {
      id: '04_Protocolos_Actuacion',
      nombre: 'Protocolos de Actuación',
      descripcion: 'Protocolos de detección, notificación, urgencias y coordinación',
      icono: '',
      color: 'bg-red-50 border-red-200',
      documentos: 5
    },
    {
      id: '05_Registros_y_Formularios',
      nombre: 'Registros y Formularios',
      descripcion: 'Formularios de incidentes, formación, autorizaciones y evaluación',
      icono: '',
      color: 'bg-purple-50 border-purple-200',
      documentos: 6
    },
    {
      id: '06_Formacion_y_Concienciacion',
      nombre: 'Formación y Concienciación',
      descripcion: 'Planes formativos, temarios, cuestionarios e infografías',
      icono: '',
      color: 'bg-indigo-50 border-indigo-200',
      documentos: 5
    },
    {
      id: '07_Comunicacion_y_Participacion',
      nombre: 'Comunicación y Participación',
      descripcion: 'Canales seguros, participación infantil y comunicación interna',
      icono: '',
      color: 'bg-pink-50 border-pink-200',
      documentos: 3
    },
    {
      id: '08_Auditorias_y_Mejora',
      nombre: 'Auditorías y Mejora',
      descripcion: 'Checklists, informes de auditoría y planes de mejora continua',
      icono: '',
      color: 'bg-teal-50 border-teal-200',
      documentos: 4
    },
    {
      id: '09_Comercial_y_Corporativo',
      nombre: 'Comercial y Corporativo',
      descripcion: 'Dossieres, fichas técnicas, presentaciones y catálogos',
      icono: '',
      color: 'bg-orange-50 border-orange-200',
      documentos: 5
    }
  ]

  const generarBloque01 = async () => {
    setGenerando(true)
    try {
      const response = await fetch('/api/admin/generate-bloque-01', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ ${data.total} documentos del Bloque 01 generados correctamente`)

        const nuevosDocs: Documento[] = data.documentos.map((doc: any, index: number) => ({
          id: `bloque01-${index}`,
          titulo: doc.nombre,
          descripcion: 'Documento profesional genérico de Custodia360',
          tipo: 'pdf',
          categoria: 'Políticas',
          carpeta: '01_Politicas_y_Codigos',
          url: doc.pdf,
          tamano: 'PDF + DOCX'
        }))

        setDocumentos([...documentos, ...nuevosDocs])
      } else {
        throw new Error('Error generando documentos')
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error generando documentos')
    } finally {
      setGenerando(false)
    }
  }

  const generarBloque02 = async () => {
    setGenerando(true)
    try {
      const response = await fetch('/api/admin/generate-bloque-02', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ ${data.total} documentos del Bloque 02 generados correctamente\n\n${data.nota}`)

        const nuevosDocs: Documento[] = data.documentos.map((doc: any, index: number) => ({
          id: `bloque02-${index}`,
          titulo: doc.nombre,
          descripcion: 'Documento profesional genérico de Custodia360',
          tipo: 'pdf',
          categoria: 'Planes y Guías',
          carpeta: '02_Planes_y_Guias',
          url: doc.pdf,
          tamano: 'PDF + DOCX'
        }))

        setDocumentos([...documentos, ...nuevosDocs])
      } else {
        throw new Error('Error generando documentos')
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error generando documentos')
    } finally {
      setGenerando(false)
    }
  }

  const generarBloque03 = async () => {
    setGenerando(true)
    try {
      const response = await fetch('/api/admin/generate-bloque-03', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ ${data.total} documentos del Bloque 03 generados correctamente`)

        const nuevosDocs: Documento[] = data.documentos.map((doc: any, index: number) => ({
          id: `bloque03-${index}`,
          titulo: doc.nombre,
          descripcion: 'Documento técnico de análisis de riesgos - Custodia360',
          tipo: 'pdf',
          categoria: 'Análisis de Riesgos',
          carpeta: '03_Analisis_de_Riesgos',
          url: doc.pdf,
          tamano: 'PDF + DOCX'
        }))

        setDocumentos([...documentos, ...nuevosDocs])
      } else {
        throw new Error('Error generando documentos')
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error generando documentos')
    } finally {
      setGenerando(false)
    }
  }

  const generarBloque04 = async () => {
    setGenerando(true)
    try {
      const response = await fetch('/api/admin/generate-bloque-04', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ ${data.total} protocolos del Bloque 04 generados correctamente`)

        const nuevosDocs: Documento[] = data.documentos.map((doc: any, index: number) => ({
          id: `bloque04-${index}`,
          titulo: doc.nombre,
          descripcion: 'Protocolo operativo de actuación - Custodia360',
          tipo: 'pdf',
          categoria: 'Protocolos de Actuación',
          carpeta: '04_Protocolos_Actuacion',
          url: doc.pdf,
          tamano: 'PDF + DOCX'
        }))

        setDocumentos([...documentos, ...nuevosDocs])
      } else {
        throw new Error('Error generando documentos')
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error generando documentos')
    } finally {
      setGenerando(false)
    }
  }

  const generarBloque05 = async () => {
    setGenerando(true)
    try {
      const response = await fetch('/api/admin/generate-bloque-05', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ ${data.total} registros y formularios del Bloque 05 generados correctamente`)

        const nuevosDocs: Documento[] = data.documentos.map((doc: any, index: number) => ({
          id: `bloque05-${index}`,
          titulo: doc.nombre,
          descripcion: 'Registro o formulario oficial - Custodia360',
          tipo: 'pdf',
          categoria: 'Registros y Formularios',
          carpeta: '05_Registros_y_Formularios',
          url: doc.pdf,
          tamano: 'PDF + DOCX'
        }))

        setDocumentos([...documentos, ...nuevosDocs])
      } else {
        throw new Error('Error generando documentos')
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error generando documentos')
    } finally {
      setGenerando(false)
    }
  }

  const generarBloque06 = async () => {
    setGenerando(true)
    try {
      const response = await fetch('/api/admin/generate-bloque-06', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ ${data.total} documentos formativos del Bloque 06 generados correctamente`)

        const nuevosDocs: Documento[] = data.documentos.map((doc: any, index: number) => ({
          id: `bloque06-${index}`,
          titulo: doc.nombre,
          descripcion: 'Documento formativo LOPIVI - Custodia360',
          tipo: 'pdf',
          categoria: 'Formación y Concienciación',
          carpeta: '06_Formacion_y_Concienciacion',
          url: doc.pdf,
          tamano: 'PDF + DOCX'
        }))

        setDocumentos([...documentos, ...nuevosDocs])
      } else {
        throw new Error('Error generando documentos')
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error generando documentos')
    } finally {
      setGenerando(false)
    }
  }

  const generarBloque07 = async () => {
    setGenerando(true)
    try {
      const response = await fetch('/api/admin/generate-bloque-07', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ ${data.total} documentos de comunicación del Bloque 07 generados correctamente`)

        const nuevosDocs: Documento[] = data.documentos.map((doc: any, index: number) => ({
          id: `bloque07-${index}`,
          titulo: doc.nombre,
          descripcion: 'Documento de comunicación y participación - Custodia360',
          tipo: 'pdf',
          categoria: 'Comunicación y Participación',
          carpeta: '07_Comunicacion_y_Participacion',
          url: doc.pdf,
          tamano: 'PDF + DOCX'
        }))

        setDocumentos([...documentos, ...nuevosDocs])
      } else {
        throw new Error('Error generando documentos')
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error generando documentos')
    } finally {
      setGenerando(false)
    }
  }

  const generarBloque08 = async () => {
    setGenerando(true)
    try {
      const response = await fetch('/api/admin/generate-bloque-08', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ ${data.total} documentos de auditoría del Bloque 08 generados correctamente`)

        const nuevosDocs: Documento[] = data.documentos.map((doc: any, index: number) => ({
          id: `bloque08-${index}`,
          titulo: doc.nombre,
          descripcion: 'Documento de auditoría y mejora continua - Custodia360',
          tipo: 'pdf',
          categoria: 'Auditorías y Mejora',
          carpeta: '08_Auditorias_y_Mejora',
          url: doc.pdf,
          tamano: 'PDF + DOCX'
        }))

        setDocumentos([...documentos, ...nuevosDocs])
      } else {
        throw new Error('Error generando documentos')
      }
    } catch (error) {
      console.error(error)
      alert('❌ Error generando documentos')
    } finally {
      setGenerando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href="/dashboard-custodia360"
                  className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
                >
                  ← Volver al Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                  Plantillas y Documentos
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Biblioteca completa de recursos, plantillas y documentación técnica LOPIVI
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={generarBloque01}
                  disabled={generando}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {generando ? 'Generando...' : 'Bloque 01'}
                </button>
                <button
                  onClick={generarBloque02}
                  disabled={generando}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {generando ? 'Generando...' : 'Bloque 02'}
                </button>
                <button
                  onClick={generarBloque03}
                  disabled={generando}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {generando ? 'Generando...' : 'Bloque 03'}
                </button>
                <button
                  onClick={generarBloque04}
                  disabled={generando}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {generando ? 'Generando...' : 'Bloque 04'}
                </button>
                <button
                  onClick={generarBloque05}
                  disabled={generando}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {generando ? 'Generando...' : 'Bloque 05'}
                </button>
                <button
                  onClick={generarBloque06}
                  disabled={generando}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {generando ? 'Generando...' : 'Bloque 06'}
                </button>
                <button
                  onClick={generarBloque07}
                  disabled={generando}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {generando ? 'Generando...' : 'Bloque 07'}
                </button>
                <button
                  onClick={generarBloque08}
                  disabled={generando}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {generando ? 'Generando...' : 'Bloque 08'}
                </button>
                <Link
                  href="/admin/plantillas-y-documentos/09_Comercial_y_Corporativo"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-center"
                >
                  Bloque 09
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {carpetaActiva && (
          <div className="mb-6">
            <button
              onClick={() => setCarpetaActiva(null)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ← Volver a todas las carpetas
            </button>
          </div>
        )}

        {!carpetaActiva && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carpetas.map(carpeta => {
              // Bloque 09 tiene página dedicada
              if (carpeta.id === '09_Comercial_y_Corporativo') {
                return (
                  <Link
                    key={carpeta.id}
                    href="/admin/plantillas-y-documentos/09_Comercial_y_Corporativo"
                    className={`${carpeta.color} border-2 rounded-lg p-6 text-left hover:shadow-lg transition-all block`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs bg-white px-2 py-1 rounded-full font-medium">
                        {carpeta.documentos} docs
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {carpeta.nombre}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {carpeta.descripcion}
                    </p>
                    {carpeta.nota && (
                      <p className="text-xs text-blue-600 mt-2 italic">
                        {carpeta.nota}
                      </p>
                    )}
                  </Link>
                )
              }

              // Resto de carpetas funcionan como antes
              return (
                <button
                  key={carpeta.id}
                  onClick={() => setCarpetaActiva(carpeta.id)}
                  className={`${carpeta.color} border-2 rounded-lg p-6 text-left hover:shadow-lg transition-all`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs bg-white px-2 py-1 rounded-full font-medium">
                      {carpeta.documentos} docs
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {carpeta.nombre}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {carpeta.descripcion}
                  </p>
                  {carpeta.nota && (
                    <p className="text-xs text-blue-600 mt-2 italic">
                      {carpeta.nota}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {carpetaActiva && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {carpetas.find(c => c.id === carpetaActiva)?.nombre}
              </h2>
              <p className="text-gray-600">
                {carpetas.find(c => c.id === carpetaActiva)?.descripcion}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentos.filter(doc => doc.carpeta === carpetaActiva).length === 0 ? (
                <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                  <p className="text-yellow-800 font-medium">
                    Los documentos de esta carpeta se están generando...
                  </p>
                  <p className="text-sm text-yellow-700 mt-2">
                    Haz clic en "Generar Bloque 01" para crear todos los documentos.
                  </p>
                </div>
              ) : (
                documentos.filter(doc => doc.carpeta === carpetaActiva).map(doc => (
                  <div key={doc.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full uppercase">
                        {doc.tipo}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {doc.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {doc.descripcion}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{doc.tamano}</span>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Descargar →
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Sobre esta biblioteca de recursos
          </h3>
          <p className="text-blue-800 text-sm mb-3">
            Todos los documentos y plantillas están diseñados para facilitar el cumplimiento LOPIVI
            de forma práctica y profesional. Los archivos están disponibles en PDF (lectura) y DOCX (editable).
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>Documentos genéricos adaptables a cualquier entidad</li>
            <li>Formato profesional con logotipo Custodia360</li>
            <li>Versión actual: v1.0 — {new Date().toLocaleDateString('es-ES')}</li>
            <li>Descarga instantánea desde Supabase Storage</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
