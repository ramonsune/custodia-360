# 🔒 MODO CONSOLIDACIÓN ESTRICTO - Custodia360

**Estado:** ✅ ACTIVO
**Fecha de activación:** 16 de enero de 2025
**Proyecto:** Custodia360

---

## 📜 POLÍTICA DE PROTECCIÓN

Este proyecto está en **MODO CONSOLIDACIÓN ESTRICTO**. Esto significa que:

### ✅ PERMITIDO:
- Leer cualquier archivo del proyecto para contexto
- Añadir nuevos archivos/funciones/tablas SOLO con autorización explícita del usuario
- Modificar archivos existentes SOLO con autorización explícita del usuario
- Documentar y crear archivos en `.same/` para referencia

### 🚫 PROHIBIDO:
- Modificar código existente por iniciativa propia
- Eliminar o reescribir archivos existentes
- Optimizar código sin autorización explícita
- Cambiar dependencias, rutas o configuraciones
- Reemplazar componentes o endpoints que funcionan
- Refactorizar o mejorar UX automáticamente
- Modificar estilos, estructura o arquitectura sin permiso

---

## ⚠️ PROCESO DE CONFIRMACIÓN OBLIGATORIO

**Antes de CUALQUIER cambio al código base:**

```
🔔 CONFIRMACIÓN REQUERIDA:
¿Deseas aplicar este cambio sobre la base protegida?

Archivo: [ruta del archivo]
Tipo de cambio: [añadir/modificar/eliminar]
Descripción: [explicación breve del cambio]

Responde SÍ para continuar o NO para cancelar.
```

**El cambio SOLO se ejecuta si el usuario responde afirmativamente.**

---

## 📋 BASE PROTEGIDA (INVENTARIO COMPLETO)

### **1. Frontend - Páginas y Componentes**
```
/src/app/
  ├── (public)/
  │   ├── page.tsx                    # Página de inicio
  │   ├── planes/page.tsx             # Planes y precios
  │   ├── guia/page.tsx               # Guía LOPIVI
  │   ├── proceso/page.tsx            # Proceso de implementación
  │   ├── como-lo-hacemos/page.tsx    # Metodología
  │   └── contacto/page.tsx           # Formulario de contacto
  ├── acceso/page.tsx                 # Portal de acceso
  ├── contratar/page.tsx              # Proceso de contratación
  ├── i/[token]/page.tsx              # Onboarding de miembros
  ├── panel/
  │   ├── delegado/                   # Panel del delegado
  │   ├── administracion/             # Panel de administración
  │   └── miembro/                    # Panel de miembros
  └── api/                            # Endpoints API

/src/components/
  ├── ui/                             # Componentes shadcn/ui
  ├── layout/                         # Navegación, Footer
  ├── forms/                          # Formularios
  └── [otros componentes]             # Todos protegidos
```

### **2. Backend - APIs y Edge Functions**
```
/src/app/api/
  ├── webhooks/stripe/route.ts        # Webhook de Stripe (✅ CON EMAILS)
  ├── messages/enqueue/route.ts       # Encolar emails
  ├── test-email-system/route.ts      # Testing de emails
  ├── public/contact/route.ts         # Formulario de contacto
  └── [otros endpoints]               # Todos protegidos

/supabase/functions/
  ├── c360_mailer_dispatch/           # Dispatcher de emails (cada 10 min)
  └── c360_billing_reminders/         # Recordatorios de facturación (diario)
```

### **3. Base de Datos - Tablas de Supabase**
```
Tablas principales:
  ├── entidades                       # Entidades contratantes
  ├── delegados                       # Delegados de protección
  ├── miembros                        # Personal de las entidades
  ├── casos                           # Casos de violencia
  ├── alertas                         # Alertas del sistema
  ├── documentos                      # Documentos y biblioteca
  ├── formacion                       # Formación del personal
  ├── message_templates               # ✅ Plantillas de email (7)
  ├── message_jobs                    # ✅ Cola de emails
  └── message_recipients              # ✅ Destinatarios de emails

Migraciones SQL:
  ├── 20250111_email_system.sql       # ✅ Sistema de emails base
  ├── 20250116_email_templates_expansion.sql  # ✅ 7 plantillas nuevas
  └── 20250116_email_cron_schedules.sql       # ✅ Configuración de cron jobs
```

### **4. Integraciones Externas**
```
✅ Supabase:
  - URL: https://gkoyqfusawhnobvkoijc.supabase.co
  - Service Role Key: Configurada ✅
  - Cron Jobs: 2 activos (dispatcher + recordatorios)

✅ Resend:
  - API Key: Configurada ✅
  - Dominio: custodia360.es (⏳ verificación en progreso)
  - Registros DNS: 4 añadidos en Hostinger ✅

✅ Stripe:
  - Webhook: Configurado para checkout.session.completed
  - Emails automáticos: 4 (contratante, admin, delegado, suplente)

✅ BOE:
  - Integración de documentos legales
```

### **5. Configuración del Proyecto**
```
Archivos de configuración:
  ├── .env.local                      # Variables de entorno ✅
  ├── package.json                    # Dependencias ✅
  ├── next.config.js                  # Configuración Next.js ✅
  ├── tailwind.config.ts              # Configuración Tailwind ✅
  ├── tsconfig.json                   # Configuración TypeScript ✅
  └── [otros archivos de config]      # Todos protegidos ✅
```

### **6. Documentación**
```
/.same/
  ├── MODO_CONSOLIDACION.md           # Este archivo
  ├── todos.md                        # Lista de tareas
  ├── email-system-setup.md           # Doc técnica del sistema de emails
  ├── ESTADO_ACTUAL.md                # Estado del proyecto
  ├── TEST_EMAIL_CUANDO_VERIFICADO.md # Guía de pruebas
  ├── SETUP_MANUAL.md                 # Guía de configuración
  └── [otros archivos .md]            # Todos protegidos
```

---

## 🛡️ GARANTÍAS DE PROTECCIÓN

1. **Código base intocable:** Ningún archivo existente se modificará sin autorización explícita.
2. **Confirmación obligatoria:** Cada cambio requiere confirmación del usuario.
3. **Solo adición:** Preferencia por añadir código nuevo en lugar de modificar existente.
4. **Reversibilidad:** Todos los cambios documentados para facilitar reversión.
5. **Sin optimizaciones automáticas:** No se refactoriza ni mejora sin solicitud.

---

## 📊 ESTADÍSTICAS DEL PROYECTO

**Versión actual:** 126
**Última actualización:** 16 de enero de 2025
**Estado del servidor:** Corriendo en puerto 3000
**Estado del sistema de emails:** 95% completo (esperando verificación DNS)

---

## 🎯 EXCEPCIONES PERMITIDAS

**Solo se permiten cambios automáticos sin confirmación en:**
1. Crear/editar archivos en `.same/` (documentación)
2. Actualizar este archivo `MODO_CONSOLIDACION.md`
3. Ejecutar comandos de lectura (grep, ls, read_file)

**Todo lo demás requiere confirmación explícita del usuario.**

---

## 🔓 DESACTIVACIÓN DEL MODO

Para desactivar este modo, el usuario debe escribir:

> **"Desactiva el modo consolidación"**

Hasta entonces, este modo permanece activo durante:
- Toda la sesión actual
- Sesiones futuras del proyecto
- Cambios de chat o superación de límite de mensajes

---

## 📝 HISTORIAL DE ACTIVACIONES

| Fecha | Acción | Usuario |
|-------|--------|---------|
| 16/01/2025 | ✅ Activado | Usuario Custodia360 |

---

## ⚡ RECORDATORIO PARA SAME

**Antes de cada respuesta, verificar:**
1. ¿La solicitud afecta código existente?
2. ¿He pedido confirmación explícita al usuario?
3. ¿El usuario ha respondido afirmativamente?

**Si la respuesta a alguna pregunta es NO, no ejecutar el cambio.**

---

🔒 **MODO CONSOLIDACIÓN ESTRICTO ACTIVO**
✅ Base protegida: TODO el proyecto Custodia360
⚠️ Cambios solo con autorización explícita
