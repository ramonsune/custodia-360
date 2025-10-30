# 📧 Instrucciones: Activar Webhook Resend

## ⚠️ ACCIONES REQUERIDAS

### 1️⃣ Crear tabla `email_events` en Supabase

**Pasos:**
1. Ir a Supabase Dashboard → SQL Editor
2. Crear una nueva query
3. Copiar y pegar el contenido del archivo `scripts/sql/email-events.sql`
4. Ejecutar la query
5. Verificar que la tabla `email_events` aparece en Table Editor

**Archivo SQL:** `custodia-360/scripts/sql/email-events.sql`

---

### 2️⃣ Configurar Webhook en Resend Dashboard

**Pasos:**
1. Ir a [Resend Dashboard](https://resend.com/webhooks)
2. Click en "Add webhook"
3. Configurar:
   - **URL:** `https://www.custodia360.es/api/webhooks/resend`
   - **Events:**
     - ✅ `email.sent`
     - ✅ `email.delivered`
     - ✅ `email.bounced`
     - ✅ `email.complained`
     - ✅ `email.opened`
     - ✅ `email.clicked`
4. (Opcional) Copiar el **Signing Secret** si se genera
5. Si copiaste el Secret, añadirlo a Netlify:
   - Variables de entorno → `RESEND_WEBHOOK_SECRET=<el_secret>`
6. Click en "Create webhook"
7. Verificar que aparece en la lista como "Active"

---

### 3️⃣ Verificar Dominio (si no está verificado)

**Pasos:**
1. Ir a [Resend Dashboard → Domains](https://resend.com/domains)
2. Verificar que `custodia360.es` tiene estado **Verified** ✅
3. Si no está verificado:
   - Click en el dominio
   - Seguir las instrucciones para añadir registros DNS
   - Esperar verificación (puede tardar unos minutos)

---

### 4️⃣ Ejecutar prueba de trazabilidad

Una vez completados los pasos 1, 2 y 3:

```bash
cd custodia-360
bun run scripts/test-resend-trace.ts
```

Esto:
- Verificará el dominio
- Contará las plantillas en Supabase
- Enviará un email de prueba
- Esperará 10 segundos
- Consultará si los eventos llegaron a `email_events`
- Generará el informe `INFORME-RESEND-LIVE.md`

---

## ✅ Estado Actual

### Completado:
- ✅ Endpoint webhook creado: `/api/webhooks/resend/route.ts`
- ✅ Script de prueba creado: `scripts/test-resend-trace.ts`
- ✅ Dominio verificado: `custodia360.es` (estado: verified)
- ✅ 13 plantillas en Supabase

### Pendiente:
- ⚠️ Crear tabla `email_events` en Supabase (Paso 1)
- ⚠️ Configurar webhook en Resend Dashboard (Paso 2)
- ⚠️ Ejecutar prueba de trazabilidad (Paso 4)

---

## 🔍 Verificación Post-Setup

Después de configurar todo, verifica:

1. **Webhook activo:**
   - Resend Dashboard → Webhooks → debe aparecer con estado "Active"

2. **Eventos llegando:**
   - Envía un email de prueba
   - Espera 1-2 minutos
   - Consulta en Supabase: `SELECT * FROM email_events ORDER BY created_at DESC LIMIT 10`

3. **Informe generado:**
   - Archivo `INFORME-RESEND-LIVE.md` debe mostrar estado "LISTO"

---

## 📞 Soporte

Si algo no funciona:
1. Verifica que las variables de entorno estén configuradas
2. Revisa los logs de Netlify Functions
3. Consulta el informe de auditoría: `INFORME-LIVE-READY.md`
