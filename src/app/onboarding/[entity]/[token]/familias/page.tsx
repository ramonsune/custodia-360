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

interface Child {
  nombre: string
  nacimiento: string
  curso_grupo: string
  alergias: string
  permiso_imagenes: boolean
}

export default function OnboardingFamilias() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [entity, setEntity] = useState<EntityInfo | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Datos del adulto
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')

  // Hijos
  const [children, setChildren] = useState<Child[]>([
    { nombre: '', nacimiento: '', curso_grupo: '', alergias: '', permiso_imagenes: false }
  ])

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

  const addChild = () => {
    setChildren([
      ...children,
      { nombre: '', nacimiento: '', curso_grupo: '', alergias: '', permiso_imagenes: false }
    ])
  }

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index))
  }

  const updateChild = (index: number, field: keyof Child, value: any) => {
    const updated = [...children]
    updated[index] = { ...updated[index], [field]: value }
    setChildren(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre || !apellidos || !email) {
      alert('Por favor, completa tus datos personales')
      return
    }

    // Validar que al menos un hijo tenga nombre
    const validChildren = children.filter(c => c.nombre.trim() !== '')

    if (validChildren.length === 0) {
      alert('Por favor, añade al menos un hijo/a')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId,
          tipo: 'familia',
          nombre,
          apellidos,
          email,
          telefono,
          sector_code: entity?.sector_code,
          children: validChildren
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle className="text-green-600">¡Registro Completado!</CardTitle>
              <CardDescription>
                Tus datos y los de tu familia han sido guardados correctamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                <p className="text-green-900 font-semibold mb-2">
                  Gracias por completar el registro familiar
                </p>
                <p className="text-sm text-green-800">
                  Recibirás un email de confirmación con toda la información sobre protocolos
                  y documentación para familias.
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Familias / Tutores Legales
          </h1>
          <p className="text-gray-600">{entity?.nombre}</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Datos del Adulto */}
          <Card>
            <CardHeader>
              <CardTitle>Tus Datos (Padre/Madre/Tutor)</CardTitle>
              <CardDescription>
                Información de contacto del adulto responsable
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
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+34 600 000 000"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Hijos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Información de Hijos/as</CardTitle>
                  <CardDescription>
                    Añade los datos de cada menor participante
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={addChild}
                  variant="outline"
                  size="sm"
                >
                  + Añadir Hijo/a
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {children.map((child, index) => (
                <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">
                      Hijo/a {index + 1}
                    </h4>
                    {children.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeChild(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300"
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre completo *</Label>
                      <Input
                        value={child.nombre}
                        onChange={(e) => updateChild(index, 'nombre', e.target.value)}
                        placeholder="Nombre y apellidos"
                      />
                    </div>
                    <div>
                      <Label>Fecha de nacimiento</Label>
                      <Input
                        type="date"
                        value={child.nacimiento}
                        onChange={(e) => updateChild(index, 'nacimiento', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Curso / Grupo / Categoría</Label>
                    <Input
                      value={child.curso_grupo}
                      onChange={(e) => updateChild(index, 'curso_grupo', e.target.value)}
                      placeholder="Ej: 3º Primaria, Benjamín, Grupo A..."
                    />
                  </div>

                  <div>
                    <Label>Alergias, medicación o información médica relevante</Label>
                    <Input
                      value={child.alergias}
                      onChange={(e) => updateChild(index, 'alergias', e.target.value)}
                      placeholder="Ej: Alergia a frutos secos, Asma..."
                    />
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Checkbox
                      id={`permiso-${index}`}
                      checked={child.permiso_imagenes}
                      onCheckedChange={(checked) =>
                        updateChild(index, 'permiso_imagenes', checked as boolean)
                      }
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`permiso-${index}`}
                      className="cursor-pointer text-sm text-blue-900"
                    >
                      <strong>Autorizo</strong> el uso de imágenes de mi hijo/a en actividades de la entidad
                      (redes sociales, web, material promocional) cumpliendo la normativa de protección de datos
                    </Label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Información */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-green-900 mb-3">
                Información para Familias:
              </h4>
              <ul className="text-sm text-green-800 space-y-2 list-disc list-inside">
                <li>Recibirás comunicaciones sobre actividades y protocolos de seguridad</li>
                <li>Se te informará de cualquier situación relevante que afecte a tus hijos/as</li>
                <li>Puedes actualizar esta información contactando con la entidad</li>
                <li>Toda la información es confidencial y protegida según LOPD</li>
              </ul>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {submitting ? 'Guardando...' : 'Completar Registro Familiar'}
          </Button>

        </form>

      </div>
    </div>
  )
}
