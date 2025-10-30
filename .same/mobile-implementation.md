# 📱 Implementación Móvil - Custodia360

## 🎯 Objetivo

Optimizar la experiencia móvil y tablet (≤768px) **sin afectar el diseño desktop** (≥1024px).

---

## ✅ Archivos Creados/Modificados

### 1. Estilos CSS
- **`/src/styles/mobile-overrides.css`** - Estilos móviles globales
  - Media queries `@media (max-width: 768px)`
  - Tipografía fluida
  - Grids responsive
  - Tablas con scroll
  - Botones táctiles (≥44px)
  - Safe areas iOS

### 2. Componentes
- **`/src/app/components/Navigation.tsx`** - Navegación optimizada
  - Botones táctiles (44px mínimo)
  - Menú móvil mejorado
  - Aria-labels para accesibilidad

- **`/src/components/MobileTableWrapper.tsx`** - Wrapper para tablas
  ```tsx
  <MobileTableWrapper>
    <table>...</table>
  </MobileTableWrapper>
  ```

- **`/src/components/ResponsiveCard.tsx`** - Card responsive
  ```tsx
  <ResponsiveCard title="Título" padding="md">
    Contenido
  </ResponsiveCard>
  ```

- **`/src/components/ResponsiveButton.tsx`** - Botón responsive
  ```tsx
  <ResponsiveButton variant="primary" size="md" fullWidth>
    Texto
  </ResponsiveButton>
  ```

### 3. Layout Principal
- **`/src/app/layout.tsx`** - Configuración global
  - Import de `mobile-overrides.css`
  - Meta viewport correcto
  - viewport-fit=cover para iOS

### 4. Páginas Actualizadas
- **`/src/app/login/page.tsx`** - Login optimizado
  - Inputs con text-base (≥16px)
  - Botones táctiles (48px)
  - Cards legibles en móvil

---

## 🎨 Sistema de Diseño Móvil

### Breakpoints
```css
/* Solo móvil/tablet */
@media (max-width: 768px) { ... }

/* Pointer táctil */
@media (pointer: coarse) { ... }
```

### Espaciado
```css
--c360-space: 16px;         /* Padding lateral estándar */
--c360-space-sm: 12px;      /* Spacing pequeño */
--c360-touch-target: 44px;  /* Área táctil mínima */
```

### Tipografía
| Elemento | Móvil | Desktop |
|----------|-------|---------|
| h1 | 24-32px | 32-48px |
| h2 | 20-26px | 26-36px |
| h3 | 18-22px | 22-28px |
| p, li | 16px | 16-18px |
| input | 16px+ | 16px+ |

### Colores
*Sin cambios - se mantienen colores del sistema*

---

## 🛠️ Utilidades Tailwind Responsive

### Ejemplos de Uso

#### Padding Responsive
```tsx
<div className="px-4 md:px-6 lg:px-8">
  {/* 16px móvil, 24px tablet, 32px desktop */}
</div>
```

#### Grid Stack Vertical
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 col móvil, 2 cols tablet, 3 cols desktop */}
</div>
```

#### Tipografía
```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  {/* Tamaño crece con viewport */}
</h1>
```

#### Botones Táctiles
```tsx
<button className="px-4 py-3 min-h-[48px] text-base">
  {/* Mínimo 48px de alto, fuente legible */}
</button>
```

#### Ocultar en Móvil
```tsx
<div className="hidden md:block">
  {/* Solo visible en desktop */}
</div>

<div className="md:hidden">
  {/* Solo visible en móvil */}
</div>
```

---

## 📋 Checklist de Implementación

### Para cada página nueva:

#### 1️⃣ **Layout**
- [ ] Padding lateral responsive: `px-4 md:px-6 lg:px-8`
- [ ] Grids apilados: `grid-cols-1 md:grid-cols-2`
- [ ] Flex columnas: `flex-col md:flex-row`
- [ ] Max-width: `max-w-6xl mx-auto`

#### 2️⃣ **Tipografía**
- [ ] Headings responsive: `text-2xl md:text-3xl`
- [ ] Inputs ≥16px: `text-base`
- [ ] Line-height: `leading-relaxed`
- [ ] Spacing: `space-y-4 md:space-y-6`

#### 3️⃣ **Botones**
- [ ] Min-height: `min-h-[44px]` o `min-h-[48px]`
- [ ] Padding: `px-4 py-3`
- [ ] Full-width móvil: `w-full md:w-auto`
- [ ] Fuente legible: `text-base`

#### 4️⃣ **Tablas**
- [ ] Wrapper: `<MobileTableWrapper>`
- [ ] Min-width: Tabla debe tener `min-w-[640px]`
- [ ] Padding reducido: `px-2 py-2 md:px-4 md:py-3`

#### 5️⃣ **Formularios**
- [ ] Labels arriba: `block mb-2`
- [ ] Inputs 100%: `w-full`
- [ ] Spacing: `space-y-4`
- [ ] Validation visible

#### 6️⃣ **Modales**
- [ ] Padding: `p-4 md:p-6`
- [ ] Max-height: `max-h-[90vh]`
- [ ] Scroll: `overflow-y-auto`
- [ ] Botón cerrar táctil

---

## 🚀 Componentes Reutilizables

### MobileTableWrapper
```tsx
import MobileTableWrapper from '@/components/MobileTableWrapper'

<MobileTableWrapper>
  <table className="min-w-[640px]">
    <thead>...</thead>
    <tbody>...</tbody>
  </table>
</MobileTableWrapper>
```

### ResponsiveCard
```tsx
import ResponsiveCard from '@/components/ResponsiveCard'

<ResponsiveCard
  title="Título"
  subtitle="Subtítulo"
  padding="md"  // sm | md | lg
  shadow={true}
>
  <p>Contenido del card</p>
</ResponsiveCard>
```

### ResponsiveButton
```tsx
import ResponsiveButton from '@/components/ResponsiveButton'

<ResponsiveButton
  variant="primary"  // primary | secondary | outline | ghost | danger
  size="md"          // sm | md | lg
  fullWidth={true}
  loading={isLoading}
  onClick={handleClick}
>
  Guardar
</ResponsiveButton>
```

---

## 📱 Testing

### Chrome DevTools
1. F12 → Toggle Device Toolbar (Ctrl+Shift+M)
2. Seleccionar dispositivo: iPhone 12, Pixel 5, iPad
3. Throttling: 3G/4G
4. Lighthouse móvil

### Dispositivos Reales
- **iOS**: iPhone SE, 12, 14 Pro
- **Android**: Pixel, Samsung Galaxy
- **Tablet**: iPad Mini, iPad Air

### Métricas
- Performance: >85
- Accessibility: >90
- Touch targets: 100% ≥44px
- Font size inputs: 100% ≥16px

---

## ⚠️ Problemas Comunes

### Layout
- ❌ Scroll horizontal no deseado
  - ✅ Usar `overflow-x: hidden` en body
  - ✅ Revisar elementos con `100vw`

- ❌ Texto que se sale
  - ✅ Añadir `break-words` o `truncate`

- ❌ Padding insuficiente
  - ✅ Mínimo 16px lateral en móvil

### Interacción
- ❌ Botones pequeños
  - ✅ Min-height 44px siempre

- ❌ Zoom en inputs
  - ✅ Font-size ≥16px

- ❌ Hover-only
  - ✅ Añadir alternativa táctil

### Performance
- ❌ Imágenes grandes
  - ✅ Next/Image con sizes
  - ✅ Lazy loading

- ❌ JS bloqueante
  - ✅ Defer/async scripts
  - ✅ Code splitting

---

## 🔧 Debugging

### CSS no aplica
1. Verificar import en `layout.tsx`
2. Verificar orden (mobile-overrides.css después de globals.css)
3. Usar `!important` si necesario en mobile-overrides

### Tailwind no funciona
1. Verificar breakpoint correcto: `md:` (≥768px)
2. Purge/JIT: reiniciar dev server
3. Conflicto con CSS custom: usar `@layer utilities`

### Safe areas iOS
```css
/* En mobile-overrides.css */
.c360-sticky-cta {
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
```

---

## 📚 Recursos

### Documentación
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [Web.dev Mobile](https://web.dev/mobile/)

### Tools
- [Responsively App](https://responsively.app/) - Multi-device preview
- [BrowserStack](https://www.browserstack.com/) - Real device testing
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Automated testing

### Guidelines
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://material.io/design)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

## ✨ Conclusión

Todos los cambios son **aditivos** y **no-destructivos**:
- Desktop (≥1024px) permanece intacto
- Móvil (≤768px) optimizado
- Tablet (769-1023px) usa mix de estilos

**No hay cambios en:**
- Estructura de páginas
- Contenido
- Funcionalidad
- Rutas
- Lógica de negocio

**Solo cambios en:**
- CSS responsive
- Utilidades Tailwind
- Componentes UI
- Meta tags
