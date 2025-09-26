'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BienvenidaFormacionPage() {
  const router = useRouter()
  const [pasoActual, setPasoActual] = useState(1) // Empezamos en paso 1 de 5

  // Obtener datos de sesión real del localStorage/sessionStorage
  const getSessionData = () => {
    try {
      // Intentar obtener de localStorage primero
      const persistentSession = localStorage.getItem('userSession')
      if (persistentSession) {
        const session = JSON.parse(persistentSession)
        if (new Date(session.expiracion) > new Date()) {
          return {
            ...session,
            tipoEntidad: 'club-deportivo' // Asumir club deportivo por defecto
          }
        }
      }

      // Intentar de sessionStorage
      const tempSession = sessionStorage.getItem('userSession')
      if (tempSession) {
        const session = JSON.parse(tempSession)
        if (new Date(session.expiracion) > new Date()) {
          return {
            ...session,
            tipoEntidad: 'club-deportivo'
          }
        }
      }

      // Fallback para demo si no hay sesión
      return {
        id: 'demo_formacion_001',
        nombre: 'Ana Fernández López',
        email: 'nuevo@custodia360.com',
        tipo: 'principal' as const,
        entidad: 'Club Deportivo Los Leones',
        tipoEntidad: 'club-deportivo',
        certificacionVigente: false
      }
    } catch (error) {
      console.error('Error obteniendo datos de sesión:', error)
      return {
        id: 'demo_formacion_001',
        nombre: 'Ana Fernández López',
        email: 'nuevo@custodia360.com',
        tipo: 'principal' as const,
        entidad: 'Club Deportivo Los Leones',
        tipoEntidad: 'club-deportivo',
        certificacionVigente: false
      }
    }
  }

  const sessionData = getSessionData()

  // Pasos del nuevo flujo (5 pasos)
  const pasos = [
    { id: 1, titulo: 'Bienvenida', descripcion: 'Introducción personalizada', activo: true },
    { id: 2, titulo: 'Formación', descripcion: 'Contenido LOPIVI', activo: false },
    { id: 3, titulo: 'Test', descripcion: 'Evaluación', activo: false },
    { id: 4, titulo: 'Formación', descripcion: 'Obtener certificado', activo: false },
    { id: 5, titulo: 'Configuración', descripcion: 'Canal + Link + Mapa riesgos', activo: false }
  ]

  const continuarFormacion = () => {
    router.push('/formacion-lopivi/campus')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mr-4">
                F
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Formación Custodia360 - {sessionData.entidad}</h1>
                <p className="text-sm text-gray-600">Certificación como Delegado/a de Protección {sessionData.tipo === 'principal' ? 'Principal' : 'Suplente'}</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>Delegado/a: {sessionData.nombre}</div>
              <div>Tipo: {sessionData.tipo === 'principal' ? 'Principal' : 'Suplente'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Timeline de progreso - 5 pasos */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Su Proceso de Formación Custodia360</h2>

          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center w-full max-w-6xl">
              {pasos.map((paso, index) => (
                <div key={paso.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      pasoActual >= paso.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {pasoActual > paso.id ? '✓' : paso.id}
                    </div>
                    <div className="mt-2 text-center">
                      <div className={`font-medium ${pasoActual >= paso.id ? 'text-gray-900' : 'text-gray-500'}`}>
                        {paso.titulo}
                      </div>
                      <div className="text-xs text-gray-500 max-w-24">
                        {paso.descripcion}
                      </div>
                    </div>
                  </div>
                  {index < pasos.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      pasoActual > paso.id ? 'bg-orange-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido del Paso 1: Bienvenida */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Bienvenido/a a su formación Custodia360!
            </h2>
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <p className="text-xl text-gray-800 mb-4">
                <strong>{sessionData.nombre}</strong>, es un honor acompañarle en este importante paso hacia su certificación como{' '}
                <strong className="text-blue-600">{sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'}</strong> de Protección para <strong className="text-green-600">{sessionData.entidad}</strong>
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Agradecemos profundamente su compromiso con la protección de menores. Su rol como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'} de Protección es <strong>fundamental y de gran responsabilidad</strong> - será {sessionData.tipo === 'principal' ? 'el guardián principal' : 'el guardián suplente'} de la seguridad y bienestar de todos los menores en su entidad deportiva.
              </p>
              <p className="text-lg text-gray-700">
                <strong className="text-orange-600">Estaremos con usted en cada paso del camino.</strong> Esta formación está diseñada especialmente para garantizar que tenga todos los conocimientos, herramientas y confianza necesarios para desempeñar su rol como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'} con excelencia.
              </p>
            </div>

            {/* Reglas y flexibilidad de la formación */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-xl font-bold text-yellow-900 mb-4 text-center">
                Reglas de su Formación - Su Ritmo, Su Éxito
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">•</span>
                    <div>
                      <p className="font-semibold text-yellow-900">Puede Interrumpir Cuando Quiera</p>
                      <p className="text-yellow-800 text-sm">Su progreso se guarda automáticamente. Vuelva cuando le sea conveniente y continúe exactamente donde lo dejó.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">•</span>
                    <div>
                      <p className="font-semibold text-yellow-900">Tómese Todo el Tiempo Necesario</p>
                      <p className="text-yellow-800 text-sm">No hay prisa. La formación estará disponible 24/7. Es mejor entender bien cada concepto que ir con prisas.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">•</span>
                    <div>
                      <p className="font-semibold text-yellow-900">Descargue la Documentación</p>
                      <p className="text-yellow-800 text-sm">Si prefiere leer en papel, puede descargar PDFs de todos los módulos. Ideal para tomar notas o estudiar offline.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">•</span>
                    <div>
                      <p className="font-semibold text-yellow-900">Repase Cuando Quiera</p>
                      <p className="text-yellow-800 text-sm">Puede volver a cualquier módulo las veces que necesite. Su aprendizaje es lo más importante.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Por qué es importante ser Delegado */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-xl font-bold text-green-900 mb-4 text-center">
                La Importancia de su Rol como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'} de Protección
              </h3>
              <div className="space-y-4">
                <p className="text-green-800 text-center font-medium">
                  Como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'} de Protección, usted se convierte en {sessionData.tipo === 'principal' ? 'el guardián principal' : 'el guardián suplente'} de la <strong>seguridad y bienestar</strong> de todos los menores en su entidad deportiva. Su trabajo <strong>marca la diferencia real</strong> en las vidas de niños y adolescentes.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-2">P</div>
                    <p className="font-semibold text-green-900">Protege Familias</p>
                    <p className="text-green-700 text-sm">Da tranquilidad a padres que confían en su club</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-2">L</div>
                    <p className="font-semibold text-green-900">Cumple la Ley</p>
                    <p className="text-green-700 text-sm">Garantiza el cumplimiento legal y protege su entidad</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-2">S</div>
                    <p className="font-semibold text-green-900">Crea Entornos Seguros</p>
                    <p className="text-green-700 text-sm">Construye espacios donde los menores pueden desarrollarse</p>
                  </div>
                </div>
                <div className="bg-white border border-green-300 rounded-lg p-4 mt-4">
                  <p className="text-green-900 font-semibold text-center mb-2">Su Impacto Directo como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'}:</p>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• <strong>Prevención:</strong> Evita situaciones de riesgo antes de que ocurran</li>
                    <li>• <strong>Detección:</strong> Identifica señales de alerta de forma temprana</li>
                    <li>• <strong>Actuación:</strong> Sabe cómo actuar correctamente en cada situación</li>
                    <li>• <strong>Apoyo:</strong> Ofrece el soporte necesario a menores y familias</li>
                    {sessionData.tipo === 'suplente' && (
                      <li>• <strong>Continuidad:</strong> Garantiza protección cuando el delegado principal no está disponible</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Información específica del tipo de entidad */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Formación Especializada para {sessionData.tipo === 'principal' ? 'Delegados Principales' : 'Delegados Suplentes'} en Clubes Deportivos
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">•</span>
                  <div>
                    <p className="font-semibold text-blue-900">Normativa Específica para Deporte</p>
                    <p className="text-blue-700 text-sm">Protocolos adaptados a vestuarios, entrenamientos, competiciones y desplazamientos deportivos</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">•</span>
                  <div>
                    <p className="font-semibold text-blue-900">Marco Legal Deportivo</p>
                    <p className="text-blue-700 text-sm">LOPIVI aplicada específicamente a entidades deportivas y federaciones</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">•</span>
                  <div>
                    <p className="font-semibold text-blue-900">Casos Prácticos Deportivos</p>
                    <p className="text-blue-700 text-sm">Situaciones reales en clubes: entrenamientos, competiciones, vestuarios, viajes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">•</span>
                  <div>
                    <p className="font-semibold text-blue-900">Herramientas de Gestión</p>
                    <p className="text-blue-700 text-sm">Dashboard especializado, comunicación con familias y gestión de equipos</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">•</span>
                  <div>
                    <p className="font-semibold text-blue-900">Configuración Personalizada</p>
                    <p className="text-blue-700 text-sm">Canal de comunicación, enlaces para su personal y mapa de riesgos específico</p>
                  </div>
                </div>
                {sessionData.tipo === 'suplente' && (
                  <div className="flex items-start">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">•</span>
                    <div>
                      <p className="font-semibold text-purple-900">Funciones de Suplencia</p>
                      <p className="text-purple-700 text-sm">Preparación específica para actuar cuando el delegado principal no esté disponible</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-green-900 mb-4">Lo que conseguirá como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'}:</h3>
              <ul className="space-y-2 text-green-800">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Formación de {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'} de Protección LOPIVI
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Conocimientos especializados para entidades deportivas
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Dashboard operativo para gestionar casos
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Sistema de comunicación con familias
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Mapa de riesgos personalizado para su club
                </li>
                {sessionData.tipo === 'suplente' && (
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    Preparación para suplir al delegado principal cuando sea necesario
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-orange-900 mb-4">Proceso Completo:</h3>
              <ul className="space-y-2 text-orange-800">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">1.</span>
                  <strong>Bienvenida:</strong> Introducción personalizada
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">2.</span>
                  <strong>Formación:</strong> Contenido especializado
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">3.</span>
                  <strong>Test:</strong> Evaluación de 20 preguntas
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">4.</span>
                  <strong>Certificación:</strong> Obtener certificado
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">5.</span>
                  <strong>Configuración:</strong> Preparar sistema operativo
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¡Comencemos Juntos este Importante Viaje!</h3>
              <p className="text-gray-800 mb-4">
                Nuestro equipo ha diseñado esta formación pensando específicamente en usted y en las necesidades únicas de {sessionData.tipo === 'principal' ? 'delegados principales' : 'delegados suplentes'} en entidades con menores. <strong>No estará solo en este proceso</strong> - le acompañaremos paso a paso.
              </p>
            </div>

            <button
              onClick={continuarFormacion}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Comenzar mi Formación como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'} de Protección
            </button>
            <p className="text-sm text-gray-600 mt-3">
              <strong>Formación 100% personalizada</strong> para {sessionData.tipo === 'principal' ? 'Delegados Principales' : 'Delegados Suplentes'} en Clubes Deportivos<br/>
              <span className="text-xs text-gray-500">Su progreso se guarda automáticamente • Disponible 24/7</span>
            </p>
          </div>
        </div>

        {/* Información adicional y motivación final */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
            Nuestro Compromiso con Usted como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-purple-600 mr-3 mt-1">•</span>
                <div>
                  <p className="font-semibold text-purple-900">Formación 100% Personalizada</p>
                  <p className="text-purple-800 text-sm">Todo el contenido está diseñado específicamente para las necesidades únicas de {sessionData.tipo === 'principal' ? 'Delegados Principales' : 'Delegados Suplentes'} en entidades con menores</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-purple-600 mr-3 mt-1">•</span>
                <div>
                  <p className="font-semibold text-purple-900">Certificación</p>
                  <p className="text-purple-800 text-sm">Su certificado acredita su formación especializada en protección de menores para entidades como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-purple-600 mr-3 mt-1">•</span>
                <div>
                  <p className="font-semibold text-purple-900">Sistema Operativo Completo</p>
                  <p className="text-purple-800 text-sm">Al finalizar tendrá su dashboard personalizado listo para gestionar la protección de menores desde su rol como {sessionData.tipo === 'principal' ? 'delegado principal' : 'delegado suplente'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-purple-600 mr-3 mt-1">•</span>
                <div>
                  <p className="font-semibold text-purple-900">Soporte Especializado</p>
                  <p className="text-purple-800 text-sm">Acceso permanente al material y actualizaciones automáticas específicas para {sessionData.tipo === 'principal' ? 'delegados principales' : 'delegados suplentes'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-white border border-purple-300 rounded-lg p-3">
            <p className="text-purple-900 text-center font-semibold">
              "Creemos en usted y en su capacidad para hacer la diferencia como {sessionData.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'}. Juntos construiremos entornos más seguros para todos los menores."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
