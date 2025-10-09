'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FormacionSuplente() {
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
    if (user.tipo !== 'suplente' || user.formado) {
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
        router.push('/panel-suplente')
      }, 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const modulos = [
    {
      titulo: "Introducción a la LOPIVI para Suplentes",
      descripcion: "Marco legal específico para delegados suplentes",
      duracion: "40 min",
      contenido: "Fundamentos legales, rol específico del suplente y diferencias con el delegado principal. Importancia del backup en protección infantil."
    },
    {
      titulo: "Rol del Delegado Suplente",
      descripcion: "Funciones específicas y coordinación con el delegado principal",
      duracion: "50 min",
      contenido: "Responsabilidades como suplente, cuándo actuar, coordinación con delegado principal y continuidad en la protección."
    },
    {
      titulo: "Detección de Indicadores de Riesgo",
      descripcion: "Identificación temprana desde la perspectiva del suplente",
      duracion: "75 min",
      contenido: "Señales de alarma específicas, observación complementaria y reporte al delegado principal. Casos que requieren intervención inmediata."
    },
    {
      titulo: "Protocolos de Actuación para Suplentes",
      descripcion: "Procedimientos específicos cuando actúa como suplente",
      duracion: "65 min",
      contenido: "Protocolos de emergencia, actuación en ausencia del delegado principal, comunicación urgente y escalado de casos."
    },
    {
      titulo: "Coordinación con Delegado Principal",
      descripcion: "Trabajo en equipo y comunicación efectiva",
      duracion: "45 min",
      contenido: "Canales de comunicación, seguimiento conjunto de casos, traspaso de información y trabajo colaborativo."
    },
    {
      titulo: "Formación Continua del Suplente",
      descripcion: "Actualización y desarrollo profesional continuo",
      duracion: "55 min",
      contenido: "Mantenimiento de competencias, formación complementaria, actualización normativa y mejora continua."
    },
    {
      titulo: "Documentación y Registros del Suplente",
      descripcion: "Gestión documental específica para suplentes",
      duracion: "50 min",
      contenido: "Documentación de respaldo, registros complementarios, confidencialidad y acceso a información sensible."
    },
    {
      titulo: "Evaluación y Certificación Suplente",
      descripcion: "Casos prácticos y evaluación final especializada",
      duracion: "70 min",
      contenido: "Simulación de escenarios reales para suplentes, toma de decisiones en situaciones críticas y certificación oficial."
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
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">📚</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Formación de Suplente</h1>
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
              className="bg-purple-600 h-3 rounded-full transition-all duration-500"
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
                <p className="text-green-700">Has completado exitosamente todos los módulos especializados. Serás redirigido a tu panel de suplente...</p>
              </div>
            </div>
          </div>
        )}

        {/* Información del Programa */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-purple-900 mb-2">Programa de Formación de Delegado Suplente</h2>
          <p className="text-purple-800 mb-4">
            Este programa especializado te capacitará para ejercer como Delegado Suplente de Protección con competencias
            específicas de coordinación y respaldo. Completa todos los módulos para obtener tu certificación oficial.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-purple-800">
            <div>
              <p className="font-medium">Duración Total</p>
              <p className="text-lg font-bold">7 horas</p>
            </div>
            <div>
              <p className="font-medium">Modalidad</p>
              <p className="text-lg font-bold">Online Especializada</p>
            </div>
            <div>
              <p className="font-medium">Certificación</p>
              <p className="text-lg font-bold">Oficial Suplente</p>
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
                  : 'border-gray-200 hover:border-purple-300'
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

              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">{modulo.contenido}</p>
              </div>

              <div className="flex space-x-3">
                {!modulosCompletados[index] ? (
                  <>
                    <button
                      onClick={() => setModuloActual(index)}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
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

        {/* Diferencias con Delegado Principal */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h4 className="font-semibold text-yellow-900 mb-2">🔄 Rol Especializado de Suplente</h4>
          <p className="text-yellow-800 mb-4">
            Como delegado suplente, tu formación incluye competencias específicas de coordinación, respaldo y actuación
            en situaciones donde el delegado principal no esté disponible.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-yellow-800">
            <div>
              <p className="font-medium">✓ Coordinación Complementaria</p>
              <p className="text-sm">Trabajo conjunto con delegado principal</p>
            </div>
            <div>
              <p className="font-medium">✓ Respaldo en Emergencias</p>
              <p className="text-sm">Actuación inmediata cuando es necesario</p>
            </div>
          </div>
        </div>

        {/* Información de Soporte */}
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 mt-8">
          <h4 className="font-semibold text-gray-900 mb-2">¿Necesitas ayuda con la formación?</h4>
          <p className="text-gray-700 mb-4">
            Si tienes dudas sobre el contenido específico para suplentes o problemas técnicos, contacta con nuestro equipo especializado.
          </p>
          <div className="flex space-x-4">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Contactar Tutor Especializado
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
