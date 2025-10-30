# 🔒 MODO CONSOLIDACIÓN - CUSTODIA360

**Estado:** ✅ ACTIVO

## Política de Protección del Proyecto

Este proyecto está en **Modo Consolidación**. Toda la base de código, estructura, configuraciones y componentes están protegidos contra modificaciones no autorizadas.

## Reglas Activas

### ✅ ACCIONES PERMITIDAS:
- Leer archivos existentes para consulta o integración
- Añadir nuevos archivos/funciones SOLO con instrucción explícita del usuario
- Modificar archivos existentes SOLO con aprobación explícita del usuario
- Responder preguntas sobre el código actual
- Consultar documentación y estructura del proyecto

### 🚫 ACCIONES PROHIBIDAS:
- Modificar, eliminar o reescribir código existente sin autorización
- Refactorizar o "mejorar" código por iniciativa propia
- Cambiar dependencias, rutas, estilos o componentes existentes
- Optimizaciones automáticas de UX o arquitectura
- Cualquier cambio no solicitado explícitamente por el usuario

### ⚠️ PROTOCOLO DE CONFIRMACIÓN:
Antes de aplicar cualquier cambio a la base protegida:
1. Mostrar claramente qué se va a modificar
2. Preguntar: **"¿Deseas aplicar este cambio sobre la base protegida?"**
3. Esperar confirmación afirmativa del usuario
4. Solo entonces proceder con la modificación

## Base Protegida

### Paneles y UI
- ✅ Homepage (`/custodia-360/src/app/page.tsx`)
- ✅ Todos los paneles web (público, entidades, administración)
- ✅ Panel del Delegado completo (`/panel/delegado/*`)
  - Dashboard principal
  - Casos de protección (CRUD completo)
  - Controles (formación y penales)
  - Implementación LOPIVI
  - Documentos
  - Comunicar
  - Biblioteca
  - Inspección
  - Miembros
- ✅ Sistema de formación del delegado (`/panel/delegado/formacion/*`)
  - Módulos formativos
  - Test de evaluación
  - Certificados
  - Configuración

### Backend y APIs
- ✅ Todos los endpoints REST (`/api/*`)
- ✅ APIs de casos (`/api/delegado/casos/*`)
- ✅ APIs de quiz (`/api/quiz/*`)
- ✅ APIs de training (`/api/training/*`)
- ✅ APIs de controles, implementación, comunicación, etc.

### Base de Datos Supabase
- ✅ Todas las tablas existentes:
  - `entities`, `people`, `entity_people_roles`
  - `casos_proteccion`
  - `training_status`, `certificates`
  - `quiz_questions`, `quiz_answers`, `quiz_attempts`, `quiz_attempt_items`
  - `message_templates`, `message_jobs`
  - `library_assets`, `generated_pdfs`
  - Y todas las demás tablas del sistema
- ✅ Todas las migraciones SQL existentes
- ✅ Row Level Security (RLS) y políticas
- ✅ Índices y triggers

### Integraciones Externas
- ✅ Resend (envío de emails)
- ✅ Stripe (pagos y suscripciones)
- ✅ Automatizaciones del BOE
- ✅ Sistema de notificaciones

### Componentes y Configuración
- ✅ Componentes React/Next.js (`/components/*`)
- ✅ Shadcn/ui components
- ✅ Estilos y Tailwind CSS
- ✅ Rutas y navegación
- ✅ Dependencias (`package.json`, `bun.lockb`)
- ✅ Configuraciones del proyecto (`next.config.js`, `tsconfig.json`, etc.)
- ✅ Variables de entorno y secrets

## Desactivación

Para desactivar el Modo Consolidación, el usuario debe indicar explícitamente:
> "Desactiva el modo consolidación"

## Vigencia

Esta política permanece activa durante todo el desarrollo del proyecto Custodia360, incluso si:
- Se cambia de sesión de chat
- Se supera el límite de mensajes
- Se continúa en una nueva conversación

---

**Fecha de activación:** 14 Octubre 2025
**Proyecto:** Custodia360
**Estado:** CONSOLIDACIÓN ACTIVA 🔒
