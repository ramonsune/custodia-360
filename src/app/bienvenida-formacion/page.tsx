'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSession, isExpired } from '@/lib/auth/session'

interface SessionData {
  id: string
  nombre: string
  email: string
  entityId: string
  entidad: string
  user_id: string
  rol?: string
  tipo?: string
}

export default function BienvenidaFormacionPage() {
  const router = useRouter()
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentSession = getSession()

    if (!currentSession.token || isExpired()) {
      console.warn('⚠️ Bienvenida Formación: Sesión inválida')
      router.push('/login')
      return
    }

    console.log('✅ Bienvenida Formación: Sesión válida')

    // Mapear sesión unificada al estado local
    const mappedSession: SessionData = {
      id: currentSession.userId || currentSession.token,
      nombre: currentSession.userName || 'Usuario',
      email: currentSession.userEmail || '',
      entityId: currentSession.entityId || '',
      entidad: currentSession.entityName || 'Entidad',
      user_id: currentSession.userId || '',
      rol: currentSession.role
    }

    setSession(mappedSession)
    setLoading(false)
  }, [router])

  const iniciarFormacion = () => {
    router.push('/panel/delegado/formacion')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-2">
            ¡Bienvenido/a, {session.nombre}!
          </h1>
          <p className="text-green-100 text-lg">
            {session.entidad}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Mensaje Principal */}
        <Card className="shadow-xl mb-8">
          <CardHeader className="text-center bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="text-3xl mb-4">
              Certificación C360
            </CardTitle>
            <CardDescription className="text-lg">
              Estamos aquí para acompañarte en todo el proceso de formación cómo Delegado/a de Protección
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-6">
                Cómo <strong>Delegado/a de Protección</strong>, tendrás la responsabilidad de implementar
                y gestionar el cumplimiento de la LOPIVI en tu entidad. Este proceso de formación te
                preparará completamente para ejercer tu rol con confianza y eficacia.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">
                  ¿Qué vas a hacer?
                </h3>
                <p className="text-blue-800 mb-4">
                  El proceso completo consta de 4 fases que completarás en orden:
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proceso en 4 Pasos */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Paso 1: Formación */}
          <Card className="shadow-lg border-2 border-green-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <CardTitle className="text-xl">Formación LOPIVI</CardTitle>
              </div>
              <CardDescription>6 módulos de formación esencial</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Fundamentos de la LOPIVI
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Prevención de riesgos
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Protocolos de actuación
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Trabajo con familias
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Autocuidado del personal
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Evaluación y mejora continua
                </li>
              </ul>

            </CardContent>
          </Card>

          {/* Paso 2: Test */}
          <Card className="shadow-lg border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <CardTitle className="text-xl">Test de Evaluación</CardTitle>
              </div>
              <CardDescription>Demuestra tus conocimientos</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Preguntas sobre los 6 módulos
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Necesitas mínimo 75% de aciertos
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Puedes repetirlo si no apruebas
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">
                ⏱️ Tiempo estimado: 15-20 minutos
              </p>
            </CardContent>
          </Card>

          {/* Paso 3: Certificado */}
          <Card className="shadow-lg border-2 border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <CardTitle className="text-xl">Certificado Custodia360</CardTitle>
              </div>
              <CardDescription>Acredita tu capacitación</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Certificado digital oficial
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Descargable en formato PNG
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Enviado automáticamente a tu email
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">
                ⏱️ Tiempo estimado: 2 minutos
              </p>
            </CardContent>
          </Card>

          {/* Paso 4: Configuración */}
          <Card className="shadow-lg border-2 border-orange-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  4
                </div>
                <CardTitle className="text-xl">Configuración del Sistema</CardTitle>
              </div>
              <CardDescription>Prepara tu entidad</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  Canal de comunicación
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  Link para miembros de tu entidad
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  Mapa de riesgos de tu sector
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  Certificado de penales
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">
                ⏱️ Tiempo estimado: 10-15 minutos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Información de Soporte */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ¿Tienes dudas?
              </h3>
              <p className="text-gray-700 mb-4">
                Estamos aquí para ayudarte en todo momento. Contáctanos si necesitas asistencia.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">Email:</span>
                  <a href="mailto:info@custodia360.com" className="text-blue-600 hover:underline">
                    info@custodia360.com
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón de Inicio */}
        <div className="text-center">
          <Button
            onClick={iniciarFormacion}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-12 py-6 text-xl font-bold shadow-xl"
          >
            Comenzar mi Formación LOPIVI →
          </Button>

        </div>
      </div>
    </div>
  )
}
