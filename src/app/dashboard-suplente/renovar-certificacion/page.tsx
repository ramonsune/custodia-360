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

export default function RenovarCertificacionSuplente() {
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

        if (data.tipo !== 'suplente') {
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

  // Calcular días restantes para certificación
  const calcularDiasRenovacion = () => {
    // Simulando que el suplente necesita certificarse por primera vez
    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() + 30) // 30 días para certificarse

    const ahora = new Date()
    const tiempoRestante = fechaLimite.getTime() - ahora.getTime()
    const diasRestantes = Math.ceil(tiempoRestante / (1000 * 3600 * 24))

    return {
      diasRestantes,
      fechaExpiracion: fechaLimite.toLocaleDateString('es-ES'),
      requiereRenovacion: true,
      esPrimeraCertificacion: true
    }
  }

  const procesarPago = async () => {
    setProcesandoPago(true)

    // Simular procesamiento de pago
    setTimeout(() => {
      setProcesandoPago(false)
      const mensaje = calcularDiasRenovacion().esPrimeraCertificacion
        ? 'Procesando pago de 30,25€ para certificación inicial...\n\n✅ Pago confirmado\n✅ Certificación como Delegado Suplente completada\n✅ Certificado disponible para descarga\n✅ Acceso completo al sistema activado'
        : 'Procesando pago de 30,25€...\n\n✅ Pago confirmado\n✅ Certificación renovada por 2 años\n✅ Nuevo certificado disponible para descarga'
      alert(mensaje)
      router.push('/dashboard-suplente')
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
              <Link href="/dashboard-suplente" className="text-blue-600 hover:text-blue-800">
                ← Volver al Dashboard
              </Link>
              <span className="text-sm text-gray-600">
                {sessionData?.nombre} - Delegado Suplente
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
            {calcularDiasRenovacion().esPrimeraCertificacion ? 'Certificación Inicial' : 'Renovación de Certificación'} LOPIVI
          </h1>
          <p className="text-gray-600 mt-2">Delegado Suplente - Proceso de certificación</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">
            {/* Estado actual */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-red-900 mb-4">Estado Actual de su Certificación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="font-medium text-red-800">Estado:</span>
                  <span className="ml-2 font-bold text-red-900">
                    {calcularDiasRenovacion().esPrimeraCertificacion ? 'Sin Certificar' : 'Próximo a expirar'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-red-800">Fecha límite:</span>
                  <span className="ml-2 text-red-900">{calcularDiasRenovacion().fechaExpiracion}</span>
                </div>
                <div>
                  <span className="font-medium text-red-800">Tipo:</span>
                  <span className="ml-2 text-red-900">Delegado Suplente</span>
                </div>
                <div>
                  <span className="font-medium text-red-800">Prioridad:</span>
                  <span className="ml-2 font-bold text-red-900">ALTA</span>
                </div>
              </div>
            </div>

            {/* Información del proceso */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-yellow-900 mb-4">
                {calcularDiasRenovacion().esPrimeraCertificacion ? 'Proceso de Certificación Inicial' : 'Proceso de Renovación'}
              </h3>
              <div className="space-y-3 text-yellow-800">
                <p>• <strong>Precio:</strong> 25,00€ + IVA (21%) = <strong>30,25€ total</strong></p>
                <p>• <strong>Vigencia:</strong> 2 años desde la fecha de certificación</p>
                <p>• <strong>Incluye:</strong> Formación completa + Certificado oficial de suplente</p>
                <p>• <strong>Proceso:</strong> Formación online + Test + Certificado inmediato</p>
                {calcularDiasRenovacion().esPrimeraCertificacion && (
                  <p>• <strong>Importante:</strong> Requerido para cumplimiento LOPIVI de la entidad</p>
                )}
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
              <h3 className="text-xl font-bold text-green-900 mb-4">
                Beneficios de la {calcularDiasRenovacion().esPrimeraCertificacion ? 'Certificación' : 'Renovación'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-800">
                <div className="space-y-2">
                  <p>✓ Certificación oficial como Delegado Suplente LOPIVI</p>
                  <p>✓ Capacidad legal para actuar en ausencia del principal</p>
                  <p>✓ Acceso completo al sistema de gestión</p>
                </div>
                <div className="space-y-2">
                  <p>✓ Formación especializada para suplentes</p>
                  <p>✓ Certificado descargable inmediatamente</p>
                  <p>✓ Cumplimiento normativo de la entidad</p>
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Resumen del Pedido</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>
                    {calcularDiasRenovacion().esPrimeraCertificacion ? 'Certificación Inicial' : 'Renovación de Certificación'} LOPIVI - Delegado Suplente
                  </span>
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

            {/* Información importante */}
            {calcularDiasRenovacion().esPrimeraCertificacion && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-amber-900 mb-4">⚠️ Importante</h3>
                <div className="text-amber-800 space-y-2">
                  <p>Como delegado suplente, su certificación es <strong>esencial</strong> para:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Actuar legalmente en ausencia del delegado principal</li>
                    <li>Garantizar el cumplimiento normativo continuo de la entidad</li>
                    <li>Acceder a todas las funcionalidades del sistema</li>
                    <li>Mantener la operatividad de los protocolos LOPIVI</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Link
                href="/dashboard-suplente"
                className="text-gray-600 border border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 text-center"
              >
                Volver al Dashboard
              </Link>
              <button
                onClick={procesarPago}
                disabled={procesandoPago}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {procesandoPago ? 'Procesando...' : `${calcularDiasRenovacion().esPrimeraCertificacion ? 'Certificarse' : 'Renovar'} por 30,25€`}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
