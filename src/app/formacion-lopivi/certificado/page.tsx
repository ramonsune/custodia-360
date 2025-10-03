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

// Función para formatear contenido con separaciones apropiadas y limpiar placeholders
const formatearContenido = (contenido: string) => {
  return contenido
    // Limpiar exhaustivamente todos los tipos de placeholders %
    .replace(/%P/g, '')
    .replace(/%%P/g, '')
    .replace(/%/g, '')
    .replace(/P%/g, '')
    .replace(/\bP\b(?![a-z])/g, '')
    // Agregar salto de línea después de puntos seguidos de mayúscula
    .replace(/\. ([A-Z])/g, '.\n\n$1')
    // Agregar salto de línea después de dos puntos seguidos de mayúscula
    .replace(/: ([A-Z][^•])/g, ':\n\n$1')
    // Mantener el formato de listas con viñetas
    .replace(/• /g, '\n• ')
    // Agregar espacio después de títulos con ===
    .replace(/===\n/g, '===\n\n')
    // Separar mejor las secciones numeradas
    .replace(/(\d+\. [A-Z][^:]*:)/g, '\n$1')
    // Limpiar espacios múltiples pero preservar saltos de línea intencionales
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+/g, ' ')
    .trim();
};

// Función para limpiar texto del sello específicamente
const limpiarTextoSello = (texto: string) => {
  return texto
    .replace(/%P/g, '')
    .replace(/%%P/g, '')
    .replace(/%/g, '')
    .replace(/P%/g, '')
    .replace(/\bP\b(?![a-z])/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export default function FormadoPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [progreso, setProgreso] = useState<ProgresoUsuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [generandoPDF, setGenerandoPDF] = useState(false)

  // Variables del sello completamente limpiadas
  const selloLimpio = {
    linea1: limpiarTextoSello('CUSTODIA360'),
    linea2: limpiarTextoSello('──────'),
    linea3: limpiarTextoSello('LOPIVI'),
    linea4: limpiarTextoSello('FORMADO'),
    linea5: limpiarTextoSello('──────'),
    linea6: limpiarTextoSello(new Date().getFullYear().toString())
  }

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
      certificado: `FOR-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      tiempoTotal: 345 // 5h 45min
    }

    setProgreso(progresoDemo)
    setLoading(false)
  }, [router])

  const generarAcreditacionPDF = async () => {
    if (!sessionData || !progreso) return

    setGenerandoPDF(true)

    try {
      // Crear un nuevo documento PDF EXACTAMENTE igual al que se ve en pantalla
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Configurar dimensiones
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const centerX = pageWidth / 2

      // FONDO Y BORDE PRINCIPAL - EXACTO COMO EN PANTALLA
      // Fondo blanco completo
      doc.setFillColor(255, 255, 255)
      doc.rect(0, 0, pageWidth, pageHeight, 'F')

      // Borde grueso como en pantalla: border-4 border-gray-800
      doc.setLineWidth(3)
      doc.setDrawColor(31, 41, 55) // border-gray-800 exacto
      doc.rect(12, 12, pageWidth - 24, pageHeight - 24)

      // SELLO EN ESQUINA SUPERIOR DERECHA - EXACTO COMO PANTALLA
      // Posición exacta como en CSS: absolute top-0 right-0
      const selloX = pageWidth - 40
      const selloY = 30
      const selloRadius = 16

      // Círculo exterior con borde grueso
      doc.setLineWidth(3)
      doc.setDrawColor(31, 41, 55) // border-gray-800
      doc.circle(selloX, selloY, selloRadius)

      // Fondo del sello bg-gray-50
      doc.setFillColor(249, 250, 251)
      doc.circle(selloX, selloY, selloRadius - 1.5, 'F')

      // Texto del sello completamente limpio - sin símbolos %
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(31, 41, 55)

      // Usar las variables del sello ya limpiadas definidas al principio del componente
      doc.text(selloLimpio.linea1, selloX, selloY - 8, { align: 'center' })
      doc.text(selloLimpio.linea2, selloX, selloY - 5, { align: 'center' })
      doc.text(selloLimpio.linea3, selloX, selloY - 2, { align: 'center' })
      doc.text(selloLimpio.linea4, selloX, selloY + 1, { align: 'center' })
      doc.text(selloLimpio.linea5, selloX, selloY + 4, { align: 'center' })
      doc.text(selloLimpio.linea6, selloX, selloY + 7, { align: 'center' })

      // TÍTULO PRINCIPAL - EXACTO COMO PANTALLA
      // border-b-2 border-gray-800 pb-6 mb-8
      let yPos = 40

      // Título: text-4xl font-bold text-gray-900 mb-2 tracking-wider
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 24, 39)
      const tituloPrincipal = limpiarTextoSello('ACREDITACIÓN DE FORMADO')
      doc.text(tituloPrincipal, centerX, yPos, { align: 'center' })
      yPos += 8

      // Subtítulo: text-lg text-gray-700 italic
      doc.setFontSize(12)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(55, 65, 81)
      const subtitulo = limpiarTextoSello('Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia')
      doc.text(subtitulo, centerX, yPos, { align: 'center' })
      yPos += 10

      // Línea separadora exacta: border-b-2 border-gray-800
      doc.setLineWidth(2)
      doc.setDrawColor(31, 41, 55)
      doc.line(25, yPos, pageWidth - 25, yPos)
      yPos += 15

      // CONTENIDO PRINCIPAL - EXACTO COMO PANTALLA
      // text-lg text-gray-700 mb-4
      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(55, 65, 81)
      const textoCertifica = limpiarTextoSello('Se certifica que')
      doc.text(textoCertifica, centerX, yPos, { align: 'center' })
      yPos += 10

      // NOMBRE - EXACTO COMO PANTALLA
      // text-3xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2 uppercase tracking-wide
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 24, 39)
      const nombreUpper = limpiarTextoSello(sessionData.nombre.toUpperCase())
      doc.text(nombreUpper, centerX, yPos, { align: 'center' })
      yPos += 2

      // Línea debajo del nombre: border-b-2 border-gray-300
      doc.setLineWidth(2)
      doc.setDrawColor(209, 213, 219)
      const nombreWidth = doc.getTextWidth(nombreUpper)
      doc.line(centerX - nombreWidth/2 - 10, yPos, centerX + nombreWidth/2 + 10, yPos)
      yPos += 12

      // TEXTO DE ACREDITACIÓN - EXACTO COMO PANTALLA
      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(55, 65, 81)
      const textoCompletado = limpiarTextoSello('ha completado satisfactoriamente el programa de formación Custodia360 como')
      doc.text(textoCompletado, centerX, yPos, { align: 'center' })
      yPos += 8

      // TIPO DE DELEGADO - EXACTO COMO PANTALLA
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 24, 39)
      const tipoTexto = sessionData.tipo === 'principal' ? 'DELEGADO/A PRINCIPAL DE PROTECCIÓN' : 'DELEGADO/A SUPLENTE DE PROTECCIÓN'
      const tipoLimpio = limpiarTextoSello(tipoTexto)
      doc.text(tipoLimpio, centerX, yPos, { align: 'center' })
      yPos += 10

      // TEXTO FINAL - EXACTO COMO PANTALLA
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(55, 65, 81)
      const textoRequisitos = limpiarTextoSello('cumpliendo con todos los requisitos formativos y evaluaciones establecidas')
      doc.text(textoRequisitos, centerX, yPos, { align: 'center' })
      yPos += 5
      const textoNormativa = limpiarTextoSello('en la normativa vigente de protección de menores')
      doc.text(textoNormativa, centerX, yPos, { align: 'center' })
      yPos += 15

      // CAJA DE DETALLES - EXACTO COMO PANTALLA
      // grid grid-cols-2 gap-6 mb-8 border border-gray-300 p-6
      const boxY = yPos
      const boxHeight = 25
      const boxWidth = pageWidth - 80

      // Borde de la caja
      doc.setLineWidth(1)
      doc.setDrawColor(209, 213, 219) // border-gray-300
      doc.rect(40, boxY, boxWidth, boxHeight)

      // Detalles en formato grid exacto como pantalla
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(75, 85, 99) // text-gray-600

      // Columna izquierda
      const labelEntidad = limpiarTextoSello('Entidad de destino:')
      doc.text(labelEntidad, 45, boxY + 8)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 24, 39) // text-gray-900
      const entidadLimpia = limpiarTextoSello(sessionData.entidad)
      doc.text(entidadLimpia, 45, boxY + 12)

      // Línea divisoria vertical (simulando grid)
      doc.setDrawColor(209, 213, 219)
      doc.line(centerX, boxY + 2, centerX, boxY + boxHeight - 2)

      // Columna derecha superior
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(75, 85, 99)
      const labelFecha = limpiarTextoSello('Fecha de finalización:')
      doc.text(labelFecha, centerX + 5, boxY + 8)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 24, 39)
      const fechaLimpia = limpiarTextoSello(new Date(progreso.fechaFinalizacion!).toLocaleDateString('es-ES'))
      doc.text(fechaLimpia, centerX + 5, boxY + 12)

      // Línea horizontal para separar filas
      doc.setDrawColor(209, 213, 219)
      doc.line(45, boxY + 15, pageWidth - 45, boxY + 15)

      // Fila inferior
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(75, 85, 99)
      const labelNumero = limpiarTextoSello('Número de acreditación:')
      doc.text(labelNumero, 45, boxY + 20)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 24, 39)
      const certificadoLimpio = limpiarTextoSello(progreso.certificado || 'FOR-' + Date.now())
      doc.text(certificadoLimpio, 45, boxY + 24)

      yPos = boxY + boxHeight + 20

      // SECCIÓN DE FIRMAS - EXACTO COMO PANTALLA
      // Firma simulada con estilo exacto de pantalla
      doc.setFontSize(14)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(37, 99, 235) // text-blue-600 exacto como pantalla
      const nombreFirma = limpiarTextoSello('Fernando Del Olmo')
      doc.text(nombreFirma, 80, yPos, { align: 'center' })
      yPos += 3

      // Línea de firma: border-t-2 border-gray-800
      doc.setLineWidth(2)
      doc.setDrawColor(31, 41, 55)
      doc.line(45, yPos, 115, yPos)
      yPos += 5

      // Títulos bajo la firma
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 24, 39)
      const cargoDirector = limpiarTextoSello('Director de Formación')
      doc.text(cargoDirector, 80, yPos, { align: 'center' })
      yPos += 4
      doc.setTextColor(75, 85, 99)
      const empresa = limpiarTextoSello('Custodia360')
      doc.text(empresa, 80, yPos, { align: 'center' })

      // FECHA DE EXPEDICIÓN AL FINAL - EXACTO COMO PANTALLA
      doc.setFontSize(9)
      doc.setTextColor(75, 85, 99)
      doc.setFont('helvetica', 'normal')
      const fechaExpedicion = limpiarTextoSello(`Expedido en Barcelona, ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`)
      doc.text(fechaExpedicion, centerX, pageHeight - 15, { align: 'center' })

      // Descargar el PDF con nombre específico
      const nombreArchivo = `Acreditacion_Formado_Custodia360_${sessionData.nombre.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`
      doc.save(nombreArchivo)

      console.log('✅ Acreditación PDF descargada completamente libre de símbolos %')

    } catch (error) {
      console.error('Error generando acreditación PDF:', error)
      alert('Error al generar la acreditación. Inténtelo nuevamente.')
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
                <h1 className="text-xl font-bold text-gray-900">Acreditación <span className="text-blue-600">Custodia360</span></h1>
                <p className="text-sm text-gray-600">Descarga tu acreditación de formado</p>
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
            Su acreditación de formado está lista para descargar y ya puede ejercer sus funciones de protección de menores según la normativa <span className="text-blue-600">Custodia360</span>.
          </p>
        </div>

        {/* Vista previa de la acreditación */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Acreditación */}
          <div className="p-12 bg-white border-4 border-gray-800 relative">
            <div className="text-center relative">
              {/* Sello */}
              <div className="absolute top-0 right-0 w-32 h-32 border-4 border-gray-800 rounded-full flex items-center justify-center bg-gray-50 text-gray-800 text-xs font-bold transform rotate-12">
                <div className="text-center leading-tight">
                  {selloLimpio.linea1}<br/>
                  {selloLimpio.linea2}<br/>
                  {selloLimpio.linea3}<br/>
                  {selloLimpio.linea4}<br/>
                  {selloLimpio.linea5}<br/>
                  {selloLimpio.linea6}
                </div>
              </div>

              {/* Título */}
              <div className="border-b-2 border-gray-800 pb-6 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-wider">ACREDITACIÓN DE FORMADO</h1>
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
                  <div className="text-sm font-medium text-gray-600">Número de acreditación:</div>
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
                        Fernando Del Olmo
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Descargar Acreditación</h2>
          <p className="text-gray-600 mb-6">
            Su acreditación de formado como Delegado/a de Protección <span className="text-blue-600 font-semibold">Custodia360</span> está lista para descargar.
            Este documento acredita su formación y capacitación para ejercer las funciones de protección de menores.
          </p>

          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            <button
              onClick={generarAcreditacionPDF}
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
                  Descargar Acreditación PDF
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
              <h3 className="text-sm font-medium text-blue-800 mb-1">Información de la Acreditación</h3>
              <p className="text-sm text-blue-700">
                Esta acreditación confirma que está formado y cumple con los contenidos establecidos por <span className="text-blue-600">Custodia360</span>.
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
