'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface InstructionsChecklistProps {
  onComplete?: () => void
}

export function InstructionsChecklist({ onComplete }: InstructionsChecklistProps) {
  const router = useRouter()
  const [expandedSection, setExpandedSection] = useState<number | null>(null)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleStartConfiguration = () => {
    if (dontShowAgain) {
      localStorage.setItem('instrucciones_vistas', 'true')
    }
    router.push('/delegado/configuracion-inicial')
  }

  const handleGoToPanel = () => {
    if (dontShowAgain) {
      localStorage.setItem('instrucciones_vistas', 'true')
    }
    if (onComplete) onComplete()
    router.push('/dashboard-delegado')
  }

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index)
  }

  const sections = [
    {
      icon: '⚙️',
      title: 'PASO OBLIGATORIO: Completar Configuración (30 días)',
      priority: 'high',
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold mb-2">⚠️ IMPORTANTE: Tienes 30 días para completar estos 4 pasos obligatorios</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-gray-900">1. Configurar canal de comunicación oficial</p>
                <p className="text-sm text-gray-600">Email o teléfono que aparecerá en todos los documentos LOPIVI de tu entidad</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-gray-900">2. Generar enlace de onboarding</p>
                <p className="text-sm text-gray-600">Enlace único que enviarás a todos los miembros de tu entidad</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-gray-900">3. Leer y confirmar mapa de riesgos</p>
                <p className="text-sm text-gray-600">Documento específico para tu tipo de entidad con casos prácticos</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold text-gray-900">4. Confirmar entrega de certificado de penales</p>
                <p className="text-sm text-gray-600">Marcar que has entregado tu certificado negativo de delitos sexuales</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartConfiguration}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 font-bold text-lg"
          >
            IR A CONFIGURACIÓN AHORA
          </button>
        </div>
      )
    },
    {
      icon: '👥',
      title: 'Enviar Enlace a Miembros de tu Entidad',
      priority: 'medium',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Una vez configurado el canal, debes enviar el enlace de onboarding a:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Personal con Contacto</h4>
              <p className="text-sm text-blue-800">Entrenadores, monitores, educadores</p>
              <p className="text-xs text-blue-700 mt-2">Completarán: datos + mini-test + penales</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Personal sin Contacto</h4>
              <p className="text-sm text-green-800">Administrativos, limpieza, mantenimiento</p>
              <p className="text-xs text-green-700 mt-2">Completarán: solo datos básicos</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Familias/Tutores</h4>
              <p className="text-sm text-purple-800">Padres y tutores de menores</p>
              <p className="text-xs text-purple-700 mt-2">Completarán: datos + info de hijos</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">Directiva</h4>
              <p className="text-sm text-orange-800">Dirección, junta directiva</p>
              <p className="text-xs text-orange-700 mt-2">Completarán: datos + penales</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              💡 <strong>Consejo:</strong> El enlace es único para tu entidad y cada persona elegirá su rol al acceder.
              Puedes enviarlo por email, WhatsApp o cualquier canal que uses habitualmente.
            </p>
          </div>
        </div>
      )
    },
    {
      icon: '🚨',
      title: 'Gestión de Casos (Urgentes y Normales)',
      priority: 'medium',
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">Casos Urgentes</h4>
            <p className="text-sm text-red-800 mb-3">Si detectas una situación grave que requiere atención inmediata:</p>
            <ol className="list-decimal list-inside text-sm text-red-700 space-y-2">
              <li>Haz clic en el botón <strong>"Caso Urgente"</strong> (esquina superior derecha del panel)</li>
              <li>Rellena el formulario con todos los detalles posibles</li>
              <li>El sistema notificará automáticamente a Servicios Sociales y registrará el caso</li>
              <li>Recibirás confirmación inmediata por email</li>
            </ol>
            <p className="text-xs text-red-600 mt-3">⚠️ Si existe riesgo inminente, contacta también con 112</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Casos Normales</h4>
            <p className="text-sm text-blue-800 mb-3">Para situaciones que requieren seguimiento pero no son urgentes:</p>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-2">
              <li>Desde el panel, sección "Gestión de Casos"</li>
              <li>Crear nuevo caso con descripción y prioridad</li>
              <li>Hacer seguimiento desde la misma sección</li>
              <li>Cerrar el caso cuando esté resuelto</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      icon: '📧',
      title: 'Comunicación con Miembros',
      priority: 'low',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Desde la sección "Comunicación" del panel puedes:</p>

          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-xl">📄</span>
              <div>
                <p className="font-semibold text-gray-900">Enviar Documentos LOPIVI</p>
                <p className="text-sm text-gray-600">Protocolos, códigos de conducta, guías a personal o familias</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-xl">🔔</span>
              <div>
                <p className="font-semibold text-gray-900">Recordatorios Automáticos</p>
                <p className="text-sm text-gray-600">Formación pendiente, certificados por renovar, deadlines</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-xl">📝</span>
              <div>
                <p className="font-semibold text-gray-900">Plantillas Personalizables</p>
                <p className="text-sm text-gray-600">Usa plantillas predefinidas o crea las tuyas propias</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-xl">📱</span>
              <div>
                <p className="font-semibold text-gray-900">Email y WhatsApp</p>
                <p className="text-sm text-gray-600">Elige el canal más adecuado para cada comunicación</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: '📚',
      title: 'Biblioteca LOPIVI',
      priority: 'low',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Tu biblioteca personal de documentos oficiales LOPIVI:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-900">Protocolos por Tipo de Entidad</p>
              <p className="text-sm text-gray-600">Específicos para tu sector</p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-900">Códigos de Conducta</p>
              <p className="text-sm text-gray-600">Para personal y menores</p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-900">Guías de Actuación</p>
              <p className="text-sm text-gray-600">Paso a paso para cada situación</p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-900">Plantillas Editables</p>
              <p className="text-sm text-gray-600">Personalizables para tu entidad</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 Todos los documentos pueden descargarse en PDF, compartirse por email o enviarse por WhatsApp directamente desde el panel.
            </p>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg overflow-hidden ${
              section.priority === 'high'
                ? 'border-red-300 bg-red-50'
                : section.priority === 'medium'
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-300 bg-white'
            }`}
          >
            <button
              onClick={() => toggleSection(index)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-50 transition"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{section.icon}</span>
                <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
              </div>
              <span className="text-2xl text-gray-500">
                {expandedSection === index ? '▼' : '▶'}
              </span>
            </button>

            {expandedSection === index && (
              <div className="px-6 pb-6 pt-2">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700">No volver a mostrar estas instrucciones</span>
        </label>

        <button
          onClick={handleGoToPanel}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          Ir al Panel
        </button>
      </div>
    </div>
  )
}
