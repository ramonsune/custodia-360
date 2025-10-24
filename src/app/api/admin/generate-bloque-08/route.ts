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

const fechaVencimiento = new Date()
fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 12)
const fechaVencimientoStr = fechaVencimiento.toLocaleDateString('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

// Configuraciones de los 4 documentos del Bloque 08
const documentosConfig = [
  {
    filename: 'Checklist_Cumplimiento_LOPIVI',
    titulo: 'Checklist de Cumplimiento LOPIVI (Autoauditoría)',
    subtitulo: 'Verificación anual del grado de cumplimiento normativo',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Objetivo',
        contenido: [
          'Verificar anualmente el grado de cumplimiento de la entidad respecto a la Ley Orgánica 8/2021 (LOPIVI) y las políticas implementadas mediante Custodia360, a través de una revisión estructurada y objetiva.',
          '',
          'Este checklist permite:',
          '- Identificar el nivel de conformidad con los requisitos legales.',
          '- Detectar áreas de mejora y riesgos potenciales.',
          '- Documentar evidencias de cumplimiento.',
          '- Planificar acciones correctivas y preventivas.',
          '- Preparar auditorías externas o inspecciones.'
        ]
      },
      {
        titulo: '2. Instrucciones de Uso',
        contenido: [
          'Para cada requisito indicado, marque con una "X" en la columna correspondiente:',
          '',
          '**SÍ:** El requisito se cumple completamente y existen evidencias documentales.',
          '**NO:** El requisito no se cumple en absoluto.',
          '**PARCIAL:** El requisito se cumple de forma incompleta o requiere mejoras.',
          '**N/A:** No aplicable a la entidad por sus características específicas.',
          '',
          'En la columna "Evidencia / Observaciones", indique:',
          '- Referencias a documentos que acreditan el cumplimiento.',
          '- Observaciones relevantes sobre el estado actual.',
          '- Acciones de mejora necesarias si procede.',
          '',
          '**Frecuencia recomendada:** Anual (mínimo) o tras cambios significativos en la entidad.'
        ]
      },
      {
        titulo: '3. Checklist de Cumplimiento',
        contenido: [
          '**BLOQUE 1: DOCUMENTACIÓN BÁSICA**',
          '',
          '| Nº | Requisito | SÍ | NO | PARCIAL | N/A | Evidencia / Observaciones |',
          '|----|-----------|----|----|---------|-----|---------------------------|',
          '| 1.1 | Política de Protección de la Infancia aprobada y vigente | | | | | |',
          '| 1.2 | Código de Conducta del personal aprobado | | | | | |',
          '| 1.3 | Plan de Protección Infantil documentado | | | | | |',
          '| 1.4 | Protocolos de Actuación ante situaciones de riesgo | | | | | |',
          '| 1.5 | Documentación actualizada en el último año | | | | | |',
          '',
          '**BLOQUE 2: RESPONSABLE DE PROTECCIÓN**',
          '',
          '| Nº | Requisito | SÍ | NO | PARCIAL | N/A | Evidencia / Observaciones |',
          '|----|-----------|----|----|---------|-----|---------------------------|',
          '| 2.1 | Responsable de Protección designado formalmente | | | | | |',
          '| 2.2 | Responsable con formación específica acreditada | | | | | |',
          '| 2.3 | Funciones del Responsable claramente definidas | | | | | |',
          '| 2.4 | Responsable accesible y conocido por el personal | | | | | |',
          '',
          '**BLOQUE 3: FORMACIÓN DEL PERSONAL**',
          '',
          '| Nº | Requisito | SÍ | NO | PARCIAL | N/A | Evidencia / Observaciones |',
          '|----|-----------|----|----|---------|-----|---------------------------|',
          '| 3.1 | 100% del personal ha recibido formación inicial LOPIVI | | | | | |',
          '| 3.2 | Formación continua anual implementada | | | | | |',
          '| 3.3 | Certificados de formación conservados y registrados | | | | | |',
          '| 3.4 | Plan de formación documentado y actualizado | | | | | |',
          '| 3.5 | Evaluación de conocimientos tras formación | | | | | |',
          '',
          '**BLOQUE 4: CANAL SEGURO DE COMUNICACIÓN**',
          '',
          '| Nº | Requisito | SÍ | NO | PARCIAL | N/A | Evidencia / Observaciones |',
          '|----|-----------|----|----|---------|-----|---------------------------|',
          '| 4.1 | Canal seguro de comunicación activo (Buzón LOPIVI) | | | | | |',
          '| 4.2 | Canal accesible para menores, familias y personal | | | | | |',
          '| 4.3 | Garantías de confidencialidad y protección del denunciante | | | | | |',
          '| 4.4 | Difusión del canal mediante carteles, QR y web | | | | | |',
          '| 4.5 | Registro y seguimiento de comunicaciones recibidas | | | | | |',
          '',
          '**BLOQUE 5: EVALUACIÓN DE RIESGOS**',
          '',
          '| Nº | Requisito | SÍ | NO | PARCIAL | N/A | Evidencia / Observaciones |',
          '|----|-----------|----|----|---------|-----|---------------------------|',
          '| 5.1 | Evaluación de riesgos realizada y documentada | | | | | |',
          '| 5.2 | Análisis de espacios, actividades y personal | | | | | |',
          '| 5.3 | Medidas preventivas implementadas | | | | | |',
          '| 5.4 | Revisión anual de la evaluación de riesgos | | | | | |',
          '',
          '**BLOQUE 6: SELECCIÓN DE PERSONAL**',
          '',
          '| Nº | Requisito | SÍ | NO | PARCIAL | N/A | Evidencia / Observaciones |',
          '|----|-----------|----|----|---------|-----|---------------------------|',
          '| 6.1 | Certificado negativo de delitos sexuales para todo el personal | | | | | |',
          '| 6.2 | Verificación de referencias profesionales | | | | | |',
          '| 6.3 | Periodo de prueba supervisado | | | | | |',
          '| 6.4 | Entrevistas específicas sobre protección infantil | | | | | |',
          '',
          '**BLOQUE 7: GESTIÓN DE INCIDENTES**',
          '',
          '| Nº | Requisito | SÍ | NO | PARCIAL | N/A | Evidencia / Observaciones |',
          '|----|-----------|----|----|---------|-----|---------------------------|',
          '| 7.1 | Registro completo de incidentes y sospechas | | | | | |',
          '| 7.2 | Actuaciones documentadas conforme a protocolos | | | | | |',
          '| 7.3 | Coordinación con autoridades competentes | | | | | |',
          '| 7.4 | Seguimiento y cierre documentado de casos | | | | | |',
          '',
          '**BLOQUE 8: PARTICIPACIÓN INFANTIL**',
          '',
          '| Nº | Requisito | SÍ | NO | PARCIAL | N/A | Evidencia / Observaciones |',
          '|----|-----------|----|----|---------|-----|---------------------------|',
          '| 8.1 | Espacios para que menores expresen opiniones | | | | | |',
          '| 8.2 | Mecanismos de participación adaptados por edad | | | | | |',
          '| 8.3 | Feedback proporcionado a menores sobre sus aportaciones | | | | | |',
          '',
          '**BLOQUE 9: COMUNICACIÓN Y DIFUSIÓN**',
          '',
          '| Nº | Requisito | SÍ | NO | PARCIAL | N/A | Evidencia / Observaciones |',
          '|----|-----------|----|----|---------|-----|---------------------------|',
          '| 9.1 | Política de Protección publicada y accesible | | | | | |',
          '| 9.2 | Familias informadas sobre medidas de protección | | | | | |',
          '| 9.3 | Comunicación clara de normas y códigos | | | | | |',
          '',
          '**BLOQUE 10: REVISIÓN Y MEJORA CONTINUA**',
          '',
          '| Nº | Requisito | SÍ | NO | PARCIAL | N/A | Evidencia / Observaciones |',
          '|----|-----------|----|----|---------|-----|---------------------------|',
          '| 10.1 | Revisión anual del Plan de Protección | | | | | |',
          '| 10.2 | Auditorías internas periódicas | | | | | |',
          '| 10.3 | Plan de mejora documentado y ejecutado | | | | | |',
          '| 10.4 | Actualización ante cambios normativos | | | | | |'
        ]
      },
      {
        titulo: '4. Resumen y Conclusiones',
        contenido: [
          '**Resumen de resultados:**',
          '',
          'Total de requisitos evaluados: _______',
          'Requisitos conformes (SÍ): _______',
          'Requisitos no conformes (NO): _______',
          'Requisitos parcialmente conformes (PARCIAL): _______',
          'Requisitos no aplicables (N/A): _______',
          '',
          '**Nivel global de cumplimiento:**',
          '',
          'Porcentaje de conformidad = (SÍ + PARCIAL × 0.5) / (Total - N/A) × 100',
          '',
          'Resultado: _________ %',
          '',
          '**Clasificación:**',
          '- 90-100%: Excelente cumplimiento',
          '- 75-89%: Cumplimiento adecuado con mejoras menores',
          '- 60-74%: Cumplimiento suficiente con áreas de mejora significativas',
          '- <60%: Cumplimiento insuficiente - Acción inmediata requerida',
          '',
          '**Áreas de mejora identificadas:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Acciones inmediatas propuestas:**',
          '',
          '1. _______________________________________________________________________',
          '2. _______________________________________________________________________',
          '3. _______________________________________________________________________',
          '',
          '**Responsable de la revisión:**',
          '',
          'Nombre: ____________________________________________________________________',
          '',
          'Cargo: _____________________________________________________________________',
          '',
          'Firma: ______________________________________  Fecha: _____________________',
          '',
          '**Validación del Responsable de Protección:**',
          '',
          'Nombre: ____________________________________________________________________',
          '',
          'Firma: ______________________________________  Fecha: _____________________'
        ]
      },
      {
        titulo: 'Conclusión',
        contenido: [
          'Este checklist de cumplimiento LOPIVI es una herramienta fundamental para la autoevaluación periódica de la entidad.',
          '',
          'Custodia360 recomienda realizar esta revisión al menos una vez al año y siempre que se produzcan cambios significativos en la organización.',
          '',
          'Los resultados deben integrarse en el Plan Anual de Mejora y servir de base para auditorías internas y externas.',
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
  },
  {
    filename: 'Informe_Auditoria_Interna',
    titulo: 'Informe de Auditoría Interna',
    subtitulo: 'Modelo de informe de verificación de cumplimiento LOPIVI',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Introducción',
        contenido: [
          'El presente informe documenta los resultados de la auditoría interna realizada para verificar el cumplimiento de la Ley Orgánica 8/2021 de Protección Integral a la Infancia y Adolescencia frente a la Violencia (LOPIVI) y del sistema de gestión Custodia360 implementado en la entidad.',
          '',
          '**Entidad auditada:**',
          '',
          'Nombre: ____________________________________________________________________',
          'CIF: _______________________________________________________________________',
          'Domicilio: __________________________________________________________________',
          'Sector: _____________________________________________________________________',
          'Número de menores atendidos: ________________________________________________',
          '',
          '**Equipo auditor:**',
          '',
          'Auditor líder: _______________________________________________________________',
          'Auditor/es adicional/es: _____________________________________________________',
          '',
          '**Fecha de auditoría:** _______________________________________________________',
          '',
          '**Periodo auditado:** De __________________ a __________________'
        ]
      },
      {
        titulo: '2. Alcance',
        contenido: [
          '**Ámbitos evaluados:**',
          '',
          '☑ Políticas de protección y códigos de conducta',
          '☑ Plan de Protección Infantil',
          '☑ Responsable de Protección',
          '☑ Formación del personal',
          '☑ Canales seguros de comunicación',
          '☑ Registros y documentación',
          '☑ Protocolos de actuación',
          '☑ Evaluación de riesgos',
          '☑ Participación infantil',
          '☑ Trazabilidad y mejora continua',
          '',
          '**Instalaciones / centros auditados:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Exclusiones del alcance (si las hubiera):**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________'
        ]
      },
      {
        titulo: '3. Metodología',
        contenido: [
          'La auditoría se ha llevado a cabo mediante las siguientes técnicas:',
          '',
          '**Revisión documental:**',
          '- Análisis de políticas, procedimientos, registros y evidencias documentales.',
          '- Verificación de versiones vigentes y actualizaciones.',
          '',
          '**Entrevistas:**',
          '- Personal directivo y responsable de protección.',
          '- Personal técnico y educativo.',
          '- Muestra representativa de empleados y voluntarios.',
          '',
          '**Muestreo aleatorio:**',
          '- Registros de formación (certificados, asistencias).',
          '- Fichas de personal (certificados de delitos sexuales).',
          '- Registros de incidentes y comunicaciones.',
          '',
          '**Observación directa:**',
          '- Inspección de instalaciones y espacios.',
          '- Verificación de carteles informativos y accesibilidad del canal seguro.',
          '',
          '**Validación de evidencias:**',
          '- Comprobación de la veracidad y vigencia de documentos aportados.',
          '- Evaluación de conformidad frente a requisitos mínimos LOPIVI.'
        ]
      },
      {
        titulo: '4. Resultados por Área Auditada',
        contenido: [
          '**TABLA RESUMEN DE CONFORMIDAD:**',
          '',
          '| Área auditada | Conformidad | Evidencias revisadas | Observaciones / Hallazgos |',
          '|---------------|-------------|----------------------|---------------------------|',
          '| Política y Código de Conducta | ✅ CONFORME | Documentos firmados, versión v1.0 | Actualizada en 2024. Todo el personal firmó. |',
          '| Plan de Protección | ⚠️ NO CONFORME MENOR | Plan v2023 sin revisión anual | Falta actualización anual conforme art. 45 LOPIVI. |',
          '| Responsable de Protección | ✅ CONFORME | Nombramiento formal y certificado formación | Designado formalmente, accesible. |',
          '| Formación del personal | ⚠️ CONFORME CON OBSERVACIONES | Registros de 90% plantilla | 10% personal nuevo pendiente formación inicial. |',
          '| Canal seguro (Buzón LOPIVI) | ✅ CONFORME | QR operativo, carteles visibles | Accesible y funcional. Ninguna comunicación recibida. |',
          '| Certificados delitos sexuales | ✅ CONFORME | 100% personal con certificado vigente | Todos en regla. Renovados anualmente. |',
          '| Evaluación de riesgos | ✅ CONFORME | Matriz de riesgos actualizada | Evaluación completa y medidas preventivas implementadas. |',
          '| Protocolos de actuación | ✅ CONFORME | Protocolo detección, notificación, urgencias | Documentados y comunicados al personal. |',
          '| Registros de incidentes | ✅ CONFORME | Registro digital Custodia360 | Trazabilidad completa de 2 casos gestionados. |',
          '| Participación infantil | ⚠️ CONFORME CON OBSERVACIONES | Formularios participación 1 vez/año | Recomendable aumentar frecuencia a 2 veces/año. |',
          '',
          '**Leyenda:**',
          '- ✅ CONFORME: Cumple completamente con los requisitos.',
          '- ⚠️ CONFORME CON OBSERVACIONES: Cumple pero se detectan áreas de mejora.',
          '- ❌ NO CONFORME MENOR: Incumplimiento que no afecta críticamente.',
          '- 🚨 NO CONFORME MAYOR: Incumplimiento grave que requiere acción inmediata.'
        ]
      },
      {
        titulo: '5. Hallazgos y Recomendaciones',
        contenido: [
          '**HALLAZGO 1: Plan de Protección sin revisión anual**',
          '',
          'Tipo: ❌ No conformidad menor',
          '',
          'Descripción:',
          'El Plan de Protección Infantil vigente data de 2023 y no se ha revisado en el último año, incumpliendo el art. 45.3 de la LOPIVI que exige revisión anual.',
          '',
          'Evidencia:',
          'Documento "Plan de Protección v2023.pdf" sin versión actualizada.',
          '',
          'Impacto:',
          'Riesgo de obsolescencia del plan ante cambios normativos o en la entidad.',
          '',
          'Recomendación:',
          'Actualizar el Plan de Protección en un plazo máximo de 30 días, incorporando cambios organizativos y lecciones aprendidas del último año.',
          '',
          '---',
          '',
          '**HALLAZGO 2: Personal nuevo pendiente de formación inicial**',
          '',
          'Tipo: ⚠️ Observación para mejora',
          '',
          'Descripción:',
          'Se detectó que 3 personas incorporadas en el último trimestre no han completado la formación inicial LOPIVI.',
          '',
          'Evidencia:',
          'Registro de formación Custodia360: 27 de 30 personas formadas.',
          '',
          'Impacto:',
          'Personal trabajando con menores sin conocimiento de protocolos y obligaciones.',
          '',
          'Recomendación:',
          'Completar formación inicial en un plazo de 15 días. Establecer procedimiento para formación automática de nuevas incorporaciones.',
          '',
          '---',
          '',
          '**HALLAZGO 3: Frecuencia insuficiente de participación infantil**',
          '',
          'Tipo: ⚠️ Observación para mejora',
          '',
          'Descripción:',
          'Los formularios de participación infantil se aplican solo 1 vez al año, limitando la capacidad de los menores de expresar inquietudes oportunamente.',
          '',
          'Evidencia:',
          'Registros de participación: última aplicación hace 10 meses.',
          '',
          'Recomendación:',
          'Incrementar frecuencia a 2 veces por año (cada semestre) y tras cambios significativos en actividades.'
        ]
      },
      {
        titulo: '6. Fortalezas Identificadas',
        contenido: [
          '✅ **Compromiso de la dirección:**',
          'La dirección muestra un compromiso claro con la protección infantil, evidenciado en la designación formal del Responsable de Protección y la inversión en formación.',
          '',
          '✅ **Canal seguro bien implementado:**',
          'El buzón LOPIVI es accesible, visible (carteles y QR en todas las instalaciones) y funcional.',
          '',
          '✅ **Certificados de delitos sexuales al día:**',
          'El 100% del personal cuenta con certificado negativo vigente, con sistema de renovación automática mediante Custodia360.',
          '',
          '✅ **Evaluación de riesgos completa:**',
          'La matriz de riesgos está actualizada e incluye análisis de espacios físicos, actividades y perfiles de personal.',
          '',
          '✅ **Trazabilidad digital:**',
          'La plataforma Custodia360 garantiza trazabilidad completa de incidentes, formaciones y documentación.'
        ]
      },
      {
        titulo: '7. Conclusión',
        contenido: [
          '**Nivel de cumplimiento global: 85%**',
          '',
          'La entidad auditada cumple con la mayoría de los requisitos establecidos por la LOPIVI y mantiene un entorno adecuado de protección de la infancia.',
          '',
          'Se han detectado **2 no conformidades menores** y **1 observación para mejora** que no comprometen la seguridad actual de los menores, pero que deben ser atendidas en el corto plazo.',
          '',
          'Custodia360 recomienda:',
          '1. Ejecutar las acciones correctivas propuestas en un plazo máximo de 3 meses.',
          '2. Realizar seguimiento trimestral del Plan de Mejora derivado de esta auditoría.',
          '3. Mantener la próxima auditoría interna programada para dentro de 12 meses.',
          '',
          '**Auditoría realizada por:**',
          '',
          'Nombre del auditor: __________________________________________________________',
          '',
          'Firma: ______________________________________  Fecha: _____________________',
          '',
          '**Recibido por la entidad:**',
          '',
          'Nombre del representante: ____________________________________________________',
          '',
          'Cargo: _____________________________________________________________________',
          '',
          'Firma: ______________________________________  Fecha: _____________________'
        ]
      }
    ]
  },
  {
    filename: 'Plan_Anual_Mejora',
    titulo: 'Plan Anual de Mejora',
    subtitulo: 'Planificación de acciones de refuerzo y optimización',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Objetivo',
        contenido: [
          'Identificar y planificar acciones concretas para reforzar la protección de menores y el cumplimiento normativo, derivadas de auditorías internas, incidentes gestionados, sugerencias del personal y buenas prácticas identificadas.',
          '',
          'Este plan permite:',
          '- Sistematizar la mejora continua de las políticas de protección.',
          '- Priorizar acciones según impacto y viabilidad.',
          '- Asignar responsables y plazos claros.',
          '- Realizar seguimiento del progreso.',
          '- Documentar evidencias de cumplimiento.'
        ]
      },
      {
        titulo: '2. Fuentes de Identificación de Mejoras',
        contenido: [
          'Las acciones de mejora incluidas en este plan proceden de:',
          '',
          '✓ Hallazgos de auditorías internas y externas.',
          '✓ Análisis de incidentes y casos gestionados.',
          '✓ Evaluación de riesgos actualizada.',
          '✓ Feedback de menores (participación infantil).',
          '✓ Sugerencias del personal y voluntariado.',
          '✓ Cambios normativos y buenas prácticas del sector.',
          '✓ Autoevaluación mediante checklist LOPIVI.'
        ]
      },
      {
        titulo: '3. Estructura del Plan',
        contenido: [
          '**TABLA DE ACCIONES DE MEJORA:**',
          '',
          '| Nº | Área | Acción propuesta | Responsable | Plazo | Prioridad | Estado | Evidencias |',
          '|----|------|------------------|-------------|--------|-----------|---------|------------|',
          '| 1 | Formación | Reforzar módulo sobre acoso digital y ciberseguridad | RRHH / Custodia360 | Q2 2024 | Alta | En curso | Nuevo temario y registros asistencia |',
          '| 2 | Canal seguro | Mejorar accesibilidad móvil del buzón LOPIVI | TIC / Comunicación | Q1 2024 | Media | Pendiente | Capturas QR y pruebas móvil |',
          '| 3 | Documentación | Actualizar Plan de Protección Infantil | Dirección / Responsable Protección | Q3 2024 | Alta | Pendiente | Nueva versión firmada |',
          '| 4 | Evaluación | Realizar simulacro anual de protocolo urgente | Responsable Protección | Q4 2024 | Media | Programado | Acta de simulacro |',
          '| 5 | Participación | Aumentar frecuencia encuestas participación infantil | Coordinación educativa | Q2 2024 | Media | Pendiente | Formularios trimestrales |',
          '| 6 | Instalaciones | Mejorar iluminación en zona de vestuarios | Mantenimiento | Q1 2024 | Alta | Completado | Fotos antes/después |',
          '| 7 | Personal | Reforzar supervisión periodo prueba nuevas incorporaciones | RRHH | Q1 2024 | Media | En curso | Protocolo supervisión actualizado |',
          '| 8 | Comunicación | Difundir infografías LOPIVI en espacios comunes | Comunicación | Q2 2024 | Baja | Pendiente | Pósteres impresos |',
          '',
          '**Leyenda de prioridades:**',
          '- **Alta:** Acción urgente por riesgo o incumplimiento normativo.',
          '- **Media:** Acción importante para mejora de procesos.',
          '- **Baja:** Acción deseable para optimización.'
        ]
      },
      {
        titulo: '4. Descripción Detallada de Acciones',
        contenido: [
          '**ACCIÓN 1: Reforzar módulo de formación sobre acoso digital**',
          '',
          'Origen: Auditoría interna - Detección de carencia formativa.',
          '',
          'Justificación:',
          'El uso de dispositivos digitales por menores es cada vez más intensivo. Es necesario reforzar la formación del personal en detección de ciberacoso, grooming, sexting y uso seguro de redes sociales.',
          '',
          'Descripción:',
          '- Incorporar módulo de 2 horas sobre prevención digital.',
          '- Incluir casos prácticos y simulaciones.',
          '- Formar al 100% del personal antes de junio 2024.',
          '',
          'Responsable: Departamento RRHH en colaboración con Custodia360.',
          '',
          'Plazo: Q2 2024 (30 de junio de 2024)',
          '',
          'Indicador de éxito: 100% personal formado con evaluación aprobada.',
          '',
          'Evidencias: Nuevos temarios, certificados digitales, evaluaciones.',
          '',
          '---',
          '',
          '**ACCIÓN 2: Mejorar accesibilidad móvil del canal seguro**',
          '',
          'Origen: Sugerencia de menores en encuesta participación.',
          '',
          'Justificación:',
          'Los menores acceden principalmente a través de móviles. El formulario actual no está optimizado para dispositivos móviles, dificultando su uso.',
          '',
          'Descripción:',
          '- Rediseñar formulario con diseño responsive.',
          '- Simplificar campos para facilitar la cumplimentación.',
          '- Realizar pruebas de usabilidad con menores.',
          '',
          'Responsable: Departamento TIC / Comunicación.',
          '',
          'Plazo: Q1 2024 (31 de marzo de 2024)',
          '',
          'Indicador de éxito: 90% de satisfacción en pruebas de usabilidad.',
          '',
          'Evidencias: Capturas del nuevo diseño, informe de pruebas.',
          '',
          '---',
          '',
          '**ACCIÓN 3: Actualizar Plan de Protección Infantil**',
          '',
          'Origen: No conformidad detectada en auditoría interna.',
          '',
          'Justificación:',
          'El Plan de Protección debe revisarse anualmente conforme al art. 45.3 LOPIVI. La versión actual data de 2023.',
          '',
          'Descripción:',
          '- Revisar y actualizar todas las secciones del Plan.',
          '- Incorporar lecciones aprendidas de casos gestionados.',
          '- Incluir cambios organizativos y nuevas actividades.',
          '- Aprobar formalmente por la dirección.',
          '',
          'Responsable: Dirección / Responsable de Protección.',
          '',
          'Plazo: Q3 2024 (30 de septiembre de 2024)',
          '',
          'Indicador de éxito: Nueva versión aprobada y difundida.',
          '',
          'Evidencias: Plan v2024 firmado, acta aprobación, comunicación al personal.'
        ]
      },
      {
        titulo: '5. Seguimiento y Control',
        contenido: [
          '**Frecuencia de revisión:**',
          '',
          'El Responsable de Protección actualizará trimestralmente el estado de las acciones del Plan de Mejora en reuniones con la dirección.',
          '',
          '**Indicadores de seguimiento:**',
          '',
          '- % de acciones completadas dentro de plazo.',
          '- % de acciones de prioridad alta resueltas.',
          '- Tiempo medio de resolución de acciones.',
          '- Nivel de satisfacción con las mejoras implementadas.',
          '',
          '**Reuniones de seguimiento:**',
          '',
          '- Trimestral: Revisión general del plan.',
          '- Mensual: Seguimiento de acciones prioritarias.',
          '- Anual: Evaluación completa y cierre del plan.',
          '',
          '**Herramientas de soporte:**',
          '',
          'Custodia360 ofrece:',
          '- Dashboard de seguimiento de acciones.',
          '- Alertas automáticas de vencimientos.',
          '- Generación automática de informes de progreso.',
          '- Trazabilidad completa de evidencias.'
        ]
      },
      {
        titulo: '6. Cierre y Evaluación del Plan',
        contenido: [
          'Al finalizar el año o periodo establecido, se realizará una evaluación completa del Plan de Mejora.',
          '',
          '**Aspectos a evaluar:**',
          '',
          '- Porcentaje de cumplimiento de acciones planificadas.',
          '- Impacto de las mejoras implementadas.',
          '- Dificultades encontradas y lecciones aprendidas.',
          '- Nuevas necesidades de mejora detectadas.',
          '',
          '**Informe de cierre:**',
          '',
          'Se elaborará un informe final que incluirá:',
          '- Resumen ejecutivo de resultados.',
          '- Tabla de acciones completadas vs. pendientes.',
          '- Evidencias recopiladas.',
          '- Propuestas para el siguiente Plan de Mejora.',
          '',
          '**Comunicación de resultados:**',
          '',
          '- Presentación a dirección.',
          '- Difusión al personal (resumen).',
          '- Actualización en plataforma Custodia360.',
          '',
          '**Validación:**',
          '',
          'Responsable de Protección: ___________________________________________________',
          '',
          'Firma: ______________________________________  Fecha: _____________________',
          '',
          'Director/a de la entidad: ____________________________________________________',
          '',
          'Firma: ______________________________________  Fecha: _____________________'
        ]
      }
    ]
  },
  {
    filename: 'Certificado_Cumplimiento_Custodia360',
    titulo: 'Certificado de Cumplimiento Custodia360',
    subtitulo: 'Acreditación de conformidad con la LOPIVI',
    version: '1.0',
    secciones: [
      {
        titulo: 'CERTIFICADO DE CUMPLIMIENTO',
        contenido: [
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          '',
          '                      CUSTODIA360',
          '        Sistema Automatizado de Cumplimiento LOPIVI',
          '',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          '',
          '',
          '                        CERTIFICA QUE:',
          '',
          '',
          'La entidad:',
          '',
          '**Nombre de la entidad:** ___________________________________________________',
          '',
          '**CIF/NIF:** ________________________________________________________________',
          '',
          '**Domicilio:** ______________________________________________________________',
          '',
          '**Sector de actividad:** _____________________________________________________',
          '',
          '',
          'Ha completado satisfactoriamente el proceso de revisión documental, formación y verificación de cumplimiento en materia de protección de la infancia y adolescencia conforme a la Ley Orgánica 8/2021 de Protección Integral a la Infancia y la Adolescencia frente a la Violencia (LOPIVI).',
          '',
          ''
        ]
      },
      {
        titulo: 'Ámbito de Certificación',
        contenido: [
          'Esta certificación acredita que la entidad ha implementado y mantiene operativas las siguientes medidas de protección:',
          '',
          '✓ **Política de Protección de la Infancia** aprobada y publicada.',
          '',
          '✓ **Código de Conducta** del personal aprobado y firmado por el 100% de la plantilla.',
          '',
          '✓ **Plan de Protección Infantil** documentado y actualizado.',
          '',
          '✓ **Responsable de Protección** designado formalmente y con formación acreditada.',
          '',
          '✓ **Canal seguro de comunicación** (Buzón LOPIVI) activo y accesible.',
          '',
          '✓ **Programa de formación** del personal en prevención y detección de violencia infantil.',
          '',
          '✓ **Registro completo de formación** con certificados digitales.',
          '',
          '✓ **Certificados negativos de delitos sexuales** para el 100% del personal.',
          '',
          '✓ **Evaluación de riesgos** actualizada con medidas preventivas implementadas.',
          '',
          '✓ **Protocolos de actuación** ante situaciones de riesgo documentados.',
          '',
          '✓ **Sistema de registro y trazabilidad** digital mediante plataforma Custodia360.',
          '',
          '✓ **Mecanismos de participación infantil** adaptados por edad.'
        ]
      },
      {
        titulo: 'Nivel de Cumplimiento Verificado',
        contenido: [
          '**Puntuación obtenida en verificación de cumplimiento:**',
          '',
          '                           _________ %',
          '',
          '',
          '**Clasificación:**',
          '',
          '☐ Excelente (90-100%): Cumplimiento óptimo en todas las áreas.',
          '☐ Notable (75-89%): Cumplimiento adecuado con mejoras menores.',
          '☐ Suficiente (60-74%): Cumplimiento básico con áreas de mejora.',
          '',
          '',
          '**Observaciones:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________'
        ]
      },
      {
        titulo: 'Datos de Emisión',
        contenido: [
          '**Emitido por:**',
          '',
          'Custodia360 S.L.',
          'CIF: B-XXXXXXXX',
          'Domicilio: Calle Ejemplo, 123 - 28000 Madrid',
          'Teléfono: 678 771 198',
          'Email: info@custodia360.es',
          'Web: www.custodia360.es',
          '',
          '',
          '**Fecha de emisión:** ' + fechaActual,
          '',
          '**Válido hasta:** ' + fechaVencimientoStr,
          '',
          '',
          '**Código de certificado:** CUST360-2024-XXXXX',
          '',
          '',
          '**Firmado electrónicamente por:**',
          '',
          '__________________________________________',
          'Director Técnico de Custodia360',
          '',
          '',
          '',
          '[Sello digital Custodia360]'
        ]
      },
      {
        titulo: 'Condiciones de Validez',
        contenido: [
          'Este certificado tiene una validez de **12 meses** desde la fecha de emisión.',
          '',
          'Para mantener la certificación vigente, la entidad debe:',
          '',
          '1. Mantener actualizada la documentación de protección infantil.',
          '2. Renovar anualmente la formación del personal.',
          '3. Actualizar certificados negativos de delitos sexuales del personal.',
          '4. Realizar auditorías internas anuales.',
          '5. Comunicar cambios significativos en la organización a Custodia360.',
          '',
          'La renovación de la certificación requiere:',
          '',
          '- Revisión completa de la documentación actualizada.',
          '- Verificación del cumplimiento de acciones de mejora previas.',
          '- Auditoría de seguimiento (si procede).',
          '',
          '**Importante:**',
          '',
          'Este certificado tiene validez informativa y de gestión interna. No sustituye la supervisión de las autoridades competentes en materia de protección de menores ni exime a la entidad de sus obligaciones legales derivadas de la LOPIVI.',
          '',
          'La posesión de este certificado no implica que Custodia360 asuma responsabilidad alguna por las actuaciones de la entidad certificada.'
        ]
      },
      {
        titulo: 'Información Adicional',
        contenido: [
          'Para verificar la autenticidad de este certificado, puede consultar el código de certificación en:',
          '',
          'www.custodia360.es/verificar-certificado',
          '',
          '',
          'Para cualquier consulta o solicitud de renovación:',
          '',
          '📧 Email: certificaciones@custodia360.es',
          '📞 Teléfono: 678 771 198',
          '🌐 Web: www.custodia360.es',
          '',
          '',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          '',
          '           Custodia360 - Protección Infantil Automatizada',
          '                 Cumplimiento LOPIVI en 72 horas',
          '',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        ]
      }
    ]
  }
]

export async function POST() {
  try {
    console.log('✅ Generando Bloque 08: Auditorías y Mejora (PDF + DOCX)...')

    const documentos = []

    // Generar cada uno de los 4 documentos
    for (let i = 0; i < documentosConfig.length; i++) {
      const config = documentosConfig[i]
      console.log(`${i + 1}/4 Generando: ${config.titulo}...`)

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

      const pdfPath = `plantillas/08_Auditorias_y_Mejora/${config.filename}.pdf`
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

      const docxPath = `plantillas/08_Auditorias_y_Mejora/${config.filename}.docx`
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

    console.log('✅ Todos los documentos del Bloque 08 generados')

    // Enviar email de confirmación
    console.log('📧 Enviando email de confirmación...')

    const emailHtml = `
      <h2>Bloque 08 — Auditorías y Mejora Custodia360 creado correctamente</h2>
      <p>Se han generado y publicado correctamente los siguientes documentos en el panel de administración Custodia360:</p>
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
      <p><strong>Carpeta:</strong> <code>/docs/plantillas/08_Auditorias_y_Mejora/</code></p>
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
        subject: 'Bloque 08 — Auditorías y Mejora Custodia360 creado correctamente',
        html: emailHtml
      })
    })

    if (resendResponse.ok) {
      console.log('✅ Email enviado')
    }

    return NextResponse.json({
      success: true,
      total: documentos.length,
      documentos
    })

  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
