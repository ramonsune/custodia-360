'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProgresoUsuario, MODULOS_LOPIVI } from '@/lib/formacion-lopivi'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  certificacionVigente: boolean
}

export default function CertificadoPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [progreso, setProgreso] = useState<ProgresoUsuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [generandoPDF, setGenerandoPDF] = useState(false)

  const checkSession = (): SessionData | null => {
    try {
      const persistentSession = localStorage.getItem('userSession')
      if (persistentSession) {
        const session = JSON.parse(persistentSession)
        if (new Date(session.expiracion) > new Date()) {
          return session
        }
      }

      const tempSession = sessionStorage.getItem('userSession')
      if (tempSession) {
        const session = JSON.parse(tempSession)
        if (new Date(session.expiracion) > new Date()) {
          return session
        }
      }

      const legacyAuth = localStorage.getItem('userAuth')
      if (legacyAuth) {
        return JSON.parse(legacyAuth)
      }

      return null
    } catch (error) {
      console.error('Error verificando sesión:', error)
      return null
    }
  }

  const cargarProgreso = (userId: string): ProgresoUsuario | null => {
    try {
      const progresoGuardado = localStorage.getItem(`progreso_${userId}`)
      return progresoGuardado ? JSON.parse(progresoGuardado) : null
    } catch (error) {
      console.error('Error cargando progreso:', error)
      return null
    }
  }

  useEffect(() => {
    const session = checkSession()

    if (!session) {
      router.push('/login')
      return
    }

    setSessionData(session)
    const progresoUsuario = cargarProgreso(session.id)

    if (!progresoUsuario || !progresoUsuario.fechaFinalizacion) {
      router.push('/formacion-lopivi')
      return
    }

    setProgreso(progresoUsuario)
    setLoading(false)
  }, [router])

  const generarCertificadoPDF = async () => {
    if (!sessionData || !progreso) return

    setGenerandoPDF(true)

    try {
      // Simular generación de PDF (en producción sería una llamada a API)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Crear el contenido del certificado
      const certificadoHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Certificado LOPIVI - ${sessionData.nombre}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              margin: 0;
              padding: 40px;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }
            .certificado {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 60px;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              border: 8px solid #d4af37;
              position: relative;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            .logo {
              width: 100px;
              height: 100px;
              background: #ff6600;
              border-radius: 15px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 48px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .titulo {
              font-size: 36px;
              color: #2c3e50;
              margin: 20px 0;
              font-weight: bold;
            }
            .subtitulo {
              font-size: 18px;
              color: #7f8c8d;
              margin-bottom: 40px;
            }
            .nombre {
              font-size: 32px;
              color: #2980b9;
              font-weight: bold;
              text-decoration: underline;
              margin: 30px 0;
            }
            .contenido {
              text-align: center;
              line-height: 1.8;
              font-size: 16px;
              color: #34495e;
              margin: 30px 0;
            }
            .detalles {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin: 40px 0;
            }
            .detalle {
              text-align: center;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 10px;
            }
            .detalle-titulo {
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 5px;
            }
            .detalle-valor {
              color: #7f8c8d;
            }
            .firmas {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 50px;
              margin-top: 60px;
              text-align: center;
            }
            .firma {
              border-top: 2px solid #34495e;
              padding-top: 10px;
              font-weight: bold;
              color: #2c3e50;
            }
            .sello {
              position: absolute;
              top: 20px;
              right: 20px;
              width: 120px;
              height: 120px;
              border: 3px solid #27ae60;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(39, 174, 96, 0.1);
              color: #27ae60;
              font-weight: bold;
              text-align: center;
              font-size: 14px;
            }
            .decoracion {
              position: absolute;
              width: 60px;
              height: 60px;
              background: #d4af37;
              transform: rotate(45deg);
            }
            .decoracion-1 { top: -30px; left: -30px; }
            .decoracion-2 { bottom: -30px; right: -30px; }
          </style>
        </head>
        <body>
          <div class="certificado">
            <div class="decoracion decoracion-1"></div>
            <div class="decoracion decoracion-2"></div>
            <div class="sello">
              CERTIFICADO<br>OFICIAL<br>LOPIVI
            </div>

            <div class="header">
              <div class="logo">C</div>
              <h1 class="titulo">CERTIFICADO DE FORMACIÓN</h1>
              <p class="subtitulo">Ley Orgánica de Protección Integral a la Infancia y la Adolescencia</p>
            </div>

            <div class="contenido">
              <p>Por la presente se certifica que</p>
              <div class="nombre">${sessionData.nombre}</div>
              <p>ha completado satisfactoriamente el curso de formación LOPIVI para</p>
              <p><strong>${sessionData.tipo === 'principal' ? 'DELEGADO PRINCIPAL' : 'DELEGADO SUPLENTE'} DE PROTECCIÓN</strong></p>
              <p>habiendo superado todos los módulos formativos y evaluaciones correspondientes</p>
              <p>con una dedicación de <strong>${Math.floor(progreso.tiempoTotal / 60)}h ${progreso.tiempoTotal % 60}m</strong></p>
            </div>

            <div class="detalles">
              <div class="detalle">
                <div class="detalle-titulo">Entidad Asignada</div>
                <div class="detalle-valor">${sessionData.entidad}</div>
              </div>
              <div class="detalle">
                <div class="detalle-titulo">Fecha de Finalización</div>
                <div class="detalle-valor">${new Date(progreso.fechaFinalizacion!).toLocaleDateString('es-ES')}</div>
              </div>
              <div class="detalle">
                <div class="detalle-titulo">Módulos Completados</div>
                <div class="detalle-valor">${progreso.testsAprobados.length}/${MODULOS_LOPIVI.length}</div>
              </div>
              <div class="detalle">
                <div class="detalle-titulo">Certificado Nº</div>
                <div class="detalle-valor">${progreso.certificado}</div>
              </div>
            </div>

            <div class="sello-oficial">
              <div class="sello-custodia">CUSTODIA360<br>SELLO OFICIAL</div>
              <div class="datos-empresa">
                Custodia360<br>
                Propiedad de Sportsmotherland SL<br>
                CIF: B-66526658
              </div>
            </div>
          </div>
        </body>
        </html>
      `

      // Crear y descargar el PDF (simulado)
      const blob = new Blob([certificadoHTML], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Certificado_LOPIVI_${sessionData.nombre.replace(/\s+/g, '_')}_${new Date().getFullYear()}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      console.log('✅ Certificado descargado exitosamente')

    } catch (error) {
      console.error('Error generando certificado:', error)
      alert('Error al generar el certificado. Inténtelo nuevamente.')
    } finally {
      setGenerandoPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando certificación...</p>
        </div>
      </div>
    )
  }

  if (!sessionData || !progreso) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Acceso no autorizado</p>
          <Link href="/formacion-lopivi" className="bg-orange-600 text-white px-4 py-2 rounded-lg">
            Volver al Curso
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/formacion-lopivi" className="text-gray-600 hover:text-gray-900 mr-4">
                ← Volver al Curso
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Certificado LOPIVI</h1>
                <p className="text-sm text-gray-600">Descarga tu certificado de formación</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{sessionData.nombre}</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Vista previa del certificado */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Certificado */}
          <div className="p-12 bg-white border border-gray-300 relative">
            <div className="text-center relative">
              {/* Sello oficial */}
              <div className="absolute top-0 right-0 w-24 h-24 border-4 border-green-600 rounded-full flex items-center justify-center bg-green-50 text-green-600 text-xs font-bold">
                OFICIAL<br/>LOPIVI
              </div>

              {/* Logo */}
              <div className="w-20 h-20 bg-orange-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                C
              </div>

              {/* Título */}
              <h1 className="text-4xl font-bold text-gray-900 mb-2">CERTIFICADO DE FORMACIÓN</h1>
              <p className="text-lg text-gray-600 mb-8">
                Ley Orgánica de Protección Integral a la Infancia y la Adolescencia
              </p>

              {/* Contenido principal */}
              <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
                <p className="text-lg text-gray-700 mb-4">Por la presente se certifica que</p>
                <div className="text-3xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
                  {sessionData.nombre}
                </div>
                <p className="text-lg text-gray-700 mb-2">
                  ha completado satisfactoriamente el curso de formación LOPIVI para
                </p>
                <p className="text-xl font-bold text-gray-900 mb-4">
                  {sessionData.tipo === 'principal' ? 'DELEGADO PRINCIPAL' : 'DELEGADO SUPLENTE'} DE PROTECCIÓN
                </p>
                <p className="text-gray-700 mb-4">
                  habiendo superado todos los módulos formativos y evaluaciones correspondientes
                </p>
                <p className="text-gray-700">
                  con una dedicación de <strong>{Math.floor(progreso.tiempoTotal / 60)}h {progreso.tiempoTotal % 60}m</strong>
                </p>
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm font-medium text-gray-600">Entidad Asignada</div>
                  <div className="text-lg font-bold text-gray-900">{sessionData.entidad}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm font-medium text-gray-600">Fecha de Finalización</div>
                  <div className="text-lg font-bold text-gray-900">
                    {new Date(progreso.fechaFinalizacion!).toLocaleDateString('es-ES')}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm font-medium text-gray-600">Módulos Completados</div>
                  <div className="text-lg font-bold text-gray-900">
                    {progreso.testsAprobados.length}/{MODULOS_LOPIVI.length}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm font-medium text-gray-600">Certificado Nº</div>
                  <div className="text-lg font-bold text-gray-900">{progreso.certificado}</div>
                </div>
              </div>

              {/* Firmas */}
              <div className="flex justify-between text-center text-sm">
                <div className="border-t-2 border-gray-400 pt-2 px-8">
                  <div className="font-bold text-gray-900">Director de Formación</div>
                  <div className="text-gray-600">Custodia360</div>
                </div>
                <div className="border-t-2 border-gray-400 pt-2 px-8">
                  <div className="font-bold text-gray-900">Coordinador LOPIVI</div>
                  <div className="text-gray-600">Min. Derechos Sociales</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Descargar Certificado</h2>
          <p className="text-gray-600 mb-6">
            Su certificado de formación como Delegado de Protección LOPIVI está listo para descargar.
            Este documento acredita su formación y capacitación para ejercer las funciones de protección de menores.
          </p>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={generarCertificadoPDF}
              disabled={generandoPDF}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {generandoPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generando PDF...
                </>
              ) : (
                <>
                  📄 Descargar Certificado PDF
                </>
              )}
            </button>

            <Link
              href="/registro-entidad"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Configurar registro de miembros
            </Link>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex">
              <span className="text-blue-600 text-xl mr-3">ℹ️</span>
              <div className="text-left">
                <h3 className="text-sm font-medium text-blue-800 mb-1">Información del Certificado</h3>
                <p className="text-sm text-blue-700">
                  Este certificado acredita la formación recibida y cumple con los contenidos establecidos por la LOPIVI.
                  Puede presentarlo como acreditación de su formación como Delegado de Protección en cualquier entidad.
                </p>
                <div className="mt-2 text-xs text-blue-600">
                  <strong>Validez:</strong> Permanente •
                  <strong> Renovación:</strong> Recomendada cada 3 años •
                  <strong> Verificación:</strong> Código {progreso.certificado}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
