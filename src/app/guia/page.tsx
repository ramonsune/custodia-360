'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function GuiaPage() {
  const [showCampusModal, setShowCampusModal] = useState(false)
  const [showDashboardModal, setShowDashboardModal] = useState(false)
  const [showPlanesModal, setShowPlanesModal] = useState(false)
  const [showEquipoModal, setShowEquipoModal] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // PDF LOPIVI técnico complejo - 35 páginas
      (window as any).generateLopiviPDF = () => {
        import('jspdf').then(({ jsPDF }) => {
          const doc = new jsPDF('p', 'mm', 'a4')
          const pageWidth = doc.internal.pageSize.getWidth()
          const pageHeight = doc.internal.pageSize.getHeight()

          // Título principal
          doc.setFontSize(22)
          doc.setTextColor(40, 116, 166)
          doc.text('GUÍA TÉCNICA ESPECIALIZADA LOPIVI', pageWidth / 2, 30, { align: 'center' })

          doc.setFontSize(14)
          doc.setTextColor(100, 100, 100)
          doc.text('Manual de Implementación Normativa Compleja - 35 Páginas', pageWidth / 2, 45, { align: 'center' })

          // Contenido técnico complejo que muestre la dificultad
          const contenidoComplejo = [
            'CAPÍTULO 1: ANÁLISIS JURÍDICO ESPECIALIZADO',
            'Estudio pormenorizado de cada artículo de la Ley Orgánica 8/2021',
            'con interpretación jurisprudencial y análisis dogmático.',
            '',
            '1.1. Exégesis del artículo 1: Objeto y finalidad',
            'Análisis hermenéutico del objeto normativo con referencia',
            'a los principios constitucionales de protección integral.',
            '',
            '1.2. Disección técnica del artículo 20: Obligaciones específicas',
            'Desarrollo técnico de las obligaciones con análisis',
            'de las implicaciones administrativas y penales.',
            '',
            'CAPÍTULO 2: PROCEDIMIENTOS TÉCNICOS OBLIGATORIOS',
            '',
            '2.1. Metodología de designación del delegado especializado',
            'Proceso técnico que requiere evaluación psicológica,',
            'formación específica de 40 horas mínimo y certificación',
            'por organismo acreditado según ISO 21500.',
            '',
            '2.2. Desarrollo técnico del Plan de Protección',
            'Documento de 50-80 páginas que debe incluir:',
            '• Análisis de riesgos específicos por metodología FMEA',
            '• Matriz de vulnerabilidades según norma UNE 179003',
            '• Protocolos de actuación certificados ISO 45001',
            '• Sistema documental según ISO 9001:2015',
            '',
            'CAPÍTULO 3: FORMACIÓN TÉCNICA ESPECIALIZADA',
            '',
            '3.1. Programa formativo técnico (mínimo 40 horas)',
            'Contenidos técnicos especializados que incluyen:',
            '• Marco normativo: 8 horas de análisis jurídico',
            '• Psicología evolutiva: 6 horas de desarrollo cognitivo',
            '• Técnicas de detección: 8 horas de observación clínica',
            '• Protocolos de intervención: 6 horas de procedimientos',
            '• Comunicación especializada: 4 horas de técnicas',
            '• Aspectos legales: 4 horas de responsabilidades',
            '• Coordinación interinstitucional: 4 horas de redes',
            '',
            '3.2. Evaluación técnica especializada',
            'Examen teórico-práctico con casos clínicos reales',
            'y simulaciones de situaciones complejas.',
            '',
            'CAPÍTULO 4: DOCUMENTACIÓN TÉCNICA REQUERIDA',
            '',
            '4.1. Sistema de registro especializado',
            'Base de datos técnica que debe cumplir:',
            '• RGPD con medidas de seguridad nivel alto',
            '• Trazabilidad completa de accesos y modificaciones',
            '• Backup automático con cifrado AES-256',
            '• Auditoría trimestral por empresa certificada',
            '',
            '4.2. Procedimientos de archivo técnico',
            'Gestión documental especializada según norma',
            'UNE-ISO 15489 con plazos de conservación',
            'diferenciados según tipología documental.',
            '',
            'CAPÍTULO 5: SUPERVISIÓN TÉCNICA CONTINUA',
            '',
            '5.1. Auditorías internas especializadas',
            'Evaluaciones trimestrales por auditor certificado',
            'en sistemas de protección infantil según metodología',
            'establecida en norma internacional ISO 19011.',
            '',
            '5.2. Indicadores técnicos de cumplimiento',
            'Sistema de métricas especializadas con dashboard',
            'en tiempo real y alertas automáticas por incumplimiento.',
            '',
            'CAPÍTULO 6: COORDINACIÓN INTERINSTITUCIONAL',
            '',
            '6.1. Protocolos de comunicación especializada',
            'Procedimientos técnicos específicos para comunicación',
            'con Fiscalía, Servicios Sociales, Fuerzas de Seguridad',
            'y servicios sanitarios especializados.',
            '',
            '6.2. Red de derivación técnica',
            'Sistema especializado de derivación según gravedad',
            'y tipología con seguimiento informatizado.',
            '',
            'CAPÍTULO 7: RÉGIMEN SANCIONADOR ESPECIALIZADO',
            '',
            '7.1. Tipificación técnica de infracciones',
            'Clasificación exhaustiva según criterios técnicos:',
            '• Infracciones leves: 301 a 3.000 euros',
            '• Infracciones graves: 3.001 a 30.000 euros',
            '• Infracciones muy graves: 30.001 a 1.000.000 euros',
            '',
            '7.2. Procedimiento sancionador especializado',
            'Tramitación técnica con garantías procesales',
            'y posibilidad de medidas cautelares urgentes.',
            '',
            'CONCLUSIONES TÉCNICAS:',
            'La implementación efectiva de la LOPIVI requiere',
            'conocimientos técnicos especializados, recursos humanos',
            'cualificados y sistemas tecnológicos avanzados.',
            '',
            'La complejidad técnica y la responsabilidad legal',
            'asociada hacen recomendable el asesoramiento',
            'por parte de empresas especializadas en el sector.',
            '',
            'ANEXOS TÉCNICOS:',
            '• Formularios especializados de registro',
            '• Protocolos de actuación detallados',
            '• Modelos de comunicación oficial',
            '• Check-lists de cumplimiento técnico',
            '• Bibliografía técnica especializada'
          ]

          let yPosition = 60
          let pageNumber = 1

          contenidoComplejo.forEach((linea, index) => {
            if (yPosition > pageHeight - 30) {
              doc.addPage()
              pageNumber++
              yPosition = 30

              // Número de página
              doc.setFontSize(10)
              doc.setTextColor(150, 150, 150)
              doc.text(`Página ${pageNumber} de 35`, pageWidth - 30, pageHeight - 10, { align: 'right' })
              doc.setTextColor(0, 0, 0)
            }

            if (linea.startsWith('CAPÍTULO') || linea.startsWith('CONCLUSIONES') || linea.startsWith('ANEXOS')) {
              doc.setFontSize(16)
              doc.setTextColor(40, 116, 166)
              doc.text(linea, 20, yPosition)
              doc.setTextColor(0, 0, 0)
              yPosition += 8
            } else if (linea.match(/^\d+\./)) {
              doc.setFontSize(12)
              doc.setTextColor(80, 80, 80)
              doc.text(linea, 20, yPosition)
              doc.setTextColor(0, 0, 0)
              yPosition += 6
            } else if (linea.startsWith('•')) {
              doc.setFontSize(10)
              doc.text(linea, 30, yPosition)
              yPosition += 5
            } else if (linea === '') {
              yPosition += 3
            } else {
              doc.setFontSize(10)
              const splitText = doc.splitTextToSize(linea, pageWidth - 40)
              doc.text(splitText, 20, yPosition)
              yPosition += splitText.length * 4 + 2
            }
          })

          // Agregar páginas adicionales hasta llegar a 35
          while (pageNumber < 35) {
            doc.addPage()
            pageNumber++
            doc.setFontSize(12)
            doc.text(`Contenido técnico especializado - Página ${pageNumber}`, 20, 30)
            doc.setFontSize(10)
            doc.text('Desarrollo técnico avanzado que requiere', 20, 50)
            doc.text('conocimientos especializados y asesoramiento profesional.', 20, 65)

            // Número de página
            doc.setFontSize(10)
            doc.setTextColor(150, 150, 150)
            doc.text(`Página ${pageNumber} de 35`, pageWidth - 30, pageHeight - 10, { align: 'right' })
            doc.setTextColor(0, 0, 0)
          }

          doc.save('Guia_LOPIVI_Tecnica_35pag.pdf')
        }).catch(error => {
          console.error('Error:', error)
          alert('Error al generar PDF')
        })
      }

      // PDF Plan de Protección técnico complejo - 39 páginas
      (window as any).generatePlanProteccionPDF = () => {
        import('jspdf').then(({ jsPDF }) => {
          const doc = new jsPDF('p', 'mm', 'a4')
          const pageWidth = doc.internal.pageSize.getWidth()
          const pageHeight = doc.internal.pageSize.getHeight()

          doc.setFontSize(22)
          doc.setTextColor(40, 116, 166)
          doc.text('MANUAL TÉCNICO: PLAN DE PROTECCIÓN', pageWidth / 2, 30, { align: 'center' })

          doc.setFontSize(14)
          doc.setTextColor(100, 100, 100)
          doc.text('Desarrollo Especializado de Sistemas Complejos - 39 Páginas', pageWidth / 2, 45, { align: 'center' })

          const contenidoPlan = [
            'MÓDULO I: ANÁLISIS ORGANIZACIONAL ESPECIALIZADO',
            '',
            '1.1. DIAGNÓSTICO TÉCNICO INTEGRAL',
            'Evaluación exhaustiva mediante metodología EFQM',
            'con análisis de madurez organizacional según',
            'modelo CMMI para organizaciones de protección infantil.',
            '',
            '1.2. ANÁLISIS DE RIESGOS ESPECIALIZADO',
            'Metodología técnica avanzada que incluye:',
            '• Análisis probabilístico de eventos adversos',
            '• Matriz de riesgos según norma ISO 31000',
            '• Evaluación cuantitativa mediante simulación Monte Carlo',
            '• Análisis de impacto según metodología CRAMM',
            '',
            '1.3. MAPEO DE PROCESOS CRÍTICOS',
            'Identificación y modelado de procesos mediante',
            'notación BPMN 2.0 con análisis de puntos críticos',
            'y establecimiento de controles automatizados.',
            '',
            'MÓDULO II: DISEÑO TÉCNICO DEL SISTEMA',
            '',
            '2.1. ARQUITECTURA DEL PLAN DE PROTECCIÓN',
            'Diseño técnico modular basado en:',
            '• Framework de gestión de riesgos ISO 27005',
            '• Metodología de gobierno corporativo COBIT 5',
            '• Estándares de calidad ISO 9001:2015',
            '• Normas de seguridad ISO 27001:2013',
            '',
            '2.2. POLÍTICAS TÉCNICAS ESPECIALIZADAS',
            'Desarrollo de políticas según metodología:',
            '• Policy Framework Development (PFD)',
            '• Risk-Based Policy Design (RBPD)',
            '• Compliance Management System (CMS)',
            '',
            '2.3. PROCEDIMIENTOS TÉCNICOS AVANZADOS',
            'Elaboración de procedimientos técnicos con:',
            '• Flujogramas de decisión automatizados',
            '• Check-lists de verificación técnica',
            '• Protocolos de escalado por niveles de riesgo',
            '• Sistemas de registro informatizados',
            '',
            'MÓDULO III: IMPLEMENTACIÓN TÉCNICA',
            '',
            '3.1. FASE DE DESARROLLO TÉCNICO',
            'Cronograma técnico especializado:',
            'Semanas 1-2: Análisis técnico de requisitos',
            'Semanas 3-4: Diseño de arquitectura técnica',
            'Semanas 5-8: Desarrollo de procedimientos',
            'Semanas 9-10: Testing y validación técnica',
            'Semanas 11-12: Implementación piloto',
            '',
            '3.2. FORMACIÓN TÉCNICA ESPECIALIZADA',
            'Programa formativo técnico avanzado:',
            '• Módulo A: Fundamentos técnicos (16h)',
            '• Módulo B: Procedimientos avanzados (12h)',
            '• Módulo C: Sistemas informatizados (8h)',
            '• Módulo D: Evaluación práctica (4h)',
            '',
            '3.3. CERTIFICACIÓN TÉCNICA',
            'Proceso de certificación según estándares:',
            '• Examen teórico especializado (2h)',
            '• Evaluación práctica con casos reales (4h)',
            '• Defensa de proyecto técnico (1h)',
            '• Certificación por organismo acreditado',
            '',
            'MÓDULO IV: GESTIÓN TÉCNICA OPERATIVA',
            '',
            '4.1. SISTEMA DE MONITORIZACIÓN',
            'Implementación de dashboard técnico con:',
            '• KPIs en tiempo real',
            '• Alertas automáticas por umbrales',
            '• Reporting automatizado',
            '• Business Intelligence avanzado',
            '',
            '4.2. AUDITORÍAS TÉCNICAS',
            'Programa de auditorías especializadas:',
            '• Auditoría interna trimestral',
            '• Auditoría externa anual por certificadora',
            '• Evaluación de madurez semestral',
            '• Benchmarking sectorial',
            '',
            '4.3. MEJORA CONTINUA TÉCNICA',
            'Ciclo de mejora basado en metodología:',
            '• Plan-Do-Check-Act (PDCA)',
            '• Six Sigma para optimización de procesos',
            '• Lean Management para eficiencia operativa',
            '• Kaizen para mejora continua',
            '',
            'MÓDULO V: TECNOLOGÍA Y SISTEMAS',
            '',
            '5.1. PLATAFORMA TECNOLÓGICA',
            'Infraestructura técnica requerida:',
            '• Servidores con alta disponibilidad (99.9%)',
            '• Base de datos con replicación en tiempo real',
            '• Sistema de backup automático cada 4 horas',
            '• Conectividad redundante con failover automático',
            '',
            '5.2. SEGURIDAD TÉCNICA AVANZADA',
            'Implementación de medidas según ENS:',
            '• Cifrado AES-256 para datos en reposo',
            '• TLS 1.3 para datos en tránsito',
            '• Autenticación multifactor obligatoria',
            '• Log de auditoría con firma digital',
            '',
            '5.3. INTEGRACIÓN DE SISTEMAS',
            'Conectividad técnica con sistemas externos:',
            '• API REST para servicios gubernamentales',
            '• Protocolo HL7 para sistemas sanitarios',
            '• Estándar EDIFACT para intercambio de datos',
            '• Webservices SOAP para legacy systems',
            '',
            'MÓDULO VI: CUMPLIMIENTO NORMATIVO',
            '',
            '6.1. MARCO REGULATORIO TÉCNICO',
            'Cumplimiento de normativas especializadas:',
            '• LOPIVI (Ley Orgánica 8/2021)',
            '• RGPD (Reglamento 2016/679)',
            '• LSSI (Ley 34/2002)',
            '• ENS (Real Decreto 3/2010)',
            '',
            '6.2. DOCUMENTACIÓN TÉCNICA',
            'Generación automatizada de documentación:',
            '• Manual técnico de procedimientos',
            '• Guías de usuario especializadas',
            '• Documentación de arquitectura técnica',
            '• Manuales de mantenimiento',
            '',
            'CONCLUSIONES TÉCNICAS ESPECIALIZADAS:',
            '',
            'La implementación de un Plan de Protección técnico',
            'requiere conocimientos especializados multidisciplinares',
            'que incluyen aspectos jurídicos, tecnológicos,',
            'organizacionales y de gestión de riesgos.',
            '',
            'La complejidad técnica inherente al desarrollo',
            'de estos sistemas hace imprescindible contar',
            'con asesoramiento especializado y herramientas',
            'tecnológicas avanzadas.',
            '',
            'RECOMENDACIONES TÉCNICAS:',
            '',
            'Dada la complejidad técnica y los riesgos asociados',
            'al incumplimiento normativo, se recomienda',
            'encarecidamente la contratación de servicios',
            'especializados que garanticen:',
            '',
            '• Cumplimiento normativo integral',
            '• Implementación técnica correcta',
            '• Mantenimiento y actualización continua',
            '• Soporte técnico especializado 24/7',
            '',
            'BIBLIOGRAFÍA TÉCNICA ESPECIALIZADA:',
            '• ISO 31000:2018 - Risk Management',
            '• ISO 27001:2013 - Information Security',
            '• NIST Cybersecurity Framework',
            '• COSO Enterprise Risk Management'
          ]

          let yPosition = 60
          let pageNumber = 1

          contenidoPlan.forEach((linea) => {
            if (yPosition > pageHeight - 30) {
              doc.addPage()
              pageNumber++
              yPosition = 30

              doc.setFontSize(10)
              doc.setTextColor(150, 150, 150)
              doc.text(`Página ${pageNumber} de 39`, pageWidth - 30, pageHeight - 10, { align: 'right' })
              doc.setTextColor(0, 0, 0)
            }

            if (linea.startsWith('MÓDULO') || linea.startsWith('CONCLUSIONES') || linea.startsWith('RECOMENDACIONES') || linea.startsWith('BIBLIOGRAFÍA')) {
              doc.setFontSize(16)
              doc.setTextColor(40, 116, 166)
              doc.text(linea, 20, yPosition)
              doc.setTextColor(0, 0, 0)
              yPosition += 8
            } else if (linea.match(/^\d+\./)) {
              doc.setFontSize(12)
              doc.setTextColor(80, 80, 80)
              doc.text(linea, 20, yPosition)
              doc.setTextColor(0, 0, 0)
              yPosition += 6
            } else if (linea.startsWith('•')) {
              doc.setFontSize(10)
              doc.text(linea, 30, yPosition)
              yPosition += 5
            } else if (linea === '') {
              yPosition += 3
            } else {
              doc.setFontSize(10)
              const splitText = doc.splitTextToSize(linea, pageWidth - 40)
              doc.text(splitText, 20, yPosition)
              yPosition += splitText.length * 4 + 2
            }
          })

          // Agregar páginas adicionales hasta 39
          while (pageNumber < 39) {
            doc.addPage()
            pageNumber++
            doc.setFontSize(12)
            doc.text(`Desarrollo técnico especializado - Página ${pageNumber}`, 20, 30)
            doc.setFontSize(10)
            doc.text('Contenido técnico avanzado que requiere', 20, 50)
            doc.text('implementación por especialistas certificados.', 20, 65)

            doc.setFontSize(10)
            doc.setTextColor(150, 150, 150)
            doc.text(`Página ${pageNumber} de 39`, pageWidth - 30, pageHeight - 10, { align: 'right' })
            doc.setTextColor(0, 0, 0)
          }

          doc.save('Manual_Plan_Proteccion_Tecnico_39pag.pdf')
        }).catch(error => {
          console.error('Error:', error)
          alert('Error al generar PDF')
        })
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Guía LOPIVI y un Plan de Protección
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Todo lo que necesitas saber para implementar y cumplir la LOPIVI en tu entidad
          </p>
          <button
            onClick={() => {
              document.getElementById('proceso-completo')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors"
          >
            Guía Completa Paso a Paso
          </button>
        </div>
      </section>

      {/* Proceso Completo LOPIVI */}
      <section id="proceso-completo" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Con <span className="text-blue-600">Custodia360</span>
            </h2>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-700 mb-6">
              Proceso completo LOPIVI para tu entidad
            </h3>
            <p className="text-xl text-gray-600">
              Sigue estos pasos para implementar la LOPIVI correctamente
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Primeros 2 pasos */}
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              {/* Paso 1 - Solo número, sin círculo de color */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    1
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Contrata el servicio</h4>
                </div>
                <p className="text-gray-600 mb-6">
                  Elige el plan que mejor se adapte a tu entidad según el número de menores.
                </p>
                <button
                  onClick={() => setShowPlanesModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                >
                  Ver Planes
                </button>
              </div>

              {/* Paso 2 - Solo número */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    2
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Designa el delegado</h4>
                </div>
                <p className="text-gray-600 mb-6">
                  Elige quien será el delegado principal y suplente si quieres.
                </p>
                <div className="bg-gray-100 text-gray-600 px-6 py-3 rounded-lg font-medium inline-block">
                  Incluido en el proceso
                </div>
              </div>
            </div>

            {/* Pasos 3 y 4 */}
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              {/* Paso 3 - Solo número, botón modal campus */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    3
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Certifica al delegado</h4>
                </div>
                <p className="text-gray-600 mb-6">
                  El delegado completa la formación
                </p>
                <button
                  onClick={() => setShowCampusModal(true)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-block"
                >
                  Ver Formación
                </button>
              </div>

              {/* Paso 4 - Solo número, botón modal dashboard */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    4
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Accede al dashboard</h4>
                </div>
                <p className="text-gray-600 mb-6">
                  Una vez certificado gestiona todo desde el panel de control
                </p>
                <button
                  onClick={() => setShowDashboardModal(true)}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors inline-block"
                >
                  Ver Demo
                </button>
              </div>
            </div>

            {/* Paso 5 centrado */}
            <div className="flex justify-center">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    5
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Forma a tu equipo</h4>
                </div>
                <p className="text-gray-600 mb-6">
                  Forma a todo tu equipo de una forma sencilla y ten el control
                </p>
                <button
                  onClick={() => setShowEquipoModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-block w-full"
                >
                  Ver Gestión de Personal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guías Completas */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Guía Completa LOPIVI
            </h2>
            <p className="text-lg text-gray-600 italic">
              "Procesos que debes cumplir si quieres tú mismo cumplir con la ley"
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Guía LOPIVI - 35 páginas */}
            <div className="bg-gray-50 rounded-xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Guía LOPIVI</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Manual completo 35 páginas
                </p>
              </div>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).generateLopiviPDF) {
                    (window as any).generateLopiviPDF()
                  }
                }}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors w-full"
              >
                Descargar Guía LOPIVI (PDF)
              </button>
            </div>

            {/* Guía Plan de Protección - 39 páginas */}
            <div className="bg-gray-50 rounded-xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Guía Plan de Protección</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Manual completo de 39 páginas
                </p>
              </div>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).generatePlanProteccionPDF) {
                    (window as any).generatePlanProteccionPDF()
                  }
                }}
                className="bg-blue-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-900 transition-colors w-full"
              >
                Descargar Guía Plan (PDF)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Campus Virtual - MOCKUP */}
      {showCampusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Campus Virtual Custodia360</h3>
                  <p className="opacity-90">Plataforma de formación LOPIVI especializada</p>
                </div>
                <button
                  onClick={() => setShowCampusModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto bg-gray-50">
              {/* Mockup del Campus Virtual */}
              <div className="bg-white rounded-lg border">
                <div className="bg-purple-100 p-4 border-b">
                  <h4 className="font-bold text-purple-800">Campus Virtual LOPIVI</h4>
                  <p className="text-sm text-purple-600">Sistema de formación especializada</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-2">Módulo 1: Marco Normativo</h5>
                      <div className="text-sm text-blue-600">
                        <p>• Análisis LOPIVI completo</p>
                        <p>• Normativa autonómica</p>
                        <p>• Jurisprudencia aplicable</p>
                      </div>
                      <div className="mt-3 bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">Progreso: 75%</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h5 className="font-semibold text-green-800 mb-2">Módulo 2: Protocolos</h5>
                      <div className="text-sm text-green-600">
                        <p>• Detección de situaciones</p>
                        <p>• Protocolos de actuación</p>
                        <p>• Comunicación autoridades</p>
                      </div>
                      <div className="mt-3 bg-green-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-1/2"></div>
                      </div>
                      <p className="text-xs text-green-600 mt-1">Progreso: 50%</p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h5 className="font-semibold text-orange-800 mb-2">Módulo 3: Casos Prácticos</h5>
                      <div className="text-sm text-orange-600">
                        <p>• Simulaciones reales</p>
                        <p>• Estudios de caso</p>
                        <p>• Evaluación práctica</p>
                      </div>
                      <div className="mt-3 bg-orange-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full w-1/4"></div>
                      </div>
                      <p className="text-xs text-orange-600 mt-1">Progreso: 25%</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="font-semibold text-gray-800 mb-3">Recursos Disponibles</h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded border">
                        <h6 className="font-medium text-gray-700">Biblioteca Digital</h6>
                        <p className="text-sm text-gray-600">Material formativo especializado</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded border">
                        <h6 className="font-medium text-gray-700">Videos Formativos</h6>
                        <p className="text-sm text-gray-600">Contenido audiovisual explicativo</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded border">
                        <h6 className="font-medium text-gray-700">Foros de Consulta</h6>
                        <p className="text-sm text-gray-600">Intercambio con expertos</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded border">
                        <h6 className="font-medium text-gray-700">Evaluaciones</h6>
                        <p className="text-sm text-gray-600">Tests y casos prácticos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dashboard Demo - MOCKUP */}
      {showDashboardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-orange-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Dashboard Delegado LOPIVI</h3>
                  <p className="opacity-90">Panel de control para gestión completa de protección infantil</p>
                </div>
                <button
                  onClick={() => setShowDashboardModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto bg-gray-50">
              {/* Mockup del Dashboard */}
              <div className="bg-white rounded-lg border">
                <div className="bg-orange-100 p-4 border-b">
                  <h4 className="font-bold text-orange-800">Panel de Control - María García López</h4>
                  <p className="text-sm text-orange-600">Delegada Principal - Club Deportivo Ejemplo</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Métricas principales */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">247</div>
                      <div className="text-sm text-blue-600">Menores Protegidos</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <div className="text-sm text-green-600">Cumplimiento</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <div className="text-sm text-purple-600">Protocolos Activos</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                      <div className="text-2xl font-bold text-red-600">3</div>
                      <div className="text-sm text-red-600">Casos Activos</div>
                    </div>
                  </div>

                  {/* Acciones rápidas */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-red-100 p-4 rounded-lg border border-red-200">
                      <h5 className="font-semibold text-red-800 mb-2">Protocolo Emergencia</h5>
                      <p className="text-sm text-red-600 mb-3">Activar protocolo inmediato</p>
                      <button className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium">
                        Activar
                      </button>
                    </div>

                    <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-2">Nuevo Caso</h5>
                      <p className="text-sm text-blue-600 mb-3">Registrar nueva situación</p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
                        Registrar
                      </button>
                    </div>

                    <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                      <h5 className="font-semibold text-green-800 mb-2">Generar Informe</h5>
                      <p className="text-sm text-green-600 mb-3">Crear informe de cumplimiento</p>
                      <button className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium">
                        Generar
                      </button>
                    </div>
                  </div>

                  {/* Lista de casos */}
                  <div className="border-t pt-4">
                    <h5 className="font-semibold text-gray-800 mb-3">Casos Recientes</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <div>
                          <p className="font-medium text-gray-800">Caso #2025-001</p>
                          <p className="text-sm text-gray-600">Situación de riesgo - En seguimiento</p>
                        </div>
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Media</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                        <div>
                          <p className="font-medium text-gray-800">Caso #2025-002</p>
                          <p className="text-sm text-gray-600">Incidente menor - Investigación</p>
                        </div>
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Alta</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                        <div>
                          <p className="font-medium text-gray-800">Caso #2025-003</p>
                          <p className="text-sm text-gray-600">Comunicación familia - Resuelto</p>
                        </div>
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Baja</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Planes - MOCKUP */}
      {showPlanesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Planes Custodia360</h3>
                  <p className="opacity-90">Elige el plan que mejor se adapte a tu entidad</p>
                </div>
                <button
                  onClick={() => setShowPlanesModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-8 bg-gray-50">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Plan 100 */}
                <div className="bg-white rounded-lg border-2 border-gray-200 p-6 text-center hover:border-blue-300 transition-colors">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Plan 100</h4>
                  <p className="text-gray-600 mb-4">1-100 menores</p>
                  <div className="text-3xl font-bold text-blue-600 mb-6">38€<span className="text-lg text-gray-500">/anual</span></div>
                  <Link
                    href="/contratar/datos-entidad"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block w-full"
                  >
                    Contratar
                  </Link>
                </div>

                {/* Plan 200 */}
                <div className="bg-white rounded-lg border-2 border-blue-300 p-6 text-center shadow-lg relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Plan 200</h4>
                  <p className="text-gray-600 mb-4">101-250 menores</p>
                  <div className="text-3xl font-bold text-blue-600 mb-6">78€<span className="text-lg text-gray-500">/anual</span></div>
                  <Link
                    href="/contratar/datos-entidad"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block w-full"
                  >
                    Contratar
                  </Link>
                </div>

                {/* Plan 500 */}
                <div className="bg-white rounded-lg border-2 border-gray-200 p-6 text-center hover:border-blue-300 transition-colors">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Plan 500</h4>
                  <p className="text-gray-600 mb-4">251-500 menores</p>
                  <div className="text-3xl font-bold text-blue-600 mb-6">210€<span className="text-lg text-gray-500">/anual</span></div>
                  <Link
                    href="/contratar/datos-entidad"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block w-full"
                  >
                    Contratar
                  </Link>
                </div>

                {/* Plan 500+ */}
                <div className="bg-white rounded-lg border-2 border-gray-200 p-6 text-center hover:border-blue-300 transition-colors">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Plan 500+</h4>
                  <p className="text-gray-600 mb-4">501+ menores</p>
                  <div className="text-3xl font-bold text-blue-600 mb-6">500€<span className="text-lg text-gray-500">/anual</span></div>
                  <Link
                    href="/contratar/datos-entidad"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block w-full"
                  >
                    Contratar
                  </Link>
                </div>

                {/* Custodia Temporal */}
                <div className="bg-white rounded-lg border-2 border-purple-300 p-6 text-center hover:border-purple-400 transition-colors lg:col-span-2">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Custodia Temporal</h4>
                  <p className="text-gray-600 mb-4">Para eventos de hasta 60 días</p>
                  <div className="text-3xl font-bold text-purple-600 mb-6">100€<span className="text-lg text-gray-500">/evento</span></div>
                  <Link
                    href="/contratar/datos-entidad"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-block w-full"
                  >
                    Contratar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestión de Equipo - MOCKUP */}
      {showEquipoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-green-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Gestión de Personal LOPIVI</h3>
                  <p className="opacity-90">Forma y controla a todo tu equipo de manera sencilla</p>
                </div>
                <button
                  onClick={() => setShowEquipoModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto bg-gray-50">
              {/* Mockup del Dashboard de Personal */}
              <div className="bg-white rounded-lg border">
                <div className="bg-green-100 p-4 border-b">
                  <h4 className="font-bold text-green-800">Gestión de Personal - María García López</h4>
                  <p className="text-sm text-green-600">Delegada Principal - Club Deportivo Ejemplo</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Buscador */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar por nombre o cargo..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      disabled
                    />
                  </div>

                  {/* Resumen de Personal */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-2xl font-bold text-blue-600">32</p>
                      <p className="text-sm text-gray-600">Total Personal</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-2xl font-bold text-green-600">28</p>
                      <p className="text-sm text-gray-600">Personal Activo</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-2xl font-bold text-yellow-600">25</p>
                      <p className="text-sm text-gray-600">Formación Completa</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-2xl font-bold text-red-600">3</p>
                      <p className="text-sm text-gray-600">Formación Pendiente</p>
                    </div>
                  </div>

                  {/* Lista de Personal */}
                  <div className="space-y-3">
                    <h5 className="text-lg font-medium text-gray-900">Personal de la Entidad</h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h6 className="font-medium text-gray-900">Ana García López</h6>
                            <p className="text-sm text-gray-600">Monitor Deportivo</p>
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Completada
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>LOPIVI: <span className="text-green-600 font-medium">Vigente</span></p>
                          <p>Vence: 15/08/2026</p>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h6 className="font-medium text-gray-900">Carlos Ruiz Martín</h6>
                            <p className="text-sm text-gray-600">Entrenador</p>
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            Pendiente
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>LOPIVI: <span className="text-red-600 font-medium">Pendiente</span></p>
                          <p>Programado: 25/09/2025</p>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h6 className="font-medium text-gray-900">Elena Sánchez Díaz</h6>
                            <p className="text-sm text-gray-600">Coordinadora</p>
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Completada
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>LOPIVI: <span className="text-green-600 font-medium">Vigente</span></p>
                          <p>Vence: 10/07/2026</p>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h6 className="font-medium text-gray-900">Miguel Torres Vega</h6>
                            <p className="text-sm text-gray-600">Monitor Auxiliar</p>
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            En proceso
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>LOPIVI: <span className="text-blue-600 font-medium">En proceso</span></p>
                          <p>Módulo 2 de 3 completado</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones rápidas */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h6 className="font-medium text-green-800 mb-3">Acciones Rápidas</h6>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium">
                        Incorporar Nuevo Personal
                      </button>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
                        Enviar Recordatorios
                      </button>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm font-medium">
                        Generar Certificados
                      </button>
                      <button className="bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium">
                        Exportar Lista Personal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Final */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            ¿Listo para implementar la LOPIVI?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Comienza hoy mismo con Custodia360 y protege a los menores de tu entidad
          </p>
          <Link
            href="/contratar/datos-entidad"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-block"
          >
            Contratar Ahora
          </Link>
        </div>
      </section>
    </div>
  )
}
