'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: {
    token: string
  }
}

interface EntityData {
  nombre: string
  sector_code: string
  canal_tipo: string | null
  canal_valor: string | null
}

export default function PersonalSinContactoPage({ params }: PageProps) {
  const router = useRouter()
  const { token } = params

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [entity, setEntity] = useState<EntityData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Formulario
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [area, setArea] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')

  useEffect(() => {
    async function validateToken() {
      try {
        const res = await fetch(`/api/onboarding/resolve?token=${token}`)
        const data = await res.json()

        if (!data.ok) {
          setError(data.error || 'Token inválido o expirado')
          setLoading(false)
          return
        }

        setEntity(data.entity)
        setLoading(false)
      } catch (err) {
        console.error('Error validando token:', err)
        setError('Error de conexión')
        setLoading(false)
      }
    }

    validateToken()
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!nombre || !apellidos || !area) {
      alert('Por favor, completa todos los campos obligatorios')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          action: 'save_personal_sin_contacto',
          data: {
            nombre,
            apellidos,
            area,
            email: email || null,
            telefono: telefono || null
          }
        })
      })

      const data = await res.json()

      if (!data.ok) {
        setError(data.error || 'Error al guardar')
        setSaving(false)
        return
      }

      setSaved(true)
      setSaving(false)
    } catch (err) {
      console.error('Error guardando datos:', err)
      setError('Error de conexión')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Validando enlace...</p>
        </div>
      </div>
    )
  }

  if (error && !entity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Enlace no válido</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  if (saved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">✅ Registro completado</h1>
            <p className="text-lg text-gray-600 mb-6">
              Gracias por registrarte, {nombre}. Tus datos han sido enviados correctamente.
            </p>

            {entity?.canal_tipo && entity?.canal_valor && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">📞 Canal de comunicación</h3>
                <p className="text-sm text-gray-700">
                  {entity.canal_tipo === 'email' ? '✉️ Email' : '📱 Teléfono'}: <strong>{entity.canal_valor}</strong>
                </p>
              </div>
            )}

            {!entity?.canal_tipo && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  El delegado configurará próximamente el canal de comunicación para casos de violencia.
                </p>
              </div>
            )}

            <div className="mt-6">
              <Link
                href={`/onboarding/${token}`}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                ← Volver a selección de roles
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-full px-6 py-3 shadow-md mb-4">
            <span className="text-2xl font-bold text-orange-600">C360</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Personal sin Contacto Habitual
          </h1>
          <p className="text-lg text-gray-600 mb-2">Entidad: {entity?.nombre}</p>
          <Link href={`/onboarding/${token}`} className="text-orange-600 hover:text-orange-700 font-medium text-sm">
            ← Volver a roles
          </Link>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Esta categoría es para personal que <strong>no tiene contacto habitual</strong> con menores
            (personal administrativo, mantenimiento, servicios auxiliares, etc.).
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Datos personales</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellidos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área / Puesto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Ej: Administración, mantenimiento, limpieza..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (opcional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Sistema de protección de la infancia · Cumplimiento LOPIVI</p>
        </div>
      </div>
    </div>
  )
}
