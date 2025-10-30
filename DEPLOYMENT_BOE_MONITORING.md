# 🚀 Deployment Rápido - Sistema de Monitoreo BOE

## ✅ Sistema Completo e Implementado

El sistema de monitoreo automático del BOE para LOPIVI está **completamente implementado** y listo para deployment.

**🆕 NUEVO: Sistema de Alertas Visuales Integrado**
- ✅ Notificaciones visuales en el panel interno
- ✅ Badge rojo con contador de alertas no leídas
- ✅ Página dedicada de alertas BOE
- ✅ Marcado de alertas como leídas
- ✅ Notificaciones por email + alertas visuales

---

## 📋 Checklist Pre-Deployment

### 1. Variables de Entorno ✅
Verifica que existan estas variables en Netlify y `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gkoyqfusawhnobvkoijc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
APP_TIMEZONE=Europe/Madrid
BOE_MONITOREO_ACTIVO=true
BOE_FRECUENCIA_DIAS=7

# Notificaciones por Email
RESEND_API_KEY=re_...
NOTIFY_EMAIL_TO=destinatario@custodia360.com
NOTIFY_EMAIL_FROM=noreply@custodia360.es
```

### 2. Archivos Creados ✅

```
✅ supabase/migrations/00_boe_monitoring_tables.sql
✅ supabase/migrations/01_boe_cron_setup.sql
✅ supabase/migrations/02_boe_alerts_table.sql                    # 🆕 NUEVO
✅ supabase/functions/c360_boe_check/index.ts
✅ .github/workflows/boe-check-semanal.yml
✅ src/app/api/admin/boe/run/route.ts
✅ src/app/api/admin/boe/alerts/route.ts                          # 🆕 NUEVO
✅ src/app/api/admin/boe/alerts/mark-read/route.ts                # 🆕 NUEVO
✅ src/app/dashboard-custodia360/monitoreo-boe/page.tsx
✅ src/app/dashboard-custodia360/boe-alertas/page.tsx             # 🆕 NUEVO
✅ src/components/boe-alert-badge.tsx                              # 🆕 NUEVO
```

---

## 🔧 Pasos de Deployment

### PASO 1: Crear Tablas en Supabase (5 min)

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona el proyecto `gkoyqfusawhnobvkoijc`
3. Ve a **SQL Editor**
4. Copia y ejecuta el contenido completo de:
   - `supabase/migrations/00_boe_monitoring_tables.sql`
5. Verifica que se crearon 3 tablas:
   - `boe_changes`
   - `watched_norms`
   - `boe_execution_logs`

```sql
-- Verificar tablas creadas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'boe_%';
```

### PASO 1.1: Crear Tabla de Alertas (NUEVO) ⚡

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona el proyecto `gkoyqfusawhnobvkoijc`
3. Ve a **SQL Editor**
4. Copia y ejecuta el contenido completo de:
   - `supabase/migrations/02_boe_alerts_table.sql`
5. Verifica que se creó la tabla:
   - `boe_alerts`

```sql
-- Verificar tabla de alertas creada
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'boe_alerts';
```

### PASO 2: Desplegar Edge Function (10 min)

#### Opción A: Desde Supabase Dashboard (Más fácil)

1. Ve a **Functions** en Supabase Dashboard
2. Click en **Create a new function**
3. Nombre: `c360_boe_check`
4. Copia el código completo de `supabase/functions/c360_boe_check/index.ts`
5. Click en **Deploy function**

#### Opción B: Desde CLI (Más profesional)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link a tu proyecto
supabase link --project-ref gkoyqfusawhnobvkoijc

# Deploy la función
supabase functions deploy c360_boe_check

# Verificar deployment
supabase functions list
```

### PASO 3: Configurar Notificaciones por Email (5 min)

**3.1 Configurar Variables en Supabase Edge Function**

1. Ve a **Functions** → `c360_boe_check` → **Settings** → **Environment Variables**
2. Añade estas variables:

```
RESEND_API_KEY=re_tu_api_key
NOTIFY_EMAIL_TO=rsuneo1971@gmail.com
NOTIFY_EMAIL_FROM=noreply@custodia360.es
APP_TIMEZONE=Europe/Madrid
```

3. Click en **Save**

**3.2 Verificar Configuración de Resend**

- Asegúrate de que `noreply@custodia360.es` esté verificado en Resend
- O usa el dominio sandbox de Resend para pruebas: `onboarding@resend.dev`

**3.3 Qué Envía el Sistema**

Cuando se detectan cambios nuevos, el sistema envía automáticamente:
- ✉️ Email al destinatario configurado
- 📊 Resumen con número de cambios detectados
- 📋 Muestra de los primeros 3 cambios con fecha y descripción
- 🔗 Enlace directo al panel de monitoreo
- ⏰ Fecha y hora de detección (zona horaria Madrid)

### PASO 4: Configurar CRON Semanal (3 min) ⭐ IMPORTANTE

**🆕 Opción A: Supabase Function Schedules (RECOMENDADO)**

Esta es la forma **más sencilla y confiable** de programar la ejecución automática.

1. **Ve a la consola de Supabase**: https://supabase.com/dashboard
2. **Selecciona tu proyecto**: `gkoyqfusawhnobvkoijc`
3. **Navega a**: Edge Functions → **Schedules** (pestaña superior)
4. **Click en**: "Create a new schedule" o "+ New Schedule"
5. **Completa el formulario**:
   - **Name**: `boe_weekly_monitor`
   - **Description**: `Monitor BOE semanal LOPIVI (Custodia360)`
   - **Function**: Selecciona `c360_boe_check`
   - **Cron Expression**: `0 8 * * 1` (Lunes 08:00 UTC = 09:00 Madrid)
   - **Enabled**: ✅ Activado
6. **Click en**: "Create Schedule" o "Save"

**Verificar**:
```
✅ Aparece en la lista de schedules
✅ Estado: Enabled (verde)
✅ Next run: [Próximo lunes]
```

**Test Manual**: Click en "Run now" para probar antes del lunes

> 📖 **Guía detallada paso a paso**: Ver archivo `CRON_SUPABASE_SETUP.md`

---

**Opción B: pg_cron en Supabase (Alternativa SQL)**

Si prefieres SQL o no tienes acceso a Function Schedules:

1. Ve a **SQL Editor** en Supabase
2. Ejecuta el contenido de `supabase/migrations/01_boe_cron_setup.sql`
3. Verifica que el job se creó:

```sql
SELECT jobid, schedule, jobname, active
FROM cron.job
WHERE jobname = 'boe-check-semanal';
```

---

**Opción C: GitHub Actions (Si no tienes plan Pro de Supabase)**

1. Ve a tu repositorio en GitHub
2. Ve a **Settings** → **Secrets and variables** → **Actions**
3. Añade estos secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`: https://gkoyqfusawhnobvkoijc.supabase.co
   - `SUPABASE_SERVICE_ROLE_KEY`: (tu service role key)
4. El workflow ya está en `.github/workflows/boe-check-semanal.yml`
5. Se ejecutará automáticamente cada lunes a las 09:00

### PASO 5: Verificar Funcionamiento (5 min)

#### 5.1 Test Manual desde Terminal

```bash
# Reemplaza YOUR_SERVICE_ROLE_KEY con tu clave real
curl -X POST \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  https://gkoyqfusawhnobvkoijc.supabase.co/functions/v1/c360_boe_check
```

Deberías recibir una respuesta similar a:

```json
{
  "success": true,
  "message": "Verificación completada. 0 cambios nuevos detectados.",
  "cambios_nuevos": 0,
  "normas_verificadas": 1,
  "duracion_ms": 2453,
  "timestamp": "2025-10-10T..."
}
```

#### 4.2 Test desde el Panel Interno

1. Ve a: https://custodia360.netlify.app/dashboard-custodia360/monitoreo-boe
2. Click en **"Forzar Verificación Ahora"**
3. Espera 2-3 segundos
4. Deberías ver el mensaje: "✅ Verificación forzada ejecutada correctamente"

#### 4.3 Verificar Logs

En Supabase SQL Editor:

```sql
-- Ver últimas ejecuciones
SELECT * FROM boe_execution_logs
ORDER BY execution_time DESC
LIMIT 10;

-- Ver cambios detectados
SELECT * FROM boe_changes
ORDER BY created_at DESC
LIMIT 10;

-- Ver normas vigiladas
SELECT * FROM watched_norms;
```

---

## 🔔 Sistema de Alertas Visuales (NUEVO)

### Funcionamiento

1. **Detección Automática**: Cuando el Edge Function detecta cambios en el BOE
2. **Email + Alerta Visual**: Se envía email Y se crea una alerta visual en la base de datos
3. **Badge en el Menú**: Aparece un badge rojo 🔴 con el número de alertas no leídas
4. **Página de Alertas**: Los administradores pueden ver todas las alertas en `/dashboard-custodia360/boe-alertas`
5. **Marcar como Leída**: Cada alerta puede marcarse como revisada

### Acceso a las Alertas

```
URL Principal: /dashboard-custodia360/monitoreo-boe
URL de Alertas: /dashboard-custodia360/boe-alertas
```

### Funcionalidades de Alertas

- ✅ Ver todas las alertas (leídas y no leídas)
- ✅ Badge con contador en tiempo real
- ✅ Marcar alerta individual como leída
- ✅ Marcar todas las alertas como leídas
- ✅ Filtro automático de alertas no leídas
- ✅ Actualización automática cada 2 minutos

### API Endpoints de Alertas

```bash
# Obtener todas las alertas
GET /api/admin/boe/alerts

# Obtener solo alertas no leídas
GET /api/admin/boe/alerts?unread=true

# Marcar alerta específica como leída
POST /api/admin/boe/alerts/mark-read
Body: { "alertId": 123 }

# Marcar todas las alertas como leídas
POST /api/admin/boe/alerts/mark-read
Body: { "markAll": true }
```

---

## 📊 Panel de Monitoreo Actualizado

### Nuevas Funcionalidades en el Header

- ✅ Badge de alertas no leídas junto al título
- ✅ Botón "Ver Alertas" para acceso directo
- ✅ Contador visual en tiempo real

### Workflow Completo

```
1. BOE detecta cambios (cada lunes 09:00)
   ↓
2. Edge Function procesa cambios
   ↓
3. Envía email al destinatario configurado
   ↓
4. Crea alerta visual en boe_alerts
   ↓
5. Badge rojo aparece en el panel
   ↓
6. Admin revisa alertas y marca como leídas
   ↓
7. Badge desaparece cuando todas están leídas
```

---

## 🔄 Programación CRON

### Frecuencia

**Semanal**: Cada **lunes a las 09:00 (Europe/Madrid)**

### CRON Expression

```
0 8 * * 1  # 08:00 UTC = 09:00 Madrid (invierno)
```

**Nota**: En horario de verano (UTC+2), ajustar a `0 7 * * 1`

### Modificar Frecuencia

Para cambiar a otra frecuencia, edita el CRON:

```sql
-- Diario a las 09:00
SELECT cron.schedule('boe-check-semanal', '0 8 * * *', ...);

-- Cada 3 días a las 09:00
SELECT cron.schedule('boe-check-semanal', '0 8 */3 * *', ...);

-- Mensual (primer día del mes a las 09:00)
SELECT cron.schedule('boe-check-semanal', '0 8 1 * *', ...);
```

---

## 🔒 Seguridad

### ✅ Implementado

- Solo accesible desde panel interno de Custodia360
- Usa `SUPABASE_SERVICE_ROLE_KEY` para acceso completo
- Hash SHA-256 único para evitar duplicados
- Logs de todas las ejecuciones
- No expuesto a entidades ni delegados

### ⚠️ Importante

- **NUNCA** expongas el `SERVICE_ROLE_KEY` en el frontend
- **NUNCA** permitas acceso a entidades externas
- **SIEMPRE** mantén logs de auditoría

---

## 📈 Monitorización

### Verificar Salud del Sistema

```sql
-- Estadísticas generales
SELECT * FROM boe_monitoring_stats;

-- Últimas 10 ejecuciones
SELECT
  execution_time,
  status,
  changes_found,
  execution_duration_ms,
  normas_checked
FROM boe_execution_logs
ORDER BY execution_time DESC
LIMIT 10;

-- Cambios del último mes
SELECT COUNT(*) as total_cambios_mes
FROM boe_changes
WHERE created_at >= NOW() - INTERVAL '30 days';
```

### Alertas Recomendadas

1. **Sin ejecuciones en 8 días** → Investigar CRON
2. **Error en 3 ejecuciones consecutivas** → Revisar Edge Function
3. **Más de 10 cambios nuevos** → Alerta normativa importante

---

## 🛠️ Troubleshooting

### Problema 1: Edge Function no responde

```bash
# Ver logs de la función
supabase functions logs c360_boe_check

# Redesplegar
supabase functions deploy c360_boe_check --no-verify-jwt
```

### Problema 2: CRON no ejecuta

```sql
-- Verificar que pg_cron está habilitado
SELECT * FROM pg_extension WHERE extname = 'pg_cron';

-- Ver todos los jobs
SELECT * FROM cron.job;

-- Recrear el job
SELECT cron.unschedule('boe-check-semanal');
-- Luego ejecutar de nuevo el script 01_boe_cron_setup.sql
```

### Problema 3: No se detectan cambios

1. Verifica que la norma vigilada esté activa:
```sql
SELECT * FROM watched_norms WHERE id = 'BOE-A-2021-9347';
```

2. Prueba la API del BOE manualmente:
```bash
curl https://www.boe.es/datosabiertos/api/legislacion/analisis/BOE-A-2021-9347
```

3. Revisa los logs de ejecución:
```sql
SELECT * FROM boe_execution_logs
WHERE status = 'error'
ORDER BY execution_time DESC;
```

---

## 🛠️ Troubleshooting - Alertas

### Problema: No aparece el badge

```sql
-- Verificar que hay alertas no leídas
SELECT COUNT(*) FROM boe_alerts WHERE leido = FALSE;

-- Ver todas las alertas
SELECT * FROM boe_alerts ORDER BY created_at DESC;
```

### Problema: Error al marcar como leída

```sql
-- Verificar permisos en la tabla
SELECT * FROM information_schema.table_privileges
WHERE table_name = 'boe_alerts';
```

### Problema: Badge no se actualiza

- El badge se actualiza cada 2 minutos
- Recarga la página manualmente para forzar actualización
- Verifica que el endpoint `/api/admin/boe/alerts?unread=true` responde correctamente

---

## ✅ Post-Deployment

### 1. Primera Verificación (Hacer ahora)

```bash
# Forzar primera verificación
curl -X POST \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  https://gkoyqfusawhnobvkoijc.supabase.co/functions/v1/c360_boe_check
```

### 2. Documentar en Notion/Wiki

- URL del panel de monitoreo
- Frecuencia de ejecución
- Contacto para alertas
- Procedimiento de escalado

### 3. Configurar Alertas (Opcional)

- Email cuando se detecten cambios críticos
- Notificación Slack/Discord
- Dashboard de métricas

---

## ✅ Post-Deployment - Checklist Completo

### 1. Verificar Sistema de Monitoreo ✅

```bash
# Forzar primera verificación
curl -X POST \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  https://gkoyqfusawhnobvkoijc.supabase.co/functions/v1/c360_boe_check
```

### 2. Verificar Sistema de Alertas ✅

```bash
# Ver alertas
curl https://tu-dominio.com/api/admin/boe/alerts

# Marcar alerta como leída
curl -X POST https://tu-dominio.com/api/admin/boe/alerts/mark-read \
  -H "Content-Type: application/json" \
  -d '{"alertId": 1}'
```

### 3. Verificar Badge Visual ✅

1. Ve a: https://custodia360.netlify.app/dashboard-custodia360/monitoreo-boe
2. Verifica que aparece el badge si hay alertas no leídas
3. Click en "Ver Alertas" para ir a la página de alertas
4. Marca una alerta como leída y verifica que el contador disminuye

---

## 📞 Soporte

- **Documentación completa**: `SETUP_BOE_MONITORING.md`
- **Panel de monitoreo**: https://custodia360.netlify.app/dashboard-custodia360/monitoreo-boe
- **Panel de alertas**: https://custodia360.netlify.app/dashboard-custodia360/boe-alertas
- **Logs Supabase**: https://supabase.com/dashboard → Functions → Logs

---

**Última actualización**: Octubre 2025
**Versión del sistema**: 1.1.0 (con alertas visuales)
**Estado**: ✅ Producción Ready
