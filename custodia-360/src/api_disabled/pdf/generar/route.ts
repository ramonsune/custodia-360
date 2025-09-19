import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { tipo, datos } = await request.json()

    // Validar tipo de documento
    const tiposValidos = ['planProteccion', 'certificadoLOPIVI', 'protocolos', 'codigoConducta']
    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo de documento no válido' },
        { status: 400 }
      )
    }

    // TEMPORAL: Funcionalidad PDF desactivada durante deploy
    // Se reactivará una vez solucionados los problemas de dependencias
    return NextResponse.json(
      {
        message: 'La generación de PDFs está temporalmente desactivada',
        tipo,
        datos: datos?.entidad || 'Entidad',
        status: 'pendiente'
      },
      { status: 202 }
    )
  } catch (error) {
    console.error('Error en API PDF:', error)
    return NextResponse.json(
      { error: 'Error temporal en la generación de PDFs' },
      { status: 503 }
    )
  }
}
