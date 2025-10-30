# 🧪 SMOKE TESTS - Sistema de Alertas LOPIVI

**Fecha ejecución:** PENDING
**Ejecutor:** PENDING
**Resultado:** PENDING

---

## ✅ CHECKLIST DE VERIFICACIÓN

### 1. Base de Datos
- [ ] Tabla `lopivi_news` creada
- [ ] Tabla `audit_events` creada
- [ ] Tabla `boe_changes` creada
- [ ] Índices creados correctamente
- [ ] RLS habilitado
- [ ] Políticas configuradas

**SQL de verificación:**
```sql
-- Verificar tablas
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('lopivi_news', 'audit_events', 'boe_changes');

-- Verificar índices
SELECT indexname FROM pg_indexes
WHERE tablename IN ('lopivi_news', 'audit_events', 'boe_changes');

-- Verificar RLS
SELECT tablename, rowsecurity FROM pg_tables
WHERE tablename IN ('lopivi_news', 'audit_events', 'boe_changes');
```

---

### 2. Endpoints API - Disponibilidad

- [ ] `GET /api/boe/health` → 200 OK
- [ ] `POST /api/boe/check` → 200 OK
- [ ] `POST /api/email/preview-parse` → 200 OK
- [ ] `POST /api/email/ingest-manual` → 200 OK
- [ ] `POST /api/email/inbound` → 503 (desactivado)

**Tests:**
```bash
# Health
curl https://www.custodia360.es/api/boe/health

# Check
curl -X POST https://www.custodia360.es/api/boe/check

# Preview
curl -X POST https://www.custodia360.es/api/email/preview-parse \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","text":"Test content"}'

# Ingest
curl -X POST https://www.custodia360.es/api/email/ingest-manual \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","from":"test@test.com","text":"Test"}'

# Inbound (debe dar 503)
curl -X POST https://www.custodia360.es/api/email/inbound
```

---

### 3. BOE Health Check

**Test:**
```bash
curl https://www.custodia360.es/api/boe/health
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "state": "healthy" | "stale" | "unknown",
  "lastCheck": "2025-01-29T...",
  "minutesSinceLastCheck": 15,
  "hasRecentChanges": false,
  "message": "..."
}
```

**Verificaciones:**
- [ ] `ok` es `true`
- [ ] `state` es válido
- [ ] `lastCheck` es timestamp ISO
- [ ] `minutesSinceLastCheck` es número o null
- [ ] Respuesta en < 2 segundos

---

### 4. BOE Check Execution

**Test:**
```bash
curl -X POST https://www.custodia360.es/api/boe/check
```

**Respuesta esperada (sin cambios):**
```json
{
  "changed": false,
  "method": "etag" | "last-modified" | "content-hash",
  "message": "No hay cambios detectados"
}
```

**Respuesta esperada (con cambios):**
```json
{
  "changed": true,
  "method": "content-hash",
  "message": "CAMBIO DETECTADO - Notificación enviada",
  "changeId": "uuid...",
  "previousHash": "abc123...",
  "currentHash": "def456..."
}
```

**Verificaciones:**
- [ ] Respuesta válida
- [ ] Se inserta registro en `boe_changes`
- [ ] Se crea evento en `audit_events`
- [ ] Si hay cambio, se envía email
- [ ] Ejecución en < 10 segundos

**Verificar en BD:**
```sql
-- Último check ejecutado
SELECT * FROM boe_changes ORDER BY created_at DESC LIMIT 1;

-- Evento auditado
SELECT * FROM audit_events
WHERE area = 'boe'
ORDER BY created_at DESC LIMIT 1;
```

---

### 5. Email Preview Parse

**Test:**
```bash
curl -X POST https://www.custodia360.es/api/email/preview-parse \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Nueva alerta LOPIVI importante",
    "from": "golee@example.com",
    "text": "Contenido de la alerta con información relevante. Ver más en https://www.boe.es/test",
    "links": ["https://www.boe.es/test", "https://example.com/extra"]
  }'
```

**Respuesta esperada:**
```json
{
  "preview": {
    "source": "manual",
    "title": "Nueva alerta LOPIVI importante",
    "url": "https://www.boe.es/test",
    "published_at": "2025-01-29T...",
    "summary": "Contenido de la alerta con información relevante. Ver más en https://www.boe.es/test",
    "hash": "sha256...",
    "raw": {...}
  },
  "meta": {
    "titleLength": 34,
    "summaryLength": 85,
    "linksCount": 2,
    "hasHtml": false,
    "estimatedSize": 450
  },
  "validation": {
    "hasTitle": true,
    "hasUrl": true,
    "hasSummary": true,
    "sizeOk": true
  }
}
```

**Verificaciones:**
- [ ] `preview.title` extraído correctamente
- [ ] `preview.url` es el primer link
- [ ] `preview.summary` tiene contenido
- [ ] `preview.hash` es SHA256 (64 chars hex)
- [ ] `meta` tiene información correcta
- [ ] `validation.sizeOk` es true
- [ ] NO se inserta en BD (solo preview)

---

### 6. Email Ingesta Manual

**Test 1: Primera ingesta (debe guardar)**
```bash
curl -X POST https://www.custodia360.es/api/email/ingest-manual \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Smoke Test Alert 001",
    "from": "smoke-test@custodia360.es",
    "text": "Esta es una alerta de smoke test para verificar el sistema de ingesta manual. Contacto: https://www.custodia360.es"
  }'
```

**Respuesta esperada:**
```json
{
  "inserted": 1,
  "id": "uuid...",
  "dedup": false,
  "hash": "abc123...",
  "message": "Alerta guardada exitosamente"
}
```

**Verificaciones:**
- [ ] `inserted` es 1
- [ ] `id` es UUID válido
- [ ] `dedup` es false (primera vez)
- [ ] Se inserta en `lopivi_news`
- [ ] Se crea evento en `audit_events` (ingest.manual)
- [ ] Se envía email a `REPORT_EMAIL`

**Test 2: Re-ingesta (debe deduplicar)**
```bash
# Repetir mismo curl
```

**Respuesta esperada:**
```json
{
  "inserted": 0,
  "dedup": true,
  "message": "Alerta ya existe (hash duplicado)",
  "hash": "abc123..."
}
```

**Verificaciones:**
- [ ] `inserted` es 0
- [ ] `dedup` es true
- [ ] NO se inserta duplicado
- [ ] Se audita como `ingest.manual.dedup`
- [ ] NO se envía email

**Verificar en BD:**
```sql
-- Alerta guardada
SELECT * FROM lopivi_news
WHERE source = 'manual'
AND title LIKE '%Smoke Test Alert 001%';

-- Eventos auditados
SELECT * FROM audit_events
WHERE area = 'email'
AND payload->>'title' LIKE '%Smoke Test Alert 001%';
```

---

### 7. Email Inbound Webhook (debe estar desactivado)

**Test:**
```bash
curl -X POST https://www.custodia360.es/api/email/inbound \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

**Respuesta esperada:**
```json
{
  "error": "Email inbound webhook no está habilitado",
  "message": "Configura EMAIL_INBOUND_ENABLED=true en variables de entorno"
}
```

**Status esperado:** `503`

**Verificaciones:**
- [ ] Status es 503
- [ ] Mensaje indica que está desactivado
- [ ] Se audita evento `inbound.disabled`

---

### 8. Notificaciones Email

**Verificar:**
- [ ] Email recibido en `REPORT_EMAIL` por alerta nueva
- [ ] Asunto correcto: `[Alertas LOPIVI] Nueva alerta ingresada`
- [ ] Contenido incluye título, from, resumen, link
- [ ] Contenido incluye hash y fecha
- [ ] Email formateado correctamente (HTML)

**Verificar en Resend Dashboard:**
- [ ] Email enviado
- [ ] Email entregado (delivered)
- [ ] Sin errores de envío

---

### 9. Audit Events

**Verificar todos los eventos auditados:**
```sql
SELECT
  area,
  event_type,
  level,
  created_at,
  payload->>'title' as title
FROM audit_events
WHERE created_at > now() - interval '1 hour'
ORDER BY created_at DESC;
```

**Eventos esperados:**
- [ ] `boe` / `check.executed` o `nochange`
- [ ] `email` / `ingest.manual`
- [ ] `email` / `ingest.manual.dedup`
- [ ] `email` / `notify.sent`
- [ ] `email` / `inbound.disabled`

---

### 10. Panel Admin (UI)

**Acceder a:** `https://www.custodia360.es/dashboard-custodia360`

**Pestaña "Alertas por Email":**
- [ ] Se ve formulario de ingesta manual
- [ ] Campos: Subject, From, Texto, HTML, Links
- [ ] Botones: Previsualizar, Guardar
- [ ] Se ve badge "Inbound: desactivado"
- [ ] Se ve listado de últimas alertas
- [ ] Cada alerta muestra fecha, título, fuente, link
- [ ] Botón "Ver raw" funciona (colapsa/expande)

**Pestaña "BOE":**
- [ ] Se ve "Último check" con fecha
- [ ] Se ve botón "Ejecutar ahora"
- [ ] Se ven últimos cambios (si hay)

**Interactividad:**
- [ ] Formulario permite pegar texto
- [ ] Previsualizar muestra datos parseados
- [ ] Guardar muestra toast de éxito/dedup/error
- [ ] Listado se actualiza después de guardar
- [ ] "Ejecutar ahora" ejecuta check y muestra resultado

---

## 📊 RESULTADO FINAL

### ✅ Tests Pasados: ___ / 10
### ❌ Tests Fallidos: ___ / 10
### ⏸️ Tests Skipped: ___ / 10

---

## 🐛 ISSUES ENCONTRADOS

<!-- Documentar aquí cualquier problema encontrado -->

| # | Área | Descripción | Severidad | Estado |
|---|------|-------------|-----------|--------|
| 1 |  |  |  |  |
| 2 |  |  |  |  |

---

## 📝 NOTAS

<!-- Añadir observaciones generales -->

---

## ✅ APROBACIÓN

- [ ] Todos los tests críticos pasados
- [ ] Issues documentados
- [ ] Sistema listo para Fase A (manual)
- [ ] Documentación completa

**Aprobado por:** _______________
**Fecha:** _______________

---

**Powered by Custodia360** 🛡️
