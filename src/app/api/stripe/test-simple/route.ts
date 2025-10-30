import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET() {
  try {
    console.log('🧪 [TEST SIMPLE] Creando sesión de prueba...')

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Prueba Custodia360',
            },
            unit_amount: 100, // 1€
          },
          quantity: 1,
        },
      ],
      success_url: 'https://www.custodia360.es',
      cancel_url: 'https://www.custodia360.es',
    })

    console.log('✅ [TEST SIMPLE] Sesión creada:', session.id)
    console.log('✅ [TEST SIMPLE] URL:', session.url)

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      message: 'Stripe funciona correctamente. Visita la URL para probar.'
    })
  } catch (error: any) {
    console.error('❌ [TEST SIMPLE] Error:', error)

    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.type,
      code: error.code
    }, { status: 500 })
  }
}
