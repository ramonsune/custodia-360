# 📖 MÓDULO GUÍA DE USO C360 - IMPLEMENTACIÓN

## ✅ ESTADO DE IMPLEMENTACIÓN

**Fecha:** 25 de Octubre 2025
**Módulo:** Sistema de Guía de uso C360 con ayuda contextual
**Status:** ✅ Código base creado - Requiere SQL execution y testing

---

## 📂 ARCHIVOS CREADOS

### 1. Base de Datos
```
✅ database/guide-system.sql (700+ líneas)
   - Tabla guides (3 guías por rol)
   - Tabla guide_sections (15 secciones totales, 5 por rol)
   - Tabla guide_anchors (mapeo de contextos UI)
   - RLS policies
   - Seed data completo con contenido profesional
```

### 2. API Endpoints
```
✅ src/app/api/guide/route.ts
   GET /api/guide?role={ENTIDAD|DELEGADO|SUPLENTE}

✅ src/app/api/guide/context/route.ts
   GET /api/guide/context?role={role}&ui_context={context}

✅ src/app/api/guide/support/route.ts
   POST - Enviar email a soporte via Resend
```

### 3. Utilidades
```
✅ src/lib/markdown-renderer.ts
   - renderMarkdown(): Conversión segura MD → HTML
   - extractPlainText(): Extracción para búsqueda
   - sanitizeText(): Prevención XSS

✅ src/lib/guide-pdf.ts
   - generateGuidePDF(): Generación PDF con jsPDF
   - Formato A4 profesional con portada
```

### 4. Componentes UI
```
✅ src/components/guide/GuideButton.tsx
   Botón "🛈 Guía de uso C360" para headers

✅ src/components/guide/ContextHelp.tsx
   Icono "🛈" contextual para secciones específicas

✅ src/components/guide/GuideSidebar.tsx (300+ líneas)
   - Sidebar completo con búsqueda
   - Accordion de secciones
   - Renderizado Markdown
   - Generación PDF
   - Formulario contacto soporte
```

---

## 📝 MODIFICACIONES PENDIENTES A PANELES

### Modificar headers de 3 paneles:

**1. Panel Entidad** (`src/app/dashboard-entidad/page.tsx`)
```tsx
// Añadir import
import { GuideButton } from '@/components/guide/GuideButton'

// En el header, añadir botón:
<GuideButton
  role="ENTIDAD"
  userEmail={sessionData?.email}
  userName={sessionData?.nombre}
  entidad={entidadData?.nombre}
  userId={sessionData?.id}
/>
```

**2. Panel Delegado** (`src/app/dashboard-delegado/page.tsx`)
```tsx
// Añadir import
import { GuideButton } from '@/components/guide/GuideButton'

// En el header, añadir botón:
<GuideButton
  role="DELEGADO"
  userEmail={sessionData?.email}
  userName={sessionData?.nombre}
  entidad={sessionData?.entidad}
  userId={sessionData?.id}
/>
```

**3. Panel Suplente** (`src/app/dashboard-suplente/page.tsx`)
```tsx
// Añadir import
import { GuideButton } from '@/components/guide/GuideButton'

// En el header, añadir botón:
<GuideButton
  role="SUPLENTE"
  userEmail={sessionData?.email}
  userName={sessionData?.nombre}
  entidad={sessionData?.entidad}
  userId={sessionData?.id}
/>
```

---

## 🔍 AYUDA CONTEXTUAL - EJEMPLOS DE USO

Para añadir ayuda contextual en cualquier sección:

```tsx
import { ContextHelp } from '@/components/guide/ContextHelp'

// En el botón o título de la sección:
<div className="flex items-center gap-2">
  <h2>Registrar Incidente</h2>
  <ContextHelp
    role="DELEGADO"
    uiContext="incidentes.create"
    userEmail={sessionData?.email}
    userName={sessionData?.nombre}
    entidad={sessionData?.entidad}
    userId={sessionData?.id}
    size="md"
  />
</div>
```

**Contextos UI mapeados:**
- `canal_seguro.view` → Sección "Panel" o "Actuaciones"
- `incidentes.list` → Sección "Panel"
- `incidentes.create` → Sección "Incidencias" (DELEGADO)
- `protocolos.view` → Sección "Panel"
- `documentos.view` → Sección "Responsabilidades" (ENTIDAD)
- `dashboard.view` → Primera sección de cada guía

---

## 🎨 CONTENIDO DE LAS GUÍAS

### GUÍA ENTIDAD (5 secciones)
1. **Responsabilidades principales**
2. **Cómo usar el panel de Entidad**
3. **Cómo actuar ante una sospecha**
4. **Teléfonos y contactos de emergencia**
5. **Soporte y formación**

### GUÍA DELEGADO (5 secciones)
1. **Tus responsabilidades**
2. **Uso del panel del Delegado**
3. **Qué hacer ante una incidencia** (detallado)
4. **Buenas prácticas de registro**
5. **Teléfonos de emergencia y referencias**

### GUÍA SUPLENTE (5 secciones)
1. **Alcance y activación de la suplencia**
2. **Uso del panel del Suplente** (permisos diferenciados)
3. **Actuación ante casos**
4. **Cierre de suplencia**
5. **Teléfonos y contactos**

---

## ⚙️ FUNCIONALIDADES DEL SIDEBAR

### Búsqueda
- Búsqueda local en títulos y contenido
- Filtrado en tiempo real
- Highlighting de resultados

### Accordion
- Secciones expandibles/colapsables
- Primera sección expandida por defecto
- Indicador visual de sección activa

### Renderizado Markdown
- Conversión segura MD → HTML
- Sanitización contra XSS
- Estilos Tailwind CSS
- Headers, listas, bold, links

### Generación PDF
- Formato A4 profesional
- Portada con título, versión, fecha
- Headers y footers en cada página
- Paginación automática
- Descarga directa al navegador

### Contacto Soporte
- Formulario modal
- Selección de tipo de consulta
- Email automático via Resend a `soporte@custodia360.es`
- Inclusión de metadatos: rol, entidad, user_id, ui_context
- Notificación de envío exitoso

---

## 📧 EMAIL ENVIADO A SOPORTE

**Asunto:** `[Guía C360] DELEGADO — Club Los Leones — Duda de uso`

**Contenido:**
```
Mensaje del usuario:
"Tengo dudas sobre cómo registrar un incidente..."

---
Metadatos del usuario:
- Rol: DELEGADO
- Entidad: Club Deportivo Los Leones
- Nombre: Juan Pérez
- Email: juan@ejemplo.com
- User ID: uuid-xxx
- Contexto UI: incidentes.create
- Tipo de consulta: Duda de uso
- Fecha y hora: 25/10/2025 14:30
```

---

## 🚀 PASOS PARA ACTIVAR EL SISTEMA

### 1️⃣ Ejecutar SQL en Supabase
```bash
# Copiar contenido de: database/guide-system.sql
# Pegar en: Supabase Dashboard → SQL Editor → Ejecutar
```

Verificar creación de tablas:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('guides', 'guide_sections', 'guide_anchors');
```

Verificar contenido seed:
```sql
SELECT role, title, version FROM guides;
SELECT COUNT(*) FROM guide_sections;
SELECT COUNT(*) FROM guide_anchors;
```

### 2️⃣ Añadir botones a los paneles

Modificar los 3 archivos indicados arriba:
- `src/app/dashboard-entidad/page.tsx`
- `src/app/dashboard-delegado/page.tsx`
- `src/app/dashboard-suplente/page.tsx`

### 3️⃣ Configurar email en Resend

Ya está configurado en el sistema, solo asegurarse de que:
- `RESEND_API_KEY` existe en `.env.local`
- Dominio `custodia360.com` verificado en Resend Dashboard
- Email `soporte@custodia360.es` existente y monitoreado

### 4️⃣ Probar funcionalidad

```bash
# Test endpoint de guía
curl http://localhost:3000/api/guide?role=DELEGADO

# Test ayuda contextual
curl "http://localhost:3000/api/guide/context?role=DELEGADO&ui_context=incidentes.create"
```

### 5️⃣ Testing completo

1. Abrir panel de Entidad → Click en "Guía de uso C360"
2. Verificar que se abre el sidebar
3. Probar búsqueda
4. Expandir/colapsar secciones
5. Descargar PDF
6. Enviar mensaje a soporte
7. Verificar email recibido en soporte@custodia360.es
8. Repetir en panel Delegado y Suplente

---

## 🔒 SEGURIDAD Y PERMISOS

### RLS Policies
- **Lectura pública** (anon/authenticated): ✅ Permitida
- **Escritura**: ❌ Solo service_role
- **No datos personales**: Contenido estático/ayuda

### Sanitización
- Markdown → HTML con escape de tags
- Prevención XSS en todos los renders
- Validación de inputs en formulario soporte

### Emails
- Reply-to configurado al email del usuario
- Metadatos incluidos para contexto
- Sin exposición de claves sensibles

---

## 📊 MÉTRICAS DEL MÓDULO

**Código generado:**
- 1 archivo SQL: ~700 líneas
- 3 endpoints API: ~300 líneas
- 2 utilidades: ~200 líneas
- 3 componentes UI: ~400 líneas
- **Total: ~1600 líneas de código nuevo**

**Archivos modificados:** 3 (headers de paneles)

**Base de datos:**
- 3 tablas nuevas
- 15 secciones de contenido (seed)
- ~8 anchors contextuales

---

## ✅ CHECKLIST FINAL

- [ ] SQL ejecutado en Supabase
- [ ] Tablas creadas y verificadas
- [ ] Seed data cargado
- [ ] Botones añadidos a los 3 paneles
- [ ] Dev server reiniciado
- [ ] Guía funciona en panel Entidad
- [ ] Guía funciona en panel Delegado
- [ ] Guía funciona en panel Suplente
- [ ] Búsqueda operativa
- [ ] PDF se descarga correctamente
- [ ] Email a soporte funciona
- [ ] Ayuda contextual probada
- [ ] Tests en producción

---

## 🐛 TROUBLESHOOTING

**Error: "Guía no encontrada"**
- Verificar que SQL se ejecutó correctamente
- Verificar que existen registros en tabla `guides`

**Error: "Error enviando email"**
- Verificar RESEND_API_KEY en .env
- Verificar dominio verificado en Resend
- Revisar logs en Resend Dashboard

**PDF no se descarga**
- Verificar que jsPDF está instalado: `bun add jspdf`
- Revisar console del navegador por errores

**Sidebar no se abre**
- Verificar imports de componentes
- Revisar estado `isOpen` en GuideButton
- Verificar z-index de sidebar (z-50)

---

## 📝 NOTAS ADICIONALES

- El sistema NO modifica funcionalidad existente de ningún panel
- La guía es 100% frontend + API
- No requiere cambios en tablas de usuarios/entidades existentes
- Puede ser desactivado simplemente removiendo los botones de los headers
- El contenido de las guías es editable desde Supabase (tabla `guide_sections`)

---

**¿Necesitas ayuda? Contacta con soporte en support@same.new**
