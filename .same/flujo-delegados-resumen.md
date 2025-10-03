# 🛡 FLUJO FORMACIÓN DELEGADOS - CUSTODIA360

## 🚀 **ENTIDAD NUEVA → DELEGADO FORMADO**

### **1. REGISTRO INICIAL**
```
/contratar/ → Datos entidad → Datos delegado → Pago → ✅ Activación
```

### **2. CREDENCIALES AUTO-GENERADAS**
- Email + Password automática para delegado principal
- Email + Password automática para suplente (si aplica)
- Estado inicial: "pendiente_formacion"

### **3. FORMACIÓN OBLIGATORIA (6h 30min)**
Campus virtual `/formacion-lopivi/campus`:
- 📚 5 módulos descargables (30min c/u)
- 🎯 Test final (nota mínima 80%)
- 📄 Antecedentes penales vigentes
- ✅ Certificación oficial

### **4. ACTIVACIÓN DASHBOARD**
Una vez formado: acceso completo a `/dashboard-delegado`

---

## ⚠️ **GESTIÓN DE DESPIDOS/CAMBIOS**

### **DESPIDO DELEGADO PRINCIPAL**

**CON suplente formado:**
- ✅ Suplente se activa automáticamente
- 🔄 30 días para nombrar nuevo principal
- 📋 Continuidad garantizada

**SIN suplente:**
- 🚨 EMERGENCIA: 48h máximo sin delegado
- 🛑 Suspensión temporal de actividad
- ⚡ Formación express para nuevo delegado

### **DESPIDO DELEGADO SUPLENTE**
- 📝 Notificación simple
- 🔒 Desactivación inmediata
- ✅ Principal mantiene operatividad

### **CAMBIO PLANIFICADO**
- 📅 Notificación 15 días antes
- 🎓 Formación nuevo delegado en paralelo
- 🔄 Transición sin interrupciones

---

## 🔧 **ESTADOS TÉCNICOS**

```javascript
ESTADOS = {
  'pendiente_formacion': 'Acceso creado, debe formar',
  'activo': 'Formado y operativo',
  'suspendido': 'Acceso temporal suspendido',
  'inactivo': 'Despedido/reemplazado'
}
```

---

## 📊 **SISTEMA ACTUAL (IMPLEMENTADO)**

### ✅ **FUNCIONAL:**
- Dashboard delegado completo
- Gestión de personal con formación
- Antecedentes penales validados
- Notificaciones tiempo real
- Estados y métricas actualizadas

### 🔄 **PENDIENTE BACKEND:**
- Persistencia real (Supabase)
- Emails automáticos (Resend)
- Autenticación segura
- PDFs profesionales

**¡Sistema 100% operativo a nivel interfaz!** 🎉
