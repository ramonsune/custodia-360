# 🕐 Configuración CRON Semanal en Supabase - BOE Monitor

> **Guía paso a paso para programar la ejecución automática semanal de `c360_boe_check`**

---

## 📌 Resumen

Configurarás un **Function Schedule** en Supabase para ejecutar automáticamente la función Edge `c360_boe_check` cada **lunes a las 09:00 (hora Madrid)**.

**Tiempo estimado**: 3 minutos
**Resultado**: Monitoreo automático del BOE sin intervención manual

---

## 🚀 Paso a Paso

### PASO 1: Acceder a la Consola de Supabase

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto: **`gkoyqfusawhnobvkoijc`**
3. En el menú lateral izquierdo, click en **"Edge Functions"**

---

### PASO 2: Navegar a la Sección de Schedules

1. Dentro de **Edge Functions**, busca la pestaña **"Schedules"** (Programaciones)
2. Click en el botón **"Create a new schedule"** o **"+ New Schedule"**

---

### PASO 3: Configurar el Schedule

Completa el formulario con estos valores exactos:

#### 📝 Configuración del Schedule

| Campo | Valor |
|-------|-------|
| **Name** | `boe_weekly_monitor` |
| **Description** | `Monitor BOE semanal LOPIVI (Custodia360)` |
| **Function** | Selecciona **`c360_boe_check`** del dropdown |
| **Cron Expression** | `0 8 * * 1` |
| **Timezone** | `UTC` (importante: no cambiar) |
| **Enabled** | ✅ Activado |

#### 🔍 Explicación del Cron Expression

```
0 8 * * 1
│ │ │ │ │
│ │ │ │ └─── Día de la semana (1 = Lunes)
│ │ │ └───── Mes (todos)
│ │ └─────── Día del mes (todos)
│ └───────── Hora (08 UTC)
└─────────── Minuto (00)
```

**Importante**: `08:00 UTC` = `09:00 Europe/Madrid` (invierno)

> En horario de verano (UTC+2), automáticamente se ajusta a las 10:00 Madrid.
> Si prefieres mantenerlo a las 09:00 todo el año, usa `0 7 * * 1` en verano.

---

### PASO 4: Guardar y Verificar

1. Click en **"Create Schedule"** o **"Save"**
2. Deberías ver el schedule `boe_weekly_monitor` en la lista
3. Verifica que aparece:
   - ✅ **Enabled** (verde)
   - ⏰ **Next run** (próxima ejecución programada)
   - 🔄 **Last run** (vacío hasta la primera ejecución)

---

## ✅ Verificación del Schedule

### Opción A: Ejecutar Manualmente (Recomendado)

Para probar que funciona ANTES del lunes:

1. En la lista de schedules, localiza `boe_weekly_monitor`
2. Click en el botón **"Run now"** o **"▶ Execute"**
3. Espera 10-30 segundos
4. Verifica en los **Logs** de la función que se ejecutó correctamente

### Opción B: Ver Logs de Ejecución

1. Ve a **Edge Functions** → **`c360_boe_check`** → **Logs**
2. Deberías ver las ejecuciones con:
   ```json
   {
     "success": true,
     "cambios_nuevos": X,
     "normas_verificadas": 1,
     "duracion_ms": XXXX
   }
   ```

### Opción C: Verificar en Base de Datos

```sql
-- Ver últimas ejecuciones registradas
SELECT * FROM boe_execution_logs
ORDER BY execution_time DESC
LIMIT 5;

-- Ver alertas creadas
SELECT * FROM boe_alerts
WHERE leido = FALSE
ORDER BY created_at DESC;
```

---

## 🎯 ¿Qué Sucederá Ahora?

### Cada Lunes a las 09:00 (Madrid)

1. ✅ **Supabase ejecuta automáticamente** `c360_boe_check`
2. 🔍 **La función consulta** el BOE API para LOPIVI
3. 📊 **Detecta cambios significativos**:
   - Modificaciones
   - Anexos/Adiciones
   - Derogaciones
4. 💾 **Guarda en `boe_changes`** (sin duplicados por hash)
5. 🔔 **Si hay cambios nuevos**:
   - Crea alerta en `boe_alerts`
   - Envía email vía Resend
   - El badge rojo aparece en el panel
6. 📝 **Registra log** en `boe_execution_logs`

---

## 🛠️ Solución de Problemas

### Problema 1: No aparece la opción "Schedules"

**Causa**: Tu plan de Supabase puede no incluir Function Schedules

**Solución**:
- Verifica tu plan en Supabase (requiere plan Pro o superior)
- Usa alternativa: **GitHub Actions** (ya configurado en `.github/workflows/boe-check-semanal.yml`)

### Problema 2: El schedule se crea pero no ejecuta

**Verificar**:
1. ✅ La función `c360_boe_check` existe y está deployed
2. ✅ El schedule está **Enabled**
3. ✅ La expresión CRON es correcta: `0 8 * * 1`

**Logs**:
```bash
# Ver logs de errores
supabase functions logs c360_boe_check --filter "error"
```

### Problema 3: Ejecuta pero da error

**Causas comunes**:
- Variables de entorno no configuradas en la Edge Function
- Problema de permisos con Supabase Service Role Key

**Solución**:
1. Ve a **Edge Functions** → **`c360_boe_check`** → **Settings** → **Environment Variables**
2. Verifica que existen:
   ```
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   RESEND_API_KEY
   NOTIFY_EMAIL_TO
   NOTIFY_EMAIL_FROM
   APP_TIMEZONE
   ```

---

## 🔄 Alternativa: Supabase CLI

Si prefieres usar la terminal:

```bash
# Crear schedule vía CLI (requiere Supabase CLI v1.123.0+)
supabase functions schedule create \
  --function c360_boe_check \
  --name boe_weekly_monitor \
  --schedule "0 8 * * 1" \
  --enabled

# Listar schedules
supabase functions schedule list

# Ejecutar manualmente
supabase functions schedule run boe_weekly_monitor

# Eliminar schedule (si necesitas recrearlo)
supabase functions schedule delete boe_weekly_monitor
```

---

## 📅 Cambiar Horario o Frecuencia

### Ejecutar Diario a las 09:00

```
Cron: 0 8 * * *
```

### Ejecutar Dos Veces por Semana (Lunes y Jueves)

```
Cron: 0 8 * * 1,4
```

### Ejecutar Primer Día del Mes a las 09:00

```
Cron: 0 8 1 * *
```

### Ejecutar Cada 3 Días a las 09:00

```
Cron: 0 8 */3 * *
```

**Generador de CRON**: https://crontab.guru/

---

## 🔐 Seguridad

✅ **El CRON está protegido**:
- Solo Supabase puede invocarlo
- Requiere autenticación automática
- No expuesto públicamente

✅ **Variables sensibles**:
- Service Role Key solo en Edge Function environment
- Nunca en el código fuente

---

## 📊 Monitoreo y Métricas

### Dashboard de Ejecuciones

Puedes ver estadísticas en:

1. **Supabase Dashboard** → Edge Functions → c360_boe_check → Metrics
   - Número de invocaciones
   - Tiempo promedio de ejecución
   - Tasa de errores

2. **Panel Interno de Custodia360**
   - `/dashboard-custodia360/monitoreo-boe`
   - Ver cambios detectados
   - Ver alertas no leídas
   - Ver estado del sistema

---

## 🎉 Confirmación Final

Después de crear el schedule, deberías ver:

```
✅ Schedule creado: boe_weekly_monitor
✅ Estado: Enabled
✅ Próxima ejecución: [Próximo lunes a las 08:00 UTC]
✅ Function: c360_boe_check
```

**¡Listo!** El sistema monitoreará automáticamente el BOE cada semana sin intervención manual.

---

## 📞 Soporte

Si tienes problemas:
1. Verifica los logs: Edge Functions → c360_boe_check → Logs
2. Ejecuta test manual: `/api/admin/boe/run?accion=forzar`
3. Revisa documentación: `DEPLOYMENT_BOE_MONITORING.md`

---

**Última actualización**: Octubre 2025
**Versión**: 1.1.0
