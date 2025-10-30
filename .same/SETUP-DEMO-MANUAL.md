# 🎯 SETUP SISTEMA DEMO - INSTRUCCIONES MANUALES

**Fecha creación:** 25 de Octubre 2025, 17:00 UTC
**Autorizado por:** Usuario
**Ejecutado por:** SAME AI
**Estado:** ✅ Scripts creados, pendiente ejecución manual

---

## 📋 RESUMEN EJECUTIVO

Se han creado **4 scripts y componentes** para configurar el sistema DEMO de Custodia360:

1. ✅ `database/setup-demo-system.sql` - Script SQL completo
2. ✅ `scripts/setup-demo-users.ts` - Script creación usuarios Auth
3. ✅ `src/components/demo/DemoBadge.tsx` - Componente badge DEMO
4. ✅ `src/app/api/demo/notify/route.ts` - API email confirmación

**Debes ejecutar los pasos siguientes EN ORDEN.**

---

## 🚨 ANTES DE EMPEZAR - BACKUPS OBLIGATORIOS

### PASO 0: Exportar CSV desde Supabase Dashboard

1. **Ir a Supabase Dashboard** → https://supabase.com/dashboard
2. Seleccionar proyecto Custodia360
3. **Table Editor** → Exportar estas 3 tablas:

```
📂 Crear carpeta en tu PC: backups/20251025-1700/

Exportar:
1. auth.users → backups/20251025-1700/auth_users.csv
2. public.entities → backups/20251025-1700/entities.csv
3. public.entity_user_roles → backups/20251025-1700/entity_user_roles.csv
```

⚠️ **NO CONTINÚES sin estos backups**. Son tu red de seguridad.

---

## ⚙️ PASO 1: EJECUTAR SCRIPT SQL

### 1.1 Ir a Supabase SQL Editor

```
1. Supabase Dashboard → SQL Editor
2. Click "New query"
```

### 1.2 Copiar y ejecutar SQL

```
1. Abrir archivo: custodia-360/database/setup-demo-system.sql
2. Copiar TODO el contenido
3. Pegar en SQL Editor
4. Click "Run" (esquina inferior derecha)
```

### 1.3 Verificar resultados

**Deberías ver en el output:**
```
✅ DEMO ENTITY CREATED: CUSTODIA360_DEMO_ENTITY (id: DEMO-ENTITY-001)
✅ Políticas RLS creadas
✅ Columnas is_demo añadidas
```

**Verificar en Table Editor:**
```sql
-- Entidad DEMO existe
SELECT * FROM public.entities WHERE id = 'DEMO-ENTITY-001';

-- Columna is_demo existe
SELECT column_name FROM information_schema.columns
WHERE table_name = 'entities' AND column_name = 'is_demo';
```

---

## 👥 PASO 2: CREAR USUARIOS DEMO (SUPABASE AUTH)

### 2.1 Ejecutar script TypeScript

```bash
cd custodia-360
bun run scripts/setup-demo-users.ts
```

### 2.2 Output esperado

```
═══════════════════════════════════════════════════════════════════════════════
🚀 CUSTODIA360 - SETUP DEMO USERS
═══════════════════════════════════════════════════════════════════════════════

🧹 Deshabilitando usuarios @custodia.com antiguos...
📋 Usuarios a deshabilitar: X

─────────────────────────────────────────────────────────────────────────────
👤 CREANDO/ACTUALIZANDO USUARIOS DEMO
─────────────────────────────────────────────────────────────────────────────

🔧 Procesando usuario: entidad@custodia.com
✅ Usuario creado/actualizado: entidad@custodia.com

🔧 Procesando usuario: delegado@custodia.com
✅ Usuario creado/actualizado: delegado@custodia.com

🔧 Procesando usuario: delegados@custodia.com
✅ Usuario creado/actualizado: delegados@custodia.com

🔧 Procesando usuario: ramon@custodia.com
✅ Usuario creado/actualizado: ramon@custodia.com

─────────────────────────────────────────────────────────────────────────────
🔐 ASIGNANDO ROLES A ENTIDAD DEMO
─────────────────────────────────────────────────────────────────────────────

🔐 Asignando rol ENTIDAD a entidad@custodia.com
✅ Rol ENTIDAD asignado

🔐 Asignando rol DELEGADO a delegado@custodia.com
✅ Rol DELEGADO asignado

🔐 Asignando rol SUPLENTE a delegados@custodia.com
✅ Rol SUPLENTE asignado

🔐 Asignando rol ADMIN a ramon@custodia.com
✅ Rol ADMIN asignado

═══════════════════════════════════════════════════════════════════════════════
✅ CONFIGURACIÓN DEMO COMPLETADA
═══════════════════════════════════════════════════════════════════════════════

📊 RESUMEN:
  • Usuarios creados/actualizados: 4
  • Entidad DEMO: DEMO-ENTITY-001

👥 USUARIOS DEMO:
  • entidad@custodia.com          → ENTIDAD
  • delegado@custodia.com         → DELEGADO
  • delegados@custodia.com        → SUPLENTE
  • ramon@custodia.com            → ADMIN

🔑 CREDENCIALES:
  • Password: 123 (para todos)

🔗 ACCESO:
  • ENTIDAD:   /dashboard-entidad
  • DELEGADO:  /dashboard-delegado
  • SUPLENTE:  /dashboard-suplente
  • ADMIN:     /admin

✅ Proceso finalizado correctamente
```

### 2.3 Verificar en Supabase Auth

```
1. Supabase Dashboard → Authentication → Users
2. Buscar usuarios @custodia.com
3. Verificar que existen los 4 usuarios DEMO
4. Verificar user_metadata: { "is_demo": true }
```

---

## 🔧 PASO 3: CONFIGURAR VARIABLE NETLIFY

### 3.1 Añadir DEMO_ENABLED

```
1. Netlify Dashboard → Sites → custodia360
2. Site settings → Environment variables
3. Click "Add a variable"
   - Key: DEMO_ENABLED
   - Value: true
   - Scopes: Production, Deploy previews, Branch deploys
4. Click "Save"
```

### 3.2 Redeploy (opcional)

```
1. Netlify → Deploys → Trigger deploy
2. Deploy site
```

**Nota:** No es necesario si solo añades la variable, pero recomendado.

---

## 📧 PASO 4: ENVIAR EMAIL DE CONFIRMACIÓN

### 4.1 Ejecutar desde terminal o Thunder Client/Postman

```bash
curl -X POST https://www.custodia360.es/api/demo/notify \
  -H "Content-Type: application/json" \
  -d '{
    "users": [
      {"email": "entidad@custodia.com", "role": "ENTIDAD"},
      {"email": "delegado@custodia.com", "role": "DELEGADO"},
      {"email": "delegados@custodia.com", "role": "SUPLENTE"},
      {"email": "ramon@custodia.com", "role": "ADMIN"}
    ],
    "entity": {
      "id": "DEMO-ENTITY-001",
      "name": "CUSTODIA360_DEMO_ENTITY"
    },
    "timestamp": "2025-10-25T17:00:00Z"
  }'
```

### 4.2 Verificar email recibido

```
1. Revisar inbox: soporte@custodia360.es
2. Asunto: "✅ Cuentas DEMO Actualizadas - 25/10/2025"
3. Verificar contenido HTML completo
```

---

## 🧪 PASO 5: TESTING COMPLETO

### 5.1 Test Login DEMO

**Para cada usuario:**

```
1. Ir a: https://www.custodia360.es/login
2. Login con:
   - entidad@custodia.com / 123
   - delegado@custodia.com / 123
   - delegados@custodia.com / 123
   - ramon@custodia.com / 123

3. Verificar redirección correcta:
   - ENTIDAD   → /dashboard-entidad
   - DELEGADO  → /dashboard-delegado
   - SUPLENTE  → /dashboard-suplente
   - ADMIN     → /admin

4. Verificar badge "MODO DEMO" visible en header
5. Verificar banner informativo amarillo
```

### 5.2 Test Aislamiento DEMO

```sql
-- En Supabase SQL Editor
SELECT * FROM public.entities WHERE is_demo = true;
-- Debe devolver: DEMO-ENTITY-001

SELECT * FROM public.entity_user_roles WHERE is_demo = true;
-- Debe devolver: 4 roles (ENTIDAD, DELEGADO, SUPLENTE, ADMIN)
```

### 5.3 Test Deshabilitación Pagos

```
1. Login como entidad@custodia.com
2. Ir a sección "Contratar Kit de Comunicación"
3. Verificar que el botón de pago está DESHABILITADO
4. Verificar mensaje: "Función deshabilitada en modo DEMO"
```

---

## 🚫 PASO 6: VERIFICAR USUARIOS ANTIGUOS DESHABILITADOS

### 6.1 Revisar en Supabase Auth

```
1. Supabase Dashboard → Authentication → Users
2. Buscar usuarios con @custodia.com
3. Verificar que SOLO existen los 4 oficiales:
   - entidad@custodia.com   ✅
   - delegado@custodia.com  ✅
   - delegados@custodia.com ✅
   - ramon@custodia.com     ✅

4. Otros usuarios @custodia.com deben tener:
   - Estado: Banned
   - Metadata: disabled_reason = "Limpieza sistema DEMO - 2025-10-25"
```

### 6.2 Revisar audit_log

```sql
SELECT * FROM public.audit_log
WHERE action LIKE 'demo.%'
ORDER BY timestamp DESC
LIMIT 20;
```

**Eventos esperados:**
```
demo.setup.started
demo.schema.altered
demo.cleanup.users_identified
demo.cleanup.users_disabled
demo.entity.created
demo.rls.policies_created
demo.users.setup_started
demo.users.setup_completed
demo.notification.sent
```

---

## 🔐 PASO 7: CONFIGURAR SWITCH DE EMERGENCIA

### 7.1 Test DEMO_ENABLED = false

```
1. Netlify → Environment variables
2. Cambiar DEMO_ENABLED = false
3. Redeploy site
4. Intentar login con entidad@custodia.com
5. Verificar mensaje: "Modo DEMO deshabilitado. Contacte con soporte."
```

### 7.2 Restaurar DEMO_ENABLED = true

```
1. Netlify → Environment variables
2. Cambiar DEMO_ENABLED = true
3. Redeploy site
4. Verificar que login DEMO funciona de nuevo
```

---

## 📊 CHECKLIST FINAL

Marca cada item cuando lo completes:

### Backups
- [ ] ✅ auth_users.csv exportado
- [ ] ✅ entities.csv exportado
- [ ] ✅ entity_user_roles.csv exportado

### Base de Datos
- [ ] ✅ SQL ejecutado en Supabase
- [ ] ✅ Entidad DEMO creada (DEMO-ENTITY-001)
- [ ] ✅ Columnas is_demo añadidas
- [ ] ✅ Políticas RLS activas
- [ ] ✅ Función is_demo_user() creada

### Usuarios Auth
- [ ] ✅ Script setup-demo-users.ts ejecutado
- [ ] ✅ 4 usuarios DEMO creados/actualizados
- [ ] ✅ Passwords establecidos (123)
- [ ] ✅ user_metadata.is_demo = true
- [ ] ✅ Usuarios antiguos @custodia.com deshabilitados

### Roles
- [ ] ✅ Rol ENTIDAD asignado
- [ ] ✅ Rol DELEGADO asignado
- [ ] ✅ Rol SUPLENTE asignado
- [ ] ✅ Rol ADMIN asignado
- [ ] ✅ Todos con is_demo = true

### Configuración
- [ ] ✅ Variable DEMO_ENABLED=true en Netlify
- [ ] ✅ Site redeployed
- [ ] ✅ Badge DEMO visible en headers
- [ ] ✅ Banner informativo funcional

### Testing
- [ ] ✅ Login DEMO exitoso (4 usuarios)
- [ ] ✅ Redirección por rol correcta
- [ ] ✅ Aislamiento DEMO verificado (RLS)
- [ ] ✅ Pagos deshabilitados en DEMO
- [ ] ✅ Switch emergencia testeado

### Notificación
- [ ] ✅ Email confirmación enviado
- [ ] ✅ Email recibido en soporte@custodia360.es
- [ ] ✅ Contenido HTML correcto

### Audit Log
- [ ] ✅ Todos los eventos registrados
- [ ] ✅ Sin errores en audit_log

---

## 🆘 TROUBLESHOOTING

### Problema: Script SQL falla

**Solución:**
```
1. Verificar que tienes permisos service_role
2. Ejecutar línea por línea para identificar el problema
3. Revisar que las tablas no existan ya con schema diferente
```

### Problema: No se crean usuarios en Auth

**Solución:**
```
1. Verificar SUPABASE_SERVICE_ROLE_KEY en .env.local
2. Verificar que no existe límite de usuarios en Supabase
3. Ejecutar con --verbose para ver errores:
   bun run scripts/setup-demo-users.ts --verbose
```

### Problema: Login DEMO no redirige correctamente

**Solución:**
```
1. Verificar que localStorage.userSession tiene el email correcto
2. Verificar que el rol está en entity_user_roles
3. Limpiar localStorage y volver a hacer login
```

### Problema: Badge DEMO no aparece

**Solución:**
```
1. Verificar que el email contiene @custodia.com
2. Limpiar caché del navegador (Ctrl+Shift+R)
3. Verificar que el componente DemoBadge está importado en headers
```

### Problema: Email de confirmación no llega

**Solución:**
```
1. Verificar RESEND_API_KEY en .env.local
2. Verificar que soporte@custodia360.es existe
3. Revisar spam/promotions
4. Ejecutar curl con -v para ver respuesta detallada
```

---

## 🔄 REVERSIÓN (SI ALGO SALE MAL)

### Opción 1: Restaurar desde CSV

```
1. Supabase Dashboard → Table Editor
2. Seleccionar tabla afectada
3. Delete all rows (CUIDADO)
4. Import CSV desde backups/20251025-1700/
```

### Opción 2: Deshabilitar DEMO_ENABLED

```
1. Netlify → DEMO_ENABLED = false
2. Redeploy
3. Usuarios DEMO no podrán acceder
4. Datos de producción intactos
```

### Opción 3: Borrar entidad DEMO

```sql
-- En Supabase SQL Editor
DELETE FROM public.entity_user_roles WHERE entity_id = 'DEMO-ENTITY-001';
DELETE FROM public.entities WHERE id = 'DEMO-ENTITY-001';
```

---

## 📞 SOPORTE

**Si necesitas ayuda:**

1. Revisar audit_log para identificar el paso que falló
2. Exportar logs de Supabase/Netlify
3. Contactar a soporte@custodia360.es con:
   - Timestamp del error
   - Paso en el que fallaste
   - Screenshot del error
   - audit_log relevante

---

## ✅ SIGUIENTE PASO

Una vez completado TODO el checklist, el sistema DEMO estará 100% funcional.

**Puedes compartir credenciales DEMO con:**
- Clientes potenciales
- Equipo de ventas
- Testers internos
- Demos en vivo

**Sin riesgo de:**
- Afectar datos de producción
- Generar cargos reales
- Enviar emails a clientes reales
- Crear registros en Holded

---

**Fin de instrucciones** ✅

*Generado automáticamente por SAME AI - 25 Oct 2025*
