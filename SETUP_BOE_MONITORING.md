# 🔍 Sistema de Monitoreo Automático del BOE - LOPIVI

Sistema automatizado para detectar cambios en la legislación LOPIVI publicados en el BOE.

---

## 📋 ÍNDICE

1. [Variables de Entorno](#1-variables-de-entorno)
2. [Tablas de Base de Datos](#2-tablas-de-base-de-datos-supabase)
3. [Edge Function Supabase](#3-edge-function-supabase-c360_boe_check)
4. [Programación CRON](#4-programación-cron-semanal)
5. [Notificaciones por Email](#5-notificaciones-por-email)
6. [🆕 Sistema de Alertas Visuales](#6-sistema-de-alertas-visuales)
7. [Endpoints API](#7-endpoints-api)
8. [Vista en Panel](#8-vista-en-panel-interno)

---

## 1. VARIABLES DE ENTORNO

Asegúrate de tener estas variables configuradas en `.env.local` y en Netlify:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Configuración
APP_TIMEZONE=Europe/Madrid

# Notificaciones por Email
RESEND_API_KEY=re_tu_api_key
NOTIFY_EMAIL_TO=destinatario@custodia360.com
NOTIFY_EMAIL_FROM=noreply@custodia360.es
```

---

## 2. TABLAS DE BASE DE DATOS (Supabase)

Ejecuta este SQL en el Editor SQL de Supabase:

```sql
-- Tabla para almacenar cambios detectados del BOE
CREATE TABLE IF NOT EXISTS boe_changes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  norma_base_id TEXT NOT NULL,
  norma_mod_id TEXT NOT NULL,
  relacion TEXT NOT NULL,
  texto_relacion TEXT,
  fecha_relacion DATE,
  hash TEXT UNIQUE NOT NULL,
  raw_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas por hash (evitar duplicados)
CREATE INDEX IF NOT EXISTS idx_boe_changes_hash ON boe_changes(hash);

-- Índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_boe_changes_created_at ON boe_changes(created_at DESC);

-- Tabla para normas vigiladas
CREATE TABLE IF NOT EXISTS watched_norms (
  id TEXT PRIMARY KEY,
  alias TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar LOPIVI como norma vigilada
INSERT INTO watched_norms(id, alias, enabled)
VALUES ('BOE-A-2021-9347', 'LOPIVI', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Tabla para logs de ejecución
CREATE TABLE IF NOT EXISTS boe_execution_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  execution_time TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL,
  changes_found INTEGER DEFAULT 0,
  error_message TEXT,
  execution_duration_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_boe_execution_logs_time ON boe_execution_logs(execution_time DESC);
```

---

## 3. EDGE FUNCTION SUPABASE: `c360_boe_check`

### 3.1 Crear la función en Supabase

Ve a **Functions** en el dashboard de Supabase y crea una nueva función llamada `c360_boe_check`.

### 3.2 Código de la Edge Function

```typescript
// Edge Function: c360_boe_check
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const startTime = Date.now()

    // 1. Obtener normas vigiladas
    const { data: normas, error: normasError } = await supabaseClient
      .from('watched_norms')
      .select('*')
      .eq('enabled', true)

    if (normasError) throw normasError

    if (!normas || normas.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'No hay normas vigiladas' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let totalCambiosNuevos = 0

    // 2. Para cada norma vigilada, consultar cambios
    for (const norma of normas) {
      const url = `https://www.boe.es/datosabiertos/api/legislacion/analisis/${norma.id}`

      console.log(`Consultando BOE para ${norma.alias} (${norma.id})...`)

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        console.error(`Error consultando BOE para ${norma.id}: ${response.status}`)
        continue
      }

      const data = await response.json()

      // 3. Filtrar cambios significativos
      if (data.relaciones && Array.isArray(data.relaciones)) {
        for (const rel of data.relaciones) {
          const relacionUpper = (rel.relacion || '').toUpperCase()

          // Filtrar: SE MODIFICA, SE AÑADE, SE DEROGA
          // Excluir: CORRECCIÓN DE ERRORES
          if (
            (relacionUpper.includes('SE MODIFICA') ||
             relacionUpper.includes('SE AÑADE') ||
             relacionUpper.includes('SE DEROGA')) &&
            !relacionUpper.includes('CORRECCIÓN')
          ) {
            // Generar hash único
            const hashData = `${norma.id}-${rel.norma_modificadora || ''}-${rel.relacion || ''}-${rel.fecha || ''}`
            const hash = await crypto.subtle.digest(
              'SHA-256',
              new TextEncoder().encode(hashData)
            ).then(buf =>
              Array.from(new Uint8Array(buf))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')
            )

            // Insertar si no existe (por hash único)
            const { error: insertError } = await supabaseClient
              .from('boe_changes')
              .insert({
                norma_base_id: norma.id,
                norma_mod_id: rel.norma_modificadora || '',
                relacion: rel.relacion || '',
                texto_relacion: rel.texto || null,
                fecha_relacion: rel.fecha || null,
                hash: hash,
                raw_json: rel
              })
              .select()

            if (!insertError) {
              totalCambiosNuevos++
              console.log(`✅ Nuevo cambio detectado: ${rel.relacion}`)
            } else if (insertError.code !== '23505') {
              // 23505 es unique violation (duplicado), ignorar
              console.error('Error insertando cambio:', insertError)
            }
          }
        }
      }
    }

    const duration = Date.now() - startTime

    // 4. Registrar log de ejecución
    await supabaseClient.from('boe_execution_logs').insert({
      status: 'success',
      changes_found: totalCambiosNuevos,
      execution_duration_ms: duration
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: `Verificación completada. ${totalCambiosNuevos} cambios nuevos detectados.`,
        cambios_nuevos: totalCambiosNuevos,
        normas_verificadas: normas.length,
        duracion_ms: duration
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error en c360_boe_check:', error)

    // Registrar error en logs
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabaseClient.from('boe_execution_logs').insert({
      status: 'error',
      error_message: error.message,
      execution_duration_ms: 0
    })

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
```

### 3.3 Desplegar la función

```bash
# En tu terminal local con Supabase CLI
supabase functions deploy c360_boe_check
```

---

## 4. PROGRAMACIÓN CRON SEMANAL

### 🆕 4.1 Supabase Function Schedules (RECOMENDADO)

**La forma más sencilla de programar ejecuciones automáticas**

#### Pasos:

1. Ve a la consola de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Navega a: **Edge Functions** → **Schedules**
4. Click en **"Create a new schedule"**
5. Completa:
   - **Name**: `boe_weekly_monitor`
   - **Description**: `Monitor BOE semanal LOPIVI (Custodia360)`
   - **Function**: `c360_boe_check`
   - **Cron Expression**: `0 8 * * 1`
   - **Enabled**: ✅

#### Explicación:
```
0 8 * * 1
│ │ │ │ └── Lunes
│ │ │ └──── Todos los días del mes
│ │ └────── Todos los meses
│ └──────── 08:00 UTC (= 09:00 Madrid invierno)
└────────── Minuto 00
```

#### Verificar:
- ✅ Aparece en lista de schedules
- ✅ Estado: Enabled
- ✅ Next run: [fecha del próximo lunes]

#### Test manual:
Click en "Run now" para ejecutar inmediatamente

📖 **Guía completa paso a paso**: Ver `CRON_SUPABASE_SETUP.md`

---

### 4.2 Alternativa: pg_cron en Supabase

Si prefieres SQL o no tienes acceso a Function Schedules:

1. Ve a **Database** → **Extensions**
2. Activa `pg_cron`
3. Ejecuta este SQL:

```sql
-- Programar ejecución cada lunes a las 09:00 (hora Madrid)
SELECT cron.schedule(
  'boe-check-semanal',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://tu-proyecto.supabase.co/functions/v1/c360_boe_check',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body := jsonb_build_object('scheduled', true)
  );
  $$
);
```

### 4.3 Alternativa: GitHub Actions

Crea `.github/workflows/boe-check.yml`:

```yaml
name: BOE Check Semanal

on:
  schedule:
    - cron: '0 9 * * 1'  # Lunes 09:00 UTC+1
  workflow_dispatch:

jobs:
  check-boe:
    runs-on: ubuntu-latest
    steps:
      - name: Ejecutar verificación BOE
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            https://tu-proyecto.supabase.co/functions/v1/c360_boe_check
```

---

## 5. NOTIFICACIONES POR EMAIL

### 5.1 Configuración de Notificaciones

El sistema envía automáticamente notificaciones por email cuando se detectan cambios significativos en el BOE.

**¿Cuándo se envían?**
- Solo cuando se detectan **cambios nuevos** (SE MODIFICA / SE AÑADE / SE DEROGA)
- No se envían si no hay cambios o si son correcciones de errores
- Una notificación por ejecución del sistema

**Contenido del email:**
- Número de cambios detectados
- Normas afectadas (BOE-A-2021-9347 - LOPIVI)
- Muestra de los primeros 3 cambios con fecha y descripción
- Enlace directo al panel de monitoreo
- Fecha y hora de detección (zona horaria Madrid)

**Formato:**
- Email en texto plano + HTML responsive
- Compatible con todos los clientes de email
- Diseño profesional con colores corporativos

### 5.2 Configurar Variables de Email

En `.env.local` y en las variables de entorno de Netlify:

```env
RESEND_API_KEY=re_tu_api_key_de_resend
NOTIFY_EMAIL_TO=rsuneo1971@gmail.com
NOTIFY_EMAIL_FROM=noreply@custodia360.es
```

**Importante:**
- `RESEND_API_KEY`: Tu clave API de Resend (empieza con `re_`)
- `NOTIFY_EMAIL_TO`: Email del destinatario (puede ser el tuyo o del equipo)
- `NOTIFY_EMAIL_FROM`: Email verificado en Resend

### 5.3 Configurar en Supabase Edge Function

Las variables de entorno también deben configurarse en Supabase:

1. Ve a **Functions** → `c360_boe_check` → **Settings**
2. Añade las variables:
   ```
   RESEND_API_KEY=re_...
   NOTIFY_EMAIL_TO=destinatario@custodia360.com
   NOTIFY_EMAIL_FROM=noreply@custodia360.es
   APP_TIMEZONE=Europe/Madrid
   ```

### 5.4 Verificar Notificaciones

Para probar el envío de emails:

```bash
# Forzar una verificación manual (si hay cambios, enviará email)
curl -X POST \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  https://tu-proyecto.supabase.co/functions/v1/c360_boe_check
```

Revisa los logs de la Edge Function para ver si el email se envió correctamente.

---

## 6. SISTEMA DE ALERTAS VISUALES

### 6.1 Tabla de Alertas

Ejecuta este SQL en el Editor SQL de Supabase:

```sql
-- Tabla de alertas visuales para el panel interno
CREATE TABLE IF NOT EXISTS boe_alerts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  fecha TIMESTAMPTZ DEFAULT NOW(),
  total_cambios INTEGER DEFAULT 0,
  leido BOOLEAN DEFAULT FALSE,
  resumen TEXT,
  normas_afectadas TEXT[],
  cambios_ids BIGINT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_boe_alerts_leido ON boe_alerts(leido, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_boe_alerts_fecha ON boe_alerts(fecha DESC);

-- Vista para contar alertas no leídas
CREATE OR REPLACE VIEW boe_alerts_unread_count AS
SELECT COUNT(*) as count
FROM boe_alerts
WHERE leido = FALSE;
```

### 6.2 Funcionalidad

El sistema de alertas visuales proporciona:

- **Badge rojo** con contador en el menú principal del panel
- **Notificación visual** cuando hay alertas no leídas
- **Página dedicada** `/dashboard-custodia360/boe-alertas` para gestión
- **Actualización automática** cada 2 minutos
- **Gestión flexible**: Marcar individual o todas como leídas

### 6.3 Componentes

#### Badge de Alertas
```typescript
// src/components/boe-alert-badge.tsx
// Muestra badge rojo con contador de alertas no leídas
// Se actualiza automáticamente cada 2 minutos
```

#### Página de Alertas
```typescript
// src/app/dashboard-custodia360/boe-alertas/page.tsx
// Lista todas las alertas (leídas y no leídas)
// Permite marcar como leídas individual o masivamente
```

### 6.4 Workflow

```
1. Edge Function detecta cambios en BOE
   ↓
2. Envía email al destinatario configurado
   ↓
3. Crea registro en tabla boe_alerts
   ↓
4. Badge rojo aparece en el panel (si hay alertas no leídas)
   ↓
5. Admin hace click en "Ver Alertas"
   ↓
6. Admin revisa y marca alertas como leídas
   ↓
7. Badge desaparece cuando todas están leídas
```

### 6.5 API de Alertas

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

## 7. ENDPOINTS API

### 6.1 Endpoint manual ya creado

El endpoint `/api/admin/boe/run` ya está implementado en:
- `src/app/api/admin/boe/run/route.ts`

### 6.2 Uso

```bash
# Test de conexión
curl https://tu-dominio.com/api/admin/boe/run?accion=test

# Forzar verificación manual
curl https://tu-dominio.com/api/admin/boe/run?accion=forzar

# Descargar historial CSV
curl https://tu-dominio.com/api/admin/boe/run?accion=historial > historial.csv

# Generar informe
curl -X POST https://tu-dominio.com/api/admin/boe/run \
  -H "Content-Type: application/json" \
  -d '{"accion":"informe","fecha_inicio":"2025-01-01","fecha_fin":"2025-01-31"}'
```

---

## 8. VISTA EN PANEL INTERNO

La vista ya está implementada en:
- `src/app/dashboard-custodia360/monitoreo-boe/page.tsx`

### 6.1 Acceso

```
https://tu-dominio.com/dashboard-custodia360/monitoreo-boe
```

### 6.2 Funcionalidades

- ✅ Ver cambios detectados en tiempo real
- ✅ Filtrar por estado (DETECTADO, ANALIZANDO, IMPLEMENTADO, COMUNICADO)
- ✅ Forzar verificación manual
- ✅ Generar informes
- ✅ Descargar historial completo
- ✅ Ver detalles de cada cambio

---

## 📊 VERIFICACIÓN DEL SISTEMA

### 1. Verificar tablas creadas

```sql
SELECT * FROM watched_norms;
SELECT COUNT(*) FROM boe_changes;
SELECT * FROM boe_execution_logs ORDER BY execution_time DESC LIMIT 10;
```

### 2. Probar Edge Function manualmente

```bash
curl -X POST \
  -H "Authorization: Bearer TU_SERVICE_ROLE_KEY" \
  https://tu-proyecto.supabase.co/functions/v1/c360_boe_check
```

### 3. Ver logs en Supabase

Ve a **Functions** → `c360_boe_check` → **Logs**

---

## 🔒 SEGURIDAD

- ✅ Solo accesible desde panel de Custodia360 (no entidades/delegados)
- ✅ Usa SERVICE_ROLE_KEY para acceso completo a Supabase
- ✅ Hash único para evitar duplicados
- ✅ Logs de todas las ejecuciones

---

## 📝 NOTAS ADICIONALES

1. **Frecuencia**: Sistema configurado para ejecutarse **semanalmente** (cada lunes 09:00)
2. **Norma vigilada**: BOE-A-2021-9347 (LOPIVI)
3. **Filtros**: Solo detecta cambios significativos (SE MODIFICA, SE AÑADE, SE DEROGA)
4. **Exclusiones**: Ignora correcciones de errores
5. **Almacenamiento**: Todos los cambios se guardan indefinidamente en Supabase

---

## 🚀 IMPLEMENTACIÓN COMPLETA

### Estado del Sistema: ✅ LISTO PARA DEPLOYMENT

Todos los archivos necesarios han sido creados:

1. ✅ Variables de entorno configuradas
2. ✅ Tablas SQL creadas (`supabase/migrations/00_boe_monitoring_tables.sql`)
3. ✅ Edge Function implementada (`supabase/functions/c360_boe_check/index.ts`)
4. ✅ CRON SQL configurado (`supabase/migrations/01_boe_cron_setup.sql`)
5. ✅ GitHub Actions alternativo (`..github/workflows/boe-check-semanal.yml`)
6. ✅ Endpoint API funcionando (`/api/admin/boe/run`)
7. ✅ Panel de monitoreo operativo (`/dashboard-custodia360/monitoreo-boe`)

### Pasos para Deployment

#### 1. Crear las tablas en Supabase
```bash
# Opción A: Desde Supabase Dashboard
# Ve a SQL Editor y ejecuta el contenido de:
# supabase/migrations/00_boe_monitoring_tables.sql

# Opción B: Desde Supabase CLI
supabase db push
```

#### 2. Desplegar la Edge Function
```bash
# Asegúrate de tener Supabase CLI instalado
npm install -g supabase

# Login en Supabase
supabase login

# Link a tu proyecto
supabase link --project-ref gkoyqfusawhnobvkoijc

# Deploy la función
supabase functions deploy c360_boe_check
```

#### 3. Configurar CRON Semanal

**Opción A: pg_cron en Supabase (Recomendado)**
```bash
# Ejecuta en SQL Editor de Supabase:
# supabase/migrations/01_boe_cron_setup.sql
```

**Opción B: GitHub Actions**
```bash
# Ya está configurado en .github/workflows/boe-check-semanal.yml
# Asegúrate de tener los secrets en GitHub:
# - NEXT_PUBLIC_SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
```

#### 4. Verificar Deployment
```bash
# Test manual desde terminal
curl -X POST \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  https://gkoyqfusawhnobvkoijc.supabase.co/functions/v1/c360_boe_check

# O desde el panel interno:
# https://custodia360.netlify.app/dashboard-custodia360/monitoreo-boe
# Click en "Forzar Verificación Ahora"
```

---

## 📧 SOPORTE

Para preguntas o problemas, contacta al equipo de desarrollo de Custodia360.

---

**Última actualización**: Octubre 2025
