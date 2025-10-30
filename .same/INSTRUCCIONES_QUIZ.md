# 🎯 INSTRUCCIONES: ACTIVAR SISTEMA DE TEST LOPIVI

## ⚠️ IMPORTANTE: Ejecutar ANTES de lanzar al mercado

El sistema de test está completamente programado pero necesita ejecutar la migración SQL en Supabase.

---

## 📋 PASO 1: Ejecutar Migración en Supabase

### Opción A: Desde la interfaz de Supabase (RECOMENDADO)

1. Ve a tu proyecto en https://supabase.com
2. Click en **SQL Editor** (menú lateral izquierdo)
3. Click en **New query**
4. Copia TODO el contenido del archivo:
   ```
   custodia-360/supabase/migrations/20251015_quiz_system_complete.sql
   ```
5. Pega el contenido en el editor SQL
6. Click en **Run** (o presiona Ctrl+Enter)
7. Espera a que termine (puede tardar 10-15 segundos)
8. Deberías ver: "Success. No rows returned"

### Opción B: Desde CLI de Supabase

```bash
cd custodia-360
supabase db push
```

---

## ✅ PASO 2: Verificar que las tablas se crearon

En **SQL Editor** de Supabase, ejecuta:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'quiz_questions',
    'quiz_answers',
    'quiz_attempts',
    'quiz_attempt_items',
    'training_status'
  );
```

Deberías ver las 5 tablas listadas.

---

## ✅ PASO 3: Verificar que las preguntas se insertaron

```sql
-- Ver total de preguntas
SELECT
  is_general,
  sector_code,
  COUNT(*) as total
FROM quiz_questions
GROUP BY is_general, sector_code
ORDER BY is_general DESC, sector_code;
```

Deberías ver:
- 15 preguntas generales (is_general = true)
- 5 preguntas de ludoteca
- 5 preguntas de club_futbol
- 5 preguntas de academia

---

## 🚀 PASO 4: Probar el Test

1. Ve a http://localhost:8080/acceso
2. Click en "Delegado Principal Nuevo" (botón amarillo)
3. Espera a que cargue la formación
4. Navega a la sección de Test
5. Click en **"Comenzar Test"**
6. Si aparecen las 20 preguntas → ✅ FUNCIONA

---

## 🎓 FLUJO COMPLETO

```
/acceso
  → Delegado Principal Nuevo
    → Formación (6 módulos)
      → Test (20 preguntas)
        → Certificado (si aprueba con 75%+)
          → Configuración (4 pasos)
            → Panel Delegado Completo
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: "Error al crear el test"

**Solución:**
1. Verifica que ejecutaste la migración SQL
2. Verifica las variables de entorno:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=tu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
   ```
3. Reinicia el servidor:
   ```bash
   cd custodia-360
   bun run dev
   ```

### Problema: "No aparecen preguntas"

**Solución:**
1. Ejecuta en SQL Editor de Supabase:
   ```sql
   SELECT COUNT(*) FROM quiz_questions WHERE active = true;
   ```
   Debería devolver al menos 20.

2. Si devuelve 0, re-ejecuta la migración SQL completa.

### Problema: "Pantalla en blanco en el test"

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Si dice "Failed to fetch", verifica que el servidor esté corriendo
4. Si dice "personId undefined", asegúrate de acceder desde /acceso

---

## 📞 SOPORTE

Si después de seguir estos pasos el test no funciona:

1. Verifica los logs del navegador (F12 → Console)
2. Verifica los logs del servidor (terminal donde corre `bun run dev`)
3. Copia el error exacto y contáctame

---

## ✅ CHECKLIST FINAL ANTES DE LANZAR

- [ ] Migración SQL ejecutada en Supabase
- [ ] Tablas creadas (5 tablas)
- [ ] Preguntas insertadas (20+ preguntas)
- [ ] Test probado y funciona
- [ ] Certificado se genera correctamente
- [ ] Configuración (4 pasos) funciona
- [ ] Variables de entorno configuradas
- [ ] Servidor corriendo sin errores

**¡Listo para salir al mercado! 🚀**
