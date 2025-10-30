# 📱 Guía de QA Móvil - Custodia360

## ✅ Cambios Implementados

### 1. **Estilos CSS Móviles** (`/src/styles/mobile-overrides.css`)
- Media queries específicas para ≤768px
- Tipografía fluida responsive (sin afectar desktop)
- Grids → stack vertical automático
- Tablas con scroll horizontal
- Botones y targets táctiles (mín. 44px)
- Safe areas para iOS (notch)

### 2. **Navegación Optimizada** (`Navigation.tsx`)
- Logo y botones con mínimo 44px de alto
- Menú móvil con items de 56px de alto
- Texto legible (16px mínimo)
- Espaciado táctil mejorado
- Aria-labels para accesibilidad

### 3. **Meta Viewport** (`layout.tsx`)
- viewport-fit=cover para iOS
- width=device-width
- Importación de mobile-overrides.css

---

## 🧪 Páginas Prioritarias para Testing

### Nivel 1: Crítico
- ✅ `/` - Home
- ✅ `/planes` - Planes y precios
- ✅ `/login` - Login
- ✅ `/acceso` - Acceso rápido
- ✅ `/dashboard-delegado` - Dashboard principal

### Nivel 2: Importante
- ✅ `/formacion-lopivi/configuracion` - Configuración formación
- ✅ `/panel-delegado/configuracion` - Panel delegado
- ✅ `/registro-entidad` - Registro
- ✅ `/configuracion-delegado` - Configuración completa

### Nivel 3: Secundario
- `/guia` - Guía LOPIVI
- `/proceso` - Proceso implementación
- `/contacto` - Contacto
- `/como-lo-hacemos` - Información

---

## 📋 Checklist de Testing por Página

### Para cada página, verificar:

#### 1️⃣ **Navegación**
- [ ] Logo visible y clickeable (44px mín.)
- [ ] Botón hamburguesa accesible (44px)
- [ ] Menú se abre/cierra correctamente
- [ ] Items del menú táctiles (56px alto)
- [ ] No hay overlapping de elementos

#### 2️⃣ **Tipografía**
- [ ] Texto legible (mín. 16px en inputs)
- [ ] Headings no se rompen
- [ ] Line-height apropiado (1.5-1.6)
- [ ] No hay zoom involuntario en inputs

#### 3️⃣ **Layout**
- [ ] Sin scroll horizontal no deseado
- [ ] Padding lateral visible (16px mín.)
- [ ] Grids apilados verticalmente
- [ ] Cards no se salen del viewport

#### 4️⃣ **Formularios**
- [ ] Inputs 100% width
- [ ] Min-height 44px
- [ ] Labels encima de inputs
- [ ] Spacing entre campos (16-20px)
- [ ] Botones grandes y táctiles

#### 5️⃣ **Tablas**
- [ ] Scroll horizontal suave
- [ ] Wrapper con padding lateral
- [ ] Headers fijos visibles
- [ ] Texto no truncado

#### 6️⃣ **Botones/CTAs**
- [ ] Min-height 44px
- [ ] Padding suficiente (12px 16px)
- [ ] Tap highlight visible
- [ ] Estados activos claros

#### 7️⃣ **Modales**
- [ ] Se adaptan al viewport
- [ ] Padding respeta notch iOS
- [ ] Scroll funciona correctamente
- [ ] Botón cerrar accesible (44px)

---

## 📱 Dispositivos de Testing

### Móviles
- **iPhone SE (375×667)** - Pantalla pequeña
- **iPhone 12/13/14 (390×844)** - Estándar iOS
- **iPhone 14 Pro Max (430×932)** - Grande iOS
- **Pixel 5 (393×851)** - Android medio
- **Samsung Galaxy S21 (360×800)** - Android común

### Tablets
- **iPad Mini (768×1024)** - Tablet pequeña
- **iPad Air (820×1180)** - Tablet media
- **iPad Pro 12.9" (1024×1366)** - Tablet grande

---

## 🔍 Testing en Chrome DevTools

### Configuración
1. Abrir DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Seleccionar dispositivo o dimensión custom
4. Activar "Show device frame" para notch
5. Throttling 3G/4G para performance

### Herramientas útiles
- **Lighthouse Móvil**: Performance, Accessibility
- **Network throttling**: Simular 3G
- **Touch simulation**: Eventos táctiles
- **Rotate device**: Portrait/Landscape

---

## ⚠️ Problemas Comunes a Buscar

### Layout
- ❌ Texto que se sale del contenedor
- ❌ Overlapping de elementos
- ❌ Scroll horizontal no deseado
- ❌ Padding insuficiente en los bordes

### Interacción
- ❌ Botones pequeños (<44px)
- ❌ Links muy juntos
- ❌ Zoom involuntario en inputs
- ❌ Hover-only sin alternativa táctil

### Performance
- ❌ Imágenes muy grandes
- ❌ Animaciones pesadas
- ❌ Fuentes excesivas
- ❌ JS bloqueante

### iOS Específico
- ❌ Notch obstruye contenido
- ❌ Safe area no respetada
- ❌ Rubber band effect molesto
- ❌ -webkit prefixes faltantes

---

## 🎯 Métricas de Éxito

### Performance (Lighthouse)
- Performance: **>85**
- Accessibility: **>90**
- Best Practices: **>90**
- SEO: **>90**

### Usabilidad
- Touch targets: **100% ≥44px**
- Font size: **100% ≥16px en inputs**
- Tap delay: **<300ms**
- Layout shifts: **CLS <0.1**

### Conversión
- Bounce rate móvil: **<40%**
- Time on page: **>2min**
- Form completion: **>60%**
- CTA clicks: **>15%**

---

## 🐛 Reportar Issues

### Template de Issue Móvil
```markdown
**Dispositivo**: iPhone 12 / Chrome DevTools
**Viewport**: 390×844
**Página**: /dashboard-delegado
**Problema**: Botón "Guardar" no es táctil
**Esperado**: Min-height 44px
**Actual**: Height 32px
**Screenshot**: [adjuntar]
```

---

## 🚀 Pasos Siguientes

### Fase 1: Testing Básico (Día 1)
- [ ] Probar navegación en todos los dispositivos
- [ ] Verificar formularios principales
- [ ] Testing de CTAs y conversión
- [ ] Lighthouse móvil en páginas críticas

### Fase 2: Testing Avanzado (Día 2)
- [ ] Testing en dispositivos reales
- [ ] Probar con usuarios reales
- [ ] Network throttling (3G)
- [ ] Testing de accesibilidad

### Fase 3: Optimización (Día 3)
- [ ] Ajustar según feedback
- [ ] Optimizar imágenes
- [ ] Lazy loading
- [ ] Service worker / PWA

---

## 📚 Recursos Adicionales

- **Apple Human Interface Guidelines**: iOS design
- **Material Design**: Android design
- **Web.dev Mobile**: Best practices
- **Can I Use**: Compatibilidad CSS
- **BrowserStack**: Testing cross-browser

---

## ✨ Desktop NO Afectado

**IMPORTANTE**: Todos los cambios CSS usan media queries `@media (max-width: 768px)`.

Desktop (≥1024px) permanece **100% intacto**.

Solo se añaden clases Tailwind responsive (`md:`, `lg:`) sin alterar las clases desktop existentes.
