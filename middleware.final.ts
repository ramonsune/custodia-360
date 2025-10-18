import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  // ============================================================
  // 1. REDIRECCIÓN DE DOMINIO: .com → .es (PERMANENTE)
  // ============================================================
  const host = request.headers.get('host') || ''
  if (host.includes('custodia360.com')) {
    const url = new URL(request.url)
    url.host = 'www.custodia360.es'
    return NextResponse.redirect(url, 308) // 308 = Permanent Redirect
  }

  // ============================================================

  // ============================================================
  // 2. PROTECCIÓN DE RUTAS DEL PANEL
  // ============================================================
  const pathname = request.nextUrl.pathname

  // Proteger rutas del panel del delegado
  if (pathname.startsWith('/dashboard-delegado') || pathname.startsWith('/panel-delegado')) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storage: {
            getItem: (key: string) => {
              return request.cookies.get(key)?.value
            },
            setItem: () => {},
            removeItem: () => {}
          }
        }
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    // Si no hay sesión, redirigir a login
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Verificar perfil del delegado desde tabla delegados
    const { data: person } = await supabase
      .from('delegados')
      .select(`
        rol,
        formacion_completada,
        estado,
        entidad:entidades(
          id,
          plan_estado,
          pago_confirmado
        )
      `)
      .eq('user_id', session.user.id)
      .in('rol', ['delegado_principal', 'delegado_suplente'])
      .single()

    if (!person) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'no_profile')
      return NextResponse.redirect(url)
    }

    // Verificar que sea delegado
    if (person.rol !== 'delegado_principal' && person.rol !== 'delegado_suplente') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'not_delegado')
      return NextResponse.redirect(url)
    }

    // Verificar estado de la persona
    if (person.estado !== 'activo' && person.estado !== 'pendiente_formacion') {
      const url = request.nextUrl.clone()
      url.pathname = '/sistema-bloqueado'
      url.searchParams.set('reason', 'account_inactive')
      return NextResponse.redirect(url)
    }

    // Verificar plan activo
    if (person.entity?.plan_estado !== 'activo') {
      const url = request.nextUrl.clone()
      url.pathname = '/sistema-bloqueado'
      url.searchParams.set('reason', 'plan_inactive')
      return NextResponse.redirect(url)
    }

    // Verificar pago confirmado
    if (!person.entity?.pago_confirmado) {
      const url = request.nextUrl.clone()
      url.pathname = '/sistema-bloqueado'
      url.searchParams.set('reason', 'payment_pending')
      return NextResponse.redirect(url)
    }

    // Verificar formación completada para delegado principal
    if (person.rol === 'delegado_principal' && !person.formacion_completada) {
      // Permitir acceso a formación
      if (!pathname.startsWith('/formacion-delegado')) {
        const url = request.nextUrl.clone()
        url.pathname = '/formacion-delegado'
        url.searchParams.set('required', 'true')
        return NextResponse.redirect(url)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard-delegado/:path*',
    '/panel-delegado/:path*'
  ]
}
