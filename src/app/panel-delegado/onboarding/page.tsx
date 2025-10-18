'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Stats {
  contacto: { total: number; ok: number; pendiente: number; vencido: number }
  sin_contacto: { total: number; ok: number; pendiente: number; vencido: number }
  familias: { total: number; ok: number; pendiente: number; vencido: number }
}

interface SavedReport {
  id: number
  filename: string
  created_at: string
  size: number
  signedUrl: string | null
}

export default function OnboardingDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [generandoPDF, setGenerandoPDF] = useState(false)
  const [guardandoPDF, setGuardandoPDF] = useState(false)
  const [usuario, setUsuario] = useState<any>(null)
  const [entityId, setEntityId] = useState<string>('')
  const [stats, setStats] = useState<Stats>({
    contacto: { total: 0, ok: 0, pendiente: 0, vencido: 0 },
    sin_contacto: { total: 0, ok: 0, pendiente: 0, vencido: 0 },
    familias: { total: 0, ok: 0, pendiente: 0, vencido: 0 }
  })
  const [alertaPenales, setAlertaPenales] = useState(false)
  const [savedReports, setSavedReports] = useState<SavedReport[]>([])
  const [loadingReports, setLoadingReports] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const userSession = localStorage.getItem('userSession')
    if (!userSession) {
      router.push('/login')
      return
    }

    try {
      const userData = JSON.parse(userSession)
      setUsuario(userData)
      const id = userData.entityId || userData.id
      setEntityId(id)
      cargarDatos(id)
      cargarInformesGuardados()
    } catch (error) {
      console.error('Error loading session:', error)
      router.push('/login')
    }
  }, [router])

  // Cargar informes cuando entityId cambia
  useEffect(() => {
    if (entityId) {
      cargarInformesGuardados()
    }
  }, [entityId])

  const cargarDatos = async (id: string) => {
    try {
      const res = await fetch(`/api/delegado/onboarding/list?entityId=${id}`)
      const data = await res.json()

      if (data.responses) {
        const responses = data.responses

        // Calcular stats
        const contacto = responses.filter((r: any) => r.perfil === 'personal_contacto')
        const sinContacto = responses.filter((r: any) => r.perfil === 'personal_sin_contacto')
        const familias = responses.filter((r: any) => r.perfil === 'familia')

        setStats({
          contacto: {
            total: contacto.length,
            ok: contacto.filter((r: any) => r.status === 'ok').length,
            pendiente: contacto.filter((r: any) => r.status === 'pendiente').length,
            vencido: contacto.filter((r: any) => r.status === 'vencido').length
          },
          sin_contacto: {
            total: sinContacto.length,
            ok: sinContacto.filter((r: any) => r.status === 'ok').length,
            pendiente: sinContacto.filter((r: any) => r.status === 'pendiente').length,
            vencido: sinContacto.filter((r: any) => r.status === 'vencido').length
          },
          familias: {
            total: familias.length,
            ok: familias.filter((r: any) => r.status === 'ok').length,
            pendiente: familias.filter((r: any) => r.status === 'pendiente').length,
            vencido: familias.filter((r: any) => r.status === 'vencido').length
          }
        })

        // Verificar alerta de penales
        const vencidosSinPenales = contacto.filter(
          (r: any) => r.status === 'vencido' && !r.penales_entregado
        )
        setAlertaPenales(vencidosSinPenales.length > 0)
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const cargarInformesGuardados = async () => {
    if (!entityId) return

    setLoadingReports(true)
    try {
      const res = await fetch(`/api/delegado/onboarding/report/list?entityId=${entityId}&limit=50`)
      const data = await res.json()

      if (data.ok && data.reports) {
        setSavedReports(data.reports)
      }
    } catch (error) {
      console.error('Error cargando informes guardados:', error)
    } finally {
      setLoadingReports(false)
    }
  }

  const descargarInformePDF = async () => {
    if (!entityId) return

    setGenerandoPDF(true)
    try {
      const res = await fetch(`/api/delegado/onboarding/report?entityId=${entityId}`)

      if (!res.ok) {
        throw new Error('Error generando informe')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `informe-onboarding-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error descargando informe:', error)
      alert('Error al generar el informe PDF. Por favor, inténtelo de nuevo.')
    } finally {
      setGenerandoPDF(false)
    }
  }

  const guardarYDescargarInforme = async () => {
    if (!entityId) return

    setGuardandoPDF(true)
    try {
      const res = await fetch('/api/delegado/onboarding/report/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId })
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Error guardando informe')
      }

      // Descargar desde la URL firmada
      if (data.signedUrl) {
        const a = document.createElement('a')
        a.href = data.signedUrl
        a.download = data.filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }

      // Mostrar toast de éxito
      setToast({ message: 'Informe guardado en el historial correctamente', type: 'success' })
      setTimeout(() => setToast(null), 3000)

      // Recargar el historial
      await cargarInformesGuardados()
    } catch (error: any) {
      console.error('Error guardando informe:', error)
      setToast({ message: error.message || 'Error al guardar el informe', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setGuardandoPDF(false)
    }
  }

  const descargarInformeGuardado = (url: string, filename: string) => {
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel de Onboarding
              </h1>
              <p className="text-gray-600 mt-1">
                Gestión de incorporaciones y formación inicial
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={descargarInformePDF}
                disabled={generandoPDF}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  generandoPDF
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {generandoPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                    <span>Generando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Descargar</span>
                  </>
                )}
              </button>
              <button
                onClick={guardarYDescargarInforme}
                disabled={guardandoPDF}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  guardandoPDF
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {guardandoPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Guardar informe y descargar</span>
                  </>
                )}
              </button>
              <button
                onClick={() => router.push('/dashboard-delegado')}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de alerta */}
        {alertaPenales && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-red-900">
                  ⚠️ Alerta Crítica: Certificados de Penales Pendientes
                </h3>
                <p className="mt-2 text-red-800">
                  Hay personal de contacto que NO ha marcado la entrega del certificado de penales
                  dentro del plazo de 30 días. Hasta que lo haga, <strong>no puede ejercer su función</strong> en
                  la entidad conforme al artículo 57 de la LOPIVI.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Personal de Contacto */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal de Contacto</h3>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-gray-900">{stats.contacto.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-600">OK:</span>
                <span className="font-semibold text-green-700">{stats.contacto.ok}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-600">Pendiente:</span>
                <span className="font-semibold text-yellow-700">{stats.contacto.pendiente}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-600">Vencido:</span>
                <span className="font-semibold text-red-700">{stats.contacto.vencido}</span>
              </div>
            </div>
          </div>

          {/* Personal sin Contacto */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal sin Contacto</h3>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-gray-900">{stats.sin_contacto.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-600">OK:</span>
                <span className="font-semibold text-green-700">{stats.sin_contacto.ok}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-600">Pendiente:</span>
                <span className="font-semibold text-yellow-700">{stats.sin_contacto.pendiente}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-600">Vencido:</span>
                <span className="font-semibold text-red-700">{stats.sin_contacto.vencido}</span>
              </div>
            </div>
          </div>

          {/* Familias */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Familias / Tutores</h3>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-gray-900">{stats.familias.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-600">OK:</span>
                <span className="font-semibold text-green-700">{stats.familias.ok}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-600">Pendiente:</span>
                <span className="font-semibold text-yellow-700">{stats.familias.pendiente}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-600">Vencido:</span>
                <span className="font-semibold text-red-700">{stats.familias.vencido}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/panel-delegado/onboarding/personal')}
              className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900">Ver Personal</h4>
                  <p className="text-sm text-gray-600">Listado completo</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/panel-delegado/onboarding/familias')}
              className="p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900">Ver Familias</h4>
                  <p className="text-sm text-gray-600">Tutores registrados</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/configuracion-delegado')}
              className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900">Configuración</h4>
                  <p className="text-sm text-gray-600">Ajustes del sistema</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Historial de Informes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Informes Guardados</h3>

          {loadingReports ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          ) : savedReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600">No hay informes guardados</p>
              <p className="text-sm text-gray-500 mt-2">
                Utiliza el botón "Guardar informe y descargar" para crear tu primer informe
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de creación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre de archivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tamaño
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(report.created_at).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.filename}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {report.size ? `${(report.size / 1024).toFixed(1)} KB` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {report.signedUrl ? (
                          <button
                            onClick={() => descargarInformeGuardado(report.signedUrl!, report.filename)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Descargar
                          </button>
                        ) : (
                          <span className="text-gray-400">URL no disponible</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Sobre el Informe PDF</h4>
          <p className="text-blue-800">
            El informe PDF incluye un resumen completo del cumplimiento del onboarding: estado de personal,
            resultados de test, entrega de certificados de penales, y alertas de vencimiento.
            Este documento puede ser utilizado para auditorías internas y verificación del cumplimiento de la LOPIVI.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`rounded-lg px-6 py-4 shadow-lg ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            <p className="text-white font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  )
}
