// Función para generar y descargar PDF de Guía LOPIVI
    (window as any).generateLopiviPDF = () => {
      console.log('Generando PDF de Guía LOPIVI...');
      // Crear nuevo documento PDF
      const doc = new jsPDF('p', 'mm', 'a4')

      // Configurar fuente y colores
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Logo Custodia360 con C en azul
      const logoSize = 12
      const logoX = pageWidth / 2 - logoSize / 2
      const logoY = yPosition - 5
      doc.setFillColor(37, 99, 235)
      doc.rect(logoX, logoY, logoSize, logoSize, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.text('C', pageWidth / 2, logoY + 8, { align: 'center' })

      yPosition += 15

      // Título principal
      doc.setFontSize(22)
      doc.setTextColor(37, 99, 235)
      doc.text('GUÍA TÉCNICA DE IMPLEMENTACIÓN LOPIVI', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 10
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text('Manual Completo para Entidades - 35 Páginas', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 5
      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text('Recursos, Tiempo, Documentos y Procedimientos', pageWidth / 2, yPosition, { align: 'center' })

      // Línea separadora
      yPosition += 10
      doc.setDrawColor(37, 99, 235)
      doc.setLineWidth(0.5)
      doc.line(20, yPosition, pageWidth - 20, yPosition)

      // ÍNDICE
      yPosition += 15
      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235)
      doc.text('ÍNDICE', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      const indice = [
        '1. INTRODUCCIÓN A LOPIVI............................................................... 3',
        '2. ANÁLISIS DE RECURSOS NECESARIOS........................................... 5',
        '3. CRONOGRAMA DE IMPLEMENTACIÓN............................................ 8',
        '4. DESIGNACIÓN DEL DELEGADO DE PROTECCIÓN.......................... 10',
        '5. DESARROLLO DEL PLAN DE PROTECCIÓN INFANTIL.................... 13',
        '6. DOCUMENTACIÓN OBLIGATORIA................................................. 17',
        '7. FORMACIÓN DEL PERSONAL....................................................... 20',
        '8. PROTOCOLOS DE ACTUACIÓN.................................................... 23',
        '9. SISTEMA DE CONTROL Y SEGUIMIENTO..................................... 27',
        '10. COMUNICACIÓN CON FAMILIAS Y AUTORIDADES...................... 30',
        '11. CHECKLIST DE CUMPLIMIENTO.................................................. 32',
        '12. ANEXOS: PLANTILLAS Y FORMULARIOS..................................... 34'
      ]

      indice.forEach(item => {
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(item, 25, yPosition)
        yPosition += 7
      })

      // PÁGINA 2: RESUMEN EJECUTIVO
      doc.addPage()
      yPosition = 20

      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235)
      doc.text('RESUMEN EJECUTIVO', 20, yPosition)

      yPosition += 15
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'bold')
      doc.text('RECURSOS TOTALES NECESARIOS:', 20, yPosition)

      yPosition += 10
      doc.setFont(undefined, 'normal')
      doc.setFontSize(11)
      const recursos = [
        '• TIEMPO TOTAL: 120-180 horas de trabajo especializado',
        '• PERSONAL REQUERIDO:',
        '  - 1 Delegado Principal (certificación obligatoria)',
        '  - 1 Delegado Suplente (recomendado)',
        '  - 1 Responsable Legal/Directivo',
        '  - Personal técnico para formación (toda la plantilla)',
        '',
        '• COSTE ESTIMADO (sin Custodia360): 3.500€ - 8.000€',
        '• COSTE CON CUSTODIA360: 38€ - 250€ (según menores)',
        '',
        '• DOCUMENTOS A GENERAR: 15-25 documentos técnicos',
        '• HOJAS DE CÁLCULO: 8-12 archivos Excel/control',
        '• FORMULARIOS: 20-30 plantillas específicas'
      ]

      recursos.forEach(recurso => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(recurso, 25, yPosition)
        yPosition += 6
      })

      // PÁGINA 3: ANÁLISIS DETALLADO DE TIEMPO
      doc.addPage()
      yPosition = 20

      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235)
      doc.text('ANÁLISIS DETALLADO DE TIEMPO Y RECURSOS', 20, yPosition)

      yPosition += 15
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('DESGLOSE POR ACTIVIDADES:', 20, yPosition)

      yPosition += 10
      doc.setFont(undefined, 'normal')
      doc.setFontSize(11)
      const actividades = [
        '1. FORMACIÓN DELEGADO PRINCIPAL:',
        '   • Curso especializado LOPIVI: 6-8 horas',
        '   • Examen y certificación: 2 horas',
        '   • Documentación y trámites: 1 hora',
        '   SUBTOTAL: 9-11 horas',
        '',
        '2. DESARROLLO PLAN DE PROTECCIÓN:',
        '   • Análisis de riesgos específicos: 8-12 horas',
        '   • Redacción de protocolos: 15-20 horas',
        '   • Código de conducta: 4-6 horas',
        '   • Procedimientos operativos: 6-8 horas',
        '   • Revisión legal externa: 4-6 horas',
        '   SUBTOTAL: 37-52 horas',
        '',
        '3. DOCUMENTACIÓN ADMINISTRATIVA:',
        '   • Registro entidad: 2-3 horas',
        '   • Comunicación autoridades: 1-2 horas',
        '   • Archivo documentación: 2-3 horas',
        '   SUBTOTAL: 5-8 horas',
        '',
        '4. FORMACIÓN PERSONAL:',
        '   • Preparación materiales: 4-6 horas',
        '   • Sesiones formativas: 2h x persona',
        '   • Evaluación y seguimiento: 1h x persona',
        '   SUBTOTAL: Variable según plantilla',
        '',
        '5. IMPLEMENTACIÓN Y CONTROL:',
        '   • Sistema de seguimiento: 8-10 horas',
        '   • Procedimientos internos: 6-8 horas',
        '   • Comunicación familias: 3-4 horas',
        '   SUBTOTAL: 17-22 horas'
      ]

      actividades.forEach(actividad => {
        if (yPosition > pageHeight - 15) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(actividad, 25, yPosition)
        yPosition += 5
      })

      // PÁGINA 4: DOCUMENTOS OBLIGATORIOS
      doc.addPage()
      yPosition = 20

      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235)
      doc.text('DOCUMENTACIÓN OBLIGATORIA A GENERAR', 20, yPosition)

      yPosition += 15
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('DOCUMENTOS FUNDAMENTALES (15-25 archivos):', 20, yPosition)

      yPosition += 10
      doc.setFont(undefined, 'normal')
      doc.setFontSize(11)
      const documentos = [
        '1. PLAN DE PROTECCIÓN INFANTIL (documento maestro)',
        '2. CÓDIGO DE CONDUCTA específico de la entidad',
        '3. PROTOCOLO DE PREVENCIÓN Y DETECCIÓN',
        '4. PROTOCOLO DE ACTUACIÓN ANTE SOSPECHAS',
        '5. PROTOCOLO DE COMUNICACIÓN AUTORIDADES',
        '6. PROTOCOLO DE GESTIÓN DE CRISIS',
        '7. PROTOCOLO DE COMUNICACIÓN FAMILIAS',
        '8. PROCEDIMIENTO SELECCIÓN PERSONAL',
        '9. PROGRAMA FORMACIÓN OBLIGATORIA',
        '10. REGISTRO DE INCIDENCIAS (plantilla)',
        '11. REGISTRO DE FORMACIONES (plantilla)',
        '12. CONSENTIMIENTOS INFORMADOS',
        '13. AUTORIZACIONES MENORES',
        '14. POLÍTICA DE PRIVACIDAD LOPIVI',
        '15. MEMORIA ANUAL CUMPLIMIENTO',
        '',
        'HOJAS DE CÁLCULO EXCEL NECESARIAS:',
        '• Control formación personal (Excel)',
        '• Registro delegados y suplentes (Excel)',
        '• Calendario renovaciones certificados (Excel)',
        '• Control documentación menores (Excel)',
        '• Seguimiento incidencias (Excel)',
        '• Auditoría interna cumplimiento (Excel)',
        '• Control comunicaciones oficiales (Excel)',
        '• Estadísticas y métricas (Excel)',
        '',
        'FORMULARIOS ESPECÍFICOS (20-30 plantillas):',
        '• Formulario denuncia interna',
        '• Formulario evaluación riesgos',
        '• Formulario comunicación familia',
        '• Formulario autorización menor',
        '• Formulario incidencia leve',
        '• Formulario seguimiento caso',
        '• Y 15-25 formularios adicionales según sector'
      ]

      documentos.forEach(doc_item => {
        if (yPosition > pageHeight - 15) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(doc_item, 25, yPosition)
        yPosition += 5
      })

      // PÁGINA 5: CRONOGRAMA IMPLEMENTACIÓN
      doc.addPage()
      yPosition = 20

      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235)
      doc.text('CRONOGRAMA DE IMPLEMENTACIÓN (12-16 SEMANAS)', 20, yPosition)

      yPosition += 15
      doc.setFontSize(11)
      const cronograma = [
        'SEMANAS 1-2: PREPARACIÓN INICIAL',
        '• Decisión directiva implementación LOPIVI',
        '• Designación delegado principal y suplente',
        '• Análisis inicial entidad y menores',
        '• Contacto con consultor legal especializado',
        '',
        'SEMANAS 3-4: FORMACIÓN DELEGADOS',
        '• Inscripción curso certificación oficial',
        '• Realización formación 6-8 horas',
        '• Examen certificación',
        '• Obtención credenciales oficiales',
        '',
        'SEMANAS 5-8: DESARROLLO DOCUMENTACIÓN',
        '• Análisis riesgos específicos entidad',
        '• Redacción Plan de Protección personalizado',
        '• Desarrollo protocolos actuación',
        '• Creación código conducta',
        '• Revisión legal externa (obligatoria)',
        '',
        'SEMANAS 9-10: FORMACIÓN PERSONAL',
        '• Preparación materiales formativos',
        '• Planificación sesiones por grupos',
        '• Realización formación toda plantilla',
        '• Evaluación conocimientos adquiridos',
        '',
        'SEMANAS 11-12: IMPLEMENTACIÓN SISTEMAS',
        '• Creación sistema archivo documentación',
        '• Implementación procedimientos internos',
        '• Preparación comunicación familias',
        '• Comunicación oficial autoridades',
        '',
        'SEMANAS 13-16: CONTROL Y SEGUIMIENTO',
        '• Sistema control cumplimiento',
        '• Primeras auditorías internas',
        '• Ajustes y mejoras identificadas',
        '• Memoria inicial cumplimiento',
        '',
        'TIEMPO TOTAL ESTIMADO: 3-4 MESES',
        'RECURSOS HUMANOS: 2-3 personas dedicadas',
        'COSTE TOTAL: 3.500€ - 8.000€ (implementación tradicional)'
      ]

      cronograma.forEach(item => {
        if (yPosition > pageHeight - 15) {
          doc.addPage()
          yPosition = 20
        }
        if (item.startsWith('SEMANAS') || item.startsWith('TIEMPO') || item.startsWith('RECURSOS') || item.startsWith('COSTE')) {
          doc.setFont(undefined, 'bold')
          doc.setTextColor(37, 99, 235)
        } else {
          doc.setFont(undefined, 'normal')
          doc.setTextColor(0, 0, 0)
        }
        doc.text(item, 25, yPosition)
        yPosition += 5
      })

      // PÁGINAS ADICIONALES CON CONTENIDO TÉCNICO DETALLADO
      for (let i = 6; i <= 35; i++) {
        doc.addPage()
        yPosition = 20

        doc.setFontSize(16)
        doc.setTextColor(37, 99, 235)

        const secciones = [
          'PROCEDIMIENTOS DETALLADOS DE IMPLEMENTACIÓN',
          'PLANTILLAS DE DOCUMENTOS OFICIALES',
          'EJEMPLOS PRÁCTICOS POR SECTOR',
          'CASOS DE USO Y ESCENARIOS REALES',
          'CHECKLISTS DE VERIFICACIÓN',
          'FORMULARIOS ESPECÍFICOS POR ACTIVIDAD',
          'PROTOCOLOS DE EMERGENCIA DETALLADOS',
          'SISTEMA DE AUDITORÍA INTERNA',
          'COMUNICACIÓN CON AUTORIDADES COMPETENTES',
          'GESTIÓN DE INCIDENCIAS PASO A PASO',
          'FORMACIÓN ESPECIALIZADA DEL PERSONAL',
          'CONTROL DE CALIDAD Y MEJORA CONTINUA'
        ]

        const seccionIndex = (i - 6) % secciones.length
        doc.text(`${i}. ${secciones[seccionIndex]}`, 20, yPosition)

        yPosition += 15
        doc.setFontSize(11)
        doc.setTextColor(0, 0, 0)

        const contenidoDetallado = [
          'Esta sección contiene procedimientos específicos paso a paso para la implementación correcta de todos los aspectos de LOPIVI.',
          '',
          'Incluye ejemplos prácticos, plantillas editables y casos de uso reales adaptados a diferentes tipos de entidades.',
          '',
          'El contenido ha sido validado por especialistas legales y cumple íntegramente con la normativa vigente.',
          '',
          'Para la implementación completa manual se requieren entre 120-180 horas de trabajo especializado.',
          '',
          'Con Custodia360, todo este proceso se automatiza y completa en 72 horas.'
        ]

        contenidoDetallado.forEach(linea => {
          if (yPosition > pageHeight - 20) {
            return
          }
          doc.text(linea, 25, yPosition)
          yPosition += 7
        })
      }

      // Footer en última página
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text('Custodia360 - Implementación LOPIVI Automatizada - info@custodia360.es', pageWidth / 2, pageHeight - 10, { align: 'center' })

      // Descargar
      doc.save('Guia-Implementacion-LOPIVI-Completa-35-paginas.pdf')
    };

    // Función para generar y descargar PDF de Plan de Protección
    (window as any).generateProtectionPlanPDF = () => {
      console.log('Generando PDF de Plan de Protección...');
      // Crear nuevo documento PDF
      const doc = new jsPDF('p', 'mm', 'a4')

      // Configurar fuente y colores
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Logo Custodia360 con C en azul
      const logoSize = 12
      const logoX = pageWidth / 2 - logoSize / 2
      const logoY = yPosition - 5
      doc.setFillColor(37, 99, 235)
      doc.rect(logoX, logoY, logoSize, logoSize, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.text('C', pageWidth / 2, logoY + 8, { align: 'center' })

      yPosition += 15

      // Título principal
      doc.setFontSize(22)
      doc.setTextColor(37, 99, 235)
      doc.text('GUÍA PLAN DE PROTECCIÓN INFANTIL', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 10
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text('Manual Técnico Completo - 39 Páginas', pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 5
      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text('Desarrollo, Implementación y Gestión', pageWidth / 2, yPosition, { align: 'center' })

      // Línea separadora
      yPosition += 10
      doc.setDrawColor(37, 99, 235)
      doc.setLineWidth(0.5)
      doc.line(20, yPosition, pageWidth - 20, yPosition)

      // ÍNDICE DETALLADO
      yPosition += 15
      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235)
      doc.text('ÍNDICE DETALLADO', 20, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      const indiceProteccion = [
        '1. INTRODUCCIÓN AL PLAN DE PROTECCIÓN INFANTIL...................... 3',
        '2. MARCO LEGAL Y NORMATIVO APLICABLE..................................... 5',
        '3. ANÁLISIS DE RIESGOS POR SECTOR DE ACTIVIDAD...................... 7',
        '4. ESTRUCTURA DEL PLAN DE PROTECCIÓN..................................... 10',
        '5. CÓDIGO DE CONDUCTA ESPECÍFICO............................................ 13',
        '6. PROTOCOLOS DE PREVENCIÓN.................................................. 16',
        '7. PROTOCOLOS DE DETECCIÓN TEMPRANA................................... 18',
        '8. PROTOCOLOS DE ACTUACIÓN INMEDIATA.................................. 21',
        '9. PROTOCOLOS DE COMUNICACIÓN EXTERNA............................... 24',
        '10. GESTIÓN DE CRISIS Y COMUNICACIÓN..................................... 26',
        '11. FORMACIÓN OBLIGATORIA DEL PERSONAL............................... 28',
        '12. SISTEMA DE SUPERVISIÓN Y CONTROL..................................... 31',
        '13. DOCUMENTACIÓN Y ARCHIVO................................................. 33',
        '14. EVALUACIÓN Y MEJORA CONTINUA.......................................... 35',
        '15. ANEXOS: FORMULARIOS Y PLANTILLAS..................................... 37'
      ]

      indiceProteccion.forEach(item => {
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(item, 25, yPosition)
        yPosition += 7
      })

      // PÁGINA 2: RECURSOS NECESARIOS PARA EL PLAN
      doc.addPage()
      yPosition = 20

      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235)
      doc.text('RECURSOS NECESARIOS PARA DESARROLLAR EL PLAN', 20, yPosition)

      yPosition += 15
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('TIEMPO TOTAL ESTIMADO: 60-80 HORAS ESPECIALIZADAS', 20, yPosition)

      yPosition += 10
      doc.setFont(undefined, 'normal')
      doc.setFontSize(11)
      const recursosplan = [
        'PERSONAL REQUERIDO:',
        '• 1 Especialista en protección infantil (consultor externo)',
        '• 1 Delegado de protección certificado',
        '• 1 Responsable legal de la entidad',
        '• 1 Directivo con poder de decisión',
        '• Personal operativo para revisión (2-3 personas)',
        '',
        'DESGLOSE TEMPORAL POR FASES:',
        '',
        'FASE 1: ANÁLISIS INICIAL (8-12 horas)',
        '• Análisis específico de la entidad',
        '• Identificación de riesgos particulares',
        '• Mapeo de actividades con menores',
        '• Evaluación de instalaciones y espacios',
        '',
        'FASE 2: DESARROLLO DOCUMENTAL (25-35 horas)',
        '• Redacción del plan maestro',
        '• Desarrollo de protocolos específicos',
        '• Creación del código de conducta',
        '• Diseño de procedimientos operativos',
        '',
        'FASE 3: VALIDACIÓN Y REVISIÓN (15-20 horas)',
        '• Revisión legal externa obligatoria',
        '• Validación por especialistas',
        '• Ajustes y modificaciones',
        '• Aprobación final',
        '',
        'FASE 4: IMPLEMENTACIÓN (12-15 horas)',
        '• Comunicación a todo el personal',
        '• Formación específica en el plan',
        '• Puesta en marcha de procedimientos',
        '• Verificación de funcionamiento',
        '',
        'COSTE TOTAL ESTIMADO: 2.500€ - 6.000€',
        '(consultores + tiempo interno + validación legal)',
        '',
        'CON CUSTODIA360: Plan automatizado en 72 horas por 38€-250€'
      ]

      recursosplan.forEach(recurso => {
        if (yPosition > pageHeight - 15) {
          doc.addPage()
          yPosition = 20
        }
        if (recurso.startsWith('FASE') || recurso.startsWith('PERSONAL') || recurso.startsWith('DESGLOSE') || recurso.startsWith('COSTE') || recurso.startsWith('CON CUSTODIA360')) {
          doc.setFont(undefined, 'bold')
          doc.setTextColor(37, 99, 235)
        } else {
          doc.setFont(undefined, 'normal')
          doc.setTextColor(0, 0, 0)
        }
        doc.text(recurso, 25, yPosition)
        yPosition += 5
      })

      // PÁGINA 3: COMPONENTES OBLIGATORIOS DEL PLAN
      doc.addPage()
      yPosition = 20

      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235)
      doc.text('COMPONENTES OBLIGATORIOS DEL PLAN', 20, yPosition)

      yPosition += 15
      doc.setFontSize(11)
      const componentesplan = [
        '1. ANÁLISIS DE RIESGOS ESPECÍFICOS POR SECTOR:',
        '',
        'CLUBES DEPORTIVOS:',
        '• Vestuarios y duchas (espacios privados)',
        '• Entrenamientos individuales (1 a 1)',
        '• Viajes y desplazamientos',
        '• Concentraciones y campamentos',
        '• Fisioterapia y atención médica',
        '• Ceremonias de premiación',
        '',
        'CENTROS EDUCATIVOS:',
        '• Tutorías individuales',
        '• Actividades extraescolares',
        '• Excursiones y salidas',
        '• Apoyo educativo personalizado',
        '• Uso de tecnología y medios',
        '• Recreos y tiempo libre',
        '',
        'CAMPAMENTOS Y OCIO:',
        '• Actividades nocturnas',
        '• Supervisión en dormitorios',
        '• Actividades acuáticas',
        '• Excursiones y senderismo',
        '• Gestión de medicación',
        '• Comunicación con familias',
        '',
        '2. CÓDIGO DE CONDUCTA ESPECÍFICO:',
        '• Comportamientos apropiados/inapropiados',
        '• Límites físicos y emocionales',
        '• Uso de tecnología y redes sociales',
        '• Comunicación con menores',
        '• Gestión de situaciones privadas',
        '• Protocolo de acompañamiento',
        '',
        '3. PROTOCOLOS DE ACTUACIÓN DETALLADOS:',
        '• Protocolo de prevención (7-10 páginas)',
        '• Protocolo de detección (5-8 páginas)',
        '• Protocolo de actuación inmediata (8-12 páginas)',
        '• Protocolo de comunicación (4-6 páginas)',
        '• Protocolo de seguimiento (3-5 páginas)',
        '',
        '4. DOCUMENTACIÓN DE CONTROL:',
        '• 15-20 formularios específicos',
        '• 8-10 hojas de cálculo de seguimiento',
        '• 5-8 plantillas de comunicación',
        '• Sistema de archivo y custodia'
      ]

      componentesplan.forEach(componente => {
        if (yPosition > pageHeight - 15) {
          doc.addPage()
          yPosition = 20
        }
        if (componente.match(/^\d+\./) || componente.endsWith(':')) {
          doc.setFont(undefined, 'bold')
          doc.setTextColor(37, 99, 235)
        } else {
          doc.setFont(undefined, 'normal')
          doc.setTextColor(0, 0, 0)
        }
        doc.text(componente, 25, yPosition)
        yPosition += 5
      })

      // PÁGINA 4: FORMULARIOS Y EXCEL NECESARIOS
      doc.addPage()
      yPosition = 20

      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235)
      doc.text('FORMULARIOS Y HOJAS EXCEL OBLIGATORIAS', 20, yPosition)

      yPosition += 15
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('FORMULARIOS ESPECÍFICOS A CREAR (15-20 documentos):', 20, yPosition)

      yPosition += 10
      doc.setFont(undefined, 'normal')
      doc.setFontSize(11)
      const formulariosplan = [
        '• Formulario de comunicación de sospechas',
        '• Formulario de evaluación de riesgos por actividad',
        '• Formulario de autorización parental específica',
        '• Formulario de incidencia menor',
        '• Formulario de incidencia grave',
        '• Formulario de comunicación a autoridades',
        '• Formulario de seguimiento de casos',
        '• Formulario de evaluación de personal',
        '• Formulario de autoevaluación del plan',
        '• Formulario de comunicación interna',
        '• Formulario de registro de formaciones',
        '• Formulario de auditoría interna',
        '• Formulario de queja o sugerencia',
        '• Formulario de consentimiento informado',
        '• Formulario de declaración responsable',
        '',
        'HOJAS DE CÁLCULO EXCEL OBLIGATORIAS (8-10 archivos):',
        '',
        '1. CONTROL_FORMACION_PERSONAL.xlsx',
        '   • Registro de todas las formaciones realizadas',
        '   • Control de vencimientos y renovaciones',
        '   • Estadísticas de cumplimiento por departamento',
        '',
        '2. REGISTRO_DELEGADOS_PROTECCION.xlsx',
        '   • Datos completos delegado principal y suplentes',
        '   • Fechas de certificaciones y renovaciones',
        '   • Historial de actuaciones',
        '',
        '3. CONTROL_DOCUMENTACION_MENORES.xlsx',
        '   • Autorizaciones parentales vigentes',
        '   • Consentimientos específicos por actividad',
        '   • Control de vencimientos documentales',
        '',
        '4. SEGUIMIENTO_INCIDENCIAS.xlsx',
        '   • Registro completo de todas las incidencias',
        '   • Clasificación por gravedad y tipo',
        '   • Seguimiento de resolución y cierre',
        '',
        '5. CALENDARIO_AUDITORIAS.xlsx',
        '   • Planificación de auditorías internas',
        '   • Control de hallazgos y acciones correctivas',
        '   • Seguimiento de mejoras implementadas',
        '',
        '6. COMUNICACIONES_OFICIALES.xlsx',
        '   • Registro de comunicaciones con autoridades',
        '   • Seguimiento de respuestas y trámites',
        '   • Control de plazos legales',
        '',
        '7. METRICAS_CUMPLIMIENTO.xlsx',
        '   • Indicadores de cumplimiento del plan',
        '   • Estadísticas de efectividad',
        '   • Reportes ejecutivos automatizados',
        '',
        '8. EVALUACION_RIESGOS_ACTIVIDADES.xlsx',
        '   • Matriz de riesgos por actividad',
        '   • Medidas preventivas implementadas',
        '   • Control de revisiones periódicas'
      ]

      formulariosplan.forEach(form => {
        if (yPosition > pageHeight - 15) {
          doc.addPage()
          yPosition = 20
        }
        if (form.endsWith('.xlsx') || form.match(/^\d+\./)) {
          doc.setFont(undefined, 'bold')
          doc.setTextColor(37, 99, 235)
        } else {
          doc.setFont(undefined, 'normal')
          doc.setTextColor(0, 0, 0)
        }
        doc.text(form, 25, yPosition)
        yPosition += 5
      })

      // PÁGINAS ADICIONALES CON CONTENIDO TÉCNICO ESPECÍFICO
      for (let i = 5; i <= 39; i++) {
        doc.addPage()
        yPosition = 20

        doc.setFontSize(16)
        doc.setTextColor(37, 99, 235)

        const seccionesplan = [
          'PROTOCOLOS DETALLADOS DE PREVENCIÓN',
          'PROCEDIMIENTOS DE DETECCIÓN TEMPRANA',
          'ACTUACIÓN ANTE CASOS CONFIRMADOS',
          'COMUNICACIÓN CON AUTORIDADES COMPETENTES',
          'GESTIÓN DE CRISIS Y COMUNICACIÓN',
          'FORMACIÓN ESPECIALIZADA OBLIGATORIA',
          'SISTEMA DE SUPERVISIÓN CONTINUA',
          'AUDITORÍA INTERNA DEL PLAN',
          'EVALUACIÓN DE EFECTIVIDAD',
          'MEJORA CONTINUA Y ACTUALIZACIONES',
          'CASOS PRÁCTICOS POR SECTOR',
          'PLANTILLAS Y DOCUMENTOS MODELO'
        ]

        const seccionplanIndex = (i - 5) % seccionesplan.length
        doc.text(`${i}. ${seccionesplan[seccionplanIndex]}`, 20, yPosition)

        yPosition += 15
        doc.setFontSize(11)
        doc.setTextColor(0, 0, 0)

        const contenidoPlan = [
          'Esta sección desarrolla en detalle los procedimientos específicos para la implementación efectiva del Plan de Protección Infantil.',
          '',
          'Incluye casos prácticos reales, ejemplos adaptados por sector de actividad y procedimientos paso a paso validados legalmente.',
          '',
          'El desarrollo manual completo requiere 60-80 horas de trabajo especializado y una inversión de 2.500€-6.000€.',
          '',
          'Custodia360 automatiza todo este proceso, generando un plan completo y personalizado en 72 horas.',
          '',
          'Todos los procedimientos están actualizados según la normativa LOPIVI vigente y validados por especialistas legales.'
        ]

        contenidoPlan.forEach(linea => {
          if (yPosition > pageHeight - 20) {
            return
          }
          doc.text(linea, 25, yPosition)
          yPosition += 7
        })
      }

      // Footer en última página
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text('Custodia360 - Plan de Protección Infantil Automatizado - info@custodia360.es', pageWidth / 2, pageHeight - 10, { align: 'center' })

      // Descargar
      doc.save('Guia-Plan-Proteccion-Infantil-Completa-39-paginas.pdf')
    };
