# 🚀 GUÍA DE CONFIGURACIÓN MANUAL - Sistema de Emails

## ✅ Lo que ya está listo (hecho por IA)

- ✅ 7 plantillas de email creadas en SQL
- ✅ Webhook de Stripe actualizado
- ✅ Edge Function de recordatorios creada
- ✅ Endpoint de pruebas implementado
- ✅ Toda la documentación

## 📋 LO QUE NECESITAS HACER TÚ (5 pasos)

---

## PASO 1: Obtener SUPABASE_SERVICE_ROLE_KEY ⏱️ 2 min

### Acciones:
1. Ve a: https://supabase.com/dashboard/project/gkoyqfusawhnobvkoijc/settings/api
2. En la sección **Project API keys**
3. Copia el valor de **service_role** (secret)
4. Pégalo en `.env.local` reemplazando:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJh... (la clave real)
   ```

---

## PASO 2: Configurar Resend ⏱️ 5 min

### 2A. Obtener API Key
1. Ve a: https://resend.com/api-keys
2. Crea una nueva API key o copia la existente
3. Pégala en `.env.local` reemplazando:
   ```
   RESEND_API_KEY=re_... (la clave real)
   ```

### 2B. Verificar Dominio custodia360.es
1. Ve a: https://resend.com/domains
2. Haz clic en **Add Domain**
3. Introduce: `custodia360.es`
4. Verás 3 registros DNS para añadir:
   - **SPF**: TXT record
   - **DKIM**: TXT record
   - **DMARC**: TXT record
5. Añade estos registros en tu proveedor DNS (donde tienes registrado custodia360.es)
6. Espera 5-15 minutos
7. Haz clic en **Verify** en Resend

**Mientras esperas la verificación DNS, puedes continuar con los siguientes pasos.**

---

## PASO 3: Aplicar Migraciones SQL en Supabase ⏱️ 3 min

### Opción A: Desde el Dashboard (RECOMENDADO)

1. Ve a: https://supabase.com/dashboard/project/gkoyqfusawhnobvkoijc/editor
2. Haz clic en **SQL Editor** (barra lateral izquierda)
3. Haz clic en **+ New Query**

#### Migración 1: Plantillas de Email
4. Abre el archivo: `custodia-360/supabase/migrations/20250116_email_templates_expansion.sql`
5. Copia TODO el contenido
6. Pégalo en el SQL Editor de Supabase
7. Haz clic en **Run** (botón verde)
8. Deberías ver: "Success. No rows returned"

#### Migración 2: Configuración de Cron
9. Haz clic en **+ New Query** de nuevo
10. Abre el archivo: `custodia-360/supabase/migrations/20250116_email_cron_schedules.sql`
11. Copia TODO el contenido
12. Pégalo en el SQL Editor
13. Haz clic en **Run**

### Verificar que funcionó:
14. Ve a **Table Editor** en la barra lateral
15. Busca la tabla `message_templates`
16. Deberías ver 7-10 plantillas de email

---

## PASO 4: Desplegar Edge Function de Recordatorios ⏱️ 2 min

### Desde el Dashboard de Supabase:

1. Ve a: https://supabase.com/dashboard/project/gkoyqfusawhnobvkoijc/functions
2. Haz clic en **Deploy a new function**
3. Nombre: `c360_billing_reminders`
4. Copia el contenido de: `custodia-360/supabase/functions/c360_billing_reminders/index.ts`
5. Pégalo en el editor
6. Haz clic en **Deploy function**

**Nota:** Ya existe una función `c360_mailer_dispatch` desplegada. No la toques.

---

## PASO 5: Configurar Cron Jobs en Supabase ⏱️ 3 min

1. Ve al **SQL Editor** de Supabase
2. Crea una **New Query**
3. Pega este código (ajusta YOUR_PROJECT_REF y YOUR_ANON_KEY):

```sql
-- Dispatcher de emails (cada 10 minutos)
select cron.schedule(
  'c360_mailer_dispatch_cron',
  '*/10 * * * *',
  $$
  select net.http_post(
      url:='https://gkoyqfusawhnobvkoijc.supabase.co/functions/v1/c360_mailer_dispatch',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrb3lxZnVzYXdobm9idmtvaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODMzOTQsImV4cCI6MjA3MTg1OTM5NH0.8PhAfdlfpiLih4_QqrfWRbn-gZ8eeWX7NaTGpO-9hyY"}'::jsonb
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
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrb3lxZnVzYXdobm9idmtvaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODMzOTQsImV4cCI6MjA3MTg1OTM5NH0.8PhAfdlfpiLih4_QqrfWRbn-gZ8eeWX7NaTGpO-9hyY"}'::jsonb
  ) as request_id;
  $$
);
```

4. Haz clic en **Run**

### Verificar que funcionó:
5. Ejecuta esta query:
```sql
SELECT * FROM cron.job;
```
6. Deberías ver 2 cron jobs activos

---

## PASO 6: Configurar Variables en Netlify (si vas a desplegar) ⏱️ 2 min

1. Ve a tu proyecto en Netlify
2. **Site settings** → **Environment variables**
3. Añade estas variables:

```
SUPABASE_SERVICE_ROLE_KEY = (la misma que pusiste en .env.local)
RESEND_API_KEY = (la misma que pusiste en .env.local)
APP_BASE_URL = https://www.custodia360.es
NEXT_PUBLIC_APP_BASE_URL = https://www.custodia360.es
NOTIFY_EMAIL_FROM = no-reply@custodia360.es
APP_TIMEZONE = Europe/Madrid
```

4. Haz clic en **Save**

---

## ✅ VERIFICACIÓN FINAL

### Probar el sistema de emails:

#### Prueba 1: Endpoint de prueba
```bash
# Desde tu terminal local:
curl -X POST http://localhost:3000/api/test-email-system \
  -H "Content-Type: application/json" \
  -d '{
    "template": "contact-auto-reply",
    "toEmail": "tu-email@example.com",
    "context": {"nombre": "Prueba"}
  }'
```

Deberías recibir un email en 10 minutos (cuando el dispatcher ejecute).

#### Prueba 2: Verificar colas en Supabase
```sql
-- Ver emails encolados
SELECT * FROM message_jobs ORDER BY created_at DESC LIMIT 10;

-- Ver destinatarios
SELECT * FROM message_recipients ORDER BY created_at DESC LIMIT 10;
```

#### Prueba 3: Ver plantillas creadas
```sql
SELECT slug, nombre, asunto FROM message_templates ORDER BY slug;
```

Deberías ver:
- admin-invoice
- billing-11m-reminder
- billing-5m-reminder
- contact-auto-reply
- contractor-confirm
- delegate-supl-welcome
- delegate-welcome
- (y otras existentes)

---

## 🎯 RESUMEN DE TIEMPO

| Paso | Tiempo | Crítico |
|------|--------|---------|
| 1. Supabase Service Key | 2 min | ✅ SÍ |
| 2. Resend API + Dominio | 5 min | ✅ SÍ |
| 3. Migraciones SQL | 3 min | ✅ SÍ |
| 4. Deploy Edge Function | 2 min | ✅ SÍ |
| 5. Cron Jobs | 3 min | ✅ SÍ |
| 6. Netlify (opcional) | 2 min | ⚠️ Solo para producción |

**TOTAL: ~15-20 minutos**

---

## 🆘 TROUBLESHOOTING

### Emails no se envían
- Verificar RESEND_API_KEY en .env.local
- Verificar dominio verificado en Resend
- Ver logs del dispatcher en Supabase Functions

### Cron jobs no ejecutan
- Verificar que están activos: `SELECT * FROM cron.job`
- Ver logs de Edge Functions en Supabase Dashboard

### Dominio no verifica en Resend
- Esperar 30-60 minutos para propagación DNS
- Verificar que los registros DNS estén correctos
- Usar herramienta: https://mxtoolbox.com/SuperTool.aspx

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa los logs en Supabase Dashboard → Functions
2. Revisa la documentación completa en `.same/email-system-setup.md`
3. Contacta a soporte de Resend si el dominio no verifica

---

✅ **Una vez completados estos pasos, el sistema de emails estará 100% operativo.**
