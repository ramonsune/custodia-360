'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { jsPDF } from 'jspdf'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'admin_custodia'
  entidad: string
}

interface EntidadData {
  id: string
  nombre: string
  plan: string
  fechaContratacion: string
  estado: 'activo' | 'pendiente' | 'cancelado'
  delegadoPrincipal: string
  importeTotal: number
  numeroMenores: string
  emailContratante: string
}

interface MetricasData {
  entidadesActivas: number
  entidadesTotales: number
  delegadosActivos: number
  facturacionMensual: number
  facturacionAnual: number
}

export default function DashboardCustodia() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [metricas, setMetricas] = useState<MetricasData | null>(null)
  const [entidades, setEntidades] = useState<EntidadData[]>([])
  const [entidadSeleccionada, setEntidadSeleccionada] = useState<EntidadData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Crear sesión demo automáticamente
    const demoSession: SessionData = {
      id: 'admin-custodia-demo',
      nombre: 'Administrador Custodia360',
      email: 'admin@custodia360.com',
      tipo: 'admin_custodia',
      entidad: 'Custodia360 Admin'
    }

    setSessionData(demoSession)

    // Datos simulados del negocio
    const metricasData: MetricasData = {
      entidadesActivas: 127,
      entidadesTotales: 134,
      delegadosActivos: 203,
      facturacionMensual: 12750,
      facturacionAnual: 153000
    }

    const entidadesData: EntidadData[] = [
      {
        id: 'ENT-001',
        nombre: 'Club Deportivo Ejemplo',
        plan: 'Plan 500',
        fechaContratacion: '2024-01-15',
        estado: 'activo',
        delegadoPrincipal: 'Juan García Rodríguez',
        importeTotal: 210,
        numeroMenores: '201-500',
        emailContratante: 'director@custodia360.com'
      },
      {
        id: 'ENT-002',
        nombre: 'Academia Deportiva Madrid',
        plan: 'Plan 200',
        fechaContratacion: '2024-01-10',
        estado: 'activo',
        delegadoPrincipal: 'Carlos Ruiz Sánchez',
        importeTotal: 98,
        numeroMenores: '51-200',
        emailContratante: 'presidenta@academia.com'
      },
      {
        id: 'ENT-003',
        nombre: 'Club Deportivo Nuevo',
        plan: 'Plan 50',
        fechaContratacion: '2024-01-20',
        estado: 'pendiente',
        delegadoPrincipal: 'Ana Fernández López',
        importeTotal: 38,
        numeroMenores: '1-50',
        emailContratante: 'responsable@nuevaentidad.com'
      }
    ]

    setMetricas(metricasData)
    setEntidades(entidadesData)
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userSession')
    sessionStorage.removeItem('userSession')
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
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Función para generar PDFs descargables
  const generarPDF = (tipo: string, titulo: string) => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('CUSTODIA360', 20, 20)

    doc.setFontSize(16)
    doc.text(titulo, 20, 35)

    // Fecha
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 45)

    // Contenido principal
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')

    let contenido = ''

    switch (tipo) {
      case 'manual-lopivi':
        contenido = `
MANUAL LOPIVI COMPLETO

1. INTRODUCCIÓN
La Ley Orgánica de Protección Integral a la Infancia y Adolescencia frente a la Violencia (LOPIVI) establece el marco normativo para garantizar la protección de menores en todos los ámbitos.

2. OBLIGACIONES LEGALES
- Designación de delegado de protección
- Formación obligatoria del personal
- Protocolos de actuación
- Documentación y seguimiento

3. IMPLEMENTACIÓN
Custodia360 facilita el cumplimiento integral de la LOPIVI mediante herramientas automatizadas y procesos optimizados.

Para más información contacte con soporte@custodia360.com
        `
        break

      case 'informe-mensual':
        contenido = `
INFORME MENSUAL EJECUTIVO - ${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}

RESUMEN EJECUTIVO
- Entidades activas: ${metricas?.entidadesActivas}
- Delegados certificados: ${metricas?.delegadosActivos}
- Facturación del mes: ${formatCurrency(metricas?.facturacionMensual || 0)}

MÉTRICAS DE CUMPLIMIENTO
- Tasa de cumplimiento general: 94.2%
- Renovaciones completadas: 100%
- Incidencias resueltas: 0

PROYECCIONES
- Crecimiento estimado próximo mes: +8%
- Nuevas contrataciones previstas: 12

Generado por Custodia360 - Sistema de gestión LOPIVI
        `
        break

      default:
        contenido = `
${titulo}

Este documento ha sido generado automáticamente por Custodia360.

Contenido detallado del documento ${tipo}.

Para obtener más información o personalizar este documento,
contacte con nuestro equipo de soporte.

Email: soporte@custodia360.com
Teléfono: +34 900 123 456
        `
    }

    // Añadir contenido con saltos de línea
    const lines = contenido.trim().split('\n')
    let yPosition = 60

    lines.forEach(line => {
      if (line.trim() === '') {
        yPosition += 5
      } else {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line.trim(), 20, yPosition)
        yPosition += 5
      }
    })

    // Footer
    doc.setFontSize(8)
    doc.text('Custodia360 - Solución integral para el cumplimiento LOPIVI', 20, 285)

    // Descargar
    doc.save(`${tipo}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Función para generar informe de entidad específica
  const generarInformeEntidad = (entidad: EntidadData, tipoInforme: 'completo' | 'certificado') => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('CUSTODIA360', 20, 20)

    doc.setFontSize(16)
    doc.text(`${tipoInforme === 'completo' ? 'INFORME COMPLETO' : 'CERTIFICADO DE CUMPLIMIENTO'}`, 20, 35)
    doc.text(`${entidad.nombre}`, 20, 50)

    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 60)

    doc.setFontSize(12)

    if (tipoInforme === 'completo') {
      const contenido = `
DATOS DE LA ENTIDAD
- Nombre: ${entidad.nombre}
- Plan contratado: ${entidad.plan}
- Número de menores: ${entidad.numeroMenores}
- Estado: ${entidad.estado}
- Fecha contratación: ${formatDate(entidad.fechaContratacion)}

DELEGADO RESPONSABLE
- Delegado principal: ${entidad.delegadoPrincipal}
- Email de contacto: ${entidad.emailContratante}
- Estado certificación: Vigente

CUMPLIMIENTO LOPIVI
- Estado general: CONFORME
- Protocolos implementados: SÍ
- Personal formado: 100%
- Documentación: COMPLETA

FACTURACIÓN
- Importe mensual: ${formatCurrency(entidad.importeTotal)}
- Estado pagos: AL DÍA

Este informe certifica el cumplimiento íntegro de la normativa LOPIVI por parte de la entidad.
      `

      const lines = contenido.trim().split('\n')
      let yPosition = 75

      lines.forEach(line => {
        if (line.trim() === '') {
          yPosition += 5
        } else {
          doc.text(line.trim(), 20, yPosition)
          yPosition += 5
        }
      })
    } else {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('CERTIFICADO DE CUMPLIMIENTO LOPIVI', 20, 80)

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Se certifica que ${entidad.nombre} cumple íntegramente`, 20, 100)
      doc.text('con todos los requisitos establecidos en la LOPIVI.', 20, 110)

      doc.text('✓ Delegado de Protección certificado', 20, 130)
      doc.text('✓ Personal formado según normativa', 20, 140)
      doc.text('✓ Protocolos de actuación implementados', 20, 150)
      doc.text('✓ Documentación completa y actualizada', 20, 160)

      doc.setFont('helvetica', 'bold')
      doc.text('VÁLIDO PARA INSPECCIONES OFICIALES', 20, 180)
    }

    doc.setFontSize(8)
    doc.text('Custodia360 - Certificación oficial LOPIVI', 20, 285)

    doc.save(`${tipoInforme}-${entidad.nombre.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`)
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
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm text-gray-500">
                <div>Usuario: <strong>{sessionData.email}</strong></div>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entidades Activas</p>
                <p className="text-2xl font-bold text-green-600">{metricas.entidadesActivas}</p>
                <p className="text-xs text-gray-500">de {metricas.entidadesTotales} totales</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delegados Activos</p>
                <p className="text-2xl font-bold text-blue-600">{metricas.delegadosActivos}</p>
                <p className="text-xs text-gray-500">Certificados</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Facturación Mensual</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(metricas.facturacionMensual)}</p>
                <p className="text-xs text-gray-500">Promedio mensual</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Facturación Anual</p>
                <p className="text-2xl font-bold text-teal-600">{formatCurrency(metricas.facturacionAnual)}</p>
                <p className="text-xs text-gray-500">Total año en curso</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sistema</p>
                <p className="text-2xl font-bold text-orange-600">100%</p>
                <p className="text-xs text-gray-500">Operativo</p>
              </div>
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
                onClick={() => setActiveTab('documentacion')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'documentacion'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Documentación
              </button>
              <button
                onClick={() => setActiveTab('informes')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'informes'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Informes
              </button>
              <button
                onClick={() => setActiveTab('listado-completo')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'listado-completo'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                style={{display: 'none'}}
              >
                Listado Completo
              </button>
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
                          <span className="font-bold text-blue-600">15</span>
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
                <h3 className="text-xl font-bold text-gray-900">Gestión de Entidades</h3>

                {/* Resumen numérico */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <h4 className="font-bold text-green-800 mb-2">Entidades Activas</h4>
                    <p className="text-4xl font-bold text-green-600">{entidades.filter(e => e.estado === 'activo').length}</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h4 className="font-bold text-red-800 mb-2">Entidades Inactivas</h4>
                    <p className="text-4xl font-bold text-red-600">{entidades.filter(e => e.estado !== 'activo').length}</p>
                  </div>
                </div>

                {/* Selector de entidad individual */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-bold text-gray-900">Acceso Individual a Entidades</h4>
                    <button
                      onClick={() => setActiveTab('listado-completo')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ver Listado Completo A-Z
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Entidad</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          if (e.target.value) {
                            const entidad = entidades.find(ent => ent.id === e.target.value)
                            if (entidad) {
                              setEntidadSeleccionada(entidad)
                            }
                          }
                        }}
                      >
                        <option value="">-- Seleccionar entidad --</option>
                        {entidades.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((entidad) => (
                          <option key={entidad.id} value={entidad.id}>{entidad.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Información de entidad seleccionada */}
                {entidadSeleccionada && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">Información de {entidadSeleccionada.nombre}</h4>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Datos Generales</h5>
                        <div className="space-y-2 text-sm">
                          <p><strong>Nombre:</strong> {entidadSeleccionada.nombre}</p>
                          <p><strong>Plan:</strong> {entidadSeleccionada.plan}</p>
                          <p><strong>Menores:</strong> {entidadSeleccionada.numeroMenores}</p>
                          <p><strong>Contratado:</strong> {formatDate(entidadSeleccionada.fechaContratacion)}</p>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(entidadSeleccionada.estado)}`}>
                            {entidadSeleccionada.estado}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Delegado Responsable</h5>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p><strong>Principal:</strong> {entidadSeleccionada.delegadoPrincipal}</p>
                          <p><strong>Email:</strong> {entidadSeleccionada.emailContratante}</p>
                          <p><strong>Estado:</strong> <span className="text-green-600">Certificado</span></p>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Información Financiera</h5>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p><strong>Importe mensual:</strong> {formatCurrency(entidadSeleccionada.importeTotal)}</p>
                          <p><strong>Estado pago:</strong> <span className="text-green-600">Al día</span></p>
                          <p><strong>Próxima factura:</strong> {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('es-ES')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Ver Dashboard Completo
                      </button>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Generar Informe
                      </button>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                        Enviar Comunicación
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Listado Completo */}
            {activeTab === 'listado-completo' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Listado Completo de Entidades (A-Z)</h3>
                  <button
                    onClick={() => setActiveTab('entidades')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    ← Volver a Gestión
                  </button>
                </div>

                <div className="space-y-4">
                  {entidades.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((entidad) => (
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
                          <h5 className="font-medium text-gray-900 mb-2">Delegado</h5>
                          <div className="space-y-1 text-sm text-gray-700">
                            <p><strong>Principal:</strong> {entidad.delegadoPrincipal}</p>
                            <p><strong>Email:</strong> {entidad.emailContratante}</p>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Información Financiera</h5>
                          <div className="space-y-1 text-sm text-gray-700">
                            <p><strong>Importe:</strong> {formatCurrency(entidad.importeTotal)}</p>
                            <p><strong>Estado:</strong> <span className={getEstadoColor(entidad.estado).includes('green') ? 'text-green-600' : entidad.estado === 'pendiente' ? 'text-yellow-600' : 'text-red-600'}>{entidad.estado}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documentación */}
            {activeTab === 'documentacion' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-gray-900">Centro de Documentación LOPIVI</h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Guías Oficiales */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-bold text-blue-800 mb-4">Guías Oficiales</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Manual LOPIVI Completo</span>
                        <button
                          onClick={() => generarPDF('manual-lopivi', 'Manual LOPIVI Completo')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Protocolo de Actuación</span>
                        <button
                          onClick={() => generarPDF('protocolo-actuacion', 'Protocolo de Actuación LOPIVI')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Guía de Implementación</span>
                        <button
                          onClick={() => generarPDF('guia-implementacion', 'Guía de Implementación LOPIVI')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">FAQ Delegados</span>
                        <button
                          onClick={() => generarPDF('faq-delegados', 'FAQ para Delegados LOPIVI')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Formularios */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-bold text-green-800 mb-4">Formularios</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Registro de Incidentes</span>
                        <button
                          onClick={() => generarPDF('registro-incidentes', 'Formulario Registro de Incidentes')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Comunicación a Familias</span>
                        <button
                          onClick={() => generarPDF('comunicacion-familias', 'Formulario Comunicación a Familias')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Evaluación de Riesgos</span>
                        <button
                          onClick={() => generarPDF('evaluacion-riesgos', 'Formulario Evaluación de Riesgos')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Plan de Mejora</span>
                        <button
                          onClick={() => generarPDF('plan-mejora', 'Formulario Plan de Mejora')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Certificaciones */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="font-bold text-purple-800 mb-4">Certificaciones</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Certificado de Formación</span>
                        <button
                          onClick={() => generarPDF('certificado-formacion', 'Certificado de Formación LOPIVI')}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Generar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Certificado de Cumplimiento</span>
                        <button
                          onClick={() => generarPDF('certificado-cumplimiento', 'Certificado de Cumplimiento LOPIVI')}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Generar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Diploma Delegado</span>
                        <button
                          onClick={() => generarPDF('diploma-delegado', 'Diploma Delegado de Protección')}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Generar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Acreditación Entidad</span>
                        <button
                          onClick={() => generarPDF('acreditacion-entidad', 'Acreditación de Entidad LOPIVI')}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Generar PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Normativa Legal */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h4 className="font-bold text-orange-800 mb-4">Normativa Legal</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Ley Orgánica LOPIVI</span>
                        <button
                          onClick={() => generarPDF('ley-lopivi', 'Ley Orgánica LOPIVI')}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Real Decreto desarrollo</span>
                        <button
                          onClick={() => generarPDF('real-decreto', 'Real Decreto de desarrollo LOPIVI')}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Instrucciones autonómicas</span>
                        <button
                          onClick={() => generarPDF('instrucciones-autonomicas', 'Instrucciones autonómicas LOPIVI')}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Jurisprudencia relevante</span>
                        <button
                          onClick={() => generarPDF('jurisprudencia', 'Jurisprudencia relevante LOPIVI')}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                        >
                          Descargar PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informes */}
            {activeTab === 'informes' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Centro de Informes y Analíticas</h3>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Generar Informe Personalizado
                  </button>
                </div>

                {/* Informes Ejecutivos */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-6">📊 Informes Ejecutivos</h4>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-medium text-blue-800 mb-3">Informe Mensual</h5>
                      <p className="text-sm text-gray-600 mb-4">Estado general de todas las entidades y métricas de cumplimiento</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Último: Enero 2025</span>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Descargar</button>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="font-medium text-green-800 mb-3">Informe Trimestral</h5>
                      <p className="text-sm text-gray-600 mb-4">Análisis de tendencias y evolución del cumplimiento LOPIVI</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Último: Q4 2024</span>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Descargar</button>
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h5 className="font-medium text-purple-800 mb-3">Informe Anual</h5>
                      <p className="text-sm text-gray-600 mb-4">Resumen ejecutivo completo del año con proyecciones</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Último: 2024</span>
                        <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">Descargar</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analíticas de Cumplimiento */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-6">📈 Analíticas de Cumplimiento</h4>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-4">Estado por Entidades</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Cumplimiento completo</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '89%'}}></div>
                            </div>
                            <span className="text-sm font-medium text-green-600">89%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">En proceso</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-yellow-600 h-2 rounded-full" style={{width: '8%'}}></div>
                            </div>
                            <span className="text-sm font-medium text-yellow-600">8%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Incompleto</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-red-600 h-2 rounded-full" style={{width: '3%'}}></div>
                            </div>
                            <span className="text-sm font-medium text-red-600">3%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-800 mb-4">Delegados Activos</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Principales certificados</span>
                          <span className="text-sm font-medium text-blue-600">247</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Suplentes certificados</span>
                          <span className="text-sm font-medium text-green-600">189</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Renovaciones pendientes</span>
                          <span className="text-sm font-medium text-orange-600">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Formaciones en curso</span>
                          <span className="text-sm font-medium text-purple-600">34</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informes por Entidad */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-6">🏢 Informes por Entidad</h4>

                  <div className="space-y-4">
                    {entidades.slice(0, 5).map((entidad) => (
                      <div key={entidad.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">{entidad.nombre}</h5>
                          <p className="text-sm text-gray-600">Plan {entidad.plan} • {entidad.numeroMenores} menores</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                            Informe Completo
                          </button>
                          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                            Certificado
                          </button>
                          <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                            Auditoría
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Métricas Avanzadas */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">📊 Métricas de Negocio</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">MRR (Monthly Recurring Revenue)</span>
                        <span className="text-lg font-bold text-green-600">{formatCurrency(metricas.facturacionMensual)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">ARR (Annual Recurring Revenue)</span>
                        <span className="text-lg font-bold text-blue-600">{formatCurrency(metricas.facturacionAnual)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Churn Rate</span>
                        <span className="text-lg font-bold text-red-600">2.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">LTV (Customer Lifetime Value)</span>
                        <span className="text-lg font-bold text-purple-600">€4,250</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">⚡ Métricas Operativas</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tiempo medio implementación</span>
                        <span className="text-lg font-bold text-green-600">2.3 días</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Satisfacción del cliente</span>
                        <span className="text-lg font-bold text-blue-600">4.8/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tickets de soporte/mes</span>
                        <span className="text-lg font-bold text-orange-600">23</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Uptime del sistema</span>
                        <span className="text-lg font-bold text-green-600">99.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
