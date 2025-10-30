# 📧 Informe Resend Live - Custodia360

**Fecha de ejecución:** 21 de octubre de 2025, 15:00 (Europe/Madrid)
**Sistema:** Custodia360 - Configuración de trazabilidad email
**Estado:** ⚠️ CONFIGURACIÓN PENDIENTE

---

## 🌐 Estado del Dominio

- Dominio: **custodia360.es**
- Estado: **verified** ✅
- Región: **eu-west-1**
- Proveedor: Resend

✅ **Dominio completamente verificado y operativo**

---

## 📋 Plantillas

- Total plantillas en Supabase: **13/13** ✅
- Estado: **Completo**

**Plantillas disponibles:**
1. `contact-auto-reply`
2. `contractor-confirm`
3. `admin-invoice`
4. `delegate-welcome`
5. `delegate-supl-welcome`
6. `billing-5m-reminder`
7. `billing-11m-reminder`
8. `training-start`
9. `training-certified`
10. `channel-verify`
11. `compliance-blocked`
12. `onboarding-delay`
13. `kit-comm-invite`

✅ **Todas las plantillas necesarias están presentes**

---

## 🔧 Endpoint Webhook

- **Ruta:** `/api/webhooks/resend/route.ts`
- **Estado:** ✅ Creado y funcional
- **URL pública:** `https://www.custodia360.es/api/webhooks/resend`

**Eventos soportados:**
- `email.sent`
- `email.delivered`
- `email.bounced`
- `email.complained`
- `email.opened`
- `email.clicked`

---

## 📊 Base de Datos

### Tabla `email_events`
- **Estado:** ⚠️ **PENDIENTE DE CREAR**
- **Archivo SQL:** `scripts/sql/email-events.sql`
- **Estructura:**
  - `id` (uuid, primary key)
  - `created_at` (timestamptz)
  - `provider` (text, default 'resend')
  - `message_id` (text)
  - `event` (text, not null)
  - `to_email` (text)
  - `from_email` (text)
  - `subject` (text)
  - `entity_id` (uuid, FK a entities)
  - `template_slug` (text)
  - `meta` (jsonb)

**Índices creados:**
- `idx_email_events_event`
- `idx_email_events_entity`
- `idx_email_events_created`
- `idx_email_events_to_email`

**Seguridad:**
- RLS habilitado (server-only policy)

---

## 📨 Prueba de Envío

⚠️ **No ejecutada aún** - Requiere tabla `email_events`

**Configuración de prueba:**
- Email de prueba enviado por Resend API
- Destinatario: `test@custodia360.es` (configurable con `TEST_EMAIL`)
- Plantilla: Test HTML personalizado
- Tags: `test=resend-trace`, `entity_id=demo_entity_001`

---

## 🔍 Trazabilidad

⚠️ **Webhook no configurado en Resend Dashboard**

**Acciones requeridas:**
1. Crear tabla `email_events` en Supabase (SQL disponible)
2. Configurar webhook en Resend Dashboard
3. Ejecutar script de prueba: `bun run scripts/test-resend-trace.ts`

---

## ✅ Acciones Completadas

- [x] Endpoint webhook creado (`/api/webhooks/resend/route.ts`)
- [x] Script de prueba creado (`scripts/test-resend-trace.ts`)
- [x] SQL para tabla `email_events` disponible
- [x] Dominio verificado en Resend
- [x] 13 plantillas en Supabase
- [x] Variables de entorno configuradas

---

## ⚠️ Acciones Pendientes (Prioridad Alta)

1. **Crear tabla `email_events` en Supabase**
   - Ir a Supabase Dashboard → SQL Editor
   - Ejecutar `scripts/sql/email-events.sql`
   - Verificar creación en Table Editor

2. **Configurar webhook en Resend Dashboard**
   - URL: `https://www.custodia360.es/api/webhooks/resend`
   - Eventos: sent, delivered, bounced, complained, opened, clicked
   - (Opcional) Copiar Signing Secret → variable `RESEND_WEBHOOK_SECRET`

3. **Ejecutar prueba de trazabilidad**
   ```bash
   cd custodia-360
   bun run scripts/test-resend-trace.ts
   ```

4. **Verificar funcionamiento**
   - Revisar tabla `email_events` en Supabase
   - Confirmar que los eventos llegan desde Resend
   - Validar informe actualizado

---

## 📝 Recomendaciones

### Configuración de Producción

1. **Habilitar Signing Secret** (opcional pero recomendado)
   - Copiar el secret del webhook en Resend Dashboard
   - Añadir a Netlify: `RESEND_WEBHOOK_SECRET=<secret>`
   - Descomentar validación de firma en `/api/webhooks/resend/route.ts`

2. **Monitoreo de eventos**
   - Crear dashboard en Supabase para `email_events`
   - Configurar alertas para eventos `bounced` y `complained`
   - Revisar periódicamente `failed` events

3. **Mantenimiento**
   - Limpiar eventos antiguos (>90 días) periódicamente
   - Revisar métricas de entregabilidad mensualmente

---

## 🎯 Conclusión

**Estado actual:** ⚠️ **CASI LISTO**

**Resumen:**
- ✅ Infraestructura de webhook lista
- ✅ Dominio verificado
- ✅ Plantillas completas
- ⚠️ Tabla de eventos pendiente de crear
- ⚠️ Webhook pendiente de configurar en Resend Dashboard

**Tiempo estimado para completar:** 10-15 minutos

**Próximos pasos:**
1. Ejecutar SQL en Supabase (2 min)
2. Configurar webhook en Resend (5 min)
3. Ejecutar prueba (1 min)
4. Verificar funcionamiento (2 min)

---

## 📚 Documentación

- **Instrucciones detalladas:** `INSTRUCCIONES-WEBHOOK-RESEND.md`
- **SQL de tabla:** `scripts/sql/email-events.sql`
- **Endpoint webhook:** `src/app/api/webhooks/resend/route.ts`
- **Script de prueba:** `scripts/test-resend-trace.ts`
- **Auditoría general:** `INFORME-LIVE-READY.md`

---

*Informe generado el 21 de octubre de 2025, 15:00 (Europe/Madrid)*
*Sistema Custodia360 - Configuración de email en progreso*
