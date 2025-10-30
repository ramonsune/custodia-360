# 🚀 Panel Delegado Unificado - Guía de Migración

## 📋 Resumen Ejecutivo

Este documento es tu **punto de entrada principal** para activar el Panel Delegado Unificado de Custodia360.

### ¿Qué vas a hacer?
Ejecutar una migración SQL en Supabase que creará **12 nuevas tablas** con toda la funcionalidad del panel delegado:
- ✅ Sistema de urgencias con protocolos guiados
- ✅ Checklist de implementación LOPIVI (13 items)
- ✅ Gestión de documentos y plantillas PDF
- ✅ Biblioteca de recursos
- ✅ Informes de inspección
- ✅ Contactos de emergencia
- ✅ Auditoría de acciones

### ⏱️ Tiempo Total: 10-15 minutos

---

## 🎯 Estado Actual

### ✅ Ya Completado (100%)
- Frontend del panel delegado
- 8 páginas funcionales (Comunicar, Documentos, Controles, Implementación, Urgencia, etc.)
- API endpoints (80%)
- Sistema de autenticación
- Acceso desde `/acceso` y `/login`
- Componente de urgencias con modal
- Scripts de migración SQL

### ⏳ Pendiente (Tu Tarea)
- Ejecutar migración en Supabase
- Crear datos de prueba
- Verificar KPIs en el dashboard

---

## 📚 Archivos y Guías Disponibles

### 🌟 Guía Principal (LEE ESTO PRIMERO)
**`.same/GUIA-VISUAL-MIGRACION.md`** - Guía visual paso a paso con "screenshots" en ASCII

### 📄 Scripts SQL (En Orden de Ejecución)
1. **`supabase/migrations/pre_migration_check.sql`** - Verificación PRE-migración
2. **`supabase/migrations/20250112_delegado_panel_unified.sql`** - Migración principal
3. **`supabase/migrations/quick_check.sql`** - Verificación rápida
4. **`supabase/migrations/verificar_panel_delegado.sql`** - Verificación completa
5. **`supabase/migrations/seed_datos_prueba_panel.sql`** - Datos de prueba

### 📖 Documentación Adicional
- **`.same/ejecutar-migracion.md`** - Instrucciones de ejecución
- **`.same/INSTRUCCIONES-MIGRACION.md`** - Guía detallada
- **`.same/todos.md`** - Estado del proyecto y pendientes

---

## 🚀 Inicio Rápido (5 Pasos)

### Paso 1: Accede a Supabase SQL Editor
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto Custodia360
3. Click en **Database** → **SQL Editor**

### Paso 2: Ejecuta Pre-verificación
```sql
-- Copia y pega el contenido de:
-- supabase/migrations/pre_migration_check.sql
```
**Resultado esperado:** ✅ "SISTEMA LISTO PARA MIGRACIÓN"

### Paso 3: Ejecuta Migración Principal
```sql
-- Copia y pega el contenido de:
-- supabase/migrations/20250112_delegado_panel_unified.sql
```
**Resultado esperado:** ✅ "Success. No rows returned" + 12 tables created

### Paso 4: Verifica Creación
```sql
-- Copia y pega el contenido de:
-- supabase/migrations/quick_check.sql
```
**Resultado esperado:**
- `tablas_creadas: 12`
- `incident_types: 8`
- `implementation_items: 13`

### Paso 5: Crea Datos de Prueba
1. Copia tu `entity_id` del paso 4
2. Copia tu `user_id` del paso 4
3. Edita `seed_datos_prueba_panel.sql` (líneas 13-14)
4. Ejecuta el script editado

**Resultado esperado:** ✅ "DATOS DE PRUEBA CREADOS"

---

## 🎉 Verificar que Funciona

### Accede al Panel Delegado
1. Ve a: https://www.custodia360.es/acceso
2. Click en "3️⃣ Panel Delegado Unificado"
3. O login manual:
   - Email: `delegado@custodia360.com`
   - Password: `delegado123`

### Verifica los KPIs
Deberías ver en el dashboard:

```
┌─────────────────────────────────────────┐
│ Panel del Delegado                      │
│                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│ │Formación │ │Certificados││Implement.││
│ │ Personal │ │  Penales  ││  LOPIVI  ││
│ │   0%     │ │    0%     ││   23%    ││
│ │  0/0     │ │   0/0     ││  3/13    ││
│ └──────────┘ └──────────┘ └──────────┘│
└─────────────────────────────────────────┘
```

**KPI Clave:** Implementación LOPIVI debe mostrar **23%** (3 de 13 completados)

### Prueba las Funcionalidades

#### 1️⃣ Test de Urgencias
- Click en botón "⚠️ URGENCIA"
- El modal debe abrir
- Deberías ver **7 contactos de emergencia**
- Deberías ver **8 tipos de urgencias**

#### 2️⃣ Test de Checklist
- Click en botón "📋 Implementación"
- Deberías ver **13 items**
- 3 marcados como **"Completado"** (verde):
  - ✅ Formación del Delegado
  - ✅ Plan de Protección Infantil
  - ✅ Código de Conducta
- 2 marcados como **"En progreso"** (azul):
  - 🔵 Protocolo de Actuación
  - 🔵 Canal de Denuncias

#### 3️⃣ Test de Documentos
- Click en botón "📄 Documentos"
- Deberías ver **4 plantillas disponibles**:
  - Plan de Protección Infantil
  - Protocolo de Actuación
  - Código de Conducta
  - Información para Familias

---

## 🔍 Troubleshooting

### Problema: "relation does not exist"
**Causa:** La tabla no existe en Supabase

**Solución:**
1. Si es una tabla base (`entidades`, `delegados`): Ejecuta las migraciones base primero
2. Si es una tabla nueva (`implementation_items`, etc.): Re-ejecuta la migración principal

### Problema: KPIs muestran 0% en todo
**Causa:** No hay datos de prueba o la migración no se ejecutó

**Solución:**
```sql
-- Verifica que los datos se crearon
SELECT COUNT(*) FROM implementation_status; -- Debe ser 13
SELECT COUNT(*) FROM entity_contacts;      -- Debe ser 7
```

### Problema: "already exists"
**Causa:** La tabla ya fue creada anteriormente

**Solución:** ¡Perfecto! La migración ya se ejecutó. Continúa con el paso de verificación.

### Problema: Modal de URGENCIA no abre
**Causa:** Error de JavaScript o componente no cargó

**Solución:**
1. Abre consola del navegador (F12)
2. Busca errores en rojo
3. Refresca la página (F5)
4. Si persiste, limpia localStorage y vuelve a entrar

---

## 📊 ¿Qué Se Crea en la Migración?

### 12 Tablas Nuevas

#### Gestión de Urgencias (3 tablas)
- **`entity_contacts`** - Contactos de emergencia (112, policía, fiscalía, etc.)
- **`incident_types`** - 8 tipos de urgencias con protocolos paso a paso
- **`urgent_incidents`** - Registro de incidentes urgentes gestionados

#### Documentos y Biblioteca (4 tablas)
- **`pdf_templates`** - Plantillas de documentos LOPIVI
- **`generated_pdfs`** - PDFs generados por entidad
- **`library_assets`** - Biblioteca de documentos de la entidad
- **`library_shares`** - Comparticiones de documentos

#### Implementación LOPIVI (2 tablas)
- **`implementation_items`** - 13 items del checklist LOPIVI
- **`implementation_status`** - Estado de implementación por entidad

#### Auditoría e Informes (3 tablas)
- **`inspector_reports`** - Informes de inspección generados
- **`action_logs`** - Log de auditoría de acciones del delegado
- **`message_receipts`** - Confirmaciones de lectura de mensajes

### Datos Seed Automáticos

#### 8 Tipos de Incidentes con Protocolos Guiados:
1. **Revelación Directa de Abuso** (Prioridad: Alta)
2. **Sospecha de Maltrato/Abuso** (Prioridad: Alta)
3. **Agresión Física Entre Menores** (Prioridad: Alta)
4. **Ciberacoso o Acoso Digital** (Prioridad: Media)
5. **Accidente o Lesión Grave** (Prioridad: Alta)
6. **Accidente o Lesión Leve** (Prioridad: Baja)
7. **Comportamiento Inadecuado de Adulto** (Prioridad: Alta)
8. **Menor Ausente o Fugado** (Prioridad: Alta)

#### 13 Items de Implementación LOPIVI:
**Obligatorios (9):**
1. Formación del Delegado
2. Plan de Protección Infantil
3. Código de Conducta
4. Protocolo de Actuación ante Violencia
5. Canal de Denuncias LOPIVI
6. Registro de Menores
7. Formación del Personal
8. Certificados de Delitos Sexuales
9. Comunicación a Familias

**Recomendados (4):**
10. Autorizaciones y Consentimientos
11. Supervisión de Instalaciones (sector deportivo)
12. Evaluación de Riesgos
13. Plan de Mejora Continua

### Datos de Prueba (Opcionales)

Si ejecutas `seed_datos_prueba_panel.sql`:
- **7 contactos de emergencia** (112, 091, 062, ANAR, etc.)
- **Estado inicial de implementación** (3 completados, 2 en progreso, 8 pendientes)
- **4 plantillas PDF** listas para generar
- **4 logs de actividad** de ejemplo

---

## 🎯 Roadmap Post-Migración

### Inmediato (Hoy)
- [ ] Explorar todas las páginas del panel
- [ ] Probar crear una urgencia de prueba
- [ ] Revisar el checklist de implementación
- [ ] Personalizar contactos de emergencia

### Esta Semana
- [ ] Agregar personal de contacto real
- [ ] Completar items del checklist
- [ ] Generar primer documento PDF
- [ ] Probar envío de comunicaciones

### Este Mes
- [ ] Configurar formaciones reales
- [ ] Recopilar certificados penales
- [ ] Crear biblioteca de documentos
- [ ] Generar primer informe de inspección

---

## ✅ Checklist de Migración Completa

### Pre-Migración
- [ ] Leí la guía `.same/GUIA-VISUAL-MIGRACION.md`
- [ ] Tengo acceso al SQL Editor de Supabase
- [ ] Ejecuté `pre_migration_check.sql` con éxito

### Migración
- [ ] Ejecuté `20250112_delegado_panel_unified.sql` sin errores
- [ ] Vi "Success. No rows returned"
- [ ] Ejecuté `quick_check.sql` y confirmé:
  - [ ] 12 tablas creadas
  - [ ] 8 incident_types insertados
  - [ ] 13 implementation_items insertados

### Post-Migración
- [ ] Copié mi `entity_id` real
- [ ] Copié mi `user_id` real
- [ ] Edité `seed_datos_prueba_panel.sql` con mis IDs
- [ ] Ejecuté el script de seed con éxito
- [ ] Vi mensaje "DATOS DE PRUEBA CREADOS"

### Verificación del Panel
- [ ] Accedí al panel en `/acceso`
- [ ] KPI de Implementación muestra 23%
- [ ] Modal de URGENCIA se abre correctamente
- [ ] Veo 7 contactos de emergencia
- [ ] Veo 8 tipos de urgencias
- [ ] Checklist muestra 13 items (3 completados, 2 en progreso)
- [ ] Veo 4 plantillas de documentos

---

## 💡 Consejos y Buenas Prácticas

### Seguridad
- 🔒 Nunca compartas las credenciales de Supabase Service Role Key
- 🔒 Verifica que los RLS (Row Level Security) estén configurados
- 🔒 Revisa los logs de auditoría periódicamente

### Rendimiento
- ⚡ Los KPIs se calculan en tiempo real (puede tardar 1-2 segundos)
- ⚡ Las consultas están optimizadas con índices
- ⚡ El panel carga datos en paralelo

### Personalización
- 🎯 Actualiza los contactos de emergencia con teléfonos reales de tu zona
- 🎯 Personaliza los items de implementación según tu sector
- 🎯 Añade más plantillas PDF si las necesitas

### Monitoreo
- 📊 Revisa los KPIs semanalmente
- 📊 Mantén el checklist de implementación actualizado
- 📊 Registra todas las urgencias en el sistema

---

## 📞 Soporte y Ayuda

### Si algo falla:

1. **Revisa los logs de Supabase**
   - SQL Editor → Historial de consultas
   - Busca mensajes de error específicos

2. **Verifica las tablas existentes**
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

3. **Consulta la documentación**
   - `.same/GUIA-VISUAL-MIGRACION.md` - Guía visual
   - `.same/INSTRUCCIONES-MIGRACION.md` - Guía detallada
   - `.same/todos.md` - Estado del proyecto

4. **Revisa la consola del navegador**
   - Abre DevTools (F12)
   - Tab "Console"
   - Busca errores en rojo

---

## 🎉 ¡Felicitaciones!

Una vez completada la migración, tu Panel Delegado Unificado estará **100% funcional** con:

✅ Dashboard con KPIs en tiempo real
✅ Sistema de urgencias con protocolos guiados
✅ Checklist de implementación LOPIVI (13 items)
✅ Generación automática de documentos
✅ Sistema de comunicaciones masivas
✅ Biblioteca de documentos
✅ Informes de inspección
✅ Gestión de miembros del equipo
✅ Controles de formación y certificados penales
✅ Auditoría completa de acciones

**Ahora puedes gestionar la protección de menores de forma profesional y conforme a la LOPIVI.**

---

## 📄 Documentación Completa

- **Guía Visual:** `.same/GUIA-VISUAL-MIGRACION.md`
- **Instrucciones:** `.same/ejecutar-migracion.md`
- **Guía Detallada:** `.same/INSTRUCCIONES-MIGRACION.md`
- **Estado del Proyecto:** `.same/todos.md`
- **Este README:** `.same/README-MIGRACION.md`

---

**Proyecto:** Custodia360 - Panel Delegado Unificado
**Versión:** 1.0
**Fecha:** Enero 2025
**Estado:** Listo para Migración

🛡️ **Protegiendo a los menores con tecnología y cumplimiento LOPIVI** 🛡️
