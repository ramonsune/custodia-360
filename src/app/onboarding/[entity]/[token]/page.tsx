'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface EntityInfo {
  id: string
  nombre: string
  sector_code: string
}

export default function OnboardingLanding() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [entity, setEntity] = useState<EntityInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  const entityId = params.entity as string
  const token = params.token as string

  useEffect(() => {
    verifyToken()
  }, [])

  const verifyToken = async () => {
    try {
      const res = await fetch('/api/onboarding/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, token })
      })

      const data = await res.json()

      if (data.success && data.valid) {
        setEntity(data.entity)
      } else {
        setError('El enlace no es válido o ha expirado')
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const navigateTo = (role: string) => {
    router.push(`/onboarding/${entityId}/${token}/${role}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando enlace...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-red-300">
          <CardHeader>
            <CardTitle className="text-red-600">Enlace no válido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
            <p className="text-sm text-gray-600 mt-4">
              Si crees que esto es un error, contacta con tu entidad.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Portal de Incorporación
          </h1>
          <p className="text-xl text-gray-700">
            {entity?.nombre}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Bienvenido/a al proceso de registro y formación en protección infantil
          </p>
        </div>

        {/* Información general */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-3">Información importante:</h3>
            <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
              <li>Selecciona tu rol para comenzar el proceso de registro</li>
              <li>Completa todos los datos solicitados con información veraz</li>
              <li>Tienes <strong>30 días</strong> para completar el proceso</li>
              <li>Al finalizar, recibirás confirmación por email</li>
              <li>Algunos roles requieren formación y evaluación</li>
            </ul>
          </CardContent>
        </Card>

        {/* Selección de rol */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Selecciona tu rol:</CardTitle>
            <CardDescription>
              Elige la opción que mejor describa tu relación con la entidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Personal con contacto */}
            <div
              onClick={() => navigateTo('contacto')}
              className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Personal con Contacto Directo
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Entrenadores, monitores, educadores, personal médico, etc.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Incluye: Formación corta + Test 10 preguntas + Certificado penales
                </span>
                <Button variant="default">Seleccionar →</Button>
              </div>
            </div>

            {/* Personal sin contacto */}
            <div
              onClick={() => navigateTo('no-contacto')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-all"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Personal sin Contacto Directo
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Administrativos, limpieza, mantenimiento, etc.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Incluye: Datos básicos + Documentación informativa
                </span>
                <Button variant="outline">Seleccionar →</Button>
              </div>
            </div>

            {/* Familias/Tutores */}
            <div
              onClick={() => navigateTo('familias')}
              className="p-6 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Familias / Tutores Legales
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Padres, madres o tutores de menores participantes
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Incluye: Datos adultos + Información de hijos/as
                </span>
                <Button variant="outline" className="border-green-500 text-green-700">
                  Seleccionar →
                </Button>
              </div>
            </div>

            {/* Directiva */}
            <div
              onClick={() => navigateTo('directiva')}
              className="p-6 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-all"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Directiva / Propietario / Junta
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Miembros de dirección, junta directiva o propietarios
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Incluye: Datos + Compromisos + Certificado penales
                </span>
                <Button variant="outline" className="border-purple-500 text-purple-700">
                  Seleccionar →
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Footer informativo */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Tienes dudas? Contacta con tu entidad o delegado de protección.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Custodia360 • Sistema de Protección Infantil LOPIVI
          </p>
        </div>
      </div>
    </div>
  )
}
