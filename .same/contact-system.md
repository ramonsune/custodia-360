# 📧 Sistema de Contacto - Custodia360

## ✅ INTEGRADO CON EMAIL SYSTEM

El formulario de contacto usa la infraestructura de emails existente (Resend + Supabase).

---

## 📦 COMPONENTES

### 1. Base de Datos

**Tabla:** `contact_messages`
```sql
- id: BIGINT (auto-incremento)
- name: TEXT
- email: TEXT
- phone: TEXT
- subject: TEXT
- message: TEXT
- consent: BOOLEAN
- ip: TEXT
- user_agent: TEXT
- created_at: TIMESTAMPTZ
```

### 2. Plantillas de Email

**A) Notificación interna** (`contacto-web`)
- Destinatario: `nandolmo@teamsml.com` (configurable via env var)
- Asunto: `[Custodia360] Nuevo mensaje de contacto: {{subject}}`
- Contiene: Todos los datos del formulario + IP + User Agent

**B) Auto-respuesta** (`contacto-auto-reply`)
- Destinatario: Email del remitente
- Asunto: `Custodia360 | Hemos recibido tu mensaje`
- Contiene: Confirmación profesional + email de contacto

---

## ⚙️ CONFIGURACIÓN

### Variables de Entorno

```bash
# Destinatarios de notificaciones internas (separados por coma)
CONTACT_NOTIFY_TO=nandolmo@teamsml.com

# Email para "Reply-To" en auto-respuesta
CONTACT_REPLY_TO=info@custodia360.es
```

---

## 🔌 API ENDPOINT

### POST `/api/public/contact`

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "678771198",
  "subject": "Consulta sobre Plan 100",
  "message": "Hola, necesito información...",
  "consent": true,
  "honeypot": ""
}
```

**Validaciones:**
- ✅ `honeypot` vacío (antispam)
- ✅ Campos requeridos: name, email, subject, message
- ✅ Email válido (regex)
- ✅ Consentimiento RGPD (`consent === true`)

**Response:**
```json
{
  "ok": true
}
```

**Error:**
```json
{
  "ok": false,
  "error": "Descripción del error"
}
```

---

## 📨 FLUJO DE EMAILS

### 1. Usuario envía formulario

### 2. Backend valida datos

### 3. Guarda en `contact_messages`

### 4. Encola 2 jobs:

**Job 1: Notificación interna**
- Template: `contacto-web`
- Recipient: `nandolmo@teamsml.com`
- Context: Todos los datos + metadata
- Status: `queued`

**Job 2: Auto-respuesta**
- Template: `contacto-auto-reply`
- Recipient: Email del remitente
- Context: `{ name, reply_to }`
- Status: `queued`

### 5. Dispatcher procesa (cada 10 min)

Edge Function `c360-mailer-dispatch` toma los jobs y envía via Resend.

### 6. Webhooks actualizan estados

Resend envía eventos (sent/delivered/bounced) a `/api/webhooks/resend`.

---

## 🔐 SEGURIDAD

### Honeypot
Campo oculto `honeypot`:
- Si está lleno → bot detectado
- Responde `{ ok: true }` silenciosamente (no procesa)

### Rate Limiting
- Opcional: Implementar control por IP/tiempo
- Considerar si hay abuso

### RGPD
- Checkbox obligatorio
- Link a política de privacidad
- Validación en backend (`consent === true`)

### Datos Mínimos
Solo se guarda:
- Datos del formulario
- IP (para seguridad)
- User Agent (para detección de bots)

### NO se adjuntan archivos
No se permite subir archivos en formulario (seguridad).

---

## 📊 MONITOREO

### Queries Útiles

```sql
-- Mensajes recientes
SELECT * FROM contact_messages
ORDER BY created_at DESC
LIMIT 50;

-- Mensajes por día
SELECT
  DATE(created_at) as fecha,
  COUNT(*) as total
FROM contact_messages
GROUP BY DATE(created_at)
ORDER BY fecha DESC;

-- Emails más activos
SELECT
  email,
  COUNT(*) as total
FROM contact_messages
GROUP BY email
ORDER BY total DESC;

-- Jobs de contacto encolados
SELECT * FROM message_jobs
WHERE template_slug IN ('contacto-web', 'contacto-auto-reply')
AND status = 'queued';

-- Tasa de éxito de envíos
SELECT
  template_slug,
  status,
  COUNT(*) as total
FROM message_jobs
WHERE template_slug IN ('contacto-web', 'contacto-auto-reply')
GROUP BY template_slug, status;
```

---

## 🧪 TESTING

### Test Manual

1. **Abrir** `https://www.custodia360.es/contacto`
2. **Rellenar** formulario con datos reales
3. **Marcar** checkbox RGPD
4. **Enviar** formulario

### Verificaciones

**✅ Frontend:**
- Mensaje de éxito verde aparece
- Formulario se limpia
- No hay errores en consola

**✅ Base de Datos:**
```sql
SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 1;
```

**✅ Jobs encolados:**
```sql
SELECT * FROM message_jobs
WHERE template_slug IN ('contacto-web', 'contacto-auto-reply')
ORDER BY created_at DESC
LIMIT 2;
```

**✅ Recipients:**
```sql
SELECT * FROM message_recipients
WHERE job_id IN (
  SELECT id FROM message_jobs
  WHERE template_slug IN ('contacto-web', 'contacto-auto-reply')
  ORDER BY created_at DESC
  LIMIT 2
);
```

**✅ Emails recibidos:**
- `nandolmo@teamsml.com` recibe notificación con detalle completo
- Email del remitente recibe auto-respuesta profesional

---

## 🎨 UI DEL FORMULARIO

### Campos

| Campo | Tipo | Requerido | Placeholder |
|-------|------|-----------|-------------|
| Nombre | text | Sí | Tu nombre completo |
| Email | email | Sí | tu@email.com |
| Teléfono | tel | No | 678 771 198 |
| Asunto | text | Sí | ¿Sobre qué quieres consultar? |
| Mensaje | textarea | Sí | Cuéntanos cómo podemos ayudarte... |
| RGPD | checkbox | Sí | Acepto política de privacidad... |
| honeypot | text | - | (oculto) |

### Estados

**Loading:**
- Botón disabled
- Texto: "Enviando..."
- Spinner (opcional)

**Success:**
- Banner verde con ✅
- Mensaje: "Mensaje enviado correctamente. Gracias."
- Formulario se limpia
- Banner desaparece tras 5 segundos

**Error:**
- Banner rojo con descripción
- Sugerencia: "Por favor, escribe a info@custodia360.es"

---

## 🔄 INTEGRACIÓN CON EMAIL SYSTEM

Este sistema **NO duplica infraestructura**, sino que **reutiliza** todo:

✅ Mismas tablas (`message_templates`, `message_jobs`, `message_recipients`)
✅ Mismo dispatcher (`c360-mailer-dispatch`)
✅ Mismo webhook (`/api/webhooks/resend`)
✅ Mismo proveedor (Resend)
✅ Mismas URLs absolutas (`absoluteUrl()`)

**Solo agrega:**
- Nueva tabla: `contact_messages` (log específico)
- 2 nuevas plantillas
- 1 nuevo endpoint público
- Formulario UI en `/contacto`

---

## 📝 EJEMPLO DE EMAIL RECIBIDO

### Notificación Interna (nandolmo@teamsml.com)

```
Asunto: [Custodia360] Nuevo mensaje de contacto: Consulta sobre Plan 100

Has recibido un mensaje desde la página de contacto:

Nombre: Juan Pérez
Email: juan@example.com
Teléfono: 678 771 198
Asunto: Consulta sobre Plan 100

Mensaje:
Hola, me gustaría información sobre el Plan 100 para mi club deportivo.
¿Cuál es el proceso de implementación?

Fecha: 11/01/2025, 14:30
Origen: 192.168.1.1 — Mozilla/5.0...
```

### Auto-respuesta (juan@example.com)

```
Asunto: Custodia360 | Hemos recibido tu mensaje

Hola Juan Pérez,

Gracias por contactar con Custodia360. Hemos recibido tu mensaje y en breve
nuestro sistema y/o un responsable se pondrá en contacto contigo.

Si tu consulta es urgente, puedes escribirnos a info@custodia360.es.

Un saludo,
Equipo Custodia360
www.custodia360.es
```

---

## 🚨 TROUBLESHOOTING

| Problema | Solución |
|----------|----------|
| No llega email a nandolmo | Verificar `CONTACT_NOTIFY_TO` en env vars |
| No llega auto-respuesta | Verificar email válido + jobs encolados |
| Error "Campos requeridos" | Verificar todos los campos obligatorios |
| Error "Email inválido" | Verificar formato email correcto |
| Error "Política privacidad" | Marcar checkbox RGPD |
| Bot spam | Honeypot detecta y responde silenciosamente |

---

## 📚 ARCHIVOS RELACIONADOS

- **Migración:** `supabase/migrations/20250111_contact_system.sql`
- **Endpoint:** `src/app/api/public/contact/route.ts`
- **Página:** `src/app/contacto/page.tsx`
- **Dispatcher:** `supabase/functions/c360-mailer-dispatch/index.ts` (sin cambios)
- **Webhook:** `src/app/api/webhooks/resend/route.ts` (sin cambios)

---

**Status:** ✅ Implementado y listo
**Integración:** 100% con email system existente
**Fecha:** 11 Enero 2025
