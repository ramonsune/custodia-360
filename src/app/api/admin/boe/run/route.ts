import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cliente Supabase con service role para acceso completo
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accion = searchParams.get('accion')

    switch (accion) {
      case 'test':
        return await ejecutarTest()
      case 'forzar':
        return await forzarVerificacion()
      case 'historial':
        return await descargarHistorial()
      default:
        return await obtenerCambios()
    }
  } catch (error) {
    console.error('Error en endpoint BOE:', error)
    return NextResponse.json({
      success: false,
      error: 'Error en el servidor'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accion } = body

    if (accion === 'informe') {
      return await generarInforme(body)
    }

    return NextResponse.json({
      success: false,
      error: 'Acción no reconocida'
    }, { status: 400 })
  } catch (error) {
    console.error('Error en POST BOE:', error)
    return NextResponse.json({
      success: false,
      error: 'Error en el servidor'
    }, { status: 500 })
  }
}

async function ejecutarTest() {
  try {
    // Verificar conexión a Supabase
    const { data, error } = await supabase
      .from('boe_changes')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Error conectando a Supabase',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Sistema de monitoreo BOE operativo',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error en test'
    }, { status: 500 })
  }
}

async function forzarVerificacion() {
  try {
    // Llamar a la Edge Function de Supabase para ejecutar verificación
    const { data, error } = await supabase.functions.invoke('c360_boe_check', {
      body: { force: true }
    })

    if (error) {
      console.error('Error invocando Edge Function:', error)
      return NextResponse.json({
        success: false,
        error: 'Error ejecutando verificación',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Verificación ejecutada correctamente',
      data,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Error forzando verificación',
      details: error.message
    }, { status: 500 })
  }
}

async function obtenerCambios() {
  try {
    const { data, error } = await supabase
      .from('boe_changes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({
      success: true,
      cambios: data,
      total: data?.length || 0
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Error obteniendo cambios',
      details: error.message
    }, { status: 500 })
  }
}

async function descargarHistorial() {
  try {
    const { data, error } = await supabase
      .from('boe_changes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Convertir a CSV
    const csv = convertirACSV(data || [])

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="historial-boe-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Error descargando historial',
      details: error.message
    }, { status: 500 })
  }
}

async function generarInforme(body: any) {
  const { fecha_inicio, fecha_fin } = body

  try {
    const { data, error } = await supabase
      .from('boe_changes')
      .select('*')
      .gte('created_at', fecha_inicio)
      .lte('created_at', fecha_fin)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Por ahora retornamos JSON, se puede implementar PDF después
    return NextResponse.json({
      success: true,
      informe: {
        fecha_inicio,
        fecha_fin,
        total_cambios: data?.length || 0,
        cambios: data
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Error generando informe',
      details: error.message
    }, { status: 500 })
  }
}

function convertirACSV(data: any[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => JSON.stringify(row[header] || '')).join(',')
    )
  ]

  return csvRows.join('\n')
}
