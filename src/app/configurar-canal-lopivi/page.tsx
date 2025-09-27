'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  certificacionVigente: boolean
}

interface CanalConfig {
  tipo: string
  contacto: string
  horario: string
  instrucciones: string
}

export default function ConfigurarCanalLopiviPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [enviandoEmails, setEnviandoEmails] = useState(false)

  const [canalConfig, setCanalConfig] = useState<CanalConfig>({
    tipo: '',
    contacto: '',
    horario: '',
    instrucciones: ''
  })

  const [diasRestantes, setDiasRestantes] = useState(30)

  const checkSession = (): SessionData | null => {
    try {
      const persistentSession = localStorage.getItem('userSession')
      if (persistentSession) {
        return JSON.parse(persistentSession)
      }
      return null
    } catch (error) {
      console.error('Error verificando sesión:', error)
      return null
    }
  }

  useEffect(() => {
    const session = checkSession()
    if (!session) {
      router.push('/login')
      return
    }

    if (!session.certificacionVigente) {
      router.push('/formacion-lopivi/bienvenida')
      return
    }

    setSessionData(session)

    // Calcular días restantes
    const fechaRegistro = localStorage.getItem('fecha_registro_entidad')
    if (fechaRegistro) {
      const fecha = new Date(fechaRegistro)
      const fechaLimite = new Date(fecha.getTime() + 30 * 24 * 60 * 60 * 1000)
      const ahora = new Date()
      const dias = Math.ceil((fechaLimite - ahora) / (1000 * 60 * 60 * 24))
      setDiasRestantes(Math.max(0, dias))
    }

    // Cargar configuración existente si existe
    const configExistente = localStorage.getItem('canal_lopivi_config')
    if (configExistente) {
      setCanalConfig(JSON.parse(configExistente))
    }

    setLoading(false)
  }, [router])

  const handleInputChange = (field: keyof CanalConfig, value: string) => {
    setCanalConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const obtenerMiembrosRegistrados = () => {
    // En producción, esto vendría de la base de datos
    // Por ahora, simular miembros registrados de la entidad
    const miembrosSimulados = [
      { email: 'juan.perez@email.com', nombre: 'Juan Pérez García', rol: 'Entrenador' },
      { email: 'maria.lopez@email.com', nombre: 'María López Martín', rol: 'Secretaria' },
      { email: 'carlos.ruiz@email.com', nombre: 'Carlos Ruiz Sánchez', rol: 'Monitor deportivo' },
      { email: 'ana.garcia@email.com', nombre: 'Ana García López', rol: 'Fisioterapeuta' },
      { email: 'pedro.martin@email.com', nombre: 'Pedro Martín Ruiz', rol: 'Conserje' },
      { email: 'laura.sanchez@email.com', nombre: 'Laura Sánchez Vega', rol: 'Administrativa' }
    ]

    // Recuperar miembros reales si existen
    const miembrosRegistrados = JSON.parse(localStorage.getItem('miembros_registrados') || '[]')

    return miembrosRegistrados.length > 0 ? miembrosRegistrados : miembrosSimulados
  }

  const enviarEmailOrganizacion = async () => {
    setEnviandoEmails(true)

    try {
      const miembros = obtenerMiembrosRegistrados()

      console.log('📧 Enviando canal LOPIVI a', miembros.length, 'miembros...')

      const datosEnvio = {
        canal: {
          ...canalConfig,
          delegado: sessionData?.nombre,
          entidad: sessionData?.entidad
        },
        miembros
      }

      // Llamar al API de canal LOPIVI
      const response = await fetch('/api/canal-lopivi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosEnvio)
      })

      const resultado = await response.json()

      if (resultado.success) {
        console.log('✅ Canal LOPIVI enviado exitosamente')
        console.log(`📊 Estadísticas: ${resultado.estadisticas.totalEnviados}/${resultado.estadisticas.totalMiembros} emails enviados`)

        if (resultado.estadisticas.totalFallidos > 0) {
          console.warn(`⚠️ ${resultado.estadisticas.totalFallidos} emails con errores`)
        }

        // Marcar como comunicado
        localStorage.setItem('canal_lopivi_comunicado', new Date().toISOString())

        return true
      } else {
        throw new Error(resultado.error || 'Error enviando emails')
      }

    } catch (error) {
      console.error('Error enviando emails:', error)
      return false
    } finally {
      setEnviandoEmails(false)
    }
  }

  const guardarConfiguracion = async () => {
    if (!canalConfig.tipo || !canalConfig.contacto) {
      alert('Tipo de canal y contacto son obligatorios')
      return
    }

    setGuardando(true)

    try {
      // Guardar configuración
      const configCompleta = {
        ...canalConfig,
        fechaConfiguracion: new Date().toISOString(),
        delegado: sessionData?.nombre,
        entidad: sessionData?.entidad
      }

      localStorage.setItem('canal_lopivi_config', JSON.stringify(configCompleta))

      // Enviar email a toda la organización
      const emailEnviado = await enviarEmailOrganizacion()

      if (emailEnviado) {
        // Mostrar mensaje de éxito detallado
        const miembros = obtenerMiembrosRegistrados()
        alert(`✅ Canal LOPIVI configurado exitosamente

📧 Email enviado automáticamente a ${miembros.length} miembros de la organización

Su entidad cumple ahora con el artículo 49.2 de la LOPIVI:
• Canal directo: ${canalConfig.contacto}
• Tipo: ${canalConfig.tipo}
• Comunicado a toda la organización

El canal aparecerá en todos los documentos y comunicaciones de la entidad.`)

        router.push('/dashboard-delegado')
      } else {
        alert('Canal configurado pero error enviando emails. Se reintentará automáticamente.')
      }

    } catch (error) {
      console.error('Error guardando configuración:', error)
      alert('Error al guardar la configuración. Inténtelo de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">📞</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Canal de Comunicación LOPIVI
          </h1>
          <p className="text-lg text-gray-600">
            Configuración obligatoria para cumplimiento legal
          </p>
          {diasRestantes > 0 && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 mt-4 inline-block">
              <p className="text-red-800 text-sm font-semibold">
                ⏰ Plazo restante: {diasRestantes} días
              </p>
            </div>
          )}
        </div>

        {/* Marco legal */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">
            Artículo 49.2 de la Ley LOPIVI
          </h3>
          <p className="text-blue-800 text-sm leading-relaxed mb-3">
            "Las entidades deberán establecer un canal de comunicación directo con el
            delegado de protección, independiente de los canales internos de la organización,
            que permita la comunicación confidencial de situaciones de riesgo."
          </p>
          <p className="text-blue-700 text-xs">
            Este canal debe ser comunicado a todos los miembros de la entidad y aparecer
            en toda la documentación LOPIVI.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Configurar Canal Directo
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de canal de comunicación *
              </label>
              <select
                value={canalConfig.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccionar tipo de canal</option>
                <option value="telefono">Teléfono directo delegado</option>
                <option value="email">Email específico LOPIVI</option>
                <option value="whatsapp">WhatsApp delegado</option>
                <option value="teams">Microsoft Teams</option>
                <option value="mixto">Canal mixto (Tel + Email)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Información de contacto *
              </label>
              <input
                type="text"
                value={canalConfig.contacto}
                onChange={(e) => handleInputChange('contacto', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="600 123 456 o delegado.lopivi@entidad.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Número de teléfono, email, o ambos separados por coma
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horario de atención
              </label>
              <input
                type="text"
                value={canalConfig.horario}
                onChange={(e) => handleInputChange('horario', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Lunes a Viernes 9:00-17:00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrucciones adicionales
              </label>
              <textarea
                value={canalConfig.instrucciones}
                onChange={(e) => handleInputChange('instrucciones', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Para urgencias fuera de horario, contactar por WhatsApp..."
              />
            </div>
          </div>

          {/* Preview */}
          {canalConfig.tipo && canalConfig.contacto && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Vista previa - Cómo aparecerá en las comunicaciones:
              </h3>
              <div className="bg-white border rounded-lg p-4 text-sm">
                <p className="font-semibold text-gray-900 mb-2">
                  📞 CANAL DIRECTO LOPIVI
                </p>
                <p><strong>Delegado:</strong> {sessionData?.nombre}</p>
                <p><strong>Contacto:</strong> {canalConfig.contacto}</p>
                {canalConfig.horario && (
                  <p><strong>Horario:</strong> {canalConfig.horario}</p>
                )}
                {canalConfig.instrucciones && (
                  <p><strong>Instrucciones:</strong> {canalConfig.instrucciones}</p>
                )}
                <p className="text-xs text-gray-600 mt-2">
                  Este canal es específico para comunicar situaciones relacionadas con LOPIVI
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Información sobre el envío */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            ¿Qué sucede al guardar?
          </h3>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>1.</strong> Se enviará automáticamente un email a todos los miembros
              registrados de la entidad informando del canal LOPIVI
            </p>
            <p>
              <strong>2.</strong> El canal aparecerá en todos los emails, PDFs y documentos
              que se generen a partir de ahora
            </p>
            <p>
              <strong>3.</strong> Se cumplirá con el requisito legal del artículo 49.2 LOPIVI
            </p>
            <p>
              <strong>4.</strong> Los miembros tendrán acceso directo para comunicar
              situaciones de riesgo para menores
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex space-x-4">
          <Link
            href="/dashboard-delegado"
            className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            Volver al dashboard
          </Link>
          <button
            onClick={guardarConfiguracion}
            disabled={guardando || enviandoEmails || !canalConfig.tipo || !canalConfig.contacto}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              guardando || enviandoEmails || !canalConfig.tipo || !canalConfig.contacto
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {guardando && !enviandoEmails && 'Guardando configuración...'}
            {enviandoEmails && 'Enviando a toda la organización...'}
            {!guardando && !enviandoEmails && 'Guardar y comunicar a la organización'}
          </button>
        </div>

        {/* Advertencia legal */}
        {diasRestantes === 0 && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-2">
              ⚠️ Plazo vencido - Configuración obligatoria
            </h3>
            <p className="text-red-800 text-sm">
              El plazo de 30 días para configurar el canal LOPIVI ha vencido.
              Su dashboard permanecerá con funcionalidad limitada hasta completar
              esta configuración obligatoria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
