# ✅ CHECKLIST DE SMOKE TESTS - Onboarding 1€ E2E

**Proyecto:** Custodia360
**Fecha:** 28 de octubre de 2025
**Objetivo:** Validar el flujo completo de onboarding con pago de 1€

---

## 📋 PRE-REQUISITOS

### 1. Variables de Entorno Configuradas
- [ ] `STRIPE_SECRET_KEY` (sk_live_...)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_...)
- [ ] `STRIPE_WEBHOOK_SECRET_LIVE` (whsec_...)
- [ ] `LIVE_MODE=true`
- [ ] `RESEND_API_KEY`
- [ ] `HOLDED_API_KEY` (opcional)
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

### 2. Dependencias Instaladas
```bash
cd custodia-360
bun add bcryptjs @types/bcryptjs
```

### 3. Schema SQL Ejecutado
- [ ] Copiar contenido de `scripts/sql/e2e-onboarding-schema.sql`
- [ ] Ejecutar en Supabase Dashboard → SQL Editor
- [ ] Verificar que se crearon las tablas:
  - `onboarding_process`
  - `audit_events`
  - `training_progress`

### 4. Webhook de Stripe Configurado
- [ ] URL: `https://www.custodia360.es/api/webhooks/stripe`
- [ ] Eventos seleccionados:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `charge.succeeded`
  - `payment_intent.payment_failed`
- [ ] Signing Secret copiado a Netlify

---

## 🧪 TEST 1: Formulario de Contratación

### Pasos:
1. [ ] Abrir navegador en https://www.custodia360.es/contratar
2. [ ] Verificar que el formulario se carga sin errores
3. [ ] Completar todos los campos:
   - [ ] Razón social: "Test Empresa SL"
   - [ ] CIF: "A12345678"
   - [ ] Email: `test+{timestamp}@example.com`
   - [ ] Teléfono: "+34 600 000 000"
   - [ ] Dirección completa
   - [ ] Contraseña: "TestPass123!"
   - [ ] Aceptar términos y condiciones
4. [ ] Click en "Contratar ahora (1,00 €)"

### Resultado Esperado:
- [ ] Redirección a Stripe Checkout
- [ ] URL contiene `checkout.stripe.com`
- [ ] Muestra "Onboarding Custodia360 - 1,00 EUR"

---

## 💳 TEST 2: Pago en Stripe

### Opción A: Tarjeta de Prueba (Test Mode)
**⚠️ Solo si LIVE_MODE=false**

- Número: `4242 4242 4242 4242`
- Fecha: Cualquier fecha futura
- CVC: Cualquier 3 dígitos
- ZIP: Cualquier 5 dígitos

### Opción B: Pago Real (LIVE Mode) - **RECOMENDADO**
**💰 Coste: 1,00 €**

1. [ ] Usar tarjeta real
2. [ ] Completar pago
3. [ ] Verificar cargo de 1€ en extracto bancario

### Resultado Esperado:
- [ ] Pago procesado exitosamente
- [ ] Redirección a `/contratar/success`
- [ ] Mensaje: "¡Pago Recibido!"

---

## 📧 TEST 3: Emails Recibidos

### Email 1: Cliente (Bienvenida)
- [ ] **Asunto:** "Bienvenido/a a Custodia360 — Acceso a Formación"
- [ ] **De:** noreply@custodia360.es
- [ ] **Para:** Email usado en formulario
- [ ] **Contenido incluye:**
  - [ ] Credenciales de acceso (email + contraseña temporal)
  - [ ] Link a https://www.custodia360.es/login
  - [ ] Instrucciones de formación (4 pasos)

### Email 2: Soporte (Notificación)
- [ ] **Asunto:** "[Custodia360] Nueva contratación 1€ — {Nombre Entidad}"
- [ ] **De:** noreply@custodia360.es
- [ ] **Para:** rsune@teamsml.com
- [ ] **Contenido incluye:**
  - [ ] Nombre de entidad
  - [ ] Email del cliente
  - [ ] Process ID (UUID)
  - [ ] Link a /admin/auditoria?processId={ID}

---

## 🗄️ TEST 4: Provisioning en Base de Datos

### Verificar en Supabase Dashboard:

#### Tabla `onboarding_process`:
- [ ] Nuevo registro creado
- [ ] `status = 'provisioned'`
- [ ] `email` correcto
- [ ] `entity_name` correcto
- [ ] `stripe_customer_id` presente
- [ ] `stripe_payment_intent_id` presente
- [ ] `stripe_checkout_session_id` presente
- [ ] `entity_id` (UUID) presente
- [ ] `delegate_user_id` (UUID) presente

#### Tabla `audit_events`:
- [ ] Múltiples eventos registrados para el process_id:
  - [ ] `checkout.created`
  - [ ] `webhook.received`
  - [ ] `payment.confirmed`
  - [ ] `entity.created`
  - [ ] `user.created`
  - [ ] `role.granted`
  - [ ] `emails.sent`
  - [ ] `holded.sync.ok` (si Holded configurado)

#### Tabla `entities`:
- [ ] Nueva entidad creada con `entity_id`
- [ ] Nombre correcto
- [ ] Email correcto
- [ ] `status = 'active'`

#### Tabla `entity_user_roles`:
- [ ] Nuevo registro creado
- [ ] `user_id` coincide con `delegate_user_id`
- [ ] `entity_id` correcto
- [ ] `role = 'FORMACION'`

#### Tabla `training_progress`:
- [ ] Nuevo registro creado
- [ ] `user_id` correcto
- [ ] `entity_id` correcto
- [ ] `steps_completed = 0`
- [ ] `total_steps = 5`
- [ ] `is_completed = false`

---

## 🔐 TEST 5: Login con Credenciales

1. [ ] Ir a https://www.custodia360.es/login
2. [ ] Ingresar email usado en formulario
3. [ ] Ingresar contraseña temporal del email
4. [ ] Click en "Acceder"

### Resultado Esperado:
- [ ] Login exitoso
- [ ] Redirección automática a `/bienvenida-formacion`
- [ ] Mensaje de bienvenida con nombre del delegado

---

## 📚 TEST 6: Flujo de Formación

### Página de Bienvenida Formación:
1. [ ] Cargar https://www.custodia360.es/bienvenida-formacion
2. [ ] Verificar mensaje de bienvenida
3. [ ] Verificar 4 pasos mostrados
4. [ ] Click en "Comenzar mi Formación LOPIVI →"

### Módulos de Formación:
1. [ ] Cargar /panel/delegado/formacion
2. [ ] Verificar 6 módulos listados
3. [ ] Leer Módulo 1 (al menos parcialmente)
4. [ ] Click en "Marcar como Completado"
5. [ ] Verificar que Módulo 2 se desbloquea
6. [ ] Repetir para los 6 módulos

### Resultado Esperado:
- [ ] Todos los módulos se completan
- [ ] Progreso: "6 de 6 módulos completados"
- [ ] Pantalla de felicitaciones aparece
- [ ] Botones visibles:
  - [ ] "Descargar Todos los Módulos (PDF)"
  - [ ] "Ir al Test de Evaluación"

---

## 📝 TEST 7: Test de Evaluación

1. [ ] Click en "Ir al Test de Evaluación"
2. [ ] Cargar /panel/delegado/formacion/test
3. [ ] Click en "Comenzar Test"
4. [ ] Responder 20 preguntas

### Resultado Esperado (si aprobado con ≥75%):
- [ ] Pantalla de resultado: "¡Enhorabuena!"
- [ ] Porcentaje correcto mostrado
- [ ] Botón "Obtener Certificado" visible
- [ ] Click en "Obtener Certificado"

---

## 🎓 TEST 8: Certificado Digital

1. [ ] Cargar /panel/delegado/formacion/certificado
2. [ ] Click en "Generar Certificado"

### Resultado Esperado:
- [ ] Certificado visual se muestra
- [ ] Incluye:
  - [ ] Nombre del delegado
  - [ ] Nombre de la entidad
  - [ ] Fecha de emisión
  - [ ] Código único (CERT-...)
  - [ ] Firma de "Nando Del Olmo"
- [ ] Botones disponibles:
  - [ ] "Descargar Certificado (PNG)"
  - [ ] "Ir al Panel del Delegado"
- [ ] Click en "Descargar Certificado" → archivo PNG descargado

---

## 🚀 TEST 9: Promoción Automática a DELEGADO

### Verificar en Base de Datos:

#### Tabla `entity_user_roles`:
- [ ] Registro actualizado
- [ ] `role = 'DELEGADO'` (ya no 'FORMACION')

#### Tabla `training_progress`:
- [ ] `is_completed = true`
- [ ] `steps_completed = 5`

#### Tabla `onboarding_process`:
- [ ] `status = 'trained'`

#### Tabla `audit_events`:
- [ ] Eventos adicionales:
  - [ ] `training.completed`
  - [ ] `role.promoted`

---

## 📊 TEST 10: Panel de Auditoría (Admin)

1. [ ] Login como admin: `rsune@teamsml.com`
2. [ ] Ir a https://www.custodia360.es/admin/auditoria
3. [ ] Buscar proceso por email usado en el test

### Resultado Esperado:
- [ ] Proceso visible en lista
- [ ] Click en proceso → Timeline se expande
- [ ] Timeline muestra todos los eventos en orden cronológico:
  - [ ] checkout.created
  - [ ] webhook.received
  - [ ] payment.confirmed
  - [ ] entity.created
  - [ ] user.created
  - [ ] role.granted
  - [ ] emails.sent
  - [ ] holded.sync.ok (si configurado)
  - [ ] training.completed
  - [ ] role.promoted
- [ ] Cada evento muestra:
  - [ ] Tipo de evento
  - [ ] Nivel (INFO/WARN/ERROR)
  - [ ] Timestamp
  - [ ] Payload (expandible)

---

## 🏢 TEST 11: Widget Altas Recientes

1. [ ] Estando como admin en /dashboard-custodia360
2. [ ] Verificar widget "Altas Recientes (Onboarding 1€)"

### Resultado Esperado:
- [ ] Nuevo proceso aparece en la lista
- [ ] Muestra:
  - [ ] Nombre de entidad
  - [ ] Email
  - [ ] Estado (badge coloreado)
  - [ ] Tiempo relativo ("Hace 5m")
- [ ] Click en proceso → Redirige a /admin/auditoria?processId={ID}

---

## 💼 TEST 12: Holded (Si API configurada)

### Verificar en Holded Dashboard:

#### Contacto/Empresa:
- [ ] Login en https://app.holded.com
- [ ] Ir a Contactos
- [ ] Buscar por nombre de entidad
- [ ] Verificar:
  - [ ] Nombre correcto
  - [ ] Email correcto
  - [ ] CIF correcto (si se proporcionó)
  - [ ] Teléfono correcto

#### Factura:
- [ ] Ir a Documentos → Facturas
- [ ] Buscar factura más reciente
- [ ] Verificar:
  - [ ] Cliente: Nombre de entidad
  - [ ] Importe: 1,21 € (1€ + 21% IVA)
  - [ ] Concepto: "Alta en Custodia360"
  - [ ] Referencia: Payment Intent ID o Charge ID

### Verificar en Base de Datos:

#### Tabla `onboarding_process`:
- [ ] `holded_contact_id` presente
- [ ] `holded_invoice_id` presente

---

## 🎯 TEST 13: Acceso al Dashboard Delegado

1. [ ] Click en "Ir al Panel del Delegado" (desde certificado)
2. [ ] O navegar a https://www.custodia360.es/dashboard-delegado

### Resultado Esperado:
- [ ] Página carga sin errores
- [ ] Muestra nombre del delegado
- [ ] Muestra nombre de la entidad
- [ ] Panel funcional completo con todas las secciones

---

## 📋 RESUMEN DE RESULTADOS

### Test General:
- [ ] **Total tests ejecutados:** 13
- [ ] **Tests pasados:** ___
- [ ] **Tests fallados:** ___

### Tiempo Total del Flujo E2E:
- Inicio (formulario) hasta certificado: _______ minutos

### Errores Encontrados:
1. _______________________________
2. _______________________________
3. _______________________________

### Notas Adicionales:
_______________________________
_______________________________
_______________________________

---

## 🚨 SI ALGO FALLA

### Webhook no recibido:
1. Verificar en Stripe Dashboard → Webhooks → Eventos
2. Revisar logs de Netlify Functions
3. Comprobar Signing Secret en variables de entorno

### Emails no enviados:
1. Verificar RESEND_API_KEY válida
2. Comprobar dominio verificado en Resend
3. Revisar logs de Netlify Functions

### Holded no sincroniza:
1. Verificar HOLDED_API_KEY válida
2. Comprobar permisos de API (contactos + invoices)
3. Intentar resync manual: `/api/holded/resync?process_id={ID}`

### Usuario no se crea:
1. Verificar SUPABASE_SERVICE_ROLE_KEY configurada
2. Revisar logs de Netlify Functions
3. Comprobar que email no existe previamente en Supabase Auth

---

**Ejecutado por:** _________________
**Fecha:** _________________
**Entorno:** Producción (LIVE MODE)
**Estado Final:** ✅ APROBADO / ❌ FALLADO

---

*Guardar este checklist completado como: `.same/E2E_1EUR_SMOKE_RESULTS.md`*
