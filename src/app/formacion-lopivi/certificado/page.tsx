'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProgresoUsuario, MODULOS_LOPIVI } from '@/lib/formacion-lopivi'
import jsPDF from 'jspdf'

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
    // Simular sesión para demo
    const sessionDemo: SessionData = {
      id: 'demo_formacion_001',
      nombre: 'Ana Fernández López',
      email: 'nuevo@custodia360.com',
      tipo: 'principal',
      entidad: 'Club Deportivo Los Leones',
      certificacionVigente: true
    }

    setSessionData(sessionDemo)

    // Simular progreso completado para demo
    const progresoDemo: ProgresoUsuario = {
      userId: sessionDemo.id,
      modulosCompletados: ['modulo-1', 'modulo-2', 'modulo-3', 'modulo-4', 'modulo-5'],
      testsAprobados: ['test-lopivi'],
      puntuacionTests: { 'test-lopivi': 85 },
      fechaInicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      fechaFinalizacion: new Date().toISOString(),
      certificado: `LOPIVI-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      tiempoTotal: 345 // 5h 45min
    }

    setProgreso(progresoDemo)
    setLoading(false)
  }, [router])

  const generarCertificadoPDF = async () => {
    if (!sessionData || !progreso) return

    setGenerandoPDF(true)

    try {
      // Crear un nuevo documento PDF
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Configurar dimensiones
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const centerX = pageWidth / 2

      // Borde decorativo principal
      doc.setLineWidth(3)
      doc.setDrawColor(44, 62, 80)
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20)

      doc.setLineWidth(1)
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30)

      // Header - Logo y título
      doc.setFontSize(28)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(44, 62, 80)
      doc.text('CUSTODIA360', centerX, 35, { align: 'center' })

      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('CERTIFICADO DE FORMACIÓN', centerX, 50, { align: 'center' })

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text('Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia', centerX, 58, { align: 'center' })

      // Línea separadora
      doc.setLineWidth(2)
      doc.line(30, 65, pageWidth - 30, 65)

      // Contenido principal
      doc.setFontSize(16)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(44, 62, 80)
      doc.text('Se certifica que', centerX, 80, { align: 'center' })

      // Nombre del certificado
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(52, 73, 94)
      doc.text(sessionData.nombre.toUpperCase(), centerX, 95, { align: 'center' })

      // Línea debajo del nombre
      const nombreWidth = doc.getTextWidth(sessionData.nombre.toUpperCase())
      doc.setLineWidth(1)
      doc.line(centerX - nombreWidth/2, 98, centerX + nombreWidth/2, 98)

      // Texto del certificado
      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(44, 62, 80)
      doc.text('ha completado satisfactoriamente el programa de formación Custodia360 como', centerX, 110, { align: 'center' })

      doc.setFont('helvetica', 'bold')
      const tipoTexto = sessionData.tipo === 'principal' ? 'DELEGADO/A PRINCIPAL DE PROTECCIÓN' : 'DELEGADO/A SUPLENTE DE PROTECCIÓN'
      doc.text(tipoTexto, centerX, 120, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.text('cumpliendo con todos los requisitos formativos y evaluaciones establecidas', centerX, 130, { align: 'center' })
      doc.text('en la normativa vigente de protección de menores', centerX, 138, { align: 'center' })

      // Detalles del certificado - movido más arriba
      const detalleY = 140  // Subir la sección
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')

      // Columna izquierda
      doc.text('Entidad de destino:', 40, detalleY)
      doc.text('Fecha de finalización:', 40, detalleY + 10)


      // Columna derecha
      doc.text('Número de certificado:', centerX + 20, detalleY)
      doc.text('Código de verificación:', centerX + 20, detalleY + 10)

      // Valores
      doc.setFont('helvetica', 'normal')
      doc.text(sessionData.entidad, 85, detalleY)
      doc.text(new Date(progreso.fechaFinalizacion!).toLocaleDateString('es-ES'), 85, detalleY + 10)
      doc.text(progreso.certificado || 'CER-' + Date.now(), centerX + 75, detalleY)
      doc.text('CUSTODIA360-' + new Date().getFullYear() + '-' + sessionData.id.slice(-6), centerX + 75, detalleY + 10)

      // Director de formación con firma simulada
      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(37, 99, 235)
      // Firma simulada
      doc.text('Antonio García López', 40, detalleY + 25)

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(44, 62, 80)
      doc.text('Director de Formación Custodia360', 40, detalleY + 35)

      // Sello circular simulado (sin iconos)
      const selloX = pageWidth - 60
      const selloY = detalleY + 5
      doc.setDrawColor(44, 62, 80)
      doc.setLineWidth(3)
      doc.circle(selloX, selloY, 18)
      doc.setLineWidth(1)
      doc.circle(selloX, selloY, 15)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('CUSTODIA360', selloX, selloY - 5, { align: 'center' })
      doc.text('FORMADO', selloX, selloY, { align: 'center' })
      doc.text('LOPIVI', selloX, selloY + 5, { align: 'center' })
      doc.text(new Date().getFullYear().toString(), selloX, selloY + 10, { align: 'center' })

      // Fecha de expedición en el pie de página
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.setFont('helvetica', 'normal')
      const fechaExpedicion = `Expedido en Barcelona, ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`
      doc.text(fechaExpedicion, centerX, pageHeight - 15, { align: 'center' })

      // Descargar el PDF
      doc.save(`Certificado_Custodia360_${sessionData.nombre.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`)

      console.log('✅ Certificado PDF descargado exitosamente')

    } catch (error) {
      console.error('Error generando certificado PDF:', error)
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
                <h1 className="text-xl font-bold text-gray-900">Certificado <span className="text-blue-600">Custodia360</span></h1>
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
        {/* Mensaje de enhorabuena */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-gray-600 text-2xl font-bold">✓</div>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">¡Enhorabuena!</h2>
          <p className="text-gray-800 text-lg mb-4">
            Ha completado exitosamente su formación <span className="text-blue-600">Custodia360</span> como{' '}
            <strong>{sessionData?.tipo === 'principal' ? 'Delegado/a Principal' : 'Delegado/a Suplente'}</strong> de Protección.
          </p>
          <p className="text-gray-700 text-sm">
            Su certificado está listo para descargar y ya puede ejercer sus funciones de protección de menores según la normativa <span className="text-blue-600">Custodia360</span>.
          </p>
        </div>

        {/* Vista previa del certificado */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Certificado */}
          <div className="p-12 bg-white border-4 border-gray-800 relative">
            <div className="text-center relative">
              {/* Sello */}
              <div className="absolute top-0 right-0 w-32 h-32 border-4 border-gray-800 rounded-full flex items-center justify-center bg-gray-50 text-gray-800 text-xs font-bold transform rotate-12">
                <div className="text-center leading-tight">
                  CUSTODIA360<br/>
                  ──────<br/>
                  LOPIVI<br/>
                  FORMADO<br/>
                  ──────<br/>
                  {new Date().getFullYear()}
                </div>
              </div>

              {/* Título */}
              <div className="border-b-2 border-gray-800 pb-6 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-wider">CERTIFICADO DE FORMACIÓN</h1>
                <p className="text-lg text-gray-700 italic">
                  Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia
                </p>
              </div>

              {/* Contenido principal */}
              <div className="mb-8">
                <p className="text-lg text-gray-700 mb-4">Se certifica que</p>
                <div className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2 uppercase tracking-wide">
                  {sessionData.nombre}
                </div>
                <p className="text-lg text-gray-700 mb-2">
                  ha completado satisfactoriamente el programa de formación Custodia360 como
                </p>
                <p className="text-xl font-bold text-gray-900 mb-4">
                  {sessionData.tipo === 'principal' ? 'DELEGADO/A PRINCIPAL' : 'DELEGADO/A SUPLENTE'} DE PROTECCIÓN
                </p>
                <p className="text-gray-700 mb-2">
                  cumpliendo con todos los requisitos formativos y evaluaciones establecidas
                </p>
                <p className="text-gray-700">
                  en la normativa vigente de protección de menores
                </p>
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-2 gap-6 mb-8 border border-gray-300 p-6">
                <div className="border-b border-dotted border-gray-400 pb-3">
                  <div className="text-sm font-medium text-gray-600">Entidad de destino:</div>
                  <div className="text-lg font-bold text-gray-900">{sessionData.entidad}</div>
                </div>
                <div className="border-b border-dotted border-gray-400 pb-3">
                  <div className="text-sm font-medium text-gray-600">Fecha de finalización:</div>
                  <div className="text-lg font-bold text-gray-900">
                    {new Date(progreso.fechaFinalizacion!).toLocaleDateString('es-ES')}
                  </div>
                </div>

                <div className="border-b border-dotted border-gray-400 pb-3">
                  <div className="text-sm font-medium text-gray-600">Número de certificado:</div>
                  <div className="text-lg font-bold text-gray-900">{progreso.certificado}</div>
                </div>
              </div>

              {/* Firmas y expedición */}
              <div className="text-center pt-16">
                <div className="flex justify-between text-sm">
                  <div className="px-8">
                    {/* Firma simulada */}
                    <div className="mb-2 text-center">
                      <div className="italic text-blue-600 font-semibold mb-1" style={{fontFamily: 'cursive', fontSize: '18px'}}>
                        Antonio García López
                      </div>
                    </div>
                    <div className="border-t-2 border-gray-800 pt-3">
                      <div className="font-bold text-gray-900">Director de Formación</div>
                      <div className="text-gray-600">Custodia360</div>
                    </div>
                  </div>

                </div>

                {/* Fecha de expedición entre firmas */}
                <div className="mt-8 text-sm text-gray-600">
                  Expedido en Barcelona, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Descargar Certificado</h2>
          <p className="text-gray-600 mb-6">
            Su certificado de formación como Delegado/a de Protección Custodia360 está listo para descargar.
            Este documento acredita su formación y capacitación para ejercer las funciones de protección de menores.
          </p>

          <div className="flex justify-center gap-4 mb-6 flex-wrap">
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
                  Descargar Certificado PDF
                </>
              )}
            </button>

            <Link
              href="/formacion-lopivi/configuracion"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Siguiente: Configuración
            </Link>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-left">
              <h3 className="text-sm font-medium text-blue-800 mb-1">Información del Certificado</h3>
              <p className="text-sm text-blue-700">
                Este certificado acredita la formación recibida y cumple con los contenidos establecidos por <span className="text-blue-600">Custodia360</span>.
              </p>
              <div className="mt-2 text-xs text-blue-600">
                <strong>Validez:</strong> 2 años •
                <strong> Renovación:</strong> Cada 2 años •
                <strong> Verificación:</strong> Código {progreso.certificado}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
