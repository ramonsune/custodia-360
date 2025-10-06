import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Testing Supabase connection...')

    // Test 1: Verificar conexión básica
    const { data: testConnection, error: connectionError } = await supabase
      .from('entidades')
      .select('id')
      .limit(1)

    if (connectionError) {
      console.error('❌ Connection error:', connectionError)
      return NextResponse.json({
        success: false,
        error: 'Error de conexión a Supabase',
        details: connectionError,
        tests: {
          connection: false,
          delegados: false,
          entidades: false
        }
      }, { status: 500 })
    }

    console.log('✅ Basic connection successful')

    // Test 2: Verificar tabla delegados
    const { data: delegados, error: delegadosError } = await supabase
      .from('delegados')
      .select(`
        id,
        nombre,
        apellidos,
        email,
        tipo,
        estado,
        entidad_id
      `)
      .eq('estado', 'activo')

    console.log('📊 Delegados encontrados:', delegados?.length || 0)

    // Test 3: Verificar tabla entidades
    const { data: entidades, error: entidadesError } = await supabase
      .from('entidades')
      .select('id, nombre, cif')

    console.log('📊 Entidades encontradas:', entidades?.length || 0)

    // Test 4: Verificar credenciales específicas
    const testCredentials = [
      { email: 'maria.garcia@clubdeportivo.com', password: 'delegado123' },
      { email: 'carlos.rodriguez@clubdeportivo.com', password: 'suplente123' }
    ]

    const credentialTests = []
    for (const cred of testCredentials) {
      const { data: delegado, error } = await supabase
        .from('delegados')
        .select('*')
        .eq('email', cred.email)
        .eq('password', cred.password)
        .eq('estado', 'activo')
        .single()

      credentialTests.push({
        email: cred.email,
        found: !!delegado,
        error: error?.message || null
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection test completed',
      timestamp: new Date().toISOString(),
      tests: {
        connection: !connectionError,
        delegados: !delegadosError,
        entidades: !entidadesError
      },
      data: {
        delegados: {
          count: delegados?.length || 0,
          items: delegados || []
        },
        entidades: {
          count: entidades?.length || 0,
          items: entidades || []
        },
        credentialTests
      },
      environment: {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing',
        supabase_anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
        supabase_service_role: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configured' : 'Missing'
      }
    })

  } catch (error) {
    console.error('❌ Supabase test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Error general en test de Supabase',
      details: error instanceof Error ? error.message : 'Error desconocido',
      tests: {
        connection: false,
        delegados: false,
        entidades: false
      }
    }, { status: 500 })
  }
}
