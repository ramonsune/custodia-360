import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entidad_id = searchParams.get('entidad_id')
    const solo_formados = searchParams.get('solo_formados') === 'true'
    const incluir_certificados = searchParams.get('incluir_certificados') === 'true'

    if (!entidad_id) {
      return NextResponse.json({
        success: false,
        error: 'ID de entidad requerido'
      }, { status: 400 })
    }

    // Consulta principal con LEFT JOIN para incluir datos de formación
    let query = supabase
      .from('personal_entidad')
      .select(`
        id,
        nombre_completo,
        cargo,
        email,
        telefono,
        fecha_contratacion,
        estado,
        fecha_creacion,
        formacion_lopivi:formacion_personal_lopivi(
          id,
          fecha_formacion,
          tipo_formacion,
          horas_formacion,
          certificado_emitido,
          fecha_vencimiento_certificado,
          calificacion,
          entidad_formadora,
          observaciones
        )
      `)
      .eq('entidad_id', entidad_id)
      .eq('estado', 'activo')

    // Si incluir certificados, también obtener certificados penales
    if (incluir_certificados) {
      query = query.select(`
        *,
        certificado_antecedentes,
        fecha_emision_antecedentes,
        fecha_vencimiento_antecedentes,
        certificado_delitos_sexuales,
        fecha_emision_delitos_sexuales,
        fecha_vencimiento_delitos_sexuales
      `)
    }

    const { data: personal, error } = await query.order('nombre_completo')

    if (error) {
      console.error('❌ Error obteniendo personal:', error)
      return NextResponse.json({
        success: false,
        error: 'Error consultando personal en la base de datos'
      }, { status: 500 })
    }

    // Procesar y formatear datos
    const personalFormateado = personal?.map(persona => {
      const formacionLopivi = persona.formacion_lopivi?.[0] // Tomar la formación más reciente
      const fechaHoy = new Date()

      // Determinar si está formado
      let formado = false
      let certificadoVigente = false

      if (formacionLopivi) {
        formado = formacionLopivi.certificado_emitido || false

        if (formacionLopivi.fecha_vencimiento_certificado) {
          const fechaVencimiento = new Date(formacionLopivi.fecha_vencimiento_certificado)
          certificadoVigente = fechaVencimiento > fechaHoy
        }
      }

      // Determinar estado de certificados penales
      let certificadosPenalesVigentes = false
      if (incluir_certificados) {
        const antecedentesVigentes = persona.fecha_vencimiento_antecedentes ?
          new Date(persona.fecha_vencimiento_antecedentes) > fechaHoy : false
        const delitosSexualesVigentes = persona.fecha_vencimiento_delitos_sexuales ?
          new Date(persona.fecha_vencimiento_delitos_sexuales) > fechaHoy : false

        certificadosPenalesVigentes = antecedentesVigentes && delitosSexualesVigentes
      }

      return {
        id: persona.id,
        nombre: persona.nombre_completo,
        cargo: persona.cargo,
        email: persona.email,
        telefono: persona.telefono,
        fechaContratacion: persona.fecha_contratacion?.split('T')[0] || '',
        formado: formado,
        certificado: certificadoVigente,
        fechaFormacion: formacionLopivi?.fecha_formacion?.split('T')[0] || '',
        tipoFormacion: formacionLopivi?.tipo_formacion || '',
        horasFormacion: formacionLopivi?.horas_formacion || 0,
        calificacion: formacionLopivi?.calificacion || '',
        entidadFormadora: formacionLopivi?.entidad_formadora || '',
        fechaVencimientoCertificado: formacionLopivi?.fecha_vencimiento_certificado?.split('T')[0] || '',
        observaciones: formacionLopivi?.observaciones || '',
        ...(incluir_certificados && {
          certificadoAntecedentes: persona.certificado_antecedentes || false,
          fechaEmisionAntecedentes: persona.fecha_emision_antecedentes?.split('T')[0] || '',
          fechaVencimientoAntecedentes: persona.fecha_vencimiento_antecedentes?.split('T')[0] || '',
          certificadoDelitosSexuales: persona.certificado_delitos_sexuales || false,
          fechaEmisionDelitosSexuales: persona.fecha_emision_delitos_sexuales?.split('T')[0] || '',
          fechaVencimientoDelitosSexuales: persona.fecha_vencimiento_delitos_sexuales?.split('T')[0] || '',
          certificadosPenalesVigentes: certificadosPenalesVigentes
        })
      }
    }) || []

    // Filtrar solo formados si se solicita
    const personalFiltrado = solo_formados ?
      personalFormateado.filter(p => p.formado) :
      personalFormateado

    // Calcular estadísticas
    const estadisticas = {
      total_personal: personalFormateado.length,
      personal_formado: personalFormateado.filter(p => p.formado).length,
      personal_sin_formar: personalFormateado.filter(p => !p.formado).length,
      certificados_vigentes: personalFormateado.filter(p => p.certificado).length,
      certificados_vencidos: personalFormateado.filter(p => p.formado && !p.certificado).length,
      porcentaje_formacion: personalFormateado.length > 0 ?
        Math.round((personalFormateado.filter(p => p.formado).length / personalFormateado.length) * 100) : 0,
      ...(incluir_certificados && {
        certificados_penales_vigentes: personalFormateado.filter(p => p.certificadosPenalesVigentes).length,
        certificados_penales_pendientes: personalFormateado.filter(p => !p.certificadosPenalesVigentes).length
      })
    }

    return NextResponse.json({
      success: true,
      personal: personalFiltrado,
      estadisticas: estadisticas,
      total_registros: personalFiltrado.length
    })

  } catch (error) {
    console.error('❌ Error en GET /api/personal-formacion:', error)
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
      personal_id,
      entidad_id,
      fecha_formacion,
      tipo_formacion = 'lopivi_basica',
      horas_formacion = 8,
      calificacion,
      entidad_formadora,
      certificado_emitido = true,
      fecha_vencimiento_certificado,
      observaciones,
      instructor_id
    } = body

    // Validaciones
    if (!personal_id || !entidad_id || !fecha_formacion) {
      return NextResponse.json({
        success: false,
        error: 'Campos obligatorios: personal_id, entidad_id, fecha_formacion'
      }, { status: 400 })
    }

    // Verificar que el personal existe
    const { data: personal, error: personalError } = await supabase
      .from('personal_entidad')
      .select('id, nombre_completo')
      .eq('id', personal_id)
      .eq('entidad_id', entidad_id)
      .single()

    if (personalError || !personal) {
      return NextResponse.json({
        success: false,
        error: 'Personal no encontrado'
      }, { status: 404 })
    }

    // Crear registro de formación
    const nuevaFormacion = {
      personal_id,
      entidad_id,
      fecha_formacion,
      tipo_formacion,
      horas_formacion,
      calificacion,
      entidad_formadora,
      certificado_emitido,
      fecha_vencimiento_certificado: fecha_vencimiento_certificado ||
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 año por defecto
      observaciones,
      instructor_id,
      fecha_creacion: new Date().toISOString()
    }

    const { data: formacion, error } = await supabase
      .from('formacion_personal_lopivi')
      .insert(nuevaFormacion)
      .select()
      .single()

    if (error) {
      console.error('❌ Error registrando formación:', error)
      return NextResponse.json({
        success: false,
        error: 'Error registrando formación en la base de datos'
      }, { status: 500 })
    }

    // Registrar en historial de auditoría
    await supabase.from('historial_auditoria').insert({
      entidad_id,
      tipo_evento: 'formacion_registrada',
      descripcion: `Formación LOPIVI registrada para ${personal.nombre_completo}`,
      usuario_id: instructor_id,
      fecha_evento: new Date().toISOString(),
      detalles_json: {
        personal_id,
        tipo_formacion,
        horas_formacion,
        certificado_emitido
      }
    })

    return NextResponse.json({
      success: true,
      formacion: {
        id: formacion.id,
        personalId: formacion.personal_id,
        fechaFormacion: formacion.fecha_formacion?.split('T')[0] || '',
        tipoFormacion: formacion.tipo_formacion,
        horasFormacion: formacion.horas_formacion,
        calificacion: formacion.calificacion,
        certificadoEmitido: formacion.certificado_emitido,
        fechaVencimientoCertificado: formacion.fecha_vencimiento_certificado?.split('T')[0] || ''
      },
      message: 'Formación registrada exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en POST /api/personal-formacion:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      formacion_id,
      personal_id,
      fecha_formacion,
      tipo_formacion,
      horas_formacion,
      calificacion,
      entidad_formadora,
      certificado_emitido,
      fecha_vencimiento_certificado,
      observaciones,
      usuario_id
    } = body

    if (!formacion_id) {
      return NextResponse.json({
        success: false,
        error: 'ID de formación requerido'
      }, { status: 400 })
    }

    // Preparar datos de actualización
    const datosActualizacion: any = {
      fecha_actualizacion: new Date().toISOString()
    }

    if (fecha_formacion) datosActualizacion.fecha_formacion = fecha_formacion
    if (tipo_formacion) datosActualizacion.tipo_formacion = tipo_formacion
    if (horas_formacion !== undefined) datosActualizacion.horas_formacion = horas_formacion
    if (calificacion) datosActualizacion.calificacion = calificacion
    if (entidad_formadora) datosActualizacion.entidad_formadora = entidad_formadora
    if (certificado_emitido !== undefined) datosActualizacion.certificado_emitido = certificado_emitido
    if (fecha_vencimiento_certificado) datosActualizacion.fecha_vencimiento_certificado = fecha_vencimiento_certificado
    if (observaciones) datosActualizacion.observaciones = observaciones

    const { data: formacion, error } = await supabase
      .from('formacion_personal_lopivi')
      .update(datosActualizacion)
      .eq('id', formacion_id)
      .select(`
        *,
        personal_entidad:personal_id(nombre_completo, entidad_id)
      `)
      .single()

    if (error) {
      console.error('❌ Error actualizando formación:', error)
      return NextResponse.json({
        success: false,
        error: 'Error actualizando formación en la base de datos'
      }, { status: 500 })
    }

    // Registrar en historial
    if (usuario_id && formacion.personal_entidad) {
      await supabase.from('historial_auditoria').insert({
        entidad_id: formacion.personal_entidad.entidad_id,
        tipo_evento: 'formacion_actualizada',
        descripcion: `Formación LOPIVI actualizada para ${formacion.personal_entidad.nombre_completo}`,
        usuario_id: usuario_id,
        fecha_evento: new Date().toISOString(),
        detalles_json: {
          formacion_id,
          cambios: Object.keys(datosActualizacion)
        }
      })
    }

    return NextResponse.json({
      success: true,
      formacion: {
        id: formacion.id,
        personalId: formacion.personal_id,
        fechaFormacion: formacion.fecha_formacion?.split('T')[0] || '',
        tipoFormacion: formacion.tipo_formacion,
        horasFormacion: formacion.horas_formacion,
        calificacion: formacion.calificacion,
        certificadoEmitido: formacion.certificado_emitido,
        fechaVencimientoCertificado: formacion.fecha_vencimiento_certificado?.split('T')[0] || '',
        observaciones: formacion.observaciones
      },
      message: 'Formación actualizada exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en PUT /api/personal-formacion:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}
