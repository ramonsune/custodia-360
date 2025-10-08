'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'

export default function InformeInspeccionSuplentePage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [informeGenerado, setInformeGenerado] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (session) {
      setSessionData(JSON.parse(session))
    } else {
      router.push('/login-delegados')
    }
  }, [router])

  const datosInforme = {
    entidad: {
      nombre: sessionData?.entidad || 'Mi Entidad Deportiva',
      cif: 'G12345678',
      direccion: 'Calle Ejemplo 123, 28001 Madrid',
      telefono: '91 123 45 67',
      email: 'info@entidad.com',
      tipoActividad: 'Club Deportivo',
      numeroMenores: 85,
      fechaImplementacionLopivi: '15/01/2024'
    },
    cumplimiento: {
      porcentajeTotal: 87,
      elementosCompletados: 7,
      elementosTotales: 8,
      ultimaAuditoria: '10/01/2024',
      proximaRevision: '10/01/2025'
    },
    delegados: {
      principal: {
        nombre: 'Ana García López',
        email: 'principal@entidad.com',
        fechaCertificacion: '20/01/2024',
        estadoFormacion: 'Completada',
        vigenciaCertificado: '20/01/2026'
      },
      suplente: {
        nombre: sessionData?.nombre || 'Delegado Suplente',
        email: sessionData?.email || 'suplente@entidad.com',
        fechaCertificacion: 'Pendiente',
        estadoFormacion: 'En proceso',
        vigenciaCertificado: 'N/A'
      }
    },
    personal: {
      totalPersonal: 6,
      personalFormado: 4,
      personalPendiente: 2,
      ultimaFormacion: '25/01/2024',
      proximaFormacion: '15/02/2024'
    },
    documentacion: {
      planProteccion: { estado: 'Vigente', fechaActualizacion: '15/01/2024' },
      codigoConducta: { estado: 'Vigente', fechaActualizacion: '15/01/2024' },
      protocolosActuacion: { estado: 'Vigente', fechaActualizacion: '10/01/2024' },
      registroCasos: { estado: 'Actualizado', ultimaEntrada: '28/01/2024' },
      canalComunicacion: { estado: 'Activo', ultimaRevision: '20/01/2024' }
    },
    comunicaciones: {
      totalEnviadas: 23,
      aPersonal: 15,
      aFamilias: 8,
      ultimaComunicacion: '27/01/2024',
      tipoMasFreuente: 'Informativo'
    },
    casos: {
      totalGestionados: 3,
      casosActivos: 2,
      casosCerrados: 1,
      ultimoCaso: '20/01/2024',
      tiempotPromedioCierre: '7 días'
    },
    mapaRiesgos: {
      riesgosIdentificados: 8,
      riesgosAltos: 0,
      riesgosMedios: 3,
      riesgosBajos: 5,
      ultimaEvaluacion: '15/01/2024'
    },
    formacion: {
      horasCompletadas: 24,
      modulosFinalizados: 8,
      certificacionesObtenidas: 1,
      proximaFormacion: '01/02/2024'
    }
  }

  const generarInformePDF = () => {
    setLoading(true)

    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      let yPos = 20

      // Función para añadir nueva página si es necesario
      const checkNewPage = (neededSpace = 20) => {
        if (yPos + neededSpace > pageHeight - 20) {
          doc.addPage()
          yPos = 20
        }
      }

      // Header del informe
      doc.setFillColor(37, 99, 235)
      doc.rect(0, 0, pageWidth, 40, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('INFORME LOPIVI PARA INSPECCIÓN', pageWidth / 2, 20, { align: 'center' })

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text('Sistema Custodia360 - Cumplimiento Normativo Integral', pageWidth / 2, 30, { align: 'center' })

      yPos = 60
      doc.setTextColor(0, 0, 0)

      // 1. INFORMACIÓN GENERAL DE LA ENTIDAD
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('1. INFORMACIÓN GENERAL DE LA ENTIDAD', 20, yPos)
      yPos += 15

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)

      const infoGeneral = [
        `Denominación: ${datosInforme.entidad.nombre}`,
        `CIF: ${datosInforme.entidad.cif}`,
        `Dirección: ${datosInforme.entidad.direccion}`,
        `Teléfono: ${datosInforme.entidad.telefono}`,
        `Email: ${datosInforme.entidad.email}`,
        `Tipo de actividad: ${datosInforme.entidad.tipoActividad}`,
        `Número de menores atendidos: ${datosInforme.entidad.numeroMenores}`,
        `Fecha de implementación LOPIVI: ${datosInforme.entidad.fechaImplementacionLopivi}`
      ]

      infoGeneral.forEach(line => {
        checkNewPage()
        doc.text(line, 20, yPos)
        yPos += 7
      })

      yPos += 10

      // 2. ESTADO DE CUMPLIMIENTO GLOBAL
      checkNewPage(40)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('2. ESTADO DE CUMPLIMIENTO GLOBAL', 20, yPos)
      yPos += 15

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)

      const cumplimientoData = [
        `Porcentaje de cumplimiento actual: ${datosInforme.cumplimiento.porcentajeTotal}%`,
        `Elementos completados: ${datosInforme.cumplimiento.elementosCompletados} de ${datosInforme.cumplimiento.elementosTotales}`,
        `Última auditoría interna: ${datosInforme.cumplimiento.ultimaAuditoria}`,
        `Próxima revisión programada: ${datosInforme.cumplimiento.proximaRevision}`
      ]

      cumplimientoData.forEach(line => {
        checkNewPage()
        doc.text(line, 20, yPos)
        yPos += 7
      })

      // Barra de progreso visual
      yPos += 10
      checkNewPage(15)
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(1)
      doc.rect(20, yPos, 120, 10)

      doc.setFillColor(37, 99, 235)
      doc.rect(20, yPos, (120 * datosInforme.cumplimiento.porcentajeTotal) / 100, 10, 'F')

      doc.setFontSize(8)
      doc.text(`${datosInforme.cumplimiento.porcentajeTotal}%`, 145, yPos + 7)
      yPos += 25

      // 3. DELEGADOS DE PROTECCIÓN
      checkNewPage(50)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('3. DELEGADOS DE PROTECCIÓN', 20, yPos)
      yPos += 15

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('3.1 Delegado Principal:', 20, yPos)
      yPos += 10

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const delegadoPrincipal = [
        `Nombre: ${datosInforme.delegados.principal.nombre}`,
        `Email: ${datosInforme.delegados.principal.email}`,
        `Fecha de certificación: ${datosInforme.delegados.principal.fechaCertificacion}`,
        `Estado de formación: ${datosInforme.delegados.principal.estadoFormacion}`,
        `Vigencia del certificado: ${datosInforme.delegados.principal.vigenciaCertificado}`
      ]

      delegadoPrincipal.forEach(line => {
        checkNewPage()
        doc.text(line, 25, yPos)
        yPos += 6
      })

      yPos += 10
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('3.2 Delegado Suplente:', 20, yPos)
      yPos += 10

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const delegadoSuplente = [
        `Nombre: ${datosInforme.delegados.suplente.nombre}`,
        `Email: ${datosInforme.delegados.suplente.email}`,
        `Fecha de certificación: ${datosInforme.delegados.suplente.fechaCertificacion}`,
        `Estado de formación: ${datosInforme.delegados.suplente.estadoFormacion}`,
        `Vigencia del certificado: ${datosInforme.delegados.suplente.vigenciaCertificado}`
      ]

      delegadoSuplente.forEach(line => {
        checkNewPage()
        doc.text(line, 25, yPos)
        yPos += 6
      })

      yPos += 15

      // 4. ESTADO DEL PERSONAL
      checkNewPage(40)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('4. ESTADO DEL PERSONAL', 20, yPos)
      yPos += 15

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)

      const personalData = [
        `Total de personal: ${datosInforme.personal.totalPersonal} personas`,
        `Personal formado en LOPIVI: ${datosInforme.personal.personalFormado} personas (${Math.round((datosInforme.personal.personalFormado/datosInforme.personal.totalPersonal)*100)}%)`,
        `Personal pendiente de formación: ${datosInforme.personal.personalPendiente} personas`,
        `Última sesión de formación: ${datosInforme.personal.ultimaFormacion}`,
        `Próxima formación programada: ${datosInforme.personal.proximaFormacion}`
      ]

      personalData.forEach(line => {
        checkNewPage()
        doc.text(line, 20, yPos)
        yPos += 7
      })

      yPos += 15

      // 5. DOCUMENTACIÓN OFICIAL
      checkNewPage(50)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('5. DOCUMENTACIÓN OFICIAL LOPIVI', 20, yPos)
      yPos += 15

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)

      const documentos = [
        { nombre: 'Plan de Protección Infantil', ...datosInforme.documentacion.planProteccion },
        { nombre: 'Código de Conducta', ...datosInforme.documentacion.codigoConducta },
        { nombre: 'Protocolos de Actuación', ...datosInforme.documentacion.protocolosActuacion },
        { nombre: 'Registro de Casos', ...datosInforme.documentacion.registroCasos },
        { nombre: 'Canal de Comunicación', ...datosInforme.documentacion.canalComunicacion }
      ]

      documentos.forEach(documento => {
        checkNewPage()
        doc.text(`${documento.nombre}: ${documento.estado} (Actualizado: ${documento.fechaActualizacion || documento.ultimaEntrada || documento.ultimaRevision})`, 20, yPos)
        yPos += 7
      })

      yPos += 15

      // 6. GESTIÓN DE COMUNICACIONES
      checkNewPage(30)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('6. GESTIÓN DE COMUNICACIONES', 20, yPos)
      yPos += 15

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)

      const comunicacionesData = [
        `Total de comunicaciones enviadas: ${datosInforme.comunicaciones.totalEnviadas}`,
        `Comunicaciones a personal: ${datosInforme.comunicaciones.aPersonal}`,
        `Comunicaciones a familias: ${datosInforme.comunicaciones.aFamilias}`,
        `Última comunicación: ${datosInforme.comunicaciones.ultimaComunicacion}`,
        `Tipo más frecuente: ${datosInforme.comunicaciones.tipoMasFreuente}`
      ]

      comunicacionesData.forEach(line => {
        checkNewPage()
        doc.text(line, 20, yPos)
        yPos += 7
      })

      yPos += 15

      // 7. GESTIÓN DE CASOS
      checkNewPage(30)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('7. GESTIÓN DE CASOS LOPIVI', 20, yPos)
      yPos += 15

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)

      const casosData = [
        `Total de casos gestionados: ${datosInforme.casos.totalGestionados}`,
        `Casos activos: ${datosInforme.casos.casosActivos}`,
        `Casos cerrados: ${datosInforme.casos.casosCerrados}`,
        `Último caso registrado: ${datosInforme.casos.ultimoCaso}`,
        `Tiempo promedio de cierre: ${datosInforme.casos.tiempotPromedioCierre}`
      ]

      casosData.forEach(line => {
        checkNewPage()
        doc.text(line, 20, yPos)
        yPos += 7
      })

      yPos += 15

      // 8. MAPA DE RIESGOS
      checkNewPage(30)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('8. MAPA DE RIESGOS', 20, yPos)
      yPos += 15

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)

      const riesgosData = [
        `Total de riesgos identificados: ${datosInforme.mapaRiesgos.riesgosIdentificados}`,
        `Riesgos de nivel alto: ${datosInforme.mapaRiesgos.riesgosAltos}`,
        `Riesgos de nivel medio: ${datosInforme.mapaRiesgos.riesgosMedios}`,
        `Riesgos de nivel bajo: ${datosInforme.mapaRiesgos.riesgosBajos}`,
        `Última evaluación: ${datosInforme.mapaRiesgos.ultimaEvaluacion}`
      ]

      riesgosData.forEach(line => {
        checkNewPage()
        doc.text(line, 20, yPos)
        yPos += 7
      })

      yPos += 15

      // 9. FORMACIÓN COMPLETADA
      checkNewPage(30)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('9. ESTADO DE FORMACIÓN', 20, yPos)
      yPos += 15

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)

      const formacionData = [
        `Horas de formación completadas: ${datosInforme.formacion.horasCompletadas}`,
        `Módulos finalizados: ${datosInforme.formacion.modulosFinalizados}`,
        `Certificaciones obtenidas: ${datosInforme.formacion.certificacionesObtenidas}`,
        `Próxima formación programada: ${datosInforme.formacion.proximaFormacion}`
      ]

      formacionData.forEach(line => {
        checkNewPage()
        doc.text(line, 20, yPos)
        yPos += 7
      })

      yPos += 20

      // 10. CONCLUSIONES Y RECOMENDACIONES
      checkNewPage(40)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('10. CONCLUSIONES Y RECOMENDACIONES', 20, yPos)
      yPos += 15

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)

      const conclusiones = [
        `La entidad ${datosInforme.entidad.nombre} presenta un nivel de cumplimiento LOPIVI del ${datosInforme.cumplimiento.porcentajeTotal}%, considerado como ALTO.`,
        '',
        'FORTALEZAS IDENTIFICADAS:',
        '• Plan de Protección Infantil vigente y actualizado',
        '• Delegado Principal certificado y operativo',
        '• Sistema de comunicaciones activo y documentado',
        '• Gestión de casos conforme a protocolos LOPIVI',
        '• Documentación oficial completa y actualizada',
        '',
        'ÁREAS DE MEJORA:',
        '• Completar certificación del delegado suplente',
        '• Finalizar formación LOPIVI de todo el personal',
        '• Programar auditoría anual de cumplimiento',
        '',
        'VALORACIÓN FINAL:',
        'La entidad cumple con los requisitos mínimos establecidos por la LOPIVI y',
        'mantiene un sistema de protección infantil robusto y documentado.'
      ]

      conclusiones.forEach(line => {
        checkNewPage()
        if (line.startsWith('•') || line.startsWith('FORTALEZAS') || line.startsWith('ÁREAS') || line.startsWith('VALORACIÓN')) {
          doc.setFont('helvetica', 'bold')
        } else {
          doc.setFont('helvetica', 'normal')
        }
        doc.text(line, 20, yPos)
        yPos += 6
      })

      yPos += 20

      // FIRMA Y VALIDACIÓN
      checkNewPage(30)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('VALIDACIÓN DEL INFORME', 20, yPos)
      yPos += 15

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text(`Informe generado por: ${datosInforme.delegados.suplente.nombre}`, 20, yPos)
      yPos += 7
      doc.text(`Cargo: Delegado Suplente de Protección`, 20, yPos)
      yPos += 7
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, yPos)
      yPos += 7
      doc.text(`Sistema: Custodia360 - Cumplimiento LOPIVI`, 20, yPos)

      // Sello oficial
      yPos += 20
      doc.setDrawColor(37, 99, 235)
      doc.setLineWidth(2)
      doc.roundedRect(20, yPos, 80, 25, 3, 3)

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('CUSTODIA360', 60, yPos + 10, { align: 'center' })

      doc.setFontSize(8)
      doc.text('INFORME OFICIAL LOPIVI', 60, yPos + 18, { align: 'center' })

      // Pie de página en todas las páginas
      const totalPages = doc.internal.pages.length - 1
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.text('Custodia360 - Informe LOPIVI para Inspección', pageWidth / 2, pageHeight - 10, { align: 'center' })
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: 'right' })
      }

      // Descargar PDF
      doc.save(`Informe_Inspeccion_LOPIVI_${datosInforme.entidad.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)

      setInformeGenerado(true)

      // Guardar en historial
      const historial = JSON.parse(localStorage.getItem('historial_informes_inspeccion') || '[]')
      const nuevoInforme = {
        id: Date.now().toString(),
        fecha: new Date().toISOString(),
        entidad: datosInforme.entidad.nombre,
        cumplimiento: datosInforme.cumplimiento.porcentajeTotal,
        generadoPor: datosInforme.delegados.suplente.nombre
      }
      localStorage.setItem('historial_informes_inspeccion', JSON.stringify([nuevoInforme, ...historial]))

    } catch (error) {
      console.error('Error generando informe:', error)
      alert('Error al generar el informe. Por favor, inténtelo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const enviarInforme = () => {
    // Simular envío por email
    alert('Informe enviado exitosamente a las autoridades competentes y dirección de la entidad.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard-suplente" className="text-blue-600 hover:text-blue-800 mr-4">
                ← Volver al Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Informe de Inspección LOPIVI</h1>
            </div>
            <span className="text-sm text-gray-600">
              {sessionData?.nombre} - Delegado Suplente
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Información del informe */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Generador de Informe para Inspección</h2>
              <p className="text-gray-600 mt-2">Informe completo del estado de cumplimiento LOPIVI de su entidad</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{datosInforme.cumplimiento.porcentajeTotal}%</div>
              <div className="text-sm text-gray-600">Cumplimiento actual</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">Entidad</h3>
              <p className="text-sm text-blue-800">{datosInforme.entidad.nombre}</p>
              <p className="text-xs text-blue-600">{datosInforme.entidad.numeroMenores} menores</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-2">Personal</h3>
              <p className="text-sm text-green-800">{datosInforme.personal.personalFormado}/{datosInforme.personal.totalPersonal} formado</p>
              <p className="text-xs text-green-600">{Math.round((datosInforme.personal.personalFormado/datosInforme.personal.totalPersonal)*100)}% completado</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-purple-900 mb-2">Casos</h3>
              <p className="text-sm text-purple-800">{datosInforme.casos.casosActivos} activos</p>
              <p className="text-xs text-purple-600">{datosInforme.casos.totalGestionados} total gestionados</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-bold text-orange-900 mb-2">Riesgos</h3>
              <p className="text-sm text-orange-800">{datosInforme.mapaRiesgos.riesgosAltos} alto / {datosInforme.mapaRiesgos.riesgosMedios} medio</p>
              <p className="text-xs text-orange-600">{datosInforme.mapaRiesgos.riesgosIdentificados} total identificados</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-yellow-900 mb-3">Contenido del Informe de Inspección:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
              <div>
                <h4 className="font-medium mb-2">Documentación Incluida:</h4>
                <ul className="space-y-1">
                  <li>• Información general de la entidad</li>
                  <li>• Estado de cumplimiento global</li>
                  <li>• Certificación de delegados</li>
                  <li>• Estado de formación del personal</li>
                  <li>• Documentación oficial LOPIVI</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Análisis Operativo:</h4>
                <ul className="space-y-1">
                  <li>• Gestión de comunicaciones</li>
                  <li>• Registro de casos gestionados</li>
                  <li>• Mapa de riesgos actualizado</li>
                  <li>• Estado de formación completada</li>
                  <li>• Conclusiones y recomendaciones</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={generarInformePDF}
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-bold text-white transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando informe...
                </span>
              ) : (
                'Generar y Descargar Informe PDF'
              )}
            </button>

            {informeGenerado && (
              <button
                onClick={enviarInforme}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
              >
                Enviar Informe por Email
              </button>
            )}
          </div>

          {informeGenerado && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-green-600 text-2xl mr-3">✅</span>
                <div>
                  <h3 className="font-bold text-green-900">Informe generado exitosamente</h3>
                  <p className="text-sm text-green-800">
                    El informe de inspección LOPIVI ha sido generado y descargado.
                    Puede enviarlo a las autoridades competentes o conservarlo para futuras inspecciones.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vista previa de secciones */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Vista Previa del Contenido</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">1. Información General</h4>
                <p className="text-sm text-gray-600">Datos completos de la entidad, CIF, dirección, tipo de actividad y número de menores atendidos.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">2. Estado de Cumplimiento</h4>
                <p className="text-sm text-gray-600">Porcentaje de cumplimiento actual, elementos completados y calendario de auditorías.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">3. Delegados de Protección</h4>
                <p className="text-sm text-gray-600">Estado de certificación y formación de delegado principal y suplente.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">4. Estado del Personal</h4>
                <p className="text-sm text-gray-600">Formación LOPIVI completada, personal pendiente y programación de capacitaciones.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">5. Documentación Oficial</h4>
                <p className="text-sm text-gray-600">Estado de Plan de Protección, códigos de conducta, protocolos y registros oficiales.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">6. Gestión de Comunicaciones</h4>
                <p className="text-sm text-gray-600">Estadísticas de comunicaciones enviadas a personal y familias con fechas y tipos.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">7. Gestión de Casos</h4>
                <p className="text-sm text-gray-600">Casos gestionados, activos, cerrados y tiempos promedio de resolución.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">8. Mapa de Riesgos</h4>
                <p className="text-sm text-gray-600">Evaluación completa de riesgos identificados por niveles y fecha de última revisión.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">9. Estado de Formación</h4>
                <p className="text-sm text-gray-600">Horas completadas, módulos finalizados, certificaciones obtenidas y próximas formaciones.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">10. Conclusiones</h4>
                <p className="text-sm text-gray-600">Valoración final, fortalezas identificadas, áreas de mejora y recomendaciones específicas.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
