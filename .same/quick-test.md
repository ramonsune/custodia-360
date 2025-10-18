# Checklist de Prueba Rápida - Esquema Unificado

## 🧪 Verificación del Sistema

### Paso 1: Verificar Migración SQL ✓

**En Supabase Dashboard → SQL Editor:**

```sql
-- Verificar que las tablas existen y tienen las columnas correctas
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'entities'
ORDER BY ordinal_position;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'people'
ORDER BY ordinal_position;

-- Verificar RLS
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('entities', 'people');

-- Verificar funciones
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%delegado%';
```

**Resultado esperado:**
- ✅ `entities` tiene columnas: `plan_estado`, `pago_confirmado`, `cif`, etc.
- ✅ `people` tiene columnas: `user_id`, `rol`, `tipo`, `formacion_completada`, etc.
- ✅ Existen políticas RLS para ambas tablas
- ✅ Existe función `verificar_acceso_delegado`

---

### Paso 2: Probar Contratación ✓

**1. Abrir navegador:**
```
http://localhost:3000/contratar
```

**2. Completar formulario con datos de prueba:**

```
Entidad:
- Nombre: "Centro Deportivo Test"
- CIF: "B12345678"
- Tipo: "centro-deportivo"
- Número menores: 50

Contratante:
- Nombre: "Juan Pérez"
- DNI: "12345678A"
- Email: "test.contratante@example.com"
- Contraseña: "Test1234!"

Delegado Principal:
- Nombre: "María García"
- DNI: "87654321B"
- Email: "test.delegado@example.com"
- Contraseña: "Delegado1234!"
```

**3. Enviar formulario**

**4. Verificar en Supabase:**

```sql
-- Ver entidad creada
SELECT * FROM entities
WHERE nombre LIKE '%Test%'
ORDER BY created_at DESC LIMIT 1;

-- Ver delegado en people
SELECT * FROM people
WHERE email = 'test.delegado@example.com';

-- Ver usuario en Auth
SELECT id, email, raw_user_meta_data
FROM auth.users
WHERE email = 'test.delegado@example.com';

-- Verificar vinculación
SELECT
    p.nombre,
    p.email,
    p.rol,
    p.user_id,
    e.nombre as entidad,
    e.plan_estado
FROM people p
JOIN entities e ON p.entity_id = e.id
WHERE p.email = 'test.delegado@example.com';
```

**Resultado esperado:**
- ✅ Entity existe con `plan_estado='activo'`
- ✅ Person existe con `rol='delegado_principal'`
- ✅ Person tiene `user_id` no nulo
- ✅ Auth user existe con mismo email
- ✅ `user_id` de people coincide con `id` de auth.users

---

### Paso 3: Probar Login ✓

**1. Ir a login:**
```
http://localhost:3000/login
```

**2. Ingresar credenciales de prueba:**
```
Email: test.delegado@example.com
Password: Delegado1234!
```

**3. Clic en "Ingresar"**

**Resultado esperado:**
- ✅ Autentica correctamente
- ✅ Muestra mensaje "Autenticación exitosa"
- ✅ Redirige a `/formacion-delegado?required=true` (porque formacion_completada=false)

---

### Paso 4: Completar Formación (Simulado) ✓

**Actualizar directamente en Supabase para simular formación completada:**

```sql
UPDATE people
SET formacion_completada = true,
    estado = 'activo'
WHERE email = 'test.delegado@example.com';
```

**Resultado esperado:**
- ✅ Campo actualizado correctamente

---

### Paso 5: Login Después de Formación ✓

**1. Ir a login nuevamente:**
```
http://localhost:3000/login
```

**2. Ingresar credenciales:**
```
Email: test.delegado@example.com
Password: Delegado1234!
```

**Resultado esperado:**
- ✅ Autentica correctamente
- ✅ Redirige a `/dashboard-delegado` (no a formación)
- ✅ Dashboard carga correctamente

---

### Paso 6: Verificar Middleware ✓

**1. Cerrar sesión (logout)**

**2. Intentar acceder directamente a:**
```
http://localhost:3000/dashboard-delegado
```

**Resultado esperado:**
- ✅ Redirige a `/login?redirect=/dashboard-delegado`

**3. Login y verificar redirect:**
- ✅ Después de login, redirige de vuelta a `/dashboard-delegado`

---

### Paso 7: Probar RLS ✓

**En Supabase Dashboard → SQL Editor (como usuario anónimo):**

```sql
-- Esto debe fallar (RLS activo)
SELECT * FROM people;
```

**Resultado esperado:**
- ✅ No devuelve filas (RLS bloqueando acceso sin auth)

**Con sesión autenticada (en la app):**
- ✅ Delegado solo ve people de su entity_id
- ✅ Delegado solo ve su entity

---

### Paso 8: Probar Plan Inactivo ✓

**Cambiar estado del plan:**

```sql
UPDATE entities
SET plan_estado = 'suspendido'
WHERE nombre LIKE '%Test%';
```

**Intentar login:**

**Resultado esperado:**
- ✅ Login autentica
- ✅ Middleware detecta `plan_estado != 'activo'`
- ✅ Redirige a `/sistema-bloqueado?reason=plan_inactive`

**Restaurar:**

```sql
UPDATE entities
SET plan_estado = 'activo'
WHERE nombre LIKE '%Test%';
```

---

### Paso 9: Probar Pago Pendiente ✓

**Cambiar estado del pago:**

```sql
UPDATE entities
SET pago_confirmado = false
WHERE nombre LIKE '%Test%';
```

**Intentar login:**

**Resultado esperado:**
- ✅ Redirige a `/sistema-bloqueado?reason=payment_pending`

**Restaurar:**

```sql
UPDATE entities
SET pago_confirmado = true
WHERE nombre LIKE '%Test%';
```

---

### Paso 10: Limpiar Datos de Prueba ✓

```sql
-- Eliminar people (cascada eliminará en background_checks, trainings)
DELETE FROM people
WHERE email IN ('test.delegado@example.com', 'test.contratante@example.com');

-- Eliminar entity
DELETE FROM entities
WHERE nombre LIKE '%Test%';

-- Eliminar usuario de Auth (en Dashboard → Authentication → Users)
-- O via SQL (con service role):
-- SELECT auth.admin.delete_user('user-id-here');
```

---

## 📊 Resumen de Verificación

| Test | Estado | Notas |
|------|--------|-------|
| Migración SQL aplicada | ⏳ | Ejecutar en Supabase |
| Contratación crea entity | ⏳ | Probar flujo completo |
| Contratación crea people | ⏳ | Verificar vinculación user_id |
| Login autentica | ⏳ | Con credenciales correctas |
| Login valida formación | ⏳ | Redirect a formación si pendiente |
| Login accede a panel | ⏳ | Después de formación |
| Middleware protege rutas | ⏳ | Sin sesión redirige a login |
| RLS funciona | ⏳ | Solo ve sus datos |
| Plan inactivo bloquea | ⏳ | Redirect a bloqueado |
| Pago pendiente bloquea | ⏳ | Redirect a bloqueado |

---

## 🐛 Errores Comunes

### Error: "Column 'user_id' does not exist"
**Solución:** Migración no aplicada. Ejecutar `20250112_people_auth_integration.sql`

### Error: "Service role key not found"
**Solución:** Agregar `SUPABASE_SERVICE_ROLE_KEY` a `.env.local`

### Error: "No rows returned by RLS"
**Solución:** Verificar que las políticas RLS están creadas correctamente

### Error: "Redirect loop"
**Solución:** Verificar que `formacion_completada=true` después de completar formación

---

## ✅ Checklist Final

- [ ] Migración aplicada en Supabase
- [ ] Variables de entorno configuradas
- [ ] Contratación funciona
- [ ] Login funciona
- [ ] Middleware protege rutas
- [ ] RLS funciona
- [ ] Plan inactivo bloquea
- [ ] Pago pendiente bloquea
- [ ] Datos de prueba limpiados

---

*Test completo del esquema unificado | v1.0*
