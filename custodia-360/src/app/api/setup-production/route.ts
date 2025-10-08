import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('🚀 CONFIGURANDO CUSTODIA360 PARA PRODUCCIÓN...')

    const results = {
      success: true,
      steps: [],
      errors: [],
      production_data: {
        entidades: 0,
        delegados: 0,
        created: []
      }
    }

    // Paso 1: Crear entidad de producción real
    console.log('🏢 Creando entidad de producción...')
    let entidadId

    // Verificar si ya existe
    const { data: existingEntity } = await supabase
      .from('entidades')
      .select('id')
      .eq('cif', 'B87654321')
      .maybeSingle()

    if (existingEntity) {
      entidadId = existingEntity.id
      results.steps.push('✅ Entidad de producción ya existe')
    } else {
      const { data: newEntity, error: entityError } = await supabase
        .from('entidades')
        .insert({
          nombre: 'Custodia360 Demo Sports Club',
          cif: 'B87654321',
          direccion: 'Av. del Deporte 123',
          ciudad: 'Madrid',
          codigo_postal: '28045',
          provincia: 'Madrid',
          telefono: '915555000',
          email: 'contacto@custodia360demo.es',
          tipo_entidad: 'deportivo',
          numero_menores: 150,
          plan: 'Plan Professional',
          precio_mensual: 59.99,
          dashboard_email: 'admin@custodia360demo.es',
          dashboard_password: 'CustodiaAdmin2025!',
          legal_hash: 'prod_hash_' + Date.now()
        })
        .select('id')
        .single()

      if (entityError) {
        throw new Error(`Error creando entidad: ${entityError.message}`)
      }

      entidadId = newEntity.id
      results.steps.push('✅ Entidad de producción creada')
      results.production_data.created.push('Entidad Custodia360 Demo Sports Club')
    }

    // Paso 2: Crear/verificar delegados de producción
    console.log('👥 Configurando delegados de producción...')
    const delegadosProduccion = [
      {
        entidad_id: entidadId,
        tipo: 'principal',
        nombre: 'Maria',
        apellidos: 'García López',
        dni: '12345678A',
        telefono: '+34612345678',
        email: 'maria.garcia@clubdeportivo.com',
        password: 'delegado123',
        experiencia: 'Delegada de Protección certificada con 5 años de experiencia en gestión deportiva infantil',
        disponibilidad: 'Tiempo completo',
        certificado_penales: true,
        fecha_vencimiento_cert: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
        estado: 'activo'
      },
      {
        entidad_id: entidadId,
        tipo: 'suplente',
        nombre: 'Carlos',
        apellidos: 'Rodríguez Fernández',
        dni: '87654321B',
        telefono: '+34698765432',
        email: 'carlos.rodriguez@clubdeportivo.com',
        password: 'suplente123',
        experiencia: 'Monitor deportivo especializado en protección infantil',
        disponibilidad: 'Tiempo parcial - fines de semana',
        certificado_penales: true,
        fecha_vencimiento_cert: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
        estado: 'activo'
      }
    ]

    for (const delegado of delegadosProduccion) {
      // Verificar si ya existe
      const { data: existing } = await supabase
        .from('delegados')
        .select('id, email')
        .eq('email', delegado.email)
        .maybeSingle()

      if (existing) {
        results.steps.push(`✅ Delegado ${delegado.tipo} ya existe: ${delegado.email}`)
      } else {
        const { error: delegadoError } = await supabase
          .from('delegados')
          .insert(delegado)

        if (delegadoError) {
          results.errors.push(`Error creando delegado ${delegado.tipo}: ${delegadoError.message}`)
          results.success = false
        } else {
          results.steps.push(`✅ Delegado ${delegado.tipo} creado: ${delegado.email}`)
          results.production_data.created.push(`Delegado ${delegado.tipo}: ${delegado.nombre} ${delegado.apellidos}`)
          results.production_data.delegados++
        }
      }
    }

    // Paso 3: Crear casos de ejemplo para demo en vivo
    console.log('📋 Creando casos de ejemplo...')
    const casosEjemplo = [
      {
        entidad_id: entidadId,
        delegado_id: null, // Se asignará después
        tipo_caso: 'incidencia_menor',
        titulo: 'Supervisión adicional requerida en vestuarios',
        descripcion: 'Necesidad de mejorar supervisión durante cambios de vestuario en categorías menores',
        prioridad: 'media',
        estado: 'en_proceso',
        acciones_inmediatas: 'Implementar protocolo de doble supervisión',
        fecha_limite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        legal_hash: 'caso_demo_' + Date.now()
      },
      {
        entidad_id: entidadId,
        delegado_id: null,
        tipo_caso: 'formacion_personal',
        titulo: 'Actualización formación LOPIVI para nuevo personal',
        descripcion: 'Personal incorporado recientemente requiere formación específica en protocolos LOPIVI',
        prioridad: 'alta',
        estado: 'abierto',
        acciones_inmediatas: 'Programar sesión formativa en próximos 3 días',
        fecha_limite: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días
        legal_hash: 'caso_formacion_' + Date.now()
      }
    ]

    for (const caso of casosEjemplo) {
      const { error: casoError } = await supabase
        .from('casos')
        .insert(caso)

      if (casoError) {
        results.errors.push(`Error creando caso: ${casoError.message}`)
      } else {
        results.steps.push(`✅ Caso de ejemplo creado: ${caso.titulo}`)
        results.production_data.created.push(`Caso: ${caso.titulo}`)
      }
    }

    // Paso 4: Verificar conexiones finales
    console.log('🔍 Verificación final...')
    const { data: finalEntidades, error: countError } = await supabase
      .from('entidades')
      .select('id')

    if (!countError) {
      results.production_data.entidades = finalEntidades?.length || 0
    }

    const { data: finalDelegados } = await supabase
      .from('delegados')
      .select('id')

    results.production_data.delegados = finalDelegados?.length || 0

    results.steps.push('✅ Verificación final completada')
    results.steps.push(`📊 Sistema configurado: ${results.production_data.entidades} entidades, ${results.production_data.delegados} delegados`)

    console.log('🎉 CONFIGURACIÓN DE PRODUCCIÓN COMPLETADA')

    return NextResponse.json({
      success: results.success,
      message: results.success
        ? '🎉 CUSTODIA360 CONFIGURADO PARA PRODUCCIÓN'
        : '⚠️ Configuración completada con errores',
      steps: results.steps,
      errors: results.errors,
      production_data: results.production_data,
      credentials: {
        principal: {
          email: 'maria.garcia@clubdeportivo.com',
          password: 'delegado123',
          url: '/login-delegados?tipo=principal'
        },
        suplente: {
          email: 'carlos.rodriguez@clubdeportivo.com',
          password: 'suplente123',
          url: '/login-delegados?tipo=suplente'
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error en configuración de producción:', error)
    return NextResponse.json({
      success: false,
      error: 'Error crítico en configuración',
      details: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
