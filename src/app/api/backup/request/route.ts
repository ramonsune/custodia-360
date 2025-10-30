import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      entity_id,
      user_name,
      user_email,
      user_password,
      payment_amount = 20,
      invited = false
    } = body

    // Validaciones básicas
    if (!entity_id || !user_name || !user_email || !user_password) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: entity_id, user_name, user_email, user_password' },
        { status: 400 }
      )
    }

    // Validar que la entidad existe
    const { data: entity, error: entityError } = await supabase
      .from('entidades')
      .select('id, nombre, has_backup_delegate, backup_status')
      .eq('id', entity_id)
      .single()

    if (entityError || !entity) {
      return NextResponse.json(
        { error: 'Entidad no encontrada' },
        { status: 404 }
      )
    }

    // Verificar si ya tiene suplente activo
    if (entity.has_backup_delegate && entity.backup_status === 'active') {
      return NextResponse.json(
        { error: 'La entidad ya tiene un delegado suplente activo' },
        { status: 400 }
      )
    }

    // Verificar si ya existe una solicitud pendiente
    const { data: existingRequest } = await supabase
      .from('backup_delegate_requests')
      .select('id, status')
      .eq('entity_id', entity_id)
      .in('status', ['pending_payment', 'pending_consent'])
      .single()

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Ya existe una solicitud pendiente para esta entidad' },
        { status: 400 }
      )
    }

    // Encriptar contraseña
    const password_hash = await bcrypt.hash(user_password, 10)

    // Crear registro de pago
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        entity_id,
        product: 'backup_delegate',
        amount: payment_amount,
        currency: 'EUR',
        status: 'pending',
        metadata: { user_email, user_name }
      })
      .select()
      .single()

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Error creando registro de pago' },
        { status: 500 }
      )
    }

    // Crear solicitud de delegado suplente
    const { data: backupRequest, error: requestError } = await supabase
      .from('backup_delegate_requests')
      .insert({
        entity_id,
        user_email,
        user_name,
        user_password_hash: password_hash,
        invited,
        payment_id: payment.id,
        status: 'pending_payment'
      })
      .select()
      .single()

    if (requestError || !backupRequest) {
      return NextResponse.json(
        { error: 'Error creando solicitud de delegado suplente' },
        { status: 500 }
      )
    }

    // Registrar en auditoría
    await supabase.from('audit_log').insert({
      entity_id,
      action: 'backup_delegate_requested',
      resource_type: 'backup_delegate_request',
      resource_id: backupRequest.id,
      metadata: { user_email, user_name, payment_id: payment.id }
    })

    return NextResponse.json({
      success: true,
      request_id: backupRequest.id,
      payment_id: payment.id,
      status: 'pending_payment',
      message: 'Solicitud creada. Pendiente de pago.'
    })

  } catch (error) {
    console.error('Error en /api/backup/request:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
