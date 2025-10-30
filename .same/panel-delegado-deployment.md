# 🚀 Panel Delegado Unificado - Guía de Deployment

## Estado Actual: FASE 1 COMPLETADA

### ✅ Lo que está Implementado

1. **Base de Datos** ✅
   - Migration completa en `supabase/migrations/20250112_delegado_panel_unified.sql`
   - 12 nuevas tablas creadas
   - Seeds de incident_types e implementation_items
   - Índices optimizados

2. **API Endpoints** ✅
   - `/api/delegado/messages/compose` - Enviar email/WhatsApp
   - `/api/delegado/messages/history` - Historial con filtros
   - `/api/delegado/docs/generate` - Generar PDFs
   - `/api/delegado/controles/overview` - KPIs formación + penales
   - `/api/delegado/implementacion/list` - Checklist con estado
   - `/api/delegado/implementacion/update` - Actualizar items
   - `/api/delegado/urgencia/setup` - Tipos y contactos
   - `/api/delegado/urgencia/open` - Abrir incidente
   - `/api/delegado/urgencia/step` - Marcar pasos
   - `/api/delegado/urgencia/close` - Cerrar incidente
   - `/api/delegado/miembros/list` - Vista unificada miembros

3. **UI Implementada** ✅
   - `/panel/delegado` - Dashboard con KPIs y acciones rápidas

---

## 📋 Checklist de Deployment

### 1. Base de Datos (CRÍTICO)

```bash
# Ejecutar migration en Supabase SQL Editor
supabase/migrations/20250112_delegado_panel_unified.sql
```

**Verificar que se crearon:**
- [x] `entity_contacts`
- [x] `incident_types` (con 8 tipos seed)
- [x] `urgent_incidents`
- [x] `pdf_templates`
- [x] `generated_pdfs`
- [x] `library_assets`
- [x] `library_shares`
- [x] `implementation_items` (con 13 items seed)
- [x] `implementation_status`
- [x] `inspector_reports`
- [x] `action_logs`
- [x] `message_receipts`

**Verificar seeds:**
```sql
SELECT COUNT(*) FROM incident_types; -- Debe ser 8
SELECT COUNT(*) FROM implementation_items; -- Debe ser 13
```

### 2. Verificar API Endpoints

**Test manual:**
```bash
# Controles overview
curl "https://www.custodia360.es/api/delegado/controles/overview?entityId=UUID"

# Implementación
curl "https://www.custodia360.es/api/delegado/implementacion/list?entityId=UUID"

# Urgencias setup
curl "https://www.custodia360.es/api/delegado/urgencia/setup?entityId=UUID"

# Miembros
curl "https://www.custodia360.es/api/delegado/miembros/list?entityId=UUID&limit=10"
```

### 3. Acceso al Panel

**Ruta:** `https://www.custodia360.es/panel/delegado`

**Requiere:** Sesión de delegado en localStorage

**Test de acceso:**
1. Login con credenciales de delegado
2. Navegar a `/panel/delegado`
3. Verificar que se muestran KPIs
4. Verificar botones de acciones rápidas

### 4. Integración con Sistema Existente

**Reutiliza (NO rompe nada):**
- ✅ `message_templates`, `message_jobs`, `message_recipients` (email system)
- ✅ `delegados` table (miembros/personas)
- ✅ `entidades` table
- ✅ `trainings` table (formación)
- ✅ `background_checks` table (penales)
- ✅ Supabase Auth
- ✅ Resend integration
- ✅ `absoluteUrl()` helper

**Nuevas tablas (aisladas):**
- entity_contacts
- incident_types
- urgent_incidents
- pdf_templates
- generated_pdfs
- library_assets
- library_shares
- implementation_items
- implementation_status
- inspector_reports
- action_logs
- message_receipts

---

## 🔧 Configuración Adicional

### Contactos de Entidad (Opcional)

Cada entidad puede personalizar sus contactos de emergencia:

```sql
INSERT INTO entity_contacts (entity_id, nombre, telefono, tipo) VALUES
  ('UUID_ENTIDAD', 'Director: Juan Pérez', '600123456', 'direccion'),
  ('UUID_ENTIDAD', 'Delegado Suplente: María López', '600654321', 'delegado'),
  ('UUID_ENTIDAD', 'Servicios Sociales Locales', '987654321', 'servicios_sociales');
```

### Plantillas PDF (Pendiente Implementación)

Por ahora, `pdf_templates` debe poblarse manualmente. Ejemplo:

```sql
INSERT INTO pdf_templates (slug, nombre, sector, categoria, plantilla_html) VALUES
(
  'plan-proteccion',
  'Plan de Protección Infantil',
  'general',
  'plan',
  '<html>
    <h1>Plan de Protección de {{entidad}}</h1>
    <p>Delegado: {{delegado}}</p>
    <p>Fecha: {{fecha}}</p>
    <!-- Resto del contenido -->
  </html>'
);
```

**Placeholders soportados:**
- `{{entidad}}`
- `{{sector}}`
- `{{delegado}}`
- `{{delegado_email}}`
- `{{delegado_telefono}}`
- `{{fecha}}`
- `{{fecha_larga}}`
- `{{panel_url}}`

---

## 🎯 Próximos Pasos (FASE 2)

### UI Pendiente de Crear

1. **`/panel/delegado/comunicar`**
   - Selector de alcance (individual/rol/entidad)
   - Selector de plantilla
   - Previsualización con merge
   - Envío por email o WhatsApp
   - Historial de envíos

2. **`/panel/delegado/documentos`**
   - Lista de plantillas
   - Generador 1-clic
   - Compartir selector
   - Historial

3. **`/panel/delegado/controles`**
   - Pestaña Formación (tabla virtualizada)
   - Pestaña Penales (tabla virtualizada)
   - Filtros y búsqueda
   - Acciones masivas (recordatorios)

4. **`/panel/delegado/implementacion`**
   - Checklist interactivo
   - Marcar completado/en progreso
   - Notas por item
   - Sugerencias de documentos

5. **`/panel/delegado/miembros`**
   - Tabla unificada virtualizada
   - Búsqueda y filtros
   - Vista detalle
   - Acciones por fila (enviar mensaje, compartir doc)

6. **Componente Urgencia (Modal)**
   - Selector de tipo de urgencia
   - Pasos guiados con checkboxes
   - Teléfonos de contacto
   - Registrar acciones
   - Cerrar incidente

7. **`/panel/delegado/inspeccion`**
   - Generar informe PDF
   - Historial de informes
   - Descargar

8. **`/panel/delegado/biblioteca`**
   - Upload documentos
   - Compartir por rol/individuo
   - Enlaces firmados
   - Envío por email/WhatsApp

---

## 📊 Escalabilidad

### Para Entidades Grandes (500+ miembros)

**Implementar:**
1. **Paginación server-side**
   - Ya incluida en endpoints (param `limit` y `offset`)
   - UI debe implementar "Load More" o infinite scroll

2. **Virtualización**
   - Instalar `react-virtual` o `react-virtualized`
   - Aplicar en tablas de >100 rows

3. **Filtros server-side**
   - Ya soportados en endpoints
   - UI debe pasar filtros como query params

4. **Caché**
   - Considerar SWR o React Query
   - Revalidar cada 30-60s

5. **Índices BD**
   - Ya creados en migration
   - Monitorear performance con EXPLAIN

---

## 🔍 Testing

### Test Manual Checklist

- [ ] Login como delegado
- [ ] Dashboard muestra KPIs correctos
- [ ] Click en "Comunicar" (debe mostrar "Próximamente")
- [ ] Click en "Documentos" (debe mostrar "Próximamente")
- [ ] Click en "Controles" (debe mostrar "Próximamente")
- [ ] Click en "Implementación" (debe mostrar "Próximamente")
- [ ] Click en "Miembros" (debe mostrar "Próximamente")
- [ ] Click en "URGENCIA" (debe mostrar alert "Próximamente")
- [ ] KPIs de formación correctos
- [ ] KPIs de penales correctos
- [ ] KPIs de implementación correctos
- [ ] Cerrar sesión funciona

### Test API Endpoints

```bash
# Variables
ENTITY_ID="uuid-de-entidad"
USER_ID="uuid-de-delegado"

# 1. Controles overview
curl -X GET "http://localhost:3000/api/delegado/controles/overview?entityId=$ENTITY_ID"

# 2. Implementación list
curl -X GET "http://localhost:3000/api/delegado/implementacion/list?entityId=$ENTITY_ID"

# 3. Miembros list
curl -X GET "http://localhost:3000/api/delegado/miembros/list?entityId=$ENTITY_ID&limit=10"

# 4. Urgencia setup
curl -X GET "http://localhost:3000/api/delegado/urgencia/setup?entityId=$ENTITY_ID"

# 5. Compose message
curl -X POST "http://localhost:3000/api/delegado/messages/compose" \
  -H "Content-Type: application/json" \
  -d '{
    "entityId": "'$ENTITY_ID'",
    "scope": "rol",
    "rol": "personal_contacto",
    "templateSlug": "rec-30d-contacto",
    "channel": "email",
    "userId": "'$USER_ID'"
  }'
```

---

## 🐛 Troubleshooting

### "No se muestran KPIs en dashboard"

**Causas posibles:**
1. Entity_id no existe en sesión
2. No hay datos en `trainings` o `background_checks`
3. Error en endpoint

**Solución:**
```bash
# Verificar sesión
console.log(localStorage.getItem('userSession'))

# Verificar endpoint
curl "https://www.custodia360.es/api/delegado/controles/overview?entityId=UUID"

# Verificar datos
SELECT * FROM trainings WHERE person_id IN (
  SELECT id FROM delegados WHERE entity_id = 'UUID'
);
```

### "Incident types no aparecen"

**Causa:** Seeds no ejecutados

**Solución:**
```sql
SELECT COUNT(*) FROM incident_types;
-- Si es 0, ejecutar la parte de INSERT de la migration
```

### "Implementación muestra 0% siempre"

**Causa:** No hay registros en `implementation_status`

**Normal:** Al inicio, todas las entidades empiezan en 0%

**Solución:** Delegado debe ir marcando items como completados desde la UI

---

## 📝 Documentación para Delegados

### Guía Rápida

**¿Qué puedo hacer desde el panel?**

1. **Comunicar**
   - Enviar emails o WhatsApp a miembros
   - Por rol (contacto, sin contacto, familias)
   - Individual o a toda la entidad

2. **Documentos**
   - Generar protocolos y planes en 1 clic
   - Auto-completar con datos de la entidad
   - Compartir con miembros

3. **Controles**
   - Ver estado de formación
   - Ver estado de certificados penales
   - Enviar recordatorios

4. **Implementación**
   - Checklist LOPIVI
   - Marcar completados
   - Ver progreso

5. **Miembros**
   - Vista completa de todos
   - Buscar y filtrar
   - Ver qué falta a cada uno

6. **Urgencia**
   - Guía paso a paso ante incidentes
   - Teléfonos de emergencia
   - Registro de acciones

7. **Inspección**
   - Generar informes de cumplimiento
   - Listo para inspectores
   - Descargar PDF

---

## 🔐 Seguridad

- ✅ Middleware protege rutas `/panel/delegado/*`
- ✅ RLS en Supabase por `entity_id`
- ✅ Service role key en endpoints server-only
- ✅ Logs de auditoría en `action_logs`
- ✅ No exponer datos sensibles de menores
- ✅ Storage privado + URLs firmadas

---

## ✅ Checklist Final Deployment

### Pre-Deployment
- [x] Migration SQL lista
- [x] API endpoints creados
- [x] Dashboard UI creado
- [ ] Testing local completo
- [ ] Verificar no rompe flujos existentes

### Deployment
- [ ] Ejecutar migration en Supabase
- [ ] Verificar seeds (8 incident_types, 13 implementation_items)
- [ ] Deploy a Netlify
- [ ] Test en producción

### Post-Deployment
- [ ] Test login delegado
- [ ] Verificar KPIs se cargan
- [ ] Documentar para el equipo
- [ ] Crear tutorial en video (opcional)

---

**Estado:** FASE 1 COMPLETADA ✅
**Siguiente:** Implementar UI de páginas específicas (Comunicar, Documentos, Controles, etc.)
**Fecha:** 11 Enero 2025
