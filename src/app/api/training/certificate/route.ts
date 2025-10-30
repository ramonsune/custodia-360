import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { personId, entityId, testPassed } = body

    if (!personId || !entityId) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    console.log('📥 [CERTIFICATE] POST:', { personId, entityId, testPassed })

    // Verificar que haya pasado el test (desde localStorage del cliente)
    if (!testPassed) {
      return NextResponse.json({ error: 'No ha completado el test' }, { status: 400 })
    }

    // Generar código único
    const now = new Date()
    const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '')
    const nsec = Math.floor(now.getTime() / 1000)
    const certCode = `C360-${entityId.slice(0, 8).toUpperCase()}-${yyyymmdd}-${nsec}`

    // Crear certificado en memoria
    const certificate = {
      id: `cert_${personId}_${entityId}`,
      person_id: personId,
      entity_id: entityId,
      cert_code: certCode,
      issued_at: now.toISOString(),
      created_at: now.toISOString()
    }

    console.log('✅ [CERTIFICATE] Certificado generado:', certCode)

    return NextResponse.json({
      success: true,
      certificate,
      _isLocal: true,
      _shouldPersist: { key: `certificate_${personId}_${entityId}`, data: certificate }
    })

  } catch (error: any) {
    console.error('❌ [CERTIFICATE] Error POST:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const personId = searchParams.get('personId')
    const entityId = searchParams.get('entityId')

    if (!personId || !entityId) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    console.log('📥 [CERTIFICATE] GET:', { personId, entityId })

    // El cliente debe proporcionar el certificado desde localStorage
    // Aquí solo devolvemos null si no existe
    return NextResponse.json({
      success: true,
      certificate: null,
      _isLocal: true,
      _hint: 'El cliente debe cargar el certificado desde localStorage'
    })

  } catch (error: any) {
    console.error('❌ [CERTIFICATE] Error GET:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
