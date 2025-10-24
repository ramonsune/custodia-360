import { Handler } from '@netlify/functions'

export const handler: Handler = async () => {
  try {
    const baseUrl = process.env.APP_BASE_URL || 'https://www.custodia360.es'

    const response = await fetch(`${baseUrl}/api/jobs/compliance-guard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-cron': '1'
      }
    })

    const data = await response.text()

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Compliance guard completed',
        result: data
      })
    }
  } catch (error: any) {
    console.error('Compliance guard error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
