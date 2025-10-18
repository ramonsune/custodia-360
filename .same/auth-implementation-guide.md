# Guía de Implementación: Sistema de Autenticación Integrado con Supabase

## 📋 Resumen de la Implementación

Se ha implementado un sistema completo de autenticación usando **Supabase Auth**, integrado con el proceso de contratación y el panel del delegado.

### ✅ Archivos Creados/Modificados

1. **`src/lib/auth.ts`** - Utilidades de autenticación
2. **`middleware.ts`** - Protección de rutas
3. **`src/app/api/contratar/route.ts`** - Integración con Supabase Auth
4. **`src/app/login/page.tsx`** - Login actualizado
5. **`supabase/migrations/20250112_auth_integration.sql`** - Migración SQL

---

## 🚀 Pasos de Implementación

### 1. Aplicar Migración SQL en Supabase

**Ir a:** Supabase Dashboard → SQL Editor

**Ejecutar:**
```sql
-- Copiar y ejecutar el contenido de:
supabase/migrations/20250112_auth_integration.sql
```

**Esta migración hace:**
- ✅ Agrega `plan_estado`, `pago_confirmado`, `fecha_contratacion` a `entidades`
- ✅ Agrega `user_id`, `formacion_completada`, `rol` a `delegados`
- ✅ Crea índices y vistas optimizadas
- ✅ Habilita Row Level Security (RLS)
- ✅ Crea políticas de acceso
- ✅ Crea funciones helper para verificación de acceso

### 2. Verificar Variables de Entorno

**Archivo:** `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx  # CRÍTICO para crear usuarios
```

**IMPORTANTE:** El `SUPABASE_SERVICE_ROLE_KEY` es necesario para:
- Crear usuarios en el proceso de contratación
- Operaciones administrativas de Auth

### 3. Probar el Flujo Completo

#### A) Proceso de Contratación

1. Ir a `/contratar`
2. Completar todos los datos
3. El sistema automáticamente:
   - Crea la entidad en la tabla `entidades`
   - Crea usuario en Supabase Auth para delegado principal
   - Crea usuario en Supabase Auth para delegado suplente (si aplica)
   - Vincula usuarios con tabla `delegados` mediante `user_id`
   - Establece `plan_estado = 'activo'` y `pago_confirmado = true`
   - Establece `estado = 'pendiente_formacion'` para delegado principal

#### B) Login del Delegado

1. Ir a `/login`
2. Ingresar email y contraseña creados en contratación
3. El sistema verifica:
   - ✅ Usuario existe en Supabase Auth
   - ✅ Tiene perfil en tabla `delegados`
   - ✅ Entidad tiene `plan_estado = 'activo'`
   - ✅ Entidad tiene `pago_confirmado = true`
   - ✅ Delegado principal completó formación (si no, redirige a `/formacion-delegado`)

#### C) Acceso al Panel

1. Si todo está OK, se redirige a `/dashboard-delegado`
2. El middleware protege la ruta automáticamente
3. Si falta algún requisito, se redirige a:
   - `/login` - Si no autenticado
   - `/sistema-bloqueado` - Si plan inactivo o pago pendiente
   - `/formacion-delegado` - Si formación incompleta

---

## 🔒 Seguridad Implementada

### Row Level Security (RLS)

Las políticas RLS garantizan que:
- Los delegados solo ven sus propios datos
- Los delegados solo ven su entidad
- Los delegados solo pueden actualizar sus propios datos
- No pueden acceder a datos de otras entidades

### Middleware de Protección

El middleware verifica en cada request:
1. Sesión de Supabase Auth válida
2. Perfil de delegado existe
3. Plan activo
4. Pago confirmado
5. Formación completada (si es delegado principal)

### Validación Multi-Nivel

**Nivel 1:** Supabase Auth (email/password)
**Nivel 2:** Tabla `delegados` (perfil vinculado)
**Nivel 3:** Tabla `entidades` (plan y pago)
**Nivel 4:** Middleware (protección de rutas)

---

## 📊 Flujo de Datos

```mermaid
graph TD
    A[Usuario visita /contratar] --> B[Completa formulario]
    B --> C[API crea usuario en Supabase Auth]
    C --> D[API crea registro en tabla delegados con user_id]
    D --> E[API crea registro en tabla entidades]
    E --> F[plan_estado=activo, pago_confirmado=true]
    F --> G[Email enviado con credenciales]

    H[Usuario va a /login] --> I[Ingresa email/password]
    I --> J[Supabase Auth valida]
    J --> K[Busca perfil en tabla delegados]
    K --> L[Verifica plan_estado y pago]
    L --> M{¿Formación completada?}
    M -->|No| N[/formacion-delegado]
    M -->|Sí| O[/dashboard-delegado]

    P[Usuario en /dashboard-delegado] --> Q[Middleware verifica sesión]
    Q --> R{¿Válido?}
    R -->|No| S[Redirige a /login]
    R -->|Sí| T[Acceso permitido]
```

---

## 🧪 Testing

### Caso 1: Nueva Contratación

```
1. Ir a /contratar
2. Completar:
   - Email delegado: juan@example.com
   - Contraseña: Test123!
3. Enviar formulario
4. Verificar en Supabase:
   - auth.users tiene el usuario
   - delegados tiene registro con user_id
   - entidades tiene plan_estado='activo'
```

### Caso 2: Login Primera Vez

```
1. Ir a /login
2. Ingresar: juan@example.com / Test123!
3. Debe redirigir a /formacion-delegado (formación pendiente)
4. Completar formación
5. Login de nuevo
6. Debe redirigir a /dashboard-delegado
```

### Caso 3: Plan Inactivo

```
1. En Supabase, cambiar:
   UPDATE entidades SET plan_estado='suspendido' WHERE id=X
2. Intentar login
3. Debe redirigir a /sistema-bloqueado
```

### Caso 4: Pago Pendiente

```
1. En Supabase, cambiar:
   UPDATE entidades SET pago_confirmado=false WHERE id=X
2. Intentar login
3. Debe redirigir a /sistema-bloqueado
```

---

## 🔧 Configuración Adicional

### Habilitar Email de Confirmación (Opcional)

Por defecto, los usuarios se crean con `email_confirm: true`.

Si quieres que reciban email de confirmación:

```typescript
// En src/app/api/contratar/route.ts
const { data: authUser } = await supabaseAdmin.auth.admin.createUser({
  email: emailDelegadoPrincipal,
  password: contraseñaDelegadoPrincipal,
  email_confirm: false, // Cambiar a false
  user_metadata: { ... }
})
```

Luego configurar email templates en Supabase Dashboard → Authentication → Email Templates

### Personalizar Redirecciones

Editar `middleware.ts` para cambiar URLs de redirect:
- Plan inactivo → `/sistema-bloqueado`
- Formación pendiente → `/formacion-delegado`
- Sin sesión → `/login`

---

## 🐛 Troubleshooting

### Error: "No se encontró perfil de delegado"

**Causa:** El usuario existe en Auth pero no en tabla `delegados`

**Solución:**
```sql
SELECT * FROM auth.users WHERE email='xxx@example.com';
SELECT * FROM delegados WHERE user_id='xxx-user-id';
```

Si no existe en delegados, crear manualmente o re-ejecutar contratación.

### Error: "Plan no activo"

**Causa:** `plan_estado != 'activo'`

**Solución:**
```sql
UPDATE entidades
SET plan_estado='activo', pago_confirmado=true
WHERE id=X;
```

### Error: "Error creando usuario Auth"

**Causa:** `SUPABASE_SERVICE_ROLE_KEY` no configurada o incorrecta

**Solución:**
1. Verificar `.env.local`
2. Obtener key de: Supabase Dashboard → Settings → API → service_role key
3. Reiniciar servidor dev

### Middleware no protege rutas

**Causa:** `middleware.ts` no se ejecuta

**Solución:**
1. Verificar que el archivo está en la raíz del proyecto (mismo nivel que `src/`)
2. Reiniciar servidor dev
3. Verificar matcher en `middleware.ts`

---

## 📈 Próximos Pasos Opcionales

1. **Dashboard del Delegado completo:**
   - Integrar datos reales de Supabase
   - Crear endpoints API para casos, personal, documentos
   - Reemplazar localStorage por consultas a Supabase

2. **Onboarding automático:**
   - Vincular portal de onboarding (tokens/links) con entidades
   - Sincronizar datos de onboarding_responses con panel delegado

3. **Gestión de roles:**
   - Diferenciar permisos entre delegado principal y suplente
   - Crear tabla de permisos granulares

4. **Notificaciones:**
   - Email al delegado cuando se crea su cuenta
   - Email cuando debe renovar formación
   - Email cuando el plan está por vencer

5. **Auditoría:**
   - Registrar todos los logins en tabla de auditoría
   - Registrar cambios de estado de plan
   - Registrar accesos a datos sensibles

---

## 📚 Referencias

- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **Next.js Middleware:** https://nextjs.org/docs/app/building-your-application/routing/middleware
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security

---

## ✅ Checklist de Implementación

- [ ] Ejecutar migración SQL en Supabase
- [ ] Verificar `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`
- [ ] Probar contratación de nueva entidad
- [ ] Verificar creación de usuario en Supabase Auth
- [ ] Probar login con credenciales creadas
- [ ] Verificar redirect a formación si incompleta
- [ ] Completar formación y verificar acceso a dashboard
- [ ] Probar middleware cambiando `plan_estado` manualmente
- [ ] Verificar políticas RLS en Supabase
- [ ] Limpiar usuarios de prueba de Auth
- [ ] Actualizar dashboard delegado para usar Supabase (pendiente)

---

## 🆘 Soporte

Si encuentras problemas:
1. Revisar logs del servidor dev
2. Revisar Network tab en DevTools
3. Revisar Supabase logs en Dashboard → Logs
4. Contactar soporte de Same: support@same.new
