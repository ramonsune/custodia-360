# 🔒 MODO CONSOLIDACIÓN - CUSTODIA360

**Estado:** ✅ ACTIVO

**Fecha de Activación:** 2024-01-20

---

## 📋 OBJETIVO

Proteger todo el código, estructura y configuraciones actuales del proyecto Custodia360 (web, paneles, Supabase, Resend, Stripe, BOE, tests, etc.) contra modificaciones no autorizadas.

---

## 🛡️ BASE PROTEGIDA

Todos los siguientes elementos están **PROTEGIDOS** y no pueden ser modificados sin autorización explícita del usuario:

### Aplicación Web
- ✅ Todas las páginas públicas (/, /guia, /proceso, /planes, /contacto, etc.)
- ✅ Página de login (/login) y acceso (/acceso)
- ✅ Todos los dashboards (delegado, entidad, admin custodia)
- ✅ Todos los componentes UI (shadcn/ui y personalizados)
- ✅ Todos los layouts y estilos (Tailwind CSS)
- ✅ Todas las rutas y navegación

### Backend y APIs
- ✅ Todos los endpoints API
- ✅ Todas las funciones de autenticación
- ✅ Todas las integraciones (Supabase, Resend, Stripe, BOE)
- ✅ Todos los middlewares y utilidades
- ✅ Todas las configuraciones de seguridad

### Base de Datos
- ✅ Todas las tablas de Supabase
- ✅ Todos los esquemas y relaciones
- ✅ Todas las políticas RLS (Row Level Security)
- ✅ Todos los triggers y funciones SQL

### Configuración
- ✅ package.json y todas las dependencias
- ✅ next.config.js y configuraciones de Next.js
- ✅ tailwind.config.ts y configuraciones de Tailwind
- ✅ Variables de entorno (.env)
- ✅ Configuraciones de TypeScript (tsconfig.json)

### Tests y Automatizaciones
- ✅ Todos los tests existentes
- ✅ Todas las automatizaciones configuradas
- ✅ Scripts de deployment y CI/CD

---

## 🚫 RESTRICCIONES ABSOLUTAS

Same **NO PUEDE** realizar las siguientes acciones sin autorización explícita:

1. ❌ Modificar código existente por iniciativa propia
2. ❌ Refactorizar o "optimizar" código automáticamente
3. ❌ Eliminar archivos, funciones o componentes existentes
4. ❌ Reescribir componentes o páginas "para mejorarlos"
5. ❌ Cambiar dependencias (agregar, actualizar o eliminar packages)
6. ❌ Modificar rutas o navegación existente
7. ❌ Cambiar estilos, colores o diseño de componentes actuales
8. ❌ Reemplazar componentes UI existentes
9. ❌ Modificar endpoints o APIs ya configuradas
10. ❌ Cambiar esquemas de base de datos
11. ❌ Alterar configuraciones de seguridad
12. ❌ Modificar flujos de autenticación o autorización
13. ❌ Hacer cambios de UX/UI sin solicitud explícita
14. ❌ Cambiar arquitectura del proyecto

---

## ✅ ACCIONES PERMITIDAS

Same **SÍ PUEDE** realizar las siguientes acciones:

1. ✅ **Leer** cualquier archivo para entender el código
2. ✅ **Añadir** nuevos archivos si el usuario lo solicita explícitamente
3. ✅ **Modificar** archivos específicos que el usuario indique
4. ✅ **Crear** nuevas funciones o componentes si el usuario lo autoriza
5. ✅ **Integrar** nuevas funcionalidades con código existente (sin modificarlo)
6. ✅ **Responder** preguntas sobre el código actual
7. ✅ **Sugerir** mejoras o cambios (pero NO implementarlos sin confirmación)
8. ✅ **Documentar** código existente
9. ✅ **Debug** problemas reportados por el usuario

---

## 📋 PROCESO DE CONFIRMACIÓN

Antes de realizar CUALQUIER cambio en archivos existentes, Same debe:

1. **Preguntar explícitamente:**
   > "¿Deseas aplicar este cambio sobre la base protegida?"

2. **Describir exactamente qué va a cambiar:**
   - Qué archivo(s) se modificarán
   - Qué líneas o secciones
   - Qué funcionalidad se verá afectada

3. **Esperar confirmación explícita del usuario:**
   - Solo proceder si el usuario responde "Sí", "Confirmo", "Adelante" o similar
   - Si hay duda, NO proceder

4. **Documentar el cambio autorizado:**
   - Registrar qué se modificó y por qué

---

## 🔄 FLUJO DE TRABAJO

### Para AÑADIR nuevas funcionalidades:

```
Usuario: "Añade un botón de exportar PDF en el dashboard"
Same:
1. Lee código existente para entender estructura
2. Propone implementación SIN modificar código existente
3. Pregunta: "¿Deseas que añada este botón al dashboard-delegado/page.tsx?"
4. Usuario confirma: "Sí"
5. Same añade el código nuevo sin tocar el existente
```

### Para MODIFICAR funcionalidades existentes:

```
Usuario: "Cambia el color del botón de login"
Same:
1. Identifica el archivo y línea exacta
2. Pregunta: "¿Deseas modificar el botón en login/page.tsx línea 245?"
3. Describe: "Cambiaré bg-blue-600 por [nuevo color]"
4. Usuario confirma: "Adelante"
5. Same realiza el cambio específico
```

### Si el usuario NO especifica qué modificar:

```
Usuario: "El login no funciona"
Same:
1. Lee el código para diagnosticar
2. Identifica el problema
3. Describe el problema encontrado
4. Sugiere la solución
5. Pregunta: "¿Quieres que aplique esta corrección?"
6. Espera confirmación explícita
```

---

## 🔐 CASOS ESPECIALES

### Bugs Críticos
Incluso si Same detecta un bug crítico, debe:
1. Reportarlo al usuario
2. Sugerir la solución
3. Esperar autorización para aplicarla

### Seguridad
Si detecta un problema de seguridad:
1. Alertar inmediatamente al usuario
2. Explicar el riesgo
3. Proponer solución
4. Esperar confirmación explícita

### Optimizaciones
Si identifica oportunidades de optimización:
1. Documentarlas en `.same/sugerencias.md`
2. NO implementarlas automáticamente
3. Esperar solicitud del usuario

---

## 🔓 DESACTIVACIÓN

El modo consolidación solo se desactiva cuando el usuario diga explícitamente:

> "Desactiva el modo consolidación"

Hasta entonces, este modo permanece **ACTIVO** incluso si:
- Cambia de sesión de chat
- Se supera el límite de mensajes
- Se reinicia el servidor
- Se hace deploy del proyecto

---

## 📝 REGISTRO DE CAMBIOS AUTORIZADOS

Todos los cambios autorizados se registrarán aquí:

### 2024-01-20
- ✅ Creación de `/acceso/page.tsx` (redirect a /login) - Autorizado
- ✅ Desactivación de demo mode en `.env.local` - Autorizado
- ✅ Fix de función `isDemoMode()` - Autorizado
- ✅ Cambios de texto en `/proceso` y `/guia` - Autorizado

---

## ⚠️ IMPORTANTE

Este documento es la **LEY** del proyecto Custodia360.

**Ningún código puede ser modificado sin seguir estos procedimientos.**

Si tienes dudas sobre si algo requiere confirmación: **SIEMPRE pregunta primero.**

---

**Modo Consolidación:** ✅ **ACTIVO Y OPERATIVO**
