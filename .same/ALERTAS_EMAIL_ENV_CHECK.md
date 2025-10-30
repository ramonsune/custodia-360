# 🔧 VERIFICACIÓN DE VARIABLES DE ENTORNO - ALERTAS LOPIVI

**Fecha generación:** ${new Date().toISOString()}
**Proyecto:** Custodia360
**Módulo:** Sistema de Alertas LOPIVI por Email

---

## ✅ VARIABLES PRESENTES (Configuradas)

```env
# Resend (Proveedor de email)
RESEND_API_KEY=re_MS6At7Hp_***  ✅ CONFIGURADO
RESEND_FROM_EMAIL=noreply@custodia360.es  ✅ CONFIGURADO

# Supabase (Base de datos)
NEXT_PUBLIC_SUPABASE_URL=https://gkoyqfusawhnobvkoijc.supabase.co  ✅ CONFIGURADO
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc***  ✅ CONFIGURADO

# App
NEXT_PUBLIC_APP_URL=http://localhost:8080  ✅ CONFIGURADO
```

---

## ⚠️ VARIABLES FALTANTES (Añadir cuando se active Fase B)

```env
# ====================================
# ALERTAS LOPIVI - EMAIL INBOUND
# ====================================

# Control de ingesta automática (HOY = false)
EMAIL_INBOUND_ENABLED=false

# Destino de notificaciones administrativas
REPORT_EMAIL=soporte@custodia360.es

# ====================================
# FUTURO: Cuando exista lopivi@custodia360.es
# ====================================

# Dominio de correo entrante (Resend Inbound)
# RESEND_INBOUND_DOMAIN=inbound.custodia360.es

# Secret para verificar webhooks de Resend Inbound
# RESEND_INBOUND_SIGNING_SECRET=whsec_...

# Buzón receptor de alertas
# EMAIL_ROUTING=lopivi@custodia360.es
```

---

## 📋 ESTADO ACTUAL

| Variable | Estado | Valor | Notas |
|----------|--------|-------|-------|
| `EMAIL_INBOUND_ENABLED` | ❌ NO CONFIGURADA | Por defecto: `false` | Sistema en modo MANUAL |
| `REPORT_EMAIL` | ❌ NO CONFIGURADA | Por defecto: `RESEND_FROM_EMAIL` | Notificaciones admin |
| `RESEND_INBOUND_DOMAIN` | ⏸️ NO NECESARIA AÚN | - | Activar en Fase B |
| `RESEND_INBOUND_SIGNING_SECRET` | ⏸️ NO NECESARIA AÚN | - | Activar en Fase B |
| `EMAIL_ROUTING` | ⏸️ NO NECESARIA AÚN | - | Activar en Fase B |

---

## 🚀 CÓMO ACTIVAR FASE A (MODO MANUAL) - **ACTIVO HOY**

**No requiere configuración adicional.** El sistema ya funciona con:
- ✅ Resend configurado
- ✅ Supabase configurado
- ✅ Panel admin disponible en `/dashboard-custodia360`

### Pasos:
1. Ejecutar SQL para crear tablas (ver `ALERTAS_EMAIL_README.md`)
2. Acceder al panel admin
3. Ir a pestaña "Alertas por Email"
4. Pegar contenido del email manualmente
5. Guardar → se almacena y notifica

---

## 🔮 CÓMO ACTIVAR FASE B (WEBHOOK AUTOMÁTICO) - **FUTURO**

### Prerequisitos:
1. **Crear correo:** `lopivi@custodia360.es` en Resend
2. **Configurar Resend Inbound:**
   - Dominio: `inbound.custodia360.es`
   - Webhook URL: `https://www.custodia360.es/api/email/inbound`
   - Copiar Signing Secret

### Configuración:

```bash
# Añadir a .env.local
EMAIL_INBOUND_ENABLED=true
RESEND_INBOUND_DOMAIN=inbound.custodia360.es
RESEND_INBOUND_SIGNING_SECRET=whsec_xxxxxxxxxxxxx
EMAIL_ROUTING=lopivi@custodia360.es
REPORT_EMAIL=soporte@custodia360.es  # O email específico
```

### Pasos:
1. Añadir variables de entorno
2. Configurar MX records en DNS:
   ```
   MX 10 feedback-smtp.eu-west-1.amazonses.com
   ```
3. Configurar routing en Resend:
   - From: `*@custodia360.es`
   - To: `lopivi@custodia360.es`
   - Forward to: `https://www.custodia360.es/api/email/inbound`
4. Verificar webhook signature
5. Reiniciar servidor
6. Probar enviando email a `lopivi@custodia360.es`

---

## 🧪 VERIFICACIÓN

### Modo Manual (Fase A):
```bash
# 1. Verificar acceso al panel
curl https://www.custodia360.es/dashboard-custodia360

# 2. Probar ingesta manual
POST /api/email/ingest-manual
{
  "subject": "Test LOPIVI",
  "from": "test@example.com",
  "text": "Contenido de prueba"
}
```

### Modo Webhook (Fase B):
```bash
# 1. Verificar estado del endpoint
curl https://www.custodia360.es/api/email/inbound
# Respuesta esperada: 503 si EMAIL_INBOUND_ENABLED=false

# 2. Cuando esté activo
curl -X POST https://www.custodia360.es/api/email/inbound \
  -H "Content-Type: application/json" \
  -d '{"from":"golee@example.com","subject":"Test"}'
```

---

## 📊 MONITOREO

Logs a revisar en `audit_events`:
```sql
-- Últimas ingestas manuales
SELECT * FROM audit_events
WHERE area = 'email' AND event_type = 'ingest.manual'
ORDER BY created_at DESC LIMIT 10;

-- Estado del webhook
SELECT * FROM audit_events
WHERE area = 'email' AND event_type LIKE 'inbound%'
ORDER BY created_at DESC LIMIT 10;

-- Notificaciones enviadas
SELECT * FROM audit_events
WHERE area = 'email' AND event_type = 'notify.sent'
ORDER BY created_at DESC LIMIT 10;
```

---

## 🔒 SEGURIDAD

- ✅ Todos los endpoints POST requieren autenticación ADMIN
- ✅ Webhook verifica Resend Signing Secret (cuando esté activo)
- ✅ Deduplicación por hash (evita duplicados)
- ✅ Sanitización de HTML
- ✅ Límites de tamaño (5MB max)
- ✅ Rate limiting en webhook (futuro)

---

## 📞 SOPORTE

Si necesitas ayuda con la configuración:
- **Email:** soporte@custodia360.es
- **Documentación:** `.same/ALERTAS_EMAIL_README.md`
- **Smoke tests:** `.same/BOE_NEWS_SMOKE.md`
