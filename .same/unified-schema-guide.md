# Guía del Esquema Unificado: Entities & People con Supabase Auth

## 📊 Esquema Unificado

El sistema ahora usa un **esquema unificado** con dos tablas principales:

### 1. Tabla `entities` (Entidades)
Almacena información de las organizaciones contratantes.

**Campos principales:**
- `id` (UUID) - Identificador único
- `nombre` - Nombre de la entidad
- `cif` - CIF/NIF de la entidad
- `direccion`, `ciudad`, `provincia`, `codigo_postal` - Ubicación
- `telefono`, `email`, `website` - Contacto
- `tipo_entidad` - Tipo de organización (centro deportivo, educativo, etc.)
- `sector` - Sector de actividad
- `numero_menores` - Número de menores atendidos
- `plan` - Plan contratado
- `precio_mensual` - Precio del plan
- `plan_estado` - Estado del plan: `activo`, `pendiente`, `suspendido`, `cancelado`
- `pago_confirmado` - Si el pago está confirmado
- `fecha_contratacion` - Fecha de alta
- `responsable` - Nombre del responsable
- `email_contacto` - Email principal de contacto

### 2. Tabla `people` (Personas)
Almacena información de todas las personas vinculadas a una entidad.

**Campos principales:**
- `id` (UUID) - Identificador único
- `entity_id` (UUID) - Referencia a `entities`
- `user_id` (UUID) - Referencia a `auth.users` (solo para delegados con acceso al sistema)
- `nombre`, `apellidos` - Nombre completo
- `dni` - DNI/NIE
- `email`, `telefono` - Contacto
- `fecha_nacimiento` - Fecha de nacimiento
- `rol` - Rol en la entidad: `delegado_principal`, `delegado_suplente`, `monitor`, `educador`, etc.
- `tipo` - Clasificación: `principal`, `suplente`, `personal`
- `cargo` - Cargo o función
- `es_contacto` - Si tiene contacto habitual con menores
- `formacion_completada` - Si completó formación LOPIVI
- `certificado_penales` - Si entregó certificado de penales
- `estado` - Estado: `activo`, `inactivo`, `pendiente_formacion`
- `experiencia` - Experiencia previa
- `disponibilidad` - Disponibilidad horaria

---

## 🔄 Diferencias con el Esquema Anterior

| Anterior | Nuevo | Cambio |
|----------|-------|--------|
| `entidades` | `entities` | Tabla renombrada al inglés |
| `delegados` | `people` (con rol delegado) | Los delegados ahora son un tipo de persona |
| `contratantes` | `people` (con rol contratante) o tabla separada | Unificado en people |

**Ventajas del nuevo esquema:**
✅ Más flexible para diferentes tipos de personal
✅ Estructura coherente y escalable
✅ Integración natural con Supabase Auth
✅ Reduce duplicación de datos

---

## 🔐 Integración con Supabase Auth

### Flujo de Autenticación

```
1. Contratación:
   ├── Crear entity en tabla entities
   ├── Crear usuario en Supabase Auth (delegado principal)
   ├── Crear registro en people vinculado via user_id
   ├── Estado inicial: pendiente_formacion
   └── Enviar email con credenciales

2. Login:
   ├── Autenticar con Supabase Auth (email/password)
   ├── Buscar en tabla people por user_id
   ├── Verificar rol (delegado_principal o delegado_suplente)
   ├── Verificar plan_estado de entity
   ├── Verificar pago_confirmado
   └── Verificar formacion_completada (si es principal)

3. Acceso al Panel:
   ├── Middleware verifica sesión de Auth
   ├── Middleware verifica perfil en people
   ├── Middleware verifica estado de entity
   └── Permite o redirige según estado
```

### Campos Clave de Vinculación

**En `people`:**
- `user_id` → Vincula con `auth.users(id)`
- `entity_id` → Vincula con `entities(id)`
- `rol` → Define permisos: `delegado_principal`, `delegado_suplente`
- `formacion_completada` → Controla acceso al panel

**En `entities`:**
- `plan_estado` → Controla si el servicio está activo
- `pago_confirmado` → Controla si puede acceder al sistema

---

## 🛡️ Row Level Security (RLS)

### Políticas para `entities`

**Ver entidad:**
```sql
Users can view their own entity
→ Solo pueden ver la entidad a la que pertenecen (vía people.entity_id)
```

**Actualizar entidad:**
```sql
Users can update their own entity
→ Solo delegados principales y suplentes pueden actualizar
```

### Políticas para `people`

**Ver propio perfil:**
```sql
Users can view themselves
→ Cada usuario ve su propio registro
```

**Ver personal de la entidad:**
```sql
Users can view people in their entity
→ Delegados ven todo el personal de su entidad
```

**Actualizar propio perfil:**
```sql
Users can update themselves
→ Cada usuario puede actualizar su perfil
```

**Delegados gestionan personal:**
```sql
Delegates can update people in their entity
→ Delegados pueden actualizar personal de su entidad
```

---

## 📝 Ejemplos de Uso

### Crear Delegado Principal en Contratación

```typescript
// 1. Crear entidad
const { data: entity } = await supabase
  .from('entities')
  .insert({
    nombre: 'Centro Deportivo ABC',
    cif: 'B12345678',
    tipo_entidad: 'centro-deportivo',
    plan: 'Plan Premium',
    plan_estado: 'activo',
    pago_confirmado: true
  })
  .select()
  .single()

// 2. Crear usuario en Auth (con service role key)
const { data: authUser } = await supabaseAdmin.auth.admin.createUser({
  email: 'delegado@example.com',
  password: 'SecurePassword123!',
  email_confirm: true,
  user_metadata: {
    nombre: 'Juan Pérez',
    rol: 'delegado_principal',
    entity_id: entity.id
  }
})

// 3. Crear persona vinculada
const { data: person } = await supabase
  .from('people')
  .insert({
    entity_id: entity.id,
    user_id: authUser.user.id,
    nombre: 'Juan',
    apellidos: 'Pérez García',
    email: 'delegado@example.com',
    dni: '12345678A',
    rol: 'delegado_principal',
    tipo: 'principal',
    estado: 'pendiente_formacion',
    formacion_completada: false
  })
  .select()
  .single()
```

### Login de Delegado

```typescript
// 1. Autenticar con Supabase Auth
const { data: authData } = await supabase.auth.signInWithPassword({
  email: 'delegado@example.com',
  password: 'SecurePassword123!'
})

// 2. Obtener perfil
const { data: person } = await supabase
  .from('people')
  .select(`
    *,
    entity:entities(*)
  `)
  .eq('user_id', authData.user.id)
  .in('rol', ['delegado_principal', 'delegado_suplente'])
  .single()

// 3. Verificar acceso
if (person.entity.plan_estado !== 'activo') {
  // Redirigir a bloqueado
}

if (person.rol === 'delegado_principal' && !person.formacion_completada) {
  // Redirigir a formación
}

// 4. Crear sesión y redirigir a panel
```

### Agregar Personal a la Entidad

```typescript
// Personal de contacto (monitor, educador, etc.)
const { data: monitor } = await supabase
  .from('people')
  .insert({
    entity_id: entityId,
    nombre: 'María',
    apellidos: 'López Fernández',
    email: 'maria.lopez@example.com',
    dni: '87654321B',
    rol: 'monitor',
    tipo: 'personal',
    cargo: 'Monitora deportiva',
    es_contacto: true, // Tiene contacto con menores
    certificado_penales: false,
    formacion_completada: false,
    estado: 'activo'
  })
  .select()
  .single()
```

---

## 🔧 Archivos Actualizados

### 1. Migración SQL
`supabase/migrations/20250112_people_auth_integration.sql`
- Agrega campos de Auth a `entities`
- Agrega campos de Auth a `people`
- Crea políticas RLS
- Crea vistas y funciones helper

### 2. Librería de Autenticación
`src/lib/auth.ts`
- `getDelegadoProfile()` → Consulta tabla `people`
- `verifyDelegadoAccess()` → Verifica acceso de delegado

### 3. Middleware
`middleware.ts`
- Protege rutas del panel
- Consulta tabla `people` para validación
- Verifica `plan_estado` y `pago_confirmado`

### 4. API de Contratación
`src/app/api/contratar/route.ts`
- Usa tabla `entities` en lugar de `entidades`
- Usa tabla `people` en lugar de `delegados`
- Crea usuarios en Supabase Auth

### 5. Login
`src/app/login/page.tsx`
- Consulta tabla `people` en lugar de `delegados`
- Valida rol y estado correctamente

---

## ✅ Pasos para Implementar

### Paso 1: Ejecutar Migración SQL

```bash
# Ir a Supabase Dashboard → SQL Editor
# Copiar y ejecutar el contenido de:
supabase/migrations/20250112_people_auth_integration.sql
```

### Paso 2: Verificar Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx  # CRÍTICO
```

### Paso 3: Probar Flujo de Contratación

1. Ir a `/contratar`
2. Completar formulario con datos de prueba
3. Verificar creación en Supabase:
   - `entities` → nueva entidad
   - `auth.users` → nuevo usuario
   - `people` → nuevo delegado con user_id

### Paso 4: Probar Login

1. Usar credenciales creadas en contratación
2. Verificar redirect a `/formacion-delegado` (si formación pendiente)
3. Completar formación
4. Login nuevamente
5. Verificar acceso a `/dashboard-delegado`

### Paso 5: Verificar RLS

1. En Supabase Dashboard → Authentication → Policies
2. Verificar que existan políticas para `entities` y `people`
3. Probar acceso con diferentes usuarios

---

## 🧪 Testing

### Test 1: Contratación Completa

```
✅ Entity creada con plan_estado='activo'
✅ Auth user creado con email_confirm=true
✅ Person creada con user_id vinculado
✅ Person tiene rol='delegado_principal'
✅ Person tiene estado='pendiente_formacion'
✅ Emails enviados correctamente
```

### Test 2: Login Primera Vez

```
✅ Auth valida credenciales
✅ Se encuentra perfil en people
✅ Redirect a /formacion-delegado (formación pendiente)
```

### Test 3: Login Después de Formación

```
✅ Auth valida credenciales
✅ formacion_completada=true
✅ Redirect a /dashboard-delegado
```

### Test 4: Cambio de Estado del Plan

```
❌ plan_estado='suspendido'
→ Debe bloquear acceso al panel
→ Redirect a /sistema-bloqueado
```

### Test 5: RLS

```
✅ Usuario A solo ve su entity
✅ Usuario A solo ve people de su entity
❌ Usuario A NO puede ver entities de Usuario B
```

---

## 🚨 Troubleshooting

### Error: "No se encontró perfil de delegado"

**Causa:** Usuario existe en Auth pero no en `people`

**Solución:**
```sql
SELECT * FROM auth.users WHERE email='xxx@example.com';
SELECT * FROM people WHERE user_id='xxx-user-id';
```

Si no existe en `people`, crear registro manualmente.

### Error: "Plan not active"

**Causa:** `plan_estado != 'activo'`

**Solución:**
```sql
UPDATE entities
SET plan_estado='activo', pago_confirmado=true
WHERE id='xxx-entity-id';
```

### Error: "Service role key not found"

**Causa:** `SUPABASE_SERVICE_ROLE_KEY` no configurada

**Solución:**
1. Ir a Supabase Dashboard → Settings → API
2. Copiar `service_role` key
3. Agregar a `.env.local`
4. Reiniciar servidor dev

---

## 📚 Recursos

- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **RLS Policies:** https://supabase.com/docs/guides/auth/row-level-security
- **Next.js Middleware:** https://nextjs.org/docs/app/building-your-application/routing/middleware

---

## ⚡ Próximos Pasos

1. ✅ Migrar datos existentes de `delegados` → `people`
2. ⏳ Integrar onboarding con `people`
3. ⏳ Crear endpoints API para gestión de personal
4. ⏳ Dashboard delegado con datos reales de Supabase
5. ⏳ Sistema de notificaciones por email
6. ⏳ Renovación automática de formaciones

---

*Esquema unificado | Versión 1.0 | 2025-01-12*
