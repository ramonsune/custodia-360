# 🚀 PLAN GO-LIVE URGENTE - 2 DÍAS

**Objetivo:** Lanzar Custodia360 al mercado en 2 días
**Fecha Inicio:** Hoy
**Fecha Go-Live:** Pasado mañana (48 horas)
**Modo:** SPRINT INTENSIVO

---

## ⚡ ESTRATEGIA DE LANZAMIENTO

### Filosofía: MVP Seguro

```yaml
Principio:
  "Lanzar con lo mínimo viable SEGURO, iterar rápido después"

Enfoque:
  ✅ HACER: Lo que bloquea go-live
  ❌ POSPONER: Lo que se puede hacer post-lanzamiento

Riesgo Aceptable:
  - Lanzar sin tests → Monitoring agresivo
  - Lanzar en beta controlada → Primeros 10 clientes
  - Iteración rápida → Despliegues diarios
```

---

## 📋 CHECKLIST CRÍTICO (2 DÍAS)

### DÍA 1 - VALIDACIONES Y PRODUCCIÓN (8 horas)

#### ⏰ Bloque 1: STRIPE A PRODUCCIÓN (2h) - 9:00-11:00

**Objetivo:** Activar pagos reales

```bash
# 1. Activar cuenta Stripe producción
□ Ir a dashboard.stripe.com
□ Activar cuenta (completar KYC si necesario)
□ Obtener claves de producción

# 2. Actualizar variables de entorno en Netlify
□ STRIPE_SECRET_KEY → sk_live_***
□ STRIPE_PUBLISHABLE_KEY → pk_live_***
□ STRIPE_WEBHOOK_SECRET → whsec_*** (nuevo endpoint prod)

# 3. Crear productos en Stripe producción
□ Plan 50 (19€/mes)
□ Plan 100 (29€/mes)
□ Plan 250 (49€/mes)
□ Plan 500 (89€/mes)
□ Plan 1000 (149€/mes)

# 4. Actualizar Price IDs en código
□ Editar: lib/pricing.ts
□ Reemplazar price_test_*** por price_***

# 5. Configurar webhook producción
□ URL: https://www.custodia360.es/api/stripe/webhook
□ Eventos: checkout.session.completed, invoice.*, customer.subscription.*
□ Obtener signing secret
□ Actualizar STRIPE_WEBHOOK_SECRET

# 6. Test de pago real con 1€
□ Crear checkout
□ Pagar con tarjeta real
□ Verificar webhook recibido
□ Verificar suscripción creada en DB
```

**Entregable:** ✅ Pagos reales funcionando

---

#### ⏰ Bloque 2: VALIDAR HOLDED (3h) - 11:00-14:00

**Objetivo:** Asegurar facturación automática

```bash
# 1. Verificar credenciales
□ Login en Holded
□ Verificar API Key activa
□ Verificar Product IDs existen

# 2. Test: Crear contacto
□ Endpoint: POST /api/holded/create-contact
□ Payload: {
    nombre: "Test Cliente",
    email: "test@example.com",
    nif: "12345678A"
  }
□ Verificar contacto creado en Holded
□ Guardar contact_id

# 3. Test: Crear factura
□ Endpoint: POST /api/holded/create-invoice
□ Payload: {
    contact_id: "...",
    product_id: "677c92f50802a90d980fc05e",
    amount: 19
  }
□ Verificar factura creada
□ Verificar PDF generado

# 4. Test: Flujo completo
□ Pago en Stripe → Webhook → Holded
□ Verificar factura automática
□ Verificar datos correctos

# 5. Manejo de errores
□ Si contacto existe → Obtener ID y continuar
□ Si falla API → Reintentar 3 veces
□ Si falla después → Email a admin + log

# 6. Crear script de validación
□ scripts/test-holded-integration.ts
□ Ejecutar y documentar resultados
```

**Entregable:** ✅ Holded validado o plan B documentado

---

#### ⏰ Bloque 3: VALIDACIÓN CRÍTICA (3h) - 15:00-18:00

**Objetivo:** Validar inputs en endpoints críticos

```bash
# 1. Instalar Zod (5 min)
npm install zod

# 2. Crear schemas críticos (30 min)
□ lib/validations/onboarding.ts
□ lib/validations/payment.ts
□ lib/validations/cases.ts

# 3. Validar endpoints (2h)
□ /api/stripe/webhook → Validar payload Stripe
□ /api/onboarding/submit → Validar datos usuario
□ /api/delegado/casos/create → Validar datos caso
□ /api/quiz/submit → Validar respuestas
□ /api/contratar → Validar datos contratación

# 4. Error handling básico (30 min)
□ Try-catch en todos los endpoints críticos
□ Respuestas consistentes { success, data, error }
□ Logging de errores con contexto
```

**Código ejemplo:**

```typescript
// lib/validations/payment.ts
import { z } from 'zod'

export const StripeWebhookSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.object({
      id: z.string(),
      customer: z.string().optional(),
      amount_total: z.number().optional(),
    })
  })
})

// api/stripe/webhook/route.ts
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const event = StripeWebhookSchema.parse(body)

    // Procesar...

    return Response.json({ success: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return Response.json(
      { success: false, error: 'Invalid payload' },
      { status: 400 }
    )
  }
}
```

**Entregable:** ✅ Endpoints críticos validados

---

### DÍA 2 - MONITORING Y QA (8 horas)

#### ⏰ Bloque 1: MONITORING BÁSICO (2h) - 9:00-11:00

**Objetivo:** Detectar errores en producción

```bash
# OPCIÓN A: Sentry (Recomendado - 2h)

# 1. Crear cuenta Sentry (5 min)
□ Ir a sentry.io
□ Crear proyecto "Custodia360"
□ Obtener DSN

# 2. Instalar (5 min)
npm install @sentry/nextjs

# 3. Configurar (30 min)
□ npx @sentry/wizard@latest -i nextjs
□ Seguir wizard
□ Actualizar NEXT_PUBLIC_SENTRY_DSN en Netlify

# 4. Configurar alertas (30 min)
□ Email si error rate > 1%
□ Email si endpoint crítico falla
□ Slack si pago falla

# 5. Test (30 min)
□ Forzar error en /api/test
□ Verificar aparece en Sentry
□ Verificar alerta recibida

# OPCIÓN B: Logging mejorado (Si no da tiempo Sentry - 1h)

# 1. Crear logger centralizado
□ lib/logger.ts
□ Función log(level, message, context)

# 2. Agregar a endpoints críticos
□ logger.error('Payment failed', { userId, amount, error })

# 3. Crear endpoint de logs
□ /api/admin/logs
□ Ver últimos 100 errores
```

**Entregable:** ✅ Monitoring básico activo

---

#### ⏰ Bloque 2: QA MANUAL COMPLETO (4h) - 11:00-15:00

**Objetivo:** Validar manualmente todos los flujos

```bash
# FLUJO 1: CONTRATACIÓN (45 min)
□ Ir a www.custodia360.es
□ Clic en "Contratar"
□ Rellenar datos entidad
□ Rellenar datos delegado
□ Seleccionar Plan 50
□ Pagar con tarjeta real (19€)
□ Verificar redirección a /contratacion-exitosa
□ Verificar email recibido
□ Verificar suscripción en Stripe
□ Verificar factura en Holded
□ Verificar datos en Supabase

# FLUJO 2: ONBOARDING DELEGADO (60 min)
□ Admin invita delegado
□ Verificar email invitación recibido
□ Clic en link con token
□ Seleccionar rol "Delegado Principal"
□ Rellenar formulario
□ Subir certificado de antecedentes
□ Completar quiz LOPIVI
□ Aprobar con 8/10
□ Verificar certificado generado
□ Verificar email bienvenida
□ Login con credenciales
□ Acceder a /dashboard-delegado

# FLUJO 3: ONBOARDING PERSONAL (30 min)
□ Admin invita personal
□ Completar onboarding "Personal con Contacto"
□ Completar quiz
□ Verificar certificado
□ Verificar acceso limitado

# FLUJO 4: GESTIÓN DE CASOS (45 min)
□ Login como delegado
□ Crear nuevo caso
□ Tipo: sospecha_maltrato
□ Prioridad: alta
□ Verificar protocolo urgente activado
□ Verificar email a admin
□ Actualizar caso
□ Agregar acciones
□ Cerrar caso
□ Verificar en dashboard

# FLUJO 5: FORMACIÓN (30 min)
□ Login como delegado
□ Acceder a formación
□ Iniciar test
□ Completar 10 preguntas
□ Aprobar
□ Descargar certificado PDF
□ Verificar validez

# FLUJO 6: COMUNICACIÓN (30 min)
□ Delegado envía mensaje a personal
□ Verificar email enviado
□ Verificar en historial
□ Compartir documento
□ Verificar descarga

# FLUJO 7: ADMIN (30 min)
□ Login como admin
□ Ver todas las entidades
□ Ver estadísticas
□ Configurar monitoreo BOE
□ Ver alertas BOE
□ Gestionar kit comunicación
```

**Checklist QA:**

```
□ Todos los links funcionan
□ Todos los formularios validan
□ Todos los emails se envían
□ Todas las notificaciones aparecen
□ Todos los PDFs se generan
□ Responsive en móvil
□ Sin errores en consola
□ Sin warnings críticos
```

**Entregable:** ✅ QA completo documentado

---

#### ⏰ Bloque 3: CHECKLIST FINAL (2h) - 15:00-17:00

**Objetivo:** Verificar todo está listo

```bash
# SEGURIDAD
□ Variables de entorno en producción
□ Stripe en modo live
□ Resend activo
□ Holded validado
□ RLS policies activas
□ HTTPS activo
□ Headers de seguridad
□ CORS configurado

# FUNCIONALIDAD
□ Login funciona
□ Registro funciona
□ Pagos funcionan
□ Emails se envían
□ PDFs se generan
□ Webhooks funcionan
□ Cron jobs configurados

# CONTENIDO
□ Textos sin "test" o "demo"
□ Emails profesionales
□ PDFs con branding
□ FAQ actualizado
□ Política privacidad
□ Términos y condiciones
□ Política cookies

# UX/UI
□ Sin lorem ipsum
□ Sin placeholder text
□ Imágenes optimizadas
□ Sin enlaces rotos
□ Responsive móvil
□ Accesibilidad básica

# LEGAL
□ Aviso legal
□ RGPD compliant
□ Cookies consent
□ Términos servicio
□ Política cancelación

# MONITOREO
□ Sentry configurado (o logging)
□ Alertas configuradas
□ Dashboard de métricas

# BACKUP
□ Backup automático Supabase activo
□ Plan de restore documentado
□ Contacto soporte técnico

# COMUNICACIÓN
□ Email soporte configurado
□ Teléfono atención
□ Horario de soporte
```

**Entregable:** ✅ Checklist 100% completado

---

## 🚨 PLAN B - SI ALGO FALLA

### Si Holded Falla

```bash
Opción 1: Manual temporal
  - Stripe funciona
  - Crear facturas manual en Holded
  - Automatizar después del lanzamiento

Opción 2: Posponer facturación
  - Emitir facturas semanalmente
  - Batch process cada viernes
```

### Si Sentry No Da Tiempo

```bash
Alternativa: Logging mejorado
  - Console.log estructurado
  - Endpoint /api/admin/logs
  - Revisar logs 3 veces al día
  - Implementar Sentry post-lanzamiento
```

### Si Tests Fallan en QA

```bash
Estrategia: Lanzamiento Beta
  - Limitar a 10 primeros clientes
  - "Beta" badge en web
  - Descuento 20% early adopters
  - Feedback directo
  - Iteración rápida
```

---

## 📊 PLAN DE LANZAMIENTO

### Fase 1: Beta Controlada (Semana 1)

```yaml
Objetivo: Validar con usuarios reales

Límite: 10 primeros clientes
Precio: -20% descuento early adopters
Soporte: Respuesta < 2 horas
Objetivo: Encontrar bugs, mejorar UX

Acciones:
  - Email diario a clientes beta
  - Llamada de seguimiento
  - Recolectar feedback
  - Fix bugs críticos < 24h
```

### Fase 2: Lanzamiento Suave (Semana 2-3)

```yaml
Objetivo: Escalar gradualmente

Límite: 50 clientes
Precio: Normal
Soporte: Respuesta < 4 horas
Objetivo: Estabilizar sistema

Acciones:
  - Monitoring diario
  - Deploy fixes diarios
  - Tests progresivos (alcanzar 40%)
```

### Fase 3: Lanzamiento Completo (Mes 2)

```yaml
Objetivo: Apertura total

Límite: Sin límite
Precio: Normal
Soporte: Respuesta < 24h
Objetivo: Crecimiento
```

---

## 🎯 MÉTRICAS DE ÉXITO (Semana 1)

```yaml
Técnicas:
  - Uptime: > 99%
  - Error rate: < 1%
  - Tiempo respuesta API: < 500ms
  - Emails enviados: 100%
  - Pagos exitosos: > 95%

Negocio:
  - Conversión checkout: > 30%
  - Activación usuarios: > 80%
  - NPS: > 50
  - Bugs críticos: 0
  - Bugs medios: < 5
```

---

## 🔥 SPRINT DÍA 1 - HORA POR HORA

```
09:00-11:00 → Stripe a producción
11:00-14:00 → Validar Holded
14:00-15:00 → ALMUERZO
15:00-18:00 → Validación Zod endpoints
18:00-19:00 → Revisar y planificar día 2
```

## 🔥 SPRINT DÍA 2 - HORA POR HORA

```
09:00-11:00 → Sentry o logging
11:00-15:00 → QA manual completo
15:00-15:00 → ALMUERZO (rápido)
15:00-17:00 → Checklist final
17:00-18:00 → Deploy final
18:00-19:00 → Smoke test producción
19:00-20:00 → Celebrar 🎉
```

---

## ✅ ENTREGABLES FINALES

```
□ Stripe en producción
□ Holded validado (o plan B)
□ Validación Zod en críticos
□ Monitoring básico activo
□ QA manual completo
□ Checklist 100%
□ Deploy en producción
□ Smoke test OK

RESULTADO: 🚀 LIVE EN PRODUCCIÓN
```

---

## 🎉 POST-LANZAMIENTO INMEDIATO

### Primera Semana

```bash
Lunes-Viernes:
  09:00 → Revisar logs/Sentry
  10:00 → Responder tickets
  12:00 → Monitor métricas
  14:00 → Deploy fixes si necesario
  17:00 → Llamadas a clientes beta

Sábado-Domingo:
  Monitor básico
  Solo emergencias
```

### Tareas Post-Lanzamiento (Mes 1)

```yaml
Prioridad 1:
  - Implementar tests (40% coverage)
  - Mejorar monitoring
  - Documentar errores comunes

Prioridad 2:
  - Optimizar performance
  - Implementar MFA
  - Mejorar UX basado en feedback

Prioridad 3:
  - Automatizar más procesos
  - Scaling infrastructure
  - Marketing y crecimiento
```

---

## 🚀 RESUMEN EJECUTIVO

### Lo Esencial (2 Días):

1. ✅ **Stripe a producción** (2h)
2. ✅ **Holded validado** (3h)
3. ✅ **Validación crítica** (3h)
4. ✅ **Monitoring básico** (2h)
5. ✅ **QA manual** (4h)
6. ✅ **Checklist final** (2h)

**Total: 16 horas efectivas = 2 días intensivos**

### Estrategia:

```
Lanzar BETA CONTROLADA (10 clientes)
  ↓
Iterar RÁPIDO basado en feedback
  ↓
Escalar GRADUALMENTE
  ↓
DOMINAR el mercado
```

### Riesgo:

```
🟡 MEDIO-BAJO

Mitigación:
  - Beta limitada
  - Monitoring agresivo
  - Soporte directo
  - Fix rápido de bugs
```

---

**¡VAMOS A LANZAR! 🚀**
