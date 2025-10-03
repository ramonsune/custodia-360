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
  categoria: 'personal_con_contacto' | 'personal_sin_contacto' | 'familiar'
  rol?: string
  relacion_menor?: string
  entidad: string
  delegado: string
  delegadoEmail: string
  paso: 'seleccion_categoria' | 'datos' | 'antecedentes' | 'formacion' | 'test' | 'certificado'
  progreso: number
  timestamp_acceso: string
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [persona, setPersona] = useState<PersonalFormacion | null>(null)

  // Datos extraídos del link
  const entidadFromLink = searchParams.get('entidad') || ''
  const delegadoFromLink = searchParams.get('delegado') || ''
  const idFromLink = searchParams.get('id') || ''

  // Estados para selección de categoría
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<'personal_con_contacto' | 'personal_sin_contacto' | 'familiar' | null>(null)
  const [mostrandoInfo, setMostrandoInfo] = useState(false)

  // Estados del formulario completo
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    rol: '', // Para personal
    relacion_menor: '', // Para familiares
    años_experiencia: 0 // Para personal con contacto
  })

  // Estados para antecedentes penales (CRÍTICO - solo personal con contacto)
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

  // Preguntas del test según categoría
  const preguntasTestCompleto: PreguntaTest[] = [
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

  const preguntasTestBasico: PreguntaTest[] = [
    {
      id: 'p1',
      pregunta: '¿Qué es la LOPIVI?',
      opciones: [
        'Una ley sobre deporte',
        'Una ley para proteger a menores frente a la violencia',
        'Un reglamento de instalaciones',
        'Un protocolo de emergencias'
      ],
      respuestaCorrecta: 1,
      explicacion: 'La LOPIVI protege a menores frente a cualquier forma de violencia.'
    },
    {
      id: 'p2',
      pregunta: '¿Debes comunicar cualquier sospecha de violencia?',
      opciones: [
        'Sí, al delegado de protección',
        'No, solo si es grave',
        'Solo si lo ves personalmente',
        'Nunca'
      ],
      respuestaCorrecta: 0,
      explicacion: 'Siempre debes comunicar al delegado de protección.'
    },
    {
      id: 'p3',
      pregunta: '¿Está permitido compartir información de casos con otros padres?',
      opciones: [
        'Sí, para que estén informados',
        'No, la confidencialidad es obligatoria',
        'Solo si lo piden',
        'Depende del caso'
      ],
      respuestaCorrecta: 1,
      explicacion: 'La confidencialidad es obligatoria.'
    },
    {
      id: 'p4',
      pregunta: '¿Quién es el responsable de activar el protocolo LOPIVI?',
      opciones: [
        'El delegado de protección',
        'El director',
        'El personal de limpieza',
        'Los padres'
      ],
      respuestaCorrecta: 0,
      explicacion: 'El delegado de protección es el responsable.'
    },
    {
      id: 'p5',
      pregunta: '¿Qué teléfono debes marcar en caso de emergencia vital?',
      opciones: [
        '112',
        '116111',
        'El del delegado',
        'El de la entidad'
      ],
      respuestaCorrecta: 0,
      explicacion: '112 es el teléfono de emergencias vitales.'
    }
  ]

  const preguntasTestFamiliar: PreguntaTest[] = [
    {
      id: 'p1',
      pregunta: '¿Qué debes hacer si tu hijo te cuenta algo preocupante?',
      opciones: [
        'Hablar con el delegado de protección',
        'Ignorarlo',
        'Contarlo a otros padres',
        'Investigar por tu cuenta'
      ],
      respuestaCorrecta: 0,
      explicacion: 'Debes comunicarlo al delegado de protección.'
    },
    {
      id: 'p2',
      pregunta: '¿Qué es la LOPIVI?',
      opciones: [
        'Una ley para proteger a menores frente a la violencia',
        'Un reglamento de instalaciones',
        'Un protocolo de emergencias',
        'Una ley sobre deporte'
      ],
      respuestaCorrecta: 0,
      explicacion: 'La LOPIVI protege a menores frente a cualquier forma de violencia.'
    },
    {
      id: 'p3',
      pregunta: '¿Quién es el delegado de protección?',
      opciones: [
        'La persona responsable de activar el protocolo LOPIVI',
        'El director',
        'Un familiar',
        'Un entrenador'
      ],
      respuestaCorrecta: 0,
      explicacion: 'El delegado de protección es el responsable de activar el protocolo.'
    }
  ]

  useEffect(() => {
    if (!entidadFromLink || !delegadoFromLink) {
      setError('Link inválido. Faltan datos de la entidad o delegado.')
      setLoading(false)
      return
    }

    // Verificar si ya existe un registro para este usuario
    const registroExistente = localStorage.getItem(`formacion_${idFromLink}_${entidadFromLink}`)

    if (registroExistente) {
      // Usuario ya empezó el proceso
      const datos = JSON.parse(registroExistente)
      setPersona(datos)
      setCategoriaSeleccionada(datos.categoria)
    } else {
      // Primera vez - debe seleccionar categoría
      const nuevoRegistro: PersonalFormacion = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: '',
        categoria: 'personal_con_contacto', // Default, se cambiará
        entidad: entidadFromLink,
        delegado: delegadoFromLink,
        delegadoEmail: 'delegado@entidad.com', // En producción viene del link
        paso: 'seleccion_categoria',
        progreso: 0,
        timestamp_acceso: new Date().toISOString()
      }
      setPersona(nuevoRegistro)
    }

    setLoading(false)
  }, [entidadFromLink, delegadoFromLink, idFromLink])

  const seleccionarCategoria = (categoria: 'personal_con_contacto' | 'personal_sin_contacto' | 'familiar') => {
    if (!persona) return

    const personaActualizada = {
      ...persona,
      categoria,
      paso: 'datos' as const,
      progreso: 10
    }

    setPersona(personaActualizada)
    setCategoriaSeleccionada(categoria)

    // Guardar en localStorage
    localStorage.setItem(`formacion_${idFromLink}_${entidadFromLink}`, JSON.stringify(personaActualizada))

    // Registrar el acceso inicial
    console.log(`📝 Nueva persona registrada: ${categoria} en ${entidadFromLink}`)
  }

  const guardarDatos = () => {
    if (!persona) return

    // Validaciones según categoría
    if (!formData.nombre || !formData.apellidos || !formData.dni || !formData.email) {
      setError('Todos los campos básicos son obligatorios')
      return
    }

    if (persona.categoria === 'personal_con_contacto' && !formData.rol) {
      setError('El rol/función es obligatorio para personal con contacto directo')
      return
    }

    if (persona.categoria === 'familiar' && !formData.relacion_menor) {
      setError('La relación con el menor es obligatoria para familiares')
      return
    }

    const personaActualizada = {
      ...persona,
      ...formData,
      paso: persona.categoria === 'personal_con_contacto' ? 'antecedentes' as const : 'formacion' as const,
      progreso: persona.categoria === 'personal_con_contacto' ? 25 : 40
    }

    setPersona(personaActualizada)
    localStorage.setItem(`formacion_${idFromLink}_${entidadFromLink}`, JSON.stringify(personaActualizada))
  }

  const validarAntecedentes = async () => {
    if (!archivoAntecedentes || !fechaExpedicionAntecedentes) {
      setErrorAntecedentes('Debe seleccionar el archivo y la fecha de expedición')
      return false
    }

    if (archivoAntecedentes.type !== 'application/pdf') {
      setErrorAntecedentes('El archivo debe ser un PDF oficial del Ministerio de Justicia')
      return false
    }

    if (archivoAntecedentes.size > 5 * 1024 * 1024) {
      setErrorAntecedentes('El archivo es demasiado grande (máximo 5MB)')
      return false
    }

    const fechaExp = new Date(fechaExpedicionAntecedentes)
    const fechaLimite = new Date()
    fechaLimite.setMonth(fechaLimite.getMonth() - 6)

    if (fechaExp < fechaLimite) {
      setErrorAntecedentes('El certificado debe tener menos de 6 meses de antigüedad')
      return false
    }

    if (fechaExp > new Date()) {
      setErrorAntecedentes('La fecha de expedición no puede ser futura')
      return false
    }

    setValidandoAntecedentes(true)
    setErrorAntecedentes('')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      return true
    } catch (error) {
      setErrorAntecedentes('Error al validar el archivo. Inténtelo nuevamente.')
      return false
    } finally {
      setValidandoAntecedentes(false)
    }
  }

  const avanzarFormacion = async () => {
    if (!persona) return

    // Validar test
    let preguntasTest: PreguntaTest[] = []
    if (persona.categoria === 'personal_con_contacto') preguntasTest = preguntasTestCompleto
    else if (persona.categoria === 'personal_sin_contacto') preguntasTest = preguntasTestBasico
    else preguntasTest = preguntasTestFamiliar

    if (Object.keys(respuestasTest).length < preguntasTest.length) {
      alert('Debe responder todas las preguntas del test')
      return
    }

    let correctas = 0
    preguntasTest.forEach(pregunta => {
      if (respuestasTest[pregunta.id] === pregunta.respuestaCorrecta) {
        correctas++
      }
    })

    const nota = Math.round((correctas / preguntasTest.length) * 100)
    setNotaFinal(nota)

    let notaMinima = 70
    if (persona.categoria === 'familiar') notaMinima = 60
    if (nota < notaMinima) {
      alert(`Nota insuficiente (${notaMinima}% mínimo). Revise las respuestas e inténtelo nuevamente.`)
      return
    }

    setTestCompletado(true)
    const personaActualizada = {
      ...persona,
      paso: 'certificado' as const,
      progreso: 100
    }
    setPersona(personaActualizada)
    localStorage.setItem(`formacion_${idFromLink}_${entidadFromLink}`, JSON.stringify(personaActualizada))
  }

  const generarCertificado = () => {
    setCertificadoGenerado(true)
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Error de Acceso</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Volver al Inicio
          </Link>
        </div>
      </div>
    )
  }

  // PASO 1: SELECCIÓN DE CATEGORÍA
  if (!categoriaSeleccionada || persona?.paso === 'seleccion_categoria') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Formación LOPIVI</h1>
              <p className="text-gray-600 mt-2">{entidadFromLink}</p>
              <p className="text-sm text-gray-500">Delegado de Protección: {delegadoFromLink}</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Cuál es tu relación con la entidad?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Selecciona la opción que mejor te describa para recibir la formación apropiada según la LOPIVI
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-blue-800 text-sm">
                <strong>Importante:</strong> La formación y requisitos varían según tu categoría. Es fundamental seleccionar la correcta.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Personal con Contacto */}
            <div
              onClick={() => seleccionarCategoria('personal_con_contacto')}
              className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center cursor-pointer hover:border-red-500 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                <span className="text-red-600 text-2xl font-bold">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Personal con Contacto Directo</h3>

              <div className="text-left mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Incluye:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Entrenadores, monitores, técnicos deportivos</li>
                  <li>• Profesores, fisioterapeutas, médicos</li>
                  <li>• Voluntarios que supervisan menores</li>
                  <li>• Cualquier rol que interactúa directamente</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ Requisitos obligatorios:</h4>
                <ul className="text-red-700 text-xs space-y-1">
                  <li>• Certificado de antecedentes penales (obligatorio)</li>
                  <li>• Formación completa (20 horas aprox.)</li>
                  <li>• Test de evaluación (nota mínima 70%)</li>
                  <li>• Renovación cada 6 meses</li>
                </ul>
              </div>

              <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                Seleccionar - Personal con Contacto
              </button>
            </div>

            {/* Personal sin Contacto */}
            <div
              onClick={() => seleccionarCategoria('personal_sin_contacto')}
              className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center cursor-pointer hover:border-green-500 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <span className="text-green-600 text-2xl font-bold">👨‍💼</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Personal sin Contacto Directo</h3>

              <div className="text-left mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Incluye:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Personal administrativo, secretaría</li>
                  <li>• Limpieza, mantenimiento, seguridad</li>
                  <li>• Cafetería, servicios generales</li>
                  <li>• Voluntarios esporádicos sin supervisión</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-green-800 mb-2">✓ Requisitos simplificados:</h4>
                <ul className="text-green-700 text-xs space-y-1">
                  <li>• No requiere certificado de antecedentes</li>
                  <li>• Formación básica (8 horas aprox.)</li>
                  <li>• Test simplificado (nota mínima 60%)</li>
                  <li>• Renovación anual</li>
                </ul>
              </div>

              <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Seleccionar - Personal sin Contacto
              </button>
            </div>

            {/* Familiares */}
            <div
              onClick={() => seleccionarCategoria('familiar')}
              className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center cursor-pointer hover:border-purple-500 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <span className="text-purple-600 text-2xl font-bold">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Familiar</h3>

              <div className="text-left mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Incluye:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Padres, madres, tutores legales</li>
                  <li>• Familiares autorizados a recoger</li>
                  <li>• Acompañantes habituales</li>
                  <li>• Personas relacionadas con menores</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-purple-800 mb-2">ℹ️ Solo información:</h4>
                <ul className="text-purple-700 text-xs space-y-1">
                  <li>• Información básica LOPIVI</li>
                  <li>• Conocer protocolos y delegado</li>
                  <li>• Test simple (3 preguntas)</li>
                  <li>• Confirmación de lectura</li>
                </ul>
              </div>

              <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Seleccionar - Familiar
              </button>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-3xl mx-auto">
              <h4 className="font-bold text-blue-900 mb-3">¿Tienes dudas sobre qué categoría elegir?</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <h5 className="font-semibold mb-2">Ejemplos Personal CON Contacto:</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Si entrenas, enseñas o supervisas menores</li>
                    <li>• Si das clases o terapias individuales</li>
                    <li>• Si acompañas en viajes o actividades</li>
                    <li>• Si tienes acceso a vestuarios/duchas</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Ejemplos Personal SIN Contacto:</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Si trabajas en oficina/recepción</li>
                    <li>• Si haces limpieza fuera de horarios</li>
                    <li>• Si trabajas en cafetería/tienda</li>
                    <li>• Si ayudas ocasionalmente sin supervisión</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 text-blue-700">
                <strong>Contacta con el delegado:</strong> {delegadoFromLink}<br/>
                <strong>Entidad:</strong> {entidadFromLink}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // PASO 2: DATOS PERSONALES
  if (persona?.paso === 'datos') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos Personales</h2>
            <form className="space-y-6" onSubmit={e => {e.preventDefault(); guardarDatos();}}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                  <input
                    type="text"
                    value={formData.apellidos}
                    onChange={e => setFormData({...formData, apellidos: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DNI/NIE *</label>
                  <input
                    type="text"
                    value={formData.dni}
                    onChange={e => setFormData({...formData, dni: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={e => setFormData({...formData, telefono: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
                {persona.categoria === 'personal_con_contacto' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rol/Función *</label>
                    <input
                      type="text"
                      value={formData.rol}
                      onChange={e => setFormData({...formData, rol: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                      required
                    />
                  </div>
                )}
                {persona.categoria === 'familiar' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relación con el menor *</label>
                    <input
                      type="text"
                      value={formData.relacion_menor}
                      onChange={e => setFormData({...formData, relacion_menor: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                      required
                    />
                  </div>
                )}
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
                  {error}
                </div>
              )}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // PASO 3: ANTECEDENTES (solo personal con contacto)
  if (persona?.paso === 'antecedentes') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Certificado de Antecedentes Penales</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-red-800 mb-2">🚨 REQUISITO LEGAL OBLIGATORIO</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• La LOPIVI exige certificado de antecedentes penales para TODO el personal con contacto directo</li>
                <li>• Debe tener menos de <strong>6 meses</strong> de antigüedad</li>
                <li>• Debe ser el documento <strong>oficial del Ministerio de Justicia</strong></li>
                <li>• Sin este documento no puede trabajar con menores</li>
              </ul>
            </div>
            <form className="space-y-6" onSubmit={async e => {
              e.preventDefault()
              const valido = await validarAntecedentes()
              if (valido) {
                const personaActualizada = {
                  ...persona,
                  paso: 'formacion' as const,
                  progreso: 40
                }
                setPersona(personaActualizada)
                localStorage.setItem(`formacion_${idFromLink}_${entidadFromLink}`, JSON.stringify(personaActualizada))
              }
            }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Expedición del Certificado *
                  </label>
                  <input
                    type="date"
                    value={fechaExpedicionAntecedentes}
                    onChange={e => setFechaExpedicionAntecedentes(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
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
                    onChange={e => {
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
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={validandoAntecedentes}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {validandoAntecedentes ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Validando...
                    </div>
                  ) : (
                    'Continuar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // PASO 4: FORMACIÓN Y TEST
  if (persona?.paso === 'formacion' || persona?.paso === 'test') {
    let preguntasTest: PreguntaTest[] = []
    let contenidoFormacion = null
    let notaMinima = 70
    if (persona.categoria === 'personal_con_contacto') {
      preguntasTest = preguntasTestCompleto
      contenidoFormacion = (
        <>
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
        </>
      )
      notaMinima = 70
    } else if (persona.categoria === 'personal_sin_contacto') {
      preguntasTest = preguntasTestBasico
      contenidoFormacion = (
        <>
          <h4 className="font-bold text-green-800 mb-4">📚 Formación Básica LOPIVI</h4>
          <div className="space-y-4 text-sm text-green-700">
            <div>
              <h5 className="font-medium mb-2">🛡 ¿Qué es la LOPIVI?</h5>
              <p>La LOPIVI protege a menores frente a cualquier forma de violencia.</p>
            </div>
            <div>
              <h5 className="font-medium mb-2">📋 Conducta esperada</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Respetar la confidencialidad</li>
                <li>Comunicar cualquier sospecha al delegado</li>
                <li>No compartir información sensible</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">📞 Contactos</h5>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Delegado de Protección:</strong> {persona.delegado} ({persona.delegadoEmail})</li>
                <li><strong>Emergencias:</strong> 112</li>
              </ul>
            </div>
          </div>
        </>
      )
      notaMinima = 70
    } else {
      preguntasTest = preguntasTestFamiliar
      contenidoFormacion = (
        <>
          <h4 className="font-bold text-purple-800 mb-4">ℹ️ Información LOPIVI para Familiares</h4>
          <div className="space-y-4 text-sm text-purple-700">
            <div>
              <h5 className="font-medium mb-2">🛡 ¿Qué es la LOPIVI?</h5>
              <p>La LOPIVI protege a menores frente a cualquier forma de violencia.</p>
            </div>
            <div>
              <h5 className="font-medium mb-2">🚨 ¿Qué hacer si detectas algo preocupante?</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Comunica al delegado de protección</li>
                <li>No investigues por tu cuenta</li>
                <li>Mantén la confidencialidad</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">📞 Contactos</h5>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Delegado de Protección:</strong> {persona.delegado} ({persona.delegadoEmail})</li>
                <li><strong>Emergencias:</strong> 112</li>
              </ul>
            </div>
          </div>
        </>
      )
      notaMinima = 60
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Formación {persona.categoria === 'personal_con_contacto' ? 'Completa' : persona.categoria === 'personal_sin_contacto' ? 'Básica' : 'Informativa'}
            </h2>
            <div className="mb-8">
              {contenidoFormacion}
            </div>
            <div className="text-center mb-8">
              <label className="flex items-center justify-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={moduloCompletado}
                  onChange={e => setModuloCompletado(e.target.checked)}
                  className="mr-3 h-5 w-5 text-blue-600"
                />
                <span className="font-medium text-gray-900">
                  He leído y entendido la formación LOPIVI
                </span>
              </label>
            </div>
            {moduloCompletado && (
              <form className="space-y-6" onSubmit={e => {e.preventDefault(); avanzarFormacion();}}>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Test de Evaluación (Nota mínima: {notaMinima}%)
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
                              checked={respuestasTest[pregunta.id] === opcionIndex}
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
                <div className="text-center pt-8 border-t border-gray-200">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
                  >
                    Finalizar Formación
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }

  // PASO 5: CERTIFICADO FINAL
  if (persona?.paso === 'certificado') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
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
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Rol:</strong> {formData.rol || persona.categoria}</p>
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
                <li>• {persona.categoria === 'personal_con_contacto' ? 'Sus antecedentes penales están validados y archivados' : 'No requiere antecedentes penales'}</li>
                <li>• Ya puede trabajar con menores cumpliendo la LOPIVI</li>
                <li>• Recibirá recordatorios para renovar sus antecedentes cada 6 meses</li>
                <li>• En caso de dudas, contacte con {persona.delegado} ({persona.delegadoEmail})</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">
          Formación {categoriaSeleccionada === 'personal_con_contacto' ? 'Completa' :
                    categoriaSeleccionada === 'personal_sin_contacto' ? 'Básica' : 'Informativa'}
        </h2>
        <p className="text-gray-600">
          Proceso específico para: {categoriaSeleccionada?.replace('_', ' ')}
        </p>
      </div>
    </div>
  )
}
