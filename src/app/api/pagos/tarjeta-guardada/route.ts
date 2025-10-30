import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const delegado_id = searchParams.get('delegado_id')

    if (!delegado_id) {
      return NextResponse.json({
        success: false,
        error: 'ID de delegado requerido'
      }, { status: 400 })
    }

    // Buscar tarjeta guardada activa para el delegado
    const { data: tarjeta, error } = await supabase
      .from('tarjetas_delegados')
      .select(`
        id,
        marca_tarjeta,
        ultimos_4_digitos,
        mes_vencimiento,
        año_vencimiento,
        titular_tarjeta,
        fecha_creacion,
        activa
      `)
      .eq('delegado_id', delegado_id)
      .eq('activa', true)
      .order('fecha_creacion', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No se encontró tarjeta guardada
        return NextResponse.json({
          success: true,
          tarjeta: null,
          message: 'No hay tarjeta guardada para este delegado'
        })
      }

      console.error('❌ Error obteniendo tarjeta guardada:', error)
      return NextResponse.json({
        success: false,
        error: 'Error consultando tarjeta en la base de datos'
      }, { status: 500 })
    }

    // Formatear tarjeta para el frontend
    const tarjetaFormateada = {
      id: tarjeta.id,
      marca: tarjeta.marca_tarjeta,
      ultimos4: tarjeta.ultimos_4_digitos,
      vencimiento: `${tarjeta.mes_vencimiento.toString().padStart(2, '0')}/${tarjeta.año_vencimiento.toString().slice(-2)}`,
      titular: tarjeta.titular_tarjeta,
      fechaGuardada: tarjeta.fecha_creacion?.split('T')[0] || ''
    }

    return NextResponse.json({
      success: true,
      tarjeta: tarjetaFormateada
    })

  } catch (error) {
    console.error('❌ Error en GET /api/pagos/tarjeta-guardada:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      delegado_id,
      entidad_id,
      marca_tarjeta,
      ultimos_4_digitos,
      mes_vencimiento,
      año_vencimiento,
      titular_tarjeta,
      token_stripe // Token seguro de Stripe para la tarjeta
    } = body

    // Validaciones
    if (!delegado_id || !entidad_id || !marca_tarjeta || !ultimos_4_digitos || !mes_vencimiento || !año_vencimiento || !titular_tarjeta) {
      return NextResponse.json({
        success: false,
        error: 'Todos los campos son obligatorios'
      }, { status: 400 })
    }

    // Desactivar tarjetas anteriores del delegado
    await supabase
      .from('tarjetas_delegados')
      .update({ activa: false })
      .eq('delegado_id', delegado_id)

    // Guardar nueva tarjeta
    const nuevaTarjeta = {
      delegado_id,
      entidad_id,
      marca_tarjeta,
      ultimos_4_digitos,
      mes_vencimiento,
      año_vencimiento,
      titular_tarjeta,
      token_stripe_customer: token_stripe, // Token de Stripe para pagos futuros
      activa: true,
      fecha_creacion: new Date().toISOString()
    }

    const { data: tarjeta, error } = await supabase
      .from('tarjetas_delegados')
      .insert(nuevaTarjeta)
      .select()
      .single()

    if (error) {
      console.error('❌ Error guardando tarjeta:', error)
      return NextResponse.json({
        success: false,
        error: 'Error guardando tarjeta en la base de datos'
      }, { status: 500 })
    }

    // Registrar en historial de auditoría
    await supabase.from('historial_auditoria').insert({
      entidad_id,
      tipo_evento: 'tarjeta_guardada',
      descripcion: `Tarjeta guardada para pagos futuros`,
      usuario_id: delegado_id,
      fecha_evento: new Date().toISOString(),
      detalles_json: {
        marca: marca_tarjeta,
        ultimos_4: ultimos_4_digitos
      }
    })

    return NextResponse.json({
      success: true,
      tarjeta: {
        id: tarjeta.id,
        marca: tarjeta.marca_tarjeta,
        ultimos4: tarjeta.ultimos_4_digitos,
        vencimiento: `${tarjeta.mes_vencimiento.toString().padStart(2, '0')}/${tarjeta.año_vencimiento.toString().slice(-2)}`,
        titular: tarjeta.titular_tarjeta
      },
      message: 'Tarjeta guardada exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en POST /api/pagos/tarjeta-guardada:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const delegado_id = searchParams.get('delegado_id')
    const tarjeta_id = searchParams.get('tarjeta_id')

    if (!delegado_id || !tarjeta_id) {
      return NextResponse.json({
        success: false,
        error: 'ID de delegado y tarjeta requeridos'
      }, { status: 400 })
    }

    // Desactivar tarjeta (no eliminar por temas de auditoría)
    const { error } = await supabase
      .from('tarjetas_delegados')
      .update({
        activa: false,
        fecha_eliminacion: new Date().toISOString()
      })
      .eq('id', tarjeta_id)
      .eq('delegado_id', delegado_id)

    if (error) {
      console.error('❌ Error eliminando tarjeta:', error)
      return NextResponse.json({
        success: false,
        error: 'Error eliminando tarjeta de la base de datos'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Tarjeta eliminada exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en DELETE /api/pagos/tarjeta-guardada:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}
