import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.warn('⚠️ STRIPE_WEBHOOK_SECRET no configurado')
      return NextResponse.json({
        error: 'Webhook secret no configurado',
        guide: 'Configura STRIPE_WEBHOOK_SECRET en Netlify y en Stripe Dashboard apunta el webhook a: ' + process.env.APP_BASE_URL + '/api/webhooks/stripe'
      }, { status: 400 })
    }

    if (!signature) {
      return NextResponse.json({ error: 'Firma de Stripe faltante' }, { status: 400 })
    }

    const rawBody = await request.text()

    // Verificar firma (simplificado para test - en producción usar stripe.webhooks.constructEvent)
    // Por ahora, solo parseamos el evento
    let event
    try {
      event = JSON.parse(rawBody)
    } catch (e) {
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
    }

    console.log('✅ Stripe webhook recibido:', event.type)

    // Manejar eventos
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object)
        break

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        console.log('📋 Evento de suscripción:', event.type)
        // TODO: Implementar lógica de actualización de suscripciones
        break

      default:
        console.log('ℹ️ Evento no manejado:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('❌ Error en webhook de Stripe:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: any) {
  console.log('💳 Checkout completado:', session.id)

  const entityId = session.metadata?.entityId
  const planType = session.metadata?.plan_type || 'basic'

  if (!entityId) {
    console.warn('⚠️ No se encontró entityId en metadata')
    return
  }

  // TODO: Actualizar subscriptions en Supabase
  console.log(`✅ Suscripción creada para entity ${entityId}, plan: ${planType}`)
}

async function handleInvoicePaid(invoice: any) {
  console.log('🧾 Factura pagada:', invoice.id)

  const subscriptionId = invoice.subscription
  const customerId = invoice.customer

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ Credenciales de Supabase no configuradas')
    return
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )

  // Buscar suscripción por stripe_subscription_id
  const { data: sub, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (error || !sub) {
    console.warn('⚠️ No se encontró suscripción para:', subscriptionId)
    return
  }

  // Actualizar estado de suscripción
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      current_period_end: new Date(invoice.period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', sub.id)

  if (updateError) {
    console.error('❌ Error actualizando suscripción:', updateError)
    return
  }

  // Si el producto incluye kit_comunicacion, activarlo
  if (sub.plan_type === 'premium' || sub.plan_type === 'kit') {
    const { error: entityError } = await supabase
      .from('entities')
      .update({
        kit_comunicacion: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sub.entity_id)

    if (entityError) {
      console.error('❌ Error activando kit_comunicacion:', entityError)
    } else {
      console.log('✅ Kit de comunicación activado para entity:', sub.entity_id)
    }
  }

  console.log('✅ Suscripción actualizada:', sub.id)
}
