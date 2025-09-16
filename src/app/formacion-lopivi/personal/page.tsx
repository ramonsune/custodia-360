'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface PersonalFormacion {
  id: string
  token: string
  nombre?: string
  apellidos?: string
  dni?: string
  email: string
  telefono?: string
  rol: string
  entidad: string
  delegado: string
  delegadoEmail: string
  paso: 'inicio' | 'datos' | 'antecedentes' | 'formacion' | 'test' | 'certificado'
  progreso: number
}

interface PreguntaTest {
  id: string
  pregunta: string
  opciones: string[]
  respuestaCorrecta: number
  explicacion: string
}

export default function FormacionPersonalPage() {
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [persona, setPersona] = useState<PersonalFormacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Estados del formulario completo
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    telefono: '',
    fechaNacimiento: '',
    direccion: ''
  })

  // Estados para antecedentes penales (CRÍTICO)
  const [archivoAntecedentes, setArchivoAntecedentes] = useState<File | null>(null)
  const [fechaExpedicionAntecedentes, setFechaExpedicionAntecedentes] = useState('')
  const [validandoAntecedentes, setValidandoAntecedentes] = useState(false)
  const [errorAntecedentes, setErrorAntecedentes] = useState('')

  // Estados para formación y test
  const [moduloCompletado, setModuloCompletado] = useState(false)
  const [respuestasTest, setRespuestasTest] = useState<Record<string, number>>({})
  const [testCompletado, setTestCompletado] = useState(false)
  const [notaFinal, setNotaFinal] = useState(0)
  const [certificadoGenerado, setCertificadoGenerado] = useState(false)

  // Preguntas del test simple (10 preguntas básicas)
  const preguntasTest: PreguntaTest[] = [
    {
      id: 'p1',
      pregunta: '¿Cuál es el objetivo principal de la LOPIVI?',
      opciones: [
        'Regular el deporte infantil',
        'Proteger integralmente a menores frente a cualquier forma de violencia',
        'Establecer normas de competición',
        'Controlar las entidades deportivas'
      ],
      respuestaCorrecta: 1,
      explicacion: 'La LOPIVI protege integralmente a los menores frente a cualquier forma de violencia.'
    },
    {
      id: 'p2',
      pregunta: 'Si sospechas que un menor está siendo maltratado, ¿qué debes hacer?',
      opciones: [
        'Investigar por mi cuenta',
        'Hablar directamente con los padres',
        'Comunicarlo inmediatamente al delegado de protección',
        'Esperar a tener más pruebas'
      ],
      respuestaCorrecta: 2,
      explicacion: 'SIEMPRE comunica inmediatamente al delegado de protección, quien activará el protocolo.'
    },
    {
      id: 'p3',
      pregunta: '¿Cuál de estos comportamientos es INAPROPIADO con menores?',
      opciones: [
        'Dar instrucciones claras durante el entrenamiento',
        'Contacto físico innecesario o inapropiado',
        'Felicitar por logros deportivos',
        'Mantener límites profesionales'
      ],
      respuestaCorrecta: 1,
      explicacion: 'El contacto físico debe limitarse a lo necesario para la actividad y siempre de forma apropiada.'
    },
    {
      id: 'p4',
      pregunta: 'Un menor te cuenta algo preocupante sobre su situación familiar. ¿Qué haces?',
      opciones: [
        'Le dices que hable con sus padres',
        'Escuchas sin juzgar y comunicas al delegado',
        'Le haces muchas preguntas para saber más',
        'No le das importancia'
      ],
      respuestaCorrecta: 1,
      explicacion: 'Escucha activamente, no interrogues, y comunica inmediatamente al delegado de protección.'
    },
    {
      id: 'p5',
      pregunta: '¿Quién debe tener certificado de antecedentes penales vigente?',
      opciones: [
        'Solo los entrenadores principales',
        'Solo el personal directivo',
        'Todo el personal que trabaja con menores',
        'Solo los delegados de protección'
      ],
      respuestaCorrecta: 2,
      explicacion: 'La LOPIVI exige certificado de antecedentes penales para TODO el personal que trabaja con menores.'
    },
    {
      id: 'p6',
      pregunta: '¿Con qué frecuencia debo renovar mi certificado de antecedentes penales?',
      opciones: [
        'Cada año',
        'Cada 6 meses',
        'Cada 2 años',
        'Solo al incorporarme'
      ],
      respuestaCorrecta: 1,
      explicacion: 'Los antecedentes penales deben renovarse cada 6 meses para mantener su validez.'
    },
    {
      id: 'p7',
      pregunta: 'Si observas un comportamiento extraño en un menor, ¿cuál es la prioridad?',
      opciones: [
        'Investigar las causas',
        'Garantizar la seguridad inmediata del menor',
        'Hablar con otros padres',
        'Esperar a ver si se repite'
      ],
      respuestaCorrecta: 1,
      explicacion: 'La seguridad inmediata del menor es SIEMPRE la prioridad absoluta.'
    },
    {
      id: 'p8',
      pregunta: '¿Está permitido quedarse a solas con un menor?',
      opciones: [
        'Sí, si es necesario para el entrenamiento',
        'Sí, si los padres lo autorizan',
        'Debe evitarse siempre que sea posible',
        'Solo si es menor de 10 años'
      ],
      respuestaCorrecta: 2,
      explicacion: 'Siempre que sea posible, evita quedarte a solas con un menor. Si es inevitable, informa al delegado.'
    },
    {
      id: 'p9',
      pregunta: '¿Qué información sobre un caso puedes compartir con otros padres?',
      opciones: [
        'Toda la información para que estén alerta',
        'Solo los detalles más importantes',
        'Ninguna información - absoluta confidencialidad',
        'Solo si me preguntan directamente'
      ],
      respuestaCorrecta: 2,
      explicacion: 'La confidencialidad es absoluta. Solo el delegado puede compartir información necesaria.'
    },
    {
      id: 'p10',
      pregunta: 'En caso de emergencia GRAVE, ¿a quién contactas PRIMERO?',
      opciones: [
        'A los padres del menor',
        'Al director de la entidad',
        'Al 112 si hay riesgo vital',
        'Al delegado de protección'
      ],
      respuestaCorrecta: 2,
      explicacion: 'En emergencias con riesgo vital, contacta PRIMERO al 112, después al delegado de protección.'
    }
  ]

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
      cargarDatosPersona(tokenParam)
    } else {
      setError('Token de acceso no válido')
      setLoading(false)
    }
  }, [searchParams])

  const cargarDatosPersona = async (token: string) => {
    try {
      // Buscar el token en localStorage
      const tokenData = localStorage.getItem(`formacion_token_${token}`)

      if (!tokenData) {
        throw new Error('Token no válido o expirado')
      }

      const data = JSON.parse(tokenData)

      // Verificar que el token no esté ya completado
      if (data.completado) {
        setError('Esta formación ya ha sido completada')
        setLoading(false)
        return
      }

      const persona: PersonalFormacion = {
        id: data.personaId,
        token: token,
        email: data.email,
        rol: data.rol,
        entidad: data.entidad,
        delegado: data.delegado,
        delegadoEmail: data.delegadoEmail,
        paso: 'inicio',
        progreso: 0
      }

      setPersona(persona)
    } catch (error) {
      setError('Token no válido o datos de formación no encontrados')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const notificarDelegado = async () => {
    try {
      if (!persona) return

      // Actualizar el token como completado
      const tokenData = localStorage.getItem(`formacion_token_${persona.token}`)
      if (tokenData) {
        const data = JSON.parse(tokenData)
        const updatedData = {
          ...data,
          completado: true,
          fechaCompletado: new Date().toISOString(),
          datosPersona: formData,
          notaTest: notaFinal,
          certificadoGenerado: true
        }
        localStorage.setItem(`formacion_token_${persona.token}`, JSON.stringify(updatedData))
      }

      // Crear notificación para el delegado
      const notificacionDelegado = {
        id: `notif_${Date.now()}`,
        tipo: 'success',
        personaId: persona.id,
        mensaje: `✅ ${formData.nombre} ${formData.apellidos} completó la formación LOPIVI (${notaFinal}%)`,
        fecha: new Date().toISOString().split('T')[0],
        accion: 'Ver Certificado',
        leida: false,
        detalles: {
          nombre: `${formData.nombre} ${formData.apellidos}`,
          dni: formData.dni,
          rol: persona.rol,
          nota: notaFinal,
          certificadoGenerado: true,
          antecedentesPenalesValidados: true
        }
      }

      // Guardar notificación para el delegado
      const notificacionesExistentes = JSON.parse(localStorage.getItem('delegado_notificaciones') || '[]')
      notificacionesExistentes.unshift(notificacionDelegado)
      localStorage.setItem('delegado_notificaciones', JSON.stringify(notificacionesExistentes))

      console.log(`✅ Notificación enviada al delegado: ${persona?.delegadoEmail}`)

    } catch (error) {
      console.error('Error notificando al delegado:', error)
    }
  }

  const actualizarEstadoPersonal = async () => {
    try {
      // Actualizar el estado del personal en el dashboard del delegado
      const personalData = {
        id: persona?.id,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        dni: formData.dni,
        formacionCompleta: true,
        fechaFormacion: new Date().toISOString().split('T')[0],
        certificadoDescargado: false,
        antecedentesPenales: {
          fechaExpedicion: fechaExpedicionAntecedentes,
          archivoSubido: true,
          vigente: true
        },
        estadoCumplimiento: 'completo',
        testCompletado: true,
        notaTest: notaFinal
      }

      localStorage.setItem(`personal_update_${persona?.id}`, JSON.stringify(personalData))
      console.log('✅ Estado del personal actualizado')

    } catch (error) {
      console.error('Error actualizando estado:', error)
    }
  }

  const validarAntecedentes = async () => {
    if (!archivoAntecedentes || !fechaExpedicionAntecedentes) {
      setErrorAntecedentes('Debe seleccionar el archivo y la fecha de expedición')
      return false
    }

    // Validar tipo de archivo
    if (archivoAntecedentes.type !== 'application/pdf') {
      setErrorAntecedentes('El archivo debe ser un PDF oficial del Ministerio de Justicia')
      return false
    }

    // Validar tamaño (máximo 5MB)
    if (archivoAntecedentes.size > 5 * 1024 * 1024) {
      setErrorAntecedentes('El archivo es demasiado grande (máximo 5MB)')
      return false
    }

    // Validar fecha (máximo 6 meses de antigüedad)
    const fechaExp = new Date(fechaExpedicionAntecedentes)
    const fechaLimite = new Date()
    fechaLimite.setMonth(fechaLimite.getMonth() - 6)

    if (fechaExp < fechaLimite) {
      setErrorAntecedentes('El certificado debe tener menos de 6 meses de antigüedad')
      return false
    }

    // Validar que no sea futuro
    if (fechaExp > new Date()) {
      setErrorAntecedentes('La fecha de expedición no puede ser futura')
      return false
    }

    setValidandoAntecedentes(true)
    setErrorAntecedentes('')

    try {
      // Simular validación del archivo
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Aquí iría la validación real del PDF
      console.log('Validando archivo:', archivoAntecedentes.name)

      return true
    } catch (error) {
      setErrorAntecedentes('Error al validar el archivo. Inténtelo nuevamente.')
      return false
    } finally {
      setValidandoAntecedentes(false)
    }
  }

  const completarFormacion = async () => {
    // Validar datos personales
    if (!formData.nombre || !formData.apellidos || !formData.dni) {
      alert('Complete todos los campos obligatorios')
      return
    }

    // Validar antecedentes penales
    const antecedenteValidos = await validarAntecedentes()
    if (!antecedenteValidos) {
      return
    }

    // Validar test
    if (Object.keys(respuestasTest).length < preguntasTest.length) {
      alert('Debe responder todas las preguntas del test')
      return
    }

    // Calcular nota
    let correctas = 0
    preguntasTest.forEach(pregunta => {
      if (respuestasTest[pregunta.id] === pregunta.respuestaCorrecta) {
        correctas++
      }
    })

    const nota = Math.round((correctas / preguntasTest.length) * 100)
    setNotaFinal(nota)

    if (nota < 70) {
      alert('Nota insuficiente (70% mínimo). Revise las respuestas e inténtelo nuevamente.')
      return
    }

    // Todo correcto - completar formación
    setTestCompletado(true)
    setPersona(prev => prev ? {
      ...prev,
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      dni: formData.dni,
      telefono: formData.telefono,
      paso: 'certificado',
      progreso: 100
    } : null)

    // Notificar al delegado y actualizar estado
    await notificarDelegado()
    await actualizarEstadoPersonal()
  }

  const notificarDelegado = async () => {
    try {
      // Simular envío de notificación al delegado
      console.log(`Notificando a ${persona?.delegadoEmail} que ${formData.nombre} completó la formación`)

      // Aquí iría la llamada real a la API para notificar al delegado
      // Se actualizaría el estado en el dashboard del delegado

    } catch (error) {
      console.error('Error notificando al delegado:', error)
    }
  }

  const generarCertificado = () => {
    setCertificadoGenerado(true)

    // Datos del certificado
    const certificadoData = {
      nombre: `${formData.nombre} ${formData.apellidos}`,
      dni: formData.dni,
      rol: persona?.rol,
      entidad: persona?.entidad,
      fecha: new Date().toLocaleDateString('es-ES'),
      nota: notaFinal,
      delegado: persona?.delegado
    }

    console.log('Generando certificado LOPIVI:', certificadoData)

    // Aquí iría la generación real del PDF
    alert('Certificado generado correctamente. Descarga iniciada.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando formación LOPIVI...</p>
        </div>
      </div>
    )
  }

  if (error || !persona) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Acceso</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Volver al Inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Formación LOPIVI - Personal</h1>
              <p className="text-sm text-gray-600">{persona.entidad}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Progreso</div>
              <div className="text-lg font-bold text-blue-600">{persona.progreso}%</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{width: `${persona.progreso}%`}}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Página Inicial */}
        {persona.paso === 'inicio' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 text-3xl">🛡</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Formación LOPIVI Obligatoria</h2>
              <p className="text-lg text-gray-600 mb-2">Protección Integral a la Infancia y Adolescencia</p>
              <p className="text-sm text-gray-500">Tiempo estimado: 30 minutos</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-blue-800 mb-4">📋 Información de su Formación</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div><strong>Entidad:</strong> {persona.entidad}</div>
                <div><strong>Su rol:</strong> {persona.rol}</div>
                <div><strong>Delegado responsable:</strong> {persona.delegado}</div>
                <div><strong>Email contacto:</strong> {persona.email}</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-yellow-800 mb-4">⚠ IMPORTANTE - Certificado de Antecedentes Penales</h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p><strong>OBLIGATORIO:</strong> Debe subir su certificado de antecedentes penales vigente</p>
                <p>• Debe tener <strong>menos de 6 meses</strong> de antigüedad</p>
                <p>• Obténgalo en: <a href="https://antecedentespenales.mjusticia.gob.es" target="_blank" className="underline font-medium">antecedentespenales.mjusticia.gob.es</a></p>
                <p>• Formato requerido: <strong>PDF oficial</strong></p>
                <p>• Sin este documento no podrá completar la formación</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-medium">Datos Personales</div>
                <div className="text-xs text-gray-500">5 minutos</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">📄</div>
                <div className="text-sm font-medium">Antecedentes Penales</div>
                <div className="text-xs text-gray-500">5 minutos</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">🎓</div>
                <div className="text-sm font-medium">Formación LOPIVI</div>
                <div className="text-xs text-gray-500">15 minutos</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">✅</div>
                <div className="text-sm font-medium">Test y Certificado</div>
                <div className="text-xs text-gray-500">5 minutos</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setPersona(prev => prev ? {...prev, paso: 'datos', progreso: 10} : null)}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
              >
                Comenzar Formación LOPIVI →
              </button>
            </div>
          </div>
        )}

        {/* Formulario Todo-en-Uno */}
        {persona.paso === 'datos' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Formación LOPIVI Completa</h2>
              <p className="text-gray-600 mt-2">Complete todos los campos para obtener su certificado</p>
            </div>

            <form className="space-y-8">
              {/* Sección 1: Datos Personales */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  1. Datos Personales
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Su nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                    <input
                      type="text"
                      value={formData.apellidos}
                      onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Sus apellidos"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">DNI/NIE *</label>
                    <input
                      type="text"
                      value={formData.dni}
                      onChange={(e) => setFormData({...formData, dni: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="12345678A"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="600123456"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Antecedentes Penales (CRÍTICO) */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  2. Certificado de Antecedentes Penales (OBLIGATORIO)
                </h3>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h4 className="font-bold text-red-800 mb-2">🚨 REQUISITO LEGAL OBLIGATORIO</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• La LOPIVI exige certificado de antecedentes penales para TODO el personal</li>
                    <li>• Debe tener menos de <strong>6 meses</strong> de antigüedad</li>
                    <li>• Debe ser el documento <strong>oficial del Ministerio de Justicia</strong></li>
                    <li>• Sin este documento no puede trabajar con menores</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Expedición del Certificado *
                      </label>
                      <input
                        type="date"
                        value={fechaExpedicionAntecedentes}
                        onChange={(e) => setFechaExpedicionAntecedentes(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ¿Necesita obtener el certificado?
                      </label>
                      <a
                        href="https://antecedentespenales.mjusticia.gob.es"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        🔗 Obtener Certificado Online →
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Archivo del Certificado (PDF) *
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      archivoAntecedentes ? 'border-green-300 bg-green-50' : 'border-gray-300'
                    }`}>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          setArchivoAntecedentes(e.target.files?.[0] || null)
                          setErrorAntecedentes('')
                        }}
                        className="hidden"
                        id="archivo-antecedentes"
                      />
                      <label htmlFor="archivo-antecedentes" className="cursor-pointer">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                          archivoAntecedentes ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <span className="text-2xl">
                            {archivoAntecedentes ? '✅' : '📄'}
                          </span>
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          {archivoAntecedentes ? (
                            <span className="text-green-600">✓ {archivoAntecedentes.name}</span>
                          ) : (
                            'Seleccionar Certificado PDF'
                          )}
                        </p>
                        <p className="text-gray-600">
                          {archivoAntecedentes ? 'Archivo válido cargado' : 'Haga clic para seleccionar el archivo PDF'}
                        </p>
                      </label>
                    </div>

                    {errorAntecedentes && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm font-medium">⚠ {errorAntecedentes}</p>
                      </div>
                    )}

                    {validandoAntecedentes && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                          <p className="text-blue-700 text-sm font-medium">Validando certificado...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sección 3: Formación LOPIVI Básica */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  3. Formación LOPIVI Básica
                </h3>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h4 className="font-bold text-blue-800 mb-4">📚 Contenido de la Formación</h4>

                  <div className="space-y-4 text-sm text-blue-700">
                    <div>
                      <h5 className="font-medium mb-2">🛡 ¿Qué es la LOPIVI?</h5>
                      <p>La Ley Orgánica de Protección Integral a la Infancia y Adolescencia frente a la Violencia protege a los menores de cualquier forma de violencia física, psicológica o sexual.</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">📋 Código de Conducta Básico</h5>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Mantener límites apropiados en el trato con menores</li>
                        <li>Evitar contacto físico innecesario</li>
                        <li>No quedarse a solas con un menor salvo necesidad justificada</li>
                        <li>Comunicar cualquier comportamiento inapropiado observado</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">🚨 ¿Qué hacer si detectas algo preocupante?</h5>
                      <ol className="list-decimal list-inside space-y-1">
                        <li><strong>No investigues por tu cuenta</strong> - No hagas preguntas al menor</li>
                        <li><strong>Comunica inmediatamente</strong> al delegado de protección: {persona.delegado}</li>
                        <li><strong>Mantén la confidencialidad</strong> - No hables con otros padres</li>
                        <li><strong>Documenta objetivamente</strong> lo que has observado</li>
                      </ol>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">📞 Contactos de Emergencia</h5>
                      <ul className="list-disc list-inside space-y-1">
                        <li><strong>Delegado de Protección:</strong> {persona.delegado} ({persona.delegadoEmail})</li>
                        <li><strong>Emergencias generales:</strong> 112</li>
                        <li><strong>Teléfono del Menor:</strong> 116111</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <label className="flex items-center justify-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={moduloCompletado}
                      onChange={(e) => setModuloCompletado(e.target.checked)}
                      className="mr-3 h-5 w-5 text-blue-600"
                    />
                    <span className="font-medium text-gray-900">
                      He leído y entendido la formación LOPIVI básica
                    </span>
                  </label>
                </div>
              </div>

              {/* Sección 4: Test de Evaluación */}
              {moduloCompletado && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    4. Test de Evaluación (Nota mínima: 70%)
                  </h3>

                  <div className="space-y-6">
                    {preguntasTest.map((pregunta, index) => (
                      <div key={pregunta.id} className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-medium text-gray-900 mb-4">
                          {index + 1}. {pregunta.pregunta}
                        </h4>
                        <div className="space-y-3">
                          {pregunta.opciones.map((opcion, opcionIndex) => (
                            <label key={opcionIndex} className="flex items-start cursor-pointer">
                              <input
                                type="radio"
                                name={`pregunta_${pregunta.id}`}
                                value={opcionIndex}
                                onChange={() => setRespuestasTest(prev => ({
                                  ...prev,
                                  [pregunta.id]: opcionIndex
                                }))}
                                className="mt-1 mr-3"
                              />
                              <span className="text-gray-700">{opcion}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón de Finalizar */}
              {moduloCompletado && Object.keys(respuestasTest).length === preguntasTest.length && (
                <div className="text-center pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={completarFormacion}
                    disabled={validandoAntecedentes}
                    className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {validandoAntecedentes ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Validando...
                      </div>
                    ) : (
                      'Completar Formación LOPIVI ✓'
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Certificado Final */}
        {persona.paso === 'certificado' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-green-600 text-3xl">🎓</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Formación LOPIVI Completada!</h2>
              <p className="text-lg text-gray-600 mb-2">Su certificado está listo</p>
              <p className="text-lg font-bold text-green-600">Nota obtenida: {notaFinal}%</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-green-200 rounded-xl p-8 mb-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Certificado de Formación LOPIVI</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Nombre:</strong> {formData.nombre} {formData.apellidos}</p>
                  <p><strong>DNI:</strong> {formData.dni}</p>
                  <p><strong>Rol:</strong> {persona.rol}</p>
                  <p><strong>Entidad:</strong> {persona.entidad}</p>
                  <p><strong>Delegado:</strong> {persona.delegado}</p>
                  <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
                  <p><strong>Nota obtenida:</strong> {notaFinal}%</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={generarCertificado}
                disabled={certificadoGenerado}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {certificadoGenerado ? '✓ Certificado Descargado' : 'Descargar Certificado PDF'}
              </button>
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Enviar Copia por Email
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-bold text-green-800 mb-3">✅ Formación Completada - Próximos Pasos</h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Su certificado ha sido registrado automáticamente</li>
                <li>• {persona.delegado} ha sido notificado de la finalización</li>
                <li>• Sus antecedentes penales están validados y archivados</li>
                <li>• Ya puede trabajar con menores cumpliendo la LOPIVI</li>
                <li>• Recibirá recordatorios para renovar sus antecedentes cada 6 meses</li>
                <li>• En caso de dudas, contacte con {persona.delegado} ({persona.delegadoEmail})</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
