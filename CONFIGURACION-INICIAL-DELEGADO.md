# 🎯 Sistema de Configuración Inicial Obligatoria del Delegado

**Fecha de implementación:** 19 de octubre de 2025
**Modo:** Consolidación (limpieza previa + creación desde cero)

---

## 📋 Resumen Ejecutivo

Sistema que **fuerza** al delegado a completar una configuración inicial de 4 pasos antes de acceder a su panel de gestión, garantizando cumplimiento LOPIVI desde el primer minuto.

---

## ✅ Archivos Implementados

### Nuevos (3)
- `src/app/api/delegado/config/init/route.ts` - API de configuración
- `src/app/delegado/configuracion-inicial/page.tsx` - Wizard de 4 pasos
- `src/components/dashboard/AvisoConfigInicial.tsx` - Banner de avisos

### Eliminados (3)
- ❌ `src/app/configuracion-delegado/page.tsx`
- ❌ `src/app/delegado-setup/page.tsx`
- ❌ `src/app/dashboard-delegado/configuracion/page.tsx`

---

## 🔄 Flujo del Sistema

### 1. Post-Certificación
```
Certificado LOPIVI → Botón "Ir al Panel" → /delegado/configuracion-inicial
```

### 2. Wizard de 4 Pasos

| Paso | Descripción | Obligatorio | Posponible |
|------|-------------|-------------|------------|
| 1 | Canal de comunicación | No | 30 días |
| 2 | Token de miembros | ✅ Sí | No |
| 3 | Mapa de riesgos | ✅ Sí | No |
| 4 | Certificado penales | No | 30 días |

### 3. Acceso al Panel
- **Permitido:** Si pasos 2 y 3 completados
- **Con avisos:** Si pasos 1 o 4 pospuestos (deadline 30 días)
- **Bloqueado:** Si deadline vencida y pasos pendientes

---

## 🎨 Detalles de Cada Paso

### Paso 1: Canal de Comunicación

**Objetivo:** Definir email o teléfono para recibir comunicaciones de casos.

**Campos:**
- Tipo: `email` o `telefono`
- Valor: email válido o teléfono

**Acciones:**
- `set_channel` → Guarda en `entities` (canal_tipo, canal_valor) + marca `channel_done=true`
- `postpone_channel` → Marca `channel_postponed=true` + establece `deadline_at` + encola email

**Persistencia:**
```sql
UPDATE entities SET canal_tipo = ?, canal_valor = ? WHERE id = ?
UPDATE entity_compliance SET channel_done = true WHERE entity_id = ?
```

---

### Paso 2: Token de Miembros

**Objetivo:** Generar link único para que personal, familias y directiva se registren.

**Acción:**
- `gen_token` → Genera token único + inserta en `entity_invite_tokens`

**Persistencia:**
```sql
INSERT INTO entity_invite_tokens (entity_id, token, status, deadline_at)
VALUES (?, ?, 'active', NOW() + INTERVAL '30 days')
ON CONFLICT (entity_id) DO UPDATE SET token = EXCLUDED.token
```

**URL generada:**
```
https://www.custodia360.es/onboarding/{token}
```

**Obligatorio:** Sí (no puede finalizar wizard sin esto)

---

### Paso 3: Mapa de Riesgos

**Objetivo:** Revisar el mapa de riesgos específico del sector de la entidad.

**Acción:**
- Descarga PDF del mapa de riesgos
- Click en "He leído y entiendo" → marca `riskmap_done=true`

**Persistencia:**
```sql
UPDATE entity_compliance
SET riskmap_done = true, riskmap_acknowledged_at = NOW()
WHERE entity_id = ?
```

**Obligatorio:** Sí (no puede finalizar wizard sin esto)

---

### Paso 4: Certificado de Penales

**Objetivo:** Confirmar entrega del certificado negativo de delitos sexuales.

**Acciones:**
- `set_penales` → Marca `penales_done=true`
- `postpone_penales` → Marca `penales_postponed=true` + deadline + email

**Persistencia:**
```sql
UPDATE entity_compliance
SET penales_done = true, penales_entregado_at = NOW()
WHERE entity_id = ?
```

**Posponible:** Sí (30 días)

---

## 📧 Emails Automáticos

| Acción | Plantilla | Destinatario | Contenido |
|--------|-----------|--------------|-----------|
| Posponer canal | `onboarding-delay` | Delegado | Recordatorio completar canal antes de 30 días |
| Posponer penales | `onboarding-delay` | Delegado | Recordatorio entregar certificado |
| Configurar canal | `channel-verify` | Delegado | Confirmación de canal configurado |
| Deadline vencida | `compliance-blocked` | Delegado | Aviso de bloqueo por no completar |

**Encolado en:**
```sql
INSERT INTO message_jobs (entity_id, template_slug, channel, context, status, scheduled_at)
VALUES (?, ?, 'email', ?, 'queued', NOW())
```

---

## ⏰ Sistema de Plazos

### Cálculo de Deadline

```javascript
const deadline30Days = new Date()
deadline30Days.setDate(deadline30Days.getDate() + 30)
```

### Cron Jobs (ya existentes)

**`c360_compliance_guard`** (diario 07:00 UTC):
- Verifica entidades con `deadline_at` vencida
- Si `channel_postponed=true` y `channel_done=false` → `blocked=true`
- Si `penales_postponed=true` y `penales_done=false` → `blocked=true`
- Encola email `compliance-blocked`

**`c360_mailer_dispatch`** (cada 10 min):
- Envía emails encolados en `message_jobs`

### Recordatorios

- **7 días antes:** Email recordatorio (implementar en cron onboarding_guard)
- **Día 30:** Bloqueo automático si no completó

---

## 🛡️ Guards de Ruta

### Guard Principal (pendiente integrar)

**En layout o middleware de `/dashboard-delegado`:**

```typescript
// Verificar si requiere configuración inicial
const { data: compliance } = await supabase
  .from('entity_compliance')
  .select('riskmap_done, blocked, deadline_at')
  .eq('entity_id', entity_id)
  .single()

const { data: token } = await supabase
  .from('entity_invite_tokens')
  .select('token')
  .eq('entity_id', entity_id)
  .maybeSingle()

// Redirigir si falta configuración obligatoria
if (!compliance?.riskmap_done || !token?.token) {
  redirect('/delegado/configuracion-inicial')
}

// Redirigir si está bloqueada
if (compliance?.blocked) {
  redirect('/delegado/configuracion-inicial')
}

// Verificar deadline vencida
if (compliance?.deadline_at) {
  const deadline = new Date(compliance.deadline_at)
  if (deadline < new Date()) {
    // Verificar si hay pendientes
    if (compliance.channel_postponed && !compliance.channel_done) {
      redirect('/delegado/configuracion-inicial')
    }
    if (compliance.penales_postponed && !compliance.penales_done) {
      redirect('/delegado/configuracion-inicial')
    }
  }
}
```

---

## 🎨 Banner de Avisos

### Integración (pendiente)

**En `dashboard-delegado/page.tsx`:**

```tsx
import AvisoConfigInicial from '@/components/dashboard/AvisoConfigInicial'

export default function DashboardDelegado() {
  const entity_id = "..." // Obtener del session

  return (
    <div>
      <AvisoConfigInicial entity_id={entity_id} />
      {/* ... resto del dashboard ... */}
    </div>
  )
}
```

### Comportamiento

**Si deadline > 0 días:**
- Banner ámbar con icono ⏰
- "Quedan X días para completar: [Canal/Penales]"
- Botón "Completar ahora"

**Si deadline ≤ 0 días:**
- Banner rojo con icono 🚨
- "Plazo vencido - Acción requerida"
- Redirige automáticamente al wizard

---

## 🧪 Testing

### 1. Flujo Completo

```bash
# 1. Certificarse como delegado
# 2. Click "Ir al Panel" → debe redirigir a /delegado/configuracion-inicial
# 3. Completar paso 2 (generar token)
# 4. Completar paso 3 (ack mapa)
# 5. Posponer paso 1 (canal) y paso 4 (penales)
# 6. Click "Entrar al Panel" → debe permitir acceso
# 7. Ver banners de avisos en dashboard
```

### 2. Verificar Deadline

```bash
# Simular día 30 (actualizar deadline_at en BD):
UPDATE entity_compliance
SET deadline_at = NOW() - INTERVAL '1 day'
WHERE entity_id = 'test-entity-id'

# Ejecutar cron guard manualmente o esperar a ejecución automática
# Verificar que blocked = true
# Verificar email de bloqueo en message_jobs
```

### 3. Verificar Emails

```sql
SELECT * FROM message_jobs
WHERE entity_id = 'test-entity-id'
ORDER BY created_at DESC
LIMIT 10;
```

---

## 📊 Schema de BD

### entity_compliance (campos usados)

```sql
channel_done BOOLEAN DEFAULT false
channel_postponed BOOLEAN DEFAULT false
riskmap_done BOOLEAN DEFAULT false
riskmap_acknowledged_at TIMESTAMPTZ
penales_done BOOLEAN DEFAULT false
penales_postponed BOOLEAN DEFAULT false
penales_entregado_at TIMESTAMPTZ
deadline_at TIMESTAMPTZ
blocked BOOLEAN DEFAULT false
updated_at TIMESTAMPTZ
```

### entities (campos usados)

```sql
canal_tipo TEXT
canal_valor TEXT
sector_code TEXT
```

### entity_invite_tokens

```sql
id UUID PRIMARY KEY
entity_id UUID REFERENCES entities(id)
token TEXT UNIQUE
status TEXT DEFAULT 'active'
created_at TIMESTAMPTZ
deadline_at TIMESTAMPTZ
```

---

## 🔗 Integraciones Pendientes

### 1. Actualizar Botón de Certificación

**Archivo:** `src/app/panel/delegado/formacion/certifica/page.tsx` (o similar)

**Cambio:**
```tsx
// Antes:
<Link href="/dashboard-delegado">Ir al Panel</Link>

// Después:
<Link href="/delegado/configuracion-inicial">Ir al Panel</Link>
```

### 2. Añadir Guard en Dashboard

**Archivo:** Layout o middleware del dashboard delegado

**Código:** Ver sección "Guards de Ruta" arriba

### 3. Integrar Banner de Avisos

**Archivo:** `src/app/dashboard-delegado/page.tsx`

**Código:** Ver sección "Banner de Avisos" arriba

---

## ✅ Checklist de Implementación

- [x] Eliminar código anterior de setup/config delegado
- [x] Crear API `/api/delegado/config/init`
- [x] Crear wizard `/delegado/configuracion-inicial`
- [x] Crear componente `AvisoConfigInicial`
- [x] Documentar sistema completo
- [ ] **Integrar guard de ruta en dashboard**
- [ ] **Integrar banner en dashboard**
- [ ] **Actualizar botón de certificación**
- [ ] **Probar flujo completo E2E**
- [ ] **Verificar cron compliance_guard**
- [ ] **Verificar emails encolados**

---

## 🎯 Próximos Pasos

1. **Integrar guard de ruta** en el dashboard del delegado
2. **Integrar banner de avisos** en la vista principal
3. **Actualizar botón de certificación** para redirigir al wizard
4. **Testing E2E** del flujo completo
5. **Verificar cron jobs** tras 24h de operación

---

_Sistema implementado en Modo Consolidación - Sin tocar flujos existentes_
_Fecha: 19 de octubre de 2025_
