# 📋 Tareas - Custodia360

**Última actualización:** 17 de octubre de 2025
**Versión actual:** v152 (pendiente v153)
**Estado del servidor:** ✅ Corriendo en puerto 3000

---

## 🔒 MODO CONSOLIDACIÓN ACTIVO

**Política:** Todo el código existente está protegido. Solo se realizarán cambios tras confirmación explícita del usuario.

---

## ✅ IMPLEMENTACIÓN COMPLETADA - Nueva Funcionalidad

### 🎯 **Sistema de Configuración Adaptativa**

**Implementado con éxito:**

1. ✅ **Redirección automática para delegados nuevos**
   - Si es primera vez → redirige a `/dashboard-delegado/configuracion?firstTime=true`
   - Detecta estado con campo `isFirstTime` en compliance

2. ✅ **Banner de pasos pospuestos**
   - Se muestra arriba del panel cuando hay pendientes
   - Contador de días restantes dinámico
   - Botón "Completar Ahora" con redirección

3. ✅ **Banner urgente si venció el plazo**
   - Se muestra cuando `days_remaining <= 0`
   - Color rojo con mensaje de advertencia
   - Botón de acción prioritario

4. ✅ **Botón "⚙️ Configuración"**
   - Ubicado encima del "Estado de la Entidad"
   - Solo visible cuando configuración completada
   - Acceso rápido para modificaciones

5. ✅ **Card de configuración oculto**
   - El cuadro "Configuración del Sistema" se oculta cuando está completado
   - Solo visible si `isFirstTime === true`
   - Versión urgente con borde morado si está pendiente

6. ✅ **Limitaciones visuales si venció el plazo**
   - Opacity 50% + pointer-events-none en contenido del panel
   - Mantiene acceso a configuración para completar
   - No bloquea totalmente, solo limita funcionalidades

7. ✅ **Página de configuración adaptativa**
   - **Primera vez:** Header azul con mensaje de bienvenida, sin botón "Volver"
   - **Plazo vencido:** Header rojo con advertencia urgente
   - **Modificación:** Header gris normal, con botón "Volver"
   - Mensajes contextuales según estado

---

## 📂 **ARCHIVOS CREADOS**

### ✨ Componentes Nuevos

1. **`src/components/dashboard/ConfigBanner.tsx`**
   - Banner compacto para pasos pospuestos
   - Props: `daysRemaining`, `pendingSteps`
   - Diseño: borde naranja, icono de advertencia
   - Funcionalidad: botón de acción "Completar Ahora"

2. **`src/components/dashboard/ConfigButton.tsx`**
   - Botón de acceso a configuración
   - Props: `onClick`
   - Diseño: outline con icono de engranaje
   - Ubicación: encima de "Estado de la Entidad"

---

## 📝 **ARCHIVOS MODIFICADOS**

### 🔧 Panel del Delegado

**`src/app/dashboard-delegado/page.tsx`**

Cambios implementados:
- ✅ Importación de `ConfigBanner` y `ConfigButton`
- ✅ Interface `ComplianceStatus` agregada
- ✅ Estado `compliance` agregado
- ✅ useEffect para cargar compliance y redirección automática
- ✅ Banner de pospuestos en main (línea ~1108)
- ✅ Banner urgente si venció (línea ~1120)
- ✅ Botón de configuración encima de estado (línea ~1140)
- ✅ Card de configuración condicional (solo si isFirstTime)
- ✅ Wrapper con limitaciones visuales (opacity + pointer-events)

### 🎨 Página de Configuración

**`src/app/dashboard-delegado/configuracion/page.tsx`**

Cambios implementados:
- ✅ Import de `useSearchParams`
- ✅ Detección de `isFirstTime` y `isExpired`
- ✅ Botón "Volver" condicional (solo si NO es primera vez)
- ✅ Header adaptativo según contexto:
  - Primera vez: border-4 azul, mensaje de bienvenida
  - Vencido: border-4 rojo, advertencia urgente
  - Normal: border-2 gris, mensaje estándar
- ✅ Mensajes del card de acceso adaptados
- ✅ Texto del botón final adaptado (primera vez vs volver)

---

## 🔄 **LÓGICA IMPLEMENTADA**

### Estados de Configuración

```typescript
// Primera vez
isFirstTime = !config_completed_at || !hasCompletedMinimum

// Pospuestos pendientes
hasPostponed = channel_postponed || penales_postponed

// Plazo vencido
isExpired = hasPostponed && days_remaining <= 0

// Puede acceder al panel
canAccessPanel =
  (channel_done || channel_postponed) &&
  riskmap_done &&
  (penales_done || penales_postponed)
```

### Flujo de Comportamiento

1. **Delegado nuevo (primera vez)**
   - ✅ Redirige automáticamente a configuración
   - ✅ No puede volver hasta completar mínimo
   - ✅ Mensajes de bienvenida

2. **Configuración completada**
   - ✅ Panel limpio sin cuadro de configuración
   - ✅ Botón "⚙️ Configuración" disponible
   - ✅ Acceso completo a todas las funcionalidades

3. **Pasos pospuestos pendientes**
   - ✅ Banner discreto arriba con contador
   - ✅ Panel funcional normalmente
   - ✅ Recordatorio visual no invasivo

4. **Plazo vencido**
   - ✅ Banner urgente rojo
   - ✅ Panel con limitaciones visuales
   - ✅ Siempre puede completar configuración

---

## 🗄️ **CAMBIOS EN BASE DE DATOS REQUERIDOS**

⚠️ **PENDIENTE DE IMPLEMENTAR EN BACKEND:**

```sql
ALTER TABLE entity_compliance
ADD COLUMN config_completed_at TIMESTAMP,
ADD COLUMN last_modified_at TIMESTAMP DEFAULT NOW();
```

**Lógica:**
- `config_completed_at`: se guarda la primera vez que completa configuración inicial
- `last_modified_at`: se actualiza cada vez que modifica cualquier paso

**API que debe devolver:**
- Campo `isFirstTime` en `/api/compliance/status`
- Cálculo: `isFirstTime = !config_completed_at || !hasCompletedMinimum`

---

## 🎯 **PRÓXIMOS PASOS**

### Pendientes de implementar:

1. **Backend:**
   - [ ] Agregar campos a tabla `entity_compliance`
   - [ ] Modificar `/api/compliance/status` para incluir `isFirstTime`
   - [ ] Actualizar `config_completed_at` en primer completado
   - [ ] Actualizar `last_modified_at` en cada modificación

2. **Testing:**
   - [ ] Probar flujo de primera vez completo
   - [ ] Probar modificaciones posteriores
   - [ ] Verificar banners y limitaciones
   - [ ] Confirmar redirecciones automáticas

3. **Versión:**
   - [ ] Crear versión 153 con todos los cambios
   - [ ] Verificar funcionamiento en preview
   - [ ] Comprobar responsive design

---

## 📊 **ARCHIVOS DEL PROYECTO**

```
custodia-360/
├── src/
│   ├── components/
│   │   └── dashboard/
│   │       ├── ConfigBanner.tsx ✨ NUEVO
│   │       └── ConfigButton.tsx ✨ NUEVO
│   │
│   ├── app/
│   │   └── dashboard-delegado/
│   │       ├── page.tsx 🔧 MODIFICADO
│   │       └── configuracion/
│   │           └── page.tsx 🔧 MODIFICADO
│   │
│   └── lib/
│       └── mock/
│           └── mockData.ts ✅ EXISTENTE
│
└── .same/
    ├── todos.md 📝 ACTUALIZADO
    └── consolidation-mode.md 🔒 ACTIVO
```

---

**Fin del documento - Actualizado con implementación completa**
