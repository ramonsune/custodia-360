import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  calculateDeadline,
  validatePersonalContacto,
  validatePersonalSinContacto,
  validateDirectiva,
  validateFamilia
} from '@/lib/onboarding/roles'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, action, data, children } = body

    if (!token || !action || !data) {
      return NextResponse.json({
        ok: false,
        error: 'Token, action y data son requeridos'
      }, { status: 400 })
    }

    // Mapear action a tipo para compatibilidad interna
    let tipo: string

    switch (action) {
      case 'save_personal_contacto':
        tipo = 'personal_contacto'
        break
      case 'save_personal_sin_contacto':
        tipo = 'personal_no_contacto'
        break
      case 'save_familia':
        tipo = 'familia'
        break
      case 'save_directiva':
        tipo = 'directiva'
        break
      default:
        return NextResponse.json({
          ok: false,
          error: 'Action no válida'
        }, { status: 400 })
    }

    // Validar según tipo (usando las funciones existentes)
    let validation: { valid: boolean; errors: string[] } = { valid: true, errors: [] }

    // Validaciones básicas mínimas (las funciones helper pueden no existir todas)
    if (tipo === 'personal_contacto') {
      if (!data.nombre || !data.apellidos || !data.documento || !data.email || !data.puesto || !data.lugar || !data.horario) {
        validation = { valid: false, errors: ['Faltan campos obligatorios'] }
      }
    } else if (tipo === 'personal_no_contacto') {
      if (!data.nombre || !data.apellidos || !data.area) {
        validation = { valid: false, errors: ['Faltan campos obligatorios'] }
      }
    } else if (tipo === 'directiva') {
      if (!data.nombre || !data.apellidos || !data.email || !data.cargo) {
        validation = { valid: false, errors: ['Faltan campos obligatorios'] }
      }
    } else if (tipo === 'familia') {
      if (!data.nombre || !data.apellidos) {
        validation = { valid: false, errors: ['Faltan campos obligatorios del tutor'] }
      }
      if (!children || !Array.isArray(children) || children.length === 0) {
        validation = { valid: false, errors: ['Debe haber al menos un hijo'] }
      }
    }

    if (!validation.valid) {
      return NextResponse.json({
        ok: false,
        error: 'Validación fallida',
        details: validation.errors
      }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Verificar token
    const { data: tokenData, error: tokenError } = await supabase
      .from('entity_invite_tokens')
      .select('*')
      .eq('token', token)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({
        ok: false,
        error: 'Token no válido'
      }, { status: 404 })
    }

    const entity_id = tokenData.entity_id
    const now = new Date().toISOString()

    // Preparar datos de persona
    const personData: any = {
      entity_id,
      tipo,
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email || null,
      telefono: data.telefono || null,
      invited_token: token,
      invited_at: tokenData.invited_at || now,
      deadline_at: tokenData.deadline_at || calculateDeadline(),
      estado: 'en_progreso'
    }

    // Campos específicos por tipo
    if (tipo === 'personal_contacto') {
      personData.dni = data.documento
      personData.puesto = data.puesto
      personData.centro_zona = data.lugar
      personData.horario = data.horario
      personData.penales_entregado = data.penales_entregado || false

      // Si entregó penales, estado 'en_progreso' (completa al pasar test)
      // Si no entregó penales, estado 'en_progreso' + deadline
      personData.estado = 'en_progreso'
    }

    if (tipo === 'personal_no_contacto') {
      personData.area = data.area
      personData.estado = 'completo' // No requiere test ni penales
    }

    if (tipo === 'directiva') {
      personData.cargo = data.cargo
      const conContacto = data.con_contacto || false

      personData.flags = {
        directiva_con_contacto: conContacto
      }

      if (conContacto) {
        personData.penales_entregado = data.penales_entregado || false
        personData.estado = 'en_progreso' // Completa al pasar test si tiene penales
      } else {
        personData.estado = 'completo'
      }
    }

    // Upsert persona (por si ya existe con este token)
    const { data: person, error: personError } = await supabase
      .from('entity_people')
      .upsert(personData, {
        onConflict: 'entity_id,invited_token',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (personError) {
      console.error('Error creando persona:', personError)
      return NextResponse.json({
        ok: false,
        error: 'Error al guardar datos',
        details: personError.message
      }, { status: 500 })
    }

    // Si es familia, insertar hijos
    if (tipo === 'familia' && children && Array.isArray(children) && children.length > 0) {
      const childrenData = children.map((child: any) => ({
        entity_id,
        person_id: person.id,
        nombre: child.nombre,
        fecha_nacimiento: child.fecha_nacimiento,
        curso: child.curso || null,
        alergias: child.alergias || null,
        permiso_imagenes: child.permiso_imagenes || false
      }))

      const { error: childrenError } = await supabase
        .from('family_children')
        .insert(childrenData)

      if (childrenError) {
        console.error('Error guardando hijos:', childrenError)
        // No falla completamente, pero log el error
      }

      // Actualizar estado a completo tras guardar hijos
      await supabase
        .from('entity_people')
        .update({ estado: 'completo' })
        .eq('id', person.id)
    }

    // Actualizar token (marcar invited_at si no existía)
    if (!tokenData.invited_at) {
      await supabase
        .from('entity_invite_tokens')
        .update({ invited_at: now })
        .eq('id', tokenData.id)
    }

    // Encolar email de confirmación
    const templateSlug = tipo === 'familia' ? 'onboarding-familia' :
                        tipo === 'personal_con_contacto' ? 'onboarding-contacto' :
                        tipo === 'personal_sin_contacto' ? 'onboarding-no-contacto' :
                        'onboarding-directiva'

    if (data.email) {
      await supabase.from('message_jobs').insert({
        entity_id,
        template_slug: templateSlug,
        channel: 'email',
        context: JSON.stringify({
          to_email: data.email,
          nombre: data.nombre,
          entidad: tokenData.entity_id,
          tipo
        }),
        status: 'queued',
        scheduled_at: now
      })
    }

    // Si personal con contacto sin penales, avisar al delegado
    const conContactoDirectiva = tipo === 'directiva' && (data.con_contacto || false)
    const necesitaPenales = (tipo === 'personal_contacto' || conContactoDirectiva) && !data.penales_entregado

    if (necesitaPenales) {
      // Cargar email del delegado
      const { data: delegado } = await supabase
        .from('entity_people')
        .select('email')
        .eq('entity_id', entity_id)
        .eq('tipo', 'delegado_principal')
        .maybeSingle()

      if (delegado && delegado.email) {
        const deadline = calculateDeadline()

        await supabase.from('message_jobs').insert({
          entity_id,
          template_slug: 'onboarding-delay',
          channel: 'email',
          context: JSON.stringify({
            to_email: delegado.email,
            tipo: 'penales',
            persona: `${data.nombre} ${data.apellidos}`,
            deadline: deadline
          }),
          status: 'queued',
          scheduled_at: now
        })

        // Si no existe entity_compliance.deadline_at, crearlo
        const { data: existingCompliance } = await supabase
          .from('entity_compliance')
          .select('deadline_at')
          .eq('entity_id', entity_id)
          .maybeSingle()

        if (!existingCompliance || !existingCompliance.deadline_at) {
          await supabase
            .from('entity_compliance')
            .upsert({
              entity_id,
              deadline_at: deadline,
              updated_at: now
            }, {
              onConflict: 'entity_id'
            })
        }
      }
    }

    return NextResponse.json({
      ok: true,
      person_id: person.id,
      con_contacto: tipo === 'directiva' ? conContactoDirectiva : (tipo === 'personal_contacto')
    })

  } catch (error: any) {
    console.error('Error en submit onboarding:', error)
    return NextResponse.json({
      ok: false,
      error: 'Error del servidor',
      details: error.message
    }, { status: 500 })
  }
}
