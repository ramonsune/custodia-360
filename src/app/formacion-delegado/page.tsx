'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FormacionDelegado() {
  const [loading, setLoading] = useState(true)
  const [usuario, setUsuario] = useState<any>(null)
  const [moduloActual, setModuloActual] = useState(0)
  const [progreso, setProgreso] = useState(0)
  const [modulosCompletados, setModulosCompletados] = useState<boolean[]>(Array(8).fill(false))
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay usuario logueado
    const usuarioData = localStorage.getItem('usuario_custodia360')
    if (!usuarioData) {
      router.push('/acceso')
      return
    }

    const user = JSON.parse(usuarioData)
    if (user.tipo !== 'delegado' || user.formado) {
      router.push('/acceso')
      return
    }

    setUsuario(user)
    setLoading(false)
  }, [router])

  const cerrarSesion = () => {
    localStorage.removeItem('usuario_custodia360')
    router.push('/acceso')
  }

  const completarModulo = (indice: number) => {
    const nuevosCompletados = [...modulosCompletados]
    nuevosCompletados[indice] = true
    setModulosCompletados(nuevosCompletados)

    const completados = nuevosCompletados.filter(Boolean).length
    setProgreso((completados / 8) * 100)

    if (completados === 8) {
      // Marcar usuario como formado
      const usuarioActualizado = { ...usuario, formado: true }
      localStorage.setItem('usuario_custodia360', JSON.stringify(usuarioActualizado))
      setTimeout(() => {
        router.push('/panel-delegado')
      }, 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const modulos = [
    {
      titulo: "Introducción a la LOPIVI",
      descripcion: "Fundamentos de la Ley Orgánica de Protección Integral a la Infancia y la Adolescencia",
      duracion: "45 min",
      contenido: "Marco legal, principios fundamentales y objetivos de la LOPIVI. Comprenda la importancia de la protección infantil en su entidad."
    },
    {
      titulo: "Rol del Delegado de Protección",
      descripcion: "Funciones, responsabilidades y competencias del delegado",
      duracion: "60 min",
      contenido: "Definición del rol, responsabilidades legales, límites de actuación y coordinación con otros profesionales."
    },
    {
      titulo: "Detección de Situaciones de Riesgo",
      descripcion: "Identificación de indicadores y señales de alarma",
      duracion: "90 min",
      contenido: "Indicadores físicos, emocionales y comportamentales. Factores de riesgo y situaciones vulnerables en el entorno deportivo/educativo."
    },
    {
      titulo: "Protocolos de Actuación",
      descripcion: "Procedimientos ante diferentes tipos de incidencias",
      duracion: "75 min",
      contenido: "Protocolos paso a paso para maltrato, abuso, negligencia, acoso. Comunicación con servicios competentes y familia."
    },
    {
      titulo: "Comunicación y Documentación",
      descripcion: "Técnicas de comunicación efectiva y registro de incidencias",
      duracion: "50 min",
      contenido: "Comunicación con menores, familias y profesionales. Documentación legal, confidencialidad y protección de datos."
    },
    {
      titulo: "Prevención e Intervención",
      descripcion: "Estrategias preventivas y planes de intervención",
      duracion: "65 min",
      contenido: "Desarrollo de entornos seguros, programas preventivos, intervención temprana y seguimiento de casos."
    },
    {
      titulo: "Marco Legal y Ético",
      descripcion: "Aspectos legales y consideraciones éticas",
      duracion: "55 min",
      contenido: "Normativa aplicable, responsabilidades legales, aspectos éticos de la intervención y límites profesionales."
    },
    {
      titulo: "Casos Prácticos y Evaluación",
      descripcion: "Simulación de casos reales y evaluación final",
      duracion: "80 min",
      contenido: "Análisis de casos prácticos, toma de decisiones, evaluación de conocimientos y certificación final."
    }
  ]

  const progresoModulos = modulosCompletados.filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">📚</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Formación de Delegado</h1>
                <p className="text-gray-600">{usuario?.entidad} - {usuario?.nombre}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                En Formación
              </span>
              <button
                onClick={cerrarSesion}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso de Formación</span>
            <span className="text-sm font-medium text-gray-700">{progresoModulos}/8 módulos completados</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {progreso === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 text-xl">🎉</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-900">¡Formación Completada!</h3>
                <p className="text-green-700">Has completado exitosamente todos los módulos. Serás redirigido a tu panel de delegado...</p>
              </div>
            </div>
          </div>
        )}

        {/* Información del Programa */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-2">Programa de Formación de Delegado de Protección</h2>
          <p className="text-blue-800 mb-4">
            Este programa te capacitará para ejercer como Delegado de Protección según los requisitos de la LOPIVI.
            Completa todos los módulos para obtener tu certificación.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-blue-800">
            <div>
              <p className="font-medium">Duración Total</p>
              <p className="text-lg font-bold">8 horas</p>
            </div>
            <div>
              <p className="font-medium">Modalidad</p>
              <p className="text-lg font-bold">Online</p>
            </div>
            <div>
              <p className="font-medium">Certificación</p>
              <p className="text-lg font-bold">Oficial</p>
            </div>
          </div>
        </div>

        {/* Módulos de Formación */}
        <div className="grid md:grid-cols-2 gap-6">
          {modulos.map((modulo, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${
                modulosCompletados[index]
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-bold text-gray-600 mr-3">#{index + 1}</span>
                    <h3 className="text-lg font-bold text-gray-900">{modulo.titulo}</h3>
                  </div>
                  <p className="text-gray-600 mb-3">{modulo.descripcion}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-4">⏱️ {modulo.duracion}</span>
                    {modulosCompletados[index] && (
                      <span className="text-green-600 font-medium">✅ Completado</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">{modulo.contenido}</p>
              </div>

              <div className="flex space-x-3">
                {!modulosCompletados[index] ? (
                  <>
                    <button
                      onClick={() => setModuloActual(index)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Comenzar Módulo
                    </button>
                    <button
                      onClick={() => completarModulo(index)}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Marcar Completado
                    </button>
                  </>
                ) : (
                  <button className="w-full bg-green-100 text-green-800 py-2 rounded-lg cursor-default">
                    ✅ Módulo Completado
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Información de Soporte */}
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 mt-8">
          <h4 className="font-semibold text-gray-900 mb-2">¿Necesitas ayuda con la formación?</h4>
          <p className="text-gray-700 mb-4">
            Si tienes dudas sobre el contenido o problemas técnicos, nuestro equipo está disponible para ayudarte.
          </p>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Contactar Tutor
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Soporte Técnico
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
