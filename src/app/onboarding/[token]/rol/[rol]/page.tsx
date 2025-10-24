'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface RolPageProps {
  params: {
    token: string
    rol: string
  }
}

interface EntityData {
  nombre: string
  sector_code: string
  canal_tipo: string | null
  canal_valor: string | null
}

// Configuración de roles válidos
const ROLES_CONFIG = {
  'personal-con-contacto': {
    titulo: 'Personal con Contacto',
    descripcion: 'Registro para personal con contacto habitual con menores',
    icono: '👤'
  },
  'personal-sin-contacto': {
    titulo: 'Personal sin Contacto',
    descripcion: 'Registro para personal sin contacto directo con menores',
    icono: '🔧'
  },
  'familia': {
    titulo: 'Familias / Tutores',
    descripcion: 'Registro para padres, madres y tutores legales',
    icono: '👨‍👩‍👧'
  },
  'directiva': {
    titulo: 'Directiva / Junta',
    descripcion: 'Registro para miembros de la directiva o junta',
    icono: '👔'
  }
} as const

type RolType = keyof typeof ROLES_CONFIG

export default function RolPage({ params }: RolPageProps) {
  const router = useRouter()
  const { token, rol } = params

  const [loading, setLoading] = useState(true)
  const [entityData, setEntityData] = useState<EntityData | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Formulario común
  const [nombre, setNombre] = useState('')
  const [dni, setDni] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cargo, setCargo] = useState('')

  // Personal con/sin contacto
  const [aceptaCodigo, setAceptaCodigo] = useState(false)
  const [certificadoPDF, setCertificadoPDF] = useState<File | null>(null)
  const [aceptaFormacion, setAceptaFormacion] = useState(false)

  // Personal SIN contacto - checkbox opcional
  const [haEntregadoCertificado, setHaEntregadoCertificado] = useState(false)

  // Familias
  const [nombresMenores, setNombresMenores] = useState('')
  const [autorizacionImagen, setAutorizacionImagen] = useState(false)
  const [consentimientoCanal, setConsentimientoCanal] = useState(false)

  // Directiva
  const [tieneContactoOcasional, setTieneContactoOcasional] = useState<boolean | null>(null)

  useEffect(() => {
    verificarToken()
  }, [token])

  async function verificarToken() {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || window.location.origin
      const res = await fetch(`${baseUrl}/api/onboarding/resolve?token=${encodeURIComponent(token)}`)

      if (!res.ok) {
        router.push(`/onboarding/${token}`)
        return
      }

      const data = await res.json()

      if (!data.ok || !data.entity) {
        router.push(`/onboarding/${token}`)
        return
      }

      setEntityData(data.entity)
      setLoading(false)
    } catch (error) {
      console.error('Error verificando token:', error)
      router.push(`/onboarding/${token}`)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === 'application/pdf') {
        setCertificadoPDF(file)
      } else {
        alert('Solo se permiten archivos PDF')
        e.target.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!nombre || !dni || !email || !telefono) {
      alert('Por favor, completa todos los campos obligatorios')
      return
    }

    // Validaciones específicas por rol
    if (rol === 'personal-con-contacto') {
      if (!cargo || !aceptaCodigo || !certificadoPDF || !aceptaFormacion) {
        alert('Por favor, completa todos los campos obligatorios para personal con contacto')
        return
      }
    }

    if (rol === 'personal-sin-contacto') {
      if (!cargo || !aceptaCodigo) {
        alert('Por favor, completa todos los campos obligatorios')
        return
      }
    }

    if (rol === 'familia') {
      if (!nombresMenores || !autorizacionImagen || !consentimientoCanal) {
        alert('Por favor, completa todos los campos obligatorios para familias')
        return
      }
    }

    if (rol === 'directiva') {
      if (tieneContactoOcasional === null || !cargo || !aceptaCodigo || !aceptaFormacion) {
        alert('Por favor, completa todos los campos obligatorios')
        return
      }
      if (tieneContactoOcasional && !certificadoPDF) {
        alert('Debes subir el certificado de penales si tienes contacto ocasional con menores')
        return
      }
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('token', token)
      formData.append('rol', rol)
      formData.append('nombre', nombre)
      formData.append('dni', dni)
      formData.append('email', email)
      formData.append('telefono', telefono)

      if (cargo) formData.append('cargo', cargo)
      if (nombresMenores) formData.append('nombres_menores', nombresMenores)

      formData.append('acepta_codigo', aceptaCodigo.toString())
      formData.append('acepta_formacion', aceptaFormacion.toString())
      formData.append('autorizacion_imagen', autorizacionImagen.toString())
      formData.append('consentimiento_canal', consentimientoCanal.toString())
      formData.append('ha_entregado_certificado', haEntregadoCertificado.toString())

      if (tieneContactoOcasional !== null) {
        formData.append('tiene_contacto_ocasional', tieneContactoOcasional.toString())
      }

      if (certificadoPDF) {
        formData.append('certificado_pdf', certificadoPDF)
      }

      const res = await fetch('/api/onboarding/register', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (data.ok) {
        // Redirigir a página de confirmación
        router.push(`/onboarding/${token}/confirmacion`)
      } else {
        alert(data.error || 'Error al procesar el registro')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al enviar el formulario')
    } finally {
      setSubmitting(false)
    }
  }

  // Validar que el rol sea válido
  if (!loading && !ROLES_CONFIG[rol as RolType]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rol no válido</h2>
          <p className="text-gray-600 mb-6">El rol seleccionado no es válido</p>
          <Link
            href={`/onboarding/${token}`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Volver a selección
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    )
  }

  const rolConfig = ROLES_CONFIG[rol as RolType]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href={`/onboarding/${token}`}
            className="inline-block text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Volver a selección de rol
          </Link>

          <div className="inline-block bg-white rounded-full px-6 py-3 shadow-md mb-6">
            <span className="text-2xl font-bold text-blue-600">C360</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {rolConfig.titulo}
          </h1>

          <p className="text-gray-600 mb-2">{entityData?.nombre}</p>
          <p className="text-sm text-gray-500">{rolConfig.descripcion}</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Campos comunes */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Datos Personales</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI / NIE <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Campos específicos por rol */}
            {(rol === 'personal-con-contacto' || rol === 'personal-sin-contacto' || rol === 'directiva') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo / Función {rol === 'directiva' ? 'en la directiva' : ''} <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder={rol === 'directiva' ? 'Ej: Presidente, Tesorero, Vocal...' : 'Ej: Entrenador, Monitor, Administrativo...'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            {rol === 'familia' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre(s) del/los menor(es) <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={nombresMenores}
                  onChange={(e) => setNombresMenores(e.target.value)}
                  placeholder="Nombre de tu(s) hijo/a(s)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  required
                />
              </div>
            )}

            {/* DIRECTIVA - Pregunta sobre contacto ocasional */}
            {rol === 'directiva' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  ¿Tienes contacto ocasional con menores? <span className="text-red-600">*</span>
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  (Ej: visitas a instalaciones, asistencia a eventos, actividades con menores presentes)
                </p>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="contacto_ocasional"
                      checked={tieneContactoOcasional === true}
                      onChange={() => setTieneContactoOcasional(true)}
                      className="mr-3"
                      required
                    />
                    <span className="text-gray-700">Sí, tengo contacto ocasional con menores</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="contacto_ocasional"
                      checked={tieneContactoOcasional === false}
                      onChange={() => setTieneContactoOcasional(false)}
                      className="mr-3"
                      required
                    />
                    <span className="text-gray-700">No, mis funciones son puramente administrativas</span>
                  </label>
                </div>
              </div>
            )}

            {/* CERTIFICADO DE PENALES */}
            {(rol === 'personal-con-contacto' || (rol === 'directiva' && tieneContactoOcasional === true)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificado Negativo de Delitos Sexuales (PDF) <span className="text-red-600">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Puedes obtenerlo en: <a href="https://sede.mjusticia.gob.es" target="_blank" className="text-blue-600 hover:underline">sede.mjusticia.gob.es</a>
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                {certificadoPDF && (
                  <p className="text-sm text-green-600 mt-2">✓ {certificadoPDF.name}</p>
                )}
              </div>
            )}

            {/* Personal SIN contacto - Checkbox opcional certificado */}
            {rol === 'personal-sin-contacto' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={haEntregadoCertificado}
                    onChange={(e) => setHaEntregadoCertificado(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    He entregado / entregaré el certificado negativo de delitos sexuales (opcional)
                  </span>
                </label>
              </div>
            )}

            {/* FAMILIAS - Guía + Autorizaciones */}
            {rol === 'familia' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-green-900">Información Importante para Familias</h4>

                <div className="text-sm text-green-800 space-y-2">
                  <p><strong>¿Qué hacer si tu hijo/a te comunica algo preocupante?</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Escucha sin juzgar, mantén la calma</li>
                    <li>No interrogues, deja que se exprese libremente</li>
                    <li>Contacta inmediatamente con el Delegado/a de Protección</li>
                    <li>No confrontes al presunto agresor</li>
                  </ul>
                </div>

                <a
                  href="/docs/guia-familias-lopivi.pdf"
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar Guía Completa para Familias (PDF)
                </a>
              </div>
            )}

            {/* CHECKBOXES DE ACEPTACIÓN */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Compromisos y Autorizaciones</h3>

              {(rol === 'personal-con-contacto' || rol === 'personal-sin-contacto' || rol === 'directiva') && (
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aceptaCodigo}
                    onChange={(e) => setAceptaCodigo(e.target.checked)}
                    className="mt-1 mr-3"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    <strong className="text-gray-900">Acepto el Código de Conducta</strong> de {entityData?.nombre} y me comprometo a cumplir con todos los protocolos de protección infantil LOPIVI <span className="text-red-600">*</span>
                  </span>
                </label>
              )}

              {(rol === 'personal-con-contacto' || rol === 'directiva') && (
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aceptaFormacion}
                    onChange={(e) => setAceptaFormacion(e.target.checked)}
                    className="mt-1 mr-3"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    <strong className="text-gray-900">Me comprometo a completar la formación LOPIVI</strong> obligatoria en los plazos establecidos por la entidad <span className="text-red-600">*</span>
                  </span>
                </label>
              )}

              {rol === 'familia' && (
                <>
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autorizacionImagen}
                      onChange={(e) => setAutorizacionImagen(e.target.checked)}
                      className="mt-1 mr-3"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      <strong className="text-gray-900">Autorizo el uso de imagen</strong> de mi(s) hijo/a(s) para actividades internas de la entidad según la política de privacidad <span className="text-red-600">*</span>
                    </span>
                  </label>

                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentimientoCanal}
                      onChange={(e) => setConsentimientoCanal(e.target.checked)}
                      className="mt-1 mr-3"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      <strong className="text-gray-900">Acepto recibir comunicaciones</strong> del canal oficial de la entidad (email/WhatsApp) sobre actividades y protección infantil <span className="text-red-600">*</span>
                    </span>
                  </label>
                </>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-6">
              <Link
                href={`/onboarding/${token}`}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enviando...' : 'Completar Registro'}
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Sistema de protección de la infancia · Cumplimiento LOPIVI</p>
        </div>
      </div>
    </div>
  )
}
