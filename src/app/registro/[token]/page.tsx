'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface MiembroData {
  nombre: string
  dni: string
  email: string
  telefono: string
  rol: string
  rolEspecifico: string
  diasTrabajo: string[]
  horario: string
  experiencia: string
  titulacion: boolean
  cualTitulacion: string
  antecedentesDisponibles: boolean
  cargoEspecifico: string
  accesoInstalaciones: string
}

interface EntidadConfig {
  nombreEntidad: string
  tipoEntidad: string
  emailDelegado: string
  telefonoDelegado: string
  nombreDelegado: string
}

export default function RegistroMiembroPage() {
  const router = useRouter()
  const params = useParams()
  const [paso, setPaso] = useState(1)
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [entidadConfig, setEntidadConfig] = useState<EntidadConfig | null>(null)

  const [datos, setDatos] = useState<MiembroData>({
    nombre: '',
    dni: '',
    email: '',
    telefono: '',
    rol: '',
    rolEspecifico: '',
    diasTrabajo: [],
    horario: '',
    experiencia: '',
    titulacion: false,
    cualTitulacion: '',
    antecedentesDisponibles: false,
    cargoEspecifico: '',
    accesoInstalaciones: ''
  })

  const rolesConfig = {
    deportivo: {
      contactoDirecto: [
        'Entrenador',
        'Monitor deportivo',
        'Preparador físico',
        'Fisioterapeuta',
        'Conductor transporte'
      ],
      contactoIndirecto: [
        'Miembro Junta Directiva',
        'Secretario/Administración',
        'Personal limpieza',
        'Conserje/Seguridad'
      ],
      sinContacto: [
        'Proveedor material',
        'Mantenimiento esporádico',
        'Servicios externos'
      ]
    },
    educativo: {
      contactoDirecto: [
        'Profesor/Maestro',
        'Monitor extraescolares',
        'Orientador/Psicólogo',
        'Conserje',
        'Personal comedor'
      ],
      contactoIndirecto: [
        'Equipo directivo',
        'Secretaría/Administración',
        'Personal limpieza',
        'Personal cocina'
      ],
      sinContacto: [
        'Mantenimiento',
        'Proveedor servicios',
        'Personal externo'
      ]
    },
    religioso: {
      contactoDirecto: [
        'Catequista',
        'Monitor grupos',
        'Coordinador pastoral',
        'Responsable coro infantil'
      ],
      contactoIndirecto: [
        'Consejo pastoral',
        'Administración parroquial',
        'Personal limpieza',
        'Sacristán'
      ],
      sinContacto: [
        'Mantenimiento',
        'Proveedor servicios'
      ]
    },
    ocio: {
      contactoDirecto: [
        'Monitor de actividades',
        'Coordinador grupos',
        'Responsable excursiones',
        'Animador sociocultural'
      ],
      contactoIndirecto: [
        'Directivo',
        'Personal administrativo',
        'Personal limpieza',
        'Seguridad'
      ],
      sinContacto: [
        'Proveedor servicios',
        'Mantenimiento'
      ]
    },
    cultural: {
      contactoDirecto: [
        'Profesor/Instructor',
        'Monitor talleres',
        'Coordinador actividades',
        'Responsable grupos'
      ],
      contactoIndirecto: [
        'Junta directiva',
        'Secretaría',
        'Personal apoyo',
        'Conserje'
      ],
      sinContacto: [
        'Servicios externos',
        'Mantenimiento'
      ]
    }
  }

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const config: EntidadConfig = {
          nombreEntidad: 'Club Deportivo San Fernando',
          tipoEntidad: 'deportivo',
          emailDelegado: 'delegado@clubsanfernando.com',
          telefonoDelegado: '600 123 456',
          nombreDelegado: 'Juan García Rodríguez'
        }

        setEntidadConfig(config)
        setLoading(false)
      } catch (error) {
        console.error('Error cargando configuración:', error)
        setLoading(false)
      }
    }

    cargarConfiguracion()
  }, [params.token])

  const handleInputChange = (field: keyof MiembroData, value: any) => {
    setDatos(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const siguientePaso = () => {
    setPaso(prev => prev + 1)
  }

  const pasoAnterior = () => {
    setPaso(prev => prev - 1)
  }

  const enviarRegistro = async () => {
    setEnviando(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const registro = {
        ...datos,
        entidad: entidadConfig?.nombreEntidad,
        fechaRegistro: new Date().toISOString(),
        token: params.token,
        estado: 'registrado'
      }

      localStorage.setItem(`registro_${datos.dni}`, JSON.stringify(registro))

      // Simular envío de email automático de formación
      console.log('Email automático enviado con formación para:', datos.email)

      setPaso(5)

    } catch (error) {
      console.error('Error enviando registro:', error)
      alert('Error al enviar el registro. Por favor, inténtelo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <p className="text-gray-600">Cargando información de la entidad...</p>
        </div>
      </div>
    )
  }

  if (!entidadConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Enlace no válido</h1>
          <p className="text-gray-600">El enlace de registro no es válido o ha expirado.</p>
        </div>
      </div>
    )
  }

  // PASO 1: Identificación
  if (paso === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {entidadConfig.nombreEntidad}
              </h1>
              <p className="text-gray-600">
                Registro para cumplimiento LOPIVI
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2">
                Ley Orgánica de Protección Integral a la Infancia y Adolescencia
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Como miembro de esta entidad, es obligatorio completar este registro
                para cumplir con la normativa LOPIVI. Sus datos serán tratados de forma
                confidencial y utilizados únicamente para los fines de cumplimiento legal.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={datos.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Escriba su nombre completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DNI/NIE *
                </label>
                <input
                  type="text"
                  value={datos.dni}
                  onChange={(e) => handleInputChange('dni', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="12345678A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email personal *
                </label>
                <input
                  type="email"
                  value={datos.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="su.email@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono móvil *
                </label>
                <input
                  type="tel"
                  value={datos.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="600 123 456"
                  required
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={siguientePaso}
                disabled={!datos.nombre || !datos.dni || !datos.email || !datos.telefono}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  !datos.nombre || !datos.dni || !datos.email || !datos.telefono
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // PASO 2: Selección de rol
  if (paso === 2) {
    const roles = rolesConfig[entidadConfig.tipoEntidad as keyof typeof rolesConfig] || rolesConfig.deportivo

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Paso 2 de 4</span>
                <span>50% completado</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ¿Cuál es su función en la entidad?
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-red-700 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  CONTACTO DIRECTO CON MENORES
                </h3>
                <div className="space-y-2 ml-5">
                  {roles.contactoDirecto.map((rol) => (
                    <label key={rol} className="flex items-center">
                      <input
                        type="radio"
                        name="rol"
                        value={`directo-${rol}`}
                        checked={datos.rol === 'directo' && datos.rolEspecifico === rol}
                        onChange={() => {
                          handleInputChange('rol', 'directo')
                          handleInputChange('rolEspecifico', rol)
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{rol}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-orange-700 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                  CONTACTO INDIRECTO
                </h3>
                <div className="space-y-2 ml-5">
                  {roles.contactoIndirecto.map((rol) => (
                    <label key={rol} className="flex items-center">
                      <input
                        type="radio"
                        name="rol"
                        value={`indirecto-${rol}`}
                        checked={datos.rol === 'indirecto' && datos.rolEspecifico === rol}
                        onChange={() => {
                          handleInputChange('rol', 'indirecto')
                          handleInputChange('rolEspecifico', rol)
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{rol}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-green-700 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  SIN CONTACTO HABITUAL
                </h3>
                <div className="space-y-2 ml-5">
                  {roles.sinContacto.map((rol) => (
                    <label key={rol} className="flex items-center">
                      <input
                        type="radio"
                        name="rol"
                        value={`sincontacto-${rol}`}
                        checked={datos.rol === 'sincontacto' && datos.rolEspecifico === rol}
                        onChange={() => {
                          handleInputChange('rol', 'sincontacto')
                          handleInputChange('rolEspecifico', rol)
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{rol}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={pasoAnterior}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={siguientePaso}
                disabled={!datos.rol || !datos.rolEspecifico}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  !datos.rol || !datos.rolEspecifico
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // PASO 3: Información específica según rol
  if (paso === 3) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Paso 3 de 4</span>
                <span>75% completado</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Información específica de su rol
            </h2>
            <p className="text-gray-600 mb-6">
              {datos.rol === 'directo' && 'Contacto directo con menores'}
              {datos.rol === 'indirecto' && 'Contacto indirecto'}
              {datos.rol === 'sincontacto' && 'Sin contacto habitual'}
              - {datos.rolEspecifico}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Requisitos para su rol:
              </h3>
              <ul className="text-blue-800 text-sm space-y-1">
                {datos.rol === 'directo' && (
                  <>
                    <li>• Formación LOPIVI especializada (8 horas)</li>
                    <li>• Certificado de antecedentes penales (renovación anual)</li>
                    <li>• Certificado profesional (si aplica)</li>
                    <li>• Compromiso código de conducta</li>
                  </>
                )}
                {datos.rol === 'indirecto' && (
                  <>
                    <li>• Formación LOPIVI básica (4 horas)</li>
                    <li>• Certificado de antecedentes penales (renovación bianual)</li>
                    <li>• Código de conducta simplificado</li>
                  </>
                )}
                {datos.rol === 'sincontacto' && (
                  <>
                    <li>• Formación LOPIVI online (2 horas)</li>
                    <li>• Certificado de antecedentes penales (renovación cada 3 años)</li>
                    <li>• Declaración responsable</li>
                  </>
                )}
              </ul>
            </div>

            <div className="space-y-6">
              {datos.rol === 'directo' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Días de trabajo con menores
                    </label>
                    <div className="flex space-x-2">
                      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((dia) => (
                        <label key={dia} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={datos.diasTrabajo.includes(dia)}
                            onChange={(e) => {
                              const nuevos = e.target.checked
                                ? [...datos.diasTrabajo, dia]
                                : datos.diasTrabajo.filter(d => d !== dia)
                              handleInputChange('diasTrabajo', nuevos)
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-1 text-sm text-gray-700">{dia}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horario habitual
                    </label>
                    <input
                      type="text"
                      value={datos.horario}
                      onChange={(e) => handleInputChange('horario', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: 16:00 a 20:00"
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={datos.titulacion}
                        onChange={(e) => handleInputChange('titulacion', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Tengo titulación profesional específica
                      </span>
                    </label>
                    {datos.titulacion && (
                      <input
                        type="text"
                        value={datos.cualTitulacion}
                        onChange={(e) => handleInputChange('cualTitulacion', e.target.value)}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Especifique qué titulación"
                      />
                    )}
                  </div>
                </>
              )}

              {datos.rol === 'indirecto' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo específico
                    </label>
                    <input
                      type="text"
                      value={datos.cargoEspecifico}
                      onChange={(e) => handleInputChange('cargoEspecifico', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describa su cargo específico"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Acceso a instalaciones
                    </label>
                    <select
                      value={datos.accesoInstalaciones}
                      onChange={(e) => handleInputChange('accesoInstalaciones', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar frecuencia</option>
                      <option value="diario">Acceso diario</option>
                      <option value="semanal">Acceso semanal</option>
                      <option value="ocasional">Acceso ocasional</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificado de antecedentes penales
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="antecedentes"
                      checked={datos.antecedentesDisponibles === true}
                      onChange={() => handleInputChange('antecedentesDisponibles', true)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Ya tengo el certificado vigente</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="antecedentes"
                      checked={datos.antecedentesDisponibles === false}
                      onChange={() => handleInputChange('antecedentesDisponibles', false)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Necesito pedirlo</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={pasoAnterior}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={siguientePaso}
                className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // PASO 4: Confirmación y envío
  if (paso === 4) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Paso 4 de 4</span>
                <span>100% completado</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-full"></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Confirme sus datos
            </h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Resumen del registro:</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Nombre:</strong> {datos.nombre}</p>
                <p><strong>DNI:</strong> {datos.dni}</p>
                <p><strong>Email:</strong> {datos.email}</p>
                <p><strong>Teléfono:</strong> {datos.telefono}</p>
                <p><strong>Rol:</strong> {datos.rolEspecifico}</p>
                <p><strong>Tipo de contacto:</strong>
                  {datos.rol === 'directo' && ' Contacto directo con menores'}
                  {datos.rol === 'indirecto' && ' Contacto indirecto'}
                  {datos.rol === 'sincontacto' && ' Sin contacto habitual'}
                </p>
                <p><strong>Formación requerida:</strong>
                  {datos.rol === 'directo' && ' LOPIVI especializada (8h)'}
                  {datos.rol === 'indirecto' && ' LOPIVI básica (4h)'}
                  {datos.rol === 'sincontacto' && ' LOPIVI online (2h)'}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Próximos pasos después del envío:
              </h3>
              <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
                <li>Recibirá un email de confirmación</li>
                <li>Le enviaremos el enlace a su formación específica</li>
                <li>Tendrá 30 días para completar la formación</li>
                <li>Recibirá instrucciones para los antecedentes penales</li>
                <li>Su delegado supervisará el progreso</li>
              </ol>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Declaración responsable
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  Declaro bajo mi responsabilidad que los datos facilitados son veraces
                  y me comprometo a comunicar cualquier modificación de los mismos.
                </p>
                <p>
                  Autorizo el tratamiento de mis datos personales para el cumplimiento
                  de las obligaciones legales derivadas de la LOPIVI.
                </p>
                <p>
                  Me comprometo a cumplir con el código de conducta y las normas de
                  protección de menores establecidas por la entidad.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={pasoAnterior}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={enviarRegistro}
                disabled={enviando}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  enviando
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {enviando ? 'Enviando registro...' : 'Enviar registro'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // PASO 5: Confirmación final
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl font-bold">✓</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Registro completado exitosamente
          </h2>

          <p className="text-gray-600 mb-6">
            Gracias por completar su registro para {entidadConfig.nombreEntidad}.
            En breve recibirá un email con las siguientes instrucciones.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-green-900 mb-3">
              ¿Qué sucede ahora?
            </h3>
            <ul className="text-green-800 text-sm space-y-2 list-disc list-inside">
              <li>Recibirá confirmación por email en los próximos minutos</li>
              <li>Le enviaremos el enlace a su formación LOPIVI específica</li>
              <li>Tendrá 30 días para completar la formación</li>
              <li>Recibirá instrucciones detalladas sobre antecedentes penales</li>
              <li>Su progreso será supervisado por el delegado de protección</li>
            </ul>
          </div>

          <div className="mt-8 text-sm text-gray-600">
            <p>Si tiene dudas, contacte con su delegado de protección:</p>
            <p className="font-semibold">{entidadConfig.nombreDelegado}</p>
            <p>{entidadConfig.emailDelegado}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
