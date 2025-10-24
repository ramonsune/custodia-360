# Guía de Despliegue en Netlify

## Pasos para Desplegar Custodia360 en Producción

### 1. Conectar con GitHub

1. Ve a [Netlify](https://netlify.com) e inicia sesión
2. Haz clic en "New site from Git" o "Import from Git"
3. Selecciona GitHub como proveedor
4. Autoriza a Netlify a acceder a tu repositorio `ramonsune/custodia-360`
5. Selecciona el repositorio

### 2. Configuración de Build

Netlify debería detectar automáticamente la configuración del `netlify.toml`, pero verifica que:

- **Build command**: `npm ci --legacy-peer-deps && npm run build:production`
- **Publish directory**: `.next`
- **Branch to deploy**: `main`

### 3. Variables de Entorno

**IMPORTANTE**: Debes configurar las siguientes variables de entorno en el dashboard de Netlify (Settings > Build & deploy > Environment variables):

#### Variables Obligatorias

```
NEXT_PUBLIC_SUPABASE_URL=https://gkoyqfusawhnobvkoijc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrb3lxZnVzYXdobm9idmtvaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODMzOTQsImV4cCI6MjA3MTg1OTM5NH0.8PhAfdlfpiLih4_QqrfWRbn-gZ8eeWX7NaTGpO-9hyY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrb3lxZnVzYXdobm9idmtvaWpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI4MzM5NCwiZXhwIjoyMDcxODU5Mzk0fQ.9oKkdWJsUEQaVXhOE4Uf4Nx6a0-8BZ5hNjdl_EyIJQM

RESEND_API_KEY=re_JfPp939X_84TnwFXTiDRqMtUfdd2omgRA
RESEND_FROM_EMAIL=noreply@custodia360.es

NEXT_PUBLIC_APP_URL=[TU_URL_DE_NETLIFY]
CRON_SECRET_TOKEN=custodia360-cron-secret-2025

PDFSHIFT_API_KEY=sk_3f24779f1fb6b4fa0a2bf6bfe6d25019fa8a19c6

# ⚠️ IMPORTANTE: Debes obtener tu propia clave de Stripe
STRIPE_SECRET_KEY=[TU_CLAVE_SECRETA_DE_STRIPE]
```

#### Variables Opcionales

```
DEMO_MODE=false
BOE_MONITOREO_ACTIVO=true
BOE_FRECUENCIA_DIAS=15
AUDIT_RETENTION_YEARS=5
AUDIT_TIMEZONE=Europe/Madrid
LOPIVI_COMPLIANCE_MODE=true
```

### 4. Obtener Clave de Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
2. Inicia sesión o crea una cuenta
3. Ve a **Developers > API keys**
4. Copia la clave **Secret key** (empieza con `sk_test_` en modo test o `sk_live_` en producción)
5. Pégala en la variable `STRIPE_SECRET_KEY` en Netlify

### 5. Actualizar NEXT_PUBLIC_APP_URL

Después de que Netlify genere tu URL (algo como `https://tu-sitio.netlify.app`):

1. Ve a Settings > Environment variables en Netlify
2. Edita `NEXT_PUBLIC_APP_URL` y pon tu URL de Netlify
3. Redespliega el sitio

### 6. Deploy

1. Haz clic en "Deploy site"
2. Espera a que el build termine (puede tardar 5-10 minutos)
3. ¡Tu sitio estará en vivo!

### 7. Configuración Adicional (Opcional)

#### Dominio Personalizado

1. Ve a **Domain management** en Netlify
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

#### Despliegue Continuo

Cada vez que hagas push a la rama `main` en GitHub, Netlify desplegará automáticamente los cambios.

## Solución de Problemas

### Error de Build

Si el build falla, revisa:

1. Que todas las variables de entorno estén configuradas
2. Los logs de build en Netlify
3. Que la clave de Stripe sea válida

### Error 500 en Producción

1. Verifica las variables de entorno en Netlify
2. Revisa los logs de funciones en Netlify
3. Asegúrate de que Supabase esté configurado correctamente

## Soporte

Para más ayuda, consulta:
- [Documentación de Netlify](https://docs.netlify.com)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
