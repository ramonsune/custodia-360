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

// Configuraciones de los 4 documentos del Bloque 03
const documentosConfig = [
  {
    filename: 'Metodologia_Evaluacion_Riesgos',
    titulo: 'Metodología de Evaluación de Riesgos (LOPIVI)',
    subtitulo: 'Procedimiento estándar Custodia360 conforme UNE-ISO 31000:2018',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Objetivo',
        contenido: [
          'Definir el procedimiento estándar de Custodia360 para la identificación, valoración y priorización de riesgos que afecten a menores, conforme a la LOPIVI y la norma UNE-ISO 31000:2018.',
          '',
          'Esta metodología proporciona un marco sistemático y replicable para que las entidades puedan:',
          '- Identificar de forma exhaustiva los riesgos potenciales.',
          '- Evaluarlos de manera objetiva y consistente.',
          '- Priorizar las acciones preventivas y correctivas.',
          '- Mantener un registro documentado para auditorías.'
        ]
      },
      {
        titulo: '2. Alcance',
        contenido: [
          'Esta metodología es aplicable a:',
          '',
          '- Todas las entidades, centros, clubes o programas que trabajen con menores.',
          '- Todas las actividades presenciales (deportivas, educativas, sociales, recreativas).',
          '- Todas las actividades digitales (plataformas online, comunicaciones, redes sociales).',
          '- Todos los espacios físicos donde interactúen menores.',
          '- Todos los periodos temporales (actividad regular, campamentos, eventos puntuales).'
        ]
      },
      {
        titulo: '3. Principios Básicos',
        contenido: [
          'La evaluación de riesgos en Custodia360 se fundamenta en:',
          '',
          '**Enfoque preventivo y proactivo:**',
          'Se busca anticipar y prevenir situaciones de riesgo antes de que se materialicen.',
          '',
          '**Adaptación al contexto:**',
          'Cada entidad tiene características únicas que deben considerarse en la evaluación.',
          '',
          '**Participación:**',
          'Involucrar al personal, responsables y, cuando sea apropiado, a familias y menores.',
          '',
          '**Registro y trazabilidad:**',
          'Documentar todo el proceso para permitir revisiones, auditorías y mejora continua.',
          '',
          '**Mejora continua:**',
          'La evaluación no es un ejercicio puntual, sino un ciclo constante de identificación-valoración-acción-revisión.'
        ]
      },
      {
        titulo: '4. Fases de la Evaluación',
        contenido: [
          '**Fase 1: Identificación de actividades**',
          '',
          'Listar todas las actividades en las que participan menores:',
          '- Actividades regulares (clases, entrenamientos, talleres).',
          '- Actividades puntuales (campamentos, excursiones, eventos).',
          '- Servicios complementarios (transporte, comedor, guardería).',
          '- Espacios físicos utilizados (instalaciones propias y externas).',
          '- Comunicaciones digitales (plataformas, redes sociales, mensajería).',
          '',
          '**Fase 2: Detección de peligros potenciales**',
          '',
          'Para cada actividad, identificar peligros en cuatro categorías:',
          '',
          '- **Conductuales**: Comportamientos inadecuados del personal, voluntarios o externos.',
          '- **Ambientales**: Deficiencias en instalaciones, equipamiento o diseño de espacios.',
          '- **Digitales**: Riesgos en comunicaciones online, ciberacoso, grooming.',
          '- **Organizativos**: Falta de protocolos, ratios inadecuadas, supervisión insuficiente.',
          '',
          '**Fase 3: Valoración de riesgos**',
          '',
          'Cada riesgo identificado se valora según dos dimensiones:',
          '',
          '- **Probabilidad** (1-5): ¿Con qué frecuencia puede ocurrir?',
          '- **Impacto** (1-5): ¿Qué gravedad tendría si ocurre?',
          '',
          'El nivel de riesgo se calcula como: **Riesgo = Probabilidad × Impacto**',
          '',
          '**Fase 4: Determinación del nivel de riesgo**',
          '',
          'Según el resultado de la multiplicación:',
          '- **Bajo** (1-6): Riesgo tolerable, requiere vigilancia.',
          '- **Medio** (7-14): Riesgo significativo, requiere medidas específicas.',
          '- **Alto** (15-25): Riesgo grave, requiere acción inmediata.',
          '',
          '**Fase 5: Definición de medidas**',
          '',
          'Para cada riesgo se establecen:',
          '- Controles preventivos (evitar que ocurra).',
          '- Controles detectivos (identificar cuando está ocurriendo).',
          '- Controles correctivos (minimizar impacto si ocurre).',
          '- Responsables de implementación.',
          '- Plazos de ejecución.',
          '',
          '**Fase 6: Revisión**',
          '',
          'La evaluación se revisa:',
          '- Anualmente de forma ordinaria.',
          '- Tras cualquier incidente relevante.',
          '- Cuando se introduzcan nuevas actividades o cambios significativos.'
        ]
      },
      {
        titulo: '5. Escala de Valoración',
        contenido: [
          '**Probabilidad:**',
          '',
          '1 - **Muy baja**: Riesgo remoto, sin antecedentes. Ocurrencia excepcional.',
          '2 - **Baja**: Riesgo poco frecuente. Puede ocurrir en circunstancias especiales.',
          '3 - **Media**: Riesgo posible. Puede ocurrir en condiciones normales.',
          '4 - **Alta**: Riesgo probable. Ocurre con cierta frecuencia.',
          '5 - **Muy alta**: Riesgo casi seguro. Antecedentes frecuentes o inminente.',
          '',
          '**Impacto:**',
          '',
          '1 - **Leve**: Consecuencias menores. Molestias temporales sin secuelas.',
          '2 - **Moderado**: Efectos gestionables. Malestar temporal que requiere atención.',
          '3 - **Significativo**: Consecuencias notables. Afectación que requiere intervención.',
          '4 - **Grave**: Daños importantes. Efectos duraderos que requieren apoyo especializado.',
          '5 - **Crítico**: Impacto severo. Daños permanentes o muy graves.'
        ]
      },
      {
        titulo: '6. Roles y Responsabilidades',
        contenido: [
          '**Responsable de Protección:**',
          '- Coordina todo el proceso de evaluación.',
          '- Convoca al equipo evaluador.',
          '- Consolida la documentación.',
          '- Presenta resultados a la Dirección.',
          '',
          '**Dirección / Comité de Protección:**',
          '- Aprueba la metodología y calendario.',
          '- Revisa y valida los resultados.',
          '- Autoriza recursos para implementar medidas.',
          '- Supervisa el cumplimiento del plan de tratamiento.',
          '',
          '**Equipo evaluador:**',
          '- Personal con conocimiento de las actividades.',
          '- Participan en la identificación de riesgos.',
          '- Aportan experiencia y perspectivas diversas.',
          '',
          '**Custodia360:**',
          '- Proporciona plantillas y herramientas digitales.',
          '- Ofrece soporte técnico durante el proceso.',
          '- Genera dashboards y alertas automáticas.',
          '- Mantiene histórico y trazabilidad completa.'
        ]
      },
      {
        titulo: '7. Documentación Generada',
        contenido: [
          'El proceso de evaluación genera tres documentos principales:',
          '',
          '**Matriz de Riesgos:**',
          '- Listado completo de riesgos identificados.',
          '- Valoración de probabilidad e impacto.',
          '- Nivel de riesgo calculado.',
          '- Estado actual (controlado, en seguimiento, pendiente).',
          '',
          '**Informe de Resultados:**',
          '- Resumen ejecutivo de la evaluación.',
          '- Principales riesgos detectados.',
          '- Tendencias y patrones identificados.',
          '- Comparativa con evaluaciones anteriores.',
          '',
          '**Plan de Tratamiento:**',
          '- Medidas específicas para cada riesgo.',
          '- Responsables asignados.',
          '- Plazos de implementación.',
          '- Recursos necesarios.',
          '- Indicadores de seguimiento.',
          '',
          'Toda esta documentación se gestiona digitalmente en Custodia360 para:',
          '- Facilitar actualizaciones.',
          '- Mantener trazabilidad histórica.',
          '- Generar informes automáticos.',
          '- Permitir auditorías eficientes.'
        ]
      },
      {
        titulo: 'Conclusión',
        contenido: [
          'Esta metodología proporciona un marco robusto y estandarizado para la gestión de riesgos en entornos con menores.',
          '',
          'Su aplicación sistemática permite a las entidades:',
          '- Cumplir con las exigencias de la LOPIVI.',
          '- Demostrar diligencia debida ante familias y autoridades.',
          '- Prevenir incidentes de forma proactiva.',
          '- Mejorar continuamente su sistema de protección.',
          '',
          'Custodia360 automatiza gran parte de este proceso, reduciendo la carga administrativa y aumentando la eficacia del sistema de protección.',
          '',
          '---',
          '',
          'Para más información:',
          'www.custodia360.es',
          'info@custodia360.es'
        ]
      }
    ]
  },
  {
    filename: 'Plantilla_Analisis_Riesgos',
    titulo: 'Plantilla de Análisis de Riesgos por Actividad',
    subtitulo: 'Herramienta práctica para evaluación sistemática',
    version: '1.0',
    secciones: [
      {
        titulo: 'Instrucciones de Uso',
        contenido: [
          'Esta plantilla debe completarse para cada actividad o entorno en el que participen menores.',
          '',
          '**Pasos para completar la plantilla:**',
          '',
          '1. Identificar la actividad o entorno específico.',
          '2. Describir los riesgos potenciales asociados.',
          '3. Valorar la probabilidad de ocurrencia (1-5).',
          '4. Valorar el impacto potencial (1-5).',
          '5. Calcular el nivel de riesgo (Probabilidad × Impacto).',
          '6. Definir medidas preventivas concretas.',
          '7. Asignar un responsable de implementación.',
          '8. Establecer fecha de próxima revisión.',
          '',
          'Custodia360 recomienda conservar todas las evaluaciones en formato digital para facilitar auditorías y seguimiento.'
        ]
      },
      {
        titulo: 'Tabla de Análisis de Riesgos',
        contenido: [
          'FORMATO DE TABLA:',
          '',
          '| Nº | Actividad/Entorno | Descripción del riesgo | Prob. | Imp. | Nivel | Medidas preventivas | Responsable | Fecha revisión |',
          '|----|-------------------|------------------------|-------|------|-------|---------------------|-------------|----------------|',
          '| 1  | _______________ | ______________________ | _____ | ____ | _____ | ___________________ | ___________ | ______________ |',
          '| 2  | _______________ | ______________________ | _____ | ____ | _____ | ___________________ | ___________ | ______________ |',
          '| 3  | _______________ | ______________________ | _____ | ____ | _____ | ___________________ | ___________ | ______________ |',
          '| 4  | _______________ | ______________________ | _____ | ____ | _____ | ___________________ | ___________ | ______________ |',
          '| 5  | _______________ | ______________________ | _____ | ____ | _____ | ___________________ | ___________ | ______________ |',
          '',
          'Añadir tantas filas como actividades/riesgos sea necesario evaluar.'
        ]
      },
      {
        titulo: 'Criterios de Valoración',
        contenido: [
          '**Clasificación por nivel de riesgo:**',
          '',
          '- **Riesgo BAJO** (1-6): Tolerable con vigilancia ordinaria.',
          '- **Riesgo MEDIO** (7-14): Requiere medidas específicas y seguimiento.',
          '- **Riesgo ALTO** (≥15): Requiere acción inmediata y control estricto.',
          '',
          '**Acciones según nivel:**',
          '',
          'Riesgo Bajo:',
          '- Mantener controles actuales.',
          '- Revisión anual.',
          '- Documentación básica.',
          '',
          'Riesgo Medio:',
          '- Implementar medidas adicionales.',
          '- Revisión semestral.',
          '- Formación específica del personal.',
          '- Seguimiento documentado.',
          '',
          'Riesgo Alto:',
          '- Acción correctiva inmediata.',
          '- Revisión mensual hasta reducción.',
          '- Informar a Dirección.',
          '- Considerar suspensión temporal de actividad.',
          '- Registro detallado de todas las acciones.'
        ]
      },
      {
        titulo: 'Ejemplo Práctico',
        contenido: [
          '**EJEMPLO COMPLETO DE ANÁLISIS:**',
          '',
          '| Nº | Actividad | Descripción del riesgo | P | I | Nivel | Medidas | Responsable | Revisión |',
          '|----|-----------|------------------------|---|---|-------|---------|-------------|----------|',
          '| 1 | Entrenamiento deportivo | Contacto físico inadecuado entre entrenador y menores | 3 | 4 | 12 (MEDIO) | - Supervisión visible constante. - Entrenamiento en grupos, nunca individual. - Formación en límites apropiados | Coordinador Deportivo | Semestral |',
          '| 2 | Vestuarios | Falta de privacidad y supervisión | 4 | 3 | 12 (MEDIO) | - Instalación de zonas individuales. - Supervisión externa rotativa. - Protocolo de uso por turnos | Director de Instalaciones | Trimestral |',
          '| 3 | Comunicación digital | Mensajes privados entre staff y menores | 5 | 4 | 20 (ALTO) | - Prohibición total de comunicación privada. - Uso exclusivo de plataforma oficial. - Auditoría mensual de comunicaciones | Responsable de Protección | Mensual |',
          '',
          '**Interpretación del ejemplo:**',
          '',
          '- Actividad 1 y 2: Riesgo medio que requiere medidas específicas y seguimiento semestral/trimestral.',
          '- Actividad 3: Riesgo alto que requiere acción inmediata, control estricto y revisión mensual.'
        ]
      },
      {
        titulo: 'Actualización y Mantenimiento',
        contenido: [
          '**Frecuencia de actualización:**',
          '',
          '- **Revisión anual obligatoria** de toda la matriz.',
          '- **Revisión extraordinaria** tras incidentes o cambios significativos.',
          '- **Revisión específica** de riesgos altos: mensual.',
          '- **Revisión específica** de riesgos medios: semestral.',
          '',
          '**Responsabilidades:**',
          '',
          '- El Responsable de Protección coordina las revisiones.',
          '- Los responsables asignados implementan y reportan medidas.',
          '- La Dirección aprueba cambios significativos.',
          '',
          '**Conservación:**',
          '',
          'Custodia360 mantiene histórico completo de:',
          '- Todas las versiones de la evaluación.',
          '- Cambios realizados y motivos.',
          '- Resultados de las medidas implementadas.',
          '- Evidencias documentales.'
        ]
      }
    ]
  },
  {
    filename: 'Matriz_Riesgos_5x5',
    titulo: 'Matriz de Riesgos 5x5',
    subtitulo: 'Modelo genérico de clasificación visual',
    version: '1.0',
    secciones: [
      {
        titulo: 'Escala Cruzada Probabilidad × Impacto',
        contenido: [
          '**MATRIZ 5×5:**',
          '',
          '| Impacto ↓ Probabilidad → | 1 Muy baja | 2 Baja | 3 Media | 4 Alta | 5 Muy alta |',
          '|--------------------------|------------|---------|---------|---------|-------------|',
          '| **1 Leve** | BAJO | BAJO | BAJO | MEDIO | MEDIO |',
          '| **2 Moderado** | BAJO | BAJO | MEDIO | MEDIO | ALTO |',
          '| **3 Significativo** | BAJO | MEDIO | MEDIO | ALTO | ALTO |',
          '| **4 Grave** | MEDIO | MEDIO | ALTO | ALTO | MUY ALTO |',
          '| **5 Crítico** | MEDIO | ALTO | ALTO | MUY ALTO | MUY ALTO |',
          '',
          '**LEYENDA DE COLORES:**',
          '',
          '🟢 **BAJO** (1-6): Riesgo tolerable',
          '🟡 **MEDIO** (7-14): Riesgo significativo',
          '🟠 **ALTO** (15-19): Riesgo grave',
          '🔴 **MUY ALTO** (20-25): Riesgo crítico'
        ]
      },
      {
        titulo: 'Interpretación de la Matriz',
        contenido: [
          '**Zona Verde (BAJO):**',
          '- Riesgos aceptables con controles actuales.',
          '- Requieren vigilancia ordinaria.',
          '- Revisión anual suficiente.',
          '- No requieren recursos adicionales inmediatos.',
          '',
          '**Zona Amarilla (MEDIO):**',
          '- Riesgos que requieren atención específica.',
          '- Implementar medidas preventivas adicionales.',
          '- Revisión semestral o trimestral.',
          '- Asignar recursos para mejoras.',
          '',
          '**Zona Naranja (ALTO):**',
          '- Riesgos graves que necesitan acción prioritaria.',
          '- Plan de mitigación detallado.',
          '- Revisión mensual.',
          '- Recursos significativos asignados.',
          '- Informar a Dirección.',
          '',
          '**Zona Roja (MUY ALTO):**',
          '- Riesgos inaceptables que requieren acción inmediata.',
          '- Suspender actividad hasta implementar controles.',
          '- Revisión semanal.',
          '- Máxima prioridad de recursos.',
          '- Escalado a máximo nivel directivo.'
        ]
      },
      {
        titulo: 'Aplicación Práctica',
        contenido: [
          '**Uso en la evaluación:**',
          '',
          '1. Identificar cada riesgo.',
          '2. Valorar Probabilidad (1-5) e Impacto (1-5).',
          '3. Ubicar el riesgo en la matriz.',
          '4. Identificar su categoría (Bajo/Medio/Alto/Muy Alto).',
          '5. Aplicar las acciones correspondientes.',
          '',
          '**Ejemplo de ubicación:**',
          '',
          'Riesgo: "Comunicación digital inadecuada"',
          '- Probabilidad: 5 (muy alta - uso generalizado de mensajería)',
          '- Impacto: 4 (grave - potencial grooming)',
          '- Ubicación: Fila "4 Grave" × Columna "5 Muy alta"',
          '- Resultado: MUY ALTO (requiere acción inmediata)',
          '',
          '**Mapa de riesgos:**',
          '',
          'La matriz permite visualizar de un vistazo:',
          '- Concentración de riesgos por zona.',
          '- Evolución tras implementar medidas.',
          '- Comparativa entre diferentes áreas/actividades.',
          '- Priorización visual de recursos.'
        ]
      },
      {
        titulo: 'Integración en Custodia360',
        contenido: [
          'La plataforma Custodia360 digitaliza esta matriz proporcionando:',
          '',
          '**Dashboard visual:**',
          '- Mapa de calor automático de riesgos.',
          '- Filtros por actividad, fecha, responsable.',
          '- Gráficos de evolución temporal.',
          '',
          '**Alertas automáticas:**',
          '- Notificación cuando un riesgo sube de nivel.',
          '- Recordatorios de revisiones pendientes.',
          '- Avisos de incumplimiento de plazos.',
          '',
          '**Análisis histórico:**',
          '- Comparativa con evaluaciones anteriores.',
          '- Tendencias de mejora o deterioro.',
          '- Eficacia de medidas implementadas.',
          '',
          '**Trazabilidad completa:**',
          '- Registro de todos los cambios.',
          '- Evidencia documental para auditorías.',
          '- Exportación automática de informes.'
        ]
      }
    ]
  },
  {
    filename: 'Informe_Evaluacion_Riesgos',
    titulo: 'Informe de Evaluación de Riesgos',
    subtitulo: 'Modelo de salida - Documento ejecutivo',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Introducción',
        contenido: [
          'El presente informe ha sido elaborado conforme a la Metodología de Evaluación de Riesgos LOPIVI de Custodia360.',
          '',
          'Su objetivo es proporcionar una visión completa y ejecutiva de los riesgos identificados en la entidad, facilitando la toma de decisiones informadas por parte de la Dirección y el Responsable de Protección.',
          '',
          'Este documento constituye evidencia del cumplimiento de la obligación legal de evaluación de riesgos establecida en la LOPIVI.'
        ]
      },
      {
        titulo: '2. Datos Generales',
        contenido: [
          '**Información de la entidad:**',
          '',
          '- Nombre de la entidad: _________________________________',
          '- CIF: _________________________________',
          '- Actividad principal: _________________________________',
          '',
          '**Información de la evaluación:**',
          '',
          '- Fecha de la evaluación: _________________________________',
          '- Evaluador responsable: _________________________________',
          '- Cargo: _________________________________',
          '- Versión del Plan de Protección: _________________________________',
          '- Periodo evaluado: _________________________________',
          '',
          '**Equipo evaluador:**',
          '',
          '1. _________________________________',
          '2. _________________________________',
          '3. _________________________________'
        ]
      },
      {
        titulo: '3. Resumen de Resultados',
        contenido: [
          '**Distribución de riesgos por nivel:**',
          '',
          '| Nivel de riesgo | Nº de riesgos | Porcentaje | Ejemplos |',
          '|-----------------|----------------|------------|----------|',
          '| BAJO | [___] | [___%] | Iluminación deficiente en zona común |',
          '| MEDIO | [___] | [___%] | Supervisión insuficiente en vestuarios |',
          '| ALTO | [___] | [___%] | Comunicación digital sin protocolo |',
          '| MUY ALTO | [___] | [___%] | - |',
          '',
          '**Estadísticas clave:**',
          '',
          '- Total de riesgos identificados: [___]',
          '- Riesgos con medidas implementadas: [___]',
          '- Riesgos en seguimiento: [___]',
          '- Riesgos pendientes de tratamiento: [___]',
          '',
          '**Evolución respecto a evaluación anterior:**',
          '',
          '- Nuevos riesgos identificados: [___]',
          '- Riesgos mitigados/eliminados: [___]',
          '- Riesgos que han aumentado de nivel: [___]',
          '- Riesgos que han disminuido de nivel: [___]'
        ]
      },
      {
        titulo: '4. Principales Riesgos Detectados',
        contenido: [
          '**Categoría: Riesgos Conductuales**',
          '',
          '1. **Contacto físico inadecuado en actividades deportivas**',
          '   - Nivel: MEDIO (Prob: 3, Imp: 4)',
          '   - Descripción: Entrenamientos individuales sin supervisión visible',
          '   - Medidas: Supervisión obligatoria, entrenamientos grupales',
          '',
          '2. **Comunicación privada staff-menores**',
          '   - Nivel: ALTO (Prob: 5, Imp: 4)',
          '   - Descripción: Uso de mensajería personal no institucional',
          '   - Medidas: Prohibición total, plataforma oficial exclusiva',
          '',
          '**Categoría: Riesgos Ambientales**',
          '',
          '3. **Zonas sin visibilidad suficiente**',
          '   - Nivel: MEDIO (Prob: 4, Imp: 3)',
          '   - Descripción: Pasillos y vestuarios con puntos ciegos',
          '   - Medidas: Redistribución de espacios, mejora iluminación',
          '',
          '4. **Acceso no controlado de personas ajenas**',
          '   - Nivel: MEDIO (Prob: 3, Imp: 3)',
          '   - Descripción: Instalaciones accesibles sin registro',
          '   - Medidas: Control de acceso, identificación obligatoria',
          '',
          '**Categoría: Riesgos Digitales**',
          '',
          '5. **Uso inadecuado de dispositivos móviles**',
          '   - Nivel: ALTO (Prob: 5, Imp: 3)',
          '   - Descripción: Grabaciones y fotos sin autorización',
          '   - Medidas: Protocolo de uso, consentimientos informados',
          '',
          '6. **Escasa formación en ciberacoso**',
          '   - Nivel: MEDIO (Prob: 4, Imp: 4)',
          '   - Descripción: Personal sin conocimientos actualizados',
          '   - Medidas: Formación específica trimestral',
          '',
          '**Categoría: Riesgos Organizativos**',
          '',
          '7. **Ratios inadecuadas en actividades**',
          '   - Nivel: MEDIO (Prob: 3, Imp: 4)',
          '   - Descripción: Exceso de menores por adulto responsable',
          '   - Medidas: Ajuste de ratios según edad, contratación adicional',
          '',
          '8. **Falta de protocolos documentados**',
          '   - Nivel: ALTO (Prob: 4, Imp: 4)',
          '   - Descripción: Actuaciones ad-hoc sin procedimiento escrito',
          '   - Medidas: Documentación completa en Custodia360'
        ]
      },
      {
        titulo: '5. Medidas Recomendadas',
        contenido: [
          '**Prioridad 1 - Acción Inmediata (Riesgos Altos/Muy Altos):**',
          '',
          '1. Implementar plataforma oficial de comunicación exclusiva.',
          '2. Prohibir terminantemente comunicaciones privadas.',
          '3. Documentar todos los protocolos en Custodia360.',
          '4. Establecer protocolo de uso de dispositivos móviles.',
          '',
          '**Prioridad 2 - Acción en 30 días (Riesgos Medios):**',
          '',
          '1. Revisión completa del diseño de espacios físicos.',
          '2. Mejora de iluminación en zonas identificadas.',
          '3. Implantación de sistema de control de acceso.',
          '4. Ajuste de ratios adulto/menor según normativa.',
          '5. Programa de formación en ciberacoso.',
          '',
          '**Prioridad 3 - Planificación a medio plazo (Riesgos Bajos):**',
          '',
          '1. Mejora continua de protocolos existentes.',
          '2. Formación de actualización anual.',
          '3. Auditorías semestrales de Custodia360.',
          '',
          '**Recursos necesarios:**',
          '',
          '- Presupuesto estimado: [_________] €',
          '- Personal adicional: [_________]',
          '- Formación externa: [_________]',
          '- Inversión en infraestructura: [_________] €'
        ]
      },
      {
        titulo: '6. Seguimiento y Revisión',
        contenido: [
          '**Calendario de seguimiento:**',
          '',
          '- **Riesgos Muy Altos/Altos**: Revisión mensual',
          '- **Riesgos Medios**: Revisión trimestral',
          '- **Riesgos Bajos**: Revisión anual',
          '',
          '**Responsable de seguimiento:**',
          '',
          'El Responsable de Protección supervisará la implementación de todas las medidas y reportará trimestralmente a la Dirección.',
          '',
          '**Próxima evaluación completa:**',
          '',
          'Fecha prevista: _________________________________',
          '',
          '**Conservación del informe:**',
          '',
          'Este informe será conservado durante un mínimo de 5 años en el sistema Custodia360, junto con:',
          '- Matriz completa de riesgos.',
          '- Evidencias de implementación de medidas.',
          '- Registro de revisiones y actualizaciones.',
          '- Actas de reuniones del Comité de Protección.',
          '',
          '**Firmas y validación:**',
          '',
          'Responsable de Protección: _________________________________',
          '',
          'Firma: _________________________________  Fecha: _____________',
          '',
          '',
          'Director/a de la entidad: _________________________________',
          '',
          'Firma: _________________________________  Fecha: _____________'
        ]
      },
      {
        titulo: 'Conclusión',
        contenido: [
          'La evaluación realizada refleja el compromiso de la entidad con la protección integral de los menores.',
          '',
          'Los riesgos identificados son comunes en entidades similares y las medidas propuestas son realistas y alcanzables.',
          '',
          'La implementación del plan de tratamiento reducirá significativamente la exposición a situaciones de riesgo y reforzará la cultura de protección organizacional.',
          '',
          'Custodia360 continuará proporcionando soporte técnico, formación y herramientas digitales para mantener el sistema de protección actualizado y eficaz.',
          '',
          '---',
          '',
          'Para más información:',
          'www.custodia360.es',
          'info@custodia360.es'
        ]
      }
    ]
  }
]

export async function POST() {
  try {
    console.log('📊 Generando Bloque 03: Análisis de Riesgos (PDF + DOCX)...')

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

      const pdfPath = `plantillas/03_Analisis_de_Riesgos/${config.filename}.pdf`
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

      const docxPath = `plantillas/03_Analisis_de_Riesgos/${config.filename}.docx`
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

    console.log('✅ Todos los documentos del Bloque 03 generados')

    // Enviar email de confirmación
    console.log('📧 Enviando email de confirmación...')

    const emailHtml = `
      <h2>Bloque 03_Análisis de Riesgos Custodia360 creado correctamente</h2>
      <p>Se han generado y publicado correctamente los siguientes documentos técnicos en el panel de administración Custodia360:</p>
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
      <p><strong>Carpeta:</strong> <code>/docs/plantillas/03_Analisis_de_Riesgos/</code></p>
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
        subject: 'Bloque 03_Análisis de Riesgos Custodia360 creado correctamente',
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
