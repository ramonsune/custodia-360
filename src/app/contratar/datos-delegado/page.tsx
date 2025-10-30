'use client'

import Link from 'next/link'
import { useState } from 'react'
import MobileFormActions, { useFormValidation } from '../../components/MobileFormActions'

export default function DatosDelegadoPage() {
  const [tieneSuplente, setTieneSuplente] = useState(false)
  const [formData, setFormData] = useState({
    nombreDelegadoPrincipal: '',
    dniDelegadoPrincipal: '',
    fechaNacimientoDelegadoPrincipal: '',
    telefonoDelegadoPrincipal: '',
    emailDelegadoPrincipal: '',
    contraseñaDelegadoPrincipal: '',
    funcionDelegadoPrincipal: '',
    formacionPrevia: '',
    // Campos del suplente
    nombreDelegadoSuplente: '',
    dniDelegadoSuplente: '',
    fechaNacimientoDelegadoSuplente: '',
    telefonoDelegadoSuplente: '',
    emailDelegadoSuplente: '',
    contraseñaDelegadoSuplente: '',
    funcionDelegadoSuplente: ''
  })

  // Campos requeridos para validación
  const requiredFields = [
    'nombreDelegadoPrincipal', 'dniDelegadoPrincipal', 'fechaNacimientoDelegadoPrincipal',
    'telefonoDelegadoPrincipal', 'emailDelegadoPrincipal', 'contraseñaDelegadoPrincipal',
    'funcionDelegadoPrincipal'
  ]

  // Añadir campos requeridos del suplente si está activo
  const allRequiredFields = tieneSuplente ? [
    ...requiredFields,
    'nombreDelegadoSuplente', 'dniDelegadoSuplente', 'fechaNacimientoDelegadoSuplente',
    'telefonoDelegadoSuplente', 'emailDelegadoSuplente', 'contraseñaDelegadoSuplente',
    'funcionDelegadoSuplente'
  ] : requiredFields

  const isFormValid = useFormValidation(allRequiredFields, formData)

  // Función para calcular el precio total
  const calcularPrecio = () => {
    // Obtener precio del plan seleccionado desde localStorage
    let precioBasePlan = 78 // Plan 250 por defecto

    // Solo acceder a localStorage en el cliente
    if (typeof window !== 'undefined') {
      try {
        const entidadData = localStorage.getItem('datosEntidad')
        if (entidadData) {
          const parsedEntidad = JSON.parse(entidadData)
          const planes = {
            '1-100': 38,
            '101-250': 78,
            '251-500': 210,
            '501+': 500,
            'temporal': 100
          }

          if (parsedEntidad.numeroMenores && planes[parsedEntidad.numeroMenores as keyof typeof planes]) {
            precioBasePlan = planes[parsedEntidad.numeroMenores as keyof typeof planes]
          }
        }
      } catch (error) {
        console.error('Error obteniendo precio del plan:', error)
      }
    }

    const precioSuplente = tieneSuplente ? 20.00 : 0.00
    const subtotal = precioBasePlan + precioSuplente
    const iva = subtotal * 0.21
    const total = subtotal + iva

    return {
      precioBase: precioBasePlan,
      precioSuplente,
      subtotal,
      iva,
      total
    }
  }

  // Función para manejar cambios en los inputs
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-2">✓</div>
              <div className="w-16 h-1 bg-green-600 mr-2"></div>
              <div className="w-8 h-8 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold mr-2">2</div>
              <div className="w-16 h-1 bg-gray-300 mr-2"></div>
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">3</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Paso 2: Datos del Delegado de Protección</h1>
          <p className="text-gray-600">Complete los datos de la persona que actuará como Delegado de Protección LOPIVI</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
          {/* Indicador de progreso móvil mejorado */}
          <div className="md:hidden mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Paso 2 de 3</span>
              <span className="text-sm text-gray-500">67% completado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{width: '67%'}}></div>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Datos del delegado de protección
            </div>
          </div>

          <form className="space-y-6 md:space-y-8">
            {/* Delegado Principal */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Delegado de Protección Principal</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Importante:</strong> El Delegado de Protección es la figura central del sistema LOPIVI.
                  Debe ser una persona mayor de edad, con formación específica y disponibilidad para actuar ante situaciones de riesgo.
                </p>
              </div>

              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nombreDelegadoPrincipal}
                    onChange={(e) => handleInputChange('nombreDelegadoPrincipal', e.target.value)}
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                    placeholder="Ejemplo: María García López"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI/NIE *
                  </label>
                  <input
                    type="text"
                    value={formData.dniDelegadoPrincipal}
                    onChange={(e) => handleInputChange('dniDelegadoPrincipal', e.target.value)}
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                    placeholder="Ejemplo: 12345678Z"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="text"
                    value={formData.fechaNacimientoDelegadoPrincipal}
                    onChange={(e) => handleInputChange('fechaNacimientoDelegadoPrincipal', e.target.value)}
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                    placeholder="Solo números: 15031985"
                    maxLength={10}
                    required
                    onInput={(e) => {
                      let value = e.currentTarget.value.replace(/\D/g, '');
                      if (value.length >= 3) {
                        value = value.slice(0, 2) + '/' + value.slice(2);
                      }
                      if (value.length >= 6) {
                        value = value.slice(0, 5) + '/' + value.slice(5, 9);
                      }
                      e.currentTarget.value = value;
                      handleInputChange('fechaNacimientoDelegadoPrincipal', value);
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Escriba solo números: 15031985 → 15/03/1985</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    value={formData.telefonoDelegadoPrincipal}
                    onChange={(e) => handleInputChange('telefonoDelegadoPrincipal', e.target.value)}
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
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
                    value={formData.emailDelegadoPrincipal}
                    onChange={(e) => handleInputChange('emailDelegadoPrincipal', e.target.value)}
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                    placeholder="delegado@ejemplo.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Email para acceder al dashboard del delegado</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña de Acceso *
                  </label>
                  <input
                    type="password"
                    value={formData.contraseñaDelegadoPrincipal}
                    onChange={(e) => handleInputChange('contraseñaDelegadoPrincipal', e.target.value)}
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Para acceder al área del delegado</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Función/Cargo en la Entidad *
                  </label>
                  <select
                    value={formData.funcionDelegadoPrincipal}
                    onChange={(e) => handleInputChange('funcionDelegadoPrincipal', e.target.value)}
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                    required
                  >
                    <option value="">Seleccionar función en la entidad</option>
                    <optgroup label="🏫 Educativo/Formativo">
                      <option value="Director/a">Director/a</option>
                      <option value="Profesor/a">Profesor/a</option>
                      <option value="Tutor/a">Tutor/a</option>
                      <option value="Coordinador Pedagógico">Coordinador/a Pedagógico</option>
                      <option value="Educador/a">Educador/a</option>
                      <option value="Monitor/a">Monitor/a</option>
                      <option value="Orientador/a">Orientador/a</option>
                    </optgroup>
                    <optgroup label="⚽ Deportivo">
                      <option value="Entrenador Principal">Entrenador/a Principal</option>
                      <option value="Entrenador Asistente">Entrenador/a Asistente</option>
                      <option value="Director Técnico">Director/a Técnico</option>
                      <option value="Preparador Físico">Preparador/a Físico</option>
                      <option value="Monitor Deportivo">Monitor/a Deportivo</option>
                    </optgroup>
                    <optgroup label="⛪ Pastoral/Religioso">
                      <option value="Párroco">Párroco</option>
                      <option value="Catequista">Catequista</option>
                      <option value="Animador Pastoral">Animador/a Pastoral</option>
                      <option value="Coordinador Catequesis">Coordinador/a de Catequesis</option>
                      <option value="Monitor Grupos Juveniles">Monitor/a de Grupos Juveniles</option>
                    </optgroup>
                    <optgroup label="👶 Cuidado Infantil">
                      <option value="Responsable Guardería">Responsable de Guardería</option>
                      <option value="Cuidador">Cuidador/a</option>
                      <option value="Animador Infantil">Animador/a Infantil</option>
                      <option value="Monitor Ludoteca">Monitor/a de Ludoteca</option>
                    </optgroup>
                    <optgroup label="🏢 Gestión/Administración">
                      <option value="Gerente">Gerente</option>
                      <option value="Coordinador General">Coordinador/a General</option>
                      <option value="Administrativo">Administrativo/a</option>
                      <option value="Secretario">Secretario/a</option>
                    </optgroup>
                    <optgroup label="🤝 Otros Roles">
                      <option value="Voluntario">Voluntario/a</option>
                      <option value="Psicólogo">Psicólogo/a</option>
                      <option value="Trabajador Social">Trabajador/a Social</option>
                      <option value="Conserje">Conserje/Mantenimiento</option>
                      <option value="Otro">Otro cargo</option>
                    </optgroup>
                  </select>
                </div>



                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formación Previa en Protección de Menores
                  </label>
                  <textarea
                    value={formData.formacionPrevia}
                    onChange={(e) => handleInputChange('formacionPrevia', e.target.value)}
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 touch-manipulation"
                    rows={3}
                    placeholder="Describa cualquier formación previa relacionada con protección infantil, psicología, educación, etc."
                  />
                </div>
              </div>

              <div className="mt-6 bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>Incluido en su plan:</strong> Formación LOPIVI completa (6h 30min), certificación oficial,
                  materiales de trabajo y acceso al dashboard de gestión.
                </p>
              </div>
            </div>

            {/* Delegado Suplente */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">👥 Delegado de Protección Suplente (Opcional)</h2>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={tieneSuplente}
                      onChange={(e) => setTieneSuplente(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-800"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Designar delegado suplente (+20€)
                    </span>
                  </label>
                </div>
              </div>

              {tieneSuplente && (
                <div>
                  <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                    <p className="text-yellow-800 text-sm">
                      <strong>Recomendado:</strong> El delegado suplente actuará en caso de ausencia del principal
                      y recibirá la misma formación y certificación.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={formData.nombreDelegadoSuplente}
                        onChange={(e) => handleInputChange('nombreDelegadoSuplente', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="Ejemplo: Carlos Ruiz Martín"
                        required={tieneSuplente}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DNI/NIE *
                      </label>
                      <input
                        type="text"
                        value={formData.dniDelegadoSuplente}
                        onChange={(e) => handleInputChange('dniDelegadoSuplente', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="Ejemplo: 87654321X"
                        required={tieneSuplente}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Nacimiento *
                      </label>
                      <input
                        type="text"
                        value={formData.fechaNacimientoDelegadoSuplente}
                        onChange={(e) => handleInputChange('fechaNacimientoDelegadoSuplente', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="Solo números: 15031985"
                        maxLength={10}
                        required={tieneSuplente}
                        onInput={(e) => {
                          let value = e.currentTarget.value.replace(/\D/g, '');
                          if (value.length >= 3) {
                            value = value.slice(0, 2) + '/' + value.slice(2);
                          }
                          if (value.length >= 6) {
                            value = value.slice(0, 5) + '/' + value.slice(5, 9);
                          }
                          e.currentTarget.value = value;
                          handleInputChange('fechaNacimientoDelegadoSuplente', value);
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Escriba solo números: 15031985 → 15/03/1985</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono de Contacto *
                      </label>
                      <input
                        type="tel"
                        value={formData.telefonoDelegadoSuplente}
                        onChange={(e) => handleInputChange('telefonoDelegadoSuplente', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="Ejemplo: 600654321"
                        required={tieneSuplente}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email de Acceso *
                      </label>
                      <input
                        type="email"
                        value={formData.emailDelegadoSuplente}
                        onChange={(e) => handleInputChange('emailDelegadoSuplente', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="suplente@ejemplo.com"
                        required={tieneSuplente}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña de Acceso *
                      </label>
                      <input
                        type="password"
                        value={formData.contraseñaDelegadoSuplente}
                        onChange={(e) => handleInputChange('contraseñaDelegadoSuplente', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="Mínimo 8 caracteres"
                        required={tieneSuplente}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Función/Cargo en la Entidad *
                      </label>
                      <select
                        value={formData.funcionDelegadoSuplente}
                        onChange={(e) => handleInputChange('funcionDelegadoSuplente', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        required={tieneSuplente}
                      >
                        <option value="">Seleccionar función suplente</option>
                        <option value="Entrenador Asistente">Entrenador Asistente</option>
                        <option value="Monitor Suplente">Monitor Suplente</option>
                        <option value="Coordinador Adjunto">Coordinador Adjunto</option>
                        <option value="Responsable de Seguridad">Responsable de Seguridad</option>
                        <option value="Educador Suplente">Educador Suplente</option>
                        <option value="Administrativo">Administrativo</option>
                        <option value="Voluntario Senior">Voluntario Senior</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Declaraciones */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 className="font-bold text-gray-900">Declaraciones Responsables</h3>

              <label className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" required />
                <span className="text-sm text-gray-700">
                  Declaro que el/los delegado/s designado/s no tiene/n antecedentes penales relacionados con delitos contra menores *
                </span>
              </label>

              <label className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" required />
                <span className="text-sm text-gray-700">
                  Autorizo a Custodia360 a proporcionar la formación LOPIVI requerida al/los delegado/s designado/s *
                </span>
              </label>

              <label className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" required />
                <span className="text-sm text-gray-700">
                  Confirmo que el/los delegado/s cuenta/n con disponibilidad para atender situaciones de emergencia *
                </span>
              </label>
            </div>

            {/* Resumen de precio */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Resumen del Pedido</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Delegado Principal (Formación + Certificación)</span>
                  <span className="font-medium text-blue-900">{calcularPrecio().precioBase.toFixed(2)}€</span>
                </div>
                {tieneSuplente && (
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800">Delegado Suplente (Formación + Certificación)</span>
                    <span className="font-medium text-blue-900">{calcularPrecio().precioSuplente.toFixed(2)}€</span>
                  </div>
                )}
                <div className="border-t border-blue-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800">Subtotal</span>
                    <span className="font-medium text-blue-900">{calcularPrecio().subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800">IVA (21%)</span>
                    <span className="font-medium text-blue-900">{calcularPrecio().iva.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t border-blue-300 pt-2 mt-2">
                    <span className="text-blue-900">Total</span>
                    <span className="text-blue-900">{calcularPrecio().total.toFixed(2)}€</span>
                  </div>

                  {/* Información de pago fraccionado */}
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">💳 Modalidad de Pago:</p>
                      <div className="space-y-1">
                        <p>• <strong>Hoy:</strong> {(calcularPrecio().total / 2).toFixed(2)}€ (50%)</p>
                        <p>• <strong>En 6 meses:</strong> {(calcularPrecio().total / 2).toFixed(2)}€ (50%)</p>
                        <p className="text-xs mt-2">El segundo pago se cargará automáticamente a la misma tarjeta proporcionada</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white border border-blue-200 rounded">
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Incluido en el precio:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Formación LOPIVI completa (6h 30min)</li>
                    <li>Certificación oficial</li>
                    <li>Acceso al dashboard de gestión</li>
                    <li>Materiales de trabajo y documentación</li>
                    {tieneSuplente && <li>Formación y certificación del delegado suplente</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Link
                href="/contratar/datos-entidad"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Volver al Paso 1
              </Link>

              <Link
                href="/contratar/pago"
                className="px-8 py-3 bg-blue-800 text-white rounded-lg font-bold hover:bg-blue-900 transition-colors"
                onClick={() => {
                  // Guardar datos del delegado incluyendo si tiene suplente
                  localStorage.setItem('datosDelegado', JSON.stringify({
                    ...formData,
                    incluirSuplente: tieneSuplente
                  }))
                }}
              >
                Continuar al Paso 3 →
              </Link>
            </div>
          </form>
        </div>

        {/* Acciones flotantes móviles */}
        <MobileFormActions
          currentStep={2}
          totalSteps={3}
          prevHref="/contratar/datos-entidad"
          nextHref="/contratar/pago"
          isFormValid={isFormValid}
          onNext={() => {
            // Guardar datos del delegado incluyendo si tiene suplente
            localStorage.setItem('datosDelegado', JSON.stringify({
              ...formData,
              incluirSuplente: tieneSuplente
            }))
          }}
        />
      </div>
    </div>
  )
}
