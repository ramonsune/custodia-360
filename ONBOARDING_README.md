# Sistema de Onboarding de Delegados

Sistema completo de incorporación de personal y familias con plazo de 30 días desde la contratación de la entidad.

## 📋 Características Implementadas

### ✅ Portal Público (`/i/[token]`)
- Validación de token/enlace único por entidad
- 3 perfiles de usuario:
  - **Personal de Contacto**: Test LOPIVI (10 preguntas, ≥75% para aprobar), checkbox penales, documentación
  - **Personal sin Contacto**: Confirmación de lectura de documentación de refuerzo
  - **Familias**: Registro multi-hijo con cálculo de menores de 16, confirmación de lectura
- Test sectorizado según el sector de la entidad
- Cálculo automático de estados (OK/Pendiente/Vencido)
- Sin subida de archivos (solo checkboxes)

### ✅ Panel del Delegado
- **Dashboard** (`/panel-delegado/onboarding`):
  - Generación/gestión de enlace único con QR
  - Contador de registros por perfil y estado
  - Banner de alerta para personal con penales no entregados tras 30 días
- **Tabla de Personal** (`/panel-delegado/onboarding/personal`):
  - Listado completo con filtros
  - Columnas: Nombre, Email, Teléfono, Perfil, Penales (Sí/No), Test (score), Deadline, Estado
  - Etiqueta roja "No puede ejercer" para vencidos sin penales
  - Botón para marcar penales como verificados
- **Tabla de Familias** (`/panel-delegado/onboarding/familias`):
  - Listado con info de hijos registrados
  - Columnas: Nombre Tutor, Email/Teléfono, Nº Hijos, Menores <16, Lectura, Deadline, Estado
  - Resumen estadístico de menores
- **Vista de Detalle** (`/panel-delegado/onboarding/detalle/[id]`):
  - Información completa del registro
  - Botón para marcar manualmente como OK

### ✅ Lógica de Negocio
- **Deadline de 30 días** desde `entities.fecha_contratacion`
- **Estados automáticos**:
  - Personal Contacto → OK si `penales_entregado=true` Y `test_passed=true`
  - Personal sin Contacto → OK si `lectura_confirmada=true`
  - Familias → OK si `lectura_confirmada=true` Y `hijos.length > 0`
  - Vencido si pasados 30 días y no OK
- **Alerta especial**: Personal de contacto vencido sin penales no puede ejercer

### ✅ API Endpoints

**Delegado:**
- `POST /api/delegado/onboarding/link` - Generar/actualizar token
- `GET /api/delegado/onboarding/link?entityId=...` - Obtener token existente
- `GET /api/delegado/onboarding/list?entityId=...&perfil=...&status=...` - Listar respuestas
- `POST /api/delegado/onboarding/update-status` - Actualizar estado

**Público:**
- `GET /api/public/onboarding/resolve?token=...` - Validar token
- `GET /api/public/onboarding/quiz?sector=...` - Obtener preguntas del test
- `POST /api/public/onboarding/quiz` - Validar respuestas del test
- `POST /api/public/onboarding/submit` - Guardar respuesta de onboarding

## 🗄️ Base de Datos

### Tablas Creadas

```sql
sectors                  -- Sectores (ludoteca, club_futbol, academia, campamento, etc.)
quiz_questions           -- Banco de preguntas por sector (62+ preguntas)
onboarding_links         -- Tokens/enlaces de onboarding por entidad
onboarding_responses     -- Respuestas del portal
background_checks        -- Estado de penales (sin archivos)
trainings                -- Registro de formaciones
```

### Banco de Preguntas del Test

El sistema incluye un banco completo de preguntas con rotación automática:

| Tipo | Cantidad | Sectores |
|------|----------|----------|
| **Universales** | 14+ | Todas las entidades |
| **Ludoteca** | 12 | Ludotecas y espacios de juego |
| **Club de Fútbol** | 10 | Clubes y entidades deportivas |
| **Academia** | 18 | Academias y actividades extraescolares |
| **Campamentos** | 8 | Campamentos y colonias |

**Total: 62+ preguntas** con sistema de shuffle automático

Ver más detalles en `.same/BANCO_PREGUNTAS.md`

### Aplicar Migración

1. **Acceder a Supabase**:
   - Ve a tu proyecto en [supabase.com](https://supabase.com)
   - Ve a "SQL Editor"

2. **Ejecutar el script**:
   - Abre el archivo `supabase/migrations/20250111_onboarding_system.sql`
   - Copia todo el contenido
   - Pégalo en el SQL Editor de Supabase
   - Haz clic en "Run"

3. **Verificar**:
   ```sql
   -- Verificar que se crearon las tablas
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('sectors', 'quiz_questions', 'onboarding_links', 'onboarding_responses');

   -- Verificar seed de sectores
   SELECT * FROM sectors;

   -- Verificar preguntas del test
   SELECT sector_id, COUNT(*) as num_preguntas
   FROM quiz_questions
   GROUP BY sector_id;
   ```

## 🧪 Cómo Probar el Sistema

### 1. Crear una Entidad de Prueba

En Supabase SQL Editor:

```sql
-- Insertar entidad de prueba
INSERT INTO entities (nombre, sector, fecha_contratacion, email_contacto)
VALUES ('Club Deportivo Test', 'club_futbol', '2025-01-10', 'test@test.com')
RETURNING *;

-- Guardar el ID de la entidad
```

### 2. Generar Enlace de Onboarding

1. Accede al panel del delegado: `/panel-delegado/onboarding`
2. Haz clic en "Generar Enlace"
3. Copia el enlace generado

### 3. Probar los 3 Perfiles

**Personal de Contacto:**
1. Abre el enlace en una ventana de incógnito
2. Selecciona "Personal de Contacto"
3. Rellena datos: nombre, email, teléfono
4. Marca o no "He entregado el certificado de penales"
5. Completa el test de 10 preguntas (necesitas ≥8 correctas)
6. Marca la documentación como leída
7. Envía

**Personal sin Contacto:**
1. Abre el enlace nuevamente
2. Selecciona "Personal sin Contacto"
3. Rellena nombre (email y teléfono opcionales)
4. Marca "He leído la documentación"
5. Envía

**Familias:**
1. Abre el enlace nuevamente
2. Selecciona "Familias / Tutores"
3. Rellena nombre, email
4. Añade uno o más hijos (nombre + fecha nacimiento)
5. Marca "He leído la documentación"
6. Envía

### 4. Verificar en el Panel del Delegado

1. Ve a `/panel-delegado/onboarding`
2. Verifica los contadores
3. Ve a "Personal" y "Familias"
4. Revisa los estados
5. Haz clic en "Ver detalle" de algún registro

### 5. Probar Alertas

Para probar la alerta de penales no entregados:

```sql
-- Actualizar una respuesta para simular vencimiento
UPDATE onboarding_responses
SET status = 'vencido',
    deadline_at = '2025-01-01'
WHERE perfil = 'personal_contacto'
  AND penales_entregado = false
LIMIT 1;
```

Refresca el dashboard y deberías ver el banner rojo de alerta.

## 🎨 Estilo y UX

- ✅ Sin semáforos (usa etiquetas de estado textuales)
- ✅ Tablas limpias con columnas claras
- ✅ Banners de alerta visibles
- ✅ Mismo branding del proyecto
- ✅ Responsive
- ✅ Sin vídeos

## 📝 Notas Importantes

### Sin Archivos
- NO se suben archivos de penales
- Solo se marca un checkbox "he entregado"
- El delegado verifica fuera de la plataforma

### Sin Emails (por ahora)
- No se envían notificaciones automáticas
- Se implementarán en el futuro

### Test Sectorizado
- El test muestra 6 preguntas universales + 4 preguntas del sector de la entidad
- Las preguntas universales rotan entre un banco de 14+ preguntas
- Cada sector tiene 8-12 preguntas específicas
- Aprobar requiere ≥ 8/10 (75%)
- Las preguntas y opciones se barajan automáticamente en cada intento

### Plazo de 30 Días
- Se calcula desde `entities.fecha_contratacion`
- Si no existe esa fecha, se usa la fecha de creación del link
- El plazo es informativo; el portal sigue funcionando después

## 🔗 Rutas del Sistema

**Públicas:**
- `/i/[token]` - Portal de onboarding

**Panel del Delegado:**
- `/panel-delegado/onboarding` - Dashboard principal con estadísticas y descarga de informe PDF
- `/panel-delegado/onboarding/personal` - Tabla de personal
- `/panel-delegado/onboarding/familias` - Tabla de familias
- `/panel-delegado/onboarding/detalle/[id]` - Detalle de respuesta

**API del Delegado:**
- `GET /api/delegado/onboarding/report?entityId=...` - Generar y descargar informe PDF

## ⚙️ Variables de Entorno

Asegúrate de tener configuradas:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000  # o tu dominio en producción
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 🐛 Troubleshooting

### El enlace dice "inválido"
- Verifica que el token existe en la tabla `onboarding_links`
- Verifica que `enabled=true`

### El test no carga preguntas
- Verifica que existen preguntas en `quiz_questions` para el sector de la entidad
- Revisa la consola del navegador para errores

### Los estados no se calculan correctamente
- Revisa la lógica en `/api/public/onboarding/submit`
- Verifica los datos enviados desde el formulario

### No aparecen los datos en el panel
- Verifica que el `entityId` del usuario coincide con el de las respuestas
- Revisa los filtros aplicados

## 📊 Próximos Pasos

- [ ] Agregar enlace al panel de onboarding en la navegación principal del delegado
- [ ] Implementar notificaciones por email
- [ ] Añadir exportación a Excel de las tablas
- [ ] Dashboard con gráficas de progreso
- [ ] Recordatorios automáticos antes del vencimiento

---

**Desarrollado para Custodia360**
