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

// Configuraciones de los 3 documentos del Bloque 07
const documentosConfig = [
  {
    filename: 'Modelo_Canal_Seguro_Buzon_LOPIVI',
    titulo: 'Modelo de Canal Seguro / Buzón LOPIVI',
    subtitulo: 'Sistema confidencial de comunicación de situaciones de riesgo',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Objetivo',
        contenido: [
          'Facilitar a menores, familias y personal un canal confidencial, seguro y accesible para comunicar cualquier situación de riesgo, violencia o vulneración de derechos, cumpliendo la LOPIVI (art. 35 y ss).',
          '',
          'Este canal permite:',
          '- Comunicar preocupaciones de forma confidencial.',
          '- Proteger la identidad del comunicante (si así lo desea).',
          '- Garantizar respuesta rápida del Responsable de Protección.',
          '- Cumplir con la obligación legal de tener un canal seguro.'
        ]
      },
      {
        titulo: '2. Características del Canal',
        contenido: [
          '**Confidencialidad:**',
          '- Solo tiene acceso el Responsable de Protección.',
          '- Los datos se tratan conforme RGPD y LOPDGDD.',
          '- Se garantiza la privacidad del comunicante.',
          '',
          '**Accesibilidad:**',
          '- Disponible 24/7 vía formulario web o código QR.',
          '- Adaptado a diferentes edades y capacidades.',
          '- Accesible desde cualquier dispositivo.',
          '- Sin necesidad de identificación obligatoria.',
          '',
          '**No represalia:**',
          '- Las comunicaciones no pueden generar perjuicio al informante.',
          '- Protección legal frente a represalias.',
          '- Presunción de buena fe.',
          '',
          '**Seguimiento:**',
          '- Cada caso se gestiona y documenta en Custodia360.',
          '- Trazabilidad completa de actuaciones.',
          '- Comunicación de respuesta en máximo 48 horas.',
          '- Protección de datos durante todo el proceso.'
        ]
      },
      {
        titulo: '3. Instrucciones de Uso',
        contenido: [
          '**Para comunicar una preocupación o incidente:**',
          '',
          '1. Escanee el código QR o acceda a: https://canalseguro.custodia360.es',
          '',
          '2. Complete los campos básicos del formulario (sin obligación de identificarse).',
          '',
          '3. Describa brevemente la preocupación o incidente con la mayor objetividad posible.',
          '',
          '4. El Responsable de Protección contactará en menos de 48 horas si procede.',
          '',
          '5. Recibirá confirmación de recepción automática (si proporciona email).',
          '',
          '**Importante:**',
          '- No es necesario tener pruebas para comunicar una preocupación.',
          '- Cualquier duda o sospecha merece ser comunicada.',
          '- El canal no sustituye a servicios de emergencia (112).',
          '- En situaciones de riesgo inminente, contactar directamente con 112.'
        ]
      },
      {
        titulo: '4. Ejemplo de Formulario (Adaptable)',
        contenido: [
          '**FORMULARIO DE CANAL SEGURO**',
          '',
          '**Datos de la comunicación:**',
          '',
          'Fecha de comunicación: ___________________',
          '',
          'Tipo de situación:',
          '☐ Violencia física',
          '☐ Violencia psicológica',
          '☐ Ciberacoso',
          '☐ Negligencia',
          '☐ Abuso sexual',
          '☐ Otro: _________________________________',
          '',
          '**Descripción de los hechos:**',
          '',
          '(Por favor, describa lo que ha observado o le han comunicado de forma objetiva, indicando fecha, lugar y personas involucradas si es posible)',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Datos del menor afectado (si se conoce):**',
          '',
          'Nombre: _______________________________ Edad: _________',
          '',
          'Grupo/Actividad: _______________________________________________________',
          '',
          '**Preferencia de comunicación:**',
          '',
          '¿Desea mantenerse anónimo?',
          '☐ Sí, no deseo facilitar mis datos',
          '☐ No, pueden contactar conmigo',
          '',
          '**Datos de contacto (opcional):**',
          '',
          'Nombre: _______________________________________________________________',
          '',
          'Email: ________________________________________________________________',
          '',
          'Teléfono: _____________________________________________________________',
          '',
          'Relación con el menor:',
          '☐ Personal de la entidad',
          '☐ Familiar',
          '☐ El propio menor',
          '☐ Otro: ______________________________________________________________',
          '',
          '**Autorización:**',
          '',
          'He leído y acepto la Política de Privacidad y el tratamiento de datos.',
          '☐ Sí',
          '',
          'Fecha: __________________  Firma (opcional): _______________________'
        ]
      },
      {
        titulo: '5. Aviso Legal y Tratamiento de Datos',
        contenido: [
          '**Responsable del tratamiento:**',
          '[Nombre de la Entidad]',
          '',
          '**Finalidad:**',
          'Gestionar las comunicaciones de situaciones de riesgo o vulneración de derechos de menores, conforme a la LOPIVI.',
          '',
          '**Base legal:**',
          'Cumplimiento de obligación legal (LOPIVI) e interés superior del menor.',
          '',
          '**Conservación:**',
          'Durante la tramitación del caso + 5 años.',
          '',
          '**Destinatarios:**',
          'Responsable de Protección, autoridades competentes si procede.',
          '',
          '**Derechos:**',
          'Acceso, rectificación, supresión, limitación, portabilidad y oposición.',
          '',
          '**Contacto DPO:**',
          'dpo@[entidad].es',
          '',
          '**Plataforma:**',
          'Custodia360 actúa como encargado del tratamiento conforme al RGPD.',
          '',
          '**Garantías de seguridad:**',
          '- Cifrado de extremo a extremo.',
          '- Servidores en la Unión Europea.',
          '- Auditorías periódicas de seguridad.',
          '- Acceso restringido exclusivamente a personal autorizado.'
        ]
      },
      {
        titulo: '6. Implementación Técnica',
        contenido: [
          '**Plataforma Custodia360:**',
          '',
          '- Formulario web embebible en la página de la entidad.',
          '- Código QR descargable para imprimir y distribuir.',
          '- Panel de gestión exclusivo para Responsable de Protección.',
          '- Notificaciones automáticas por email y SMS.',
          '- Registro completo de comunicaciones con trazabilidad.',
          '',
          '**Ubicación del Canal Seguro:**',
          '',
          '- Página web de la entidad: Sección "Canal Seguro LOPIVI"',
          '- Carteles informativos en instalaciones con código QR.',
          '- Folletos distribuidos a familias y menores.',
          '- Formación específica al personal sobre su existencia.',
          '',
          '**Difusión:**',
          '',
          '- Reuniones informativas con familias.',
          '- Talleres de sensibilización con menores.',
          '- Formación obligatoria al personal.',
          '- Recordatorios periódicos (newsletters, redes sociales).'
        ]
      },
      {
        titulo: 'Conclusión',
        contenido: [
          'El Canal Seguro o Buzón LOPIVI es un elemento fundamental para garantizar que cualquier persona pueda comunicar situaciones de riesgo sin miedo a represalias.',
          '',
          'Custodia360 facilita su implementación mediante una plataforma digital segura, accesible y conforme a la normativa de protección de datos.',
          '',
          'La existencia de este canal debe ser conocida por toda la comunidad educativa y su uso debe fomentarse activamente.',
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
    filename: 'Formulario_Participacion_Infantil',
    titulo: 'Formulario de Participación Infantil',
    subtitulo: 'Herramienta para dar voz a niños, niñas y adolescentes',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Propósito',
        contenido: [
          'Dar voz a niños, niñas y adolescentes para expresar opiniones, propuestas o preocupaciones sobre su entorno, de manera accesible, comprensible y segura.',
          '',
          'Este formulario permite:',
          '- Ejercer el derecho a ser oído (art. 12 Convención ONU).',
          '- Identificar necesidades y preocupaciones directamente.',
          '- Mejorar los servicios desde la perspectiva de los menores.',
          '- Crear un clima de confianza y participación.',
          '- Cumplir con la obligación legal de garantizar participación infantil.'
        ]
      },
      {
        titulo: '2. Principios de Participación',
        contenido: [
          '**Libertad de expresión:**',
          '- Los menores pueden expresar libremente sus opiniones.',
          '- Sin presión ni condicionamiento.',
          '- Respeto a todas las opiniones, aunque sean críticas.',
          '',
          '**No discriminación:**',
          '- Todos los menores tienen derecho a participar.',
          '- Sin exclusiones por edad, género, origen, capacidad.',
          '- Adaptación a diferentes necesidades de comunicación.',
          '',
          '**Escucha activa:**',
          '- Las opiniones se toman en serio.',
          '- Retroalimentación sobre acciones adoptadas.',
          '- Comunicación de resultados adaptada a su edad.',
          '',
          '**Protección frente a represalias:**',
          '- Ninguna opinión puede generar consecuencias negativas.',
          '- Garantía de confidencialidad si así se solicita.',
          '- Valoración positiva de la participación.'
        ]
      },
      {
        titulo: '3. Instrucciones de Uso',
        contenido: [
          'Este formulario puede completarse:',
          '',
          '**Individualmente:**',
          '- De forma privada y confidencial.',
          '- En formato digital o papel.',
          '- Sin obligación de identificarse.',
          '',
          '**En grupo (talleres, asambleas, actividades Custodia360):**',
          '- Facilitado por persona adulta de confianza.',
          '- En ambiente relajado y seguro.',
          '- Con tiempo suficiente para reflexionar.',
          '- Respetando turnos de palabra.',
          '',
          '**Frecuencia recomendada:**',
          '- Al menos 2 veces al año.',
          '- Tras cambios significativos en la entidad.',
          '- Cuando se detecten necesidades específicas.',
          '',
          '**Gestión de respuestas:**',
          '- Análisis por el Responsable de Protección.',
          '- Comunicación de resultados a los menores.',
          '- Integración en planes de mejora.'
        ]
      },
      {
        titulo: '4. Contenido del Formulario',
        contenido: [
          '**FORMULARIO DE PARTICIPACIÓN INFANTIL**',
          '',
          '¡Tu opinión es muy importante para nosotros!',
          '',
          'Este formulario es anónimo (no tienes que poner tu nombre si no quieres).',
          'Queremos conocer tu experiencia y tus ideas para mejorar.',
          '',
          '---',
          '',
          '**1. ¿Qué te gusta de tu escuela / club / grupo?**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**2. ¿Qué cosas te gustaría cambiar o mejorar?**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**3. ¿Te sientes seguro/a en las actividades?**',
          '',
          '☐ Sí, siempre',
          '☐ Sí, la mayoría de veces',
          '☐ A veces',
          '☐ No mucho',
          '☐ No, no me siento seguro/a',
          '',
          'Si has marcado "A veces", "No mucho" o "No", ¿puedes explicar por qué?',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**4. ¿Sabes a quién acudir si algo te preocupa o te hace sentir mal?**',
          '',
          '☐ Sí, sé a quién acudir',
          '☐ No estoy seguro/a',
          '☐ No lo sé',
          '',
          'Si has dicho que sí, ¿a quién acudirías?',
          '',
          '_____________________________________________________________________________',
          '',
          '**5. ¿Has participado en decisiones sobre actividades o normas?**',
          '',
          '☐ Sí, muchas veces',
          '☐ Algunas veces',
          '☐ Pocas veces',
          '☐ Nunca',
          '',
          '**6. ¿Qué actividad nueva te gustaría hacer?**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**7. ¿Cómo te sientes cuando estás aquí?**',
          '',
          '☐ Muy contento/a',
          '☐ Contento/a',
          '☐ Normal',
          '☐ A veces triste',
          '☐ Triste',
          '',
          '**8. ¿Quieres dejar un mensaje para el equipo Custodia360?**',
          '',
          '(Puede ser un agradecimiento, una idea, una queja... ¡lo que quieras!)',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**9. Datos (opcional)**',
          '',
          'Nombre (si quieres decirlo): _________________________________________________',
          '',
          'Edad: ________ años',
          '',
          'Grupo / Actividad: __________________________________________________________',
          '',
          'Fecha: ___________________________',
          '',
          '---',
          '',
          '¡Muchas gracias por compartir tu opinión!',
          '',
          '⚠️ **Nota para el personal:**',
          'Este documento se conservará de forma anónima salvo consentimiento expreso del menor o tutor legal.'
        ]
      },
      {
        titulo: '5. Variantes por Edad',
        contenido: [
          '**Para menores de 6 años:**',
          '',
          '- Formulario simplificado con pictogramas.',
          '- Uso de caritas (😊 😐 😢) para expresar emociones.',
          '- Apoyo visual con dibujos.',
          '- Lectura en voz alta por adulto de confianza.',
          '',
          '**Para 6-12 años:**',
          '- Formulario estándar con lenguaje claro y sencillo.',
          '- Preguntas abiertas y cerradas combinadas.',
          '- Espacio para dibujos si lo prefieren.',
          '',
          '**Para adolescentes (12+ años):**',
          '- Formulario más extenso con preguntas reflexivas.',
          '- Opción de formato digital (Google Forms, Custodia360).',
          '- Preguntas sobre participación en toma de decisiones.',
          '- Espacio para propuestas concretas de mejora.'
        ]
      },
      {
        titulo: '6. Análisis y Acciones Derivadas',
        contenido: [
          '**Análisis de respuestas:**',
          '',
          '- Lectura completa de todas las respuestas por el Responsable de Protección.',
          '- Clasificación por temas: seguridad, actividades, convivencia, etc.',
          '- Identificación de patrones o preocupaciones recurrentes.',
          '- Detección de casos individuales que requieran seguimiento.',
          '',
          '**Acciones derivadas:**',
          '',
          '- Comunicación de resultados generales a los menores (asamblea, cartel).',
          '- Integración de propuestas viables en plan de actividades.',
          '- Mejoras en protocolos si se detectan problemas de seguridad.',
          '- Seguimiento individual de casos preocupantes.',
          '',
          '**Comunicación a familias:**',
          '',
          '- Informe resumido de resultados y acciones adoptadas.',
          '- Valoración positiva de la participación infantil.',
          '- Invitación a colaborar en mejoras propuestas.',
          '',
          '**Registro en Custodia360:**',
          '',
          '- Digitalización de formularios.',
          '- Análisis estadístico automático.',
          '- Trazabilidad de acciones derivadas.',
          '- Evidencia de cumplimiento de participación infantil.'
        ]
      },
      {
        titulo: 'Conclusión',
        contenido: [
          'La participación infantil es un derecho fundamental y una herramienta esencial para crear entornos seguros y respetuosos.',
          '',
          'Este formulario debe aplicarse de forma periódica, con garantías de confidencialidad y con compromiso real de tener en cuenta las opiniones de los menores.',
          '',
          'Custodia360 facilita la gestión digital de estos formularios, su análisis y el seguimiento de acciones derivadas.',
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
    filename: 'Plantilla_Comunicacion_Interna_Incidentes',
    titulo: 'Plantilla de Comunicación Interna de Incidentes',
    subtitulo: 'Formulario de notificación al Responsable de Protección',
    version: '1.0',
    secciones: [
      {
        titulo: '1. Objeto',
        contenido: [
          'Estandarizar la comunicación interna de incidentes relacionados con menores entre el personal y el Responsable de Protección, garantizando confidencialidad y trazabilidad.',
          '',
          'Esta plantilla permite:',
          '- Notificar de forma estructurada y objetiva.',
          '- Garantizar que se recopila toda la información relevante.',
          '- Mantener trazabilidad de todas las comunicaciones.',
          '- Cumplir con el deber de comunicación de la LOPIVI.',
          '- Proteger tanto al menor como al comunicante.'
        ]
      },
      {
        titulo: '2. Instrucciones de Uso',
        contenido: [
          '**Cuándo utilizar este formulario:**',
          '',
          '- Ante cualquier sospecha o preocupación sobre el bienestar de un menor.',
          '- Cuando se observe un cambio significativo en el comportamiento de un menor.',
          '- Si un menor revela información preocupante.',
          '- Ante cualquier situación que pueda constituir violencia o riesgo.',
          '',
          '**Cómo completar el formulario:**',
          '',
          '1. Cumplimentar todos los campos disponibles.',
          '2. Ser objetivo: describir hechos, no interpretaciones.',
          '3. Incluir palabras textuales del menor si las hubo.',
          '4. No investigar, solo comunicar lo observado.',
          '5. Entregar al Responsable de Protección inmediatamente.',
          '',
          '**Importante:**',
          '',
          '- No esperar tener certeza absoluta para comunicar.',
          '- No compartir con terceros no autorizados.',
          '- No confrontar al presunto agresor.',
          '- Mantener confidencialidad estricta.'
        ]
      },
      {
        titulo: '3. Datos Generales',
        contenido: [
          '**COMUNICACIÓN INTERNA DE INCIDENTES**',
          '',
          '**Fecha del incidente:** _______________________________________________________',
          '',
          '**Hora (aproximada):** _________________________________________________________',
          '',
          '**Lugar:** ____________________________________________________________________',
          '',
          '**Actividad / Grupo:** _________________________________________________________',
          '',
          '**Persona que comunica:**',
          '',
          'Nombre: ____________________________________________________________________',
          '',
          'Cargo / Función: ____________________________________________________________',
          '',
          'Teléfono de contacto: _______________________________________________________',
          '',
          'Email: _____________________________________________________________________',
          '',
          '**Fecha de esta comunicación:** ________________________________________________',
          '',
          '**Tipo de incidente:**',
          '',
          '☐ Violencia física',
          '☐ Violencia psicológica',
          '☐ Ciberacoso',
          '☐ Negligencia',
          '☐ Abuso sexual',
          '☐ Conducta inapropiada de adulto',
          '☐ Conflicto entre menores',
          '☐ Otro: ___________________________________________________________________'
        ]
      },
      {
        titulo: '4. Descripción de los Hechos',
        contenido: [
          '**Descripción objetiva de lo ocurrido:**',
          '',
          '(Describa los hechos observados o comunicados de forma clara, cronológica y objetiva. Incluya qué vio, qué escuchó, quién estaba presente, etc.)',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Palabras textuales del menor (si las hubo):**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Observaciones sobre el estado del menor:**',
          '',
          '☐ Lloró',
          '☐ Mostró miedo',
          '☐ Parecía nervioso/a',
          '☐ Evitó contacto visual',
          '☐ Presentaba lesiones visibles',
          '☐ Otro: ___________________________________________________________________',
          '',
          'Descripción adicional:',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________'
        ]
      },
      {
        titulo: '5. Personas Implicadas',
        contenido: [
          '**MENOR/ES AFECTADO/S:**',
          '',
          '| Nombre | Edad | Grupo/Actividad | Observaciones |',
          '|---------|------|------------------|----------------|',
          '|         |      |                  |                |',
          '|         |      |                  |                |',
          '|         |      |                  |                |',
          '',
          '**OTRAS PERSONAS IMPLICADAS:**',
          '',
          '| Nombre | Relación/Rol | Observaciones |',
          '|---------|--------------|----------------|',
          '|         |              |                |',
          '|         |              |                |',
          '|         |              |                |',
          '',
          '**TESTIGOS PRESENTES:**',
          '',
          '| Nombre | Relación/Rol | Contacto |',
          '|---------|--------------|-----------|',
          '|         |              |           |',
          '|         |              |           |',
          '|         |              |           |'
        ]
      },
      {
        titulo: '6. Actuaciones Iniciales',
        contenido: [
          '**Acciones adoptadas inmediatamente:**',
          '',
          '☐ Se garantizó la seguridad del menor',
          '☐ Se avisó al Responsable de Protección',
          '☐ Se informó a la familia',
          '☐ Se contactó con servicios de emergencia (112)',
          '☐ Se separó al presunto agresor del menor',
          '☐ Se registró fotográficamente (con consentimiento)',
          '☐ Se preservaron evidencias',
          '☐ Otro: ___________________________________________________________________',
          '',
          'Descripción de actuaciones:',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Personas notificadas hasta el momento:**',
          '',
          '☐ Responsable de Protección',
          '☐ Director/a de la entidad',
          '☐ Coordinador/a del programa',
          '☐ Familia del menor',
          '☐ Servicios Sociales',
          '☐ Fuerzas de Seguridad',
          '☐ Otro: ___________________________________________________________________'
        ]
      },
      {
        titulo: '7. Evaluación del Responsable de Protección',
        contenido: [
          '**SECCIÓN A COMPLETAR POR EL RESPONSABLE DE PROTECCIÓN**',
          '',
          '**Fecha de recepción:** ________________________________________________________',
          '',
          '**Nivel de riesgo:**',
          '',
          '☐ Bajo: Seguimiento preventivo',
          '☐ Medio: Requiere intervención y seguimiento',
          '☐ Alto: Requiere actuación inmediata',
          '',
          '**Derivación necesaria:**',
          '',
          '☐ Sí  ☐ No',
          '',
          'Si sí, a:',
          '☐ Servicios Sociales',
          '☐ Fiscalía de Menores',
          '☐ Fuerzas de Seguridad',
          '☐ Servicios sanitarios',
          '☐ Otro: ___________________________________________________________________',
          '',
          '**Acciones adoptadas:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Plan de seguimiento:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Fecha de próxima revisión:** _________________________________________________',
          '',
          '**Observaciones adicionales:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Firma del Responsable de Protección:**',
          '',
          'Nombre: ____________________________________________________________________',
          '',
          'Firma: ______________________________________  Fecha: _____________________'
        ]
      },
      {
        titulo: '8. Confidencialidad y Conservación',
        contenido: [
          '⚠️ **IMPORTANTE:**',
          '',
          '- Este documento es CONFIDENCIAL.',
          '- Solo puede ser consultado por personal autorizado.',
          '- Debe conservarse de forma segura durante al menos 5 años.',
          '- Registrar digitalmente en la plataforma Custodia360 para trazabilidad.',
          '- Enviar copia escaneada al Responsable de Protección inmediatamente.',
          '- No compartir con terceros salvo autorización expresa o requerimiento legal.',
          '',
          '**Tratamiento de datos:**',
          '',
          '- Los datos personales se tratan conforme RGPD y LOPDGDD.',
          '- Finalidad: Gestión de protección de menores conforme LOPIVI.',
          '- Base legal: Interés superior del menor y cumplimiento legal.',
          '- Conservación: Durante tramitación + 5 años.',
          '',
          '**Firma del comunicante:**',
          '',
          'Firma: ______________________________________  Fecha: _____________________',
          '',
          '(La firma confirma que la información proporcionada es veraz y objetiva)'
        ]
      },
      {
        titulo: 'Conclusión',
        contenido: [
          'Esta plantilla garantiza que todas las comunicaciones internas de incidentes se realicen de forma estructurada, completa y conforme a los protocolos de protección.',
          '',
          'Es fundamental que todo el personal conozca esta herramienta y la utilice ante cualquier preocupación, sin esperar certeza absoluta.',
          '',
          'Custodia360 facilita la gestión digital de estas comunicaciones, asegurando confidencialidad, trazabilidad y respuesta rápida.',
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
    console.log('💬 Generando Bloque 07: Comunicación y Participación (PDF + DOCX)...')

    const documentos = []

    // Generar cada uno de los 3 documentos
    for (let i = 0; i < documentosConfig.length; i++) {
      const config = documentosConfig[i]
      console.log(`${i + 1}/3 Generando: ${config.titulo}...`)

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

      const pdfPath = `plantillas/07_Comunicacion_y_Participacion/${config.filename}.pdf`
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

      const docxPath = `plantillas/07_Comunicacion_y_Participacion/${config.filename}.docx`
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

    console.log('✅ Todos los documentos del Bloque 07 generados')

    // Enviar email de confirmación
    console.log('📧 Enviando email de confirmación...')

    const emailHtml = `
      <h2>Bloque 07 — Comunicación y Participación Custodia360 creado correctamente</h2>
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
      <p><strong>Carpeta:</strong> <code>/docs/plantillas/07_Comunicacion_y_Participacion/</code></p>
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
        subject: 'Bloque 07 — Comunicación y Participación Custodia360 creado correctamente',
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
