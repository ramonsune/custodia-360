import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET() {
  const startTime = performance.now()

  try {
    // Verificar que la API key de Stripe existe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey || stripeSecretKey.includes('placeholder')) {
      return NextResponse.json({
        estado: 'DEGRADADO',
        latencia: Math.round(performance.now() - startTime),
        mensaje: 'API key de Stripe no configurada',
        timestamp: new Date().toISOString()
      })
    }

    // Inicializar Stripe y hacer una petición simple
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    })

    // Verificar conectividad listando los primeros productos (límite 1)
    await stripe.products.list({ limit: 1 })

    const latencia = Math.round(performance.now() - startTime)

    return NextResponse.json({
      estado: 'OPERATIVO',
      latencia,
      mensaje: 'API de pagos operativa',
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    const latencia = Math.round(performance.now() - startTime)

    // Error de autenticación
    if (error.type === 'StripeAuthenticationError') {
      return NextResponse.json({
        estado: 'DEGRADADO',
        latencia,
        mensaje: 'API key de Stripe inválida',
        timestamp: new Date().toISOString()
      })
    }

    // Error de conexión
    if (error.type === 'StripeConnectionError') {
      return NextResponse.json({
        estado: 'CAIDO',
        latencia,
        mensaje: 'No se puede conectar con Stripe',
        timestamp: new Date().toISOString()
      })
    }

    // Otros errores
    return NextResponse.json({
      estado: 'CAIDO',
      latencia,
      mensaje: 'Servicio de pagos no disponible',
      timestamp: new Date().toISOString(),
      error: error.message || 'Error desconocido'
    })
  }
}
