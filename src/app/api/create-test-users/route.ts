import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('🚀 Creating test users in Supabase...')

    // Step 1: Create test entity if not exists
    const { data: existingEntity, error: checkEntityError } = await supabase
      .from('entidades')
      .select('id')
      .eq('cif', 'A12345678')
      .maybeSingle()

    let entidadId = existingEntity?.id

    if (!entidadId) {
      console.log('📝 Creating test entity...')
      const { data: newEntity, error: entityError } = await supabase
        .from('entidades')
        .insert({
          nombre: 'Club Deportivo Demo',
          cif: 'A12345678',
          direccion: 'Calle Demo 123',
          ciudad: 'Madrid',
          codigo_postal: '28001',
          provincia: 'Madrid',
          telefono: '912345678',
          email: 'admin@clubdemo.com',
          tipo_entidad: 'deportivo',
          numero_menores: 50,
          plan: 'Plan Básico',
          precio_mensual: 29.99,
          dashboard_email: 'admin@clubdemo.com',
          dashboard_password: 'admin123',
          legal_hash: 'demo_hash_' + Date.now()
        })
        .select('id')
        .single()

      if (entityError) {
        throw new Error(`Error creating entity: ${entityError.message}`)
      }

      entidadId = newEntity.id
      console.log('✅ Test entity created with ID:', entidadId)
    } else {
      console.log('✅ Test entity already exists with ID:', entidadId)
    }

    // Step 2: Create test delegados
    const testDelegados = [
      {
        entidad_id: entidadId,
        tipo: 'principal',
        nombre: 'Maria',
        apellidos: 'García López',
        dni: '12345678A',
        telefono: '612345678',
        email: 'maria.garcia@clubdeportivo.com',
        password: 'delegado123',
        experiencia: 'Formadora deportiva con 5 años de experiencia',
        disponibilidad: 'Tiempo completo',
        certificado_penales: true,
        estado: 'activo'
      },
      {
        entidad_id: entidadId,
        tipo: 'suplente',
        nombre: 'Carlos',
        apellidos: 'Rodríguez Fernández',
        dni: '87654321B',
        telefono: '698765432',
        email: 'carlos.rodriguez@clubdeportivo.com',
        password: 'suplente123',
        experiencia: 'Monitor deportivo',
        disponibilidad: 'Tiempo parcial',
        certificado_penales: true,
        estado: 'activo'
      }
    ]

    const results = []

    for (const delegado of testDelegados) {
      // Check if delegado already exists
      const { data: existing } = await supabase
        .from('delegados')
        .select('id, email')
        .eq('email', delegado.email)
        .maybeSingle()

      if (existing) {
        console.log(`✅ Delegado already exists: ${delegado.email}`)
        results.push({ email: delegado.email, status: 'already_exists', id: existing.id })
      } else {
        // Create new delegado
        const { data: newDelegado, error: delegadoError } = await supabase
          .from('delegados')
          .insert(delegado)
          .select('id, email')
          .single()

        if (delegadoError) {
          console.error(`❌ Error creating delegado ${delegado.email}:`, delegadoError)
          results.push({ email: delegado.email, status: 'error', error: delegadoError.message })
        } else {
          console.log(`✅ Delegado created: ${delegado.email}`)
          results.push({ email: delegado.email, status: 'created', id: newDelegado.id })
        }
      }
    }

    // Step 3: Verify credentials work
    const credentialTests = []
    for (const delegado of testDelegados) {
      const { data: testLogin, error: testError } = await supabase
        .from('delegados')
        .select(`
          id,
          nombre,
          apellidos,
          email,
          tipo,
          entidades!inner(nombre)
        `)
        .eq('email', delegado.email)
        .eq('password', delegado.password)
        .eq('estado', 'activo')
        .maybeSingle()

      credentialTests.push({
        email: delegado.email,
        password: delegado.password,
        loginTest: testLogin ? 'SUCCESS' : 'FAIL',
        error: testError?.message || null
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Test users creation completed',
      results: {
        entity: { id: entidadId, status: existingEntity ? 'existing' : 'created' },
        delegados: results,
        credentialTests
      }
    })

  } catch (error) {
    console.error('❌ Error creating test users:', error)
    return NextResponse.json({
      success: false,
      error: 'Error creating test users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
