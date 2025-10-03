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

export default function RegistroEntidadPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [configurando, setConfigurando] = useState(false)
  const [linkGenerado, setLinkGenerado] = useState('')
  const [paso, setPaso] = useState(1)

  const [entidadConfig, setEntidadConfig] = useState({
    nombreCompleto: '',
    tipoEntidad: '',
    email: '',
    telefono: ''
  })

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
      router.push('/selector-entidad')
      return
    }

    setSessionData(session)
    setEntidadConfig({
      nombreCompleto: session.entidad || '',
      tipoEntidad: '',
      email: session.email || '',
      telefono: ''
    })
    setLoading(false)
  }, [router])

  const generarLinkRegistro = async () => {
    if (!sessionData) return

    setConfigurando(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const linkUnico = `https://custodia360.com/registro/${sessionData.entidad.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 9)}`
      setLinkGenerado(linkUnico)

      const configuracion = {
        entidadId: sessionData.id,
        delegadoId: sessionData.id,
        nombreEntidad: entidadConfig.nombreCompleto,
        tipoEntidad: entidadConfig.tipoEntidad,
        linkRegistro: linkUnico,
        fechaCreacion: new Date().toISOString(),
        estado: 'activo'
      }

      localStorage.setItem(`config_entidad_${sessionData.id}`, JSON.stringify(configuracion))

      setPaso(2)

    } catch (error) {
      console.error('Error generando link:', error)
      alert('Error al generar el link. Por favor, inténtelo de nuevo.')
    } finally {
      setConfigurando(false)
    }
  }

  const continuarAlDashboard = () => {
    localStorage.setItem('registro_configurado', 'true')
    router.push('/dashboard-delegado')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <p className="text-gray-600">Verificando certificación...</p>
        </div>
      </div>
    )
  }

  if (paso === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Felicidades, {sessionData?.nombre}
            </h1>
            <p className="text-lg text-gray-600">
              Ya es {sessionData?.tipo === 'principal' ? 'Delegado Principal' : 'Delegado Suplente'} certificado
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Comunicar a toda la entidad
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Siguiente paso obligatorio
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                {entidadConfig.nombreCompleto} ha iniciado el proceso para ser una entidad
                cumplidora de LOPIVI y tener su Plan de Protección. Todos los miembros deben
                registrarse y completar la formación correspondiente según su rol.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo de la entidad *
                </label>
                <input
                  type="text"
                  value={entidadConfig.nombreCompleto}
                  onChange={(e) => setEntidadConfig({...entidadConfig, nombreCompleto: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Club Deportivo San Fernando"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de entidad *
                </label>
                <select
                  value={entidadConfig.tipoEntidad}
                  onChange={(e) => setEntidadConfig({...entidadConfig, tipoEntidad: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="deportivo">Club deportivo</option>
                  <option value="educativo">Centro educativo</option>
                  <option value="religioso">Organización religiosa</option>
                  <option value="ocio">Centro de ocio y tiempo libre</option>
                  <option value="cultural">Asociación cultural</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de contacto *
                </label>
                <input
                  type="email"
                  value={entidadConfig.email}
                  onChange={(e) => setEntidadConfig({...entidadConfig, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="delegado@entidad.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de contacto *
                </label>
                <input
                  type="tel"
                  value={entidadConfig.telefono}
                  onChange={(e) => setEntidadConfig({...entidadConfig, telefono: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="600 123 456"
                />
              </div>
            </div>

            <button
              onClick={generarLinkRegistro}
              disabled={configurando || !entidadConfig.nombreCompleto || !entidadConfig.tipoEntidad || !entidadConfig.email || !entidadConfig.telefono}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                configurando || !entidadConfig.nombreCompleto || !entidadConfig.tipoEntidad || !entidadConfig.email || !entidadConfig.telefono
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {configurando ? 'Generando enlace de registro...' : 'Generar enlace de registro'}
            </button>
          </div>

          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Marco legal - Ley Orgánica 8/2021 (LOPIVI)
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                Todas las entidades que desarrollan actividades con menores deben designar
                delegado de protección y establecer un plan de protección.
              </p>
              <p>
                Todo el personal debe recibir formación específica en protección de menores
                según su nivel de contacto.
              </p>
              <p>
                Es obligatorio disponer de certificados de antecedentes penales actualizados
                para todo el personal.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enlace de registro generado
          </h1>
          <p className="text-lg text-gray-600">
            Su entidad está lista para el proceso de cumplimiento LOPIVI
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Mensaje para enviar a todos los miembros
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-4">
              Copie y envíe este mensaje por email o WhatsApp:
            </h3>
            <div className="bg-white border rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
              <p className="mb-3">
                <strong>Asunto:</strong> IMPORTANTE - Cumplimiento LOPIVI - Acción requerida - {entidadConfig.nombreCompleto}
              </p>
              <div className="border-t pt-3">
                <p className="mb-3">Estimado miembro de {entidadConfig.nombreCompleto},</p>

                <p className="mb-3">
                  Como miembro de nuestra entidad, necesitamos su colaboración para cumplir con la
                  Ley Orgánica 8/2021 de Protección Integral a la Infancia y la Adolescencia (LOPIVI).
                </p>

                <p className="mb-3">
                  <strong>ENLACE DE REGISTRO:</strong>
                  <span className="bg-yellow-100 px-2 py-1 rounded font-mono text-xs break-all">
                    {linkGenerado}
                  </span>
                </p>

                <p className="mb-3">Este proceso es:</p>
                <p className="mb-1">- Obligatorio por ley para nuestra entidad</p>
                <p className="mb-1">- Completamente confidencial y seguro</p>
                <p className="mb-1">- Necesario para mantener nuestra actividad con menores</p>
                <p className="mb-3">- Estimado en 5 minutos de duración</p>

                <p className="mb-3">
                  <strong>PLAZO LIMITE:</strong> {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('es-ES')}
                </p>

                <p className="mb-3">
                  Si tiene dudas sobre este proceso, puede contactar conmigo directamente.
                </p>

                <p className="mb-1">Atentamente,</p>
                <p className="mb-1"><strong>{sessionData?.nombre}</strong></p>
                <p className="mb-1">{sessionData?.tipo === 'principal' ? 'Delegado Principal' : 'Delegado Suplente'} de Protección</p>
                <p className="mb-1">{entidadConfig.nombreCompleto}</p>
                <p className="mb-1">Email: {entidadConfig.email}</p>
                <p className="mb-3">Teléfono: {entidadConfig.telefono}</p>

                <div className="border-t pt-2 text-xs text-gray-600">
                  <p>Este mensaje ha sido enviado en cumplimiento de la LOPIVI</p>
                  <p>Custodia360 - Sistema de Gestión LOPIVI</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigator.clipboard.writeText(linkGenerado)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Copiar enlace de registro
            </button>

            <button
              onClick={() => {
                const mensaje = `Asunto: IMPORTANTE - Cumplimiento LOPIVI - Acción requerida - ${entidadConfig.nombreCompleto}

Estimado miembro de ${entidadConfig.nombreCompleto},

Como miembro de nuestra entidad, necesitamos su colaboración para cumplir con la Ley Orgánica 8/2021 de Protección Integral a la Infancia y la Adolescencia (LOPIVI).

ENLACE DE REGISTRO: ${linkGenerado}

Este proceso es:
- Obligatorio por ley para nuestra entidad
- Completamente confidencial y seguro
- Necesario para mantener nuestra actividad con menores
- Estimado en 5 minutos de duración

PLAZO LIMITE: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('es-ES')}

Si tiene dudas sobre este proceso, puede contactar conmigo directamente.

Atentamente,

${sessionData?.nombre}
${sessionData?.tipo === 'principal' ? 'Delegado Principal' : 'Delegado Suplente'} de Protección
${entidadConfig.nombreCompleto}
Email: ${entidadConfig.email}
Teléfono: ${entidadConfig.telefono}

---
Este mensaje ha sido enviado en cumplimiento de la LOPIVI
Custodia360 - Sistema de Gestión LOPIVI`

                navigator.clipboard.writeText(mensaje)
                alert('Mensaje completo copiado al portapapeles')
              }}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Copiar mensaje completo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Instrucciones de envío
          </h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>1.</strong> Copie el mensaje completo usando el botón verde</p>
            <p><strong>2.</strong> Envíelo por email a todos los miembros de su entidad</p>
            <p><strong>3.</strong> También puede enviarlo por WhatsApp si lo prefiere</p>
            <p><strong>4.</strong> Los miembros recibirán formación automática tras registrarse</p>
            <p><strong>5.</strong> Podrá seguir el progreso desde su dashboard</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={continuarAlDashboard}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continuar al Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
