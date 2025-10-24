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

interface Child {
  id: string
  nombre: string
  fecha_nacimiento: string
  curso: string
  alergias: string
  permiso_imagenes: boolean
}

export default function FamiliaPage({ params }: PageProps) {
  const router = useRouter()
  const { token } = params

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [entity, setEntity] = useState<EntityData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Formulario tutor
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')

  // Hijos
  const [children, setChildren] = useState<Child[]>([
    { id: '1', nombre: '', fecha_nacimiento: '', curso: '', alergias: '', permiso_imagenes: true }
  ])

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

  function addChild() {
    const newId = (children.length + 1).toString()
    setChildren([...children, {
      id: newId,
      nombre: '',
      fecha_nacimiento: '',
      curso: '',
      alergias: '',
      permiso_imagenes: true
    }])
  }

  function removeChild(id: string) {
    if (children.length === 1) {
      alert('Debe haber al menos un hijo/a')
      return
    }
    setChildren(children.filter(c => c.id !== id))
  }

  function updateChild(id: string, field: keyof Child, value: string | boolean) {
    setChildren(children.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!nombre || !apellidos) {
      alert('Por favor, completa los datos del tutor')
      return
    }

    // Validar que todos los hijos tengan datos obligatorios
    for (const child of children) {
      if (!child.nombre || !child.fecha_nacimiento || !child.curso) {
        alert(`Por favor, completa todos los campos obligatorios de ${child.nombre || 'cada hijo/a'}`)
        return
      }
    }

    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          action: 'save_familia',
          data: {
            nombre,
            apellidos,
            email: email || null,
            telefono: telefono || null
          },
          children: children.map(c => ({
            nombre: c.nombre,
            fecha_nacimiento: c.fecha_nacimiento,
            curso: c.curso,
            alergias: c.alergias || null,
            permiso_imagenes: c.permiso_imagenes
          }))
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
            <p className="text-lg text-gray-600 mb-4">
              Gracias por registrarte, {nombre}
            </p>
            <p className="text-gray-600 mb-6">
              Hemos registrado {children.length} {children.length === 1 ? 'hijo/a' : 'hijos/as'}.
              {email && ' Te enviaremos una confirmación por email.'}
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-full px-6 py-3 shadow-md mb-4">
            <span className="text-2xl font-bold text-orange-600">C360</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👨‍👩‍👧 Familias / Tutores
          </h1>
          <p className="text-lg text-gray-600 mb-2">Entidad: {entity?.nombre}</p>
          <Link href={`/onboarding/${token}`} className="text-orange-600 hover:text-orange-700 font-medium text-sm">
            ← Volver a roles
          </Link>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Paso 1: Tutor */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Paso 1: Datos del tutor/a</h2>

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

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-orange-600">(recomendado)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Para recibir confirmaciones</p>
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

          {/* Paso 2: Hijos */}
          <div className="border-t pt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Paso 2: Datos de los hijos/as</h2>
              <button
                type="button"
                onClick={addChild}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
              >
                + Añadir hijo/a
              </button>
            </div>

            {children.map((child, index) => (
              <div key={child.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Hijo/a {index + 1}</h3>
                  {children.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChild(child.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={child.nombre}
                      onChange={(e) => updateChild(child.id, 'nombre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de nacimiento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={child.fecha_nacimiento}
                      onChange={(e) => updateChild(child.id, 'fecha_nacimiento', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curso / Grupo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={child.curso}
                    onChange={(e) => updateChild(child.id, 'curso', e.target.value)}
                    placeholder="Ej: 3º ESO, Infantil 4 años, Grupo A..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alergias / Observaciones médicas
                  </label>
                  <textarea
                    value={child.alergias}
                    onChange={(e) => updateChild(child.id, 'alergias', e.target.value)}
                    placeholder="Opcional: alergias alimentarias, medicamentos, etc."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`permiso-${child.id}`}
                    checked={child.permiso_imagenes}
                    onChange={(e) => updateChild(child.id, 'permiso_imagenes', e.target.checked)}
                    className="w-5 h-5 mt-1 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor={`permiso-${child.id}`} className="text-sm text-gray-700">
                    Autorizo el uso de imágenes para fines educativos y de difusión de la entidad
                  </label>
                </div>
              </div>
            ))}
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
