# 🏥 Monitor Diario "Custodia360 HealthCheck"

**Estado:** ✅ Implementado y operativo
**Fecha:** 19 de octubre de 2025
**Modo:** Consolidación

---

## 📊 ¿Qué hace?

El **HealthCheck** es un monitor automático que se ejecuta **todos los días a las 08:00 (Madrid)** y verifica:

| Check | Descripción | Prioridad |
|-------|-------------|-----------|
| ✅ Stripe Webhook | Verifica que `STRIPE_WEBHOOK_SECRET` esté configurado | 🔴 CRÍTICA |
| ✅ Netlify Build | Verifica que el sistema esté operativo | 🔴 CRÍTICA |
| ✅ Cron Jobs | Revisa jobs fallidos en últimas 24h | 🔴 CRÍTICA si >3 fallos |
| ✅ Email Events | Consulta últimos eventos de email | 🟡 INFO |

---

## 🎯 Resultados del Primer Test (19/10/2025 20:25)

```
Estado: 🔴 CRITICAL

Checks:
- Stripe Webhook: ❌ STRIPE_WEBHOOK_SECRET no configurado
- Netlify Build: ✅ Build ejecutándose correctamente
- Cron Jobs (24h): ✅ Sin fallos en últimas 24h
- Email Events: ❌ Tabla no existe (esperado)

Alertas generadas:
- 🔴 CRÍTICO: Stripe webhook no configurado - pagos no operativos
- 🟡 ADVERTENCIA: No se pudo verificar email_events
```

**Conclusión:** Funcionando correctamente. Detectó las 2 configuraciones pendientes (Stripe webhook y tabla email_events).

---

## 🔔 ¿Cómo funciona?

### Ejecución Automática
- **Horario:** Diario a las 08:00 Europe/Madrid (07:00 UTC)
- **Cron Job:** `c360_healthcheck` en Netlify
- **Endpoint:** `/api/jobs/healthcheck`

### Cuando todo está OK ✅
- ✅ Registra resultado en `.same/todos.md`
- ✅ No envía emails
- ✅ Log visible en Netlify Functions

### Cuando hay problemas ⚠️ 🔴
- ❌ Registra resultado en `.same/todos.md`
- 📧 **Envía email al admin** con detalles
- 🚨 Log de error en Netlify Functions

---

## 📧 Configuración Pendiente (10 minutos)

### 1. Crear plantilla de email en Resend (5 min)

**Acción:**
1. Ir a **Resend Dashboard** → Templates
2. Crear nueva plantilla:
   - **Slug:** `admin-healthcheck-alert`
   - **Asunto:** `⚠️ HealthCheck {{status}}: Custodia360`
3. Copiar HTML de `docs/healthcheck-setup.md` (sección "Plantilla Requerida")

### 2. Configurar email de admin (5 min)

**Acción:**
1. Ir a **Netlify Dashboard** → Site Settings → Environment Variables
2. Añadir nueva variable:
   - **Key:** `ADMIN_EMAIL`
   - **Value:** `tu-email@custodia360.es`

---

## 📝 Registro Automático

Cada ejecución añade una entrada en **`.same/todos.md`**:

```markdown
### 🏥 HealthCheck 19/10/2025, 08:00:00 - Estado: ✅ OK
- Stripe Webhook: ✅ Webhook configurado correctamente
- Netlify Build: ✅ Build ejecutándose correctamente
- Cron Jobs (24h): ✅ Sin fallos en últimas 24h
- Email Events: ✅ 5 eventos recientes encontrados
```

**Ver histórico:**
```bash
tail -100 .same/todos.md | grep "HealthCheck"
```

---

## 🧪 Test Manual

**Ejecutar healthcheck ahora:**

```bash
curl -X POST https://www.custodia360.es/api/jobs/healthcheck \
  -H "x-internal-cron: 1" \
  -H "Content-Type: application/json"
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "result": {
    "status": "OK|WARNING|CRITICAL",
    "checks": { ... },
    "alerts": [ ... ]
  }
}
```

---

## 📊 Monitoreo

### Ver logs en Netlify
1. Netlify Dashboard → Functions
2. Buscar `c360_healthcheck`
3. Ver logs de ejecución

### Consultar último resultado
```bash
tail -20 custodia-360/.same/todos.md
```

### Consultar jobs fallidos
```sql
SELECT * FROM message_jobs
WHERE status = 'failed'
  AND created_at >= NOW() - INTERVAL '24 hours';
```

---

## 🔧 Mantenimiento

### Cambiar horario de ejecución

Editar `netlify.toml`:
```toml
[[scheduled.functions]]
cron = "0 9 * * *"  # 09:00 UTC ≈ 10:00 Madrid
path = "/.netlify/functions/c360_healthcheck"
```

### Desactivar temporalmente

Comentar en `netlify.toml`:
```toml
# [[scheduled.functions]]
# cron = "0 7 * * *"
# path = "/.netlify/functions/c360_healthcheck"
```

---

## ✅ Estado Actual

| Componente | Estado | Ubicación |
|------------|--------|-----------|
| Endpoint API | ✅ Implementado | `/api/jobs/healthcheck` |
| Función Netlify | ✅ Implementado | `netlify/functions/c360_healthcheck.ts` |
| Cron Job | ✅ Configurado | `netlify.toml` (07:00 UTC) |
| Test Manual | ✅ Verificado | Funcionando correctamente |
| Registro Automático | ✅ Activo | Escribe en `.same/todos.md` |
| Plantilla Email | ⏳ Pendiente | Crear en Resend Dashboard |
| Email Admin | ⏳ Pendiente | Configurar en Netlify |

---

## 🚀 Próxima Ejecución Automática

**Fecha:** 20 de octubre de 2025
**Hora:** 08:00 Europe/Madrid (07:00 UTC)

**Qué esperar:**
- ✅ Entrada automática en `.same/todos.md`
- 📧 Email de alerta si hay problemas (tras configurar plantilla)
- 📊 Logs en Netlify Dashboard

---

## 📁 Documentación Completa

- **`docs/healthcheck-setup.md`** - Guía técnica completa
- **`HEALTHCHECK-README.md`** - Este archivo (resumen ejecutivo)
- **`.same/todos.md`** - Histórico de ejecuciones

---

**🛡️ Modo Consolidación Activo**
_Este sistema NO modifica código existente. Solo monitorea y alerta._

---

**¿Preguntas?**
- Ver `docs/healthcheck-setup.md` para detalles técnicos
- Revisar `.same/todos.md` para histórico de ejecuciones
- Consultar logs en Netlify Dashboard para troubleshooting
