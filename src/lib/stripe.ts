import Stripe from 'stripe'

// Inicializar Stripe con la clave secreta
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Price IDs de Stripe
export const STRIPE_PRICES = {
  // Planes iniciales
  PLAN_100: 'price_1SFxNFPtu7JxWqv903F0znAe',
  PLAN_250: 'price_1SFfQmPtu7JxWqv9IgtAnkc2',
  PLAN_500: 'price_1SFydNPtu7JxWqv9mUQ9HMjh',
  PLAN_500_PLUS: 'price_1SFyhxPtu7JxWqv9GG2GD6nS',

  // Servicios adicionales
  KIT_COMUNICACION: 'price_1SFtBIPtu7JxWqv9sw7DH5ML',
  DELEGADO_SUPLENTE: 'price_1SFzPXPtu7JxWqv9HnltemCh',

  // Renovaciones
  RENOVACION_100: 'price_1SFeGNPtu7JxWqv9AKrVASBZ',
  RENOVACION_250: 'price_1SFhPxPtu7JxWqv9aB4Ga2AL',
  RENOVACION_500: 'price_1SFypjPtu7JxWqv985tCEkf2',
  RENOVACION_500_PLUS: 'price_1SFzHUPtu7JxWqv9kqEDA6en',
} as const

// Mapeo de planes a Price IDs
export function getPlanPriceId(plan: string, isRenewal = false): string {
  const planMap: Record<string, string> = {
    '100': isRenewal ? STRIPE_PRICES.RENOVACION_100 : STRIPE_PRICES.PLAN_100,
    '250': isRenewal ? STRIPE_PRICES.RENOVACION_250 : STRIPE_PRICES.PLAN_250,
    '500': isRenewal ? STRIPE_PRICES.RENOVACION_500 : STRIPE_PRICES.PLAN_500,
    '500+': isRenewal ? STRIPE_PRICES.RENOVACION_500_PLUS : STRIPE_PRICES.PLAN_500_PLUS,
  }

  return planMap[plan] || STRIPE_PRICES.PLAN_100
}

export default stripe
