# 🚀 BOE Monitor - Guía Rápida

## ✅ SISTEMA COMPLETAMENTE INSTALADO Y FUNCIONAL

El sistema de monitoreo automático de la LOPIVI está **listo para usar**.

---

## 📋 VERIFICACIÓN RÁPIDA

### ¿Qué está instalado?

```bash
ls -lh scripts/boe_check.js       # ✅ Script principal
ls -lh .same/boe_state.json        # ✅ Estado persistente
ls -lh .same/BOE_CHECK_LOG.md      # ✅ Log de verificaciones
```

### Ejecutar verificación manual

```bash
cd custodia-360
node scripts/boe_check.js
```

**Salida esperada**:
```
🔍 Verificando BOE: https://www.boe.es/buscar/act.php?id=BOE-A-2021-9347&tn=tc
🟢 Sin cambios detectados.
```

---

## ⚙️ CONFIGURACIÓN PENDIENTE

### 1️⃣ Configurar Email (Resend)

Para recibir notificaciones cuando el BOE cambie:

```bash
# En tu terminal o en variables de entorno de Same
export RESEND_API_KEY="re_tu_api_key_aqui"

# Luego ejecutar
node scripts/boe_check.js
```

**Obtener API Key**:
1. Ve a https://resend.com
2. Login o Sign up
3. Ve a "API Keys"
4. Crea una nueva API key
5. Cópiala y úsala arriba

### 2️⃣ Configurar Scheduler Semanal

**Opción A: Same Scheduler (Recomendado)**

Si Same tiene scheduler integrado, configurarlo así:
- **Comando**: `node scripts/boe_check.js`
- **Frecuencia**: Semanal
- **Día**: Lunes
- **Hora**: 08:00
- **Timezone**: Europe/Madrid
- **Variables**: `RESEND_API_KEY=tu_key`

**Opción B: GitHub Actions**

Crear `.github/workflows/boe-check.yml`:
```yaml
name: BOE LOPIVI Check
on:
  schedule:
    - cron: '0 7 * * 1'  # Lunes 08:00 Europe/Madrid (UTC+1 = 7:00 UTC)
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Run BOE Check
        env:
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
        run: |
          cd custodia-360
          node scripts/boe_check.js
```

**Opción C: Cron local**

```bash
# Editar crontab
crontab -e

# Agregar (ejecuta lunes 08:00)
0 8 * * 1 cd /ruta/a/custodia-360 && /usr/bin/node scripts/boe_check.js
```

---

## 📊 VERIFICAR QUE FUNCIONA

### Ver estado actual
```bash
cat .same/boe_state.json | node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0,'utf8')),null,2))"
```

### Ver últimas verificaciones
```bash
tail -5 .same/BOE_CHECK_LOG.md
```

### Forzar detección de "cambio"
```bash
# Borrar estado y ejecutar
rm .same/boe_state.json
node scripts/boe_check.js
# Primera vez detectará "cambio"

# Ejecutar de nuevo
node scripts/boe_check.js
# Segunda vez detectará "sin cambios"
```

---

## 🔔 PROBAR NOTIFICACIÓN

```bash
# Con tu API key real
RESEND_API_KEY="re_tu_key" \
REPORT_EMAIL="tu_email@test.com" \
node scripts/boe_check.js

# Luego borra el estado para forzar cambio
rm .same/boe_state.json

# Ejecuta de nuevo
RESEND_API_KEY="re_tu_key" \
REPORT_EMAIL="tu_email@test.com" \
node scripts/boe_check.js

# Deberías recibir un email
```

---

## 📁 ARCHIVOS IMPORTANTES

| Archivo | Descripción | Editable |
|---------|-------------|----------|
| `scripts/boe_check.js` | Script principal | ❌ No |
| `scripts/boe_check.sh` | Versión bash (requiere jq) | ❌ No |
| `.same/boe_state.json` | Estado persistente | ✅ Sí (para testing) |
| `.same/BOE_CHECK_LOG.md` | Log de verificaciones | ✅ Sí (append only) |
| `.same/BOE_MONITOR_CONFIG.md` | Documentación completa | 📖 Leer |

---

## ❓ FAQ

### ¿Cómo sé si hay cambios?
1. Recibirás un email automáticamente (si configuraste Resend)
2. Revisa el log: `tail .same/BOE_CHECK_LOG.md`
3. El dashboard de Custodia360 mostrará alertas

### ¿Qué pasa si el BOE está caído?
El script termina con `exit 0` para no marcar error en el scheduler.

### ¿Puedo cambiar la URL monitoreada?
```bash
BOE_URL="https://otra-url.boe.es" node scripts/boe_check.js
```

### ¿Cómo ver el hash actual del BOE?
```bash
node -e "console.log(require('./.same/boe_state.json').body_hash)"
```

### ¿Puedo ejecutarlo manualmente cuando quiera?
Sí, siempre:
```bash
node scripts/boe_check.js
```

---

## ✅ CHECKLIST COMPLETO

- [x] Script instalado y funcional
- [x] Estado persistente creado
- [x] Log de verificaciones creado
- [x] Primera verificación manual exitosa
- [x] Segunda verificación confirma "sin cambios"
- [ ] RESEND_API_KEY configurada
- [ ] Email de prueba recibido
- [ ] Scheduler configurado (lunes 08:00)
- [ ] Primera ejecución automática confirmada

---

**Sistema listo para producción** ✅
**Documentación completa**: `.same/BOE_MONITOR_CONFIG.md`
**Soporte**: support@same.new
