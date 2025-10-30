import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { calculatePaymentBreakdown, isValidPlan, type PlanType } from '@/lib/pricing'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      plan,
      includeKit = false,
      includeSuplente = false,
      baseUrl,
      entidad,
      contratante,
      delegado,
    } = body

    console.log('🛒 [PLAN CHECKOUT] Iniciando checkout:', {
      plan,
      includeKit,
      includeSuplente,
      baseUrl,
      entidad: entidad?.nombre,
      email: contratante?.email
    })

    // Validar plan
    if (!plan || !isValidPlan(plan)) {
      console.error('❌ [CHECKOUT] Plan inválido:', plan)
      return NextResponse.json({
        success: false,
        error: 'Plan inválido: ' + plan,
      }, { status: 400 })
    }

    // Validar datos requeridos
    if (!entidad?.nombre || !contratante?.email || !delegado?.email) {
      console.error('❌ [CHECKOUT] Datos incompletos:', { entidad, contratante, delegado })
      return NextResponse.json({
        success: false,
        error: 'Datos incompletos: ' + JSON.stringify({
          tieneEntidad: !!entidad?.nombre,
          tieneEmailContratante: !!contratante?.email,
          tieneEmailDelegado: !!delegado?.email
        }),
      }, { status: 400 })
    }

    // Verificar que Stripe esté configurado
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ [CHECKOUT] STRIPE_SECRET_KEY no configurada')
      return NextResponse.json({
        success: false,
        error: 'Stripe no está configurado correctamente'
      }, { status: 500 })
    }

    console.log('✅ [CHECKOUT] Validaciones pasadas, calculando breakdown...')

    // Calcular breakdown de pagos
    const breakdown = calculatePaymentBreakdown(plan as PlanType, includeKit, includeSuplente)

    console.log('💰 [PLAN CHECKOUT] Breakdown calculado:', {
      firstPayment: breakdown.firstPayment.total,
      secondPayment: breakdown.secondPayment.total,
      planBase: breakdown.planBase
    })

    // Usar la URL base enviada desde el frontend (URL actual del navegador)
    const finalBaseUrl = baseUrl || process.env.NEXT_PUBLIC_APP_BASE_URL || 'https://www.custodia360.es'

    console.log('🌐 [CHECKOUT] URL base para redirección:', finalBaseUrl)

    // Metadata simplificado (Stripe tiene límite de 500 chars por valor)
    const metadata = {
      plan: plan,
      tipo: 'plan_inicial',
      kit: includeKit.toString(),
      suplente: includeSuplente.toString(),
      entidad: entidad.nombre.substring(0, 100),
      email: contratante.email,
      delegado: delegado.email,
      monto_total: breakdown.planBase.toString(),
      pago_1: breakdown.firstPayment.total.toFixed(2),
      pago_2: breakdown.secondPayment.total.toFixed(2),
    }

    console.log('📝 [CHECKOUT] Creando sesión de Stripe...')
    console.log('📝 [CHECKOUT] Monto:', Math.round(breakdown.firstPayment.total * 100), 'centavos')

    try {
      // Validar que el monto sea positivo
      const amount = Math.round(breakdown.firstPayment.total * 100)

      if (amount <= 0) {
        console.error('❌ [CHECKOUT] Monto inválido:', amount)
        return NextResponse.json({
          success: false,
          error: 'El monto del pago debe ser mayor a 0'
        }, { status: 400 })
      }

      console.log('💰 [CHECKOUT] Creando sesión con monto:', amount, 'céntimos (', breakdown.firstPayment.total, '€)')

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',

        // Line items (primer pago)
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Plan ${plan} - Primer Pago`,
                description: `Custodia360 - Plan ${plan}`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],

        success_url: `${finalBaseUrl}/contratacion-exitosa?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${finalBaseUrl}/contratar?cancelled=true`,

        customer_email: contratante.email,
        metadata: metadata,
        locale: 'es',
      })

      console.log('✅ [PLAN CHECKOUT] Sesión creada exitosamente:', {
        sessionId: session.id,
        url: session.url,
        amount: session.amount_total,
        currency: session.currency
      })

      // Verificar que la URL existe
      if (!session.url) {
        console.error('❌ [CHECKOUT] Sesión creada pero sin URL')
        return NextResponse.json({
          success: false,
          error: 'Stripe no devolvió URL de checkout'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        url: session.url,
      })
    } catch (stripeError: any) {
      console.error('❌ [CHECKOUT] Error de Stripe:', {
        type: stripeError.type,
        message: stripeError.message,
        code: stripeError.code,
        statusCode: stripeError.statusCode,
        raw: stripeError.raw
      })

      return NextResponse.json({
        success: false,
        error: `Error de Stripe: ${stripeError.message}`,
        errorType: stripeError.type,
        errorCode: stripeError.code
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('❌ [PLAN CHECKOUT] Error general:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })

    return NextResponse.json({
      success: false,
      error: error.message || 'Error al crear sesión de pago',
      errorDetails: error.toString()
    }, { status: 500 })
  }
}
