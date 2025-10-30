# 🔐 Sistema de Autenticación - Custodia360

## 📋 Descripción General

El sistema de autenticación de Custodia360 maneja **5 tipos de usuarios diferentes** con flujos de acceso separados:

1. **Admin Custodia360** (Hardcoded)
2. **Entidad/Contratante** (Hardcoded Demo)
3. **Delegado Formado** (Hardcoded Demo - Certificado)
4. **Formación** (Hardcoded Demo - No certificado)
5. **Delegados** (Supabase Auth - Usuarios reales)

---

## 🎯 Puntos de Acceso

### 1. Página de Acceso Rápido `/acceso`

**Propósito**: Login automático con un solo click

**Características**:
- ✅ 4 paneles de demo siempre disponibles
- ✅ Setup automático para crear usuarios de Supabase
- ✅ Vista de credenciales para cada tipo de usuario
- ✅ Click directo sin formulario

**Flujo**:
```
Usuario entra a /acceso
  ↓
Puede usar paneles demo INMEDIATAMENTE
  OR
Ejecutar setup para crear delegados reales
  ↓
Click en cualquier panel
  ↓
Login automático + redirección
```

### 2. Página de Login Manual `/login`

**Propósito**: Login tradicional con email/password

**Características**:
- ✅ Formulario de email/password
- ✅ Botones de acceso rápido para demo
- ✅ Soporte para todos los tipos de usuario

**Flujo**:
```
Usuario entra a /login
  ↓
Ingresa email + password
  OR
Click en botón de acceso rápido
  ↓
Validación + redirección
```

---

## 👥 Tipos de Usuario

### 1. Admin Custodia360 (Hardcoded)

**Credenciales**:
- Email: `rsune@teamsl.com`
- Password: `Dianita2018`

**Destino**: `/dashboard-custodia360`

**Datos de sesión**:
```typescript
{
  id: 'admin_001',
  nombre: 'Roberto Suñé',
  email: 'rsune@teamsl.com',
  tipo: 'admin',
  entidad: 'Custodia360',
  permisos: ['admin_total'],
  certificacionVigente: true
}
```

### 2. Entidad/Contratante (Hardcoded Demo)

**Credenciales**:
- Email: `entidad@custodia360.com`
- Password: `entidad123`

**Destino**: `/dashboard-entidad`

**Datos de sesión**:
```typescript
{
  id: 'entidad_001',
  nombre: 'Entidad Demo',
  email: 'entidad@custodia360.com',
  tipo: 'entidad',
  entidad: 'Club Deportivo Demo',
  permisos: ['ver_dashboard', 'ver_facturacion']
}
```

### 3. Delegado Formado (Hardcoded Demo)

**Credenciales**:
- Email: `delegado@custodia360.com`
- Password: `delegado123`

**Destino**: `/dashboard-delegado`

**Datos de sesión**:
```typescript
{
  id: 'delegado_001',
  nombre: 'Delegado Certificado',
  email: 'delegado@custodia360.com',
  tipo: 'principal',
  rol: 'delegado_principal',
  entidad: 'Club Deportivo Demo',
  tipoEntidad: 'club-deportivo',
  permisos: ['ver_casos', 'crear_informes', 'gestionar_personal'],
  formado: true,
  certificacionVigente: true
}
```

### 4. Formación (Hardcoded Demo)

**Credenciales**:
- Email: `formacion@custodia360.com`
- Password: `formacion123`

**Destino**: `/formacion-delegado`

**Datos de sesión**:
```typescript
{
  id: 'formacion_001',
  nombre: 'Nuevo Delegado',
  email: 'formacion@custodia360.com',
  tipo: 'principal',
  entidad: 'Entidad Demo',
  tipoEntidad: 'club-deportivo',
  permisos: ['formacion'],
  certificacionVigente: false
}
```

### 5. Delegados (Supabase Auth)

**Credenciales**: Variables, creadas desde la base de datos

**Password por defecto**: `Custodia360!`

**Destino**: `/dashboard-delegado`

**Datos de sesión**:
```typescript
{
  id: person.id,
  user_id: authData.user.id,
  nombre: '${nombre} ${apellidos}',
  email: person.email,
  tipo: 'principal' | 'suplente',
  rol: 'delegado_principal' | 'delegado_suplente',
  entidad: entity.nombre,
  entityId: entity.id,
  permisos: ['ver_casos', 'crear_informes'],
  formado: person.formacion_completada
}
```

---

## 🔧 Setup de Delegados

### Endpoint: `/api/setup-test-auth`

**Función**: Crear usuarios en Supabase Auth para delegados existentes en la base de datos

**Proceso**:
1. Busca todos los delegados en la tabla `delegados`
2. Filtra los que NO tienen `user_id` (sin usuario Auth)
3. Para cada delegado:
   - Crea usuario en Supabase Auth
   - Asigna password `Custodia360!`
   - Vincula `user_id` en la tabla `delegados`
4. Activa todas las entidades

**Response**:
```typescript
{
  success: true,
  message: 'Setup completado',
  results: ['✅ Usuario creado: email...'],
  credentials: [
    {
      email: 'delegado@example.com',
      password: 'Custodia360!',
      tipo: 'principal',
      nombre: 'Nombre Completo'
    }
  ]
}
```

### UI de Setup

**Ubicaciones**:
- `/acceso` - Botón "Ejecutar Setup de Delegados"
- `/setup-auth` - Página avanzada de setup

**Flujo**:
```
Click en "Ejecutar Setup"
  ↓
POST /api/setup-test-auth
  ↓
Muestra credenciales creadas
  ↓
Permite login inmediato
```

---

## 🔑 Flujo de Autenticación

### Para Usuarios Hardcoded (Admin, Entidad, Delegado Formado, Formación)

```typescript
// En loginAutomatico() o handleLogin()
if (email === 'rsune@teamsl.com' && password === 'Dianita2018') {
  localStorage.setItem('userSession', JSON.stringify(sessionData))
  router.push('/dashboard-custodia360')
  return
}

// Similar para entidad, delegado formado y formación
```

### Para Delegados (Supabase Auth)

```typescript
// 1. Autenticación
const { data: authData } = await supabase.auth.signInWithPassword({
  email, password
})

// 2. Obtener perfil
const { data: person } = await supabase
  .from('delegados')
  .select('*, entidad:entidades(*)')
  .eq('user_id', authData.user.id)
  .single()

// 3. Crear sesión
localStorage.setItem('userSession', JSON.stringify(sessionData))

// 4. Redirigir
router.push('/dashboard-delegado')
```

---

## 📊 Verificaciones

### Middleware `/middleware.ts`

**Protege rutas**:
- `/dashboard-delegado/*`
- `/panel-delegado/*`

**Verifica**:
1. ✅ Sesión de Supabase Auth
2. ✅ Perfil de delegado existe
3. ✅ Rol correcto (delegado_principal o delegado_suplente)
4. ✅ Estado activo
5. ✅ Plan de entidad activo
6. ✅ Pago confirmado
7. ✅ Formación completada (para principal)

---

## 🐛 Solución de Problemas

### "Solo puedo entrar al panel administrativo"

**Causa**: Los usuarios demo o delegados no existen

**Solución**:
1. Ir a `/acceso`
2. Click en "Ejecutar Setup de Delegados"
3. Esperar a que muestre credenciales
4. Intentar login con credenciales mostradas

**Alternativa**:
- Usar paneles demo que funcionan siempre:
  - Admin: `rsune@teamsl.com` / `Dianita2018`
  - Entidad: `entidad@custodia360.com` / `entidad123`
  - Delegado Formado: `delegado@custodia360.com` / `delegado123`
  - Formación: `formacion@custodia360.com` / `formacion123`

### "Error al iniciar sesión con delegado"

**Posibles causas**:
1. Usuario no existe en Supabase Auth → Ejecutar setup
2. Password incorrecta → Verificar `Custodia360!`
3. Entidad no activa → Verificar tabla `entidades`
4. Sin perfil vinculado → Verificar tabla `delegados`

**Debug**:
```typescript
// Ver errores en consola del navegador
console.log('Auth error:', authError)
console.log('Person error:', personError)
```

### "Setup no crea usuarios"

**Verificar**:
1. `SUPABASE_SERVICE_ROLE_KEY` configurada en `.env.local`
2. Tabla `delegados` tiene registros
3. Columna `user_id` está NULL para los delegados
4. Permisos de Supabase Admin correctos

---

## 🎨 UI de Acceso Mejorada

### Página `/acceso`

**Características**:
- 🎯 Vista clara de todos los paneles disponibles
- 📊 Contador de accesos totales
- 🔧 Setup con un solo click
- 🎨 Cards con colores distintos por tipo
- 📱 Responsive mobile/tablet/desktop

**Indicadores visuales**:
- 👑 Admin = Morado
- 🏢 Entidad = Azul
- ✅ Delegado Formado = Verde (Demo)
- 📚 Formación = Amarillo
- 👤 Delegado Real = Teal (Supabase)
- ✅ "Demo" badge para hardcoded

---

## 📝 Notas

- ✅ 4 usuarios hardcoded (no usan Supabase)
- ✅ Paneles demo funcionan siempre sin setup
- ✅ Delegados reales requieren Supabase Auth
- ✅ Password temporal: `Custodia360!`
- ✅ Sesiones en localStorage
- ✅ Mobile optimizado con botones táctiles (≥44px)
- ✅ Delegado formado (demo) vs Delegado real (Supabase)
