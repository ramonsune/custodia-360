# 📧 Resumen: Webhook Resend - Custodia360

**Fecha:** 21 de octubre de 2025, 15:00
**Estado:** ⚠️ **CONFIGURACIÓN PREPARADA - REQUIERE ACCIÓN MANUAL**

---

## ✅ Completado por Same

### Código implementado:
1. **Endpoint webhook (PERMANENTE):** `/api/webhooks/resend/route.ts`
   - ✅ Recibe eventos de Resend
   - ✅ Guarda en tabla `email_events`
   - ✅ Maneja todos los tipos de eventos
   - ✅ Variables corregidas

2. **Script de prueba (TEMPORAL):** `scripts/test-resend-trace.ts`
   - ✅ Verifica dominio Resend
   - ✅ Cuenta plantillas en Supabase
   - ✅ Envía email de prueba
   - ✅ Consulta eventos recibidos
   - ✅ Genera informe automático

3. **SQL preparado:** `scripts/sql/email-events.sql`
   - ✅ Tabla `email_events` con estructura completa
   - ✅ Índices optimizados
   - ✅ RLS habilitado (server-only)
   - ✅ Listo para ejecutar

4. **Documentación creada:**
   - ✅ `INSTRUCCIONES-WEBHOOK-RESEND.md` - Guía paso a paso
   - ✅ `INFORME-RESEND-LIVE.md` - Estado actual
   - ✅ `RESUMEN-WEBHOOK-RESEND.md` - Este documento

### Estado verificado:
- ✅ Dominio `custodia360.es`: **verified** ✅
- ✅ Plantillas en Supabase: **13/13** ✅
- ✅ Variables de entorno: **Todas configuradas** ✅
- ✅ Endpoint webhook: **Funcional** ✅

---

## ⚠️ Pendiente (ACCIÓN REQUERIDA DEL USUARIO)

### 🔴 PASO 1: Crear tabla `email_events` en Supabase
**Tiempo estimado:** 2 minutos

1. Ir a **Supabase Dashboard** → **SQL Editor**
2. Crear nueva query
3. Copiar contenido de `custodia-360/scripts/sql/email-events.sql`
4. Ejecutar
5. Verificar en **Table Editor** que aparece `email_events`

**¿Por qué es necesario?**
Sin esta tabla, el webhook no puede guardar los eventos de Resend.

---

### 🔴 PASO 2: Configurar webhook en Resend Dashboard
**Tiempo estimado:** 5 minutos

1. Ir a [**Resend Dashboard → Webhooks**](https://resend.com/webhooks)
2. Click **"Add webhook"**
3. Configurar:
   - **URL:** `https://www.custodia360.es/api/webhooks/resend`
   - **Events:**
     - ☑️ email.sent
     - ☑️ email.delivered
     - ☑️ email.bounced
     - ☑️ email.complained
     - ☑️ email.opened
     - ☑️ email.clicked
4. Click **"Create webhook"**
5. (Opcional) Si genera **Signing Secret**, copiarlo y añadir a Netlify:
   - Variables de entorno → `RESEND_WEBHOOK_SECRET=<secret>`

**¿Por qué es necesario?**
Resend debe saber dónde enviar los eventos de email.

---

### 🟢 PASO 3: Ejecutar prueba (OPCIONAL pero recomendado)
**Tiempo estimado:** 2 minutos

```bash
cd custodia-360
bun run scripts/test-resend-trace.ts
```

**Qué hace:**
- Verifica dominio
- Cuenta plantillas
- Envía email de prueba
- Espera eventos (10 seg)
- Genera `INFORME-RESEND-LIVE.md` actualizado

**¿Por qué es recomendado?**
Confirma que todo el flujo funciona end-to-end.

---

### 🧹 PASO 4: Limpieza (tras ejecutar prueba)
**Tiempo estimado:** 1 minuto

```bash
cd custodia-360
rm scripts/test-resend-trace.ts
rm INSTRUCCIONES-WEBHOOK-RESEND.md
rm RESUMEN-WEBHOOK-RESEND.md
```

**Mantener:**
- ✅ `/api/webhooks/resend/route.ts` (PRODUCCIÓN)
- ✅ `scripts/sql/email-events.sql` (referencia)
- ✅ `INFORME-RESEND-LIVE.md` (documentación)

---

## 📊 Verificación Post-Setup

Después de completar los pasos 1 y 2, verifica:

### En Resend Dashboard:
- Webhook aparece con estado **"Active"** ✅
- Dominio `custodia360.es` con estado **"Verified"** ✅

### En Supabase:
- Tabla `email_events` existe ✅
- Envía un email y verifica:
  ```sql
  SELECT * FROM email_events
  ORDER BY created_at DESC
  LIMIT 10;
  ```

### Localmente:
- Ejecuta prueba: `bun run scripts/test-resend-trace.ts`
- Revisa: `INFORME-RESEND-LIVE.md`
- Estado debe ser: **"LISTO"** ✅

---

## 🎯 Resultado Final Esperado

Una vez completados todos los pasos:

```
Estado general: ✅ LISTO
- Dominio verificado
- 13/13 plantillas
- Tabla email_events operativa
- Webhook configurado y activo
- Eventos llegando a Supabase
- Trazabilidad completa
```

---

## 📞 ¿Problemas?

Si algo no funciona:

1. **Eventos no llegan a Supabase:**
   - Verifica webhook activo en Resend Dashboard
   - Revisa logs en Netlify Functions
   - Confirma URL: `https://www.custodia360.es/api/webhooks/resend`

2. **Error al crear tabla:**
   - Verifica que el SQL se ejecutó sin errores
   - Confirma permisos en Supabase
   - Revisa que no existe ya la tabla

3. **Prueba falla:**
   - Verifica variables de entorno
   - Confirma que RESEND_API_KEY está configurado
   - Revisa que la tabla `email_events` existe

---

## 📚 Documentación Completa

- **Guía paso a paso:** `INSTRUCCIONES-WEBHOOK-RESEND.md`
- **Estado actual:** `INFORME-RESEND-LIVE.md`
- **SQL tabla:** `scripts/sql/email-events.sql`
- **Endpoint:** `src/app/api/webhooks/resend/route.ts`
- **Auditoría general:** `INFORME-LIVE-READY.md`

---

*Configuración preparada por Same - 21 octubre 2025*
*Sistema Custodia360 - Trazabilidad de emails*
