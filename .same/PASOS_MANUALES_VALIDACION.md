# ⚡ PASOS MANUALES - Validación Final

**Fecha**: 27 de enero de 2025
**Estado validación automática**: 🟢 **83% exitosa** (15/18 tests pasados)

---

## 📋 RESUMEN

La validación automática se ejecutó exitosamente. **Solo quedan 3 acciones manuales** para completar el proceso:

1. ✅ Ejecutar SQL de limpieza en Supabase
2. ✅ Verificar/aplicar migrations pendientes
3. ✅ (Opcional) Migrar Stripe a LIVE mode

---

## 🔴 PASO 1: SQL DE LIMPIEZA (5 minutos)

### Qué hace:
- Verifica usuarios existentes
- Identifica usuarios a mantener activos
- Deshabilita usuarios demo antiguos (si existen)
- Verifica RLS activo en tablas críticas

### Cómo ejecutar:

1. **Abrir Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   → Login
   → Seleccionar proyecto: gkoyqfusawhnobvkoijc
   → SQL Editor → New Query
   ```

2. **Copiar y ejecutar SQL**
   ```
   Archivo: backups/VALIDACION_FINAL/limpieza-manual.sql

   Copiar TODO el contenido del archivo
   Pegarlo en SQL Editor
   Ejecutar paso a paso (leer comentarios)
   ```

3. **Verificar resultados**
   ```sql
   -- Debe mostrar solo 4 usuarios activos:
   SELECT email, is_disabled
   FROM auth.users
   WHERE email IN (
     'entidad@custodia.com',
     'delegado@custodia.com',
     'delegados@custodia.com',
     'ramon@custodia.com'
   );
   ```

**Output esperado**: 4 usuarios con `is_disabled = false`

---

## 🔴 PASO 2: MIGRATIONS CONSOLIDADAS (10 minutos)

### Qué hace:
- Verifica qué tablas ya existen
- Aplica migrations faltantes si necesario
- Confirma que todas las tablas críticas existen

### Cómo ejecutar:

1. **Verificar tablas existentes primero**
   ```sql
   -- En Supabase SQL Editor
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

2. **Comparar con tablas esperadas**
   ```
   ✅ Ya existen (según validación automática):
      - entities (2 registros)
      - entity_user_roles (0 registros)
      - guides (3 registros)
      - guide_sections (15 registros)
      - guide_anchors (13 registros)
      - message_templates (13 registros)
      - message_jobs (2 registros)

   ⚠️ Posiblemente faltan:
      - admin_health_logs
      - email_events
      - delegate_change_requests
      - delegate_change_logs
   ```

3. **Si faltan tablas, ejecutar migrations específicas**

   **Para sistema de guías** (si no existe):
   ```
   Archivo: database/guide-system.sql
   Copiar TODO → Ejecutar en SQL Editor
   ```

   **Para sistema de cambio de delegado** (si no existe):
   ```
   Archivo: database/backup-delegate-system.sql
   Copiar TODO → Ejecutar en SQL Editor
   ```

   **Para sistema de auditoría** (si no existe):
   ```
   Archivo: database/admin-health.sql (si existe)
   o scripts/sql/admin-health.sql
   Copiar TODO → Ejecutar en SQL Editor
   ```

4. **Ejecutar seed de guías**
   ```bash
   cd custodia-360
   bun run scripts/seed-guides.ts
   ```

**Output esperado**:
```
🌱 Starting guide seed process...
📘 Seeding guide for role: ENTIDAD
  ✅ Guide ID: [uuid]
  ...
✅ Guide seeding completed!
🎉 All done!
```

---

## 🟡 PASO 3: MIGRAR STRIPE A LIVE (OPCIONAL - 1 día)

### ⚠️ Solo si quieres procesar pagos REALES

**Estado actual**: TEST mode activo (detectado automáticamente)

### Pasos para migrar a LIVE:

1. **Obtener keys LIVE de Stripe**
   ```
   1. Login en https://dashboard.stripe.com/
   2. Desactivar "View test data" (cambiar a LIVE)
   3. Developers → API keys
   4. Copiar:
      - Secret key (sk_live_...)
      - Publishable key (pk_live_...)
   ```

2. **Configurar webhook LIVE**
   ```
   1. Developers → Webhooks
   2. Add endpoint
   3. URL: https://www.custodia360.es/api/stripe/webhook
   4. Events:
      - checkout.session.completed
      - invoice.payment_succeeded
      - invoice.payment_failed
      - customer.subscription.updated
      - customer.subscription.deleted
   5. Copiar Signing secret (whsec_...)
   ```

3. **Actualizar variables en Netlify**
   ```
   1. Netlify Dashboard → tu site
   2. Site settings → Environment variables
   3. Actualizar:
      - STRIPE_SECRET_KEY = sk_live_...
      - STRIPE_WEBHOOK_SECRET = whsec_...
      - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
   4. Trigger deploy
   ```

4. **Testing**
   ```
   1. Ir a /planes en tu site
   2. Seleccionar plan
   3. Usar tarjeta de prueba LIVE de Stripe
   4. Verificar webhook recibido
   5. Verificar entidad creada en Supabase
   ```

**Ver guía completa**: `.same/ACCION_INMEDIATA.md` FASE 5

---

## ✅ VERIFICACIÓN FINAL

Después de completar los pasos manuales:

### 1. Verificar acceso a todos los paneles
```bash
# Asegurarse que el servidor dev está corriendo
cd custodia-360
bun run dev

# Probar login con cada usuario:
# - entidad@custodia.com / 123 → /dashboard-entidad
# - delegado@custodia.com / 123 → /dashboard-delegado
# - delegados@custodia.com / 123 → /dashboard-suplente
# - ramon@custodia.com / 123 → /dashboard-custodia360
```

### 2. Verificar sistema de guías
```
1. Login en cualquier panel
2. Click en "🛈 Guía de uso C360"
3. Verificar que abre sidebar con contenido
4. Probar búsqueda
5. Probar descarga PDF
```

### 3. Verificar tablas en Supabase
```sql
-- Deben tener contenido:
SELECT COUNT(*) FROM guides;           -- Esperado: 3
SELECT COUNT(*) FROM guide_sections;   -- Esperado: 15
SELECT COUNT(*) FROM guide_anchors;    -- Esperado: 13
SELECT COUNT(*) FROM entities;         -- Esperado: 2+
SELECT COUNT(*) FROM message_templates; -- Esperado: 13
```

---

## 📊 CHECKLIST COMPLETO

```
Paso 1: SQL de Limpieza
□ Ejecutado en Supabase SQL Editor
□ Verificado 4 usuarios activos
□ RLS confirmado activo en tablas críticas

Paso 2: Migrations
□ Verificadas tablas existentes
□ Migrations faltantes ejecutadas (si había)
□ Seed de guías ejecutado
□ Tablas guides/guide_sections/guide_anchors con datos

Paso 3: Stripe LIVE (opcional)
□ Keys LIVE obtenidas de Stripe Dashboard
□ Webhook configurado
□ Variables actualizadas en Netlify
□ Testing con tarjeta de prueba LIVE

Verificación Final
□ Login funciona con 4 usuarios
□ Todos los dashboards accesibles
□ Sistema de guías operativo
□ Tablas de Supabase pobladas
```

---

## 🎯 RESULTADO ESPERADO

Al completar estos pasos:

✅ **Sistema limpio y consolidado**
- Solo usuarios activos necesarios
- RLS activo en todas las tablas
- Migrations aplicadas
- Sistema de guías funcional

✅ **Listo para siguiente fase**
- Git + GitHub (2 horas)
- Tests E2E (1 semana)
- Seguridad (1 semana)

---

## 🚨 PROBLEMAS COMUNES

### "Error: relation does not exist"
**Causa**: Tabla no existe
**Solución**: Ejecutar migration correspondiente de `database/`

### "Permission denied for table X"
**Causa**: RLS o permisos incorrectos
**Solución**: Verificar policies en Supabase Dashboard

### "User already exists"
**Causa**: Usuario ya creado previamente
**Solución**: Normal, skip ese paso

### Seed de guías falla
**Causa**: Tablas guides no existen
**Solución**: Ejecutar `database/guide-system.sql` primero

---

## 📞 AYUDA

- **Informe completo**: `.same/VALIDACION-FINAL.md`
- **Auditoría general**: `.same/AUDITORIA_COMPLETA_ENERO_2025.md`
- **Plan de acción**: `.same/ACCION_INMEDIATA.md`
- **Consultas**: Preguntar a Same AI en el chat

---

**Tiempo estimado total**: 15-30 minutos (sin Stripe LIVE)

**Estado al completar**: ✅ Sistema validado y listo para Git + Tests
