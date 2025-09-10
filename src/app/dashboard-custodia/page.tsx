'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'admin_custodia'
  entidad: string
  permisos: string[]
  certificacionVigente: boolean
  inicioSesion: string
  expiracion: string
}

interface EntidadData {
  id: string
  nombre: string
  plan: string
  fechaContratacion: string
  estado: 'activo' | 'pendiente' | 'cancelado'
  delegadoPrincipal: string
  delegadoSuplente?: string
  importeTotal: number
  proximoPago: string
  numeroMenores: string
  contactoContratante: string
  emailContratante: string
  emailAdministrativo: string
}

interface MetricasData {
  entidadesActivas: number
  entidadesTotales: number
  delegadosActivos: number
  facturacionMensual: number
  facturacionAnual: number
  proximosPagos: number
  importeProximosPagos: number
  nuevasContrataciones: number
}

export default function DashboardCustodia() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [metricas, setMetricas] = useState<MetricasData | null>(null)
  const [entidades, setEntidades] = useState<EntidadData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEntidad, setSelectedEntidad] = useState<string>('')
  const [emailTemplate, setEmailTemplate] = useState('')

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
      return null
    } catch (error) {
      console.error('Error verificando sesión:', error)
      return null
    }
  }

  useEffect(() => {
    const session = checkSession()
    if (!session || session.tipo !== 'admin_custodia') {
      router.push('/login')
      return
    }

    setSessionData(session)

    // Datos simulados del negocio
    const metricasData: MetricasData = {
      entidadesActivas: 127,
      entidadesTotales: 134,
      delegadosActivos: 203,
      facturacionMensual: 12750,
      facturacionAnual: 153000,
      proximosPagos: 89,
      importeProximosPagos: 8950,
      nuevasContrataciones: 15
    }

    const entidadesData: EntidadData[] = [
      {
        id: 'ENT-001',
        nombre: 'Club Deportivo Ejemplo',
        plan: 'Plan 500',
        fechaContratacion: '2024-01-15',
        estado: 'activo',
        delegadoPrincipal: 'Juan García Rodríguez',
        delegadoSuplente: 'María López Martín',
        importeTotal: 210,
        proximoPago: '2024-07-15',
        numeroMenores: '201-500',
        contactoContratante: 'Roberto Silva Martín',
        emailContratante: 'director@custodia360.com',
        emailAdministrativo: 'administracion@custodia360.com'
      },
      {
        id: 'ENT-002',
        nombre: 'Academia Deportiva Madrid',
        plan: 'Plan 200',
        fechaContratacion: '2024-01-10',
        estado: 'activo',
        delegadoPrincipal: 'Carlos Ruiz Sánchez',
        importeTotal: 98,
        proximoPago: '2024-07-10',
        numeroMenores: '51-200',
        contactoContratante: 'Lucía Fernández Ruiz',
        emailContratante: 'presidenta@academia.com',
        emailAdministrativo: 'contabilidad@academia.com'
      },
      {
        id: 'ENT-003',
        nombre: 'Club Deportivo Nuevo',
        plan: 'Plan 50',
        fechaContratacion: '2024-01-20',
        estado: 'pendiente',
        delegadoPrincipal: 'Ana Fernández López',
        importeTotal: 38,
        proximoPago: '2024-07-20',
        numeroMenores: '1-50',
        contactoContratante: 'Miguel Ángel Torres',
        emailContratante: 'responsable@nuevaentidad.com',
        emailAdministrativo: 'secretario@nuevaentidad.com'
      },
      {
        id: 'ENT-004',
        nombre: 'Escuela de Fútbol Los Pinos',
        plan: 'Plan 200',
        fechaContratacion: '2024-01-05',
        estado: 'activo',
        delegadoPrincipal: 'Pedro Martínez García',
        delegadoSuplente: 'Carmen López Ruiz',
        importeTotal: 98,
        proximoPago: '2024-07-05',
        numeroMenores: '51-200',
        contactoContratante: 'Fernando Ruiz López',
        emailContratante: 'director@escuelalospinos.com',
        emailAdministrativo: 'admin@escuelalospinos.com'
      },
      {
        id: 'ENT-005',
        nombre: 'Centro Deportivo Aqua',
        plan: 'Plan 500+',
        fechaContratacion: '2024-01-12',
        estado: 'activo',
        delegadoPrincipal: 'Isabel García Moreno',
        delegadoSuplente: 'Antonio López Silva',
        importeTotal: 500,
        proximoPago: '2024-07-12',
        numeroMenores: '501+',
        contactoContratante: 'María José Fernández',
        emailContratante: 'gerente@centroaqua.com',
        emailAdministrativo: 'facturacion@centroaqua.com'
      }
    ]

    setMetricas(metricasData)
    setEntidades(entidadesData)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('userSession')
    sessionStorage.removeItem('userSession')
    localStorage.removeItem('userAuth')
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const handleAccionRapida = async (accion: string) => {
    try {
      switch (accion) {
        case 'enviar_recordatorios':
          const entidadesProximasRenovar = entidades.filter(e => e.estado === 'activo').slice(0, 3)
          if (entidadesProximasRenovar.length === 0) {
            alert('No hay entidades pendientes de renovación')
            return
          }

          const confirmRecordatorios = confirm(`¿Enviar recordatorios de renovación a ${entidadesProximasRenovar.length} entidades?

Entidades:
${entidadesProximasRenovar.map(e => `• ${e.nombre}`).join('\n')}`)

          if (!confirmRecordatorios) return

          for (const entidad of entidadesProximasRenovar) {
            await fetch('/api/emails/dashboard-custodia', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                accion: 'recordatorio_renovacion',
                nombreEntidad: entidad.nombre,
                emailContratante: entidad.emailContratante
              })
            })
          }

          alert(`✅ Recordatorios enviados a ${entidadesProximasRenovar.length} entidades`)
          break

        case 'facturas_segundo_pago':
          const entidadesPendientesSegundoPago = entidades.filter(e => e.estado === 'activo').slice(0, 2)

          const confirmFacturas = confirm(`¿Enviar facturas de segundo pago a ${entidadesPendientesSegundoPago.length} entidades?

Entidades:
${entidadesPendientesSegundoPago.map(e => `• ${e.nombre} - ${formatCurrency(e.importeTotal / 2)}`).join('\n')}`)

          if (!confirmFacturas) return

          for (const entidad of entidadesPendientesSegundoPago) {
            await fetch('/api/emails/dashboard-custodia', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                accion: 'factura_segundo_pago',
                nombreEntidad: entidad.nombre,
                emailAdministrativo: entidad.emailAdministrativo
              })
            })
          }

          alert(`✅ Facturas de segundo pago enviadas a ${entidadesPendientesSegundoPago.length} entidades`)
          break

        case 'informes_trimestrales':
          const entidadesInformeTrimestral = entidades.filter(e => e.estado === 'activo').slice(0, 5)

          const confirmInformes = confirm(`¿Enviar informes trimestrales a ${entidadesInformeTrimestral.length} entidades?

Los informes incluyen:
• Estado de cumplimiento LOPIVI
• Métricas de rendimiento
• Actualizaciones normativas
• Próximas acciones`)

          if (!confirmInformes) return

          for (const entidad of entidadesInformeTrimestral) {
            await fetch('/api/emails/dashboard-custodia', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                accion: 'informe_trimestral',
                nombreEntidad: entidad.nombre,
                emailContratante: entidad.emailContratante
              })
            })
          }

          alert(`✅ Informes trimestrales enviados a ${entidadesInformeTrimestral.length} entidades`)
          break

        case 'estadisticas_emails':
          const response = await fetch('/api/emails/dashboard-custodia')
          const data = await response.json()

          if (data.success) {
            alert(`📊 Estadísticas del Sistema de Emails

Emails enviados:
• Hoy: ${data.estadisticas.emailsEnviadosHoy}
• Esta semana: ${data.estadisticas.emailsEnviadosSemana}
• Este mes: ${data.estadisticas.emailsEnviadosMes}

Por tipo:
• Documentación: ${data.estadisticas.tiposEmailEnviados.documentacion}
• Informes: ${data.estadisticas.tiposEmailEnviados.informes}
• Facturas: ${data.estadisticas.tiposEmailEnviados.facturas}
• Certificaciones: ${data.estadisticas.tiposEmailEnviados.certificaciones}
• Recordatorios: ${data.estadisticas.tiposEmailEnviados.recordatorios}

Entidades activas: ${data.estadisticas.entidadesActivas}`)
          }
          break

        default:
          alert('Acción no implementada')
      }
    } catch (error) {
      console.error('Error en acción rápida:', error)
      alert(`❌ Error ejecutando acción: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleEnviarDocumentacion = async () => {
    if (!selectedEntidad) {
      alert('Por favor, selecciona una entidad')
      return
    }

    const entidad = entidades.find(e => e.id === selectedEntidad)
    if (!entidad) return

    try {
      const tipoDocumentacion = (document.querySelector('select[name="tipoDocumentacion"]') as HTMLSelectElement)?.value || 'Documentación Completa LOPIVI'

      const response = await fetch('/api/emails/dashboard-custodia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'enviar_documentacion',
          entidadId: entidad.id,
          nombreEntidad: entidad.nombre,
          emailContratante: entidad.emailContratante,
          emailAdministrativo: entidad.emailAdministrativo,
          tipoDocumentacion,
          mensajePersonalizado: emailTemplate
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`✅ Documentación enviada correctamente

Entidad: ${entidad.nombre}
Tipo: ${tipoDocumentacion}
Enviado a: ${entidad.emailContratante}
Email ID: ${result.emailId}

La documentación LOPIVI completa ha sido enviada automáticamente.`)
        setEmailTemplate('')
        setSelectedEntidad('')
      } else {
        throw new Error(result.error || 'Error enviando documentación')
      }
    } catch (error) {
      console.error('Error enviando documentación:', error)
      alert(`❌ Error enviando documentación: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  const handleEnviarInformeInspeccion = async () => {
    if (!selectedEntidad) {
      alert('Por favor, selecciona una entidad')
      return
    }

    const entidad = entidades.find(e => e.id === selectedEntidad)
    if (!entidad) return

    try {
      const motivoInforme = (document.querySelector('select[name="motivoInforme"]') as HTMLSelectElement)?.value || 'Inspección Programada'

      const response = await fetch('/api/emails/dashboard-custodia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'informe_inspeccion',
          entidadId: entidad.id,
          nombreEntidad: entidad.nombre,
          emailContratante: entidad.emailContratante,
          emailAdministrativo: entidad.emailAdministrativo,
          motivoInforme
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`🚨 Informe de inspección enviado correctamente

Entidad: ${entidad.nombre}
Motivo: ${motivoInforme}
Enviado a: ${entidad.emailContratante}
Email ID: ${result.emailId}

Incluye:
✅ Estado de cumplimiento LOPIVI completo
✅ Certificados de delegados vigentes
✅ Plan de protección personalizado
✅ Documentación legal actualizada
✅ Evidencias de formación
✅ Registro de casos gestionados

El informe está listo para presentar ante cualquier inspección.`)
        setSelectedEntidad('')
      } else {
        throw new Error(result.error || 'Error enviando informe')
      }
    } catch (error) {
      console.error('Error enviando informe de inspección:', error)
      alert(`❌ Error enviando informe: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard Custodia360...</p>
        </div>
      </div>
    )
  }

  if (!sessionData || !metricas) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Acceso no autorizado</p>
          <Link href="/login" className="bg-orange-600 text-white px-4 py-2 rounded-lg">
            Volver al Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Interno Custodia360</h1>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-600">Panel de Administración</p>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    Acceso Restringido
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                    Admin Total
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm text-gray-500">
                <div>Usuario: <strong>{sessionData.email}</strong></div>
                <div>Última conexión: {formatDate(sessionData.inicioSesion)}</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 text-sm px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entidades Activas</p>
                <p className="text-2xl font-bold text-green-600">{metricas.entidadesActivas}</p>
                <p className="text-xs text-gray-500">de {metricas.entidadesTotales} totales</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delegados Activos</p>
                <p className="text-2xl font-bold text-blue-600">{metricas.delegadosActivos}</p>
                <p className="text-xs text-gray-500">Certificados y operativos</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Facturación Mensual</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(metricas.facturacionMensual)}</p>
                <p className="text-xs text-gray-500">Año: {formatCurrency(metricas.facturacionAnual)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximos Pagos</p>
                <p className="text-2xl font-bold text-orange-600">{metricas.proximosPagos}</p>
                <p className="text-xs text-gray-500">{formatCurrency(metricas.importeProximosPagos)}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Sistema de Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'dashboard'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard General
              </button>
              <button
                onClick={() => setActiveTab('entidades')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'entidades'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Gestión Entidades
              </button>
              <button
                onClick={() => setActiveTab('facturacion')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'facturacion'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Facturación
              </button>
              <button
                onClick={() => setActiveTab('documentacion')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'documentacion'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Envío Documentación
              </button>
              <button
                onClick={() => setActiveTab('informes')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'informes'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Informes Inspección
              </button>
              <a
                href="/dashboard-custodia360/contactos"
                className="px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700"
              >
                Gestión Contactos
              </a>
            </nav>
          </div>

          <div className="p-8">
            {/* Dashboard General */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen Ejecutivo</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-bold text-blue-800 mb-4">Crecimiento del Negocio</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Nuevas contrataciones (mes)</span>
                          <span className="font-bold text-blue-600">{metricas.nuevasContrataciones}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Tasa de crecimiento</span>
                          <span className="font-bold text-green-600">+12.8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Retención de clientes</span>
                          <span className="font-bold text-green-600">94.2%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-bold text-green-800 mb-4">Distribución por Planes</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Plan 50 (1-50 menores)</span>
                          <span className="font-bold">23 entidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Plan 200 (51-200 menores)</span>
                          <span className="font-bold">45 entidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Plan 500 (201-500 menores)</span>
                          <span className="font-bold">34 entidades</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Plan 500+ (+501 menores)</span>
                          <span className="font-bold">25 entidades</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Últimas Contrataciones</h3>
                  <div className="space-y-4">
                    {entidades.slice(0, 3).map((entidad) => (
                      <div key={entidad.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{entidad.nombre}</h4>
                            <p className="text-sm text-gray-600">{entidad.plan} • {entidad.numeroMenores} menores</p>
                            <p className="text-xs text-gray-500">Contratado: {formatDate(entidad.fechaContratacion)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">{formatCurrency(entidad.importeTotal)}</p>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getEstadoColor(entidad.estado)}`}>
                              {entidad.estado}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Gestión Entidades */}
            {activeTab === 'entidades' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Listado Completo de Entidades</h3>
                  <div className="flex gap-2">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700">
                      Exportar Excel
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                      Generar Informe
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {entidades.map((entidad) => (
                    <div key={entidad.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">{entidad.nombre}</h4>
                          <div className="space-y-1 text-sm">
                            <p><strong>Plan:</strong> {entidad.plan}</p>
                            <p><strong>Menores:</strong> {entidad.numeroMenores}</p>
                            <p><strong>Contratado:</strong> {formatDate(entidad.fechaContratacion)}</p>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(entidad.estado)}`}>
                              {entidad.estado}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Equipo LOPIVI</h5>
                          <div className="space-y-1 text-sm text-gray-700">
                            <p><strong>Principal:</strong> {entidad.delegadoPrincipal}</p>
                            {entidad.delegadoSuplente && (
                              <p><strong>Suplente:</strong> {entidad.delegadoSuplente}</p>
                            )}
                            <p><strong>Contratante:</strong> {entidad.contactoContratante}</p>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Información Financiera</h5>
                          <div className="space-y-1 text-sm text-gray-700">
                            <p><strong>Importe:</strong> {formatCurrency(entidad.importeTotal)}</p>
                            <p><strong>Próximo pago:</strong> {formatDate(entidad.proximoPago)}</p>
                            <p><strong>Email contratante:</strong> {entidad.emailContratante}</p>
                            <p><strong>Email administrativo:</strong> {entidad.emailAdministrativo}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facturación */}
            {activeTab === 'facturacion' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">Control de Facturación</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="font-bold text-purple-800 mb-4">Próximos Pagos (Julio 2024)</h4>
                    <div className="space-y-3">
                      {entidades.filter(e => e.estado === 'activo').slice(0, 4).map((entidad) => (
                        <div key={entidad.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{entidad.nombre}</p>
                            <p className="text-sm text-gray-600">{formatDate(entidad.proximoPago)}</p>
                          </div>
                          <p className="font-bold text-purple-600">{formatCurrency(entidad.importeTotal / 2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-purple-300">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-purple-800">Total esperado:</span>
                        <span className="font-bold text-purple-800 text-lg">{formatCurrency(metricas.importeProximosPagos)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-bold text-green-800 mb-4">Resumen Financiero 2024</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Facturación acumulada</span>
                        <span className="font-bold text-green-600">{formatCurrency(metricas.facturacionAnual)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Proyección anual</span>
                        <span className="font-bold text-green-600">{formatCurrency(metricas.facturacionAnual * 1.2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Crecimiento vs 2023</span>
                        <span className="font-bold text-green-600">+18.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Factura media</span>
                        <span className="font-bold text-green-600">{formatCurrency(metricas.facturacionAnual / metricas.entidadesActivas)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Acciones Rápidas de Email</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => handleAccionRapida('enviar_recordatorios')}
                      className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg border border-yellow-200 text-center transition-colors"
                    >
                      <div className="text-2xl mb-2">📧</div>
                      <div className="text-sm font-medium">Enviar Recordatorios</div>
                      <div className="text-xs text-gray-500">Renovaciones pendientes</div>
                    </button>

                    <button
                      onClick={() => handleAccionRapida('facturas_segundo_pago')}
                      className="bg-green-50 hover:bg-green-100 p-4 rounded-lg border border-green-200 text-center transition-colors"
                    >
                      <div className="text-2xl mb-2">💰</div>
                      <div className="text-sm font-medium">Facturas 6 Meses</div>
                      <div className="text-xs text-gray-500">Segundos pagos</div>
                    </button>

                    <button
                      onClick={() => handleAccionRapida('informes_trimestrales')}
                      className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-200 text-center transition-colors"
                    >
                      <div className="text-2xl mb-2">📊</div>
                      <div className="text-sm font-medium">Informes Trimestrales</div>
                      <div className="text-xs text-gray-500">Estado cumplimiento</div>
                    </button>

                    <button
                      onClick={() => handleAccionRapida('estadisticas_emails')}
                      className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg border border-purple-200 text-center transition-colors"
                    >
                      <div className="text-2xl mb-2">📈</div>
                      <div className="text-sm font-medium">Estadísticas Emails</div>
                      <div className="text-xs text-gray-500">Métricas sistema</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Envío Documentación */}
            {activeTab === 'documentacion' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">Envío de Documentación a Entidades</h3>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-bold text-blue-800 mb-4">Seleccionar Entidad y Documentación</h4>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entidad destinataria
                      </label>
                      <select
                        value={selectedEntidad}
                        onChange={(e) => setSelectedEntidad(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar entidad</option>
                        {entidades.map((entidad) => (
                          <option key={entidad.id} value={entidad.id}>
                            {entidad.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de documentación
                      </label>
                      <select
                        name="tipoDocumentacion"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Documentación Completa LOPIVI</option>
                        <option>Solo Plan de Protección</option>
                        <option>Solo Certificados Delegados</option>
                        <option>Solo Protocolos de Actuación</option>
                        <option>Documentación Legal</option>
                        <option>Paquete Completo + Facturas</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje personalizado (opcional)
                    </label>
                    <textarea
                      value={emailTemplate}
                      onChange={(e) => setEmailTemplate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Estimados, les enviamos la documentación solicitada..."
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleEnviarDocumentacion}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
                    >
                      Enviar Documentación
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300">
                      Vista Previa
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Documentos Disponibles para Envío</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      'Plan de Protección Personalizado',
                      'Certificados de Delegados',
                      'Protocolos de Actuación',
                      'Código de Conducta',
                      'Documentación Legal LOPIVI',
                      'Manual de Formación',
                      'Registro de Incidentes',
                      'Contactos de Emergencia',
                      'Informe de Cumplimiento'
                    ].map((doc, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2"></div>
                        <div className="text-sm font-medium">{doc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Informes Inspección */}
            {activeTab === 'informes' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">Informes para Inspecciones</h3>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-bold text-red-800 mb-4">Envío de Informe de Emergencia para Inspección</h4>
                  <p className="text-red-700 mb-4">
                    Cuando una entidad tiene una inspección o no puede acceder a su dashboard,
                    puedes enviarle un informe completo con toda la documentación necesaria.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entidad que necesita el informe
                      </label>
                      <select
                        value={selectedEntidad}
                        onChange={(e) => setSelectedEntidad(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Seleccionar entidad</option>
                        {entidades.map((entidad) => (
                          <option key={entidad.id} value={entidad.id}>
                            {entidad.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Motivo del informe
                      </label>
                      <select
                        name="motivoInforme"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option>Inspección Programada</option>
                        <option>Inspección Sorpresa</option>
                        <option>Problemas de Acceso Dashboard</option>
                        <option>Solicitud Urgente</option>
                        <option>Auditoría Externa</option>
                        <option>Requerimiento Legal</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleEnviarInformeInspeccion}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700"
                    >
                      Enviar Informe Inmediato
                    </button>
                    <button className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700">
                      Generar PDF Completo
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Contenido del Informe de Inspección</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Datos de Cumplimiento</h5>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div>• Estado actual de implementación LOPIVI</div>
                          <div>• Porcentaje de cumplimiento normativo</div>
                          <div>• Fechas de certificación de delegados</div>
                          <div>• Registro de formación del personal</div>
                          <div>• Historial de renovaciones</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Documentación Legal</h5>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div>• Plan de Protección específico</div>
                          <div>• Certificados oficiales de delegados</div>
                          <div>• Protocolos de actuación vigentes</div>
                          <div>• Código de conducta aprobado</div>
                          <div>• Registro de comunicaciones</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Información Contractual</h5>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div>• Contrato de servicios vigente</div>
                          <div>• Estado de pagos y facturación</div>
                          <div>• Historial de servicios prestados</div>
                          <div>• Renovaciones y modificaciones</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Evidencias de Protección</h5>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div>• Registro de casos gestionados</div>
                          <div>• Comunicaciones con familias</div>
                          <div>• Actividades de prevención</div>
                          <div>• Formaciones realizadas</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nota informativa */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <span className="text-red-600 text-xl mr-3"></span>
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-1">Dashboard Interno Custodia360</h3>
              <p className="text-sm text-red-700">
                Panel de administración exclusivo para propietarios de Custodia360.
                Acceso restringido con control total sobre entidades, facturación y documentación.
                Sistema de envío automático de documentación e informes de emergencia para inspecciones.
              </p>
              <div className="mt-2 text-xs text-red-600">
                <strong>Usuario autorizado:</strong> {sessionData.email} •
                <strong>Nivel de acceso:</strong> Administrador Total •
                <strong>Entidades gestionadas:</strong> {metricas.entidadesTotales}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
