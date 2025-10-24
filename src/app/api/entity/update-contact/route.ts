import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * API para actualizar información de contacto de la entidad
 * Se llama durante el proceso de contratación para guardar:
 * - email_admin (email del administrativo para facturas)
 * - email_contratante (email del responsable/contratante)
 */
export async function POST(req: Request) {
  try {
    const { entityId, emailAdmin, emailContratante, stripeCustomerId, stripePaymentMethodId } = await req.json()

    console.log('📧 [UPDATE CONTACT] Actualizando info de contacto:', {
      entityId,
      emailAdmin,
      emailContratante,
      hasStripeCustomer: !!stripeCustomerId
    })

    // Validar datos mínimos
    if (!entityId) {
      return NextResponse.json({
        success: false,
        error: 'Entity ID requerido'
      }, { status: 400 })
    }

    // Inicializar Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [UPDATE CONTACT] Variables de Supabase no configuradas')
      return NextResponse.json({
        success: false,
        error: 'Error de configuración del servidor'
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Preparar datos a actualizar
    const updateData: any = {}

    if (emailAdmin) {
      updateData.email_admin = emailAdmin
    }

    if (emailContratante) {
      updateData.email_contratante = emailContratante
    }

    if (stripeCustomerId) {
      updateData.stripe_customer_id = stripeCustomerId
    }

    if (stripePaymentMethodId) {
      updateData.stripe_payment_method_id = stripePaymentMethodId
    }

    // Si no hay nada que actualizar
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No hay cambios que realizar'
      })
    }

    // Actualizar entidad
    console.log('💾 [UPDATE CONTACT] Actualizando entidad en Supabase...')
    const { data, error } = await supabase
      .from('entities')
      .update(updateData)
      .eq('id', entityId)
      .select()
      .single()

    if (error) {
      console.error('❌ [UPDATE CONTACT] Error actualizando entidad:', error)
      return NextResponse.json({
        success: false,
        error: 'Error actualizando información de contacto',
        details: error.message
      }, { status: 500 })
    }

    console.log('✅ [UPDATE CONTACT] Información actualizada correctamente')

    return NextResponse.json({
      success: true,
      message: 'Información de contacto actualizada',
      entity: {
        id: data.id,
        email_admin: data.email_admin,
        email_contratante: data.email_contratante,
        stripe_customer_id: data.stripe_customer_id,
        stripe_payment_method_id: data.stripe_payment_method_id
      }
    })

  } catch (error: any) {
    console.error('❌ [UPDATE CONTACT] Error inesperado:', error)
    return NextResponse.json({
      success: false,
      error: 'Error del servidor',
      details: error.message
    }, { status: 500 })
  }
}

/**
 * GET: Obtener información de contacto de la entidad
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const entityId = searchParams.get('entityId')

    if (!entityId) {
      return NextResponse.json({
        success: false,
        error: 'Entity ID requerido'
      }, { status: 400 })
    }

    // Inicializar Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        error: 'Error de configuración del servidor'
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Obtener datos de la entidad
    const { data, error } = await supabase
      .from('entities')
      .select('id, nombre, email_admin, email_contratante, stripe_customer_id, stripe_payment_method_id, kit_comunicacion_activo')
      .eq('id', entityId)
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Entidad no encontrada'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      entity: data
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Error del servidor',
      details: error.message
    }, { status: 500 })
  }
}
