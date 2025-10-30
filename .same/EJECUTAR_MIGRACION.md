# 🚀 INSTRUCCIONES: Ejecutar Migración del Sistema de Formación

**Archivo de migración:** `supabase/migrations/20241015_formacion_completa.sql`

**Fecha:** 14 Octubre 2025

---

## ✅ Opción 1: Desde la Consola Web de Supabase (RECOMENDADO)

Esta es la forma más sencilla y segura de ejecutar la migración.

### Pasos:

1. **Abrir Supabase Dashboard**
   - Ve a: https://supabase.com/dashboard
   - Inicia sesión con tu cuenta

2. **Seleccionar el Proyecto**
   - Click en el proyecto **Custodia360**

3. **Ir al SQL Editor**
   - En el menú lateral izquierdo, click en "SQL Editor"
   - O ve directamente a: https://supabase.com/dashboard/project/[TU_PROJECT_ID]/sql

4. **Copiar el contenido de la migración**
   - Abre el archivo: `custodia-360/supabase/migrations/20241015_formacion_completa.sql`
   - Selecciona TODO el contenido (Ctrl+A / Cmd+A)
   - Copia (Ctrl+C / Cmd+C)

5. **Pegar y ejecutar**
   - En el SQL Editor de Supabase, click en "New query"
   - Pega el contenido completo de la migración (Ctrl+V / Cmd+V)
   - Click en el botón "Run" (esquina inferior derecha)

6. **Verificar resultado**
   - Deberías ver mensajes de éxito para cada sentencia
   - Si hay errores, revisa el mensaje de error y contacta con soporte

---

## ✅ Opción 2: Usando Supabase CLI

Si tienes instalado Supabase CLI en tu máquina local:

### Requisitos:
```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase
# o con brew en macOS
brew install supabase/tap/supabase
```

### Pasos:

1. **Navegar al proyecto**
   ```bash
   cd custodia-360
   ```

2. **Inicializar Supabase (si no está inicializado)**
   ```bash
   supabase init
   ```

3. **Linkear con tu proyecto**
   ```bash
   supabase link --project-ref [TU_PROJECT_REF]
   ```

   *(Encontrarás el project-ref en la URL de tu dashboard: https://supabase.com/dashboard/project/[PROJECT_REF])*

4. **Aplicar las migraciones**
   ```bash
   supabase db push
   ```

5. **Verificar**
   ```bash
   supabase db diff
   ```

---

## ✅ Opción 3: Conexión Directa con PostgreSQL

Si prefieres conectarte directamente a la base de datos:

### Pasos:

1. **Obtener credenciales de conexión**
   - Ve a Supabase Dashboard → Settings → Database
   - Copia la "Connection String" (Direct Connection)

2. **Conectar con psql**
   ```bash
   psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
   ```

3. **Ejecutar el archivo**
   ```bash
   \i custodia-360/supabase/migrations/20241015_formacion_completa.sql
   ```

4. **Verificar tablas creadas**
   ```sql
   \dt
   ```

---

## 🔍 VERIFICACIÓN DESPUÉS DE LA MIGRACIÓN

### 1. Verificar que se crearon las tablas:

Ejecuta en el SQL Editor de Supabase:

```sql
-- Listar todas las tablas del sistema de formación
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'certificates',
  'training_status',
  'quiz_questions',
  'quiz_answers',
  'quiz_attempts',
  'quiz_attempt_items'
);
```

**Resultado esperado:** 6 filas (una por cada tabla)

---

### 2. Verificar campos añadidos a `entities`:

```sql
-- Ver estructura de la tabla entities
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'entities'
AND column_name IN (
  'settings',
  'delegado_penales_entregado',
  'delegado_penales_fecha',
  'sector_code'
);
```

**Resultado esperado:** 4 filas

---

### 3. Verificar datos iniciales (Preguntas):

```sql
-- Contar preguntas generales
SELECT COUNT(*) as total_generales
FROM quiz_questions
WHERE is_general = true;

-- Contar preguntas por sector
SELECT sector_code, COUNT(*) as total
FROM quiz_questions
WHERE is_general = false
GROUP BY sector_code;

-- Total de preguntas
SELECT COUNT(*) as total_preguntas FROM quiz_questions;
```

**Resultado esperado:**
- Generales: ~30
- Por sector (ludoteca, club_futbol, academia): ~5 cada uno
- Total: ~40-45 preguntas

---

### 4. Verificar respuestas:

```sql
-- Contar respuestas por pregunta
SELECT
  q.text as pregunta,
  COUNT(a.id) as num_respuestas
FROM quiz_questions q
LEFT JOIN quiz_answers a ON a.question_id = q.id
GROUP BY q.id, q.text
HAVING COUNT(a.id) != 4
LIMIT 10;
```

**Resultado esperado:** 0 filas (todas las preguntas deben tener exactamente 4 respuestas)

Si hay preguntas con diferente número de respuestas, reportar el problema.

---

### 5. Verificar plantillas de email:

```sql
-- Verificar plantillas creadas
SELECT slug, nombre, asunto
FROM message_templates
WHERE slug IN ('training-start', 'training-certified');
```

**Resultado esperado:** 2 filas

---

### 6. Verificar índices:

```sql
-- Listar índices de las tablas de formación
SELECT
  tablename,
  indexname
FROM pg_indexes
WHERE tablename IN (
  'certificates',
  'training_status',
  'quiz_questions',
  'quiz_answers',
  'quiz_attempts',
  'quiz_attempt_items'
)
ORDER BY tablename;
```

**Resultado esperado:** ~15 índices creados

---

### 7. Verificar RLS (Row Level Security):

```sql
-- Verificar que RLS está habilitado
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'certificates',
  'training_status',
  'quiz_questions',
  'quiz_answers',
  'quiz_attempts',
  'quiz_attempt_items'
);
```

**Resultado esperado:** Todas las tablas con `rowsecurity = true`

---

## ⚠️ TROUBLESHOOTING

### Error: "relation already exists"

Si algunas tablas ya existen, la migración usará `CREATE TABLE IF NOT EXISTS`, por lo que no debería dar error. Si lo hace:

1. Verifica si las tablas ya tienen datos importantes
2. Si NO tienen datos, elimina las tablas y vuelve a ejecutar:
   ```sql
   DROP TABLE IF EXISTS quiz_attempt_items CASCADE;
   DROP TABLE IF EXISTS quiz_attempts CASCADE;
   DROP TABLE IF EXISTS quiz_answers CASCADE;
   DROP TABLE IF EXISTS quiz_questions CASCADE;
   DROP TABLE IF EXISTS training_status CASCADE;
   DROP TABLE IF EXISTS certificates CASCADE;
   ```
3. Re-ejecuta la migración completa

### Error: "column already exists"

Para los campos de `entities`, la migración usa `ADD COLUMN IF NOT EXISTS`, así que no debería dar error. Si lo hace, verifica manualmente qué campos ya existen.

### Error de permisos

Si obtienes errores de permisos, asegúrate de:
1. Estar usando las credenciales correctas (service_role o postgres user)
2. Tener permisos de escritura en la base de datos

---

## ✅ CONFIRMACIÓN FINAL

Una vez ejecutada la migración exitosamente, marca estos items:

- [ ] Tablas creadas: certificates, training_status, quiz_questions, quiz_answers, quiz_attempts, quiz_attempt_items
- [ ] Campos añadidos a entities: settings, delegado_penales_entregado, delegado_penales_fecha, sector_code
- [ ] Preguntas insertadas: ~40-45 preguntas (30 generales + sectores)
- [ ] Respuestas insertadas: ~160-180 respuestas (4 por pregunta)
- [ ] Plantillas email creadas: training-start, training-certified
- [ ] Índices creados
- [ ] RLS habilitado en todas las tablas
- [ ] Políticas de RLS aplicadas

---

## 🎯 SIGUIENTE PASO

Una vez confirmado que la migración se ejecutó correctamente:

1. **Probar el flujo completo:**
   - Ir a https://www.custodia360.es/acceso
   - Login como delegado_principal
   - Completar los 6 módulos de formación
   - Realizar el test (20 preguntas)
   - Generar certificado
   - Completar configuración (4 pasos)
   - Acceder al panel del delegado

2. **Reportar problemas:**
   - Si encuentras algún error, anota:
     - URL donde ocurrió
     - Mensaje de error exacto
     - Pasos para reproducirlo
   - Contactar con Same AI o soporte

---

**Elaborado por:** Same AI
**Modo:** Consolidación Activa 🔒
**Fecha:** 14 Octubre 2025
