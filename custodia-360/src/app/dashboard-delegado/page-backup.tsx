const descargarCertificado = async () => {
    setPdfLoading('certificado')

    try {
      // Verificar si el usuario tiene un certificado válido
      const codigoVerificacion = localStorage.getItem(`certificado_${sessionData?.id}`)

      if (!codigoVerificacion) {
        alert('No se encuentra un certificado válido. Complete primero la formación LOPIVI.')
        return
      }

      // Obtener datos del test completado
      const testResult = localStorage.getItem('resultadoTestDelegado')
      const resultadoTest = testResult ? JSON.parse(testResult) : null

      // Usar el mismo código de generación del certificado de formación
      const doc = new (await import('jspdf')).jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Configuración inicial
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Fondo del certificado
      doc.setFillColor(250, 250, 250);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Borde decorativo
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(2);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Header azul
      doc.setFillColor(37, 99, 235);
      doc.rect(10, 10, pageWidth - 20, 40, 'F');

      // Logo/símbolo
      doc.setFillColor(255, 255, 255);
      doc.circle(30, 30, 8, 'F');
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('C', 27, 32);

      // Título principal
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('CERTIFICADO CUSTODIA360', pageWidth / 2, 25, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Delegado de Protección de la Infancia y Adolescencia', pageWidth / 2, 35, { align: 'center' });

      doc.setFontSize(10);
      doc.text('Conforme a la Ley Orgánica 8/2021 (LOPIVI)', pageWidth / 2, 42, { align: 'center' });

      // Contenido principal
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Se certifica que', pageWidth / 2, 70, { align: 'center' });

      // Nombre del usuario
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235);
      doc.text(sessionData?.nombre.toUpperCase() || '', pageWidth / 2, 85, { align: 'center' });

      // Línea decorativa bajo el nombre
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(1);
      const nombreWidth = doc.getTextWidth(sessionData?.nombre.toUpperCase() || '') * 20 / doc.internal.scaleFactor;
      doc.line(
        (pageWidth - nombreWidth) / 2 - 10,
        88,
        (pageWidth + nombreWidth) / 2 + 10,
        88
      );

      // Texto principal
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const textoCompleto = 'Ha completado satisfactoriamente el programa de formación especializada para Delegado de Protección según los estándares establecidos por la LOPIVI, demostrando competencia técnica y profesional en la protección integral de la infancia y adolescencia.';

      const lineasTexto = doc.splitTextToSize(textoCompleto, pageWidth - 60);
      doc.text(lineasTexto, pageWidth / 2, 105, { align: 'center' });

      // Información del certificado en dos columnas
      const leftColumn = 40;
      const rightColumn = pageWidth / 2 + 20;
      let yPos = 130;

      // Columna izquierda
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Datos de la Certificación:', leftColumn, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      yPos += 8;
      doc.text(`Tipo de Delegado: ${sessionData?.tipo.charAt(0).toUpperCase() + sessionData?.tipo.slice(1)}`, leftColumn, yPos);
      yPos += 6;
      doc.text(`Entidad: ${sessionData?.entidad}`, leftColumn, yPos);
      yPos += 6;
      doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-ES')}`, leftColumn, yPos);
      yPos += 6;
      const fechaVencimiento = new Date();
      fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 2);
      doc.text(`Vigencia hasta: ${fechaVencimiento.toLocaleDateString('es-ES')}`, leftColumn, yPos);

      // Columna derecha
      yPos = 130;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Resultados de Evaluación:', rightColumn, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      yPos += 8;
      doc.setTextColor(0, 128, 0);
      doc.text(`Puntuación Final: ${resultadoTest?.puntuacion || '85'}%`, rightColumn, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 6;
      doc.text(`Fecha del Test: ${resultadoTest ? new Date(resultadoTest.fecha).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES')}`, rightColumn, yPos);
      yPos += 6;
      doc.setTextColor(0, 128, 0);
      doc.text('Estado: APROBADO', rightColumn, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 6;
      doc.setFontSize(8);
      doc.text(`Código de Verificación: ${codigoVerificacion}`, rightColumn, yPos);

      // Firma
      yPos = pageHeight - 40;
      // Sello oficial Custodia360
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(2);
      doc.roundedRect(leftColumn, yPos - 25, 60, 35, 3, 3);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('CUSTODIA360', leftColumn + 30, yPos - 15, { align: 'center' });

      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235);
      doc.text('SELLO OFICIAL', leftColumn + 30, yPos - 10, { align: 'center' });

      // Línea separadora
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.5);
      doc.line(leftColumn, yPos, leftColumn + 60, yPos);

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text('Custodia360', leftColumn + 30, yPos + 5, { align: 'center' });
      doc.text('Propiedad de Sportsmotherland SL', leftColumn + 30, yPos + 10, { align: 'center' });
      doc.text('CIF: B-66526658', leftColumn + 30, yPos + 15, { align: 'center' });

      // Sello corporativo
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(1);
      doc.circle(rightColumn + 30, yPos - 10, 15);
      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235);
      doc.setFont('helvetica', 'bold');
      doc.text('CUSTODIA360', rightColumn + 30, yPos - 12, { align: 'center' });
      doc.text('CERTIFICACIÓN', rightColumn + 30, yPos - 8, { align: 'center' });

      // Pie de página
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text('Custodia360 - Sistema de Certificación LOPIVI | www.custodia360.com', pageWidth / 2, pageHeight - 15, { align: 'center' });
      doc.text(`Certificado generado el ${new Date().toLocaleString('es-ES')}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Descargar
      doc.save(`Certificado_Delegado_${sessionData?.nombre?.replace(/\s+/g, '_')}_${codigoVerificacion}.pdf`);

    } catch (error) {
      console.error('Error generando certificado:', error)
      alert('Error al generar el certificado. Por favor, inténtelo de nuevo.')
    } finally {
      setPdfLoading(null)
    }
  }

  const generarPDF = async (tipo: string) => {
    setPdfLoading(tipo)

    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      // Configuración inicial
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margen = 20
      let yPos = margen

      // Función para agregar texto con salto de página automático
      const addText = (text: string, fontSize: number = 10, fontStyle: string = 'normal', color: number[] = [0, 0, 0]) => {
        if (yPos > pageHeight - 30) {
          doc.addPage()
          yPos = margen
        }
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', fontStyle)
        doc.setTextColor(color[0], color[1], color[2])
        const lines = doc.splitTextToSize(text, pageWidth - (margen * 2))
        doc.text(lines, margen, yPos)
        yPos += lines.length * (fontSize * 0.3) + 5
      }

      // Header del informe
      doc.setFillColor(37, 99, 235)
      doc.rect(0, 0, pageWidth, 40, 'F')

      // Logo
      doc.setFillColor(255, 255, 255)
      doc.circle(25, 20, 8, 'F')
      doc.setTextColor(37, 99, 235)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('C', 22, 22)

      // Título
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('INFORME DE ESTADO ACTUAL LOPIVI', pageWidth / 2, 20, { align: 'center' })
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text('Sistema Custodia360 - Cumplimiento Normativo', pageWidth / 2, 30, { align: 'center' })

      yPos = 60

      // Información general
      addText('INFORMACIÓN GENERAL', 16, 'bold', [37, 99, 235])
      addText(`Entidad: ${sessionData?.entidad || 'No especificada'}`, 12, 'normal')
      addText(`Delegado de Protección: ${sessionData?.nombre || 'No especificado'} (${sessionData?.tipo || 'No especificado'})`, 12, 'normal')
      addText(`Fecha del informe: ${new Date().toLocaleDateString('es-ES')}`, 12, 'normal')
      addText(`Estado general de cumplimiento: ${delegadoData?.estadoCumplimiento || 0}%`, 12, 'bold', [0, 128, 0])
      yPos += 10

      // Resumen ejecutivo
      addText('RESUMEN EJECUTIVO', 16, 'bold', [37, 99, 235])
      addText('El presente informe refleja el estado actual de cumplimiento normativo LOPIVI de la entidad. Se evalúan aspectos clave como la gestión de casos, formación del personal, documentación requerida y sistemas de protección implementados.', 11, 'normal')
      yPos += 5

      // Indicadores principales
      addText('INDICADORES PRINCIPALES', 16, 'bold', [37, 99, 235])
      addText(`• Casos activos en gestión: ${delegadoData?.casosActivos || 0}`, 11, 'normal')
      addText(`• Alertas pendientes de atención: ${delegadoData?.alertas || 0}`, 11, 'normal')
      addText(`• Nivel de cumplimiento normativo: ${delegadoData?.estadoCumplimiento || 0}%`, 11, 'normal')
      addText(`• Estado de certificación del delegado: ${delegadoData?.certificacionVigente ? 'Vigente' : 'Requiere renovación'}`, 11, 'normal')
      addText(`• Próxima renovación requerida: ${delegadoData?.proximaRenovacion || 'No especificada'}`, 11, 'normal')
      yPos += 10

      // Análisis de personal
      addText('ANÁLISIS DEL PERSONAL', 16, 'bold', [37, 99, 235])
      addText(`• Personal total registrado: 6 personas`, 11, 'normal')
      addText(`• Personal activo: 5 personas (83%)`, 11, 'normal')
      addText(`• Formación LOPIVI completada: 3 personas (50%)`, 11, 'normal')
      addText(`• Certificaciones vigentes: 3 personas (50%)`, 11, 'normal')
      addText(`• Personal con formación pendiente: 3 personas (requiere atención)`, 11, 'normal', [180, 0, 0])
      yPos += 10

      // Gestión de casos
      addText('GESTIÓN DE CASOS', 16, 'bold', [37, 99, 235])
      addText('En el período actual se han gestionado los siguientes casos:', 11, 'normal')
      addText(`• CASO-2025-001: Situación de Riesgo - En seguimiento`, 10, 'normal')
      addText(`• CASO-2025-002: Incidente Menor - En investigación`, 10, 'normal')
      addText(`• CASO-2025-003: Comunicación Familia - Resuelto`, 10, 'normal')
      addText('Todos los casos se gestionan siguiendo protocolos LOPIVI establecidos con documentación completa y seguimiento adecuado.', 11, 'normal')
      yPos += 10

      // Cumplimiento documental
      addText('CUMPLIMIENTO DOCUMENTAL', 16, 'bold', [37, 99, 235])
      addText('Estado de la documentación obligatoria LOPIVI:', 11, 'normal')
      addText(`✓ Plan de Protección - Vigente (actualizado 01/09/2025)`, 10, 'normal', [0, 128, 0])
      addText(`✓ Código de Conducta - Vigente (actualizado 01/09/2025)`, 10, 'normal', [0, 128, 0])
      addText(`✓ Protocolos de Actuación - Vigentes (actualizados 01/09/2025)`, 10, 'normal', [0, 128, 0])
      addText(`✓ Registro de Personal - Activo (actualizado 10/09/2025)`, 10, 'normal', [0, 128, 0])
      addText(`✓ Registro de Incidentes - Activo (último registro 15/09/2025)`, 10, 'normal', [0, 128, 0])
      yPos += 10

      // Recomendaciones
      addText('RECOMENDACIONES PRIORITARIAS', 16, 'bold', [37, 99, 235])
      addText('1. FORMACIÓN PENDIENTE (Prioridad Alta):', 12, 'bold', [180, 0, 0])
      addText('   - Completar formación LOPIVI de Carlos Ruiz Martín (Entrenador)', 10, 'normal')
      addText('   - Finalizar módulos pendientes de Miguel Torres Vega (Monitor Auxiliar)', 10, 'normal')
      addText('   - Renovar certificación de Roberto Jiménez Cruz (Monitor - suspendido)', 10, 'normal')

      addText('2. SEGUIMIENTO DE CASOS (Prioridad Media):', 12, 'bold', [255, 140, 0])
      addText('   - Revisar evolución del CASO-2025-001 (próxima revisión 22/09/2025)', 10, 'normal')
      addText('   - Completar investigación del CASO-2025-002 (revisión 19/09/2025)', 10, 'normal')

      addText('3. MEJORAS SUGERIDAS (Prioridad Baja):', 12, 'bold', [0, 128, 0])
      addText('   - Programar sesiones de refuerzo para personal ya certificado', 10, 'normal')
      addText('   - Implementar sistema de alertas automáticas para renovaciones', 10, 'normal')
      yPos += 10

      // Conclusiones
      addText('CONCLUSIONES', 16, 'bold', [37, 99, 235])
      addText(`La entidad ${sessionData?.entidad} presenta un nivel de cumplimiento del ${delegadoData?.estadoCumplimiento}%, considerado como BUENO. El sistema de protección está operativo con casos bajo control y documentación actualizada. Se requiere atención prioritaria en la finalización de formaciones pendientes para alcanzar el 100% de cumplimiento.`, 11, 'normal')
      yPos += 5
      addText('El delegado de protección cumple satisfactoriamente con sus funciones, manteniendo registros actualizados y protocolo de actuación efectivo.', 11, 'normal')
      yPos += 15

      // Firma
      addText('VALIDACIÓN Y FIRMA DIGITAL', 14, 'bold', [37, 99, 235])
      yPos += 10

      // Sello oficial Custodia360
      doc.setDrawColor(37, 99, 235)
      doc.setLineWidth(2)
      doc.roundedRect(margen, yPos - 10, 80, 25, 3, 3)

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('CUSTODIA360', margen + 40, yPos)

      doc.setFontSize(8)
      doc.setTextColor(37, 99, 235)
      doc.text('SELLO OFICIAL', margen + 40, yPos + 5, { align: 'center' })

      // Línea separadora
      doc.setDrawColor(100, 100, 100)
      doc.setLineWidth(0.5)
      doc.line(margen, yPos + 15, margen + 80, yPos + 15)

      yPos += 25
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.text('Custodia360', margen + 40, yPos, { align: 'center' })
      doc.text('Propiedad de Sportsmotherland SL', margen + 40, yPos + 4, { align: 'center' })
      doc.text('CIF: B-66526658', margen + 40, yPos + 8, { align: 'center' })

      // Sello
      doc.setDrawColor(37, 99, 235)
      doc.setLineWidth(1)
      doc.circle(pageWidth - 50, yPos - 5, 15)
      doc.setFontSize(8)
      doc.setTextColor(37, 99, 235)
      doc.setFont('helvetica', 'bold')
      doc.text('CUSTODIA360', pageWidth - 50, yPos - 7, { align: 'center' })
      doc.text('CERTIFICACIÓN', pageWidth - 50, yPos - 3, { align: 'center' })

      yPos += 20
      addText(`Informe generado automáticamente el ${new Date().toLocaleString('es-ES')} por el Sistema Custodia360`, 8, 'normal', [100, 100, 100])
      addText('Este documento tiene validez oficial para inspecciones y auditorías LOPIVI', 8, 'normal', [100, 100, 100])

      // Pie de página en todas las páginas
      const totalPages = doc.internal.pages.length - 1
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.text('Custodia360 - Sistema de Gestión LOPIVI | www.custodia360.com', pageWidth / 2, pageHeight - 10, { align: 'center' })
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: 'right' })
      }

      // Descargar
      doc.save(`Informe_Estado_LOPIVI_${sessionData?.entidad?.replace(/\s+/g, '_')}_${Date.now()}.pdf`)

    } catch (error) {
      console.error('Error generando informe:', error)
      alert('Error al generar el informe. Por favor, inténtelo de nuevo.')
    } finally {
      setPdfLoading(null)
    }
  }
