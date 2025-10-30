# 🎭 MODO DEMO - PREVIEW INTERNO

## ✅ CONFIGURACIÓN COMPLETADA

El entorno DEMO está **100% activo** en SAME Preview.

---

## 📋 CARACTERÍSTICAS

### ✅ Variables de Entorno
```bash
DEMO_ENABLED=true
SIMULAR_AUTH=true
```

### 👥 Usuarios DEMO Disponibles

| Email | Password | Rol | Dashboard de Destino |
|-------|----------|-----|---------------------|
| `entidad@custodia.com` | `123` | ENTIDAD | `/dashboard-entidad` |
| `delegado@custodia.com` | `123` | DELEGADO | `/dashboard-delegado` |
| `delegados@custodia.com` | `123` | SUPLENTE | `/dashboard-suplente` |
| `ramon@custodia.com` | `123` | ADMIN | `/admin` |

---

## 🎯 CÓMO USAR

### 1. Ir a `/login`
El sistema detectará automáticamente que está en **MODO DEMO**.

### 2. Verás el Badge DEMO
```
🎭 MODO DEMO - PREVIEW INTERNO
```

### 3. Login con usuarios DEMO
- **Email**: Cualquiera de los 4 usuarios de arriba
- **Password**: `123`

### 4. Redirección Automática
Según el rol del usuario, serás redirigido a:
- `ENTIDAD` → `/dashboard-entidad`
- `DELEGADO` → `/dashboard-delegado`
- `SUPLENTE` → `/dashboard-suplente`
- `ADMIN` → `/admin`

---

## 🔒 SEGURIDAD

### ✅ Modo DEMO activo
- ❌ **NO conecta a Supabase real**
- ❌ **NO envía emails reales**
- ❌ **NO procesa pagos reales**
- ✅ **Sesiones solo en memoria/localStorage**
- ✅ **Datos de prueba temporales**

### Badge DEMO Visible
En todos los dashboards, verás el badge:
```jsx
<DemoBadge />
```

Esto indica claramente que estás en un entorno de prueba.

---

## 📁 ARCHIVOS MODIFICADOS

### Nuevos Archivos
- ✅ `src/lib/demo-auth.ts` - Sistema de autenticación DEMO
- ✅ `.env.local` - Variables DEMO_ENABLED y SIMULAR_AUTH

### Archivos Modificados
- ✅ `src/app/login/page.tsx` - Integración con sistema DEMO
- ✅ `src/app/dashboard-delegado/page.tsx` - Badge DEMO
- ✅ `src/app/dashboard-entidad/page.tsx` - Badge DEMO
- ✅ `src/app/dashboard-suplente/page.tsx` - Badge DEMO
- ✅ `src/app/admin/page.tsx` - Badge DEMO
- ✅ `src/components/demo/DemoBadge.tsx` - Actualizado para DEMO

---

## 🔍 VERIFICACIÓN

### Login Page
1. Ve a `/login`
2. Deberías ver:
   - Badge amarillo/naranja: **MODO DEMO - PREVIEW INTERNO**
   - Lista de usuarios DEMO disponibles
   - Password visible: `123`

### Dashboards
1. Haz login con cualquier usuario DEMO
2. En el header del dashboard verás:
   - Badge DEMO pulsante (amarillo/naranja)
   - Indicación clara de modo prueba

---

## ⚙️ DESACTIVAR MODO DEMO

Para volver a modo producción, edita `.env.local`:

```bash
DEMO_ENABLED=false
SIMULAR_AUTH=false
```

---

## 📝 NOTAS TÉCNICAS

### Storage en Memoria
Las sesiones DEMO se guardan en:
- `localStorage`: Sesión persistente en navegador
- `Map` interno: Validación server-side (se resetea al recargar página)

### No Persistente
- Al cerrar el navegador, la sesión DEMO se elimina
- No hay datos en base de datos real
- Perfecto para testing y demostración

---

## ✅ PRÓXIMOS PASOS

Ahora puedes:
1. **Iniciar sesión** con usuarios DEMO
2. **Explorar dashboards** sin afectar datos reales
3. **Testear funcionalidades** en entorno aislado
4. **Mostrar la plataforma** a clientes sin riesgos

🎉 **¡Modo DEMO completamente funcional!**
