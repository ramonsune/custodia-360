import { notFound } from 'next/navigation'
import Link from 'next/link'

// IMPORTANTE: Force dynamic para evitar 404 por prerender
export const dynamic = 'force-dynamic'

interface OnboardingPageProps {
  params: {
    token: string
  }
}

interface ResolveTokenResponse {
  ok: boolean
  reason?: string
  token?: string
  entity_id?: string
  entity?: {
    id: string
    nombre: string
    sector_code: string
    canal_tipo: string | null
    canal_valor: string | null
  }
  expires_at?: string | null
  created_at?: string
}

// Función para resolver el token (server-side)
async function resolveToken(token: string): Promise<ResolveTokenResponse | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL || 'http://localhost:3000'
    const url = `${baseUrl}/api/onboarding/resolve?token=${encodeURIComponent(token)}`

    console.log('🔍 [ONBOARDING PAGE] Resolviendo token:', url)

    const res = await fetch(url, {
      next: { revalidate: 0 }, // No cachear
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      console.error('❌ [ONBOARDING PAGE] Error en resolve:', res.status)
      return null
    }

    const data = await res.json()
    console.log('✅ [ONBOARDING PAGE] Token resuelto:', data.entity?.nombre)
    return data

  } catch (error) {
    console.error('❌ [ONBOARDING PAGE] Error resolviendo token:', error)
    return null
  }
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { token } = params

  console.log('📄 [ONBOARDING PAGE] Renderizando página para token:', token)

  // Resolver token
  const tokenData = await resolveToken(token)

  // Si el token no es válido, mostrar error
  if (!tokenData || !tokenData.ok || !tokenData.entity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Enlace no válido o expirado
            </h1>

            <p className="text-gray-600 mb-6">
              Este enlace de incorporación no es válido o ha expirado. Por favor, contacta con tu entidad para obtener un nuevo enlace.
            </p>

            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { entity } = tokenData

  // Roles disponibles
  const roles = [
    {
      id: 'personal-con-contacto',
      titulo: 'Personal con Contacto',
      descripcion: 'Entrenadores, monitores, educadores, personal que trabaja directamente con menores',
      icono: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      id: 'personal-sin-contacto',
      titulo: 'Personal sin Contacto',
      descripcion: 'Administrativos, mantenimiento, limpieza, personal de apoyo',
      icono: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'green'
    },
    {
      id: 'familia',
      titulo: 'Familias / Tutores',
      descripcion: 'Padres, madres, tutores legales de los menores',
      icono: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      color: 'purple'
    },
    {
      id: 'directiva',
      titulo: 'Directiva / Junta',
      descripcion: 'Miembros de la junta directiva, consejo o equipo directivo',
      icono: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'orange'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white rounded-full px-6 py-3 shadow-md mb-6">
            <span className="text-2xl font-bold text-blue-600">C360</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido/a a {entity.nombre}
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            Portal de Incorporación · Protección Infantil LOPIVI
          </p>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mb-8">
            <p className="text-gray-700 leading-relaxed">
              Estás a punto de unirte a <strong>{entity.nombre}</strong>, una entidad comprometida
              con la protección integral de menores según la Ley LOPIVI.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Por favor, selecciona tu rol para continuar con el proceso de incorporación:
            </p>
          </div>
        </div>

        {/* Tarjetas de Roles */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {roles.map((rol) => (
            <Link
              key={rol.id}
              href={`/onboarding/${token}/rol/${rol.id}`}
              className="group"
            >
              <div className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-${rol.color}-500 cursor-pointer h-full`}>
                <div className={`w-16 h-16 bg-${rol.color}-100 rounded-full flex items-center justify-center mb-4 text-${rol.color}-600 group-hover:scale-110 transition-transform`}>
                  {rol.icono}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {rol.titulo}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  {rol.descripcion}
                </p>

                <div className={`inline-flex items-center text-${rol.color}-600 font-semibold group-hover:translate-x-2 transition-transform`}>
                  <span>Continuar</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Canal de Comunicación */}
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Canal de Comunicación
          </h3>

          {entity.canal_tipo && entity.canal_valor ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-900">
                <strong>Canal oficial configurado:</strong>
              </p>
              <p className="text-green-800 mt-1">
                {entity.canal_tipo === 'email' ? '📧 Email: ' : '📱 WhatsApp: '}
                <span className="font-semibold">{entity.canal_valor}</span>
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                Recibirás el canal oficial de comunicación por email o WhatsApp próximamente.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Sistema de protección de la infancia · Cumplimiento LOPIVI
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Custodia360 - Protección Integral Infantil
          </p>
        </div>
      </div>
    </div>
  )
}
