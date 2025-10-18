# Configuración de Supabase Storage para Informes

## Pasos para configurar el bucket privado

### 1. Aplicar la migración de base de datos

```bash
cd custodia-360
# Ejecutar la migración en Supabase
# Esta migración crea la tabla entity_reports
```

Aplicar el archivo: `supabase/migrations/20250112_entity_reports.sql`

### 2. Crear el bucket privado en Supabase Storage

1. Ir a Supabase Dashboard → Storage
2. Crear nuevo bucket con nombre: **entity-reports**
3. Configuración del bucket:
   - **Public**: NO (desmarcar)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: application/pdf

### 3. Configurar políticas de seguridad (RLS)

El bucket debe ser PRIVADO. El acceso se gestiona mediante:
- Service Role Key para subir archivos (backend)
- URLs firmadas temporales (10 min) para descargar (frontend)

No se requieren políticas RLS adicionales ya que todo el acceso se gestiona via service role.

### 4. Verificar variables de entorno

Asegurar que `.env.local` contiene:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

El `SUPABASE_SERVICE_ROLE_KEY` es crítico para:
- Subir archivos a Storage
- Generar URLs firmadas
- Insertar registros en entity_reports

### 5. Prueba

1. Ir a `/panel-delegado/onboarding`
2. Hacer clic en "Guardar informe y descargar"
3. Verificar:
   - El PDF se descarga correctamente
   - Aparece un mensaje de éxito
   - El informe aparece en el historial
   - En Supabase Storage → entity-reports → {entityId}/ aparece el archivo

### 6. Estructura de almacenamiento

```
entity-reports/
├── {entityId-1}/
│   ├── onboarding-20250112-1430.pdf
│   ├── onboarding-20250112-1545.pdf
│   └── onboarding-20250113-0900-v2.pdf
├── {entityId-2}/
│   └── onboarding-20250112-1000.pdf
```

Cada entidad tiene su propia carpeta.
Los archivos se nombran con timestamp.
Si hay colisión, se añade sufijo -v2, -v3, etc.
