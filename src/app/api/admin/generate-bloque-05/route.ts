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

// Configuraciones de los 6 registros y formularios del Bloque 05
const documentosConfig = [
  {
    filename: 'Formulario_Comunicacion_Preocupacion',
    titulo: 'Formulario de Comunicación de Preocupación',
    subtitulo: 'Modelo para notificación de sospechas o inquietudes',
    version: '1.0',
    secciones: [
      {
        titulo: 'Instrucciones de Uso',
        contenido: [
          'Este formulario permite a cualquier persona (personal, voluntariado, familias, terceros) notificar una preocupación relacionada con la seguridad o bienestar de un menor.',
          '',
          '**Cuándo usar este formulario:**',
          '- Al observar señales de riesgo o malestar en un menor.',
          '- Al recibir una revelación directa o indirecta.',
          '- Al identificar situaciones potencialmente peligrosas.',
          '- Ante cualquier duda o inquietud que afecte a la protección infantil.',
          '',
          '**Confidencialidad:**',
          'La información proporcionada se tratará con máxima confidencialidad y solo será compartida con las personas autorizadas según los protocolos de protección.'
        ]
      },
      {
        titulo: 'DATOS DEL COMUNICANTE',
        contenido: [
          'Nombre y apellidos: _________________________________________________________',
          '',
          'Cargo o relación con la entidad: ____________________________________________',
          '',
          'Teléfono de contacto: _______________________________________________________',
          '',
          'Email: _____________________________________________________________________',
          '',
          'Fecha de esta comunicación: _________________________________________________',
          '',
          '☐ Deseo mantener el anonimato (marcar si aplica)'
        ]
      },
      {
        titulo: 'DATOS DEL MENOR INVOLUCRADO',
        contenido: [
          '(Completar solo si se conoce y es relevante)',
          '',
          'Nombre del menor o iniciales: _______________________________________________',
          '',
          'Edad aproximada: ___________________________________________________________',
          '',
          'Actividad o grupo al que pertenece: _________________________________________',
          '',
          'Otros datos relevantes: _____________________________________________________',
          '',
          '_____________________________________________________________________________'
        ]
      },
      {
        titulo: 'DESCRIPCIÓN DE LA PREOCUPACIÓN',
        contenido: [
          '**Fecha y hora del hecho o situación observada:**',
          '',
          '_____________________________________________________________________________',
          '',
          '**Lugar donde ocurrió:**',
          '',
          '_____________________________________________________________________________',
          '',
          '**Descripción objetiva de lo observado:**',
          '',
          '(Describir hechos, no opiniones ni interpretaciones. Usar palabras textuales si el menor comunicó algo)',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Personas presentes o testigos:**',
          '',
          '_____________________________________________________________________________',
          '',
          '**Frecuencia o antecedentes:**',
          '',
          '☐ Primera vez que se observa',
          '☐ Ya había ocurrido antes',
          '☐ Es una situación recurrente',
          '',
          'Detalles: ___________________________________________________________________',
          '',
          '_____________________________________________________________________________'
        ]
      },
      {
        titulo: 'ACCIONES INMEDIATAS ADOPTADAS',
        contenido: [
          '(Si se tomó alguna medida antes de completar este formulario)',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Comunicación a otras personas:**',
          '',
          '☐ Responsable de Protección',
          '☐ Dirección',
          '☐ Familia del menor',
          '☐ Otros: ___________________________________________________________________'
        ]
      },
      {
        titulo: 'DECLARACIÓN Y FIRMA',
        contenido: [
          'Declaro que la información proporcionada en este formulario es veraz y se realiza con la intención de proteger el bienestar del menor.',
          '',
          '',
          'Firma: _____________________________________________________________________',
          '',
          'Fecha: _____________________________________________________________________',
          '',
          '',
          '⚠️ **IMPORTANTE:**',
          '',
          'Este formulario debe entregarse directamente al Responsable de Protección o registrarse digitalmente en la plataforma Custodia360.',
          '',
          'Plazo: Inmediato. En situaciones de riesgo grave: comunicación verbal urgente, este formulario después.',
          '',
          '**Protección del comunicante:**',
          'La entidad garantiza que no habrá represalias por realizar comunicaciones de buena fe.'
        ]
      }
    ]
  },
  {
    filename: 'Registro_Incidentes_Actuaciones',
    titulo: 'Registro de Incidentes y Actuaciones',
    subtitulo: 'Control centralizado de situaciones y respuestas',
    version: '1.0',
    secciones: [
      {
        titulo: 'Instrucciones',
        contenido: [
          'Este registro documenta todos los incidentes relacionados con la protección de menores y las actuaciones realizadas.',
          '',
          '**Objetivo:**',
          '- Mantener trazabilidad completa.',
          '- Facilitar el seguimiento de casos.',
          '- Permitir análisis de tendencias.',
          '- Generar evidencias para auditorías.',
          '',
          '**Responsable:**',
          'El Responsable de Protección mantiene actualizado este registro.',
          '',
          '**Confidencialidad:**',
          'Acceso restringido a personas autorizadas. Conservación: 5 años mínimo.'
        ]
      },
      {
        titulo: 'TABLA DE REGISTRO',
        contenido: [
          '| Nº | Fecha | Tipo incidente | Descripción resumida | Nivel riesgo | Responsable | Medidas adoptadas | Fecha cierre |',
          '|----|-------|----------------|----------------------|--------------|-------------|-------------------|--------------|',
          '| 001 | | | | | | | |',
          '| 002 | | | | | | | |',
          '| 003 | | | | | | | |',
          '| 004 | | | | | | | |',
          '| 005 | | | | | | | |',
          '',
          '[Continuar según necesidad...]'
        ]
      },
      {
        titulo: 'Clasificación de Incidentes',
        contenido: [
          '**Nivel LEVE:**',
          '- Sin daño directo al menor.',
          '- Medidas preventivas aplicadas internamente.',
          '- No requiere derivación externa.',
          '- Ejemplo: Conflicto menor entre pares, resuelto con mediación.',
          '',
          '**Nivel MODERADO:**',
          '- Riesgo controlado con actuación interna reforzada.',
          '- Seguimiento específico necesario.',
          '- Posible comunicación a familias.',
          '- Ejemplo: Conducta inapropiada de un adulto, amonestado y supervisado.',
          '',
          '**Nivel GRAVE:**',
          '- Requiere intervención externa (Servicios Sociales, Autoridades).',
          '- Riesgo significativo para el menor.',
          '- Medidas urgentes implementadas.',
          '- Ejemplo: Sospecha fundada de maltrato, derivado a Servicios Sociales.'
        ]
      },
      {
        titulo: 'Observaciones Generales',
        contenido: [
          'Espacio para anotaciones adicionales, patrones identificados o recomendaciones:',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Revisión periódica:**',
          'Este registro se revisa trimestralmente por el Responsable de Protección y anualmente por la Dirección.',
          '',
          '**Registro digital:**',
          'Custodia360 ofrece registro digital automático con alertas, plazos y seguimiento integrado.'
        ]
      },
      {
        titulo: 'Indicadores de Seguimiento',
        contenido: [
          '**Métricas anuales:**',
          '',
          '- Total de incidentes registrados: _________',
          '- Incidentes leves: _________ (%)',
          '- Incidentes moderados: _________ (%)',
          '- Incidentes graves: _________ (%)',
          '',
          '- Tiempo medio de resolución: _________ días',
          '- Casos derivados a servicios externos: _________',
          '- Casos cerrados satisfactoriamente: _________ (%)',
          '',
          '**Tendencias identificadas:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Acciones de mejora implementadas:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________'
        ]
      }
    ]
  },
  {
    filename: 'Registro_Formacion_Personal',
    titulo: 'Registro de Formación del Personal',
    subtitulo: 'Control de capacitación en protección infantil',
    version: '1.0',
    secciones: [
      {
        titulo: 'Objetivo del Registro',
        contenido: [
          'Documentar todas las acciones formativas en materia de protección infantil y LOPIVI realizadas por el personal de la entidad.',
          '',
          '**Finalidad:**',
          '- Cumplir con la obligación legal de formación continua.',
          '- Evidenciar el nivel de capacitación del equipo.',
          '- Planificar futuras formaciones según necesidades detectadas.',
          '- Generar certificados de formación.',
          '',
          '**Responsable:**',
          'Responsable de Protección en coordinación con RRHH/Dirección.',
          '',
          '**Frecuencia:**',
          'Actualización continua tras cada formación.'
        ]
      },
      {
        titulo: 'TABLA DE REGISTRO DE FORMACIÓN',
        contenido: [
          '| Nº | Nombre y apellidos | Cargo/Rol | Formación recibida | Fecha | Duración (h) | Formador | Resultado | Firma |',
          '|----|--------------------|-----------|-------------------|--------|--------------|----------|-----------|-------|',
          '| 001 | | | | | | | | |',
          '| 002 | | | | | | | | |',
          '| 003 | | | | | | | | |',
          '| 004 | | | | | | | | |',
          '| 005 | | | | | | | | |',
          '',
          '[Añadir filas según necesidad...]'
        ]
      },
      {
        titulo: 'Tipos de Formación',
        contenido: [
          '**Formación inicial obligatoria:**',
          '- Marco legal LOPIVI.',
          '- Código de conducta de la entidad.',
          '- Protocolos de actuación.',
          '- Detección de señales de riesgo.',
          '- Duración mínima: 8 horas.',
          '',
          '**Formación continua anual:**',
          '- Actualización normativa.',
          '- Nuevos riesgos (ciberacoso, grooming).',
          '- Casos prácticos y simulaciones.',
          '- Duración mínima: 4 horas/año.',
          '',
          '**Formación especializada:**',
          '- Para Responsable de Protección: 20+ horas.',
          '- Para personal de alto contacto: 12+ horas.',
          '- Certificaciones externas reconocidas.'
        ]
      },
      {
        titulo: 'Indicadores de Cumplimiento',
        contenido: [
          '**Objetivo general:**',
          '≥ 90% del personal formado anualmente.',
          '',
          '**Cálculo de indicadores:**',
          '',
          '- Personal total: _________',
          '- Personal formado en el año: _________',
          '- % Personal formado: _________ %',
          '',
          '- Total horas formativas impartidas: _________',
          '- Media horas/persona: _________',
          '',
          '- Formaciones planificadas pendientes: _________',
          '- Fecha próxima formación: _________',
          '',
          '**Evidencias adjuntas:**',
          '',
          '☐ Certificados de formación',
          '☐ Listados de asistencia',
          '☐ Evaluaciones de conocimientos',
          '☐ Material formativo utilizado',
          '',
          '**Conservación:**',
          'Custodia360 recomienda digitalizar y conservar certificados durante toda la relación laboral + 5 años.'
        ]
      },
      {
        titulo: 'Observaciones',
        contenido: [
          'Espacio para anotaciones sobre formaciones, necesidades detectadas o planificación futura:',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Necesidades formativas identificadas:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Próximas formaciones programadas:**',
          '',
          '- Fecha: _________ | Tema: ________________________________________',
          '- Fecha: _________ | Tema: ________________________________________',
          '- Fecha: _________ | Tema: ________________________________________'
        ]
      }
    ]
  },
  {
    filename: 'Registro_Autorizaciones_Familias',
    titulo: 'Registro de Autorizaciones de Familias',
    subtitulo: 'Consentimientos informados para actividades y tratamientos',
    version: '1.0',
    secciones: [
      {
        titulo: 'Finalidad del Registro',
        contenido: [
          'Este documento recopila los consentimientos informados de las familias para:',
          '- Participación en actividades específicas.',
          '- Uso de imagen del menor.',
          '- Administración de medicación.',
          '- Otras autorizaciones necesarias.',
          '',
          '**Principios:**',
          '- Consentimiento libre, específico e informado.',
          '- Derecho de revocación en cualquier momento.',
          '- Conservación segura y confidencial.',
          '- Cumplimiento RGPD/LOPDGDD.'
        ]
      },
      {
        titulo: '1. AUTORIZACIÓN DE SALIDA/ACTIVIDAD',
        contenido: [
          'Datos del menor: ___________________________________________________________',
          '',
          'Nombre de la actividad: _____________________________________________________',
          '',
          'Fecha de la actividad: ______________________________________________________',
          '',
          'Lugar: _____________________________________________________________________',
          '',
          'Horario: De _________ a _________',
          '',
          'Responsable/s acompañante/s: ________________________________________________',
          '',
          '_____________________________________________________________________________',
          '',
          'Descripción de la actividad:',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          'Riesgos identificados y medidas de seguridad:',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '☑ Autorizo la participación de mi hijo/a en la actividad descrita.',
          '☑ He recibido información completa sobre la actividad.',
          '☑ Confirmo que mi hijo/a puede realizar la actividad (salud, alergias).',
          '',
          'Firma madre/padre/tutor legal: ______________________________________________',
          '',
          'Fecha: _____________________________________________________________________'
        ]
      },
      {
        titulo: '2. AUTORIZACIÓN DE USO DE IMAGEN',
        contenido: [
          'Menor: _____________________________________________________________________',
          '',
          'La entidad solicita autorización para captar y utilizar imágenes (fotos/vídeos) del menor con las siguientes finalidades:',
          '',
          '☐ Memoria de actividades (uso interno)',
          '☐ Publicación en web/redes sociales de la entidad',
          '☐ Material promocional/educativo',
          '☐ Otros: __________________________________________________________________',
          '',
          '**Condiciones:**',
          '- Las imágenes no incluirán datos personales completos (nombre/apellidos).',
          '- Se utilizarán exclusivamente para los fines autorizados.',
          '- La familia puede revocar este consentimiento en cualquier momento.',
          '',
          '**DECISIÓN:**',
          '',
          '☐ AUTORIZO el uso de imágenes según lo descrito.',
          '☐ NO AUTORIZO el uso de imágenes de mi hijo/a.',
          '',
          'Firma: _____________________________________________________________________',
          '',
          'Fecha: _____________________________________________________________________',
          '',
          '**Revocación (si aplica):**',
          '',
          'Fecha de revocación: _______________________________________________________',
          '',
          'Firma: _____________________________________________________________________'
        ]
      },
      {
        titulo: '3. AUTORIZACIÓN DE MEDICACIÓN',
        contenido: [
          '(Solo si el menor requiere administración de medicación durante actividades)',
          '',
          'Menor: _____________________________________________________________________',
          '',
          'Medicamento: _______________________________________________________________',
          '',
          'Dosis y frecuencia: _________________________________________________________',
          '',
          'Vía de administración: ______________________________________________________',
          '',
          'Motivo/patología: ___________________________________________________________',
          '',
          'Alergias conocidas: _________________________________________________________',
          '',
          'Médico prescriptor y teléfono: ______________________________________________',
          '',
          '**AUTORIZACIÓN:**',
          '',
          '☑ Autorizo al personal designado a administrar la medicación indicada.',
          '☑ Adjunto prescripción médica y medicamento etiquetado.',
          '☑ Me comprometo a informar de cualquier cambio en el tratamiento.',
          '',
          '**Instrucciones especiales:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          'Firma madre/padre/tutor legal: ______________________________________________',
          '',
          'Fecha: _____________________________________________________________________',
          '',
          '**Registro de administración:**',
          '',
          '| Fecha | Hora | Dosis | Responsable | Observaciones | Firma |',
          '|-------|------|-------|-------------|---------------|-------|',
          '| | | | | | |'
        ]
      },
      {
        titulo: 'Observaciones y Notas',
        contenido: [
          '⚠️ **IMPORTANTE:**',
          '',
          'Custodia360 recomienda digitalizar todas las autorizaciones mediante su módulo de consentimientos informados para:',
          '',
          '- Facilitar el acceso y consulta.',
          '- Mantener trazabilidad de revocaciones.',
          '- Generar alertas de vencimientos.',
          '- Cumplir con obligaciones de protección de datos.',
          '',
          '**Conservación:**',
          'Conservar durante la participación del menor + 3 años.',
          '',
          '**Revocación:**',
          'Las familias pueden revocar cualquier autorización comunicándolo por escrito al Responsable de Protección.'
        ]
      }
    ]
  },
  {
    filename: 'Registro_Antecedentes_Personal',
    titulo: 'Registro de Antecedentes y Verificación del Personal',
    subtitulo: 'Control de certificados y verificaciones legales',
    version: '1.0',
    secciones: [
      {
        titulo: 'Objetivo del Registro',
        contenido: [
          'Documentar el cumplimiento de la obligación legal de verificar antecedentes penales del personal que trabaja con menores.',
          '',
          '**Base legal:**',
          'Ley Orgánica 8/2021 (LOPIVI) y legislación anterior: Certificado negativo del Registro Central de Delincuentes Sexuales obligatorio.',
          '',
          '**Alcance:**',
          '- Todo el personal laboral.',
          '- Voluntariado habitual.',
          '- Colaboradores con contacto regular con menores.',
          '- Proveedores de servicios con acceso a menores.',
          '',
          '**Responsable:**',
          'Responsable de Protección en coordinación con RRHH.'
        ]
      },
      {
        titulo: 'TABLA DE REGISTRO',
        contenido: [
          '| Nº | Nombre y apellidos | DNI/NIE | Puesto/función | Cert. delitos sexuales | Fecha expedición | Fecha verificación | Vigencia | Observaciones | Firma responsable |',
          '|----|--------------------|---------|----------------|------------------------|------------------|--------------------|----------|---------------|-------------------|',
          '| 001 | | | | ☑ Sí / ☐ No | | | | | |',
          '| 002 | | | | ☑ Sí / ☐ No | | | | | |',
          '| 003 | | | | ☑ Sí / ☐ No | | | | | |',
          '| 004 | | | | ☑ Sí / ☐ No | | | | | |',
          '| 005 | | | | ☑ Sí / ☐ No | | | | | |',
          '',
          '[Continuar según número de personas...]'
        ]
      },
      {
        titulo: 'Procedimiento de Verificación',
        contenido: [
          '**Paso 1: Solicitud del certificado**',
          '',
          'El trabajador/voluntario solicita el certificado al Ministerio de Justicia:',
          '- Presencialmente en Gerencias Territoriales.',
          '- Online con certificado digital.',
          '- Plazo de emisión: generalmente 24-48 horas.',
          '',
          '**Paso 2: Entrega y verificación**',
          '',
          'El trabajador entrega el certificado original o copia compulsada.',
          'RRHH/Responsable de Protección verifica:',
          '- Identidad del solicitante.',
          '- Fecha de expedición (no superior a 3 meses).',
          '- Que no consten antecedentes.',
          '',
          '**Paso 3: Registro**',
          '',
          'Anotar en esta tabla los datos de verificación.',
          'Conservar copia del certificado en el expediente personal.',
          '',
          '**Paso 4: Actualización periódica**',
          '',
          'Renovación obligatoria:',
          '- Cada 5 años para personal fijo.',
          '- Anualmente para voluntariado y colaboradores puntuales.',
          '- Ante cualquier cambio de funciones.',
          '',
          '**Paso 5: Control de vencimientos**',
          '',
          'Custodia360 genera alertas automáticas 60 días antes del vencimiento.'
        ]
      },
      {
        titulo: 'Otras Verificaciones',
        contenido: [
          '**Referencias profesionales:**',
          '',
          '- Verificar al menos 2 referencias antes de la contratación.',
          '- Contactar con empleadores anteriores.',
          '- Documentar las verificaciones realizadas.',
          '',
          '**Entrevistas de selección:**',
          '',
          '- Incluir preguntas sobre protección infantil.',
          '- Evaluar comprensión de límites apropiados.',
          '- Verificar motivación para trabajar con menores.',
          '',
          '**Periodo de prueba supervisado:**',
          '',
          '- Supervisión reforzada durante primeros 3 meses.',
          '- Evaluación específica en protección infantil.',
          '- Feedback de compañeros y superiores.'
        ]
      },
      {
        titulo: 'Observaciones y Control',
        contenido: [
          '**Frecuencia de actualización:**',
          'Anual o ante nuevas incorporaciones.',
          '',
          '**Indicadores de cumplimiento:**',
          '',
          '- Personal total con contacto con menores: _________',
          '- Personal con certificado vigente: _________',
          '- % Cumplimiento (objetivo 100%): _________ %',
          '',
          '- Certificados próximos a vencer (60 días): _________',
          '- Renovaciones pendientes: _________',
          '',
          '**Incidencias:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Acciones correctivas:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Confidencialidad:**',
          'Este registro contiene datos especialmente protegidos. Acceso restringido a RRHH y Responsable de Protección.',
          '',
          '**Conservación:**',
          'Durante la relación laboral + 5 años (obligaciones legales).'
        ]
      }
    ]
  },
  {
    filename: 'Registro_Evaluacion_Anual',
    titulo: 'Registro de Evaluación Anual del Plan de Protección',
    subtitulo: 'Auditoría interna de cumplimiento LOPIVI',
    version: '1.0',
    secciones: [
      {
        titulo: 'Datos de la Evaluación',
        contenido: [
          'Nombre de la entidad: _______________________________________________________',
          '',
          'CIF: _______________________________________________________________________',
          '',
          'Responsable de la evaluación: _______________________________________________',
          '',
          'Cargo: _____________________________________________________________________',
          '',
          'Fecha de la evaluación: _____________________________________________________',
          '',
          'Periodo evaluado: De _________________ a _________________',
          '',
          'Versión del Plan de Protección evaluado: ___________________________________'
        ]
      },
      {
        titulo: 'CRITERIOS DE EVALUACIÓN',
        contenido: [
          '| Aspecto evaluado | Cumple (Sí/No/Parcial) | Observaciones / Evidencias |',
          '|------------------|------------------------|----------------------------|',
          '| **1. Documentación** | | |',
          '| Política de Protección actualizada | | |',
          '| Código de Conducta publicado | | |',
          '| Plan de Protección vigente | | |',
          '| Protocolos de actuación accesibles | | |',
          '| **2. Responsables** | | |',
          '| Delegado/a Principal designado | | |',
          '| Delegado/a Suplente designado | | |',
          '| Funciones claramente definidas | | |',
          '| Formación específica recibida | | |',
          '| **3. Formación** | | |',
          '| Formación inicial impartida | | |',
          '| Formación continua anual realizada | | |',
          '| % Personal formado ≥ 90% | | |',
          '| Certificados archivados | | |',
          '| **4. Comunicación** | | |',
          '| Canal seguro activo y conocido | | |',
          '| Familias informadas del sistema | | |',
          '| Menores conocen sus derechos | | |',
          '| Información visible en instalaciones | | |',
          '| **5. Verificaciones** | | |',
          '| Certificados de antecedentes actualizados | | |',
          '| Referencias verificadas | | |',
          '| Nuevas incorporaciones chequeadas | | |',
          '| **6. Registros** | | |',
          '| Registro de incidentes completo | | |',
          '| Registro de formaciones actualizado | | |',
          '| Autorizaciones de familias archivadas | | |',
          '| Evaluaciones anuales conservadas | | |',
          '| **7. Protocolos** | | |',
          '| Protocolo detección aplicado | | |',
          '| Protocolo urgencias conocido | | |',
          '| Coordinación con servicios externos | | |',
          '| **8. Mejora continua** | | |',
          '| Análisis de riesgos actualizado | | |',
          '| Medidas preventivas implementadas | | |',
          '| Incidentes revisados y lecciones aprendidas | | |',
          '| Sistema Custodia360 activo | | |'
        ]
      },
      {
        titulo: 'RESULTADOS Y CONCLUSIONES',
        contenido: [
          '**Nivel de cumplimiento global:**',
          '',
          '- Total ítems evaluados: _________',
          '- Ítems cumplidos: _________',
          '- Ítems cumplidos parcialmente: _________',
          '- Ítems no cumplidos: _________',
          '',
          '**Porcentaje de cumplimiento: _________ %**',
          '',
          '**Clasificación:**',
          '',
          '☐ Excelente (≥ 95%)',
          '☐ Bueno (85-94%)',
          '☐ Suficiente (70-84%)',
          '☐ Insuficiente (< 70%)',
          '',
          '**Principales fortalezas identificadas:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '**Áreas de mejora detectadas:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________'
        ]
      },
      {
        titulo: 'PLAN DE ACCIÓN',
        contenido: [
          '**Medidas de mejora a implementar:**',
          '',
          '| Nº | Acción | Responsable | Plazo | Recursos necesarios | Estado |',
          '|----|--------|-------------|-------|---------------------|--------|',
          '| 1 | | | | | |',
          '| 2 | | | | | |',
          '| 3 | | | | | |',
          '| 4 | | | | | |',
          '| 5 | | | | | |',
          '',
          '**Seguimiento:**',
          '',
          'Próxima revisión intermedia: ________________________________________________',
          '',
          'Próxima evaluación anual completa: __________________________________________',
          '',
          '**Cambios necesarios en el Plan de Protección:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________'
        ]
      },
      {
        titulo: 'FIRMAS Y VALIDACIÓN',
        contenido: [
          '**Responsable de Protección:**',
          '',
          'Nombre: ____________________________________________________________________',
          '',
          'Firma: _____________________________________________________________________',
          '',
          'Fecha: _____________________________________________________________________',
          '',
          '',
          '**Director/a de la Entidad:**',
          '',
          'Nombre: ____________________________________________________________________',
          '',
          'Firma: _____________________________________________________________________',
          '',
          'Fecha: _____________________________________________________________________',
          '',
          '',
          '**Observaciones finales:**',
          '',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '_____________________________________________________________________________',
          '',
          '',
          '⚠️ **RECOMENDACIÓN:**',
          '',
          'Custodia360 recomienda realizar esta evaluación cada 12 meses como mínimo, o tras cualquier incidente grave o cambio normativo significativo.',
          '',
          'La plataforma Custodia360 automatiza gran parte de esta evaluación mediante dashboards en tiempo real y generación automática de informes de cumplimiento.'
        ]
      }
    ]
  }
]

export async function POST() {
  try {
    console.log('📝 Generando Bloque 05: Registros y Formularios (PDF + DOCX)...')

    const documentos = []

    // Generar cada uno de los 6 registros/formularios
    for (let i = 0; i < documentosConfig.length; i++) {
      const config = documentosConfig[i]
      console.log(`${i + 1}/6 Generando: ${config.titulo}...`)

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

      const pdfPath = `plantillas/05_Registros_y_Formularios/${config.filename}.pdf`
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

      const docxPath = `plantillas/05_Registros_y_Formularios/${config.filename}.docx`
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

    console.log('✅ Todos los registros del Bloque 05 generados')

    // Enviar email de confirmación
    console.log('📧 Enviando email de confirmación...')

    const emailHtml = `
      <h2>Bloque 05 — Registros y Formularios Custodia360 creado correctamente</h2>
      <p>Se han generado y publicado correctamente los siguientes registros y formularios oficiales en el panel de administración Custodia360:</p>
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Registro/Formulario</th>
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
      <p><strong>Nota:</strong> Los documentos DOCX incluyen tablas editables y campos para completar.</p>
      <p><strong>Carpeta:</strong> <code>/docs/plantillas/05_Registros_y_Formularios/</code></p>
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
        subject: 'Bloque 05 — Registros y Formularios Custodia360 creado correctamente',
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
