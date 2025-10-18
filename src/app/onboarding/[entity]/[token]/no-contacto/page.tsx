'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EntityInfo {
  id: string
  nombre: string
  sector_code: string
}

export default function OnboardingNoContacto() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [entity, setEntity] = useState<EntityInfo | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Datos del formulario
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [puesto, setPuesto] = useState('')

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
        router.push(`/onboarding/${entityId}/${token}`)
      }
    } catch (err) {
      router.push(`/onboarding/${entityId}/${token}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre || !email) {
      alert('Por favor, completa al menos nombre y email')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId,
          tipo: 'personal_no_contacto',
          nombre,
          apellidos,
          email,
          telefono,
          puesto,
          sector_code: entity?.sector_code
        })
      })

      const data = await res.json()

      if (data.success) {
        setCompleted(true)
      } else {
        alert('Error al guardar los datos')
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle className="text-green-600">¡Registro Completado!</CardTitle>
              <CardDescription>
                Tus datos han sido guardados correctamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                <p className="text-green-900 font-semibold mb-2">
                  Gracias por completar tu registro
                </p>
                <p className="text-sm text-green-800">
                  Recibirás un email de confirmación. Tu entidad ha sido notificada de tu incorporación.
                </p>
              </div>

              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="w-full"
              >
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Personal sin Contacto Directo
          </h1>
          <p className="text-gray-600">{entity?.nombre}</p>
        </div>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle>Datos de Registro</CardTitle>
            <CardDescription>
              Completa tu información básica para incorporarte a la entidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input
                    id="apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono (opcional)</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+34 600 000 000"
                />
              </div>

              <div>
                <Label htmlFor="puesto">Puesto / Función</Label>
                <Input
                  id="puesto"
                  value={puesto}
                  onChange={(e) => setPuesto(e.target.value)}
                  placeholder="Ej: Administrativo, Limpieza, Mantenimiento..."
                />
              </div>

              {/* Información y documentación */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Información para Personal sin Contacto</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>
                    Aunque no tengas contacto directo regular con menores, es importante que conozcas
                    los protocolos básicos de protección infantil:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Identificarte siempre con credencial visible</li>
                    <li>Trabajar preferentemente en horarios sin presencia de menores</li>
                    <li>Informar de cualquier situación sospechosa al delegado de protección</li>
                    <li>Respetar las zonas restringidas y horarios establecidos</li>
                    <li>Mantener la confidencialidad sobre cualquier información de menores</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Documentación disponible:</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Una vez completado tu registro, recibirás por email:
                </p>
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  <li>Código de conducta para personal sin contacto</li>
                  <li>Protocolo de actuación ante situaciones sospechosas</li>
                  <li>Contactos de emergencia y delegado de protección</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? 'Guardando...' : 'Completar Registro'}
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
