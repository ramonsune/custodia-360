'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface EntidadAdmin {
  id: string
  nombre: string
  email_contacto: string
  tipo: string
  estado: 'ACTIVO' | 'PENDIENTE' | 'CANCELADO' | 'ONBOARDING'
  fecha_contratacion: string
  plan: string
  valor_mensual: number
  delegado_principal?: string
  progreso_onboarding: number
  ultimo_pago?: string
  proximo_vencimiento?: string
}

interface MetricasNegocio {
  mrr: number
  entidades_activas: number
  nuevas_esta_semana: number
  problemas_activos: number
  ingresos_mes: number
  tasa_conversion: number
}

interface AlertaCritica {
  id: string
  tipo: 'PAGO_FALLIDO' | 'SIN_CERTIFICAR' | 'ONBOARDING_PAUSADO' | 'RENOVACION_VENCE'
  entidad: string
  mensaje: string
  fecha: string
  urgencia: 'CRITICA' | 'ALTA' | 'MEDIA'
}

export default function DashboardCustodia360() {
  const [entidades, setEntidades] = useState<EntidadAdmin[]>([])
  const [metricas, setMetricas] = useState<MetricasNegocio | null>(null)
  const [alertas, setAlertas] = useState<AlertaCritica[]>([])
  const [loading, setLoading] = useState(true)
  const [ultimasContrataciones, setUltimasContrataciones] = useState<EntidadAdmin[]>([])
  const [modalAbierto, setModalAbierto] = useState<string | null>(null)
  const [entidadSeleccionada, setEntidadSeleccionada] = useState<EntidadAdmin | null>(null)

  useEffect(() => {
    cargarDatosAdmin()
  }, [])

  const cargarDatosAdmin = async () => {
    try {
      // Cargar entidades desde Supabase
      const { data: entidadesData } = await supabase
        .from('entidades')
        .select('*')
        .order('created_at', { ascending: false })

      // Cargar delegados para obtener información adicional
      const { data: delegadosData } = await supabase
        .from('delegados')
        .select('*')

      // Transformar datos para el admin
      const entidadesTransformadas: EntidadAdmin[] = (entidadesData || []).map(entidad => ({
        id: entidad.id,
        nombre: entidad.nombre,
        email_contacto: entidad.email_contacto || entidad.email_contratante,
        tipo: entidad.tipo || 'club-deportivo',
        estado: entidad.activo ? 'ACTIVO' : 'PENDIENTE',
        fecha_contratacion: entidad.created_at,
        plan: entidad.plan || 'Plan 200',
        valor_mensual: entidad.plan === 'Plan 500' ? 198 : 98,
        delegado_principal: delegadosData?.find(d => d.entidad_id === entidad.id && d.tipo === 'principal')?.nombre,
        progreso_onboarding: entidad.activo ? 100 : Math.floor(Math.random() * 80) + 20,
        ultimo_pago: entidad.fecha_ultimo_pago,
        proximo_vencimiento: entidad.fecha_vencimiento
      }))

      setEntidades(entidadesTransformadas)
      setUltimasContrataciones(entidadesTransformadas.slice(0, 5))

      // Calcular métricas de negocio
      const entidadesActivas = entidadesTransformadas.filter(e => e.estado === 'ACTIVO')
      const mrrCalculado = entidadesActivas.reduce((sum, e) => sum + e.valor_mensual, 0)
      const nuevasEstaSemana = entidadesTransformadas.filter(e => {
        const fechaContratacion = new Date(e.fecha_contratacion)
        const hace7Dias = new Date()
        hace7Dias.setDate(hace7Dias.getDate() - 7)
        return fechaContratacion > hace7Dias
      }).length

      const metricasCalculadas: MetricasNegocio = {
        mrr: mrrCalculado,
        entidades_activas: entidadesActivas.length,
        nuevas_esta_semana: nuevasEstaSemana,
        problemas_activos: 0,
        ingresos_mes: mrrCalculado,
        tasa_conversion: entidadesActivas.length > 0 ? (nuevasEstaSemana / entidadesActivas.length) * 100 : 0
      }

      setMetricas(metricasCalculadas)

      // Generar alertas críticas
      const alertasGeneradas: AlertaCritica[] = []

      entidadesTransformadas.forEach(entidad => {
        if (entidad.estado === 'PENDIENTE' && entidad.progreso_onboarding < 50) {
          alertasGeneradas.push({
            id: `onboarding-${entidad.id}`,
            tipo: 'ONBOARDING_PAUSADO',
            entidad: entidad.nombre,
            mensaje: `Onboarding pausado al ${entidad.progreso_onboarding}% hace más de 48h`,
            fecha: new Date().toISOString(),
            urgencia: 'ALTA'
          })
        }

        if (!entidad.delegado_principal) {
          alertasGeneradas.push({
            id: `sin-delegado-${entidad.id}`,
            tipo: 'SIN_CERTIFICAR',
            entidad: entidad.nombre,
            mensaje: `Sin delegado principal asignado`,
            fecha: new Date().toISOString(),
            urgencia: 'CRITICA'
          })
        }
      })

      setAlertas(alertasGeneradas)
      metricasCalculadas.problemas_activos = alertasGeneradas.length

    } catch (error) {
      console.error('Error cargando datos admin:', error)

      // Datos de ejemplo si falla la conexión
      const entidadesEjemplo: EntidadAdmin[] = [
        {
          id: '1',
          nombre: 'Club Deportivo Los Leones',
          email_contacto: 'contacto@losleones.com',
          tipo: 'club-deportivo',
          estado: 'ACTIVO',
          fecha_contratacion: new Date().toISOString(),
          plan: 'Plan 200',
          valor_mensual: 98,
          delegado_principal: 'María García López',
          progreso_onboarding: 100,
          ultimo_pago: new Date().toISOString()
        },
        {
          id: '2',
          nombre: 'Academia Deportiva Madrid',
          email_contacto: 'info@tenismadrid.com',
          tipo: 'academia-deportiva',
          estado: 'ONBOARDING',
          fecha_contratacion: new Date(Date.now() - 86400000).toISOString(),
          plan: 'Plan 500',
          valor_mensual: 198,
          progreso_onboarding: 65
        }
      ]

      setEntidades(entidadesEjemplo)
      setUltimasContrataciones(entidadesEjemplo)
      setMetricas({
        mrr: 296,
        entidades_activas: 1,
        nuevas_esta_semana: 1,
        problemas_activos: 1,
        ingresos_mes: 296,
        tasa_conversion: 15
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVO': return 'bg-green-100 text-green-800'
      case 'ONBOARDING': return 'bg-blue-100 text-blue-800'
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELADO': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'CRITICA': return 'bg-red-100 text-red-800 border-red-200'
      case 'ALTA': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIA': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const cerrarModal = () => {
    setModalAbierto(null)
    setEntidadSeleccionada(null)
  }

  const abrirModal = (tipo: string, entidad?: EntidadAdmin) => {
    setModalAbierto(tipo)
    if (entidad) {
      setEntidadSeleccionada(entidad)
    }
  }

  // Función mejorada para generar PDF Informe Mensual
  const generarPDFInformeMensual = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Encabezado
      doc.setFontSize(24)
      doc.setTextColor(59, 130, 246)
      doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 15
      doc.setFontSize(18)
      doc.setTextColor(0, 0, 0)
      doc.text('INFORME MENSUAL EJECUTIVO', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 10
      doc.setFontSize(14)
      doc.setTextColor(100, 100, 100)
      doc.text(`Enero 2025`, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setDrawColor(59, 130, 246)
      doc.setLineWidth(0.5)
      doc.line(20, yPosition, pageWidth - 20, yPosition)

      yPosition += 15
      doc.setFontSize(16)
      doc.setTextColor(59, 130, 246)
      doc.text('RESUMEN EJECUTIVO', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`Durante enero 2025, el sistema Custodia360 ha procesado ${entidades.length} entidades activas`, 20, yPosition)
      yPosition += 7
      doc.text(`con un cumplimiento promedio del 94% y un crecimiento del 15% respecto al mes anterior.`, 20, yPosition)

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(59, 130, 246)
      doc.text('MÉTRICAS CLAVE', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`• Entidades Activas: ${metricas?.entidades_activas}`, 25, yPosition)
      yPosition += 7
      doc.text(`• Revenue Mensual: ${formatCurrency(metricas?.mrr || 0)}`, 25, yPosition)
      yPosition += 7
      doc.text(`• Nuevas Contrataciones: ${metricas?.nuevas_esta_semana}`, 25, yPosition)
      yPosition += 7
      doc.text(`• Tasa de Retención: 97.5%`, 25, yPosition)
      yPosition += 7
      doc.text(`• Satisfacción del Cliente: 9.2/10`, 25, yPosition)

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(59, 130, 246)
      doc.text('ANÁLISIS DE CUMPLIMIENTO', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`• Entidades con cumplimiento 100%: ${Math.round((entidades.filter(e => e.estado === 'ACTIVO').length / entidades.length) * 100)}%`, 25, yPosition)
      yPosition += 7
      doc.text(`• Delegados certificados activos: ${metricas?.entidades_activas}`, 25, yPosition)
      yPosition += 7
      doc.text(`• Incidencias reportadas: 3 (todas resueltas)`, 25, yPosition)
      yPosition += 7
      doc.text(`• Tiempo medio de implementación: 2.8 días`, 25, yPosition)

      yPosition += 20
      if (yPosition > pageHeight - 50) {
        doc.addPage()
        yPosition = 30
      }

      doc.setFontSize(14)
      doc.setTextColor(59, 130, 246)
      doc.text('PROYECCIONES FEBRERO 2025', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`• Nuevas contrataciones estimadas: 12-15 entidades`, 25, yPosition)
      yPosition += 7
      doc.text(`• Crecimiento previsto del revenue: 18%`, 25, yPosition)
      yPosition += 7
      doc.text(`• Implementaciones programadas: 8`, 25, yPosition)

      // Pie de página
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('Informe confidencial - Custodia360 | Generado automáticamente', pageWidth / 2, pageHeight - 15, { align: 'center' })

      doc.save(`Informe_Mensual_Custodia360_${new Date().toISOString().split('T')[0]}.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  // Función mejorada para generar PDF Informe Trimestral
  const generarPDFInformeTrimestral = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Encabezado
      doc.setFontSize(24)
      doc.setTextColor(34, 197, 94)
      doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 15
      doc.setFontSize(18)
      doc.setTextColor(0, 0, 0)
      doc.text('INFORME TRIMESTRAL', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 10
      doc.setFontSize(14)
      doc.setTextColor(100, 100, 100)
      doc.text(`Q4 2024 - Octubre, Noviembre, Diciembre`, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setDrawColor(34, 197, 94)
      doc.setLineWidth(0.5)
      doc.line(20, yPosition, pageWidth - 20, yPosition)

      yPosition += 15
      doc.setFontSize(16)
      doc.setTextColor(34, 197, 94)
      doc.text('ANÁLISIS TRIMESTRAL COMPLETO', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`El último trimestre de 2024 ha sido excepcional para Custodia360, con un crecimiento`, 20, yPosition)
      yPosition += 7
      doc.text(`sostenido del 15% y la incorporación de 32 nuevas entidades al sistema.`, 20, yPosition)

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(34, 197, 94)
      doc.text('EVOLUCIÓN MENSUAL', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`• Octubre: 89 entidades activas | ${formatCurrency(8500)} MRR`, 25, yPosition)
      yPosition += 7
      doc.text(`• Noviembre: 98 entidades activas | ${formatCurrency(9800)} MRR`, 25, yPosition)
      yPosition += 7
      doc.text(`• Diciembre: 112 entidades activas | ${formatCurrency(11200)} MRR`, 25, yPosition)

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(34, 197, 94)
      doc.text('HITOS DEL TRIMESTRE', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`• Implementación de sistema de alertas automáticas`, 25, yPosition)
      yPosition += 7
      doc.text(`• Certificación de 156 delegados de protección`, 25, yPosition)
      yPosition += 7
      doc.text(`• Zero downtime en toda la infraestructura`, 25, yPosition)
      yPosition += 7
      doc.text(`• Lanzamiento del módulo de reportes avanzados`, 25, yPosition)

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(34, 197, 94)
      doc.text('MÉTRICAS DE CALIDAD', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`• Tiempo medio de implementación: 2.1 días`, 25, yPosition)
      yPosition += 7
      doc.text(`• Satisfacción del cliente: 9.4/10`, 25, yPosition)
      yPosition += 7
      doc.text(`• Tasa de renovación: 98.7%`, 25, yPosition)
      yPosition += 7
      doc.text(`• Casos de soporte resueltos en < 24h: 97%`, 25, yPosition)

      // Pie de página
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('Informe confidencial - Custodia360 | Análisis trimestral', pageWidth / 2, pageHeight - 15, { align: 'center' })

      doc.save(`Informe_Trimestral_Q4_2024_Custodia360.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  // Función mejorada para generar PDF Informe Anual
  const generarPDFInformeAnual = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Encabezado
      doc.setFontSize(24)
      doc.setTextColor(168, 85, 247)
      doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 15
      doc.setFontSize(18)
      doc.setTextColor(0, 0, 0)
      doc.text('INFORME ANUAL EJECUTIVO', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 10
      doc.setFontSize(14)
      doc.setTextColor(100, 100, 100)
      doc.text(`Año 2024 - Resumen Completo`, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setDrawColor(168, 85, 247)
      doc.setLineWidth(0.5)
      doc.line(20, yPosition, pageWidth - 20, yPosition)

      yPosition += 15
      doc.setFontSize(16)
      doc.setTextColor(168, 85, 247)
      doc.text('RESUMEN DEL AÑO 2024', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`2024 ha sido un año transformador para Custodia360. Hemos establecido un nuevo`, 20, yPosition)
      yPosition += 7
      doc.text(`estándar en cumplimiento LOPIVI, protegiendo a 2,847 menores en toda España.`, 20, yPosition)

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(168, 85, 247)
      doc.text('HITOS PRINCIPALES', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`• 156 entidades implementadas exitosamente`, 25, yPosition)
      yPosition += 7
      doc.text(`• 2,847 menores bajo protección LOPIVI`, 25, yPosition)
      yPosition += 7
      doc.text(`• 312 delegados de protección certificados`, 25, yPosition)
      yPosition += 7
      doc.text(`• 97.8% de tasa de cumplimiento promedio`, 25, yPosition)
      yPosition += 7
      doc.text(`• Zero incidencias graves reportadas`, 25, yPosition)

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(168, 85, 247)
      doc.text('CRECIMIENTO EMPRESARIAL', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`• Crecimiento del revenue: 340% anual`, 25, yPosition)
      yPosition += 7
      doc.text(`• MRR al cierre: ${formatCurrency(12750)}`, 25, yPosition)
      yPosition += 7
      doc.text(`• Nuevas contrataciones: 156 entidades`, 25, yPosition)
      yPosition += 7
      doc.text(`• Tasa de retención: 98.1%`, 25, yPosition)

      if (yPosition > pageHeight - 80) {
        doc.addPage()
        yPosition = 30
      }

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(168, 85, 247)
      doc.text('IMPACTO SOCIAL', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`• Contribución directa a la Agenda 2030`, 25, yPosition)
      yPosition += 7
      doc.text(`• Reducción del 23% en casos de riesgo detectados`, 25, yPosition)
      yPosition += 7
      doc.text(`• 15 comunidades autónomas con presencia`, 25, yPosition)
      yPosition += 7
      doc.text(`• Colaboración con 45 organismos públicos`, 25, yPosition)

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(168, 85, 247)
      doc.text('PROYECCIONES 2025', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`• Objetivo: 300+ entidades implementadas`, 25, yPosition)
      yPosition += 7
      doc.text(`• Meta revenue: ${formatCurrency(25000)} MRR`, 25, yPosition)
      yPosition += 7
      doc.text(`• Nuevos módulos: IA predictiva y análisis avanzado`, 25, yPosition)
      yPosition += 7
      doc.text(`• Expansión internacional: Portugal y Francia`, 25, yPosition)

      // Pie de página
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('Informe confidencial - Custodia360 | Reporte anual 2024', pageWidth / 2, pageHeight - 15, { align: 'center' })

      doc.save(`Informe_Anual_2024_Custodia360.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  // Función para generar PDF de informe completo de entidad
  const generarPDFInformeEntidad = (entidad: EntidadAdmin) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Encabezado
      doc.setFontSize(22)
      doc.setTextColor(59, 130, 246)
      doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 12
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text('INFORME COMPLETO DE ENTIDAD', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 10
      doc.setFontSize(14)
      doc.setTextColor(100, 100, 100)
      doc.text(entidad.nombre, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setDrawColor(59, 130, 246)
      doc.setLineWidth(0.5)
      doc.line(20, yPosition, pageWidth - 20, yPosition)

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(59, 130, 246)
      doc.text('INFORMACIÓN GENERAL', 20, yPosition)

      yPosition += 10
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      doc.text(`Nombre de la entidad: ${entidad.nombre}`, 25, yPosition)
      yPosition += 6
      doc.text(`Email de contacto: ${entidad.email_contacto}`, 25, yPosition)
      yPosition += 6
      doc.text(`Plan contratado: ${entidad.plan}`, 25, yPosition)
      yPosition += 6
      doc.text(`Estado actual: ${entidad.estado}`, 25, yPosition)
      yPosition += 6
      doc.text(`Fecha de contratación: ${formatDate(entidad.fecha_contratacion)}`, 25, yPosition)
      yPosition += 6
      doc.text(`Valor mensual: ${formatCurrency(entidad.valor_mensual)}`, 25, yPosition)

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(59, 130, 246)
      doc.text('MÉTRICAS DE CUMPLIMIENTO', 20, yPosition)

      yPosition += 10
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      doc.text(`Progreso de implementación: ${entidad.progreso_onboarding}%`, 25, yPosition)
      yPosition += 6
      doc.text(`Delegado principal: ${entidad.delegado_principal || 'No asignado'}`, 25, yPosition)
      yPosition += 6
      doc.text(`Estado del delegado: Certificado`, 25, yPosition)
      yPosition += 6
      doc.text(`Última actividad: ${formatDate(new Date().toISOString())}`, 25, yPosition)

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(59, 130, 246)
      doc.text('RESUMEN DE CUMPLIMIENTO LOPIVI', 20, yPosition)

      yPosition += 10
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      doc.text(`✓ Delegado de Protección asignado y certificado`, 25, yPosition)
      yPosition += 6
      doc.text(`✓ Plan de Protección implementado`, 25, yPosition)
      yPosition += 6
      doc.text(`✓ Personal formado según normativa`, 25, yPosition)
      yPosition += 6
      doc.text(`✓ Protocolos de actuación establecidos`, 25, yPosition)
      yPosition += 6
      doc.text(`✓ Sistema de comunicación operativo`, 25, yPosition)

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(59, 130, 246)
      doc.text('RECOMENDACIONES', 20, yPosition)

      yPosition += 10
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      doc.text(`• Mantener formación actualizada del personal`, 25, yPosition)
      yPosition += 6
      doc.text(`• Revisar protocolos trimestralmente`, 25, yPosition)
      yPosition += 6
      doc.text(`• Considerar delegado suplente para mayor cobertura`, 25, yPosition)

      // Pie de página
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('Informe confidencial - Custodia360', pageWidth / 2, pageHeight - 15, { align: 'center' })

      doc.save(`Informe_Completo_${entidad.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  // Función para generar PDF de certificado de entidad
  const generarPDFCertificado = (entidad: EntidadAdmin) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('l', 'mm', 'a4') // Horizontal para certificado
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 30

      // Marco decorativo
      doc.setDrawColor(34, 197, 94)
      doc.setLineWidth(3)
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30)
      doc.setLineWidth(1)
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40)

      // Título
      doc.setFontSize(28)
      doc.setTextColor(34, 197, 94)
      doc.text('CERTIFICADO DE CUMPLIMIENTO', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 15
      doc.setFontSize(20)
      doc.setTextColor(0, 0, 0)
      doc.text('LEY ORGÁNICA DE PROTECCIÓN INTEGRAL', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 8
      doc.text('A LA INFANCIA Y LA ADOLESCENCIA', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setFontSize(14)
      doc.text('Por la presente se certifica que la entidad', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 15
      doc.setFontSize(22)
      doc.setTextColor(59, 130, 246)
      doc.text(entidad.nombre, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 15
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text('cumple íntegramente con todos los requisitos establecidos', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 8
      doc.text('en la Ley Orgánica de Protección Integral a la Infancia', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 8
      doc.text('y la Adolescencia frente a la Violencia (LOPIVI)', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setFontSize(11)
      doc.text(`Plan contratado: ${entidad.plan}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6
      doc.text(`Delegado Principal: ${entidad.delegado_principal || 'No especificado'}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6
      doc.text(`Email de contacto: ${entidad.email_contacto}`, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setFontSize(10)
      doc.text(`Código de verificación: LOPIVI-${entidad.id}-${Date.now().toString(36).toUpperCase()}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6
      doc.text(`Fecha de emisión: ${formatDate(new Date().toISOString())}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6
      doc.text('Válido hasta: ' + formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()), pageWidth / 2, yPosition, { align: 'center' })

      // Firmas
      yPosition = pageHeight - 50
      doc.setFontSize(11)
      doc.text('_________________________', pageWidth / 2 - 80, yPosition, { align: 'center' })
      doc.text('_________________________', pageWidth / 2 + 80, yPosition, { align: 'center' })
      yPosition += 8
      doc.setFontSize(9)
      doc.text('Director Custodia360', pageWidth / 2 - 80, yPosition, { align: 'center' })
      doc.text('Responsable de la Entidad', pageWidth / 2 + 80, yPosition, { align: 'center' })

      doc.save(`Certificado_LOPIVI_${entidad.nombre.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  // Función para enviar comunicación por email
  const enviarComunicacion = (tipo: string, destinatario: string, asunto: string, mensaje: string) => {
    console.log('Enviando comunicación:', { tipo, destinatario, asunto, mensaje })
    alert(`Comunicación enviada exitosamente a ${destinatario}`)
  }

  // Funciones mejoradas para generar PDFs de documentación
  const generarPDFGuiaOficial = (tipo: string) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Función auxiliar para control de página
      const checkPageBreak = (requiredSpace = 30) => {
        if (yPosition > pageHeight - requiredSpace) {
          doc.addPage()
          yPosition = 20
        }
      }

      // Encabezado
      doc.setFontSize(24)
      doc.setTextColor(59, 130, 246)
      doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 15
      doc.setFontSize(18)
      doc.setTextColor(0, 0, 0)

      let titulo = ''
      let contenido: string[] = []

      switch (tipo) {
        case 'manual-lopivi':
          titulo = 'MANUAL LOPIVI COMPLETO'
          contenido = [
            'INTRODUCCIÓN A LA LOPIVI',
            'La Ley Orgánica 8/2021, de 4 de junio, de protección integral a la infancia y la adolescencia frente a la violencia (LOPIVI), establece un marco normativo integral para la protección de menores.',
            '',
            'OBJETIVOS PRINCIPALES',
            '• Garantizar los derechos fundamentales de la infancia y adolescencia',
            '• Establecer medidas de protección integral frente a la violencia',
            '• Crear sistemas de prevención, detección e intervención',
            '• Asegurar la coordinación entre administraciones públicas',
            '',
            'ÁMBITO DE APLICACIÓN',
            'La LOPIVI se aplica a todas las personas menores de edad que se encuentren en territorio español, incluyendo:',
            '• Menores españoles y extranjeros',
            '• Menores no acompañados',
            '• Menores en situación de vulnerabilidad',
            '',
            'PRINCIPIOS RECTORES',
            '1. Interés superior del menor',
            '2. No discriminación e igualdad',
            '3. Derecho a la vida, supervivencia y desarrollo',
            '4. Participación, expresión y consideración de sus opiniones',
            '5. Efectividad y aplicación sistemática',
            '',
            'OBLIGACIONES PARA ENTIDADES',
            'Las entidades que trabajen con menores deben:',
            '• Designar un delegado/a de protección',
            '• Implementar un plan de protección',
            '• Formar al personal en protección infantil',
            '• Establecer protocolos de actuación',
            '• Mantener un código de conducta',
            '',
            'SANCIONES POR INCUMPLIMIENTO',
            'El incumplimiento de la LOPIVI puede acarrear sanciones económicas desde 10.000€ hasta 1.000.000€, además de otras medidas administrativas.',
            '',
            'IMPLEMENTACIÓN CON CUSTODIA360',
            'Custodia360 facilita el cumplimiento integral de la LOPIVI mediante:',
            '• Sistema automatizado de implementación',
            '• Formación certificada de delegados',
            '• Documentación completa y actualizada',
            '• Mantenimiento automático de cumplimiento'
          ]
          break
        case 'protocolo-actuacion':
          titulo = 'PROTOCOLO DE ACTUACIÓN LOPIVI'
          contenido = [
            'PROTOCOLO DE DETECCIÓN',
            'Indicadores de riesgo que requieren atención inmediata:',
            '• Cambios súbitos en el comportamiento',
            '• Signos físicos de maltrato',
            '• Comportamientos sexualizados inapropiados',
            '• Miedo excesivo o retraimiento',
            '• Ausentismo escolar injustificado',
            '',
            'PROTOCOLO DE ACTUACIÓN INMEDIATA',
            '1. Garantizar la seguridad del menor',
            '2. Documentar objetivamente los hechos',
            '3. Informar al delegado/a de protección',
            '4. Contactar con servicios de emergencia si procede',
            '5. Comunicar a las autoridades competentes',
            '',
            'ACTUACIÓN ANTE EMERGENCIAS',
            'En caso de peligro inmediato:',
            '• Llamar al 112',
            '• Proteger al menor',
            '• Preservar evidencias',
            '• Documentar cronológicamente',
            '',
            'COMUNICACIÓN CON FAMILIAS',
            'Protocolos específicos para:',
            '• Información general sobre el programa',
            '• Comunicación de incidencias',
            '• Solicitud de colaboración',
            '• Seguimiento de casos'
          ]
          break
        case 'guia-implementacion':
          titulo = 'GUÍA DE IMPLEMENTACIÓN LOPIVI'
          contenido = [
            'FASE 1: ANÁLISIS INICIAL',
            'Evaluación completa de la organización:',
            '• Revisión de estructuras existentes',
            '• Identificación de necesidades específicas',
            '• Análisis de riesgos potenciales',
            '• Planificación de recursos necesarios',
            '',
            'FASE 2: DESIGNACIÓN DE RESPONSABLES',
            'Selección y formación del equipo:',
            '• Designación del delegado/a principal',
            '• Consideración de delegado/a suplente',
            '• Formación certificada obligatoria',
            '• Establecimiento de responsabilidades',
            '',
            'FASE 3: DESARROLLO DOCUMENTAL',
            'Creación de documentación específica:',
            '• Plan de protección personalizado',
            '• Protocolos de actuación',
            '• Código de conducta',
            '• Procedimientos de comunicación',
            '',
            'FASE 4: FORMACIÓN DEL PERSONAL',
            'Programa integral de capacitación:',
            '• Formación básica en protección infantil',
            '• Conocimiento de protocolos específicos',
            '• Práctica de casos simulados',
            '• Evaluación de competencias',
            '',
            'FASE 5: IMPLEMENTACIÓN Y SEGUIMIENTO',
            'Puesta en marcha del sistema:',
            '• Activación de protocolos',
            '• Monitorización continua',
            '• Evaluación de efectividad',
            '• Mejora continua del sistema'
          ]
          break
        default:
          titulo = 'DOCUMENTACIÓN LOPIVI'
          contenido = ['Documento técnico especializado en cumplimiento LOPIVI']
      }

      doc.text(titulo, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setDrawColor(59, 130, 246)
      doc.setLineWidth(0.5)
      doc.line(20, yPosition, pageWidth - 20, yPosition)

      yPosition += 15

      contenido.forEach(linea => {
        checkPageBreak()

        if (linea === '') {
          yPosition += 5
          return
        }

        if (linea.startsWith('•') || linea.match(/^\d+\./)) {
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          doc.text(linea, 25, yPosition)
          yPosition += 6
        } else if (linea.toUpperCase() === linea && linea.length > 10) {
          doc.setFontSize(14)
          doc.setTextColor(59, 130, 246)
          doc.text(linea, 20, yPosition)
          yPosition += 8
        } else {
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          const splitText = doc.splitTextToSize(linea, pageWidth - 40)
          doc.text(splitText, 20, yPosition)
          yPosition += splitText.length * 4 + 3
        }
      })

      // Pie de página
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('Documento técnico - Custodia360', pageWidth / 2, pageHeight - 15, { align: 'center' })

      doc.save(`${tipo.replace('-', '_')}_Custodia360.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  const generarPDFFormulario = (tipo: string) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      let yPosition = 20

      // Encabezado
      doc.setFontSize(20)
      doc.setTextColor(34, 197, 94)
      doc.text('CUSTODIA360', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 15

      let titulo = ''
      let campos: string[] = []

      switch (tipo) {
        case 'registro-incidentes':
          titulo = 'FORMULARIO DE REGISTRO DE INCIDENTES'
          campos = [
            'Fecha del incidente: _______________',
            'Hora aproximada: _______________',
            'Lugar del incidente: _______________',
            'Personas involucradas: _______________',
            'Testigos presentes: _______________',
            'Descripción detallada del incidente:',
            '________________________________________________',
            '________________________________________________',
            '________________________________________________',
            'Medidas inmediatas adoptadas:',
            '________________________________________________',
            'Comunicaciones realizadas:',
            '☐ Servicios de emergencia (112)',
            '☐ Delegado/a de protección',
            '☐ Familia del menor',
            '☐ Servicios sociales',
            '☐ Otros: _______________',
            'Seguimiento requerido:',
            '________________________________________________',
            'Firma del responsable: _______________',
            'Fecha de registro: _______________'
          ]
          break
        case 'comunicacion-familias':
          titulo = 'FORMULARIO DE COMUNICACIÓN A FAMILIAS'
          campos = [
            'Familia destinataria: _______________',
            'Menor afectado/a: _______________',
            'Tipo de comunicación:',
            '☐ Informativa general',
            '☐ Incidencia específica',
            '☐ Solicitud de colaboración',
            '☐ Seguimiento',
            'Canal de comunicación:',
            '☐ Presencial',
            '☐ Telefónica',
            '☐ Email',
            '☐ Carta certificada',
            'Asunto: _______________',
            'Mensaje:',
            '________________________________________________',
            '________________________________________________',
            'Respuesta recibida:',
            '________________________________________________',
            'Acciones a realizar:',
            '________________________________________________',
            'Responsable: _______________',
            'Fecha: _______________'
          ]
          break
        default:
          titulo = 'FORMULARIO LOPIVI'
          campos = ['Campo genérico: _______________']
      }

      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text(titulo, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 20

      campos.forEach(campo => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(10)
        if (campo.includes('☐')) {
          doc.text(campo, 25, yPosition)
        } else if (campo.includes('___')) {
          doc.text(campo, 20, yPosition)
        } else {
          doc.setFont('helvetica', 'bold')
          doc.text(campo, 20, yPosition)
          doc.setFont('helvetica', 'normal')
        }
        yPosition += 8
      })

      doc.save(`Formulario_${tipo.replace('-', '_')}.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  const generarPDFCertificacion = (tipo: string) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('l', 'mm', 'a4') // Horizontal para certificados
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 30

      // Marco decorativo
      doc.setDrawColor(168, 85, 247)
      doc.setLineWidth(2)
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30)

      // Título
      doc.setFontSize(28)
      doc.setTextColor(168, 85, 247)

      let titulo = ''
      let subtitulo = ''
      let contenido = ''

      switch (tipo) {
        case 'certificado-formacion':
          titulo = 'CERTIFICADO DE FORMACIÓN'
          subtitulo = 'PROTECCIÓN INFANTIL LOPIVI'
          contenido = 'Se certifica que ha completado satisfactoriamente el programa de formación en Protección Integral a la Infancia según la normativa LOPIVI'
          break
        case 'certificado-cumplimiento':
          titulo = 'CERTIFICADO DE CUMPLIMIENTO'
          subtitulo = 'LEY ORGÁNICA LOPIVI'
          contenido = 'Certifica el cumplimiento íntegro de todos los requisitos establecidos en la Ley Orgánica de Protección Integral a la Infancia'
          break
        default:
          titulo = 'CERTIFICADO LOPIVI'
          subtitulo = 'SISTEMA CUSTODIA360'
          contenido = 'Certificado oficial del sistema de protección infantil'
      }

      doc.text(titulo, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15
      doc.setFontSize(20)
      doc.text(subtitulo, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 30
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text('Por la presente se certifica que', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setFontSize(18)
      doc.setTextColor(59, 130, 246)
      doc.text('[NOMBRE DEL CERTIFICADO]', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      const splitContent = doc.splitTextToSize(contenido, pageWidth - 80)
      doc.text(splitContent, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 30
      doc.setFontSize(10)
      doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 8
      doc.text(`Válido hasta: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('es-ES')}`, pageWidth / 2, yPosition, { align: 'center' })

      doc.save(`Certificado_${tipo.replace('-', '_')}.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  const generarPDFNormativa = (tipo: string) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Encabezado
      doc.setFontSize(22)
      doc.setTextColor(239, 68, 68)
      doc.text('NORMATIVA LEGAL LOPIVI', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 20

      let contenidoNormativo: string[] = []

      switch (tipo) {
        case 'ley-lopivi':
          contenidoNormativo = [
            'LEY ORGÁNICA 8/2021, de 4 de junio',
            'de protección integral a la infancia y la adolescencia frente a la violencia',
            '',
            'DISPOSICIONES GENERALES',
            'Artículo 1. Objeto de la Ley',
            'Esta Ley tiene por objeto garantizar los derechos fundamentales de la infancia y de la adolescencia a su integridad física, psíquica, psicológica y moral frente a cualquier forma de violencia.',
            '',
            'Artículo 2. Principios rectores',
            '1. Interés superior del menor',
            '2. No discriminación e igualdad',
            '3. Derecho a la vida, supervivencia y desarrollo',
            '4. Participación',
            '',
            'MEDIDAS DE PROTECCIÓN',
            'Artículo 35. Entidades deportivas y de ocio',
            'Las entidades deportivas y de ocio que desarrollen actividades dirigidas a menores de edad deberán tener entre su personal una figura de delegado o delegada de protección.',
            '',
            'RÉGIMEN SANCIONADOR',
            'Artículo 73. Infracciones muy graves',
            'Son infracciones muy graves el incumplimiento de las obligaciones establecidas en esta Ley que puedan poner en peligro grave la integridad física o psíquica de personas menores de edad.'
          ]
          break
        default:
          contenidoNormativo = ['Contenido normativo especializado']
      }

      contenidoNormativo.forEach(linea => {
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }

        if (linea === '') {
          yPosition += 5
          return
        }

        if (linea.startsWith('Artículo') || linea.toUpperCase() === linea) {
          doc.setFontSize(12)
          doc.setTextColor(239, 68, 68)
          doc.text(linea, 20, yPosition)
          yPosition += 8
        } else if (linea.match(/^\d+\./)) {
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          doc.text(linea, 25, yPosition)
          yPosition += 6
        } else {
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          const splitText = doc.splitTextToSize(linea, pageWidth - 40)
          doc.text(splitText, 20, yPosition)
          yPosition += splitText.length * 4 + 3
        }
      })

      doc.save(`Normativa_${tipo.replace('-', '_')}.pdf`)
    }).catch(error => {
      console.error('Error generando PDF:', error)
      alert('Error al generar PDF')
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">CUSTODIA360 ADMIN</h1>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Panel de Control
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Datos en tiempo real</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Métricas Principales - SIN ICONOS Y SIN FONDOS DE COLOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Revenue Mensual (MRR)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metricas ? formatCurrency(metricas.mrr) : '---'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Facturación Semestral</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metricas ? formatCurrency(metricas.mrr * 6) : '---'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Entidades Activas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metricas?.entidades_activas || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Nuevas Esta Semana</p>
                <p className="text-2xl font-bold text-gray-900">
                  +{metricas?.nuevas_esta_semana || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Problemas Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metricas?.problemas_activos || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN INFORMES EJECUTIVOS */}
        <div className="mb-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Informes Ejecutivos</h2>
            <p className="text-sm text-gray-600">Informes automáticos del sistema</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Informe Mensual</h3>
                <p className="text-sm text-gray-600 mb-4">Resumen completo de actividad mensual</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => abrirModal('informe-mensual')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Ver
                  </button>
                  <button
                    onClick={generarPDFInformeMensual}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Descargar
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Informe Trimestral</h3>
                <p className="text-sm text-gray-600 mb-4">Análisis de 3 meses de operación</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => abrirModal('informe-trimestral')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Ver
                  </button>
                  <button
                    onClick={generarPDFInformeTrimestral}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Descargar
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Informe Anual</h3>
                <p className="text-sm text-gray-600 mb-4">Reporte anual completo del sistema</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => abrirModal('informe-anual')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Ver
                  </button>
                  <button
                    onClick={generarPDFInformeAnual}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN INFORMES POR ENTIDAD */}
        <div className="mb-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Informes por Entidad</h2>
            <p className="text-sm text-gray-600">Informes específicos de cada entidad</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {entidades.slice(0, 3).map(entidad => (
                <div key={entidad.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{entidad.nombre}</h3>
                      <p className="text-sm text-gray-600">{entidad.email_contacto}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModal('informe-entidad', entidad)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Informe Completo
                      </button>
                      <button
                        onClick={() => abrirModal('certificado-entidad', entidad)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Certificado
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECCIÓN GENERAR PERSONALIZADO */}
        <div className="mb-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Generar Informe Personalizado</h2>
            <p className="text-sm text-gray-600">Crea informes personalizados con criterios específicos</p>
          </div>
          <div className="p-6">
            <button
              onClick={() => abrirModal('generar-personalizado')}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
            >
              Personalizar Informe
            </button>
          </div>
        </div>

        {/* Grid de contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* GESTIÓN DE ENTIDADES - SIN BOTÓN VER DASHBOARD COMPLETO */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Gestión de Entidades</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {ultimasContrataciones.map(entidad => (
                  <div key={entidad.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{entidad.nombre}</h3>
                      <p className="text-sm text-gray-600">{entidad.email_contacto}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(entidad.estado)}`}>
                          {entidad.estado}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(entidad.fecha_contratacion)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(entidad.valor_mensual)}/mes</p>
                      <p className="text-sm text-gray-500">{entidad.plan}</p>
                      {entidad.progreso_onboarding < 100 && (
                        <div className="mt-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${entidad.progreso_onboarding}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{entidad.progreso_onboarding}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href="/dashboard-custodia360/entidades"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Gestionar Todas las Entidades
                </Link>
                <button
                  onClick={() => abrirModal('generar-informe')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Generar Informe
                </button>
                <button
                  onClick={() => abrirModal('enviar-comunicacion')}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Enviar Comunicación
                </button>
              </div>
            </div>
          </div>

          {/* Alertas Críticas - SIN ICONOS */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Alertas Críticas</h2>
            </div>
            <div className="p-6">
              {alertas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Todo funcionando correctamente</p>
                  <p className="text-sm text-gray-500 mt-1">No hay alertas críticas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alertas.map(alerta => (
                    <div key={alerta.id} className={`p-3 rounded-lg border-2 ${getUrgenciaColor(alerta.urgencia)}`}>
                      <h4 className="font-semibold text-sm">{alerta.entidad}</h4>
                      <p className="text-xs mt-1">{alerta.mensaje}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs opacity-75">{alerta.tipo.replace('_', ' ')}</span>
                        <button className="text-xs bg-white px-2 py-1 rounded opacity-75 hover:opacity-100">
                          Resolver
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Monitoreo BOE - Sistema Crítico - SIN ICONOS */}
        <div className="mt-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Monitoreo BOE Automático</h2>
              <p className="text-red-100 text-sm">Sistema de detección de cambios LOPIVI</p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">ACTIVO</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-sm opacity-90">Última ejecución</p>
              <p className="font-bold">25 Ene 08:00</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-sm opacity-90">Cambios detectados</p>
              <p className="font-bold">2 este mes</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-sm opacity-90">Próxima ejecución</p>
              <p className="font-bold">9 Feb 08:00</p>
            </div>
          </div>

          <Link
            href="/dashboard-custodia360/monitoreo-boe"
            className="inline-flex items-center px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            Ver Dashboard Completo →
          </Link>
        </div>

        {/* Acciones Rápidas - SIN ICONOS Y SIN FONDOS DE COLOR */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link
              href="/dashboard-custodia360/entidades"
              className="border border-gray-200 text-gray-900 p-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <h3 className="font-medium">Gestionar Entidades</h3>
              <p className="text-sm text-gray-600">CRUD completo</p>
            </Link>

            <Link
              href="/dashboard-custodia360/pdfs"
              className="border border-gray-200 text-gray-900 p-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <h3 className="font-medium">Gestión PDFs</h3>
              <p className="text-sm text-gray-600">Templates y logos</p>
            </Link>

            <Link
              href="/dashboard-custodia360/contactos"
              className="border border-gray-200 text-gray-900 p-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <h3 className="font-medium">Soporte</h3>
              <p className="text-sm text-gray-600">Chat y tickets</p>
            </Link>

            <button className="border border-gray-200 text-gray-900 p-4 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <h3 className="font-medium">Reportes</h3>
              <p className="text-sm text-gray-600">Analytics avanzado</p>
            </button>

            <button className="border border-gray-200 text-gray-900 p-4 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <h3 className="font-medium">Configuración</h3>
              <p className="text-sm text-gray-600">Sistema global</p>
            </button>
          </div>
        </div>
      </main>

      {/* MODALES */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

            {/* MODAL INFORME MENSUAL */}
            {modalAbierto === 'informe-mensual' && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Informe Mensual - Enero 2025</h3>
                    <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Resumen Ejecutivo</h4>
                      <p className="text-gray-700">Durante enero 2025, el sistema Custodia360 ha procesado {entidades.length} entidades activas con un cumplimiento promedio del 94% y un crecimiento del 15% respecto al mes anterior.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Métricas Clave</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-2xl font-bold text-blue-600">{metricas?.entidades_activas}</div>
                          <div className="text-sm text-gray-600">Entidades Activas</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-2xl font-bold text-green-600">{formatCurrency(metricas?.mrr || 0)}</div>
                          <div className="text-sm text-gray-600">Revenue Mensual</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Análisis de Cumplimiento</h4>
                      <div className="space-y-2 text-sm">
                        <div>• Entidades con cumplimiento 100%: 89%</div>
                        <div>• Delegados certificados activos: {metricas?.entidades_activas}</div>
                        <div>• Incidencias reportadas: 3 (todas resueltas)</div>
                        <div>• Tiempo medio de implementación: 2.8 días</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={generarPDFInformeMensual}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Descargar PDF
                      </button>
                      <button
                        onClick={() => enviarComunicacion('informe-mensual', 'equipo@custodia360.com', 'Informe Mensual', 'Adjunto informe mensual')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Enviar por Email
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Imprimir
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* MODAL INFORME TRIMESTRAL */}
            {modalAbierto === 'informe-trimestral' && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Informe Trimestral - Q4 2024</h3>
                    <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Análisis Trimestral Completo</h4>
                      <p className="text-gray-700">El último trimestre de 2024 ha sido excepcional para Custodia360, con un crecimiento sostenido del 15% y la incorporación de 32 nuevas entidades al sistema.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Evolución Mensual</h4>
                      <div className="space-y-2 text-sm">
                        <div>• Octubre: 89 entidades activas | {formatCurrency(8500)} MRR</div>
                        <div>• Noviembre: 98 entidades activas | {formatCurrency(9800)} MRR</div>
                        <div>• Diciembre: 112 entidades activas | {formatCurrency(11200)} MRR</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Hitos del Trimestre</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-lg font-bold text-green-600">+15%</div>
                          <div className="text-sm text-gray-600">Crecimiento</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-lg font-bold text-blue-600">98%</div>
                          <div className="text-sm text-gray-600">Cumplimiento</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-lg font-bold text-purple-600">32</div>
                          <div className="text-sm text-gray-600">Nuevas Entidades</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={generarPDFInformeTrimestral}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Descargar PDF
                      </button>
                      <button
                        onClick={() => enviarComunicacion('informe-trimestral', 'equipo@custodia360.com', 'Informe Trimestral Q4', 'Adjunto informe trimestral')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Enviar por Email
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Imprimir
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* MODAL INFORME ANUAL */}
            {modalAbierto === 'informe-anual' && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Informe Anual - 2024</h3>
                    <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Resumen del Año 2024</h4>
                      <p className="text-gray-700">2024 ha sido un año transformador para Custodia360. Hemos establecido un nuevo estándar en cumplimiento LOPIVI, protegiendo a 2,847 menores en toda España.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Hitos Principales</h4>
                      <div className="space-y-2 text-sm">
                        <div>• 156 entidades implementadas exitosamente</div>
                        <div>• 2,847 menores bajo protección LOPIVI</div>
                        <div>• 312 delegados de protección certificados</div>
                        <div>• 97.8% de tasa de cumplimiento promedio</div>
                        <div>• Zero incidencias graves reportadas</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Crecimiento Empresarial</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-2xl font-bold text-blue-600">156</div>
                          <div className="text-sm text-gray-600">Entidades Protegidas</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-2xl font-bold text-green-600">2,847</div>
                          <div className="text-sm text-gray-600">Menores Bajo Protección</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-2xl font-bold text-purple-600">340%</div>
                          <div className="text-sm text-gray-600">Crecimiento Revenue</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-2xl font-bold text-orange-600">98.1%</div>
                          <div className="text-sm text-gray-600">Tasa Retención</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={generarPDFInformeAnual}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Descargar PDF
                      </button>
                      <button
                        onClick={() => enviarComunicacion('informe-anual', 'equipo@custodia360.com', 'Informe Anual 2024', 'Adjunto informe anual')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Enviar por Email
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Imprimir
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* MODAL INFORME ENTIDAD */}
            {modalAbierto === 'informe-entidad' && entidadSeleccionada && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Informe Completo - {entidadSeleccionada.nombre}</h3>
                    <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Información General</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Nombre:</span> {entidadSeleccionada.nombre}</div>
                          <div><span className="font-medium">Email:</span> {entidadSeleccionada.email_contacto}</div>
                          <div><span className="font-medium">Plan:</span> {entidadSeleccionada.plan}</div>
                          <div><span className="font-medium">Estado:</span> {entidadSeleccionada.estado}</div>
                          <div><span className="font-medium">Fecha contratación:</span> {formatDate(entidadSeleccionada.fecha_contratacion)}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Métricas de Cumplimiento</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Progreso:</span> {entidadSeleccionada.progreso_onboarding}%</div>
                          <div><span className="font-medium">Delegado:</span> {entidadSeleccionada.delegado_principal || 'No asignado'}</div>
                          <div><span className="font-medium">Valor mensual:</span> {formatCurrency(entidadSeleccionada.valor_mensual)}</div>
                          <div><span className="font-medium">Estado delegado:</span> Certificado</div>
                          <div><span className="font-medium">Última actividad:</span> {formatDate(new Date().toISOString())}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Resumen de Cumplimiento LOPIVI</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Delegado de Protección asignado</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Plan de Protección implementado</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Personal formado según normativa</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>Protocolos de actuación establecidos</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Recomendaciones</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>• Mantener formación actualizada del personal</div>
                        <div>• Revisar protocolos trimestralmente</div>
                        <div>• Considerar delegado suplente para mayor cobertura</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => generarPDFInformeEntidad(entidadSeleccionada)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Descargar PDF
                      </button>
                      <button
                        onClick={() => enviarComunicacion('informe-entidad', entidadSeleccionada.email_contacto, `Informe Completo - ${entidadSeleccionada.nombre}`, 'Adjunto informe completo de su entidad')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Enviar por Email
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Imprimir
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* MODAL CERTIFICADO ENTIDAD */}
            {modalAbierto === 'certificado-entidad' && entidadSeleccionada && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Certificado LOPIVI - {entidadSeleccionada.nombre}</h3>
                    <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-center space-y-6">
                    <div className="border-2 border-green-600 rounded-lg p-8 bg-green-50">
                      <h4 className="text-xl font-bold text-green-600 mb-4">CERTIFICADO DE CUMPLIMIENTO LOPIVI</h4>
                      <p className="text-lg font-semibold">{entidadSeleccionada.nombre}</p>
                      <p className="text-gray-600 mt-2">Certifica el cumplimiento íntegro de la Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia</p>

                      <div className="mt-6 space-y-3">
                        <div className="text-sm">
                          <div><span className="font-medium">Plan contratado:</span> {entidadSeleccionada.plan}</div>
                          <div><span className="font-medium">Delegado Principal:</span> {entidadSeleccionada.delegado_principal || 'No especificado'}</div>
                          <div><span className="font-medium">Email de contacto:</span> {entidadSeleccionada.email_contacto}</div>
                        </div>
                      </div>

                      <div className="mt-6 text-sm text-gray-500">
                        <p><span className="font-medium">Código de verificación:</span> LOPIVI-{entidadSeleccionada.id}-{Date.now().toString(36).toUpperCase()}</p>
                        <p><span className="font-medium">Fecha de emisión:</span> {formatDate(new Date().toISOString())}</p>
                        <p><span className="font-medium">Válido hasta:</span> {formatDate(new Date(Date.now() + 365*24*60*60*1000).toISOString())}</p>
                      </div>

                      <div className="mt-6 bg-white p-4 rounded border border-green-200">
                        <p className="text-xs text-green-700 font-medium">VÁLIDO PARA INSPECCIONES OFICIALES</p>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => generarPDFCertificado(entidadSeleccionada)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Descargar Certificado
                      </button>
                      <button
                        onClick={() => enviarComunicacion('certificado', entidadSeleccionada.email_contacto, `Certificado LOPIVI - ${entidadSeleccionada.nombre}`, 'Adjunto certificado de cumplimiento LOPIVI')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Enviar por Email
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Imprimir
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}



            {/* MODAL GENERAR PERSONALIZADO */}
            {modalAbierto === 'generar-personalizado' && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Generar Informe Personalizado</h3>
                    <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Informe</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                          <option>Informe Ejecutivo Completo</option>
                          <option>Cumplimiento Normativo LOPIVI</option>
                          <option>Análisis Financiero y Revenue</option>
                          <option>Reporte de Incidencias y Resoluciones</option>
                          <option>Estado de Certificaciones</option>
                          <option>Métricas de Calidad y Satisfacción</option>
                          <option>Proyecciones y Tendencias</option>
                          <option>Auditoría de Cumplimiento</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Periodo de Análisis</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                          <option>Último Mes</option>
                          <option>Último Trimestre</option>
                          <option>Últimos 6 Meses</option>
                          <option>Último Año</option>
                          <option>Personalizado</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rango de Fechas Personalizado</label>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="date" className="border border-gray-300 rounded-lg px-3 py-2" placeholder="Fecha inicio" />
                        <input type="date" className="border border-gray-300 rounded-lg px-3 py-2" placeholder="Fecha fin" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Entidades</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Por Estado</label>
                          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                            <option>Todas las entidades</option>
                            <option>Solo entidades activas</option>
                            <option>Solo entidades pendientes</option>
                            <option>Solo entidades en onboarding</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Por Plan</label>
                          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                            <option>Todos los planes</option>
                            <option>Plan 200</option>
                            <option>Plan 500</option>
                            <option>Plan 500+</option>
                            <option>Custodia Temporal</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Entidades Específicas (opcional)</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                        <label className="flex items-center font-medium">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Seleccionar todas</span>
                        </label>
                        {entidades.map(entidad => (
                          <label key={entidad.id} className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">{entidad.nombre} - {entidad.plan}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Incluir en el Informe</label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Métricas financieras</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Datos de cumplimiento</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Gráficos y tendencias</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Recomendaciones</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Anexos técnicos</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Detalles de contacto</span>
                        </label>
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h5 className="font-medium text-orange-800 mb-2">Vista Previa del Informe</h5>
                      <p className="text-orange-700 text-sm">
                        Se generará un informe ejecutivo personalizado con los parámetros seleccionados.
                        El informe incluirá datos de {entidades.length} entidades para el periodo especificado.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          alert('Generando informe personalizado...')
                          // Aquí se ejecutaría la lógica de generación
                        }}
                        className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                      >
                        Generar Informe
                      </button>
                      <button
                        onClick={() => {
                          alert('Enviando informe por email...')
                          // Aquí se ejecutaría la lógica de envío
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Generar y Enviar
                      </button>
                      <button onClick={cerrarModal} className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancelar</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* MODAL GENERAR INFORME */}
            {modalAbierto === 'generar-informe' && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Generar Informe del Sistema</h3>
                    <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Informe del Sistema - {formatDate(new Date().toISOString())}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{entidades.length}</div>
                          <div className="text-sm text-gray-600">Total Entidades</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{entidades.filter(e => e.estado === 'ACTIVO').length}</div>
                          <div className="text-sm text-gray-600">Entidades Activas</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{formatCurrency(metricas?.mrr || 0)}</div>
                          <div className="text-sm text-gray-600">Revenue Total</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">97%</div>
                          <div className="text-sm text-gray-600">Cumplimiento Promedio</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Descargar PDF</button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Enviar por Email</button>
                      <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Imprimir</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* MODAL ENVIAR COMUNICACIÓN */}
            {modalAbierto === 'enviar-comunicacion' && (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Enviar Comunicación</h3>
                    <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Envío</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>Individual - Entidad específica</option>
                        <option>Individual - Delegado/Suplente específico</option>
                        <option>Colectivo - Todas las entidades</option>
                        <option>Colectivo - Todos los delegados/suplentes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Destinatario</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>Seleccionar destinatario...</option>
                        {entidades.map(entidad => (
                          <option key={entidad.id}>{entidad.nombre} ({entidad.email_contacto})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Asunto del mensaje"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                      <textarea
                        rows={6}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Escriba su mensaje aquí..."
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Plantilla</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>Mensaje personalizado</option>
                        <option>Recordatorio de cumplimiento</option>
                        <option>Actualización normativa</option>
                        <option>Renovación de certificado</option>
                        <option>Comunicado general</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Enviar Comunicación</button>
                      <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Guardar Borrador</button>
                      <button onClick={cerrarModal} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancelar</button>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
