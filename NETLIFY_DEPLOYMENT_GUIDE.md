# Guía de Deployment en Netlify - Custodia360

## ✅ Problemas Corregidos

### 1. **Configuración netlify.toml**
- ❌ **Problema**: Redirects incorrectos para aplicaciones dinámicas Next.js
- ✅ **Solución**: Eliminados redirects problemáticos, solo el plugin @netlify/plugin-nextjs maneja las rutas

- ❌ **Problema**: Directorio de publicación incorrecto (`publish = ".next"`)
- ✅ **Solución**: Removido para que Netlify auto-detecte la configuración

- ❌ **Problema**: Configuración de funciones innecesaria para apps dinámicas
- ✅ **Solución**: Eliminada configuración de funciones manual

### 2. **Versión de Node.js**
- ❌ **Problema**: Node.js 20 podía causar incompatibilidades
- ✅ **Solución**: Cambiado a Node.js 18 LTS (recomendado por Netlify)

### 3. **Comando de Build**
- ❌ **Problema**: Comando no optimizado para Netlify
- ✅ **Solución**: Mejorado con verificaciones específicas de Netlify

## 📋 Configuración Final

### netlify.toml
```toml
[build]
  command = "npm ci --legacy-peer-deps && npm run build:production"
  # No publish directory specified - auto-detected by Netlify

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
  NODE_OPTIONS = "--max-old-space-size=8192"
  SKIP_TYPE_CHECK = "true"
  DISABLE_ESLINT = "true"
  NPM_FLAGS = "--legacy-peer-deps"

  # Variables de entorno específicas...
```

### next.config.js
```javascript
const nextConfig = {
  // Configuración para aplicación dinámica Next.js
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // ... resto de configuración
}
```

## 🚀 Instrucciones de Deployment

### 1. **Configuración en Netlify Dashboard**
1. Conectar repositorio de GitHub
2. Configurar build settings:
   - **Build command**: `npm run build:netlify`
   - **Publish directory**: Dejar vacío (auto-detectado)
   - **Node version**: 18

### 2. **Variables de Entorno en Netlify**
Configurar en Site Settings > Environment variables:

**REQUERIDAS:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**OPCIONALES:**
- `RESEND_API_KEY`
- `PDFSHIFT_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Todas las demás variables del netlify.toml

### 3. **Scripts Disponibles**
```bash
# Verificar configuración de Netlify
npm run netlify-check

# Build para producción (incluye verificaciones)
npm run build:production

# Build optimizado para Netlify
npm run build:netlify
```

## 🔍 Verificaciones Pre-Deploy

### Script de Verificación
El script `scripts/netlify-check.js` verifica:
- ✅ Versión de Node.js compatible
- ✅ Variables de entorno configuradas
- ✅ Archivos de configuración presentes
- ✅ Configuración de memoria

### Build Local Testing
```bash
# Probar build localmente
npm ci --legacy-peer-deps
npm run build:production
```

## 🐛 Troubleshooting

### Error: "Failed to compile"
- Verificar que las variables de entorno estén configuradas en Netlify
- Asegurar que Node.js version sea 18

### Error: "Command failed with exit code 1"
- Revisar los logs de build en Netlify
- Ejecutar `npm run netlify-check` localmente

### Error: "Routes not working"
- Verificar que @netlify/plugin-nextjs esté instalado
- No agregar redirects manuales para rutas de Next.js

### Error: "Environment variables not found"
- Verificar configuración en Netlify Site Settings > Environment variables
- Las variables deben coincidir exactamente con las del netlify.toml

## 📊 Build Output Esperado

El build exitoso debe mostrar:
```
✅ Verificación de Netlify completada
✅ Verificaciones pre-build completadas
✅ Todas las variables de entorno están configuradas
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (136/136)
✓ Finalizing page optimization
```

## 🎯 Características de la Configuración

- ✅ **Aplicación Next.js dinámica** (no estática)
- ✅ **API Routes funcionales** en `/api/*`
- ✅ **Rutas dinámicas** con `[id]` y `[...slug]`
- ✅ **Server-side rendering** habilitado
- ✅ **Edge functions** via @netlify/plugin-nextjs
- ✅ **Optimización de memoria** para builds grandes
- ✅ **Verificaciones automáticas** pre-build

## 📞 Soporte

Si el deployment falla después de aplicar estas correcciones:
1. Revisar logs completos en Netlify
2. Ejecutar `npm run netlify-check` localmente
3. Verificar que todas las variables de entorno estén configuradas
4. Confirmar que el repositorio tenga los archivos actualizados
