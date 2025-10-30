'use client'

import { useState, useEffect } from 'react'
import { renderMarkdown, extractPlainText } from '@/lib/markdown-renderer'
import { generateGuidePDF } from '@/lib/guide-pdf'

interface Section {
  id: string
  order_index: number
  section_key: string
  section_title: string
  content_md: string
}

interface GuideData {
  guide: {
    id: string
    role: string
    title: string
    version: string
    updated_at: string
  }
  sections: Section[]
}

interface GuideSidebarProps {
  isOpen: boolean
  onClose: () => void
  role: 'ENTIDAD' | 'DELEGADO' | 'SUPLENTE'
  userEmail: string
  userName: string
  entidad?: string
  userId?: string
  uiContext?: string
}

export function GuideSidebar({
  isOpen,
  onClose,
  role,
  userEmail,
  userName,
  entidad,
  userId,
  uiContext,
}: GuideSidebarProps) {
  const [guideData, setGuideData] = useState<GuideData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(null)
  const [showSupportForm, setShowSupportForm] = useState(false)
  const [supportForm, setSupportForm] = useState({
    consultType: 'Duda de uso',
    subject: '',
    message: ''
  })
  const [sendingSupport, setSendingSupport] = useState(false)

  useEffect(() => {
    loadGuide()
  }, [role])

  useEffect(() => {
    if (uiContext && guideData) {
      loadContextualHelp()
    }
  }, [uiContext, guideData])

  const loadGuide = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/guide?role=${role}`)
      if (!res.ok) throw new Error('Error cargando guía')
      const data = await res.json()

      // La API devuelve { success: true, guide: { ...guide, sections: [] } }
      if (data.success && data.guide) {
        const transformedData = {
          guide: {
            id: data.guide.id,
            role: data.guide.role,
            title: data.guide.title,
            version: data.guide.version,
            updated_at: data.guide.updated_at
          },
          sections: data.guide.sections || []
        }
        setGuideData(transformedData)

        // Expandir primera sección por defecto
        if (transformedData.sections && transformedData.sections.length > 0) {
          setExpandedSections([transformedData.sections[0].section_key])
          setActiveSectionKey(transformedData.sections[0].section_key)
        }
      }
    } catch (err) {
      setError('No se pudo cargar la guía')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadContextualHelp = async () => {
    if (!uiContext) return
    try {
      const res = await fetch(`/api/guide/context?role=${role}&ui_context=${uiContext}`)
      if (!res.ok) return
      const data = await res.json()
      if (data.success && data.section) {
        setActiveSectionKey(data.section.section_key)
        setExpandedSections([data.section.section_key])
      }
    } catch (err) {
      console.error('Error cargando ayuda contextual:', err)
    }
  }

  const toggleSection = (sectionKey: string) => {
    if (expandedSections.includes(sectionKey)) {
      setExpandedSections(expandedSections.filter(k => k !== sectionKey))
    } else {
      setExpandedSections([...expandedSections, sectionKey])
    }
    setActiveSectionKey(sectionKey)
  }

  const filteredSections = guideData?.sections.filter(section => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const titleMatch = section.section_title.toLowerCase().includes(query)
    const contentMatch = extractPlainText(section.content_md).toLowerCase().includes(query)
    return titleMatch || contentMatch
  }) || []

  const handleDownloadPDF = () => {
    if (!guideData) return
    generateGuidePDF({
      title: guideData.guide.title,
      role: guideData.guide.role,
      version: guideData.guide.version,
      updated_at: guideData.guide.updated_at,
      sections: filteredSections.map(s => ({
        section_title: s.section_title,
        content_md: s.content_md
      }))
    })
  }

  const handleSendSupport = async () => {
    if (!supportForm.message.trim()) {
      alert('Por favor escribe un mensaje')
      return
    }

    setSendingSupport(true)
    try {
      const res = await fetch('/api/guide/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: userEmail || 'no-especificado@example.com',
          userName: userName || 'No especificado',
          userRole: role,
          entidad: entidad || 'No especificada',
          userId: userId,
          uiContext: uiContext,
          consultType: supportForm.consultType,
          subject: supportForm.subject || supportForm.consultType,
          message: supportForm.message,
        })
      })

      if (!res.ok) throw new Error('Error enviando mensaje')

      const data = await res.json()
      alert(`✅ ${data.message || 'Mensaje enviado correctamente'}`)
      setShowSupportForm(false)
      setSupportForm({ consultType: 'Duda de uso', subject: '', message: '' })
    } catch (err) {
      alert('❌ Error enviando mensaje. Por favor intenta de nuevo.')
      console.error(err)
    } finally {
      setSendingSupport(false)
    }
  }

  // No renderizar nada si no está abierto
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[560px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex-shrink-0">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">
                {guideData?.guide.title || 'Guía de uso C360'}
              </h2>
              <div className="text-sm text-blue-100">
                Versión {guideData?.guide.version} • Actualizado: {guideData ? new Date(guideData.guide.updated_at).toLocaleDateString('es-ES') : ''}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Cerrar guía"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar en la guía..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <svg className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {filteredSections.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.section_key)}
                    className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <span className="font-semibold text-gray-900">{section.section_title}</span>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${expandedSections.includes(section.section_key) ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedSections.includes(section.section_key) && (
                    <div
                      className="p-4 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content_md) }}
                    />
                  )}
                </div>
              ))}

              {filteredSections.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No se encontraron resultados para "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={!guideData}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar PDF
            </button>

            <button
              onClick={() => setShowSupportForm(!showSupportForm)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar
            </button>
          </div>
        </div>
      </div>

      {/* Formulario de Soporte Modal */}
      {showSupportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contactar con soporte</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de consulta
                  </label>
                  <select
                    value={supportForm.consultType}
                    onChange={(e) => setSupportForm({ ...supportForm, consultType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Duda de uso">Duda de uso</option>
                    <option value="Consulta sobre incidencias">Consulta sobre incidencias</option>
                    <option value="Emergencias (no técnicas)">Emergencias (no técnicas)</option>
                    <option value="Problema técnico">Problema técnico</option>
                    <option value="Formación y onboarding">Formación y onboarding</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto (opcional)
                  </label>
                  <input
                    type="text"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Breve descripción del tema"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe tu consulta o problema..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Datos incluidos automáticamente:</strong><br/>
                    Rol: {role} | Entidad: {entidad || 'No especificada'}<br/>
                    Email: {userEmail || 'No especificado'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSendSupport}
                  disabled={sendingSupport}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {sendingSupport ? 'Enviando...' : 'Enviar mensaje'}
                </button>
                <button
                  onClick={() => setShowSupportForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
