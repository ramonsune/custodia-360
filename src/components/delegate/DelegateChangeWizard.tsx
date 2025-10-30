'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

interface DelegateChangeWizardProps {
  entityId: string
  currentDelegateId: string | null
  currentDelegateName: string
  suplenteId: string | null
  suplenteName: string | null
  suplenteEmail: string | null
  suplenteFormado: boolean
  suplenteCertificado: boolean
  onComplete: () => void
  onCancel: () => void
}

type Step = 1 | 2 | 3 | 4

export function DelegateChangeWizard({
  entityId,
  currentDelegateId,
  currentDelegateName,
  suplenteId,
  suplenteName,
  suplenteEmail,
  suplenteFormado,
  suplenteCertificado,
  onComplete,
  onCancel
}: DelegateChangeWizardProps) {
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)

  // Paso 1: Motivo
  const [reason, setReason] = useState('')
  const [reasonDetails, setReasonDetails] = useState('')

  // Paso 2: Tipo de nuevo delegado
  const [incomingType, setIncomingType] = useState<'promoted_suplente' | 'new_person' | ''>('')

  // Paso 3: Datos nueva persona (si aplica)
  const [newPersonName, setNewPersonName] = useState('')
  const [newPersonEmail, setNewPersonEmail] = useState('')
  const [newPersonPhone, setNewPersonPhone] = useState('')

  // Paso 4: Confirmación
  const [confirmed, setConfirmed] = useState(false)

  const reasonOptions = [
    { value: 'voluntary_resignation', label: 'Baja voluntaria del delegado actual' },
    { value: 'dismissal', label: 'Despido/Cese del delegado actual' },
    { value: 'role_change', label: 'Cambio de rol interno (continúa en la entidad)' },
    { value: 'promotion', label: 'Promoción del delegado suplente' },
    { value: 'non_compliance', label: 'Incumplimiento normativo' },
    { value: 'other', label: 'Otro motivo' },
  ]

  const handleNext = () => {
    if (step === 1 && !reason) {
      alert('Por favor, selecciona un motivo')
      return
    }

    if (step === 2 && !incomingType) {
      alert('Por favor, selecciona el tipo de nuevo delegado')
      return
    }

    if (step === 3 && incomingType === 'new_person') {
      if (!newPersonName.trim() || !newPersonEmail.trim()) {
        alert('Por favor, completa nombre y email del nuevo delegado')
        return
      }
      if (!newPersonEmail.includes('@')) {
        alert('Por favor, ingresa un email válido')
        return
      }
    }

    // Si elige suplente, saltar paso 3 (no necesita llenar datos)
    if (step === 2 && incomingType === 'promoted_suplente') {
      setStep(4)
    } else if (step < 4) {
      setStep((step + 1) as Step)
    }
  }

  const handleBack = () => {
    // Si está en paso 4 y eligió suplente, volver a paso 2
    if (step === 4 && incomingType === 'promoted_suplente') {
      setStep(2)
    } else if (step > 1) {
      setStep((step - 1) as Step)
    }
  }

  const handleSubmit = async () => {
    if (!confirmed) {
      alert('Por favor, confirma que has leído y entiendes las implicaciones del cambio')
      return
    }

    setLoading(true)

    try {
      const sessionData = localStorage.getItem('userSession')
      if (!sessionData) {
        alert('Sesión no encontrada')
        return
      }

      const session = JSON.parse(sessionData)

      const response = await fetch('/api/delegate-change/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId,
          currentDelegateId,
          reason,
          reasonDetails,
          incomingType,
          incomingDelegateId: incomingType === 'promoted_suplente' ? suplenteId : null,
          incomingName: incomingType === 'new_person' ? newPersonName : suplenteName,
          incomingEmail: incomingType === 'new_person' ? newPersonEmail : suplenteEmail,
          incomingPhone: incomingType === 'new_person' ? newPersonPhone : '',
          requestedBy: session.user_id
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(
          incomingType === 'promoted_suplente'
            ? '✅ Transición completada.\n\nEl delegado suplente ha sido promovido a principal.'
            : '✅ Proceso iniciado.\n\nSe ha enviado invitación al nuevo delegado para completar su formación.\n\nTienes 30 días para completar el proceso.'
        )
        onComplete()
      } else {
        alert('Error: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">
                ¿Por qué motivo deseas cambiar al delegado principal?
              </Label>
              <RadioGroup value={reason} onValueChange={setReason} className="space-y-3">
                {reasonOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 border p-3 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer flex-1">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="reason-details">Detalles adicionales (opcional)</Label>
              <Textarea
                id="reason-details"
                value={reasonDetails}
                onChange={(e) => setReasonDetails(e.target.value)}
                placeholder="Proporciona más información sobre el motivo del cambio..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">
                ¿Quién será el nuevo delegado principal?
              </Label>

              <RadioGroup value={incomingType} onValueChange={(v) => setIncomingType(v as 'promoted_suplente' | 'new_person')} className="space-y-4">
                {/* Opción: Promover suplente */}
                {suplenteId && (
                  <div className="border-2 p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="promoted_suplente" id="suplente" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="suplente" className="cursor-pointer font-semibold text-base">
                          Promover al delegado suplente actual
                        </Label>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-700">→ {suplenteName}</p>
                          <p className="text-sm text-gray-600">→ {suplenteEmail}</p>
                          <div className="flex gap-2 mt-2">
                            {suplenteFormado && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                ✓ Formado LOPIVI
                              </span>
                            )}
                            {suplenteCertificado && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                ✓ Certificado vigente
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-blue-600 mt-2">
                            → <strong>Transición inmediata posible</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Opción: Nueva persona */}
                <div className="border-2 p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="new_person" id="new-person" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="new-person" className="cursor-pointer font-semibold text-base">
                        Designar a una nueva persona
                      </Label>
                      <div className="mt-2 space-y-1 text-sm text-gray-700">
                        <p>→ Deberá completar:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Formación LOPIVI (6 módulos + test)</li>
                          <li>Certificación de delegado</li>
                          <li>Entrega de certificado de penales</li>
                        </ul>
                        <p className="text-orange-600 mt-2">
                          → <strong>Proceso estimado: 5-7 días</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Datos del Nuevo Delegado</h4>
              <p className="text-sm text-blue-800">
                La persona recibirá un email con enlace para completar su formación y certificación.
              </p>
            </div>

            <div>
              <Label htmlFor="new-name">Nombre completo *</Label>
              <Input
                id="new-name"
                type="text"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                placeholder="Ej: Juan Pérez García"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="new-email">Email corporativo *</Label>
              <Input
                id="new-email"
                type="email"
                value={newPersonEmail}
                onChange={(e) => setNewPersonEmail(e.target.value)}
                placeholder="juan.perez@entidad.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="new-phone">Teléfono (opcional)</Label>
              <Input
                id="new-phone"
                type="tel"
                value={newPersonPhone}
                onChange={(e) => setNewPersonPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className="mt-1"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Importante:</strong> El nuevo delegado tendrá 30 días para completar su formación y certificación.
                Durante este periodo, el delegado actual mantendrá acceso al panel.
              </p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">Confirmación de Cambio de Delegado</h4>

              <div className="space-y-3 text-sm">
                <div className="border-b border-green-300 pb-2">
                  <p className="text-green-700 font-medium">Delegado Principal Actual:</p>
                  <p className="text-green-900">{currentDelegateName}</p>
                  <p className="text-green-700 text-xs mt-1">
                    Acceso hasta: {incomingType === 'promoted_suplente' ? 'Hoy (transición inmediata)' : 'Completar proceso (máx. 30 días)'}
                  </p>
                </div>

                <div className="border-b border-green-300 pb-2">
                  <p className="text-green-700 font-medium">Nuevo Delegado Principal:</p>
                  <p className="text-green-900">
                    {incomingType === 'promoted_suplente' ? suplenteName : newPersonName}
                  </p>
                  <p className="text-green-700 text-xs">
                    {incomingType === 'promoted_suplente' ? suplenteEmail : newPersonEmail}
                  </p>
                  <p className="text-green-700 text-xs mt-1">
                    Acceso desde: {incomingType === 'promoted_suplente' ? 'Hoy (transición inmediata)' : 'Tras completar formación'}
                  </p>
                </div>

                <div>
                  <p className="text-green-700 font-medium">Motivo del cambio:</p>
                  <p className="text-green-900">
                    {reasonOptions.find(r => r.value === reason)?.label}
                  </p>
                  {reasonDetails && (
                    <p className="text-green-700 text-xs mt-1">Detalles: {reasonDetails}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-900 font-semibold mb-2">⚠️ Importante:</p>
              <ul className="list-disc list-inside text-sm text-orange-800 space-y-1">
                <li>{currentDelegateName} perderá acceso al panel de delegado principal</li>
                <li>Se enviará notificación a todos los miembros de la entidad</li>
                <li>Se generará registro completo en auditoría LOPIVI</li>
                {incomingType === 'new_person' && (
                  <>
                    <li>El nuevo delegado recibirá email con enlace de formación</li>
                    <li>Tendrá 30 días para completar formación y certificación</li>
                  </>
                )}
                {incomingType === 'promoted_suplente' && (
                  <li>El puesto de delegado suplente quedará vacante</li>
                )}
              </ul>
            </div>

            <div className="flex items-start space-x-3 border-2 border-blue-500 rounded-lg p-4">
              <Checkbox
                id="confirm"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="confirm" className="cursor-pointer text-sm">
                He leído y entiendo las implicaciones de este cambio. Confirmo que deseo proceder con la transición del delegado de protección.
              </Label>
            </div>
          </div>
        )
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Cambio de Delegado Principal
        </CardTitle>
        <CardDescription>
          Paso {step} de 4
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Indicador de pasos */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((s) => {
              const isActive = s === step
              const isCompleted = s < step

              // Si eligió suplente, ocultar paso 3
              if (s === 3 && incomingType === 'promoted_suplente') {
                return null
              }

              return (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    isActive ? 'bg-blue-600 text-white' :
                    isCompleted ? 'bg-green-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? '✓' : s}
                  </div>
                  {s < 4 && incomingType !== 'promoted_suplente' && (
                    <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                  )}
                  {s === 2 && incomingType === 'promoted_suplente' && (
                    <div className={`flex-1 h-1 mx-2 ${isCompleted || step >= 4 ? 'bg-green-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Contenido del paso */}
        <div className="mb-6">
          {renderStep()}
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between gap-3">
          <div>
            {step > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={loading}
              >
                ← Volver
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              disabled={loading}
            >
              Cancelar
            </Button>

            {step < 4 ? (
              <Button onClick={handleNext} disabled={loading}>
                Siguiente →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !confirmed}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Procesando...' : 'Confirmar Cambio'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
