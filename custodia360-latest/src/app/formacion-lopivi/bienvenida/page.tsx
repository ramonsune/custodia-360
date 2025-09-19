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

  useEffect(() => {
    console.log('🚀 INICIANDO formación LOPIVI...')

    try {
      // Buscar sesión activa
      let session = null

      // 1. Intentar localStorage userSession
      const persistentSession = localStorage.getItem('userSession')
      if (persistentSession) {
        const parsed = JSON.parse(persistentSession)
        if (!parsed.expiracion || new Date(parsed.expiracion) > new Date()) {
          session = parsed
        }
      }

      // 2. Intentar sessionStorage userSession
      if (!session) {
        const tempSession = sessionStorage.getItem('userSession')
        if (tempSession) {
          const parsed = JSON.parse(tempSession)
          if (!parsed.expiracion || new Date(parsed.expiracion) > new Date()) {
            session = parsed
          }
        }
      }

      // 3. Intentar userAuth legacy
      if (!session) {
        const legacyAuth = localStorage.getItem('userAuth')
        if (legacyAuth) {
          session = JSON.parse(legacyAuth)
        }
      }

      if (session) {
        console.log('✅ Sesión encontrada:', session.nombre)
        setSessionData({
          id: session.id || 'user_001',
          nombre: session.nombre || 'Delegado',
          email: session.email || 'delegado@formacion.com',
          tipo: session.tipo || 'principal',
          entidad: session.entidad || 'Entidad de Formación',
          certificacionVigente: false
        })
        setLoading(false)
      } else {
        console.log('❌ No hay sesión, creando sesión demo')
        // Crear sesión demo para que funcione siempre
        setSessionData({
          id: 'demo_001',
          nombre: 'Delegado de Demostración',
          email: 'demo@custodia360.com',
          tipo: 'principal',
          entidad: 'Entidad Demo',
          certificacionVigente: false
        })
        setLoading(false)
      }
    } catch (error) {
      console.error('Error cargando sesión:', error)
      // Fallback garantizado
      setSessionData({
        id: 'fallback_001',
        nombre: 'Delegado Usuario',
        email: 'delegado@custodia360.com',
        tipo: 'principal',
        entidad: 'Mi Entidad',
        certificacionVigente: false
      })
      setLoading(false)
    }
  }, [])

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

  // No más loading screen - mostramos directamente el contenido
  if (!sessionData) {
    // Esto nunca debería pasar ahora, pero por seguridad
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Cargando formación...</p>
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

            <div className="text-center space-y-4">
              <p className="text-gray-600 mb-4">
                Documentos descargados: {documentosDescargados.length} de {documentosEsenciales.length}
              </p>

              {/* Opción Campus de Módulos */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">📚 Modalidad Campus Virtual</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Acceda al campus virtual para estudiar los módulos de formación de manera estructurada y realizar el seguimiento de su progreso.
                </p>
                <button
                  onClick={() => router.push('/formacion-lopivi/campus')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  🎓 Acceder al Campus Virtual
                </button>
              </div>

              {documentosDescargados.length >= 3 ? (
                <button
                  onClick={() => setPasoActual(3)}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                  ✓ Continuar al Test de Certificación
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Descargue al menos 3 documentos esenciales para continuar, o use el Campus Virtual
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
