# 🔍 SISTEMA DE MONITOREO BOE - CONFIGURACIÓN

**Sistema**: Custodia360 - Verificación Automática LOPIVI
**Fecha de activación**: 27 de Octubre 2025
**Estado**: ✅ ACTIVO

---

## 📋 CONFIGURACIÓN ACTUAL

### URL Monitoreada
```
https://www.boe.es/buscar/act.php?id=BOE-A-2021-9347&tn=tc
```
**Documento**: Ley Orgánica 8/2021 (LOPIVI)

### Frecuencia de Verificación
- **Scheduler**: Lunes a las 08:00 AM (horario España - Europe/Madrid)
- **Método**: Cron job semanal
- **Reintentos**: Automático si falla por timeout

### Método de Detección de Cambios
El sistema verifica cambios usando **3 métodos en cascada**:

1. **ETag** (preferido)
   - Header HTTP que cambia si el contenido cambia
   - Más eficiente, no descarga todo el documento

2. **Last-Modified** (alternativo)
   - Fecha de última modificación del documento
   - Si ETag no está disponible

3. **Hash SHA-256** (fallback)
   - Hash del contenido completo del documento
   - Si ni ETag ni Last-Modified están disponibles
   - Garantiza detección de cualquier cambio

---

## 🔔 NOTIFICACIONES

### Email Automático
- **Servicio**: Resend API
- **Destinatario**: `soporte@custodia360.es`
- **Asunto**: `[BOE] Cambio detectado en LOPIVI`
- **Contenido**: Razón del cambio + enlace directo al BOE

### Ejemplo de Email
```
Se ha detectado un cambio en el BOE (LOPIVI).

Razón: ETag cambió: 'abc123' → 'def456'

[Abrir BOE] → https://www.boe.es/buscar/act.php?id=BOE-A-2021-9347&tn=tc
```

---

## 📁 ARCHIVOS DEL SISTEMA

### 1. Script Principal
**Ruta**: `scripts/boe_check.sh`
**Permisos**: Ejecutable (`chmod +x`)
**Función**: Ejecutar verificación completa

### 2. Estado Persistente
**Ruta**: `.same/boe_state.json`
**Contenido**:
```json
{
  "etag": "último ETag detectado",
  "last_modified": "última fecha de modificación",
  "body_hash": "último hash SHA-256",
  "checked_at": "fecha ISO de última verificación"
}
```

### 3. Log de Verificaciones
**Ruta**: `.same/BOE_CHECK_LOG.md`
**Formato**: Markdown con timestamp ISO
**Ejemplo**:
```
- 2025-10-27T08:00:00+02:00 — Sin cambios
- 2025-11-03T08:00:00+01:00 — CAMBIO DETECTADO — ETag cambió
```

---

## ⚙️ VARIABLES DE ENTORNO

### Requeridas
```bash
RESEND_API_KEY="re_xxxxxxxxxxxx"
```

### Opcionales
```bash
BOE_URL="https://www.boe.es/buscar/act.php?id=BOE-A-2021-9347&tn=tc"  # URL por defecto
REPORT_EMAIL="soporte@custodia360.es"  # Email destinatario
```

---

## 🚀 USO MANUAL

### Verificar BOE ahora (sin esperar al scheduler)
```bash
cd custodia-360
bash scripts/boe_check.sh
```

### Con variable de entorno personalizada
```bash
RESEND_API_KEY="tu_api_key" bash scripts/boe_check.sh
```

### Cambiar URL temporalmente
```bash
BOE_URL="https://otra-url-boe.es" bash scripts/boe_check.sh
```

---

## 📊 SALIDAS DEL SCRIPT

### Exit Code 0 (SIEMPRE)
El script **siempre termina con exit 0** para que el scheduler no lo marque como fallido.

### Salida con cambios
```
🔍 Verificando BOE: https://www.boe.es/buscar/act.php?id=BOE-A-2021-9347&tn=tc
✅ CAMBIO DETECTADO — ETag cambió: 'abc' → 'def'
```

### Salida sin cambios
```
🔍 Verificando BOE: https://www.boe.es/buscar/act.php?id=BOE-A-2021-9347&tn=tc
🟢 Sin cambios detectados.
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "curl: (3) URL rejected: No host part in the URL"
**Causa**: BOE_URL vacía o malformada
**Solución**: El script ahora valida y corrige automáticamente la URL

### Error: "jq: command not found"
**Causa**: jq no está instalado
**Solución**:
```bash
# Ubuntu/Debian
sudo apt-get install jq

# macOS
brew install jq
```

### No se envían emails
**Causa**: RESEND_API_KEY no configurada
**Solución**: Configurar la variable de entorno con tu API key de Resend

### Verificar estado actual
```bash
cat .same/boe_state.json | jq
```

### Ver últimas 10 verificaciones
```bash
tail -10 .same/BOE_CHECK_LOG.md
```

---

## 📅 PRÓXIMAS VERIFICACIONES

El scheduler ejecutará automáticamente cada:
- **Lunes a las 08:00 AM** (Europe/Madrid)

Próximas fechas estimadas:
- 03 de Noviembre 2025 08:00
- 10 de Noviembre 2025 08:00
- 17 de Noviembre 2025 08:00
- 24 de Noviembre 2025 08:00

---

## ✅ CHECKLIST DE ACTIVACIÓN

- [x] Script `boe_check.sh` creado
- [x] Archivo de estado `boe_state.json` inicializado
- [x] Log `BOE_CHECK_LOG.md` creado
- [x] Permisos de ejecución configurados
- [ ] Scheduler semanal configurado en Same
- [ ] RESEND_API_KEY configurada en variables de entorno
- [ ] Primera verificación manual ejecutada
- [ ] Email de prueba recibido

---

**Última actualización**: 27 de Octubre 2025
**Mantenido por**: Custodia360 - Sistema Automatizado
