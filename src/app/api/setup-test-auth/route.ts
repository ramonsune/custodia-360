import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!serviceRoleKey) {
      return NextResponse.json({
        success: false,
        error: 'SUPABASE_SERVICE_ROLE_KEY no configurada'
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const results = []

    // 1. Obtener todas las entidades
    const { data: entidades, error: entidadesError } = await supabase
      .from('entidades')
      .select('*')

    if (entidadesError) {
      return NextResponse.json({
        success: false,
        error: 'Error al obtener entidades',
        details: entidadesError
      }, { status: 500 })
    }

    results.push(`📊 Entidades encontradas: ${entidades?.length || 0}`)

    // 2. Obtener todos los delegados
    const { data: delegados, error: delegadosError } = await supabase
      .from('delegados')
      .select('*')

    if (delegadosError) {
      return NextResponse.json({
        success: false,
        error: 'Error al obtener delegados',
        details: delegadosError
      }, { status: 500 })
    }

    results.push(`👥 Delegados encontrados: ${delegados?.length || 0}`)

    // 3. Crear usuario de prueba para cada delegado que no tenga user_id
    const delegadosSinAuth = delegados?.filter(d => !d.user_id) || []
    results.push(`🔐 Delegados sin auth: ${delegadosSinAuth.length}`)

    for (const delegado of delegadosSinAuth) {
      try {
        const password = 'Custodia360!'

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: delegado.email,
          password: password,
          email_confirm: true,
          user_metadata: {
            nombre: delegado.nombre,
            rol: delegado.tipo === 'principal' ? 'delegado_principal' : 'delegado_suplente'
          }
        })

        if (authError) {
          results.push(`❌ Error creando usuario para ${delegado.email}: ${authError.message}`)
          continue
        }

        const { error: updateError } = await supabase
          .from('delegados')
          .update({ user_id: authData.user.id })
          .eq('id', delegado.id)

        if (updateError) {
          results.push(`⚠️ Usuario creado pero error vinculando: ${delegado.email}`)
          continue
        }

        results.push(`✅ Usuario creado: ${delegado.email} / ${password}`)

      } catch (err: any) {
        results.push(`❌ Error procesando ${delegado.email}: ${err.message}`)
      }
    }

    // 4. Actualizar estado de entidades
    if (entidades && entidades.length > 0) {
      const { error: updateError } = await supabase
        .from('entidades')
        .update({
          plan_estado: 'activo',
          pago_confirmado: true
        })
        .in('id', entidades.map(e => e.id))

      if (updateError) {
        results.push(`⚠️ Error activando entidades: ${updateError.message}`)
      } else {
        results.push(`✅ Activadas ${entidades.length} entidades`)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Setup completado',
      results,
      credentials: delegadosSinAuth.map(d => ({
        email: d.email,
        password: 'Custodia360!',
        tipo: d.tipo,
        nombre: `${d.nombre} ${d.apellidos || ''}`
      }))
    })

  } catch (error: any) {
    console.error('Error en setup:', error)
    return NextResponse.json({
      success: false,
      error: 'Error general',
      details: error.message
    }, { status: 500 })
  }
}
