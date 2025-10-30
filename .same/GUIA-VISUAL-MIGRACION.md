# 🎯 GUÍA VISUAL: Migración Panel Delegado en Supabase

## ⏱️ Tiempo total: 10 minutos

---

## 📸 PASO 1: Acceder a Supabase SQL Editor (1 min)

### 🖼️ Vista que deberías ver:

```
┌─────────────────────────────────────────────────────┐
│ Supabase Dashboard                                   │
├─────────────────────────────────────────────────────┤
│ [Sidebar]           [Main Panel]                    │
│ - Projects          Your Project: Custodia360       │
│ - Settings          Status: Active                  │
│ ▶ Database                                          │
│   - Tables                                          │
│   - Functions                                       │
│   ▶ SQL Editor  ← CLICK AQUÍ                       │
│   - Extensions                                      │
└─────────────────────────────────────────────────────┘
```

### ✅ Pasos:
1. Ve a **https://supabase.com/dashboard**
2. Selecciona tu proyecto **Custodia360**
3. En el menú lateral izquierdo, busca **"Database"**
4. Despliega el menú y click en **"SQL Editor"**

---

## 📝 PASO 2: Verificación PRE-Migración (2 min)

### 🎯 Objetivo:
Verificar que las tablas base existen antes de crear las nuevas.

### 📋 Script a ejecutar:

1. En SQL Editor, click **"+ New query"**
2. Copia y pega este script:

```sql
-- VERIFICACIÓN PRE-MIGRACIÓN
-- Este script verifica que las tablas base existen

SELECT '✅ TABLAS BASE EXISTENTES:' as check;

SELECT
  table_name,
  '✅ Existe' as estado
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('entidades', 'delegados', 'trainings', 'background_checks')
ORDER BY table_name;

-- Debe mostrar 4 tablas
SELECT
  CASE
    WHEN COUNT(*) = 4 THEN '✅ Todas las tablas base existen'
    ELSE '❌ Faltan tablas base'
  END as resultado
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('entidades', 'delegados', 'trainings', 'background_checks');
```

3. Click **"Run"** (o Ctrl/Cmd + Enter)

### 🖼️ Resultado esperado:

```
✅ TABLAS BASE EXISTENTES:
┌──────────────────────┬────────────┐
│ table_name           │ estado     │
├──────────────────────┼────────────┤
│ background_checks    │ ✅ Existe  │
│ delegados            │ ✅ Existe  │
│ entidades            │ ✅ Existe  │
│ trainings            │ ✅ Existe  │
└──────────────────────┴────────────┘

resultado
───────────────────────────────────
✅ Todas las tablas base existen
```

### ⚠️ Si ves un error:
- **Error: "relation does not exist"** → Falta alguna tabla base
- **Solución:** Ejecuta primero las migraciones base del proyecto

---

## 🚀 PASO 3: Ejecutar Migración Principal (3 min)

### 🎯 Objetivo:
Crear las 12 nuevas tablas del Panel Delegado.

### 📋 Archivo a usar:
`custodia-360/supabase/migrations/20250112_delegado_panel_unified.sql`

### ✅ Pasos:

1. **Abre el archivo en tu editor:**
   - Ruta: `custodia-360/supabase/migrations/20250112_delegado_panel_unified.sql`

2. **Copia TODO el contenido** (Ctrl/Cmd + A, luego Ctrl/Cmd + C)

3. **En Supabase SQL Editor:**
   - Click **"+ New query"**
   - Pega el contenido (Ctrl/Cmd + V)
   - Click **"Run"** (o Ctrl/Cmd + Enter)

### ⏳ Espera 10-15 segundos...

### 🖼️ Resultado esperado:

```
┌──────────────────────────────────────┐
│ Success. No rows returned            │
│                                      │
│ 12 tables created                    │
│ 8 incident types inserted            │
│ 13 implementation items inserted     │
└──────────────────────────────────────┘
```

### ✅ Señales de éxito:
- ✅ Mensaje "Success" en verde
- ✅ No hay errores en rojo
- ✅ La migración se completó sin interrupciones

### ⚠️ Posibles errores:

#### Error: "already exists"
```
ERROR: relation "implementation_items" already exists
```
**✅ Solución:** ¡No pasa nada! La tabla ya existe. Continúa con el Paso 4.

#### Error: "does not exist"
```
ERROR: relation "entidades" does not exist
```
**❌ Solución:** Falta la tabla base. Ejecuta primero la migración de entidades.

---

## ✅ PASO 4: Verificar Tablas Creadas (2 min)

### 🎯 Objetivo:
Confirmar que las 12 tablas se crearon correctamente.

### 📋 Script a ejecutar:

1. En SQL Editor, click **"+ New query"**
2. Abre el archivo: `custodia-360/supabase/migrations/quick_check.sql`
3. Copia y pega TODO el contenido
4. Click **"Run"**

### 🖼️ Resultado esperado:

```
1️⃣ TABLAS DEL PANEL DELEGADO:
┌────────────────┬───────────┐
│ tablas_creadas │ esperadas │
├────────────────┼───────────┤
│ 12             │ 12        │
└────────────────┴───────────┘

2️⃣ DATOS SEED:
┌─────────────────────┬──────────┐
│ incident_types      │ 8        │
│ implementation_items│ 13       │
└─────────────────────┴──────────┘

4️⃣ TUS ENTIDADES:
┌──────────────────────────────────┬─────────────────┬────────────┐
│ entity_id                        │ nombre          │ sector     │
├──────────────────────────────────┼─────────────────┼────────────┤
│ 550e8400-e29b-41d4-a716-446655440000│ Mi Entidad   │ deportivo  │
└──────────────────────────────────┴─────────────────┴────────────┘
```

### ✅ Verificación:
- ✅ `tablas_creadas: 12`
- ✅ `incident_types: 8`
- ✅ `implementation_items: 13`
- ✅ Se muestran tus entidades (copia el `entity_id` para el siguiente paso)

---

## 📊 PASO 5: Crear Datos de Prueba (3 min)

### 🎯 Objetivo:
Inicializar datos para tu entidad (contactos, checklist, etc.)

### 📋 Preparación:

#### 5.1 Obtener tu Entity ID

Ya lo tienes del Paso 4. Ejemplo:
```
550e8400-e29b-41d4-a716-446655440000
```

#### 5.2 Obtener tu User ID (Delegado)

Ejecuta en SQL Editor:
```sql
SELECT user_id, nombre, apellidos, email
FROM delegados
WHERE rol = 'delegado_principal'
ORDER BY created_at DESC
LIMIT 5;
```

**Resultado esperado:**
```
┌──────────────────────────────────┬────────┬───────────┬──────────────────┐
│ user_id                          │ nombre │ apellidos │ email            │
├──────────────────────────────────┼────────┼───────────┼──────────────────┤
│ 123e4567-e89b-12d3-a456-426614174000│ Juan│ Pérez    │ juan@club.com    │
└──────────────────────────────────┴────────┴───────────┴──────────────────┘
```

📋 **Copia el `user_id`**

### ✅ Pasos:

1. **Abre el archivo:**
   `custodia-360/supabase/migrations/seed_datos_prueba_panel.sql`

2. **Edita las líneas 13 y 14:**

```sql
-- ANTES:
v_entity_id UUID := 'demo_entity_001'; -- ⚠️ CAMBIA ESTE ID
v_user_id UUID := 'delegado_user_001'; -- ⚠️ CAMBIA ESTE ID

-- DESPUÉS (con tus IDs reales):
v_entity_id UUID := '550e8400-e29b-41d4-a716-446655440000'; -- ✅ Tu ID
v_user_id UUID := '123e4567-e89b-12d3-a456-426614174000'; -- ✅ Tu ID
```

3. **Copia TODO el archivo editado**
4. **Pega en SQL Editor**
5. **Click "Run"**

### 🖼️ Resultado esperado:

```
NOTICE: 📞 Creando contactos de emergencia...
NOTICE: ✅ Contactos de emergencia creados
NOTICE: 📋 Inicializando checklist de implementación...
NOTICE: ✅ Estado de implementación inicializado
NOTICE: 📄 Creando plantillas PDF de ejemplo...
NOTICE: ✅ Plantillas PDF creadas
NOTICE: 📊 Creando logs de actividad de ejemplo...
NOTICE: ✅ Logs de actividad creados

====================================
✅ DATOS DE PRUEBA CREADOS
====================================
📞 Contactos: 7 contactos de emergencia
📋 Implementación: 13 items inicializados (3 completados, 2 en progreso)
📄 Plantillas PDF: 4 plantillas disponibles
📊 Logs: 4 acciones registradas
```

---

## 🎉 PASO 6: Verificar el Panel (2 min)

### 🎯 Objetivo:
Confirmar que los KPIs se muestran correctamente en el dashboard.

### ✅ Acceder al Panel:

1. **Opción A: Acceso rápido**
   - Ve a: `https://www.custodia360.es/acceso`
   - Click en **"3️⃣ Panel Delegado Unificado"**

2. **Opción B: Login manual**
   - Ve a: `https://www.custodia360.es/login`
   - Email: `delegado@custodia360.com`
   - Password: `delegado123`
   - Click **"Ingresar"**

### 🖼️ Dashboard esperado:

```
┌─────────────────────────────────────────────────────┐
│ Panel del Delegado                                   │
│ Club Deportivo Demo • Delegado Certificado          │
│                                                      │
│ ┌───────────────┐ ┌───────────────┐ ┌─────────────┐│
│ │ Formación     │ │ Certificados  │ │Implementación││
│ │ Personal      │ │ Penales       │ │   LOPIVI     ││
│ │               │ │               │ │              ││
│ │    0%         │ │    0%         │ │    23%       ││
│ │   0/0         │ │   0/0         │ │   3/13       ││
│ │               │ │               │ │              ││
│ │ Completados:0 │ │ Entregados:0  │ │Completados:3 ││
│ │ Pendientes:0  │ │ Pendientes:0  │ │En progreso:2││
│ │ Vencidos:0    │ │ Vencidos:0    │ │Pendientes:8 ││
│ └───────────────┘ └───────────────┘ └─────────────┘│
│                                                      │
│ Acciones Rápidas                                     │
│ ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐│
│ │ 📧   │ 📄   │ ✓    │ 📋   │ 👥   │ 📚   │ 🔍   │ ⚠️   ││
│ │Comuni│Docum │Contr │Imple │Miembr│Bibli │Inspec│URGEN │││car  │entos │oles  │menta │os    │oteca │ción  │CIA   ││
│ └──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘│
└─────────────────────────────────────────────────────┘
```

### ✅ Verificaciones clave:

#### KPI de Implementación LOPIVI:
- ✅ **Porcentaje: 23%** (3 de 13 items completados)
- ✅ **Completados: 3** (formacion_delegado, plan_proteccion, codigo_conducta)
- ✅ **En progreso: 2** (protocolo_actuacion, canal_denuncias)
- ✅ **Pendientes: 8** (resto de items)
- ✅ **Obligatorios: X/X (XX%)** se muestra

#### KPIs de Formación y Penales:
- ⚠️ **0%** es normal si no tienes personal de contacto aún
- ℹ️ Estos KPIs se actualizan cuando agregues personal

#### Botones de Acciones Rápidas:
- ✅ **8 botones visibles:**
  1. 📧 Comunicar
  2. 📄 Documentos
  3. ✓ Controles
  4. 📋 Implementación
  5. 👥 Miembros
  6. 📚 Biblioteca
  7. 🔍 Inspección
  8. ⚠️ URGENCIA

---

## 🔍 PASO 7: Prueba de Funcionalidades (3 min)

### Test 1: Verificar Checklist de Implementación

1. Click en **"📋 Implementación"**
2. Deberías ver **13 items**
3. Verifica que 3 están marcados como **"Completado"** (verde):
   - ✅ Formación del Delegado
   - ✅ Plan de Protección Infantil
   - ✅ Código de Conducta
4. Verifica que 2 están **"En progreso"** (azul):
   - 🔵 Protocolo de Actuación
   - 🔵 Canal de Denuncias

### Test 2: Verificar Contactos de Emergencia

1. Click en **"⚠️ URGENCIA"**
2. Se abre un modal
3. Click en **"Ver Contactos"**
4. Deberías ver **7 contactos:**
   - 🚨 Emergencias 112
   - 👮 Policía Nacional (091)
   - 👮 Guardia Civil (062)
   - 📞 Teléfono ANAR
   - 👔 Director: Juan Pérez
   - 👤 Delegado Suplente: María López
   - 🏛️ Servicios Sociales Locales

### Test 3: Verificar Tipos de Urgencias

1. En el modal de **"URGENCIA"**
2. Click en **"Nueva Urgencia"**
3. Deberías ver **8 tipos de incidentes:**
   - Revelación Directa de Abuso
   - Sospecha de Maltrato/Abuso
   - Agresión Física Entre Menores
   - Ciberacoso o Acoso Digital
   - Accidente o Lesión Leve
   - Accidente o Lesión Grave
   - Comportamiento Inadecuado de Adulto
   - Menor Ausente o Fugado

### Test 4: Verificar Plantillas de Documentos

1. Click en **"📄 Documentos"**
2. Deberías ver **4 plantillas disponibles:**
   - 📄 Plan de Protección Infantil
   - 📄 Protocolo de Actuación
   - 📄 Código de Conducta
   - 📄 Información para Familias

---

## ✅ CHECKLIST FINAL

### Migración Completa:
- [ ] 12 tablas creadas en Supabase
- [ ] 8 tipos de incidentes insertados
- [ ] 13 items de implementación insertados
- [ ] Datos de prueba creados para tu entidad

### Panel Funcionando:
- [ ] KPI de Implementación muestra 23%
- [ ] 8 botones de acciones rápidas visibles
- [ ] Modal de URGENCIA se abre correctamente
- [ ] 7 contactos de emergencia visibles
- [ ] 8 tipos de urgencias disponibles
- [ ] 4 plantillas de documentos disponibles
- [ ] Checklist de implementación muestra 13 items

### Datos Verificados:
- [ ] Entity ID copiado y usado en seed
- [ ] User ID copiado y usado en seed
- [ ] 3 items marcados como completados
- [ ] 2 items marcados como en progreso

---

## 🚨 TROUBLESHOOTING

### Problema: KPIs muestran todo en 0%

**Causa:** No hay datos de personal o la migración no se ejecutó

**Solución:**
```sql
-- Verificar que los datos se crearon
SELECT COUNT(*) FROM implementation_status;
-- Debe mostrar 13

SELECT COUNT(*) FROM entity_contacts;
-- Debe mostrar 7 (o más si agregaste)
```

### Problema: Error "relation does not exist"

**Causa:** La tabla no existe en Supabase

**Solución:**
1. Verifica que ejecutaste la migración principal (Paso 3)
2. Ejecuta el quick_check.sql para ver qué falta
3. Re-ejecuta la migración si es necesario

### Problema: Los botones no redirigen

**Causa:** Error de JavaScript o rutas incorrectas

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Refresca la página (F5)
4. Limpia el localStorage y vuelve a entrar

### Problema: Modal de URGENCIA no se abre

**Causa:** Componente no cargó o error en el código

**Solución:**
1. Abre consola (F12) y busca errores
2. Verifica que el archivo `src/components/UrgenciaModal.tsx` existe
3. Refresca la página

---

## 📊 RESUMEN DE CAMBIOS

### Base de Datos:

**Tablas Nuevas (12):**
1. ✅ `entity_contacts` - Contactos de emergencia
2. ✅ `incident_types` - Tipos de urgencias
3. ✅ `urgent_incidents` - Incidentes registrados
4. ✅ `pdf_templates` - Plantillas de documentos
5. ✅ `generated_pdfs` - PDFs generados
6. ✅ `library_assets` - Biblioteca de documentos
7. ✅ `library_shares` - Comparticiones
8. ✅ `implementation_items` - Checklist LOPIVI
9. ✅ `implementation_status` - Estado por entidad
10. ✅ `inspector_reports` - Informes de inspección
11. ✅ `action_logs` - Auditoría de acciones
12. ✅ `message_receipts` - Confirmaciones de lectura

**Datos Seed (Auto-creados):**
- ✅ 8 tipos de incidentes urgentes con pasos guiados
- ✅ 13 items de implementación LOPIVI obligatorios

**Datos de Prueba (Opcionales):**
- ✅ 7 contactos de emergencia
- ✅ Estado inicial de implementación (3 completados, 2 en progreso)
- ✅ 4 plantillas PDF listas para generar
- ✅ 4 logs de actividad de ejemplo

---

## 🎯 PRÓXIMOS PASOS

### Inmediatos (Hoy):
1. ✅ Explora todas las páginas del panel
2. ✅ Prueba crear una urgencia de prueba
3. ✅ Revisa el checklist de implementación
4. ✅ Personaliza los contactos de emergencia

### Corto Plazo (Esta Semana):
1. 🔄 Agregar personal de contacto real
2. 🔄 Completar items del checklist
3. 🔄 Generar primer documento PDF
4. 🔄 Probar envío de comunicaciones

### Medio Plazo (Este Mes):
1. 📅 Configurar formaciones reales
2. 📅 Recopilar certificados penales
3. 📅 Crear biblioteca de documentos
4. 📅 Generar primer informe de inspección

---

## 💡 CONSEJOS FINALES

### Optimización de Datos:
- 🎯 Actualiza los contactos de emergencia con teléfonos reales
- 🎯 Personaliza los items de implementación según tu sector
- 🎯 Añade más plantillas PDF si las necesitas

### Seguridad:
- 🔒 Nunca compartas las credenciales de Supabase Service Role Key
- 🔒 Verifica que los RLS (Row Level Security) estén activos
- 🔒 Revisa los logs de auditoría periódicamente

### Rendimiento:
- ⚡ Los KPIs se calculan en tiempo real
- ⚡ Las consultas están optimizadas con índices
- ⚡ El panel carga datos en paralelo

---

## ✨ ¡FELICITACIONES!

Has completado exitosamente la migración del Panel Delegado Unificado de Custodia360.

**Tu sistema ahora incluye:**
- ✅ Dashboard con KPIs en tiempo real
- ✅ Sistema de urgencias con protocolos guiados
- ✅ Checklist de implementación LOPIVI
- ✅ Generación automática de documentos
- ✅ Sistema de comunicaciones
- ✅ Biblioteca de documentos
- ✅ Informes de inspección
- ✅ Gestión de miembros
- ✅ Controles de formación y penales

**Disfruta tu nuevo panel y protege a los menores con Custodia360!** 🛡️👶

---

**Documentación completa:** `.same/INSTRUCCIONES-MIGRACION.md`
**Soporte:** Revisa los logs de Supabase o consulta la documentación del proyecto
