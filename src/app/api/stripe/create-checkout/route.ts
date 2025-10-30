import { NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { priceId, entityId, entityName, customerEmail, successUrl, cancelUrl } = await request.json()

    if (!priceId) {
      return NextResponse.json({
        success: false,
        error: 'Price ID requerido'
      }, { status: 400 })
    }

    // Crear sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_BASE_URL}/dashboard-entidad?payment=success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_BASE_URL}/dashboard-entidad?payment=cancelled`,
      customer_email: customerEmail,
      metadata: {
        entityId: entityId || '',
        entityName: entityName || '',
        priceId: priceId,
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error('❌ Error creando sesión de Stripe:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Error al crear sesión de pago'
    }, { status: 500 })
  }
}
