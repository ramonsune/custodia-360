# 📧 SISTEMA DE NOTIFICACIONES POR EMAIL - CUSTODIA360

## ✅ ESTADO DE IMPLEMENTACIÓN

### Infraestructura Base (Ya existente)
- ✅ Tablas: `message_templates`, `message_jobs`, `message_recipients`
- ✅ Edge Function: `c360_mailer_dispatch` (procesa cola de emails)
- ✅ Endpoint: `/api/messages/enqueue` (encola emails)

### Nuevas Plantillas Añadidas
1. ✅ `contact-auto-reply` - Autorespuesta al contacto web
2. ✅ `contractor-confirm` - Confirmación al contratante
3. ✅ `admin-invoice` - Factura a administración
4. ✅ `delegate-welcome` - Bienvenida delegado principal
5. ✅ `delegate-supl-welcome` - Bienvenida delegado suplente
6. ✅ `billing-5m-reminder` - Recordatorio 5 meses
7. ✅ `billing-11m-reminder` - Recordatorio 11 meses

### Nuevos Endpoints/Functions
- ✅ Webhook Stripe actualizado (envía emails tras contratación)
- ✅ Edge Function `c360_billing_reminders` (recordatorios automáticos)

---

## 🔧 CONFIGURACIÓN NECESARIA

### 1. Variables de Entorno

#### En `.env.local` (desarrollo)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://gkoyqfusawhnobvkoijc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=********  # Obtener desde Supabase Dashboard
RESEND_API_KEY=re_********  # Obtener desde Resend Dashboard
NOTIFY_EMAIL_FROM=no-reply@custodia360.es
APP_BASE_URL=https://www.custodia360.es
NEXT_PUBLIC_APP_BASE_URL=https://www.custodia360.es
APP_TIMEZONE=Europe/Madrid
```

#### En Netlify (producción)
Añadir las mismas variables en: **Site Settings → Environment Variables**

### 2. Configurar Dominio en Resend

1. Ir a [Resend Dashboard](https://resend.com/domains)
2. Añadir dominio `custodia360.es`
3. Configurar registros DNS (SPF, DKIM, DMARC)
4. Verificar dominio

### 3. Desplegar Edge Functions en Supabase

```bash
cd custodia-360/supabase/functions
supabase functions deploy c360_billing_reminders
```

### 4. Configurar Cron Jobs en Supabase

Ir a **Supabase Dashboard → SQL Editor** y ejecutar:

```sql
-- Dispatcher de emails (cada 10 minutos)
select cron.schedule(
  'c360_mailer_dispatch_cron',
  '*/10 * * * *',
  $$
  select net.http_post(
      url:='https://gkoyqfusawhnobvkoijc.supabase.co/functions/v1/c360_mailer_dispatch',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) as request_id;
  $$
);

-- Recordatorios de facturación (diario 09:00 Madrid)
select cron.schedule(
  'c360_billing_reminders_cron',
  '0 8 * * *',
  $$
  select net.http_post(
      url:='https://gkoyqfusawhnobvkoijc.supabase.co/functions/v1/c360_billing_reminders',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) as request_id;
  $$
);
```

Verificar cron jobs activos:
```sql
SELECT * FROM cron.job;
```

### 5. Aplicar Migraciones

```bash
cd custodia-360
supabase db push
```

O ejecutar manualmente en SQL Editor:
- `20250116_email_templates_expansion.sql`
- `20250116_email_cron_schedules.sql`

---

## 🧪 PRUEBAS

### A) Formulario de Contacto
1. Ir a página de contacto web
2. Enviar mensaje de prueba
3. Verificar en Supabase:
   - Tabla `contact_messages` → nuevo registro
   - Tabla `message_jobs` → job con slug `contacto-auto-reply`
   - Tabla `message_recipients` → destinatario pendiente
4. Esperar 10 minutos (cron dispatcher)
5. Verificar email recibido en bandeja de entrada

### B) Contratación (Webhook Stripe)
1. Simular pago exitoso en Stripe test mode
2. Webhook debe crear jobs para:
   - `contractor-confirm` → contratante
   - `admin-invoice` → administración
   - `delegate-welcome` → delegado principal
   - `delegate-supl-welcome` → suplente (si existe)
3. Verificar en tabla `message_jobs`
4. Esperar dispatcher o invocar manualmente

### C) Recordatorios de Facturación

Para probar sin esperar meses:

```sql
-- Ajustar fecha de contratación a 5 meses atrás (150 días)
UPDATE entidades
SET contract_start_at = NOW() - INTERVAL '150 days'
WHERE id = 'UUID_ENTIDAD_PRUEBA';

-- Invocar manualmente la función
SELECT net.http_post(
  url:='https://gkoyqfusawhnobvkoijc.supabase.co/functions/v1/c360_billing_reminders',
  headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
);

-- Verificar job creado
SELECT * FROM message_jobs WHERE template_slug = 'billing-5m-reminder';
```

Repetir para 11 meses (330 días).

---

## 📊 MONITOREO

### Ver Jobs Pendientes
```sql
SELECT
  mj.id,
  mj.template_slug,
  mj.status,
  mj.created_at,
  mj.scheduled_for,
  COUNT(mr.id) as recipients
FROM message_jobs mj
LEFT JOIN message_recipients mr ON mr.job_id = mj.id
WHERE mj.status = 'queued'
GROUP BY mj.id
ORDER BY mj.created_at DESC;
```

### Ver Emails Enviados
```sql
SELECT
  mr.to_email,
  mt.nombre as template,
  mr.status,
  mr.provider_message_id,
  mr.created_at
FROM message_recipients mr
JOIN message_jobs mj ON mj.id = mr.job_id
JOIN message_templates mt ON mt.slug = mj.template_slug
WHERE mr.status = 'sent'
ORDER BY mr.created_at DESC
LIMIT 50;
```

### Ver Errores
```sql
SELECT
  mj.id,
  mj.template_slug,
  mj.error_msg,
  mr.to_email,
  mr.error_msg as recipient_error
FROM message_jobs mj
LEFT JOIN message_recipients mr ON mr.job_id = mj.id
WHERE mj.status = 'error' OR mr.status = 'error'
ORDER BY mj.created_at DESC;
```

---

## 🛠️ TROUBLESHOOTING

### Emails no se envían
1. Verificar variables de entorno (RESEND_API_KEY)
2. Verificar cron dispatcher está activo: `SELECT * FROM cron.job`
3. Verificar jobs en cola: ver query "Jobs Pendientes" arriba
4. Invocar dispatcher manualmente para testing
5. Revisar logs de Edge Function en Supabase Dashboard

### Dominio no verificado en Resend
1. Revisar configuración DNS
2. Esperar propagación (hasta 48h)
3. Mientras tanto, usar emails de test de Resend

### Recordatorios no se envían
1. Verificar campo `contract_start_at` en tabla `entidades`
2. Ejecutar query para ver entidades que califican hoy
3. Revisar logs de `c360_billing_reminders`

---

## 📈 PRÓXIMOS PASOS

1. ✅ Aplicar migraciones en Supabase
2. ✅ Configurar variables de entorno en Netlify
3. ✅ Verificar dominio en Resend
4. ✅ Desplegar Edge Function `c360_billing_reminders`
5. ✅ Programar cron jobs
6. ✅ Ejecutar pruebas A, B, C
7. ✅ Monitorear logs primeras 24h

---

## 📝 NOTAS TÉCNICAS

### Idempotencia
Todos los jobs usan `idempotency_key` para evitar duplicados.

### Rate Limiting
Resend: 100 emails/segundo en plan gratis, 1000/segundo en plan pro.
Dispatcher procesa máximo 50 jobs por ejecución.

### Reintentos
No hay reintentos automáticos. Jobs fallidos quedan con status='error'.
Implementar reintentos manualmente si es necesario.

### Seguridad
- No exponer RESEND_API_KEY al cliente
- Service Role Key solo en backend/Edge Functions
- Validar inputs en webhooks (Stripe signature)
