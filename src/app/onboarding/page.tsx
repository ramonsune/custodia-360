'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface FormData {
  entity_name: string
  cif: string
  email: string
  phone: string
  street: string
  city: string
  postal_code: string
  province: string
  password: string
  password_confirm: string
  accept_terms: boolean
}

export default function ContratarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    entity_name: '',
    cif: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postal_code: '',
    province: '',
    password: '',
    password_confirm: '',
    accept_terms: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = (): boolean => {
    // Required fields
    if (!formData.entity_name.trim()) {
      setError('La razón social es obligatoria')
      return false
    }

    if (!formData.email.trim()) {
      setError('El email es obligatorio')
      return false
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido')
      return false
    }

    // Password validation
    if (!formData.password || formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return false
    }

    if (formData.password !== formData.password_confirm) {
      setError('Las contraseñas no coinciden')
      return false
    }

    if (!formData.accept_terms) {
      setError('Debes aceptar los términos y condiciones')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      // Preparar datos
      const payload = {
        entity_name: formData.entity_name.trim(),
        cif: formData.cif.trim() || null,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        address: {
          street: formData.street.trim() || null,
          city: formData.city.trim() || null,
          postal_code: formData.postal_code.trim() || null,
          province: formData.province.trim() || null,
          country: 'España'
        },
        password: formData.password
      }

      // Llamar API checkout
      const response = await fetch('/api/checkout/create-1eur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al procesar la solicitud')
      }

      if (!result.url) {
        throw new Error('No se recibió URL de checkout')
      }

      // Redirigir a Stripe Checkout
      window.location.href = result.url

    } catch (err: any) {
      console.error('Error en contratación:', err)
      setError(err.message || 'Error al procesar la solicitud. Inténtalo de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
              C
            </div>
            <span className="text-2xl font-bold text-gray-900">Custodia360</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contrata Custodia360
          </h1>
          <p className="text-gray-600">
            Implementa LOPIVI en tu entidad en 72 horas
          </p>
          <div className="mt-4 inline-flex items-center bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <span className="text-2xl font-bold text-blue-600 mr-2">1,00 €</span>
            <span className="text-sm text-blue-800">Pago único de alta</span>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white shadow-xl rounded-lg p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos de la Entidad */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos de la Entidad</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="entity_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Razón Social <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="entity_name"
                    name="entity_name"
                    value={formData.entity_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre de tu entidad"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cif" className="block text-sm font-medium text-gray-700 mb-1">
                    CIF (opcional)
                  </label>
                  <input
                    type="text"
                    id="cif"
                    name="cif"
                    value={formData.cif}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="A12345678"
                  />
                </div>
              </div>
            </div>

            {/* Datos de Contacto */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos de Contacto</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="tu@email.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este será tu email de acceso a la plataforma
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dirección (opcional)</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Calle
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Calle Principal, 123"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Madrid"
                    />
                  </div>

                  <div>
                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      id="postal_code"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="28001"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                    Provincia
                  </label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Madrid"
                  />
                </div>
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contraseña de Acceso</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password_confirm"
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Repite la contraseña"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Términos */}
            <div className="border-t border-gray-200 pt-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  id="accept_terms"
                  name="accept_terms"
                  checked={formData.accept_terms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">
                  Acepto los <Link href="/terminos" className="text-blue-600 hover:underline">términos y condiciones</Link> y la <Link href="/privacidad" className="text-blue-600 hover:underline">política de privacidad</Link> de Custodia360
                  <span className="text-red-500"> *</span>
                </span>
              </label>
            </div>

            {/* Botón Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  'Contratar ahora (1,00 €)'
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Serás redirigido a Stripe para completar el pago de forma segura
              </p>
            </div>
          </form>
        </div>

        {/* Info adicional */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">¿Qué incluye el alta?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Acceso inmediato a la formación LOPIVI</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Certificación oficial de Delegado de Protección</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Panel de gestión completo desde el primer día</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Soporte técnico durante todo el proceso</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
