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
      entidad,
      contratante,
      delegado,
    } = body

    console.log('🛒 [PLAN CHECKOUT] Iniciando checkout:', { plan, includeKit, includeSuplente })

    // Validar plan
    if (!plan || !isValidPlan(plan)) {
      return NextResponse.json({
        success: false,
        error: 'Plan inválido',
      }, { status: 400 })
    }

    // Validar datos requeridos
    if (!entidad?.nombre || !contratante?.email || !delegado?.email) {
      return NextResponse.json({
        success: false,
        error: 'Datos incompletos',
      }, { status: 400 })
    }

    // Calcular breakdown de pagos
    const breakdown = calculatePaymentBreakdown(plan as PlanType, includeKit, includeSuplente)

    console.log('💰 [PLAN CHECKOUT] Breakdown calculado:', {
      firstPayment: breakdown.firstPayment.total,
      secondPayment: breakdown.secondPayment.total,
    })

    // Crear sesión de Stripe Checkout para PRIMER PAGO
    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || 'https://www.custodia360.es'

    // Metadata completo con TODOS los datos
    const metadata = {
      plan: plan,
      productType: 'plan_inicial',
      includeKit: includeKit.toString(),
      includeSuplente: includeSuplente.toString(),

      // Datos entidad
      entidad_nombre: entidad.nombre,
      entidad_cif: entidad.cif || '',
      entidad_direccion: entidad.direccion || '',
      entidad_telefono: entidad.telefono || '',
      entidad_sector: entidad.sector || '',
      entidad_num_menores: entidad.num_menores || '',

      // Datos contratante
      contratante_nombre: contratante.nombre,
      contratante_email: contratante.email,
      contratante_password: contratante.password, // NOTA: En producción cifrar o usar otro método
      contratante_telefono: contratante.telefono || '',

      // Datos delegado principal
      delegado_nombre: delegado.nombre,
      delegado_apellidos: delegado.apellidos || '',
      delegado_email: delegado.email,
      delegado_telefono: delegado.telefono || '',
      delegado_dni: delegado.dni || '',

      // Información de pagos
      planPrecioTotal: breakdown.planBase.toString(),
      firstPaymentAmount: breakdown.firstPayment.total.toFixed(2),
      secondPaymentAmount: breakdown.secondPayment.total.toFixed(2),
      secondPaymentSubtotal: breakdown.secondPayment.subtotal.toFixed(2),
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',

      // Guardar método de pago para cobro futuro
      payment_intent_data: {
        setup_future_usage: 'off_session', // Permite cobrar sin que el usuario esté presente
      },

      // Line items (primer pago)
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${plan} - Primer Pago (50%)`,
              description: `Incluye: 50% del plan${includeKit ? ', Kit de Comunicación' : ''}${includeSuplente ? ', Delegado Suplente' : ''}`,
            },
            unit_amount: Math.round(breakdown.firstPayment.total * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],

      success_url: `${baseUrl}/contratacion-exitosa?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/contratar?plan=${plan}&cancelled=true`,

      customer_email: contratante.email,

      metadata: metadata,

      allow_promotion_codes: false,
      billing_address_collection: 'required',

      // Configurar para guardar el customer
      customer_creation: 'always',
    })

    console.log('✅ [PLAN CHECKOUT] Sesión creada:', session.id)

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })

  } catch (error: any) {
    console.error('❌ [PLAN CHECKOUT] Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Error al crear sesión de pago',
    }, { status: 500 })
  }
}
