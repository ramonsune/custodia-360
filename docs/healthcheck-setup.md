# 🏥 Configuración del Sistema HealthCheck Diario

**Fecha de implementación:** 19 de octubre de 2025
**Modo:** Consolidación

---

## 📋 Resumen

Sistema de monitoreo diario automatizado que verifica la salud de toda la infraestructura de Custodia360 y alerta en caso de problemas.

---

## ⚙️ Componentes Implementados

### 1. Endpoint API
**Archivo:** `src/app/api/jobs/healthcheck/route.ts`

**Funcionalidad:**
- Verifica Stripe webhook configurado
- Valida estado del sistema Netlify
- Revisa jobs fallidos en últimas 24h
- Consulta últimos 5 eventos en email_events
- Genera alertas según prioridad
- Registra resultados en `.same/todos.md`

### 2. Función Programada Netlify
**Archivo:** `netlify/functions/c360_healthcheck.ts`

**Horario:** Diario a las 07:00 UTC (≈ 08:00 Europe/Madrid)

**Configuración en `netlify.toml`:**
```toml
[[scheduled.functions]]
cron = "0 7 * * *"
path = "/.netlify/functions/c360_healthcheck"
```

---

## 🔍 Checks Realizados

### 1. Stripe Webhook
- **Verifica:** Variable `STRIPE_WEBHOOK_SECRET` configurada
- **Prioridad:** 🔴 CRÍTICA
- **Acción si falla:** Email inmediato al admin

### 2. Último Build Netlify
- **Verifica:** Sistema ejecutándose (healthcheck activo)
- **Prioridad:** 🔴 CRÍTICA
- **Acción si falla:** Email inmediato al admin

### 3. Cron Jobs (últimas 24h)
- **Verifica:** Jobs en `message_jobs` con status `failed`
- **Tolerancia:** ≤3 fallos (WARNING), >3 fallos (CRITICAL)
- **Prioridad:** 🔴 CRÍTICA si >3 fallos, 🟡 WARNING si 1-3
- **Acción:** Email con detalles de jobs fallidos

### 4. Email Events
- **Verifica:** Existencia de tabla + últimos 5 eventos
- **Prioridad:** 🟡 WARNING si tabla no existe
- **Acción:** Info en log, no crítico

---

## 📊 Estados del HealthCheck

| Estado | Descripción | Acción |
|--------|-------------|--------|
| **OK** ✅ | Todos los checks pasaron | Solo log en `.same/todos.md` |
| **WARNING** ⚠️ | Checks no críticos fallaron | Email + log |
| **CRITICAL** 🔴 | Checks críticos fallaron | Email urgente + log |

---

## 📧 Configuración de Alertas por Email

### Plantilla Requerida en Resend

**Slug:** `admin-healthcheck-alert`

**Asunto:** `⚠️ HealthCheck {{status}}: Custodia360`

**Contenido sugerido:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>HealthCheck Alert</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #dc2626;">⚠️ HealthCheck Alert</h1>

  <p><strong>Estado:</strong> <span style="color: {{#if critical}}#dc2626{{else}}#f59e0b{{/if}}">{{status}}</span></p>
  <p><strong>Timestamp:</strong> {{timestamp}}</p>

  <h2>Alertas Detectadas:</h2>
  <ul>
    {{#each alerts}}
    <li>{{this}}</li>
    {{/each}}
  </ul>

  <h2>Detalles de los Checks:</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Stripe Webhook:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{stripe_webhook}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Netlify Build:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{netlify_build}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Cron Jobs:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{cron_jobs}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email Events:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{email_events}}</td>
    </tr>
  </table>

  <p style="margin-top: 20px;">
    <a href="https://www.custodia360.es/admin"
       style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Ver Panel Admin
    </a>
  </p>

  <p style="color: #666; font-size: 12px; margin-top: 30px;">
    Este email se envía automáticamente cuando el sistema detecta problemas.<br>
    Para más información, revisa los logs en Netlify Dashboard.
  </p>
</body>
</html>
```

### Variables de la plantilla:
- `status` - Estado del healthcheck (OK, WARNING, CRITICAL)
- `timestamp` - Fecha y hora de ejecución
- `alerts` - Array de alertas generadas
- `stripe_webhook` - Mensaje del check de Stripe
- `netlify_build` - Mensaje del check de Netlify
- `cron_jobs` - Mensaje del check de cron jobs
- `email_events` - Mensaje del check de email events
- `critical` - Boolean indicando si es crítico

---

## 📁 Registro en .same/todos.md

Cada ejecución del healthcheck añade una entrada al final del archivo `.same/todos.md`:

```markdown
### 🏥 HealthCheck 19/10/2025, 08:00:00 - Estado: ✅ OK
- Stripe Webhook: ✅ Webhook configurado correctamente
- Netlify Build: ✅ Build ejecutándose correctamente (healthcheck activo)
- Cron Jobs (24h): ✅ Sin fallos en últimas 24h
- Email Events: ✅ 5 eventos recientes encontrados
```

En caso de problemas:

```markdown
### 🏥 HealthCheck 19/10/2025, 08:00:00 - Estado: 🔴 CRITICAL
- Stripe Webhook: ❌ STRIPE_WEBHOOK_SECRET no configurado
- Netlify Build: ✅ Build ejecutándose correctamente (healthcheck activo)
- Cron Jobs (24h): ❌ 5 jobs fallidos (excesivo)
- Email Events: ✅ 3 eventos recientes encontrados
- **Alertas:** 🔴 CRÍTICO: Stripe webhook no configurado - pagos no operativos, 🔴 CRÍTICO: 5 jobs fallidos en últimas 24h - revisar urgentemente
```

---

## 🧪 Testing Manual

### Ejecutar healthcheck manualmente:

```bash
curl -X POST https://www.custodia360.es/api/jobs/healthcheck \
  -H "x-internal-cron: 1" \
  -H "Content-Type: application/json"
```

### Respuesta esperada:

```json
{
  "ok": true,
  "result": {
    "timestamp": "19/10/2025, 08:00:00",
    "status": "OK",
    "checks": {
      "stripe_webhook": {
        "ok": true,
        "message": "Webhook configurado correctamente"
      },
      "netlify_build": {
        "ok": true,
        "message": "Build ejecutándose correctamente"
      },
      "cron_jobs": {
        "ok": true,
        "message": "Sin fallos en últimas 24h",
        "failed": 0
      },
      "email_events": {
        "ok": true,
        "message": "5 eventos recientes encontrados",
        "count": 5
      }
    },
    "alerts": []
  },
  "summary": {
    "status": "OK",
    "timestamp": "19/10/2025, 08:00:00",
    "alerts": 0,
    "critical": false
  }
}
```

---

## 📊 Monitoreo del HealthCheck

### Ver logs en Netlify:
1. Ir a Netlify Dashboard
2. Functions > c360_healthcheck
3. Ver logs de ejecución

### Ver histórico en .same/todos.md:
```bash
tail -50 .same/todos.md | grep "HealthCheck"
```

### Consultar últimos jobs fallidos:
```sql
SELECT * FROM message_jobs
WHERE status = 'failed'
  AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

---

## 🔧 Configuración Adicional

### Cambiar horario de ejecución

Editar `netlify.toml`:

```toml
[[scheduled.functions]]
cron = "0 9 * * *"  # 09:00 UTC ≈ 10:00 Madrid
path = "/.netlify/functions/c360_healthcheck"
```

### Desactivar temporalmente

Comentar la sección en `netlify.toml`:

```toml
# [[scheduled.functions]]
# cron = "0 7 * * *"
# path = "/.netlify/functions/c360_healthcheck"
```

### Añadir checks personalizados

Editar `src/app/api/jobs/healthcheck/route.ts` y añadir nuevas verificaciones.

---

## ✅ Checklist de Implementación

- [x] Endpoint API creado (`/api/jobs/healthcheck`)
- [x] Función Netlify creada (`c360_healthcheck.ts`)
- [x] Cron job configurado en `netlify.toml`
- [x] Documentación completa
- [ ] **Pendiente:** Crear plantilla `admin-healthcheck-alert` en Resend Dashboard
- [ ] **Pendiente:** Configurar email de destino para alertas (variable `ADMIN_EMAIL`)
- [ ] **Pendiente:** Test manual del healthcheck
- [ ] **Pendiente:** Verificar logs tras primera ejecución automática

---

## 🚀 Próximos Pasos

1. **Crear plantilla en Resend:**
   - Ir a Resend Dashboard > Templates
   - Crear nueva plantilla con slug `admin-healthcheck-alert`
   - Usar el HTML de ejemplo arriba

2. **Configurar email de admin:**
   - Añadir variable `ADMIN_EMAIL` en Netlify Environment Variables
   - Valor: email del administrador (ej: `admin@custodia360.es`)

3. **Hacer deploy:**
   - Push a main para activar el cron job en Netlify
   - Verificar que la función aparece en Netlify Dashboard

4. **Verificar primera ejecución:**
   - Esperar a las 08:00 del día siguiente
   - Revisar logs en Netlify Functions
   - Verificar entrada en `.same/todos.md`

---

_Generado automáticamente en Modo Consolidación_
_Fecha: 19 de octubre de 2025_
