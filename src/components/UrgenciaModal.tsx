'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface UrgenciaModalProps {
  isOpen: boolean
  onClose: () => void
  entityId: string
  userId: string
}

export default function UrgenciaModal({ isOpen, onClose, entityId, userId }: UrgenciaModalProps) {
  const [loading, setLoading] = useState(true)
  const [incidentTypes, setIncidentTypes] = useState<any[]>([])
  const [contacts, setContacts] = useState<any>({})

  // Form state
  const [selectedType, setSelectedType] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [currentIncident, setCurrentIncident] = useState<any>(null)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && entityId) {
      loadSetup()
    }
  }, [isOpen, entityId])

  const loadSetup = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/delegado/urgencia/setup?entityId=${entityId}`)
      if (res.ok) {
        const data = await res.json()
        setIncidentTypes(data.incidentTypes || [])
        setContacts(data.contactsByType || {})
      }
    } catch (error) {
      console.error('Error loading setup:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenIncident = async () => {
    if (!selectedType || !titulo) {
      setError('Selecciona un tipo y escribe un título')
      return
    }

    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/delegado/urgencia/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId,
          typeSlug: selectedType,
          titulo,
          descripcion,
          userId,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setCurrentIncident(data.incident)
        setCompletedSteps([])
      } else {
        setError(data.error || 'Error al abrir incidente')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const handleStepToggle = async (step: string) => {
    if (!currentIncident) return

    const isCompleted = completedSteps.includes(step)

    try {
      await fetch('/api/delegado/urgencia/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: currentIncident.id,
          step,
          completado: !isCompleted,
          userId,
        }),
      })

      if (isCompleted) {
        setCompletedSteps(completedSteps.filter(s => s !== step))
      } else {
        setCompletedSteps([...completedSteps, step])
      }
    } catch (error) {
      console.error('Error marking step:', error)
    }
  }

  const handleCloseIncident = async () => {
    if (!currentIncident) return

    const confirmed = confirm('¿Cerrar este incidente?')
    if (!confirmed) return

    try {
      await fetch('/api/delegado/urgencia/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: currentIncident.id,
          userId,
        }),
      })

      // Reset form
      setCurrentIncident(null)
      setSelectedType('')
      setTitulo('')
      setDescripcion('')
      setCompletedSteps([])

      alert('Incidente cerrado correctamente')
      onClose()
    } catch (error) {
      console.error('Error closing incident:', error)
    }
  }

  const handleReset = () => {
    setCurrentIncident(null)
    setSelectedType('')
    setTitulo('')
    setDescripcion('')
    setCompletedSteps([])
    setError('')
  }

  if (!isOpen) return null

  const selectedIncidentType = incidentTypes.find(t => t.slug === selectedType)
  const steps = selectedIncidentType?.pasos || []
  const recommendedContacts = selectedIncidentType?.contactos_recomendados || []

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <h2 className="text-2xl font-bold">PROTOCOLO DE URGENCIA</h2>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-white hover:bg-red-700">
            ✕ Cerrar
          </Button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : !currentIncident ? (
            /* Initial Form */
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>1. Selecciona el Tipo de Urgencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de incidente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {incidentTypes.map(type => (
                        <SelectItem key={type.slug} value={type.slug}>
                          <span className={`${type.prioridad === 'alta' ? 'text-red-600 font-bold' : ''}`}>
                            {type.titulo}
                            {type.prioridad === 'alta' && ' ⚠️'}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedIncidentType && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">{selectedIncidentType.descripcion}</p>
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Prioridad:</strong> {selectedIncidentType.prioridad}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedType && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>2. Describe el Incidente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Título del incidente *</Label>
                        <Input
                          value={titulo}
                          onChange={(e) => setTitulo(e.target.value)}
                          placeholder="Ej: Menor reporta situación en vestuario"
                        />
                      </div>
                      <div>
                        <Label>Descripción (opcional)</Label>
                        <textarea
                          value={descripcion}
                          onChange={(e) => setDescripcion(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                          rows={4}
                          placeholder="Detalles adicionales del incidente..."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleOpenIncident}
                    disabled={saving || !titulo}
                    className="w-full h-14 text-lg bg-red-600 hover:bg-red-700"
                  >
                    {saving ? 'Abriendo...' : '⚠️ Abrir Protocolo de Urgencia'}
                  </Button>
                </>
              )}
            </div>
          ) : (
            /* Active Incident */
            <div className="space-y-6">
              <Card className="border-red-500 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-900">
                    Incidente Abierto: {currentIncident.titulo}
                    </CardTitle>
                  <CardDescription className="text-red-800">
                    Tipo: {currentIncident.type?.titulo} • Prioridad: {currentIncident.prioridad}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Pasos a Seguir (en orden)</CardTitle>
                  <CardDescription>
                    Marca cada paso conforme lo completes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {steps.map((step: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleStepToggle(step)}
                      >
                        <input
                          type="checkbox"
                          checked={completedSteps.includes(step)}
                          onChange={() => {}}
                          className="mt-1 w-5 h-5 cursor-pointer"
                        />
                        <div className="flex-1">
                          <span className={`font-semibold ${completedSteps.includes(step) ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            Paso {index + 1}:
                          </span>
                          <p className={completedSteps.includes(step) ? 'line-through text-gray-500' : 'text-gray-700'}>
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Progreso:</strong> {completedSteps.length} / {steps.length} pasos completados
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Contacts */}
              {recommendedContacts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contactos Recomendados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recommendedContacts.map((tipo: string) => {
                        const contactsOfType = contacts[tipo] || []
                        return contactsOfType.map((contact: any) => (
                          <div key={contact.id || contact.nombre} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-semibold">{contact.nombre}</p>
                              <p className="text-sm text-gray-600">{tipo}</p>
                            </div>
                            <a
                              href={`tel:${contact.telefono}`}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                            >
                              📞 {contact.telefono}
                            </a>
                          </div>
                        ))
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleCloseIncident}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  ✓ Cerrar Incidente
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
