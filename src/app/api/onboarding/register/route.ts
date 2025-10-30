import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const token = formData.get('token') as string
    const rol = formData.get('rol') as string
    const nombre = formData.get('nombre') as string
    const dni = formData.get('dni') as string
    const email = formData.get('email') as string
    const telefono = formData.get('telefono') as string
    const cargo = formData.get('cargo') as string
    const nombres_menores = formData.get('nombres_menores') as string

    const acepta_codigo = formData.get('acepta_codigo') === 'true'
    const acepta_formacion = formData.get('acepta_formacion') === 'true'
    const autorizacion_imagen = formData.get('autorizacion_imagen') === 'true'
    const consentimiento_canal = formData.get('consentimiento_canal') === 'true'
    const ha_entregado_certificado = formData.get('ha_entregado_certificado') === 'true'
    const tiene_contacto_ocasional = formData.get('tiene_contacto_ocasional') === 'true'

    const certificado_pdf = formData.get('certificado_pdf') as File | null

    console.log('📥 [REGISTER] Registro recibido:', { token, rol, nombre, email })

    // Validaciones básicas
    if (!token || !rol || !nombre || !dni || !email || !telefono) {
      return NextResponse.json(
        { ok: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Inicializar Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [REGISTER] Variables de Supabase no configuradas')
      return NextResponse.json(
        { ok: false, error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Verificar que el token sea válido
    const { data: tokenData, error: tokenError } = await supabase
      .from('entity_invite_tokens')
      .select('token, entity_id, active, expires_at')
      .eq('token', token)
      .eq('active', true)
      .single()

    if (tokenError || !tokenData) {
      console.error('❌ [REGISTER] Token inválido:', tokenError)
      return NextResponse.json(
        { ok: false, error: 'Token inválido o expirado' },
        { status: 400 }
      )
    }

    // Verificar expiración
    if (tokenData.expires_at) {
      const expiresAt = new Date(tokenData.expires_at)
      if (expiresAt <= new Date()) {
        return NextResponse.json(
          { ok: false, error: 'Token expirado' },
          { status: 400 }
        )
      }
    }

    const entity_id = tokenData.entity_id

    console.log('✅ [REGISTER] Token válido para entidad:', entity_id)

    // Manejar upload de certificado PDF si existe
    let certificado_url: string | null = null

    if (certificado_pdf && certificado_pdf.size > 0) {
      console.log('📄 [REGISTER] Procesando certificado PDF:', certificado_pdf.name)

      try {
        const fileExt = 'pdf'
        const fileName = `${entity_id}/${dni}_${Date.now()}.${fileExt}`
        const filePath = `certificados-penales/${fileName}`

        // Convertir File a ArrayBuffer
        const arrayBuffer = await certificado_pdf.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload a Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('documents')
          .upload(filePath, buffer, {
            contentType: 'application/pdf',
            upsert: false
          })

        if (uploadError) {
          console.error('❌ [REGISTER] Error subiendo certificado:', uploadError)
          // No bloqueamos el registro si falla el upload
        } else {
          // Obtener URL pública
          const { data: urlData } = supabase
            .storage
            .from('documents')
            .getPublicUrl(filePath)

          certificado_url = urlData.publicUrl
          console.log('✅ [REGISTER] Certificado subido:', certificado_url)
        }
      } catch (uploadErr) {
        console.error('❌ [REGISTER] Error procesando certificado:', uploadErr)
      }
    }

    // Insertar miembro en la tabla entity_members
    const memberData = {
      entity_id,
      nombre,
      dni,
      email,
      telefono,
      rol,
      cargo: cargo || null,
      nombres_menores: nombres_menores || null,
      acepta_codigo_conducta: acepta_codigo,
      acepta_formacion_lopivi: acepta_formacion,
      autorizacion_imagen: autorizacion_imagen,
      consentimiento_canal: consentimiento_canal,
      ha_entregado_certificado: ha_entregado_certificado,
      tiene_contacto_ocasional: rol === 'directiva' ? tiene_contacto_ocasional : null,
      certificado_penales_url: certificado_url,
      onboarding_token: token,
      estado: 'pendiente_validacion',
      created_at: new Date().toISOString()
    }

    const { data: insertData, error: insertError } = await supabase
      .from('entity_members')
      .insert([memberData])
      .select()
      .single()

    if (insertError) {
      console.error('❌ [REGISTER] Error insertando miembro:', insertError)
      return NextResponse.json(
        { ok: false, error: 'Error guardando el registro' },
        { status: 500 }
      )
    }

    console.log('✅ [REGISTER] Miembro registrado:', insertData.id)

    // TODO: Enviar email de confirmación con Resend
    // Descomentar cuando esté configurado:
    /*
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@custodia360.es',
        to: email,
        subject: `Bienvenido/a a ${entityData.nombre} - Registro LOPIVI`,
        html: `
          <h1>¡Registro completado!</h1>
          <p>Hola ${nombre},</p>
          <p>Tu registro en ${entityData.nombre} ha sido recibido correctamente.</p>
          <p>Rol: ${rol}</p>
          <p>Recibirás un email de confirmación cuando tu registro sea validado.</p>
        `
      })
      console.log('📧 [REGISTER] Email de confirmación enviado a:', email)
    } catch (emailError) {
      console.error('❌ [REGISTER] Error enviando email:', emailError)
    }
    */

    return NextResponse.json({
      ok: true,
      member_id: insertData.id,
      message: 'Registro completado correctamente'
    })

  } catch (error: any) {
    console.error('❌ [REGISTER] Error inesperado:', error)
    return NextResponse.json(
      { ok: false, error: 'Error del servidor', details: error.message },
      { status: 500 }
    )
  }
}
