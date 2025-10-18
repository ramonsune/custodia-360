# 📨 Email System - Code Examples

Ejemplos de cómo integrar el sistema de emails en los flujos existentes de Custodia360.

---

## 1️⃣ CONTRATACIÓN PAGADA (Stripe Webhook)

### Archivo: `/app/api/webhooks/stripe/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // EVENTO: Pago confirmado
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const entityId = session.metadata.entity_id;
    const contratanteEmail = session.customer_details.email;
    const contratanteNombre = session.customer_details.name;

    // 1. Marcar entidad como pagada
    await supabase
      .from("entidades")
      .update({ pago_confirmado: true })
      .eq("id", entityId);

    // 2. Obtener datos de la entidad
    const { data: entity } = await supabase
      .from("entidades")
      .select("*")
      .eq("id", entityId)
      .single();

    // 3. ENVIAR EMAIL AL CONTRATANTE
    await fetch(`${process.env.APP_BASE_URL}/api/messages/enqueue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityId,
        templateSlug: "confirmacion-contratante",
        recipients: [{ email: contratanteEmail }],
        context: {
          nombre: contratanteNombre,
          entidad: entity.nombre,
          plan_contratado: `Plan ${entity.plan_cantidad || 100}`,
        },
        idempotencyKey: `confirmacion-contratante-${entityId}`,
      }),
    });

    // 4. Si ya existe delegado, enviar bienvenida
    const { data: delegado } = await supabase
      .from("delegados")
      .select("*")
      .eq("entity_id", entityId)
      .eq("tipo", "principal")
      .single();

    if (delegado && delegado.email) {
      // Crear usuario en Supabase Auth (si no existe)
      const temporalPassword = "Custodia360!"; // O generar aleatorio

      const { data: authUser } = await supabase.auth.admin.createUser({
        email: delegado.email,
        password: temporalPassword,
        email_confirm: true,
      });

      // Vincular user_id
      if (authUser.user) {
        await supabase
          .from("delegados")
          .update({ user_id: authUser.user.id })
          .eq("id", delegado.id);
      }

      // ENVIAR EMAIL AL DELEGADO
      await fetch(`${process.env.APP_BASE_URL}/api/messages/enqueue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityId,
          templateSlug: "welcome-delegado",
          recipients: [{ email: delegado.email }],
          context: {
            nombre: `${delegado.nombre} ${delegado.apellidos || ""}`,
            entidad: entity.nombre,
            credenciales_usuario: delegado.email,
            credenciales_password: temporalPassword,
          },
          idempotencyKey: `welcome-delegado-${entityId}`,
        }),
      });
    }
  }

  // EVENTO: Factura pagada
  if (event.type === "invoice.paid") {
    const invoice = event.data.object;
    const entityId = invoice.metadata.entity_id;

    // Obtener entidad
    const { data: entity } = await supabase
      .from("entidades")
      .select("*")
      .eq("id", entityId)
      .single();

    // Si tiene email de administración
    if (entity.email_administracion) {
      // ENVIAR FACTURA A ADMINISTRACIÓN
      await fetch(`${process.env.APP_BASE_URL}/api/messages/enqueue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityId,
          templateSlug: "factura-administracion",
          recipients: [{ email: entity.email_administracion }],
          context: {
            entidad: entity.nombre,
            factura_url: invoice.hosted_invoice_url, // URL de Stripe
          },
          idempotencyKey: `factura-${invoice.id}`,
        }),
      });
    }
  }

  return NextResponse.json({ received: true });
}
```

---

## 2️⃣ GENERAR LINK DE ONBOARDING

### Archivo: `/panel/delegado/configuracion` o API endpoint

```typescript
// Al generar/renovar token de onboarding
async function generateOnboardingLink() {
  const supabase = createBrowserClient();
  const session = getUserSession(); // Tu función

  // 1. Generar token único
  const token = crypto.randomUUID();
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() + 30);

  // 2. Guardar token en entidad
  await supabase
    .from("entidades")
    .update({
      onboarding_token: token,
      onboarding_expires_at: fechaLimite.toISOString(),
    })
    .eq("id", session.entityId);

  // 3. Obtener personas con email (opcional: solo pendientes)
  const { data: personas } = await supabase
    .from("delegados")
    .select("*")
    .eq("entity_id", session.entityId)
    .not("email", "is", null);

  if (!personas || personas.length === 0) {
    return { success: true, link: `https://www.custodia360.es/i/${token}` };
  }

  // 4. Opción A: Enviar masivamente (confirmar con delegado)
  const enviarMasivo = confirm(
    `¿Enviar invitación a ${personas.length} personas?`
  );

  if (enviarMasivo) {
    // ENCOLAR EMAILS
    await fetch("/api/messages/enqueue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityId: session.entityId,
        templateSlug: "onboarding-invite",
        recipients: personas.map((p) => ({
          email: p.email,
          personId: p.id,
        })),
        context: {
          token,
          entidad: session.entidad,
          fecha_limite: fechaLimite.toLocaleDateString("es-ES"),
        },
        // Idempotency key único por generación
        idempotencyKey: `onb-batch-${session.entityId}-${token}`,
      }),
    });

    toast.success(`Invitaciones enviadas a ${personas.length} personas`);
  }

  return { success: true, link: `https://www.custodia360.es/i/${token}` };
}
```

---

## 3️⃣ RESULTADO DEL TEST

### Archivo: `/app/api/public/onboarding/submit/route.ts`

```typescript
export async function POST(req: NextRequest) {
  const { token, testAnswers, personId } = await req.json();
  const supabase = createClient(/* ... */);

  // 1. Calcular puntuación
  const totalQuestions = 10;
  const correctAnswers = calculateScore(testAnswers);
  const testPassed = correctAnswers >= 7;

  // 2. Guardar resultado
  await supabase
    .from("onboarding_completions")
    .insert({
      person_id: personId,
      test_score: correctAnswers,
      test_passed: testPassed,
    });

  // 3. Obtener persona
  const { data: person } = await supabase
    .from("delegados")
    .select("*, entidad:entidades(*)")
    .eq("id", personId)
    .single();

  // 4. ENVIAR RESULTADO POR EMAIL
  if (person && person.email) {
    await fetch(`${process.env.APP_BASE_URL}/api/messages/enqueue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityId: person.entity_id,
        templateSlug: "resultado-test",
        recipients: [{ email: person.email, personId }],
        context: {
          nombre: person.nombre,
          resultado: testPassed ? "APROBADO ✅" : "PENDIENTE ⏳",
          aciertos: correctAnswers,
          total: totalQuestions,
          siguiente_paso: testPassed
            ? "Has completado la formación. Ya puedes acceder al panel."
            : "Revisa el material de estudio y vuelve a intentarlo. Necesitas 7/10 para aprobar.",
        },
        idempotencyKey: `test-result-${personId}`,
      }),
    });
  }

  return NextResponse.json({
    success: true,
    passed: testPassed,
    score: correctAnswers,
  });
}
```

---

## 4️⃣ COMPARTIR DOCUMENTO

### Archivo: `/panel/delegado/biblioteca` (al compartir)

```typescript
async function shareDocument(documentId: string, recipientEmail: string) {
  const supabase = createBrowserClient();
  const session = getUserSession();

  // 1. Obtener documento
  const { data: doc } = await supabase
    .from("documentos")
    .select("*")
    .eq("id", documentId)
    .single();

  // 2. Crear URL firmada (10 minutos)
  const { data: signedUrl } = await supabase.storage
    .from("documentos")
    .createSignedUrl(doc.storage_path, 600); // 10 min

  // 3. Crear registro de compartido
  const { data: share } = await supabase
    .from("document_shares")
    .insert({
      document_id: documentId,
      entity_id: session.entityId,
      shared_with_email: recipientEmail,
      created_by: session.id,
    })
    .select()
    .single();

  // 4. ENVIAR EMAIL
  await fetch("/api/messages/enqueue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      entityId: session.entityId,
      templateSlug: "share-doc",
      recipients: [{ email: recipientEmail }],
      context: {
        nombre: recipientEmail.split("@")[0], // O nombre real si está disponible
        doc_nombre: doc.nombre,
        doc_url: signedUrl.signedUrl,
      },
      idempotencyKey: `share-${share.id}`,
    }),
  });

  toast.success("Documento compartido y email enviado");
}
```

---

## 5️⃣ INFORME DE INSPECCIÓN

### Archivo: `/panel/delegado/informes` (al generar)

```typescript
async function generateInspectionReport(save: boolean = false) {
  const supabase = createBrowserClient();
  const session = getUserSession();

  // 1. Generar PDF del informe
  const pdfBlob = await generatePDF(/* datos del informe */);

  if (save) {
    // 2. Guardar en storage
    const fileName = `informe-${Date.now()}.pdf`;
    const { data: uploadData } = await supabase.storage
      .from("informes")
      .upload(`${session.entityId}/${fileName}`, pdfBlob);

    // 3. Crear registro
    const { data: informe } = await supabase
      .from("informes")
      .insert({
        entity_id: session.entityId,
        tipo: "inspeccion",
        storage_path: uploadData.path,
        created_by: session.id,
      })
      .select()
      .single();

    // 4. Crear URL firmada
    const { data: signedUrl } = await supabase.storage
      .from("informes")
      .createSignedUrl(uploadData.path, 600);

    // 5. ENVIAR AL DELEGADO
    await fetch("/api/messages/enqueue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityId: session.entityId,
        templateSlug: "inspeccion-report",
        recipients: [{ email: session.email }],
        context: {
          nombre: session.nombre,
          informe_url: signedUrl.signedUrl,
        },
        idempotencyKey: `informe-${informe.id}`,
      }),
    });

    toast.success("Informe guardado y enviado por email");
  }

  // Devolver blob para descarga directa
  return pdfBlob;
}
```

---

## 6️⃣ RECORDATORIO MANUAL (Delegado)

### Archivo: `/panel/delegado/configuracion`

```typescript
async function sendManualReminder(personIds: string[]) {
  const supabase = createBrowserClient();
  const session = getUserSession();

  // 1. Obtener personas
  const { data: personas } = await supabase
    .from("delegados")
    .select("*")
    .in("id", personIds)
    .not("email", "is", null);

  if (!personas || personas.length === 0) {
    toast.error("No hay personas con email");
    return;
  }

  // 2. Obtener entidad (para token)
  const { data: entity } = await supabase
    .from("entidades")
    .select("*")
    .eq("id", session.entityId)
    .single();

  // 3. Calcular fecha límite
  const fechaContratacion = new Date(entity.fecha_contratacion);
  const fechaLimite = new Date(fechaContratacion);
  fechaLimite.setDate(fechaLimite.getDate() + 30);

  // 4. ENCOLAR RECORDATORIOS
  for (const persona of personas) {
    await fetch("/api/messages/enqueue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityId: session.entityId,
        templateSlug: "rec-30d-contacto",
        recipients: [{ email: persona.email, personId: persona.id }],
        context: {
          token: entity.onboarding_token,
          nombre: persona.nombre,
          entidad: entity.nombre,
          fecha_limite: fechaLimite.toLocaleDateString("es-ES"),
          pendiente_list: "Datos personales, Documentación, Test",
        },
        idempotencyKey: `manual-rec-${session.entityId}-${persona.id}-${Date.now()}`,
      }),
    });
  }

  toast.success(`Recordatorios enviados a ${personas.length} personas`);
}
```

---

## 7️⃣ REENVIAR FALLIDOS (UI Delegado)

### Archivo: `/panel/delegado/mensajes`

```typescript
async function retryFailedRecipients(jobId: number) {
  const supabase = createBrowserClient();
  const session = getUserSession();

  // 1. Obtener job original
  const { data: job } = await supabase
    .from("message_jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  // 2. Obtener recipients fallidos
  const { data: failedRecipients } = await supabase
    .from("message_recipients")
    .select("*")
    .eq("job_id", jobId)
    .eq("status", "error");

  if (!failedRecipients || failedRecipients.length === 0) {
    toast.info("No hay destinatarios fallidos");
    return;
  }

  // 3. CREAR NUEVO JOB (sin idempotency key para permitir duplicado)
  await fetch("/api/messages/enqueue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      entityId: session.entityId,
      templateSlug: job.template_slug,
      recipients: failedRecipients.map((r) => ({
        email: r.to_email,
        personId: r.person_id,
      })),
      context: job.context,
      // NO usar idempotencyKey para permitir reintento
    }),
  });

  toast.success(`Reencolados ${failedRecipients.length} destinatarios`);
}
```

---

## 8️⃣ EJECUTAR DISPATCHER MANUALMENTE

### Archivo: `/panel/delegado/mensajes` (botón admin)

```typescript
async function dispatchNow() {
  const session = getUserSession();

  // Solo admin o delegado principal
  if (session.tipo !== "admin" && session.rol !== "delegado_principal") {
    toast.error("No tienes permisos");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/messages/dispatch", {
      method: "POST",
    });

    const data = await response.json();

    if (data.success) {
      toast.success(
        `Procesados ${data.result.processed} jobs. Revisa el historial.`
      );
    } else {
      throw new Error(data.error);
    }
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
}
```

---

## 9️⃣ HELPER FUNCTIONS

### Archivo: `lib/email/helpers.ts`

```typescript
import { absoluteUrl } from "@/lib/url/base";

export function enqueueEmail({
  entityId,
  templateSlug,
  recipients,
  context,
  idempotencyKey,
}: {
  entityId: string;
  templateSlug: string;
  recipients: { email: string; personId?: string }[];
  context?: Record<string, any>;
  idempotencyKey?: string;
}) {
  return fetch(absoluteUrl("/api/messages/enqueue"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      entityId,
      templateSlug,
      recipients,
      context,
      idempotencyKey,
    }),
  });
}

export function formatFechaLimite(fechaContratacion: string): string {
  const fecha = new Date(fechaContratacion);
  fecha.setDate(fecha.getDate() + 30);
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
```

---

## 🔟 TESTING EXAMPLES

### Test en desarrollo local

```typescript
// En tu componente o página
async function testEmail() {
  await fetch("/api/messages/enqueue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      entityId: "YOUR_ENTITY_UUID",
      templateSlug: "onboarding-invite",
      recipients: [{ email: "tu-correo@test.com" }],
      context: {
        token: "TEST-TOKEN-123",
        nombre: "Usuario Test",
        entidad: "Entidad Test",
        fecha_limite: "31/01/2025",
      },
      idempotencyKey: `test-${Date.now()}`,
    }),
  });

  // Ejecutar dispatcher
  await fetch("/api/messages/dispatch", {
    method: "POST",
  });

  alert("Email de prueba encolado y despachado. Revisa tu inbox.");
}
```

---

**Usar estos ejemplos como base para integrar el sistema de emails en tu flujo existente. Ajustar según necesidades específicas.**
