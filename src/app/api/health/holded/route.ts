import { NextResponse } from 'next/server'

export async function GET() {
  const startTime = performance.now()

  try {
    // Verificar que la API key de Holded existe
    const holdedApiKey = process.env.HOLDED_API_KEY

    if (!holdedApiKey || holdedApiKey.includes('placeholder')) {
      return NextResponse.json({
        estado: 'DEGRADADO',
        latencia: Math.round(performance.now() - startTime),
        mensaje: 'API key de Holded no configurada',
        timestamp: new Date().toISOString()
      })
    }

    // Hacer una petición simple a la API de Holded para verificar conectividad
    const response = await fetch('https://api.holded.com/api/invoicing/v1/documents/invoice', {
      method: 'GET',
      headers: {
        'Key': holdedApiKey,
        'Accept': 'application/json'
      }
    })

    const latencia = Math.round(performance.now() - startTime)

    if (response.ok || response.status === 200) {
      return NextResponse.json({
        estado: latencia > 1000 ? 'DEGRADADO' : 'OPERATIVO',
        latencia,
        mensaje: latencia > 1000 ? 'Servicio con latencia elevada' : 'Servicio de facturación operativo',
        timestamp: new Date().toISOString()
      })
    }

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json({
        estado: 'DEGRADADO',
        latencia,
        mensaje: 'API key de Holded inválida',
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      estado: 'DEGRADADO',
      latencia,
      mensaje: `Error ${response.status} en Holded`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      estado: 'CAIDO',
      latencia: Math.round(performance.now() - startTime),
      mensaje: 'Servicio de facturación no disponible',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}
