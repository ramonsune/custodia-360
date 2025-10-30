import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Configuración de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      monto,
      iva,
      total,
      concepto,
      delegado_id,
      entidad_id,
      metodo_pago,
      tarjeta_id, // Para tarjeta existente
      nueva_tarjeta, // Para nueva tarjeta
      guardar_tarjeta = false
    } = body

    // Validaciones básicas
    if (!delegado_id || !entidad_id || !total || !concepto) {
      return NextResponse.json({
        success: false,
        error: 'Datos de pago incompletos'
      }, { status: 400 })
    }

    // Obtener datos del delegado
    const { data: delegado, error: delegadoError } = await supabase
      .from('delegados_lopivi')
      .select('nombre_completo, email, entidad_nombre')
      .eq('id', delegado_id)
      .single()

    if (delegadoError || !delegado) {
      return NextResponse.json({
        success: false,
        error: 'Delegado no encontrado'
      }, { status: 404 })
    }

    let payment_method_id = null
    let customer_id = null

    // Verificar si ya existe un customer en Stripe para este delegado
    const { data: stripeCustomer } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('delegado_id', delegado_id)
      .single()

    if (stripeCustomer) {
      customer_id = stripeCustomer.stripe_customer_id
    } else {
      // Crear nuevo customer en Stripe
      const customer = await stripe.customers.create({
        email: delegado.email,
        name: delegado.nombre_completo,
        metadata: {
          delegado_id: delegado_id,
          entidad_id: entidad_id
        }
      })

      customer_id = customer.id

      // Guardar customer_id en la base de datos
      await supabase.from('stripe_customers').insert({
        delegado_id,
        entidad_id,
        stripe_customer_id: customer_id,
        email: delegado.email,
        fecha_creacion: new Date().toISOString()
      })
    }

    // Procesar según método de pago
    if (metodo_pago === 'existente' && tarjeta_id) {
      // Usar tarjeta guardada
      const { data: tarjetaGuardada, error: tarjetaError } = await supabase
        .from('tarjetas_delegados')
        .select('token_stripe_customer')
        .eq('id', tarjeta_id)
        .eq('delegado_id', delegado_id)
        .eq('activa', true)
        .single()

      if (tarjetaError || !tarjetaGuardada) {
        return NextResponse.json({
          success: false,
          error: 'Tarjeta guardada no encontrada'
        }, { status: 404 })
      }

      payment_method_id = tarjetaGuardada.token_stripe_customer

    } else if (metodo_pago === 'nueva' && nueva_tarjeta) {
      // Procesar nueva tarjeta
      const { numero, titular, vencimiento, cvv } = nueva_tarjeta

      // Crear payment method en Stripe
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: numero.replace(/\s/g, ''),
          exp_month: parseInt(vencimiento.split('/')[0]),
          exp_year: parseInt('20' + vencimiento.split('/')[1]),
          cvc: cvv
        },
        billing_details: {
          name: titular,
          email: delegado.email
        }
      })

      payment_method_id = paymentMethod.id

      // Adjuntar payment method al customer
      await stripe.paymentMethods.attach(payment_method_id, {
        customer: customer_id
      })

      // Guardar tarjeta si se solicita
      if (guardar_tarjeta) {
        await supabase.from('tarjetas_delegados').insert({
          delegado_id,
          entidad_id,
          marca_tarjeta: paymentMethod.card?.brand || 'unknown',
          ultimos_4_digitos: paymentMethod.card?.last4 || '0000',
          mes_vencimiento: paymentMethod.card?.exp_month || 12,
          año_vencimiento: paymentMethod.card?.exp_year || 2025,
          titular_tarjeta: titular,
          token_stripe_customer: payment_method_id,
          activa: true,
          fecha_creacion: new Date().toISOString()
        })
      }
    } else {
      return NextResponse.json({
        success: false,
        error: 'Método de pago no válido'
      }, { status: 400 })
    }

    // Crear PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe usa centavos
      currency: 'eur',
      customer: customer_id,
      payment_method: payment_method_id,
      confirmation_method: 'manual',
      confirm: true,
      description: concepto,
      metadata: {
        delegado_id,
        entidad_id,
        tipo_pago: 'renovacion_certificacion',
        monto_sin_iva: monto.toString(),
        iva: iva.toString()
      }
    })

    // Verificar el estado del pago
    if (paymentIntent.status === 'succeeded') {
      // Pago exitoso - procesar renovación
      const transaccionId = `TXN-${Date.now()}-${delegado_id.substring(0, 6)}`

      // Registrar transacción en la base de datos
      const { data: transaccion, error: transaccionError } = await supabase
        .from('transacciones_pagos')
        .insert({
          id: transaccionId,
          delegado_id,
          entidad_id,
          stripe_payment_intent_id: paymentIntent.id,
          monto_sin_iva: monto,
          iva: iva,
          monto_total: total,
          concepto,
          metodo_pago,
          estado: 'completado',
          fecha_transaccion: new Date().toISOString(),
          detalles_json: {
            customer_id,
            payment_method_id,
            stripe_status: paymentIntent.status
          }
        })
        .select()
        .single()

      if (transaccionError) {
        console.error('❌ Error registrando transacción:', transaccionError)
        // El pago fue exitoso pero no se pudo registrar - esto requiere revisión manual
      }

      // Actualizar certificación del delegado
      const fechaVencimientoNueva = new Date()
      fechaVencimientoNueva.setFullYear(fechaVencimientoNueva.getFullYear() + 1) // 1 año más

      const { error: certificacionError } = await supabase
        .from('delegados_lopivi')
        .update({
          certificacion_vigente: true,
          fecha_vencimiento_certificacion: fechaVencimientoNueva.toISOString(),
          fecha_ultima_renovacion: new Date().toISOString()
        })
        .eq('id', delegado_id)

      if (certificacionError) {
        console.error('❌ Error actualizando certificación:', certificacionError)
      }

      // Registrar en historial de auditoría
      await supabase.from('historial_auditoria').insert({
        entidad_id,
        tipo_evento: 'certificacion_renovada',
        descripcion: `Certificación LOPIVI renovada mediante pago de ${total}€`,
        usuario_id: delegado_id,
        fecha_evento: new Date().toISOString(),
        detalles_json: {
          transaccion_id: transaccionId,
          monto: total,
          stripe_payment_intent: paymentIntent.id,
          nueva_fecha_vencimiento: fechaVencimientoNueva.toISOString()
        }
      })

      // TODO: Enviar email de confirmación con nuevo certificado
      // await enviarEmailRenovacion(delegado.email, delegado.nombre_completo, transaccionId)

      return NextResponse.json({
        success: true,
        transaccionId: transaccionId,
        fechaVencimientoNueva: fechaVencimientoNueva.toISOString().split('T')[0],
        stripePaymentIntentId: paymentIntent.id,
        message: 'Pago procesado exitosamente. Su certificación ha sido renovada.'
      })

    } else if (paymentIntent.status === 'requires_action') {
      // Requiere autenticación adicional (3D Secure)
      return NextResponse.json({
        success: false,
        error: 'Pago requiere autenticación adicional',
        client_secret: paymentIntent.client_secret,
        requires_action: true
      })

    } else {
      // Pago falló
      return NextResponse.json({
        success: false,
        error: 'El pago no pudo ser procesado. Verifique los datos de la tarjeta.',
        stripe_status: paymentIntent.status
      })
    }

  } catch (error) {
    console.error('❌ Error procesando pago:', error)

    // Errores específicos de Stripe
    if (error instanceof Stripe.errors.StripeCardError) {
      return NextResponse.json({
        success: false,
        error: `Error de tarjeta: ${error.message}`
      }, { status: 400 })
    }

    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      return NextResponse.json({
        success: false,
        error: 'Datos de pago inválidos'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno procesando el pago'
    }, { status: 500 })
  }
}

// Endpoint para consultar estado de transacciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const delegado_id = searchParams.get('delegado_id')
    const transaccion_id = searchParams.get('transaccion_id')

    if (!delegado_id) {
      return NextResponse.json({
        success: false,
        error: 'ID de delegado requerido'
      }, { status: 400 })
    }

    let query = supabase
      .from('transacciones_pagos')
      .select('*')
      .eq('delegado_id', delegado_id)

    if (transaccion_id) {
      query = query.eq('id', transaccion_id)
    }

    const { data: transacciones, error } = await query
      .order('fecha_transaccion', { ascending: false })

    if (error) {
      console.error('❌ Error obteniendo transacciones:', error)
      return NextResponse.json({
        success: false,
        error: 'Error consultando transacciones'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      transacciones: transacciones || []
    })

  } catch (error) {
    console.error('❌ Error en GET /api/pagos/renovacion-certificacion:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}
