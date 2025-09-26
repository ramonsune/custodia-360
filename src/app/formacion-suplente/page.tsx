'use client'

import Link from 'next/link'
import { useState } from 'react'
import jsPDF from 'jspdf'

// Datos específicos para PDFs de suplentes (versión simplificada)
const pdfEspecificosSuplente = {
  1: {
    'introduccion-lopivi': {
      titulo: 'Introducción Completa a LOPIVI para Suplentes',
      contenido: `INTRODUCCIÓN COMPLETA A LOPIVI PARA DELEGADOS SUPLENTES

GUÍA ESPECIALIZADA CUSTODIA360

═══════════════════════════════════════════════════════════════════
📖 CONCEPTOS FUNDAMENTALES PARA SUPLENTES
═══════════════════════════════════════════════════════════════════

¿QUÉ ES LA LOPIVI?
La Ley Orgánica 8/2021, de 4 de junio, de protección integral a la infancia y la adolescencia frente a la violencia, es la normativa española que establece el marco legal para proteger a los menores de cualquier forma de violencia.

COMO DELEGADO SUPLENTE, TU FUNCIÓN PRINCIPAL ES:
• Apoyar al delegado principal en todas sus funciones
• Sustituir temporalmente en caso de ausencia
• Mantener formación actualizada en protección infantil
• Conocer perfectamente todos los protocolos de actuación
• Estar preparado para actuar con la misma competencia que el principal

PRINCIPIOS BÁSICOS QUE DEBES CONOCER:
1. INTERÉS SUPERIOR DEL MENOR: Siempre prima el bienestar del menor
2. PROTECCIÓN INTEGRAL: Enfoque completo desde prevención hasta intervención
3. ESPECIALIZACIÓN: Formación específica obligatoria
4. COORDINACIÓN: Trabajo conjunto con otros profesionales e instituciones

═══════════════════════════════════════════════════════════════════
🎯 ROL ESPECÍFICO DEL DELEGADO SUPLENTE
═══════════════════════════════════════════════════════════════════

TUS RESPONSABILIDADES COMO SUPLENTE:

APOYO CONTINUO AL DELEGADO PRINCIPAL:
• Participar en formaciones conjuntas
• Conocer todos los casos activos
• Mantener documentación actualizada
• Colaborar en evaluaciones de riesgo
• Aportar perspectiva adicional en casos complejos

SUSTITUCIÓN TEMPORAL:
• Asumir todas las funciones del principal cuando sea necesario
• Mantener continuidad en casos en seguimiento
• Tomar decisiones con la misma autoridad
• Coordinar con autoridades competentes
• Gestionar situaciones de emergencia

PREPARACIÓN PERMANENTE:
• Formación continua en protección infantil
• Actualización normativa regular
• Conocimiento de recursos locales
• Práctica de protocolos de actuación
• Desarrollo de habilidades de comunicación

═══════════════════════════════════════════════════════════════════
⚖️ MARCO LEGAL ESPECÍFICO
═══════════════════════════════════════════════════════════════════

OBLIGACIONES LEGALES DE LA ENTIDAD:
La LOPIVI exige que las entidades designen tanto delegado principal como suplente, garantizando así continuidad en la protección.

RESPONSABILIDADES COMPARTIDAS:
• Formación especializada mínima requerida
• Conocimiento completo de protocolos
• Capacidad de comunicación con autoridades
• Competencia en evaluación de riesgo
• Habilidades de gestión de crisis

NORMATIVA APLICABLE:
• Ley Orgánica 8/2021 (LOPIVI)
• Normativa autonómica específica
• Protocolos municipales de protección
• Reglamento General de Protección de Datos
• Código deontológico profesional

═══════════════════════════════════════════════════════════════════
🚨 PROTOCOLOS BÁSICOS DE ACTUACIÓN
═══════════════════════════════════════════════════════════════════

DETECCIÓN DE INDICADORES:
• Observación sistemática durante actividades
• Registro objetivo de comportamientos preocupantes
• Evaluación de cambios significativos
• Documentación inmediata de sospechas

COMUNICACIÓN DE SOSPECHAS:
• Información inmediata al delegado principal (si está disponible)
• Comunicación directa a servicios sociales (si principal ausente)
• Coordinación con dirección de la entidad
• Seguimiento de protocolos establecidos

GESTIÓN DE EMERGENCIAS:
• Evaluación rápida de riesgo inmediato
• Medidas de protección urgentes
• Comunicación a servicios de emergencia si procede
• Documentación exhaustiva de actuaciones

═══════════════════════════════════════════════════════════════════
📞 RECURSOS Y CONTACTOS ESENCIALES
═══════════════════════════════════════════════════════════════════

CONTACTOS DE EMERGENCIA:
🆘 EMERGENCIAS GENERALES: 112
📞 TELÉFONO DEL MENOR: 116 111
🚨 LÍNEA CONTRA EL SUICIDIO: 024

AUTORIDADES COMPETENTES:
🏛️ SERVICIOS SOCIALES: [Completar número local]
👨‍⚖️ FISCALÍA DE MENORES: [Completar número local]
🏥 CENTRO DE SALUD MENTAL INFANTIL: [Completar número local]

═══════════════════════════════════════════════════════════════════
✅ COMPETENCIAS CLAVE A DESARROLLAR
═══════════════════════════════════════════════════════════════════

HABILIDADES TÉCNICAS:
• Identificación de indicadores de maltrato
• Técnicas de comunicación con menores
• Gestión de situaciones de crisis
• Documentación legal apropiada
• Coordinación interinstitucional

HABILIDADES PERSONALES:
• Empatía y sensibilidad
• Capacidad de mantener calma bajo presión
• Comunicación efectiva con familias
• Trabajo en equipo
• Confidencialidad y ética profesional

TU FORMACIÓN COMO SUPLENTE ES IGUAL DE IMPORTANTE QUE LA DEL PRINCIPAL
DEBES ESTAR PREPARADO PARA ACTUAR CON TOTAL COMPETENCIA EN CUALQUIER MOMENTO

═══════════════════════════════════════════════════════════════════`
    }
  },
  2: {
    'funciones-responsabilidades': {
      titulo: 'Funciones y Responsabilidades del Delegado Suplente',
      contenido: `FUNCIONES Y RESPONSABILIDADES DEL DELEGADO SUPLENTE

MANUAL ESPECÍFICO CUSTODIA360

═══════════════════════════════════════════════════════════════════
👥 DIFERENCIAS Y SIMILITUDES CON EL DELEGADO PRINCIPAL
═══════════════════════════════════════════════════════════════════

RESPONSABILIDADES COMPARTIDAS:
✓ Misma formación especializada requerida
✓ Conocimiento completo de protocolos de la entidad
✓ Capacidad de evaluación de riesgo
✓ Competencia en comunicación con autoridades
✓ Habilidades de gestión de crisis
✓ Mantenimiento de confidencialidad absoluta

DIFERENCIAS EN LA PRÁCTICA DIARIA:
• PRINCIPAL: Liderazgo directo en casos, coordinación principal
• SUPLENTE: Apoyo, supervisión, respaldo y sustitución cuando sea necesario

PERO RECUERDA: En ausencia del principal, asumes TODAS sus responsabilidades con la misma autoridad y competencia.

═══════════════════════════════════════════════════════════════════
🔄 FUNCIONES EN MODO DE APOYO (Delegado Principal Presente)
═══════════════════════════════════════════════════════════════════

PARTICIPACIÓN ACTIVA EN CASOS:
• Revisión conjunta de casos activos
• Aporte de perspectiva adicional en evaluaciones
• Participación en reuniones de coordinación
• Colaboración en documentación de casos
• Apoyo en formación de personal

SUPERVISIÓN Y OBSERVACIÓN:
• Observación sistemática durante actividades
• Detección independiente de indicadores
• Seguimiento de casos en evolución
• Monitoreo de eficacia de medidas adoptadas
• Identificación de necesidades formativas

GESTIÓN ADMINISTRATIVA:
• Mantenimiento de registros actualizados
• Archivo de documentación oficial
• Preparación de informes de seguimiento
• Gestión de comunicaciones con autoridades
• Organización de material formativo

═══════════════════════════════════════════════════════════════════
⚡ FUNCIONES EN MODO SUSTITUCIÓN (Delegado Principal Ausente)
═══════════════════════════════════════════════════════════════════

ASUNCIÓN COMPLETA DE RESPONSABILIDADES:
Cuando el delegado principal no está disponible, tú:

✓ TIENES LA MISMA AUTORIDAD LEGAL
✓ TOMAS DECISIONES CON TOTAL AUTONOMÍA
✓ COMUNICAS DIRECTAMENTE CON AUTORIDADES
✓ GESTIONAS EMERGENCIAS INDEPENDIENTEMENTE
✓ REPRESENTAS OFICIALMENTE A LA ENTIDAD

SITUACIONES QUE REQUIEREN TU ACTUACIÓN DIRECTA:
• Ausencias programadas del principal (vacaciones, formación)
• Emergencias cuando principal no localizable
• Sobrecarga de casos que requiere división de responsabilidades
• Situaciones que requieren segunda opinión técnica
• Coordinación simultánea con múltiples autoridades

PROTOCOLO DE ACTIVACIÓN:
1. Identificación de necesidad de sustitución
2. Comunicación con dirección de la entidad
3. Asunción formal de funciones
4. Información a autoridades competentes sobre cambio temporal
5. Continuidad absoluta en casos en seguimiento

═══════════════════════════════════════════════════════════════════
📚 FUNCIONES DE FORMACIÓN Y DESARROLLO
═══════════════════════════════════════════════════════════════════

AUTOFORMACIÓN CONTINUA:
• Actualización normativa regular
• Participación en cursos especializados
• Lectura de guías y protocolos actualizados
• Intercambio de experiencias con otros suplentes
• Evaluación periódica de competencias

FORMACIÓN DEL EQUIPO:
• Colaboración en formación de personal
• Desarrollo de material formativo específico
• Organización de simulacros y casos prácticos
• Mentoría de nuevo personal
• Evaluación de necesidades formativas

MEJORA CONTINUA:
• Análisis de casos resueltos
• Identificación de áreas de mejora en protocolos
• Propuesta de optimizaciones en procedimientos
• Desarrollo de buenas prácticas
• Documentación de lecciones aprendidas

═══════════════════════════════════════════════════════════════════
🤝 COORDINACIÓN Y TRABAJO EN EQUIPO
═══════════════════════════════════════════════════════════════════

CON EL DELEGADO PRINCIPAL:
• Comunicación fluida y regular
• Reuniones de coordinación periódicas
• Intercambio de información sobre casos
• Planificación conjunta de actuaciones
• Respaldo mutuo en decisiones complejas

CON EL EQUIPO DE LA ENTIDAD:
• Integración en dinámicas de trabajo
• Disponibilidad para consultas del personal
• Participación en reuniones de equipo
• Apoyo en resolución de dudas
• Facilitación de comunicación con dirección

CON AUTORIDADES EXTERNAS:
• Presentación como suplente en primeros contactos
• Mantenimiento de relaciones institucionales
• Participación en reuniones interinstitucionales
• Representación de la entidad cuando sea requerido
• Continuidad en comunicaciones oficiales

═══════════════════════════════════════════════════════════════════
⚖️ RESPONSABILIDADES LEGALES ESPECÍFICAS
═══════════════════════════════════════════════════════════════════

COMO SUPLENTE TIENES:

MISMA RESPONSABILIDAD LEGAL:
• Obligación de comunicar sospechas de maltrato
• Deber de secreto profesional
• Responsabilidad en protección de datos
• Obligación de actuación diligente
• Respuesta ante requerimientos judiciales

MISMOS DERECHOS:
• Acceso a formación especializada
• Recursos necesarios para el desempeño
• Respaldo institucional en decisiones
• Protección legal en el ejercicio de funciones
• Reconocimiento profesional de competencias

DIFERENCIA CLAVE:
Tu responsabilidad se activa de forma variable según el contexto, pero cuando actúas, es igual de plena que la del principal.

═══════════════════════════════════════════════════════════════════
📊 EVALUACIÓN DEL DESEMPEÑO COMO SUPLENTE
═══════════════════════════════════════════════════════════════════

CRITERIOS DE EVALUACIÓN:

PREPARACIÓN TÉCNICA:
• Conocimiento actualizado de normativa
• Competencia en protocolos de actuación
• Habilidades de evaluación de riesgo
• Capacidad de gestión de crisis
• Competencia en comunicación interinstitucional

DISPONIBILIDAD Y COMPROMISO:
• Respuesta rápida cuando se requiere actuación
• Participación activa en formación continua
• Colaboración efectiva con delegado principal
• Integración positiva en equipo de trabajo
• Proactividad en mejora de procesos

CALIDAD DE ACTUACIONES:
• Eficacia en casos gestionados independientemente
• Calidad de documentación producida
• Adecuación de comunicaciones oficiales
• Coordinación exitosa con autoridades
• Resultados en protección de menores

═══════════════════════════════════════════════════════════════════
🎯 OBJETIVOS DE DESARROLLO PROFESIONAL
═══════════════════════════════════════════════════════════════════

OBJETIVOS A CORTO PLAZO (3-6 meses):
• Dominio completo de protocolos internos
• Conocimiento exhaustivo de casos activos
• Establecimiento de relaciones con autoridades locales
• Desarrollo de habilidades de documentación
• Participación efectiva en trabajo de equipo

OBJETIVOS A MEDIO PLAZO (6-12 meses):
• Gestión autónoma de casos complejos
• Liderazgo en formación de personal
• Innovación en procedimientos de protección
• Especialización en áreas específicas
• Reconocimiento como referente técnico

OBJETIVOS A LARGO PLAZO (1-2 años):
• Posible promoción a delegado principal
• Mentoría de nuevos suplentes
• Participación en desarrollo normativo
• Contribución a buenas prácticas sectoriales
• Liderazgo en proyectos de mejora

═══════════════════════════════════════════════════════════════════
✅ CHECKLIST DE COMPETENCIAS DEL SUPLENTE

□ Conozco perfectamente la normativa LOPIVI
□ Domino todos los protocolos de la entidad
□ Puedo evaluar riesgo de forma autónoma
□ Sé comunicar con todas las autoridades competentes
□ Gestiono crisis con competencia y calma
□ Mantengo documentación apropiada
□ Coordino efectivamente con otros profesionales
□ Apoyo adecuadamente al delegado principal
□ Estoy disponible para sustitución cuando sea necesario
□ Mantengo formación continua actualizada

CUANDO PUEDAS MARCAR TODAS LAS CASILLAS, ESTARÁS PREPARADO PARA CUALQUIER DESAFÍO QUE SE PRESENTE EN TU ROL COMO DELEGADO SUPLENTE.

═══════════════════════════════════════════════════════════════════`
    }
  }
};

// Función para generar PDFs específicos para suplentes
const generarPDFEspecificoSuplente = (numeroModulo: number, tipoPDF: string, usuario: any) => {
  const pdfData = pdfEspecificosSuplente[numeroModulo as keyof typeof pdfEspecificosSuplente]?.[tipoPDF];
  if (!pdfData) {
    alert('Tipo de PDF no disponible');
    return;
  }

  const doc = new jsPDF();

  // Configuración con estilo Custodia360
  doc.setFont('helvetica');
  let yPos = 15;
  const margenIzq = 15;
  const margenDer = 15;
  const anchoLinea = 180;

  // Header con estilo Custodia360
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 25, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTODIA360', margenIzq, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Formación Especializada para Delegados Suplentes', margenIzq, 20);

  yPos = 35;
  doc.setTextColor(0, 0, 0);

  // Título del documento
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  const tituloLineas = doc.splitTextToSize(pdfData.titulo, anchoLinea);
  tituloLineas.forEach((linea: string) => {
    doc.text(linea, margenIzq, yPos);
    yPos += 7;
  });

  yPos += 5;

  // Información del usuario
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margenIzq, yPos, anchoLinea, 20, 2, 2, 'FD');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Delegado Suplente: ${usuario?.nombre || 'N/A'} | Entidad: ${usuario?.entidad || 'N/A'}`, margenIzq + 5, yPos + 7);
  doc.text(`Tipo: ${usuario?.tipoEntidad || 'N/A'} | Generado: ${new Date().toLocaleDateString('es-ES')}`, margenIzq + 5, yPos + 14);

  yPos += 30;

  // Contenido del PDF
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  const lineasContenido = doc.splitTextToSize(pdfData.contenido, anchoLinea);

  lineasContenido.forEach((linea: string) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    // Mejorar formato para títulos y secciones
    if (linea.includes('═══') || linea.includes('🚨') || linea.includes('📋')) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
    } else if (linea.includes('✓') || linea.includes('•')) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }

    doc.text(linea, margenIzq, yPos);
    yPos += 4;
  });

  // Footer
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setDrawColor(37, 99, 235);
    doc.line(margenIzq, 285, 210 - margenDer, 285);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Custodia360 - Formación Especializada para Delegados Suplentes', margenIzq, 292);
    doc.text(`Página ${i} de ${totalPages}`, 180, 292);
  }

  // Descargar
  const nombreArchivo = `Custodia360_Suplente_Modulo${numeroModulo}_${tipoPDF.replace(/-/g, '_')}.pdf`;
  doc.save(nombreArchivo);
};

export default function FormacionSuplentePage() {
  const [moduloActual, setModuloActual] = useState(1)
  const [progreso, setProgreso] = useState(25)
  const [usuario] = useState({
    nombre: 'Delegado Suplente',
    entidad: 'Entidad Ejemplo',
    tipoEntidad: 'deportivo'
  })

  const modulos = [
    {
      id: 1,
      titulo: 'Introducción a la Protección Integral',
      descripcion: 'Conceptos básicos y marco legal especializado para suplentes',
      completado: true,
      duracion: '45 min'
    },
    {
      id: 2,
      titulo: 'Rol del Delegado Suplente',
      descripcion: 'Funciones específicas y responsabilidades diferenciadas',
      completado: false,
      duracion: '60 min'
    },
    {
      id: 3,
      titulo: 'Protocolos de Actuación',
      descripcion: 'Procedimientos para apoyo y sustitución',
      completado: false,
      duracion: '90 min'
    },
    {
      id: 4,
      titulo: 'Casos Prácticos',
      descripcion: 'Simulaciones específicas para suplentes',
      completado: false,
      duracion: '120 min'
    },
    {
      id: 5,
      titulo: 'Evaluación Final',
      descripcion: 'Certificación de competencias como suplente',
      completado: false,
      duracion: '30 min'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Actualizado */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Su proceso de formación Custodia360</h1>
              <p className="text-gray-600 mt-2">Formación integral personalizada para delegados suplentes</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{progreso}%</div>
              <div className="text-sm text-gray-600">Completado</div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{width: `${progreso}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de módulos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Módulos del Curso</h3>
              <div className="space-y-3">
                {modulos.map((modulo) => (
                  <div
                    key={modulo.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      moduloActual === modulo.id
                        ? 'border-blue-500 bg-blue-50'
                        : modulo.completado
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setModuloActual(modulo.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          modulo.completado
                            ? 'bg-green-500 text-white'
                            : moduloActual === modulo.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                        }`}>
                          {modulo.completado ? '✓' : modulo.id}
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">{modulo.titulo}</h4>
                          <p className="text-xs text-gray-600">{modulo.duracion}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contenido del módulo actual */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Módulo {moduloActual}: {modulos.find(m => m.id === moduloActual)?.titulo}
                </h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {modulos.find(m => m.id === moduloActual)?.duracion}
                </span>
              </div>

              <p className="text-gray-600 mb-6">
                {modulos.find(m => m.id === moduloActual)?.descripcion}
              </p>

              {/* PDFs Especializados para Suplentes */}
              {pdfEspecificosSuplente[moduloActual as keyof typeof pdfEspecificosSuplente] && (
                <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">📄 Documentos Especializados Disponibles</h4>
                  <div className="grid gap-2">
                    {Object.entries(pdfEspecificosSuplente[moduloActual as keyof typeof pdfEspecificosSuplente]).map(([tipoPDF, data]) => (
                      <button
                        key={tipoPDF}
                        onClick={() => generarPDFEspecificoSuplente(moduloActual, tipoPDF, usuario)}
                        className="bg-white border border-blue-300 hover:border-blue-500 hover:bg-blue-50 px-4 py-3 rounded-lg text-sm transition-all duration-200 text-left"
                        title={data.titulo}
                      >
                        <div className="font-medium text-blue-900 mb-1">
                          📄 {tipoPDF.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </div>
                        <div className="text-xs text-gray-600">
                          {data.titulo}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contenido específico actualizado sin referencias problemáticas */}
              {moduloActual === 1 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-bold text-blue-900 mb-2">¿Qué es la protección integral de menores?</h3>
                    <p className="text-blue-800 text-sm">
                      El marco legal establece un sistema integral para proteger a los menores de cualquier forma de violencia,
                      asegurando su desarrollo seguro y saludable.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900">Objetivos principales:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Garantizar la protección integral de menores
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Prevenir cualquier forma de violencia
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Establecer protocolos de actuación efectivos
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Formar a profesionales especializados
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {moduloActual === 2 && (
                <div className="space-y-6">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-bold text-orange-900 mb-2">Rol del Delegado Suplente</h3>
                    <p className="text-orange-800 text-sm">
                      El delegado suplente es fundamental para garantizar continuidad en la protección,
                      actuando como apoyo especializado y sustituto cuando sea necesario.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900">Responsabilidades principales:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">•</span>
                        Apoyo especializado al delegado principal en todas sus funciones
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">•</span>
                        Sustitución temporal con plena competencia en ausencias
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">•</span>
                        Conocimiento completo de protocolos y procedimientos
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">•</span>
                        Participación activa en la formación continua
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Botones de navegación */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => moduloActual > 1 && setModuloActual(moduloActual - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  disabled={moduloActual === 1}
                >
                  ← Anterior
                </button>

                <button
                  onClick={() => {
                    if (moduloActual < modulos.length) {
                      setModuloActual(moduloActual + 1)
                      setProgreso(Math.min(100, progreso + 20))
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={moduloActual === modulos.length}
                >
                  {moduloActual === modulos.length ? 'Finalizar' : 'Siguiente →'}
                </button>
              </div>
            </div>

            {/* Certificación actualizada */}
            {progreso === 100 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">¡Formación Completada!</h3>
                  <p className="text-green-700 mb-4">
                    Has completado exitosamente la formación especializada para Delegado Suplente Custodia360
                  </p>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
                    Descargar Certificado
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navegación inferior */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
