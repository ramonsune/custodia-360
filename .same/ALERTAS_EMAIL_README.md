# 📧 SISTEMA DE ALERTAS LOPIVI POR EMAIL

**Versión:** 1.0
**Fecha:** ${new Date().toISOString()}
**Estado:** Fase A Activa (Manual) | Fase B Preparada (Webhook)

---

## 🎯 OBJETIVO

Sistema de ingesta de alertas LOPIVI recibidas por email en **dos fases**:

- **FASE A (ACTIVA HOY):** Modo MANUAL desde panel admin
- **FASE B (FUTURO):** Webhook automático cuando exista `lopivi@custodia360.es`

---

## 📋 COMPONENTES

### 1. Base de Datos (Supabase)

**Tablas creadas:**
- `lopivi_news` - Almacena alertas/noticias LOPIVI
- `audit_events` - Auditoría de eventos del sistema
- `boe_changes` - Historial de verificaciones del BOE

**Ejecutar SQL:**
```bash
# Copiar contenido de .same/ALERTAS_EMAIL_SCHEMA.sql
# Ejecutar en Supabase > SQL Editor
```

### 2. Endpoints API

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/api/email/ingest-manual` | POST | Ingesta manual de email | ✅ ACTIVO |
| `/api/email/preview-parse` | POST | Preview sin guardar | ✅ ACTIVO |
| `/api/email/inbound` | POST | Webhook automático | ⏸️ DESACTIVADO |
| `/api/boe/health` | GET | Estado rastreador BOE | ✅ ACTIVO |
| `/api/boe/check` | POST | Ejecutar verificación BOE | ✅ ACTIVO |

### 3. Panel Admin

**Ubicación:** `/dashboard-custodia360`

**Pestaña "Alertas por Email":**
- Formulario de ingesta manual
- Preview antes de guardar
- Listado últimas 15 alertas
- Ver raw data (colapsable)
- Estado inbound (activado/desactivado)

**Pestaña "BOE":**
- Último check (fecha/hora)
- Botón "Ejecutar ahora"
- Últimos 5 cambios detectados

---

## 🚀 USO - FASE A (MANUAL)

### 1. Acceder al Panel Admin

```
https://www.custodia360.es/dashboard-custodia360
```

Login con credenciales ADMIN.

### 2. Ir a "Alertas por Email"

Click en pestaña "Alertas por Email".

### 3. Pegar Contenido del Email

**Formulario:**
- **Subject:** Asunto del email
- **From:** Remitente (ej: golee@example.com)
- **Texto:** Contenido del cuerpo (textarea)
- **HTML:** (Opcional) Si tienes HTML
- **Links:** (Opcional) Enlaces uno por línea

### 4. Previsualizar (Opcional)

Click en **"Previsualizar"** para ver cómo quedaría parseado:
- Título extraído
- Summary generado
- Links detectados
- Hash de deduplicación

### 5. Guardar

Click en **"Guardar"**.

**¿Qué pasa?**
1. Se valida y parsea el contenido
2. Se genera hash de deduplicación
3. Se verifica si ya existe (evita duplicados)
4. Se inserta en `lopivi_news`
5. Se envía notificación email a `REPORT_EMAIL`
6. Se registra en `audit_events`

**Respuesta:**
- ✅ **Guardado:** Toast verde "Alerta guardada"
- ⚠️ **Duplicado:** Toast amarillo "Alerta ya existe"
- ❌ **Error:** Toast rojo con detalles

### 6. Ver Alertas Guardadas

Scroll down para ver últimas 15 alertas.

**Cada alerta muestra:**
- Fecha de publicación
- Título
- Fuente (badge)
- Link (si existe)
- Botón "Ver raw" (colapsa/expande JSON completo)

---

## 🔮 USO - FASE B (AUTOMÁTICO)

**Estado:** ⏸️ DESACTIVADO (activar cuando exista correo)

### Prerequisitos

1. **Crear correo en Resend:**
   - Email: `lopivi@custodia360.es`
   - Dominio verificado en Resend

2. **Configurar Resend Inbound:**
   - Dashboard Resend > Domains > Inbound
   - Webhook URL: `https://www.custodia360.es/api/email/inbound`
   - Copiar Signing Secret

### Variables de Entorno

Añadir a `.env.local` y Netlify:

```env
EMAIL_INBOUND_ENABLED=true
RESEND_INBOUND_DOMAIN=inbound.custodia360.es
RESEND_INBOUND_SIGNING_SECRET=whsec_xxxxxxxxxxxxx
EMAIL_ROUTING=lopivi@custodia360.es
REPORT_EMAIL=soporte@custodia360.es
```

### Configurar DNS

```
# MX Records para recibir emails
MX 10 feedback-smtp.eu-west-1.amazonses.com
```

### Routing en Resend

```
From: *@custodia360.es
To: lopivi@custodia360.es
Forward to webhook: https://www.custodia360.es/api/email/inbound
```

### Reiniciar y Probar

1. Reiniciar servidor/deployment
2. Enviar email de prueba a `lopivi@custodia360.es`
3. Verificar en panel admin que se guardó
4. Verificar notificación recibida en `REPORT_EMAIL`

---

## 🧪 TESTING

### Test 1: Preview

```bash
curl -X POST https://www.custodia360.es/api/email/preview-parse \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test LOPIVI",
    "from": "test@example.com",
    "text": "Contenido de prueba con link https://example.com"
  }'
```

**Respuesta esperada:**
```json
{
  "preview": {
    "source": "manual",
    "title": "Test LOPIVI",
    "url": "https://example.com",
    "summary": "Contenido de prueba con link https://example.com",
    "hash": "abc123..."
  }
}
```

### Test 2: Ingesta Manual

```bash
curl -X POST https://www.custodia360.es/api/email/ingest-manual \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test LOPIVI Alerta",
    "from": "golee@example.com",
    "text": "Nueva alerta importante sobre LOPIVI"
  }'
```

**Respuesta esperada:**
```json
{
  "inserted": 1,
  "id": "uuid-...",
  "dedup": false,
  "message": "Alerta guardada exitosamente"
}
```

### Test 3: BOE Health

```bash
curl https://www.custodia360.es/api/boe/health
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "state": "healthy",
  "lastCheck": "2025-01-29T10:30:00Z",
  "minutesSinceLastCheck": 15
}
```

### Test 4: BOE Check

```bash
curl -X POST https://www.custodia360.es/api/boe/check
```

**Respuesta esperada:**
```json
{
  "changed": false,
  "method": "etag",
  "message": "No hay cambios detectados"
}
```

---

## 📊 DEDUPLICACIÓN

**Sistema de hash:**
```
hash = SHA256(title + '|' + (url || '') + '|' + published_at)
```

**Ejemplo:**
```
Input:
  title: "Nueva actualización LOPIVI"
  url: "https://boe.es/..."
  published_at: "2025-01-29T10:00:00Z"

Hash: sha256("Nueva actualización LOPIVI|https://boe.es/...|2025-01-29T10:00:00Z")
     = "a1b2c3d4..."
```

**Si el hash ya existe en BD:**
- No se inserta (dedup = true)
- Se retorna ID existente
- No se envía notificación
- Se audita como `ingest.manual.dedup`

---

## 📧 NOTIFICACIONES

**Cuándo se envían:**
- Nueva alerta ingresada (manual o webhook)
- Cambio detectado en BOE

**Destinatario:**
```
REPORT_EMAIL (env var) || RESEND_FROM_EMAIL || soporte@custodia360.es
```

**Contenido - Nueva Alerta:**
```
Subject: [Alertas LOPIVI] Nueva alerta ingresada

- Título: ...
- From: ...
- Resumen: (primeros 400 caracteres)
- Link: (si existe)
- Hash: ...
- Fecha: ...
```

**Contenido - Cambio BOE:**
```
Subject: [ALERTA BOE] Se detectó un cambio en la LOPIVI

- URL: BOE-A-2021-9347
- Método: content-hash
- Hash anterior: ...
- Hash actual: ...
- Fecha: ...
```

---

## 🔐 SEGURIDAD

- ✅ Endpoints POST requieren auth ADMIN
- ✅ Webhook verifica Resend Signing Secret
- ✅ Deduplicación por hash
- ✅ Sanitización de HTML
- ✅ Límite de tamaño (JSON < 1MB)
- ✅ RLS habilitado en tablas
- ✅ Audit logging de todos los eventos

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
custodia-360/
├── src/app/api/
│   ├── email/
│   │   ├── ingest-manual/route.ts    ✅ Ingesta manual
│   │   ├── preview-parse/route.ts     ✅ Preview
│   │   └── inbound/route.ts           ⏸️ Webhook (desactivado)
│   └── boe/
│       ├── health/route.ts            ✅ Health check
│       └── check/route.ts             ✅ Ejecutar verificación
├── .same/
│   ├── ALERTAS_EMAIL_README.md        📖 Este archivo
│   ├── ALERTAS_EMAIL_ENV_CHECK.md     🔧 Verificación ENV
│   ├── ALERTAS_EMAIL_SCHEMA.sql       💾 Schema SQL
│   └── BOE_NEWS_SMOKE.md              🧪 Smoke tests
└── .env.local
    └── (variables configuradas)
```

---

## 🆘 TROUBLESHOOTING

### Error: "Alerta ya existe"
**Causa:** Hash duplicado (ya se ingresó esta alerta)
**Solución:** Normal, sistema de deduplicación funcionando

### Error: "Error al guardar alerta"
**Causa:** Error en BD (tabla no existe, permisos, etc)
**Solución:** Ejecutar `ALERTAS_EMAIL_SCHEMA.sql` en Supabase

### Webhook no funciona
**Causa:** `EMAIL_INBOUND_ENABLED=false` o signing secret inválido
**Solución:** Verificar ENV vars en `.same/ALERTAS_EMAIL_ENV_CHECK.md`

### No llegan notificaciones
**Causa:** `RESEND_API_KEY` inválido o `REPORT_EMAIL` no configurado
**Solución:** Verificar API key en Resend dashboard

### BOE check siempre detecta cambios
**Causa:** El sitio no devuelve ETag/Last-Modified consistentes
**Solución:** Normal, el sistema usa hash de contenido como fallback

---

## 📞 SOPORTE

- **Email:** soporte@custodia360.es
- **Documentación:** `.same/ALERTAS_EMAIL_README.md`
- **ENV Check:** `.same/ALERTAS_EMAIL_ENV_CHECK.md`
- **Schema SQL:** `.same/ALERTAS_EMAIL_SCHEMA.sql`
- **Smoke Tests:** `.same/BOE_NEWS_SMOKE.md`

---

## 🎉 ¡LISTO!

El sistema está **funcionando en Fase A (manual)**.

**Próximos pasos:**
1. ✅ Ejecutar SQL schema en Supabase
2. ✅ Probar ingesta manual desde panel admin
3. ✅ Verificar notificaciones
4. ⏸️ Cuando exista correo, activar Fase B siguiendo esta guía

---

**Powered by Custodia360** 🛡️
