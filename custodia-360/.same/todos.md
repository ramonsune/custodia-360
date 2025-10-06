# Custodia360 - Lista de Tareas

## 🚨 URGENTE - Problemas del Panel de Entidad
**Problema identificado por el usuario:**

### ❌ Problemas Actuales
- [ ] **Datos hardcodeados en lugar de Supabase:** Panel muestra "Delegados Activos: 2" con datos simulados
- [ ] **UI innecesaria:** Eliminar "C" y cuadro azul del header del panel de entidad

### 🔧 Soluciones a Implementar
1. [ ] **Reemplazar datos simulados con conexión a Supabase real**
   - Líneas 103-136: Cambiar datos hardcodeados por consultas a Supabase
   - Mostrar datos reales de la entidad autenticada
2. [ ] **Eliminar "C" y cuadro azul del header**
   - Líneas 1042-1044: Remover el elemento visual innecesario

## 🚨 PASOS PARA EL USUARIO - Email Configuration
**El usuario debe completar estos pasos:**

### ✅ Problema Identificado
- [x] API key de Resend es de ejemplo, no real: `re_NECESITAS_PONER_TU_CLAVE_REAL_AQUI`
- [x] Servidor reiniciado y funcionando en http://localhost:8080

### 📝 Próximos pasos del Usuario:
1. [ ] **Acceder a página de diagnóstico:** http://localhost:8080/diagnostico-emails
2. [ ] **Registrarse en Resend:** https://resend.com/signup (gratis)
3. [ ] **Obtener API key:** Dashboard → API Keys → Create API Key → Copiar clave
4. [ ] **Editar .env.local:** Reemplazar `RESEND_API_KEY=re_tu_clave_real_aqui_cuando_la_tengas` con la clave real
5. [ ] **Reiniciar servidor:** Ctrl+C → `bun run dev`
6. [ ] **Probar emails:** Ir a /diagnostico-emails y enviar prueba

### 🔧 Sistema Preparado
- [x] Página de diagnóstico `/diagnostico-emails` creada y funcionando
- [x] Instrucciones detalladas proporcionadas al usuario
- [x] .env.local preparado para recibir API key real
- [x] Servidor funcionando correctamente

## ✅ Completadas Recientemente
- [x] Creada página de diagnóstico de emails en `/diagnostico-emails`
- [x] Modificado homepage: color "Tu entidad" a negro
- [x] Removido stray "D" del dashboard mockup
- [x] Removidos iconos del iPhone mockup
- [x] Añadidas sombras al iPhone mockup
- [x] Arreglado overflow del contenido del iPhone mockup

## 📊 Estado del Proyecto
- **Versión actual:** 801
- **Servidor:** ✅ Funcionando en http://localhost:8080
- **Deploy:** ❌ Pendiente hasta que emails funcionen
- **Emails:** 🔧 Esperando configuración de API key del usuario
- **Panel Entidad:** 🔧 Requiere conexión a Supabase real y limpieza UI
