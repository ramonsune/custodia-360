/**
 * STRIPE PRODUCTS - Gestión de Productos Stripe
 *
 * Centraliza la creación/obtención de productos y precios en Stripe
 * Específicamente para el producto "Onboarding Custodia360 - 1€"
 */

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

export interface OnboardingProduct {
  productId: string
  priceId: string
  amount: number
  currency: string
}

/**
 * Clave para almacenar IDs en cache (en memoria)
 */
let cachedOnboardingProduct: OnboardingProduct | null = null

/**
 * Obtiene o crea el producto "Onboarding Custodia360 - 1€"
 *
 * Flujo:
 * 1. Si existe en cache, devolver
 * 2. Buscar producto existente en Stripe por nombre
 * 3. Si no existe, crear producto + precio
 * 4. Guardar en cache
 * 5. Devolver { productId, priceId, amount, currency }
 */
export async function ensureOnboardingProduct(): Promise<OnboardingProduct> {
  // 1. Cache hit
  if (cachedOnboardingProduct) {
    console.log('[STRIPE-PRODUCT] ✅ Using cached product:', cachedOnboardingProduct.productId)
    return cachedOnboardingProduct
  }

  try {
    // 2. Buscar producto existente por nombre
    const products = await stripe.products.search({
      query: 'name:"Onboarding Custodia360"',
      limit: 1
    })

    let product: Stripe.Product
    let price: Stripe.Price

    if (products.data.length > 0) {
      // Producto encontrado
      product = products.data[0]
      console.log('[STRIPE-PRODUCT] ✅ Product found:', product.id)

      // Buscar precio asociado
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 1
      })

      if (prices.data.length > 0) {
        price = prices.data[0]
        console.log('[STRIPE-PRODUCT] ✅ Price found:', price.id)
      } else {
        // Crear precio si no existe
        price = await stripe.prices.create({
          product: product.id,
          currency: 'eur',
          unit_amount: 100, // 1.00 EUR en centavos
          nickname: 'Onboarding 1€'
        })
        console.log('[STRIPE-PRODUCT] ✅ Price created:', price.id)
      }
    } else {
      // 3. Crear producto + precio
      console.log('[STRIPE-PRODUCT] Creating new product...')

      product = await stripe.products.create({
        name: 'Onboarding Custodia360',
        description: 'Alta inicial en plataforma Custodia360 - Cumplimiento LOPIVI',
        metadata: {
          type: 'onboarding',
          version: '1.0'
        }
      })
      console.log('[STRIPE-PRODUCT] ✅ Product created:', product.id)

      price = await stripe.prices.create({
        product: product.id,
        currency: 'eur',
        unit_amount: 100, // 1.00 EUR
        nickname: 'Onboarding 1€'
      })
      console.log('[STRIPE-PRODUCT] ✅ Price created:', price.id)
    }

    // 4. Guardar en cache
    cachedOnboardingProduct = {
      productId: product.id,
      priceId: price.id,
      amount: price.unit_amount || 100,
      currency: price.currency
    }

    console.log('[STRIPE-PRODUCT] ✅ Product ready:', cachedOnboardingProduct)
    return cachedOnboardingProduct

  } catch (error: any) {
    console.error('[STRIPE-PRODUCT] ❌ Error ensuring product:', error.message)
    throw new Error(`Failed to ensure Stripe product: ${error.message}`)
  }
}

/**
 * Crea una sesión de Checkout para el onboarding de 1€
 */
export async function createOnboardingCheckoutSession(params: {
  email: string
  entityName: string
  processId: string
  successUrl: string
  cancelUrl: string
}): Promise<Stripe.Checkout.Session> {
  const { email, entityName, processId, successUrl, cancelUrl } = params

  try {
    // Asegurar que existe el producto
    const product = await ensureOnboardingProduct()

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_creation: 'always',
      customer_email: email,
      line_items: [
        {
          price: product.priceId,
          quantity: 1
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        process_id: processId,
        email,
        entity_name: entityName,
        type: 'onboarding'
      },
      billing_address_collection: 'auto',
      locale: 'es'
    })

    console.log('[STRIPE-CHECKOUT] ✅ Session created:', session.id)
    return session

  } catch (error: any) {
    console.error('[STRIPE-CHECKOUT] ❌ Error creating session:', error.message)
    throw new Error(`Failed to create checkout session: ${error.message}`)
  }
}

/**
 * Obtiene una sesión de Checkout por ID
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'payment_intent']
    })
    return session
  } catch (error: any) {
    console.error('[STRIPE] Error retrieving session:', error.message)
    return null
  }
}

/**
 * Obtiene un Payment Intent por ID
 */
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent | null> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error: any) {
    console.error('[STRIPE] Error retrieving payment intent:', error.message)
    return null
  }
}

/**
 * Obtiene un Customer por ID
 */
export async function getCustomer(customerId: string): Promise<Stripe.Customer | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId)
    if (customer.deleted) return null
    return customer as Stripe.Customer
  } catch (error: any) {
    console.error('[STRIPE] Error retrieving customer:', error.message)
    return null
  }
}

/**
 * Verifica la firma de un webhook de Stripe
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event | null {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret)
    return event
  } catch (error: any) {
    console.error('[STRIPE-WEBHOOK] ❌ Signature verification failed:', error.message)
    return null
  }
}
