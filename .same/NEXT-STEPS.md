# 🎯 PRÓXIMOS PASOS - Panel Delegado Unificado

## 📍 Estado Actual

**FASE 1 COMPLETADA:**
- ✅ Base de datos (12 tablas nuevas)
- ✅ 11 API endpoints funcionales
- ✅ Dashboard principal con KPIs
- ✅ Documentación completa

**FASE 2 PENDIENTE:**
- ⏳ 7 páginas UI
- ⏳ Componente modal Urgencia
- ⏳ Generación real de PDFs (puppeteer)
- ⏳ Testing integral

---

## 🚀 Implementar Próximamente (Orden Recomendado)

### 1. Página Comunicar `/panel/delegado/comunicar`

**Prioridad:** ALTA
**Tiempo estimado:** 3-4 horas

**Features:**
- [ ] Selector de alcance (radio buttons)
  - Individual (multiselect personas)
  - Por rol (dropdown: contacto/sin contacto/familias)
  - Toda la entidad
- [ ] Selector de canal (email / whatsapp)
- [ ] Selector de plantilla (dropdown desde `message_templates`)
- [ ] Previsualización con merge de {{placeholders}}
- [ ] Botón "Enviar"
- [ ] Sección "Historial" con tabla paginada
  - Filtros por fecha/plantilla/estado
  - Ver detalles de envío
  - Ver recipients y sus estados

**API Endpoints (YA CREADOS):**
- `POST /api/delegado/messages/compose`
- `GET /api/delegado/messages/history`

**Ejemplo código:**
```tsx
// Ver: .same/code-examples-comunicar.md
```

### 2. Página Controles `/panel/delegado/controles`

**Prioridad:** ALTA
**Tiempo estimado:** 4-5 horas

**Features:**
- [ ] Pestañas (Formación | Penales)
- [ ] Tabla virtualizada (react-virtual)
  - Nombre, Email, Estado, Fecha, Score (formación)
  - Nombre, Email, Entregado, Verificado, Fecha (penales)
- [ ] Filtros: estado, búsqueda
- [ ] Acciones masivas: "Enviar recordatorio a seleccionados"
- [ ] KPIs en cards arriba

**API Endpoints (YA CREADOS):**
- `GET /api/delegado/controles/overview`

**Nuevos endpoints necesarios:**
- `POST /api/delegado/penales/mark` - Marcar entregado/verificado

### 3. Página Implementación `/panel/delegado/implementacion`

**Prioridad:** MEDIA
**Tiempo estimado:** 3 horas

**Features:**
- [ ] Checklist con grupos (Obligatorios / Recomendados)
- [ ] Checkbox + título + descripción
- [ ] Estado: pendiente/en progreso/completado/no aplica
- [ ] Input para notas
- [ ] Botón "Guardar" por item
- [ ] Sugerencias: "Documentos relacionados" (links a plantillas PDF)

**API Endpoints (YA CREADOS):**
- `GET /api/delegado/implementacion/list`
- `POST /api/delegado/implementacion/update`

### 4. Página Miembros `/panel/delegado/miembros`

**Prioridad:** MEDIA
**Tiempo estimado:** 4 horas

**Features:**
- [ ] Tabla unificada virtualizada
  - Nombre, Rol, Email, Teléfono
  - Penales (Sí/No), Formación (Completado/Pendiente)
  - Última comunicación, Estado (ok/pendiente/vencido)
- [ ] Búsqueda por nombre/email
- [ ] Filtros: rol, estado
- [ ] Acciones por fila:
  - "Enviar mensaje"
  - "Compartir documento"
  - "Ver detalle" (modal)

**API Endpoints (YA CREADOS):**
- `GET /api/delegado/miembros/list`

### 5. Componente Modal Urgencia

**Prioridad:** ALTA (crítico para seguridad)
**Tiempo estimado:** 4-5 horas

**Features:**
- [ ] Botón fijo en navbar "⚠️ URGENCIA"
- [ ] Modal con:
  - Selector de tipo de urgencia (8 tipos precargados)
  - Descripción del tipo
  - Pasos guiados con checkboxes
  - Teléfonos de contacto relevantes (cards)
  - Input título y descripción del incidente
  - Botones: "Registrar", "Cerrar Incidente"
- [ ] Guarda en `urgent_incidents`
- [ ] Log en `action_logs`

**API Endpoints (YA CREADOS):**
- `GET /api/delegado/urgencia/setup`
- `POST /api/delegado/urgencia/open`
- `POST /api/delegado/urgencia/step`
- `POST /api/delegado/urgencia/close`

### 6. Página Documentos `/panel/delegado/documentos`

**Prioridad:** MEDIA
**Tiempo estimado:** 4 horas

**Features:**
- [ ] Lista de plantillas PDF (por sector)
- [ ] Botón "Generar" → auto-fill → descarga PDF
- [ ] Botón "Compartir" → selector de destinatarios → envío
- [ ] Historial de documentos generados

**API Endpoints (YA CREADOS):**
- `POST /api/delegado/docs/generate`

**Nuevos endpoints necesarios:**
- `POST /api/delegado/docs/share` - Compartir con personas

**Nota:** Generación real de PDF requiere puppeteer o similar

### 7. Página Inspección `/panel/delegado/inspeccion`

**Prioridad:** BAJA
**Tiempo estimado:** 3-4 horas

**Features:**
- [ ] Botón "Generar Informe de Cumplimiento"
- [ ] Inputs: fecha inicio, fecha fin
- [ ] Genera PDF con:
  - Datos de entidad
  - KPIs formación/penales
  - Estado implementación
  - Comunicaciones recientes
  - Documentación clave
- [ ] Guarda en `inspector_reports`
- [ ] Historial de informes (tabla)

**Nuevos endpoints necesarios:**
- `GET /api/delegado/inspeccion/report?entityId=...&save=true/false`

### 8. Biblioteca (Opcional - puede reusar existente)

**Prioridad:** BAJA
**Tiempo estimado:** 3 horas

Si no existe `/panel/delegado/biblioteca`:

**Features:**
- [ ] Upload documentos
- [ ] Lista de documentos
- [ ] Compartir por rol/individuo
- [ ] Enlaces firmados temporales (10 min)

---

## 📝 Plantillas de Código

### Estructura Base de Página

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SessionData {
  entityId: string
  user_id: string
  nombre: string
  entidad: string
}

export default function PaginaEjemplo() {
  const router = useRouter()
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const sessionData = localStorage.getItem('userSession')
    if (!sessionData) {
      router.push('/login')
      return
    }

    const parsed = JSON.parse(sessionData)
    setSession(parsed)
    loadData(parsed.entityId)
  }, [router])

  const loadData = async (entityId: string) => {
    try {
      const res = await fetch(`/api/delegado/ENDPOINT?entityId=${entityId}`)
      const data = await res.json()
      setData(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !session) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Título de la Página</h1>
          <p className="text-gray-600">{session.entidad}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Contenido</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Tu contenido aquí */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### Llamada a API con POST

```tsx
const handleAction = async () => {
  try {
    const res = await fetch('/api/delegado/ENDPOINT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entityId: session.entityId,
        userId: session.user_id,
        // ...otros parámetros
      }),
    })

    const data = await res.json()

    if (data.success) {
      alert('Éxito!')
      // Recargar datos
      loadData(session.entityId)
    } else {
      alert('Error: ' + data.error)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error de conexión')
  }
}
```

---

## 🧪 Testing Recomendado

### Por cada página implementada:

1. **Login como delegado**
2. **Navegar a la página**
3. **Verificar que se cargan datos**
4. **Probar cada acción**
5. **Verificar que se guardan cambios**
6. **Test con entidad de 10 miembros**
7. **Test con entidad de 100 miembros** (performance)
8. **Test mobile responsive**

### Tests de Integración:

- [ ] Enviar email desde Comunicar → verificar en message_jobs
- [ ] Marcar penal como entregado → verificar en Controles
- [ ] Completar item de implementación → verificar progreso en Dashboard
- [ ] Abrir urgencia → verificar en action_logs
- [ ] Generar documento → verificar en generated_pdfs

---

## 📚 Recursos Útiles

### Librerías Recomendadas:

```bash
# Virtualización para tablas grandes
bun add react-virtual

# Fetching con cache
bun add swr

# Formularios
bun add react-hook-form zod

# PDF generation (server-side)
bun add puppeteer
```

### Documentación:

- shadcn/ui: https://ui.shadcn.com/
- React Virtual: https://tanstack.com/virtual/latest
- SWR: https://swr.vercel.app/
- Puppeteer: https://pptr.dev/

### Archivos de Referencia:

- `.same/delegado-panel-unified.md` - Visión general
- `.same/panel-delegado-deployment.md` - Guía de deployment
- `supabase/migrations/20250112_delegado_panel_unified.sql` - Schema BD
- `src/app/panel/delegado/page.tsx` - Dashboard ejemplo
- `src/app/api/delegado/**/*.ts` - Todos los endpoints

---

## 🐛 Debugging Tips

### Si no se cargan datos:

1. Verificar que la migration se ejecutó
2. Verificar que existen datos en las tablas
3. Verificar entityId en sesión
4. Verificar response del endpoint en Network tab

### Si los endpoints fallan:

1. Verificar env vars (SUPABASE_SERVICE_ROLE_KEY)
2. Verificar CORS si es desde cliente
3. Verificar logs de servidor
4. Verificar que la tabla existe y tiene columnas correctas

---

**¡Éxito en la implementación!** 🚀
