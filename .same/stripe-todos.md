# 🎯 Custodia360 - Integración Stripe: Sistema de Pagos Divididos

**Última actualización**: 22 de octubre de 2025, 22:30 Europe/Madrid
**Versión**: v198

---

## ✅ FASE 1: Base de Pagos Divididos (COMPLETADO)

- [x] Schema SQL para pagos divididos (`.same/sql-payment-system.sql`)
- [x] Configuración de Stripe (claves, price IDs en `.env.local` y `netlify.toml`)
- [x] Integración de Kit de Comunicación con Stripe Checkout
- [x] Webhook handler para eventos de Stripe (`/api/stripe/webhook`)
- [x] Página de confirmación de pago (`/contratacion-exitosa`)
- [x] Endpoint de checkout para planes (`/api/planes/checkout`)
- [x] Función de cálculo de precios (`src/lib/pricing.ts`)
- [x] Tabla `payment_tokens` para tokens seguros
- [x] Documentación: `.same/stripe-integration.md`
- [x] Documentación: `.same/stripe-implementation-summary.md`

**Fecha de completación**: 22 de octubre de 2025

---

## ✅ FASE 2: Scheduled Functions (COMPLETADO)

### Funciones Programadas (Cron Jobs)

- [x] **`c360_payment_reminders.ts`** - Recordatorios automáticos
  - Envío 30 días antes del segundo pago
  - Generación de token seguro (60 días de validez)
  - Emails a contratante, delegado principal y admin
  - Cron programado: 09:00 Europe/Madrid (08:00 UTC)
  - Estado: Pendiente de activación en Netlify

- [x] **`c360_payment_retry.ts`** - Reintentos automáticos
  - Máximo 3 intentos de cobro (espaciados 3 días)
  - Cobro con Stripe Payment Intent (off_session)
  - Inicio automático de período de gracia tras 3 fallos
  - Cron programado: 10:00 Europe/Madrid (09:00 UTC)
  - Estado: Pendiente de activación en Netlify

- [x] **`c360_payment_grace_enforcement.ts`** - Control de gracia y bloqueo
  - Verificación diaria de período de gracia (7 días)
  - Bloqueo automático de cuenta tras expiración
  - Recordatorios urgentes cuando quedan ≤3 días
  - Cron programado: 11:00 Europe/Madrid (10:00 UTC)
  - Estado: Pendiente de activación en Netlify

### Sistema de Actualización de Tarjeta

- [x] **API endpoint** (`/api/payment/update-card`)
  - POST: Crear Stripe Setup Intent
  - PUT: Confirmar actualización de payment method
  - Validación de tokens de seguridad
  - Manejo de expiración (60 días)

- [x] **Página pública** (`/actualizar-tarjeta`)
  - Interfaz con Stripe Elements (CardElement)
  - Validación de token en tiempo real
  - UI de éxito/error clara y profesional
  - Responsive y accesible
  - URL: `https://www.custodia360.es/actualizar-tarjeta?token={token}`

### Dependencias Instaladas

- [x] `@stripe/stripe-js@8.1.0`
- [x] `@stripe/react-stripe-js@5.2.0`

### Configuración

- [x] Actualizado `netlify.toml` con 3 nuevos cron jobs
- [x] Variables de entorno configuradas

### Documentación

- [x] `.same/stripe-phase-2-scheduled-functions.md` (completo)
  - Diagramas de flujo
  - Descripción de cada función
  - Testing checklist
  - Troubleshooting guide

**Fecha de completación**: 22 de octubre de 2025

---

## 📋 FASE 3: Templates de Email (PENDIENTE)

**Prioridad**: Alta
**Tiempo estimado**: 2-3 horas

Crear 7 templates en Supabase `message_templates`:

### Templates Requeridos

1. **payment_reminder**
   - Asunto: "Recordatorio: Segundo Pago {plan} en 30 días"
   - Contenido: Fecha pago, monto, link actualizar tarjeta
   - Variables: `{entidad_nombre}`, `{plan}`, `{payment_amount}`, `{payment_date}`, `{update_card_url}`

2. **payment_success**
   - Asunto: "✅ Segundo Pago Procesado - {plan}"
   - Contenido: Confirmación, fecha, número de factura
   - Variables: `{entidad_nombre}`, `{plan}`, `{amount}`, `{payment_date}`, `{invoice_number}`

3. **payment_retry_failed**
   - Asunto: "⚠️ Intento de Pago Fallido ({retry}/3)"
   - Contenido: Motivo, próximo intento (3 días), link actualizar tarjeta
   - Variables: `{entidad_nombre}`, `{plan}`, `{amount}`, `{retry_attempt}`, `{next_retry_days}`, `{error_reason}`

4. **payment_grace_period**
   - Asunto: "⚠️ URGENTE: Período de Gracia (7 días)"
   - Contenido: 3 intentos fallidos, plazo 7 días, consecuencias de bloqueo
   - Variables: `{entidad_nombre}`, `{plan}`, `{amount}`, `{grace_days}`, `{deadline_date}`

5. **grace_period_urgent**
   - Asunto: "⚠️ URGENTE: {days} días para evitar bloqueo de cuenta"
   - Contenido: Recordatorio crítico, deadline específico, contacto soporte
   - Variables: `{entidad_nombre}`, `{plan}`, `{amount_due}`, `{days_remaining}`, `{deadline_date}`

6. **account_suspended**
   - Asunto: "🚫 Cuenta Suspendida por Pago Pendiente"
   - Contenido: Motivo, monto pendiente, contacto soporte
   - Variables: `{entidad_nombre}`, `{plan}`, `{amount_due}`, `{blocked_date}`, `{contact_email}`

7. **payment_method_updated**
   - Asunto: "Método de Pago Actualizado - Custodia360"
   - Contenido: Confirmación de actualización exitosa
   - Variables: `{entidad_nombre}`, `{updated_date}`

### Tareas

- [ ] Diseñar HTML profesional para cada template (usar paleta Custodia360)
- [ ] Crear versión de texto plano (fallback)
- [ ] Agregar variables dinámicas {{variable_name}}
- [ ] Insertar en Supabase con SQL script
- [ ] Testing de envío con message_jobs
- [ ] Verificar renderizado en diferentes clientes de email

---

## 📋 FASE 4: UI de Contratación (PENDIENTE)

**Prioridad**: Alta
**Tiempo estimado**: 4-5 horas

### Página Principal de Contratación

- [ ] **Crear `/contratar` page**
  - Selector de plan (4 opciones: 100, 250, 500, 500+)
  - Cards visuales con precios y características
  - Checkbox "Kit de Comunicación" (+48,40€)
  - Checkbox "Delegado Suplente" (+24,20€)
  - Breakdown de precios en tiempo real
  - Formulario de datos completo

- [ ] **Formulario de datos**
  - **Sección 1: Datos de la Entidad**
    - Nombre de la entidad
    - CIF
    - Dirección completa
    - Teléfono
    - Sector/CNAE (selector)
    - Número de menores

  - **Sección 2: Datos del Contratante**
    - Nombre completo
    - Email
    - Teléfono
    - Contraseña (para panel de acceso)

  - **Sección 3: Delegado Principal**
    - Nombre
    - Apellidos
    - DNI
    - Email
    - Teléfono

- [ ] **Integración con Checkout**
  - Submit → Validación frontend
  - POST a `/api/planes/checkout`
  - Redirección a Stripe Checkout
  - Manejo de success (`/contratacion-exitosa`)
  - Manejo de cancel (volver a `/contratar`)

- [ ] **Componentes Reutilizables**
  - `PlanSelector.tsx` - Cards de planes con hover effects
  - `PriceBreakdown.tsx` - Desglose visual de precios
  - `ExtrasSelector.tsx` - Checkboxes estilizados
  - `ContractingForm.tsx` - Formulario multi-sección

- [ ] **Validaciones**
  - Email único (verificar en backend)
  - CIF formato español
  - DNI formato español
  - Teléfono formato español
  - Campos requeridos marcados

---

## 📋 FASE 5: Panel de Gestión de Pagos (PENDIENTE)

**Prioridad**: Media
**Tiempo estimado**: 3-4 horas

### Dashboard de Entidad - Sección de Pagos

- [ ] **Tarjeta "Estado de Segundo Pago"**
  - Fecha programada
  - Monto pendiente (con desglose)
  - Estado actual (pending/reminded/paid/failed/grace_period)
  - Días restantes hasta la fecha
  - Indicador visual de estado

- [ ] **Botón "Actualizar Método de Pago"**
  - Genera token seguro (60 días)
  - Muestra URL con token
  - Opción de enviar email con link
  - Copiar al portapapeles

- [ ] **Historial de Facturas**
  - Lista de todas las facturas
  - Filtros (por tipo, por estado, por fecha)
  - Descarga de PDF por factura
  - Vista previa de factura
  - Búsqueda por número de factura

- [ ] **Tarjeta Registrada**
  - Últimos 4 dígitos
  - Tipo de tarjeta (Visa, Mastercard, etc.)
  - Fecha de vencimiento
  - Botón para actualizar

### Dashboard de Admin - Gestión de Pagos

- [ ] **Lista de Entidades con Pagos Pendientes**
  - Tabla con: nombre, plan, monto, fecha, estado
  - Ordenable por columnas
  - Búsqueda global
  - Filtros: por estado, por plan, por fecha

- [ ] **Acciones de Admin**
  - Forzar reintento de cobro manual
  - Generar token de actualización de tarjeta
  - Ver detalles en Stripe Dashboard (link directo)
  - Cancelar segundo pago manualmente
  - Marcar como pagado manualmente (con justificación)

- [ ] **Estadísticas de Pagos**
  - Total de pagos pendientes este mes
  - Tasa de éxito de reintentos
  - Cuentas en período de gracia
  - Cuentas bloqueadas
  - Gráficas de evolución

---

## 🧪 Testing y Producción (PENDIENTE)

### Testing Local

- [ ] **Ejecutar SQL Schema**
  - Abrir Supabase SQL Editor
  - Ejecutar `.same/sql-payment-system.sql`
  - Verificar columnas añadidas en `entities`
  - Verificar tabla `payment_tokens` creada
  - Verificar índices creados

- [ ] **Configurar Variables de Entorno**
  - Obtener `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` desde Stripe Dashboard
  - Actualizar `.env.local`
  - Reiniciar servidor de desarrollo

- [ ] **Probar Flujo de Contratación**
  - Seleccionar plan 250 + Kit + Suplente
  - Llenar formulario completo
  - Confirmar redirección a Stripe Checkout
  - Usar tarjeta de prueba `4242 4242 4242 4242`
  - Verificar redirección a `/contratacion-exitosa`
  - Confirmar entidad creada en Supabase
  - Confirmar factura guardada
  - Verificar emails encolados

- [ ] **Probar Actualización de Tarjeta**
  - Generar token manualmente en Supabase
  - Acceder a `/actualizar-tarjeta?token={token}`
  - Introducir nueva tarjeta de prueba
  - Confirmar actualización exitosa
  - Verificar `stripe_payment_method_id` actualizado
  - Verificar token marcado como `used`

- [ ] **Simular Scheduled Functions**
  - Crear entidades de prueba con fechas específicas
  - Ejecutar funciones manualmente (curl local)
  - Verificar logs en consola
  - Confirmar emails encolados
  - Verificar estados actualizados

### Testing de Cron Jobs en Netlify

- [ ] **Desplegar a Netlify**
  - Build y deploy
  - Verificar 3 nuevos cron jobs en Functions tab
  - Confirmar horarios programados (UTC)

- [ ] **Test Manual de Funciones**
  ```bash
  # Payment Reminders
  curl -X POST https://custodia360.netlify.app/.netlify/functions/c360_payment_reminders

  # Payment Retry
  curl -X POST https://custodia360.netlify.app/.netlify/functions/c360_payment_retry

  # Grace Enforcement
  curl -X POST https://custodia360.netlify.app/.netlify/functions/c360_payment_grace_enforcement
  ```

- [ ] **Verificar Logs**
  - Acceder a Netlify Functions → Logs
  - Verificar ejecuciones sin errores
  - Confirmar output esperado
  - Verificar duración < 10s

- [ ] **Monitoreo Primera Ejecución Automática**
  - Esperar primera ejecución programada
  - Verificar en logs que ejecutó correctamente
  - Confirmar emails enviados (si aplicable)
  - Verificar base de datos actualizada

### Producción

- [ ] **CRÍTICO: Stripe Publishable Key**
  - Ir a Stripe Dashboard → Developers → API keys
  - Copiar Publishable key (empieza con `pk_test_...`)
  - Actualizar `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` en Netlify

- [ ] **Configurar Webhook en Stripe Dashboard**
  - Ir a Stripe Dashboard → Developers → Webhooks
  - Click "Add endpoint"
  - URL: `https://www.custodia360.es/api/stripe/webhook`
  - Seleccionar eventos:
    - `checkout.session.completed`
    - `payment_intent.succeeded`
    - `payment_intent.payment_failed`
  - Copiar webhook secret (`whsec_...`)
  - Actualizar `STRIPE_WEBHOOK_SECRET` en Netlify
  - Guardar

- [ ] **Testing en Producción**
  - Realizar compra de prueba con tarjeta real (Plan 100)
  - Verificar webhook recibido
  - Confirmar entidad creada
  - Confirmar emails enviados
  - Verificar factura generada

- [ ] **Migrar a Claves de Producción** (cuando se apruebe)
  - Activar cuenta de Stripe en modo Live
  - Actualizar `STRIPE_SECRET_KEY` (live)
  - Actualizar `STRIPE_PUBLISHABLE_KEY` (live)
  - Recrear webhook con URL producción
  - Actualizar Price IDs a versiones live

- [ ] **Activar Monitoreo**
  - Configurar alertas en Netlify para fallos de funciones
  - Monitorear logs diariamente primera semana
  - Revisar dashboard de Stripe regularmente

---

## 📊 Progreso Global

| Fase | Estado | Completado | Pendiente | %  |
|------|--------|------------|-----------|-----|
| FASE 1: Base | ✅ Completado | 10/10 | 0/10 | 100% |
| FASE 2: Scheduled Functions | ✅ Completado | 7/7 | 0/7 | 100% |
| FASE 3: Templates Email | ⏳ Pendiente | 0/7 | 7/7 | 0% |
| FASE 4: UI Contratación | ⏳ Pendiente | 0/8 | 8/8 | 0% |
| FASE 5: Panel Gestión | ⏳ Pendiente | 0/6 | 6/6 | 0% |
| Testing & Producción | ⏳ Pendiente | 0/12 | 12/12 | 0% |

**Progreso Total**: 34% (17/50 tareas completadas)

---

## 🎯 Próximos Pasos Recomendados

### Acción Inmediata (10 min)

1. **Ejecutar SQL Schema en Supabase**
   - Archivo: `.same/sql-payment-system.sql`
   - Acción: Copiar y ejecutar en SQL Editor
   - Resultado: Tablas y columnas de pagos creadas

2. **Obtener Stripe Publishable Key**
   - Dashboard: https://dashboard.stripe.com/test/apikeys
   - Copiar: `pk_test_...`
   - Actualizar: `.env.local` y Netlify

### Esta Semana (6-8 horas)

3. **FASE 3: Crear Templates de Email**
   - Diseñar 7 templates HTML profesionales
   - Insertar en Supabase
   - Testing con message_jobs

4. **FASE 4: Construir UI de Contratación**
   - Página `/contratar` completa
   - Componentes reutilizables
   - Integración con `/api/planes/checkout`

### Próxima Semana (4-6 horas)

5. **FASE 5: Panel de Gestión de Pagos**
   - Sección en dashboard de entidad
   - Dashboard de admin para gestión
   - Estadísticas y reportes

6. **Testing Completo**
   - Pruebas locales exhaustivas
   - Deploy y testing de cron jobs
   - Verificación en producción

---

## 📁 Archivos Implementados

### FASE 1 (Completada)

1. `src/lib/pricing.ts` - Lógica de cálculo de precios
2. `src/app/api/planes/checkout/route.ts` - Endpoint de checkout
3. `src/app/contratacion-exitosa/page.tsx` - Página de confirmación
4. `.same/sql-payment-system.sql` - Schema SQL
5. `.same/stripe-integration.md` - Documentación FASE 1
6. `.same/stripe-implementation-summary.md` - Resumen FASE 1

### FASE 2 (Completada)

7. `netlify/functions/c360_payment_reminders.ts` - Cron recordatorios
8. `netlify/functions/c360_payment_retry.ts` - Cron reintentos
9. `netlify/functions/c360_payment_grace_enforcement.ts` - Cron gracia/bloqueo
10. `src/app/api/payment/update-card/route.ts` - API actualizar tarjeta
11. `src/app/actualizar-tarjeta/page.tsx` - Página actualizar tarjeta
12. `.same/stripe-phase-2-scheduled-functions.md` - Documentación FASE 2
13. `netlify.toml` - Actualizado con 3 cron jobs

### Dependencias Añadidas

- `@stripe/stripe-js@8.1.0`
- `@stripe/react-stripe-js@5.2.0`

---

## 🐛 Issues Conocidos

Ninguno reportado hasta el momento.

---

## 📞 Soporte

**Documentación Stripe**: https://stripe.com/docs
**Dashboard Stripe**: https://dashboard.stripe.com
**Testing Cards**: https://stripe.com/docs/testing

**Archivos de referencia**:
- `.same/stripe-integration.md` - Integración general
- `.same/stripe-phase-2-scheduled-functions.md` - Scheduled functions
- `.same/sql-payment-system.sql` - Schema SQL

---

**Documento actualizado**: 22 de octubre de 2025, 22:30 Europe/Madrid
**Versión**: v198
**Autor**: Sistema Custodia360
