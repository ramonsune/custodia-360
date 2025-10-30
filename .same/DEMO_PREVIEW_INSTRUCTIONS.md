# 🎮 Entorno DEMO Preview - Instrucciones de Uso

**Fecha de activación**: 27 de enero de 2025
**Estado**: ✅ ACTIVO en Same Preview
**Modo**: Solo entorno local (no afecta producción)

---

## 🔑 Credenciales de Acceso

### **1. ENTIDAD (Representante Legal)**
- **Email**: `entidad@custodia.com`
- **Contraseña**: `123`
- **Redirige a**: `/dashboard-entidad`
- **Rol**: Contratante / Dirección de la entidad

### **2. DELEGADO Principal**
- **Email**: `delegado@custodia.com`
- **Contraseña**: `123`
- **Redirige a**: `/dashboard-delegado`
- **Rol**: Delegado de Protección principal

### **3. DELEGADO Suplente**
- **Email**: `delegados@custodia.com`
- **Contraseña**: `123`
- **Redirige a**: `/dashboard-suplente`
- **Rol**: Delegado de Protección suplente

### **4. ADMIN Custodia360**
- **Email**: `ramon@custodia.com`
- **Contraseña**: `123`
- **Redirige a**: `/dashboard-custodia360`
- **Rol**: Administrador interno de Custodia360

---

## 📝 Cómo Iniciar Sesión

1. **Abre tu navegador** en: `http://localhost:3000/login`

2. **Ingresa una de las credenciales** de arriba (email + contraseña `123`)

3. **Click en "Iniciar Sesión"**

4. **Serás redirigido automáticamente** al dashboard correspondiente

5. **Verás el badge "MODO DEMO - Preview"** en la esquina superior derecha ⚠️

---

## 🎯 Características del Entorno DEMO

### ✅ **Activado:**
- Autenticación en memoria (sin Supabase)
- Sesiones temporales de 8 horas
- Badge visual "MODO DEMO - Preview"
- Redirección automática según rol
- Navegación completa por todos los paneles
- Storage local temporal

### 🚫 **Desactivado:**
- Conexión a Supabase real
- Pagos con Stripe
- Envío de emails reales
- Persistencia de datos entre sesiones
- Integración con Holded (facturación)
- Modificación de datos de producción

---

## 🔍 Variables de Entorno Activas

```bash
NEXT_PUBLIC_DEMO_ENABLED=true
NEXT_PUBLIC_SIMULAR_AUTH=true
```

Estas variables están configuradas en `.env.local` y activan el modo DEMO automáticamente.

---

## 🧪 Testing Recomendado

### **Test 1: Login y Redirección**
1. Probar login con cada uno de los 4 usuarios
2. Verificar redirección correcta
3. Verificar que aparece el badge DEMO

### **Test 2: Navegación entre Paneles**
1. Login como ENTIDAD
2. Explorar todas las secciones del panel
3. Verificar que no hay errores de conexión

### **Test 3: Cierre de Sesión**
1. Login con cualquier usuario
2. Cerrar sesión (si hay botón de logout)
3. Verificar que se limpia localStorage
4. Volver a login y probar con otro usuario

### **Test 4: Persistencia de Sesión**
1. Login con cualquier usuario
2. Refrescar la página (F5)
3. Verificar que la sesión se mantiene (8 horas)

---

## 🛠️ Troubleshooting

### **Problema**: No aparece el badge DEMO
**Solución**:
1. Verificar que el servidor se reinició después del cambio en `.env.local`
2. Limpiar caché del navegador (Ctrl + Shift + R)
3. Verificar en consola del navegador: `process.env.NEXT_PUBLIC_DEMO_ENABLED`

### **Problema**: Login no funciona
**Solución**:
1. Verificar que usas exactamente las credenciales indicadas
2. Revisar consola del navegador (F12 → Console)
3. Verificar logs del servidor en terminal

### **Problema**: Redirección incorrecta
**Solución**:
1. Limpiar localStorage: Consola del navegador → `localStorage.clear()`
2. Volver a intentar login

### **Problema**: Error de Supabase
**Solución**:
- El modo DEMO **NO debería** conectar a Supabase
- Si ves errores de Supabase, verificar que `DEMO_ENABLED=true`
- Los errores de Supabase son esperables y no afectan funcionalidad DEMO

---

## 🔄 Cómo Desactivar el Modo DEMO

Para volver al modo normal (con Supabase real):

1. **Editar `.env.local`**:
   ```bash
   NEXT_PUBLIC_DEMO_ENABLED=false
   ```

2. **Reiniciar el servidor**:
   ```bash
   # En terminal de Same:
   Ctrl + C
   bun run dev
   ```

3. **Limpiar localStorage** (opcional):
   - Consola del navegador (F12)
   - Ejecutar: `localStorage.clear()`

---

## 📂 Archivos Modificados

### **Nuevos/Refactorizados:**
- `src/components/demo/DemoBadge.tsx` - Badge visual
- `src/lib/demo-auth.ts` - Autenticación en memoria

### **Modificados:**
- `.env.local` - Variables DEMO activadas
- `src/app/login/page.tsx` - Integración autenticación demo
- `src/app/dashboard-custodia360/page.tsx` - DemoBadge añadido

### **Ya existían con DemoBadge:**
- `src/app/dashboard-entidad/page.tsx`
- `src/app/dashboard-delegado/page.tsx`
- `src/app/dashboard-suplente/page.tsx`

---

## ⚠️ Importante

- **Solo para preview interno**: No desplegar con DEMO_ENABLED=true
- **No afecta producción**: Cambios solo en entorno local
- **Sesiones temporales**: Se pierden al cerrar navegador
- **Datos no persistentes**: No se guardan en base de datos

---

## 🎉 Próximos Pasos

1. **Probar login** con las 4 credenciales
2. **Explorar cada panel** y verificar funcionalidad
3. **Reportar cualquier error** o comportamiento inesperado
4. **Cuando termines**, recuerda desactivar el modo DEMO

---

**Documentación completa**: `.same/CONSOLIDATION_MODE.md`
**Change log**: `.same/CHANGE_LOG.md`

**¿Preguntas?** Pregunta a Same AI en el chat.
