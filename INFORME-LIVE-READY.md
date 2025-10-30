# 📊 Auditoría "Live Ready" — Custodia360 (sin Stripe)

**Fecha:** martes, 21 de octubre de 2025, 19:28:53
**Dominio lógico:** https://www.custodia360.es

## 🔧 Resumen Ejecutivo

| Área | Estado | Nota |
|------|--------|------|
| Variables entorno | ✅ | 7/7 configuradas |
| Supabase (tablas) | ✅ | 10/10 presentes |
| Resend (plantillas/dominio) | ✅ | Dominio: verified |
| Automatizaciones internas | ✅ | 3/3 detectadas |
| Onboarding/Quiz (endpoints) | ✅ | 4/4 presentes |
| Email events (webhook) | ⚠️ | 0 eventos |

## ✅ Detalles OK

- Variables de entorno: 7/7 configuradas
- Supabase: 10/10 tablas core presentes
- Plantillas: 13/13 presentes
- email_events: null eventos registrados
- Resend: dominio custodia360.es verificado
- Automatizaciones: 3/3 detectadas
- Endpoints críticos: 4 presentes

## 📬 Resend

- **API Key:** Configurada ✅
- **Dominio verificado:** Sí ✅
- **Detalles del dominio:**
  - Nombre: custodia360.es
  - Estado: verified
  - Región: eu-west-1
- **Plantillas encontradas:** 13/13

## 🗃️ Supabase

- **Tablas core presentes:** Sí ✅
- **Conteos por tabla:**
  - entities: 1 registros
  - entity_people: 0 registros
  - family_children: 0 registros
  - entity_compliance: 0 registros
  - entity_invite_tokens: 0 registros
  - miniquiz_attempts: 0 registros
  - message_jobs: 2 registros
  - message_templates: 13 registros
  - email_events: 0 registros
  - subscriptions: 0 registros
- **Tokens activos (entity_invite_tokens):** 0
- **message_jobs (últimos 7 días):**
  - Encolados (queued): 2
  - Procesando (processing): 0
  - Enviados (sent): 0
  - Fallidos (failed): 0
- **email_events (últimos 30 días):** 0
  - ⚠️ Activar webhook Resend en producción

## 🔁 Automatizaciones (sin Stripe)

- **mailer-dispatch:** Detectado ✅
- **compliance-guard:** Detectado ✅
- **onboarding-guard:** Detectado ✅
- **Observaciones:** Automatizaciones detectadas mediante análisis de configuración.

## 🧪 Onboarding & Quiz

- **/api/onboarding/resolve:** Encontrado ✅
- **/api/onboarding/submit:** Encontrado ✅
- **/api/quiz/start:** Encontrado ✅
- **/api/quiz/submit:** Encontrado ✅
- **/onboarding/[token]:** Página SSR presente ✅

## 🚀 Conclusión

**Estado general (sin Stripe):** Listo

**Acciones recomendadas (ordenadas):**

1) ✅ Sistema listo para producción (sin Stripe)
2) ⚠️ Considerar activar webhook Resend para trazabilidad de emails (opcional)

## 📝 Anexos

**Variables de entorno detectadas:**

- APP_BASE_URL: ✅
- NEXT_PUBLIC_APP_BASE_URL: ✅
- NEXT_PUBLIC_SUPABASE_URL: ✅
- SUPABASE_SERVICE_ROLE_KEY: ✅
- RESEND_API_KEY: ✅
- NOTIFY_EMAIL_FROM: ✅
- APP_TIMEZONE: ✅

**Nota:** Stripe está fuera del alcance de este informe.

---
*Auditoría generada automáticamente el martes, 21 de octubre de 2025, 19:28:53*
