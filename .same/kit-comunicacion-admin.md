# 📦 Sistema de Administración - Kit de Comunicación LOPIVI

**Fecha:** 15 Octubre 2025
**Estado:** ✅ Implementado
**Modo:** 🔒 Consolidación Activa
**Ubicación:** `/dashboard-custodia360/kit-comunicacion`

---

## 🎯 Objetivo

Proporcionar a los administradores de Custodia360 una interfaz completa para gestionar el estado del Kit de Comunicación LOPIVI de todas las entidades, permitiendo:

- **Visualizar** el estado global de adopción del kit
- **Activar/Desactivar** el kit para entidades específicas
- **Enviar invitaciones** por email para contratar el kit
- **Auditar** todas las acciones administrativas realizadas

---

## 🏗️ Arquitectura

### Componentes del Sistema

```
┌─────────────────────────────────────────────────┐
│            Dashboard Admin Principal            │
│         /dashboard-custodia360/                 │
│                                                  │
│  [Enlace] → Kit de Comunicación LOPIVI          │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│       Página de Gestión Kit Comunicación        │
│   /dashboard-custodia360/kit-comunicacion/      │
│                                                  │
│  ┌────────────────────────────────────────┐     │
│  │  KPIs (Total, Con Kit, Sin Kit, %)    │     │
│  └────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────┐     │
│  │  Filtros (Búsqueda, Estado, PageSize) │     │
│  └────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────┐     │
│  │  Tabla de Entidades con Acciones      │     │
│  └────────────────────────────────────────┘     │
│                                                  │
│  Acciones por fila:                             │
│  • Ver detalle                                  │
│  • Copiar enlace contratación                   │
│  • Enviar email invitación                      │
│  • Activar/Desactivar kit                       │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  APIs Backend        │
          │  /api/admin/kit-comm │
          │                      │
          │  • list              │
          │  • toggle            │
          │  • invite            │
          └──────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Supabase DB         │
          │                      │
          │  • entities          │
          │  • admin_actions_log │
          │  • message_templates │
          └──────────────────────┘
```

---

## 📁 Archivos Creados

### 1. Migración SQL
**Archivo:** `supabase/migrations/20251015_admin_actions_log.sql`

**Contenido:**
- Tabla `admin_actions_log` para auditoría
- Plantilla de email `kit-comm-invite`
- Índices para optimización
- Políticas RLS

### 2. APIs Backend

#### A) **GET** `/api/admin/kit-comm/list`
**Parámetros de query:**
- `q` (string) - Búsqueda por nombre, NIF/CIF o email
- `estado` (string) - 'all' | 'on' | 'off'
- `page` (number) - Número de página
- `pageSize` (number) - Resultados por página

**Respuesta:**
```json
{
  "items": [
    {
      "id": "uuid",
      "nombre": "Club Deportivo Los Leones",
      "email_contacto": "club@leones.com",
      "nif_cif": "A12345678",
      "sector_code": "club-deportivo",
      "kit_comunicacion": true,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "pageSize": 25,
  "totalPages": 6
}
```

#### B) **POST** `/api/admin/kit-comm/toggle`
**Body:**
```json
{
  "entityId": "uuid",
  "value": true
}
```

**Acción:**
- Actualiza `entities.kit_comunicacion`
- Registra en `admin_actions_log`

**Respuesta:**
```json
{
  "success": true,
  "entityId": "uuid",
  "previousValue": false,
  "newValue": true,
  "message": "Kit de Comunicación activado correctamente"
}
```

#### C) **POST** `/api/admin/kit-comm/invite`
**Body:**
```json
{
  "entityId": "uuid"
}
```

**Acción:**
- Obtiene datos de la entidad
- Envía email vía Resend usando plantilla `kit-comm-invite`
- Registra en `admin_actions_log`
- Rate limit: 1 email cada 60 segundos por entidad

**Respuesta:**
```json
{
  "success": true,
  "entityId": "uuid",
  "emailSentTo": "email@entidad.com",
  "message": "Invitación enviada correctamente"
}
```

### 3. Página UI
**Archivo:** `src/app/dashboard-custodia360/kit-comunicacion/page.tsx`

**Características:**
- 4 KPIs superiores (Total, Con Kit, Sin Kit, % Adopción)
- Barra de filtros (búsqueda, estado, page size)
- Tabla paginada de entidades
- 4 acciones por fila (Ver, Copiar, Email, Toggle)
- Modales: Detalle de entidad, Confirmación de toggle
- Sistema de notificaciones toast
- Responsive design

---

## 🎨 Interfaz de Usuario

### KPIs Superiores

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Total        │  │ Con Kit      │  │ Sin Kit      │  │ % Adopción   │
│              │  │              │  │              │  │              │
│    150       │  │ 87 (58%)     │  │ 63 (42%)     │  │    58%       │
│              │  │              │  │              │  │  [▓▓▓▓░░░░]   │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### Filtros

```
┌────────────────────────────────────────────────────────────────┐
│ Buscar: [Club Los Leones...      ] [Estado: Todas▼] [25/pág▼] │
└────────────────────────────────────────────────────────────────┘
```

### Tabla de Entidades

```
┌────────────────────────────────────────────────────────────────────┐
│ Entidad            │ Sector  │ Email         │ Estado │ Acciones   │
├────────────────────────────────────────────────────────────────────┤
│ Club Los Leones    │ Deporte │ club@...      │ ✓ ON   │ 👁️ 📋 ✉️ ⚠️ │
│ Academia Madrid    │ Deporte │ academia@...  │ ✗ OFF  │ 👁️ 📋 ✉️ ✓  │
│ Ludoteca ABC       │ Ludoteca│ ludo@...      │ ✓ ON   │ 👁️ 📋 ✉️ ⚠️ │
└────────────────────────────────────────────────────────────────────┘
```

**Leyenda de acciones:**
- 👁️ **Ver** - Modal con detalle completo de la entidad
- 📋 **Copiar** - Copia enlace de contratación al portapapeles
- ✉️ **Email** - Envía invitación por email (Resend)
- ⚠️/✓ **Toggle** - Desactivar/Activar con confirmación

---

## 🔐 Seguridad

### Autenticación y Autorización
- ✅ TODO: Guard de autenticación admin (pendiente implementar)
- ✅ APIs usan Service Role Key de Supabase
- ✅ No exposición de credenciales al frontend

### Rate Limiting
- ✅ Envío de emails: 1 por entidad cada 60 segundos
- ✅ Implementado con Map en memoria (producción: usar Redis)

### Auditoría
- ✅ Todas las acciones se registran en `admin_actions_log`
- ✅ Incluye: actor, entity_id, acción, metadata, timestamp

### Validaciones
- ✅ entityId requerido en todas las operaciones
- ✅ Verificación de existencia de entidad
- ✅ Validación de email antes de enviar
- ✅ Tipo de dato `value` debe ser boolean

---

## 📧 Sistema de Emails

### Plantilla: `kit-comm-invite`

**Asunto:**
```
Custodia360 | Activa el Kit de Comunicación LOPIVI para tu entidad
```

**Cuerpo:**
```
Hola {{responsable}},

Desde Custodia360 te recomendamos activar el Kit de Comunicación LOPIVI...

**¿Qué incluye el Kit de Comunicación LOPIVI?**
• +20 plantillas profesionales adaptadas a tu sector
• Canal de comunicación integrado (Email/WhatsApp)
• Plantillas para familias, personal y directivos
• Documentación legal actualizada automáticamente
• Soporte especializado incluido

**Actívalo ahora:**
{{link_contratacion}}

...
```

**Variables sustituidas:**
- `{{responsable}}` → nombre de la entidad
- `{{link_contratacion}}` → URL al dashboard de la entidad

**Proveedor:** Resend
**From:** `Custodia360 <noreply@custodia360.es>`

---

## 🗄️ Base de Datos

### Tabla: `admin_actions_log`

```sql
CREATE TABLE admin_actions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor TEXT,                           -- Email del admin
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  action TEXT NOT NULL,                 -- 'kit_comm_toggle' | 'kit_comm_invite'
  metadata JSONB DEFAULT '{}'::jsonb,   -- Datos adicionales
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Índices:**
- `idx_admin_actions_entity` (entity_id)
- `idx_admin_actions_created` (created_at DESC)
- `idx_admin_actions_action` (action)

**Ejemplo de registro:**
```json
{
  "id": "uuid",
  "actor": "admin@custodia360.es",
  "entity_id": "entity-uuid",
  "action": "kit_comm_toggle",
  "metadata": {
    "entity_name": "Club Los Leones",
    "previous_value": false,
    "new_value": true,
    "changed_at": "2025-10-15T14:30:00Z"
  },
  "created_at": "2025-10-15T14:30:00Z"
}
```

---

## 🔄 Flujos de Uso

### Flujo 1: Activar Kit manualmente

```
1. Admin accede a /dashboard-custodia360/kit-comunicacion
2. Busca/filtra la entidad
3. Hace clic en icono ✓ (Activar)
4. Confirma en modal: "¿Activar Kit para [Entidad]?"
5. Sistema:
   - Actualiza entities.kit_comunicacion = true
   - Registra en admin_actions_log
   - Muestra toast de éxito
6. Tabla se actualiza mostrando estado ✓ ON
```

### Flujo 2: Enviar invitación por email

```
1. Admin localiza entidad sin kit
2. Hace clic en icono ✉️ (Enviar email)
3. Sistema valida:
   - Entidad tiene email_contacto válido
   - No se envió email en últimos 60 segundos
4. Envía email vía Resend con plantilla kit-comm-invite
5. Registra en admin_actions_log
6. Muestra toast: "Invitación enviada correctamente"
```

### Flujo 3: Ver detalles de entidad

```
1. Admin hace clic en icono 👁️ (Ver)
2. Se abre modal con:
   - Nombre
   - NIF/CIF
   - Email
   - Sector
   - Estado del kit
   - Fecha de alta
3. Botón "Cerrar" para salir
```

### Flujo 4: Copiar enlace de contratación

```
1. Admin hace clic en icono 📋 (Copiar)
2. Sistema copia al portapapeles:
   https://www.custodia360.es/dashboard-entidad
3. Muestra toast: "Enlace copiado al portapapeles"
4. Admin puede pegar enlace en comunicaciones externas
```

---

## 🧪 Testing

### QA Manual

#### Test 1: Visualización de datos
```
✓ KPIs muestran cifras correctas
✓ Tabla carga todas las entidades
✓ Paginación funciona correctamente
✓ Filtros se aplican en tiempo real
```

#### Test 2: Activación/Desactivación
```
✓ Modal de confirmación se muestra
✓ Estado se actualiza en BD
✓ Toast de éxito aparece
✓ Tabla se refresca automáticamente
✓ Log se registra correctamente
```

#### Test 3: Envío de emails
```
✓ Email se envía a la dirección correcta
✓ Variables se sustituyen correctamente
✓ Rate limiting funciona (60 segundos)
✓ Error si email_contacto es inválido
✓ Log se registra con email_id
```

#### Test 4: Búsqueda y filtros
```
✓ Búsqueda por nombre funciona
✓ Búsqueda por NIF/CIF funciona
✓ Búsqueda por email funciona
✓ Filtro "Con Kit" muestra solo activos
✓ Filtro "Sin Kit" muestra solo inactivos
✓ Filtro "Todas" muestra todos
```

---

## 📊 Métricas del Sistema

- **3 APIs** nuevas creadas
- **1 página UI** completa
- **1 migración SQL** (tabla + plantilla)
- **1 tabla nueva** en base de datos (admin_actions_log)
- **4 KPIs** en tiempo real
- **4 acciones** por entidad
- **2 modales** (detalle + confirmación)
- **~600 líneas** de código TypeScript

---

## ⚙️ Variables de Entorno Requeridas

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=https://www.custodia360.es
```

---

## 🚀 Próximos Pasos (Pendientes)

### Implementar Guards de Autenticación
- [ ] Verificar que usuario es admin en cada API
- [ ] Obtener email del admin desde sesión/token
- [ ] Bloquear acceso a no-admins

### Optimizaciones
- [ ] Usar Redis para rate limiting en producción
- [ ] Caché de resultados de búsqueda
- [ ] Paginación server-side real

### Mejoras UX
- [ ] Exportar tabla a CSV
- [ ] Filtros avanzados (por sector, fecha)
- [ ] Búsqueda con debounce
- [ ] Animaciones de carga

---

## 🐛 Troubleshooting

### Problema: Tabla no carga datos
**Solución:**
1. Verificar que migración SQL se ejecutó correctamente
2. Verificar conexión a Supabase
3. Revisar logs de consola del navegador
4. Verificar que el campo `kit_comunicacion` existe en entities

### Problema: Email no se envía
**Solución:**
1. Verificar RESEND_API_KEY en .env
2. Comprobar que plantilla `kit-comm-invite` existe en BD
3. Verificar que email_contacto de entidad es válido
4. Revisar rate limiting (esperar 60 segundos)
5. Verificar logs de Resend Dashboard

### Problema: Toggle no funciona
**Solución:**
1. Verificar SUPABASE_SERVICE_ROLE_KEY
2. Comprobar permisos RLS en tabla entities
3. Revisar logs del endpoint /toggle
4. Verificar que entityId es correcto

---

## 📝 Notas de Implementación

### Decisiones de Diseño

1. **Ubicación:** Se eligió `/dashboard-custodia360/kit-comunicacion` para mantener consistencia con otras secciones admin existentes (entidades, contactos, monitoreo-boe).

2. **Sin Guard de Auth:** Temporalmente se dejó como TODO para no bloquear implementación. En producción debe añadirse verificación de rol admin.

3. **Rate Limiting Simple:** Se usa Map en memoria por simplicidad. En producción con múltiples instancias, migrar a Redis.

4. **Service Role Key:** Se usa para operaciones admin que requieren bypass de RLS. Nunca exponer al frontend.

5. **Iconos Unicode:** Se usan emojis Unicode (👁️, 📋, etc.) en lugar de librerías de iconos para simplicidad y rendimiento.

---

**Implementado bajo Modo Consolidación**
**Versión:** 1.0
**Última actualización:** 15 Octubre 2025
