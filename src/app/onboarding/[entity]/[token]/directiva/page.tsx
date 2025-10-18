'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface EntityInfo {
  id: string
  nombre: string
  sector_code: string
}

export default function OnboardingDirectiva() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [entity, setEntity] = useState<EntityInfo | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Datos del formulario
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [cargo, setCargo] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [penales, setPenales] = useState(false)
  const [compromisoEtico, setCompromisoEtico] = useState(false)

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

    if (!nombre || !apellidos || !cargo || !email) {
      alert('Por favor, completa todos los campos obligatorios')
      return
    }

    if (!compromisoEtico) {
      alert('Debes aceptar el compromiso ético LOPIVI para continuar')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId,
          tipo: 'directiva',
          nombre,
          apellidos,
          email,
          telefono,
          cargo,
          penales_entregado: penales,
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-purple-500">
            <CardHeader>
              <CardTitle className="text-purple-600">¡Registro Completado!</CardTitle>
              <CardDescription>
                Tus datos han sido guardados correctamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 border border-purple-300 rounded-lg p-4">
                <p className="text-purple-900 font-semibold mb-2">
                  Gracias por completar tu registro como miembro de dirección
                </p>
                <p className="text-sm text-purple-800">
                  Recibirás un email de confirmación con documentación sobre responsabilidades
                  de la dirección en materia de protección infantil LOPIVI.
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Directiva / Propietario / Junta
          </h1>
          <p className="text-gray-600">{entity?.nombre}</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Datos Personales */}
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
              <CardDescription>
                Información del miembro de dirección o junta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cargo">Cargo / Posición *</Label>
                <Input
                  id="cargo"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Ej: Director, Presidente, Propietario, Vocal..."
                  required
                />
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
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+34 600 000 000"
                />
              </div>
            </CardContent>
          </Card>

          {/* Certificado de Penales */}
          <Card>
            <CardHeader>
              <CardTitle>Certificado de Penales</CardTitle>
              <CardDescription>
                Requisito obligatorio según LOPIVI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-300 rounded-lg">
                <p className="font-semibold text-purple-900 mb-2">Requisito Legal</p>
                <p className="text-sm text-purple-800">
                  Los miembros de dirección, junta y propietarios deben presentar el
                  <strong> Certificado Negativo del Registro Central de Delincuentes Sexuales</strong> vigente.
                </p>
              </div>

              <div className="flex items-start space-x-3 p-4 border-2 border-purple-200 rounded-lg">
                <Checkbox
                  id="penales"
                  checked={penales}
                  onCheckedChange={(checked) => setPenales(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="penales" className="cursor-pointer text-sm">
                  Declaro que he entregado el <strong>Certificado Negativo del Registro Central de
                  Delincuentes Sexuales</strong> vigente (menos de 3 meses) a mi entidad
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Responsabilidades y Compromisos */}
          <Card>
            <CardHeader>
              <CardTitle>Responsabilidades de Dirección</CardTitle>
              <CardDescription>
                Obligaciones según Ley LOPIVI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none text-sm">
                <h4 className="font-semibold text-gray-900">Como miembro de dirección, te comprometes a:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                  <li>
                    <strong>Garantizar el cumplimiento</strong> de todos los protocolos LOPIVI en la entidad
                  </li>
                  <li>
                    <strong>Asegurar la formación</strong> obligatoria de todo el personal que trabaja con menores
                  </li>
                  <li>
                    <strong>Verificar certificados de penales</strong> de todo el personal antes de comenzar su actividad
                  </li>
                  <li>
                    <strong>Aprobar y actualizar</strong> el Plan de Protección Infantil de la entidad
                  </li>
                  <li>
                    <strong>Proporcionar recursos</strong> necesarios para la protección efectiva de menores
                  </li>
                  <li>
                    <strong>Apoyar al delegado de protección</strong> en todas sus funciones y decisiones
                  </li>
                  <li>
                    <strong>Actuar inmediatamente</strong> ante cualquier sospecha o notificación de violencia
                  </li>
                  <li>
                    <strong>Mantener confidencialidad</strong> sobre casos y situaciones de protección
                  </li>
                  <li>
                    <strong>Rendir cuentas</strong> ante autoridades competentes cuando sea requerido
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
                <p className="font-semibold text-red-900 mb-2">Importante:</p>
                <p className="text-sm text-red-800">
                  El incumplimiento de las obligaciones LOPIVI por parte de la dirección puede conllevar
                  <strong> responsabilidad penal, civil y administrativa</strong>. La protección de menores
                  es una prioridad absoluta y no admite excepciones.
                </p>
              </div>

              <div className="flex items-start space-x-3 p-4 border-2 border-purple-500 rounded-lg bg-purple-50">
                <Checkbox
                  id="compromiso"
                  checked={compromisoEtico}
                  onCheckedChange={(checked) => setCompromisoEtico(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="compromiso" className="cursor-pointer text-sm">
                  <strong>He leído y acepto</strong> todas las obligaciones y responsabilidades de dirección
                  en materia de protección infantil según la Ley LOPIVI. Me comprometo a cumplir y hacer cumplir
                  todos los protocolos establecidos en la entidad.
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Documentación */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-blue-900 mb-3">
                Documentación que recibirás:
              </h4>
              <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                <li>Guía completa de responsabilidades de dirección LOPIVI</li>
                <li>Protocolo de actuación ante situaciones de riesgo</li>
                <li>Checklist de cumplimiento normativo</li>
                <li>Contactos de autoridades competentes</li>
                <li>Modelo de actas y documentación oficial</li>
              </ul>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={submitting || !compromisoEtico}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {submitting ? 'Guardando...' : 'Completar Registro'}
          </Button>

        </form>

      </div>
    </div>
  )
}
