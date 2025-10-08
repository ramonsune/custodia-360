import { NextRequest, NextResponse } from 'next/server'
import { supabase, logAuditAction } from '@/lib/supabase'

// Función para generar hash legal
function generateLegalHash(data: any): string {
  const timestamp = new Date().toISOString()
  const dataString = JSON.stringify(data) + timestamp
  return btoa(dataString).slice(0, 32)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validaciones básicas
    if (!email || !password) {
      console.log('❌ Email o contraseña faltantes')
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    console.log('🔐 Intentando login formación LOPIVI para:', email)

    // Step 1: Verificar que Supabase esté conectado
    const { error: connectionError } = await supabase
      .from('delegados')
      .select('id')
      .limit(1)

    if (connectionError) {
      console.error('❌ Error de conexión a Supabase:', connectionError)
      return NextResponse.json(
        { error: 'Error de conexión a la base de datos', details: connectionError },
        { status: 500 }
      )
    }

    console.log('✅ Conexión a Supabase OK')

    // Step 2: Buscar delegado con credenciales exactas
    console.log('🔍 Buscando delegado con email:', email)

    const { data: delegado, error: delegadoError } = await supabase
      .from('delegados')
      .select(`
        *,
        entidades!inner(
          id,
          nombre,
          tipo_entidad,
          plan
        )
      `)
      .eq('email', email.toLowerCase().trim())
      .eq('password', password)
      .eq('estado', 'activo')
      .maybeSingle() // Use maybeSingle instead of single to handle no results gracefully

    console.log('📊 Query result:', { delegadoError, delegado: delegado ? 'Found' : 'Not found' })

    if (delegadoError) {
      console.error('❌ Error en query de delegado:', delegadoError)
      return NextResponse.json(
        { error: 'Error consultando credenciales', details: delegadoError },
        { status: 500 }
      )
    }

    if (!delegado) {
      console.log('❌ Credenciales incorrectas para:', email)

      // Debug: Check if user exists with different password
      const { data: userExists } = await supabase
        .from('delegados')
        .select('email, estado')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle()

      if (userExists) {
        console.log('🔍 Usuario existe pero contraseña incorrecta')
        return NextResponse.json(
          { error: 'Contraseña incorrecta' },
          { status: 401 }
        )
      } else {
        console.log('🔍 Usuario no existe en la base de datos')
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        )
      }
    }

    console.log('✅ Login exitoso para delegado:', delegado.nombre, delegado.apellidos)

    // Step 3: Crear datos de sesión para formación
    const sessionData = {
      id: delegado.id,
      entidad_id: delegado.entidad_id,
      nombre: delegado.nombre,
      apellidos: delegado.apellidos,
      email: delegado.email,
      tipo: delegado.tipo, // 'principal' o 'suplente'
      entidad: {
        id: delegado.entidades.id,
        nombre: delegado.entidades.nombre,
        tipo_entidad: delegado.entidades.tipo_entidad,
        plan: delegado.entidades.plan
      },
      certificado_penales: delegado.certificado_penales,
      fecha_vencimiento_cert: delegado.fecha_vencimiento_cert,
      estado: delegado.estado,
      login_type: 'formacion_lopivi',
      session_start: new Date().toISOString()
    }

    // Step 4: Registrar en auditoría LOPIVI (optional, don't fail if this fails)
    try {
      await logAuditAction(
        delegado.id,
        `${delegado.nombre} ${delegado.apellidos}`,
        'login_formacion_lopivi',
        'delegado',
        {
          entidad: delegado.entidades.nombre,
          tipo_delegado: delegado.tipo,
          email: delegado.email
        },
        delegado.id
      )
    } catch (auditError) {
      console.warn('⚠️ Error en auditoría (no crítico):', auditError)
    }

    // Step 5: Verificar si ya tiene progreso de formación guardado
    // TODO: Implementar tabla de progreso de formación en futuras mejoras
    const progresoFormacion = {
      modulos_completados: [],
      test_completado: false,
      certificado_generado: false,
      fecha_inicio: new Date().toISOString(),
      porcentaje_completado: 0
    }

    console.log('🎉 Enviando respuesta exitosa')

    return NextResponse.json({
      success: true,
      message: 'Login exitoso - Acceso a formación LOPIVI',
      delegado: sessionData,
      formacion: {
        progreso: progresoFormacion,
        puede_acceder_dashboard: true, // For now, allow dashboard access
        urls: {
          formacion: '/formacion-lopivi',
          certificado: '/formacion-lopivi/certificado',
          dashboard: delegado.tipo === 'principal' ? '/dashboard-delegado' : '/dashboard-suplente'
        }
      },
      entidad: sessionData.entidad
    })

  } catch (error) {
    console.error('❌ Error crítico en login formación LOPIVI:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// GET - Verificar sesión activa
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const delegadoId = searchParams.get('delegado_id')

    if (!delegadoId) {
      return NextResponse.json(
        { error: 'delegado_id es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el delegado existe y está activo
    const { data: delegado, error } = await supabase
      .from('delegados')
      .select(`
        *,
        entidades!inner(
          id,
          nombre,
          tipo_entidad,
          plan
        )
      `)
      .eq('id', delegadoId)
      .eq('estado', 'activo')
      .single()

    if (error || !delegado) {
      return NextResponse.json(
        { error: 'Sesión inválida o delegado inactivo' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      delegado: {
        id: delegado.id,
        nombre: delegado.nombre,
        apellidos: delegado.apellidos,
        email: delegado.email,
        tipo: delegado.tipo,
        entidad: delegado.entidades
      }
    })

  } catch (error) {
    console.error('❌ Error verificando sesión:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
