# 🔒 MODO CONSOLIDACIÓN ACTIVO

**Fecha de activación:** 23 de octubre de 2025
**Proyecto:** Custodia360 - Sistema LOPIVI Automatizado
**Estado:** ✅ ACTIVO

---

## 📋 POLÍTICA DE PROTECCIÓN DEL CÓDIGO BASE

### ✅ PERMITIDO:
- Leer archivos existentes para consulta y comprensión
- Añadir NUEVOS archivos/funciones/componentes/tablas SI el usuario lo solicita explícitamente
- Modificar archivos existentes SOLO si el usuario lo indica de forma explícita en su prompt
- Proporcionar información, análisis y recomendaciones sin ejecutar cambios
- Integrar nuevas funcionalidades respetando la estructura existente

### 🚫 PROHIBIDO:
- Modificar, eliminar o reescribir código existente sin autorización explícita
- Refactorizar o "mejorar" código automáticamente
- Optimizar componentes, rutas o estilos por iniciativa propia
- Cambiar dependencias, configuraciones o estructura de carpetas sin solicitud
- Reemplazar componentes, APIs o endpoints que ya funcionan
- Aplicar cambios "automejoras" de UX/UI sin aprobación
- Modificar esquemas de Supabase, configuraciones de Stripe/Resend/Holded sin orden directa

---

## 🔐 ÁREAS PROTEGIDAS

### Frontend:
- ✅ `/src/app/` - Todas las páginas y rutas
- ✅ `/src/app/components/` - Todos los componentes
- ✅ `/src/app/dashboard-entidad/` - Panel de entidad
- ✅ `/src/app/dashboard-delegado/` - Panel de delegado
- ✅ `/src/app/contratar/` - Flujo de contratación completo
- ✅ `/src/app/planes/` - Página de planes
- ✅ `/src/app/page.tsx` - Homepage
- ✅ Todos los estilos, tailwind.config, globals.css

### Backend/APIs:
- ✅ `/src/app/api/` - Todas las APIs y endpoints
- ✅ `/api/emails/` - Sistema de emails automatizados
- ✅ `/api/stripe/` - Integraciones de pago
- ✅ `/api/delegate-change/` - Sistema de cambio de delegados
- ✅ `/api/kit-comunicacion/` - Sistema de compra del kit

### Configuraciones:
- ✅ `package.json` - Dependencias del proyecto
- ✅ `next.config.js` - Configuración de Next.js
- ✅ `tsconfig.json` - Configuración de TypeScript
- ✅ `tailwind.config.ts` - Configuración de Tailwind
- ✅ `.env` y variables de entorno
- ✅ `netlify.toml` - Configuración de deployment

### Base de Datos (Supabase):
- ✅ Todas las tablas existentes
- ✅ Políticas RLS (Row Level Security)
- ✅ Funciones y triggers
- ✅ Esquema completo de la base de datos

### Integraciones:
- ✅ Stripe - Configuración de pagos y webhooks
- ✅ Resend - Sistema de emails
- ✅ Holded - Sistema de facturación
- ✅ Supabase - Base de datos y autenticación

### Archivos de Configuración:
- ✅ `/src/lib/pricing.ts` - Precios y configuración de planes
- ✅ Todos los archivos de utilidades y helpers

---

## ⚙️ PROCESO DE CAMBIOS

### Cuando el usuario solicita un cambio:

1. **ANALIZAR** la solicitud:
   - ¿Afecta código existente protegido?
   - ¿Es un NUEVO componente/función/tabla?
   - ¿Requiere MODIFICAR algo existente?

2. **CONFIRMAR** antes de ejecutar:
   ```
   ⚠️ CONFIRMACIÓN REQUERIDA - MODO CONSOLIDACIÓN ACTIVO

   Cambios propuestos:
   - [Detallar cambios exactos]
   - [Archivos afectados]
   - [Impacto en código existente]

   ¿Deseas aplicar estos cambios sobre la base protegida? (Sí/No)
   ```

3. **EJECUTAR** solo si el usuario confirma explícitamente

4. **DOCUMENTAR** cada cambio realizado

### Excepciones que NO requieren confirmación:
- Crear archivos completamente nuevos en directorios no existentes
- Añadir documentación en `.same/`
- Leer archivos para proporcionar información
- Generar informes o análisis sin modificar código

---

## 🚨 ACTIVACIÓN/DESACTIVACIÓN

### Para DESACTIVAR este modo:
El usuario debe escribir explícitamente:
```
"Desactiva el modo consolidación"
```

### Para REACTIVAR:
El usuario puede escribir:
```
"Activa el modo consolidación"
```

---

## 📝 HISTORIAL DE CAMBIOS AUTORIZADOS

*Se registrarán aquí todos los cambios autorizados explícitamente por el usuario*

### [Fecha] - Cambio inicial
- **Acción:** Creación del modo consolidación
- **Autorizado por:** Usuario
- **Estado:** Completado
- **Archivos:** `.same/MODO-CONSOLIDACION-ACTIVO.md`

---

## 🎯 OBJETIVO

Proteger el trabajo realizado hasta ahora y garantizar que cualquier cambio futuro sea:
- ✅ Intencionado
- ✅ Controlado
- ✅ Documentado
- ✅ Reversible

**El proyecto Custodia360 es una aplicación en producción. Cada cambio debe ser cuidadosamente evaluado para no romper funcionalidades existentes.**

---

**Última actualización:** 23/10/2025
**Próxima revisión:** Cuando el usuario lo solicite
**Responsable:** Same AI Assistant bajo supervisión del usuario
