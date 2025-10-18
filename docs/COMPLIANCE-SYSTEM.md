# Sistema de Compliance y Configuración Obligatoria

## Descripción General

Sistema de configuración obligatoria para Delegados de Protección que deben completar 4 requisitos LOPIVI en un plazo de 30 días desde la certificación.

## Componentes

### 1. Base de Datos (Supabase)

**Nuevas tablas:**
- `entity_compliance`: Control de cumplimiento (30 días)
- `channel_verifications`: Tokens de verificación de email
- `compliance_notifications`: Log de notificaciones

**Nuevos campos en `entities`:**
- `canal_tipo`: 'email' | 'telefono'
- `canal_valor`: valor del canal
- `canal_verificado`: boolean
- `canal_verificado_at`: timestamp
- `contractor_email`: email del contratante

**Script SQL:** `database/compliance-system-schema.sql`

### 2. Página de Configuración

**Ruta:** `/panel/delegado/configuracion`

**4 Pasos obligatorios:**

1. **Canal de Comunicación**
   - Selector: Email / Teléfono
   - Verificación por email si aplica
   - Aparecerá en todos los documentos

2. **Link/Token** (placeholder)
   - Futuro sistema de recogida de datos
   - Solo informativo por ahora

3. **Mapa de Riesgos**
   - Descarga según sector
   - Checkbox de lectura obligatoria

4. **Certificado de Penales**
   - Declaración de entrega
   - Sin subida de ficheros

### 3. Endpoints de API

**GET `/api/compliance/status`**
- Obtiene estado de compliance de una entidad
- Params: `entityId`

**POST `/api/compliance/update`**
- Actualiza campos de compliance
- Body: `{ entityId, field, value }`

**POST `/api/channel/save`**
- Guarda canal de comunicación
- Envía email de verificación si tipo=email
- Body: `{ entityId, tipo, valor }`

**GET `/api/channel/verify`**
- Verifica token de email
- Params: `token`

**GET `/api/riskmap/download`**
- Descarga mapa de riesgos en HTML
- Params: `sector, entityId`

### 4. Guard de Acceso

**Implementado en:** `/panel/delegado/page.tsx`

**Lógica:**
- Verifica compliance al cargar el panel
- Si `blocked=true` → redirige a `/configuracion`
- Si faltan requisitos y quedan días → muestra banner amarillo
- Si todo completo → acceso normal

### 5. Edge Function (Cron)

**Función:** `c360_compliance_guard`
**Programación:** Diaria a las 09:00 Europe/Madrid (07:00 UTC)
**Ubicación:** `supabase/functions/c360_compliance_guard/index.ts`

**Proceso:**
1. Selecciona entidades con `deadline_at` vencido y requisitos pendientes
2. Marca `blocked=true` y registra motivos en `blocked_reason`
3. Envía email al `contractor_email` con plantilla 'compliance-blocked'
4. Registra notificación en `compliance_notifications`

### 6. Plantillas de Email

**Slug:** `channel-verify`
- Asunto: "Custodia360 | Verifica tu canal de comunicación"
- Contiene link de verificación

**Slug:** `compliance-blocked`
- Asunto: "Custodia360 | Bloqueo de panel por requisitos LOPIVI pendientes"
- Lista de requisitos faltantes
- Enviado al contratante

## Flujo de Uso

### Inicio (Certificación)
1. Delegado completa formación y obtiene certificado
2. Se crea fila en `entity_compliance` con `deadline_at = now() + 30 days`
3. Se redirige a `/panel/delegado/configuracion`

### Durante los 30 días
1. Delegado puede usar el panel con banner de aviso
2. Debe completar los 4 pasos antes del deadline
3. Cada paso se guarda independientemente

### Al vencer el plazo (Cron diario)
1. Edge function verifica entidades vencidas
2. Si faltan requisitos:
   - `blocked=true`
   - Email al contratante
   - Registro en `compliance_notifications`
3. Próximo intento de acceso → redirige a `/configuracion`

### Desbloqueo
1. Delegado completa los pasos pendientes
2. `blocked=false` automáticamente
3. Acceso restablecido

## Variables de Entorno

```env
APP_BASE_URL=https://www.custodia360.es
NEXT_PUBLIC_APP_BASE_URL=https://www.custodia360.es
SUPABASE_URL=***
SUPABASE_SERVICE_ROLE_KEY=***
RESEND_API_KEY=***
NOTIFY_EMAIL_FROM=no-reply@custodia360.es
APP_TIMEZONE=Europe/Madrid
```

## Configuración de Cron (Supabase)

```sql
-- Crear scheduled job
SELECT cron.schedule(
  'c360_compliance_guard',  -- nombre
  '0 7 * * *',              -- cron expression (07:00 UTC = 09:00 Madrid)
  $$
  SELECT net.http_post(
    url:='https://[PROJECT-ID].supabase.co/functions/v1/c360_compliance_guard',
    headers:='{"Authorization": "Bearer [ANON-KEY]"}'::jsonb
  ) AS request_id;
  $$
);
```

## Integración con Documentos

Todos los PDFs y plantillas de comunicación deben mostrar el canal configurado:

```typescript
// Ejemplo en helper de PDFs
const canal = entity.canal_tipo && entity.canal_valor
  ? `${entity.canal_tipo}: ${entity.canal_valor}`
  : 'Canal pendiente de configurar'

// Renderizar en documento
doc.text(`Canal de comunicación LOPIVI: ${canal}`, x, y)
```

## Testing

### 1. Configuración Normal
- Certificar delegado
- Completar los 4 pasos
- Verificar acceso al panel sin restricciones

### 2. Verificación de Email
- Configurar canal tipo email
- Recibir email de verificación
- Hacer clic en el link
- Ver confirmación en `/configuracion`

### 3. Simulación de Bloqueo
```sql
-- Setear deadline vencido con faltantes
UPDATE entity_compliance
SET deadline_at = now() - interval '1 day',
    channel_done = false
WHERE entity_id = '...';
```
- Ejecutar manualmente la edge function
- Verificar email al contratante
- Intentar acceder al panel → redirige a `/configuracion`
- Completar requisitos → desbloqueo automático

### 4. Banner de Advertencia
- No completar todos los requisitos
- Deadline aún no vencido
- Acceder al panel
- Ver banner amarillo con CTA

## Mantenimiento

### Limpiar verificaciones antiguas
```sql
SELECT cleanup_old_channel_verifications();
```

### Verificar estados
```sql
-- Entidades bloqueadas
SELECT e.nombre, ec.blocked_reason, ec.deadline_at
FROM entity_compliance ec
JOIN entities e ON e.id = ec.entity_id
WHERE ec.blocked = true;

-- Próximas a vencer (3 días)
SELECT e.nombre, ec.deadline_at, ec.channel_done, ec.riskmap_done, ec.penales_done
FROM entity_compliance ec
JOIN entities e ON e.id = ec.entity_id
WHERE ec.deadline_at < now() + interval '3 days'
  AND ec.blocked = false;
```

### Reiniciar compliance (admin)
```sql
-- Solo si es necesario (nueva certificación, etc.)
UPDATE entity_compliance
SET start_at = now(),
    deadline_at = now() + interval '30 days',
    blocked = false,
    blocked_reason = null
WHERE entity_id = '...';
```

## Seguridad

- Todos los endpoints verifican `entityId`
- RLS en Supabase para acceso a datos
- Service role key solo en Edge Function
- Verificación de tokens con expiración (24h)
- Emails solo a contratantes autorizados

## Soporte

- Email: info@custodia360.es
- Web: https://www.custodia360.es
