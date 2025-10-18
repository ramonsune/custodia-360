'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'

export default function GuiaPage() {
  const [loading, setLoading] = useState(false)

  // Función para generar PDF de 25 páginas - Guía LOPIVI
  const generateLopiviPDF = () => {
    setLoading(true)
    try {
      const doc = new jsPDF();

      // Configuración inicial
      doc.setFont('helvetica');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;

      // Página de portada
      doc.setFillColor(40, 116, 166);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('CUSTODIA360', pageWidth/2, 70, { align: 'center' });

      doc.setFontSize(22);
      doc.text('GUÍA COMPLETA LOPIVI', pageWidth/2, 100, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Ley Orgánica de Protección Integral', pageWidth/2, 130, { align: 'center' });
      doc.text('a la Infancia y la Adolescencia frente a la Violencia', pageWidth/2, 145, { align: 'center' });

      doc.setFontSize(12);
      doc.text(`Manual Técnico Especializado - 25 Páginas`, pageWidth/2, 170, { align: 'center' });
      doc.text(`Edición ${new Date().getFullYear()}`, pageWidth/2, 185, { align: 'center' });

      doc.setFontSize(10);
      doc.text('Primera empresa automatizada especializada', pageWidth/2, 210, { align: 'center' });
      doc.text('en cumplimiento normativo LOPIVI', pageWidth/2, 225, { align: 'center' });

      // Generar 24 páginas de contenido + portada = 25 páginas
      const capitulos = [
        { titulo: 'Marco Legal LOPIVI', contenido: 'La Ley Orgánica 8/2021 establece el marco legal para la protección integral de menores. Todas las entidades que trabajen con menores deben cumplir requisitos específicos de protección.' },
        { titulo: 'Obligaciones de las Entidades', contenido: 'Las entidades deben designar delegados de protección, establecer códigos de conducta, formar al personal y mantener protocolos actualizados de actuación.' },
        { titulo: 'Designación de Delegados', contenido: 'Es obligatorio designar un delegado principal y otro suplente. Ambos deben tener formación especializada y competencias específicas en protección infantil.' },
        { titulo: 'Plan de Protección', contenido: 'Documento fundamental que incluye análisis de riesgos, medidas preventivas, protocolos de actuación y sistemas de evaluación y mejora continua.' },
        { titulo: 'Código de Conducta', contenido: 'Establece normas claras de comportamiento para todo el personal. Debe incluir límites apropiados, uso de tecnología y gestión de situaciones especiales.' },
        { titulo: 'Formación del Personal', contenido: 'Todo el personal debe recibir formación especializada en protección infantil, adaptada a su rol específico y actualizada periódicamente.' },
        { titulo: 'Protocolos de Actuación', contenido: 'Procedimientos claros para detectar, evaluar y responder ante situaciones de riesgo. Incluyen comunicación interna y coordinación con autoridades.' },
        { titulo: 'Detección de Indicadores', contenido: 'Identificación temprana de señales de maltrato o situaciones de riesgo. Requiere observación sistemática y documentación apropiada.' },
        { titulo: 'Comunicación de Sospechas', contenido: 'Procedimientos para comunicar sospechas de maltrato a autoridades competentes, garantizando protección del menor y respaldo legal.' },
        { titulo: 'Gestión de Crisis', contenido: 'Protocolos para situaciones de emergencia que requieren respuesta inmediata. Incluyen medidas de protección urgentes y comunicación de crisis.' },
        { titulo: 'Coordinación Interinstitucional', contenido: 'Trabajo conjunto con servicios sociales, sistema sanitario, fuerzas de seguridad y sistema judicial para protección integral.' },
        { titulo: 'Documentación y Registros', contenido: 'Sistemas de documentación que garantizan trazabilidad, confidencialidad y cumplimiento de protección de datos personales.' },
        { titulo: 'Evaluación y Mejora', contenido: 'Sistemas de evaluación continua de la efectividad de las medidas implementadas y mejora constante de los procesos.' },
        { titulo: 'Medidas Preventivas', contenido: 'Estrategias proactivas para prevenir situaciones de riesgo, incluyendo diseño de espacios, supervisión y políticas específicas.' },
        { titulo: 'Espacios Seguros', contenido: 'Diseño y gestión de instalaciones que minimizan riesgos y facilitan supervisión apropiada de todas las actividades.' },
        { titulo: 'Supervisión de Actividades', contenido: 'Sistemas de supervisión que garantizan seguridad sin limitar desarrollo normal de actividades y relaciones apropiadas.' },
        { titulo: 'Gestión de Riesgos', contenido: 'Identificación, evaluación y mitigación de riesgos específicos según el tipo de entidad y actividades desarrolladas.' },
        { titulo: 'Casos Prácticos', contenido: 'Ejemplos reales de implementación en diferentes tipos de entidades: deportivas, educativas, religiosas y de ocio y tiempo libre.' },
        { titulo: 'Buenas Prácticas', contenido: 'Experiencias exitosas de implementación que pueden servir como modelo para otras entidades del mismo sector.' },
        { titulo: 'Recursos Legales', contenido: 'Marco normativo completo, jurisprudencia relevante y recursos legales disponibles para apoyo en implementación.' },
        { titulo: 'Procedimientos Operativos', contenido: 'Guías paso a paso para implementar cada componente del sistema de protección de manera efectiva y sostenible.' },
        { titulo: 'Implementación Práctica', contenido: 'Metodologías probadas para implementar todo el sistema de protección de manera gradual y efectiva en cualquier entidad.' },
        { titulo: 'Seguimiento Continuo', contenido: 'Sistemas de monitoreo y evaluación continua que garantizan mantenimiento y mejora constante del sistema de protección.' },
        { titulo: 'Conclusiones', contenido: 'Resumen de elementos clave, recomendaciones finales y recursos adicionales para mantenimiento del sistema de protección.' }
      ];

      capitulos.forEach((capitulo, index) => {
        doc.addPage();

        // Header de página
        doc.setFillColor(40, 116, 166);
        doc.rect(0, 0, pageWidth, 25, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('CUSTODIA360 - GUÍA LOPIVI', margin, 15);

        // Título del capítulo
        doc.setTextColor(40, 116, 166);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`CAPÍTULO ${index + 1}`, margin, 45);

        // Dividir título largo en múltiples líneas si es necesario
        const tituloLineas = doc.splitTextToSize(capitulo.titulo.toUpperCase(), maxWidth);
        tituloLineas.forEach((linea, lineIndex) => {
          doc.text(linea, margin, 58 + (lineIndex * 8));
        });

        // Línea separadora
        doc.setDrawColor(40, 116, 166);
        doc.setLineWidth(1);
        doc.line(margin, 75, pageWidth - margin, 75);

        // Contenido del capítulo
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        let yPos = 90;

        // Contenido principal
        const contenidoLineas = doc.splitTextToSize(capitulo.contenido, maxWidth);
        contenidoLineas.forEach((linea) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 30;
          }
          doc.text(linea, margin, yPos);
          yPos += 6;
        });

        yPos += 10;

        // Añadir puntos clave
        doc.setFont('helvetica', 'bold');
        doc.text('PUNTOS CLAVE:', margin, yPos);
        yPos += 8;

        const puntosClave = [
          '• Implementación obligatoria según normativa vigente',
          '• Adaptación específica al contexto de cada entidad',
          '• Formación especializada del personal involucrado',
          '• Documentación y registro apropiado de actuaciones',
          '• Evaluación y mejora continua del sistema'
        ];

        doc.setFont('helvetica', 'normal');
        puntosClave.forEach((punto) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 30;
          }
          doc.text(punto, margin, yPos);
          yPos += 6;
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Página ${index + 2} de 25 - © 2025 Custodia360`, pageWidth/2, pageHeight - 10, { align: 'center' });
      });

      // Descargar
      doc.save('Guia_LOPIVI_Completa_25pag.pdf');
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar PDF: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      setLoading(false);
    }
  }

  // Función para generar PDF Plan de Protección de 28 páginas
  const generatePlanProteccionPDF = () => {
    setLoading(true)
    try {
      const doc = new jsPDF();

      // Configuración inicial
      doc.setFont('helvetica');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;

      // Página de portada
      doc.setFillColor(34, 197, 94); // Verde
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('CUSTODIA360', pageWidth/2, 70, { align: 'center' });

      doc.setFontSize(22);
      doc.text('GUÍA PLAN DE PROTECCIÓN', pageWidth/2, 100, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Manual Completo para Crear y Gestionar', pageWidth/2, 130, { align: 'center' });
      doc.text('tu Plan de Protección Infantil', pageWidth/2, 145, { align: 'center' });

      doc.setFontSize(12);
      doc.text(`Manual Técnico Especializado - 28 Páginas`, pageWidth/2, 170, { align: 'center' });
      doc.text(`Edición ${new Date().getFullYear()}`, pageWidth/2, 185, { align: 'center' });

      doc.setFontSize(10);
      doc.text('Primera empresa automatizada especializada', pageWidth/2, 210, { align: 'center' });
      doc.text('en cumplimiento normativo LOPIVI', pageWidth/2, 225, { align: 'center' });

      // Generar 27 páginas de contenido + portada = 28 páginas
      const capitulos = [
        { titulo: 'Introducción al Plan de Protección', contenido: 'El Plan de Protección es el documento fundamental que toda entidad debe elaborar para garantizar la seguridad de los menores. Define estrategias, procedimientos y medidas específicas.' },
        { titulo: 'Marco Legal y Normativo', contenido: 'Base legal del Plan de Protección según LOPIVI. Requisitos específicos, obligaciones de las entidades y responsabilidades de los delegados de protección.' },
        { titulo: 'Análisis de Riesgos', contenido: 'Metodología para identificar, evaluar y clasificar riesgos específicos según el tipo de entidad y actividades desarrolladas con menores.' },
        { titulo: 'Estructura del Plan', contenido: 'Componentes esenciales que debe incluir todo Plan de Protección: políticas, procedimientos, protocolos, formación y sistemas de evaluación.' },
        { titulo: 'Políticas de Protección', contenido: 'Declaraciones formales sobre el compromiso de la entidad con la protección infantil. Incluye principios, valores y compromisos específicos.' },
        { titulo: 'Código de Conducta', contenido: 'Normas específicas de comportamiento para todo el personal. Define límites apropiados, situaciones prohibidas y buenas prácticas.' },
        { titulo: 'Procedimientos de Selección', contenido: 'Procesos para seleccionar personal que trabajará con menores. Incluye verificación de antecedentes, entrevistas y evaluación de idoneidad.' },
        { titulo: 'Formación Especializada', contenido: 'Programas de formación obligatoria para todo el personal. Contenidos específicos, metodologías y sistemas de evaluación de competencias.' },
        { titulo: 'Protocolos de Detección', contenido: 'Procedimientos para identificar indicadores de maltrato o situaciones de riesgo. Incluye observación sistemática y documentación.' },
        { titulo: 'Protocolos de Comunicación', contenido: 'Procedimientos para comunicar sospechas o situaciones de riesgo. Canales internos y comunicación con autoridades competentes.' },
        { titulo: 'Gestión de Crisis', contenido: 'Protocolos para situaciones de emergencia que requieren respuesta inmediata. Medidas de protección urgentes y comunicación de crisis.' },
        { titulo: 'Espacios Seguros', contenido: 'Diseño y gestión de instalaciones que minimizan riesgos. Incluye supervisión de espacios, control de accesos y políticas específicas.' },
        { titulo: 'Supervisión de Actividades', contenido: 'Sistemas de supervisión que garantizan seguridad sin limitar el desarrollo normal de actividades y relaciones apropiadas.' },
        { titulo: 'Uso de Tecnología', contenido: 'Políticas para el uso apropiado de tecnología, redes sociales y comunicaciones digitales con menores. Incluye medidas de protección online.' },
        { titulo: 'Gestión de Documentación', contenido: 'Sistemas de documentación que garantizan trazabilidad, confidencialidad y cumplimiento de protección de datos personales.' },
        { titulo: 'Coordinación Externa', contenido: 'Procedimientos para coordinar con servicios sociales, sistema sanitario, fuerzas de seguridad y otras instituciones de protección.' },
        { titulo: 'Participación de Familias', contenido: 'Estrategias para involucrar a las familias en la protección. Comunicación, formación y colaboración en medidas preventivas.' },
        { titulo: 'Participación de Menores', contenido: 'Metodologías para escuchar a los menores y garantizar su participación en su propia protección, respetando su edad y madurez.' },
        { titulo: 'Evaluación de Efectividad', contenido: 'Sistemas de evaluación continua de la efectividad de las medidas implementadas. Indicadores, metodologías y planes de mejora.' },
        { titulo: 'Casos Prácticos Deportivos', contenido: 'Ejemplos específicos de implementación en entidades deportivas. Riesgos particulares y medidas de protección adaptadas.' },
        { titulo: 'Casos Prácticos Educativos', contenido: 'Ejemplos específicos de implementación en centros educativos. Protocolos adaptados al contexto escolar y extraescolar.' },
        { titulo: 'Casos Prácticos Religiosos', contenido: 'Ejemplos específicos de implementación en entidades religiosas. Consideraciones especiales para actividades pastorales y catequéticas.' },
        { titulo: 'Casos Prácticos de Ocio', contenido: 'Ejemplos específicos de implementación en entidades de ocio y tiempo libre. Protocolos para campamentos y actividades recreativas.' },
        { titulo: 'Implementación Gradual', contenido: 'Metodología para implementar el Plan de Protección de manera gradual y sostenible. Fases, cronogramas y recursos necesarios.' },
        { titulo: 'Mantenimiento y Actualización', contenido: 'Procedimientos para mantener el Plan actualizado. Revisiones periódicas, adaptación a cambios normativos y mejora continua.' },
        { titulo: 'Recursos y Herramientas', contenido: 'Plantillas, checklists y herramientas prácticas para facilitar la implementación y gestión del Plan de Protección.' },
        { titulo: 'Conclusiones y Recomendaciones', contenido: 'Resumen de elementos clave, recomendaciones finales y próximos pasos para consolidar un sistema efectivo de protección infantil.' }
      ];

      capitulos.forEach((capitulo, index) => {
        doc.addPage();

        // Header de página
        doc.setFillColor(34, 197, 94); // Verde
        doc.rect(0, 0, pageWidth, 25, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('CUSTODIA360 - PLAN DE PROTECCIÓN', margin, 15);

        // Título del capítulo
        doc.setTextColor(34, 197, 94);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`MÓDULO ${index + 1}`, margin, 45);

        // Dividir título largo en múltiples líneas si es necesario
        const tituloLineas = doc.splitTextToSize(capitulo.titulo.toUpperCase(), maxWidth);
        tituloLineas.forEach((linea, lineIndex) => {
          doc.text(linea, margin, 58 + (lineIndex * 8));
        });

        // Línea separadora
        doc.setDrawColor(34, 197, 94);
        doc.setLineWidth(1);
        doc.line(margin, 75, pageWidth - margin, 75);

        // Contenido del capítulo
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        let yPos = 90;

        // Contenido principal
        const contenidoLineas = doc.splitTextToSize(capitulo.contenido, maxWidth);
        contenidoLineas.forEach((linea) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 30;
          }
          doc.text(linea, margin, yPos);
          yPos += 6;
        });

        yPos += 10;

        // Añadir elementos específicos del plan
        doc.setFont('helvetica', 'bold');
        doc.text('ELEMENTOS CLAVE DEL PLAN:', margin, yPos);
        yPos += 8;

        const elementosClave = [
          '• Adaptación específica al tipo de entidad y actividades',
          '• Herramientas prácticas y plantillas personalizables',
          '• Protocolos paso a paso para implementación inmediata',
          '• Sistema de evaluación y mejora continua integrado',
          '• Coordinación efectiva con autoridades competentes'
        ];

        doc.setFont('helvetica', 'normal');
        elementosClave.forEach((elemento) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 30;
          }
          doc.text(elemento, margin, yPos);
          yPos += 6;
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Página ${index + 2} de 28 - © 2025 Custodia360`, pageWidth/2, pageHeight - 10, { align: 'center' });
      });

      // Descargar
      doc.save('Guia_Plan_Proteccion_28pag.pdf');
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar PDF: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-6">
            Guía <span className="text-blue-800">LOPIVI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Todo lo que necesitas saber para implementar y cumplir la LOPIVI en tu entidad y tener un plan de protección
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Documentación técnica especializada para el cumplimiento normativo
          </p>
        </div>
      </section>

      {/* Roles dentro de las entidades */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Roles dentro de las Entidades</h2>
            <p className="text-xl text-gray-600">Cada persona tiene un papel específico en la protección infantil</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Delegado/a Principal */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Delegado/a Principal</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Responsabilidad máxima de protección</li>
                <li>• Coordinación general del sistema</li>
                <li>• Comunicación con autoridades</li>
                <li>• Supervisión de protocolos</li>
                <li>• Formación obligatoria LOPIVI</li>
              </ul>
            </div>

            {/* Delegado/a Suplente */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16,4C18.11,4 19.82,5.69 19.82,7.8C19.82,9.91 18.11,11.6 16,11.6C13.89,11.6 12.18,9.91 12.18,7.8C12.18,5.69 13.89,4 16,4M16,13.4C18.67,13.4 21.82,14.73 21.82,16.6V18.4H10.18V16.6C10.18,14.73 13.33,13.4 16,13.4M8,6A3,3 0 0,1 11,9A3,3 0 0,1 8,12A3,3 0 0,1 5,9A3,3 0 0,1 8,6M8,13C10.67,13 16,14.33 16,17V19H0V17C0,14.33 5.33,13 8,13Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Delegado/a Suplente</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Apoyo al delegado principal</li>
                <li>• Sustitución en ausencias</li>
                <li>• Seguimiento de casos asignados</li>
                <li>• Coordinación con el principal</li>
                <li>• Formación específica requerida</li>
              </ul>
            </div>

            {/* Personal con Contacto */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Personal con Contacto</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Interacción directa con menores</li>
                <li>• Formación LOPIVI obligatoria</li>
                <li>• Certificado de antecedentes</li>
                <li>• Seguimiento de protocolos</li>
                <li>• Detección de señales de riesgo</li>
              </ul>
            </div>

            {/* Personal sin Contacto y Familias */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Personal sin Contacto y Familias</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Personal: Conocimiento básico LOPIVI</li>
                <li>• Personal: Colaboración en protocolos</li>
                <li>• Familias: Información del delegado</li>
                <li>• Familias: Canal de comunicación</li>
                <li>• Familias: Colaboración activa</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                Responsabilidad Compartida
              </h3>
              <p className="text-blue-800">
                La protección infantil es responsabilidad de TODA la comunidad. Cada rol es fundamental para crear un entorno seguro donde los menores puedan desarrollarse sin riesgo de violencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido adicional */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Paso a Paso</h2>
            <p className="text-xl text-gray-600">Implementación ordenada y sistemática</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analiza tu entidad</h3>
              <p className="text-gray-600">Identifica riesgos específicos y requisitos según tu tipo de actividad</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Designa delegado/a</h3>
              <p className="text-gray-600">Selecciona y forma a la persona responsable de protección</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Implementa protocolos</h3>
              <p className="text-gray-600">Establece procedimientos y forma a todo el personal</p>
            </div>
          </div>
        </div>
      </section>

      {/* PDFs Descargables */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Documentación Técnica</h2>
            <p className="text-xl text-gray-600">Guías completas para implementación LOPIVI</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Guía LOPIVI */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Guía LOPIVI Completa</h3>
              <p className="text-gray-600 mb-6">
                Manual técnico de 25 páginas con todo lo necesario para cumplir la LOPIVI
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-blue-800 mb-2">Incluye:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Marco legal completo</li>
                  <li>• Obligaciones específicas</li>
                  <li>• Protocolos de actuación</li>
                  <li>• Formación del personal</li>
                  <li>• Casos prácticos reales</li>
                </ul>
              </div>
              <button
                onClick={generateLopiviPDF}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generando...' : 'Descargar Guía LOPIVI (25 páginas)'}
              </button>
            </div>

            {/* Guía Plan de Protección */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Guía Plan de Protección</h3>
              <p className="text-gray-600 mb-6">
                Manual especializado de 28 páginas para crear tu Plan de Protección Infantil
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-green-800 mb-2">Incluye:</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Estructura del plan completa</li>
                  <li>• Análisis de riesgos específicos</li>
                  <li>• Medidas preventivas detalladas</li>
                  <li>• Protocolos de emergencia</li>
                  <li>• Plantillas personalizables</li>
                </ul>
              </div>
              <button
                onClick={generatePlanProteccionPDF}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generando...' : 'Descargar Guía Plan (28 páginas)'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Necesitas implementación automática?</h2>
          <p className="text-xl mb-8">Con Custodia360 podrás tener todo listo en 72 horas</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/contratar/datos-entidad"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Contratar Custodia360
            </a>
            <a
              href="/planes"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition-colors"
            >
              Ver Planes
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
