'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DOCUMENTOS_LOPIVI, generarContenidoPDF } from '@/lib/documentos-lopivi'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  certificacionVigente: boolean
}

export default function BienvenidaFormacionPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pasoActual, setPasoActual] = useState(1)
  const [documentosDescargados, setDocumentosDescargados] = useState<string[]>([])

  // TIMEOUT DE SEGURIDAD SIMPLIFICADO - 1 segundo
  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      console.log('⏰ TIMEOUT - Forzando mostrar página')
      if (loading) {
        const emergencySession: SessionData = {
          id: 'demo_001',
          nombre: 'Delegado Demo',
          email: 'demo@custodia360.com',
          tipo: 'principal',
          entidad: 'Entidad Demo',
          certificacionVigente: false
        }
        setSessionData(emergencySession)
        setLoading(false)
      }
    }, 1000) // 1 segundo máximo

    return () => clearTimeout(emergencyTimeout)
  }, [loading])

  const checkSession = (): SessionData | null => {
    try {
      console.log('🔍 Verificando sesiones...')

      // Primero intentar localStorage userSession
      const persistentSession = localStorage.getItem('userSession')
      console.log('📋 localStorage userSession:', persistentSession ? 'Existe' : 'No existe')

      if (persistentSession) {
        try {
          const session = JSON.parse(persistentSession)
          console.log('🎯 Sesión localStorage data:', session)

          // Si no tiene fecha de expiración o es válida
          if (!session.expiracion || new Date(session.expiracion) > new Date()) {
            console.log('✅ Sesión localStorage válida')
            return session
          } else {
            console.log('❌ Sesión localStorage expirada')
          }
        } catch (parseError) {
          console.error('❌ Error parsing localStorage session:', parseError)
        }
      }

      // Luego intentar sessionStorage userSession
      const tempSession = sessionStorage.getItem('userSession')
      console.log('📋 sessionStorage userSession:', tempSession ? 'Existe' : 'No existe')

      if (tempSession) {
        try {
          const session = JSON.parse(tempSession)
          console.log('🎯 Sesión sessionStorage data:', session)

          // Si no tiene fecha de expiración o es válida
          if (!session.expiracion || new Date(session.expiracion) > new Date()) {
            console.log('✅ Sesión sessionStorage válida')
            return session
          } else {
            console.log('❌ Sesión sessionStorage expirada')
          }
        } catch (parseError) {
          console.error('❌ Error parsing sessionStorage session:', parseError)
        }
      }

      // Finalmente intentar userAuth legacy
      const legacyAuth = localStorage.getItem('userAuth')
      console.log('📋 localStorage userAuth:', legacyAuth ? 'Existe' : 'No existe')

      if (legacyAuth) {
        try {
          const session = JSON.parse(legacyAuth)
          console.log('🎯 Sesión legacy data:', session)
          console.log('✅ Usando sesión legacy (sin verificar expiración)')
          return session
        } catch (parseError) {
          console.error('❌ Error parsing legacy session:', parseError)
        }
      }

      console.log('❌ No se encontró ninguna sesión válida')
      return null
    } catch (error) {
      console.error('❌ Error general verificando sesión:', error)
      return null
    }
  }

  useEffect(() => {
    console.log('🚀 INICIANDO campus virtual...')

    // SIEMPRE mostrar la página con datos demo
    const demoSession: SessionData = {
      id: 'demo_campus_001',
      nombre: 'Delegado Campus',
      email: 'delegado@demo.com',
      tipo: 'principal',
      entidad: 'Entidad Demo Campus',
      certificacionVigente: false
    }

    setSessionData(demoSession)
    setLoading(false)
    console.log('✅ Campus virtual listo')
  }, []) // Sin dependencias para evitar loops

  const descargarPDF = (documentoId: string) => {
    const documento = DOCUMENTOS_LOPIVI.find(doc => doc.id === documentoId)
    if (!documento) return

    const contenidoHTML = generarContenidoPDF(documento)
    const blob = new Blob([contenidoHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${documento.titulo.replace(/\s+/g, '_')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Actualizar documentos descargados
    if (!documentosDescargados.includes(documentoId)) {
      const nuevosDescargados = [...documentosDescargados, documentoId]
      setDocumentosDescargados(nuevosDescargados)

      if (nuevosDescargados.length >= 3) {
        setPasoActual(3)
      }
    }

    console.log(`✅ PDF descargado: ${documento.titulo}`)
  }

  const irAlTest = () => {
    router.push('/formacion-lopivi/test-unico')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Preparando su formación LOPIVI...</p>
        </div>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error de acceso - No se encontró sesión válida</p>
          <div className="text-sm text-gray-600 mb-4">
            <p>Debug info:</p>
            <p>localStorage userSession: {localStorage.getItem('userSession') ? 'Existe' : 'No existe'}</p>
            <p>sessionStorage userSession: {sessionStorage.getItem('userSession') ? 'Existe' : 'No existe'}</p>
            <p>localStorage userAuth: {localStorage.getItem('userAuth') ? 'Existe' : 'No existe'}</p>
          </div>
          <Link href="/login" className="bg-orange-600 text-white px-4 py-2 rounded-lg">
            Volver al Login
          </Link>
        </div>
      </div>
    )
  }

  const documentosEsenciales = DOCUMENTOS_LOPIVI.filter(doc => doc.esencial)
  const pasos = [
    { id: 1, titulo: 'Bienvenida', descripcion: 'Conoce el proceso' },
    { id: 2, titulo: 'Documentación', descripcion: 'Descarga materiales' },
    { id: 3, titulo: 'Evaluación', descripcion: 'Completa el test' },
    { id: 4, titulo: 'Certificación', descripcion: 'Obtén certificado' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mr-4">
                🎓
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Formación LOPIVI</h1>
                <p className="text-sm text-gray-600">Certificación como Delegado de Protección</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>Delegado: {sessionData.nombre}</div>
              <div>Tipo: {sessionData.tipo === 'principal' ? 'Principal' : 'Suplente'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Timeline de progreso */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Su Proceso de Certificación LOPIVI</h2>

          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center w-full max-w-4xl">
              {pasos.map((paso, index) => (
                <div key={paso.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      pasoActual > paso.id
                        ? 'bg-green-600 text-white'
                        : pasoActual === paso.id
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
                      pasoActual > paso.id ? 'bg-green-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Paso 1: Bienvenida */}
        {pasoActual === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Bienvenido/a a su Formación LOPIVI!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {sessionData.nombre}, está a punto de certificarse como{' '}
                <strong>{sessionData.tipo === 'principal' ? 'Delegado Principal' : 'Delegado Suplente'}</strong> de Protección para {sessionData.entidad}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-blue-900 mb-4">¿Qué va a conseguir?</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    Certificado de formación como Delegado de Protección LOPIVI
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    Conocimientos para proteger a los menores de su entidad
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    Herramientas prácticas para su trabajo diario
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    Acceso al dashboard completo de gestión
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-green-900 mb-4">¿Cómo funciona?</h3>
                <ul className="space-y-2 text-green-800">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">1.</span>
                    <strong>Documentación:</strong> Descargue y estudie los materiales LOPIVI
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">2.</span>
                    <strong>Evaluación:</strong> Complete un test de 30 preguntas
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">3.</span>
                    <strong>Certificación:</strong> Obtenga su certificado de formación
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">4.</span>
                    <strong>Dashboard:</strong> Acceda a sus herramientas de trabajo
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setPasoActual(2)}
                className="bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition-colors"
              >
                Entendido, Comenzar Formación →
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Tiempo estimado: 2-3 horas total
              </p>
            </div>
          </div>
        )}

        {/* Paso 2: Documentación */}
        {pasoActual === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Documentación LOPIVI Esencial
              </h2>
              <p className="text-gray-600">
                Descargue y estudie estos documentos antes de realizar el test
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {documentosEsenciales.map((documento) => {
                const yaDescargado = documentosDescargados.includes(documento.id)

                return (
                  <div key={documento.id} className={`border rounded-lg p-6 transition-all ${
                    yaDescargado ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white hover:border-orange-300'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{documento.titulo}</h3>
                        <p className="text-sm text-gray-600 mb-2">{documento.descripcion}</p>
                        <p className="text-xs text-gray-500">{documento.tamaño}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        yaDescargado ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {yaDescargado ? '✓' : '📄'}
                      </div>
                    </div>

                    <button
                      onClick={() => descargarPDF(documento.id)}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        yaDescargado
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-orange-600 text-white hover:bg-orange-700'
                      }`}
                    >
                      {yaDescargado ? '✓ Descargado' : 'Descargar PDF'}
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Documentos descargados: {documentosDescargados.length} de {documentosEsenciales.length}
              </p>
              {documentosDescargados.length >= 3 ? (
                <button
                  onClick={() => setPasoActual(3)}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                  ✓ Continuar al Test de Certificación
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Descargue al menos 3 documentos esenciales para continuar
                </p>
              )}
            </div>
          </div>
        )}

        {/* Paso 3: Test */}
        {pasoActual === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Test de Certificación LOPIVI
              </h2>
              <p className="text-gray-600 mb-6">
                Complete este test de 30 preguntas para obtener su certificación oficial
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">30</div>
                <div className="text-sm text-blue-700">Preguntas</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">80%</div>
                <div className="text-sm text-green-700">Mínimo para aprobar</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">45m</div>
                <div className="text-sm text-purple-700">Tiempo estimado</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={irAlTest}
                className="bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition-colors"
              >
                🎯 Comenzar Test de Certificación
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Puede pausar y continuar el test cuando lo necesite
              </p>
            </div>
          </div>
        )}

        {/* Información de contacto */}
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="flex">
            <span className="text-gray-600 text-xl mr-3">💬</span>
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-1">¿Necesita ayuda?</h3>
              <p className="text-sm text-gray-700">
                Si tiene alguna duda durante el proceso de certificación, contacte con nuestro equipo de soporte:
                <strong> soporte@custodia360.com</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
