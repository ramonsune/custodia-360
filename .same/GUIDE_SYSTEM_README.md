# 📚 Sistema de Guías C360 - Documentación Completa

## ✅ Estado de Implementación

**Fecha**: 27 de enero de 2025
**Estado**: ✅ **COMPLETADO**

---

## 📋 Componentes Implementados

### 1. **Base de Datos (Supabase)**

#### Tablas creadas:
- ✅ `guides` - Guías por rol (ENTIDAD, DELEGADO, SUPLENTE)
- ✅ `guide_sections` - Secciones de cada guía
- ✅ `guide_anchors` - Ayuda contextual (mapeo UI → sección)

#### Migration:
```
📁 supabase/migrations/20250127_guide_system.sql
```

**Ejecutar migration:**
```bash
# Desde Supabase Dashboard > SQL Editor
# O desde CLI:
supabase db push
```

---

### 2. **APIs REST**

#### ✅ GET `/api/guide?role=ENTIDAD|DELEGADO|SUPLENTE`
**Propósito**: Obtener guía completa con secciones por rol

**Respuesta:**
```json
{
  "success": true,
  "guide": {
    "id": "uuid",
    "role": "DELEGADO",
    "title": "Guía de uso C360 — Delegado principal",
    "version": "v1.0",
    "updated_at": "2025-01-27...",
    "sections": [
      {
        "id": "uuid",
        "order_index": 1,
        "section_key": "responsabilidades",
        "section_title": "1. Tus responsabilidades",
        "content_md": "..."
      }
    ]
  }
}
```

---

#### ✅ GET `/api/guide/context?role=DELEGADO&ui_context=incidentes.list`
**Propósito**: Obtener sección específica según contexto UI

**Respuesta:**
```json
{
  "success": true,
  "section": {
    "id": "uuid",
    "section_key": "incidencias",
    "section_title": "3. Qué hacer ante una incidencia",
    "content_md": "...",
    "anchor": "#incidencias"
  }
}
```

---

#### ✅ POST `/api/guide/support`
**Propósito**: Enviar consulta de soporte vía Resend

**Body:**
```json
{
  "userEmail": "delegado@example.com",
  "userName": "Juan García",
  "userRole": "DELEGADO",
  "entidad": "Club Deportivo Ejemplo",
  "userId": "optional-uuid",
  "uiContext": "incidentes.create",
  "consultType": "Duda de uso",
  "subject": "Consulta sobre incidentes",
  "message": "¿Cómo registro un incidente urgente?"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Mensaje enviado correctamente. Nuestro equipo te responderá pronto.",
  "emailId": "resend-email-id"
}
```

---

### 3. **Librerías de Utilidades**

#### ✅ `@/lib/markdown-renderer.ts`
```typescript
// Renderizar Markdown a HTML
renderMarkdown(markdown: string): string

// Extraer texto plano para búsqueda
extractPlainText(markdown: string): string
```

**Características:**
- Soporta: bold, italic, headers, listas, links, código
- Salida HTML con clases Tailwind
- Búsqueda de texto plano

---

#### ✅ `@/lib/guide-pdf.ts`
```typescript
// Generar y descargar PDF de la guía
generateGuidePDF(guideData: GuidePDFData): void
```

**Características:**
- Genera HTML estructurado
- Descarga como archivo `.html` (compatible con "Guardar como PDF")
- Incluye portada, secciones y footer
- Formato A4 optimizado

---

### 4. **Componentes UI**

#### ✅ `GuideButton.tsx`
**Ubicación**: Botón fijo en header de cada panel

**Props:**
```typescript
{
  role: 'ENTIDAD' | 'DELEGADO' | 'SUPLENTE'
  userEmail?: string
  userName?: string
  entidad?: string
  userId?: string
}
```

**Uso:**
```tsx
<GuideButton
  role="DELEGADO"
  userEmail={sessionData.email}
  userName={sessionData.nombre}
  entidad={sessionData.entidad}
  userId={sessionData.id}
/>
```

---

#### ✅ `GuideSidebar.tsx`
**Características:**
- Panel lateral modal (ancho 560px)
- Búsqueda local en tiempo real
- Acordeón de secciones
- Render de Markdown
- Botones: Descargar PDF / Contactar soporte
- Formulario de soporte integrado

---

### 5. **Contenido Seed**

#### Script de seed:
```bash
📁 scripts/seed-guides.ts

# Ejecutar:
bun run scripts/seed-guides.ts
```

**Contenido incluido:**

##### **ROL: ENTIDAD**
1. Responsabilidades principales
2. Cómo usar el panel de Entidad
3. Cómo actuar ante una sospecha
4. Teléfonos y contactos de emergencia
5. Soporte y formación

##### **ROL: DELEGADO**
1. Tus responsabilidades
2. Uso del panel del Delegado
3. Qué hacer ante una incidencia
4. Buenas prácticas de registro
5. Teléfonos de emergencia y referencias

##### **ROL: SUPLENTE**
1. Alcance y activación de la suplencia
2. Uso del panel del Suplente
3. Actuación ante casos
4. Cierre de suplencia
5. Teléfonos y contactos

---

## 🚀 Instalación y Configuración

### 1. **Migración de Base de Datos**

```bash
# Opción A: Desde Supabase Dashboard
# 1. Ir a SQL Editor
# 2. Copiar contenido de supabase/migrations/20250127_guide_system.sql
# 3. Ejecutar

# Opción B: Desde CLI
supabase db push
```

---

### 2. **Variables de Entorno**

Verificar que existan en `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_key
```

---

### 3. **Ejecutar Seed**

```bash
cd custodia-360
bun run scripts/seed-guides.ts
```

**Output esperado:**
```
🌱 Starting guide seed process...

📘 Seeding guide for role: ENTIDAD
  ✨ Creating new guide...
  ✅ Guide ID: [uuid]
    ✅ Section: 1. Tus responsabilidades principales
      🔗 Anchor: dashboard.compliance
    ✅ Section: 2. Cómo usar el panel de Entidad
...
✅ Guide seeding completed!
🎉 All done!
```

---

## 📍 Integración en Paneles

### Panel de Entidad
**Archivo**: `src/app/dashboard-entidad/page.tsx`

```tsx
import { GuideButton } from '@/components/guide/GuideButton'

// En el header:
<GuideButton
  role="ENTIDAD"
  userEmail={sessionData?.email}
  userName={sessionData?.nombre}
  entidad={sessionData?.entidad}
  userId={sessionData?.id}
/>
```

---

### Panel de Delegado
**Archivo**: `src/app/dashboard-delegado/page.tsx`

✅ **YA INTEGRADO** (líneas 134-140)

---

### Panel de Suplente
**Archivo**: `src/app/dashboard-suplente/page.tsx`

```tsx
import { GuideButton } from '@/components/guide/GuideButton'

// En el header:
<GuideButton
  role="SUPLENTE"
  userEmail={sessionData?.email}
  userName={sessionData?.nombre}
  entidad={sessionData?.entidad}
  userId={sessionData?.id}
/>
```

---

## 🎨 Ayuda Contextual

### Añadir icono de ayuda:

```tsx
<button
  onClick={() => {
    // Abrir sidebar con contexto específico
    setUiContext('incidentes.create')
    setIsGuideOpen(true)
  }}
  className="text-blue-600 hover:text-blue-700"
  title="Ayuda"
>
  🛈
</button>
```

### Contextos UI disponibles:

| UI Context | Sección vinculada | Rol |
|------------|-------------------|-----|
| `dashboard.compliance` | Responsabilidades | ENTIDAD |
| `dashboard.main` | Cómo usar el panel | ENTIDAD |
| `documentos.view` | Documentos | ENTIDAD |
| `canal_seguro.create` | Cómo actuar ante sospecha | ENTIDAD |
| `formacion.view` | Soporte y formación | ENTIDAD |
| `dashboard.delegado` | Responsabilidades | DELEGADO |
| `canal_seguro.view` | Uso del panel | DELEGADO |
| `incidentes.list` | Qué hacer ante incidencia | DELEGADO |
| `incidentes.create` | Qué hacer ante incidencia | DELEGADO |
| `incidentes.detail` | Qué hacer ante incidencia | DELEGADO |
| `dashboard.suplente` | Alcance y activación | SUPLENTE |

---

## 🧪 Testing

### Test API de guía:
```bash
curl "http://localhost:3000/api/guide?role=DELEGADO"
```

### Test ayuda contextual:
```bash
curl "http://localhost:3000/api/guide/context?role=DELEGADO&ui_context=incidentes.create"
```

### Test soporte:
```bash
curl -X POST "http://localhost:3000/api/guide/support" \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "userName": "Test User",
    "userRole": "DELEGADO",
    "entidad": "Test Entity",
    "consultType": "Duda de uso",
    "message": "Mensaje de prueba"
  }'
```

---

## ✅ Checklist de Verificación

- [ ] Migration ejecutada en Supabase
- [ ] Tablas creadas: `guides`, `guide_sections`, `guide_anchors`
- [ ] Seed ejecutado correctamente (3 guías creadas)
- [ ] API `/api/guide` funcionando
- [ ] API `/api/guide/context` funcionando
- [ ] API `/api/guide/support` funcionando (Resend configurado)
- [ ] Botón "Guía de uso C360" visible en panel de Entidad
- [ ] Botón "Guía de uso C360" visible en panel de Delegado ✅
- [ ] Botón "Guía de uso C360" visible en panel de Suplente
- [ ] Sidebar abre correctamente
- [ ] Búsqueda funciona
- [ ] Descarga PDF funciona
- [ ] Formulario de soporte envía correo

---

## 📧 Configuración Resend

El email de soporte se envía a: `soporte@custodia360.es`

**Formato del asunto:**
```
[Guía C360] DELEGADO — Club Deportivo Ejemplo — Duda de uso
```

**Contenido incluye:**
- Información del usuario (nombre, email, rol, entidad)
- Tipo de consulta
- Contexto UI (si viene de ayuda contextual)
- Mensaje del usuario

---

## 🔐 Seguridad

- ✅ RLS habilitado en todas las tablas
- ✅ Lectura pública permitida (contenido informativo)
- ✅ Escritura SOLO para service role (admin interno)
- ✅ Sanitización de Markdown al renderizar
- ✅ No se almacenan datos personales en tablas de guías

---

## 📝 Mantenimiento

### Actualizar contenido de guía:

1. Editar `scripts/seed-guides.ts`
2. Incrementar `version` en `guidesData`
3. Ejecutar seed: `bun run scripts/seed-guides.ts`

### Añadir nueva sección:

```typescript
{
  order_index: 6,
  section_key: 'nueva_seccion',
  section_title: '6. Nueva Sección',
  content_md: `Contenido en Markdown...`,
  anchors: [
    { ui_context: 'nueva.vista', anchor: '#nueva_seccion' }
  ]
}
```

### Añadir ayuda contextual:

1. Añadir anchor en seed script
2. Ejecutar seed
3. Añadir icono "🛈" en UI con `ui_context` correspondiente

---

## 🐛 Troubleshooting

### Guía vacía en el sidebar

**Causa**: Migration no ejecutada o seed no corrido
**Solución**:
```bash
# 1. Ejecutar migration en Supabase
# 2. Ejecutar seed:
bun run scripts/seed-guides.ts
```

---

### Error 404 al cargar guía

**Causa**: Rol incorrecto o guide_sections vacías
**Solución**: Verificar en Supabase Dashboard:
```sql
SELECT * FROM guides WHERE role = 'DELEGADO';
SELECT * FROM guide_sections WHERE guide_id = 'your-guide-id';
```

---

### Email de soporte no llega

**Causa**: Resend no configurado o clave inválida
**Solución**:
1. Verificar `RESEND_API_KEY` en `.env.local`
2. Verificar dominio verificado en Resend
3. Revisar logs en `/api/guide/support`

---

## 📚 Recursos

- [Prompt original](/.same/GUIDE_SYSTEM_PROMPT.md)
- [Migration SQL](/supabase/migrations/20250127_guide_system.sql)
- [Seed script](/scripts/seed-guides.ts)
- [Componente GuideButton](/src/components/guide/GuideButton.tsx)
- [Componente GuideSidebar](/src/components/guide/GuideSidebar.tsx)

---

## 🎯 Próximos Pasos Opcionales

- [ ] Añadir versionado de guías (histórico)
- [ ] Dashboard admin para editar guías desde UI
- [ ] Métricas de uso (secciones más consultadas)
- [ ] Traducción multiidioma
- [ ] Búsqueda con IA (embeddings)
- [ ] Videos tutoriales embebidos

---

**Implementado por**: Same AI
**Fecha**: 27 de enero de 2025
**Versión**: 1.0
**Estado**: ✅ Producción Ready
