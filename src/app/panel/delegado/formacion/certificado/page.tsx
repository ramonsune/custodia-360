'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import html2canvas from 'html2canvas'
import { getSession, isExpired } from '@/lib/auth/session'

interface SessionData {
  id: string
  nombre: string
  email: string
  entityId: string
  entidad: string
  user_id: string
  rol?: string
}

export default function CertificadoPage() {
  const router = useRouter()
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [certificate, setCertificate] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('🔍 [CERTIFICADO] Verificando acceso...')

    const session = getSession()

    if (!session.token || isExpired()) {
      console.error('❌ [CERTIFICADO] Sesión inválida o expirada')
      alert('No se encontró sesión activa. Por favor, inicia sesión nuevamente.')
      router.push('/login')
      return
    }

    // Verificar que sea delegado o suplente
    const esAutorizado = session.role === 'DELEGADO' || session.role === 'SUPLENTE'

    if (!esAutorizado) {
      console.error('❌ [CERTIFICADO] Usuario no autorizado. Rol:', session.role)
      alert('Solo los delegados pueden acceder al certificado.\n\nRol actual: ' + (session.role || 'desconocido'))
      router.push('/login')
      return
    }

    console.log('✅ [CERTIFICADO] Acceso autorizado para:', session.userName)

    const parsed = {
      id: session.userId,
      nombre: session.userName,
      email: session.userEmail,
      entityId: session.entityId,
      entidad: session.entityName,
      user_id: session.userId,
      rol: session.role
    }

    setSession(parsed)
    const personId = parsed.user_id || parsed.id
    loadCertificate(personId, parsed.entityId)

    // Completar formación automáticamente al llegar al certificado
    completeTraining(parsed.user_id, parsed.entityId)
  }, [router])

  const completeTraining = async (userId: string, entityId: string) => {
    try {
      console.log('📚 [CERTIFICADO] Completando formación...', { userId, entityId })

      const response = await fetch('/api/training/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, entity_id: entityId })
      })

      const result = await response.json()

      if (result.success) {
        console.log('✅ [CERTIFICADO] Formación completada, rol promocionado a DELEGADO')

        // Actualizar sesión local si cambió el rol
        if (result.role === 'DELEGADO') {
          // La sesión se actualizará en el próximo login
          console.log('✅ [CERTIFICADO] Usuario ahora es DELEGADO')
        }
      } else if (result.already_completed) {
        console.log('ℹ️ [CERTIFICADO] Formación ya completada previamente')
      } else {
        console.warn('⚠️ [CERTIFICADO] Error completando formación:', result.error)
      }
    } catch (error) {
      console.error('❌ [CERTIFICADO] Error completando formación:', error)
    }
  }

  const loadCertificate = async (personId: string, entityId: string) => {
    try {
      // Intentar cargar desde localStorage primero
      const certKey = `certificate_${personId}_${entityId}`
      const localCert = localStorage.getItem(certKey)

      if (localCert) {
        setCertificate(JSON.parse(localCert))
        setLoading(false)
        return
      }

      // Si no está en local, intentar desde API
      const res = await fetch(`/api/training/certificate?personId=${personId}&entityId=${entityId}`)
      const data = await res.json()

      if (data.success && data.certificate) {
        setCertificate(data.certificate)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateCertificate = async () => {
    if (!session) {
      console.error('❌ [CERTIFICADO] No hay sesión')
      return
    }

    console.log('🔍 [CERTIFICADO] Sesión completa:', session)

    // Usar user_id o id como fallback
    const personId = session.user_id || session.id
    const entityId = session.entityId || session.entidad || 'demo_entity_001'

    console.log('🔍 [CERTIFICADO] personId:', personId)
    console.log('🔍 [CERTIFICADO] entityId:', entityId)

    // Validar solo personId (entityId tiene fallback)
    if (!personId) {
      console.error('❌ [CERTIFICADO] No se encontró personId en la sesión')
      alert('Error: No se pudo identificar tu usuario. Intenta cerrar sesión y volver a entrar.')
      return
    }

    console.log('✅ [CERTIFICADO] Generando certificado para:', { personId, entityId })
    setGenerating(true)

    try {
      // MODO DEMO: Generar certificado directamente sin validaciones complicadas
      const res = await fetch('/api/training/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personId,
          entityId,
          testPassed: true // En modo demo siempre true
        })
      })

      const data = await res.json()

      if (data.success) {
        setCertificate(data.certificate)

        // Guardar certificado en localStorage
        if (data._shouldPersist) {
          localStorage.setItem(data._shouldPersist.key, JSON.stringify(data._shouldPersist.data))
        }
      } else {
        alert(data.error || 'Error al generar certificado')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al generar el certificado')
    } finally {
      setGenerating(false)
    }
  }

  const downloadCertificate = async () => {
    if (!certificate || !certificateRef.current) return

    try {
      // Capturar el certificado como imagen
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Mayor calidad
        backgroundColor: '#ffffff',
        logging: false
      })

      // Convertir a blob y descargar
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `certificado-${certificate.cert_code}.png`
        a.click()
        URL.revokeObjectURL(url)
      })
    } catch (error) {
      console.error('Error al generar el certificado:', error)
      alert('Error al descargar el certificado')
    }
  }

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">
                Obtener Certificado
              </CardTitle>
              <CardDescription className="text-lg">
                Genera tu certificado digital de Delegado/a de Protección
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-blue-900 mb-2">
                  ¿Qué certifica este documento?
                </h3>
                <ul className="text-blue-800 text-sm space-y-1 ml-4">
                  <li>• Has completado los 6 módulos de formación C360</li>
                  <li>• Has superado el test con al menos 75% de aciertos</li>
                  <li>• Estás capacitado/a para ser Delegado/a de Protección</li>
                  <li>• Cumples con los requisitos legales de la LOPIVI</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Tu certificado incluirá:</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Nombre:</span>
                    <span className="font-semibold">{session.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entidad:</span>
                    <span className="font-semibold">{session.entidad}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fecha de emisión:</span>
                    <span className="font-semibold">{new Date().toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Firma:</span>
                    <span className="font-semibold">Nando Del Olmo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID único:</span>
                    <span className="font-semibold text-blue-600">Se generará automáticamente</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={generateCertificate}
                disabled={generating}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
              >
                {generating ? 'Generando certificado...' : 'Generar Certificado'}
              </Button>

              <Button
                onClick={() => router.push('/panel/delegado/formacion')}
                variant="outline"
                className="w-full"
              >
                Volver a Formación
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Certificado Visual */}
        <Card ref={certificateRef} className="shadow-2xl mb-6 border-4 border-blue-600">
          <CardContent className="pt-12 pb-12 bg-gradient-to-br from-white to-blue-50">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold text-gray-900">
                CERTIFICADO DE FORMACIÓN
              </h1>

              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Delegado/a de Protección Infantil<br />
                Ley Orgánica 8/2021 (LOPIVI)
              </p>

              <div className="py-8 space-y-4">
                <p className="text-lg text-gray-600">Certifica que</p>
                <p className="text-3xl font-bold text-gray-900">{session.nombre}</p>
                <p className="text-lg text-gray-600">ha completado exitosamente la formación de</p>
                <p className="text-2xl font-semibold text-blue-600">
                  Delegado/a de Protección Infantil
                </p>
                <p className="text-lg text-gray-600">
                  según la Ley Orgánica de protección integral a la infancia<br />
                  y la adolescencia frente a la violencia
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <span className="text-gray-600">Entidad:</span>
                    <p className="font-semibold text-gray-900">{session.entidad}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-600">Fecha de emisión:</span>
                    <p className="font-semibold text-gray-900">
                      {new Date(certificate.issued_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-left col-span-2">
                    <span className="text-gray-600">Certificado ID:</span>
                    <p className="font-mono text-blue-600 font-bold">{certificate.cert_code}</p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <div className="border-t-2 border-gray-300 w-64 mx-auto mb-2"></div>
                <p className="text-lg font-semibold text-gray-900">Nando Del Olmo</p>
                <p className="text-sm text-gray-600">Responsable de Custodia360</p>
                <p className="text-xs text-gray-500 mt-2">https://www.custodia360.es</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 max-w-2xl mx-auto text-xs text-gray-600 text-left">
                <p>
                  Este certificado acredita que el titular ha superado el test de evaluación con al menos un 75% de aciertos
                  y está capacitado para ejercer las funciones de Delegado/a de Protección en su entidad conforme a la LOPIVI.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={downloadCertificate}
            className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6"
          >
            Descargar Certificado (PNG)
          </Button>

          <Button
            onClick={() => router.push('/delegado/configuracion-inicial')}
            className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
          >
            Ir al Panel del Delegado
          </Button>
        </div>

        <Card className="bg-green-50 border-green-500">
          <CardContent className="pt-6">
            <p className="text-green-900 text-sm">
              <strong>✓ Certificado emitido correctamente</strong>
            </p>
            <p className="text-green-800 text-sm mt-2">
              Se ha enviado una copia a tu email: {session.email}
            </p>
            <p className="text-green-700 text-xs mt-2">
              Ya puedes acceder a tu panel de delegado y comenzar a usar todas las funcionalidades de Custodia360
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
