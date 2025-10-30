import { NextRequest, NextResponse } from 'next/server'
import { supabase, logAuditAction } from '@/lib/supabase'

interface PersonalData {
  entidad_id: string
  nombre: string
  apellidos: string
  dni: string
  email?: string
  telefono?: string
  fecha_nacimiento?: string
  cargo: string
  fecha_inicio?: string
  tipo_contrato?: 'indefinido' | 'temporal' | 'practicas' | 'voluntario'
  contacto_directo_menores?: boolean
  formacion_lopivi_completada?: boolean
  fecha_formacion_lopivi?: string
  certificado_lopivi_vigente?: boolean
  created_by?: string
}

// Función para generar hash legal
function generateLegalHash(data: any): string {
  const timestamp = new Date().toISOString()
  const dataString = JSON.stringify(data) + timestamp
  return btoa(dataString).slice(0, 32)
}

// POST - Crear nuevo personal
export async function POST(request: NextRequest) {
  try {
    const data: PersonalData = await request.json()

    // Validaciones básicas
    if (!data.entidad_id || !data.nombre || !data.apellidos || !data.dni || !data.cargo) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: entidad_id, nombre, apellidos, dni, cargo' },
        { status: 400 }
      )
    }

    // Verificar que la entidad existe
    const { data: entidad, error: entidadError } = await supabase
      .from('entidades')
      .select('id, nombre')
      .eq('id', data.entidad_id)
      .single()

    if (entidadError || !entidad) {
      return NextResponse.json(
        { error: 'Entidad no encontrada' },
        { status: 404 }
      )
    }

    // Preparar datos para inserción
    const personalData = {
      entidad_id: data.entidad_id,
      nombre: data.nombre,
      apellidos: data.apellidos,
      dni: data.dni,
      email: data.email,
      telefono: data.telefono,
      fecha_nacimiento: data.fecha_nacimiento,
      cargo: data.cargo,
      fecha_inicio: data.fecha_inicio || new Date().toISOString(),
      tipo_contrato: data.tipo_contrato || 'indefinido',
      contacto_directo_menores: data.contacto_directo_menores ?? true,
      formacion_lopivi_completada: data.formacion_lopivi_completada || false,
      fecha_formacion_lopivi: data.fecha_formacion_lopivi,
      certificado_lopivi_vigente: data.certificado_lopivi_vigente || false,
      created_by: data.created_by,
      legal_hash: generateLegalHash(data)
    }

    // Insertar personal en la base de datos
    const { data: personalCreado, error: personalError } = await supabase
      .from('personal')
      .insert([personalData])
      .select(`
        *,
        entidades!inner(nombre)
      `)
      .single()

    if (personalError) {
      console.error('❌ Error creando personal:', personalError)
      return NextResponse.json(
        { error: 'Error creando personal', details: personalError.message },
        { status: 500 }
      )
    }

    console.log('✅ Personal creado:', personalCreado.dni)

    // Registrar en auditoría LOPIVI
    await logAuditAction({
      user_name: 'Sistema',
      action_type: 'personal_creado',
      entity_type: 'personal',
      entity_id: personalCreado.id,
      details: {
        nombre_completo: `${personalCreado.nombre} ${personalCreado.apellidos}`,
        dni: personalCreado.dni,
        cargo: personalCreado.cargo,
        entidad: personalCreado.entidades.nombre,
        contacto_menores: personalCreado.contacto_directo_menores
      }
    })

    return NextResponse.json({
      success: true,
      personal: {
        id: personalCreado.id,
        nombre: personalCreado.nombre,
        apellidos: personalCreado.apellidos,
        dni: personalCreado.dni,
        cargo: personalCreado.cargo,
        estado: personalCreado.estado
      },
      message: 'Personal creado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API personal:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// GET - Obtener personal de una entidad
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entidadId = searchParams.get('entidad_id')
    const estado = searchParams.get('estado') || 'activo'
    const soloContactoMenores = searchParams.get('contacto_menores') === 'true'
    const incluirFormaciones = searchParams.get('incluir_formaciones') === 'true'

    if (!entidadId) {
      return NextResponse.json(
        { error: 'entidad_id es requerido' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('personal')
      .select(`
        *,
        entidades!inner(nombre),
        personal_formaciones(
          *,
          formaciones_lopivi(titulo, tipo, duracion_horas)
        )
      `)
      .eq('entidad_id', entidadId)
      .eq('estado', estado)
      .order('apellidos', { ascending: true })

    if (soloContactoMenores) {
      query = query.eq('contacto_directo_menores', true)
    }

    const { data: personal, error } = await query

    if (error) {
      console.error('❌ Error obteniendo personal:', error)
      return NextResponse.json(
        { error: 'Error obteniendo personal', details: error.message },
        { status: 500 }
      )
    }

    // Procesar datos para el frontend
    const personalFormateado = personal?.map(persona => {
      // Calcular días restantes para vencimiento de certificado
      let diasRestantesCertificado = null
      if (persona.fecha_vencimiento_certificado) {
        const hoy = new Date()
        const vencimiento = new Date(persona.fecha_vencimiento_certificado)
        diasRestantesCertificado = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
      }

      return {
        id: persona.id,
        nombre: persona.nombre,
        apellidos: persona.apellidos,
        nombre_completo: `${persona.nombre} ${persona.apellidos}`,
        dni: persona.dni,
        email: persona.email,
        telefono: persona.telefono,
        cargo: persona.cargo,
        fecha_inicio: persona.fecha_inicio,
        estado: persona.estado,
        contacto_directo_menores: persona.contacto_directo_menores,

        // Formación LOPIVI
        formado: persona.formacion_lopivi_completada,
        fecha_formacion: persona.fecha_formacion_lopivi,
        certificado: persona.certificado_lopivi_vigente,
        fecha_vencimiento_certificado: persona.fecha_vencimiento_certificado,
        dias_restantes_certificado: diasRestantesCertificado,

        // Certificados penales
        certificado_antecedentes: persona.certificado_antecedentes_penales,
        fecha_vencimiento_antecedentes: persona.fecha_vencimiento_antecedentes,

        // Formaciones si se solicitan
        formaciones: incluirFormaciones ? persona.personal_formaciones : undefined,

        entidad: persona.entidades?.nombre
      }
    }) || []

    // Calcular estadísticas
    const totalPersonal = personalFormateado.length
    const personalContactoMenores = personalFormateado.filter(p => p.contacto_directo_menores)
    const personalFormado = personalContactoMenores.filter(p => p.formado && p.certificado)
    const porcentajeFormacion = personalContactoMenores.length > 0
      ? Math.round((personalFormado.length / personalContactoMenores.length) * 100)
      : 0

    return NextResponse.json({
      success: true,
      personal: personalFormateado,
      estadisticas: {
        total_personal: totalPersonal,
        personal_contacto_menores: personalContactoMenores.length,
        personal_formado: personalFormado.length,
        personal_sin_formar: personalContactoMenores.length - personalFormado.length,
        porcentaje_formacion: porcentajeFormacion,
        certificados_proximos_vencer: personalFormateado.filter(p =>
          p.dias_restantes_certificado !== null && p.dias_restantes_certificado < 30 && p.dias_restantes_certificado > 0
        ).length,
        certificados_vencidos: personalFormateado.filter(p =>
          p.dias_restantes_certificado !== null && p.dias_restantes_certificado <= 0
        ).length
      }
    })

  } catch (error) {
    console.error('❌ Error en GET personal:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar personal
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const personalId = searchParams.get('personal_id')

    if (!personalId) {
      return NextResponse.json(
        { error: 'personal_id es requerido' },
        { status: 400 }
      )
    }

    const updateData = await request.json()
    const legal_hash = generateLegalHash({ ...updateData, personal_id: personalId, timestamp: new Date().toISOString() })

    // Obtener datos actuales para auditoría
    const { data: personalActual, error: personalError } = await supabase
      .from('personal')
      .select('*, entidades(nombre)')
      .eq('id', personalId)
      .single()

    if (personalError || !personalActual) {
      return NextResponse.json(
        { error: 'Personal no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar personal
    const { data: personalActualizado, error: updateError } = await supabase
      .from('personal')
      .update({
        ...updateData,
        legal_hash,
        updated_by: updateData.updated_by
      })
      .eq('id', personalId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error actualizando personal:', updateError)
      return NextResponse.json(
        { error: 'Error actualizando personal', details: updateError.message },
        { status: 500 }
      )
    }

    // Registrar en auditoría LOPIVI
    await logAuditAction({
      user_name: updateData.updated_by_name || 'Sistema',
      action_type: 'personal_actualizado',
      entity_type: 'personal',
      entity_id: personalId,
      details: {
        nombre_completo: `${personalActual.nombre} ${personalActual.apellidos}`,
        campos_actualizados: Object.keys(updateData),
        entidad: personalActual.entidades.nombre
      }
    })

    return NextResponse.json({
      success: true,
      personal: personalActualizado,
      message: 'Personal actualizado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en PUT personal:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Dar de baja personal (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const personalId = searchParams.get('personal_id')
    const motivo = searchParams.get('motivo') || 'Baja solicitada'

    if (!personalId) {
      return NextResponse.json(
        { error: 'personal_id es requerido' },
        { status: 400 }
      )
    }

    // Obtener datos para auditoría
    const { data: personal, error: personalError } = await supabase
      .from('personal')
      .select('*, entidades(nombre)')
      .eq('id', personalId)
      .single()

    if (personalError || !personal) {
      return NextResponse.json(
        { error: 'Personal no encontrado' },
        { status: 404 }
      )
    }

    // Dar de baja (soft delete)
    const { error: updateError } = await supabase
      .from('personal')
      .update({
        estado: 'baja',
        fecha_fin: new Date().toISOString(),
        legal_hash: generateLegalHash({ accion: 'baja', motivo, timestamp: new Date().toISOString() })
      })
      .eq('id', personalId)

    if (updateError) {
      console.error('❌ Error dando de baja personal:', updateError)
      return NextResponse.json(
        { error: 'Error dando de baja personal' },
        { status: 500 }
      )
    }

    // Registrar en auditoría LOPIVI
    await logAuditAction({
      user_name: 'Sistema',
      action_type: 'personal_baja',
      entity_type: 'personal',
      entity_id: personalId,
      details: {
        nombre_completo: `${personal.nombre} ${personal.apellidos}`,
        motivo: motivo,
        entidad: personal.entidades.nombre
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Personal dado de baja exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en DELETE personal:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
