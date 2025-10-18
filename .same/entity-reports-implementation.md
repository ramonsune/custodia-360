# Sistema de Persistencia de Informes de Onboarding

## Resumen de la Implementación

Se ha implementado un sistema completo de persistencia y gestión de informes PDF de onboarding en el panel del delegado.

### Funcionalidades Implementadas

1. **Guardar informes en Storage privado de Supabase**
2. **Registro de metadatos en base de datos**
3. **Historial de informes con descarga**
4. **URLs firmadas temporales (10 minutos)**
5. **UI integrada en el panel del delegado**

## Archivos Creados/Modificados

### 1. Migración de Base de Datos
**Archivo**: `supabase/migrations/20250112_entity_reports.sql`
- Crea tabla `entity_reports` con metadatos de informes
- Índices optimizados para consultas por entidad y fecha

### 2. Librería Reutilizable de Informes
**Archivo**: `src/lib/reports/onboarding.ts`
- `buildOnboardingReportData()`: Obtiene datos del informe
- `renderOnboardingReportPDF()`: Genera el PDF
- Refactorización del código existente para reutilización

### 3. Nuevo Endpoint: Guardar Informe
**Archivo**: `src/app/api/delegado/onboarding/report/save/route.ts`
- POST con `{ entityId }`
- Genera PDF y lo sube a Storage privado
- Registra en BD con metadatos
- Devuelve URL firmada temporal
- Manejo de colisiones de nombres (-v2, -v3, etc.)

### 4. Nuevo Endpoint: Listar Informes
**Archivo**: `src/app/api/delegado/onboarding/report/list/route.ts`
- GET con `?entityId=xxx&limit=50`
- Lista informes guardados
- Genera URLs firmadas para cada uno
- Ordenados por fecha descendente

### 5. Endpoint de Descarga Refactorizado
**Archivo**: `src/app/api/delegado/onboarding/report/route.ts`
- Refactorizado para usar las nuevas funciones de `lib/reports/onboarding.ts`
- Mantiene compatibilidad con descarga directa existente

### 6. UI del Panel del Delegado
**Archivo**: `src/app/panel-delegado/onboarding/page.tsx`

**Cambios**:
- Botón "Guardar informe y descargar" (botón azul principal)
- Botón "Descargar" (botón gris secundario - descarga directa sin guardar)
- Sección "Historial de Informes Guardados"
  - Tabla con fecha, nombre, tamaño y acción
  - Mensaje cuando no hay informes
  - Botón "Descargar" por cada informe
- Toast notifications para feedback
- Estados de carga (guardandoPDF, loadingReports)

## Estructura de Almacenamiento

### Storage Bucket: `entity-reports` (PRIVADO)

```
entity-reports/
├── {entityId-1}/
│   ├── onboarding-20250112-1430.pdf
│   ├── onboarding-20250112-1545.pdf
│   └── onboarding-20250113-0900-v2.pdf
├── {entityId-2}/
│   └── onboarding-20250112-1000.pdf
```

**Nomenclatura**:
- `onboarding-{YYYYMMDD-HHmm}.pdf`
- Si hay colisión: `-v2`, `-v3`, etc.

### Tabla: `entity_reports`

```sql
CREATE TABLE entity_reports (
  id BIGINT PRIMARY KEY,
  entity_id UUID NOT NULL,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  bytes BIGINT,
  checksum TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Seguridad

1. **Bucket Privado**: Solo accesible vía service role
2. **URLs Firmadas**: Expiran en 10 minutos
3. **Validación de Permisos**: Verificación de entityId en endpoints
4. **No datos sensibles**: Los nombres de archivo no contienen información personal

## Configuración Necesaria

### 1. Aplicar Migración SQL
Ejecutar `supabase/migrations/20250112_entity_reports.sql` en Supabase

### 2. Crear Bucket en Supabase
1. Dashboard → Storage
2. Crear bucket: `entity-reports`
3. Configurar como **PRIVADO**
4. Límite: 10 MB
5. MIME types: `application/pdf`

### 3. Variables de Entorno
Verificar `.env.local`:
```
SUPABASE_SERVICE_ROLE_KEY=xxx  # CRÍTICO para Storage
```

## Flujo de Usuario

### Guardar y Descargar
1. Usuario hace clic en "Guardar informe y descargar"
2. Sistema genera PDF
3. Sube a Storage privado
4. Registra en BD
5. Descarga automáticamente vía URL firmada
6. Muestra toast de éxito
7. Recarga historial

### Ver Historial
1. Al cargar la página se listan los informes
2. Tabla muestra: fecha, nombre, tamaño
3. Botón "Descargar" genera nueva URL firmada
4. Descarga directa del archivo

### Descarga Directa (sin guardar)
1. Botón gris "Descargar"
2. Genera PDF en memoria
3. Descarga sin guardar en Storage
4. NO aparece en historial

## Testing

### Verificación Manual
1. Ir a `/panel-delegado/onboarding`
2. Clic en "Guardar informe y descargar"
3. Verificar:
   - PDF se descarga
   - Toast de éxito aparece
   - Informe aparece en historial
4. En Supabase Storage → `entity-reports` → verificar archivo
5. En tabla `entity_reports` → verificar registro
6. Clic en "Descargar" del historial
7. Verificar que descarga correctamente

### Casos de Prueba
- [ ] Guardar primer informe
- [ ] Guardar segundo informe (mismo día)
- [ ] Verificar sufijos de versión (-v2)
- [ ] Descargar desde historial
- [ ] Historial vacío muestra mensaje correcto
- [ ] URLs firmadas expiran (probar después de 10 min)

## Compatibilidad

- ✅ NO modifica el portal de onboarding
- ✅ NO modifica tokens
- ✅ NO modifica formación del delegado
- ✅ NO toca BOE, cron ni emails
- ✅ Endpoint de descarga original sigue funcionando
- ✅ Ambos botones (Guardar y Descargar) conviven

## Próximos Pasos Opcionales

1. **Eliminar informes antiguos**: Botón para borrar del historial
2. **Compartir informes**: Generar URL firmada con mayor duración
3. **Filtros**: Filtrar por fecha en el historial
4. **Exportar múltiples**: Descargar varios informes como ZIP
5. **Notificaciones**: Email cuando se genera un informe
6. **Checksums**: Validar integridad de archivos con SHA256

## Notas Técnicas

- **Service Role Key** es necesaria para operaciones de Storage
- URLs firmadas se regeneran cada vez que se lista el historial
- Los archivos NO se eliminan automáticamente (gestión manual pendiente)
- Tamaño máximo de PDF ~2-5 MB por informe típico
- Límite de 50 informes en el historial (configurable)
