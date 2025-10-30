import { NextResponse } from 'next/server'

export async function GET() {
  const startTime = performance.now()

  try {
    // Verificar que la API key de Resend existe
    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey || resendApiKey.includes('placeholder')) {
      return NextResponse.json({
        estado: 'DEGRADADO',
        latencia: Math.round(performance.now() - startTime),
        mensaje: 'API key de Resend no configurada',
        timestamp: new Date().toISOString()
      })
    }

    // Hacer una petición básica a la API de Resend para verificar conectividad
    const response = await fetch('https://api.resend.com/emails', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      }
    })

    const latencia = Math.round(performance.now() - startTime)

    if (response.ok || response.status === 200) {
      return NextResponse.json({
        estado: 'OPERATIVO',
        latencia,
        mensaje: 'Servicio de email operativo',
        timestamp: new Date().toISOString()
      })
    }

    if (response.status === 401) {
      return NextResponse.json({
        estado: 'DEGRADADO',
        latencia,
        mensaje: 'API key de Resend inválida',
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      estado: 'DEGRADADO',
      latencia,
      mensaje: `Error ${response.status} en Resend`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      estado: 'CAIDO',
      latencia: Math.round(performance.now() - startTime),
      mensaje: 'Servicio de email no disponible',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}
