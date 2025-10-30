'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface LogoConfig {
  id: string
  nombre: string
  sector: string
  tipo: 'logo_custodia' | 'logo_entidad' | 'sello_oficial' | 'firma_digital' | 'marca_agua'
  url_actual: string
  tamaño: { ancho: number, alto: number }
  formato: string
  ultima_actualizacion: string
  activo: boolean
}

const SECTORES = {
  'global': {
    nombre: 'Global (Todas las entidades)',
    color: 'bg-purple-600',
    icon: '🌍'
  },
  'club-deportivo': {
    nombre: 'Club Deportivo',
    color: 'bg-blue-600',
    icon: '⚽'
  },
  'academia-deportiva': {
    nombre: 'Academia Deportiva',
    color: 'bg-green-600',
    icon: '🎾'
  },
  'centro-deportivo': {
    nombre: 'Centro Deportivo',
    color: 'bg-orange-600',
    icon: '🏊‍♂️'
  }
}

const TIPOS_LOGOS = {
  logo_custodia: {
    nombre: 'Logo Custodia360',
    descripcion: 'Logo principal de la empresa',
    recomendaciones: 'PNG transparente, 300x100px mínimo',
    obligatorio: true
  },
  logo_entidad: {
    nombre: 'Logo Entidad',
    descripcion: 'Logo personalizable por entidad',
    recomendaciones: 'PNG transparente, 200x200px',
    obligatorio: false
  },
  sello_oficial: {
    nombre: 'Sello Oficial',
    descripcion: 'Sello de certificación',
    recomendaciones: 'PNG, 150x150px, circular preferido',
    obligatorio: true
  },
  firma_digital: {
    nombre: 'Firma Digital',
    descripcion: 'Firma para validación de documentos',
    recomendaciones: 'PNG transparente, 250x80px',
    obligatorio: true
  },
  marca_agua: {
    nombre: 'Marca de Agua',
    descripcion: 'Marca de agua para fondo',
    recomendaciones: 'PNG transparente, baja opacidad',
    obligatorio: false
  }
}

export default function GestionLogosPage() {
  const [sectorSeleccionado, setSectorSeleccionado] = useState<string>('global')
  const [logos, setLogos] = useState<LogoConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingLogo, setUploadingLogo] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    cargarLogos()
  }, [])

  const cargarLogos = async () => {
    try {
      // Datos de ejemplo - en producción vendría de Supabase
      const logosEjemplo: LogoConfig[] = [
        {
          id: 'logo-custodia-global',
          nombre: 'Logo Custodia360 Principal',
          sector: 'global',
          tipo: 'logo_custodia',
          url_actual: '/logos/custodia360-logo.png',
          tamaño: { ancho: 300, alto: 100 },
          formato: 'PNG',
          ultima_actualizacion: new Date().toISOString(),
          activo: true
        },
        {
          id: 'sello-oficial-global',
          nombre: 'Sello Oficial LOPIVI',
          sector: 'global',
          tipo: 'sello_oficial',
          url_actual: '/logos/sello-lopivi.png',
          tamaño: { ancho: 150, alto: 150 },
          formato: 'PNG',
          ultima_actualizacion: new Date().toISOString(),
          activo: true
        },
        {
          id: 'logo-entidad-club',
          nombre: 'Logo Personalizable Club',
          sector: 'club-deportivo',
          tipo: 'logo_entidad',
          url_actual: '/logos/placeholder-club.png',
          tamaño: { ancho: 200, alto: 200 },
          formato: 'PNG',
          ultima_actualizacion: new Date().toISOString(),
          activo: true
        }
      ]

      setLogos(logosEjemplo)
    } catch (error) {
      console.error('Error cargando logos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (tipoLogo: string, file: File) => {
    setUploadingLogo(tipoLogo)

    try {
      // Crear preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // En producción, aquí subirías a Supabase Storage
      // const { data, error } = await supabase.storage
      //   .from('logos')
      //   .upload(`${sectorSeleccionado}/${tipoLogo}/${file.name}`, file)

      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Actualizar estado
      const nuevoLogo: LogoConfig = {
        id: `${tipoLogo}-${sectorSeleccionado}-${Date.now()}`,
        nombre: TIPOS_LOGOS[tipoLogo as keyof typeof TIPOS_LOGOS].nombre,
        sector: sectorSeleccionado,
        tipo: tipoLogo as any,
        url_actual: objectUrl,
        tamaño: { ancho: 0, alto: 0 }, // Se detectaría automáticamente
        formato: file.type.split('/')[1].toUpperCase(),
        ultima_actualizacion: new Date().toISOString(),
        activo: true
      }

      setLogos(prev => [...prev.filter(l => !(l.sector === sectorSeleccionado && l.tipo === tipoLogo)), nuevoLogo])

    } catch (error) {
      console.error('Error subiendo logo:', error)
      alert('Error subiendo el archivo')
    } finally {
      setUploadingLogo(null)
      setPreviewUrl(null)
    }
  }

  const logosPorSector = logos.filter(logo => logo.sector === sectorSeleccionado)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando gestión de logos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard-custodia360/pdfs" className="text-gray-500 hover:text-gray-700 mr-4">
                ← Volver a PDFs
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Gestión de Logos e Imágenes</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-sm text-gray-600">
          Panel Admin {'>'} Gestión PDFs {'>'} Logos e Imágenes {'>'} {SECTORES[sectorSeleccionado as keyof typeof SECTORES].nombre}
        </nav>
      </div>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

        {/* Selector de Sector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar Sector</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(SECTORES).map(([key, sector]) => (
              <button
                key={key}
                onClick={() => setSectorSeleccionado(key)}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  sectorSeleccionado === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{sector.icon}</div>
                <h3 className="text-sm font-medium text-gray-900">{sector.nombre}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {logos.filter(l => l.sector === key).length} logos
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Gestión de Logos */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">
            Logos para {SECTORES[sectorSeleccionado as keyof typeof SECTORES].nombre}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(TIPOS_LOGOS).map(([key, tipo]) => {
              const logoExistente = logosPorSector.find(l => l.tipo === key)
              const isUploading = uploadingLogo === key

              return (
                <div key={key} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{tipo.nombre}</h3>
                      {tipo.obligatorio && (
                        <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full mt-1">
                          Obligatorio
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{tipo.descripcion}</p>

                  {/* Preview del Logo Actual */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Actual
                    </label>
                    <div className="w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      {logoExistente ? (
                        <img
                          src={logoExistente.url_actual}
                          alt={logoExistente.nombre}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <div className="text-2xl mb-2">📸</div>
                          <p className="text-sm">Sin logo</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Información del Logo */}
                  {logoExistente && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Tamaño:</span>
                          <br />
                          {logoExistente.tamaño.ancho}x{logoExistente.tamaño.alto}px
                        </div>
                        <div>
                          <span className="font-medium">Formato:</span>
                          <br />
                          {logoExistente.formato}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Actualizado: {new Date(logoExistente.ultima_actualizacion).toLocaleString('es-ES')}
                      </div>
                    </div>
                  )}

                  {/* Recomendaciones */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Recomendaciones:</strong><br />
                      {tipo.recomendaciones}
                    </p>
                  </div>

                  {/* Upload */}
                  <div className="space-y-2">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileUpload(key, file)
                          }
                        }}
                        disabled={isUploading}
                        className="hidden"
                      />
                      <div className={`w-full px-4 py-2 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                        isUploading
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        {isUploading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                            <span className="text-blue-600">Subiendo...</span>
                          </div>
                        ) : (
                          <div>
                            <div className="text-xl mb-1">📁</div>
                            <span className="text-sm text-gray-600">
                              {logoExistente ? 'Cambiar archivo' : 'Subir archivo'}
                            </span>
                          </div>
                        )}
                      </div>
                    </label>

                    {logoExistente && (
                      <button
                        className="w-full px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm"
                        onClick={() => {
                          if (confirm('¿Estás seguro de eliminar este logo?')) {
                            setLogos(prev => prev.filter(l => l.id !== logoExistente.id))
                          }
                        }}
                      >
                        Eliminar Logo
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Información Global */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Información Importante</h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p><strong>Cambios Globales:</strong> Los logos del sector "Global" afectan a TODAS las entidades.</p>
            <p><strong>Cambios Específicos:</strong> Los logos por sector solo afectan a entidades de ese tipo.</p>
            <p><strong>Personalización:</strong> Las entidades pueden tener logos personalizados que sobrescriben los del sector.</p>
            <p><strong>Formatos soportados:</strong> PNG (recomendado), JPG, JPEG.</p>
            <p><strong>Tamaño máximo:</strong> 5MB por archivo.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
