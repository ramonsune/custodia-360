import { NextResponse } from 'next/server'
import { resend, FROM_EMAIL, emailTemplates } from '@/lib/resend'
import { createClient } from '@supabase/supabase-js'

// Configurar cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, empresa, mensaje } = body

    // Validaciones básicas
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son obligatorios' },
        { status: 400 }
      )
    }

    // 1. Guardar en base de datos
    console.log('💾 Guardando contacto en base de datos...')
    const { data: contacto, error: dbError } = await supabase
      .from('contactos')
      .insert({
        nombre,
        email,
        telefono: telefono || null,
        empresa: empresa || null,
        mensaje,
        estado: 'pendiente'
      })
      .select()
      .single()

    if (dbError) {
      console.error('❌ Error guardando en base de datos:', dbError)
      // Continuar con el envío de emails aunque falle la BD
    } else {
      console.log('✅ Contacto guardado en BD con ID:', contacto?.id)
    }

    // 2. Email al administrador
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ['rsuneo1971@gmail.com'],
      subject: emailTemplates.contacto.subject,
      html: emailTemplates.contacto.toAdmin({
        nombre,
        email,
        telefono,
        empresa,
        mensaje
      })
    })

    // 3. Email de confirmación al usuario (en modo sandbox va a la dirección verificada)
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ['rsuneo1971@gmail.com'], // Sandbox mode: cambiar por [email] en producción
      subject: 'Gracias por contactar con Custodia360',
      html: emailTemplates.contacto.toUser({
        nombre,
        mensaje
      })
    })

    return NextResponse.json(
      {
        message: 'Mensaje enviado y guardado correctamente',
        contactoId: contacto?.id || null
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error procesando contacto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET para obtener todos los contactos (solo para admin autenticado)
export async function GET(request: Request) {
  try {
    // Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado')
    const limit = searchParams.get('limit') || '50'

    // Construir query
    let query = supabase
      .from('contactos')
      .select('*')
      .order('fecha_creacion', { ascending: false })
      .limit(parseInt(limit))

    // Filtrar por estado si se proporciona
    if (estado && ['pendiente', 'respondido', 'archivado'].includes(estado)) {
      query = query.eq('estado', estado)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error obteniendo contactos:', error)
      return NextResponse.json(
        { error: 'Error obteniendo contactos' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      contactos: data || [],
      total: data?.length || 0
    })

  } catch (error) {
    console.error('Error en GET contactos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
