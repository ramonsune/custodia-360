
# 📋 INFORME DE AUDITORÍA - PERSISTENCIA SUPABASE
**Fecha**: 2025-10-18T16:36:20.089Z
**Proyecto**: Custodia360
**Modo**: Consolidación (sin modificar código existente)

---

## 📝 RESUMEN EJECUTIVO


### 1. A) Formulario Contacto
- **Estado**: ❌
- **Detalles**: Endpoint /api/contact/submit no responde


**⚠️ Incidencias**:
  - [Alta] API de contacto no disponible
    → Fix: Verificar que existe /api/contact/submit

---

### 2. B) Wizard Delegado - Crear Entidad
- **Estado**: ❌
- **Detalles**: Error creando entidad: Could not find the 'contractor_email' column of 'entities' in the schema cache


**⚠️ Incidencias**:
  - [Alta] No se puede crear entidad de prueba
    → Fix: Verificar tabla entities y permisos

---

### 3. C) Onboarding - Entidad
- **Estado**: ❌
- **Detalles**: No se encontró entidad de prueba


**⚠️ Incidencias**:
  - [Alta] Falta entidad de prueba
    → Fix: Ejecutar primero auditoría de wizard

---

### 4. D) Emails
- **Estado**: ❌
- **Detalles**: No se encontró entidad de prueba


**⚠️ Incidencias**:
  - [Media] Falta entidad para probar emails
    → Fix: Ejecutar auditoría completa

---

### 5. E) Seguridad Contraseñas
- **Estado**: ✅
- **Detalles**: No se encontraron columnas de contraseñas en tablas de dominio
- **Filas creadas**: {}


---

### 6. E) Supabase Auth
- **Estado**: ⚠️
- **Detalles**: Usuario delegado no encontrado en Auth (puede ser normal si no se creó)
- **Filas creadas**: {}


---

### 7. F) Relaciones FK
- **Estado**: ❌
- **Detalles**: ❌ family_children → entity_people | ❌ entity_people → entities | ❌ entity_compliance → entities


**⚠️ Incidencias**:
  - [Alta] Algunas relaciones FK no funcionan correctamente
    → Fix: Verificar foreign keys en Supabase

---

### 8. F) RLS
- **Estado**: ⚠️
- **Detalles**: RLS no verificado automáticamente (requiere acceso a pg_policies)


**⚠️ Incidencias**:
  - [Baja] Verificación manual de RLS recomendada
    → Fix: Revisar políticas RLS en Supabase Dashboard


---

## 🗺️ MAPA FORM → TABLA

| Formulario/Flujo | Tabla Destino | Columnas Clave | Estado |
|------------------|---------------|----------------|---------|
| Contacto | message_jobs | template_slug, to_email, context | ❌ |
| Wizard Paso 1 | entities, entity_compliance | canal_tipo, canal_valor, channel_done | ❌ |
| Wizard Paso 2 | entity_invite_tokens | entity_id, token, active | ❌ |
| Wizard Paso 3 | entity_compliance | riskmap_done | ❌ |
| Wizard Paso 4 | entity_compliance | penales_done | ❌ |
| Personal Contacto | entity_people, miniquiz_attempts | tipo, penales_entregado, passed | ❌ |
| Personal Sin Contacto | entity_people | tipo, estado | ❌ |
| Familias | entity_people, family_children | tipo=familia, family_id | ❌ |
| Directiva | entity_people | tipo=directiva, penales_entregado | ❌ |
| Emails | message_jobs | template_slug, status=queued | ❌ |

---

## 🔐 SEGURIDAD DE CREDENCIALES

### Contraseñas en Tablas de Dominio
✅ **CORRECTO**: No se encontraron columnas de contraseñas en tablas de dominio

### Autenticación Supabase Auth
⚠️ Usuarios gestionados por Supabase Auth con hashing seguro (Bcrypt/Argon)

**Verificación**:
- ✅ Contraseñas hasheadas en `auth.users`
- ✅ Nuestras tablas solo almacenan `user_id` / `email`
- ✅ No se exponen contraseñas en texto plano

---

## 🔒 RLS Y RELACIONES

### Foreign Keys Verificadas
❌ family_children → entity_people | ❌ entity_people → entities | ❌ entity_compliance → entities

### RLS (Row Level Security)
RLS no verificado automáticamente (requiere acceso a pg_policies)

**Recomendación**: Verificar manualmente políticas RLS en Supabase Dashboard para:
- `entities`: Solo el contractor y delegados pueden ver/editar
- `entity_people`: Solo personas de la misma entidad
- `family_children`: Solo el padre/tutor puede ver sus hijos
- `message_jobs`: Solo admin puede ver todos los jobs

---

## ✅ LISTO PARA LANZAMIENTO

❌ **NO** - Hay incidencias que resolver

---

## 🚨 INCIDENCIAS DETECTADAS

- **[Alta]** API de contacto no disponible
  → **Fix**: Verificar que existe /api/contact/submit

- **[Alta]** No se puede crear entidad de prueba
  → **Fix**: Verificar tabla entities y permisos

- **[Alta]** Falta entidad de prueba
  → **Fix**: Ejecutar primero auditoría de wizard

- **[Media]** Falta entidad para probar emails
  → **Fix**: Ejecutar auditoría completa

- **[Alta]** Algunas relaciones FK no funcionan correctamente
  → **Fix**: Verificar foreign keys en Supabase

- **[Baja]** Verificación manual de RLS recomendada
  → **Fix**: Revisar políticas RLS en Supabase Dashboard

---

## 📊 ESTADÍSTICAS DE DATOS CREADOS

- **entities**: 0 registros
- **entity_people**: 0 registros
- **family_children**: 0 registros
- **miniquiz_attempts**: 0 registros
- **message_jobs**: 0 registros
- **training_status**: 0 registros
- **certificates**: 0 registros
- **entity_compliance**: 0 registros
- **entity_invite_tokens**: 0 registros

---

*Fin del informe de auditoría*
  