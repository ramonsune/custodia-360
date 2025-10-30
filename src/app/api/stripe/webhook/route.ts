import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { holdedClient } from '@/lib/holded-client'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verificar el webhook
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('✅ Stripe webhook recibido:', event.type)

    // Procesar el evento
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        console.log('💰 Pago exitoso:', event.data.object.id)
        break

      case 'payment_intent.payment_failed':
        console.error('❌ Pago fallido:', event.data.object.id)
        break

      default:
        console.log(`ℹ️ Evento no manejado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('❌ Error en webhook:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('✅ [WEBHOOK] Checkout completado:', session.id)

  const productType = session.metadata?.productType
  console.log('📊 [WEBHOOK] Product Type:', productType)

  // Inicializar Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  // Ruta 1: Plan inicial (contratación completa)
  if (productType === 'plan_inicial') {
    console.log('🎯 [WEBHOOK] Procesando contratación de plan inicial...')
    await handlePlanInicial(session, supabase)
    return
  }

  // Ruta 2: Compras posteriores (requieren entityId)
  const entityId = session.metadata?.entityId
  const priceId = session.metadata?.priceId

  if (!entityId) {
    console.error('❌ [WEBHOOK] No entity ID en metadata para compra posterior')
    return
  }

  console.log('📊 [WEBHOOK] Metadata:', { entityId, priceId, productType })

  // Determinar qué se compró
  const isKitComunicacion = priceId === 'price_1SFtBIPtu7JxWqv9sw7DH5ML' || productType === 'kit_comunicacion'
  const isDelegadoSuplente = priceId === 'price_1SFzPXPtu7JxWqv9HnltemCh' || productType === 'delegado_suplente'

  if (isKitComunicacion) {
    console.log('🎁 [WEBHOOK] Activando Kit de Comunicación...')

    const { data: entity } = await supabase
      .from('entities')
      .select('kit_comunicacion_activo')
      .eq('id', entityId)
      .single()

    if (entity?.kit_comunicacion_activo) {
      console.log('⚠️ [WEBHOOK] Kit ya estaba activo, saltando activación')
      return
    }

    const { error } = await supabase
      .from('entities')
      .update({
        kit_comunicacion_activo: true,
        kit_comunicacion_purchased_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', entityId)

    if (error) {
      console.error('❌ [WEBHOOK] Error activando kit:', error)
    } else {
      console.log('✅ [WEBHOOK] Kit de Comunicación activado para entidad:', entityId)
    }

    await saveInvoice(supabase, {
      entity_id: entityId,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent as string,
      amount: session.amount_total || 0,
      currency: session.currency || 'eur',
      status: 'paid',
      product_type: 'kit_comunicacion',
      invoice_type: 'kit_comunicacion',
      description: 'Kit de Comunicación LOPIVI - Materiales profesionales para comunicación con familias'
    })
  }

  if (isDelegadoSuplente) {
    console.log('✅ [WEBHOOK] Delegado Suplente contratado para entidad:', entityId)

    const { error } = await supabase
      .from('entities')
      .update({
        delegado_suplente_contratado: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', entityId)

    if (error) {
      console.error('❌ [WEBHOOK] Error activando delegado suplente:', error)
    }

    await saveInvoice(supabase, {
      entity_id: entityId,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent as string,
      amount: session.amount_total || 0,
      currency: session.currency || 'eur',
      status: 'paid',
      product_type: 'delegado_suplente',
      invoice_type: 'delegado_suplente',
      description: 'Delegado Suplente LOPIVI - Servicio anual'
    })
  }
}

// Nueva función para manejar contratación de plan inicial
async function handlePlanInicial(session: Stripe.Checkout.Session, supabase: any) {
  const metadata = session.metadata!

  try {
    console.log('📝 [PLAN INICIAL] Extrayendo datos del metadata...')

    // Calcular fecha de segundo pago (+6 meses)
    const secondPaymentDate = new Date()
    secondPaymentDate.setMonth(secondPaymentDate.getMonth() + 6)

    // Obtener customer ID y payment method
    const stripeCustomerId = session.customer as string
    let paymentMethodId = null

    // Expandir payment intent para obtener payment method
    if (session.payment_intent) {
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string)
      paymentMethodId = paymentIntent.payment_method as string

      // Attach payment method to customer si no está ya
      if (paymentMethodId && stripeCustomerId) {
        try {
          await stripe.paymentMethods.attach(paymentMethodId, {
            customer: stripeCustomerId,
          })

          await stripe.customers.update(stripeCustomerId, {
            invoice_settings: {
              default_payment_method: paymentMethodId,
            },
          })

          console.log('✅ [PLAN INICIAL] Payment method guardado')
        } catch (error) {
          console.log('ℹ️ Payment method ya estaba attached')
        }
      }
    }

    // 1. Crear entidad
    console.log('🏢 [PLAN INICIAL] Creando entidad...')
    const { data: newEntity, error: entityError } = await supabase
      .from('entities')
      .insert([{
        nombre_entidad: metadata.entidad_nombre,
        cif: metadata.entidad_cif,
        direccion: metadata.entidad_direccion,
        telefono: metadata.entidad_telefono,
        sector_cnae: metadata.entidad_sector,
        numero_menores: parseInt(metadata.entidad_num_menores || '0'),
        email_contratante: metadata.contratante_email,
        email_admin: metadata.contratante_email,
        plan_contratado: metadata.plan,
        plan_precio_total: parseFloat(metadata.planPrecioTotal),
        first_payment_amount: parseFloat(metadata.firstPaymentAmount),
        second_payment_amount: parseFloat(metadata.secondPaymentAmount),
        second_payment_date: secondPaymentDate.toISOString().split('T')[0],
        second_payment_status: 'pending',
        stripe_customer_id: stripeCustomerId,
        stripe_payment_method_id: paymentMethodId,
        kit_comunicacion_activo: metadata.includeKit === 'true',
        delegado_suplente_contratado: metadata.includeSuplente === 'true',
        account_status: 'active',
        payment_retry_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (entityError) {
      console.error('❌ [PLAN INICIAL] Error creando entidad:', entityError)
      throw entityError
    }

    const entityId = newEntity.id
    console.log('✅ [PLAN INICIAL] Entidad creada:', entityId)

    // Variables para almacenar datos de Holded
    let holdedInvoiceId: string | undefined
    let holdedInvoiceNumber: string | undefined

    // 2. Integración con Holded (facturación legal española)
    try {
      console.log('📇 [HOLDED] Iniciando integración...')

      // 2.1. Crear o actualizar contacto en Holded
      const holdedContactId = await holdedClient.upsertContact({
        name: metadata.entidad_nombre,
        email: metadata.contratante_email,
        code: metadata.entidad_cif,
        tradename: metadata.entidad_nombre,
        address: metadata.entidad_direccion,
        phone: metadata.entidad_telefono,
      })

      if (!holdedContactId) {
        console.error('❌ [HOLDED] Error creando contacto - continuando sin Holded')
      } else {
        console.log('✅ [HOLDED] Contacto creado/actualizado:', holdedContactId)

        // 2.2. Preparar items de factura
        const invoiceItems = []

        // Item principal: Primer pago del plan (50%)
        const firstPaymentSubtotal = parseFloat(metadata.firstPaymentAmount) / 1.21
        invoiceItems.push({
          name: `${metadata.plan} - Primer Pago (50%)`,
          desc: `Sistema Custodia360 LOPIVI - Pago inicial\nSegundo pago programado para ${secondPaymentDate.toLocaleDateString('es-ES')}`,
          units: 1,
          subtotal: Math.round(firstPaymentSubtotal * 100) / 100,
          discount: 0,
          tax: 21,
        })

        // Item adicional: Kit de Comunicación
        if (metadata.includeKit === 'true') {
          invoiceItems.push({
            name: 'Kit de Comunicación LOPIVI',
            desc: 'Materiales profesionales para comunicación con familias',
            units: 1,
            subtotal: 40.00, // Sin IVA
            discount: 0,
            tax: 21,
          })
        }

        // Item adicional: Delegado Suplente
        if (metadata.includeSuplente === 'true') {
          invoiceItems.push({
            name: 'Delegado Suplente LOPIVI - Servicio Anual',
            desc: 'Delegado suplente para cobertura legal',
            units: 1,
            subtotal: 20.00, // Sin IVA
            discount: 0,
            tax: 21,
          })
        }

        // 2.3. Crear factura en Holded
        const holdedInvoice = await holdedClient.createInvoice({
          contactId: holdedContactId,
          contactName: metadata.entidad_nombre,
          contactCode: metadata.entidad_cif,
          date: Math.floor(Date.now() / 1000), // Unix timestamp
          items: invoiceItems,
          customFields: {
            plan: metadata.plan,
            stripe_session_id: session.id,
            custodia360_entity_id: entityId,
          },
          desc: `Contratación ${metadata.plan} - Sistema Custodia360 LOPIVI`,
          notes: `Pago procesado vía Stripe\nSegundo pago programado para ${secondPaymentDate.toLocaleDateString('es-ES')}`,
        })

        if (!holdedInvoice) {
          console.error('❌ [HOLDED] Error creando factura - continuando sin Holded')
        } else {
          console.log('✅ [HOLDED] Factura creada:', holdedInvoice.docNumber)

          // Capturar datos para pasarlos a saveInvoice
          holdedInvoiceId = holdedInvoice.id
          holdedInvoiceNumber = holdedInvoice.docNumber

          // 2.4. Guardar referencias de Holded en Supabase
          await supabase
            .from('entities')
            .update({
              holded_contact_id: holdedContactId,
              holded_invoice_id: holdedInvoice.id,
              holded_invoice_number: holdedInvoice.docNumber,
              updated_at: new Date().toISOString(),
            })
            .eq('id', entityId)

          console.log('✅ [HOLDED] Integración completada exitosamente')
        }
      }
    } catch (holdedError: any) {
      console.error('❌ [HOLDED] Error en integración (no crítico):', holdedError.message)
      // Continuar con el proceso - Holded es opcional
    }

    // 3. Generar token de onboarding para delegado
    const onboardingToken = `${Date.now()}-${Math.random().toString(36).substring(7)}`

    // 4. Crear delegado principal
    console.log('👤 [PLAN INICIAL] Creando delegado principal...')
    const { error: delegadoError } = await supabase
      .from('entity_delegates')
      .insert([{
        entity_id: entityId,
        nombre: metadata.delegado_nombre,
        apellidos: metadata.delegado_apellidos,
        email: metadata.delegado_email,
        telefono: metadata.delegado_telefono,
        dni: metadata.delegado_dni,
        tipo: 'principal',
        onboarding_token: onboardingToken,
        onboarding_token_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      }])

    if (delegadoError) {
      console.error('❌ [PLAN INICIAL] Error creando delegado:', delegadoError)
    } else {
      console.log('✅ [PLAN INICIAL] Delegado creado')
    }

    // 5. Guardar factura del primer pago en Supabase
    await saveInvoice(supabase, {
      entity_id: entityId,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent as string,
      amount: session.amount_total || 0,
      currency: session.currency || 'eur',
      status: 'paid',
      product_type: 'plan_inicial',
      invoice_type: 'first_payment',
      description: `Plan ${metadata.plan} - Primer Pago (50%)${metadata.includeKit === 'true' ? ' + Kit Comunicación' : ''}${metadata.includeSuplente === 'true' ? ' + Delegado Suplente' : ''}`,
      holded_invoice_id: holdedInvoiceId,
      holded_invoice_number: holdedInvoiceNumber,
      holded_status: holdedInvoiceId ? 'paid' : 'pending',
    })

    // 6. Enviar emails (admin, contratante, delegado)
    console.log('📧 [PLAN INICIAL] Enviando emails...')
    // TODO: Implementar envío de emails
    console.log(`- Admin: factura`)
    console.log(`- Contratante: ${metadata.contratante_email} - credenciales`)
    console.log(`- Delegado: ${metadata.delegado_email} - onboarding ${onboardingToken}`)

    console.log('🎉 [PLAN INICIAL] Contratación completada exitosamente')

  } catch (error: any) {
    console.error('❌ [PLAN INICIAL] Error en proceso:', error)
    throw error
  }
}

async function saveInvoice(supabase: any, data: {
  entity_id: string
  stripe_session_id: string
  stripe_payment_intent: string
  amount: number
  currency: string
  status: string
  product_type: string
  invoice_type: string
  description: string
  holded_invoice_id?: string
  holded_invoice_number?: string
  holded_pdf_url?: string
  holded_status?: string
}) {
  // Generar número de factura único
  const invoiceNumber = `FAC-${data.product_type.toUpperCase()}-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

  // Calcular subtotal e IVA (el amount ya incluye IVA)
  const total = data.amount / 100 // Stripe usa centavos
  const IVA_RATE = 0.21
  const subtotal = total / (1 + IVA_RATE)
  const taxAmount = total - subtotal

  const invoiceData = {
    entity_id: data.entity_id,
    invoice_number: invoiceNumber,
    invoice_type: data.invoice_type,
    description: data.description,
    subtotal: Math.round(subtotal * 100) / 100,
    tax_rate: IVA_RATE * 100,
    tax_amount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
    currency: data.currency.toUpperCase(),
    status: data.status,
    stripe_payment_intent_id: data.stripe_payment_intent,
    stripe_charge_id: data.stripe_session_id,
    // Campos de Holded (opcionales)
    holded_invoice_id: data.holded_invoice_id || null,
    holded_invoice_number: data.holded_invoice_number || null,
    holded_pdf_url: data.holded_pdf_url || null,
    holded_status: data.holded_status || 'pending',
    metadata: {
      stripe_session_id: data.stripe_session_id,
      product_type: data.product_type,
      purchased_by: 'stripe_webhook',
      holded_integrated: !!data.holded_invoice_id,
    },
    paid_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  }

  const { error } = await supabase
    .from('invoices')
    .insert([invoiceData])

  if (error) {
    console.error('❌ [WEBHOOK] Error guardando factura:', error)
  } else {
    console.log('✅ [WEBHOOK] Factura guardada:', invoiceNumber)
  }
}
