# Banco de Preguntas - Sistema de Onboarding

## 📋 Estructura del Test

El test de onboarding para personal de contacto se compone de:

- **6 preguntas universales** (aplicables a todos los sectores)
- **4 preguntas específicas** del sector de la entidad

**Total: 10 preguntas | Aprobado: ≥8 correctas (75%)**

## 🔄 Sistema de Rotación y Shuffle

### Rotación de Preguntas

1. **Universales**: Se seleccionan 6 al azar de un pool de 14+ preguntas
2. **Sectoriales**: Se seleccionan 4 al azar del pool del sector (8-18 preguntas según sector)
3. Las preguntas seleccionadas se barajan en orden aleatorio

### Shuffle de Opciones

Para cada pregunta:
- Las 4 opciones (A, B, C, D) se barajan aleatoriamente
- Se guarda el mapa de shuffle para validación backend
- Ejemplo: Si la correcta original es B, y tras barajar B quedó en posición C, el sistema sabe que C es correcta

### Prevención de Duplicados

- Índice único en base de datos: `(sector_id, pregunta)`
- No puede haber dos preguntas con el mismo texto en el mismo sector
- Las universales tienen `sector_id = NULL`

## 📊 Estado Actual del Banco

### Preguntas Universales (sector_id = NULL)

✅ **14 preguntas** disponibles

Temas cubiertos:
- Tolerancia cero y actitudes ante sospechas
- Interés superior del menor
- Protección de datos y privacidad
- Conductas de riesgo y protocolos
- Rol del delegado de protección
- Comunicación con familias
- Ciberacoso y tecnologías

### Preguntas por Sector

| Sector | Preguntas | Estado |
|--------|-----------|--------|
| Ludoteca | 12 | ✅ Completo |
| Club de Fútbol | 10 | ✅ Completo |
| Academia / Extraescolares | 18 | ✅ Completo |
| Campamentos / Colonias | 8 | ✅ Completo |
| Centro Educativo | 0 | ⏳ Pendiente |
| ONG/Asociación | 0 | ⏳ Pendiente |

## ➕ Cómo Añadir Nuevas Preguntas

### 1. Preguntas Universales

```sql
insert into quiz_questions (
  sector_id,
  pregunta,
  opcion_a,
  opcion_b,
  opcion_c,
  opcion_d,
  correcta,
  es_universal
) values (
  NULL,
  '¿Pregunta universal aquí?',
  'Opción incorrecta 1',
  'Opción correcta',
  'Opción incorrecta 2',
  'Opción incorrecta 3',
  'B',  -- Letra de la opción correcta
  true  -- Marca como universal
);
```

### 2. Preguntas Sectoriales

```sql
insert into quiz_questions (
  sector_id,
  pregunta,
  opcion_a,
  opcion_b,
  opcion_c,
  opcion_d,
  correcta
) values (
  'club_futbol',  -- ID del sector
  '¿Pregunta específica del sector?',
  'Opción incorrecta 1',
  'Opción correcta',
  'Opción incorrecta 2',
  'Opción incorrecta 3',
  'B'  -- Letra de la opción correcta
);
```

### 3. Crear Nuevo Sector

```sql
-- 1. Crear el sector
insert into sectors (id, nombre) values
  ('nuevo_sector', 'Nombre del Sector')
on conflict (id) do nothing;

-- 2. Añadir al menos 8 preguntas específicas
insert into quiz_questions (sector_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta) values
  ('nuevo_sector', 'Pregunta 1...', 'A', 'B', 'C', 'D', 'A'),
  ('nuevo_sector', 'Pregunta 2...', 'A', 'B', 'C', 'D', 'B'),
  -- ... mínimo 8 preguntas
```

## 🎯 Buenas Prácticas para Preguntas

### Preguntas Universales
- ✅ Aplicables a cualquier entidad que trabaje con menores
- ✅ Conceptos fundamentales de LOPIVI
- ✅ Protocolos generales de protección
- ✅ Derechos de la infancia

### Preguntas Sectoriales
- ✅ Situaciones específicas del sector (ej: vestuarios en deportes)
- ✅ Protocolos particulares (ej: entrega/recogida en extraescolares)
- ✅ Riesgos específicos del contexto
- ✅ Medidas preventivas del sector

### Formato de Opciones
- ✅ Opción correcta clara y completa
- ✅ Opciones incorrectas plausibles pero evidentemente erróneas
- ✅ Evitar "todas las anteriores" o "ninguna de las anteriores"
- ✅ Longitud similar entre opciones

### Dificultad
- 🎯 75% de aprobado → las preguntas deben ser claras pero no triviales
- 🎯 Requieren haber leído la documentación
- 🎯 No deben ser "adivinables" sin conocimiento
- 🎯 Deben evaluar comprensión, no memorización literal

## 🔍 Verificar el Banco de Preguntas

```sql
-- Ver total de preguntas universales
SELECT COUNT(*) as total_universales
FROM quiz_questions
WHERE es_universal = true OR sector_id IS NULL;

-- Ver preguntas por sector
SELECT
  COALESCE(sector_id, 'UNIVERSAL') as sector,
  COUNT(*) as num_preguntas
FROM quiz_questions
GROUP BY sector_id
ORDER BY sector_id;

-- Ver una pregunta específica
SELECT * FROM quiz_questions WHERE id = 123;

-- Buscar duplicados potenciales
SELECT pregunta, COUNT(*)
FROM quiz_questions
GROUP BY pregunta
HAVING COUNT(*) > 1;
```

## 📝 Ejemplo Completo: Añadir Sector "Escuelas Deportivas"

```sql
-- 1. Crear sector
insert into sectors (id, nombre) values
  ('escuela_deportiva', 'Escuelas Deportivas')
on conflict (id) do nothing;

-- 2. Añadir preguntas específicas
insert into quiz_questions (sector_id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta) values
  ('escuela_deportiva','En entrenamientos con menores, ¿cómo debe ser el contacto físico?','Libre según criterio del entrenador','Solo el necesario, explicado y en presencia de otros','Prohibido siempre','Solo con consentimiento escrito','B'),
  ('escuela_deportiva','¿Qué hacer si un padre presiona excesivamente a su hijo/a durante el entrenamiento?','Ignorarlo, es asunto familiar','Intervenir y si persiste, aplicar protocolo','Expulsar al padre inmediatamente','Hablar con el menor en privado','B'),
  ('escuela_deportiva','Sobre el uso de vestuarios:','Menores y adultos pueden compartir','Supervisión adecuada, separación por edad/sexo, privacidad','Solo si hay cámaras de seguridad','Acceso libre sin control','B'),
  ('escuela_deportiva','¿Es apropiado añadir menores a grupos de WhatsApp del equipo?','Sí, para mejor comunicación','Solo con autorización familiar y canal oficial','Sí, si son mayores de 12 años','No, nunca bajo ninguna circunstancia','B'),
  ('escuela_deportiva','Ante una lesión de un menor durante el entrenamiento:','Aplicar hielo y seguir entrenando','Protocolo de primeros auxilios y avisar a familia','Esperar a que pase el dolor','Que el menor decida si seguir','B'),
  ('escuela_deportiva','¿Puede un entrenador trasladar a un menor solo en su vehículo?','Sí, si hay emergencia','Solo con autorización, otro adulto presente o justificación documentada','Sí, si hay confianza','Nunca está permitido','B'),
  ('escuela_deportiva','Material audiovisual de entrenamientos y competiciones:','Publicar libremente en redes del club','Consentimientos firmados y uso limitado al acordado','Solo si no se ve la cara','Grabar sin restricciones','B'),
  ('escuela_deportiva','¿Cómo actuar ante rivalidad o acoso entre miembros del equipo?','Es normal en deportes competitivos','Detener, protocolo anti-acoso, trabajo en valores','Que lo resuelvan entre ellos','Solo si hay lesiones físicas','B');
```

## 🚀 Siguientes Pasos Recomendados

- [ ] Añadir 10+ preguntas para Centro Educativo
- [ ] Añadir 10+ preguntas para ONG/Asociación
- [ ] Ampliar banco universal a 20+ preguntas
- [ ] Crear preguntas para sectores adicionales según demanda
- [ ] Revisar y actualizar preguntas existentes periódicamente

## 📌 Notas Importantes

- **No modificar preguntas ya usadas**: Puede afectar estadísticas históricas
- **Añadir nuevas en su lugar**: Incrementa la variedad del test
- **Mantener coherencia**: Respuestas correctas siempre en B por convención de este banco
- **Documentar cambios**: Anotar en este archivo cuando se añadan preguntas

---

**Última actualización**: Enero 2025
**Total de preguntas**: 62
**Sectores activos**: 4 (Ludoteca, Club Fútbol, Academia, Campamentos)
