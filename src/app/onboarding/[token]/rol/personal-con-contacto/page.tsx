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

export default function PersonalConContactoPage({ params }: PageProps) {
  const router = useRouter()
  const { token } = params

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [entity, setEntity] = useState<EntityData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [personId, setPersonId] = useState<string | null>(null)

  // Formulario
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [documento, setDocumento] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [puesto, setPuesto] = useState('')
  const [lugar, setLugar] = useState('')
  const [horario, setHorario] = useState('')
  const [penalesEntregado, setPenalesEntregado] = useState(false)

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

    if (!nombre || !apellidos || !documento || !email || !puesto || !lugar || !horario) {
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
          action: 'save_personal_contacto',
          data: {
            nombre,
            apellidos,
            documento,
            email,
            telefono,
            puesto,
            lugar,
            horario,
            penales_entregado: penalesEntregado
          }
        })
      })

      const data = await res.json()

      if (!data.ok) {
        setError(data.error || 'Error al guardar')
        setSaving(false)
        return
      }

      setPersonId(data.person_id)
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

  if (saved && personId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">✅ Datos guardados correctamente</h1>
              <p className="text-lg text-gray-600 mb-4">Gracias por registrarte, {nombre}</p>
            </div>

            {!penalesEntregado && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Recordatorio:</strong> Tienes 30 días para entregar tu certificado negativo de delitos sexuales.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">📝 Siguiente paso: Test LOPIVI</h2>
              <p className="text-gray-700 mb-4">
                Para completar tu registro, debes realizar el test de conocimientos LOPIVI (10 preguntas, necesitas ≥75% para aprobar).
              </p>
              <Link
                href={`/onboarding/${token}/quiz?as=contacto&person_id=${personId}`}
                className="inline-block w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold text-center"
              >
                Iniciar Test LOPIVI →
              </Link>
            </div>

            {entity?.canal_tipo && entity?.canal_valor && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">📞 Canal de comunicación</h3>
                <p className="text-sm text-gray-700">
                  {entity.canal_tipo === 'email' ? '✉️ Email' : '📱 Teléfono'}: <strong>{entity.canal_valor}</strong>
                </p>
              </div>
            )}

            {!entity?.canal_tipo && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  El delegado configurará próximamente el canal de comunicación para casos de violencia.
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <Link href={`/onboarding/${token}`} className="text-orange-600 hover:text-orange-700 font-medium">
              ← Volver a selección de roles
            </Link>
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
            👤 Personal con Contacto Habitual
          </h1>
          <p className="text-lg text-gray-600 mb-2">Entidad: {entity?.nombre}</p>
          <Link href={`/onboarding/${token}`} className="text-orange-600 hover:text-orange-700 font-medium text-sm">
            ← Volver a roles
          </Link>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
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
                DNI/NIE <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="12345678A"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
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
          </div>

          <div className="mb-6 border-t pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información laboral</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puesto / Función <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={puesto}
                onChange={(e) => setPuesto(e.target.value)}
                placeholder="Ej: Monitor deportivo, educador/a, profesor/a..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lugar / Centro <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                placeholder="Ej: Instalación deportiva, aula 3B, sede central..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horario / Actividad <span className="text-red-500">*</span>
              </label>
              <textarea
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                placeholder="Ej: Lunes a viernes 16:00-20:00, actividad de natación..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-6 border-t pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Certificado de penales</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                El certificado negativo de delitos sexuales es <strong>obligatorio</strong> para personal con contacto habitual con menores (LOPIVI Art. 13).
              </p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="penales"
                checked={penalesEntregado}
                onChange={(e) => setPenalesEntregado(e.target.checked)}
                className="w-5 h-5 mt-1 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="penales" className="text-gray-700 font-medium">
                He entregado mi certificado negativo de delitos sexuales
              </label>
            </div>

            {!penalesEntregado && (
              <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-500 p-3">
                <p className="text-sm text-yellow-700">
                  Puedes continuar con el registro. Tendrás 30 días para entregar el certificado.
                </p>
              </div>
            )}
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
            {saving ? 'Guardando...' : 'Guardar datos'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Sistema de protección de la infancia · Cumplimiento LOPIVI</p>
        </div>
      </div>
    </div>
  )
}
