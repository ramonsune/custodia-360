# 📧 Configurar Sistema de Emails - Resend

## ⚠️ Problema: Los emails no se envían

Si no recibes emails desde el formulario de contacto, sigue estos pasos:

## 🔧 Solución Rápida (5 minutos)

### 1. Crear cuenta en Resend (GRATIS)
1. Ve a https://resend.com
2. Haz click en "Get Started"
3. Regístrate con tu email (es gratis hasta 3,000 emails/mes)
4. Verifica tu email

### 2. Obtener tu API Key
1. Ve a tu dashboard de Resend
2. Click en "API Keys" en el menú izquierdo
3. Click en "Create API Key"
4. Dale un nombre como "Custodia360-Development"
5. Selecciona "Full access"
6. Click "Add"
7. **COPIA la clave que empieza con `re_`**

### 3. Configurar en tu proyecto
1. Abre el archivo `.env.local`
2. Busca la línea que dice `RESEND_API_KEY=`
3. Reemplaza con tu clave real:
```
RESEND_API_KEY=re_tu_clave_real_aqui
```

### 4. Configurar email de origen
**Opción A: Desarrollo/Pruebas (Fácil)**
```
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**Opción B: Producción (Requiere dominio verificado)**
```
RESEND_FROM_EMAIL=no-reply@tudominio.com
```

### 5. Reiniciar el servidor
```bash
cd custodia-360
bun run dev
```

## 🧪 Probar la configuración

1. Ve a http://localhost:8080/test-email
2. Ingresa tu email
3. Click en "📧 Enviar Email de Prueba"
4. Revisa tu bandeja (y spam)

## 🔍 Diagnóstico

Si sigues teniendo problemas:

### Error común 1: API Key inválida
**Síntoma:** Error "API key"
**Solución:** Verifica que tu API key empiece con `re_` y sea la correcta

### Error común 2: Dominio no verificado
**Síntoma:** Error "domain not verified"
**Solución:** Usa `onboarding@resend.dev` para desarrollo

### Error común 3: Límite de emails
**Síntoma:** Error "rate limit"
**Solución:** Resend gratis permite 100 emails/día

## 📱 Configuración Completa para Producción

Para usar tu propio dominio:

1. **Añadir dominio en Resend:**
   - Ve a "Domains" en tu dashboard
   - Click "Add Domain"
   - Ingresa tu dominio (ej: custodia360.es)
   - Sigue las instrucciones DNS

2. **Verificar dominio:**
   - Añade los registros DNS que te proporciona Resend
   - Espera la verificación (puede tardar hasta 24h)

3. **Actualizar configuración:**
```env
RESEND_FROM_EMAIL=no-reply@tudominio.com
```

## 📞 Soporte

Si necesitas ayuda:
- 📖 Documentación: https://resend.com/docs
- 💬 Soporte Resend: support@resend.com
- 🆘 Este proyecto: revisa los logs en http://localhost:8080/test-email

## ✅ Verificación Final

Una vez configurado correctamente:
1. ✅ El formulario de contacto enviará emails
2. ✅ Los emails de contratación funcionarán
3. ✅ Las notificaciones del sistema estarán operativas

**¡Listo!** Tu sistema de emails debería funcionar perfectamente.
