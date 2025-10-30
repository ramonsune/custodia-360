# 🛡️ MODO CONSOLIDACIÓN - CUSTODIA360

## ✅ ESTADO ACTUAL

**Timestamp de activación:** 21 de octubre de 2025, 16:30 UTC
**Última reconfirmación:** 28 de octubre de 2025, 16:15 UTC
**Estado:** 🔒 **ACTIVO - MÁXIMA PROTECCIÓN**
**Política:** Protección TOTAL e INMUTABLE del proyecto

---

## ⚡ CONFIRMACIÓN DEL USUARIO (28/10/2025 16:15)

El usuario ha confirmado explícitamente:

> "A partir de ahora, Same sólo podrá:
>
> ✅ Añadir o modificar archivos, funciones o tablas si YO lo indico explícitamente en un nuevo prompt.
>
> 🚫 No podrá tocar, eliminar, reescribir ni optimizar nada existente por iniciativa propia.
>
> 🚫 No podrá modificar dependencias, rutas, estilos, ni reemplazar componentes o endpoints que ya existen.
>
> ✅ Sí podrá leerlos para integraciones nuevas, pero sin alterarlos."

---

## 🎯 RESUMEN EJECUTIVO

```
✅ TODO el código actual está PROTEGIDO E INMUTABLE
✅ TODO el schema de Supabase está PROTEGIDO
✅ TODAS las integraciones (Resend, Stripe, BOE) están PROTEGIDAS
✅ TODAS las configuraciones están PROTEGIDAS
✅ TODOS los paneles y dashboards están PROTEGIDOS
✅ TODOS los tests y automatizaciones están PROTEGIDOS

🚫 Same NO puede modificar NADA sin autorización explícita del usuario
🚫 Same NO puede refactorizar código existente
🚫 Same NO puede optimizar o mejorar UX por iniciativa propia
🚫 Same NO puede cambiar dependencias, rutas, estilos o componentes
🚫 Same NO puede eliminar, reescribir o reemplazar nada existente

✅ Same SÍ puede leer código para análisis e integraciones
✅ Same SÍ puede añadir archivos nuevos SI el usuario lo indica explícitamente
✅ Same SÍ puede proponer cambios (esperando confirmación explícita del usuario)
```

---

## 🔐 REGLAS DETALLADAS DEL MODO CONSOLIDACIÓN

### ✅ PERMITIDO (solo con instrucción explícita del usuario)

1. **Lectura de código:**
   - ✅ Leer código para análisis e integraciones (sin modificarlo)
   - ✅ Consultar y entender la estructura actual sin alterarla
   - ✅ Analizar dependencias y relaciones entre componentes

2. **Adiciones (solo con aprobación explícita):**
   - ✅ Añadir nuevos archivos/funciones SOLO con indicación explícita del usuario
   - ✅ Crear nuevas tablas en Supabase SI el usuario lo solicita
   - ✅ Implementar nuevas integraciones SI el usuario lo autoriza

3. **Modificaciones (solo con confirmación previa):**
   - ✅ Modificar archivos existentes SOLO con confirmación previa del usuario
   - ✅ Actualizar configuraciones SI el usuario lo aprueba
   - ✅ Proponer cambios (pero ESPERAR confirmación antes de aplicar)

### 🚫 ESTRICTAMENTE PROHIBIDO (sin autorización explícita)

#### **Código y Desarrollo:**
- ❌ NO refactorizar, optimizar o mejorar código existente por iniciativa propia
- ❌ NO tocar, eliminar o reescribir nada existente sin solicitud del usuario
- ❌ NO modificar dependencias (package.json, bun.lockb) sin autorización
- ❌ NO cambiar rutas, estilos o componentes existentes
- ❌ NO reemplazar componentes o endpoints que ya existen
- ❌ NO realizar procesos de automejora automática de código o UX

#### **Base de Datos:**
- ❌ NO modificar tablas Supabase, schemas, RLS o políticas sin autorización
- ❌ NO alterar estructuras de datos existentes
- ❌ NO cambiar relaciones FK o índices sin permiso
- ❌ NO eliminar o renombrar columnas existentes

#### **Integraciones:**
- ❌ NO alterar APIs, webhooks, integraciones (Resend, Stripe, BOE) sin permiso
- ❌ NO modificar configuraciones de servicios externos
- ❌ NO cambiar flujos de comunicación o automatizaciones
- ❌ NO actualizar keys o secrets sin autorización

#### **Infraestructura:**
- ❌ NO modificar configuraciones de Netlify, variables de entorno, cron jobs
- ❌ NO cambiar paneles, dashboards o flujos de usuario existentes
- ❌ NO alterar configuración de build, deploy o CI/CD
- ❌ NO modificar archivos de configuración (next.config.js, tailwind.config.ts, etc.)

---

## 📋 PROTOCOLO OBLIGATORIO DE CAMBIOS

Antes de CUALQUIER modificación sobre código, schema o configuración existente:

1. **Describir detalladamente** el cambio propuesto al usuario
2. **Preguntar explícitamente:**
   > "¿Deseas aplicar este cambio sobre la base protegida?"
3. **Esperar confirmación afirmativa** del usuario
4. **Solo entonces** ejecutar el cambio
5. **Documentar** el cambio aplicado en `.same/todos.md`

### ⚠️ Ejemplo de Flujo Correcto:

```
Usuario: "Quiero añadir un nuevo endpoint para exportar datos"

Same:
1. Analizo la estructura actual (sin modificarla)
2. Propongo la solución:
   - Nuevo archivo: src/app/api/export/route.ts
   - Sin modificaciones a código existente
   - Integración con Supabase existente
3. Pregunto: "¿Deseas aplicar este cambio sobre la base protegida?"
4. Usuario confirma: "Sí"
5. Ejecuto el cambio
6. Documento en todos.md
```

---

## 🏗️ BASE PROTEGIDA - INVENTARIO COMPLETO

### **Frontend y UI**
- ✅ Página pública landing (homepage)
- ✅ 4 dashboards principales (admin, delegado, suplente, entidad)
- ✅ Todos los componentes React en `/components`
- ✅ Todos los componentes shadcn/ui personalizados
- ✅ Sistema de certificación LOPIVI completo
- ✅ Página de configuración inicial (wizard 4 pasos)

### **APIs y Backend**
- ✅ Todas las rutas API en `/api/*`
- ✅ Sistema de onboarding (4 roles)
- ✅ Sistema de quiz LOPIVI
- ✅ API de configuración de delegado
- ✅ Webhooks (Resend, Stripe)
- ✅ Endpoints de auditoría

### **Base de Datos (Supabase)**
- ✅ Schema completo (10+ tablas)
- ✅ Todas las políticas RLS
- ✅ Todas las relaciones FK
- ✅ Todos los índices
- ✅ Scripts SQL de mantenimiento

### **Integraciones**
- ✅ Resend (13 plantillas de email)
- ✅ Stripe (webhooks, subscriptions)
- ✅ Sistema de cron jobs
- ✅ Pipeline de emails

### **Configuración**
- ✅ package.json y dependencias
- ✅ next.config.js
- ✅ netlify.toml
- ✅ Variables de entorno
- ✅ TypeScript config

---

## ⚠️ IMPORTANTE

- **Persistencia:** Este modo persiste durante TODO el desarrollo del proyecto Custodia360
- **Continuidad:** Se mantiene activo incluso si cambias de chat o superas el límite de mensajes
- **Alcance:** Es una preferencia global del proyecto "Custodia360 Modo Consolidación"
- **Desactivación:** Solo el usuario puede desactivarlo con el comando: `"Desactiva el modo consolidación"`
- **Duda:** Cualquier duda sobre si algo está permitido → **PREGUNTAR al usuario primero**

---

## 🎯 PARA DESACTIVAR

El usuario debe escribir explícitamente:

```
Desactiva el modo consolidación
```

Solo entonces se podrá volver al modo normal de desarrollo.

---

**Documento actualizado:** 28 de octubre de 2025, 16:15 UTC
**Versión:** 2.0 (Reforzado)
**Estado:** ACTIVO
