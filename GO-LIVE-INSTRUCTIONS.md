# 🚀 INSTRUCCIONES GO-LIVE - Custodia360

**Objetivo:** Dejar Custodia360 100% lista para operar en producción HOY.

**Scope:** Todo excepto pagos/facturación (Stripe).

---

## 📋 CHECKLIST PRE-FLIGHT

### 1. Variables de Entorno en Netlify

Verificar que estas variables estén configuradas en **Netlify Dashboard** → Site Settings → Environment Variables:

```
✅ APP_BASE_URL = https://www.custodia360.es
✅ NEXT_PUBLIC_APP_BASE_URL = https://www.custodia360.es
✅ NEXT_PUBLIC_SUPABASE_URL = <ya configurado>
✅ SUPABASE_SERVICE_ROLE_KEY = <ya configurado>
✅ RESEND_API_KEY = <ya configurado>
✅ NOTIFY_EMAIL_FROM = no-reply@custodia360.es
✅ APP_TIMEZONE = Europe/Madrid
```

### 2. Verificar Dominio Resend

1. Ir a [Resend Dashboard](https://resend.com/domains)
2. Verificar que `custodia360.es` está **verified** ✅
3. Si no está verificado, seguir instrucciones de DNS

### 3. Verificar Redirect SPA en netlify.toml

Confirmar que existe este redirect (ya está en el archivo):

```toml
[[redirects]]
  from = "/onboarding/*"
  to = "/onboarding/:splat"
  status = 200
```

---

## 🗄️ PASO 1: EJECUTAR SCRIPT SQL EN SUPABASE

### Qué hace este script:
- Crea/verifica todas las tablas necesarias
- Añade índices de rendimiento
- Configura triggers y RLS
- Backfill de `entity_compliance`

### Cómo ejecutarlo:

1. Ir a **Supabase Dashboard** → SQL Editor
2. Abrir archivo: `scripts/sql/live-ready-all.sql`
3. Copiar TODO el contenido
4. Pegar en el editor SQL
5. Click **Run** o `Ctrl+Enter`
6. Verificar mensajes de éxito

**Esperado:** Mensajes `✅` confirmando creación de tablas, índices, triggers, RLS, backfill.

---

## 💾 PASO 2: CREAR BUCKETS DE STORAGE EN SUPABASE

**IMPORTANTE:** Los buckets NO se pueden crear con SQL, debes crearlos manualmente.

### Bucket 1: public-pdfs (Público)

1. Ir a **Supabase Dashboard** → Storage
2. Click **Create bucket**
3. Nombre: `public-pdfs`
4. Public: ✅ **SÍ** (marcar checkbox)
5. Allowed MIME types: `application/pdf`
6. File size limit: `10 MB`
7. Click **Create bucket**

### Bucket 2: private-pdfs (Privado)

1. Click **Create bucket**
2. Nombre: `private-pdfs`
3. Public: ❌ **NO** (dejar sin marcar)
4. Allowed MIME types: `application/pdf`
5. File size limit: `10 MB`
6. Click **Create bucket**

### Configurar Políticas RLS

Para `public-pdfs`:
- **SELECT:** Público (cualquiera puede leer)
- **INSERT:** Solo service_role

Para `private-pdfs`:
- **SELECT:** Solo owner o entity_id
- **INSERT:** Solo service_role

*(Las políticas se pueden configurar desde Storage → Policies)*

---

## 📧 PASO 3: VERIFICAR PLANTILLAS DE EMAIL

### Opción A: Insertar plantillas manualmente

1. Ir a **Supabase Dashboard** → Table Editor → `message_templates`
2. Verificar que existen **13 plantillas**

Si no existen, necesitas crearlas. Las plantillas requeridas son:

1. `contractor-confirm` - Confirmación al contratante
2. `admin-invoice` - Factura al admin
3. `delegate-welcome` - Bienvenida delegado principal
4. `delegate-supl-welcome` - Bienvenida delegado suplente
5. `training-start` - Inicio de formación
6. `kit-comm-invite` - Invitación kit comunicación
7. `onboarding-delay` - Recordatorio configuración
8. `compliance-alert` - Alerta de cumplimiento
9. `certificate-issued` - Certificado emitido
10. `entity-ready` - Entidad lista
11. `billing-reminder` - Recordatorio facturación
12. `renewal-notice` - Aviso renovación
13. `system-notice` - Aviso del sistema

### Opción B: Script de inserción

*(Si tienes un script SQL para las plantillas, ejecutarlo aquí)*

---

## 🧪 PASO 4: EJECUTAR SMOKE TEST E2E

Este test verifica que todo funciona end-to-end.

### Ejecutar:

```bash
curl -X POST https://www.custodia360.es/api/_e2e/live-smoke
```

**O desde el navegador:**

1. Abrir DevTools (F12)
2. Ir a Console
3. Ejecutar:
```javascript
fetch('/api/_e2e/live-smoke', { method: 'POST' })
  .then(r => r.json())
  .then(data => console.log(data))
```

### Resultado Esperado:

```json
{
  "success": true,
  "status": "ok",
  "checks": {
    "entity_created": true,
    "auth_users_created": true,
    "token_generated": true,
    "emails_queued": true,
    "pdfs_generated": true,
    "onboarding_accessible": true,
    "cleanup_done": true
  },
  "markdown": "..."
}
```

**Si algún check falla:** Revisar logs y corregir el problema antes de continuar.

---

## 📊 PASO 5: GENERAR INFORME GO-LIVE

```bash
curl https://www.custodia360.es/api/_audit/go-live
```

**O desde el navegador:**

```javascript
fetch('/api/_audit/go-live')
  .then(r => r.json())
  .then(data => console.log(data.markdown))
```

### Resultado:

- Status: `ok` | `warn` | `fail`
- Markdown completo con estado del sistema
- Archivo `INFORME-GO-LIVE.md` generado en raíz

**Revisar el informe completo** para ver:
- ✅ Qué está activo
- ⏳ Qué queda pendiente
- ❌ Qué falló (si aplica)

---

## 🧹 PASO 6: LIMPIEZA DE DATOS DE PRUEBA

Ejecutar script de limpieza en Supabase:

1. Ir a **Supabase Dashboard** → SQL Editor
2. Abrir: `scripts/sql/live-cleanup.sql`
3. Copiar y pegar
4. Ejecutar

**Qué hace:**
- Elimina emails de prueba (dry_run=true)
- Elimina tokens expirados
- Elimina entidades de prueba (test%, demo%, audit%, e2e%)
- Limpia logs antiguos

**SEGURO:** No toca datos reales de producción.

---

## 🗑️ PASO 7: ELIMINAR ENDPOINTS TEMPORALES

Una vez completados los pasos 4 y 5, **eliminar estos archivos:**

```bash
rm custodia-360/src/app/api/_e2e/live-smoke/route.ts
rm custodia-360/src/app/api/_audit/go-live/route.ts
```

**O hacerlo desde el IDE:**
- Borrar carpeta `/src/app/api/_e2e`
- Borrar carpeta `/src/app/api/_audit`

**Luego hacer deploy:**

```bash
git add .
git commit -m "Remove temporary E2E and audit endpoints after GO-LIVE"
git push
```

---

## ✅ PASO 8: VERIFICACIÓN FINAL

### Pruebas Manuales:

1. **Página de inicio:**
   - Abrir https://www.custodia360.es
   - Verificar que carga correctamente

2. **Proceso de contratación:**
   - Ir a `/contratar`
   - Completar formulario de prueba
   - Verificar que NO se procesa pago (normal, Stripe no está activo)
   - Verificar emails enviados (revisar Resend Dashboard)

3. **Activación manual con API:**
```javascript
fetch('/api/contracting/activate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    entity: { nombre: 'Test Manual', sector_code: 'general' },
    contratante: { email: 'test@test.com', nombre: 'Test' },
    admin_email: 'admin@test.com',
    delegado: { email: 'delegado@test.com', nombre: 'Delegado Test', password: 'Test123!' },
    plan: { code: 'plan100' }
  })
}).then(r => r.json()).then(console.log)
```

4. **Onboarding:**
   - Usar el `onboarding_token` de la respuesta anterior
   - Ir a `/onboarding/{token}`
   - Verificar que carga y muestra selector de roles

5. **PDFs:**
   - Verificar que se generan correctamente:
```javascript
// Certificado
fetch('/api/pdfs/certificate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ person_id: '{person_id}', entity_id: '{entity_id}' })
})

// Training pack
fetch('/api/pdfs/training-pack', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ entity_id: '{entity_id}' })
})
```

6. **Paneles:**
   - `/dashboard-delegado` ✅
   - `/dashboard-entidad` ✅
   - `/dashboard-admin` ✅

7. **Crons (verificar en Netlify):**
   - Netlify Dashboard → Functions → Scheduled
   - Verificar que aparecen los 5 crons configurados
   - Verificar que se están ejecutando (ver logs)

---

## 📈 MONITOREO POST GO-LIVE

### Logs a Revisar:

1. **Netlify Function Logs:**
   - Verificar ejecución de crons cada 10 minutos (mailer)
   - Verificar daily audit cada día a las 09:00 Madrid

2. **Supabase Logs:**
   - Table Editor → `admin_health_logs`
   - Verificar entradas de `smoke_e2e`, `daily_audit`, etc.

3. **Resend Dashboard:**
   - Verificar emails enviados
   - Verificar eventos (delivered, opened, etc.)

### Métricas Clave:

- **Entidades creadas:** `SELECT COUNT(*) FROM entities`
- **Usuarios Auth:** Supabase → Auth → Users
- **Emails enviados:** `SELECT COUNT(*) FROM message_jobs WHERE status='sent'`
- **PDFs generados:** Storage → public-pdfs y private-pdfs

---

## ⚠️ ÚNICO PENDIENTE: STRIPE

**Todo lo demás está listo.** Solo falta:

1. Configurar variables de Stripe:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

2. Descomentar código Stripe en:
   - `/api/kit-comunicacion/purchase/route.ts`
   - Cualquier otra API de pagos

3. Configurar webhook en Stripe Dashboard:
   - URL: `https://www.custodia360.es/api/webhooks/stripe`
   - Eventos: `payment_intent.succeeded`, `customer.subscription.updated`, etc.

4. Probar flujo de pago completo

---

## 🎉 SISTEMA LISTO

Si todos los pasos anteriores se completaron exitosamente:

✅ **Custodia360 está lista para operar en producción**

- Web live
- Supabase configurado
- Resend operativo
- PDFs funcionando
- Onboarding completo
- Paneles activos
- Crons automatizados
- Sistema de compliance operativo

**Único pendiente:** Stripe (pagos/facturación)

---

## 📞 SOPORTE

Si encuentras problemas:

1. Revisar `INFORME-GO-LIVE.md` generado
2. Revisar logs de Netlify Functions
3. Revisar tabla `admin_health_logs` en Supabase
4. Contactar soporte: info@custodia360.es

---

*Documento generado por Custodia360 GO-LIVE System*
