'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { getSession, isExpired } from '@/lib/auth/session'

interface SessionData {
  id: string
  nombre: string
  email: string
  entityId: string
  entidad: string
  user_id: string
  rol?: string
  sector_code?: string
  tipoEntidad?: string
  [key: string]: any
}

type SectorInfo = {
  nombre: string
  descripcion: string
  riesgosEstructurales: string[]
  riesgosRelacionales: string[]
  riesgosOperativos: string[]
  medidasPreventivas: string[]
}

export default function ConfiguracionPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)

  // Paso 1: Canal de comunicación
  const [canalComunicacion, setCanalComunicacion] = useState('')
  const [telefonoWhatsApp, setTelefonoWhatsApp] = useState('')
  const [emailCanal, setEmailCanal] = useState('')

  // Paso 2: Link para datos de miembros
  const [linkMiembros, setLinkMiembros] = useState('')

  // Paso 3: Mapa de riesgos (lectura)
  const [mapaLeido, setMapaLeido] = useState(false)

  // Paso 4: Certificado de penales
  const [opcionCertificado, setOpcionCertificado] = useState('')

  // Para evitar dobles ejecuciones de efectos
  const loadedRef = useRef(false)

  // Montar el componente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Cargar sesión y datos iniciales
  useEffect(() => {
    if (!mounted || loadedRef.current) return
    loadedRef.current = true

    try {
      console.log('🔍 [CONFIGURACIÓN] Verificando sesión...')

      const sessionData = getSession()

      if (!sessionData.token || isExpired()) {
        console.error('❌ [CONFIGURACIÓN] Sesión inválida o expirada')
        setLoading(false)
        alert('No se ha encontrado una sesión válida. Por favor, inicia sesión de nuevo.')
        router.push('/login')
        return
      }

      // Verificar que sea delegado o suplente
      const esAutorizado = sessionData.role === 'DELEGADO' || sessionData.role === 'SUPLENTE'
      if (!esAutorizado) {
        console.error('❌ [CONFIGURACIÓN] Usuario no autorizado. Rol:', sessionData.role)
        setLoading(false)
        alert('Solo los delegados pueden acceder a esta configuración.')
        router.push('/login')
        return
      }

      console.log('✅ [CONFIGURACIÓN] Sesión válida para:', sessionData.userName)

      // Mapear sesión al formato esperado por el componente
      const parsed: SessionData = {
        id: sessionData.userId || sessionData.token,
        nombre: sessionData.userName || '',
        email: sessionData.userEmail || '',
        entityId: sessionData.entityId,
        entidad: sessionData.entityName,
        user_id: sessionData.userId || '',
        rol: sessionData.role,
        sector_code: 'general', // Valor por defecto
        tipoEntidad: 'general'
      }

      setSession(parsed)

      // Generar link automático para miembros
      const autoLink = `https://custodia360.es/i/${parsed.entityId || 'demo'}`
      setLinkMiembros(autoLink)

      setLoading(false)
    } catch (error) {
      console.error('❌ [CONFIGURACIÓN] Error cargando sesión:', error)
      setLoading(false)
      alert('Error al cargar la configuración. Intenta nuevamente.')
      router.push('/login')
    }
  }, [mounted, router])

  // Ultra-defensive: no permitir avanzar si no está montado o cargando
  const handleNext = () => {
    if (!mounted || loading) return

    if (currentStep === 1) {
      if (!canalComunicacion) {
        alert('Por favor, selecciona un canal de comunicación')
        return
      }
      if (canalComunicacion === 'whatsapp' && !telefonoWhatsApp.trim()) {
        alert('Por favor, ingresa el número de teléfono de WhatsApp')
        return
      }
      if (canalComunicacion === 'email' && !emailCanal.trim()) {
        alert('Por favor, ingresa el email del canal de comunicación')
        return
      }
    }

    if (currentStep === 3 && !mapaLeido) {
      alert('Por favor, confirma que has leído el mapa de riesgos completo')
      return
    }

    if (currentStep === 4 && !opcionCertificado) {
      alert('Por favor, selecciona una opción sobre el certificado de penales')
      return
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const handlePrevious = () => {
    if (!mounted || loading) return
    if (currentStep > 1) {
      setCurrentStep((prev) => Math.max(prev - 1, 1))
    }
  }

  const handleFinish = () => {
    if (!mounted || loading || !session) {
      console.error('❌ [CONFIGURACIÓN] Condiciones no cumplidas:', { mounted, loading, session: !!session })
      return
    }

    try {
      console.log('💾 [CONFIGURACIÓN] Guardando configuración...')
      console.log('📊 [CONFIGURACIÓN] Session data:', {
        entityId: session.entityId,
        nombre: session.nombre,
        rol: session.rol
      })

      // Verificar que la sesión unificada esté presente
      const currentSession = getSession()
      console.log('🔍 [CONFIGURACIÓN] Sesión unificada:', {
        token: !!currentSession.token,
        role: currentSession.role,
        entityId: currentSession.entityId,
        entityName: currentSession.entityName,
        userId: currentSession.userId,
        expiresAt: currentSession.expiresAt
      })

      if (!currentSession.token || !currentSession.role) {
        console.error('❌ [CONFIGURACIÓN] Sesión unificada incompleta')
        alert('Error: La sesión no está completa. Por favor, vuelve a iniciar sesión.')
        router.push('/login')
        return
      }

      const now = new Date()
      const fechaLimite30Dias = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

      const config = {
        canalComunicacion,
        telefonoWhatsApp: canalComunicacion === 'whatsapp' ? telefonoWhatsApp : '',
        emailCanal: canalComunicacion === 'email' ? emailCanal : '',
        canalPendiente: canalComunicacion === 'no-tengo',
        canalFechaLimite: canalComunicacion === 'no-tengo' ? fechaLimite30Dias.toISOString() : null,
        linkMiembros,
        mapaLeido,
        mapaDescargado: false,
        certificadoEntregado: opcionCertificado === 'entregado',
        certificadoPendiente: opcionCertificado === 'mas-adelante',
        certificadoFechaLimite: opcionCertificado === 'mas-adelante' ? fechaLimite30Dias.toISOString() : null,
        configuracionCompletada: true,
        fechaConfiguracion: now.toISOString(),
        bloqueoPanelPorCertificado: opcionCertificado === 'mas-adelante'
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`config_${session.entityId}`, JSON.stringify(config))
        console.log('✅ [CONFIGURACIÓN] Configuración guardada en localStorage')
      }

      console.log('🚀 [CONFIGURACIÓN] Preparando redirección...')
      console.log('📍 [CONFIGURACIÓN] URL destino: /dashboard-delegado')

      // Esperar un tick antes de redirigir para asegurar que todo se guardó
      setTimeout(() => {
        console.log('🔄 [CONFIGURACIÓN] Ejecutando redirección ahora...')
        router.push('/dashboard-delegado')
      }, 100)

    } catch (error) {
      console.error('❌ [CONFIGURACIÓN] Error guardando configuración:', error)
      alert('Error al guardar la configuración. Intenta nuevamente.')
    }
  }

  // Ultra-defensive: si session no está lista, devolver sector general vacío
  const getSectorInfo = (): SectorInfo => {
    if (!session) {
      return {
        nombre: 'General',
        descripcion: 'Sector general',
        riesgosEstructurales: [],
        riesgosRelacionales: [],
        riesgosOperativos: [],
        medidasPreventivas: []
      }
    }

    const sector = session.sector_code || session.tipoEntidad || 'general'

    const sectores: Record<string, SectorInfo> = {
      'club-deportivo': {
        nombre: 'Clubes Deportivos',
        descripcion: 'Los entornos deportivos presentan riesgos específicos derivados del contacto físico, la relación de autoridad y los espacios compartidos. Es fundamental establecer protocolos claros de prevención y actuación.',
        riesgosEstructurales: [
          'Vestuarios y duchas: espacios privados sin supervisión adecuada donde pueden darse situaciones de vulnerabilidad',
          'Instalaciones deportivas con zonas de acceso restringido o poco visibles',
          'Espacios durante competiciones o eventos donde la supervisión es más compleja',
          'Áreas de tratamiento médico o fisioterapia sin protocolos adecuados'
        ],
        riesgosRelacionales: [
          'Relación de poder entre entrenador/monitor y deportista, que puede generar dependencia emocional',
          'Contacto físico durante entrenamientos que puede normalizarse y utilizarse de forma inapropiada',
          'Comunicaciones privadas por redes sociales o mensajería sin conocimiento de las familias',
          'Relaciones afectivas inadecuadas entre personal adulto y menores deportistas'
        ],
        riesgosOperativos: [
          'Viajes y concentraciones fuera de las instalaciones habituales sin protocolos de supervisión',
          'Actividades en horarios inusuales (madrugadas, fines de semana) con menos presencia de familias',
          'Entrenamientos individualizados sin supervisión de terceros',
          'Falta de protocolos claros sobre el uso de imágenes de menores en competiciones',
          'Ausencia de canales de comunicación seguros para que los menores reporten situaciones de malestar'
        ],
        medidasPreventivas: [
          'Establecer protocolos de acompañamiento en vestuarios y espacios privados',
          'Implementar la regla de visibilidad: nunca un adulto a solas con un menor',
          'Crear códigos de conducta específicos para entrenadores, monitores y personal',
          'Establecer canales seguros de comunicación con menores y familias',
          'Formar a todo el personal en prevención de violencia y detección de señales de alerta',
          'Documentar todas las comunicaciones y actividades que involucren menores',
          'Obtener consentimiento informado de las familias para viajes, tratamientos médicos e imágenes'
        ]
      },
      'educacion': {
        nombre: 'Centros Educativos',
        descripcion: 'Los centros educativos son espacios donde los menores pasan gran parte de su tiempo. La relación de autoridad profesor-alumno, los espacios con supervisión limitada y las actividades extraescolares requieren protocolos específicos de protección.',
        riesgosEstructurales: [
          'Baños, pasillos y zonas de recreo con supervisión limitada',
          'Aulas o espacios cerrados durante tutorías individuales',
          'Espacios durante actividades extraescolares fuera del horario lectivo',
          'Instalaciones deportivas, bibliotecas o laboratorios con menos presencia de personal'
        ],
        riesgosRelacionales: [
          'Relación de autoridad profesor-alumno que puede generar dependencia o temor a denunciar',
          'Comunicaciones privadas por redes sociales, email o mensajería personal',
          'Trato diferencial o favoritismo hacia ciertos alumnos',
          'Comentarios o actitudes sexistas, racistas o discriminatorias normalizadas',
          'Acoso escolar entre iguales no detectado o mal gestionado'
        ],
        riesgosOperativos: [
          'Excursiones y viajes escolares sin protocolos claros de supervisión',
          'Actividades extraescolares en horarios donde hay menos personal presente',
          'Falta de protocolos sobre el uso de imágenes de menores en actividades escolares',
          'Ausencia de canales confidenciales para que los alumnos reporten situaciones de malestar',
          'Acceso a datos personales de menores sin medidas de protección adecuadas'
        ],
        medidasPreventivas: [
          'Implementar protocolos de supervisión en todos los espacios del centro',
          'Establecer la regla de puertas abiertas en tutorías individuales o visibilidad desde el exterior',
          'Crear códigos de conducta claros para todo el personal docente y no docente',
          'Formar a todo el personal en prevención, detección e intervención ante violencia',
          'Establecer canales confidenciales y seguros para que los alumnos puedan comunicar situaciones',
          'Protocolo de consentimiento informado para excursiones, imágenes y tratamiento de datos',
          'Supervisión activa durante recreos, entradas, salidas y actividades extraescolares'
        ]
      },
      'general': {
        nombre: 'Entornos Generales con Menores',
        descripcion: 'Cualquier entidad que trabaje con menores debe identificar y prevenir riesgos específicos de violencia. Esto incluye espacios de ocio, culturales, sociales o asistenciales donde interactúen adultos y menores.',
        riesgosEstructurales: [
          'Espacios sin supervisión adecuada o con baja visibilidad',
          'Zonas aisladas donde un adulto puede quedarse a solas con un menor',
          'Instalaciones sin protocolos claros de acceso y circulación de personas',
          'Falta de sistemas de registro y control de personal que trabaja con menores'
        ],
        riesgosRelacionales: [
          'Relaciones de confianza o autoridad que pueden generar dependencia emocional',
          'Comunicación privada sin conocimiento de las familias',
          'Falta de límites claros en la relación adulto-menor',
          'Trato diferencial, favoritismo o exclusión de ciertos menores',
          'Normalización de comentarios o actitudes inapropiadas'
        ],
        riesgosOperativos: [
          'Actividades individuales con menores sin supervisión de terceros',
          'Falta de protocolos sobre el uso y difusión de imágenes de menores',
          'Acceso no controlado a datos personales de menores',
          'Ausencia de canales seguros para que los menores comuniquen situaciones de malestar',
          'Falta de formación del personal en prevención y detección de violencia',
          'Actividades fuera de las instalaciones habituales sin protocolos de supervisión'
        ],
        medidasPreventivas: [
          'Aplicar la regla de visibilidad: evitar que un adulto esté a solas con un menor',
          'Establecer códigos de conducta claros para todo el personal y voluntarios',
          'Crear canales confidenciales y accesibles para que los menores reporten situaciones',
          'Formar a todo el personal en prevención, detección e intervención ante violencia',
          'Implementar protocolos de consentimiento informado para actividades, imágenes y datos',
          'Documentar y registrar todas las interacciones y actividades con menores',
          'Establecer sistemas de supervisión y revisión periódica de las actividades',
          'Garantizar la obtención del Certificado Negativo de Delitos Sexuales de todo el personal'
        ]
      }
    }

    return sectores[sector] || sectores['general']
  }

  // Ultra-defensive: no descargar si no hay session ni sectorInfo
  const descargarMapaRiesgos = () => {
    if (!mounted || loading || !session) return

    const sectorInfo = getSectorInfo()
    if (!sectorInfo) return

    try {
      const contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mapa de Riesgos - ${sectorInfo.nombre}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
    h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 10px; }
    h2 { color: #dc2626; margin-top: 30px; }
    h3 { color: #059669; margin-top: 20px; }
    .descripcion { background: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; }
    ul { margin-left: 20px; }
    li { margin: 10px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <h1>Mapa de Riesgos de Violencia Infantil</h1>
  <h2>Sector: ${sectorInfo.nombre}</h2>

  <div class="descripcion">
    <strong>Descripción del sector:</strong><br>
    ${sectorInfo.descripcion}
  </div>

  <h2>1. Riesgos Estructurales</h2>
  <p>Relacionados con las instalaciones y espacios físicos:</p>
  <ul>
    ${sectorInfo.riesgosEstructurales.map(r => `<li>${r}</li>`).join('')}
  </ul>

  <h2>2. Riesgos Relacionales</h2>
  <p>Derivados de las dinámicas y relaciones entre personas:</p>
  <ul>
    ${sectorInfo.riesgosRelacionales.map(r => `<li>${r}</li>`).join('')}
  </ul>

  <h2>3. Riesgos Operativos</h2>
  <p>Relacionados con actividades, procedimientos y protocolos:</p>
  <ul>
    ${sectorInfo.riesgosOperativos.map(r => `<li>${r}</li>`).join('')}
  </ul>

  <h3>Medidas Preventivas Recomendadas</h3>
  <ul>
    ${sectorInfo.medidasPreventivas.map(m => `<li>${m}</li>`).join('')}
  </ul>

  <div class="footer">
    <strong>Documento generado por Custodia360</strong><br>
    Entidad: ${session.entidad || 'N/A'}<br>
    Delegado/a: ${session.nombre || 'N/A'}<br>
    Fecha: ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}<br>
    <br>
    Este mapa de riesgos ha sido elaborado conforme a la Ley Orgánica 8/2021 (LOPIVI)<br>
    para la protección integral de los menores frente a la violencia.
  </div>
</body>
</html>
      `
      const blob = new Blob([contenidoHTML], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mapa-riesgos-${sectorInfo.nombre.toLowerCase().replace(/\s+/g, '-')}-${(session.entidad || 'entidad').toLowerCase().replace(/\s+/g, '-')}.html`
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 100)
    } catch (error) {
      alert('No se pudo descargar el mapa de riesgos.')
    }
  }

  // GUARDS: No renderizar nada hasta que esté montado y session lista
  if (!mounted || loading || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const sectorInfo = getSectorInfo()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Paso {currentStep} de 4
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((currentStep / 4) * 100)}% completado
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              Configuración del Sistema
            </CardTitle>
            <CardDescription>
              Completa estos 4 pasos para activar tu panel de delegado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Paso 1: Configura el Canal de Comunicación
                  </h3>
                  <p className="text-gray-600 mb-6">
                    ¿Qué canal vas a utilizar para comunicarte con los menores y las familias?
                  </p>
                </div>

                <RadioGroup value={canalComunicacion} onValueChange={setCanalComunicacion}>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="whatsapp" id="whatsapp" />
                        <Label htmlFor="whatsapp" className="flex-1 cursor-pointer">
                          <span className="font-semibold">WhatsApp</span>
                          <p className="text-sm text-gray-600">Grupo de WhatsApp para comunicación</p>
                        </Label>
                      </div>
                      {canalComunicacion === 'whatsapp' && (
                        <div className="mt-3 ml-8">
                          <Label htmlFor="telefonoWhatsApp" className="text-sm">Número de teléfono</Label>
                          <Input
                            id="telefonoWhatsApp"
                            type="tel"
                            placeholder="+34 600 000 000"
                            value={telefonoWhatsApp}
                            onChange={(e) => setTelefonoWhatsApp(e.target.value)}
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Este número se usará para el canal de comunicación oficial
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email" className="flex-1 cursor-pointer">
                          <span className="font-semibold">Email</span>
                          <p className="text-sm text-gray-600">Comunicación por correo electrónico</p>
                        </Label>
                      </div>
                      {canalComunicacion === 'email' && (
                        <div className="mt-3 ml-8">
                          <Label htmlFor="emailCanal" className="text-sm">Dirección de email</Label>
                          <Input
                            id="emailCanal"
                            type="email"
                            placeholder="canal@entidad.com"
                            value={emailCanal}
                            onChange={(e) => setEmailCanal(e.target.value)}
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Este email se usará para el canal de comunicación oficial
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                      <RadioGroupItem value="no-tengo" id="no-tengo" />
                      <Label htmlFor="no-tengo" className="flex-1 cursor-pointer">
                        <span className="font-semibold">Aún no tengo canal configurado</span>
                        <p className="text-sm text-gray-600">Tendré 30 días para configurarlo en mi panel</p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {canalComunicacion === 'no-tengo' && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <p className="text-sm text-yellow-900">
                      <strong>Importante:</strong> Deberás configurar tu canal de comunicación en los próximos 30 días
                      desde tu panel de delegado. Este canal es esencial para la comunicación con menores y familias.
                    </p>
                  </div>
                )}

                {(canalComunicacion === 'whatsapp' || canalComunicacion === 'email') && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-900">
                      <strong>Importante:</strong> Este canal se guardará en la configuración de tu entidad y
                      podrás ver los mensajes en la sección "Canal de Comunicación" de tu panel de delegado.
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Paso 2: Link para Datos de Miembros
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comparte este link con todo el personal de la entidad para que registren sus datos
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-blue-900 mb-2">
                    <strong>Tu link de onboarding:</strong>
                  </p>
                  <div className="flex items-center gap-3">
                    <Input
                      value={linkMiembros}
                      readOnly
                      className="bg-white font-mono text-sm"
                    />
                    <Button
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.clipboard) {
                          navigator.clipboard.writeText(linkMiembros)
                          alert('Link copiado al portapapeles')
                        }
                      }}
                      variant="outline"
                    >
                      Copiar
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-gray-900">Cómo usar este link:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>1. Copia el link usando el botón Copiar</li>
                    <li>2. Envíalo por email, WhatsApp o tu canal de comunicación</li>
                    <li>3. Cada persona registrará sus datos personales</li>
                    <li>4. Todos quedarán vinculados a tu entidad automáticamente</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">
                    <strong>Importante:</strong> Este link es único para tu entidad.
                    No lo compartas públicamente, solo con el personal autorizado.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Paso 3: Mapa de Riesgos de tu Sector
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Lee atentamente el mapa de riesgos completo para: <strong>{sectorInfo.nombre}</strong>
                  </p>
                </div>

                <div className="border-2 border-red-500 rounded-lg p-6 bg-red-50 max-h-96 overflow-y-auto">
                  <h4 className="text-lg font-bold text-red-900 mb-4">
                    MAPA DE RIESGOS: {sectorInfo.nombre}
                  </h4>

                  <div className="bg-white rounded p-4 mb-4">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {sectorInfo.descripcion}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h5 className="font-bold text-red-900 mb-2 text-base">
                        1. RIESGOS ESTRUCTURALES
                      </h5>
                      <p className="text-sm text-gray-700 mb-2 italic">
                        Relacionados con las instalaciones y espacios físicos:
                      </p>
                      <ul className="space-y-2">
                        {sectorInfo.riesgosEstructurales.map((riesgo, index) => (
                          <li key={index} className="text-red-800 text-sm flex items-start bg-white rounded p-2">
                            <span className="text-red-600 mr-2 font-bold min-w-[20px]">{index + 1}.</span>
                            <span>{riesgo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-bold text-red-900 mb-2 text-base">
                        2. RIESGOS RELACIONALES
                      </h5>
                      <p className="text-sm text-gray-700 mb-2 italic">
                        Derivados de las dinámicas y relaciones entre personas:
                      </p>
                      <ul className="space-y-2">
                        {sectorInfo.riesgosRelacionales.map((riesgo, index) => (
                          <li key={index} className="text-red-800 text-sm flex items-start bg-white rounded p-2">
                            <span className="text-red-600 mr-2 font-bold min-w-[20px]">{index + 1}.</span>
                            <span>{riesgo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-bold text-red-900 mb-2 text-base">
                        3. RIESGOS OPERATIVOS
                      </h5>
                      <p className="text-sm text-gray-700 mb-2 italic">
                        Relacionados con actividades, procedimientos y protocolos:
                      </p>
                      <ul className="space-y-2">
                        {sectorInfo.riesgosOperativos.map((riesgo, index) => (
                          <li key={index} className="text-red-800 text-sm flex items-start bg-white rounded p-2">
                            <span className="text-red-600 mr-2 font-bold min-w-[20px]">{index + 1}.</span>
                            <span>{riesgo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-green-50 border-2 border-green-600 rounded p-4">
                      <h5 className="font-bold text-green-900 mb-2 text-base">
                        MEDIDAS PREVENTIVAS RECOMENDADAS
                      </h5>
                      <ul className="space-y-2">
                        {sectorInfo.medidasPreventivas.map((medida, index) => (
                          <li key={index} className="text-green-800 text-sm flex items-start">
                            <span className="text-green-600 mr-2 font-bold min-w-[20px]">✓</span>
                            <span>{medida}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={descargarMapaRiesgos}
                  variant="outline"
                  className="w-full border-red-500 text-red-700 hover:bg-red-50"
                >
                  Descargar Mapa de Riesgos Completo (HTML)
                </Button>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Tu responsabilidad como Delegado/a:</h4>
                  <p className="text-sm text-gray-700">
                    Como Delegado/a de Protección, debes conocer en profundidad estos riesgos,
                    estar atento/a a las situaciones descritas y aplicar los protocolos de
                    prevención y actuación que has aprendido en la formación LOPIVI.
                  </p>
                </div>

                <div className="flex items-center space-x-3 border-2 border-blue-500 rounded-lg p-4 bg-white">
                  <input
                    type="checkbox"
                    id="mapaLeido"
                    checked={mapaLeido}
                    onChange={(e) => setMapaLeido(e.target.checked)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <Label htmlFor="mapaLeido" className="cursor-pointer">
                    <span className="font-semibold">
                      He leído y comprendido el mapa de riesgos completo de mi sector
                    </span>
                  </Label>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Paso 4: Certificado de Delitos Sexuales
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Certifica la entrega de tu certificado negativo del Registro Central de Delincuentes Sexuales
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <h4 className="font-semibold text-purple-900 mb-3">
                    Requisito legal LOPIVI
                  </h4>
                  <p className="text-purple-800 text-sm mb-3">
                    La Ley Orgánica 8/2021 (LOPIVI) establece que <strong>todas las personas que trabajen
                    con menores</strong> deben aportar el <strong>Certificado Negativo del Registro Central
                    de Delincuentes Sexuales</strong>.
                  </p>
                  <p className="text-purple-700 text-sm">
                    Este certificado acredita que no has sido condenado/a por delitos contra la libertad
                    e indemnidad sexual, ni por trata de seres humanos.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="font-semibold text-blue-900 mb-3">
                    Cómo obtener el Certificado de Delitos Sexuales
                  </h4>

                  <div className="space-y-4 text-sm text-blue-900">
                    <div>
                      <p className="font-semibold mb-2">1. ONLINE (Recomendado - Inmediato):</p>
                      <ul className="ml-4 space-y-1 text-blue-800">
                        <li>• Accede a la Sede Electrónica del Ministerio de Justicia</li>
                        <li>• URL: <a href="https://sede.mjusticia.gob.es" target="_blank" rel="noopener noreferrer" className="underline font-semibold">sede.mjusticia.gob.es</a></li>
                        <li>• Necesitas: Certificado digital, DNI electrónico o Cl@ve</li>
                        <li>• Se expide al instante en formato PDF</li>
                        <li>• Es completamente GRATUITO</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold mb-2">2. PRESENCIAL:</p>
                      <ul className="ml-4 space-y-1 text-blue-800">
                        <li>• Acude a cualquier oficina del Registro Civil</li>
                        <li>• Lleva tu DNI original</li>
                        <li>• Rellena el formulario en el momento</li>
                        <li>• Se expide en el acto (normalmente 10-15 minutos)</li>
                        <li>• Es completamente GRATUITO</li>
                      </ul>
                    </div>

                    <div className="bg-white rounded p-3 border border-blue-300">
                      <p className="font-semibold text-blue-900 mb-1">Datos importantes:</p>
                      <ul className="ml-4 space-y-1 text-blue-800">
                        <li>• <strong>Vigencia:</strong> 3 meses desde la fecha de expedición</li>
                        <li>• <strong>Coste:</strong> Totalmente GRATUITO</li>
                        <li>• <strong>Tiempo:</strong> Inmediato (online) o 10-15 min (presencial)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-300 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Estado de tu Certificado de Delitos Sexuales:
                  </h4>

                  <RadioGroup value={opcionCertificado} onValueChange={setOpcionCertificado}>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 border-2 border-green-500 rounded-lg p-4 bg-green-50">
                        <RadioGroupItem value="entregado" id="entregado" className="mt-1" />
                        <Label htmlFor="entregado" className="flex-1 cursor-pointer">
                          <span className="font-semibold text-green-900 block mb-1">
                            Ya he entregado mi certificado a la entidad
                          </span>
                          <p className="text-sm text-green-700">
                            He obtenido el certificado y lo he entregado a la dirección de mi entidad
                          </p>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3 border-2 border-yellow-500 rounded-lg p-4 bg-yellow-50">
                        <RadioGroupItem value="mas-adelante" id="mas-adelante" className="mt-1" />
                        <Label htmlFor="mas-adelante" className="flex-1 cursor-pointer">
                          <span className="font-semibold text-yellow-900 block mb-1">
                            Lo entregaré más adelante (30 días)
                          </span>
                          <p className="text-sm text-yellow-700">
                            Aún no tengo el certificado pero me comprometo a obtenerlo y entregarlo
                            en los próximos 30 días desde mi panel de delegado
                          </p>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {opcionCertificado === 'mas-adelante' && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-sm text-red-900 mb-2">
                      <strong>Advertencia importante:</strong>
                    </p>
                    <ul className="text-sm text-red-800 space-y-1 ml-4">
                      <li>• Tendrás 30 días desde hoy para obtener y entregar el certificado</li>
                      <li>• Deberás confirmar la entrega desde la sección "Certificado de Penales" en tu panel</li>
                      <li>• Si no entregas el certificado en 30 días, tu panel de delegado quedará bloqueado</li>
                      <li>• Solo podrás acceder para confirmar que has entregado el certificado</li>
                    </ul>
                  </div>
                )}

                {opcionCertificado === 'entregado' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-900">
                      <strong>Perfecto!</strong> Has completado todos los requisitos. Al finalizar,
                      podrás acceder a tu panel de delegado y empezar a utilizar todas las
                      funcionalidades de Custodia360.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-6 border-t">
              {currentStep > 1 && (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="flex-1"
                >
                  Anterior
                </Button>
              )}

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={!opcionCertificado}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Finalizar y Acceder al Panel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
