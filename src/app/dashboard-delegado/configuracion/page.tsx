'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'


interface SessionData {
  id: string
  nombre: string
  email: string
  entityId: string
  entidad: string
  user_id: string
  rol?: string
  sector_code?: string
}

interface ComplianceStatus {
  channel_done: boolean
  channel_verified: boolean
  channel_postponed?: boolean
  riskmap_done: boolean
  penales_done: boolean
  penales_postponed?: boolean
  blocked: boolean
  deadline_at: string
  days_remaining: number
}

export default function ConfiguracionDelegadoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [compliance, setCompliance] = useState<ComplianceStatus | null>(null)

  // Detectar si es primera vez desde URL o compliance
  const isFirstTimeParam = searchParams.get('firstTime') === 'true'
  const isFirstTime = isFirstTimeParam || (compliance?.channel_done === false && compliance?.riskmap_done === false && compliance?.penales_done === false)

  // Detectar si el plazo ha vencido
  const hasPostponed = compliance?.channel_postponed || compliance?.penales_postponed
  const isExpired = hasPostponed && (compliance?.days_remaining || 0) <= 0

  // Paso 1: Canal de comunicación
  const [canalTipo, setCanalTipo] = useState<'email' | 'telefono' | ''>('')
  const [canalValor, setCanalValor] = useState('')
  const [savingCanal, setSavingCanal] = useState(false)

  // Paso 2: Link/Token de onboarding
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [loadingToken, setLoadingToken] = useState(false)
  const [copied, setCopied] = useState(false)

  // Paso 3: Mapa de riesgos
  const [mapaLeido, setMapaLeido] = useState(false)
  const [savingMapa, setSavingMapa] = useState(false)
  const [modalMapaAbierto, setModalMapaAbierto] = useState(false)

  // Paso 4: Certificado de penales
  const [penalesEntregado, setPenalesEntregado] = useState(false)
  const [savingPenales, setSavingPenales] = useState(false)

  useEffect(() => {
    const sessionData = localStorage.getItem('userSession')
    if (!sessionData) {
      console.log('❌ No hay sesión, redirigiendo a /acceso')
      router.push('/acceso')
      return
    }

    const parsed = JSON.parse(sessionData)
    console.log('📋 Sesión cargada:', parsed)

    // Verificar que entityId exista
    if (!parsed.entityId) {
      console.warn('⚠️ entityId no encontrado en sesión, usando valores por defecto')
      // Establecer valores por defecto para permitir acceso
      setSession(parsed)
      setCompliance({
        channel_done: false,
        channel_verified: false,
        riskmap_done: false,
        penales_done: false,
        blocked: false,
        deadline_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        days_remaining: 30
      })
      // Intentar cargar el token con un ID por defecto
      loadInviteToken('demo_entity_001')
      setLoading(false)
      return
    }

    setSession(parsed)
    loadCompliance(parsed.entityId)
    loadInviteToken(parsed.entityId)
  }, [router])

  const loadCompliance = async (entityId: string) => {
    try {
      console.log('🔍 Cargando compliance para entityId:', entityId)
      const res = await fetch(`/api/compliance/status?entityId=${entityId}`)
      const data = await res.json()

      console.log('📊 Respuesta de compliance API:', data)

      if (data.success) {
        setCompliance(data.compliance)
      } else {
        console.warn('⚠️ API compliance devolvió success: false, usando valores por defecto')
        // Establecer valores por defecto si la API falla
        setCompliance({
          channel_done: false,
          channel_verified: false,
          riskmap_done: false,
          penales_done: false,
          blocked: false,
          deadline_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          days_remaining: 30
        })
      }
    } catch (error) {
      console.error('❌ Error cargando compliance:', error)
      // Establecer valores por defecto en caso de error
      setCompliance({
        channel_done: false,
        channel_verified: false,
        riskmap_done: false,
        penales_done: false,
        blocked: false,
        deadline_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        days_remaining: 30
      })
    } finally {
      setLoading(false)
    }
  }

  const loadInviteToken = async (entityId: string) => {
    setLoadingToken(true)
    try {
      console.log('🔗 Cargando invite token para entityId:', entityId)
      const res = await fetch(`/api/invite-token?entityId=${entityId}`)
      const data = await res.json()

      console.log('📊 Respuesta de invite-token API:', data)

      if (data.ok) {
        setInviteUrl(data.url)
      } else {
        console.warn('⚠️ API invite-token devolvió ok: false, generando enlace por defecto')
        // Generar enlace por defecto si el API falla
        const fallbackUrl = `${window.location.origin}/onboarding/${entityId}/demo-token`
        setInviteUrl(fallbackUrl)
      }
    } catch (error) {
      console.error('❌ Error cargando token:', error)
      // Establecer enlace por defecto en caso de error
      const fallbackUrl = `${window.location.origin}/onboarding/${entityId || 'demo'}/demo-token`
      setInviteUrl(fallbackUrl)
    } finally {
      setLoadingToken(false)
    }
  }

  const handleCopyLink = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleWhatsApp = () => {
    if (inviteUrl) {
      const text = encodeURIComponent(`Completa tu registro en Custodia360:\n\n${inviteUrl}`)
      window.open(`https://wa.me/?text=${text}`, '_blank')
    }
  }

  const handleEmail = () => {
    if (inviteUrl) {
      const subject = encodeURIComponent('Registro Custodia360')
      const body = encodeURIComponent(`Hola,\n\nPor favor, completa tu registro en el portal de Custodia360 accediendo al siguiente enlace:\n\n${inviteUrl}\n\nTienes 30 días para completar el proceso.\n\nGracias.`)
      window.location.href = `mailto:?subject=${subject}&body=${body}`
    }
  }

  const handleSaveCanal = async () => {
    if (!canalTipo || !canalValor.trim()) {
      alert('Por favor, selecciona un tipo de canal e ingresa el valor')
      return
    }

    if (canalTipo === 'email' && !canalValor.includes('@')) {
      alert('Por favor, ingresa un email válido')
      return
    }

    setSavingCanal(true)
    try {
      const res = await fetch('/api/channel/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId: session?.entityId,
          tipo: canalTipo,
          valor: canalValor
        })
      })

      const data = await res.json()
      if (data.success) {
        alert(
          canalTipo === 'email'
            ? 'Canal guardado. Te hemos enviado un email de verificación.'
            : 'Canal de comunicación guardado correctamente.'
        )
        loadCompliance(session!.entityId)
      } else {
        alert('Error al guardar el canal: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    } finally {
      setSavingCanal(false)
    }
  }

  const handlePostponeCanal = async () => {
    try {
      const res = await fetch('/api/compliance/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId: session?.entityId,
          field: 'channel_postponed',
          value: true
        })
      })

      const data = await res.json()
      if (data.success) {
        alert('✓ Canal de comunicación pospuesto 30 días.\n\nPodrás configurarlo más adelante.')
        loadCompliance(session!.entityId)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al posponer')
    }
  }

  const handleDownloadMapa = () => {
    // Generar PDF del mapa de riesgos según sector
    const sectorCode = session?.sector_code || 'general'
    window.open(`/api/riskmap/download?sector=${sectorCode}&entityId=${session?.entityId}`, '_blank')
  }

  const handleSaveMapa = async () => {
    if (!mapaLeido) {
      alert('Por favor, confirma que has leído el mapa de riesgos')
      return
    }

    setSavingMapa(true)
    try {
      const res = await fetch('/api/compliance/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId: session?.entityId,
          field: 'riskmap_done',
          value: true
        })
      })

      const data = await res.json()
      if (data.success) {
        alert('Lectura del mapa de riesgos registrada correctamente')
        loadCompliance(session!.entityId)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    } finally {
      setSavingMapa(false)
    }
  }

  const handleSavePenales = async () => {
    if (!penalesEntregado) {
      alert('Por favor, confirma que has entregado el certificado de penales')
      return
    }

    setSavingPenales(true)
    try {
      const res = await fetch('/api/compliance/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId: session?.entityId,
          field: 'penales_done',
          value: true
        })
      })

      const data = await res.json()
      if (data.success) {
        alert('Declaración de certificado de penales registrada correctamente')
        loadCompliance(session!.entityId)

        // Si todo está completo, redirigir al panel
        if (compliance?.channel_done && compliance?.riskmap_done) {
          setTimeout(() => router.push('/dashboard-delegado'), 1500)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    } finally {
      setSavingPenales(false)
    }
  }

  const handlePostponePenales = async () => {
    try {
      const res = await fetch('/api/compliance/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId: session?.entityId,
          field: 'penales_postponed',
          value: true
        })
      })

      const data = await res.json()
      if (data.success) {
        alert('✓ Certificado de penales pospuesto 30 días.\n\nPodrás entregarlo más adelante.')
        loadCompliance(session!.entityId)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al posponer')
    }
  }

  if (loading || !session || !compliance) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  const allCompleted =
    compliance.channel_done && compliance.riskmap_done && compliance.penales_done

  // Puede acceder al panel si ha completado o pospuesto lo permitido
  const canAccessPanel =
    (compliance.channel_done || compliance.channel_postponed) &&
    compliance.riskmap_done &&
    (compliance.penales_done || compliance.penales_postponed)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header con estado - Adaptativo según contexto */}
        <Card className={`mb-6 ${
          isFirstTime
            ? 'border-4 border-blue-600'
            : isExpired
              ? 'border-4 border-red-600'
              : 'border-2 border-gray-300'
        }`}>
          <CardHeader>
            <CardTitle className="text-2xl">
              {isFirstTime
                ? "¡Bienvenido a Custodia360! - Configuración Inicial Obligatoria"
                : isExpired
                  ? "⚠️ Configuración Pendiente - Plazo Vencido"
                  : "Configuración del Sistema"
              }
            </CardTitle>
            <CardDescription className="text-base">
              {isFirstTime
                ? "Antes de usar el panel del delegado, debes completar esta configuración obligatoria LOPIVI."
                : isExpired
                  ? "El plazo de 30 días ha vencido. Completa los pasos pendientes para desbloquear todas las funcionalidades del panel."
                  : "Modifica la configuración de tu entidad cuando lo necesites."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Texto explicativo */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">¿En qué consiste esta configuración?</h4>
              <p className="text-sm text-blue-800 mb-3">
                Para empezar a usar Custodia360, debes completar <strong>4 pasos obligatorios</strong> que
                garantizan el cumplimiento normativo LOPIVI de tu entidad:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li><strong>Canal de Comunicación:</strong> Define cómo te contactarán menores y familias</li>
                <li><strong>Link de Recogida:</strong> Token para registro de personal y familias</li>
                <li><strong>Mapa de Riesgos:</strong> Lee y confirma los riesgos específicos de tu sector</li>
                <li><strong>Certificado de Penales:</strong> Declara que has entregado el certificado vigente</li>
              </ul>

              <div className="mt-3 pt-3 border-t border-blue-300">
                <p className="text-sm text-blue-900">
                  <strong>Opción de posponer:</strong> Si no tienes toda la información ahora, puedes
                  <strong> posponer 30 días</strong> el Canal de Comunicación y el Certificado de Penales.
                  Esto te permitirá acceder al panel mientras reúnes la documentación necesaria.
                </p>
              </div>
            </div>

            {/* Contador de días */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-yellow-900">
                  {compliance.days_remaining > 0
                    ? `Te quedan ${compliance.days_remaining} días para completar la configuración`
                    : 'El plazo ha vencido - Debes completar la configuración para desbloquear el panel'}
                </p>
                <p className="text-sm text-yellow-700">
                  Límite: {new Date(compliance.deadline_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Estado de los pasos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${compliance.channel_done ? 'text-green-600' : 'text-red-600'}`}>
                  {compliance.channel_done ? '✓' : '○'} Canal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-400">○ Token</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${compliance.riskmap_done ? 'text-green-600' : 'text-red-600'}`}>
                  {compliance.riskmap_done ? '✓' : '○'} Mapa
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${compliance.penales_done ? 'text-green-600' : 'text-red-600'}`}>
                  {compliance.penales_done ? '✓' : '○'} Penales
                </span>
              </div>
            </div>

            {allCompleted && (
              <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg">
                <p className="text-green-900 font-semibold">
                  ✓ Configuración completada - Ya puedes usar el panel del delegado
                </p>
                <Button
                  onClick={() => router.push('/dashboard-delegado')}
                  className="mt-3 bg-green-600 hover:bg-green-700"
                >
                  Ir al Panel del Delegado
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paso 1: Canal de comunicación */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">1. Canal de Comunicación</CardTitle>
            <CardDescription>
              Configura el canal oficial para comunicaciones con menores y familias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {compliance.channel_done ? (
              <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
                <p className="text-green-900 font-semibold">✓ Canal configurado correctamente</p>
                {compliance.channel_verified && (
                  <p className="text-sm text-green-700 mt-1">Email verificado</p>
                )}
              </div>
            ) : (
              <>
                <Label className="text-base font-semibold">Quiero usar:</Label>
                <RadioGroup value={canalTipo} onValueChange={(v) => setCanalTipo(v as 'email' | 'telefono')}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="email" id="canal-email" />
                    <Label htmlFor="canal-email" className="cursor-pointer">Email corporativo</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="telefono" id="canal-telefono" />
                    <Label htmlFor="canal-telefono" className="cursor-pointer">Teléfono / WhatsApp</Label>
                  </div>
                </RadioGroup>

                {canalTipo && (
                  <div>
                    <Label htmlFor="canal-valor">
                      {canalTipo === 'email' ? 'Email corporativo' : 'Número de teléfono'}
                    </Label>
                    <Input
                      id="canal-valor"
                      type={canalTipo === 'email' ? 'email' : 'tel'}
                      placeholder={
                        canalTipo === 'email'
                          ? 'proteccion@entidad.es'
                          : '+34 600 000 000'
                      }
                      value={canalValor}
                      onChange={(e) => setCanalValor(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-900">
                    <strong>Importante:</strong> Este canal aparecerá en TODOS los documentos y
                    comunicaciones de esta entidad.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveCanal}
                    disabled={savingCanal || !canalTipo || !canalValor}
                    className="flex-1"
                  >
                    {savingCanal ? 'Guardando...' : 'Guardar canal'}
                  </Button>

                  <Button
                    onClick={handlePostponeCanal}
                    variant="outline"
                    className="flex-1 border-orange-500 text-orange-700 hover:bg-orange-50"
                  >
                    Posponer 30 días
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Paso 2: Link/Token de Onboarding */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">2. Portal de Incorporación de Miembros</CardTitle>
            <CardDescription>
              Enlace único para que personal y familias completen su registro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingToken ? (
              <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg text-center">
                <p className="text-gray-600">Generando enlace...</p>
              </div>
            ) : inviteUrl ? (
              <>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Enlace de incorporación:</h4>
                  <div className="bg-white p-3 rounded border border-blue-300 mb-3 break-all">
                    <code className="text-sm text-blue-800">{inviteUrl}</code>
                  </div>
                  <p className="text-sm text-blue-800">
                    Comparte este enlace con tu personal, familias y directiva para que completen su
                    registro. Cada rol tendrá un formulario adaptado a sus necesidades.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">¿Quiénes pueden registrarse?</h4>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li><strong>Personal con contacto:</strong> Completan formación corta + test 10 preguntas</li>
                    <li><strong>Personal sin contacto:</strong> Datos básicos + documentación</li>
                    <li><strong>Familias/Tutores:</strong> Datos adultos + información de hijos/as</li>
                    <li><strong>Directiva/Junta:</strong> Datos + compromisos + documentación</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-3">
                    Todos tienen <strong>30 días</strong> para completar el proceso.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    onClick={handleCopyLink}
                    variant="default"
                    className="w-full"
                  >
                    {copied ? '✓ Copiado' : 'Copiar enlace'}
                  </Button>

                  <Button
                    onClick={handleWhatsApp}
                    variant="outline"
                    className="w-full border-green-500 text-green-700 hover:bg-green-50"
                  >
                    Enviar por WhatsApp
                  </Button>

                  <Button
                    onClick={handleEmail}
                    variant="outline"
                    className="w-full border-blue-500 text-blue-700 hover:bg-blue-50"
                  >
                    Enviar por Email
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
                <p className="text-red-900">Error cargando el enlace. Intenta recargar la página.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paso 3: Mapa de Riesgos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">3. Mapa de Riesgos</CardTitle>
            <CardDescription>
              Lee y descarga el mapa de riesgos de tu entidad y sector
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {compliance.riskmap_done ? (
              <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
                <p className="text-green-900 font-semibold">✓ Mapa de riesgos leído y confirmado</p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">
                    Mapa de Riesgos - {session.sector_code || 'General'}
                  </p>
                  <p className="text-sm text-gray-700">
                    El mapa de riesgos identifica las situaciones de vulnerabilidad específicas
                    de tu entidad y sector según la LOPIVI.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setModalMapaAbierto(true)}
                    variant="default"
                    className="flex-1"
                  >
                    Leer Mapa de Riesgos
                  </Button>

                  <Button
                    onClick={handleDownloadMapa}
                    variant="outline"
                    className="flex-1"
                  >
                    Descargar PDF
                  </Button>
                </div>

                <div className="flex items-start space-x-3 border-2 border-blue-500 rounded-lg p-4">
                  <Checkbox
                    id="mapa-leido"
                    checked={mapaLeido}
                    onCheckedChange={(checked) => setMapaLeido(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="mapa-leido" className="cursor-pointer text-sm">
                    He leído y entiendo el Mapa de Riesgos de mi entidad y mi sector
                  </Label>
                </div>

                <Button
                  onClick={handleSaveMapa}
                  disabled={savingMapa || !mapaLeido}
                  className="w-full"
                >
                  {savingMapa ? 'Guardando...' : 'Confirmar lectura'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Paso 4: Certificado de penales */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">4. Certificado de Penales</CardTitle>
            <CardDescription>Declaración de entrega del certificado vigente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {compliance.penales_done ? (
              <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
                <p className="text-green-900 font-semibold">
                  ✓ Certificado de penales declarado como entregado
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-purple-50 border border-purple-300 rounded-lg">
                  <p className="font-semibold text-purple-900 mb-2">Requisito Legal LOPIVI</p>
                  <p className="text-sm text-purple-800">
                    Debes haber entregado a tu entidad el Certificado Negativo del Registro Central
                    de Delincuentes Sexuales vigente (menos de 3 meses).
                  </p>
                </div>

                {/* Sección informativa: Cómo obtener el certificado */}
                <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Cómo obtener el certificado:</h4>

                  <div className="space-y-3 text-sm text-blue-900">
                    <div className="flex items-start gap-2">
                      <span className="font-bold">1.</span>
                      <div>
                        <p className="font-medium">Accede a la Sede Electrónica del Ministerio de Justicia</p>
                        <a
                          href="https://sede.mjusticia.gob.es"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline mt-1"
                        >
                          sede.mjusticia.gob.es
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold">2.</span>
                      <p>Solicita el <strong>"Certificado de Delitos de Naturaleza Sexual"</strong></p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold">3.</span>
                      <p>Necesitarás: DNI electrónico, Certificado Digital o Cl@ve</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold">4.</span>
                      <p>El certificado se genera <strong>al instante</strong> y es gratuito</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold">5.</span>
                      <p>Descárgalo en PDF y <strong>entrégalo en tu entidad</strong></p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-blue-300">
                    <p className="text-xs text-blue-800">
                      <strong>Importante:</strong> El certificado debe tener menos de 3 meses de antigüedad.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 border-2 border-blue-500 rounded-lg p-4">
                  <Checkbox
                    id="penales-entregado"
                    checked={penalesEntregado}
                    onCheckedChange={(checked) => setPenalesEntregado(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="penales-entregado" className="cursor-pointer text-sm">
                    Declaro que he entregado el certificado de penales vigente a mi entidad
                  </Label>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSavePenales}
                    disabled={savingPenales || !penalesEntregado}
                    className="flex-1"
                  >
                    {savingPenales ? 'Guardando...' : 'Confirmar entrega'}
                  </Button>

                  <Button
                    onClick={handlePostponePenales}
                    variant="outline"
                    className="flex-1 border-orange-500 text-orange-700 hover:bg-orange-50"
                  >
                    Posponer 30 días
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Botón Volver al Panel - Después del punto 4, con fondo de color suave */}
        <div className="mb-6">
          <Button
            onClick={() => router.push('/dashboard-delegado')}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Panel del Delegado
          </Button>
        </div>

        {/* Botón de acceso al panel - Solo visible cuando puede acceder */}
        {canAccessPanel && (
          <Card className="mb-6 border-2 border-green-600 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 mb-2">
                    {isFirstTime
                      ? (allCompleted ? '¡Configuración Inicial Completada!' : '¡Configuración Inicial Lista!')
                      : (allCompleted ? 'Configuración Actualizada' : 'Cambios Guardados')
                    }
                  </h3>
                  <p className="text-green-800 text-base mb-6">
                    {isFirstTime
                      ? (allCompleted
                          ? 'Has completado todos los pasos obligatorios. Ya puedes acceder al panel del delegado y empezar a gestionar tu entidad.'
                          : 'Has cumplido con los requisitos mínimos. Puedes acceder al panel del delegado mientras completas los pasos pospuestos en los próximos 30 días.')
                      : (allCompleted
                          ? 'Todos los pasos de configuración están completados correctamente.'
                          : 'Los cambios han sido guardados. Puedes volver al panel cuando quieras.')
                    }
                  </p>
                </div>

                {!allCompleted && (
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-300 rounded-lg">
                    <p className="text-sm text-orange-900 font-semibold mb-2">
                      ⚠️ Recordatorio de pasos pospuestos:
                    </p>
                    <ul className="text-sm text-orange-800 text-left space-y-1">
                      {!compliance.channel_done && compliance.channel_postponed && (
                        <li>• Canal de comunicación - Pospuesto 30 días</li>
                      )}
                      {!compliance.penales_done && compliance.penales_postponed && (
                        <li>• Certificado de penales - Pospuesto 30 días</li>
                      )}
                    </ul>
                    <p className="text-xs text-orange-700 mt-2">
                      Puedes completar estos pasos desde el panel del delegado cuando estés listo.
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => router.push('/dashboard-delegado')}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold shadow-lg"
                >
                  {isFirstTime ? 'Acceder al Panel del Delegado →' : 'Volver al Panel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal Mapa de Riesgos Completo */}
      {modalMapaAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Mapa de Riesgos Específico</h3>
                <button
                  onClick={() => setModalMapaAbierto(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="prose max-w-none mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">
                    Análisis de Riesgos para {session?.entidad}
                  </h4>
                  <p className="text-blue-800">
                    Sector: {session?.sector_code || 'General'} | Delegado Principal
                  </p>
                </div>

                <h4 className="text-lg font-semibold mb-3">1. RIESGOS ESPECÍFICOS IDENTIFICADOS:</h4>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Espacios con supervisión limitada (vestuarios, almacenes)</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Menor cambiándose solo en vestuario</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Implementar sistema de puertas abiertas, supervisión rotatoria</p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Interacciones uno-a-uno entre adultos y menores</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Entrenamiento individual, tutoría privada</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Siempre con puerta abierta, informar a otro adulto presente</p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Actividades que requieren contacto físico</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Correcciones técnicas, primeros auxilios, apoyo físico</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Explicar antes el contacto, presencia de otro adulto, documentar</p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Desplazamientos y actividades fuera de las instalaciones</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Viajes a competiciones, excursiones, campamentos</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Autorización familiar por escrito, supervisión 24/7, protocolos claros</p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <p className="font-medium">• Uso de tecnologías y redes sociales</p>
                    <p className="text-sm text-red-600 mt-1"><strong>EJEMPLO:</strong> Comunicación por WhatsApp, fotos de actividades, redes sociales</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Canal oficial únicamente, prohibir comunicación privada</p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold mb-3">2. MEDIDAS PREVENTIVAS OBLIGATORIAS:</h4>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Nunca estar a solas con un menor en espacios cerrados</p>
                    <p className="text-sm text-red-600 mt-1"><strong>SITUACIÓN:</strong> Menor necesita hablar en privado</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Usar espacio visible (ventana), puerta abierta, otro adulto cerca</p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Mantener puertas abiertas durante interacciones privadas</p>
                    <p className="text-sm text-red-600 mt-1"><strong>SITUACIÓN:</strong> Consulta médica, conversación personal</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Puerta entreabierta siempre, otro adulto informado y disponible</p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Informar a otro adulto sobre interacciones especiales</p>
                    <p className="text-sm text-red-600 mt-1"><strong>SITUACIÓN:</strong> Menor requiere atención especial, apoyo emocional</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Avisar siempre a compañero, documentar conversación</p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">• Documentar todas las interacciones relevantes</p>
                    <p className="text-sm text-red-600 mt-1"><strong>SITUACIÓN:</strong> Conversación sobre problema personal, incidente</p>
                    <p className="text-sm text-green-600 mt-1"><strong>CÓMO ACTUAR:</strong> Registro escrito inmediato, informar al delegado</p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold mb-3">3. PROTOCOLO DE ACTUACIÓN ANTE SOSPECHA:</h4>
                <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li><strong>Escuchar sin juzgar</strong> - Dar confianza al menor</li>
                    <li><strong>No hacer preguntas invasivas</strong> - No contaminar el testimonio</li>
                    <li><strong>Informar inmediatamente al delegado</strong> - En menos de 24h</li>
                    <li><strong>No confrontar al presunto agresor</strong> - Podría destruir pruebas</li>
                    <li><strong>Documentar todo por escrito</strong> - Fecha, hora, palabras exactas</li>
                    <li><strong>Mantener confidencialidad</strong> - Solo informar a autoridades</li>
                    <li><strong>Si hay riesgo inminente</strong> - Llamar 112 inmediatamente</li>
                  </ol>
                </div>

                <h4 className="text-lg font-semibold mb-3 mt-6">4. CONTACTOS DE EMERGENCIA:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 rounded p-3">
                    <p className="font-semibold">Emergencias</p>
                    <p className="text-2xl font-bold text-red-600">112</p>
                  </div>
                  <div className="bg-gray-100 rounded p-3">
                    <p className="font-semibold">ANAR (Ayuda Niños)</p>
                    <p className="text-2xl font-bold text-blue-600">900 20 20 10</p>
                  </div>
                  <div className="bg-gray-100 rounded p-3">
                    <p className="font-semibold">Policía Nacional</p>
                    <p className="text-2xl font-bold">091</p>
                  </div>
                  <div className="bg-gray-100 rounded p-3">
                    <p className="font-semibold">Guardia Civil</p>
                    <p className="text-2xl font-bold">062</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  onClick={handleDownloadMapa}
                  variant="outline"
                >
                  Descargar PDF
                </Button>
                <Button
                  onClick={() => setModalMapaAbierto(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
