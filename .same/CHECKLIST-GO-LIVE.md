# ✅ CHECKLIST GO-LIVE - 2 DÍAS

**Marca con `[x]` conforme completes cada item**

---

## 🔥 DÍA 1 - VALIDACIONES (8h)

### BLOQUE 1: STRIPE PRODUCCIÓN (2h) ⏰ 09:00-11:00

- [ ] Activar cuenta Stripe producción
- [ ] Completar KYC si es necesario
- [ ] Obtener claves producción (sk_live_***, pk_live_***)
- [ ] Crear productos en Stripe:
  - [ ] Plan 50 (19€/mes)
  - [ ] Plan 100 (29€/mes)
  - [ ] Plan 250 (49€/mes)
  - [ ] Plan 500 (89€/mes)
  - [ ] Plan 1000 (149€/mes)
- [ ] Copiar Price IDs
- [ ] Actualizar `lib/pricing.ts` con Price IDs producción
- [ ] Actualizar variables en Netlify:
  - [ ] STRIPE_SECRET_KEY
  - [ ] STRIPE_PUBLISHABLE_KEY
- [ ] Configurar webhook producción (https://www.custodia360.es/api/stripe/webhook)
- [ ] Actualizar STRIPE_WEBHOOK_SECRET en Netlify
- [ ] Hacer pago de prueba con 1€
- [ ] Verificar webhook recibido
- [ ] Verificar suscripción creada en DB

**Estado:** ⬜ PENDIENTE | ✅ COMPLETADO

---

### BLOQUE 2: HOLDED (3h) ⏰ 11:00-14:00

- [ ] Login en Holded
- [ ] Verificar API Key activa
- [ ] Verificar Product IDs en Holded
- [ ] Test crear contacto (script o Postman):
  ```bash
  curl -X POST https://www.custodia360.es/api/holded/create-contact \
    -H "Content-Type: application/json" \
    -d '{"nombre":"Test","email":"test@test.com","nif":"12345678A"}'
  ```
- [ ] Verificar contacto creado en Holded
- [ ] Test crear factura:
  ```bash
  curl -X POST https://www.custodia360.es/api/holded/create-invoice \
    -H "Content-Type: application/json" \
    -d '{"contact_id":"...","product_id":"677c92f50802a90d980fc05e","amount":19}'
  ```
- [ ] Verificar factura creada en Holded
- [ ] Test flujo completo: Pago Stripe → Webhook → Holded
- [ ] Verificar factura automática generada
- [ ] Documentar errores encontrados
- [ ] Plan B si falla (facturación manual)

**Estado:** ⬜ PENDIENTE | ✅ COMPLETADO

---

### BLOQUE 3: VALIDACIÓN ZOD (3h) ⏰ 15:00-18:00

- [ ] Instalar Zod: `npm install zod`
- [ ] Crear `lib/validations/payment.ts`
- [ ] Crear `lib/validations/onboarding.ts`
- [ ] Crear `lib/validations/cases.ts`
- [ ] Validar endpoints:
  - [ ] `/api/stripe/webhook`
  - [ ] `/api/onboarding/submit`
  - [ ] `/api/delegado/casos/create`
  - [ ] `/api/quiz/submit`
  - [ ] `/api/contratar`
- [ ] Try-catch en todos los endpoints críticos
- [ ] Respuestas consistentes `{ success, data, error }`
- [ ] Test cada endpoint validado
- [ ] Commit y push

**Estado:** ⬜ PENDIENTE | ✅ COMPLETADO

---

## 🔥 DÍA 2 - MONITORING Y QA (8h)

### BLOQUE 1: MONITORING (2h) ⏰ 09:00-11:00

**Opción A: Sentry (Recomendado)**

- [ ] Crear cuenta en sentry.io
- [ ] Crear proyecto "Custodia360"
- [ ] Instalar: `npm install @sentry/nextjs`
- [ ] Configurar: `npx @sentry/wizard@latest -i nextjs`
- [ ] Obtener DSN
- [ ] Actualizar NEXT_PUBLIC_SENTRY_DSN en Netlify
- [ ] Configurar alertas:
  - [ ] Email si error rate > 1%
  - [ ] Email si pago falla
- [ ] Test: Forzar error y verificar en Sentry
- [ ] Verificar alerta recibida

**Opción B: Logging Mejorado (Si no da tiempo)**

- [ ] Crear `lib/logger.ts`
- [ ] Agregar logging a endpoints críticos
- [ ] Crear `/api/admin/logs`

**Estado:** ⬜ PENDIENTE | ✅ COMPLETADO

---

### BLOQUE 2: QA MANUAL (4h) ⏰ 11:00-15:00

#### FLUJO 1: Contratación (45 min)

- [ ] Ir a www.custodia360.es
- [ ] Clic "Contratar"
- [ ] Rellenar datos entidad
- [ ] Rellenar datos delegado
- [ ] Seleccionar Plan 50
- [ ] Pagar con tarjeta real (19€)
- [ ] Verificar redirección `/contratacion-exitosa`
- [ ] Verificar email recibido
- [ ] Verificar suscripción en Stripe
- [ ] Verificar factura en Holded
- [ ] Verificar datos en Supabase

#### FLUJO 2: Onboarding Delegado (60 min)

- [ ] Admin invita delegado
- [ ] Verificar email recibido
- [ ] Clic en link con token
- [ ] Seleccionar "Delegado Principal"
- [ ] Rellenar formulario
- [ ] Subir certificado antecedentes
- [ ] Completar quiz LOPIVI
- [ ] Aprobar (8/10 mínimo)
- [ ] Verificar certificado generado
- [ ] Verificar email bienvenida
- [ ] Login con credenciales
- [ ] Acceder `/dashboard-delegado`

#### FLUJO 3: Onboarding Personal (30 min)

- [ ] Admin invita personal
- [ ] Completar "Personal con Contacto"
- [ ] Completar quiz
- [ ] Verificar certificado
- [ ] Verificar acceso limitado

#### FLUJO 4: Gestión de Casos (45 min)

- [ ] Login como delegado
- [ ] Crear nuevo caso
- [ ] Tipo: sospecha_maltrato
- [ ] Prioridad: alta
- [ ] Verificar protocolo urgente
- [ ] Verificar email a admin
- [ ] Actualizar caso
- [ ] Agregar acciones
- [ ] Cerrar caso

#### FLUJO 5: Formación (30 min)

- [ ] Login como delegado
- [ ] Acceder a formación
- [ ] Iniciar test
- [ ] Completar 10 preguntas
- [ ] Aprobar
- [ ] Descargar certificado PDF

#### FLUJO 6: Comunicación (30 min)

- [ ] Delegado envía mensaje
- [ ] Verificar email enviado
- [ ] Compartir documento
- [ ] Verificar descarga

**Estado:** ⬜ PENDIENTE | ✅ COMPLETADO

---

### BLOQUE 3: CHECKLIST FINAL (2h) ⏰ 15:00-17:00

#### Seguridad

- [ ] Variables entorno en producción
- [ ] Stripe modo live
- [ ] Resend activo
- [ ] Holded validado
- [ ] RLS policies activas
- [ ] HTTPS activo
- [ ] Headers seguridad

#### Funcionalidad

- [ ] Login funciona
- [ ] Registro funciona
- [ ] Pagos funcionan
- [ ] Emails se envían
- [ ] PDFs se generan
- [ ] Webhooks funcionan
- [ ] Cron jobs OK

#### Contenido

- [ ] Sin "test" o "demo"
- [ ] Emails profesionales
- [ ] PDFs con branding
- [ ] FAQ actualizado
- [ ] Política privacidad
- [ ] Términos y condiciones

#### UX/UI

- [ ] Sin lorem ipsum
- [ ] Sin placeholder
- [ ] Responsive móvil
- [ ] Sin enlaces rotos
- [ ] Imágenes optimizadas

#### Legal

- [ ] Aviso legal
- [ ] RGPD compliant
- [ ] Cookies consent
- [ ] Términos servicio

#### Monitoring

- [ ] Sentry/Logging activo
- [ ] Alertas configuradas

#### Backup

- [ ] Backup Supabase activo
- [ ] Plan restore documentado

**Estado:** ⬜ PENDIENTE | ✅ COMPLETADO

---

## 🚀 DEPLOY FINAL

- [ ] Build local exitoso: `npm run build`
- [ ] Commit final: `git commit -m "Ready for production"`
- [ ] Push a main
- [ ] Verificar build Netlify OK
- [ ] Smoke test en www.custodia360.es
- [ ] Todos los flujos funcionan

**Estado:** ⬜ PENDIENTE | ✅ COMPLETADO

---

## ✅ RESULTADO

- [ ] **CUSTODIA360 LIVE EN PRODUCCIÓN** 🎉

---

**Inicio:** ___/___/___ a las ___:___
**Fin:** ___/___/___ a las ___:___
**Tiempo Total:** ___ horas
