'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense, useCallback } from 'react'
import MobileFormActions, { useFormValidation } from '../../components/MobileFormActions'
import BackupContratacion from '@/components/BackupContratacion'

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
    web: '',
    nombreContratante: '',
    dniContratante: '',
    cargoContratante: '',
    telefonoContratante: '',
    emailContratante: '',
    contraseñaContratante: '',
    nombreAdministrativo: '',
    cargoAdministrativo: '',
    telefonoAdministrativo: '',
    emailAdministrativo: ''
  })

  // Estados para guardado automático
  const [ultimoGuardado, setUltimoGuardado] = useState<Date | null>(null)
  const [guardandoProgreso, setGuardandoProgreso] = useState(false)

  // Campos requeridos para validación
  const requiredFields = [
    'nombreEntidad', 'cifEntidad', 'tipoEntidad', 'direccion', 'telefono',
    'nombreContratante', 'dniContratante', 'cargoContratante', 'telefonoContratante',
    'emailContratante', 'contraseñaContratante', 'nombreAdministrativo',
    'cargoAdministrativo', 'telefonoAdministrativo', 'emailAdministrativo'
  ]

  const isFormValid = useFormValidation(requiredFields, formData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Función para guardar progreso automáticamente
  const guardarProgreso = useCallback(async (datos: typeof formData) => {
    if (typeof window === 'undefined') return

    try {
      setGuardandoProgreso(true)
      // Guardar en localStorage como respaldo
      localStorage.setItem('contratacion_progreso', JSON.stringify({
        ...datos,
        planPreseleccionado,
        fechaGuardado: new Date().toISOString()
      }))
      setUltimoGuardado(new Date())
    } catch (error) {
      console.error('Error guardando progreso:', error)
    } finally {
      setGuardandoProgreso(false)
    }
  }, [planPreseleccionado])

  // Función para cargar progreso guardado
  const cargarProgreso = () => {
    if (typeof window === 'undefined') return false

    try {
      const progressGuardado = localStorage.getItem('contratacion_progreso')
      if (progressGuardado) {
        const datos = JSON.parse(progressGuardado)
        const fechaGuardado = new Date(datos.fechaGuardado)
        const horasTranscurridas = (new Date().getTime() - fechaGuardado.getTime()) / (1000 * 60 * 60)

        // Solo cargar si han pasado menos de 24 horas
        if (horasTranscurridas < 24) {
          setFormData({
            nombreEntidad: datos.nombreEntidad || '',
            cifEntidad: datos.cifEntidad || '',
            tipoEntidad: datos.tipoEntidad || '',
            numeroMenores: datos.numeroMenores || '',
            direccion: datos.direccion || '',
            telefono: datos.telefono || '',
            web: datos.web || '',
            nombreContratante: datos.nombreContratante || '',
            dniContratante: datos.dniContratante || '',
            cargoContratante: datos.cargoContratante || '',
            telefonoContratante: datos.telefonoContratante || '',
            emailContratante: datos.emailContratante || '',
            contraseñaContratante: datos.contraseñaContratante || '',
            nombreAdministrativo: datos.nombreAdministrativo || '',
            cargoAdministrativo: datos.cargoAdministrativo || '',
            telefonoAdministrativo: datos.telefonoAdministrativo || '',
            emailAdministrativo: datos.emailAdministrativo || ''
          })
          if (datos.planPreseleccionado) {
            setPlanPreseleccionado(datos.planPreseleccionado)
          }
          setUltimoGuardado(fechaGuardado)
          return true
        } else {
          // Eliminar datos caducados
          localStorage.removeItem('contratacion_progreso')
        }
      }
    } catch (error) {
      console.error('Error cargando progreso:', error)
    }
    return false
  }

  useEffect(() => {
    // Primero intentar cargar progreso guardado
    const progresoGuardado = cargarProgreso()

    // Si no hay progreso guardado, procesar parámetros de URL
    if (!progresoGuardado) {
      const plan = searchParams.get('plan')
      const descripcion = searchParams.get('descripcion')

      if (plan && descripcion) {
        // Mapear plan a número de menores
        const planToMenores = {
          'plan-100': '1-100',
          'plan-250': '101-250',
          'plan-500': '251-500',
          'plan-500plus': '501+',
          'custodia-temporal': 'temporal',
          'kit-comunicacion': 'kit'
        }

        setPlanPreseleccionado(planToMenores[plan as keyof typeof planToMenores] || '')
      }
    }
  }, [searchParams])

  // Efecto para guardado automático cada 10 segundos cuando hay cambios
  useEffect(() => {
    const timer = setInterval(() => {
      const hayDatos = Object.values(formData).some(value => value.trim() !== '')
      if (hayDatos) {
        guardarProgreso(formData)
      }
    }, 10000) // Guardar cada 10 segundos

    return () => clearInterval(timer)
  }, [formData, guardarProgreso])

  // Efecto para guardado automático en beforeunload
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleBeforeUnload = () => {
      const hayDatos = Object.values(formData).some(value => value.trim() !== '')
      if (hayDatos) {
        // Guardado síncrono para beforeunload
        localStorage.setItem('contratacion_progreso', JSON.stringify({
          ...formData,
          planPreseleccionado,
          fechaGuardado: new Date().toISOString()
        }))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [formData, planPreseleccionado])

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

          {/* Indicador de guardado automático */}
          <div className="mb-6 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${guardandoProgreso ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-sm text-blue-800 font-medium">
                {guardandoProgreso ? 'Guardando progreso...' : 'Progreso guardado automáticamente'}
              </span>
            </div>
            {ultimoGuardado && (
              <span className="text-xs text-blue-600">
                Último guardado: {ultimoGuardado.toLocaleTimeString?.() || 'N/A'}
              </span>
            )}
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
                    name="nombreEntidad"
                    value={formData.nombreEntidad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                    placeholder="Ejemplo: Centro Educativo San José / Club Deportivo Los Leones / Parroquia San Pedro"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CIF/NIF de la Entidad *
                  </label>
                  <input
                    type="text"
                    name="cifEntidad"
                    value={formData.cifEntidad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                    placeholder="Ejemplo: G12345678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Entidad *
                  </label>
                  <select
                    name="tipoEntidad"
                    value={formData.tipoEntidad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    required
                  >
                    <option value="">Seleccionar tipo de entidad</option>

                    {/* Categorías genéricas seleccionables */}
                    <option value="centro-educativo-generico" className="font-bold bg-blue-50">📚 Centro Educativo (genérico)</option>
                    <optgroup label="  ↳ Tipos específicos de Centros Educativos">
                      <option value="centro-educativo">• Colegio/Instituto</option>
                      <option value="centro-formacion">• Centro de Formación</option>
                      <option value="escuela-musica">• Escuela de Música</option>
                      <option value="academia-baile">• Academia de Baile</option>
                      <option value="centro-extraescolares">• Centro de Actividades Extraescolares</option>
                    </optgroup>

                    <option value="deporte-ocio-generico" className="font-bold bg-green-50">⚽ Deporte y Ocio (genérico)</option>
                    <optgroup label="  ↳ Tipos específicos de Deporte y Ocio">
                      <option value="club-deportivo">• Club Deportivo</option>
                      <option value="academia-deportiva">• Academia/Escuela Deportiva</option>
                      <option value="centro-hipico">• Centro Hípico</option>
                      <option value="escuela-nautica">• Escuela Náutica</option>
                      <option value="centro-natacion">• Centro de Natación</option>
                      <option value="centro-ocio">• Centro de Ocio</option>
                      <option value="parque-aventura">• Parque de Aventura</option>
                    </optgroup>

                    <option value="entidad-religiosa-generico" className="font-bold bg-purple-50">⛪ Entidad Religiosa (genérico)</option>
                    <optgroup label="  ↳ Tipos específicos de Entidades Religiosas">
                      <option value="parroquia">• Parroquia</option>
                      <option value="catequesis">• Catequesis</option>
                      <option value="grupo-pastoral">• Grupo Pastoral Juvenil</option>
                      <option value="comunidad-religiosa">• Comunidad Religiosa</option>
                    </optgroup>

                    <option value="cuidado-infantil-generico" className="font-bold bg-yellow-50">👶 Cuidado Infantil (genérico)</option>
                    <optgroup label="  ↳ Tipos específicos de Cuidado Infantil">
                      <option value="guarderia">• Guardería</option>
                      <option value="ludoteca">• Ludoteca</option>
                      <option value="campamento">• Campamento/Colonias</option>
                      <option value="granja-escuela">• Granja Escuela</option>
                    </optgroup>

                    <option value="organizacion-social-generico" className="font-bold bg-orange-50">🤝 Organización Social (genérico)</option>
                    <optgroup label="  ↳ Tipos específicos de Organizaciones Sociales">
                      <option value="asociacion-juvenil">• Asociación Juvenil</option>
                      <option value="ong-menores">• ONG/Fundación</option>
                      <option value="centro-terapeutico">• Centro Terapéutico</option>
                      <option value="voluntariado">• Organización de Voluntariado</option>
                    </optgroup>

                    <optgroup label="Otros">
                      <option value="otro">Otro tipo de entidad</option>
                    </optgroup>
                  </select>
                  <p className="text-sm text-gray-600 mt-2">
                    💡 <strong>Consejo:</strong> Si no encuentras tu tipo específico de entidad, puedes seleccionar la categoría genérica (ej. "Centro Educativo (genérico)"). También puedes ver todas las opciones específicas en cada categoría.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Seleccionado
                  </label>
                  {planPreseleccionado ? (
                    <div className="w-full px-4 py-3 border border-green-300 rounded-lg bg-green-50">
                      <span className="text-gray-700 font-medium">
                        {planPreseleccionado === '1-100' && '1-100 menores (Plan 100 - 19€ + IVA)'}
                        {planPreseleccionado === '101-250' && '101-250 menores (Plan 250 - 39€ + IVA)'}
                        {planPreseleccionado === '251-500' && '251-500 menores (Plan 500 - 105€ + IVA)'}
                        {planPreseleccionado === '501+' && '+501 menores (Plan 500+ - 250€ + IVA)'}
                        {planPreseleccionado === 'temporal' && 'Evento temporal (Custodia Temporal - 100€ + IVA)'}
                        {planPreseleccionado === 'kit' && 'Solo material (Kit Comunicación - 40€ + IVA)'}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        * Delegado suplente: +10€ + IVA (opcional, se configura en el siguiente paso)
                      </p>
                      <p className="text-sm text-green-600 mt-1">✓ Plan confirmado desde página de planes</p>
                      <input type="hidden" name="numeroMenores" value={planPreseleccionado} />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-3 border border-orange-300 rounded-lg bg-orange-50">
                      <span className="text-orange-700 font-medium">⚠ No hay plan seleccionado</span>
                      <p className="text-sm text-orange-600 mt-1">
                        <Link href="/planes" className="underline">Selecciona un plan aquí</Link> antes de continuar con la contratación
                      </p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Completa *
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
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
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
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
                    name="web"
                    value={formData.web}
                    onChange={handleInputChange}
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
                    name="nombreContratante"
                    value={formData.nombreContratante}
                    onChange={handleInputChange}
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
                    name="dniContratante"
                    value={formData.dniContratante}
                    onChange={handleInputChange}
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
                    name="cargoContratante"
                    value={formData.cargoContratante}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    required
                  >
                    <option value="">Seleccionar cargo</option>
                    <option value="Presidente">Presidente</option>
                    <option value="Director">Director</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Propietario">Propietario</option>
                    <option value="RRHH">RRHH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono Personal *
                  </label>
                  <input
                    type="tel"
                    name="telefonoContratante"
                    value={formData.telefonoContratante}
                    onChange={handleInputChange}
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
                    name="emailContratante"
                    value={formData.emailContratante}
                    onChange={handleInputChange}
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
                    name="contraseñaContratante"
                    value={formData.contraseñaContratante}
                    onChange={handleInputChange}
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
                    name="nombreAdministrativo"
                    value={formData.nombreAdministrativo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Ejemplo: María González López"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo/Departamento *
                  </label>
                  <select
                    name="cargoAdministrativo"
                    value={formData.cargoAdministrativo}
                    onChange={handleInputChange}
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
                    name="telefonoAdministrativo"
                    value={formData.telefonoAdministrativo}
                    onChange={handleInputChange}
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
                    name="emailAdministrativo"
                    value={formData.emailAdministrativo}
                    onChange={handleInputChange}
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

            {/* Sistema de Backup en la Nube - Oculto del usuario */}
            <div style={{ display: 'none' }}>
              <BackupContratacion
                datosFormulario={{
                  entidad: formData,
                  planPreseleccionado,
                  fechaProgreso: ultimoGuardado?.toISOString()
                }}
                entidadId={formData.cifEntidad || `temp-${Date.now()}`}
                autoBackup={true}
                onBackupCreado={(backupId) => {
                  console.log('Backup creado:', backupId)
                }}
              />
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
