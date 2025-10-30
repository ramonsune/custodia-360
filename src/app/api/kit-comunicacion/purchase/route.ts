import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import emailTemplates from '@/lib/email-templates'
import { PDFTemplates, pdfGenerator } from '@/lib/pdf-generator'

// Constantes
const KIT_PRECIO_BASE = 40.00
const IVA_RATE = 0.21
const KIT_PRECIO_IVA = KIT_PRECIO_BASE * IVA_RATE
const KIT_PRECIO_TOTAL = KIT_PRECIO_BASE + KIT_PRECIO_IVA

// NOTA: Este endpoint ahora solo se usa para procesar el webhook de Stripe
// La compra se inicia desde /api/kit-comunicacion/checkout
export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json()

    console.log('🛒 [KIT PURCHASE] Verificando sesión de Stripe:', sessionId)

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID requerido'
      }, { status: 400 })
    }

    // Inicializar Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [KIT PURCHASE] Variables de Supabase no configuradas')
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

    // Recuperar sesión de Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json({
        success: false,
        error: 'Pago no completado'
      }, { status: 400 })
    }

    const entityId = session.metadata?.entityId

    if (!entityId) {
      console.error('❌ [KIT PURCHASE] No entity ID en metadata')
      return NextResponse.json({
        success: false,
        error: 'Datos de sesión inválidos'
      }, { status: 400 })
    }

    // Obtener datos de la entidad
    const { data: entity, error: entityError } = await supabase
      .from('entities')
      .select('*')
      .eq('id', entityId)
      .single()

    if (entityError || !entity) {
      console.error('❌ [KIT PURCHASE] Entidad no encontrada:', entityError)
      return NextResponse.json({
        success: false,
        error: 'Entidad no encontrada'
      }, { status: 404 })
    }

    // Verificar si ya tiene el kit activo
    if (entity.kit_comunicacion_activo) {
      console.log('✅ [KIT PURCHASE] Kit ya activado previamente')
      return NextResponse.json({
        success: true,
        message: 'Kit ya activo',
        already_active: true
      })
    }

    console.log('✅ [KIT PURCHASE] Pago verificado, procesando activación...')

    // Generar número de factura único
    const invoiceNumber = `FAC-KIT-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
    console.log('📄 [KIT PURCHASE] Número de factura generado:', invoiceNumber)

    // Generar PDF de factura
    console.log('📄 [KIT PURCHASE] Generando PDF de factura...')
    const facturaHTML = PDFTemplates.facturaKitComunicacion({
      entidad: entity.nombre,
      cif: entity.cif || 'No especificado',
      numeroFactura: invoiceNumber,
      fecha: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      subtotal: KIT_PRECIO_BASE,
      iva: KIT_PRECIO_IVA,
      total: KIT_PRECIO_TOTAL,
      direccion: entity.direccion || 'No especificada',
      emailAdmin: entity.email_admin || entity.email_contratante || 'No especificado'
    })

    const facturaPDF = await pdfGenerator.generateFromHTML(facturaHTML, {
      title: `Factura ${invoiceNumber}`
    })

    console.log('✅ [KIT PURCHASE] PDF generado correctamente')

    // Insertar factura en la base de datos
    console.log('💾 [KIT PURCHASE] Guardando factura en base de datos...')
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        entity_id: entityId,
        invoice_number: invoiceNumber,
        invoice_type: 'kit_comunicacion',
        description: 'Kit de Comunicación LOPIVI - Materiales profesionales para comunicación con familias',
        subtotal: KIT_PRECIO_BASE,
        tax_rate: IVA_RATE * 100,
        tax_amount: KIT_PRECIO_IVA,
        total: KIT_PRECIO_TOTAL,
        currency: 'EUR',
        status: 'paid',
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_charge_id: sessionId,
        metadata: {
          stripe_session_id: sessionId,
          purchased_by: 'entity_dashboard'
        },
        paid_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (invoiceError) {
      console.error('❌ [KIT PURCHASE] Error guardando factura:', invoiceError)
      return NextResponse.json({
        success: false,
        error: 'Error guardando factura'
      }, { status: 500 })
    }

    console.log('✅ [KIT PURCHASE] Factura guardada correctamente')

    // Activar el kit en la entidad
    console.log('🔓 [KIT PURCHASE] Activando Kit de Comunicación...')
    const { error: updateError } = await supabase
      .from('entities')
      .update({
        kit_comunicacion_activo: true,
        kit_comunicacion_purchased_at: new Date().toISOString()
      })
      .eq('id', entityId)

    if (updateError) {
      console.error('❌ [KIT PURCHASE] Error activando kit:', updateError)
      return NextResponse.json({
        success: false,
        error: 'Error activando el kit'
      }, { status: 500 })
    }

    console.log('✅ [KIT PURCHASE] Kit activado correctamente')

    // Enviar email de factura al admin
    if (entity.email_admin) {
      console.log('📧 [KIT PURCHASE] Enviando factura por email a:', entity.email_admin)
      try {
        await emailTemplates.enviarFacturaKitComunicacion(
          entity.email_admin,
          entity.nombre,
          invoiceNumber,
          facturaPDF
        )
        console.log('✅ [KIT PURCHASE] Email de factura enviado')
      } catch (emailError) {
        console.error('⚠️ [KIT PURCHASE] Error enviando email de factura:', emailError)
      }
    }

    // Obtener email del delegado para notificación
    const { data: delegates } = await supabase
      .from('entity_delegates')
      .select('email, nombre')
      .eq('entity_id', entityId)
      .eq('tipo', 'principal')
      .limit(1)

    if (delegates && delegates.length > 0) {
      console.log('📧 [KIT PURCHASE] Enviando confirmación al delegado:', delegates[0].email)
      try {
        await emailTemplates.enviarConfirmacionKitDelegado(
          delegates[0].email,
          delegates[0].nombre,
          entity.nombre
        )
        console.log('✅ [KIT PURCHASE] Email de confirmación enviado al delegado')
      } catch (emailError) {
        console.error('⚠️ [KIT PURCHASE] Error enviando email al delegado:', emailError)
      }
    }

    // Respuesta exitosa
    console.log('🎉 [KIT PURCHASE] Compra completada exitosamente')
    return NextResponse.json({
      success: true,
      invoice_number: invoiceNumber,
      total: KIT_PRECIO_TOTAL,
      message: 'Kit de Comunicación adquirido exitosamente',
      invoice: {
        id: invoice.id,
        number: invoiceNumber,
        total: KIT_PRECIO_TOTAL,
        paid_at: invoice.paid_at
      }
    })

  } catch (error: any) {
    console.error('❌ [KIT PURCHASE] Error inesperado:', error)
    return NextResponse.json({
      success: false,
      error: 'Error procesando la compra',
      details: error.message
    }, { status: 500 })
  }
}
