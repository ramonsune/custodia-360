# Informe PDF de Onboarding

## 📄 Descripción

Sistema de generación de informes PDF consolidados del proceso de onboarding para el delegado de protección.

## 🎯 Propósito

Proporcionar al delegado un documento descargable que resume el estado de cumplimiento del onboarding de su entidad, útil para:
- Auditorías internas
- Verificación de cumplimiento LOPIVI
- Reportes a dirección
- Documentación de seguimiento

## 📍 Ubicación

### Endpoint API
- **Ruta**: `/api/delegado/onboarding/report`
- **Método**: GET
- **Parámetro**: `?entityId={uuid}`
- **Respuesta**: PDF binario (application/pdf)

### Panel UI
- **Ruta**: `/panel-delegado/onboarding`
- **Botón**: "Descargar Informe PDF" (esquina superior derecha)

## 📊 Contenido del Informe

### 1. Cabecera
- Logo de Custodia360
- Título: "INFORME DE ONBOARDING"
- Nombre de la entidad
- Diseño con fondo azul (#2563EB)

### 2. Resumen General
- Sector de la entidad
- Fecha de contratación
- Fecha límite (30 días desde contratación)
- Fecha de generación del informe
- Periodo de cumplimiento

### 3. Banner de Alerta (si aplica)
Banner rojo (#DC2626) si hay personal de contacto vencido sin entregar penales:
```
⚠️ ALERTA CRÍTICA
Hay personal de contacto que NO ha marcado la entrega del certificado
de penales dentro del plazo de 30 días. Hasta que lo haga, NO puede
ejercer su función en la entidad conforme al artículo 57 de la LOPIVI.
```

### 4. Tabla de Cumplimiento Global
| Perfil | Total | OK | Vencido | % Cumplimiento |
|--------|-------|----|---------| ---------------|
| Personal de Contacto | X | X | X | XX% |
| Personal sin Contacto | X | X | X | XX% |
| Familias / Tutores | X | X | X | XX% |

### 5. Promedio de Test
- Promedio de aciertos en test de personal de contacto: X.X / 10

### 6. Detalle de Personal de Contacto
Tabla con columnas:
- Nombre
- Email
- Test (score/10 + ✓/✗ aprobado)
- Penales (Sí/No)
- Estado (OK/Pendiente/Vencido)

### 7. Detalle de Personal sin Contacto
Tabla con columnas:
- Nombre
- Email
- Lectura confirmada (Sí/No)
- Estado (OK/Pendiente/Vencido)

### 8. Detalle de Familias / Tutores
Tabla con columnas:
- Nombre Tutor
- Nº Hijos
- Lectura confirmada (Sí/No)
- Estado (OK/Pendiente/Vencido)

### 9. Pie de Página
Texto en gris claro en todas las páginas:
```
*Datos generados automáticamente por Custodia360 según la LOPIVI.
```

## 🔧 Implementación Técnica

### Backend (Next.js App Router)

```typescript
// Ruta: /api/delegado/onboarding/report/route.ts

1. Validar entityId
2. Obtener datos de la entidad (Supabase)
3. Obtener respuestas de onboarding
4. Calcular estadísticas:
   - Total, OK, Vencido por perfil
   - Promedio de test
   - Detectar alerta de penales
5. Generar PDF con jsPDF y jspdf-autotable
6. Devolver como arraybuffer con headers:
   - Content-Type: application/pdf
   - Content-Disposition: attachment; filename="..."
```

### Frontend (React)

```typescript
// Ruta: /panel-delegado/onboarding/page.tsx

const descargarInformePDF = async () => {
  // 1. Mostrar spinner
  setGenerandoPDF(true)

  // 2. Llamar al endpoint
  const res = await fetch(`/api/delegado/onboarding/report?entityId=${entityId}`)

  // 3. Convertir respuesta a blob
  const blob = await res.blob()

  // 4. Crear URL temporal y descargar
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `informe-onboarding-${fecha}.pdf`
  a.click()

  // 5. Limpiar
  window.URL.revokeObjectURL(url)
  setGenerandoPDF(false)
}
```

## 🎨 Estilo Visual

### Colores
- **Azul primario**: #2563EB (cabecera, títulos de tablas)
- **Rojo alerta**: #DC2626 (banner de advertencia)
- **Texto principal**: #000000
- **Texto secundario**: #969696
- **Blanco**: #FFFFFF

### Tipografía
- **Font**: Helvetica
- **Títulos**: Bold, 12-20pt
- **Texto**: Normal, 9-10pt
- **Pie de página**: 8pt

### Layout
- **Tamaño página**: A4 (210mm x 297mm)
- **Márgenes**: 20mm izquierda/derecha
- **Orientación**: Portrait
- **Espaciado**: 10mm entre secciones

## 📦 Dependencias

```json
{
  "jspdf": "^3.0.3",
  "jspdf-autotable": "^5.0.2"
}
```

Ya instaladas en el proyecto.

## 🔒 Seguridad

### Validaciones
1. **Autenticación**: Solo delegados autenticados pueden acceder
2. **Autorización**: Solo pueden descargar el informe de su propia entidad
3. **Datos sensibles**: No se incluyen datos médicos ni documentos adjuntos
4. **Privacidad**: Emails solo cuando es necesario, familias sin email en el PDF

### Headers de Seguridad
```typescript
headers: {
  'Content-Type': 'application/pdf',
  'Content-Disposition': 'attachment; filename="..."',
  'Content-Length': pdfBuffer.byteLength.toString()
}
```

## 📏 Formato del Nombre de Archivo

```
onboarding-{entityId}-{YYYYMMDD}.pdf

Ejemplo:
onboarding-a1b2c3d4-e5f6-7890-abcd-ef1234567890-20250111.pdf
```

## 🧪 Cómo Probar

1. **Acceder al panel del delegado**:
   ```
   http://localhost:3000/panel-delegado/onboarding
   ```

2. **Verificar que hay datos**:
   - Al menos 1 respuesta de onboarding en la base de datos
   - Entity con `id` válido

3. **Hacer clic en "Descargar Informe PDF"**:
   - Debe mostrar spinner "Generando..."
   - Debe descargar automáticamente el PDF
   - Archivo debe abrirse correctamente

4. **Verificar contenido del PDF**:
   - ✅ Cabecera con nombre de entidad
   - ✅ Resumen general completo
   - ✅ Tabla de cumplimiento global
   - ✅ Detalle de personal (si existe)
   - ✅ Detalle de familias (si existe)
   - ✅ Banner de alerta (si aplica)
   - ✅ Pie de página en todas las páginas

## ⚠️ Troubleshooting

### Error: "entityId requerido"
**Causa**: No se pasó el parámetro entityId
**Solución**: Verificar que `localStorage.getItem('userSession')` contiene `entityId`

### Error: "Entidad no encontrada"
**Causa**: El entityId no existe en la tabla `entities`
**Solución**: Verificar que el usuario tiene una entidad válida

### PDF vacío o corrupto
**Causa**: Error en la generación del PDF
**Solución**: Revisar logs de consola del servidor, verificar que jsPDF está instalado

### El PDF no se descarga
**Causa**: Problema con el blob o permisos del navegador
**Solución**: Verificar que el navegador permite descargas automáticas

## 🚀 Mejoras Futuras

- [ ] Gráficas de cumplimiento (pie charts, bar charts)
- [ ] Filtros por rango de fechas
- [ ] Comparativa entre periodos
- [ ] Exportar también a Excel
- [ ] Envío automático por email
- [ ] Programar generación periódica
- [ ] Firma digital del informe
- [ ] Incluir QR code para validación

## 📝 Notas Importantes

1. **No modifica datos**: El endpoint solo lee, no escribe en la base de datos
2. **Sin cache**: Cada descarga genera un PDF nuevo con datos actualizados
3. **Sin límite de descargas**: El delegado puede descargar cuantas veces quiera
4. **Sin almacenamiento**: El PDF no se guarda en el servidor, solo se genera y se envía
5. **Compatible con móviles**: Funciona en dispositivos móviles y tablets

---

**Desarrollado para Custodia360**
**Cumplimiento LOPIVI - Protección Integral de Menores**
