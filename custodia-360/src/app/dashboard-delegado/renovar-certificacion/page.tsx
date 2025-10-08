'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  permisos: string[]
  certificacionVigente: boolean
  inicioSesion: string
  expiracion: string
}

export default function RenovarCertificacionDelegado() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mostrarNuevaTarjeta, setMostrarNuevaTarjeta] = useState(false)
  const [procesandoPago, setProcesandoPago] = useState(false)

  // Verificar sesión al cargar
  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (session) {
      try {
        const data = JSON.parse(session)

        // Verificar expiración de sesión
        if (data.expiracion && new Date(data.expiracion) <= new Date()) {
          localStorage.removeItem('userSession')
          router.push('/login-delegados')
          return
        }

        if (data.tipo !== 'principal') {
          router.push('/')
          return
        }

        setSessionData(data)
      } catch (error) {
        localStorage.removeItem('userSession')
        router.push('/login-delegados')
        return
      }
    } else {
      router.push('/login-delegados')
    }
    setLoading(false)
  }, [router])

  // Calcular días restantes para renovación de certificación
  const calcularDiasRenovacion = () => {
    // Simulando fecha de certificación: 20/01/2024 con vigencia de 2 años
    const fechaCertificacion = new Date('2024-01-20')
    const fechaExpiracion = new Date(fechaCertificacion)
    fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 2) // 2 años de vigencia

    const ahora = new Date()
    const tiempoRestante = fechaExpiracion.getTime() - ahora.getTime()
    const diasRestantes = Math.ceil(tiempoRestante / (1000 * 3600 * 24))

    return {
      diasRestantes,
      fechaExpiracion: fechaExpiracion.toLocaleDateString('es-ES'),
      requiereRenovacion: diasRestantes <= 120 // Avisar 4 meses antes
    }
  }

  const procesarPago = async () => {
    setProcesandoPago(true)

    // Simular procesamiento de pago
    setTimeout(() => {
      setProcesandoPago(false)
      alert('Procesando pago de 30,25€...\n\n✅ Pago confirmado\n✅ Certificación renovada por 2 años\n✅ Nuevo certificado disponible para descarga')
      router.push('/dashboard-delegado')
    }, 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                  C
                </div>
                <span className="text-xl font-bold text-gray-900">Custodia360</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard-delegado" className="text-blue-600 hover:text-blue-800">
                ← Volver al Dashboard
              </Link>
              <span className="text-sm text-gray-600">
                {sessionData?.nombre} - Delegado Principal
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('userSession')
                  router.push('/')
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">{sessionData?.entidad || 'Mi Entidad'}</h2>
          <h1 className="text-3xl font-bold text-gray-900">
            {calcularDiasRenovacion().requiereRenovacion ? 'Renovación de Certificación' : 'Certificación Vigente'} LOPIVI
          </h1>
          <p className="text-gray-600 mt-2">Delegado Principal - Proceso de certificación</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">
            {/* Estado actual */}
            <div className={`border rounded-lg p-6 mb-8 ${
              calcularDiasRenovacion().requiereRenovacion
                ? 'bg-orange-50 border-orange-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                calcularDiasRenovacion().requiereRenovacion ? 'text-orange-900' : 'text-green-900'
              }`}>Estado Actual de su Certificación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className={`font-medium ${
                    calcularDiasRenovacion().requiereRenovacion ? 'text-orange-800' : 'text-green-800'
                  }`}>Estado:</span>
                  <span className={`ml-2 font-bold ${
                    calcularDiasRenovacion().requiereRenovacion ? 'text-orange-900' : 'text-green-900'
                  }`}>
                    {calcularDiasRenovacion().requiereRenovacion ? 'Próximo a expirar' : 'Vigente'}
                  </span>
                </div>
                <div>
                  <span className={`font-medium ${
                    calcularDiasRenovacion().requiereRenovacion ? 'text-orange-800' : 'text-green-800'
                  }`}>Fecha límite:</span>
                  <span className={`ml-2 ${
                    calcularDiasRenovacion().requiereRenovacion ? 'text-orange-900' : 'text-green-900'
                  }`}>{calcularDiasRenovacion().fechaExpiracion}</span>
                </div>
                <div>
                  <span className={`font-medium ${
                    calcularDiasRenovacion().requiereRenovacion ? 'text-orange-800' : 'text-green-800'
                  }`}>Tipo:</span>
                  <span className={`ml-2 ${
                    calcularDiasRenovacion().requiereRenovacion ? 'text-orange-900' : 'text-green-900'
                  }`}>Delegado Principal</span>
                </div>
                <div>
                  <span className={`font-medium ${
                    calcularDiasRenovacion().requiereRenovacion ? 'text-orange-800' : 'text-green-800'
                  }`}>Días restantes:</span>
                  <span className={`ml-2 font-bold ${
                    calcularDiasRenovacion().requiereRenovacion ? 'text-orange-900' : 'text-green-900'
                  }`}>{calcularDiasRenovacion().diasRestantes}</span>
                </div>
              </div>
            </div>

            {/* Información del proceso */}
            {calcularDiasRenovacion().requiereRenovacion && (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-yellow-900 mb-4">Proceso de Renovación</h3>
                  <div className="space-y-3 text-yellow-800">
                    <p>• <strong>Precio:</strong> 25,00€ + IVA (21%) = <strong>30,25€ total</strong></p>
                    <p>• <strong>Vigencia:</strong> 2 años desde la fecha de renovación</p>
                    <p>• <strong>Incluye:</strong> Formación actualizada + Certificado oficial renovado</p>
                    <p>• <strong>Proceso:</strong> Actualización online + Test + Certificado inmediato</p>
                    <p>• <strong>Disponibilidad:</strong> Acceso 24/7 al contenido de formación</p>
                  </div>
                </div>

                {/* Método de pago */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Método de Pago</h3>
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input
                        type="radio"
                        name="metodoPago"
                        defaultChecked
                        onChange={(e) => setMostrarNuevaTarjeta(!e.target.checked)}
                        className="mr-4 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Usar tarjeta guardada de la entidad</span>
                        <p className="text-sm text-gray-600">**** **** **** 1234 (Visa)</p>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input
                        type="radio"
                        name="metodoPago"
                        onChange={(e) => setMostrarNuevaTarjeta(e.target.checked)}
                        className="mr-4 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Nueva tarjeta de crédito/débito</span>
                        <p className="text-sm text-gray-600">Agregar una nueva tarjeta de pago</p>
                      </div>
                    </label>
                  </div>

                  {mostrarNuevaTarjeta && (
                    <div className="mt-6 p-6 bg-white border border-gray-300 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-4">Datos de la Nueva Tarjeta</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Número de tarjeta</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de vencimiento</label>
                            <input
                              type="text"
                              placeholder="MM/AA"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Titular de la tarjeta</label>
                          <input
                            type="text"
                            placeholder="Nombre completo como aparece en la tarjeta"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Beneficios */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-green-900 mb-4">Beneficios de la Renovación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-800">
                    <div className="space-y-2">
                      <p>✓ Certificación oficial renovada como Delegado Principal LOPIVI</p>
                      <p>✓ Conocimientos actualizados según última normativa</p>
                      <p>✓ Acceso garantizado al sistema por 2 años más</p>
                    </div>
                    <div className="space-y-2">
                      <p>✓ Formación especializada en nuevos protocolos</p>
                      <p>✓ Certificado descargable inmediatamente</p>
                      <p>✓ Cumplimiento normativo continuado</p>
                    </div>
                  </div>
                </div>

                {/* Resumen del pedido */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">Resumen del Pedido</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Renovación de Certificación LOPIVI - Delegado Principal</span>
                      <span>25,00€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA (21%)</span>
                      <span>5,25€</span>
                    </div>
                    <div className="border-t border-blue-300 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>30,25€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Link
                href="/dashboard-delegado"
                className="text-gray-600 border border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 text-center"
              >
                Volver al Dashboard
              </Link>
              {calcularDiasRenovacion().requiereRenovacion && (
                <button
                  onClick={procesarPago}
                  disabled={procesandoPago}
                  className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {procesandoPago ? 'Procesando...' : 'Renovar por 30,25€'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
