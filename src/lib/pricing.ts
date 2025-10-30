// =====================================================
// CUSTODIA360 - CONFIGURACIÓN DE PRECIOS
// =====================================================

export const IVA_RATE = 0.21

// Precios base de planes (SIN IVA) - Anual
export const PLAN_PRICES = {
  '100': 38,
  '250': 78,
  '500': 210,
  '500+': 500,
} as const

// Precios de extras (SIN IVA) - Pago único
export const EXTRA_PRICES = {
  kit_comunicacion: 40,
  delegado_suplente: 20,
  custodia_temporal: 100, // Para futuro
} as const

// Stripe Price IDs de planes (primer año - 50% contratación + 50% a los 6 meses)
export const STRIPE_PLAN_FIRST_PAYMENT_IDS = {
  '100': 'price_1SFxNFPtu7JxWqv903F0znAe',
  '250': 'price_1SFfQmPtu7JxWqv9IgtAnkc2',
  '500': 'price_1SFydNPtu7JxWqv9mUQ9HMjh',
  '500+': 'price_1SFyhxPtu7JxWqv9GG2GD6nS',
} as const

// Stripe Price IDs de renovaciones (año 2+ - pago único anual 100%)
export const STRIPE_PLAN_RENEWAL_IDS = {
  '100': 'price_1SFeGNPtu7JxWqv9AKrVASBZ',
  '250': 'price_1SFhPxPtu7JxWqv9aB4Ga2AL',
  '500': 'price_1SFypjPtu7JxWqv985tCEkf2',
  '500+': 'price_1SFzHUPtu7JxWqv9kqEDA6en',
} as const

// Stripe Price IDs de extras
export const STRIPE_EXTRA_IDS = {
  kit_comunicacion: 'price_1SFtBIPtu7JxWqv9sw7DH5ML',
  delegado_suplente: 'price_1SFzPXPtu7JxWqv9HnltemCh',
} as const

export type PlanType = keyof typeof PLAN_PRICES
export type ExtraType = keyof typeof EXTRA_PRICES

// =====================================================
// FUNCIONES DE CÁLCULO
// =====================================================

export interface PaymentBreakdown {
  planBase: number
  firstPayment: {
    planAmount: number // 50% del plan
    extras: {
      kit_comunicacion?: number
      delegado_suplente?: number
    }
    subtotal: number
    iva: number
    total: number
  }
  secondPayment: {
    planAmount: number // 50% del plan
    subtotal: number
    iva: number
    total: number
  }
  totalYear: number
}

export function calculatePaymentBreakdown(
  plan: PlanType,
  includeKit: boolean = false,
  includeSuplente: boolean = false
): PaymentBreakdown {
  const planPrice = PLAN_PRICES[plan]
  const halfPlan = planPrice / 2

  // Primer pago
  const firstPaymentExtras: { kit_comunicacion?: number; delegado_suplente?: number } = {}
  let firstPaymentSubtotal = halfPlan

  if (includeKit) {
    firstPaymentExtras.kit_comunicacion = EXTRA_PRICES.kit_comunicacion
    firstPaymentSubtotal += EXTRA_PRICES.kit_comunicacion
  }

  if (includeSuplente) {
    firstPaymentExtras.delegado_suplente = EXTRA_PRICES.delegado_suplente
    firstPaymentSubtotal += EXTRA_PRICES.delegado_suplente
  }

  const firstPaymentIVA = firstPaymentSubtotal * IVA_RATE
  const firstPaymentTotal = firstPaymentSubtotal + firstPaymentIVA

  // Segundo pago (solo 50% del plan)
  const secondPaymentSubtotal = halfPlan
  const secondPaymentIVA = secondPaymentSubtotal * IVA_RATE
  const secondPaymentTotal = secondPaymentSubtotal + secondPaymentIVA

  return {
    planBase: planPrice,
    firstPayment: {
      planAmount: halfPlan,
      extras: firstPaymentExtras,
      subtotal: firstPaymentSubtotal,
      iva: firstPaymentIVA,
      total: firstPaymentTotal,
    },
    secondPayment: {
      planAmount: halfPlan,
      subtotal: secondPaymentSubtotal,
      iva: secondPaymentIVA,
      total: secondPaymentTotal,
    },
    totalYear: firstPaymentTotal + secondPaymentTotal,
  }
}

// Función para formatear precio en EUR
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Calcular fecha de segundo pago (+6 meses desde hoy)
export function calculateSecondPaymentDate(fromDate: Date = new Date()): Date {
  const secondPaymentDate = new Date(fromDate)
  secondPaymentDate.setMonth(secondPaymentDate.getMonth() + 6)
  return secondPaymentDate
}

// Validar que un plan es válido
export function isValidPlan(plan: string): plan is PlanType {
  return plan in PLAN_PRICES
}

// Obtener nombre legible del plan
export function getPlanName(plan: PlanType): string {
  const names: Record<PlanType, string> = {
    '100': 'Plan 100',
    '250': 'Plan 250',
    '500': 'Plan 500',
    '500+': 'Plan 500+',
  }
  return names[plan]
}

// Obtener Price ID correcto según si es primer año o renovación
export function getStripePriceId(plan: PlanType, isRenewal: boolean = false): string {
  if (isRenewal) {
    return STRIPE_PLAN_RENEWAL_IDS[plan]
  }
  return STRIPE_PLAN_FIRST_PAYMENT_IDS[plan]
}

// =====================================================
// EJEMPLO DE USO
// =====================================================

/*
const breakdown = calculatePaymentBreakdown('250', true, true)
console.log('Plan 250 + Kit + Suplente:')
console.log('Primer pago:', formatPrice(breakdown.firstPayment.total))
console.log('Segundo pago:', formatPrice(breakdown.secondPayment.total))
console.log('Total año:', formatPrice(breakdown.totalYear))
*/
