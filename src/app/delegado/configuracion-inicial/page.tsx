'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, saveSession } from '@/lib/auth/session'

interface ConfigState {
  channel_done: boolean
  channel_postponed: boolean
  riskmap_done: boolean
  penales_done: boolean
  penales_postponed: boolean
  deadline_at: string | null
  blocked: boolean
}

export default function ConfiguracionInicial() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [entity_id, setEntityId] = useState('')
  const [sector_code, setSectorCode] = useState('')
  const [state, setState] = useState<ConfigState | null>(null)
  const [token, setToken] = useState<string>('')
  const [baseUrl, setBaseUrl] = useState('')

  // Paso 1: Canal
  const [canalTipo, setCanalTipo] = useState<'email' | 'telefono'>('email')
  const [canalValor, setCanalValor] = useState('')

  // Paso 4: Penales
  const [penalesCheck, setPenalesCheck] = useState(false)

  // Modal Mapa de Riesgos
  const [showMapaModal, setShowMapaModal] = useState(false)

  useEffect(() => {
    // Capturar URL base del navegador
    setBaseUrl(window.location.origin)

    // Obtener entity_id de userSession en localStorage (desde el flujo de certificación)
    const sessionData = localStorage.getItem('userSession')

    // UUID fijo de entidad demo creada en Supabase
    let stored_entity = '00000000-0000-0000-0000-000000000001'
    let isDemo = true

    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData)
        if (parsed.entityId) {
          stored_entity = parsed.entityId
          isDemo = false
        }
      } catch (error) {
        console.error('Error parseando sesión:', error)
      }
    }

    if (isDemo) {
      console.log('⚠️ [CONFIG] MODO DEMO - Usando entidad demo:', stored_entity)
      console.log('⚠️ [CONFIG] Para usar entidad real, accede desde el flujo de certificación')
    } else {
      console.log('✅ [CONFIG] Entity ID desde sesión:', stored_entity)
    }

    setEntityId(stored_entity)
    loadState(stored_entity)
  }, [])

  async function loadState(eid: string, retryCount = 0) {
    try {
      console.log('📤 [CONFIG] Cargando estado para entity:', eid, retryCount > 0 ? `(intento ${retryCount + 1})` : '')

      const res = await fetch(`/api/delegado/config/init?entity_id=${eid}`)
      console.log('📥 [CONFIG] Respuesta loadState:', res.status, res.statusText)

      const data = await res.json()
      console.log('📥 [CONFIG] Data loadState:', data)

      if (data.ok) {
        setState(data.compliance)
        setSectorCode(data.entity.sector_code)

        // Obtener token de diferentes formas posibles
        const tokenValue = data.token?.token || data.token || ''
        console.log('🔑 [CONFIG] Token recibido desde API:', tokenValue)
        console.log('🔑 [CONFIG] Data completa:', data)
        setToken(tokenValue || '')
        console.log('🔑 [CONFIG] Token guardado en estado:', tokenValue || '')

        if (data.entity.canal_tipo && data.entity.canal_valor) {
          setCanalTipo(data.entity.canal_tipo)
          setCanalValor(data.entity.canal_valor)
        }
      } else {
        console.error('❌ [CONFIG] Error en loadState:', data.error)
        alert(`Error cargando configuración: ${data.error || 'Error desconocido'}`)
      }
      setLoading(false)
    } catch (err: any) {
      console.error('❌ [CONFIG] Error cargando estado:', err)
      console.error('❌ [CONFIG] Stack:', err.stack)

      // Si es un error de red temporal y no hemos reintentado más de 2 veces, reintentar
      const isNetworkError = err.message === 'Load failed' || err.message === 'Failed to fetch'

      if (isNetworkError && retryCount < 2) {
        console.warn(`⚠️ [CONFIG] Error de red temporal - Reintentando en 1 segundo... (intento ${retryCount + 1}/2)`)
        setTimeout(() => {
          loadState(eid, retryCount + 1)
        }, 1000)
        return
      }

      // Solo mostrar alert si NO es un error de red temporal después de reintentos
      if (!isNetworkError) {
        alert(`Error al cargar configuración: ${err.message || 'Error desconocido'}`)
      } else {
        console.warn('⚠️ [CONFIG] Error de red persistente - Continuando con valores por defecto')
      }

      setLoading(false)
    }
  }

  async function handleAction(action: string, payload?: any) {
    setSaving(true)
    try {
      console.log('📤 [CONFIG] Enviando acción:', action, 'para entity:', entity_id)

      const res = await fetch('/api/delegado/config/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, entity_id, payload })
      })

      console.log('📥 [CONFIG] Respuesta HTTP:', res.status, res.statusText)

      const data = await res.json()
      console.log('📥 [CONFIG] Data recibida:', data)

      if (data.ok) {
        // Obtener token de diferentes formas posibles
        const tokenValue = data.token?.token || data.token || ''
        console.log('🔑 [CONFIG] Token generado desde API:', tokenValue)
        console.log('🔑 [CONFIG] Data completa gen_token:', data)
        console.log('🔑 [CONFIG] Tipo de data.token:', typeof data.token)
        console.log('🔑 [CONFIG] Es string?:', typeof data.token === 'string')

        setToken(tokenValue || '')
        console.log('🔑 [CONFIG] Token guardado en estado después de generar:', tokenValue || '')

        // Si es gen_token, mostrar alerta de éxito
        if (action === 'gen_token' && tokenValue) {
          alert(`✅ Token generado exitosamente:\n\n${tokenValue}\n\nLink completo:\n${baseUrl}/onboarding/${tokenValue}`)
        }

        // Recargar estado
        await loadState(entity_id)
      } else {
        const errorMsg = data.error || 'Error al guardar'
        const errorDetails = data.details ? `\n\nDetalles: ${data.details}` : ''
        const errorCode = data.code ? `\nCódigo: ${data.code}` : ''

        console.error('❌ [CONFIG] Error desde API:', errorMsg, errorDetails, errorCode)
        alert(`❌ Error: ${errorMsg}${errorDetails}${errorCode}`)
      }
    } catch (err: any) {
      console.error('❌ [CONFIG] Error en handleAction:', err)
      console.error('❌ [CONFIG] Stack:', err.stack)
      alert(`Error al guardar cambios: ${err.message || 'Error desconocido'}`)
    } finally {
      setSaving(false)
    }
  }

  function canFinish() {
    // Solo puede finalizar si:
    // - Token generado (paso 2)
    // - Mapa acknowledged (paso 3)
    return !!token && state?.riskmap_done
  }

  function handleFinish() {
    if (!canFinish()) return

    console.log('✅ [CONFIG] Configuración completa, verificando sesión...')

    // SAFETY CHECK: Verificar sesión válida antes de redirigir
    const session = getSession()
    console.log('🔍 [CONFIG] Sesión actual:', {
      hasToken: !!session.token,
      role: session.role,
      entityId: session.entityId,
      userName: session.userName
    })

    if (!session.token) {
      console.error('❌ [CONFIG] Sin token de sesión válido')
      alert('⚠️ Error: No se detectó una sesión válida. Por favor, inicia sesión de nuevo.')
      router.push('/login')
      return
    }

    if (!session.role || (session.role !== 'DELEGADO' && session.role !== 'SUPLENTE')) {
      console.error('❌ [CONFIG] Rol inválido:', session.role)
      alert('⚠️ Error: Tu rol de usuario no es válido. Por favor, contacta con soporte.')
      router.push('/login')
      return
    }

    // ASEGURAR que la sesión esté completa y bien guardada antes de redirigir
    console.log('🔄 [CONFIG] Refrescando sesión antes de redirigir...')

    saveSession({
      token: session.token,
      role: session.role,
      entity: {
        id: session.entityId || entity_id,
        name: session.entityName || 'Entidad'
      },
      isDemo: session.isDemo,
      userId: session.userId,
      userName: session.userName,
      userEmail: session.userEmail,
      ttlHours: 24
    })

    console.log('✅ [CONFIG] Sesión refrescada y guardada correctamente')
    console.log('🚀 [CONFIG] Redirigiendo a dashboard...')

    // Pequeño delay para asegurar que localStorage se escriba
    setTimeout(() => {
      router.push('/dashboard-delegado')
    }, 100)
  }

  // LOG DE DEBUG - Ver siempre el estado del token
  console.log('🔍 [RENDER] Estado actual del token:', token)
  console.log('🔍 [RENDER] Entity ID:', entity_id)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white rounded-full px-6 py-3 shadow-md mb-6">
            <span className="text-2xl font-bold text-orange-600">C360</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Configura tu sistema C360
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Menos de 3 minutos para estar operativo
          </p>
          <p className="text-gray-500 mb-4">
            Algunos pasos pueden posponerse 30 días
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-2">
            {/* Columna 1: Qué vas a configurar */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2 text-base">¿Qué vas a configurar?</h3>
              <ul className="space-y-1.5 text-blue-800 text-xs">
                <li><strong>• Canal:</strong> Email/teléfono alertas (posponer 30d)</li>
                <li><strong>• Link:</strong> Registro miembros (obligatorio)</li>
                <li><strong>• Mapa:</strong> Riesgos del sector (obligatorio)</li>
                <li><strong>• Penales:</strong> Certificado (posponer 30d)</li>
              </ul>
            </div>

            {/* Columna 2: Cómo funciona */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2 text-base">¿Cómo funciona?</h3>
              <div className="space-y-2 text-xs text-blue-800">
                <div>
                  <p className="font-semibold mb-0.5">Posponer paso:</p>
                  <p>Botón "Hacerlo más tarde" = 30 días plazo</p>
                </div>
                <div>
                  <p className="font-semibold mb-0.5">Completar después:</p>
                  <p>Panel Delegado → Pasos pendientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {/* Paso 1: Canal de Comunicación */}
          <div className={`pb-8 mb-8 border-b ${state?.channel_done ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  1. Canal de Comunicación
                </h2>
                <p className="text-gray-600 mb-4">
                  Email o teléfono donde recibirás comunicaciones de casos de violencia.
                  {!state?.channel_done && ' Puedes posponerlo 30 días.'}
                </p>

                {!state?.channel_done && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                        <select
                          value={canalTipo}
                          onChange={(e) => setCanalTipo(e.target.value as 'email' | 'telefono')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="email">Email</option>
                          <option value="telefono">WhatsApp / Teléfono</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {canalTipo === 'email' ? 'Email' : 'Teléfono'}
                        </label>
                        <input
                          type={canalTipo === 'email' ? 'email' : 'tel'}
                          value={canalValor}
                          onChange={(e) => setCanalValor(e.target.value)}
                          placeholder={canalTipo === 'email' ? 'tu@email.com' : '+34 600 000 000'}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction('set_channel', { canal_tipo: canalTipo, canal_valor: canalValor })}
                        disabled={saving || !canalValor}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        Guardar canal
                      </button>
                      <button
                        onClick={() => handleAction('postpone_channel')}
                        disabled={saving}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                      >
                        Hacerlo más tarde
                      </button>
                    </div>
                  </div>
                )}

                {state?.channel_done && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">✓ Canal configurado: {canalTipo === 'email' ? canalValor : `Teléfono ${canalValor}`}</p>
                  </div>
                )}

                {state?.channel_postponed && !state?.channel_done && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">⏰ Pospuesto. Recuerda completarlo antes de 30 días.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Paso 2: Token de Miembros */}
          <div className={`pb-8 mb-8 border-b`}>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  2. Link de Incorporación de Miembros
                </h2>
                <p className="text-gray-600 mb-4">
                  Genera y comparte el enlace para que personal, familias y directiva se registren.
                  <strong className="text-orange-600"> Obligatorio.</strong>
                </p>

                {!token ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        console.log('🔄 [CONFIG] Generando token para entity:', entity_id)
                        handleAction('gen_token')
                      }}
                      disabled={saving}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      {saving ? 'Generando...' : 'Generar link'}
                    </button>
                    <p className="text-xs text-gray-500">Entity ID: {entity_id}</p>
                  </div>
                ) : null}

                {token && (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium mb-3">✓ Link generado - Compártelo por email o WhatsApp</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={baseUrl ? `${baseUrl}/onboarding/${token}` : 'Generando link...'}
                          className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm font-mono"
                        />
                        <button
                          onClick={() => {
                            const link = `${baseUrl}/onboarding/${token}`
                            navigator.clipboard.writeText(link)
                            alert('Link copiado al portapapeles')
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold whitespace-nowrap"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Paso 3: Mapa de Riesgos */}
          <div className={`pb-8 mb-8 border-b ${state?.riskmap_done ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  3. Mapa de Riesgos
                </h2>
                <p className="text-gray-600 mb-4">
                  Revisa el mapa de riesgos específico de tu sector.
                  <strong className="text-orange-600"> Obligatorio.</strong>
                </p>

                {!state?.riskmap_done && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 mb-3">
                        Mapa de riesgos para tu sector ({sector_code || 'general'})
                      </p>
                      <button
                        onClick={() => setShowMapaModal(true)}
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Leer Mapa de Riesgos
                      </button>
                    </div>
                    <button
                      onClick={() => handleAction('ack_riskmap')}
                      disabled={saving}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      He leído y entiendo
                    </button>
                  </div>
                )}

                {state?.riskmap_done && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">✓ Mapa de riesgos revisado</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Paso 4: Certificado de Penales */}
          <div className={state?.penales_done ? 'opacity-60' : ''}>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  4. Certificado de Penales
                </h2>
                <p className="text-gray-600 mb-4">
                  Confirma que has entregado tu certificado negativo de delitos sexuales.
                  {!state?.penales_done && ' Puedes posponerlo 30 días.'}
                </p>

                {!state?.penales_done && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="penales"
                        checked={penalesCheck}
                        onChange={(e) => setPenalesCheck(e.target.checked)}
                        className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label htmlFor="penales" className="text-gray-700 font-medium">
                        He entregado mi certificado negativo de delitos sexuales
                      </label>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction('set_penales')}
                        disabled={saving || !penalesCheck}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => handleAction('postpone_penales')}
                        disabled={saving}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                      >
                        Hacerlo más tarde
                      </button>
                    </div>
                  </div>
                )}

                {state?.penales_done && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">✓ Certificado confirmado</p>
                  </div>
                )}

                {state?.penales_postponed && !state?.penales_done && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">⏰ Pospuesto. Recuerda entregarlo antes de 30 días.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DEBUG: Indicador de token */}
        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-4 text-center">
          <p className="font-mono text-sm">
            <strong>🔍 DEBUG:</strong> Token actual = "{token || 'VACÍO'}" | Length: {token?.length || 0}
          </p>
        </div>

        {/* Link de Incorporación SIEMPRE VISIBLE */}
        {token && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-500 rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Tu Link de Incorporación de Miembros
            </h3>
            <p className="text-center text-gray-700 mb-6">
              Comparte este enlace con personal, familias y directiva para que se registren
            </p>

            <div className="bg-white rounded-lg p-6 mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Link completo:</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  readOnly
                  value={baseUrl ? `${baseUrl}/onboarding/${token}` : 'Generando link...'}
                  className="flex-1 px-4 py-3 bg-gray-50 border-2 border-green-300 rounded-lg text-base font-mono text-green-900 font-semibold"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  onClick={() => {
                    const link = `${baseUrl}/onboarding/${token}`
                    navigator.clipboard.writeText(link)
                    alert('✅ Link copiado al portapapeles')
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center">
              Este link estará siempre disponible en tu Panel del Delegado
            </p>
          </div>
        )}

        {/* Botón finalizar */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {canFinish() ? (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Configuración completa!</h3>
              <p className="text-gray-600 mb-6">
                Ya puedes acceder a tu panel de gestión
              </p>
              <button
                onClick={handleFinish}
                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
              >
                Entrar al Panel →
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pasos obligatorios pendientes</h3>
              <p className="text-gray-600 mb-4">
                Para acceder al panel debes completar:
              </p>
              <ul className="text-left max-w-md mx-auto space-y-2 mb-6">
                {!token && <li className="text-orange-600">• Generar link de incorporación de miembros</li>}
                {!state?.riskmap_done && <li className="text-orange-600">• Revisar el mapa de riesgos</li>}
              </ul>
              <button
                disabled
                className="px-8 py-4 bg-gray-300 text-gray-500 rounded-lg font-semibold text-lg cursor-not-allowed"
              >
                Completa los pasos obligatorios
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500 mt-6">
          <p>Sistema de protección de la infancia · Cumplimiento LOPIVI</p>
        </div>
      </div>

      {/* Modal Mapa de Riesgos */}
      {showMapaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowMapaModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-orange-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mapa de Riesgos - Sector {sector_code || 'General'}</h2>
              <button
                onClick={() => setShowMapaModal(false)}
                className="text-white hover:text-gray-200 text-3xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mapa de Riesgos de Protección Infantil</h3>

                <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1. Espacios Físicos</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Zonas aisladas sin supervisión:</strong> Baños, vestuarios, almacenes, sótanos</li>
                  <li><strong>Iluminación deficiente:</strong> Pasillos, patios, zonas exteriores</li>
                  <li><strong>Accesos sin control:</strong> Entradas secundarias, ventanas accesibles</li>
                  <li><strong>Mitigación:</strong> Mejorar iluminación, supervisión activa, control de accesos</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2. Actividades y Situaciones</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Actividades 1-a-1:</strong> Tutorías individuales, clases particulares sin visibilidad</li>
                  <li><strong>Desplazamientos:</strong> Viajes, excursiones, transporte con menores</li>
                  <li><strong>Pernoctaciones:</strong> Campamentos, salidas de varios días</li>
                  <li><strong>Contacto físico:</strong> Deportes de contacto, correcciones posturales</li>
                  <li><strong>Mitigación:</strong> Siempre 2 adultos, visibilidad, autorizaciones, protocolos claros</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3. Personal y Recursos Humanos</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Falta de formación:</strong> Personal sin conocimiento LOPIVI</li>
                  <li><strong>Ratio inadecuado:</strong> Pocos adultos para muchos menores</li>
                  <li><strong>Sin certificados:</strong> Personal sin certificado de penales vigente</li>
                  <li><strong>Voluntarios sin control:</strong> Acceso sin supervisión ni formación</li>
                  <li><strong>Mitigación:</strong> Formación obligatoria, ratios adecuadas, certificados al día</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4. Tecnología y Comunicación Digital</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Comunicación privada adulto-menor:</strong> WhatsApp, redes sociales personales</li>
                  <li><strong>Fotografías y vídeos:</strong> Sin autorización, publicación sin control</li>
                  <li><strong>Dispositivos sin supervisión:</strong> Acceso libre a internet</li>
                  <li><strong>Mitigación:</strong> Canales oficiales únicos, autorizaciones de imagen, supervisión</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5. Relaciones entre Menores</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Acoso entre iguales (bullying):</strong> Físico, verbal, social, digital</li>
                  <li><strong>Violencia entre menores:</strong> Peleas, agresiones</li>
                  <li><strong>Conductas sexualizadas:</strong> Entre menores sin supervisión</li>
                  <li><strong>Mitigación:</strong> Protocolos antibullying, supervisión activa, educación en respeto</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6. Familias y Entorno</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Violencia doméstica:</strong> Menores expuestos a violencia en el hogar</li>
                  <li><strong>Negligencia familiar:</strong> Desatención de necesidades básicas</li>
                  <li><strong>Acceso de familiares no autorizados:</strong> Recogidas sin permiso</li>
                  <li><strong>Mitigación:</strong> Coordinación servicios sociales, protocolos recogida, detección temprana</li>
                </ul>

                <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <p className="text-yellow-900 font-semibold mb-2">⚠️ Importante:</p>
                  <p className="text-yellow-800">
                    Este mapa debe actualizarse periódicamente según los riesgos específicos de tu entidad y sector.
                    Realiza evaluaciones anuales y tras cada incidente detectado.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setShowMapaModal(false)}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
