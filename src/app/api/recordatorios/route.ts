import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { delegado, entidad, diasRestantes, urgencia } = await request.json()

    // Simular envío de recordatorio por email
    console.log(`📧 Recordatorio canal LOPIVI - ${delegado} - ${entidad}`)
    console.log(`⏰ Días restantes: ${diasRestantes} - Urgencia: ${urgencia}`)

    // En producción aquí iría la lógica de envío de email
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Recordatorio enviado',
      diasRestantes,
      urgencia
    })

  } catch (error) {
    console.error('Error recordatorio:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
