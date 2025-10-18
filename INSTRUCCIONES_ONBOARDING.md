# 🚀 INSTRUCCIONES: Activar Sistema de Onboarding

## ⚠️ IMPORTANTE
El sistema de onboarding está **implementado pero no activado**. Necesitas ejecutar el SQL en Supabase para que funcione.

---

## 📋 PASO 1: Ejecutar SQL en Supabase

### A) Crear tabla de tokens (OBLIGATORIO)

1. Accede a tu proyecto de Supabase: https://supabase.com/dashboard
2. Ve a **SQL Editor** (menú lateral izquierdo)
3. Haz clic en **New Query**
4. Copia y pega **todo el contenido** del archivo:
   ```
   custodia-360/database/onboarding-tokens-simple.sql
   ```
5. Haz clic en **Run** para ejecutar el SQL
6. Verifica que aparezca: ✅ **Success. No rows returned**

### B) Crear tablas del sistema completo (OPCIONAL - para funcionalidad completa)

Si quieres el sistema completo de onboarding (personas, quiz, etc):

1. Ejecuta el archivo:
   ```
   custodia-360/database/onboarding-system-schema.sql
   ```

**NOTA:** El Paso 2 de configuración funcionará solo con la tabla de tokens. El resto es para cuando implementes los formularios de onboarding.

---

## ✅ PASO 2: Verificar que las tablas se crearon

1. Ve a **Table Editor** en Supabase
2. Deberías ver estas **nuevas tablas**:
   - `entity_invite_tokens`
   - `entity_people`
   - `family_children`
   - `quiz_questions`
   - `quiz_answers`
   - `miniquiz_attempts`
   - `quiz_settings_short`
   - `onboarding_notifications`

3. En `quiz_questions` deberías ver **5 preguntas de ejemplo** ya cargadas

---

## 🔧 PASO 3: Verificar Variables de Entorno

Asegúrate de que tu archivo `.env.local` tenga:

```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_APP_BASE_URL=https://www.custodia360.es
```

---

## 🎯 PASO 4: Probar el Sistema

1. **Reinicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

2. **Accede a configuración**:
   ```
   http://localhost:3000/dashboard-delegado/configuracion
   ```

3. **En Paso 2** deberías ver:
   - ✅ El enlace de invitación completo
   - ✅ Botones: "Copiar enlace", "WhatsApp", "Email"
   - ❌ Si ves "Error cargando enlace" → las tablas no existen en Supabase

4. **Prueba el enlace**:
   - Copia el enlace generado
   - Ábrelo en otra ventana
   - Deberías ver la landing page con 4 roles

---

## 📊 ESTADO ACTUAL

### ✅ YA IMPLEMENTADO:
- [x] Base de datos (SQL completo)
- [x] 4 APIs REST funcionando
- [x] Paso 2 de configuración actualizado
- [x] Landing page de onboarding
- [x] 4 formularios de roles completos
- [x] Sistema de quiz (10 preguntas)
- [x] Validación de plazos (30 días)

### ⏳ PENDIENTE (Opcional):
- [ ] Edge Function para alertas diarias
- [ ] Template de email en Resend
- [ ] Panel de estadísticas para el delegado

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Error cargando el enlace"
**Causa:** Las tablas no existen en Supabase
**Solución:** Ejecutar el SQL del Paso 1

### Error: "Configuración de base de datos no disponible"
**Causa:** Variables de entorno mal configuradas
**Solución:** Verificar `.env.local` tiene las variables correctas

### Error: "Token inválido o expirado"
**Causa:** La tabla `entity_invite_tokens` está vacía
**Solución:** El token se crea automáticamente al acceder al Paso 2 de configuración

### Error: "No hay preguntas disponibles"
**Causa:** La tabla `quiz_questions` está vacía
**Solución:** El SQL del Paso 1 ya incluye 5 preguntas de ejemplo. Verifica que se ejecutó correctamente.

---

## 📝 NOTAS ADICIONALES

### Añadir más preguntas al banco
Ejecuta este SQL en Supabase:

```sql
-- Insertar nueva pregunta
INSERT INTO quiz_questions (text, is_general, active)
VALUES ('Tu pregunta aquí', true, true)
RETURNING id;

-- Usando el ID de la pregunta, añadir 4 respuestas
INSERT INTO quiz_answers (question_id, text, is_correct)
VALUES
  ('ID_PREGUNTA', 'Respuesta correcta', true),
  ('ID_PREGUNTA', 'Respuesta incorrecta 1', false),
  ('ID_PREGUNTA', 'Respuesta incorrecta 2', false),
  ('ID_PREGUNTA', 'Respuesta incorrecta 3', false);
```

### Cambiar porcentaje de aprobación del test
```sql
UPDATE quiz_settings_short
SET pass_threshold = 0.80  -- 80% en vez de 75%
WHERE id = true;
```

### Ver personas registradas
```sql
SELECT
  ep.nombre,
  ep.apellidos,
  ep.tipo,
  ep.estado,
  ep.penales_entregado,
  ep.created_at,
  e.nombre as entidad
FROM entity_people ep
JOIN entities e ON e.id = ep.entity_id
ORDER BY ep.created_at DESC;
```

### Ver estadísticas de una entidad
```sql
SELECT get_onboarding_stats('tu-entity-id-aqui');
```

---

## 🎯 URL DEL PORTAL DE ONBOARDING

El enlace que se genera tiene este formato:
```
https://www.custodia360.es/onboarding/{entity_id}/{token}
```

Cada entidad tiene su propio token único que nunca expira (a menos que lo desactives manualmente).

---

## 📧 SOPORTE

Si tienes problemas, contacta con el equipo técnico de Custodia360.
