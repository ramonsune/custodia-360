import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET() {
  try {
    console.log('🔍 [STRIPE TEST] Verificando configuración de Stripe...')

    // Verificar que las variables de entorno existen
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY
    const hasPublicKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    console.log('🔑 [STRIPE TEST] Keys disponibles:', {
      secretKey: hasSecretKey ? 'Configurada' : 'FALTA',
      publicKey: hasPublicKey ? 'Configurada' : 'FALTA'
    })

    if (!hasSecretKey) {
      return NextResponse.json({
        success: false,
        error: 'STRIPE_SECRET_KEY no configurada',
        config: {
          secretKey: false,
          publicKey: hasPublicKey
        }
      }, { status: 500 })
    }

    // Detectar modo (test o live)
    const secretKey = process.env.STRIPE_SECRET_KEY || ''
    const isTestMode = secretKey.startsWith('sk_test_')
    const isLiveMode = secretKey.startsWith('sk_live_')

    console.log('🎯 [STRIPE TEST] Modo detectado:', {
      isTest: isTestMode,
      isLive: isLiveMode
    })

    // Intentar hacer una llamada simple a la API de Stripe
    const products = await stripe.products.list({ limit: 1 })

    console.log('✅ [STRIPE TEST] Conexión exitosa con Stripe')

    return NextResponse.json({
      success: true,
      message: 'Stripe configurado correctamente',
      config: {
        secretKey: true,
        publicKey: hasPublicKey,
        mode: isTestMode ? 'TEST' : isLiveMode ? 'LIVE' : 'UNKNOWN',
        connection: 'OK',
        productsCount: products.data.length
      }
    })

  } catch (error: any) {
    console.error('❌ [STRIPE TEST] Error:', error)

    return NextResponse.json({
      success: false,
      error: error.message,
      errorType: error.type,
      errorCode: error.code,
      details: {
        message: error.message,
        type: error.type,
        code: error.code
      }
    }, { status: 500 })
  }
}
