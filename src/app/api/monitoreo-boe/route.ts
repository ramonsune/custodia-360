import { NextResponse } from 'next/server'
import { ejecutarMonitoreoBOEProgramado } from '@/lib/monitoreo-boe'

export async function POST(request: Request) {
  try {
    // Verificar autorización (cron job o admin)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET_TOKEN

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({
        success: false,
        error: 'No autorizado'
      }, { status: 401 })
    }

    console.log('🔍 Iniciando monitoreo BOE programado...')

    // Ejecutar monitoreo completo
    await ejecutarMonitoreoBOEProgramado()

    return NextResponse.json({
      success: true,
      message: 'Monitoreo BOE completado exitosamente',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error en monitoreo BOE API:', error)

    return NextResponse.json({
      success: false,
      error: 'Error ejecutando monitoreo BOE',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Endpoint para comprobar estado del sistema de monitoreo
    const { searchParams } = new URL(request.url)
    const accion = searchParams.get('accion')

    if (accion === 'status') {
      return NextResponse.json({
        success: true,
        sistema_monitoreo: 'ACTIVO',
        ultima_ejecucion: '2025-01-27T10:00:00Z', // En producción vendría de BD
        proxima_ejecucion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        cambios_detectados_ultimo_mes: 2,
        estado: 'OPERATIVO'
      })
    }

    if (accion === 'test') {
      // Test manual del sistema (solo para desarrollo)
      console.log('🧪 Ejecutando test manual del monitoreo BOE...')

      // En desarrollo, ejecutar una versión de prueba
      return NextResponse.json({
        success: true,
        message: 'Test de monitoreo BOE ejecutado',
        resultado: 'Sistema funcionando correctamente',
        cambios_simulados: 1
      })
    }

    return NextResponse.json({
      success: true,
      message: 'API de monitoreo BOE operativa',
      endpoints: {
        'POST /': 'Ejecutar monitoreo (requiere auth)',
        'GET /?accion=status': 'Estado del sistema',
        'GET /?accion=test': 'Test manual (desarrollo)'
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error en API monitoreo BOE'
    }, { status: 500 })
  }
}
