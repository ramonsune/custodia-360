# Referencia Rápida del Esquema Unificado

## Tabla `entities`

### Campos de Estado

| Campo | Tipo | Valores Permitidos | Uso |
|-------|------|-------------------|-----|
| `plan_estado` | TEXT | `'activo'`, `'pendiente'`, `'suspendido'`, `'cancelado'` | Estado del plan de la entidad |
| `pago_confirmado` | BOOLEAN | `true`, `false` | Si el pago está confirmado |
| `fecha_contratacion` | TIMESTAMPTZ | - | Fecha de contratación del servicio |

### Validaciones Correctas

```typescript
// ✅ CORRECTO - Verificar plan activo
if (entity.plan_estado !== 'activo') {
  // Plan no activo
}

// ✅ CORRECTO - Verificar pago confirmado
if (!entity.pago_confirmado) {
  // Pago pendiente
}

// ❌ INCORRECTO - NO USAR
if (entity.status !== 'activa') {
  // Campo y valor incorrectos
}
```

---

## Tabla `people`

### Campos de Estado y Rol

| Campo | Tipo | Valores Permitidos | Uso |
|-------|------|-------------------|-----|
| `rol` | TEXT | `'delegado_principal'`, `'delegado_suplente'`, `'monitor'`, `'educador'`, etc. | Rol de la persona |
| `tipo` | TEXT | `'principal'`, `'suplente'`, `'personal'` | Tipo de delegado |
| `estado` | TEXT | `'activo'`, `'inactivo'`, `'pendiente_formacion'` | Estado de la cuenta |
| `formacion_completada` | BOOLEAN | `true`, `false` | Si completó formación |
| `user_id` | UUID | - | Vinculación con Supabase Auth |

### Validaciones Correctas

```typescript
// ✅ CORRECTO - Verificar rol de delegado
if (person.rol === 'delegado_principal' || person.rol === 'delegado_suplente') {
  // Es delegado
}

// ✅ CORRECTO - Verificar estado activo
if (person.estado === 'activo' || person.estado === 'pendiente_formacion') {
  // Cuenta activa
}

// ✅ CORRECTO - Verificar formación
if (person.formacion_completada) {
  // Formación completada
}
```

---

## Flujo de Validación Completo

### En Middleware (Server-Side)

```typescript
// 1. Verificar sesión de Auth
const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  return redirect('/login')
}

// 2. Obtener perfil de delegado
const { data: person } = await supabase
  .from('people')
  .select(`
    rol,
    estado,
    formacion_completada,
    entity:entities(
      plan_estado,
      pago_confirmado
    )
  `)
  .eq('user_id', session.user.id)
  .in('rol', ['delegado_principal', 'delegado_suplente'])
  .single()

if (!person) {
  return redirect('/login?error=no_profile')
}

// 3. Verificar estado de la persona
if (person.estado !== 'activo' && person.estado !== 'pendiente_formacion') {
  return redirect('/sistema-bloqueado?reason=account_inactive')
}

// 4. Verificar plan activo
if (person.entity?.plan_estado !== 'activo') {
  return redirect('/sistema-bloqueado?reason=plan_inactive')
}

// 5. Verificar pago confirmado
if (!person.entity?.pago_confirmado) {
  return redirect('/sistema-bloqueado?reason=payment_pending')
}

// 6. Verificar formación (solo delegado principal)
if (person.rol === 'delegado_principal' && !person.formacion_completada) {
  return redirect('/formacion-delegado?required=true')
}

// ✅ Acceso permitido
```

### En Login (Client-Side)

```typescript
// Autenticar con Supabase Auth
const { data: authData, error } = await supabase.auth.signInWithPassword({
  email,
  password
})

if (error) {
  setError('Email o contraseña incorrectos')
  return
}

// Obtener perfil
const { data: person } = await supabase
  .from('people')
  .select(`*, entity:entities(*)`)
  .eq('user_id', authData.user.id)
  .in('rol', ['delegado_principal', 'delegado_suplente'])
  .single()

if (!person) {
  setError('No se encontró perfil de delegado')
  await supabase.auth.signOut()
  return
}

// Validar estado del plan
if (person.entity.plan_estado !== 'activo') {
  setError(`El plan está en estado: ${person.entity.plan_estado}`)
  await supabase.auth.signOut()
  return
}

// Validar pago
if (!person.entity.pago_confirmado) {
  setError('El pago está pendiente de confirmación')
  await supabase.auth.signOut()
  return
}

// Redirigir según formación
if (person.rol === 'delegado_principal' && !person.formacion_completada) {
  router.push('/formacion-delegado?required=true')
} else {
  router.push('/dashboard-delegado')
}
```

---

## Queries SQL Útiles

### Verificar estado de una entidad

```sql
SELECT
  id,
  nombre,
  plan_estado,
  pago_confirmado,
  fecha_contratacion
FROM entities
WHERE id = 'xxx-entity-id';
```

### Activar plan de una entidad

```sql
UPDATE entities
SET
  plan_estado = 'activo',
  pago_confirmado = true
WHERE id = 'xxx-entity-id';
```

### Verificar delegados de una entidad

```sql
SELECT
  p.nombre,
  p.apellidos,
  p.rol,
  p.tipo,
  p.estado,
  p.formacion_completada,
  e.nombre AS entidad,
  e.plan_estado
FROM people p
JOIN entities e ON p.entity_id = e.id
WHERE p.entity_id = 'xxx-entity-id'
AND p.rol IN ('delegado_principal', 'delegado_suplente');
```

### Marcar formación como completada

```sql
UPDATE people
SET
  formacion_completada = true,
  estado = 'activo'
WHERE id = 'xxx-person-id';
```

---

## Estados del Sistema

### Estados de Plan (`plan_estado`)

| Estado | Descripción | Acceso al Panel |
|--------|-------------|-----------------|
| `'activo'` | Plan activo y funcionando | ✅ Sí |
| `'pendiente'` | En proceso de activación | ❌ No |
| `'suspendido'` | Temporalmente suspendido | ❌ No |
| `'cancelado'` | Plan cancelado | ❌ No |

### Estados de Persona (`estado`)

| Estado | Descripción | Acceso al Panel |
|--------|-------------|-----------------|
| `'activo'` | Cuenta activa | ✅ Sí |
| `'pendiente_formacion'` | Esperando formación | ⚠️ Solo formación |
| `'inactivo'` | Cuenta inactiva | ❌ No |

### Roles de Persona (`rol`)

| Rol | Descripción | Requiere Formación |
|-----|-------------|--------------------|
| `'delegado_principal'` | Delegado principal | ✅ Sí |
| `'delegado_suplente'` | Delegado suplente | ⚠️ Recomendado |
| `'monitor'` | Monitor deportivo | ❌ No (otra formación) |
| `'educador'` | Educador | ❌ No (otra formación) |

---

## Errores Comunes

### ❌ Error 1: Campo incorrecto

```typescript
// INCORRECTO
if (entity.status !== 'activa') { ... }

// CORRECTO
if (entity.plan_estado !== 'activo') { ... }
```

### ❌ Error 2: Valor incorrecto

```typescript
// INCORRECTO
if (entity.plan_estado !== 'activa') { ... }

// CORRECTO
if (entity.plan_estado !== 'activo') { ... }
```

### ❌ Error 3: Tabla incorrecta

```typescript
// INCORRECTO - Tabla antigua
const { data } = await supabase.from('entidades').select()

// CORRECTO - Tabla unificada
const { data } = await supabase.from('entities').select()
```

### ❌ Error 4: Campo de delegado incorrecto

```typescript
// INCORRECTO - Tabla antigua
const { data } = await supabase.from('delegados').select()

// CORRECTO - Tabla unificada
const { data } = await supabase
  .from('people')
  .select()
  .in('rol', ['delegado_principal', 'delegado_suplente'])
```

---

## Resumen de Campos

### ✅ USAR (Esquema Actual)

- `entities` (tabla)
- `people` (tabla)
- `plan_estado` (campo)
- `'activo'` (valor)
- `pago_confirmado` (campo)
- `formacion_completada` (campo)
- `user_id` (campo - vincula con Auth)

### ❌ NO USAR (Obsoleto)

- `entidades` (tabla antigua)
- `delegados` (tabla antigua)
- `status` (campo inexistente)
- `'activa'` (valor incorrecto)
- `password` (campo inseguro - usar Auth)

---

*Referencia actualizada: 2025-01-12 | Versión 50*
