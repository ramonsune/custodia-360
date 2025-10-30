import { NextRequest, NextResponse } from 'next/server'
import { supabase, logAuditAction } from '@/lib/supabase'

// Primero necesitamos crear la tabla de progreso de formación
// Esta función se puede ejecutar una vez para crear la tabla
async function createFormacionProgressTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS formacion_lopivi_progreso (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      delegado_id UUID REFERENCES delegados(id) ON DELETE CASCADE,
      entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
      modulos_completados JSONB DEFAULT '[]',
      test_completado BOOLEAN DEFAULT FALSE,
      test_puntuacion INTEGER DEFAULT 0,
      certificado_generado BOOLEAN DEFAULT FALSE,
      certificado_numero TEXT,
      fecha_inicio TIMESTAMPTZ DEFAULT NOW(),
      fecha_test_completado TIMESTAMPTZ,
      fecha_certificado TIMESTAMPTZ,
      porcentaje_completado INTEGER DEFAULT 0,
      tiempo_total_minutos INTEGER DEFAULT 0,
      legal_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(delegado_id)
    );

    CREATE INDEX IF NOT EXISTS idx_formacion_progreso_delegado ON formacion_lopivi_progreso(delegado_id);
    CREATE INDEX IF NOT EXISTS idx_formacion_progreso_entidad ON formacion_lopivi_progreso(entidad_id);
  `

  // Intentar crear la tabla (si no existe)
  const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL })
  if (error) {
    console.log('Nota: No se pudo crear tabla formacion_lopivi_progreso:', error.message)
  }
}

// Función para generar hash legal
function generateLegalHash(data: any): string {
  const timestamp = new Date().toISOString()
  const dataString = JSON.stringify(data) + timestamp
  return btoa(dataString).slice(0, 32)
}

// POST - Actualizar progreso de formación
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      delegado_id,
      entidad_id,
      modulos_completados = [],
      test_completado = false,
      test_puntuacion = 0,
      certificado_generado = false,
      porcentaje_completado = 0,
      tiempo_total_minutos = 0
    } = data

    if (!delegado_id || !entidad_id) {
      return NextResponse.json(
        { error: 'delegado_id y entidad_id son requeridos' },
        { status: 400 }
      )
    }

    console.log('📚 Actualizando progreso formación LOPIVI para delegado:', delegado_id)

    // Intentar crear la tabla si no existe
    await createFormacionProgressTable()

    // Obtener datos del delegado para auditoría
    const { data: delegado, error: delegadoError } = await supabase
      .from('delegados')
      .select('nombre, apellidos, email, tipo')
      .eq('id', delegado_id)
      .single()

    if (delegadoError || !delegado) {
      return NextResponse.json(
        { error: 'Delegado no encontrado' },
        { status: 404 }
      )
    }

    // Preparar datos para inserción/actualización
    const progresoData = {
      delegado_id,
      entidad_id,
      modulos_completados: JSON.stringify(modulos_completados),
      test_completado,
      test_puntuacion,
      certificado_generado,
      porcentaje_completado,
      tiempo_total_minutos,
      legal_hash: generateLegalHash({
        delegado_id,
        modulos_completados,
        test_completado,
        timestamp: new Date().toISOString()
      })
    }

    // Si completó el test, agregar timestamp
    if (test_completado && test_puntuacion > 0) {
      progresoData.fecha_test_completado = new Date().toISOString()
    }

    // Si generó certificado, agregar timestamp y número
    if (certificado_generado) {
      progresoData.fecha_certificado = new Date().toISOString()
      progresoData.certificado_numero = `LOPIVI-${Date.now()}-${delegado_id.slice(-4)}`
    }

    // Insertar o actualizar progreso usando UPSERT
    const { data: progreso, error: progresoError } = await supabase
      .from('formacion_lopivi_progreso')
      .upsert([progresoData], {
        onConflict: 'delegado_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (progresoError) {
      console.error('❌ Error guardando progreso:', progresoError)
      return NextResponse.json(
        { error: 'Error guardando progreso', details: progresoError.message },
        { status: 500 }
      )
    }

    console.log('✅ Progreso actualizado para:', delegado.nombre, delegado.apellidos)

    // Registrar en auditoría LOPIVI
    await logAuditAction(
      delegado_id,
      `${delegado.nombre} ${delegado.apellidos}`,
      test_completado ? 'formacion_lopivi_completada' : 'formacion_lopivi_progreso',
      'formacion',
      {
        porcentaje_completado,
        modulos_completados: modulos_completados.length,
        test_completado,
        test_puntuacion,
        certificado_generado
      },
      delegado_id
    )

    return NextResponse.json({
      success: true,
      message: 'Progreso de formación actualizado',
      progreso: {
        id: progreso.id,
        porcentaje_completado: progreso.porcentaje_completado,
        modulos_completados: JSON.parse(progreso.modulos_completados),
        test_completado: progreso.test_completado,
        test_puntuacion: progreso.test_puntuacion,
        certificado_generado: progreso.certificado_generado,
        certificado_numero: progreso.certificado_numero,
        puede_acceder_dashboard: progreso.test_completado && progreso.test_puntuacion >= 80
      }
    })

  } catch (error) {
    console.error('❌ Error actualizando progreso formación:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// GET - Obtener progreso de formación
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

    console.log('📖 Obteniendo progreso formación para delegado:', delegadoId)

    // Buscar progreso existente
    const { data: progreso, error: progresoError } = await supabase
      .from('formacion_lopivi_progreso')
      .select(`
        *,
        delegados!inner(nombre, apellidos, email, tipo),
        entidades!inner(nombre, tipo_entidad)
      `)
      .eq('delegado_id', delegadoId)
      .single()

    if (progresoError) {
      // Si no existe progreso, crear uno nuevo con valores por defecto
      console.log('📋 No existe progreso previo, creando nuevo...')

      const { data: delegado } = await supabase
        .from('delegados')
        .select('entidad_id, nombre, apellidos, email, tipo')
        .eq('id', delegadoId)
        .single()

      if (!delegado) {
        return NextResponse.json(
          { error: 'Delegado no encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        progreso: {
          id: null,
          delegado_id: delegadoId,
          entidad_id: delegado.entidad_id,
          modulos_completados: [],
          test_completado: false,
          test_puntuacion: 0,
          certificado_generado: false,
          certificado_numero: null,
          porcentaje_completado: 0,
          tiempo_total_minutos: 0,
          fecha_inicio: new Date().toISOString(),
          puede_acceder_dashboard: false
        },
        delegado: {
          nombre: delegado.nombre,
          apellidos: delegado.apellidos,
          email: delegado.email,
          tipo: delegado.tipo
        }
      })
    }

    // Procesar progreso existente
    const progresoFormateado = {
      id: progreso.id,
      delegado_id: progreso.delegado_id,
      entidad_id: progreso.entidad_id,
      modulos_completados: JSON.parse(progreso.modulos_completados || '[]'),
      test_completado: progreso.test_completado,
      test_puntuacion: progreso.test_puntuacion,
      certificado_generado: progreso.certificado_generado,
      certificado_numero: progreso.certificado_numero,
      porcentaje_completado: progreso.porcentaje_completado,
      tiempo_total_minutos: progreso.tiempo_total_minutos,
      fecha_inicio: progreso.fecha_inicio,
      fecha_test_completado: progreso.fecha_test_completado,
      fecha_certificado: progreso.fecha_certificado,
      puede_acceder_dashboard: progreso.test_completado && progreso.test_puntuacion >= 80
    }

    return NextResponse.json({
      success: true,
      progreso: progresoFormateado,
      delegado: {
        nombre: progreso.delegados.nombre,
        apellidos: progreso.delegados.apellidos,
        email: progreso.delegados.email,
        tipo: progreso.delegados.tipo
      },
      entidad: {
        nombre: progreso.entidades.nombre,
        tipo_entidad: progreso.entidades.tipo_entidad
      }
    })

  } catch (error) {
    console.error('❌ Error obteniendo progreso formación:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
