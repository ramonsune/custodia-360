import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Packer } from 'docx'
import { generarPDFProfesional } from '@/lib/document-generator/pdf-generator'
import { generarDOCXProfesional } from '@/lib/document-generator/docx-generator'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const fechaActual = new Date().toLocaleDateString('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

// Configuraciones de los 2 documentos NUEVOS (3 y 4)
// Los documentos 1 y 2 ya existen en el Bloque 01
const documentosConfig = [
  {
    filename: 'Modelo_Plan_Proteccion',
    titulo: 'Modelo de Plan de Protección',
    subtitulo: 'Plantilla editable para entidades',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Identificación de la Entidad',
        contenido: [
          'Nombre oficial de la entidad: _________________________________',
          '',
          'CIF/NIF: _________________________________',
          '',
          'Actividad: [ ] Educativa  [ ] Deportiva  [ ] Social  [ ] Otra: _____________',
          '',
          'Dirección completa: _________________________________',
          '',
          'Responsable de Protección: _________________________________',
          '',
          'Teléfono de contacto: _________________________________',
          '',
          'Correo electrónico: _________________________________'
        ]
      },
      {
        titulo: '2. Declaración de Compromiso',
        contenido: [
          'La entidad se compromete a proteger a todos los menores con los que interactúa, adoptando las medidas establecidas en la Ley Orgánica 8/2021 (LOPIVI) y sus desarrollos autonómicos.',
          '',
          'Este compromiso se extiende a:',
          '- Garantizar entornos seguros y libres de violencia.',
          '- Implementar protocolos de prevención, detección y actuación.',
          '- Formar y sensibilizar a todo el personal.',
          '- Mantener actualizado el sistema de protección.',
          '- Cooperar con las autoridades competentes.'
        ]
      },
      {
        titulo: '3. Marco Legal',
        contenido: [
          'Este Plan de Protección se fundamenta en:',
          '',
          '- Ley Orgánica 8/2021, de 4 de junio, de protección integral a la infancia y la adolescencia frente a la violencia (LOPIVI).',
          '- Reglamento General de Protección de Datos (RGPD) UE 2016/679.',
          '- Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).',
          '- Normativa autonómica específica aplicable.',
          '- Convención sobre los Derechos del Niño de Naciones Unidas.'
        ]
      },
      {
        titulo: '4. Gobernanza del Plan',
        contenido: [
          '**Órganos responsables:**',
          '',
          '- Dirección / Comité de Protección: _________________________________',
          '',
          '- Responsable de Protección Principal: _________________________________',
          '',
          '- Responsable de Protección Suplente: _________________________________',
          '',
          '**Calendario de revisión:**',
          '',
          '- Reuniones ordinarias: [Periodicidad] _________________________________',
          '- Revisión anual del Plan: [Fecha prevista] _________________________________',
          '- Auditoría externa: [Fecha prevista] _________________________________'
        ]
      },
      {
        titulo: '5. Análisis de Riesgos',
        contenido: [
          '**Metodología de evaluación:**',
          '',
          'Se identifican las actividades con contacto directo con menores y se evalúan según:',
          '- Probabilidad: Baja / Media / Alta',
          '- Impacto: Leve / Moderado / Grave',
          '',
          '**Actividades identificadas:**',
          '',
          '1. [Actividad]: _________________________________',
          '   Riesgo: _________ | Controles: _________________________________',
          '',
          '2. [Actividad]: _________________________________',
          '   Riesgo: _________ | Controles: _________________________________',
          '',
          '3. [Actividad]: _________________________________',
          '   Riesgo: _________ | Controles: _________________________________',
          '',
          '**Mejoras propuestas:**',
          '',
          '- _________________________________',
          '- _________________________________',
          '- _________________________________'
        ]
      },
      {
        titulo: '6. Medidas Preventivas',
        contenido: [
          '**Diseño seguro de espacios:**',
          '- Visibilidad adecuada en todas las áreas.',
          '- Iluminación suficiente.',
          '- Separación por grupos de edad cuando proceda.',
          '',
          '**Ratios adecuadas:**',
          '- Menores de 3 años: 1 adulto / 4-6 menores',
          '- 3-6 años: 1 adulto / 8-10 menores',
          '- 6-12 años: 1 adulto / 10-15 menores',
          '- Mayores de 12 años: 1 adulto / 15-20 menores',
          '',
          '**Reglas de comunicación digital:**',
          '- Prohibición de contactos privados no registrados.',
          '- Uso exclusivo de canales oficiales de la entidad.',
          '- Consentimiento informado para el uso de imágenes.',
          '',
          '**Selección segura de personal:**',
          '- Certificado negativo de delitos de naturaleza sexual.',
          '- Referencias profesionales verificadas.',
          '- Formación LOPIVI antes de la incorporación.'
        ]
      },
      {
        titulo: '7. Protocolos de Actuación',
        contenido: [
          '**Detección y notificación:**',
          '',
          '1. Cualquier persona que detecte una situación de riesgo debe comunicarlo inmediatamente al Responsable de Protección.',
          '2. Registro documental con fecha, hora y descripción objetiva.',
          '3. Preservación de evidencias.',
          '',
          '**Actuación urgente ante riesgo inminente:**',
          '',
          '1. Garantizar la seguridad del menor.',
          '2. Contactar con servicios de emergencia (112) si procede.',
          '3. Avisar al Responsable de Protección.',
          '4. Documentar todas las acciones.',
          '',
          '**Derivación a servicios competentes:**',
          '',
          '- Servicios Sociales del municipio.',
          '- Fuerzas y Cuerpos de Seguridad del Estado.',
          '- Fiscalía de Menores.',
          '- Servicios sanitarios.'
        ]
      },
      {
        titulo: '8. Protocolos de Emergencia',
        contenido: [
          '**Plan de evacuación:**',
          '- Rutas de evacuación señalizadas.',
          '- Puntos de encuentro definidos.',
          '- Simulacros trimestrales.',
          '',
          '**Primeros auxilios:**',
          '- Personal formado disponible.',
          '- Botiquín accesible y revisado.',
          '',
          '**Contacto con autoridades:**',
          '',
          '- Emergencias: 112',
          '- Policía Nacional: 091',
          '- Guardia Civil: 062',
          '- Teléfono del Menor: 116111',
          '- Servicios Sociales: [Teléfono local] _________________________________'
        ]
      },
      {
        titulo: '9. Formación y Sensibilización',
        contenido: [
          '**Plan anual de formación:**',
          '',
          '- Formación inicial obligatoria para todo el personal (mínimo 8 horas).',
          '- Formación continua anual (mínimo 4 horas).',
          '- Talleres de sensibilización para familias.',
          '- Sesiones adaptadas para menores según edad.',
          '',
          '**Contenidos de formación:**',
          '',
          '- Marco legal LOPIVI.',
          '- Detección de señales de riesgo.',
          '- Protocolos internos de actuación.',
          '- Código de conducta.',
          '- Comunicación efectiva con menores.',
          '',
          '**Registro y evaluación:**',
          '',
          'Custodia360 mantiene registro digital de:',
          '- Asistencia a formaciones.',
          '- Certificados emitidos.',
          '- Evaluaciones de conocimientos adquiridos.'
        ]
      },
      {
        titulo: '10. Supervisión y Mejora',
        contenido: [
          '**Auditorías anuales:**',
          '',
          'Se realizará una auditoría completa del sistema de protección al menos una vez al año, evaluando:',
          '- Cumplimiento de protocolos.',
          '- Eficacia de las medidas preventivas.',
          '- Formación del personal.',
          '- Satisfacción de familias y menores.',
          '',
          '**Actualización de protocolos:**',
          '',
          'Los protocolos serán revisados:',
          '- Anualmente de forma ordinaria.',
          '- Tras cualquier incidente relevante.',
          '- Cuando se produzcan cambios normativos.',
          '',
          '**Informe de seguimiento Custodia360:**',
          '',
          'La plataforma Custodia360 genera automáticamente:',
          '- Informes trimestrales de cumplimiento.',
          '- Alertas ante incumplimientos detectados.',
          '- Recomendaciones de mejora personalizadas.',
          '- Dashboard en tiempo real del estado del Plan.'
        ]
      }
    ]
  },
  {
    filename: 'Manual_Procedimientos_Proteccion',
    titulo: 'Manual de Procedimientos de Protección Infantil',
    subtitulo: 'Guía operativa para la implementación práctica',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Objetivo del Manual',
        contenido: [
          'Este manual establece una guía operativa detallada para aplicar el Plan de Protección en entornos educativos, deportivos y sociales.',
          '',
          'Su finalidad es proporcionar a todo el personal herramientas prácticas para:',
          '- Prevenir situaciones de riesgo.',
          '- Detectar señales de alerta temprana.',
          '- Actuar de forma eficaz ante sospechas o evidencias.',
          '- Mantener una cultura organizativa de protección.',
          '- Garantizar el cumplimiento normativo continuo.'
        ]
      },
      {
        titulo: '2. Estructura del Manual',
        contenido: [
          'El manual se organiza en siete áreas clave:',
          '',
          '1. **Prevención y cultura organizativa**: Crear entornos seguros desde el diseño.',
          '2. **Identificación de riesgos**: Análisis sistemático de vulnerabilidades.',
          '3. **Procedimientos de actuación**: Protocolos paso a paso.',
          '4. **Formación del personal**: Capacitación continua.',
          '5. **Participación infantil y familias**: Involucración activa.',
          '6. **Gestión documental**: Registro y trazabilidad.',
          '7. **Auditoría y mejora**: Evaluación y actualización.'
        ]
      },
      {
        titulo: '3. Procedimientos Tipo',
        contenido: [
          '**Procedimiento 1: Detección Temprana**',
          '',
          'Objetivo: Identificar señales de riesgo antes de que se produzcan daños graves.',
          '',
          'Pasos:',
          '1. Observación sistemática del comportamiento de los menores.',
          '2. Registro de cambios significativos (conductuales, emocionales, físicos).',
          '3. Comunicación entre el equipo sobre observaciones relevantes.',
          '4. Evaluación conjunta de la situación.',
          '5. Decisión sobre activación de protocolos.',
          '',
          'Indicadores de alerta:',
          '- Cambios bruscos de comportamiento.',
          '- Aislamiento social repentino.',
          '- Señales físicas inexplicables.',
          '- Conocimientos o conductas sexuales inadecuados para la edad.',
          '- Miedo o rechazo a personas específicas.',
          '- Absentismo injustificado.',
          '',
          '---',
          '',
          '**Procedimiento 2: Notificación Interna**',
          '',
          'Objetivo: Asegurar que toda sospecha llegue al Responsable de Protección.',
          '',
          'Pasos:',
          '1. Completar formulario de notificación interna (disponible en Custodia360).',
          '2. Enviar al Responsable de Protección de forma confidencial.',
          '3. El Responsable acusa recibo en máximo 24 horas.',
          '4. Evaluación preliminar en 48 horas.',
          '5. Decisión sobre derivación externa o seguimiento interno.',
          '',
          'Información a incluir:',
          '- Datos del menor (sin exceso de detalle inicial).',
          '- Descripción objetiva de los hechos observados.',
          '- Fecha, hora y lugar.',
          '- Testigos presentes.',
          '- Acciones inmediatas tomadas.',
          '',
          '---',
          '',
          '**Procedimiento 3: Derivación Externa**',
          '',
          'Objetivo: Trasladar el caso a las autoridades competentes cuando proceda.',
          '',
          'Criterios de derivación:',
          '- Riesgo grave o inminente para el menor.',
          '- Sospecha fundada de delito.',
          '- Necesidad de intervención especializada.',
          '',
          'Pasos:',
          '1. El Responsable de Protección evalúa la necesidad de derivación.',
          '2. Contacto con Servicios Sociales, Fiscalía o Policía según el caso.',
          '3. Comunicación a la familia (salvo que esté implicada).',
          '4. Documentación completa del caso.',
          '5. Seguimiento de las indicaciones de las autoridades.',
          '6. Registro en Custodia360.',
          '',
          'Plazos:',
          '- Riesgo inminente: Inmediato (llamada al 112).',
          '- Riesgo grave: Máximo 24 horas.',
          '- Otros casos: Máximo 72 horas.',
          '',
          '---',
          '',
          '**Procedimiento 4: Comunicación a Familias**',
          '',
          'Objetivo: Informar a las familias de forma clara, sensible y confidencial.',
          '',
          'Pasos:',
          '1. Preparar la información (hechos objetivos, evitar juicios).',
          '2. Convocar reunión presencial siempre que sea posible.',
          '3. Explicar la situación, acciones tomadas y próximos pasos.',
          '4. Escuchar activamente las preocupaciones de la familia.',
          '5. Acordar colaboración y seguimiento.',
          '6. Documentar la reunión.',
          '',
          'Excepciones:',
          '- No comunicar si la familia está implicada en el riesgo.',
          '- Coordinarse con Servicios Sociales antes de comunicar en casos graves.',
          '',
          '---',
          '',
          '**Procedimiento 5: Seguimiento y Cierre de Caso**',
          '',
          'Objetivo: Asegurar el bienestar del menor tras la intervención.',
          '',
          'Pasos:',
          '1. Establecer plan de seguimiento personalizado.',
          '2. Reuniones periódicas con el menor, familia y profesionales implicados.',
          '3. Evaluación continua de la evolución.',
          '4. Coordinación con servicios externos si procede.',
          '5. Cierre del caso cuando se verifique la resolución satisfactoria.',
          '6. Registro completo en Custodia360.',
          '',
          'Duración del seguimiento:',
          '- Mínimo 3 meses tras la intervención.',
          '- Extensible según evolución del caso.'
        ]
      },
      {
        titulo: '4. Roles y Responsabilidades',
        contenido: [
          '**Dirección General:**',
          '- Liderar el compromiso institucional con la protección infantil.',
          '- Asignar recursos necesarios para el Plan de Protección.',
          '- Supervisar el cumplimiento del marco normativo.',
          '- Rendir cuentas ante las autoridades y familias.',
          '',
          '**Responsable de Protección:**',
          '- Coordinar la implementación del Plan de Protección.',
          '- Recibir y gestionar notificaciones internas.',
          '- Evaluar riesgos y decidir derivaciones.',
          '- Coordinar con autoridades externas.',
          '- Promover la formación y sensibilización.',
          '- Mantener actualizado el sistema en Custodia360.',
          '',
          '**Personal y Voluntariado:**',
          '- Conocer y aplicar el Código de Conducta.',
          '- Detectar y notificar situaciones de riesgo.',
          '- Participar en las formaciones obligatorias.',
          '- Colaborar en la implementación de medidas preventivas.',
          '- Mantener la confidencialidad.',
          '',
          '**Familias:**',
          '- Conocer las políticas de protección de la entidad.',
          '- Colaborar activamente con los profesionales.',
          '- Comunicar preocupaciones o sospechas.',
          '- Participar en actividades de sensibilización.',
          '',
          '**Menores:**',
          '- Conocer sus derechos.',
          '- Participar en espacios seguros de expresión.',
          '- Comunicar situaciones que les hagan sentir incómodos.',
          '- Colaborar en la mejora del entorno de protección.'
        ]
      },
      {
        titulo: '5. Indicadores de Eficacia',
        contenido: [
          'La efectividad del sistema de protección se mide mediante:',
          '',
          '**Indicadores de proceso:**',
          '- % de personal formado en LOPIVI: Objetivo 100%',
          '- % de personal con certificado de antecedentes vigente: Objetivo 100%',
          '- Nº de reuniones del Comité de Protección: Mínimo trimestral',
          '- Nº de simulacros de emergencia realizados: Mínimo 2 al año',
          '',
          '**Indicadores de resultado:**',
          '- Tiempo medio de respuesta ante notificaciones: Objetivo < 24h',
          '- % de casos derivados correctamente: Objetivo 100%',
          '- % de familias satisfechas con la gestión: Objetivo > 90%',
          '- Nº de incidentes graves: Objetivo 0',
          '',
          '**Indicadores de impacto:**',
          '- Percepción de seguridad de los menores: Medición anual',
          '- Cultura de protección en la organización: Evaluación externa',
          '- Reconocimiento externo de buenas prácticas',
          '',
          'Custodia360 genera dashboards automáticos con estos indicadores en tiempo real.'
        ]
      },
      {
        titulo: '6. Mejora Continua',
        contenido: [
          'El sistema de protección se mejora continuamente mediante:',
          '',
          '**Fuentes de mejora:**',
          '- Análisis de incidentes y casos gestionados.',
          '- Feedback de personal, familias y menores.',
          '- Auditorías internas y externas.',
          '- Cambios normativos y nuevas evidencias científicas.',
          '- Buenas prácticas de otras organizaciones.',
          '',
          '**Ciclo de mejora:**',
          '',
          '1. **Planificar**: Identificar áreas de mejora y definir objetivos.',
          '2. **Hacer**: Implementar cambios y nuevas medidas.',
          '3. **Verificar**: Medir resultados y eficacia.',
          '4. **Actuar**: Ajustar y estandarizar mejoras.',
          '',
          '**Actualización de procedimientos:**',
          '',
          'Los procedimientos serán revisados:',
          '- Anualmente de forma sistemática.',
          '- Tras cualquier incidente relevante.',
          '- Cuando Custodia360 detecte desviaciones.',
          '- Cuando se produzcan cambios normativos.',
          '',
          '**Evidencia de mejora:**',
          '',
          'Custodia360 mantiene registro histórico de:',
          '- Versiones anteriores de protocolos.',
          '- Motivos de los cambios realizados.',
          '- Resultados de las mejoras implementadas.',
          '- Lecciones aprendidas de cada caso.'
        ]
      },
      {
        titulo: 'Conclusión',
        contenido: [
          'Este Manual de Procedimientos es un documento vivo que debe adaptarse a la realidad cambiante de cada entidad.',
          '',
          'La protección infantil no es un objetivo final, sino un proceso continuo de vigilancia, prevención y mejora.',
          '',
          'Custodia360 proporciona el soporte tecnológico y metodológico para mantener este sistema siempre actualizado, eficaz y conforme a la normativa vigente.',
          '',
          '---',
          '',
          'Para más información:',
          'www.custodia360.es',
          'info@custodia360.es',
          'Tel: 678 771 198'
        ]
      }
    ]
  }
]

export async function POST() {
  try {
    console.log('📗 Generando Bloque 02: Planes y Guías (PDF + DOCX)...')

    const documentos = []

    // Generar cada uno de los 2 documentos NUEVOS
    for (let i = 0; i < documentosConfig.length; i++) {
      const config = documentosConfig[i]
      console.log(`${i + 1}/2 Generando: ${config.titulo}...`)

      const docConfig = {
        titulo: config.titulo,
        subtitulo: config.subtitulo,
        version: config.version,
        fecha: fechaActual,
        secciones: config.secciones
      }

      // ========================================
      // GENERAR PDF
      // ========================================
      console.log(`  → PDF...`)
      const pdfBuffer = generarPDFProfesional(docConfig)

      const pdfPath = `plantillas/02_Planes_y_Guias/${config.filename}.pdf`
      const { error: pdfError } = await supabase.storage
        .from('docs')
        .upload(pdfPath, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true
        })

      if (pdfError) throw new Error(`Error subiendo PDF ${config.filename}: ${pdfError.message}`)

      const { data: { publicUrl: pdfUrl } } = supabase.storage
        .from('docs')
        .getPublicUrl(pdfPath)

      // ========================================
      // GENERAR DOCX
      // ========================================
      console.log(`  → DOCX...`)
      const docxDoc = generarDOCXProfesional(docConfig)
      const docxBuffer = await Packer.toBuffer(docxDoc)

      const docxPath = `plantillas/02_Planes_y_Guias/${config.filename}.docx`
      const { error: docxError } = await supabase.storage
        .from('docs')
        .upload(docxPath, docxBuffer, {
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          upsert: true
        })

      if (docxError) throw new Error(`Error subiendo DOCX ${config.filename}: ${docxError.message}`)

      const { data: { publicUrl: docxUrl } } = supabase.storage
        .from('docs')
        .getPublicUrl(docxPath)

      documentos.push({
        nombre: config.titulo,
        pdf: pdfUrl,
        docx: docxUrl
      })

      console.log(`  ✅ ${config.filename} completado`)
    }

    console.log('✅ Todos los documentos del Bloque 02 generados')

    // Enviar email de confirmación
    console.log('📧 Enviando email de confirmación...')

    const emailHtml = `
      <h2>Bloque 02_Planes_y_Guías creado correctamente</h2>
      <p>Se han generado y publicado correctamente los siguientes documentos nuevos en el panel de administración Custodia360:</p>
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Documento</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">PDF</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">DOCX</th>
          </tr>
        </thead>
        <tbody>
          ${documentos.map(doc => `
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>${doc.nombre}</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><a href="${doc.pdf}">Descargar PDF</a></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><a href="${doc.docx}">Descargar DOCX</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p><strong>Nota:</strong> Las guías LOPIVI Completa y Guía Plan de Protección ya existen en el sistema y están vinculadas desde este bloque.</p>
      <p><strong>Carpeta:</strong> <code>/docs/plantillas/02_Planes_y_Guias/</code></p>
      <p><strong>Panel admin:</strong> <code>/dashboard-custodia360/plantillas</code></p>
      <p><small>Generado el ${fechaActual}</small></p>
    `

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Custodia360 <noreply@custodia360.es>',
        to: ['info@custodia360.es'],
        subject: 'Bloque 02_Planes_y_Guías Custodia360 creado correctamente',
        html: emailHtml
      })
    })

    if (resendResponse.ok) {
      console.log('✅ Email enviado')
    }

    return NextResponse.json({
      success: true,
      total: documentos.length,
      documentos,
      nota: 'Guías LOPIVI y Plan de Protección ya existentes - vinculadas desde este bloque'
    })

  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
