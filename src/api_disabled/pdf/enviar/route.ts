import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { tipo, datos, destinatario, asunto } = await request.json()

    // Validar datos
    if (!destinatario || !asunto) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos (destinatario, asunto)' },
        { status: 400 }
      )
    }

    // TEMPORAL: Funcionalidad PDF desactivada durante deploy
    // Se reactivará una vez solucionados los problemas de dependencias
    return NextResponse.json(
      {
        success: true,
        message: 'El envío de PDFs está temporalmente desactivado',
        destinatario,
        tipo,
        status: 'pendiente',
        info: 'La funcionalidad estará disponible próximamente'
      },
      { status: 202 }
    )

  } catch (error) {
    console.error('Error en API PDF enviar:', error)
    return NextResponse.json(
      { error: 'Error temporal en el envío de PDFs' },
      { status: 503 }
    )
  }
}
