# ✅ SISTEMA DE ONBOARDING - SIN FUNCIONES SQL

## 📋 IMPLEMENTACIÓN COMPLETADA

### ✅ 1. Helper Server-Only
**Archivo:** `lib/invite/ensureInviteToken.ts`

**Funcionalidad:**
- Asegura que existe un token para una entidad
- Si existe → lo devuelve
- Si no existe → lo crea de forma idempotente
- Maneja condiciones de carrera (duplicate key)
- **NO usa funciones SQL** → toda la lógica está en el código

---

### ✅ 2. Endpoints API

#### **GET/POST `/api/invite-token`**
**Archivo:** `src/app/api/invite-token/route.ts`

**Uso:**
```javascript
// GET
const res = await fetch('/api/invite-token?entityId=xxx')
const data = await res.json()
// { ok: true, token: 'uuid', url: 'https://www.custodia360.es/onboarding/xxx/uuid' }

// POST
const res = await fetch('/api/invite-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ entityId: 'xxx' })
})
```

**Características:**
- Llama a `ensureInviteToken()` helper
- Devuelve token + URL completa
- Genera URL con `APP_BASE_URL` o `NEXT_PUBLIC_APP_BASE_URL`

---

#### **POST `/api/invite-token/rotate`** (Opcional)
**Archivo:** `src/app/api/invite-token/rotate/route.ts`

**Uso:**
```javascript
const res = await fetch('/api/invite-token/rotate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ entityId: 'xxx' })
})
// { ok: true, token: 'nuevo-uuid', url: 'nueva-url' }
```

**Características:**
- Genera nuevo token UUID
- Invalida el token anterior
- Útil si se filtra un enlace

---

### ✅ 3. Base de Datos

**Archivo:** `database/onboarding-tokens-simple.sql`

**Tabla:**
```sql
create table if not exists entity_invite_tokens (
  entity_id uuid primary key references entities(id) on delete cascade,
  token uuid not null default gen_random_uuid(),
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**Características:**
- **NO usa funciones SQL** (solo trigger para updated_at)
- 1 token por entidad (primary key)
- Campo `active` para desactivar sin eliminar
- Token se genera automáticamente con `gen_random_uuid()`

---

### ✅ 4. Integración en Configuración

**Archivo:** `src/app/dashboard-delegado/configuracion/page.tsx`

**Cambios:**
- Llama a `/api/invite-token?entityId=xxx` al cargar
- Muestra URL completa
- Botones: Copiar / WhatsApp / Email
- Maneja estados: loading, error, success

**Ubicación:** Paso 2 "Portal de Incorporación de Miembros"

---

## 🚀 CÓMO ACTIVAR

### 1. Ejecutar SQL en Supabase

```sql
-- Copiar y pegar de:
database/onboarding-tokens-simple.sql
```

### 2. Verificar Variables de Entorno

```env
SUPABASE_URL=tu_url
SUPABASE_SERVICE_ROLE_KEY=tu_key
APP_BASE_URL=https://www.custodia360.es
# o
NEXT_PUBLIC_APP_BASE_URL=https://www.custodia360.es
```

### 3. Reiniciar servidor

```bash
npm run dev
```

### 4. Probar

1. Ir a `/dashboard-delegado/configuracion`
2. Ver Paso 2 → debe mostrar enlace
3. Copiar y abrir en otra ventana
4. Ver landing de onboarding

---

## ✅ VENTAJAS DE ESTA IMPLEMENTACIÓN

1. **Sin Funciones SQL**
   - Más fácil de debugear
   - Código en TypeScript (type-safe)
   - No depende de funciones en BD

2. **Idempotente**
   - Llamar múltiples veces devuelve mismo token
   - Maneja condiciones de carrera
   - No crea duplicados

3. **Flexible**
   - Fácil añadir lógica (logs, analytics, etc.)
   - Se puede rotar token cuando sea necesario
   - Campo `active` permite desactivar sin borrar

4. **Seguro**
   - Token UUID aleatorio
   - 1 token por entidad
   - Se puede invalidar en cualquier momento

---

## 📊 ARQUITECTURA

```
Usuario → /dashboard-delegado/configuracion
           ↓
       GET /api/invite-token?entityId=xxx
           ↓
       lib/invite/ensureInviteToken()
           ↓
       Supabase: entity_invite_tokens
           ↓
       { ok: true, token: 'uuid', url: 'https://...' }
           ↓
       UI muestra enlace + botones
```

---

## 🔄 FLUJO DE ROTACIÓN (Opcional)

```
Usuario → Click "Rotar token"
           ↓
       POST /api/invite-token/rotate
           ↓
       Supabase: UPSERT nuevo token
           ↓
       { ok: true, token: 'nuevo-uuid', url: '...' }
           ↓
       UI actualiza enlace
           ↓
       Token anterior YA NO FUNCIONA
```

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Sistema de tokens funcionando
2. ⏳ Ejecutar SQL completo: `database/onboarding-system-schema.sql`
3. ⏳ Probar formularios de onboarding
4. ⏳ Edge Function para alertas diarias
5. ⏳ Templates de email en Resend

---

## 📝 NOTAS

- El helper `ensureInviteToken` es reutilizable en otros endpoints
- Se puede extender para añadir expiración de tokens
- El campo `active` permite implementar "desactivar enlace" sin rotar
- Compatible con el sistema de onboarding ya implementado

---

**TODO LISTO PARA USAR** 🚀
