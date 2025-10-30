# 🔒 MODO CONSOLIDACIÓN ESTRICTO - Custodia360

**Estado:** ✅ ACTIVADO (ESTRICTO)
**Fecha de activación:** 17 de octubre de 2025
**Última actualización:** 17 de octubre de 2025 (Reconfirmado)
**Proyecto:** Custodia360 - Sistema automatizado de cumplimiento LOPIVI
**Nivel de protección:** MÁXIMO

---

## 📋 POLÍTICA DE PROTECCIÓN ESTRICTA

### ✅ ÚNICAMENTE PERMITIDO:
- ✅ Leer código existente para análisis e integraciones nuevas (SIN modificarlo)
- ✅ Añadir nuevos archivos/funciones/tablas SOLO si el usuario lo indica EXPLÍCITAMENTE
- ✅ Modificar código existente SOLO tras confirmación EXPLÍCITA del usuario
- ✅ Proporcionar análisis, sugerencias y responder preguntas SIN implementar cambios
- ✅ Crear nuevas versiones para documentar el estado actual

### 🚫 ESTRICTAMENTE PROHIBIDO (sin aprobación explícita):
- 🚫 Modificar, eliminar o reescribir CUALQUIER código existente
- 🚫 Refactorizar o "mejorar" código por iniciativa propia
- 🚫 Cambiar dependencias, paquetes, rutas o configuraciones
- 🚫 Reemplazar componentes, endpoints o funciones existentes
- 🚫 Optimizar UX/UI automáticamente
- 🚫 "Limpiar", "simplificar" o "reorganizar" código
- 🚫 Modificar estilos, layouts o diseños sin solicitud
- 🚫 Cambiar estructura de carpetas o nombres de archivos
- 🚫 Actualizar tablas de Supabase sin instrucción explícita
- 🚫 Modificar integraciones (Resend, Stripe, BOE) existentes
- 🚫 CUALQUIER cambio automático, optimización o "automejora"

---

## 🛡️ BASE PROTEGIDA (NO TOCAR SIN APROBACIÓN)

Todo el código, estructura y configuraciones del proyecto están marcados como **BASE PROTEGIDA**:

### Paneles y Páginas:
- ✅ `/src/app/dashboard-delegado/page.tsx` - Panel delegado principal
- ✅ `/src/app/dashboard-delegado/configuracion/page.tsx` - Configuración delegado
- ✅ `/src/app/dashboard-delegado/canal-interacciones/page.tsx` - Canal comunicación
- ✅ `/src/app/dashboard-admin/page.tsx` - Panel administrador
- ✅ `/src/app/dashboard-entidad/page.tsx` - Panel entidad
- ✅ `/src/app/formacion-lopivi/page.tsx` - Sistema formación
- ✅ `/src/app/onboarding-delegado/page.tsx` - Onboarding delegados
- ✅ Todos los demás paneles y páginas del proyecto

### APIs y Endpoints:
- ✅ `/src/app/api/compliance/status/route.ts` - API compliance
- ✅ `/src/app/api/kit-comunicacion/status/route.ts` - API kit comunicación
- ✅ `/src/app/api/onboarding/*` - APIs onboarding
- ✅ Todos los endpoints de Resend, Stripe, BOE
- ✅ Todas las API routes existentes

### Componentes UI:
- ✅ `/src/components/dashboard/ConfigBanner.tsx` - Banner configuración
- ✅ `/src/components/dashboard/ConfigButton.tsx` - Botón configuración
- ✅ Todos los componentes shadcn/ui personalizados
- ✅ Componentes de formularios, modales, cards
- ✅ Layouts y estructuras de página

### Base de Datos Supabase:
- ✅ Tabla `entity_compliance` - Compliance entidades
- ✅ Tabla `delegados` - Datos delegados
- ✅ Tabla `entities` - Entidades registradas
- ✅ Tabla `onboarding_invites` - Invitaciones onboarding
- ✅ Todas las demás tablas, schemas, policies y functions

### Integraciones Externas:
- ✅ Resend (envío de emails)
- ✅ Stripe (pagos y suscripciones)
- ✅ BOE (consulta automática)
- ✅ Todas las configuraciones de servicios externos

### Configuraciones y Archivos del Sistema:
- ✅ `package.json` y dependencias
- ✅ `next.config.js`
- ✅ `tailwind.config.js`
- ✅ Variables de entorno `.env`
- ✅ Tests y archivos de testing
- ✅ Estilos globales y personalizados
- ✅ Toda la lógica de negocio existente

---

## 🔄 PROCESO ESTRICTO DE CAMBIOS

**PROTOCOLO OBLIGATORIO antes de CUALQUIER modificación:**

### 1️⃣ ANÁLISIS PREVIO
- Revisar si el cambio afecta código existente de la BASE PROTEGIDA
- Identificar exactamente qué archivos/funciones se verán afectados
- Determinar si es un NUEVO archivo o MODIFICACIÓN de existente

### 2️⃣ CONSULTA OBLIGATORIA
Antes de implementar CUALQUIER cambio, debo preguntar:

> **"⚠️ CONFIRMACIÓN REQUERIDA:**
> Este cambio afectará a: [listar archivos/funciones]
> ¿Deseas aplicar este cambio sobre la BASE PROTEGIDA de Custodia360?"

### 3️⃣ ESPERA DE APROBACIÓN
- **NO PROCEDER** hasta recibir confirmación explícita del usuario
- Solo estas respuestas cuentan como aprobación:
  - "Sí", "Adelante", "Confirmo", "Procede", "OK", "Hazlo"
- Cualquier otra respuesta = NO PROCEDER

### 4️⃣ IMPLEMENTACIÓN CONTROLADA
Solo después de aprobación explícita:
- Realizar el cambio EXACTAMENTE como se aprobó
- Documentar el cambio en `.same/todos.md`
- Crear versión si es un cambio significativo

### 5️⃣ VERIFICACIÓN POST-CAMBIO
- Confirmar que el cambio no afectó otros componentes
- Ejecutar linter si es necesario
- Reportar resultado al usuario

---

## ⚠️ REGLAS DE ORO

1. **NUNCA modificar código existente sin aprobación explícita**
2. **SIEMPRE preguntar antes de cambiar la base protegida**
3. **LEER está permitido, MODIFICAR requiere autorización**
4. **Cuando hay duda, PREGUNTAR, no asumir**
5. **La protección está activa SIEMPRE, incluso si cambio de sesión**

---

## 📌 ESTADO DEL PROYECTO PROTEGIDO

### Versiones documentadas:
- **Versión 155:** Botón "Volver al Panel" reposicionado después del paso 4 con estilo condicional
- **Versión 157:** Botón siempre visible después del paso 4 (removida condición !isFirstTime)
- **Versión 158:** API compliance modificada para simular datos completados (isFirstTime: false)
- **Estado actual:** Sistema de configuración adaptativa implementado con botón siempre visible

### Servidor y Estado:
- **Dev server:** ✅ Corriendo en puerto 3000
- **Funcionalidades:** Sistema adaptativo de configuración para delegados
- **Últimos cambios:** ConfigBanner, ConfigButton, lógica de redirección

### Integraciones Activas:
- ✅ Supabase (base de datos y auth)
- ✅ Resend (emails transaccionales)
- ✅ Stripe (pagos y suscripciones)
- ✅ BOE (consulta automática)
- ✅ Sistema mock local para desarrollo

---

## 🔓 DESACTIVACIÓN DEL MODO CONSOLIDACIÓN

Para desactivar este modo de protección estricta, el usuario debe escribir:

> **"Desactiva el modo consolidación"**

Solo el usuario puede desactivarlo. Same NO puede desactivarlo por iniciativa propia.

---

## 📝 CONTEXTO GLOBAL DEL PROYECTO

**Nombre:** Custodia360
**Tipo:** Plataforma automatizada de cumplimiento LOPIVI
**Modo:** 🔒 CONSOLIDACIÓN ESTRICTA ACTIVA
**Política:** Protección total de código existente
**Vigencia:** Durante todo el desarrollo del proyecto, incluso si cambio de chat o supero límite de mensajes

---

## ✅ CONFIRMACIÓN

Este documento establece el **MODO CONSOLIDACIÓN ESTRICTO** para Custodia360.

**Same se compromete a:**
- ✅ NO modificar código existente sin aprobación explícita
- ✅ PREGUNTAR antes de cualquier cambio en la base protegida
- ✅ RESPETAR la estructura, configuraciones e integraciones actuales
- ✅ MANTENER esta política activa en todo momento
- ✅ SOLO añadir o modificar cuando el usuario lo indique explícitamente

**El usuario autoriza cambios únicamente mediante:**
- Prompts explícitos que indiquen modificaciones específicas
- Confirmación afirmativa a las preguntas de autorización de Same

---

**Política activa desde:** 17 de octubre de 2025
**Reconfirmado:** 17 de octubre de 2025
**Próxima revisión:** Cuando el usuario lo solicite
**Desactivación:** Solo mediante instrucción explícita del usuario ("Desactiva el modo consolidación")

---

*Este modo de protección garantiza que el proyecto Custodia360 mantiene su integridad y funcionalidad mientras se desarrollan nuevas características bajo control total del usuario.*
