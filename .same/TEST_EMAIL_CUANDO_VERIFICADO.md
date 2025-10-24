# 🧪 PRUEBAS FINALES DEL SISTEMA DE EMAILS

## ⏳ ESTADO ACTUAL

✅ **Completado:**
- [x] Claves de API configuradas (SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY)
- [x] Registros DNS añadidos en Hostinger
- [x] Migraciones SQL aplicadas (plantillas de email)
- [x] Cron jobs programados en Supabase

⏳ **En espera:**
- [ ] Verificación del dominio custodia360.es en Resend (propagación DNS)

---

## 🎯 CUANDO EL DOMINIO ESTÉ VERIFICADO

### 1️⃣ Verificar estado del dominio

Ve a https://resend.com/domains y verifica que `custodia360.es` muestre:
- ✅ **Status: Verified** (o similar)
- ✅ Todos los registros DNS en verde

---

### 2️⃣ Prueba 1: Endpoint de test manual

Abre tu terminal y ejecuta:

```bash
curl -X POST http://localhost:3000/api/test-email-system \
  -H "Content-Type: application/json" \
  -d '{
    "template": "contact-auto-reply",
    "toEmail": "TU_EMAIL_AQUI@example.com",
    "context": {
      "nombre": "Prueba Test"
    }
  }'
```

**Reemplaza `TU_EMAIL_AQUI@example.com`** con tu email real.

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Email de prueba encolado exitosamente",
  "job": {
    "id": 123,
    "template": "contact-auto-reply",
    "to": "tu-email@example.com",
    "context": {...}
  },
  "nextSteps": [...]
}
```

---

### 3️⃣ Prueba 2: Verificar cola en Supabase

1. Ve a: https://supabase.com/dashboard/project/gkoyqfusawhnobvkoijc/editor
2. Abre el **SQL Editor**
3. Ejecuta esta query:

```sql
-- Ver el job que acabas de crear
SELECT
  mj.id,
  mj.template_slug,
  mj.status,
  mj.created_at,
  mr.to_email,
  mr.status as recipient_status
FROM message_jobs mj
LEFT JOIN message_recipients mr ON mr.job_id = mj.id
ORDER BY mj.created_at DESC
LIMIT 10;
```

**Resultado esperado:**
- Deberías ver una fila con `template_slug = 'contact-auto-reply'`
- `status = 'queued'` (pendiente de envío)
- `recipient_status = 'pending'`

---

### 4️⃣ Prueba 3: Invocar el dispatcher manualmente

Como el dispatcher se ejecuta cada 10 minutos, puedes invocarlo manualmente:

1. Ve a: https://supabase.com/dashboard/project/gkoyqfusawhnobvkoijc/functions
2. Busca la función **c360_mailer_dispatch**
3. Haz clic en **Invoke**
4. Deja el body vacío: `{}`
5. Haz clic en **Run**

**Resultado esperado:**
```json
{
  "success": true,
  "processed": 1,
  "results": [
    {
      "jobId": 123,
      "sent": 1,
      "errors": 0
    }
  ]
}
```

---

### 5️⃣ Prueba 4: Verificar email recibido

1. **Revisa tu bandeja de entrada** (el email que pusiste en la prueba 1)
2. Deberías recibir un email de: `noreply@custodia360.es`
3. Asunto: `Custodia360 | Hemos recibido tu mensaje`
4. Contenido:
   ```
   Hola Prueba Test,

   Gracias por contactarnos. Hemos recibido tu solicitud y en breve nos pondremos en contacto contigo.

   Un saludo,
   Equipo Custodia360
   ```

**⚠️ Si no lo recibes:**
- Revisa la carpeta de SPAM
- Espera 1-2 minutos
- Verifica los logs del dispatcher en Supabase

---

### 6️⃣ Prueba 5: Verificar estado en Supabase

Ejecuta esta query para ver si se envió correctamente:

```sql
SELECT
  mr.to_email,
  mr.status,
  mr.provider_message_id,
  mr.rendered_subject,
  mr.error_msg,
  mr.created_at
FROM message_recipients mr
WHERE mr.to_email = 'TU_EMAIL_AQUI@example.com'
ORDER BY mr.created_at DESC
LIMIT 5;
```

**Resultado esperado:**
- `status = 'sent'` ✅
- `provider_message_id` tiene un valor (ID de Resend)
- `error_msg` está vacío (NULL)

---

## 🎉 SI TODO FUNCIONA

### Próximos pasos automáticos que ya funcionarán:

1. **Formulario de contacto web** → Auto-respuesta + notificación interna
2. **Contratación Stripe exitosa** → 4 emails automáticos:
   - Confirmación al contratante
   - Factura a administración
   - Bienvenida al delegado principal
   - Bienvenida al delegado suplente (si existe)
3. **Recordatorios automáticos:**
   - A los 5 meses → Recordatorio 30 días antes del 2º tramo
   - A los 11 meses → Recordatorio 30 días antes del pago anual

---

## 🧪 PRUEBAS ADICIONALES (Opcional)

### Probar otras plantillas:

```bash
# Prueba: Confirmación al contratante
curl -X POST http://localhost:3000/api/test-email-system \
  -H "Content-Type: application/json" \
  -d '{
    "template": "contractor-confirm",
    "toEmail": "tu-email@example.com",
    "context": {
      "responsable": "Juan Pérez",
      "entidad": "Colegio San José",
      "plan_nombre": "Plan Básico LOPIVI"
    }
  }'

# Prueba: Bienvenida delegado
curl -X POST http://localhost:3000/api/test-email-system \
  -H "Content-Type: application/json" \
  -d '{
    "template": "delegate-welcome",
    "toEmail": "tu-email@example.com",
    "context": {
      "delegado_nombre": "María García",
      "delegado_email": "maria@example.com"
    }
  }'

# Prueba: Recordatorio 5 meses
curl -X POST http://localhost:3000/api/test-email-system \
  -H "Content-Type: application/json" \
  -d '{
    "template": "billing-5m-reminder",
    "toEmail": "tu-email@example.com",
    "context": {
      "entidad": "Colegio San José",
      "plan_nombre": "Plan Básico LOPIVI"
    }
  }'
```

---

## 📊 MONITOREO CONTINUO

### Ver todos los emails enviados hoy:

```sql
SELECT
  mt.nombre as template,
  mr.to_email,
  mr.status,
  mr.created_at
FROM message_recipients mr
JOIN message_jobs mj ON mj.id = mr.job_id
JOIN message_templates mt ON mt.slug = mj.template_slug
WHERE mr.created_at >= CURRENT_DATE
ORDER BY mr.created_at DESC;
```

### Ver emails con error:

```sql
SELECT
  mj.template_slug,
  mr.to_email,
  mr.error_msg,
  mj.error_msg as job_error,
  mr.created_at
FROM message_recipients mr
JOIN message_jobs mj ON mj.id = mr.job_id
WHERE mr.status = 'error' OR mj.status = 'error'
ORDER BY mr.created_at DESC;
```

### Ver próximos cron jobs:

```sql
SELECT
  jobname,
  schedule,
  active,
  jobid
FROM cron.job
WHERE active = true;
```

---

## ⏱️ TIEMPO DE PROPAGACIÓN DNS

**Estimación de verificación del dominio:**
- ✅ **Rápido (5-30 min):** Hostinger normalmente propaga rápido
- ⏳ **Normal (1-4 horas):** Propagación DNS estándar
- 🐌 **Lento (24-48 horas):** Casos raros

**Mientras esperas:**
- Puedes probar enviando emails a direcciones de Resend en modo sandbox
- O esperar pacientemente la verificación completa

**Verificar propagación manual:**
https://mxtoolbox.com/SuperTool.aspx
- Introduce: `custodia360.es`
- Verifica que aparezcan los registros TXT de SPF y DKIM

---

## 🆘 TROUBLESHOOTING

### Email no se recibe
1. Verificar dominio está 100% verificado en Resend
2. Revisar carpeta SPAM
3. Ver logs del dispatcher en Supabase Functions
4. Ejecutar query de errores (ver arriba)

### Dispatcher no procesa
1. Verificar cron job está activo: `SELECT * FROM cron.job`
2. Invocar manualmente desde Supabase Functions
3. Ver variables de entorno en Edge Function

### Dominio no verifica
1. Esperar 24-48 horas completas
2. Verificar registros DNS en Hostinger están exactos
3. Usar herramienta: https://mxtoolbox.com/SuperTool.aspx

---

## ✅ CHECKLIST FINAL

Marca cuando completes cada prueba:

- [ ] Dominio verificado en Resend
- [ ] Prueba 1: Email de test encolado ✅
- [ ] Prueba 2: Job visible en Supabase ✅
- [ ] Prueba 3: Dispatcher invocado manualmente ✅
- [ ] Prueba 4: Email recibido en bandeja ✅
- [ ] Prueba 5: Status 'sent' en DB ✅
- [ ] (Opcional) Probadas 2-3 plantillas más
- [ ] Cron jobs verificados activos

---

🎉 **Cuando todas las pruebas pasen, el sistema estará 100% operativo**
