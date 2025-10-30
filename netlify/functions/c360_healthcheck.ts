import { Handler } from '@netlify/functions'

export const handler: Handler = async () => {
  try {
    const baseUrl = process.env.APP_BASE_URL || 'https://www.custodia360.es'

    const response = await fetch(`${baseUrl}/api/jobs/healthcheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-cron': '1'
      }
    })

    const data = await response.json()

    // Log del resultado
    console.log('HealthCheck ejecutado:', {
      status: data.result?.status || 'UNKNOWN',
      timestamp: data.result?.timestamp || new Date().toISOString(),
      alerts: data.result?.alerts?.length || 0
    })

    // Si es crítico, también loguear las alertas
    if (data.result?.status === 'CRITICAL') {
      console.error('🔴 HEALTHCHECK CRÍTICO - Alertas:', data.result.alerts)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'HealthCheck completado',
        status: data.result?.status || 'UNKNOWN',
        alerts: data.result?.alerts || [],
        timestamp: data.result?.timestamp
      })
    }
  } catch (error: any) {
    console.error('Error ejecutando healthcheck:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        message: 'Error ejecutando healthcheck'
      })
    }
  }
}
