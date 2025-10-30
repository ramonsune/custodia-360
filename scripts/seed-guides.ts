/**
 * Seed Script: Guide Content for Custodia360
 * Populates guides, guide_sections, and guide_anchors tables
 *
 * Run with: bun run scripts/seed-guides.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Guide content structure
const guidesData = [
  {
    role: 'ENTIDAD',
    title: 'Guía de uso C360 — Entidad',
    version: 'v1.0',
    sections: [
      {
        order_index: 1,
        section_key: 'responsabilidades',
        section_title: '1. Tus responsabilidades principales',
        content_md: `
- **Garantizar cumplimiento LOPIVI** y designar Delegado de Protección.
- **Mantener activo el canal seguro** y los registros.
- **Asegurar formación anual del personal** (≥ 90%).
- **Aprobar y revisar Plan de Protección** y protocolos.

### Responsabilidades clave:
1. Designación de Delegado de Protección certificado
2. Activación y supervisión del canal seguro
3. Formación continua del equipo
4. Revisión anual de protocolos y planes
        `,
        anchors: [
          { ui_context: 'dashboard.compliance', anchor: '#responsabilidades' }
        ]
      },
      {
        order_index: 2,
        section_key: 'panel',
        section_title: '2. Cómo usar el panel de Entidad',
        content_md: `
### Dashboard
Visión general de cumplimiento y alertas importantes.

### Documentos
Descarga de políticas, planes y registros oficiales.

### Contratación
Módulos adicionales disponibles:
- Delegado suplente
- Kit de comunicación LOPIVI
- Auditorías externas

### Auditoría
Informes y planes de mejora (solo lectura si aplica).
        `,
        anchors: [
          { ui_context: 'dashboard.main', anchor: '#panel' },
          { ui_context: 'documentos.view', anchor: '#panel' }
        ]
      },
      {
        order_index: 3,
        section_key: 'actuaciones',
        section_title: '3. Cómo actuar ante una sospecha',
        content_md: `
## Protocolo de actuación inmediata:

1. **No interrogues al menor** - Solo escucha con empatía
2. **Registra hechos objetivos** - Fecha, hora, lugar, personas
3. **Comunica por el canal seguro** - Usa la plataforma oficial
4. **Si hay riesgo inmediato** - Llama al 112
5. **Informa al Delegado de Protección** - Coordinación necesaria

### ⚠️ Importante:
- Mantén la confidencialidad
- No investigues por tu cuenta
- Documenta todo
- Actúa con rapidez pero sin alarmar
        `,
        anchors: [
          { ui_context: 'canal_seguro.create', anchor: '#actuaciones' }
        ]
      },
      {
        order_index: 4,
        section_key: 'emergencias',
        section_title: '4. Teléfonos y contactos de emergencia',
        content_md: `
### Emergencias:
- **112** - Emergencias generales
- **091** - Policía Nacional
- **062** - Guardia Civil
- **900 20 20 10** - ANAR (Ayuda a Niños y Adolescentes en Riesgo)

### Soporte Custodia360:
- **Email**: soporte@custodia360.es
- **Horario**: L-V 9:00-18:00

### Servicios Sociales:
Consulta el directorio de servicios sociales de tu comunidad autónoma.
        `
      },
      {
        order_index: 5,
        section_key: 'dudas',
        section_title: '5. Soporte y formación',
        content_md: `
### Formación disponible:
- Temario base LOPIVI
- Plan anual de formación
- Sesiones de onboarding (primera vez)
- Webinars trimestrales

### Solicitar ayuda:
1. Consulta esta guía primero
2. Usa el botón "Contactar soporte"
3. Incluye contexto y capturas de pantalla si es posible

**Tiempo de respuesta**: 24-48 horas laborables
        `,
        anchors: [
          { ui_context: 'formacion.view', anchor: '#dudas' }
        ]
      }
    ]
  },
  {
    role: 'DELEGADO',
    title: 'Guía de uso C360 — Delegado principal',
    version: 'v1.0',
    sections: [
      {
        order_index: 1,
        section_key: 'responsabilidades',
        section_title: '1. Tus responsabilidades',
        content_md: `
Como **Delegado principal de Protección**, tus responsabilidades incluyen:

- **Implementar y supervisar** medidas de protección infantil
- **Gestionar el canal seguro** y resolver incidencias
- **Coordinar con Dirección** y autoridades cuando proceda
- **Mantener actualizados** planes, protocolos y registros

### Funciones clave:
1. Supervisión operativa diaria
2. Toma de decisiones en casos urgentes
3. Coordinación interinstitucional
4. Formación y sensibilización del equipo
        `,
        anchors: [
          { ui_context: 'dashboard.delegado', anchor: '#responsabilidades' }
        ]
      },
      {
        order_index: 2,
        section_key: 'panel',
        section_title: '2. Uso del panel del Delegado',
        content_md: `
### Canal seguro
- Leer mensajes entrantes
- Clasificar según urgencia
- Responder con protocolos establecidos
- Escalar casos críticos

### Incidentes
- Crear nuevos incidentes
- Actualizar estado y seguimiento
- Cerrar con informe final
- Adjuntar evidencias y documentación

### Protocolos y Documentos
- Consultar versiones oficiales
- Biblioteca LOPIVI completa
- Mapa de riesgos específico

### Formación
- Revisar estado del personal
- Marcar asistencias
- Generar certificados
        `,
        anchors: [
          { ui_context: 'canal_seguro.view', anchor: '#panel' },
          { ui_context: 'incidentes.list', anchor: '#panel' }
        ]
      },
      {
        order_index: 3,
        section_key: 'incidencias',
        section_title: '3. Qué hacer ante una incidencia',
        content_md: `
## Protocolo de gestión de incidencias:

### 1. Evaluación del riesgo
- **Riesgo ALTO**: Peligro inminente → 112 / 091 / 062
- **Riesgo MEDIO**: Situación preocupante → Seguimiento cercano
- **Riesgo BAJO**: Mejora preventiva → Protocolo estándar

### 2. Registro en el sistema
- Accede a "Incidentes" → "Crear nuevo"
- Completa todos los campos obligatorios
- Adjunta evidencias (fotos, documentos)
- Usa lenguaje objetivo y profesional

### 3. Activación de protocolos
- Consulta protocolo específico aplicable
- Coordina derivación si es necesario
- Informa a Dirección según gravedad

### 4. Seguimiento
- Actualiza el caso regularmente
- Documenta todas las acciones
- Cierra con informe completo
        `,
        anchors: [
          { ui_context: 'incidentes.create', anchor: '#incidencias' },
          { ui_context: 'incidentes.detail', anchor: '#incidencias' }
        ]
      },
      {
        order_index: 4,
        section_key: 'datos',
        section_title: '4. Buenas prácticas de registro',
        content_md: `
### Principios de protección de datos:
- **Minimiza datos personales**: Solo lo estrictamente necesario
- **Usa canales oficiales**: No WhatsApp personal, no email personal
- **Conserva evidencias**: No borres registros
- **Lenguaje profesional**: Claro, objetivo, sin juicios

### Qué SÍ registrar:
✅ Hechos objetivos (fecha, hora, lugar)
✅ Personas involucradas (sin datos sensibles innecesarios)
✅ Acciones tomadas
✅ Comunicaciones oficiales

### Qué NO registrar:
❌ Opiniones personales
❌ Especulaciones
❌ Datos médicos no relevantes
❌ Información de terceros no implicados
        `
      },
      {
        order_index: 5,
        section_key: 'emergencias',
        section_title: '5. Teléfonos de emergencia y referencias',
        content_md: `
### Emergencias inmediatas:
- **112** - Emergencias generales
- **091** - Policía Nacional
- **062** - Guardia Civil

### Servicios especializados:
- **900 20 20 10** - ANAR (Ayuda a la infancia)
- **016** - Violencia de género
- **Servicios Sociales** - Directorio autonómico

### Soporte Custodia360:
- **soporte@custodia360.es**
- Respuesta en 24-48h laborables
- Para urgencias técnicas: indicar en asunto

### Coordinación institucional:
- Fiscalía de Menores
- Juzgados de Familia
- Defensor del Menor (autonómico)
        `
      }
    ]
  },
  {
    role: 'SUPLENTE',
    title: 'Guía de uso C360 — Delegado suplente',
    version: 'v1.0',
    sections: [
      {
        order_index: 1,
        section_key: 'alcance',
        section_title: '1. Alcance y activación de la suplencia',
        content_md: `
### Condiciones de suplencia:
- **Activación SOLO con**:
  - Consentimiento de Dirección
  - Pago confirmado del módulo
  - Certificación LOPIVI vigente

### Características:
- Mismo panel visual que el Delegado principal
- **Permisos limitados** por backend
- Todas tus acciones quedan registradas como **modo suplencia**
- Trazabilidad completa

### Cuándo actúa el suplente:
1. Ausencia temporal del principal
2. Sobrecarga de casos
3. Cobertura de vacaciones
4. Emergencias que requieren segundo delegado
        `,
        anchors: [
          { ui_context: 'dashboard.suplente', anchor: '#alcance' }
        ]
      },
      {
        order_index: 2,
        section_key: 'panel',
        section_title: '2. Uso del panel del Suplente',
        content_md: `
### ✅ Funciones PERMITIDAS:

**Canal seguro**
- Leer mensajes
- Clasificar según urgencia
- Responder con protocolos
- Escalar casos

**Incidentes**
- Crear nuevos incidentes
- Actualizar casos existentes
- Cerrar con informe

**Protocolos y Documentos**
- Lectura completa
- Subir **versión de trabajo** (no sustituye oficial)

**Formación**
- Lectura de materiales
- Marcar asistencias

### ❌ Funciones RESTRINGIDAS:

- **Auditorías/Plan**: Solo lectura
- **Configuración**: Bloqueado
- **Usuarios**: Bloqueado
- **Facturación**: Bloqueado
- **Modificación de protocolos oficiales**: Bloqueado
        `,
        anchors: [
          { ui_context: 'canal_seguro.view', anchor: '#panel' }
        ]
      },
      {
        order_index: 3,
        section_key: 'casos',
        section_title: '3. Actuación ante casos',
        content_md: `
## Protocolo de actuación del suplente:

### 1. Sigue protocolos oficiales
- Consulta biblioteca LOPIVI
- Usa procedimientos establecidos
- No improvises

### 2. En emergencias
- **Riesgo inminente** → 112
- Registra INMEDIATAMENTE en Incidentes
- Notifica a Dirección
- Informa al Delegado principal

### 3. Coordinación
- Mantén informado al Delegado principal
- Documenta todas las acciones
- Usa canal oficial para comunicaciones

### 4. Trazabilidad
- Cada acción queda registrada
- Se identifica como "Delegado suplente"
- Genera informe al cierre de suplencia
        `,
        anchors: [
          { ui_context: 'incidentes.create', anchor: '#casos' }
        ]
      },
      {
        order_index: 4,
        section_key: 'cierre',
        section_title: '4. Cierre de suplencia',
        content_md: `
### Al finalizar la suplencia:

1. **Informe automático generado**:
   - Incidencias gestionadas
   - Actuaciones realizadas
   - Fechas y duración
   - Casos pendientes

2. **Notificaciones**:
   - Dirección recibe informe completo
   - Delegado principal recibe resumen
   - Archivo en sistema

3. **Traspaso**:
   - Casos abiertos vuelven al principal
   - Seguimiento garantizado
   - Continuidad asegurada

### Buenas prácticas:
- Deja notas claras en cada caso
- Actualiza estados antes de cerrar
- Comunica pendientes importantes
        `
      },
      {
        order_index: 5,
        section_key: 'emergencias',
        section_title: '5. Teléfonos y contactos',
        content_md: `
### Emergencias:
- **112** - Emergencias generales
- **091** - Policía Nacional
- **062** - Guardia Civil
- **900 20 20 10** - ANAR (Ayuda a la infancia)

### Soporte Custodia360:
- **soporte@custodia360.es**
- Indica "DELEGADO SUPLENTE" en asunto
- Respuesta en 24-48h laborables

### Coordinación:
- Mantén contacto con Delegado principal
- Informa a Dirección de casos críticos
- Usa solo canales oficiales
        `
      }
    ]
  }
]

async function seedGuides() {
  console.log('🌱 Starting guide seed process...\n')

  for (const guideData of guidesData) {
    console.log(`📘 Seeding guide for role: ${guideData.role}`)

    // Check if guide already exists
    const { data: existingGuide } = await supabase
      .from('guides')
      .select('id')
      .eq('role', guideData.role)
      .single()

    let guideId: string

    if (existingGuide) {
      console.log(`  ⚠️  Guide already exists, updating...`)
      const { data, error } = await supabase
        .from('guides')
        .update({
          title: guideData.title,
          version: guideData.version,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingGuide.id)
        .select()
        .single()

      if (error) {
        console.error(`  ❌ Error updating guide:`, error)
        continue
      }

      guideId = existingGuide.id

      // Delete existing sections
      await supabase
        .from('guide_sections')
        .delete()
        .eq('guide_id', guideId)

    } else {
      console.log(`  ✨ Creating new guide...`)
      const { data, error } = await supabase
        .from('guides')
        .insert({
          role: guideData.role,
          title: guideData.title,
          version: guideData.version
        })
        .select()
        .single()

      if (error) {
        console.error(`  ❌ Error creating guide:`, error)
        continue
      }

      guideId = data.id
    }

    console.log(`  ✅ Guide ID: ${guideId}`)

    // Insert sections
    for (const section of guideData.sections) {
      const { data: sectionData, error: sectionError } = await supabase
        .from('guide_sections')
        .insert({
          guide_id: guideId,
          order_index: section.order_index,
          section_key: section.section_key,
          section_title: section.section_title,
          content_md: section.content_md.trim()
        })
        .select()
        .single()

      if (sectionError) {
        console.error(`    ❌ Error creating section:`, sectionError)
        continue
      }

      console.log(`    ✅ Section: ${section.section_title}`)

      // Insert anchors if defined
      if (section.anchors && section.anchors.length > 0) {
        for (const anchor of section.anchors) {
          const { error: anchorError } = await supabase
            .from('guide_anchors')
            .insert({
              section_id: sectionData.id,
              ui_context: anchor.ui_context,
              anchor: anchor.anchor
            })

          if (anchorError) {
            console.error(`      ❌ Error creating anchor:`, anchorError)
          } else {
            console.log(`      🔗 Anchor: ${anchor.ui_context}`)
          }
        }
      }
    }

    console.log(`  ✅ Completed ${guideData.sections.length} sections\n`)
  }

  console.log('✅ Guide seeding completed!')
}

// Run seed
seedGuides()
  .then(() => {
    console.log('\n🎉 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  })
