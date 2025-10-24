# 🎯 Panel Delegado Unificado - Implementación

## Objetivo

Crear un panel único, sencillo y potente para CUALQUIER delegado (novato o experto), válido para entidades de 10-5000 miembros.

## Estado: 🟢 FASE 1 COMPLETADA - API + Dashboard Base

---

## ✅ Completado (Fase 1)

- [x] Base de datos nuevas tablas (migration creada)
- [x] API endpoints comunicación (compose + history)
- [x] API endpoints documentos (generate + share)
- [x] API endpoints controles (overview)
- [x] API endpoints implementación (list + update)
- [x] API endpoints urgencias (setup + open + step + close)
- [x] API endpoints miembros (list unificado)
- [x] UI Dashboard principal con KPIs
- [ ] UI Comunicar (próxima fase)
- [ ] UI Documentos (próxima fase)
- [ ] UI Controles (próxima fase)
- [ ] UI Implementación (próxima fase)
- [ ] UI Miembros (próxima fase)
- [ ] UI Urgencia (modal - próxima fase)
- [ ] UI Inspección (próxima fase)
- [ ] Testing integración
- [x] Documentación base

---

## 📋 Tareas Pendientes

### 1. Base de Datos (Priority: HIGH)
- [ ] Crear `entity_contacts` (contactos de entidad)
- [ ] Crear `incident_types` (tipos de urgencia)
- [ ] Crear `urgent_incidents` (incidentes urgentes)
- [ ] Crear `message_receipts` (confirmaciones de lectura)
- [ ] Crear `pdf_templates` (si no existe)
- [ ] Crear `generated_pdfs` (si no existe)
- [ ] Crear `library_assets` (si no existe)
- [ ] Crear `library_shares` (si no existe)
- [ ] Crear `implementation_items` (si no existe)
- [ ] Crear `implementation_status` (si no existe)
- [ ] Crear `inspector_reports` (si no existe)
- [ ] Crear `action_logs` (si no existe)

### 2. API Endpoints (Priority: HIGH)
**Comunicación:**
- [ ] POST `/api/delegado/messages/compose` - Componer y enviar
- [ ] GET `/api/delegado/messages/history` - Historial con filtros

**Documentos:**
- [ ] POST `/api/delegado/docs/generate` - Generar PDF con placeholders
- [ ] POST `/api/delegado/docs/share` - Compartir por rol/individuo

**Controles:**
- [ ] GET `/api/delegado/controles/overview` - Vista general KPIs
- [ ] POST `/api/delegado/penales/mark` - Marcar entregado/verificado

**Implementación:**
- [ ] GET `/api/delegado/implementacion/list` - Lista de items
- [ ] POST `/api/delegado/implementacion/update` - Actualizar estado

**Urgencias:**
- [ ] GET `/api/delegado/urgencia/setup` - Tipos y teléfonos
- [ ] POST `/api/delegado/urgencia/open` - Abrir incidente
- [ ] POST `/api/delegado/urgencia/step` - Marcar paso
- [ ] POST `/api/delegado/urgencia/close` - Cerrar incidente

**Inspección:**
- [ ] GET `/api/delegado/inspeccion/report` - Generar informe PDF

**Miembros:**
- [ ] GET `/api/delegado/miembros/list` - Lista paginada con filtros

**Auditoría:**
- [ ] POST `/api/logs/track` - Log de acciones

### 3. UI Components (Priority: MEDIUM)
**Dashboard:**
- [ ] Tarjetas KPIs (formación, penales, implementación)
- [ ] Acciones rápidas (botones grandes)

**Comunicar:**
- [ ] Selector alcance (individual/rol/entidad)
- [ ] Selector canal (email/whatsapp)
- [ ] Selector plantilla
- [ ] Previsualización merge
- [ ] Historial enviados

**Documentos:**
- [ ] Lista plantillas por sector
- [ ] Generador 1-clic con auto-fill
- [ ] Compartir selector
- [ ] Historial compartidos

**Controles:**
- [ ] Tabla formación (paginada/virtualizada)
- [ ] Tabla penales (paginada/virtualizada)
- [ ] Filtros y búsqueda
- [ ] Acciones masivas

**Implementación:**
- [ ] Checklist interactivo
- [ ] Editor de notas
- [ ] Sugerencias contextuales

**Miembros:**
- [ ] Tabla unificada (virtualizada)
- [ ] Búsqueda y filtros
- [ ] Acciones por fila
- [ ] Vista detalle

**Urgencia:**
- [ ] Botón fijo navbar
- [ ] Modal con tipos
- [ ] Pasos guiados checkeable
- [ ] Teléfonos de contacto
- [ ] Registro acciones

**Inspección:**
- [ ] Generador informe
- [ ] Historial informes
- [ ] Descarga PDF

### 4. Optimizaciones (Priority: LOW)
- [ ] Virtualización para listas grandes
- [ ] Server-side pagination
- [ ] Índices BD optimizados
- [ ] Cache de consultas frecuentes
- [ ] Lazy loading de modales

### 5. Testing (Priority: MEDIUM)
- [ ] Test endpoints API
- [ ] Test flujo comunicación
- [ ] Test generación documentos
- [ ] Test urgencias
- [ ] Test inspección
- [ ] Test con 1000+ miembros

### 6. Documentación (Priority: LOW)
- [ ] Guía de uso panel delegado
- [ ] API documentation
- [ ] Troubleshooting guide

---

## 🔧 Notas Técnicas

### Reutilizar
- `message_templates`, `message_jobs`, `message_recipients` (email system)
- `delegados` table (personas)
- `entidades` table
- Supabase Auth
- Resend integration
- absoluteUrl() helper

### Stack
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (DB + Auth + Storage)
- Resend (email)
- react-virtual (virtualización)

### Escalabilidad
- Paginación server-side por defecto
- Virtualización para listas >100 items
- Índices en columnas filtradas
- Cache de 30-60s en queries pesadas

---

## 📝 Próximos Pasos Inmediatos

1. ✅ Crear migration con nuevas tablas
2. ⏳ Crear estructura de rutas `/panel/delegado/*`
3. ⏳ Implementar API endpoints base
4. ⏳ Crear componentes UI reutilizables
5. ⏳ Integrar con sistema de emails existente
6. ⏳ Testing básico
7. ⏳ Crear versión
