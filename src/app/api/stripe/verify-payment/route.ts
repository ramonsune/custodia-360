import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID requerido'
      }, { status: 400 })
    }

    console.log('🔍 Verificando sesión de Stripe:', sessionId)

    // Recuperar sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items']
    })

    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Sesión no encontrada'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        status: session.status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email,
        metadata: session.metadata,
        payment_intent: session.payment_intent
      }
    })
  } catch (error: any) {
    console.error('❌ Error verificando pago de Stripe:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Error al verificar el pago'
    }, { status: 500 })
  }
}
