/**
 * API ENDPOINT: POST /api/checkout/create-1eur
 *
 * Crea una sesión de Stripe Checkout para el onboarding de 1€
 *
 * Flujo:
 * 1. Validar datos del formulario
 * 2. Crear registro en onboarding_process
 * 3. Crear sesión de Stripe Checkout
 * 4. Registrar evento de auditoría
 * 5. Devolver URL de checkout
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createOnboardingCheckoutSession } from '@/lib/stripe-products'
import { logCheckoutCreated, logError } from '@/lib/audit-logger'
import bcrypt from 'bcryptjs'

// Cliente Supabase con service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    // 1. Parsear body
    const body = await request.json()
    const {
      entity_name,
      cif,
      email,
      phone,
      address,
      password
    } = body

    // 2. Validaciones
    if (!entity_name || !email || !password) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: entity_name, email, password' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validar contraseña (mínimo 8 caracteres)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    console.log('[CHECKOUT-1EUR] Creando proceso para:', email)

    // 3. Hash de contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // 4. Crear registro en onboarding_process
    const { data: process, error: processError } = await supabaseAdmin
      .from('onboarding_process')
      .insert({
        email,
        entity_name,
        cif: cif || null,
        phone: phone || null,
        address: address || null,
        password_hash: passwordHash,
        status: 'pending',
        metadata: {
          created_from: 'web_form',
          user_agent: request.headers.get('user-agent')
        }
      })
      .select()
      .single()

    if (processError || !process) {
      console.error('[CHECKOUT-1EUR] Error creating process:', processError)
      return NextResponse.json(
        { error: 'Error al crear proceso de onboarding' },
        { status: 500 }
      )
    }

    console.log('[CHECKOUT-1EUR] Process created:', process.id)

    // 5. Crear sesión de Stripe Checkout
    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL || 'https://www.custodia360.es'

    const checkoutSession = await createOnboardingCheckoutSession({
      email,
      entityName: entity_name,
      processId: process.id,
      successUrl: `${baseUrl}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/onboarding/cancel`
    })

    // 6. Actualizar proceso con session_id
    await supabaseAdmin
      .from('onboarding_process')
      .update({
        stripe_checkout_session_id: checkoutSession.id,
        stripe_payment_intent_id: checkoutSession.payment_intent as string || null
      })
      .eq('id', process.id)

    // 7. Registrar evento de auditoría
    await logCheckoutCreated(process.id, checkoutSession.id, email)

    // 8. Devolver URL
    return NextResponse.json({
      success: true,
      url: checkoutSession.url,
      processId: process.id,
      sessionId: checkoutSession.id
    })

  } catch (error: any) {
    console.error('[CHECKOUT-1EUR] Exception:', error)

    // Intentar loguear error si tenemos processId
    if (error.processId) {
      await logError(error.processId, 'checkout.error', error.message)
    }

    return NextResponse.json(
      { error: 'Error al crear sesión de checkout', details: error.message },
      { status: 500 }
    )
  }
}
