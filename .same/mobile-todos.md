# 📱 TODOs Optimización Móvil - Custodia360

## ✅ Completado

### Infraestructura Base
- [x] Crear `/src/styles/mobile-overrides.css`
- [x] Actualizar `layout.tsx` con viewport correcto
- [x] Importar estilos móviles globalmente
- [x] Documentar sistema en `/same/mobile-implementation.md`
- [x] Crear guía de QA en `/same/mobile-qa.md`

### Componentes Reutilizables
- [x] `MobileTableWrapper` - Wrapper para tablas
- [x] `ResponsiveCard` - Card responsive
- [x] `ResponsiveButton` - Botón táctil

### Componentes Core
- [x] `Navigation.tsx` - Navegación optimizada
  - [x] Botones táctiles (44px)
  - [x] Menú móvil mejorado
  - [x] Aria-labels

### Páginas Críticas
- [x] `/login` - Login optimizado
  - [x] Inputs 16px+ (evita zoom)
  - [x] Botones 48px
  - [x] Cards legibles
- [x] `/acceso` - Acceso rápido
  - [x] Grid responsive
  - [x] Botones táctiles

---

## 🚧 Pendiente - Páginas Prioritarias

### Nivel 1: Crítico (siguiente sprint)
- [ ] `/` - Home page
  - [ ] Hero responsive
  - [ ] CTAs táctiles
  - [ ] Grid de beneficios

- [ ] `/planes` - Planes y precios
  - [ ] Cards de planes apilados
  - [ ] Tabla de comparación scroll
  - [ ] Botones contratar grandes

- [ ] `/dashboard-delegado` - Dashboard principal
  - [ ] Cards responsive
  - [ ] Tablas con scroll
  - [ ] Botones acciones
  - [ ] Stats/métricas

### Nivel 2: Importante
- [ ] `/formacion-lopivi/configuracion`
  - [ ] Formularios optimizados
  - [ ] Modales responsive
  - [ ] Progress indicators

- [ ] `/panel-delegado/configuracion`
  - [ ] Multi-step forms
  - [ ] Upload de archivos
  - [ ] Confirmaciones

- [ ] `/registro-entidad`
  - [ ] Form wizard responsive
  - [ ] Validación visible
  - [ ] CTAs claros

- [ ] `/configuracion-delegado`
  - [ ] Steps verticales en móvil
  - [ ] Documentos legibles
  - [ ] Progreso visible

### Nivel 3: Secundario
- [ ] `/guia` - Guía LOPIVI
- [ ] `/proceso` - Proceso implementación
- [ ] `/contacto` - Formulario contacto
- [ ] `/como-lo-hacemos` - Info
- [ ] Resto de páginas informativas

---

## 🎨 Mejoras de Diseño

### Componentes UI
- [ ] Crear `ResponsiveForm` - Formularios táctiles
- [ ] Crear `ResponsiveModal` - Modales optimizados
- [ ] Crear `ResponsiveTabs` - Tabs móviles
- [ ] Crear `ResponsiveAccordion` - Acordeón táctil
- [ ] Crear `MobileNav` - Navegación inferior (opcional)

### Patrones de Diseño
- [ ] Bottom sheet para acciones en móvil
- [ ] Swipe gestures en listas
- [ ] Pull to refresh
- [ ] Infinite scroll optimizado
- [ ] Skeleton loaders

---

## 🧪 Testing

### Dispositivos
- [ ] iPhone SE (375px) - Pantalla pequeña
- [ ] iPhone 12/13 (390px) - iOS estándar
- [ ] iPhone 14 Pro Max (430px) - iOS grande
- [ ] Pixel 5 (393px) - Android medio
- [ ] Samsung Galaxy (360px) - Android común
- [ ] iPad Mini (768px) - Tablet
- [ ] iPad Air (820px) - Tablet media

### Métricas Lighthouse
- [ ] Performance móvil >85
- [ ] Accessibility >90
- [ ] Best Practices >90
- [ ] SEO >90

### Usabilidad
- [ ] Touch targets 100% ≥44px
- [ ] Font size inputs 100% ≥16px
- [ ] No scroll horizontal
- [ ] Tap delay <300ms
- [ ] Layout shifts CLS <0.1

---

## 🔧 Optimizaciones Técnicas

### Performance
- [ ] Lazy load imágenes below fold
- [ ] Code splitting por ruta
- [ ] Tree shaking de librerías
- [ ] Preload critical assets
- [ ] Service Worker / PWA

### Imágenes
- [ ] Next/Image en todas las imágenes
- [ ] Sizes attribute correcto
- [ ] WebP con fallback
- [ ] Blur placeholder
- [ ] Responsive srcset

### Fonts
- [ ] Font display: swap
- [ ] Preload font files
- [ ] Subset de caracteres
- [ ] Variable fonts

### JavaScript
- [ ] Defer non-critical scripts
- [ ] Async third-party
- [ ] Bundle size <200kb
- [ ] First paint <2s móvil

---

## 📊 Analytics y Tracking

### Eventos Móvil
- [ ] Track tap events
- [ ] Track scroll depth
- [ ] Track form abandonment
- [ ] Track page load time móvil
- [ ] Track device type

### A/B Testing
- [ ] Test CTA placement
- [ ] Test form layouts
- [ ] Test navigation patterns
- [ ] Test card designs

---

## 🐛 Bugs Conocidos

### iOS
- [ ] Safe area en landscape
- [ ] Rubber band effect en modales
- [ ] Input zoom en Safari
- [ ] Position fixed issues

### Android
- [ ] Back button behavior
- [ ] Chrome address bar ocultación
- [ ] Touch event delays
- [ ] Scroll performance

---

## 📚 Documentación

- [ ] Actualizar README con info móvil
- [ ] Screenshots móvil en docs
- [ ] Video demo móvil
- [ ] Guía de contribución móvil
- [ ] Changelog de cambios móviles

---

## 🎯 Próximos Pasos Inmediatos

### Esta Semana
1. **Completar páginas nivel 1** (Home, Planes, Dashboard)
2. **Testing básico** en DevTools (iPhone 12, Pixel 5)
3. **Lighthouse audit** de páginas críticas
4. **Fix issues críticos** encontrados

### Próxima Semana
1. **Completar páginas nivel 2**
2. **Testing en dispositivos reales**
3. **Optimización performance**
4. **Deploy a staging**

### Mes Actual
1. **Completar todas las páginas**
2. **Testing completo cross-device**
3. **Optimización final**
4. **Deploy a producción**

---

## 📝 Notas

- Desktop permanece **100% intacto**
- Todos los cambios usan `@media (max-width: 768px)`
- Clases Tailwind: solo añadir variantes `md:` y `lg:`
- No cambiar contenido ni estructura
- Solo CSS y utilidades responsive

---

## 🚀 Comando Rápido de Testing

```bash
# Dev server
bun run dev

# Lighthouse móvil
bunx lighthouse http://localhost:3000 --preset=mobile --view

# Bundle analyzer
bunx @next/bundle-analyzer analyze

# Type check
bun run type-check
```

---

## ✅ Criterios de Aceptación

Una página está **completa** cuando:
- ✅ Responsive en todos los breakpoints
- ✅ Todos los touch targets ≥44px
- ✅ Todos los inputs ≥16px
- ✅ Sin scroll horizontal
- ✅ Lighthouse móvil >85
- ✅ Tested en iPhone y Android
- ✅ Sin regresión en desktop
