'use client'

import { useState } from 'react'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    mensaje: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          empresa: '',
          mensaje: ''
        })
      } else {
        const data = await response.json()
        setError(data.error || 'Error al enviar el mensaje')
      }
    } catch (error) {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    // Resetear después de mostrar mensaje
    setTimeout(() => setIsSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-6">
            Contacta con <span className="text-blue-800">Custodia360</span>
          </h1>
          <p className="text-xl text-gray-600">
            ¿Tienes dudas sobre LOPIVI? ¿Necesitas ayuda para elegir tu plan? Estamos aquí para ayudarte.
          </p>
        </div>
      </section>

      {/* Formulario */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Información de contacto */}
            <div>
              <h2 className="text-3xl font-bold text-gray-700 mb-6">Hablemos</h2>
              <p className="text-gray-600 mb-8">
                Nuestro equipo está disponible para resolver todas tus dudas y ayudarte a proteger tu entidad.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-700">Email</h3>
                  <p className="text-gray-600">info@custodia360.com</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-700">Teléfono</h3>
                  <p className="text-gray-600">678 771 198</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-700">Horario</h3>
                  <p className="text-gray-600">Lunes a Viernes, 9:00 - 18:00</p>
                </div>
              </div>


            </div>

            {/* Formulario */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-700 mb-6">Envíanos un mensaje</h3>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="678 771 198"
                  />
                </div>

                <div>
                  <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa/Entidad
                  </label>
                  <input
                    type="text"
                    id="empresa"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Nombre de tu entidad"
                  />
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-800 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando...' : 'Enviar mensaje'}
                </button>

                {isSuccess && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-800 text-center">
                    ¡Mensaje enviado! Te responderemos en 24 horas.
                  </div>
                )}
              </form>

              <p className="text-sm text-gray-500 mt-4">
                * Campos obligatorios. Tus datos están protegidos según nuestra política de privacidad.
              </p>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}
