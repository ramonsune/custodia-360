import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(
        new URL('/panel/delegado/configuracion?error=token_missing', request.url)
      )
    }

    console.log(`🔐 [CHANNEL-VERIFY] Verificando token: ${token}`)

    // En producción, consultar Supabase:
    // SELECT entity_id, email FROM channel_verifications WHERE token = ${token} AND created_at > now() - interval '24 hours'

    // Si el token es válido:
    // UPDATE entities SET canal_verificado = true, canal_verificado_at = now() WHERE id = ${entity_id}
    // UPDATE entity_compliance SET channel_verified = true WHERE entity_id = ${entity_id}
    // DELETE FROM channel_verifications WHERE token = ${token}

    // Para demo, aceptar cualquier token
    const isValid = token.length > 10

    if (!isValid) {
      return NextResponse.redirect(
        new URL('/panel/delegado/configuracion?error=token_invalid', request.url)
      )
    }

    console.log('✅ [CHANNEL-VERIFY] Token verificado correctamente')

    // Redirigir al panel con mensaje de éxito
    return NextResponse.redirect(
      new URL('/panel/delegado/configuracion?verified=true', request.url)
    )
  } catch (error: any) {
    console.error('Error en channel/verify:', error)
    return NextResponse.redirect(
      new URL('/panel/delegado/configuracion?error=server_error', request.url)
    )
  }
}
