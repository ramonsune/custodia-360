'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import MobileFormActions, { useFormValidation } from '../../components/MobileFormActions'

export default function PagoPage() {
  const [formData, setFormData] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    fechaExpiracion: '',
    cvv: '',
    tipoTarjeta: '',
    terminos: false,
    comunicacionesComerciales: false,
    kitComunicacion: false
  })

  const [planSeleccionado, setPlanSeleccionado] = useState<{
    nombre: string;
    precio: number;
    descripcion: string;
  } | null>(null)

  const [delegadoSuplente, setDelegadoSuplente] = useState(false)

  // Precios
  const PRECIO_KIT = 30
  const PRECIO_SUPLENTE = 10

  // Campos requeridos para validación del pago
  const requiredFields = ['numeroTarjeta', 'nombreTitular', 'fechaExpiracion', 'cvv', 'terminos']
  const isFormValid = useFormValidation(requiredFields, formData)

  useEffect(() => {
    // Cargar datos de los pasos anteriores y determinar plan
    const entidad = localStorage.getItem('datosEntidad')
    const delegado = localStorage.getItem('datosDelegado')

    // Si no hay datos en localStorage, usar valores por defecto para mostrar cálculo
    const planes = {
      '1-100': { nombre: 'Plan 50', precio: 38, descripcion: '1-100 menores' },
      '101-250': { nombre: 'Plan 250', precio: 78, descripcion: '101-250 menores' },
      '251-500': { nombre: 'Plan 500', precio: 210, descripcion: '251-500 menores' },
      '501+': { nombre: 'Plan 500+', precio: 500, descripcion: '+501 menores' },
      'temporal': { nombre: 'Custodia Temporal', precio: 100, descripcion: 'Hasta 60 días' },
      'kit': { nombre: 'Kit Comunicación', precio: 30, descripcion: 'Material LOPIVI' }
    }

    if (entidad) {
      const parsedEntidad = JSON.parse(entidad)
      setPlanSeleccionado(planes[parsedEntidad.numeroMenores as keyof typeof planes])
    } else {
      // Si no hay datos, usar Plan 250 por defecto para mostrar cálculo
      setPlanSeleccionado(planes['101-250'])
    }

    if (delegado) {
      const parsedDelegado = JSON.parse(delegado)
      setDelegadoSuplente(parsedDelegado.incluirSuplente || false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\s/g, '').replace(/\D/g, '')
    const formatted = numbers.replace(/(.{4})/g, '$1 ').trim()
    return formatted.substring(0, 19) // Límite de 16 dígitos + 3 espacios
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setFormData(prev => ({ ...prev, numeroTarjeta: formatted }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Mostrar loading
      const loadingElement = document.createElement('div')
      loadingElement.innerHTML = `
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; items-center: justify-content: center; z-index: 9999;">
          <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; max-width: 400px;">
            <div style="width: 50px; height: 50px; border: 4px solid #ea580c; border-top: 4px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">Procesando contratación...</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              Enviando emails automáticos y configurando su entidad LOPIVI
            </p>
          </div>
        </div>
        <style>
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      `
      document.body.appendChild(loadingElement)

      // Recopilar todos los datos del proceso
      const datosEntidad = JSON.parse(localStorage.getItem('datosEntidad') || '{}')
      const datosDelegado = JSON.parse(localStorage.getItem('datosDelegado') || '{}')

      // Generar número de factura único
      const numeroFactura = `FAC-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

      // Preparar datos completos para el sistema de emails
      const datosCompletos = {
        // Datos de la entidad
        nombreEntidad: datosEntidad.nombreEntidad || 'Entidad de Prueba',
        cif: datosEntidad.cif || 'G12345678',
        tipoEntidad: datosEntidad.tipoEntidad || 'club-deportivo',
        numeroMenores: datosEntidad.numeroMenores || '51-200',
        direccion: datosEntidad.direccion || 'Dirección no especificada',
        telefono: datosEntidad.telefono || '600000000',
        web: datosEntidad.web || '',

        // Datos del contratante
        nombreContratante: datosEntidad.nombreContratante || 'Contratante de Prueba',
        dniContratante: datosEntidad.dniContratante || '12345678Z',
        cargoContratante: datosEntidad.cargoContratante || 'Director',
        telefonoContratante: datosEntidad.telefonoContratante || '600000000',
        emailContratante: datosEntidad.emailContratante || 'contratante@ejemplo.com',
        contraseñaContratante: datosEntidad.contraseñaContratante || 'contratante123',

        // Datos del delegado principal
        nombreDelegadoPrincipal: datosDelegado.nombreDelegadoPrincipal || 'Delegado Principal de Prueba',
        dniDelegadoPrincipal: datosDelegado.dniDelegadoPrincipal || '87654321X',
        fechaNacimientoDelegadoPrincipal: datosDelegado.fechaNacimientoDelegadoPrincipal || '15/03/1985',
        telefonoDelegadoPrincipal: datosDelegado.telefonoDelegadoPrincipal || '600111111',
        emailDelegadoPrincipal: datosDelegado.emailDelegadoPrincipal || 'delegado@ejemplo.com',
        contraseñaDelegadoPrincipal: datosDelegado.contraseñaDelegadoPrincipal || 'delegado123',
        funcionDelegadoPrincipal: datosDelegado.funcionDelegadoPrincipal || 'Entrenador Principal',
        formacionPrevia: datosDelegado.formacionPrevia || '',

        // Datos del delegado suplente (si existe)
        tieneSuplente: delegadoSuplente,
        nombreDelegadoSuplente: delegadoSuplente ? (datosDelegado.nombreDelegadoSuplente || 'Delegado Suplente de Prueba') : null,
        dniDelegadoSuplente: delegadoSuplente ? (datosDelegado.dniDelegadoSuplente || '11111111Y') : null,
        fechaNacimientoDelegadoSuplente: delegadoSuplente ? (datosDelegado.fechaNacimientoDelegadoSuplente || '20/05/1988') : null,
        telefonoDelegadoSuplente: delegadoSuplente ? (datosDelegado.telefonoDelegadoSuplente || '600222222') : null,
        emailDelegadoSuplente: delegadoSuplente ? (datosDelegado.emailDelegadoSuplente || 'suplente@ejemplo.com') : null,
        contraseñaDelegadoSuplente: delegadoSuplente ? (datosDelegado.contraseñaDelegadoSuplente || 'suplente123') : null,
        funcionDelegadoSuplente: delegadoSuplente ? (datosDelegado.funcionDelegadoSuplente || 'Entrenador Asistente') : null,

        // Datos del administrativo
        nombreAdministrativo: datosEntidad.nombreAdministrativo || 'Administrativo de Prueba',
        cargoAdministrativo: datosEntidad.cargoAdministrativo || 'Administrativo',
        telefonoAdministrativo: datosEntidad.telefonoAdministrativo || '600333333',
        emailAdministrativo: datosEntidad.emailAdministrativo || 'admin@ejemplo.com',

        // Datos del plan y pago
        plan: planSeleccionado?.nombre || 'Plan 200',
        importeTotal: totalCompleto,
        kitComunicacion: formData.kitComunicacion,
        numeroFactura
      }

      console.log('📧 Iniciando sistema de emails con datos:', datosCompletos)

      // Llamar al API de emails de contratación
      const responseEmails = await fetch('/api/emails/contratacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosCompletos)
      })

      const resultEmails = await responseEmails.json()

      // Quitar loading
      document.body.removeChild(loadingElement)

      if (resultEmails.success) {
        // Mostrar resultado exitoso
        alert(`¡Contratación completada con éxito!

✅ ${resultEmails.totalEmails} emails programados en total
📧 Emails enviados inmediatamente: ${resultEmails.emailsEnviados.filter((e: any) => e.enviado).length}
⏰ Emails programados: ${resultEmails.emailsEnviados.filter((e: any) => e.programado).length}

Detalles:
• Factura enviada a: ${datosCompletos.emailAdministrativo}
• Credenciales de acceso enviadas
• Formación LOPIVI programada
• Certificación automática en 48h

Su entidad estará protegida LOPIVI en 72 horas.`)

        // Limpiar datos temporales
        localStorage.removeItem('datosEntidad')
        localStorage.removeItem('datosDelegado')

        // Redirigir
        window.location.href = '/'
      } else {
        throw new Error(resultEmails.error || 'Error en el sistema de emails')
      }

    } catch (error) {
      // Quitar loading si existe
      const loadingElement = document.querySelector('[style*="position: fixed"]')
      if (loadingElement) {
        document.body.removeChild(loadingElement)
      }

      console.error('❌ Error en la contratación:', error)
      alert(`Error en la contratación: ${error instanceof Error ? error.message : 'Error desconocido'}

Por favor, inténtelo de nuevo o contacte con soporte.`)
    }
  }

  // Cálculo dividido: 50% ahora + 50% a los 6 meses
  const precioPlanCompleto = planSeleccionado?.precio || 0
  const precioPlanPrimerPago = Math.round((precioPlanCompleto / 2) * 100) / 100 // 50% ahora
  const precioPlanSegundoPago = Math.round((precioPlanCompleto / 2) * 100) / 100 // 50% a los 6 meses

  const precioKit = formData.kitComunicacion ? PRECIO_KIT : 0
  const precioSuplente = delegadoSuplente ? PRECIO_SUPLENTE : 0

  // PRIMER PAGO: 50% plan + kit completo + suplente completo
  const subtotalPrimerPago = precioPlanPrimerPago + precioKit + precioSuplente
  const ivaPrimerPago = Math.round(subtotalPrimerPago * 0.21 * 100) / 100
  const totalPrimerPago = subtotalPrimerPago + ivaPrimerPago

  // SEGUNDO PAGO: 50% plan restante
  const subtotalSegundoPago = precioPlanSegundoPago
  const ivaSegundoPago = Math.round(subtotalSegundoPago * 0.21 * 100) / 100
  const totalSegundoPago = subtotalSegundoPago + ivaSegundoPago

  // TOTAL COMPLETO
  const totalCompleto = totalPrimerPago + totalSegundoPago

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Paso 3: Pago y Finalización</h1>
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
              <div className="w-16 h-1 bg-blue-800"></div>
              <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
              <div className="w-16 h-1 bg-blue-800"></div>
              <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
            </div>
          </div>
        </div>

        {/* Indicador de progreso móvil mejorado */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Paso 3 de 3</span>
            <span className="text-sm text-gray-500">100% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{width: '100%'}}></div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Pago y finalización
          </div>
        </div>

        {/* Sección Kit de Comunicación */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Añadir Kit de Comunicación (Opcional)</h3>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="kitComunicacion"
                name="kitComunicacion"
                checked={formData.kitComunicacion}
                onChange={handleInputChange}
                className="mt-1 mr-3 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <div className="flex-1">
                <label htmlFor="kitComunicacion" className="cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-lg font-bold text-gray-700">Kit de Comunicación</span>
                    <span className="text-lg font-bold text-teal-600">30€ + IVA</span>
                  </div>
                  <p className="text-gray-600 mb-3">Material informativo LOPIVI personalizado para tu entidad</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <ul className="space-y-1">
                      <li>• Templates para comunicados a familias</li>
                      <li>• Material para web y redes sociales</li>
                      <li>• Carteles informativos para instalaciones</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• Comunicaciones internas para trabajadores</li>
                      <li>• Certificado visual de cumplimiento LOPIVI</li>
                      <li>• Guías de uso y personalización</li>
                    </ul>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {formData.kitComunicacion && (
            <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-sm text-teal-800">
                <span className="font-bold">Kit de Comunicación añadido</span> - Se incluirá en tu primer pago junto con el plan seleccionado.
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-700 mb-4">Resumen del Pedido</h3>

              {planSeleccionado && (
                <div className="space-y-4 mb-6">
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{planSeleccionado.nombre}</span>
                      <span className="font-bold text-gray-700">{planSeleccionado.precio}€</span>
                    </div>
                    <p className="text-sm text-gray-600">{planSeleccionado.descripcion}</p>
                  </div>

                  {formData.kitComunicacion && (
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">Kit de Comunicación</span>
                        <span className="font-bold text-gray-700">{PRECIO_KIT}€</span>
                      </div>
                      <p className="text-sm text-gray-600">Material informativo LOPIVI personalizado</p>
                      <p className="text-xs text-gray-500 mt-1">Carteles, comunicados y templates</p>
                    </div>
                  )}

                  {delegadoSuplente && (
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">Delegado Suplente</span>
                        <span className="font-bold text-gray-700">{PRECIO_SUPLENTE}€</span>
                      </div>
                      <p className="text-sm text-gray-600">Protección 24/7 durante ausencias del principal</p>
                      <p className="text-xs text-gray-500 mt-1">Misma formación y certificación completa</p>
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <h4 className="font-bold text-blue-800 text-sm">PAGO DE HOY:</h4>
                    </div>

                    <div className="flex justify-between">
                      <span>{planSeleccionado?.nombre} (50% inicial):</span>
                      <span>{precioPlanPrimerPago}€</span>
                    </div>

                    {formData.kitComunicacion && (
                      <div className="flex justify-between">
                        <span>Kit Comunicación (completo):</span>
                        <span>{precioKit}€</span>
                      </div>
                    )}

                    {delegadoSuplente && (
                      <div className="flex justify-between">
                        <span>Delegado Suplente (completo):</span>
                        <span>{precioSuplente}€</span>
                      </div>
                    )}

                    <div className="flex justify-between border-t pt-2">
                      <span>Subtotal hoy:</span>
                      <span>{subtotalPrimerPago}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA (21%):</span>
                      <span>{ivaPrimerPago}€</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg bg-green-50 p-2 rounded">
                      <span>TOTAL A PAGAR HOY:</span>
                      <span className="text-green-600">{totalPrimerPago}€</span>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg mt-4">
                      <h4 className="font-bold text-yellow-800 text-sm">SEGUNDO PAGO (6 meses):</h4>
                      <div className="flex justify-between text-sm mt-1">
                        <span>{planSeleccionado?.nombre} (50% restante):</span>
                        <span>{precioPlanSegundoPago}€ + {ivaSegundoPago}€ IVA = {totalSegundoPago}€</span>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Implementación completa en 72 horas</p>
              </div>
            </div>
          </div>

          {/* Formulario de Pago */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              {/* Datos de la Tarjeta */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Datos de la Tarjeta</h3>

                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Tarjeta *
                    </label>
                    <input
                      type="text"
                      name="numeroTarjeta"
                      value={formData.numeroTarjeta}
                      onChange={handleCardNumberChange}
                      className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Titular *
                    </label>
                    <input
                      type="text"
                      name="nombreTitular"
                      value={formData.nombreTitular}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                      placeholder="Como aparece en la tarjeta"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Expiración *
                    </label>
                    <input
                      type="text"
                      name="fechaExpiracion"
                      value={formData.fechaExpiracion}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                      placeholder="MM/AA"
                      maxLength={5}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>



              {/* Términos y Condiciones */}
              <div className="space-y-4 mb-8">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="terminos"
                    checked={formData.terminos}
                    onChange={handleInputChange}
                    className="mt-1 mr-3 h-4 w-4 text-orange-600 focus:ring-orange-600 border-gray-300 rounded"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">Acepto los términos y condiciones *</span><br />
                    <span className="text-gray-500">
                      He leído y acepto los <a href="#" className="text-orange-600 hover:underline">términos y condiciones</a> y la <a href="#" className="text-orange-600 hover:underline">política de privacidad</a>.
                    </span>
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="comunicacionesComerciales"
                    checked={formData.comunicacionesComerciales}
                    onChange={handleInputChange}
                    className="mt-1 mr-3 h-4 w-4 text-orange-600 focus:ring-orange-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">Comunicaciones comerciales</span><br />
                    <span className="text-gray-500">
                      Acepto recibir comunicaciones comerciales sobre productos y servicios de Custodia360.
                    </span>
                  </span>
                </label>
              </div>

              {/* Información de Seguridad */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                    ✓
                  </div>
                  <span className="font-medium text-green-800">Pago 100% Seguro</span>
                </div>
                <p className="text-sm text-green-700">
                  Sus datos están protegidos con cifrado SSL de 256 bits. No almacenamos información de tarjetas de crédito.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <Link
                  href="/contratar/datos-delegado"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Volver
                </Link>

                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-800 text-white rounded-lg font-bold hover:bg-blue-900 transition-colors"
                >
                  Completar Pago Hoy ({totalPrimerPago}€)
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Acciones flotantes móviles */}
        <MobileFormActions
          currentStep={3}
          totalSteps={3}
          prevHref="/contratar/datos-delegado"
          isLastStep={true}
          onSubmit={() => {
            const form = document.querySelector('form')
            if (form) form.requestSubmit()
          }}
          isFormValid={isFormValid}
        />
      </div>
    </div>
  )
}
