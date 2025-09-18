'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import MobileFormActions, { useFormValidation } from '../../components/MobileFormActions'

function DatosEntidadContent() {
  const searchParams = useSearchParams()
  const [planPreseleccionado, setPlanPreseleccionado] = useState('')
  const [formData, setFormData] = useState({
    nombreEntidad: '',
    cifEntidad: '',
    tipoEntidad: '',
    numeroMenores: '',
    direccion: '',
    telefono: '',
    nombreContratante: '',
    dniContratante: '',
    cargoContratante: '',
    telefonoContratante: '',
    emailContratante: '',
    contraseñaContratante: '',
    nombreAdministrativo: '',
    dniAdministrativo: '',
    cargoAdministrativo: '',
    telefonoAdministrativo: '',
    emailAdministrativo: ''
  })

  // Campos requeridos para validación
  const requiredFields = [
    'nombreEntidad', 'cifEntidad', 'tipoEntidad', 'numeroMenores', 'direccion', 'telefono',
    'nombreContratante', 'dniContratante', 'cargoContratante', 'telefonoContratante',
    'emailContratante', 'contraseñaContratante', 'nombreAdministrativo', 'dniAdministrativo',
    'cargoAdministrativo', 'telefonoAdministrativo', 'emailAdministrativo'
  ]

  const isFormValid = useFormValidation(requiredFields, formData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const plan = searchParams.get('plan')
    const descripcion = searchParams.get('descripcion')

    if (plan && descripcion) {
      // Mapear plan a número de menores
      const planToMenores = {
        'plan-50': '1-50',
        'plan-200': '51-200',
        'plan-500': '251-500',
        'plan-500plus': '501+',
        'custodia-temporal': 'temporal',
        'kit-comunicacion': 'kit'
      }

      setPlanPreseleccionado(planToMenores[plan as keyof typeof planToMenores] || '')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold mr-2">1</div>
              <div className="w-16 h-1 bg-blue-800 mr-2"></div>
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold mr-2">2</div>
              <div className="w-16 h-1 bg-gray-300 mr-2"></div>
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">3</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Paso 1: Datos de la Entidad y Contratante</h1>
          <p className="text-gray-600">Complete los datos de su entidad y sus datos como contratante</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
          {/* Indicador de progreso móvil mejorado */}
          <div className="md:hidden mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Paso 1 de 3</span>
              <span className="text-sm text-gray-500">33% completado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{width: '33%'}}></div>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Datos de la entidad y contratante
            </div>
          </div>

          <form className="space-y-6 md:space-y-8">
            {/* Datos de la Entidad */}
            <div>
              <h2 className="text-xl font-bold text-gray-700 mb-6 border-b border-gray-200 pb-2">Datos de la Entidad</h2>

              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Entidad *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                    placeholder="Ejemplo: Club Deportivo Los Leones"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CIF/NIF de la Entidad *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                    placeholder="Ejemplo: G12345678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Entidad *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" required>
                    <option value="">Seleccionar tipo</option>
                    <option value="club-deportivo">Club Deportivo</option>
                    <option value="academia-deportiva">Academia/Escuela Deportiva</option>
                    <option value="centro-educativo">Centro Educativo</option>
                    <option value="guarderia">Guardería</option>
                    <option value="campamento">Campamento de Verano</option>
                    <option value="centro-ocio">Centro de Ocio</option>
                    <option value="ludoteca">Ludoteca</option>
                    <option value="centro-extraescolares">Centro de Actividades Extraescolares</option>
                    <option value="escuela-musica">Escuela de Música</option>
                    <option value="academia-baile">Academia de Baile</option>
                    <option value="centro-formacion">Centro de Formación</option>
                    <option value="asociacion-juvenil">Asociación Juvenil</option>
                    <option value="ong-menores">ONG con menores</option>
                    <option value="centro-terapeutico">Centro Terapéutico</option>
                    <option value="granja-escuela">Granja Escuela</option>
                    <option value="parque-aventura">Parque de Aventura</option>
                    <option value="centro-hipico">Centro Hípico</option>
                    <option value="escuela-nautica">Escuela Náutica</option>
                    <option value="centro-natacion">Centro de Natación</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Menores *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    required
                    defaultValue={planPreseleccionado}
                  >
                    <option value="">Seleccionar rango</option>
                    <option value="1-100">1-100 menores (Plan 50 - 19€)</option>
                    <option value="101-250">101-250 menores (Plan 250 - 39€)</option>
                    <option value="251-500">251-500 menores (Plan 500 - 105€)</option>
                    <option value="501+">+501 menores (Plan 500+ - 250€)</option>
                    <option value="temporal">Evento temporal (Custodia Temporal - 100€)</option>
                    <option value="kit">Solo material (Kit Comunicación - 30€)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Completa *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Calle, número, código postal, ciudad"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Ejemplo: 600123456"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Web/Redes Sociales (opcional)
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="https://www.ejemplo.com"
                  />
                </div>
              </div>
            </div>

            {/* Datos del Contratante */}
            <div>
              <h2 className="text-xl font-bold text-gray-700 mb-6 border-b border-gray-200 pb-2">👤 Datos del Contratante</h2>
              <p className="text-sm text-gray-600 mb-6">Persona responsable de la contratación que podrá hacer seguimiento del proceso</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Ejemplo: Juan Pérez García"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI/NIE *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Ejemplo: 12345678Z"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo en la Entidad *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    required
                  >
                    <option value="">Seleccionar cargo</option>
                    <option value="Presidente">Presidente</option>
                    <option value="Director">Director</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Propietario">Propietario</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono Personal *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Ejemplo: 600123456"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Acceso *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="su-email@ejemplo.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Con este email podrá acceder a ver el progreso de la implementación</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña de Acceso *
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Para acceder al área de seguimiento de su contrato</p>
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" required />
                  <span className="text-sm text-gray-700">
                    ¿Es usted la misma persona que actuará como Delegado de Protección?
                    <span className="text-gray-500">(Podrá especificar los datos del delegado en el siguiente paso)</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Datos del Administrativo */}
            <div>
              <h2 className="text-xl font-bold text-gray-700 mb-6 border-b border-gray-200 pb-2">Datos del Responsable Administrativo</h2>
              <p className="text-sm text-gray-600 mb-6">
                Persona que recibirá las facturas por email y se encargará de la gestión administrativa del servicio.
                <span className="text-orange-600 font-medium"> Esta persona solo recibirá facturas automáticamente por email, sin acceso a ningún portal.</span>
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="administrativo_nombre"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Ejemplo: María González López"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI/NIE *
                  </label>
                  <input
                    type="text"
                    name="administrativo_dni"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Ejemplo: 87654321X"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo/Departamento *
                  </label>
                  <select
                    name="administrativo_cargo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    required
                  >
                    <option value="">Seleccionar cargo</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Secretario">Secretario</option>
                    <option value="Tesorero">Tesorero</option>
                    <option value="Responsable Financiero">Responsable Financiero</option>
                    <option value="Gerente Administrativo">Gerente Administrativo</option>
                    <option value="Contable">Contable</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    name="administrativo_telefono"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Ejemplo: 600987654"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email para Facturación *
                  </label>
                  <input
                    type="email"
                    name="administrativo_email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="administracion@ejemplo.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A este email se enviarán automáticamente todas las facturas del servicio
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">¿Qué recibirá el Responsable Administrativo?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Recepción automática de facturas por email</li>
                  <li>• Notificaciones de pagos y vencimientos</li>
                  <li>• Recibos de pagos realizados</li>
                  <li><strong>• No tendrá acceso a ningún portal web</strong></li>
                </ul>
              </div>

              <div className="mt-6">
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" />
                  <span className="text-sm text-gray-700">
                    El responsable administrativo es la misma persona que el contratante
                    <span className="text-gray-500">(Marque esta casilla si son la misma persona)</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <label className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" required />
                <span className="text-sm text-gray-700">
                  Acepto los <Link href="/terminos" className="text-orange-600 hover:underline" target="_blank">términos y condiciones</Link>,
                  la <Link href="/privacidad" className="text-orange-600 hover:underline" target="_blank">política de privacidad</Link>
                  y autorizo el tratamiento de mis datos conforme a la normativa LOPIVI *
                </span>
              </label>
            </div>

            <div className="flex justify-between">
              <Link
                href="/planes"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Volver a Planes
              </Link>

              <Link
                href="/contratar/datos-delegado"
                className="px-8 py-3 bg-blue-800 text-white rounded-lg font-bold hover:bg-blue-900 transition-colors"
              >
                Continuar al Paso 2 →
              </Link>
            </div>
          </form>
        </div>

        {/* Acciones flotantes móviles */}
        <MobileFormActions
          currentStep={1}
          totalSteps={3}
          nextHref="/contratar/datos-delegado"
          isFormValid={isFormValid}
        />
      </div>
    </div>
  )
}

export default function DatosEntidadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando formulario...</p>
      </div>
    </div>}>
      <DatosEntidadContent />
    </Suspense>
  )
}
