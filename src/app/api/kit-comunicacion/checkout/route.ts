import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { entityId } = await request.json()

    console.log('🛒 Creando checkout de Stripe para Kit de Comunicación - Entity:', entityId)

    if (!entityId) {
      return NextResponse.json({
        success: false,
        error: 'Entity ID requerido'
      }, { status: 400 })
    }

    // Obtener datos de la entidad
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: entity, error: entityError } = await supabase
      .from('entities')
      .select('nombre, email_admin, email_contratante, kit_comunicacion_activo')
      .eq('id', entityId)
      .single()

    if (entityError || !entity) {
      return NextResponse.json({
        success: false,
        error: 'Entidad no encontrada'
      }, { status: 404 })
    }

    // Verificar si ya tiene el kit activo
    if (entity.kit_comunicacion_activo) {
      return NextResponse.json({
        success: false,
        error: 'Ya tiene el Kit de Comunicación activo'
      }, { status: 400 })
    }

    // Crear sesión de Stripe Checkout
    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || 'https://www.custodia360.es'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICES.KIT_COMUNICACION,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/dashboard-entidad?kit_purchase=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard-entidad?kit_purchase=cancelled`,
      customer_email: entity.email_admin || entity.email_contratante,
      metadata: {
        entityId: entityId,
        entityName: entity.nombre,
        priceId: STRIPE_PRICES.KIT_COMUNICACION,
        productType: 'kit_comunicacion'
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      invoice_creation: {
        enabled: true,
      }
    })

    console.log('✅ Sesión de Stripe creada:', session.id)

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url
    })

  } catch (error: any) {
    console.error('❌ Error creando checkout de Stripe:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Error al crear sesión de pago'
    }, { status: 500 })
  }
}
