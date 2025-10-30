# 🔐 CÓMO ENTRAR A LOS PANELES

**URL**: http://localhost:3000/login

---

## ✅ CREDENCIALES (Todas con contraseña: `123`)

### 👤 DELEGADO PRINCIPAL
```
Email: delegado@custodia.com
Contraseña: 123
Accede a: Dashboard Delegado
```

### 👥 DELEGADO SUPLENTE
```
Email: delegados@custodia.com
Contraseña: 123
Accede a: Dashboard Suplente
```

### 🏢 ENTIDAD (Representante Legal)
```
Email: entidad@custodia.com
Contraseña: 123
Accede a: Dashboard Entidad
```

### ⚙️ ADMIN CUSTODIA360
```
Email: ramon@custodia.com
Contraseña: 123
Accede a: Dashboard Admin
```

---

## 📝 PASOS PARA ENTRAR

1. **Abrir navegador** → http://localhost:3000/login

2. **Escribir email** (ejemplo: delegado@custodia.com)

3. **Escribir contraseña** (siempre es: 123)

4. **Click "Iniciar Sesión"**

5. **Esperar 2-3 segundos** → Serás redirigido automáticamente

---

## 🚨 SI NO FUNCIONA

### Verificar que el servidor está corriendo:
```bash
cd custodia-360
bun run dev
```

Debe mostrar:
```
✓ Ready in ...ms
```

### Limpiar navegador:
1. Abrir consola del navegador (F12)
2. Aplicación → Almacenamiento local → Borrar todo
3. Refrescar página (F5)
4. Intentar login de nuevo

---

## ✅ LO QUE SE ARREGLÓ (27/01/2025)

- ✅ Redirecciones corregidas (/login-delegados → /login)
- ✅ Verificación de sesión simplificada
- ✅ Soporte para tipo 'principal' y 'suplente'
- ✅ Compatibilidad con estructura de entidad (string u objeto)

---

**Última actualización**: 27 de enero de 2025
**Estado servidor**: ✅ CORRIENDO en puerto 3000
